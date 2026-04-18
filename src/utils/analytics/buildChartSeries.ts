export type ChartSeriesPrimitive = string | number | boolean | null | undefined;

export type ChartSeriesRecord = Record<string, ChartSeriesPrimitive>;

export interface BuildChartSeriesItem<T extends ChartSeriesRecord = ChartSeriesRecord> {
  key: keyof T | string;
  name: string;
  color?: string;
  type?: "line" | "bar" | "area";
  stackId?: string;
  yAxisId?: string;
  hidden?: boolean;
  formatter?: (value: number, row: T, index: number) => number;
}

export interface BuildChartSeriesOptions<T extends ChartSeriesRecord = ChartSeriesRecord> {
  xKey?: keyof T | string;
  labelKey?: keyof T | string;
  includeMeta?: boolean;
  metaKeys?: Array<keyof T | string>;
  preserveEmptyPoints?: boolean;
}

export interface BuiltChartSeriesPoint {
  x: string | number;
  y: number;
  label?: string;
  meta?: Record<string, unknown>;
}

export interface BuiltChartSeries {
  key: string;
  name: string;
  color?: string;
  type?: "line" | "bar" | "area";
  stackId?: string;
  yAxisId?: string;
  hidden?: boolean;
  points: BuiltChartSeriesPoint[];
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const toNumber = (value: ChartSeriesPrimitive): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const toXValue = (value: ChartSeriesPrimitive, fallbackIndex: number): string | number => {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  return fallbackIndex;
};

const getRecordValue = <T extends ChartSeriesRecord>(
  row: T,
  key?: keyof T | string,
): ChartSeriesPrimitive => {
  if (!key) return undefined;
  return row[key as keyof T];
};

const buildMeta = <T extends ChartSeriesRecord>(
  row: T,
  options?: BuildChartSeriesOptions<T>,
): Record<string, unknown> | undefined => {
  if (!options?.includeMeta && (!options?.metaKeys || options.metaKeys.length === 0)) {
    return undefined;
  }

  if (options.metaKeys && options.metaKeys.length > 0) {
    return options.metaKeys.reduce<Record<string, unknown>>((acc, key) => {
      acc[String(key)] = row[key as keyof T];
      return acc;
    }, {});
  }

  const { [String(options.xKey ?? "x")]: _x, [String(options.labelKey ?? "label")]: _label, ...rest } =
    row as Record<string, unknown>;

  return rest;
};

export const buildChartSeries = <T extends ChartSeriesRecord>(
  data: T[],
  seriesItems: BuildChartSeriesItem<T>[],
  options?: BuildChartSeriesOptions<T>,
): BuiltChartSeries[] => {
  if (!Array.isArray(data) || data.length === 0 || !Array.isArray(seriesItems) || seriesItems.length === 0) {
    return [];
  }

  return seriesItems.map<BuiltChartSeries>((seriesItem) => {
    const points: BuiltChartSeriesPoint[] = [];

    data.forEach((row, index) => {
      const rawX = getRecordValue(row, options?.xKey);
      const rawLabel = getRecordValue(row, options?.labelKey);
      const rawValue = getRecordValue(row, seriesItem.key);

      let value = toNumber(rawValue);

      if (value === null && !options?.preserveEmptyPoints) {
        return;
      }

      if (value === null) {
        value = 0;
      }

      const finalValue = seriesItem.formatter ? seriesItem.formatter(value, row, index) : value;

      if (!isFiniteNumber(finalValue)) {
        return;
      }

      points.push({
        x: toXValue(rawX, index),
        y: finalValue,
        label: typeof rawLabel === "string" || typeof rawLabel === "number" ? String(rawLabel) : undefined,
        meta: buildMeta(row, options),
      });
    });

    return {
      key: String(seriesItem.key),
      name: seriesItem.name,
      color: seriesItem.color,
      type: seriesItem.type,
      stackId: seriesItem.stackId,
      yAxisId: seriesItem.yAxisId,
      hidden: seriesItem.hidden,
      points,
    };
  });
};

export default buildChartSeries;
