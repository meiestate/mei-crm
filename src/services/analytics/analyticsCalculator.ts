export type NumericLike = number | string | null | undefined;

export interface SummaryMetricResult {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: "up" | "down" | "neutral";
}

export interface RatioResult {
  numerator: number;
  denominator: number;
  ratio: number;
  percentage: number;
}

export interface DistributionItem<TLabel = string> {
  label: TLabel;
  value: number;
  percentage: number;
}

const toNumber = (value: NumericLike, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

const safeDivide = (numerator: number, denominator: number): number => {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) return 0;
  if (denominator === 0) return 0;
  return numerator / denominator;
};

const roundTo = (value: number, digits = 2): number => {
  if (!Number.isFinite(value)) return 0;

  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export const calculateSum = (values: NumericLike[]): number => {
  return values.reduce((total: number, value: NumericLike) => {
    return total + toNumber(value, 0);
  }, 0);
};

export const calculateAverage = (
  values: NumericLike[],
  digits = 2
): number => {
  if (values.length === 0) return 0;

  const total = calculateSum(values);
  return roundTo(total / values.length, digits);
};

export const calculateMin = (values: NumericLike[]): number => {
  if (values.length === 0) return 0;

  return Math.min(...values.map((value: NumericLike) => toNumber(value, 0)));
};

export const calculateMax = (values: NumericLike[]): number => {
  if (values.length === 0) return 0;

  return Math.max(...values.map((value: NumericLike) => toNumber(value, 0)));
};

export const calculateMedian = (
  values: NumericLike[],
  digits = 2
): number => {
  if (values.length === 0) return 0;

  const sorted = values
    .map((value: NumericLike) => toNumber(value, 0))
    .sort((a: number, b: number) => a - b);

  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return roundTo((sorted[middle - 1] + sorted[middle]) / 2, digits);
  }

  return roundTo(sorted[middle], digits);
};

export const calculateGrowth = (
  currentValue: NumericLike,
  previousValue: NumericLike,
  digits = 2
): SummaryMetricResult => {
  const current = toNumber(currentValue, 0);
  const previous = toNumber(previousValue, 0);
  const change = current - previous;

  const changePercent =
    previous === 0
      ? current === 0
        ? 0
        : 100
      : safeDivide(change, previous) * 100;

  let trend: "up" | "down" | "neutral" = "neutral";

  if (change > 0) trend = "up";
  if (change < 0) trend = "down";

  return {
    current: roundTo(current, digits),
    previous: roundTo(previous, digits),
    change: roundTo(change, digits),
    changePercent: roundTo(changePercent, digits),
    trend,
  };
};

export const calculatePercentage = (
  value: NumericLike,
  total: NumericLike,
  digits = 2
): number => {
  const numerator = toNumber(value, 0);
  const denominator = toNumber(total, 0);

  return roundTo(safeDivide(numerator, denominator) * 100, digits);
};

export const calculateRatio = (
  numeratorValue: NumericLike,
  denominatorValue: NumericLike,
  digits = 2
): RatioResult => {
  const numerator = toNumber(numeratorValue, 0);
  const denominator = toNumber(denominatorValue, 0);
  const ratio = safeDivide(numerator, denominator);
  const percentage = ratio * 100;

  return {
    numerator: roundTo(numerator, digits),
    denominator: roundTo(denominator, digits),
    ratio: roundTo(ratio, digits),
    percentage: roundTo(percentage, digits),
  };
};

export const calculateConversionRate = (
  converted: NumericLike,
  total: NumericLike,
  digits = 2
): number => {
  return calculatePercentage(converted, total, digits);
};

export const calculateDropOffRate = (
  lost: NumericLike,
  total: NumericLike,
  digits = 2
): number => {
  return calculatePercentage(lost, total, digits);
};

export const calculateWinRate = (
  won: NumericLike,
  totalClosed: NumericLike,
  digits = 2
): number => {
  return calculatePercentage(won, totalClosed, digits);
};

