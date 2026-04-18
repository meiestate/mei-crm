// src/components/analytics/charts/risk/LostLeadReasonsChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type LostLeadReasonDatum = {
  reason: string;
  leadsLost: number;
  percentage?: number;
  revenueImpact?: number;
  avgSalesCycleDays?: number;
};

type LostLeadReasonsChartProps = {
  title?: string;
  subtitle?: string;
  data?: LostLeadReasonDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = LostLeadReasonDatum & {
  percentage: number;
  revenueImpact: number;
  avgSalesCycleDays: number;
  compactRevenueImpact: string;
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

const DEFAULT_HEIGHT = 620;
const DEFAULT_CURRENCY = "INR";

const COLORS = [
  "#dc2626",
  "#f97316",
  "#f59e0b",
  "#2563eb",
  "#7c3aed",
  "#14b8a6",
  "#64748b",
];

const defaultData: LostLeadReasonDatum[] = [
  {
    reason: "Price Too High",
    leadsLost: 46,
    revenueImpact: 38200000,
    avgSalesCycleDays: 21,
  },
  {
    reason: "Location Mismatch",
    leadsLost: 33,
    revenueImpact: 24800000,
    avgSalesCycleDays: 16,
  },
  {
    reason: "Competitor Won",
    leadsLost: 29,
    revenueImpact: 21900000,
    avgSalesCycleDays: 24,
  },
  {
    reason: "Loan Rejected",
    leadsLost: 19,
    revenueImpact: 14600000,
    avgSalesCycleDays: 28,
  },
  {
    reason: "Delayed Follow-up",
    leadsLost: 17,
    revenueImpact: 11200000,
    avgSalesCycleDays: 18,
  },
  {
    reason: "Property Specification Gap",
    leadsLost: 14,
    revenueImpact: 9300000,
    avgSalesCycleDays: 20,
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

const chartGridStyle: CSSProperties = {
  flex: 1,
  minHeight: 380,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.9fr)",
  gap: 18,
};

const chartPaneStyle: CSSProperties = {
  minHeight: 320,
};

const sidePaneStyle: CSSProperties = {
  minHeight: 320,
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.16)",
  background: "rgba(248,250,252,0.95)",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const sideTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  fontWeight: 700,
  color: "#0f172a",
};

const loadingWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 360,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  fontSize: 14,
  fontWeight: 600,
};

const emptyWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 360,
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

function buildChartData(data: LostLeadReasonDatum[]): ChartRow[] {
  const totalLost = data.reduce((sum, item) => sum + item.leadsLost, 0);

  return data.map((item) => {
    const percentage =
      item.percentage ??
      (totalLost > 0 ? Number(((item.leadsLost / totalLost) * 100).toFixed(1)) : 0);

    const revenueImpact = item.revenueImpact ?? 0;
    const avgSalesCycleDays = item.avgSalesCycleDays ?? 0;

    return {
      ...item,
      percentage,
      revenueImpact,
      avgSalesCycleDays,
      compactRevenueImpact: formatCompactCurrency(revenueImpact),
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
        {String(label ?? row.reason)}
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
        <span style={{ color: "#64748b" }}>Lost Leads</span>
        <span style={{ color: "#dc2626", fontWeight: 700 }}>{row.leadsLost}</span>

        <span style={{ color: "#64748b" }}>Share</span>
        <span style={{ color: "#2563eb", fontWeight: 700 }}>
          {formatPercent(row.percentage)}
        </span>

        <span style={{ color: "#64748b" }}>Revenue Impact</span>
        <span style={{ color: "#7c3aed", fontWeight: 700 }}>
          {formatCurrency(row.revenueImpact, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Avg Cycle Before Loss</span>
        <span style={{ color: "#f59e0b", fontWeight: 700 }}>
          {row.avgSalesCycleDays} days
        </span>
      </div>
    </div>
  );
}

export default function LostLeadReasonsChart({
  title = "Lost Lead Reasons",
  subtitle = "Understand why leads are getting lost and where revenue leakage is hitting hardest",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No lost lead reason data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: LostLeadReasonsChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalLostLeads = useMemo(
    () => chartData.reduce((sum, item) => sum + item.leadsLost, 0),
    [chartData]
  );

  const totalRevenueImpact = useMemo(
    () => chartData.reduce((sum, item) => sum + item.revenueImpact, 0),
    [chartData]
  );

  const topReason = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.leadsLost - a.leadsLost)[0] ?? null;
  }, [chartData]);

  const highestRevenueLeak = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.revenueImpact - a.revenueImpact)[0] ?? null;
  }, [chartData]);

  const averageCycle = useMemo(() => {
    if (!chartData.length) return 0;
    return Number(
      (
        chartData.reduce((sum, item) => sum + item.avgSalesCycleDays, 0) / chartData.length
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
          <p style={emptyTitleStyle}>No lost lead reason data</p>
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
                background: "rgba(220,38,38,0.10)",
                color: "#b91c1c",
              }}
            >
              Lost Leads: {totalLostLeads}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(124,58,237,0.10)",
                color: "#6d28d9",
              }}
            >
              Revenue Leak: {formatCompactCurrency(totalRevenueImpact)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(245,158,11,0.10)",
                color: "#b45309",
              }}
            >
              Avg Cycle: {averageCycle} days
            </div>

            {topReason ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(37,99,235,0.10)",
                  color: "#1d4ed8",
                }}
              >
                Top Reason: {topReason.reason}
              </div>
            ) : null}

            {highestRevenueLeak ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(239,68,68,0.10)",
                  color: "#b91c1c",
                }}
              >
                Max Leak: {highestRevenueLeak.reason}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div style={chartGridStyle}>
        <div style={chartPaneStyle}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 16, left: 0, bottom: 28 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.22)"
                vertical={false}
              />

              <XAxis
                dataKey="reason"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-14}
                textAnchor="end"
                height={72}
              />

              <YAxis
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

              <Bar
                dataKey="leadsLost"
                name="Lost Leads"
                radius={[10, 10, 0, 0]}
                maxBarSize={42}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`bar-${entry.reason}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

                <LabelList
                  dataKey="leadsLost"
                  position="top"
                  style={{
                    fill: "#334155",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={sidePaneStyle}>
          <h4 style={sideTitleStyle}>Reason Mix</h4>

          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip currency={currency} />} />

                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                    color: "#334155",
                    paddingTop: 4,
                  }}
                />

                <Pie
                  data={chartData}
                  dataKey="leadsLost"
                  nameKey="reason"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={2}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`pie-${entry.reason}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 4,
            }}
          >
            {chartData.map((item, index) => (
              <div
                key={item.reason}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 14,
                  background: "#ffffff",
                  border: "1px solid rgba(148,163,184,0.14)",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background: COLORS[index % COLORS.length],
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#0f172a",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={item.reason}
                    >
                      {item.reason}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: "#64748b",
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>{item.leadsLost} lost</span>
                    <span>•</span>
                    <span>{item.compactRevenueImpact}</span>
                  </div>
                </div>

                <span
                  style={{
                    borderRadius: 999,
                    padding: "6px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#1d4ed8",
                    background: "rgba(37,99,235,0.10)",
                    flexShrink: 0,
                  }}
                >
                  {formatPercent(item.percentage)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}