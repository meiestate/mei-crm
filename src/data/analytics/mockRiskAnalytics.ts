// src/features/analytics/data/mockRiskAnalytics.ts

export type RiskTrendDirection = 'up' | 'down' | 'neutral';
export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskCategory =
  | 'Lead Risk'
  | 'Deal Risk'
  | 'Collection Risk'
  | 'Activity Risk'
  | 'Region Risk'
  | 'Source Risk'
  | 'Compliance Risk'
  | 'Forecast Risk';

export interface RiskTrend {
  value: string;
  direction: RiskTrendDirection;
  label: string;
}

export interface RiskAnalyticsSummary {
  totalRiskItems: number;
  criticalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  overallRiskScore: number;
  riskResolutionRate: number;
  forecastExposureValue: number;
}

export interface RiskMetricCard {
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
  trend: RiskTrend;
  updatedAt: string;
  target?: number;
  progress?: number;
  isHighlighted?: boolean;
}

export interface RiskDistributionPoint {
  id: string;
  severity: RiskSeverity;
  count: number;
  percentage: number;
  colorToken: string;
}

export interface RiskCategoryPerformance {
  id: string;
  category: RiskCategory;
  riskCount: number;
  criticalCount: number;
  exposureValue: number;
  avgResolutionDays: number;
  resolutionRate: number;
  trendDirection: RiskTrendDirection;
}

export interface RiskTrendPoint {
  id: string;
  label: string;
  date: string;
  totalRisks: number;
  criticalRisks: number;
  resolvedRisks: number;
  exposureValue: number;
}

export interface RiskRegionPerformance {
  id: string;
  region: string;
  totalRisks: number;
  criticalRisks: number;
  highRisks: number;
  exposureValue: number;
  riskScore: number;
  trendDirection: RiskTrendDirection;
}

export interface RiskOwnerPerformance {
  id: string;
  ownerName: string;
  assignedRiskItems: number;
  resolvedRiskItems: number;
  criticalItems: number;
  avgResolutionDays: number;
  resolutionRate: number;
  riskScore: number;
}

export interface RiskAlertItem {
  id: string;
  title: string;
  category: RiskCategory;
  severity: RiskSeverity;
  region: string;
  ownerName: string;
  relatedEntity: string;
  exposureValue: number;
  ageInDays: number;
  detectedAt: string;
  blocker: string;
  recommendedAction: string;
}

export interface RiskAgingBucket {
  id: string;
  bucket: string;
  count: number;
  percentage: number;
  severityLevel: RiskSeverity;
}

export interface RiskInsight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'warning' | 'critical' | 'neutral';
  recommendation: string;
}

export interface RiskAnalyticsDataset {
  summary: RiskAnalyticsSummary;
  metricCards: RiskMetricCard[];
  distribution: RiskDistributionPoint[];
  categoryPerformance: RiskCategoryPerformance[];
  trend: RiskTrendPoint[];
  regionPerformance: RiskRegionPerformance[];
  ownerPerformance: RiskOwnerPerformance[];
  alerts: RiskAlertItem[];
  agingBuckets: RiskAgingBucket[];
  insights: RiskInsight[];
}

export const riskAnalyticsSummary: RiskAnalyticsSummary = {
  totalRiskItems: 184,
  criticalRisks: 18,
  highRisks: 46,
  mediumRisks: 71,
  lowRisks: 49,
  overallRiskScore: 67.4,
  riskResolutionRate: 72.8,
  forecastExposureValue: 21400000,
};

