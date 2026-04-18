// src/features/analytics/data/mockMarketingAnalytics.ts

export type MarketingTrendDirection = 'up' | 'down' | 'neutral';
export type MarketingCampaignStatus =
  | 'active'
  | 'paused'
  | 'completed'
  | 'draft';
export type MarketingChannelType =
  | 'Meta Ads'
  | 'Google Ads'
  | 'WhatsApp Campaign'
  | 'SMS Campaign'
  | 'Email Campaign'
  | 'Property Portal'
  | 'Broker Activation'
  | 'Referral Program';
export type MarketingPriorityLevel = 'high' | 'medium' | 'low';

export interface MarketingTrend {
  value: string;
  direction: MarketingTrendDirection;
  label: string;
}

export interface MarketingAnalyticsSummary {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalLeads: number;
  qualifiedLeads: number;
  dealsClosed: number;
  revenueGenerated: number;
  avgCostPerLead: number;
  avgClickThroughRate: number;
  avgConversionRate: number;
  overallRoi: number;
}

export interface MarketingMetricCard {
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
  trend: MarketingTrend;
  updatedAt: string;
  target?: number;
  progress?: number;
  isHighlighted?: boolean;
}

export interface MarketingChannelPerformance {
  id: string;
  channel: MarketingChannelType;
  impressions: number;
  clicks: number;
  leads: number;
  qualifiedLeads: number;
  dealsClosed: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpl: number;
  costPerQualifiedLead: number;
  conversionRate: number;
  roi: number;
}

export interface MarketingCampaignPerformance {
  id: string;
  campaignName: string;
  channel: MarketingChannelType;
  status: MarketingCampaignStatus;
  startDate: string;
  endDate: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  qualifiedLeads: number;
  dealsClosed: number;
  revenue: number;
  ctr: number;
  cpl: number;
  conversionRate: number;
  roi: number;
}

export interface MarketingFunnelPoint {
  id: string;
  stage: string;
  count: number;
  percentage: number;
  dropOffRate: number;
  colorToken: string;
}

export interface MarketingTrendPoint {
  id: string;
  label: string;
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  qualifiedLeads: number;
  dealsClosed: number;
  revenue: number;
}

export interface MarketingRegionPerformance {
  id: string;
  region: string;
  spend: number;
  leads: number;
  qualifiedLeads: number;
  dealsClosed: number;
  revenue: number;
  cpl: number;
  conversionRate: number;
  roi: number;
}

export interface MarketingAudienceSegment {
  id: string;
  segment: string;
  leads: number;
  qualifiedLeads: number;
  dealsClosed: number;
  revenue: number;
  conversionRate: number;
}

export interface MarketingInsight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'warning' | 'critical' | 'neutral';
  recommendation: string;
}

export interface MarketingAnalyticsDataset {
  summary: MarketingAnalyticsSummary;
  metricCards: MarketingMetricCard[];
  channelPerformance: MarketingChannelPerformance[];
  campaignPerformance: MarketingCampaignPerformance[];
  funnel: MarketingFunnelPoint[];
  trend: MarketingTrendPoint[];
  regionPerformance: MarketingRegionPerformance[];
  audienceSegments: MarketingAudienceSegment[];
  insights: MarketingInsight[];
}

export const marketingAnalyticsSummary: MarketingAnalyticsSummary = {
  totalSpend: 911000,
  totalImpressions: 4260000,
  totalClicks: 142800,
  totalLeads: 2486,
  qualifiedLeads: 1324,
  dealsClosed: 178,
  revenueGenerated: 70200000,
  avgCostPerLead: 366.45,
  avgClickThroughRate: 3.35,
  avgConversionRate: 7.16,
  overallRoi: 76.06,
};

