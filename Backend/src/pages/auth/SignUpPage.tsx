import React, { useState } from 'react';
import { Logo } from '../../components/brand/Logo';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { Lock, Mail, User, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SignUpPageProps {
  onNavigate: (route: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const { signUp } = useAuth();
  const { success, error } = useToast();

  const [employeeId, setEmployeeId] = useState('DF-1099');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [department, setDepartment] = useState('Engineering');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      error('Missing fields', 'Please complete all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      error('Password Mismatch', 'Passwords do not match. Please verify.');
      return;
    }
    if (password.length < 6) {
      error('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await signUp({
        employee_id: employeeId,
        full_name: fullName,
        email,
        role,
        department,
        job_title: role === 'hr_admin' ? 'People Operations Manager' : 'Software Engineer'
      });

      success('Account created', 'Welcome to Dayflow!');
      onNavigate('/verify-email');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      error('Sign Up Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="mb-6 text-center flex flex-col items-center">
        <Logo size="lg" showTagline />
      </div>

      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Join your organization on Dayflow for automated workday management.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Employee ID"
              placeholder="DF-1042"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              leftIcon={<Shield className="w-4 h-4" />}
            />
            <Input
              label="Full Name"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              leftIcon={<User className="w-4 h-4" />}
            />
          </div>

          <Input
            type="email"
            label="Work Email Address"
            placeholder="jane.doe@dayflow.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="Engineering">Engineering</option>
              <option value="Product Design">Product Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="People Operations">People Operations</option>
            </Select>

            <Select
              label="Designated Role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="employee">Employee</option>
              <option value="hr_admin">HR / Admin</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />
            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>

          {/* Security Note on RLS Authoritative Boundary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              <strong>Security Architecture:</strong> Frontend role selection adapts UX navigation; backend database & Supabase RLS remain the authoritative security boundary.
            </span>
          </div>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            isLoading={isLoading}
            className="w-full font-semibold mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={() => onNavigate('/sign-in')}
            className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
