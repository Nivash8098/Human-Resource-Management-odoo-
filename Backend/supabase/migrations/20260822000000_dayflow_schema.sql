-- ==============================================================================
-- DAYFLOW HRMS - ENTERPRISE SUPABASE / POSTGRESQL SCHEMA & SECURITY CONFIGURATION
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PROFILES TABLE (Core User Accounts)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    employee_id TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('employee', 'hr_admin', 'admin')),
    avatar_url TEXT,
    department TEXT NOT NULL,
    job_title TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    work_mode TEXT NOT NULL DEFAULT 'office' CHECK (work_mode IN ('office', 'remote', 'hybrid')),
    manager_name TEXT,
    emergency_contact JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 2. ATTENDANCE TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    duration_minutes INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'half_day', 'holiday')),
    work_mode TEXT NOT NULL DEFAULT 'office' CHECK (work_mode IN ('office', 'remote', 'hybrid')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_employee_workday UNIQUE (employee_id, date)
);

-- ==========================================
-- 3. LEAVE BALANCES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    leave_type TEXT NOT NULL CHECK (leave_type IN ('paid', 'sick', 'unpaid', 'casual', 'maternity')),
    total_days NUMERIC(4,1) NOT NULL DEFAULT 20.0,
    used_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
    remaining_days NUMERIC(4,1) NOT NULL DEFAULT 20.0,
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_employee_leave_balance UNIQUE (employee_id, leave_type, year)
);

-- ==========================================
-- 4. LEAVE REQUESTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL,
    employee_avatar TEXT,
    department TEXT NOT NULL,
    job_title TEXT NOT NULL,
    leave_type TEXT NOT NULL CHECK (leave_type IN ('paid', 'sick', 'unpaid', 'casual', 'maternity')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days NUMERIC(4,1) NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewer_name TEXT,
    reviewer_comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_date_order CHECK (end_date >= start_date)
);

-- ==========================================
-- 5. PAYROLL TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    base_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    allowances JSONB NOT NULL DEFAULT '{"housing":0,"transport":0,"medical":0,"performance":0}'::jsonb,
    deductions JSONB NOT NULL DEFAULT '{"tax":0,"provident_fund":0,"health_insurance":0}'::jsonb,
    net_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    pay_period TEXT NOT NULL,
    payment_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('paid', 'pending', 'processing')),
    payment_method TEXT NOT NULL DEFAULT 'Direct Bank Deposit',
    last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 6. DOCUMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Identity', 'Employment', 'Payroll', 'Other')),
    file_size TEXT NOT NULL DEFAULT '1.2 MB',
    file_type TEXT NOT NULL DEFAULT 'PDF',
    storage_path TEXT,
    url TEXT NOT NULL DEFAULT '#',
    status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('verified', 'pending', 'rejected')),
    uploaded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 7. NOTIFICATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- UUID string or 'all'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('attendance', 'leave', 'payroll', 'document', 'system')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 8. ACTIVITIES / AUDIT LOG TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('check_in', 'check_out', 'leave_applied', 'leave_reviewed', 'payroll_update', 'document_upload', 'announcement')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB
);

-- ==========================================
-- PERFORMANCE INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_employee_id ON public.profiles(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_emp_date ON public.attendance(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_emp ON public.leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON public.payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_documents_employee_id ON public.documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON public.activities(timestamp DESC);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS checks
CREATE OR REPLACE FUNCTION public.is_hr_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('hr_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public Profiles Read" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "HR Admins Full Manage Profiles" ON public.profiles
  FOR ALL USING (public.is_hr_or_admin());

CREATE POLICY "Employees Update Self Profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Attendance Policies
CREATE POLICY "Employees Read Own Attendance" ON public.attendance
  FOR SELECT USING (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "Employees Insert Own Attendance" ON public.attendance
  FOR INSERT WITH CHECK (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "Employees Update Own Attendance" ON public.attendance
  FOR UPDATE USING (auth.uid() = employee_id OR public.is_hr_or_admin());

-- 3. Leave Balances Policies
CREATE POLICY "Employees Read Own Leave Balances" ON public.leave_balances
  FOR SELECT USING (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "HR Admins Manage Leave Balances" ON public.leave_balances
  FOR ALL USING (public.is_hr_or_admin());

-- 4. Leave Requests Policies
CREATE POLICY "Employees Read Own Leave Requests" ON public.leave_requests
  FOR SELECT USING (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "Employees Insert Own Leave Requests" ON public.leave_requests
  FOR INSERT WITH CHECK (auth.uid() = employee_id);

CREATE POLICY "Employees Cancel Own Pending Leave" ON public.leave_requests
  FOR UPDATE USING (auth.uid() = employee_id AND status = 'pending');

CREATE POLICY "HR Admins Manage All Leave Requests" ON public.leave_requests
  FOR ALL USING (public.is_hr_or_admin());

-- 5. Payroll Policies (Strict Isolation)
CREATE POLICY "Employees Read Own Payroll" ON public.payroll
  FOR SELECT USING (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "HR Admins Manage All Payroll" ON public.payroll
  FOR ALL USING (public.is_hr_or_admin());

-- 6. Documents Policies
CREATE POLICY "Employees Read Own Documents" ON public.documents
  FOR SELECT USING (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "Employees Upload Own Documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "Employees Delete Own Documents" ON public.documents
  FOR DELETE USING (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "HR Admins Manage All Documents" ON public.documents
  FOR ALL USING (public.is_hr_or_admin());

-- 7. Notifications Policies
CREATE POLICY "Users Read Own Notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid()::text OR user_id = 'all' OR public.is_hr_or_admin());

CREATE POLICY "Users Update Own Notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid()::text OR user_id = 'all');

-- 8. Activities Policies
CREATE POLICY "Users Read Activities" ON public.activities
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Insert Activities" ON public.activities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ==========================================
-- AUTOMATIC DATABASE TRIGGERS
-- ==========================================

-- 1. Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_attendance_modtime BEFORE UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_leave_requests_modtime BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_payroll_modtime BEFORE UPDATE ON public.payroll FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_documents_modtime BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Automatic Leave Balance Deduction & Audit Trigger on Approval
CREATE OR REPLACE FUNCTION public.handle_leave_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    -- Deduct from leave_balances
    UPDATE public.leave_balances
    SET used_days = used_days + NEW.days,
        remaining_days = GREATEST(0, remaining_days - NEW.days),
        updated_at = NOW()
    WHERE employee_id = NEW.employee_id AND leave_type = NEW.leave_type;

    -- Add Notification
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      NEW.employee_id::text,
      'Leave Request Approved',
      format('Your request for %s day(s) of %s leave (%s to %s) has been approved by HR.', NEW.days, NEW.leave_type, NEW.start_date, NEW.end_date),
      'leave',
      '/leave'
    );

    -- Log Activity
    INSERT INTO public.activities (user_id, user_name, user_avatar, action, details, type)
    VALUES (
      NEW.employee_id,
      NEW.employee_name,
      NEW.employee_avatar,
      'Leave Approved',
      format('%s day(s) %s leave approved (%s)', NEW.days, NEW.leave_type, NEW.start_date),
      'leave_reviewed'
    );
  ELSIF NEW.status = 'rejected' AND (OLD.status IS DISTINCT FROM 'rejected') THEN
    -- Add Notification
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      NEW.employee_id::text,
      'Leave Request Declined',
      format('Your request for %s leave was declined by HR. Reason: %s', NEW.leave_type, COALESCE(NEW.reviewer_comment, 'Operational requirements')),
      'leave',
      '/leave'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_leave_request_reviewed
  AFTER UPDATE OF status ON public.leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_leave_approval();
