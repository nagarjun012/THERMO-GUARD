import React, { useState, useEffect } from 'react';
import { Search, X, Layers, Cpu, Bell, ArrowRight } from 'lucide-react';
import { useIndustrialStore } from '../../stores/industrialStore';
import { useNavigate } from 'react-router-dom';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchModalOpen, setSearchModalOpen, zones, sensors, alerts } =
    useIndustrialStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredZones = zones.filter(
    (z) => z.name.toLowerCase().includes(q) || z.sensorId.toLowerCase().includes(q)
  );

  const filteredSensors = sensors.filter(
    (s) => s.id.toLowerCase().includes(q) || s.model.toLowerCase().includes(q) || s.zoneName.toLowerCase().includes(q)
  );

  const filteredAlerts = alerts.filter(
    (a) => a.title.toLowerCase().includes(q) || a.zoneName.toLowerCase().includes(q)
  );

  const handleSelectZone = () => {
    setSearchModalOpen(false);
    navigate('/zones');
  };

  const handleSelectSensor = () => {
    setSearchModalOpen(false);
    navigate('/devices');
  };

  const handleSelectAlert = () => {
    setSearchModalOpen(false);
    navigate('/alerts');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150"
    >
      <div className="bg-industrial-850 border border-industrial-700 rounded-lg max-w-xl w-full shadow-2xl overflow-hidden text-industrial-100">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-industrial-700 flex items-center gap-2.5 bg-industrial-900">
          <Search className="w-4 h-4 text-industrial-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search zones, sensors, alerts, hardware ID... (e.g. Boiler, TS-104)"
            className="w-full bg-transparent text-sm text-industrial-50 placeholder-industrial-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-industrial-400 hover:text-industrial-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="px-1.5 py-0.5 rounded text-[10px] font-mono text-industrial-400 border border-industrial-750 hover:bg-industrial-800"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3 text-xs">
          {/* Heat Zones */}
          <div>
            <div className="px-2 py-1 text-[10px] uppercase font-bold text-industrial-400 tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-industrial-400" />
              <span>Heat Zones ({filteredZones.length})</span>
            </div>
            {filteredZones.length === 0 ? (
              <div className="px-2 py-1 text-industrial-500 text-[11px]">No matching zones.</div>
            ) : (
              filteredZones.map((zone) => (
                <div
                  key={zone.id}
                  onClick={handleSelectZone}
                  className="px-2.5 py-2 rounded hover:bg-industrial-800 cursor-pointer flex items-center justify-between text-industrial-200 group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-industrial-100">{zone.name}</span>
                    <span className="text-[10px] font-mono text-industrial-400">({zone.sensorId})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums font-bold text-industrial-50">
                      {zone.currentTemp.toFixed(1)}°C
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        zone.status === 'SAFE'
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-amber-950 text-amber-300'
                      }`}
                    >
                      {zone.status}
                    </span>
                    <ArrowRight className="w-3 h-3 text-industrial-500 group-hover:text-industrial-200" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sensors */}
          <div className="border-t border-industrial-750 pt-2">
            <div className="px-2 py-1 text-[10px] uppercase font-bold text-industrial-400 tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-industrial-400" />
              <span>Sensors & Probes ({filteredSensors.length})</span>
            </div>
            {filteredSensors.length === 0 ? (
              <div className="px-2 py-1 text-industrial-500 text-[11px]">No matching hardware.</div>
            ) : (
              filteredSensors.map((sensor) => (
                <div
                  key={sensor.id}
                  onClick={handleSelectSensor}
                  className="px-2.5 py-2 rounded hover:bg-industrial-800 cursor-pointer flex items-center justify-between text-industrial-200 group transition-colors"
                >
                  <div>
                    <div className="font-mono font-semibold text-industrial-100">{sensor.id}</div>
                    <div className="text-[10px] text-industrial-400">{sensor.zoneName} — {sensor.model}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-emerald-400">{sensor.status}</span>
                    <ArrowRight className="w-3 h-3 text-industrial-500 group-hover:text-industrial-200" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Alerts */}
          <div className="border-t border-industrial-750 pt-2">
            <div className="px-2 py-1 text-[10px] uppercase font-bold text-industrial-400 tracking-wider flex items-center gap-1.5">
              <Bell className="w-3 h-3 text-industrial-400" />
              <span>Safety Alerts ({filteredAlerts.length})</span>
            </div>
            {filteredAlerts.length === 0 ? (
              <div className="px-2 py-1 text-industrial-500 text-[11px]">No matching alerts.</div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={handleSelectAlert}
                  className="px-2.5 py-2 rounded hover:bg-industrial-800 cursor-pointer flex items-center justify-between text-industrial-200 group transition-colors"
                >
                  <div className="truncate max-w-[360px]">
                    <span className="font-semibold text-industrial-100">{alert.title}</span>
                    <div className="text-[10px] text-industrial-400">{alert.zoneName} • {alert.detectedAt}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-amber-400">{alert.severity}</span>
                    <ArrowRight className="w-3 h-3 text-industrial-500 group-hover:text-industrial-200" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-industrial-900 border-t border-industrial-700 flex items-center justify-between text-[11px] text-industrial-400">
          <span>Navigate with mouse or keyboard</span>
          <span className="font-mono">ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
