import React from 'react';
import { Phone, Wifi, WifiOff, Globe } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { translations, LANGUAGE_NAMES, Language } from '../../i18n/translations';
import { GOV_CONFIG } from '../../config/governmentConfig';

export const OfficialTopBanner: React.FC = () => {
  const { language, setLanguage, lowBandwidthMode, toggleLowBandwidthMode } = useAppStore();
  const tr = translations[language];

  return (
    <>
      {/* Accessibility: skip-to-content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-yellow-400 focus:text-black focus:rounded-lg focus:font-bold focus:text-sm focus:outline-none focus:ring-2 focus:ring-black"
      >
        {tr.nav.skipToContent}
      </a>

      <div
        className="w-full border-b border-white/10 text-xs"
        style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.85) 100%)' }}
        role="banner"
        aria-label="Official utility bar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          {/* Left: Emergency helplines */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 font-semibold text-red-300">
              <Phone className="w-3 h-3" aria-hidden="true" />
              <span>{tr.banner.emergencyHelplines}:</span>
            </span>
            {GOV_CONFIG.emergencyHelplines.slice(0, 3).map((h) => (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-200 hover:bg-red-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all font-mono font-bold shadow-sm"
                title={`${h.label}: ${h.description}`}
                aria-label={`Call ${h.label} at ${h.number}. ${h.description}`}
              >
                {h.number}
              </a>
            ))}
          </div>

          {/* Right: Language + Low Bandwidth + Readiness */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-gray-400" aria-hidden="true" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border border-white/10 rounded-md px-1.5 py-0.5 text-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                aria-label={tr.banner.language}
              >
                {(Object.keys(LANGUAGE_NAMES) as Language[]).map((lang) => (
                  <option key={lang} value={lang} className="bg-gray-900 text-gray-200">
                    {LANGUAGE_NAMES[lang]}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={toggleLowBandwidthMode}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-semibold transition-colors cursor-pointer ${
                lowBandwidthMode
                  ? 'bg-green-500/15 border-green-500/30 text-green-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'
              }`}
              aria-label={tr.nav.lowBandwidth}
              aria-pressed={lowBandwidthMode}
              title={tr.nav.lowBandwidth}
            >
              {lowBandwidthMode ? (
                <WifiOff className="w-3 h-3" aria-hidden="true" />
              ) : (
                <Wifi className="w-3 h-3" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{tr.nav.lowBandwidth}</span>
            </button>


          </div>
        </div>
      </div>
    </>
  );
};
