// src/components/analytics/charts/lead/LeadsTrendChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type LeadsTrendDatum = {
  period: string;
  totalLeads: number;
  qualifiedLeads?: number;
  convertedLeads?: number;
  conversionRate?: number;
};

type LeadsTrendChartProps = {
  title?: string;
  subtitle?: string;
  data?: LeadsTrendDatum[];
  height?: number;
  loading?: boolean;
  showLegend?: boolean;
  emptyMessage?: string;
};

type ChartRow = LeadsTrendDatum & {
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

const DEFAULT_HEIGHT = 420;

const defaultData: LeadsTrendDatum[] = [
  {
    period: "Jan",
    totalLeads: 120,
    qualifiedLeads: 66,
    convertedLeads: 18,
    conversionRate: 15,
  },
  {
    period: "Feb",
    totalLeads: 136,
    qualifiedLeads: 74,
    convertedLeads: 21,
    conversionRate: 15.4,
  },
  {
    period: "Mar",
    totalLeads: 148,
    qualifiedLeads: 82,
    convertedLeads: 24,
    conversionRate: 16.2,
  },
  {
    period: "Apr",
    totalLeads: 165,
    qualifiedLeads: 95,
    convertedLeads: 28,
    conversionRate: 17,
  },
  {
    period: "May",
    totalLeads: 154,
    qualifiedLeads: 88,
    convertedLeads: 26,
    conversionRate: 16.9,
  },
  {
    period: "Jun",
    totalLeads: 182,
    qualifiedLeads: 108,
    convertedLeads: 33,
    conversionRate: 18.1,
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
  background: "rgba(37,99,235,0.10)",
  color: "#1d4ed8",
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

function buildChartData(data: LeadsTrendDatum[]): ChartRow[] {
  return data.map((item) => {
    const qualifiedLeads =
      item.qualifiedLeads ?? Math.round(item.totalLeads * 0.55);

    const convertedLeads =
      item.convertedLeads ?? Math.round(item.totalLeads * 0.16);

    const conversionRate =
      item.conversionRate ??
      (item.totalLeads > 0
        ? Number(((convertedLeads / item.totalLeads) * 100).toFixed(1))
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
        minWidth: 230,
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
        {String(label ?? row.period)}
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
          {row.totalLeads}
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

export default function LeadsTrendChart({
  title = "Leads Trend",
  subtitle = "Track total leads, qualified leads, and conversion performance over time",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  showLegend = true,
  emptyMessage = "No lead trend data available right now.",
}: LeadsTrendChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const latestLeads = useMemo(() => {
    if (!chartData.length) return 0;
    return chartData[chartData.length - 1]?.totalLeads ?? 0;
  }, [chartData]);

  const avgConversion = useMemo(() => {
    if (!chartData.length) return 0;
    return Number(
      (
        chartData.reduce((sum, item) => sum + item.conversionRate, 0) /
        chartData.length
      ).toFixed(1)
    );
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
          <p style={emptyTitleStyle}>No trend data</p>
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

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <div style={badgeStyle}>Latest Leads: {latestLeads}</div>
          <div
            style={{
              ...badgeStyle,
              background: "rgba(34,197,94,0.10)",
              color: "#15803d",
            }}
          >
            Avg Conv: {formatPercent(avgConversion)}
          </div>
        </div>
      </div>

      <div style={chartAreaStyle}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="totalLeadsFillTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
              </linearGradient>

              <linearGradient id="qualifiedLeadsFillTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.22)"
              vertical={false}
            />

            <XAxis
              dataKey="period"
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

            {showLegend ? (
              <Legend
                wrapperStyle={{
                  fontSize: 12,
                  color: "#334155",
                  paddingTop: 8,
                }}
              />
            ) : null}

            <Area
              yAxisId="count"
              type="monotone"
              dataKey="totalLeads"
              name="Total Leads"
              stroke="#2563eb"
              strokeWidth={2.5}
              fill="url(#totalLeadsFillTrend)"
              activeDot={{ r: 5 }}
            />

            <Area
              yAxisId="count"
              type="monotone"
              dataKey="qualifiedLeads"
              name="Qualified Leads"
              stroke="#10b981"
              strokeWidth={2.3}
              fill="url(#qualifiedLeadsFillTrend)"
              activeDot={{ r: 4 }}
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
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}