// src/features/dashboard/components/KPIStatCard.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { DashboardKpi } from "../api/dashboardApi";

type KPIStatCardProps = {
  item: DashboardKpi;
  mode?: ThemeMode;
  loading?: boolean;
  onClick?: (item: DashboardKpi) => void;
};

function formatValue(item: DashboardKpi): string {
  const value = Number.isFinite(item.value) ? item.value : 0;

  const formatted =
    item.id === "pipelineValue"
      ? new Intl.NumberFormat("en-IN", {
          maximumFractionDigits: 0,
        }).format(value)
      : new Intl.NumberFormat("en-IN", {
          maximumFractionDigits: 0,
        }).format(value);

  return `${item.prefix ?? ""}${formatted}${item.suffix ?? ""}`;
}

function getTrendMeta(trend?: DashboardKpi["trend"]) {
  if (trend === "up") {
    return {
      arrow: "↗",
      color: "#16a34a",
      bg: "rgba(34, 197, 94, 0.12)",
      border: "rgba(34, 197, 94, 0.22)",
      label: "Up",
    };
  }

  if (trend === "down") {
    return {
      arrow: "↘",
      color: "#dc2626",
      bg: "rgba(239, 68, 68, 0.12)",
      border: "rgba(239, 68, 68, 0.22)",
      label: "Down",
    };
  }

  return {
    arrow: "→",
    color: "#64748b",
    bg: "rgba(100, 116, 139, 0.12)",
    border: "rgba(100, 116, 139, 0.22)",
    label: "Stable",
  };
}

function getKpiMeta(id: DashboardKpi["id"]) {
  switch (id) {
    case "totalLeads":
      return {
        icon: "🎯",
        accent: "#3b82f6",
        glow: "rgba(59, 130, 246, 0.18)",
      };

    case "hotLeads":
      return {
        icon: "🔥",
        accent: "#ef4444",
        glow: "rgba(239, 68, 68, 0.18)",
      };

    case "totalContacts":
      return {
        icon: "👥",
        accent: "#8b5cf6",
        glow: "rgba(139, 92, 246, 0.18)",
      };

    case "openDeals":
      return {
        icon: "📂",
        accent: "#0ea5e9",
        glow: "rgba(14, 165, 233, 0.18)",
      };

    case "wonDeals":
      return {
        icon: "🏆",
        accent: "#10b981",
        glow: "rgba(16, 185, 129, 0.18)",
      };

    case "pipelineValue":
      return {
        icon: "💰",
        accent: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.18)",
      };

    case "pendingTasks":
      return {
        icon: "📝",
        accent: "#f97316",
        glow: "rgba(249, 115, 22, 0.18)",
      };

    case "todayFollowUps":
      return {
        icon: "📞",
        accent: "#6366f1",
        glow: "rgba(99, 102, 241, 0.18)",
      };

    case "overdueFollowUps":
      return {
        icon: "⏰",
        accent: "#dc2626",
        glow: "rgba(220, 38, 38, 0.18)",
      };

    default:
      return {
        icon: "📊",
        accent: "#64748b",
        glow: "rgba(100, 116, 139, 0.18)",
      };
  }
}

export default function KPIStatCard({
  item,
  mode = "light",
  loading = false,
  onClick,
}: KPIStatCardProps) {
  const theme = getTheme(mode);
  const meta = getKpiMeta(item.id);
  const trendMeta = getTrendMeta(item.trend);

  if (loading) {
    return (
      <div
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 20,
          padding: 18,
          boxShadow:
            mode === "dark"
              ? "0 10px 30px rgba(0,0,0,0.24)"
              : "0 10px 30px rgba(15, 23, 42, 0.06)",
          minHeight: 150,
          display: "grid",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: theme.border,
            }}
          />
          <div
            style={{
              width: 58,
              height: 24,
              borderRadius: 999,
              background: theme.borderSoft,
            }}
          />
        </div>

        <div
          style={{
            height: 12,
            width: "48%",
            borderRadius: 999,
            background: theme.border,
          }}
        />

        <div
          style={{
            height: 24,
            width: "72%",
            borderRadius: 999,
            background: theme.borderSoft,
          }}
        />

        <div
          style={{
            height: 10,
            width: "42%",
            borderRadius: 999,
            background: theme.borderSoft,
          }}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      style={{
        width: "100%",
        textAlign: "left",
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 18,
        boxShadow:
          mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.24)"
            : "0 10px 30px rgba(15, 23, 42, 0.06)",
        minHeight: 150,
        cursor: onClick ? "pointer" : "default",
        display: "grid",
        gap: 14,
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
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background:
              mode === "dark"
                ? `linear-gradient(135deg, ${meta.glow}, rgba(255,255,255,0.02))`
                : `linear-gradient(135deg, ${meta.glow}, rgba(255,255,255,0.7))`,
            border: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            boxShadow: `inset 0 0 0 1px ${meta.glow}`,
          }}
        >
          {meta.icon}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            borderRadius: 999,
            padding: "6px 10px",
            background: trendMeta.bg,
            border: `1px solid ${trendMeta.border}`,
            color: trendMeta.color,
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          <span>{trendMeta.arrow}</span>
          <span>{trendMeta.label}</span>
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: theme.subText,
            marginBottom: 8,
            lineHeight: 1.4,
          }}
        >
          {item.label}
        </div>

        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: theme.text,
            lineHeight: 1.15,
            wordBreak: "break-word",
          }}
        >
          {formatValue(item)}
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
            fontSize: 12,
            color: theme.subText,
            fontWeight: 500,
          }}
        >
          {typeof item.change === "number"
            ? `${item.change > 0 ? "+" : ""}${item.change}% vs previous period`
            : "Live dashboard snapshot"}
        </div>

        <div
          style={{
            width: 56,
            height: 6,
            borderRadius: 999,
            background: theme.border,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width:
                item.trend === "up"
                  ? "100%"
                  : item.trend === "down"
                  ? "45%"
                  : "70%",
              height: "100%",
              borderRadius: 999,
              background: meta.accent,
            }}
          />
        </div>
      </div>
    </button>
  );
}