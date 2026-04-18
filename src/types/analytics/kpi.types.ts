export type KpiValueFormat =
  | "number"
  | "currency"
  | "percent"
  | "duration"
  | "compact"
  | "text";

export type KpiTrendDirection = "up" | "down" | "neutral";
export type KpiStatus = "positive" | "negative" | "warning" | "neutral" | "info";
export type KpiSize = "sm" | "md" | "lg";
export type KpiComparisonMode = "none" | "previous-period" | "target" | "benchmark";

export interface KpiValueDescriptor {
  raw: number | string;
  formatted?: string;
  format?: KpiValueFormat;
  prefix?: string;
  suffix?: string;
}

export interface KpiDelta {
  value?: number;
  percent?: number;
  direction?: KpiTrendDirection;
  label?: string;
}

export interface KpiTarget {
  value: number;
  formatted?: string;
  label?: string;
  progressPercent?: number;
  achieved?: boolean;
}

export interface KpiBenchmark {
  value: number;
  formatted?: string;
  label?: string;
  source?: string;
}

export interface KpiMeta {
  description?: string;
  tooltip?: string;
  icon?: string;
  colorToken?: string;
  updatedAt?: string;
  isClickable?: boolean;
}

export interface KpiCardData {
  key: string;
  label: string;
  value: KpiValueDescriptor;
  secondaryValue?: KpiValueDescriptor;
  delta?: KpiDelta;
  target?: KpiTarget;
  benchmark?: KpiBenchmark;
  status?: KpiStatus;
  comparisonMode?: KpiComparisonMode;
  meta?: KpiMeta;
}

export interface KpiRowItem extends KpiCardData {
  rank?: number;
  group?: string;
}

export interface KpiSection {
  key: string;
  title: string;
  description?: string;
  items: KpiCardData[];
}

export interface KpiScorecardRow {
  id: string;
  label: string;
  value: number | string;
  formattedValue?: string;
  format?: KpiValueFormat;
  delta?: KpiDelta;
  status?: KpiStatus;
  target?: number;
  formattedTarget?: string;
}

export interface KpiScorecard {
  key: string;
  title: string;
  description?: string;
  rows: KpiScorecardRow[];
}

export interface KpiWidgetState {
  isLoading?: boolean;
  isRefreshing?: boolean;
  isError?: boolean;
  errorMessage?: string | null;
  lastUpdatedAt?: string | null;
}

export interface KpiCardProps {
  data: KpiCardData;
  size?: KpiSize;
  isLoading?: boolean;
  onClick?: () => void;
}

export interface KpiGridProps {
  items: KpiCardData[];
  columns?: 2 | 3 | 4 | 5 | 6;
  isLoading?: boolean;
}

export interface KpiMapperInput {
  key: string;
  label: string;
  value: number | string;
  previousValue?: number;
  targetValue?: number;
  benchmarkValue?: number;
  format?: KpiValueFormat;
  prefix?: string;
  suffix?: string;
  description?: string;
  icon?: string;
  colorToken?: string;
}

export interface KpiMappedValue {
  rawValue: number | string;
  displayValue: string;
  format?: KpiValueFormat;
  deltaValue?: number;
  deltaPercent?: number;
  trend?: KpiTrendDirection;
  progressPercent?: number;
  status?: KpiStatus;
}

export interface KpiCollectionSummary {
  total: number;
  positiveCount: number;
  negativeCount: number;
  warningCount: number;
  neutralCount: number;
}