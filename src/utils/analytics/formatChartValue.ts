// src/utils/formatChartValue.ts

export type ChartValuePrimitive = number | string | null | undefined;

export type ChartValueFormat =
  | "number"
  | "currency"
  | "percent"
  | "compact"
  | "compactCurrency"
  | "integer"
  | "decimal"
  | "duration"
  | "date"
  | "datetime"
  | "custom";

export interface FormatChartValueOptions {
  format?: ChartValueFormat;
  currency?: string;
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  compactDisplay?: "short" | "long";
  fallback?: string;
  prefix?: string;
  suffix?: string;
  percentAsRatio?: boolean;
  customFormatter?: (value: number | string) => string;
  dateOptions?: Intl.DateTimeFormatOptions;
  trimTrailingZeros?: boolean;
}

const DEFAULT_LOCALE = "en-IN";
const DEFAULT_CURRENCY = "INR";
const DEFAULT_FALLBACK = "—";

function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

function isNumericString(value: string): boolean {
  if (!value.trim()) return false;
  return !Number.isNaN(Number(value));
}

function toNumber(value: ChartValuePrimitive): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && isNumericString(value)) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function trimZeros(value: string): string {
  if (!value.includes(".")) return value;
  return value.replace(/(\.\d*?[1-9])0+$/u, "$1").replace(/\.0+$/u, "");
}

function applyAffixes(
  value: string,
  options?: Pick<FormatChartValueOptions, "prefix" | "suffix">,
): string {
  return `${options?.prefix ?? ""}${value}${options?.suffix ?? ""}`;
}

function formatWithIntl(
  value: number,
  config: Intl.NumberFormatOptions,
  options?: Pick<FormatChartValueOptions, "locale" | "trimTrailingZeros" | "prefix" | "suffix">,
): string {
  const formatter = new Intl.NumberFormat(options?.locale ?? DEFAULT_LOCALE, config);
  const formatted = formatter.format(value);
  const cleanValue = options?.trimTrailingZeros ? trimZeros(formatted) : formatted;
  return applyAffixes(cleanValue, options);
}

function formatDuration(value: number): string {
  if (!Number.isFinite(value)) return DEFAULT_FALLBACK;

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs < 60) {
    return `${sign}${abs}s`;
  }

  if (abs < 3600) {
    const minutes = Math.floor(abs / 60);
    const seconds = abs % 60;
    return seconds > 0 ? `${sign}${minutes}m ${seconds}s` : `${sign}${minutes}m`;
  }

  if (abs < 86400) {
    const hours = Math.floor(abs / 3600);
    const minutes = Math.floor((abs % 3600) / 60);
    return minutes > 0 ? `${sign}${hours}h ${minutes}m` : `${sign}${hours}h`;
  }

  const days = Math.floor(abs / 86400);
  const hours = Math.floor((abs % 86400) / 3600);
  return hours > 0 ? `${sign}${days}d ${hours}h` : `${sign}${days}d`;
}

