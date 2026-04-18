import ANALYTICS_CHART_KEYS, {
  type AnalyticsChartKey,
} from "./analyticsChartKeys";
import { type AnalyticsKpiKey } from "./analyticsKpis";

export type AnalyticsTrendPoint = {
  label: string;
  value: number;
};

export type AnalyticsSeriesPoint = {
  label: string;
  [key: string]: string | number;
};

export type AnalyticsKpiSnapshot = {
  key: AnalyticsKpiKey;
  value: number;
  previousValue: number;
  targetValue?: number;
};

export type AnalyticsTopOpportunity = {
  id: string;
  projectName: string;
  clientName: string;
  location: string;
  owner: string;
  stage: string;
  probability: number;
  value: number;
  expectedCloseDate: string;
  riskLevel: "low" | "medium" | "high";
};

export type AnalyticsHighRiskDeal = {
  id: string;
  dealName: string;
  owner: string;
  project: string;
  stage: string;
  value: number;
  riskScore: number;
  daysStuck: number;
};

export type AnalyticsTopPerformer = {
  id: string;
  name: string;
  team: string;
  dealsWon: number;
  revenue: number;
  conversionRate: number;
};

export type AnalyticsAlertSummary = {
  id: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  createdAt: string;
};

export type AnalyticsSummaryStat = {
  key: string;
  label: string;
  value: number;
  previousValue?: number;
};

export type AnalyticsMockData = {
  kpis: AnalyticsKpiSnapshot[];
  charts: Record<AnalyticsChartKey, AnalyticsSeriesPoint[]>;
  topOpportunities: AnalyticsTopOpportunity[];
  highRiskDeals: AnalyticsHighRiskDeal[];
  topPerformers: AnalyticsTopPerformer[];
  alertSummary: AnalyticsAlertSummary[];
  summaryStats: AnalyticsSummaryStat[];
};

export const analyticsMockKpis: AnalyticsKpiSnapshot[] = [
  {
    key: "totalRevenue",
    value: 18450000,
    previousValue: 16200000,
    targetValue: 20000000,
  },
  {
    key: "forecastRevenue",
    value: 22100000,
    previousValue: 20500000,
    targetValue: 24000000,
  },
  {
    key: "revenueGrowth",
    value: 13.9,
    previousValue: 9.8,
    targetValue: 15,
  },
  {
    key: "totalLeads",
    value: 1286,
    previousValue: 1134,
    targetValue: 1400,
  },
  {
    key: "qualifiedLeads",
    value: 486,
    previousValue: 421,
    targetValue: 520,
  },
  {
    key: "leadToVisitRate",
    value: 31.6,
    previousValue: 28.4,
    targetValue: 35,
  },
  {
    key: "siteVisits",
    value: 273,
    previousValue: 241,
    targetValue: 300,
  },
  {
    key: "visitToBookingRate",
    value: 22.7,
    previousValue: 20.3,
    targetValue: 25,
  },
  {
    key: "totalDeals",
    value: 184,
    previousValue: 169,
    targetValue: 210,
  },
  {
    key: "wonDeals",
    value: 62,
    previousValue: 54,
    targetValue: 70,
  },
  {
    key: "lostDeals",
    value: 21,
    previousValue: 27,
    targetValue: 18,
  },
  {
    key: "averageDealSize",
    value: 297580,
    previousValue: 283000,
    targetValue: 310000,
  },
  {
    key: "avgClosureTime",
    value: 24,
    previousValue: 28,
    targetValue: 20,
  },
  {
    key: "pipelineValue",
    value: 41200000,
    previousValue: 38400000,
    targetValue: 45000000,
  },
  {
    key: "conversionRate",
    value: 12.8,
    previousValue: 11.2,
    targetValue: 15,
  },
  {
    key: "costPerQualifiedLead",
    value: 1850,
    previousValue: 2040,
    targetValue: 1700,
  },
  {
    key: "customerAcquisitionCost",
    value: 12840,
    previousValue: 13950,
    targetValue: 12000,
  },
  {
    key: "marketingSpend",
    value: 899000,
    previousValue: 860000,
    targetValue: 950000,
  },
  {
    key: "roi",
    value: 205.4,
    previousValue: 188.1,
    targetValue: 220,
  },
  {
    key: "businessHealthScore",
    value: 82,
    previousValue: 76,
    targetValue: 90,
  },
  {
    key: "openRate",
    value: 38.4,
    previousValue: 35.6,
    targetValue: 42,
  },
  {
    key: "clickRate",
    value: 9.8,
    previousValue: 8.9,
    targetValue: 11,
  },
  {
    key: "replyRate",
    value: 14.1,
    previousValue: 12.4,
    targetValue: 16,
  },
  {
    key: "deliveryRate",
    value: 96.8,
    previousValue: 95.9,
    targetValue: 98,
  },
  {
    key: "stuckDeals",
    value: 18,
    previousValue: 24,
    targetValue: 12,
  },
  {
    key: "highRiskDeals",
    value: 11,
    previousValue: 16,
    targetValue: 8,
  },
];

