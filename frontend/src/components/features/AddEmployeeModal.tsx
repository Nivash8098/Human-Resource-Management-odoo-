import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { User, UserRole, WorkMode } from '../../types';
import { employeeService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { getFormattedDate } from '../../services/store';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [department, setDepartment] = useState<string>('Engineering');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [role, setRole] = useState<UserRole>('employee');
  const [workMode, setWorkMode] = useState<WorkMode>('hybrid');
  const [phone, setPhone] = useState<string>('+1 (555) 000-0000');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !jobTitle.trim()) {
      error('Missing Information', 'Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedId = `DF-${Math.floor(1000 + Math.random() * 9000)}`;
      const newEmp: User = {
        id: `emp-${Date.now()}`,
        email: email.trim(),
        full_name: fullName.trim(),
        employee_id: generatedId,
        role,
        avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        department,
        job_title: jobTitle.trim(),
        phone: phone.trim(),
        address: 'San Francisco, CA',
        joining_date: getFormattedDate(0),
        status: 'active',
        work_mode: workMode,
        manager_name: 'Sarah Jenkins'
      };

      await employeeService.createEmployee(newEmp);
      success('Employee Created', `${fullName} added to organization as ${generatedId}.`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create employee';
      error('Creation Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Employee"
      description="Onboard a new workforce member to Nexora HR."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="e.g. Liam Vance"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            type="email"
            label="Work Email"
            placeholder="liam.vance@dayflow.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="Engineering">Engineering</option>
            <option value="Product Design">Product Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="People Operations">People Operations</option>
          </Select>

          <Input
            label="Job Title"
            placeholder="e.g. Systems Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Access Role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="employee">Employee</option>
            <option value="hr_admin">HR / Admin</option>
          </Select>

          <Select
            label="Work Mode"
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value as WorkMode)}
          >
            <option value="office">Office</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </Select>

          <Input
            label="Phone Contact"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Onboard Member
          </Button>
        </div>
      </form>
    </Modal>
  );
};
