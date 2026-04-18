// src/features/analytics/data/mockGeoAnalytics.ts

export type GeoTrendDirection = 'up' | 'down' | 'neutral';
export type GeoPerformanceLevel = 'excellent' | 'good' | 'average' | 'poor';
export type GeoPriorityLevel = 'high' | 'medium' | 'low';

export interface GeoTrend {
  value: string;
  direction: GeoTrendDirection;
  label: string;
}

export interface GeoAnalyticsSummary {
  totalRegions: number;
  activeRegions: number;
  topPerformingRegion: string;
  weakestPerformingRegion: string;
  totalRevenue: number;
  totalLeads: number;
  avgConversionRate: number;
  avgSiteVisitRate: number;
}

export interface GeoMetricCard {
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
  trend: GeoTrend;
  updatedAt: string;
  target?: number;
  progress?: number;
  isHighlighted?: boolean;
}

export interface GeoRegionPerformance {
  id: string;
  code: string;
  region: string;
  city: string;
  zone: string;
  latitude?: number;
  longitude?: number;
  leads: number;
  qualifiedLeads: number;
  siteVisits: number;
  dealsClosed: number;
  activeDeals: number;
  lostDeals: number;
  revenue: number;
  pipelineValue: number;
  avgDealValue: number;
  conversionRate: number;
  siteVisitRate: number;
  closeRate: number;
  responseTimeHours: number;
  growthRate: number;
  performanceLevel: GeoPerformanceLevel;
  priorityLevel: GeoPriorityLevel;
  managerName: string;
  topProject: string;
}

export interface GeoHeatmapPoint {
  id: string;
  label: string;
  city: string;
  zone: string;
  latitude: number;
  longitude: number;
  intensity: number;
  leads: number;
  revenue: number;
  conversionRate: number;
}

export interface GeoCityDistribution {
  id: string;
  city: string;
  regionsCovered: number;
  leads: number;
  dealsClosed: number;
  revenue: number;
  pipelineValue: number;
  conversionRate: number;
  growthRate: number;
}

export interface GeoZoneComparison {
  id: string;
  zone: string;
  leads: number;
  siteVisits: number;
  dealsClosed: number;
  revenue: number;
  avgDealValue: number;
  conversionRate: number;
}

export interface GeoOpportunityArea {
  id: string;
  area: string;
  city: string;
  reason: string;
  opportunityScore: number;
  expectedRevenue: number;
  recommendedAction: string;
  priorityLevel: GeoPriorityLevel;
}

export interface GeoInsight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'warning' | 'critical' | 'neutral';
  recommendation: string;
}

export interface GeoAnalyticsDataset {
  summary: GeoAnalyticsSummary;
  metricCards: GeoMetricCard[];
  regions: GeoRegionPerformance[];
  heatmapPoints: GeoHeatmapPoint[];
  cityDistribution: GeoCityDistribution[];
  zoneComparison: GeoZoneComparison[];
  opportunityAreas: GeoOpportunityArea[];
  insights: GeoInsight[];
}

export const geoAnalyticsSummary: GeoAnalyticsSummary = {
  totalRegions: 12,
  activeRegions: 10,
  topPerformingRegion: 'Whitefield East',
  weakestPerformingRegion: 'South Bangalore Core',
  totalRevenue: 52800000,
  totalLeads: 1846,
  avgConversionRate: 16.9,
  avgSiteVisitRate: 41.7,
};