function formatDateLike(
  value: string | number,
  options: FormatChartValueOptions,
  withTime = false,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return options.fallback ?? DEFAULT_FALLBACK;
  }

  const formatter = new Intl.DateTimeFormat(
    options.locale ?? DEFAULT_LOCALE,
    options.dateOptions ??
      (withTime
        ? {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }
        : {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
  );

  return applyAffixes(formatter.format(date), options);
}

/**
 * Formats chart values consistently for:
 * - axis labels
 * - tooltip values
 * - KPI numbers
 * - analytics summaries
 */
export function formatChartValue(
  value: ChartValuePrimitive,
  options: FormatChartValueOptions = {},
): string {
  const {
    format = "number",
    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
    maximumFractionDigits,
    minimumFractionDigits,
    compactDisplay = "short",
    fallback = DEFAULT_FALLBACK,
    percentAsRatio = false,
    customFormatter,
    trimTrailingZeros = true,
  } = options;

  if (isNil(value) || value === "") {
    return fallback;
  }

  if (format === "custom" && customFormatter) {
    return customFormatter(value);
  }

  if (format === "date") {
    return formatDateLike(value, options, false);
  }

  if (format === "datetime") {
    return formatDateLike(value, options, true);
  }

  const numericValue = toNumber(value);

  if (numericValue === null) {
    return typeof value === "string" ? applyAffixes(value, options) : fallback;
  }

  switch (format) {
    case "integer":
      return formatWithIntl(
        Math.round(numericValue),
        {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        },
        { locale, trimTrailingZeros, prefix: options.prefix, suffix: options.suffix },
      );

    case "decimal":
      return formatWithIntl(
        numericValue,
        {
          minimumFractionDigits: minimumFractionDigits ?? 0,
          maximumFractionDigits: maximumFractionDigits ?? 2,
        },
        { locale, trimTrailingZeros, prefix: options.prefix, suffix: options.suffix },
      );

    case "currency":
      return formatWithIntl(
        numericValue,
        {
          style: "currency",
          currency,
          minimumFractionDigits: minimumFractionDigits ?? 0,
          maximumFractionDigits: maximumFractionDigits ?? 2,
        },
        { locale, trimTrailingZeros, prefix: options.prefix, suffix: options.suffix },
      );

    case "compact":
      return formatWithIntl(
        numericValue,
        {
          notation: "compact",
          compactDisplay,
          minimumFractionDigits: minimumFractionDigits ?? 0,
          maximumFractionDigits: maximumFractionDigits ?? 1,
        },
        { locale, trimTrailingZeros, prefix: options.prefix, suffix: options.suffix },
      );

    case "compactCurrency":
      return formatWithIntl(
        numericValue,
        {
          style: "currency",
          currency,
          notation: "compact",
          compactDisplay,
          minimumFractionDigits: minimumFractionDigits ?? 0,
          maximumFractionDigits: maximumFractionDigits ?? 1,
        },
        { locale, trimTrailingZeros, prefix: options.prefix, suffix: options.suffix },
      );

    case "percent": {
      const percentValue = percentAsRatio ? numericValue : numericValue / 100;
      return formatWithIntl(
        percentValue,
        {
          style: "percent",
          minimumFractionDigits: minimumFractionDigits ?? 0,
          maximumFractionDigits: maximumFractionDigits ?? 2,
        },
        { locale, trimTrailingZeros, prefix: options.prefix, suffix: options.suffix },
      );
    }

    case "duration":
      return applyAffixes(formatDuration(numericValue), options);

    case "number":
    default:
      return formatWithIntl(
        numericValue,
        {
          minimumFractionDigits: minimumFractionDigits ?? 0,
          maximumFractionDigits: maximumFractionDigits ?? 2,
        },
        { locale, trimTrailingZeros, prefix: options.prefix, suffix: options.suffix },
      );
  }
}

/**
 * Handy presets for common chart use-cases.
 */
export const chartValueFormatters = {
  number: (value: ChartValuePrimitive, options?: Omit<FormatChartValueOptions, "format">) =>
    formatChartValue(value, { ...options, format: "number" }),

  integer: (value: ChartValuePrimitive, options?: Omit<FormatChartValueOptions, "format">) =>
    formatChartValue(value, { ...options, format: "integer" }),

  decimal: (value: ChartValuePrimitive, options?: Omit<FormatChartValueOptions, "format">) =>
    formatChartValue(value, { ...options, format: "decimal" }),

  currency: (value: ChartValuePrimitive, options?: Omit<FormatChartValueOptions, "format">) =>
    formatChartValue(value, { ...options, format: "currency" }),

  compact: (value: ChartValuePrimitive, options?: Omit<FormatChartValueOptions, "format">) =>
    formatChartValue(value, { ...options, format: "compact" }),

  compactCurrency: (
    value: ChartValuePrimitive,
    options?: Omit<FormatChartValueOptions, "format">,
  ) => formatChartValue(value, { ...options, format: "compactCurrency" }),

  percent: (value: ChartValuePrimitive, options?: Omit<FormatChartValueOptions, "format">) =>
    formatChartValue(value, { ...options, format: "percent" }),

  duration: (value: ChartValuePrimitive, options?: Omit<FormatChartValueOptions, "format">) =>
    formatChartValue(value, { ...options, format: "duration" }),

  date: (value: ChartValuePrimitive, options?: Omit<FormatChartValueOptions, "format">) =>
    formatChartValue(value, { ...options, format: "date" }),

  datetime: (value: ChartValuePrimitive, options?: Omit<FormatChartValueOptions, "format">) =>
    formatChartValue(value, { ...options, format: "datetime" }),
};

export default formatChartValue;