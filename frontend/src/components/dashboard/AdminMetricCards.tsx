import React from 'react';
import { Users, UserCheck, UserX, Award, ArrowUp } from 'lucide-react';
import { HRMetrics } from '../../types';

interface AdminMetricCardsProps {
  metrics: HRMetrics | null;
  onNavigate: (route: string) => void;
}

export const AdminMetricCards: React.FC<AdminMetricCardsProps> = ({ metrics, onNavigate }) => {
  const total = metrics?.total_employees ?? 120;
  const present = metrics?.present_today ?? 98;
  const absent = metrics ? Math.max(0, total - present) : 22;
  const presentPct = total > 0 ? ((present / total) * 100).toFixed(1) : '81.7';
  const absentPct = total > 0 ? ((absent / total) * 100).toFixed(1) : '18.3';
  const attendanceRate = metrics?.attendance_rate ?? 98.5;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Employees */}
      <div
        onClick={() => onNavigate('/employees')}
        className="group relative bg-[#0b1222]/90 backdrop-blur-xl border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
      >
        <div className="flex items-start gap-3.5">
          {/* 3D Glowing Purple/Indigo Icon Box */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40 ring-1 ring-white/20 shrink-0 transform group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6 drop-shadow" />
          </div>

          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-200 block truncate uppercase tracking-wider">Total Employees</span>
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 block leading-tight">
              {total}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-3 pt-2 text-xs font-bold text-emerald-400">
          <ArrowUp className="w-3.5 h-3.5" />
          <span>+12 from last month</span>
        </div>
      </div>

      {/* 2. Present Today */}
      <div
        onClick={() => onNavigate('/attendance')}
        className="group relative bg-[#0b1222]/90 backdrop-blur-xl border border-slate-800/90 hover:border-emerald-500/50 rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
      >
        <div className="flex items-start gap-3.5">
          {/* 3D Glowing Green Icon Box */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-700 flex items-center justify-center text-white shadow-lg shadow-emerald-600/40 ring-1 ring-white/20 shrink-0 transform group-hover:scale-105 transition-transform">
            <UserCheck className="w-6 h-6 drop-shadow" />
          </div>

          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-200 block truncate uppercase tracking-wider">Present Today</span>
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 block leading-tight">
              {present}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2 text-xs font-bold text-emerald-400 flex items-center justify-between">
          <span>{presentPct}% of workforce</span>
        </div>

        {/* Emerald bottom indicator line */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-500 rounded-b-2xl shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
      </div>

      {/* 3. Absent Today */}
      <div
        onClick={() => onNavigate('/attendance')}
        className="group relative bg-[#0b1222]/90 backdrop-blur-xl border border-slate-800/90 hover:border-orange-500/50 rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
      >
        <div className="flex items-start gap-3.5">
          {/* 3D Glowing Orange Icon Box */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/40 ring-1 ring-white/20 shrink-0 transform group-hover:scale-105 transition-transform">
            <UserX className="w-6 h-6 drop-shadow" />
          </div>

          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-200 block truncate uppercase tracking-wider">Absent Today</span>
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 block leading-tight">
              {absent}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2 text-xs font-bold text-orange-400 flex items-center justify-between">
          <span>{absentPct}% of workforce</span>
        </div>

        {/* Orange bottom indicator line */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-orange-500 rounded-b-2xl shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
      </div>

      {/* 4. Attendance % */}
      <div
        onClick={() => onNavigate('/reports')}
        className="group relative bg-[#0b1222]/90 backdrop-blur-xl border border-slate-800/90 hover:border-purple-500/50 rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
      >
        <div className="flex items-start gap-3.5">
          {/* 3D Glowing Violet/Purple Icon Box */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-purple-600/40 ring-1 ring-white/20 shrink-0 transform group-hover:scale-105 transition-transform">
            <Award className="w-6 h-6 drop-shadow" />
          </div>

          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-200 block truncate uppercase tracking-wider">Attendance %</span>
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 block leading-tight">
              {attendanceRate}%
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2 text-xs font-bold text-purple-300 flex items-center justify-between">
          <span>Excellent attendance</span>
        </div>

        {/* Purple bottom indicator line */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-purple-500 rounded-b-2xl shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
      </div>
    </div>
  );
};
