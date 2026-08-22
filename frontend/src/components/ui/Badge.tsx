import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full whitespace-nowrap select-none transition-colors';

  const variants = {
    default: 'bg-indigo-950/70 text-indigo-300 border border-indigo-700/60 font-semibold',
    success: 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 font-semibold',
    warning: 'bg-amber-950/70 text-amber-300 border border-amber-700/60 font-semibold',
    danger: 'bg-rose-950/70 text-rose-300 border border-rose-700/60 font-semibold',
    info: 'bg-sky-950/70 text-sky-300 border border-sky-700/60 font-semibold',
    neutral: 'bg-slate-800/90 text-slate-300 border border-slate-700/80 font-semibold',
    purple: 'bg-purple-950/70 text-purple-300 border border-purple-700/60 font-semibold',
  };

  const dotColors = {
    default: 'bg-indigo-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
    purple: 'bg-purple-500',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 leading-normal',
    md: 'text-xs px-2.5 py-1 gap-1.5 leading-normal',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant])} />}
      {children}
    </span>
  );
};
