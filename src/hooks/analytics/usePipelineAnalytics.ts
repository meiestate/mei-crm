import { useCallback, useEffect, useMemo, useState } from 'react';

export interface PipelineAnalyticsFilters {
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  projectIds?: string[];
  sourceIds?: string[];
  ownerIds?: string[];
  teamIds?: string[];
  pipelineIds?: string[];
  statuses?: string[];
  locations?: string[];
  tags?: string[];
  search?: string;
  [key: string]: unknown;
}

export interface PipelineComparePeriod {
  enabled: boolean;
  type?: 'previous_period' | 'previous_month' | 'previous_quarter' | 'previous_year' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface PipelineAnalyticsSummary {
  totalPipelineValue: number;
  weightedPipelineValue: number;
  activeDeals: number;
  averageDealSize: number;
  averageSalesCycleDays: number;
  overallConversionRate: number;
  winRate: number;
  stageVelocityScore: number;
  stuckDealsCount: number;
  staleDealsValue: number;
}

export interface PipelineFunnelStageItem {
  stageId: string;
  stageName: string;
  dealCount: number;
  dealValue: number;
  weightedValue: number;
  conversionRateToNext: number;
  dropOffRate: number;
  averageDaysInStage: number;
  probability: number;
}

export interface PipelineTrendPoint {
  period: string;
  totalPipelineValue: number;
  weightedPipelineValue: number;
  activeDeals: number;
  wins: number;
  losses: number;
  conversionRate: number;
}

export interface PipelineOwnerPerformanceItem {
  ownerId: string;
  ownerName: string;
  activeDeals: number;
  pipelineValue: number;
  weightedValue: number;
  wonDeals: number;
  lostDeals: number;
  winRate: number;
  averageCycleDays: number;
}

export interface PipelineSourcePerformanceItem {
  sourceId: string;
  sourceName: string;
  dealCount: number;
  pipelineValue: number;
  wonDeals: number;
  winRate: number;
  averageDealSize: number;
}

export interface PipelineStuckDealItem {
  dealId: string;
  dealName: string;
  stageId: string;
  stageName: string;
  ownerName: string;
  value: number;
  daysInStage: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface PipelineStageConversionItem {
  fromStageId: string;
  fromStageName: string;
  toStageId: string;
  toStageName: string;
  conversionRate: number;
  averageTransitionDays: number;
  dropOffRate: number;
}

export interface PipelineAnalyticsData {
  summary: PipelineAnalyticsSummary;
  funnel: PipelineFunnelStageItem[];
  trend: PipelineTrendPoint[];
  ownerPerformance: PipelineOwnerPerformanceItem[];
  sourcePerformance: PipelineSourcePerformanceItem[];
  stuckDeals: PipelineStuckDealItem[];
  stageConversions: PipelineStageConversionItem[];
  generatedAt: string;
}

export interface UsePipelineAnalyticsOptions {
  endpoint?: string;
  initialFilters?: PipelineAnalyticsFilters;
  initialComparePeriod?: PipelineComparePeriod | null;
  enabled?: boolean;
  useMockOnError?: boolean;
  onSuccess?: (data: PipelineAnalyticsData) => void;
  onError?: (error: Error) => void;
}

export interface UsePipelineAnalyticsReturn {
  data: PipelineAnalyticsData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  filters: PipelineAnalyticsFilters;
  comparePeriod: PipelineComparePeriod | null;
  setFilters: (
    updater:
      | PipelineAnalyticsFilters
      | ((prev: PipelineAnalyticsFilters) => PipelineAnalyticsFilters)
  ) => void;
  setComparePeriod: (
    updater:
      | PipelineComparePeriod
      | null
      | ((prev: PipelineComparePeriod | null) => PipelineComparePeriod | null)
  ) => void;
  refetch: () => Promise<void>;
  reset: () => void;
}

interface PipelineAnalyticsApiResponse {
  data?: Partial<PipelineAnalyticsData>;
  summary?: Partial<PipelineAnalyticsSummary>;
  funnel?: Partial<PipelineFunnelStageItem>[];
  trend?: Partial<PipelineTrendPoint>[];
  ownerPerformance?: Partial<PipelineOwnerPerformanceItem>[];
  sourcePerformance?: Partial<PipelineSourcePerformanceItem>[];
  stuckDeals?: Partial<PipelineStuckDealItem>[];
  stageConversions?: Partial<PipelineStageConversionItem>[];
  generatedAt?: string;
}

const DEFAULT_PIPELINE_SUMMARY: PipelineAnalyticsSummary = {
  totalPipelineValue: 0,
  weightedPipelineValue: 0,
  activeDeals: 0,
  averageDealSize: 0,
  averageSalesCycleDays: 0,
  overallConversionRate: 0,
  winRate: 0,
  stageVelocityScore: 0,
  stuckDealsCount: 0,
  staleDealsValue: 0,
};

const createMockPipelineAnalytics = (): PipelineAnalyticsData => {
  return {
    summary: {
      totalPipelineValue: 48200000,
      weightedPipelineValue: 27150000,
      activeDeals: 186,
      averageDealSize: 259139.78,
      averageSalesCycleDays: 34,
      overallConversionRate: 12.8,
      winRate: 29.4,
      stageVelocityScore: 76,
      stuckDealsCount: 23,
      staleDealsValue: 6200000,
    },
    funnel: [
      {
        stageId: 'new',
        stageName: 'New',
        dealCount: 54,
        dealValue: 8600000,
        weightedValue: 1720000,
        conversionRateToNext: 72,
        dropOffRate: 12,
        averageDaysInStage: 5,
        probability: 20,
      },
      {
        stageId: 'qualified',
        stageName: 'Qualified',
        dealCount: 46,
        dealValue: 9800000,
        weightedValue: 3920000,
        conversionRateToNext: 63,
        dropOffRate: 15,
        averageDaysInStage: 7,
        probability: 40,
      },
      {
        stageId: 'proposal',
        stageName: 'Proposal',
        dealCount: 34,
        dealValue: 10800000,
        weightedValue: 6480000,
        conversionRateToNext: 52,
        dropOffRate: 19,
        averageDaysInStage: 9,
        probability: 60,
      },
      {
        stageId: 'negotiation',
        stageName: 'Negotiation',
        dealCount: 28,
        dealValue: 11200000,
        weightedValue: 8960000,
        conversionRateToNext: 44,
        dropOffRate: 23,
        averageDaysInStage: 12,
        probability: 80,
      },
      {
        stageId: 'commitment',
        stageName: 'Commitment',
        dealCount: 24,
        dealValue: 7800000,
        weightedValue: 7020000,
        conversionRateToNext: 79,
        dropOffRate: 8,
        averageDaysInStage: 6,
        probability: 90,
      },
    ],
    trend: [
      {
        period: 'Jan',
        totalPipelineValue: 39200000,
        weightedPipelineValue: 21100000,
        activeDeals: 162,
        wins: 18,
        losses: 11,
        conversionRate: 11.11,
      },
      {
        period: 'Feb',
        totalPipelineValue: 40400000,
        weightedPipelineValue: 22350000,
        activeDeals: 168,
        wins: 19,
        losses: 10,
        conversionRate: 11.31,
      },
      {
        period: 'Mar',
        totalPipelineValue: 42800000,
        weightedPipelineValue: 23800000,
        activeDeals: 173,
        wins: 22,
        losses: 13,
        conversionRate: 12.72,
      },
      {
        period: 'Apr',
        totalPipelineValue: 45100000,
        weightedPipelineValue: 25100000,
        activeDeals: 178,
        wins: 21,
        losses: 15,
        conversionRate: 11.8,
      },
      {
        period: 'May',
        totalPipelineValue: 46600000,
        weightedPipelineValue: 26300000,
        activeDeals: 182,
        wins: 23,
        losses: 14,
        conversionRate: 12.64,
      },
      {
        period: 'Jun',
        totalPipelineValue: 48200000,
        weightedPipelineValue: 27150000,
        activeDeals: 186,
        wins: 24,
        losses: 15,
        conversionRate: 12.9,
      },
    ],
    ownerPerformance: [
      {
        ownerId: 'u1',
        ownerName: 'Arun Kumar',
        activeDeals: 46,
        pipelineValue: 12400000,
        weightedValue: 7250000,
        wonDeals: 18,
        lostDeals: 8,
        winRate: 33.96,
        averageCycleDays: 31,
      },
      {
        ownerId: 'u2',
        ownerName: 'Priya S',
        activeDeals: 42,
        pipelineValue: 10900000,
        weightedValue: 6010000,
        wonDeals: 16,
        lostDeals: 10,
        winRate: 29.63,
        averageCycleDays: 35,
      },
      {
        ownerId: 'u3',
        ownerName: 'Rohit Raj',
        activeDeals: 48,
        pipelineValue: 13100000,
        weightedValue: 7020000,
        wonDeals: 19,
        lostDeals: 12,
        winRate: 30.16,
        averageCycleDays: 37,
      },
      {
        ownerId: 'u4',
        ownerName: 'Meena V',
        activeDeals: 50,
        pipelineValue: 11800000,
        weightedValue: 6870000,
        wonDeals: 17,
        lostDeals: 9,
        winRate: 31.48,
        averageCycleDays: 33,
      },
    ],
    sourcePerformance: [
      {
        sourceId: 'referral',
        sourceName: 'Referral',
        dealCount: 38,
        pipelineValue: 12800000,
        wonDeals: 16,
        winRate: 42.11,
        averageDealSize: 336842.11,
      },
      {
        sourceId: 'google',
        sourceName: 'Google Ads',
        dealCount: 52,
        pipelineValue: 11600000,
        wonDeals: 14,
        winRate: 26.92,
        averageDealSize: 223076.92,
      },
      {
        sourceId: 'facebook',
        sourceName: 'Facebook Ads',
        dealCount: 44,
        pipelineValue: 9200000,
        wonDeals: 10,
        winRate: 22.73,
        averageDealSize: 209090.91,
      },
      {
        sourceId: 'direct',
        sourceName: 'Direct',
        dealCount: 28,
        pipelineValue: 9300000,
        wonDeals: 11,
        winRate: 39.29,
        averageDealSize: 332142.86,
      },
    ],
    stuckDeals: [
      {
        dealId: 'd1',
        dealName: 'Prestige Lakeside Villa Block A',
        stageId: 'proposal',
        stageName: 'Proposal',
        ownerName: 'Arun Kumar',
        value: 620000,
        daysInStage: 18,
        riskLevel: 'high',
      },
      {
        dealId: 'd2',
        dealName: 'Sarjapur Plot Cluster 09',
        stageId: 'negotiation',
        stageName: 'Negotiation',
        ownerName: 'Priya S',
        value: 480000,
        daysInStage: 21,
        riskLevel: 'critical',
      },
      {
        dealId: 'd3',
        dealName: 'Whitefield Apartment Tower 3',
        stageId: 'qualified',
        stageName: 'Qualified',
        ownerName: 'Rohit Raj',
        value: 310000,
        daysInStage: 16,
        riskLevel: 'medium',
      },
      {
        dealId: 'd4',
        dealName: 'Electronic City Smart Homes',
        stageId: 'proposal',
        stageName: 'Proposal',
        ownerName: 'Meena V',
        value: 540000,
        daysInStage: 19,
        riskLevel: 'high',
      },
    ],
    stageConversions: [
      {
        fromStageId: 'new',
        fromStageName: 'New',
        toStageId: 'qualified',
        toStageName: 'Qualified',
        conversionRate: 72,
        averageTransitionDays: 4,
        dropOffRate: 12,
      },
      {
        fromStageId: 'qualified',
        fromStageName: 'Qualified',
        toStageId: 'proposal',
        toStageName: 'Proposal',
        conversionRate: 63,
        averageTransitionDays: 6,
        dropOffRate: 15,
      },
      {
        fromStageId: 'proposal',
        fromStageName: 'Proposal',
        toStageId: 'negotiation',
        toStageName: 'Negotiation',
        conversionRate: 52,
        averageTransitionDays: 8,
        dropOffRate: 19,
      },
      {
        fromStageId: 'negotiation',
        fromStageName: 'Negotiation',
        toStageId: 'commitment',
        toStageName: 'Commitment',
        conversionRate: 44,
        averageTransitionDays: 10,
        dropOffRate: 23,
      },
      {
        fromStageId: 'commitment',
        fromStageName: 'Commitment',
        toStageId: 'won',
        toStageName: 'Won',
        conversionRate: 79,
        averageTransitionDays: 5,
        dropOffRate: 8,
      },
    ],
    generatedAt: new Date().toISOString(),
  };
};

const normalizeSummary = (
  summary?: Partial<PipelineAnalyticsSummary>,
): PipelineAnalyticsSummary => {
  return {
    totalPipelineValue: summary?.totalPipelineValue ?? 0,
    weightedPipelineValue: summary?.weightedPipelineValue ?? 0,
    activeDeals: summary?.activeDeals ?? 0,
    averageDealSize: summary?.averageDealSize ?? 0,
    averageSalesCycleDays: summary?.averageSalesCycleDays ?? 0,
    overallConversionRate: summary?.overallConversionRate ?? 0,
    winRate: summary?.winRate ?? 0,
    stageVelocityScore: summary?.stageVelocityScore ?? 0,
    stuckDealsCount: summary?.stuckDealsCount ?? 0,
    staleDealsValue: summary?.staleDealsValue ?? 0,
  };
};

const normalizeFunnel = (
  funnel?: Partial<PipelineFunnelStageItem>[],
): PipelineFunnelStageItem[] => {
  if (!Array.isArray(funnel)) {
    return [];
  }

  return funnel.map((item, index) => ({
    stageId: item.stageId ?? `stage-${index + 1}`,
    stageName: item.stageName ?? `Stage ${index + 1}`,
    dealCount: item.dealCount ?? 0,
    dealValue: item.dealValue ?? 0,
    weightedValue: item.weightedValue ?? 0,
    conversionRateToNext: item.conversionRateToNext ?? 0,
    dropOffRate: item.dropOffRate ?? 0,
    averageDaysInStage: item.averageDaysInStage ?? 0,
    probability: item.probability ?? 0,
  }));
};

const normalizeTrend = (
  trend?: Partial<PipelineTrendPoint>[],
): PipelineTrendPoint[] => {
  if (!Array.isArray(trend)) {
    return [];
  }

  return trend.map((item, index) => ({
    period: item.period ?? `P${index + 1}`,
    totalPipelineValue: item.totalPipelineValue ?? 0,
    weightedPipelineValue: item.weightedPipelineValue ?? 0,
    activeDeals: item.activeDeals ?? 0,
    wins: item.wins ?? 0,
    losses: item.losses ?? 0,
    conversionRate: item.conversionRate ?? 0,
  }));
};

const normalizeOwnerPerformance = (
  ownerPerformance?: Partial<PipelineOwnerPerformanceItem>[],
): PipelineOwnerPerformanceItem[] => {
  if (!Array.isArray(ownerPerformance)) {
    return [];
  }

  return ownerPerformance.map((item, index) => ({
    ownerId: item.ownerId ?? `owner-${index + 1}`,
    ownerName: item.ownerName ?? `Owner ${index + 1}`,
    activeDeals: item.activeDeals ?? 0,
    pipelineValue: item.pipelineValue ?? 0,
    weightedValue: item.weightedValue ?? 0,
    wonDeals: item.wonDeals ?? 0,
    lostDeals: item.lostDeals ?? 0,
    winRate: item.winRate ?? 0,
    averageCycleDays: item.averageCycleDays ?? 0,
  }));
};

const normalizeSourcePerformance = (
  sourcePerformance?: Partial<PipelineSourcePerformanceItem>[],
): PipelineSourcePerformanceItem[] => {
  if (!Array.isArray(sourcePerformance)) {
    return [];
  }

  return sourcePerformance.map((item, index) => ({
    sourceId: item.sourceId ?? `source-${index + 1}`,
    sourceName: item.sourceName ?? `Source ${index + 1}`,
    dealCount: item.dealCount ?? 0,
    pipelineValue: item.pipelineValue ?? 0,
    wonDeals: item.wonDeals ?? 0,
    winRate: item.winRate ?? 0,
    averageDealSize: item.averageDealSize ?? 0,
  }));
};

const normalizeStuckDeals = (
  stuckDeals?: Partial<PipelineStuckDealItem>[],
): PipelineStuckDealItem[] => {
  if (!Array.isArray(stuckDeals)) {
    return [];
  }

  return stuckDeals.map((item, index) => ({
    dealId: item.dealId ?? `deal-${index + 1}`,
    dealName: item.dealName ?? `Deal ${index + 1}`,
    stageId: item.stageId ?? `stage-${index + 1}`,
    stageName: item.stageName ?? `Stage ${index + 1}`,
    ownerName: item.ownerName ?? `Owner ${index + 1}`,
    value: item.value ?? 0,
    daysInStage: item.daysInStage ?? 0,
    riskLevel: item.riskLevel ?? 'medium',
  }));
};

const normalizeStageConversions = (
  stageConversions?: Partial<PipelineStageConversionItem>[],
): PipelineStageConversionItem[] => {
  if (!Array.isArray(stageConversions)) {
    return [];
  }

  return stageConversions.map((item, index) => ({
    fromStageId: item.fromStageId ?? `from-stage-${index + 1}`,
    fromStageName: item.fromStageName ?? `From Stage ${index + 1}`,
    toStageId: item.toStageId ?? `to-stage-${index + 1}`,
    toStageName: item.toStageName ?? `To Stage ${index + 1}`,
    conversionRate: item.conversionRate ?? 0,
    averageTransitionDays: item.averageTransitionDays ?? 0,
    dropOffRate: item.dropOffRate ?? 0,
  }));
};

const normalizePipelineAnalyticsResponse = (
  response: PipelineAnalyticsApiResponse | Partial<PipelineAnalyticsData>,
): PipelineAnalyticsData => {
  const nestedData =
    'data' in response && response.data ? response.data : response;

  return {
    summary: normalizeSummary(
      nestedData.summary ?? response.summary ?? DEFAULT_PIPELINE_SUMMARY,
    ),
    funnel: normalizeFunnel(nestedData.funnel ?? response.funnel),
    trend: normalizeTrend(nestedData.trend ?? response.trend),
    ownerPerformance: normalizeOwnerPerformance(
      nestedData.ownerPerformance ?? response.ownerPerformance,
    ),
    sourcePerformance: normalizeSourcePerformance(
      nestedData.sourcePerformance ?? response.sourcePerformance,
    ),
    stuckDeals: normalizeStuckDeals(
      nestedData.stuckDeals ?? response.stuckDeals,
    ),
    stageConversions: normalizeStageConversions(
      nestedData.stageConversions ?? response.stageConversions,
    ),
    generatedAt: nestedData.generatedAt ?? response.generatedAt ?? new Date().toISOString(),
  };
};

export const usePipelineAnalytics = (
  options: UsePipelineAnalyticsOptions = {},
): UsePipelineAnalyticsReturn => {
  const {
    endpoint = '/api/analytics/pipeline',
    initialFilters = {},
    initialComparePeriod = null,
    enabled = true,
    useMockOnError = false,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<PipelineAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<PipelineAnalyticsFilters>(initialFilters);
  const [comparePeriod, setComparePeriodState] =
    useState<PipelineComparePeriod | null>(initialComparePeriod);

  const setFilters = useCallback(
    (
      updater:
        | PipelineAnalyticsFilters
        | ((prev: PipelineAnalyticsFilters) => PipelineAnalyticsFilters),
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
        | PipelineComparePeriod
        | null
        | ((prev: PipelineComparePeriod | null) => PipelineComparePeriod | null),
    ) => {
      setComparePeriodState((prev) =>
        typeof updater === 'function' ? updater(prev) : updater,
      );
    },
    [],
  );

  const fetchPipelineAnalytics = useCallback(
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
          let message = `Failed to load pipeline analytics. Status: ${response.status}`;

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
          (await response.json()) as PipelineAnalyticsApiResponse | Partial<PipelineAnalyticsData>;

        const normalized = normalizePipelineAnalyticsResponse(json);

        setData(normalized);
        onSuccess?.(normalized);
      } catch (err) {
        const resolvedError =
          err instanceof Error ? err : new Error('Failed to load pipeline analytics.');

        if (useMockOnError) {
          const mockData = createMockPipelineAnalytics();
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
    await fetchPipelineAnalytics(true);
  }, [fetchPipelineAnalytics]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsRefreshing(false);
    setFiltersState(initialFilters);
    setComparePeriodState(initialComparePeriod);
  }, [initialComparePeriod, initialFilters]);

  useEffect(() => {
    void fetchPipelineAnalytics(false);
  }, [fetchPipelineAnalytics]);

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

export default usePipelineAnalytics;