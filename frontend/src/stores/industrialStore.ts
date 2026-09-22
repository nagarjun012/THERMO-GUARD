import { create } from 'zustand';
import {
  IndustrialFacility,
  HeatZone,
  IndustrialAlert,
  ActivityEvent,
  DeviceSensor,
  TrendPoint,
  INDUSTRIAL_FACILITIES,
  INITIAL_HEAT_ZONES,
  INITIAL_ALERTS,
  INITIAL_ACTIVITIES,
  SENSOR_FLEET,
  generateTrendPoints,
} from '../data/industrialData';

interface IndustrialState {
  // Facility Context
  facilities: IndustrialFacility[];
  activeFacilityId: string;
  getActiveFacility: () => IndustrialFacility;
  switchFacility: (facilityId: string) => void;

  // Zones State
  zones: HeatZone[];
  selectedZoneId: string | null;
  selectZone: (zoneId: string | null) => void;
  updateZoneThreshold: (zoneId: string, warningLimit: number, criticalLimit: number) => void;

  // Alerts State
  alerts: IndustrialAlert[];
  activeAlertModal: IndustrialAlert | null;
  openAlertModal: (alert: IndustrialAlert | null) => void;
  acknowledgeAlert: (alertId: string, note: string, operatorName?: string) => void;
  resolveAlert: (alertId: string, resolutionNote: string, operatorName?: string) => void;
  escalateAlert: (alertId: string, escalationReason: string) => void;

  // Activity Log
  activities: ActivityEvent[];
  addActivity: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;

  // Hardware Fleet
  sensors: DeviceSensor[];

  // Analytics & Trends
  trendPoints: TrendPoint[];
  trendRange: '24h' | '7d' | '30d';
  setTrendRange: (range: '24h' | '7d' | '30d') => void;

  // UI Navigation & Layout
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;

  // Telemetry Refresh Simulation
  lastSyncTime: string;
  refreshTelemetry: () => void;
}

export const useIndustrialStore = create<IndustrialState>((set, get) => ({
  facilities: INDUSTRIAL_FACILITIES,
  activeFacilityId: 'FAC-01',

  getActiveFacility: () => {
    const { facilities, activeFacilityId } = get();
    return facilities.find((f) => f.id === activeFacilityId) || facilities[0];
  },

  switchFacility: (facilityId: string) => {
    const target = get().facilities.find((f) => f.id === facilityId);
    if (!target) return;

    set({
      activeFacilityId: facilityId,
      selectedZoneId: null,
      lastSyncTime: 'Just now',
    });

    get().addActivity({
      operator: 'Control Room Supervisor',
      action: 'Facility Context Switched',
      severity: 'INFO',
      details: `Switched operational monitoring console to ${target.name}.`,
    });
  },

  zones: INITIAL_HEAT_ZONES,
  selectedZoneId: null,
  selectZone: (zoneId: string | null) => set({ selectedZoneId: zoneId }),

  updateZoneThreshold: (zoneId: string, warningLimit: number, criticalLimit: number) => {
    set((state) => ({
      zones: state.zones.map((z) => {
        if (z.id !== zoneId) return z;
        const newStatus =
          z.currentTemp >= criticalLimit
            ? 'CRITICAL'
            : z.currentTemp >= warningLimit
            ? 'WARNING'
            : 'SAFE';
        return {
          ...z,
          warningLimit,
          criticalLimit,
          status: newStatus,
        };
      }),
    }));

    const zone = get().zones.find((z) => z.id === zoneId);
    get().addActivity({
      operator: 'Safety Compliance Officer',
      action: 'Zone Threshold Adjusted',
      zoneOrSensor: zone?.name,
      severity: 'WARNING',
      details: `Updated thresholds for ${zone?.name}: Warning ${warningLimit}°C, Critical ${criticalLimit}°C.`,
    });
  },

  alerts: INITIAL_ALERTS,
  activeAlertModal: null,
  openAlertModal: (alert: IndustrialAlert | null) => set({ activeAlertModal: alert }),

  acknowledgeAlert: (alertId: string, note: string, operatorName = 'K. Raman (Safety Shift Lead)') => {
    const now = 'Just now';
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'ACKNOWLEDGED',
              acknowledgedAt: now,
              acknowledgedBy: operatorName,
              acknowledgementNote: note,
            }
          : a
      ),
      activeAlertModal: null,
    }));

    const targetAlert = get().alerts.find((a) => a.id === alertId);
    get().addActivity({
      operator: operatorName,
      action: 'Alert Acknowledged',
      zoneOrSensor: targetAlert?.zoneName,
      severity: 'INFO',
      details: `Alert ${alertId} acknowledged: "${note}". Protocol engaged.`,
    });
  },

  resolveAlert: (alertId: string, resolutionNote: string, operatorName = 'P. Varma (Shift Tech)') => {
    const now = 'Just now';
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'RESOLVED',
              resolvedAt: now,
              resolvedBy: operatorName,
            }
          : a
      ),
      activeAlertModal: null,
    }));

    const targetAlert = get().alerts.find((a) => a.id === alertId);
    get().addActivity({
      operator: operatorName,
      action: 'Alert Resolved',
      zoneOrSensor: targetAlert?.zoneName,
      severity: 'SAFE',
      details: `Alert ${alertId} marked as resolved: "${resolutionNote}".`,
    });
  },

  escalateAlert: (alertId: string, escalationReason: string) => {
    const targetAlert = get().alerts.find((a) => a.id === alertId);
    get().addActivity({
      operator: 'Automated Safety Engine',
      action: 'Alert Escalated to Incident Level 2',
      zoneOrSensor: targetAlert?.zoneName,
      severity: 'CRITICAL',
      details: `Alert ${alertId} escalated to Plant Safety Director. Emergency Dispatch 108 notified: "${escalationReason}".`,
    });
    set({ activeAlertModal: null });
  },

  activities: INITIAL_ACTIVITIES,
  addActivity: (event) => {
    const newEvent: ActivityEvent = {
      ...event,
      id: `ACT-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
    };
    set((state) => ({
      activities: [newEvent, ...state.activities.slice(0, 19)],
    }));
  },

  sensors: SENSOR_FLEET,

  trendPoints: generateTrendPoints(),
  trendRange: '24h',
  setTrendRange: (range) => set({ trendRange: range }),

  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSearchModalOpen: false,
  setSearchModalOpen: (open) => set({ isSearchModalOpen: open }),

  lastSyncTime: '12s ago',
  refreshTelemetry: () => {
    set({
      lastSyncTime: 'Just now',
      trendPoints: generateTrendPoints(),
    });
    get().addActivity({
      operator: 'Telemetry Daemon',
      action: 'Full Sensor Array Synced',
      severity: 'INFO',
      details: 'All 24 industrial probes polled via secure Modbus TCP gateway.',
    });
  },
}));
