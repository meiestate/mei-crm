// src/components/analytics/charts/activity/CallsTrendChart.tsx

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface CallsTrendChartPoint {
  label: string;
  calls: number;
  connected?: number;
  missed?: number;
  outbound?: number;
  inbound?: number;
}

export interface CallsTrendChartProps {
  title?: string;
  subtitle?: string;
  data?: CallsTrendChartPoint[];
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
  payload: CallsTrendChartPoint;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

const DEFAULT_DATA: CallsTrendChartPoint[] = [
  { label: "Mon", calls: 42, connected: 30, missed: 12, outbound: 24, inbound: 18 },
  { label: "Tue", calls: 51, connected: 38, missed: 13, outbound: 29, inbound: 22 },
  { label: "Wed", calls: 47, connected: 34, missed: 13, outbound: 27, inbound: 20 },
  { label: "Thu", calls: 63, connected: 48, missed: 15, outbound: 36, inbound: 27 },
  { label: "Fri", calls: 58, connected: 44, missed: 14, outbound: 33, inbound: 25 },
  { label: "Sat", calls: 35, connected: 25, missed: 10, outbound: 20, inbound: 15 },
  { label: "Sun", calls: 22, connected: 16, missed: 6, outbound: 12, inbound: 10 },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function getTotalCalls(data: CallsTrendChartPoint[]): number {
  return data.reduce((sum, item) => sum + (item.calls || 0), 0);
}

function getMaxValue(data: CallsTrendChartPoint[]): number {
  if (data.length === 0) {
    return 0;
  }

  const max = Math.max(...data.map((item) => item.calls || 0));
  return Math.ceil(max * 1.2);
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
        minWidth: 180,
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
          <span>Total Calls</span>
          <span>{formatNumber(point.calls ?? 0)}</span>
        </div>

        {typeof point.connected === "number" ? (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>Connected</span>
            <span>{formatNumber(point.connected)}</span>
          </div>
        ) : null}

        {typeof point.missed === "number" ? (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>Missed</span>
            <span>{formatNumber(point.missed)}</span>
          </div>
        ) : null}

        {typeof point.outbound === "number" ? (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>Outbound</span>
            <span>{formatNumber(point.outbound)}</span>
          </div>
        ) : null}

        {typeof point.inbound === "number" ? (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>Inbound</span>
            <span>{formatNumber(point.inbound)}</span>
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
      Loading calls trend...
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

export default function CallsTrendChart({
  title = "Calls Trend",
  subtitle = "Monitor total calls across your selected reporting period.",
  data = DEFAULT_DATA,
  height = 360,
  loading = false,
  showLegend = true,
  emptyMessage = "No calls trend data available.",
  yAxisLabel = "Calls",
  totalLabel = "Total Calls",
}: CallsTrendChartProps) {
  const safeData = data.filter((item) => item.label && typeof item.calls === "number");
  const totalCalls = getTotalCalls(safeData);
  const yAxisMax = getMaxValue(safeData);

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
                maxWidth: 560,
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
          {totalLabel}: {formatNumber(totalCalls)}
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={safeData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="callsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />

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
              width={42}
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

            <Area
              type="monotone"
              dataKey="calls"
              name="Calls"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#callsAreaGradient)"
              activeDot={{
                r: 5,
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}