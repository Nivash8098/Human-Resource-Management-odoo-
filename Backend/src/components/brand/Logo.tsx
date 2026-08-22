import React from 'react';
import { cn } from '../../lib/utils';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  isLight?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  className,
  isLight = true
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-sm font-extrabold tracking-tight',
    md: 'text-base font-extrabold tracking-tight',
    lg: 'text-xl font-extrabold tracking-tight',
  };

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      {/* Precision Circular Brand Mark with Glowing Blue Gradient */}
      <div className={cn('relative rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-1.5 text-white shadow-md shadow-blue-500/20 flex items-center justify-center shrink-0 ring-1 ring-white/20', iconSizes[size])}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-900/60 to-blue-700/60 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-white" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="3" fill="white" />
            <circle cx="16" cy="8" r="2" fill="#38bdf8" />
            <circle cx="16" cy="16" r="3" fill="white" fillOpacity="0.9" />
            <circle cx="8" cy="16" r="2" fill="#818cf8" />
            <path d="M8 8L16 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 leading-none">
          <span className={cn('font-black tracking-wider uppercase', textSizes[size], isLight ? 'text-white' : 'text-slate-900')}>
            DAY<span className="text-blue-400 font-black">FLOW</span>
          </span>
        </div>
        {showTagline && (
          <span className={cn('text-[9.5px] font-medium tracking-normal mt-0.5', isLight ? 'text-slate-400' : 'text-slate-500')}>
            Every workday, perfectly aligned.
          </span>
        )}
      </div>
    </div>
  );
};

