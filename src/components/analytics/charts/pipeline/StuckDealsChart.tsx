// src/components/analytics/charts/pipeline/StuckDealsChart.tsx

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

type StuckDealsDatum = {
  stage: string;
  deals: number;
  avgStuckDays: number;
  value?: number;
  riskScore?: number;
};

type StuckDealsChartProps = {
  title?: string;
  subtitle?: string;
  data?: StuckDealsDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = StuckDealsDatum & {
  value: number;
  riskScore: number;
  stuckIndex: number;
  labelDeals: string;
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

const defaultData: StuckDealsDatum[] = [
  { stage: "Qualified", deals: 18, avgStuckDays: 14, value: 18200000, riskScore: 58 },
  { stage: "Site Visit", deals: 24, avgStuckDays: 19, value: 31400000, riskScore: 71 },
  { stage: "Negotiation", deals: 16, avgStuckDays: 27, value: 42800000, riskScore: 86 },
  { stage: "Documentation", deals: 10, avgStuckDays: 22, value: 25600000, riskScore: 79 },
  { stage: "Approval Pending", deals: 8, avgStuckDays: 31, value: 33800000, riskScore: 91 },
];

const BAR_COLORS = ["#f59e0b", "#fb923c", "#f97316", "#ef4444", "#dc2626", "#b91c1c"];

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

function formatDays(value: number): string {
  return `${value.toFixed(0)}d`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function buildChartData(data: StuckDealsDatum[]): ChartRow[] {
  const maxDays = Math.max(...data.map((item) => item.avgStuckDays), 1);
  const maxDeals = Math.max(...data.map((item) => item.deals), 1);

  return data.map((item) => {
    const value = item.value ?? 0;
    const riskScore =
      item.riskScore ?? Math.min(100, Math.round((item.avgStuckDays / maxDays) * 70 + (item.deals / maxDeals) * 30));

    const stuckIndex = Number(
      (((item.avgStuckDays / maxDays) * 0.55 + (item.deals / maxDeals) * 0.45) * 100).toFixed(1)
    );

    return {
      ...item,
      value,
      riskScore,
      stuckIndex,
      labelDeals: formatCompactNumber(item.deals),
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
        {String(label ?? row.stage)}
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
        <span style={{ color: "#64748b" }}>Stuck Deals</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>{row.deals}</span>

        <span style={{ color: "#64748b" }}>Avg Stuck Days</span>
        <span style={{ color: "#b45309", fontWeight: 700 }}>
          {formatDays(row.avgStuckDays)}
        </span>

        <span style={{ color: "#64748b" }}>Blocked Value</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatCurrency(row.value, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Risk Score</span>
        <span style={{ color: "#dc2626", fontWeight: 700 }}>
          {formatPercent(row.riskScore)}
        </span>

        <span style={{ color: "#64748b" }}>Stuck Index</span>
        <span style={{ color: "#7c3aed", fontWeight: 700 }}>
          {formatPercent(row.stuckIndex)}
        </span>
      </div>
    </div>
  );
}

export default function StuckDealsChart({
  title = "Stuck Deals Analysis",
  subtitle = "Spot stages where deals are aging, piling up, and blocking revenue movement",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No stuck deal data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: StuckDealsChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalStuckDeals = useMemo(
    () => chartData.reduce((sum, item) => sum + item.deals, 0),
    [chartData]
  );

  const totalBlockedValue = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  );

  const averageStuckDays = useMemo(() => {
    if (!chartData.length) return 0;

    return Number(
      (
        chartData.reduce((sum, item) => sum + item.avgStuckDays, 0) /
        chartData.length
      ).toFixed(1)
    );
  }, [chartData]);

  const highestRiskStage = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.riskScore - a.riskScore)[0] ?? null;
  }, [chartData]);

  const largestValueStage = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.value - a.value)[0] ?? null;
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
          <p style={emptyTitleStyle}>No stuck deal data</p>
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
                background: "rgba(245,158,11,0.10)",
                color: "#b45309",
              }}
            >
              Stuck Deals: {formatCompactNumber(totalStuckDeals)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(239,68,68,0.10)",
                color: "#b91c1c",
              }}
            >
              Blocked Value: {formatCompactCurrency(totalBlockedValue)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(124,58,237,0.10)",
                color: "#6d28d9",
              }}
            >
              Avg Age: {formatDays(averageStuckDays)}
            </div>

            {highestRiskStage ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(220,38,38,0.10)",
                  color: "#991b1b",
                }}
              >
                Highest Risk: {highestRiskStage.stage}
              </div>
            ) : null}

            {largestValueStage ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(37,99,235,0.10)",
                  color: "#1d4ed8",
                }}
              >
                Biggest Value: {largestValueStage.stage}
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
              dataKey="stage"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              yAxisId="count"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={(value: number | string) =>
                typeof value === "number" ? formatCompactNumber(value) : `${value}`
              }
            />

            <YAxis
              yAxisId="metric"
              orientation="right"
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={44}
              tickFormatter={(value: number | string) => `${value}`}
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
              yAxisId="metric"
              y={averageStuckDays}
              stroke="rgba(245,158,11,0.8)"
              strokeDasharray="4 4"
            />

            <Bar
              yAxisId="count"
              dataKey="deals"
              name="Stuck Deals"
              radius={[10, 10, 0, 0]}
              maxBarSize={54}
            >
              {chartData.map((entry, index) => (
                <Cell key={`deals-${entry.stage}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}

              <LabelList
                dataKey="labelDeals"
                position="top"
                style={{
                  fill: "#334155",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            </Bar>

            <Line
              yAxisId="metric"
              type="monotone"
              dataKey="avgStuckDays"
              name="Avg Stuck Days"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              yAxisId="metric"
              type="monotone"
              dataKey="riskScore"
              name="Risk Score"
              stroke="#dc2626"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />

            <Line
              yAxisId="metric"
              type="monotone"
              dataKey="stuckIndex"
              name="Stuck Index"
              stroke="#7c3aed"
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
            key={item.stage}
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
                  {item.stage}
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
                <span>Deals: {item.deals}</span>
                <span>•</span>
                <span>Age: {formatDays(item.avgStuckDays)}</span>
                <span>•</span>
                <span>Value: {formatCompactCurrency(item.value)}</span>
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
                  color: item.riskScore >= 80 ? "#b91c1c" : "#b45309",
                  background: "#ffffff",
                  border:
                    item.riskScore >= 80
                      ? "1px solid rgba(239,68,68,0.18)"
                      : "1px solid rgba(245,158,11,0.18)",
                }}
              >
                Risk {formatPercent(item.riskScore)}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#6d28d9",
                  background: "#ffffff",
                  border: "1px solid rgba(124,58,237,0.18)",
                }}
              >
                Index {formatPercent(item.stuckIndex)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}