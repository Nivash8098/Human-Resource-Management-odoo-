import React, { useState, useEffect } from 'react';
import { AttendanceRecord, WorkMode } from '../../types';
import { attendanceService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatTime, formatDuration } from '../../lib/utils';
import { 
  Activity, 
  Play, 
  Square, 
  Clock, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

interface WorkdayPulseProps {
  initialRecord?: AttendanceRecord | null;
  workMode?: WorkMode;
  onStatusChange?: () => void;
}

export const WorkdayPulse: React.FC<WorkdayPulseProps> = ({ 
  initialRecord, 
  workMode = 'office', 
  onStatusChange 
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(initialRecord || null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Sync initialRecord
  useEffect(() => {
    if (initialRecord !== undefined) {
      setTodayRecord(initialRecord);
    }
  }, [initialRecord]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isCheckedIn = Boolean(todayRecord?.check_in && !todayRecord?.check_out);
  const isCompleted = Boolean(todayRecord?.check_in && todayRecord?.check_out);

  const handleCheckIn = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const rec = await attendanceService.checkIn(user.id, (workMode || 'office') as WorkMode);
      setTodayRecord(rec);
      success('Checked in successfully', `Workday started at ${formatTime(rec.check_in)} (${workMode.toUpperCase()})`);
      if (onStatusChange) onStatusChange();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to check in';
      error('Check In Failed', message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const rec = await attendanceService.checkOut(user.id);
      setTodayRecord(rec);
      success('Checked out successfully', `Total worked: ${formatDuration(rec.duration_minutes)}. Have a great evening!`);
      if (onStatusChange) onStatusChange();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to check out';
      error('Check Out Failed', message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Formatted date string
  const dateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(currentTime);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString();

  // Progress percentage on timeline
  const nowPercent = isCheckedIn ? 52 : isCompleted ? 100 : 45;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2563EB] via-[#4338CA] to-[#6366F1] text-white p-6 sm:p-8 shadow-xl shadow-blue-500/15 select-none">
      {/* Dynamic Background Waves / Light Streaks */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        <svg viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <path d="M-100 200 C 200 80, 500 350, 1100 150" stroke="white" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />
          <path d="M-50 250 C 300 120, 650 320, 1150 180" stroke="url(#blue-glow)" strokeWidth="3" opacity="0.8" />
          <path d="M0 320 C 400 200, 700 390, 1200 240" stroke="white" strokeWidth="1.5" opacity="0.4" />
          <defs>
            <linearGradient id="blue-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#a5b4fc" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-200" />
              <span className="font-extrabold tracking-wider text-xs uppercase text-white">
                WORKDAY PULSE
              </span>
            </div>
            <span className="w-1 h-1 rounded-full bg-blue-300" />
            <span className="text-xs text-blue-100 font-medium">
              {dateFormatted}
            </span>
          </div>

          {/* Status Tag Pill from screenshot */}
          <div>
            {isCheckedIn ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Checked In
              </span>
            ) : isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-950/80 text-sky-300 border border-blue-500/50 shadow-md">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Shift Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/50 shadow-md">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Not Checked In
              </span>
            )}
          </div>
        </div>

        {/* Main Clock & CTA Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-1">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono drop-shadow-sm">
                {displayHours}:{minutes}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-blue-200 font-mono">
                {ampm}
              </span>
            </div>
            <p className="text-xs text-blue-100 font-medium mt-1">
              Local System Time
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2.5">
            <span className="text-xs text-blue-100 font-medium">
              {isCheckedIn ? 'Workday is active. Stay focused & productive.' : isCompleted ? 'All workday hours logged for today.' : 'Start your workday and make it productive'}
            </span>
            
            {isCheckedIn ? (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCheckOut}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-lg shadow-rose-900/30 transition-all active:scale-95 border border-white/20 disabled:opacity-75"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>CHECK OUT</span>
              </button>
            ) : isCompleted ? (
              <button
                type="button"
                disabled
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-white/20 text-white shadow-sm border border-white/20"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>COMPLETED</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCheckIn}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-500 via-indigo-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-800 text-white shadow-lg shadow-indigo-950/40 transition-all active:scale-95 border border-white/25 disabled:opacity-75"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>CHECK IN</span>
              </button>
            )}
          </div>
        </div>

        {/* Timeline Bar matching screenshot */}
        <div className="pt-4 sm:pt-6">
          <div className="relative flex items-center justify-between text-xs text-blue-100">
            {/* Background Line */}
            <div className="absolute left-6 right-6 top-3 h-0.5 bg-white/20 -translate-y-1/2">
              <div 
                className="h-full bg-gradient-to-r from-blue-300 to-white transition-all duration-700" 
                style={{ width: `${nowPercent}%` }} 
              />
            </div>

            {/* Check-in Node */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-xs">
                <Clock className="w-3 h-3 text-white" />
              </div>
              <div className="text-center">
                <div className="text-[10.5px] text-blue-200 font-medium">Check-in</div>
                <div className="text-[11px] font-bold text-white">
                  {todayRecord?.check_in ? formatTime(todayRecord.check_in) : '08:00 AM'}
                </div>
              </div>
            </div>

            {/* Now Node (pulsing dot with halo) */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute w-5 h-5 rounded-full bg-cyan-300 opacity-60" />
                <div className="w-4 h-4 rounded-full bg-white ring-4 ring-white/30 shadow-md" />
              </div>
              <div className="text-center">
                <div className="text-[11px] font-bold text-white">Now</div>
              </div>
            </div>

            {/* Expected Checkout Node */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
              <div className="text-center">
                <div className="text-[10.5px] text-blue-200 font-medium">Expected checkout</div>
                <div className="text-[11px] font-bold text-white">
                  {todayRecord?.check_out ? formatTime(todayRecord.check_out) : '06:00 PM'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

