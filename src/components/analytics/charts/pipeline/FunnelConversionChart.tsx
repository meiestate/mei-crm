// src/components/analytics/charts/pipeline/FunnelConversionChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type FunnelConversionDatum = {
  stage: string;
  count: number;
  conversionRate?: number;
  dropOffRate?: number;
  avgDays?: number;
};

type FunnelConversionChartProps = {
  title?: string;
  subtitle?: string;
  data?: FunnelConversionDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  showSummary?: boolean;
};

type ChartRow = FunnelConversionDatum & {
  conversionRate: number;
  dropOffRate: number;
  avgDays: number;
  labelCount: string;
};

type TooltipPayloadItem = {
  payload?: ChartRow;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
};

const DEFAULT_HEIGHT = 500;

const defaultData: FunnelConversionDatum[] = [
  {
    stage: "New Leads",
    count: 420,
    conversionRate: 100,
    dropOffRate: 0,
    avgDays: 1,
  },
  {
    stage: "Contacted",
    count: 332,
    conversionRate: 79.0,
    dropOffRate: 21.0,
    avgDays: 2,
  },
  {
    stage: "Qualified",
    count: 214,
    conversionRate: 64.5,
    dropOffRate: 35.5,
    avgDays: 4,
  },
  {
    stage: "Site Visit",
    count: 128,
    conversionRate: 59.8,
    dropOffRate: 40.2,
    avgDays: 6,
  },
  {
    stage: "Negotiation",
    count: 62,
    conversionRate: 48.4,
    dropOffRate: 51.6,
    avgDays: 9,
  },
  {
    stage: "Closed Won",
    count: 27,
    conversionRate: 43.5,
    dropOffRate: 56.5,
    avgDays: 12,
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

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatCompactNumber(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 10000000) {
    return `${(value / 10000000).toFixed(1)}Cr`;
  }

  if (abs >= 100000) {
    return `${(value / 100000).toFixed(1)}L`;
  }

  if (abs >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return `${value}`;
}

function formatDays(value: number): string {
  return `${value.toFixed(0)}d`;
}

function getStageColor(index: number): string {
  const colors = ["#2563eb", "#0ea5e9", "#14b8a6", "#22c55e", "#f59e0b", "#ef4444"];
  return colors[index % colors.length];
}

function buildChartData(data: FunnelConversionDatum[]): ChartRow[] {
  return data.map((item, index, arr) => {
    const previous = arr[index - 1];

    const conversionRate =
      item.conversionRate ??
      (previous && previous.count > 0
        ? Number(((item.count / previous.count) * 100).toFixed(1))
        : 100);

    const dropOffRate =
      item.dropOffRate ?? Number((100 - conversionRate).toFixed(1));

    const avgDays = item.avgDays ?? Math.max(1, index * 2 + 1);

    return {
      ...item,
      conversionRate,
      dropOffRate,
      avgDays,
      labelCount: formatCompactNumber(item.count),
    };
  });
}

function getTooltipRow(payload?: TooltipPayloadItem[]): ChartRow | null {
  if (!payload || payload.length === 0) {
    return null;
  }

  const firstItemWithPayload = payload.find((item) => item?.payload);
  return firstItemWithPayload?.payload ?? null;
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
        minWidth: 250,
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
        <span style={{ color: "#64748b" }}>Stage Volume</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>{row.count}</span>

        <span style={{ color: "#64748b" }}>Step Conversion</span>
        <span style={{ color: "#16a34a", fontWeight: 700 }}>
          {formatPercent(row.conversionRate)}
        </span>

        <span style={{ color: "#64748b" }}>Drop-off</span>
        <span style={{ color: "#ef4444", fontWeight: 700 }}>
          {formatPercent(row.dropOffRate)}
        </span>

        <span style={{ color: "#64748b" }}>Avg Time in Stage</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatDays(row.avgDays)}
        </span>
      </div>
    </div>
  );
}

