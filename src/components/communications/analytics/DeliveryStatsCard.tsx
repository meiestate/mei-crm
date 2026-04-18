import React, { memo, useMemo } from "react";

type TrendDirection = "up" | "down" | "neutral";

export type DeliveryStatsCardData = {
  totalSent: number;
  delivered: number;
  failed: number;
  pending: number;
  bounced?: number;
  opened?: number;
  clicked?: number;
  deliveryRate?: number;
  trendValue?: number;
  trendDirection?: TrendDirection;
  lastUpdated?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  data?: Partial<DeliveryStatsCardData> | null;
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

const sidePanelStyle: React.CSSProperties = {
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

const sidePanelLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const sidePanelValueStyle: React.CSSProperties = {
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
  animation: "delivery-stats-skeleton 1.4s ease infinite",
};

function DeliveryStatsCard({
  title = "Delivery Stats",
  subtitle = "Track sent, delivered, failed, and pending communication performance in one view.",
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
    const failed = Number(data?.failed ?? 0);
    const pending = Number(data?.pending ?? 0);
    const bounced = Number(data?.bounced ?? 0);
    const opened = Number(data?.opened ?? 0);
    const clicked = Number(data?.clicked ?? 0);

    const deliveryRate =
      typeof data?.deliveryRate === "number"
        ? data.deliveryRate
        : totalSent > 0
        ? (delivered / totalSent) * 100
        : 0;

    return {
      totalSent,
      delivered,
      failed,
      pending,
      bounced,
      opened,
      clicked,
      deliveryRate,
      trendValue: Number(data?.trendValue ?? 0),
      trendDirection: data?.trendDirection ?? "neutral",
      lastUpdated: data?.lastUpdated ?? "",
    };
  }, [data]);

  const distribution = useMemo(() => {
    const total = normalized.totalSent || 1;

    return {
      delivered: (normalized.delivered / total) * 100,
      failed: (normalized.failed / total) * 100,
      pending: (normalized.pending / total) * 100,
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
          @keyframes delivery-stats-skeleton {
            0% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
          }

          @media (max-width: 1100px) {
            .delivery-stats-metric-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 640px) {
            .delivery-stats-metric-grid {
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

            <div style={sidePanelStyle}>
              <div style={{ ...skeletonBlockStyle, height: 12, width: "45%" }} />
              <div style={{ ...skeletonBlockStyle, height: 28, width: "58%" }} />
              <div style={{ ...skeletonBlockStyle, height: 12, width: "100%" }} />
            </div>
          </div>

          <div className="delivery-stats-metric-grid" style={metricGridStyle}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} style={metricCardStyle}>
                <div style={{ ...skeletonBlockStyle, height: 10, width: "48%" }} />
                <div style={{ ...skeletonBlockStyle, height: 24, width: "68%" }} />
              </div>
            ))}
          </div>
        </>
      ) : !data || normalized.totalSent === 0 ? (
        <div style={emptyStateStyle}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 8,
            }}
          >
            No delivery data available
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            Once messages are sent, this card will display delivery rate,
            breakdown status, and engagement-ready communication health metrics.
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
              <span style={heroLabelStyle}>Delivery Rate</span>
              <span style={heroValueStyle}>
                {formatPercent(normalized.deliveryRate)}
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
                    : "Based on latest delivery activity"}
                </span>
              </div>
            </div>

            <div style={sidePanelStyle}>
              <span style={sidePanelLabelStyle}>Delivery Overview</span>
              <span style={sidePanelValueStyle}>
                {formatNumber(normalized.delivered)} / {formatNumber(normalized.totalSent)}
              </span>

              <div style={progressTrackStyle}>
                <div
                  style={{
                    width: `${distribution.delivered}%`,
                    background: "#10b981",
                    height: "100%",
                  }}
                />
                <div
                  style={{
                    width: `${distribution.failed}%`,
                    background: "#ef4444",
                    height: "100%",
                  }}
                />
                <div
                  style={{
                    width: `${distribution.pending}%`,
                    background: "#f59e0b",
                    height: "100%",
                  }}
                />
              </div>

              <span style={helperTextStyle}>
                Sent volume successfully distributed across delivery states.
              </span>
            </div>
          </div>

          <div className="delivery-stats-metric-grid" style={metricGridStyle}>
            <div style={metricCardStyle}>
              <span style={metricLabelStyle}>Total Sent</span>
              <span style={metricValueStyle}>
                {formatNumber(normalized.totalSent)}
              </span>
            </div>

            <div style={metricCardStyle}>
              <span style={metricLabelStyle}>Delivered</span>
              <span style={metricValueStyle}>
                {formatNumber(normalized.delivered)}
              </span>
            </div>

            <div style={metricCardStyle}>
              <span style={metricLabelStyle}>Failed</span>
              <span style={metricValueStyle}>
                {formatNumber(normalized.failed)}
              </span>
            </div>

            <div style={metricCardStyle}>
              <span style={metricLabelStyle}>Pending</span>
              <span style={metricValueStyle}>
                {formatNumber(normalized.pending)}
              </span>
            </div>
          </div>

          <div style={breakdownWrapStyle}>
            <div style={breakdownRowStyle}>
              <div style={legendLeftStyle}>
                <span style={legendDotStyle("#10b981")} />
                <span style={{ color: "#334155", fontWeight: 600 }}>Delivered</span>
              </div>
              <strong style={{ color: "#0f172a" }}>
                {formatNumber(normalized.delivered)} ({formatPercent(distribution.delivered)})
              </strong>
            </div>

            <div style={breakdownRowStyle}>
              <div style={legendLeftStyle}>
                <span style={legendDotStyle("#ef4444")} />
                <span style={{ color: "#334155", fontWeight: 600 }}>Failed</span>
              </div>
              <strong style={{ color: "#0f172a" }}>
                {formatNumber(normalized.failed)} ({formatPercent(distribution.failed)})
              </strong>
            </div>

            <div style={breakdownRowStyle}>
              <div style={legendLeftStyle}>
                <span style={legendDotStyle("#f59e0b")} />
                <span style={{ color: "#334155", fontWeight: 600 }}>Pending</span>
              </div>
              <strong style={{ color: "#0f172a" }}>
                {formatNumber(normalized.pending)} ({formatPercent(distribution.pending)})
              </strong>
            </div>

            {(normalized.bounced > 0 ||
              normalized.opened > 0 ||
              normalized.clicked > 0) && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 12,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: 14,
                    padding: 12,
                  }}
                >
                  <div style={metricLabelStyle}>Bounced</div>
                  <div style={metricValueStyle}>{formatNumber(normalized.bounced)}</div>
                </div>

                <div
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: 14,
                    padding: 12,
                  }}
                >
                  <div style={metricLabelStyle}>Opened</div>
                  <div style={metricValueStyle}>{formatNumber(normalized.opened)}</div>
                </div>

                <div
                  style={{
                    background: "#ecfeff",
                    border: "1px solid #a5f3fc",
                    borderRadius: 14,
                    padding: 12,
                  }}
                >
                  <div style={metricLabelStyle}>Clicked</div>
                  <div style={metricValueStyle}>{formatNumber(normalized.clicked)}</div>
                </div>
              </div>
            )}
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

export default memo(DeliveryStatsCard);