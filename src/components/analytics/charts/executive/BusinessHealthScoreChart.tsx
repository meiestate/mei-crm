// src/components/analytics/charts/performance/BusinessHealthScoreChart.tsx

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface BusinessHealthScoreChartSegment {
  name: string;
  value: number;
  color: string;
}

export interface BusinessHealthScoreChartProps {
  score?: number;
  title?: string;
  subtitle?: string;
  data?: BusinessHealthScoreChartSegment[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  scoreLabel?: string;
  statusLabel?: string;
}

type TooltipPayloadItem = {
  name?: string;
  value?: number | string;
  payload?: BusinessHealthScoreChartSegment;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
};

const DEFAULT_SCORE = 78;

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function getHealthStatus(score: number): string {
  if (score >= 85) {
    return "Excellent";
  }

  if (score >= 70) {
    return "Healthy";
  }

  if (score >= 50) {
    return "Needs Attention";
  }

  return "Critical";
}

function getScoreColor(score: number): string {
  if (score >= 85) {
    return "#16A34A";
  }

  if (score >= 70) {
    return "#2563EB";
  }

  if (score >= 50) {
    return "#F59E0B";
  }

  return "#EF4444";
}

function buildDefaultData(score: number): BusinessHealthScoreChartSegment[] {
  const safeScore = clampScore(score);

  return [
    {
      name: "Health Score",
      value: safeScore,
      color: getScoreColor(safeScore),
    },
    {
      name: "Remaining",
      value: 100 - safeScore,
      color: "#E2E8F0",
    },
  ];
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const item = payload[0]?.payload;

  if (!item) {
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
        minWidth: 160,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {item.name}
      </div>

      <div
        style={{
          fontSize: 12,
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span>Value</span>
        <span>{formatNumber(item.value)}%</span>
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
      Loading business health score...
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

export default function BusinessHealthScoreChart({
  score = DEFAULT_SCORE,
  title = "Business Health Score",
  subtitle = "A quick pulse check of your current business performance based on sales, pipeline, follow-ups, and response quality.",
  data,
  height = 320,
  loading = false,
  emptyMessage = "No business health score data available.",
  scoreLabel = "Health Score",
  statusLabel = "Status",
}: BusinessHealthScoreChartProps) {
  const safeScore = clampScore(score);
  const chartData = (data && data.length > 0 ? data : buildDefaultData(safeScore)).filter(
    (item) => typeof item.value === "number" && item.value >= 0
  );

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

  const status = getHealthStatus(safeScore);
  const scoreColor = getScoreColor(safeScore);

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
            {scoreLabel}: {formatNumber(safeScore)}%
          </div>

          <div
            style={{
              border: `1px solid ${scoreColor}20`,
              background: `${scoreColor}12`,
              color: scoreColor,
              borderRadius: 999,
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {statusLabel}: {status}
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height,
          display: "grid",
          gridTemplateColumns: "minmax(220px, 1fr) minmax(180px, 220px)",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%", height: "100%", minHeight: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={78}
                outerRadius={108}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                paddingAngle={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: 0.4,
                marginBottom: 6,
              }}
            >
              Overall Score
            </div>

            <div
              style={{
                fontSize: 40,
                lineHeight: 1,
                fontWeight: 800,
                color: scoreColor,
              }}
            >
              {formatNumber(safeScore)}%
            </div>
          </div>

          <div
            style={{
              borderRadius: 16,
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              padding: 14,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#0F172A",
                marginBottom: 8,
              }}
            >
              Score Meaning
            </div>

            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.6,
                color: "#64748B",
              }}
            >
              {safeScore >= 85 &&
                "Business performance is strong across most key operating metrics."}
              {safeScore >= 70 && safeScore < 85 &&
                "The business is in a healthy zone, with room to tighten execution and consistency."}
              {safeScore >= 50 && safeScore < 70 &&
                "Some key performance areas need attention to prevent pipeline or follow-up leakage."}
              {safeScore < 50 &&
                "Critical performance signals need immediate corrective action across operations and sales flow."}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            {chartData.map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#334155",
                    fontWeight: 600,
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
                  <span>{item.name}</span>
                </div>

                <span
                  style={{
                    fontWeight: 700,
                    color: "#0F172A",
                  }}
                >
                  {formatNumber(item.value)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}