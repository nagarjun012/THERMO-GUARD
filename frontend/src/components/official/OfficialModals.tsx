import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useAppStore, OfficialModalType } from '../../stores/appStore';
import { translations } from '../../i18n/translations';
import { GOV_CONFIG } from '../../config/governmentConfig';

/* ─── Shared Modal Shell ─────────────────────────────────────────────────── */
const ModalShell: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4 text-sm text-gray-300 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ─── Privacy Policy ─────────────────────────────────────────────────────── */
const PrivacyContent: React.FC = () => {
  const { language } = useAppStore();
  const tr = translations[language];
  return (
    <>
      {tr.privacy.content.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
};

/* ─── Terms of Use ───────────────────────────────────────────────────────── */
const TermsContent: React.FC = () => {
  const { language } = useAppStore();
  const tr = translations[language];
  return (
    <>
      {tr.terms.content.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
};

/* ─── Accessibility Statement ────────────────────────────────────────────── */
const AccessibilityContent: React.FC = () => {
  const { language } = useAppStore();
  const tr = translations[language];
  return (
    <>
      {tr.accessibility.content.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
};

/* ─── AI Transparency ────────────────────────────────────────────────────── */
const AiTransparencyContent: React.FC = () => {
  const { language } = useAppStore();
  const tr = translations[language];
  const model = GOV_CONFIG.htssModel;

  return (
    <>
      {/* What it does */}
      <div>
        <h3 className="text-sm font-bold text-white mb-1">{tr.ai.whatItDoes}</h3>
        <p>{tr.ai.whatItDoesDesc}</p>
      </div>

      {/* What data it uses */}
      <div>
        <h3 className="text-sm font-bold text-white mb-1">{tr.ai.whatDataItUses}</h3>
        <p>{tr.ai.whatDataItUsesDesc}</p>
      </div>

      {/* What it calculates */}
      <div>
        <h3 className="text-sm font-bold text-white mb-1">{tr.ai.whatItCalculates}</h3>
        <p>{tr.ai.whatItCalculatesDesc}</p>
        <div className="mt-2 space-y-1">
          {model.formulas.map((f) => (
            <div key={f.name} className="flex items-center gap-2 text-xs">
              <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono font-bold">
                {(f.weight * 100).toFixed(0)}%
              </span>
              <span className="text-gray-300">{f.name}</span>
              <span className="text-gray-500">— {f.reference}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How often */}
      <div>
        <h3 className="text-sm font-bold text-white mb-1">{tr.ai.howOften}</h3>
        <p>{tr.ai.howOftenDesc}</p>
      </div>

      {/* Limitations */}
      <div>
        <h3 className="text-sm font-bold text-white mb-1">{tr.ai.limitations}</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-400">
          {model.limitations.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>

      {/* Official vs AI */}
      <div className="mt-2 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <h3 className="text-sm font-bold text-amber-300 mb-2">{tr.ai.officialVsAi}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <h4 className="text-xs font-bold text-green-300 mb-1">✅ {tr.ai.officialWarning}</h4>
            <p className="text-xs text-gray-400">{tr.ai.officialWarningDesc}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <h4 className="text-xs font-bold text-blue-300 mb-1">🤖 {tr.ai.aiScore}</h4>
            <p className="text-xs text-gray-400">{tr.ai.aiScoreDesc}</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
        <h3 className="text-sm font-bold text-red-300 mb-1">⚠️ {tr.ai.disclaimer}</h3>
        <p className="text-xs text-red-200/80">{tr.ai.disclaimerText}</p>
      </div>
    </>
  );
};

/* ─── Governance ─────────────────────────────────────────────────────────── */
const GovernanceContent: React.FC = () => {
  const { language } = useAppStore();
  const tr = translations[language];

  return (
    <>
      <p className="text-gray-400">{tr.governance.subtitle}</p>
      <div className="space-y-2 mt-2">
        {tr.governance.areas.map((area, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
          >
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white">{area.name}</h4>
              <p className="text-xs text-gray-400 mt-0.5">{area.desc}</p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 whitespace-nowrap">
              {tr.governance.pending}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

/* ─── Developers ─────────────────────────────────────────────────────────── */
const DevelopersContent: React.FC = () => {
  const developers = [
    'ABINAYA RAHINI K',
    'ASHVITHA SHREE J S',
    'ASHWATH P',
    'DHARUN S J',
    'NAGARJUN S S',
    'PAVISHANA DEVI M',
  ];

  return (
    <div className="py-2">
      <ol className="divide-y divide-white/10 rounded-xl overflow-hidden bg-white/[0.03] border border-white/10">
        {developers.map((name, index) => (
          <li
            key={name}
            className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.04] transition-colors"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-400/30 text-blue-400 font-mono text-xs font-bold shrink-0">
              {index + 1}
            </span>
            <span className="text-sm font-semibold tracking-wide text-white uppercase">
              {name}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

/* ─── Master Modal Router ────────────────────────────────────────────────── */
export const OfficialModals: React.FC = () => {
  const { activeOfficialModal, setActiveOfficialModal, language } = useAppStore();
  const tr = translations[language];

  if (!activeOfficialModal) return null;

  const close = () => setActiveOfficialModal(null);

  const modalMap: Record<Exclude<OfficialModalType, null>, { title: string; content: React.ReactNode }> = {
    privacy: { title: tr.privacy.title, content: <PrivacyContent /> },
    terms: { title: tr.terms.title, content: <TermsContent /> },
    accessibility: { title: tr.accessibility.title, content: <AccessibilityContent /> },
    ai: { title: tr.ai.title, content: <AiTransparencyContent /> },
    governance: { title: tr.governance.title, content: <GovernanceContent /> },
    developers: { title: "DEVELOPER'S", content: <DevelopersContent /> },
  };

  const modal = modalMap[activeOfficialModal];
  if (!modal) return null;

  return (
    <ModalShell title={modal.title} onClose={close}>
      {modal.content}
    </ModalShell>
  );
};
