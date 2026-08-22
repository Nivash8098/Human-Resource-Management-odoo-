/**
 * Dayflow PostgreSQL / Supabase Database Type Definitions
 * Auto-aligned with Database Migrations (20260822000000_dayflow_schema.sql)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PayrollAllowances {
  housing: number;
  transport: number;
  medical: number;
  performance: number;
}

export interface PayrollDeductions {
  tax: number;
  provident_fund: number;
  health_insurance: number;
}

export interface Database {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          employee_id: string;
          role: 'employee' | 'hr_admin' | 'admin';
          avatar_url: string | null;
          department: string;
          job_title: string;
          phone: string | null;
          address: string | null;
          joining_date: string;
          status: 'active' | 'inactive' | 'on_leave';
          work_mode: 'office' | 'remote' | 'hybrid';
          manager_name: string | null;
          emergency_contact: EmergencyContact | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          employee_id: string;
          role?: 'employee' | 'hr_admin' | 'admin';
          avatar_url?: string | null;
          department?: string;
          job_title?: string;
          phone?: string | null;
          address?: string | null;
          joining_date?: string;
          status?: 'active' | 'inactive' | 'on_leave';
          work_mode?: 'office' | 'remote' | 'hybrid';
          manager_name?: string | null;
          emergency_contact?: EmergencyContact | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          employee_id?: string;
          role?: 'employee' | 'hr_admin' | 'admin';
          avatar_url?: string | null;
          department?: string;
          job_title?: string;
          phone?: string | null;
          address?: string | null;
          joining_date?: string;
          status?: 'active' | 'inactive' | 'on_leave';
          work_mode?: 'office' | 'remote' | 'hybrid';
          manager_name?: string | null;
          emergency_contact?: EmergencyContact | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      employees: {
        Row: {
          id: string;
          user_id: string | null;
          employee_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          address: string | null;
          profile_picture: string | null;
          department_id: string | null;
          job_title: string;
          employment_type: string;
          joining_date: string;
          work_mode: 'office' | 'remote' | 'hybrid';
          employment_status: 'active' | 'inactive' | 'on_leave';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          employee_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          address?: string | null;
          profile_picture?: string | null;
          department_id?: string | null;
          job_title?: string;
          employment_type?: string;
          joining_date?: string;
          work_mode?: 'office' | 'remote' | 'hybrid';
          employment_status?: 'active' | 'inactive' | 'on_leave';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          employee_id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          address?: string | null;
          profile_picture?: string | null;
          department_id?: string | null;
          job_title?: string;
          employment_type?: string;
          joining_date?: string;
          work_mode?: 'office' | 'remote' | 'hybrid';
          employment_status?: 'active' | 'inactive' | 'on_leave';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "departments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "employees_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      leave_types: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          default_days: number;
          is_paid: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          default_days?: number;
          is_paid?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          default_days?: number;
          is_paid?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      attendance: {
        Row: {
          id: string;
          employee_id: string;
          attendance_date: string;
          date: string;
          check_in: string | null;
          check_out: string | null;
          working_minutes: number;
          duration_minutes: number;
          status: 'present' | 'absent' | 'late' | 'half_day' | 'holiday' | 'leave' | 'not_checked_in';
          work_mode: 'office' | 'remote' | 'hybrid';
          remarks: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          attendance_date?: string;
          date?: string;
          check_in?: string | null;
          check_out?: string | null;
          working_minutes?: number;
          duration_minutes?: number;
          status?: 'present' | 'absent' | 'late' | 'half_day' | 'holiday' | 'leave' | 'not_checked_in';
          work_mode?: 'office' | 'remote' | 'hybrid';
          remarks?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          attendance_date?: string;
          date?: string;
          check_in?: string | null;
          check_out?: string | null;
          working_minutes?: number;
          duration_minutes?: number;
          status?: 'present' | 'absent' | 'late' | 'half_day' | 'holiday' | 'leave' | 'not_checked_in';
          work_mode?: 'office' | 'remote' | 'hybrid';
          remarks?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      leave_balances: {
        Row: {
          id: string;
          employee_id: string;
          leave_type: string;
          year: number;
          allocated_days: number;
          total_days: number;
          used_days: number;
          remaining_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          leave_type: string;
          year?: number;
          allocated_days?: number;
          total_days?: number;
          used_days?: number;
          remaining_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          leave_type?: string;
          year?: number;
          allocated_days?: number;
          total_days?: number;
          used_days?: number;
          remaining_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leave_balances_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      leave_requests: {
        Row: {
          id: string;
          employee_id: string;
          employee_name: string;
          employee_avatar: string | null;
          department: string;
          job_title: string;
          leave_type: string;
          start_date: string;
          end_date: string;
          total_days: number;
          days: number;
          reason: string;
          remarks: string | null;
          status: 'pending' | 'approved' | 'rejected' | 'cancelled';
          reviewer_id: string | null;
          reviewer_name: string | null;
          reviewer_comment: string | null;
          review_comment: string | null;
          submitted_at: string;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          employee_name: string;
          employee_avatar?: string | null;
          department?: string;
          job_title?: string;
          leave_type: string;
          start_date: string;
          end_date: string;
          total_days?: number;
          days?: number;
          reason: string;
          remarks?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
          reviewer_id?: string | null;
          reviewer_name?: string | null;
          reviewer_comment?: string | null;
          review_comment?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          employee_name?: string;
          employee_avatar?: string | null;
          department?: string;
          job_title?: string;
          leave_type?: string;
          start_date?: string;
          end_date?: string;
          total_days?: number;
          days?: number;
          reason?: string;
          remarks?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
          reviewer_id?: string | null;
          reviewer_name?: string | null;
          reviewer_comment?: string | null;
          review_comment?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      payroll: {
        Row: {
          id: string;
          employee_id: string;
          employee_name: string;
          employee_avatar: string | null;
          job_title: string;
          department: string;
          pay_period_start: string | null;
          pay_period_end: string | null;
          pay_period: string;
          base_salary: number;
          allowances: PayrollAllowances;
          deductions: PayrollDeductions;
          net_salary: number;
          currency: string;
          effective_date: string;
          payment_date: string;
          status: 'paid' | 'pending' | 'processing';
          payment_method: string;
          last_updated: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          employee_name: string;
          employee_avatar?: string | null;
          job_title: string;
          department: string;
          pay_period_start?: string | null;
          pay_period_end?: string | null;
          pay_period: string;
          base_salary?: number;
          allowances?: PayrollAllowances;
          deductions?: PayrollDeductions;
          net_salary?: number;
          currency?: string;
          effective_date?: string;
          payment_date?: string;
          status?: 'paid' | 'pending' | 'processing';
          payment_method?: string;
          last_updated?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          employee_name?: string;
          employee_avatar?: string | null;
          job_title?: string;
          department?: string;
          pay_period_start?: string | null;
          pay_period_end?: string | null;
          pay_period?: string;
          base_salary?: number;
          allowances?: PayrollAllowances;
          deductions?: PayrollDeductions;
          net_salary?: number;
          currency?: string;
          effective_date?: string;
          payment_date?: string;
          status?: 'paid' | 'pending' | 'processing';
          payment_method?: string;
          last_updated?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payroll_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      documents: {
        Row: {
          id: string;
          employee_id: string;
          employee_name: string | null;
          name: string | null;
          title: string;
          document_type: string | null;
          category: 'Identity' | 'Employment' | 'Payroll' | 'Other';
          storage_path: string | null;
          mime_type: string | null;
          file_type: string;
          file_size: string;
          uploaded_by: string | null;
          url: string;
          status: 'verified' | 'pending' | 'rejected' | 'pending_verification' | 'expired';
          uploaded_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          employee_name?: string | null;
          name?: string | null;
          title: string;
          document_type?: string | null;
          category?: 'Identity' | 'Employment' | 'Payroll' | 'Other';
          storage_path?: string | null;
          mime_type?: string | null;
          file_type?: string;
          file_size?: string;
          uploaded_by?: string | null;
          url?: string;
          status?: 'verified' | 'pending' | 'rejected' | 'pending_verification' | 'expired';
          uploaded_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          employee_name?: string | null;
          name?: string | null;
          title?: string;
          document_type?: string | null;
          category?: 'Identity' | 'Employment' | 'Payroll' | 'Other';
          storage_path?: string | null;
          mime_type?: string | null;
          file_type?: string;
          file_size?: string;
          uploaded_by?: string | null;
          url?: string;
          status?: 'verified' | 'pending' | 'rejected' | 'pending_verification' | 'expired';
          uploaded_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          id: string;
          employee_id: string | null;
          user_id: string;
          title: string;
          message: string;
          type: string;
          is_read: boolean;
          read_at: string | null;
          link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id?: string | null;
          user_id: string;
          title: string;
          message: string;
          type: string;
          is_read?: boolean;
          read_at?: string | null;
          link?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string | null;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          is_read?: boolean;
          read_at?: string | null;
          link?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          employee_id: string | null;
          user_id: string | null;
          actor_user_id: string | null;
          user_name: string;
          user_avatar: string | null;
          action: string;
          description: string | null;
          details: string;
          type: string;
          timestamp: string;
          created_at: string;
          metadata: Json;
        };
        Insert: {
          id?: string;
          employee_id?: string | null;
          user_id?: string | null;
          actor_user_id?: string | null;
          user_name: string;
          user_avatar?: string | null;
          action: string;
          description?: string | null;
          details: string;
          type: string;
          timestamp?: string;
          created_at?: string;
          metadata?: Json;
        };
        Update: {
          id?: string;
          employee_id?: string | null;
          user_id?: string | null;
          actor_user_id?: string | null;
          user_name?: string;
          user_avatar?: string | null;
          action?: string;
          description?: string | null;
          details?: string;
          type?: string;
          timestamp?: string;
          created_at?: string;
          metadata?: Json;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_in_employee: {
        Args: {
          p_employee_id: string;
          p_work_mode?: string;
        };
        Returns: Json;
      };
      check_out_employee: {
        Args: {
          p_employee_id: string;
        };
        Returns: Json;
      };
      approve_leave_request: {
        Args: {
          p_request_id: string;
          p_reviewer_id?: string;
          p_reviewer_comment?: string;
        };
        Returns: Json;
      };
      reject_leave_request: {
        Args: {
          p_request_id: string;
          p_reviewer_id?: string;
          p_reviewer_comment?: string;
        };
        Returns: Json;
      };
      cancel_leave_request: {
        Args: {
          p_request_id: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
