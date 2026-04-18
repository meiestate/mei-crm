// src/components/analytics/charts/lead/LeadsByStatusChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "site_visit"
  | "negotiation"
  | "won"
  | "lost";

type LeadsByStatusDatum = {
  status: LeadStatus | string;
  count: number;
  qualifiedCount?: number;
  conversionRate?: number;
};

type LeadsByStatusChartProps = {
  title?: string;
  subtitle?: string;
  data?: LeadsByStatusDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  showSummary?: boolean;
  donutInnerRadius?: number;
};

type ChartRow = LeadsByStatusDatum & {
  qualifiedCount: number;
  conversionRate: number;
  label: string;
  color: string;
};

type TooltipPayloadItem = {
  payload?: ChartRow;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
};

const DEFAULT_HEIGHT = 420;

const defaultData: LeadsByStatusDatum[] = [
  { status: "new", count: 42, qualifiedCount: 10, conversionRate: 23.8 },
  { status: "contacted", count: 36, qualifiedCount: 14, conversionRate: 38.9 },
  { status: "qualified", count: 28, qualifiedCount: 28, conversionRate: 100 },
  { status: "proposal", count: 18, qualifiedCount: 11, conversionRate: 61.1 },
  { status: "site_visit", count: 16, qualifiedCount: 10, conversionRate: 62.5 },
  { status: "negotiation", count: 11, qualifiedCount: 8, conversionRate: 72.7 },
  { status: "won", count: 7, qualifiedCount: 7, conversionRate: 100 },
  { status: "lost", count: 9, qualifiedCount: 0, conversionRate: 0 },
];

const containerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 20,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
  border: "1px solid rgba(148,163,184,0.18)",
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
  padding: 20,
};

const headerWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 18,
  flexWrap: "wrap",
};

const titleWrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 700,
  color: "#0f172a",
  lineHeight: 1.2,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1.4,
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(16,185,129,0.10)",
  color: "#047857",
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const chartAreaStyle: CSSProperties = {
  flex: 1,
  minHeight: 280,
};

const loadingWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 280,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  fontSize: 14,
  fontWeight: 600,
};

const emptyWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 280,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  textAlign: "center",
  color: "#64748b",
  padding: 24,
};

const emptyTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 700,
  color: "#334155",
};

const emptyTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.5,
  maxWidth: 360,
};

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatStatusLabel(status: string): string {
  switch (status) {
    case "new":
      return "New";
    case "contacted":
      return "Contacted";
    case "qualified":
      return "Qualified";
    case "proposal":
      return "Proposal";
    case "site_visit":
      return "Site Visit";
    case "negotiation":
      return "Negotiation";
    case "won":
      return "Won";
    case "lost":
      return "Lost";
    default:
      return status
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "new":
      return "#3b82f6";
    case "contacted":
      return "#06b6d4";
    case "qualified":
      return "#8b5cf6";
    case "proposal":
      return "#f59e0b";
    case "site_visit":
      return "#10b981";
    case "negotiation":
      return "#6366f1";
    case "won":
      return "#16a34a";
    case "lost":
      return "#ef4444";
    default:
      return "#94a3b8";
  }
}

function buildChartData(data: LeadsByStatusDatum[]): ChartRow[] {
  return data.map((item) => {
    const qualifiedCount =
      item.qualifiedCount ??
      (item.status === "qualified" || item.status === "won"
        ? item.count
        : Math.round(item.count * 0.4));

    const conversionRate =
      item.conversionRate ??
      (item.count > 0
        ? Number(((qualifiedCount / item.count) * 100).toFixed(1))
        : 0);

    return {
      ...item,
      qualifiedCount,
      conversionRate,
      label: formatStatusLabel(item.status),
      color: getStatusColor(item.status),
    };
  });
}

