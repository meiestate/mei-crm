// src/components/analytics/charts/performance/GrowthComparisonChart.tsx

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface GrowthComparisonChartPoint {
  label: string;
  current: number;
  previous: number;
}

export interface GrowthComparisonChartProps {
  title?: string;
  subtitle?: string;
  data?: GrowthComparisonChartPoint[];
  height?: number;
  loading?: boolean;
  showLegend?: boolean;
  emptyMessage?: string;
  yAxisLabel?: string;
  currentLabel?: string;
  previousLabel?: string;
}

type TooltipPayloadItem = {
  color?: string;
  dataKey?: string;
  name?: string;
  value?: number | string;
  payload: GrowthComparisonChartPoint;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

const DEFAULT_DATA: GrowthComparisonChartPoint[] = [
  { label: "Jan", current: 18, previous: 12 },
  { label: "Feb", current: 22, previous: 16 },
  { label: "Mar", current: 27, previous: 19 },
  { label: "Apr", current: 30, previous: 23 },
  { label: "May", current: 36, previous: 28 },
  { label: "Jun", current: 40, previous: 31 },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function getYAxisMax(data: GrowthComparisonChartPoint[]): number {
  if (data.length === 0) {
    return 0;
  }

  const max = Math.max(
    ...data.flatMap((item) => [item.current || 0, item.previous || 0])
  );

  return Math.ceil(max * 1.2);
}

function getGrowthSummary(data: GrowthComparisonChartPoint[]) {
  const totals = data.reduce(
    (acc, item) => {
      acc.current += item.current || 0;
      acc.previous += item.previous || 0;
      return acc;
    },
    { current: 0, previous: 0 }
  );

  const growth =
    totals.previous > 0
      ? Number((((totals.current - totals.previous) / totals.previous) * 100).toFixed(1))
      : 0;

  return {
    ...totals,
    growth,
  };
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0]?.payload;

  if (!point) {
    return null;
  }

  const variance = point.current - point.previous;
  const growthPercent =
    point.previous > 0
      ? (((point.current - point.previous) / point.previous) * 100).toFixed(1)
      : "0.0";

  return (
    <div
      style={{
        background: "#0F172A",
        color: "#FFFFFF",
        border: "1px solid #1E293B",
        borderRadius: 12,
        padding: "12px 14px",
        boxShadow: "0 12px 24px rgba(15, 23, 42, 0.18)",
        minWidth: 200,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "grid",
          gap: 6,
          fontSize: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Current</span>
          <span>{formatNumber(point.current)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Previous</span>
          <span>{formatNumber(point.previous)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Variance</span>
          <span>
            {variance > 0 ? "+" : ""}
            {formatNumber(variance)}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Growth</span>
          <span>
            {Number(growthPercent) > 0 ? "+" : ""}
            {growthPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}

function LoadingState({ height }: { height: number }) {
  return (
    <div
      style={{
        height,
        borderRadius: 20,
        border: "1px solid #E2E8F0",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748B",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      Loading growth comparison data...
    </div>
  );
}

function EmptyState({
  title,
  subtitle,
  height,
  emptyMessage,
}: {
  title: string;
  subtitle?: string;
  height: number;
  emptyMessage: string;
}) {
  return (
    <section
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 20,
        padding: 20,
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#0F172A",
          }}
        >
          {title}
        </h3>

        {subtitle ? (
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              lineHeight: 1.5,
              color: "#64748B",
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      <div
        style={{
          height,
          borderRadius: 16,
          border: "1px dashed #CBD5E1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 20,
          color: "#64748B",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {emptyMessage}
      </div>
    </section>
  );
}

export default function GrowthComparisonChart({
  title = "Growth Comparison",
  subtitle = "Compare current period performance against the previous period to spot growth trends clearly.",
  data = DEFAULT_DATA,
  height = 360,
  loading = false,
  showLegend = true,
  emptyMessage = "No growth comparison data available.",
  yAxisLabel = "Value",
  currentLabel = "Current Period",
  previousLabel = "Previous Period",
}: GrowthComparisonChartProps) {
  const safeData = data.filter(
    (item) =>
      item.label &&
      typeof item.current === "number" &&
      typeof item.previous === "number"
  );

  const yAxisMax = getYAxisMax(safeData);
  const summary = getGrowthSummary(safeData);

  if (loading) {
    return <LoadingState height={height} />;
  }

  if (safeData.length === 0) {
    return (
      <EmptyState
        title={title}
        subtitle={subtitle}
        height={height}
        emptyMessage={emptyMessage}
      />
    );
  }

  return (
    <section
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 20,
        padding: 20,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            {title}
          </h3>

          {subtitle ? (
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#64748B",
                maxWidth: 620,
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              border: "1px solid #E2E8F0",
              background: "#F8FAFC",
              borderRadius: 999,
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 700,
              color: "#334155",
              whiteSpace: "nowrap",
            }}
          >
            Current: {formatNumber(summary.current)}
          </div>

          <div
            style={{
              border: "1px solid #E2E8F0",
              background: "#F8FAFC",
              borderRadius: 999,
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 700,
              color: "#334155",
              whiteSpace: "nowrap",
            }}
          >
            Previous: {formatNumber(summary.previous)}
          </div>

          <div
            style={{
              border: `1px solid ${summary.growth >= 0 ? "#22C55E" : "#EF4444"}22`,
              background: `${summary.growth >= 0 ? "#22C55E" : "#EF4444"}12`,
              borderRadius: 999,
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 700,
              color: summary.growth >= 0 ? "#15803D" : "#B91C1C",
              whiteSpace: "nowrap",
            }}
          >
            Growth: {summary.growth > 0 ? "+" : ""}
            {summary.growth}%
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={safeData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={{ stroke: "#CBD5E1" }}
              tickLine={{ stroke: "#CBD5E1" }}
            />

            <YAxis
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={{ stroke: "#CBD5E1" }}
              tickLine={{ stroke: "#CBD5E1" }}
              width={48}
              allowDecimals={false}
              domain={[0, yAxisMax]}
              label={{
                value: yAxisLabel,
                angle: -90,
                position: "insideLeft",
                style: {
                  fill: "#64748B",
                  fontSize: 12,
                  fontWeight: 600,
                  textAnchor: "middle",
                },
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {showLegend ? (
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{
                  fontSize: 12,
                  paddingBottom: 8,
                }}
                formatter={(value: string) => (
                  <span
                    style={{
                      color: "#334155",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {value}
                  </span>
                )}
              />
            ) : null}

            <Line
              type="monotone"
              dataKey="current"
              name={currentLabel}
              stroke="#2563EB"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#2563EB",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#2563EB",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
            />

            <Line
              type="monotone"
              dataKey="previous"
              name={previousLabel}
              stroke="#94A3B8"
              strokeWidth={3}
              strokeDasharray="6 4"
              dot={{
                r: 4,
                fill: "#94A3B8",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#94A3B8",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}