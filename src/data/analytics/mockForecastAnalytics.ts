// src/features/analytics/data/mockForecastAnalytics.ts

export type ForecastTrendDirection = 'up' | 'down' | 'neutral';
export type ForecastConfidenceLevel = 'high' | 'medium' | 'low';
export type ForecastDealRisk = 'low' | 'medium' | 'high';
export type ForecastPeriodKey =
  | 'thisMonth'
  | 'nextMonth'
  | 'thisQuarter'
  | 'nextQuarter'
  | 'thisYear';

export interface ForecastTrend {
  value: string;
  direction: ForecastTrendDirection;
  label: string;
}

export interface ForecastMetricCard {
  id: string;
  key: string;
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
  trend: ForecastTrend;
  target?: number;
  progress?: number;
  updatedAt: string;
  isHighlighted?: boolean;
}

export interface ForecastRevenuePoint {
  id: string;
  label: string;
  month: string;
  actualRevenue: number;
  forecastRevenue: number;
  pipelineRevenue: number;
  targetRevenue: number;
  closedDeals: number;
  projectedDeals: number;
}

export interface ForecastPipelineStage {
  id: string;
  stage: string;
  dealCount: number;
  pipelineValue: number;
  weightedValue: number;
  conversionRate: number;
  avgClosureDays: number;
  colorToken: string;
}

export interface ForecastTopDeal {
  id: string;
  leadName: string;
  projectName: string;
  location: string;
  stage: string;
  expectedCloseDate: string;
  dealValue: number;
  probability: number;
  weightedValue: number;
  ownerName: string;
  riskLevel: ForecastDealRisk;
}

export interface ForecastChannelContribution {
  id: string;
  channel: string;
  leads: number;
  deals: number;
  revenue: number;
  forecastRevenue: number;
  conversionRate: number;
}

export interface ForecastRegionalPerformance {
  id: string;
  region: string;
  actualRevenue: number;
  forecastRevenue: number;
  targetRevenue: number;
  growthRate: number;
  activeDeals: number;
}

export interface ForecastInsight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'warning' | 'critical' | 'neutral';
  recommendation: string;
}

export interface ForecastSummary {
  period: ForecastPeriodKey;
  forecastRevenue: number;
  actualRevenue: number;
  pipelineValue: number;
  weightedPipelineValue: number;
  targetRevenue: number;
  forecastAccuracy: number;
  confidenceLevel: ForecastConfidenceLevel;
  expectedClosures: number;
  overdueClosures: number;
}

export interface ForecastAnalyticsDataset {
  summary: ForecastSummary;
  metricCards: ForecastMetricCard[];
  revenueTrend: ForecastRevenuePoint[];
  pipelineStages: ForecastPipelineStage[];
  topDeals: ForecastTopDeal[];
  channelContribution: ForecastChannelContribution[];
  regionalPerformance: ForecastRegionalPerformance[];
  insights: ForecastInsight[];
}

export const forecastSummary: ForecastSummary = {
  period: 'thisQuarter',
  forecastRevenue: 46800000,
  actualRevenue: 32150000,
  pipelineValue: 89200000,
  weightedPipelineValue: 48140000,
  targetRevenue: 55000000,
  forecastAccuracy: 87.6,
  confidenceLevel: 'high',
  expectedClosures: 38,
  overdueClosures: 7,
};

