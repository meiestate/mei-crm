export type BaseChartType =
  | "line"
  | "bar"
  | "area"
  | "pie"
  | "donut"
  | "funnel"
  | "radar"
  | "scatter"
  | "composed"
  | "metric"
  | "table";

export type ChartLegendPosition = "top" | "right" | "bottom" | "left";
export type ChartValueFormat =
  | "number"
  | "currency"
  | "percent"
  | "duration"
  | "compact"
  | "text";

export type ChartAxisType = "category" | "number" | "time";
export type ChartSeriesVariant = "solid" | "dashed" | "stacked" | "gradient";

export interface ChartMeta {
  title?: string;
  subtitle?: string;
  description?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  lastUpdatedAt?: string;
}

export interface ChartInteractionConfig {
  clickable?: boolean;
  selectable?: boolean;
  drilldownEnabled?: boolean;
  hoverEnabled?: boolean;
}

export interface ChartDimensionConfig {
  width?: number | string;
  height?: number | string;
  minHeight?: number;
  responsive?: boolean;
}

export interface ChartAxisConfig {
  key: string;
  label?: string;
  type?: ChartAxisType;
  format?: ChartValueFormat;
  allowDecimals?: boolean;
  tickCount?: number;
  domain?: [number | "auto" | "dataMin", number | "auto" | "dataMax"];
}

export interface ChartTooltipField {
  key: string;
  label: string;
  format?: ChartValueFormat;
}

export interface ChartTooltipConfig {
  enabled?: boolean;
  titleKey?: string;
  fields?: ChartTooltipField[];
}

export interface ChartLegendItem {
  key: string;
  label: string;
  color?: string;
}

export interface ChartLegendConfig {
  enabled?: boolean;
  position?: ChartLegendPosition;
  items?: ChartLegendItem[];
}

export interface ChartSeriesConfig {
  key: string;
  label: string;
  color?: string;
  format?: ChartValueFormat;
  variant?: ChartSeriesVariant;
  stackId?: string;
  yAxisId?: string;
  hidden?: boolean;
}

export interface BaseChartDatum {
  label?: string;
  value?: number;
  [key: string]: unknown;
}

export interface LineChartDatum extends BaseChartDatum {
  x: string | number;
  y: number;
  secondaryY?: number;
}

export interface BarChartDatum extends BaseChartDatum {
  category: string;
  value: number;
  secondaryValue?: number;
  targetValue?: number;
}

export interface PieChartDatum extends BaseChartDatum {
  name: string;
  value: number;
}

export interface FunnelChartDatum extends BaseChartDatum {
  stage: string;
  value: number;
  conversionRate?: number;
}

export interface ScatterChartDatum extends BaseChartDatum {
  x: number;
  y: number;
  z?: number;
}

export interface MetricChartDatum {
  label: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  format?: ChartValueFormat;
}

export interface TableChartColumn {
  key: string;
  label: string;
  format?: ChartValueFormat | "date" | "datetime" | "badge";
  align?: "left" | "center" | "right";
  sortable?: boolean;
  width?: number | string;
}

export interface TableChartRow {
  id: string | number;
  [key: string]: unknown;
}

export interface BaseChartConfig<TType extends BaseChartType, TData> {
  id: string;
  type: TType;
  meta?: ChartMeta;
  dimensions?: ChartDimensionConfig;
  interaction?: ChartInteractionConfig;
  xAxis?: ChartAxisConfig;
  yAxis?: ChartAxisConfig;
  legend?: ChartLegendConfig;
  tooltip?: ChartTooltipConfig;
  series?: ChartSeriesConfig[];
  data: TData[];
}

export interface LineChartConfig
  extends BaseChartConfig<"line", LineChartDatum> {
  curved?: boolean;
  showDots?: boolean;
  areaFill?: boolean;
}

export interface AreaChartConfig
  extends BaseChartConfig<"area", LineChartDatum> {
  stacked?: boolean;
}

export interface BarChartConfig extends BaseChartConfig<"bar", BarChartDatum> {
  horizontal?: boolean;
  stacked?: boolean;
  grouped?: boolean;
}

export interface ComposedChartConfig
  extends BaseChartConfig<"composed", BaseChartDatum> {
  barSeriesKeys?: string[];
  lineSeriesKeys?: string[];
  areaSeriesKeys?: string[];
}

export interface PieChartConfig extends BaseChartConfig<"pie", PieChartDatum> {
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
}

export interface DonutChartConfig
  extends BaseChartConfig<"donut", PieChartDatum> {
  innerRadius?: number;
  outerRadius?: number;
  centerLabel?: string;
  centerValue?: string;
}

export interface FunnelChartConfig
  extends BaseChartConfig<"funnel", FunnelChartDatum> {
  showConversionRates?: boolean;
}

export interface RadarChartConfig
  extends BaseChartConfig<"radar", BaseChartDatum> {}

export interface ScatterChartConfig
  extends BaseChartConfig<"scatter", ScatterChartDatum> {}

export interface MetricChartConfig
  extends BaseChartConfig<"metric", MetricChartDatum> {}

export interface TableChartConfig {
  id: string;
  type: "table";
  meta?: ChartMeta;
  dimensions?: ChartDimensionConfig;
  interaction?: ChartInteractionConfig;
  columns: TableChartColumn[];
  rows: TableChartRow[];
}

export type AnyChartConfig =
  | LineChartConfig
  | AreaChartConfig
  | BarChartConfig
  | ComposedChartConfig
  | PieChartConfig
  | DonutChartConfig
  | FunnelChartConfig
  | RadarChartConfig
  | ScatterChartConfig
  | MetricChartConfig
  | TableChartConfig;

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  chart: AnyChartConfig;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string | null;
  onRefresh?: () => void;
  onExport?: () => void;
  onClick?: () => void;
}

export interface ChartDrilldownPayload {
  chartId: string;
  chartType: BaseChartType;
  label?: string;
  seriesKey?: string;
  datum?: Record<string, unknown>;
}

export interface ChartDrilldownState {
  isOpen: boolean;
  selectedChartId: string | null;
  payload: ChartDrilldownPayload | null;
}

export interface ChartEmptyState {
  title?: string;
  message?: string;
}

export interface ChartLoadingState {
  title?: string;
  message?: string;
}

export interface ChartExportOptions {
  chartId: string;
  format: "png" | "svg" | "csv" | "xlsx" | "pdf";
  includeTitle?: boolean;
  includeLegend?: boolean;
}

export interface ChartFilterOption {
  label: string;
  value: string;
}

export interface ChartFilterConfig {
  id: string;
  label: string;
  type: "select" | "multi-select" | "date-range" | "toggle";
  options?: ChartFilterOption[];
  value?: unknown;
}

export interface ChartSectionConfig {
  key: string;
  title: string;
  description?: string;
  charts: AnyChartConfig[];
}