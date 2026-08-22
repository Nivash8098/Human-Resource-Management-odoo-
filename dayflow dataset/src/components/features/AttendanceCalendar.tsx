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
    <Card className="shadow-xs border-slate-200/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-indigo-600" />
          <CardTitle>Attendance Calendar</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800">August 2026</span>
          <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100">
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
            <div key={`offset-${i}`} className="h-10 sm:h-12 rounded-lg bg-slate-50/40 opacity-40" />
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
                className={`h-10 sm:h-12 rounded-lg p-1 flex flex-col items-center justify-between border transition-all text-xs ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 border-indigo-400 bg-indigo-50/50'
                    : isToday
                    ? 'border-indigo-600 bg-indigo-50/30 font-bold text-indigo-950'
                    : isWeekend
                    ? 'border-transparent bg-slate-50/70 text-slate-400'
                    : 'border-slate-100 bg-white hover:border-slate-300 text-slate-800'
                }`}
              >
                <span className={`text-[11px] ${isToday ? 'font-extrabold text-indigo-600' : ''}`}>
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
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
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
              <span className="w-2 h-2 rounded-full bg-slate-300" /> Weekend
            </span>
          </div>

          {selectedDay && (
            <div className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
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
