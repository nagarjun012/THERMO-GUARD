import { create } from 'zustand';

import { Language } from '../i18n/translations';

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
  language: Language;
  lowBandwidthMode: boolean;
  highContrastMode: boolean;
  activeOfficialModal: OfficialModalType;
  setLanguage: (lang: Language) => void;
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
  setScenario: (id: string | null) => void;
}

const getInitialRole = (): AuthRole => {
  try {
    const saved = localStorage.getItem('thermosafe_auth_role');
    const token = localStorage.getItem('thermosafe_session_token');
    if ((saved === 'gov' || saved === 'user') && token) return saved;
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
      // Immediately purge any stale Aravakurichi or Karur entries from cache
      const isStale =
        parsed?.name?.toLowerCase().includes('arava') ||
        parsed?.localityName?.toLowerCase().includes('arava') ||
        parsed?.districtName?.toLowerCase().includes('arava') ||
        parsed?.name?.toLowerCase().includes('karur') ||
        parsed?.localityName?.toLowerCase().includes('karur') ||
        parsed?.districtName?.toLowerCase().includes('karur') ||
        (typeof parsed?.lat === 'number' && Math.abs(parsed.lat - 10.777) < 0.05) ||
        (typeof parsed?.lat === 'number' && Math.abs(parsed.lat - 10.96) < 0.05);

      if (isStale) {
        try {
          localStorage.removeItem('thermosafe_user_location');
        } catch {}
      } else if (
        parsed &&
        typeof parsed.lat === 'number' &&
        typeof parsed.lon === 'number' &&
        parsed.isManual === true &&
        !parsed.name?.includes('Central Delhi')
      ) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored location:', e);
  }

  // Initial placeholder until instant live OpenStreetMap geolocation resolves in <300ms
  return {
    lat: 13.0827,
    lon: 80.2707,
    name: 'Detecting live location...',
    stateName: '',
    districtName: '',
    localityName: '',
    hasWardData: true,
    dataStatus: 'LIVE',
    isGpsLive: true,
  };
};

export const useAppStore = create<AppState>((set) => ({
  selectedLocation: getInitialLocation(),
  isManualSelection: false,
  activeScenario: null,
  userRole: getInitialRole(),
  isAuthenticated: getInitialAuth(),
  sessionToken: getInitialToken(),
  language: getInitialLanguage(),
  lowBandwidthMode: getInitialLowBandwidth(),
  highContrastMode: getInitialHighContrast(),
  activeOfficialModal: null,
  setLanguage: (lang) => {
    try {
      localStorage.setItem('thermosafe_language', lang);
    } catch {}
    set({ language: lang });
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
    const token = generateSessionToken();
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

    const hasLoc =
      localityName &&
      localityName.trim().length > 0 &&
      localityName.toLowerCase() !== districtName.toLowerCase();

    const displayName = hasLoc
      ? `${localityName}, ${districtName}, ${stateName}`
      : `${districtName}, ${stateName}`;

    const newLoc: Location = {
      lat: finalLat,
      lon: finalLon,
      name: displayName,
      stateName,
      districtName,
      localityName: localityName || undefined,
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
