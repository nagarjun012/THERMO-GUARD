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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white border border-blue-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 id="gov-modal-title" className="text-lg sm:text-xl font-black text-slate-950 tracking-tight font-mono">
                Governance, Accountability &amp; Contact Directory
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Statutory Agency Handover Framework &amp; Responsibility Matrix
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveOfficialModal(null)}
            className="p-2 rounded-xl text-slate-500 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-5 text-xs leading-relaxed text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-slate-900 font-black text-sm">Official Deployment Readiness Protocol</h3>
              <p className="text-slate-500 font-medium mt-1">
                To prevent fraudulent impersonation, official agency credentials, seals, and nodal officer direct contacts are populated strictly upon formal handover and MOU execution with the designated disaster management authority.
              </p>
            </div>
          </div>

          {/* Responsibility Matrix */}
          <section className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-500" />
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
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-2xs"
                  >
                    <span className="font-bold text-slate-900 text-xs">{formattedKey}</span>
                    <span className="text-[11px] text-slate-600 font-mono font-medium mt-1">{value}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Citizen Grievance & Technical Feedback */}
          <section className="space-y-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-600" />
              Citizen Feedback &amp; Grievance Redressal
            </h3>
            <p className="text-slate-600">
              Citizens reporting incorrect local sensor observations, heat shelter discrepancies, or accessibility bugs may submit feedback through official disaster management nodal channels.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-slate-800 text-xs font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>State Disaster Emergency Operations Center: <strong className="font-mono text-slate-950">1070</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>District Disaster Helpline: <strong className="font-mono text-slate-950">1077</strong></span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setActiveOfficialModal(null)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
