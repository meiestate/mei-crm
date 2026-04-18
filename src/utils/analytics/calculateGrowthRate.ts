// src/features/analytics/utils/calculateGrowthRate.ts

export interface CalculateGrowthRateOptions {
  /**
   * Number of decimal places to round to.
   * Default: 2
   */
  precision?: number;

  /**
   * Clamp output between min and max values.
   * Default: false
   */
  clamp?: boolean;

  /**
   * Minimum output value when clamp is enabled.
   * Default: -100
   */
  min?: number;

  /**
   * Maximum output value when clamp is enabled.
   * Default: 1000
   */
  max?: number;
}

export interface GrowthRateResult {
  /**
   * Final growth percentage.
   * Example: 20 means +20%
   */
  rate: number;

  /**
   * Current period value.
   */
  current: number;

  /**
   * Previous period value.
   */
  previous: number;

  /**
   * Difference between current and previous.
   */
  change: number;

  /**
   * Whether growth calculation is considered valid.
   */
  isValid: boolean;

  /**
   * Direction of growth.
   */
  direction: 'up' | 'down' | 'flat';
}

/**
 * Safely converts unknown input into a finite number.
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
 * Safely rounds a number.
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
 * Calculates growth rate percentage.
 *
 * Formula:
 *   ((current - previous) / previous) * 100
 *
 * Examples:
 *   calculateGrowthRate(120, 100) => 20
 *   calculateGrowthRate(80, 100) => -20
 *   calculateGrowthRate(100, 100) => 0
 */
export const calculateGrowthRate = (
  currentInput: unknown,
  previousInput: unknown,
  options: CalculateGrowthRateOptions = {},
): number => {
  const {
    precision = 2,
    clamp = false,
    min = -100,
    max = 1000,
  } = options;

  const current = toFiniteNumber(currentInput);
  const previous = toFiniteNumber(previousInput);

  if (!Number.isFinite(current) || !Number.isFinite(previous)) {
    return 0;
  }

  /**
   * Special handling when previous value is 0.
   * Common analytics convention:
   * - if both current and previous are 0 => 0%
   * - if previous is 0 and current > 0 => 100%
   * - if previous is 0 and current < 0 => -100%
   */
  if (previous === 0) {
    if (current === 0) {
      return 0;
    }

    const zeroBaseRate = current > 0 ? 100 : -100;
    return clamp ? clampNumber(zeroBaseRate, min, max) : zeroBaseRate;
  }

  const rawRate = ((current - previous) / Math.abs(previous)) * 100;
  const roundedRate = roundTo(rawRate, precision);

  return clamp ? clampNumber(roundedRate, min, max) : roundedRate;
};

/**
 * Returns detailed growth rate metadata for use in KPI cards,
 * charts, summaries, and analytics widgets.
 */
export const getGrowthRate = (
  currentInput: unknown,
  previousInput: unknown,
  options: CalculateGrowthRateOptions = {},
): GrowthRateResult => {
  const current = toFiniteNumber(currentInput);
  const previous = toFiniteNumber(previousInput);
  const change = current - previous;
  const rate = calculateGrowthRate(current, previous, options);

  let direction: GrowthRateResult['direction'] = 'flat';

  if (change > 0) {
    direction = 'up';
  } else if (change < 0) {
    direction = 'down';
  }

  return {
    rate,
    current,
    previous,
    change,
    isValid: previous !== 0 || current === 0,
    direction,
  };
};

/**
 * Formats a growth rate value as percentage string.
 *
 * Example:
 *   formatGrowthRate(12.345) => "12.35%"
 *   formatGrowthRate(-8.2) => "-8.20%"
 */
export const formatGrowthRate = (
  rateInput: unknown,
  precision = 2,
  showPlusSign = false,
): string => {
  const rate = toFiniteNumber(rateInput);
  const safePrecision = Number.isInteger(precision) && precision >= 0 ? precision : 2;
  const rounded = roundTo(rate, safePrecision);
  const sign = showPlusSign && rounded > 0 ? '+' : '';

  return `${sign}${rounded.toFixed(safePrecision)}%`;
};

export default calculateGrowthRate;