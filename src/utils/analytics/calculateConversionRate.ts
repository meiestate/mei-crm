// src/features/analytics/utils/calculateConversionRate.ts

export interface CalculateConversionRateOptions {
  /**
   * Number of decimal places to round to.
   * Default: 2
   */
  precision?: number;

  /**
   * When true, returns 0 if denominator is invalid or <= 0.
   * When false, still returns 0 for invalid cases, but keeps API explicit for future extension.
   * Default: true
   */
  safe?: boolean;

  /**
   * Clamp final output between min and max values.
   * Useful when analytics data may contain noisy values.
   * Default: true
   */
  clamp?: boolean;

  /**
   * Minimum allowed result value.
   * Default: 0
   */
  min?: number;

  /**
   * Maximum allowed result value.
   * Default: 100
   */
  max?: number;
}

export interface ConversionRateResult {
  /**
   * Final percentage value.
   * Example: 25 means 25%
   */
  rate: number;

  /**
   * Raw numerator used.
   */
  converted: number;

  /**
   * Raw denominator used.
   */
  total: number;

  /**
   * Whether calculation was possible with valid denominator.
   */
  isValid: boolean;
}

/**
 * Ensures a value is a finite number.
 */
const toFiniteNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

/**
 * Rounds a number to a fixed precision safely.
 */
const roundTo = (value: number, precision: number): number => {
  const safePrecision = Number.isInteger(precision) && precision >= 0 ? precision : 2;
  const factor = 10 ** safePrecision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

/**
 * Clamps a number between min and max.
 */
const clampNumber = (value: number, min: number, max: number): number => {
  if (min > max) {
    return value;
  }

  return Math.min(Math.max(value, min), max);
};

/**
 * Calculates conversion rate as a percentage.
 *
 * Formula:
 *   (converted / total) * 100
 *
 * Examples:
 *   calculateConversionRate(25, 100) => 25
 *   calculateConversionRate(7, 12) => 58.33
 *   calculateConversionRate(0, 50) => 0
 */
export const calculateConversionRate = (
  convertedInput: unknown,
  totalInput: unknown,
  options: CalculateConversionRateOptions = {},
): number => {
  const {
    precision = 2,
    safe = true,
    clamp = true,
    min = 0,
    max = 100,
  } = options;

  const converted = toFiniteNumber(convertedInput);
  const total = toFiniteNumber(totalInput);

  if (!Number.isFinite(converted) || !Number.isFinite(total)) {
    return 0;
  }

  if (total <= 0) {
    return safe ? 0 : 0;
  }

  const rawRate = (converted / total) * 100;
  const roundedRate = roundTo(rawRate, precision);

  return clamp ? clampNumber(roundedRate, min, max) : roundedRate;
};

/**
 * Same calculation as `calculateConversionRate`,
 * but returns a richer metadata object for charts / KPI cards / reports.
 */
export const getConversionRate = (
  convertedInput: unknown,
  totalInput: unknown,
  options: CalculateConversionRateOptions = {},
): ConversionRateResult => {
  const converted = toFiniteNumber(convertedInput);
  const total = toFiniteNumber(totalInput);

  const isValid = total > 0;

  return {
    rate: calculateConversionRate(converted, total, options),
    converted,
    total,
    isValid,
  };
};

/**
 * Converts conversion rate into a formatted percentage string.
 *
 * Example:
 *   formatConversionRate(25.456) => "25.46%"
 */
export const formatConversionRate = (
  rateInput: unknown,
  precision = 2,
): string => {
  const rate = toFiniteNumber(rateInput);
  return `${roundTo(rate, precision).toFixed(
    Number.isInteger(precision) && precision >= 0 ? precision : 2,
  )}%`;
};

export default calculateConversionRate;