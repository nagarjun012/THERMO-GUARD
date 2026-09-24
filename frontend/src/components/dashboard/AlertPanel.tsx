import React from 'react';
import { Alert } from '../../types';
import { AlertTriangle, AlertCircle, Info, Flame, Skull } from 'lucide-react';

interface Props {
  alerts: Alert[];
}

export const AlertPanel: React.FC<Props> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-[28px] p-6 flex flex-col items-center justify-center text-center h-full min-h-[220px] border border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.07)]">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center mb-3 shadow-xs">
          <Info className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 uppercase">No Active Warnings</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">Thermal indices are currently within safe physiological limits.</p>
      </div>
    );
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'red':
        return {
          bg: 'bg-red-50/90',
          border: 'border-red-200',
          icon: Skull,
          color: 'text-red-700',
          badge: 'bg-red-100 text-red-700',
        };
      case 'orange':
        return {
          bg: 'bg-orange-50/90',
          border: 'border-orange-200',
          icon: Flame,
          color: 'text-orange-700',
          badge: 'bg-orange-100 text-orange-700',
        };
      case 'yellow':
        return {
          bg: 'bg-amber-50/90',
          border: 'border-amber-200',
          icon: AlertTriangle,
          color: 'text-amber-800',
          badge: 'bg-amber-100 text-amber-800',
        };
      default:
        return {
          bg: 'bg-blue-50/90',
          border: 'border-blue-200',
          icon: AlertCircle,
          color: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-700',
        };
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[28px] p-6 h-full flex flex-col border border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.07)]">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Active Heat Alerts
        </h3>
        <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-red-600 bg-red-50 rounded-full border border-red-200">
          {alerts.length} Active
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {alerts.map((alert) => {
          const styles = getSeverityStyles(alert.severity);
          const Icon = styles.icon;

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border ${styles.border} ${styles.bg} transition-all duration-200 shadow-xs`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl bg-white shadow-xs ${styles.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {alert.title}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${styles.badge}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-black/5">
                    <span>Issued: {alert.time}</span>
                    <span className="font-semibold text-slate-600">Active Warning</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
