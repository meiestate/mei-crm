// src/features/leads/hooks/useLeads.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import leadsApi, {
  type CreateLeadInput,
  type Lead,
  type LeadFilters,
  type LeadSourceSummary,
  type LeadStatusSummary,
  type LeadsApiMode,
  type UpdateLeadInput,
} from "../api/leadsApi";

export type LeadSortKey =
  | "name"
  | "status"
  | "priority"
  | "source"
  | "owner"
  | "budget"
  | "expectedValue"
  | "city"
  | "propertyType"
  | "followUpDate"
  | "updatedAt"
  | "createdAt";

export type LeadSortDirection = "asc" | "desc";

export type UseLeadsFilters = LeadFilters & {
  sortBy: LeadSortKey;
  sortDirection: LeadSortDirection;
};

export type UseLeadsOptions = {
  mode?: LeadsApiMode;
  autoLoad?: boolean;
  defaultPageSize?: number;
};

export type UseLeadsResult = {
  leads: Lead[];
  filteredLeads: Lead[];
  paginatedLeads: Lead[];
  sourceSummary: LeadSourceSummary[];
  statusSummary: LeadStatusSummary[];
  loading: boolean;
  summaryLoading: boolean;
  error: string | null;
  mode: LeadsApiMode;
  filters: UseLeadsFilters;
  selectedIds: string[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasSelection: boolean;
  allVisibleSelected: boolean;
  ownerOptions: string[];
  sourceOptions: string[];
  statusOptions: string[];
  priorityOptions: string[];
  propertyTypeOptions: string[];
  cityOptions: string[];
  totalBudget: number;
  totalExpectedValue: number;
  setFilters: (updates: Partial<UseLeadsFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  refresh: () => Promise<void>;
  refreshSummaries: () => Promise<void>;
  createLead: (
    input: CreateLeadInput,
    options?: { createdBy?: string }
  ) => Promise<Lead | null>;
  updateLead: (
    leadId: string,
    updates: UpdateLeadInput,
    options?: { updatedBy?: string }
  ) => Promise<Lead | null>;
  deleteLead: (leadId: string) => Promise<boolean>;
  deleteSelectedLeads: () => Promise<boolean>;
  toggleSelect: (leadId: string) => void;
  toggleSelectAllVisible: () => void;
  clearSelection: () => void;
  openLeadDetail: (leadId: string) => void;
};

const LEADS_FILTERS_STORAGE_KEY = "mei-crm-lead-filters";
const DEFAULT_PAGE_SIZE = 10;

const DEFAULT_FILTERS: UseLeadsFilters = {
  search: "",
  status: "",
  owner: "",
  source: "",
  priority: "",
  propertyType: "",
  city: "",
  sortBy: "updatedAt",
  sortDirection: "desc",
};

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b)
  );
}

