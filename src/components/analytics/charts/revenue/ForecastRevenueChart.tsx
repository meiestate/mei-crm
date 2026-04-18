// src/components/analytics/charts/revenue/ForecastRevenueChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ForecastRevenueDatum = {
  period: string;
  actualRevenue?: number;
  forecastRevenue: number;
  stretchRevenue?: number;
  pipelineCoverage?: number;
};

type ForecastRevenueChartProps = {
  title?: string;
  subtitle?: string;
  data?: ForecastRevenueDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = ForecastRevenueDatum & {
  actualRevenue: number;
  stretchRevenue: number;
  pipelineCoverage: number;
  variance: number;
  varianceRate: number;
  labelForecast: string;
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

const defaultData: ForecastRevenueDatum[] = [
  {
    period: "Jan",
    actualRevenue: 18200000,
    forecastRevenue: 17500000,
    stretchRevenue: 19500000,
    pipelineCoverage: 104,
  },
  {
    period: "Feb",
    actualRevenue: 16800000,
    forecastRevenue: 17200000,
    stretchRevenue: 18900000,
    pipelineCoverage: 97,
  },
  {
    period: "Mar",
    actualRevenue: 21400000,
    forecastRevenue: 20500000,
    stretchRevenue: 22800000,
    pipelineCoverage: 109,
  },
  {
    period: "Apr",
    actualRevenue: 23800000,
    forecastRevenue: 22500000,
    stretchRevenue: 24700000,
    pipelineCoverage: 113,
  },
  {
    period: "May",
    actualRevenue: 26400000,
    forecastRevenue: 24800000,
    stretchRevenue: 27600000,
    pipelineCoverage: 118,
  },
  {
    period: "Jun",
    actualRevenue: 28900000,
    forecastRevenue: 27200000,
    stretchRevenue: 30400000,
    pipelineCoverage: 121,
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

function buildChartData(data: ForecastRevenueDatum[]): ChartRow[] {
  return data.map((item) => {
    const actualRevenue = item.actualRevenue ?? 0;
    const stretchRevenue = item.stretchRevenue ?? item.forecastRevenue;
    const pipelineCoverage = item.pipelineCoverage ?? 100;
    const variance = actualRevenue - item.forecastRevenue;
    const varianceRate =
      item.forecastRevenue > 0
        ? Number(((variance / item.forecastRevenue) * 100).toFixed(1))
        : 0;

    return {
      ...item,
      actualRevenue,
      stretchRevenue,
      pipelineCoverage,
      variance,
      varianceRate,
      labelForecast: formatCompactCurrency(item.forecastRevenue),
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
        <span style={{ color: "#64748b" }}>Forecast Revenue</span>
        <span style={{ color: "#2563eb", fontWeight: 700 }}>
          {formatCurrency(row.forecastRevenue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Actual Revenue</span>
        <span style={{ color: "#16a34a", fontWeight: 700 }}>
          {formatCurrency(row.actualRevenue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Stretch Revenue</span>
        <span style={{ color: "#7c3aed", fontWeight: 700 }}>
          {formatCurrency(row.stretchRevenue, currency)}
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

        <span style={{ color: "#64748b" }}>Pipeline Coverage</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.pipelineCoverage)}
        </span>
      </div>
    </div>
  );
}

export default function ForecastRevenueChart({
  title = "Forecast Revenue",
  subtitle = "Compare forecast, actual, and stretch revenue while tracking forecast accuracy and pipeline coverage",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No forecast revenue data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: ForecastRevenueChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalForecastRevenue = useMemo(
    () => chartData.reduce((sum, item) => sum + item.forecastRevenue, 0),
    [chartData]
  );

  const totalActualRevenue = useMemo(
    () => chartData.reduce((sum, item) => sum + item.actualRevenue, 0),
    [chartData]
  );

  const averageCoverage = useMemo(() => {
    if (!chartData.length) return 0;

    return Number(
      (
        chartData.reduce((sum, item) => sum + item.pipelineCoverage, 0) /
        chartData.length
      ).toFixed(1)
    );
  }, [chartData]);

  const netVariance = useMemo(
    () => totalActualRevenue - totalForecastRevenue,
    [totalActualRevenue, totalForecastRevenue]
  );

  const bestVariancePeriod = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.variance - a.variance)[0] ?? null;
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
          <p style={emptyTitleStyle}>No forecast revenue data</p>
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
              Forecast: {formatCompactCurrency(totalForecastRevenue)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(34,197,94,0.10)",
                color: "#15803d",
              }}
            >
              Actual: {formatCompactCurrency(totalActualRevenue)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: netVariance >= 0 ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
                color: netVariance >= 0 ? "#15803d" : "#b91c1c",
              }}
            >
              Variance: {formatCompactCurrency(netVariance)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(124,58,237,0.10)",
                color: "#6d28d9",
              }}
            >
              Coverage: {formatPercent(averageCoverage)}
            </div>

            {bestVariancePeriod ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(245,158,11,0.10)",
                  color: "#b45309",
                }}
              >
                Best Period: {bestVariancePeriod.period}
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
              <linearGradient id="actualRevenueArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.04} />
              </linearGradient>

              <linearGradient id="stretchRevenueArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.16} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.03} />
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
              width={58}
              tickFormatter={(value: number | string) =>
                typeof value === "number" ? formatCompactCurrency(value) : `${value}`
              }
            />

            <YAxis
              yAxisId="coverage"
              orientation="right"
              domain={[0, 150]}
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
              yAxisId="coverage"
              y={100}
              stroke="rgba(245,158,11,0.9)"
              strokeDasharray="4 4"
            />

            <Bar
              yAxisId="revenue"
              dataKey="forecastRevenue"
              name="Forecast Revenue"
              radius={[10, 10, 0, 0]}
              maxBarSize={42}
              fill="#93c5fd"
            >
              <LabelList
                dataKey="labelForecast"
                position="top"
                style={{
                  fill: "#334155",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            </Bar>

            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="actualRevenue"
              name="Actual Revenue"
              stroke="#22c55e"
              strokeWidth={3}
              fill="url(#actualRevenueArea)"
            />

            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="stretchRevenue"
              name="Stretch Revenue"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              fill="url(#stretchRevenueArea)"
            />

            <Area
              yAxisId="coverage"
              type="monotone"
              dataKey="pipelineCoverage"
              name="Pipeline Coverage"
              stroke="#f59e0b"
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
                <span>Forecast: {formatCompactCurrency(item.forecastRevenue)}</span>
                <span>•</span>
                <span>Actual: {formatCompactCurrency(item.actualRevenue)}</span>
                <span>•</span>
                <span>Stretch: {formatCompactCurrency(item.stretchRevenue)}</span>
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

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color:
                    item.pipelineCoverage >= 100 ? "#1d4ed8" : "#b45309",
                  background: "#ffffff",
                  border:
                    item.pipelineCoverage >= 100
                      ? "1px solid rgba(37,99,235,0.18)"
                      : "1px solid rgba(245,158,11,0.18)",
                }}
              >
                {formatPercent(item.pipelineCoverage)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}