import type {
  AnalyticsChartBlock,
  AnalyticsMappedSection,
  AnalyticsTableBlock,
} from "./analyticsMapper";

export type AnalyticsExportFormat = "csv" | "json" | "xlsx" | "pdf";

export interface AnalyticsExportOptions {
  fileName?: string;
  sectionTitle?: string;
  includeCards?: boolean;
  includeCharts?: boolean;
  includeTables?: boolean;
  includeSummary?: boolean;
}

type CsvPrimitive = string | number | boolean | null | undefined;
type CsvRow = Record<string, CsvPrimitive>;

const isBrowser = (): boolean => {
  return typeof window !== "undefined" && typeof document !== "undefined";
};

const sanitizeFileName = (value: string): string => {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
};

const createTimestamp = (): string => {
  return new Date().toISOString().replace(/[:.]/g, "-");
};

const resolveFileName = (
  baseName: string,
  extension: string
): string => {
  const safeBaseName = sanitizeFileName(baseName || "analytics-export");
  return `${safeBaseName}-${createTimestamp()}.${extension}`;
};

const normalizeCellValue = (value: CsvPrimitive): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
};

const escapeCsvCell = (value: CsvPrimitive): string => {
  const normalized = normalizeCellValue(value);

  if (
    normalized.includes(",") ||
    normalized.includes('"') ||
    normalized.includes("\n")
  ) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }

  return normalized;
};

