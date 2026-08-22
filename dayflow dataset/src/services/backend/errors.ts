export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'DUPLICATE_ATTENDANCE'
  | 'ALREADY_CHECKED_IN'
  | 'ALREADY_CHECKED_OUT'
  | 'CHECKOUT_BEFORE_CHECKIN'
  | 'INVALID_DATE_RANGE'
  | 'LEAVE_BALANCE_EXCEEDED'
  | 'OVERLAPPING_LEAVE'
  | 'SELF_APPROVAL_FORBIDDEN'
  | 'PAYROLL_ACCESS_DENIED'
  | 'DOCUMENT_ACCESS_DENIED'
  | 'INVALID_FILE_TYPE'
  | 'FILE_TOO_LARGE'
  | 'ROLE_ESCALATION_DENIED'
  | 'EMPLOYEE_DEACTIVATED'
  | 'INTERNAL_ERROR';

export interface ServiceErrorDetail {
  code: ErrorCode;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

export class DayflowError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: Record<string, unknown>;
  public readonly field?: string;

  constructor(code: ErrorCode, message: string, field?: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'DayflowError';
    this.code = code;
    this.field = field;
    this.details = details;
    Object.setPrototypeOf(this, DayflowError.prototype);
  }

  toJSON(): ServiceErrorDetail {
    return {
      code: this.code,
      message: this.message,
      ...(this.field && { field: this.field }),
      ...(this.details && { details: this.details })
    };
  }
}

export type ServiceResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: ServiceErrorDetail; data?: never };

export function successResult<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

export function errorResult<T>(code: ErrorCode, message: string, field?: string, details?: Record<string, unknown>): ServiceResult<T> {
  return {
    success: false,
    error: {
      code,
      message,
      ...(field && { field }),
      ...(details && { details })
    }
  };
}

export function sanitizeErrorMessage(error: unknown, fallbackMessage: string = 'An unexpected error occurred'): DayflowError {
  if (error instanceof DayflowError) {
    return error;
  }
  if (error instanceof Error) {
    // Avoid leaking internal SQL or driver messages
    if (error.message.includes('foreign key') || error.message.includes('violates') || error.message.includes('postgres')) {
      return new DayflowError('INTERNAL_ERROR', 'Database operation failed constraints check.');
    }
    return new DayflowError('INTERNAL_ERROR', error.message || fallbackMessage);
  }
  return new DayflowError('INTERNAL_ERROR', fallbackMessage);
}
