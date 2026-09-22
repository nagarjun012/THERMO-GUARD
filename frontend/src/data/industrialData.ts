export interface IndustrialFacility {
  id: string;
  name: string;
  code: string;
  location: string;
  region: string;
  totalZones: number;
  totalSensors: number;
  sensorsOnline: number;
  overallStatus: 'SAFE' | 'ATTENTION' | 'WARNING' | 'CRITICAL';
  avgTemperature: number;
  maxHotspot: number;
  lastUpdated: string;
  connectionUptime: number; // percentage
}

export interface HeatZone {
  id: string;
  name: string;
  code: string;
  facilityId: string;
  building: string;
  floor: string;
  sensorId: string;
  currentTemp: number;
  humidity: number;
  wbgt: number;
  warningLimit: number;
  criticalLimit: number;
  status: 'SAFE' | 'ATTENTION' | 'WARNING' | 'CRITICAL';
  riskLevel: 'Safe' | 'Low' | 'Moderate' | 'High' | 'Extreme';
  sensorBattery: number;
  sensorRssi: number; // dBm
  lastReadingTime: string;
  isStale: boolean;
  assignedWorkers: number;
  coolingSystem: 'ACTIVE_BOOST' | 'OPERATIONAL' | 'IDLE' | 'MAINTENANCE';
  evacuationReady: boolean;
  notes: string;
}

export interface IndustrialAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'INFO';
  title: string;
  zoneId: string;
  zoneName: string;
  reading: number;
  threshold: number;
  detectedAt: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'SUPPRESSED';
  owner: string | null;
  recommendedAction: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  acknowledgementNote?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  zoneOrSensor?: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SAFE';
  details: string;
}

export interface DeviceSensor {
  id: string;
  model: string;
  firmware: string;
  zoneId: string;
  zoneName: string;
  batteryPercent: number;
  rssi: number;
  status: 'ONLINE' | 'CALIBRATING' | 'OFFLINE' | 'LOW_BATTERY';
  calibrationDate: string;
  nextCalibration: string;
  uptimePercent: number;
  lastPing: string;
}

export interface TrendPoint {
  time: string;
  timestamp: number;
  avgTemp: number;
  maxTemp: number;
  boilerRoom: number;
  assemblyFloor: number;
  coldStorage: number;
  warningThreshold: number;
  criticalThreshold: number;
}

// 1. FACILITIES REGISTRY
export const INDUSTRIAL_FACILITIES: IndustrialFacility[] = [
  {
    id: 'FAC-01',
    name: 'Plant Alpha — Manufacturing Complex',
    code: 'PLANT-CBE-01',
    location: 'Coimbatore Sector 4 Industrial Park, Tamil Nadu',
    region: 'South Region',
    totalZones: 6,
    totalSensors: 24,
    sensorsOnline: 23,
    overallStatus: 'WARNING',
    avgTemperature: 28.4,
    maxHotspot: 37.8,
    lastUpdated: '12s ago',
    connectionUptime: 99.8,
  },
  {
    id: 'FAC-02',
    name: 'Refinery Unit 2 — Thermal Processing',
    code: 'REF-CHN-02',
    location: 'Ennore Coastal Industrial Corridor, Chennai',
    region: 'East Coast',
    totalZones: 8,
    totalSensors: 32,
    sensorsOnline: 32,
    overallStatus: 'SAFE',
    avgTemperature: 30.1,
    maxHotspot: 34.6,
    lastUpdated: '8s ago',
    connectionUptime: 100.0,
  },
  {
    id: 'FAC-03',
    name: 'Central Logistics & Cold Storage Hub',
    code: 'LOG-BLR-03',
    location: 'Electronic City Phase II, Bengaluru, Karnataka',
    region: 'Deccan South',
    totalZones: 5,
    totalSensors: 18,
    sensorsOnline: 18,
    overallStatus: 'SAFE',
    avgTemperature: 22.8,
    maxHotspot: 26.4,
    lastUpdated: '25s ago',
    connectionUptime: 99.9,
  },
];