const monthlyPerformance: AnalyticsSeriesPoint[] = [
  { label: "Jan", revenue: 12.4, forecast: 13.1, leads: 182, score: 71 },
  { label: "Feb", revenue: 13.8, forecast: 14.4, leads: 196, score: 73 },
  { label: "Mar", revenue: 14.5, forecast: 15.2, leads: 205, score: 75 },
  { label: "Apr", revenue: 15.1, forecast: 16.1, leads: 213, score: 77 },
  { label: "May", revenue: 16.3, forecast: 17.0, leads: 228, score: 79 },
  { label: "Jun", revenue: 17.2, forecast: 18.4, leads: 241, score: 82 },
];

export const analyticsMockCharts: Record<AnalyticsChartKey, AnalyticsSeriesPoint[]> = {
  [ANALYTICS_CHART_KEYS.BUSINESS_HEALTH_SCORE]: [
    { label: "Sales Efficiency", value: 84 },
    { label: "Lead Quality", value: 78 },
    { label: "Pipeline Strength", value: 86 },
    { label: "Response Speed", value: 80 },
    { label: "Deal Momentum", value: 82 },
  ],

  [ANALYTICS_CHART_KEYS.FORECAST_VS_ACTUAL]: monthlyPerformance.map((item) => ({
    label: item.label,
    actual: item.revenue as number,
    forecast: item.forecast as number,
  })),

  [ANALYTICS_CHART_KEYS.GROWTH_COMPARISON]: [
    { label: "Jan", current: 9.4, previous: 7.2 },
    { label: "Feb", current: 10.1, previous: 7.8 },
    { label: "Mar", current: 10.8, previous: 8.4 },
    { label: "Apr", current: 11.9, previous: 9.1 },
    { label: "May", current: 12.6, previous: 9.4 },
    { label: "Jun", current: 13.9, previous: 9.8 },
  ],

  [ANALYTICS_CHART_KEYS.MONTHLY_BUSINESS_SCORECARD]: monthlyPerformance.map(
    (item) => ({
      label: item.label,
      score: item.score as number,
      revenue: item.revenue as number,
      leads: item.leads as number,
    })
  ),

  [ANALYTICS_CHART_KEYS.TOP_OPPORTUNITIES]: [
    { label: "MEI Smart Villas", value: 62 },
    { label: "MEI Elite Square", value: 54 },
    { label: "MEI Green Heights", value: 48 },
    { label: "MEI Lake View", value: 43 },
    { label: "MEI Urban Nest", value: 39 },
  ],

  [ANALYTICS_CHART_KEYS.COST_PER_QUALIFIED_LEAD]: [
    { label: "Meta Ads", cost: 1760 },
    { label: "Google Ads", cost: 1980 },
    { label: "Website", cost: 820 },
    { label: "Referral", cost: 360 },
    { label: "Property Portal", cost: 2290 },
  ],

  [ANALYTICS_CHART_KEYS.SOURCE_TO_REVENUE_COMPARISON]: [
    { label: "Website", leads: 210, revenue: 34 },
    { label: "Referral", leads: 162, revenue: 41 },
    { label: "Meta Ads", leads: 320, revenue: 29 },
    { label: "Google Ads", leads: 276, revenue: 31 },
    { label: "Broker Network", leads: 118, revenue: 37 },
  ],

  [ANALYTICS_CHART_KEYS.AVG_DEAL_CLOSURE_TIME]: [
    { label: "Jan", days: 31 },
    { label: "Feb", days: 29 },
    { label: "Mar", days: 28 },
    { label: "Apr", days: 27 },
    { label: "May", days: 25 },
    { label: "Jun", days: 24 },
  ],

  [ANALYTICS_CHART_KEYS.FUNNEL_CONVERSION]: [
    { label: "Leads", value: 1286 },
    { label: "Qualified", value: 486 },
    { label: "Site Visits", value: 273 },
    { label: "Negotiation", value: 124 },
    { label: "Won", value: 62 },
  ],

  [ANALYTICS_CHART_KEYS.PIPELINE_STAGE_DISTRIBUTION]: [
    { label: "New", value: 164 },
    { label: "Contacted", value: 138 },
    { label: "Qualified", value: 121 },
    { label: "Visit", value: 94 },
    { label: "Negotiation", value: 52 },
    { label: "Documentation", value: 19 },
  ],

  [ANALYTICS_CHART_KEYS.STAGE_CONVERSION_RATE]: [
    { label: "Lead → Qualified", value: 37.8 },
    { label: "Qualified → Visit", value: 56.2 },
    { label: "Visit → Negotiation", value: 45.4 },
    { label: "Negotiation → Won", value: 50.0 },
  ],

  [ANALYTICS_CHART_KEYS.STAGE_DROP_OFF]: [
    { label: "New", value: 12.4 },
    { label: "Contacted", value: 16.8 },
    { label: "Qualified", value: 9.7 },
    { label: "Visit", value: 7.9 },
    { label: "Negotiation", value: 5.2 },
  ],

  [ANALYTICS_CHART_KEYS.STUCK_DEALS]: [
    { label: "0-7 Days", value: 9 },
    { label: "8-15 Days", value: 18 },
    { label: "16-30 Days", value: 14 },
    { label: "31-45 Days", value: 8 },
    { label: "45+ Days", value: 4 },
  ],

  [ANALYTICS_CHART_KEYS.AVERAGE_DEAL_SIZE]: [
    { label: "Jan", value: 268000 },
    { label: "Feb", value: 274000 },
    { label: "Mar", value: 281000 },
    { label: "Apr", value: 289000 },
    { label: "May", value: 292000 },
    { label: "Jun", value: 297580 },
  ],

  [ANALYTICS_CHART_KEYS.FORECAST_REVENUE]: [
    { label: "Jul", committed: 4.2, pipeline: 7.6 },
    { label: "Aug", committed: 4.8, pipeline: 8.1 },
    { label: "Sep", committed: 5.3, pipeline: 8.8 },
    { label: "Oct", committed: 5.7, pipeline: 9.2 },
  ],

  [ANALYTICS_CHART_KEYS.REVENUE_BY_AGENT]: [
    { label: "Arun", value: 42 },
    { label: "Priya", value: 36 },
    { label: "Vignesh", value: 29 },
    { label: "Sneha", value: 26 },
    { label: "Karthik", value: 22 },
  ],

  [ANALYTICS_CHART_KEYS.REVENUE_BY_LOCATION]: [
    { label: "Bangalore", value: 68 },
    { label: "Chennai", value: 52 },
    { label: "Hyderabad", value: 31 },
    { label: "Coimbatore", value: 19 },
  ],

  [ANALYTICS_CHART_KEYS.REVENUE_BY_PROJECT]: [
    { label: "Green Heights", value: 24 },
    { label: "Elite Square", value: 21 },
    { label: "Smart Villas", value: 19 },
    { label: "Urban Nest", value: 15 },
    { label: "Lake View", value: 12 },
  ],

  [ANALYTICS_CHART_KEYS.REVENUE_TREND]: monthlyPerformance.map((item) => ({
    label: item.label,
    value: item.revenue as number,
  })),

  [ANALYTICS_CHART_KEYS.TARGET_VS_ACHIEVEMENT]: [
    { label: "Revenue", target: 20, achieved: 18.45 },
    { label: "Leads", target: 1400, achieved: 1286 },
    { label: "Qualified", target: 520, achieved: 486 },
    { label: "Won Deals", target: 70, achieved: 62 },
  ],

  [ANALYTICS_CHART_KEYS.WON_VS_LOST_DEALS]: [
    { label: "Jan", won: 8, lost: 5 },
    { label: "Feb", won: 9, lost: 4 },
    { label: "Mar", won: 10, lost: 4 },
    { label: "Apr", won: 11, lost: 5 },
    { label: "May", won: 12, lost: 2 },
    { label: "Jun", won: 12, lost: 1 },
  ],

  [ANALYTICS_CHART_KEYS.HIGH_RISK_DEALS]: [
    { label: "Documentation Delay", value: 4 },
    { label: "Payment Risk", value: 3 },
    { label: "Low Engagement", value: 2 },
    { label: "Legal Concern", value: 1 },
    { label: "Competitor Threat", value: 1 },
  ],

  [ANALYTICS_CHART_KEYS.LOST_LEAD_REASONS]: [
    { label: "Price Sensitivity", value: 32 },
    { label: "No Response", value: 24 },
    { label: "Location Mismatch", value: 18 },
    { label: "Budget Issue", value: 15 },
    { label: "Competitor Won", value: 11 },
  ],

  [ANALYTICS_CHART_KEYS.RISK_SCORE_DISTRIBUTION]: [
    { label: "0-20", value: 21 },
    { label: "21-40", value: 49 },
    { label: "41-60", value: 62 },
    { label: "61-80", value: 28 },
    { label: "81-100", value: 11 },
  ],

  [ANALYTICS_CHART_KEYS.CHANNEL_PERFORMANCE]: [
    { label: "Email", sent: 4200, delivered: 4075, replies: 498 },
    { label: "SMS", sent: 2800, delivered: 2721, replies: 164 },
    { label: "WhatsApp", sent: 1900, delivered: 1862, replies: 301 },
    { label: "Calls", sent: 860, delivered: 860, replies: 213 },
  ],

  [ANALYTICS_CHART_KEYS.OPEN_RATE]: [
    { label: "Jan", value: 33.2 },
    { label: "Feb", value: 34.1 },
    { label: "Mar", value: 35.6 },
    { label: "Apr", value: 36.8 },
    { label: "May", value: 37.5 },
    { label: "Jun", value: 38.4 },
  ],

  [ANALYTICS_CHART_KEYS.CLICK_RATE]: [
    { label: "Jan", value: 7.6 },
    { label: "Feb", value: 8.1 },
    { label: "Mar", value: 8.4 },
    { label: "Apr", value: 8.8 },
    { label: "May", value: 9.3 },
    { label: "Jun", value: 9.8 },
  ],

  [ANALYTICS_CHART_KEYS.REPLY_RATE]: [
    { label: "Jan", value: 11.1 },
    { label: "Feb", value: 11.7 },
    { label: "Mar", value: 12.4 },
    { label: "Apr", value: 12.8 },
    { label: "May", value: 13.4 },
    { label: "Jun", value: 14.1 },
  ],

  [ANALYTICS_CHART_KEYS.DELIVERY_STATS]: [
    { label: "Delivered", value: 96.8 },
    { label: "Failed", value: 2.1 },
    { label: "Bounced", value: 1.1 },
  ],

  [ANALYTICS_CHART_KEYS.SOURCE_PERFORMANCE]: [
    { label: "Website", leads: 210, won: 14, conversion: 6.7 },
    { label: "Referral", leads: 162, won: 18, conversion: 11.1 },
    { label: "Meta Ads", leads: 320, won: 11, conversion: 3.4 },
    { label: "Google Ads", leads: 276, won: 12, conversion: 4.3 },
    { label: "Broker", leads: 118, won: 7, conversion: 5.9 },
  ],

  [ANALYTICS_CHART_KEYS.PROJECT_PERFORMANCE]: [
    { label: "Green Heights", leads: 184, bookings: 16, revenue: 24 },
    { label: "Elite Square", leads: 162, bookings: 15, revenue: 21 },
    { label: "Smart Villas", leads: 148, bookings: 13, revenue: 19 },
    { label: "Urban Nest", leads: 132, bookings: 10, revenue: 15 },
  ],

  [ANALYTICS_CHART_KEYS.AREA_PERFORMANCE]: [
    { label: "Whitefield", leads: 188, revenue: 22 },
    { label: "Sarjapur", leads: 176, revenue: 20 },
    { label: "Electronic City", leads: 149, revenue: 16 },
    { label: "OMR", leads: 133, revenue: 13 },
  ],

  [ANALYTICS_CHART_KEYS.TOP_PERFORMERS]: [
    { label: "Arun", revenue: 42, deals: 14 },
    { label: "Priya", revenue: 36, deals: 12 },
    { label: "Vignesh", revenue: 29, deals: 10 },
    { label: "Sneha", revenue: 26, deals: 9 },
    { label: "Karthik", revenue: 22, deals: 8 },
  ],

  [ANALYTICS_CHART_KEYS.ALERT_SUMMARY]: [
    { label: "Critical Alerts", value: 3 },
    { label: "Warnings", value: 8 },
    { label: "Resolved", value: 14 },
  ],

  [ANALYTICS_CHART_KEYS.FORECAST_INSIGHT]: [
    { label: "Committed", value: 48 },
    { label: "Likely", value: 31 },
    { label: "At Risk", value: 21 },
  ],
};

