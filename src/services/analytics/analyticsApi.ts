import { apiClient } from "../apiClient";

type Primitive = string | number | boolean | null | undefined;
type QueryValue = Primitive | Primitive[];

export type AnalyticsDateRangeKey =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "thisYear"
  | "custom";

export type AnalyticsExportFormat = "csv" | "xlsx" | "pdf" | "json";

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  dateRange?: AnalyticsDateRangeKey;
  compareStartDate?: string;
  compareEndDate?: string;
  compareEnabled?: boolean;
  ownerIds?: string[];
  agentIds?: string[];
  teamIds?: string[];
  sourceIds?: string[];
  campaignIds?: string[];
  projectIds?: string[];
  stageIds?: string[];
  locationIds?: string[];
  statuses?: string[];
  channels?: string[];
  priorities?: string[];
  tags?: string[];
  search?: string;
  segment?: string;
  groupBy?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AnalyticsApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export interface AnalyticsKpi {
  key: string;
  label: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  trend?: "up" | "down" | "neutral";
  format?: "number" | "currency" | "percent" | "duration";
}

export interface AnalyticsChartPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  meta?: Record<string, unknown>;
}

export interface AnalyticsTableRow {
  id?: string | number;
  [key: string]: unknown;
}

export interface AnalyticsSummaryResponse {
  kpis?: AnalyticsKpi[];
  charts?: Record<string, AnalyticsChartPoint[]>;
  tables?: Record<string, AnalyticsTableRow[]>;
  summary?: Record<string, unknown>;
}

export interface LeadAnalyticsResponse extends AnalyticsSummaryResponse {
  totalLeads?: number;
  qualifiedLeads?: number;
  convertedLeads?: number;
  conversionRate?: number;
}

export interface MarketingAnalyticsResponse extends AnalyticsSummaryResponse {
  impressions?: number;
  clicks?: number;
  leadsGenerated?: number;
  costPerLead?: number;
  roi?: number;
}

export interface PipelineAnalyticsResponse extends AnalyticsSummaryResponse {
  totalDeals?: number;
  pipelineValue?: number;
  averageDealSize?: number;
  stageConversionRate?: number;
}

export interface RevenueAnalyticsResponse extends AnalyticsSummaryResponse {
  totalRevenue?: number;
  collectedRevenue?: number;
  pendingRevenue?: number;
  averageRevenuePerDeal?: number;
}

export interface TeamPerformanceAnalyticsResponse
  extends AnalyticsSummaryResponse {
  totalAgents?: number;
  topPerformer?: string;
  averageWinRate?: number;
}

export interface ForecastAnalyticsResponse extends AnalyticsSummaryResponse {
  projectedRevenue?: number;
  committedRevenue?: number;
  forecastAccuracy?: number;
}

export interface AnalyticsSavedView {
  id: string;
  name: string;
  isDefault: boolean;
  filters: AnalyticsFilters;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnalyticsFilterOption {
  label: string;
  value: string;
}

export interface AnalyticsFilterOptionsResponse {
  owners: AnalyticsFilterOption[];
  agents: AnalyticsFilterOption[];
  teams: AnalyticsFilterOption[];
  sources: AnalyticsFilterOption[];
  campaigns: AnalyticsFilterOption[];
  projects: AnalyticsFilterOption[];
  stages: AnalyticsFilterOption[];
  locations: AnalyticsFilterOption[];
  channels: AnalyticsFilterOption[];
  statuses: AnalyticsFilterOption[];
}

export interface AnalyticsDrilldownResponse {
  chartKey: string;
  metricKey?: string;
  label?: string;
  rows: Array<Record<string, unknown>>;
  total: number;
}

export interface AnalyticsKpiComparisonResponse {
  currentPeriod: Record<string, number>;
  previousPeriod: Record<string, number>;
  deltas: Record<string, number>;
}

const ANALYTICS_BASE_PATH = "/analytics";

const isDefined = (value: Primitive): boolean => {
  return value !== undefined && value !== null && value !== "";
};

const appendQueryValue = (
  params: URLSearchParams,
  key: string,
  value: QueryValue
): void => {
  if (Array.isArray(value)) {
    value.forEach((item: Primitive) => {
      if (isDefined(item)) {
        params.append(key, String(item));
      }
    });
    return;
  }

  if (isDefined(value)) {
    params.append(key, String(value));
  }
};

const buildQueryString = (
  query?: Record<string, QueryValue>
): string => {
  if (!query) return "";

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]: [string, QueryValue]) => {
    appendQueryValue(params, key, value);
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

const isEnvelope = <T>(payload: unknown): payload is AnalyticsApiEnvelope<T> => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload
  );
};

const unwrapResponse = <T>(payload: unknown): T => {
  if (isEnvelope<T>(payload)) {
    return payload.data;
  }

  return payload as T;
};

const normalizeFilters = (
  filters?: AnalyticsFilters
): Record<string, QueryValue> => {
  if (!filters) return {};

  return {
    startDate: filters.startDate,
    endDate: filters.endDate,
    dateRange: filters.dateRange,
    compareStartDate: filters.compareStartDate,
    compareEndDate: filters.compareEndDate,
    compareEnabled: filters.compareEnabled,
    ownerIds: filters.ownerIds,
    agentIds: filters.agentIds,
    teamIds: filters.teamIds,
    sourceIds: filters.sourceIds,
    campaignIds: filters.campaignIds,
    projectIds: filters.projectIds,
    stageIds: filters.stageIds,
    locationIds: filters.locationIds,
    statuses: filters.statuses,
    channels: filters.channels,
    priorities: filters.priorities,
    tags: filters.tags,
    search: filters.search,
    segment: filters.segment,
    groupBy: filters.groupBy,
    page: filters.page,
    limit: filters.limit,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };
};