export const forecastMetricCards: ForecastMetricCard[] = [
  {
    id: 'forecast-revenue',
    key: 'forecastRevenue',
    title: 'Forecast Revenue',
    value: '₹4.68Cr',
    rawValue: 46800000,
    description: 'Projected revenue expected from weighted open pipeline for the selected period.',
    icon: 'trending-up',
    colorScheme: 'primary',
    trend: {
      value: '+14.2%',
      direction: 'up',
      label: 'vs previous quarter forecast',
    },
    target: 55000000,
    progress: 85,
    updatedAt: '2026-04-17T09:00:00.000Z',
    isHighlighted: true,
  },
  {
    id: 'weighted-pipeline',
    key: 'weightedPipelineValue',
    title: 'Weighted Pipeline',
    value: '₹4.81Cr',
    rawValue: 48140000,
    description: 'Probability-adjusted pipeline value based on stage conversion chances.',
    icon: 'layers-3',
    colorScheme: 'info',
    trend: {
      value: '+9.8%',
      direction: 'up',
      label: 'vs last month',
    },
    target: 60000000,
    progress: 80,
    updatedAt: '2026-04-17T09:00:00.000Z',
  },
  {
    id: 'forecast-accuracy',
    key: 'forecastAccuracy',
    title: 'Forecast Accuracy',
    value: '87.6%',
    rawValue: 87.6,
    description: 'Accuracy of prior forecast compared with actual closed revenue.',
    icon: 'shield-check',
    colorScheme: 'success',
    trend: {
      value: '+3.1%',
      direction: 'up',
      label: 'better than last cycle',
    },
    target: 90,
    progress: 88,
    updatedAt: '2026-04-17T09:00:00.000Z',
    isHighlighted: true,
  },
  {
    id: 'expected-closures',
    key: 'expectedClosures',
    title: 'Expected Closures',
    value: '38',
    rawValue: 38,
    description: 'Deals likely to close within the current selected forecast period.',
    icon: 'briefcase-business',
    colorScheme: 'warning',
    trend: {
      value: '+6 deals',
      direction: 'up',
      label: 'pipeline strengthened',
    },
    target: 45,
    progress: 84,
    updatedAt: '2026-04-17T09:00:00.000Z',
  },
  {
    id: 'overdue-closures',
    key: 'overdueClosures',
    title: 'Overdue Closures',
    value: '7',
    rawValue: 7,
    description: 'Deals projected earlier but not yet closed and require immediate intervention.',
    icon: 'alert-octagon',
    colorScheme: 'danger',
    trend: {
      value: '+2',
      direction: 'up',
      label: 'risk increased this week',
    },
    target: 0,
    progress: 35,
    updatedAt: '2026-04-17T09:00:00.000Z',
    isHighlighted: true,
  },
  {
    id: 'pipeline-total',
    key: 'pipelineValue',
    title: 'Open Pipeline Value',
    value: '₹8.92Cr',
    rawValue: 89200000,
    description: 'Total raw value of open opportunities across all active stages.',
    icon: 'database',
    colorScheme: 'neutral',
    trend: {
      value: '+11.5%',
      direction: 'up',
      label: 'vs last 30 days',
    },
    target: 100000000,
    progress: 89,
    updatedAt: '2026-04-17T09:00:00.000Z',
  },
];

export const mockForecastRevenueTrend: ForecastRevenuePoint[] = [
  {
    id: 'jan-2026',
    label: 'Jan',
    month: '2026-01',
    actualRevenue: 8200000,
    forecastRevenue: 7900000,
    pipelineRevenue: 13100000,
    targetRevenue: 9000000,
    closedDeals: 7,
    projectedDeals: 8,
  },
  {
    id: 'feb-2026',
    label: 'Feb',
    month: '2026-02',
    actualRevenue: 9650000,
    forecastRevenue: 9100000,
    pipelineRevenue: 14500000,
    targetRevenue: 10000000,
    closedDeals: 9,
    projectedDeals: 9,
  },
  {
    id: 'mar-2026',
    label: 'Mar',
    month: '2026-03',
    actualRevenue: 14300000,
    forecastRevenue: 13800000,
    pipelineRevenue: 18800000,
    targetRevenue: 15000000,
    closedDeals: 12,
    projectedDeals: 11,
  },
  {
    id: 'apr-2026',
    label: 'Apr',
    month: '2026-04',
    actualRevenue: 0,
    forecastRevenue: 15200000,
    pipelineRevenue: 20600000,
    targetRevenue: 16000000,
    closedDeals: 0,
    projectedDeals: 10,
  },
  {
    id: 'may-2026',
    label: 'May',
    month: '2026-05',
    actualRevenue: 0,
    forecastRevenue: 16400000,
    pipelineRevenue: 22400000,
    targetRevenue: 17000000,
    closedDeals: 0,
    projectedDeals: 11,
  },
  {
    id: 'jun-2026',
    label: 'Jun',
    month: '2026-06',
    actualRevenue: 0,
    forecastRevenue: 15200000,
    pipelineRevenue: 20800000,
    targetRevenue: 16000000,
    closedDeals: 0,
    projectedDeals: 10,
  },
];

