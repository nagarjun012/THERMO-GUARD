import React from 'react';
import { X, AlertTriangle, Scale } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { GOV_CONFIG } from '../../config/governmentConfig';

export const TermsOfUseModal: React.FC = () => {
  const { activeOfficialModal, setActiveOfficialModal } = useAppStore();

  if (activeOfficialModal !== 'terms') return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 id="terms-modal-title" className="text-xl font-bold text-white tracking-tight">
                Terms of Use &amp; Statutory Disclaimer
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Public Disaster Information &amp; Operational Precedence Rules
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
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-200 font-medium">
              CRITICAL NOTICE: Official heatwave warnings issued by the India Meteorological Department (IMD) and National Disaster Management Authority (NDMA) supersede any automated algorithm scores produced on this portal.
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">1. Purpose and Permitted Use</h3>
            <p>
              THERMOS is deployed as an auxiliary early-warning and biometeorological decision-support platform. It is free for public use, citizen self-protection, and non-commercial disaster risk mitigation.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">2. Medical &amp; Clinical Disclaimer</h3>
            <p>
              Calculated Heat Thermal Stress Scores (HTSS), Wet Bulb Globe Temperature (WBGT), and Universal Thermal Climate Index (UTCI) are statistical estimates of environmental stress. They do not constitute personalized medical advice or clinical diagnosis. Anyone experiencing symptoms of heat exhaustion or heatstroke must call 108 immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">3. Third-Party Telemetry &amp; Availability</h3>
            <p>
              Weather telemetry is ingested from numerical prediction models (Open-Meteo GFS and ECMWF). System availability is provided on a best-effort public service basis. In case of network disconnection or API outage, fall back to official All India Radio, Doordarshan, and IMD press releases.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">4. No Unauthorized Misrepresentation</h3>
            <p>
              No user or organization may simulate counterfeit government badges, falsify official authority, or represent unauthorized private deployments as official state disaster portals without explicit written administrative sanctions.
            </p>
          </section>

          <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800">
            Governing Standards: Disaster Management Act 2005 &amp; NDMA Guidelines • Rev: {GOV_CONFIG.system.lastUpdated}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setActiveOfficialModal(null)}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Acknowledge &amp; Accept
          </button>
        </div>
      </div>
    </div>
  );
};
