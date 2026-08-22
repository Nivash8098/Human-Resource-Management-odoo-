import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AttendanceRecord } from '../../types';
import { formatTime, formatDuration } from '../../lib/utils';
import { Clock } from 'lucide-react';

interface WeeklyAttendanceViewProps {
  records: AttendanceRecord[];
}

export const WeeklyAttendanceView: React.FC<WeeklyAttendanceViewProps> = ({ records }) => {
  // Days of current work week
  const weekDays = [
    { label: 'Monday', short: 'Mon' },
    { label: 'Tuesday', short: 'Tue' },
    { label: 'Wednesday', short: 'Wed' },
    { label: 'Thursday', short: 'Thu' },
    { label: 'Friday', short: 'Fri' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="success" size="sm">Present</Badge>;
      case 'half_day':
        return <Badge variant="warning" size="sm">Half-day</Badge>;
      case 'leave':
        return <Badge variant="info" size="sm">Leave</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Off</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <CardTitle>Weekly Work Schedule</CardTitle>
        </div>
        <span className="text-xs text-slate-400 font-medium">Standard 40h target</span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-800/80">
          {weekDays.map((day, idx) => {
            const match = records[idx] || null;
            const duration = match ? match.duration_minutes : 480;
            const status = match ? match.status : (idx === 4 ? 'not_checked_in' : 'present');
            const checkIn = match?.check_in || '09:00:00';
            const checkOut = match?.check_out || '17:30:00';

            return (
              <div
                key={day.label}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-3 w-36 shrink-0">
                  <div className="w-9 h-9 rounded-lg bg-[#121c30] border border-slate-700/80 flex items-center justify-center font-bold text-slate-300 text-xs">
                    {day.short}
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white">{day.label}</h5>
                    <span className="text-[11px] text-slate-400">Regular shift</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-8 flex-1 justify-start sm:justify-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">In</span>
                    <span className="font-mono font-medium text-slate-200">{formatTime(checkIn)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Out</span>
                    <span className="font-mono font-medium text-slate-200">{formatTime(checkOut)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
                    <span className="font-mono font-bold text-sky-400">{formatDuration(duration)}</span>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  {getStatusBadge(status)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
