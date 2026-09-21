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

/**
 * Reverse geocodes coordinates to exact Locality / Taluk, District, and State.
 * Always preserves the exact coordinates (real user GPS or physical position).
 */
export async function resolveLocationFromCoords(
  lat: number,
  lon: number,
  isGps: boolean = true,
  _accuracy?: number
): Promise<ResolvedLocation> {
  // Query BigDataCloud reverse geocoding client API (CORS-friendly, free, high precision)
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      
      const adminList: any[] = data.localityInfo?.administrative || [];
      
      // Look for taluk / subdistrict / town
      const talukObj = adminList.find(
        (a) =>
          a.description?.toLowerCase().includes('taluk') ||
          a.description?.toLowerCase().includes('town') ||
          a.name?.toLowerCase().includes('taluk')
      );
      
      // Look for district
      const distObj = adminList.find(
        (a) =>
          a.description?.toLowerCase().includes('district') ||
          a.name?.toLowerCase().includes('district')
      );

      let locality =
        data.locality ||
        data.city ||
        talukObj?.name ||
        '';

      let district = distObj?.name?.replace(/\s+district/i, '').trim() || '';
      if (!district) {
        district = data.city || '';
      }

      let state = data.principalSubdivision || '';

      // Fallback district and state if BigDataCloud missed them
      if (!district || !state) {
        const nearest = findNearestDistrict(lat, lon);
        if (!district) district = nearest.district;
        if (!state) state = nearest.state;
      }

      // If locality is same as district or blank, use district
      const hasLocality = locality && locality.toLowerCase() !== district.toLowerCase();
      const displayName = hasLocality
        ? `${locality}, ${district}, ${state}`
        : `${district}, ${state}`;

      return {
        lat,
        lon,
        locality: hasLocality ? locality : district,
        district,
        state,
        displayName,
        isGpsLive: isGps,
      };
    }
  } catch (err) {
    console.warn('Reverse geocode API failed, falling back to nearest district lookup:', err);
  }

  // Fallback to 788-district nearest neighbor dataset
  const nearest: SearchResult = findNearestDistrict(lat, lon);
  return {
    lat,
    lon,
    locality: nearest.district,
    district: nearest.district,
    state: nearest.state,
    displayName: `${nearest.district}, ${nearest.state}`,
    isGpsLive: isGps,
  };
}

let activeWatchId: number | null = null;
let lastHardwarePos: { lat: number; lon: number } | null = null;

/**
 * Automatically detects real-time location.
 * 1. Immediately fires fast IP geolocation in parallel so real city displays in <300ms.
 * 2. Concurrently checks device GPS via navigator.geolocation.getCurrentPosition.
 * 3. Registers watchPosition for physical device movement without clobbering manual selections.
 */
export function detectRealtimeLocation(
  forcePrompt: boolean = false,
  onLocatingChange?: (locating: boolean) => void,
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

  // STEP 1: Fast Parallel IP Geolocation (instant response ~200ms)
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

      if (onLocatingChange) onLocatingChange(false);
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

    // First attempt: High accuracy GPS
    navigator.geolocation.getCurrentPosition(
      handleGpsSuccess,
      () => {
        // Fallback attempt: Try standard accuracy if high accuracy failed
        navigator.geolocation.getCurrentPosition(
          handleGpsSuccess,
          handleGpsError,
          { enableHighAccuracy: false, timeout: 6000, maximumAge: forcePrompt ? 0 : 30000 }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: forcePrompt ? 0 : 30000,
      }
    );

    // Register watchPosition for continuous tracking when physically moving
    if (activeWatchId !== null) {
      navigator.geolocation.clearWatch(activeWatchId);
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
          if (dLat < 0.002 && dLon < 0.002) {
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
      { enableHighAccuracy: false, maximumAge: 60000 }
    );
  }
}

/**
 * Fast IP geolocation fallback to detect the user's real city/coordinates instantly.
 */
async function fallbackToIpOrKnownLocation(isGpsAlreadyResolved?: () => boolean): Promise<void> {
  if (useAppStore.getState().isManualSelection) return;

  // 1. Primary: ipwho.is (fastest, high reliability in India, CORS-friendly)
  try {
    const res = await fetch('https://ipwho.is/', {
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const d = await res.json();
      if (d.success !== false && d.latitude && d.longitude && (!isGpsAlreadyResolved || !isGpsAlreadyResolved())) {
        const resolved = await resolveLocationFromCoords(d.latitude, d.longitude, false);
        if (!useAppStore.getState().isManualSelection) {
          useAppStore.getState().setIndiaLocation(
            resolved.state,
            resolved.district,
            resolved.lat,
            resolved.lon,
            true,
            'LIVE',
            resolved.locality,
            false,
            false
          );
          return;
        }
      }
    }
  } catch {}

  // 2. Secondary backup: BigDataCloud client API
  try {
    const res2 = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', {
      signal: AbortSignal.timeout(5000),
    });
    if (res2.ok) {
      const d2 = await res2.json();
      if (d2.latitude && d2.longitude && (!isGpsAlreadyResolved || !isGpsAlreadyResolved())) {
        const resolved2 = await resolveLocationFromCoords(d2.latitude, d2.longitude, false);
        if (!useAppStore.getState().isManualSelection) {
          useAppStore.getState().setIndiaLocation(
            resolved2.state,
            resolved2.district,
            resolved2.lat,
            resolved2.lon,
            true,
            'LIVE',
            resolved2.locality,
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
      signal: AbortSignal.timeout(3000),
    });
    if (res3.ok) {
      const d3 = await res3.json();
      if (d3.latitude && d3.longitude && (!isGpsAlreadyResolved || !isGpsAlreadyResolved())) {
        const resolved3 = await resolveLocationFromCoords(d3.latitude, d3.longitude, false);
        if (!useAppStore.getState().isManualSelection) {
          useAppStore.getState().setIndiaLocation(
            resolved3.state,
            resolved3.district,
            resolved3.lat,
            resolved3.lon,
            true,
            'LIVE',
            resolved3.locality,
            false,
            false
          );
        }
      }
    }
  } catch {}
}
