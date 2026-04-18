// src/components/analytics/charts/revenue/TargetVsAchievementChart.tsx

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
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TargetVsAchievementDatum = {
  period: string;
  targetRevenue: number;
  achievedRevenue: number;
  deals?: number;
  shortfall?: number;
};

type TargetVsAchievementChartProps = {
  title?: string;
  subtitle?: string;
  data?: TargetVsAchievementDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = TargetVsAchievementDatum & {
  deals: number;
  shortfall: number;
  variance: number;
  achievementRate: number;
  compactAchievementLabel: string;
  compactTargetLabel: string;
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

const defaultData: TargetVsAchievementDatum[] = [
  { period: "Jan", targetRevenue: 17500000, achievedRevenue: 18200000, deals: 12 },
  { period: "Feb", targetRevenue: 18800000, achievedRevenue: 17600000, deals: 11 },
  { period: "Mar", targetRevenue: 21000000, achievedRevenue: 22400000, deals: 14 },
  { period: "Apr", targetRevenue: 22600000, achievedRevenue: 21800000, deals: 13 },
  { period: "May", targetRevenue: 25000000, achievedRevenue: 26700000, deals: 16 },
  { period: "Jun", targetRevenue: 27800000, achievedRevenue: 29400000, deals: 17 },
];

const BAR_COLORS = {
  target: "#c4b5fd",
  achievedPositive: "#2563eb",
  achievedNegative: "#f59e0b",
  rate: "#16a34a",
};

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

function buildChartData(data: TargetVsAchievementDatum[]): ChartRow[] {
  return data.map((item) => {
    const deals = item.deals ?? 0;
    const variance = item.achievedRevenue - item.targetRevenue;
    const shortfall =
      item.shortfall ?? (variance < 0 ? Math.abs(variance) : 0);
    const achievementRate =
      item.targetRevenue > 0
        ? Number(((item.achievedRevenue / item.targetRevenue) * 100).toFixed(1))
        : 0;

    return {
      ...item,
      deals,
      shortfall,
      variance,
      achievementRate,
      compactAchievementLabel: formatCompactCurrency(item.achievedRevenue),
      compactTargetLabel: formatCompactCurrency(item.targetRevenue),
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
        <span style={{ color: "#64748b" }}>Target Revenue</span>
        <span style={{ color: "#7c3aed", fontWeight: 700 }}>
          {formatCurrency(row.targetRevenue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Achieved Revenue</span>
        <span style={{ color: "#2563eb", fontWeight: 700 }}>
          {formatCurrency(row.achievedRevenue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Variance</span>
        <span
          style={{
            color: row.variance >= 0 ? "#15803d" : "#b91c1c",
            fontWeight: 700,
          }}
        >
          {formatCurrency(row.variance, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Achievement Rate</span>
        <span
          style={{
            color: row.achievementRate >= 100 ? "#15803d" : "#b45309",
            fontWeight: 700,
          }}
        >
          {formatPercent(row.achievementRate)}
        </span>

        <span style={{ color: "#64748b" }}>Deals Closed</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>{row.deals}</span>

        <span style={{ color: "#64748b" }}>Shortfall</span>
        <span style={{ color: "#dc2626", fontWeight: 700 }}>
          {formatCurrency(row.shortfall, currency)}
        </span>
      </div>
    </div>
  );
}

export default function TargetVsAchievementChart({
  title = "Target vs Achievement",
  subtitle = "Compare planned revenue against achieved revenue, variance, and target attainment over time",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No target versus achievement data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: TargetVsAchievementChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalTarget = useMemo(
    () => chartData.reduce((sum, item) => sum + item.targetRevenue, 0),
    [chartData]
  );

  const totalAchieved = useMemo(
    () => chartData.reduce((sum, item) => sum + item.achievedRevenue, 0),
    [chartData]
  );

  const totalDeals = useMemo(
    () => chartData.reduce((sum, item) => sum + item.deals, 0),
    [chartData]
  );

  const totalVariance = useMemo(
    () => totalAchieved - totalTarget,
    [totalAchieved, totalTarget]
  );

  const averageAchievementRate = useMemo(() => {
    if (!chartData.length) return 0;

    return Number(
      (
        chartData.reduce((sum, item) => sum + item.achievementRate, 0) /
        chartData.length
      ).toFixed(1)
    );
  }, [chartData]);

  const bestPeriod = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.achievementRate - a.achievementRate)[0] ?? null;
  }, [chartData]);

  const weakestPeriod = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => a.achievementRate - b.achievementRate)[0] ?? null;
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
          <p style={emptyTitleStyle}>No target vs achievement data</p>
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
                background: "rgba(124,58,237,0.10)",
                color: "#6d28d9",
              }}
            >
              Target: {formatCompactCurrency(totalTarget)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(37,99,235,0.10)",
                color: "#1d4ed8",
              }}
            >
              Achieved: {formatCompactCurrency(totalAchieved)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: totalVariance >= 0 ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
                color: totalVariance >= 0 ? "#15803d" : "#b91c1c",
              }}
            >
              Variance: {formatCompactCurrency(totalVariance)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(14,165,233,0.10)",
                color: "#0369a1",
              }}
            >
              Achievement: {formatPercent(averageAchievementRate)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(245,158,11,0.10)",
                color: "#b45309",
              }}
            >
              Deals: {formatCompactNumber(totalDeals)}
            </div>

            {bestPeriod ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(34,197,94,0.10)",
                  color: "#15803d",
                }}
              >
                Best: {bestPeriod.period}
              </div>
            ) : null}

            {weakestPeriod ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(239,68,68,0.10)",
                  color: "#b91c1c",
                }}
              >
                Weakest: {weakestPeriod.period}
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

            <ReferenceLine
              yAxisId="percent"
              y={100}
              stroke="rgba(245,158,11,0.9)"
              strokeDasharray="4 4"
            />

            <Bar
              yAxisId="revenue"
              dataKey="targetRevenue"
              name="Target Revenue"
              radius={[10, 10, 0, 0]}
              maxBarSize={40}
              fill={BAR_COLORS.target}
            >
              <LabelList
                dataKey="compactTargetLabel"
                position="top"
                style={{
                  fill: "#64748b",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
            </Bar>

            <Bar
              yAxisId="revenue"
              dataKey="achievedRevenue"
              name="Achieved Revenue"
              radius={[10, 10, 0, 0]}
              maxBarSize={28}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`achieved-${entry.period}`}
                  fill={
                    entry.achievementRate >= 100
                      ? BAR_COLORS.achievedPositive
                      : BAR_COLORS.achievedNegative
                  }
                />
              ))}

              <LabelList
                dataKey="compactAchievementLabel"
                position="top"
                style={{
                  fill: "#0f172a",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
            </Bar>

            <Line
              yAxisId="percent"
              type="monotone"
              dataKey="achievementRate"
              name="Achievement Rate"
              stroke={BAR_COLORS.rate}
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
                    background:
                      item.achievementRate >= 100
                        ? BAR_COLORS.achievedPositive
                        : BAR_COLORS.achievedNegative,
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
                <span>Target: {formatCompactCurrency(item.targetRevenue)}</span>
                <span>•</span>
                <span>Achieved: {formatCompactCurrency(item.achievedRevenue)}</span>
                <span>•</span>
                <span>Deals: {item.deals}</span>
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
                  color: item.variance >= 0 ? "#15803d" : "#b91c1c",
                  background: "#ffffff",
                  border:
                    item.variance >= 0
                      ? "1px solid rgba(34,197,94,0.18)"
                      : "1px solid rgba(239,68,68,0.18)",
                }}
              >
                Var {formatCompactCurrency(item.variance)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}