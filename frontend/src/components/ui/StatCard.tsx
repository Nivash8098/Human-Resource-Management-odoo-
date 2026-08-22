import React from 'react';
import { cn } from '../../lib/utils';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  description?: string;
  change?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  } | 'up' | 'down' | 'neutral';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  description,
  change,
  icon,
  trend,
  className
}) => {
  const isTrendObject = typeof trend === 'object' && trend !== null;
  const isTrendString = typeof trend === 'string';
  const isPositive = isTrendObject ? trend.isPositive : trend === 'up';

  return (
    <Card className={cn('p-5 sm:p-6 flex flex-col justify-between bg-[#0b1325]/90 border border-slate-800/90 rounded-2xl shadow-xl', className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{title}</span>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-blue-950/60 text-sky-400 border border-blue-800/40 flex items-center justify-center shrink-0 shadow-sm">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">{value}</div>
        {(subtitle || description) && (
          <p className="text-xs text-slate-300 mt-1 font-medium">{subtitle || description}</p>
        )}
      </div>

      {(isTrendObject || change) && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-bold',
              isPositive ? 'text-emerald-400' : 'text-slate-300'
            )}
          >
            {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
            {isTrendObject ? trend.value : change}
          </span>
          {isTrendObject && trend.label && <span className="text-slate-400 font-medium">{trend.label}</span>}
        </div>
      )}
    </Card>
  );
};
