import React from 'react';

interface NexoraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'standard' | 'hr';
  subtitle?: string;
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'standard',
  subtitle,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9.5px]' },
    md: { icon: 'w-9 h-9', text: 'text-lg', sub: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3D Folded Ribbon "N" Mark */}
      <div className={`relative ${currentSize.icon} shrink-0 drop-shadow-[0_8px_16px_rgba(30,144,255,0.5)]`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="nexora-left-leg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="nexora-diag-front" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="40%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="nexora-diag-back" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="60%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <linearGradient id="nexora-right-leg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
          </defs>

          {/* Left Vertical Ribbon */}
          <path
            d="M20 18 C20 14 24 12 28 15 L42 25 C45 27 46 31 46 35 L46 80 C46 84 41 87 37 84 L24 74 C21 72 20 68 20 64 Z"
            fill="url(#nexora-left-leg)"
          />

          {/* Diagonal Crossing Ribbon */}
          <path
            d="M25 24 L75 76 C78 79 83 77 83 72 L83 62 C83 58 80 54 76 51 L36 17 C32 14 26 17 26 22 Z"
            fill="url(#nexora-diag-back)"
            opacity="0.95"
          />

          <path
            d="M34 18 L76 68 C80 73 80 79 75 83 L66 88 C61 91 55 89 52 84 L18 36 C15 31 16 25 21 21 L28 17 C30 15 33 16 34 18 Z"
            fill="url(#nexora-diag-front)"
          />

          {/* Right Vertical Pillar */}
          <path
            d="M58 20 C58 16 62 13 66 16 L79 26 C82 28 84 32 84 36 L84 82 C84 86 80 88 76 86 L62 76 C59 74 58 70 58 66 Z"
            fill="url(#nexora-right-leg)"
          />

          {/* Top Edge Highlight */}
          <path
            d="M28 15 L42 25 L36 29 L22 19 Z"
            fill="#bae6fd"
            opacity="0.8"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className={`font-black tracking-wide text-white ${currentSize.text} font-sans uppercase flex items-center gap-1.5`}>
            <span>NEXORA</span>
            {variant === 'hr' && (
              <span className="text-white font-extrabold">HR</span>
            )}
          </div>
          <span className={`text-slate-400 font-medium ${currentSize.sub}`}>
            {subtitle || (variant === 'hr' ? 'Human Resource' : 'Workforce System')}
          </span>
        </div>
      )}
    </div>
  );
};
