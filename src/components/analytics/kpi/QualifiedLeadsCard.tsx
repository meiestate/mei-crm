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

export type QualifiedLeadSourceItem = {
  label: string;
  count: number;
  percent: number;
  color?: string;
};

export type QualifiedLeadsCardProps = {
  title?: string;
  subtitle?: string;
  qualifiedLeads?: number;
  targetQualifiedLeads?: number;
  mqlCount?: number;
  sqlCount?: number;
  hotLeads?: number;
  deltaPercent?: number;
  trend?: TrendDirection;
  tone?: Tone;
  lastUpdated?: string;
  loading?: boolean;
  breakdown?: QualifiedLeadSourceItem[];
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
      label: "Dropping",
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

function getTargetProgress(qualifiedLeads: number, targetQualifiedLeads: number): number {
  if (!Number.isFinite(targetQualifiedLeads) || targetQualifiedLeads <= 0) return 0;
  return clampPercent((qualifiedLeads / targetQualifiedLeads) * 100);
}

const DEFAULT_BREAKDOWN: QualifiedLeadSourceItem[] = [
  { label: "Website", count: 38, percent: 34, color: "#2563eb" },
  { label: "Channel Partners", count: 29, percent: 26, color: "#7c3aed" },
  { label: "Walk-ins", count: 21, percent: 19, color: "#10b981" },
  { label: "Referrals", count: 15, percent: 13, color: "#f59e0b" },
  { label: "Paid Campaigns", count: 9, percent: 8, color: "#ef4444" },
];

export default function QualifiedLeadsCard({
  title = "Qualified Leads",
  subtitle = "Marketing and sales qualified leads ready for deeper pipeline action",
  qualifiedLeads = 112,
  targetQualifiedLeads = 140,
  mqlCount = 68,
  sqlCount = 44,
  hotLeads = 19,
  deltaPercent = 8.6,
  trend = "up",
  tone = "info",
  lastUpdated = "Updated 4 mins ago",
  loading = false,
  breakdown = DEFAULT_BREAKDOWN,
  onClick,
}: QualifiedLeadsCardProps) {
  const toneStyles = useMemo(() => getToneStyles(tone), [tone]);
  const trendStyles = useMemo(() => getTrendStyles(trend), [trend]);

  const progress = useMemo(
    () => getTargetProgress(qualifiedLeads, targetQualifiedLeads),
    [qualifiedLeads, targetQualifiedLeads]
  );

  const gapToTarget = useMemo(
    () => Math.max(targetQualifiedLeads - qualifiedLeads, 0),
    [targetQualifiedLeads, qualifiedLeads]
  );

  const hotLeadRate = useMemo(() => {
    if (!qualifiedLeads) return 0;
    return clampPercent((hotLeads / qualifiedLeads) * 100);
  }, [hotLeads, qualifiedLeads]);

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
            width: 170,
            height: 18,
            borderRadius: 8,
            background: "#e5e7eb",
            marginBottom: 10,
          }}
        />
        <div
          style={{
            width: "72%",
            height: 12,
            borderRadius: 8,
            background: "#f3f4f6",
            marginBottom: 16,
          }}
        />
        <div
          style={{
            width: 130,
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
          {Array.from({ length: 5 }).map((_, index) => (
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
          🧲
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
          {formatInteger(qualifiedLeads)}
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
          Target: {formatInteger(targetQualifiedLeads)} leads
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
        <MetricTile label="MQL" value={formatInteger(mqlCount)} tone={toneStyles} />
        <MetricTile label="SQL" value={formatInteger(sqlCount)} tone={toneStyles} />
        <MetricTile label="Gap to Target" value={formatInteger(gapToTarget)} tone={toneStyles} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <MiniStatPill label="Hot Leads" value={formatInteger(hotLeads)} tone={toneStyles} />
        <MiniStatPill label="Hot Lead Rate" value={`${hotLeadRate.toFixed(0)}%`} tone={toneStyles} />
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
          Qualified lead source breakdown
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
          Pipeline readiness: {qualifiedLeads >= targetQualifiedLeads ? "On track" : "Needs boost"}
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