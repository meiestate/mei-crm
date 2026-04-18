// src/components/analytics/charts/deals/AvgDealClosureTimeChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

type AvgDealClosureTimeDatum = {
  source: string;
  dealsClosed: number;
  avgDaysToClose: number;
  fastestDays?: number;
  slowestDays?: number;
  revenue?: number;
  winRate?: number;
};

type AvgDealClosureTimeChartProps = {
  title?: string;
  subtitle?: string;
  data?: AvgDealClosureTimeDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = AvgDealClosureTimeDatum & {
  fastestDays: number;
  slowestDays: number;
  revenue: number;
  winRate: number;
};

type TooltipPayloadItem = {
  payload?: ChartRow;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  currency: string;
};

const DEFAULT_HEIGHT = 480;
const DEFAULT_CURRENCY = "INR";

const defaultData: AvgDealClosureTimeDatum[] = [
  {
    source: "Meta Ads",
    dealsClosed: 24,
    avgDaysToClose: 18,
    fastestDays: 7,
    slowestDays: 39,
    revenue: 2860000,
    winRate: 18.8,
  },
  {
    source: "Google Search",
    dealsClosed: 27,
    avgDaysToClose: 16,
    fastestDays: 6,
    slowestDays: 34,
    revenue: 3720000,
    winRate: 23.3,
  },
  {
    source: "WhatsApp",
    dealsClosed: 22,
    avgDaysToClose: 12,
    fastestDays: 4,
    slowestDays: 28,
    revenue: 1820000,
    winRate: 23.4,
  },
  {
    source: "Referral",
    dealsClosed: 19,
    avgDaysToClose: 9,
    fastestDays: 3,
    slowestDays: 20,
    revenue: 1440000,
    winRate: 31.1,
  },
  {
    source: "Organic SEO",
    dealsClosed: 14,
    avgDaysToClose: 21,
    fastestDays: 8,
    slowestDays: 42,
    revenue: 1520000,
    winRate: 19.4,
  },
  {
    source: "Broker Network",
    dealsClosed: 15,
    avgDaysToClose: 11,
    fastestDays: 5,
    slowestDays: 25,
    revenue: 1320000,
    winRate: 30.6,
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
  minHeight: 320,
};

const loadingWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 320,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  fontSize: 14,
  fontWeight: 600,
};

const emptyWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 320,
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

function formatDays(value: number): string {
  return `${value.toFixed(0)}d`;
}

function getBarColor(avgDaysToClose: number): string {
  if (avgDaysToClose <= 10) return "#16a34a";
  if (avgDaysToClose <= 14) return "#22c55e";
  if (avgDaysToClose <= 18) return "#f59e0b";
  return "#ef4444";
}

function buildChartData(data: AvgDealClosureTimeDatum[]): ChartRow[] {
  return data.map((item) => {
    const fastestDays =
      item.fastestDays ?? Math.max(2, Math.round(item.avgDaysToClose * 0.4));

    const slowestDays =
      item.slowestDays ?? Math.max(fastestDays + 4, Math.round(item.avgDaysToClose * 2));

    const revenue =
      item.revenue ?? item.dealsClosed * 120000;

    const winRate =
      item.winRate ?? Number((Math.min(45, (item.dealsClosed / 90) * 100)).toFixed(1));

    return {
      ...item,
      fastestDays,
      slowestDays,
      revenue,
      winRate,
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

function CustomTooltip({
  active,
  payload,
  label,
  currency,
}: CustomTooltipProps) {
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
        minWidth: 270,
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
        <span style={{ color: "#64748b" }}>Deals Closed</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.dealsClosed}
        </span>

        <span style={{ color: "#64748b" }}>Avg Closure Time</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatDays(row.avgDaysToClose)}
        </span>

        <span style={{ color: "#64748b" }}>Fastest Deal</span>
        <span style={{ color: "#16a34a", fontWeight: 700 }}>
          {formatDays(row.fastestDays)}
        </span>

        <span style={{ color: "#64748b" }}>Slowest Deal</span>
        <span style={{ color: "#ef4444", fontWeight: 700 }}>
          {formatDays(row.slowestDays)}
        </span>

        <span style={{ color: "#64748b" }}>Revenue</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {formatCurrency(row.revenue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Win Rate</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.winRate)}
        </span>
      </div>
    </div>
  );
}

export default function AvgDealClosureTimeChart({
  title = "Average Deal Closure Time",
  subtitle = "Compare how quickly each lead source closes deals and how that speed connects to revenue output",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No deal closure time data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: AvgDealClosureTimeChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalDeals = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.dealsClosed, 0);
  }, [chartData]);

  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.revenue, 0);
  }, [chartData]);

  const avgClosureTime = useMemo(() => {
    if (!chartData.length) return 0;

    const weightedTotal = chartData.reduce(
      (sum, item) => sum + item.avgDaysToClose * item.dealsClosed,
      0
    );

    return totalDeals > 0 ? Number((weightedTotal / totalDeals).toFixed(1)) : 0;
  }, [chartData, totalDeals]);

  const fastestSource = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => a.avgDaysToClose - b.avgDaysToClose)[0] ?? null;
  }, [chartData]);

  const slowestSource = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.avgDaysToClose - a.avgDaysToClose)[0] ?? null;
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
          <p style={emptyTitleStyle}>No closure time data</p>
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
            <div
              style={{
                ...badgeStyle,
                background: "rgba(14,165,233,0.10)",
                color: "#0369a1",
              }}
            >
              Deals: {totalDeals}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(16,185,129,0.10)",
                color: "#047857",
              }}
            >
              Revenue: {formatCompactCurrency(totalRevenue)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(245,158,11,0.10)",
                color: "#b45309",
              }}
            >
              Avg Closure: {formatDays(avgClosureTime)}
            </div>

            {fastestSource ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(34,197,94,0.10)",
                  color: "#15803d",
                }}
              >
                Fastest: {fastestSource.source}
              </div>
            ) : null}

            {slowestSource ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(239,68,68,0.10)",
                  color: "#b91c1c",
                }}
              >
                Slowest: {slowestSource.source}
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
              yAxisId="days"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={(value: number | string) =>
                typeof value === "number" ? formatDays(value) : `${value}`
              }
            />

            <YAxis
              yAxisId="count"
              orientation="right"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={42}
            />

            <Tooltip content={<CustomTooltip currency={currency} />} />

            <Legend
              wrapperStyle={{
                fontSize: 12,
                color: "#334155",
                paddingTop: 8,
              }}
            />

            <ReferenceLine
              yAxisId="days"
              y={avgClosureTime}
              stroke="rgba(245,158,11,0.8)"
              strokeDasharray="4 4"
            />

            <Bar
              yAxisId="days"
              dataKey="avgDaysToClose"
              name="Avg Days to Close"
              radius={[8, 8, 0, 0]}
              maxBarSize={38}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`avg-days-${entry.source}`}
                  fill={getBarColor(entry.avgDaysToClose)}
                />
              ))}
            </Bar>

            <Line
              yAxisId="days"
              type="monotone"
              dataKey="fastestDays"
              name="Fastest Deal"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />

            <Line
              yAxisId="days"
              type="monotone"
              dataKey="slowestDays"
              name="Slowest Deal"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />

            <Line
              yAxisId="count"
              type="monotone"
              dataKey="dealsClosed"
              name="Deals Closed"
              stroke="#2563eb"
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
                <span>Deals: {item.dealsClosed}</span>
                <span>•</span>
                <span>Revenue: {formatCurrency(item.revenue, currency)}</span>
                <span>•</span>
                <span>Fastest: {formatDays(item.fastestDays)}</span>
                <span>•</span>
                <span>Slowest: {formatDays(item.slowestDays)}</span>
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
                  color:
                    item.avgDaysToClose <= avgClosureTime ? "#15803d" : "#b91c1c",
                  background: "#ffffff",
                  border:
                    item.avgDaysToClose <= avgClosureTime
                      ? "1px solid rgba(34,197,94,0.18)"
                      : "1px solid rgba(239,68,68,0.18)",
                }}
              >
                Avg {formatDays(item.avgDaysToClose)}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#1d4ed8",
                  background: "#ffffff",
                  border: "1px solid rgba(37,99,235,0.18)",
                }}
              >
                Win {formatPercent(item.winRate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}