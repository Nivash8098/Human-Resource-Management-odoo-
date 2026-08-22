import { ActivityItem } from '../../frontend/src/types';
import { getSupabase, isSupabaseConfigured } from '../../frontend/src/services/supabase';
import { store } from '../../frontend/src/services/store';
import { authBackendService } from './auth.service';
import { authorization } from './authorization';

export const activityBackendService = {
  async getActivities(limit?: number): Promise<ActivityItem[]> {
    const caller = await authBackendService.getCurrentUser();
    const isHR = authorization.isHROrAdmin(caller);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('activities').select('*').order('timestamp', { ascending: false });
        if (!isHR) {
          query = query.or(`user_id.eq.${caller.id},type.eq.announcement`);
        }
        if (limit) {
          query = query.limit(limit);
        }
        const { data, error } = await query;
        if (data && !error && data.length > 0) {
          return data as ActivityItem[];
        }
      } catch (err) {
        console.warn('[Dayflow Activities] Remote fetch fallback:', err);
      }
    }

    const all = store.getActivities();
    if (limit) {
      return all.slice(0, limit);
    }
    return all;
  },

  async logActivity(activity: Omit<ActivityItem, 'id' | 'timestamp'>): Promise<ActivityItem> {
    const newAct: ActivityItem = {
      ...activity,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('activities')
          .insert([newAct])
          .select('*')
          .single();

        if (data && !error) {
          store.addActivity(newAct);
          return data as ActivityItem;
        }
      } catch (err) {
        console.warn('[Dayflow Activities] Remote create fallback:', err);
      }
    }

    store.addActivity(newAct);
    return newAct;
  }
};
