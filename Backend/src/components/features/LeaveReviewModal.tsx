import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { LeaveRequest } from '../../types';
import { leaveService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../lib/utils';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface LeaveReviewModalProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
  request,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [comment, setComment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);

  if (!request) return null;

  const handleReview = async (action: 'approved' | 'rejected') => {
    if (!user) return;
    if (action === 'rejected' && !comment.trim()) {
      error('Comment Required', 'Please provide a reason or note when rejecting a leave request.');
      return;
    }

    setIsProcessing(true);
    setDecision(action);
    try {
      await leaveService.reviewRequest(
        request.id,
        action,
        user.full_name,
        comment.trim() || (action === 'approved' ? 'Approved by HR Operations.' : undefined)
      );

      if (action === 'approved') {
        success('Leave request approved', `Notification sent to ${request.employee_name}.`);
      } else {
        success('Leave request rejected', `Decision communicated to ${request.employee_name}.`);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Review action failed';
      error('Review Error', message);
    } finally {
      setIsProcessing(false);
      setDecision(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Time-Off Request"
      description={`Submitted by ${request.employee_name}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Request Summary Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {request.employee_avatar ? (
                <img
                  src={request.employee_avatar}
                  alt={request.employee_name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  {request.employee_name.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-slate-900">{request.employee_name}</h4>
                <p className="text-xs text-slate-500">{request.job_title} • {request.department}</p>
              </div>
            </div>
            <Badge variant="warning" size="sm">
              {request.status.toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
            <div>
              <span className="text-slate-500">Leave Type:</span>
              <span className="font-semibold text-slate-800 ml-1.5 uppercase">{request.leave_type}</span>
            </div>
            <div>
              <span className="text-slate-500">Duration:</span>
              <span className="font-semibold text-slate-800 ml-1.5 font-mono">{request.days} Days</span>
            </div>
            <div className="col-span-2 flex items-center gap-1 text-slate-700 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(request.start_date)} – {formatDate(request.end_date)}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">Reason Provided:</span>
            <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200/60">
              "{request.reason}"
            </p>
          </div>
        </div>

        {/* Reviewer Comment Note */}
        <Textarea
          label="Review Note / Comments"
          placeholder="Add comments for the employee (required if rejecting)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="danger"
              isLoading={isProcessing && decision === 'rejected'}
              disabled={isProcessing}
              onClick={() => handleReview('rejected')}
              leftIcon={<XCircle className="w-4 h-4" />}
            >
              Reject
            </Button>
            <Button
              type="button"
              variant="success"
              isLoading={isProcessing && decision === 'approved'}
              disabled={isProcessing}
              onClick={() => handleReview('approved')}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Approve
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
