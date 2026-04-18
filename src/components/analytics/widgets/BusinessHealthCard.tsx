import React, { useMemo } from "react";

export type BusinessHealthStatus =
  | "excellent"
  | "good"
  | "watch"
  | "critical";

export interface BusinessHealthMetric {
  id: string;
  label: string;
  value: number;
  weight?: number;
  helperText?: string;
}

export interface BusinessHealthCardProps {
  title?: string;
  subtitle?: string;
  score?: number;
  status?: BusinessHealthStatus;
  trendValue?: number;
  trendLabel?: string;
  loading?: boolean;
  metrics?: BusinessHealthMetric[];
  updatedAtLabel?: string;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

type HealthPalette = {
  accent: string;
  accentSoft: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  shadow: string;
  progressFrom: string;
  progressTo: string;
  ringTrack: string;
};

const defaultMetrics: BusinessHealthMetric[] = [
  {
    id: "lead-quality",
    label: "Lead Quality",
    value: 82,
    weight: 25,
    helperText: "Qualification consistency is strong across the current funnel.",
  },
  {
    id: "follow-up-discipline",
    label: "Follow-up Discipline",
    value: 74,
    weight: 25,
    helperText: "Team is responding well, but overdue follow-ups need trimming.",
  },
  {
    id: "conversion-efficiency",
    label: "Conversion Efficiency",
    value: 69,
    weight: 25,
    helperText: "Mid-funnel movement is decent, though closure velocity can improve.",
  },
  {
    id: "revenue-confidence",
    label: "Revenue Confidence",
    value: 79,
    weight: 25,
    helperText: "Weighted pipeline looks healthy with a fair chance of realization.",
  },
];

const paletteMap: Record<BusinessHealthStatus, HealthPalette> = {
  excellent: {
    accent: "#16A34A",
    accentSoft: "#DCFCE7",
    badgeBg: "#F0FDF4",
    badgeText: "#15803D",
    border: "#BBF7D0",
    shadow: "0 16px 40px rgba(22, 163, 74, 0.14)",
    progressFrom: "#22C55E",
    progressTo: "#16A34A",
    ringTrack: "#E8FBEF",
  },
  good: {
    accent: "#2563EB",
    accentSoft: "#DBEAFE",
    badgeBg: "#EFF6FF",
    badgeText: "#1D4ED8",
    border: "#BFDBFE",
    shadow: "0 16px 40px rgba(37, 99, 235, 0.14)",
    progressFrom: "#60A5FA",
    progressTo: "#2563EB",
    ringTrack: "#EAF2FF",
  },
  watch: {
    accent: "#D97706",
    accentSoft: "#FEF3C7",
    badgeBg: "#FFFBEB",
    badgeText: "#B45309",
    border: "#FDE68A",
    shadow: "0 16px 40px rgba(217, 119, 6, 0.14)",
    progressFrom: "#FBBF24",
    progressTo: "#D97706",
    ringTrack: "#FFF3D8",
  },
  critical: {
    accent: "#DC2626",
    accentSoft: "#FEE2E2",
    badgeBg: "#FEF2F2",
    badgeText: "#B91C1C",
    border: "#FECACA",
    shadow: "0 16px 40px rgba(220, 38, 38, 0.14)",
    progressFrom: "#F87171",
    progressTo: "#DC2626",
    ringTrack: "#FFE8E8",
  },
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function getStatusFromScore(score: number): BusinessHealthStatus {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "watch";
  return "critical";
}

function getStatusLabel(status: BusinessHealthStatus): string {
  switch (status) {
    case "excellent":
      return "Excellent";
    case "good":
      return "Good";
    case "watch":
      return "Needs Watch";
    case "critical":
      return "Critical";
    default:
      return "Healthy";
  }
}

function getMetricTone(value: number) {
  if (value >= 85) {
    return {
      fill: "#DCFCE7",
      text: "#15803D",
      bar: "#22C55E",
    };
  }
  if (value >= 70) {
    return {
      fill: "#DBEAFE",
      text: "#2563EB",
      bar: "#3B82F6",
    };
  }
  if (value >= 50) {
    return {
      fill: "#FEF3C7",
      text: "#B45309",
      bar: "#F59E0B",
    };
  }
  return {
    fill: "#FEE2E2",
    text: "#B91C1C",
    bar: "#EF4444",
  };
}

function buildScoreFromMetrics(metrics: BusinessHealthMetric[]): number {
  if (!metrics.length) return 0;

  const totalWeight = metrics.reduce(
    (sum, metric) => sum + (metric.weight ?? 1),
    0
  );

  if (!totalWeight) return 0;

  const weightedScore = metrics.reduce((sum, metric) => {
    return sum + clamp(metric.value) * (metric.weight ?? 1);
  }, 0);

  return Math.round(weightedScore / totalWeight);
}

function formatTrend(value?: number): string {
  if (typeof value !== "number") return "--";
  const abs = Math.abs(value).toFixed(1);
  return `${value > 0 ? "+" : value < 0 ? "-" : ""}${abs}%`;
}

function getTrendColor(value: number | undefined): string {
  if (typeof value !== "number" || value === 0) return "#64748B";
  return value > 0 ? "#15803D" : "#B91C1C";
}

function SkeletonLine({
  width,
  height = 12,
  radius = 999,
}: {
  width: number | string;
  height?: number;
  radius?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, rgba(226,232,240,0.75) 0%, rgba(241,245,249,1) 50%, rgba(226,232,240,0.75) 100%)",
        backgroundSize: "200% 100%",
        animation: "businessHealthPulse 1.2s ease-in-out infinite",
      }}
    />
  );
}