const getAnalytics = async <T>(
  endpoint: string,
  filters?: AnalyticsFilters
): Promise<T> => {
  const query = buildQueryString(normalizeFilters(filters));
  const result = await apiClient.get<AnalyticsApiEnvelope<T> | T>(
    `${ANALYTICS_BASE_PATH}${endpoint}${query}`
  );

  return unwrapResponse<T>(result);
};

const postAnalytics = async <TResponse, TPayload extends object>(
  endpoint: string,
  payload: TPayload
): Promise<TResponse> => {
  const result = await apiClient.post<AnalyticsApiEnvelope<TResponse> | TResponse>(
    `${ANALYTICS_BASE_PATH}${endpoint}`,
    payload
  );

  return unwrapResponse<TResponse>(result);
};

const triggerBlobDownload = (blob: Blob, fileName: string): void => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.URL.revokeObjectURL(url);
};

const resolveExportFileName = (
  section: string,
  format: AnalyticsExportFormat
): string => {
  const safeSection = section.trim().toLowerCase().replace(/\s+/g, "-");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${safeSection}-analytics-${timestamp}.${format}`;
};

const buildExportUrl = (): string => {
  return `${ANALYTICS_BASE_PATH}/export`;
};

export const analyticsApi = {
  getDashboardSummary(filters?: AnalyticsFilters) {
    return getAnalytics<AnalyticsSummaryResponse>("/dashboard", filters);
  },

  getAnalyticsOverview(filters?: AnalyticsFilters) {
    return getAnalytics<AnalyticsSummaryResponse>("/overview", filters);
  },

  getLeadAnalytics(filters?: AnalyticsFilters) {
    return getAnalytics<LeadAnalyticsResponse>("/leads", filters);
  },

  getMarketingAnalytics(filters?: AnalyticsFilters) {
    return getAnalytics<MarketingAnalyticsResponse>("/marketing", filters);
  },

  getPipelineAnalytics(filters?: AnalyticsFilters) {
    return getAnalytics<PipelineAnalyticsResponse>("/pipeline", filters);
  },

  getRevenueAnalytics(filters?: AnalyticsFilters) {
    return getAnalytics<RevenueAnalyticsResponse>("/revenue", filters);
  },

  getTeamPerformanceAnalytics(filters?: AnalyticsFilters) {
    return getAnalytics<TeamPerformanceAnalyticsResponse>(
      "/team-performance",
      filters
    );
  },

  getForecastAnalytics(filters?: AnalyticsFilters) {
    return getAnalytics<ForecastAnalyticsResponse>("/forecast", filters);
  },

  refreshAnalyticsCache(filters?: AnalyticsFilters) {
    return postAnalytics<{ success: boolean; message?: string }, { filters?: AnalyticsFilters }>(
      "/refresh",
      { filters }
    );
  },

  saveAnalyticsView(payload: {
    name: string;
    filters: AnalyticsFilters;
    isDefault?: boolean;
  }) {
    return postAnalytics<AnalyticsSavedView, typeof payload>("/views", payload);
  },

  getSavedAnalyticsViews() {
    return getAnalytics<AnalyticsSavedView[]>("/views");
  },

  async deleteSavedAnalyticsView(viewId: string): Promise<void> {
    await apiClient.delete(`${ANALYTICS_BASE_PATH}/views/${viewId}`);
  },

  async exportAnalytics(payload: {
    section:
      | "dashboard"
      | "forecast"
      | "leads"
      | "marketing"
      | "pipeline"
      | "revenue"
      | "team-performance";
    format: AnalyticsExportFormat;
    filters?: AnalyticsFilters;
    includeCharts?: boolean;
    includeTables?: boolean;
    fileName?: string;
  }): Promise<void> {
    const response = await fetch(buildExportUrl(), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to export analytics: ${response.status}`);
    }

    const blob = await response.blob();
    const fileName =
      payload.fileName ??
      resolveExportFileName(payload.section, payload.format);

    triggerBlobDownload(blob, fileName);
  },

  async exportSection(
    section:
      | "dashboard"
      | "forecast"
      | "leads"
      | "marketing"
      | "pipeline"
      | "revenue"
      | "team-performance",
    format: AnalyticsExportFormat,
    filters?: AnalyticsFilters
  ): Promise<void> {
    await this.exportAnalytics({
      section,
      format,
      filters,
      includeCharts: true,
      includeTables: true,
    });
  },

  getKpiComparison(filters?: AnalyticsFilters) {
    return getAnalytics<AnalyticsKpiComparisonResponse>(
      "/kpi-comparison",
      filters
    );
  },

  getChartDrilldown(payload: {
    chartKey: string;
    metricKey?: string;
    label?: string;
    filters?: AnalyticsFilters;
  }) {
    return postAnalytics<AnalyticsDrilldownResponse, typeof payload>(
      "/drilldown",
      payload
    );
  },

  getFilterOptions() {
    return getAnalytics<AnalyticsFilterOptionsResponse>("/filters");
  },

  buildPresetFilters(dateRange: AnalyticsDateRangeKey): AnalyticsFilters {
    return {
      dateRange,
    };
  },
};

export default analyticsApi;