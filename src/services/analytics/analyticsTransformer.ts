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

export interface TransformedStatItem {
  key: string;
  label: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  trend: "up" | "down" | "neutral";
  format: "number" | "currency" | "percent" | "duration";
}

export interface TransformedChartDatum {
  label: string;
  value: number;
  secondaryValue?: number;
  meta?: Record<string, unknown>;
}

export interface TransformedTableRow {
  id: string;
  [key: string]: unknown;
}

export interface TransformedAnalyticsSection {
  kpis: TransformedStatItem[];
  charts: Record<string, TransformedChartDatum[]>;
  tables: Record<string, TransformedTableRow[]>;
  summary: Record<string, unknown>;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

const toStringValue = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
};

const toTrend = (value: unknown): "up" | "down" | "neutral" => {
  if (value === "up" || value === "down" || value === "neutral") {
    return value;
  }

  const numericValue = toNumber(value, 0);

  if (numericValue > 0) return "up";
  if (numericValue < 0) return "down";
  return "neutral";
};

const toFormat = (
  value: unknown
): "number" | "currency" | "percent" | "duration" => {
  if (
    value === "number" ||
    value === "currency" ||
    value === "percent" ||
    value === "duration"
  ) {
    return value;
  }

  return "number";
};

const normalizeKpi = (
  item: AnalyticsKpi,
  index: number
): TransformedStatItem => {
  return {
    key: toStringValue(item.key, `kpi-${index}`),
    label: toStringValue(item.label, `Metric ${index + 1}`),
    value: toNumber(item.value, 0),
    previousValue:
      item.previousValue !== undefined
        ? toNumber(item.previousValue)
        : undefined,
    change: item.change !== undefined ? toNumber(item.change) : undefined,
    changePercent:
      item.changePercent !== undefined
        ? toNumber(item.changePercent)
        : undefined,
    trend: toTrend(item.trend ?? item.change ?? item.changePercent),
    format: toFormat(item.format),
  };
};

const normalizeChartPoint = (
  item: AnalyticsChartPoint,
  index: number
): TransformedChartDatum => {
  return {
    label: toStringValue(item.label, `Point ${index + 1}`),
    value: toNumber(item.value, 0),
    secondaryValue:
      item.secondaryValue !== undefined
        ? toNumber(item.secondaryValue)
        : undefined,
    meta: isRecord(item.meta) ? item.meta : undefined,
  };
};

const normalizeCharts = (
  charts?: Record<string, AnalyticsChartPoint[]>
): Record<string, TransformedChartDatum[]> => {
  if (!isRecord(charts)) return {};

  return Object.entries(charts).reduce<Record<string, TransformedChartDatum[]>>(
    (
      accumulator: Record<string, TransformedChartDatum[]>,
      [key, value]: [string, AnalyticsChartPoint[]]
    ) => {
      accumulator[key] = Array.isArray(value)
        ? value.map(
            (item: AnalyticsChartPoint, index: number): TransformedChartDatum =>
              normalizeChartPoint(item, index)
          )
        : [];

      return accumulator;
    },
    {}
  );
};

const normalizeTables = (
  tables?: Record<string, AnalyticsTableRow[]>
): Record<string, TransformedTableRow[]> => {
  if (!isRecord(tables)) return {};

  return Object.entries(tables).reduce<Record<string, TransformedTableRow[]>>(
    (
      accumulator: Record<string, TransformedTableRow[]>,
      [key, value]: [string, AnalyticsTableRow[]]
    ) => {
      accumulator[key] = Array.isArray(value)
        ? value.map(
            (row: AnalyticsTableRow, index: number): TransformedTableRow => {
              if (!isRecord(row)) {
                return {
                  id: `${key}-${index}`,
                };
              }

              return {
                ...row,
                id: toStringValue(row.id, `${key}-${index}`),
              };
            }
          )
        : [];

      return accumulator;
    },
    {}
  );
};

