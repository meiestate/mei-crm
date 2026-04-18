// src/components/analytics/charts/activity/ResponseTimeChart.tsx

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ResponseTimeChartPoint {
  label: string;
  averageMinutes: number;
  targetMinutes?: number;
  bestMinutes?: number;
}

export interface ResponseTimeChartProps {
  title?: string;
  subtitle?: string;
  data?: ResponseTimeChartPoint[];
  height?: number;
  loading?: boolean;
  showLegend?: boolean;
  emptyMessage?: string;
  yAxisLabel?: string;
  targetLabel?: string;
}

type ChartDatum = ResponseTimeChartPoint & {
  varianceFromTarget: number;
};

type TooltipPayloadItem = {
  color?: string;
  dataKey?: string;
  name?: string;
  value?: number | string;
  payload: ChartDatum;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

const BAR_COLORS = ["#3B82F6", "#6366F1", "#8B5CF6", "#06B6D4", "#14B8A6", "#F59E0B"];

const DEFAULT_DATA: ResponseTimeChartPoint[] = [
  { label: "Mon", averageMinutes: 18, targetMinutes: 15, bestMinutes: 9 },
  { label: "Tue", averageMinutes: 22, targetMinutes: 15, bestMinutes: 10 },
  { label: "Wed", averageMinutes: 16, targetMinutes: 15, bestMinutes: 8 },
  { label: "Thu", averageMinutes: 27, targetMinutes: 15, bestMinutes: 11 },
  { label: "Fri", averageMinutes: 19, targetMinutes: 15, bestMinutes: 9 },
  { label: "Sat", averageMinutes: 14, targetMinutes: 15, bestMinutes: 7 },
  { label: "Sun", averageMinutes: 12, targetMinutes: 15, bestMinutes: 6 },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function formatMinutes(value: number): string {
  if (value < 60) {
    return `${formatNumber(value)} min`;
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

function buildChartData(data: ResponseTimeChartPoint[]): ChartDatum[] {
  return data
    .filter(
      (item) => item.label && typeof item.averageMinutes === "number"
    )
    .map((item) => {
      const targetMinutes =
        typeof item.targetMinutes === "number" ? item.targetMinutes : 0;

      return {
        ...item,
        targetMinutes,
        varianceFromTarget: item.averageMinutes - targetMinutes,
      };
    });
}

function getYAxisMax(data: ChartDatum[]): number {
  if (data.length === 0) {
    return 0;
  }

  const candidates: number[] = [];

  data.forEach((item) => {
    candidates.push(item.averageMinutes || 0);
    candidates.push(item.targetMinutes || 0);
    candidates.push(item.bestMinutes || 0);
  });

  const max = Math.max(...candidates);
  return Math.ceil(max * 1.25);
}

function getAverageOfAverages(data: ChartDatum[]): number {
  if (data.length === 0) {
    return 0;
  }

  const total = data.reduce((sum, item) => sum + item.averageMinutes, 0);
  return Number((total / data.length).toFixed(1));
}

function getCommonTarget(data: ChartDatum[]): number {
  if (data.length === 0) {
    return 0;
  }

  const firstTarget = data[0]?.targetMinutes ?? 0;
  const sameTarget = data.every((item) => item.targetMinutes === firstTarget);

  if (sameTarget) {
    return firstTarget;
  }

  const total = data.reduce((sum, item) => sum + (item.targetMinutes || 0), 0);
  return Number((total / data.length).toFixed(1));
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const datum = payload[0]?.payload;

  if (!datum) {
    return null;
  }

  const varianceText =
    datum.varianceFromTarget > 0
      ? `+${formatMinutes(datum.varianceFromTarget)} slower`
      : datum.varianceFromTarget < 0
      ? `${formatMinutes(Math.abs(datum.varianceFromTarget))} faster`
      : "On target";

  return (
    <div
      style={{
        background: "#0F172A",
        color: "#FFFFFF",
        border: "1px solid #1E293B",
        borderRadius: 12,
        padding: "12px 14px",
        boxShadow: "0 12px 24px rgba(15, 23, 42, 0.18)",
        minWidth: 210,
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
          <span>Avg Response</span>
          <span>{formatMinutes(datum.averageMinutes)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Target</span>
          <span>{formatMinutes(datum.targetMinutes ?? 0)}</span>
        </div>

        {typeof datum.bestMinutes === "number" ? (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>Best</span>
            <span>{formatMinutes(datum.bestMinutes)}</span>
          </div>
        ) : null}

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Variance</span>
          <span>{varianceText}</span>
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
      Loading response time analytics...
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

export default function ResponseTimeChart({
  title = "Response Time",
  subtitle = "Track average response time and compare it against your target SLA.",
  data = DEFAULT_DATA,
  height = 360,
  loading = false,
  showLegend = true,
  emptyMessage = "No response time data available.",
  yAxisLabel = "Minutes",
  targetLabel = "Avg Response",
}: ResponseTimeChartProps) {
  const chartData = buildChartData(data);
  const yAxisMax = getYAxisMax(chartData);
  const averageOfAverages = getAverageOfAverages(chartData);
  const commonTarget = getCommonTarget(chartData);

  if (loading) {
    return <LoadingState height={height} />;
  }

  if (chartData.length === 0) {
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
            {targetLabel}: {formatMinutes(Math.round(averageOfAverages))}
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
            Target: {formatMinutes(Math.round(commonTarget))}
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            barCategoryGap="24%"
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
              width={54}
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

            <ReferenceLine
              y={commonTarget}
              stroke="#EF4444"
              strokeDasharray="6 6"
              ifOverflow="extendDomain"
              label={{
                value: "Target",
                position: "right",
                fill: "#EF4444",
                fontSize: 12,
                fontWeight: 700,
              }}
            />

            <Bar
              dataKey="averageMinutes"
              name="Average Response Time"
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`${entry.label}-${index}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}