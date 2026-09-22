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

      const locality =
        data.locality ||
        data.city ||
        talukObj?.name ||
        '';

      const rawDist = distObj?.name?.replace(/\s+district/i, '').trim() || data.city || '';
      const district = rawDist || nearest.district;
      const state = data.principalSubdivision || nearest.state;

      const hasLocality = locality && locality.toLowerCase() !== district.toLowerCase();
      const displayName = hasLocality
        ? `${locality}, ${district}, ${state}`
        : `${district}, ${state}`;

      const resolved: ResolvedLocation = {
        lat,
        lon,
        locality: hasLocality ? locality : district,
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

      const locality =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.village ||
        addr.town ||
        addr.city_district ||
        addr.city ||
        '';

      let district =
        addr.state_district?.replace(/\s+district/i, '').trim() ||
        addr.county?.replace(/\s+district/i, '').trim() ||
        addr.city ||
        nearest.district;

      const state = addr.state || nearest.state;
      const hasLocality = locality && locality.toLowerCase() !== district.toLowerCase();
      const displayName = hasLocality
        ? `${locality}, ${district}, ${state}`
        : `${district}, ${state}`;

      const resolved: ResolvedLocation = {
        lat,
        lon,
        locality: hasLocality ? locality : district,
        district,
        state,
        displayName: displayName || data.display_name?.split(',').slice(0, 3).join(', ') || `${district}, ${state}`,
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

  let hasResolvedGps = false;

  // STEP 1: Fast Parallel IP Geolocation (instant response ~150ms)
  fallbackToIpOrKnownLocation(() => hasResolvedGps).then(() => {
    if (!hasResolvedGps && onLocatingChange) {
      onLocatingChange(false);
    }
  });

  // STEP 2: Browser GPS / Hardware Geolocation
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    const handleGpsSuccess = async (pos: GeolocationPosition) => {
      hasResolvedGps = true;
      const { latitude, longitude, accuracy } = pos.coords;
      lastHardwarePos = { lat: latitude, lon: longitude };

      // Immediately apply instant local district matching (0ms) so user gets instant response
      const nearest = findNearestDistrict(latitude, longitude);
      useAppStore.getState().setIndiaLocation(
        nearest.state,
        nearest.district,
        latitude,
        longitude,
        nearest.hasWardData ?? true,
        'LIVE',
        undefined,
        true,
        false
      );
      if (onLocatingChange) onLocatingChange(false);

      // Concurrently refine with fine locality/street name (from cache or fast reverse geocode)
      const resolved = await resolveLocationFromCoords(latitude, longitude, true, accuracy);
      if (resolved.locality && resolved.locality !== nearest.district) {
        useAppStore.getState().setIndiaLocation(
          resolved.state,
          resolved.district,
          resolved.lat,
          resolved.lon,
          true,
          'LIVE',
          resolved.locality,
          true,
          false
        );
      }
    };

    const handleGpsError = async (err: GeolocationPositionError) => {
      console.warn('Browser GPS lock unavailable or timed out:', err.message);
      if (!hasResolvedGps) {
        await fallbackToIpOrKnownLocation(() => hasResolvedGps);
      }
      if (onLocatingChange) onLocatingChange(false);
      if (forcePrompt && onError) {
        if (err.code === 1) {
          onError('Browser location access is blocked. Please allow Location permission in your address bar (tune/lock icon) to enable GPS precision.');
        } else if (err.code === 3) {
          onError('GPS signal timed out. High-accuracy network/IP location was applied.');
        } else {
          onError('Hardware GPS lock unavailable. Network/IP location was applied.');
        }
      }
    };

    // Use cached position if available within last 5 minutes (0ms return)
    const cacheAge = forcePrompt ? 0 : 300000;
    const primaryTimeout = forcePrompt ? 4000 : 3500;

    // First attempt: High accuracy GPS
    navigator.geolocation.getCurrentPosition(
      handleGpsSuccess,
      () => {
        // Fallback attempt: Standard accuracy resolves rapidly via Wi-Fi/cellular
        navigator.geolocation.getCurrentPosition(
          handleGpsSuccess,
          handleGpsError,
          { enableHighAccuracy: false, timeout: 3000, maximumAge: cacheAge }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: primaryTimeout,
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
          resolved.locality,
          true,
          false
        );
      },
      () => {},
      { enableHighAccuracy: false, maximumAge: 120000 }
    );
  }
}

