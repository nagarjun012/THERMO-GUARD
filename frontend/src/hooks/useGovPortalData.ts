import { useState, useEffect, useCallback } from 'react';
import {
  govHtssService,
  GovPortalPipelineResult,
  ProcessedDistrict,
} from '../services/govHtssService';

export function useGovPortalData() {
  const [data, setData] = useState<GovPortalPipelineResult | null>(() => govHtssService.getCachedResult());
  const [isLoading, setIsLoading] = useState<boolean>(!data);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSyncingState, setIsSyncingState] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ loaded: number; total: number; percent: number }>({
    loaded: 0,
    total: 788,
    percent: 0,
  });

  const [selectedDistrict, setSelectedDistrict] = useState<ProcessedDistrict | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  const loadPipeline = useCallback(async (forceRefresh: boolean = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else if (!data) {
      setIsLoading(true);
    }

    setProgress({ loaded: 0, total: 788, percent: 0 });

    try {
      const result = await govHtssService.executePipeline(forceRefresh, (loaded, total) => {
        setProgress({
          loaded,
          total,
          percent: Math.round((loaded / total) * 100),
        });
      });
      setData(result);
    } catch (err) {
      console.error('Gov Portal Pipeline Execution Failed:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPipeline(false);

    // Auto-refresh regularly every 5 minutes to keep telemetry live
    const interval = setInterval(() => {
      loadPipeline(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadPipeline]);

  // Sync all districts for a single state in real-time
  const syncStateLive = useCallback(async (stateName: string) => {
    setIsSyncingState(stateName);
    try {
      const result = await govHtssService.syncStateLive(stateName, (loaded, total) => {
        setProgress({
          loaded,
          total,
          percent: Math.round((loaded / total) * 100),
        });
      });
      setData({ ...result });
    } catch (err) {
      console.error(`Live sync failed for state ${stateName}:`, err);
    } finally {
      setIsSyncingState(null);
    }
  }, []);

  // Sync a single district in real-time
  const syncDistrictLive = useCallback(async (district: ProcessedDistrict): Promise<ProcessedDistrict> => {
    const updated = await govHtssService.syncDistrictLive(district);
    setSelectedDistrict(updated);
    const cached = govHtssService.getCachedResult();
    if (cached) {
      setData({ ...cached });
    }
    return updated;
  }, []);

  const handleSelectDistrictForInspection = (district: ProcessedDistrict) => {
    setSelectedDistrict(district);
    setIsInspectorOpen(true);
  };

  const formattedLastUpdated = data?.lastFetchedAt
    ? new Date(data.lastFetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Not yet updated';

  return {
    districts: data?.districts || [],
    states: data?.states || [],
    counters: data?.counters || {
      totalDistricts: 788,
      successfulCount: 0,
      failedCount: 0,
      extremeCount: 0,
      highCount: 0,
      moderateCount: 0,
      lowCount: 0,
      statesAffectedCount: 0,
      affectedPopulation: 0,
    },
    isLoading,
    isRefreshing,
    isSyncingState,
    isLive: data?.isLive ?? false,
    progress,
    lastUpdated: formattedLastUpdated,
    lastFetchedIso: data?.lastFetchedAt || null,
    isCached: data?.isCached || false,
    refreshData: (force: boolean = true) => loadPipeline(force),
    syncStateLive,
    syncDistrictLive,
    selectedDistrict,
    setSelectedDistrict,
    isInspectorOpen,
    setIsInspectorOpen,
    inspectDistrict: handleSelectDistrictForInspection,
  };
}
