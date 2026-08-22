export type UserRole = 'employee' | 'hr_admin';

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave' | 'not_checked_in' | 'late' | 'holiday';
export type WorkMode = 'office' | 'remote' | 'hybrid';
export type LeaveType = 'paid' | 'sick' | 'unpaid' | 'casual' | 'maternity';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type EmploymentStatus = 'active' | 'on_leave' | 'inactive';
export type DocumentCategory = 'Identity' | 'Employment' | 'Payroll' | 'Other';
export type DocumentStatus = 'verified' | 'pending_verification' | 'expired' | 'pending' | 'rejected';
export type PayrollStatus = 'paid' | 'processing' | 'pending';

export interface User {
  id: string;
  email: string;
  full_name: string;
  employee_id: string;
  role: UserRole;
  avatar_url?: string;
  department: string;
  job_title: string;
  phone?: string;
  address?: string;
  joining_date: string;
  status: EmploymentStatus;
  work_mode?: WorkMode;
  manager_name?: string;
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string; // YYYY-MM-DD
  check_in: string | null; // HH:mm:ss or ISO
  check_out: string | null; // HH:mm:ss or ISO
  duration_minutes: number;
  status: AttendanceStatus;
  work_mode: WorkMode;
  notes?: string;
}

export interface LeaveBalanceCategory {
  total: number;
  used: number;
  remaining: number;
}

export interface LeaveBalance {
  employee_id: string;
  paid: LeaveBalanceCategory;
  sick: LeaveBalanceCategory;
  unpaid: LeaveBalanceCategory;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_avatar?: string;
  department: string;
  job_title: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  submitted_at: string;
  reviewed_at?: string;
  reviewer_name?: string;
  reviewer_comment?: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_avatar?: string;
  department: string;
  job_title: string;
  base_salary: number;
  allowances: {
    housing: number;
    transport: number;
    medical: number;
    performance: number;
  };
  deductions: {
    tax: number;
    provident_fund: number;
    health_insurance: number;
  };
  net_salary: number;
  currency: string;
  pay_period: string; // e.g. "August 2026"
  payment_date: string;
  status: PayrollStatus;
  last_updated: string;
  payment_method: string;
}

export interface DocumentItem {
  id: string;
  employee_id: string;
  employee_name?: string;
  title: string;
  category: DocumentCategory;
  file_size: string;
  file_type: string;
  url: string;
  uploaded_at: string;
  status: DocumentStatus;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'leave_approved' | 'leave_rejected' | 'leave_submitted' | 'payroll_ready' | 'attendance_alert' | 'profile_update' | 'general' | 'system' | 'payroll';
  is_read: boolean;
  created_at: string;
  link?: string;
}

export interface ActivityItem {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'check_in' | 'check_out' | 'leave_submitted' | 'leave_approved' | 'leave_rejected' | 'profile_updated' | 'payroll_generated' | 'document_uploaded' | 'announcement' | 'general';
}

export interface ActionCenterItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  count: number;
  urgency: 'high' | 'medium' | 'low';
  actionType: 'leave_requests' | 'attendance_anomalies' | 'profile_reviews' | 'payroll_runs';
  link: string;
}

export interface HRMetrics {
  total_employees: number;
  present_today: number;
  on_leave_today: number;
  pending_approvals: number;
  attendance_rate: number;
  workforce_availability: number;
  average_working_hours: number;
  leave_utilization_rate: number;
}
