// src/components/analytics/charts/lead/LeadQualificationTrendChart.tsx

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

type LeadQualificationTrendDatum = {
  period: string;
  totalLeads: number;
  qualifiedLeads: number;
  disqualifiedLeads: number;
  qualificationRate?: number;
};

type LeadQualificationTrendChartProps = {
  title?: string;
  subtitle?: string;
  data?: LeadQualificationTrendDatum[];
  height?: number;
  loading?: boolean;
  showLegend?: boolean;
  emptyMessage?: string;
};

type ChartRow = LeadQualificationTrendDatum & {
  qualificationRate: number;
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

const defaultData: LeadQualificationTrendDatum[] = [
  {
    period: "Jan",
    totalLeads: 120,
    qualifiedLeads: 68,
    disqualifiedLeads: 52,
  },
  {
    period: "Feb",
    totalLeads: 138,
    qualifiedLeads: 81,
    disqualifiedLeads: 57,
  },
  {
    period: "Mar",
    totalLeads: 152,
    qualifiedLeads: 93,
    disqualifiedLeads: 59,
  },
  {
    period: "Apr",
    totalLeads: 165,
    qualifiedLeads: 101,
    disqualifiedLeads: 64,
  },
  {
    period: "May",
    totalLeads: 149,
    qualifiedLeads: 95,
    disqualifiedLeads: 54,
  },
  {
    period: "Jun",
    totalLeads: 182,
    qualifiedLeads: 118,
    disqualifiedLeads: 64,
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

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function buildChartData(data: LeadQualificationTrendDatum[]): ChartRow[] {
  return data.map((item) => {
    const qualificationRate =
      item.qualificationRate ??
      (item.totalLeads > 0
        ? Number(((item.qualifiedLeads / item.totalLeads) * 100).toFixed(1))
        : 0);

    return {
      ...item,
      qualificationRate,
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

        <span style={{ color: "#64748b" }}>Qualified</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.qualifiedLeads}
        </span>

        <span style={{ color: "#64748b" }}>Disqualified</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.disqualifiedLeads}
        </span>

        <span style={{ color: "#64748b" }}>Qualification Rate</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.qualificationRate)}
        </span>
      </div>
    </div>
  );
}

export default function LeadQualificationTrendChart({
  title = "Lead Qualification Trend",
  subtitle = "Track how many incoming leads become qualified over time",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  showLegend = true,
  emptyMessage = "No qualification trend data available right now.",
}: LeadQualificationTrendChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const latestRate = useMemo(() => {
    if (!chartData.length) return 0;
    return chartData[chartData.length - 1]?.qualificationRate ?? 0;
  }, [chartData]);

  const avgRate = useMemo(() => {
    if (!chartData.length) return 0;
    return Number(
      (
        chartData.reduce((sum, item) => sum + item.qualificationRate, 0) /
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
          <p style={emptyTitleStyle}>No qualification trend data</p>
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
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          <div style={badgeStyle}>Latest: {formatPercent(latestRate)}</div>
          <div
            style={{
              ...badgeStyle,
              background: "rgba(34,197,94,0.10)",
              color: "#15803d",
            }}
          >
            Avg: {formatPercent(avgRate)}
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
              <linearGradient id="qualifiedFillLeadQualification" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.03} />
              </linearGradient>

              <linearGradient id="disqualifiedFillLeadQualification" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
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
              tickFormatter={(value: number | string) => `${value}%`}
              domain={[0, 100]}
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
              dataKey="qualifiedLeads"
              name="Qualified Leads"
              stroke="#16a34a"
              strokeWidth={2.5}
              fill="url(#qualifiedFillLeadQualification)"
              activeDot={{ r: 5 }}
            />

            <Area
              yAxisId="count"
              type="monotone"
              dataKey="disqualifiedLeads"
              name="Disqualified Leads"
              stroke="#dc2626"
              strokeWidth={2.2}
              fill="url(#disqualifiedFillLeadQualification)"
              activeDot={{ r: 4 }}
            />

            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="qualificationRate"
              name="Qualification Rate"
              stroke="#0ea5e9"
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