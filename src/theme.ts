export type ThemeMode = "light" | "dark";

export const theme = {
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

    shadowSoft: "0 4px 12px rgba(0, 0, 0, 0.06)",
    shadowCard: "0 10px 30px rgba(0, 0, 0, 0.08)",
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

    shadowSoft: "0 6px 16px rgba(0, 0, 0, 0.25)",
    shadowCard: "0 10px 30px rgba(0, 0, 0, 0.35)",
  },
};

export function getTheme(mode: ThemeMode) {
  return theme[mode];
}