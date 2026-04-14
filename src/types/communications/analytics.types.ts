// src/types/analytics.types.ts

export type AnalyticsDatePreset =
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

export type AnalyticsMetricDirection = "up" | "down" | "neutral";

export type AnalyticsSortOrder = "asc" | "desc";

export type AnalyticsFilters = {
  startDate?: string;
  endDate?: string;
  preset?: AnalyticsDatePreset;
  scope?: AnalyticsScope;
  ownerId?: string;
  userId?: string;
  teamId?: string;
  pipelineId?: string;
  sourceId?: string;
  channel?: string;
  status?: string;
  search?: string;
};

export type AnalyticsKpiCard = {
  key: string;
  label: string;
  value: number;
  formattedValue?: string;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  direction?: AnalyticsMetricDirection;
  icon?: string;
  color?: string;
  helperText?: string;
};

export type AnalyticsSummary = {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  totalContacts: number;
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  totalRevenue: number;
  wonRevenue: number;
  expectedRevenue: number;
  averageDealSize: number;
  conversionRate: number;
  tasksDueToday: number;
  overdueTasks: number;
  completedTasks: number;
  emailsSent: number;
  messagesSent: number;
  callsLogged: number;
  meetingsBooked: number;
};

export type AnalyticsTrendPoint = {
  date: string;
  label?: string;
  value: number;
};

export type AnalyticsMultiSeriesPoint = {
  date: string;
  label?: string;
  [seriesKey: string]: string | number | undefined;
};

export type AnalyticsFunnelStep = {
  key: string;
  label: string;
  count: number;
  conversionRateFromPrevious?: number;
  conversionRateFromStart?: number;
};

export type PipelineAnalyticsItem = {
  stageId: string;
  stageName: string;
  count: number;
  value: number;
  order?: number;
  color?: string;
};

export type SourceAnalyticsItem = {
  sourceId: string;
  sourceName: string;
  leads: number;
  qualifiedLeads: number;
  deals: number;
  wonDeals: number;
  revenue: number;
  conversionRate: number;
};

export type TeamPerformanceItem = {
  userId: string;
  userName: string;
  email?: string;
  avatarUrl?: string;
  leads: number;
  qualifiedLeads: number;
  dealsWon: number;
  dealsLost: number;
  openDeals: number;
  revenue: number;
  calls: number;
  emails: number;
  messages: number;
  followUpsCompleted: number;
  conversionRate: number;
};

export type DealAnalyticsItem = {
  dealId: string;
  title: string;
  contactName?: string;
  ownerId?: string;
  ownerName?: string;
  stageId?: string;
  stageName?: string;
  amount: number;
  expectedRevenue?: number;
  probability?: number;
  status?: string;
  expectedCloseDate?: string;
  closedAt?: string;
};

export type CommunicationAnalyticsSummary = {
  totalEmails: number;
  deliveredEmails: number;
  openedEmails: number;
  clickedEmails: number;
  repliedEmails: number;
  bouncedEmails: number;
  failedEmails: number;
  totalMessages: number;
  deliveredMessages: number;
  readMessages: number;
  failedMessages: number;
  inboundMessages: number;
  outboundMessages: number;
  callsLogged: number;
  averageResponseTimeMinutes: number;
};

export type ActivityAnalyticsSummary = {
  totalActivities: number;
  notes: number;
  calls: number;
  emails: number;
  messages: number;
  meetings: number;
  followUps: number;
  tasks: number;
};

export type TaskAnalyticsSummary = {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  dueToday: number;
  completionRate: number;
};

export type RevenueAnalyticsSummary = {
  totalRevenue: number;
  wonRevenue: number;
  expectedRevenue: number;
  averageDealSize: number;
  monthlyRecurringRevenue?: number;
};

export type LeadStatusDistributionItem = {
  status: string;
  label?: string;
  count: number;
  color?: string;
};

export type ChannelPerformanceItem = {
  channel: string;
  sent: number;
  delivered: number;
  failed: number;
  replied?: number;
  responseRate?: number;
};

export type AnalyticsOverviewResponse = {
  summary: AnalyticsSummary;
  kpis: AnalyticsKpiCard[];
  leadTrend: AnalyticsTrendPoint[];
  revenueTrend: AnalyticsTrendPoint[];
  pipelineDistribution: PipelineAnalyticsItem[];
  topSources: SourceAnalyticsItem[];
  topPerformers: TeamPerformanceItem[];
};

