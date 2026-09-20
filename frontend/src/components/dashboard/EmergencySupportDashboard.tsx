import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { useFacilityStore } from '../../stores/facilityStore';
import { facilityService } from '../../services/facilityService';
import { Activity, ShieldCheck, Info, RefreshCw } from 'lucide-react';
import DataSourceModal from '../map/DataSourceModal';
import HospitalAdminModal from '../map/HospitalAdminModal';

export const EmergencySupportDashboard: React.FC = () => {
  const { selectedLocation } = useAppStore();
  const { 
    hospitals, 
    coolingCentres, 
    setFacilities, 
    setFreshnessStats,
    setSelectedFacility,
    setSelectedCoolingCentre,
    setSelectedSourceInfo,
    setAdminModalOpen,
    activeLayerFilters,
    toggleLayerFilter
  } = useFacilityStore();

  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await facilityService.getNearbyFacilities(
        selectedLocation.lat,
        selectedLocation.lon,
        35,
        selectedLocation.stateName,
        selectedLocation.districtName
      );
      setFacilities(data.hospitals, data.coolingCentres);

      const stats = await facilityService.getDataFreshness();
      if (stats) setFreshnessStats(stats);
    } catch (err) {
      console.error('Error fetching facility data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedLocation.lat, selectedLocation.lon]);

  // Compute metric breakdowns
  const totalHospitals = hospitals.length;
  const liveHospitals = hospitals.filter(h => h.freshness === 'LIVE').length;
  const recentHospitals = hospitals.filter(h => h.freshness === 'RECENT').length;
  const staticHospitals = hospitals.filter(h => h.freshness === 'STALE' || h.freshness === 'UNKNOWN').length;

  const totalCooling = coolingCentres.length;
  const totalICU = hospitals.filter(h => h.totalICUBeds && h.totalICUBeds > 0).length;
  const ambulanceAvailableCount = hospitals.filter(h => h.ambulanceAvailable).length;

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/60 shadow-xl text-white my-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-red-500/30 text-red-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
                INDIA EMERGENCY FACILITY FEDERATION
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  AUTHENTICATED REAL-TIME DATA
                </span>
              </h2>
              <p className="text-sm text-slate-400">
                Official Heatwave Emergency Support & ICU Telemetry for {selectedLocation.name}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAdminModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <Activity className="w-4 h-4" /> Hospital Admin Portal
          </button>
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            title="Refresh Facility Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Layer Filter Toggles */}
      <div className="flex flex-wrap items-center gap-2 my-5">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-2">Layer Filters:</span>
        <button
          onClick={() => toggleLayerFilter('hospitals')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
            activeLayerFilters.hospitals
              ? 'bg-red-500/20 border-red-500/40 text-red-300'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 opacity-60'
          }`}
        >
          🏥 Hospitals ({totalHospitals})
        </button>
        <button
          onClick={() => toggleLayerFilter('icu')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
            activeLayerFilters.icu
              ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 opacity-60'
          }`}
        >
          🫀 ICU Facilities ({totalICU})
        </button>
        <button
          onClick={() => toggleLayerFilter('coolingCentres')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
            activeLayerFilters.coolingCentres
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 opacity-60'
          }`}
        >
          ❄️ Cooling Centres ({totalCooling})
        </button>
        <button
          onClick={() => toggleLayerFilter('ambulance')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
            activeLayerFilters.ambulance
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 opacity-60'
          }`}
        >
          🚑 Ambulance Hubs ({ambulanceAvailableCount})
        </button>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Hospitals Card */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emergency Hospitals</span>
            <span className="text-lg">🏥</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold text-white">{totalHospitals}</div>
            <div className="text-xs text-slate-400 mt-1">Nearby Emergency Facilities</div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60 text-[11px]">
            <span className="text-emerald-400 font-semibold">🟢 {liveHospitals} Live</span>
            <span className="text-amber-400 font-semibold">🟡 {recentHospitals} Recent</span>
            <span className="text-slate-400">⚪ {staticHospitals} Static</span>
          </div>
        </div>

        {/* ICU Facilities Card */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ICU Capable</span>
            <span className="text-lg">🫀</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold text-purple-400">{totalICU}</div>
            <div className="text-xs text-slate-400 mt-1">Dedicated ICU Centres</div>
          </div>
          <div className="text-[11px] text-purple-300/80 pt-2 border-t border-slate-700/60">
            Emergency Heatstroke Beds & Ventilator Support
          </div>
        </div>

        {/* Municipal Cooling Centres Card */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cooling Shelters</span>
            <span className="text-lg">❄️</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold text-cyan-400">{totalCooling}</div>
            <div className="text-xs text-slate-400 mt-1">Municipal Heat Action Kiosks</div>
          </div>
          <div className="text-[11px] text-cyan-300/80 pt-2 border-t border-slate-700/60">
            ORS & Water Stations Available
          </div>
        </div>

        {/* Ambulance Hubs */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">108 Ambulance</span>
            <span className="text-lg">🚑</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold text-amber-400">{ambulanceAvailableCount}</div>
            <div className="text-xs text-slate-400 mt-1">Active Medical Response Hubs</div>
          </div>
          <div className="text-[11px] text-amber-300/80 pt-2 border-t border-slate-700/60">
            Emergency Dispatch Telemetry
          </div>
        </div>
      </div>

      {/* Facilities List Table / Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" /> Nearest Verified Facilities ({hospitals.length + coolingCentres.length})
        </h3>

        {loading ? (
          <div className="p-8 text-center text-slate-400 bg-slate-800/40 rounded-xl border border-slate-700/50 animate-pulse">
            Loading facility aggregation feed...
          </div>
        ) : hospitals.length === 0 && coolingCentres.length === 0 ? (
          <div className="p-6 text-center text-slate-400 bg-slate-800/40 rounded-xl border border-slate-700/50">
            No active facilities loaded for this location.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {hospitals.map((f) => (
              <div
                key={f.facilityId}
                className="p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-sm hover:text-emerald-400 transition cursor-pointer" onClick={() => setSelectedFacility(f)}>
                      🏥 {f.facilityName}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        f.freshness === 'LIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : f.freshness === 'RECENT'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-700/50 text-slate-400 border-slate-600'
                      }`}
                    >
                      {f.freshness === 'LIVE' ? '🟢 LIVE' : f.freshness === 'RECENT' ? '🟡 RECENT' : '⚪ STATIC'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{f.address}</p>

                  <div className="grid grid-cols-2 gap-2 my-2.5 text-xs">
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">ICU Availability</span>
                      {f.availableICUBeds !== null && f.availableICUBeds !== undefined ? (
                        <span className="font-bold text-purple-400">{f.availableICUBeds} / {f.totalICUBeds || '—'} Beds</span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Live data unavailable</span>
                      )}
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Total Beds</span>
                      {f.availableBeds !== null && f.availableBeds !== undefined ? (
                        <span className="font-bold text-emerald-400">{f.availableBeds} / {f.totalBeds || '—'} Beds</span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Live bed data not provided</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs text-slate-400">
                  <span>📍 {f.distanceKm ? `${f.distanceKm} km away` : f.city}</span>
                  <button
                    onClick={() => setSelectedSourceInfo(f)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] font-medium"
                  >
                    <Info className="w-3 h-3" /> Data Source
                  </button>
                </div>
              </div>
            ))}

            {coolingCentres.map((c) => (
              <div
                key={c.centreId}
                className="p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-cyan-500/30 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-cyan-300 text-sm hover:text-cyan-200 transition cursor-pointer" onClick={() => setSelectedCoolingCentre(c)}>
                      ❄️ {c.name}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      OPEN
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{c.address}</p>

                  <div className="flex items-center gap-3 my-2.5 text-xs text-slate-300">
                    {c.drinkingWater && <span className="flex items-center gap-1 text-cyan-400">💧 Water</span>}
                    {c.ORSAvailable && <span className="flex items-center gap-1 text-amber-400">🥤 ORS</span>}
                    {c.airConditioning && <span className="flex items-center gap-1 text-blue-400">❄️ AC</span>}
                    {c.shadedArea && <span className="flex items-center gap-1 text-emerald-400">⛱️ Shade</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs text-slate-400">
                  <span>📍 {c.distanceKm ? `${c.distanceKm} km away` : c.city}</span>
                  <button
                    onClick={() => setSelectedSourceInfo(c)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] font-medium"
                  >
                    <Info className="w-3 h-3" /> Data Source
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transparency Modal & Admin Modal */}
      <DataSourceModal />
      <HospitalAdminModal />
    </div>
  );
};

export default EmergencySupportDashboard;
