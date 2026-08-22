import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppShell } from './components/layout/AppShell';

// Auth Pages
import { SignInPage } from './pages/auth/SignInPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';

// Employee Pages
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { AttendancePage } from './pages/employee/AttendancePage';
import { LeavePage } from './pages/employee/LeavePage';
import { PayrollPage } from './pages/employee/PayrollPage';
import { ProfilePage } from './pages/employee/ProfilePage';
import { DocumentsPage } from './pages/employee/DocumentsPage';

// HR / Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { EmployeeDirectoryPage } from './pages/admin/EmployeeDirectoryPage';
import { EmployeeDetailPage } from './pages/admin/EmployeeDetailPage';
import { LeaveRequestsPage } from './pages/admin/LeaveRequestsPage';
import { PayrollManagePage } from './pages/admin/PayrollManagePage';
import { ReportsPage } from './pages/admin/ReportsPage';

// Shared Pages
import { NotificationsPage } from './pages/shared/NotificationsPage';
import { SettingsPage } from './pages/shared/SettingsPage';

import { motion, AnimatePresence } from 'motion/react';

const MainRouter: React.FC = () => {
  const { user, role, isLoading } = useAuth();
  
  // Initialize route to /sign-in by default to show the login experience
  const [currentRoute, setCurrentRoute] = useState<string>('/sign-in');

  // Sync role changes with appropriate default dashboard
  useEffect(() => {
    if (role === 'hr_admin' && currentRoute === '/dashboard') {
      setCurrentRoute('/admin');
    } else if (role === 'employee' && currentRoute === '/admin') {
      setCurrentRoute('/dashboard');
    }
  }, [role]);

  const handleNavigate = (route: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentRoute(route);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-sm font-bold tracking-wider uppercase text-indigo-300">
          DAYFLOW HR
        </div>
        <p className="text-xs text-slate-400 mt-1">Every workday, perfectly aligned.</p>
      </div>
    );
  }

  // Standalone Auth Screen routing
  if (currentRoute === '/sign-in') {
    return <SignInPage onNavigate={handleNavigate} />;
  }
  if (currentRoute === '/sign-up') {
    return <SignUpPage onNavigate={handleNavigate} />;
  }
  if (currentRoute === '/forgot-password') {
    return <ForgotPasswordPage onNavigate={handleNavigate} />;
  }
  if (currentRoute === '/verify-email') {
    return <VerifyEmailPage onNavigate={handleNavigate} />;
  }

  // Dynamic View Renderer inside AppShell
  const renderCurrentView = () => {
    if (currentRoute.startsWith('/employees/')) {
      const empId = currentRoute.replace('/employees/', '');
      return <EmployeeDetailPage employeeId={empId} onNavigate={handleNavigate} />;
    }

    switch (currentRoute) {
      // Employee Views
      case '/dashboard':
        return <EmployeeDashboard onNavigate={handleNavigate} />;
      case '/attendance':
        return <AttendancePage />;
      case '/leave':
        return <LeavePage />;
      case '/payroll':
        return <PayrollPage />;
      case '/profile':
        return <ProfilePage />;
      case '/documents':
        return <DocumentsPage />;

      // HR / Admin Views
      case '/admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case '/employees':
        return <EmployeeDirectoryPage onNavigate={handleNavigate} />;
      case '/leave/requests':
        return <LeaveRequestsPage />;
      case '/payroll/manage':
        return <PayrollManagePage />;
      case '/reports':
        return <ReportsPage />;

      // Shared Views
      case '/notifications':
        return <NotificationsPage onNavigate={handleNavigate} />;
      case '/settings':
        return <SettingsPage />;

      default:
        return role === 'hr_admin' ? (
          <AdminDashboard onNavigate={handleNavigate} />
        ) : (
          <EmployeeDashboard onNavigate={handleNavigate} />
        );
    }
  };

  return (
    <AppShell currentRoute={currentRoute} onNavigate={handleNavigate}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRoute}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {renderCurrentView()}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </ToastProvider>
  );
}
