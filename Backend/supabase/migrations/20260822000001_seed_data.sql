-- ==============================================================================
-- DAYFLOW HRMS - SEED DATA SCRIPT
-- ==============================================================================

-- 1. Initial Employee & HR Profiles
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

-- 2. Leave Balances
INSERT INTO public.leave_balances (employee_id, leave_type, total_days, used_days, remaining_days, year)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'paid', 20.0, 4.0, 16.0, 2026),
  ('00000000-0000-0000-0000-000000000002', 'sick', 10.0, 1.0, 9.0, 2026),
  ('00000000-0000-0000-0000-000000000002', 'unpaid', 10.0, 0.0, 10.0, 2026),
  ('00000000-0000-0000-0000-000000000003', 'paid', 20.0, 6.0, 14.0, 2026),
  ('00000000-0000-0000-0000-000000000003', 'sick', 10.0, 0.0, 10.0, 2026),
  ('00000000-0000-0000-0000-000000000003', 'unpaid', 10.0, 0.0, 10.0, 2026)
ON CONFLICT DO NOTHING;

-- 3. Payroll Records
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
  )
ON CONFLICT (id) DO NOTHING;
