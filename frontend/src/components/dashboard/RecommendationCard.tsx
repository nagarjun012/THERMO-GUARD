import React from 'react';
import {
  ShieldCheck,
  Info,
  AlertTriangle,
  Droplets,
  Sun,
  Wind,
  Umbrella,
  HeartPulse,
  Activity,
  Thermometer,
  Flame,
  Clock,
  Users,
  Shield,
  Zap,
  LucideIcon,
} from 'lucide-react';
import { RiskAssessment } from '../../types';

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Info,
  AlertTriangle,
  Droplets,
  Sun,
  Wind,
  Umbrella,
  HeartPulse,
  Activity,
  Thermometer,
  Flame,
  Clock,
  Users,
  Shield,
  Zap,
};

interface Props {
  risk: RiskAssessment;
}

export const RecommendationCard: React.FC<Props> = ({ risk }) => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[28px] p-6 h-full flex flex-col border border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.07)]">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Clinical Advisory
        </h3>
        <span className="px-2.5 py-1 text-[10px] font-bold text-slate-500 bg-[#EDF5FD] rounded-full border border-blue-100/60">
          WHO / NDMA
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {risk.recommendations.map((rec, i) => {
          const Icon = ICON_MAP[rec.icon] || Info;
          let color = 'text-blue-600';
          let borderStyle = 'border-blue-100 bg-[#EDF5FD]';
          if (rec.urgency === 'high') {
            color = 'text-orange-600';
            borderStyle = 'border-orange-200 bg-orange-50/70';
          }
          if (rec.urgency === 'extreme') {
            color = 'text-red-600';
            borderStyle = 'border-red-200 bg-red-50/70';
          }

          return (
            <div
              key={i}
              className={`p-3.5 rounded-2xl border ${borderStyle} flex gap-3 items-start transition-all shadow-xs`}
            >
              <div className={`mt-0.5 p-2 rounded-xl bg-white shadow-xs shrink-0 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block text-[10px] font-bold text-slate-600 uppercase tracking-wider px-2 py-0.5 mb-1 bg-white rounded-md border border-slate-200/50">
                  {rec.audience}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{rec.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
