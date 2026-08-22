import { 
  employeeService, 
  attendanceService, 
  leaveService, 
  payrollService, 
  analyticsService, 
  activityService,
  authService 
} from '../api';
import { store, getFormattedDate } from '../store';
import { User, LeaveRequest, AttendanceRecord, PayrollRecord, HRMetrics } from '../../types';
import { DailyHRBriefingData } from '../../types/copilot.types';

export const copilotTools = {
  /**
   * 1. Get Employee Counts and Department Breakdowns
   */
  async getEmployeeCount(department?: string, status?: string): Promise<{
    total: number;
    active: number;
    onLeave: number;
    departmentCounts: Record<string, number>;
    filteredEmployees: User[];
  }> {
    const employees = await employeeService.getEmployees();
    let filtered = [...employees];

    if (department && department.toLowerCase() !== 'all') {
      filtered = filtered.filter(e => 
        e.department.toLowerCase().includes(department.toLowerCase())
      );
    }

    if (status && status.toLowerCase() !== 'all') {
      filtered = filtered.filter(e => 
        e.status.toLowerCase() === status.toLowerCase()
      );
    }

    const deptCounts: Record<string, number> = {};
    employees.forEach(e => {
      deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
    });

    return {
      total: employees.length,
      active: employees.filter(e => e.status === 'active').length,
      onLeave: employees.filter(e => e.status === 'on_leave').length,
      departmentCounts: deptCounts,
      filteredEmployees: filtered
    };
  },

  /**
   * 2. Get Today's Live Attendance Status
   */
  async getTodayAttendance(): Promise<{
    date: string;
    totalEmployees: number;
    present: Array<{ employee: User; record: AttendanceRecord }>;
    onLeave: Array<{ employee: User; leaveRequest?: LeaveRequest }>;
    absent: Array<{ employee: User }>;
    halfDay: Array<{ employee: User; record: AttendanceRecord }>;
    presentCount: number;
    absentCount: number;
    onLeaveCount: number;
    halfDayCount: number;
    attendanceRate: number;
  }> {
    const todayStr = getFormattedDate(0);
    const [employees, allAttendance, allLeaves] = await Promise.all([
      employeeService.getEmployees(),
      attendanceService.getAllAttendance(),
      leaveService.getAllRequests()
    ]);

    const activeEmployees = employees.filter(e => e.status === 'active' || e.status === 'on_leave');
    const todayRecords = allAttendance.filter(a => a.date === todayStr);

    const present: Array<{ employee: User; record: AttendanceRecord }> = [];
    const halfDay: Array<{ employee: User; record: AttendanceRecord }> = [];
    const onLeave: Array<{ employee: User; leaveRequest?: LeaveRequest }> = [];
    const absent: Array<{ employee: User }> = [];

    // Find employees on approved leave today
    const leavesToday = allLeaves.filter(l => 
      l.status === 'approved' && l.start_date <= todayStr && l.end_date >= todayStr
    );

    activeEmployees.forEach(emp => {
      const att = todayRecords.find(a => a.employee_id === emp.id);
      const leave = leavesToday.find(l => l.employee_id === emp.id);

      if (leave) {
        onLeave.push({ employee: emp, leaveRequest: leave });
      } else if (att) {
        if (att.status === 'half_day') {
          halfDay.push({ employee: emp, record: att });
        } else if (att.status === 'present' || att.status === 'late' || att.check_in) {
          present.push({ employee: emp, record: att });
        } else if (att.status === 'leave') {
          onLeave.push({ employee: emp });
        } else {
          absent.push({ employee: emp });
        }
      } else {
        absent.push({ employee: emp });
      }
    });

    const total = activeEmployees.length || 1;
    const presentTotal = present.length + halfDay.length;
    const rate = Math.round((presentTotal / total) * 100);

    return {
      date: todayStr,
      totalEmployees: activeEmployees.length,
      present,
      onLeave,
      absent,
      halfDay,
      presentCount: present.length,
      absentCount: absent.length,
      onLeaveCount: onLeave.length,
      halfDayCount: halfDay.length,
      attendanceRate: rate
    };
  },

  /**
   * 3. Search and Retrieve Employee Details
   */
  async searchEmployees(query: string): Promise<User[]> {
    const employees = await employeeService.getEmployees();
    if (!query || query.trim().length === 0) return employees;

    const q = query.toLowerCase().trim();
    return employees.filter(e => 
      e.full_name.toLowerCase().includes(q) ||
      e.employee_id.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.job_title.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q)
    );
  },

  /**
   * 4. Get Detailed Employee Profile and History
   */
  async getEmployeeProfile(employeeIdOrName: string): Promise<{
    user: User | null;
    leaveBalances: any;
    recentAttendance: AttendanceRecord[];
    recentLeaves: LeaveRequest[];
    payroll: PayrollRecord | null;
  }> {
    const employees = await employeeService.getEmployees();
    const q = employeeIdOrName.toLowerCase().trim();

    const user = employees.find(e => 
      e.id.toLowerCase() === q || 
      e.employee_id.toLowerCase() === q || 
      e.full_name.toLowerCase().includes(q) ||
      e.email.toLowerCase() === q
    ) || null;

    if (!user) {
      return {
        user: null,
        leaveBalances: null,
        recentAttendance: [],
        recentLeaves: [],
        payroll: null
      };
    }

    const [balances, allAtt, allLeaves, allPayroll] = await Promise.all([
      leaveService.getBalances(user.id),
      attendanceService.getAllAttendance(),
      leaveService.getAllRequests(),
      payrollService.getAllPayrolls()
    ]);

    const userAtt = allAtt.filter(a => a.employee_id === user.id).slice(0, 10);
    const userLeaves = allLeaves.filter(l => l.employee_id === user.id);
    const payroll = allPayroll.find(p => p.employee_id === user.id) || null;

    return {
      user,
      leaveBalances: balances,
      recentAttendance: userAtt,
      recentLeaves: userLeaves,
      payroll
    };
  },

  /**
   * 5. Get Pending Leave Requests
   */
  async getPendingLeaveRequests(): Promise<LeaveRequest[]> {
    const allRequests = await leaveService.getAllRequests();
    return allRequests.filter(r => r.status === 'pending');
  },

  /**
   * 6. Get Attendance Anomalies
   */
  async getAttendanceAnomalies(): Promise<Array<{
    employee_id: string;
    employee_name: string;
    employee_avatar?: string;
    department: string;
    date: string;
    issue: string;
    type: 'missing_checkout' | 'late' | 'half_day' | 'unexplained_absence';
    check_in?: string | null;
    check_out?: string | null;
  }>> {
    const [employees, attendance] = await Promise.all([
      employeeService.getEmployees(),
      attendanceService.getAllAttendance()
    ]);

    const anomalies: Array<{
      employee_id: string;
      employee_name: string;
      employee_avatar?: string;
      department: string;
      date: string;
      issue: string;
      type: 'missing_checkout' | 'late' | 'half_day' | 'unexplained_absence';
      check_in?: string | null;
      check_out?: string | null;
    }> = [];

    const todayStr = getFormattedDate(0);
    const yesterdayStr = getFormattedDate(-1);

    attendance.forEach(rec => {
      const emp = employees.find(e => e.id === rec.employee_id);
      if (!emp) return;

      // Check missing checkout on yesterday's records
      if (rec.date === yesterdayStr && rec.check_in && !rec.check_out) {
        anomalies.push({
          employee_id: emp.id,
          employee_name: emp.full_name,
          employee_avatar: emp.avatar_url,
          department: emp.department,
          date: rec.date,
          issue: `Missing check-out timestamp (Checked in at ${rec.check_in.slice(0, 5)})`,
          type: 'missing_checkout',
          check_in: rec.check_in,
          check_out: null
        });
      }

      // Check late check-ins (after 09:30 AM)
      if (rec.check_in && rec.check_in > '09:30:00' && rec.date === todayStr) {
        anomalies.push({
          employee_id: emp.id,
          employee_name: emp.full_name,
          employee_avatar: emp.avatar_url,
          department: emp.department,
          date: rec.date,
          issue: `Late check-in recorded at ${rec.check_in.slice(0, 5)} AM`,
          type: 'late',
          check_in: rec.check_in,
          check_out: rec.check_out
        });
      }

      // Check half-day status
      if (rec.status === 'half_day' && (rec.date === todayStr || rec.date === yesterdayStr)) {
        anomalies.push({
          employee_id: emp.id,
          employee_name: emp.full_name,
          employee_avatar: emp.avatar_url,
          department: emp.department,
          date: rec.date,
          issue: `Half-day shift recorded (${rec.notes || 'Departed early'})`,
          type: 'half_day',
          check_in: rec.check_in,
          check_out: rec.check_out
        });
      }
    });

    return anomalies;
  },

  /**
   * 7. Get Payroll Summary
   */
  async getPayrollSummary(period?: string): Promise<{
    payPeriod: string;
    totalPayrollAmount: number;
    currency: string;
    paidCount: number;
    processingCount: number;
    pendingCount: number;
    records: PayrollRecord[];
    departmentSpending: Record<string, number>;
  }> {
    const records = await payrollService.getAllPayrolls();
    const currentPeriod = period || 'August 2026';
    
    let total = 0;
    let paid = 0;
    let processing = 0;
    let pending = 0;
    const deptSpending: Record<string, number> = {};

    records.forEach(r => {
      total += r.net_salary;
      deptSpending[r.department] = (deptSpending[r.department] || 0) + r.net_salary;

      if (r.status === 'paid') paid++;
      else if (r.status === 'processing') processing++;
      else pending++;
    });

    return {
      payPeriod: currentPeriod,
      totalPayrollAmount: total,
      currency: records[0]?.currency || 'INR',
      paidCount: paid,
      processingCount: processing,
      pendingCount: pending,
      records,
      departmentSpending: deptSpending
    };
  },

  /**
   * 8. Generate Daily HR Briefing Data
   */
  async getDailyHRBriefing(): Promise<DailyHRBriefingData> {
    const todayStr = getFormattedDate(0);
    const [todayAtt, pendingLeaves, anomalies, metrics] = await Promise.all([
      this.getTodayAttendance(),
      this.getPendingLeaveRequests(),
      this.getAttendanceAnomalies(),
      analyticsService.getHRMetrics()
    ]);

    const hrUser = await authService.getCurrentUser();
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17) greeting = 'Good evening';

    const insights: string[] = [];
    
    if (todayAtt.attendanceRate >= 90) {
      insights.push(`Strong workforce presence today (${todayAtt.attendanceRate}% present) with minimal operational disruption.`);
    } else {
      insights.push(`Workforce presence is at ${todayAtt.attendanceRate}%. Consider reallocating shift responsibilities.`);
    }

    if (pendingLeaves.length > 0) {
      insights.push(`${pendingLeaves.length} time-off request${pendingLeaves.length > 1 ? 's' : ''} awaiting your approval.`);
    } else {
      insights.push(`All employee leave requests are fully reviewed and up to date.`);
    }

    if (anomalies.length > 0) {
      insights.push(`${anomalies.length} attendance exception${anomalies.length > 1 ? 's' : ''} flagged for review.`);
    }

    return {
      greeting: `${greeting}, ${hrUser.full_name.split(' ')[0]}!`,
      dateStr: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
      workforce: {
        total: todayAtt.totalEmployees,
        present: todayAtt.presentCount + todayAtt.halfDayCount,
        absent: todayAtt.absentCount,
        onLeave: todayAtt.onLeaveCount,
        halfDay: todayAtt.halfDayCount,
        attendanceRate: todayAtt.attendanceRate
      },
      actionsRequired: {
        pendingLeavesCount: pendingLeaves.length,
        attendanceAnomaliesCount: anomalies.length,
        payrollPendingCount: metrics.pending_approvals || 2
      },
      insights,
      recentPendingLeaves: pendingLeaves.slice(0, 3),
      anomaliesList: anomalies.slice(0, 3)
    };
  },

  /**
   * 9. Safe Sensitive Action Execution with Audit Logging: Approve Leave
   */
  async executeApproveLeave(requestId: string, comment?: string): Promise<{ success: boolean; request: LeaveRequest; message: string }> {
    const currentUser = await authService.getCurrentUser();
    const updated = await leaveService.reviewRequest(
      requestId,
      'approved',
      currentUser.full_name || 'Sarah Jenkins',
      comment || 'Approved via Nexora HR Copilot'
    );

    // Write audit log
    await activityService.logActivity({
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_avatar: currentUser.avatar_url,
      action: 'AI-Assisted Leave Approval',
      details: `Approved ${updated.leave_type} leave for ${updated.employee_name} (${updated.days} days).`,
      type: 'leave_approved'
    });

    return {
      success: true,
      request: updated,
      message: `Leave request for ${updated.employee_name} was approved successfully.`
    };
  },

  /**
   * 10. Safe Sensitive Action Execution: Reject Leave
   */
  async executeRejectLeave(requestId: string, comment?: string): Promise<{ success: boolean; request: LeaveRequest; message: string }> {
    const currentUser = await authService.getCurrentUser();
    const updated = await leaveService.reviewRequest(
      requestId,
      'rejected',
      currentUser.full_name || 'Sarah Jenkins',
      comment || 'Declined via Nexora HR Copilot'
    );

    // Write audit log
    await activityService.logActivity({
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_avatar: currentUser.avatar_url,
      action: 'AI-Assisted Leave Rejection',
      details: `Declined ${updated.leave_type} leave for ${updated.employee_name}. Reason: ${comment || 'Not specified'}`,
      type: 'leave_rejected'
    });

    return {
      success: true,
      request: updated,
      message: `Leave request for ${updated.employee_name} was rejected.`
    };
  }
};