function toTimestamp(value?: string): number {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function toNumber(value?: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function serializeFilters(filters: UseLeadsFilters): string {
  return new URLSearchParams({
    search: filters.search ?? "",
    status: filters.status ?? "",
    owner: filters.owner ?? "",
    source: filters.source ?? "",
    priority: filters.priority ?? "",
    propertyType: filters.propertyType ?? "",
    city: filters.city ?? "",
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection,
  }).toString();
}

function getFiltersFromSearchParams(searchParams: URLSearchParams): UseLeadsFilters {
  const sortByParam = searchParams.get("sortBy");
  const sortDirectionParam = searchParams.get("sortDirection");

  const sortBy: LeadSortKey =
    sortByParam === "name" ||
    sortByParam === "status" ||
    sortByParam === "priority" ||
    sortByParam === "source" ||
    sortByParam === "owner" ||
    sortByParam === "budget" ||
    sortByParam === "expectedValue" ||
    sortByParam === "city" ||
    sortByParam === "propertyType" ||
    sortByParam === "followUpDate" ||
    sortByParam === "updatedAt" ||
    sortByParam === "createdAt"
      ? sortByParam
      : DEFAULT_FILTERS.sortBy;

  const sortDirection: LeadSortDirection =
    sortDirectionParam === "asc" || sortDirectionParam === "desc"
      ? sortDirectionParam
      : DEFAULT_FILTERS.sortDirection;

  return {
    search: searchParams.get("search") ?? DEFAULT_FILTERS.search,
    status: searchParams.get("status") ?? DEFAULT_FILTERS.status,
    owner: searchParams.get("owner") ?? DEFAULT_FILTERS.owner,
    source: searchParams.get("source") ?? DEFAULT_FILTERS.source,
    priority: searchParams.get("priority") ?? DEFAULT_FILTERS.priority,
    propertyType:
      searchParams.get("propertyType") ?? DEFAULT_FILTERS.propertyType,
    city: searchParams.get("city") ?? DEFAULT_FILTERS.city,
    sortBy,
    sortDirection,
  };
}

function compareLeads(
  a: Lead,
  b: Lead,
  sortBy: LeadSortKey,
  sortDirection: LeadSortDirection
): number {
  let result = 0;

  switch (sortBy) {
    case "name":
      result = (a.name ?? "").localeCompare(b.name ?? "");
      break;
    case "status":
      result = (a.status ?? "").localeCompare(b.status ?? "");
      break;
    case "priority":
      result = (a.priority ?? "").localeCompare(b.priority ?? "");
      break;
    case "source":
      result = (a.source ?? "").localeCompare(b.source ?? "");
      break;
    case "owner":
      result = (a.owner ?? "").localeCompare(b.owner ?? "");
      break;
    case "budget":
      result = toNumber(a.budget) - toNumber(b.budget);
      break;
    case "expectedValue":
      result = toNumber(a.expectedValue) - toNumber(b.expectedValue);
      break;
    case "city":
      result = (a.city ?? "").localeCompare(b.city ?? "");
      break;
    case "propertyType":
      result = (a.propertyType ?? "").localeCompare(b.propertyType ?? "");
      break;
    case "followUpDate":
      result =
        toTimestamp(a.followUpDate ?? a.nextFollowUpDate) -
        toTimestamp(b.followUpDate ?? b.nextFollowUpDate);
      break;
    case "createdAt":
      result = toTimestamp(a.createdAt) - toTimestamp(b.createdAt);
      break;
    case "updatedAt":
    default:
      result = toTimestamp(a.updatedAt) - toTimestamp(b.updatedAt);
      break;
  }

  return sortDirection === "asc" ? result : -result;
}

export default function useLeads(
  options: UseLeadsOptions = {}
): UseLeadsResult {
  const { mode = "auto", autoLoad = true, defaultPageSize = DEFAULT_PAGE_SIZE } =
    options;

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [sourceSummary, setSourceSummary] = useState<LeadSourceSummary[]>([]);
  const [statusSummary, setStatusSummary] = useState<LeadStatusSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(autoLoad);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFiltersState] = useState<UseLeadsFilters>(() => {
    const fromUrl = getFiltersFromSearchParams(searchParams);
    const hasAnyUrlFilter = Array.from(searchParams.keys()).length > 0;

    if (hasAnyUrlFilter) return fromUrl;

    if (typeof window !== "undefined") {
      const saved = safeJsonParse<Partial<UseLeadsFilters>>(
        window.localStorage.getItem(LEADS_FILTERS_STORAGE_KEY),
        {}
      );

      return {
        ...DEFAULT_FILTERS,
        ...saved,
      };
    }

    return DEFAULT_FILTERS;
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPageState] = useState<number>(1);
  const [pageSize, setPageSizeState] = useState<number>(
    Math.max(1, defaultPageSize)
  );

  const apiFilters = useMemo<LeadFilters>(
    () => ({
      search: filters.search || undefined,
      status: filters.status || undefined,
      owner: filters.owner || undefined,
      source: filters.source || undefined,
      priority: filters.priority || undefined,
      propertyType: filters.propertyType || undefined,
      city: filters.city || undefined,
    }),
    [
      filters.search,
      filters.status,
      filters.owner,
      filters.source,
      filters.priority,
      filters.propertyType,
      filters.city,
    ]
  );

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await leadsApi.getLeads({
        mode,
        filters: apiFilters,
      });

      setLeads(response.items);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load leads.";
      setError(message);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [mode, apiFilters]);

  const loadSummaries = useCallback(async () => {
    setSummaryLoading(true);

    try {
      const [sources, statuses] = await Promise.all([
        leadsApi.getLeadSourceSummary({
          mode,
          filters: apiFilters,
        }),
        leadsApi.getLeadStatusSummary({
          mode,
          filters: apiFilters,
        }),
      ]);

      setSourceSummary(sources);
      setStatusSummary(statuses);
    } catch {
      setSourceSummary([]);
      setStatusSummary([]);
    } finally {
      setSummaryLoading(false);
    }
  }, [mode, apiFilters]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadLeads();
  }, [autoLoad, loadLeads]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadSummaries();
  }, [autoLoad, loadSummaries]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      LEADS_FILTERS_STORAGE_KEY,
      JSON.stringify(filters)
    );
    setSearchParams(serializeFilters(filters), { replace: true });
  }, [filters, setSearchParams]);

  const filteredLeads = useMemo(() => {
    return [...leads].sort((a, b) =>
      compareLeads(a, b, filters.sortBy, filters.sortDirection)
    );
  }, [leads, filters.sortBy, filters.sortDirection]);

  const totalCount = filteredLeads.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPageState(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    setPageState(1);
  }, [
    filters.search,
    filters.status,
    filters.owner,
    filters.source,
    filters.priority,
    filters.propertyType,
    filters.city,
    filters.sortBy,
    filters.sortDirection,
    pageSize,
  ]);

  const paginatedLeads = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredLeads.slice(startIndex, startIndex + pageSize);
  }, [filteredLeads, page, pageSize]);

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => leads.some((lead) => lead.id === id))
    );
  }, [leads]);

  const ownerOptions = useMemo(
    () => uniqueSorted(leads.map((lead) => normalizeString(lead.owner))),
    [leads]
  );

  const sourceOptions = useMemo(
    () => uniqueSorted(leads.map((lead) => normalizeString(lead.source))),
    [leads]
  );

  const statusOptions = useMemo(
    () => uniqueSorted(leads.map((lead) => normalizeString(lead.status))),
    [leads]
  );

  const priorityOptions = useMemo(
    () => uniqueSorted(leads.map((lead) => normalizeString(lead.priority))),
    [leads]
  );

  const propertyTypeOptions = useMemo(
    () => uniqueSorted(leads.map((lead) => normalizeString(lead.propertyType))),
    [leads]
  );

  const cityOptions = useMemo(
    () => uniqueSorted(leads.map((lead) => normalizeString(lead.city))),
    [leads]
  );

  const totalBudget = useMemo(() => {
    return filteredLeads.reduce((sum, lead) => sum + toNumber(lead.budget), 0);
  }, [filteredLeads]);

  const totalExpectedValue = useMemo(() => {
    return filteredLeads.reduce(
      (sum, lead) => sum + toNumber(lead.expectedValue),
      0
    );
  }, [filteredLeads]);

  const setFilters = useCallback((updates: Partial<UseLeadsFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([loadLeads(), loadSummaries()]);
  }, [loadLeads, loadSummaries]);

  const refreshSummaries = useCallback(async () => {
    await loadSummaries();
  }, [loadSummaries]);

  const createLead = useCallback(
    async (
      input: CreateLeadInput,
      options?: { createdBy?: string }
    ): Promise<Lead | null> => {
      try {
        const created = await leadsApi.createLead(input, {
          mode,
          createdBy: options?.createdBy,
        });

        await refresh();
        return created;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create lead.";
        setError(message);
        return null;
      }
    },
    [mode, refresh]
  );

  const updateLead = useCallback(
    async (
      leadId: string,
      updates: UpdateLeadInput,
      options?: { updatedBy?: string }
    ): Promise<Lead | null> => {
      try {
        const updated = await leadsApi.updateLead(leadId, updates, {
          mode,
          updatedBy: options?.updatedBy,
        });

        await refresh();
        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update lead.";
        setError(message);
        return null;
      }
    },
    [mode, refresh]
  );

  const deleteLead = useCallback(
    async (leadId: string): Promise<boolean> => {
      try {
        const success = await leadsApi.deleteLead(leadId, { mode });

        if (success) {
          setSelectedIds((prev) => prev.filter((id) => id !== leadId));
          await refresh();
        }

        return success;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete lead.";
        setError(message);
        return false;
      }
    },
    [mode, refresh]
  );

  const deleteSelectedLeads = useCallback(async (): Promise<boolean> => {
    if (selectedIds.length === 0) return true;

    try {
      const results = await Promise.all(
        selectedIds.map((leadId) => leadsApi.deleteLead(leadId, { mode }))
      );

      const success = results.every(Boolean);

      if (success) {
        setSelectedIds([]);
        await refresh();
      }

      return success;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete selected leads.";
      setError(message);
      return false;
    }
  }, [mode, refresh, selectedIds]);

  const toggleSelect = useCallback((leadId: string) => {
    setSelectedIds((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  }, []);

  const allVisibleSelected = useMemo(() => {
    if (paginatedLeads.length === 0) return false;
    return paginatedLeads.every((lead) => selectedIds.includes(lead.id));
  }, [paginatedLeads, selectedIds]);

  const toggleSelectAllVisible = useCallback(() => {
    const visibleIds = paginatedLeads.map((lead) => lead.id);

    if (visibleIds.length === 0) return;

    setSelectedIds((prev) => {
      const prevSet = new Set(prev);
      const everySelected = visibleIds.every((id) => prevSet.has(id));

      if (everySelected) {
        return prev.filter((id) => !visibleIds.includes(id));
      }

      return Array.from(new Set([...prev, ...visibleIds]));
    });
  }, [paginatedLeads]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const openLeadDetail = useCallback(
    (leadId: string) => {
      navigate(`/leads/${leadId}`, {
        state: {
          from: "/leads",
          search: `?${serializeFilters(filters)}`,
        },
      });
    },
    [filters, navigate]
  );

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(1, nextPage));
  }, []);

  const setPageSize = useCallback((nextPageSize: number) => {
    setPageSizeState(Math.max(1, nextPageSize));
  }, []);

  return {
    leads,
    filteredLeads,
    paginatedLeads,
    sourceSummary,
    statusSummary,
    loading,
    summaryLoading,
    error,
    mode,
    filters,
    selectedIds,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasSelection: selectedIds.length > 0,
    allVisibleSelected,
    ownerOptions,
    sourceOptions,
    statusOptions,
    priorityOptions,
    propertyTypeOptions,
    cityOptions,
    totalBudget,
    totalExpectedValue,
    setFilters,
    resetFilters,
    setPage,
    setPageSize,
    refresh,
    refreshSummaries,
    createLead,
    updateLead,
    deleteLead,
    deleteSelectedLeads,
    toggleSelect,
    toggleSelectAllVisible,
    clearSelection,
    openLeadDetail,
  };
}