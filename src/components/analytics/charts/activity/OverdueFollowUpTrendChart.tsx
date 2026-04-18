// src/components/analytics/charts/activity/OverdueFollowUpTrendChart.tsx

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

export interface OverdueFollowUpTrendPoint {
  label: string;
  overdue: number;
  resolved?: number;
  escalated?: number;
}

export interface OverdueFollowUpTrendChartProps {
  title?: string;
  subtitle?: string;
  data?: OverdueFollowUpTrendPoint[];
  height?: number;
  loading?: boolean;
  showLegend?: boolean;
  emptyMessage?: string;
  yAxisLabel?: string;
  totalLabel?: string;
}

type TooltipPayloadItem = {
  color?: string;
  dataKey?: string;
  name?: string;
  value?: number | string;
  payload: OverdueFollowUpTrendPoint;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

const DEFAULT_DATA: OverdueFollowUpTrendPoint[] = [
  { label: "Mon", overdue: 9, resolved: 5, escalated: 1 },
  { label: "Tue", overdue: 11, resolved: 6, escalated: 2 },
  { label: "Wed", overdue: 10, resolved: 7, escalated: 1 },
  { label: "Thu", overdue: 14, resolved: 8, escalated: 3 },
  { label: "Fri", overdue: 13, resolved: 9, escalated: 2 },
  { label: "Sat", overdue: 8, resolved: 5, escalated: 1 },
  { label: "Sun", overdue: 6, resolved: 4, escalated: 1 },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function getTotalOverdue(data: OverdueFollowUpTrendPoint[]): number {
  return data.reduce((sum, item) => sum + (item.overdue || 0), 0);
}

function getYAxisMax(data: OverdueFollowUpTrendPoint[]): number {
  if (data.length === 0) {
    return 0;
  }

  const max = Math.max(...data.map((item) => item.overdue || 0));
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
          <span>Overdue</span>
          <span>{formatNumber(point.overdue ?? 0)}</span>
        </div>

        {typeof point.resolved === "number" ? (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>Resolved</span>
            <span>{formatNumber(point.resolved)}</span>
          </div>
        ) : null}

        {typeof point.escalated === "number" ? (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>Escalated</span>
            <span>{formatNumber(point.escalated)}</span>
          </div>
        ) : null}
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
      Loading overdue follow-up trend...
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

export default function OverdueFollowUpTrendChart({
  title = "Overdue Follow-Up Trend",
  subtitle = "Watch how overdue follow-ups move across the selected reporting period.",
  data = DEFAULT_DATA,
  height = 360,
  loading = false,
  showLegend = true,
  emptyMessage = "No overdue follow-up trend data available.",
  yAxisLabel = "Overdue Count",
  totalLabel = "Total Overdue",
}: OverdueFollowUpTrendChartProps) {
  const safeData = data.filter(
    (item) => item.label && typeof item.overdue === "number"
  );
  const totalOverdue = getTotalOverdue(safeData);
  const yAxisMax = getYAxisMax(safeData);

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
                maxWidth: 600,
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
          {totalLabel}: {formatNumber(totalOverdue)}
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
              width={52}
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
              dataKey="overdue"
              name="Overdue"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#EF4444",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#EF4444",
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