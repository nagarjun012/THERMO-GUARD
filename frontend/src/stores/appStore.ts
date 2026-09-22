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
  hasWardData?: boolean;
  dataStatus?: 'LIVE' | 'DEMO' | 'LIMITED' | 'UNAVAILABLE';
  isGpsLive?: boolean;
}

export type AuthRole = 'user' | 'gov';
export type OfficialModalType = 'privacy' | 'terms' | 'accessibility' | 'ai' | 'governance' | null;

interface AppState {
  selectedLocation: Location;
  isManualSelection: boolean;
  activeScenario: string | null;
  userRole: AuthRole;
  isAuthenticated: boolean;
  sessionToken: string | null;
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
  loginAs: (role: AuthRole) => void;
  logout: () => void;
  setLocation: (loc: Location) => void;
  setIsManualSelection: (manual: boolean) => void;
  setIndiaLocation: (
    stateName: string,
    districtName: string,
    lat: number,
    lon: number,
    hasWardData?: boolean,
    dataStatus?: 'LIVE' | 'DEMO' | 'LIMITED' | 'UNAVAILABLE',
    localityName?: string,
    isGpsLive?: boolean,
    isManual?: boolean
  ) => void;
  locationPermissionDenied: boolean;
  setLocationPermissionDenied: (denied: boolean) => void;
  setScenario: (id: string | null) => void;
}

const GOV_TOKEN_PREFIX = 'TS-SECURE-GOV-';

function isValidGovSession(token: string | null): boolean {
  return Boolean(token && token.startsWith(GOV_TOKEN_PREFIX) && token.length > 24);
}

const getInitialRole = (): AuthRole => {
  try {
    const saved = localStorage.getItem('thermosafe_auth_role');
    const token = localStorage.getItem('thermosafe_session_token');
    if (saved === 'gov' && isValidGovSession(token)) return 'gov';
    if (saved === 'user' && token) return 'user';
  } catch {}
  return 'user';
};

const getInitialAuth = (): boolean => {
  try {
    const token = localStorage.getItem('thermosafe_session_token');
    return Boolean(token && token.length > 0);
  } catch {}
  return false;
};

const getInitialToken = (): string | null => {
  try {
    return localStorage.getItem('thermosafe_session_token') || null;
  } catch {}
  return null;
};

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

function generateSessionToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
}

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

  // Initial fallback to Karur, Tamil Nadu
  return {
    lat: 10.9601,
    lon: 78.0766,
    name: 'Karur, Tamil Nadu',
    stateName: 'Tamil Nadu',
    districtName: 'Karur',
    localityName: 'Karur',
    hasWardData: true,
    dataStatus: 'LIVE',
    isGpsLive: true,
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

export const useAppStore = create<AppState>((set) => ({
  selectedLocation: getInitialLocation(),
  isManualSelection: getInitialIsManual(),
  activeScenario: null,
  userRole: getInitialRole(),
  isAuthenticated: getInitialAuth(),
  sessionToken: getInitialToken(),
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
  setUserRole: (role) => {
    try {
      localStorage.setItem('thermosafe_auth_role', role);
    } catch {}
    set({ userRole: role });
  },
  loginAs: (role) => {
    const token = role === 'gov'
      ? `${GOV_TOKEN_PREFIX}${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 14)}`
      : generateSessionToken();
    try {
      localStorage.setItem('thermosafe_auth_role', role);
      localStorage.setItem('thermosafe_session_token', token);
    } catch {}
    set({ userRole: role, isAuthenticated: true, sessionToken: token });
  },
  logout: () => {
    try {
      localStorage.removeItem('thermosafe_auth_role');
      localStorage.removeItem('thermosafe_session_token');
    } catch {}
    set({ userRole: 'user', isAuthenticated: false, sessionToken: null });
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
    hasWardData = true,
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
      hasWardData,
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
