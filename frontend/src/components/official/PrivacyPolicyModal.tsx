import React from 'react';
import { X, Lock, Shield, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { GOV_CONFIG } from '../../config/governmentConfig';

export const PrivacyPolicyModal: React.FC = () => {
  const { activeOfficialModal, setActiveOfficialModal } = useAppStore();

  if (activeOfficialModal !== 'privacy') return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-xl font-bold text-white tracking-tight">
                Statutory Privacy Policy
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero-Tracking &amp; Ephemeral Telemetry Commitment
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
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-emerald-200 font-medium">
              THERMOS is designed with a strict privacy-first architecture. We do not track, profile, monetize, or sell citizen location data.
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              1. Geolocation Data Handling
            </h3>
            <p>
              When you permit your browser to share your location, coordinates (<code className="text-amber-300 bg-slate-800 px-1 py-0.5 rounded">lat, lon</code>) are processed exclusively in your client-side browser memory to query nearest weather grid cells from Open-Meteo and OpenStreetMap Nominatim.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>No GPS trajectories or travel logs are collected or saved to central database servers.</li>
              <li>Coordinates stored in your device&apos;s local storage (<code className="text-slate-300 bg-slate-800 px-1">localStorage</code>) never leave your personal browser.</li>
              <li>You may clear your stored location at any time or manually select a city name without sharing GPS.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">2. No Commercial Advertising &amp; Third-Party Trackers</h3>
            <p>
              This portal contains zero commercial advertising pixels, tracking cookies, social media tracking beacons, or cross-site analytics scripts.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">3. Open-Meteo &amp; Map Data Requests</h3>
            <p>
              Weather telemetry queries are sent to Open-Meteo APIs anonymously. Requests include latitude and longitude for weather forecasting models without transmitting any personal identifier, phone number, or user ID.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">4. Data Governance &amp; Compliance</h3>
            <p>
              In accordance with India&apos;s Digital Personal Data Protection Act (DPDP Act 2023), any future official government deployment must maintain complete audit logs and honor citizen data deletion rights.
            </p>
          </section>

          <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800">
            Version: {GOV_CONFIG.system.version} • Effective Date: {GOV_CONFIG.system.lastUpdated}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setActiveOfficialModal(null)}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
