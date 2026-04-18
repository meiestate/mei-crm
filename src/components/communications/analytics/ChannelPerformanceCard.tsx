import React, { memo, useMemo } from "react";

type TrendDirection = "up" | "down" | "neutral";

export type ChannelPerformanceItem = {
  id: string;
  channelName: string;
  leads: number;
  qualified: number;
  conversions: number;
  revenue: number;
  conversionRate?: number;
  qualifiedRate?: number;
  costPerLead?: number;
  trendValue?: number;
  trendDirection?: TrendDirection;
  color?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  data?: ChannelPerformanceItem[];
  loading?: boolean;
  className?: string;
  height?: number | string;
  currency?: string;
  maxItems?: number;
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

const headerRowStyle: React.CSSProperties = {
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
  transition: "all 0.2s ease",
};

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 12,
};

const summaryCardStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 14,
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
};

const summaryLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const summaryValueStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.02em",
};

const rowsWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const rowStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 14,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  background: "#ffffff",
};

const rowTopStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const channelLeftStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
};

const channelDotStyle = (color: string): React.CSSProperties => ({
  width: 12,
  height: 12,
  borderRadius: 999,
  background: color,
  boxShadow: `0 0 0 4px ${hexToRgba(color, 0.12)}`,
  flexShrink: 0,
});

const channelTextWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  minWidth: 0,
};

const channelNameStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0f172a",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const channelMetaStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
};

const trendBadgeBaseStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const metricsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 10,
};

const metricBoxStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 10,
  display: "flex",
  flexDirection: "column",
  gap: 4,
  minWidth: 0,
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#64748b",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const metricValueStyle: React.CSSProperties = {
  fontSize: 15,
  color: "#0f172a",
  fontWeight: 800,
};

const progressWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const progressTrackStyle: React.CSSProperties = {
  width: "100%",
  height: 10,
  background: "#e2e8f0",
  borderRadius: 999,
  overflow: "hidden",
};

const progressLabelsStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  fontSize: 12,
  color: "#64748b",
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
  animation: "channel-performance-skeleton 1.4s ease infinite",
};

const palette = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
  "#f97316",
];

