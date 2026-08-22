import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { leaveService } from '../../services/api';
import { LeaveBalance, LeaveRequest } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LeaveRequestModal } from '../../components/features/LeaveRequestModal';
import { formatDate } from '../../lib/utils';
import { Calendar, Plus, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const LeavePage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  const loadLeaveData = async () => {
    if (!user) return;
    try {
      const [bal, reqs] = await Promise.all([
        leaveService.getBalance(user.id),
        leaveService.getMyRequests(user.id)
      ]);
      setBalance(bal);
      setRequests(reqs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadLeaveData();
  }, [user]);

  const handleCancel = async (requestId: string) => {
    setIsCancelling(requestId);
    try {
      await leaveService.cancelRequest(requestId);
      success('Request Cancelled', 'Your pending leave request was withdrawn.');
      loadLeaveData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to cancel request';
      error('Error', message);
    } finally {
      setIsCancelling(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success" size="sm" dot>Approved</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm" dot>Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="danger" size="sm">Rejected</Badge>;
      case 'cancelled':
        return <Badge variant="neutral" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-sky-400 uppercase">
              Time Off Management
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-xs text-slate-400 font-medium">Auto-Calculated</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Leave & Time Off
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Plan your time away without the paperwork. Review balances and check approvals in real-time.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Apply for Time Off
        </Button>
      </div>

      {/* 3 Primary Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Paid Annual Leave */}
        <Card className="p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Paid Annual Leave</span>
            <span className="p-2 rounded-lg bg-blue-950/80 border border-blue-500/30 text-sky-400">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white font-mono">
              {balance?.paid.remaining ?? 14} <span className="text-sm font-sans font-medium text-slate-400">Days Left</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-sky-400 h-full rounded-full"
                style={{ width: `${((balance?.paid.remaining ?? 14) / (balance?.paid.total ?? 20)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400 mt-2 font-medium">
              <span>{balance?.paid.used ?? 6} days used</span>
              <span>{balance?.paid.total ?? 20} days total</span>
            </div>
          </div>
        </Card>

        {/* Sick / Medical Leave */}
        <Card className="p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Sick & Medical</span>
            <span className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white font-mono">
              {balance?.sick.remaining ?? 8} <span className="text-sm font-sans font-medium text-slate-400">Days Left</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                style={{ width: `${((balance?.sick.remaining ?? 8) / (balance?.sick.total ?? 10)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400 mt-2 font-medium">
              <span>{balance?.sick.used ?? 2} days used</span>
              <span>{balance?.sick.total ?? 10} days total</span>
            </div>
          </div>
        </Card>

        {/* Unpaid / Extended */}
        <Card className="p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Unpaid / Extended</span>
            <span className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white font-mono">
              {balance?.unpaid.used ?? 0} <span className="text-sm font-sans font-medium text-slate-400">Days Taken</span>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Requires managerial pre-authorization. Zero quota deduction.
            </p>
            <div className="flex justify-between items-center text-xs text-slate-400 mt-2 font-medium">
              <span>Flexible allowance</span>
              <span>Subject to approval</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Leave Requests History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <CardTitle>My Leave Requests History</CardTitle>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {requests.length} Requests on record
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080e1c] border-y border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Leave Type</th>
                  <th className="py-3 px-4 sm:px-6">Duration</th>
                  <th className="py-3 px-4 sm:px-6">Dates</th>
                  <th className="py-3 px-4 sm:px-6">Reason / Notes</th>
                  <th className="py-3 px-4 sm:px-6">Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No leave requests submitted yet. Click "Apply for Time Off" above.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-white uppercase">
                        {req.leave_type} Leave
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-sky-400">
                        {req.days} {req.days === 1 ? 'Day' : 'Days'}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-slate-300">
                        {formatDate(req.start_date)} – {formatDate(req.end_date)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-slate-300 max-w-xs truncate">
                        <span title={req.reason}>{req.reason}</span>
                        {req.reviewer_note && (
                          <span className="block text-[11px] text-sky-300 italic mt-0.5">
                            HR Note: {req.reviewer_note}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        {req.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 text-[11px]"
                            onClick={() => handleCancel(req.id)}
                            isLoading={isCancelling === req.id}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Apply Leave Modal */}
      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadLeaveData}
      />
    </div>
  );
};
