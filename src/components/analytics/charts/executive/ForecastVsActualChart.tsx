// src/components/analytics/charts/performance/ForecastVsActualChart.tsx

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ForecastVsActualChartPoint {
  label: string;
  forecast: number;
  actual: number;
}

export interface ForecastVsActualChartProps {
  title?: string;
  subtitle?: string;
  data?: ForecastVsActualChartPoint[];
  height?: number;
  loading?: boolean;
  showLegend?: boolean;
  emptyMessage?: string;
  yAxisLabel?: string;
  summaryLabel?: string;
}

type TooltipPayloadItem = {
  color?: string;
  dataKey?: string;
  name?: string;
  value?: number | string;
  payload: ForecastVsActualChartPoint;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

const DEFAULT_DATA: ForecastVsActualChartPoint[] = [
  { label: "Jan", forecast: 12, actual: 10 },
  { label: "Feb", forecast: 15, actual: 14 },
  { label: "Mar", forecast: 18, actual: 16 },
  { label: "Apr", forecast: 20, actual: 19 },
  { label: "May", forecast: 22, actual: 24 },
  { label: "Jun", forecast: 25, actual: 23 },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function getSummary(data: ForecastVsActualChartPoint[]) {
  const totals = data.reduce(
    (acc, item) => {
      acc.forecast += item.forecast || 0;
      acc.actual += item.actual || 0;
      return acc;
    },
    { forecast: 0, actual: 0 }
  );

  const variance = totals.actual - totals.forecast;

  return {
    ...totals,
    variance,
  };
}

function getYAxisMax(data: ForecastVsActualChartPoint[]): number {
  if (data.length === 0) {
    return 0;
  }

  const max = Math.max(
    ...data.flatMap((item) => [item.forecast || 0, item.actual || 0])
  );

  return Math.ceil(max * 1.25);
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0]?.payload;

  if (!point) {
    return null;
  }

  const variance = point.actual - point.forecast;

  return (
    <div
      style={{
        background: "#0F172A",
        color: "#FFFFFF",
        border: "1px solid #1E293B",
        borderRadius: 12,
        padding: "12px 14px",
        boxShadow: "0 12px 24px rgba(15, 23, 42, 0.18)",
        minWidth: 190,
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
          <span>Forecast</span>
          <span>{formatNumber(point.forecast)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Actual</span>
          <span>{formatNumber(point.actual)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Variance</span>
          <span>
            {variance > 0 ? "+" : ""}
            {formatNumber(variance)}
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
      Loading forecast vs actual data...
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

export default function ForecastVsActualChart({
  title = "Forecast vs Actual",
  subtitle = "Compare projected performance against actual results across the selected reporting period.",
  data = DEFAULT_DATA,
  height = 360,
  loading = false,
  showLegend = true,
  emptyMessage = "No forecast vs actual data available.",
  yAxisLabel = "Value",
  summaryLabel = "Net Variance",
}: ForecastVsActualChartProps) {
  const safeData = data.filter(
    (item) =>
      item.label &&
      typeof item.forecast === "number" &&
      typeof item.actual === "number"
  );

  const yAxisMax = getYAxisMax(safeData);
  const summary = getSummary(safeData);

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
            Forecast: {formatNumber(summary.forecast)}
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
            Actual: {formatNumber(summary.actual)}
          </div>

          <div
            style={{
              border: `1px solid ${summary.variance >= 0 ? "#22C55E" : "#EF4444"}22`,
              background: `${summary.variance >= 0 ? "#22C55E" : "#EF4444"}12`,
              borderRadius: 999,
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 700,
              color: summary.variance >= 0 ? "#15803D" : "#B91C1C",
              whiteSpace: "nowrap",
            }}
          >
            {summaryLabel}: {summary.variance > 0 ? "+" : ""}
            {formatNumber(summary.variance)}
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={safeData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            barCategoryGap="20%"
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

            <Bar
              dataKey="forecast"
              name="Forecast"
              fill="#CBD5E1"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="actual"
              name="Actual"
              fill="#2563EB"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}