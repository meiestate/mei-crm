// src/features/deals/hooks/useDealDetail.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dealsApi, {
  type Deal,
  type DealActivity,
  type DealsApiMode,
  type UpdateDealInput,
} from "../api/dealsApi";

export type UseDealDetailOptions = {
  mode?: DealsApiMode;
  autoLoad?: boolean;
};

export type UseDealDetailResult = {
  dealId: string;
  deal: Deal | null;
  activities: DealActivity[];
  loading: boolean;
  activityLoading: boolean;
  error: string | null;
  notFound: boolean;
  mode: DealsApiMode;
  refresh: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  goBack: () => void;
  updateDeal: (
    updates: UpdateDealInput,
    options?: { updatedBy?: string }
  ) => Promise<Deal | null>;
  deleteDeal: () => Promise<boolean>;
  addActivity: (
    input: Omit<DealActivity, "id" | "dealId" | "createdAt"> & {
      createdAt?: string;
    }
  ) => Promise<DealActivity | null>;
};

const DEALS_FILTERS_STORAGE_KEY = "mei-crm-deal-filters";

function buildSearchFromState(
  state: unknown
): { from?: string; search?: string } | null {
  if (!state || typeof state !== "object") return null;

  const value = state as Record<string, unknown>;
  const from = typeof value.from === "string" ? value.from : undefined;
  const search = typeof value.search === "string" ? value.search : undefined;

  return { from, search };
}

export default function useDealDetail(
  options: UseDealDetailOptions = {}
): UseDealDetailResult {
  const { mode = "auto", autoLoad = true } = options;

  const { dealId = "" } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [activities, setActivities] = useState<DealActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(autoLoad);
  const [activityLoading, setActivityLoading] = useState<boolean>(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const loadDeal = useCallback(async () => {
    if (!dealId) {
      setDeal(null);
      setError("Deal ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await dealsApi.getDealById(dealId, { mode });
      setDeal(response);

      if (!response) {
        setError(null);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load deal.";
      setError(message);
      setDeal(null);
    } finally {
      setLoading(false);
    }
  }, [dealId, mode]);

  const loadActivities = useCallback(async () => {
    if (!dealId) {
      setActivities([]);
      setActivityLoading(false);
      return;
    }

    setActivityLoading(true);

    try {
      const response = await dealsApi.getDealActivities(dealId, { mode });
      setActivities(response);
    } catch {
      setActivities([]);
    } finally {
      setActivityLoading(false);
    }
  }, [dealId, mode]);

  const refresh = useCallback(async () => {
    await Promise.all([loadDeal(), loadActivities()]);
  }, [loadDeal, loadActivities]);

  const refreshActivities = useCallback(async () => {
    await loadActivities();
  }, [loadActivities]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadDeal();
  }, [autoLoad, loadDeal]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadActivities();
  }, [autoLoad, loadActivities]);

  const goBack = useCallback(() => {
    const routeState = buildSearchFromState(location.state);

    if (routeState?.from) {
      navigate(`${routeState.from}${routeState.search ?? ""}`);
      return;
    }

    if (typeof window !== "undefined") {
      const savedFilters = window.localStorage.getItem(DEALS_FILTERS_STORAGE_KEY);

      if (savedFilters) {
        const normalized = savedFilters.startsWith("?")
          ? savedFilters
          : `?${savedFilters}`;
        navigate(`/deals${normalized}`);
        return;
      }
    }

    navigate("/deals");
  }, [location.state, navigate]);

  const updateDeal = useCallback(
    async (
      updates: UpdateDealInput,
      apiOptions?: { updatedBy?: string }
    ): Promise<Deal | null> => {
      if (!dealId) return null;

      try {
        const updated = await dealsApi.updateDeal(dealId, updates, {
          mode,
          updatedBy: apiOptions?.updatedBy,
        });

        if (updated) {
          setDeal(updated);
          await loadActivities();
        }

        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update deal.";
        setError(message);
        return null;
      }
    },
    [dealId, loadActivities, mode]
  );

  const deleteDeal = useCallback(async (): Promise<boolean> => {
    if (!dealId) return false;

    try {
      const success = await dealsApi.deleteDeal(dealId, { mode });

      if (success) {
        setDeal(null);
        setActivities([]);
      }

      return success;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete deal.";
      setError(message);
      return false;
    }
  }, [dealId, mode]);

  const addActivity = useCallback(
    async (
      input: Omit<DealActivity, "id" | "dealId" | "createdAt"> & {
        createdAt?: string;
      }
    ): Promise<DealActivity | null> => {
      if (!dealId) return null;

      try {
        const created = await dealsApi.addDealActivity(dealId, input, { mode });
        setActivities((prev) =>
          [created, ...prev].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
        return created;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to add activity.";
        setError(message);
        return null;
      }
    },
    [dealId, mode]
  );

  const notFound = useMemo(
    () => !loading && !error && !deal,
    [loading, error, deal]
  );

  return {
    dealId,
    deal,
    activities,
    loading,
    activityLoading,
    error,
    notFound,
    mode,
    refresh,
    refreshActivities,
    goBack,
    updateDeal,
    deleteDeal,
    addActivity,
  };
}