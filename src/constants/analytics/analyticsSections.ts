import ANALYTICS_CHART_KEYS, {
  type AnalyticsChartKey,
} from "./analyticsChartKeys";
import {
  type AnalyticsKpiKey,
} from "./analyticsKpis";

export type AnalyticsSectionKey =
  | "overview"
  | "revenue"
  | "pipeline"
  | "marketing"
  | "performance"
  | "communication"
  | "risk"
  | "insights";

export type AnalyticsSectionIcon =
  | "layout-grid"
  | "indian-rupee"
  | "git-branch"
  | "megaphone"
  | "gauge"
  | "mail"
  | "shield-alert"
  | "sparkles";

export type AnalyticsSection = {
  key: AnalyticsSectionKey;
  title: string;
  shortTitle: string;
  description: string;
  icon: AnalyticsSectionIcon;
  order: number;
  defaultExpanded: boolean;
  defaultVisible: boolean;
  kpiKeys: AnalyticsKpiKey[];
  chartKeys: AnalyticsChartKey[];
  highlightChartKey?: AnalyticsChartKey;
  accent:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";
};

export const ANALYTICS_SECTIONS: AnalyticsSection[] = [
  {
    key: "overview",
    title: "Overview",
    shortTitle: "Overview",
    description:
      "High-level business snapshot across revenue, leads, conversion, and health.",
    icon: "layout-grid",
    order: 1,
    defaultExpanded: true,
    defaultVisible: true,
    kpiKeys: [
      "totalRevenue",
      "forecastRevenue",
      "totalLeads",
      "qualifiedLeads",
      "wonDeals",
      "conversionRate",
      "businessHealthScore",
      "pipelineValue",
    ],
    chartKeys: [
      ANALYTICS_CHART_KEYS.BUSINESS_HEALTH_SCORE,
      ANALYTICS_CHART_KEYS.FORECAST_VS_ACTUAL,
      ANALYTICS_CHART_KEYS.MONTHLY_BUSINESS_SCORECARD,
      ANALYTICS_CHART_KEYS.TOP_OPPORTUNITIES,
    ],
    highlightChartKey: ANALYTICS_CHART_KEYS.BUSINESS_HEALTH_SCORE,
    accent: "primary",
  },
  {
    key: "revenue",
    title: "Revenue Analytics",
    shortTitle: "Revenue",
    description:
      "Track revenue generation, forecasting accuracy, project contribution, and achievement against target.",
    icon: "indian-rupee",
    order: 2,
    defaultExpanded: true,
    defaultVisible: true,
    kpiKeys: [
      "totalRevenue",
      "forecastRevenue",
      "revenueGrowth",
      "averageDealSize",
      "pipelineValue",
    ],
    chartKeys: [
      ANALYTICS_CHART_KEYS.REVENUE_TREND,
      ANALYTICS_CHART_KEYS.FORECAST_REVENUE,
      ANALYTICS_CHART_KEYS.REVENUE_BY_AGENT,
      ANALYTICS_CHART_KEYS.REVENUE_BY_LOCATION,
      ANALYTICS_CHART_KEYS.REVENUE_BY_PROJECT,
      ANALYTICS_CHART_KEYS.TARGET_VS_ACHIEVEMENT,
    ],
    highlightChartKey: ANALYTICS_CHART_KEYS.REVENUE_TREND,
    accent: "success",
  },
  {
    key: "pipeline",
    title: "Pipeline & Conversion",
    shortTitle: "Pipeline",
    description:
      "Understand funnel movement, stage conversion, deal bottlenecks, and close efficiency.",
    icon: "git-branch",
    order: 3,
    defaultExpanded: true,
    defaultVisible: true,
    kpiKeys: [
      "totalDeals",
      "wonDeals",
      "lostDeals",
      "siteVisits",
      "visitToBookingRate",
      "avgClosureTime",
      "stuckDeals",
    ],
    chartKeys: [
      ANALYTICS_CHART_KEYS.FUNNEL_CONVERSION,
      ANALYTICS_CHART_KEYS.PIPELINE_STAGE_DISTRIBUTION,
      ANALYTICS_CHART_KEYS.STAGE_CONVERSION_RATE,
      ANALYTICS_CHART_KEYS.STAGE_DROP_OFF,
      ANALYTICS_CHART_KEYS.STUCK_DEALS,
      ANALYTICS_CHART_KEYS.WON_VS_LOST_DEALS,
      ANALYTICS_CHART_KEYS.AVG_DEAL_CLOSURE_TIME,
    ],
    highlightChartKey: ANALYTICS_CHART_KEYS.FUNNEL_CONVERSION,
    accent: "info",
  },
  {
    key: "marketing",
    title: "Marketing Performance",
    shortTitle: "Marketing",
    description:
      "Measure source quality, media efficiency, spend effectiveness, and lost lead insights.",
    icon: "megaphone",
    order: 4,
    defaultExpanded: true,
    defaultVisible: true,
    kpiKeys: [
      "costPerQualifiedLead",
      "customerAcquisitionCost",
      "marketingSpend",
      "roi",
      "qualifiedLeads",
    ],
    chartKeys: [
      ANALYTICS_CHART_KEYS.COST_PER_QUALIFIED_LEAD,
      ANALYTICS_CHART_KEYS.SOURCE_TO_REVENUE_COMPARISON,
      ANALYTICS_CHART_KEYS.SOURCE_PERFORMANCE,
      ANALYTICS_CHART_KEYS.LOST_LEAD_REASONS,
    ],
    highlightChartKey: ANALYTICS_CHART_KEYS.SOURCE_TO_REVENUE_COMPARISON,
    accent: "warning",
  },
  {
    key: "performance",
    title: "Team & Project Performance",
    shortTitle: "Performance",
    description:
      "Evaluate agent output, project conversion quality, area-wise strength, and growth momentum.",
    icon: "gauge",
    order: 5,
    defaultExpanded: true,
    defaultVisible: true,
    kpiKeys: [
      "leadToVisitRate",
      "visitToBookingRate",
      "averageDealSize",
      "businessHealthScore",
      "wonDeals",
    ],
    chartKeys: [
      ANALYTICS_CHART_KEYS.GROWTH_COMPARISON,
      ANALYTICS_CHART_KEYS.PROJECT_PERFORMANCE,
      ANALYTICS_CHART_KEYS.AREA_PERFORMANCE,
      ANALYTICS_CHART_KEYS.TOP_PERFORMERS,
      ANALYTICS_CHART_KEYS.TOP_OPPORTUNITIES,
    ],
    highlightChartKey: ANALYTICS_CHART_KEYS.TOP_PERFORMERS,
    accent: "primary",
  },
  {
    key: "communication",
    title: "Communication Analytics",
    shortTitle: "Communication",
    description:
      "Track channel-wise delivery, opens, clicks, replies, and outbound engagement performance.",
    icon: "mail",
    order: 6,
    defaultExpanded: false,
    defaultVisible: true,
    kpiKeys: ["openRate", "clickRate", "replyRate", "deliveryRate"],
    chartKeys: [
      ANALYTICS_CHART_KEYS.CHANNEL_PERFORMANCE,
      ANALYTICS_CHART_KEYS.OPEN_RATE,
      ANALYTICS_CHART_KEYS.CLICK_RATE,
      ANALYTICS_CHART_KEYS.REPLY_RATE,
      ANALYTICS_CHART_KEYS.DELIVERY_STATS,
    ],
    highlightChartKey: ANALYTICS_CHART_KEYS.CHANNEL_PERFORMANCE,
    accent: "info",
  },
  {
    key: "risk",
    title: "Risk Monitoring",
    shortTitle: "Risk",
    description:
      "Spot deal slowdowns, probability risks, stage friction, and at-risk opportunity clusters.",
    icon: "shield-alert",
    order: 7,
    defaultExpanded: false,
    defaultVisible: true,
    kpiKeys: ["stuckDeals", "highRiskDeals", "lostDeals", "avgClosureTime"],
    chartKeys: [
      ANALYTICS_CHART_KEYS.HIGH_RISK_DEALS,
      ANALYTICS_CHART_KEYS.RISK_SCORE_DISTRIBUTION,
      ANALYTICS_CHART_KEYS.STUCK_DEALS,
      ANALYTICS_CHART_KEYS.STAGE_DROP_OFF,
    ],
    highlightChartKey: ANALYTICS_CHART_KEYS.RISK_SCORE_DISTRIBUTION,
    accent: "danger",
  },
  {
    key: "insights",
    title: "Insights & Forecast Signals",
    shortTitle: "Insights",
    description:
      "Surface smart signals, alerts, business health insights, and forecast confidence indicators.",
    icon: "sparkles",
    order: 8,
    defaultExpanded: false,
    defaultVisible: true,
    kpiKeys: ["businessHealthScore", "forecastRevenue", "pipelineValue", "roi"],
    chartKeys: [
      ANALYTICS_CHART_KEYS.ALERT_SUMMARY,
      ANALYTICS_CHART_KEYS.FORECAST_INSIGHT,
      ANALYTICS_CHART_KEYS.BUSINESS_HEALTH_SCORE,
      ANALYTICS_CHART_KEYS.FORECAST_VS_ACTUAL,
    ],
    highlightChartKey: ANALYTICS_CHART_KEYS.FORECAST_INSIGHT,
    accent: "neutral",
  },
];

