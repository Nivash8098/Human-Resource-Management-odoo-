import { AttendanceRecord, WorkMode, AttendanceStatus } from '../../frontend/src/types';
import { getSupabase, isSupabaseConfigured } from '../../frontend/src/services/supabase';
import { store, getFormattedDate } from '../../frontend/src/services/store';
import { authBackendService } from './auth.service';
import { authorization } from './authorization';
import { validation } from './validation';
import { DayflowError } from './errors';

export const attendanceBackendService = {
  /**
   * Safe duration calculator in minutes
   */
  calculateDurationMinutes(checkInTimeStr: string, checkOutTimeStr: string): number {
    const [inH, inM, inS = 0] = checkInTimeStr.split(':').map(Number);
    const [outH, outM, outS = 0] = checkOutTimeStr.split(':').map(Number);
    const inTotal = inH * 60 + inM + inS / 60;
    const outTotal = outH * 60 + outM + outS / 60;
    const diff = Math.round(outTotal - inTotal);
    return Math.max(1, diff);
  },

  /**
   * Check in for workday
   */
  async checkIn(targetEmployeeId?: string, workMode: WorkMode = 'office'): Promise<AttendanceRecord> {
    const caller = await authBackendService.getCurrentUser();
    const employeeId = targetEmployeeId || caller.id;

    // Check authorization: employee can check in for self, HR can check in for others if needed
    authorization.assertCanAccessEmployee(caller, employeeId);

    const validMode = validation.validateWorkMode(workMode);
    const todayStr = getFormattedDate(0);
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:mm:ss

    // Check if already checked in today
    const existing = await this.getTodayStatus(employeeId);
    if (existing && existing.check_in && !existing.check_out) {
      throw new DayflowError('ALREADY_CHECKED_IN', 'You are already checked in for today.');
    }

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const recordData = {
          employee_id: employeeId,
          date: todayStr,
          check_in: timeStr,
          check_out: null,
          duration_minutes: 0,
          status: 'present' as AttendanceStatus,
          work_mode: validMode
        };

        const { data, error } = await supabase
          .from('attendance')
          .upsert([recordData], { onConflict: 'employee_id,date' })
          .select('*')
          .single();

        if (data && !error) {
          store.checkIn(employeeId, validMode);
          return data as AttendanceRecord;
        }
      } catch (err) {
        console.warn('[Dayflow Attendance] Remote check-in fallback:', err);
      }
    }

    return store.checkIn(employeeId, validMode);
  },

  /**
   * Check out of workday
   */
  async checkOut(targetEmployeeId?: string): Promise<AttendanceRecord> {
    const caller = await authBackendService.getCurrentUser();
    const employeeId = targetEmployeeId || caller.id;

    authorization.assertCanAccessEmployee(caller, employeeId);

    const existing = await this.getTodayStatus(employeeId);
    if (!existing || !existing.check_in) {
      throw new DayflowError('CHECKOUT_BEFORE_CHECKIN', 'You must check in first before checking out.');
    }
    if (existing.check_out) {
      throw new DayflowError('ALREADY_CHECKED_OUT', 'You have already checked out for today.');
    }

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const duration = this.calculateDurationMinutes(existing.check_in, timeStr);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('attendance')
          .update({
            check_out: timeStr,
            duration_minutes: duration,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select('*')
          .single();

        if (data && !error) {
          store.checkOut(employeeId);
          return data as AttendanceRecord;
        }
      } catch (err) {
        console.warn('[Dayflow Attendance] Remote check-out fallback:', err);
      }
    }

    return store.checkOut(employeeId);
  },

  /**
   * Today's attendance status for employee
   */
  async getTodayStatus(employeeId: string): Promise<AttendanceRecord | null> {
    const todayStr = getFormattedDate(0);
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('attendance')
          .select('*')
          .eq('employee_id', employeeId)
          .eq('date', todayStr)
          .maybeSingle();

        if (data && !error) {
          return data as AttendanceRecord;
        }
      } catch (err) {
        console.warn('[Dayflow Attendance] Remote today status fallback:', err);
      }
    }
    const record = store.getTodayAttendance(employeeId);
    return record || null;
  },

  async getTodayRecord(employeeId: string): Promise<AttendanceRecord | null> {
    return this.getTodayStatus(employeeId);
  },

  /**
   * Attendance history (with employee isolation)
   */
  async getAttendanceHistory(employeeId?: string): Promise<AttendanceRecord[]> {
    const caller = await authBackendService.getCurrentUser();
    const targetId = employeeId || caller.id;

    if (targetId) {
      authorization.assertCanAccessEmployee(caller, targetId);
    } else {
      authorization.requireHROrAdmin(caller);
    }

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('attendance').select('*').order('date', { ascending: false });
        if (targetId) {
          query = query.eq('employee_id', targetId);
        }
        const { data, error } = await query;
        if (data && !error && data.length > 0) {
          return data as AttendanceRecord[];
        }
      } catch (err) {
        console.warn('[Dayflow Attendance] Remote history fallback:', err);
      }
    }

    const list = store.getAttendance();
    if (targetId) {
      return list.filter((a) => a.employee_id === targetId);
    }
    return list;
  },

  async getWeeklyAttendance(employeeId: string): Promise<AttendanceRecord[]> {
    const history = await this.getAttendanceHistory(employeeId);
    return history.slice(0, 7).reverse();
  },

  async getAllAttendance(): Promise<AttendanceRecord[]> {
    const caller = await authBackendService.getCurrentUser();
    authorization.requireHROrAdmin(caller);
    return this.getAttendanceHistory(undefined);
  },

  /**
   * HR correction / review of attendance record
   */
  async updateAttendance(id: string, updates: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const caller = await authBackendService.getCurrentUser();
    authorization.requireHROrAdmin(caller);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('attendance')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select('*')
          .single();

        if (data && !error) {
          return data as AttendanceRecord;
        }
      } catch (err) {
        console.warn('[Dayflow Attendance] Remote update fallback:', err);
      }
    }

    const list = store.getAttendance();
    const idx = list.findIndex((a) => a.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      return list[idx];
    }
    throw new DayflowError('NOT_FOUND', 'Attendance record not found.');
  }
};
