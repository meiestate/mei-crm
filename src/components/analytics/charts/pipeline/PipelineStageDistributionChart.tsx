// src/components/analytics/charts/pipeline/PipelineStageDistributionChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type PipelineStageDistributionDatum = {
  stage: string;
  count: number;
  value?: number;
  revenue?: number;
  avgAgeDays?: number;
};

type PipelineStageDistributionChartProps = {
  title?: string;
  subtitle?: string;
  data?: PipelineStageDistributionDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = {
  stage: string;
  count: number;
  value: number;
  revenue: number;
  avgAgeDays: number;
  share: number;
};

type TooltipPayloadItem = {
  payload?: ChartRow;
  value?: number | string;
  name?: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  currency: string;
};

const DEFAULT_HEIGHT = 500;
const DEFAULT_CURRENCY = "INR";

const defaultData: PipelineStageDistributionDatum[] = [
  { stage: "New Leads", count: 148, value: 12400000, revenue: 0, avgAgeDays: 3 },
  { stage: "Qualified", count: 96, value: 21800000, revenue: 0, avgAgeDays: 8 },
  { stage: "Site Visit", count: 58, value: 31400000, revenue: 0, avgAgeDays: 12 },
  { stage: "Negotiation", count: 31, value: 28700000, revenue: 0, avgAgeDays: 16 },
  { stage: "Documentation", count: 18, value: 22400000, revenue: 0, avgAgeDays: 11 },
  { stage: "Closed Won", count: 24, value: 0, revenue: 48600000, avgAgeDays: 0 },
];

const STAGE_COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#14b8a6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
];

const containerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 20,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
  border: "1px solid rgba(148,163,184,0.18)",
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
  padding: 20,
};

const headerWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 18,
  flexWrap: "wrap",
};

const titleWrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 700,
  color: "#0f172a",
  lineHeight: 1.2,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1.4,
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(59,130,246,0.10)",
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const chartWrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.15fr) minmax(280px, 0.85fr)",
  gap: 18,
  flex: 1,
  minHeight: 320,
};

const chartAreaStyle: CSSProperties = {
  minHeight: 320,
  width: "100%",
  height: "100%",
};

const sidePanelStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  alignContent: "start",
};

const loadingWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 320,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  fontSize: 14,
  fontWeight: 600,
};

const emptyWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 320,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  textAlign: "center",
  color: "#64748b",
  padding: 24,
};

const emptyTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 700,
  color: "#334155",
};

const emptyTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.5,
  maxWidth: 360,
};

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`;
  if (abs >= 100000) return `${(value / 100000).toFixed(1)} L`;
  if (abs >= 1000) return `${(value / 1000).toFixed(1)} K`;

  return `${value}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatDays(value: number): string {
  return `${value.toFixed(0)}d`;
}

function buildChartData(data: PipelineStageDistributionDatum[]): ChartRow[] {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return data.map((item) => ({
    stage: item.stage,
    count: item.count,
    value: item.value ?? 0,
    revenue: item.revenue ?? 0,
    avgAgeDays: item.avgAgeDays ?? 0,
    share: total > 0 ? Number(((item.count / total) * 100).toFixed(1)) : 0,
  }));
}

function getTooltipRow(payload?: TooltipPayloadItem[]): ChartRow | null {
  if (!payload || payload.length === 0) return null;

  const firstWithPayload = payload.find((item) => item?.payload);
  return firstWithPayload?.payload ?? null;
}

function CustomTooltip({ active, payload, currency }: CustomTooltipProps) {
  if (!active) return null;

  const row = getTooltipRow(payload);
  if (!row) return null;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(148,163,184,0.24)",
        borderRadius: 16,
        boxShadow: "0 14px 40px rgba(15,23,42,0.14)",
        padding: 14,
        minWidth: 250,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: 10,
        }}
      >
        {row.stage}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          rowGap: 8,
          columnGap: 16,
          fontSize: 13,
        }}
      >
        <span style={{ color: "#64748b" }}>Opportunities</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>{row.count}</span>

        <span style={{ color: "#64748b" }}>Stage Share</span>
        <span style={{ color: "#2563eb", fontWeight: 700 }}>
          {formatPercent(row.share)}
        </span>

        <span style={{ color: "#64748b" }}>Pipeline Value</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatCurrency(row.value, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Closed Revenue</span>
        <span style={{ color: "#15803d", fontWeight: 700 }}>
          {formatCurrency(row.revenue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Avg Stage Age</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatDays(row.avgAgeDays)}
        </span>
      </div>
    </div>
  );
}

