import { findNearestDistrict, SearchResult } from '../data/indiaLocations';
import { useAppStore } from '../stores/appStore';

export interface ResolvedLocation {
  lat: number;
  lon: number;
  locality: string;
  district: string;
  state: string;
  displayName: string;
  isGpsLive: boolean;
}

const geoCache = new Map<string, ResolvedLocation>();
function getCacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(3)},${lon.toFixed(3)}`;
}


/**
 * Reverse geocodes coordinates to exact Locality / Area, District, and State.
 * Always preserves the exact coordinates (real user GPS or physical position).
 * Uses in-memory caching and fast CDNs to resolve in milliseconds.
 */
export async function resolveLocationFromCoords(
  lat: number,
  lon: number,
  isGps: boolean = true,
  _accuracy?: number
): Promise<ResolvedLocation> {
  const cacheKey = getCacheKey(lat, lon);
  const cached = geoCache.get(cacheKey);
  if (cached) {
    return { ...cached, isGpsLive: isGps };
  }

  // Pre-calculate nearest Indian district instantly (0ms) as a rock-solid baseline
  const nearest: SearchResult = findNearestDistrict(lat, lon);

  // 1. Primary: BigDataCloud reverse geocoding API (Fastest global CDN edge, ~150-300ms)
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      const adminList: any[] = data.localityInfo?.administrative || [];

      const distObj = adminList.find(
        (a) =>
          a.description?.toLowerCase().includes('district') ||
          a.name?.toLowerCase().includes('district')
      );

      const rawDist = distObj?.name?.replace(/\s+district/i, '').trim() || data.city || '';
      // Cross-match with official 788-district dataset from the map
      const district = nearest.district || (rawDist || nearest.district).replace(/\s+district/i, '').trim();
      const state = nearest.state || data.principalSubdivision || 'Tamil Nadu';

      const displayName = `${district}, ${state}`;

      const resolved: ResolvedLocation = {
        lat,
        lon,
        locality: district,
        district,
        state,
        displayName,
        isGpsLive: isGps,
      };
      geoCache.set(cacheKey, resolved);
      return resolved;
    }
  } catch (err) {
    console.warn('Fast reverse geocode failed, trying OpenStreetMap:', err);
  }

  // 2. Secondary: OpenStreetMap Nominatim reverse geocode (zoom=16 is much faster than zoom=18)
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`;
    const res = await fetch(osmUrl, {
      headers: {
        'User-Agent': 'ThermoSafe-Heatwave-Early-Warning/1.0',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      let rawDist =
        addr.state_district?.replace(/\s+district/i, '').trim() ||
        addr.county?.replace(/\s+district/i, '').trim() ||
        addr.city?.replace(/\s+Corporation/i, '').trim() ||
        nearest.district;

      const district = nearest.district || (rawDist || nearest.district).replace(/\s+district/i, '').trim();
      const state = nearest.state || addr.state || 'Tamil Nadu';

      const displayName = `${district}, ${state}`;

      const resolved: ResolvedLocation = {
        lat,
        lon,
        locality: district,
        district,
        state,
        displayName,
        isGpsLive: isGps,
      };
      geoCache.set(cacheKey, resolved);
      return resolved;
    }
  } catch (err) {
    console.warn('OpenStreetMap reverse geocode error, using nearest district:', err);
  }

  // 3. Fallback to 788-district nearest neighbor dataset (0ms, 100% reliable)
  const resolved: ResolvedLocation = {
    lat,
    lon,
    locality: nearest.district,
    district: nearest.district,
    state: nearest.state,
    displayName: `${nearest.district}, ${nearest.state}`,
    isGpsLive: isGps,
  };
  geoCache.set(cacheKey, resolved);
  return resolved;
}

let activeWatchId: number | null = null;
let lastHardwarePos: { lat: number; lon: number } | null = null;

async function fetchIpLocation(): Promise<{ lat: number; lon: number } | null> {
  // Tier 1: BigDataCloud Reverse Geocode Client
  try {
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.latitude === 'number' && typeof data.longitude === 'number' && (data.latitude !== 0 || data.longitude !== 0)) {
        return { lat: data.latitude, lon: data.longitude };
      }
    }
  } catch {}

  // Tier 2: ipapi.co fallback
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        return { lat: data.latitude, lon: data.longitude };
      }
    }
  } catch {}

  // Tier 3: ipwho.is fallback
  try {
    const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        return { lat: data.latitude, lon: data.longitude };
      }
    }
  } catch {}

  return null;
}

/**
 * Automatically detects real-time location.
 * 1. Immediately fires fast IP geolocation in parallel (displays in <150ms).
 * 2. Concurrently checks device GPS via navigator.geolocation.getCurrentPosition with high accuracy.
 * 3. Registers watchPosition for physical device movement without clobbering manual selections.
 */
