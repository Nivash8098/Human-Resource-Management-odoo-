-- ==============================================================================
-- DAYFLOW HRMS - ENTERPRISE POSTGRESQL + SUPABASE PRODUCTION DATABASE SCHEMA
-- Compatible with Frontend Contracts & Supabase Architecture:
-- Tables:
-- 1. profiles
-- 2. employees
-- 3. departments
-- 4. attendance
-- 5. leave_types
-- 6. leave_requests
-- 7. leave_balances
-- 8. payroll
-- 9. documents
-- 10. notifications
-- 11. activities
-- ==============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. DEPARTMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 2. PROFILES TABLE (Linked to auth.users)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    employee_id TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'hr_admin', 'admin')),
    avatar_url TEXT,
    department TEXT NOT NULL DEFAULT 'Engineering',
    job_title TEXT NOT NULL DEFAULT 'Team Member',
    phone TEXT,
    address TEXT,
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    work_mode TEXT NOT NULL DEFAULT 'office' CHECK (work_mode IN ('office', 'remote', 'hybrid', 'OFFICE', 'REMOTE', 'HYBRID')),
    manager_name TEXT,
    emergency_contact JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 3. EMPLOYEES TABLE (Detailed Employee Records)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    profile_picture TEXT,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    job_title TEXT NOT NULL DEFAULT 'Team Member',
    employment_type TEXT NOT NULL DEFAULT 'Full-time',
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    work_mode TEXT NOT NULL DEFAULT 'office' CHECK (work_mode IN ('office', 'remote', 'hybrid', 'OFFICE', 'REMOTE', 'HYBRID')),
    employment_status TEXT NOT NULL DEFAULT 'active' CHECK (employment_status IN ('active', 'inactive', 'on_leave', 'ACTIVE', 'INACTIVE', 'ON_LEAVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 4. LEAVE TYPES REFERENCE TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE, -- 'paid', 'sick', 'unpaid', 'casual', 'maternity'
    name TEXT NOT NULL,
    description TEXT,
    default_days NUMERIC(4,1) NOT NULL DEFAULT 20.0,
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 5. ATTENDANCE TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in TIME,
    check_out TIME,
    working_minutes INTEGER NOT NULL DEFAULT 0,
    duration_minutes INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'half_day', 'holiday', 'leave', 'PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE')),
    work_mode TEXT NOT NULL DEFAULT 'office' CHECK (work_mode IN ('office', 'remote', 'hybrid', 'OFFICE', 'REMOTE', 'HYBRID')),
    remarks TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_employee_attendance UNIQUE (employee_id, attendance_date),
    CONSTRAINT unique_employee_workdate UNIQUE (employee_id, date)
);

-- ==========================================
-- 6. LEAVE BALANCES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    leave_type TEXT NOT NULL CHECK (leave_type IN ('paid', 'sick', 'unpaid', 'casual', 'maternity', 'PAID', 'SICK', 'UNPAID', 'CASUAL', 'MATERNITY')),
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    allocated_days NUMERIC(4,1) NOT NULL DEFAULT 20.0,
    total_days NUMERIC(4,1) NOT NULL DEFAULT 20.0,
    used_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
    remaining_days NUMERIC(4,1) NOT NULL DEFAULT 20.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_employee_leave_balance UNIQUE (employee_id, leave_type, year)
);

-- ==========================================
-- 7. LEAVE REQUESTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL,
    employee_avatar TEXT,
    department TEXT NOT NULL DEFAULT 'Engineering',
    job_title TEXT NOT NULL DEFAULT 'Team Member',
    leave_type TEXT NOT NULL CHECK (leave_type IN ('paid', 'sick', 'unpaid', 'casual', 'maternity', 'PAID', 'SICK', 'UNPAID', 'CASUAL', 'MATERNITY')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days NUMERIC(4,1) NOT NULL DEFAULT 1.0,
    days NUMERIC(4,1) NOT NULL DEFAULT 1.0,
    reason TEXT NOT NULL,
    remarks TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewer_name TEXT,
    reviewer_comment TEXT,
    review_comment TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_date_order CHECK (end_date >= start_date)
);