export const marketingMetricCards: MarketingMetricCard[] = [
  {
    id: 'marketing-spend',
    key: 'totalSpend',
    title: 'Total Spend',
    value: '₹9.11L',
    rawValue: 911000,
    description: 'Total marketing investment across all paid and organic activation channels.',
    icon: 'wallet',
    colorScheme: 'primary',
    trend: {
      value: '+8.9%',
      direction: 'up',
      label: 'vs previous period',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 1000000,
    progress: 91,
  },
  {
    id: 'marketing-leads',
    key: 'totalLeads',
    title: 'Marketing Leads',
    value: '2,486',
    rawValue: 2486,
    description: 'Leads generated directly through marketing channels and campaigns.',
    icon: 'users',
    colorScheme: 'info',
    trend: {
      value: '+13.4%',
      direction: 'up',
      label: 'lead volume increased',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 3000,
    progress: 83,
    isHighlighted: true,
  },
  {
    id: 'marketing-qualified',
    key: 'qualifiedLeads',
    title: 'Qualified Leads',
    value: '1,324',
    rawValue: 1324,
    description: 'Leads validated as high-fit based on budget, intent, and location readiness.',
    icon: 'badge-check',
    colorScheme: 'success',
    trend: {
      value: '+10.2%',
      direction: 'up',
      label: 'quality improved',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 1500,
    progress: 88,
    isHighlighted: true,
  },
  {
    id: 'marketing-cpl',
    key: 'avgCostPerLead',
    title: 'Avg Cost Per Lead',
    value: '₹366',
    rawValue: 366.45,
    description: 'Average cost to acquire each lead across all campaign sources.',
    icon: 'coins',
    colorScheme: 'warning',
    trend: {
      value: '-₹24',
      direction: 'down',
      label: 'more efficient than last cycle',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 325,
    progress: 72,
  },
  {
    id: 'marketing-conversion',
    key: 'avgConversionRate',
    title: 'Lead Conversion',
    value: '7.16%',
    rawValue: 7.16,
    description: 'Lead-to-closed-deal conversion rate from marketing-generated pipeline.',
    icon: 'target',
    colorScheme: 'danger',
    trend: {
      value: '+0.9%',
      direction: 'up',
      label: 'closing improved',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 9,
    progress: 80,
  },
  {
    id: 'marketing-roi',
    key: 'overallRoi',
    title: 'Overall ROI',
    value: '76.06x',
    rawValue: 76.06,
    description: 'Revenue generated relative to marketing spend across all channels.',
    icon: 'trending-up',
    colorScheme: 'neutral',
    trend: {
      value: '+6.4x',
      direction: 'up',
      label: 'stronger monetization',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 80,
    progress: 95,
    isHighlighted: true,
  },
];

export const mockMarketingChannelPerformance: MarketingChannelPerformance[] = [
  {
    id: 'channel-001',
    channel: 'Meta Ads',
    impressions: 1420000,
    clicks: 54600,
    leads: 624,
    qualifiedLeads: 318,
    dealsClosed: 39,
    spend: 285000,
    revenue: 14800000,
    ctr: 3.85,
    cpc: 5.22,
    cpl: 456.73,
    costPerQualifiedLead: 896.23,
    conversionRate: 6.25,
    roi: 50.93,
  },
  {
    id: 'channel-002',
    channel: 'Google Ads',
    impressions: 980000,
    clicks: 42100,
    leads: 482,
    qualifiedLeads: 274,
    dealsClosed: 34,
    spend: 248000,
    revenue: 13100000,
    ctr: 4.3,
    cpc: 5.89,
    cpl: 514.52,
    costPerQualifiedLead: 905.11,
    conversionRate: 7.05,
    roi: 51.82,
  },
  {
    id: 'channel-003',
    channel: 'WhatsApp Campaign',
    impressions: 246000,
    clicks: 9800,
    leads: 212,
    qualifiedLeads: 108,
    dealsClosed: 12,
    spend: 24000,
    revenue: 4200000,
    ctr: 3.98,
    cpc: 2.45,
    cpl: 113.21,
    costPerQualifiedLead: 222.22,
    conversionRate: 5.66,
    roi: 174,
  },
  {
    id: 'channel-004',
    channel: 'SMS Campaign',
    impressions: 310000,
    clicks: 7600,
    leads: 118,
    qualifiedLeads: 42,
    dealsClosed: 5,
    spend: 18000,
    revenue: 1400000,
    ctr: 2.45,
    cpc: 2.37,
    cpl: 152.54,
    costPerQualifiedLead: 428.57,
    conversionRate: 4.24,
    roi: 77.78,
  },
  {
    id: 'channel-005',
    channel: 'Email Campaign',
    impressions: 186000,
    clicks: 5200,
    leads: 94,
    qualifiedLeads: 31,
    dealsClosed: 3,
    spend: 12000,
    revenue: 900000,
    ctr: 2.8,
    cpc: 2.31,
    cpl: 127.66,
    costPerQualifiedLead: 387.1,
    conversionRate: 3.19,
    roi: 75,
  },
  {
    id: 'channel-006',
    channel: 'Property Portal',
    impressions: 624000,
    clicks: 13200,
    leads: 286,
    qualifiedLeads: 123,
    dealsClosed: 11,
    spend: 138000,
    revenue: 3900000,
    ctr: 2.12,
    cpc: 10.45,
    cpl: 482.52,
    costPerQualifiedLead: 1121.95,
    conversionRate: 3.85,
    roi: 27.26,
  },
  {
    id: 'channel-007',
    channel: 'Broker Activation',
    impressions: 94000,
    clicks: 3400,
    leads: 276,
    qualifiedLeads: 192,
    dealsClosed: 41,
    spend: 92000,
    revenue: 18600000,
    ctr: 3.62,
    cpc: 27.06,
    cpl: 333.33,
    costPerQualifiedLead: 479.17,
    conversionRate: 14.86,
    roi: 201.17,
  },
  {
    id: 'channel-008',
    channel: 'Referral Program',
    impressions: 40000,
    clicks: 900,
    leads: 394,
    qualifiedLeads: 236,
    dealsClosed: 33,
    spend: 94000,
    revenue: 13300000,
    ctr: 2.25,
    cpc: 104.44,
    cpl: 238.58,
    costPerQualifiedLead: 398.31,
    conversionRate: 8.38,
    roi: 141.49,
  },
];

export const mockMarketingCampaignPerformance: MarketingCampaignPerformance[] = [
  {
    id: 'campaign-001',
    campaignName: 'Whitefield Luxury Buyer Push',
    channel: 'Meta Ads',
    status: 'active',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    budget: 180000,
    spend: 126000,
    impressions: 612000,
    clicks: 24100,
    leads: 248,
    qualifiedLeads: 138,
    dealsClosed: 15,
    revenue: 6100000,
    ctr: 3.94,
    cpl: 508.06,
    conversionRate: 6.05,
    roi: 48.41,
  },
  {
    id: 'campaign-002',
    campaignName: 'Sarjapur Villa Intent Search',
    channel: 'Google Ads',
    status: 'active',
    startDate: '2026-04-03',
    endDate: '2026-04-28',
    budget: 160000,
    spend: 118000,
    impressions: 436000,
    clicks: 18700,
    leads: 206,
    qualifiedLeads: 122,
    dealsClosed: 14,
    revenue: 5600000,
    ctr: 4.29,
    cpl: 572.82,
    conversionRate: 6.8,
    roi: 47.46,
  },
  {
    id: 'campaign-003',
    campaignName: 'Weekend Site Visit WhatsApp Blast',
    channel: 'WhatsApp Campaign',
    status: 'completed',
    startDate: '2026-03-14',
    endDate: '2026-03-16',
    budget: 18000,
    spend: 14500,
    impressions: 62000,
    clicks: 3100,
    leads: 68,
    qualifiedLeads: 34,
    dealsClosed: 5,
    revenue: 1700000,
    ctr: 5,
    cpl: 213.24,
    conversionRate: 7.35,
    roi: 117.24,
  },
  {
    id: 'campaign-004',
    campaignName: 'Broker Partner Re-Activation Drive',
    channel: 'Broker Activation',
    status: 'active',
    startDate: '2026-04-05',
    endDate: '2026-04-25',
    budget: 85000,
    spend: 49000,
    impressions: 26000,
    clicks: 1200,
    leads: 102,
    qualifiedLeads: 71,
    dealsClosed: 16,
    revenue: 7200000,
    ctr: 4.62,
    cpl: 480.39,
    conversionRate: 15.69,
    roi: 146.94,
  },
  {
    id: 'campaign-005',
    campaignName: 'Portal Premium Listing Booster',
    channel: 'Property Portal',
    status: 'paused',
    startDate: '2026-03-20',
    endDate: '2026-04-20',
    budget: 120000,
    spend: 94000,
    impressions: 302000,
    clicks: 6100,
    leads: 124,
    qualifiedLeads: 49,
    dealsClosed: 4,
    revenue: 1500000,
    ctr: 2.02,
    cpl: 758.06,
    conversionRate: 3.23,
    roi: 15.96,
  },
  {
    id: 'campaign-006',
    campaignName: 'Referral Gold Circle Program',
    channel: 'Referral Program',
    status: 'active',
    startDate: '2026-04-01',
    endDate: '2026-05-15',
    budget: 95000,
    spend: 42000,
    impressions: 18000,
    clicks: 540,
    leads: 94,
    qualifiedLeads: 56,
    dealsClosed: 11,
    revenue: 4200000,
    ctr: 3,
    cpl: 446.81,
    conversionRate: 11.7,
    roi: 100,
  },
];

export const mockMarketingFunnel: MarketingFunnelPoint[] = [
  {
    id: 'funnel-001',
    stage: 'Impressions',
    count: 4260000,
    percentage: 100,
    dropOffRate: 0,
    colorToken: 'chart-blue',
  },
  {
    id: 'funnel-002',
    stage: 'Clicks',
    count: 142800,
    percentage: 3.35,
    dropOffRate: 96.65,
    colorToken: 'chart-cyan',
  },
  {
    id: 'funnel-003',
    stage: 'Leads',
    count: 2486,
    percentage: 1.74,
    dropOffRate: 98.26,
    colorToken: 'chart-amber',
  },
  {
    id: 'funnel-004',
    stage: 'Qualified Leads',
    count: 1324,
    percentage: 53.26,
    dropOffRate: 46.74,
    colorToken: 'chart-purple',
  },
  {
    id: 'funnel-005',
    stage: 'Deals Closed',
    count: 178,
    percentage: 7.16,
    dropOffRate: 92.84,
    colorToken: 'chart-green',
  },
];

export const mockMarketingTrend: MarketingTrendPoint[] = [
  {
    id: 'trend-jan-2026',
    label: 'Jan',
    date: '2026-01',
    spend: 214000,
    impressions: 920000,
    clicks: 28100,
    leads: 612,
    qualifiedLeads: 312,
    dealsClosed: 43,
    revenue: 16400000,
  },
  {
    id: 'trend-feb-2026',
    label: 'Feb',
    date: '2026-02',
    spend: 228000,
    impressions: 1010000,
    clicks: 33200,
    leads: 684,
    qualifiedLeads: 356,
    dealsClosed: 48,
    revenue: 19100000,
  },
  {
    id: 'trend-mar-2026',
    label: 'Mar',
    date: '2026-03',
    spend: 252000,
    impressions: 1184000,
    clicks: 42600,
    leads: 742,
    qualifiedLeads: 401,
    dealsClosed: 53,
    revenue: 22400000,
  },
  {
    id: 'trend-apr-2026',
    label: 'Apr',
    date: '2026-04',
    spend: 217000,
    impressions: 1146000,
    clicks: 38900,
    leads: 448,
    qualifiedLeads: 255,
    dealsClosed: 34,
    revenue: 12300000,
  },
];

export const mockMarketingRegionPerformance: MarketingRegionPerformance[] = [
  {
    id: 'region-001',
    region: 'Whitefield',
    spend: 198000,
    leads: 402,
    qualifiedLeads: 236,
    dealsClosed: 31,
    revenue: 12400000,
    cpl: 492.54,
    conversionRate: 7.71,
    roi: 62.63,
  },
  {
    id: 'region-002',
    region: 'Sarjapur',
    spend: 174000,
    leads: 356,
    qualifiedLeads: 201,
    dealsClosed: 27,
    revenue: 10300000,
    cpl: 488.76,
    conversionRate: 7.58,
    roi: 59.2,
  },
  {
    id: 'region-003',
    region: 'Varthur',
    spend: 128000,
    leads: 284,
    qualifiedLeads: 152,
    dealsClosed: 18,
    revenue: 7200000,
    cpl: 450.7,
    conversionRate: 6.34,
    roi: 56.25,
  },
  {
    id: 'region-004',
    region: 'Hebbal',
    spend: 112000,
    leads: 236,
    qualifiedLeads: 128,
    dealsClosed: 16,
    revenue: 5900000,
    cpl: 474.58,
    conversionRate: 6.78,
    roi: 52.68,
  },
  {
    id: 'region-005',
    region: 'Electronic City',
    spend: 156000,
    leads: 298,
    qualifiedLeads: 141,
    dealsClosed: 12,
    revenue: 4300000,
    cpl: 523.49,
    conversionRate: 4.03,
    roi: 27.56,
  },
  {
    id: 'region-006',
    region: 'Begur Road',
    spend: 86000,
    leads: 192,
    qualifiedLeads: 88,
    dealsClosed: 8,
    revenue: 2600000,
    cpl: 447.92,
    conversionRate: 4.17,
    roi: 30.23,
  },
];

export const mockMarketingAudienceSegments: MarketingAudienceSegment[] = [
  {
    id: 'segment-001',
    segment: 'Luxury Buyers',
    leads: 418,
    qualifiedLeads: 264,
    dealsClosed: 39,
    revenue: 18200000,
    conversionRate: 9.33,
  },
  {
    id: 'segment-002',
    segment: 'First-Time Home Buyers',
    leads: 624,
    qualifiedLeads: 336,
    dealsClosed: 42,
    revenue: 14600000,
    conversionRate: 6.73,
  },
  {
    id: 'segment-003',
    segment: 'Investors',
    leads: 298,
    qualifiedLeads: 198,
    dealsClosed: 34,
    revenue: 17100000,
    conversionRate: 11.41,
  },
  {
    id: 'segment-004',
    segment: 'NRI Prospects',
    leads: 184,
    qualifiedLeads: 112,
    dealsClosed: 16,
    revenue: 9400000,
    conversionRate: 8.7,
  },
  {
    id: 'segment-005',
    segment: 'Rental Yield Seekers',
    leads: 362,
    qualifiedLeads: 171,
    dealsClosed: 21,
    revenue: 6900000,
    conversionRate: 5.8,
  },
  {
    id: 'segment-006',
    segment: 'Affordable Segment',
    leads: 600,
    qualifiedLeads: 243,
    dealsClosed: 26,
    revenue: 8000000,
    conversionRate: 4.33,
  },
];

export const mockMarketingInsights: MarketingInsight[] = [
  {
    id: 'insight-001',
    title: 'Broker Activation is outperforming most paid channels',
    description:
      'Broker-led acquisition is producing the strongest lead quality and deal conversion at an exceptional ROI.',
    impact: 'positive',
    recommendation:
      'Expand broker partner campaigns and create zone-specific activation incentives.',
  },
  {
    id: 'insight-002',
    title: 'Property Portal spend is underperforming',
    description:
      'Portal campaigns are consuming notable budget but producing weaker qualification and closure outcomes.',
    impact: 'critical',
    recommendation:
      'Reduce spend, improve listing quality, and redirect budget to higher-ROI segments.',
  },
  {
    id: 'insight-003',
    title: 'WhatsApp campaigns are highly efficient for re-engagement',
    description:
      'Low-cost WhatsApp campaigns are producing strong CPL efficiency and useful site-visit recovery.',
    impact: 'positive',
    recommendation:
      'Increase remarketing automation using WhatsApp for warm and dormant leads.',
  },
  {
    id: 'insight-004',
    title: 'Luxury and investor segments generate outsized revenue',
    description:
      'These audience groups contribute a disproportionate share of revenue despite lower overall lead volume.',
    impact: 'warning',
    recommendation:
      'Build dedicated campaign creatives and premium follow-up tracks for these segments.',
  },
];

export const mockMarketingAnalytics: MarketingAnalyticsDataset = {
  summary: marketingAnalyticsSummary,
  metricCards: marketingMetricCards,
  channelPerformance: mockMarketingChannelPerformance,
  campaignPerformance: mockMarketingCampaignPerformance,
  funnel: mockMarketingFunnel,
  trend: mockMarketingTrend,
  regionPerformance: mockMarketingRegionPerformance,
  audienceSegments: mockMarketingAudienceSegments,
  insights: mockMarketingInsights,
};

export const marketingMetricMap = marketingMetricCards.reduce<
  Record<string, MarketingMetricCard>
>((acc, metric) => {
  acc[metric.key] = metric;
  return acc;
}, {});

export const getMarketingMetricByKey = (
  key: MarketingMetricCard['key'],
): MarketingMetricCard | undefined => {
  return marketingMetricMap[key];
};

export const highlightedMarketingMetrics = marketingMetricCards.filter(
  (metric) => metric.isHighlighted,
);

export const topMarketingChannels = [...mockMarketingChannelPerformance]
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5);

export const activeMarketingCampaigns = mockMarketingCampaignPerformance.filter(
  (campaign) => campaign.status === 'active',
);

export default mockMarketingAnalytics;