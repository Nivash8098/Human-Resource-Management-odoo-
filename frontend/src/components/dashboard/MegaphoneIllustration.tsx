import React from 'react';

export const MegaphoneIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-32 flex items-center justify-center select-none ${className}`}>
      {/* Ambient circular glow behind megaphone */}
      <div className="absolute w-28 h-28 bg-indigo-600/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute w-20 h-20 bg-sky-500/25 rounded-full blur-xl pointer-events-none" />

      <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-32 drop-shadow-[0_12px_24px_rgba(79,70,229,0.4)]">
        <defs>
          <linearGradient id="podium-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="podium-base" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="mega-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="40%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="mega-bell" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="mega-handle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
        </defs>

        {/* 3D Glowing Podium Base */}
        <ellipse cx="100" cy="106" rx="65" ry="16" fill="url(#podium-base)" />
        <ellipse cx="100" cy="104" rx="60" ry="14" fill="#0f172a" stroke="url(#podium-ring)" strokeWidth="2.5" />
        <ellipse cx="100" cy="102" rx="46" ry="10" fill="#1e1b4b" opacity="0.8" />

        {/* Sound Wave Ripple Bubbles */}
        <g opacity="0.85">
          <circle cx="152" cy="42" r="3" fill="#38bdf8" />
          <circle cx="166" cy="32" r="4.5" fill="#818cf8" />
          <circle cx="178" cy="50" r="2.5" fill="#c084fc" />

          {/* Sound wave arcs */}
          <path d="M148 46 C155 52 155 64 148 70" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M158 38 C170 48 170 68 158 78" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <path d="M168 30 C184 44 184 76 168 90" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* Megaphone Handle */}
        <path d="M68 76 L76 96 C77 98 81 98 83 95 L88 78 Z" fill="url(#mega-handle)" />

        {/* Megaphone Back Cap / Cylinder */}
        <ellipse cx="56" cy="62" rx="10" ry="16" fill="#312e81" />
        <ellipse cx="56" cy="62" rx="8" ry="14" fill="#4338ca" />
        <circle cx="56" cy="62" r="4" fill="#818cf8" />

        {/* Megaphone Cone Body */}
        <path d="M56 48 L124 30 C128 29 132 32 132 37 L132 87 C132 92 128 95 124 94 L56 76 Z" fill="url(#mega-body)" />

        {/* Glossy Reflection Band */}
        <path d="M62 52 L120 36 C124 35 128 38 128 42 L128 48 L62 60 Z" fill="#ffffff" opacity="0.25" />

        {/* Front Flared Bell Ring (3D Rim) */}
        <ellipse cx="126" cy="62" rx="14" ry="32" fill="url(#mega-bell)" />
        <ellipse cx="126" cy="62" rx="9" ry="24" fill="#1e1b4b" />

        {/* Center Mic Core */}
        <circle cx="126" cy="62" r="5" fill="#38bdf8" />
        <circle cx="125" cy="60" r="1.5" fill="#ffffff" />
      </svg>
    </div>
  );
};
