import React from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type KPITrendType = "up" | "down" | "neutral";

type KPIStatCardProps = {
  mode: ThemeMode;
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    label: string;
    type?: KPITrendType;
  };
  accent?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
  onClick?: () => void;
  loading?: boolean;
};

export default function KPIStatCard({
  mode,
  title,
  value,
  subtitle,
  icon,
  trend,
  accent = "primary",
  onClick,
  loading = false,
}: KPIStatCardProps) {
  const theme = getTheme(mode);
  const palette = getAccentPalette(mode, accent);

  return (
    <section
      onClick={onClick}
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 22,
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        boxShadow:
          mode === "dark"
            ? "0 10px 24px rgba(0,0,0,0.22)"
            : "0 10px 24px rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          height: 4,
          background: palette.text,
        }}
      />

      <div
        style={{
          padding: 18,
          display: "grid",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: theme.subText,
                letterSpacing: 0.2,
                marginBottom: 6,
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: theme.text,
                lineHeight: 1.05,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {loading ? "—" : value}
            </div>
          </div>

          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: palette.bg,
              border: `1px solid ${palette.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: palette.text,
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {icon ?? "📊"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: theme.subText,
              minHeight: 20,
            }}
          >
            {loading ? "Loading insight..." : subtitle || "No additional insight"}
          </div>

          {trend ? <TrendBadge mode={mode} trend={trend} /> : null}
        </div>
      </div>
    </section>
  );
}

function TrendBadge({
  mode,
  trend,
}: {
  mode: ThemeMode;
  trend: {
    label: string;
    type?: KPITrendType;
  };
}) {
  const palette = getTrendPalette(mode, trend.type || "neutral");

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 10px",
        borderRadius: 999,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        color: palette.text,
        fontSize: 12,
        fontWeight: 800,
        whiteSpace: "nowrap",
      }}
    >
      <span>{getTrendIcon(trend.type || "neutral")}</span>
      <span>{trend.label}</span>
    </span>
  );
}

function getTrendIcon(type: KPITrendType) {
  switch (type) {
    case "up":
      return "↗";
    case "down":
      return "↘";
    case "neutral":
    default:
      return "•";
  }
}

function getTrendPalette(mode: ThemeMode, type: KPITrendType) {
  const isDark = mode === "dark";

  switch (type) {
    case "up":
      return {
        bg: isDark ? "rgba(34,197,94,0.14)" : "rgba(34,197,94,0.10)",
        border: isDark ? "rgba(34,197,94,0.28)" : "rgba(34,197,94,0.22)",
        text: "#16a34a",
      };
    case "down":
      return {
        bg: isDark ? "rgba(239,68,68,0.14)" : "rgba(239,68,68,0.10)",
        border: isDark ? "rgba(239,68,68,0.28)" : "rgba(239,68,68,0.22)",
        text: "#dc2626",
      };
    case "neutral":
    default:
      return {
        bg: isDark ? "rgba(148,163,184,0.14)" : "rgba(148,163,184,0.10)",
        border: isDark ? "rgba(148,163,184,0.28)" : "rgba(148,163,184,0.22)",
        text: "#475569",
      };
  }
}

function getAccentPalette(
  mode: ThemeMode,
  accent: "primary" | "success" | "warning" | "danger" | "info" | "neutral"
) {
  const isDark = mode === "dark";

  switch (accent) {
    case "success":
      return {
        bg: isDark ? "rgba(34,197,94,0.14)" : "rgba(34,197,94,0.10)",
        border: isDark ? "rgba(34,197,94,0.28)" : "rgba(34,197,94,0.22)",
        text: "#16a34a",
      };
    case "warning":
      return {
        bg: isDark ? "rgba(245,158,11,0.14)" : "rgba(245,158,11,0.10)",
        border: isDark ? "rgba(245,158,11,0.28)" : "rgba(245,158,11,0.22)",
        text: "#d97706",
      };
    case "danger":
      return {
        bg: isDark ? "rgba(239,68,68,0.14)" : "rgba(239,68,68,0.10)",
        border: isDark ? "rgba(239,68,68,0.28)" : "rgba(239,68,68,0.22)",
        text: "#dc2626",
      };
    case "info":
      return {
        bg: isDark ? "rgba(59,130,246,0.14)" : "rgba(59,130,246,0.10)",
        border: isDark ? "rgba(59,130,246,0.28)" : "rgba(59,130,246,0.22)",
        text: "#2563eb",
      };
    case "neutral":
      return {
        bg: isDark ? "rgba(148,163,184,0.14)" : "rgba(148,163,184,0.10)",
        border: isDark ? "rgba(148,163,184,0.28)" : "rgba(148,163,184,0.22)",
        text: "#475569",
      };
    case "primary":
    default:
      return {
        bg: isDark ? "rgba(99,102,241,0.14)" : "rgba(99,102,241,0.10)",
        border: isDark ? "rgba(99,102,241,0.28)" : "rgba(99,102,241,0.22)",
        text: "#4f46e5",
      };
  }
}