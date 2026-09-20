import React, { useState } from 'react';
import { useFacilityStore } from '../../stores/facilityStore';
import { facilityService } from '../../services/facilityService';
import { X, Activity, Check, AlertCircle } from 'lucide-react';

export const HospitalAdminModal: React.FC = () => {
  const { isAdminModalOpen, setAdminModalOpen, hospitals, adminTargetFacility } = useFacilityStore();

  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(
    adminTargetFacility ? adminTargetFacility.facilityId : (hospitals[0]?.facilityId || '')
  );
  const [updatedBy, setUpdatedBy] = useState<string>('Dr. Emergency Medical Officer');
  const [emergencyAvailable, setEmergencyAvailable] = useState<boolean>(true);
  const [totalBeds, setTotalBeds] = useState<number>(100);
  const [availableBeds, setAvailableBeds] = useState<number>(25);
  const [totalICUBeds, setTotalICUBeds] = useState<number>(20);
  const [availableICUBeds, setAvailableICUBeds] = useState<number>(5);
  const [oxygenAvailable, setOxygenAvailable] = useState<boolean>(true);
  const [ambulanceAvailable, setAmbulanceAvailable] = useState<boolean>(true);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isAdminModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const success = await facilityService.submitHospitalLiveUpdate({
      facilityId: selectedFacilityId,
      updatedBy,
      emergencyAvailable,
      totalBeds: Number(totalBeds),
      availableBeds: Number(availableBeds),
      totalICUBeds: Number(totalICUBeds),
      availableICUBeds: Number(availableICUBeds),
      oxygenAvailable,
      ambulanceAvailable
    });

    setSubmitting(false);

    if (success) {
      setMessage({ type: 'success', text: 'Live hospital bed telemetry successfully broadcasted!' });
      setTimeout(() => {
        setAdminModalOpen(false);
      }, 1500);
    } else {
      setMessage({ type: 'error', text: 'Failed to update live bed status. Check credentials.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Hospital Live Telemetry Portal</h3>
              <p className="text-xs text-slate-400">Authorized Emergency Bed Broadcast</p>
            </div>
          </div>
          <button
            onClick={() => setAdminModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          {message && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-red-500/20 border-red-500/40 text-red-300'
              }`}
            >
              {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Select Hospital</label>
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
            >
              {hospitals.map((h) => (
                <option key={h.facilityId} value={h.facilityId}>
                  {h.facilityName} ({h.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Authorized Officer Identity</label>
            <input
              type="text"
              value={updatedBy}
              onChange={(e) => setUpdatedBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Available ICU Beds</label>
              <input
                type="number"
                min="0"
                value={availableICUBeds}
                onChange={(e) => setAvailableICUBeds(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-purple-300 font-bold focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Total ICU Beds</label>
              <input
                type="number"
                min="0"
                value={totalICUBeds}
                onChange={(e) => setTotalICUBeds(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Available Emergency Beds</label>
              <input
                type="number"
                min="0"
                value={availableBeds}
                onChange={(e) => setAvailableBeds(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Total Emergency Beds</label>
              <input
                type="number"
                min="0"
                value={totalBeds}
                onChange={(e) => setTotalBeds(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-4 py-2 border-t border-b border-slate-800">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={emergencyAvailable}
                onChange={(e) => setEmergencyAvailable(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              Emergency Open
            </label>
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={oxygenAvailable}
                onChange={(e) => setOxygenAvailable(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              Medical Oxygen Ready
            </label>
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={ambulanceAvailable}
                onChange={(e) => setAmbulanceAvailable(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              Ambulance Active
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
          >
            {submitting ? 'Broadcasting Live Telemetry...' : 'Broadcast Real-Time Live Bed Status'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HospitalAdminModal;
