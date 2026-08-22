import React from 'react';
import { UserPlus, CalendarCheck, Plane, DollarSign } from 'lucide-react';

interface QuickActionButtonsProps {
  onAddEmployee: () => void;
  onMarkAttendance: () => void;
  onApproveLeave: () => void;
  onRunPayroll: () => void;
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  onAddEmployee,
  onMarkAttendance,
  onApproveLeave,
  onRunPayroll,
}) => {
  const actions = [
    {
      id: 'add-employee',
      title: 'Add Employee',
      onClick: onAddEmployee,
      icon: <UserPlus className="w-6 h-6 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)]" />,
      bgGradient: 'bg-gradient-to-b from-blue-500/80 via-blue-600/90 to-blue-800/90',
      borderGlow: 'border-blue-400/40 hover:border-blue-400',
      shadowGlow: 'shadow-[0_8px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.55)]',
      iconBoxBg: 'bg-gradient-to-br from-blue-400 to-indigo-600',
    },
    {
      id: 'mark-attendance',
      title: 'Mark Attendance',
      onClick: onMarkAttendance,
      icon: <CalendarCheck className="w-6 h-6 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)]" />,
      bgGradient: 'bg-gradient-to-b from-emerald-500/80 via-emerald-600/90 to-emerald-800/90',
      borderGlow: 'border-emerald-400/40 hover:border-emerald-400',
      shadowGlow: 'shadow-[0_8px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_28px_rgba(16,185,129,0.55)]',
      iconBoxBg: 'bg-gradient-to-br from-emerald-400 to-teal-600',
    },
    {
      id: 'approve-leave',
      title: 'Approve Leave',
      onClick: onApproveLeave,
      icon: <Plane className="w-6 h-6 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)]" />,
      bgGradient: 'bg-gradient-to-b from-amber-500/80 via-orange-600/90 to-orange-800/90',
      borderGlow: 'border-orange-400/40 hover:border-orange-400',
      shadowGlow: 'shadow-[0_8px_20px_rgba(249,115,22,0.35)] hover:shadow-[0_12px_28px_rgba(249,115,22,0.55)]',
      iconBoxBg: 'bg-gradient-to-br from-amber-400 to-orange-600',
    },
    {
      id: 'run-payroll',
      title: 'Run Payroll',
      onClick: onRunPayroll,
      icon: <DollarSign className="w-6 h-6 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)]" />,
      bgGradient: 'bg-gradient-to-b from-purple-500/80 via-purple-600/90 to-purple-800/90',
      borderGlow: 'border-purple-400/40 hover:border-purple-400',
      shadowGlow: 'shadow-[0_8px_20px_rgba(168,85,247,0.35)] hover:shadow-[0_12px_28px_rgba(168,85,247,0.55)]',
      iconBoxBg: 'bg-gradient-to-br from-purple-400 to-indigo-700',
    },
  ];

  return (
    <div className="bg-[#0b1222]/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full">
      <h3 className="text-sm font-bold text-white tracking-tight uppercase mb-3">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {actions.map((action) => (
          <button
            key={action.id}
            id={`quick-action-${action.id}`}
            type="button"
            onClick={action.onClick}
            className={`group relative overflow-hidden rounded-2xl p-3.5 flex flex-col items-center justify-center gap-2.5 border text-center transition-all duration-200 active:scale-95 cursor-pointer ${action.borderGlow} ${action.shadowGlow} bg-[#0e162a]/90 hover:bg-[#131d38]`}
          >
            {/* Top Gloss Reflection Layer */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-2xl" />

            {/* 3D Glossy Icon Cube */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.iconBoxBg} shadow-lg ring-1 ring-white/30 transform group-hover:scale-105 group-hover:-translate-y-0.5 transition-transform duration-200`}
            >
              {action.icon}
            </div>

            {/* Action Label */}
            <span className="text-xs font-bold text-slate-100 group-hover:text-white transition-colors leading-tight">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
