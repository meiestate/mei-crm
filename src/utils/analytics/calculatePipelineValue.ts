// src/features/analytics/utils/calculatePipelineValue.ts

export type PipelineCurrencyValue = number | string | null | undefined;

export interface PipelineValueItem {
  /**
   * Primary numeric value for pipeline amount.
   * Example: deal.value, opportunity.amount, expectedRevenue
   */
  value?: PipelineCurrencyValue;

  /**
   * Optional alternate keys often found in CRM datasets.
   */
  amount?: PipelineCurrencyValue;
  revenue?: PipelineCurrencyValue;
  expectedRevenue?: PipelineCurrencyValue;
  dealValue?: PipelineCurrencyValue;

  /**
   * Optional probability (0-100 or 0-1) for weighted pipeline calculation.
   */
  probability?: number | string | null;

  /**
   * Optional stage metadata.
   */
  stage?: string | null;
  status?: string | null;

  /**
   * Allow extra unknown properties.
   */
  [key: string]: unknown;
}

export interface CalculatePipelineValueOptions<T extends PipelineValueItem = PipelineValueItem> {
  /**
   * Decimal precision for final result.
   * Default: 2
   */
  precision?: number;

  /**
   * When true, calculates weighted pipeline using probability.
   * Default: false
   */
  weighted?: boolean;

  /**
   * Optional custom value selector.
   */
  getValue?: (item: T) => unknown;

  /**
   * Optional custom probability selector.
   */
  getProbability?: (item: T) => unknown;

  /**
   * Optional item filter.
   */
  filter?: (item: T, index: number) => boolean;

  /**
   * When true, negative values are ignored.
   * Default: true
   */
  ignoreNegativeValues?: boolean;

  /**
   * When true, invalid items are skipped.
   * Default: true
   */
  skipInvalid?: boolean;
}

export interface PipelineValueSummary {
  total: number;
  weightedTotal: number;
  average: number;
  count: number;
  validCount: number;
  invalidCount: number;
}

/**
 * Safely converts unknown input into a finite number.
 */
const toFiniteNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.replace(/,/g, '').trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  return NaN;
};

/**
 * Safely rounds a number.
 */
const roundTo = (value: number, precision: number): number => {
  const safePrecision = Number.isInteger(precision) && precision >= 0 ? precision : 2;
  const factor = 10 ** safePrecision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

/**
 * Extracts the most likely monetary value from a pipeline item.
 */
const getDefaultItemValue = <T extends PipelineValueItem>(item: T): number => {
  const candidates = [
    item.value,
    item.amount,
    item.revenue,
    item.expectedRevenue,
    item.dealValue,
  ];

  for (const candidate of candidates) {
    const parsed = toFiniteNumber(candidate);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return NaN;
};

/**
 * Extracts and normalizes probability.
 * Supports:
 * - 0.75
 * - 75
 * - "75"
 * - "0.75"
 *
 * Returns normalized value between 0 and 1.
 */
const getNormalizedProbability = (value: unknown): number => {
  const parsed = toFiniteNumber(value);

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  if (parsed <= 0) {
    return 0;
  }

  if (parsed <= 1) {
    return parsed;
  }

  if (parsed <= 100) {
    return parsed / 100;
  }

  return 1;
};

/**
 * Calculates total pipeline value from a list of pipeline items.
 *
 * By default:
 * - sums valid item values
 * - ignores negative values
 * - skips invalid values
 *
 * Weighted mode:
 * - multiplies each value by probability
 */
export const calculatePipelineValue = <T extends PipelineValueItem>(
  items: T[] = [],
  options: CalculatePipelineValueOptions<T> = {},
): number => {
  const {
    precision = 2,
    weighted = false,
    getValue,
    getProbability,
    filter,
    ignoreNegativeValues = true,
    skipInvalid = true,
  } = options;

  if (!Array.isArray(items) || items.length === 0) {
    return 0;
  }

  let total = 0;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];

    if (!item) {
      continue;
    }

    if (filter && !filter(item, index)) {
      continue;
    }

    const rawValue = getValue ? getValue(item) : getDefaultItemValue(item);
    const numericValue = toFiniteNumber(rawValue);

    if (!Number.isFinite(numericValue)) {
      if (skipInvalid) {
        continue;
      }
      continue;
    }

    if (ignoreNegativeValues && numericValue < 0) {
      continue;
    }

    if (weighted) {
      const probabilityValue = getProbability ? getProbability(item) : item.probability;
      const probability = getNormalizedProbability(probabilityValue);
      total += numericValue * probability;
    } else {
      total += numericValue;
    }
  }

  return roundTo(total, precision);
};

/**
 * Returns a richer pipeline value summary for KPI cards and dashboards.
 */
export const getPipelineValueSummary = <T extends PipelineValueItem>(
  items: T[] = [],
  options: CalculatePipelineValueOptions<T> = {},
): PipelineValueSummary => {
  const {
    precision = 2,
    getValue,
    getProbability,
    filter,
    ignoreNegativeValues = true,
  } = options;

  if (!Array.isArray(items) || items.length === 0) {
    return {
      total: 0,
      weightedTotal: 0,
      average: 0,
      count: 0,
      validCount: 0,
      invalidCount: 0,
    };
  }

  let total = 0;
  let weightedTotal = 0;
  let validCount = 0;
  let invalidCount = 0;
  let count = 0;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];

    if (!item) {
      invalidCount += 1;
      continue;
    }

    if (filter && !filter(item, index)) {
      continue;
    }

    count += 1;

    const rawValue = getValue ? getValue(item) : getDefaultItemValue(item);
    const numericValue = toFiniteNumber(rawValue);

    if (!Number.isFinite(numericValue)) {
      invalidCount += 1;
      continue;
    }

    if (ignoreNegativeValues && numericValue < 0) {
      invalidCount += 1;
      continue;
    }

    validCount += 1;
    total += numericValue;

    const probabilityValue = getProbability ? getProbability(item) : item.probability;
    const probability = getNormalizedProbability(probabilityValue);
    weightedTotal += numericValue * probability;
  }

  const average = validCount > 0 ? total / validCount : 0;

  return {
    total: roundTo(total, precision),
    weightedTotal: roundTo(weightedTotal, precision),
    average: roundTo(average, precision),
    count,
    validCount,
    invalidCount,
  };
};

/**
 * Formats a pipeline value into a locale-aware currency-like string.
 * Keeps it generic so it can be used across INR / USD / AED / etc.
 */
export const formatPipelineValue = (
  valueInput: unknown,
  locale = 'en-IN',
  currency = 'INR',
  maximumFractionDigits = 0,
): string => {
  const value = toFiniteNumber(valueInput);

  if (!Number.isFinite(value)) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits,
    }).format(0);
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits,
  }).format(value);
};

export default calculatePipelineValue;