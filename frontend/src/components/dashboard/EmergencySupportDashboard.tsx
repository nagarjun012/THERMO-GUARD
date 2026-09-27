import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await facilityService.getNearbyFacilities(
        selectedLocation.lat,
        selectedLocation.lon,
        35,
        selectedLocation.stateName,
        selectedLocation.districtName
      );
      if (isMountedRef.current) {
        setFacilities(data.hospitals, data.coolingCentres);
      }

      const stats = await facilityService.getDataFreshness();
      if (isMountedRef.current && stats) {
        setFreshnessStats(stats);
      }
    } catch (err) {
      console.error('Error fetching facility data:', err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [selectedLocation.lat, selectedLocation.lon, selectedLocation.stateName, selectedLocation.districtName, setFacilities, setFreshnessStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute metric breakdowns
  const totalHospitals = hospitals.length;
  const liveHospitals = hospitals.filter(h => h.freshness === 'LIVE').length;
  const recentHospitals = hospitals.filter(h => h.freshness === 'RECENT').length;
  const staticHospitals = hospitals.filter(h => h.freshness === 'STALE' || h.freshness === 'UNKNOWN').length;

  const totalCooling = coolingCentres.length;
  const totalICU = hospitals.filter(h => h.totalICUBeds && h.totalICUBeds > 0).length;
  const ambulanceAvailableCount = hospitals.filter(h => h.ambulanceAvailable).length;

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-7 border border-blue-200/90 shadow-lg text-slate-800 my-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-50 border border-red-200 text-red-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex flex-wrap items-center gap-2 font-mono">
                INDIA EMERGENCY FACILITY FEDERATION
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold font-sans">
                  AUTHENTICATED REAL-TIME DATA
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Official Heatwave Emergency Support &amp; ICU Telemetry for {selectedLocation.name}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAdminModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Activity className="w-4 h-4" /> Hospital Admin Portal
          </button>
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition cursor-pointer"
            title="Refresh Facility Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Layer Filter Toggles */}
      <div className="flex flex-wrap items-center gap-2 my-5">
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mr-2">Layer Filters:</span>
        <button
          onClick={() => toggleLayerFilter('hospitals')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
            activeLayerFilters.hospitals
              ? 'bg-red-50 border-red-300 text-red-700 shadow-2xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
        >
          🏥 Hospitals ({totalHospitals})
        </button>
        <button
          onClick={() => toggleLayerFilter('icu')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
            activeLayerFilters.icu
              ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-2xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
        >
          🫀 ICU Facilities ({totalICU})
        </button>
        <button
          onClick={() => toggleLayerFilter('coolingCentres')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
            activeLayerFilters.coolingCentres
              ? 'bg-cyan-50 border-cyan-300 text-cyan-700 shadow-2xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
        >
          ❄️ Cooling Centres ({totalCooling})
        </button>
        <button
          onClick={() => toggleLayerFilter('ambulance')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
            activeLayerFilters.ambulance
              ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-2xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
        >
          🚑 Ambulance Hubs ({ambulanceAvailableCount})
        </button>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Hospitals Card */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Hospitals</span>
            <span className="text-lg">🏥</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 font-mono">{totalHospitals}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Nearby Emergency Facilities</div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-[11px]">
            <span className="text-emerald-700 font-bold">🟢 {liveHospitals} Live</span>
            <span className="text-amber-700 font-bold">🟡 {recentHospitals} Recent</span>
            <span className="text-slate-500 font-medium">⚪ {staticHospitals} Static</span>
          </div>
        </div>

        {/* ICU Facilities Card */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ICU Capable</span>
            <span className="text-lg">🫀</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-purple-700 font-mono">{totalICU}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Dedicated ICU Centres</div>
          </div>
          <div className="text-[11px] text-purple-700 pt-2 border-t border-slate-200 font-medium">
            Emergency Heatstroke Beds &amp; Ventilator Support
          </div>
        </div>

        {/* Municipal Cooling Centres Card */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cooling Shelters</span>
            <span className="text-lg">❄️</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-cyan-700 font-mono">{totalCooling}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Municipal Heat Action Kiosks</div>
          </div>
          <div className="text-[11px] text-cyan-700 pt-2 border-t border-slate-200 font-medium">
            ORS &amp; Water Stations Available
          </div>
        </div>

        {/* Ambulance Hubs */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">108 Ambulance</span>
            <span className="text-lg">🚑</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-amber-700 font-mono">{ambulanceAvailableCount}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Active Medical Response Hubs</div>
          </div>
          <div className="text-[11px] text-amber-700 pt-2 border-t border-slate-200 font-medium">
            Emergency Dispatch Telemetry
          </div>
        </div>
      </div>

      {/* Facilities List Table / Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" /> Nearest Verified Facilities ({hospitals.length + coolingCentres.length})
        </h3>

        {loading ? (
          <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 animate-pulse font-medium text-xs">
            Loading facility aggregation feed...
          </div>
        ) : hospitals.length === 0 && coolingCentres.length === 0 ? (
          <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 font-medium text-xs">
            No active facilities loaded for this location.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {hospitals.map((f) => (
              <div
                key={f.facilityId}
                className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition cursor-pointer" onClick={() => setSelectedFacility(f)}>
                      🏥 {f.facilityName}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        f.freshness === 'LIVE'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : f.freshness === 'RECENT'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {f.freshness === 'LIVE' ? '🟢 LIVE' : f.freshness === 'RECENT' ? '🟡 RECENT' : '⚪ STATIC'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{f.address}</p>

                  <div className="grid grid-cols-2 gap-2 my-2.5 text-xs">
                    <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">ICU Availability</span>
                      {f.availableICUBeds !== null && f.availableICUBeds !== undefined ? (
                        <span className="font-bold text-purple-800">{f.availableICUBeds} / {f.totalICUBeds || '—'} Beds</span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Live data unavailable</span>
                      )}
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Beds</span>
                      {f.availableBeds !== null && f.availableBeds !== undefined ? (
                        <span className="font-bold text-emerald-800">{f.availableBeds} / {f.totalBeds || '—'} Beds</span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Live bed data not provided</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span className="font-medium">📍 {f.distanceKm ? `${f.distanceKm} km away` : f.city}</span>
                  <button
                    onClick={() => setSelectedSourceInfo(f)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  >
                    <Info className="w-3 h-3" /> Data Source
                  </button>
                </div>
              </div>
            ))}

            {coolingCentres.map((c) => (
              <div
                key={c.centreId}
                className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-cyan-200 shadow-2xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-cyan-900 text-sm hover:text-cyan-700 transition cursor-pointer" onClick={() => setSelectedCoolingCentre(c)}>
                      ❄️ {c.name}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-300">
                      OPEN
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{c.address}</p>

                  <div className="flex items-center gap-3 my-2.5 text-xs text-slate-600 font-medium">
                    {c.drinkingWater && <span className="flex items-center gap-1 text-cyan-700 font-bold">💧 Water</span>}
                    {c.ORSAvailable && <span className="flex items-center gap-1 text-amber-700 font-bold">🥤 ORS</span>}
                    {c.airConditioning && <span className="flex items-center gap-1 text-blue-700 font-bold">❄️ AC</span>}
                    {c.shadedArea && <span className="flex items-center gap-1 text-emerald-700 font-bold">⛱️ Shade</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span className="font-medium">📍 {c.distanceKm ? `${c.distanceKm} km away` : c.city}</span>
                  <button
                    onClick={() => setSelectedSourceInfo(c)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
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