export default function BusinessHealthCard({
  title = "Business Health",
  subtitle = "A blended score built from pipeline quality, follow-up discipline, conversion efficiency, and revenue confidence.",
  score,
  status,
  trendValue = 6.4,
  trendLabel = "vs last period",
  loading = false,
  metrics = defaultMetrics,
  updatedAtLabel = "Updated 5 mins ago",
  onClick,
  compact = false,
  className,
  style,
}: BusinessHealthCardProps) {
  const resolvedScore = useMemo(() => {
    if (typeof score === "number") return clamp(score);
    return buildScoreFromMetrics(metrics);
  }, [score, metrics]);

  const resolvedStatus = status ?? getStatusFromScore(resolvedScore);
  const palette = paletteMap[resolvedStatus];
  const progress = clamp(resolvedScore);
  const isInteractive = typeof onClick === "function";

  const radius = compact ? 44 : 52;
  const stroke = compact ? 10 : 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <>
      <style>
        {`
          @keyframes businessHealthPulse {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>

      <section
        className={className}
        onClick={onClick}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onKeyDown={(event) => {
          if (!isInteractive) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick?.();
          }
        }}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 24,
          border: `1px solid ${palette.border}`,
          background:
            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.96) 100%)",
          boxShadow: palette.shadow,
          padding: compact ? 18 : 22,
          cursor: isInteractive ? "pointer" : "default",
          transition: "transform 160ms ease, box-shadow 160ms ease",
          ...style,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -54,
            right: -54,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: palette.accentSoft,
            opacity: 0.65,
            filter: "blur(4px)",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 5,
            background: palette.accent,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 240 }}>
            {loading ? (
              <>
                <SkeletonLine width="34%" height={16} />
                <div style={{ height: 10 }} />
                <SkeletonLine width="86%" height={12} />
                <div style={{ height: 8 }} />
                <SkeletonLine width="72%" height={12} />
              </>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: compact ? 18 : 20,
                      fontWeight: 800,
                      color: "#0F172A",
                      lineHeight: 1.2,
                      letterSpacing: -0.3,
                    }}
                  >
                    {title}
                  </h3>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "5px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 800,
                      color: palette.badgeText,
                      background: palette.badgeBg,
                      border: `1px solid ${palette.border}`,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    {getStatusLabel(resolvedStatus)}
                  </span>
                </div>

                <p
                  style={{
                    marginTop: 10,
                    marginBottom: 0,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#64748B",
                    lineHeight: 1.6,
                    maxWidth: 760,
                  }}
                >
                  {subtitle}
                </p>
              </>
            )}
          </div>

          <div
            style={{
              minWidth: compact ? 160 : 190,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: compact ? 96 : 116,
                    height: compact ? 96 : 116,
                    borderRadius: "50%",
                    background: "#F1F5F9",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <SkeletonLine
                    width={compact ? 46 : 56}
                    height={compact ? 24 : 28}
                    radius={10}
                  />
                </div>
                <SkeletonLine width={90} height={12} />
              </>
            ) : (
              <>
                <div
                  style={{
                    position: "relative",
                    width: radius * 2,
                    height: radius * 2,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <svg width={radius * 2} height={radius * 2}>
                    <defs>
                      <linearGradient
                        id="business-health-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor={palette.progressFrom} />
                        <stop offset="100%" stopColor={palette.progressTo} />
                      </linearGradient>
                    </defs>

                    <circle
                      cx={radius}
                      cy={radius}
                      r={normalizedRadius}
                      fill="none"
                      stroke={palette.ringTrack}
                      strokeWidth={stroke}
                    />

                    <circle
                      cx={radius}
                      cy={radius}
                      r={normalizedRadius}
                      fill="none"
                      stroke="url(#business-health-gradient)"
                      strokeWidth={stroke}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      transform={`rotate(-90 ${radius} ${radius})`}
                    />
                  </svg>

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: compact ? 28 : 34,
                        fontWeight: 900,
                        color: "#0F172A",
                        lineHeight: 1,
                        letterSpacing: -0.8,
                      }}
                    >
                      {progress}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#64748B",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      score
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 999,
                    border: `1px solid ${palette.border}`,
                    background: "#FFFFFF",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: getTrendColor(trendValue),
                      lineHeight: 1,
                    }}
                  >
                    {typeof trendValue === "number"
                      ? trendValue > 0
                        ? "↑"
                        : trendValue < 0
                        ? "↓"
                        : "•"
                      : "•"}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: getTrendColor(trendValue),
                    }}
                  >
                    {formatTrend(trendValue)}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#64748B",
                    }}
                  >
                    {trendLabel}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: compact ? 18 : 22,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`metric-skeleton-${index + 1}`}
                  style={{
                    borderRadius: 16,
                    border: "1px solid #E2E8F0",
                    background: "#FFFFFF",
                    padding: 14,
                  }}
                >
                  <SkeletonLine width="46%" height={12} />
                  <div style={{ height: 12 }} />
                  <SkeletonLine width="28%" height={22} radius={8} />
                  <div style={{ height: 12 }} />
                  <SkeletonLine width="100%" height={8} radius={999} />
                </div>
              ))
            : metrics.map((metric) => {
                const tone = getMetricTone(metric.value);
                return (
                  <div
                    key={metric.id}
                    style={{
                      borderRadius: 16,
                      border: "1px solid #E2E8F0",
                      background: "#FFFFFF",
                      padding: 14,
                      boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#475569",
                          lineHeight: 1.4,
                        }}
                      >
                        {metric.label}
                      </span>

                      {metric.weight ? (
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: 999,
                            fontSize: 10,
                            fontWeight: 800,
                            color: "#64748B",
                            background: "#F8FAFC",
                            border: "1px solid #E2E8F0",
                          }}
                        >
                          {metric.weight}%
                        </span>
                      ) : null}
                    </div>

                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        alignItems: "baseline",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 24,
                          fontWeight: 900,
                          color: "#0F172A",
                          letterSpacing: -0.5,
                          lineHeight: 1,
                        }}
                      >
                        {clamp(metric.value)}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#64748B",
                          textTransform: "uppercase",
                        }}
                      >
                        /100
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: 12,
                        width: "100%",
                        height: 8,
                        borderRadius: 999,
                        background: tone.fill,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${clamp(metric.value)}%`,
                          height: "100%",
                          borderRadius: 999,
                          background: tone.bar,
                        }}
                      />
                    </div>

                    {metric.helperText ? (
                      <p
                        style={{
                          marginTop: 10,
                          marginBottom: 0,
                          fontSize: 11,
                          fontWeight: 500,
                          color: tone.text,
                          lineHeight: 1.5,
                        }}
                      >
                        {metric.helperText}
                      </p>
                    ) : null}
                  </div>
                );
              })}
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {loading ? (
            <>
              <SkeletonLine width={120} height={11} />
              <SkeletonLine width={160} height={11} />
            </>
          ) : (
            <>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#64748B",
                }}
              >
                {updatedAtLabel}
              </span>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: palette.badgeText,
                }}
              >
                {resolvedStatus === "excellent"
                  ? "Momentum is strong."
                  : resolvedStatus === "good"
                  ? "Business is in a stable zone."
                  : resolvedStatus === "watch"
                  ? "Keep a close eye on weak spots."
                  : "Immediate operational attention needed."}
              </span>
            </>
          )}
        </div>
      </section>
    </>
  );
}