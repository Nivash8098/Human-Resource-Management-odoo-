import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AttendanceRecord } from '../../types';
import { formatTime, formatDuration } from '../../lib/utils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ records }) => {
  const [currentMonth] = useState<Date>(new Date(2026, 7, 1)); // August 2026
  const [selectedDay, setSelectedDay] = useState<{ day: number; record?: AttendanceRecord } | null>(null);

  // Month days setup for August 2026
  const daysInMonth = 31;
  const startDayOffset = 6; // Aug 1, 2026 is Saturday

  const weekHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getRecordForDay = (day: number): AttendanceRecord | undefined => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateQuery = `2026-08-${dayStr}`;
    return records.find((r) => r.date === dateQuery);
  };

  const renderStatusDot = (status?: string) => {
    if (!status) return null;
    switch (status) {
      case 'present':
        return <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />;
      case 'half_day':
        return <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />;
      case 'leave':
        return <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />;
      case 'absent':
        return <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-sky-400" />
          <CardTitle>Attendance Calendar</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white">August 2026</span>
          <button type="button" className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {weekHeaders.map((w) => (
            <div key={w} className="py-1.5 font-bold text-slate-400 text-[11px] uppercase tracking-wider">
              {w}
            </div>
          ))}

          {/* Blank offset days */}
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`offset-${i}`} className="h-10 sm:h-12 rounded-lg bg-slate-900/40 opacity-40" />
          ))}

          {/* Month Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const rec = getRecordForDay(day);
            const isToday = day === 21; // Today in demo context
            const isWeekend = (day + startDayOffset - 1) % 7 === 0 || (day + startDayOffset - 1) % 7 === 6;
            const isSelected = selectedDay?.day === day;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay({ day, record: rec })}
                className={`h-10 sm:h-12 rounded-lg p-1 flex flex-col items-center justify-between border transition-all text-xs cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-blue-500 border-blue-400 bg-blue-950/60'
                    : isToday
                    ? 'border-blue-500 bg-blue-950/40 font-bold text-sky-300'
                    : isWeekend
                    ? 'border-transparent bg-slate-900/40 text-slate-500'
                    : 'border-slate-800 bg-[#0d1627] hover:border-slate-700 text-slate-200'
                }`}
              >
                <span className={`text-[11px] ${isToday ? 'font-extrabold text-sky-400' : ''}`}>
                  {day}
                </span>
                <div className="flex items-center gap-0.5 mt-auto">
                  {rec ? (
                    renderStatusDot(rec.status)
                  ) : !isWeekend && day < 21 ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Present
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Half-day
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" /> Leave
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-600" /> Weekend
            </span>
          </div>

          {selectedDay && (
            <div className="text-[11px] font-medium text-slate-200 bg-[#121c30] border border-slate-700 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>
                Aug {selectedDay.day}: {selectedDay.record ? `${selectedDay.record.status.toUpperCase()} (${formatTime(selectedDay.record.check_in)} - ${formatTime(selectedDay.record.check_out)})` : 'Standard Workday'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
