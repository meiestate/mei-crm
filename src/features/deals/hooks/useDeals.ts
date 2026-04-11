// src/features/deals/hooks/useDeals.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import dealsApi, {
  type CreateDealInput,
  type Deal,
  type DealFilters,
  type DealPipelineStageSummary,
  type DealsApiMode,
  type UpdateDealInput,
} from "../api/dealsApi";

export type DealSortKey =
  | "title"
  | "value"
  | "expectedValue"
  | "status"
  | "stage"
  | "owner"
  | "source"
  | "priority"
  | "expectedCloseDate"
  | "updatedAt"
  | "createdAt";

export type DealSortDirection = "asc" | "desc";

export type UseDealsFilters = DealFilters & {
  sortBy: DealSortKey;
  sortDirection: DealSortDirection;
};

export type UseDealsOptions = {
  mode?: DealsApiMode;
  autoLoad?: boolean;
  defaultPageSize?: number;
};

export type UseDealsResult = {
  deals: Deal[];
  filteredDeals: Deal[];
  paginatedDeals: Deal[];
  pipelineSummary: DealPipelineStageSummary[];
  loading: boolean;
  pipelineLoading: boolean;
  error: string | null;
  mode: DealsApiMode;
  filters: UseDealsFilters;
  selectedIds: string[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasSelection: boolean;
  allVisibleSelected: boolean;
  ownerOptions: string[];
  sourceOptions: string[];
  stageOptions: string[];
  statusOptions: string[];
  priorityOptions: string[];
  totalPipelineValue: number;
  setFilters: (updates: Partial<UseDealsFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  refresh: () => Promise<void>;
  refreshPipelineSummary: () => Promise<void>;
  createDeal: (
    input: CreateDealInput,
    options?: { createdBy?: string }
  ) => Promise<Deal | null>;
  updateDeal: (
    dealId: string,
    updates: UpdateDealInput,
    options?: { updatedBy?: string }
  ) => Promise<Deal | null>;
  deleteDeal: (dealId: string) => Promise<boolean>;
  deleteSelectedDeals: () => Promise<boolean>;
  toggleSelect: (dealId: string) => void;
  toggleSelectAllVisible: () => void;
  clearSelection: () => void;
  openDealDetail: (dealId: string) => void;
};

const DEALS_FILTERS_STORAGE_KEY = "mei-crm-deal-filters";
const DEFAULT_PAGE_SIZE = 10;

const DEFAULT_FILTERS: UseDealsFilters = {
  search: "",
  status: "",
  stage: "",
  owner: "",
  source: "",
  priority: "",
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

function serializeFilters(filters: UseDealsFilters): string {
  return new URLSearchParams({
    search: filters.search ?? "",
    status: filters.status ?? "",
    stage: filters.stage ?? "",
    owner: filters.owner ?? "",
    source: filters.source ?? "",
    priority: filters.priority ?? "",
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection,
  }).toString();
}

function getFiltersFromSearchParams(searchParams: URLSearchParams): UseDealsFilters {
  const sortByParam = searchParams.get("sortBy");
  const sortDirectionParam = searchParams.get("sortDirection");

  const sortBy: DealSortKey =
    sortByParam === "title" ||
    sortByParam === "value" ||
    sortByParam === "expectedValue" ||
    sortByParam === "status" ||
    sortByParam === "stage" ||
    sortByParam === "owner" ||
    sortByParam === "source" ||
    sortByParam === "priority" ||
    sortByParam === "expectedCloseDate" ||
    sortByParam === "updatedAt" ||
    sortByParam === "createdAt"
      ? sortByParam
      : DEFAULT_FILTERS.sortBy;

  const sortDirection: DealSortDirection =
    sortDirectionParam === "asc" || sortDirectionParam === "desc"
      ? sortDirectionParam
      : DEFAULT_FILTERS.sortDirection;

  return {
    search: searchParams.get("search") ?? DEFAULT_FILTERS.search,
    status: searchParams.get("status") ?? DEFAULT_FILTERS.status,
    stage: searchParams.get("stage") ?? DEFAULT_FILTERS.stage,
    owner: searchParams.get("owner") ?? DEFAULT_FILTERS.owner,
    source: searchParams.get("source") ?? DEFAULT_FILTERS.source,
    priority: searchParams.get("priority") ?? DEFAULT_FILTERS.priority,
    sortBy,
    sortDirection,
  };
}

function compareDeals(
  a: Deal,
  b: Deal,
  sortBy: DealSortKey,
  sortDirection: DealSortDirection
): number {
  let result = 0;

  switch (sortBy) {
    case "title":
      result = (a.title ?? "").localeCompare(b.title ?? "");
      break;
    case "value":
      result = toNumber(a.value) - toNumber(b.value);
      break;
    case "expectedValue":
      result = toNumber(a.expectedValue) - toNumber(b.expectedValue);
      break;
    case "status":
      result = (a.status ?? "").localeCompare(b.status ?? "");
      break;
    case "stage":
      result = (a.stage ?? "").localeCompare(b.stage ?? "");
      break;
    case "owner":
      result = (a.owner ?? "").localeCompare(b.owner ?? "");
      break;
    case "source":
      result = (a.source ?? "").localeCompare(b.source ?? "");
      break;
    case "priority":
      result = (a.priority ?? "").localeCompare(b.priority ?? "");
      break;
    case "expectedCloseDate":
      result = toTimestamp(a.expectedCloseDate) - toTimestamp(b.expectedCloseDate);
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

export default function useDeals(
  options: UseDealsOptions = {}
): UseDealsResult {
  const { mode = "auto", autoLoad = true, defaultPageSize = DEFAULT_PAGE_SIZE } =
    options;

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [pipelineSummary, setPipelineSummary] = useState<DealPipelineStageSummary[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(autoLoad);
  const [pipelineLoading, setPipelineLoading] = useState<boolean>(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFiltersState] = useState<UseDealsFilters>(() => {
    const fromUrl = getFiltersFromSearchParams(searchParams);
    const hasAnyUrlFilter = Array.from(searchParams.keys()).length > 0;

    if (hasAnyUrlFilter) return fromUrl;

    if (typeof window !== "undefined") {
      const saved = safeJsonParse<Partial<UseDealsFilters>>(
        window.localStorage.getItem(DEALS_FILTERS_STORAGE_KEY),
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

  const loadDeals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await dealsApi.getDeals({
        mode,
        filters: {
          search: filters.search || undefined,
          status: filters.status || undefined,
          stage: filters.stage || undefined,
          owner: filters.owner || undefined,
          source: filters.source || undefined,
          priority: filters.priority || undefined,
        },
      });

      setDeals(response.items);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load deals.";
      setError(message);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, [
    mode,
    filters.search,
    filters.status,
    filters.stage,
    filters.owner,
    filters.source,
    filters.priority,
  ]);

  const loadPipelineSummary = useCallback(async () => {
    setPipelineLoading(true);

    try {
      const response = await dealsApi.getPipelineSummary({
        mode,
        filters: {
          search: filters.search || undefined,
          status: filters.status || undefined,
          stage: filters.stage || undefined,
          owner: filters.owner || undefined,
          source: filters.source || undefined,
          priority: filters.priority || undefined,
        },
      });

      setPipelineSummary(response);
    } catch {
      setPipelineSummary([]);
    } finally {
      setPipelineLoading(false);
    }
  }, [
    mode,
    filters.search,
    filters.status,
    filters.stage,
    filters.owner,
    filters.source,
    filters.priority,
  ]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadDeals();
  }, [autoLoad, loadDeals]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadPipelineSummary();
  }, [autoLoad, loadPipelineSummary]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      DEALS_FILTERS_STORAGE_KEY,
      JSON.stringify(filters)
    );
    setSearchParams(serializeFilters(filters), { replace: true });
  }, [filters, setSearchParams]);

  const filteredDeals = useMemo(() => {
    return [...deals].sort((a, b) =>
      compareDeals(a, b, filters.sortBy, filters.sortDirection)
    );
  }, [deals, filters.sortBy, filters.sortDirection]);

  const totalCount = filteredDeals.length;
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
    filters.stage,
    filters.owner,
    filters.source,
    filters.priority,
    filters.sortBy,
    filters.sortDirection,
    pageSize,
  ]);

  const paginatedDeals = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredDeals.slice(startIndex, startIndex + pageSize);
  }, [filteredDeals, page, pageSize]);

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => deals.some((deal) => deal.id === id))
    );
  }, [deals]);

  const ownerOptions = useMemo(
    () => uniqueSorted(deals.map((deal) => normalizeString(deal.owner))),
    [deals]
  );

  const sourceOptions = useMemo(
    () => uniqueSorted(deals.map((deal) => normalizeString(deal.source))),
    [deals]
  );

  const stageOptions = useMemo(
    () => uniqueSorted(deals.map((deal) => normalizeString(deal.stage))),
    [deals]
  );

  const statusOptions = useMemo(
    () => uniqueSorted(deals.map((deal) => normalizeString(deal.status))),
    [deals]
  );

  const priorityOptions = useMemo(
    () => uniqueSorted(deals.map((deal) => normalizeString(deal.priority))),
    [deals]
  );

  const totalPipelineValue = useMemo(() => {
    return filteredDeals.reduce((sum, deal) => {
      return sum + (toNumber(deal.value) || toNumber(deal.expectedValue));
    }, 0);
  }, [filteredDeals]);

  const setFilters = useCallback((updates: Partial<UseDealsFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([loadDeals(), loadPipelineSummary()]);
  }, [loadDeals, loadPipelineSummary]);

  const refreshPipelineSummary = useCallback(async () => {
    await loadPipelineSummary();
  }, [loadPipelineSummary]);

  const createDeal = useCallback(
    async (
      input: CreateDealInput,
      options?: { createdBy?: string }
    ): Promise<Deal | null> => {
      try {
        const created = await dealsApi.createDeal(input, {
          mode,
          createdBy: options?.createdBy,
        });

        await refresh();
        return created;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create deal.";
        setError(message);
        return null;
      }
    },
    [mode, refresh]
  );

  const updateDeal = useCallback(
    async (
      dealId: string,
      updates: UpdateDealInput,
      options?: { updatedBy?: string }
    ): Promise<Deal | null> => {
      try {
        const updated = await dealsApi.updateDeal(dealId, updates, {
          mode,
          updatedBy: options?.updatedBy,
        });

        await refresh();
        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update deal.";
        setError(message);
        return null;
      }
    },
    [mode, refresh]
  );

  const deleteDeal = useCallback(
    async (dealId: string): Promise<boolean> => {
      try {
        const success = await dealsApi.deleteDeal(dealId, { mode });

        if (success) {
          setSelectedIds((prev) => prev.filter((id) => id !== dealId));
          await refresh();
        }

        return success;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete deal.";
        setError(message);
        return false;
      }
    },
    [mode, refresh]
  );

  const deleteSelectedDeals = useCallback(async (): Promise<boolean> => {
    if (selectedIds.length === 0) return true;

    try {
      const results = await Promise.all(
        selectedIds.map((dealId) => dealsApi.deleteDeal(dealId, { mode }))
      );

      const success = results.every(Boolean);

      if (success) {
        setSelectedIds([]);
        await refresh();
      }

      return success;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete selected deals.";
      setError(message);
      return false;
    }
  }, [mode, refresh, selectedIds]);

  const toggleSelect = useCallback((dealId: string) => {
    setSelectedIds((prev) =>
      prev.includes(dealId)
        ? prev.filter((id) => id !== dealId)
        : [...prev, dealId]
    );
  }, []);

  const allVisibleSelected = useMemo(() => {
    if (paginatedDeals.length === 0) return false;
    return paginatedDeals.every((deal) => selectedIds.includes(deal.id));
  }, [paginatedDeals, selectedIds]);

  const toggleSelectAllVisible = useCallback(() => {
    const visibleIds = paginatedDeals.map((deal) => deal.id);

    if (visibleIds.length === 0) return;

    setSelectedIds((prev) => {
      const prevSet = new Set(prev);
      const everySelected = visibleIds.every((id) => prevSet.has(id));

      if (everySelected) {
        return prev.filter((id) => !visibleIds.includes(id));
      }

      return Array.from(new Set([...prev, ...visibleIds]));
    });
  }, [paginatedDeals]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const openDealDetail = useCallback(
    (dealId: string) => {
      navigate(`/deals/${dealId}`, {
        state: {
          from: "/deals",
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
    deals,
    filteredDeals,
    paginatedDeals,
    pipelineSummary,
    loading,
    pipelineLoading,
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
    stageOptions,
    statusOptions,
    priorityOptions,
    totalPipelineValue,
    setFilters,
    resetFilters,
    setPage,
    setPageSize,
    refresh,
    refreshPipelineSummary,
    createDeal,
    updateDeal,
    deleteDeal,
    deleteSelectedDeals,
    toggleSelect,
    toggleSelectAllVisible,
    clearSelection,
    openDealDetail,
  };
}