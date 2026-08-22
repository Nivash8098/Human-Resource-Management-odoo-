-- ==============================================================================
-- DAYFLOW HRMS - REFERENCE & INITIAL SEED DATA
-- ==============================================================================

-- 1. Departments Reference Data
INSERT INTO public.departments (id, name, code, description)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Engineering', 'ENG', 'Software Engineering, Infrastructure, and Systems Architecture'),
  ('10000000-0000-0000-0000-000000000002', 'Product Design', 'DES', 'User Experience, UI Engineering, and Visual Brand Design'),
  ('10000000-0000-0000-0000-000000000003', 'People Operations', 'HR', 'Talent Acquisition, Employee Experience, and Human Resources'),
  ('10000000-0000-0000-0000-000000000004', 'Finance & Ops', 'FIN', 'Corporate Finance, Accounting, Compliance, and Payroll'),
  ('10000000-0000-0000-0000-000000000005', 'Marketing & Growth', 'MKT', 'Product Marketing, Brand Growth, and Strategic Partnerships'),
  ('10000000-0000-0000-0000-000000000006', 'Customer Success', 'CS', 'Client Solutions, Account Management, and Technical Support')
ON CONFLICT (code) DO NOTHING;

-- 2. Leave Types Reference Data
INSERT INTO public.leave_types (id, code, name, description, default_days, is_paid)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'paid', 'Paid Annual Vacation', 'Standard accrued paid time off for rest and personal activities.', 20.0, TRUE),
  ('20000000-0000-0000-0000-000000000002', 'sick', 'Sick & Medical Leave', 'Dedicated paid allowance for illness, medical appointments, and recovery.', 10.0, TRUE),
  ('20000000-0000-0000-0000-000000000003', 'unpaid', 'Unpaid Leave of Absence', 'Extended leave without salary continuation for sabbatical or emergencies.', 10.0, FALSE),
  ('20000000-0000-0000-0000-000000000004', 'casual', 'Casual Leave', 'Short-notice leave for urgent personal matters.', 5.0, TRUE),
  ('20000000-0000-0000-0000-000000000005', 'maternity', 'Parental / Maternity Leave', 'Parental leave support for new parents and family expansion.', 90.0, TRUE)
ON CONFLICT (code) DO NOTHING;

-- 3. Seed Profiles
INSERT INTO public.profiles (id, email, full_name, employee_id, role, avatar_url, department, job_title, phone, address, joining_date, status, work_mode, manager_name)
VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    'sarah.jenkins@dayflow.io',
    'Sarah Jenkins',
    'DF-1001',
    'hr_admin',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'People Operations',
    'VP of People Operations',
    '+1 (555) 234-5678',
    '742 Evergreen Terrace, San Francisco, CA',
    '2022-03-15',
    'active',
    'hybrid',
    'CEO'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'alex.morgan@dayflow.io',
    'Alex Morgan',
    'DF-1042',
    'employee',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'Engineering',
    'Senior Frontend Engineer',
    '+1 (555) 876-5432',
    '1204 Market Street, Apt 4B, San Francisco, CA',
    '2023-01-10',
    'active',
    'remote',
    'Sarah Jenkins'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'marcus.chen@dayflow.io',
    'Marcus Chen',
    'DF-1088',
    'employee',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'Product Design',
    'Staff Product Designer',
    '+1 (555) 345-6789',
    '55 2nd Street, San Francisco, CA',
    '2022-08-01',
    'active',
    'hybrid',
    'Sarah Jenkins'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'elena.rostova@dayflow.io',
    'Elena Rostova',
    'DF-1095',
    'employee',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'Engineering',
    'Backend Platform Lead',
    '+1 (555) 456-7890',
    '880 Harrison St, San Francisco, CA',
    '2023-04-18',
    'active',
    'office',
    'Sarah Jenkins'
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'david.kim@dayflow.io',
    'David Kim',
    'DF-1120',
    'employee',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'Finance & Ops',
    'Financial Analyst',
    '+1 (555) 567-8901',
    '310 Townsend St, San Francisco, CA',
    '2023-09-05',
    'active',
    'office',
    'Sarah Jenkins'
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Employees Table
INSERT INTO public.employees (id, user_id, employee_id, full_name, email, phone, address, profile_picture, department_id, job_title, employment_type, joining_date, work_mode, employment_status)
VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'DF-1001',
    'Sarah Jenkins',
    'sarah.jenkins@dayflow.io',
    '+1 (555) 234-5678',
    '742 Evergreen Terrace, San Francisco, CA',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    '10000000-0000-0000-0000-000000000003',
    'VP of People Operations',
    'Full-time',
    '2022-03-15',
    'hybrid',
    'active'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'DF-1042',
    'Alex Morgan',
    'alex.morgan@dayflow.io',
    '+1 (555) 876-5432',
    '1204 Market Street, Apt 4B, San Francisco, CA',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    '10000000-0000-0000-0000-000000000001',
    'Senior Frontend Engineer',
    'Full-time',
    '2023-01-10',
    'remote',
    'active'
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'DF-1088',
    'Marcus Chen',
    'marcus.chen@dayflow.io',
    '+1 (555) 345-6789',
    '55 2nd Street, San Francisco, CA',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    '10000000-0000-0000-0000-000000000002',
    'Staff Product Designer',
    'Full-time',
    '2022-08-01',
    'hybrid',
    'active'
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000004',
    'DF-1095',
    'Elena Rostova',
    'elena.rostova@dayflow.io',
    '+1 (555) 456-7890',
    '880 Harrison St, San Francisco, CA',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    '10000000-0000-0000-0000-000000000001',
    'Backend Platform Lead',
    'Full-time',
    '2023-04-18',
    'office',
    'active'
  ),
  (
    '30000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000005',
    'DF-1120',
    'David Kim',
    'david.kim@dayflow.io',
    '+1 (555) 567-8901',
    '310 Townsend St, San Francisco, CA',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    '10000000-0000-0000-0000-000000000004',
    'Financial Analyst',
    'Full-time',
    '2023-09-05',
    'office',
    'active'
  )
