// src/features/analytics/data/mockRevenueAnalytics.ts

export type RevenueTrendDirection = 'up' | 'down' | 'neutral';
export type RevenuePriorityLevel = 'high' | 'medium' | 'low';
export type RevenueCollectionStatus =
  | 'collected'
  | 'pending'
  | 'overdue'
  | 'partially_collected';

export interface RevenueTrend {
  value: string;
  direction: RevenueTrendDirection;
  label: string;
}

export interface RevenueAnalyticsSummary {
  totalRevenue: number;
  collectedRevenue: number;
  pendingRevenue: number;
  overdueRevenue: number;
  monthlyRecurringRevenue: number;
  avgDealRevenue: number;
  collectionRate: number;
  revenueGrowthRate: number;
}

export interface RevenueMetricCard {
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
  trend: RevenueTrend;
  updatedAt: string;
  target?: number;
  progress?: number;
  isHighlighted?: boolean;
}

export interface RevenueTrendPoint {
  id: string;
  label: string;
  date: string;
  totalRevenue: number;
  collectedRevenue: number;
  pendingRevenue: number;
  overdueRevenue: number;
  recurringRevenue: number;
}

export interface RevenueBySource {
  id: string;
  source: string;
  revenue: number;
  dealsClosed: number;
  avgDealRevenue: number;
  contributionPercentage: number;
  growthRate: number;
}

export interface RevenueByRegion {
  id: string;
  region: string;
  revenue: number;
  collectedRevenue: number;
  pendingRevenue: number;
  dealsClosed: number;
  avgDealRevenue: number;
  growthRate: number;
}

export interface RevenueByProject {
  id: string;
  projectName: string;
  developerName: string;
  region: string;
  revenue: number;
  dealsClosed: number;
  avgDealRevenue: number;
  collectionRate: number;
  growthRate: number;
}

export interface RevenueByOwner {
  id: string;
  ownerName: string;
  revenue: number;
  collectedRevenue: number;
  pendingRevenue: number;
  dealsClosed: number;
  avgDealRevenue: number;
  collectionRate: number;
}

export interface RevenueCollectionItem {
  id: string;
  title: string;
  clientName: string;
  region: string;
  ownerName: string;
  totalAmount: number;
  collectedAmount: number;
  dueAmount: number;
  dueDate: string;
  status: RevenueCollectionStatus;
  priorityLevel: RevenuePriorityLevel;
}

export interface RevenueForecastPoint {
  id: string;
  label: string;
  month: string;
  forecastRevenue: number;
  committedRevenue: number;
  stretchRevenue: number;
}

export interface RevenueInsight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'warning' | 'critical' | 'neutral';
  recommendation: string;
}

export interface RevenueAnalyticsDataset {
  summary: RevenueAnalyticsSummary;
  metricCards: RevenueMetricCard[];
  trend: RevenueTrendPoint[];
  revenueBySource: RevenueBySource[];
  revenueByRegion: RevenueByRegion[];
  revenueByProject: RevenueByProject[];
  revenueByOwner: RevenueByOwner[];
  collectionItems: RevenueCollectionItem[];
  forecast: RevenueForecastPoint[];
  insights: RevenueInsight[];
}

export const revenueAnalyticsSummary: RevenueAnalyticsSummary = {
  totalRevenue: 70200000,
  collectedRevenue: 56100000,
  pendingRevenue: 10300000,
  overdueRevenue: 3800000,
  monthlyRecurringRevenue: 9400000,
  avgDealRevenue: 394382,
  collectionRate: 79.91,
  revenueGrowthRate: 14.8,
};

