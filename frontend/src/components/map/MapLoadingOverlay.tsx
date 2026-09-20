import React, { useEffect, useState } from 'react';
import { Activity, Sparkles } from 'lucide-react';

interface Props {
  onComplete?: () => void;
}

export const MapLoadingOverlay: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    'Initializing GIS Spatial Engine...',
    'Ingesting Real-Time Environmental Telemetry...',
    'Computing WBGT, Heat Index & HTSS Risk...',
    'Rendering Municipal Ward Boundaries & Heat Layers...',
    'THERMOS Intelligence Ready!',
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 300);
    const timer2 = setTimeout(() => setStep(2), 700);
    const timer3 = setTimeout(() => setStep(3), 1100);
    const timer4 = setTimeout(() => setStep(4), 1500);
    const timer5 = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-[1000] bg-dark-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center animate-fadeOut">
      <div className="glass-card p-8 bg-dark-900/90 border-orange-500/30 rounded-3xl max-w-md w-full shadow-[0_0_50px_rgba(249,115,22,0.25)] relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 animate-pulse" />

        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/40 flex items-center justify-center mx-auto mb-4 text-orange-400 shadow-xl">
          <Activity className="w-8 h-8 animate-spin" />
        </div>

        <h3 className="text-xl font-black text-white tracking-wide uppercase flex items-center justify-center gap-2">
          <span>THERMOS GIS ENGINE</span>
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </h3>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          National Thermal Health Risk Intelligence System
        </p>

        {/* PROGRESS BAR */}
        <div className="w-full bg-dark-800 rounded-full h-2 my-5 overflow-hidden border border-dark-700">
          <div
            className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(249,115,22,0.8)]"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="min-h-[40px] flex items-center justify-center">
          <span className="text-xs font-mono font-bold text-orange-400 animate-fadeIn">
            {steps[step]}
          </span>
        </div>
      </div>
    </div>
  );
};
