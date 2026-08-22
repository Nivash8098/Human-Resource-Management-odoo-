import { User } from '../../frontend/src/types';
import { getSupabase, isSupabaseConfigured } from '../../frontend/src/services/supabase';
import { store } from '../../frontend/src/services/store';
import { authBackendService } from './auth.service';
import { authorization } from './authorization';
import { validation } from './validation';
import { DayflowError } from './errors';

export const employeeBackendService = {
  /**
   * Retrieves full employee directory
   */
  async getEmployees(): Promise<User[]> {
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('full_name', { ascending: true });

        if (data && !error && data.length > 0) {
          return data as User[];
        }
      } catch (err) {
        console.warn('[Dayflow Employee] Directory fetch fallback:', err);
      }
    }
    return store.getUsers();
  },

  /**
   * Retrieves single employee record by ID or employee_id
   */
  async getEmployeeById(id: string): Promise<User | null> {
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`id.eq.${id},employee_id.eq.${id}`)
          .single();

        if (data && !error) {
          return data as User;
        }
      } catch (err) {
        console.warn('[Dayflow Employee] Fetch single fallback:', err);
      }
    }
    const user = store.getUserById(id) || store.getUsers().find((u) => u.employee_id === id);
    return user || null;
  },

  /**
   * Get employee profile with authorization check
   */
  async getEmployeeProfile(targetId: string): Promise<User> {
    const caller = await authBackendService.getCurrentUser();
    authorization.assertCanAccessEmployee(caller, targetId);
    
    const emp = await this.getEmployeeById(targetId);
    if (!emp) {
      throw new DayflowError('NOT_FOUND', 'Employee record not found.');
    }
    return emp;
  },

  /**
   * Update employee profile (Self-Service or HR)
   */
  async updateEmployee(id: string, rawUpdates: Partial<User>): Promise<User> {
    const caller = await authBackendService.getCurrentUser();
    const isHR = authorization.isHROrAdmin(caller);

    // If caller is regular employee, sanitize restricted fields
    const updates = isHR
      ? { ...rawUpdates }
      : authorization.sanitizeEmployeeProfileUpdates(caller, id, rawUpdates);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select('*')
          .single();

        if (data && !error) {
          store.updateUser(id, data as Partial<User>);
          return data as User;
        }
      } catch (err) {
        console.warn('[Dayflow Employee] Remote update fallback:', err);
      }
    }

    return store.updateUser(id, updates);
  },

  /**
   * Create new employee (HR only)
   */
  async createEmployee(data: User): Promise<User> {
    const caller = await authBackendService.getCurrentUser();
    authorization.requireHROrAdmin(caller);

    validation.validateEmail(data.email);
    if (data.employee_id) {
      validation.validateEmployeeId(data.employee_id);
    }

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: created, error } = await supabase
          .from('profiles')
          .insert([data])
          .select('*')
          .single();

        if (created && !error) {
          store.createUser(created as User);
          return created as User;
        }
      } catch (err) {
        console.warn('[Dayflow Employee] Remote create fallback:', err);
      }
    }

    return store.createUser(data);
  },

  /**
   * Deactivate an employee (HR only)
   */
  async deactivateEmployee(id: string): Promise<User> {
    const caller = await authBackendService.getCurrentUser();
    authorization.requireHROrAdmin(caller);

    return this.updateEmployee(id, { status: 'inactive' });
  }
};
