import { NotificationItem } from '../../types';
import { getSupabase, isSupabaseConfigured } from '../supabase';
import { store } from '../store';
import { authBackendService } from './auth.service';
import { authorization } from './authorization';

export const notificationBackendService = {
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    const caller = await authBackendService.getCurrentUser();
    authorization.assertCanAccessEmployee(caller, userId);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .or(`user_id.eq.${userId},user_id.eq.all`)
          .order('created_at', { ascending: false });

        if (data && !error && data.length > 0) {
          return data as NotificationItem[];
        }
      } catch (err) {
        console.warn('[Dayflow Notifications] Remote fetch fallback:', err);
      }
    }

    return store.getNotifications(userId);
  },

  async getMyNotifications(): Promise<NotificationItem[]> {
    const caller = await authBackendService.getCurrentUser();
    return this.getNotifications(caller.id);
  },

  async markAsRead(id: string): Promise<void> {
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id);
      } catch (err) {
        console.warn('[Dayflow Notifications] Remote mark read fallback:', err);
      }
    }
    store.markNotificationAsRead(id);
  },

  async markNotificationRead(id: string): Promise<void> {
    return this.markAsRead(id);
  },

  async markAllAsRead(userId: string): Promise<void> {
    const caller = await authBackendService.getCurrentUser();
    authorization.assertCanAccessEmployee(caller, userId);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .or(`user_id.eq.${userId},user_id.eq.all`);
      } catch (err) {
        console.warn('[Dayflow Notifications] Remote mark all read fallback:', err);
      }
    }
    store.markAllNotificationsAsRead(userId);
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    return this.markAllAsRead(userId);
  },

  async createNotification(notif: Omit<NotificationItem, 'id' | 'created_at'>): Promise<NotificationItem> {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .insert([newNotif])
          .select('*')
          .single();

        if (data && !error) {
          store.addNotification(newNotif);
          return data as NotificationItem;
        }
      } catch (err) {
        console.warn('[Dayflow Notifications] Remote create fallback:', err);
      }
    }

    store.addNotification(newNotif);
    return newNotif;
  }
};
