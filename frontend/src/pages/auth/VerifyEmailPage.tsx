import React from 'react';
import { NexoraLogo } from '../../components/brand/NexoraLogo';
import { MailCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface VerifyEmailPageProps {
  onNavigate: (route: string) => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-6 text-center flex flex-col items-center relative z-10">
        <NexoraLogo size="lg" />
      </div>

      <div className="w-full max-w-md bg-[#0c1424]/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-3xl p-6 sm:p-8 text-center space-y-5 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-blue-950/80 border border-blue-500/40 text-sky-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
          <MailCheck className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Verify your email</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            We sent an email verification link to your corporate inbox. Click the link inside to activate your Nexora enterprise session.
          </p>
        </div>

        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400">
          Didn't receive the email? Check your spam folder or contact your HR administrator.
        </div>

        <button
          onClick={() => onNavigate('/dashboard')}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <span>Proceed to Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/sign-in')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
