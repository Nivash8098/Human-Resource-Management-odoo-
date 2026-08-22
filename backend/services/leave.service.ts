import { LeaveRequest, LeaveBalance, LeaveType, LeaveStatus } from '../../frontend/src/types';
import { getSupabase, isSupabaseConfigured } from '../../frontend/src/services/supabase';
import { store } from '../../frontend/src/services/store';
import { authBackendService } from './auth.service';
import { authorization } from './authorization';
import { validation } from './validation';
import { DayflowError } from './errors';

export const leaveBackendService = {
  /**
   * Leave balances retrieval with employee isolation
   */
  async getBalances(employeeId: string): Promise<LeaveBalance> {
    const caller = await authBackendService.getCurrentUser();
    authorization.assertCanAccessEmployee(caller, employeeId);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('leave_balances')
          .select('*')
          .eq('employee_id', employeeId);

        if (data && !error && data.length > 0) {
          const balanceObj: LeaveBalance = {
            employee_id: employeeId,
            paid: { total: 20, used: 0, remaining: 20 },
            sick: { total: 10, used: 0, remaining: 10 },
            unpaid: { total: 10, used: 0, remaining: 10 }
          };
          data.forEach((row: { leave_type: string; total_days: number; used_days: number; remaining_days: number }) => {
            if (row.leave_type === 'paid') {
              balanceObj.paid = { total: row.total_days, used: row.used_days, remaining: row.remaining_days };
            } else if (row.leave_type === 'sick') {
              balanceObj.sick = { total: row.total_days, used: row.used_days, remaining: row.remaining_days };
            } else if (row.leave_type === 'unpaid') {
              balanceObj.unpaid = { total: row.total_days, used: row.used_days, remaining: row.remaining_days };
            }
          });
          return balanceObj;
        }
      } catch (err) {
        console.warn('[Dayflow Leave] Remote balances fallback:', err);
      }
    }

    return store.getLeaveBalances(employeeId);
  },

  async getBalance(employeeId: string): Promise<LeaveBalance> {
    return this.getBalances(employeeId);
  },

  /**
   * Check for overlapping leave requests
   */
  async checkOverlappingLeave(employeeId: string, startDate: string, endDate: string, excludeRequestId?: string): Promise<void> {
    const existing = await this.getEmployeeRequests(employeeId);
    const newStart = new Date(startDate).getTime();
    const newEnd = new Date(endDate).getTime();

    for (const req of existing) {
      if (excludeRequestId && req.id === excludeRequestId) continue;
      if (req.status === 'rejected' || req.status === 'cancelled' as unknown) continue;

      const reqStart = new Date(req.start_date).getTime();
      const reqEnd = new Date(req.end_date).getTime();

      // Check date collision: (StartA <= EndB) and (EndA >= StartB)
      if (newStart <= reqEnd && newEnd >= reqStart) {
        throw new DayflowError(
          'OVERLAPPING_LEAVE',
          `You already have an active or pending leave request for the overlapping dates (${req.start_date} to ${req.end_date}).`
        );
      }
    }
  },

  /**
   * Submit a new leave request with validation and balance checks
   */
  async submitRequest(payload: Omit<LeaveRequest, 'id' | 'status' | 'submitted_at'>): Promise<LeaveRequest> {
    const caller = await authBackendService.getCurrentUser();
    const employeeId = payload.employee_id || caller.id;

    authorization.assertCanAccessEmployee(caller, employeeId);

    // Validation
    const leaveType = validation.validateLeaveType(payload.leave_type);
    const { start, end, days } = validation.validateDateRange(payload.start_date, payload.end_date);
    if (!payload.reason || payload.reason.trim().length === 0) {
      throw new DayflowError('VALIDATION_ERROR', 'Please provide a reason for the leave request.', 'reason');
    }

    // Check balance
    const balances = await this.getBalances(employeeId);
    if (leaveType === 'paid' && balances.paid.remaining < days) {
      throw new DayflowError(
        'LEAVE_BALANCE_EXCEEDED',
        `Insufficient paid leave balance. Available: ${balances.paid.remaining} day(s), Requested: ${days} day(s).`
      );
    } else if (leaveType === 'sick' && balances.sick.remaining < days) {
      throw new DayflowError(
        'LEAVE_BALANCE_EXCEEDED',
        `Insufficient sick leave balance. Available: ${balances.sick.remaining} day(s), Requested: ${days} day(s).`
      );
    }

    // Check overlapping leaves
    await this.checkOverlappingLeave(employeeId, payload.start_date, payload.end_date);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const insertRecord = {
          employee_id: employeeId,
          employee_name: payload.employee_name || caller.full_name,
          employee_avatar: payload.employee_avatar || caller.avatar_url,
          department: payload.department || caller.department,
          job_title: payload.job_title || caller.job_title,
          leave_type: leaveType,
          start_date: payload.start_date,
          end_date: payload.end_date,
          days,
          reason: payload.reason.trim(),
          status: 'pending' as LeaveStatus,
          submitted_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('leave_requests')
          .insert([insertRecord])
          .select('*')
          .single();

        if (data && !error) {
          store.submitLeaveRequest(payload);
          return data as LeaveRequest;
        }
      } catch (err) {
        console.warn('[Dayflow Leave] Remote submit fallback:', err);
      }
    }

    return store.submitLeaveRequest({
      ...payload,
      leave_type: leaveType,
      days
    });
  },

  async applyLeave(payload: Omit<LeaveRequest, 'id' | 'status' | 'submitted_at'>): Promise<LeaveRequest> {
    return this.submitRequest(payload);
  },

  /**
   * Get leave requests for specific employee
   */
  async getEmployeeRequests(employeeId: string): Promise<LeaveRequest[]> {
    const caller = await authBackendService.getCurrentUser();
    authorization.assertCanAccessEmployee(caller, employeeId);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('leave_requests')
          .select('*')
          .eq('employee_id', employeeId)
          .order('submitted_at', { ascending: false });

        if (data && !error && data.length > 0) {
          return data as LeaveRequest[];
        }
      } catch (err) {
        console.warn('[Dayflow Leave] Remote employee requests fallback:', err);
      }
    }

    return store.getLeaveRequests().filter((l) => l.employee_id === employeeId);
  },

  async getMyRequests(employeeId: string): Promise<LeaveRequest[]> {
    return this.getEmployeeRequests(employeeId);
  },

  async getMyLeaveRequests(employeeId: string): Promise<LeaveRequest[]> {
    return this.getEmployeeRequests(employeeId);
  },

  /**
   * Get all leave requests (HR only)
   */
  async getAllRequests(): Promise<LeaveRequest[]> {
    const caller = await authBackendService.getCurrentUser();
    authorization.requireHROrAdmin(caller);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('leave_requests')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (data && !error && data.length > 0) {
          return data as LeaveRequest[];
        }
      } catch (err) {
        console.warn('[Dayflow Leave] Remote all requests fallback:', err);
      }
    }

    return store.getLeaveRequests();
  },

  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    return this.getAllRequests();
  },

  async getLeaveRequestById(id: string): Promise<LeaveRequest | null> {
    const caller = await authBackendService.getCurrentUser();
    const all = await store.getLeaveRequests();
    const req = all.find((r) => r.id === id);
    if (!req) return null;
    authorization.assertCanAccessEmployee(caller, req.employee_id);
    return req;
  },

  /**
   * Review leave request (Approve or Reject)
   */
  async reviewRequest(
    requestId: string,
    status: 'approved' | 'rejected',
    reviewerName?: string,
    reviewerComment?: string
  ): Promise<LeaveRequest> {
    const caller = await authBackendService.getCurrentUser();
    authorization.requireHROrAdmin(caller);

    const all = store.getLeaveRequests();
    const req = all.find((r) => r.id === requestId);
    if (!req) {
      throw new DayflowError('NOT_FOUND', 'Leave request not found.');
    }

    // Ensure reviewer is not approving their own request
    authorization.assertCanReviewLeave(caller, req.employee_id);

    const revName = reviewerName || caller.full_name;

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('leave_requests')
          .update({
            status,
            reviewed_at: new Date().toISOString(),
            reviewer_name: revName,
            reviewer_comment: reviewerComment || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', requestId)
          .select('*')
          .single();

        if (data && !error) {
          store.reviewLeaveRequest(requestId, status, revName, reviewerComment);
          return data as LeaveRequest;
        }
      } catch (err) {
        console.warn('[Dayflow Leave] Remote review fallback:', err);
      }
    }

    return store.reviewLeaveRequest(requestId, status, revName, reviewerComment);
  },

  async approveLeave(requestId: string, comment?: string): Promise<LeaveRequest> {
    const caller = await authBackendService.getCurrentUser();
    return this.reviewRequest(requestId, 'approved', caller.full_name, comment);
  },

  async rejectLeave(requestId: string, comment?: string): Promise<LeaveRequest> {
    const caller = await authBackendService.getCurrentUser();
    return this.reviewRequest(requestId, 'rejected', caller.full_name, comment);
  },

  /**
   * Cancel pending leave request (by owner or HR)
   */
  async cancelRequest(requestId: string): Promise<void> {
    const caller = await authBackendService.getCurrentUser();
    const all = store.getLeaveRequests();
    const req = all.find((r) => r.id === requestId);
    if (!req) {
      throw new DayflowError('NOT_FOUND', 'Leave request not found.');
    }

    authorization.assertCanAccessEmployee(caller, req.employee_id);

    if (req.status !== 'pending') {
      throw new DayflowError('VALIDATION_ERROR', 'Only pending leave requests can be cancelled.');
    }

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('leave_requests')
          .delete()
          .eq('id', requestId);
      } catch (err) {
        console.warn('[Dayflow Leave] Remote delete fallback:', err);
      }
    }

    store.cancelLeaveRequest(requestId);
  },

  async cancelLeave(requestId: string): Promise<void> {
    return this.cancelRequest(requestId);
  }
};
