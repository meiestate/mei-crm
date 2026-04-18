// src/features/analytics/data/mockLeadAnalytics.ts

export type LeadTrendDirection = 'up' | 'down' | 'neutral';
export type LeadQualityLevel = 'hot' | 'warm' | 'cold';
export type LeadPriorityLevel = 'high' | 'medium' | 'low';
export type LeadSourceType =
  | 'Meta Ads'
  | 'Google Ads'
  | 'Broker Referral'
  | 'Direct Walk-in'
  | 'Website'
  | 'WhatsApp'
  | 'Property Portal'
  | 'Call Campaign';

export interface LeadTrend {
  value: string;
  direction: LeadTrendDirection;
  label: string;
}

export interface LeadAnalyticsSummary {
  totalLeads: number;
  qualifiedLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  avgResponseTimeMinutes: number;
  avgQualificationRate: number;
  avgConversionRate: number;
}

export interface LeadMetricCard {
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
  trend: LeadTrend;
  updatedAt: string;
  target?: number;
  progress?: number;
  isHighlighted?: boolean;
}

export interface LeadVolumePoint {
  id: string;
  label: string;
  date: string;
  totalLeads: number;
  qualifiedLeads: number;
  hotLeads: number;
  convertedLeads: number;
}

export interface LeadSourcePerformance {
  id: string;
  source: LeadSourceType;
  leads: number;
  qualifiedLeads: number;
  siteVisits: number;
  dealsClosed: number;
  spend: number;
  revenue: number;
  costPerLead: number;
  costPerQualifiedLead: number;
  conversionRate: number;
  qualificationRate: number;
  roi: number;
}

export interface LeadStageDistribution {
  id: string;
  stage: string;
  leads: number;
  percentage: number;
  colorToken: string;
}

export interface LeadQualityDistribution {
  id: string;
  quality: LeadQualityLevel;
  leads: number;
  percentage: number;
  avgResponseTimeMinutes: number;
  conversionRate: number;
}

export interface LeadOwnerPerformance {
  id: string;
  ownerName: string;
  assignedLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  siteVisits: number;
  dealsClosed: number;
  conversionRate: number;
  avgResponseTimeMinutes: number;
}

export interface LeadRegionPerformance {
  id: string;
  region: string;
  leads: number;
  qualifiedLeads: number;
  siteVisits: number;
  dealsClosed: number;
  conversionRate: number;
  growthRate: number;
}

export interface LeadAgingBucket {
  id: string;
  bucket: string;
  leads: number;
  percentage: number;
  riskLevel: LeadPriorityLevel;
}

export interface LeadInsight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'warning' | 'critical' | 'neutral';
  recommendation: string;
}

export interface LeadAnalyticsDataset {
  summary: LeadAnalyticsSummary;
  metricCards: LeadMetricCard[];
  leadVolumeTrend: LeadVolumePoint[];
  sourcePerformance: LeadSourcePerformance[];
  stageDistribution: LeadStageDistribution[];
  qualityDistribution: LeadQualityDistribution[];
  ownerPerformance: LeadOwnerPerformance[];
  regionPerformance: LeadRegionPerformance[];
  agingBuckets: LeadAgingBucket[];
  insights: LeadInsight[];
}

export const leadAnalyticsSummary: LeadAnalyticsSummary = {
  totalLeads: 2486,
  qualifiedLeads: 1324,
  hotLeads: 312,
  warmLeads: 884,
  coldLeads: 1290,
  avgResponseTimeMinutes: 18,
  avgQualificationRate: 53.3,
  avgConversionRate: 11.8,
};

