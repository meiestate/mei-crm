// src/hooks/analytics/useAnalyticsFilters.ts

import { useCallback, useMemo, useState } from 'react';

export type AnalyticsPrimarySection =
  | 'overview'
  | 'pipeline'
  | 'revenue'
  | 'team'
  | 'leads'
  | 'marketing'
  | 'forecast'
  | 'risk'
  | 'geography';

export type AnalyticsDateRangeKey =
  | 'today'
  | 'last7Days'
  | 'last30Days'
  | 'last90Days'
  | 'thisMonth'
  | 'thisQuarter'
  | 'thisYear'
  | 'custom';

export interface AnalyticsDateRange {
  key: AnalyticsDateRangeKey;
  label: string;
  startDate: string | null;
  endDate: string | null;
}

export interface AnalyticsFilterState {
  primarySection: AnalyticsPrimarySection;
  dateRange: AnalyticsDateRange;
  selectedRegion: string | null;
  selectedOwner: string | null;
  selectedSource: string | null;
  comparePreviousPeriod: boolean;
  search: string;
}

export interface AnalyticsFilterOption {
  label: string;
  value: string;
}

export interface UseAnalyticsFiltersConfig {
  initialFilters?: Partial<AnalyticsFilterState>;
  regionOptions?: string[];
  ownerOptions?: string[];
  sourceOptions?: string[];
}

export interface UseAnalyticsFiltersReturn {
  filters: AnalyticsFilterState;
  dateRangeOptions: AnalyticsDateRange[];
  primarySectionOptions: AnalyticsFilterOption[];
  regionOptions: AnalyticsFilterOption[];
  ownerOptions: AnalyticsFilterOption[];
  sourceOptions: AnalyticsFilterOption[];
  hasActiveFilters: boolean;
  setPrimarySection: (section: AnalyticsPrimarySection) => void;
  setDateRange: (dateRange: AnalyticsDateRange) => void;
  setSelectedRegion: (region: string | null) => void;
  setSelectedOwner: (owner: string | null) => void;
  setSelectedSource: (source: string | null) => void;
  setSearch: (value: string) => void;
  toggleComparePreviousPeriod: () => void;
  updateFilters: (updates: Partial<AnalyticsFilterState>) => void;
  resetFilters: () => void;
  clearSearch: () => void;
}

export const DEFAULT_ANALYTICS_DATE_RANGE: AnalyticsDateRange = {
  key: 'last30Days',
  label: 'Last 30 Days',
  startDate: null,
  endDate: null,
};

export const ANALYTICS_DATE_RANGE_OPTIONS: AnalyticsDateRange[] = [
  {
    key: 'today',
    label: 'Today',
    startDate: null,
    endDate: null,
  },
  {
    key: 'last7Days',
    label: 'Last 7 Days',
    startDate: null,
    endDate: null,
  },
  {
    key: 'last30Days',
    label: 'Last 30 Days',
    startDate: null,
    endDate: null,
  },
  {
    key: 'last90Days',
    label: 'Last 90 Days',
    startDate: null,
    endDate: null,
  },
  {
    key: 'thisMonth',
    label: 'This Month',
    startDate: null,
    endDate: null,
  },
  {
    key: 'thisQuarter',
    label: 'This Quarter',
    startDate: null,
    endDate: null,
  },
  {
    key: 'thisYear',
    label: 'This Year',
    startDate: null,
    endDate: null,
  },
  {
    key: 'custom',
    label: 'Custom Range',
    startDate: null,
    endDate: null,
  },
];

export const ANALYTICS_PRIMARY_SECTION_OPTIONS: AnalyticsFilterOption[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'Pipeline', value: 'pipeline' },
  { label: 'Revenue', value: 'revenue' },
  { label: 'Team', value: 'team' },
  { label: 'Leads', value: 'leads' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Forecast', value: 'forecast' },
  { label: 'Risk', value: 'risk' },
  { label: 'Geography', value: 'geography' },
];

