import React from 'react';
import * as Icons from 'lucide-react';
import { RiskAssessment } from '../../types';

interface Props {
  risk: RiskAssessment;
}

export const RecommendationCard: React.FC<Props> = ({ risk }) => {
  return (
    <div className="neu-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Icons.ShieldCheck className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
          Clinical Advisory
        </h3>
        <span className="skeuo-pill px-2 py-0.5 text-[10px] font-mono text-gray-400">
          WHO / NDMA
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {risk.recommendations.map((rec, i) => {
          const Icon =
            (Icons[rec.icon as keyof typeof Icons] as React.ElementType) || Icons.Info;
          let color = 'text-gray-400';
          let borderGlow = 'border-white/5';
          if (rec.urgency === 'high') {
            color = 'text-orange-400';
            borderGlow = 'border-orange-500/30';
          }
          if (rec.urgency === 'extreme') {
            color = 'text-red-400';
            borderGlow = 'border-red-500/40';
          }

          return (
            <div
              key={i}
              className={`neu-well p-3.5 rounded-xl border ${borderGlow} flex gap-3 items-start transition-all hover:border-white/20`}
            >
              <div className={`mt-0.5 p-1.5 rounded-lg bg-dark-900 border border-white/5 shrink-0 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="skeuo-pill inline-block text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 py-0.5 mb-1">
                  {rec.audience}
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">{rec.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
