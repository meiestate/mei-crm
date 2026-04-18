import React, { useMemo } from "react";

export type ForecastInsightTone =
  | "positive"
  | "warning"
  | "critical"
  | "neutral"
  | "info";

export interface ForecastInsightMetric {
  id: string;
  label: string;
  value: number;
  target?: number;
  format?: "number" | "percent" | "currency" | "days";
  helperText?: string;
}

export interface ForecastInsightCardProps {
  title?: string;
  subtitle?: string;
  forecastValue?: number;
  targetValue?: number;
  previousForecastValue?: number;
  confidenceScore?: number;
  weightedPipelineValue?: number;
  coverageRatio?: number;
  projectedClosures?: number;
  averageDealAgeDays?: number;
  tone?: ForecastInsightTone;
  loading?: boolean;
  compact?: boolean;
  updatedAtLabel?: string;
  insightText?: string;
  recommendations?: string[];
  metrics?: ForecastInsightMetric[];
  currency?: string;
  locale?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

type ToneConfig = {
  accent: string;
  soft: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  ringTrack: string;
  shadow: string;
};

const toneMap: Record<ForecastInsightTone, ToneConfig> = {
  positive: {
    accent: "#16A34A",
    soft: "#DCFCE7",
    border: "#BBF7D0",
    badgeBg: "#F0FDF4",
    badgeText: "#15803D",
    ringTrack: "#E8F8EE",
    shadow: "0 18px 42px rgba(22,163,74,0.14)",
  },
  warning: {
    accent: "#D97706",
    soft: "#FEF3C7",
    border: "#FCD34D",
    badgeBg: "#FFFBEB",
    badgeText: "#B45309",
    ringTrack: "#FFF3DA",
    shadow: "0 18px 42px rgba(217,119,6,0.14)",
  },
  critical: {
    accent: "#DC2626",
    soft: "#FEE2E2",
    border: "#FCA5A5",
    badgeBg: "#FEF2F2",
    badgeText: "#B91C1C",
    ringTrack: "#FEE8E8",
    shadow: "0 18px 42px rgba(220,38,38,0.14)",
  },
  neutral: {
    accent: "#475569",
    soft: "#E2E8F0",
    border: "#CBD5E1",
    badgeBg: "#F8FAFC",
    badgeText: "#334155",
    ringTrack: "#EEF2F7",
    shadow: "0 18px 42px rgba(71,85,105,0.12)",
  },
  info: {
    accent: "#2563EB",
    soft: "#DBEAFE",
    border: "#BFDBFE",
    badgeBg: "#EFF6FF",
    badgeText: "#1D4ED8",
    ringTrack: "#EAF2FF",
    shadow: "0 18px 42px rgba(37,99,235,0.14)",
  },
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function inferTone(
  confidenceScore: number,
  coverageRatio: number,
  attainment: number
): ForecastInsightTone {
  if (confidenceScore >= 80 && coverageRatio >= 1.2 && attainment >= 90) {
    return "positive";
  }
  if (confidenceScore < 45 || coverageRatio < 0.7 || attainment < 60) {
    return "critical";
  }
  if (confidenceScore < 65 || coverageRatio < 1 || attainment < 85) {
    return "warning";
  }
  return "info";
}

function getToneLabel(tone: ForecastInsightTone): string {
  switch (tone) {
    case "positive":
      return "Strong Outlook";
    case "warning":
      return "Watch Closely";
    case "critical":
      return "At Risk";
    case "neutral":
      return "Balanced";
    case "info":
    default:
      return "Forecast Insight";
  }
}

function formatCurrency(
  value: number,
  locale = "en-IN",
  currency = "INR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number, locale = "en-IN"): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);
}

function formatMetricValue(
  value: number,
  format: ForecastInsightMetric["format"],
  locale: string,
  currency: string
): string {
  switch (format) {
    case "currency":
      return formatCurrency(value, locale, currency);
    case "percent":
      return `${formatNumber(value, locale)}%`;
    case "days":
      return `${formatNumber(value, locale)} days`;
    case "number":
    default:
      return formatNumber(value, locale);
  }
}

function getDeltaLabel(deltaPercent: number): string {
  if (deltaPercent > 0) return `+${deltaPercent.toFixed(1)}% vs previous`;
  if (deltaPercent < 0) return `${deltaPercent.toFixed(1)}% vs previous`;
  return "No change vs previous";
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
          "linear-gradient(90deg, rgba(226,232,240,0.78) 0%, rgba(241,245,249,1) 50%, rgba(226,232,240,0.78) 100%)",
        backgroundSize: "200% 100%",
        animation: "forecastInsightPulse 1.2s ease-in-out infinite",
      }}
    />
  );
}

