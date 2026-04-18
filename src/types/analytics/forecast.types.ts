import type {
  AnalyticsFilters,
  AnalyticsKpi,
  AnalyticsResponseMeta,
  AnalyticsSummaryResponse,
  AnalyticsValueFormat,
  AnalyticsTrendDirection,
  AnalyticsTableData,
  AnalyticsChartDataSet,
} from "./analytics.types";

export type ForecastScenarioKey =
  | "best-case"
  | "expected"
  | "worst-case"
  | "committed"
  | "pipeline-weighted";

export type ForecastPeriodGranularity = "daily" | "weekly" | "monthly" | "quarterly";

export type ForecastRiskLevel = "low" | "medium" | "high";

export type ForecastAccuracyTrend = AnalyticsTrendDirection;

export interface ForecastFilters extends AnalyticsFilters {
  granularity?: ForecastPeriodGranularity;
  scenario?: ForecastScenarioKey;
  includeClosedWon?: boolean;
  includeOpenPipeline?: boolean;
  includeConfidenceRange?: boolean;
  probabilityThreshold?: number;
}

export interface ForecastScenarioValue {
  scenario: ForecastScenarioKey;
  value: number;
  label?: string;
  confidenceScore?: number;
}

export interface ForecastConfidenceRange {
  lowerBound: number;
  expected: number;
  upperBound: number;
}

export interface ForecastPeriodPoint {
  periodKey: string;
  periodLabel: string;
  date?: string;
  projectedRevenue: number;
  committedRevenue?: number;
  actualRevenue?: number;
  weightedPipelineRevenue?: number;
  confidenceRange?: ForecastConfidenceRange;
  variance?: number;
  variancePercent?: number;
  meta?: Record<string, unknown>;
}

export interface ForecastStageContribution {
  stageId: string;
  stageLabel: string;
  opportunityCount: number;
  pipelineValue: number;
  weightedValue: number;
  averageProbability?: number;
  riskLevel?: ForecastRiskLevel;
}

export interface ForecastOwnerContribution {
  ownerId: string;
  ownerName: string;
  opportunityCount: number;
  committedRevenue: number;
  projectedRevenue: number;
  actualRevenue?: number;
  winRate?: number;
  averageDealSize?: number;
}

export interface ForecastProjectContribution {
  projectId: string;
  projectName: string;
  locationName?: string;
  opportunityCount: number;
  committedRevenue: number;
  projectedRevenue: number;
  weightedRevenue?: number;
}

export interface ForecastAccuracySnapshot {
  periodLabel: string;
  forecastValue: number;
  actualValue: number;
  variance: number;
  variancePercent: number;
}

export interface ForecastScenarioBreakdown {
  scenario: ForecastScenarioKey;
  label: string;
  projectedRevenue: number;
  confidenceScore?: number;
  description?: string;
}

export interface ForecastSummaryMetrics {
  projectedRevenue: number;
  committedRevenue: number;
  bestCaseRevenue: number;
  worstCaseRevenue: number;
  weightedPipelineRevenue: number;
  forecastAccuracy?: number;
  coverageRatio?: number;
  attainmentGap?: number;
}

export interface ForecastKpi extends AnalyticsKpi {
  scenario?: ForecastScenarioKey;
}

export interface ForecastChartSeriesPoint {
  label: string;
  value: number;
  lowerBound?: number;
  upperBound?: number;
  actualValue?: number;
  meta?: Record<string, unknown>;
}

export interface ForecastTrendChart {
  key: string;
  title: string;
  description?: string;
  points: ForecastChartSeriesPoint[];
  format?: AnalyticsValueFormat;
}

export interface ForecastScenarioComparisonTableRow {
  id: string;
  scenario: ForecastScenarioKey;
  label: string;
  projectedRevenue: number;
  confidenceScore?: number;
  differenceFromExpected?: number;
  differencePercentFromExpected?: number;
}

export interface ForecastPipelineRiskRow {
  id: string;
  dealId: string;
  dealName: string;
  ownerName?: string;
  stageLabel: string;
  expectedCloseDate?: string;
  pipelineValue: number;
  weightedValue: number;
  probability: number;
  riskLevel: ForecastRiskLevel;
}

export interface ForecastSummaryResponse extends AnalyticsSummaryResponse {
  projectedRevenue?: number;
  committedRevenue?: number;
  bestCaseRevenue?: number;
  worstCaseRevenue?: number;
  weightedPipelineRevenue?: number;
  forecastAccuracy?: number;
  scenarioBreakdown?: ForecastScenarioBreakdown[];
  timeline?: ForecastPeriodPoint[];
  stageContributions?: ForecastStageContribution[];
  ownerContributions?: ForecastOwnerContribution[];
  projectContributions?: ForecastProjectContribution[];
  accuracySnapshots?: ForecastAccuracySnapshot[];
}

export interface ForecastResponseData {
  kpis: ForecastKpi[];
  metrics: ForecastSummaryMetrics;
  scenarioBreakdown: ForecastScenarioBreakdown[];
  timeline: ForecastPeriodPoint[];
  stageContributions: ForecastStageContribution[];
  ownerContributions: ForecastOwnerContribution[];
  projectContributions: ForecastProjectContribution[];
  accuracySnapshots: ForecastAccuracySnapshot[];
  charts?: Record<string, AnalyticsChartDataSet>;
  tables?: Record<string, AnalyticsTableData>;
  meta?: AnalyticsResponseMeta;
}

export interface ForecastScenarioRequest {
  filters?: ForecastFilters;
  scenario?: ForecastScenarioKey;
  granularity?: ForecastPeriodGranularity;
}

export interface ForecastScenarioResponse {
  scenarios: ForecastScenarioValue[];
  selectedScenario?: ForecastScenarioKey;
  meta?: AnalyticsResponseMeta;
}

export interface ForecastAccuracyResponse {
  currentAccuracy: number;
  previousAccuracy?: number;
  trend?: ForecastAccuracyTrend;
  snapshots: ForecastAccuracySnapshot[];
  meta?: AnalyticsResponseMeta;
}

export interface ForecastInsightsCard {
  key: string;
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: AnalyticsTrendDirection;
  changePercent?: number;
  format?: AnalyticsValueFormat | "text";
  description?: string;
}

export interface ForecastWidgetBundle {
  summaryCards: ForecastInsightsCard[];
  trendChart?: ForecastTrendChart;
  scenarioTable?: ForecastScenarioComparisonTableRow[];
  riskTable?: ForecastPipelineRiskRow[];
}

export type ForecastAnyResponse =
  | ForecastSummaryResponse
  | ForecastResponseData
  | ForecastScenarioResponse
  | ForecastAccuracyResponse;