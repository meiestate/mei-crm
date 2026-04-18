import React, { useMemo } from "react";
import AlertSummaryCard, {
  type AlertSummaryCardProps,
} from "./AlertSummaryCard";

export type AnalyticsSummaryMetricTone =
  | "critical"
  | "warning"
  | "success"
  | "info"
  | "neutral";

export type AnalyticsSummaryMetricTrend = "up" | "down" | "flat";

export type AnalyticsSummaryMetric = {
  id: string;
  title: string;
  value: number | string;
  subtitle?: string;
  helperText?: string;
  delta?: number;
  deltaLabel?: string;
  trend?: AnalyticsSummaryMetricTrend;
  tone?: AnalyticsSummaryMetricTone;
  currency?: boolean;
  percentage?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
};

export interface AnalyticsSummaryPanelProps {
  title?: string;
  subtitle?: string;
  metrics?: AnalyticsSummaryMetric[];
  loading?: boolean;
  compact?: boolean;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  style?: React.CSSProperties;
  cardStyle?: React.CSSProperties;
}

const iconTextStyle: React.CSSProperties = {
  fontSize: 18,
  lineHeight: 1,
  fontWeight: 800,
};

const defaultMetrics: AnalyticsSummaryMetric[] = [
  {
    id: "total-leads",
    title: "Total Leads",
    value: 2486,
    subtitle: "All incoming leads this cycle",
    helperText:
      "Healthy acquisition pace with strong inflow from paid and referral channels.",
    delta: 12.4,
    deltaLabel: "vs last month",
    trend: "up",
    tone: "info",
    icon: <span style={iconTextStyle}>👥</span>,
  },
  {
    id: "qualified-rate",
    title: "Qualified Rate",
    value: 38.6,
    subtitle: "Lead quality conversion",
    helperText:
      "Qualification quality is climbing, which usually means tighter targeting and better screening.",
    delta: 4.2,
    deltaLabel: "vs last month",
    trend: "up",
    tone: "success",
    percentage: true,
    icon: <span style={iconTextStyle}>✓</span>,
  },
  {
    id: "overdue-followups",
    title: "Overdue Follow-ups",
    value: 46,
    subtitle: "Pending action items",
    helperText:
      "This area needs quick attention before intent cools down and the pipeline starts leaking.",
    delta: 8.8,
    deltaLabel: "vs last week",
    trend: "up",
    tone: "warning",
    icon: <span style={iconTextStyle}>⏰</span>,
  },
  {
    id: "revenue-forecast",
    title: "Forecast Revenue",
    value: 28400000,
    subtitle: "Projected weighted revenue",
    helperText:
      "Weighted forecast is strong, but final realization depends on negotiation-stage discipline.",
    delta: 6.9,
    deltaLabel: "vs previous forecast",
    trend: "up",
    tone: "success",
    currency: true,
    icon: <span style={iconTextStyle}>₹</span>,
  },
];

const panelStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 24,
  border: "1px solid #E2E8F0",
  background:
    "linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,1) 100%)",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

const panelHeaderStyle: React.CSSProperties = {
  padding: "20px 20px 0 20px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 800,
  color: "#0F172A",
  letterSpacing: -0.3,
  lineHeight: 1.2,
};

const subtitleStyle: React.CSSProperties = {
  marginTop: 8,
  marginBottom: 0,
  fontSize: 13,
  fontWeight: 500,
  color: "#64748B",
  lineHeight: 1.6,
  maxWidth: 820,
};

function getGridTemplate(columns: 1 | 2 | 3 | 4): string {
  switch (columns) {
    case 1:
      return "repeat(1, minmax(0, 1fr))";
    case 2:
      return "repeat(2, minmax(260px, 1fr))";
    case 3:
      return "repeat(3, minmax(240px, 1fr))";
    case 4:
    default:
      return "repeat(4, minmax(220px, 1fr))";
  }
}

