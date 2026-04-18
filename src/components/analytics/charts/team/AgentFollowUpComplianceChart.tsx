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

export type AgentFollowUpComplianceChartItem = {
  agentName: string;
  scheduledFollowUps: number;
  completedOnTime: number;
  overdueFollowUps?: number;
};

type AgentFollowUpComplianceChartProps = {
  title?: string;
  subtitle?: string;
  height?: number;
  data?: AgentFollowUpComplianceChartItem[];
};

const DEFAULT_DATA: AgentFollowUpComplianceChartItem[] = [
  { agentName: "Arun", scheduledFollowUps: 84, completedOnTime: 72, overdueFollowUps: 12 },
  { agentName: "Priya", scheduledFollowUps: 76, completedOnTime: 63, overdueFollowUps: 13 },
  { agentName: "Karthik", scheduledFollowUps: 91, completedOnTime: 79, overdueFollowUps: 12 },
  { agentName: "Divya", scheduledFollowUps: 68, completedOnTime: 50, overdueFollowUps: 18 },
  { agentName: "Sanjay", scheduledFollowUps: 74, completedOnTime: 58, overdueFollowUps: 16 },
  { agentName: "Meena", scheduledFollowUps: 59, completedOnTime: 49, overdueFollowUps: 10 },
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

function getComplianceRate(scheduledFollowUps: number, completedOnTime: number): number {
  if (!scheduledFollowUps) return 0;
  return (completedOnTime / scheduledFollowUps) * 100;
}

function getComplianceColor(rate: number): string {
  if (rate >= 90) return "#16a34a";
  if (rate >= 75) return "#22c55e";
  if (rate >= 60) return "#f59e0b";
  if (rate >= 45) return "#f97316";
  return "#ef4444";
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    payload: AgentFollowUpComplianceChartItem & {
      complianceRate: number;
      overdueCount: number;
      missedCount: number;
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
        padding: "10px 12px",
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

      <div style={{ fontSize: 13, lineHeight: 1.7 }}>
        <div>Scheduled: {item.scheduledFollowUps}</div>
        <div>Completed On Time: {item.completedOnTime}</div>
        <div>Overdue: {item.overdueCount}</div>
        <div>Missed / Pending: {item.missedCount}</div>
        <div>Compliance Rate: {formatPercent(item.complianceRate)}</div>
      </div>
    </div>
  );
}

export default function AgentFollowUpComplianceChart({
  title = "Agent Follow-Up Compliance",
  subtitle = "Track follow-up discipline and on-time completion by agent",
  height = 380,
  data = DEFAULT_DATA,
}: AgentFollowUpComplianceChartProps) {
  const [selectedFilter, setSelectedFilter] =
    useState<(typeof FILTER_OPTIONS)[number]>("All");

  const safeData = useMemo(() => {
    return (data ?? [])
      .filter(
        (item) =>
          item &&
          typeof item.agentName === "string" &&
          typeof item.scheduledFollowUps === "number" &&
          typeof item.completedOnTime === "number" &&
          item.scheduledFollowUps >= 0 &&
          item.completedOnTime >= 0
      )
      .map((item) => {
        const overdueCount =
          typeof item.overdueFollowUps === "number" && item.overdueFollowUps >= 0
            ? item.overdueFollowUps
            : Math.max(item.scheduledFollowUps - item.completedOnTime, 0);

        const missedCount = Math.max(
          item.scheduledFollowUps - item.completedOnTime,
          0
        );

        const complianceRate = getComplianceRate(
          item.scheduledFollowUps,
          item.completedOnTime
        );

        return {
          ...item,
          overdueCount,
          missedCount,
          complianceRate,
        };
      });
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedFilter === "All") return safeData;
    return safeData.filter((item) => item.agentName === selectedFilter);
  }, [safeData, selectedFilter]);

  const totalScheduled = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.scheduledFollowUps, 0);
  }, [safeData]);

  const totalCompletedOnTime = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.completedOnTime, 0);
  }, [safeData]);

  const totalOverdue = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.overdueCount, 0);
  }, [safeData]);

  const overallComplianceRate = useMemo(() => {
    return getComplianceRate(totalScheduled, totalCompletedOnTime);
  }, [totalScheduled, totalCompletedOnTime]);

  const topCompliantAgent = useMemo(() => {
    if (!safeData.length) return null;
    return [...safeData].sort((a, b) => b.complianceRate - a.complianceRate)[0];
  }, [safeData]);

  const highestOverdueAgent = useMemo(() => {
    if (!safeData.length) return null;
    return [...safeData].sort((a, b) => b.overdueCount - a.overdueCount)[0];
  }, [safeData]);

  const hasData = filteredData.length > 0 && safeData.length > 0;

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
            const active = selectedFilter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedFilter(option)}
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
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
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
            Total Scheduled
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1d4ed8" }}>
            {totalScheduled}
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
            Completed On Time
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#16a34a" }}>
            {totalCompletedOnTime}
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#fef2f2",
            border: "1px solid #fee2e2",
          }}
        >
          <div style={{ fontSize: 12, color: "#991b1b", marginBottom: 6 }}>
            Overdue Follow-Ups
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#dc2626" }}>
            {totalOverdue}
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
            Overall Compliance
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#9a3412" }}>
            {formatPercent(overallComplianceRate)}
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
            Top Compliant Agent
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {topCompliantAgent ? topCompliantAgent.agentName : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            {topCompliantAgent
              ? `${formatPercent(topCompliantAgent.complianceRate)} compliance`
              : "No data"}
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
            Highest Overdue Risk
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {highestOverdueAgent ? highestOverdueAgent.agentName : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            {highestOverdueAgent
              ? `${highestOverdueAgent.overdueCount} overdue follow-ups`
              : "No data"}
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
          No follow-up compliance data available.
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
              data={filteredData}
              margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
              barCategoryGap={24}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="agentName"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={() => (
                  <span style={{ color: "#374151", fontSize: 13 }}>
                    Follow-Up Compliance
                  </span>
                )}
              />
              <Bar
                dataKey="complianceRate"
                name="Compliance Rate"
                radius={[8, 8, 0, 0]}
              >
                {filteredData.map((entry) => (
                  <Cell
                    key={`cell-${entry.agentName}`}
                    fill={getComplianceColor(entry.complianceRate)}
                  />
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
                fontSize: 14,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 8,
              }}
            >
              {item.agentName}
            </div>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: getComplianceColor(item.complianceRate),
                lineHeight: 1.1,
              }}
            >
              {formatPercent(item.complianceRate)}
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 13,
                color: "#6b7280",
                lineHeight: 1.7,
              }}
            >
              <div>Scheduled: {item.scheduledFollowUps}</div>
              <div>On Time: {item.completedOnTime}</div>
              <div>Overdue: {item.overdueCount}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}