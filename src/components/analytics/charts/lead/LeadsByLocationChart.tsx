// src/components/analytics/charts/lead/LeadsByLocationChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LabelProps } from "recharts";

type LeadsByLocationDatum = {
  location: string;
  leads: number;
  qualifiedLeads?: number;
  conversionRate?: number;
  averageBudget?: number;
};

type LeadsByLocationChartProps = {
  title?: string;
  subtitle?: string;
  data?: LeadsByLocationDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = LeadsByLocationDatum & {
  qualifiedLeads: number;
  conversionRate: number;
  averageBudget: number;
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
const DEFAULT_CURRENCY = "INR";

const defaultData: LeadsByLocationDatum[] = [
  {
    location: "Whitefield",
    leads: 58,
    qualifiedLeads: 27,
    conversionRate: 46.6,
    averageBudget: 8200000,
  },
  {
    location: "Sarjapur",
    leads: 64,
    qualifiedLeads: 31,
    conversionRate: 48.4,
    averageBudget: 9100000,
  },
  {
    location: "HSR Layout",
    leads: 41,
    qualifiedLeads: 19,
    conversionRate: 46.3,
    averageBudget: 7600000,
  },
  {
    location: "Electronic City",
    leads: 36,
    qualifiedLeads: 14,
    conversionRate: 38.9,
    averageBudget: 5400000,
  },
  {
    location: "Hebbal",
    leads: 33,
    qualifiedLeads: 18,
    conversionRate: 54.5,
    averageBudget: 11200000,
  },
  {
    location: "Devanahalli",
    leads: 29,
    qualifiedLeads: 13,
    conversionRate: 44.8,
    averageBudget: 6800000,
  },
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
  background: "rgba(14,165,233,0.10)",
  color: "#0369a1",
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

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 10000000) {
    return `${(value / 10000000).toFixed(1)} Cr`;
  }

  if (abs >= 100000) {
    return `${(value / 100000).toFixed(1)} L`;
  }

  if (abs >= 1000) {
    return `${(value / 1000).toFixed(1)} K`;
  }

  return `${value}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function getLocationBarColor(leads: number): string {
  if (leads >= 60) return "#2563eb";
  if (leads >= 45) return "#0ea5e9";
  if (leads >= 30) return "#38bdf8";
  return "#7dd3fc";
}

function buildChartData(data: LeadsByLocationDatum[]): ChartRow[] {
  return data.map((item) => {
    const qualifiedLeads =
      item.qualifiedLeads ?? Math.round(item.leads * 0.42);

    const conversionRate =
      item.conversionRate ??
      (item.leads > 0
        ? Number(((qualifiedLeads / item.leads) * 100).toFixed(1))
        : 0);

    const averageBudget = item.averageBudget ?? 0;

    return {
      ...item,
      qualifiedLeads,
      conversionRate,
      averageBudget,
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
        minWidth: 240,
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
        {String(label ?? row.location)}
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
        <span style={{ color: "#64748b" }}>Total Leads</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.leads}
        </span>

        <span style={{ color: "#64748b" }}>Qualified Leads</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.qualifiedLeads}
        </span>

        <span style={{ color: "#64748b" }}>Conversion Rate</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.conversionRate)}
        </span>

        <span style={{ color: "#64748b" }}>Avg Budget</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.averageBudget > 0 ? formatCompactCurrency(row.averageBudget) : "—"}
        </span>
      </div>
    </div>
  );
}

function LeadsValueLabel({ x, y, width, height, value }: LabelProps) {
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number" ||
    typeof value !== "number"
  ) {
    return null;
  }

  return (
    <text
      x={x + width + 8}
      y={y + height / 2}
      fill="#334155"
      fontSize={12}
      fontWeight={700}
      dominantBaseline="middle"
    >
      {value}
    </text>
  );
}

export default function LeadsByLocationChart({
  title = "Leads by Location",
  subtitle = "See which locations are bringing the most lead volume and stronger conversion quality",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No location-wise lead data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: LeadsByLocationChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalLeads = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.leads, 0);
  }, [chartData]);

  const topLocation = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.leads - a.leads)[0] ?? null;
  }, [chartData]);

  const bestConversionLocation = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.conversionRate - a.conversionRate)[0] ?? null;
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
          <p style={emptyTitleStyle}>No location data</p>
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

            {topLocation ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(37,99,235,0.10)",
                  color: "#1d4ed8",
                }}
              >
                Top Volume: {topLocation.location}
              </div>
            ) : null}

            {bestConversionLocation ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(34,197,94,0.10)",
                  color: "#15803d",
                }}
              >
                Best Conv: {bestConversionLocation.location}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div style={chartAreaStyle}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 28, left: 12, bottom: 8 }}
            barCategoryGap={14}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.22)"
              vertical={false}
            />

            <XAxis
              type="number"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              type="category"
              dataKey="location"
              width={110}
              tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey="leads" radius={[0, 10, 10, 0]} name="Leads">
              {chartData.map((entry) => (
                <Cell key={entry.location} fill={getLocationBarColor(entry.leads)} />
              ))}

              <LabelList
                dataKey="leads"
                position="right"
                content={(props: LabelProps) => <LeadsValueLabel {...props} />}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
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
            key={item.location}
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
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0F172A",
                  marginBottom: 4,
                }}
              >
                {item.location}
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
                <span>Leads: {item.leads}</span>
                <span>•</span>
                <span>Qualified: {item.qualifiedLeads}</span>
                <span>•</span>
                <span>Avg Budget: {formatCurrency(item.averageBudget, currency)}</span>
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
                  color: "#0369a1",
                  background: "#ffffff",
                  border: "1px solid rgba(14,165,233,0.18)",
                }}
              >
                {item.leads} Leads
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#15803d",
                  background: "#ffffff",
                  border: "1px solid rgba(34,197,94,0.18)",
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