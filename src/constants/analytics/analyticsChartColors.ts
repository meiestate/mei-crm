export type ThemeMode = "light" | "dark";

export type AnalyticsColorKey =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "purple"
  | "pink"
  | "cyan"
  | "teal"
  | "indigo"
  | "amber"
  | "emerald"
  | "rose";

export type AnalyticsChartPalette = {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  neutral: string;
  purple: string;
  pink: string;
  cyan: string;
  teal: string;
  indigo: string;
  amber: string;
  emerald: string;
  rose: string;
  text: string;
  mutedText: string;
  grid: string;
  axis: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  cardShadow: string;
  pieColors: string[];
  barColors: string[];
  lineColors: string[];
  areaGradientFrom: string;
  areaGradientTo: string;
};

const lightPalette: AnalyticsChartPalette = {
  primary: "#2563eb",
  secondary: "#0f172a",
  accent: "#7c3aed",
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  info: "#0891b2",
  neutral: "#64748b",
  purple: "#8b5cf6",
  pink: "#ec4899",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  indigo: "#4f46e5",
  amber: "#f59e0b",
  emerald: "#10b981",
  rose: "#f43f5e",
  text: "#0f172a",
  mutedText: "#64748b",
  grid: "rgba(148, 163, 184, 0.22)",
  axis: "#94a3b8",
  tooltipBg: "#ffffff",
  tooltipBorder: "rgba(148, 163, 184, 0.28)",
  tooltipText: "#0f172a",
  cardShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
  pieColors: [
    "#2563eb",
    "#7c3aed",
    "#16a34a",
    "#d97706",
    "#dc2626",
    "#0891b2",
    "#ec4899",
    "#4f46e5",
    "#10b981",
    "#f59e0b",
  ],
  barColors: [
    "#2563eb",
    "#0ea5e9",
    "#8b5cf6",
    "#14b8a6",
    "#f59e0b",
    "#ef4444",
    "#10b981",
  ],
  lineColors: [
    "#2563eb",
    "#7c3aed",
    "#16a34a",
    "#d97706",
    "#dc2626",
    "#0891b2",
  ],
  areaGradientFrom: "rgba(37, 99, 235, 0.28)",
  areaGradientTo: "rgba(37, 99, 235, 0.04)",
};

const darkPalette: AnalyticsChartPalette = {
  primary: "#60a5fa",
  secondary: "#e2e8f0",
  accent: "#a78bfa",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#f87171",
  info: "#22d3ee",
  neutral: "#94a3b8",
  purple: "#c084fc",
  pink: "#f472b6",
  cyan: "#22d3ee",
  teal: "#2dd4bf",
  indigo: "#818cf8",
  amber: "#fbbf24",
  emerald: "#34d399",
  rose: "#fb7185",
  text: "#f8fafc",
  mutedText: "#94a3b8",
  grid: "rgba(148, 163, 184, 0.16)",
  axis: "#64748b",
  tooltipBg: "#0f172a",
  tooltipBorder: "rgba(148, 163, 184, 0.22)",
  tooltipText: "#f8fafc",
  cardShadow: "0 14px 36px rgba(0, 0, 0, 0.34)",
  pieColors: [
    "#60a5fa",
    "#a78bfa",
    "#4ade80",
    "#fbbf24",
    "#f87171",
    "#22d3ee",
    "#f472b6",
    "#818cf8",
    "#34d399",
    "#fb7185",
  ],
  barColors: [
    "#60a5fa",
    "#22d3ee",
    "#a78bfa",
    "#2dd4bf",
    "#fbbf24",
    "#f87171",
    "#34d399",
  ],
  lineColors: [
    "#60a5fa",
    "#a78bfa",
    "#4ade80",
    "#fbbf24",
    "#f87171",
    "#22d3ee",
  ],
  areaGradientFrom: "rgba(96, 165, 250, 0.30)",
  areaGradientTo: "rgba(96, 165, 250, 0.03)",
};

export const analyticsChartColorsByTheme: Record<
  ThemeMode,
  AnalyticsChartPalette
> = {
  light: lightPalette,
  dark: darkPalette,
};

export const getAnalyticsChartColors = (
  mode: ThemeMode = "light"
): AnalyticsChartPalette => {
  return analyticsChartColorsByTheme[mode] ?? analyticsChartColorsByTheme.light;
};

export const getAnalyticsColor = (
  key: AnalyticsColorKey,
  mode: ThemeMode = "light"
): string => {
  return getAnalyticsChartColors(mode)[key];
};

export const getAnalyticsSeriesColors = (
  mode: ThemeMode = "light",
  variant: "pie" | "bar" | "line" = "line"
): string[] => {
  const palette = getAnalyticsChartColors(mode);

  if (variant === "pie") return palette.pieColors;
  if (variant === "bar") return palette.barColors;
  return palette.lineColors;
};

export const getAnalyticsSeriesColorByIndex = (
  index: number,
  mode: ThemeMode = "light",
  variant: "pie" | "bar" | "line" = "line"
): string => {
  const colors = getAnalyticsSeriesColors(mode, variant);
  if (!colors.length) return getAnalyticsChartColors(mode).primary;
  return colors[((index % colors.length) + colors.length) % colors.length];
};

export const analyticsSemanticColors = {
  positive: {
    light: "#16a34a",
    dark: "#4ade80",
  },
  caution: {
    light: "#d97706",
    dark: "#fbbf24",
  },
  negative: {
    light: "#dc2626",
    dark: "#f87171",
  },
  neutral: {
    light: "#64748b",
    dark: "#94a3b8",
  },
} as const;

export const getAnalyticsDeltaColor = (
  value: number,
  mode: ThemeMode = "light"
): string => {
  if (value > 0) return analyticsSemanticColors.positive[mode];
  if (value < 0) return analyticsSemanticColors.negative[mode];
  return analyticsSemanticColors.neutral[mode];
};

export const getAnalyticsComparisonColor = (
  status: "up" | "down" | "flat",
  mode: ThemeMode = "light"
): string => {
  if (status === "up") return analyticsSemanticColors.positive[mode];
  if (status === "down") return analyticsSemanticColors.negative[mode];
  return analyticsSemanticColors.neutral[mode];
};

export const analyticsChartTokens = {
  strokeWidth: {
    sm: 2,
    md: 3,
    lg: 4,
  },
  barRadius: 10,
  areaOpacity: 1,
  activeDotRadius: 5,
  gridDashArray: "4 4",
} as const;

export default getAnalyticsChartColors;