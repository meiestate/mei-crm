// src/components/analytics/charts/executive/MonthlyBusinessScorecardChart.tsx

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface MonthlyBusinessScorecardChartPoint {
  label: string;
  score: number;
  target?: number;
  status?: "excellent" | "good" | "average" | "critical";
}

export interface MonthlyBusinessScorecardChartProps {
  title?: string;
  subtitle?: string;
  data?: MonthlyBusinessScorecardChartPoint[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  yAxisLabel?: string;
  summaryLabel?: string;
}

type TooltipPayloadItem = {
  color?: string;
  dataKey?: string;
  name?: string;
  value?: number | string;
  payload: MonthlyBusinessScorecardChartPoint;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

const DEFAULT_DATA: MonthlyBusinessScorecardChartPoint[] = [
  { label: "Jan", score: 68, target: 75, status: "average" },
  { label: "Feb", score: 74, target: 75, status: "good" },
  { label: "Mar", score: 81, target: 78, status: "good" },
  { label: "Apr", score: 87, target: 80, status: "excellent" },
  { label: "May", score: 79, target: 80, status: "good" },
  { label: "Jun", score: 62, target: 78, status: "critical" },
];

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function inferStatus(score: number): MonthlyBusinessScorecardChartPoint["status"] {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "average";
  return "critical";
}

function getBarColor(status?: MonthlyBusinessScorecardChartPoint["status"]): string {
  switch (status) {
    case "excellent":
      return "#16A34A";
    case "good":
      return "#2563EB";
    case "average":
      return "#F59E0B";
    case "critical":
      return "#EF4444";
    default:
      return "#94A3B8";
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function getAverageScore(data: MonthlyBusinessScorecardChartPoint[]): number {
  if (data.length === 0) return 0;

  const total = data.reduce((sum, item) => sum + clampScore(item.score || 0), 0);
  return Number((total / data.length).toFixed(1));
}

function getTopMonth(
  data: MonthlyBusinessScorecardChartPoint[]
): MonthlyBusinessScorecardChartPoint | null {
  if (data.length === 0) return null;
  return [...data].sort((a, b) => b.score - a.score)[0] ?? null;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0]?.payload;

  if (!point) {
    return null;
  }

  const safeScore = clampScore(point.score);
  const variance =
    typeof point.target === "number" ? safeScore - point.target : undefined;

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
          <span>Score</span>
          <span>{formatNumber(safeScore)} / 100</span>
        </div>

        {typeof point.target === "number" ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span>Target</span>
              <span>{formatNumber(point.target)} / 100</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span>Variance</span>
              <span>
                {(variance ?? 0) > 0 ? "+" : ""}
                {formatNumber(variance ?? 0)}
              </span>
            </div>
          </>
        ) : null}

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Status</span>
          <span style={{ textTransform: "capitalize" }}>
            {point.status ?? inferStatus(safeScore)}
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
      Loading monthly business scorecard...
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

export default function MonthlyBusinessScorecardChart({
  title = "Monthly Business Scorecard",
  subtitle = "A month-by-month score view of overall business performance, quality, and execution strength.",
  data = DEFAULT_DATA,
  height = 360,
  loading = false,
  emptyMessage = "No monthly business scorecard data available.",
  yAxisLabel = "Score",
  summaryLabel = "Average Score",
}: MonthlyBusinessScorecardChartProps) {
  const safeData = data
    .filter((item) => item.label && typeof item.score === "number")
    .map((item) => {
      const safeScore = clampScore(item.score);
      return {
        ...item,
        score: safeScore,
        target:
          typeof item.target === "number" ? clampScore(item.target) : undefined,
        status: item.status ?? inferStatus(safeScore),
      };
    });

  const averageScore = getAverageScore(safeData);
  const topMonth = getTopMonth(safeData);

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
            {summaryLabel}: {averageScore} / 100
          </div>

          {topMonth ? (
            <div
              style={{
                border: "1px solid #DCFCE7",
                background: "#F0FDF4",
                borderRadius: 999,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 700,
                color: "#166534",
                whiteSpace: "nowrap",
              }}
            >
              Best Month: {topMonth.label} ({formatNumber(topMonth.score)})
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={safeData}
            margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
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
              width={48}
              allowDecimals={false}
              domain={[0, 100]}
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

            <Bar
              dataKey="score"
              name="Business Score"
              radius={[10, 10, 0, 0]}
            >
              {safeData.map((entry, index) => (
                <Cell
                  key={`${entry.label}-${index}`}
                  fill={getBarColor(entry.status)}
                />
              ))}

              <LabelList
                dataKey="score"
                position="top"
                fill="#334155"
                fontSize={12}
                fontWeight={700}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Excellent", color: "#16A34A" },
          { label: "Good", color: "#2563EB" },
          { label: "Average", color: "#F59E0B" },
          { label: "Critical", color: "#EF4444" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              fontWeight: 600,
              color: "#475569",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: item.color,
                display: "inline-block",
              }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}