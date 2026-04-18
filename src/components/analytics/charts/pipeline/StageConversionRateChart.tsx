// src/components/analytics/charts/pipeline/StageConversionRateChart.tsx

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

type StageConversionRateDatum = {
  stage: string;
  entered: number;
  converted: number;
  conversionRate?: number;
  avgDays?: number;
};

type StageConversionRateChartProps = {
  title?: string;
  subtitle?: string;
  data?: StageConversionRateDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  showSummary?: boolean;
};

type ChartRow = StageConversionRateDatum & {
  conversionRate: number;
  avgDays: number;
  dropOffCount: number;
  labelConverted: string;
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

const defaultData: StageConversionRateDatum[] = [
  { stage: "New → Contacted", entered: 420, converted: 332, conversionRate: 79.0, avgDays: 2 },
  { stage: "Contacted → Qualified", entered: 332, converted: 214, conversionRate: 64.5, avgDays: 3 },
  { stage: "Qualified → Site Visit", entered: 214, converted: 128, conversionRate: 59.8, avgDays: 5 },
  { stage: "Site Visit → Negotiation", entered: 128, converted: 62, conversionRate: 48.4, avgDays: 6 },
  { stage: "Negotiation → Won", entered: 62, converted: 27, conversionRate: 43.5, avgDays: 8 },
];

const BAR_COLORS = ["#2563eb", "#0ea5e9", "#14b8a6", "#22c55e", "#f59e0b", "#8b5cf6"];

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

function formatDays(value: number): string {
  return `${value.toFixed(0)}d`;
}

function formatCompactNumber(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
  if (abs >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `${(value / 1000).toFixed(1)}K`;

  return `${value}`;
}

function buildChartData(data: StageConversionRateDatum[]): ChartRow[] {
  return data.map((item) => {
    const conversionRate =
      item.conversionRate ??
      (item.entered > 0
        ? Number(((item.converted / item.entered) * 100).toFixed(1))
        : 0);

    const avgDays = item.avgDays ?? 0;
    const dropOffCount = Math.max(0, item.entered - item.converted);

    return {
      ...item,
      conversionRate,
      avgDays,
      dropOffCount,
      labelConverted: formatCompactNumber(item.converted),
    };
  });
}

function getTooltipRow(payload?: TooltipPayloadItem[]): ChartRow | null {
  if (!payload || payload.length === 0) return null;

  const item = payload.find((entry) => entry?.payload);
  return item?.payload ?? null;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
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
        minWidth: 260,
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
        <span style={{ color: "#64748b" }}>Entered</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>{row.entered}</span>

        <span style={{ color: "#64748b" }}>Converted</span>
        <span style={{ color: "#16a34a", fontWeight: 700 }}>{row.converted}</span>

        <span style={{ color: "#64748b" }}>Conversion Rate</span>
        <span style={{ color: "#2563eb", fontWeight: 700 }}>
          {formatPercent(row.conversionRate)}
        </span>

        <span style={{ color: "#64748b" }}>Drop-off Count</span>
        <span style={{ color: "#ef4444", fontWeight: 700 }}>{row.dropOffCount}</span>

        <span style={{ color: "#64748b" }}>Avg Days</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatDays(row.avgDays)}
        </span>
      </div>
    </div>
  );
}

export default function StageConversionRateChart({
  title = "Stage Conversion Rate",
  subtitle = "Measure stage-to-stage efficiency, converted volume, and time taken across the pipeline",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No stage conversion data available right now.",
  showSummary = true,
}: StageConversionRateChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const averageConversionRate = useMemo(() => {
    if (!chartData.length) return 0;

    return Number(
      (
        chartData.reduce((sum, item) => sum + item.conversionRate, 0) /
        chartData.length
      ).toFixed(1)
    );
  }, [chartData]);

  const totalEntered = useMemo(
    () => chartData.reduce((sum, item) => sum + item.entered, 0),
    [chartData]
  );

  const totalConverted = useMemo(
    () => chartData.reduce((sum, item) => sum + item.converted, 0),
    [chartData]
  );

  const weakestStage = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => a.conversionRate - b.conversionRate)[0] ?? null;
  }, [chartData]);

  const strongestStage = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.conversionRate - a.conversionRate)[0] ?? null;
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
          <p style={emptyTitleStyle}>No conversion data</p>
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
              Entered: {formatCompactNumber(totalEntered)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(34,197,94,0.10)",
                color: "#15803d",
              }}
            >
              Converted: {formatCompactNumber(totalConverted)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(59,130,246,0.10)",
                color: "#1d4ed8",
              }}
            >
              Avg CVR: {formatPercent(averageConversionRate)}
            </div>

            {strongestStage ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(16,185,129,0.10)",
                  color: "#047857",
                }}
              >
                Best: {strongestStage.stage}
              </div>
            ) : null}

            {weakestStage ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(239,68,68,0.10)",
                  color: "#b91c1c",
                }}
              >
                Weakest: {weakestStage.stage}
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
              y={averageConversionRate}
              stroke="rgba(245,158,11,0.8)"
              strokeDasharray="4 4"
            />

            <Bar
              yAxisId="count"
              dataKey="converted"
              name="Converted"
              radius={[10, 10, 0, 0]}
              maxBarSize={54}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`converted-${entry.stage}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}

              <LabelList
                dataKey="labelConverted"
                position="top"
                style={{
                  fill: "#334155",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            </Bar>

            <Bar
              yAxisId="count"
              dataKey="dropOffCount"
              name="Drop-off Count"
              radius={[10, 10, 0, 0]}
              maxBarSize={32}
              fill="#fecaca"
            />

            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="conversionRate"
              name="Conversion Rate"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="avgDays"
              name="Avg Days"
              stroke="#8b5cf6"
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
                <span>Entered: {item.entered}</span>
                <span>•</span>
                <span>Converted: {item.converted}</span>
                <span>•</span>
                <span>Drop-off: {item.dropOffCount}</span>
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
                    item.conversionRate >= averageConversionRate ? "#15803d" : "#b45309",
                  background: "#ffffff",
                  border:
                    item.conversionRate >= averageConversionRate
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
                  color: "#7c3aed",
                  background: "#ffffff",
                  border: "1px solid rgba(124,58,237,0.18)",
                }}
              >
                {formatDays(item.avgDays)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}