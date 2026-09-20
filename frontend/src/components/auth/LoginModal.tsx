import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, AuthRole } from '../../stores/appStore';
import { Shield, User, X, CheckCircle2, ArrowRight, Building2, Lock, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  initialRole?: AuthRole;
  onClose: () => void;
  onSuccess?: (role: AuthRole) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  initialRole = 'user',
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { setUserRole } = useAppStore();
  const [activeTab, setActiveTab] = useState<AuthRole>(initialRole);

  // Form states
  const [userName, setUserName] = useState('');
  const [govId, setGovId] = useState('NDMA-HQ-882');
  const [department, setDepartment] = useState('National Disaster Management Authority');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialRole);
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(activeTab);
    if (onSuccess) {
      onSuccess(activeTab);
    } else {
      if (activeTab === 'gov') {
        navigate('/government');
      } else {
        navigate('/dashboard');
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* MODAL CARD */}
      <div className="relative w-full max-w-lg neu-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden bg-gradient-to-b from-dark-800 to-dark-900">
        {/* AMBIENT BACKGROUND GLOW */}
        <div
          className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-500 ${
            activeTab === 'gov' ? 'bg-amber-500' : 'bg-blue-500'
          }`}
        />

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER BRAND */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🌡️</span>
          <span className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 font-mono">
            THERMOSAFE PORTAL ACCESS
          </span>
        </div>

        {/* DUAL LOGIN ROLE SELECTOR TABS */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-dark-950/80 rounded-2xl border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('user')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all duration-200 ${
              activeTab === 'user'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>USER LOGIN</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gov')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all duration-200 ${
              activeTab === 'gov'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>GOV LOGIN</span>
          </button>
        </div>

        {/* TAB 1: USER LOGIN CONTENT */}
        {activeTab === 'user' && (
          <form onSubmit={handleLogin} className="space-y-5 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-blue-200 text-xs leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-400">
                <Sparkles className="w-4 h-4" />
                <span>Citizen & Field Worker Heat Defense</span>
              </div>
              <p className="text-gray-300 text-[11px]">
                Access the personal Citizen Dashboard, live GIS heat risk maps, 72-hour forecasting, and actionable clinical advisories.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 mb-1.5 uppercase">
                Your Name / Organization (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Citizen, Farmer, Field Worker..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-950/80 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="text-[11px] text-gray-400 font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Unlocked: Citizen Dashboard, Live Map, Learn, About</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <span className="w-3.5 text-center font-bold">✕</span>
                <span>Government Portal is securely hidden</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-mono text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>ENTER CITIZEN DASHBOARD</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        {/* TAB 2: GOV LOGIN CONTENT */}
        {activeTab === 'gov' && (
          <form onSubmit={handleLogin} className="space-y-5 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-amber-200 text-xs leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Building2 className="w-4 h-4" />
                <span>Authorized Government & Disaster Management</span>
              </div>
              <p className="text-gray-300 text-[11px]">
                High-level tactical command: 788-district nationwide monitoring, municipal section 144 triggers, hospital bed capacities, and priority state heatwave response.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-bold text-gray-300 mb-1.5 uppercase">
                  Official Officer ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={govId}
                    onChange={(e) => setGovId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-dark-950/80 border border-white/10 text-amber-300 font-mono text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <Lock className="w-4 h-4 text-amber-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-gray-300 mb-1.5 uppercase">
                  Department / Authority
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="text-[11px] text-gray-400 font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Unlocked: Gov Portal, Learn THERMOS, About</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <span className="w-3.5 text-center font-bold">✕</span>
                <span>Citizen Dashboard & Live Map are hidden</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-mono text-sm font-bold text-dark-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>ACCESS GOVERNMENT PORTAL</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
