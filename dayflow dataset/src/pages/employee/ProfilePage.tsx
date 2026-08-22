import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { employeeService, payrollService } from '../../services/api';
import { PayrollRecord } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  IndianRupee, 
  ShieldCheck, 
  Save 
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [payroll, setPayroll] = useState<PayrollRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
      setAddress(user.address || '');
      payrollService.getEmployeePayroll(user.id).then(setPayroll);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await employeeService.updateProfile(user.id, {
        phone: phone.trim(),
        address: address.trim()
      });
      await refreshUser();
      success('Profile Updated', 'Your contact information was saved successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      error('Update Failed', message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Profile Header Hero Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/10 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center ring-4 ring-white/10">
              {user.full_name.charAt(0)}
            </div>
          )}

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{user.full_name}</h1>
              <Badge variant="neutral" size="sm" className="bg-white/10 text-white border-white/20">
                {user.employee_id}
              </Badge>
              <Badge variant="success" size="sm" dot>
                Active
              </Badge>
            </div>

            <p className="text-sm text-indigo-200 mt-1 font-medium">
              {user.job_title} • {user.department}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 mt-4">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                Mode: <strong className="capitalize text-white ml-0.5">{user.work_mode}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Joined: {formatDate(user.joining_date)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Profile Grid: Editable Info & Job Organization Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editable Contact Info Form */}
        <Card className="lg:col-span-2 shadow-xs border-slate-200/80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-indigo-600" />
              <CardTitle>Personal Contact Information</CardTitle>
            </div>
            <span className="text-xs text-slate-500 font-medium">Self-service editable fields</span>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Full Legal Name (HR Authoritative)
                  </label>
                  <input
                    type="text"
                    value={user.full_name}
                    disabled
                    className="w-full text-xs font-medium bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Corporate Email (SSO Managed)
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full text-xs font-medium bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  leftIcon={<Phone className="w-4 h-4" />}
                />

                <Input
                  label="Residential Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, State, ZIP"
                  leftIcon={<MapPin className="w-4 h-4" />}
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Last updated: Today
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Contact Details
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Organization & Manager Card */}
        <div className="space-y-6">
          <Card className="shadow-xs border-slate-200/80 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              Employment Details
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Department</span>
                <span className="font-semibold text-slate-900">{user.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Reporting Manager</span>
                <span className="font-semibold text-slate-900">{user.manager_name || 'Sarah Jenkins (People Ops)'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Employment Status</span>
                <span className="font-semibold text-emerald-700">Full-Time Regular</span>
              </div>
              <div>
                <span className="text-slate-500 block">Work Mode</span>
                <span className="font-semibold capitalize text-slate-900">{user.work_mode}</span>
              </div>
            </div>
          </Card>

          {/* Read-Only Salary Structure Snapshot */}
          <Card className="shadow-xs border-slate-200/80 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Compensation</span>
              </div>
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>

            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Base Salary</span>
                <span className="font-mono font-semibold text-slate-900">{formatCurrency(payroll?.base_salary || 7500)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Net</span>
                <span className="font-mono font-bold text-emerald-700">{formatCurrency(payroll?.net_salary || 6670)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              Authorized by HR & Payroll Operations. Encrypted record.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
