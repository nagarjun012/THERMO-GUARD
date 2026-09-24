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
    <div className="neu-card p-6 h-full flex flex-col justify-between bg-white/95">
      <div className="border-b border-slate-200/80 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg neu-well text-orange-600">
            <BarChart2 className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-mono">
            Peak HTSS Risk Locations
          </h3>
        </div>
        <p className="text-[11px] text-slate-600 font-medium mt-1">Top 5 districts ranked by real-time heat stress</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke="#475569"
              tick={{ fontSize: 11, fontFamily: 'monospace', fill: '#334155', fontWeight: 600 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#1e293b"
              width={90}
              tick={{ fontSize: 11, fontFamily: 'monospace', fill: '#0f172a', fontWeight: 700 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                color: '#0f172a',
                borderRadius: '12px',
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontSize: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              }}
              cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
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