export default function PipelineStageDistributionChart({
  title = "Pipeline Stage Distribution",
  subtitle = "See how opportunities are spread across pipeline stages, along with stage value and age",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No pipeline stage distribution data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: PipelineStageDistributionChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalOpportunities = useMemo(
    () => chartData.reduce((sum, item) => sum + item.count, 0),
    [chartData]
  );

  const totalPipelineValue = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  );

  const totalClosedRevenue = useMemo(
    () => chartData.reduce((sum, item) => sum + item.revenue, 0),
    [chartData]
  );

  const largestStage = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.count - a.count)[0] ?? null;
  }, [chartData]);

  const oldestStage = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.avgAgeDays - a.avgAgeDays)[0] ?? null;
  }, [chartData]);

  if (loading) {
    return (
      <section style={{ ...containerStyle, height }}>
        <div style={headerWrapStyle}>
          <div style={titleWrapStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>
          <div style={badgeStyle}>Loading...</div>
        </div>

        <div style={loadingWrapStyle}>Loading chart data...</div>
      </section>
    );
  }

  if (!chartData.length) {
    return (
      <section style={{ ...containerStyle, height }}>
        <div style={headerWrapStyle}>
          <div style={titleWrapStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>
        </div>

        <div style={emptyWrapStyle}>
          <p style={emptyTitleStyle}>No pipeline data</p>
          <p style={emptyTextStyle}>{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ ...containerStyle, height }}>
      <div style={headerWrapStyle}>
        <div style={titleWrapStyle}>
          <h3 style={titleStyle}>{title}</h3>
          <p style={subtitleStyle}>{subtitle}</p>
        </div>

        {showSummary ? (
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                ...badgeStyle,
                background: "rgba(14,165,233,0.10)",
                color: "#0369a1",
              }}
            >
              Opportunities: {totalOpportunities}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(59,130,246,0.10)",
                color: "#1d4ed8",
              }}
            >
              Pipeline: {formatCompactCurrency(totalPipelineValue)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(34,197,94,0.10)",
                color: "#15803d",
              }}
            >
              Revenue: {formatCompactCurrency(totalClosedRevenue)}
            </div>

            {largestStage ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(245,158,11,0.10)",
                  color: "#b45309",
                }}
              >
                Largest: {largestStage.stage}
              </div>
            ) : null}

            {oldestStage ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(239,68,68,0.10)",
                  color: "#b91c1c",
                }}
              >
                Oldest: {oldestStage.stage}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div style={chartWrapStyle}>
        <div style={chartAreaStyle}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="stage"
                cx="50%"
                cy="50%"
                innerRadius={82}
                outerRadius={132}
                paddingAngle={3}
                stroke="#ffffff"
                strokeWidth={3}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.stage}`}
                    fill={STAGE_COLORS[index % STAGE_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip currency={currency} />} />

              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  fontSize: 12,
                  color: "#334155",
                  paddingTop: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={sidePanelStyle}>
          {chartData.map((item, index) => (
            <div
              key={item.stage}
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
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: STAGE_COLORS[index % STAGE_COLORS.length],
                      display: "inline-block",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#0F172A",
                    }}
                  >
                    {item.stage}
                  </div>
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
                  <span>Count: {item.count}</span>
                  <span>•</span>
                  <span>Share: {formatPercent(item.share)}</span>
                  {item.avgAgeDays > 0 ? (
                    <>
                      <span>•</span>
                      <span>Age: {formatDays(item.avgAgeDays)}</span>
                    </>
                  ) : null}
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
                {item.value > 0 ? (
                  <span
                    style={{
                      borderRadius: 999,
                      padding: "6px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#1d4ed8",
                      background: "#ffffff",
                      border: "1px solid rgba(37,99,235,0.18)",
                    }}
                  >
                    {formatCompactCurrency(item.value)}
                  </span>
                ) : null}

                {item.revenue > 0 ? (
                  <span
                    style={{
                      borderRadius: 999,
                      padding: "6px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#15803d",
                      background: "#ffffff",
                      border: "1px solid rgba(34,197,94,0.18)",
                    }}
                  >
                    {formatCompactCurrency(item.revenue)}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}