import { authBackendService } from '../auth.service';
import { authorization } from '../authorization';
import { validation } from '../validation';
import { attendanceBackendService } from '../attendance.service';
import { leaveBackendService } from '../leave.service';
import { payrollBackendService } from '../payroll.service';
import { documentBackendService } from '../document.service';
import { notificationBackendService } from '../notification.service';
import { activityBackendService } from '../activity.service';
import { analyticsBackendService } from '../analytics.service';
import { store } from '../../store';
import { DayflowError } from '../errors';
import { User } from '../../../types';

/**
 * Lightweight test suite runner for Dayflow backend services
 */
export async function runBackendTests() {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  const assert = (condition: boolean, message: string) => {
    if (!condition) throw new Error(message);
  };

  const test = async (name: string, fn: () => Promise<void> | void) => {
    try {
      await fn();
      results.push({ name, passed: true });
      console.log(`✅ PASS: ${name}`);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      results.push({ name, passed: false, error: errMsg });
      console.error(`❌ FAIL: ${name} -> ${errMsg}`);
    }
  };

  console.log('========================================================');
  console.log('🚀 RUNNING DAYFLOW BACKEND ARCHITECTURE TESTS');
  console.log('========================================================\n');

  // 1. VALIDATION TESTS
  await test('Validation: Email format checker', () => {
    assert(validation.isValidEmail('alex.morgan@dayflow.io') === true, 'Valid email must return true');
    assert(validation.isValidEmail('invalid-email') === false, 'Invalid email must return false');
    assert(validation.isValidEmail('') === false, 'Empty email must return false');
  });

  await test('Validation: Date range and day calculation', () => {
    const res = validation.validateDateRange('2026-09-01', '2026-09-05');
    assert(res.days === 5, `Expected 5 days, got ${res.days}`);
    
    let caught = false;
    try {
      validation.validateDateRange('2026-09-10', '2026-09-05');
    } catch (e) {
      if (e instanceof DayflowError && e.code === 'INVALID_DATE_RANGE') {
        caught = true;
      }
    }
    assert(caught, 'Inverted date range must throw INVALID_DATE_RANGE error');
  });

  // 2. AUTHORIZATION TESTS
  await test('Authorization: Employee restricted profile self-service sanitization', () => {
    const mockEmployee: User = {
      id: 'emp-101',
      email: 'emp@dayflow.io',
      full_name: 'Employee Test',
      employee_id: 'DF-9999',
      role: 'employee',
      department: 'Engineering',
      job_title: 'Engineer',
      status: 'active',
      joining_date: '2024-01-01',
      work_mode: 'office'
    };

    // Employee attempts to change their role and department
    const sanitized = authorization.sanitizeEmployeeProfileUpdates(mockEmployee, 'emp-101', {
      phone: '+1 555-111-2222',
      role: 'hr_admin', // Illegal escalation attempt
      department: 'Executive' // Illegal change attempt
    });

    assert(sanitized.phone === '+1 555-111-2222', 'Allowed personal field should be updated');
    assert((sanitized as Partial<User>).role === undefined, 'Role escalation must be stripped out');
    assert((sanitized as Partial<User>).department === undefined, 'Department mutation must be stripped out');
  });

  await test('Authorization: Prevent employee from approving own leave', () => {
    const mockHR: User = {
      id: 'hr-1',
      email: 'hr@dayflow.io',
      full_name: 'HR Admin',
      employee_id: 'DF-1001',
      role: 'hr_admin',
      department: 'People Operations',
      job_title: 'HR Manager',
      status: 'active',
      joining_date: '2024-01-01',
      work_mode: 'office'
    };

    let caughtSelfApproval = false;
    try {
      authorization.assertCanReviewLeave(mockHR, 'hr-1');
    } catch (e) {
      if (e instanceof DayflowError && e.code === 'SELF_APPROVAL_FORBIDDEN') {
        caughtSelfApproval = true;
      }
    }
    assert(caughtSelfApproval, 'HR should not be allowed to review their own leave request');
  });

  // 3. ATTENDANCE TESTS
  await test('Attendance: Check-in, duration calculation, and checkout', async () => {
    const duration = attendanceBackendService.calculateDurationMinutes('09:00:00', '17:30:00');
    assert(duration === 510, `Expected 510 minutes (8.5h), got ${duration}`);
  });

  // 4. PAYROLL TESTS
  await test('Payroll: Net salary calculation math', () => {
    const net = payrollBackendService.computeNetSalary(
      85000,
      { housing: 12000, transport: 4500, medical: 3000, performance: 8000 },
      { tax: 14200, provident_fund: 7200, health_insurance: 2100 }
    );
    // 85000 + 27500 - 23500 = 89000
    assert(net === 89000, `Expected 89000, got ${net}`);
  });

  // 5. DOCUMENT TESTS
  await test('Documents: Validate supported file types and size limits', () => {
    let caughtInvalidExt = false;
    try {
      validation.validateDocumentMetadata('Malicious Executable', 'Identity', 'exe');
    } catch (e) {
      if (e instanceof DayflowError && e.code === 'INVALID_FILE_TYPE') {
        caughtInvalidExt = true;
      }
    }
    assert(caughtInvalidExt, 'Executable extension must be rejected');

    let caughtTooLarge = false;
    try {
      validation.validateDocumentMetadata('Large Video File', 'Identity', 'pdf', 15 * 1024 * 1024);
    } catch (e) {
      if (e instanceof DayflowError && e.code === 'FILE_TOO_LARGE') {
        caughtTooLarge = true;
      }
    }
    assert(caughtTooLarge, 'Files over 10MB must be rejected');
  });

  // 6. NOTIFICATION & AUDIT LOGGING
  await test('Notifications & Activities: Record creation and audit logs', async () => {
    const notif = await notificationBackendService.createNotification({
      user_id: 'emp-test-1',
      title: 'Automated Test Notification',
      message: 'System test verification message',
      type: 'system'
    });
    assert(notif.title === 'Automated Test Notification', 'Notification was created with correct title');

    const activity = await activityBackendService.logActivity({
      user_id: 'emp-test-1',
      user_name: 'Test Actor',
      action: 'Test Audit Entry',
      details: 'Audit logging test execution',
      type: 'announcement'
    });
    assert(activity.action === 'Test Audit Entry', 'Audit activity was logged with correct action');
  });

  // 7. ANALYTICS & DASHBOARD METRICS
  await test('Analytics: Aggregate HR Metrics and Action Center items calculation', async () => {
    const metrics = store.getHRMetrics();
    assert(typeof metrics.total_employees === 'number', 'total_employees must be a number');
    assert(typeof metrics.attendance_rate === 'number', 'attendance_rate must be a number');
    assert(typeof metrics.workforce_availability === 'number', 'workforce_availability must be a number');
    assert(typeof metrics.present_today === 'number', 'present_today must be a number');

    const actionItems = store.getActionCenterItems();
    assert(Array.isArray(actionItems), 'action items must be an array');
    assert(actionItems.length > 0, 'action items should contain operational items');
  });

  console.log('\n========================================================');
  const passedCount = results.filter((r) => r.passed).length;
  console.log(`RESULTS: ${passedCount}/${results.length} Tests Passed`);
  console.log('========================================================\n');

  return { total: results.length, passed: passedCount, results };
}
