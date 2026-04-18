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

type AgingBucket = "0-7 Days" | "8-15 Days" | "16-30 Days" | "30+ Days";

export type StuckLeadsChartItem = {
  stage: string;
  count: number;
  avgDays: number;
};

type StuckLeadsChartProps = {
  title?: string;
  subtitle?: string;
  height?: number;
  data?: StuckLeadsChartItem[];
};

const DEFAULT_DATA: StuckLeadsChartItem[] = [
  { stage: "New Lead", count: 18, avgDays: 4 },
  { stage: "Contacted", count: 26, avgDays: 9 },
  { stage: "Qualified", count: 21, avgDays: 14 },
  { stage: "Site Visit", count: 15, avgDays: 19 },
  { stage: "Negotiation", count: 12, avgDays: 27 },
  { stage: "Documentation", count: 8, avgDays: 34 },
];

const FILTER_OPTIONS = [
  "All",
  "New Lead",
  "Contacted",
  "Qualified",
  "Site Visit",
  "Negotiation",
  "Documentation",
] as const;

function getBarColor(avgDays: number): string {
  if (avgDays <= 7) return "#22c55e";
  if (avgDays <= 15) return "#f59e0b";
  if (avgDays <= 30) return "#f97316";
  return "#ef4444";
}

function getBucket(avgDays: number): AgingBucket {
  if (avgDays <= 7) return "0-7 Days";
  if (avgDays <= 15) return "8-15 Days";
  if (avgDays <= 30) return "16-30 Days";
  return "30+ Days";
}

function formatPercent(value: number, total: number): string {
  if (!total) return "0%";
  return `${((value / total) * 100).toFixed(1)}%`;
}

function buildAgingSummary(data: StuckLeadsChartItem[]) {
  const bucketMap: Record<AgingBucket, number> = {
    "0-7 Days": 0,
    "8-15 Days": 0,
    "16-30 Days": 0,
    "30+ Days": 0,
  };

  data.forEach((item) => {
    const bucket = getBucket(item.avgDays);
    bucketMap[bucket] += item.count;
  });

  return [
    { label: "0-7 Days" as AgingBucket, value: bucketMap["0-7 Days"], color: "#22c55e" },
    { label: "8-15 Days" as AgingBucket, value: bucketMap["8-15 Days"], color: "#f59e0b" },
    { label: "16-30 Days" as AgingBucket, value: bucketMap["16-30 Days"], color: "#f97316" },
    { label: "30+ Days" as AgingBucket, value: bucketMap["30+ Days"], color: "#ef4444" },
  ];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    payload: StuckLeadsChartItem;
    value: number;
    color: string;
  }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload;
  const bucket = getBucket(item.avgDays);

  return (
    <div
      style={{
        background: "#111827",
        color: "#ffffff",
        borderRadius: 12,
        padding: "10px 12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        border: "1px solid rgba(255,255,255,0.08)",
        minWidth: 180,
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
        <div>Stuck Leads: {item.count}</div>
        <div>Average Days: {item.avgDays}</div>
        <div>Aging Bucket: {bucket}</div>
      </div>
    </div>
  );
}

export default function StuckLeadsChart({
  title = "Stuck Leads Analysis",
  subtitle = "Track leads delayed in each pipeline stage",
  height = 380,
  data = DEFAULT_DATA,
}: StuckLeadsChartProps) {
  const [selectedFilter, setSelectedFilter] =
    useState<(typeof FILTER_OPTIONS)[number]>("All");

  const safeData = useMemo(() => {
    return (data ?? []).filter(
      (item) =>
        item &&
        typeof item.stage === "string" &&
        typeof item.count === "number" &&
        typeof item.avgDays === "number" &&
        item.count >= 0 &&
        item.avgDays >= 0
    );
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedFilter === "All") return safeData;
    return safeData.filter((item) => item.stage === selectedFilter);
  }, [safeData, selectedFilter]);

  const totalStuckLeads = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.count, 0);
  }, [safeData]);

  const averageAgingDays = useMemo(() => {
    if (!safeData.length || !totalStuckLeads) return 0;

    const weightedDays = safeData.reduce(
      (sum, item) => sum + item.avgDays * item.count,
      0
    );

    return weightedDays / totalStuckLeads;
  }, [safeData, totalStuckLeads]);

  const topStuckStage = useMemo(() => {
    if (!safeData.length) return null;
    return [...safeData].sort((a, b) => b.count - a.count)[0];
  }, [safeData]);

  const oldestStage = useMemo(() => {
    if (!safeData.length) return null;
    return [...safeData].sort((a, b) => b.avgDays - a.avgDays)[0];
  }, [safeData]);

  const agingSummary = useMemo(() => {
    return buildAgingSummary(safeData);
  }, [safeData]);

  const hasData = filteredData.length > 0 && totalStuckLeads > 0;

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
            Total Stuck Leads
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>
            {totalStuckLeads}
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
            Avg Aging Days
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1d4ed8" }}>
            {averageAgingDays.toFixed(1)}
          </div>
          <div style={{ fontSize: 13, color: "#1d4ed8", marginTop: 4 }}>
            weighted average
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
            Most Stuck Stage
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#9a3412" }}>
            {topStuckStage ? topStuckStage.stage : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#9a3412", marginTop: 4 }}>
            {topStuckStage ? `${topStuckStage.count} leads` : "No data"}
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
            Oldest Stage
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#991b1b" }}>
            {oldestStage ? oldestStage.stage : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#991b1b", marginTop: 4 }}>
            {oldestStage ? `${oldestStage.avgDays} days avg` : "No data"}
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
          No stuck leads data available.
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
                dataKey="stage"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={() => (
                  <span style={{ color: "#374151", fontSize: 13 }}>
                    Stuck Leads Count
                  </span>
                )}
              />
              <Bar
                dataKey="count"
                name="Stuck Leads"
                radius={[8, 8, 0, 0]}
              >
                {filteredData.map((entry) => (
                  <Cell
                    key={`cell-${entry.stage}`}
                    fill={getBarColor(entry.avgDays)}
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
        {agingSummary.map((item) => (
          <div
            key={item.label}
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
                  background: item.color,
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
                {item.label}
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
              {item.value}
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              {formatPercent(item.value, totalStuckLeads)} of stuck leads
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}