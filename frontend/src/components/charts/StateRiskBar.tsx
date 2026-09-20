import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getRiskColor } from '../../utils/helpers';
import { BarChart2 } from 'lucide-react';

interface Props {
  locations: {
    name: string;
    state?: string;
    htss: number;
    level: string;
  }[];
}

export const StateRiskBar: React.FC<Props> = ({ locations }) => {
  const chartData = (locations || [])
    .map((c) => ({
      name: c.name,
      score: c.htss,
      level: c.level,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="neu-card p-6 h-full flex flex-col justify-between">
      <div className="border-b border-white/5 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg neu-well text-orange-400">
            <BarChart2 className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Peak HTSS Risk Locations
          </h3>
        </div>
        <p className="text-[11px] text-gray-400 mt-1">Top 5 districts ranked by real-time heat stress</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={90} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0c101a',
                borderColor: 'rgba(255,255,255,0.15)',
                color: '#fff',
                borderRadius: '12px',
                fontFamily: 'monospace',
                fontSize: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
              }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            />
            <Bar dataKey="score" radius={[0, 6, 6, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRiskColor(entry.level)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