// 2. HEAT ZONES FOR PLANT ALPHA
export const INITIAL_HEAT_ZONES: HeatZone[] = [
  {
    id: 'ZONE-01',
    name: 'Boiler Room B-02',
    code: 'BLR-B02',
    facilityId: 'FAC-01',
    building: 'Thermal Power Block B',
    floor: 'Sub-level 1',
    sensorId: 'TS-104',
    currentTemp: 37.8,
    humidity: 62,
    wbgt: 33.4,
    warningLimit: 36.0,
    criticalLimit: 40.0,
    status: 'WARNING',
    riskLevel: 'High',
    sensorBattery: 94,
    sensorRssi: -62,
    lastReadingTime: 'Just now',
    isStale: false,
    assignedWorkers: 4,
    coolingSystem: 'ACTIVE_BOOST',
    evacuationReady: true,
    notes: 'Secondary heat recovery steam generator operating under peak demand.',
  },
  {
    id: 'ZONE-02',
    name: 'Production Assembly Floor',
    code: 'ASM-FL01',
    facilityId: 'FAC-01',
    building: 'Main Fabrication Bay',
    floor: 'Ground Level',
    sensorId: 'TS-101',
    currentTemp: 29.2,
    humidity: 54,
    wbgt: 24.8,
    warningLimit: 33.0,
    criticalLimit: 37.0,
    status: 'SAFE',
    riskLevel: 'Low',
    sensorBattery: 88,
    sensorRssi: -55,
    lastReadingTime: '5s ago',
    isStale: false,
    assignedWorkers: 38,
    coolingSystem: 'OPERATIONAL',
    evacuationReady: true,
    notes: 'HVAC ambient circulation nominal across precision robotics line.',
  },
  {
    id: 'ZONE-03',
    name: 'Cold Storage Unit 1',
    code: 'CS-U01',
    facilityId: 'FAC-01',
    building: 'Perishables & Logistics Annex',
    floor: 'Ground Level',
    sensorId: 'TS-106',
    currentTemp: 4.5,
    humidity: 78,
    wbgt: 3.8,
    warningLimit: 8.0,
    criticalLimit: 12.0,
    status: 'SAFE',
    riskLevel: 'Safe',
    sensorBattery: 99,
    sensorRssi: -48,
    lastReadingTime: '8s ago',
    isStale: false,
    assignedWorkers: 2,
    coolingSystem: 'OPERATIONAL',
    evacuationReady: true,
    notes: 'Hermetic refrigeration loop pressurized; insulation integrity verified.',
  },
  {
    id: 'ZONE-04',
    name: 'Electrical Transformer Bay',
    code: 'ELC-TR03',
    facilityId: 'FAC-01',
    building: 'Substation Yard East',
    floor: 'External Compound',
    sensorId: 'TS-108',
    currentTemp: 34.1,
    humidity: 48,
    wbgt: 28.6,
    warningLimit: 35.0,
    criticalLimit: 39.0,
    status: 'ATTENTION',
    riskLevel: 'Moderate',
    sensorBattery: 72,
    sensorRssi: -71,
    lastReadingTime: '15s ago',
    isStale: false,
    assignedWorkers: 1,
    coolingSystem: 'OPERATIONAL',
    evacuationReady: true,
    notes: 'Step-down 33kV transformer thermal load nearing advisory boundary.',
  },
  {
    id: 'ZONE-05',
    name: 'Chemical Reaction Room',
    code: 'CHM-RX01',
    facilityId: 'FAC-01',
    building: 'Polymer Synthesis Unit',
    floor: 'Level 2',
    sensorId: 'TS-110',
    currentTemp: 31.5,
    humidity: 50,
    wbgt: 26.2,
    warningLimit: 34.0,
    criticalLimit: 38.0,
    status: 'SAFE',
    riskLevel: 'Low',
    sensorBattery: 85,
    sensorRssi: -59,
    lastReadingTime: '20s ago',
    isStale: false,
    assignedWorkers: 6,
    coolingSystem: 'OPERATIONAL',
    evacuationReady: true,
    notes: 'Atmospheric scrubbers active; thermal exchange jacket at 28.0°C.',
  },
  {
    id: 'ZONE-06',
    name: 'Loading Dock & Warehouse A',
    code: 'WHS-DK04',
    facilityId: 'FAC-01',
    building: 'Outbound Logistics Depot',
    floor: 'Ground Level',
    sensorId: 'TS-112',
    currentTemp: 33.2,
    humidity: 58,
    wbgt: 29.1,
    warningLimit: 35.0,
    criticalLimit: 38.0,
    status: 'SAFE',
    riskLevel: 'Moderate',
    sensorBattery: 91,
    sensorRssi: -66,
    lastReadingTime: '10s ago',
    isStale: false,
    assignedWorkers: 14,
    coolingSystem: 'OPERATIONAL',
    evacuationReady: true,
    notes: 'High-volume roll-up doors open during scheduled transport window.',
  },
];

