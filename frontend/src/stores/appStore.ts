import { create } from 'zustand';

import { Language } from '../i18n/translations';
import { VulnerabilityProfile } from '../utils/thermalEngine';

export interface Location {
  lat: number;
  lon: number;
  name: string;
  stateName?: string;
  districtName?: string;
  localityName?: string;
  dataStatus?: 'LIVE' | 'DEMO' | 'LIMITED' | 'UNAVAILABLE';
  isGpsLive?: boolean;
}

export interface UserProfile {
  userId: string;
  name: string;
  department?: string;
  role: 'CITIZEN' | 'OFFICER' | 'ADMIN';
}

export type AuthRole = 'user' | 'gov';
export type OfficialModalType = 'privacy' | 'terms' | 'accessibility' | 'ai' | 'governance' | null;

interface AppState {
  selectedLocation: Location;
  isManualSelection: boolean;
  activeScenario: string | null;
  userRole: AuthRole;
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  isAuthChecking: boolean;
  vulnerabilityProfile: VulnerabilityProfile;
  language: Language;
  lowBandwidthMode: boolean;
  highContrastMode: boolean;
  activeOfficialModal: OfficialModalType;
  setLanguage: (lang: Language) => void;
  setVulnerabilityProfile: (profile: VulnerabilityProfile) => void;
  setLowBandwidthMode: (enabled: boolean) => void;
  toggleLowBandwidthMode: () => void;
  setHighContrastMode: (enabled: boolean) => void;
  toggleHighContrastMode: () => void;
  setActiveOfficialModal: (modal: OfficialModalType) => void;
  setUserRole: (role: AuthRole) => void;
  checkServerSession: () => Promise<boolean>;
  loginCitizen: (name?: string) => Promise<boolean>;
  loginOfficer: (officerId: string, passcode: string) => Promise<{ success: boolean; error?: string }>;
  loginAs: (role: AuthRole) => void;
  logout: () => Promise<void>;
  setLocation: (loc: Location) => void;
  setIsManualSelection: (manual: boolean) => void;
  setIndiaLocation: (
    stateName: string,
    districtName: string,
    lat: number,
    lon: number,
    _legacyUnused?: any,
    dataStatus?: 'LIVE' | 'DEMO' | 'LIMITED' | 'UNAVAILABLE',
    localityName?: string,
    isGpsLive?: boolean,
    isManual?: boolean
  ) => void;
  locationPermissionDenied: boolean;
  setLocationPermissionDenied: (denied: boolean) => void;
  setScenario: (id: string | null) => void;
}

const getInitialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem('thermosafe_language');
    if (saved === 'en' || saved === 'ta' || saved === 'hi') return saved;
  } catch {}
  return 'en';
};

const getInitialLowBandwidth = (): boolean => {
  try {
    return localStorage.getItem('thermosafe_low_bandwidth') === 'true';
  } catch {}
  return false;
};

const getInitialHighContrast = (): boolean => {
  try {
    return localStorage.getItem('thermosafe_high_contrast') === 'true';
  } catch {}
  return false;
};

const getInitialLocation = (): Location => {
  try {
    const saved = localStorage.getItem('thermosafe_user_location');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        parsed &&
        typeof parsed.lat === 'number' &&
        typeof parsed.lon === 'number' &&
        parsed.name &&
        !parsed.name.includes('Detecting live')
      ) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored location:', e);
  }

  // Baseline initial location (auto-updated by real-time GPS / IP pipeline on load)
  return {
    lat: 13.0827,
    lon: 80.2707,
    name: 'Chennai, Tamil Nadu',
    stateName: 'Tamil Nadu',
    districtName: 'Chennai',
    localityName: 'Chennai',
    dataStatus: 'LIVE',
    isGpsLive: false,
  };
};

const getInitialIsManual = (): boolean => {
  try {
    const saved = localStorage.getItem('thermosafe_user_location');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed?.isManual === true;
    }
  } catch {}
  return false;
};

const getInitialProfile = (): VulnerabilityProfile => {
  try {
    const saved = localStorage.getItem('thermosafe_user_profile') as VulnerabilityProfile;
    if (saved === 'OUTDOOR_LABORER' || saved === 'ELDERLY_VULNERABLE' || saved === 'PREGNANT_OR_CHILD' || saved === 'GENERAL_CITIZEN') {
      return saved;
    }
  } catch {}
  return 'GENERAL_CITIZEN';
};

