import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PayrollRecord } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { IndianRupee, ShieldCheck, Download, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';

interface CompensationCardProps {
  payroll: PayrollRecord | null;
  onDownloadSlip?: () => void;
}

export const CompensationCard: React.FC<CompensationCardProps> = ({ payroll, onDownloadSlip }) => {
  if (!payroll) {
    return (
      <Card className="p-8 text-center border-slate-200">
        <p className="text-sm text-slate-500">No payroll record found for current billing cycle.</p>
      </Card>
    );
  }

  const totalAllowances: number = Object.values(payroll.allowances).reduce<number>((a, b) => a + Number(b || 0), 0);
  const totalDeductions: number = Object.values(payroll.deductions).reduce<number>((a, b) => a + Number(b || 0), 0);

  return (
    <Card className="shadow-xs border-slate-200/80 overflow-hidden">
      <CardHeader className="bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <CardTitle>My Compensation Breakdown</CardTitle>
            <Badge variant={payroll.status === 'paid' ? 'success' : 'warning'} size="sm">
              {payroll.status.toUpperCase()}
            </Badge>
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Pay Period: <strong className="text-slate-800">{payroll.pay_period}</strong> (Disbursement: {formatDate(payroll.payment_date)})
          </span>
        </div>

        {onDownloadSlip && (
          <Button size="sm" variant="outline" onClick={onDownloadSlip} leftIcon={<Download className="w-3.5 h-3.5" />}>
            Download Payslip
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Big Net Salary Hero Block */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Net Monthly Payout (Take Home)
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
              {formatCurrency(payroll.net_salary, payroll.currency)}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-2">
              <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
              <span>{payroll.payment_method}</span>
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
            <span className="text-xs text-slate-400 block">Gross Earnings</span>
            <span className="font-mono text-lg font-bold text-emerald-400">
              {formatCurrency(payroll.base_salary + totalAllowances, payroll.currency)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Deductions: {formatCurrency(totalDeductions, payroll.currency)}
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Earnings / Allowances */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Earnings & Allowances</h4>
              <span className="font-mono text-xs font-bold text-emerald-700">
                +{formatCurrency(payroll.base_salary + totalAllowances, payroll.currency)}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Salary</span>
                <span className="font-mono font-medium text-slate-900">{formatCurrency(payroll.base_salary, payroll.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Housing Allowance</span>
                <span className="font-mono font-medium text-slate-900">{formatCurrency(payroll.allowances.housing, payroll.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transport Allowance</span>
                <span className="font-mono font-medium text-slate-900">{formatCurrency(payroll.allowances.transport, payroll.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Medical Coverage</span>
                <span className="font-mono font-medium text-slate-900">{formatCurrency(payroll.allowances.medical, payroll.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Performance Bonus</span>
                <span className="font-mono font-medium text-slate-900">{formatCurrency(payroll.allowances.performance, payroll.currency)}</span>
              </div>
            </div>
          </div>

          {/* Deductions & Taxes */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Deductions & Withholdings</h4>
              <span className="font-mono text-xs font-bold text-rose-700">
                -{formatCurrency(totalDeductions, payroll.currency)}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Federal & State Income Tax</span>
                <span className="font-mono font-medium text-slate-900">{formatCurrency(payroll.deductions.tax, payroll.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Provident / Retirement Fund (401k)</span>
                <span className="font-mono font-medium text-slate-900">{formatCurrency(payroll.deductions.provident_fund, payroll.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Health & Dental Premium</span>
                <span className="font-mono font-medium text-slate-900">{formatCurrency(payroll.deductions.health_insurance, payroll.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Read-Only Notice Footer */}
        <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 flex items-center gap-2.5 text-xs text-indigo-900">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            Employee compensation records are authoritative and encrypted. For tax adjustments or bank details updates, contact People Operations.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
