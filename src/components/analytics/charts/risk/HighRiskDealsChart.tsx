// src/components/analytics/charts/risk/HighRiskDealsChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

type HighRiskDealsDatum = {
  dealName: string;
  owner: string;
  stage: string;
  riskScore: number;
  dealValue: number;
  daysStuck: number;
  probability?: number;
  lastActivityDays?: number;
};

type HighRiskDealsChartProps = {
  title?: string;
  subtitle?: string;
  data?: HighRiskDealsDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = HighRiskDealsDatum & {
  probability: number;
  lastActivityDays: number;
  riskLabel: string;
  compactValueLabel: string;
  exposureWeight: number;
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

const DEFAULT_HEIGHT = 560;
const DEFAULT_CURRENCY = "INR";

const defaultData: HighRiskDealsDatum[] = [
  {
    dealName: "Prestige Lakeside Villa Block A",
    owner: "Arun Kumar",
    stage: "Negotiation",
    riskScore: 92,
    dealValue: 28500000,
    daysStuck: 34,
    probability: 41,
    lastActivityDays: 9,
  },
  {
    dealName: "Whitefield Tech Park Lease Renewal",
    owner: "Divya Sharma",
    stage: "Proposal",
    riskScore: 88,
    dealValue: 17600000,
    daysStuck: 29,
    probability: 48,
    lastActivityDays: 7,
  },
  {
    dealName: "Sarjapur Premium Plot Bundle",
    owner: "Karthik Raj",
    stage: "Legal Review",
    riskScore: 95,
    dealValue: 32200000,
    daysStuck: 41,
    probability: 36,
    lastActivityDays: 12,
  },
  {
    dealName: "Hebbal Tower Corporate Sale",
    owner: "Meera Nair",
    stage: "Final Approval",
    riskScore: 84,
    dealValue: 26400000,
    daysStuck: 23,
    probability: 52,
    lastActivityDays: 6,
  },
  {
    dealName: "Electronic City Warehouse Deal",
    owner: "Sanjay Patel",
    stage: "Negotiation",
    riskScore: 90,
    dealValue: 19800000,
    daysStuck: 31,
    probability: 44,
    lastActivityDays: 8,
  },
  {
    dealName: "HSR Boutique Office Floor",
    owner: "Nisha Reddy",
    stage: "Commercial Terms",
    riskScore: 81,
    dealValue: 15400000,
    daysStuck: 19,
    probability: 57,
    lastActivityDays: 5,
  },
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

const chartAreaStyle: CSSProperties = {
  flex: 1,
  minHeight: 360,
};

const loadingWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 360,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  fontSize: 14,
  fontWeight: 600,
};

const emptyWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 360,
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

function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`;
  if (abs >= 100000) return `${(value / 100000).toFixed(1)} L`;
  if (abs >= 1000) return `${(value / 1000).toFixed(1)} K`;

  return `${value}`;
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function getRiskColor(score: number): string {
  if (score >= 90) return "#dc2626";
  if (score >= 80) return "#f97316";
  if (score >= 70) return "#f59e0b";
  return "#16a34a";
}

function getRiskLabel(score: number): string {
  if (score >= 90) return "Critical";
  if (score >= 80) return "High";
  if (score >= 70) return "Watch";
  return "Stable";
}

function buildChartData(data: HighRiskDealsDatum[]): ChartRow[] {
  return data.map((item) => {
    const probability = item.probability ?? 0;
    const lastActivityDays = item.lastActivityDays ?? 0;
    const exposureWeight = Number(
      (((item.dealValue / 1000000) * item.riskScore) / 10).toFixed(1)
    );

    return {
      ...item,
      probability,
      lastActivityDays,
      riskLabel: getRiskLabel(item.riskScore),
      compactValueLabel: formatCompactCurrency(item.dealValue),
      exposureWeight,
    };
  });
}

function getTooltipRow(payload?: TooltipPayloadItem[]): ChartRow | null {
  if (!payload || payload.length === 0) return null;

  const item = payload.find((entry) => entry?.payload);
  return item?.payload ?? null;
}

function CustomTooltip({ active, payload, label, currency }: CustomTooltipProps) {
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
        minWidth: 310,
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
        {String(label ?? row.dealName)}
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
        <span style={{ color: "#64748b" }}>Owner</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>{row.owner}</span>

        <span style={{ color: "#64748b" }}>Stage</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>{row.stage}</span>

        <span style={{ color: "#64748b" }}>Risk Score</span>
        <span style={{ color: getRiskColor(row.riskScore), fontWeight: 700 }}>
          {row.riskScore}
        </span>

        <span style={{ color: "#64748b" }}>Deal Value</span>
        <span style={{ color: "#7c3aed", fontWeight: 700 }}>
          {formatCurrency(row.dealValue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Days Stuck</span>
        <span style={{ color: "#b91c1c", fontWeight: 700 }}>{row.daysStuck} days</span>

        <span style={{ color: "#64748b" }}>Win Probability</span>
        <span style={{ color: "#2563eb", fontWeight: 700 }}>
          {formatPercent(row.probability)}
        </span>

        <span style={{ color: "#64748b" }}>Last Activity</span>
        <span style={{ color: "#f59e0b", fontWeight: 700 }}>
          {row.lastActivityDays} days ago
        </span>
      </div>
    </div>
  );
}

export default function HighRiskDealsChart({
  title = "High Risk Deals",
  subtitle = "Spot high-risk deals by risk score, stuck days, exposure value, and declining close probability",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No high-risk deal data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: HighRiskDealsChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalRiskExposure = useMemo(
    () => chartData.reduce((sum, item) => sum + item.dealValue, 0),
    [chartData]
  );

  const averageRiskScore = useMemo(() => {
    if (!chartData.length) return 0;

    return Number(
      (chartData.reduce((sum, item) => sum + item.riskScore, 0) / chartData.length).toFixed(1)
    );
  }, [chartData]);

  const averageDaysStuck = useMemo(() => {
    if (!chartData.length) return 0;

    return Number(
      (chartData.reduce((sum, item) => sum + item.daysStuck, 0) / chartData.length).toFixed(1)
    );
  }, [chartData]);

  const averageProbability = useMemo(() => {
    if (!chartData.length) return 0;

    return Number(
      (chartData.reduce((sum, item) => sum + item.probability, 0) / chartData.length).toFixed(1)
    );
  }, [chartData]);

  const highestRiskDeal = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.riskScore - a.riskScore)[0] ?? null;
  }, [chartData]);

  const mostStuckDeal = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.daysStuck - a.daysStuck)[0] ?? null;
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
          <p style={emptyTitleStyle}>No high-risk deal data</p>
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
                background: "rgba(220,38,38,0.10)",
                color: "#b91c1c",
              }}
            >
              Exposure: {formatCompactCurrency(totalRiskExposure)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(249,115,22,0.10)",
                color: "#c2410c",
              }}
            >
              Avg Risk: {averageRiskScore}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(245,158,11,0.10)",
                color: "#b45309",
              }}
            >
              Avg Stuck: {averageDaysStuck} days
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(37,99,235,0.10)",
                color: "#1d4ed8",
              }}
            >
              Avg Probability: {formatPercent(averageProbability)}
            </div>

            {highestRiskDeal ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(239,68,68,0.10)",
                  color: "#b91c1c",
                }}
              >
                Highest Risk: {highestRiskDeal.dealName}
              </div>
            ) : null}

            {mostStuckDeal ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(124,58,237,0.10)",
                  color: "#6d28d9",
                }}
              >
                Most Stuck: {mostStuckDeal.dealName}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div style={chartAreaStyle}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 24, left: 0, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.22)"
              vertical={false}
            />

            <XAxis
              dataKey="dealName"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-12}
              textAnchor="end"
              height={64}
            />

            <YAxis
              yAxisId="risk"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={42}
              domain={[0, 100]}
            />

            <YAxis
              yAxisId="days"
              orientation="right"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={42}
            />

            <ZAxis dataKey="exposureWeight" range={[60, 360]} name="Exposure" />

            <Tooltip content={<CustomTooltip currency={currency} />} />

            <Legend
              wrapperStyle={{
                fontSize: 12,
                color: "#334155",
                paddingTop: 8,
              }}
            />

            <ReferenceLine
              yAxisId="risk"
              y={80}
              stroke="rgba(220,38,38,0.85)"
              strokeDasharray="4 4"
            />

            <Bar
              yAxisId="risk"
              dataKey="riskScore"
              name="Risk Score"
              radius={[10, 10, 0, 0]}
              maxBarSize={34}
            >
              {chartData.map((entry) => (
                <Cell key={`risk-${entry.dealName}`} fill={getRiskColor(entry.riskScore)} />
              ))}

              <LabelList
                dataKey="riskScore"
                position="top"
                style={{
                  fill: "#334155",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
            </Bar>

            <Bar
              yAxisId="days"
              dataKey="daysStuck"
              name="Days Stuck"
              radius={[10, 10, 0, 0]}
              maxBarSize={20}
              fill="#fca5a5"
            />

            <Scatter
              yAxisId="days"
              name="Exposure Bubble"
              data={chartData}
              dataKey="daysStuck"
              fill="#7c3aed"
            />

            <Scatter
              yAxisId="risk"
              name="Win Probability"
              data={chartData}
              dataKey="probability"
              fill="#2563eb"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gap: 10,
        }}
      >
        {chartData.map((item) => (
          <div
            key={item.dealName}
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
                    background: getRiskColor(item.riskScore),
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
                  {item.dealName}
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
                <span>{item.owner}</span>
                <span>•</span>
                <span>{item.stage}</span>
                <span>•</span>
                <span>Value: {item.compactValueLabel}</span>
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
                  color: getRiskColor(item.riskScore),
                  background: "#ffffff",
                  border: `1px solid ${
                    item.riskScore >= 90
                      ? "rgba(220,38,38,0.18)"
                      : "rgba(249,115,22,0.18)"
                  }`,
                }}
              >
                {item.riskLabel} {item.riskScore}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#b91c1c",
                  background: "#ffffff",
                  border: "1px solid rgba(239,68,68,0.18)",
                }}
              >
                {item.daysStuck}d stuck
              </span>

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
                Prob {formatPercent(item.probability)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}