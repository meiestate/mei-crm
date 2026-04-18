import { type AnalyticsKpiKey } from "./analyticsKpis";
import { type AnalyticsChartKey } from "./analyticsChartKeys";

export type AnalyticsThresholdTone =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "neutral";

export type AnalyticsThresholdDirection = "higher" | "lower" | "range";

export type AnalyticsThresholdRule = {
  tone: AnalyticsThresholdTone;
  min?: number;
  max?: number;
  label: string;
  description?: string;
};

export type AnalyticsKpiThresholdConfig = {
  key: AnalyticsKpiKey;
  direction: AnalyticsThresholdDirection;
  target?: number;
  warning?: number;
  critical?: number;
  unit?: "currency" | "number" | "percentage" | "days" | "score";
  rules: AnalyticsThresholdRule[];
};

export type AnalyticsChartThresholdConfig = {
  key: AnalyticsChartKey;
  rules: AnalyticsThresholdRule[];
};

export type AnalyticsResolvedThreshold = {
  tone: AnalyticsThresholdTone;
  label: string;
  description?: string;
};

export const ANALYTICS_KPI_THRESHOLDS: Record<
  AnalyticsKpiKey,
  AnalyticsKpiThresholdConfig
> = {
  totalRevenue: {
    key: "totalRevenue",
    direction: "higher",
    target: 20000000,
    warning: 15000000,
    critical: 10000000,
    unit: "currency",
    rules: [
      { min: 20000000, tone: "success", label: "Target Achieved" },
      { min: 15000000, max: 19999999, tone: "info", label: "On Track" },
      { min: 10000000, max: 14999999, tone: "warning", label: "Needs Push" },
      { max: 9999999, tone: "danger", label: "Critical Gap" },
    ],
  },

  forecastRevenue: {
    key: "forecastRevenue",
    direction: "higher",
    target: 24000000,
    warning: 18000000,
    critical: 12000000,
    unit: "currency",
    rules: [
      { min: 24000000, tone: "success", label: "Strong Forecast" },
      { min: 18000000, max: 23999999, tone: "info", label: "Healthy Forecast" },
      { min: 12000000, max: 17999999, tone: "warning", label: "Weak Forecast" },
      { max: 11999999, tone: "danger", label: "Forecast Risk" },
    ],
  },

  revenueGrowth: {
    key: "revenueGrowth",
    direction: "higher",
    target: 15,
    warning: 8,
    critical: 0,
    unit: "percentage",
    rules: [
      { min: 15, tone: "success", label: "Excellent Growth" },
      { min: 8, max: 14.99, tone: "info", label: "Healthy Growth" },
      { min: 0, max: 7.99, tone: "warning", label: "Slow Growth" },
      { max: -0.01, tone: "danger", label: "Negative Growth" },
    ],
  },

  totalLeads: {
    key: "totalLeads",
    direction: "higher",
    target: 1400,
    warning: 1000,
    critical: 700,
    unit: "number",
    rules: [
      { min: 1400, tone: "success", label: "Lead Goal Met" },
      { min: 1000, max: 1399, tone: "info", label: "Good Lead Volume" },
      { min: 700, max: 999, tone: "warning", label: "Low Lead Volume" },
      { max: 699, tone: "danger", label: "Lead Shortfall" },
    ],
  },

  qualifiedLeads: {
    key: "qualifiedLeads",
    direction: "higher",
    target: 520,
    warning: 350,
    critical: 200,
    unit: "number",
    rules: [
      { min: 520, tone: "success", label: "High Quality Pipeline" },
      { min: 350, max: 519, tone: "info", label: "Stable Quality" },
      { min: 200, max: 349, tone: "warning", label: "Weak Qualification" },
      { max: 199, tone: "danger", label: "Poor Quality Leads" },
    ],
  },

  leadToVisitRate: {
    key: "leadToVisitRate",
    direction: "higher",
    target: 35,
    warning: 25,
    critical: 15,
    unit: "percentage",
    rules: [
      { min: 35, tone: "success", label: "High Intent Pipeline" },
      { min: 25, max: 34.99, tone: "info", label: "Healthy Conversion" },
      { min: 15, max: 24.99, tone: "warning", label: "Weak Visit Conversion" },
      { max: 14.99, tone: "danger", label: "Conversion Breakdown" },
    ],
  },

  siteVisits: {
    key: "siteVisits",
    direction: "higher",
    target: 300,
    warning: 220,
    critical: 120,
    unit: "number",
    rules: [
      { min: 300, tone: "success", label: "Visit Goal Met" },
      { min: 220, max: 299, tone: "info", label: "Strong Visit Flow" },
      { min: 120, max: 219, tone: "warning", label: "Low Visit Flow" },
      { max: 119, tone: "danger", label: "Visit Gap" },
    ],
  },

  visitToBookingRate: {
    key: "visitToBookingRate",
    direction: "higher",
    target: 25,
    warning: 18,
    critical: 10,
    unit: "percentage",
    rules: [
      { min: 25, tone: "success", label: "Strong Sales Efficiency" },
      { min: 18, max: 24.99, tone: "info", label: "Decent Booking Rate" },
      { min: 10, max: 17.99, tone: "warning", label: "Weak Booking Rate" },
      { max: 9.99, tone: "danger", label: "Booking Risk" },
    ],
  },

  totalDeals: {
    key: "totalDeals",
    direction: "higher",
    target: 210,
    warning: 150,
    critical: 90,
    unit: "number",
    rules: [
      { min: 210, tone: "success", label: "High Deal Volume" },
      { min: 150, max: 209, tone: "info", label: "Healthy Deal Volume" },
      { min: 90, max: 149, tone: "warning", label: "Low Deal Count" },
      { max: 89, tone: "danger", label: "Deal Pipeline Risk" },
    ],
  },

  wonDeals: {
    key: "wonDeals",
    direction: "higher",
    target: 70,
    warning: 50,
    critical: 25,
    unit: "number",
    rules: [
      { min: 70, tone: "success", label: "Win Goal Met" },
      { min: 50, max: 69, tone: "info", label: "Strong Wins" },
      { min: 25, max: 49, tone: "warning", label: "Low Wins" },
      { max: 24, tone: "danger", label: "Closing Weakness" },
    ],
  },

  lostDeals: {
    key: "lostDeals",
    direction: "lower",
    target: 18,
    warning: 28,
    critical: 40,
    unit: "number",
    rules: [
      { max: 18, tone: "success", label: "Controlled Losses" },
      { min: 18.01, max: 28, tone: "info", label: "Acceptable Losses" },
      { min: 28.01, max: 40, tone: "warning", label: "Loss Rate Rising" },
      { min: 40.01, tone: "danger", label: "Severe Deal Loss" },
    ],
  },

  averageDealSize: {
    key: "averageDealSize",
    direction: "higher",
    target: 310000,
    warning: 250000,
    critical: 180000,
    unit: "currency",
    rules: [
      { min: 310000, tone: "success", label: "Premium Deal Quality" },
      { min: 250000, max: 309999, tone: "info", label: "Healthy Deal Value" },
      { min: 180000, max: 249999, tone: "warning", label: "Low Deal Value" },
      { max: 179999, tone: "danger", label: "Value Compression" },
    ],
  },

  avgClosureTime: {
    key: "avgClosureTime",
    direction: "lower",
    target: 20,
    warning: 30,
    critical: 45,
    unit: "days",
    rules: [
      { max: 20, tone: "success", label: "Fast Closure" },
      { min: 20.01, max: 30, tone: "info", label: "Normal Closure" },
      { min: 30.01, max: 45, tone: "warning", label: "Slow Pipeline" },
      { min: 45.01, tone: "danger", label: "Critical Delay" },
    ],
  },

  pipelineValue: {
    key: "pipelineValue",
    direction: "higher",
    target: 45000000,
    warning: 32000000,
    critical: 20000000,
    unit: "currency",
    rules: [
      { min: 45000000, tone: "success", label: "Strong Pipeline" },
      { min: 32000000, max: 44999999, tone: "info", label: "Healthy Pipeline" },
      { min: 20000000, max: 31999999, tone: "warning", label: "Thin Pipeline" },
      { max: 19999999, tone: "danger", label: "Pipeline Weakness" },
    ],
  },

  conversionRate: {
    key: "conversionRate",
    direction: "higher",
    target: 15,
    warning: 10,
    critical: 5,
    unit: "percentage",
    rules: [
      { min: 15, tone: "success", label: "Excellent Conversion" },
      { min: 10, max: 14.99, tone: "info", label: "Healthy Conversion" },
      { min: 5, max: 9.99, tone: "warning", label: "Weak Conversion" },
      { max: 4.99, tone: "danger", label: "Severe Funnel Leakage" },
    ],
  },

  costPerQualifiedLead: {
    key: "costPerQualifiedLead",
    direction: "lower",
    target: 1700,
    warning: 2200,
    critical: 3000,
    unit: "currency",
    rules: [
      { max: 1700, tone: "success", label: "Efficient Spend" },
      { min: 1700.01, max: 2200, tone: "info", label: "Manageable Cost" },
      { min: 2200.01, max: 3000, tone: "warning", label: "Expensive Leads" },
      { min: 3000.01, tone: "danger", label: "Unsustainable Cost" },
    ],
  },

  customerAcquisitionCost: {
    key: "customerAcquisitionCost",
    direction: "lower",
    target: 12000,
    warning: 15000,
    critical: 22000,
    unit: "currency",
    rules: [
      { max: 12000, tone: "success", label: "Efficient Acquisition" },
      { min: 12000.01, max: 15000, tone: "info", label: "Acceptable CAC" },
      { min: 15000.01, max: 22000, tone: "warning", label: "High CAC" },
      { min: 22000.01, tone: "danger", label: "Critical CAC" },
    ],
  },

  marketingSpend: {
    key: "marketingSpend",
    direction: "range",
    target: 950000,
    warning: 1100000,
    critical: 1400000,
    unit: "currency",
    rules: [
      { min: 0, max: 950000, tone: "success", label: "Controlled Spend" },
      { min: 950000.01, max: 1100000, tone: "info", label: "Planned Spend" },
      { min: 1100000.01, max: 1400000, tone: "warning", label: "Over Budget Risk" },
      { min: 1400000.01, tone: "danger", label: "Budget Breach" },
    ],
  },

  roi: {
    key: "roi",
    direction: "higher",
    target: 220,
    warning: 150,
    critical: 100,
    unit: "percentage",
    rules: [
      { min: 220, tone: "success", label: "Excellent ROI" },
      { min: 150, max: 219.99, tone: "info", label: "Good ROI" },
      { min: 100, max: 149.99, tone: "warning", label: "Weak ROI" },
      { max: 99.99, tone: "danger", label: "Poor ROI" },
    ],
  },

  businessHealthScore: {
    key: "businessHealthScore",
    direction: "higher",
    target: 90,
    warning: 70,
    critical: 50,
    unit: "score",
    rules: [
      { min: 90, tone: "success", label: "Excellent Health" },
      { min: 70, max: 89.99, tone: "info", label: "Healthy Business" },
      { min: 50, max: 69.99, tone: "warning", label: "Needs Attention" },
      { max: 49.99, tone: "danger", label: "Business Risk" },
    ],
  },

  openRate: {
    key: "openRate",
    direction: "higher",
    target: 42,
    warning: 30,
    critical: 18,
    unit: "percentage",
    rules: [
      { min: 42, tone: "success", label: "Strong Opens" },
      { min: 30, max: 41.99, tone: "info", label: "Healthy Opens" },
      { min: 18, max: 29.99, tone: "warning", label: "Weak Opens" },
      { max: 17.99, tone: "danger", label: "Messaging Miss" },
    ],
  },

  clickRate: {
    key: "clickRate",
    direction: "higher",
    target: 11,
    warning: 7,
    critical: 3,
    unit: "percentage",
    rules: [
      { min: 11, tone: "success", label: "Excellent CTR" },
      { min: 7, max: 10.99, tone: "info", label: "Healthy CTR" },
      { min: 3, max: 6.99, tone: "warning", label: "Low CTR" },
      { max: 2.99, tone: "danger", label: "Critical CTR" },
    ],
  },

  replyRate: {
    key: "replyRate",
    direction: "higher",
    target: 16,
    warning: 10,
    critical: 5,
    unit: "percentage",
    rules: [
      { min: 16, tone: "success", label: "Excellent Response" },
      { min: 10, max: 15.99, tone: "info", label: "Healthy Response" },
      { min: 5, max: 9.99, tone: "warning", label: "Low Response" },
      { max: 4.99, tone: "danger", label: "Response Failure" },
    ],
  },

  deliveryRate: {
    key: "deliveryRate",
    direction: "higher",
    target: 98,
    warning: 94,
    critical: 88,
    unit: "percentage",
    rules: [
      { min: 98, tone: "success", label: "Excellent Delivery" },
      { min: 94, max: 97.99, tone: "info", label: "Stable Delivery" },
      { min: 88, max: 93.99, tone: "warning", label: "Delivery Issues" },
      { max: 87.99, tone: "danger", label: "Serious Delivery Failure" },
    ],
  },

  stuckDeals: {
    key: "stuckDeals",
    direction: "lower",
    target: 12,
    warning: 20,
    critical: 30,
    unit: "number",
    rules: [
      { max: 12, tone: "success", label: "Pipeline Moving" },
      { min: 12.01, max: 20, tone: "info", label: "Minor Delays" },
      { min: 20.01, max: 30, tone: "warning", label: "Deal Stagnation" },
      { min: 30.01, tone: "danger", label: "Pipeline Blocked" },
    ],
  },

  highRiskDeals: {
    key: "highRiskDeals",
    direction: "lower",
    target: 8,
    warning: 14,
    critical: 22,
    unit: "number",
    rules: [
      { max: 8, tone: "success", label: "Risk Under Control" },
      { min: 8.01, max: 14, tone: "info", label: "Manageable Risk" },
      { min: 14.01, max: 22, tone: "warning", label: "Elevated Risk" },
      { min: 22.01, tone: "danger", label: "Severe Deal Risk" },
    ],
  },
};

