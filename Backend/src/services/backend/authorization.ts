import { User, UserRole } from '../../types';
import { DayflowError } from './errors';

export interface AuthContextState {
  currentUser: User | null;
}

export const authorization = {
  /**
   * Asserts that a valid authenticated session exists.
   */
  requireAuthenticatedUser(user: User | null | undefined): User {
    if (!user || !user.id) {
      throw new DayflowError('UNAUTHORIZED', 'Authentication required. Please sign in.');
    }
    return user;
  },

  /**
   * Verifies that the user has HR or Admin management privileges.
   */
  isHROrAdmin(user: User | null | undefined): boolean {
    if (!user) return false;
    return user.role === 'hr_admin';
  },

  /**
   * Asserts that the caller is an HR Admin.
   */
  requireHROrAdmin(user: User | null | undefined): User {
    const validUser = this.requireAuthenticatedUser(user);
    if (!this.isHROrAdmin(validUser)) {
      throw new DayflowError('FORBIDDEN', 'Access denied. HR Administrator permissions required.');
    }
    return validUser;
  },

  requireHR(user: User | null | undefined): User {
    return this.requireHROrAdmin(user);
  },

  requireAdmin(user: User | null | undefined): User {
    return this.requireHROrAdmin(user);
  },

  /**
   * Ensures that regular employees can only access their own data,
   * while HR/Admin can access any employee's data.
   */
  assertCanAccessEmployee(requestingUser: User | null | undefined, targetEmployeeId: string): void {
    const user = this.requireAuthenticatedUser(requestingUser);
    const isSelf = user.id === targetEmployeeId || user.employee_id === targetEmployeeId;
    if (!isSelf && !this.isHROrAdmin(user)) {
      throw new DayflowError('FORBIDDEN', 'You do not have permission to view this employee record.');
    }
  },

  /**
   * Enforces that regular employees can only modify self-service profile fields,
   * while HR/Admin can manage full records.
   */
  assertCanModifyEmployee(requestingUser: User | null | undefined, targetEmployeeId: string): boolean {
    const user = this.requireAuthenticatedUser(requestingUser);
    const isSelf = user.id === targetEmployeeId || user.employee_id === targetEmployeeId;
    if (this.isHROrAdmin(user)) {
      return true; // HR/Admin can update employee records
    }
    if (!isSelf) {
      throw new DayflowError('FORBIDDEN', 'You cannot modify another employee profile.');
    }
    return false; // is regular employee modifying self
  },

  /**
   * Strips out restricted fields for standard employee self-service.
   * Employees cannot modify: role, salary, employee_id, department, job_title, status, joining_date, manager_name.
   */
  sanitizeEmployeeProfileUpdates(
    requestingUser: User,
    targetEmployeeId: string,
    rawUpdates: Partial<User>
  ): Partial<User> {
    const isHR = this.isHROrAdmin(requestingUser);
    
    if (isHR) {
      // HR/Admin can update all operational fields
      return { ...rawUpdates };
    }

    // Standard employee self-service: only allow personal details
    const isSelf = requestingUser.id === targetEmployeeId || requestingUser.employee_id === targetEmployeeId;
    if (!isSelf) {
      throw new DayflowError('FORBIDDEN', 'You cannot update records of another colleague.');
    }

    const permittedUpdates: Partial<User> = {};
    if (rawUpdates.phone !== undefined) permittedUpdates.phone = rawUpdates.phone;
    if (rawUpdates.address !== undefined) permittedUpdates.address = rawUpdates.address;
    if (rawUpdates.avatar_url !== undefined) permittedUpdates.avatar_url = rawUpdates.avatar_url;
    if (rawUpdates.work_mode !== undefined) permittedUpdates.work_mode = rawUpdates.work_mode;
    if (rawUpdates.emergency_contact !== undefined) permittedUpdates.emergency_contact = rawUpdates.emergency_contact;

    return permittedUpdates;
  },

  /**
   * Asserts that an employee cannot approve their own leave request.
   */
  assertCanReviewLeave(requestingUser: User, leaveEmployeeId: string): void {
    this.requireHROrAdmin(requestingUser);
    const isSelf = requestingUser.id === leaveEmployeeId || requestingUser.employee_id === leaveEmployeeId;
    if (isSelf) {
      throw new DayflowError('SELF_APPROVAL_FORBIDDEN', 'Employees are not permitted to review or approve their own leave requests.');
    }
  },

  /**
   * Asserts that payroll is protected by strict authorization.
   */
  assertCanManagePayroll(requestingUser: User): void {
    this.requireHROrAdmin(requestingUser);
  }
};
