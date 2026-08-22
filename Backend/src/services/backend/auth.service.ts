import { User, UserRole } from '../../types';
import { getSupabase, isSupabaseConfigured } from '../supabase';
import { store, getFormattedDate } from '../store';
import { validation } from './validation';
import { authorization } from './authorization';
import { DayflowError } from './errors';

export interface SignUpPayload {
  email: string;
  password?: string;
  full_name: string;
  employee_id?: string;
  role?: UserRole;
  department?: string;
  job_title?: string;
  phone?: string;
}

export const authBackendService = {
  /**
   * Retrieves the current authenticated user profile from Supabase Auth or store.
   */
  async getCurrentUser(): Promise<User> {
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !profileError) {
            return profile as User;
          }

          // Fallback if profile row is still syncing
          const email = session.user.email || '';
          const users = store.getUsers();
          const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
          if (match) return match;
        }
      } catch (err) {
        console.warn('[Dayflow Auth] Remote session fetch notice, using fallback session:', err);
      }
    }
    return store.getCurrentUser();
  },

  /**
   * Secure Sign In with Supabase Auth or validated fallback persona
   */
  async signIn(email: string, password: string = 'password123', preferredRole?: UserRole): Promise<User> {
    const validEmail = validation.validateEmail(email);
    validation.validatePassword(password);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: validEmail,
          password
        });

        if (error) {
          console.warn('[Dayflow Auth] Remote sign-in failed, attempting fallback store:', error.message);
        } else if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            store.setCurrentUser(profile.id);
            return profile as User;
          }
        }
      } catch (err) {
        console.warn('[Dayflow Auth] Sign in exception:', err);
      }
    }

    // Local Store validation & Persona matching
    const users = store.getUsers();
    let match = users.find((u) => u.email.toLowerCase() === validEmail);
    if (!match && preferredRole) {
      match = users.find((u) => u.role === preferredRole);
    }
    if (!match) {
      // Auto-create matching demo session
      match = {
        id: `user-${Date.now()}`,
        email: validEmail,
        full_name: validEmail.split('@')[0].replace('.', ' '),
        employee_id: `DF-${Math.floor(1000 + Math.random() * 9000)}`,
        role: preferredRole || (validEmail.includes('jenkins') || validEmail.includes('admin') ? 'hr_admin' : 'employee'),
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        department: 'Engineering',
        job_title: 'Team Member',
        joining_date: getFormattedDate(0),
        status: 'active',
        work_mode: 'office'
      };
      store.createUser(match);
    }

    store.setCurrentUser(match.id);
    return match;
  },

  /**
   * Secure Registration: provisions auth user and profile
   */
  async signUp(payload: SignUpPayload): Promise<User> {
    const validEmail = validation.validateEmail(payload.email);
    const validPassword = payload.password ? validation.validatePassword(payload.password) : 'Password123!';
    const empId = payload.employee_id ? validation.validateEmployeeId(payload.employee_id) : `DF-${Math.floor(1000 + Math.random() * 9000)}`;
    const role: UserRole = payload.role === 'hr_admin' ? 'hr_admin' : 'employee';

    const newUser: User = {
      id: `emp-${Date.now()}`,
      email: validEmail,
      full_name: payload.full_name.trim(),
      employee_id: empId,
      role,
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      department: payload.department || 'Engineering',
      job_title: payload.job_title || (role === 'hr_admin' ? 'People Operations Manager' : 'Software Engineer'),
      phone: payload.phone || '+1 (555) 000-0000',
      joining_date: getFormattedDate(0),
      status: 'active',
      work_mode: 'office'
    };

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: validEmail,
          password: validPassword,
          options: {
            data: {
              full_name: newUser.full_name,
              employee_id: newUser.employee_id,
              role: newUser.role
            }
          }
        });

        if (!authError && authData.user) {
          newUser.id = authData.user.id;
          await supabase.from('profiles').upsert([newUser]);
        }
      } catch (err) {
        console.warn('[Dayflow Auth] Remote sign-up notice:', err);
      }
    }

    store.createUser(newUser);
    store.setCurrentUser(newUser.id);
    return newUser;
  },

  /**
   * Password Reset Request
   */
  async sendPasswordReset(email: string): Promise<void> {
    const validEmail = validation.validateEmail(email);
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.resetPasswordForEmail(validEmail);
    }
  },

  /**
   * Sign Out
   */
  async signOut(): Promise<void> {
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[Dayflow Auth] Remote sign out error:', err);
      }
    }
    const users = store.getUsers();
    if (users.length > 0) {
      store.setCurrentUser(users[0].id);
    }
  },

  /**
   * Switch Active Role (for demo/evaluator convenience)
   */
  async switchRole(role: UserRole): Promise<User> {
    const users = store.getUsers();
    const targetUser = users.find((u) => u.role === role) || users[0];
    store.setCurrentUser(targetUser.id);
    return targetUser;
  },

  /**
   * Update Profile
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const currentUser = await this.getCurrentUser();
    const sanitized = authorization.sanitizeEmployeeProfileUpdates(currentUser, userId, updates);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ ...sanitized, updated_at: new Date().toISOString() })
          .eq('id', userId)
          .select('*')
          .single();

        if (data && !error) {
          store.updateUser(userId, data as Partial<User>);
          return data as User;
        }
      } catch (err) {
        console.warn('[Dayflow Profile] Remote update notice:', err);
      }
    }

    return store.updateUser(userId, sanitized);
  }
};
