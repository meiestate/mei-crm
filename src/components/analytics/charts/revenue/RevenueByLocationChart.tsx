// src/components/analytics/charts/revenue/RevenueByLocationChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenueByLocationDatum = {
  location: string;
  revenue: number;
  deals: number;
  targetRevenue?: number;
  averageDealSize?: number;
  growthRate?: number;
};

type RevenueByLocationChartProps = {
  title?: string;
  subtitle?: string;
  data?: RevenueByLocationDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = RevenueByLocationDatum & {
  targetRevenue: number;
  averageDealSize: number;
  growthRate: number;
  achievementRate: number;
  compactRevenueLabel: string;
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

const DEFAULT_HEIGHT = 520;
const DEFAULT_CURRENCY = "INR";

const defaultData: RevenueByLocationDatum[] = [
  {
    location: "Bangalore East",
    revenue: 32400000,
    deals: 18,
    targetRevenue: 29500000,
    averageDealSize: 1800000,
    growthRate: 18.4,
  },
  {
    location: "Bangalore North",
    revenue: 27600000,
    deals: 15,
    targetRevenue: 25500000,
    averageDealSize: 1840000,
    growthRate: 14.2,
  },
  {
    location: "Bangalore South",
    revenue: 23800000,
    deals: 13,
    targetRevenue: 22800000,
    averageDealSize: 1830000,
    growthRate: 10.8,
  },
  {
    location: "Whitefield",
    revenue: 21400000,
    deals: 11,
    targetRevenue: 20500000,
    averageDealSize: 1945000,
    growthRate: 16.1,
  },
  {
    location: "Sarjapur",
    revenue: 19800000,
    deals: 10,
    targetRevenue: 19000000,
    averageDealSize: 1980000,
    growthRate: 12.6,
  },
  {
    location: "HSR Layout",
    revenue: 17200000,
    deals: 9,
    targetRevenue: 18000000,
    averageDealSize: 1910000,
    growthRate: 8.7,
  },
];

const BAR_COLORS = ["#2563eb", "#0ea5e9", "#14b8a6", "#22c55e", "#8b5cf6", "#f59e0b", "#ef4444"];

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
  background: "rgba(59,130,246,0.10)",
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const chartAreaStyle: CSSProperties = {
  flex: 1,
  minHeight: 350,
};

const loadingWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 350,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  fontSize: 14,
  fontWeight: 600,
};

const emptyWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 350,
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

function formatCompactNumber(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
  if (abs >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `${(value / 1000).toFixed(1)}K`;

  return `${value}`;
}

function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`;
  if (abs >= 100000) return `${(value / 100000).toFixed(1)} L`;
  if (abs >= 1000) return `${(value / 1000).toFixed(1)} K`;

  return `${value}`;
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function buildChartData(data: RevenueByLocationDatum[]): ChartRow[] {
  return data.map((item) => {
    const targetRevenue = item.targetRevenue ?? item.revenue;
    const averageDealSize =
      item.averageDealSize ?? (item.deals > 0 ? Number((item.revenue / item.deals).toFixed(0)) : 0);
    const growthRate = item.growthRate ?? 0;
    const achievementRate =
      targetRevenue > 0 ? Number(((item.revenue / targetRevenue) * 100).toFixed(1)) : 0;

    return {
      ...item,
      targetRevenue,
      averageDealSize,
      growthRate,
      achievementRate,
      compactRevenueLabel: formatCompactCurrency(item.revenue),
    };
  });
}

function getTooltipRow(payload?: TooltipPayloadItem[]): ChartRow | null {
  if (!payload || payload.length === 0) return null;

  const item = payload.find((entry) => entry?.payload);
  return item?.payload ?? null;
}

function CustomTooltip({ active, payload, label, currency }: CustomTooltipProps) {
  if (!active) return null;

  const row = getTooltipRow(payload);
  if (!row) return null;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(148,163,184,0.24)",
        borderRadius: 16,
        boxShadow: "0 14px 40px rgba(15,23,42,0.14)",
        padding: 14,
        minWidth: 290,
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
        <span style={{ color: "#64748b" }}>Revenue</span>
        <span style={{ color: "#2563eb", fontWeight: 700 }}>
          {formatCurrency(row.revenue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Target Revenue</span>
        <span style={{ color: "#7c3aed", fontWeight: 700 }}>
          {formatCurrency(row.targetRevenue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Deals Closed</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>{row.deals}</span>

        <span style={{ color: "#64748b" }}>Avg Deal Size</span>
        <span style={{ color: "#16a34a", fontWeight: 700 }}>
          {formatCurrency(row.averageDealSize, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Achievement</span>
        <span
          style={{
            color: row.achievementRate >= 100 ? "#15803d" : "#b45309",
            fontWeight: 700,
          }}
        >
          {formatPercent(row.achievementRate)}
        </span>

        <span style={{ color: "#64748b" }}>Growth Rate</span>
        <span
          style={{
            color: row.growthRate >= 0 ? "#1d4ed8" : "#b91c1c",
            fontWeight: 700,
          }}
        >
          {formatPercent(row.growthRate)}
        </span>
      </div>
    </div>
  );
}

export default function RevenueByLocationChart({
  title = "Revenue by Location",
  subtitle = "Compare location-wise revenue contribution, target achievement, and market growth momentum",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No location revenue data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: RevenueByLocationChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalRevenue = useMemo(
    () => chartData.reduce((sum, item) => sum + item.revenue, 0),
    [chartData]
  );

  const totalDeals = useMemo(
    () => chartData.reduce((sum, item) => sum + item.deals, 0),
    [chartData]
  );

  const averageGrowthRate = useMemo(() => {
    if (!chartData.length) return 0;

    return Number(
      (chartData.reduce((sum, item) => sum + item.growthRate, 0) / chartData.length).toFixed(1)
    );
  }, [chartData]);

  const topLocation = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.revenue - a.revenue)[0] ?? null;
  }, [chartData]);

  const bestGrowthLocation = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.growthRate - a.growthRate)[0] ?? null;
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
          <p style={emptyTitleStyle}>No location revenue data</p>
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
                background: "rgba(37,99,235,0.10)",
                color: "#1d4ed8",
              }}
            >
              Revenue: {formatCompactCurrency(totalRevenue)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(34,197,94,0.10)",
                color: "#15803d",
              }}
            >
              Deals: {formatCompactNumber(totalDeals)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(14,165,233,0.10)",
                color: "#0369a1",
              }}
            >
              Avg Growth: {formatPercent(averageGrowthRate)}
            </div>

            {topLocation ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(124,58,237,0.10)",
                  color: "#6d28d9",
                }}
              >
                Top Market: {topLocation.location}
              </div>
            ) : null}

            {bestGrowthLocation ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(245,158,11,0.10)",
                  color: "#b45309",
                }}
              >
                Fastest Growth: {bestGrowthLocation.location}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div style={chartAreaStyle}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 16, right: 20, left: 0, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.22)"
              vertical={false}
            />

            <XAxis
              dataKey="location"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              yAxisId="revenue"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={58}
              tickFormatter={(value: number | string) =>
                typeof value === "number" ? formatCompactCurrency(value) : `${value}`
              }
            />

            <YAxis
              yAxisId="percent"
              orientation="right"
              domain={[0, 140]}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={46}
              tickFormatter={(value: number | string) => `${value}%`}
            />

            <Tooltip content={<CustomTooltip currency={currency} />} />

            <Legend
              wrapperStyle={{
                fontSize: 12,
                color: "#334155",
                paddingTop: 8,
              }}
            />

            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              name="Revenue"
              radius={[10, 10, 0, 0]}
              maxBarSize={44}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`revenue-${entry.location}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}

              <LabelList
                dataKey="compactRevenueLabel"
                position="top"
                style={{
                  fill: "#334155",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            </Bar>

            <Bar
              yAxisId="revenue"
              dataKey="targetRevenue"
              name="Target Revenue"
              radius={[10, 10, 0, 0]}
              maxBarSize={24}
              fill="#c4b5fd"
            />

            <Line
              yAxisId="percent"
              type="monotone"
              dataKey="achievementRate"
              name="Achievement Rate"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              yAxisId="percent"
              type="monotone"
              dataKey="growthRate"
              name="Growth Rate"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
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
        {chartData.map((item, index) => (
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
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: BAR_COLORS[index % BAR_COLORS.length],
                    display: "inline-block",
                  }}
                />
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0F172A",
                  }}
                >
                  {item.location}
                </div>
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
                <span>Revenue: {formatCompactCurrency(item.revenue)}</span>
                <span>•</span>
                <span>Deals: {item.deals}</span>
                <span>•</span>
                <span>Avg Size: {formatCompactCurrency(item.averageDealSize)}</span>
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
                  color: item.achievementRate >= 100 ? "#15803d" : "#b45309",
                  background: "#ffffff",
                  border:
                    item.achievementRate >= 100
                      ? "1px solid rgba(34,197,94,0.18)"
                      : "1px solid rgba(245,158,11,0.18)",
                }}
              >
                {formatPercent(item.achievementRate)}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: item.growthRate >= 0 ? "#1d4ed8" : "#b91c1c",
                  background: "#ffffff",
                  border:
                    item.growthRate >= 0
                      ? "1px solid rgba(37,99,235,0.18)"
                      : "1px solid rgba(239,68,68,0.18)",
                }}
              >
                Growth {formatPercent(item.growthRate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}