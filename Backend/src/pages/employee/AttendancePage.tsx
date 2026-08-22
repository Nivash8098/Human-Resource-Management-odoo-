import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { WorkdayPulse } from '../../components/features/WorkdayPulse';
import { AttendanceCalendar } from '../../components/features/AttendanceCalendar';
import { WeeklyAttendanceView } from '../../components/features/WeeklyAttendanceView';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { attendanceService } from '../../services/api';
import { AttendanceRecord } from '../../types';
import { formatTime, formatDuration, formatDate } from '../../lib/utils';
import { Clock, History, Filter, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [historyRecords, setHistoryRecords] = useState<AttendanceRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const loadAttendance = async () => {
    if (!user) return;
    const [today, history] = await Promise.all([
      attendanceService.getTodayRecord(user.id),
      attendanceService.getHistory(user.id)
    ]);
    setTodayRecord(today);
    setHistoryRecords(history);
  };

  useEffect(() => {
    loadAttendance();
  }, [user]);

  const filteredHistory = filterStatus === 'all'
    ? historyRecords
    : historyRecords.filter((r) => r.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="success" size="sm">Present</Badge>;
      case 'half_day':
        return <Badge variant="warning" size="sm">Half-Day</Badge>;
      case 'leave':
        return <Badge variant="info" size="sm">On Leave</Badge>;
      case 'absent':
        return <Badge variant="danger" size="sm">Absent</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
              Time Tracking
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500 font-medium">Auto-Synced</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Attendance & Workday Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your daily clock-ins, work mode, monthly attendance streaks, and duration.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const csv = ['Date,Check In,Check Out,Duration (min),Status,Work Mode']
              .concat(historyRecords.map((r) => `${r.date},${r.check_in},${r.check_out || ''},${r.duration_minutes},${r.status},${r.work_mode}`))
              .join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Dayflow-Attendance-${user?.employee_id || 'Logs'}.csv`;
            a.click();
          }}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export CSV
        </Button>
      </div>

      {/* Signature Workday Pulse Active Clock */}
      <WorkdayPulse initialRecord={todayRecord} onStatusChange={loadAttendance} />

      {/* Two-Column Views: Monthly Calendar & Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceCalendar records={historyRecords} />
        <WeeklyAttendanceView records={historyRecords} />
      </div>

      {/* Comprehensive Attendance History Log Table */}
      <Card className="shadow-xs border-slate-200/80">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            <CardTitle>Attendance Log History</CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="half_day">Half-Day</option>
              <option value="leave">On Leave</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Date</th>
                  <th className="py-3 px-4 sm:px-6">Check In</th>
                  <th className="py-3 px-4 sm:px-6">Check Out</th>
                  <th className="py-3 px-4 sm:px-6">Work Duration</th>
                  <th className="py-3 px-4 sm:px-6">Work Mode</th>
                  <th className="py-3 px-4 sm:px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                      {formatDate(rec.date)}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-700">
                      {formatTime(rec.check_in)}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-700">
                      {rec.check_out ? formatTime(rec.check_out) : '— Active —'}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-900 font-bold">
                      {formatDuration(rec.duration_minutes)}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {rec.work_mode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      {getStatusBadge(rec.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
