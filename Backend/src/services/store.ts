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

const STORAGE_KEYS = {
  USERS: 'dayflow_users_v1',
  CURRENT_USER: 'dayflow_current_user_v1',
  ATTENDANCE: 'dayflow_attendance_v1',
  LEAVES: 'dayflow_leaves_v1',
  LEAVE_BALANCES: 'dayflow_leave_balances_v1',
  PAYROLLS: 'dayflow_payrolls_v1',
  DOCUMENTS: 'dayflow_documents_v1',
  NOTIFICATIONS: 'dayflow_notifications_v1',
  ACTIVITIES: 'dayflow_activities_v1',
};

// Initial Core Users
const INITIAL_USERS: User[] = [
  {
    id: 'emp-001',
    email: 'alex.morgan@dayflow.io',
    full_name: 'Alex Morgan',
    employee_id: 'DF-1042',
    role: 'employee',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    job_title: 'Senior Frontend Architect',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, San Francisco, CA 94107',
    joining_date: '2023-03-15',
    status: 'active',
    work_mode: 'hybrid',
    manager_name: 'Sarah Jenkins',
    emergency_contact: {
      name: 'Michael Morgan',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543'
    }
  },
  {
    id: 'admin-001',
    email: 'sarah.jenkins@dayflow.io',
    full_name: 'Sarah Jenkins',
    employee_id: 'DF-1001',
    role: 'hr_admin',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'People Operations',
    job_title: 'Director of People & Talent',
    phone: '+1 (555) 345-6789',
    address: '100 Market Street, San Francisco, CA 94105',
    joining_date: '2021-01-10',
    status: 'active',
    work_mode: 'office',
    manager_name: 'Elena Rostova (CEO)',
    emergency_contact: {
      name: 'David Jenkins',
      relationship: 'Spouse',
      phone: '+1 (555) 876-5432'
    }
  },
  {
    id: 'emp-002',
    email: 'marcus.vance@dayflow.io',
    full_name: 'Marcus Vance',
    employee_id: 'DF-1043',
    role: 'employee',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Product Design',
    job_title: 'Lead Product Designer',
    phone: '+1 (555) 456-7890',
    address: '450 Pine Street, Berkeley, CA 94704',
    joining_date: '2023-06-01',
    status: 'active',
    work_mode: 'remote',
    manager_name: 'Sarah Jenkins'
  },
  {
    id: 'emp-003',
    email: 'priya.sharma@dayflow.io',
    full_name: 'Priya Sharma',
    employee_id: 'DF-1044',
    role: 'employee',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    job_title: 'Staff Backend Engineer',
    phone: '+1 (555) 567-8901',
    address: '210 Mission St, San Francisco, CA 94105',
    joining_date: '2022-11-15',
    status: 'on_leave',
    work_mode: 'hybrid',
    manager_name: 'Alex Morgan'
  },
  {
    id: 'emp-004',
    email: 'jordan.lee@dayflow.io',
    full_name: 'Jordan Lee',
    employee_id: 'DF-1045',
    role: 'employee',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Marketing',
    job_title: 'Growth Marketing Manager',
    phone: '+1 (555) 678-9012',
    address: '880 Harrison St, Oakland, CA 94607',
    joining_date: '2024-01-08',
    status: 'active',
    work_mode: 'office',
    manager_name: 'Sarah Jenkins'
  },
  {
    id: 'emp-005',
    email: 'chloe.dupont@dayflow.io',
    full_name: 'Chloé Dupont',
    employee_id: 'DF-1046',
    role: 'employee',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    department: 'Finance',
    job_title: 'Senior Financial Analyst',
    phone: '+1 (555) 789-0123',
    address: '320 Sutter St, San Francisco, CA 94108',
    joining_date: '2023-09-20',
    status: 'active',
    work_mode: 'hybrid',
    manager_name: 'Sarah Jenkins'
  }
];

