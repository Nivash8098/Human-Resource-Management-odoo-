import React from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ActionCenterItem } from '../../types';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  DollarSign, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ActionCenterProps {
  items: ActionCenterItem[];
  onNavigate: (route: string) => void;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ items, onNavigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'Clock':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'UserCheck':
        return <UserCheck className="w-4 h-4 text-sky-600" />;
      case 'DollarSign':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Badge variant="danger" size="sm" dot>Immediate Action</Badge>;
      case 'medium':
        return <Badge variant="warning" size="sm">Attention</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Routine</Badge>;
    }
  };

  return (
    <Card className="shadow-xs border-slate-200/80">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600" />
          <CardTitle className="text-base sm:text-lg">ACTION CENTER</CardTitle>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {items.reduce((acc, i) => acc + i.count, 0)} Items Requiring Attention
        </span>
      </CardHeader>

      <div className="divide-y divide-slate-100 p-2 sm:p-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3.5 sm:p-4 rounded-lg hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(item.icon)}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                  {getUrgencyBadge(item.urgency)}
                </div>
                <p className="text-xs text-slate-500 mt-1">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="text-right hidden sm:block">
                <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                  {item.count}
                </span>
              </div>
              <Button
                size="sm"
                variant={item.urgency === 'high' ? 'primary' : 'outline'}
                onClick={() => onNavigate(item.link)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Review
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
