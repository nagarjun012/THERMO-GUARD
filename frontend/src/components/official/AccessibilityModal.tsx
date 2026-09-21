import React from 'react';
import { X, Globe, Eye, Keyboard, Zap, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { GOV_CONFIG } from '../../config/governmentConfig';

export const AccessibilityModal: React.FC = () => {
  const { activeOfficialModal, setActiveOfficialModal } = useAppStore();

  if (activeOfficialModal !== 'accessibility') return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 id="accessibility-modal-title" className="text-xl font-bold text-white tracking-tight">
                Accessibility Statement (WCAG 2.1 AA)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Universal Citizen Access &amp; Assistive Tech Compatibility
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
          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-blue-200 font-medium">
              We are committed to ensuring digital accessibility for all citizens, including persons with disabilities, rural users on low-bandwidth networks, and non-English speakers.
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-400" />
              1. Conformance Standards
            </h3>
            <p>
              This portal targets Level AA conformance with the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1, in accordance with the Guidelines for Indian Government Websites (GIGW 3.0).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-emerald-400" />
              2. Keyboard Navigation &amp; Screen Readers
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong className="text-slate-200">Skip to Content:</strong> Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300">Tab</kbd> on load to reveal the direct jump link to primary content.</li>
              <li><strong className="text-slate-200">Escape Key:</strong> Closes any open dialogue or emergency transparency modal.</li>
              <li><strong className="text-slate-200">ARIA Landmarks:</strong> Standard <code className="text-slate-300 bg-slate-800 px-1">banner</code>, <code className="text-slate-300 bg-slate-800 px-1">navigation</code>, <code className="text-slate-300 bg-slate-800 px-1">main</code>, and <code className="text-slate-300 bg-slate-800 px-1">contentinfo</code> roles are present throughout.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              3. Low-Bandwidth (2G/3G) &amp; High-Contrast Modes
            </h3>
            <p>
              Users in remote villages or low-connectivity zones can activate the <strong>&quot;2G / Low Data&quot;</strong> toggle in the top banner. This disables high-overhead map tiles and heavy animations, replacing them with fast textual hazard cards.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">4. Multilingual Equity</h3>
            <p>
              All emergency alerts, first-aid instructions, and risk categorizations are available in English, Tamil, and Hindi without machine-translation lag.
            </p>
          </section>

          <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800">
            Audit Conformance Target: {GOV_CONFIG.system.wcagLevel} • Status: {GOV_CONFIG.system.securityAuditStatus}
          </div>
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
