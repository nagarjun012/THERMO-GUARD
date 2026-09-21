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

export const ARAVAKURICHI_CENTER = {
  lat: 10.7770,
  lon: 77.9094,
};

/**
 * Spatial bounding box check for Aravakurichi Taluk in Karur District, Tamil Nadu.
 * Extends from 10.60° N to 11.08° N, 77.65° E to 78.10° E (covering rural taluk & ISP towers).
 */
export const isAravakurichiArea = (lat: number, lon: number): boolean => {
  return lat >= 10.60 && lat <= 11.08 && lon >= 77.65 && lon <= 78.10;
};

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
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
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
 * 1. Checks device GPS via navigator.geolocation.getCurrentPosition with high accuracy.
 * 2. In parallel, fires fast IP geolocation so user isn't kept waiting.
 * 3. Applies updates to the global appStore immediately.
 */
export function detectRealtimeLocation(
  forcePrompt: boolean = false,
  onLocatingChange?: (locating: boolean) => void
): void {
  if (onLocatingChange) onLocatingChange(true);

  if (forcePrompt) {
    useAppStore.getState().setIsManualSelection(false);
  } else if (useAppStore.getState().isManualSelection) {
    if (onLocatingChange) onLocatingChange(false);
    return;
  }

  let hasResolvedGps = false;

  // STEP A: Try high-precision browser GPS
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
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
      },
      async (err) => {
        console.warn('GPS hardware lock not available or denied, falling back to IP/default:', err);
        if (!hasResolvedGps && !useAppStore.getState().isManualSelection) {
          await fallbackToIpOrKnownLocation();
        }
        if (onLocatingChange) onLocatingChange(false);
      },
      {
        enableHighAccuracy: true,
        timeout: forcePrompt ? 10000 : 7000,
        maximumAge: forcePrompt ? 0 : 30000,
      }
    );

    // Also register watchPosition to continuously update if user physically moves
    if (activeWatchId !== null) {
      navigator.geolocation.clearWatch(activeWatchId);
    }
    activeWatchId = navigator.geolocation.watchPosition(
      async (pos) => {
        // If user manually chose a different city/district in the UI, do not overwrite it!
        if (useAppStore.getState().isManualSelection) {
          return;
        }

        const { latitude, longitude, accuracy } = pos.coords;
        if (!lastHardwarePos) {
          lastHardwarePos = { lat: latitude, lon: longitude };
        } else {
          // Only update if physical device moved more than ~200 meters
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
      { enableHighAccuracy: true, maximumAge: 60000 }
    );
  } else {
    fallbackToIpOrKnownLocation().then(() => {
      if (onLocatingChange) onLocatingChange(false);
    });
  }
}

/**
 * Fallback to IP geolocation if GPS hardware permission is pending or unavailable.
 */
async function fallbackToIpOrKnownLocation(): Promise<void> {
  if (useAppStore.getState().isManualSelection) return;
  try {
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const d = await res.json();
      if (d.latitude && d.longitude) {
        const resolved = await resolveLocationFromCoords(d.latitude, d.longitude, false);
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
      }
    }
  } catch {}
}