export const analyticsMockTopOpportunities: AnalyticsTopOpportunity[] = [
  {
    id: "OPP-1001",
    projectName: "MEI Smart Villas",
    clientName: "Raghav Builders",
    location: "Sarjapur Road",
    owner: "Arun Kumar",
    stage: "Negotiation",
    probability: 84,
    value: 1850000,
    expectedCloseDate: "2026-04-28",
    riskLevel: "low",
  },
  {
    id: "OPP-1002",
    projectName: "MEI Elite Square",
    clientName: "Priya Estates",
    location: "Whitefield",
    owner: "Priya Sharma",
    stage: "Documentation",
    probability: 79,
    value: 1620000,
    expectedCloseDate: "2026-05-02",
    riskLevel: "medium",
  },
  {
    id: "OPP-1003",
    projectName: "MEI Green Heights",
    clientName: "Nova Infra",
    location: "OMR",
    owner: "Vignesh Raj",
    stage: "Site Visit",
    probability: 68,
    value: 1380000,
    expectedCloseDate: "2026-05-06",
    riskLevel: "medium",
  },
  {
    id: "OPP-1004",
    projectName: "MEI Urban Nest",
    clientName: "Ashwin Homes",
    location: "Electronic City",
    owner: "Sneha Reddy",
    stage: "Qualified",
    probability: 61,
    value: 1240000,
    expectedCloseDate: "2026-05-10",
    riskLevel: "high",
  },
];

