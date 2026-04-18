export type AnalyticsTrendDirection = "up" | "down" | "neutral";

export type AnalyticsKpiTone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export type AnalyticsKpiKey =
  | "totalRevenue"
  | "forecastRevenue"
  | "revenueGrowth"
  | "totalLeads"
  | "qualifiedLeads"
  | "leadToVisitRate"
  | "siteVisits"
  | "visitToBookingRate"
  | "totalDeals"
  | "wonDeals"
  | "lostDeals"
  | "averageDealSize"
  | "avgClosureTime"
  | "pipelineValue"
  | "conversionRate"
  | "costPerQualifiedLead"
  | "customerAcquisitionCost"
  | "marketingSpend"
  | "roi"
  | "businessHealthScore"
  | "openRate"
  | "clickRate"
  | "replyRate"
  | "deliveryRate"
  | "stuckDeals"
  | "highRiskDeals";

export type AnalyticsKpi = {
  key: AnalyticsKpiKey;
  label: string;
  shortLabel: string;
  description: string;
  valueType: "currency" | "number" | "percentage" | "days" | "score";
  prefix?: string;
  suffix?: string;
  decimals?: number;
  tone: AnalyticsKpiTone;
  group:
    | "revenue"
    | "lead"
    | "deal"
    | "pipeline"
    | "marketing"
    | "performance"
    | "communication"
    | "risk";
  compareLabel?: string;
};

export type AnalyticsKpiValue = {
  key: AnalyticsKpiKey;
  value: number;
  previousValue?: number;
  targetValue?: number;
};