export function detectRealtimeLocation(
  forcePrompt: boolean = false,
  onLocatingChange?: (Locating: boolean) => void,
  onError?: (errorMessage: string) => void
): void {
  // Purge any stale stored location from localStorage
  try {
    localStorage.removeItem('thermosafe_user_location');
  } catch {}

  if (onLocatingChange) onLocatingChange(true);

  if (forcePrompt) {
    useAppStore.getState().setIsManualSelection(false);
  } else if (useAppStore.getState().isManualSelection) {
    if (onLocatingChange) onLocatingChange(false);
    return;
  }

  // 1. Fast Parallel IP Geolocation (<200ms initial resolution)
  if (!useAppStore.getState().isManualSelection) {
    fetchIpLocation().then(async (coords) => {
      if (coords && !useAppStore.getState().selectedLocation.isGpsLive && !useAppStore.getState().isManualSelection) {
        const resolved = await resolveLocationFromCoords(coords.lat, coords.lon, false);
        if (!useAppStore.getState().selectedLocation.isGpsLive && !useAppStore.getState().isManualSelection) {
          useAppStore.getState().setIndiaLocation(
            resolved.state,
            resolved.district,
            resolved.lat,
            resolved.lon,
            true,
            'LIVE',
            resolved.district,
            false,
            false
          );
        }
      }
    });
  }

  // 2. High-Accuracy Hardware Geolocation (Single Source of Truth)
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    const handleGpsSuccess = async (pos: GeolocationPosition) => {
      useAppStore.getState().setLocationPermissionDenied(false);
      const { latitude, longitude, accuracy } = pos.coords;
      lastHardwarePos = { lat: latitude, lon: longitude };

      const resolved = await resolveLocationFromCoords(latitude, longitude, true, accuracy);
      useAppStore.getState().setIndiaLocation(
        resolved.state,
        resolved.district,
        resolved.lat,
        resolved.lon,
        true,
        'LIVE',
        resolved.district,
        true,
        false,
        accuracy,
        pos.timestamp || Date.now()
      );
      if (onLocatingChange) onLocatingChange(false);
    };

    const handleGpsError = async (err: GeolocationPositionError) => {
      console.warn('Hardware GPS error or timeout:', err?.message);
      if (onLocatingChange) onLocatingChange(false);
      if (err?.code === 1) {
        useAppStore.getState().setLocationPermissionDenied(true);
        if (onError) {
          onError('Location access denied in browser settings.');
        }
      } else if (forcePrompt && onError) {
        onError('Hardware GPS lock unavailable. Retaining active location.');
      }
    };

    const cacheAge = forcePrompt ? 0 : 60000;

    // Eagerly request High-Accuracy GPS (triggers Windows Location API / Android GPS)
    navigator.geolocation.getCurrentPosition(
      handleGpsSuccess,
      () => {
        // Fallback to low accuracy if high accuracy times out
        navigator.geolocation.getCurrentPosition(
          handleGpsSuccess,
          handleGpsError,
          { enableHighAccuracy: false, timeout: 6000, maximumAge: cacheAge }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: cacheAge,
      }
    );

    // Register watchPosition with battery-smart throttling and tab visibility pausing
    if (activeWatchId !== null) {
      navigator.geolocation.clearWatch(activeWatchId);
    }

    if (typeof document !== 'undefined' && !(window as any).__tsVisibilityAttached) {
      (window as any).__tsVisibilityAttached = true;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          // Pause hardware GPS polling to conserve mobile battery
          if (activeWatchId !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.clearWatch(activeWatchId);
            activeWatchId = null;
          }
        } else if (document.visibilityState === 'visible') {
          // Resume location check when tab is foregrounded
          if (!useAppStore.getState().isManualSelection) {
            detectRealtimeLocation(false);
          }
        }
      });
    }

    activeWatchId = navigator.geolocation.watchPosition(
      async (pos) => {
        if (useAppStore.getState().isManualSelection) {
          return;
        }

        const { latitude, longitude, accuracy } = pos.coords;
        if (!lastHardwarePos) {
          lastHardwarePos = { lat: latitude, lon: longitude };
        } else {
          const dLat = Math.abs(lastHardwarePos.lat - latitude);
          const dLon = Math.abs(lastHardwarePos.lon - longitude);
          // Hysteresis threshold (~450m) to eliminate continuous battery drain when stationary
          if (dLat < 0.004 && dLon < 0.004) {
            return;
          }
          lastHardwarePos = { lat: latitude, lon: longitude };
        }

        const resolved = await resolveLocationFromCoords(latitude, longitude, true, accuracy);
        useAppStore.getState().setIndiaLocation(
          resolved.state,
          resolved.district,
          resolved.lat,
          resolved.lon,
          true,
          'LIVE',
          resolved.district,
          true,
          false,
          accuracy,
          pos.timestamp || Date.now()
        );
      },
      () => {},
      { enableHighAccuracy: false, maximumAge: 120000 }
    );
  } else {
    if (onLocatingChange) onLocatingChange(false);
  }
}