const buildCsvFromRows = (rows: CsvRow[]): string => {
  if (rows.length === 0) return "";

  const headers = Array.from(
    rows.reduce<Set<string>>((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set<string>())
  );

  const headerLine = headers.map((header) => escapeCsvCell(header)).join(",");

  const dataLines = rows.map((row) =>
    headers.map((header) => escapeCsvCell(row[header])).join(",")
  );

  return [headerLine, ...dataLines].join("\n");
};

const triggerDownload = (blob: Blob, fileName: string): void => {
  if (!isBrowser()) return;

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.URL.revokeObjectURL(url);
};

const downloadTextFile = (
  content: string,
  fileName: string,
  mimeType: string
): void => {
  const blob = new Blob([content], { type: mimeType });
  triggerDownload(blob, fileName);
};

const cardsToRows = (mapped: AnalyticsMappedSection): CsvRow[] => {
  return mapped.cards.map((card) => ({
    type: "card",
    key: card.key,
    title: card.title,
    value: card.value,
    previousValue: card.previousValue,
    change: card.change,
    changePercent: card.changePercent,
    trend: card.trend,
    format: card.format,
  }));
};

const heroMetricsToRows = (mapped: AnalyticsMappedSection): CsvRow[] => {
  return mapped.heroMetrics.map((metric) => ({
    type: "heroMetric",
    key: metric.key,
    label: metric.label,
    value: metric.value,
    format: metric.format,
  }));
};

const summaryToRows = (mapped: AnalyticsMappedSection): CsvRow[] => {
  return Object.entries(mapped.summary).map(([key, value]) => ({
    type: "summary",
    key,
    value:
      typeof value === "object" && value !== null
        ? JSON.stringify(value)
        : (value as CsvPrimitive),
  }));
};

const chartBlockToRows = (chart: AnalyticsChartBlock): CsvRow[] => {
  return chart.data.map((item) => ({
    type: "chart",
    chartKey: chart.key,
    chartTitle: chart.title,
    label: item.label,
    value: item.value,
    secondaryValue: item.secondaryValue,
    meta: item.meta ? JSON.stringify(item.meta) : "",
  }));
};

const tableBlockToRows = (table: AnalyticsTableBlock): CsvRow[] => {
  return table.rows.map((row) => {
    const flattened: CsvRow = {
      type: "table",
      tableKey: table.key,
      tableTitle: table.title,
      id: row.id,
    };

    Object.entries(row).forEach(([key, value]) => {
      flattened[key] =
        typeof value === "object" && value !== null
          ? JSON.stringify(value)
          : (value as CsvPrimitive);
    });

    return flattened;
  });
};

const mappedSectionToRows = (
  mapped: AnalyticsMappedSection,
  options?: AnalyticsExportOptions
): CsvRow[] => {
  const includeCards = options?.includeCards ?? true;
  const includeCharts = options?.includeCharts ?? true;
  const includeTables = options?.includeTables ?? true;
  const includeSummary = options?.includeSummary ?? true;

  const rows: CsvRow[] = [];

  if (includeCards) {
    rows.push(...heroMetricsToRows(mapped));
    rows.push(...cardsToRows(mapped));
  }

  if (includeSummary) {
    rows.push(...summaryToRows(mapped));
  }

  if (includeCharts) {
    mapped.charts.forEach((chart) => {
      rows.push(...chartBlockToRows(chart));
    });
  }

  if (includeTables) {
    mapped.tables.forEach((table) => {
      rows.push(...tableBlockToRows(table));
    });
  }

  return rows;
};

export const exportRowsAsCsv = (
  rows: CsvRow[],
  fileName = "analytics-export"
): void => {
  const csv = buildCsvFromRows(rows);
  const resolvedFileName = resolveFileName(fileName, "csv");
  downloadTextFile(csv, resolvedFileName, "text/csv;charset=utf-8;");
};

export const exportRowsAsJson = (
  rows: CsvRow[],
  fileName = "analytics-export"
): void => {
  const json = JSON.stringify(rows, null, 2);
  const resolvedFileName = resolveFileName(fileName, "json");
  downloadTextFile(json, resolvedFileName, "application/json;charset=utf-8;");
};

export const exportMappedSectionAsCsv = (
  mapped: AnalyticsMappedSection,
  options?: AnalyticsExportOptions
): void => {
  const rows = mappedSectionToRows(mapped, options);
  const fileName = options?.fileName ?? options?.sectionTitle ?? "analytics-section";
  exportRowsAsCsv(rows, fileName);
};

export const exportMappedSectionAsJson = (
  mapped: AnalyticsMappedSection,
  options?: AnalyticsExportOptions
): void => {
  const payload = {
    sectionTitle: options?.sectionTitle ?? "Analytics Section",
    exportedAt: new Date().toISOString(),
    includeCards: options?.includeCards ?? true,
    includeCharts: options?.includeCharts ?? true,
    includeTables: options?.includeTables ?? true,
    includeSummary: options?.includeSummary ?? true,
    data: mapped,
  };

  const resolvedFileName = resolveFileName(
    options?.fileName ?? options?.sectionTitle ?? "analytics-section",
    "json"
  );

  downloadTextFile(
    JSON.stringify(payload, null, 2),
    resolvedFileName,
    "application/json;charset=utf-8;"
  );
};

export const exportChartAsCsv = (
  chart: AnalyticsChartBlock,
  fileName?: string
): void => {
  const rows = chartBlockToRows(chart);
  exportRowsAsCsv(rows, fileName ?? chart.title ?? "analytics-chart");
};

export const exportTableAsCsv = (
  table: AnalyticsTableBlock,
  fileName?: string
): void => {
  const rows = tableBlockToRows(table);
  exportRowsAsCsv(rows, fileName ?? table.title ?? "analytics-table");
};

export const exportChartAsJson = (
  chart: AnalyticsChartBlock,
  fileName?: string
): void => {
  const resolvedFileName = resolveFileName(
    fileName ?? chart.title ?? "analytics-chart",
    "json"
  );

  downloadTextFile(
    JSON.stringify(chart, null, 2),
    resolvedFileName,
    "application/json;charset=utf-8;"
  );
};

export const exportTableAsJson = (
  table: AnalyticsTableBlock,
  fileName?: string
): void => {
  const resolvedFileName = resolveFileName(
    fileName ?? table.title ?? "analytics-table",
    "json"
  );

  downloadTextFile(
    JSON.stringify(table, null, 2),
    resolvedFileName,
    "application/json;charset=utf-8;"
  );
};

export const getMappedSectionExportRows = (
  mapped: AnalyticsMappedSection,
  options?: AnalyticsExportOptions
): CsvRow[] => {
  return mappedSectionToRows(mapped, options);
};

export const analyticsExport = {
  exportRowsAsCsv,
  exportRowsAsJson,
  exportMappedSectionAsCsv,
  exportMappedSectionAsJson,
  exportChartAsCsv,
  exportTableAsCsv,
  exportChartAsJson,
  exportTableAsJson,
  getMappedSectionExportRows,
};

export default analyticsExport;