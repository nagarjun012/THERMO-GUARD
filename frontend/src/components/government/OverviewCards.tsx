import React from 'react';
import { Users, MapPin, AlertTriangle, Activity, Radio } from 'lucide-react';
import { GovSummaryCounters } from '../../services/govHtssService';

interface Props {
  counters: GovSummaryCounters;
  isLoading?: boolean;
  progress?: { loaded: number; total: number; percent: number };
}

export const OverviewCards: React.FC<Props> = ({ counters, isLoading, progress }) => {
  const cards = [
    {
      title: 'States at Risk',
      value: counters.statesAffectedCount,
      icon: MapPin,
      color: '#3b82f6',
      sub: 'Of 36 States & UTs',
    },
    {
      title: 'High-Risk Locations',
      value: counters.extremeCount + counters.highCount,
      icon: Activity,
      color: '#f97316',
      sub: 'Extreme & High HTSS',
    },
    {
      title: 'Active Heat Advisories',
      value: counters.extremeCount * 3 + counters.highCount * 2 + counters.moderateCount,
      icon: AlertTriangle,
      color: '#ef4444',
      sub: 'Triggered Protocols',
    },
    {
      title: 'Affected Population',
      value: (counters.affectedPopulation / 1000000).toFixed(1) + 'M',
      icon: Users,
      color: '#a855f7',
      sub: counters.affectedPopulation > 0 ? 'Census 2011 Official' : 'No High-Risk Districts',
      badge: 'Census Data',
    },
  ];

  return (
    <div className="space-y-4 mb-6">
      {isLoading && progress && (
        <div className="glass-panel px-4 py-3 rounded-2xl border border-orange-500/30 text-orange-400 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-lg animate-pulse">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-orange-400 animate-spin" />
            <span className="font-bold">
              Connecting Live Open-Meteo REST Pipeline across 788 Districts...
            </span>
          </div>
          <span className="skeuo-pill px-3 py-1 font-bold text-white bg-orange-500/20 border-orange-500/40">
            {progress.loaded} / {progress.total} Districts Processed ({progress.percent}%)
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="neu-card neu-card-hover p-5 flex items-center gap-4 relative overflow-hidden group"
            >
              {/* AMBIENT CORNER GLOW */}
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none group-hover:opacity-30 transition-opacity"
                style={{ backgroundColor: card.color }}
              />

              {/* SUNKEN ILLUMINATED WELL */}
              <div className="neu-well p-3 rounded-xl flex items-center justify-center shrink-0">
                <Icon
                  className="w-5 h-5"
                  style={{ color: card.color }}
                />
              </div>

              {/* READOUT */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
                    {card.title}
                  </p>
                  {card.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {card.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-mono text-white mt-0.5 tracking-tight">
                  {card.value}
                </h3>
                <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
                  {card.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
