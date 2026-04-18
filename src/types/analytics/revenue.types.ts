import type {
  AnalyticsChartDataSet,
  AnalyticsFilters,
  AnalyticsKpi,
  AnalyticsResponseMeta,
  AnalyticsSummaryResponse,
  AnalyticsTableData,
  AnalyticsTrendDirection,
  AnalyticsValueFormat,
} from "./analytics.types";

export type RevenueGranularity = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
export type RevenueComparisonMode = "previous-period" | "target" | "forecast" | "last-year";
export type RevenueEntityType = "agent" | "team" | "project" | "location" | "source";
export type RevenueOutcomeType = "won" | "lost" | "open";
export type RevenueCollectionStatus = "pending" | "partial" | "collected" | "overdue";

export interface RevenueFilters extends AnalyticsFilters {
  granularity?: RevenueGranularity;
  comparisonMode?: RevenueComparisonMode;
  ownerIds?: string[];
  teamIds?: string[];
  projectIds?: string[];
  locationKeys?: string[];
  sourceKeys?: string[];
  includeTaxes?: boolean;
  includeRefunds?: boolean;
  minRevenue?: number;
  maxRevenue?: number;
}

export interface RevenueKpi extends AnalyticsKpi {
  benchmarkValue?: number;
  benchmarkLabel?: string;
}

export interface RevenueSummaryMetrics {
  totalRevenue: number;
  collectedRevenue?: number;
  pendingRevenue?: number;
  overdueRevenue?: number;
  averageDealSize?: number;
  revenueGrowthPercent?: number;
  targetAchievementPercent?: number;
  forecastAccuracyPercent?: number;
  winRate?: number;
  refundAmount?: number;
  netRevenue?: number;
}

export interface RevenueTrendPoint {
  periodKey: string;
  periodLabel: string;
  date?: string;
  revenue: number;
  collectedRevenue?: number;
  pendingRevenue?: number;
  targetRevenue?: number;
  forecastRevenue?: number;
  previousPeriodRevenue?: number;
  variance?: number;
  variancePercent?: number;
}

export interface RevenueByEntityRow {
  entityId: string;
  entityLabel: string;
  entityType: RevenueEntityType;
  revenue: number;
  collectedRevenue?: number;
  pendingRevenue?: number;
  dealCount?: number;
  averageDealValue?: number;
  contributionPercent?: number;
  achievementPercent?: number;
}

export interface RevenueProjectRow {
  projectId: string;
  projectName: string;
  locationLabel?: string;
  revenue: number;
  collectedRevenue?: number;
  pendingRevenue?: number;
  dealCount: number;
  averageDealValue?: number;
  wonDeals?: number;
  lostDeals?: number;
}

export interface RevenueLocationRow {
  locationKey: string;
  locationLabel: string;
  revenue: number;
  collectedRevenue?: number;
  pendingRevenue?: number;
  dealCount?: number;
  averageDealValue?: number;
  growthPercent?: number;
}

export interface RevenueAgentRow {
  agentId: string;
  agentName: string;
  teamName?: string;
  revenue: number;
  collectedRevenue?: number;
  pendingRevenue?: number;
  dealCount: number;
  averageDealValue?: number;
  winRate?: number;
  targetRevenue?: number;
  achievementPercent?: number;
}

export interface RevenueSourceRow {
  sourceKey: string;
  sourceLabel: string;
  revenue: number;
  dealCount?: number;
  averageDealValue?: number;
  contributionPercent?: number;
  customerAcquisitionCost?: number;
  revenuePerLead?: number;
}

export interface TargetVsAchievementPoint {
  periodKey: string;
  periodLabel: string;
  targetRevenue: number;
  achievedRevenue: number;
  forecastRevenue?: number;
  variance?: number;
  variancePercent?: number;
  achievementPercent?: number;
}

export interface ForecastVsActualPoint {
  periodKey: string;
  periodLabel: string;
  forecastRevenue: number;
  actualRevenue: number;
  variance: number;
  variancePercent: number;
}

export interface WonVsLostRevenuePoint {
  periodKey: string;
  periodLabel: string;
  wonRevenue: number;
  lostRevenue: number;
  openRevenue?: number;
  wonDeals?: number;
  lostDeals?: number;
}

