import React from 'react';
import { useAppStore } from '../../stores/appStore';
import { translations } from '../../i18n/translations';
import { GOV_CONFIG } from '../../config/governmentConfig';

export const OfficialFooter: React.FC = () => {
  const { language, setActiveOfficialModal } = useAppStore();
  const tr = translations[language];

  const policyLinks = [
    { label: tr.footer.privacyPolicy, modal: 'privacy' as const },
    { label: tr.footer.termsOfUse, modal: 'terms' as const },
    { label: tr.footer.accessibilityStatement, modal: 'accessibility' as const },
    { label: tr.footer.aiTransparency, modal: 'ai' as const },
    { label: tr.footer.governanceContact, modal: 'governance' as const },
    { label: tr.footer.developers, modal: 'developers' as const },
  ];

  return (
    <footer
      className="w-full border-t border-blue-200/60 mt-8 bg-white/75 backdrop-blur-md text-slate-600 shadow-sm safe-bottom"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Top row: Agency name + last updated */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{GOV_CONFIG.agency.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{GOV_CONFIG.agency.department}</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <span>{tr.footer.lastUpdated}: </span>
            <span className="font-mono font-bold text-slate-800">{GOV_CONFIG.system.lastUpdated}</span>
            <span className="block mt-0.5 font-semibold text-blue-600">v{GOV_CONFIG.system.version}</span>
          </div>
        </div>

        {/* Policy links */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-blue-100 pt-3">
          {policyLinks.map((link) => (
            <button
              key={link.modal}
              onClick={() => setActiveOfficialModal(link.modal)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400 rounded-sm"
              type="button"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Data sources */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 border-t border-white/5 pt-3">
          <span className="font-semibold text-gray-400">{tr.footer.dataSources}:</span>
          <a
            href={GOV_CONFIG.dataSources.weather.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            {GOV_CONFIG.dataSources.weather.name} ({GOV_CONFIG.dataSources.weather.license})
          </a>
          <a
            href={GOV_CONFIG.dataSources.maps.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            {GOV_CONFIG.dataSources.maps.name} ({GOV_CONFIG.dataSources.maps.license})
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-gray-500 italic border-t border-white/5 pt-3">
          {tr.footer.disclaimer}
        </p>
      </div>
    </footer>
  );
};
