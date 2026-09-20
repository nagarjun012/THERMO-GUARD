import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { useAppStore } from '../stores/appStore';

export const useWeather = () => {
  const { lat, lon } = useAppStore(s => s.selectedLocation);
  return useQuery({ queryKey: ['weather', lat, lon], queryFn: () => apiService.getWeather(lat, lon) });
};

export const useThermalStress = () => {
  const { lat, lon } = useAppStore(s => s.selectedLocation);
  return useQuery({ queryKey: ['thermal', lat, lon], queryFn: () => apiService.getThermalStress(lat, lon) });
};

export const useRisk = () => {
  const { lat, lon } = useAppStore(s => s.selectedLocation);
  return useQuery({ queryKey: ['risk', lat, lon], queryFn: () => apiService.getRisk(lat, lon) });
};

export const useForecast = () => {
  const { lat, lon } = useAppStore(s => s.selectedLocation);
  return useQuery({ queryKey: ['forecast', lat, lon], queryFn: () => apiService.getForecast(lat, lon) });
};

export const useAlerts = () => {
  const { lat, lon } = useAppStore(s => s.selectedLocation);
  return useQuery({ queryKey: ['alerts', lat, lon], queryFn: () => apiService.getAlerts(lat, lon) });
};

export const useDemoScenarios = () => useQuery({ queryKey: ['scenarios'], queryFn: apiService.getDemoScenarios });

export const useActivateScenario = () => {
  const qc = useQueryClient();
  const setScenario = useAppStore(s => s.setScenario);
  return useMutation({
    mutationFn: (id: string) => apiService.activateScenario(id),
    onSuccess: (_, id) => {
      setScenario(id);
      qc.invalidateQueries();
    }
  });
};

export const useGovernmentDashboard = () => useQuery({ queryKey: ['govDashboard'], queryFn: apiService.getGovernmentDashboard });
