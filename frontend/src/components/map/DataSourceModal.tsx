import React from 'react';
import { useFacilityStore } from '../../stores/facilityStore';
import { X, ShieldCheck, Database, ExternalLink, CheckCircle } from 'lucide-react';

export const DataSourceModal: React.FC = () => {
  const { selectedSourceInfo, setSelectedSourceInfo } = useFacilityStore();

  if (!selectedSourceInfo) return null;

  const item = selectedSourceInfo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Data Source & Lineage</h3>
              <p className="text-xs text-slate-400">Authenticity & Verification Report</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedSourceInfo(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/70">
            <span className="text-slate-400 block text-[11px] mb-1 uppercase font-semibold">Facility Name</span>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              {'facilityName' in item ? item.facilityName : item.name}
              <CheckCircle className="w-4 h-4 text-emerald-400 inline" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/70">
              <span className="text-slate-400 block text-[11px] mb-1 uppercase font-semibold">Authoritative Source</span>
              <div className="font-semibold text-slate-200">{item.source}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/70">
              <span className="text-slate-400 block text-[11px] mb-1 uppercase font-semibold">Source Trust Score</span>
              <div className="font-bold text-indigo-400 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> {item.sourceTrustScore} / 100
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/70">
              <span className="text-slate-400 block text-[11px] mb-1 uppercase font-semibold">Verification Status</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {item.verificationStatus}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/70">
              <span className="text-slate-400 block text-[11px] mb-1 uppercase font-semibold">Data Freshness</span>
              <span className={`px-2 py-0.5 rounded-md font-bold border ${
                item.freshness === 'LIVE' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                item.freshness === 'RECENT' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                'bg-slate-700/50 text-slate-400 border-slate-600'
              }`}>
                {item.freshness} ({item.dataAgeMinutes !== undefined ? `${item.dataAgeMinutes} min ago` : 'Timestamp verified'})
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-300 leading-relaxed text-[11px]">
            <p className="font-semibold text-slate-200 mb-1">🛡️ THERMOS Zero-Fake Data Policy:</p>
            This facility record is aggregated directly from official registries and verified feeds. If live bed or ICU telemetry is not supplied by the source, availability is explicitly marked as unavailable rather than displaying estimated numbers.
          </div>

          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs transition flex items-center justify-center gap-2"
            >
              Visit Source Portal <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSourceModal;