export const ANALYTICS_KPIS: AnalyticsKpi[] = [
  {
    key: "totalRevenue",
    label: "Total Revenue",
    shortLabel: "Revenue",
    description: "Closed revenue generated in the selected date range",
    valueType: "currency",
    prefix: "₹",
    decimals: 0,
    tone: "primary",
    group: "revenue",
    compareLabel: "vs previous period",
  },
  {
    key: "forecastRevenue",
    label: "Forecast Revenue",
    shortLabel: "Forecast",
    description: "Projected revenue from active pipeline",
    valueType: "currency",
    prefix: "₹",
    decimals: 0,
    tone: "info",
    group: "revenue",
    compareLabel: "vs previous forecast",
  },
  {
    key: "revenueGrowth",
    label: "Revenue Growth",
    shortLabel: "Growth",
    description: "Revenue growth percentage compared to previous period",
    valueType: "percentage",
    suffix: "%",
    decimals: 1,
    tone: "success",
    group: "revenue",
    compareLabel: "period growth",
  },
  {
    key: "totalLeads",
    label: "Total Leads",
    shortLabel: "Leads",
    description: "Total leads created in the selected range",
    valueType: "number",
    decimals: 0,
    tone: "primary",
    group: "lead",
    compareLabel: "vs previous period",
  },
  {
    key: "qualifiedLeads",
    label: "Qualified Leads",
    shortLabel: "Qualified",
    description: "Leads qualified by team or automation rules",
    valueType: "number",
    decimals: 0,
    tone: "success",
    group: "lead",
    compareLabel: "vs previous period",
  },
  {
    key: "leadToVisitRate",
    label: "Lead to Visit Rate",
    shortLabel: "Lead → Visit",
    description: "Percentage of leads converted to site visits",
    valueType: "percentage",
    suffix: "%",
    decimals: 1,
    tone: "info",
    group: "lead",
    compareLabel: "vs previous period",
  },
  {
    key: "siteVisits",
    label: "Site Visits",
    shortLabel: "Visits",
    description: "Completed project or property site visits",
    valueType: "number",
    decimals: 0,
    tone: "info",
    group: "deal",
    compareLabel: "vs previous period",
  },
  {
    key: "visitToBookingRate",
    label: "Visit to Booking Rate",
    shortLabel: "Visit → Booking",
    description: "Percentage of visits converted into bookings",
    valueType: "percentage",
    suffix: "%",
    decimals: 1,
    tone: "success",
    group: "deal",
    compareLabel: "vs previous period",
  },
  {
    key: "totalDeals",
    label: "Total Deals",
    shortLabel: "Deals",
    description: "Total deals active or closed in the selected range",
    valueType: "number",
    decimals: 0,
    tone: "primary",
    group: "deal",
    compareLabel: "vs previous period",
  },
  {
    key: "wonDeals",
    label: "Won Deals",
    shortLabel: "Won",
    description: "Deals successfully converted into closed business",
    valueType: "number",
    decimals: 0,
    tone: "success",
    group: "deal",
    compareLabel: "vs previous period",
  },
  {
    key: "lostDeals",
    label: "Lost Deals",
    shortLabel: "Lost",
    description: "Deals lost during the selected range",
    valueType: "number",
    decimals: 0,
    tone: "danger",
    group: "deal",
    compareLabel: "vs previous period",
  },
  {
    key: "averageDealSize",
    label: "Average Deal Size",
    shortLabel: "Avg Deal Size",
    description: "Average value of successfully won deals",
    valueType: "currency",
    prefix: "₹",
    decimals: 0,
    tone: "info",
    group: "revenue",
    compareLabel: "vs previous period",
  },
  {
    key: "avgClosureTime",
    label: "Average Closure Time",
    shortLabel: "Closure Time",
    description: "Average number of days to close a deal",
    valueType: "days",
    suffix: " days",
    decimals: 0,
    tone: "warning",
    group: "performance",
    compareLabel: "vs previous period",
  },
  {
    key: "pipelineValue",
    label: "Pipeline Value",
    shortLabel: "Pipeline",
    description: "Total value of active opportunities in pipeline",
    valueType: "currency",
    prefix: "₹",
    decimals: 0,
    tone: "primary",
    group: "pipeline",
    compareLabel: "vs previous period",
  },
  {
    key: "conversionRate",
    label: "Overall Conversion Rate",
    shortLabel: "Conversion",
    description: "End-to-end conversion from lead to won deal",
    valueType: "percentage",
    suffix: "%",
    decimals: 1,
    tone: "success",
    group: "pipeline",
    compareLabel: "vs previous period",
  },
  {
    key: "costPerQualifiedLead",
    label: "Cost per Qualified Lead",
    shortLabel: "CPQL",
    description: "Marketing spend divided by qualified leads",
    valueType: "currency",
    prefix: "₹",
    decimals: 0,
    tone: "warning",
    group: "marketing",
    compareLabel: "vs previous period",
  },
  {
    key: "customerAcquisitionCost",
    label: "Customer Acquisition Cost",
    shortLabel: "CAC",
    description: "Average acquisition cost per converted customer",
    valueType: "currency",
    prefix: "₹",
    decimals: 0,
    tone: "warning",
    group: "marketing",
    compareLabel: "vs previous period",
  },
  {
    key: "marketingSpend",
    label: "Marketing Spend",
    shortLabel: "Spend",
    description: "Total campaign and media spend",
    valueType: "currency",
    prefix: "₹",
    decimals: 0,
    tone: "danger",
    group: "marketing",
    compareLabel: "vs previous period",
  },
  {
    key: "roi",
    label: "Return on Investment",
    shortLabel: "ROI",
    description: "Revenue return generated from spend",
    valueType: "percentage",
    suffix: "%",
    decimals: 1,
    tone: "success",
    group: "marketing",
    compareLabel: "vs previous period",
  },
  {
    key: "businessHealthScore",
    label: "Business Health Score",
    shortLabel: "Health Score",
    description: "Composite business health score across pipeline and revenue",
    valueType: "score",
    suffix: "/100",
    decimals: 0,
    tone: "info",
    group: "performance",
    compareLabel: "vs previous period",
  },
  {
    key: "openRate",
    label: "Open Rate",
    shortLabel: "Open Rate",
    description: "Email or message open performance",
    valueType: "percentage",
    suffix: "%",
    decimals: 1,
    tone: "info",
    group: "communication",
    compareLabel: "vs previous period",
  },
  {
    key: "clickRate",
    label: "Click Rate",
    shortLabel: "CTR",
    description: "Engagement rate based on content clicks",
    valueType: "percentage",
    suffix: "%",
    decimals: 1,
    tone: "primary",
    group: "communication",
    compareLabel: "vs previous period",
  },
  {
    key: "replyRate",
    label: "Reply Rate",
    shortLabel: "Reply Rate",
    description: "Response rate across outbound communication",
    valueType: "percentage",
    suffix: "%",
    decimals: 1,
    tone: "success",
    group: "communication",
    compareLabel: "vs previous period",
  },
  {
    key: "deliveryRate",
    label: "Delivery Rate",
    shortLabel: "Delivery",
    description: "Successful delivery percentage for communications",
    valueType: "percentage",
    suffix: "%",
    decimals: 1,
    tone: "info",
    group: "communication",
    compareLabel: "vs previous period",
  },
  {
    key: "stuckDeals",
    label: "Stuck Deals",
    shortLabel: "Stuck",
    description: "Deals stuck without meaningful progress",
    valueType: "number",
    decimals: 0,
    tone: "warning",
    group: "risk",
    compareLabel: "vs previous period",
  },
  {
    key: "highRiskDeals",
    label: "High Risk Deals",
    shortLabel: "High Risk",
    description: "Deals currently flagged as high probability risk",
    valueType: "number",
    decimals: 0,
    tone: "danger",
    group: "risk",
    compareLabel: "vs previous period",
  },
];

