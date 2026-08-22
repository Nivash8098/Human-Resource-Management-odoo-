import React, { useState, useEffect } from 'react';
import { MegaphoneIllustration } from './MegaphoneIllustration';

interface Announcement {
  id: string;
  title: string;
  description: string;
}

const announcements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Team Meeting Tomorrow!',
    description: 'Monthly team meeting at 10:00 AM in Conference Room A.',
  },
  {
    id: 'ann-2',
    title: 'Quarterly Town Hall on Friday',
    description: 'All-hands review with executive leadership at 3:00 PM PST.',
  },
  {
    id: 'ann-3',
    title: 'Health & Wellness Benefit Update',
    description: 'New annual wellness allowance claims are now open in portal.',
  },
  {
    id: 'ann-4',
    title: 'Hackathon 2026 Registration',
    description: 'Sign up your cross-functional project team by next Monday.',
  },
];

export const CompanyAnnouncementsCard: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto rotate announcement every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[activeIndex];

  return (
    <div className="bg-[#0b1222]/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden h-full">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <h3 className="text-sm font-bold text-white tracking-tight uppercase">Company Announcements</h3>
      </div>

      {/* 3D Megaphone Graphic */}
      <div className="relative z-10 py-1 flex items-center justify-center">
        <MegaphoneIllustration />
      </div>

      {/* Text Content */}
      <div className="text-center relative z-10 px-2 min-h-[64px] flex flex-col justify-center">
        <h4 className="text-sm font-bold text-indigo-300 drop-shadow-sm transition-all duration-300">
          {current.title}
        </h4>
        <p className="text-xs text-slate-200 mt-1.5 leading-relaxed line-clamp-2 transition-all duration-300 font-medium">
          {current.description}
        </p>
      </div>

      {/* Carousel Navigation Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-2 relative z-10">
        {announcements.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? 'w-4 bg-indigo-500 shadow-sm shadow-indigo-500/50'
                : 'w-1.5 bg-slate-700 hover:bg-slate-500'
            }`}
            aria-label={`Go to announcement ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
