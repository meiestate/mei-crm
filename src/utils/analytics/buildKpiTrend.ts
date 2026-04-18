export type KpiTrendDirection = "up" | "down" | "neutral";
export type KpiTrendStatus = "positive" | "negative" | "neutral";

export interface BuildKpiTrendOptions {
  /**
   * When true, increase is considered good.
   * Example: revenue, conversions, qualified leads.
   *
   * When false, decrease is considered good.
   * Example: cost per lead, response time, drop-off rate.
   */
  positiveWhenIncreasing?: boolean;

  /**
   * If the absolute delta is smaller than this threshold,
   * trend will be treated as neutral.
   */
  neutralDeltaThreshold?: number;

  /**
   * Decimal precision used for percentage rounding.
   * Default: 2
   */
  percentagePrecision?: number;

  /**
   * When previous value is 0 and current value is > 0,
   * use this fallback percentage instead of Infinity.
   * Default: 100
   */
  zeroBaselinePercentage?: number;
}

export interface KpiTrendResult {
  currentValue: number;
  previousValue: number | null;
  change: number;
  changePercent: number | null;
  direction: KpiTrendDirection;
  status: KpiTrendStatus;
  isPositive: boolean;
  isNeutral: boolean;
  label: string;
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const roundTo = (value: number, precision = 2): number => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export const buildKpiTrend = (
  current: number | null | undefined,
  previous: number | null | undefined,
  options: BuildKpiTrendOptions = {},
): KpiTrendResult => {
  const {
    positiveWhenIncreasing = true,
    neutralDeltaThreshold = 0,
    percentagePrecision = 2,
    zeroBaselinePercentage = 100,
  } = options;

  const currentValue = isFiniteNumber(current) ? current : 0;
  const previousValue = isFiniteNumber(previous) ? previous : null;

  const change =
    previousValue === null ? currentValue : currentValue - previousValue;

  const absChange = Math.abs(change);
  const isNeutral = absChange <= neutralDeltaThreshold;

  let changePercent: number | null = null;

  if (previousValue === null) {
    changePercent = null;
  } else if (previousValue === 0) {
    if (currentValue === 0) {
      changePercent = 0;
    } else {
      changePercent = zeroBaselinePercentage;
    }
  } else {
    changePercent = roundTo(
      (change / Math.abs(previousValue)) * 100,
      percentagePrecision,
    );
  }

  let direction: KpiTrendDirection = "neutral";

  if (!isNeutral) {
    if (change > 0) {
      direction = "up";
    } else if (change < 0) {
      direction = "down";
    }
  }

  let isPositive = false;

  if (!isNeutral) {
    isPositive = positiveWhenIncreasing ? change > 0 : change < 0;
  }

  const status: KpiTrendStatus = isNeutral
    ? "neutral"
    : isPositive
      ? "positive"
      : "negative";

  const percentLabel =
    changePercent === null ? "" : ` (${changePercent > 0 ? "+" : ""}${changePercent}%)`;

  let label = "No change";

  if (previousValue === null) {
    label = "No previous data";
  } else if (isNeutral) {
    label = "No significant change";
  } else if (change > 0) {
    label = `Increased by ${roundTo(change, percentagePrecision)}${percentLabel}`;
  } else if (change < 0) {
    label = `Decreased by ${Math.abs(roundTo(change, percentagePrecision))}${percentLabel}`;
  }

  return {
    currentValue,
    previousValue,
    change: roundTo(change, percentagePrecision),
    changePercent,
    direction,
    status,
    isPositive,
    isNeutral,
    label,
  };
};

export default buildKpiTrend;