export const calculateCostPerLead = (
  spend: NumericLike,
  leads: NumericLike,
  digits = 2
): number => {
  const totalSpend = toNumber(spend, 0);
  const totalLeads = toNumber(leads, 0);

  return roundTo(safeDivide(totalSpend, totalLeads), digits);
};

export const calculateCostPerQualifiedLead = (
  spend: NumericLike,
  qualifiedLeads: NumericLike,
  digits = 2
): number => {
  const totalSpend = toNumber(spend, 0);
  const totalQualifiedLeads = toNumber(qualifiedLeads, 0);

  return roundTo(safeDivide(totalSpend, totalQualifiedLeads), digits);
};

export const calculateAverageDealSize = (
  revenue: NumericLike,
  dealsCount: NumericLike,
  digits = 2
): number => {
  const totalRevenue = toNumber(revenue, 0);
  const totalDeals = toNumber(dealsCount, 0);

  return roundTo(safeDivide(totalRevenue, totalDeals), digits);
};

export const calculateRevenuePerAgent = (
  revenue: NumericLike,
  agentCount: NumericLike,
  digits = 2
): number => {
  return roundTo(
    safeDivide(toNumber(revenue, 0), toNumber(agentCount, 0)),
    digits
  );
};

export const calculateAverageRevenuePerDeal = (
  revenue: NumericLike,
  dealsCount: NumericLike,
  digits = 2
): number => {
  return calculateAverageDealSize(revenue, dealsCount, digits);
};

export const calculatePipelineVelocity = (
  totalPipelineValue: NumericLike,
  avgSalesCycleDays: NumericLike,
  winRatePercent: NumericLike,
  digits = 2
): number => {
  const pipelineValue = toNumber(totalPipelineValue, 0);
  const cycleDays = toNumber(avgSalesCycleDays, 0);
  const winRate = toNumber(winRatePercent, 0) / 100;

  if (cycleDays === 0) return 0;

  return roundTo((pipelineValue * winRate) / cycleDays, digits);
};

export const calculateForecastAccuracy = (
  forecasted: NumericLike,
  actual: NumericLike,
  digits = 2
): number => {
  const forecast = toNumber(forecasted, 0);
  const actualValue = toNumber(actual, 0);

  if (forecast === 0 && actualValue === 0) return 100;
  if (forecast === 0) return 0;

  const errorPercent =
    Math.abs(forecast - actualValue) / Math.abs(forecast) * 100;

  return roundTo(Math.max(0, 100 - errorPercent), digits);
};

export const calculateTargetAchievement = (
  achieved: NumericLike,
  target: NumericLike,
  digits = 2
): number => {
  return calculatePercentage(achieved, target, digits);
};

export const calculateCollectionRate = (
  collected: NumericLike,
  billed: NumericLike,
  digits = 2
): number => {
  return calculatePercentage(collected, billed, digits);
};

export const calculatePendingRate = (
  pending: NumericLike,
  total: NumericLike,
  digits = 2
): number => {
  return calculatePercentage(pending, total, digits);
};

export const calculateStageDistribution = <TLabel = string>(
  items: Array<{ label: TLabel; value: NumericLike }>,
  digits = 2
): DistributionItem<TLabel>[] => {
  const total = calculateSum(items.map((item) => item.value));

  return items.map((item) => ({
    label: item.label,
    value: roundTo(toNumber(item.value, 0), digits),
    percentage: calculatePercentage(item.value, total, digits),
  }));
};

export const calculateCumulativeSeries = (
  values: NumericLike[],
  digits = 2
): number[] => {
  let runningTotal = 0;

  return values.map((value: NumericLike) => {
    runningTotal += toNumber(value, 0);
    return roundTo(runningTotal, digits);
  });
};

