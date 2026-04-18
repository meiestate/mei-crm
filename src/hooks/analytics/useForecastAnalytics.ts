import { useCallback, useEffect, useMemo, useState } from 'react';

export interface ForecastAnalyticsFilters {
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  projectIds?: string[];
  sourceIds?: string[];
  ownerIds?: string[];
  teamIds?: string[];
  statuses?: string[];
  locations?: string[];
  tags?: string[];
  search?: string;
  [key: string]: unknown;
}

export interface ForecastComparePeriod {
  enabled: boolean;
  type?: 'previous_period' | 'previous_month' | 'previous_quarter' | 'previous_year' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface ForecastSummary {
  forecastRevenue: number;
  weightedPipelineValue: number;
  committedRevenue: number;
  bestCaseRevenue: number;
  worstCaseRevenue: number;
  expectedWinRate: number;
  forecastAccuracy: number;
  pipelineCoverage: number;
  gapToTarget: number;
}

export interface ForecastTrendPoint {
  period: string;
  forecast: number;
  actual: number;
  committed: number;
  bestCase: number;
  worstCase: number;
  target: number;
}

export interface ForecastStageBreakdownItem {
  stageId: string;
  stageName: string;
  dealCount: number;
  dealValue: number;
  weightedValue: number;
  probability: number;
}

export interface ForecastOwnerPerformanceItem {
  ownerId: string;
  ownerName: string;
  committedRevenue: number;
  forecastRevenue: number;
  achievedRevenue: number;
  winRate: number;
}

export interface ForecastRiskItem {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impactValue: number;
}

export interface ForecastAnalyticsData {
  summary: ForecastSummary;
  trend: ForecastTrendPoint[];
  stageBreakdown: ForecastStageBreakdownItem[];
  ownerPerformance: ForecastOwnerPerformanceItem[];
  risks: ForecastRiskItem[];
  generatedAt: string;
}

export interface UseForecastAnalyticsOptions {
  endpoint?: string;
  initialFilters?: ForecastAnalyticsFilters;
  initialComparePeriod?: ForecastComparePeriod | null;
  enabled?: boolean;
  useMockOnError?: boolean;
  onSuccess?: (data: ForecastAnalyticsData) => void;
  onError?: (error: Error) => void;
}

export interface UseForecastAnalyticsReturn {
  data: ForecastAnalyticsData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  filters: ForecastAnalyticsFilters;
  comparePeriod: ForecastComparePeriod | null;
  setFilters: (
    updater:
      | ForecastAnalyticsFilters
      | ((prev: ForecastAnalyticsFilters) => ForecastAnalyticsFilters)
  ) => void;
  setComparePeriod: (
    updater:
      | ForecastComparePeriod
      | null
      | ((prev: ForecastComparePeriod | null) => ForecastComparePeriod | null)
  ) => void;
  refetch: () => Promise<void>;
  reset: () => void;
}

interface ForecastAnalyticsApiResponse {
  data?: Partial<ForecastAnalyticsData>;
  summary?: Partial<ForecastSummary>;
  trend?: Partial<ForecastTrendPoint>[];
  stageBreakdown?: Partial<ForecastStageBreakdownItem>[];
  ownerPerformance?: Partial<ForecastOwnerPerformanceItem>[];
  risks?: Partial<ForecastRiskItem>[];
  generatedAt?: string;
}

const DEFAULT_FORECAST_SUMMARY: ForecastSummary = {
  forecastRevenue: 0,
  weightedPipelineValue: 0,
  committedRevenue: 0,
  bestCaseRevenue: 0,
  worstCaseRevenue: 0,
  expectedWinRate: 0,
  forecastAccuracy: 0,
  pipelineCoverage: 0,
  gapToTarget: 0,
};

const createMockForecastAnalytics = (): ForecastAnalyticsData => {
  return {
    summary: {
      forecastRevenue: 12850000,
      weightedPipelineValue: 10420000,
      committedRevenue: 8150000,
      bestCaseRevenue: 14200000,
      worstCaseRevenue: 7250000,
      expectedWinRate: 38,
      forecastAccuracy: 84,
      pipelineCoverage: 2.4,
      gapToTarget: 1150000,
    },
    trend: [
      {
        period: 'Jan',
        forecast: 1800000,
        actual: 1650000,
        committed: 1400000,
        bestCase: 1950000,
        worstCase: 1200000,
        target: 2000000,
      },
      {
        period: 'Feb',
        forecast: 2100000,
        actual: 2050000,
        committed: 1750000,
        bestCase: 2250000,
        worstCase: 1550000,
        target: 2200000,
      },
      {
        period: 'Mar',
        forecast: 2350000,
        actual: 2280000,
        committed: 1900000,
        bestCase: 2480000,
        worstCase: 1680000,
        target: 2400000,
      },
      {
        period: 'Apr',
        forecast: 2600000,
        actual: 0,
        committed: 2100000,
        bestCase: 2780000,
        worstCase: 1820000,
        target: 2700000,
      },
      {
        period: 'May',
        forecast: 1950000,
        actual: 0,
        committed: 1560000,
        bestCase: 2140000,
        worstCase: 1290000,
        target: 2100000,
      },
      {
        period: 'Jun',
        forecast: 2050000,
        actual: 0,
        committed: 1660000,
        bestCase: 2230000,
        worstCase: 1380000,
        target: 2150000,
      },
    ],
    stageBreakdown: [
      {
        stageId: 'new',
        stageName: 'New Leads',
        dealCount: 54,
        dealValue: 3100000,
        weightedValue: 620000,
        probability: 20,
      },
      {
        stageId: 'qualified',
        stageName: 'Qualified',
        dealCount: 42,
        dealValue: 4200000,
        weightedValue: 1680000,
        probability: 40,
      },
      {
        stageId: 'proposal',
        stageName: 'Proposal',
        dealCount: 27,
        dealValue: 3650000,
        weightedValue: 2190000,
        probability: 60,
      },
      {
        stageId: 'negotiation',
        stageName: 'Negotiation',
        dealCount: 16,
        dealValue: 2850000,
        weightedValue: 2280000,
        probability: 80,
      },
      {
        stageId: 'commitment',
        stageName: 'Commitment',
        dealCount: 9,
        dealValue: 2150000,
        weightedValue: 1935000,
        probability: 90,
      },
    ],
    ownerPerformance: [
      {
        ownerId: 'u1',
        ownerName: 'Arun Kumar',
        committedRevenue: 2100000,
        forecastRevenue: 3150000,
        achievedRevenue: 1840000,
        winRate: 41,
      },
      {
        ownerId: 'u2',
        ownerName: 'Priya S',
        committedRevenue: 1850000,
        forecastRevenue: 2760000,
        achievedRevenue: 1690000,
        winRate: 39,
      },
      {
        ownerId: 'u3',
        ownerName: 'Rohit Raj',
        committedRevenue: 1420000,
        forecastRevenue: 2240000,
        achievedRevenue: 1280000,
        winRate: 36,
      },
      {
        ownerId: 'u4',
        ownerName: 'Meena V',
        committedRevenue: 1180000,
        forecastRevenue: 1970000,
        achievedRevenue: 1115000,
        winRate: 34,
      },
    ],
    risks: [
      {
        id: 'r1',
        title: 'High dependency on late-stage deals',
        description:
          'A large share of the forecast depends on a small number of negotiation-stage opportunities.',
        severity: 'high',
        impactValue: 1750000,
      },
      {
        id: 'r2',
        title: 'Target gap remains open',
        description:
          'Current committed revenue is still below the period target and needs faster movement in proposal-stage deals.',
        severity: 'medium',
        impactValue: 1150000,
      },
      {
        id: 'r3',
        title: 'Forecast volatility in one region',
        description:
          'One major region shows higher drop-off risk compared with the rest of the pipeline.',
        severity: 'medium',
        impactValue: 640000,
      },
    ],
    generatedAt: new Date().toISOString(),
  };
};

const normalizeSummary = (summary?: Partial<ForecastSummary>): ForecastSummary => {
  return {
    forecastRevenue: summary?.forecastRevenue ?? 0,
    weightedPipelineValue: summary?.weightedPipelineValue ?? 0,
    committedRevenue: summary?.committedRevenue ?? 0,
    bestCaseRevenue: summary?.bestCaseRevenue ?? 0,
    worstCaseRevenue: summary?.worstCaseRevenue ?? 0,
    expectedWinRate: summary?.expectedWinRate ?? 0,
    forecastAccuracy: summary?.forecastAccuracy ?? 0,
    pipelineCoverage: summary?.pipelineCoverage ?? 0,
    gapToTarget: summary?.gapToTarget ?? 0,
  };
};

const normalizeTrend = (trend?: Partial<ForecastTrendPoint>[]): ForecastTrendPoint[] => {
  if (!Array.isArray(trend)) {
    return [];
  }

  return trend.map((item, index) => ({
    period: item.period ?? `P${index + 1}`,
    forecast: item.forecast ?? 0,
    actual: item.actual ?? 0,
    committed: item.committed ?? 0,
    bestCase: item.bestCase ?? 0,
    worstCase: item.worstCase ?? 0,
    target: item.target ?? 0,
  }));
};

const normalizeStageBreakdown = (
  stageBreakdown?: Partial<ForecastStageBreakdownItem>[],
): ForecastStageBreakdownItem[] => {
  if (!Array.isArray(stageBreakdown)) {
    return [];
  }

  return stageBreakdown.map((item, index) => ({
    stageId: item.stageId ?? `stage-${index + 1}`,
    stageName: item.stageName ?? `Stage ${index + 1}`,
    dealCount: item.dealCount ?? 0,
    dealValue: item.dealValue ?? 0,
    weightedValue: item.weightedValue ?? 0,
    probability: item.probability ?? 0,
  }));
};

const normalizeOwnerPerformance = (
  ownerPerformance?: Partial<ForecastOwnerPerformanceItem>[],
): ForecastOwnerPerformanceItem[] => {
  if (!Array.isArray(ownerPerformance)) {
    return [];
  }

  return ownerPerformance.map((item, index) => ({
    ownerId: item.ownerId ?? `owner-${index + 1}`,
    ownerName: item.ownerName ?? `Owner ${index + 1}`,
    committedRevenue: item.committedRevenue ?? 0,
    forecastRevenue: item.forecastRevenue ?? 0,
    achievedRevenue: item.achievedRevenue ?? 0,
    winRate: item.winRate ?? 0,
  }));
};

const normalizeRisks = (risks?: Partial<ForecastRiskItem>[]): ForecastRiskItem[] => {
  if (!Array.isArray(risks)) {
    return [];
  }

  return risks.map((item, index) => ({
    id: item.id ?? `risk-${index + 1}`,
    title: item.title ?? `Risk ${index + 1}`,
    description: item.description ?? '',
    severity: item.severity ?? 'medium',
    impactValue: item.impactValue ?? 0,
  }));
};

const normalizeForecastAnalyticsResponse = (
  response: ForecastAnalyticsApiResponse | Partial<ForecastAnalyticsData>,
): ForecastAnalyticsData => {
  const nestedData =
    'data' in response && response.data ? response.data : response;

  return {
    summary: normalizeSummary(nestedData.summary ?? response.summary ?? DEFAULT_FORECAST_SUMMARY),
    trend: normalizeTrend(nestedData.trend ?? response.trend),
    stageBreakdown: normalizeStageBreakdown(nestedData.stageBreakdown ?? response.stageBreakdown),
    ownerPerformance: normalizeOwnerPerformance(
      nestedData.ownerPerformance ?? response.ownerPerformance,
    ),
    risks: normalizeRisks(nestedData.risks ?? response.risks),
    generatedAt: nestedData.generatedAt ?? response.generatedAt ?? new Date().toISOString(),
  };
};

export const useForecastAnalytics = (
  options: UseForecastAnalyticsOptions = {},
): UseForecastAnalyticsReturn => {
  const {
    endpoint = '/api/analytics/forecast',
    initialFilters = {},
    initialComparePeriod = null,
    enabled = true,
    useMockOnError = false,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<ForecastAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ForecastAnalyticsFilters>(initialFilters);
  const [comparePeriod, setComparePeriodState] =
    useState<ForecastComparePeriod | null>(initialComparePeriod);

  const setFilters = useCallback(
    (
      updater:
        | ForecastAnalyticsFilters
        | ((prev: ForecastAnalyticsFilters) => ForecastAnalyticsFilters),
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
        | ForecastComparePeriod
        | null
        | ((prev: ForecastComparePeriod | null) => ForecastComparePeriod | null),
    ) => {
      setComparePeriodState((prev) =>
        typeof updater === 'function' ? updater(prev) : updater,
      );
    },
    [],
  );

  const fetchForecastAnalytics = useCallback(
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
          let message = `Failed to load forecast analytics. Status: ${response.status}`;

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

        const json = (await response.json()) as ForecastAnalyticsApiResponse | Partial<ForecastAnalyticsData>;
        const normalized = normalizeForecastAnalyticsResponse(json);

        setData(normalized);
        onSuccess?.(normalized);
      } catch (err) {
        const resolvedError =
          err instanceof Error ? err : new Error('Failed to load forecast analytics.');

        if (useMockOnError) {
          const mockData = createMockForecastAnalytics();
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
    await fetchForecastAnalytics(true);
  }, [fetchForecastAnalytics]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsRefreshing(false);
    setFiltersState(initialFilters);
    setComparePeriodState(initialComparePeriod);
  }, [initialComparePeriod, initialFilters]);

  useEffect(() => {
    void fetchForecastAnalytics(false);
  }, [fetchForecastAnalytics]);

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

export default useForecastAnalytics;