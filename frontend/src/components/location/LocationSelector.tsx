import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../stores/appStore';
import { INDIA_LOCATIONS, searchLocations } from '../../data/indiaLocations';
import { useThermalStress, useRisk } from '../../hooks/useApi';
import { MapPin, Search, ChevronDown, Info } from 'lucide-react';
import { getRiskColor } from '../../utils/helpers';

interface Props {
  onClose?: () => void;
}

export const LocationSelector: React.FC<Props> = ({ onClose }) => {
  const { selectedLocation, setIndiaLocation } = useAppStore();

  const [selectedState, setSelectedState] = useState<string>(
    selectedLocation.stateName || 'Tamil Nadu'
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    selectedLocation.districtName || selectedLocation.name.split(',')[0] || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Live thermal stress & risk queries for active location
  const { data: thermal } = useThermalStress();
  const { data: risk } = useRisk();

  // Find active state object
  const currentStateObj = INDIA_LOCATIONS.find((s) => s.name === selectedState);
  const availableDistricts = currentStateObj ? currentStateObj.districts : [];

  // Sync state if store changes externally
  useEffect(() => {
    if (selectedLocation.stateName) {
      setSelectedState(selectedLocation.stateName);
    }
    if (selectedLocation.districtName) {
      setSelectedDistrict(selectedLocation.districtName);
    }
  }, [selectedLocation]);

  // Handle Search Input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 0) {
      setSearchResults(searchLocations(q));
    } else {
      setSearchResults([]);
    }
  };

  // Handle State Change
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const stateObj = INDIA_LOCATIONS.find((s) => s.name === newState);
    if (stateObj && stateObj.districts.length > 0) {
      const firstDistrict = stateObj.districts[0];
      setSelectedDistrict(firstDistrict.name);
      
      // Real-time API satellite & surface telemetry status
      setIndiaLocation(
        newState,
        firstDistrict.name,
        firstDistrict.lat,
        firstDistrict.lon,
        undefined,
        'LIVE',
        undefined,
        false,
        true
      );
    }
  };

  // Handle District Change
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
    const distObj = availableDistricts.find((d) => d.name === newDistrict);
    if (distObj) {
      setIndiaLocation(
        selectedState,
        newDistrict,
        distObj.lat,
        distObj.lon,
        undefined,
        'LIVE',
        undefined,
        false,
        true
      );
    }
  };

  // Select Search Item
  const handleSelectSearchResult = (res: any) => {
    const stName = res.stateName || res.state || selectedLocation.stateName || 'Tamil Nadu';
    const distName = res.districtName || res.district || selectedLocation.districtName || res.name || '';
    const locName = res.localityName || undefined;

    setSelectedState(stName);
    setSelectedDistrict(distName);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);

    setIndiaLocation(stName, distName, res.lat, res.lon, undefined, 'LIVE', locName, false, true);
    onClose?.();
  };

  const htssScore = thermal?.htss ?? 75;
  const riskLevel = risk?.level ?? 'Moderate';
  const riskColor = getRiskColor(riskLevel);
  const dataStatus = selectedLocation.dataStatus || 'LIVE';

  return (
    <div className="p-4 sm:p-5 bg-white rounded-2xl space-y-4 text-slate-800 font-sans">
      {/* HEADER & BREADCRUMB */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-200 flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <h3 className="font-black text-slate-950 text-base tracking-tight flex items-center gap-2">
            Select Location
          </h3>
        </div>

        {/* BREADCRUMB */}
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 flex-wrap">
          <span className="text-slate-800">🇮🇳 India</span>
          <span className="text-slate-400">›</span>
          <span className="text-blue-700 font-bold">{selectedState}</span>
          <span className="text-slate-400">›</span>
          <span className="text-slate-950 font-black">{selectedDistrict}</span>
          {selectedLocation.localityName && selectedLocation.localityName !== selectedDistrict && (
            <>
              <span className="text-slate-400">›</span>
              <span className="text-emerald-700 font-black">{selectedLocation.localityName}</span>
            </>
          )}
        </div>
      </div>

      {/* SEARCH BAR INPUT */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search State, UT or District (e.g. Chennai, Coimbatore, Delhi)..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* SEARCH RESULTS DROPDOWN */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-[600] max-h-60 overflow-y-auto divide-y divide-slate-100">
            {searchResults.map((res, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSearchResult(res)}
                className="w-full p-2.5 text-left text-xs hover:bg-blue-50/80 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span className="font-bold text-slate-900">
                    {res.localityName ? `${res.localityName} (${res.districtName || res.district})` : (res.districtName || res.district)}
                  </span>
                  <span className="text-slate-500 text-[11px]">({res.stateName || res.state})</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600 uppercase font-bold border border-slate-200">
                  {res.type || 'District'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CASCADING DROPDOWNS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* STATE / UT DROPDOWN */}
        <div className="space-y-1.5">
          <label className="font-black text-slate-800 text-xs block">
            Select State / Union Territory
          </label>
          <div className="relative">
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs appearance-none cursor-pointer pr-9 transition-colors shadow-2xs"
            >
              <optgroup label="28 States">
                {INDIA_LOCATIONS.filter((s) => s.type === 'State').map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.districts.length} Districts)
                  </option>
                ))}
              </optgroup>
              <optgroup label="8 Union Territories">
                {INDIA_LOCATIONS.filter((s) => s.type === 'Union Territory').map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.districts.length} Districts)
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* DISTRICT DROPDOWN */}
        <div className="space-y-1.5">
          <label className="font-black text-slate-800 text-xs block">
            Select District
          </label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={!selectedState}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs appearance-none cursor-pointer pr-9 transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {availableDistricts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* COMPACT LOCATION SUMMARY CARD */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 text-base">{selectedDistrict}</span>
            <span className="text-slate-500 font-semibold">({selectedState})</span>
          </div>

          {/* DATA STATUS BADGE */}
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 ${
              dataStatus === 'LIVE'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {dataStatus === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />}
            {dataStatus === 'LIVE' ? 'LIVE TELEMETRY' : 'SIMULATED DATA'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Admin Level</span>
            <span className="text-slate-900 font-bold text-xs">District Administration</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Risk Assessment</span>
              <span className="font-black text-xs" style={{ color: riskColor }}>
                HTSS {htssScore} ({riskLevel})
              </span>
            </div>
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: riskColor }} />
          </div>
        </div>

        {/* DISTRICT TELEMETRY NOTICE */}
        <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
          <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span>Official district-level meteorological &amp; telemetry monitoring active.</span>
        </div>
      </div>
    </div>
  );
};