-- ==========================================
-- 8. PAYROLL TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    pay_period_start DATE,
    pay_period_end DATE,
    pay_period TEXT NOT NULL, -- e.g. "August 2026"
    base_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    allowances JSONB NOT NULL DEFAULT '{"housing":0,"transport":0,"medical":0,"performance":0}'::jsonb,
    deductions JSONB NOT NULL DEFAULT '{"tax":0,"provident_fund":0,"health_insurance":0}'::jsonb,
    net_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('paid', 'pending', 'processing', 'PAID', 'PENDING', 'PROCESSING')),
    payment_method TEXT NOT NULL DEFAULT 'Direct Bank Deposit',
    last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 9. DOCUMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_name TEXT,
    name TEXT,
    title TEXT NOT NULL,
    document_type TEXT,
    category TEXT NOT NULL DEFAULT 'Employment' CHECK (category IN ('Identity', 'Employment', 'Payroll', 'Other')),
    storage_path TEXT,
    mime_type TEXT DEFAULT 'application/pdf',
    file_type TEXT NOT NULL DEFAULT 'PDF',
    file_size TEXT NOT NULL DEFAULT '1.2 MB',
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    url TEXT NOT NULL DEFAULT '#',
    status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('verified', 'pending', 'rejected', 'pending_verification', 'expired')),
    uploaded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 10. NOTIFICATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- UUID string or 'all'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 11. ACTIVITIES / AUDIT LOG TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    action TEXT NOT NULL,
    description TEXT,
    details TEXT NOT NULL,
    type TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ==========================================
