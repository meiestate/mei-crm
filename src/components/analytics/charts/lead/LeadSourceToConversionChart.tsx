// src/components/analytics/charts/lead/LeadSourceToConversionChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Bar,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Cell,
} from "recharts";

type LeadSourceToConversionDatum = {
  source: string;
  leads: number;
  qualifiedLeads?: number;
  convertedLeads?: number;
  conversionRate?: number;
};

type LeadSourceToConversionChartProps = {
  title?: string;
  subtitle?: string;
  data?: LeadSourceToConversionDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  showSummary?: boolean;
};

type ChartRow = LeadSourceToConversionDatum & {
  qualifiedLeads: number;
  convertedLeads: number;
  conversionRate: number;
};

type TooltipPayloadItem = {
  payload?: ChartRow;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
};

const DEFAULT_HEIGHT = 440;

const defaultData: LeadSourceToConversionDatum[] = [
  {
    source: "Website",
    leads: 72,
    qualifiedLeads: 34,
    convertedLeads: 12,
    conversionRate: 16.7,
  },
  {
    source: "WhatsApp",
    leads: 58,
    qualifiedLeads: 28,
    convertedLeads: 11,
    conversionRate: 19.0,
  },
  {
    source: "Facebook Ads",
    leads: 66,
    qualifiedLeads: 24,
    convertedLeads: 8,
    conversionRate: 12.1,
  },
  {
    source: "Google Ads",
    leads: 49,
    qualifiedLeads: 22,
    convertedLeads: 9,
    conversionRate: 18.4,
  },
  {
    source: "Referral",
    leads: 31,
    qualifiedLeads: 18,
    convertedLeads: 10,
    conversionRate: 32.3,
  },
  {
    source: "Broker Network",
    leads: 27,
    qualifiedLeads: 15,
    convertedLeads: 7,
    conversionRate: 25.9,
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
  minHeight: 300,
};

const loadingWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 300,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  fontSize: 14,
  fontWeight: 600,
};

const emptyWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 300,
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

function getSourceBarColor(leads: number): string {
  if (leads >= 65) return "#2563eb";
  if (leads >= 50) return "#0ea5e9";
  if (leads >= 35) return "#38bdf8";
  return "#7dd3fc";
}

function buildChartData(data: LeadSourceToConversionDatum[]): ChartRow[] {
  return data.map((item) => {
    const qualifiedLeads =
      item.qualifiedLeads ?? Math.round(item.leads * 0.42);

    const convertedLeads =
      item.convertedLeads ?? Math.round(qualifiedLeads * 0.38);

    const conversionRate =
      item.conversionRate ??
      (item.leads > 0
        ? Number(((convertedLeads / item.leads) * 100).toFixed(1))
        : 0);

    return {
      ...item,
      qualifiedLeads,
      convertedLeads,
      conversionRate,
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
        {String(label ?? row.source)}
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

        <span style={{ color: "#64748b" }}>Converted Leads</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.convertedLeads}
        </span>

        <span style={{ color: "#64748b" }}>Conversion Rate</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.conversionRate)}
        </span>
      </div>
    </div>
  );
}

export default function LeadSourceToConversionChart({
  title = "Lead Source to Conversion",
  subtitle = "Compare lead generation channels from raw volume to closed conversions",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No source-to-conversion data available right now.",
  showSummary = true,
}: LeadSourceToConversionChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalLeads = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.leads, 0);
  }, [chartData]);

  const totalConverted = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.convertedLeads, 0);
  }, [chartData]);

  const bestSource = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.convertedLeads - a.convertedLeads)[0] ?? null;
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
          <p style={emptyTitleStyle}>No conversion data</p>
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
            <div
              style={{
                ...badgeStyle,
                background: "rgba(34,197,94,0.10)",
                color: "#15803d",
              }}
            >
              Converted: {totalConverted}
            </div>
            {bestSource ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(99,102,241,0.10)",
                  color: "#4338ca",
                }}
              >
                Best Source: {bestSource.source}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div style={chartAreaStyle}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.22)"
              vertical={false}
            />

            <XAxis
              dataKey="source"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              yAxisId="count"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={42}
            />

            <YAxis
              yAxisId="rate"
              orientation="right"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={52}
              domain={[0, 100]}
              tickFormatter={(value: number | string) => `${value}%`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{
                fontSize: 12,
                color: "#334155",
                paddingTop: 8,
              }}
            />

            <Bar
              yAxisId="count"
              dataKey="leads"
              name="Leads"
              radius={[8, 8, 0, 0]}
              maxBarSize={42}
            >
              {chartData.map((entry) => (
                <Cell key={`leads-${entry.source}`} fill={getSourceBarColor(entry.leads)} />
              ))}
            </Bar>

            <Bar
              yAxisId="count"
              dataKey="convertedLeads"
              name="Converted Leads"
              radius={[8, 8, 0, 0]}
              maxBarSize={28}
              fill="#10b981"
            />

            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="conversionRate"
              name="Conversion Rate"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
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
            key={item.source}
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
                {item.source}
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
                <span>Converted: {item.convertedLeads}</span>
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
                  color: "#0f766e",
                  background: "#ffffff",
                  border: "1px solid rgba(16,185,129,0.18)",
                }}
              >
                {item.convertedLeads} Converted
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: item.conversionRate >= 20 ? "#15803d" : "#b45309",
                  background: "#ffffff",
                  border:
                    item.conversionRate >= 20
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