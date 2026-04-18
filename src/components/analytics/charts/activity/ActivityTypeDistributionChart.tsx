// src/components/analytics/charts/activity/ActivityTypeDistributionChart.tsx

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export type ActivityType =
  | "call"
  | "whatsapp"
  | "email"
  | "meeting"
  | "site_visit"
  | "follow_up"
  | "note"
  | "task"
  | "other";

export interface ActivityTypeDistributionItem {
  type: ActivityType | string;
  label: string;
  value: number;
  color?: string;
}

export interface ActivityTypeDistributionChartProps {
  title?: string;
  subtitle?: string;
  data?: ActivityTypeDistributionItem[];
  height?: number;
  loading?: boolean;
  showLegend?: boolean;
  emptyMessage?: string;
  totalLabel?: string;
}

type ChartDatum = ActivityTypeDistributionItem & {
  fill: string;
  percentage: number;
};

type TooltipPayloadItem = {
  payload: ChartDatum;
  value: number;
  name: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
};

const DEFAULT_COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
  "#06B6D4",
  "#6366F1",
  "#94A3B8",
];

const DEFAULT_DATA: ActivityTypeDistributionItem[] = [
  { type: "call", label: "Calls", value: 48, color: "#3B82F6" },
  { type: "whatsapp", label: "WhatsApp", value: 36, color: "#22C55E" },
  { type: "email", label: "Emails", value: 20, color: "#F59E0B" },
  { type: "meeting", label: "Meetings", value: 14, color: "#8B5CF6" },
  { type: "site_visit", label: "Site Visits", value: 10, color: "#EF4444" },
  { type: "follow_up", label: "Follow Ups", value: 18, color: "#06B6D4" },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function buildChartData(data: ActivityTypeDistributionItem[]): ChartDatum[] {
  const safeData = data.filter((item) => Number(item.value) > 0);
  const total = safeData.reduce((sum, item) => sum + item.value, 0);

  return safeData.map((item, index) => ({
    ...item,
    fill: item.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    percentage: total > 0 ? Number(((item.value / total) * 100).toFixed(1)) : 0,
  }));
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
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
        padding: "10px 12px",
        boxShadow: "0 12px 24px rgba(15, 23, 42, 0.18)",
        minWidth: 150,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {datum.label}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          fontSize: 12,
          opacity: 0.95,
          marginBottom: 4,
        }}
      >
        <span>Count</span>
        <span>{formatNumber(datum.value)}</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          fontSize: 12,
          opacity: 0.95,
        }}
      >
        <span>Share</span>
        <span>{datum.percentage}%</span>
      </div>
    </div>
  );
}

function CenterContent({
  total,
  totalLabel,
}: {
  total: number;
  totalLabel: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#0F172A",
            lineHeight: 1,
          }}
        >
          {formatNumber(total)}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            fontWeight: 600,
            color: "#64748B",
          }}
        >
          {totalLabel}
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
      Loading activity distribution...
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

export default function ActivityTypeDistributionChart({
  title = "Activity Type Distribution",
  subtitle = "Track which communication activities dominate your CRM workflow.",
  data = DEFAULT_DATA,
  height = 360,
  loading = false,
  showLegend = true,
  emptyMessage = "No activity distribution data available.",
  totalLabel = "Total Activities",
}: ActivityTypeDistributionChartProps) {
  const chartData = buildChartData(data);
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

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
          {formatNumber(total)} total
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={3}
              stroke="#FFFFFF"
              strokeWidth={3}
              isAnimationActive
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`${entry.type}-${index}`}
                  fill={entry.fill}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />

            {showLegend ? (
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
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
                wrapperStyle={{
                  fontSize: 12,
                  paddingTop: 8,
                }}
              />
            ) : null}
          </PieChart>
        </ResponsiveContainer>

        <CenterContent total={total} totalLabel={totalLabel} />
      </div>
    </section>
  );
}