// 3. INITIAL ALERTS
export const INITIAL_ALERTS: IndustrialAlert[] = [
  {
    id: 'ALT-8842',
    severity: 'WARNING',
    title: 'Temperature Exceeded Advisory Limit in Boiler Room',
    zoneId: 'ZONE-01',
    zoneName: 'Boiler Room B-02',
    reading: 37.8,
    threshold: 36.0,
    detectedAt: '18 minutes ago',
    status: 'ACTIVE',
    owner: 'Safety Shift Lead: K. Raman',
    recommendedAction: 'Verify cooling exhaust dampers and rotate outdoor maintenance personnel.',
  },
  {
    id: 'ALT-8839',
    severity: 'ADVISORY',
    title: 'Transformer Bay Approaching Warning Threshold',
    zoneId: 'ZONE-04',
    zoneName: 'Electrical Transformer Bay',
    reading: 34.1,
    threshold: 35.0,
    detectedAt: '42 minutes ago',
    status: 'ACKNOWLEDGED',
    owner: 'Electrical Engineer: S. Mehra',
    recommendedAction: 'Engage forced-draft fan array Unit 3.',
    acknowledgedAt: '35 minutes ago',
    acknowledgedBy: 'S. Mehra (ENG-441)',
    acknowledgementNote: 'Inspected oil heat exchanger; fan array engaged at 100%.',
  },
  {
    id: 'ALT-8821',
    severity: 'CRITICAL',
    title: 'Steam Line Secondary Thermal Flare (Resolved)',
    zoneId: 'ZONE-01',
    zoneName: 'Boiler Room B-02',
    reading: 40.2,
    threshold: 40.0,
    detectedAt: '3 hours ago',
    status: 'RESOLVED',
    owner: 'Incident Commander: Dr. R. K. Sharma',
    recommendedAction: 'Emergency bypass initiated and personnel evacuated to Zone 02.',
    acknowledgedAt: '2h 55m ago',
    acknowledgedBy: 'Dr. R. K. Sharma',
    resolvedAt: '2h 15m ago',
    resolvedBy: 'Technician P. Varma',
  },
];

// 4. ACTIVITY TIMELINE
export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'ACT-904',
    timestamp: '18 min ago',
    operator: 'Automated IoT Sensor Telemetry',
    action: 'Threshold Exceeded Triggered',
    zoneOrSensor: 'Boiler Room B-02 (TS-104)',
    severity: 'WARNING',
    details: 'Ambient temperature reached 37.8°C, exceeding 36.0°C warning boundary.',
  },
  {
    id: 'ACT-903',
    timestamp: '35 min ago',
    operator: 'S. Mehra (Electrical Lead)',
    action: 'Alert Acknowledged',
    zoneOrSensor: 'Electrical Transformer Bay (TS-108)',
    severity: 'INFO',
    details: 'Operator confirmed fan array activation. Next inspection scheduled at 22:00.',
  },
  {
    id: 'ACT-902',
    timestamp: '1h 10m ago',
    operator: 'K. Meenakshi (SDMA Officer)',
    action: 'Regional Heat Advisory Linked',
    zoneOrSensor: 'Coimbatore District Network',
    severity: 'INFO',
    details: 'Coordinated facility baseline with Open-Meteo regional telemetry.',
  },
  {
    id: 'ACT-901',
    timestamp: '2h 15m ago',
    operator: 'P. Varma (Shift Tech)',
    action: 'Incident Cleared & Re-zeroed',
    zoneOrSensor: 'Boiler Room B-02',
    severity: 'SAFE',
    details: 'Auxiliary bypass valve recalibrated; ambient temp normalized to safe range.',
  },
];

