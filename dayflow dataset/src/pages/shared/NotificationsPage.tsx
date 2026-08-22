import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { notificationService } from '../../services/api';
import { NotificationItem } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate, formatTime } from '../../lib/utils';
import { 
  Bell, 
  CheckCheck, 
  Calendar, 
  IndianRupee, 
  UserCheck, 
  Info, 
  Trash2, 
  ArrowRight 
} from 'lucide-react';

interface NotificationsPageProps {
  onNavigate: (route: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { user, refreshNotifications } = useAuth();
  const { success } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const list = await notificationService.getNotifications(user.id);
      setNotifications(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    await notificationService.markAllAsRead(user.id);
    await refreshNotifications();
    loadNotifications();
    success('Notifications Updated', 'All items marked as read.');
  };

  const handleItemClick = async (notif: NotificationItem) => {
    await notificationService.markAsRead(notif.id);
    await refreshNotifications();
    loadNotifications();
    if (notif.link) {
      onNavigate(notif.link);
    }
  };

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter((n) => !n.is_read);

  const getIcon = (type: string) => {
    if (type.includes('leave')) return <Calendar className="w-4 h-4 text-indigo-600" />;
    if (type.includes('payroll')) return <IndianRupee className="w-4 h-4 text-emerald-600" />;
    if (type.includes('attendance')) return <UserCheck className="w-4 h-4 text-sky-600" />;
    return <Info className="w-4 h-4 text-slate-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
              Activity & Feeds
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-xs text-slate-500 font-medium">Realtime Push</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay updated on leave approvals, payroll disbursements, shift reminders, and team announcements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                filter === 'unread' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unread ({notifications.filter((n) => !n.is_read).length})
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            leftIcon={<CheckCheck className="w-4 h-4 text-slate-500" />}
          >
            Mark all read
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <Card className="shadow-xs border-slate-200/80">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <CardTitle>Notifications Feed</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No notifications in this view</p>
                <p className="text-[11px] text-slate-400 mt-0.5">You're all caught up with your workday updates.</p>
              </div>
            ) : (
              filtered.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                    !notif.is_read ? 'bg-indigo-50/25' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {notif.title}
                        </h4>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
                        {notif.message}
                      </p>
                      <span className="text-[11px] text-slate-400 font-mono mt-2 block">
                        {formatDate(notif.created_at.split('T')[0])} at {formatTime(notif.created_at.split('T')[1]?.slice(0, 8) || '09:00:00')}
                      </span>
                    </div>
                  </div>

                  {notif.link && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-indigo-600 text-xs shrink-0 self-center"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      View Details
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