export const leadMetricCards: LeadMetricCard[] = [
  {
    id: 'lead-total',
    key: 'totalLeads',
    title: 'Total Leads',
    value: '2,486',
    rawValue: 2486,
    description: 'All new and existing inbound leads across the selected date range.',
    icon: 'users',
    colorScheme: 'primary',
    trend: {
      value: '+13.4%',
      direction: 'up',
      label: 'vs previous period',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 3000,
    progress: 83,
    isHighlighted: true,
  },
  {
    id: 'lead-qualified',
    key: 'qualifiedLeads',
    title: 'Qualified Leads',
    value: '1,324',
    rawValue: 1324,
    description: 'Leads validated based on need, budget, location fit, and buying intent.',
    icon: 'badge-check',
    colorScheme: 'success',
    trend: {
      value: '+10.2%',
      direction: 'up',
      label: 'qualification efficiency improved',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 1500,
    progress: 88,
    isHighlighted: true,
  },
  {
    id: 'lead-hot',
    key: 'hotLeads',
    title: 'Hot Leads',
    value: '312',
    rawValue: 312,
    description: 'High-intent leads likely to convert with immediate follow-up and field action.',
    icon: 'flame',
    colorScheme: 'warning',
    trend: {
      value: '+8.7%',
      direction: 'up',
      label: 'sales-ready pipeline growing',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 400,
    progress: 78,
  },
  {
    id: 'lead-response-time',
    key: 'avgResponseTimeMinutes',
    title: 'Avg Response Time',
    value: '18 mins',
    rawValue: 18,
    description: 'Average time taken to contact a lead after capture.',
    icon: 'clock-3',
    colorScheme: 'info',
    trend: {
      value: '-5 mins',
      direction: 'down',
      label: 'faster than last cycle',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 10,
    progress: 56,
  },
  {
    id: 'lead-qualification-rate',
    key: 'avgQualificationRate',
    title: 'Qualification Rate',
    value: '53.3%',
    rawValue: 53.3,
    description: 'Percentage of captured leads turning into sales-qualified opportunities.',
    icon: 'filter',
    colorScheme: 'neutral',
    trend: {
      value: '+2.6%',
      direction: 'up',
      label: 'better targeting quality',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 60,
    progress: 89,
  },
  {
    id: 'lead-conversion-rate',
    key: 'avgConversionRate',
    title: 'Lead Conversion',
    value: '11.8%',
    rawValue: 11.8,
    description: 'Lead-to-deal conversion ratio across all channels and owners.',
    icon: 'target',
    colorScheme: 'danger',
    trend: {
      value: '+1.4%',
      direction: 'up',
      label: 'closing efficiency improved',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 15,
    progress: 79,
    isHighlighted: true,
  },
];

export const mockLeadVolumeTrend: LeadVolumePoint[] = [
  {
    id: 'lead-jan-2026',
    label: 'Jan',
    date: '2026-01',
    totalLeads: 612,
    qualifiedLeads: 312,
    hotLeads: 76,
    convertedLeads: 61,
  },
  {
    id: 'lead-feb-2026',
    label: 'Feb',
    date: '2026-02',
    totalLeads: 684,
    qualifiedLeads: 356,
    hotLeads: 84,
    convertedLeads: 73,
  },
  {
    id: 'lead-mar-2026',
    label: 'Mar',
    date: '2026-03',
    totalLeads: 742,
    qualifiedLeads: 401,
    hotLeads: 96,
    convertedLeads: 88,
  },
  {
    id: 'lead-apr-2026',
    label: 'Apr',
    date: '2026-04',
    totalLeads: 448,
    qualifiedLeads: 255,
    hotLeads: 56,
    convertedLeads: 41,
  },
];

export const mockLeadSourcePerformance: LeadSourcePerformance[] = [
  {
    id: 'source-001',
    source: 'Meta Ads',
    leads: 624,
    qualifiedLeads: 318,
    siteVisits: 124,
    dealsClosed: 39,
    spend: 285000,
    revenue: 14800000,
    costPerLead: 456.73,
    costPerQualifiedLead: 896.23,
    conversionRate: 6.25,
    qualificationRate: 50.96,
    roi: 50.93,
  },
  {
    id: 'source-002',
    source: 'Google Ads',
    leads: 482,
    qualifiedLeads: 274,
    siteVisits: 109,
    dealsClosed: 34,
    spend: 248000,
    revenue: 13100000,
    costPerLead: 514.52,
    costPerQualifiedLead: 905.11,
    conversionRate: 7.05,
    qualificationRate: 56.85,
    roi: 51.82,
  },
  {
    id: 'source-003',
    source: 'Broker Referral',
    leads: 276,
    qualifiedLeads: 192,
    siteVisits: 96,
    dealsClosed: 41,
    spend: 92000,
    revenue: 18600000,
    costPerLead: 333.33,
    costPerQualifiedLead: 479.17,
    conversionRate: 14.86,
    qualificationRate: 69.57,
    roi: 201.17,
  },
  {
    id: 'source-004',
    source: 'Direct Walk-in',
    leads: 144,
    qualifiedLeads: 101,
    siteVisits: 58,
    dealsClosed: 19,
    spend: 18000,
    revenue: 7600000,
    costPerLead: 125,
    costPerQualifiedLead: 178.22,
    conversionRate: 13.19,
    qualificationRate: 70.14,
    roi: 421.22,
  },
  {
    id: 'source-005',
    source: 'Website',
    leads: 298,
    qualifiedLeads: 162,
    siteVisits: 67,
    dealsClosed: 18,
    spend: 64000,
    revenue: 6700000,
    costPerLead: 214.77,
    costPerQualifiedLead: 395.06,
    conversionRate: 6.04,
    qualificationRate: 54.36,
    roi: 103.69,
  },
  {
    id: 'source-006',
    source: 'WhatsApp',
    leads: 212,
    qualifiedLeads: 108,
    siteVisits: 46,
    dealsClosed: 12,
    spend: 24000,
    revenue: 4200000,
    costPerLead: 113.21,
    costPerQualifiedLead: 222.22,
    conversionRate: 5.66,
    qualificationRate: 50.94,
    roi: 174,
  },
  {
    id: 'source-007',
    source: 'Property Portal',
    leads: 286,
    qualifiedLeads: 123,
    siteVisits: 52,
    dealsClosed: 11,
    spend: 138000,
    revenue: 3900000,
    costPerLead: 482.52,
    costPerQualifiedLead: 1121.95,
    conversionRate: 3.85,
    qualificationRate: 43.01,
    roi: 27.26,
  },
  {
    id: 'source-008',
    source: 'Call Campaign',
    leads: 164,
    qualifiedLeads: 46,
    siteVisits: 17,
    dealsClosed: 4,
    spend: 42000,
    revenue: 1300000,
    costPerLead: 256.1,
    costPerQualifiedLead: 913.04,
    conversionRate: 2.44,
    qualificationRate: 28.05,
    roi: 29.95,
  },
];

export const mockLeadStageDistribution: LeadStageDistribution[] = [
  {
    id: 'stage-001',
    stage: 'New',
    leads: 684,
    percentage: 27.5,
    colorToken: 'chart-blue',
  },
  {
    id: 'stage-002',
    stage: 'Contacted',
    leads: 542,
    percentage: 21.8,
    colorToken: 'chart-cyan',
  },
  {
    id: 'stage-003',
    stage: 'Qualified',
    leads: 398,
    percentage: 16.0,
    colorToken: 'chart-amber',
  },
  {
    id: 'stage-004',
    stage: 'Site Visit',
    leads: 264,
    percentage: 10.6,
    colorToken: 'chart-purple',
  },
  {
    id: 'stage-005',
    stage: 'Negotiation',
    leads: 176,
    percentage: 7.1,
    colorToken: 'chart-green',
  },
  {
    id: 'stage-006',
    stage: 'Won',
    leads: 146,
    percentage: 5.9,
    colorToken: 'chart-emerald',
  },
  {
    id: 'stage-007',
    stage: 'Lost',
    leads: 276,
    percentage: 11.1,
    colorToken: 'chart-red',
  },
];

export const mockLeadQualityDistribution: LeadQualityDistribution[] = [
  {
    id: 'quality-001',
    quality: 'hot',
    leads: 312,
    percentage: 12.6,
    avgResponseTimeMinutes: 7,
    conversionRate: 31.4,
  },
  {
    id: 'quality-002',
    quality: 'warm',
    leads: 884,
    percentage: 35.6,
    avgResponseTimeMinutes: 16,
    conversionRate: 12.8,
  },
  {
    id: 'quality-003',
    quality: 'cold',
    leads: 1290,
    percentage: 51.8,
    avgResponseTimeMinutes: 29,
    conversionRate: 2.6,
  },
];

export const mockLeadOwnerPerformance: LeadOwnerPerformance[] = [
  {
    id: 'owner-001',
    ownerName: 'Ravi Shankar',
    assignedLeads: 324,
    contactedLeads: 301,
    qualifiedLeads: 174,
    siteVisits: 78,
    dealsClosed: 24,
    conversionRate: 7.41,
    avgResponseTimeMinutes: 9,
  },
  {
    id: 'owner-002',
    ownerName: 'Divya Narayan',
    assignedLeads: 298,
    contactedLeads: 275,
    qualifiedLeads: 168,
    siteVisits: 72,
    dealsClosed: 22,
    conversionRate: 7.38,
    avgResponseTimeMinutes: 11,
  },
  {
    id: 'owner-003',
    ownerName: 'Karthik R',
    assignedLeads: 276,
    contactedLeads: 248,
    qualifiedLeads: 139,
    siteVisits: 61,
    dealsClosed: 19,
    conversionRate: 6.88,
    avgResponseTimeMinutes: 15,
  },
  {
    id: 'owner-004',
    ownerName: 'Asha Menon',
    assignedLeads: 242,
    contactedLeads: 221,
    qualifiedLeads: 121,
    siteVisits: 48,
    dealsClosed: 16,
    conversionRate: 6.61,
    avgResponseTimeMinutes: 17,
  },
  {
    id: 'owner-005',
    ownerName: 'Vignesh Kumar',
    assignedLeads: 208,
    contactedLeads: 181,
    qualifiedLeads: 93,
    siteVisits: 37,
    dealsClosed: 12,
    conversionRate: 5.77,
    avgResponseTimeMinutes: 22,
  },
];

export const mockLeadRegionPerformance: LeadRegionPerformance[] = [
  {
    id: 'region-001',
    region: 'Whitefield',
    leads: 402,
    qualifiedLeads: 236,
    siteVisits: 101,
    dealsClosed: 31,
    conversionRate: 7.71,
    growthRate: 16.2,
  },
  {
    id: 'region-002',
    region: 'Sarjapur',
    leads: 356,
    qualifiedLeads: 201,
    siteVisits: 89,
    dealsClosed: 27,
    conversionRate: 7.58,
    growthRate: 14.6,
  },
  {
    id: 'region-003',
    region: 'Varthur',
    leads: 284,
    qualifiedLeads: 152,
    siteVisits: 63,
    dealsClosed: 18,
    conversionRate: 6.34,
    growthRate: 11.3,
  },
  {
    id: 'region-004',
    region: 'Hebbal',
    leads: 236,
    qualifiedLeads: 128,
    siteVisits: 57,
    dealsClosed: 16,
    conversionRate: 6.78,
    growthRate: 8.9,
  },
  {
    id: 'region-005',
    region: 'Electronic City',
    leads: 298,
    qualifiedLeads: 141,
    siteVisits: 52,
    dealsClosed: 12,
    conversionRate: 4.03,
    growthRate: -2.4,
  },
  {
    id: 'region-006',
    region: 'Begur Road',
    leads: 192,
    qualifiedLeads: 88,
    siteVisits: 31,
    dealsClosed: 8,
    conversionRate: 4.17,
    growthRate: -4.1,
  },
];

export const mockLeadAgingBuckets: LeadAgingBucket[] = [
  {
    id: 'aging-001',
    bucket: '0 - 1 Day',
    leads: 421,
    percentage: 16.9,
    riskLevel: 'low',
  },
  {
    id: 'aging-002',
    bucket: '2 - 3 Days',
    leads: 632,
    percentage: 25.4,
    riskLevel: 'medium',
  },
  {
    id: 'aging-003',
    bucket: '4 - 7 Days',
    leads: 704,
    percentage: 28.3,
    riskLevel: 'medium',
  },
  {
    id: 'aging-004',
    bucket: '8 - 14 Days',
    leads: 438,
    percentage: 17.6,
    riskLevel: 'high',
  },
  {
    id: 'aging-005',
    bucket: '15+ Days',
    leads: 291,
    percentage: 11.8,
    riskLevel: 'high',
  },
];

export const mockLeadInsights: LeadInsight[] = [
  {
    id: 'insight-001',
    title: 'Broker referrals are the most efficient source',
    description:
      'Broker Referral channel is delivering the strongest qualification and deal conversion with the healthiest ROI.',
    impact: 'positive',
    recommendation:
      'Scale broker onboarding and incentivize top-performing channel partners by zone.',
  },
  {
    id: 'insight-002',
    title: 'Property Portal leads need better filtering',
    description:
      'Lead volume is decent, but qualification and conversion are significantly weaker than other channels.',
    impact: 'warning',
    recommendation:
      'Refine portal listing quality, response templates, and pre-qualification scripts.',
  },
  {
    id: 'insight-003',
    title: 'Aging leads are becoming silent leak points',
    description:
      'Nearly 29.4% of leads are older than 8 days, increasing drop-off risk and slowing pipeline freshness.',
    impact: 'critical',
    recommendation:
      'Create an overdue lead rescue workflow with auto-reminders and reassignment rules.',
  },
  {
    id: 'insight-004',
    title: 'Fast response is directly tied to hot-lead closure',
    description:
      'Hot leads contacted within 10 minutes are converting at a much stronger rate than slower responses.',
    impact: 'positive',
    recommendation:
      'Prioritize speed-to-lead workflows for premium and high-intent inquiries.',
  },
];

export const mockLeadAnalytics: LeadAnalyticsDataset = {
  summary: leadAnalyticsSummary,
  metricCards: leadMetricCards,
  leadVolumeTrend: mockLeadVolumeTrend,
  sourcePerformance: mockLeadSourcePerformance,
  stageDistribution: mockLeadStageDistribution,
  qualityDistribution: mockLeadQualityDistribution,
  ownerPerformance: mockLeadOwnerPerformance,
  regionPerformance: mockLeadRegionPerformance,
  agingBuckets: mockLeadAgingBuckets,
  insights: mockLeadInsights,
};

export const leadMetricMap = leadMetricCards.reduce<Record<string, LeadMetricCard>>(
  (acc, metric) => {
    acc[metric.key] = metric;
    return acc;
  },
  {},
);

export const getLeadMetricByKey = (
  key: LeadMetricCard['key'],
): LeadMetricCard | undefined => {
  return leadMetricMap[key];
};

export const highlightedLeadMetrics = leadMetricCards.filter(
  (metric) => metric.isHighlighted,
);

export const topLeadSources = [...mockLeadSourcePerformance]
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5);

export const highRiskLeadAgingBuckets = mockLeadAgingBuckets.filter(
  (bucket) => bucket.riskLevel === 'high',
);

export default mockLeadAnalytics;