export const mockForecastPipelineStages: ForecastPipelineStage[] = [
  {
    id: 'pipeline-new',
    stage: 'New Inquiry',
    dealCount: 58,
    pipelineValue: 12600000,
    weightedValue: 1890000,
    conversionRate: 15,
    avgClosureDays: 45,
    colorToken: 'chart-blue',
  },
  {
    id: 'pipeline-qualified',
    stage: 'Qualified',
    dealCount: 42,
    pipelineValue: 17800000,
    weightedValue: 6230000,
    conversionRate: 35,
    avgClosureDays: 32,
    colorToken: 'chart-cyan',
  },
  {
    id: 'pipeline-site-visit',
    stage: 'Site Visit',
    dealCount: 27,
    pipelineValue: 22400000,
    weightedValue: 12320000,
    conversionRate: 55,
    avgClosureDays: 21,
    colorToken: 'chart-amber',
  },
  {
    id: 'pipeline-negotiation',
    stage: 'Negotiation',
    dealCount: 14,
    pipelineValue: 19800000,
    weightedValue: 14850000,
    conversionRate: 75,
    avgClosureDays: 14,
    colorToken: 'chart-green',
  },
  {
    id: 'pipeline-documentation',
    stage: 'Documentation',
    dealCount: 8,
    pipelineValue: 16600000,
    weightedValue: 15770000,
    conversionRate: 95,
    avgClosureDays: 7,
    colorToken: 'chart-purple',
  },
];

export const mockForecastTopDeals: ForecastTopDeal[] = [
  {
    id: 'deal-001',
    leadName: 'Arun Kumar',
    projectName: 'Prestige Lakeside Habitat',
    location: 'Whitefield',
    stage: 'Negotiation',
    expectedCloseDate: '2026-04-24',
    dealValue: 18500000,
    probability: 80,
    weightedValue: 14800000,
    ownerName: 'Ravi Shankar',
    riskLevel: 'low',
  },
  {
    id: 'deal-002',
    leadName: 'Meena Raj',
    projectName: 'Brigade Cornerstone Utopia',
    location: 'Varthur Road',
    stage: 'Documentation',
    expectedCloseDate: '2026-04-21',
    dealValue: 13200000,
    probability: 95,
    weightedValue: 12540000,
    ownerName: 'Divya Narayan',
    riskLevel: 'low',
  },
  {
    id: 'deal-003',
    leadName: 'Sathish Babu',
    projectName: 'Sobha Dream Acres',
    location: 'Balagere',
    stage: 'Site Visit',
    expectedCloseDate: '2026-04-29',
    dealValue: 9800000,
    probability: 55,
    weightedValue: 5390000,
    ownerName: 'Karthik R',
    riskLevel: 'medium',
  },
  {
    id: 'deal-004',
    leadName: 'Nisha Patel',
    projectName: 'Godrej Woodland',
    location: 'Sarjapur',
    stage: 'Qualified',
    expectedCloseDate: '2026-05-05',
    dealValue: 11600000,
    probability: 35,
    weightedValue: 4060000,
    ownerName: 'Asha Menon',
    riskLevel: 'medium',
  },
  {
    id: 'deal-005',
    leadName: 'Farooq Ali',
    projectName: 'Assetz Marq',
    location: 'Whitefield',
    stage: 'Negotiation',
    expectedCloseDate: '2026-04-26',
    dealValue: 15400000,
    probability: 78,
    weightedValue: 12012000,
    ownerName: 'Vignesh Kumar',
    riskLevel: 'high',
  },
];