/**
 * Fast IP geolocation fallback to detect the user's real city/coordinates instantly (~150ms).
 */
async function fallbackToIpOrKnownLocation(isGpsAlreadyResolved?: () => boolean): Promise<void> {
  if (useAppStore.getState().isManualSelection) return;

  // 1. Primary: ipwho.is (fastest, high reliability in India, CORS-friendly ~150ms)
  try {
    const res = await fetch('https://ipwho.is/', {
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      const d = await res.json();
      if (d.success !== false && d.latitude && d.longitude && (!isGpsAlreadyResolved || !isGpsAlreadyResolved())) {
        const nearest = findNearestDistrict(d.latitude, d.longitude);
        const city = d.city || nearest.district;
        const region = d.region || nearest.state;
        const district = nearest.district || city;

        if (!useAppStore.getState().isManualSelection && (!isGpsAlreadyResolved || !isGpsAlreadyResolved())) {
          useAppStore.getState().setIndiaLocation(
            region,
            district,
            d.latitude,
            d.longitude,
            nearest.hasWardData ?? true,
            'LIVE',
            city.toLowerCase() !== district.toLowerCase() ? city : undefined,
            false,
            false
          );
          return;
        }
      }
    }
  } catch {}

  // 2. Secondary backup: BigDataCloud client API (~200ms)
  try {
    const res2 = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', {
      signal: AbortSignal.timeout(2500),
    });
    if (res2.ok) {
      const d2 = await res2.json();
      if (d2.latitude && d2.longitude && (!isGpsAlreadyResolved || !isGpsAlreadyResolved())) {
        const nearest = findNearestDistrict(d2.latitude, d2.longitude);
        const locality = d2.locality || d2.city || nearest.district;
        const distObj = d2.localityInfo?.administrative?.find((a: any) =>
          a.description?.toLowerCase().includes('district') || a.name?.toLowerCase().includes('district')
        );
        const district = distObj?.name?.replace(/\s+district/i, '').trim() || nearest.district;
        const state = d2.principalSubdivision || nearest.state;

        if (!useAppStore.getState().isManualSelection && (!isGpsAlreadyResolved || !isGpsAlreadyResolved())) {
          useAppStore.getState().setIndiaLocation(
            state,
            district,
            d2.latitude,
            d2.longitude,
            nearest.hasWardData ?? true,
            'LIVE',
            locality.toLowerCase() !== district.toLowerCase() ? locality : undefined,
            false,
            false
          );
          return;
        }
      }
    }
  } catch {}

  // 3. Tertiary backup: ipapi.co
  try {
    const res3 = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(2500),
    });
    if (res3.ok) {
      const d3 = await res3.json();
      if (d3.latitude && d3.longitude && (!isGpsAlreadyResolved || !isGpsAlreadyResolved())) {
        const nearest = findNearestDistrict(d3.latitude, d3.longitude);
        const city = d3.city || nearest.district;
        const region = d3.region || nearest.state;
        const district = nearest.district || city;

        if (!useAppStore.getState().isManualSelection && (!isGpsAlreadyResolved || !isGpsAlreadyResolved())) {
          useAppStore.getState().setIndiaLocation(
            region,
            district,
            d3.latitude,
            d3.longitude,
            nearest.hasWardData ?? true,
            'LIVE',
            city.toLowerCase() !== district.toLowerCase() ? city : undefined,
            false,
            false
          );
        }
      }
    }
  } catch {}
}
