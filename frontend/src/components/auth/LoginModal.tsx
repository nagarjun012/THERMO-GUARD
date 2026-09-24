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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md perspective-container">
        {/* MODAL CARD WITH CLEAN HIGH-CONTRAST WHITE SURFACE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320, mass: 0.85 }}
          className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-900"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-600 hover:text-black hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* HEADER BRAND */}
          <div className="flex items-center gap-2.5 mb-6">
            <span className="text-2xl">🌡️</span>
            <span className="text-lg font-black tracking-tight text-slate-950 font-mono">
              THERMOSAFE PORTAL ACCESS
            </span>
          </div>

          {/* DUAL LOGIN ROLE SELECTOR TABS */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#EDF5FD] rounded-2xl border border-blue-200/80 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('user')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'user'
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'text-slate-800 hover:text-blue-700 hover:bg-white/70'
              }`}
            >
              <User className={`w-4 h-4 transition-colors ${activeTab === 'user' ? 'text-white' : 'text-slate-700'}`} />
              <span>USER LOGIN</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gov')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'gov'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-800 hover:text-black hover:bg-white/70'
              }`}
            >
              <Shield className={`w-4 h-4 transition-colors ${activeTab === 'gov' ? 'text-white' : 'text-slate-700'}`} />
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
              <div className="p-4 rounded-2xl bg-[#EDF5FD] border border-blue-200 text-slate-900 text-xs leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-black text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Citizen & Field Worker Heat Defense</span>
                </div>
                <p className="text-slate-700 text-[11px] font-semibold">
                  Access the personal Citizen Dashboard, live GIS heat risk maps, 72-hour forecasting, and actionable clinical advisories.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono font-black text-slate-950 mb-1.5 uppercase tracking-wide">
                  Your Name / Organization (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Citizen, Farmer, Field Worker..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border-2 border-slate-300 text-black placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="text-[11px] text-slate-800 font-mono space-y-1.5 font-bold">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlocked: Citizen Dashboard, Live Map, Learn, About</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                  <span className="w-4 text-center font-bold">✕</span>
                  <span>Government Portal is securely hidden</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-mono text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
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
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-black text-amber-950">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>Authorized Government & Disaster Management</span>
                </div>
                <p className="text-slate-800 text-[11px] font-semibold">
                  High-level tactical command: 788-district nationwide monitoring, municipal section 144 triggers, hospital bed capacities, and priority state heatwave response.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono font-black text-slate-950 mb-1.5 uppercase tracking-wide">
                    Official Officer ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={govId}
                      onChange={(e) => { setGovId(e.target.value); setGovError(''); }}
                      required
                      placeholder="e.g. NDMA-HQ-882"
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border-2 text-black font-mono font-bold text-sm focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-all ${
                        govError ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    <Shield className="w-4 h-4 text-slate-600 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-black text-slate-950 mb-1.5 uppercase tracking-wide">
                    Official Security Passcode
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => { setPasscode(e.target.value); setGovError(''); }}
                      required
                      placeholder="Enter official passcode..."
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border-2 text-black font-mono font-bold text-sm focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-all ${
                        govError ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    <Lock className="w-4 h-4 text-slate-600 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                  {govError && (
                    <p className="text-red-700 font-bold text-xs font-mono mt-1.5 bg-red-100 p-2 rounded-lg border border-red-300">{govError}</p>
                  )}
                </div>

                {/* AUTHORIZED CREDENTIALS AUDIT HINT */}
                <div className="p-3.5 rounded-xl bg-[#EDF5FD] border border-blue-200 text-xs font-mono text-slate-900 space-y-1">
                  <p className="text-blue-900 font-black">Authorized Test Credentials:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-800">
                    <span>Officer: <strong className="text-black font-black">NDMA-HQ-882</strong> (Pass: NDMA@Secure2026)</span>
                    <span>Admin: <strong className="text-black font-black">DISASTER-ADMIN-99</strong> (Pass: Admin@ThermoSafe2026)</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-800 font-mono space-y-1.5 font-bold">
                <div className="flex items-center gap-1.5 text-amber-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Unlocked: Gov Portal, Learn THERMOS, About</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                  <span className="w-4 text-center font-bold">✕</span>
                  <span>Citizen Dashboard & Live Map are hidden</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-mono text-sm font-bold text-white bg-slate-900 hover:bg-black shadow-md hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
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
