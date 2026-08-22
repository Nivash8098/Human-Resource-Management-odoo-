import React, { useState, useEffect } from 'react';
import { copilotTools } from '../../services/ai/tools';
import { DailyHRBriefingData } from '../../types/copilot.types';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Users, 
  CheckCircle2,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface CopilotBriefingBannerProps {
  onOpenCopilot: (initialQuery?: string) => void;
  onNavigate: (route: string) => void;
}

export const CopilotBriefingBanner: React.FC<CopilotBriefingBannerProps> = ({
  onOpenCopilot,
  onNavigate
}) => {
  const [briefing, setBriefing] = useState<DailyHRBriefingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBriefing = async () => {
      try {
        const data = await copilotTools.getDailyHRBriefing();
        setBriefing(data);
      } catch (e) {
        console.error('Failed to load HR briefing', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadBriefing();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-[#0b1328] via-[#0d1838] to-[#101d44] border border-blue-900/40 p-4 sm:p-5 shadow-xl animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-900/60" />
          <div className="space-y-1.5 flex-1">
            <div className="w-48 h-3.5 bg-blue-900/60 rounded" />
            <div className="w-80 h-2.5 bg-blue-900/40 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!briefing) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#091124] via-[#0c183a] to-[#0f1d48] border border-blue-800/40 p-4 sm:p-5 shadow-xl">
      {/* Background glow flares */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-60 h-30 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: AI Icon + Summary & Highlights */}
        <div className="flex items-start sm:items-center gap-3.5 max-w-2xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 shrink-0 mt-0.5 sm:mt-0">
            <div className="w-full h-full rounded-[11px] bg-[#080f20] flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 font-mono">
                Dayflow AI Workforce Intelligence
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 hidden sm:inline-block" />
              <span className="text-xs text-slate-300 font-medium">
                {briefing.dateStr}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 mt-1 font-normal leading-relaxed">
              {briefing.insights[0] || "All workforce operations are actively monitored."}{' '}
              {briefing.actionsRequired.pendingLeavesCount > 0 && (
                <span className="text-amber-300 font-medium">
                  {briefing.actionsRequired.pendingLeavesCount} time-off request{briefing.actionsRequired.pendingLeavesCount > 1 ? 's' : ''} awaiting review.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Button & Trigger */}
        <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
          <button
            type="button"
            onClick={() => onOpenCopilot()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-900/40 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open HR Copilot</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom Quick Chips for instantaneous answers */}
      <div className="relative z-10 mt-3.5 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">
          Quick Inquiries:
        </span>

        <button
          type="button"
          onClick={() => onOpenCopilot("Who is absent today?")}
          className="px-2.5 py-1 rounded-lg bg-[#0d172e] hover:bg-slate-850 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white text-[11px] font-medium transition-all flex items-center gap-1.5 shrink-0"
        >
          <Clock className="w-3 h-3 text-cyan-400" />
          <span>Who is absent?</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenCopilot("Show pending leave requests")}
          className="px-2.5 py-1 rounded-lg bg-[#0d172e] hover:bg-slate-850 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white text-[11px] font-medium transition-all flex items-center gap-1.5 shrink-0"
        >
          <Calendar className="w-3 h-3 text-amber-400" />
          <span>Pending leaves ({briefing.actionsRequired.pendingLeavesCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenCopilot("Are there any attendance anomalies?")}
          className="px-2.5 py-1 rounded-lg bg-[#0d172e] hover:bg-slate-850 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white text-[11px] font-medium transition-all flex items-center gap-1.5 shrink-0"
        >
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          <span>Exceptions ({briefing.actionsRequired.attendanceAnomaliesCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenCopilot("Give me the payroll summary for this month")}
          className="px-2.5 py-1 rounded-lg bg-[#0d172e] hover:bg-slate-850 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white text-[11px] font-medium transition-all flex items-center gap-1.5 shrink-0"
        >
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span>Payroll status</span>
        </button>
      </div>
    </div>
  );
};
