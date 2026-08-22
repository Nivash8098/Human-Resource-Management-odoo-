import { PayrollRecord } from '../../types';
import { getSupabase, isSupabaseConfigured } from '../supabase';
import { store } from '../store';
import { authBackendService } from './auth.service';
import { authorization } from './authorization';
import { validation } from './validation';
import { DayflowError } from './errors';

export const payrollBackendService = {
  /**
   * Calculates net salary from base, allowances, and deductions
   */
  computeNetSalary(
    baseSalary: number,
    allowances: { housing: number; transport: number; medical: number; performance: number },
    deductions: { tax: number; provident_fund: number; health_insurance: number }
  ): number {
    const totalAllowances =
      (allowances.housing || 0) +
      (allowances.transport || 0) +
      (allowances.medical || 0) +
      (allowances.performance || 0);

    const totalDeductions =
      (deductions.tax || 0) +
      (deductions.provident_fund || 0) +
      (deductions.health_insurance || 0);

    return Math.max(0, baseSalary + totalAllowances - totalDeductions);
  },

  /**
   * Retrieve payroll for single employee with strict isolation
   */
  async getEmployeePayroll(employeeId: string): Promise<PayrollRecord | null> {
    const caller = await authBackendService.getCurrentUser();
    authorization.assertCanAccessEmployee(caller, employeeId);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('payroll')
          .select('*')
          .eq('employee_id', employeeId)
          .maybeSingle();

        if (data && !error) {
          return data as PayrollRecord;
        }
      } catch (err) {
        console.warn('[Dayflow Payroll] Remote fetch fallback:', err);
      }
    }

    const record = store.getEmployeePayroll(employeeId);
    return record || null;
  },

  async getMyPayroll(): Promise<PayrollRecord | null> {
    const caller = await authBackendService.getCurrentUser();
    return this.getEmployeePayroll(caller.id);
  },

  async getPayrollByEmployee(employeeId: string): Promise<PayrollRecord | null> {
    return this.getEmployeePayroll(employeeId);
  },

  /**
   * Retrieve all employee payrolls (HR/Admin only)
   */
  async getAllPayrolls(): Promise<PayrollRecord[]> {
    const caller = await authBackendService.getCurrentUser();
    authorization.requireHROrAdmin(caller);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('payroll')
          .select('*')
          .order('employee_name', { ascending: true });

        if (data && !error && data.length > 0) {
          return data as PayrollRecord[];
        }
      } catch (err) {
        console.warn('[Dayflow Payroll] Remote all payrolls fallback:', err);
      }
    }

    return store.getPayrolls();
  },

  async getAllPayroll(): Promise<PayrollRecord[]> {
    return this.getAllPayrolls();
  },

  /**
   * Create payroll record (HR only)
   */
  async createPayroll(data: PayrollRecord): Promise<PayrollRecord> {
    const caller = await authBackendService.getCurrentUser();
    authorization.requireHROrAdmin(caller);

    validation.validateSalaryPositive(data.base_salary, 'base_salary');
    const net = this.computeNetSalary(data.base_salary, data.allowances, data.deductions);
    const completeData: PayrollRecord = {
      ...data,
      net_salary: net,
      last_updated: new Date().toISOString().split('T')[0]
    };

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: created, error } = await supabase
          .from('payroll')
          .insert([completeData])
          .select('*')
          .single();

        if (created && !error) {
          return created as PayrollRecord;
        }
      } catch (err) {
        console.warn('[Dayflow Payroll] Remote create fallback:', err);
      }
    }

    return completeData;
  },

  /**
   * Update payroll record (HR only)
   */
  async updatePayroll(payrollId: string, updates: Partial<PayrollRecord>): Promise<PayrollRecord> {
    const caller = await authBackendService.getCurrentUser();
    authorization.requireHROrAdmin(caller);

    const existing = store.getPayrolls().find((p) => p.id === payrollId);
    if (!existing) {
      throw new DayflowError('NOT_FOUND', 'Payroll record not found.');
    }

    const baseSalary = updates.base_salary !== undefined
      ? validation.validateSalaryPositive(updates.base_salary, 'base_salary')
      : existing.base_salary;

    const allowances = updates.allowances || existing.allowances;
    const deductions = updates.deductions || existing.deductions;
    const net = this.computeNetSalary(baseSalary, allowances, deductions);

    const calculatedUpdates: Partial<PayrollRecord> = {
      ...updates,
      base_salary: baseSalary,
      allowances,
      deductions,
      net_salary: net,
      last_updated: new Date().toISOString().split('T')[0]
    };

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('payroll')
          .update({ ...calculatedUpdates, updated_at: new Date().toISOString() })
          .eq('id', payrollId)
          .select('*')
          .single();

        if (data && !error) {
          store.updatePayroll(payrollId, calculatedUpdates);
          return data as PayrollRecord;
        }
      } catch (err) {
        console.warn('[Dayflow Payroll] Remote update fallback:', err);
      }
    }

    return store.updatePayroll(payrollId, calculatedUpdates);
  }
};
