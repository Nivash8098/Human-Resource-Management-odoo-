import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface EmployeeDonutChartProps {
  totalEmployees?: number;
  presentCount?: number;
  absentCount?: number;
  onLeaveCount?: number;
  newJoinersCount?: number;
}

export const EmployeeDonutChart: React.FC<EmployeeDonutChartProps> = ({
  totalEmployees = 120,
  presentCount = 98,
  absentCount = 22,
  onLeaveCount = 12,
  newJoinersCount = 8,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'This Month' | 'This Week' | 'This Quarter'>('This Month');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const total = totalEmployees || (presentCount + absentCount + onLeaveCount + newJoinersCount) || 1;
  const presentPct = Math.round((presentCount / total) * 100);
  const absentPct = Math.round((absentCount / total) * 100);
  const leavePct = Math.round((onLeaveCount / total) * 100);
  const joinersPct = Math.round((newJoinersCount / total) * 100);

  const stats = [
    { label: 'Present', count: presentCount, percent: `${presentPct}%`, color: '#22c55e', gradient: 'from-emerald-400 to-green-600', dotBg: 'bg-emerald-500' },
    { label: 'Absent', count: absentCount, percent: `${absentPct}%`, color: '#f97316', gradient: 'from-amber-400 to-orange-600', dotBg: 'bg-orange-500' },
    { label: 'On Leave', count: onLeaveCount, percent: `${leavePct}%`, color: '#3b82f6', gradient: 'from-sky-400 to-blue-600', dotBg: 'bg-blue-500' },
    { label: 'New Joiners', count: newJoinersCount, percent: `${joinersPct}%`, color: '#a855f7', gradient: 'from-fuchsia-400 to-purple-600', dotBg: 'bg-purple-500' },
  ];

  return (
    <div className="bg-[#0b1222]/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden h-full">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-bold text-white tracking-tight">Employee Overview</h3>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 transition-colors shadow-inner"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-[#0d1627] border border-slate-700 rounded-xl shadow-2xl py-1 z-30 text-xs">
              {(['This Week', 'This Month', 'This Quarter'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => {
                    setSelectedPeriod(period);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                    selectedPeriod === period ? 'text-sky-400 font-bold bg-slate-800/60' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Donut Chart & Legend Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center relative z-10 flex-1">
        {/* 3D Glowing Donut Chart */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
              <defs>
                <linearGradient id="donut-green" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
                <linearGradient id="donut-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
                <linearGradient id="donut-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="donut-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <filter id="donut-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Ring Track */}
              <circle
                cx="80"
                cy="80"
                r="56"
                stroke="#1e293b"
                strokeWidth="20"
                fill="none"
              />

              {/* Segment 1: Present (Green) */}
              <circle
                cx="80"
                cy="80"
                r="56"
                stroke="url(#donut-green)"
                strokeWidth="20"
                strokeDasharray="351.85"
                strokeDashoffset="140"
                strokeLinecap="round"
                fill="none"
                filter="url(#donut-glow)"
              />

              {/* Segment 2: Absent (Orange) */}
              <circle
                cx="80"
                cy="80"
                r="56"
                stroke="url(#donut-orange)"
                strokeWidth="20"
                strokeDasharray="351.85"
                strokeDashoffset="280"
                transform="rotate(210 80 80)"
                strokeLinecap="round"
                fill="none"
              />

              {/* Segment 3: On Leave (Blue) */}
              <circle
                cx="80"
                cy="80"
                r="56"
                stroke="url(#donut-blue)"
                strokeWidth="20"
                strokeDasharray="351.85"
                strokeDashoffset="310"
                transform="rotate(280 80 80)"
                strokeLinecap="round"
                fill="none"
              />

              {/* Segment 4: New Joiners (Purple) */}
              <circle
                cx="80"
                cy="80"
                r="56"
                stroke="url(#donut-purple)"
                strokeWidth="20"
                strokeDasharray="351.85"
                strokeDashoffset="325"
                transform="rotate(330 80 80)"
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Donut Center Hole Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white tracking-tight leading-none drop-shadow-md">
                {totalEmployees}
              </span>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-1">
                Employees
              </span>
            </div>
          </div>
        </div>

        {/* Legend Breakdown */}
        <div className="space-y-2.5">
          {stats.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-xs py-0.5">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.dotBg} shadow-sm ring-1 ring-white/20`} />
                <span className="text-slate-200 font-semibold text-xs">{item.label}</span>
              </div>
              <span className="text-white font-bold text-xs">
                {item.count} <span className="text-slate-400 font-medium">({item.percent})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