export const riskMetricCards: RiskMetricCard[] = [
  {
    id: 'risk-total-items',
    key: 'totalRiskItems',
    title: 'Total Risk Items',
    value: '184',
    rawValue: 184,
    description: 'All currently tracked risk signals across leads, deals, collections, and operations.',
    icon: 'shield-alert',
    colorScheme: 'primary',
    trend: {
      value: '-6.1%',
      direction: 'down',
      label: 'risk volume reduced',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 150,
    progress: 76,
  },
  {
    id: 'risk-critical',
    key: 'criticalRisks',
    title: 'Critical Risks',
    value: '18',
    rawValue: 18,
    description: 'Highest severity risk items that could materially impact closures or cash flow.',
    icon: 'siren',
    colorScheme: 'danger',
    trend: {
      value: '-4',
      direction: 'down',
      label: 'fewer than last cycle',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 10,
    progress: 56,
    isHighlighted: true,
  },
  {
    id: 'risk-high',
    key: 'highRisks',
    title: 'High Risks',
    value: '46',
    rawValue: 46,
    description: 'High-priority items needing immediate owner action before escalation.',
    icon: 'alert-octagon',
    colorScheme: 'warning',
    trend: {
      value: '-7.2%',
      direction: 'down',
      label: 'backlog improving',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 35,
    progress: 68,
  },
  {
    id: 'risk-overall-score',
    key: 'overallRiskScore',
    title: 'Overall Risk Score',
    value: '67.4',
    rawValue: 67.4,
    description: 'Composite risk score measuring the current health of pipeline and operations.',
    icon: 'gauge',
    colorScheme: 'info',
    trend: {
      value: '-3.8 pts',
      direction: 'down',
      label: 'health improving',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 55,
    progress: 64,
    isHighlighted: true,
  },
  {
    id: 'risk-resolution-rate',
    key: 'riskResolutionRate',
    title: 'Resolution Rate',
    value: '72.8%',
    rawValue: 72.8,
    description: 'Percentage of identified risks resolved within the expected operating window.',
    icon: 'check-check',
    colorScheme: 'success',
    trend: {
      value: '+5.6%',
      direction: 'up',
      label: 'teams resolving faster',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 80,
    progress: 91,
    isHighlighted: true,
  },
  {
    id: 'risk-exposure',
    key: 'forecastExposureValue',
    title: 'Exposure Value',
    value: '₹2.14Cr',
    rawValue: 21400000,
    description: 'Estimated business value currently exposed to risk across active issues.',
    icon: 'triangle-alert',
    colorScheme: 'neutral',
    trend: {
      value: '-9.4%',
      direction: 'down',
      label: 'exposure shrinking',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 18000000,
    progress: 84,
  },
];

export const mockRiskDistribution: RiskDistributionPoint[] = [
  {
    id: 'dist-low',
    severity: 'low',
    count: 49,
    percentage: 26.6,
    colorToken: 'chart-green',
  },
  {
    id: 'dist-medium',
    severity: 'medium',
    count: 71,
    percentage: 38.6,
    colorToken: 'chart-blue',
  },
  {
    id: 'dist-high',
    severity: 'high',
    count: 46,
    percentage: 25.0,
    colorToken: 'chart-amber',
  },
  {
    id: 'dist-critical',
    severity: 'critical',
    count: 18,
    percentage: 9.8,
    colorToken: 'chart-red',
  },
];

export const mockRiskCategoryPerformance: RiskCategoryPerformance[] = [
  {
    id: 'cat-001',
    category: 'Lead Risk',
    riskCount: 34,
    criticalCount: 2,
    exposureValue: 2100000,
    avgResolutionDays: 4,
    resolutionRate: 78.4,
    trendDirection: 'down',
  },
  {
    id: 'cat-002',
    category: 'Deal Risk',
    riskCount: 41,
    criticalCount: 5,
    exposureValue: 7200000,
    avgResolutionDays: 7,
    resolutionRate: 69.2,
    trendDirection: 'down',
  },
  {
    id: 'cat-003',
    category: 'Collection Risk',
    riskCount: 28,
    criticalCount: 4,
    exposureValue: 5100000,
    avgResolutionDays: 9,
    resolutionRate: 66.4,
    trendDirection: 'neutral',
  },
  {
    id: 'cat-004',
    category: 'Activity Risk',
    riskCount: 22,
    criticalCount: 1,
    exposureValue: 900000,
    avgResolutionDays: 3,
    resolutionRate: 81.3,
    trendDirection: 'down',
  },
  {
    id: 'cat-005',
    category: 'Region Risk',
    riskCount: 19,
    criticalCount: 2,
    exposureValue: 1800000,
    avgResolutionDays: 6,
    resolutionRate: 71.0,
    trendDirection: 'neutral',
  },
  {
    id: 'cat-006',
    category: 'Source Risk',
    riskCount: 14,
    criticalCount: 1,
    exposureValue: 1200000,
    avgResolutionDays: 5,
    resolutionRate: 74.8,
    trendDirection: 'down',
  },
  {
    id: 'cat-007',
    category: 'Compliance Risk',
    riskCount: 11,
    criticalCount: 2,
    exposureValue: 1400000,
    avgResolutionDays: 10,
    resolutionRate: 63.6,
    trendDirection: 'up',
  },
  {
    id: 'cat-008',
    category: 'Forecast Risk',
    riskCount: 15,
    criticalCount: 1,
    exposureValue: 1700000,
    avgResolutionDays: 8,
    resolutionRate: 68.9,
    trendDirection: 'down',
  },
];

export const mockRiskTrend: RiskTrendPoint[] = [
  {
    id: 'risk-jan-2026',
    label: 'Jan',
    date: '2026-01',
    totalRisks: 214,
    criticalRisks: 24,
    resolvedRisks: 136,
    exposureValue: 25600000,
  },
  {
    id: 'risk-feb-2026',
    label: 'Feb',
    date: '2026-02',
    totalRisks: 203,
    criticalRisks: 22,
    resolvedRisks: 142,
    exposureValue: 24100000,
  },
  {
    id: 'risk-mar-2026',
    label: 'Mar',
    date: '2026-03',
    totalRisks: 196,
    criticalRisks: 20,
    resolvedRisks: 148,
    exposureValue: 22800000,
  },
  {
    id: 'risk-apr-2026',
    label: 'Apr',
    date: '2026-04',
    totalRisks: 184,
    criticalRisks: 18,
    resolvedRisks: 134,
    exposureValue: 21400000,
  },
];

export const mockRiskRegionPerformance: RiskRegionPerformance[] = [
  {
    id: 'region-001',
    region: 'Whitefield',
    totalRisks: 29,
    criticalRisks: 2,
    highRisks: 8,
    exposureValue: 3600000,
    riskScore: 61.2,
    trendDirection: 'down',
  },
  {
    id: 'region-002',
    region: 'Sarjapur',
    totalRisks: 26,
    criticalRisks: 3,
    highRisks: 7,
    exposureValue: 3300000,
    riskScore: 63.9,
    trendDirection: 'down',
  },
  {
    id: 'region-003',
    region: 'Varthur',
    totalRisks: 21,
    criticalRisks: 2,
    highRisks: 5,
    exposureValue: 2400000,
    riskScore: 64.4,
    trendDirection: 'neutral',
  },
  {
    id: 'region-004',
    region: 'Hebbal',
    totalRisks: 18,
    criticalRisks: 1,
    highRisks: 4,
    exposureValue: 2100000,
    riskScore: 59.7,
    trendDirection: 'down',
  },
  {
    id: 'region-005',
    region: 'Electronic City',
    totalRisks: 31,
    criticalRisks: 4,
    highRisks: 10,
    exposureValue: 4100000,
    riskScore: 74.6,
    trendDirection: 'up',
  },
  {
    id: 'region-006',
    region: 'Begur Road',
    totalRisks: 24,
    criticalRisks: 3,
    highRisks: 7,
    exposureValue: 2800000,
    riskScore: 72.8,
    trendDirection: 'up',
  },
  {
    id: 'region-007',
    region: 'HSR Layout',
    totalRisks: 17,
    criticalRisks: 1,
    highRisks: 3,
    exposureValue: 1900000,
    riskScore: 57.3,
    trendDirection: 'down',
  },
  {
    id: 'region-008',
    region: 'Koramangala',
    totalRisks: 18,
    criticalRisks: 2,
    highRisks: 2,
    exposureValue: 2200000,
    riskScore: 60.1,
    trendDirection: 'neutral',
  },
];

export const mockRiskOwnerPerformance: RiskOwnerPerformance[] = [
  {
    id: 'owner-001',
    ownerName: 'Ravi Shankar',
    assignedRiskItems: 34,
    resolvedRiskItems: 27,
    criticalItems: 3,
    avgResolutionDays: 5,
    resolutionRate: 79.4,
    riskScore: 59.1,
  },
  {
    id: 'owner-002',
    ownerName: 'Divya Narayan',
    assignedRiskItems: 31,
    resolvedRiskItems: 24,
    criticalItems: 2,
    avgResolutionDays: 6,
    resolutionRate: 77.4,
    riskScore: 60.8,
  },
  {
    id: 'owner-003',
    ownerName: 'Karthik R',
    assignedRiskItems: 29,
    resolvedRiskItems: 21,
    criticalItems: 4,
    avgResolutionDays: 7,
    resolutionRate: 72.4,
    riskScore: 66.2,
  },
  {
    id: 'owner-004',
    ownerName: 'Asha Menon',
    assignedRiskItems: 27,
    resolvedRiskItems: 19,
    criticalItems: 4,
    avgResolutionDays: 8,
    resolutionRate: 70.4,
    riskScore: 68.1,
  },
  {
    id: 'owner-005',
    ownerName: 'Vignesh Kumar',
    assignedRiskItems: 25,
    resolvedRiskItems: 16,
    criticalItems: 5,
    avgResolutionDays: 9,
    resolutionRate: 64.0,
    riskScore: 73.5,
  },
  {
    id: 'owner-006',
    ownerName: 'Sanjana Iyer',
    assignedRiskItems: 18,
    resolvedRiskItems: 13,
    criticalItems: 0,
    avgResolutionDays: 4,
    resolutionRate: 72.2,
    riskScore: 58.4,
  },
];

export const mockRiskAlerts: RiskAlertItem[] = [
  {
    id: 'alert-001',
    title: 'Late-Stage Deal Stagnation',
    category: 'Deal Risk',
    severity: 'critical',
    region: 'Electronic City',
    ownerName: 'Vignesh Kumar',
    relatedEntity: 'Affordable Segment Closing',
    exposureValue: 2100000,
    ageInDays: 19,
    detectedAt: '2026-04-03T10:15:00.000Z',
    blocker: 'Repeated buyer delay and financing not confirmed.',
    recommendedAction: 'Escalate to sales head and rework payment structure within 24 hours.',
  },
  {
    id: 'alert-002',
    title: 'Overdue Collection Exposure',
    category: 'Collection Risk',
    severity: 'critical',
    region: 'Varthur',
    ownerName: 'Ravi Shankar',
    relatedEntity: 'Varthur Site Closure Balance',
    exposureValue: 340000,
    ageInDays: 15,
    detectedAt: '2026-04-02T08:40:00.000Z',
    blocker: 'Client has delayed final transfer beyond due date.',
    recommendedAction: 'Trigger collection escalation and structured follow-up plan immediately.',
  },
  {
    id: 'alert-003',
    title: 'Portal Lead Quality Decline',
    category: 'Source Risk',
    severity: 'high',
    region: 'Begur Road',
    ownerName: 'Asha Menon',
    relatedEntity: 'Property Portal Campaign Cluster',
    exposureValue: 680000,
    ageInDays: 11,
    detectedAt: '2026-04-06T12:20:00.000Z',
    blocker: 'Low-intent inquiries increasing qualification waste.',
    recommendedAction: 'Tighten listing filters and shift budget to higher-intent source groups.',
  },
  {
    id: 'alert-004',
    title: 'Compliance Document Delay',
    category: 'Compliance Risk',
    severity: 'high',
    region: 'Sarjapur',
    ownerName: 'Divya Narayan',
    relatedEntity: 'Investor Plot Booking',
    exposureValue: 1200000,
    ageInDays: 13,
    detectedAt: '2026-04-04T15:10:00.000Z',
    blocker: 'Approval copy and legal verification still pending.',
    recommendedAction: 'Fast-track legal review and lock documentation deadline with builder.',
  },
  {
    id: 'alert-005',
    title: 'Follow-up Breakdown on Warm Leads',
    category: 'Lead Risk',
    severity: 'medium',
    region: 'Whitefield',
    ownerName: 'Karthik R',
    relatedEntity: 'Warm Lead Segment - Tower B',
    exposureValue: 540000,
    ageInDays: 7,
    detectedAt: '2026-04-10T09:30:00.000Z',
    blocker: 'Lead touches slowed after first interaction.',
    recommendedAction: 'Reassign stale leads into rapid recovery cadence.',
  },
  {
    id: 'alert-006',
    title: 'Regional Conversion Slippage',
    category: 'Region Risk',
    severity: 'high',
    region: 'Electronic City',
    ownerName: 'Sanjana Iyer',
    relatedEntity: 'Electronic City Opportunity Pool',
    exposureValue: 1450000,
    ageInDays: 16,
    detectedAt: '2026-04-01T11:55:00.000Z',
    blocker: 'Visit-to-closure ratio is weakening in the zone.',
    recommendedAction: 'Audit local pitch quality, pricing alignment, and site-visit handling.',
  },
  {
    id: 'alert-007',
    title: 'Forecast Confidence Gap',
    category: 'Forecast Risk',
    severity: 'medium',
    region: 'Koramangala',
    ownerName: 'Asha Menon',
    relatedEntity: 'May Revenue Forecast',
    exposureValue: 910000,
    ageInDays: 6,
    detectedAt: '2026-04-11T14:05:00.000Z',
    blocker: 'Committed pipeline coverage is below forecast assumption.',
    recommendedAction: 'Reduce forecast optimism and improve weighted revenue mapping.',
  },
  {
    id: 'alert-008',
    title: 'Missed Activity SLA',
    category: 'Activity Risk',
    severity: 'low',
    region: 'HSR Layout',
    ownerName: 'Divya Narayan',
    relatedEntity: 'Daily Follow-up Queue',
    exposureValue: 180000,
    ageInDays: 3,
    detectedAt: '2026-04-14T18:20:00.000Z',
    blocker: 'A cluster of calls and follow-up tasks missed SLA.',
    recommendedAction: 'Rebalance task queue and activate automated reminders.',
  },
];

export const mockRiskAgingBuckets: RiskAgingBucket[] = [
  {
    id: 'aging-001',
    bucket: '0 - 3 Days',
    count: 42,
    percentage: 22.8,
    severityLevel: 'low',
  },
  {
    id: 'aging-002',
    bucket: '4 - 7 Days',
    count: 51,
    percentage: 27.7,
    severityLevel: 'medium',
  },
  {
    id: 'aging-003',
    bucket: '8 - 14 Days',
    count: 47,
    percentage: 25.5,
    severityLevel: 'high',
  },
  {
    id: 'aging-004',
    bucket: '15 - 21 Days',
    count: 26,
    percentage: 14.1,
    severityLevel: 'high',
  },
  {
    id: 'aging-005',
    bucket: '21+ Days',
    count: 18,
    percentage: 9.8,
    severityLevel: 'critical',
  },
];

export const mockRiskInsights: RiskInsight[] = [
  {
    id: 'insight-001',
    title: 'Risk inventory is declining overall',
    description:
      'Total risk items and critical exposure have both trended down for four consecutive months, signaling healthier controls.',
    impact: 'positive',
    recommendation:
      'Keep weekly risk review discipline and continue owner-level accountability scoring.',
  },
  {
    id: 'insight-002',
    title: 'Collections and late-stage deals remain the biggest exposure pockets',
    description:
      'A relatively small number of collection and negotiation issues represent a disproportionate share of value at risk.',
    impact: 'critical',
    recommendation:
      'Prioritize top-value cases with executive escalation and daily blocker tracking.',
  },
  {
    id: 'insight-003',
    title: 'Electronic City and Begur Road need immediate operational correction',
    description:
      'These zones carry elevated risk scores, higher critical counts, and worsening directional movement.',
    impact: 'warning',
    recommendation:
      'Run a regional risk audit focused on lead quality, pricing fit, and owner performance.',
  },
  {
    id: 'insight-004',
    title: 'Compliance and forecast risks are quieter but dangerous',
    description:
      'These categories show lower volume, yet their resolution speed is weaker and downstream impact can spike suddenly.',
    impact: 'neutral',
    recommendation:
      'Set tighter review checklists and early-warning triggers for non-sales risk categories.',
  },
];

export const mockRiskAnalytics: RiskAnalyticsDataset = {
  summary: riskAnalyticsSummary,
  metricCards: riskMetricCards,
  distribution: mockRiskDistribution,
  categoryPerformance: mockRiskCategoryPerformance,
  trend: mockRiskTrend,
  regionPerformance: mockRiskRegionPerformance,
  ownerPerformance: mockRiskOwnerPerformance,
  alerts: mockRiskAlerts,
  agingBuckets: mockRiskAgingBuckets,
  insights: mockRiskInsights,
};

export const riskMetricMap = riskMetricCards.reduce<
  Record<string, RiskMetricCard>
>((acc, metric) => {
  acc[metric.key] = metric;
  return acc;
}, {});

export const getRiskMetricByKey = (
  key: RiskMetricCard['key'],
): RiskMetricCard | undefined => {
  return riskMetricMap[key];
};

export const highlightedRiskMetrics = riskMetricCards.filter(
  (metric) => metric.isHighlighted,
);

export const criticalRiskAlerts = mockRiskAlerts.filter(
  (alert) => alert.severity === 'critical',
);

export const highAndCriticalRiskAlerts = mockRiskAlerts.filter(
  (alert) => alert.severity === 'high' || alert.severity === 'critical',
);

export const criticalRiskAgingBuckets = mockRiskAgingBuckets.filter(
  (bucket) => bucket.severityLevel === 'critical' || bucket.severityLevel === 'high',
);

export default mockRiskAnalytics;