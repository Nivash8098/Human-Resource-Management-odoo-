import { copilotTools } from './tools';
import { 
  CopilotMessage, 
  CopilotResponseType, 
  CopilotMetric, 
  CopilotAction, 
  CopilotPendingAction,
  DailyHRBriefingData 
} from '../../types/copilot.types';
import { User, LeaveRequest } from '../../types';

class HRCopilotEngine {
  private lastQueriedEmployee: User | null = null;
  private lastQueriedLeaves: LeaveRequest[] = [];

  /**
   * Process a natural language prompt from HR/Admin
   */
  async processQuery(query: string, history: CopilotMessage[] = []): Promise<CopilotMessage> {
    const q = query.trim().toLowerCase();
    const messageId = `msg-${Date.now()}`;
    const timestamp = new Date().toISOString();

    try {
      // 1. APPROVE LEAVE REQUEST INTENT
      if (q.startsWith('approve') || q.includes('approve leave') || q.includes('approve request') || q.includes('approve time off')) {
        return await this.handleApproveLeaveIntent(query, messageId, timestamp);
      }

      // 2. REJECT / DECLINE LEAVE REQUEST INTENT
      if (q.startsWith('reject') || q.startsWith('decline') || q.includes('reject leave') || q.includes('decline leave')) {
        return await this.handleRejectLeaveIntent(query, messageId, timestamp);
      }

      // 3. DAILY HR BRIEFING / INSIGHTS INTENT
      if (q.includes('briefing') || q.includes('daily summary') || q.includes('morning brief') || q.includes('insights') || q.includes("today's overview")) {
        return await this.handleDailyBriefing(messageId, timestamp);
      }

      // 4. ATTENDANCE ANOMALIES & EXCEPTIONS INTENT
      if (q.includes('anomal') || q.includes('late') || q.includes('missing check') || q.includes('exception') || q.includes('checkout')) {
        return await this.handleAnomalies(messageId, timestamp);
      }

      // 5. PENDING LEAVE REQUESTS INTENT
      if (q.includes('pending leave') || q.includes('leave request') || q.includes('pending request') || q.includes('time off request') || q.includes('who requested leave') || (q.includes('leave') && q.includes('pending'))) {
        return await this.handlePendingLeaves(messageId, timestamp);
      }

      // 6. TODAY'S ATTENDANCE / ABSENT / PRESENT INTENT
      if (q.includes('absent') || q.includes('present') || q.includes('attendance today') || q.includes('who is in') || q.includes('who is working') || q.includes('today attendance') || q.includes('who is off') || q.includes('who is out') || q.includes('work mode')) {
        return await this.handleTodayAttendance(messageId, timestamp);
      }

      // 7. PAYROLL & COMPENSATION INTENT
      if (q.includes('payroll') || q.includes('salary') || q.includes('compensation') || q.includes('disbursement') || q.includes('payout') || q.includes('wage')) {
        return await this.handlePayrollSummary(messageId, timestamp);
      }

      // 8. HEADCOUNT / DEPARTMENT BREAKDOWN INTENT
      if (q.includes('headcount') || q.includes('department') || q.includes('how many employee') || q.includes('total employee') || q.includes('workforce size') || q.includes('team size')) {
        return await this.handleHeadcount(query, messageId, timestamp);
      }

      // 9. EMPLOYEE PROFILE / SPECIFIC EMPLOYEE SEARCH
      const employeeMatch = await this.detectEmployeeMention(query);
      if (employeeMatch) {
        return await this.handleEmployeeProfile(employeeMatch, messageId, timestamp);
      }

      // 10. CONTEXTUAL FOLLOW-UP (e.g. "What is his leave balance?", "Show his profile")
      if (this.lastQueriedEmployee && (q.includes('his') || q.includes('her') || q.includes('their') || q.includes('this employee') || q.includes('balance') || q.includes('contact'))) {
        return await this.handleEmployeeProfile(this.lastQueriedEmployee.full_name, messageId, timestamp);
      }

      // Default: Comprehensive Quick Assistant Overview
      return await this.handleFallback(query, messageId, timestamp);

    } catch (error: any) {
      console.error('[Nexora HR Copilot] Query error:', error);
      return {
        id: messageId,
        sender: 'assistant',
        timestamp,
        responseType: 'error_state',
        title: 'Error Processing Query',
        summary: 'I encountered an unexpected issue while retrieving workforce data. Please try rephrasing or check your connectivity.',
        error: error?.message || 'Unknown error'
      };
    }
  }