export const analyticsMockHighRiskDeals: AnalyticsHighRiskDeal[] = [
  {
    id: "HRD-201",
    dealName: "Lake View Premium Block A",
    owner: "Karthik S",
    project: "MEI Lake View",
    stage: "Documentation",
    value: 980000,
    riskScore: 87,
    daysStuck: 19,
  },
  {
    id: "HRD-202",
    dealName: "Elite Square Penthouse",
    owner: "Priya Sharma",
    project: "MEI Elite Square",
    stage: "Negotiation",
    value: 1450000,
    riskScore: 82,
    daysStuck: 17,
  },
  {
    id: "HRD-203",
    dealName: "Green Heights Tower 3",
    owner: "Arun Kumar",
    project: "MEI Green Heights",
    stage: "Qualified",
    value: 890000,
    riskScore: 78,
    daysStuck: 14,
  },
];

export const analyticsMockTopPerformers: AnalyticsTopPerformer[] = [
  {
    id: "AG-01",
    name: "Arun Kumar",
    team: "Sales Team",
    dealsWon: 14,
    revenue: 4200000,
    conversionRate: 16.4,
  },
  {
    id: "AG-02",
    name: "Priya Sharma",
    team: "Pre-Sales",
    dealsWon: 12,
    revenue: 3600000,
    conversionRate: 15.2,
  },
  {
    id: "AG-03",
    name: "Vignesh Raj",
    team: "Sales Team",
    dealsWon: 10,
    revenue: 2900000,
    conversionRate: 13.7,
  },
];

