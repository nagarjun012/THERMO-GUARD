import React from 'react';
import { apiService } from '../services/api';
// Historical data types used via API response
import { RiskTrendChart } from '../components/charts/RiskTrendChart';
import { TemperatureTrendChart } from '../components/charts/TemperatureTrendChart';
import { useAppStore } from '../stores/appStore';
import { useQuery } from '@tanstack/react-query';

export const AnalyticsPage: React.FC = () => {
  const { selectedLocation } = useAppStore();
  
  const { data, isLoading } = useQuery({
    queryKey: ['historical', selectedLocation.name],
    queryFn: () => apiService.getHistorical(selectedLocation.name)
  });

  if (isLoading || !data) return <div className="p-8 text-center text-gray-400">Loading analytics...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-2">Historical Analytics: {selectedLocation.name}</h1>
      <p className="text-gray-400 mb-8">Analyze past trends and predictive patterns.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskTrendChart data={data} />
        <TemperatureTrendChart data={data} />
      </div>

      <div className="glass-card p-6 mt-6">
        <h3 className="text-xl font-bold text-white mb-4">Extreme Heat Days (Year over Year)</h3>
        <p className="text-gray-400">Placeholder for advanced yearly analysis visualization.</p>
      </div>
    </div>
  );
};