export const geoMetricCards: GeoMetricCard[] = [
  {
    id: 'geo-total-regions',
    key: 'totalRegions',
    title: 'Tracked Regions',
    value: '12',
    rawValue: 12,
    description: 'Total city zones and micro-markets monitored in the geo analytics dashboard.',
    icon: 'map',
    colorScheme: 'primary',
    trend: {
      value: '+2',
      direction: 'up',
      label: 'new regions added',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 15,
    progress: 80,
  },
  {
    id: 'geo-total-leads',
    key: 'totalLeads',
    title: 'Geo Leads',
    value: '1,846',
    rawValue: 1846,
    description: 'Leads distributed across all active localities and zones.',
    icon: 'users',
    colorScheme: 'info',
    trend: {
      value: '+11.4%',
      direction: 'up',
      label: 'vs last month',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 2200,
    progress: 84,
    isHighlighted: true,
  },
  {
    id: 'geo-total-revenue',
    key: 'totalRevenue',
    title: 'Region Revenue',
    value: '₹5.28Cr',
    rawValue: 52800000,
    description: 'Closed revenue contribution from all mapped zones.',
    icon: 'indian-rupee',
    colorScheme: 'success',
    trend: {
      value: '+15.6%',
      direction: 'up',
      label: 'vs previous quarter',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 65000000,
    progress: 81,
    isHighlighted: true,
  },
  {
    id: 'geo-conversion-rate',
    key: 'avgConversionRate',
    title: 'Avg Conversion',
    value: '16.9%',
    rawValue: 16.9,
    description: 'Average lead-to-close conversion across covered regions.',
    icon: 'target',
    colorScheme: 'warning',
    trend: {
      value: '+1.8%',
      direction: 'up',
      label: 'improved from last cycle',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 20,
    progress: 85,
  },
  {
    id: 'geo-site-visit-rate',
    key: 'avgSiteVisitRate',
    title: 'Avg Site Visit Rate',
    value: '41.7%',
    rawValue: 41.7,
    description: 'Share of leads successfully converted into site visits.',
    icon: 'map-pinned',
    colorScheme: 'neutral',
    trend: {
      value: '+3.4%',
      direction: 'up',
      label: 'sales field activity stronger',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 50,
    progress: 83,
  },
  {
    id: 'geo-active-regions',
    key: 'activeRegions',
    title: 'Active Regions',
    value: '10',
    rawValue: 10,
    description: 'Regions currently contributing active pipeline or closures.',
    icon: 'radar',
    colorScheme: 'danger',
    trend: {
      value: '-1',
      direction: 'down',
      label: 'one zone cooling off',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 12,
    progress: 83,
  },
];

export const mockGeoRegions: GeoRegionPerformance[] = [
  {
    id: 'geo-region-001',
    code: 'BLR-WFD-E',
    region: 'Whitefield East',
    city: 'Bangalore',
    zone: 'East Bangalore',
    latitude: 12.9698,
    longitude: 77.7500,
    leads: 284,
    qualifiedLeads: 176,
    siteVisits: 118,
    dealsClosed: 34,
    activeDeals: 21,
    lostDeals: 17,
    revenue: 12800000,
    pipelineValue: 19600000,
    avgDealValue: 376470,
    conversionRate: 12.0,
    siteVisitRate: 41.5,
    closeRate: 19.3,
    responseTimeHours: 1.9,
    growthRate: 18.6,
    performanceLevel: 'excellent',
    priorityLevel: 'high',
    managerName: 'Ravi Shankar',
    topProject: 'Prestige Lakeside Habitat',
  },
  {
    id: 'geo-region-002',
    code: 'BLR-SRJ',
    region: 'Sarjapur Growth Belt',
    city: 'Bangalore',
    zone: 'South-East Bangalore',
    latitude: 12.8856,
    longitude: 77.6770,
    leads: 246,
    qualifiedLeads: 149,
    siteVisits: 102,
    dealsClosed: 27,
    activeDeals: 19,
    lostDeals: 21,
    revenue: 10200000,
    pipelineValue: 17100000,
    avgDealValue: 377778,
    conversionRate: 11.0,
    siteVisitRate: 41.5,
    closeRate: 18.1,
    responseTimeHours: 2.4,
    growthRate: 16.1,
    performanceLevel: 'excellent',
    priorityLevel: 'high',
    managerName: 'Divya Narayan',
    topProject: 'Godrej Woodland',
  },
  {
    id: 'geo-region-003',
    code: 'BLR-VRT',
    region: 'Varthur Corridor',
    city: 'Bangalore',
    zone: 'East Bangalore',
    latitude: 12.9407,
    longitude: 77.7473,
    leads: 198,
    qualifiedLeads: 116,
    siteVisits: 79,
    dealsClosed: 21,
    activeDeals: 15,
    lostDeals: 18,
    revenue: 7800000,
    pipelineValue: 12600000,
    avgDealValue: 371429,
    conversionRate: 10.6,
    siteVisitRate: 39.9,
    closeRate: 18.1,
    responseTimeHours: 2.8,
    growthRate: 12.8,
    performanceLevel: 'good',
    priorityLevel: 'medium',
    managerName: 'Karthik R',
    topProject: 'Brigade Cornerstone Utopia',
  },
  {
    id: 'geo-region-004',
    code: 'BLR-HSR',
    region: 'HSR Layout Prime',
    city: 'Bangalore',
    zone: 'South-East Bangalore',
    latitude: 12.9116,
    longitude: 77.6474,
    leads: 164,
    qualifiedLeads: 101,
    siteVisits: 66,
    dealsClosed: 18,
    activeDeals: 11,
    lostDeals: 14,
    revenue: 6200000,
    pipelineValue: 9200000,
    avgDealValue: 344444,
    conversionRate: 11.0,
    siteVisitRate: 40.2,
    closeRate: 17.8,
    responseTimeHours: 2.2,
    growthRate: 9.4,
    performanceLevel: 'good',
    priorityLevel: 'medium',
    managerName: 'Asha Menon',
    topProject: 'SNN Raj Etternia',
  },
  {
    id: 'geo-region-005',
    code: 'BLR-HBB',
    region: 'Hebbal Growth Arc',
    city: 'Bangalore',
    zone: 'North Bangalore',
    latitude: 13.0358,
    longitude: 77.5970,
    leads: 151,
    qualifiedLeads: 92,
    siteVisits: 58,
    dealsClosed: 16,
    activeDeals: 12,
    lostDeals: 13,
    revenue: 5700000,
    pipelineValue: 8900000,
    avgDealValue: 356250,
    conversionRate: 10.6,
    siteVisitRate: 38.4,
    closeRate: 17.4,
    responseTimeHours: 3.1,
    growthRate: 7.6,
    performanceLevel: 'good',
    priorityLevel: 'medium',
    managerName: 'Vignesh Kumar',
    topProject: 'Brigade Caladium',
  },
  {
    id: 'geo-region-006',
    code: 'BLR-DVN',
    region: 'Devanahalli Expansion',
    city: 'Bangalore',
    zone: 'North Bangalore',
    latitude: 13.2423,
    longitude: 77.7132,
    leads: 132,
    qualifiedLeads: 71,
    siteVisits: 43,
    dealsClosed: 11,
    activeDeals: 10,
    lostDeals: 12,
    revenue: 4200000,
    pipelineValue: 7600000,
    avgDealValue: 381818,
    conversionRate: 8.3,
    siteVisitRate: 32.6,
    closeRate: 15.5,
    responseTimeHours: 4.2,
    growthRate: 5.1,
    performanceLevel: 'average',
    priorityLevel: 'high',
    managerName: 'Harish N',
    topProject: 'Century Seasons',
  },
  {
    id: 'geo-region-007',
    code: 'BLR-ECY',
    region: 'Electronic City South',
    city: 'Bangalore',
    zone: 'South Bangalore',
    latitude: 12.8399,
    longitude: 77.6770,
    leads: 173,
    qualifiedLeads: 88,
    siteVisits: 54,
    dealsClosed: 12,
    activeDeals: 13,
    lostDeals: 19,
    revenue: 4500000,
    pipelineValue: 8300000,
    avgDealValue: 375000,
    conversionRate: 6.9,
    siteVisitRate: 31.2,
    closeRate: 13.6,
    responseTimeHours: 4.8,
    growthRate: -2.9,
    performanceLevel: 'poor',
    priorityLevel: 'high',
    managerName: 'Sanjana Iyer',
    topProject: 'Ajmera Infinity',
  },
  {
    id: 'geo-region-008',
    code: 'BLR-BGR',
    region: 'Begur Road Pocket',
    city: 'Bangalore',
    zone: 'South Bangalore',
    latitude: 12.8738,
    longitude: 77.6327,
    leads: 124,
    qualifiedLeads: 68,
    siteVisits: 39,
    dealsClosed: 8,
    activeDeals: 8,
    lostDeals: 11,
    revenue: 3100000,
    pipelineValue: 5700000,
    avgDealValue: 387500,
    conversionRate: 6.5,
    siteVisitRate: 31.5,
    closeRate: 11.8,
    responseTimeHours: 5.1,
    growthRate: -4.6,
    performanceLevel: 'poor',
    priorityLevel: 'high',
    managerName: 'Megha S',
    topProject: 'Mahindra Windchimes',
  },
  {
    id: 'geo-region-009',
    code: 'BLR-KRP',
    region: 'Koramangala Premium',
    city: 'Bangalore',
    zone: 'Central Bangalore',
    latitude: 12.9352,
    longitude: 77.6245,
    leads: 102,
    qualifiedLeads: 63,
    siteVisits: 41,
    dealsClosed: 10,
    activeDeals: 6,
    lostDeals: 9,
    revenue: 4600000,
    pipelineValue: 6100000,
    avgDealValue: 460000,
    conversionRate: 9.8,
    siteVisitRate: 40.2,
    closeRate: 15.9,
    responseTimeHours: 2.7,
    growthRate: 8.2,
    performanceLevel: 'good',
    priorityLevel: 'low',
    managerName: 'Naveen P',
    topProject: 'Luxury Boutique Residences',
  },
  {
    id: 'geo-region-010',
    code: 'BLR-JPN',
    region: 'JP Nagar West',
    city: 'Bangalore',
    zone: 'South Bangalore',
    latitude: 12.9077,
    longitude: 77.5854,
    leads: 99,
    qualifiedLeads: 57,
    siteVisits: 33,
    dealsClosed: 7,
    activeDeals: 5,
    lostDeals: 10,
    revenue: 2900000,
    pipelineValue: 4800000,
    avgDealValue: 414286,
    conversionRate: 7.1,
    siteVisitRate: 33.3,
    closeRate: 12.3,
    responseTimeHours: 4.9,
    growthRate: -1.8,
    performanceLevel: 'average',
    priorityLevel: 'medium',
    managerName: 'Suresh B',
    topProject: 'Branded Apartment Cluster',
  },
];

export const mockGeoHeatmapPoints: GeoHeatmapPoint[] = [
  {
    id: 'heat-001',
    label: 'Whitefield',
    city: 'Bangalore',
    zone: 'East Bangalore',
    latitude: 12.9698,
    longitude: 77.7500,
    intensity: 94,
    leads: 284,
    revenue: 12800000,
    conversionRate: 12.0,
  },
  {
    id: 'heat-002',
    label: 'Sarjapur',
    city: 'Bangalore',
    zone: 'South-East Bangalore',
    latitude: 12.8856,
    longitude: 77.6770,
    intensity: 88,
    leads: 246,
    revenue: 10200000,
    conversionRate: 11.0,
  },
  {
    id: 'heat-003',
    label: 'Varthur',
    city: 'Bangalore',
    zone: 'East Bangalore',
    latitude: 12.9407,
    longitude: 77.7473,
    intensity: 76,
    leads: 198,
    revenue: 7800000,
    conversionRate: 10.6,
  },
  {
    id: 'heat-004',
    label: 'Hebbal',
    city: 'Bangalore',
    zone: 'North Bangalore',
    latitude: 13.0358,
    longitude: 77.5970,
    intensity: 63,
    leads: 151,
    revenue: 5700000,
    conversionRate: 10.6,
  },
  {
    id: 'heat-005',
    label: 'Electronic City',
    city: 'Bangalore',
    zone: 'South Bangalore',
    latitude: 12.8399,
    longitude: 77.6770,
    intensity: 47,
    leads: 173,
    revenue: 4500000,
    conversionRate: 6.9,
  },
  {
    id: 'heat-006',
    label: 'Begur Road',
    city: 'Bangalore',
    zone: 'South Bangalore',
    latitude: 12.8738,
    longitude: 77.6327,
    intensity: 41,
    leads: 124,
    revenue: 3100000,
    conversionRate: 6.5,
  },
];

export const mockGeoCityDistribution: GeoCityDistribution[] = [
  {
    id: 'city-001',
    city: 'Bangalore',
    regionsCovered: 10,
    leads: 1846,
    dealsClosed: 164,
    revenue: 52800000,
    pipelineValue: 94700000,
    conversionRate: 8.9,
    growthRate: 13.7,
  },
  {
    id: 'city-002',
    city: 'Chennai',
    regionsCovered: 1,
    leads: 126,
    dealsClosed: 9,
    revenue: 3100000,
    pipelineValue: 5400000,
    conversionRate: 7.1,
    growthRate: 6.2,
  },
  {
    id: 'city-003',
    city: 'Hyderabad',
    regionsCovered: 1,
    leads: 94,
    dealsClosed: 6,
    revenue: 2200000,
    pipelineValue: 3900000,
    conversionRate: 6.4,
    growthRate: 4.9,
  },
];

export const mockGeoZoneComparison: GeoZoneComparison[] = [
  {
    id: 'zone-001',
    zone: 'East Bangalore',
    leads: 482,
    siteVisits: 197,
    dealsClosed: 55,
    revenue: 20600000,
    avgDealValue: 374545,
    conversionRate: 11.4,
  },
  {
    id: 'zone-002',
    zone: 'South-East Bangalore',
    leads: 410,
    siteVisits: 168,
    dealsClosed: 45,
    revenue: 16400000,
    avgDealValue: 364444,
    conversionRate: 11.0,
  },
  {
    id: 'zone-003',
    zone: 'North Bangalore',
    leads: 283,
    siteVisits: 101,
    dealsClosed: 27,
    revenue: 9900000,
    avgDealValue: 366667,
    conversionRate: 9.5,
  },
  {
    id: 'zone-004',
    zone: 'South Bangalore',
    leads: 396,
    siteVisits: 126,
    dealsClosed: 27,
    revenue: 10500000,
    avgDealValue: 388889,
    conversionRate: 6.8,
  },
  {
    id: 'zone-005',
    zone: 'Central Bangalore',
    leads: 102,
    siteVisits: 41,
    dealsClosed: 10,
    revenue: 4600000,
    avgDealValue: 460000,
    conversionRate: 9.8,
  },
];

export const mockGeoOpportunityAreas: GeoOpportunityArea[] = [
  {
    id: 'opp-001',
    area: 'Devanahalli Expansion',
    city: 'Bangalore',
    reason: 'High future demand, weaker current conversion, strong inventory growth.',
    opportunityScore: 89,
    expectedRevenue: 7200000,
    recommendedAction: 'Deploy premium plotted campaign + weekend investor site-visit drive.',
    priorityLevel: 'high',
  },
  {
    id: 'opp-002',
    area: 'Electronic City South',
    city: 'Bangalore',
    reason: 'Good lead volume, weak field conversion, operational follow-up gap.',
    opportunityScore: 83,
    expectedRevenue: 5100000,
    recommendedAction: 'Add field executive and run response-time SLA monitoring.',
    priorityLevel: 'high',
  },
  {
    id: 'opp-003',
    area: 'Begur Road Pocket',
    city: 'Bangalore',
    reason: 'Affordable inventory but low trust and low site visit ratio.',
    opportunityScore: 76,
    expectedRevenue: 3800000,
    recommendedAction: 'Use verified-property creatives and local broker partnerships.',
    priorityLevel: 'medium',
  },
  {
    id: 'opp-004',
    area: 'Koramangala Premium',
    city: 'Bangalore',
    reason: 'Smaller volume but strong high-ticket potential.',
    opportunityScore: 71,
    expectedRevenue: 4600000,
    recommendedAction: 'Run ultra-targeted luxury buyer outreach and concierge follow-ups.',
    priorityLevel: 'medium',
  },
];

export const mockGeoInsights: GeoInsight[] = [
  {
    id: 'insight-001',
    title: 'East Bangalore remains the strongest revenue engine',
    description:
      'Whitefield and Varthur together are generating the highest revenue concentration and healthiest pipeline momentum.',
    impact: 'positive',
    recommendation:
      'Protect this zone with faster response SLAs, premium inventory, and senior closer coverage.',
  },
  {
    id: 'insight-002',
    title: 'South Bangalore needs immediate operational repair',
    description:
      'Lead inflow exists, but site visits and closure efficiency are underperforming significantly.',
    impact: 'critical',
    recommendation:
      'Audit call response times, strengthen follow-up scripting, and shift one top closer into the zone.',
  },
  {
    id: 'insight-003',
    title: 'North Bangalore is an opportunity zone, not yet a winner',
    description:
      'Future demand signals are strong, but current lead qualification and site-visit conversion remain soft.',
    impact: 'warning',
    recommendation:
      'Use investor-focused positioning and hyperlocal campaign messaging for plotted developments.',
  },
  {
    id: 'insight-004',
    title: 'High-value micro-markets deserve separate premium strategy',
    description:
      'Central Bangalore closes fewer deals, but average ticket size is materially higher.',
    impact: 'neutral',
    recommendation:
      'Create a premium sales lane with different creatives, agents, and follow-up cadence.',
  },
];

export const mockGeoAnalytics: GeoAnalyticsDataset = {
  summary: geoAnalyticsSummary,
  metricCards: geoMetricCards,
  regions: mockGeoRegions,
  heatmapPoints: mockGeoHeatmapPoints,
  cityDistribution: mockGeoCityDistribution,
  zoneComparison: mockGeoZoneComparison,
  opportunityAreas: mockGeoOpportunityAreas,
  insights: mockGeoInsights,
};

export const geoMetricMap = geoMetricCards.reduce<Record<string, GeoMetricCard>>(
  (acc, metric) => {
    acc[metric.key] = metric;
    return acc;
  },
  {},
);

export const getGeoMetricByKey = (
  key: GeoMetricCard['key'],
): GeoMetricCard | undefined => {
  return geoMetricMap[key];
};

export const highlightedGeoMetrics = geoMetricCards.filter(
  (metric) => metric.isHighlighted,
);

export const topGeoRegions = [...mockGeoRegions]
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5);

export const highPriorityGeoOpportunities = mockGeoOpportunityAreas.filter(
  (item) => item.priorityLevel === 'high',
);

export default mockGeoAnalytics;