export const calculateMovingAverage = (
  values: NumericLike[],
  windowSize = 3,
  digits = 2
): number[] => {
  if (windowSize <= 0) return values.map(() => 0);

  return values.map((_, index: number) => {
    const start = Math.max(0, index - windowSize + 1);
    const windowValues = values.slice(start, index + 1);
    return calculateAverage(windowValues, digits);
  });
};

export const calculateTrendDeltaSeries = (
  currentValues: NumericLike[],
  previousValues: NumericLike[],
  digits = 2
): number[] => {
  const maxLength = Math.max(currentValues.length, previousValues.length);

  return Array.from({ length: maxLength }, (_, index: number) => {
    const current = toNumber(currentValues[index], 0);
    const previous = toNumber(previousValues[index], 0);
    return roundTo(current - previous, digits);
  });
};

export const groupAndSumByKey = <T extends Record<string, unknown>>(
  items: T[],
  groupKey: keyof T,
  valueKey: keyof T,
  digits = 2
): Array<{ key: string; total: number }> => {
  const grouped = new Map<string, number>();

  items.forEach((item: T) => {
    const groupValue = String(item[groupKey] ?? "Unknown");
    const numericValue = toNumber(item[valueKey] as NumericLike, 0);

    grouped.set(groupValue, (grouped.get(groupValue) ?? 0) + numericValue);
  });

  return Array.from(grouped.entries()).map(([key, total]) => ({
    key,
    total: roundTo(total, digits),
  }));
};

export const sortNumericDescending = <T>(
  items: T[],
  selector: (item: T) => NumericLike
): T[] => {
  return [...items].sort((a: T, b: T) => {
    return toNumber(selector(b), 0) - toNumber(selector(a), 0);
  });
};

export const sortNumericAscending = <T>(
  items: T[],
  selector: (item: T) => NumericLike
): T[] => {
  return [...items].sort((a: T, b: T) => {
    return toNumber(selector(a), 0) - toNumber(selector(b), 0);
  });
};

export const pickTopN = <T>(items: T[], count: number): T[] => {
  if (count <= 0) return [];
  return items.slice(0, count);
};

export const calculateCompletionProgress = (
  completed: NumericLike,
  total: NumericLike,
  digits = 2
): number => {
  return calculatePercentage(completed, total, digits);
};

export const calculateResponseRate = (
  responses: NumericLike,
  sent: NumericLike,
  digits = 2
): number => {
  return calculatePercentage(responses, sent, digits);
};

export const calculateOpenRate = (
  opened: NumericLike,
  delivered: NumericLike,
  digits = 2
): number => {
  return calculatePercentage(opened, delivered, digits);
};

export const calculateClickRate = (
  clicks: NumericLike,
  delivered: NumericLike,
  digits = 2
): number => {
  return calculatePercentage(clicks, delivered, digits);
};

export const calculateReplyRate = (
  replies: NumericLike,
  delivered: NumericLike,
  digits = 2
): number => {
  return calculatePercentage(replies, delivered, digits);
};

export const analyticsCalculator = {
  toNumber,
  roundTo,
  safeDivide,
  calculateSum,
  calculateAverage,
  calculateMin,
  calculateMax,
  calculateMedian,
  calculateGrowth,
  calculatePercentage,
  calculateRatio,
  calculateConversionRate,
  calculateDropOffRate,
  calculateWinRate,
  calculateCostPerLead,
  calculateCostPerQualifiedLead,
  calculateAverageDealSize,
  calculateRevenuePerAgent,
  calculateAverageRevenuePerDeal,
  calculatePipelineVelocity,
  calculateForecastAccuracy,
  calculateTargetAchievement,
  calculateCollectionRate,
  calculatePendingRate,
  calculateStageDistribution,
  calculateCumulativeSeries,
  calculateMovingAverage,
  calculateTrendDeltaSeries,
  groupAndSumByKey,
  sortNumericDescending,
  sortNumericAscending,
  pickTopN,
  calculateCompletionProgress,
  calculateResponseRate,
  calculateOpenRate,
  calculateClickRate,
  calculateReplyRate,
};

export default analyticsCalculator;