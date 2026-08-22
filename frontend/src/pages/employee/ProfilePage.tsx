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
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-[#0c162d] via-[#111f3d] to-[#0c162d] border border-blue-900/40 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/10 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-blue-600 text-white font-extrabold text-3xl flex items-center justify-center ring-4 ring-white/10">
              {user.full_name.charAt(0)}
            </div>
          )}

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{user.full_name}</h1>
              <Badge variant="neutral" size="sm" className="bg-white/10 text-white border-white/20">
                {user.employee_id}
              </Badge>
              <Badge variant="success" size="sm" dot>
                Active
              </Badge>
            </div>

            <p className="text-sm text-sky-200 mt-1 font-medium">
              {user.job_title} • {user.department}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 mt-4">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                Mode: <strong className="capitalize text-white ml-0.5">{user.work_mode}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                Joined: {formatDate(user.joining_date)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Profile Grid: Editable Info & Job Organization Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editable Contact Info Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-sky-400" />
              <CardTitle>Personal Contact Information</CardTitle>
            </div>
            <span className="text-xs text-slate-400 font-medium">Self-service editable fields</span>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Full Legal Name (HR Authoritative)
                  </label>
                  <input
                    type="text"
                    value={user.full_name}
                    disabled
                    className="w-full text-xs font-medium bg-[#0a101f] border border-slate-800 rounded-lg px-3.5 py-2 text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Corporate Email (SSO Managed)
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full text-xs font-medium bg-[#0a101f] border border-slate-800 rounded-lg px-3.5 py-2 text-slate-400 cursor-not-allowed"
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

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
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
          <Card className="p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800">
              Employment Details
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Department</span>
                <span className="font-semibold text-white">{user.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Reporting Manager</span>
                <span className="font-semibold text-white">{user.manager_name || 'Sarah Jenkins (People Ops)'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Employment Status</span>
                <span className="font-semibold text-emerald-400">Full-Time Regular</span>
              </div>
              <div>
                <span className="text-slate-400 block">Work Mode</span>
                <span className="font-semibold capitalize text-white">{user.work_mode}</span>
              </div>
            </div>
          </Card>

          {/* Read-Only Salary Structure Snapshot */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Compensation</span>
              </div>
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            </div>

            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Base Salary</span>
                <span className="font-mono font-semibold text-slate-200">{formatCurrency(payroll?.base_salary || 7500)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Net</span>
                <span className="font-mono font-bold text-emerald-400">{formatCurrency(payroll?.net_salary || 6670)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              Authorized by HR & Payroll Operations. Encrypted record.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
