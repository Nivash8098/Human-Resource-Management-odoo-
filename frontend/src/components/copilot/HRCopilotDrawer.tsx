import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hrCopilot } from '../../services/ai/copilot';
import { QUICK_PROMPTS } from '../../services/ai/prompts';
import { CopilotMessage, CopilotPendingAction } from '../../types/copilot.types';
import { CopilotMessageCard } from './CopilotMessageCard';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  X, 
  Send, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  CornerDownLeft, 
  ChevronRight,
  Database,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface HRCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const HRCopilotDrawer: React.FC<HRCopilotDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExecutingAction, setIsExecutingAction] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0 && user) {
      const firstName = user.full_name.split(' ')[0] || 'Admin';
      setMessages([
        {
          id: 'welcome-001',
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          responseType: 'text',
          title: `Welcome back, ${firstName}!`,
          summary: "I'm your Dayflow HR Copilot, connected live to your organization's workforce records. Ask me anything about attendance, leaves, payroll, headcount, or use the quick queries below.",
          actions: [
            { label: "Today's Briefing", actionId: 'briefing', icon: 'sparkles', primary: true },
            { label: 'Who is Absent?', actionId: 'attendance', icon: 'clock' },
            { label: 'Pending Approvals', route: '/leave/requests', icon: 'calendar' }
          ]
        }
      ]);
    }
  }, [user]);

  // Send query handler
  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await hrCopilot.processQuery(queryText, messages);
      setMessages((prev) => [...prev, response]);
    } catch (e: any) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          responseType: 'error_state',
          title: 'Query Failed',
          summary: 'Unable to reach the database services. Please verify your connection.',
          error: e?.message
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Execute sensitive action
  const handleExecuteAction = async (action: CopilotPendingAction, comment?: string) => {
    setIsExecutingAction(true);
    try {
      const resultMessage = await hrCopilot.executeAction(action, comment);
      
      // Update previous pending action message state to mark as executed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.pendingAction?.id === action.id
            ? { ...msg, isActionExecuted: true }
            : msg
        )
      );

      // Append result message
      setMessages((prev) => [...prev, resultMessage]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecutingAction(false);
    }
  };

  // Clear chat history
  const handleClearHistory = () => {
    const firstName = user?.full_name?.split(' ')[0] || 'Admin';
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        responseType: 'text',
        title: `History Cleared`,
        summary: `Context reset. How can I assist you with Dayflow workforce operations today, ${firstName}?`
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-screen max-w-xl bg-[#080e1c] border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* 1. Header with Dayflow Brand & DB Connected Badge */}
            <div className="p-4 sm:p-5 bg-gradient-to-b from-[#0e172e] to-[#080e1c] border-b border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20">
                  <div className="w-full h-full rounded-[11px] bg-[#091124] flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white tracking-wide">
                      DAYFLOW HR COPILOT
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-600/40 text-[10px] font-bold text-cyan-300 font-mono">
                      AI v2.0
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-semibold text-slate-300">
                      Live Workforce Data Connected
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  title="Clear history"
                  className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Close HR Copilot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Chat Stream Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
              {/* Quick Query Pills */}
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Suggested HR Inquiries</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {QUICK_PROMPTS.map((qp) => (
                    <button
                      key={qp.id}
                      type="button"
                      onClick={() => handleSendQuery(qp.query)}
                      disabled={isLoading}
                      className="text-left px-3 py-2 rounded-xl bg-[#0d1629]/90 hover:bg-[#13203c] border border-slate-800/90 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group shadow-sm"
                    >
                      <span className="truncate">{qp.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message List */}
              {messages.map((msg) => (
                <CopilotMessageCard
                  key={msg.id}
                  message={msg}
                  onNavigate={(route) => {
                    onNavigate(route);
                    onClose();
                  }}
                  onExecuteAction={handleExecuteAction}
                  onSendQuery={handleSendQuery}
                  isExecutingAction={isExecutingAction}
                />
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex flex-col my-3.5 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white">
                      <Sparkles className="w-3 h-3 animate-spin" />
                    </div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-400">
                      Analyzing workforce database...
                    </span>
                  </div>
                  <div className="rounded-2xl bg-[#0e172a]/90 border border-slate-700/80 p-4 shadow-xl flex items-center gap-3">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      Querying attendance matrix, leave requests, and payroll records...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 3. Input Toolbar */}
            <div className="p-3 sm:p-4 bg-[#080d1a] border-t border-slate-800/90 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery(inputQuery);
                }}
                className="relative flex items-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask Dayflow Copilot (e.g. 'Who is absent today?')"
                  disabled={isLoading}
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="absolute right-2 p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-900/30"
                  aria-label="Send query"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mt-2 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-slate-400" />
                  <span>Enterprise Security & Audit Logging Active</span>
                </span>
                <span className="hidden sm:inline-block font-mono">
                  Press <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Esc</kbd> to close
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