export const ANALYTICS_CHART_THRESHOLDS: Record<
  AnalyticsChartKey,
  AnalyticsChartThresholdConfig
> = {
  businessHealthScore: {
    key: "businessHealthScore",
    rules: [
      { min: 90, tone: "success", label: "Excellent" },
      { min: 70, max: 89.99, tone: "info", label: "Good" },
      { min: 50, max: 69.99, tone: "warning", label: "Watch" },
      { max: 49.99, tone: "danger", label: "Critical" },
    ],
  },
  forecastVsActual: {
    key: "forecastVsActual",
    rules: [
      { min: 95, tone: "success", label: "Forecast Accurate" },
      { min: 85, max: 94.99, tone: "info", label: "Minor Variance" },
      { min: 70, max: 84.99, tone: "warning", label: "Forecast Drift" },
      { max: 69.99, tone: "danger", label: "Forecast Miss" },
    ],
  },
  growthComparison: {
    key: "growthComparison",
    rules: [
      { min: 12, tone: "success", label: "Strong Growth" },
      { min: 6, max: 11.99, tone: "info", label: "Moderate Growth" },
      { min: 0, max: 5.99, tone: "warning", label: "Flat Growth" },
      { max: -0.01, tone: "danger", label: "Negative Growth" },
    ],
  },
  monthlyBusinessScorecard: {
    key: "monthlyBusinessScorecard",
    rules: [
      { min: 85, tone: "success", label: "Excellent Month" },
      { min: 70, max: 84.99, tone: "info", label: "Healthy Month" },
      { min: 55, max: 69.99, tone: "warning", label: "Weak Month" },
      { max: 54.99, tone: "danger", label: "Poor Month" },
    ],
  },
  topOpportunities: {
    key: "topOpportunities",
    rules: [
      { min: 75, tone: "success", label: "Strong Opportunity" },
      { min: 55, max: 74.99, tone: "info", label: "Promising Opportunity" },
      { min: 35, max: 54.99, tone: "warning", label: "Uncertain Opportunity" },
      { max: 34.99, tone: "danger", label: "Weak Opportunity" },
    ],
  },
  costPerQualifiedLead: {
    key: "costPerQualifiedLead",
    rules: [
      { max: 1700, tone: "success", label: "Efficient" },
      { min: 1700.01, max: 2200, tone: "info", label: "Acceptable" },
      { min: 2200.01, max: 3000, tone: "warning", label: "Expensive" },
      { min: 3000.01, tone: "danger", label: "Critical Cost" },
    ],
  },
  sourceToRevenueComparison: {
    key: "sourceToRevenueComparison",
    rules: [
      { min: 10, tone: "success", label: "High Yield Source" },
      { min: 6, max: 9.99, tone: "info", label: "Stable Source" },
      { min: 3, max: 5.99, tone: "warning", label: "Weak Source" },
      { max: 2.99, tone: "danger", label: "Unprofitable Source" },
    ],
  },
  avgDealClosureTime: {
    key: "avgDealClosureTime",
    rules: [
      { max: 20, tone: "success", label: "Fast Cycle" },
      { min: 20.01, max: 30, tone: "info", label: "Normal Cycle" },
      { min: 30.01, max: 45, tone: "warning", label: "Slow Cycle" },
      { min: 45.01, tone: "danger", label: "Critical Delay" },
    ],
  },
  funnelConversion: {
    key: "funnelConversion",
    rules: [
      { min: 15, tone: "success", label: "Strong Funnel" },
      { min: 10, max: 14.99, tone: "info", label: "Healthy Funnel" },
      { min: 5, max: 9.99, tone: "warning", label: "Leaky Funnel" },
      { max: 4.99, tone: "danger", label: "Broken Funnel" },
    ],
  },
  pipelineStageDistribution: {
    key: "pipelineStageDistribution",
    rules: [
      { min: 0, max: 40, tone: "success", label: "Balanced" },
      { min: 40.01, max: 60, tone: "info", label: "Heavy Stage" },
      { min: 60.01, max: 90, tone: "warning", label: "Buildup Risk" },
      { min: 90.01, tone: "danger", label: "Stage Blockage" },
    ],
  },
  stageConversionRate: {
    key: "stageConversionRate",
    rules: [
      { min: 50, tone: "success", label: "Excellent Stage Flow" },
      { min: 30, max: 49.99, tone: "info", label: "Healthy Flow" },
      { min: 15, max: 29.99, tone: "warning", label: "Weak Flow" },
      { max: 14.99, tone: "danger", label: "Broken Stage Flow" },
    ],
  },
  stageDropOff: {
    key: "stageDropOff",
    rules: [
      { max: 8, tone: "success", label: "Controlled Drop-Off" },
      { min: 8.01, max: 15, tone: "info", label: "Acceptable Drop-Off" },
      { min: 15.01, max: 25, tone: "warning", label: "High Drop-Off" },
      { min: 25.01, tone: "danger", label: "Critical Leakage" },
    ],
  },
  stuckDeals: {
    key: "stuckDeals",
    rules: [
      { max: 12, tone: "success", label: "Low Blockage" },
      { min: 12.01, max: 20, tone: "info", label: "Manageable" },
      { min: 20.01, max: 30, tone: "warning", label: "Stuck Pipeline" },
      { min: 30.01, tone: "danger", label: "Severe Blockage" },
    ],
  },
  averageDealSize: {
    key: "averageDealSize",
    rules: [
      { min: 310000, tone: "success", label: "High Value" },
      { min: 250000, max: 309999, tone: "info", label: "Stable Value" },
      { min: 180000, max: 249999, tone: "warning", label: "Low Value" },
      { max: 179999, tone: "danger", label: "Value Compression" },
    ],
  },
  forecastRevenue: {
    key: "forecastRevenue",
    rules: [
      { min: 24000000, tone: "success", label: "Strong Outlook" },
      { min: 18000000, max: 23999999, tone: "info", label: "Healthy Outlook" },
      { min: 12000000, max: 17999999, tone: "warning", label: "Weak Outlook" },
      { max: 11999999, tone: "danger", label: "Forecast Threat" },
    ],
  },
  revenueByAgent: {
    key: "revenueByAgent",
    rules: [
      { min: 35, tone: "success", label: "Top Performer" },
      { min: 20, max: 34.99, tone: "info", label: "Strong Performer" },
      { min: 10, max: 19.99, tone: "warning", label: "Average Performer" },
      { max: 9.99, tone: "danger", label: "Underperforming" },
    ],
  },
  revenueByLocation: {
    key: "revenueByLocation",
    rules: [
      { min: 50, tone: "success", label: "Leading Market" },
      { min: 25, max: 49.99, tone: "info", label: "Healthy Market" },
      { min: 10, max: 24.99, tone: "warning", label: "Soft Market" },
      { max: 9.99, tone: "danger", label: "Weak Market" },
    ],
  },
  revenueByProject: {
    key: "revenueByProject",
    rules: [
      { min: 20, tone: "success", label: "Top Project" },
      { min: 12, max: 19.99, tone: "info", label: "Strong Project" },
      { min: 6, max: 11.99, tone: "warning", label: "Weak Project" },
      { max: 5.99, tone: "danger", label: "Low Yield Project" },
    ],
  },
  revenueTrend: {
    key: "revenueTrend",
    rules: [
      { min: 15, tone: "success", label: "Strong Trend" },
      { min: 10, max: 14.99, tone: "info", label: "Healthy Trend" },
      { min: 5, max: 9.99, tone: "warning", label: "Weak Trend" },
      { max: 4.99, tone: "danger", label: "Falling Trend" },
    ],
  },
  targetVsAchievement: {
    key: "targetVsAchievement",
    rules: [
      { min: 100, tone: "success", label: "Target Achieved" },
      { min: 85, max: 99.99, tone: "info", label: "Nearly There" },
      { min: 65, max: 84.99, tone: "warning", label: "Behind Target" },
      { max: 64.99, tone: "danger", label: "Major Gap" },
    ],
  },
  wonVsLostDeals: {
    key: "wonVsLostDeals",
    rules: [
      { min: 2.5, tone: "success", label: "Strong Win Ratio" },
      { min: 1.5, max: 2.49, tone: "info", label: "Healthy Ratio" },
      { min: 1, max: 1.49, tone: "warning", label: "Weak Ratio" },
      { max: 0.99, tone: "danger", label: "Loss Dominant" },
    ],
  },
  highRiskDeals: {
    key: "highRiskDeals",
    rules: [
      { max: 8, tone: "success", label: "Controlled Risk" },
      { min: 8.01, max: 14, tone: "info", label: "Manageable Risk" },
      { min: 14.01, max: 22, tone: "warning", label: "High Risk" },
      { min: 22.01, tone: "danger", label: "Critical Risk" },
    ],
  },
  lostLeadReasons: {
    key: "lostLeadReasons",
    rules: [
      { max: 10, tone: "success", label: "Controlled Loss" },
      { min: 10.01, max: 20, tone: "info", label: "Acceptable Loss" },
      { min: 20.01, max: 30, tone: "warning", label: "Problematic Loss" },
      { min: 30.01, tone: "danger", label: "Critical Loss Driver" },
    ],
  },
  riskScoreDistribution: {
    key: "riskScoreDistribution",
    rules: [
      { max: 20, tone: "success", label: "Low Risk Cluster" },
      { min: 20.01, max: 50, tone: "info", label: "Moderate Risk Cluster" },
      { min: 50.01, max: 75, tone: "warning", label: "Elevated Risk Cluster" },
      { min: 75.01, tone: "danger", label: "Critical Risk Cluster" },
    ],
  },
  channelPerformance: {
    key: "channelPerformance",
    rules: [
      { min: 90, tone: "success", label: "High Channel Efficiency" },
      { min: 75, max: 89.99, tone: "info", label: "Healthy Channel" },
      { min: 55, max: 74.99, tone: "warning", label: "Weak Channel" },
      { max: 54.99, tone: "danger", label: "Broken Channel" },
    ],
  },
  openRate: {
    key: "openRate",
    rules: [
      { min: 42, tone: "success", label: "Strong Open Rate" },
      { min: 30, max: 41.99, tone: "info", label: "Healthy Open Rate" },
      { min: 18, max: 29.99, tone: "warning", label: "Weak Open Rate" },
      { max: 17.99, tone: "danger", label: "Poor Open Rate" },
    ],
  },
  clickRate: {
    key: "clickRate",
    rules: [
      { min: 11, tone: "success", label: "Strong CTR" },
      { min: 7, max: 10.99, tone: "info", label: "Healthy CTR" },
      { min: 3, max: 6.99, tone: "warning", label: "Weak CTR" },
      { max: 2.99, tone: "danger", label: "Poor CTR" },
    ],
  },
  replyRate: {
    key: "replyRate",
    rules: [
      { min: 16, tone: "success", label: "Strong Reply Rate" },
      { min: 10, max: 15.99, tone: "info", label: "Healthy Reply Rate" },
      { min: 5, max: 9.99, tone: "warning", label: "Weak Reply Rate" },
      { max: 4.99, tone: "danger", label: "Poor Reply Rate" },
    ],
  },
  deliveryStats: {
    key: "deliveryStats",
    rules: [
      { min: 98, tone: "success", label: "Excellent Delivery" },
      { min: 94, max: 97.99, tone: "info", label: "Healthy Delivery" },
      { min: 88, max: 93.99, tone: "warning", label: "Delivery Issues" },
      { max: 87.99, tone: "danger", label: "Critical Delivery Failure" },
    ],
  },
  sourcePerformance: {
    key: "sourcePerformance",
    rules: [
      { min: 10, tone: "success", label: "High Converting Source" },
      { min: 5, max: 9.99, tone: "info", label: "Healthy Source" },
      { min: 2, max: 4.99, tone: "warning", label: "Weak Source" },
      { max: 1.99, tone: "danger", label: "Poor Source" },
    ],
  },
  projectPerformance: {
    key: "projectPerformance",
    rules: [
      { min: 15, tone: "success", label: "Top Project" },
      { min: 8, max: 14.99, tone: "info", label: "Healthy Project" },
      { min: 4, max: 7.99, tone: "warning", label: "Weak Project" },
      { max: 3.99, tone: "danger", label: "Underperforming Project" },
    ],
  },
  areaPerformance: {
    key: "areaPerformance",
    rules: [
      { min: 18, tone: "success", label: "Strong Market" },
      { min: 10, max: 17.99, tone: "info", label: "Stable Market" },
      { min: 5, max: 9.99, tone: "warning", label: "Soft Market" },
      { max: 4.99, tone: "danger", label: "Weak Market" },
    ],
  },
  topPerformers: {
    key: "topPerformers",
    rules: [
      { min: 15, tone: "success", label: "Elite Performer" },
      { min: 10, max: 14.99, tone: "info", label: "Strong Performer" },
      { min: 5, max: 9.99, tone: "warning", label: "Average Performer" },
      { max: 4.99, tone: "danger", label: "Needs Support" },
    ],
  },
  alertSummary: {
    key: "alertSummary",
    rules: [
      { max: 3, tone: "success", label: "Calm System" },
      { min: 3.01, max: 8, tone: "info", label: "Normal Alerts" },
      { min: 8.01, max: 15, tone: "warning", label: "Elevated Alerts" },
      { min: 15.01, tone: "danger", label: "Critical Alert Load" },
    ],
  },
  forecastInsight: {
    key: "forecastInsight",
    rules: [
      { min: 75, tone: "success", label: "Confident Forecast" },
      { min: 55, max: 74.99, tone: "info", label: "Stable Forecast" },
      { min: 35, max: 54.99, tone: "warning", label: "Uncertain Forecast" },
      { max: 34.99, tone: "danger", label: "Weak Forecast Confidence" },
    ],
  },
};

