import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/api';
import { LeaveRequest } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Input';
import { LeaveReviewModal } from '../../components/features/LeaveReviewModal';
import { formatDate } from '../../lib/utils';
import { Calendar, CheckCircle2, XCircle, Clock, Filter } from 'lucide-react';

export const LeaveRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const loadRequests = async () => {
    try {
      const list = await leaveService.getAllRequests();
      setRequests(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = requests.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesDept = deptFilter === 'all' || r.department === deptFilter;
    return matchesStatus && matchesDept;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success" size="sm" dot>Approved</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm" dot>Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="danger" size="sm">Rejected</Badge>;
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
            <span className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
              Operations & Approvals
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-500 font-medium">HR Triage Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Leave Requests & Approvals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review time-off requests, communicate rejection reasons, and approve annual leaves.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>{requests.filter((r) => r.status === 'pending').length} Requests Pending Review</span>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 shadow-xs border-slate-200/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Request Statuses</option>
            <option value="pending">Pending Approvals Only</option>
            <option value="approved">Approved Requests</option>
            <option value="rejected">Rejected Requests</option>
          </Select>

          <Select
            label="Filter by Department"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product Design">Product Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="People Operations">People Operations</option>
          </Select>
        </div>
      </Card>

      {/* Requests Table */}
      <Card className="shadow-xs border-slate-200/80">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <CardTitle>Time-Off Queue ({filtered.length})</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Employee</th>
                  <th className="py-3 px-4 sm:px-6">Leave Type</th>
                  <th className="py-3 px-4 sm:px-6">Duration</th>
                  <th className="py-3 px-4 sm:px-6">Dates Requested</th>
                  <th className="py-3 px-4 sm:px-6">Reason / Justification</th>
                  <th className="py-3 px-4 sm:px-6">Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No leave requests in this queue.
                    </td>
                  </tr>
                ) : (
                  filtered.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          {req.employee_avatar ? (
                            <img
                              src={req.employee_avatar}
                              alt={req.employee_name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                              {req.employee_name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 block">{req.employee_name}</span>
                            <span className="text-[11px] text-slate-400">{req.job_title} • {req.department}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-bold uppercase text-slate-800">
                        {req.leave_type} Leave
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-900">
                        {req.days} {req.days === 1 ? 'Day' : 'Days'}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-slate-700">
                        {formatDate(req.start_date)} – {formatDate(req.end_date)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-slate-600 max-w-xs truncate">
                        <span title={req.reason}>"{req.reason}"</span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        {req.status === 'pending' ? (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              setSelectedRequest(req);
                              setIsReviewOpen(true);
                            }}
                          >
                            Review & Decide
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(req);
                              setIsReviewOpen(true);
                            }}
                          >
                            Details
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

      {/* Review Modal */}
      <LeaveReviewModal
        request={selectedRequest}
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          setSelectedRequest(null);
        }}
        onSuccess={loadRequests}
      />
    </div>
  );
};