export const ANALYTICS_SECTION_MAP: Record<AnalyticsSectionKey, AnalyticsSection> =
  ANALYTICS_SECTIONS.reduce((acc, section) => {
    acc[section.key] = section;
    return acc;
  }, {} as Record<AnalyticsSectionKey, AnalyticsSection>);

export const ANALYTICS_DEFAULT_SECTION_ORDER: AnalyticsSectionKey[] =
  ANALYTICS_SECTIONS
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((section) => section.key);

export const ANALYTICS_DEFAULT_EXPANDED_SECTIONS: AnalyticsSectionKey[] =
  ANALYTICS_SECTIONS.filter((section) => section.defaultExpanded).map(
    (section) => section.key
  );

export const ANALYTICS_DEFAULT_VISIBLE_SECTIONS: AnalyticsSectionKey[] =
  ANALYTICS_SECTIONS.filter((section) => section.defaultVisible).map(
    (section) => section.key
  );

export const getAnalyticsSection = (
  key: AnalyticsSectionKey
): AnalyticsSection => {
  return ANALYTICS_SECTION_MAP[key];
};

export const getAnalyticsSectionByChartKey = (
  chartKey: AnalyticsChartKey
): AnalyticsSection | undefined => {
  return ANALYTICS_SECTIONS.find((section) =>
    section.chartKeys.includes(chartKey)
  );
};

export const getAnalyticsSectionByKpiKey = (
  kpiKey: AnalyticsKpiKey
): AnalyticsSection | undefined => {
  return ANALYTICS_SECTIONS.find((section) =>
    section.kpiKeys.includes(kpiKey)
  );
};

export const getAnalyticsSectionChartKeys = (
  key: AnalyticsSectionKey
): AnalyticsChartKey[] => {
  return getAnalyticsSection(key).chartKeys;
};

export const getAnalyticsSectionKpiKeys = (
  key: AnalyticsSectionKey
): AnalyticsKpiKey[] => {
  return getAnalyticsSection(key).kpiKeys;
};

export const isAnalyticsSectionKey = (
  value: string
): value is AnalyticsSectionKey => {
  return value in ANALYTICS_SECTION_MAP;
};

export default ANALYTICS_SECTIONS;