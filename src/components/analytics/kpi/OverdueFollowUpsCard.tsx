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

export type OverdueFollowUpBucket = {
  label: string;
  count: number;
  percent: number;
  color?: string;
};

export type OverdueFollowUpsCardProps = {
  title?: string;
  subtitle?: string;
  overdueCount?: number;
  targetMax?: number;
  completedToday?: number;
  criticalCount?: number;
  dueInNextHour?: number;
  deltaPercent?: number;
  trend?: TrendDirection;
  tone?: Tone;
  lastUpdated?: string;
  loading?: boolean;
  breakdown?: OverdueFollowUpBucket[];
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
  if (trend === "down") {
    return {
      arrow: "↘",
      text: "#047857",
      bg: "#ecfdf3",
      border: "#a7f3d0",
      prefix: "-",
      label: "Improving",
    };
  }

  if (trend === "up") {
    return {
      arrow: "↗",
      text: "#b91c1c",
      bg: "#fef2f2",
      border: "#fecaca",
      prefix: "+",
      label: "Rising",
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

function formatInteger(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "0%";
  return `${Math.abs(value).toFixed(1)}%`;
}

function getProgress(overdueCount: number, targetMax: number): number {
  if (!Number.isFinite(targetMax) || targetMax <= 0) return 0;
  const remainingHealth = ((targetMax - overdueCount) / targetMax) * 100;
  return clampPercent(remainingHealth);
}

const DEFAULT_BREAKDOWN: OverdueFollowUpBucket[] = [
  { label: "0 - 1 day overdue", count: 18, percent: 46, color: "#f59e0b" },
  { label: "2 - 3 days overdue", count: 11, percent: 28, color: "#fb923c" },
  { label: "4 - 7 days overdue", count: 7, percent: 18, color: "#ef4444" },
  { label: "7+ days overdue", count: 3, percent: 8, color: "#b91c1c" },
];

export default function OverdueFollowUpsCard({
  title = "Overdue Follow-Ups",
  subtitle = "Delayed follow-ups that need immediate attention from the sales team",
  overdueCount = 39,
  targetMax = 20,
  completedToday = 26,
  criticalCount = 10,
  dueInNextHour = 8,
  deltaPercent = 12.4,
  trend = "up",
  tone = "danger",
  lastUpdated = "Updated 2 mins ago",
  loading = false,
  breakdown = DEFAULT_BREAKDOWN,
  onClick,
}: OverdueFollowUpsCardProps) {
  const toneStyles = useMemo(() => getToneStyles(tone), [tone]);
  const trendStyles = useMemo(() => getTrendStyles(trend), [trend]);

  const healthProgress = useMemo(
    () => getProgress(overdueCount, targetMax),
    [overdueCount, targetMax]
  );

  const overTargetBy = useMemo(
    () => Math.max(overdueCount - targetMax, 0),
    [overdueCount, targetMax]
  );

  const statusLabel = overdueCount <= targetMax ? "Under control" : "Needs action";

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
            width: 180,
            height: 18,
            borderRadius: 8,
            background: "#e5e7eb",
            marginBottom: 10,
          }}
        />
        <div
          style={{
            width: "74%",
            height: 12,
            borderRadius: 8,
            background: "#f3f4f6",
            marginBottom: 16,
          }}
        />
        <div
          style={{
            width: 110,
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
          ⏰
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
          {formatInteger(overdueCount)}
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
          Safe limit: {formatInteger(targetMax)}
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 28,
            padding: "0 10px",
            borderRadius: 999,
            background: overdueCount <= targetMax ? "#047857" : toneStyles.badgeBg,
            color: "#ffffff",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          {statusLabel}
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
            width: `${healthProgress}%`,
            height: "100%",
            borderRadius: 999,
            background:
              overdueCount <= targetMax
                ? "linear-gradient(90deg, #047857 0%, #10b981 100%)"
                : tone === "danger"
                ? "linear-gradient(90deg, #b91c1c 0%, #ef4444 100%)"
                : tone === "warning"
                ? "linear-gradient(90deg, #c2410c 0%, #fb923c 100%)"
                : "linear-gradient(90deg, #1d4ed8 0%, #60a5fa 100%)",
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
          label="Completed Today"
          value={formatInteger(completedToday)}
          tone={toneStyles}
        />
        <MetricTile
          label="Critical"
          value={formatInteger(criticalCount)}
          tone={toneStyles}
        />
        <MetricTile
          label="Over Target"
          value={formatInteger(overTargetBy)}
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
          label="Due in Next Hour"
          value={formatInteger(dueInNextHour)}
          tone={toneStyles}
        />
        <MiniStatPill
          label="Recovery Health"
          value={`${healthProgress.toFixed(0)}%`}
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
          Overdue aging breakdown
        </div>

        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          {breakdown.map((item) => (
            <div
              key={`${item.label}-${item.count}`}
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
                    {formatInteger(item.count)}
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
          Follow-up health: {overdueCount <= targetMax ? "Healthy" : "At risk"}
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