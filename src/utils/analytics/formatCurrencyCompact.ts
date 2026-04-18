// src/utils/formatCurrencyCompact.ts

export interface FormatCurrencyCompactOptions {
  locale?: string;
  currency?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  fallback?: string;
  compactDisplay?: "short" | "long";
  useGrouping?: boolean;
  trimTrailingZeros?: boolean;
  prefix?: string;
  suffix?: string;
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

function applyAffixes(value: string, prefix?: string, suffix?: string): string {
  return `${prefix ?? ""}${value}${suffix ?? ""}`;
}

/**
 * Formats currency values in compact form.
 *
 * Examples:
 * - 1200       -> ₹1.2K
 * - 125000     -> ₹1.25L (environment dependent)
 * - 1250000    -> ₹12.5L / ₹1.25M depending on Intl behavior
 * - 10000000   -> ₹1Cr / compact equivalent depending on runtime
 */
export function formatCurrencyCompact(
  value: number | string | null | undefined,
  options: FormatCurrencyCompactOptions = {},
): string {
  const {
    locale = DEFAULT_LOCALE,
    currency = DEFAULT_CURRENCY,
    maximumFractionDigits = 1,
    minimumFractionDigits = 0,
    fallback = DEFAULT_FALLBACK,
    compactDisplay = "short",
    useGrouping = true,
    trimTrailingZeros = true,
    prefix,
    suffix,
  } = options;

  if (isNil(value) || value === "") {
    return fallback;
  }

  const numericValue = toNumber(value);

  if (numericValue === null) {
    return fallback;
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    compactDisplay,
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping,
  });

  const formatted = formatter.format(numericValue);
  const finalValue = trimTrailingZeros ? trimZeros(formatted) : formatted;

  return applyAffixes(finalValue, prefix, suffix);
}

export default formatCurrencyCompact;