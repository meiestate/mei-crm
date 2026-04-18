// src/features/analytics/data/mockPipelineAnalytics.ts

export type PipelineTrendDirection = 'up' | 'down' | 'neutral';
export type PipelineDealRisk = 'low' | 'medium' | 'high';
export type PipelinePriorityLevel = 'high' | 'medium' | 'low';

export interface PipelineTrend {
  value: string;
  direction: PipelineTrendDirection;
  label: string;
}

export interface PipelineAnalyticsSummary {
  totalOpenDeals: number;
  totalPipelineValue: number;
  weightedPipelineValue: number;
  avgDealSize: number;
  avgSalesCycleDays: number;
  overallWinRate: number;
  stuckDeals: number;
  overdueFollowUps: number;
}

export interface PipelineMetricCard {
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
  trend: PipelineTrend;
  updatedAt: string;
  target?: number;
  progress?: number;
  isHighlighted?: boolean;
}

export interface PipelineStagePerformance {
  id: string;
  stage: string;
  deals: number;
  pipelineValue: number;
  weightedValue: number;
  avgDealValue: number;
  avgDaysInStage: number;
  conversionRate: number;
  dropOffRate: number;
  colorToken: string;
}

export interface PipelineTrendPoint {
  id: string;
  label: string;
  date: string;
  openDeals: number;
  pipelineValue: number;
  weightedPipelineValue: number;
  wonDeals: number;
  lostDeals: number;
}

export interface PipelineOwnerPerformance {
  id: string;
  ownerName: string;
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  pipelineValue: number;
  weightedValue: number;
  avgDealSize: number;
  winRate: number;
  avgSalesCycleDays: number;
}

export interface PipelineRegionPerformance {
  id: string;
  region: string;
  openDeals: number;
  pipelineValue: number;
  weightedValue: number;
  wonDeals: number;
  avgDealSize: number;
  winRate: number;
  growthRate: number;
}

export interface PipelineRiskDeal {
  id: string;
  dealTitle: string;
  clientName: string;
  region: string;
  stage: string;
  ownerName: string;
  dealValue: number;
  probability: number;
  weightedValue: number;
  daysInStage: number;
  expectedCloseDate: string;
  riskLevel: PipelineDealRisk;
  blocker: string;
}

export interface PipelineAgingBucket {
  id: string;
  bucket: string;
  deals: number;
  percentage: number;
  riskLevel: PipelinePriorityLevel;
}

export interface PipelineInsight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'warning' | 'critical' | 'neutral';
  recommendation: string;
}

export interface PipelineAnalyticsDataset {
  summary: PipelineAnalyticsSummary;
  metricCards: PipelineMetricCard[];
  stagePerformance: PipelineStagePerformance[];
  trend: PipelineTrendPoint[];
  ownerPerformance: PipelineOwnerPerformance[];
  regionPerformance: PipelineRegionPerformance[];
  riskDeals: PipelineRiskDeal[];
  agingBuckets: PipelineAgingBucket[];
  insights: PipelineInsight[];
}

export const pipelineAnalyticsSummary: PipelineAnalyticsSummary = {
  totalOpenDeals: 149,
  totalPipelineValue: 89200000,
  weightedPipelineValue: 48140000,
  avgDealSize: 598658,
  avgSalesCycleDays: 37,
  overallWinRate: 18.9,
  stuckDeals: 21,
  overdueFollowUps: 17,
};

