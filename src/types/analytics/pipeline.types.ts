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

export type PipelineStageKey =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "site-visit"
  | "negotiation"
  | "booking"
  | "won"
  | "lost";

export type PipelineRiskLevel = "low" | "medium" | "high";
export type PipelineVelocityBand = "slow" | "normal" | "fast";
export type PipelineDealStatus = "open" | "won" | "lost" | "stalled";
export type PipelineViewMode = "count" | "value";
export type PipelineConversionTrend = AnalyticsTrendDirection;

export interface PipelineFilters extends AnalyticsFilters {
  stageKeys?: PipelineStageKey[];
  ownerIds?: string[];
  teamIds?: string[];
  projectIds?: string[];
  locations?: string[];
  minDealValue?: number;
  maxDealValue?: number;
  riskLevels?: PipelineRiskLevel[];
  includeWon?: boolean;
  includeLost?: boolean;
  includeStalled?: boolean;
  agingThresholdDays?: number;
  viewMode?: PipelineViewMode;
}

export interface PipelineKpi extends AnalyticsKpi {
  benchmarkValue?: number;
  benchmarkLabel?: string;
}

export interface PipelineSummaryMetrics {
  totalOpenDeals: number;
  totalPipelineValue: number;
  weightedPipelineValue?: number;
  averageDealValue?: number;
  averageSalesCycleDays?: number;
  stageToWinConversionRate?: number;
  overallWinRate?: number;
  stuckDealsCount?: number;
  stuckDealsValue?: number;
  lostDealsCount?: number;
  lostDealsValue?: number;
}

export interface PipelineStageSummary {
  stageKey: PipelineStageKey;
  stageLabel: string;
  order: number;
  dealCount: number;
  totalValue: number;
  weightedValue?: number;
  averageProbability?: number;
  averageDaysInStage?: number;
  conversionRateToNext?: number;
  dropOffRate?: number;
  dropOffCount?: number;
  riskLevel?: PipelineRiskLevel;
}

export interface PipelineStageTrendPoint {
  periodKey: string;
  periodLabel: string;
  stageKey: PipelineStageKey;
  stageLabel: string;
  dealCount: number;
  totalValue: number;
}

export interface PipelineConversionPoint {
  stageKey: PipelineStageKey;
  stageLabel: string;
  enteredCount: number;
  advancedCount: number;
  droppedCount?: number;
  conversionRate: number;
  dropOffRate?: number;
}

export interface PipelineDropOffRow {
  id: string;
  stageKey: PipelineStageKey;
  stageLabel: string;
  droppedCount: number;
  droppedValue?: number;
  dropOffRate: number;
  topReason?: string;
}

export interface PipelineStuckDealRow {
  id: string;
  dealId: string;
  dealName: string;
  ownerId?: string;
  ownerName?: string;
  projectId?: string;
  projectName?: string;
  stageKey: PipelineStageKey;
  stageLabel: string;
  dealValue: number;
  probability?: number;
  daysInStage: number;
  daysSinceLastActivity?: number;
  expectedCloseDate?: string;
  riskLevel: PipelineRiskLevel;
  velocityBand?: PipelineVelocityBand;
}

export interface PipelineAgingBucket {
  label: string;
  minDays?: number;
  maxDays?: number;
  dealCount: number;
  totalValue?: number;
}

export interface PipelineOwnerPerformanceRow {
  ownerId: string;
  ownerName: string;
  openDeals: number;
  pipelineValue: number;
  weightedPipelineValue?: number;
  wonDeals?: number;
  wonValue?: number;
  winRate?: number;
  averageDealCycleDays?: number;
}

export interface PipelineProjectPerformanceRow {
  projectId: string;
  projectName: string;
  locationLabel?: string;
  openDeals: number;
  pipelineValue: number;
  weightedValue?: number;
  wonDeals?: number;
  wonValue?: number;
  conversionRate?: number;
}

export interface PipelineLocationPerformanceRow {
  locationKey: string;
  locationLabel: string;
  openDeals: number;
  pipelineValue: number;
  wonDeals?: number;
  wonValue?: number;
  averageDealValue?: number;
}