function ChannelPerformanceCard({
  title = "Channel Performance",
  subtitle = "Compare lead quality, conversions, and revenue contribution across acquisition channels.",
  data = [],
  loading = false,
  className,
  height = "auto",
  currency = "INR",
  maxItems = 6,
  onViewDetails,
}: Props) {
  const normalizedData = useMemo(() => {
    return (data ?? [])
      .map((item, index) => {
        const qualifiedRate =
          item.qualifiedRate ??
          (item.leads > 0 ? (item.qualified / item.leads) * 100 : 0);

        const conversionRate =
          item.conversionRate ??
          (item.leads > 0 ? (item.conversions / item.leads) * 100 : 0);

        return {
          ...item,
          qualifiedRate,
          conversionRate,
          color: item.color || palette[index % palette.length],
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, maxItems);
  }, [data, maxItems]);

  const summary = useMemo(() => {
    const totals = normalizedData.reduce(
      (acc, item) => {
        acc.leads += item.leads;
        acc.qualified += item.qualified;
        acc.conversions += item.conversions;
        acc.revenue += item.revenue;
        return acc;
      },
      { leads: 0, qualified: 0, conversions: 0, revenue: 0 }
    );

    const avgConversionRate =
      totals.leads > 0 ? (totals.conversions / totals.leads) * 100 : 0;

    return {
      ...totals,
      avgConversionRate,
    };
  }, [normalizedData]);

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
          @keyframes channel-performance-skeleton {
            0% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
          }

          @media (max-width: 1100px) {
            .channel-performance-summary-grid,
            .channel-performance-metrics-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 640px) {
            .channel-performance-summary-grid,
            .channel-performance-metrics-grid {
              grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
            }
          }
        `}
      </style>

      <div style={headerRowStyle}>
        <div style={titleWrapStyle}>
          <h3 style={titleStyle}>{title}</h3>
          <p style={subtitleStyle}>{subtitle}</p>
        </div>

        {onViewDetails ? (
          <button
            type="button"
            onClick={onViewDetails}
            style={actionButtonStyle}
          >
            View Details
          </button>
        ) : null}
      </div>

      {loading ? (
        <>
          <div
            className="channel-performance-summary-grid"
            style={summaryGridStyle}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} style={summaryCardStyle}>
                <div style={{ ...skeletonBlockStyle, height: 12, width: "45%" }} />
                <div style={{ ...skeletonBlockStyle, height: 26, width: "70%" }} />
              </div>
            ))}
          </div>

          <div style={rowsWrapStyle}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} style={rowStyle}>
                <div style={{ ...skeletonBlockStyle, height: 18, width: "35%" }} />
                <div
                  className="channel-performance-metrics-grid"
                  style={metricsGridStyle}
                >
                  {Array.from({ length: 4 }).map((__, metricIndex) => (
                    <div key={metricIndex} style={metricBoxStyle}>
                      <div
                        style={{ ...skeletonBlockStyle, height: 10, width: "50%" }}
                      />
                      <div
                        style={{ ...skeletonBlockStyle, height: 18, width: "75%" }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ ...skeletonBlockStyle, height: 10, width: "100%" }} />
              </div>
            ))}
          </div>
        </>
      ) : normalizedData.length === 0 ? (
        <div style={emptyStateStyle}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 8,
            }}
          >
            No channel data available
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            Once lead sources start generating activity, this card will show
            channel-wise performance, conversion efficiency, and revenue impact.
          </div>
        </div>
      ) : (
        <>
          <div
            className="channel-performance-summary-grid"
            style={summaryGridStyle}
          >
            <div style={summaryCardStyle}>
              <span style={summaryLabelStyle}>Total Leads</span>
              <span style={summaryValueStyle}>
                {formatNumber(summary.leads)}
              </span>
            </div>

            <div style={summaryCardStyle}>
              <span style={summaryLabelStyle}>Qualified Leads</span>
              <span style={summaryValueStyle}>
                {formatNumber(summary.qualified)}
              </span>
            </div>

            <div style={summaryCardStyle}>
              <span style={summaryLabelStyle}>Conversions</span>
              <span style={summaryValueStyle}>
                {formatNumber(summary.conversions)}
              </span>
            </div>

            <div style={summaryCardStyle}>
              <span style={summaryLabelStyle}>Revenue</span>
              <span style={summaryValueStyle}>
                {formatCurrency(summary.revenue, currency)}
              </span>
            </div>
          </div>

          <div style={rowsWrapStyle}>
            {normalizedData.map((item) => {
              const revenueShare =
                summary.revenue > 0 ? (item.revenue / summary.revenue) * 100 : 0;

              return (
                <div key={item.id} style={rowStyle}>
                  <div style={rowTopStyle}>
                    <div style={channelLeftStyle}>
                      <span style={channelDotStyle(item.color!)} />
                      <div style={channelTextWrapStyle}>
                        <span style={channelNameStyle}>{item.channelName}</span>
                        <span style={channelMetaStyle}>
                          Revenue Share: {formatPercent(revenueShare)}
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        ...trendBadgeBaseStyle,
                        ...getTrendBadgeStyle(item.trendDirection),
                      }}
                    >
                      <span>{getTrendArrow(item.trendDirection)}</span>
                      <span>
                        {typeof item.trendValue === "number"
                          ? `${Math.abs(item.trendValue).toFixed(1)}%`
                          : "Stable"}
                      </span>
                    </span>
                  </div>

                  <div
                    className="channel-performance-metrics-grid"
                    style={metricsGridStyle}
                  >
                    <div style={metricBoxStyle}>
                      <span style={metricLabelStyle}>Leads</span>
                      <span style={metricValueStyle}>
                        {formatNumber(item.leads)}
                      </span>
                    </div>

                    <div style={metricBoxStyle}>
                      <span style={metricLabelStyle}>Qualified</span>
                      <span style={metricValueStyle}>
                        {formatNumber(item.qualified)}
                      </span>
                    </div>

                    <div style={metricBoxStyle}>
                      <span style={metricLabelStyle}>Conversions</span>
                      <span style={metricValueStyle}>
                        {formatNumber(item.conversions)}
                      </span>
                    </div>

                    <div style={metricBoxStyle}>
                      <span style={metricLabelStyle}>Revenue</span>
                      <span style={metricValueStyle}>
                        {formatCurrency(item.revenue, currency)}
                      </span>
                    </div>
                  </div>

                  <div style={progressWrapStyle}>
                    <div style={progressLabelsStyle}>
                      <span>
                        Conversion Rate:{" "}
                        <strong style={{ color: "#0f172a" }}>
                          {formatPercent(item.conversionRate)}
                        </strong>
                      </span>

                      <span>
                        Qualified Rate:{" "}
                        <strong style={{ color: "#0f172a" }}>
                          {formatPercent(item.qualifiedRate)}
                        </strong>
                      </span>

                      {typeof item.costPerLead === "number" ? (
                        <span>
                          CPL:{" "}
                          <strong style={{ color: "#0f172a" }}>
                            {formatCurrency(item.costPerLead, currency)}
                          </strong>
                        </span>
                      ) : null}
                    </div>

                    <div style={progressTrackStyle}>
                      <div
                        style={{
                          width: `${Math.min(item.conversionRate || 0, 100)}%`,
                          height: "100%",
                          background: `linear-gradient(90deg, ${hexToRgba(
                            item.color!,
                            0.85
                          )} 0%, ${item.color} 100%)`,
                          borderRadius: 999,
                          transition: "width 0.35s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
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

function formatCurrency(value?: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
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

export default memo(ChannelPerformanceCard);