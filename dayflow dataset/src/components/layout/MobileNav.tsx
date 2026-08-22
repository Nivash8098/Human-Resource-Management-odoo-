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
      <div className="md:hidden flex items-center justify-between p-3 px-4 bg-white border-b border-slate-200 sticky top-0 z-40">
        <button
          type="button"
          onClick={onOpen}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Logo size="sm" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('/notifications')}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>
          {user?.avatar_url && (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
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

              {/* Persona Switcher & Sign Out */}
              <div className="p-4 border-t border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    switchRole(role === 'hr_admin' ? 'employee' : 'hr_admin');
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  Switch to {role === 'hr_admin' ? 'Employee View' : 'HR Admin View'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    onClose();
                    onNavigate('/sign-in');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-rose-400 hover:bg-rose-950/40 text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 z-30 flex items-center justify-around px-2 shadow-lg">
        {role === 'employee' ? (
          <>
            <button
              type="button"
              onClick={() => onNavigate('/dashboard')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                currentRoute === '/dashboard' ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/attendance')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                currentRoute === '/attendance' ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Attendance</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/leave')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                currentRoute === '/leave' ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Leave</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/payroll')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                currentRoute === '/payroll' ? 'text-indigo-600' : 'text-slate-500'
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
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                currentRoute === '/admin' ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>HR Home</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/employees')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                currentRoute === '/employees' ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>People</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/leave/requests')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                currentRoute === '/leave/requests' ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Approvals</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/reports')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                currentRoute === '/reports' ? 'text-indigo-600' : 'text-slate-500'
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
