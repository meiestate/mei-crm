import { useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type RiskScoreDistributionItem = {
  label: RiskLevel;
  value: number;
  count?: number;
};

type RiskScoreDistributionChartProps = {
  title?: string;
  subtitle?: string;
  height?: number;
  data?: RiskScoreDistributionItem[];
};

const DEFAULT_DATA: RiskScoreDistributionItem[] = [
  { label: "Low", value: 32, count: 32 },
  { label: "Medium", value: 28, count: 28 },
  { label: "High", value: 24, count: 24 },
  { label: "Critical", value: 16, count: 16 },
];

const COLORS: Record<RiskLevel, string> = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#f97316",
  Critical: "#ef4444",
};

const FILTER_OPTIONS: Array<"All" | RiskLevel> = [
  "All",
  "Low",
  "Medium",
  "High",
  "Critical",
];

function formatPercent(value: number, total: number): string {
  if (!total) return "0%";
  return `${((value / total) * 100).toFixed(1)}%`;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: RiskScoreDistributionItem;
    value: number;
    name: string;
  }>;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload;
  const value = payload[0].value ?? item.value;
  const color = COLORS[item.label];

  return (
    <div
      style={{
        background: "#111827",
        color: "#ffffff",
        borderRadius: 12,
        padding: "10px 12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        border: "1px solid rgba(255,255,255,0.08)",
        minWidth: 160,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
          fontWeight: 600,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
          }}
        />
        <span>{item.label} Risk</span>
      </div>

      <div style={{ fontSize: 13, opacity: 0.95, lineHeight: 1.6 }}>
        <div>Value: {value}</div>
        <div>Count: {item.count ?? item.value}</div>
      </div>
    </div>
  );
}

export default function RiskScoreDistributionChart({
  title = "Risk Score Distribution",
  subtitle = "Distribution of leads/deals by risk category",
  height = 380,
  data = DEFAULT_DATA,
}: RiskScoreDistributionChartProps) {
  const [selectedFilter, setSelectedFilter] = useState<"All" | RiskLevel>("All");

  const safeData = useMemo(() => {
    return (data ?? []).filter(
      (item) =>
        item &&
        typeof item.label === "string" &&
        typeof item.value === "number" &&
        item.value >= 0
    );
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedFilter === "All") return safeData;
    return safeData.filter((item) => item.label === selectedFilter);
  }, [safeData, selectedFilter]);

  const totalValue = useMemo(() => {
    return safeData.reduce((sum, item) => sum + item.value, 0);
  }, [safeData]);

  const highestSegment = useMemo(() => {
    if (!safeData.length) return null;
    return [...safeData].sort((a, b) => b.value - a.value)[0];
  }, [safeData]);

  const criticalCount = useMemo(() => {
    return safeData
      .filter((item) => item.label === "Critical")
      .reduce((sum, item) => sum + item.value, 0);
  }, [safeData]);

  const highAndCritical = useMemo(() => {
    return safeData
      .filter((item) => item.label === "High" || item.label === "Critical")
      .reduce((sum, item) => sum + item.value, 0);
  }, [safeData]);

  const hasData = filteredData.length > 0 && totalValue > 0;

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
            {totalValue}
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#f9fafb",
            border: "1px solid #eef2f7",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
            Highest Segment
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {highestSegment ? highestSegment.label : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            {highestSegment ? `${highestSegment.value} records` : "No data"}
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#f9fafb",
            border: "1px solid #eef2f7",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
            Critical Risk
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#ef4444" }}>
            {criticalCount}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            {formatPercent(criticalCount, totalValue)} of total
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#f9fafb",
            border: "1px solid #eef2f7",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
            High + Critical
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#f97316" }}>
            {highAndCritical}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            {formatPercent(highAndCritical, totalValue)} exposure
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
          No risk distribution data available.
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
            <PieChart>
              <Pie
                data={filteredData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="48%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={4}
                stroke="#ffffff"
                strokeWidth={3}
                isAnimationActive
                labelLine={false}
                label={({ name, percent }) => {
                  const safeName = typeof name === "string" ? name : "";
                  const safePercent =
                    typeof percent === "number"
                      ? `${(percent * 100).toFixed(1)}%`
                      : "";
                  return safeName && safePercent
                    ? `${safeName}: ${safePercent}`
                    : safeName;
                }}
              >
                {filteredData.map((entry) => (
                  <Cell
                    key={`cell-${entry.label}`}
                    fill={COLORS[entry.label]}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                formatter={(value: string) => (
                  <span style={{ color: "#374151", fontSize: 13 }}>{value}</span>
                )}
              />
            </PieChart>
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
                  background: COLORS[item.label],
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
              {formatPercent(item.value, totalValue)} of total distribution
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}