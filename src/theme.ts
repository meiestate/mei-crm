export type ThemeMode = "light" | "dark";

export type TypographyStyle = {
  fontSize: string;
  fontWeight: number;
  lineHeight: number | string;
  letterSpacing?: string;
};

export type ThemeTypography = {
  fontFamily: string;
  pageTitle: TypographyStyle;
  sectionTitle: TypographyStyle;
  cardTitle: TypographyStyle;
  statNumber: TypographyStyle;
  bodyLg: TypographyStyle;
  bodyMd: TypographyStyle;
  bodySm: TypographyStyle;
  tableHeader: TypographyStyle;
  label: TypographyStyle;
  input: TypographyStyle;
  button: TypographyStyle;
  badge: TypographyStyle;
  caption: TypographyStyle;
};

export type ThemeRadius = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  pill: string;
};

export type ThemeSpacing = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
};

export type ThemeLayout = {
  sidebarWidth: string;
  topbarHeight: string;
  contentMaxWidth: string;
};

export type AppTheme = {
  pageBg: string;
  sectionBg: string;
  cardBg: string;
  cardBgSoft: string;

  text: string;
  subText: string;
  mutedText: string;
  inverseText: string;

  border: string;
  borderSoft: string;
  borderStrong: string;

  primary: string;
  primaryHover: string;
  primaryActive: string;

  sidebarBg: string;
  topbarBg: string;
  inputBg: string;

  navText: string;
  navActiveBg: string;
  navActiveText: string;

  tableHeadBg: string;
  rowBg: string;
  rowHover: string;

  success: string;
  warning: string;
  danger: string;
  info: string;
  premium: string;

  successBg: string;
  warningBg: string;
  dangerBg: string;
  infoBg: string;
  premiumBg: string;

  overlay: string;
  divider: string;

  shadowSoft: string;
  shadowCard: string;

  typography: ThemeTypography;
  radius: ThemeRadius;
  spacing: ThemeSpacing;
  layout: ThemeLayout;
};

const typography: ThemeTypography = {
  fontFamily: `"Inter", "Poppins", "Segoe UI", Roboto, Helvetica, Arial, sans-serif`,

  pageTitle: {
    fontSize: "28px",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },

  sectionTitle: {
    fontSize: "22px",
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: 1.35,
  },

  statNumber: {
    fontSize: "32px",
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
  },

  bodyLg: {
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: 1.6,
  },

  bodyMd: {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: 1.5,
  },

  bodySm: {
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: 1.4,
  },

  tableHeader: {
    fontSize: "13px",
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: "0.01em",
  },

  label: {
    fontSize: "13px",
    fontWeight: 600,
    lineHeight: 1.3,
  },

  input: {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: 1.4,
  },

  button: {
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: 1.2,
  },

  badge: {
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: "0.01em",
  },

  caption: {
    fontSize: "11px",
    fontWeight: 500,
    lineHeight: 1.3,
    letterSpacing: "0.02em",
  },
};

const radius: ThemeRadius = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  pill: "999px",
};

const spacing: ThemeSpacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
};

const layout: ThemeLayout = {
  sidebarWidth: "260px",
  topbarHeight: "72px",
  contentMaxWidth: "1600px",
};

export const theme: Record<ThemeMode, AppTheme> = {
  light: {
    pageBg: "#F3F4F6",
    sectionBg: "#F9FAFB",
    cardBg: "#FFFFFF",
    cardBgSoft: "#F9FAFB",

    text: "#111827",
    subText: "#6B7280",
    mutedText: "#9CA3AF",
    inverseText: "#FFFFFF",

    border: "#E5E7EB",
    borderSoft: "#EEF2F7",
    borderStrong: "#D1D5DB",

    primary: "#2563EB",
    primaryHover: "#1D4ED8",
    primaryActive: "#1E40AF",

    sidebarBg: "#FFFFFF",
    topbarBg: "#FFFFFF",
    inputBg: "#FFFFFF",

    navText: "#374151",
    navActiveBg: "#111827",
    navActiveText: "#FFFFFF",

    tableHeadBg: "#F9FAFB",
    rowBg: "#FFFFFF",
    rowHover: "#F3F4F6",

    success: "#16A34A",
    warning: "#F59E0B",
    danger: "#DC2626",
    info: "#2563EB",
    premium: "#7C3AED",

    successBg: "rgba(22, 163, 74, 0.12)",
    warningBg: "rgba(245, 158, 11, 0.14)",
    dangerBg: "rgba(220, 38, 38, 0.12)",
    infoBg: "rgba(37, 99, 235, 0.12)",
    premiumBg: "rgba(124, 58, 237, 0.12)",

    overlay: "rgba(15, 23, 42, 0.35)",
    divider: "#E5E7EB",

    shadowSoft: "0 4px 12px rgba(0, 0, 0, 0.06)",
    shadowCard: "0 10px 30px rgba(0, 0, 0, 0.08)",

    typography,
    radius,
    spacing,
    layout,
  },

  dark: {
    pageBg: "#020617",
    sectionBg: "#0F172A",
    cardBg: "#111827",
    cardBgSoft: "#1E293B",

    text: "#F8FAFC",
    subText: "#94A3B8",
    mutedText: "#64748B",
    inverseText: "#111827",

    border: "#334155",
    borderSoft: "#263244",
    borderStrong: "#475569",

    primary: "#2563EB",
    primaryHover: "#1D4ED8",
    primaryActive: "#1E40AF",

    sidebarBg: "#0F172A",
    topbarBg: "#111827",
    inputBg: "#0F172A",

    navText: "#CBD5E1",
    navActiveBg: "#2563EB",
    navActiveText: "#FFFFFF",

    tableHeadBg: "#1E293B",
    rowBg: "#111827",
    rowHover: "#172033",

    success: "#16A34A",
    warning: "#F59E0B",
    danger: "#DC2626",
    info: "#2563EB",
    premium: "#7C3AED",

    successBg: "rgba(22, 163, 74, 0.16)",
    warningBg: "rgba(245, 158, 11, 0.16)",
    dangerBg: "rgba(220, 38, 38, 0.16)",
    infoBg: "rgba(37, 99, 235, 0.16)",
    premiumBg: "rgba(124, 58, 237, 0.16)",

    overlay: "rgba(2, 6, 23, 0.6)",
    divider: "#334155",

    shadowSoft: "0 6px 16px rgba(0, 0, 0, 0.25)",
    shadowCard: "0 10px 30px rgba(0, 0, 0, 0.35)",

    typography,
    radius,
    spacing,
    layout,
  },
};

export function getTheme(mode: ThemeMode): AppTheme {
  return theme[mode];
}

export function getStatusBadgeColors(mode: ThemeMode, status: string) {
  const currentTheme = getTheme(mode);

  switch (status.toLowerCase()) {
    case "new":
      return {
        color: currentTheme.info,
        background: currentTheme.infoBg,
      };
    case "contacted":
      return {
        color: currentTheme.primary,
        background: currentTheme.infoBg,
      };
    case "qualified":
      return {
        color: currentTheme.premium,
        background: currentTheme.premiumBg,
      };
    case "won":
      return {
        color: currentTheme.success,
        background: currentTheme.successBg,
      };
    case "lost":
      return {
        color: currentTheme.danger,
        background: currentTheme.dangerBg,
      };
    default:
      return {
        color: currentTheme.subText,
        background: currentTheme.cardBgSoft,
      };
  }
}