function getTooltipRow(payload?: TooltipPayloadItem[]): ChartRow | null {
  if (!payload || payload.length === 0) {
    return null;
  }

  const firstItem = payload[0];
  if (!firstItem || typeof firstItem !== "object") {
    return null;
  }

  const row = firstItem.payload;
  if (!row || typeof row !== "object") {
    return null;
  }

  return row;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active) {
    return null;
  }

  const row = getTooltipRow(payload);

  if (!row) {
    return null;
  }

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(148,163,184,0.24)",
        borderRadius: 16,
        boxShadow: "0 14px 40px rgba(15,23,42,0.14)",
        padding: 14,
        minWidth: 220,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: 10,
        }}
      >
        {String(label ?? row.label)}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          rowGap: 8,
          columnGap: 16,
          fontSize: 13,
        }}
      >
        <span style={{ color: "#64748b" }}>Lead Count</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.count}
        </span>

        <span style={{ color: "#64748b" }}>Qualified</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.qualifiedCount}
        </span>

        <span style={{ color: "#64748b" }}>Conversion Rate</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.conversionRate)}
        </span>
      </div>
    </div>
  );
}

function CenterLabel({
  total,
  title,
}: {
  total: number;
  title: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1,
          }}
        >
          {total}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#64748b",
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}

export default function LeadsByStatusChart({
  title = "Leads by Status",
  subtitle = "Track how leads are distributed across each pipeline stage",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No status-wise lead data available right now.",
  showSummary = true,
  donutInnerRadius = 78,
}: LeadsByStatusChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalLeads = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.count, 0);
  }, [chartData]);

  const topStatus = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.count - a.count)[0] ?? null;
  }, [chartData]);

  const bestConversionStatus = useMemo(() => {
    const filtered = chartData.filter((item) => item.count > 0);
    if (!filtered.length) return null;
    return [...filtered].sort((a, b) => b.conversionRate - a.conversionRate)[0] ?? null;
  }, [chartData]);

  if (loading) {
    return (
      <section style={{ ...containerStyle, height }}>
        <div style={headerWrapStyle}>
          <div style={titleWrapStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>
          <div style={badgeStyle}>Loading...</div>
        </div>

        <div style={loadingWrapStyle}>Loading chart data...</div>
      </section>
    );
  }

  if (!chartData.length) {
    return (
      <section style={{ ...containerStyle, height }}>
        <div style={headerWrapStyle}>
          <div style={titleWrapStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>
        </div>

        <div style={emptyWrapStyle}>
          <p style={emptyTitleStyle}>No lead status data</p>
          <p style={emptyTextStyle}>{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ ...containerStyle, height }}>
      <div style={headerWrapStyle}>
        <div style={titleWrapStyle}>
          <h3 style={titleStyle}>{title}</h3>
          <p style={subtitleStyle}>{subtitle}</p>
        </div>

        {showSummary ? (
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <div style={badgeStyle}>Total Leads: {totalLeads}</div>

            {topStatus ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(59,130,246,0.10)",
                  color: "#1d4ed8",
                }}
              >
                Top Status: {topStatus.label}
              </div>
            ) : null}

            {bestConversionStatus ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(34,197,94,0.10)",
                  color: "#15803d",
                }}
              >
                Best Conv: {bestConversionStatus.label}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div
        style={{
          ...chartAreaStyle,
          position: "relative",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={donutInnerRadius}
              outerRadius={128}
              paddingAngle={3}
              cornerRadius={10}
              stroke="#ffffff"
              strokeWidth={3}
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                fontSize: 12,
                color: "#475569",
                paddingTop: 14,
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <CenterLabel total={totalLeads} title="Total Leads" />
      </div>

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gap: 10,
        }}
      >
        {chartData.map((item) => (
          <div
            key={item.status}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              padding: "12px 14px",
              borderRadius: 16,
              border: "1px solid #E2E8F0",
              background: "#F8FAFC",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 4,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: item.color,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0F172A",
                  }}
                >
                  {item.label}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  fontSize: 12,
                  color: "#64748B",
                }}
              >
                <span>Leads: {item.count}</span>
                <span>•</span>
                <span>Qualified: {item.qualifiedCount}</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#334155",
                  background: "#ffffff",
                  border: "1px solid rgba(148,163,184,0.20)",
                }}
              >
                {item.count} Leads
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: item.conversionRate >= 50 ? "#15803d" : "#b45309",
                  background: "#ffffff",
                  border:
                    item.conversionRate >= 50
                      ? "1px solid rgba(34,197,94,0.18)"
                      : "1px solid rgba(245,158,11,0.18)",
                }}
              >
                {formatPercent(item.conversionRate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}