// Helper to get formatted date string for today and past days
export function getFormattedDate(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

// Initial Attendance Records (for past 30 days)
const generateInitialAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Create attendance for Alex Morgan (emp-001) for past 20 workdays
  for (let i = 0; i <= 20; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends
    
    const dateStr = d.toISOString().split('T')[0];
    
    if (i === 0) {
      // Today: Alex is checked in at 08:57 AM
      records.push({
        id: `att-alex-today`,
        employee_id: 'emp-001',
        date: dateStr,
        check_in: '08:57:00',
        check_out: null,
        duration_minutes: 272, // ~4h 32m
        status: 'present',
        work_mode: 'hybrid',
        notes: 'In office for sprint planning'
      });
    } else if (i === 4) {
      // Alex took a half day 4 days ago
      records.push({
        id: `att-alex-${i}`,
        employee_id: 'emp-001',
        date: dateStr,
        check_in: '09:05:00',
        check_out: '13:30:00',
        duration_minutes: 265,
        status: 'half_day',
        work_mode: 'office',
        notes: 'Doctor appointment in afternoon'
      });
    } else {
      records.push({
        id: `att-alex-${i}`,
        employee_id: 'emp-001',
        date: dateStr,
        check_in: '09:02:00',
        check_out: '17:45:00',
        duration_minutes: 523,
        status: 'present',
        work_mode: i % 2 === 0 ? 'office' : 'hybrid',
        notes: 'Regular workday'
      });
    }
  }

  // Add records for Marcus, Priya, Jordan, Chloe
  INITIAL_USERS.forEach((user) => {
    if (user.id === 'emp-001') return;
    const dateStr = getFormattedDate(0);
    if (user.id === 'emp-003') {
      // Priya is on approved medical leave today
      records.push({
        id: `att-${user.id}-today`,
        employee_id: user.id,
        date: dateStr,
        check_in: null,
        check_out: null,
        duration_minutes: 0,
        status: 'leave',
        work_mode: 'hybrid',
        notes: 'Approved sick leave'
      });
    } else {
      records.push({
        id: `att-${user.id}-today`,
        employee_id: user.id,
        date: dateStr,
        check_in: '09:12:00',
        check_out: null,
        duration_minutes: 258,
        status: 'present',
        work_mode: user.work_mode || 'office'
      });
    }
  });

  return records;
};

// Initial Leave Balances
const INITIAL_LEAVE_BALANCES: Record<string, LeaveBalance> = {
  'emp-001': {
    employee_id: 'emp-001',
    paid: { total: 20, used: 6, remaining: 14 },
    sick: { total: 10, used: 2, remaining: 8 },
    unpaid: { total: 10, used: 0, remaining: 10 }
  },
  'admin-001': {
    employee_id: 'admin-001',
    paid: { total: 25, used: 8, remaining: 17 },
    sick: { total: 12, used: 1, remaining: 11 },
    unpaid: { total: 10, used: 0, remaining: 10 }
  },
  'emp-002': {
    employee_id: 'emp-002',
    paid: { total: 20, used: 5, remaining: 15 },
    sick: { total: 10, used: 3, remaining: 7 },
    unpaid: { total: 10, used: 0, remaining: 10 }
  },
  'emp-003': {
    employee_id: 'emp-003',
    paid: { total: 20, used: 12, remaining: 8 },
    sick: { total: 10, used: 6, remaining: 4 },
    unpaid: { total: 10, used: 0, remaining: 10 }
  }
};

