// src/utils/formatPercentage.ts

export interface FormatPercentageOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  fallback?: string;
  suffix?: string;
  prefix?: string;
  trimTrailingZeros?: boolean;
  /**
   * true  -> input 0.256 becomes 25.6%
   * false -> input 25.6 becomes 25.6%
   */
  inputIsRatio?: boolean;
  clamp?: boolean;
  clampMin?: number;
  clampMax?: number;
  includePlusSign?: boolean;
}

const DEFAULT_LOCALE = "en-IN";
const DEFAULT_FALLBACK = "—";

function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

function isNumericString(value: string): boolean {
  if (!value.trim()) return false;
  return !Number.isNaN(Number(value));
}

function toNumber(value: number | string | null | undefined): number | null {
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

function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function applyAffixes(value: string, prefix?: string, suffix?: string): string {
  return `${prefix ?? ""}${value}${suffix ?? ""}`;
}

/**
 * Formats a numeric value as percentage.
 *
 * Examples:
 * - 25.678 -> 25.68%
 * - 0.256 with inputIsRatio=true -> 25.6%
 * - -12.5 -> -12.5%
 * - 8.4 with includePlusSign=true -> +8.4%
 */
export function formatPercentage(
  value: number | string | null | undefined,
  options: FormatPercentageOptions = {},
): string {
  const {
    locale = DEFAULT_LOCALE,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    fallback = DEFAULT_FALLBACK,
    suffix,
    prefix,
    trimTrailingZeros = true,
    inputIsRatio = false,
    clamp = false,
    clampMin = inputIsRatio ? 0 : 0,
    clampMax = inputIsRatio ? 1 : 100,
    includePlusSign = false,
  } = options;

  if (isNil(value) || value === "") {
    return fallback;
  }

  const numericValue = toNumber(value);

  if (numericValue === null) {
    return fallback;
  }

  let safeValue = numericValue;

  if (clamp) {
    safeValue = clampValue(safeValue, clampMin, clampMax);
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const percentValue = inputIsRatio ? safeValue : safeValue / 100;
  let formatted = formatter.format(percentValue);

  if (trimTrailingZeros) {
    formatted = trimZeros(formatted);
  }

  if (includePlusSign && safeValue > 0) {
    formatted = `+${formatted}`;
  }

  return applyAffixes(formatted, prefix, suffix);
}

export default formatPercentage;