import React, { useState } from 'react';
import { User, UserRole, WorkMode } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { store } from '../../services/store';
import { X, Sparkles, User as UserIcon, Shield, Mail, ArrowRight, Check } from 'lucide-react';

export type DepartmentName = 'Engineering' | 'Product Design' | 'Marketing' | 'Finance' | 'People Operations' | 'Customer Success';

interface CreateDemoAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export const CreateDemoAccountModal: React.FC<CreateDemoAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { signIn } = useAuth();
  const { success, error } = useToast();

  const [fullName, setFullName] = useState('Alex Rivera');
  const [role, setRole] = useState<UserRole>('employee');
  const [department, setDepartment] = useState<DepartmentName>('Engineering');
  const [jobTitle, setJobTitle] = useState('Cloud Solutions Architect');
  const [workMode, setWorkMode] = useState<WorkMode>('hybrid');
  const [customEmail, setCustomEmail] = useState('alex.rivera@nexora.io');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreateDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !customEmail.trim()) {
      error('Required Fields', 'Please provide a name and email.');
      return;
    }

    setIsLoading(true);
    try {
      const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedEmpId = `NX-${uniqueSuffix}`;

      // Create new user in store
      const newUser: User = {
        id: `demo-user-${Date.now()}`,
        email: customEmail.toLowerCase(),
        full_name: fullName,
        employee_id: generatedEmpId,
        role: role,
        avatar_url: role === 'hr_admin' 
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        department: department,
        job_title: jobTitle || (role === 'hr_admin' ? 'People Operations Director' : 'Senior Specialist'),
        phone: '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
        address: '100 Silicon Ave, San Francisco, CA 94107',
        joining_date: new Date().toISOString().split('T')[0],
        status: 'active',
        work_mode: workMode,
        manager_name: role === 'hr_admin' ? 'Elena Rostova (Executive Board)' : 'Sarah Jenkins (Director of HR)',
        emergency_contact: {
          name: 'Jordan Rivera',
          relationship: 'Spouse',
          phone: '+1 (555) 432-8765'
        }
      };

      store.createUser(newUser);

      // Sign in as this newly created user
      await signIn(newUser.email, 'password123', role);
      success('Demo Account Ready!', `Signed in as ${fullName} (${role === 'hr_admin' ? 'HR Admin' : 'Employee'}).`);
      onSuccess(role);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not create demo account';
      error('Creation Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetSelect = (presetRole: UserRole, name: string, dept: DepartmentName, title: string, email: string) => {
    setRole(presetRole);
    setFullName(name);
    setDepartment(dept);
    setJobTitle(title);
    setCustomEmail(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0b1220] border border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-500/20 overflow-hidden relative">
        {/* Glow corner accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Create Demo Account</h3>
              <p className="text-xs text-slate-400">Generate a custom test persona with live data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="p-5 pb-2 relative z-10">
          <label className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-2">
            Quick Persona Presets
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handlePresetSelect('hr_admin', 'Sarah Jenkins', 'People Operations', 'Director of People & Talent', 'sarah.jenkins@nexora.io')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                role === 'hr_admin'
                  ? 'bg-blue-900/40 border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> HR Admin
                </span>
                {role === 'hr_admin' && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </div>
              <span className="text-xs font-semibold text-white">Sarah Jenkins</span>
              <span className="text-[10px] text-slate-400 truncate">People Ops Director</span>
            </button>

            <button
              type="button"
              onClick={() => handlePresetSelect('employee', 'Alex Morgan', 'Engineering', 'Senior Frontend Architect', 'alex.morgan@nexora.io')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                role === 'employee'
                  ? 'bg-teal-900/40 border-teal-500 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5" /> Employee
                </span>
                {role === 'employee' && <Check className="w-3.5 h-3.5 text-teal-400" />}
              </div>
              <span className="text-xs font-semibold text-white">Alex Morgan</span>
              <span className="text-[10px] text-slate-400 truncate">Frontend Architect</span>
            </button>
          </div>
        </div>

        {/* Custom Configuration Form */}
        <form onSubmit={handleCreateDemo} className="p-5 space-y-4 relative z-10">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  const sanitized = e.target.value.toLowerCase().replace(/\s+/g, '.');
                  setCustomEmail(`${sanitized || 'user'}@nexora.io`);
                }}
                placeholder="e.g. Alex Rivera"
                className="w-full bg-[#111a2e] border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Demo Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="alex.rivera@nexora.io"
                className="w-full bg-[#111a2e] border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Role Permission</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-[#111a2e] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="employee">Employee (Self-Service)</option>
                <option value="hr_admin">HR / Admin (Full Access)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentName)}
                className="w-full bg-[#111a2e] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product Design">Product Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="People Operations">People Operations</option>
                <option value="Customer Success">Customer Success</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Architect"
                className="w-full bg-[#111a2e] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="w-full bg-[#111a2e] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="hybrid">Hybrid</option>
                <option value="office">Office</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create & Launch Persona</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
