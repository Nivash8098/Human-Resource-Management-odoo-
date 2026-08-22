import React, { useState, useEffect } from 'react';
import { employeeService, attendanceService, leaveService, payrollService, documentService } from '../../services/api';
import { User, AttendanceRecord, LeaveBalance, LeaveRequest, PayrollRecord, DocumentItem } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { SalaryEditModal } from '../../components/features/SalaryEditModal';
import { formatCurrency, formatDate, formatTime, formatDuration } from '../../lib/utils';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Edit3, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';

interface EmployeeDetailPageProps {
  employeeId: string;
  onNavigate: (route: string) => void;
}

export const EmployeeDetailPage: React.FC<EmployeeDetailPageProps> = ({ employeeId, onNavigate }) => {
  const [employee, setEmployee] = useState<User | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [payroll, setPayroll] = useState<PayrollRecord | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const emp = await employeeService.getEmployeeById(employeeId);
      if (emp) {
        setEmployee(emp);
        const [att, bal, reqs, pay, docs] = await Promise.all([
          attendanceService.getHistory(emp.id),
          leaveService.getBalance(emp.id),
          leaveService.getMyRequests(emp.id),
          payrollService.getEmployeePayroll(emp.id),
          documentService.getDocuments(emp.id)
        ]);
        setAttendance(att);
        setLeaveBalance(bal);
        setLeaveRequests(reqs);
        setPayroll(pay);
        setDocuments(docs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [employeeId]);

  if (!employee) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Loading workforce member profile...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'attendance', label: `Attendance (${attendance.length})` },
    { id: 'leave', label: `Leave & Time Off (${leaveRequests.length})` },
    { id: 'payroll', label: 'Compensation & Payroll' },
    { id: 'documents', label: `Documents (${documents.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Back Navigation Bar */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate('/employees')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Directory
        </button>
      </div>

      {/* Hero Header Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {employee.avatar_url ? (
              <img
                src={employee.avatar_url}
                alt={employee.full_name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/10 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center ring-4 ring-white/10">
                {employee.full_name.charAt(0)}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl font-extrabold tracking-tight">{employee.full_name}</h1>
                <Badge variant="neutral" size="sm" className="bg-white/10 text-white border-white/20">
                  {employee.employee_id}
                </Badge>
                <Badge variant="success" size="sm" dot>
                  {employee.status.toUpperCase()}
                </Badge>
              </div>

              <p className="text-sm text-indigo-200 mt-1">
                {employee.job_title} • {employee.department}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 mt-3">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  {employee.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  {employee.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsSalaryModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Adjust Salary
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 shadow-xs border-slate-200/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              Employment Details
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Department</span>
                <span className="font-semibold text-slate-900">{employee.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Job Title</span>
                <span className="font-semibold text-slate-900">{employee.job_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Designated Role</span>
                <span className="font-semibold uppercase text-slate-900">{employee.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Work Mode</span>
                <span className="font-semibold capitalize text-slate-900">{employee.work_mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Joining Date</span>
                <span className="font-semibold text-slate-900">{formatDate(employee.joining_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reporting Manager</span>
                <span className="font-semibold text-slate-900">{employee.manager_name || 'Sarah Jenkins'}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 shadow-xs border-slate-200/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              Compensation Snapshot
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Base Salary</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(payroll?.base_salary || 7500)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Net Monthly Payout</span>
                <span className="font-mono font-bold text-emerald-700">{formatCurrency(payroll?.net_salary || 6670)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Disbursement Status</span>
                <Badge variant="success" size="sm">
                  {payroll?.status.toUpperCase() || 'PAID'}
                </Badge>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsSalaryModalOpen(true)}
                  leftIcon={<Edit3 className="w-3.5 h-3.5 text-indigo-600" />}
                >
                  Modify Compensation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Attendance */}
      {activeTab === 'attendance' && (
        <Card className="shadow-xs border-slate-200/80">
          <CardHeader>
            <CardTitle>Attendance Log</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200/80 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6">In</th>
                    <th className="py-3 px-6">Out</th>
                    <th className="py-3 px-6">Duration</th>
                    <th className="py-3 px-6">Mode</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendance.map((rec) => (
                    <tr key={rec.id}>
                      <td className="py-3.5 px-6 font-semibold">{formatDate(rec.date)}</td>
                      <td className="py-3.5 px-6 font-mono">{formatTime(rec.check_in)}</td>
                      <td className="py-3.5 px-6 font-mono">{rec.check_out ? formatTime(rec.check_out) : '—'}</td>
                      <td className="py-3.5 px-6 font-mono font-bold">{formatDuration(rec.duration_minutes)}</td>
                      <td className="py-3.5 px-6 capitalize">{rec.work_mode}</td>
                      <td className="py-3.5 px-6">
                        <Badge variant={rec.status === 'present' ? 'success' : 'warning'} size="sm">
                          {rec.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Leave */}
      {activeTab === 'leave' && (
        <Card className="shadow-xs border-slate-200/80">
          <CardHeader>
            <CardTitle>Time-Off Requests ({leaveRequests.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200/80 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-6">Type</th>
                    <th className="py-3 px-6">Duration</th>
                    <th className="py-3 px-6">Dates</th>
                    <th className="py-3 px-6">Reason</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaveRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="py-3.5 px-6 font-bold uppercase">{req.leave_type}</td>
                      <td className="py-3.5 px-6 font-mono font-bold">{req.days} Days</td>
                      <td className="py-3.5 px-6">{formatDate(req.start_date)} – {formatDate(req.end_date)}</td>
                      <td className="py-3.5 px-6 text-slate-600">{req.reason}</td>
                      <td className="py-3.5 px-6">
                        <Badge variant={req.status === 'approved' ? 'success' : req.status === 'pending' ? 'warning' : 'danger'} size="sm">
                          {req.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Compensation & Payroll */}
      {activeTab === 'payroll' && payroll && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex justify-between items-center">
            <div>
              <span className="text-xs text-indigo-300 font-bold uppercase">Net Monthly Take-Home</span>
              <div className="text-3xl font-extrabold font-mono mt-1">{formatCurrency(payroll.net_salary)}</div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSalaryModalOpen(true)}
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              Adjust Compensation
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-700">Earnings</h4>
              <div className="text-xs flex justify-between"><span>Base</span><span className="font-mono">{formatCurrency(payroll.base_salary)}</span></div>
              <div className="text-xs flex justify-between"><span>Housing</span><span className="font-mono">{formatCurrency(payroll.allowances.housing)}</span></div>
              <div className="text-xs flex justify-between"><span>Transport</span><span className="font-mono">{formatCurrency(payroll.allowances.transport)}</span></div>
              <div className="text-xs flex justify-between"><span>Medical</span><span className="font-mono">{formatCurrency(payroll.allowances.medical)}</span></div>
            </Card>

            <Card className="p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-700">Deductions</h4>
              <div className="text-xs flex justify-between"><span>Tax</span><span className="font-mono text-rose-600">{formatCurrency(payroll.deductions.tax)}</span></div>
              <div className="text-xs flex justify-between"><span>Provident Fund</span><span className="font-mono text-rose-600">{formatCurrency(payroll.deductions.provident_fund)}</span></div>
              <div className="text-xs flex justify-between"><span>Insurance</span><span className="font-mono text-rose-600">{formatCurrency(payroll.deductions.health_insurance)}</span></div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 5: Documents */}
      {activeTab === 'documents' && (
        <Card className="shadow-xs border-slate-200/80">
          <CardHeader>
            <CardTitle>Compliance Documents ({documents.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200/80 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-6">Title</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Size</th>
                    <th className="py-3 px-6">Uploaded</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="py-3.5 px-6 font-bold">{doc.title}</td>
                      <td className="py-3.5 px-6">{doc.category}</td>
                      <td className="py-3.5 px-6 font-mono">{doc.file_size}</td>
                      <td className="py-3.5 px-6">{formatDate(doc.uploaded_at)}</td>
                      <td className="py-3.5 px-6"><Badge variant="success" size="sm">{doc.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Salary Edit Modal */}
      <SalaryEditModal
        payroll={payroll}
        isOpen={isSalaryModalOpen}
        onClose={() => setIsSalaryModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
