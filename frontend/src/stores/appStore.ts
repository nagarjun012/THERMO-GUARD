import { create } from 'zustand';

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

interface AppState {
  selectedLocation: Location;
  isManualSelection: boolean;
  activeScenario: string | null;
  userRole: AuthRole;
  isAuthenticated: boolean;
  sessionToken: string | null;
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
      // Immediately purge any stale Aravakurichi entries from cache
      if (
        parsed?.name?.toLowerCase().includes('arava') ||
        parsed?.localityName?.toLowerCase().includes('arava') ||
        (parsed?.lat === 10.777 && parsed?.lon === 77.9094)
      ) {
        try {
          localStorage.removeItem('thermosafe_user_location');
        } catch {}
      } else if (
        parsed &&
        typeof parsed.lat === 'number' &&
        typeof parsed.lon === 'number' &&
        !parsed.name?.includes('Central Delhi')
      ) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored location:', e);
  }

  // Default initial anchor until instant live geolocation resolves in <300ms
  return {
    lat: 13.0827,
    lon: 80.2707,
    name: 'Chennai, Tamil Nadu',
    stateName: 'Tamil Nadu',
    districtName: 'Chennai',
    localityName: 'Chennai',
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
      localStorage.setItem('thermosafe_user_location', JSON.stringify(loc));
    } catch {}
    set({ selectedLocation: loc });
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
      localStorage.setItem('thermosafe_user_location', JSON.stringify(newLoc));
    } catch {}
    set((state) => ({
      selectedLocation: newLoc,
      isManualSelection: isManual !== undefined ? isManual : state.isManualSelection,
    }));
  },
  setScenario: (id) => set({ activeScenario: id }),
}));
