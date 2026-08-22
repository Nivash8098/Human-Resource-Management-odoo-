import React from 'react';
import { Logo } from '../brand/Logo';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Clock, 
  Umbrella, 
  CreditCard, 
  User as UserIcon, 
  FileText, 
  Bell, 
  Settings, 
  Users, 
  BarChart3, 
  Sparkles,
  Repeat
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate, className }) => {
  const { user, role, switchRole, unreadCount } = useAuth();

  const employeeNavGroups = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'Attendance', route: '/attendance', icon: <Clock className="w-4 h-4" /> },
        { label: 'Leave & Time Off', route: '/leave', icon: <Umbrella className="w-4 h-4" /> },
        { label: 'My Compensation', route: '/payroll', icon: <CreditCard className="w-4 h-4" /> },
      ]
    },
    {
      title: 'PERSONAL',
      items: [
        { label: 'My Profile', route: '/profile', icon: <UserIcon className="w-4 h-4" /> },
        { label: 'Documents', route: '/documents', icon: <FileText className="w-4 h-4" /> },
        { label: 'Notifications', route: '/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount || 2 },
        { label: 'Settings', route: '/settings', icon: <Settings className="w-4 h-4" /> },
      ]
    }
  ];

  const hrNavGroups = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'HR Dashboard', route: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'People Directory', route: '/employees', icon: <Users className="w-4 h-4" /> },
        { label: 'Workforce Attendance', route: '/attendance', icon: <Clock className="w-4 h-4" /> },
        { label: 'Leave Approvals', route: '/leave/requests', icon: <Umbrella className="w-4 h-4" />, badge: '2' },
        { label: 'Payroll Management', route: '/payroll/manage', icon: <CreditCard className="w-4 h-4" /> },
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { label: 'Reports & Analytics', route: '/reports', icon: <BarChart3 className="w-4 h-4" /> },
      ]
    },
    {
      title: 'PERSONAL',
      items: [
        { label: 'Notifications', route: '/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount || 2 },
        { label: 'Settings', route: '/settings', icon: <Settings className="w-4 h-4" /> },
      ]
    }
  ];

  const navGroups = role === 'hr_admin' ? hrNavGroups : employeeNavGroups;

  return (
    <aside className={`w-64 bg-[#0B1120] text-slate-300 flex flex-col h-full shrink-0 border-r border-slate-800/80 select-none ${className || ''}`}>
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
        <Logo isLight size="sm" showTagline />
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {group.title}
            </div>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const isActive = currentRoute === item.route || (item.route !== '/dashboard' && item.route !== '/admin' && currentRoute.startsWith(item.route));

                return (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => onNavigate(item.route)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-white' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-indigo-600 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Motivational / Productivity Silk Wave Card from screenshot */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-blue-950/80 p-4 border border-indigo-500/20 text-white shadow-lg">
          <div className="relative z-10 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 mb-2">
              <Sparkles className="w-4 h-4 text-blue-300" />
            </div>
            <h4 className="text-xs font-bold tracking-tight text-white">Make every workday count</h4>
            <p className="text-[10.5px] text-slate-300 leading-relaxed">
              Stay productive, organized and ahead.
            </p>
          </div>

          {/* Glowing Silk Wave background vectors */}
          <div className="absolute -bottom-6 -right-6 w-32 h-24 pointer-events-none opacity-40">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-blue-500">
              <path d="M0 100 C 50 20, 150 180, 200 100 L 200 200 L 0 200 Z" fill="currentColor" fillOpacity="0.3" />
              <path d="M0 120 C 60 50, 140 160, 200 110 L 200 200 L 0 200 Z" fill="#6366f1" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Quick Role Switcher */}
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] text-slate-400 font-medium">Role: {role === 'hr_admin' ? 'HR Admin' : 'Employee'}</span>
            <button
              type="button"
              onClick={() => switchRole(role === 'hr_admin' ? 'employee' : 'hr_admin')}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <Repeat className="w-3 h-3" />
              Switch
            </button>
          </div>
        </div>
      </div>

      {/* User Mini Profile at bottom */}
      <div className="p-3.5 border-t border-slate-800/80 flex items-center justify-between bg-[#080d18]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#080d18]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-200 truncate">{user?.full_name || 'Alex Morgan'}</div>
            <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
              <span>{role === 'hr_admin' ? 'HR / Admin' : 'Employee'}</span>
              <span>•</span>
              <span className="truncate">{user?.department || 'Engineering'}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

