import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { payrollService } from '../../services/api';
import { PayrollRecord } from '../../types';
import { CompensationCard } from '../../components/features/CompensationCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';
import { IndianRupee, Download, History, FileText, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export const PayrollPage: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [payroll, setPayroll] = useState<PayrollRecord | null>(null);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    payrollService.getEmployeePayroll(user.id).then(setPayroll);
  }, [user]);

  const handleDownloadSlip = () => {
    setIsSlipModalOpen(true);
  };

  const handlePrintOrSave = () => {
    success('Payslip Downloaded', `Payslip for ${payroll?.pay_period || 'August 2026'} saved to your device.`);
    setIsSlipModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-sky-400 uppercase">
              Financial Transparency
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-400 font-medium">Encrypted Direct Deposit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            My Compensation & Payroll
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Read-only breakdown of your base salary, allowances, statutory deductions, and net payout.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleDownloadSlip}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Download August Payslip
        </Button>
      </div>

      {/* Main Authoritative Compensation Breakdown Card */}
      <CompensationCard payroll={payroll} onDownloadSlip={handleDownloadSlip} />

      {/* Historical Payroll Statements Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-sky-400" />
            <CardTitle>Disbursement History</CardTitle>
          </div>
          <span className="text-xs text-slate-400 font-medium">All historical statements</span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080e1c] border-y border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Pay Period</th>
                  <th className="py-3 px-4 sm:px-6">Disbursement Date</th>
                  <th className="py-3 px-4 sm:px-6">Gross Pay</th>
                  <th className="py-3 px-4 sm:px-6">Deductions</th>
                  <th className="py-3 px-4 sm:px-6">Net Take-Home</th>
                  <th className="py-3 px-4 sm:px-6">Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Statement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-white">
                    August 2026
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-300">
                    {formatDate('2026-08-31')}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-200">
                    {formatCurrency(8600)}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-rose-400">
                    -{formatCurrency(1930)}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-sky-400">
                    {formatCurrency(6670)}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6">
                    <Badge variant="success" size="sm" dot>Disbursed</Badge>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDownloadSlip}
                      leftIcon={<FileText className="w-3.5 h-3.5 text-sky-400" />}
                    >
                      PDF
                    </Button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-white">
                    July 2026
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-300">
                    {formatDate('2026-07-31')}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-200">
                    {formatCurrency(8600)}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-rose-400">
                    -{formatCurrency(1930)}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-sky-400">
                    {formatCurrency(6670)}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6">
                    <Badge variant="success" size="sm" dot>Disbursed</Badge>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDownloadSlip}
                      leftIcon={<FileText className="w-3.5 h-3.5 text-sky-400" />}
                    >
                      PDF
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Official Payslip Preview Modal */}
      <Modal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        title="Official Payslip Statement"
        description="Nexora HR Payroll Operations • Authorized Document"
        maxWidth="lg"
      >
        <div className="p-6 bg-[#0a101f] rounded-xl border border-slate-800 space-y-6 font-sans">
          {/* Statement Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-800">
            <div>
              <div className="font-extrabold text-xl tracking-tight text-white">NEXORA HR</div>
              <div className="text-xs text-slate-400">Global People Operations</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-white uppercase">Pay Statement</div>
              <div className="text-xs text-slate-400 font-mono">Period: {payroll?.pay_period || 'August 2026'}</div>
            </div>
          </div>

          {/* Employee & Bank Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Employee:</span>
              <strong className="text-white">{user?.full_name} ({user?.employee_id})</strong>
              <div className="text-slate-300">{user?.job_title} • {user?.department}</div>
            </div>
            <div>
              <span className="text-slate-400 block">Disbursement Method:</span>
              <strong className="text-white">{payroll?.payment_method || 'Chase Bank (••• 8842)'}</strong>
              <div className="text-slate-300">Disbursed on {payroll ? formatDate(payroll.payment_date) : 'Aug 31, 2026'}</div>
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="p-4 bg-[#121c30] rounded-lg border border-slate-700/80 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-300">Base Salary</span>
              <span className="font-mono text-slate-200">{formatCurrency(payroll?.base_salary || 7500)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Allowances (Housing, Transport, Medical)</span>
              <span className="font-mono text-emerald-400">+{formatCurrency(1100)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Statutory Tax & 401k Withholdings</span>
              <span className="font-mono text-rose-400">-{formatCurrency(1930)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-700 font-bold text-sm text-white">
              <span>Total Net Payout</span>
              <span className="font-mono text-sky-400">{formatCurrency(payroll?.net_salary || 6670)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Digital Signature Verified: Nexora Finance Controller (NX-AUTH-88912)</span>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsSlipModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrintOrSave} leftIcon={<Download className="w-4 h-4" />}>
            Download PDF
          </Button>
        </div>
      </Modal>
    </div>
  );
};
