// src/hooks/analytics/useAnalyticsDashboard.ts

import { useCallback, useEffect, useMemo, useState } from 'react';

export type TrendDirection = 'up' | 'down' | 'neutral';

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

export interface DashboardMetricCard {
  id: string;
  title: string;
  value: string;
  rawValue: number;
  description: string;
  icon: string;
  colorScheme:
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral';
  trend: {
    value: string;
    direction: TrendDirection;
    label: string;
  };
  sourceSection: AnalyticsPrimarySection;
  updatedAt: string;
  isHighlighted?: boolean;
  target?: number;
  progress?: number;
}

export interface DashboardInsightItem {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'warning' | 'critical' | 'neutral';
  recommendation: string;
  sourceSection: AnalyticsPrimarySection;
}

export interface DashboardQuickStat {
  id: string;
  label: string;
  value: string;
  rawValue: number;
  direction: TrendDirection;
  sourceSection: AnalyticsPrimarySection;
}

export interface DashboardSectionVisibility {
  overview: boolean;
  pipeline: boolean;
  revenue: boolean;
  team: boolean;
  leads: boolean;
  marketing: boolean;
  forecast: boolean;
  risk: boolean;
  geography: boolean;
}

export interface AnalyticsSectionData {
  metricCards: DashboardMetricCard[];
  insights: DashboardInsightItem[];
  summary: Record<string, number>;
  regionPerformance?: Array<{ region: string; value: number }>;
  ownerPerformance?: Array<{ ownerName: string; value: number }>;
  sourcePerformance?: Array<{ source: string; value: number }>;
}

export interface AnalyticsDashboardData {
  pipeline: AnalyticsSectionData;
  revenue: AnalyticsSectionData;
  team: AnalyticsSectionData;
  leads: AnalyticsSectionData;
  marketing: AnalyticsSectionData;
  forecast: AnalyticsSectionData;
  risk: AnalyticsSectionData;
  geography: AnalyticsSectionData;
}

export interface UseAnalyticsDashboardReturn {
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdatedAt: string;
  filters: AnalyticsFilterState;
  visibleSections: DashboardSectionVisibility;
  data: AnalyticsDashboardData;
  topMetricCards: DashboardMetricCard[];
  highlightedMetricCards: DashboardMetricCard[];
  quickStats: DashboardQuickStat[];
  combinedInsights: DashboardInsightItem[];
  regionOptions: string[];
  ownerOptions: string[];
  sourceOptions: string[];
  hasActiveFilters: boolean;
  setPrimarySection: (section: AnalyticsPrimarySection) => void;
  setDateRange: (dateRange: AnalyticsDateRange) => void;
  setSelectedRegion: (region: string | null) => void;
  setSelectedOwner: (owner: string | null) => void;
  setSelectedSource: (source: string | null) => void;
  setSearch: (value: string) => void;
  toggleComparePreviousPeriod: () => void;
  resetFilters: () => void;
  refreshDashboard: () => Promise<void>;
}

const nowIso = (): string => new Date().toISOString();

const DEFAULT_DATE_RANGE: AnalyticsDateRange = {
  key: 'last30Days',
  label: 'Last 30 Days',
  startDate: null,
  endDate: null,
};

const DEFAULT_FILTERS: AnalyticsFilterState = {
  primarySection: 'overview',
  dateRange: DEFAULT_DATE_RANGE,
  selectedRegion: null,
  selectedOwner: null,
  selectedSource: null,
  comparePreviousPeriod: true,
  search: '',
};

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const buildMetric = (
  id: string,
  title: string,
  value: string,
  rawValue: number,
  description: string,
  direction: TrendDirection,
  trendValue: string,
  sourceSection: AnalyticsPrimarySection,
  colorScheme: DashboardMetricCard['colorScheme'],
  isHighlighted = false,
  icon = 'bar-chart-3',
  target?: number,
  progress?: number,
): DashboardMetricCard => ({
  id,
  title,
  value,
  rawValue,
  description,
  icon,
  colorScheme,
  trend: {
    value: trendValue,
    direction,
    label: 'vs previous period',
  },
  sourceSection,
  updatedAt: nowIso(),
  isHighlighted,
  target,
  progress,
});

const buildInsight = (
  id: string,
  title: string,
  description: string,
  impact: DashboardInsightItem['impact'],
  recommendation: string,
  sourceSection: AnalyticsPrimarySection,
): DashboardInsightItem => ({
  id,
  title,
  description,
  impact,
  recommendation,
  sourceSection,
});

