import React from 'react';
import { Alert } from '../../types';
import { AlertTriangle, AlertCircle, Info, Flame, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  alerts: Alert[];
}

export const AlertPanel: React.FC<Props> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="neu-card p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
        <div className="w-12 h-12 rounded-2xl neu-well flex items-center justify-center mb-3">
          <Info className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
        </div>
        <h3 className="text-sm font-bold text-gray-200 uppercase font-mono">No Active Warnings</h3>
        <p className="text-xs text-gray-400 mt-1">Thermal indices are within safe physiological limits.</p>
      </div>
    );
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'red':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/50',
          icon: Skull,
          color: 'text-red-400',
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
        };
      case 'orange':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/50',
          icon: Flame,
          color: 'text-orange-400',
          glow: 'shadow-[0_0_15px_rgba(249,115,22,0.2)]',
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/50',
          icon: AlertTriangle,
          color: 'text-yellow-400',
          glow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]',
        };
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/50',
          icon: AlertCircle,
          color: 'text-blue-400',
          glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
        };
    }
  };

  return (
    <div className="neu-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]" />
          Active Heat Alerts ({alerts.length})
        </h3>
        <span className="skeuo-pill px-2 py-0.5 text-[10px] font-mono text-yellow-400 border border-yellow-500/30">
          IMD Advisory
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        <AnimatePresence>
          {alerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            const Icon = styles.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${styles.bg} ${styles.border} ${styles.glow} transition-all`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${styles.color}`} />
                    <h4 className={`text-xs font-bold font-mono ${styles.color}`}>{alert.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">{alert.time}</span>
                </div>
                <p className="text-xs text-gray-300 mb-3 leading-relaxed">{alert.message}</p>
                <div className="flex flex-wrap gap-1.5">
                  {alert.actions.map((act, i) => (
                    <span
                      key={i}
                      className="neu-plate text-[10px] font-semibold px-2.5 py-1 rounded-lg text-gray-300"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
