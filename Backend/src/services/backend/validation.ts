import { DayflowError } from './errors';
import { LeaveType, WorkMode, UserRole, DocumentCategory } from '../../types';

export const VALID_ROLES: UserRole[] = ['employee', 'hr_admin'];
export const VALID_WORK_MODES: WorkMode[] = ['office', 'remote', 'hybrid'];
export const VALID_LEAVE_TYPES: LeaveType[] = ['paid', 'sick', 'unpaid', 'casual', 'maternity'];
export const VALID_DOC_CATEGORIES: DocumentCategory[] = ['Identity', 'Employment', 'Payroll', 'Other'];

export const ALLOWED_DOC_EXTENSIONS = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'];
export const MAX_DOC_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const validation = {
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return typeof email === 'string' && emailRegex.test(email.trim());
  },

  validateEmail(email: string): string {
    if (!email || !this.isValidEmail(email)) {
      throw new DayflowError('VALIDATION_ERROR', 'A valid corporate email address is required.', 'email');
    }
    return email.trim().toLowerCase();
  },

  validatePassword(password: string): string {
    if (!password || typeof password !== 'string') {
      throw new DayflowError('VALIDATION_ERROR', 'Password is required.', 'password');
    }
    if (password.length < 6) {
      throw new DayflowError('VALIDATION_ERROR', 'Password must be at least 6 characters.', 'password');
    }
    return password;
  },

  validateEmployeeId(empId: string): string {
    if (!empId || typeof empId !== 'string' || empId.trim().length === 0) {
      throw new DayflowError('VALIDATION_ERROR', 'Employee ID is required.', 'employee_id');
    }
    const clean = empId.trim().toUpperCase();
    if (!/^DF-[A-Z0-9]+$/i.test(clean) && clean.length < 3) {
      throw new DayflowError('VALIDATION_ERROR', 'Invalid Employee ID format. (Expected DF-XXXX)', 'employee_id');
    }
    return clean;
  },

  validateRole(role: unknown): UserRole {
    if (typeof role === 'string' && VALID_ROLES.includes(role as UserRole)) {
      return role as UserRole;
    }
    return 'employee'; // Safe fallback default
  },

  validateWorkMode(mode: unknown): WorkMode {
    if (typeof mode === 'string' && VALID_WORK_MODES.includes(mode as WorkMode)) {
      return mode as WorkMode;
    }
    return 'office';
  },

  validateLeaveType(type: unknown): LeaveType {
    if (typeof type === 'string' && VALID_LEAVE_TYPES.includes(type as LeaveType)) {
      return type as LeaveType;
    }
    throw new DayflowError('VALIDATION_ERROR', `Invalid leave type: ${type}`, 'leave_type');
  },

  validateDateRange(startDateStr: string, endDateStr: string): { start: Date; end: Date; days: number } {
    if (!startDateStr || !endDateStr) {
      throw new DayflowError('INVALID_DATE_RANGE', 'Start date and end date are both required.');
    }

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new DayflowError('INVALID_DATE_RANGE', 'Invalid date format provided. Use YYYY-MM-DD.');
    }

    // Set times to midnight UTC for pure date comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end.getTime() < start.getTime()) {
      throw new DayflowError('INVALID_DATE_RANGE', 'End date must be on or after start date.');
    }

    const diffMs = end.getTime() - start.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

    return { start, end, days };
  },

  validateSalaryPositive(amount: unknown, fieldName: string): number {
    const num = Number(amount);
    if (isNaN(num) || num < 0) {
      throw new DayflowError('VALIDATION_ERROR', `${fieldName} must be a non-negative number.`, fieldName);
    }
    return Math.round(num * 100) / 100;
  },

  validateDocumentMetadata(title: string, category: string, fileExtension?: string, fileSize?: number): void {
    if (!title || title.trim().length === 0) {
      throw new DayflowError('VALIDATION_ERROR', 'Document title is required.', 'title');
    }
    if (!VALID_DOC_CATEGORIES.includes(category as DocumentCategory)) {
      throw new DayflowError('VALIDATION_ERROR', `Invalid document category: ${category}`, 'category');
    }
    if (fileExtension) {
      const ext = fileExtension.toLowerCase().replace('.', '');
      if (!ALLOWED_DOC_EXTENSIONS.includes(ext)) {
        throw new DayflowError('INVALID_FILE_TYPE', `File type .${ext} is not supported. Allowed: ${ALLOWED_DOC_EXTENSIONS.join(', ')}`);
      }
    }
    if (fileSize !== undefined && fileSize > MAX_DOC_FILE_SIZE_BYTES) {
      throw new DayflowError('FILE_TOO_LARGE', `Document size exceeds maximum allowable limit of 10MB.`);
    }
  }
};