const mockDashboardData: AnalyticsDashboardData = {
  pipeline: {
    metricCards: [
      buildMetric(
        'pipeline-open-deals',
        'Open Deals',
        '128',
        128,
        'Currently active opportunities in pipeline',
        'up',
        '+12.4%',
        'pipeline',
        'primary',
        true,
        'briefcase',
        150,
        85,
      ),
      buildMetric(
        'pipeline-conversion',
        'Stage Conversion',
        '34%',
        34,
        'Lead-to-qualified conversion rate',
        'up',
        '+4.8%',
        'pipeline',
        'success',
        false,
        'git-branch',
        40,
        85,
      ),
    ],
    insights: [
      buildInsight(
        'pipeline-insight-1',
        'Mid-funnel momentum improved',
        'Qualified opportunities are moving faster than last period.',
        'positive',
        'Prioritize proposal-stage follow-ups for faster closures.',
        'pipeline',
      ),
    ],
    summary: {
      totalOpenDeals: 128,
      openDeals: 128,
      activeDeals: 128,
    },
    regionPerformance: [
      { region: 'Bangalore', value: 52 },
      { region: 'Chennai', value: 31 },
      { region: 'Hyderabad', value: 45 },
    ],
    ownerPerformance: [
      { ownerName: 'Arun', value: 22 },
      { ownerName: 'Karthik', value: 18 },
    ],
    sourcePerformance: [
      { source: 'Referral', value: 44 },
      { source: 'Website', value: 37 },
    ],
  },

  revenue: {
    metricCards: [
      buildMetric(
        'revenue-total',
        'Revenue',
        '₹72.4L',
        7240000,
        'Revenue generated in selected period',
        'up',
        '+9.2%',
        'revenue',
        'success',
        true,
        'indian-rupee',
        8000000,
        91,
      ),
      buildMetric(
        'revenue-average-deal',
        'Avg Deal Size',
        '₹5.8L',
        580000,
        'Average deal value across won opportunities',
        'up',
        '+3.6%',
        'revenue',
        'info',
        false,
        'wallet',
      ),
    ],
    insights: [
      buildInsight(
        'revenue-insight-1',
        'Revenue quality is healthy',
        'Higher-value deals are contributing more than smaller ticket deals.',
        'positive',
        'Double down on premium inventory and high-intent buyer segments.',
        'revenue',
      ),
    ],
    summary: {
      totalRevenue: 7240000,
      revenueGenerated: 7240000,
    },
    regionPerformance: [
      { region: 'Bangalore', value: 2800000 },
      { region: 'Chennai', value: 1900000 },
    ],
    ownerPerformance: [
      { ownerName: 'Arun', value: 2400000 },
      { ownerName: 'Meena', value: 1800000 },
    ],
    sourcePerformance: [
      { source: 'Website', value: 2600000 },
      { source: 'Referral', value: 2100000 },
    ],
  },

  team: {
    metricCards: [
      buildMetric(
        'team-productivity',
        'Team Productivity',
        '87',
        87,
        'Average productivity score across sales team',
        'up',
        '+6.1%',
        'team',
        'info',
        true,
        'users',
        100,
        87,
      ),
      buildMetric(
        'team-response',
        'Response Time',
        '14m',
        14,
        'Average first response time',
        'down',
        '-8.3%',
        'team',
        'success',
        false,
        'timer',
      ),
    ],
    insights: [
      buildInsight(
        'team-insight-1',
        'Response discipline is improving',
        'Faster first-touch actions are lifting engagement quality.',
        'positive',
        'Keep SLA reminders enabled for top-priority leads.',
        'team',
      ),
    ],
    summary: {
      avgProductivityScore: 87,
      productivityScore: 87,
    },
    regionPerformance: [
      { region: 'Bangalore', value: 89 },
      { region: 'Chennai', value: 84 },
    ],
    ownerPerformance: [
      { ownerName: 'Ravi', value: 91 },
      { ownerName: 'Priya', value: 86 },
    ],
  },

  leads: {
    metricCards: [
      buildMetric(
        'leads-total',
        'Total Leads',
        '1,246',
        1246,
        'All leads captured in selected range',
        'up',
        '+15.7%',
        'leads',
        'primary',
        true,
        'contact',
        1500,
        83,
      ),
      buildMetric(
        'leads-qualified',
        'Qualified Leads',
        '386',
        386,
        'Leads moved to qualified stage',
        'up',
        '+10.4%',
        'leads',
        'success',
        false,
        'badge-check',
      ),
    ],
    insights: [
      buildInsight(
        'leads-insight-1',
        'Lead intake is strong',
        'Organic and referral channels are delivering steady lead quality.',
        'positive',
        'Route high-intent leads to senior closers immediately.',
        'leads',
      ),
    ],
    summary: {
      totalLeads: 1246,
      leadCount: 1246,
      leadsHandled: 1246,
    },
    regionPerformance: [
      { region: 'Bangalore', value: 420 },
      { region: 'Chennai', value: 310 },
    ],
    ownerPerformance: [
      { ownerName: 'Arun', value: 140 },
      { ownerName: 'Priya', value: 126 },
    ],
    sourcePerformance: [
      { source: 'Meta Ads', value: 310 },
      { source: 'Referral', value: 280 },
      { source: 'Website', value: 350 },
    ],
  },

  marketing: {
    metricCards: [
      buildMetric(
        'marketing-roas',
        'ROAS',
        '4.8x',
        4.8,
        'Return on ad spend across active campaigns',
        'up',
        '+11.2%',
        'marketing',
        'success',
        true,
        'megaphone',
      ),
      buildMetric(
        'marketing-cpl',
        'Cost per Lead',
        '₹420',
        420,
        'Average acquisition cost per lead',
        'down',
        '-7.6%',
        'marketing',
        'warning',
        false,
        'coins',
      ),
    ],
    insights: [
      buildInsight(
        'marketing-insight-1',
        'Campaign efficiency is rising',
        'Better audience targeting reduced CPL without hurting volume.',
        'positive',
        'Scale best-performing audience clusters gradually.',
        'marketing',
      ),
    ],
    summary: {
      returnOnAdSpend: 4.8,
      roas: 4.8,
    },
    sourcePerformance: [
      { source: 'Meta Ads', value: 4.9 },
      { source: 'Google Ads', value: 4.3 },
      { source: 'Referral', value: 6.2 },
    ],
  },

  forecast: {
    metricCards: [
      buildMetric(
        'forecast-confidence',
        'Forecast Confidence',
        '81%',
        81,
        'Confidence score for projected performance',
        'up',
        '+5.0%',
        'forecast',
        'info',
        true,
        'line-chart',
        100,
        81,
      ),
      buildMetric(
        'forecast-projection',
        'Projected Revenue',
        '₹95L',
        9500000,
        'Expected revenue by end of cycle',
        'up',
        '+8.9%',
        'forecast',
        'primary',
        false,
        'activity',
      ),
    ],
    insights: [
      buildInsight(
        'forecast-insight-1',
        'Projection remains stable',
        'Pipeline strength supports a healthy near-term forecast.',
        'neutral',
        'Protect closing velocity in late stages to maintain confidence.',
        'forecast',
      ),
    ],
    summary: {
      forecastConfidenceScore: 81,
      confidenceScore: 81,
    },
  },

  risk: {
    metricCards: [
      buildMetric(
        'risk-score',
        'Risk Score',
        '24',
        24,
        'Overall operational risk score',
        'down',
        '-3.1%',
        'risk',
        'warning',
        true,
        'shield-alert',
      ),
    ],
    insights: [
      buildInsight(
        'risk-insight-1',
        'Deal slippage risk is moderate',
        'Some proposals are ageing beyond ideal response windows.',
        'warning',
        'Push re-engagement workflows for stale mid-stage deals.',
        'risk',
      ),
    ],
    summary: {
      overallRiskScore: 24,
    },
  },

  geography: {
    metricCards: [
      buildMetric(
        'geo-health',
        'Geo Health',
        '78',
        78,
        'Average regional market health score',
        'up',
        '+2.7%',
        'geography',
        'info',
        true,
        'map-pinned',
      ),
    ],
    insights: [
      buildInsight(
        'geo-insight-1',
        'Bangalore remains strongest',
        'Conversion and revenue density are highest in Bangalore region.',
        'positive',
        'Allocate top inventory visibility to Bangalore and nearby belts.',
        'geography',
      ),
    ],
    summary: {
      avgMarketHealthScore: 78,
    },
    regionPerformance: [
      { region: 'Bangalore', value: 78 },
      { region: 'Chennai', value: 71 },
      { region: 'Hyderabad', value: 74 },
    ],
  },
};

