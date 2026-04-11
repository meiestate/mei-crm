// src/features/dashboard/hooks/useDashboardData.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import dashboardApi, {
  type DashboardActivityItem,
  type DashboardData,
  type DashboardKpi,
  type DashboardLeadSourceItem,
  type DashboardMode,
  type DashboardPipelineStage,
  type DashboardRecentLeadItem,
  type DashboardTaskItem,
} from "../api/dashboardApi";

export type UseDashboardDataOptions = {
  mode?: DashboardMode;
  autoLoad?: boolean;
};

export type UseDashboardDataResult = {
  data: DashboardData | null;
  kpis: DashboardKpi[];
  pipeline: DashboardPipelineStage[];
  leadSources: DashboardLeadSourceItem[];
  todayTasks: DashboardTaskItem[];
  recentActivities: DashboardActivityItem[];
  recentLeads: DashboardRecentLeadItem[];
  loading: boolean;
  error: string | null;
  mode: DashboardMode;
  lastUpdatedAt: string | null;
  refresh: () => Promise<void>;
  getKpiById: (id: DashboardKpi["id"]) => DashboardKpi | undefined;
  pipelineValue: number;
  openDealsCount: number;
  wonDealsCount: number;
  hotLeadsCount: number;
  pendingTasksCount: number;
  todayFollowUpsCount: number;
  overdueFollowUpsCount: number;
};

export default function useDashboardData(
  options: UseDashboardDataOptions = {}
): UseDashboardDataResult {
  const { mode = "auto", autoLoad = true } = options;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await dashboardApi.getDashboardData({ mode });
      setData(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load dashboard data.";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadDashboardData();
  }, [autoLoad, loadDashboardData]);

  const kpis = useMemo(() => data?.kpis ?? [], [data]);
  const pipeline = useMemo(() => data?.pipeline ?? [], [data]);
  const leadSources = useMemo(() => data?.leadSources ?? [], [data]);
  const todayTasks = useMemo(() => data?.todayTasks ?? [], [data]);
  const recentActivities = useMemo(() => data?.recentActivities ?? [], [data]);
  const recentLeads = useMemo(() => data?.recentLeads ?? [], [data]);

  const getKpiById = useCallback(
    (id: DashboardKpi["id"]) => kpis.find((item) => item.id === id),
    [kpis]
  );

  const pipelineValue = useMemo(
    () => getKpiById("pipelineValue")?.value ?? 0,
    [getKpiById]
  );

  const openDealsCount = useMemo(
    () => getKpiById("openDeals")?.value ?? 0,
    [getKpiById]
  );

  const wonDealsCount = useMemo(
    () => getKpiById("wonDeals")?.value ?? 0,
    [getKpiById]
  );

  const hotLeadsCount = useMemo(
    () => getKpiById("hotLeads")?.value ?? 0,
    [getKpiById]
  );

  const pendingTasksCount = useMemo(
    () => getKpiById("pendingTasks")?.value ?? 0,
    [getKpiById]
  );

  const todayFollowUpsCount = useMemo(
    () => getKpiById("todayFollowUps")?.value ?? 0,
    [getKpiById]
  );

  const overdueFollowUpsCount = useMemo(
    () => getKpiById("overdueFollowUps")?.value ?? 0,
    [getKpiById]
  );

  const refresh = useCallback(async () => {
    await loadDashboardData();
  }, [loadDashboardData]);

  return {
    data,
    kpis,
    pipeline,
    leadSources,
    todayTasks,
    recentActivities,
    recentLeads,
    loading,
    error,
    mode,
    lastUpdatedAt: data?.lastUpdatedAt ?? null,
    refresh,
    getKpiById,
    pipelineValue,
    openDealsCount,
    wonDealsCount,
    hotLeadsCount,
    pendingTasksCount,
    todayFollowUpsCount,
    overdueFollowUpsCount,
  };
}