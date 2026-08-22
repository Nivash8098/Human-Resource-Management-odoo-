import { 
  User, 
  AttendanceRecord, 
  LeaveRequest, 
  LeaveBalance, 
  PayrollRecord, 
  DocumentItem, 
  NotificationItem, 
  ActivityItem, 
  HRMetrics,
  ActionCenterItem
} from '../types';
import { authBackendService } from '../../../backend/services/auth.service';
import { attendanceBackendService } from '../../../backend/services/attendance.service';
import { leaveBackendService } from '../../../backend/services/leave.service';
import { payrollBackendService } from '../../../backend/services/payroll.service';
import { documentBackendService } from '../../../backend/services/document.service';
import { notificationBackendService } from '../../../backend/services/notification.service';
import { activityBackendService } from '../../../backend/services/activity.service';
import { employeeBackendService } from '../../../backend/services/employee.service';
import { analyticsBackendService } from '../../../backend/services/analytics.service';
import { store, getFormattedDate } from './store';

// ==========================================
// AUTHENTICATION SERVICE
// ==========================================
export const authService = {
  async getCurrentUser(): Promise<User> {
    return authBackendService.getCurrentUser();
  },

  async signIn(email: string, password?: string, preferredRole?: 'employee' | 'hr_admin'): Promise<User> {
    return authBackendService.signIn(email, password, preferredRole);
  },

  async signUp(data: {
    email: string;
    full_name: string;
    employee_id: string;
    role: 'employee' | 'hr_admin';
    department?: string;
    job_title?: string;
    password?: string;
  }): Promise<User> {
    return authBackendService.signUp(data);
  },

  async switchRole(role: 'employee' | 'hr_admin'): Promise<User> {
    return authBackendService.switchRole(role);
  },

  async signOut(): Promise<void> {
    return authBackendService.signOut();
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    return authBackendService.updateProfile(userId, updates);
  },

  async sendPasswordReset(email: string): Promise<void> {
    return authBackendService.sendPasswordReset(email);
  }
};

// ==========================================
// ATTENDANCE SERVICE
// ==========================================
export const attendanceService = {
  async getTodayStatus(employeeId: string): Promise<AttendanceRecord | null> {
    return attendanceBackendService.getTodayStatus(employeeId);
  },

  async getTodayRecord(employeeId: string): Promise<AttendanceRecord | null> {
    return attendanceBackendService.getTodayRecord(employeeId);
  },

  async checkIn(employeeId: string, workMode: 'office' | 'remote' | 'hybrid' = 'office'): Promise<AttendanceRecord> {
    return attendanceBackendService.checkIn(employeeId, workMode);
  },

  async checkOut(employeeId: string): Promise<AttendanceRecord> {
    return attendanceBackendService.checkOut(employeeId);
  },

  async getAttendanceHistory(employeeId?: string): Promise<AttendanceRecord[]> {
    return attendanceBackendService.getAttendanceHistory(employeeId);
  },

  async getHistory(employeeId?: string): Promise<AttendanceRecord[]> {
    return attendanceBackendService.getAttendanceHistory(employeeId);
  },

  async getWeeklyAttendance(employeeId: string): Promise<AttendanceRecord[]> {
    return attendanceBackendService.getWeeklyAttendance(employeeId);
  },

  async getAllAttendance(): Promise<AttendanceRecord[]> {
    return attendanceBackendService.getAllAttendance();
  },

  async updateAttendance(id: string, updates: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    return attendanceBackendService.updateAttendance(id, updates);
  }
};

