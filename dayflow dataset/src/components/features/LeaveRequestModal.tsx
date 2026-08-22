import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { LeaveType } from '../../types';
import { leaveService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getFormattedDate } from '../../services/store';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [leaveType, setLeaveType] = useState<LeaveType>('paid');
  const [startDate, setStartDate] = useState<string>(getFormattedDate(1));
  const [endDate, setEndDate] = useState<string>(getFormattedDate(2));
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [calculatedDays, setCalculatedDays] = useState<number>(2);

  // Recalculate days when start/end dates change
  useEffect(() => {
    if (!startDate || !endDate) {
      setCalculatedDays(1);
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      setCalculatedDays(0);
      return;
    }
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setCalculatedDays(diffDays);
  }, [startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (calculatedDays <= 0) {
      error('Invalid Date Range', 'End date must be on or after start date.');
      return;
    }
    if (!reason.trim()) {
      error('Reason Required', 'Please provide a brief justification for your leave request.');
      return;
    }

    setIsSubmitting(true);
    try {
      await leaveService.submitRequest({
        employee_id: user.id,
        employee_name: user.full_name,
        employee_avatar: user.avatar_url,
        department: user.department,
        job_title: user.job_title,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        days: calculatedDays,
        reason: reason.trim(),
      });

      success('Leave request submitted', `Your request for ${calculatedDays} day(s) has been sent to HR.`);
      setReason('');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit leave request';
      error('Submission Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Time Off"
      description="Plan your time away without the paperwork."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Leave Type"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value as LeaveType)}
          required
        >
          <option value="paid">Paid Annual Leave</option>
          <option value="sick">Sick / Medical Leave</option>
          <option value="casual">Casual Leave</option>
          <option value="unpaid">Unpaid Time Off</option>
          <option value="maternity">Parental / Family Leave</option>
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            type="date"
            label="End Date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        {/* Calculated Days Summary */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Total Duration:</span>
          <span className="font-mono font-bold text-slate-900 text-sm">
            {calculatedDays} {calculatedDays === 1 ? 'Day' : 'Days'}
          </span>
        </div>

        <Textarea
          label="Reason for Leave"
          placeholder="e.g., Attending family event, medical appointment, vacation..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          rows={3}
        />

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
