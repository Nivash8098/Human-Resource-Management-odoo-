import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  CheckCircle2, 
  Save, 
  Lock,
  Globe,
  Repeat
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const { success } = useToast();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [shiftReminders, setShiftReminders] = useState(true);
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      success('Settings Saved', 'Your system preferences have been updated.');
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
            Preferences & Configuration
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="text-xs text-slate-500 font-medium">User Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure notification preferences, timezones, enterprise security, and demo personas.
        </p>
      </div>

      {/* Persona Role Switcher Card */}
      <Card className="p-5 shadow-xs border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">Current Role Mode</span>
              <Badge variant="primary" size="sm">
                {role === 'hr_admin' ? 'HR / ADMIN' : 'EMPLOYEE'}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Switch roles on the fly to inspect both Employee personal views and HR operations management.
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              const newRole = role === 'hr_admin' ? 'employee' : 'hr_admin';
              switchRole(newRole);
              success('Role Switched', `Switched to ${newRole === 'hr_admin' ? 'HR Admin' : 'Employee'} mode.`);
            }}
            leftIcon={<Repeat className="w-4 h-4" />}
          >
            Switch to {role === 'hr_admin' ? 'Employee' : 'HR Admin'}
          </Button>
        </div>
      </Card>

      {/* Notifications & Schedule Preferences */}
      <Card className="shadow-xs border-slate-200/80">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <CardTitle>Notification & Alert Preferences</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Email Notifications</span>
                  <span className="text-[11px] text-slate-500">Receive instant email updates for leave decisions and payroll receipts.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Workday Pulse Reminders</span>
                  <span className="text-[11px] text-slate-500">Prompt daily check-in reminders at the start of your shift.</span>
                </div>
                <input
                  type="checkbox"
                  checked={shiftReminders}
                  onChange={(e) => setShiftReminders(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </label>
            </div>

            <div className="pt-2">
              <Select
                label="Primary Timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="America/Los_Angeles">Pacific Standard Time (PST - San Francisco)</option>
                <option value="America/New_York">Eastern Standard Time (EST - New York)</option>
                <option value="Europe/London">Greenwich Mean Time (GMT - London)</option>
                <option value="Asia/Singapore">Singapore Standard Time (SST - Singapore)</option>
              </Select>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="primary" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                Save Preferences
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Backend & Architecture Health */}
      <Card className="shadow-xs border-slate-200/80 p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Data & Service Layer Status</h3>
          </div>
          <Badge variant="success" size="sm" dot>
            Service Layer Ready
          </Badge>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Dayflow frontend consumes domain endpoints through a clean, typed service abstraction layer (<code className="text-indigo-600 font-mono">src/services/api.ts</code>), fully compatible with Supabase PostgreSQL, Row Level Security (RLS), and Realtime webhooks.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Authentication Engine</span>
            <span className="font-semibold text-slate-900">Supabase Auth + JWT Context</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Security Boundary</span>
            <span className="font-semibold text-slate-900">PostgreSQL Row-Level Security</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
