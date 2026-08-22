import React from 'react';
import { Logo } from '../brand/Logo';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  IndianRupee, 
  Users, 
  BarChart3, 
  User as UserIcon, 
  Settings,
  Bell,
  LogOut,
  Repeat
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  onOpen,
  currentRoute,
  onNavigate,
}) => {
  const { user, role, switchRole, signOut, unreadCount } = useAuth();

  const employeeItems = [
    { label: 'Dashboard', route: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Attendance', route: '/attendance', icon: <Clock className="w-4 h-4" /> },
    { label: 'Leave', route: '/leave', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Compensation', route: '/payroll', icon: <IndianRupee className="w-4 h-4" /> },
    { label: 'Profile', route: '/profile', icon: <UserIcon className="w-4 h-4" /> },
    { label: 'Notifications', route: '/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount },
    { label: 'Settings', route: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const hrItems = [
    { label: 'HR Dashboard', route: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'People Directory', route: '/employees', icon: <Users className="w-4 h-4" /> },
    { label: 'Attendance', route: '/attendance', icon: <Clock className="w-4 h-4" /> },
    { label: 'Leave Approvals', route: '/leave/requests', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Payroll Management', route: '/payroll/manage', icon: <IndianRupee className="w-4 h-4" /> },
    { label: 'Reports & Analytics', route: '/reports', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Notifications', route: '/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount },
    { label: 'Settings', route: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const items = role === 'hr_admin' ? hrItems : employeeItems;

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-3 px-4 bg-[#080e1c]/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <button
          type="button"
          onClick={onOpen}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Logo size="sm" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('/notifications')}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#080e1c]" />
            )}
          </button>
          {user?.avatar_url && (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-7 h-7 rounded-full object-cover border border-slate-700 ring-1 ring-blue-500/30"
              onClick={() => onNavigate('/profile')}
            />
          )}
        </div>
      </div>

      {/* Slide-Over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={onClose}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-72 bg-slate-900 text-slate-200 flex flex-col h-full z-10 shadow-2xl"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <Logo isLight size="sm" />
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {items.map((item) => {
                  const isActive = currentRoute === item.route;
                  return (
                    <button
                      key={item.route}
                      type="button"
                      onClick={() => {
                        onNavigate(item.route);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge ? (
                        <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Sign Out Button */}
              <div className="p-4 border-t border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    onClose();
                    onNavigate('/sign-in');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300 hover:bg-rose-900/50 text-xs font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out to Switch Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#080e1c]/95 backdrop-blur-md border-t border-slate-800 z-30 flex items-center justify-around px-2 shadow-2xl">
        {role === 'employee' ? (
          <>
            <button
              type="button"
              onClick={() => onNavigate('/dashboard')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer transition-colors ${
                currentRoute === '/dashboard' ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/attendance')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer transition-colors ${
                currentRoute === '/attendance' ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Attendance</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/leave')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer transition-colors ${
                currentRoute === '/leave' ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Leave</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/payroll')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer transition-colors ${
                currentRoute === '/payroll' ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <IndianRupee className="w-4 h-4" />
              <span>Payroll</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onNavigate('/admin')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer transition-colors ${
                currentRoute === '/admin' ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>HR Home</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/employees')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer transition-colors ${
                currentRoute === '/employees' ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>People</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/leave/requests')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer transition-colors ${
                currentRoute === '/leave/requests' ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Approvals</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/reports')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer transition-colors ${
                currentRoute === '/reports' ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
            </button>
          </>
        )}
      </div>
    </>
  );
};
