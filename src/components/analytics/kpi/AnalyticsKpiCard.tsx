import { useMemo } from "react";

type TrendDirection = "up" | "down" | "neutral";
type Tone = "default" | "primary" | "success" | "warning" | "danger" | "info";

export type AnalyticsKpiFooterItem = {
  label: string;
  value: string;
};

export type AnalyticsKpiCardProps = {
  title?: string;
  subtitle?: string;
  value?: string;
  delta?: number;
  deltaLabel?: string;
  trend?: TrendDirection;
  tone?: Tone;
  icon?: React.ReactNode;
  targetValue?: number;
  currentValue?: number;
  footerItems?: AnalyticsKpiFooterItem[];
  lastUpdated?: string;
  loading?: boolean;
  onClick?: () => void;
};

function getToneStyles(tone: Tone) {
  switch (tone) {
    case "primary":
      return {
        accent: "#111827",
        softBg: "#f3f4f6",
        border: "#e5e7eb",
        badgeBg: "#111827",
        badgeText: "#ffffff",
      };
    case "success":
      return {
        accent: "#047857",
        softBg: "#ecfdf3",
        border: "#a7f3d0",
        badgeBg: "#047857",
        badgeText: "#ffffff",
      };
    case "warning":
      return {
        accent: "#c2410c",
        softBg: "#fff7ed",
        border: "#fdba74",
        badgeBg: "#c2410c",
        badgeText: "#ffffff",
      };
    case "danger":
      return {
        accent: "#b91c1c",
        softBg: "#fef2f2",
        border: "#fecaca",
        badgeBg: "#b91c1c",
        badgeText: "#ffffff",
      };
    case "info":
      return {
        accent: "#1d4ed8",
        softBg: "#eff6ff",
        border: "#bfdbfe",
        badgeBg: "#1d4ed8",
        badgeText: "#ffffff",
      };
    default:
      return {
        accent: "#374151",
        softBg: "#f9fafb",
        border: "#e5e7eb",
        badgeBg: "#6b7280",
        badgeText: "#ffffff",
      };
  }
}

function getTrendPresentation(delta: number, trend: TrendDirection) {
  if (trend === "up" || delta > 0) {
    return {
      arrow: "↗",
      text: "#047857",
      bg: "#ecfdf3",
      border: "#a7f3d0",
      prefix: "+",
    };
  }

  if (trend === "down" || delta < 0) {
    return {
      arrow: "↘",
      text: "#b91c1c",
      bg: "#fef2f2",
      border: "#fecaca",
      prefix: "",
    };
  }

  return {
    arrow: "→",
    text: "#4b5563",
    bg: "#f3f4f6",
    border: "#d1d5db",
    prefix: "",
  };
}

function formatDelta(delta: number): string {
  if (!Number.isFinite(delta)) return "0%";
  return `${Math.abs(delta).toFixed(1)}%`;
}

function formatProgress(currentValue: number, targetValue: number): number {
  if (!targetValue || targetValue <= 0) return 0;
  return Math.max(0, Math.min((currentValue / targetValue) * 100, 100));
}

