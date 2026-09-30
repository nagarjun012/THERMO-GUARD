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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-blue-200/90 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl text-slate-800 space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 id="ai-modal-title" className="text-lg sm:text-xl font-black text-slate-950 tracking-tight font-mono">
                AI Transparency &amp; Model Formulation
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Scientific Derivation, Input Telemetry, and Mathematical Boundaries
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveOfficialModal(null)}
            className="p-2 rounded-xl text-slate-500 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-5 text-xs leading-relaxed text-slate-600">
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <p className="text-purple-950 font-semibold">
              HTSS (Heat Thermal Stress Score) is a multi-parameter physiological index that evaluates true biometeorological load rather than relying on thermometer air temperature alone.
            </p>
          </div>

          {/* Model Weights Table */}
          <section className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" />
              1. Mathematical Formulation &amp; Weights
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-3.5">
              <table className="w-full text-left text-xs min-w-[320px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                    <th className="pb-2 whitespace-nowrap">Constituent Index</th>
                    <th className="pb-2">Authoritative Reference</th>
                    <th className="pb-2 text-right whitespace-nowrap">Composite Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {GOV_CONFIG.htssModel.formulas.map((formula) => (
                    <tr key={formula.name}>
                      <td className="py-2.5 text-slate-900 font-bold whitespace-nowrap">{formula.name}</td>
                      <td className="py-2.5 text-slate-600 font-medium pr-2">{formula.reference}</td>
                      <td className="py-2.5 text-right font-mono font-black text-blue-700 whitespace-nowrap">
                        {Math.round(formula.weight * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Auxiliary formulations: Wet Bulb temperature derived via Stull (2011) psychrometric equation; Heat Index computed via NOAA Rothfusz (1990) 9-term polynomial.
            </p>
          </section>

          {/* Inputs Ingested */}
          <section className="space-y-2">
            <h3 className="text-sm font-black text-slate-900">2. Ingested Meteorological Telemetry</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-600">
              <li className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="font-bold text-slate-900 block">Dry-Bulb Air Temperature (2m):</span> Base kinetic thermal energy.
              </li>
              <li className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="font-bold text-slate-900 block">Relative Humidity (%):</span> Governs evaporative sweat dissipation potential.
              </li>
              <li className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="font-bold text-slate-900 block">Shortwave Solar Radiation (W/m²):</span> Direct radiative photon load on human skin.
              </li>
              <li className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="font-bold text-slate-900 block">Wind Speed (10m):</span> Convective cooling boundary layer modifier.
              </li>
            </ul>
          </section>

          {/* Explicit Model Limitations */}
          <section className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              3. Explicit Known Limitations
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              {GOV_CONFIG.htssModel.limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </section>

          {/* Human in the loop */}
          <section className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              4. Human-in-the-Loop Operational Safeguards
            </h3>
            <p>
              In government deployment, HTSS serves as an advisory decision-support feed. Critical civic alerts (Red / Extreme heatwaves triggering school closures or construction halts) must be verified and ratified by the authorized District Magistrate / Nodal Health Officer before statutory enforcement.
            </p>
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
