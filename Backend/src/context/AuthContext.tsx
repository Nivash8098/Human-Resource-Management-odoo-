import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, NotificationItem } from '../types';
import { authService, notificationService } from '../services/api';
import { store } from '../services/store';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoading: boolean;
  unreadCount: number;
  signIn: (email: string, password?: string, preferredRole?: UserRole) => Promise<void>;
  signUp: (data: { email: string; full_name: string; employee_id: string; role: UserRole; department?: string; job_title?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchNotifications = useCallback(async (currentUserId: string) => {
    try {
      const notifs = await notificationService.getNotifications(currentUserId);
      const unread = notifs.filter((n: NotificationItem) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (e) {
      console.error('Error fetching notifications count:', e);
    }
  }, []);

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        await fetchNotifications(currentUser.id);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchNotifications]);

  useEffect(() => {
    loadUser();

    // Subscribe to store updates for live reactivity across tabs / components
    const unsubscribe = store.subscribe(() => {
      const cur = store.getCurrentUser();
      setUser(cur);
      fetchNotifications(cur.id);
    });

    return () => unsubscribe();
  }, [loadUser, fetchNotifications]);

  const signIn = async (email: string, password: string = 'password', preferredRole?: UserRole) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.signIn(email, password, preferredRole);
      setUser(loggedUser);
      await fetchNotifications(loggedUser.id);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: {
    email: string;
    full_name: string;
    employee_id: string;
    role: UserRole;
    department?: string;
    job_title?: string;
  }) => {
    setIsLoading(true);
    try {
      const createdUser = await authService.signUp(data);
      setUser(createdUser);
      await fetchNotifications(createdUser.id);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      // Set to employee default
      const users = store.getUsers();
      const defaultUser = users[0];
      store.setCurrentUser(defaultUser.id);
      setUser(defaultUser);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (newRole: UserRole) => {
    setIsLoading(true);
    try {
      const targetUser = await authService.switchRole(newRole);
      setUser(targetUser);
      await fetchNotifications(targetUser.id);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await authService.updateProfile(user.id, updates);
    setUser(updated);
  };

  const refreshUserData = async () => {
    if (user) {
      const refreshed = await authService.getCurrentUser();
      setUser(refreshed);
    }
  };

  const refreshNotifications = async () => {
    if (user) {
      await fetchNotifications(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'employee',
        isLoading,
        unreadCount,
        signIn,
        signUp,
        signOut,
        switchRole,
        updateProfile,
        refreshUserData,
        refreshUser: refreshUserData,
        refreshNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