export const useAppStore = create<AppState>((set, get) => ({
  selectedLocation: getInitialLocation(),
  isManualSelection: getInitialIsManual(),
  activeScenario: null,
  userRole: 'user',
  isAuthenticated: false,
  currentUser: null,
  isAuthChecking: true,
  vulnerabilityProfile: getInitialProfile(),
  language: getInitialLanguage(),
  lowBandwidthMode: getInitialLowBandwidth(),
  highContrastMode: getInitialHighContrast(),
  activeOfficialModal: null,
  locationPermissionDenied: false,
  setLocationPermissionDenied: (denied) => set({ locationPermissionDenied: denied }),
  setLanguage: (lang) => {
    try {
      localStorage.setItem('thermosafe_language', lang);
    } catch {}
    set({ language: lang });
  },
  setVulnerabilityProfile: (profile) => {
    try {
      localStorage.setItem('thermosafe_user_profile', profile);
    } catch {}
    set({ vulnerabilityProfile: profile });
  },
  setLowBandwidthMode: (enabled) => {
    try {
      localStorage.setItem('thermosafe_low_bandwidth', String(enabled));
    } catch {}
    set({ lowBandwidthMode: enabled });
  },
  toggleLowBandwidthMode: () => {
    set((state) => {
      const next = !state.lowBandwidthMode;
      try {
        localStorage.setItem('thermosafe_low_bandwidth', String(next));
      } catch {}
      return { lowBandwidthMode: next };
    });
  },
  setHighContrastMode: (enabled) => {
    try {
      localStorage.setItem('thermosafe_high_contrast', String(enabled));
    } catch {}
    set({ highContrastMode: enabled });
  },
  toggleHighContrastMode: () => {
    set((state) => {
      const next = !state.highContrastMode;
      try {
        localStorage.setItem('thermosafe_high_contrast', String(next));
      } catch {}
      return { highContrastMode: next };
    });
  },
  setActiveOfficialModal: (modal) => set({ activeOfficialModal: modal }),
  setIsManualSelection: (manual) => set({ isManualSelection: manual }),
  setUserRole: (role) => set({ userRole: role }),

  checkServerSession: async () => {
    try {
      const res = await fetch('/api/auth', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          set({
            isAuthenticated: true,
            userRole: data.role || 'user',
            currentUser: data.user,
            isAuthChecking: false,
          });
          return true;
        }
      }
    } catch (e) {
      console.warn('Session check failed:', e);
    }
    set({
      isAuthenticated: false,
      userRole: 'user',
      currentUser: null,
      isAuthChecking: false,
    });
    return false;
  },

  loginCitizen: async (name?: string) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ role: 'user', citizenName: name }),
      });
      if (res.ok) {
        const data = await res.json();
        set({
          isAuthenticated: true,
          userRole: 'user',
          currentUser: data.user,
        });
        return true;
      }
    } catch (e) {
      console.warn('Citizen login error:', e);
    }
    return false;
  },

  loginOfficer: async (officerId: string, passcode: string) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ officerId, passcode }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'authenticated') {
        set({
          isAuthenticated: true,
          userRole: 'gov',
          currentUser: data.user,
        });
        return { success: true };
      }
      return { success: false, error: data.message || 'Authentication failed' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Server connection failed' };
    }
  },

  loginAs: (role) => {
    if (role === 'user') {
      get().loginCitizen();
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth?action=logout', { method: 'POST', credentials: 'same-origin' });
    } catch {}
    try {
      localStorage.removeItem('thermosafe_auth_role');
      localStorage.removeItem('thermosafe_session_token');
    } catch {}
    set({ userRole: 'user', isAuthenticated: false, currentUser: null });
  },
  setLocation: (loc) => {
    try {
      localStorage.setItem('thermosafe_user_location', JSON.stringify({ ...loc, isManual: true }));
    } catch {}
    set({ selectedLocation: loc, isManualSelection: true });
  },
  setIndiaLocation: (
    stateName,
    districtName,
    lat,
    lon,
    _legacyUnused,
    dataStatus = 'LIVE',
    localityName,
    isGpsLive = true,
    isManual
  ) => {
    // Preserve genuine coordinates (real user GPS or selected district coordinates)
    const finalLat = lat;
    const finalLon = lon;

    // Clean up localityName (strip trailing 'taluk', 'district', 'town', whitespace)
    const cleanLoc = localityName
      ? localityName.replace(/\s+taluk/i, '').replace(/\s+district/i, '').replace(/\s+town/i, '').trim()
      : undefined;

    const hasLoc =
      cleanLoc &&
      cleanLoc.length > 0 &&
      cleanLoc.toLowerCase() !== districtName.toLowerCase();

    let displayName = districtName;
    if (hasLoc && stateName) {
      displayName = `${cleanLoc}, ${districtName}, ${stateName}`;
    } else if (hasLoc) {
      displayName = `${cleanLoc}, ${districtName}`;
    } else if (stateName && stateName.toLowerCase() !== districtName.toLowerCase()) {
      displayName = `${districtName}, ${stateName}`;
    }

    const newLoc: Location = {
      lat: finalLat,
      lon: finalLon,
      name: displayName,
      stateName,
      districtName,
      localityName: cleanLoc || undefined,
      dataStatus,
      isGpsLive,
    };
    try {
      localStorage.setItem('thermosafe_user_location', JSON.stringify({ ...newLoc, isManual }));
    } catch {}
    set((state) => ({
      selectedLocation: newLoc,
      isManualSelection: isManual !== undefined ? isManual : state.isManualSelection,
    }));
  },
  setScenario: (id) => set({ activeScenario: id }),
}));