// ==========================================
// LEAVE SERVICE
// ==========================================
export const leaveService = {
  async getBalances(employeeId: string): Promise<LeaveBalance> {
    return leaveBackendService.getBalances(employeeId);
  },

  async getBalance(employeeId: string): Promise<LeaveBalance> {
    return leaveBackendService.getBalance(employeeId);
  },

  async getEmployeeRequests(employeeId: string): Promise<LeaveRequest[]> {
    return leaveBackendService.getEmployeeRequests(employeeId);
  },

  async getMyRequests(employeeId: string): Promise<LeaveRequest[]> {
    return leaveBackendService.getMyRequests(employeeId);
  },

  async getMyLeaveRequests(employeeId: string): Promise<LeaveRequest[]> {
    return leaveBackendService.getMyLeaveRequests(employeeId);
  },

  async getAllRequests(): Promise<LeaveRequest[]> {
    return leaveBackendService.getAllRequests();
  },

  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    return leaveBackendService.getAllLeaveRequests();
  },

  async getLeaveRequestById(id: string): Promise<LeaveRequest | null> {
    return leaveBackendService.getLeaveRequestById(id);
  },

  async submitRequest(payload: Omit<LeaveRequest, 'id' | 'status' | 'submitted_at'>): Promise<LeaveRequest> {
    return leaveBackendService.submitRequest(payload);
  },

  async applyLeave(payload: Omit<LeaveRequest, 'id' | 'status' | 'submitted_at'>): Promise<LeaveRequest> {
    return leaveBackendService.applyLeave(payload);
  },

  async cancelRequest(requestId: string): Promise<void> {
    return leaveBackendService.cancelRequest(requestId);
  },

  async cancelLeave(requestId: string): Promise<void> {
    return leaveBackendService.cancelLeave(requestId);
  },

  async reviewRequest(requestId: string, status: 'approved' | 'rejected', reviewerName: string, reviewerComment?: string): Promise<LeaveRequest> {
    return leaveBackendService.reviewRequest(requestId, status, reviewerName, reviewerComment);
  },

  async approveLeave(requestId: string, comment?: string): Promise<LeaveRequest> {
    return leaveBackendService.approveLeave(requestId, comment);
  },

  async rejectLeave(requestId: string, comment?: string): Promise<LeaveRequest> {
    return leaveBackendService.rejectLeave(requestId, comment);
  }
};

// ==========================================
// PAYROLL SERVICE
// ==========================================
export const payrollService = {
  async getEmployeePayroll(employeeId: string): Promise<PayrollRecord | null> {
    return payrollBackendService.getEmployeePayroll(employeeId);
  },

  async getMyPayroll(): Promise<PayrollRecord | null> {
    return payrollBackendService.getMyPayroll();
  },

  async getPayrollByEmployee(employeeId: string): Promise<PayrollRecord | null> {
    return payrollBackendService.getPayrollByEmployee(employeeId);
  },

  async getAllPayrolls(): Promise<PayrollRecord[]> {
    return payrollBackendService.getAllPayrolls();
  },

  async getAllPayroll(): Promise<PayrollRecord[]> {
    return payrollBackendService.getAllPayroll();
  },

  async createPayroll(data: PayrollRecord): Promise<PayrollRecord> {
    return payrollBackendService.createPayroll(data);
  },

  async updatePayroll(payrollId: string, updates: Partial<PayrollRecord>): Promise<PayrollRecord> {
    return payrollBackendService.updatePayroll(payrollId, updates);
  }
};

// ==========================================
// DOCUMENTS SERVICE
// ==========================================
export const documentService = {
  async getDocuments(employeeId?: string): Promise<DocumentItem[]> {
    return documentBackendService.getDocuments(employeeId);
  },

  async getMyDocuments(): Promise<DocumentItem[]> {
    return documentBackendService.getMyDocuments();
  },

  async getEmployeeDocuments(employeeId: string): Promise<DocumentItem[]> {
    return documentBackendService.getEmployeeDocuments(employeeId);
  },

  async uploadDocument(payload: Omit<DocumentItem, 'id' | 'uploaded_at'>): Promise<DocumentItem> {
    return documentBackendService.uploadDocument(payload);
  },

  async deleteDocument(documentId: string): Promise<void> {
    return documentBackendService.deleteDocument(documentId);
  },

  async downloadDocument(documentId: string): Promise<{ url: string; fileName: string }> {
    return documentBackendService.downloadDocument(documentId);
  }
};

