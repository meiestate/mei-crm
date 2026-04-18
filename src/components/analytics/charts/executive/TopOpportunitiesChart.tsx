// src/components/analytics/charts/executive/TopOpportunitiesChart.tsx

import type { CSSProperties, ReactNode } from "react";
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
  type LabelProps,
} from "recharts";

export type OpportunityStage =
  | "new"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export type TopOpportunityDatum = {
  id: string;
  title: string;
  accountName: string;
  owner: string;
  stage: OpportunityStage;
  expectedValue: number;
  probability: number;
  closeDate: string;
  source?: string;
  location?: string;
};

type TopOpportunitiesChartProps = {
  data?: TopOpportunityDatum[];
  title?: string;
  subtitle?: string;
  height?: number;
  maxItems?: number;
  currency?: string;
  loading?: boolean;
  emptyMessage?: string;
  showLegend?: boolean;
};

type ChartRow = TopOpportunityDatum & {
  shortTitle: string;
  weightedValue: number;
  stageLabel: string;
};

type TooltipPayloadItem = {
  payload?: ChartRow;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  currency: string;
};

type ProbabilityLabelRendererProps = LabelProps & {
  rows: ChartRow[];
};

const DEFAULT_HEIGHT = 420;
const DEFAULT_CURRENCY = "INR";

const mockData: TopOpportunityDatum[] = [
  {
    id: "opp-001",
    title: "Prestige Lakeside Villa Block Deal",
    accountName: "Arun Developers",
    owner: "Kiran",
    stage: "negotiation",
    expectedValue: 18500000,
    probability: 82,
    closeDate: "2026-05-12",
    source: "Broker Referral",
    location: "Whitefield",
  },
  {
    id: "opp-002",
    title: "Sobha Premium Towers Investor Bundle",
    accountName: "Vasanth Holdings",
    owner: "Meena",
    stage: "proposal",
    expectedValue: 15800000,
    probability: 71,
    closeDate: "2026-05-28",
    source: "Direct",
    location: "Sarjapur",
  },
  {
    id: "opp-003",
    title: "Godrej Plots Strategic Purchase",
    accountName: "Skyline Capital",
    owner: "Ravi",
    stage: "qualified",
    expectedValue: 12600000,
    probability: 63,
    closeDate: "2026-06-05",
    source: "Campaign",
    location: "Devanahalli",
  },
  {
    id: "opp-004",
    title: "Brigade Tech Park Lease Portfolio",
    accountName: "Nova Workspace",
    owner: "Harish",
    stage: "proposal",
    expectedValue: 9800000,
    probability: 57,
    closeDate: "2026-06-19",
    source: "Inbound",
    location: "ORR",
  },
  {
    id: "opp-005",
    title: "Adarsh Luxury Residences Bulk Closure",
    accountName: "Prime Nest",
    owner: "Divya",
    stage: "new",
    expectedValue: 8400000,
    probability: 42,
    closeDate: "2026-06-30",
    source: "Partner Network",
    location: "HSR Layout",
  },
];

const cardStyle: CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 20,
  padding: 20,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 700,
  color: "#0F172A",
};

const subtitleStyle: CSSProperties = {
  margin: "6px 0 0",
  fontSize: 13,
  color: "#64748B",
  lineHeight: 1.6,
};

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number): string {
  const absolute = Math.abs(value);

  if (absolute >= 1_00_00_000) {
    return `${(value / 1_00_00_000).toFixed(1)} Cr`;
  }

  if (absolute >= 1_00_000) {
    return `${(value / 1_00_000).toFixed(1)} L`;
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatProbability(value: number): string {
  return `${Math.round(value)}%`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function truncate(value: string, maxLength = 24): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}

function getStageLabel(stage: OpportunityStage): string {
  switch (stage) {
    case "new":
      return "New";
    case "qualified":
      return "Qualified";
    case "proposal":
      return "Proposal";
    case "negotiation":
      return "Negotiation";
    case "won":
      return "Won";
    case "lost":
      return "Lost";
    default:
      return "Unknown";
  }
}

function getStageColor(stage: OpportunityStage): string {
  switch (stage) {
    case "won":
      return "#16A34A";
    case "negotiation":
      return "#2563EB";
    case "proposal":
      return "#7C3AED";
    case "qualified":
      return "#EA580C";
    case "new":
      return "#0891B2";
    case "lost":
      return "#DC2626";
    default:
      return "#64748B";
  }
}

function getProbabilityColor(probability: number): string {
  if (probability >= 80) return "#16A34A";
  if (probability >= 65) return "#2563EB";
  if (probability >= 50) return "#F59E0B";
  return "#EF4444";
}

function buildRows(data: TopOpportunityDatum[], maxItems: number): ChartRow[] {
  return [...data]
    .map((item) => ({
      ...item,
      shortTitle: truncate(item.title, 24),
      weightedValue: Math.round((item.expectedValue * item.probability) / 100),
      stageLabel: getStageLabel(item.stage),
    }))
    .sort((a, b) => b.expectedValue - a.expectedValue)
    .slice(0, maxItems);
}

function SummaryBadge({
  label,
  value,
  background,
  color,
  borderColor,
}: {
  label: string;
  value: string;
  background: string;
  color: string;
  borderColor: string;
}) {
  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: 999,
        background,
        color,
        border: `1px solid ${borderColor}`,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}: {value}
    </div>
  );
}

function TooltipLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <span>{label}</span>
      <span style={{ color: "#FFFFFF", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function getTooltipRow(payload?: TooltipPayloadItem[]): ChartRow | null {
  if (!payload || payload.length === 0) {
    return null;
  }

  const firstItem = payload[0];
  if (!firstItem || typeof firstItem !== "object") {
    return null;
  }

  const row = firstItem.payload;
  if (!row || typeof row !== "object") {
    return null;
  }

  return row;
}

function CustomTooltip({ active, payload, currency }: CustomTooltipProps) {
  if (!active) {
    return null;
  }

  const row = getTooltipRow(payload);

  if (!row) {
    return null;
  }

  return (
    <div
      style={{
        background: "#0F172A",
        border: "1px solid #1E293B",
        borderRadius: 14,
        padding: 14,
        minWidth: 260,
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.25)",
      }}
    >
      <div
        style={{
          color: "#FFFFFF",
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 10,
          lineHeight: 1.5,
        }}
      >
        {row.title}
      </div>

      <div
        style={{
          display: "grid",
          gap: 6,
          fontSize: 12,
          color: "#CBD5E1",
        }}
      >
        <TooltipLine label="Account" value={row.accountName} />
        <TooltipLine label="Owner" value={row.owner} />
        <TooltipLine label="Stage" value={row.stageLabel} />
        <TooltipLine
          label="Deal Value"
          value={formatCurrency(row.expectedValue, currency)}
        />
        <TooltipLine
          label="Weighted"
          value={formatCurrency(row.weightedValue, currency)}
        />
        <TooltipLine
          label="Probability"
          value={formatProbability(row.probability)}
        />
        <TooltipLine label="Close Date" value={formatDate(row.closeDate)} />
      </div>
    </div>
  );
}

function ValueTextLabel({ x, y, width, height, value }: LabelProps) {
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number" ||
    typeof value !== "number"
  ) {
    return null;
  }

  return (
    <text
      x={x + width + 8}
      y={y + height / 2}
      fill="#334155"
      fontSize={12}
      fontWeight={700}
      dominantBaseline="middle"
    >
      {formatCompactCurrency(value)}
    </text>
  );
}

function ProbabilityTextLabel({
  x,
  y,
  width,
  height,
  index,
  rows,
}: ProbabilityLabelRendererProps) {
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number" ||
    typeof index !== "number"
  ) {
    return null;
  }

  const row = rows[index];

  if (!row) {
    return null;
  }

  const color = getProbabilityColor(row.probability);

  return (
    <g>
      <rect
        x={x + width + 92}
        y={y + height / 2 - 12}
        rx={999}
        ry={999}
        width={52}
        height={24}
        fill="#FFFFFF"
        stroke={color}
        strokeWidth={1}
      />
      <text
        x={x + width + 118}
        y={y + height / 2}
        fill={color}
        fontSize={11}
        fontWeight={800}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {formatProbability(row.probability)}
      </text>
    </g>
  );
}

