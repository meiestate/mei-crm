// src/components/analytics/charts/revenue/AverageDealSizeChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AverageDealSizeDatum = {
  period: string;
  deals: number;
  revenue: number;
  averageDealSize?: number;
  targetAverageDealSize?: number;
};

type AverageDealSizeChartProps = {
  title?: string;
  subtitle?: string;
  data?: AverageDealSizeDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = AverageDealSizeDatum & {
  averageDealSize: number;
  targetAverageDealSize: number;
  achievementRate: number;
  compactAverageLabel: string;
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

const DEFAULT_HEIGHT = 500;
const DEFAULT_CURRENCY = "INR";

const defaultData: AverageDealSizeDatum[] = [
  { period: "Jan", deals: 12, revenue: 18600000, averageDealSize: 1550000, targetAverageDealSize: 1400000 },
  { period: "Feb", deals: 10, revenue: 16200000, averageDealSize: 1620000, targetAverageDealSize: 1450000 },
  { period: "Mar", deals: 14, revenue: 23800000, averageDealSize: 1700000, targetAverageDealSize: 1500000 },
  { period: "Apr", deals: 11, revenue: 19800000, averageDealSize: 1800000, targetAverageDealSize: 1550000 },
  { period: "May", deals: 16, revenue: 31200000, averageDealSize: 1950000, targetAverageDealSize: 1650000 },
  { period: "Jun", deals: 13, revenue: 27300000, averageDealSize: 2100000, targetAverageDealSize: 1750000 },
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
  background: "rgba(59,130,246,0.10)",
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const chartAreaStyle: CSSProperties = {
  flex: 1,
  minHeight: 340,
};

const loadingWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 340,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  fontSize: 14,
  fontWeight: 600,
};

const emptyWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 340,
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

function buildChartData(data: AverageDealSizeDatum[]): ChartRow[] {
  return data.map((item) => {
    const averageDealSize =
      item.averageDealSize ??
      (item.deals > 0 ? Number((item.revenue / item.deals).toFixed(0)) : 0);

    const targetAverageDealSize = item.targetAverageDealSize ?? averageDealSize;
    const achievementRate =
      targetAverageDealSize > 0
        ? Number(((averageDealSize / targetAverageDealSize) * 100).toFixed(1))
        : 0;

    return {
      ...item,
      averageDealSize,
      targetAverageDealSize,
      achievementRate,
      compactAverageLabel: formatCompactCurrency(averageDealSize),
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
        <span style={{ color: "#64748b" }}>Deals Closed</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>{row.deals}</span>

        <span style={{ color: "#64748b" }}>Revenue</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatCurrency(row.revenue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Average Deal Size</span>
        <span style={{ color: "#2563eb", fontWeight: 700 }}>
          {formatCurrency(row.averageDealSize, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Target Average</span>
        <span style={{ color: "#7c3aed", fontWeight: 700 }}>
          {formatCurrency(row.targetAverageDealSize, currency)}
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
      </div>
    </div>
  );
}

export default function AverageDealSizeChart({
  title = "Average Deal Size",
  subtitle = "Compare average ticket size against monthly revenue, closed deals, and target benchmark",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No average deal size data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: AverageDealSizeChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const overallAverageDealSize = useMemo(() => {
    if (!chartData.length) return 0;

    const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
    const totalDeals = chartData.reduce((sum, item) => sum + item.deals, 0);

    return totalDeals > 0 ? Number((totalRevenue / totalDeals).toFixed(0)) : 0;
  }, [chartData]);

  const totalRevenue = useMemo(
    () => chartData.reduce((sum, item) => sum + item.revenue, 0),
    [chartData]
  );

  const totalDeals = useMemo(
    () => chartData.reduce((sum, item) => sum + item.deals, 0),
    [chartData]
  );

  const bestAveragePeriod = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.averageDealSize - a.averageDealSize)[0] ?? null;
  }, [chartData]);

  const strongestAchievementPeriod = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.achievementRate - a.achievementRate)[0] ?? null;
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
          <p style={emptyTitleStyle}>No deal size data</p>
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
              Avg Size: {formatCompactCurrency(overallAverageDealSize)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(34,197,94,0.10)",
                color: "#15803d",
              }}
            >
              Revenue: {formatCompactCurrency(totalRevenue)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(14,165,233,0.10)",
                color: "#0369a1",
              }}
            >
              Deals: {formatCompactNumber(totalDeals)}
            </div>

            {bestAveragePeriod ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(124,58,237,0.10)",
                  color: "#6d28d9",
                }}
              >
                Best Size: {bestAveragePeriod.period}
              </div>
            ) : null}

            {strongestAchievementPeriod ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(245,158,11,0.10)",
                  color: "#b45309",
                }}
              >
                Best vs Target: {strongestAchievementPeriod.period}
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
            <defs>
              <linearGradient id="avgDealSizeArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.04} />
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
              yAxisId="revenue"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={(value: number | string) =>
                typeof value === "number" ? formatCompactCurrency(value) : `${value}`
              }
            />

            <YAxis
              yAxisId="average"
              orientation="right"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={(value: number | string) =>
                typeof value === "number" ? formatCompactCurrency(value) : `${value}`
              }
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
              maxBarSize={42}
              fill="#cbd5e1"
            />

            <Area
              yAxisId="average"
              type="monotone"
              dataKey="averageDealSize"
              name="Average Deal Size"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#avgDealSizeArea)"
            />

            <Bar
              yAxisId="average"
              dataKey="deals"
              name="Deals Closed"
              radius={[10, 10, 0, 0]}
              maxBarSize={26}
              fill="#86efac"
            >
              <LabelList
                dataKey="compactAverageLabel"
                position="top"
                style={{
                  fill: "#334155",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            </Bar>

            <Area
              yAxisId="average"
              type="monotone"
              dataKey="targetAverageDealSize"
              name="Target Average"
              stroke="#7c3aed"
              strokeWidth={2.5}
              fillOpacity={0}
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
            key={item.period}
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
                    background: "#2563eb",
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
                  {item.period}
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
                <span>Target: {formatCompactCurrency(item.targetAverageDealSize)}</span>
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
                  color: "#1d4ed8",
                  background: "#ffffff",
                  border: "1px solid rgba(37,99,235,0.18)",
                }}
              >
                Avg {formatCompactCurrency(item.averageDealSize)}
              </span>

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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}