  /**
   * Helper: Detect if a user mentioned an employee by name or ID
   */
  private async detectEmployeeMention(query: string): Promise<string | null> {
    const q = query.toLowerCase();
    const employees = await copilotTools.searchEmployees('');
    
    for (const emp of employees) {
      const firstName = emp.full_name.split(' ')[0].toLowerCase();
      const lastName = emp.full_name.split(' ').slice(1).join(' ').toLowerCase();
      const fullName = emp.full_name.toLowerCase();
      const empId = emp.employee_id.toLowerCase();

      if (q.includes(fullName) || q.includes(empId) || (firstName.length > 2 && q.includes(firstName)) || (lastName.length > 2 && q.includes(lastName))) {
        return emp.full_name;
      }
    }

    return null;
  }

  /**
   * Handler: Today's Attendance
   */
  private async handleTodayAttendance(messageId: string, timestamp: string): Promise<CopilotMessage> {
    const data = await copilotTools.getTodayAttendance();

    const metrics: CopilotMetric[] = [
      { label: 'Attendance Rate', value: `${data.attendanceRate}%`, color: data.attendanceRate >= 90 ? 'success' : 'warning' },
      { label: 'Present Today', value: data.presentCount + data.halfDayCount, color: 'success' },
      { label: 'On Leave', value: data.onLeaveCount, color: 'info' },
      { label: 'Absent / Unlogged', value: data.absentCount, color: data.absentCount > 0 ? 'danger' : 'default' }
    ];

    const items = [
      ...data.onLeave.map(item => ({
        id: item.employee.id,
        name: item.employee.full_name,
        role: item.employee.job_title,
        department: item.employee.department,
        avatar: item.employee.avatar_url,
        status: 'On Approved Leave',
        statusColor: 'sky',
        details: item.leaveRequest ? `${item.leaveRequest.leave_type.toUpperCase()} Leave • ${item.leaveRequest.reason}` : 'Approved Leave'
      })),
      ...data.halfDay.map(item => ({
        id: item.employee.id,
        name: item.employee.full_name,
        role: item.employee.job_title,
        department: item.employee.department,
        avatar: item.employee.avatar_url,
        status: 'Half Day',
        statusColor: 'amber',
        details: `Checked in ${item.record.check_in?.slice(0, 5) || '09:00'} • ${item.record.notes || 'Departed early'}`
      })),
      ...data.absent.map(item => ({
        id: item.employee.id,
        name: item.employee.full_name,
        role: item.employee.job_title,
        department: item.employee.department,
        avatar: item.employee.avatar_url,
        status: 'Absent / Unchecked',
        statusColor: 'rose',
        details: 'No attendance check-in logged today'
      }))
    ];

    const summary = data.onLeaveCount > 0 || data.absentCount > 0
      ? `Today's attendance stands at ${data.attendanceRate}%. There are ${data.presentCount + data.halfDayCount} present, ${data.onLeaveCount} on approved leave, and ${data.absentCount} unlogged/absent.`
      : `Full workforce presence recorded today (${data.attendanceRate}%). All ${data.totalEmployees} active employees are checked in.`;

    const actions: CopilotAction[] = [
      { label: 'View Attendance Matrix', route: '/attendance', icon: 'clock', primary: true },
      { label: 'Check Leave Calendar', route: '/leave/requests', icon: 'calendar' }
    ];

    return {
      id: messageId,
      sender: 'assistant',
      timestamp,
      responseType: 'attendance_summary',
      title: "Today's Workforce Attendance",
      summary,
      metrics,
      items,
      actions
    };
  }

