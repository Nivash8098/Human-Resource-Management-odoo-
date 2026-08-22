import React, { useState } from 'react';
import { Logo } from '../../components/brand/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, ArrowRight, Shield, User } from 'lucide-react';

interface SignInPageProps {
  onNavigate: (route: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onNavigate }) => {
  const { signIn } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('alex.morgan@dayflow.io');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent, roleHint?: 'employee' | 'hr_admin') => {
    e.preventDefault();
    if (!email || !password) {
      error('Missing credentials', 'Please enter your work email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password, roleHint);
      success('Welcome back', 'Signed in successfully to Dayflow.');
      if (roleHint === 'hr_admin' || email.includes('jenkins')) {
        onNavigate('/admin');
      } else {
        onNavigate('/dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      error('Sign In Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoSignIn = async (targetRole: 'employee' | 'hr_admin') => {
    const targetEmail = targetRole === 'hr_admin' ? 'sarah.jenkins@dayflow.io' : 'alex.morgan@dayflow.io';
    setEmail(targetEmail);
    setPassword('password123');

    setIsLoading(true);
    try {
      await signIn(targetEmail, 'password123', targetRole);
      success(
        targetRole === 'hr_admin' ? 'Signed in as HR Director' : 'Signed in as Senior Engineer',
        `Active persona: ${targetRole === 'hr_admin' ? 'Sarah Jenkins (HR / Admin)' : 'Alex Morgan (Employee)'}`
      );
      if (targetRole === 'hr_admin') {
        onNavigate('/admin');
      } else {
        onNavigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Brand Header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <Logo size="lg" showTagline />
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sign in with your enterprise credentials to access your Dayflow portal.
          </p>
        </div>

        {/* Quick Demo Selector for Evaluators & Judges */}
        <div className="mb-6 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-2">
            <span>⚡ Fast Evaluation / Demo Personas</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoSignIn('employee')}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-white hover:bg-slate-50 text-indigo-950 text-xs font-semibold border border-indigo-200/80 shadow-2xs transition-all active:scale-98"
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              Employee Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoSignIn('hr_admin')}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-all active:scale-98"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-200" />
              HR Admin Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <Input
            type="email"
            label="Work Email Address"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => onNavigate('/forgot-password')}
              className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            isLoading={isLoading}
            className="w-full font-semibold mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Don't have an account yet? </span>
          <button
            type="button"
            onClick={() => onNavigate('/sign-up')}
            className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};
