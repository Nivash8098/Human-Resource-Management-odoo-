import React from 'react';

export const CharacterBannerIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-64 sm:w-80 h-36 sm:h-44 select-none pointer-events-none ${className}`}>
      {/* Ambient background glow behind character */}
      <div className="absolute top-4 right-10 w-36 h-36 bg-blue-600/25 rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-20 w-44 h-24 bg-indigo-600/20 rounded-full blur-xl" />

      {/* Cyber City Skyscrapers Skyline Background with Lit Windows */}
      <div className="absolute inset-0 flex items-end justify-end pr-4 pb-3 opacity-40">
        <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="bldg-grad-1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0b1329" />
            </linearGradient>
            <linearGradient id="bldg-grad-2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="bldg-grad-3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#080e1a" />
            </linearGradient>
          </defs>

          {/* Far Buildings */}
          <rect x="20" y="45" width="28" height="135" fill="url(#bldg-grad-1)" rx="2" />
          <rect x="58" y="25" width="34" height="155" fill="url(#bldg-grad-2)" rx="2" />
          <rect x="100" y="60" width="24" height="120" fill="url(#bldg-grad-1)" rx="2" />
          <rect x="235" y="40" width="32" height="140" fill="url(#bldg-grad-2)" rx="2" />
          <rect x="275" y="65" width="38" height="115" fill="url(#bldg-grad-1)" rx="2" />

          {/* Glowing Windows Grid */}
          <circle cx="70" cy="40" r="1.5" fill="#38bdf8" opacity="0.9" />
          <circle cx="80" cy="40" r="1.5" fill="#38bdf8" opacity="0.7" />
          <circle cx="70" cy="52" r="1.5" fill="#93c5fd" opacity="0.8" />
          <circle cx="80" cy="52" r="1.5" fill="#38bdf8" opacity="0.9" />
          <circle cx="70" cy="64" r="1.5" fill="#38bdf8" opacity="0.7" />
          <circle cx="80" cy="64" r="1.5" fill="#60a5fa" opacity="0.8" />
          <circle cx="70" cy="76" r="1.5" fill="#38bdf8" opacity="0.9" />
          <circle cx="80" cy="76" r="1.5" fill="#93c5fd" opacity="0.7" />

          <circle cx="245" cy="55" r="1.5" fill="#38bdf8" opacity="0.9" />
          <circle cx="255" cy="55" r="1.5" fill="#60a5fa" opacity="0.8" />
          <circle cx="245" cy="67" r="1.5" fill="#93c5fd" opacity="0.7" />
          <circle cx="255" cy="67" r="1.5" fill="#38bdf8" opacity="0.9" />
          <circle cx="245" cy="79" r="1.5" fill="#38bdf8" opacity="0.8" />
        </svg>
      </div>

      {/* 3D Character at Desk with Laptop & HR Plant */}
      <div className="absolute inset-0 flex items-center justify-end pr-6">
        <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
          <defs>
            <linearGradient id="char-skin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#fba371" />
            </linearGradient>
            <linearGradient id="char-suit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
            <linearGradient id="char-hair" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="laptop-lid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="pot-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6b21a8" />
            </linearGradient>
            <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>

          {/* Character Hair Back */}
          <path d="M102 38 C90 38 82 52 82 68 C82 82 92 90 95 92 L145 92 C148 90 158 82 158 68 C158 52 150 38 138 38 Z" fill="url(#char-hair)" />

          {/* Ears */}
          <circle cx="94" cy="74" r="7" fill="url(#char-skin)" />
          <circle cx="146" cy="74" r="7" fill="url(#char-skin)" />

          {/* Character Head */}
          <ellipse cx="120" cy="72" rx="26" ry="30" fill="url(#char-skin)" />

          {/* Front Hair Strands / Pompadour */}
          <path d="M94 56 C96 40 110 32 125 32 C142 32 152 42 150 56 C144 48 134 46 122 46 C110 46 98 50 94 56 Z" fill="url(#char-hair)" />
          <path d="M94 56 C90 62 90 68 93 72 C96 66 98 62 102 60 Z" fill="url(#char-hair)" />

          {/* Eyebrows & Eyes */}
          <path d="M104 64 Q111 61 115 64" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M125 64 Q129 61 136 64" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="110" cy="72" r="3.2" fill="#0f172a" />
          <circle cx="130" cy="72" r="3.2" fill="#0f172a" />
          <circle cx="111.5" cy="70.5" r="1.2" fill="#ffffff" />
          <circle cx="131.5" cy="70.5" r="1.2" fill="#ffffff" />

          {/* Cheerful Smile */}
          <path d="M114 82 Q120 88 126 82" stroke="#e06253" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Subtle blush */}
          <circle cx="103" cy="78" r="4" fill="#f43f5e" opacity="0.25" />
          <circle cx="137" cy="78" r="4" fill="#f43f5e" opacity="0.25" />

          {/* Neck */}
          <path d="M112 96 L128 96 L129 108 L111 108 Z" fill="url(#char-skin)" />

          {/* Shirt Collar (Cyan/White) */}
          <path d="M110 106 L120 120 L130 106 Z" fill="#e0f2fe" />
          <path d="M120 120 L120 138" stroke="#38bdf8" strokeWidth="2" />

          {/* Suit Jacket Body (Purple / Indigo) */}
          <path d="M82 110 C82 106 95 102 110 106 L118 124 L94 165 C88 160 82 140 82 110 Z" fill="url(#char-suit)" />
          <path d="M158 110 C158 106 145 102 130 106 L122 124 L146 165 C152 160 158 140 158 110 Z" fill="url(#char-suit)" />
          <path d="M110 106 L120 124 L130 106 L134 165 L106 165 Z" fill="#4f46e5" />

          {/* Arms typing on laptop */}
          <path d="M84 125 C84 140 98 152 112 152 L112 144 C100 144 92 135 92 125 Z" fill="url(#char-suit)" />
          <path d="M156 125 C156 140 142 152 128 152 L128 144 C140 144 148 135 148 125 Z" fill="url(#char-suit)" />

          {/* Hands */}
          <circle cx="112" cy="148" r="6" fill="url(#char-skin)" />
          <circle cx="128" cy="148" r="6" fill="url(#char-skin)" />

          {/* Open Laptop */}
          {/* Laptop Base */}
          <path d="M96 150 L144 150 L150 156 L90 156 Z" fill="#475569" />
          {/* Laptop Screen Lid angled */}
          <path d="M98 122 L142 122 L144 150 L96 150 Z" fill="url(#laptop-lid)" stroke="#64748b" strokeWidth="1" />
          {/* Glowing Laptop Screen back logo */}
          <circle cx="120" cy="136" r="3.5" fill="#38bdf8" className="animate-pulse" />

          {/* HR Plant on the Right Desk */}
          <g transform="translate(180, 115)">
            {/* Plant Pot */}
            <path d="M12 24 L28 24 L25 44 L15 44 Z" fill="url(#pot-grad)" />
            <rect x="10" y="22" width="20" height="4" rx="2" fill="#c084fc" />
            <text x="20" y="38" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">HR</text>
            {/* Plant Leaves */}
            <path d="M20 22 C14 12 10 10 6 12 C4 18 12 22 20 22 Z" fill="url(#leaf-grad)" />
            <path d="M20 22 C26 10 32 8 36 12 C36 18 28 22 20 22 Z" fill="url(#leaf-grad)" />
            <path d="M20 22 C18 6 22 4 24 4 C28 10 24 18 20 22 Z" fill="#86efac" />
          </g>
        </svg>
      </div>
    </div>
  );
};
