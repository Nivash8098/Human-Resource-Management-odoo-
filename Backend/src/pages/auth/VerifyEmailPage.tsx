import React from 'react';
import { Logo } from '../../components/brand/Logo';
import { Button } from '../../components/ui/Button';
import { MailCheck, ArrowRight } from 'lucide-react';

interface VerifyEmailPageProps {
  onNavigate: (route: string) => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="mb-6 text-center flex flex-col items-center">
        <Logo size="lg" showTagline />
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
          <MailCheck className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verify your email</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            We sent an email verification link to your corporate inbox. Click the link inside to activate your Dayflow enterprise session.
          </p>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
          Didn't receive the email? Check your spam folder or contact your HR administrator.
        </div>

        <Button
          size="lg"
          variant="primary"
          onClick={() => onNavigate('/dashboard')}
          className="w-full font-semibold"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Proceed to Workspace
        </Button>
      </div>
    </div>
  );
};
