// src/components/analytics/charts/revenue/RevenueByProjectChart.tsx

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

type RevenueByProjectDatum = {
  project: string;
  revenue: number;
  deals: number;
  targetRevenue?: number;
  collectionRate?: number;
  marginRate?: number;
};

type RevenueByProjectChartProps = {
  title?: string;
  subtitle?: string;
  data?: RevenueByProjectDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = RevenueByProjectDatum & {
  targetRevenue: number;
  collectionRate: number;
  marginRate: number;
  averageDealSize: number;
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

const defaultData: RevenueByProjectDatum[] = [
  {
    project: "MEI Skyview Residency",
    revenue: 36400000,
    deals: 18,
    targetRevenue: 34000000,
    collectionRate: 93,
    marginRate: 28,
  },
  {
    project: "Green Valley Enclave",
    revenue: 31800000,
    deals: 16,
    targetRevenue: 30000000,
    collectionRate: 91,
    marginRate: 26,
  },
  {
    project: "Urban Crest Heights",
    revenue: 28600000,
    deals: 14,
    targetRevenue: 27500000,
    collectionRate: 89,
    marginRate: 24,
  },
  {
    project: "Lakefront Aura",
    revenue: 24700000,
    deals: 12,
    targetRevenue: 25500000,
    collectionRate: 86,
    marginRate: 23,
  },
  {
    project: "Sarjapur Elite Homes",
    revenue: 21900000,
    deals: 11,
    targetRevenue: 21000000,
    collectionRate: 88,
    marginRate: 25,
  },
  {
    project: "Whitefield Prime Villas",
    revenue: 19400000,
    deals: 9,
    targetRevenue: 18500000,
    collectionRate: 90,
    marginRate: 27,
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

function buildChartData(data: RevenueByProjectDatum[]): ChartRow[] {
  return data.map((item) => {
    const targetRevenue = item.targetRevenue ?? item.revenue;
    const collectionRate = item.collectionRate ?? 0;
    const marginRate = item.marginRate ?? 0;
    const averageDealSize = item.deals > 0 ? Number((item.revenue / item.deals).toFixed(0)) : 0;
    const achievementRate =
      targetRevenue > 0 ? Number(((item.revenue / targetRevenue) * 100).toFixed(1)) : 0;

    return {
      ...item,
      targetRevenue,
      collectionRate,
      marginRate,
      averageDealSize,
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
        minWidth: 300,
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
        {String(label ?? row.project)}
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

        <span style={{ color: "#64748b" }}>Collection Rate</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.collectionRate)}
        </span>

        <span style={{ color: "#64748b" }}>Margin Rate</span>
        <span style={{ color: "#dc2626", fontWeight: 700 }}>
          {formatPercent(row.marginRate)}
        </span>
      </div>
    </div>
  );
}

export default function RevenueByProjectChart({
  title = "Revenue by Project",
  subtitle = "Compare project-wise revenue contribution, target achievement, collection efficiency, and margin strength",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No project revenue data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: RevenueByProjectChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalRevenue = useMemo(
    () => chartData.reduce((sum, item) => sum + item.revenue, 0),
    [chartData]
  );

  const totalDeals = useMemo(
    () => chartData.reduce((sum, item) => sum + item.deals, 0),
    [chartData]
  );

  const averageCollectionRate = useMemo(() => {
    if (!chartData.length) return 0;

    return Number(
      (
        chartData.reduce((sum, item) => sum + item.collectionRate, 0) /
        chartData.length
      ).toFixed(1)
    );
  }, [chartData]);

  const averageMarginRate = useMemo(() => {
    if (!chartData.length) return 0;

    return Number(
      (chartData.reduce((sum, item) => sum + item.marginRate, 0) / chartData.length).toFixed(1)
    );
  }, [chartData]);

  const topProject = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.revenue - a.revenue)[0] ?? null;
  }, [chartData]);

  const bestAchievementProject = useMemo(() => {
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
          <p style={emptyTitleStyle}>No project revenue data</p>
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
              Collection: {formatPercent(averageCollectionRate)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(239,68,68,0.10)",
                color: "#b91c1c",
              }}
            >
              Margin: {formatPercent(averageMarginRate)}
            </div>

            {topProject ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(124,58,237,0.10)",
                  color: "#6d28d9",
                }}
              >
                Top Project: {topProject.project}
              </div>
            ) : null}

            {bestAchievementProject ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(245,158,11,0.10)",
                  color: "#b45309",
                }}
              >
                Best vs Target: {bestAchievementProject.project}
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
              dataKey="project"
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
                  key={`revenue-${entry.project}`}
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
              dataKey="collectionRate"
              name="Collection Rate"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />

            <Line
              yAxisId="percent"
              type="monotone"
              dataKey="marginRate"
              name="Margin Rate"
              stroke="#ef4444"
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
            key={item.project}
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
                  {item.project}
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
                  color: "#1d4ed8",
                  background: "#ffffff",
                  border: "1px solid rgba(37,99,235,0.18)",
                }}
              >
                Collect {formatPercent(item.collectionRate)}
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
                Margin {formatPercent(item.marginRate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}