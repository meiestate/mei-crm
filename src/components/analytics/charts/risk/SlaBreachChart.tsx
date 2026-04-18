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

type SlaSeverity = "Low" | "Medium" | "High" | "Critical";

export type SlaBreachChartItem = {
  label: string;
  withinSla: number;
  breached: number;
};

type SlaBreachChartProps = {
  title?: string;
  subtitle?: string;
  height?: number;
  data?: SlaBreachChartItem[];
};

const DEFAULT_DATA: SlaBreachChartItem[] = [
  { label: "Leads", withinSla: 84, breached: 16 },
  { label: "Tasks", withinSla: 71, breached: 29 },
  { label: "Tickets", withinSla: 63, breached: 37 },
  { label: "Deals", withinSla: 76, breached: 24 },
  { label: "Follow-ups", withinSla: 69, breached: 31 },
];

const FILTER_OPTIONS = ["All", "Leads", "Tasks", "Tickets", "Deals", "Follow-ups"] as const;

const BAR_COLORS = {
  withinSla: "#22c55e",
  breached: "#ef4444",
};

function formatPercent(value: number, total: number): string {
  if (!total) return "0%";
  return `${((value / total) * 100).toFixed(1)}%`;
}

function calculateSeverity(
  totalBreached: number
): Array<{ label: SlaSeverity; value: number; color: string }> {
  const low = Math.round(totalBreached * 0.2);
  const medium = Math.round(totalBreached * 0.3);
  const high = Math.round(totalBreached * 0.3);
  const critical = Math.max(totalBreached - low - medium - high, 0);

  return [
    { label: "Low", value: low, color: "#84cc16" },
    { label: "Medium", value: medium, color: "#f59e0b" },
    { label: "High", value: high, color: "#f97316" },
    { label: "Critical", value: critical, color: "#ef4444" },
  ];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const total = payload.reduce((sum, item) => sum + (item.value ?? 0), 0);

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

      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            fontSize: 13,
            marginBottom: 6,
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
            <span>{entry.dataKey === "withinSla" ? "Within SLA" : "Breached"}</span>
          </div>
          <strong>{entry.value}</strong>
        </div>
      ))}

      <div
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          fontSize: 12,
          opacity: 0.9,
        }}
      >
        Total: {total}
      </div>
    </div>
  );
}

export default function SlaBreachChart({
  title = "SLA Breach Analysis",
  subtitle = "Compare items completed within SLA against breached records",
  height = 380,
  data = DEFAULT_DATA,
}: SlaBreachChartProps) {
  const [selectedFilter, setSelectedFilter] =
    useState<(typeof FILTER_OPTIONS)[number]>("All");

  const safeData = useMemo(() => {
    return (data ?? []).filter(
      (item) =>
        item &&
        typeof item.label === "string" &&
        typeof item.withinSla === "number" &&
        typeof item.breached === "number" &&
        item.withinSla >= 0 &&
        item.breached >= 0
    );
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedFilter === "All") return safeData;
    return safeData.filter((item) => item.label === selectedFilter);
  }, [safeData, selectedFilter]);

  const totalWithinSla = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.withinSla, 0);
  }, [safeData]);

  const totalBreached = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.breached, 0);
  }, [safeData]);

  const totalRecords = totalWithinSla + totalBreached;

  const breachRate = useMemo(() => {
    if (!totalRecords) return 0;
    return (totalBreached / totalRecords) * 100;
  }, [totalBreached, totalRecords]);

  const worstCategory = useMemo(() => {
    if (!safeData.length) return null;
    return [...safeData].sort((a, b) => b.breached - a.breached)[0];
  }, [safeData]);

  const severityData = useMemo(() => {
    return calculateSeverity(totalBreached);
  }, [totalBreached]);

  const hasData = filteredData.length > 0 && totalRecords > 0;

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
            Total Records
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>
            {totalRecords}
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
            Within SLA
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#16a34a" }}>
            {totalWithinSla}
          </div>
          <div style={{ fontSize: 13, color: "#166534", marginTop: 4 }}>
            {formatPercent(totalWithinSla, totalRecords)} of total
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
            Breached
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#dc2626" }}>
            {totalBreached}
          </div>
          <div style={{ fontSize: 13, color: "#991b1b", marginTop: 4 }}>
            {breachRate.toFixed(1)}% breach rate
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
            Worst Category
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#9a3412" }}>
            {worstCategory ? worstCategory.label : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#9a3412", marginTop: 4 }}>
            {worstCategory ? `${worstCategory.breached} breaches` : "No data"}
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
          No SLA breach data available.
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
                dataKey="label"
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
                formatter={(value: string) => (
                  <span style={{ color: "#374151", fontSize: 13 }}>
                    {value === "withinSla" ? "Within SLA" : "Breached"}
                  </span>
                )}
              />
              <Bar
                dataKey="withinSla"
                name="Within SLA"
                radius={[8, 8, 0, 0]}
                fill={BAR_COLORS.withinSla}
              >
                {filteredData.map((entry) => (
                  <Cell
                    key={`within-${entry.label}`}
                    fill={BAR_COLORS.withinSla}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="breached"
                name="Breached"
                radius={[8, 8, 0, 0]}
                fill={BAR_COLORS.breached}
              >
                {filteredData.map((entry) => (
                  <Cell
                    key={`breached-${entry.label}`}
                    fill={BAR_COLORS.breached}
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
        {severityData.map((item) => (
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
                {item.label} Severity
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
              {formatPercent(item.value, totalBreached)} of breached records
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}