const allSections = (
  data: AnalyticsDashboardData,
): Array<AnalyticsSectionData & { section: AnalyticsPrimarySection }> => [
  { section: 'pipeline', ...data.pipeline },
  { section: 'revenue', ...data.revenue },
  { section: 'team', ...data.team },
  { section: 'leads', ...data.leads },
  { section: 'marketing', ...data.marketing },
  { section: 'forecast', ...data.forecast },
  { section: 'risk', ...data.risk },
  { section: 'geography', ...data.geography },
];

const getVisibility = (
  section: AnalyticsPrimarySection,
): DashboardSectionVisibility => {
  if (section === 'overview') {
    return {
      overview: true,
      pipeline: true,
      revenue: true,
      team: true,
      leads: true,
      marketing: true,
      forecast: true,
      risk: true,
      geography: true,
    };
  }

  return {
    overview: false,
    pipeline: section === 'pipeline',
    revenue: section === 'revenue',
    team: section === 'team',
    leads: section === 'leads',
    marketing: section === 'marketing',
    forecast: section === 'forecast',
    risk: section === 'risk',
    geography: section === 'geography',
  };
};

const matchesQuery = (text: string, query: string): boolean =>
  text.toLowerCase().includes(query.toLowerCase());

export const useAnalyticsDashboard = (): UseAnalyticsDashboardReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>(nowIso());
  const [filters, setFilters] = useState<AnalyticsFilterState>(DEFAULT_FILTERS);
  const [data] = useState<AnalyticsDashboardData>(mockDashboardData);

  useEffect(() => {
    let isMounted = true;

    const initialize = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        await wait(300);

        if (!isMounted) return;

        setLastUpdatedAt(nowIso());
      } catch (err) {
        if (!isMounted) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to initialize analytics dashboard.',
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleSections = useMemo<DashboardSectionVisibility>(() => {
    return getVisibility(filters.primarySection);
  }, [filters.primarySection]);

  const sectionEntries = useMemo(() => allSections(data), [data]);

  const regionOptions = useMemo<string[]>(() => {
    return Array.from(
      new Set(
        sectionEntries.flatMap((entry) =>
          (entry.regionPerformance ?? []).map((item) => item.region),
        ),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [sectionEntries]);

  const ownerOptions = useMemo<string[]>(() => {
    return Array.from(
      new Set(
        sectionEntries.flatMap((entry) =>
          (entry.ownerPerformance ?? []).map((item) => item.ownerName),
        ),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [sectionEntries]);

  const sourceOptions = useMemo<string[]>(() => {
    return Array.from(
      new Set(
        sectionEntries.flatMap((entry) =>
          (entry.sourcePerformance ?? []).map((item) => item.source),
        ),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [sectionEntries]);

  const allMetricCards = useMemo<DashboardMetricCard[]>(() => {
    return sectionEntries.flatMap((entry) => entry.metricCards);
  }, [sectionEntries]);

  const allInsights = useMemo<DashboardInsightItem[]>(() => {
    return sectionEntries.flatMap((entry) => entry.insights);
  }, [sectionEntries]);

  const filteredMetricCards = useMemo<DashboardMetricCard[]>(() => {
    const query = filters.search.trim().toLowerCase();

    return allMetricCards.filter((card) => {
      if (
        filters.primarySection !== 'overview' &&
        card.sourceSection !== filters.primarySection
      ) {
        return false;
      }

      if (filters.selectedRegion) {
        const hasRegion = sectionEntries.some(
          (entry) =>
            entry.section === card.sourceSection &&
            (entry.regionPerformance ?? []).some(
              (item) => item.region === filters.selectedRegion,
            ),
        );

        if (!hasRegion) return false;
      }

      if (filters.selectedOwner) {
        const hasOwner = sectionEntries.some(
          (entry) =>
            entry.section === card.sourceSection &&
            (entry.ownerPerformance ?? []).some(
              (item) => item.ownerName === filters.selectedOwner,
            ),
        );

        if (!hasOwner) return false;
      }

      if (filters.selectedSource) {
        const hasSource = sectionEntries.some(
          (entry) =>
            entry.section === card.sourceSection &&
            (entry.sourcePerformance ?? []).some(
              (item) => item.source === filters.selectedSource,
            ),
        );

        if (!hasSource) return false;
      }

      if (!query) return true;

      return (
        matchesQuery(card.title, query) ||
        matchesQuery(card.description, query) ||
        matchesQuery(card.value, query) ||
        matchesQuery(card.sourceSection, query)
      );
    });
  }, [
    allMetricCards,
    filters.primarySection,
    filters.search,
    filters.selectedOwner,
    filters.selectedRegion,
    filters.selectedSource,
    sectionEntries,
  ]);

  const highlightedMetricCards = useMemo<DashboardMetricCard[]>(() => {
    return filteredMetricCards.filter((card) => card.isHighlighted).slice(0, 8);
  }, [filteredMetricCards]);

  const topMetricCards = useMemo<DashboardMetricCard[]>(() => {
    if (filters.primarySection === 'overview') {
      const highlighted = filteredMetricCards.filter((card) => card.isHighlighted);
      return (highlighted.length > 0 ? highlighted : filteredMetricCards).slice(0, 6);
    }

    return filteredMetricCards.slice(0, 6);
  }, [filteredMetricCards, filters.primarySection]);

  const combinedInsights = useMemo<DashboardInsightItem[]>(() => {
    const query = filters.search.trim().toLowerCase();

    return allInsights
      .filter((insight) => {
        if (
          filters.primarySection !== 'overview' &&
          insight.sourceSection !== filters.primarySection
        ) {
          return false;
        }

        if (!query) return true;

        return (
          matchesQuery(insight.title, query) ||
          matchesQuery(insight.description, query) ||
          matchesQuery(insight.recommendation, query) ||
          matchesQuery(insight.sourceSection, query)
        );
      })
      .slice(0, 12);
  }, [allInsights, filters.primarySection, filters.search]);

  const quickStats = useMemo<DashboardQuickStat[]>(() => {
    const stats: DashboardQuickStat[] = [
      {
        id: 'quick-open-deals',
        label: 'Open Deals',
        value: String(data.pipeline.summary.totalOpenDeals ?? 0),
        rawValue: data.pipeline.summary.totalOpenDeals ?? 0,
        direction: 'up',
        sourceSection: 'pipeline',
      },
      {
        id: 'quick-revenue',
        label: 'Revenue',
        value: '₹72.4L',
        rawValue: data.revenue.summary.totalRevenue ?? 0,
        direction: 'up',
        sourceSection: 'revenue',
      },
      {
        id: 'quick-team-productivity',
        label: 'Team Productivity',
        value: String(data.team.summary.avgProductivityScore ?? 0),
        rawValue: data.team.summary.avgProductivityScore ?? 0,
        direction: 'up',
        sourceSection: 'team',
      },
      {
        id: 'quick-total-leads',
        label: 'Leads',
        value: String(data.leads.summary.totalLeads ?? 0),
        rawValue: data.leads.summary.totalLeads ?? 0,
        direction: 'up',
        sourceSection: 'leads',
      },
      {
        id: 'quick-roas',
        label: 'ROAS',
        value: `${data.marketing.summary.returnOnAdSpend ?? 0}x`,
        rawValue: data.marketing.summary.returnOnAdSpend ?? 0,
        direction: 'up',
        sourceSection: 'marketing',
      },
      {
        id: 'quick-forecast-confidence',
        label: 'Forecast Confidence',
        value: `${data.forecast.summary.forecastConfidenceScore ?? 0}%`,
        rawValue: data.forecast.summary.forecastConfidenceScore ?? 0,
        direction: 'up',
        sourceSection: 'forecast',
      },
      {
        id: 'quick-risk-score',
        label: 'Risk Score',
        value: String(data.risk.summary.overallRiskScore ?? 0),
        rawValue: data.risk.summary.overallRiskScore ?? 0,
        direction: 'down',
        sourceSection: 'risk',
      },
      {
        id: 'quick-geo-health',
        label: 'Geo Health',
        value: String(data.geography.summary.avgMarketHealthScore ?? 0),
        rawValue: data.geography.summary.avgMarketHealthScore ?? 0,
        direction: 'up',
        sourceSection: 'geography',
      },
    ];

    if (filters.primarySection === 'overview') {
      return stats;
    }

    return stats.filter((item) => item.sourceSection === filters.primarySection);
  }, [data, filters.primarySection]);

  const hasActiveFilters = useMemo<boolean>(() => {
    return (
      filters.primarySection !== DEFAULT_FILTERS.primarySection ||
      filters.dateRange.key !== DEFAULT_FILTERS.dateRange.key ||
      filters.selectedRegion !== null ||
      filters.selectedOwner !== null ||
      filters.selectedSource !== null ||
      filters.comparePreviousPeriod !== DEFAULT_FILTERS.comparePreviousPeriod ||
      filters.search.trim().length > 0
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

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const refreshDashboard = useCallback(async (): Promise<void> => {
    try {
      setIsRefreshing(true);
      setError(null);
      await wait(450);
      setLastUpdatedAt(nowIso());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to refresh analytics dashboard.',
      );
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return {
    isLoading,
    isRefreshing,
    error,
    lastUpdatedAt,
    filters,
    visibleSections,
    data,
    topMetricCards,
    highlightedMetricCards,
    quickStats,
    combinedInsights,
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
    resetFilters,
    refreshDashboard,
  };
};