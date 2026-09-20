import { Facility, CoolingCentre, FreshnessStats } from '../types/facility';

// All /api/* calls go to Vercel Serverless Functions (same origin)
const API_BASE = '/api';

export const facilityService = {
  async getNearbyFacilities(lat: number, lon: number, radiusKm = 25, state?: string, district?: string): Promise<{
    hospitals: Facility[];
    coolingCentres: CoolingCentre[];
  }> {
    try {
      let url = `${API_BASE}/facilities/nearby?lat=${lat}&lon=${lon}&radius_km=${radiusKm}`;
      if (state) url += `&state=${encodeURIComponent(state)}`;
      if (district) url += `&district=${encodeURIComponent(district)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return {
        hospitals: data.hospitals || [],
        coolingCentres: data.coolingCentres || [],
      };
    } catch (err) {
      console.warn('Facility API unavailable:', err);
      return { hospitals: [], coolingCentres: [] };
    }
  },

  async getAllHospitals(state?: string, district?: string): Promise<Facility[]> {
    try {
      const params = new URLSearchParams();
      if (state) params.append('state', state);
      if (district) params.append('district', district);
      const url = `${API_BASE}/facilities/hospitals${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch hospitals:', err);
      return [];
    }
  },

  async getAllCoolingCentres(state?: string, district?: string): Promise<CoolingCentre[]> {
    try {
      const params = new URLSearchParams();
      if (state) params.append('state', state);
      if (district) params.append('district', district);
      const url = `${API_BASE}/facilities/cooling-centres${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch cooling centres:', err);
      return [];
    }
  },

  async getDataFreshness(): Promise<FreshnessStats | null> {
    try {
      const res = await fetch(`${API_BASE}/health/data-freshness`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async submitHospitalLiveUpdate(payload: {
    facilityId: string;
    updatedBy: string;
    emergencyAvailable: boolean;
    totalBeds?: number;
    availableBeds?: number;
    totalICUBeds?: number;
    availableICUBeds?: number;
    oxygenAvailable?: boolean;
    ambulanceAvailable?: boolean;
  }): Promise<boolean> {
    try {
      // Auth token should be passed via header, not in request body.
      // The backend /api/admin/hospital/update endpoint must verify this token.
      const sessionToken = localStorage.getItem('thermosafe_session_token') || '';
      const res = await fetch(`${API_BASE}/admin/hospital/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
