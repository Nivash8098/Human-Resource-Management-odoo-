import { QuickPrompt } from '../../types/copilot.types';

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'qp-today-attendance',
    label: 'Who is absent today?',
    query: 'Who is absent or on leave today?',
    category: 'attendance',
    icon: 'user-x'
  },
  {
    id: 'qp-pending-leaves',
    label: 'Pending leave requests',
    query: 'Show all pending time-off requests that need approval',
    category: 'leave',
    icon: 'calendar'
  },
  {
    id: 'qp-anomalies',
    label: 'Attendance anomalies',
    query: 'Are there any attendance anomalies, late check-ins, or missing check-outs?',
    category: 'attendance',
    icon: 'alert-triangle'
  },
  {
    id: 'qp-hr-briefing',
    label: "Today's HR briefing",
    query: "Give me today's daily HR briefing and key operational insights",
    category: 'briefing',
    icon: 'sparkles'
  },
  {
    id: 'qp-payroll',
    label: 'Payroll summary',
    query: 'What is the current payroll status and disbursement summary for August 2026?',
    category: 'payroll',
    icon: 'dollar-sign'
  },
  {
    id: 'qp-workforce-count',
    label: 'Department breakdown',
    query: 'Show employee count and department distribution',
    category: 'workforce',
    icon: 'users'
  }
];

export const SYSTEM_INSTRUCTIONS = `
You are DAYFLOW HR COPILOT, an enterprise AI assistant embedded in Dayflow HR Management System.
Tagline: Every workday, perfectly aligned.

Rules:
1. Always base all answers strictly on the real database and tool outputs. Never invent fake employees or data.
2. Tone: Professional, clear, concise, objective, and privacy-conscious.
3. For sensitive operations (e.g. approving/rejecting leave, changing salary, altering attendance), always require explicit confirmation.
4. Format output cleanly with high-level summaries, key metrics, and direct action routes.
`;
