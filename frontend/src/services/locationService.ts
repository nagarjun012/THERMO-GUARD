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
 * Reverse geocodes coordinates to exact Locality / Taluk, District, and State.
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

      const talukObj = adminList.find(
        (a) =>
          a.description?.toLowerCase().includes('taluk') ||
          a.description?.toLowerCase().includes('town') ||
          a.name?.toLowerCase().includes('taluk')
      );

      const distObj = adminList.find(
        (a) =>
          a.description?.toLowerCase().includes('district') ||
          a.name?.toLowerCase().includes('district')
      );

      const rawLocality =
        data.city ||
        data.locality ||
        talukObj?.name ||
        '';

      const rawDist = distObj?.name?.replace(/\s+district/i, '').trim() || data.city || '';
      const district = (rawDist || nearest.district).replace(/\s+district/i, '').trim();
      const state = data.principalSubdivision || nearest.state;

      const cleanLocality = rawLocality
        ? rawLocality.replace(/\s+taluk/i, '').replace(/\s+district/i, '').replace(/\s+town/i, '').trim()
        : '';
      const hasLocality = cleanLocality.length > 0 && cleanLocality.toLowerCase() !== district.toLowerCase();
      const displayName = hasLocality
        ? `${cleanLocality}, ${district}, ${state}`
        : `${district}, ${state}`;

      const resolved: ResolvedLocation = {
        lat,
        lon,
        locality: hasLocality ? cleanLocality : district,
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

      const rawLocality =
        addr.suburb ||
        addr.town ||
        addr.village ||
        addr.neighbourhood ||
        addr.residential ||
        addr.city_district ||
        addr.city ||
        '';

      let rawDist =
        addr.state_district?.replace(/\s+district/i, '').trim() ||
        addr.county?.replace(/\s+district/i, '').trim() ||
        addr.city?.replace(/\s+Corporation/i, '').trim() ||
        nearest.district;

      const district = (rawDist || nearest.district).replace(/\s+district/i, '').trim();
      const state = addr.state || nearest.state;

      const cleanLocality = rawLocality
        ? rawLocality.replace(/\s+taluk/i, '').replace(/\s+district/i, '').replace(/\s+town/i, '').trim()
        : '';
      const hasLocality = cleanLocality.length > 0 && cleanLocality.toLowerCase() !== district.toLowerCase();
      const displayName = hasLocality
        ? `${cleanLocality}, ${district}, ${state}`
        : `${district}, ${state}`;

      const resolved: ResolvedLocation = {
        lat,
        lon,
        locality: hasLocality ? cleanLocality : district,
        district,
        state,
        displayName: displayName || `${district}, ${state}`,
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

/**
 * Automatically detects real-time location.
 * 1. Immediately fires fast IP geolocation in parallel (displays in <150ms).
 * 2. Concurrently checks device GPS via navigator.geolocation.getCurrentPosition with cached position.
 * 3. Registers watchPosition for physical device movement without clobbering manual selections.
 */
export function detectRealtimeLocation(
  forcePrompt: boolean = false,
  onLocatingChange?: (Locating: boolean) => void,
  onError?: (errorMessage: string) => void
): void {
  if (onLocatingChange) onLocatingChange(true);

  if (forcePrompt) {
    useAppStore.getState().setIsManualSelection(false);
  } else if (useAppStore.getState().isManualSelection) {
    if (onLocatingChange) onLocatingChange(false);
    return;
  }

  // Fast Client IP Geolocation (<200ms quick-fill before browser GPS resolves)
  if (!useAppStore.getState().isManualSelection) {
    fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', { signal: AbortSignal.timeout(2500) })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (
          typeof data.latitude === 'number' &&
          typeof data.longitude === 'number' &&
          !useAppStore.getState().selectedLocation.isGpsLive
        ) {
          const resolved = await resolveLocationFromCoords(data.latitude, data.longitude, false);
          if (!useAppStore.getState().selectedLocation.isGpsLive && !useAppStore.getState().isManualSelection) {
            useAppStore.getState().setIndiaLocation(
              resolved.state,
              resolved.district,
              resolved.lat,
              resolved.lon,
              true,
              'LIVE',
              resolved.locality && resolved.locality.toLowerCase() !== resolved.district.toLowerCase() ? resolved.locality : undefined,
              false,
              false
            );
          }
        }
      })
      .catch(() => {});
  }

  // Browser GPS / Hardware Geolocation (Single Source of Truth)
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    const handleGpsSuccess = async (pos: GeolocationPosition) => {
      useAppStore.getState().setLocationPermissionDenied(false);
      const { latitude, longitude, accuracy } = pos.coords;
      lastHardwarePos = { lat: latitude, lon: longitude };

      // Concurrently resolve exact location (taluk / town / district / state)
      const resolved = await resolveLocationFromCoords(latitude, longitude, true, accuracy);
      useAppStore.getState().setIndiaLocation(
        resolved.state,
        resolved.district,
        resolved.lat,
        resolved.lon,
        true,
        'LIVE',
        resolved.locality && resolved.locality.toLowerCase() !== resolved.district.toLowerCase() ? resolved.locality : undefined,
        true,
        false
      );
      if (onLocatingChange) onLocatingChange(false);
    };

    const handleGpsError = async (err: GeolocationPositionError) => {
      console.warn('Browser GPS lock unavailable or timed out:', err?.message);
      if (onLocatingChange) onLocatingChange(false);
      if (err?.code === 1) {
        useAppStore.getState().setLocationPermissionDenied(true);
        if (onError) {
          onError('Location permission denied. Please allow location access in your browser address bar.');
        }
      } else if (forcePrompt && onError) {
        if (err?.code === 3) {
          onError('GPS signal timed out. Retaining last verified location.');
        } else {
          onError('Hardware GPS lock unavailable. Retaining last verified location.');
        }
      }
    };

    // Use cached position if available within last 5 minutes (0ms return)
    const cacheAge = forcePrompt ? 0 : 300000;

    // Fast-path: Standard accuracy Wi-Fi/cellular triangulation returns in <300ms without 5s desktop hang
    navigator.geolocation.getCurrentPosition(
      handleGpsSuccess,
      () => {
        // If standard accuracy timed out, try high accuracy if forcePrompt
        if (forcePrompt) {
          navigator.geolocation.getCurrentPosition(
            handleGpsSuccess,
            handleGpsError,
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        } else {
          handleGpsError({ code: 3, message: 'GPS timeout' } as any);
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 3500,
        maximumAge: cacheAge,
      }
    );

    // If user explicitly pressed "Use My Location", concurrently request high-accuracy GPS refinement
    if (forcePrompt) {
      navigator.geolocation.getCurrentPosition(
        handleGpsSuccess,
        () => {},
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
      );
    }

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
          resolved.locality && resolved.locality.toLowerCase() !== resolved.district.toLowerCase() ? resolved.locality : undefined,
          true,
          false
        );
      },
      () => {},
      { enableHighAccuracy: false, maximumAge: 120000 }
    );
  } else {
    if (onLocatingChange) onLocatingChange(false);
  }
}