export default function TopOpportunitiesChart({
  data = mockData,
  title = "Top Opportunities",
  subtitle = "High-value opportunities ranked by deal size, with weighted pipeline and conversion confidence.",
  height = DEFAULT_HEIGHT,
  maxItems = 5,
  currency = DEFAULT_CURRENCY,
  loading = false,
  emptyMessage = "No top opportunities available right now.",
  showLegend = true,
}: TopOpportunitiesChartProps) {
  const chartData = buildRows(data, maxItems);

  const totalPipeline = chartData.reduce(
    (sum, item) => sum + item.expectedValue,
    0
  );
  const totalWeighted = chartData.reduce(
    (sum, item) => sum + item.weightedValue,
    0
  );
  const avgProbability =
    chartData.length > 0
      ? Math.round(
          chartData.reduce((sum, item) => sum + item.probability, 0) /
            chartData.length
        )
      : 0;

  if (loading) {
    return (
      <section
        style={{
          ...cardStyle,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748B",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Loading top opportunities...
      </section>
    );
  }

  if (chartData.length === 0) {
    return (
      <section style={cardStyle}>
        <h3 style={titleStyle}>{title}</h3>
        <p style={subtitleStyle}>{subtitle}</p>

        <div
          style={{
            marginTop: 18,
            height,
            border: "1px dashed #CBD5E1",
            borderRadius: 16,
            background: "#F8FAFC",
            color: "#64748B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 600,
            textAlign: "center",
            padding: 24,
          }}
        >
          {emptyMessage}
        </div>
      </section>
    );
  }

  return (
    <section style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h3 style={titleStyle}>{title}</h3>
          <p style={subtitleStyle}>{subtitle}</p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <SummaryBadge
            label="Pipeline"
            value={formatCompactCurrency(totalPipeline)}
            color="#1D4ED8"
            background="#EFF6FF"
            borderColor="#DBEAFE"
          />
          <SummaryBadge
            label="Weighted"
            value={formatCompactCurrency(totalWeighted)}
            color="#15803D"
            background="#F0FDF4"
            borderColor="#DCFCE7"
          />
          <SummaryBadge
            label="Avg Chance"
            value={formatProbability(avgProbability)}
            color="#9A3412"
            background="#FFF7ED"
            borderColor="#FED7AA"
          />
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 160, left: 12, bottom: 8 }}
            barCategoryGap="18%"
          >
            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              type="number"
              axisLine={{ stroke: "#CBD5E1" }}
              tickLine={{ stroke: "#CBD5E1" }}
              tick={{ fill: "#64748B", fontSize: 12 }}
              tickFormatter={(value: number | string) =>
                typeof value === "number"
                  ? formatCompactCurrency(value)
                  : String(value ?? "")
              }
            />

            <YAxis
              type="category"
              dataKey="shortTitle"
              width={170}
              axisLine={{ stroke: "#CBD5E1" }}
              tickLine={{ stroke: "#CBD5E1" }}
              tick={{ fill: "#334155", fontSize: 12 }}
            />

            <Tooltip content={<CustomTooltip currency={currency} />} />

            <Bar dataKey="expectedValue" radius={[0, 10, 10, 0]} name="Deal Value">
              {chartData.map((item) => (
                <Cell key={item.id} fill={getProbabilityColor(item.probability)} />
              ))}

              <LabelList
                dataKey="expectedValue"
                position="right"
                content={(props: LabelProps) => <ValueTextLabel {...props} />}
              />

              <LabelList
                dataKey="expectedValue"
                position="right"
                content={(props: LabelProps) => (
                  <ProbabilityTextLabel {...props} rows={chartData} />
                )}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {showLegend ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 16,
          }}
        >
          {[
            { label: "80%+ Strong", color: "#16A34A" },
            { label: "65–79% Good", color: "#2563EB" },
            { label: "50–64% Medium", color: "#F59E0B" },
            { label: "Below 50% Risky", color: "#EF4444" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                color: "#475569",
                fontWeight: 600,
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
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gap: 10,
        }}
      >
        {chartData.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              padding: "12px 14px",
              borderRadius: 16,
              border: "1px solid #E2E8F0",
              background: "#F8FAFC",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0F172A",
                  marginBottom: 4,
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  fontSize: 12,
                  color: "#64748B",
                }}
              >
                <span>{item.accountName}</span>
                <span>•</span>
                <span>{item.owner}</span>
                <span>•</span>
                <span>{item.location ?? "—"}</span>
                <span>•</span>
                <span>{formatDate(item.closeDate)}</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: getStageColor(item.stage),
                  background: "#FFFFFF",
                  border: `1px solid ${getStageColor(item.stage)}22`,
                }}
              >
                {item.stageLabel}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: getProbabilityColor(item.probability),
                  background: "#FFFFFF",
                  border: `1px solid ${getProbabilityColor(item.probability)}22`,
                }}
              >
                {formatProbability(item.probability)}
              </span>

              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#0F172A",
                }}
              >
                {formatCurrency(item.expectedValue, currency)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}