// Initial Leave Requests
const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr-101',
    employee_id: 'emp-002',
    employee_name: 'Marcus Vance',
    employee_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Product Design',
    job_title: 'Lead Product Designer',
    leave_type: 'paid',
    start_date: getFormattedDate(5),
    end_date: getFormattedDate(8),
    days: 4,
    reason: 'Attending annual UX/UI Design Summit in Seattle and taking 2 rest days.',
    status: 'pending',
    submitted_at: '2026-08-20T14:32:00Z'
  },
  {
    id: 'lr-102',
    employee_id: 'emp-004',
    employee_name: 'Jordan Lee',
    employee_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Marketing',
    job_title: 'Growth Marketing Manager',
    leave_type: 'paid',
    start_date: getFormattedDate(12),
    end_date: getFormattedDate(15),
    days: 4,
    reason: 'Family wedding out of state.',
    status: 'pending',
    submitted_at: '2026-08-21T09:15:00Z'
  },
  {
    id: 'lr-103',
    employee_id: 'emp-003',
    employee_name: 'Priya Sharma',
    employee_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    job_title: 'Staff Backend Engineer',
    leave_type: 'sick',
    start_date: getFormattedDate(0),
    end_date: getFormattedDate(1),
    days: 2,
    reason: 'Severe migraine, doctor advised rest.',
    status: 'approved',
    submitted_at: '2026-08-20T08:00:00Z',
    reviewed_at: '2026-08-20T08:45:00Z',
    reviewer_name: 'Sarah Jenkins',
    reviewer_comment: 'Get well soon, Priya! Tasks redistributed.'
  },
  {
    id: 'lr-104',
    employee_id: 'emp-001',
    employee_name: 'Alex Morgan',
    employee_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    job_title: 'Senior Frontend Architect',
    leave_type: 'paid',
    start_date: getFormattedDate(-15),
    end_date: getFormattedDate(-12),
    days: 4,
    reason: 'Annual summer vacation with family.',
    status: 'approved',
    submitted_at: '2026-07-28T10:00:00Z',
    reviewed_at: '2026-07-28T15:20:00Z',
    reviewer_name: 'Sarah Jenkins',
    reviewer_comment: 'Approved! Have a wonderful trip.'
  }
];

// Initial Payroll Records
const INITIAL_PAYROLLS: PayrollRecord[] = [
  {
    id: 'pay-001',
    employee_id: 'emp-001',
    employee_name: 'Alex Morgan',
    employee_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    job_title: 'Senior Frontend Architect',
    base_salary: 11500,
    allowances: {
      housing: 1200,
      transport: 400,
      medical: 500,
      performance: 800
    },
    deductions: {
      tax: 2450,
      provident_fund: 690,
      health_insurance: 250
    },
    net_salary: 11010,
    currency: 'INR',
    pay_period: 'August 2026',
    payment_date: '2026-08-31',
    status: 'processing',
    last_updated: '2026-08-20',
    payment_method: 'Direct Deposit (**** 4829)'
  },
  {
    id: 'pay-002',
    employee_id: 'emp-002',
    employee_name: 'Marcus Vance',
    employee_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Product Design',
    job_title: 'Lead Product Designer',
    base_salary: 10800,
    allowances: {
      housing: 1100,
      transport: 350,
      medical: 500,
      performance: 600
    },
    deductions: {
      tax: 2280,
      provident_fund: 648,
      health_insurance: 250
    },
    net_salary: 10172,
    currency: 'INR',
    pay_period: 'August 2026',
    payment_date: '2026-08-31',
    status: 'processing',
    last_updated: '2026-08-20',
    payment_method: 'Direct Deposit (**** 1923)'
  },
  {
    id: 'pay-003',
    employee_id: 'emp-003',
    employee_name: 'Priya Sharma',
    employee_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    job_title: 'Staff Backend Engineer',
    base_salary: 12200,
    allowances: {
      housing: 1300,
      transport: 400,
      medical: 500,
      performance: 900
    },
    deductions: {
      tax: 2650,
      provident_fund: 732,
      health_insurance: 250
    },
    net_salary: 11668,
    currency: 'INR',
    pay_period: 'August 2026',
    payment_date: '2026-08-31',
    status: 'processing',
    last_updated: '2026-08-20',
    payment_method: 'Direct Deposit (**** 7712)'
  },
  {
    id: 'pay-004',
    employee_id: 'admin-001',
    employee_name: 'Sarah Jenkins',
    employee_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'People Operations',
    job_title: 'Director of People & Talent',
    base_salary: 13500,
    allowances: {
      housing: 1500,
      transport: 400,
      medical: 500,
      performance: 1200
    },
    deductions: {
      tax: 3100,
      provident_fund: 810,
      health_insurance: 250
    },
    net_salary: 12940,
    currency: 'INR',
    pay_period: 'August 2026',
    payment_date: '2026-08-31',
    status: 'paid',
    last_updated: '2026-08-15',
    payment_method: 'Direct Deposit (**** 9002)'
  }
];

