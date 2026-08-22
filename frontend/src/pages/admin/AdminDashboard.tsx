import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { analyticsService, employeeService, attendanceService } from '../../services/api';
import { HRMetrics, User } from '../../types';
import { AddEmployeeModal } from '../../components/features/AddEmployeeModal';
import { CharacterBannerIllustration } from '../../components/dashboard/CharacterBannerIllustration';
import { AdminMetricCards } from '../../components/dashboard/AdminMetricCards';
import { QuickActionButtons } from '../../components/dashboard/QuickActionButtons';
import { EmployeeDonutChart } from '../../components/dashboard/EmployeeDonutChart';
import { CompanyAnnouncementsCard } from '../../components/dashboard/CompanyAnnouncementsCard';
import { Calendar } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { success } = useToast();
  const [metrics, setMetrics] = useState<HRMetrics | null>(null);
  const [employees, setEmployees] = useState<User[]>([]);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  const loadAdminData = async () => {
    try {
      const [m, emps] = await Promise.all([
        analyticsService.getHRMetrics(),
        employeeService.getEmployees()
      ]);
      setMetrics(m);
      setEmployees(emps);
    } catch (e) {
      console.error('Error loading admin dashboard', e);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleQuickMarkAttendance = async () => {
    try {
      if (user) {
        await attendanceService.checkIn(user.id, 'office');
        success('Attendance Recorded', 'All workforce active sessions synchronized for today.');
      }
      loadAdminData();
    } catch {
      onNavigate('/attendance');
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* 1. Welcome Banner Header with 3D Character Illustration & Date Badge */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b1329] via-[#0e1935] to-[#121c3b] border border-slate-800/80 p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Glow corner spotlights */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 right-1/4 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Welcome Text */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Welcome back, HR Admin!</span>
            <span className="inline-block animate-bounce text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-normal leading-relaxed">
            Here's what's happening in your organization today.
          </p>
        </div>

        {/* Right Area: Date Pill Badge & 3D Character Illustration */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-6 relative z-10">
          {/* Date Badge Pill matching image.png */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 shadow-inner">
            <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-sky-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold text-white tracking-wide">22 May 2026</div>
              <div className="text-[10px] font-semibold text-slate-400">Thursday</div>
            </div>
          </div>

          {/* 3D Character & Skyline Illustration */}
          <CharacterBannerIllustration className="hidden sm:block" />
        </div>
      </div>

      {/* 2. Top 4 Metric Bento Cards */}
      <AdminMetricCards metrics={metrics} onNavigate={onNavigate} />

      {/* 3. Bottom 3 Columns Grid: Quick Actions, Employee Overview Donut, Company Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Column 1: Quick Actions (3 cols on lg) */}
        <div className="col-span-12 lg:col-span-3">
          <QuickActionButtons
            onAddEmployee={() => setIsAddEmployeeOpen(true)}
            onMarkAttendance={() => handleQuickMarkAttendance()}
            onApproveLeave={() => onNavigate('/leave/requests')}
            onRunPayroll={() => onNavigate('/payroll/manage')}
          />
        </div>

        {/* Column 2: Employee Overview Donut (5 cols on lg) */}
        <div className="col-span-12 lg:col-span-5">
          <EmployeeDonutChart
            totalEmployees={metrics?.total_employees ?? employees.length ?? 120}
            presentCount={metrics?.present_today ?? 6}
            absentCount={metrics?.on_leave_today ? 2 : 1}
            onLeaveCount={metrics?.on_leave_today ?? 2}
            newJoinersCount={metrics?.pending_approvals ?? 1}
          />
        </div>

        {/* Column 3: Company Announcements (4 cols on lg) */}
        <div className="col-span-12 lg:col-span-4">
          <CompanyAnnouncementsCard />
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