function MiniProgress({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: ToneConfig;
}) {
  const safeValue = clamp(value);
  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid #E2E8F0",
        background: "#FFFFFF",
        padding: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: 0.35,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#0F172A",
          }}
        >
          {safeValue}%
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: 8,
          borderRadius: 999,
          background: tone.ringTrack,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${safeValue}%`,
            height: "100%",
            borderRadius: 999,
            background: tone.accent,
          }}
        />
      </div>
    </div>
  );
}

export default function ForecastInsightCard({
  title = "Forecast Insight",
  subtitle = "A quick reading of forecast confidence, target coverage, and closure momentum.",
  forecastValue = 28400000,
  targetValue = 32000000,
  previousForecastValue = 26200000,
  confidenceScore = 78,
  weightedPipelineValue = 40100000,
  coverageRatio = 1.25,
  projectedClosures = 18,
  averageDealAgeDays = 24,
  tone,
  loading = false,
  compact = false,
  updatedAtLabel = "Updated 5 mins ago",
  insightText,
  recommendations,
  metrics,
  currency = "INR",
  locale = "en-IN",
  onClick,
  className,
  style,
}: ForecastInsightCardProps) {
  const derived = useMemo(() => {
    const safeTarget = targetValue > 0 ? targetValue : 1;
    const attainment = clamp((forecastValue / safeTarget) * 100);
    const pipelineCoveragePercent = clamp(coverageRatio * 100, 0, 300);
    const confidence = clamp(confidenceScore);
    const deltaPercent =
      previousForecastValue > 0
        ? ((forecastValue - previousForecastValue) / previousForecastValue) * 100
        : 0;

    const resolvedTone = tone ?? inferTone(confidence, coverageRatio, attainment);

    const resolvedInsight =
      insightText ??
      (resolvedTone === "positive"
        ? "The forecast has a healthy backbone. Coverage is strong, confidence is steady, and the current pipeline suggests the team has enough room to hit the number with disciplined execution."
        : resolvedTone === "warning"
        ? "The path is still open, but the cushion is getting thinner. A few delayed follow-ups or slipped negotiations could soften the end result."
        : resolvedTone === "critical"
        ? "The forecast is under pressure. Current pipeline strength and confidence are not yet enough to comfortably protect the target."
        : resolvedTone === "neutral"
        ? "The forecast is balanced for now. Execution quality over the next few cycles will decide whether this stays stable or bends."
        : "The forecast looks workable, with a decent signal from weighted pipeline and present conversion rhythm.");

    const resolvedRecommendations =
      recommendations ??
      (resolvedTone === "positive"
        ? [
            "Push late-stage deals faster to convert momentum into realized revenue.",
            "Protect top-performing sources and avoid unnecessary funnel dilution.",
            "Use this period to tighten forecasting discipline across agents.",
          ]
        : resolvedTone === "warning"
        ? [
            "Reduce overdue follow-ups and re-activate stuck opportunities this week.",
            "Prioritize negotiation-stage deals with the highest weighted value.",
            "Watch deal aging closely before forecast confidence slips further.",
          ]
        : resolvedTone === "critical"
        ? [
            "Rebuild near-term pipeline urgently with high-intent opportunities.",
            "Escalate aged deals and remove dead weight from the forecast view.",
            "Focus leadership attention on conversion blockers, not vanity volume.",
          ]
        : [
            "Track stage movement daily to keep the forecast signal clean.",
            "Review source quality and double down on efficient channels.",
            "Keep closures and follow-up compliance tightly linked.",
          ]);

    const resolvedMetrics: ForecastInsightMetric[] =
      metrics ??
      [
        {
          id: "pipeline-coverage",
          label: "Pipeline Coverage",
          value: pipelineCoveragePercent,
          format: "percent",
          helperText: "Coverage of target from current weighted pipeline.",
        },
        {
          id: "projected-closures",
          label: "Projected Closures",
          value: projectedClosures,
          format: "number",
          helperText: "Estimated closures for the selected period.",
        },
        {
          id: "avg-deal-age",
          label: "Avg Deal Age",
          value: averageDealAgeDays,
          format: "days",
          helperText: "Average age of forecasted deals in motion.",
        },
        {
          id: "weighted-pipeline",
          label: "Weighted Pipeline",
          value: weightedPipelineValue,
          format: "currency",
          helperText: "Probability-adjusted value of live opportunities.",
        },
      ];

    return {
      attainment,
      pipelineCoveragePercent,
      confidence,
      deltaPercent,
      resolvedTone,
      resolvedInsight,
      resolvedRecommendations,
      resolvedMetrics,
    };
  }, [
    targetValue,
    forecastValue,
    previousForecastValue,
    confidenceScore,
    weightedPipelineValue,
    coverageRatio,
    projectedClosures,
    averageDealAgeDays,
    tone,
    insightText,
    recommendations,
    metrics,
    locale,
    currency,
  ]);

  const palette = toneMap[derived.resolvedTone];
  const safeForecastPercent = clamp(derived.attainment);
  const ringSize = compact ? 112 : 128;
  const strokeWidth = compact ? 10 : 12;
  const radius = ringSize / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset =
    circumference - (safeForecastPercent / 100) * circumference;
  const interactive = typeof onClick === "function";

  return (
    <>
      <style>
        {`
          @keyframes forecastInsightPulse {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>

      <section
        className={className}
        onClick={onClick}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={(event) => {
          if (!interactive) return;
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
            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.98) 100%)",
          boxShadow: palette.shadow,
          padding: compact ? 18 : 22,
          cursor: interactive ? "pointer" : "default",
          ...style,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -80,
            right: -70,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: palette.soft,
            opacity: 0.72,
            filter: "blur(8px)",
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
          <div style={{ flex: 1, minWidth: 260 }}>
            {loading ? (
              <>
                <SkeletonLine width="32%" height={16} />
                <div style={{ height: 10 }} />
                <SkeletonLine width="84%" height={12} />
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
                      lineHeight: 1.2,
                      letterSpacing: -0.3,
                      color: "#0F172A",
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
                      background: palette.badgeBg,
                      border: `1px solid ${palette.border}`,
                      color: palette.badgeText,
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: 0.45,
                    }}
                  >
                    {getToneLabel(derived.resolvedTone)}
                  </span>
                </div>

                <p
                  style={{
                    marginTop: 10,
                    marginBottom: 0,
                    maxWidth: 780,
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.65,
                    color: "#64748B",
                  }}
                >
                  {subtitle}
                </p>
              </>
            )}
          </div>

          <div
            style={{
              minWidth: compact ? 180 : 230,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: ringSize,
                    height: ringSize,
                    borderRadius: "50%",
                    background: "#F1F5F9",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <SkeletonLine width={56} height={26} radius={10} />
                </div>
                <SkeletonLine width={130} height={12} />
              </>
            ) : (
              <>
                <div
                  style={{
                    position: "relative",
                    width: ringSize,
                    height: ringSize,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <svg width={ringSize} height={ringSize}>
                    <defs>
                      <linearGradient
                        id="forecast-insight-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor={palette.accent} />
                        <stop offset="100%" stopColor={palette.badgeText} />
                      </linearGradient>
                    </defs>

                    <circle
                      cx={ringSize / 2}
                      cy={ringSize / 2}
                      r={radius}
                      fill="none"
                      stroke={palette.ringTrack}
                      strokeWidth={strokeWidth}
                    />

                    <circle
                      cx={ringSize / 2}
                      cy={ringSize / 2}
                      r={radius}
                      fill="none"
                      stroke="url(#forecast-insight-gradient)"
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
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
                        lineHeight: 1,
                        letterSpacing: -0.8,
                        color: "#0F172A",
                      }}
                    >
                      {safeForecastPercent}%
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#64748B",
                        textTransform: "uppercase",
                        letterSpacing: 0.45,
                      }}
                    >
                      target hit
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "#FFFFFF",
                    border: `1px solid ${palette.border}`,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color:
                        derived.deltaPercent >= 0 ? "#15803D" : "#B91C1C",
                    }}
                  >
                    {derived.deltaPercent >= 0 ? "↑" : "↓"}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color:
                        derived.deltaPercent >= 0 ? "#15803D" : "#B91C1C",
                    }}
                  >
                    {getDeltaLabel(derived.deltaPercent)}
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
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 14,
          }}
        >
          <div
            style={{
              borderRadius: 18,
              border: `1px solid ${palette.border}`,
              background: "#FFFFFF",
              padding: compact ? 14 : 16,
            }}
          >
            {loading ? (
              <>
                <SkeletonLine width="24%" height={13} />
                <div style={{ height: 10 }} />
                <SkeletonLine width="96%" height={11} />
                <div style={{ height: 8 }} />
                <SkeletonLine width="88%" height={11} />
                <div style={{ height: 8 }} />
                <SkeletonLine width="84%" height={11} />
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: palette.badgeText,
                    textTransform: "uppercase",
                    letterSpacing: 0.45,
                  }}
                >
                  Forecast Read
                </div>

                <p
                  style={{
                    marginTop: 10,
                    marginBottom: 14,
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.7,
                    color: "#334155",
                  }}
                >
                  {derived.resolvedInsight}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 10,
                  }}
                >
                  <MetricPill
                    label="Forecast Value"
                    value={formatCurrency(forecastValue, locale, currency)}
                  />
                  <MetricPill
                    label="Target Value"
                    value={formatCurrency(targetValue, locale, currency)}
                  />
                  <MetricPill
                    label="Confidence"
                    value={`${derived.confidence}%`}
                  />
                </div>
              </>
            )}
          </div>

          <div
            style={{
              borderRadius: 18,
              border: "1px solid #E2E8F0",
              background: "#FFFFFF",
              padding: compact ? 14 : 16,
            }}
          >
            {loading ? (
              <>
                <SkeletonLine width="34%" height={13} />
                <div style={{ height: 12 }} />
                <SkeletonLine width="92%" height={11} />
                <div style={{ height: 10 }} />
                <SkeletonLine width="88%" height={11} />
                <div style={{ height: 10 }} />
                <SkeletonLine width="84%" height={11} />
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#0F172A",
                    textTransform: "uppercase",
                    letterSpacing: 0.45,
                    marginBottom: 12,
                  }}
                >
                  Recommended Moves
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {derived.resolvedRecommendations.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 14,
                        background: palette.badgeBg,
                        border: `1px solid ${palette.border}`,
                      }}
                    >
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          flexShrink: 0,
                          marginTop: 1,
                          display: "grid",
                          placeItems: "center",
                          background: palette.accent,
                          color: "#FFFFFF",
                          fontSize: 11,
                          fontWeight: 900,
                        }}
                      >
                        {index + 1}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          lineHeight: 1.55,
                          color: "#334155",
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`forecast-metric-skeleton-${index + 1}`}
                  style={{
                    borderRadius: 16,
                    border: "1px solid #E2E8F0",
                    background: "#FFFFFF",
                    padding: 14,
                  }}
                >
                  <SkeletonLine width="42%" height={11} />
                  <div style={{ height: 10 }} />
                  <SkeletonLine width="38%" height={22} radius={8} />
                  <div style={{ height: 10 }} />
                  <SkeletonLine width="88%" height={10} />
                </div>
              ))
            : derived.resolvedMetrics.map((metric) => (
                <div
                  key={metric.id}
                  style={{
                    borderRadius: 16,
                    border: "1px solid #E2E8F0",
                    background: "#FFFFFF",
                    padding: 14,
                    boxShadow: "0 6px 16px rgba(15,23,42,0.04)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#64748B",
                    }}
                  >
                    {metric.label}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: compact ? 22 : 24,
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: -0.5,
                      color: "#0F172A",
                    }}
                  >
                    {formatMetricValue(
                      metric.value,
                      metric.format,
                      locale,
                      currency
                    )}
                  </div>

                  {typeof metric.target === "number" ? (
                    <div
                      style={{
                        marginTop: 8,
                        width: "100%",
                        height: 8,
                        borderRadius: 999,
                        background: palette.ringTrack,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${clamp((metric.value / metric.target) * 100)}%`,
                          height: "100%",
                          borderRadius: 999,
                          background: palette.accent,
                        }}
                      />
                    </div>
                  ) : null}

                  {metric.helperText ? (
                    <div
                      style={{
                        marginTop: 9,
                        fontSize: 11,
                        fontWeight: 500,
                        lineHeight: 1.5,
                        color: "#64748B",
                      }}
                    >
                      {metric.helperText}
                    </div>
                  ) : null}
                </div>
              ))}
        </div>

        {!loading ? (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            <MiniProgress
              label="Attainment"
              value={derived.attainment}
              tone={palette}
            />
            <MiniProgress
              label="Coverage"
              value={clamp(derived.pipelineCoveragePercent)}
              tone={palette}
            />
            <MiniProgress
              label="Confidence"
              value={derived.confidence}
              tone={palette}
            />
          </div>
        ) : null}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {loading ? (
            <>
              <SkeletonLine width={110} height={11} />
              <SkeletonLine width={180} height={11} />
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
                {derived.resolvedTone === "positive"
                  ? "Momentum is on your side."
                  : derived.resolvedTone === "warning"
                  ? "Execution discipline matters now."
                  : derived.resolvedTone === "critical"
                  ? "Immediate action can still change the curve."
                  : "Keep the signal clean and consistent."}
              </span>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function MetricPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid #E2E8F0",
        background: "#F8FAFC",
        padding: "10px 12px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#64748B",
          textTransform: "uppercase",
          letterSpacing: 0.35,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 14,
          fontWeight: 800,
          color: "#0F172A",
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
    </div>
  );
}