-- PERFORMANCE INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_departments_code ON public.departments(code);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_employee_id ON public.profiles(employee_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON public.employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_dept ON public.employees(department_id);
CREATE INDEX IF NOT EXISTS idx_attendance_emp_date ON public.attendance(employee_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_leave_balances_emp ON public.leave_balances(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_emp ON public.leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_dates ON public.leave_requests(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON public.payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_period ON public.payroll(pay_period);
CREATE INDEX IF NOT EXISTS idx_documents_employee_id ON public.documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON public.activities(timestamp DESC);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Security helper function
CREATE OR REPLACE FUNCTION public.is_hr_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('hr_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 1. Departments Policies
CREATE POLICY "Public Departments Read" ON public.departments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "HR Admins Manage Departments" ON public.departments
  FOR ALL USING (public.is_hr_or_admin());

-- 2. Profiles Policies
CREATE POLICY "Public Profiles Read" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "HR Admins Full Manage Profiles" ON public.profiles
  FOR ALL USING (public.is_hr_or_admin());

CREATE POLICY "Employees Update Self Profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Employees Policies
CREATE POLICY "Public Employees Read" ON public.employees
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "HR Admins Full Manage Employees" ON public.employees
  FOR ALL USING (public.is_hr_or_admin());

CREATE POLICY "Employees Update Self Record" ON public.employees
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Leave Types Policies
CREATE POLICY "Public Leave Types Read" ON public.leave_types
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "HR Admins Manage Leave Types" ON public.leave_types
  FOR ALL USING (public.is_hr_or_admin());

-- 5. Attendance Policies
CREATE POLICY "Employees Read Own Attendance" ON public.attendance
  FOR SELECT USING (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "Employees Insert Own Attendance" ON public.attendance
  FOR INSERT WITH CHECK (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "Employees Update Own Attendance" ON public.attendance
  FOR UPDATE USING (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "HR Admins Delete Attendance" ON public.attendance
  FOR DELETE USING (public.is_hr_or_admin());

-- 6. Leave Balances Policies
CREATE POLICY "Employees Read Own Leave Balances" ON public.leave_balances
  FOR SELECT USING (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "HR Admins Manage Leave Balances" ON public.leave_balances
  FOR ALL USING (public.is_hr_or_admin());

-- 7. Leave Requests Policies
CREATE POLICY "Employees Read Own Leave Requests" ON public.leave_requests
  FOR SELECT USING (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "Employees Insert Own Leave Requests" ON public.leave_requests
  FOR INSERT WITH CHECK (auth.uid() = employee_id);

CREATE POLICY "Employees Cancel Own Pending Leave" ON public.leave_requests
  FOR UPDATE USING (auth.uid() = employee_id AND status = 'pending');

CREATE POLICY "Employees Delete Own Pending Leave" ON public.leave_requests
  FOR DELETE USING (auth.uid() = employee_id AND status = 'pending');

CREATE POLICY "HR Admins Manage All Leave Requests" ON public.leave_requests
  FOR ALL USING (public.is_hr_or_admin());

-- 8. Payroll Policies (Strict Employee Isolation)
CREATE POLICY "Employees Read Own Payroll" ON public.payroll
  FOR SELECT USING (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "HR Admins Manage All Payroll" ON public.payroll
  FOR ALL USING (public.is_hr_or_admin());

-- 9. Documents Policies
CREATE POLICY "Employees Read Own Documents" ON public.documents
  FOR SELECT USING (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "Employees Upload Own Documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "Employees Delete Own Documents" ON public.documents
  FOR DELETE USING (auth.uid() = employee_id OR public.is_hr_or_admin());

CREATE POLICY "HR Admins Manage All Documents" ON public.documents
  FOR ALL USING (public.is_hr_or_admin());

-- 10. Notifications Policies
CREATE POLICY "Users Read Own Notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid()::text OR employee_id = auth.uid() OR user_id = 'all' OR public.is_hr_or_admin());

CREATE POLICY "Users Insert Notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users Update Own Notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid()::text OR employee_id = auth.uid() OR user_id = 'all' OR public.is_hr_or_admin());

CREATE POLICY "Users Delete Own Notifications" ON public.notifications
  FOR DELETE USING (user_id = auth.uid()::text OR employee_id = auth.uid() OR public.is_hr_or_admin());

-- 11. Activities Policies
CREATE POLICY "Users Read Activities" ON public.activities
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Insert Activities" ON public.activities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ==========================================
-- SUPABASE STORAGE BUCKETS & STORAGE POLICIES
-- ==========================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('employee-documents', 'employee-documents', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Storage RLS Policies for employee-documents (Private)
CREATE POLICY "Employee Documents Access" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'employee-documents' AND (
      (storage.foldername(name))[1] = auth.uid()::text 
      OR public.is_hr_or_admin()
    )
  );

CREATE POLICY "Employee Documents Upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'employee-documents' AND (
      (storage.foldername(name))[1] = auth.uid()::text 
      OR public.is_hr_or_admin()
    )
  );

CREATE POLICY "Employee Documents Delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'employee-documents' AND (
      (storage.foldername(name))[1] = auth.uid()::text 
      OR public.is_hr_or_admin()
    )
  );

-- Storage RLS Policies for avatars (Public Read, Authenticated Upload)
CREATE POLICY "Avatars Public Read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Avatars Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Avatars Owner Update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- ==========================================
-- AUTOMATIC DATABASE TRIGGERS & SECURITY GUARDS
-- ==========================================

-- 1. Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_departments_modtime BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_employees_modtime BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_attendance_modtime BEFORE UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_leave_requests_modtime BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_leave_balances_modtime BEFORE UPDATE ON public.leave_balances FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_payroll_modtime BEFORE UPDATE ON public.payroll FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_documents_modtime BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Synchronize column alias triggers (date/attendance_date, days/total_days, working_minutes/duration_minutes)
CREATE OR REPLACE FUNCTION public.sync_attendance_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.attendance_date IS NOT NULL AND NEW.date IS NULL THEN
    NEW.date = NEW.attendance_date;
  ELSIF NEW.date IS NOT NULL AND NEW.attendance_date IS NULL THEN
    NEW.attendance_date = NEW.date;
  END IF;

  IF NEW.working_minutes != 0 AND NEW.duration_minutes = 0 THEN
    NEW.duration_minutes = NEW.working_minutes;
  ELSIF NEW.duration_minutes != 0 AND NEW.working_minutes = 0 THEN
    NEW.working_minutes = NEW.duration_minutes;
  END IF;

  IF NEW.remarks IS NOT NULL AND NEW.notes IS NULL THEN
    NEW.notes = NEW.remarks;
  ELSIF NEW.notes IS NOT NULL AND NEW.remarks IS NULL THEN
    NEW.remarks = NEW.notes;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_attendance_fields_trigger
  BEFORE INSERT OR UPDATE ON public.attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_attendance_fields();

CREATE OR REPLACE FUNCTION public.sync_leave_request_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_days != 0 AND NEW.days = 0 THEN
    NEW.days = NEW.total_days;
  ELSIF NEW.days != 0 AND NEW.total_days = 0 THEN
    NEW.total_days = NEW.days;
  END IF;

  IF NEW.remarks IS NOT NULL AND NEW.reason IS NULL THEN
    NEW.reason = NEW.remarks;
  ELSIF NEW.reason IS NOT NULL AND NEW.remarks IS NULL THEN
    NEW.remarks = NEW.reason;
  END IF;

  IF NEW.review_comment IS NOT NULL AND NEW.reviewer_comment IS NULL THEN
    NEW.reviewer_comment = NEW.review_comment;
  ELSIF NEW.reviewer_comment IS NOT NULL AND NEW.review_comment IS NULL THEN
    NEW.review_comment = NEW.reviewer_comment;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_leave_request_fields_trigger
  BEFORE INSERT OR UPDATE ON public.leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_leave_request_fields();

-- 3. Automatic Net Salary Calculation Trigger
CREATE OR REPLACE FUNCTION public.calculate_net_salary()
RETURNS TRIGGER AS $$
DECLARE
  v_allowances NUMERIC := 0;
  v_deductions NUMERIC := 0;
BEGIN
  -- Sum allowances from JSONB
  IF NEW.allowances IS NOT NULL THEN
    SELECT COALESCE(SUM(value::text::numeric), 0)
    INTO v_allowances
    FROM jsonb_each_text(NEW.allowances);
  END IF;

  -- Sum deductions from JSONB
  IF NEW.deductions IS NOT NULL THEN
    SELECT COALESCE(SUM(value::text::numeric), 0)
    INTO v_deductions
    FROM jsonb_each_text(NEW.deductions);
  END IF;

  NEW.net_salary = NEW.base_salary + v_allowances - v_deductions;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_payroll_net_salary_trigger
  BEFORE INSERT OR UPDATE ON public.payroll
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_net_salary();

-- 4. Prevent role elevation & sensitive field tampering by non-HR users
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_hr_or_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Access Denied: Only HR Administrators can change employee roles.';
    END IF;
    IF NEW.employee_id IS DISTINCT FROM OLD.employee_id THEN
      RAISE EXCEPTION 'Access Denied: Employee ID cannot be modified by standard users.';
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Access Denied: Employee employment status cannot be modified by standard users.';
    END IF;
    IF NEW.joining_date IS DISTINCT FROM OLD.joining_date THEN
      RAISE EXCEPTION 'Access Denied: Joining date cannot be modified by standard users.';
    END IF;
    IF NEW.department IS DISTINCT FROM OLD.department THEN
      RAISE EXCEPTION 'Access Denied: Department cannot be modified by standard users.';
    END IF;
    IF NEW.job_title IS DISTINCT FROM OLD.job_title THEN
      RAISE EXCEPTION 'Access Denied: Job title cannot be modified by standard users.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER protect_profile_fields_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_sensitive_fields();

-- 5. Automatic Auth Signup Trigger (links auth.users -> public.profiles & employees)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_emp_id TEXT;
  v_full_name TEXT;
  v_dept TEXT;
  v_title TEXT;
BEGIN
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  v_emp_id := COALESCE(NEW.raw_user_meta_data->>'employee_id', 'DF-' || floor(1000 + random() * 9000)::text);
  v_dept := COALESCE(NEW.raw_user_meta_data->>'department', 'Engineering');
  v_title := COALESCE(NEW.raw_user_meta_data->>'job_title', 'Software Engineer');

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    employee_id,
    role,
    department,
    job_title,
    status,
    work_mode,
    joining_date
  ) VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    v_emp_id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
    v_dept,
    v_title,
    'active',
    'office',
    CURRENT_DATE
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.employees (
    user_id,
    employee_id,
    full_name,
    email,
    job_title,
    employment_type,
    joining_date,
    work_mode,
    employment_status
  ) VALUES (
    NEW.id,
    v_emp_id,
    v_full_name,
    NEW.email,
    v_title,
    'Full-time',
    CURRENT_DATE,
    'office',
    'active'
  )
  ON CONFLICT (employee_id) DO NOTHING;

  -- Create initial leave balances for the new employee
  INSERT INTO public.leave_balances (employee_id, leave_type, allocated_days, total_days, used_days, remaining_days, year)
  VALUES 
    (NEW.id, 'paid', 20.0, 20.0, 0.0, 20.0, EXTRACT(YEAR FROM CURRENT_DATE)::integer),
    (NEW.id, 'sick', 10.0, 10.0, 0.0, 10.0, EXTRACT(YEAR FROM CURRENT_DATE)::integer),
    (NEW.id, 'unpaid', 10.0, 10.0, 0.0, 10.0, EXTRACT(YEAR FROM CURRENT_DATE)::integer)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- STORED DATABASE FUNCTIONS / PROCEDURES (ATOMIC TRANSACTIONS)
-- ==========================================

-- Function 1: Server-Side Secure Attendance Check-In
CREATE OR REPLACE FUNCTION public.check_in_employee(
    p_employee_id UUID,
    p_work_mode TEXT DEFAULT 'office'
)
RETURNS JSONB AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_today DATE := CURRENT_DATE;
  v_time TIME := CURRENT_TIME;
  v_record RECORD;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF v_caller != p_employee_id AND NOT public.is_hr_or_admin() THEN
    RAISE EXCEPTION 'Unauthorized: You can only check in for yourself.';
  END IF;

  -- Check if already checked in
  SELECT * INTO v_record FROM public.attendance
  WHERE employee_id = p_employee_id AND attendance_date = v_today;

  IF FOUND AND v_record.check_in IS NOT NULL AND v_record.check_out IS NULL THEN
    RAISE EXCEPTION 'Already checked in for today.';
  END IF;

  INSERT INTO public.attendance (
    employee_id,
    attendance_date,
    date,
    check_in,
    check_out,
    working_minutes,
    duration_minutes,
    status,
    work_mode
  ) VALUES (
    p_employee_id,
    v_today,
    v_today,
    v_time,
    NULL,
    0,
    0,
    'present',
    p_work_mode
  )
  ON CONFLICT (employee_id, attendance_date)
  DO UPDATE SET 
    check_in = v_time,
    check_out = NULL,
    status = 'present',
    work_mode = p_work_mode,
    updated_at = NOW()
  RETURNING * INTO v_record;

  -- Log Activity
  INSERT INTO public.activities (employee_id, user_id, actor_user_id, user_name, action, description, details, type)
  SELECT 
    p_employee_id, 
    p_employee_id, 
    v_caller, 
    p.full_name, 
    'Checked In', 
    format('Checked in for workday via %s', p_work_mode),
    format('Checked in (%s)', p_work_mode),
    'check_in'
  FROM public.profiles p WHERE p.id = p_employee_id;

  RETURN to_jsonb(v_record);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 2: Server-Side Secure Attendance Check-Out
CREATE OR REPLACE FUNCTION public.check_out_employee(
    p_employee_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_today DATE := CURRENT_DATE;
  v_time TIME := CURRENT_TIME;
  v_record RECORD;
  v_duration INT;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF v_caller != p_employee_id AND NOT public.is_hr_or_admin() THEN
    RAISE EXCEPTION 'Unauthorized: You can only check out for yourself.';
  END IF;

  SELECT * INTO v_record FROM public.attendance
  WHERE employee_id = p_employee_id AND attendance_date = v_today;

  IF NOT FOUND OR v_record.check_in IS NULL THEN
    RAISE EXCEPTION 'You must check in first before checking out.';
  END IF;

  IF v_record.check_out IS NOT NULL THEN
    RAISE EXCEPTION 'You have already checked out for today.';
  END IF;

  -- Compute working minutes safely on server
  v_duration := GREATEST(1, ROUND(EXTRACT(EPOCH FROM (v_time - v_record.check_in)) / 60)::integer);

  UPDATE public.attendance
  SET 
    check_out = v_time,
    working_minutes = v_duration,
    duration_minutes = v_duration,
    updated_at = NOW()
  WHERE employee_id = p_employee_id AND attendance_date = v_today
  RETURNING * INTO v_record;

  -- Log Activity
  INSERT INTO public.activities (employee_id, user_id, actor_user_id, user_name, action, description, details, type)
  SELECT 
    p_employee_id, 
    p_employee_id, 
    v_caller, 
    p.full_name, 
    'Checked Out', 
    format('Completed workday duration: %s minutes', v_duration),
    format('Checked out (%s min)', v_duration),
    'check_out'
  FROM public.profiles p WHERE p.id = p_employee_id;

  RETURN to_jsonb(v_record);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 3: Atomic Leave Approval
CREATE OR REPLACE FUNCTION public.approve_leave_request(
    p_request_id UUID,
    p_reviewer_id UUID DEFAULT auth.uid(),
    p_reviewer_comment TEXT DEFAULT 'Approved by HR'
)
RETURNS JSONB AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_req RECORD;
  v_reviewer_name TEXT;
BEGIN
  IF NOT public.is_hr_or_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only HR Administrators can approve leave requests.';
  END IF;

  SELECT full_name INTO v_reviewer_name FROM public.profiles WHERE id = p_reviewer_id;

  -- 1. Update Leave Request
  UPDATE public.leave_requests
  SET 
    status = 'approved',
    reviewed_at = NOW(),
    reviewer_id = p_reviewer_id,
    reviewer_name = COALESCE(v_reviewer_name, 'HR Administrator'),
    reviewer_comment = p_reviewer_comment,
    review_comment = p_reviewer_comment,
    updated_at = NOW()
  WHERE id = p_request_id
  RETURNING * INTO v_req;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Leave request not found.';
  END IF;

  -- 2. Atomically Deduct Leave Balance
  UPDATE public.leave_balances
  SET 
    used_days = used_days + v_req.days,
    remaining_days = GREATEST(0, remaining_days - v_req.days),
    updated_at = NOW()
  WHERE employee_id = v_req.employee_id AND lower(leave_type) = lower(v_req.leave_type);

  -- 3. Create Notification
  INSERT INTO public.notifications (employee_id, user_id, title, message, type, link)
  VALUES (
    v_req.employee_id,
    v_req.employee_id::text,
    'Leave Request Approved',
    format('Your request for %s day(s) of %s leave (%s to %s) has been approved by HR.', v_req.days, v_req.leave_type, v_req.start_date, v_req.end_date),
    'leave_approved',
    '/leave'
  );

  -- 4. Create Activity Audit Log
  INSERT INTO public.activities (employee_id, user_id, actor_user_id, user_name, action, description, details, type, metadata)
  VALUES (
    v_req.employee_id,
    v_req.employee_id,
    p_reviewer_id,
    v_req.employee_name,
    'Leave Approved',
    format('%s day(s) %s leave approved by %s', v_req.days, v_req.leave_type, COALESCE(v_reviewer_name, 'HR')),
    format('%s day(s) %s leave approved', v_req.days, v_req.leave_type),
    'leave_approved',
    jsonb_build_object('request_id', p_request_id, 'reviewer', v_reviewer_name, 'days', v_req.days)
  );

  RETURN to_jsonb(v_req);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 4: Atomic Leave Rejection
CREATE OR REPLACE FUNCTION public.reject_leave_request(
    p_request_id UUID,
    p_reviewer_id UUID DEFAULT auth.uid(),
    p_reviewer_comment TEXT DEFAULT 'Declined due to operational requirements'
)
RETURNS JSONB AS $$
DECLARE
  v_req RECORD;
  v_reviewer_name TEXT;
BEGIN
  IF NOT public.is_hr_or_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only HR Administrators can reject leave requests.';
  END IF;

  SELECT full_name INTO v_reviewer_name FROM public.profiles WHERE id = p_reviewer_id;

  UPDATE public.leave_requests
  SET 
    status = 'rejected',
    reviewed_at = NOW(),
    reviewer_id = p_reviewer_id,
    reviewer_name = COALESCE(v_reviewer_name, 'HR Administrator'),
    reviewer_comment = p_reviewer_comment,
    review_comment = p_reviewer_comment,
    updated_at = NOW()
  WHERE id = p_request_id
  RETURNING * INTO v_req;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Leave request not found.';
  END IF;

  -- Create Notification
  INSERT INTO public.notifications (employee_id, user_id, title, message, type, link)
  VALUES (
    v_req.employee_id,
    v_req.employee_id::text,
    'Leave Request Declined',
    format('Your request for %s leave was declined by HR. Reason: %s', v_req.leave_type, p_reviewer_comment),
    'leave_rejected',
    '/leave'
  );

  -- Create Activity Audit Log
  INSERT INTO public.activities (employee_id, user_id, actor_user_id, user_name, action, description, details, type, metadata)
  VALUES (
    v_req.employee_id,
    v_req.employee_id,
    p_reviewer_id,
    v_req.employee_name,
    'Leave Declined',
    format('%s day(s) %s leave declined by %s. Reason: %s', v_req.days, v_req.leave_type, COALESCE(v_reviewer_name, 'HR'), p_reviewer_comment),
    format('%s day(s) %s leave declined', v_req.days, v_req.leave_type),
    'leave_rejected',
    jsonb_build_object('request_id', p_request_id, 'reviewer', v_reviewer_name, 'comment', p_reviewer_comment)
  );

  RETURN to_jsonb(v_req);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 5: Atomic Leave Cancellation
CREATE OR REPLACE FUNCTION public.cancel_leave_request(
    p_request_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_req RECORD;
BEGIN
  SELECT * INTO v_req FROM public.leave_requests WHERE id = p_request_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Leave request not found.';
  END IF;

  IF v_req.employee_id != v_caller AND NOT public.is_hr_or_admin() THEN
    RAISE EXCEPTION 'Unauthorized: You can only cancel your own leave requests.';
  END IF;

  IF v_req.status = 'cancelled' THEN
    RAISE EXCEPTION 'Leave request is already cancelled.';
  END IF;

  -- If it was previously approved, restore the leave balance
  IF v_req.status = 'approved' THEN
    UPDATE public.leave_balances
    SET 
      used_days = GREATEST(0, used_days - v_req.days),
      remaining_days = remaining_days + v_req.days,
      updated_at = NOW()
    WHERE employee_id = v_req.employee_id AND lower(leave_type) = lower(v_req.leave_type);
  END IF;

  UPDATE public.leave_requests
  SET 
    status = 'cancelled',
    updated_at = NOW()
  WHERE id = p_request_id
  RETURNING * INTO v_req;

  -- Activity Log
  INSERT INTO public.activities (employee_id, user_id, actor_user_id, user_name, action, description, details, type)
  VALUES (
    v_req.employee_id,
    v_req.employee_id,
    v_caller,
    v_req.employee_name,
    'Leave Cancelled',
    format('Cancelled %s day(s) %s leave request (%s)', v_req.days, v_req.leave_type, v_req.start_date),
    format('Cancelled %s day(s) leave', v_req.days),
    'leave_submitted'
  );

  RETURN to_jsonb(v_req);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
