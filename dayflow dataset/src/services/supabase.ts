import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Environment variables
const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const supabaseUrl = 
  metaEnv.VITE_SUPABASE_URL || 
  metaEnv.SUPABASE_URL || 
  'https://wspakhanaccerplhteuc.supabase.co';

const supabaseAnonKey = 
  metaEnv.VITE_SUPABASE_ANON_KEY || 
  metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY || 
  metaEnv.SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_4b2TsbNuDooCLuYwZJDEjA_nIxQ-XuF';

// Initialize client if credentials exist
let supabaseInstance: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> | null {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
    try {
      supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
    } catch (err) {
      console.warn('[Dayflow] Supabase client initialization notice:', err);
    }
  }
  return supabaseInstance;
}

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('your-project') && 
    !supabaseAnonKey.includes('your-anon-key')
  );
};