export type RevenueAnalyticsResponse = {
  summary: RevenueAnalyticsSummary;
  revenueTrend: AnalyticsTrendPoint[];
  monthlyRevenue: AnalyticsTrendPoint[];
  wonVsLostTrend: AnalyticsMultiSeriesPoint[];
  topDeals: DealAnalyticsItem[];
};

export type LeadAnalyticsResponse = {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  leadTrend: AnalyticsTrendPoint[];
  sourcePerformance: SourceAnalyticsItem[];
  statusDistribution: LeadStatusDistributionItem[];
  funnel: AnalyticsFunnelStep[];
};

export type DealAnalyticsResponse = {
  summary: RevenueAnalyticsSummary;
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  averageDealSize: number;
  stageDistribution: PipelineAnalyticsItem[];
  dealsTrend: AnalyticsTrendPoint[];
  topDeals: DealAnalyticsItem[];
};

export type CommunicationAnalyticsResponse = {
  summary: CommunicationAnalyticsSummary;
  emailTrend: AnalyticsTrendPoint[];
  messageTrend: AnalyticsTrendPoint[];
  callTrend: AnalyticsTrendPoint[];
  channelPerformance: ChannelPerformanceItem[];
};

export type TaskAnalyticsResponse = {
  summary: TaskAnalyticsSummary;
  taskTrend: AnalyticsTrendPoint[];
  byPriority: Array<{
    priority: string;
    count: number;
  }>;
  byStatus: Array<{
    status: string;
    count: number;
  }>;
};

export type TeamPerformanceResponse = {
  summary: {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    totalDealsWon: number;
    averageConversionRate: number;
  };
  users: TeamPerformanceItem[];
};

export type PipelineAnalyticsResponse = {
  stages: PipelineAnalyticsItem[];
  funnel: AnalyticsFunnelStep[];
  valueByStage: PipelineAnalyticsItem[];
};

export type SourceAnalyticsResponse = {
  sources: SourceAnalyticsItem[];
  leadTrendBySource: AnalyticsMultiSeriesPoint[];
};

export type ActivityAnalyticsResponse = {
  summary: ActivityAnalyticsSummary;
  activityTrend: AnalyticsTrendPoint[];
  byType: Array<{
    type: string;
    count: number;
  }>;
};

export type PaginatedAnalyticsDealsResponse = {
  data: DealAnalyticsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AnalyticsExportPayload = {
  type:
    | "overview"
    | "revenue"
    | "leads"
    | "deals"
    | "communications"
    | "tasks"
    | "team"
    | "pipeline"
    | "sources"
    | "activity";
  filters?: AnalyticsFilters;
  format?: "csv" | "xlsx" | "pdf";
};

export type AnalyticsExportResponse = {
  success: boolean;
  fileName?: string;
  downloadUrl?: string;
  message?: string;
};

export type AnalyticsComparisonItem = {
  label: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  direction: AnalyticsMetricDirection;
};

export type AnalyticsComparisonResponse = {
  items: AnalyticsComparisonItem[];
  currentStartDate: string;
  currentEndDate: string;
  previousStartDate: string;
  previousEndDate: string;
};

export type AnalyticsLeaderboardItem = {
  id: string;
  name: string;
  avatarUrl?: string;
  score: number;
  revenue?: number;
  dealsWon?: number;
  conversionRate?: number;
  rank: number;
};

export type AnalyticsLeaderboardResponse = {
  type: "revenue" | "deals" | "conversion" | "activities";
  items: AnalyticsLeaderboardItem[];
};

export type DashboardWidgetKey =
  | "kpis"
  | "leadTrend"
  | "revenueTrend"
  | "pipelineDistribution"
  | "topSources"
  | "topPerformers"
  | "communicationSummary"
  | "tasksSummary"
  | "activitySummary"
  | "leaderboard";

export type DashboardWidgetConfig = {
  key: DashboardWidgetKey;
  title: string;
  enabled: boolean;
  order: number;
};

export type DashboardPreferences = {
  widgets: DashboardWidgetConfig[];
  preset?: AnalyticsDatePreset;
  scope?: AnalyticsScope;
};