export const analyticsMockAlertSummary: AnalyticsAlertSummary[] = [
  {
    id: "ALT-1",
    title: "High-risk deals increased in Documentation stage",
    description: "3 deals crossed risk score above 80 in the past 7 days.",
    severity: "critical",
    createdAt: "2026-04-17T08:30:00.000Z",
  },
  {
    id: "ALT-2",
    title: "Reply rate is improving on WhatsApp campaigns",
    description: "Reply rate increased by 2.4% compared to previous period.",
    severity: "info",
    createdAt: "2026-04-17T07:00:00.000Z",
  },
  {
    id: "ALT-3",
    title: "Broker Network source conversion dipped",
    description: "Broker-sourced leads show a 1.2% drop in close rate.",
    severity: "warning",
    createdAt: "2026-04-16T18:10:00.000Z",
  },
];

export const analyticsMockSummaryStats: AnalyticsSummaryStat[] = [
  { key: "activeProjects", label: "Active Projects", value: 12, previousValue: 10 },
  { key: "activeAgents", label: "Active Agents", value: 34, previousValue: 31 },
  { key: "liveCampaigns", label: "Live Campaigns", value: 9, previousValue: 7 },
  { key: "pendingFollowUps", label: "Pending Follow-Ups", value: 118, previousValue: 126 },
];

export const analyticsMockData: AnalyticsMockData = {
  kpis: analyticsMockKpis,
  charts: analyticsMockCharts,
  topOpportunities: analyticsMockTopOpportunities,
  highRiskDeals: analyticsMockHighRiskDeals,
  topPerformers: analyticsMockTopPerformers,
  alertSummary: analyticsMockAlertSummary,
  summaryStats: analyticsMockSummaryStats,
};

export const getAnalyticsMockChartData = (
  key: AnalyticsChartKey
): AnalyticsSeriesPoint[] => {
  return analyticsMockCharts[key] ?? [];
};

export const getAnalyticsMockKpi = (key: AnalyticsKpiKey): AnalyticsKpiSnapshot | undefined =>
  analyticsMockKpis.find((kpi) => kpi.key === key);

export default analyticsMockData;