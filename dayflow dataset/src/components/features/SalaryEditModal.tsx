import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { PayrollRecord, PayrollStatus } from '../../types';
import { payrollService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../lib/utils';

interface SalaryEditModalProps {
  payroll: PayrollRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SalaryEditModal: React.FC<SalaryEditModalProps> = ({
  payroll,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();

  const [baseSalary, setBaseSalary] = useState<number>(0);
  const [housing, setHousing] = useState<number>(0);
  const [transport, setTransport] = useState<number>(0);
  const [medical, setMedical] = useState<number>(0);
  const [performance, setPerformance] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [providentFund, setProvidentFund] = useState<number>(0);
  const [status, setStatus] = useState<PayrollStatus>('processing');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (payroll) {
      setBaseSalary(payroll.base_salary);
      setHousing(payroll.allowances.housing);
      setTransport(payroll.allowances.transport);
      setMedical(payroll.allowances.medical);
      setPerformance(payroll.allowances.performance);
      setTax(payroll.deductions.tax);
      setProvidentFund(payroll.deductions.provident_fund);
      setStatus(payroll.status);
    }
  }, [payroll]);

  if (!payroll) return null;

  const totalAllowances = housing + transport + medical + performance;
  const totalDeductions = tax + providentFund + payroll.deductions.health_insurance;
  const calculatedNet = baseSalary + totalAllowances - totalDeductions;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await payrollService.updatePayroll(payroll.id, {
        base_salary: baseSalary,
        allowances: {
          housing,
          transport,
          medical,
          performance
        },
        deductions: {
          tax,
          provident_fund: providentFund,
          health_insurance: payroll.deductions.health_insurance
        },
        status
      });

      success('Payroll updated successfully', `Adjusted compensation for ${payroll.employee_name}.`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update salary';
      error('Update Error', message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Employee Compensation"
      description={`Editing salary structure for ${payroll.employee_name} (${payroll.job_title})`}
      maxWidth="lg"
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Base Monthly Salary (₹)"
            value={baseSalary}
            onChange={(e) => setBaseSalary(Number(e.target.value))}
            required
            min={0}
          />
          <Select
            label="Disbursement Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as PayrollStatus)}
          >
            <option value="processing">Processing</option>
            <option value="paid">Paid (Disbursed)</option>
            <option value="pending">Pending Review</option>
          </Select>
        </div>

        {/* Allowances Breakdown */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Allowances & Bonuses</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <Input
              type="number"
              label="Housing"
              value={housing}
              onChange={(e) => setHousing(Number(e.target.value))}
              min={0}
            />
            <Input
              type="number"
              label="Transport"
              value={transport}
              onChange={(e) => setTransport(Number(e.target.value))}
              min={0}
            />
            <Input
              type="number"
              label="Medical"
              value={medical}
              onChange={(e) => setMedical(Number(e.target.value))}
              min={0}
            />
            <Input
              type="number"
              label="Performance"
              value={performance}
              onChange={(e) => setPerformance(Number(e.target.value))}
              min={0}
            />
          </div>
        </div>

        {/* Deductions Breakdown */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Deductions & Withholding</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              label="Tax Withholding (₹)"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
              min={0}
            />
            <Input
              type="number"
              label="Provident / PF Fund (₹)"
              value={providentFund}
              onChange={(e) => setProvidentFund(Number(e.target.value))}
              min={0}
            />
          </div>
        </div>

        {/* Live Net Calculation Preview */}
        <div className="p-4 bg-indigo-900 text-white rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider block">Calculated Net Payout</span>
            <div className="font-mono text-2xl font-bold">{formatCurrency(calculatedNet, payroll.currency)}</div>
          </div>
          <div className="text-right text-xs text-indigo-200">
            <div>Gross: {formatCurrency(baseSalary + totalAllowances)}</div>
            <div>Deductions: {formatCurrency(totalDeductions)}</div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSaving}>
            Save Compensation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
