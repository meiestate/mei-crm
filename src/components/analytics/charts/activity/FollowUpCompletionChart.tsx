// src/components/analytics/charts/activity/FollowUpCompletionChart.tsx

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface FollowUpCompletionChartPoint {
  label: string;
  completed: number;
  pending: number;
  overdue?: number;
}

export interface FollowUpCompletionChartProps {
  title?: string;
  subtitle?: string;
  data?: FollowUpCompletionChartPoint[];
  height?: number;
  loading?: boolean;
  showLegend?: boolean;
  emptyMessage?: string;
  yAxisLabel?: string;
  completionLabel?: string;
}

type ChartDatum = FollowUpCompletionChartPoint & {
  total: number;
  completionRate: number;
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

const COLORS = {
  completed: "#22C55E",
  pending: "#F59E0B",
  overdue: "#EF4444",
};

const DEFAULT_DATA: FollowUpCompletionChartPoint[] = [
  { label: "Mon", completed: 18, pending: 6, overdue: 2 },
  { label: "Tue", completed: 22, pending: 7, overdue: 3 },
  { label: "Wed", completed: 20, pending: 5, overdue: 2 },
  { label: "Thu", completed: 27, pending: 8, overdue: 4 },
  { label: "Fri", completed: 25, pending: 9, overdue: 3 },
  { label: "Sat", completed: 16, pending: 4, overdue: 2 },
  { label: "Sun", completed: 12, pending: 3, overdue: 1 },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function buildChartData(data: FollowUpCompletionChartPoint[]): ChartDatum[] {
  return data
    .filter(
      (item) =>
        item.label &&
        typeof item.completed === "number" &&
        typeof item.pending === "number"
    )
    .map((item) => {
      const overdue = typeof item.overdue === "number" ? item.overdue : 0;
      const total = item.completed + item.pending + overdue;
      const completionRate =
        total > 0 ? Number(((item.completed / total) * 100).toFixed(1)) : 0;

      return {
        ...item,
        overdue,
        total,
        completionRate,
      };
    });
}

function getYAxisMax(data: ChartDatum[]): number {
  if (data.length === 0) {
    return 0;
  }

  const max = Math.max(...data.map((item) => item.total));
  return Math.ceil(max * 1.2);
}

function getOverallCompletionRate(data: ChartDatum[]): number {
  const completedTotal = data.reduce((sum, item) => sum + item.completed, 0);
  const total = data.reduce((sum, item) => sum + item.total, 0);

  if (total === 0) {
    return 0;
  }

  return Number(((completedTotal / total) * 100).toFixed(1));
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const datum = payload[0]?.payload;

  if (!datum) {
    return null;
  }

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
          <span>Completed</span>
          <span>{formatNumber(datum.completed)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Pending</span>
          <span>{formatNumber(datum.pending)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Overdue</span>
          <span>{formatNumber(datum.overdue ?? 0)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Total</span>
          <span>{formatNumber(datum.total)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Completion Rate</span>
          <span>{datum.completionRate}%</span>
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
      Loading follow-up completion data...
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

export default function FollowUpCompletionChart({
  title = "Follow-Up Completion",
  subtitle = "Compare completed, pending, and overdue follow-ups across the selected period.",
  data = DEFAULT_DATA,
  height = 360,
  loading = false,
  showLegend = true,
  emptyMessage = "No follow-up completion data available.",
  yAxisLabel = "Follow-Ups",
  completionLabel = "Overall Completion",
}: FollowUpCompletionChartProps) {
  const chartData = buildChartData(data);
  const yAxisMax = getYAxisMax(chartData);
  const overallCompletionRate = getOverallCompletionRate(chartData);

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
          {completionLabel}: {overallCompletionRate}%
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            barGap={6}
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
              width={46}
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
              dataKey="completed"
              name="Completed"
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`completed-${entry.label}-${index}`}
                  fill={COLORS.completed}
                />
              ))}
            </Bar>

            <Bar
              dataKey="pending"
              name="Pending"
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`pending-${entry.label}-${index}`}
                  fill={COLORS.pending}
                />
              ))}
            </Bar>

            <Bar
              dataKey="overdue"
              name="Overdue"
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`overdue-${entry.label}-${index}`}
                  fill={COLORS.overdue}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}