const buildDerivedSummary = (
  response:
    | AnalyticsSummaryResponse
    | LeadAnalyticsResponse
    | MarketingAnalyticsResponse
    | PipelineAnalyticsResponse
    | RevenueAnalyticsResponse
    | TeamPerformanceAnalyticsResponse
    | ForecastAnalyticsResponse
): Record<string, unknown> => {
  const summary: Record<string, unknown> = isRecord(response.summary)
    ? { ...response.summary }
    : {};

  const derivedEntries: Array<[string, unknown]> = [
    ["totalLeads", "totalLeads" in response ? response.totalLeads : undefined],
    [
      "qualifiedLeads",
      "qualifiedLeads" in response ? response.qualifiedLeads : undefined,
    ],
    [
      "convertedLeads",
      "convertedLeads" in response ? response.convertedLeads : undefined,
    ],
    [
      "conversionRate",
      "conversionRate" in response ? response.conversionRate : undefined,
    ],
    [
      "impressions",
      "impressions" in response ? response.impressions : undefined,
    ],
    ["clicks", "clicks" in response ? response.clicks : undefined],
    [
      "leadsGenerated",
      "leadsGenerated" in response ? response.leadsGenerated : undefined,
    ],
    [
      "costPerLead",
      "costPerLead" in response ? response.costPerLead : undefined,
    ],
    ["roi", "roi" in response ? response.roi : undefined],
    ["totalDeals", "totalDeals" in response ? response.totalDeals : undefined],
    [
      "pipelineValue",
      "pipelineValue" in response ? response.pipelineValue : undefined,
    ],
    [
      "averageDealSize",
      "averageDealSize" in response ? response.averageDealSize : undefined,
    ],
    [
      "stageConversionRate",
      "stageConversionRate" in response
        ? response.stageConversionRate
        : undefined,
    ],
    [
      "totalRevenue",
      "totalRevenue" in response ? response.totalRevenue : undefined,
    ],
    [
      "collectedRevenue",
      "collectedRevenue" in response ? response.collectedRevenue : undefined,
    ],
    [
      "pendingRevenue",
      "pendingRevenue" in response ? response.pendingRevenue : undefined,
    ],
    [
      "averageRevenuePerDeal",
      "averageRevenuePerDeal" in response
        ? response.averageRevenuePerDeal
        : undefined,
    ],
    [
      "totalAgents",
      "totalAgents" in response ? response.totalAgents : undefined,
    ],
    [
      "topPerformer",
      "topPerformer" in response ? response.topPerformer : undefined,
    ],
    [
      "averageWinRate",
      "averageWinRate" in response ? response.averageWinRate : undefined,
    ],
    [
      "projectedRevenue",
      "projectedRevenue" in response ? response.projectedRevenue : undefined,
    ],
    [
      "committedRevenue",
      "committedRevenue" in response ? response.committedRevenue : undefined,
    ],
    [
      "forecastAccuracy",
      "forecastAccuracy" in response ? response.forecastAccuracy : undefined,
    ],
  ];

  derivedEntries.forEach(([key, value]) => {
    if (value !== undefined) {
      summary[key] = value;
    }
  });

  return summary;
};

export const transformAnalyticsSummary = (
  response: AnalyticsSummaryResponse
): TransformedAnalyticsSection => {
  return {
    kpis: Array.isArray(response.kpis)
      ? response.kpis.map(
          (item: AnalyticsKpi, index: number): TransformedStatItem =>
            normalizeKpi(item, index)
        )
      : [],
    charts: normalizeCharts(response.charts),
    tables: normalizeTables(response.tables),
    summary: buildDerivedSummary(response),
  };
};

export const transformLeadAnalytics = (
  response: LeadAnalyticsResponse
): TransformedAnalyticsSection => {
  return transformAnalyticsSummary(response);
};

export const transformMarketingAnalytics = (
  response: MarketingAnalyticsResponse
): TransformedAnalyticsSection => {
  return transformAnalyticsSummary(response);
};

export const transformPipelineAnalytics = (
  response: PipelineAnalyticsResponse
): TransformedAnalyticsSection => {
  return transformAnalyticsSummary(response);
};

export const transformRevenueAnalytics = (
  response: RevenueAnalyticsResponse
): TransformedAnalyticsSection => {
  return transformAnalyticsSummary(response);
};

export const transformTeamPerformanceAnalytics = (
  response: TeamPerformanceAnalyticsResponse
): TransformedAnalyticsSection => {
  return transformAnalyticsSummary(response);
};

export const transformForecastAnalytics = (
  response: ForecastAnalyticsResponse
): TransformedAnalyticsSection => {
  return transformAnalyticsSummary(response);
};

export const analyticsTransformer = {
  transformAnalyticsSummary,
  transformLeadAnalytics,
  transformMarketingAnalytics,
  transformPipelineAnalytics,
  transformRevenueAnalytics,
  transformTeamPerformanceAnalytics,
  transformForecastAnalytics,
};

export default analyticsTransformer;