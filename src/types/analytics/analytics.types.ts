export type AnalyticsSectionKey =
  | "dashboard"
  | "overview"
  | "forecast"
  | "leads"
  | "marketing"
  | "pipeline"
  | "revenue"
  | "team-performance";

export type AnalyticsDateRangeKey =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "last90days"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "thisYear"
  | "lastYear"
  | "custom";

export type AnalyticsSortOrder = "asc" | "desc";

export type AnalyticsValueFormat =
  | "number"
  | "currency"
  | "percent"
  | "duration"
  | "compact";

export type AnalyticsTrendDirection = "up" | "down" | "neutral";

export type AnalyticsChartType =
  | "line"
  | "bar"
  | "area"
  | "pie"
  | "donut"
  | "funnel"
  | "radar"
  | "scatter"
  | "table"
  | "metric";

export type AnalyticsExportFormat = "csv" | "xlsx" | "pdf" | "json";

export type AnalyticsCompareMode = "none" | "previous-period" | "custom";

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  dateRange?: AnalyticsDateRangeKey;

  compareEnabled?: boolean;
  compareMode?: AnalyticsCompareMode;
  compareStartDate?: string;
  compareEndDate?: string;

  ownerIds?: string[];
  agentIds?: string[];
  teamIds?: string[];
  sourceIds?: string[];
  campaignIds?: string[];
  projectIds?: string[];
  projectTypes?: string[];
  stageIds?: string[];
  locationIds?: string[];
  statuses?: string[];
  priorities?: string[];
  channels?: string[];
  tags?: string[];

  segment?: string;
  search?: string;
  groupBy?: string;

  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: AnalyticsSortOrder;
}

export interface AnalyticsApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data: T;
  meta?: AnalyticsResponseMeta;
}

export interface AnalyticsResponseMeta {
  generatedAt?: string;
  cached?: boolean;
  cacheKey?: string;
  executionTimeMs?: number;
  page?: number;
  limit?: number;
  total?: number;
}

export interface AnalyticsKpi {
  key: string;
  label: string;
  value: number;
  previousValue?: number;
  targetValue?: number;
  change?: number;
  changePercent?: number;
  trend?: AnalyticsTrendDirection;
  format?: AnalyticsValueFormat;
  prefix?: string;
  suffix?: string;
  description?: string;
  colorToken?: string;
}

export interface AnalyticsSummaryCard {
  key: string;
  title: string;
  value: number;
  format?: AnalyticsValueFormat;
  subtitle?: string;
  change?: number;
  changePercent?: number;
  trend?: AnalyticsTrendDirection;
  icon?: string;
}

export interface AnalyticsChartSeriesPoint {
  x: string | number;
  y: number;
  label?: string;
  meta?: Record<string, unknown>;
}

export interface AnalyticsChartSeries {
  key: string;
  label: string;
  color?: string;
  points: AnalyticsChartSeriesPoint[];
}

export interface AnalyticsChartPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  targetValue?: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  meta?: Record<string, unknown>;
}

export interface AnalyticsChartDataSet {
  key: string;
  title: string;
  type: AnalyticsChartType;
  description?: string;
  xAxisKey?: string;
  yAxisKey?: string;
  series?: AnalyticsChartSeries[];
  points?: AnalyticsChartPoint[];
  total?: number;
  meta?: Record<string, unknown>;
}

export interface AnalyticsTableColumn {
  key: string;
  label: string;
  format?: AnalyticsValueFormat | "text" | "date" | "datetime" | "badge";
  align?: "left" | "center" | "right";
  width?: number | string;
  sortable?: boolean;
}

export interface AnalyticsTableRow {
  id: string | number;
  [key: string]: unknown;
}

export interface AnalyticsTableData {
  key: string;
  title: string;
  columns: AnalyticsTableColumn[];
  rows: AnalyticsTableRow[];
  total?: number;
}

export interface AnalyticsSummaryResponse {
  kpis?: AnalyticsKpi[];
  summaryCards?: AnalyticsSummaryCard[];
  charts?: Record<string, AnalyticsChartDataSet>;
  tables?: Record<string, AnalyticsTableData>;
  summary?: Record<string, unknown>;
  meta?: AnalyticsResponseMeta;
}

export interface DashboardAnalyticsResponse extends AnalyticsSummaryResponse {
  businessHealthScore?: number;
  leadVelocity?: number;
  pipelineCoverage?: number;
}

export interface LeadAnalyticsResponse extends AnalyticsSummaryResponse {
  totalLeads?: number;
  qualifiedLeads?: number;
  lostLeads?: number;
  convertedLeads?: number;
  conversionRate?: number;
  averageQualificationTime?: number;
}

export interface MarketingAnalyticsResponse extends AnalyticsSummaryResponse {
  impressions?: number;
  clicks?: number;
  clickThroughRate?: number;
  leadsGenerated?: number;
  qualifiedLeads?: number;
  costPerLead?: number;
  costPerQualifiedLead?: number;
  roi?: number;
}

