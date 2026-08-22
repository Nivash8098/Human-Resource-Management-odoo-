# Dayflow HRMS — Production Backend Architecture & Security Specifications

This document outlines the production-ready backend architecture for the Dayflow Human Resource Management System. It details data schemas, authorization boundaries, Row Level Security (RLS) policies, and service patterns.

---

## 1. Domain Models & Database Schema

The database is built on PostgreSQL with Supabase, using foreign keys, cascading constraints, and audit timestamps.

### Database Tables Summary

1. **`profiles`**: Core user accounts and HR workforce registry.
   - `id` (UUID PK references `auth.users(id)`)
   - `email` (TEXT UNIQUE)
   - `full_name` (TEXT)
   - `employee_id` (TEXT UNIQUE, e.g. `DF-1042`)
   - `role` (`'employee' | 'hr_admin' | 'admin'`)
   - `avatar_url` (TEXT)
   - `department` (TEXT)
   - `job_title` (TEXT)
   - `phone` (TEXT)
   - `address` (TEXT)
   - `joining_date` (DATE)
   - `status` (`'active' | 'inactive' | 'on_leave'`)
   - `work_mode` (`'office' | 'remote' | 'hybrid'`)
   - `manager_name` (TEXT)
   - `emergency_contact` (JSONB)
   - `created_at`, `updated_at` (TIMESTAMPTZ)

2. **`attendance`**: Daily check-in/out records.
   - `id` (UUID PK)
   - `employee_id` (UUID references `profiles(id)`)
   - `date` (DATE)
   - `check_in` (TIME)
   - `check_out` (TIME)
   - `duration_minutes` (INTEGER)
   - `status` (`'present' | 'absent' | 'late' | 'half_day' | 'holiday'`)
   - `work_mode` (`'office' | 'remote' | 'hybrid'`)
   - `notes` (TEXT)
   - *Constraint*: `UNIQUE(employee_id, date)` prevents duplicate records for a single workday.

3. **`leave_balances`**: Annual time-off allocations.
   - `employee_id` (UUID references `profiles(id)`)
   - `leave_type` (`'paid' | 'sick' | 'unpaid' | 'casual' | 'maternity'`)
   - `total_days` (NUMERIC)
   - `used_days` (NUMERIC)
   - `remaining_days` (NUMERIC)
   - `year` (INTEGER)
   - *Constraint*: `UNIQUE(employee_id, leave_type, year)`

4. **`leave_requests`**: Time-off submissions and reviews.
   - `id` (UUID PK)
   - `employee_id` (UUID references `profiles(id)`)
   - `leave_type` (TEXT)
   - `start_date`, `end_date` (DATE)
   - `days` (NUMERIC)
   - `reason` (TEXT)
   - `status` (`'pending' | 'approved' | 'rejected' | 'cancelled'`)
   - `submitted_at`, `reviewed_at` (TIMESTAMPTZ)
   - `reviewer_name`, `reviewer_comment` (TEXT)
   - *Constraint*: `CHECK (end_date >= start_date)`

5. **`payroll`**: Compensation records with strict isolation.
   - `id` (UUID PK)
   - `employee_id` (UUID references `profiles(id)`)
   - `base_salary` (NUMERIC)
   - `allowances` (JSONB: `{ housing, transport, medical, performance }`)
   - `deductions` (JSONB: `{ tax, provident_fund, health_insurance }`)
   - `net_salary` (NUMERIC: `base + sum(allowances) - sum(deductions)`)
   - `status` (`'paid' | 'pending' | 'processing'`)
   - `payment_method` (TEXT)

6. **`documents`**: Compliance and employee files.
   - `id` (UUID PK)
   - `employee_id` (UUID references `profiles(id)`)
   - `title`, `category`, `file_size`, `file_type`, `storage_path`, `url`, `status`

7. **`notifications`**: Real-time operational alerts.
   - `user_id` (UUID or `'all'`)
   - `title`, `message`, `type`, `is_read`, `link`, `created_at`

8. **`activities`**: Audit trail and timeline logs.
   - `user_id`, `user_name`, `user_avatar`, `action`, `details`, `type`, `timestamp`, `metadata`

---

## 2. Row Level Security (RLS) & Access Control Matrix

| Table | Employee Privileges | HR / Admin Privileges |
| :--- | :--- | :--- |
| **`profiles`** | SELECT all active colleagues; UPDATE own contact info (`phone`, `address`, `avatar_url`) only. Restricted fields are protected. | SELECT, INSERT, UPDATE, DELETE on all profiles. |
| **`attendance`** | SELECT, INSERT (check-in), UPDATE (check-out) for own `auth.uid() = employee_id` only. | SELECT and UPDATE all records across organization. |
| **`leave_balances`**| SELECT own balances (`auth.uid() = employee_id`). | Full management privileges. |
| **`leave_requests`**| SELECT own requests; INSERT new requests; UPDATE (cancel) own `pending` requests. | SELECT all requests; UPDATE (`approved`/`rejected`) with automatic trigger-based balance deductions. **Self-approval is forbidden.** |
| **`payroll`** | SELECT own payroll record only (`auth.uid() = employee_id`). | Full CRUD privileges. |
| **`documents`** | SELECT, INSERT, DELETE own documents. | Full access to organization compliance vault. |
| **`notifications`**| SELECT, UPDATE (mark as read) own notifications. | Full access. |
| **`activities`** | SELECT public milestone and own activities. | SELECT all audit activity logs. |

---

## 3. Database Triggers & Automated Logic

- **`update_*_modtime`**: Automatically maintains `updated_at = NOW()` on every update.
- **`on_leave_request_reviewed`**: On status change to `'approved'`, automatically deducts days from `leave_balances`, logs an audit activity in `activities`, and dispatches an inbox notification in `notifications`. On `'rejected'`, dispatches feedback notification.

---

## 4. Testing & Verification

Run the automated backend test suite:
```bash
npm test
```

Verification covers:
- Input validation (emails, passwords, date ranges, file sizes, MIME types)
- Role elevation protection and profile field sanitization
- Attendance check-in/out and duration calculation
- Leave application, overlapping detection, and self-approval protection
- Payroll compensation math and access isolation
- Notification dispatch and activity logging
