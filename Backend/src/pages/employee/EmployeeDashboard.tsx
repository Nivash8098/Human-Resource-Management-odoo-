import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { WorkdayPulse } from '../../components/features/WorkdayPulse';
import { LeaveRequestModal } from '../../components/features/LeaveRequestModal';
import { 
  attendanceService, 
  leaveService, 
  payrollService, 
  activityService 
} from '../../services/api';
import { 
  AttendanceRecord, 
  LeaveBalance, 
  LeaveRequest, 
  PayrollRecord, 
  ActivityItem,
  WorkMode
} from '../../types';
import { 
  Clock, 
  Plus, 
  ArrowRight,
  Sparkles,
  Building2,
  Home,
  Laptop,
  CheckCircle2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Umbrella,
  IndianRupee,
  FileText,
  User,
  Upload,
  AlertCircle,
  Coffee,
  Check
} from 'lucide-react';
import { formatTime, formatCurrency } from '../../lib/utils';

interface EmployeeDashboardProps {
  onNavigate: (route: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [payroll, setPayroll] = useState<PayrollRecord | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [workMode, setWorkMode] = useState<WorkMode>('office');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Calendar month state
  const [currentDate] = useState(new Date(2026, 7, 22)); // August 22, 2026

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      const [rec, bal, reqs, pay, acts] = await Promise.all([
        attendanceService.getTodayRecord(user.id),
        leaveService.getBalance(user.id),
        leaveService.getMyRequests(user.id),
        payrollService.getEmployeePayroll(user.id),
        activityService.getActivities(user.id)
      ]);
      setTodayRecord(rec);
      if (rec?.work_mode) {
        setWorkMode(rec.work_mode);
      }
      setLeaveBalance(bal);
      setPendingRequests(reqs.filter((r) => r.status === 'pending'));
      setPayroll(pay);
      setActivities(acts);
    } catch (e) {
      console.error('Error loading employee dashboard data', e);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const totalRemainingLeave = leaveBalance
    ? leaveBalance.paid.remaining + leaveBalance.sick.remaining
    : 12;

  const totalTotalLeave = leaveBalance
    ? leaveBalance.paid.total + leaveBalance.sick.total
    : 18;

  // Calendar Days generator for August 2026 (starts on Saturday Aug 1)
  const daysInMonth = 31;
  const startDayOfWeek = 6; // Saturday
  const calendarDays = [];
  // Empty slots for previous month padding
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  return (
    <div className="space-y-6 max-w-[1540px] mx-auto pb-10">
      {/* Header Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">
              Employee Workspace
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              {user?.department || 'Engineering'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Good morning, {user?.full_name?.split(' ')[0] || 'Alex'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's your workday at a glance. Every workday, perfectly aligned.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/attendance')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all"
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Attendance Logs</span>
          </button>
          <button
            type="button"
            onClick={() => setIsLeaveModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm transition-all shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Time Off</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Workday Pulse, Stat Cards, Work Mode, Upcoming & Promo */}
        <div className="lg:col-span-8 space-y-6">
          {/* Signature WORKDAY PULSE Component */}
          <WorkdayPulse 
            initialRecord={todayRecord} 
            workMode={workMode}
            onStatusChange={loadDashboardData} 
          />

          {/* 4 Metric Stat Cards from screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* 1. Attendance (This Month) */}
            <div 
              onClick={() => onNavigate('/attendance')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300/80 transition-all shadow-2xs cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Attendance</span>
                <span className="text-[11px] font-semibold text-slate-400">This Month</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  18 <span className="text-sm font-semibold text-slate-400">/ 22 days</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>12% vs last month</span>
                </div>
              </div>
              {/* Mini Emerald Sparkline Wave */}
              <div className="mt-3 pt-2">
                <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 25" fill="none">
                  <path
                    d="M 0 20 Q 20 5, 40 15 T 70 8 T 100 4"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 0 20 Q 20 5, 40 15 T 70 8 T 100 4 L 100 25 L 0 25 Z"
                    fill="url(#emerald-fade)"
                    opacity="0.25"
                  />
                  <defs>
                    <linearGradient id="emerald-fade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* 2. Leave Balance (Available) */}
            <div 
              onClick={() => onNavigate('/leave')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300/80 transition-all shadow-2xs cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Leave Balance</span>
                <span className="text-[11px] font-semibold text-slate-400">Available</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {totalRemainingLeave} <span className="text-sm font-semibold text-slate-400">days</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-400 mt-1">
                  of {totalTotalLeave} days
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-5">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                    style={{ width: `${(totalRemainingLeave / totalTotalLeave) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 3. Pending Requests (Needs Approval) */}
            <div 
              onClick={() => onNavigate('/leave')}
              className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#FFE7CC] hover:border-[#FFCC99] transition-all shadow-2xs cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C4A00]">Pending Requests</span>
                <span className="text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                  Needs Approval
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-[#6B3300] tracking-tight">
                  {pendingRequests.length || 1} <span className="text-sm font-semibold text-[#B45309]">request</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#D97706] mt-3 group-hover:translate-x-0.5 transition-transform">
                  <span>View details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* 4. Next Payroll (Pay Date) */}
            <div 
              onClick={() => onNavigate('/payroll')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300/80 transition-all shadow-2xs cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Next Payroll</span>
                <span className="text-[11px] font-semibold text-slate-400">Pay Date</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  Aug 31, 2026
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 mt-2 bg-blue-50/80 w-fit px-2.5 py-1 rounded-lg">
                  <Clock className="w-3 h-3" />
                  <span>In 9 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Work Mode Bar from screenshot */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Work Mode:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWorkMode('office')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    workMode === 'office'
                      ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                      : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Office</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkMode('remote')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    workMode === 'remote'
                      ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                      : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Remote</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkMode('hybrid')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    workMode === 'hybrid'
                      ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                      : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Hybrid</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Checked in via Office Network (HQ-Bangalore)</span>
            </div>
          </div>

          {/* Bottom Dual Row: Upcoming & Stay Focused Promo Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Events Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-900">Upcoming</h3>
                  <button
                    type="button"
                    onClick={() => onNavigate('/leave')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>View Calendar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3.5 pt-4">
                  {/* Event 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                      <CalendarIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">Independence Day</span>
                        <span className="text-[10.5px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          Holiday
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Aug 15, 2026 · Saturday</p>
                    </div>
                  </div>

                  {/* Event 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">Next Payroll Date</span>
                        <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          In 9 days
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Aug 31, 2026 · Direct Deposit</p>
                    </div>
                  </div>

                  {/* Event 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">Your Leave (Pending)</span>
                        <span className="text-[10.5px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          Pending
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Sep 02, 2026 · 1 Day (Casual)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stay Focused Promo Banner with Workspace Art */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#0F172A] text-white relative overflow-hidden flex flex-col justify-between shadow-sm">
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-[11px] font-bold tracking-wide uppercase backdrop-blur-sm mb-3">
                  <Sparkles className="w-3 h-3 text-indigo-300" />
                  <span>Workplace Productivity</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-snug">
                  Stay focused. Stay productive.
                </h3>
                <p className="text-xs text-indigo-200/90 mt-2 leading-relaxed max-w-[280px]">
                  Take frequent 5-minute stretch breaks. Hydrate well and wrap up your key priorities for the week.
                </p>
              </div>

              {/* Workspace Vector Art */}
              <div className="relative z-10 mt-6 pt-2 flex items-end justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200">
                  <Coffee className="w-4 h-4 text-indigo-300" />
                  <span>Break time: 03:30 PM</span>
                </div>

                <div className="w-24 h-16 relative shrink-0">
                  <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    {/* Desk */}
                    <rect x="10" y="60" width="100" height="4" rx="2" fill="#818CF8" opacity="0.8" />
                    {/* Laptop base & screen */}
                    <rect x="35" y="38" width="40" height="22" rx="2" fill="#C7D2FE" />
                    <rect x="37" y="40" width="36" height="18" rx="1" fill="#4338CA" />
                    <path d="M30 60 L80 60" stroke="#E0E7FF" strokeWidth="2" strokeLinecap="round" />
                    {/* Plant */}
                    <path d="M90 60 L90 50 Q96 46 98 40 Q94 48 90 50 Q84 46 82 40 Q86 48 90 50" stroke="#34D399" strokeWidth="2" fill="#10B981" />
                    <rect x="86" y="52" width="8" height="8" rx="1" fill="#D97706" />
                    {/* Coffee mug */}
                    <rect x="20" y="50" width="8" height="10" rx="1" fill="#F43F5E" />
                    <path d="M28 52 C31 52 31 56 28 56" stroke="#F43F5E" strokeWidth="1.5" fill="none" />
                    {/* Steam */}
                    <path d="M23 46 Q24 43 23 40" stroke="#FDA4AF" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Mini Calendar, Recent Activity, Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mini Calendar Widget (Dark Navy Card from screenshot) */}
          <div className="p-6 rounded-3xl bg-[#0B132B] text-white shadow-xl shadow-slate-900/10">
            {/* Month Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white tracking-wide">
                August 2026
              </h3>
              <div className="flex items-center gap-1">
                <button type="button" className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button type="button" className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-500 py-3">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarDays.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="h-8" />;
                }
                const isToday = day === 22;
                const isLeave = day === 28;
                const isHoliday = day === 15;
                const isPastPresent = day < 22 && day % 7 !== 0 && day % 7 !== 1 && day !== 15;

                return (
                  <div
                    key={`day-${day}`}
                    className={`h-8 flex flex-col items-center justify-center rounded-xl font-medium transition-all relative ${
                      isToday
                        ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-600/40 ring-2 ring-blue-400'
                        : isHoliday
                        ? 'text-amber-400 font-bold hover:bg-slate-800'
                        : isLeave
                        ? 'text-purple-400 font-bold hover:bg-slate-800'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <span>{day}</span>
                    {/* Status dot below day */}
                    {!isToday && isPastPresent && (
                      <span className="w-1 h-1 rounded-full bg-emerald-400 absolute bottom-1" />
                    )}
                    {isHoliday && (
                      <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1" />
                    )}
                    {isLeave && (
                      <span className="w-1 h-1 rounded-full bg-purple-400 absolute bottom-1" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Calendar Status Legend */}
            <div className="pt-4 mt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Leave</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Holiday</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>Absent</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Recent Activity</h3>
              <button
                type="button"
                onClick={() => onNavigate('/notifications')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                View All
              </button>
            </div>

            <div className="space-y-4 pt-4">
              {/* Activity 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900">Checked In</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Today, 08:30 AM · Office</p>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                  <Umbrella className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900">Leave Approved</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Paid leave for Aug 28, 2026</p>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 border border-purple-100">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900">Payslip Generated</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">July 2026 payslip ready</p>
                </div>
              </div>

              {/* Activity 4 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900">Checked Out</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Yesterday, 06:15 PM · 8h 45m</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions 2x2 Grid */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4">Quick Actions</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Action 1: Apply for Leave */}
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(true)}
                className="p-4 rounded-2xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-100 flex flex-col items-center justify-center text-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Umbrella className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Apply for Leave</span>
              </button>

              {/* Action 2: View Payslip */}
              <button
                type="button"
                onClick={() => onNavigate('/payroll')}
                className="p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-100 flex flex-col items-center justify-center text-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">View Payslip</span>
              </button>

              {/* Action 3: Update Profile */}
              <button
                type="button"
                onClick={() => onNavigate('/profile')}
                className="p-4 rounded-2xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-100 flex flex-col items-center justify-center text-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Update Profile</span>
              </button>

              {/* Action 4: Upload Document */}
              <button
                type="button"
                onClick={() => onNavigate('/documents')}
                className="p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-100 flex flex-col items-center justify-center text-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Upload Document</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSuccess={loadDashboardData}
      />
    </div>
  );
};

