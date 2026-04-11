// src/features/leads/hooks/useLeadDetail.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import leadsApi, {
  type Lead,
  type LeadActivity,
  type LeadsApiMode,
  type UpdateLeadInput,
} from "../api/leadsApi";

export type UseLeadDetailOptions = {
  mode?: LeadsApiMode;
  autoLoad?: boolean;
};

export type UseLeadDetailResult = {
  leadId: string;
  lead: Lead | null;
  activities: LeadActivity[];
  loading: boolean;
  activityLoading: boolean;
  error: string | null;
  notFound: boolean;
  mode: LeadsApiMode;
  refresh: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  goBack: () => void;
  updateLead: (
    updates: UpdateLeadInput,
    options?: { updatedBy?: string }
  ) => Promise<Lead | null>;
  deleteLead: () => Promise<boolean>;
  addActivity: (
    input: Omit<LeadActivity, "id" | "leadId" | "createdAt"> & {
      createdAt?: string;
    }
  ) => Promise<LeadActivity | null>;
};

const LEADS_FILTERS_STORAGE_KEY = "mei-crm-lead-filters";

function buildSearchFromState(
  state: unknown
): { from?: string; search?: string } | null {
  if (!state || typeof state !== "object") return null;

  const value = state as Record<string, unknown>;
  const from = typeof value.from === "string" ? value.from : undefined;
  const search = typeof value.search === "string" ? value.search : undefined;

  return { from, search };
}

export default function useLeadDetail(
  options: UseLeadDetailOptions = {}
): UseLeadDetailResult {
  const { mode = "auto", autoLoad = true } = options;

  const { leadId = "" } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(autoLoad);
  const [activityLoading, setActivityLoading] = useState<boolean>(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const loadLead = useCallback(async () => {
    if (!leadId) {
      setLead(null);
      setError("Lead ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await leadsApi.getLeadById(leadId, { mode });
      setLead(response);

      if (!response) {
        setError(null);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load lead.";
      setError(message);
      setLead(null);
    } finally {
      setLoading(false);
    }
  }, [leadId, mode]);

  const loadActivities = useCallback(async () => {
    if (!leadId) {
      setActivities([]);
      setActivityLoading(false);
      return;
    }

    setActivityLoading(true);

    try {
      const response = await leadsApi.getLeadActivities(leadId, { mode });
      setActivities(response);
    } catch {
      setActivities([]);
    } finally {
      setActivityLoading(false);
    }
  }, [leadId, mode]);

  const refresh = useCallback(async () => {
    await Promise.all([loadLead(), loadActivities()]);
  }, [loadLead, loadActivities]);

  const refreshActivities = useCallback(async () => {
    await loadActivities();
  }, [loadActivities]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadLead();
  }, [autoLoad, loadLead]);

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
      const savedFilters = window.localStorage.getItem(LEADS_FILTERS_STORAGE_KEY);

      if (savedFilters) {
        const normalized = savedFilters.startsWith("?")
          ? savedFilters
          : `?${savedFilters}`;
        navigate(`/leads${normalized}`);
        return;
      }
    }

    navigate("/leads");
  }, [location.state, navigate]);

  const updateLead = useCallback(
    async (
      updates: UpdateLeadInput,
      apiOptions?: { updatedBy?: string }
    ): Promise<Lead | null> => {
      if (!leadId) return null;

      try {
        const updated = await leadsApi.updateLead(leadId, updates, {
          mode,
          updatedBy: apiOptions?.updatedBy,
        });

        if (updated) {
          setLead(updated);
          await loadActivities();
        }

        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update lead.";
        setError(message);
        return null;
      }
    },
    [leadId, loadActivities, mode]
  );

  const deleteLead = useCallback(async (): Promise<boolean> => {
    if (!leadId) return false;

    try {
      const success = await leadsApi.deleteLead(leadId, { mode });

      if (success) {
        setLead(null);
        setActivities([]);
      }

      return success;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete lead.";
      setError(message);
      return false;
    }
  }, [leadId, mode]);

  const addActivity = useCallback(
    async (
      input: Omit<LeadActivity, "id" | "leadId" | "createdAt"> & {
        createdAt?: string;
      }
    ): Promise<LeadActivity | null> => {
      if (!leadId) return null;

      try {
        const created = await leadsApi.addLeadActivity(leadId, input, { mode });

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
    [leadId, mode]
  );

  const notFound = useMemo(
    () => !loading && !error && !lead,
    [loading, error, lead]
  );

  return {
    leadId,
    lead,
    activities,
    loading,
    activityLoading,
    error,
    notFound,
    mode,
    refresh,
    refreshActivities,
    goBack,
    updateLead,
    deleteLead,
    addActivity,
  };
}