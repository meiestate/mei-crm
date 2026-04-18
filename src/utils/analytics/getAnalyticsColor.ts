// src/utils/getAnalyticsColor.ts

export type AnalyticsThemeMode = "light" | "dark";

export type AnalyticsColorIntent =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "muted"
  | "positive"
  | "negative"
  | "trendUp"
  | "trendDown"
  | "trendFlat"
  | "highRisk"
  | "mediumRisk"
  | "lowRisk"
  | "hot"
  | "warm"
  | "cool";

export type AnalyticsStageKey =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost"
  | "stuck"
  | "followUp"
  | "closed";

export type AnalyticsChannelKey =
  | "metaAds"
  | "googleAds"
  | "organic"
  | "referral"
  | "whatsapp"
  | "email"
  | "call"
  | "website"
  | "walkIn"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "youtube"
  | "other";

export type AnalyticsColorKey =
  | AnalyticsColorIntent
  | AnalyticsStageKey
  | AnalyticsChannelKey
  | string;

export interface AnalyticsColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  neutral: string;
  muted: string;
  positive: string;
  negative: string;
  trendUp: string;
  trendDown: string;
  trendFlat: string;
  highRisk: string;
  mediumRisk: string;
  lowRisk: string;
  hot: string;
  warm: string;
  cool: string;
  stages: Record<AnalyticsStageKey, string>;
  channels: Record<AnalyticsChannelKey, string>;
  fallback: string;
}

export interface GetAnalyticsColorOptions {
  mode?: AnalyticsThemeMode;
  fallback?: string;
  opacity?: number;
}

const lightPalette: AnalyticsColorPalette = {
  primary: "#2563EB",
  secondary: "#7C3AED",
  accent: "#0EA5E9",
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
  info: "#0284C7",
  neutral: "#64748B",
  muted: "#94A3B8",
  positive: "#15803D",
  negative: "#B91C1C",
  trendUp: "#16A34A",
  trendDown: "#DC2626",
  trendFlat: "#6B7280",
  highRisk: "#DC2626",
  mediumRisk: "#F59E0B",
  lowRisk: "#22C55E",
  hot: "#EA580C",
  warm: "#F59E0B",
  cool: "#0EA5E9",
  stages: {
    new: "#3B82F6",
    contacted: "#6366F1",
    qualified: "#8B5CF6",
    proposal: "#F59E0B",
    negotiation: "#F97316",
    won: "#16A34A",
    lost: "#DC2626",
    stuck: "#6B7280",
    followUp: "#0EA5E9",
    closed: "#1D4ED8",
  },
  channels: {
    metaAds: "#2563EB",
    googleAds: "#EA4335",
    organic: "#16A34A",
    referral: "#7C3AED",
    whatsapp: "#22C55E",
    email: "#0284C7",
    call: "#F97316",
    website: "#0F766E",
    walkIn: "#A16207",
    linkedin: "#0A66C2",
    instagram: "#C026D3",
    facebook: "#1877F2",
    youtube: "#DC2626",
    other: "#64748B",
  },
  fallback: "#2563EB",
};

