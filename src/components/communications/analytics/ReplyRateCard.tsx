import React, { memo, useMemo } from "react";

type TrendDirection = "up" | "down" | "neutral";

export type ReplyRateCardData = {
  totalSent: number;
  delivered: number;
  opened?: number;
  totalReplies: number;
  uniqueReplies?: number;
  positiveReplies?: number;
  negativeReplies?: number;
  neutralReplies?: number;
  replyRate?: number;
  uniqueReplyRate?: number;
  benchmarkRate?: number;
  trendValue?: number;
  trendDirection?: TrendDirection;
  avgResponseTimeHours?: number;
  lastUpdated?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  data?: Partial<ReplyRateCardData> | null;
  loading?: boolean;
  className?: string;
  height?: number | string;
  accentColor?: string;
  onViewDetails?: () => void;
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 20,
  padding: 20,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  display: "flex",
  flexDirection: "column",
  gap: 18,
  minWidth: 0,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const titleWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 700,
  color: "#0f172a",
  letterSpacing: "-0.02em",
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1.5,
};

const actionButtonStyle: React.CSSProperties = {
  border: "1px solid #dbe3ef",
  background: "#f8fafc",
  color: "#0f172a",
  fontSize: 13,
  fontWeight: 600,
  padding: "10px 14px",
  borderRadius: 12,
  cursor: "pointer",
};

const heroRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "stretch",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
};

const heroCardStyle: React.CSSProperties = {
  flex: "1 1 300px",
  minWidth: 0,
  borderRadius: 18,
  padding: 18,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const heroLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const heroValueStyle: React.CSSProperties = {
  fontSize: 34,
  fontWeight: 800,
  color: "#0f172a",
  lineHeight: 1,
  letterSpacing: "-0.04em",
};

const heroMetaRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const badgeBaseStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  fontWeight: 700,
  padding: "6px 10px",
  borderRadius: 999,
};

const helperTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
};

const benchmarkPanelStyle: React.CSSProperties = {
  flex: "0 0 250px",
  minWidth: 220,
  borderRadius: 18,
  padding: 18,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const benchmarkLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const benchmarkValueStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.03em",
};

const progressTrackStyle: React.CSSProperties = {
  width: "100%",
  height: 12,
  background: "#e2e8f0",
  borderRadius: 999,
  overflow: "hidden",
  display: "flex",
};

const metricGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 12,
};

const metricCardStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 14,
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#64748b",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const metricValueStyle: React.CSSProperties = {
  fontSize: 20,
  color: "#0f172a",
  fontWeight: 800,
  letterSpacing: "-0.02em",
};

const breakdownWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const breakdownRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  fontSize: 13,
};

const legendLeftStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  minWidth: 0,
};

const legendDotStyle = (color: string): React.CSSProperties => ({
  width: 10,
  height: 10,
  borderRadius: 999,
  background: color,
  flexShrink: 0,
});

const footerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const emptyStateStyle: React.CSSProperties = {
  border: "1px dashed #cbd5e1",
  borderRadius: 16,
  padding: "36px 20px",
  textAlign: "center",
  background: "#f8fafc",
  color: "#64748b",
};

const skeletonBlockStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 12,
  background:
    "linear-gradient(90deg, rgba(226,232,240,0.7) 25%, rgba(241,245,249,1) 37%, rgba(226,232,240,0.7) 63%)",
  backgroundSize: "400% 100%",
  animation: "reply-rate-skeleton 1.4s ease infinite",
};

