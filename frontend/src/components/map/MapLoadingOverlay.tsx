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
    'Rendering District Heat Risk Zones & Telemetry Layers...',
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
    <div className="absolute inset-0 z-[1000] bg-slate-900/30 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeOut">
      <div className="p-8 bg-white border border-blue-200/90 rounded-3xl max-w-md w-full shadow-[0_20px_50px_rgba(20,80,180,0.15)] relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500" />

        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto mb-4 text-orange-600 shadow-sm">
          <Activity className="w-8 h-8 animate-spin text-orange-600" />
        </div>

        <h3 className="text-xl font-black text-slate-900 tracking-wide uppercase flex items-center justify-center gap-2 font-mono">
          <span>THERMOS GIS ENGINE</span>
          <Sparkles className="w-5 h-5 text-amber-500" />
        </h3>
        <p className="text-xs text-slate-600 font-semibold mt-1">
          National Thermal Health Risk Intelligence System
        </p>

        {/* PROGRESS BAR */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 my-5 overflow-hidden border border-slate-200">
          <div
            className="bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 h-full rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="min-h-[40px] flex items-center justify-center">
          <span className="text-xs font-mono font-bold text-orange-600 animate-fadeIn">
            {steps[step]}
          </span>
        </div>
      </div>
    </div>
  );
};
