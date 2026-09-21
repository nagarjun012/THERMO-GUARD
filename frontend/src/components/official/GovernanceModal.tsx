import React from 'react';
import { X, ShieldCheck, Users, Mail, Phone, Building2, FileCheck } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { GOV_CONFIG } from '../../config/governmentConfig';

export const GovernanceModal: React.FC = () => {
  const { activeOfficialModal, setActiveOfficialModal } = useAppStore();

  if (activeOfficialModal !== 'governance') return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gov-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 id="gov-modal-title" className="text-xl font-bold text-white tracking-tight">
                Governance, Accountability &amp; Contact Directory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory Agency Handover Framework &amp; Responsibility Matrix
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveOfficialModal(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-5 text-xs leading-relaxed text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold text-sm">Official Deployment Readiness Protocol</h3>
              <p className="text-slate-400 mt-1">
                To prevent fraudulent impersonation, official agency credentials, seals, and nodal officer direct contacts are populated strictly upon formal handover and MOU execution with the designated disaster management authority.
              </p>
            </div>
          </div>

          {/* Responsibility Matrix */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              Administrative Responsibility Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(GOV_CONFIG.governance).map(([key, value]) => {
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase());
                return (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
                  >
                    <span className="font-semibold text-white text-xs">{formattedKey}</span>
                    <span className="text-[11px] text-slate-400 font-mono mt-1">{value}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Citizen Grievance & Technical Feedback */}
          <section className="space-y-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-400" />
              Citizen Feedback &amp; Grievance Redressal
            </h3>
            <p className="text-slate-400">
              Citizens reporting incorrect local sensor observations, heat shelter discrepancies, or accessibility bugs may submit feedback through official disaster management nodal channels.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>State Disaster Emergency Operations Center: <strong>1070</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>District Disaster Helpline: <strong>1077</strong></span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setActiveOfficialModal(null)}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
