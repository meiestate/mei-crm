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

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type RiskCategory =
  | "follow-up-delay"
  | "stale-deal"
  | "low-engagement"
  | "budget-mismatch"
  | "pricing-risk"
  | "documentation-risk"
  | "inventory-risk"
  | "payment-risk"
  | "conversion-risk"
  | "compliance-risk"
  | "other";

export type RiskStatus = "open" | "monitoring" | "mitigated" | "resolved";
export type RiskImpactArea = "pipeline" | "revenue" | "conversion" | "operations" | "compliance";
export type RiskScoreBand = "0-20" | "21-40" | "41-60" | "61-80" | "81-100";

export interface RiskFilters extends AnalyticsFilters {
  riskLevels?: RiskLevel[];
  categories?: RiskCategory[];
  statuses?: RiskStatus[];
  ownerIds?: string[];
  teamIds?: string[];
  projectIds?: string[];
  locationKeys?: string[];
  minRiskScore?: number;
  maxRiskScore?: number;
  includeResolved?: boolean;
  impactAreas?: RiskImpactArea[];
}

export interface RiskKpi extends AnalyticsKpi {
  benchmarkValue?: number;
  benchmarkLabel?: string;
}

export interface RiskSummaryMetrics {
  totalAtRiskDeals: number;
  totalRiskExposureValue: number;
  averageRiskScore: number;
  criticalRiskDeals: number;
  highRiskDeals: number;
  openAlerts: number;
  mitigatedAlerts?: number;
  resolvedAlerts?: number;
  riskReductionPercent?: number;
}

export interface RiskScoreDistributionPoint {
  band: RiskScoreBand;
  label: string;
  minScore: number;
  maxScore: number;
  dealCount: number;
  totalValue?: number;
}

export interface RiskCategoryBreakdownRow {
  category: RiskCategory;
  label: string;
  dealCount: number;
  exposureValue?: number;
  averageRiskScore?: number;
  contributionPercent?: number;
}

export interface RiskTrendPoint {
  periodKey: string;
  periodLabel: string;
  date?: string;
  atRiskDeals: number;
  criticalRiskDeals?: number;
  riskExposureValue?: number;
  averageRiskScore?: number;
  resolvedCount?: number;
}

export interface HighRiskDealRow {
  id: string;
  dealId: string;
  dealName: string;
  ownerId?: string;
  ownerName?: string;
  projectId?: string;
  projectName?: string;
  locationLabel?: string;
  stageLabel?: string;
  dealValue: number;
  riskScore: number;
  riskLevel: RiskLevel;
  primaryCategory: RiskCategory;
  status: RiskStatus;
  daysWithoutActivity?: number;
  expectedCloseDate?: string;
  lastActivityAt?: string;
  recommendedAction?: string;
}

export interface RiskAlertRow {
  id: string;
  title: string;
  description?: string;
  category: RiskCategory;
  level: RiskLevel;
  status: RiskStatus;
  impactArea?: RiskImpactArea;
  relatedDealId?: string;
  relatedDealName?: string;
  ownerName?: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
}

export interface RiskOwnerPerformanceRow {
  ownerId: string;
  ownerName: string;
  atRiskDeals: number;
  criticalDeals?: number;
  averageRiskScore?: number;
  exposureValue?: number;
  resolvedCount?: number;
}

export interface RiskProjectPerformanceRow {
  projectId: string;
  projectName: string;
  locationLabel?: string;
  atRiskDeals: number;
  criticalDeals?: number;
  averageRiskScore?: number;
  exposureValue?: number;
}

export interface RiskLocationPerformanceRow {
  locationKey: string;
  locationLabel: string;
  atRiskDeals: number;
  criticalDeals?: number;
  exposureValue?: number;
  averageRiskScore?: number;
}

export interface RiskMitigationSnapshot {
  label: string;
  identifiedCount: number;
  mitigatedCount: number;
  resolvedCount?: number;
  mitigationRate?: number;
}

export interface RiskInsightCard {
  key: string;
  title: string;
  value: number | string;
  subtitle?: string;
  description?: string;
  trend?: AnalyticsTrendDirection;
  changePercent?: number;
  format?: AnalyticsValueFormat | "text";
}

export interface RiskResponseData {
  kpis: RiskKpi[];
  metrics: RiskSummaryMetrics;
  scoreDistribution: RiskScoreDistributionPoint[];
  categoryBreakdown: RiskCategoryBreakdownRow[];
  trend: RiskTrendPoint[];
  highRiskDeals: HighRiskDealRow[];
  alerts: RiskAlertRow[];
  ownerPerformance?: RiskOwnerPerformanceRow[];
  projectPerformance?: RiskProjectPerformanceRow[];
  locationPerformance?: RiskLocationPerformanceRow[];
  mitigationSnapshots?: RiskMitigationSnapshot[];
  insightCards?: RiskInsightCard[];
  charts?: Record<string, AnalyticsChartDataSet>;
  tables?: Record<string, AnalyticsTableData>;
  meta?: AnalyticsResponseMeta;
}

export interface RiskSummaryResponse extends AnalyticsSummaryResponse {
  totalAtRiskDeals?: number;
  totalRiskExposureValue?: number;
  averageRiskScore?: number;
  criticalRiskDeals?: number;
  highRiskDeals?: number;
  openAlerts?: number;
  mitigatedAlerts?: number;
  resolvedAlerts?: number;
  riskReductionPercent?: number;
}

export interface RiskScoreDistributionResponse {
  items: RiskScoreDistributionPoint[];
  meta?: AnalyticsResponseMeta;
}

export interface RiskCategoryBreakdownResponse {
  items: RiskCategoryBreakdownRow[];
  meta?: AnalyticsResponseMeta;
}

export interface RiskTrendResponse {
  items: RiskTrendPoint[];
  meta?: AnalyticsResponseMeta;
}

export interface HighRiskDealsResponse {
  items: HighRiskDealRow[];
  total: number;
  meta?: AnalyticsResponseMeta;
}

export interface RiskAlertsResponse {
  items: RiskAlertRow[];
  total: number;
  meta?: AnalyticsResponseMeta;
}

export interface RiskOwnerPerformanceResponse {
  items: RiskOwnerPerformanceRow[];
  meta?: AnalyticsResponseMeta;
}

export interface RiskProjectPerformanceResponse {
  items: RiskProjectPerformanceRow[];
  meta?: AnalyticsResponseMeta;
}

export interface RiskLocationPerformanceResponse {
  items: RiskLocationPerformanceRow[];
  meta?: AnalyticsResponseMeta;
}

export type RiskAnyResponse =
  | RiskSummaryResponse
  | RiskResponseData
  | RiskScoreDistributionResponse
  | RiskCategoryBreakdownResponse
  | RiskTrendResponse
  | HighRiskDealsResponse
  | RiskAlertsResponse
  | RiskOwnerPerformanceResponse
  | RiskProjectPerformanceResponse
  | RiskLocationPerformanceResponse;