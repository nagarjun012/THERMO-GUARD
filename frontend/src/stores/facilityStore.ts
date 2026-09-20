import { create } from 'zustand';
import { Facility, CoolingCentre, FreshnessStats } from '../types/facility';

interface FacilityState {
  hospitals: Facility[];
  coolingCentres: CoolingCentre[];
  selectedFacility: Facility | null;
  selectedCoolingCentre: CoolingCentre | null;
  selectedSourceInfo: Facility | CoolingCentre | null;
  isAdminModalOpen: boolean;
  adminTargetFacility: Facility | null;
  freshnessStats: FreshnessStats | null;
  activeLayerFilters: {
    hospitals: boolean;
    icu: boolean;
    coolingCentres: boolean;
    ambulance: boolean;
    waterOrs: boolean;
  };

  setFacilities: (hospitals: Facility[], coolingCentres: CoolingCentre[]) => void;
  setSelectedFacility: (facility: Facility | null) => void;
  setSelectedCoolingCentre: (centre: CoolingCentre | null) => void;
  setSelectedSourceInfo: (item: Facility | CoolingCentre | null) => void;
  setAdminModalOpen: (open: boolean, target?: Facility | null) => void;
  setFreshnessStats: (stats: FreshnessStats | null) => void;
  toggleLayerFilter: (layer: keyof FacilityState['activeLayerFilters']) => void;
}

export const useFacilityStore = create<FacilityState>((set) => ({
  hospitals: [],
  coolingCentres: [],
  selectedFacility: null,
  selectedCoolingCentre: null,
  selectedSourceInfo: null,
  isAdminModalOpen: false,
  adminTargetFacility: null,
  freshnessStats: null,
  activeLayerFilters: {
    hospitals: true,
    icu: true,
    coolingCentres: true,
    ambulance: true,
    waterOrs: true
  },

  setFacilities: (hospitals, coolingCentres) => set({ hospitals, coolingCentres }),
  setSelectedFacility: (facility) => set({ selectedFacility: facility, selectedCoolingCentre: null }),
  setSelectedCoolingCentre: (centre) => set({ selectedCoolingCentre: centre, selectedFacility: null }),
  setSelectedSourceInfo: (item) => set({ selectedSourceInfo: item }),
  setAdminModalOpen: (open, target = null) => set({ isAdminModalOpen: open, adminTargetFacility: target }),
  setFreshnessStats: (stats) => set({ freshnessStats: stats }),
  toggleLayerFilter: (layer) =>
    set((state) => ({
      activeLayerFilters: {
        ...state.activeLayerFilters,
        [layer]: !state.activeLayerFilters[layer]
      }
    }))
}));