const darkPalette: AnalyticsColorPalette = {
  primary: "#60A5FA",
  secondary: "#A78BFA",
  accent: "#38BDF8",
  success: "#4ADE80",
  warning: "#FBBF24",
  danger: "#F87171",
  info: "#38BDF8",
  neutral: "#94A3B8",
  muted: "#64748B",
  positive: "#22C55E",
  negative: "#F87171",
  trendUp: "#4ADE80",
  trendDown: "#F87171",
  trendFlat: "#9CA3AF",
  highRisk: "#F87171",
  mediumRisk: "#FBBF24",
  lowRisk: "#4ADE80",
  hot: "#FB923C",
  warm: "#FBBF24",
  cool: "#38BDF8",
  stages: {
    new: "#60A5FA",
    contacted: "#818CF8",
    qualified: "#A78BFA",
    proposal: "#FBBF24",
    negotiation: "#FB923C",
    won: "#4ADE80",
    lost: "#F87171",
    stuck: "#9CA3AF",
    followUp: "#38BDF8",
    closed: "#3B82F6",
  },
  channels: {
    metaAds: "#60A5FA",
    googleAds: "#F87171",
    organic: "#4ADE80",
    referral: "#A78BFA",
    whatsapp: "#22C55E",
    email: "#38BDF8",
    call: "#FB923C",
    website: "#2DD4BF",
    walkIn: "#FACC15",
    linkedin: "#60A5FA",
    instagram: "#E879F9",
    facebook: "#3B82F6",
    youtube: "#F87171",
    other: "#94A3B8",
  },
  fallback: "#60A5FA",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function hexToRgba(hex: string, opacity = 1): string {
  const normalized = hex.replace("#", "").trim();

  if (![3, 6].includes(normalized.length)) {
    return hex;
  }

  const safeOpacity = clamp(opacity, 0, 1);

  const fullHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  const r = Number.parseInt(fullHex.slice(0, 2), 16);
  const g = Number.parseInt(fullHex.slice(2, 4), 16);
  const b = Number.parseInt(fullHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${safeOpacity})`;
}

function getPalette(mode: AnalyticsThemeMode = "light"): AnalyticsColorPalette {
  return mode === "dark" ? darkPalette : lightPalette;
}

function normalizeKey(key: string): string {
  return key.trim().replace(/\s+/gu, "").toLowerCase();
}

const intentKeyMap: Record<string, keyof AnalyticsColorPalette> = {
  primary: "primary",
  secondary: "secondary",
  accent: "accent",
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "info",
  neutral: "neutral",
  muted: "muted",
  positive: "positive",
  negative: "negative",
  trendup: "trendUp",
  trenddown: "trendDown",
  trendflat: "trendFlat",
  highrisk: "highRisk",
  mediumrisk: "mediumRisk",
  lowrisk: "lowRisk",
  hot: "hot",
  warm: "warm",
  cool: "cool",
};

const stageAliases: Record<string, AnalyticsStageKey> = {
  new: "new",
  contacted: "contacted",
  qualified: "qualified",
  proposal: "proposal",
  negotiation: "negotiation",
  won: "won",
  lost: "lost",
  stuck: "stuck",
  followup: "followUp",
  closed: "closed",
};

const channelAliases: Record<string, AnalyticsChannelKey> = {
  metaads: "metaAds",
  facebookads: "metaAds",
  googleads: "googleAds",
  organic: "organic",
  referral: "referral",
  whatsapp: "whatsapp",
  email: "email",
  call: "call",
  phone: "call",
  website: "website",
  walkin: "walkIn",
  linkedin: "linkedin",
  instagram: "instagram",
  facebook: "facebook",
  youtube: "youtube",
  other: "other",
};

export function getAnalyticsColor(
  key: AnalyticsColorKey,
  options: GetAnalyticsColorOptions = {},
): string {
  const { mode = "light", fallback, opacity } = options;
  const palette = getPalette(mode);
  const normalizedKey = normalizeKey(String(key));

  let resolvedColor: string | undefined;

  const intentMatch = intentKeyMap[normalizedKey];
  if (intentMatch) {
    resolvedColor = palette[intentMatch] as string;
  }

  if (!resolvedColor) {
    const stageMatch = stageAliases[normalizedKey];
    if (stageMatch) {
      resolvedColor = palette.stages[stageMatch];
    }
  }

  if (!resolvedColor) {
    const channelMatch = channelAliases[normalizedKey];
    if (channelMatch) {
      resolvedColor = palette.channels[channelMatch];
    }
  }

  if (!resolvedColor) {
    resolvedColor = fallback ?? palette.fallback;
  }

  if (typeof opacity === "number") {
    return hexToRgba(resolvedColor, opacity);
  }

  return resolvedColor;
}

export function getAnalyticsPalette(mode: AnalyticsThemeMode = "light"): AnalyticsColorPalette {
  return getPalette(mode);
}

export function getStageColor(
  stage: AnalyticsStageKey | string,
  options?: GetAnalyticsColorOptions,
): string {
  return getAnalyticsColor(stage, options);
}

export function getChannelColor(
  channel: AnalyticsChannelKey | string,
  options?: GetAnalyticsColorOptions,
): string {
  return getAnalyticsColor(channel, options);
}

export function getRiskColor(
  risk: "high" | "medium" | "low" | string,
  options?: GetAnalyticsColorOptions,
): string {
  const normalized = normalizeKey(risk);

  if (normalized === "high") {
    return getAnalyticsColor("highRisk", options);
  }

  if (normalized === "medium") {
    return getAnalyticsColor("mediumRisk", options);
  }

  if (normalized === "low") {
    return getAnalyticsColor("lowRisk", options);
  }

  return getAnalyticsColor("neutral", options);
}

export function getTrendColor(
  value: number,
  options?: GetAnalyticsColorOptions & {
    neutralThreshold?: number;
  },
): string {
  const neutralThreshold = options?.neutralThreshold ?? 0;

  if (value > neutralThreshold) {
    return getAnalyticsColor("trendUp", options);
  }

  if (value < -neutralThreshold) {
    return getAnalyticsColor("trendDown", options);
  }

  return getAnalyticsColor("trendFlat", options);
}

export default getAnalyticsColor;