import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AnalyticsDateRangeKey =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "thisYear"
  | "custom";

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  dateRange?: AnalyticsDateRangeKey;
  compareStartDate?: string;
  compareEndDate?: string;
  compareEnabled?: boolean;
  ownerIds?: string[];
  agentIds?: string[];
  teamIds?: string[];
  sourceIds?: string[];
  campaignIds?: string[];
  projectIds?: string[];
  stageIds?: string[];
  locationIds?: string[];
  statuses?: string[];
  channels?: string[];
  priorities?: string[];
  tags?: string[];
  search?: string;
  segment?: string;
  groupBy?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AnalyticsFilterState {
  filters: AnalyticsFilters;
  setFilters: (filters: AnalyticsFilters) => void;
  patchFilters: (filters: Partial<AnalyticsFilters>) => void;
  resetFilters: () => void;
  clearCompareFilters: () => void;
  clearPagination: () => void;
  setDateRange: (
    dateRange: AnalyticsDateRangeKey,
    startDate?: string,
    endDate?: string
  ) => void;
  toggleCompare: (enabled: boolean) => void;
  setCompareRange: (startDate?: string, endDate?: string) => void;
  getActiveFilterCount: () => number;
  buildApiFilters: () => AnalyticsFilters;
}

export const ANALYTICS_FILTER_STORAGE_KEY = "mei-analytics-filters";

export const getDefaultAnalyticsFilters = (): AnalyticsFilters => ({
  dateRange: "last30days",
  startDate: undefined,
  endDate: undefined,
  compareStartDate: undefined,
  compareEndDate: undefined,
  compareEnabled: false,
  ownerIds: [],
  agentIds: [],
  teamIds: [],
  sourceIds: [],
  campaignIds: [],
  projectIds: [],
  stageIds: [],
  locationIds: [],
  statuses: [],
  channels: [],
  priorities: [],
  tags: [],
  search: "",
  segment: undefined,
  groupBy: undefined,
  page: 1,
  limit: 10,
  sortBy: undefined,
  sortOrder: "desc",
});

const isNonEmptyArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value) && value.length > 0;
};

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

const removeEmptyValues = (filters: AnalyticsFilters): AnalyticsFilters => {
  const next: AnalyticsFilters = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        (next as Record<string, unknown>)[key] = value;
      }
      return;
    }

    if (typeof value === "string") {
      if (value.trim() !== "") {
        (next as Record<string, unknown>)[key] = value;
      }
      return;
    }

    if (value !== undefined && value !== null) {
      (next as Record<string, unknown>)[key] = value;
    }
  });

  return next;
};

const calculateActiveFilterCount = (filters: AnalyticsFilters): number => {
  let count = 0;

  if (
    filters.dateRange &&
    filters.dateRange !== getDefaultAnalyticsFilters().dateRange
  ) {
    count += 1;
  }

  if (isNonEmptyString(filters.startDate)) count += 1;
  if (isNonEmptyString(filters.endDate)) count += 1;

  if (isNonEmptyArray(filters.ownerIds)) count += 1;
  if (isNonEmptyArray(filters.agentIds)) count += 1;
  if (isNonEmptyArray(filters.teamIds)) count += 1;
  if (isNonEmptyArray(filters.sourceIds)) count += 1;
  if (isNonEmptyArray(filters.campaignIds)) count += 1;
  if (isNonEmptyArray(filters.projectIds)) count += 1;
  if (isNonEmptyArray(filters.stageIds)) count += 1;
  if (isNonEmptyArray(filters.locationIds)) count += 1;
  if (isNonEmptyArray(filters.statuses)) count += 1;
  if (isNonEmptyArray(filters.channels)) count += 1;
  if (isNonEmptyArray(filters.priorities)) count += 1;
  if (isNonEmptyArray(filters.tags)) count += 1;

  if (isNonEmptyString(filters.search)) count += 1;
  if (isNonEmptyString(filters.segment)) count += 1;
  if (isNonEmptyString(filters.groupBy)) count += 1;
  if (isNonEmptyString(filters.sortBy)) count += 1;

  return count;
};

export const useAnalyticsFilterStore = create<AnalyticsFilterState>()(
  persist(
    (set, get) => ({
      filters: getDefaultAnalyticsFilters(),

      setFilters: (filters: AnalyticsFilters) => {
        set({
          filters: {
            ...getDefaultAnalyticsFilters(),
            ...filters,
          },
        });
      },

      patchFilters: (filters: Partial<AnalyticsFilters>) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...filters,
            page: filters.page ?? 1,
          },
        }));
      },

      resetFilters: () => {
        set({
          filters: getDefaultAnalyticsFilters(),
        });
      },

      clearCompareFilters: () => {
        set((state) => ({
          filters: {
            ...state.filters,
            compareEnabled: false,
            compareStartDate: undefined,
            compareEndDate: undefined,
          },
        }));
      },

      clearPagination: () => {
        set((state) => ({
          filters: {
            ...state.filters,
            page: 1,
          },
        }));
      },

      setDateRange: (
        dateRange: AnalyticsDateRangeKey,
        startDate?: string,
        endDate?: string
      ) => {
        set((state) => ({
          filters: {
            ...state.filters,
            dateRange,
            startDate,
            endDate,
            page: 1,
          },
        }));
      },

      toggleCompare: (enabled: boolean) => {
        set((state) => ({
          filters: {
            ...state.filters,
            compareEnabled: enabled,
            compareStartDate: enabled
              ? state.filters.compareStartDate
              : undefined,
            compareEndDate: enabled
              ? state.filters.compareEndDate
              : undefined,
          },
        }));
      },

      setCompareRange: (startDate?: string, endDate?: string) => {
        set((state) => ({
          filters: {
            ...state.filters,
            compareEnabled: true,
            compareStartDate: startDate,
            compareEndDate: endDate,
          },
        }));
      },

      getActiveFilterCount: () => {
        return calculateActiveFilterCount(get().filters);
      },

      buildApiFilters: () => {
        return removeEmptyValues(get().filters);
      },
    }),
    {
      name: ANALYTICS_FILTER_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);

export const selectAnalyticsFilters = (
  state: AnalyticsFilterState
): AnalyticsFilters => state.filters;

export const selectAnalyticsActiveFilterCount = (
  state: AnalyticsFilterState
): number => state.getActiveFilterCount();

export const selectAnalyticsApiFilters = (
  state: AnalyticsFilterState
): AnalyticsFilters => state.buildApiFilters();

export default useAnalyticsFilterStore;