// src/services/communications/analyticsApi.ts

import api from "../../prisma/client";

export type DateRangePreset =
  | "today"
  | "yesterday"
  | "last7Days"
  | "last30Days"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "thisYear"
  | "custom";

export type AnalyticsScope = "all" | "team" | "user";

export type AnalyticsFilters = {
  startDate?: string;
  endDate?: string;
  preset?: DateRangePreset;
  ownerId?: string;
  teamId?: string;
  pipelineId?: string;
  sourceId?: string;
  status?: string;
  channel?: string;
  scope?: AnalyticsScope;
  search?: string;
};

export type StatChangeDirection = "up" | "down" | "neutral";

export type KPIStat = {
  key: string;
  label: string;
  value: number;
  formattedValue?: string;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  changeDirection?: StatChangeDirection;
  color?: string;
  icon?: string;
};

export type DashboardSummary = {
  totalLeads: number;
  qualifiedLeads: number;
  totalContacts: number;
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  totalRevenue: number;
  expectedRevenue: number;
  tasksDueToday: number;
  overdueTasks: number;
  emailsSent: number;
  messagesSent: number;
  callsLogged: number;
  conversionRate: number;
};

export type TrendPoint = {
  date: string;
  value: number;
  label?: string;
};

export type MultiSeriesTrendPoint = {
  date: string;
  [seriesKey: string]: string | number | undefined;
};

export type SourcePerformanceItem = {
  sourceId: string;
  sourceName: string;
  leads: number;
  qualified: number;
  deals: number;
  revenue: number;
  conversionRate: number;
};

export type PipelineStageAnalytics = {
  stageId: string;
  stageName: string;
  count: number;
  value: number;
  color?: string;
  order?: number;
};

export type DealAnalyticsItem = {
  dealId: string;
  title: string;
  contactName?: string;
  ownerName?: string;
  stageName: string;
  amount: number;
  probability?: number;
  expectedCloseDate?: string;
  status?: string;
};

export type UserPerformanceItem = {
  userId: string;
  userName: string;
  leads: number;
  qualifiedLeads: number;
  dealsWon: number;
  dealsLost: number;
  revenue: number;
  calls: number;
  emails: number;
  messages: number;
  tasksCompleted: number;
  conversionRate: number;
};

export type TaskAnalyticsSummary = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueToday: number;
  completionRate: number;
};

export type CommunicationAnalyticsSummary = {
  totalEmails: number;
  totalMessages: number;
  totalCalls: number;
  deliveredEmails: number;
  bouncedEmails: number;
  failedMessages: number;
  repliedEmails: number;
  inboundMessages: number;
  outboundMessages: number;
  averageResponseTimeMinutes: number;
};

export type ActivityAnalyticsSummary = {
  totalActivities: number;
  notes: number;
  calls: number;
  emails: number;
  messages: number;
  meetings: number;
  tasks: number;
};

export type RevenueTrendSummary = {
  totalRevenue: number;
  wonRevenue: number;
  expectedRevenue: number;
  averageDealSize: number;
};

export type ConversionFunnelItem = {
  step: string;
  count: number;
  conversionRateFromPrevious?: number;
  conversionRateFromStart?: number;
};

export type AnalyticsExportFormat = "csv" | "xlsx" | "pdf";

export type PaginatedAnalyticsParams = AnalyticsFilters & {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AnalyticsOverviewResponse = {
  summary: DashboardSummary;
  kpis: KPIStat[];
  leadTrend: TrendPoint[];
  revenueTrend: TrendPoint[];
  pipeline: PipelineStageAnalytics[];
  topSources: SourcePerformanceItem[];
  topPerformers: UserPerformanceItem[];
};

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return {};

  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0),
    ),
  );
}

function toQueryString(params?: Record<string, unknown>) {
  const cleaned = cleanParams(params);
  const searchParams = new URLSearchParams();

  Object.entries(cleaned).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }

    searchParams.append(key, String(value));
  });

  return searchParams.toString();
}

async function downloadBlob(
  url: string,
  params?: Record<string, unknown>,
): Promise<Blob> {
  const query = toQueryString(params);
  const finalUrl = query ? `${url}?${query}` : url;

  const response = await api.get<Blob>(finalUrl, {
    responseType: "blob",
  });

  return response.data;
}

