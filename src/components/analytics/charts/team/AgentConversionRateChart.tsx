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

export type AgentConversionRateChartItem = {
  agentName: string;
  totalLeads: number;
  convertedLeads: number;
};

type AgentConversionRateChartProps = {
  title?: string;
  subtitle?: string;
  height?: number;
  data?: AgentConversionRateChartItem[];
};

const DEFAULT_DATA: AgentConversionRateChartItem[] = [
  { agentName: "Arun", totalLeads: 120, convertedLeads: 34 },
  { agentName: "Priya", totalLeads: 98, convertedLeads: 29 },
  { agentName: "Karthik", totalLeads: 135, convertedLeads: 41 },
  { agentName: "Divya", totalLeads: 86, convertedLeads: 19 },
  { agentName: "Sanjay", totalLeads: 112, convertedLeads: 31 },
  { agentName: "Meena", totalLeads: 76, convertedLeads: 24 },
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

function getConversionRate(totalLeads: number, convertedLeads: number): number {
  if (!totalLeads) return 0;
  return (convertedLeads / totalLeads) * 100;
}

function getBarColor(rate: number): string {
  if (rate >= 35) return "#16a34a";
  if (rate >= 25) return "#f59e0b";
  if (rate >= 15) return "#f97316";
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
    payload: AgentConversionRateChartItem & { conversionRate: number };
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
        minWidth: 200,
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
        <div>Total Leads: {item.totalLeads}</div>
        <div>Converted Leads: {item.convertedLeads}</div>
        <div>Conversion Rate: {formatPercent(item.conversionRate)}</div>
      </div>
    </div>
  );
}

export default function AgentConversionRateChart({
  title = "Agent Conversion Rate",
  subtitle = "Track lead-to-conversion performance by agent",
  height = 380,
  data = DEFAULT_DATA,
}: AgentConversionRateChartProps) {
  const [selectedFilter, setSelectedFilter] =
    useState<(typeof FILTER_OPTIONS)[number]>("All");

  const safeData = useMemo(() => {
    return (data ?? [])
      .filter(
        (item) =>
          item &&
          typeof item.agentName === "string" &&
          typeof item.totalLeads === "number" &&
          typeof item.convertedLeads === "number" &&
          item.totalLeads >= 0 &&
          item.convertedLeads >= 0
      )
      .map((item) => ({
        ...item,
        conversionRate: getConversionRate(item.totalLeads, item.convertedLeads),
      }));
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedFilter === "All") return safeData;
    return safeData.filter((item) => item.agentName === selectedFilter);
  }, [safeData, selectedFilter]);

  const totalLeads = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.totalLeads, 0);
  }, [safeData]);

  const totalConverted = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.convertedLeads, 0);
  }, [safeData]);

  const overallConversionRate = useMemo(() => {
    return getConversionRate(totalLeads, totalConverted);
  }, [totalLeads, totalConverted]);

  const topPerformer = useMemo(() => {
    if (!safeData.length) return null;
    return [...safeData].sort((a, b) => b.conversionRate - a.conversionRate)[0];
  }, [safeData]);

  const highestVolumeAgent = useMemo(() => {
    if (!safeData.length) return null;
    return [...safeData].sort((a, b) => b.totalLeads - a.totalLeads)[0];
  }, [safeData]);

  const totalAgents = safeData.length;
  const hasData = filteredData.length > 0 && totalAgents > 0;

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
            background: "#f9fafb",
            border: "1px solid #eef2f7",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
            Total Agents
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>
            {totalAgents}
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#eff6ff",
            border: "1px solid #dbeafe",
          }}
        >
          <div style={{ fontSize: 12, color: "#1d4ed8", marginBottom: 6 }}>
            Total Leads
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1d4ed8" }}>
            {totalLeads}
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
            Converted Leads
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#16a34a" }}>
            {totalConverted}
          </div>
          <div style={{ fontSize: 13, color: "#166534", marginTop: 4 }}>
            overall win count
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
            Overall Conversion
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#9a3412" }}>
            {formatPercent(overallConversionRate)}
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
            Top Performer
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {topPerformer ? topPerformer.agentName : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            {topPerformer
              ? `${formatPercent(topPerformer.conversionRate)} conversion`
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
            Highest Lead Volume
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {highestVolumeAgent ? highestVolumeAgent.agentName : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            {highestVolumeAgent
              ? `${highestVolumeAgent.totalLeads} total leads`
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
          No agent conversion data available.
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
                    Conversion Rate
                  </span>
                )}
              />
              <Bar
                dataKey="conversionRate"
                name="Conversion Rate"
                radius={[8, 8, 0, 0]}
              >
                {filteredData.map((entry) => (
                  <Cell
                    key={`cell-${entry.agentName}`}
                    fill={getBarColor(entry.conversionRate)}
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
                color: getBarColor(item.conversionRate),
                lineHeight: 1.1,
              }}
            >
              {formatPercent(item.conversionRate)}
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 13,
                color: "#6b7280",
                lineHeight: 1.7,
              }}
            >
              <div>Total Leads: {item.totalLeads}</div>
              <div>Converted: {item.convertedLeads}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}