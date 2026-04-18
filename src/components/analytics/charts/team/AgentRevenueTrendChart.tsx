import { useMemo, useState } from "react";
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

export type AgentRevenueTrendChartItem = {
  month: string;
  [agentName: string]: string | number;
};

type AgentRevenueTrendChartProps = {
  title?: string;
  subtitle?: string;
  height?: number;
  data?: AgentRevenueTrendChartItem[];
};

const DEFAULT_DATA: AgentRevenueTrendChartItem[] = [
  { month: "Jan", Arun: 420000, Priya: 380000, Karthik: 510000, Divya: 290000 },
  { month: "Feb", Arun: 460000, Priya: 395000, Karthik: 545000, Divya: 310000 },
  { month: "Mar", Arun: 480000, Priya: 430000, Karthik: 590000, Divya: 345000 },
  { month: "Apr", Arun: 510000, Priya: 455000, Karthik: 610000, Divya: 360000 },
  { month: "May", Arun: 545000, Priya: 470000, Karthik: 655000, Divya: 390000 },
  { month: "Jun", Arun: 580000, Priya: 495000, Karthik: 690000, Divya: 420000 },
];

const AGENT_COLORS = [
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
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }
  return `₹${value}`;
}

function getAgentKeys(data: AgentRevenueTrendChartItem[]): string[] {
  if (!data.length) return [];
  return Object.keys(data[0]).filter((key) => key !== "month");
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const sortedPayload = [...payload].sort(
    (a, b) => (b.value ?? 0) - (a.value ?? 0)
  );

  const total = sortedPayload.reduce((sum, item) => sum + (item.value ?? 0), 0);

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

      <div style={{ display: "grid", gap: 6 }}>
        {sortedPayload.map((entry) => (
          <div
            key={entry.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              fontSize: 13,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: entry.color,
                  display: "inline-block",
                }}
              />
              <span>{entry.name}</span>
            </div>
            <strong>{formatCurrency(entry.value ?? 0)}</strong>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          fontSize: 12,
          opacity: 0.9,
        }}
      >
        Total: {formatCurrency(total)}
      </div>
    </div>
  );
}

export default function AgentRevenueTrendChart({
  title = "Agent Revenue Trend",
  subtitle = "Track monthly revenue performance by agent",
  height = 400,
  data = DEFAULT_DATA,
}: AgentRevenueTrendChartProps) {
  const [selectedAgent, setSelectedAgent] = useState<string>("All");

  const safeData = useMemo(() => {
    return (data ?? []).filter(
      (item) =>
        item &&
        typeof item.month === "string" &&
        Object.keys(item).some((key) => key !== "month" && typeof item[key] === "number")
    );
  }, [data]);

  const agentKeys = useMemo(() => getAgentKeys(safeData), [safeData]);

  const visibleAgentKeys = useMemo(() => {
    if (selectedAgent === "All") return agentKeys;
    return agentKeys.filter((agent) => agent === selectedAgent);
  }, [agentKeys, selectedAgent]);

  const totalRevenue = useMemo(() => {
    return safeData.reduce((sum, item) => {
      return (
        sum +
        agentKeys.reduce((agentSum, agent) => {
          const value = item[agent];
          return agentSum + (typeof value === "number" ? value : 0);
        }, 0)
      );
    }, 0);
  }, [safeData, agentKeys]);

  const agentTotals = useMemo(() => {
    return agentKeys.map((agent) => {
      const total = safeData.reduce((sum, item) => {
        const value = item[agent];
        return sum + (typeof value === "number" ? value : 0);
      }, 0);

      return { agent, total };
    });
  }, [safeData, agentKeys]);

  const topAgent = useMemo(() => {
    if (!agentTotals.length) return null;
    return [...agentTotals].sort((a, b) => b.total - a.total)[0];
  }, [agentTotals]);

  const bestMonth = useMemo(() => {
    if (!safeData.length) return null;

    const monthTotals = safeData.map((item) => {
      const total = agentKeys.reduce((sum, agent) => {
        const value = item[agent];
        return sum + (typeof value === "number" ? value : 0);
      }, 0);

      return {
        month: item.month,
        total,
      };
    });

    return monthTotals.sort((a, b) => b.total - a.total)[0];
  }, [safeData, agentKeys]);

  const averageMonthlyRevenue = useMemo(() => {
    if (!safeData.length) return 0;
    return totalRevenue / safeData.length;
  }, [totalRevenue, safeData]);

  const hasData = safeData.length > 0 && agentKeys.length > 0;

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
          <button
            type="button"
            onClick={() => setSelectedAgent("All")}
            style={{
              border: selectedAgent === "All" ? "1px solid #111827" : "1px solid #d1d5db",
              background: selectedAgent === "All" ? "#111827" : "#ffffff",
              color: selectedAgent === "All" ? "#ffffff" : "#374151",
              borderRadius: 999,
              padding: "8px 12px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            All
          </button>

          {agentKeys.map((agent) => (
            <button
              key={agent}
              type="button"
              onClick={() => setSelectedAgent(agent)}
              style={{
                border:
                  selectedAgent === agent ? "1px solid #111827" : "1px solid #d1d5db",
                background: selectedAgent === agent ? "#111827" : "#ffffff",
                color: selectedAgent === agent ? "#ffffff" : "#374151",
                borderRadius: 999,
                padding: "8px 12px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {agent}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
            Avg Monthly Revenue
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#16a34a" }}>
            {formatCompactCurrency(averageMonthlyRevenue)}
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
            Top Agent
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#9a3412" }}>
            {topAgent ? topAgent.agent : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#9a3412", marginTop: 4 }}>
            {topAgent ? formatCompactCurrency(topAgent.total) : "No data"}
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
            Best Month
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#a21caf" }}>
            {bestMonth ? bestMonth.month : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#a21caf", marginTop: 4 }}>
            {bestMonth ? formatCompactCurrency(bestMonth.total) : "No data"}
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
          No agent revenue trend data available.
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
            <LineChart
              data={safeData}
              margin={{ top: 16, right: 20, left: 10, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
              />
              <YAxis
                tickFormatter={(value: number) => formatCompactCurrency(value)}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value: string) => (
                  <span style={{ color: "#374151", fontSize: 13 }}>{value}</span>
                )}
              />

              {visibleAgentKeys.map((agent, index) => (
                <Line
                  key={agent}
                  type="monotone"
                  dataKey={agent}
                  name={agent}
                  stroke={AGENT_COLORS[index % AGENT_COLORS.length]}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
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
        {agentTotals.map((item, index) => (
          <div
            key={item.agent}
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
                  background: AGENT_COLORS[index % AGENT_COLORS.length],
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
                {item.agent}
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
              {formatCompactCurrency(item.total)}
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              total booked revenue
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}