// src/components/analytics/charts/deals/WonVsLostDealsChart.tsx

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

type WonVsLostDealsDatum = {
  period: string;
  wonDeals: number;
  lostDeals: number;
  totalValue?: number;
  winRate?: number;
};

type WonVsLostDealsChartProps = {
  title?: string;
  subtitle?: string;
  data?: WonVsLostDealsDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = WonVsLostDealsDatum & {
  totalValue: number;
  winRate: number;
  totalDeals: number;
  lossRate: number;
  compactValueLabel: string;
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

const defaultData: WonVsLostDealsDatum[] = [
  { period: "Jan", wonDeals: 14, lostDeals: 6, totalValue: 18400000 },
  { period: "Feb", wonDeals: 12, lostDeals: 7, totalValue: 17200000 },
  { period: "Mar", wonDeals: 18, lostDeals: 5, totalValue: 22600000 },
  { period: "Apr", wonDeals: 16, lostDeals: 8, totalValue: 21400000 },
  { period: "May", wonDeals: 20, lostDeals: 6, totalValue: 25800000 },
  { period: "Jun", wonDeals: 22, lostDeals: 4, totalValue: 28600000 },
];

const COLORS = {
  won: "#16a34a",
  lost: "#ef4444",
  winRate: "#2563eb",
  value: "#7c3aed",
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

function buildChartData(data: WonVsLostDealsDatum[]): ChartRow[] {
  return data.map((item) => {
    const totalDeals = item.wonDeals + item.lostDeals;
    const winRate =
      item.winRate ??
      (totalDeals > 0 ? Number(((item.wonDeals / totalDeals) * 100).toFixed(1)) : 0);
    const lossRate = totalDeals > 0 ? Number(((item.lostDeals / totalDeals) * 100).toFixed(1)) : 0;
    const totalValue = item.totalValue ?? 0;

    return {
      ...item,
      totalValue,
      winRate,
      totalDeals,
      lossRate,
      compactValueLabel: formatCompactCurrency(totalValue),
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
        minWidth: 280,
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
        <span style={{ color: "#64748b" }}>Won Deals</span>
        <span style={{ color: COLORS.won, fontWeight: 700 }}>{row.wonDeals}</span>

        <span style={{ color: "#64748b" }}>Lost Deals</span>
        <span style={{ color: COLORS.lost, fontWeight: 700 }}>{row.lostDeals}</span>

        <span style={{ color: "#64748b" }}>Total Deals</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>{row.totalDeals}</span>

        <span style={{ color: "#64748b" }}>Win Rate</span>
        <span style={{ color: COLORS.winRate, fontWeight: 700 }}>
          {formatPercent(row.winRate)}
        </span>

        <span style={{ color: "#64748b" }}>Loss Rate</span>
        <span style={{ color: COLORS.lost, fontWeight: 700 }}>
          {formatPercent(row.lossRate)}
        </span>

        <span style={{ color: "#64748b" }}>Closed Value</span>
        <span style={{ color: COLORS.value, fontWeight: 700 }}>
          {formatCurrency(row.totalValue, currency)}
        </span>
      </div>
    </div>
  );
}

export default function WonVsLostDealsChart({
  title = "Won vs Lost Deals",
  subtitle = "Compare won deals, lost deals, win rate, and closed value trend across periods",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No won versus lost deals data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: WonVsLostDealsChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalWon = useMemo(
    () => chartData.reduce((sum, item) => sum + item.wonDeals, 0),
    [chartData]
  );

  const totalLost = useMemo(
    () => chartData.reduce((sum, item) => sum + item.lostDeals, 0),
    [chartData]
  );

  const totalValue = useMemo(
    () => chartData.reduce((sum, item) => sum + item.totalValue, 0),
    [chartData]
  );

  const averageWinRate = useMemo(() => {
    if (!chartData.length) return 0;

    return Number(
      (chartData.reduce((sum, item) => sum + item.winRate, 0) / chartData.length).toFixed(1)
    );
  }, [chartData]);

  const bestPeriod = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.winRate - a.winRate)[0] ?? null;
  }, [chartData]);

  const highestValuePeriod = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.totalValue - a.totalValue)[0] ?? null;
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
          <p style={emptyTitleStyle}>No won vs lost deal data</p>
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
                background: "rgba(34,197,94,0.10)",
                color: "#15803d",
              }}
            >
              Won: {formatCompactNumber(totalWon)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(239,68,68,0.10)",
                color: "#b91c1c",
              }}
            >
              Lost: {formatCompactNumber(totalLost)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(37,99,235,0.10)",
                color: "#1d4ed8",
              }}
            >
              Win Rate: {formatPercent(averageWinRate)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(124,58,237,0.10)",
                color: "#6d28d9",
              }}
            >
              Value: {formatCompactCurrency(totalValue)}
            </div>

            {bestPeriod ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(16,185,129,0.10)",
                  color: "#047857",
                }}
              >
                Best Win Rate: {bestPeriod.period}
              </div>
            ) : null}

            {highestValuePeriod ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(245,158,11,0.10)",
                  color: "#b45309",
                }}
              >
                Peak Value: {highestValuePeriod.period}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div style={chartAreaStyle}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 18, right: 20, left: 0, bottom: 8 }}
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
              yAxisId="count"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={46}
            />

            <YAxis
              yAxisId="percent"
              orientation="right"
              domain={[0, 100]}
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
              y={50}
              stroke="rgba(148,163,184,0.7)"
              strokeDasharray="4 4"
            />

            <Bar
              yAxisId="count"
              dataKey="wonDeals"
              name="Won Deals"
              radius={[10, 10, 0, 0]}
              maxBarSize={30}
            >
              {chartData.map((entry) => (
                <Cell key={`won-${entry.period}`} fill={COLORS.won} />
              ))}

              <LabelList
                dataKey="wonDeals"
                position="top"
                style={{
                  fill: COLORS.won,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
            </Bar>

            <Bar
              yAxisId="count"
              dataKey="lostDeals"
              name="Lost Deals"
              radius={[10, 10, 0, 0]}
              maxBarSize={30}
            >
              {chartData.map((entry) => (
                <Cell key={`lost-${entry.period}`} fill={COLORS.lost} />
              ))}

              <LabelList
                dataKey="lostDeals"
                position="top"
                style={{
                  fill: COLORS.lost,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
            </Bar>

            <Line
              yAxisId="percent"
              type="monotone"
              dataKey="winRate"
              name="Win Rate"
              stroke={COLORS.winRate}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              yAxisId="count"
              type="monotone"
              dataKey="totalValue"
              name="Closed Value"
              stroke={COLORS.value}
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
                    background: item.winRate >= 60 ? COLORS.won : COLORS.lost,
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
                <span>Won: {item.wonDeals}</span>
                <span>•</span>
                <span>Lost: {item.lostDeals}</span>
                <span>•</span>
                <span>Value: {formatCompactCurrency(item.totalValue)}</span>
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
                  color: item.winRate >= 60 ? "#15803d" : "#b45309",
                  background: "#ffffff",
                  border:
                    item.winRate >= 60
                      ? "1px solid rgba(34,197,94,0.18)"
                      : "1px solid rgba(245,158,11,0.18)",
                }}
              >
                Win {formatPercent(item.winRate)}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#b91c1c",
                  background: "#ffffff",
                  border: "1px solid rgba(239,68,68,0.18)",
                }}
              >
                Loss {formatPercent(item.lossRate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}