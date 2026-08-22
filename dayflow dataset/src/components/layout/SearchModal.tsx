import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, Calendar, IndianRupee, BarChart3, Clock, ArrowRight, X } from 'lucide-react';
import { store } from '../../services/store';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const users = store.getUsers();
  const filteredUsers = query.trim()
    ? users.filter(
        (u) =>
          u.full_name.toLowerCase().includes(query.toLowerCase()) ||
          u.department.toLowerCase().includes(query.toLowerCase()) ||
          u.employee_id.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const defaultActions = [
    { label: 'Workday Attendance & Check In', icon: <Clock className="w-4 h-4 text-emerald-500" />, route: '/attendance' },
    { label: 'Apply for Time Off / Leave', icon: <Calendar className="w-4 h-4 text-indigo-500" />, route: '/leave' },
    { label: 'My Compensation & Payslip', icon: <IndianRupee className="w-4 h-4 text-amber-500" />, route: '/payroll' },
    { label: 'Employee Directory', icon: <Users className="w-4 h-4 text-sky-500" />, route: '/employees' },
    { label: 'HR Analytics & Reports', icon: <BarChart3 className="w-4 h-4 text-purple-500" />, route: '/reports' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-100">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search employees, commands, pages (e.g. Alex, Leave, Payroll)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              ESC
            </kbd>
          </div>

          {/* Results list */}
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-50">
            {query.trim() && (
              <div className="py-2">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  People ({filteredUsers.length})
                </div>
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No workforce members found matching "{query}"
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        onNavigate(`/employees/${u.id}`);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt={u.full_name} className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                            {u.full_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-slate-900">{u.full_name}</div>
                          <div className="text-[11px] text-slate-500">{u.job_title} • {u.department}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {u.employee_id}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="py-2">
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Navigation & Shortcuts
              </div>
              {defaultActions.map((action) => (
                <button
                  key={action.route}
                  type="button"
                  onClick={() => {
                    onNavigate(action.route);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-slate-100">{action.icon}</div>
                    <span className="text-xs font-medium text-slate-800">{action.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
