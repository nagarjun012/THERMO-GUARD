import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, Crosshair } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { searchLocations } from '../../data/indiaLocations';
import { detectRealtimeLocation } from '../../services/locationService';

export const Header: React.FC = () => {
  const { selectedLocation, setIndiaLocation } = useAppStore();
  const [search, setSearch] = useState(selectedLocation.name);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);

  useEffect(() => {
    setSearch(selectedLocation.name);
  }, [selectedLocation.name]);

  // Automatically detect real-time GPS location on every page load
  useEffect(() => {
    detectRealtimeLocation(false, setIsLocating);
  }, []);

  const fetchRealtimeLocation = () => {
    setGpsNotice(null);
    detectRealtimeLocation(true, setIsLocating, (msg) => {
      setGpsNotice(msg);
      setTimeout(() => setGpsNotice(null), 8000);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    if (query.trim().length > 0) {
      const matches = searchLocations(query);
      setSuggestions(matches);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const selectSearchResult = (item: any) => {
    const stName = item.stateName || item.state || 'Tamil Nadu';
    const distName = item.districtName || item.district || selectedLocation.districtName || 'Karur';
    const locName = item.localityName || undefined;
    setIndiaLocation(stName, distName, item.lat, item.lon, undefined, 'LIVE', locName, true, true);
    setSearch(locName ? `${locName}, ${distName}, ${stName}` : `${distName}, ${stName}`);
    setShowDropdown(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      selectSearchResult(suggestions[0]);
    }
  };

  return (
    <header className="glass-nav border-b border-white/5 relative z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* NEUMORPHIC SUNKEN SEARCH WELL */}
        <div className="relative flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit} className="neu-well flex items-center px-3 py-1.5 transition-all focus-within:ring-2 focus-within:ring-accent/50">
            <Search className="w-4 h-4 text-orange-400 shrink-0 mr-2.5" />
            <input
              type="text"
              value={search}
              onChange={handleInputChange}
              onFocus={() => {
                if (search.trim().length > 0) {
                  setSuggestions(searchLocations(search));
                  setShowDropdown(true);
                }
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="w-full bg-transparent border-none text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none"
              placeholder="Search 788 Districts or States (e.g. Karur, Pune)..."
            />
          </form>

          {/* GLASSMORPHIC AUTOCOMPLETE FLYOUT */}
          {showDropdown && suggestions.length > 0 && (
            <div className="glass-modal absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50 max-h-64 overflow-y-auto divide-y divide-white/5 shadow-2xl animate-fadeIn">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectSearchResult(item)}
                  className="w-full px-4 py-2.5 text-left text-xs text-gray-200 hover:bg-white/10 flex justify-between items-center transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="font-bold text-white">
                      {item.localityName ? `${item.localityName}, ${item.districtName}` : (item.districtName || item.district)}
                    </span>
                    <span className="text-gray-400 text-[11px]">({item.stateName || item.state})</span>
                  </div>
                  <span className="neu-plate text-[10px] px-2 py-0.5 rounded-full text-gray-300 uppercase font-semibold">
                    {item.type || 'District'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SKEUOMORPHIC TACTILE CONTROLS */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchRealtimeLocation}
            disabled={isLocating}
            className="skeuo-btn skeuo-btn-emerald btn-shimmer px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
            title="Detect your real device GPS coordinates"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Locating GPS...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-3.5 h-3.5" />
                <span>Use My Location</span>
              </>
            )}
          </button>
        </div>
      </div>
      {gpsNotice && (
        <div className="bg-amber-500/20 border-t border-b border-amber-500/30 px-4 py-2 text-center text-xs text-amber-200 animate-fadeIn flex items-center justify-center gap-2">
          <span>{gpsNotice}</span>
          <button
            onClick={() => setGpsNotice(null)}
            className="text-amber-400 hover:text-white font-bold ml-2 px-1.5 py-0.5 rounded text-[11px] cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </header>
  );
};