export const DEFAULT_ANALYTICS_FILTERS: AnalyticsFilterState = {
  primarySection: 'overview',
  dateRange: DEFAULT_ANALYTICS_DATE_RANGE,
  selectedRegion: null,
  selectedOwner: null,
  selectedSource: null,
  comparePreviousPeriod: true,
  search: '',
};

const toFilterOptions = (items: string[]): AnalyticsFilterOption[] => {
  return items.map((item) => ({
    label: item,
    value: item,
  }));
};

const uniqueSorted = (items: string[]): string[] => {
  return Array.from(new Set(items.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
};

export const useAnalyticsFilters = (
  config?: UseAnalyticsFiltersConfig,
): UseAnalyticsFiltersReturn => {
  const initialFilters: AnalyticsFilterState = {
    ...DEFAULT_ANALYTICS_FILTERS,
    ...config?.initialFilters,
    dateRange: config?.initialFilters?.dateRange ?? DEFAULT_ANALYTICS_DATE_RANGE,
  };

  const [filters, setFilters] = useState<AnalyticsFilterState>(initialFilters);

  const regionOptions = useMemo<AnalyticsFilterOption[]>(() => {
    return toFilterOptions(uniqueSorted(config?.regionOptions ?? []));
  }, [config?.regionOptions]);

  const ownerOptions = useMemo<AnalyticsFilterOption[]>(() => {
    return toFilterOptions(uniqueSorted(config?.ownerOptions ?? []));
  }, [config?.ownerOptions]);

  const sourceOptions = useMemo<AnalyticsFilterOption[]>(() => {
    return toFilterOptions(uniqueSorted(config?.sourceOptions ?? []));
  }, [config?.sourceOptions]);

  const hasActiveFilters = useMemo<boolean>(() => {
    return (
      filters.primarySection !== DEFAULT_ANALYTICS_FILTERS.primarySection ||
      filters.dateRange.key !== DEFAULT_ANALYTICS_FILTERS.dateRange.key ||
      filters.selectedRegion !== DEFAULT_ANALYTICS_FILTERS.selectedRegion ||
      filters.selectedOwner !== DEFAULT_ANALYTICS_FILTERS.selectedOwner ||
      filters.selectedSource !== DEFAULT_ANALYTICS_FILTERS.selectedSource ||
      filters.comparePreviousPeriod !==
        DEFAULT_ANALYTICS_FILTERS.comparePreviousPeriod ||
      filters.search.trim() !== DEFAULT_ANALYTICS_FILTERS.search
    );
  }, [filters]);

  const setPrimarySection = useCallback((section: AnalyticsPrimarySection) => {
    setFilters((prev) => ({
      ...prev,
      primarySection: section,
    }));
  }, []);

  const setDateRange = useCallback((dateRange: AnalyticsDateRange) => {
    setFilters((prev) => ({
      ...prev,
      dateRange,
    }));
  }, []);

  const setSelectedRegion = useCallback((region: string | null) => {
    setFilters((prev) => ({
      ...prev,
      selectedRegion: region,
    }));
  }, []);

  const setSelectedOwner = useCallback((owner: string | null) => {
    setFilters((prev) => ({
      ...prev,
      selectedOwner: owner,
    }));
  }, []);

  const setSelectedSource = useCallback((source: string | null) => {
    setFilters((prev) => ({
      ...prev,
      selectedSource: source,
    }));
  }, []);

  const setSearch = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  }, []);

  const toggleComparePreviousPeriod = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      comparePreviousPeriod: !prev.comparePreviousPeriod,
    }));
  }, []);

  const updateFilters = useCallback((updates: Partial<AnalyticsFilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      dateRange: updates.dateRange ?? prev.dateRange,
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      search: '',
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    dateRangeOptions: ANALYTICS_DATE_RANGE_OPTIONS,
    primarySectionOptions: ANALYTICS_PRIMARY_SECTION_OPTIONS,
    regionOptions,
    ownerOptions,
    sourceOptions,
    hasActiveFilters,
    setPrimarySection,
    setDateRange,
    setSelectedRegion,
    setSelectedOwner,
    setSelectedSource,
    setSearch,
    toggleComparePreviousPeriod,
    updateFilters,
    resetFilters,
    clearSearch,
  };
};