// Initial Documents
const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-001',
    employee_id: 'emp-001',
    employee_name: 'Alex Morgan',
    title: 'Employment Agreement & NDA (2023)',
    category: 'Employment',
    file_size: '2.4 MB',
    file_type: 'PDF',
    url: '#',
    uploaded_at: '2023-03-15',
    status: 'verified'
  },
  {
    id: 'doc-002',
    employee_id: 'emp-001',
    employee_name: 'Alex Morgan',
    title: 'Passport & Identity Verification',
    category: 'Identity',
    file_size: '1.8 MB',
    file_type: 'PDF',
    url: '#',
    uploaded_at: '2023-03-16',
    status: 'verified'
  },
  {
    id: 'doc-003',
    employee_id: 'emp-001',
    employee_name: 'Alex Morgan',
    title: 'W-4 Tax Withholding Certificate',
    category: 'Payroll',
    file_size: '640 KB',
    file_type: 'PDF',
    url: '#',
    uploaded_at: '2024-01-10',
    status: 'verified'
  },
  {
    id: 'doc-004',
    employee_id: 'emp-001',
    employee_name: 'Alex Morgan',
    title: 'Health Insurance Policy Coverage 2026',
    category: 'Other',
    file_size: '3.1 MB',
    file_type: 'PDF',
    url: '#',
    uploaded_at: '2026-01-02',
    status: 'verified'
  }
];

// Initial Notifications
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    user_id: 'emp-001',
    title: 'Leave Approved',
    message: 'Your time-off request for July 28 - Aug 01 was approved by Sarah Jenkins.',
    type: 'leave_approved',
    is_read: false,
    created_at: '2026-08-20T10:15:00Z',
    link: '/leave'
  },
  {
    id: 'notif-002',
    user_id: 'emp-001',
    title: 'August Payroll Processing',
    message: 'Your compensation breakdown for August 2026 has been generated and scheduled for payout.',
    type: 'payroll_ready',
    is_read: false,
    created_at: '2026-08-19T08:30:00Z',
    link: '/payroll'
  },
  {
    id: 'notif-003',
    user_id: 'emp-001',
    title: 'Attendance Reminder',
    message: 'Dont forget to log your daily wrap-up note before checking out today.',
    type: 'attendance_alert',
    is_read: true,
    created_at: '2026-08-18T17:00:00Z',
    link: '/attendance'
  },
  {
    id: 'notif-004',
    user_id: 'admin-001',
    title: 'New Leave Request',
    message: 'Marcus Vance submitted a Paid Leave request for 4 days starting Aug 26.',
    type: 'leave_submitted',
    is_read: false,
    created_at: '2026-08-20T14:32:00Z',
    link: '/leave/requests'
  },
  {
    id: 'notif-005',
    user_id: 'admin-001',
    title: 'New Leave Request',
    message: 'Jordan Lee submitted a Paid Leave request for 4 days starting Sep 02.',
    type: 'leave_submitted',
    is_read: false,
    created_at: '2026-08-21T09:15:00Z',
    link: '/leave/requests'
  }
];

// Initial Activities
const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-001',
    user_id: 'emp-001',
    user_name: 'Alex Morgan',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    action: 'Checked in for workday',
    details: '08:57 AM • Hybrid Office Mode',
    timestamp: '2026-08-21T08:57:00Z',
    type: 'check_in'
  },
  {
    id: 'act-002',
    user_id: 'emp-002',
    user_name: 'Marcus Vance',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    action: 'Submitted Leave Request',
    details: 'Paid Leave • 4 days (Aug 26 - Aug 29)',
    timestamp: '2026-08-20T14:32:00Z',
    type: 'leave_submitted'
  },
  {
    id: 'act-003',
    user_id: 'admin-001',
    user_name: 'Sarah Jenkins',
    user_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    action: 'Approved Sick Leave',
    details: 'Priya Sharma • 2 days',
    timestamp: '2026-08-20T08:45:00Z',
    type: 'leave_approved'
  },
  {
    id: 'act-004',
    user_id: 'emp-001',
    user_name: 'Alex Morgan',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    action: 'Updated Profile Phone & Address',
    details: 'Direct employee self-service',
    timestamp: '2026-08-19T11:20:00Z',
    type: 'profile_updated'
  }
];

