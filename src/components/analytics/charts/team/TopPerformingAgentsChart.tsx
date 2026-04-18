import { useMemo, useState } from "react";
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

export type TopPerformingAgentsChartItem = {
  agentName: string;
  revenue: number;
  closures: number;
  totalLeads: number;
};

type SortMode = "revenue" | "closures" | "efficiency";

type TopPerformingAgentsChartProps = {
  title?: string;
  subtitle?: string;
  height?: number;
  data?: TopPerformingAgentsChartItem[];
};

const DEFAULT_DATA: TopPerformingAgentsChartItem[] = [
  { agentName: "Arun", revenue: 1850000, closures: 14, totalLeads: 88 },
  { agentName: "Priya", revenue: 1620000, closures: 12, totalLeads: 76 },
  { agentName: "Karthik", revenue: 2480000, closures: 19, totalLeads: 101 },
  { agentName: "Divya", revenue: 1240000, closures: 9, totalLeads: 67 },
  { agentName: "Sanjay", revenue: 1490000, closures: 11, totalLeads: 83 },
  { agentName: "Meena", revenue: 1380000, closures: 10, totalLeads: 62 },
];

function formatCurrency(value: number): string {
  return `₹${new Intl.NumberFormat("en-IN").format(value)}`;
}

function formatCompactCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

function getConversionRate(totalLeads: number, closures: number): number {
  if (!totalLeads) return 0;
  return (closures / totalLeads) * 100;
}

function getPerformanceScore(
  revenue: number,
  closures: number,
  totalLeads: number
): number {
  const revenueScore = revenue / 100000;
  const closureScore = closures * 4;
  const efficiencyScore = getConversionRate(totalLeads, closures) * 2;
  return revenueScore + closureScore + efficiencyScore;
}

function getBarColor(index: number): string {
  const palette = [
    "#f59e0b",
    "#9ca3af",
    "#d97706",
    "#2563eb",
    "#16a34a",
    "#7c3aed",
    "#ef4444",
  ];

  return palette[index % palette.length];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    payload: TopPerformingAgentsChartItem & {
      performanceScore: number;
      conversionRate: number;
    };
    value: number;
    color: string;
  }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload;

  return (
    <div
      style={{
        background: "#111827",
        color: "#ffffff",
        borderRadius: 12,
        padding: "12px 14px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        border: "1px solid rgba(255,255,255,0.08)",
        minWidth: 220,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: 8,
          fontSize: 14,
        }}
      >
        {label}
      </div>

      <div style={{ fontSize: 13, lineHeight: 1.75 }}>
        <div>Revenue: {formatCurrency(item.revenue)}</div>
        <div>Closures: {item.closures}</div>
        <div>Total Leads: {item.totalLeads}</div>
        <div>Conversion Rate: {item.conversionRate.toFixed(2)}%</div>
        <div>Performance Score: {item.performanceScore.toFixed(1)}</div>
      </div>
    </div>
  );
}

