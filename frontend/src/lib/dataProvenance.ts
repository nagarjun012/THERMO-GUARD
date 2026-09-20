// =========================================================================
// DATA PROVENANCE MODULE
// Tracks source, freshness, and status of all data displayed in the UI.
// All timestamps stored in ISO 8601 UTC internally.
// Displayed in IST (Asia/Kolkata) for Indian government/user context.
// =========================================================================

export type DataFreshnessStatus = 'LIVE' | 'LAST_KNOWN' | 'DATA_UNAVAILABLE';

export type DataSourceType =
  | 'LIVE_WEATHER'
  | 'FORECAST'
  | 'CACHED_WEATHER'
  | 'STATIC_FACILITY'
  | 'COMMUNITY_REPORTED'
  | 'REFERENCE_DATA';

export type APIRequestStatus = 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'INVALID_DATA' | 'PARTIAL';

export interface DataProvenance {
  source: string;
  lastUpdated: string | null;        // ISO 8601 UTC
  location: string;
  apiStatus: APIRequestStatus;
  calculationTime: string | null;    // ISO 8601 UTC
  freshnessStatus: DataFreshnessStatus;
  freshnessLabel: string;            // e.g. "2 minutes", "15 minutes", "Unavailable"
  dataType: DataSourceType;
  errors?: string[];
}

// Freshness thresholds (milliseconds)
// LIVE: data updated within the last 5 minutes
// LAST_KNOWN: data updated within the last 30 minutes
// DATA_UNAVAILABLE: data older than 30 minutes or missing
const FRESHNESS_LIVE_MS = 5 * 60 * 1000;         // 5 minutes
const FRESHNESS_LAST_KNOWN_MS = 30 * 60 * 1000;  // 30 minutes

/**
 * Format an ISO timestamp to IST (Asia/Kolkata) display string.
 * Example output: "20 Sep 2026, 17:32 IST"
 */
export function formatISTTimestamp(isoTimestamp: string | null | undefined): string {
  if (!isoTimestamp) return 'Not available';

  try {
    const date = new Date(isoTimestamp);
    if (isNaN(date.getTime())) return 'Invalid timestamp';

    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + ' IST';
  } catch {
    return 'Invalid timestamp';
  }
}

/**
 * Format an ISO timestamp to a short IST time string.
 * Example output: "17:32 IST"
 */
export function formatISTTime(isoTimestamp: string | null | undefined): string {
  if (!isoTimestamp) return 'N/A';

  try {
    const date = new Date(isoTimestamp);
    if (isNaN(date.getTime())) return 'N/A';

    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + ' IST';
  } catch {
    return 'N/A';
  }
}

/**
 * Compute freshness status and human-readable label from a timestamp.
 */
export function computeFreshness(
  lastUpdated: string | null | undefined
): { status: DataFreshnessStatus; label: string } {
  if (!lastUpdated) {
    return { status: 'DATA_UNAVAILABLE', label: 'No data' };
  }

  const updatedAt = new Date(lastUpdated).getTime();
  if (isNaN(updatedAt)) {
    return { status: 'DATA_UNAVAILABLE', label: 'Invalid timestamp' };
  }

  const ageMs = Date.now() - updatedAt;

  if (ageMs < 0) {
    // Future timestamp — treat as live (clock skew)
    return { status: 'LIVE', label: 'Just now' };
  }

  if (ageMs < FRESHNESS_LIVE_MS) {
    const minutes = Math.floor(ageMs / 60000);
    const seconds = Math.floor((ageMs % 60000) / 1000);
    if (minutes === 0) {
      return { status: 'LIVE', label: `${seconds} second${seconds !== 1 ? 's' : ''}` };
    }
    return { status: 'LIVE', label: `${minutes} minute${minutes !== 1 ? 's' : ''}` };
  }

  if (ageMs < FRESHNESS_LAST_KNOWN_MS) {
    const minutes = Math.floor(ageMs / 60000);
    return { status: 'LAST_KNOWN', label: `${minutes} minute${minutes !== 1 ? 's' : ''} ago` };
  }

  // Older than 30 minutes
  const hours = Math.floor(ageMs / 3600000);
  if (hours < 24) {
    return { status: 'DATA_UNAVAILABLE', label: `${hours} hour${hours !== 1 ? 's' : ''} ago (stale)` };
  }

  const days = Math.floor(hours / 24);
  return { status: 'DATA_UNAVAILABLE', label: `${days} day${days !== 1 ? 's' : ''} ago (stale)` };
}

/**
 * Build a complete DataProvenance object for weather data.
 */
export function buildWeatherProvenance(params: {
  source?: string;
  lastUpdated?: string | null;
  location?: string;
  apiStatus?: APIRequestStatus;
  calculationTime?: string | null;
  dataType?: DataSourceType;
  errors?: string[];
}): DataProvenance {
  const freshness = computeFreshness(params.lastUpdated);

  return {
    source: params.source || 'Open-Meteo',
    lastUpdated: params.lastUpdated || null,
    location: params.location || 'Unknown',
    apiStatus: params.apiStatus || 'SUCCESS',
    calculationTime: params.calculationTime || new Date().toISOString(),
    freshnessStatus: params.apiStatus === 'FAILED' || params.apiStatus === 'TIMEOUT'
      ? 'DATA_UNAVAILABLE'
      : freshness.status,
    freshnessLabel: params.apiStatus === 'FAILED' || params.apiStatus === 'TIMEOUT'
      ? 'Data unavailable'
      : freshness.label,
    dataType: params.dataType || 'LIVE_WEATHER',
    errors: params.errors,
  };
}

/**
 * Build a provenance object for static/facility data.
 */
export function buildFacilityProvenance(params: {
  source?: string;
  lastVerified?: string | null;
  location?: string;
}): DataProvenance {
  const freshness = params.lastVerified
    ? computeFreshness(params.lastVerified)
    : { status: 'DATA_UNAVAILABLE' as DataFreshnessStatus, label: 'Not available' };

  return {
    source: params.source || 'OpenStreetMap',
    lastUpdated: params.lastVerified || null,
    location: params.location || 'Unknown',
    apiStatus: 'SUCCESS',
    calculationTime: null,
    freshnessStatus: freshness.status === 'LIVE' ? 'LIVE' : 'LAST_KNOWN',
    freshnessLabel: params.lastVerified ? freshness.label : 'Not available',
    dataType: 'STATIC_FACILITY',
  };
}

/**
 * Get the status badge color class for a freshness status.
 */
export function freshnessStatusColor(status: DataFreshnessStatus): string {
  switch (status) {
    case 'LIVE': return 'text-emerald-400';
    case 'LAST_KNOWN': return 'text-yellow-400';
    case 'DATA_UNAVAILABLE': return 'text-red-400';
  }
}

/**
 * Get the status badge emoji for a freshness status.
 */
export function freshnessStatusEmoji(status: DataFreshnessStatus): string {
  switch (status) {
    case 'LIVE': return '🟢';
    case 'LAST_KNOWN': return '🟡';
    case 'DATA_UNAVAILABLE': return '🔴';
  }
}