  /**
   * Handler: Pending Leave Requests
   */
  private async handlePendingLeaves(messageId: string, timestamp: string): Promise<CopilotMessage> {
    const pending = await copilotTools.getPendingLeaveRequests();
    this.lastQueriedLeaves = pending;

    if (pending.length === 0) {
      return {
        id: messageId,
        sender: 'assistant',
        timestamp,
        responseType: 'empty_state',
        title: 'Time-Off Requests',
        summary: 'There are currently no pending leave requests awaiting management review. All submissions have been processed!',
        actions: [
          { label: 'Open Leave Management', route: '/leave/requests', icon: 'calendar', primary: true }
        ]
      };
    }

    const metrics: CopilotMetric[] = [
      { label: 'Pending Approvals', value: pending.length, color: 'warning' },
      { label: 'Total Days Requested', value: pending.reduce((acc, curr) => acc + curr.days, 0), color: 'primary' }
    ];

    const items = pending.map(req => ({
      id: req.id,
      name: req.employee_name,
      avatar: req.employee_avatar,
      department: req.department,
      role: req.job_title,
      type: req.leave_type.toUpperCase(),
      dates: `${req.start_date} to ${req.end_date}`,
      days: req.days,
      reason: req.reason,
      status: 'pending',
      requestId: req.id
    }));

    const actions: CopilotAction[] = [
      { label: 'Review in Leave Center', route: '/leave/requests', icon: 'calendar', primary: true }
    ];

    return {
      id: messageId,
      sender: 'assistant',
      timestamp,
      responseType: 'pending_leaves',
      title: 'Pending Time-Off Requests',
      summary: `Found ${pending.length} pending time-off request${pending.length > 1 ? 's' : ''} requiring administrative sign-off. You can approve or reject them directly here or navigate to the Leave Requests page.`,
      metrics,
      items,
      actions
    };
  }

  /**
   * Handler: Attendance Anomalies
   */
  private async handleAnomalies(messageId: string, timestamp: string): Promise<CopilotMessage> {
    const anomalies = await copilotTools.getAttendanceAnomalies();

    if (anomalies.length === 0) {
      return {
        id: messageId,
        sender: 'assistant',
        timestamp,
        responseType: 'empty_state',
        title: 'Attendance Exceptions',
        summary: 'All attendance records are clean! No missing check-outs or flagged attendance exceptions were detected in the recent logs.',
        actions: [
          { label: 'View Attendance Log', route: '/attendance', icon: 'clock', primary: true }
        ]
      };
    }

    const metrics: CopilotMetric[] = [
      { label: 'Flagged Exceptions', value: anomalies.length, color: 'danger' },
      { label: 'Missing Check-Outs', value: anomalies.filter(a => a.type === 'missing_checkout').length, color: 'warning' },
      { label: 'Late Arrivals', value: anomalies.filter(a => a.type === 'late').length, color: 'info' }
    ];

    const items = anomalies.map(a => ({
      id: a.employee_id,
      name: a.employee_name,
      avatar: a.employee_avatar,
      department: a.department,
      date: a.date,
      issue: a.issue,
      type: a.type
    }));

    return {
      id: messageId,
      sender: 'assistant',
      timestamp,
      responseType: 'attendance_anomalies',
      title: 'Flagged Attendance Exceptions',
      summary: `Detected ${anomalies.length} attendance exception${anomalies.length > 1 ? 's' : ''} that may require verification or shift adjustments.`,
      metrics,
      items,
      actions: [
        { label: 'Manage Attendance', route: '/attendance', icon: 'clock', primary: true }
      ]
    };
  }

