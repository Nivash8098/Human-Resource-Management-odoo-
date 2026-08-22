import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { HRMetrics } from '../../types';
import { Users, UserCheck, CalendarOff, Clock } from 'lucide-react';

interface PeoplePulseProps {
  metrics: HRMetrics | null;
  isLoading?: boolean;
}

export const PeoplePulse: React.FC<PeoplePulseProps> = ({ metrics }) => {
  const attendanceRate = metrics?.attendance_rate ?? 96;
  const workforceAvailability = metrics?.workforce_availability ?? 92;
  const presentToday = metrics?.present_today ?? 5;
  const onLeaveToday = metrics?.on_leave_today ?? 1;
  const pendingApprovals = metrics?.pending_approvals ?? 2;
  const totalEmployees = metrics?.total_employees ?? 6;

  return (
    <Card className="p-6 sm:p-8 bg-gradient-to-br from-white via-indigo-50/15 to-white border-indigo-100/80 shadow-sm relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute right-0 top-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
              Organization Health
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-xs text-slate-500 font-medium">Realtime Metrics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            PEOPLE PULSE
            <Badge variant="success" dot size="sm">
              Operational
            </Badge>
          </h2>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-100">
          Total Workforce: <strong className="text-slate-900 font-bold ml-1">{totalEmployees} Members</strong>
        </div>
      </div>

      {/* Primary 4 Metric Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 py-6">
        {/* Attendance Rate */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Rate</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {attendanceRate}%
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${attendanceRate}%` }} />
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">{presentToday} of {totalEmployees} present</span>
        </div>

        {/* Workforce Availability */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Availability</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {workforceAvailability}%
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${workforceAvailability}%` }} />
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Active working capacity</span>
        </div>

        {/* Employees On Leave */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">On Leave</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CalendarOff className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {onLeaveToday}
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(onLeaveToday / totalEmployees) * 100}%` }} />
            </div>
          </div>
          <span className="text-[11px] text-amber-700 font-medium mt-2 block">Scheduled absence</span>
        </div>

        {/* Pending Approvals */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Approvals</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {pendingApprovals}
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, pendingApprovals * 25)}%` }} />
            </div>
          </div>
          <span className="text-[11px] text-rose-600 font-medium mt-2 block">Requires HR action</span>
        </div>
      </div>

      {/* Workforce Deployment Distribution Bar */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
          <span className="font-semibold text-slate-700">Today's Workforce Deployment</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              Office ({presentToday - 2})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Remote / Hybrid (2)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Leave ({onLeaveToday})
            </span>
          </div>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full flex overflow-hidden">
          <div className="h-full bg-indigo-600" style={{ width: `${((presentToday - 2) / totalEmployees) * 100}%` }} />
          <div className="h-full bg-sky-400" style={{ width: `${(2 / totalEmployees) * 100}%` }} />
          <div className="h-full bg-amber-400" style={{ width: `${(onLeaveToday / totalEmployees) * 100}%` }} />
        </div>
      </div>
    </Card>
  );
};
