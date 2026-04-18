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

export type MarketingChannel =
  | "facebook"
  | "instagram"
  | "google"
  | "youtube"
  | "linkedin"
  | "whatsapp"
  | "sms"
  | "email"
  | "referral"
  | "broker"
  | "website"
  | "offline"
  | "other";

export type MarketingCampaignStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type AttributionModel =
  | "first-touch"
  | "last-touch"
  | "linear"
  | "time-decay"
  | "position-based";

export type MarketingOptimizationGoal =
  | "traffic"
  | "leads"
  | "qualified-leads"
  | "site-visits"
  | "deals"
  | "revenue"
  | "awareness";

export type LeadStageForMarketing =
  | "lead"
  | "qualified"
  | "site-visit"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export interface MarketingFilters extends AnalyticsFilters {
  channelIds?: string[];
  channels?: MarketingChannel[];
  campaignStatuses?: MarketingCampaignStatus[];
  attributionModel?: AttributionModel;
  optimizationGoal?: MarketingOptimizationGoal;
  includeOrganic?: boolean;
  includePaid?: boolean;
  minSpend?: number;
  maxSpend?: number;
}

export interface CampaignBudget {
  allocated?: number;
  spent?: number;
  remaining?: number;
  currency?: string;
}

export interface MarketingCampaignSummary {
  id: string;
  name: string;
  channel: MarketingChannel;
  status: MarketingCampaignStatus;
  objective?: MarketingOptimizationGoal;
  startDate?: string;
  endDate?: string;
  budget?: CampaignBudget;
  impressions?: number;
  clicks?: number;
  leads?: number;
  qualifiedLeads?: number;
  dealsWon?: number;
  revenue?: number;
  roi?: number;
}

export interface MarketingKpi extends AnalyticsKpi {
  benchmarkValue?: number;
  benchmarkLabel?: string;
}

export interface MarketingSummaryMetrics {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalLeads: number;
  totalQualifiedLeads: number;
  totalSiteVisits?: number;
  totalDealsWon?: number;
  totalRevenue?: number;
  clickThroughRate?: number;
  leadConversionRate?: number;
  qualificationRate?: number;
  costPerClick?: number;
  costPerLead?: number;
  costPerQualifiedLead?: number;
  costPerSiteVisit?: number;
  customerAcquisitionCost?: number;
  returnOnAdSpend?: number;
  roi?: number;
}

export interface MarketingPerformancePoint {
  periodKey: string;
  periodLabel: string;
  date?: string;
  spend: number;
  impressions?: number;
  clicks?: number;
  leads?: number;
  qualifiedLeads?: number;
  siteVisits?: number;
  dealsWon?: number;
  revenue?: number;
  roi?: number;
}

export interface ChannelPerformanceRow {
  channel: MarketingChannel;
  label: string;
  spend: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  leads: number;
  qualifiedLeads?: number;
  qualificationRate?: number;
  costPerLead?: number;
  costPerQualifiedLead?: number;
  dealsWon?: number;
  revenue?: number;
  roi?: number;
}

export interface CampaignPerformanceRow {
  id: string;
  campaignName: string;
  channel: MarketingChannel;
  status: MarketingCampaignStatus;
  spend: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  leads: number;
  qualifiedLeads?: number;
  qualificationRate?: number;
  siteVisits?: number;
  dealsWon?: number;
  revenue?: number;
  costPerLead?: number;
  costPerQualifiedLead?: number;
  roi?: number;
  startDate?: string;
  endDate?: string;
}

export interface SourceToRevenueRow {
  sourceKey: string;
  sourceLabel: string;
  leads: number;
  qualifiedLeads: number;
  convertedDeals: number;
  revenue: number;
  averageDealValue?: number;
  revenuePerLead?: number;
  revenuePerQualifiedLead?: number;
}

export interface MarketingAttributionRow {
  sourceKey: string;
  sourceLabel: string;
  attributionModel: AttributionModel;
  assistedLeads?: number;
  assistedRevenue?: number;
  directLeads?: number;
  directRevenue?: number;
  influenceScore?: number;
}

export interface FunnelStageMetric {
  stage: LeadStageForMarketing;
  label: string;
  count: number;
  conversionRateFromPrevious?: number;
  conversionRateFromTop?: number;
  dropOffCount?: number;
  dropOffRate?: number;
}

export interface MarketingGeoPerformanceRow {
  locationId?: string;
  locationLabel: string;
  spend: number;
  leads: number;
  qualifiedLeads?: number;
  dealsWon?: number;
  revenue?: number;
  costPerLead?: number;
  roi?: number;
}

export interface CostEfficiencySnapshot {
  label: string;
  spend: number;
  leads: number;
  qualifiedLeads?: number;
  costPerLead?: number;
  costPerQualifiedLead?: number;
  customerAcquisitionCost?: number;
}

export interface MarketingInsightCard {
  key: string;
  title: string;
  value: number | string;
  subtitle?: string;
  description?: string;
  trend?: AnalyticsTrendDirection;
  changePercent?: number;
  format?: AnalyticsValueFormat | "text";
}

export interface MarketingResponseData {
  kpis: MarketingKpi[];
  metrics: MarketingSummaryMetrics;
  campaigns: MarketingCampaignSummary[];
  performanceTimeline: MarketingPerformancePoint[];
  channelPerformance: ChannelPerformanceRow[];
  campaignPerformance: CampaignPerformanceRow[];
  sourceToRevenue: SourceToRevenueRow[];
  attribution: MarketingAttributionRow[];
  funnel: FunnelStageMetric[];
  geoPerformance?: MarketingGeoPerformanceRow[];
  costEfficiency?: CostEfficiencySnapshot[];
  insightCards?: MarketingInsightCard[];
  charts?: Record<string, AnalyticsChartDataSet>;
  tables?: Record<string, AnalyticsTableData>;
  meta?: AnalyticsResponseMeta;
}

export interface MarketingSummaryResponse extends AnalyticsSummaryResponse {
  spend?: number;
  impressions?: number;
  clicks?: number;
  leadsGenerated?: number;
  qualifiedLeads?: number;
  dealsWon?: number;
  revenue?: number;
  clickThroughRate?: number;
  leadConversionRate?: number;
  qualificationRate?: number;
  costPerClick?: number;
  costPerLead?: number;
  costPerQualifiedLead?: number;
  customerAcquisitionCost?: number;
  returnOnAdSpend?: number;
  roi?: number;
}

export interface MarketingChannelResponse {
  items: ChannelPerformanceRow[];
  meta?: AnalyticsResponseMeta;
}

export interface MarketingCampaignResponse {
  items: CampaignPerformanceRow[];
  total: number;
  meta?: AnalyticsResponseMeta;
}

export interface MarketingAttributionResponse {
  model: AttributionModel;
  items: MarketingAttributionRow[];
  meta?: AnalyticsResponseMeta;
}

export interface MarketingFunnelResponse {
  items: FunnelStageMetric[];
  meta?: AnalyticsResponseMeta;
}

export type MarketingAnyResponse =
  | MarketingSummaryResponse
  | MarketingResponseData
  | MarketingChannelResponse
  | MarketingCampaignResponse
  | MarketingAttributionResponse
  | MarketingFunnelResponse;