  /**
   * Handler: Daily HR Briefing
   */
  private async handleDailyBriefing(messageId: string, timestamp: string): Promise<CopilotMessage> {
    const briefing = await copilotTools.getDailyHRBriefing();

    const metrics: CopilotMetric[] = [
      { label: 'Total Headcount', value: briefing.workforce.total, color: 'primary' },
      { label: 'Present Today', value: briefing.workforce.present, color: 'success' },
      { label: 'Pending Leaves', value: briefing.actionsRequired.pendingLeavesCount, color: briefing.actionsRequired.pendingLeavesCount > 0 ? 'warning' : 'default' },
      { label: 'Attendance Rate', value: `${briefing.workforce.attendanceRate}%`, color: briefing.workforce.attendanceRate >= 90 ? 'success' : 'warning' }
    ];

    const summary = `${briefing.greeting} Here is your operational workforce briefing for ${briefing.dateStr}. ` +
      briefing.insights.join(' ');

    const actions: CopilotAction[] = [
      { label: 'Review Leave Requests', route: '/leave/requests', icon: 'calendar', primary: briefing.actionsRequired.pendingLeavesCount > 0 },
      { label: 'View Employee Directory', route: '/employees', icon: 'user' },
      { label: 'Audit Payroll Cycle', route: '/payroll/manage', icon: 'dollar' }
    ];

    return {
      id: messageId,
      sender: 'assistant',
      timestamp,
      responseType: 'daily_briefing',
      title: 'Daily HR Operational Briefing',
      summary,
      metrics,
      items: briefing.recentPendingLeaves.map(l => ({
        id: l.id,
        name: l.employee_name,
        type: l.leave_type,
        dates: `${l.start_date} to ${l.end_date}`,
        days: l.days,
        reason: l.reason
      })),
      actions
    };
  }