ON CONFLICT (employee_id) DO NOTHING;

-- 5. Seed Leave Balances
INSERT INTO public.leave_balances (employee_id, leave_type, allocated_days, total_days, used_days, remaining_days, year)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'paid', 20.0, 20.0, 2.0, 18.0, 2026),
  ('00000000-0000-0000-0000-000000000001', 'sick', 10.0, 10.0, 0.0, 10.0, 2026),
  ('00000000-0000-0000-0000-000000000001', 'unpaid', 10.0, 10.0, 0.0, 10.0, 2026),
  ('00000000-0000-0000-0000-000000000002', 'paid', 20.0, 20.0, 4.0, 16.0, 2026),
  ('00000000-0000-0000-0000-000000000002', 'sick', 10.0, 10.0, 1.0, 9.0, 2026),
  ('00000000-0000-0000-0000-000000000002', 'unpaid', 10.0, 10.0, 0.0, 10.0, 2026),
  ('00000000-0000-0000-0000-000000000003', 'paid', 20.0, 20.0, 6.0, 14.0, 2026),
  ('00000000-0000-0000-0000-000000000003', 'sick', 10.0, 10.0, 0.0, 10.0, 2026),
  ('00000000-0000-0000-0000-000000000003', 'unpaid', 10.0, 10.0, 0.0, 10.0, 2026),
  ('00000000-0000-0000-0000-000000000004', 'paid', 20.0, 20.0, 3.0, 17.0, 2026),
  ('00000000-0000-0000-0000-000000000004', 'sick', 10.0, 10.0, 2.0, 8.0, 2026),
  ('00000000-0000-0000-0000-000000000004', 'unpaid', 10.0, 10.0, 0.0, 10.0, 2026),
  ('00000000-0000-0000-0000-000000000005', 'paid', 20.0, 20.0, 1.0, 19.0, 2026),
  ('00000000-0000-0000-0000-000000000005', 'sick', 10.0, 10.0, 0.0, 10.0, 2026),
  ('00000000-0000-0000-0000-000000000005', 'unpaid', 10.0, 10.0, 0.0, 10.0, 2026)
ON CONFLICT (employee_id, leave_type, year) DO NOTHING;

-- 6. Seed Payroll Records
INSERT INTO public.payroll (id, employee_id, employee_name, job_title, department, base_salary, allowances, deductions, net_salary, currency, pay_period, payment_date, status, payment_method)
VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000002',
    'Alex Morgan',
    'Senior Frontend Engineer',
    'Engineering',
    85000.00,
    '{"housing": 12000, "transport": 4500, "medical": 3000, "performance": 8000}'::jsonb,
    '{"tax": 14200, "provident_fund": 7200, "health_insurance": 2100}'::jsonb,
    89000.00,
    'INR',
    'August 2026',
    '2026-08-31',
    'processing',
    'HDFC Direct Deposit (***4812)'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000003',
    'Marcus Chen',
    'Staff Product Designer',
    'Product Design',
    92000.00,
    '{"housing": 14000, "transport": 4500, "medical": 3000, "performance": 6500}'::jsonb,
    '{"tax": 16500, "provident_fund": 8100, "health_insurance": 2100}'::jsonb,
    93300.00,
    'INR',
    'August 2026',
    '2026-08-31',
    'processing',
    'ICICI Bank Wire (***9910)'
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000004',
    'Elena Rostova',
    'Backend Platform Lead',
    'Engineering',
    98000.00,
    '{"housing": 15000, "transport": 4500, "medical": 3000, "performance": 9500}'::jsonb,
    '{"tax": 18200, "provident_fund": 8800, "health_insurance": 2100}'::jsonb,
    99900.00,
    'INR',
    'August 2026',
    '2026-08-31',
    'processing',
    'Standard Chartered Direct (***3342)'
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    '00000000-0000-0000-0000-000000000005',
    'David Kim',
    'Financial Analyst',
    'Finance & Ops',
    72000.00,
    '{"housing": 10000, "transport": 4000, "medical": 3000, "performance": 5000}'::jsonb,
    '{"tax": 11500, "provident_fund": 6200, "health_insurance": 2100}'::jsonb,
    74200.00,
    'INR',
    'August 2026',
    '2026-08-31',
    'processing',
    'Axis Bank Deposit (***1124)'
  )
ON CONFLICT (id) DO NOTHING;