export const ANALYTICS_TONE_PRIORITY: Record<AnalyticsThresholdTone, number> = {
  success: 1,
  info: 2,
  warning: 3,
  danger: 4,
  neutral: 5,
};

export const resolveAnalyticsThreshold = (
  value: number,
  rules: AnalyticsThresholdRule[]
): AnalyticsResolvedThreshold => {
  const matchedRule =
    rules.find((rule) => {
      const minOk = rule.min === undefined || value >= rule.min;
      const maxOk = rule.max === undefined || value <= rule.max;
      return minOk && maxOk;
    }) ?? {
      tone: "neutral" as const,
      label: "Unknown",
    };

  return {
    tone: matchedRule.tone,
    label: matchedRule.label,
    description: matchedRule.description,
  };
};

export const getAnalyticsKpiThreshold = (
  key: AnalyticsKpiKey
): AnalyticsKpiThresholdConfig => {
  return ANALYTICS_KPI_THRESHOLDS[key];
};

export const getAnalyticsChartThreshold = (
  key: AnalyticsChartKey
): AnalyticsChartThresholdConfig => {
  return ANALYTICS_CHART_THRESHOLDS[key];
};

export const getAnalyticsKpiThresholdStatus = (
  key: AnalyticsKpiKey,
  value: number
): AnalyticsResolvedThreshold => {
  return resolveAnalyticsThreshold(value, ANALYTICS_KPI_THRESHOLDS[key].rules);
};

export const getAnalyticsChartThresholdStatus = (
  key: AnalyticsChartKey,
  value: number
): AnalyticsResolvedThreshold => {
  return resolveAnalyticsThreshold(value, ANALYTICS_CHART_THRESHOLDS[key].rules);
};

export const getBusinessHealthBand = (
  score: number
): "excellent" | "healthy" | "warning" | "critical" => {
  const tone = getAnalyticsKpiThresholdStatus("businessHealthScore", score).tone;

  if (tone === "success") return "excellent";
  if (tone === "info") return "healthy";
  if (tone === "warning") return "warning";
  return "critical";
};

export default ANALYTICS_KPI_THRESHOLDS;