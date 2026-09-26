import React from 'react';
import { useDemoScenarios, useActivateScenario } from '../../hooks/useApi';
import { useAppStore } from '../../stores/appStore';
import * as Icons from 'lucide-react';

export const DemoScenarioSelector: React.FC = () => {
  const { data: scenarios } = useDemoScenarios();
  const { mutate: activate } = useActivateScenario();
  const activeScenario = useAppStore((s) => s.activeScenario);
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`skeuo-btn btn-shimmer px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
          activeScenario
            ? 'skeuo-btn-amber shadow-[0_0_14px_rgba(245,158,11,0.5)]'
            : 'skeuo-btn-dark'
        }`}
      >
        <Icons.Sliders className="w-3.5 h-3.5" />
        <span>{activeScenario ? 'DEMO MODE' : 'Simulations'}</span>
      </button>

      {isOpen && (
        <div className="glass-modal absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn border border-white/10">
          <div className="p-3 bg-dark-950/80 border-b border-white/5 flex justify-between items-center">
            <span className="text-xs font-bold tracking-wider text-gray-300 uppercase font-mono">
              Simulation Preset
            </span>
            {activeScenario && (
              <button
                onClick={() => {
                  activate('reset');
                  setIsOpen(false);
                }}
                className="text-[11px] font-bold text-red-400 hover:text-red-300 underline cursor-pointer"
              >
                Reset Live
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
            {scenarios?.map((s) => {
              const Icon =
                (Icons[s.icon as keyof typeof Icons] as React.ElementType) || Icons.Activity;
              const isActive = activeScenario === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    activate(s.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 flex items-start gap-3 hover:bg-white/5 transition-colors cursor-pointer ${
                    isActive ? 'bg-orange-500/15 border-l-4 border-orange-500' : ''
                  }`}
                >
                  <div
                    className={`mt-0.5 p-1.5 rounded-lg neu-well ${
                      isActive ? 'text-orange-400' : 'text-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        isActive ? 'text-orange-300' : 'text-gray-200'
                      }`}
                    >
                      {s.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{s.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
