import { useCallback, useEffect, useMemo, useState } from 'react';

export interface RevenueAnalyticsFilters {
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  projectIds?: string[];
  sourceIds?: string[];
  ownerIds?: string[];
  teamIds?: string[];
  locations?: string[];
  statuses?: string[];
  dealTypes?: string[];
  tags?: string[];
  search?: string;
  [key: string]: unknown;
}

export interface RevenueComparePeriod {
  enabled: boolean;
  type?: 'previous_period' | 'previous_month' | 'previous_quarter' | 'previous_year' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface RevenueAnalyticsSummary {
  totalRevenue: number;
  collectedRevenue: number;
  pendingRevenue: number;
  forecastRevenue: number;
  targetRevenue: number;
  achievementRate: number;
  averageDealValue: number;
  revenueGrowthRate: number;
  wonDealsCount: number;
  lostDealsValue: number;
}

export interface RevenueTrendPoint {
  period: string;
  revenue: number;
  collectedRevenue: number;
  pendingRevenue: number;
  forecastRevenue: number;
  targetRevenue: number;
  achievementRate: number;
}

export interface RevenueProjectPerformanceItem {
  projectId: string;
  projectName: string;
  revenue: number;
  collectedRevenue: number;
  pendingRevenue: number;
  dealCount: number;
  averageDealValue: number;
  achievementRate: number;
}

export interface RevenueOwnerPerformanceItem {
  ownerId: string;
  ownerName: string;
  revenue: number;
  collectedRevenue: number;
  pendingRevenue: number;
  dealCount: number;
  winRate: number;
  averageDealValue: number;
}

export interface RevenueLocationPerformanceItem {
  locationId: string;
  locationName: string;
  revenue: number;
  collectedRevenue: number;
  pendingRevenue: number;
  dealCount: number;
  growthRate: number;
}

export interface RevenueTargetVsAchievementItem {
  label: string;
  targetRevenue: number;
  achievedRevenue: number;
  achievementRate: number;
  gap: number;
}

export interface RevenueSourcePerformanceItem {
  sourceId: string;
  sourceName: string;
  revenue: number;
  dealCount: number;
  averageDealValue: number;
  contributionRate: number;
}

export interface RevenueAnalyticsData {
  summary: RevenueAnalyticsSummary;
  trend: RevenueTrendPoint[];
  projectPerformance: RevenueProjectPerformanceItem[];
  ownerPerformance: RevenueOwnerPerformanceItem[];
  locationPerformance: RevenueLocationPerformanceItem[];
  targetVsAchievement: RevenueTargetVsAchievementItem[];
  sourcePerformance: RevenueSourcePerformanceItem[];
  generatedAt: string;
}

export interface UseRevenueAnalyticsOptions {
  endpoint?: string;
  initialFilters?: RevenueAnalyticsFilters;
  initialComparePeriod?: RevenueComparePeriod | null;
  enabled?: boolean;
  useMockOnError?: boolean;
  onSuccess?: (data: RevenueAnalyticsData) => void;
  onError?: (error: Error) => void;
}

export interface UseRevenueAnalyticsReturn {
  data: RevenueAnalyticsData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  filters: RevenueAnalyticsFilters;
  comparePeriod: RevenueComparePeriod | null;
  setFilters: (
    updater:
      | RevenueAnalyticsFilters
      | ((prev: RevenueAnalyticsFilters) => RevenueAnalyticsFilters)
  ) => void;
  setComparePeriod: (
    updater:
      | RevenueComparePeriod
      | null
      | ((prev: RevenueComparePeriod | null) => RevenueComparePeriod | null)
  ) => void;
  refetch: () => Promise<void>;
  reset: () => void;
}

interface RevenueAnalyticsApiResponse {
  data?: Partial<RevenueAnalyticsData>;
  summary?: Partial<RevenueAnalyticsSummary>;
  trend?: Partial<RevenueTrendPoint>[];
  projectPerformance?: Partial<RevenueProjectPerformanceItem>[];
  ownerPerformance?: Partial<RevenueOwnerPerformanceItem>[];
  locationPerformance?: Partial<RevenueLocationPerformanceItem>[];
  targetVsAchievement?: Partial<RevenueTargetVsAchievementItem>[];
  sourcePerformance?: Partial<RevenueSourcePerformanceItem>[];
  generatedAt?: string;
}

const DEFAULT_REVENUE_SUMMARY: RevenueAnalyticsSummary = {
  totalRevenue: 0,
  collectedRevenue: 0,
  pendingRevenue: 0,
  forecastRevenue: 0,
  targetRevenue: 0,
  achievementRate: 0,
  averageDealValue: 0,
  revenueGrowthRate: 0,
  wonDealsCount: 0,
  lostDealsValue: 0,
};

const createMockRevenueAnalytics = (): RevenueAnalyticsData => {
  return {
    summary: {
      totalRevenue: 68500000,
      collectedRevenue: 54800000,
      pendingRevenue: 13700000,
      forecastRevenue: 75200000,
      targetRevenue: 80000000,
      achievementRate: 85.63,
      averageDealValue: 521374.05,
      revenueGrowthRate: 14.8,
      wonDealsCount: 131,
      lostDealsValue: 9200000,
    },
    trend: [
      {
        period: 'Jan',
        revenue: 9200000,
        collectedRevenue: 7360000,
        pendingRevenue: 1840000,
        forecastRevenue: 9800000,
        targetRevenue: 10000000,
        achievementRate: 92,
      },
      {
        period: 'Feb',
        revenue: 10100000,
        collectedRevenue: 8120000,
        pendingRevenue: 1980000,
        forecastRevenue: 10800000,
        targetRevenue: 11000000,
        achievementRate: 91.82,
      },
      {
        period: 'Mar',
        revenue: 10900000,
        collectedRevenue: 8750000,
        pendingRevenue: 2150000,
        forecastRevenue: 11400000,
        targetRevenue: 12000000,
        achievementRate: 90.83,
      },
      {
        period: 'Apr',
        revenue: 11500000,
        collectedRevenue: 9300000,
        pendingRevenue: 2200000,
        forecastRevenue: 12400000,
        targetRevenue: 13000000,
        achievementRate: 88.46,
      },
      {
        period: 'May',
        revenue: 12600000,
        collectedRevenue: 10080000,
        pendingRevenue: 2520000,
        forecastRevenue: 13600000,
        targetRevenue: 14000000,
        achievementRate: 90,
      },
      {
        period: 'Jun',
        revenue: 14200000,
        collectedRevenue: 11190000,
        pendingRevenue: 3010000,
        forecastRevenue: 15200000,
        targetRevenue: 16000000,
        achievementRate: 88.75,
      },
    ],
    projectPerformance: [
      {
        projectId: 'p1',
        projectName: 'Prestige Lakeside Villas',
        revenue: 15800000,
        collectedRevenue: 12900000,
        pendingRevenue: 2900000,
        dealCount: 24,
        averageDealValue: 658333.33,
        achievementRate: 87.78,
      },
      {
        projectId: 'p2',
        projectName: 'Sarjapur Plot Enclave',
        revenue: 12400000,
        collectedRevenue: 9680000,
        pendingRevenue: 2720000,
        dealCount: 31,
        averageDealValue: 400000,
        achievementRate: 82.67,
      },
      {
        projectId: 'p3',
        projectName: 'Whitefield Premium Homes',
        revenue: 17100000,
        collectedRevenue: 13650000,
        pendingRevenue: 3450000,
        dealCount: 28,
        averageDealValue: 610714.29,
        achievementRate: 90,
      },
      {
        projectId: 'p4',
        projectName: 'Electronic City Smart Residences',
        revenue: 10400000,
        collectedRevenue: 8210000,
        pendingRevenue: 2190000,
        dealCount: 22,
        averageDealValue: 472727.27,
        achievementRate: 80,
      },
      {
        projectId: 'p5',
        projectName: 'North Bangalore Growth Corridor',
        revenue: 12800000,
        collectedRevenue: 10360000,
        pendingRevenue: 2440000,
        dealCount: 26,
        averageDealValue: 492307.69,
        achievementRate: 85.33,
      },
    ],
    ownerPerformance: [
      {
        ownerId: 'u1',
        ownerName: 'Arun Kumar',
        revenue: 18200000,
        collectedRevenue: 14560000,
        pendingRevenue: 3640000,
        dealCount: 33,
        winRate: 34.02,
        averageDealValue: 551515.15,
      },
      {
        ownerId: 'u2',
        ownerName: 'Priya S',
        revenue: 15400000,
        collectedRevenue: 12280000,
        pendingRevenue: 3120000,
        dealCount: 29,
        winRate: 31.52,
        averageDealValue: 531034.48,
      },
      {
        ownerId: 'u3',
        ownerName: 'Rohit Raj',
        revenue: 17600000,
        collectedRevenue: 14050000,
        pendingRevenue: 3550000,
        dealCount: 35,
        winRate: 29.91,
        averageDealValue: 502857.14,
      },
      {
        ownerId: 'u4',
        ownerName: 'Meena V',
        revenue: 17300000,
        collectedRevenue: 13960000,
        pendingRevenue: 3340000,
        dealCount: 34,
        winRate: 32.08,
        averageDealValue: 508823.53,
      },
    ],
    locationPerformance: [
      {
        locationId: 'blr-east',
        locationName: 'Bangalore East',
        revenue: 21400000,
        collectedRevenue: 17050000,
        pendingRevenue: 4350000,
        dealCount: 39,
        growthRate: 16.2,
      },
      {
        locationId: 'blr-south',
        locationName: 'Bangalore South',
        revenue: 16300000,
        collectedRevenue: 12980000,
        pendingRevenue: 3320000,
        dealCount: 31,
        growthRate: 11.9,
      },
      {
        locationId: 'blr-north',
        locationName: 'Bangalore North',
        revenue: 14600000,
        collectedRevenue: 11720000,
        pendingRevenue: 2880000,
        dealCount: 27,
        growthRate: 13.4,
      },
      {
        locationId: 'blr-west',
        locationName: 'Bangalore West',
        revenue: 16200000,
        collectedRevenue: 12970000,
        pendingRevenue: 3230000,
        dealCount: 34,
        growthRate: 17.1,
      },
    ],
    targetVsAchievement: [
      {
        label: 'Jan',
        targetRevenue: 10000000,
        achievedRevenue: 9200000,
        achievementRate: 92,
        gap: 800000,
      },
      {
        label: 'Feb',
        targetRevenue: 11000000,
        achievedRevenue: 10100000,
        achievementRate: 91.82,
        gap: 900000,
      },
      {
        label: 'Mar',
        targetRevenue: 12000000,
        achievedRevenue: 10900000,
        achievementRate: 90.83,
        gap: 1100000,
      },
      {
        label: 'Apr',
        targetRevenue: 13000000,
        achievedRevenue: 11500000,
        achievementRate: 88.46,
        gap: 1500000,
      },
      {
        label: 'May',
        targetRevenue: 14000000,
        achievedRevenue: 12600000,
        achievementRate: 90,
        gap: 1400000,
      },
      {
        label: 'Jun',
        targetRevenue: 16000000,
        achievedRevenue: 14200000,
        achievementRate: 88.75,
        gap: 1800000,
      },
    ],
    sourcePerformance: [
      {
        sourceId: 'referral',
        sourceName: 'Referral',
        revenue: 20100000,
        dealCount: 34,
        averageDealValue: 591176.47,
        contributionRate: 29.34,
      },
      {
        sourceId: 'google',
        sourceName: 'Google Ads',
        revenue: 16200000,
        dealCount: 31,
        averageDealValue: 522580.65,
        contributionRate: 23.65,
      },
      {
        sourceId: 'facebook',
        sourceName: 'Facebook Ads',
        revenue: 11900000,
        dealCount: 27,
        averageDealValue: 440740.74,
        contributionRate: 17.37,
      },
      {
        sourceId: 'direct',
        sourceName: 'Direct',
        revenue: 14300000,
        dealCount: 23,
        averageDealValue: 621739.13,
        contributionRate: 20.88,
      },
      {
        sourceId: 'whatsapp',
        sourceName: 'WhatsApp Campaign',
        revenue: 7000000,
        dealCount: 16,
        averageDealValue: 437500,
        contributionRate: 10.22,
      },
    ],
    generatedAt: new Date().toISOString(),
  };
};

const normalizeSummary = (
  summary?: Partial<RevenueAnalyticsSummary>,
): RevenueAnalyticsSummary => {
  return {
    totalRevenue: summary?.totalRevenue ?? 0,
    collectedRevenue: summary?.collectedRevenue ?? 0,
    pendingRevenue: summary?.pendingRevenue ?? 0,
    forecastRevenue: summary?.forecastRevenue ?? 0,
    targetRevenue: summary?.targetRevenue ?? 0,
    achievementRate: summary?.achievementRate ?? 0,
    averageDealValue: summary?.averageDealValue ?? 0,
    revenueGrowthRate: summary?.revenueGrowthRate ?? 0,
    wonDealsCount: summary?.wonDealsCount ?? 0,
    lostDealsValue: summary?.lostDealsValue ?? 0,
  };
};

const normalizeTrend = (
  trend?: Partial<RevenueTrendPoint>[],
): RevenueTrendPoint[] => {
  if (!Array.isArray(trend)) {
    return [];
  }

  return trend.map((item, index) => ({
    period: item.period ?? `P${index + 1}`,
    revenue: item.revenue ?? 0,
    collectedRevenue: item.collectedRevenue ?? 0,
    pendingRevenue: item.pendingRevenue ?? 0,
    forecastRevenue: item.forecastRevenue ?? 0,
    targetRevenue: item.targetRevenue ?? 0,
    achievementRate: item.achievementRate ?? 0,
  }));
};

const normalizeProjectPerformance = (
  projectPerformance?: Partial<RevenueProjectPerformanceItem>[],
): RevenueProjectPerformanceItem[] => {
  if (!Array.isArray(projectPerformance)) {
    return [];
  }

  return projectPerformance.map((item, index) => ({
    projectId: item.projectId ?? `project-${index + 1}`,
    projectName: item.projectName ?? `Project ${index + 1}`,
    revenue: item.revenue ?? 0,
    collectedRevenue: item.collectedRevenue ?? 0,
    pendingRevenue: item.pendingRevenue ?? 0,
    dealCount: item.dealCount ?? 0,
    averageDealValue: item.averageDealValue ?? 0,
    achievementRate: item.achievementRate ?? 0,
  }));
};

const normalizeOwnerPerformance = (
  ownerPerformance?: Partial<RevenueOwnerPerformanceItem>[],
): RevenueOwnerPerformanceItem[] => {
  if (!Array.isArray(ownerPerformance)) {
    return [];
  }

  return ownerPerformance.map((item, index) => ({
    ownerId: item.ownerId ?? `owner-${index + 1}`,
    ownerName: item.ownerName ?? `Owner ${index + 1}`,
    revenue: item.revenue ?? 0,
    collectedRevenue: item.collectedRevenue ?? 0,
    pendingRevenue: item.pendingRevenue ?? 0,
    dealCount: item.dealCount ?? 0,
    winRate: item.winRate ?? 0,
    averageDealValue: item.averageDealValue ?? 0,
  }));
};

const normalizeLocationPerformance = (
  locationPerformance?: Partial<RevenueLocationPerformanceItem>[],
): RevenueLocationPerformanceItem[] => {
  if (!Array.isArray(locationPerformance)) {
    return [];
  }

  return locationPerformance.map((item, index) => ({
    locationId: item.locationId ?? `location-${index + 1}`,
    locationName: item.locationName ?? `Location ${index + 1}`,
    revenue: item.revenue ?? 0,
    collectedRevenue: item.collectedRevenue ?? 0,
    pendingRevenue: item.pendingRevenue ?? 0,
    dealCount: item.dealCount ?? 0,
    growthRate: item.growthRate ?? 0,
  }));
};

const normalizeTargetVsAchievement = (
  targetVsAchievement?: Partial<RevenueTargetVsAchievementItem>[],
): RevenueTargetVsAchievementItem[] => {
  if (!Array.isArray(targetVsAchievement)) {
    return [];
  }

  return targetVsAchievement.map((item, index) => ({
    label: item.label ?? `Item ${index + 1}`,
    targetRevenue: item.targetRevenue ?? 0,
    achievedRevenue: item.achievedRevenue ?? 0,
    achievementRate: item.achievementRate ?? 0,
    gap: item.gap ?? 0,
  }));
};

const normalizeSourcePerformance = (
  sourcePerformance?: Partial<RevenueSourcePerformanceItem>[],
): RevenueSourcePerformanceItem[] => {
  if (!Array.isArray(sourcePerformance)) {
    return [];
  }

  return sourcePerformance.map((item, index) => ({
    sourceId: item.sourceId ?? `source-${index + 1}`,
    sourceName: item.sourceName ?? `Source ${index + 1}`,
    revenue: item.revenue ?? 0,
    dealCount: item.dealCount ?? 0,
    averageDealValue: item.averageDealValue ?? 0,
    contributionRate: item.contributionRate ?? 0,
  }));
};

const normalizeRevenueAnalyticsResponse = (
  response: RevenueAnalyticsApiResponse | Partial<RevenueAnalyticsData>,
): RevenueAnalyticsData => {
  const nestedData =
    'data' in response && response.data ? response.data : response;

  return {
    summary: normalizeSummary(
      nestedData.summary ?? response.summary ?? DEFAULT_REVENUE_SUMMARY,
    ),
    trend: normalizeTrend(nestedData.trend ?? response.trend),
    projectPerformance: normalizeProjectPerformance(
      nestedData.projectPerformance ?? response.projectPerformance,
    ),
    ownerPerformance: normalizeOwnerPerformance(
      nestedData.ownerPerformance ?? response.ownerPerformance,
    ),
    locationPerformance: normalizeLocationPerformance(
      nestedData.locationPerformance ?? response.locationPerformance,
    ),
    targetVsAchievement: normalizeTargetVsAchievement(
      nestedData.targetVsAchievement ?? response.targetVsAchievement,
    ),
    sourcePerformance: normalizeSourcePerformance(
      nestedData.sourcePerformance ?? response.sourcePerformance,
    ),
    generatedAt: nestedData.generatedAt ?? response.generatedAt ?? new Date().toISOString(),
  };
};

export const useRevenueAnalytics = (
  options: UseRevenueAnalyticsOptions = {},
): UseRevenueAnalyticsReturn => {
  const {
    endpoint = '/api/analytics/revenue',
    initialFilters = {},
    initialComparePeriod = null,
    enabled = true,
    useMockOnError = false,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<RevenueAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<RevenueAnalyticsFilters>(initialFilters);
  const [comparePeriod, setComparePeriodState] =
    useState<RevenueComparePeriod | null>(initialComparePeriod);

  const setFilters = useCallback(
    (
      updater:
        | RevenueAnalyticsFilters
        | ((prev: RevenueAnalyticsFilters) => RevenueAnalyticsFilters),
    ) => {
      setFiltersState((prev) =>
        typeof updater === 'function' ? updater(prev) : updater,
      );
    },
    [],
  );

  const setComparePeriod = useCallback(
    (
      updater:
        | RevenueComparePeriod
        | null
        | ((prev: RevenueComparePeriod | null) => RevenueComparePeriod | null),
    ) => {
      setComparePeriodState((prev) =>
        typeof updater === 'function' ? updater(prev) : updater,
      );
    },
    [],
  );

  const fetchRevenueAnalytics = useCallback(
    async (refresh = false): Promise<void> => {
      if (!enabled) {
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            filters,
            comparePeriod,
          }),
        });

        if (!response.ok) {
          let message = `Failed to load revenue analytics. Status: ${response.status}`;

          try {
            const errorPayload = (await response.json()) as { message?: string };
            if (errorPayload?.message) {
              message = errorPayload.message;
            }
          } catch {
            // ignore parse error
          }

          throw new Error(message);
        }

        const json =
          (await response.json()) as RevenueAnalyticsApiResponse | Partial<RevenueAnalyticsData>;

        const normalized = normalizeRevenueAnalyticsResponse(json);

        setData(normalized);
        onSuccess?.(normalized);
      } catch (err) {
        const resolvedError =
          err instanceof Error ? err : new Error('Failed to load revenue analytics.');

        if (useMockOnError) {
          const mockData = createMockRevenueAnalytics();
          setData(mockData);
          setError(null);
          onSuccess?.(mockData);
        } else {
          setError(resolvedError.message);
          onError?.(resolvedError);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [enabled, endpoint, filters, comparePeriod, onError, onSuccess, useMockOnError],
  );

  const refetch = useCallback(async () => {
    await fetchRevenueAnalytics(true);
  }, [fetchRevenueAnalytics]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsRefreshing(false);
    setFiltersState(initialFilters);
    setComparePeriodState(initialComparePeriod);
  }, [initialComparePeriod, initialFilters]);

  useEffect(() => {
    void fetchRevenueAnalytics(false);
  }, [fetchRevenueAnalytics]);

  return useMemo(
    () => ({
      data,
      isLoading,
      isRefreshing,
      error,
      filters,
      comparePeriod,
      setFilters,
      setComparePeriod,
      refetch,
      reset,
    }),
    [
      data,
      isLoading,
      isRefreshing,
      error,
      filters,
      comparePeriod,
      setFilters,
      setComparePeriod,
      refetch,
      reset,
    ],
  );
};

export default useRevenueAnalytics;