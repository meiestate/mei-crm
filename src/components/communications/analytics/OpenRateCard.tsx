import React, { memo, useMemo } from "react";

type TrendDirection = "up" | "down" | "neutral";

export type OpenRateCardData = {
  totalSent: number;
  delivered: number;
  opened: number;
  uniqueOpened?: number;
  clicked?: number;
  bounced?: number;
  openRate?: number;
  uniqueOpenRate?: number;
  benchmarkRate?: number;
  trendValue?: number;
  trendDirection?: TrendDirection;
  lastUpdated?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  data?: Partial<OpenRateCardData> | null;
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
  animation: "open-rate-skeleton 1.4s ease infinite",
};

function OpenRateCard({
  title = "Open Rate",
  subtitle = "Track how effectively your emails and communication campaigns are getting opened.",
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
    const uniqueOpened = Number(data?.uniqueOpened ?? opened);
    const clicked = Number(data?.clicked ?? 0);
    const bounced = Number(data?.bounced ?? 0);

    const openRate =
      typeof data?.openRate === "number"
        ? data.openRate
        : delivered > 0
        ? (opened / delivered) * 100
        : 0;

    const uniqueOpenRate =
      typeof data?.uniqueOpenRate === "number"
        ? data.uniqueOpenRate
        : delivered > 0
        ? (uniqueOpened / delivered) * 100
        : 0;

    const benchmarkRate = Number(data?.benchmarkRate ?? 0);
    const variance = openRate - benchmarkRate;

    return {
      totalSent,
      delivered,
      opened,
      uniqueOpened,
      clicked,
      bounced,
      openRate,
      uniqueOpenRate,
      benchmarkRate,
      variance,
      trendValue: Number(data?.trendValue ?? 0),
      trendDirection: data?.trendDirection ?? "neutral",
      lastUpdated: data?.lastUpdated ?? "",
    };
  }, [data]);

  const openProgress = useMemo(() => {
    if (normalized.delivered <= 0) return 0;
    return Math.min((normalized.opened / normalized.delivered) * 100, 100);
  }, [normalized.delivered, normalized.opened]);

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
          @keyframes open-rate-skeleton {
            0% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
          }

          @media (max-width: 1100px) {
            .open-rate-metric-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 640px) {
            .open-rate-metric-grid {
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

          <div className="open-rate-metric-grid" style={metricGridStyle}>
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
            No open data available
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            Once emails are delivered and recipients begin opening them, this
            card will display open-rate performance, benchmark comparison, and
            engagement quality metrics.
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
              <span style={heroLabelStyle}>Open Rate</span>
              <span style={heroValueStyle}>
                {formatPercent(normalized.openRate)}
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
                    : "Based on latest recipient activity"}
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
                          ? (normalized.openRate / normalized.benchmarkRate) * 100
                          : normalized.openRate,
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

          <div className="open-rate-metric-grid" style={metricGridStyle}>
            <div style={metricCardStyle}>
              <span style={metricLabelStyle}>Delivered</span>
              <span style={metricValueStyle}>
                {formatNumber(normalized.delivered)}
              </span>
            </div>

            <div style={metricCardStyle}>
              <span style={metricLabelStyle}>Opened</span>
              <span style={metricValueStyle}>
                {formatNumber(normalized.opened)}
              </span>
            </div>

            <div style={metricCardStyle}>
              <span style={metricLabelStyle}>Unique Opened</span>
              <span style={metricValueStyle}>
                {formatNumber(normalized.uniqueOpened)}
              </span>
            </div>

            <div style={metricCardStyle}>
              <span style={metricLabelStyle}>Unique Open Rate</span>
              <span style={metricValueStyle}>
                {formatPercent(normalized.uniqueOpenRate)}
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
              gap: 10,
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
              <span>Open progress across delivered messages</span>
              <strong style={{ color: "#0f172a" }}>
                {formatNumber(normalized.opened)} / {formatNumber(normalized.delivered)}
              </strong>
            </div>

            <div style={progressTrackStyle}>
              <div
                style={{
                  width: `${openProgress}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${hexToRgba(
                    accentColor,
                    0.85
                  )} 0%, ${accentColor} 100%)`,
                  borderRadius: 999,
                  transition: "width 0.35s ease",
                }}
              />
            </div>
          </div>

          <div style={footerStyle}>
            <span style={helperTextStyle}>
              Total Sent:{" "}
              <strong style={{ color: "#0f172a" }}>
                {formatNumber(normalized.totalSent)}
              </strong>
            </span>

            <span style={helperTextStyle}>
              Clicked:{" "}
              <strong style={{ color: "#0f172a" }}>
                {formatNumber(normalized.clicked)}
              </strong>
            </span>

            <span style={helperTextStyle}>
              Bounced:{" "}
              <strong style={{ color: "#0f172a" }}>
                {formatNumber(normalized.bounced)}
              </strong>
            </span>

            <span style={helperTextStyle}>
              Click-to-open:{" "}
              <strong style={{ color: "#0f172a" }}>
                {formatPercent(
                  normalized.opened > 0
                    ? (normalized.clicked / normalized.opened) * 100
                    : 0
                )}
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

export default memo(OpenRateCard);