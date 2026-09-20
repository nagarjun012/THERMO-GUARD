export type FreshnessLevel = 'LIVE' | 'RECENT' | 'STALE' | 'UNKNOWN';

export interface Facility {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  state: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  emergencyAvailable?: boolean;
  totalBeds?: number;
  availableBeds?: number | null;
  totalICUBeds?: number;
  availableICUBeds?: number | null;
  oxygenAvailable?: boolean;
  ambulanceAvailable?: boolean;
  source: string;
  sourceUrl?: string;
  sourceType: string;
  sourceTrustScore: number;
  verificationStatus: string;
  lastUpdated?: string;
  dataAgeMinutes?: number;
  freshness: FreshnessLevel;
  distanceKm?: number;
}

export interface CoolingCentre {
  centreId: string;
  name: string;
  type: string;
  state: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  openingTime: string;
  closingTime: string;
  currentlyOpen: boolean;
  drinkingWater: boolean;
  ORSAvailable: boolean;
  seatingAvailable: boolean;
  airConditioning: boolean;
  shadedArea: boolean;
  accessibility: boolean;
  capacity?: number;
  currentOccupancy?: number | null;
  source: string;
  sourceUrl?: string;
  sourceTrustScore: number;
  verificationStatus: string;
  lastUpdated?: string;
  dataAgeMinutes?: number;
  freshness: FreshnessLevel;
  distanceKm?: number;
}

export interface FreshnessStats {
  totalFacilities: number;
  totalCoolingCentres: number;
  liveCount: number;
  recentCount: number;
  staticCount: number;
  timestamp: string;
}