export default function TopPerformingAgentsChart({
  title = "Top Performing Agents",
  subtitle = "Compare agent performance based on revenue, closures, and conversion efficiency",
  height = 420,
  data = DEFAULT_DATA,
}: TopPerformingAgentsChartProps) {
  const [sortMode, setSortMode] = useState<SortMode>("revenue");

  const safeData = useMemo(() => {
    return (data ?? [])
      .filter(
        (item) =>
          item &&
          typeof item.agentName === "string" &&
          typeof item.revenue === "number" &&
          typeof item.closures === "number" &&
          typeof item.totalLeads === "number" &&
          item.revenue >= 0 &&
          item.closures >= 0 &&
          item.totalLeads >= 0
      )
      .map((item) => ({
        ...item,
        conversionRate: getConversionRate(item.totalLeads, item.closures),
        performanceScore: getPerformanceScore(
          item.revenue,
          item.closures,
          item.totalLeads
        ),
      }));
  }, [data]);

  const sortedData = useMemo(() => {
    const cloned = [...safeData];

    if (sortMode === "revenue") {
      return cloned.sort((a, b) => b.revenue - a.revenue);
    }

    if (sortMode === "closures") {
      return cloned.sort((a, b) => b.closures - a.closures);
    }

    return cloned.sort((a, b) => b.performanceScore - a.performanceScore);
  }, [safeData, sortMode]);

  const totalRevenue = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.revenue, 0);
  }, [safeData]);

  const totalClosures = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.closures, 0);
  }, [safeData]);

  const avgConversionRate = useMemo(() => {
    if (!safeData.length) return 0;
    return (
      safeData.reduce((sum, item) => sum + item.conversionRate, 0) / safeData.length
    );
  }, [safeData]);

  const topAgent = sortedData[0] ?? null;
  const secondAgent = sortedData[1] ?? null;
  const thirdAgent = sortedData[2] ?? null;

  const hasData = sortedData.length > 0;

  return (
    <section
      style={{
        width: "100%",
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 14,
              color: "#6b7280",
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {[
            { key: "revenue", label: "Sort by Revenue" },
            { key: "closures", label: "Sort by Closures" },
            { key: "efficiency", label: "Sort by Efficiency" },
          ].map((item) => {
            const active = sortMode === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSortMode(item.key as SortMode)}
                style={{
                  border: active ? "1px solid #111827" : "1px solid #d1d5db",
                  background: active ? "#111827" : "#ffffff",
                  color: active ? "#ffffff" : "#374151",
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#eff6ff",
            border: "1px solid #dbeafe",
          }}
        >
          <div style={{ fontSize: 12, color: "#1d4ed8", marginBottom: 6 }}>
            Total Revenue
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1d4ed8" }}>
            {formatCompactCurrency(totalRevenue)}
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#f0fdf4",
            border: "1px solid #dcfce7",
          }}
        >
          <div style={{ fontSize: 12, color: "#166534", marginBottom: 6 }}>
            Total Closures
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#16a34a" }}>
            {totalClosures}
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#fff7ed",
            border: "1px solid #fed7aa",
          }}
        >
          <div style={{ fontSize: 12, color: "#9a3412", marginBottom: 6 }}>
            Avg Conversion Rate
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#9a3412" }}>
            {avgConversionRate.toFixed(2)}%
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#fdf4ff",
            border: "1px solid #f5d0fe",
          }}
        >
          <div style={{ fontSize: 12, color: "#a21caf", marginBottom: 6 }}>
            Current #1 Agent
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#a21caf" }}>
            {topAgent ? topAgent.agentName : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#a21caf", marginTop: 4 }}>
            {topAgent ? topAgent.performanceScore.toFixed(1) : "No data"} score
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {[topAgent, secondAgent, thirdAgent].map((agent, index) => {
          const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";
          const label = index === 0 ? "Top Performer" : index === 1 ? "Second Rank" : "Third Rank";

          return (
            <div
              key={label}
              style={{
                borderRadius: 16,
                padding: 14,
                background: "#ffffff",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
                {label}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
                {agent ? `${medal} ${agent.agentName}` : "-"}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                {agent
                  ? `${formatCompactCurrency(agent.revenue)} • ${agent.closures} closures`
                  : "No data"}
              </div>
            </div>
          );
        })}
      </div>

      {!hasData ? (
        <div
          style={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 18,
            border: "1px dashed #d1d5db",
            background: "#fafafa",
            color: "#6b7280",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          No top performing agents data available.
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height,
            minHeight: 320,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 16, right: 20, left: 30, bottom: 8 }}
              barCategoryGap={18}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
                tickFormatter={(value) =>
                  sortMode === "closures" ? `${value}` : `${value}`
                }
              />
              <YAxis
                type="category"
                dataKey="agentName"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={() => (
                  <span style={{ color: "#374151", fontSize: 13 }}>
                    {sortMode === "revenue"
                      ? "Revenue Ranking"
                      : sortMode === "closures"
                      ? "Closure Ranking"
                      : "Efficiency Ranking"}
                  </span>
                )}
              />
              <Bar
                dataKey={
                  sortMode === "revenue"
                    ? "revenue"
                    : sortMode === "closures"
                    ? "closures"
                    : "performanceScore"
                }
                radius={[0, 10, 10, 0]}
                name={
                  sortMode === "revenue"
                    ? "Revenue"
                    : sortMode === "closures"
                    ? "Closures"
                    : "Performance Score"
                }
              >
                {sortedData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        {sortedData.map((item, index) => (
          <div
            key={item.agentName}
            style={{
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              padding: 14,
              background: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                #{index + 1} {item.agentName}
              </span>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: getBarColor(index),
                }}
              >
                {item.performanceScore.toFixed(1)}
              </span>
            </div>

            <div
              style={{
                fontSize: 13,
                color: "#6b7280",
                lineHeight: 1.75,
              }}
            >
              <div>Revenue: {formatCompactCurrency(item.revenue)}</div>
              <div>Closures: {item.closures}</div>
              <div>Leads: {item.totalLeads}</div>
              <div>Conversion: {item.conversionRate.toFixed(2)}%</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}