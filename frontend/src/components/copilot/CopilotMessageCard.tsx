import React, { useState } from 'react';
import { CopilotMessage, CopilotPendingAction } from '../../types/copilot.types';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

interface CopilotMessageCardProps {
  message: CopilotMessage;
  onNavigate: (route: string) => void;
  onExecuteAction: (action: CopilotPendingAction, comment?: string) => Promise<void>;
  onSendQuery: (query: string) => void;
  isExecutingAction?: boolean;
}

export const CopilotMessageCard: React.FC<CopilotMessageCardProps> = ({
  message,
  onNavigate,
  onExecuteAction,
  onSendQuery,
  isExecutingAction = false
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  // User Message Rendering
  if (message.sender === 'user') {
    return (
      <div className="flex justify-end my-3">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm text-white font-medium shadow-md shadow-blue-900/20 border border-blue-400/20 leading-relaxed">
          {message.text}
        </div>
      </div>
    );
  }

  // Assistant Message Rendering
  return (
    <div className="flex flex-col my-3.5 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Bot Header Identifier */}
      <div className="flex items-center gap-2 px-1">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-cyan-500/20">
          <Sparkles className="w-3 h-3" />
        </div>
        <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-400">
          Dayflow Copilot
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Main Content Box */}
      <div className="rounded-2xl bg-[#0e172a]/90 backdrop-blur-md border border-slate-700/80 p-4 shadow-xl space-y-3.5 text-slate-200">
        {/* Title if available */}
        {message.title && (
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>{message.title}</span>
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified DB</span>
            </div>
          </div>
        )}

        {/* Text / Summary */}
        {message.summary && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {message.summary}
          </p>
        )}

        {/* Metric Badges Grid */}
        {message.metrics && message.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {message.metrics.map((metric, idx) => {
              let badgeColor = 'bg-slate-800/80 border-slate-700 text-white';
              let valColor = 'text-cyan-300';
              if (metric.color === 'success') {
                badgeColor = 'bg-emerald-950/40 border-emerald-800/50';
                valColor = 'text-emerald-400';
              } else if (metric.color === 'danger') {
                badgeColor = 'bg-rose-950/40 border-rose-800/50';
                valColor = 'text-rose-400';
              } else if (metric.color === 'warning') {
                badgeColor = 'bg-amber-950/40 border-amber-800/50';
                valColor = 'text-amber-400';
              } else if (metric.color === 'info') {
                badgeColor = 'bg-sky-950/40 border-sky-800/50';
                valColor = 'text-sky-400';
              }

              return (
                <div 
                  key={idx} 
                  className={`rounded-xl border p-2.5 flex flex-col justify-between ${badgeColor}`}
                >
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                    {metric.label}
                  </span>
                  <span className={`text-base sm:text-lg font-black tracking-tight mt-1 ${valColor}`}>
                    {metric.value}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Items List (e.g. absent list, pending leaves, employee list) */}
        {message.items && message.items.length > 0 && (
          <div className="space-y-2 pt-1 max-h-60 overflow-y-auto pr-1">
            {message.items.map((item, idx) => (
              <div 
                key={idx}
                className="rounded-xl bg-[#090f1d] border border-slate-800/90 p-3 hover:border-slate-700 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                {/* Employee / Item avatar and info */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {item.avatar ? (
                    <img 
                      src={item.avatar} 
                      alt={item.name} 
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-500/40 shrink-0" 
                    />
                  ) : item.name ? (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">
                      {item.name.charAt(0)}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-cyan-400 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white truncate">{item.name || item.title}</span>
                      {item.status && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          item.statusColor === 'sky' ? 'bg-sky-950 text-sky-300 border border-sky-800/60' :
                          item.statusColor === 'amber' ? 'bg-amber-950 text-amber-300 border border-amber-800/60' :
                          item.statusColor === 'rose' ? 'bg-rose-950 text-rose-300 border border-rose-800/60' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.role ? `${item.role} • ${item.department}` : item.department || item.dates || item.details || item.issue}
                    </p>

                    {item.reason && (
                      <p className="text-[10px] text-slate-300 mt-1 italic line-clamp-1 bg-slate-900/60 px-2 py-1 rounded border border-slate-800/50">
                        "{item.reason}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right quick button if action available */}
                {item.requestId && (
                  <button
                    type="button"
                    onClick={() => onSendQuery(`Approve leave request for ${item.name}`)}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white text-[11px] font-semibold border border-blue-500/30 transition-all shrink-0 flex items-center gap-1"
                  >
                    <span>Approve</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                {item.employeeId && (
                  <button
                    type="button"
                    onClick={() => onNavigate(`/employees/${item.employeeId}`)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition-all shrink-0 flex items-center gap-1"
                  >
                    <span>Profile</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Employee Detailed Profile Card */}
        {message.responseType === 'employee_profile' && message.items?.[0] && (
          <div className="rounded-xl bg-[#090f1d] border border-slate-800 p-3.5 space-y-2.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-400">Email:</span>
                <span className="text-white font-medium">{message.items[0].email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-400">Phone:</span>
                <span className="text-white font-medium">{message.items[0].phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-400">Manager:</span>
                <span className="text-white font-medium">{message.items[0].manager}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-400">Net Salary:</span>
                <span className="text-white font-medium">{message.items[0].salary}</span>
              </div>
            </div>
            {message.items[0].emergencyContact !== 'N/A' && (
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Emergency Contact:</span> {message.items[0].emergencyContact}
              </div>
            )}
          </div>
        )}

        {/* Sensitive Action Confirmation Card */}
        {message.pendingAction && !message.isActionExecuted && (
          <div className={`rounded-xl border p-4 space-y-3 ${
            message.pendingAction.danger 
              ? 'bg-rose-950/30 border-rose-800/60' 
              : 'bg-blue-950/40 border-blue-700/60'
          }`}>
            <div className="flex items-start gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                message.pendingAction.danger ? 'bg-rose-900/60 text-rose-300' : 'bg-blue-900/60 text-blue-300'
              }`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-white tracking-wide">
                  {message.pendingAction.title}
                </h5>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {message.pendingAction.description}
                </p>
              </div>
            </div>

            {/* Structured Details Matrix */}
            <div className="rounded-lg bg-[#080d1a] border border-slate-800 p-3 grid grid-cols-2 gap-2 text-xs">
              {Object.entries(message.pendingAction.details).map(([key, val]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider">
                    {key}
                  </span>
                  <span className="text-xs font-medium text-white mt-0.5 truncate">
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>

            {/* Optional Comment Input for rejection/approval */}
            <input
              type="text"
              placeholder={message.pendingAction.danger ? "Reason for rejection (optional)..." : "Approval remarks (optional)..."}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />

            {/* Confirmation Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => onSendQuery("Cancel that action")}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                disabled={isExecutingAction}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  setIsConfirming(true);
                  if (message.pendingAction) {
                    await onExecuteAction(message.pendingAction, rejectionReason);
                  }
                  setIsConfirming(false);
                }}
                disabled={isExecutingAction || isConfirming}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg transition-all flex items-center gap-1.5 ${
                  message.pendingAction.danger
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-blue-900/30'
                }`}
              >
                {isConfirming || isExecutingAction ? (
                  <span className="inline-block animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                ) : message.pendingAction.danger ? (
                  <XCircle className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>{message.pendingAction.danger ? 'Confirm Rejection' : 'Confirm Approval'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Result Badge */}
        {message.responseType === 'action_result' && (
          <div className={`rounded-xl border p-3.5 flex items-center gap-3 ${
            message.actionExecutionStatus === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
          }`}>
            {message.actionExecutionStatus === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-white block">
                {message.actionExecutionMessage || (message.actionExecutionStatus === 'success' ? 'Action Completed' : 'Action Failed')}
              </span>
              <span className="text-[11px] opacity-80 mt-0.5 block">
                Audit logged to system security history.
              </span>
            </div>
          </div>
        )}

        {/* Quick Action Navigation Pills */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
            {message.actions.map((act, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (act.route) {
                    onNavigate(act.route);
                  } else if (act.actionId) {
                    if (act.actionId === 'briefing') onSendQuery("Give me today's HR briefing");
                    else if (act.actionId === 'attendance') onSendQuery("Who is absent today?");
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                  act.primary
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-900/30'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80'
                }`}
              >
                {act.icon === 'calendar' && <Calendar className="w-3.5 h-3.5" />}
                {act.icon === 'clock' && <Clock className="w-3.5 h-3.5" />}
                {act.icon === 'user' && <UserIcon className="w-3.5 h-3.5" />}
                {act.icon === 'dollar' && <DollarSign className="w-3.5 h-3.5" />}
                {act.icon === 'sparkles' && <Sparkles className="w-3.5 h-3.5" />}
                <span>{act.label}</span>
                <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
