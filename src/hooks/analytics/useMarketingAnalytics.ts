import { useCallback, useEffect, useMemo, useState } from 'react';

export interface MarketingAnalyticsFilters {
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  campaignIds?: string[];
  channelIds?: string[];
  sourceIds?: string[];
  ownerIds?: string[];
  teamIds?: string[];
  projectIds?: string[];
  locations?: string[];
  statuses?: string[];
  tags?: string[];
  search?: string;
  [key: string]: unknown;
}

export interface MarketingComparePeriod {
  enabled: boolean;
  type?: 'previous_period' | 'previous_month' | 'previous_quarter' | 'previous_year' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface MarketingAnalyticsSummary {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  clickThroughRate: number;
  costPerClick: number;
  costPerLead: number;
  costPerQualifiedLead: number;
  returnOnAdSpend: number;
  revenueAttributed: number;
}

export interface MarketingTrendPoint {
  period: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  qualifiedLeads: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpl: number;
  roas: number;
}

export interface MarketingChannelPerformanceItem {
  channelId: string;
  channelName: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  qualifiedLeads: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpl: number;
  roas: number;
}

export interface MarketingCampaignPerformanceItem {
  campaignId: string;
  campaignName: string;
  channelName: string;
  spend: number;
  leads: number;
  qualifiedLeads: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  roas: number;
}

export interface MarketingSourceToRevenueItem {
  sourceId: string;
  sourceName: string;
  leads: number;
  conversions: number;
  revenue: number;
  averageDealValue: number;
}

export interface MarketingGeoPerformanceItem {
  locationId: string;
  locationName: string;
  spend: number;
  leads: number;
  conversions: number;
  revenue: number;
  roas: number;
}

export interface MarketingAttributionItem {
  touchpoint: string;
  attributedRevenue: number;
  attributedConversions: number;
  sharePercentage: number;
}

export interface MarketingAnalyticsData {
  summary: MarketingAnalyticsSummary;
  trend: MarketingTrendPoint[];
  channelPerformance: MarketingChannelPerformanceItem[];
  campaignPerformance: MarketingCampaignPerformanceItem[];
  sourceToRevenue: MarketingSourceToRevenueItem[];
  geoPerformance: MarketingGeoPerformanceItem[];
  attribution: MarketingAttributionItem[];
  generatedAt: string;
}

export interface UseMarketingAnalyticsOptions {
  endpoint?: string;
  initialFilters?: MarketingAnalyticsFilters;
  initialComparePeriod?: MarketingComparePeriod | null;
  enabled?: boolean;
  useMockOnError?: boolean;
  onSuccess?: (data: MarketingAnalyticsData) => void;
  onError?: (error: Error) => void;
}

export interface UseMarketingAnalyticsReturn {
  data: MarketingAnalyticsData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  filters: MarketingAnalyticsFilters;
  comparePeriod: MarketingComparePeriod | null;
  setFilters: (
    updater:
      | MarketingAnalyticsFilters
      | ((prev: MarketingAnalyticsFilters) => MarketingAnalyticsFilters)
  ) => void;
  setComparePeriod: (
    updater:
      | MarketingComparePeriod
      | null
      | ((prev: MarketingComparePeriod | null) => MarketingComparePeriod | null)
  ) => void;
  refetch: () => Promise<void>;
  reset: () => void;
}

interface MarketingAnalyticsApiResponse {
  data?: Partial<MarketingAnalyticsData>;
  summary?: Partial<MarketingAnalyticsSummary>;
  trend?: Partial<MarketingTrendPoint>[];
  channelPerformance?: Partial<MarketingChannelPerformanceItem>[];
  campaignPerformance?: Partial<MarketingCampaignPerformanceItem>[];
  sourceToRevenue?: Partial<MarketingSourceToRevenueItem>[];
  geoPerformance?: Partial<MarketingGeoPerformanceItem>[];
  attribution?: Partial<MarketingAttributionItem>[];
  generatedAt?: string;
}

const DEFAULT_MARKETING_SUMMARY: MarketingAnalyticsSummary = {
  totalSpend: 0,
  totalImpressions: 0,
  totalClicks: 0,
  totalLeads: 0,
  qualifiedLeads: 0,
  convertedLeads: 0,
  clickThroughRate: 0,
  costPerClick: 0,
  costPerLead: 0,
  costPerQualifiedLead: 0,
  returnOnAdSpend: 0,
  revenueAttributed: 0,
};

const createMockMarketingAnalytics = (): MarketingAnalyticsData => {
  return {
    summary: {
      totalSpend: 2850000,
      totalImpressions: 2480000,
      totalClicks: 112400,
      totalLeads: 3240,
      qualifiedLeads: 1410,
      convertedLeads: 286,
      clickThroughRate: 4.53,
      costPerClick: 25.36,
      costPerLead: 879.63,
      costPerQualifiedLead: 2021.28,
      returnOnAdSpend: 4.18,
      revenueAttributed: 11913000,
    },
    trend: [
      {
        period: 'Jan',
        spend: 410000,
        impressions: 352000,
        clicks: 16400,
        leads: 442,
        qualifiedLeads: 184,
        conversions: 38,
        revenue: 1640000,
        ctr: 4.66,
        cpl: 927.6,
        roas: 4,
      },
      {
        period: 'Feb',
        spend: 438000,
        impressions: 381000,
        clicks: 17140,
        leads: 486,
        qualifiedLeads: 209,
        conversions: 42,
        revenue: 1765000,
        ctr: 4.5,
        cpl: 901.23,
        roas: 4.03,
      },
      {
        period: 'Mar',
        spend: 469000,
        impressions: 408000,
        clicks: 18120,
        leads: 518,
        qualifiedLeads: 231,
        conversions: 47,
        revenue: 1948000,
        ctr: 4.44,
        cpl: 905.41,
        roas: 4.15,
      },
      {
        period: 'Apr',
        spend: 495000,
        impressions: 425000,
        clicks: 19400,
        leads: 556,
        qualifiedLeads: 244,
        conversions: 51,
        revenue: 2126000,
        ctr: 4.56,
        cpl: 890.29,
        roas: 4.29,
      },
      {
        period: 'May',
        spend: 512000,
        impressions: 452000,
        clicks: 20560,
        leads: 598,
        qualifiedLeads: 267,
        conversions: 54,
        revenue: 2284000,
        ctr: 4.55,
        cpl: 856.19,
        roas: 4.46,
      },
      {
        period: 'Jun',
        spend: 526000,
        impressions: 462000,
        clicks: 20780,
        leads: 640,
        qualifiedLeads: 275,
        conversions: 54,
        revenue: 2360000,
        ctr: 4.5,
        cpl: 821.88,
        roas: 4.49,
      },
    ],
    channelPerformance: [
      {
        channelId: 'google',
        channelName: 'Google Ads',
        spend: 980000,
        impressions: 840000,
        clicks: 38400,
        leads: 1160,
        qualifiedLeads: 542,
        conversions: 114,
        revenue: 4780000,
        ctr: 4.57,
        cpc: 25.52,
        cpl: 844.83,
        roas: 4.88,
      },
      {
        channelId: 'facebook',
        channelName: 'Facebook Ads',
        spend: 760000,
        impressions: 920000,
        clicks: 42600,
        leads: 1010,
        qualifiedLeads: 408,
        conversions: 74,
        revenue: 2890000,
        ctr: 4.63,
        cpc: 17.84,
        cpl: 752.48,
        roas: 3.8,
      },
      {
        channelId: 'instagram',
        channelName: 'Instagram Ads',
        spend: 520000,
        impressions: 510000,
        clicks: 21200,
        leads: 586,
        qualifiedLeads: 224,
        conversions: 46,
        revenue: 1854000,
        ctr: 4.16,
        cpc: 24.53,
        cpl: 887.37,
        roas: 3.57,
      },
      {
        channelId: 'youtube',
        channelName: 'YouTube Campaign',
        spend: 590000,
        impressions: 210000,
        clicks: 10200,
        leads: 484,
        qualifiedLeads: 236,
        conversions: 52,
        revenue: 2389000,
        ctr: 4.86,
        cpc: 57.84,
        cpl: 1219.01,
        roas: 4.05,
      },
    ],
    campaignPerformance: [
      {
        campaignId: 'c1',
        campaignName: 'Luxury Villas Q2',
        channelName: 'Google Ads',
        spend: 420000,
        leads: 384,
        qualifiedLeads: 198,
        conversions: 42,
        revenue: 1980000,
        conversionRate: 10.94,
        roas: 4.71,
      },
      {
        campaignId: 'c2',
        campaignName: 'Apartment Launch Push',
        channelName: 'Facebook Ads',
        spend: 368000,
        leads: 432,
        qualifiedLeads: 165,
        conversions: 28,
        revenue: 1148000,
        conversionRate: 6.48,
        roas: 3.12,
      },
      {
        campaignId: 'c3',
        campaignName: 'NRI Property Intent',
        channelName: 'YouTube Campaign',
        spend: 298000,
        leads: 210,
        qualifiedLeads: 118,
        conversions: 29,
        revenue: 1384000,
        conversionRate: 13.81,
        roas: 4.64,
      },
      {
        campaignId: 'c4',
        campaignName: 'Weekend Site Visit Boost',
        channelName: 'Instagram Ads',
        spend: 246000,
        leads: 286,
        qualifiedLeads: 104,
        conversions: 18,
        revenue: 742000,
        conversionRate: 6.29,
        roas: 3.02,
      },
    ],
    sourceToRevenue: [
      {
        sourceId: 'organic-search',
        sourceName: 'Organic Search',
        leads: 420,
        conversions: 48,
        revenue: 1960000,
        averageDealValue: 40833.33,
      },
      {
        sourceId: 'paid-search',
        sourceName: 'Paid Search',
        leads: 1160,
        conversions: 114,
        revenue: 4780000,
        averageDealValue: 41929.82,
      },
      {
        sourceId: 'social',
        sourceName: 'Paid Social',
        leads: 1596,
        conversions: 120,
        revenue: 4744000,
        averageDealValue: 39533.33,
      },
      {
        sourceId: 'video',
        sourceName: 'Video Campaigns',
        leads: 484,
        conversions: 52,
        revenue: 2389000,
        averageDealValue: 45942.31,
      },
    ],
    geoPerformance: [
      {
        locationId: 'blr-east',
        locationName: 'Bangalore East',
        spend: 920000,
        leads: 1014,
        conversions: 96,
        revenue: 4280000,
        roas: 4.65,
      },
      {
        locationId: 'blr-south',
        locationName: 'Bangalore South',
        spend: 714000,
        leads: 760,
        conversions: 62,
        revenue: 2715000,
        roas: 3.8,
      },
      {
        locationId: 'blr-north',
        locationName: 'Bangalore North',
        spend: 646000,
        leads: 718,
        conversions: 58,
        revenue: 2528000,
        roas: 3.91,
      },
      {
        locationId: 'blr-west',
        locationName: 'Bangalore West',
        spend: 570000,
        leads: 548,
        conversions: 70,
        revenue: 2390000,
        roas: 4.19,
      },
    ],
    attribution: [
      {
        touchpoint: 'First Touch',
        attributedRevenue: 3280000,
        attributedConversions: 76,
        sharePercentage: 27.53,
      },
      {
        touchpoint: 'Lead Capture',
        attributedRevenue: 2410000,
        attributedConversions: 58,
        sharePercentage: 20.23,
      },
      {
        touchpoint: 'Retargeting',
        attributedRevenue: 2873000,
        attributedConversions: 69,
        sharePercentage: 24.12,
      },
      {
        touchpoint: 'Final Conversion Push',
        attributedRevenue: 3350000,
        attributedConversions: 83,
        sharePercentage: 28.12,
      },
    ],
    generatedAt: new Date().toISOString(),
  };
};

const normalizeSummary = (
  summary?: Partial<MarketingAnalyticsSummary>,
): MarketingAnalyticsSummary => {
  return {
    totalSpend: summary?.totalSpend ?? 0,
    totalImpressions: summary?.totalImpressions ?? 0,
    totalClicks: summary?.totalClicks ?? 0,
    totalLeads: summary?.totalLeads ?? 0,
    qualifiedLeads: summary?.qualifiedLeads ?? 0,
    convertedLeads: summary?.convertedLeads ?? 0,
    clickThroughRate: summary?.clickThroughRate ?? 0,
    costPerClick: summary?.costPerClick ?? 0,
    costPerLead: summary?.costPerLead ?? 0,
    costPerQualifiedLead: summary?.costPerQualifiedLead ?? 0,
    returnOnAdSpend: summary?.returnOnAdSpend ?? 0,
    revenueAttributed: summary?.revenueAttributed ?? 0,
  };
};

const normalizeTrend = (
  trend?: Partial<MarketingTrendPoint>[],
): MarketingTrendPoint[] => {
  if (!Array.isArray(trend)) {
    return [];
  }

  return trend.map((item, index) => ({
    period: item.period ?? `P${index + 1}`,
    spend: item.spend ?? 0,
    impressions: item.impressions ?? 0,
    clicks: item.clicks ?? 0,
    leads: item.leads ?? 0,
    qualifiedLeads: item.qualifiedLeads ?? 0,
    conversions: item.conversions ?? 0,
    revenue: item.revenue ?? 0,
    ctr: item.ctr ?? 0,
    cpl: item.cpl ?? 0,
    roas: item.roas ?? 0,
  }));
};

const normalizeChannelPerformance = (
  channelPerformance?: Partial<MarketingChannelPerformanceItem>[],
): MarketingChannelPerformanceItem[] => {
  if (!Array.isArray(channelPerformance)) {
    return [];
  }

  return channelPerformance.map((item, index) => ({
    channelId: item.channelId ?? `channel-${index + 1}`,
    channelName: item.channelName ?? `Channel ${index + 1}`,
    spend: item.spend ?? 0,
    impressions: item.impressions ?? 0,
    clicks: item.clicks ?? 0,
    leads: item.leads ?? 0,
    qualifiedLeads: item.qualifiedLeads ?? 0,
    conversions: item.conversions ?? 0,
    revenue: item.revenue ?? 0,
    ctr: item.ctr ?? 0,
    cpc: item.cpc ?? 0,
    cpl: item.cpl ?? 0,
    roas: item.roas ?? 0,
  }));
};

const normalizeCampaignPerformance = (
  campaignPerformance?: Partial<MarketingCampaignPerformanceItem>[],
): MarketingCampaignPerformanceItem[] => {
  if (!Array.isArray(campaignPerformance)) {
    return [];
  }

  return campaignPerformance.map((item, index) => ({
    campaignId: item.campaignId ?? `campaign-${index + 1}`,
    campaignName: item.campaignName ?? `Campaign ${index + 1}`,
    channelName: item.channelName ?? `Channel ${index + 1}`,
    spend: item.spend ?? 0,
    leads: item.leads ?? 0,
    qualifiedLeads: item.qualifiedLeads ?? 0,
    conversions: item.conversions ?? 0,
    revenue: item.revenue ?? 0,
    conversionRate: item.conversionRate ?? 0,
    roas: item.roas ?? 0,
  }));
};

const normalizeSourceToRevenue = (
  sourceToRevenue?: Partial<MarketingSourceToRevenueItem>[],
): MarketingSourceToRevenueItem[] => {
  if (!Array.isArray(sourceToRevenue)) {
    return [];
  }

  return sourceToRevenue.map((item, index) => ({
    sourceId: item.sourceId ?? `source-${index + 1}`,
    sourceName: item.sourceName ?? `Source ${index + 1}`,
    leads: item.leads ?? 0,
    conversions: item.conversions ?? 0,
    revenue: item.revenue ?? 0,
    averageDealValue: item.averageDealValue ?? 0,
  }));
};

const normalizeGeoPerformance = (
  geoPerformance?: Partial<MarketingGeoPerformanceItem>[],
): MarketingGeoPerformanceItem[] => {
  if (!Array.isArray(geoPerformance)) {
    return [];
  }

  return geoPerformance.map((item, index) => ({
    locationId: item.locationId ?? `location-${index + 1}`,
    locationName: item.locationName ?? `Location ${index + 1}`,
    spend: item.spend ?? 0,
    leads: item.leads ?? 0,
    conversions: item.conversions ?? 0,
    revenue: item.revenue ?? 0,
    roas: item.roas ?? 0,
  }));
};

const normalizeAttribution = (
  attribution?: Partial<MarketingAttributionItem>[],
): MarketingAttributionItem[] => {
  if (!Array.isArray(attribution)) {
    return [];
  }

  return attribution.map((item, index) => ({
    touchpoint: item.touchpoint ?? `Touchpoint ${index + 1}`,
    attributedRevenue: item.attributedRevenue ?? 0,
    attributedConversions: item.attributedConversions ?? 0,
    sharePercentage: item.sharePercentage ?? 0,
  }));
};

const normalizeMarketingAnalyticsResponse = (
  response: MarketingAnalyticsApiResponse | Partial<MarketingAnalyticsData>,
): MarketingAnalyticsData => {
  const nestedData =
    'data' in response && response.data ? response.data : response;

  return {
    summary: normalizeSummary(
      nestedData.summary ?? response.summary ?? DEFAULT_MARKETING_SUMMARY,
    ),
    trend: normalizeTrend(nestedData.trend ?? response.trend),
    channelPerformance: normalizeChannelPerformance(
      nestedData.channelPerformance ?? response.channelPerformance,
    ),
    campaignPerformance: normalizeCampaignPerformance(
      nestedData.campaignPerformance ?? response.campaignPerformance,
    ),
    sourceToRevenue: normalizeSourceToRevenue(
      nestedData.sourceToRevenue ?? response.sourceToRevenue,
    ),
    geoPerformance: normalizeGeoPerformance(
      nestedData.geoPerformance ?? response.geoPerformance,
    ),
    attribution: normalizeAttribution(
      nestedData.attribution ?? response.attribution,
    ),
    generatedAt: nestedData.generatedAt ?? response.generatedAt ?? new Date().toISOString(),
  };
};

export const useMarketingAnalytics = (
  options: UseMarketingAnalyticsOptions = {},
): UseMarketingAnalyticsReturn => {
  const {
    endpoint = '/api/analytics/marketing',
    initialFilters = {},
    initialComparePeriod = null,
    enabled = true,
    useMockOnError = false,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<MarketingAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<MarketingAnalyticsFilters>(initialFilters);
  const [comparePeriod, setComparePeriodState] =
    useState<MarketingComparePeriod | null>(initialComparePeriod);

  const setFilters = useCallback(
    (
      updater:
        | MarketingAnalyticsFilters
        | ((prev: MarketingAnalyticsFilters) => MarketingAnalyticsFilters),
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
        | MarketingComparePeriod
        | null
        | ((prev: MarketingComparePeriod | null) => MarketingComparePeriod | null),
    ) => {
      setComparePeriodState((prev) =>
        typeof updater === 'function' ? updater(prev) : updater,
      );
    },
    [],
  );

  const fetchMarketingAnalytics = useCallback(
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
          let message = `Failed to load marketing analytics. Status: ${response.status}`;

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
          (await response.json()) as MarketingAnalyticsApiResponse | Partial<MarketingAnalyticsData>;

        const normalized = normalizeMarketingAnalyticsResponse(json);

        setData(normalized);
        onSuccess?.(normalized);
      } catch (err) {
        const resolvedError =
          err instanceof Error ? err : new Error('Failed to load marketing analytics.');

        if (useMockOnError) {
          const mockData = createMockMarketingAnalytics();
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
    await fetchMarketingAnalytics(true);
  }, [fetchMarketingAnalytics]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsRefreshing(false);
    setFiltersState(initialFilters);
    setComparePeriodState(initialComparePeriod);
  }, [initialComparePeriod, initialFilters]);

  useEffect(() => {
    void fetchMarketingAnalytics(false);
  }, [fetchMarketingAnalytics]);

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

export default useMarketingAnalytics;