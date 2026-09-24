import React, { useState, useMemo } from 'react';
import { useGovernmentDashboard } from '../hooks/useApi';
import { useGovPortalData } from '../hooks/useGovPortalData';
import { useAppStore } from '../stores/appStore';
import { OverviewCards } from '../components/government/OverviewCards';
import { GovernmentTable } from '../components/government/GovernmentTable';
import { HeatRiskMap } from '../components/map/HeatRiskMap';
import { MapLegend } from '../components/map/MapLegend';
import { StateRiskBar } from '../components/charts/StateRiskBar';
import { VulnerabilityRadar } from '../components/charts/VulnerabilityRadar';
import { HTSSAuditView } from '../components/dashboard/HTSSAuditView';
import { HeatHealthPredictionPanel } from '../components/dashboard/HeatHealthPredictionPanel';
import { computeFullAudit } from '../lib/htssEngine';
import { Siren, Calculator } from 'lucide-react';

export const GovernmentDashboard: React.FC = () => {
  const { selectedLocation } = useAppStore();
  const { data: apiData } = useGovernmentDashboard();
  const { districts, counters, isLoading, progress } = useGovPortalData();
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Socioeconomic vulnerability baseline reference data (Census / NITI Aayog Index)
  const baselineVulnerability = {
    state: 'National Reference / Delhi Baseline',
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

  // Compute HTSS audit data for highest-risk district or first verified district
  const auditTarget = useMemo(() => {
    return districts.find((d) => d.temperature !== null && d.humidity !== null && d.htss !== null) || null;
  }, [districts]);

  const auditData = useMemo(() => {
    if (!auditTarget || auditTarget.temperature === null || auditTarget.humidity === null) return null;
    return computeFullAudit(
      auditTarget.temperature,
      auditTarget.humidity,
      auditTarget.windSpeed || 10,
      auditTarget.solarRadiation || 0,
      'Open-Meteo Live Feed'
    );
  }, [auditTarget]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* COMMAND CENTER HEADER & TACTILE CONTROLS */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
            Government Command Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
            National Heat Risk Intelligence — Verified Real-Time Biometeorological Telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          {auditData && (
            <button
              onClick={() => setIsAuditOpen(true)}
              className="skeuo-btn px-3.5 py-2 text-xs font-mono font-medium text-slate-300 rounded-lg flex items-center gap-2 hover:text-white transition-colors"
              title="Inspect authoritative HTSS calculation formula breakdown"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>HTSS Audit View</span>
            </button>
          )}

          <button
            onClick={() => alert('Emergency Heatwave Protocol Broadcast Triggered to State Authorities.')}
            className="skeuo-btn skeuo-btn-danger px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2"
          >
            <Siren className="w-3.5 h-3.5 text-white" />
            <span>Broadcast Emergency Alert</span>
          </button>
        </div>
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

      {/* 3-5 DAY HEAT-HEALTH WARNING & EPIDEMIOLOGICAL RISK INTELLIGENCE */}
      <HeatHealthPredictionPanel
        lat={selectedLocation.lat || 28.6139}
        lon={selectedLocation.lon || 77.2090}
        locationName={selectedLocation.name || 'Selected Region'}
      />

      {/* ALL-INDIA RANKINGS TABLE & VULNERABILITY RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <GovernmentTable cities={apiData?.cities || []} />
        </div>
        <div className="lg:col-span-1">
          <VulnerabilityRadar data={baselineVulnerability} />
        </div>
      </div>

      {/* HTSS AUDIT MODAL */}
      {auditData && (
        <HTSSAuditView
          audit={auditData}
          isOpen={isAuditOpen}
          onClose={() => setIsAuditOpen(false)}
        />
      )}
    </div>
  );
};
