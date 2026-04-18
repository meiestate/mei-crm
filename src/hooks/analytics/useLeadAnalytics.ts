import { useCallback, useEffect, useMemo, useState } from 'react';

export interface LeadAnalyticsFilters {
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

export interface LeadComparePeriod {
  enabled: boolean;
  type?: 'previous_period' | 'previous_month' | 'previous_quarter' | 'previous_year' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface LeadAnalyticsSummary {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRate: number;
  qualificationRate: number;
  contactRate: number;
  averageResponseTimeHours: number;
  costPerLead?: number;
}

export interface LeadTrendPoint {
  period: string;
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRate: number;
}

export interface LeadSourcePerformanceItem {
  sourceId: string;
  sourceName: string;
  leadCount: number;
  qualifiedCount: number;
  convertedCount: number;
  lostCount: number;
  conversionRate: number;
}

export interface LeadStageDistributionItem {
  stageId: string;
  stageName: string;
  leadCount: number;
  percentage: number;
}

export interface LeadOwnerPerformanceItem {
  ownerId: string;
  ownerName: string;
  leadCount: number;
  qualifiedCount: number;
  convertedCount: number;
  conversionRate: number;
  averageResponseTimeHours: number;
}

export interface LeadLocationPerformanceItem {
  locationId: string;
  locationName: string;
  leadCount: number;
  convertedCount: number;
  conversionRate: number;
}

export interface LeadLossReasonItem {
  reasonId: string;
  reasonName: string;
  count: number;
  percentage: number;
}

export interface LeadAnalyticsData {
  summary: LeadAnalyticsSummary;
  trend: LeadTrendPoint[];
  sourcePerformance: LeadSourcePerformanceItem[];
  stageDistribution: LeadStageDistributionItem[];
  ownerPerformance: LeadOwnerPerformanceItem[];
  locationPerformance: LeadLocationPerformanceItem[];
  lossReasons: LeadLossReasonItem[];
  generatedAt: string;
}

export interface UseLeadAnalyticsOptions {
  endpoint?: string;
  initialFilters?: LeadAnalyticsFilters;
  initialComparePeriod?: LeadComparePeriod | null;
  enabled?: boolean;
  useMockOnError?: boolean;
  onSuccess?: (data: LeadAnalyticsData) => void;
  onError?: (error: Error) => void;
}

export interface UseLeadAnalyticsReturn {
  data: LeadAnalyticsData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  filters: LeadAnalyticsFilters;
  comparePeriod: LeadComparePeriod | null;
  setFilters: (
    updater:
      | LeadAnalyticsFilters
      | ((prev: LeadAnalyticsFilters) => LeadAnalyticsFilters)
  ) => void;
  setComparePeriod: (
    updater:
      | LeadComparePeriod
      | null
      | ((prev: LeadComparePeriod | null) => LeadComparePeriod | null)
  ) => void;
  refetch: () => Promise<void>;
  reset: () => void;
}

interface LeadAnalyticsApiResponse {
  data?: Partial<LeadAnalyticsData>;
  summary?: Partial<LeadAnalyticsSummary>;
  trend?: Partial<LeadTrendPoint>[];
  sourcePerformance?: Partial<LeadSourcePerformanceItem>[];
  stageDistribution?: Partial<LeadStageDistributionItem>[];
  ownerPerformance?: Partial<LeadOwnerPerformanceItem>[];
  locationPerformance?: Partial<LeadLocationPerformanceItem>[];
  lossReasons?: Partial<LeadLossReasonItem>[];
  generatedAt?: string;
}

const DEFAULT_LEAD_SUMMARY: LeadAnalyticsSummary = {
  totalLeads: 0,
  newLeads: 0,
  qualifiedLeads: 0,
  contactedLeads: 0,
  convertedLeads: 0,
  lostLeads: 0,
  conversionRate: 0,
  qualificationRate: 0,
  contactRate: 0,
  averageResponseTimeHours: 0,
  costPerLead: 0,
};

const createMockLeadAnalytics = (): LeadAnalyticsData => {
  return {
    summary: {
      totalLeads: 1240,
      newLeads: 286,
      qualifiedLeads: 540,
      contactedLeads: 910,
      convertedLeads: 142,
      lostLeads: 198,
      conversionRate: 11.45,
      qualificationRate: 43.55,
      contactRate: 73.39,
      averageResponseTimeHours: 2.8,
      costPerLead: 420,
    },
    trend: [
      {
        period: 'Jan',
        totalLeads: 180,
        newLeads: 180,
        qualifiedLeads: 72,
        convertedLeads: 18,
        lostLeads: 22,
        conversionRate: 10,
      },
      {
        period: 'Feb',
        totalLeads: 205,
        newLeads: 205,
        qualifiedLeads: 86,
        convertedLeads: 24,
        lostLeads: 27,
        conversionRate: 11.71,
      },
      {
        period: 'Mar',
        totalLeads: 194,
        newLeads: 194,
        qualifiedLeads: 84,
        convertedLeads: 21,
        lostLeads: 31,
        conversionRate: 10.82,
      },
      {
        period: 'Apr',
        totalLeads: 226,
        newLeads: 226,
        qualifiedLeads: 102,
        convertedLeads: 28,
        lostLeads: 34,
        conversionRate: 12.39,
      },
      {
        period: 'May',
        totalLeads: 211,
        newLeads: 211,
        qualifiedLeads: 91,
        convertedLeads: 25,
        lostLeads: 39,
        conversionRate: 11.85,
      },
      {
        period: 'Jun',
        totalLeads: 224,
        newLeads: 224,
        qualifiedLeads: 105,
        convertedLeads: 26,
        lostLeads: 45,
        conversionRate: 11.61,
      },
    ],
    sourcePerformance: [
      {
        sourceId: 'facebook',
        sourceName: 'Facebook Ads',
        leadCount: 320,
        qualifiedCount: 136,
        convertedCount: 34,
        lostCount: 56,
        conversionRate: 10.63,
      },
      {
        sourceId: 'google',
        sourceName: 'Google Ads',
        leadCount: 275,
        qualifiedCount: 128,
        convertedCount: 39,
        lostCount: 41,
        conversionRate: 14.18,
      },
      {
        sourceId: 'referral',
        sourceName: 'Referral',
        leadCount: 210,
        qualifiedCount: 122,
        convertedCount: 36,
        lostCount: 19,
        conversionRate: 17.14,
      },
      {
        sourceId: 'whatsapp',
        sourceName: 'WhatsApp Campaign',
        leadCount: 180,
        qualifiedCount: 63,
        convertedCount: 14,
        lostCount: 38,
        conversionRate: 7.78,
      },
    ],
    stageDistribution: [
      {
        stageId: 'new',
        stageName: 'New',
        leadCount: 286,
        percentage: 23.06,
      },
      {
        stageId: 'contacted',
        stageName: 'Contacted',
        leadCount: 370,
        percentage: 29.84,
      },
      {
        stageId: 'qualified',
        stageName: 'Qualified',
        leadCount: 244,
        percentage: 19.68,
      },
      {
        stageId: 'proposal',
        stageName: 'Proposal',
        leadCount: 112,
        percentage: 9.03,
      },
      {
        stageId: 'converted',
        stageName: 'Converted',
        leadCount: 142,
        percentage: 11.45,
      },
      {
        stageId: 'lost',
        stageName: 'Lost',
        leadCount: 86,
        percentage: 6.94,
      },
    ],
    ownerPerformance: [
      {
        ownerId: 'u1',
        ownerName: 'Arun Kumar',
        leadCount: 320,
        qualifiedCount: 152,
        convertedCount: 39,
        conversionRate: 12.19,
        averageResponseTimeHours: 2.1,
      },
      {
        ownerId: 'u2',
        ownerName: 'Priya S',
        leadCount: 286,
        qualifiedCount: 123,
        convertedCount: 31,
        conversionRate: 10.84,
        averageResponseTimeHours: 2.6,
      },
      {
        ownerId: 'u3',
        ownerName: 'Rohit Raj',
        leadCount: 304,
        qualifiedCount: 131,
        convertedCount: 35,
        conversionRate: 11.51,
        averageResponseTimeHours: 3.3,
      },
      {
        ownerId: 'u4',
        ownerName: 'Meena V',
        leadCount: 330,
        qualifiedCount: 134,
        convertedCount: 37,
        conversionRate: 11.21,
        averageResponseTimeHours: 2.9,
      },
    ],
    locationPerformance: [
      {
        locationId: 'blr-east',
        locationName: 'Bangalore East',
        leadCount: 420,
        convertedCount: 52,
        conversionRate: 12.38,
      },
      {
        locationId: 'blr-south',
        locationName: 'Bangalore South',
        leadCount: 318,
        convertedCount: 35,
        conversionRate: 11.01,
      },
      {
        locationId: 'blr-north',
        locationName: 'Bangalore North',
        leadCount: 282,
        convertedCount: 29,
        conversionRate: 10.28,
      },
      {
        locationId: 'blr-west',
        locationName: 'Bangalore West',
        leadCount: 220,
        convertedCount: 26,
        conversionRate: 11.82,
      },
    ],
    lossReasons: [
      {
        reasonId: 'budget',
        reasonName: 'Budget Mismatch',
        count: 58,
        percentage: 29.29,
      },
      {
        reasonId: 'location',
        reasonName: 'Location Preference',
        count: 41,
        percentage: 20.71,
      },
      {
        reasonId: 'competition',
        reasonName: 'Competitor Closed',
        count: 33,
        percentage: 16.67,
      },
      {
        reasonId: 'followup',
        reasonName: 'No Follow-up Response',
        count: 37,
        percentage: 18.69,
      },
      {
        reasonId: 'timeline',
        reasonName: 'Delayed Decision',
        count: 29,
        percentage: 14.65,
      },
    ],
    generatedAt: new Date().toISOString(),
  };
};

const normalizeSummary = (summary?: Partial<LeadAnalyticsSummary>): LeadAnalyticsSummary => {
  return {
    totalLeads: summary?.totalLeads ?? 0,
    newLeads: summary?.newLeads ?? 0,
    qualifiedLeads: summary?.qualifiedLeads ?? 0,
    contactedLeads: summary?.contactedLeads ?? 0,
    convertedLeads: summary?.convertedLeads ?? 0,
    lostLeads: summary?.lostLeads ?? 0,
    conversionRate: summary?.conversionRate ?? 0,
    qualificationRate: summary?.qualificationRate ?? 0,
    contactRate: summary?.contactRate ?? 0,
    averageResponseTimeHours: summary?.averageResponseTimeHours ?? 0,
    costPerLead: summary?.costPerLead ?? 0,
  };
};

const normalizeTrend = (trend?: Partial<LeadTrendPoint>[]): LeadTrendPoint[] => {
  if (!Array.isArray(trend)) {
    return [];
  }

  return trend.map((item, index) => ({
    period: item.period ?? `P${index + 1}`,
    totalLeads: item.totalLeads ?? 0,
    newLeads: item.newLeads ?? 0,
    qualifiedLeads: item.qualifiedLeads ?? 0,
    convertedLeads: item.convertedLeads ?? 0,
    lostLeads: item.lostLeads ?? 0,
    conversionRate: item.conversionRate ?? 0,
  }));
};

const normalizeSourcePerformance = (
  sourcePerformance?: Partial<LeadSourcePerformanceItem>[],
): LeadSourcePerformanceItem[] => {
  if (!Array.isArray(sourcePerformance)) {
    return [];
  }

  return sourcePerformance.map((item, index) => ({
    sourceId: item.sourceId ?? `source-${index + 1}`,
    sourceName: item.sourceName ?? `Source ${index + 1}`,
    leadCount: item.leadCount ?? 0,
    qualifiedCount: item.qualifiedCount ?? 0,
    convertedCount: item.convertedCount ?? 0,
    lostCount: item.lostCount ?? 0,
    conversionRate: item.conversionRate ?? 0,
  }));
};

const normalizeStageDistribution = (
  stageDistribution?: Partial<LeadStageDistributionItem>[],
): LeadStageDistributionItem[] => {
  if (!Array.isArray(stageDistribution)) {
    return [];
  }

  return stageDistribution.map((item, index) => ({
    stageId: item.stageId ?? `stage-${index + 1}`,
    stageName: item.stageName ?? `Stage ${index + 1}`,
    leadCount: item.leadCount ?? 0,
    percentage: item.percentage ?? 0,
  }));
};

const normalizeOwnerPerformance = (
  ownerPerformance?: Partial<LeadOwnerPerformanceItem>[],
): LeadOwnerPerformanceItem[] => {
  if (!Array.isArray(ownerPerformance)) {
    return [];
  }

  return ownerPerformance.map((item, index) => ({
    ownerId: item.ownerId ?? `owner-${index + 1}`,
    ownerName: item.ownerName ?? `Owner ${index + 1}`,
    leadCount: item.leadCount ?? 0,
    qualifiedCount: item.qualifiedCount ?? 0,
    convertedCount: item.convertedCount ?? 0,
    conversionRate: item.conversionRate ?? 0,
    averageResponseTimeHours: item.averageResponseTimeHours ?? 0,
  }));
};

const normalizeLocationPerformance = (
  locationPerformance?: Partial<LeadLocationPerformanceItem>[],
): LeadLocationPerformanceItem[] => {
  if (!Array.isArray(locationPerformance)) {
    return [];
  }

  return locationPerformance.map((item, index) => ({
    locationId: item.locationId ?? `location-${index + 1}`,
    locationName: item.locationName ?? `Location ${index + 1}`,
    leadCount: item.leadCount ?? 0,
    convertedCount: item.convertedCount ?? 0,
    conversionRate: item.conversionRate ?? 0,
  }));
};

const normalizeLossReasons = (
  lossReasons?: Partial<LeadLossReasonItem>[],
): LeadLossReasonItem[] => {
  if (!Array.isArray(lossReasons)) {
    return [];
  }

  return lossReasons.map((item, index) => ({
    reasonId: item.reasonId ?? `reason-${index + 1}`,
    reasonName: item.reasonName ?? `Reason ${index + 1}`,
    count: item.count ?? 0,
    percentage: item.percentage ?? 0,
  }));
};

const normalizeLeadAnalyticsResponse = (
  response: LeadAnalyticsApiResponse | Partial<LeadAnalyticsData>,
): LeadAnalyticsData => {
  const nestedData =
    'data' in response && response.data ? response.data : response;

  return {
    summary: normalizeSummary(nestedData.summary ?? response.summary ?? DEFAULT_LEAD_SUMMARY),
    trend: normalizeTrend(nestedData.trend ?? response.trend),
    sourcePerformance: normalizeSourcePerformance(
      nestedData.sourcePerformance ?? response.sourcePerformance,
    ),
    stageDistribution: normalizeStageDistribution(
      nestedData.stageDistribution ?? response.stageDistribution,
    ),
    ownerPerformance: normalizeOwnerPerformance(
      nestedData.ownerPerformance ?? response.ownerPerformance,
    ),
    locationPerformance: normalizeLocationPerformance(
      nestedData.locationPerformance ?? response.locationPerformance,
    ),
    lossReasons: normalizeLossReasons(nestedData.lossReasons ?? response.lossReasons),
    generatedAt: nestedData.generatedAt ?? response.generatedAt ?? new Date().toISOString(),
  };
};

export const useLeadAnalytics = (
  options: UseLeadAnalyticsOptions = {},
): UseLeadAnalyticsReturn => {
  const {
    endpoint = '/api/analytics/leads',
    initialFilters = {},
    initialComparePeriod = null,
    enabled = true,
    useMockOnError = false,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<LeadAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<LeadAnalyticsFilters>(initialFilters);
  const [comparePeriod, setComparePeriodState] =
    useState<LeadComparePeriod | null>(initialComparePeriod);

  const setFilters = useCallback(
    (
      updater:
        | LeadAnalyticsFilters
        | ((prev: LeadAnalyticsFilters) => LeadAnalyticsFilters),
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
        | LeadComparePeriod
        | null
        | ((prev: LeadComparePeriod | null) => LeadComparePeriod | null),
    ) => {
      setComparePeriodState((prev) =>
        typeof updater === 'function' ? updater(prev) : updater,
      );
    },
    [],
  );

  const fetchLeadAnalytics = useCallback(
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
          let message = `Failed to load lead analytics. Status: ${response.status}`;

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

        const json = (await response.json()) as LeadAnalyticsApiResponse | Partial<LeadAnalyticsData>;
        const normalized = normalizeLeadAnalyticsResponse(json);

        setData(normalized);
        onSuccess?.(normalized);
      } catch (err) {
        const resolvedError =
          err instanceof Error ? err : new Error('Failed to load lead analytics.');

        if (useMockOnError) {
          const mockData = createMockLeadAnalytics();
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
    await fetchLeadAnalytics(true);
  }, [fetchLeadAnalytics]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsRefreshing(false);
    setFiltersState(initialFilters);
    setComparePeriodState(initialComparePeriod);
  }, [initialComparePeriod, initialFilters]);

  useEffect(() => {
    void fetchLeadAnalytics(false);
  }, [fetchLeadAnalytics]);

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

export default useLeadAnalytics;