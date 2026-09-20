import React from 'react';
import {
  Plus,
  Minus,
  Navigation,
  RotateCcw,
  Layers,
  Maximize,
  Search,
  BookOpen,
} from 'lucide-react';

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocateMe: () => void;
  onResetView: () => void;
  onToggleLayers: () => void;
  onToggleSearch: () => void;
  onOpenGuide: () => void;
}

export const MapControls: React.FC<Props> = ({
  onZoomIn,
  onZoomOut,
  onLocateMe,
  onResetView,
  onToggleLayers,
  onToggleSearch,
  onOpenGuide,
}) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.warn(err));
    } else {
      document.exitFullscreen().catch((err) => console.warn(err));
    }
  };

  return (
    <div className="absolute top-[68px] right-4 z-[450] flex flex-col gap-2 pointer-events-auto">
      {/* GLASS CONTROL PILL STACK */}
      <div className="glass-card p-1.5 bg-dark-900/90 backdrop-blur-md border border-dark-600 shadow-2xl rounded-2xl flex flex-col gap-1 text-gray-300">
        <button
          onClick={onZoomIn}
          className="p-2 rounded-xl hover:bg-dark-700 hover:text-white transition-all cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={onZoomOut}
          className="p-2 rounded-xl hover:bg-dark-700 hover:text-white transition-all cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="h-px bg-dark-700 mx-1 my-0.5" />

        <button
          onClick={onLocateMe}
          className="p-2 rounded-xl hover:bg-dark-700 hover:text-orange-400 transition-all cursor-pointer"
          title="Locate Me (GPS)"
        >
          <Navigation className="w-4 h-4" />
        </button>

        <button
          onClick={onResetView}
          className="p-2 rounded-xl hover:bg-dark-700 hover:text-orange-400 transition-all cursor-pointer"
          title="Reset View to Default"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="h-px bg-dark-700 mx-1 my-0.5" />

        <button
          onClick={onToggleLayers}
          className="p-2 rounded-xl hover:bg-dark-700 hover:text-orange-400 transition-all cursor-pointer"
          title="Layer Switcher"
        >
          <Layers className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleSearch}
          className="p-2 rounded-xl hover:bg-dark-700 hover:text-orange-400 transition-all cursor-pointer"
          title="Search Location"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl hover:bg-dark-700 hover:text-white transition-all cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-4 h-4" />
        </button>

        <div className="h-px bg-dark-700 mx-1 my-0.5" />

        <button
          onClick={onOpenGuide}
          className="p-2 rounded-xl bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white transition-all cursor-pointer"
          title="Understand This Map Guide"
        >
          <BookOpen className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
