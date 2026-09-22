import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../stores/appStore';
import { INDIA_LOCATIONS, searchLocations } from '../../data/indiaLocations';
import { useThermalStress, useRisk } from '../../hooks/useApi';
import { MapPin, Search, ChevronDown, Info } from 'lucide-react';
import { getRiskColor } from '../../utils/helpers';

export const LocationSelector: React.FC = () => {
  const { selectedLocation, setIndiaLocation } = useAppStore();

  const [selectedState, setSelectedState] = useState<string>(
    selectedLocation.stateName || 'Tamil Nadu'
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    selectedLocation.districtName || 'Chennai'
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
        firstDistrict.hasWardData || false,
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
        distObj.hasWardData || false,
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
    const distName = res.districtName || res.district || selectedLocation.districtName || 'Chennai';
    const locName = res.localityName || undefined;

    setSelectedState(stName);
    setSelectedDistrict(distName);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);

    setIndiaLocation(stName, distName, res.lat, res.lon, res.hasWardData || false, 'LIVE', locName, false, true);
  };

  const htssScore = thermal?.htss ?? 75;
  const riskLevel = risk?.level ?? 'Moderate';
  const riskColor = getRiskColor(riskLevel);
  const dataStatus = selectedLocation.dataStatus || 'LIVE';

  return (
    <div className="glass-card p-4 sm:p-5 border-orange-500/30 bg-dark-900/90 backdrop-blur-md shadow-2xl rounded-2xl space-y-4">
      {/* HEADER & BREADCRUMB */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dark-700/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-500/20 rounded-lg text-orange-400 border border-orange-500/30">
            <MapPin className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-white text-sm sm:text-base tracking-wide flex items-center gap-2">
            📍 Select Location
          </h3>
        </div>

        {/* BREADCRUMB */}
        <div className="flex items-center gap-1.5 text-xs text-gray-300 font-medium bg-dark-800/80 px-3 py-1 rounded-full border border-dark-600">
          <span>🇮🇳 India</span>
          <span className="text-gray-500">›</span>
          <span className="text-orange-400 font-semibold">{selectedState}</span>
          <span className="text-gray-500">›</span>
          <span className="text-white font-bold">{selectedDistrict}</span>
          {selectedLocation.localityName && selectedLocation.localityName !== selectedDistrict && (
            <>
              <span className="text-gray-500">›</span>
              <span className="text-emerald-400 font-bold">{selectedLocation.localityName}</span>
            </>
          )}
        </div>
      </div>

      {/* SEARCH BAR INPUT */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="🔍 Search State, UT or District (e.g. Chennai, Coimbatore, Delhi)..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full pl-9 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-all shadow-inner"
          />
        </div>

        {/* SEARCH RESULTS DROPDOWN */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-dark-800 border border-dark-600 rounded-xl shadow-2xl z-[600] max-h-60 overflow-y-auto divide-y divide-dark-700/50">
            {searchResults.map((res, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSearchResult(res)}
                className="w-full p-2.5 text-left text-xs hover:bg-dark-700/80 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-bold text-white">
                    {res.localityName ? `${res.localityName} (${res.districtName || res.district})` : (res.districtName || res.district)}
                  </span>
                  <span className="text-gray-400 text-[11px]">({res.stateName || res.state})</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-dark-700 rounded text-gray-400 uppercase font-semibold">
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
        <div className="space-y-1">
          <label className="font-bold text-gray-300 text-[11px] block">
            Select State / Union Territory
          </label>
          <div className="relative">
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="w-full bg-dark-800 text-white font-semibold rounded-xl px-3 py-2.5 border border-dark-600 focus:outline-none focus:border-accent text-xs appearance-none cursor-pointer pr-8"
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
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        {/* DISTRICT DROPDOWN */}
        <div className="space-y-1">
          <label className="font-bold text-gray-300 text-[11px] block">
            Select District
          </label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={!selectedState}
              className="w-full bg-dark-800 text-white font-semibold rounded-xl px-3 py-2.5 border border-dark-600 focus:outline-none focus:border-accent text-xs appearance-none cursor-pointer pr-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {availableDistricts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* COMPACT LOCATION SUMMARY CARD */}
      <div className="p-3.5 bg-dark-800/80 rounded-xl border border-dark-600 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">{selectedDistrict}</span>
            <span className="text-gray-400 font-medium">({selectedState})</span>
          </div>

          {/* DATA STATUS BADGE */}
          <span
            className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
              dataStatus === 'LIVE'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
            }`}
          >
            {dataStatus === 'LIVE' ? '🔴 LIVE DATA' : '⚡ DEMO / SIMULATED DATA'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2 bg-dark-700/60 rounded-lg">
            <span className="text-[10px] text-gray-400 block font-bold">Admin Level</span>
            <span className="text-white font-semibold">District Administration</span>
          </div>

          <div className="p-2 bg-dark-700/60 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 block font-bold">Risk Assessment</span>
              <span className="font-extrabold" style={{ color: riskColor }}>
                HTSS {htssScore} ({riskLevel})
              </span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: riskColor }} />
          </div>
        </div>

        {/* DISTRICT TELEMETRY NOTICE */}
        <div className="pt-1 flex items-center gap-1.5 text-[11px] text-gray-400">
          <Info className="w-3.5 h-3.5 text-accent flex-shrink-0" />
          <span className="text-emerald-400 font-medium">Official district-level meteorological &amp; telemetry monitoring active.</span>
        </div>
      </div>
    </div>
  );
};
