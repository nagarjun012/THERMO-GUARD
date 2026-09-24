import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const { loginOfficer, loginCitizen } = useAppStore();
  const [activeTab, setActiveTab] = useState<AuthRole>(initialRole);

  // Form states
  const [userName, setUserName] = useState('');
  const [govId, setGovId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [govError, setGovError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialRole);
      setGovError('');
      setIsSubmitting(false);
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGovError('');

    if (activeTab === 'gov') {
      if (!govId.trim()) {
        setGovError('Officer ID is required for Government access');
        setIsSubmitting(false);
        return;
      }
      if (!passcode.trim()) {
        setGovError('Security Passcode is required for Government access');
        setIsSubmitting(false);
        return;
      }

      const res = await loginOfficer(govId.trim(), passcode.trim());
      if (!res.success) {
        setGovError(res.error || 'Authentication failed. Please verify Officer ID and Passcode.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess('gov');
      } else {
        navigate('/government');
      }
      onClose();
    } else {
      await loginCitizen(userName.trim() || undefined);
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess('user');
      } else {
        navigate('/dashboard');
      }
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md perspective-container">
        {/* MODAL CARD WITH 3D DEPTH & ENTRANCE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18, rotateX: 2.5 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12, rotateX: -1 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320, mass: 0.85 }}
          className="relative w-full max-w-lg neu-card border border-white/10 border-t-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden bg-gradient-to-b from-[#131b2e] to-[#090d16]"
        >
          {/* AMBIENT BACKGROUND GLOW WITH ORGANIC GENTLE FLOAT */}
          <div
            className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 animate-ambient-slow ${
              activeTab === 'gov' ? 'bg-amber-500' : 'bg-blue-500'
            }`}
          />
          <div
            className={`absolute -bottom-24 -left-24 w-60 h-60 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-700 animate-ambient-reverse ${
              activeTab === 'gov' ? 'bg-orange-500' : 'bg-cyan-500'
            }`}
          />

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* HEADER BRAND */}
          <div className="flex items-center gap-2.5 mb-6">
            <span className="text-2xl drop-shadow-[0_2px_8px_rgba(249,115,22,0.4)]">🌡️</span>
            <span className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 font-mono">
              THERMOSAFE PORTAL ACCESS
            </span>
          </div>

          {/* DUAL LOGIN ROLE SELECTOR TABS (REFINED INTENTIONAL COLORS) */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-dark-950/90 rounded-2xl border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('user')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'user'
                  ? 'bg-gradient-to-b from-blue-500/25 via-blue-600/15 to-blue-700/20 text-blue-200 border border-blue-400/50 shadow-[0_2px_12px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] -translate-y-0.5'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 active:translate-y-0'
              }`}
            >
              <User className={`w-4 h-4 transition-colors ${activeTab === 'user' ? 'text-blue-400' : 'text-gray-400'}`} />
              <span>USER LOGIN</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gov')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'gov'
                  ? 'bg-gradient-to-b from-amber-500/25 via-amber-600/15 to-amber-700/20 text-amber-200 border border-amber-400/50 shadow-[0_2px_12px_rgba(245,158,11,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] -translate-y-0.5'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 active:translate-y-0'
              }`}
            >
              <Shield className={`w-4 h-4 transition-colors ${activeTab === 'gov' ? 'text-amber-400' : 'text-gray-400'}`} />
              <span>GOV LOGIN</span>
            </button>
          </div>

          {/* TAB 1: USER LOGIN CONTENT */}
          {activeTab === 'user' && (
            <motion.form
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-blue-200 text-xs leading-relaxed space-y-1 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
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
                  className="w-full px-4 py-3 rounded-xl bg-[#090d16] border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/25 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                  style={{ backgroundColor: '#090d16', color: '#ffffff' }}
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
                className="w-full py-3.5 px-6 rounded-xl font-mono text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_4px_20px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>ENTER CITIZEN DASHBOARD</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          )}

          {/* TAB 2: GOV LOGIN CONTENT */}
          {activeTab === 'gov' && (
            <motion.form
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-amber-200 text-xs leading-relaxed space-y-1 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
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
                      onChange={(e) => { setGovId(e.target.value); setGovError(''); }}
                      required
                      placeholder="e.g. NDMA-HQ-882"
                      className={`w-full px-4 py-3 rounded-xl bg-[#090d16] border text-amber-300 font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/25 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] ${
                        govError ? 'border-red-500/50' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: '#090d16', color: '#fcd34d' }}
                    />
                    <Shield className="w-4 h-4 text-amber-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-gray-300 mb-1.5 uppercase">
                    Official Security Passcode
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => { setPasscode(e.target.value); setGovError(''); }}
                      required
                      placeholder="Enter official passcode..."
                      className={`w-full px-4 py-3 rounded-xl bg-[#090d16] border text-amber-300 font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/25 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] ${
                        govError ? 'border-red-500/50' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: '#090d16', color: '#fcd34d' }}
                    />
                    <Lock className="w-4 h-4 text-amber-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                  {govError && (
                    <p className="text-red-400 text-[10px] font-mono mt-1.5 bg-red-500/10 p-2 rounded-lg border border-red-500/20">{govError}</p>
                  )}
                </div>

                {/* AUTHORIZED CREDENTIALS AUDIT HINT */}
                <div className="p-3 rounded-xl bg-dark-950/90 border border-white/5 text-[11px] font-mono text-gray-400 space-y-1">
                  <p className="text-amber-400/90 font-bold">Authorized Test Credentials:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] text-gray-300">
                    <span>Officer: <strong className="text-white">NDMA-HQ-882</strong> (Pass: NDMA@Secure2026)</span>
                    <span>Admin: <strong className="text-white">DISASTER-ADMIN-99</strong> (Pass: Admin@ThermoSafe2026)</span>
                  </div>
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
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-mono text-sm font-bold text-dark-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-[0_4px_20px_rgba(245,158,11,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'VALIDATING CREDENTIALS...' : 'ACCESS GOVERNMENT PORTAL'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
