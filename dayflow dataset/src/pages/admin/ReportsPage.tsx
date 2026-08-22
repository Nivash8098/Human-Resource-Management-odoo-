import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { useToast } from '../../context/ToastContext';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Calendar, 
  Users, 
  Download, 
  Filter 
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { success } = useToast();
  const [timeRange, setTimeRange] = useState('30d');

  // 30-Day Attendance Trend Data
  const attendanceTrendData = [
    { date: 'Aug 01', rate: 94, present: 5, target: 95 },
    { date: 'Aug 04', rate: 98, present: 6, target: 95 },
    { date: 'Aug 07', rate: 92, present: 5, target: 95 },
    { date: 'Aug 10', rate: 96, present: 6, target: 95 },
    { date: 'Aug 13', rate: 95, present: 5, target: 95 },
    { date: 'Aug 16', rate: 100, present: 6, target: 95 },
    { date: 'Aug 19', rate: 94, present: 5, target: 95 },
    { date: 'Aug 21', rate: 96, present: 5, target: 95 },
  ];

  // Monthly Leave Utilization Data
  const leaveUtilizationData = [
    { month: 'Mar', paid: 4, sick: 1, unpaid: 0 },
    { month: 'Apr', paid: 6, sick: 2, unpaid: 0 },
    { month: 'May', paid: 8, sick: 1, unpaid: 1 },
    { month: 'Jun', paid: 12, sick: 3, unpaid: 0 },
    { month: 'Jul', paid: 15, sick: 2, unpaid: 0 },
    { month: 'Aug', paid: 10, sick: 2, unpaid: 0 },
  ];

  // Department Headcount Breakdown Data
  const departmentData = [
    { name: 'Engineering', value: 2, color: '#4f46e5' },
    { name: 'Product Design', value: 1, color: '#0ea5e9' },
    { name: 'Marketing', value: 1, color: '#10b981' },
    { name: 'Finance', value: 1, color: '#f59e0b' },
    { name: 'People Ops', value: 1, color: '#8b5cf6' },
  ];

  // Work Mode Breakdown
  const workModeData = [
    { name: 'In-Office', value: 3, color: '#4f46e5' },
    { name: 'Hybrid', value: 2, color: '#06b6d4' },
    { name: 'Remote', value: 1, color: '#10b981' },
  ];

  const handleExport = () => {
    success('Report Exported', 'Dayflow HR Analytics report CSV downloaded successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
              Workforce Intelligence
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500 font-medium">Recharts Visualizations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            HR Analytics & Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deep insights into organizational attendance, leave utilization, headcount, and work patterns.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 outline-none"
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter (Q3)</option>
            <option value="ytd">Year to Date (2026)</option>
          </select>

          <Button
            variant="primary"
            onClick={handleExport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV Report
          </Button>
        </div>
      </div>

      {/* 4 Core Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Organization Attendance"
          value="96.2%"
          change="+1.4% vs last month"
          trend="up"
          description="Consistent punctuality benchmark"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        />

        <StatCard
          title="Avg. Workweek Duration"
          value="41.5 hrs"
          change="Healthy workload"
          trend="neutral"
          description="Target: 40.0 standard hours"
          icon={<Clock className="w-5 h-5 text-indigo-600" />}
        />

        <StatCard
          title="Avg. Leave Utilization"
          value="4.2 Days"
          change="Optimal range"
          trend="neutral"
          description="Prevents burnout fatigue"
          icon={<Calendar className="w-5 h-5 text-purple-600" />}
        />

        <StatCard
          title="Total Active Workforce"
          value="6 Members"
          change="100% Retained"
          trend="up"
          description="0% voluntary attrition"
          icon={<Users className="w-5 h-5 text-sky-600" />}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: 30-Day Attendance Trend */}
        <Card className="shadow-xs border-slate-200/80 p-5">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Daily Workforce Attendance Trend (%)
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">30-Day punctuality & check-in trajectory</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Avg 96.2%
              </span>
            </div>
          </CardHeader>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#attendanceGradient)" name="Attendance %" />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} name="Target (95%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Monthly Leave Utilization Breakdown */}
        <Card className="shadow-xs border-slate-200/80 p-5">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Monthly Leave Utilization (Days Taken)
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Paid vs. Sick leave across teams</p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Summer Peak
              </span>
            </div>
          </CardHeader>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaveUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="paid" name="Paid Annual Leave" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sick" name="Sick / Medical" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: Department Headcount Distribution */}
        <Card className="shadow-xs border-slate-200/80 p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-sm font-bold text-slate-900">
              Department Headcount Distribution
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Workforce allocation by organizational unit</p>
          </CardHeader>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Work Mode Deployment Distribution */}
        <Card className="shadow-xs border-slate-200/80 p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-sm font-bold text-slate-900">
              Work Mode Deployment Model
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">In-Office vs. Hybrid vs. Fully Remote</p>
          </CardHeader>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workModeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {workModeData.map((entry, index) => (
                    <Cell key={`mode-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
