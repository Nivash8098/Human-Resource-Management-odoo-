import React, { useState, useEffect } from 'react';
import { payrollService } from '../../services/api';
import { PayrollRecord } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { SalaryEditModal } from '../../components/features/SalaryEditModal';
import { formatCurrency, formatDate } from '../../lib/utils';
import { IndianRupee, Edit3, Search, CreditCard, ShieldCheck, Download } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PayrollManagePage: React.FC = () => {
  const { success } = useToast();
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadPayrollData = async () => {
    try {
      const list = await payrollService.getAllPayrolls();
      setPayrolls(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPayrollData();
  }, []);

  const filtered = payrolls.filter((p) =>
    p.employee_name.toLowerCase().includes(search.toLowerCase()) ||
    p.job_title.toLowerCase().includes(search.toLowerCase())
  );

  const totalMonthlyOutlay = payrolls.reduce((sum, p) => sum + p.net_salary, 0);
  const totalBase = payrolls.reduce((sum, p) => sum + p.base_salary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-sky-400 uppercase">
              Financial Administration
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-400 font-medium">Payroll Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Payroll & Compensation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage organization compensation, update allowances, adjust tax withholdings, and disburse payouts.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => success('Payroll export generated', 'Disbursement register CSV saved.')}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export Payroll Register
        </Button>
      </div>

      {/* Outlay Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-[#0c162d] via-[#111f3d] to-[#0c162d] border border-blue-900/40 text-white shadow-xl">
          <span className="text-xs uppercase font-bold text-sky-400">Total Net Monthly Outlay</span>
          <div className="text-3xl font-extrabold font-mono mt-1 text-white">
            {formatCurrency(totalMonthlyOutlay)}
          </div>
          <span className="text-xs text-slate-300 mt-1 block">Monthly disbursements across workforce</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs uppercase font-bold text-slate-400">Gross Monthly Base</span>
          <div className="text-3xl font-extrabold font-mono mt-1 text-white">
            {formatCurrency(totalBase)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">{payrolls.length} active salary structures</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs uppercase font-bold text-slate-400">Billing Cycle Status</span>
          <div className="text-2xl font-bold font-sans mt-1 text-emerald-400 flex items-center gap-2">
            <span>August 2026</span>
            <Badge variant="success" size="sm" dot>Disbursed</Badge>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Scheduled on 31st of every month</span>
        </Card>
      </div>

      {/* Search Input */}
      <Card className="p-3.5">
        <Input
          placeholder="Search by employee name or job title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
        />
      </Card>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-400" />
            <CardTitle>Workforce Compensation List ({filtered.length})</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080e1c] border-y border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Employee</th>
                  <th className="py-3 px-4 sm:px-6">Base Salary</th>
                  <th className="py-3 px-4 sm:px-6">Allowances</th>
                  <th className="py-3 px-4 sm:px-6">Deductions</th>
                  <th className="py-3 px-4 sm:px-6">Net Take-Home</th>
                  <th className="py-3 px-4 sm:px-6">Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {filtered.map((item) => {
                  const allowancesTotal: number = Object.values(item.allowances).reduce<number>((a, b) => a + Number(b || 0), 0);
                  const deductionsTotal: number = Object.values(item.deductions).reduce<number>((a, b) => a + Number(b || 0), 0);

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div>
                          <span className="font-bold text-white block">{item.employee_name}</span>
                          <span className="text-[11px] text-slate-400">{item.job_title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-200">
                        {formatCurrency(item.base_salary, item.currency)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-emerald-400">
                        +{formatCurrency(allowancesTotal, item.currency)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-rose-400">
                        -{formatCurrency(deductionsTotal, item.currency)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-white">
                        {formatCurrency(item.net_salary, item.currency)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <Badge
                          variant={item.status === 'paid' ? 'success' : 'warning'}
                          size="sm"
                          dot
                        >
                          {item.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedPayroll(item);
                            setIsEditModalOpen(true);
                          }}
                          leftIcon={<Edit3 className="w-3.5 h-3.5 text-sky-400" />}
                        >
                          Adjust
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Salary Adjustment Modal */}
      <SalaryEditModal
        payroll={selectedPayroll}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPayroll(null);
        }}
        onSuccess={loadPayrollData}
      />
    </div>
  );
};