  /**
   * Handler: Payroll Summary
   */
  private async handlePayrollSummary(messageId: string, timestamp: string): Promise<CopilotMessage> {
    const payroll = await copilotTools.getPayrollSummary();

    const formattedTotal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: payroll.currency,
      maximumFractionDigits: 0
    }).format(payroll.totalPayrollAmount);

    const metrics: CopilotMetric[] = [
      { label: 'Total Net Payout', value: formattedTotal, color: 'primary' },
      { label: 'Paid Disbursements', value: payroll.paidCount, color: 'success' },
      { label: 'Processing', value: payroll.processingCount, color: 'warning' },
      { label: 'Pending', value: payroll.pendingCount, color: 'default' }
    ];

    const items = payroll.records.map(r => ({
      id: r.id,
      employeeId: r.employee_id,
      name: r.employee_name,
      department: r.department,
      role: r.job_title,
      netSalary: new Intl.NumberFormat('en-IN', { style: 'currency', currency: r.currency, maximumFractionDigits: 0 }).format(r.net_salary),
      status: r.status,
      period: r.pay_period
    }));

    return {
      id: messageId,
      sender: 'assistant',
      timestamp,
      responseType: 'payroll_summary',
      title: `Payroll Summary • ${payroll.payPeriod}`,
      summary: `Total compensation for ${payroll.payPeriod} is ${formattedTotal} across ${payroll.records.length} team members (${payroll.paidCount} paid, ${payroll.processingCount} in processing).`,
      metrics,
      items,
      actions: [
        { label: 'Open Payroll Center', route: '/payroll/manage', icon: 'dollar', primary: true }
      ]
    };
  }

  /**
   * Handler: Headcount and Department Breakdowns
   */
  private async handleHeadcount(query: string, messageId: string, timestamp: string): Promise<CopilotMessage> {
    const data = await copilotTools.getEmployeeCount();

    const metrics: CopilotMetric[] = [
      { label: 'Total Employees', value: data.total, color: 'primary' },
      { label: 'Active', value: data.active, color: 'success' },
      { label: 'On Leave', value: data.onLeave, color: 'info' },
      { label: 'Departments', value: Object.keys(data.departmentCounts).length, color: 'default' }
    ];

    const items = Object.entries(data.departmentCounts).map(([dept, count]) => ({
      name: dept,
      count: count,
      percentage: Math.round((count / (data.total || 1)) * 100)
    }));

    return {
      id: messageId,
      sender: 'assistant',
      timestamp,
      responseType: 'employee_list',
      title: 'Workforce Headcount & Distribution',
      summary: `The organization currently has ${data.total} active employees distributed across ${Object.keys(data.departmentCounts).length} departments.`,
      metrics,
      items,
      actions: [
        { label: 'View Employee Directory', route: '/employees', icon: 'user', primary: true }
      ]
    };
  }

  /**
   * Handler: Employee Profile & History
   */
  private async handleEmployeeProfile(employeeQuery: string, messageId: string, timestamp: string): Promise<CopilotMessage> {
    const data = await copilotTools.getEmployeeProfile(employeeQuery);

    if (!data.user) {
      return {
        id: messageId,
        sender: 'assistant',
        timestamp,
        responseType: 'text',
        title: 'Employee Search',
        summary: `Could not find an employee matching "${employeeQuery}". Please check the spelling or view the employee directory.`,
        actions: [
          { label: 'Search Employee Directory', route: '/employees', icon: 'user', primary: true }
        ]
      };
    }

    this.lastQueriedEmployee = data.user;
    const user = data.user;

    const metrics: CopilotMetric[] = [
      { label: 'Paid Leave Remaining', value: `${data.leaveBalances?.paid?.remaining ?? 14} days`, color: 'success' },
      { label: 'Sick Leave Remaining', value: `${data.leaveBalances?.sick?.remaining ?? 8} days`, color: 'info' },
      { label: 'Work Mode', value: user.work_mode ? user.work_mode.toUpperCase() : 'OFFICE', color: 'primary' },
      { label: 'Employment Status', value: user.status.toUpperCase(), color: user.status === 'active' ? 'success' : 'warning' }
    ];

    const detailsItem = {
      id: user.id,
      employee_id: user.employee_id,
      name: user.full_name,
      avatar: user.avatar_url,
      department: user.department,
      role: user.job_title,
      email: user.email,
      phone: user.phone || 'N/A',
      address: user.address || 'N/A',
      manager: user.manager_name || 'N/A',
      joined: user.joining_date,
      salary: data.payroll ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: data.payroll.currency, maximumFractionDigits: 0 }).format(data.payroll.net_salary) : 'N/A',
      recentLeavesCount: data.recentLeaves.length,
      emergencyContact: user.emergency_contact ? `${user.emergency_contact.name} (${user.emergency_contact.relationship}) • ${user.emergency_contact.phone}` : 'N/A'
    };

    return {
      id: messageId,
      sender: 'assistant',
      timestamp,
      responseType: 'employee_profile',
      title: `${user.full_name} • Profile Details`,
      summary: `${user.full_name} is a ${user.job_title} in ${user.department}. Status is currently ${user.status.toUpperCase()}.`,
      metrics,
      items: [detailsItem],
      actions: [
        { label: 'Open Full Profile', route: `/employees/${user.id}`, icon: 'user', primary: true },
        { label: 'View Attendance Records', route: '/attendance', icon: 'clock' }
      ]
    };
  }

  /**
   * Handler: Prepare Leave Approval (Sensitive Action with Confirmation Card)
   */
  private async handleApproveLeaveIntent(query: string, messageId: string, timestamp: string): Promise<CopilotMessage> {
    const pending = await copilotTools.getPendingLeaveRequests();
    const q = query.toLowerCase();

    // Match by employee name or request ID or use latest pending
    let matchedRequest: LeaveRequest | undefined;

    for (const req of pending) {
      if (q.includes(req.id.toLowerCase()) || q.includes(req.employee_name.toLowerCase()) || q.includes(req.employee_name.split(' ')[0].toLowerCase())) {
        matchedRequest = req;
        break;
      }
    }

    if (!matchedRequest && pending.length > 0) {
      matchedRequest = pending[0]; // Most recent
    }

    if (!matchedRequest) {
      return {
        id: messageId,
        sender: 'assistant',
        timestamp,
        responseType: 'text',
        title: 'Approve Leave Request',
        summary: 'There are no pending leave requests to approve at this time.',
        actions: [{ label: 'View Leave History', route: '/leave/requests', icon: 'calendar' }]
      };
    }

    const pendingAction: CopilotPendingAction = {
      id: `action-${Date.now()}`,
      type: 'approve_leave',
      title: `Confirm Leave Approval for ${matchedRequest.employee_name}`,
      description: `Please review the details below before authorizing this time-off approval. This will update leave balances and notify the employee.`,
      details: {
        'Employee': matchedRequest.employee_name,
        'Department': matchedRequest.department,
        'Leave Type': matchedRequest.leave_type.toUpperCase(),
        'Duration': `${matchedRequest.days} day(s)`,
        'Dates': `${matchedRequest.start_date} to ${matchedRequest.end_date}`,
        'Reason': matchedRequest.reason
      },
      payload: {
        requestId: matchedRequest.id,
        employeeName: matchedRequest.employee_name,
        days: matchedRequest.days
      },
      danger: false
    };

    return {
      id: messageId,
      sender: 'assistant',
      timestamp,
      responseType: 'action_confirm',
      title: 'Action Confirmation Required',
      summary: `I've prepared the approval for ${matchedRequest.employee_name}'s ${matchedRequest.leave_type} leave request (${matchedRequest.days} days). Please confirm below to proceed.`,
      pendingAction
    };
  }

  /**
   * Handler: Prepare Leave Rejection (Sensitive Action)
   */
  private async handleRejectLeaveIntent(query: string, messageId: string, timestamp: string): Promise<CopilotMessage> {
    const pending = await copilotTools.getPendingLeaveRequests();
    const q = query.toLowerCase();

    let matchedRequest: LeaveRequest | undefined;

    for (const req of pending) {
      if (q.includes(req.id.toLowerCase()) || q.includes(req.employee_name.toLowerCase()) || q.includes(req.employee_name.split(' ')[0].toLowerCase())) {
        matchedRequest = req;
        break;
      }
    }

    if (!matchedRequest && pending.length > 0) {
      matchedRequest = pending[0];
    }

    if (!matchedRequest) {
      return {
        id: messageId,
        sender: 'assistant',
        timestamp,
        responseType: 'text',
        title: 'Decline Leave Request',
        summary: 'There are no pending leave requests to decline at this time.',
        actions: [{ label: 'View Leave Requests', route: '/leave/requests', icon: 'calendar' }]
      };
    }

    const pendingAction: CopilotPendingAction = {
      id: `action-${Date.now()}`,
      type: 'reject_leave',
      title: `Confirm Leave Rejection for ${matchedRequest.employee_name}`,
      description: `Declining this request will keep leave balances unchanged and send a formal notification to ${matchedRequest.employee_name}.`,
      details: {
        'Employee': matchedRequest.employee_name,
        'Department': matchedRequest.department,
        'Leave Type': matchedRequest.leave_type.toUpperCase(),
        'Duration': `${matchedRequest.days} day(s)`,
        'Dates': `${matchedRequest.start_date} to ${matchedRequest.end_date}`,
        'Reason': matchedRequest.reason
      },
      payload: {
        requestId: matchedRequest.id,
        employeeName: matchedRequest.employee_name
      },
      danger: true
    };

    return {
      id: messageId,
      sender: 'assistant',
      timestamp,
      responseType: 'action_confirm',
      title: 'Action Confirmation Required',
      summary: `I've prepared the rejection notice for ${matchedRequest.employee_name}'s time-off request. Please confirm to finalize this action.`,
      pendingAction
    };
  }

  /**
   * Execute a confirmed sensitive action
   */
  async executeAction(action: CopilotPendingAction, comment?: string): Promise<CopilotMessage> {
    const messageId = `msg-${Date.now()}`;
    const timestamp = new Date().toISOString();

    try {
      if (action.type === 'approve_leave') {
        const result = await copilotTools.executeApproveLeave(action.payload.requestId, comment);
        return {
          id: messageId,
          sender: 'assistant',
          timestamp,
          responseType: 'action_result',
          title: 'Leave Approved Successfully',
          summary: `The ${result.request.leave_type} leave request for ${result.request.employee_name} has been officially approved. Leave balances were updated and notification dispatched.`,
          isActionExecuted: true,
          actionExecutionStatus: 'success',
          actionExecutionMessage: `Approved ${result.request.days} day(s) for ${result.request.employee_name}.`,
          actions: [
            { label: 'View in Leave Center', route: '/leave/requests', icon: 'calendar', primary: true }
          ]
        };
      }

      if (action.type === 'reject_leave') {
        const result = await copilotTools.executeRejectLeave(action.payload.requestId, comment);
        return {
          id: messageId,
          sender: 'assistant',
          timestamp,
          responseType: 'action_result',
          title: 'Leave Request Declined',
          summary: `The leave request for ${result.request.employee_name} was declined. The employee has been notified with your feedback.`,
          isActionExecuted: true,
          actionExecutionStatus: 'success',
          actionExecutionMessage: `Declined request for ${result.request.employee_name}.`,
          actions: [
            { label: 'View in Leave Center', route: '/leave/requests', icon: 'calendar', primary: true }
          ]
        };
      }

      throw new Error(`Unsupported action type: ${action.type}`);
    } catch (e: any) {
      console.error('[Nexora HR Copilot] Action execution error:', e);
      return {
        id: messageId,
        sender: 'assistant',
        timestamp,
        responseType: 'action_result',
        title: 'Action Failed',
        summary: `Could not complete the action: ${e?.message || 'Unknown error occurred.'}`,
        isActionExecuted: true,
        actionExecutionStatus: 'failed',
        error: e?.message
      };
    }
  }

  /**
   * Handler: Fallback / General Assistant Overview
   */
  private async handleFallback(query: string, messageId: string, timestamp: string): Promise<CopilotMessage> {
    const [todayAtt, pendingLeaves, anomalies] = await Promise.all([
      copilotTools.getTodayAttendance(),
      copilotTools.getPendingLeaveRequests(),
      copilotTools.getAttendanceAnomalies()
    ]);

    const metrics: CopilotMetric[] = [
      { label: 'Attendance Rate', value: `${todayAtt.attendanceRate}%`, color: 'success' },
      { label: 'Present', value: todayAtt.presentCount + todayAtt.halfDayCount, color: 'primary' },
      { label: 'Pending Approvals', value: pendingLeaves.length, color: pendingLeaves.length > 0 ? 'warning' : 'default' },
      { label: 'Exceptions', value: anomalies.length, color: anomalies.length > 0 ? 'danger' : 'default' }
    ];

    return {
      id: messageId,
      sender: 'assistant',
      timestamp,
      responseType: 'text',
      title: 'Nexora HR Copilot Overview',
      summary: `I'm connected to your live Dayflow database. Today's attendance is at ${todayAtt.attendanceRate}% (${todayAtt.presentCount + todayAtt.halfDayCount} present). You have ${pendingLeaves.length} pending leave request${pendingLeaves.length === 1 ? '' : 's'} and ${anomalies.length} attendance exception${anomalies.length === 1 ? '' : 's'}.`,
      metrics,
      actions: [
        { label: "Today's Briefing", actionId: 'briefing', icon: 'sparkles', primary: true },
        { label: 'Who is Absent?', actionId: 'attendance', icon: 'clock' },
        { label: 'Pending Leaves', route: '/leave/requests', icon: 'calendar' }
      ]
    };
  }
}

export const hrCopilot = new HRCopilotEngine();
