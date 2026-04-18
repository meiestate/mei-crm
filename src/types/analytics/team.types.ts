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

export type TeamMemberRole =
  | "admin"
  | "manager"
  | "team-lead"
  | "sales-executive"
  | "telecaller"
  | "relationship-manager"
  | "channel-partner-manager"
  | "support"
  | "other";

export type TeamPerformanceBand = "low" | "average" | "good" | "excellent";
export type TeamActivityType = "call" | "meeting" | "site-visit" | "follow-up" | "task" | "deal" | "note";
export type TeamTargetMetric = "revenue" | "deals" | "calls" | "meetings" | "site-visits" | "follow-ups";
export type TeamAttendanceStatus = "present" | "absent" | "leave" | "half-day";

export interface TeamFilters extends AnalyticsFilters {
  teamIds?: string[];
  memberIds?: string[];
  roles?: TeamMemberRole[];
  locations?: string[];
  performanceBands?: TeamPerformanceBand[];
  minRevenue?: number;
  maxRevenue?: number;
  minConversionRate?: number;
  maxConversionRate?: number;
  includeInactiveMembers?: boolean;
}

export interface TeamKpi extends AnalyticsKpi {
  benchmarkValue?: number;
  benchmarkLabel?: string;
}

export interface TeamSummaryMetrics {
  totalMembers: number;
  activeMembers: number;
  totalRevenue: number;
  totalDealsWon: number;
  totalLeadsHandled?: number;
  averageRevenuePerMember?: number;
  averageDealsPerMember?: number;
  averageConversionRate?: number;
  averageResponseTimeHours?: number;
  targetAchievementPercent?: number;
}

export interface TeamMemberProfile {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: TeamMemberRole;
  teamId?: string;
  teamName?: string;
  avatarUrl?: string;
  city?: string;
  joinedAt?: string;
  isActive?: boolean;
}

export interface TeamMemberPerformanceRow {
  memberId: string;
  memberName: string;
  role: TeamMemberRole;
  teamId?: string;
  teamName?: string;
  leadsHandled?: number;
  qualifiedLeads?: number;
  dealsWon: number;
  dealsLost?: number;
  revenue: number;
  targetRevenue?: number;
  achievementPercent?: number;
  conversionRate?: number;
  averageDealValue?: number;
  averageResponseTimeHours?: number;
  performanceBand?: TeamPerformanceBand;
  rank?: number;
}

export interface TeamLeaderboardRow {
  memberId: string;
  memberName: string;
  role: TeamMemberRole;
  metric: TeamTargetMetric;
  value: number;
  rank: number;
  trend?: AnalyticsTrendDirection;
  changePercent?: number;
}

export interface TeamTargetSnapshot {
  label: string;
  metric: TeamTargetMetric;
  targetValue: number;
  achievedValue: number;
  achievementPercent?: number;
  variance?: number;
  variancePercent?: number;
}

export interface TeamActivitySummaryRow {
  memberId: string;
  memberName: string;
  calls?: number;
  meetings?: number;
  siteVisits?: number;
  followUps?: number;
  tasksCompleted?: number;
  notesAdded?: number;
  totalActivities?: number;
}

export interface TeamTrendPoint {
  periodKey: string;
  periodLabel: string;
  revenue?: number;
  dealsWon?: number;
  leadsHandled?: number;
  qualifiedLeads?: number;
  conversionRate?: number;
  responseTimeHours?: number;
  targetAchievementPercent?: number;
}

export interface TeamRoleBreakdownRow {
  role: TeamMemberRole;
  label: string;
  memberCount: number;
  revenue?: number;
  dealsWon?: number;
  averageConversionRate?: number;
}

export interface TeamAttendanceRow {
  memberId: string;
  memberName: string;
  status: TeamAttendanceStatus;
  date: string;
  checkInAt?: string;
  checkOutAt?: string;
  workingHours?: number;
}

export interface TeamProductivityRow {
  memberId: string;
  memberName: string;
  totalActivities: number;
  productiveActivities?: number;
  productivityScore?: number;
  callsPerDay?: number;
  followUpsPerDay?: number;
  siteVisitsPerWeek?: number;
}

export interface TeamPerformanceDistributionPoint {
  band: TeamPerformanceBand;
  label: string;
  memberCount: number;
  averageRevenue?: number;
  averageConversionRate?: number;
}

export interface TeamInsightCard {
  key: string;
  title: string;
  value: number | string;
  subtitle?: string;
  description?: string;
  trend?: AnalyticsTrendDirection;
  changePercent?: number;
  format?: AnalyticsValueFormat | "text";
}

export interface TeamResponseData {
  kpis: TeamKpi[];
  metrics: TeamSummaryMetrics;
  members?: TeamMemberProfile[];
  memberPerformance: TeamMemberPerformanceRow[];
  leaderboard?: TeamLeaderboardRow[];
  targets?: TeamTargetSnapshot[];
  activitySummary?: TeamActivitySummaryRow[];
  trend?: TeamTrendPoint[];
  roleBreakdown?: TeamRoleBreakdownRow[];
  attendance?: TeamAttendanceRow[];
  productivity?: TeamProductivityRow[];
  performanceDistribution?: TeamPerformanceDistributionPoint[];
  insightCards?: TeamInsightCard[];
  charts?: Record<string, AnalyticsChartDataSet>;
  tables?: Record<string, AnalyticsTableData>;
  meta?: AnalyticsResponseMeta;
}

export interface TeamSummaryResponse extends AnalyticsSummaryResponse {
  totalMembers?: number;
  activeMembers?: number;
  totalRevenue?: number;
  totalDealsWon?: number;
  totalLeadsHandled?: number;
  averageRevenuePerMember?: number;
  averageDealsPerMember?: number;
  averageConversionRate?: number;
  averageResponseTimeHours?: number;
  targetAchievementPercent?: number;
}

export interface TeamMemberPerformanceResponse {
  items: TeamMemberPerformanceRow[];
  total: number;
  meta?: AnalyticsResponseMeta;
}

export interface TeamLeaderboardResponse {
  items: TeamLeaderboardRow[];
  meta?: AnalyticsResponseMeta;
}

export interface TeamTargetsResponse {
  items: TeamTargetSnapshot[];
  meta?: AnalyticsResponseMeta;
}

export interface TeamActivitySummaryResponse {
  items: TeamActivitySummaryRow[];
  meta?: AnalyticsResponseMeta;
}

export interface TeamTrendResponse {
  items: TeamTrendPoint[];
  meta?: AnalyticsResponseMeta;
}

export interface TeamRoleBreakdownResponse {
  items: TeamRoleBreakdownRow[];
  meta?: AnalyticsResponseMeta;
}

export interface TeamAttendanceResponse {
  items: TeamAttendanceRow[];
  total: number;
  meta?: AnalyticsResponseMeta;
}

export interface TeamProductivityResponse {
  items: TeamProductivityRow[];
  meta?: AnalyticsResponseMeta;
}

export interface TeamPerformanceDistributionResponse {
  items: TeamPerformanceDistributionPoint[];
  meta?: AnalyticsResponseMeta;
}

export type TeamAnyResponse =
  | TeamSummaryResponse
  | TeamResponseData
  | TeamMemberPerformanceResponse
  | TeamLeaderboardResponse
  | TeamTargetsResponse
  | TeamActivitySummaryResponse
  | TeamTrendResponse
  | TeamRoleBreakdownResponse
  | TeamAttendanceResponse
  | TeamProductivityResponse
  | TeamPerformanceDistributionResponse;