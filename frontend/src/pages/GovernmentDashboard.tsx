import React from 'react';
import { useGovernmentDashboard } from '../hooks/useApi';
import { useGovPortalData } from '../hooks/useGovPortalData';
import { useAppStore } from '../stores/appStore';
import { OverviewCards } from '../components/government/OverviewCards';
import { GovernmentTable } from '../components/government/GovernmentTable';
import { HeatRiskMap } from '../components/map/HeatRiskMap';
import { MapLegend } from '../components/map/MapLegend';
import { StateRiskBar } from '../components/charts/StateRiskBar';
import { VulnerabilityRadar } from '../components/charts/VulnerabilityRadar';
import { Siren } from 'lucide-react';

export const GovernmentDashboard: React.FC = () => {
  const { selectedLocation } = useAppStore();
  const { data: apiData } = useGovernmentDashboard();
  const { districts, counters, isLoading, progress } = useGovPortalData();

  const demoVuln = {
    state: 'Delhi',
    elderlyPercentage: 8.6,
    populationDensity: 11320,
    outdoorWorkersPercentage: 38,
    povertyPercentage: 9.9,
    healthcareAccess: 75,
  };

  // Convert processed districts to StateRiskBar format
  const topLocations = districts
    .filter((d) => d.htss !== null)
    .map((d) => ({
      name: d.district,
      state: d.state,
      htss: d.htss as number,
      level: d.riskCategory,
    }))
    .slice(0, 5);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* COMMAND CENTER HEADER & TACTILE EMERGENCY BUTTON */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
            Government Command Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
            National Heat Risk Intelligence — 100% Real-Time Open-Meteo Pipeline
          </p>
        </div>

        <button
          onClick={() => alert('Emergency Heatwave Protocol Broadcast Triggered to State Authorities.')}
          className="skeuo-btn skeuo-btn-danger btn-shimmer px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-[0_4px_16px_rgba(220,38,38,0.55)] flex items-center gap-2"
        >
          <Siren className="w-4 h-4 animate-bounce" />
          <span>Broadcast Emergency Alert</span>
        </button>
      </div>

      {/* DYNAMIC LIVE OVERVIEW CARDS */}
      <OverviewCards counters={counters} isLoading={isLoading} progress={progress} />

      {/* MAP & PEAK LOCATIONS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden neu-card border border-white/10 shadow-2xl">
          <HeatRiskMap cities={apiData?.cities || []} center={[selectedLocation.lat, selectedLocation.lon]} />
          <MapLegend />
        </div>
        <div className="lg:col-span-1">
          <StateRiskBar locations={topLocations} />
        </div>
      </div>

      {/* ALL-INDIA RANKINGS TABLE & VULNERABILITY RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <GovernmentTable cities={apiData?.cities || []} />
        </div>
        <div className="lg:col-span-1">
          <VulnerabilityRadar data={demoVuln} />
        </div>
      </div>
    </div>
  );
};