export const revenueMetricCards: RevenueMetricCard[] = [
  {
    id: 'revenue-total',
    key: 'totalRevenue',
    title: 'Total Revenue',
    value: '₹7.02Cr',
    rawValue: 70200000,
    description: 'Overall recognized revenue from closed deals and monetized services.',
    icon: 'indian-rupee',
    colorScheme: 'success',
    trend: {
      value: '+14.8%',
      direction: 'up',
      label: 'vs previous period',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 80000000,
    progress: 88,
    isHighlighted: true,
  },
  {
    id: 'revenue-collected',
    key: 'collectedRevenue',
    title: 'Collected Revenue',
    value: '₹5.61Cr',
    rawValue: 56100000,
    description: 'Revenue already realized and successfully collected into the business.',
    icon: 'wallet',
    colorScheme: 'primary',
    trend: {
      value: '+12.1%',
      direction: 'up',
      label: 'cash realization improved',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 65000000,
    progress: 86,
    isHighlighted: true,
  },
  {
    id: 'revenue-pending',
    key: 'pendingRevenue',
    title: 'Pending Revenue',
    value: '₹1.03Cr',
    rawValue: 10300000,
    description: 'Revenue expected from already closed or near-complete business activity.',
    icon: 'hourglass',
    colorScheme: 'warning',
    trend: {
      value: '-4.2%',
      direction: 'down',
      label: 'backlog shrinking',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 9000000,
    progress: 74,
  },
  {
    id: 'revenue-overdue',
    key: 'overdueRevenue',
    title: 'Overdue Revenue',
    value: '₹38L',
    rawValue: 3800000,
    description: 'Revenue currently delayed beyond due date and needing collection action.',
    icon: 'alert-triangle',
    colorScheme: 'danger',
    trend: {
      value: '-8.6%',
      direction: 'down',
      label: 'collections recovering',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 2500000,
    progress: 61,
  },
  {
    id: 'revenue-mrr',
    key: 'monthlyRecurringRevenue',
    title: 'Monthly Recurring Revenue',
    value: '₹94L',
    rawValue: 9400000,
    description: 'Recurring monthly revenue from retained services and repeat monetization streams.',
    icon: 'refresh-cw',
    colorScheme: 'info',
    trend: {
      value: '+9.3%',
      direction: 'up',
      label: 'steady recurring growth',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 11000000,
    progress: 85,
  },
  {
    id: 'revenue-collection-rate',
    key: 'collectionRate',
    title: 'Collection Rate',
    value: '79.91%',
    rawValue: 79.91,
    description: 'Percentage of recognized revenue already collected successfully.',
    icon: 'target',
    colorScheme: 'neutral',
    trend: {
      value: '+3.1%',
      direction: 'up',
      label: 'better collection discipline',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 85,
    progress: 94,
    isHighlighted: true,
  },
];

export const mockRevenueTrend: RevenueTrendPoint[] = [
  {
    id: 'rev-jan-2026',
    label: 'Jan',
    date: '2026-01',
    totalRevenue: 15400000,
    collectedRevenue: 11900000,
    pendingRevenue: 2700000,
    overdueRevenue: 800000,
    recurringRevenue: 2100000,
  },
  {
    id: 'rev-feb-2026',
    label: 'Feb',
    date: '2026-02',
    totalRevenue: 16800000,
    collectedRevenue: 13300000,
    pendingRevenue: 2400000,
    overdueRevenue: 1100000,
    recurringRevenue: 2250000,
  },
  {
    id: 'rev-mar-2026',
    label: 'Mar',
    date: '2026-03',
    totalRevenue: 20500000,
    collectedRevenue: 16500000,
    pendingRevenue: 2800000,
    overdueRevenue: 1200000,
    recurringRevenue: 2440000,
  },
  {
    id: 'rev-apr-2026',
    label: 'Apr',
    date: '2026-04',
    totalRevenue: 17500000,
    collectedRevenue: 14400000,
    pendingRevenue: 2400000,
    overdueRevenue: 700000,
    recurringRevenue: 2610000,
  },
];

export const mockRevenueBySource: RevenueBySource[] = [
  {
    id: 'source-001',
    source: 'Broker Referral',
    revenue: 18600000,
    dealsClosed: 41,
    avgDealRevenue: 453659,
    contributionPercentage: 26.5,
    growthRate: 18.2,
  },
  {
    id: 'source-002',
    source: 'Meta Ads',
    revenue: 14800000,
    dealsClosed: 39,
    avgDealRevenue: 379487,
    contributionPercentage: 21.1,
    growthRate: 12.7,
  },
  {
    id: 'source-003',
    source: 'Google Ads',
    revenue: 13100000,
    dealsClosed: 34,
    avgDealRevenue: 385294,
    contributionPercentage: 18.7,
    growthRate: 14.4,
  },
  {
    id: 'source-004',
    source: 'Referral Program',
    revenue: 13300000,
    dealsClosed: 33,
    avgDealRevenue: 403030,
    contributionPercentage: 18.9,
    growthRate: 15.1,
  },
  {
    id: 'source-005',
    source: 'Website',
    revenue: 6700000,
    dealsClosed: 18,
    avgDealRevenue: 372222,
    contributionPercentage: 9.5,
    growthRate: 8.6,
  },
  {
    id: 'source-006',
    source: 'WhatsApp Campaign',
    revenue: 4200000,
    dealsClosed: 12,
    avgDealRevenue: 350000,
    contributionPercentage: 6.0,
    growthRate: 10.9,
  },
];

export const mockRevenueByRegion: RevenueByRegion[] = [
  {
    id: 'region-001',
    region: 'Whitefield',
    revenue: 12800000,
    collectedRevenue: 10400000,
    pendingRevenue: 1600000,
    dealsClosed: 34,
    avgDealRevenue: 376471,
    growthRate: 18.6,
  },
  {
    id: 'region-002',
    region: 'Sarjapur',
    revenue: 10200000,
    collectedRevenue: 8100000,
    pendingRevenue: 1500000,
    dealsClosed: 27,
    avgDealRevenue: 377778,
    growthRate: 16.1,
  },
  {
    id: 'region-003',
    region: 'Varthur',
    revenue: 7800000,
    collectedRevenue: 6200000,
    pendingRevenue: 1100000,
    dealsClosed: 21,
    avgDealRevenue: 371429,
    growthRate: 12.8,
  },
  {
    id: 'region-004',
    region: 'HSR Layout',
    revenue: 6200000,
    collectedRevenue: 4900000,
    pendingRevenue: 900000,
    dealsClosed: 18,
    avgDealRevenue: 344444,
    growthRate: 9.4,
  },
  {
    id: 'region-005',
    region: 'Hebbal',
    revenue: 5700000,
    collectedRevenue: 4500000,
    pendingRevenue: 800000,
    dealsClosed: 16,
    avgDealRevenue: 356250,
    growthRate: 7.6,
  },
  {
    id: 'region-006',
    region: 'Electronic City',
    revenue: 4500000,
    collectedRevenue: 3400000,
    pendingRevenue: 700000,
    dealsClosed: 12,
    avgDealRevenue: 375000,
    growthRate: -2.9,
  },
  {
    id: 'region-007',
    region: 'Begur Road',
    revenue: 3100000,
    collectedRevenue: 2400000,
    pendingRevenue: 500000,
    dealsClosed: 8,
    avgDealRevenue: 387500,
    growthRate: -4.6,
  },
  {
    id: 'region-008',
    region: 'Koramangala',
    revenue: 4600000,
    collectedRevenue: 3600000,
    pendingRevenue: 600000,
    dealsClosed: 10,
    avgDealRevenue: 460000,
    growthRate: 8.2,
  },
];

export const mockRevenueByProject: RevenueByProject[] = [
  {
    id: 'project-001',
    projectName: 'Prestige Lakeside Habitat',
    developerName: 'Prestige Group',
    region: 'Whitefield',
    revenue: 6900000,
    dealsClosed: 16,
    avgDealRevenue: 431250,
    collectionRate: 82.6,
    growthRate: 17.4,
  },
  {
    id: 'project-002',
    projectName: 'Godrej Woodland',
    developerName: 'Godrej Properties',
    region: 'Sarjapur',
    revenue: 5600000,
    dealsClosed: 14,
    avgDealRevenue: 400000,
    collectionRate: 79.2,
    growthRate: 15.8,
  },
  {
    id: 'project-003',
    projectName: 'Brigade Cornerstone Utopia',
    developerName: 'Brigade Group',
    region: 'Varthur',
    revenue: 4700000,
    dealsClosed: 12,
    avgDealRevenue: 391667,
    collectionRate: 77.5,
    growthRate: 12.3,
  },
  {
    id: 'project-004',
    projectName: 'SNN Raj Etternia',
    developerName: 'SNN Builders',
    region: 'HSR Layout',
    revenue: 3900000,
    dealsClosed: 11,
    avgDealRevenue: 354545,
    collectionRate: 80.1,
    growthRate: 10.2,
  },
  {
    id: 'project-005',
    projectName: 'Brigade Caladium',
    developerName: 'Brigade Group',
    region: 'Hebbal',
    revenue: 3200000,
    dealsClosed: 8,
    avgDealRevenue: 400000,
    collectionRate: 76.8,
    growthRate: 7.4,
  },
  {
    id: 'project-006',
    projectName: 'Luxury Boutique Residences',
    developerName: 'Private Developer',
    region: 'Koramangala',
    revenue: 2800000,
    dealsClosed: 5,
    avgDealRevenue: 560000,
    collectionRate: 81.3,
    growthRate: 9.1,
  },
];

export const mockRevenueByOwner: RevenueByOwner[] = [
  {
    id: 'owner-001',
    ownerName: 'Ravi Shankar',
    revenue: 15400000,
    collectedRevenue: 12400000,
    pendingRevenue: 2100000,
    dealsClosed: 39,
    avgDealRevenue: 394872,
    collectionRate: 80.52,
  },
  {
    id: 'owner-002',
    ownerName: 'Divya Narayan',
    revenue: 14100000,
    collectedRevenue: 11300000,
    pendingRevenue: 1900000,
    dealsClosed: 35,
    avgDealRevenue: 402857,
    collectionRate: 80.14,
  },
  {
    id: 'owner-003',
    ownerName: 'Karthik R',
    revenue: 11800000,
    collectedRevenue: 9300000,
    pendingRevenue: 1700000,
    dealsClosed: 30,
    avgDealRevenue: 393333,
    collectionRate: 78.81,
  },
  {
    id: 'owner-004',
    ownerName: 'Asha Menon',
    revenue: 10200000,
    collectedRevenue: 8100000,
    pendingRevenue: 1500000,
    dealsClosed: 26,
    avgDealRevenue: 392308,
    collectionRate: 79.41,
  },
  {
    id: 'owner-005',
    ownerName: 'Vignesh Kumar',
    revenue: 8700000,
    collectedRevenue: 6800000,
    pendingRevenue: 1200000,
    dealsClosed: 22,
    avgDealRevenue: 395455,
    collectionRate: 78.16,
  },
];

export const mockRevenueCollectionItems: RevenueCollectionItem[] = [
  {
    id: 'collect-001',
    title: 'Whitefield Premium Closure',
    clientName: 'Farooq Ali',
    region: 'Whitefield',
    ownerName: 'Ravi Shankar',
    totalAmount: 1450000,
    collectedAmount: 1100000,
    dueAmount: 350000,
    dueDate: '2026-04-20',
    status: 'pending',
    priorityLevel: 'high',
  },
  {
    id: 'collect-002',
    title: 'Sarjapur Villa Booking',
    clientName: 'Nisha Patel',
    region: 'Sarjapur',
    ownerName: 'Divya Narayan',
    totalAmount: 1280000,
    collectedAmount: 960000,
    dueAmount: 320000,
    dueDate: '2026-04-18',
    status: 'pending',
    priorityLevel: 'high',
  },
  {
    id: 'collect-003',
    title: 'Investor Plot Allocation',
    clientName: 'Rahul Mehta',
    region: 'Hebbal',
    ownerName: 'Asha Menon',
    totalAmount: 980000,
    collectedAmount: 620000,
    dueAmount: 360000,
    dueDate: '2026-04-10',
    status: 'overdue',
    priorityLevel: 'high',
  },
  {
    id: 'collect-004',
    title: 'Luxury Apartment Final Settlement',
    clientName: 'Priya S',
    region: 'Koramangala',
    ownerName: 'Karthik R',
    totalAmount: 840000,
    collectedAmount: 840000,
    dueAmount: 0,
    dueDate: '2026-04-08',
    status: 'collected',
    priorityLevel: 'low',
  },
  {
    id: 'collect-005',
    title: 'Affordable Segment Registration Fee',
    clientName: 'Sathish Babu',
    region: 'Electronic City',
    ownerName: 'Vignesh Kumar',
    totalAmount: 620000,
    collectedAmount: 360000,
    dueAmount: 260000,
    dueDate: '2026-04-05',
    status: 'partially_collected',
    priorityLevel: 'medium',
  },
  {
    id: 'collect-006',
    title: 'Varthur Site Closure Balance',
    clientName: 'Arun Kumar',
    region: 'Varthur',
    ownerName: 'Ravi Shankar',
    totalAmount: 760000,
    collectedAmount: 420000,
    dueAmount: 340000,
    dueDate: '2026-04-02',
    status: 'overdue',
    priorityLevel: 'high',
  },
];

export const mockRevenueForecast: RevenueForecastPoint[] = [
  {
    id: 'forecast-may-2026',
    label: 'May',
    month: '2026-05',
    forecastRevenue: 18600000,
    committedRevenue: 12400000,
    stretchRevenue: 21200000,
  },
  {
    id: 'forecast-jun-2026',
    label: 'Jun',
    month: '2026-06',
    forecastRevenue: 19400000,
    committedRevenue: 13100000,
    stretchRevenue: 22400000,
  },
  {
    id: 'forecast-jul-2026',
    label: 'Jul',
    month: '2026-07',
    forecastRevenue: 20100000,
    committedRevenue: 13800000,
    stretchRevenue: 23500000,
  },
  {
    id: 'forecast-aug-2026',
    label: 'Aug',
    month: '2026-08',
    forecastRevenue: 20900000,
    committedRevenue: 14500000,
    stretchRevenue: 24600000,
  },
];

export const mockRevenueInsights: RevenueInsight[] = [
  {
    id: 'insight-001',
    title: 'Referral-driven revenue is becoming the strongest engine',
    description:
      'Broker and referral-led channels together are driving the largest revenue share with strong growth momentum.',
    impact: 'positive',
    recommendation:
      'Double down on partner enablement, repeat-referral loops, and high-trust acquisition channels.',
  },
  {
    id: 'insight-002',
    title: 'Collection discipline is improving, but overdue pockets remain',
    description:
      'Overall collection rate is healthy, yet a few mid-size overdue balances are dragging cash efficiency.',
    impact: 'warning',
    recommendation:
      'Create a daily collections tracker with owner accountability and escalation rules for overdue accounts.',
  },
  {
    id: 'insight-003',
    title: 'Top regions are carrying the business disproportionately',
    description:
      'Whitefield and Sarjapur contribute a major share of revenue growth, while weaker zones are slowing portfolio balance.',
    impact: 'neutral',
    recommendation:
      'Protect top-performing zones while redesigning offer strategy for underperforming regions.',
  },
  {
    id: 'insight-004',
    title: 'Recurring revenue can become a valuation multiplier',
    description:
      'Monthly recurring revenue continues to rise and can strengthen business predictability significantly.',
    impact: 'positive',
    recommendation:
      'Bundle recurring services and upsell retained plans to improve long-term revenue stability.',
  },
];

export const mockRevenueAnalytics: RevenueAnalyticsDataset = {
  summary: revenueAnalyticsSummary,
  metricCards: revenueMetricCards,
  trend: mockRevenueTrend,
  revenueBySource: mockRevenueBySource,
  revenueByRegion: mockRevenueByRegion,
  revenueByProject: mockRevenueByProject,
  revenueByOwner: mockRevenueByOwner,
  collectionItems: mockRevenueCollectionItems,
  forecast: mockRevenueForecast,
  insights: mockRevenueInsights,
};

export const revenueMetricMap = revenueMetricCards.reduce<
  Record<string, RevenueMetricCard>
>((acc, metric) => {
  acc[metric.key] = metric;
  return acc;
}, {});

export const getRevenueMetricByKey = (
  key: RevenueMetricCard['key'],
): RevenueMetricCard | undefined => {
  return revenueMetricMap[key];
};

export const highlightedRevenueMetrics = revenueMetricCards.filter(
  (metric) => metric.isHighlighted,
);

export const overdueRevenueCollections = mockRevenueCollectionItems.filter(
  (item) => item.status === 'overdue',
);

export const highPriorityRevenueCollections = mockRevenueCollectionItems.filter(
  (item) => item.priorityLevel === 'high',
);

export default mockRevenueAnalytics;