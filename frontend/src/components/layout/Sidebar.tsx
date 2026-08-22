import React from 'react';
import { NexoraLogo } from '../brand/NexoraLogo';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Clock, 
  Plane, 
  DollarSign, 
  User as UserIcon, 
  FileText, 
  Bell, 
  Settings, 
  Users, 
  BarChart3, 
  Repeat,
  ChevronDown,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate, className }) => {
  const { user, role, unreadCount } = useAuth();

  // HR Specific Navigation matching image.png exactly
  const hrNavItems = [
    { label: 'Dashboard', route: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Employees', route: '/employees', icon: <Users className="w-4 h-4" /> },
    { label: 'Attendance', route: '/attendance', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Leave Request', route: '/leave/requests', icon: <Plane className="w-4 h-4" /> },
    { label: 'Payroll', route: '/payroll/manage', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Report', route: '/reports', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Settings', route: '/settings', icon: <Settings className="w-4 h-4" /> },
    { label: 'Notification', route: '/notifications', icon: <Bell className="w-4 h-4" />, badge: 3 },
  ];

  // Employee Specific Navigation
  const employeeNavItems = [
    { label: 'Dashboard', route: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Attendance', route: '/attendance', icon: <Clock className="w-4 h-4" /> },
    { label: 'Leave & Time Off', route: '/leave', icon: <Plane className="w-4 h-4" /> },
    { label: 'Compensation', route: '/payroll', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'My Profile', route: '/profile', icon: <UserIcon className="w-4 h-4" /> },
    { label: 'Documents', route: '/documents', icon: <FileText className="w-4 h-4" /> },
    { label: 'Notifications', route: '/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount || 2 },
    { label: 'Settings', route: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const items = role === 'hr_admin' ? hrNavItems : employeeNavItems;

  return (
    <aside className={`w-60 bg-[#060b14] text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800/80 select-none ${className || ''}`}>
      {/* Top Logo Header */}
      <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
        <NexoraLogo variant="hr" size="sm" />
      </div>

      {/* Vertical Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        {items.map((item) => {
          const isActive = 
            currentRoute === item.route || 
            (item.route !== '/dashboard' && item.route !== '/admin' && currentRoute.startsWith(item.route));

          return (
            <button
              key={item.route}
              type="button"
              onClick={() => onNavigate(item.route)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-[0_4px_18px_rgba(37,99,235,0.4)] border border-blue-400/40 ring-1 ring-blue-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom User Profile & Sign Out in Sidebar */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-[#050811]">
        {/* User Profile Pill at Bottom Sidebar */}
        <div 
          onClick={() => onNavigate(role === 'hr_admin' ? '/admin' : '/profile')}
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 transition-colors cursor-pointer group shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/50"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-2 ring-blue-400/40">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#050811]" />
            </div>

            <div className="min-w-0 text-left">
              <div className="text-xs font-bold text-white truncate">
                {role === 'hr_admin' ? (user?.full_name || 'Sarah Jenkins (HR)') : (user?.full_name || 'Alex Morgan')}
              </div>
              <div className="text-[11px] text-sky-400 font-semibold truncate">
                {role === 'hr_admin' ? 'HR Administrator' : (user?.job_title || 'Software Engineer')}
              </div>
            </div>
          </div>

          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors shrink-0" />
        </div>
      </div>
    </aside>
  );
};