// ==========================================
// NOTIFICATIONS SERVICE
// ==========================================
export const notificationService = {
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    return notificationBackendService.getNotifications(userId);
  },

  async getMyNotifications(): Promise<NotificationItem[]> {
    return notificationBackendService.getMyNotifications();
  },

  async markAsRead(id: string): Promise<void> {
    return notificationBackendService.markAsRead(id);
  },

  async markNotificationRead(id: string): Promise<void> {
    return notificationBackendService.markNotificationRead(id);
  },

  async markAllAsRead(userId: string): Promise<void> {
    return notificationBackendService.markAllAsRead(userId);
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    return notificationBackendService.markAllNotificationsRead(userId);
  },

  async createNotification(notif: Omit<NotificationItem, 'id' | 'created_at'>): Promise<NotificationItem> {
    return notificationBackendService.createNotification(notif);
  }
};

// ==========================================
// ACTIVITY SERVICE
// ==========================================
export const activityService = {
  async getActivities(userId?: string): Promise<ActivityItem[]> {
    const caller = await authBackendService.getCurrentUser();
    return activityBackendService.getActivities();
  },

  async logActivity(activity: Omit<ActivityItem, 'id' | 'timestamp'>): Promise<ActivityItem> {
    return activityBackendService.logActivity(activity);
  }
};

// ==========================================
// EMPLOYEES SERVICE
// ==========================================
export const employeeService = {
  async getEmployees(): Promise<User[]> {
    return employeeBackendService.getEmployees();
  },

  async getEmployeeById(id: string): Promise<User | null> {
    return employeeBackendService.getEmployeeById(id);
  },

  async getEmployeeProfile(id: string): Promise<User> {
    return employeeBackendService.getEmployeeProfile(id);
  },

  async updateEmployee(id: string, updates: Partial<User>): Promise<User> {
    return employeeBackendService.updateEmployee(id, updates);
  },

  async updateProfile(id: string, updates: Partial<User>): Promise<User> {
    return employeeBackendService.updateEmployee(id, updates);
  },

  async createEmployee(data: User): Promise<User> {
    return employeeBackendService.createEmployee(data);
  },

  async deactivateEmployee(id: string): Promise<User> {
    return employeeBackendService.deactivateEmployee(id);
  }
};

// ==========================================
// ANALYTICS & REPORTS SERVICE
// ==========================================
export const analyticsService = {
  async getHRMetrics(): Promise<HRMetrics> {
    return analyticsBackendService.getHRMetrics();
  },

  async getActionCenterItems(): Promise<ActionCenterItem[]> {
    return analyticsBackendService.getActionCenterItems();
  },

  async getAttendanceTrend() {
    return [
      { day: 'Mon', present: 94, remote: 42, onLeave: 6 },
      { day: 'Tue', present: 98, remote: 35, onLeave: 2 },
      { day: 'Wed', present: 95, remote: 38, onLeave: 5 },
      { day: 'Thu', present: 92, remote: 48, onLeave: 8 },
      { day: 'Fri', present: 88, remote: 54, onLeave: 12 },
      { day: 'Today', present: 96, remote: 40, onLeave: 4 }
    ];
  },

  async getDepartmentDistribution() {
    return [
      { name: 'Engineering', count: 18, budget: '$185k', fill: '#4f46e5' },
      { name: 'Product & Design', count: 8, budget: '$82k', fill: '#6366f1' },
      { name: 'Marketing', count: 6, budget: '$54k', fill: '#0ea5e9' },
      { name: 'Finance & Ops', count: 5, budget: '$48k', fill: '#10b981' },
      { name: 'People / HR', count: 4, budget: '$38k', fill: '#f59e0b' }
    ];
  },

  async getLeaveTrend() {
    return [
      { month: 'Mar', paid: 14, sick: 5, unpaid: 1 },
      { month: 'Apr', paid: 18, sick: 4, unpaid: 0 },
      { month: 'May', paid: 22, sick: 6, unpaid: 2 },
      { month: 'Jun', paid: 35, sick: 8, unpaid: 1 },
      { month: 'Jul', paid: 42, sick: 7, unpaid: 3 },
      { month: 'Aug', paid: 28, sick: 5, unpaid: 0 }
    ];
  }
};
