import { User, LeaveRequest, AttendanceRecord, PayrollRecord } from './index';

export type CopilotResponseType =
  | 'text'
  | 'attendance_summary'
  | 'leave_summary'
  | 'pending_leaves'
  | 'payroll_summary'
  | 'employee_profile'
  | 'employee_list'
  | 'attendance_anomalies'
  | 'daily_briefing'
  | 'action_confirm'
  | 'action_result'
  | 'empty_state'
  | 'error_state';

export interface CopilotMetric {
  label: string;
  value: string | number;
  subtext?: string;
  color?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'primary';
  change?: string;
}

export interface CopilotAction {
  label: string;
  route?: string;
  actionId?: string;
  primary?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  icon?: 'arrow-right' | 'calendar' | 'clock' | 'user' | 'dollar' | 'check' | 'x' | 'external-link';
  payload?: Record<string, any>;
}

export interface CopilotPendingAction {
  id: string;
  type: 'approve_leave' | 'reject_leave' | 'update_attendance' | 'view_employee' | 'open_payroll';
  title: string;
  description: string;
  details: {
    employee_id?: string;
    employee_name?: string;
    leave_type?: string;
    dates?: string;
    days?: number;
    reason?: string;
    status?: string;
    [key: string]: any;
  };
  payload: {
    requestId?: string;
    employeeId?: string;
    comment?: string;
    [key: string]: any;
  };
  danger?: boolean;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  responseType?: CopilotResponseType;
  title?: string;
  summary?: string;
  metrics?: CopilotMetric[];
  items?: Array<Record<string, any>>;
  actions?: CopilotAction[];
  pendingAction?: CopilotPendingAction;
  isActionExecuted?: boolean;
  actionExecutionStatus?: 'success' | 'failed' | 'cancelled';
  actionExecutionMessage?: string;
  error?: string;
}

export interface QuickPrompt {
  id: string;
  label: string;
  query: string;
  category: 'attendance' | 'leave' | 'payroll' | 'workforce' | 'briefing';
  icon?: string;
}

export interface DailyHRBriefingData {
  greeting: string;
  dateStr: string;
  workforce: {
    total: number;
    present: number;
    absent: number;
    onLeave: number;
    halfDay: number;
    attendanceRate: number;
  };
  actionsRequired: {
    pendingLeavesCount: number;
    attendanceAnomaliesCount: number;
    payrollPendingCount: number;
  };
  insights: string[];
  recentPendingLeaves: LeaveRequest[];
  anomaliesList: Array<{
    employee_id: string;
    employee_name: string;
    issue: string;
    type: 'missing_checkout' | 'late' | 'half_day';
  }>;
}
