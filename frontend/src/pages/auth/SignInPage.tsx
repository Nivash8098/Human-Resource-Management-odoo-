import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { NexoraLogo } from '../../components/brand/NexoraLogo';
import { CreateDemoAccountModal } from '../../components/auth/CreateDemoAccountModal';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Shield, 
  User, 
  ChevronRight, 
  Calendar, 
  Users, 
  CreditCard, 
  BarChart3, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SignInPageProps {
  onNavigate: (route: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onNavigate }) => {
  const { signIn } = useAuth();
  const { success, error } = useToast();

  const [username, setUsername] = useState('alex.morgan@dayflow.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      error('Missing Credentials', 'Please enter your username/email and password.');
      return;
    }

    setIsLoading(true);
    try {
      // Auto-detect role based on user account / email
      const isAdminEmail = username.toLowerCase().includes('jenkins') || 
                           username.toLowerCase().includes('admin') || 
                           username.toLowerCase().includes('hr');
      const targetRole = isAdminEmail ? 'hr_admin' : 'employee';
      
      await signIn(username, password, targetRole);
      success('Welcome to Nexora', `Signed in successfully as ${isAdminEmail ? 'HR Administrator' : 'Employee'}.`);
      
      if (isAdminEmail) {
        onNavigate('/admin');
      } else {
        onNavigate('/dashboard');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid login credentials.';
      error('Sign In Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAutofill = (email: string) => {
    setUsername(email);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col justify-between bg-[#060b13] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Background Ambient Glow & Cybernetic Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left Blue Spotlight */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[120px]" />
        {/* Center-right Indigo/Purple Spotlight */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[130px]" />
        {/* Bottom Teal Spotlight */}
        <div className="absolute -bottom-20 left-1/4 w-[600px] h-[400px] bg-cyan-600/10 rounded-full blur-[140px]" />

        {/* Subtle Cyber Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.035]" 
          style={{
            backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="lg:hidden">
          <NexoraLogo size="sm" />
        </div>

        <div className="hidden lg:block">
          {/* Spacer */}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsDemoModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-sky-300 text-xs font-bold shadow-[0_0_12px_rgba(56,189,248,0.2)] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Demo Credentials</span>
          </button>
        </div>
      </header>

      {/* Main Container: 2-Column Responsive Layout */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center flex-1">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Brand Hero & 3D Futuristic Showcase */}
        {/* ========================================================================= */}
        <section className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between h-full space-y-6 sm:space-y-8">
          {/* Header Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center">
              <NexoraLogo size="xl" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-sky-400">
              Intelligent Workforce Management
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-lg leading-relaxed font-normal">
              A unified HR platform for all employees, managers, and administrators. Manage attendance, time-off, payroll, and organizational intelligence.
            </p>
          </div>

          {/* Persona Quick Autofill Badges */}
          <div className="space-y-2.5 max-w-lg">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Autofill Demo Accounts:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickAutofill('alex.morgan@dayflow.io')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  username === 'alex.morgan@dayflow.io'
                    ? 'bg-teal-950/60 border-teal-400 text-teal-200 shadow-md'
                    : 'bg-[#0d1728]/90 border-slate-700/80 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Alex Morgan</div>
                  <div className="text-[11px] text-teal-300/80 font-medium">Employee Persona</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAutofill('sarah.jenkins@dayflow.io')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  username === 'sarah.jenkins@dayflow.io'
                    ? 'bg-blue-950/60 border-blue-400 text-blue-200 shadow-md'
                    : 'bg-[#0d1728]/90 border-slate-700/80 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Sarah Jenkins</div>
                  <div className="text-[11px] text-sky-300/80 font-medium">HR / Admin Persona</div>
                </div>
              </button>
            </div>
          </div>

          {/* 3D Holographic Platform & Futuristic Skyline Visualizer */}
          <div className="relative pt-4 pb-2 w-full max-w-lg">
            {/* Holographic Glowing 3D Base Podium */}
            <div className="relative h-44 sm:h-52 w-full flex items-center justify-center">
              
              {/* Cyber City Skyline Silhouettes in Neon Blue */}
              <div className="absolute bottom-6 inset-x-0 h-28 flex items-end justify-between px-4 opacity-45 pointer-events-none">
                <div className="w-7 h-16 bg-gradient-to-t from-blue-900 to-blue-500/20 border-t border-sky-400/40" />
                <div className="w-9 h-24 bg-gradient-to-t from-blue-950 to-blue-600/30 border-t border-sky-400/60" />
                <div className="w-6 h-12 bg-gradient-to-t from-blue-900 to-blue-500/20" />
                <div className="w-12 h-28 bg-gradient-to-t from-blue-950 to-cyan-500/30 border-t border-cyan-400/50" />
                <div className="w-8 h-20 bg-gradient-to-t from-blue-900 to-blue-500/20" />
                <div className="w-10 h-26 bg-gradient-to-t from-blue-950 to-blue-600/30 border-t border-sky-400/60" />
                <div className="w-7 h-14 bg-gradient-to-t from-blue-900 to-blue-500/20" />
              </div>

              {/* Floating Feature Badges (Left side) */}
              <div className="absolute left-2 sm:left-4 top-4 z-20 flex flex-col gap-3">
                <div className="p-2.5 rounded-xl bg-[#0e192f]/90 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-sky-400 backdrop-blur-md">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="p-2.5 rounded-xl bg-[#0e192f]/90 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-sky-400 backdrop-blur-md">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Center Floating 3D Glowing "N" Emblem */}
              <div className="relative z-20 flex flex-col items-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_15px_25px_rgba(14,165,233,0.6)] animate-pulse [animation-duration:3s]">
                  <NexoraLogo size="xl" showText={false} />
                </div>
              </div>

              {/* Floating Feature Badges (Right side) */}
              <div className="absolute right-2 sm:right-4 top-4 z-20 flex flex-col gap-3">
                <div className="p-2.5 rounded-xl bg-[#0e192f]/90 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-sky-400 backdrop-blur-md">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="p-2.5 rounded-xl bg-[#0e192f]/90 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-sky-400 backdrop-blur-md">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>

              {/* Concentric Glowing 3D Elliptical Podium Base */}
              <div className="absolute -bottom-2 inset-x-4 h-16 flex items-center justify-center pointer-events-none">
                <div className="w-72 sm:w-80 h-10 rounded-[100%] border border-sky-400/40 shadow-[0_0_30px_rgba(56,189,248,0.5)] bg-gradient-to-b from-blue-600/20 to-transparent" />
                <div className="absolute w-56 sm:w-64 h-8 rounded-[100%] border-2 border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.8)] bg-blue-950/80" />
                <div className="absolute w-40 sm:w-48 h-6 rounded-[100%] bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 opacity-90 shadow-[0_0_25px_rgba(56,189,248,1)]" />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Single Unified Login Card */}
        {/* ========================================================================= */}
        <section className="lg:col-span-6 xl:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-[#0c1424]/95 backdrop-blur-xl border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-3xl p-7 sm:p-9 relative overflow-hidden">
            
            {/* Ambient Background Gradient */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Glowing Center Lock Badge */}
            <div className="flex flex-col items-center mb-6 relative z-10">
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-blue-500/25 to-indigo-950/80 border border-blue-400/50 flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.45)] ring-4 ring-blue-500/10 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/40">
                  <Lock className="w-5 h-5 text-white" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center">
                Sign In to Nexora
              </h2>
              <p className="text-sm text-slate-300 mt-1.5 text-center font-medium">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSignIn} className="space-y-4.5 relative z-10">
              {/* Username / Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  WORK EMAIL OR USERNAME
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. alex.morgan@dayflow.io"
                    required
                    className="w-full bg-[#121c30] border border-slate-700/80 hover:border-slate-600 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-[#121c30] border border-slate-700/80 hover:border-slate-600 focus:border-blue-500 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-200 hover:text-white transition-colors font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#121c30] border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 focus:ring-1"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('/forgot-password')}
                  className="font-bold text-sky-400 hover:text-sky-300 hover:underline transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Single Main Unified Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 mt-3 cursor-pointer shadow-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(37,99,235,0.45)] hover:shadow-[0_0_28px_rgba(59,130,246,0.65)]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>SIGN IN TO ACCOUNT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* OR Divider */}
              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/80" />
                </div>
                <div className="relative px-3 bg-[#0c1424] text-xs font-bold text-slate-400 tracking-wider uppercase">
                  OR
                </div>
              </div>

              {/* Sign Up Link & Demo Creator */}
              <div className="text-center text-xs text-slate-300 space-y-2 pt-1 font-medium">
                <div>
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('/sign-up')}
                    className="font-bold text-sky-400 hover:text-sky-300 hover:underline transition-colors cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
        <div>
          <span>© {new Date().getFullYear()} Nexora Workforce Systems. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 font-medium">
          <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-slate-200 cursor-pointer">System Status</span>
        </div>
      </footer>

      {/* Interactive Demo Account Generator Modal */}
      <CreateDemoAccountModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSuccess={(role) => {
          if (role === 'hr_admin') {
            onNavigate('/admin');
          } else {
            onNavigate('/dashboard');
          }
        }}
      />
    </div>
  );
};