export interface AverageDealSizePoint {
  periodKey: string;
  periodLabel: string;
  averageDealSize: number;
  dealCount?: number;
}

export interface RevenueCollectionRow {
  id: string;
  referenceId?: string;
  customerName?: string;
  projectName?: string;
  ownerName?: string;
  totalAmount: number;
  collectedAmount: number;
  pendingAmount: number;
  dueDate?: string;
  collectedDate?: string;
  status: RevenueCollectionStatus;
}

export interface RevenueOutcomeBreakdown {
  outcome: RevenueOutcomeType;
  label: string;
  revenue: number;
  dealCount?: number;
  contributionPercent?: number;
}

export interface RevenueInsightCard {
  key: string;
  title: string;
  value: number | string;
  subtitle?: string;
  description?: string;
  trend?: AnalyticsTrendDirection;
  changePercent?: number;
  format?: AnalyticsValueFormat | "text";
}

export interface RevenueResponseData {
  kpis: RevenueKpi[];
  metrics: RevenueSummaryMetrics;
  trend: RevenueTrendPoint[];
  revenueByEntity?: RevenueByEntityRow[];
  projectRevenue?: RevenueProjectRow[];
  locationRevenue?: RevenueLocationRow[];
  agentRevenue?: RevenueAgentRow[];
  sourceRevenue?: RevenueSourceRow[];
  targetVsAchievement?: TargetVsAchievementPoint[];
  forecastVsActual?: ForecastVsActualPoint[];
  wonVsLost?: WonVsLostRevenuePoint[];
  averageDealSizeTrend?: AverageDealSizePoint[];
  collections?: RevenueCollectionRow[];
  outcomeBreakdown?: RevenueOutcomeBreakdown[];
  insightCards?: RevenueInsightCard[];
  charts?: Record<string, AnalyticsChartDataSet>;
  tables?: Record<string, AnalyticsTableData>;
  meta?: AnalyticsResponseMeta;
}

export interface RevenueSummaryResponse extends AnalyticsSummaryResponse {
  totalRevenue?: number;
  collectedRevenue?: number;
  pendingRevenue?: number;
  overdueRevenue?: number;
  averageDealSize?: number;
  revenueGrowthPercent?: number;
  targetAchievementPercent?: number;
  forecastAccuracyPercent?: number;
  winRate?: number;
  refundAmount?: number;
  netRevenue?: number;
}

export interface RevenueTrendResponse {
  items: RevenueTrendPoint[];
  meta?: AnalyticsResponseMeta;
}

export interface RevenueByEntityResponse {
  items: RevenueByEntityRow[];
  meta?: AnalyticsResponseMeta;
}

export interface RevenueProjectResponse {
  items: RevenueProjectRow[];
  meta?: AnalyticsResponseMeta;
}

export interface RevenueLocationResponse {
  items: RevenueLocationRow[];
  meta?: AnalyticsResponseMeta;
}

export interface RevenueAgentResponse {
  items: RevenueAgentRow[];
  meta?: AnalyticsResponseMeta;
}

export interface RevenueSourceResponse {
  items: RevenueSourceRow[];
  meta?: AnalyticsResponseMeta;
}

export interface TargetVsAchievementResponse {
  items: TargetVsAchievementPoint[];
  meta?: AnalyticsResponseMeta;
}

export interface ForecastVsActualResponse {
  items: ForecastVsActualPoint[];
  meta?: AnalyticsResponseMeta;
}

export interface WonVsLostRevenueResponse {
  items: WonVsLostRevenuePoint[];
  meta?: AnalyticsResponseMeta;
}

export interface RevenueCollectionsResponse {
  items: RevenueCollectionRow[];
  total: number;
  meta?: AnalyticsResponseMeta;
}

export type RevenueAnyResponse =
  | RevenueSummaryResponse
  | RevenueResponseData
  | RevenueTrendResponse
  | RevenueByEntityResponse
  | RevenueProjectResponse
  | RevenueLocationResponse
  | RevenueAgentResponse
  | RevenueSourceResponse
  | TargetVsAchievementResponse
  | ForecastVsActualResponse
  | WonVsLostRevenueResponse
  | RevenueCollectionsResponse;