import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

export type CallsVsClosuresScatterChartItem = {
  agentName: string;
  totalCalls: number;
  totalClosures: number;
  revenue?: number;
};

type CallsVsClosuresScatterChartProps = {
  title?: string;
  subtitle?: string;
  height?: number;
  data?: CallsVsClosuresScatterChartItem[];
};

const DEFAULT_DATA: CallsVsClosuresScatterChartItem[] = [
  { agentName: "Arun", totalCalls: 180, totalClosures: 14, revenue: 1850000 },
  { agentName: "Priya", totalCalls: 155, totalClosures: 12, revenue: 1620000 },
  { agentName: "Karthik", totalCalls: 210, totalClosures: 19, revenue: 2480000 },
  { agentName: "Divya", totalCalls: 132, totalClosures: 9, revenue: 1240000 },
  { agentName: "Sanjay", totalCalls: 168, totalClosures: 11, revenue: 1490000 },
  { agentName: "Meena", totalCalls: 121, totalClosures: 10, revenue: 1380000 },
];

const FILTER_OPTIONS = [
  "All",
  "Arun",
  "Priya",
  "Karthik",
  "Divya",
  "Sanjay",
  "Meena",
] as const;

const POINT_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#7c3aed",
  "#0891b2",
  "#ea580c",
  "#db2777",
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

function getClosureRate(totalCalls: number, totalClosures: number): number {
  if (!totalCalls) return 0;
  return (totalClosures / totalCalls) * 100;
}

function getAvgRevenuePerClosure(totalClosures: number, revenue: number): number {
  if (!totalClosures) return 0;
  return revenue / totalClosures;
}

function getBubbleSize(revenue: number): number {
  if (revenue >= 2500000) return 420;
  if (revenue >= 1800000) return 320;
  if (revenue >= 1200000) return 250;
  return 180;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: CallsVsClosuresScatterChartItem & {
      closureRate: number;
      revenueValue: number;
      avgRevenuePerClosure: number;
      z: number;
      fill: string;
    };
  }>;
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
        {item.agentName}
      </div>

      <div style={{ fontSize: 13, lineHeight: 1.75 }}>
        <div>Total Calls: {item.totalCalls}</div>
        <div>Total Closures: {item.totalClosures}</div>
        <div>Closure Rate: {item.closureRate.toFixed(2)}%</div>
        <div>Revenue: {formatCurrency(item.revenueValue)}</div>
        <div>Avg Revenue / Closure: {formatCurrency(item.avgRevenuePerClosure)}</div>
      </div>
    </div>
  );
}

export default function CallsVsClosuresScatterChart({
  title = "Calls vs Closures",
  subtitle = "Compare outreach volume against actual deal closures by agent",
  height = 420,
  data = DEFAULT_DATA,
}: CallsVsClosuresScatterChartProps) {
  const [selectedAgent, setSelectedAgent] =
    useState<(typeof FILTER_OPTIONS)[number]>("All");

  const safeData = useMemo(() => {
    return (data ?? [])
      .filter(
        (item) =>
          item &&
          typeof item.agentName === "string" &&
          typeof item.totalCalls === "number" &&
          typeof item.totalClosures === "number" &&
          item.totalCalls >= 0 &&
          item.totalClosures >= 0
      )
      .map((item, index) => {
        const revenueValue =
          typeof item.revenue === "number" && item.revenue >= 0 ? item.revenue : 0;

        const closureRate = getClosureRate(item.totalCalls, item.totalClosures);

        return {
          ...item,
          revenueValue,
          closureRate,
          avgRevenuePerClosure: getAvgRevenuePerClosure(
            item.totalClosures,
            revenueValue
          ),
          x: item.totalCalls,
          y: item.totalClosures,
          z: getBubbleSize(revenueValue),
          fill: POINT_COLORS[index % POINT_COLORS.length],
        };
      });
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedAgent === "All") return safeData;
    return safeData.filter((item) => item.agentName === selectedAgent);
  }, [safeData, selectedAgent]);

  const totalCalls = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.totalCalls, 0);
  }, [safeData]);

  const totalClosures = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.totalClosures, 0);
  }, [safeData]);

  const totalRevenue = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.revenueValue, 0);
  }, [safeData]);

  const overallClosureRate = useMemo(() => {
    return getClosureRate(totalCalls, totalClosures);
  }, [totalCalls, totalClosures]);

  const topCloser = useMemo(() => {
    if (!safeData.length) return null;
    return [...safeData].sort((a, b) => b.totalClosures - a.totalClosures)[0];
  }, [safeData]);

  const highestCaller = useMemo(() => {
    if (!safeData.length) return null;
    return [...safeData].sort((a, b) => b.totalCalls - a.totalCalls)[0];
  }, [safeData]);

  const bestEfficiency = useMemo(() => {
    if (!safeData.length) return null;
    return [...safeData].sort((a, b) => b.closureRate - a.closureRate)[0];
  }, [safeData]);

  const hasData = filteredData.length > 0;

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
          {FILTER_OPTIONS.map((option) => {
            const active = selectedAgent === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedAgent(option)}
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
                {option}
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
            Total Calls
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1d4ed8" }}>
            {totalCalls}
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
            Overall Closure Rate
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#9a3412" }}>
            {overallClosureRate.toFixed(2)}%
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
            Total Revenue
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#a21caf" }}>
            {formatCompactCurrency(totalRevenue)}
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
        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
            Top Closer
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {topCloser ? topCloser.agentName : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            {topCloser ? `${topCloser.totalClosures} closures` : "No data"}
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
            Highest Caller
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {highestCaller ? highestCaller.agentName : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            {highestCaller ? `${highestCaller.totalCalls} calls` : "No data"}
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
            Best Call Efficiency
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {bestEfficiency ? bestEfficiency.agentName : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            {bestEfficiency ? `${bestEfficiency.closureRate.toFixed(2)}% rate` : "No data"}
          </div>
        </div>
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
          No calls vs closures data available.
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
            <ScatterChart margin={{ top: 16, right: 20, bottom: 12, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                dataKey="x"
                name="Calls"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
                label={{
                  value: "Total Calls",
                  position: "insideBottom",
                  offset: -4,
                  style: { fill: "#6b7280", fontSize: 12 },
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Closures"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
                label={{
                  value: "Total Closures",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#6b7280", fontSize: 12 },
                }}
              />
              <ZAxis type="number" dataKey="z" range={[120, 420]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
              <Legend
                formatter={() => (
                  <span style={{ color: "#374151", fontSize: 13 }}>
                    Agent Performance Bubble
                  </span>
                )}
              />
              <Scatter name="Agents" data={filteredData}>
                {filteredData.map((entry) => (
                  <Cell key={`cell-${entry.agentName}`} fill={entry.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 12,
        }}
      >
        {safeData.map((item) => (
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
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: item.fill,
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {item.agentName}
              </span>
            </div>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.1,
              }}
            >
              {item.totalClosures}
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 13,
                color: "#6b7280",
                lineHeight: 1.75,
              }}
            >
              <div>Calls: {item.totalCalls}</div>
              <div>Closure Rate: {item.closureRate.toFixed(2)}%</div>
              <div>Revenue: {formatCompactCurrency(item.revenueValue)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}