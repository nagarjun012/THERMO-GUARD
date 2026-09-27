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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white border border-blue-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 id="accessibility-modal-title" className="text-lg sm:text-xl font-black text-slate-950 tracking-tight font-mono">
                Accessibility Statement (WCAG 2.1 AA)
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Universal Citizen Access &amp; Assistive Tech Compatibility
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
        <div className="space-y-4 text-xs leading-relaxed text-slate-600">
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-blue-950 font-semibold">
              We are committed to ensuring digital accessibility for all citizens, including persons with disabilities, rural users on low-bandwidth networks, and non-English speakers.
            </p>
          </div>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-500" />
              1. Conformance Standards
            </h3>
            <p>
              This portal targets Level AA conformance with the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1, in accordance with the Guidelines for Indian Government Websites (GIGW 3.0).
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-emerald-600" />
              2. Keyboard Navigation &amp; Screen Readers
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong className="text-slate-900">Skip to Content:</strong> Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-slate-800 font-bold">Tab</kbd> on load to reveal the direct jump link to primary content.</li>
              <li><strong className="text-slate-900">Escape Key:</strong> Closes any open dialogue or emergency transparency modal.</li>
              <li><strong className="text-slate-900">ARIA Landmarks:</strong> Standard <code className="text-slate-800 bg-slate-100 border border-slate-200 px-1 py-0.5 rounded font-mono">banner</code>, <code className="text-slate-800 bg-slate-100 border border-slate-200 px-1 py-0.5 rounded font-mono">navigation</code>, <code className="text-slate-800 bg-slate-100 border border-slate-200 px-1 py-0.5 rounded font-mono">main</code>, and <code className="text-slate-800 bg-slate-100 border border-slate-200 px-1 py-0.5 rounded font-mono">contentinfo</code> roles are present throughout.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              3. Low-Bandwidth (2G/3G) &amp; High-Contrast Modes
            </h3>
            <p>
              Users in remote villages or low-connectivity zones can activate the <strong>&quot;2G / Low Data&quot;</strong> toggle in the top banner. This disables high-overhead map tiles and heavy animations, replacing them with fast textual hazard cards.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-900">4. Multilingual Equity</h3>
            <p>
              All emergency alerts, first-aid instructions, and risk categorizations are available in English, Tamil, and Hindi without machine-translation lag.
            </p>
          </section>

          <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200 font-medium">
            Audit Conformance Target: {GOV_CONFIG.system.wcagLevel} • Status: {GOV_CONFIG.system.securityAuditStatus}
          </div>
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