export default function AnalyticsKpiCard({
  title = "Revenue Growth",
  subtitle = "Month-over-month business performance snapshot",
  value = "₹18.4L",
  delta = 12.4,
  deltaLabel = "vs last month",
  trend = "up",
  tone = "primary",
  icon,
  targetValue = 100,
  currentValue = 74,
  footerItems = [
    { label: "Target", value: "₹25L" },
    { label: "Achieved", value: "₹18.4L" },
    { label: "Run Rate", value: "73.6%" },
  ],
  lastUpdated = "Updated 5 mins ago",
  loading = false,
  onClick,
}: AnalyticsKpiCardProps) {
  const toneStyles = useMemo(() => getToneStyles(tone), [tone]);
  const trendStyles = useMemo(
    () => getTrendPresentation(delta, trend),
    [delta, trend]
  );
  const progress = useMemo(
    () => formatProgress(currentValue, targetValue),
    [currentValue, targetValue]
  );

  if (loading) {
    return (
      <section
        style={{
          width: "100%",
          borderRadius: 22,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          padding: 18,
          boxSizing: "border-box",
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                width: 140,
                height: 18,
                borderRadius: 8,
                background: "#e5e7eb",
                marginBottom: 10,
              }}
            />
            <div
              style={{
                width: "75%",
                height: 12,
                borderRadius: 8,
                background: "#f3f4f6",
              }}
            />
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "#f3f4f6",
            }}
          />
        </div>

        <div
          style={{
            width: 160,
            height: 36,
            borderRadius: 10,
            background: "#e5e7eb",
            marginBottom: 14,
          }}
        />

        <div
          style={{
            width: 110,
            height: 28,
            borderRadius: 999,
            background: "#f3f4f6",
            marginBottom: 16,
          }}
        />

        <div
          style={{
            height: 10,
            width: "100%",
            borderRadius: 999,
            background: "#f3f4f6",
            marginBottom: 16,
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              style={{
                height: 62,
                borderRadius: 16,
                background: "#f9fafb",
                border: "1px solid #f3f4f6",
              }}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      style={{
        width: "100%",
        borderRadius: 22,
        border: `1px solid ${toneStyles.border}`,
        background: "#ffffff",
        padding: 18,
        boxSizing: "border-box",
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 180ms ease, box-shadow 180ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "#111827",
              marginBottom: 6,
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 13,
              lineHeight: 1.55,
              color: "#6b7280",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            width: 48,
            height: 48,
            minWidth: 48,
            borderRadius: 14,
            background: toneStyles.softBg,
            border: `1px solid ${toneStyles.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: toneStyles.accent,
            fontSize: 20,
            fontWeight: 800,
          }}
        >
          {icon ?? "◉"}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            wordBreak: "break-word",
          }}
        >
          {value}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            minHeight: 34,
            padding: "0 12px",
            borderRadius: 999,
            background: trendStyles.bg,
            border: `1px solid ${trendStyles.border}`,
            color: trendStyles.text,
            fontSize: 13,
            fontWeight: 800,
            whiteSpace: "nowrap",
          }}
        >
          <span>{trendStyles.arrow}</span>
          <span>
            {trendStyles.prefix}
            {formatDelta(delta)}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "#6b7280",
            fontWeight: 700,
          }}
        >
          {deltaLabel}
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 28,
            padding: "0 10px",
            borderRadius: 999,
            background: toneStyles.badgeBg,
            color: toneStyles.badgeText,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          {progress.toFixed(0)}% to target
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: 10,
          borderRadius: 999,
          background: "#e5e7eb",
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: 999,
            background:
              tone === "success"
                ? "linear-gradient(90deg, #047857 0%, #10b981 100%)"
                : tone === "warning"
                ? "linear-gradient(90deg, #c2410c 0%, #fb923c 100%)"
                : tone === "danger"
                ? "linear-gradient(90deg, #b91c1c 0%, #ef4444 100%)"
                : tone === "info"
                ? "linear-gradient(90deg, #1d4ed8 0%, #60a5fa 100%)"
                : "linear-gradient(90deg, #111827 0%, #4b5563 100%)",
            transition: "width 220ms ease",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
          marginBottom: 14,
        }}
      >
        {footerItems.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            style={{
              borderRadius: 16,
              padding: 12,
              background: toneStyles.softBg,
              border: `1px solid ${toneStyles.border}`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#6b7280",
                marginBottom: 6,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: toneStyles.accent,
                lineHeight: 1.2,
                wordBreak: "break-word",
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "#6b7280",
            fontWeight: 600,
          }}
        >
          {lastUpdated}
        </span>

        <span
          style={{
            fontSize: 12,
            color: "#374151",
            fontWeight: 700,
          }}
        >
          KPI trend:{" "}
          {trend === "up"
            ? "Improving"
            : trend === "down"
            ? "Declining"
            : "Stable"}
        </span>
      </div>
    </section>
  );
}