export default function FunnelConversionChart({
  title = "Funnel Conversion",
  subtitle = "Track stage-by-stage movement, conversion efficiency, and drop-off across the sales funnel",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No funnel conversion data available right now.",
  showSummary = true,
}: FunnelConversionChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const topOfFunnel = chartData[0]?.count ?? 0;
  const bottomOfFunnel = chartData[chartData.length - 1]?.count ?? 0;

  const overallConversionRate = useMemo(() => {
    if (topOfFunnel <= 0) return 0;
    return Number(((bottomOfFunnel / topOfFunnel) * 100).toFixed(1));
  }, [bottomOfFunnel, topOfFunnel]);

  const biggestDropStage = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.dropOffRate - a.dropOffRate)[0] ?? null;
  }, [chartData]);

  const avgStageConversion = useMemo(() => {
    if (!chartData.length) return 0;
    return Number(
      (
        chartData.reduce((sum, item) => sum + item.conversionRate, 0) /
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
          <p style={emptyTitleStyle}>No funnel data</p>
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
              Top Funnel: {formatCompactNumber(topOfFunnel)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(34,197,94,0.10)",
                color: "#15803d",
              }}
            >
              Won: {bottomOfFunnel}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(59,130,246,0.10)",
                color: "#1d4ed8",
              }}
            >
              Overall CVR: {formatPercent(overallConversionRate)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(245,158,11,0.10)",
                color: "#b45309",
              }}
            >
              Avg Step CVR: {formatPercent(avgStageConversion)}
            </div>

            {biggestDropStage ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(239,68,68,0.10)",
                  color: "#b91c1c",
                }}
              >
                Biggest Drop: {biggestDropStage.stage}
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
              yAxisId="rate"
              orientation="right"
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={44}
              tickFormatter={(value: number | string) => `${value}%`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{
                fontSize: 12,
                color: "#334155",
                paddingTop: 8,
              }}
            />

            <ReferenceLine
              yAxisId="rate"
              y={avgStageConversion}
              stroke="rgba(245,158,11,0.8)"
              strokeDasharray="4 4"
            />

            <Bar
              yAxisId="count"
              dataKey="count"
              name="Stage Count"
              radius={[10, 10, 0, 0]}
              maxBarSize={54}
            >
              {chartData.map((entry, index) => (
                <Cell key={`count-${entry.stage}`} fill={getStageColor(index)} />
              ))}

              <LabelList
                dataKey="labelCount"
                position="top"
                style={{
                  fill: "#334155",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            </Bar>

            <Bar
              yAxisId="rate"
              dataKey="dropOffRate"
              name="Drop-off Rate"
              radius={[10, 10, 0, 0]}
              maxBarSize={28}
              fill="#fecaca"
            />

            <Bar
              yAxisId="rate"
              dataKey="conversionRate"
              name="Conversion Rate"
              radius={[10, 10, 0, 0]}
              maxBarSize={28}
              fill="#86efac"
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
                    background: getStageColor(index),
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
                <span>Volume: {item.count}</span>
                <span>•</span>
                <span>Avg Days: {formatDays(item.avgDays)}</span>
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
                    item.conversionRate >= avgStageConversion ? "#15803d" : "#b45309",
                  background: "#ffffff",
                  border:
                    item.conversionRate >= avgStageConversion
                      ? "1px solid rgba(34,197,94,0.18)"
                      : "1px solid rgba(245,158,11,0.18)",
                }}
              >
                CVR {formatPercent(item.conversionRate)}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: item.dropOffRate >= 40 ? "#b91c1c" : "#0369a1",
                  background: "#ffffff",
                  border:
                    item.dropOffRate >= 40
                      ? "1px solid rgba(239,68,68,0.18)"
                      : "1px solid rgba(14,165,233,0.18)",
                }}
              >
                Drop {formatPercent(item.dropOffRate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}