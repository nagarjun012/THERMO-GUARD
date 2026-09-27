import React, { useState, useMemo, useEffect } from 'react';
import { useGovPortalData } from '../../hooks/useGovPortalData';
import { useAppStore } from '../../stores/appStore';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2,
  RefreshCw,
  Radio,
  CheckCircle2,
  Cpu,
  Zap,
} from 'lucide-react';
import { DataIntegrityInspector } from './DataIntegrityInspector';

interface Props {
  cities?: any[];
}

export const GovernmentTable: React.FC<Props> = () => {
  const { setIndiaLocation } = useAppStore();
  const {
    districts,
    states,
    counters,
    isLoading,
    isRefreshing,
    isSyncingState,
    progress,
    lastUpdated,
    refreshData,
    syncStateLive,
    syncDistrictLive,
    selectedDistrict,
    isInspectorOpen,
    setIsInspectorOpen,
    inspectDistrict,
  } = useGovPortalData();

  const [filterQuery, setFilterQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('ALL');
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<
    'ALL' | 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW' | 'DATA UNAVAILABLE'
  >('ALL');
  const [activeViewMode, setActiveViewMode] = useState<'districts' | 'states'>('districts');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Filter district locations by Search Query, State Filter, and Risk Category Tab
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      const matchesQuery =
        d.district.toLowerCase().includes(filterQuery.toLowerCase()) ||
        d.state.toLowerCase().includes(filterQuery.toLowerCase());

      const matchesState = selectedStateFilter === 'ALL' || d.state === selectedStateFilter;
      const matchesRisk = selectedRiskCategory === 'ALL' || d.riskCategory === selectedRiskCategory;

      return matchesQuery && matchesState && matchesRisk;
    });
  }, [districts, filterQuery, selectedStateFilter, selectedRiskCategory]);

  // Reset pagination when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterQuery, selectedStateFilter, selectedRiskCategory]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredDistricts.length / pageSize));
  const paginatedDistricts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDistricts.slice(start, start + pageSize);
  }, [filteredDistricts, currentPage, pageSize]);

  return (
    <div className="neu-card overflow-hidden shadow-2xl border border-slate-200/80 bg-white/95">
      {/* HEADER BAR & CONTROLS WITH GLASS SPECULAR RIM */}
      <div className="glass-specular p-4 sm:p-5 border-b border-slate-200 bg-[#F8FAFC] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl neu-well text-emerald-600 shrink-0 mt-0.5 sm:mt-0">
              <Radio className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-950 tracking-tight font-mono">
                  All-India Real-Time Thermal Heat Rankings
                </h3>
                <span className="skeuo-pill px-2.5 sm:px-3 py-0.5 text-[10px] sm:text-[11px] font-mono font-bold flex items-center gap-1.5 text-emerald-800 border border-emerald-300 bg-emerald-100">
                  {isLoading || isRefreshing ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                      FETCHING ({progress.loaded}/{progress.total})
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden md:inline">100% REAL-TIME OPEN-METEO TELEMETRY — </span>
                      <span>{counters.successfulCount}/{counters.totalDistricts} DISTRICTS SYNCED</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 font-semibold mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span>Stull &amp; Liljegren physical thermodynamic calculations from live Open-Meteo</span>
                <span className="text-slate-400 hidden sm:inline">•</span>
                <span className="text-orange-700 font-mono font-black">Last Updated: {lastUpdated}</span>
              </p>
            </div>
          </div>

          {/* SKEUOMORPHIC ACTIONS & RECESSED SEARCH */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => refreshData(true)}
              disabled={isLoading || isRefreshing}
              className="skeuo-btn skeuo-btn-amber btn-shimmer px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 disabled:opacity-50 flex-1 sm:flex-initial justify-center"
              title="Re-query Open-Meteo REST API for all 788 districts"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Live Telemetry</span>
            </button>

            {/* VIEW MODE TACTILE TOGGLE SWITCH */}
            <div className="neu-well p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setActiveViewMode('districts')}
                className={`skeuo-btn px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 sm:gap-1.5 ${
                  activeViewMode === 'districts'
                    ? 'skeuo-btn-primary shadow-md'
                    : 'text-slate-700 hover:text-slate-950 font-extrabold'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Districts ({districts.length})</span>
              </button>
              <button
                onClick={() => setActiveViewMode('states')}
                className={`skeuo-btn px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 sm:gap-1.5 ${
                  activeViewMode === 'states'
                    ? 'skeuo-btn-primary shadow-md'
                    : 'text-slate-700 hover:text-slate-950 font-extrabold'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>States ({states.length})</span>
              </button>
            </div>

            {/* SUNKEN SEARCH WELL */}
            <div className="neu-well px-3 py-1.5 flex items-center flex-1 min-w-[200px] focus-within:ring-2 focus-within:ring-blue-500/50 transition-all bg-white border border-slate-300 rounded-xl">
              <Search className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Search state or district..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-transparent border-none text-xs text-slate-950 placeholder-slate-400 focus:outline-none font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* ORDERED RISK CATEGORY TABS & STATE SELECTOR */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-200 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                setSelectedRiskCategory('ALL');
                setSelectedStateFilter('ALL');
              }}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all border ${
                selectedRiskCategory === 'ALL' && selectedStateFilter === 'ALL'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              ALL LOCATIONS ({counters.totalDistricts})
            </button>

            <button
              onClick={() => setSelectedRiskCategory('EXTREME')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 border ${
                selectedRiskCategory === 'EXTREME'
                  ? 'bg-red-600 text-white border-red-600 shadow-xs'
                  : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              EXTREME ({counters.extremeCount})
            </button>

            <button
              onClick={() => setSelectedRiskCategory('HIGH')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 border ${
                selectedRiskCategory === 'HIGH'
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                  : 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              HIGH ({counters.highCount})
            </button>

            <button
              onClick={() => setSelectedRiskCategory('MODERATE')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 border ${
                selectedRiskCategory === 'MODERATE'
                  ? 'bg-amber-400 text-slate-950 font-black border-amber-400 shadow-xs'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              MODERATE ({counters.moderateCount})
            </button>

            <button
              onClick={() => setSelectedRiskCategory('LOW')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 border ${
                selectedRiskCategory === 'LOW'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              LOW ({counters.lowCount})
            </button>

            {counters.failedCount > 0 && (
              <button
                onClick={() => setSelectedRiskCategory('DATA UNAVAILABLE')}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 border ${
                  selectedRiskCategory === 'DATA UNAVAILABLE'
                    ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                UNAVAILABLE ({counters.failedCount})
              </button>
            )}
          </div>

          {/* STATE FILTER DROPDOWN & LIVE SYNC BUTTON (ACCESSIBLE LIGHT THEME CONTRAST) */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-slate-600 font-bold hidden sm:inline font-mono text-[11px]">
              State Filter:
            </span>
            <div className="flex-1 sm:flex-initial">
              <select
                value={selectedStateFilter}
                onChange={(e) => setSelectedStateFilter(e.target.value)}
                className="w-full sm:w-auto bg-white text-slate-950 font-semibold text-xs py-1.5 px-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer max-w-full sm:max-w-[220px] font-mono shadow-2xs"
              >
                <option value="ALL" className="bg-white text-slate-950">All States &amp; UTs ({states.length})</option>
                {states.map((st) => (
                  <option key={st.name} value={st.name} className="bg-white text-slate-950">
                    {st.name} ({st.avgHtss !== null ? `Avg ${st.avgHtss}` : 'Unavailable'})
                  </option>
                ))}
              </select>
            </div>

            {selectedStateFilter !== 'ALL' && (
              <button
                onClick={() => syncStateLive(selectedStateFilter)}
                disabled={isSyncingState === selectedStateFilter || isLoading || isRefreshing}
                className="skeuo-btn skeuo-btn-emerald btn-shimmer px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 disabled:opacity-50"
                title={`Fetch real-time Open-Meteo weather for all districts in ${selectedStateFilter}`}
              >
                <Zap className={`w-3.5 h-3.5 ${isSyncingState === selectedStateFilter ? 'animate-spin' : 'text-emerald-200'}`} />
                <span>{isSyncingState === selectedStateFilter ? 'Syncing...' : `Sync ${selectedStateFilter} Live`}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. STATE-LEVEL HTSS RANKINGS TABLE                                   */}
      {/* ===================================================================== */}
      {activeViewMode === 'states' ? (
        <div className="overflow-x-auto relative -webkit-overflow-scrolling-touch">
          {/* Mobile Swipe Hint */}
          <div className="md:hidden px-3.5 py-1.5 bg-blue-50/90 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900 font-semibold font-mono">
            <span>Swipe horizontally to view all parameters</span>
            <span className="text-blue-600 font-bold">⇄</span>
          </div>
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="sticky top-0 z-10 shadow-xs backdrop-blur-md">
              <tr className="border-b border-blue-200 bg-[#DBEAFE]/95 text-[11px] font-black uppercase text-blue-950 tracking-wider font-mono">
                <th className="py-3.5 px-3 sm:px-4 w-16 whitespace-nowrap">Rank</th>
                <th className="py-3.5 px-3 sm:px-4 min-w-[180px] whitespace-nowrap">State / Union Territory</th>
                <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Districts Valid</th>
                <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Calculated Avg HTSS</th>
                <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Peak District HTSS</th>
                <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">State Risk Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-mono">
              {states.map((st) => {
                const color =
                  st.maxLevel === 'EXTREME'
                    ? '#ef4444'
                    : st.maxLevel === 'HIGH'
                    ? '#f97316'
                    : st.maxLevel === 'MODERATE'
                    ? '#eab308'
                    : st.maxLevel === 'LOW'
                    ? '#10b981'
                    : '#6b7280';

                return (
                  <tr key={st.name} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3 sm:px-4 font-black text-slate-800 whitespace-nowrap">#{st.rank}</td>
                    <td className="py-3.5 px-3 sm:px-4">
                      <div className="font-extrabold text-slate-950 text-sm font-sans">{st.name}</div>
                      <div className="text-[10px] text-slate-600 font-mono font-semibold">{st.type}</div>
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-slate-800 whitespace-nowrap">
                      {st.validDistrictsCount} / {st.districtsCount}
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 text-center font-black text-base whitespace-nowrap">
                      {st.avgHtss !== null ? (
                        <span style={{ color }}>{st.avgHtss} / 100</span>
                      ) : (
                        <span className="text-slate-500 font-normal italic">Unavailable</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-slate-900 whitespace-nowrap">
                      {st.maxHtss !== null ? `${st.maxHtss} / 100` : '—'}
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                      <span
                        className="skeuo-pill inline-block px-3 py-0.5 text-[10px] font-black uppercase tracking-wider border shadow-sm"
                        style={{
                          color,
                          borderColor: `${color}60`,
                          backgroundColor: `${color}15`,
                        }}
                      >
                        {st.maxLevel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* ===================================================================== */
        /* 2. DISTRICT-LEVEL REAL HTSS RANKINGS TABLE                          */
        /* ===================================================================== */
        <div className="overflow-x-auto relative -webkit-overflow-scrolling-touch">
          {/* Mobile Swipe Hint */}
          <div className="md:hidden px-3.5 py-1.5 bg-blue-50/90 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900 font-semibold font-mono">
            <span>Swipe horizontally to view all parameters</span>
            <span className="text-blue-600 font-bold">⇄</span>
          </div>
          <table className="w-full text-left border-collapse min-w-[840px]">
            <thead className="sticky top-0 z-10 shadow-xs backdrop-blur-md">
              <tr className="border-b border-blue-200 bg-[#DBEAFE]/95 text-[11px] font-black uppercase text-blue-950 tracking-wider font-mono">
                <th className="py-3.5 px-3 sm:px-4 w-16 whitespace-nowrap">Rank</th>
                <th className="py-3.5 px-3 sm:px-4 min-w-[180px] sm:min-w-[210px] whitespace-nowrap">District &amp; State</th>
                <th className="py-3.5 px-3 sm:px-4 text-center min-w-[110px] whitespace-nowrap">Calculated Real HTSS</th>
                <th className="py-3.5 px-3 sm:px-4 text-center min-w-[110px] whitespace-nowrap">Risk Category</th>
                <th className="py-3.5 px-3 sm:px-4 text-center min-w-[95px] whitespace-nowrap">Live Air Temp</th>
                <th className="py-3.5 px-3 sm:px-4 text-center min-w-[95px] whitespace-nowrap">Outdoor WBGT</th>
                <th className="py-3.5 px-3 sm:px-4 text-center min-w-[95px] whitespace-nowrap">UTCI Index</th>
                <th className="py-3.5 px-3 sm:px-4 text-center min-w-[110px] whitespace-nowrap">Inspect Math</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-mono">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-600 space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-600" />
                    <p className="font-bold font-sans text-sm text-slate-950">Executing Open-Meteo Real Telemetry Pipeline...</p>
                    <p className="text-xs text-slate-600 font-mono">{progress.loaded} / {progress.total} Districts Processed</p>
                  </td>
                </tr>
              ) : paginatedDistricts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-600 font-sans">
                    No districts matching filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedDistricts.map((loc) => {
                  const isFailed = loc.status === 'FAILED' || loc.htss === null;
                  const color =
                    loc.riskCategory === 'EXTREME'
                      ? '#ef4444'
                      : loc.riskCategory === 'HIGH'
                      ? '#f97316'
                      : loc.riskCategory === 'MODERATE'
                      ? '#eab308'
                      : loc.riskCategory === 'LOW'
                      ? '#10b981'
                      : '#6b7280';

                  const fmtNum = (v: number | null | undefined) => (typeof v === 'number' ? Math.round(v * 10) / 10 : v ?? '—');

                  return (
                    <tr
                      key={loc.id}
                      onClick={() => {
                        setIndiaLocation(loc.state, loc.district, loc.lat, loc.lon, true, 'LIVE', undefined, false, true);
                        inspectDistrict(loc);
                      }}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      {/* RANK */}
                      <td className="py-3.5 px-3 sm:px-4 font-black text-slate-800 whitespace-nowrap">
                        {loc.rank !== null ? `#${loc.rank}` : <span className="text-red-600 font-bold text-xs">N/A</span>}
                      </td>

                      {/* DISTRICT & STATE */}
                      <td className="py-3.5 px-3 sm:px-4 font-sans">
                        <div className="font-extrabold text-slate-950 text-sm group-hover:text-blue-700 transition-colors">
                          {loc.district}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                          <span className="text-blue-700 font-bold">{loc.state}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-600 text-[10px]">
                            {loc.lat.toFixed(2)}°N, {loc.lon.toFixed(2)}°E
                          </span>
                        </div>
                      </td>

                      {/* CALCULATED REAL HTSS */}
                      <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                        {isFailed ? (
                          <span className="text-red-600 font-bold italic text-xs">Unavailable</span>
                        ) : (
                          <div className="font-black text-base" style={{ color }}>
                            {loc.htss}{' '}
                            <span className="text-[10px] text-slate-600 font-bold">/ 100</span>
                          </div>
                        )}
                      </td>

                      {/* RISK CATEGORY BADGE */}
                      <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                        <span
                          className="skeuo-pill inline-block px-3 py-0.5 text-[10px] font-black uppercase tracking-wider border shadow-sm"
                          style={{
                            color,
                            borderColor: `${color}60`,
                            backgroundColor: `${color}15`,
                          }}
                        >
                          {loc.riskCategory}
                        </span>
                      </td>

                      {/* LIVE AIR TEMP */}
                      <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-slate-900 whitespace-nowrap">
                        {loc.temperature !== null ? `${fmtNum(loc.temperature)}°C` : <span className="text-slate-500 font-normal italic">Unavailable</span>}
                      </td>

                      {/* OUTDOOR WBGT */}
                      <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-purple-900 whitespace-nowrap">
                        {loc.wbgt !== null ? `${fmtNum(loc.wbgt)}°C` : <span className="text-slate-500 font-normal italic">Unavailable</span>}
                      </td>

                      {/* UTCI INDEX */}
                      <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-blue-900 whitespace-nowrap">
                        {loc.utci !== null ? `${fmtNum(loc.utci)}°C` : <span className="text-slate-500 font-normal italic">Unavailable</span>}
                      </td>

                      {/* INSPECT MATH BUTTON */}
                      <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIndiaLocation(loc.state, loc.district, loc.lat, loc.lon, true, 'LIVE', undefined, false, true);
                            inspectDistrict(loc);
                          }}
                          className="skeuo-btn px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition flex items-center gap-1 mx-auto bg-white border border-slate-300 text-slate-800 hover:border-blue-500 hover:text-blue-700 shadow-xs cursor-pointer active:scale-95"
                        >
                          <Cpu className="w-3 h-3 text-blue-600" /> Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION FOOTER */}
      {activeViewMode === 'districts' && totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="text-slate-700 font-semibold">
            Showing <strong className="text-slate-950 font-black">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-slate-950 font-black">{Math.min(currentPage * pageSize, filteredDistricts.length)}</strong> of{' '}
            <strong className="text-slate-950 font-black">{filteredDistricts.length}</strong> districts
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="skeuo-btn px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 disabled:opacity-40 bg-white border border-slate-300 text-slate-800 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            <span className="text-slate-900 font-black px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="skeuo-btn px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 disabled:opacity-40 bg-white border border-slate-300 text-slate-800 hover:bg-slate-100"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* DATA INTEGRITY INSPECTOR MODAL */}
      <DataIntegrityInspector
        district={selectedDistrict}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        onSyncLive={syncDistrictLive}
      />
    </div>
  );
};