export const pipelineMetricCards: PipelineMetricCard[] = [
  {
    id: 'pipeline-open-deals',
    key: 'totalOpenDeals',
    title: 'Open Deals',
    value: '149',
    rawValue: 149,
    description: 'All active opportunities currently moving through the sales pipeline.',
    icon: 'briefcase-business',
    colorScheme: 'primary',
    trend: {
      value: '+12 deals',
      direction: 'up',
      label: 'pipeline expanded',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 180,
    progress: 83,
    isHighlighted: true,
  },
  {
    id: 'pipeline-total-value',
    key: 'totalPipelineValue',
    title: 'Pipeline Value',
    value: '₹8.92Cr',
    rawValue: 89200000,
    description: 'Total raw open opportunity value across all active stages.',
    icon: 'indian-rupee',
    colorScheme: 'success',
    trend: {
      value: '+11.5%',
      direction: 'up',
      label: 'vs last 30 days',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 100000000,
    progress: 89,
    isHighlighted: true,
  },
  {
    id: 'pipeline-weighted-value',
    key: 'weightedPipelineValue',
    title: 'Weighted Pipeline',
    value: '₹4.81Cr',
    rawValue: 48140000,
    description: 'Probability-adjusted pipeline value based on stage conversion strength.',
    icon: 'layers-3',
    colorScheme: 'info',
    trend: {
      value: '+9.8%',
      direction: 'up',
      label: 'forecast confidence improved',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 60000000,
    progress: 80,
  },
  {
    id: 'pipeline-avg-deal-size',
    key: 'avgDealSize',
    title: 'Avg Deal Size',
    value: '₹5.99L',
    rawValue: 598658,
    description: 'Average opportunity size across the active pipeline.',
    icon: 'bar-chart-3',
    colorScheme: 'warning',
    trend: {
      value: '+6.2%',
      direction: 'up',
      label: 'higher ticket quality',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 650000,
    progress: 92,
  },
  {
    id: 'pipeline-sales-cycle',
    key: 'avgSalesCycleDays',
    title: 'Avg Sales Cycle',
    value: '37 Days',
    rawValue: 37,
    description: 'Average number of days taken for a deal to move from lead to closure.',
    icon: 'clock-3',
    colorScheme: 'neutral',
    trend: {
      value: '-4 days',
      direction: 'down',
      label: 'faster closure velocity',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 30,
    progress: 68,
  },
  {
    id: 'pipeline-win-rate',
    key: 'overallWinRate',
    title: 'Win Rate',
    value: '18.9%',
    rawValue: 18.9,
    description: 'Percentage of pipeline opportunities closing successfully.',
    icon: 'target',
    colorScheme: 'danger',
    trend: {
      value: '+1.7%',
      direction: 'up',
      label: 'closing efficiency improved',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 22,
    progress: 86,
    isHighlighted: true,
  },
];

export const mockPipelineStagePerformance: PipelineStagePerformance[] = [
  {
    id: 'stage-001',
    stage: 'New Inquiry',
    deals: 58,
    pipelineValue: 12600000,
    weightedValue: 1890000,
    avgDealValue: 217241,
    avgDaysInStage: 6,
    conversionRate: 15,
    dropOffRate: 22,
    colorToken: 'chart-blue',
  },
  {
    id: 'stage-002',
    stage: 'Qualified',
    deals: 42,
    pipelineValue: 17800000,
    weightedValue: 6230000,
    avgDealValue: 423810,
    avgDaysInStage: 9,
    conversionRate: 35,
    dropOffRate: 18,
    colorToken: 'chart-cyan',
  },
  {
    id: 'stage-003',
    stage: 'Site Visit',
    deals: 27,
    pipelineValue: 22400000,
    weightedValue: 12320000,
    avgDealValue: 829630,
    avgDaysInStage: 11,
    conversionRate: 55,
    dropOffRate: 16,
    colorToken: 'chart-amber',
  },
  {
    id: 'stage-004',
    stage: 'Negotiation',
    deals: 14,
    pipelineValue: 19800000,
    weightedValue: 14850000,
    avgDealValue: 1414286,
    avgDaysInStage: 8,
    conversionRate: 75,
    dropOffRate: 11,
    colorToken: 'chart-green',
  },
  {
    id: 'stage-005',
    stage: 'Documentation',
    deals: 8,
    pipelineValue: 16600000,
    weightedValue: 15770000,
    avgDealValue: 2075000,
    avgDaysInStage: 5,
    conversionRate: 95,
    dropOffRate: 3,
    colorToken: 'chart-purple',
  },
];

export const mockPipelineTrend: PipelineTrendPoint[] = [
  {
    id: 'trend-jan-2026',
    label: 'Jan',
    date: '2026-01',
    openDeals: 118,
    pipelineValue: 68400000,
    weightedPipelineValue: 36100000,
    wonDeals: 17,
    lostDeals: 12,
  },
  {
    id: 'trend-feb-2026',
    label: 'Feb',
    date: '2026-02',
    openDeals: 126,
    pipelineValue: 74200000,
    weightedPipelineValue: 39800000,
    wonDeals: 19,
    lostDeals: 11,
  },
  {
    id: 'trend-mar-2026',
    label: 'Mar',
    date: '2026-03',
    openDeals: 138,
    pipelineValue: 81600000,
    weightedPipelineValue: 44200000,
    wonDeals: 23,
    lostDeals: 14,
  },
  {
    id: 'trend-apr-2026',
    label: 'Apr',
    date: '2026-04',
    openDeals: 149,
    pipelineValue: 89200000,
    weightedPipelineValue: 48140000,
    wonDeals: 21,
    lostDeals: 10,
  },
];

export const mockPipelineOwnerPerformance: PipelineOwnerPerformance[] = [
  {
    id: 'owner-001',
    ownerName: 'Ravi Shankar',
    openDeals: 32,
    wonDeals: 18,
    lostDeals: 7,
    pipelineValue: 18400000,
    weightedValue: 10900000,
    avgDealSize: 575000,
    winRate: 31.03,
    avgSalesCycleDays: 29,
  },
  {
    id: 'owner-002',
    ownerName: 'Divya Narayan',
    openDeals: 29,
    wonDeals: 16,
    lostDeals: 8,
    pipelineValue: 17200000,
    weightedValue: 9620000,
    avgDealSize: 593103,
    winRate: 29.09,
    avgSalesCycleDays: 31,
  },
  {
    id: 'owner-003',
    ownerName: 'Karthik R',
    openDeals: 27,
    wonDeals: 13,
    lostDeals: 9,
    pipelineValue: 15100000,
    weightedValue: 7920000,
    avgDealSize: 559259,
    winRate: 23.64,
    avgSalesCycleDays: 36,
  },
  {
    id: 'owner-004',
    ownerName: 'Asha Menon',
    openDeals: 22,
    wonDeals: 11,
    lostDeals: 8,
    pipelineValue: 12400000,
    weightedValue: 6450000,
    avgDealSize: 563636,
    winRate: 22.45,
    avgSalesCycleDays: 38,
  },
  {
    id: 'owner-005',
    ownerName: 'Vignesh Kumar',
    openDeals: 18,
    wonDeals: 8,
    lostDeals: 7,
    pipelineValue: 10100000,
    weightedValue: 4890000,
    avgDealSize: 561111,
    winRate: 20.51,
    avgSalesCycleDays: 41,
  },
];

export const mockPipelineRegionPerformance: PipelineRegionPerformance[] = [
  {
    id: 'region-001',
    region: 'Whitefield',
    openDeals: 34,
    pipelineValue: 19600000,
    weightedValue: 11800000,
    wonDeals: 18,
    avgDealSize: 576471,
    winRate: 30.51,
    growthRate: 18.6,
  },
  {
    id: 'region-002',
    region: 'Sarjapur',
    openDeals: 29,
    pipelineValue: 17100000,
    weightedValue: 9680000,
    wonDeals: 16,
    avgDealSize: 589655,
    winRate: 28.57,
    growthRate: 16.1,
  },
  {
    id: 'region-003',
    region: 'Varthur',
    openDeals: 21,
    pipelineValue: 12600000,
    weightedValue: 6940000,
    wonDeals: 12,
    avgDealSize: 600000,
    winRate: 24.49,
    growthRate: 12.8,
  },
  {
    id: 'region-004',
    region: 'Hebbal',
    openDeals: 18,
    pipelineValue: 10400000,
    weightedValue: 5480000,
    wonDeals: 10,
    avgDealSize: 577778,
    winRate: 22.22,
    growthRate: 7.6,
  },
  {
    id: 'region-005',
    region: 'Electronic City',
    openDeals: 15,
    pipelineValue: 8600000,
    weightedValue: 3810000,
    wonDeals: 7,
    avgDealSize: 573333,
    winRate: 17.07,
    growthRate: -2.9,
  },
  {
    id: 'region-006',
    region: 'Begur Road',
    openDeals: 12,
    pipelineValue: 6900000,
    weightedValue: 3230000,
    wonDeals: 5,
    avgDealSize: 575000,
    winRate: 15.15,
    growthRate: -4.6,
  },
];

export const mockPipelineRiskDeals: PipelineRiskDeal[] = [
  {
    id: 'risk-001',
    dealTitle: 'Premium Villa Buyer Closure',
    clientName: 'Farooq Ali',
    region: 'Whitefield',
    stage: 'Negotiation',
    ownerName: 'Vignesh Kumar',
    dealValue: 15400000,
    probability: 78,
    weightedValue: 12012000,
    daysInStage: 19,
    expectedCloseDate: '2026-04-26',
    riskLevel: 'high',
    blocker: 'Price negotiation delayed by financing gap.',
  },
  {
    id: 'risk-002',
    dealTitle: 'Investor Plot Booking',
    clientName: 'Nisha Patel',
    region: 'Sarjapur',
    stage: 'Qualified',
    ownerName: 'Asha Menon',
    dealValue: 11600000,
    probability: 35,
    weightedValue: 4060000,
    daysInStage: 16,
    expectedCloseDate: '2026-05-05',
    riskLevel: 'medium',
    blocker: 'Client waiting for legal clarification and weekend visit.',
  },
  {
    id: 'risk-003',
    dealTitle: 'Ready-to-Move Apartment Deal',
    clientName: 'Sathish Babu',
    region: 'Varthur',
    stage: 'Site Visit',
    ownerName: 'Karthik R',
    dealValue: 9800000,
    probability: 55,
    weightedValue: 5390000,
    daysInStage: 14,
    expectedCloseDate: '2026-04-29',
    riskLevel: 'medium',
    blocker: 'Family decision pending after second visit.',
  },
  {
    id: 'risk-004',
    dealTitle: 'NRI Assisted Purchase',
    clientName: 'Arun Kumar',
    region: 'Hebbal',
    stage: 'Documentation',
    ownerName: 'Ravi Shankar',
    dealValue: 13200000,
    probability: 95,
    weightedValue: 12540000,
    daysInStage: 9,
    expectedCloseDate: '2026-04-21',
    riskLevel: 'low',
    blocker: 'Bank sanction letter awaited.',
  },
  {
    id: 'risk-005',
    dealTitle: 'Affordable Segment Closing',
    clientName: 'Priya M',
    region: 'Electronic City',
    stage: 'Qualified',
    ownerName: 'Sanjana Iyer',
    dealValue: 6400000,
    probability: 30,
    weightedValue: 1920000,
    daysInStage: 21,
    expectedCloseDate: '2026-05-02',
    riskLevel: 'high',
    blocker: 'Lead aging and delayed document collection.',
  },
];

export const mockPipelineAgingBuckets: PipelineAgingBucket[] = [
  {
    id: 'aging-001',
    bucket: '0 - 7 Days',
    deals: 46,
    percentage: 30.9,
    riskLevel: 'low',
  },
  {
    id: 'aging-002',
    bucket: '8 - 14 Days',
    deals: 39,
    percentage: 26.2,
    riskLevel: 'medium',
  },
  {
    id: 'aging-003',
    bucket: '15 - 21 Days',
    deals: 28,
    percentage: 18.8,
    riskLevel: 'medium',
  },
  {
    id: 'aging-004',
    bucket: '22 - 30 Days',
    deals: 21,
    percentage: 14.1,
    riskLevel: 'high',
  },
  {
    id: 'aging-005',
    bucket: '30+ Days',
    deals: 15,
    percentage: 10.0,
    riskLevel: 'high',
  },
];

export const mockPipelineInsights: PipelineInsight[] = [
  {
    id: 'insight-001',
    title: 'Negotiation and documentation stages hold the real revenue power',
    description:
      'A small group of late-stage deals drives a large share of the weighted pipeline, making execution discipline critical.',
    impact: 'positive',
    recommendation:
      'Run daily close-plan reviews for top late-stage deals and assign blocker owners clearly.',
  },
  {
    id: 'insight-002',
    title: 'Too many deals are getting stuck after qualification',
    description:
      'Mid-pipeline opportunities are aging faster than expected, especially before site visits and negotiation movement.',
    impact: 'warning',
    recommendation:
      'Strengthen field-visit scheduling workflows and automate follow-up reminders after qualification.',
  },
  {
    id: 'insight-003',
    title: 'South-side regions need sharper pipeline hygiene',
    description:
      'Electronic City and Begur Road carry weaker win rates and longer stagnation periods than top-performing zones.',
    impact: 'critical',
    recommendation:
      'Audit stalled deals, reassign high-risk opportunities, and reset close strategies by region.',
  },
  {
    id: 'insight-004',
    title: 'Pipeline quality is improving despite slower early stages',
    description:
      'Average deal size and weighted value are climbing, indicating stronger deal quality in the active funnel.',
    impact: 'neutral',
    recommendation:
      'Keep sourcing quality-first leads while tightening early-stage qualification speed.',
  },
];

export const mockPipelineAnalytics: PipelineAnalyticsDataset = {
  summary: pipelineAnalyticsSummary,
  metricCards: pipelineMetricCards,
  stagePerformance: mockPipelineStagePerformance,
  trend: mockPipelineTrend,
  ownerPerformance: mockPipelineOwnerPerformance,
  regionPerformance: mockPipelineRegionPerformance,
  riskDeals: mockPipelineRiskDeals,
  agingBuckets: mockPipelineAgingBuckets,
  insights: mockPipelineInsights,
};

export const pipelineMetricMap = pipelineMetricCards.reduce<
  Record<string, PipelineMetricCard>
>((acc, metric) => {
  acc[metric.key] = metric;
  return acc;
}, {});

export const getPipelineMetricByKey = (
  key: PipelineMetricCard['key'],
): PipelineMetricCard | undefined => {
  return pipelineMetricMap[key];
};

export const highlightedPipelineMetrics = pipelineMetricCards.filter(
  (metric) => metric.isHighlighted,
);

export const highRiskPipelineDeals = mockPipelineRiskDeals.filter(
  (deal) => deal.riskLevel === 'high',
);

export const criticalPipelineAgingBuckets = mockPipelineAgingBuckets.filter(
  (bucket) => bucket.riskLevel === 'high',
);

export default mockPipelineAnalytics;