import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

interface Props {
  factors: { factor: string; contribution: number }[];
}

export const RiskContributionBar: React.FC<Props> = ({ factors }) => {
  const colors = ['#ef4444', '#f97316', '#eab308', '#2563eb', '#8b5cf6'];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[28px] p-6 sm:p-7 border border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.07)]">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          Heat Stress Factor Decomposition
        </h3>
        <span className="px-2.5 py-1 text-[10px] font-bold text-slate-500 bg-[#EDF5FD] rounded-full border border-blue-100/60">
          Relative Weighting
        </span>
      </div>

      {/* RECESSED MULTI-BAR */}
      <div className="p-1 h-10 rounded-2xl overflow-hidden flex mb-4 bg-[#EDF5FD] border border-blue-100/60">
        {factors.map((f, i) => (
          <motion.div
            key={f.factor}
            initial={{ width: 0 }}
            animate={{ width: `${f.contribution}%` }}
            transition={{ duration: 1, delay: i * 0.1 }}
            className="h-full flex items-center justify-center text-[11px] font-extrabold text-white overflow-hidden whitespace-nowrap relative shadow-inner first:rounded-l-xl last:rounded-r-xl"
            style={{
              backgroundColor: colors[i % colors.length],
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            {f.contribution > 10 ? `${f.contribution}%` : ''}
          </motion.div>
        ))}
      </div>

      {/* LEGEND CHIPS */}
      <div className="flex flex-wrap gap-2.5 mt-4">
        {factors.map((f, i) => (
          <div
            key={f.factor}
            className="px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs bg-[#EDF5FD] border border-blue-100/80 shadow-xs"
          >
            <div
              className="w-2.5 h-2.5 rounded-full shadow-xs"
              style={{
                backgroundColor: colors[i % colors.length],
              }}
            />
            <span className="text-slate-500 font-medium text-[11px]">{f.factor}:</span>
            <span className="font-extrabold text-slate-800 text-[11px]">{f.contribution}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