export const ANALYTICS_KPI_MAP: Record<AnalyticsKpiKey, AnalyticsKpi> =
  ANALYTICS_KPIS.reduce((acc, kpi) => {
    acc[kpi.key] = kpi;
    return acc;
  }, {} as Record<AnalyticsKpiKey, AnalyticsKpi>);

export const ANALYTICS_DEFAULT_KPI_KEYS: AnalyticsKpiKey[] = [
  "totalRevenue",
  "forecastRevenue",
  "totalLeads",
  "qualifiedLeads",
  "wonDeals",
  "conversionRate",
  "averageDealSize",
  "businessHealthScore",
];

export const ANALYTICS_REVENUE_KPI_KEYS: AnalyticsKpiKey[] = [
  "totalRevenue",
  "forecastRevenue",
  "revenueGrowth",
  "averageDealSize",
  "pipelineValue",
];

export const ANALYTICS_LEAD_KPI_KEYS: AnalyticsKpiKey[] = [
  "totalLeads",
  "qualifiedLeads",
  "leadToVisitRate",
];

export const ANALYTICS_DEAL_KPI_KEYS: AnalyticsKpiKey[] = [
  "siteVisits",
  "visitToBookingRate",
  "totalDeals",
  "wonDeals",
  "lostDeals",
  "avgClosureTime",
];

export const ANALYTICS_MARKETING_KPI_KEYS: AnalyticsKpiKey[] = [
  "costPerQualifiedLead",
  "customerAcquisitionCost",
  "marketingSpend",
  "roi",
];

export const ANALYTICS_COMMUNICATION_KPI_KEYS: AnalyticsKpiKey[] = [
  "openRate",
  "clickRate",
  "replyRate",
  "deliveryRate",
];

export const ANALYTICS_RISK_KPI_KEYS: AnalyticsKpiKey[] = [
  "stuckDeals",
  "highRiskDeals",
  "businessHealthScore",
];

export const getAnalyticsKpi = (key: AnalyticsKpiKey): AnalyticsKpi => {
  return ANALYTICS_KPI_MAP[key];
};

export const isAnalyticsKpiKey = (value: string): value is AnalyticsKpiKey => {
  return value in ANALYTICS_KPI_MAP;
};

export const getAnalyticsKpisByGroup = (group: AnalyticsKpi["group"]): AnalyticsKpi[] =>
  ANALYTICS_KPIS.filter((kpi) => kpi.group === group);

export const formatAnalyticsKpiValue = (
  key: AnalyticsKpiKey,
  value: number,
  locale: string = "en-IN"
): string => {
  const kpi = getAnalyticsKpi(key);
  const decimals = kpi.decimals ?? 0;

  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return `${kpi.prefix ?? ""}${formattedNumber}${kpi.suffix ?? ""}`;
};

export const getAnalyticsKpiTrendDirection = (
  currentValue: number,
  previousValue?: number,
  inverse: boolean = false
): AnalyticsTrendDirection => {
  if (previousValue === undefined || previousValue === null) return "neutral";
  if (currentValue === previousValue) return "neutral";

  if (inverse) {
    return currentValue < previousValue ? "up" : "down";
  }

  return currentValue > previousValue ? "up" : "down";
};

export const getAnalyticsKpiChangePercent = (
  currentValue: number,
  previousValue?: number
): number => {
  if (previousValue === undefined || previousValue === null) return 0;
  if (previousValue === 0) return currentValue === 0 ? 0 : 100;

  return ((currentValue - previousValue) / previousValue) * 100;
};

export const shouldInverseKpiTrend = (key: AnalyticsKpiKey): boolean => {
  return (
    key === "avgClosureTime" ||
    key === "costPerQualifiedLead" ||
    key === "customerAcquisitionCost" ||
    key === "marketingSpend" ||
    key === "lostDeals" ||
    key === "stuckDeals" ||
    key === "highRiskDeals"
  );
};

export default ANALYTICS_KPIS;