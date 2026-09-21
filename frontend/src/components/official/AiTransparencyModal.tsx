import React from 'react';
import { X, Cpu, CheckCircle2, AlertTriangle, BookOpen, Layers } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { GOV_CONFIG } from '../../config/governmentConfig';

export const AiTransparencyModal: React.FC = () => {
  const { activeOfficialModal, setActiveOfficialModal } = useAppStore();

  if (activeOfficialModal !== 'ai') return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 id="ai-modal-title" className="text-xl font-bold text-white tracking-tight">
                AI Transparency &amp; Model Formulation
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Scientific Derivation, Input Telemetry, and Mathematical Boundaries
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
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-purple-200 font-medium">
              HTSS (Heat Thermal Stress Score) is a multi-parameter physiological index that evaluates true biometeorological load rather than relying on thermometer air temperature alone.
            </p>
          </div>

          {/* Model Weights Table */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              1. Mathematical Formulation &amp; Weights
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-semibold">Constituent Index</th>
                    <th className="pb-2 font-semibold">Authoritative Reference</th>
                    <th className="pb-2 font-semibold text-right">Composite Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {GOV_CONFIG.htssModel.formulas.map((formula) => (
                    <tr key={formula.name}>
                      <td className="py-2 text-white font-medium">{formula.name}</td>
                      <td className="py-2 text-slate-400">{formula.reference}</td>
                      <td className="py-2 text-right font-mono text-amber-300">
                        {Math.round(formula.weight * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Auxiliary formulations: Wet Bulb temperature derived via Stull (2011) psychrometric equation; Heat Index computed via NOAA Rothfusz (1990) 9-term polynomial.
            </p>
          </section>

          {/* Inputs Ingested */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">2. Ingested Meteorological Telemetry</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <li className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="font-semibold text-white">Dry-Bulb Air Temperature (2m):</span> Base kinetic thermal energy.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="font-semibold text-white">Relative Humidity (%):</span> Governs evaporative sweat dissipation potential.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="font-semibold text-white">Shortwave Solar Radiation (W/m²):</span> Direct radiative photon load on human skin.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="font-semibold text-white">Wind Speed (10m):</span> Convective cooling boundary layer modifier.
              </li>
            </ul>
          </section>

          {/* Explicit Model Limitations */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              3. Explicit Known Limitations
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              {GOV_CONFIG.htssModel.limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </section>

          {/* Human in the loop */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              4. Human-in-the-Loop Operational Safeguards
            </h3>
            <p>
              In government deployment, HTSS serves as an advisory decision-support feed. Critical civic alerts (Red / Extreme heatwaves triggering school closures or construction halts) must be verified and ratified by the authorized District Magistrate / Nodal Health Officer before statutory enforcement.
            </p>
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
