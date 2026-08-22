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
  IndianRupee,
  Info,
  MessageSquare
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
}) => {
  const { user, role, signOut, unreadCount, refreshNotifications } = useAuth();
  const { info } = useToast();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close popovers on outside click
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
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Search Input Bar (from screenshot) */}
      <div className="flex-1 max-w-md">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200 text-xs text-slate-500 transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
            <span className="truncate">Search employees, leaves, documents...</span>
          </div>
          <kbd className="text-[10.5px] font-mono font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 shadow-2xs shrink-0 ml-2">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Action Controls & User Profile (from screenshot) */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Chat / Messages Button */}
        <button
          type="button"
          onClick={() => onNavigate('/notifications')}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
          aria-label="Messages"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Notification Bell Dropdown with badge '2' */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={handleToggleNotifications}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">
              {unreadCount || 2}
            </span>
          </button>

          {/* Notifications Popover Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50">
              <div className="p-3.5 px-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Notifications</h4>
                  <Badge variant="danger" size="sm">
                    {unreadCount || 2} new
                  </Badge>
                </div>
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notificationsList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No notifications at this time.
                  </div>
                ) : (
                  notificationsList.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !notif.is_read ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => {
                        notificationService.markAsRead(notif.id);
                        if (notif.link) onNavigate(notif.link);
                        setIsNotificationsOpen(false);
                      }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        {notif.type.includes('leave') ? (
                          <Calendar className="w-3.5 h-3.5" />
                        ) : notif.type.includes('payroll') ? (
                          <IndianRupee className="w-3.5 h-3.5" />
                        ) : (
                          <Info className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 leading-tight">{notif.title}</p>
                          {!notif.is_read && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/notifications');
                    setIsNotificationsOpen(false);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Menu Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">{user?.full_name || 'Alex Morgan'}</div>
              <div className="text-[11px] text-slate-500 font-medium capitalize">
                {role === 'hr_admin' ? 'HR / Admin' : 'Employee'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Popover Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.full_name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/profile');
                    setIsProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left"
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
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Settings
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setIsProfileOpen(false);
                    onNavigate('/sign-in');
                  }}
                  className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 text-left font-medium"
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

