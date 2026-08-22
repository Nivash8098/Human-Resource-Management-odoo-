import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 focus-visible:ring-blue-500 shadow-md shadow-blue-500/20 font-bold',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 active:bg-slate-900 border border-slate-700/80 focus-visible:ring-slate-500 font-semibold',
      outline: 'border border-slate-700 bg-[#121c30] text-slate-200 hover:bg-[#182540] hover:border-slate-600 hover:text-white active:bg-slate-900 focus-visible:ring-blue-500 shadow-xs font-semibold',
      ghost: 'bg-transparent text-slate-300 hover:bg-slate-800/80 active:bg-slate-800 hover:text-white focus-visible:ring-slate-500 font-medium',
      danger: 'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 active:from-rose-700 active:to-red-700 focus-visible:ring-rose-500 shadow-sm shadow-rose-500/20 font-bold',
      success: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 focus-visible:ring-emerald-500 shadow-sm shadow-emerald-500/20 font-bold',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2 gap-2 h-10',
      lg: 'text-base px-5 py-2.5 gap-2.5 h-12',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