export const mockForecastChannelContribution: ForecastChannelContribution[] = [
  {
    id: 'channel-meta-ads',
    channel: 'Meta Ads',
    leads: 182,
    deals: 11,
    revenue: 12600000,
    forecastRevenue: 14800000,
    conversionRate: 6.04,
  },
  {
    id: 'channel-google-ads',
    channel: 'Google Ads',
    leads: 134,
    deals: 10,
    revenue: 11800000,
    forecastRevenue: 13600000,
    conversionRate: 7.46,
  },
  {
    id: 'channel-broker-network',
    channel: 'Broker Network',
    leads: 96,
    deals: 13,
    revenue: 17200000,
    forecastRevenue: 18500000,
    conversionRate: 13.54,
  },
  {
    id: 'channel-referrals',
    channel: 'Referrals',
    leads: 68,
    deals: 9,
    revenue: 10400000,
    forecastRevenue: 11200000,
    conversionRate: 13.24,
  },
  {
    id: 'channel-direct-walkins',
    channel: 'Direct Walk-ins',
    leads: 52,
    deals: 5,
    revenue: 6400000,
    forecastRevenue: 7600000,
    conversionRate: 9.62,
  },
];

export const mockForecastRegionalPerformance: ForecastRegionalPerformance[] = [
  {
    id: 'region-east-bangalore',
    region: 'East Bangalore',
    actualRevenue: 15600000,
    forecastRevenue: 21400000,
    targetRevenue: 23000000,
    growthRate: 17.4,
    activeDeals: 31,
  },
  {
    id: 'region-sarjapur-belt',
    region: 'Sarjapur Belt',
    actualRevenue: 9200000,
    forecastRevenue: 13800000,
    targetRevenue: 15000000,
    growthRate: 22.8,
    activeDeals: 22,
  },
  {
    id: 'region-north-bangalore',
    region: 'North Bangalore',
    actualRevenue: 5300000,
    forecastRevenue: 8700000,
    targetRevenue: 10000000,
    growthRate: 12.6,
    activeDeals: 16,
  },
  {
    id: 'region-south-bangalore',
    region: 'South Bangalore',
    actualRevenue: 2050000,
    forecastRevenue: 4900000,
    targetRevenue: 7000000,
    growthRate: -3.4,
    activeDeals: 9,
  },
];

export const mockForecastInsights: ForecastInsight[] = [
  {
    id: 'insight-001',
    title: 'Negotiation-stage deals are carrying the quarter',
    description:
      'A major portion of the forecast depends on a small set of high-value negotiation deals, which increases concentration risk.',
    impact: 'warning',
    recommendation:
      'Assign senior closers to top 5 negotiation deals and review blocker notes daily.',
  },
  {
    id: 'insight-002',
    title: 'Broker channel is outperforming paid acquisition',
    description:
      'Broker Network has the highest conversion efficiency and strongest forecast contribution per lead.',
    impact: 'positive',
    recommendation:
      'Increase broker engagement incentives and replicate high-performing broker workflows.',
  },
  {
    id: 'insight-003',
    title: 'South Bangalore region is lagging target pace',
    description:
      'Pipeline build-up is weak and projected revenue is significantly below target for the current period.',
    impact: 'critical',
    recommendation:
      'Launch focused local campaigns and move one senior closer to the region for 2 weeks.',
  },
  {
    id: 'insight-004',
    title: 'Forecast accuracy remains strong',
    description:
      'Previous cycle estimates aligned well with actual closures, indicating stable stage probability assumptions.',
    impact: 'positive',
    recommendation:
      'Continue current weighting model, but re-evaluate probabilities for early-stage deals monthly.',
  },
];

export const mockForecastAnalytics: ForecastAnalyticsDataset = {
  summary: forecastSummary,
  metricCards: forecastMetricCards,
  revenueTrend: mockForecastRevenueTrend,
  pipelineStages: mockForecastPipelineStages,
  topDeals: mockForecastTopDeals,
  channelContribution: mockForecastChannelContribution,
  regionalPerformance: mockForecastRegionalPerformance,
  insights: mockForecastInsights,
};

export const forecastMetricMap = forecastMetricCards.reduce<
  Record<string, ForecastMetricCard>
>((acc, item) => {
  acc[item.key] = item;
  return acc;
}, {});

export const getForecastMetricByKey = (
  key: ForecastMetricCard['key'],
): ForecastMetricCard | undefined => {
  return forecastMetricMap[key];
};

export const highlightedForecastMetrics = forecastMetricCards.filter(
  (item) => item.isHighlighted,
);

export default mockForecastAnalytics;