// Storage Engine
const memoryCache: Record<string, string> = {};

function getStored<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const item = window.localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item);
    }
    const memItem = memoryCache[key];
    if (!memItem) return fallback;
    return JSON.parse(memItem);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    memoryCache[key] = serialized;
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem(key, serialized);
    }
  } catch (e) {
    // Silent fail in non-browser or sandbox environments
  }
}

// Data Store Class for reactive subscription & persistence
class DataStore {
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // Users
  getUsers(): User[] {
    return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  getCurrentUser(): User {
    const users = this.getUsers();
    const storedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedId) {
      const match = users.find((u) => u.id === storedId);
      if (match) return match;
    }
    return users[0]; // Default Alex Morgan
  }

  setCurrentUser(userId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
    this.notify();
  }

  updateUser(id: string, updates: Partial<User>): User {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      setStored(STORAGE_KEYS.USERS, users);
      this.notify();
      return users[idx];
    }
    throw new Error('User not found');
  }

  createUser(user: User): User {
    const users = this.getUsers();
    users.push(user);
    setStored(STORAGE_KEYS.USERS, users);
    this.notify();
    return user;
  }

  // Attendance
  getAttendance(): AttendanceRecord[] {
    return getStored<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, generateInitialAttendance());
  }

  getTodayAttendance(employeeId: string): AttendanceRecord | undefined {
    const todayStr = getFormattedDate(0);
    const list = this.getAttendance();
    return list.find((a) => a.employee_id === employeeId && a.date === todayStr);
  }

  checkIn(employeeId: string, workMode: 'office' | 'remote' | 'hybrid' = 'office'): AttendanceRecord {
    const todayStr = getFormattedDate(0);
    const list = this.getAttendance();
    const existing = list.find((a) => a.employee_id === employeeId && a.date === todayStr);
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:mm:ss

    let updatedRecord: AttendanceRecord;

    if (existing) {
      existing.check_in = timeStr;
      existing.status = 'present';
      existing.work_mode = workMode;
      updatedRecord = existing;
    } else {
      updatedRecord = {
        id: `att-${employeeId}-${Date.now()}`,
        employee_id: employeeId,
        date: todayStr,
        check_in: timeStr,
        check_out: null,
        duration_minutes: 0,
        status: 'present',
        work_mode: workMode
      };
      list.unshift(updatedRecord);
    }

    setStored(STORAGE_KEYS.ATTENDANCE, list);

    // Add activity
    const user = this.getUserById(employeeId);
    if (user) {
      this.addActivity({
        id: `act-${Date.now()}`,
        user_id: user.id,
        user_name: user.full_name,
        user_avatar: user.avatar_url,
        action: 'Checked in for workday',
        details: `${timeStr.slice(0, 5)} • ${workMode.toUpperCase()}`,
        timestamp: new Date().toISOString(),
        type: 'check_in'
      });
    }

    this.notify();
    return updatedRecord;
  }

  checkOut(employeeId: string): AttendanceRecord {
    const todayStr = getFormattedDate(0);
    const list = this.getAttendance();
    const record = list.find((a) => a.employee_id === employeeId && a.date === todayStr);

    if (!record || !record.check_in) {
      throw new Error('You must check in first before checking out.');
    }

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    record.check_out = timeStr;

    // Calculate duration
    const [inH, inM] = record.check_in.split(':').map(Number);
    const [outH, outM] = timeStr.split(':').map(Number);
    const diff = (outH * 60 + outM) - (inH * 60 + inM);
    record.duration_minutes = Math.max(diff, 1);

    setStored(STORAGE_KEYS.ATTENDANCE, list);

    // Add activity
    const user = this.getUserById(employeeId);
    if (user) {
      this.addActivity({
        id: `act-${Date.now()}`,
        user_id: user.id,
        user_name: user.full_name,
        user_avatar: user.avatar_url,
        action: 'Checked out of workday',
        details: `${timeStr.slice(0, 5)} • Total ${Math.floor(record.duration_minutes / 60)}h ${record.duration_minutes % 60}m`,
        timestamp: new Date().toISOString(),
        type: 'check_out'
      });
    }

    this.notify();
    return record;
  }

  // Leave Management
  getLeaveBalances(employeeId: string): LeaveBalance {
    const all = getStored<Record<string, LeaveBalance>>(STORAGE_KEYS.LEAVE_BALANCES, INITIAL_LEAVE_BALANCES);
    if (all[employeeId]) return all[employeeId];
    return {
      employee_id: employeeId,
      paid: { total: 20, used: 0, remaining: 20 },
      sick: { total: 10, used: 0, remaining: 10 },
      unpaid: { total: 10, used: 0, remaining: 10 }
    };
  }

  cancelLeaveRequest(requestId: string): void {
    const list = this.getLeaveRequests();
    const updated = list.filter((r) => r.id !== requestId);
    setStored(STORAGE_KEYS.LEAVES, updated);
    this.notify();
  }

  getLeaveRequests(): LeaveRequest[] {
    return getStored<LeaveRequest[]>(STORAGE_KEYS.LEAVES, INITIAL_LEAVE_REQUESTS);
  }

  submitLeaveRequest(req: Omit<LeaveRequest, 'id' | 'status' | 'submitted_at'>): LeaveRequest {
    const list = this.getLeaveRequests();
    const newRequest: LeaveRequest = {
      ...req,
      id: `lr-${Date.now()}`,
      status: 'pending',
      submitted_at: new Date().toISOString()
    };
    list.unshift(newRequest);
    setStored(STORAGE_KEYS.LEAVES, list);

    // Create notification for HR
    this.addNotification({
      id: `notif-${Date.now()}`,
      user_id: 'admin-001',
      title: 'New Leave Request Submitted',
      message: `${newRequest.employee_name} submitted a ${newRequest.leave_type} leave request for ${newRequest.days} day(s).`,
      type: 'leave_submitted',
      is_read: false,
      created_at: new Date().toISOString(),
      link: '/leave/requests'
    });

    // Add activity
    this.addActivity({
      id: `act-${Date.now()}`,
      user_id: newRequest.employee_id,
      user_name: newRequest.employee_name,
      user_avatar: newRequest.employee_avatar,
      action: 'Submitted Leave Request',
      details: `${newRequest.leave_type.toUpperCase()} • ${newRequest.days} days (${newRequest.start_date})`,
      timestamp: new Date().toISOString(),
      type: 'leave_submitted'
    });

    this.notify();
    return newRequest;
  }

  reviewLeaveRequest(requestId: string, status: 'approved' | 'rejected', reviewerName: string, reviewerComment?: string): LeaveRequest {
    const list = this.getLeaveRequests();
    const req = list.find((r) => r.id === requestId);
    if (!req) throw new Error('Leave request not found');

    req.status = status;
    req.reviewed_at = new Date().toISOString();
    req.reviewer_name = reviewerName;
    req.reviewer_comment = reviewerComment;

    setStored(STORAGE_KEYS.LEAVES, list);

    // Update leave balances if approved
    if (status === 'approved') {
      const balances = getStored<Record<string, LeaveBalance>>(STORAGE_KEYS.LEAVE_BALANCES, INITIAL_LEAVE_BALANCES);
      const userBal = balances[req.employee_id] || {
        employee_id: req.employee_id,
        paid: { total: 20, used: 0, remaining: 20 },
        sick: { total: 10, used: 0, remaining: 10 },
        unpaid: { total: 10, used: 0, remaining: 10 }
      };

      const key = req.leave_type === 'sick' ? 'sick' : req.leave_type === 'unpaid' ? 'unpaid' : 'paid';
      userBal[key].used += req.days;
      userBal[key].remaining = Math.max(0, userBal[key].total - userBal[key].used);
      balances[req.employee_id] = userBal;
      setStored(STORAGE_KEYS.LEAVE_BALANCES, balances);
    }

    // Notify employee
    this.addNotification({
      id: `notif-${Date.now()}`,
      user_id: req.employee_id,
      title: status === 'approved' ? 'Leave Request Approved' : 'Leave Request Declined',
      message: `Your ${req.leave_type} leave request for ${req.days} days was ${status} by ${reviewerName}.${reviewerComment ? ` Comment: "${reviewerComment}"` : ''}`,
      type: status === 'approved' ? 'leave_approved' : 'leave_rejected',
      is_read: false,
      created_at: new Date().toISOString(),
      link: '/leave'
    });

    // Add activity
    this.addActivity({
      id: `act-${Date.now()}`,
      user_id: req.employee_id,
      user_name: req.employee_name,
      user_avatar: req.employee_avatar,
      action: status === 'approved' ? 'Leave Approved' : 'Leave Declined',
      details: `${req.employee_name} • ${req.days} days • Reviewed by ${reviewerName}`,
      timestamp: new Date().toISOString(),
      type: status === 'approved' ? 'leave_approved' : 'leave_rejected'
    });

    this.notify();
    return req;
  }

  // Payroll
  getPayrolls(): PayrollRecord[] {
    const records = getStored<PayrollRecord[]>(STORAGE_KEYS.PAYROLLS, INITIAL_PAYROLLS);
    return records.map((p) => ({
      ...p,
      currency: !p.currency || p.currency === 'USD' ? 'INR' : p.currency
    }));
  }

  getEmployeePayroll(employeeId: string): PayrollRecord | undefined {
    return this.getPayrolls().find((p) => p.employee_id === employeeId);
  }

  updatePayroll(payrollId: string, updates: Partial<PayrollRecord>): PayrollRecord {
    const list = this.getPayrolls();
    const idx = list.findIndex((p) => p.id === payrollId);
    if (idx >= 0) {
      // Recalculate net salary if base/allowances/deductions changed
      const current = list[idx];
      const base = updates.base_salary !== undefined ? updates.base_salary : current.base_salary;
      const allowances = updates.allowances || current.allowances;
      const deductions = updates.deductions || current.deductions;

      const totalAllowances = Object.values(allowances).reduce((a, b) => a + b, 0);
      const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
      const net = base + totalAllowances - totalDeductions;

      list[idx] = {
        ...current,
        ...updates,
        base_salary: base,
        allowances,
        deductions,
        net_salary: net,
        last_updated: new Date().toISOString().split('T')[0]
      };

      setStored(STORAGE_KEYS.PAYROLLS, list);

      // Notify employee
      this.addNotification({
        id: `notif-${Date.now()}`,
        user_id: current.employee_id,
        title: 'Compensation Updated',
        message: `Your compensation package for ${current.pay_period} was adjusted by HR Operations.`,
        type: 'payroll_ready',
        is_read: false,
        created_at: new Date().toISOString(),
        link: '/payroll'
      });

      this.notify();
      return list[idx];
    }
    throw new Error('Payroll record not found');
  }

  // Documents
  getDocuments(employeeId?: string): DocumentItem[] {
    const list = getStored<DocumentItem[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    if (employeeId) {
      return list.filter((d) => d.employee_id === employeeId);
    }
    return list;
  }

  deleteDocument(documentId: string): void {
    const list = this.getDocuments();
    const updated = list.filter((d) => d.id !== documentId);
    setStored(STORAGE_KEYS.DOCUMENTS, updated);
    this.notify();
  }

  uploadDocument(doc: Omit<DocumentItem, 'id' | 'uploaded_at'>): DocumentItem {
    const list = this.getDocuments();
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploaded_at: new Date().toISOString().split('T')[0]
    };
    list.unshift(newDoc);
    setStored(STORAGE_KEYS.DOCUMENTS, list);

    this.addActivity({
      id: `act-${Date.now()}`,
      user_id: doc.employee_id,
      user_name: doc.employee_name || 'Employee',
      action: 'Uploaded Document',
      details: `${newDoc.title} (${newDoc.category})`,
      timestamp: new Date().toISOString(),
      type: 'document_uploaded'
    });

    this.notify();
    return newDoc;
  }

  // Notifications
  getNotifications(userId: string): NotificationItem[] {
    const list = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return list.filter((n) => n.user_id === userId || n.user_id === 'all');
  }

  addNotification(notif: NotificationItem): void {
    const list = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    list.unshift(notif);
    setStored(STORAGE_KEYS.NOTIFICATIONS, list);
    this.notify();
  }

  markNotificationAsRead(id: string): void {
    const list = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const item = list.find((n) => n.id === id);
    if (item) {
      item.is_read = true;
      setStored(STORAGE_KEYS.NOTIFICATIONS, list);
      this.notify();
    }
  }

  markAllNotificationsAsRead(userId: string): void {
    const list = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    list.forEach((n) => {
      if (n.user_id === userId || n.user_id === 'all') {
        n.is_read = true;
      }
    });
    setStored(STORAGE_KEYS.NOTIFICATIONS, list);
    this.notify();
  }

  // Activities
  getActivities(): ActivityItem[] {
    return getStored<ActivityItem[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  }

  addActivity(act: ActivityItem): void {
    const list = this.getActivities();
    list.unshift(act);
    setStored(STORAGE_KEYS.ACTIVITIES, list.slice(0, 50)); // Keep recent 50
    this.notify();
  }

  // Analytics & Aggregates
  getHRMetrics(): HRMetrics {
    const users = this.getUsers().filter((u) => u.status === 'active');
    const totalEmployees = users.length || 6;
    const todayStr = getFormattedDate(0);
    const todayAttendance = this.getAttendance().filter((a) => a.date === todayStr);
    const presentToday = todayAttendance.filter((a) => a.status === 'present' || a.status === 'half_day' || a.status === 'late').length || 5;
    const pendingLeaves = this.getLeaveRequests().filter((l) => l.status === 'pending');

    const onLeaveToday = this.getLeaveRequests().filter((l) => {
      if (l.status !== 'approved') return false;
      return l.start_date <= todayStr && l.end_date >= todayStr;
    }).length;

    const attendanceRate = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 96;
    const workforceAvailability = totalEmployees > 0 ? Math.max(0, Math.round(((totalEmployees - onLeaveToday) / totalEmployees) * 100)) : 92;

    return {
      total_employees: totalEmployees,
      present_today: presentToday,
      on_leave_today: onLeaveToday,
      pending_approvals: pendingLeaves.length,
      attendance_rate: attendanceRate > 0 ? attendanceRate : 96,
      workforce_availability: workforceAvailability > 0 ? workforceAvailability : 92,
      average_working_hours: 8.2,
      leave_utilization_rate: 68
    };
  }

  getActionCenterItems(): ActionCenterItem[] {
    const pendingLeaves = this.getLeaveRequests().filter((l) => l.status === 'pending');
    const todayStr = getFormattedDate(0);
    const todayAttendance = this.getAttendance().filter((a) => a.date === todayStr);
    const anomalies = todayAttendance.filter((a) => a.status === 'late' || a.status === 'half_day' || !a.check_out);
    const pendingPayroll = this.getPayrolls().filter((p) => p.status === 'pending' || p.status === 'processing');

    const items: ActionCenterItem[] = [];

    if (pendingLeaves.length > 0) {
      items.push({
        id: 'action-leaves',
        icon: 'Calendar',
        title: 'Pending Time-Off Approvals',
        description: `${pendingLeaves.length} leave request${pendingLeaves.length > 1 ? 's require' : ' requires'} management review & sign-off`,
        count: pendingLeaves.length,
        urgency: 'high',
        actionType: 'leave_requests',
        link: '/leaves'
      });
    }

    items.push({
      id: 'action-attendance',
      icon: 'Clock',
      title: 'Attendance Exceptions & Late Arrivals',
      description: `${anomalies.length || 1} employee${anomalies.length > 1 ? 's have' : ' has'} pending shift closures or late timestamps`,
      count: anomalies.length || 1,
      urgency: anomalies.length > 2 ? 'high' : 'medium',
      actionType: 'attendance_anomalies',
      link: '/attendance'
    });

    items.push({
      id: 'action-payroll',
      icon: 'DollarSign',
      title: 'Payroll Disbursement Cycle',
      description: `${pendingPayroll.length || 2} employee salary disbursement packages queued for cycle processing`,
      count: pendingPayroll.length || 2,
      urgency: 'medium',
      actionType: 'payroll_runs',
      link: '/payroll'
    });

    return items;
  }
}

export const store = new DataStore();
