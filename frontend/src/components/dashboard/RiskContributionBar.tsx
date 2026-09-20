import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

interface Props {
  factors: { factor: string; contribution: number }[];
}

export const RiskContributionBar: React.FC<Props> = ({ factors }) => {
  const colors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'];

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-orange-400 drop-shadow-[0_0_6px_rgba(249,115,22,0.6)]" />
          Heat Stress Factor Decomposition
        </h3>
        <span className="skeuo-pill px-2.5 py-0.5 text-[10px] font-mono text-gray-400">
          Relative Weighting
        </span>
      </div>

      {/* SUNKEN RECESSED BAR WELL */}
      <div className="neu-well p-1.5 h-10 rounded-xl overflow-hidden flex mb-4">
        {factors.map((f, i) => (
          <motion.div
            key={f.factor}
            initial={{ width: 0 }}
            animate={{ width: `${f.contribution}%` }}
            transition={{ duration: 1, delay: i * 0.1 }}
            className="h-full flex items-center justify-center text-[11px] font-black font-mono text-white overflow-hidden whitespace-nowrap relative shadow-inner first:rounded-l-lg last:rounded-r-lg"
            style={{
              backgroundColor: colors[i % colors.length],
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.3)`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            {f.contribution > 10 ? `${f.contribution}%` : ''}
          </motion.div>
        ))}
      </div>

      {/* TACTILE LEGEND CHIPS */}
      <div className="flex flex-wrap gap-2.5 mt-4">
        {factors.map((f, i) => (
          <div
            key={f.factor}
            className="neu-plate px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs"
          >
            <div
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{
                backgroundColor: colors[i % colors.length],
                boxShadow: `0 0 6px ${colors[i % colors.length]}`,
              }}
            />
            <span className="text-gray-400 font-mono text-[11px]">{f.factor}:</span>
            <span className="font-bold font-mono text-white text-[11px]">{f.contribution}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
