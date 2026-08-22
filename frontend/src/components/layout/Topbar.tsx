import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { notificationService } from '../../services/api';
import { NotificationItem } from '../../types';
import { Badge } from '../ui/Badge';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  LogOut, 
  User as UserIcon, 
  Settings, 
  CheckCheck,
  Calendar,
  DollarSign,
  Info,
  Menu
} from 'lucide-react';

interface TopbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
  onToggleMobileMenu,
}) => {
  const { user, role, signOut, unreadCount, refreshNotifications } = useAuth();
  const { info } = useToast();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const list = await notificationService.getNotifications(user.id);
      setNotificationsList(list);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleNotifications = () => {
    if (!isNotificationsOpen) {
      loadNotifications();
    }
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await notificationService.markAllAsRead(user.id);
    await refreshNotifications();
    loadNotifications();
    info('All notifications marked as read');
  };

  return (
    <header className="h-16 bg-[#080e1a]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Left: Sidebar / Menu Toggle Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="w-10 h-10 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors shadow-inner"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar matching image.png */}
        <div className="w-64 sm:w-80 md:w-96">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-300 shrink-0" />
              <span className="truncate">Search anything...</span>
            </div>
            <kbd className="hidden sm:inline-block text-[10px] font-mono font-bold bg-[#0c1424] border border-slate-700/80 px-1.5 py-0.5 rounded text-slate-400 shrink-0 ml-2">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right Controls: Notification Bell & HR Admin Profile Badge */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell with Badge '3' */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={handleToggleNotifications}
            className="relative w-10 h-10 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors shadow-inner"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-[#080e1a]">
              3
            </span>
          </button>

          {/* Notifications Popover Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0d1527] rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
              <div className="p-3.5 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Notifications</h4>
                  <Badge variant="danger" size="sm">
                    3 new
                  </Badge>
                </div>
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
                {notificationsList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No new notifications.
                  </div>
                ) : (
                  notificationsList.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 flex items-start gap-3 hover:bg-slate-800/60 transition-colors cursor-pointer ${
                        !notif.is_read ? 'bg-blue-950/30' : ''
                      }`}
                      onClick={() => {
                        notificationService.markAsRead(notif.id);
                        if (notif.link) onNavigate(notif.link);
                        setIsNotificationsOpen(false);
                      }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-900/50 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                        {notif.type.includes('leave') ? (
                          <Calendar className="w-3.5 h-3.5" />
                        ) : notif.type.includes('payroll') ? (
                          <DollarSign className="w-3.5 h-3.5" />
                        ) : (
                          <Info className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white leading-tight">{notif.title}</p>
                          {!notif.is_read && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-800 bg-slate-900/80 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/notifications');
                    setIsNotificationsOpen(false);
                  }}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* HR Admin Profile Badge Chip */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2 rounded-xl hover:bg-slate-800/80 transition-colors"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-500/50"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-1 ring-blue-400/40">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">
                {role === 'hr_admin' ? 'HR Admin' : (user?.full_name || 'Alex Morgan')}
              </div>
              <div className="text-[10.5px] text-slate-400 font-medium">
                {role === 'hr_admin' ? 'Human Resource' : (user?.department || 'Engineering')}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Popover Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0d1627] rounded-xl border border-slate-700/80 shadow-2xl py-1 z-50 text-white">
              <div className="px-4 py-2.5 border-b border-slate-800">
                <p className="text-xs font-bold text-white">{role === 'hr_admin' ? 'HR Admin' : user?.full_name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@nexora.io'}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/profile');
                    setIsProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 text-left"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  My Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Settings
                </button>
              </div>

              <div className="pt-1 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setIsProfileOpen(false);
                    onNavigate('/sign-in');
                  }}
                  className="w-full px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 flex items-center gap-2.5 text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