function ReplyRateCard({
  title = "Reply Rate",
  subtitle = "Track how effectively your communication campaigns are generating responses and conversation momentum.",
  data,
  loading = false,
  className,
  height = "auto",
  accentColor = "#2563eb",
  onViewDetails,
}: Props) {
  const normalized = useMemo(() => {
    const totalSent = Number(data?.totalSent ?? 0);
    const delivered = Number(data?.delivered ?? 0);
    const opened = Number(data?.opened ?? 0);
    const totalReplies = Number(data?.totalReplies ?? 0);
    const uniqueReplies = Number(data?.uniqueReplies ?? totalReplies);
    const positiveReplies = Number(data?.positiveReplies ?? 0);
    const negativeReplies = Number(data?.negativeReplies ?? 0);
    const neutralReplies = Number(
      data?.neutralReplies ??
        Math.max(totalReplies - positiveReplies - negativeReplies, 0)
    );

    const replyRate =
      typeof data?.replyRate === "number"
        ? data.replyRate
        : delivered > 0
        ? (totalReplies / delivered) * 100
        : 0;

    const uniqueReplyRate =
      typeof data?.uniqueReplyRate === "number"
        ? data.uniqueReplyRate
        : delivered > 0
        ? (uniqueReplies / delivered) * 100
        : 0;

    const benchmarkRate = Number(data?.benchmarkRate ?? 0);
    const variance = replyRate - benchmarkRate;
    const avgResponseTimeHours = Number(data?.avgResponseTimeHours ?? 0);

    return {
      totalSent,
      delivered,
      opened,
      totalReplies,
      uniqueReplies,
      positiveReplies,
      negativeReplies,
      neutralReplies,
      replyRate,
      uniqueReplyRate,
      benchmarkRate,
      variance,
      avgResponseTimeHours,
      trendValue: Number(data?.trendValue ?? 0),
      trendDirection: data?.trendDirection ?? "neutral",
      lastUpdated: data?.lastUpdated ?? "",
    };
  }, [data]);

  const distribution = useMemo(() => {
    const total = normalized.totalReplies || 1;

    return {
      positive: (normalized.positiveReplies / total) * 100,
      negative: (normalized.negativeReplies / total) * 100,
      neutral: (normalized.neutralReplies / total) * 100,
    };
  }, [normalized]);

  return (
    <div
      className={className}
      style={{
        ...cardStyle,
        minHeight: height,
        height,
      }}
    >
      <style>
        {`
          @keyframes reply-rate-skeleton {
            0% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
          }

          @media (max-width: 1100px) {
            .reply-rate-metric-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 640px) {
            .reply-rate-metric-grid {
              grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
            }
          }
        `}
      </style>

      <div style={headerStyle}>
        <div style={titleWrapStyle}>
          <h3 style={titleStyle}>{title}</h3>
          <p style={subtitleStyle}>{subtitle}</p>
        </div>

        {onViewDetails ? (
          <button type="button" onClick={onViewDetails} style={actionButtonStyle}>
            View Details
          </button>
        ) : null}
      </div>

      {loading ? (
        <>
          <div style={heroRowStyle}>
            <div
              style={{
                ...heroCardStyle,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ ...skeletonBlockStyle, height: 12, width: "34%" }} />
              <div style={{ ...skeletonBlockStyle, height: 38, width: "42%" }} />
              <div style={{ ...skeletonBlockStyle, height: 24, width: "56%" }} />
            </div>

            <div style={benchmarkPanelStyle}>
              <div style={{ ...skeletonBlockStyle, height: 12, width: "45%" }} />
              <div style={{ ...skeletonBlockStyle, height: 28, width: "58%" }} />
              <div style={{ ...skeletonBlockStyle, height: 12, width: "100%" }} />
            </div>
          </div>

          <div className="reply-rate-metric-grid" style={metricGridStyle}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} style={metricCardStyle}>
                <div style={{ ...skeletonBlockStyle, height: 10, width: "48%" }} />
                <div style={{ ...skeletonBlockStyle, height: 24, width: "68%" }} />
              </div>
            ))}
          </div>
        </>
      ) : !data || normalized.delivered === 0 ? (
        <div style={emptyStateStyle}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 8,
            }}
          >
            No reply data available
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            Once recipients start responding, this card will display reply-rate
            performance, sentiment breakdown, and response efficiency metrics.
          </div>
        </div>
      ) : (
        <>
          <div style={heroRowStyle}>
            <div
              style={{
                ...heroCardStyle,
                background: `linear-gradient(135deg, ${hexToRgba(
                  accentColor,
                  0.12
                )} 0%, #f8fafc 100%)`,
                border: `1px solid ${hexToRgba(accentColor, 0.18)}`,
              }}
            >
              <span style={heroLabelStyle}>Reply Rate</span>
              <span style={heroValueStyle}>
                {formatPercent(normalized.replyRate)}
              </span>

              <div style={heroMetaRowStyle}>
                <span
                  style={{
                    ...badgeBaseStyle,
                    ...getTrendBadgeStyle(normalized.trendDirection),
                  }}
                >
                  <span>{getTrendArrow(normalized.trendDirection)}</span>
                  <span>{Math.abs(normalized.trendValue).toFixed(1)}%</span>
                </span>

                <span style={helperTextStyle}>
                  {normalized.lastUpdated
                    ? `Updated ${normalized.lastUpdated}`
                    : "Based on latest response activity"}
                </span>
              </div>
            </div>

            <div style={benchmarkPanelStyle}>
              <span style={benchmarkLabelStyle}>Benchmark</span>
              <span style={benchmarkValueStyle}>
                {formatPercent(normalized.benchmarkRate)}
              </span>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    fontSize: 12,
                    color: "#64748b",
                  }}
                >
                  <span>Performance vs benchmark</span>
                  <strong
                    style={{
                      color:
                        normalized.variance > 0
                          ? "#047857"
                          : normalized.variance < 0
                          ? "#b91c1c"
                          : "#475569",
                    }}
                  >
                    {normalized.variance > 0 ? "+" : ""}
                    {normalized.variance.toFixed(1)}%
                  </strong>
                </div>

                <div style={progressTrackStyle}>
                  <div
                    style={{
                      width: `${Math.min(
                        normalized.benchmarkRate > 0
                          ? (normalized.replyRate / normalized.benchmarkRate) * 100
                          : normalized.replyRate,
                        100
                      )}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${hexToRgba(
                        accentColor,
                        0.8
                      )} 0%, ${accentColor} 100%)`,
                      borderRadius: 999,
                      transition: "width 0.35s ease",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="reply-rate-metric-grid" style={metricGridStyle}>
            <div style={metricCardStyle}>
              <span style={metricLabelStyle}>Delivered</span>
              <span style={metricValueStyle}>
                {formatNumber(normalized.delivered)}
              </span>
            </div>

            <div style={metricCardStyle}>
              <span style={metricLabelStyle}>Total Replies</span>
              <span style={metricValueStyle}>
                {formatNumber(normalized.totalReplies)}
              </span>
            </div>

            <div style={metricCardStyle}>
              <span style={metricLabelStyle}>Unique Replies</span>
              <span style={metricValueStyle}>
                {formatNumber(normalized.uniqueReplies)}
              </span>
            </div>

            <div style={metricCardStyle}>
              <span style={metricLabelStyle}>Unique Reply Rate</span>
              <span style={metricValueStyle}>
                {formatPercent(normalized.uniqueReplyRate)}
              </span>
            </div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                fontSize: 13,
                color: "#64748b",
                flexWrap: "wrap",
              }}
            >
              <span>Reply sentiment distribution</span>
              <strong style={{ color: "#0f172a" }}>
                {formatNumber(normalized.totalReplies)} total replies
              </strong>
            </div>

            <div style={progressTrackStyle}>
              <div
                style={{
                  width: `${distribution.positive}%`,
                  background: "#10b981",
                  height: "100%",
                }}
              />
              <div
                style={{
                  width: `${distribution.neutral}%`,
                  background: "#94a3b8",
                  height: "100%",
                }}
              />
              <div
                style={{
                  width: `${distribution.negative}%`,
                  background: "#ef4444",
                  height: "100%",
                }}
              />
            </div>

            <div style={breakdownWrapStyle}>
              <div style={breakdownRowStyle}>
                <div style={legendLeftStyle}>
                  <span style={legendDotStyle("#10b981")} />
                  <span style={{ color: "#334155", fontWeight: 600 }}>
                    Positive Replies
                  </span>
                </div>
                <strong style={{ color: "#0f172a" }}>
                  {formatNumber(normalized.positiveReplies)} (
                  {formatPercent(distribution.positive)})
                </strong>
              </div>

              <div style={breakdownRowStyle}>
                <div style={legendLeftStyle}>
                  <span style={legendDotStyle("#94a3b8")} />
                  <span style={{ color: "#334155", fontWeight: 600 }}>
                    Neutral Replies
                  </span>
                </div>
                <strong style={{ color: "#0f172a" }}>
                  {formatNumber(normalized.neutralReplies)} (
                  {formatPercent(distribution.neutral)})
                </strong>
              </div>

              <div style={breakdownRowStyle}>
                <div style={legendLeftStyle}>
                  <span style={legendDotStyle("#ef4444")} />
                  <span style={{ color: "#334155", fontWeight: 600 }}>
                    Negative Replies
                  </span>
                </div>
                <strong style={{ color: "#0f172a" }}>
                  {formatNumber(normalized.negativeReplies)} (
                  {formatPercent(distribution.negative)})
                </strong>
              </div>
            </div>
          </div>

          <div style={footerStyle}>
            <span style={helperTextStyle}>
              Sent:{" "}
              <strong style={{ color: "#0f172a" }}>
                {formatNumber(normalized.totalSent)}
              </strong>
            </span>

            <span style={helperTextStyle}>
              Opened:{" "}
              <strong style={{ color: "#0f172a" }}>
                {formatNumber(normalized.opened)}
              </strong>
            </span>

            <span style={helperTextStyle}>
              Reply-to-open:{" "}
              <strong style={{ color: "#0f172a" }}>
                {formatPercent(
                  normalized.opened > 0
                    ? (normalized.totalReplies / normalized.opened) * 100
                    : 0
                )}
              </strong>
            </span>

            <span style={helperTextStyle}>
              Avg Response Time:{" "}
              <strong style={{ color: "#0f172a" }}>
                {formatHours(normalized.avgResponseTimeHours)}
              </strong>
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function getTrendArrow(direction?: TrendDirection) {
  if (direction === "up") return "↗";
  if (direction === "down") return "↘";
  return "→";
}

function getTrendBadgeStyle(direction?: TrendDirection): React.CSSProperties {
  if (direction === "up") {
    return {
      background: "#ecfdf5",
      color: "#047857",
      border: "1px solid #a7f3d0",
    };
  }

  if (direction === "down") {
    return {
      background: "#fef2f2",
      color: "#b91c1c",
      border: "1px solid #fecaca",
    };
  }

  return {
    background: "#f8fafc",
    color: "#475569",
    border: "1px solid #e2e8f0",
  };
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatPercent(value?: number) {
  return `${(value ?? 0).toFixed(1)}%`;
}

function formatHours(value?: number) {
  const hours = value ?? 0;

  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  }

  if (hours < 24) {
    return `${hours.toFixed(1)} hrs`;
  }

  const days = hours / 24;
  return `${days.toFixed(1)} days`;
}

function hexToRgba(hex: string, alpha: number) {
  const sanitized = hex.replace("#", "");

  if (sanitized.length !== 6) {
    return `rgba(37, 99, 235, ${alpha})`;
  }

  const r = parseInt(sanitized.slice(0, 2), 16);
  const g = parseInt(sanitized.slice(2, 4), 16);
  const b = parseInt(sanitized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default memo(ReplyRateCard);