function buildSkeletonMetrics(count: number): AnalyticsSummaryMetric[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: `skeleton-${index + 1}`,
    title: "Loading",
    value: 0,
    subtitle: "Loading...",
    helperText: "Loading...",
    delta: 0,
    deltaLabel: "Loading",
    trend: "flat",
    tone: "neutral",
  }));
}

export default function AnalyticsSummaryPanel({
  title = "Analytics Summary",
  subtitle = "A quick pulse-check of the numbers that matter most right now across leads, execution, risk, and revenue.",
  metrics = defaultMetrics,
  loading = false,
  compact = false,
  columns = 4,
  className,
  style,
  cardStyle,
}: AnalyticsSummaryPanelProps) {
  const resolvedMetrics = useMemo(() => {
    if (loading) {
      return buildSkeletonMetrics(metrics.length > 0 ? metrics.length : columns);
    }

    return metrics;
  }, [loading, metrics, columns]);

  const summaryMeta = useMemo(() => {
    const criticalCount = metrics.filter(
      (metric) => metric.tone === "critical"
    ).length;
    const warningCount = metrics.filter(
      (metric) => metric.tone === "warning"
    ).length;
    const successCount = metrics.filter(
      (metric) => metric.tone === "success"
    ).length;

    return {
      criticalCount,
      warningCount,
      successCount,
    };
  }, [metrics]);

  return (
    <section
      className={className}
      style={{
        ...panelStyle,
        ...style,
      }}
    >
      <div style={panelHeaderStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 240, flex: 1 }}>
            <h2 style={titleStyle}>{title}</h2>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>

          {!loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <SummaryBadge
                label="Critical"
                value={summaryMeta.criticalCount}
                tone="critical"
              />
              <SummaryBadge
                label="Warning"
                value={summaryMeta.warningCount}
                tone="warning"
              />
              <SummaryBadge
                label="Positive"
                value={summaryMeta.successCount}
                tone="success"
              />
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          padding: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: getGridTemplate(columns),
            gap: compact ? 12 : 16,
          }}
        >
          {resolvedMetrics.map((metric) => {
            const cardProps: AlertSummaryCardProps = {
              title: metric.title,
              value: metric.value,
              subtitle: metric.subtitle,
              helperText: metric.helperText,
              delta: metric.delta,
              deltaLabel: metric.deltaLabel,
              trend: metric.trend,
              tone: metric.tone,
              currency: metric.currency,
              percentage: metric.percentage,
              icon: metric.icon,
              onClick: metric.onClick,
              compact,
              loading,
              style: cardStyle,
            };

            return <AlertSummaryCard key={metric.id} {...cardProps} />;
          })}
        </div>
      </div>
    </section>
  );
}

function SummaryBadge({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: AnalyticsSummaryMetricTone;
}) {
  const colors = getBadgeTone(tone);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        border: `1px solid ${colors.border}`,
        background: colors.background,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: colors.dot,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: colors.text,
          lineHeight: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: colors.text,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function getBadgeTone(tone: AnalyticsSummaryMetricTone) {
  switch (tone) {
    case "critical":
      return {
        background: "#FEF2F2",
        border: "#FECACA",
        text: "#B91C1C",
        dot: "#EF4444",
      };
    case "warning":
      return {
        background: "#FFFBEB",
        border: "#FDE68A",
        text: "#B45309",
        dot: "#F59E0B",
      };
    case "success":
      return {
        background: "#F0FDF4",
        border: "#BBF7D0",
        text: "#15803D",
        dot: "#22C55E",
      };
    case "info":
      return {
        background: "#EFF6FF",
        border: "#BFDBFE",
        text: "#2563EB",
        dot: "#3B82F6",
      };
    case "neutral":
    default:
      return {
        background: "#F8FAFC",
        border: "#E2E8F0",
        text: "#475569",
        dot: "#94A3B8",
      };
  }
}