export interface PipelineTrendPoint {
  periodKey: string;
  periodLabel: string;
  openDeals: number;
  pipelineValue: number;
  weightedPipelineValue?: number;
  wonDeals?: number;
  wonValue?: number;
  lostDeals?: number;
  lostValue?: number;
}

export interface PipelineWinLossSnapshot {
  label: string;
  wonDeals: number;
  lostDeals: number;
  wonValue?: number;
  lostValue?: number;
  winRate?: number;
}

export interface PipelineFunnelMetric {
  stageKey: PipelineStageKey;
  stageLabel: string;
  count: number;
  value?: number;
  conversionRateFromPrevious?: number;
  conversionRateFromTop?: number;
  dropOffCount?: number;
  dropOffRate?: number;
}

export interface PipelineInsightCard {
  key: string;
  title: string;
  value: number | string;
  subtitle?: string;
  description?: string;
  trend?: AnalyticsTrendDirection;
  changePercent?: number;
  format?: AnalyticsValueFormat | "text";
}

export interface PipelineResponseData {
  kpis: PipelineKpi[];
  metrics: PipelineSummaryMetrics;
  stageSummary: PipelineStageSummary[];
  stageTrend?: PipelineStageTrendPoint[];
  conversion: PipelineConversionPoint[];
  dropOff: PipelineDropOffRow[];
  stuckDeals: PipelineStuckDealRow[];
  aging: PipelineAgingBucket[];
  ownerPerformance?: PipelineOwnerPerformanceRow[];
  projectPerformance?: PipelineProjectPerformanceRow[];
  locationPerformance?: PipelineLocationPerformanceRow[];
  trend?: PipelineTrendPoint[];
  winLoss?: PipelineWinLossSnapshot[];
  funnel?: PipelineFunnelMetric[];
  insightCards?: PipelineInsightCard[];
  charts?: Record<string, AnalyticsChartDataSet>;
  tables?: Record<string, AnalyticsTableData>;
  meta?: AnalyticsResponseMeta;
}

export interface PipelineSummaryResponse extends AnalyticsSummaryResponse {
  totalOpenDeals?: number;
  totalPipelineValue?: number;
  weightedPipelineValue?: number;
  averageDealValue?: number;
  averageSalesCycleDays?: number;
  overallWinRate?: number;
  stageToWinConversionRate?: number;
  stuckDealsCount?: number;
  stuckDealsValue?: number;
  lostDealsCount?: number;
  lostDealsValue?: number;
}

export interface PipelineStageResponse {
  items: PipelineStageSummary[];
  meta?: AnalyticsResponseMeta;
}

export interface PipelineConversionResponse {
  items: PipelineConversionPoint[];
  meta?: AnalyticsResponseMeta;
}

export interface PipelineDropOffResponse {
  items: PipelineDropOffRow[];
  meta?: AnalyticsResponseMeta;
}

export interface PipelineStuckDealsResponse {
  items: PipelineStuckDealRow[];
  total: number;
  meta?: AnalyticsResponseMeta;
}

export interface PipelineAgingResponse {
  items: PipelineAgingBucket[];
  meta?: AnalyticsResponseMeta;
}

export interface PipelineOwnerPerformanceResponse {
  items: PipelineOwnerPerformanceRow[];
  meta?: AnalyticsResponseMeta;
}

export interface PipelineProjectPerformanceResponse {
  items: PipelineProjectPerformanceRow[];
  meta?: AnalyticsResponseMeta;
}

export interface PipelineWinLossResponse {
  items: PipelineWinLossSnapshot[];
  meta?: AnalyticsResponseMeta;
}

export type PipelineAnyResponse =
  | PipelineSummaryResponse
  | PipelineResponseData
  | PipelineStageResponse
  | PipelineConversionResponse
  | PipelineDropOffResponse
  | PipelineStuckDealsResponse
  | PipelineAgingResponse
  | PipelineOwnerPerformanceResponse
  | PipelineProjectPerformanceResponse
  | PipelineWinLossResponse;