const analyticsApi = {
  async getOverview(
    filters?: AnalyticsFilters,
  ): Promise<AnalyticsOverviewResponse> {
    const response = await api.get<AnalyticsOverviewResponse>(
      "/analytics/overview",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getDashboardSummary(
    filters?: AnalyticsFilters,
  ): Promise<DashboardSummary> {
    const response = await api.get<DashboardSummary>("/analytics/summary", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async getKPIStats(filters?: AnalyticsFilters): Promise<KPIStat[]> {
    const response = await api.get<KPIStat[]>("/analytics/kpis", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async getLeadTrend(filters?: AnalyticsFilters): Promise<TrendPoint[]> {
    const response = await api.get<TrendPoint[]>("/analytics/trends/leads", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async getRevenueTrend(filters?: AnalyticsFilters): Promise<TrendPoint[]> {
    const response = await api.get<TrendPoint[]>("/analytics/trends/revenue", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async getConversionTrend(
    filters?: AnalyticsFilters,
  ): Promise<TrendPoint[]> {
    const response = await api.get<TrendPoint[]>(
      "/analytics/trends/conversion",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getPipelineAnalytics(
    filters?: AnalyticsFilters,
  ): Promise<PipelineStageAnalytics[]> {
    const response = await api.get<PipelineStageAnalytics[]>(
      "/analytics/pipeline",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getLeadSourcePerformance(
    filters?: AnalyticsFilters,
  ): Promise<SourcePerformanceItem[]> {
    const response = await api.get<SourcePerformanceItem[]>(
      "/analytics/sources",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getTopPerformers(
    filters?: AnalyticsFilters,
  ): Promise<UserPerformanceItem[]> {
    const response = await api.get<UserPerformanceItem[]>(
      "/analytics/performers/top",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getUserPerformance(
    params?: PaginatedAnalyticsParams,
  ): Promise<PaginatedResponse<UserPerformanceItem>> {
    const response = await api.get<PaginatedResponse<UserPerformanceItem>>(
      "/analytics/performers",
      {
        params: cleanParams(params),
      },
    );

    return response.data;
  },

  async getDealAnalytics(
    params?: PaginatedAnalyticsParams,
  ): Promise<PaginatedResponse<DealAnalyticsItem>> {
    const response = await api.get<PaginatedResponse<DealAnalyticsItem>>(
      "/analytics/deals",
      {
        params: cleanParams(params),
      },
    );

    return response.data;
  },

  async getTaskSummary(
    filters?: AnalyticsFilters,
  ): Promise<TaskAnalyticsSummary> {
    const response = await api.get<TaskAnalyticsSummary>("/analytics/tasks", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async getCommunicationSummary(
    filters?: AnalyticsFilters,
  ): Promise<CommunicationAnalyticsSummary> {
    const response = await api.get<CommunicationAnalyticsSummary>(
      "/analytics/communications",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getCommunicationTrend(
    filters?: AnalyticsFilters,
  ): Promise<MultiSeriesTrendPoint[]> {
    const response = await api.get<MultiSeriesTrendPoint[]>(
      "/analytics/communications/trend",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getActivitySummary(
    filters?: AnalyticsFilters,
  ): Promise<ActivityAnalyticsSummary> {
    const response = await api.get<ActivityAnalyticsSummary>(
      "/analytics/activities",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getActivityTrend(
    filters?: AnalyticsFilters,
  ): Promise<MultiSeriesTrendPoint[]> {
    const response = await api.get<MultiSeriesTrendPoint[]>(
      "/analytics/activities/trend",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getRevenueSummary(
    filters?: AnalyticsFilters,
  ): Promise<RevenueTrendSummary> {
    const response = await api.get<RevenueTrendSummary>(
      "/analytics/revenue/summary",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getSalesFunnel(
    filters?: AnalyticsFilters,
  ): Promise<ConversionFunnelItem[]> {
    const response = await api.get<ConversionFunnelItem[]>(
      "/analytics/funnel",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getLeadAging(
    filters?: AnalyticsFilters,
  ): Promise<MultiSeriesTrendPoint[]> {
    const response = await api.get<MultiSeriesTrendPoint[]>(
      "/analytics/leads/aging",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getResponseTimeAnalytics(
    filters?: AnalyticsFilters,
  ): Promise<TrendPoint[]> {
    const response = await api.get<TrendPoint[]>(
      "/analytics/communications/response-time",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async exportOverview(
    format: AnalyticsExportFormat,
    filters?: AnalyticsFilters,
  ): Promise<Blob> {
    return downloadBlob("/analytics/export/overview", {
      format,
      ...filters,
    });
  },

  async exportDeals(
    format: AnalyticsExportFormat,
    params?: PaginatedAnalyticsParams,
  ): Promise<Blob> {
    return downloadBlob("/analytics/export/deals", {
      format,
      ...params,
    });
  },

  async exportUserPerformance(
    format: AnalyticsExportFormat,
    params?: PaginatedAnalyticsParams,
  ): Promise<Blob> {
    return downloadBlob("/analytics/export/performers", {
      format,
      ...params,
    });
  },

  async exportCommunications(
    format: AnalyticsExportFormat,
    filters?: AnalyticsFilters,
  ): Promise<Blob> {
    return downloadBlob("/analytics/export/communications", {
      format,
      ...filters,
    });
  },
};

export default analyticsApi;
export { cleanParams, toQueryString };