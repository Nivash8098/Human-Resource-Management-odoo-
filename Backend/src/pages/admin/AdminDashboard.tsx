import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PeoplePulse } from '../../components/features/PeoplePulse';
import { ActionCenter } from '../../components/features/ActionCenter';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AddEmployeeModal } from '../../components/features/AddEmployeeModal';
import { 
  analyticsService, 
  employeeService, 
  leaveService 
} from '../../services/api';
import { HRMetrics, ActionCenterItem, User } from '../../types';
import { 
  Users, 
  UserCheck, 
  CalendarOff, 
  Clock, 
  Plus, 
  ArrowRight, 
  Building2,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<HRMetrics | null>(null);
  const [actionItems, setActionItems] = useState<ActionCenterItem[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  const loadAdminData = async () => {
    try {
      const [m, a, emps] = await Promise.all([
        analyticsService.getHRMetrics(),
        analyticsService.getActionCenterItems(),
        employeeService.getEmployees()
      ]);
      setMetrics(m);
      setActionItems(a);
      setEmployees(emps);
    } catch (e) {
      console.error('Error loading admin dashboard', e);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Department distribution
  const departmentCounts: Record<string, number> = {};
  employees.forEach((emp) => {
    departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
              Operations Headquarters
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500 font-medium">Enterprise Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            HR Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Realtime workforce health, active approvals, time-tracking anomalies, and headcount.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/reports')}
            leftIcon={<TrendingUp className="w-4 h-4 text-indigo-600" />}
          >
            Analytics & Reports
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddEmployeeOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Signature PEOPLE PULSE Component */}
      <PeoplePulse metrics={metrics} />

      {/* 4 High Level Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={`${metrics?.total_employees ?? 6} Members`}
          change="+1 this month"
          trend="up"
          description="100% Onboarded & Verified"
          icon={<Users className="w-5 h-5 text-indigo-600" />}
          onClick={() => onNavigate('/employees')}
        />

        <StatCard
          title="Present Today"
          value={`${metrics?.present_today ?? 5} Active`}
          change="96% Attendance"
          trend="up"
          description="3 Office • 2 Remote"
          icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
          onClick={() => onNavigate('/attendance')}
        />

        <StatCard
          title="On Scheduled Leave"
          value={`${metrics?.on_leave_today ?? 1} Member`}
          change="Approved"
          trend="neutral"
          description="Returns on Monday"
          icon={<CalendarOff className="w-5 h-5 text-amber-600" />}
          onClick={() => onNavigate('/leave/requests')}
        />

        <StatCard
          title="Pending HR Approvals"
          value={`${metrics?.pending_approvals ?? 2} Requests`}
          change="Action required"
          trend="up"
          description="Leave & Profile Reviews"
          icon={<Clock className="w-5 h-5 text-rose-600" />}
          onClick={() => onNavigate('/leave/requests')}
        />
      </div>

      {/* Signature Action Center & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Center Triage Module */}
        <div className="lg:col-span-2">
          <ActionCenter items={actionItems} onNavigate={onNavigate} />
        </div>

        {/* Department Distribution & Quick Shortcuts */}
        <div className="space-y-6">
          <Card className="shadow-xs border-slate-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Workforce By Department</h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-900">{employees.length} Total</span>
            </div>

            <div className="space-y-2.5">
              {Object.entries(departmentCounts).map(([dept, count]) => (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{dept}</span>
                    <span className="font-mono text-slate-900 font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${(count / (employees.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('/employees')}
              className="w-full text-xs font-semibold mt-2"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Employee Directory
            </Button>
          </Card>
        </div>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onSuccess={loadAdminData}
      />
    </div>
  );
};
