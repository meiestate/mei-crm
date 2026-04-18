import { useMemo } from "react";

type Tone = "default" | "primary" | "success" | "warning" | "danger" | "info";
type TrendDirection = "up" | "down" | "neutral";

type ToneStyles = {
  accent: string;
  softBg: string;
  border: string;
  badgeBg: string;
  badgeText: string;
};

export type RevenueBreakdownItem = {
  label: string;
  value: number;
  percent: number;
  color?: string;
};

export type RevenueCardProps = {
  title?: string;
  subtitle?: string;
  revenue?: number;
  targetRevenue?: number;
  bookedRevenue?: number;
  collectedRevenue?: number;
  forecastRevenue?: number;
  deltaPercent?: number;
  trend?: TrendDirection;
  tone?: Tone;
  currency?: string;
  locale?: string;
  lastUpdated?: string;
  loading?: boolean;
  breakdown?: RevenueBreakdownItem[];
  onClick?: () => void;
};

function getToneStyles(tone: Tone): ToneStyles {
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

function getTrendStyles(trend: TrendDirection) {
  if (trend === "up") {
    return {
      arrow: "↗",
      text: "#047857",
      bg: "#ecfdf3",
      border: "#a7f3d0",
      prefix: "+",
      label: "Growing",
    };
  }

  if (trend === "down") {
    return {
      arrow: "↘",
      text: "#b91c1c",
      bg: "#fef2f2",
      border: "#fecaca",
      prefix: "-",
      label: "Declining",
    };
  }

  return {
    arrow: "→",
    text: "#4b5563",
    bg: "#f3f4f6",
    border: "#d1d5db",
    prefix: "",
    label: "Stable",
  };
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(value, 100));
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "0%";
  return `${Math.abs(value).toFixed(1)}%`;
}

function formatCurrency(
  value: number,
  locale: string,
  currency: string
): string {
  if (!Number.isFinite(value)) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(0);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function getTargetProgress(revenue: number, targetRevenue: number): number {
  if (!Number.isFinite(targetRevenue) || targetRevenue <= 0) return 0;
  return clampPercent((revenue / targetRevenue) * 100);
}

const DEFAULT_BREAKDOWN: RevenueBreakdownItem[] = [
  { label: "Apartments", value: 4200000, percent: 42, color: "#2563eb" },
  { label: "Plots", value: 2800000, percent: 28, color: "#10b981" },
  { label: "Villas", value: 1900000, percent: 19, color: "#7c3aed" },
  { label: "Commercial", value: 1100000, percent: 11, color: "#f59e0b" },
];

export default function RevenueCard({
  title = "Revenue",
  subtitle = "Total realized and forecast revenue across active business operations",
  revenue = 10000000,
  targetRevenue = 12500000,
  bookedRevenue = 7200000,
  collectedRevenue = 5100000,
  forecastRevenue = 11800000,
  deltaPercent = 14.2,
  trend = "up",
  tone = "success",
  currency = "INR",
  locale = "en-IN",
  lastUpdated = "Updated 3 mins ago",
  loading = false,
  breakdown = DEFAULT_BREAKDOWN,
  onClick,
}: RevenueCardProps) {
  const toneStyles = useMemo(() => getToneStyles(tone), [tone]);
  const trendStyles = useMemo(() => getTrendStyles(trend), [trend]);

  const progress = useMemo(
    () => getTargetProgress(revenue, targetRevenue),
    [revenue, targetRevenue]
  );

  const gapToTarget = useMemo(
    () => Math.max(targetRevenue - revenue, 0),
    [targetRevenue, revenue]
  );

  const collectionRate = useMemo(() => {
    if (!bookedRevenue) return 0;
    return clampPercent((collectedRevenue / bookedRevenue) * 100);
  }, [bookedRevenue, collectedRevenue]);

  const revenueHealthLabel = revenue >= targetRevenue ? "Ahead of target" : "Tracking";

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
            width: 150,
            height: 18,
            borderRadius: 8,
            background: "#e5e7eb",
            marginBottom: 10,
          }}
        />
        <div
          style={{
            width: "70%",
            height: 12,
            borderRadius: 8,
            background: "#f3f4f6",
            marginBottom: 16,
          }}
        />
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
            width: 120,
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
            marginBottom: 14,
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
        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              style={{
                height: 48,
                borderRadius: 14,
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
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 14,
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
          💰
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
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
          }}
        >
          {formatCurrency(revenue, locale, currency)}
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
            {trend === "neutral"
              ? trendStyles.label
              : `${trendStyles.prefix}${formatPercent(deltaPercent)} ${trendStyles.label}`}
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
          Target: {formatCurrency(targetRevenue, locale, currency)}
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
          {progress.toFixed(0)}% target hit
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
          marginBottom: 16,
        }}
      >
        <MetricTile
          label="Booked"
          value={formatCurrency(bookedRevenue, locale, currency)}
          tone={toneStyles}
        />
        <MetricTile
          label="Collected"
          value={formatCurrency(collectedRevenue, locale, currency)}
          tone={toneStyles}
        />
        <MetricTile
          label="Gap to Target"
          value={formatCurrency(gapToTarget, locale, currency)}
          tone={toneStyles}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <MiniStatPill
          label="Forecast Revenue"
          value={formatCurrency(forecastRevenue, locale, currency)}
          tone={toneStyles}
        />
        <MiniStatPill
          label="Collection Rate"
          value={`${collectionRate.toFixed(0)}%`}
          tone={toneStyles}
        />
      </div>

      <div
        style={{
          borderRadius: 18,
          border: `1px solid ${toneStyles.border}`,
          background: toneStyles.softBg,
          padding: 14,
          boxSizing: "border-box",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: "#111827",
            marginBottom: 12,
          }}
        >
          Revenue mix breakdown
        </div>

        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          {breakdown.map((item) => (
            <div
              key={`${item.label}-${item.value}`}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: 10,
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#374151",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </span>

                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: toneStyles.accent,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatCurrency(item.value, locale, currency)}
                  </span>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: 8,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.85)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${clampPercent(item.percent)}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: item.color ?? toneStyles.accent,
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  minWidth: 48,
                  textAlign: "right",
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#4b5563",
                }}
              >
                {clampPercent(item.percent).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
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
          Revenue health: {revenueHealthLabel}
        </span>
      </div>
    </section>
  );
}

type MetricTileProps = {
  label: string;
  value: string;
  tone: ToneStyles;
};

function MetricTile({ label, value, tone }: MetricTileProps) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 12,
        background: tone.softBg,
        border: `1px solid ${tone.border}`,
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
        {label}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: tone.accent,
          lineHeight: 1.2,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

type MiniStatPillProps = {
  label: string;
  value: string;
  tone: ToneStyles;
};

function MiniStatPill({ label, value, tone }: MiniStatPillProps) {
  return (
    <div
      style={{
        minHeight: 54,
        borderRadius: 16,
        padding: "10px 12px",
        background: "#ffffff",
        border: `1px solid ${tone.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#6b7280",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: tone.accent,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  );
}