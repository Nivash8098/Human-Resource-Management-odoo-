import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-[#0b1325]/90 rounded-2xl border border-dashed border-slate-700/80', className)}>
      <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-blue-400 border border-slate-700/80 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-300 max-w-sm mt-1 mb-5 leading-relaxed font-medium">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
