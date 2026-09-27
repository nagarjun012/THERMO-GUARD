import React from 'react';
import { useFacilityStore } from '../../stores/facilityStore';
import { X, ShieldCheck, Database, ExternalLink, CheckCircle } from 'lucide-react';

export const DataSourceModal: React.FC = () => {
  const { selectedSourceInfo, setSelectedSourceInfo } = useFacilityStore();

  if (!selectedSourceInfo) return null;

  const item = selectedSourceInfo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-blue-200/90 rounded-2xl p-6 shadow-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Data Source & Lineage</h3>
              <p className="text-xs text-slate-500">Authenticity & Verification Report</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedSourceInfo(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
            <span className="text-slate-500 block text-[11px] mb-1 uppercase font-semibold">Facility Name</span>
            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
              {'facilityName' in item ? item.facilityName : item.name}
              <CheckCircle className="w-4 h-4 text-emerald-600 inline" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-slate-500 block text-[11px] mb-1 uppercase font-semibold">Authoritative Source</span>
              <div className="font-semibold text-slate-800">{item.source}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-slate-500 block text-[11px] mb-1 uppercase font-semibold">Source Trust Score</span>
              <div className="font-bold text-blue-600 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> {item.sourceTrustScore} / 100
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-slate-500 block text-[11px] mb-1 uppercase font-semibold">Verification Status</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                {item.verificationStatus}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-slate-500 block text-[11px] mb-1 uppercase font-semibold">Data Freshness</span>
              <span className={`px-2 py-0.5 rounded-md font-bold border ${
                item.freshness === 'LIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                item.freshness === 'RECENT' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {item.freshness} ({item.dataAgeMinutes !== undefined ? `${item.dataAgeMinutes} min ago` : 'Timestamp verified'})
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 text-slate-700 leading-relaxed text-[11px]">
            <p className="font-semibold text-blue-900 mb-1">🛡️ THERMOS Zero-Fake Data Policy:</p>
            This facility record is aggregated directly from official registries and verified feeds. If live bed or ICU telemetry is not supplied by the source, availability is explicitly marked as unavailable rather than displaying estimated numbers.
          </div>

          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition flex items-center justify-center gap-2 shadow-xs"
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
