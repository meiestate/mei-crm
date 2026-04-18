import {
  transformAnalyticsSummary,
  transformForecastAnalytics,
  transformLeadAnalytics,
  transformMarketingAnalytics,
  transformPipelineAnalytics,
  transformRevenueAnalytics,
  transformTeamPerformanceAnalytics,
} from "./analyticsTransformer";
import type {
  AnalyticsSummaryResponse,
  ForecastAnalyticsResponse,
  LeadAnalyticsResponse,
  MarketingAnalyticsResponse,
  PipelineAnalyticsResponse,
  RevenueAnalyticsResponse,
  TeamPerformanceAnalyticsResponse,
  TransformedAnalyticsSection,
  TransformedChartDatum,
  TransformedStatItem,
  TransformedTableRow,
} from "./analyticsTransformer";

export interface AnalyticsCardItem {
  key: string;
  title: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  trend: "up" | "down" | "neutral";
  format: "number" | "currency" | "percent" | "duration";
}

export interface AnalyticsChartBlock {
  key: string;
  title: string;
  data: TransformedChartDatum[];
  empty: boolean;
}

export interface AnalyticsTableBlock {
  key: string;
  title: string;
  rows: TransformedTableRow[];
  empty: boolean;
}

export interface AnalyticsHeroMetric {
  key: string;
  label: string;
  value: number;
  format: "number" | "currency" | "percent" | "duration";
}

export interface AnalyticsMappedSection {
  cards: AnalyticsCardItem[];
  charts: AnalyticsChartBlock[];
  tables: AnalyticsTableBlock[];
  summary: Record<string, unknown>;
  heroMetrics: AnalyticsHeroMetric[];
  raw: TransformedAnalyticsSection;
}

const titleCase = (value: string): string => {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const chartTitleMap: Record<string, string> = {
  revenueTrend: "Revenue Trend",
  revenueByProject: "Revenue by Project",
  revenueByLocation: "Revenue by Location",
  revenueByAgent: "Revenue by Agent",
  targetVsAchievement: "Target vs Achievement",
  wonVsLostDeals: "Won vs Lost Deals",
  pipelineStageDistribution: "Pipeline Stage Distribution",
  stageConversionRate: "Stage Conversion Rate",
  stageDropOff: "Stage Drop-Off",
  stuckDeals: "Stuck Deals",
  averageDealSize: "Average Deal Size",
  forecastRevenue: "Forecast Revenue",
  sourcePerformance: "Source Performance",
  sourceToRevenueComparison: "Source to Revenue Comparison",
  costPerQualifiedLead: "Cost per Qualified Lead",
  lostLeadReasons: "Lost Lead Reasons",
  riskScoreDistribution: "Risk Score Distribution",
  monthlyBusinessScorecard: "Monthly Business Scorecard",
  businessHealthScore: "Business Health Score",
  forecastVsActual: "Forecast vs Actual",
  growthComparison: "Growth Comparison",
  topOpportunities: "Top Opportunities",
};

const tableTitleMap: Record<string, string> = {
  topOpportunities: "Top Opportunities",
  topPerformers: "Top Performers",
  highRiskDeals: "High-Risk Deals",
  projectPerformance: "Project Performance",
  sourcePerformance: "Source Performance",
  areaPerformance: "Area Performance",
};

const toCard = (item: TransformedStatItem): AnalyticsCardItem => {
  return {
    key: item.key,
    title: item.label,
    value: item.value,
    previousValue: item.previousValue,
    change: item.change,
    changePercent: item.changePercent,
    trend: item.trend,
    format: item.format,
  };
};

const toChartBlock = (
  key: string,
  data: TransformedChartDatum[]
): AnalyticsChartBlock => {
  return {
    key,
    title: chartTitleMap[key] ?? titleCase(key),
    data,
    empty: data.length === 0,
  };
};

const toTableBlock = (
  key: string,
  rows: TransformedTableRow[]
): AnalyticsTableBlock => {
  return {
    key,
    title: tableTitleMap[key] ?? titleCase(key),
    rows,
    empty: rows.length === 0,
  };
};

const inferHeroMetrics = (
  section: TransformedAnalyticsSection
): AnalyticsHeroMetric[] => {
  const firstThree = section.kpis.slice(0, 3);

  return firstThree.map((item) => ({
    key: item.key,
    label: item.label,
    value: item.value,
    format: item.format,
  }));
};

const mapTransformedSection = (
  section: TransformedAnalyticsSection
): AnalyticsMappedSection => {
  const cards = section.kpis.map(toCard);

  const charts = Object.entries(section.charts).map(
    ([key, data]: [string, TransformedChartDatum[]]) => toChartBlock(key, data)
  );

  const tables = Object.entries(section.tables).map(
    ([key, rows]: [string, TransformedTableRow[]]) => toTableBlock(key, rows)
  );

  return {
    cards,
    charts,
    tables,
    summary: section.summary,
    heroMetrics: inferHeroMetrics(section),
    raw: section,
  };
};

export const mapAnalyticsSummary = (
  response: AnalyticsSummaryResponse
): AnalyticsMappedSection => {
  return mapTransformedSection(transformAnalyticsSummary(response));
};

export const mapLeadAnalytics = (
  response: LeadAnalyticsResponse
): AnalyticsMappedSection => {
  return mapTransformedSection(transformLeadAnalytics(response));
};

export const mapMarketingAnalytics = (
  response: MarketingAnalyticsResponse
): AnalyticsMappedSection => {
  return mapTransformedSection(transformMarketingAnalytics(response));
};

export const mapPipelineAnalytics = (
  response: PipelineAnalyticsResponse
): AnalyticsMappedSection => {
  return mapTransformedSection(transformPipelineAnalytics(response));
};

export const mapRevenueAnalytics = (
  response: RevenueAnalyticsResponse
): AnalyticsMappedSection => {
  return mapTransformedSection(transformRevenueAnalytics(response));
};

export const mapTeamPerformanceAnalytics = (
  response: TeamPerformanceAnalyticsResponse
): AnalyticsMappedSection => {
  return mapTransformedSection(transformTeamPerformanceAnalytics(response));
};

export const mapForecastAnalytics = (
  response: ForecastAnalyticsResponse
): AnalyticsMappedSection => {
  return mapTransformedSection(transformForecastAnalytics(response));
};

export const getCardByKey = (
  mapped: AnalyticsMappedSection,
  key: string
): AnalyticsCardItem | undefined => {
  return mapped.cards.find((card: AnalyticsCardItem) => card.key === key);
};

export const getChartByKey = (
  mapped: AnalyticsMappedSection,
  key: string
): AnalyticsChartBlock | undefined => {
  return mapped.charts.find((chart: AnalyticsChartBlock) => chart.key === key);
};

export const getTableByKey = (
  mapped: AnalyticsMappedSection,
  key: string
): AnalyticsTableBlock | undefined => {
  return mapped.tables.find((table: AnalyticsTableBlock) => table.key === key);
};

export const analyticsMapper = {
  mapAnalyticsSummary,
  mapLeadAnalytics,
  mapMarketingAnalytics,
  mapPipelineAnalytics,
  mapRevenueAnalytics,
  mapTeamPerformanceAnalytics,
  mapForecastAnalytics,
  getCardByKey,
  getChartByKey,
  getTableByKey,
};

export default analyticsMapper;