export interface PipelineAnalyticsResponse extends AnalyticsSummaryResponse {
  totalDeals?: number;
  openDeals?: number;
  wonDeals?: number;
  lostDeals?: number;
  pipelineValue?: number;
  weightedPipelineValue?: number;
  averageDealSize?: number;
  stageConversionRate?: number;
}

export interface RevenueAnalyticsResponse extends AnalyticsSummaryResponse {
  totalRevenue?: number;
  collectedRevenue?: number;
  pendingRevenue?: number;
  overdueRevenue?: number;
  averageRevenuePerDeal?: number;
  revenueGrowthRate?: number;
}

export interface TeamPerformanceAnalyticsResponse
  extends AnalyticsSummaryResponse {
  totalAgents?: number;
  activeAgents?: number;
  topPerformer?: string;
  averageWinRate?: number;
  averageResponseTime?: number;
}

export interface ForecastAnalyticsResponse extends AnalyticsSummaryResponse {
  projectedRevenue?: number;
  committedRevenue?: number;
  bestCaseRevenue?: number;
  worstCaseRevenue?: number;
  forecastAccuracy?: number;
}

export interface AnalyticsFilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface AnalyticsFilterOptionsResponse {
  owners?: AnalyticsFilterOption[];
  agents?: AnalyticsFilterOption[];
  teams?: AnalyticsFilterOption[];
  sources?: AnalyticsFilterOption[];
  campaigns?: AnalyticsFilterOption[];
  projects?: AnalyticsFilterOption[];
  projectTypes?: AnalyticsFilterOption[];
  stages?: AnalyticsFilterOption[];
  locations?: AnalyticsFilterOption[];
  channels?: AnalyticsFilterOption[];
  statuses?: AnalyticsFilterOption[];
  priorities?: AnalyticsFilterOption[];
  tags?: AnalyticsFilterOption[];
}

export interface AnalyticsSavedView {
  id: string;
  name: string;
  section: AnalyticsSectionKey;
  description?: string;
  filters: AnalyticsFilters;
  isDefault?: boolean;
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnalyticsDrilldownRequest {
  chartKey: string;
  metricKey?: string;
  label?: string;
  filters?: AnalyticsFilters;
}

export interface AnalyticsDrilldownResponse {
  chartKey: string;
  metricKey?: string;
  label?: string;
  rows: Array<Record<string, unknown>>;
  total: number;
  meta?: AnalyticsResponseMeta;
}

export interface AnalyticsKpiComparisonResponse {
  currentPeriod: Record<string, number>;
  previousPeriod: Record<string, number>;
  deltas: Record<string, number>;
}

export interface AnalyticsExportRequest {
  section: AnalyticsSectionKey;
  format: AnalyticsExportFormat;
  filters?: AnalyticsFilters;
  includeCharts?: boolean;
  includeTables?: boolean;
  fileName?: string;
}

export interface AnalyticsComparePeriod {
  startDate?: string;
  endDate?: string;
  label?: string;
}

export interface AnalyticsDateRangeOption {
  label: string;
  value: AnalyticsDateRangeKey;
}

export interface AnalyticsSectionDefinition {
  key: AnalyticsSectionKey;
  title: string;
  description?: string;
  route?: string;
}

export interface AnalyticsWidgetConfig {
  key: string;
  title: string;
  section: AnalyticsSectionKey;
  chartType?: AnalyticsChartType;
  metricKey?: string;
  chartKey?: string;
  tableKey?: string;
  colSpan?: number;
  description?: string;
}

export interface AnalyticsStateStatus {
  isLoading: boolean;
  isRefreshing?: boolean;
  isError: boolean;
  errorMessage?: string | null;
  lastUpdatedAt?: string | null;
}

export interface AnalyticsCacheEntry<T = unknown> {
  key: string;
  value: T;
  createdAt: number;
  expiresAt: number | null;
}

export interface AnalyticsMappedKpi {
  key: string;
  label: string;
  displayValue: string;
  rawValue: number;
  changePercent?: number;
  trend?: AnalyticsTrendDirection;
  format?: AnalyticsValueFormat;
}

export interface AnalyticsMappedChartPoint {
  label: string;
  value: number;
  formattedValue?: string;
  secondaryValue?: number;
  formattedSecondaryValue?: string;
  meta?: Record<string, unknown>;
}

export interface AnalyticsMappedTableRow extends AnalyticsTableRow {
  __rowKey?: string;
}

export type AnalyticsAnySectionResponse =
  | DashboardAnalyticsResponse
  | AnalyticsSummaryResponse
  | ForecastAnalyticsResponse
  | LeadAnalyticsResponse
  | MarketingAnalyticsResponse
  | PipelineAnalyticsResponse
  | RevenueAnalyticsResponse
  | TeamPerformanceAnalyticsResponse;