// 5. SENSOR HARDWARE FLEET
export const SENSOR_FLEET: DeviceSensor[] = [
  {
    id: 'TS-101',
    model: 'ThermoSafe Industrial Probe Pro v3',
    firmware: 'v3.4.12-ind',
    zoneId: 'ZONE-02',
    zoneName: 'Production Assembly Floor',
    batteryPercent: 88,
    rssi: -55,
    status: 'ONLINE',
    calibrationDate: '2026-08-10',
    nextCalibration: '2027-02-10',
    uptimePercent: 99.98,
    lastPing: '5s ago',
  },
  {
    id: 'TS-104',
    model: 'ThermoSafe High-Temp Thermocouple HT-600',
    firmware: 'v3.4.12-ind',
    zoneId: 'ZONE-01',
    zoneName: 'Boiler Room B-02',
    batteryPercent: 94,
    rssi: -62,
    status: 'ONLINE',
    calibrationDate: '2026-07-22',
    nextCalibration: '2027-01-22',
    uptimePercent: 99.85,
    lastPing: 'Just now',
  },
  {
    id: 'TS-106',
    model: 'ThermoSafe Cryo Precision Sensor CR-50',
    firmware: 'v2.9.8-ind',
    zoneId: 'ZONE-03',
    zoneName: 'Cold Storage Unit 1',
    batteryPercent: 99,
    rssi: -48,
    status: 'ONLINE',
    calibrationDate: '2026-09-01',
    nextCalibration: '2027-03-01',
    uptimePercent: 100.0,
    lastPing: '8s ago',
  },
  {
    id: 'TS-108',
    model: 'ThermoSafe Substation IR Pyrometer',
    firmware: 'v3.4.12-ind',
    zoneId: 'ZONE-04',
    zoneName: 'Electrical Transformer Bay',
    batteryPercent: 72,
    rssi: -71,
    status: 'ONLINE',
    calibrationDate: '2026-06-15',
    nextCalibration: '2026-12-15',
    uptimePercent: 99.42,
    lastPing: '15s ago',
  },
  {
    id: 'TS-110',
    model: 'ThermoSafe Intrinsically Safe IS-100 (ATEX Zone 1)',
    firmware: 'v3.5.0-atex',
    zoneId: 'ZONE-05',
    zoneName: 'Chemical Reaction Room',
    batteryPercent: 85,
    rssi: -59,
    status: 'ONLINE',
    calibrationDate: '2026-08-30',
    nextCalibration: '2027-02-28',
    uptimePercent: 99.95,
    lastPing: '20s ago',
  },
  {
    id: 'TS-112',
    model: 'ThermoSafe Wide-Area Ambient Beacon WA-200',
    firmware: 'v3.2.0-ind',
    zoneId: 'ZONE-06',
    zoneName: 'Loading Dock & Warehouse A',
    batteryPercent: 91,
    rssi: -66,
    status: 'ONLINE',
    calibrationDate: '2026-05-18',
    nextCalibration: '2026-11-18',
    uptimePercent: 99.78,
    lastPing: '10s ago',
  },
  {
    id: 'TS-115',
    model: 'ThermoSafe Multi-Point Probe Array',
    firmware: 'v3.4.12-ind',
    zoneId: 'ZONE-01',
    zoneName: 'Boiler Room Auxiliary Flue',
    batteryPercent: 100,
    rssi: -60,
    status: 'CALIBRATING',
    calibrationDate: '2026-09-22',
    nextCalibration: '2027-03-22',
    uptimePercent: 98.60,
    lastPing: '1m ago',
  },
];

// 6. REALISTIC 24-HOUR TREND TELEMETRY
export function generateTrendPoints(): TrendPoint[] {
  const points: TrendPoint[] = [];
  const now = Date.now();
  const oneHour = 3600 * 1000;

  for (let i = 23; i >= 0; i--) {
    const t = new Date(now - i * oneHour);
    const hourStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // Realistic thermal wave
    const hourOfDay = t.getHours();
    const diurnalFactor = Math.sin(((hourOfDay - 6) / 24) * 2 * Math.PI);
    
    const baseAssembly = 27.5 + diurnalFactor * 3.5 + (Math.sin(i) * 0.4);
    const baseBoiler = 34.0 + (i < 4 ? 3.8 : 1.2) + (Math.cos(i) * 0.5);
    const baseCold = 4.2 + (Math.sin(i * 0.8) * 0.4);
    const avg = Number(((baseAssembly + baseBoiler + baseCold) / 3).toFixed(1));
    const max = Number(Math.max(baseAssembly, baseBoiler, baseCold).toFixed(1));

    points.push({
      time: hourStr,
      timestamp: t.getTime(),
      avgTemp: avg,
      maxTemp: max,
      boilerRoom: Number(baseBoiler.toFixed(1)),
      assemblyFloor: Number(baseAssembly.toFixed(1)),
      coldStorage: Number(baseCold.toFixed(1)),
      warningThreshold: 36.0,
      criticalThreshold: 40.0,
    });
  }
  return points;
}
