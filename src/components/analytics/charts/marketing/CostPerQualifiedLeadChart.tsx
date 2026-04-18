// src/components/analytics/charts/campaign/CostPerQualifiedLeadChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

type CostPerQualifiedLeadDatum = {
  campaign: string;
  spend: number;
  leads: number;
  qualifiedLeads: number;
  conversions?: number;
  revenue?: number;
  costPerQualifiedLead?: number;
  qualificationRate?: number;
  conversionRate?: number;
};

type CostPerQualifiedLeadChartProps = {
  title?: string;
  subtitle?: string;
  data?: CostPerQualifiedLeadDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = CostPerQualifiedLeadDatum & {
  conversions: number;
  revenue: number;
  costPerQualifiedLead: number;
  qualificationRate: number;
  conversionRate: number;
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

const DEFAULT_HEIGHT = 460;
const DEFAULT_CURRENCY = "INR";

const defaultData: CostPerQualifiedLeadDatum[] = [
  {
    campaign: "Meta Lead Ads",
    spend: 120000,
    leads: 128,
    qualifiedLeads: 54,
    conversions: 24,
    revenue: 286000,
    costPerQualifiedLead: 2222.2,
    qualificationRate: 42.2,
    conversionRate: 44.4,
  },
  {
    campaign: "Google Search",
    spend: 148000,
    leads: 116,
    qualifiedLeads: 58,
    conversions: 27,
    revenue: 372000,
    costPerQualifiedLead: 2551.7,
    qualificationRate: 50.0,
    conversionRate: 46.6,
  },
  {
    campaign: "WhatsApp Retargeting",
    spend: 54000,
    leads: 94,
    qualifiedLeads: 44,
    conversions: 22,
    revenue: 182000,
    costPerQualifiedLead: 1227.3,
    qualificationRate: 46.8,
    conversionRate: 50.0,
  },
  {
    campaign: "Referral Push",
    spend: 26000,
    leads: 61,
    qualifiedLeads: 33,
    conversions: 19,
    revenue: 144000,
    costPerQualifiedLead: 787.9,
    qualificationRate: 54.1,
    conversionRate: 57.6,
  },
  {
    campaign: "Landing Page SEO",
    spend: 68000,
    leads: 72,
    qualifiedLeads: 29,
    conversions: 14,
    revenue: 152000,
    costPerQualifiedLead: 2344.8,
    qualificationRate: 40.3,
    conversionRate: 48.3,
  },
  {
    campaign: "Broker Partner Drive",
    spend: 34000,
    leads: 49,
    qualifiedLeads: 26,
    conversions: 15,
    revenue: 132000,
    costPerQualifiedLead: 1307.7,
    qualificationRate: 53.1,
    conversionRate: 57.7,
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
  background: "rgba(99,102,241,0.10)",
  color: "#4338ca",
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const chartAreaStyle: CSSProperties = {
  flex: 1,
  minHeight: 320,
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

  if (abs >= 10000000) {
    return `${(value / 10000000).toFixed(1)} Cr`;
  }

  if (abs >= 100000) {
    return `${(value / 100000).toFixed(1)} L`;
  }

  if (abs >= 1000) {
    return `${(value / 1000).toFixed(1)} K`;
  }

  return `${value}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function getQualifiedBarColor(qualifiedLeads: number): string {
  if (qualifiedLeads >= 55) return "#4f46e5";
  if (qualifiedLeads >= 40) return "#6366f1";
  if (qualifiedLeads >= 30) return "#818cf8";
  return "#c7d2fe";
}

function buildChartData(data: CostPerQualifiedLeadDatum[]): ChartRow[] {
  return data.map((item) => {
    const conversions =
      item.conversions ?? Math.round(item.qualifiedLeads * 0.48);

    const revenue =
      item.revenue ?? conversions * 14000;

    const costPerQualifiedLead =
      item.costPerQualifiedLead ??
      (item.qualifiedLeads > 0
        ? Number((item.spend / item.qualifiedLeads).toFixed(1))
        : 0);

    const qualificationRate =
      item.qualificationRate ??
      (item.leads > 0
        ? Number(((item.qualifiedLeads / item.leads) * 100).toFixed(1))
        : 0);

    const conversionRate =
      item.conversionRate ??
      (item.qualifiedLeads > 0
        ? Number(((conversions / item.qualifiedLeads) * 100).toFixed(1))
        : 0);

    return {
      ...item,
      conversions,
      revenue,
      costPerQualifiedLead,
      qualificationRate,
      conversionRate,
    };
  });
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

function CustomTooltip({
  active,
  payload,
  label,
  currency,
}: CustomTooltipProps) {
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
        background: "#ffffff",
        border: "1px solid rgba(148,163,184,0.24)",
        borderRadius: 16,
        boxShadow: "0 14px 40px rgba(15,23,42,0.14)",
        padding: 14,
        minWidth: 280,
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
        {String(label ?? row.campaign)}
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
        <span style={{ color: "#64748b" }}>Spend</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {formatCurrency(row.spend, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Leads</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.leads}
        </span>

        <span style={{ color: "#64748b" }}>Qualified Leads</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.qualifiedLeads}
        </span>

        <span style={{ color: "#64748b" }}>Conversions</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.conversions}
        </span>

        <span style={{ color: "#64748b" }}>Revenue</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {formatCurrency(row.revenue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Cost / Qualified Lead</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatCurrency(row.costPerQualifiedLead, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Qualification Rate</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.qualificationRate)}
        </span>

        <span style={{ color: "#64748b" }}>Qualified Conv Rate</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.conversionRate)}
        </span>
      </div>
    </div>
  );
}

export default function CostPerQualifiedLeadChart({
  title = "Cost Per Qualified Lead",
  subtitle = "Compare campaign spend efficiency against qualified lead volume and downstream conversion quality",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No cost-per-qualified-lead data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: CostPerQualifiedLeadChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalSpend = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.spend, 0);
  }, [chartData]);

  const totalQualifiedLeads = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.qualifiedLeads, 0);
  }, [chartData]);

  const totalConversions = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.conversions, 0);
  }, [chartData]);

  const avgCostPerQualifiedLead = useMemo(() => {
    if (totalQualifiedLeads <= 0) return 0;
    return Number((totalSpend / totalQualifiedLeads).toFixed(1));
  }, [totalSpend, totalQualifiedLeads]);

  const avgQualifiedConversionRate = useMemo(() => {
    if (!chartData.length) return 0;
    return Number(
      (
        chartData.reduce((sum, item) => sum + item.conversionRate, 0) /
        chartData.length
      ).toFixed(1)
    );
  }, [chartData]);

  const bestCampaign = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort(
      (a, b) => a.costPerQualifiedLead - b.costPerQualifiedLead
    )[0] ?? null;
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
          <p style={emptyTitleStyle}>No CPQL data</p>
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
                background: "rgba(239,68,68,0.10)",
                color: "#b91c1c",
              }}
            >
              Spend: {formatCompactCurrency(totalSpend)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(99,102,241,0.10)",
                color: "#4338ca",
              }}
            >
              Qualified Leads: {totalQualifiedLeads}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(34,197,94,0.10)",
                color: "#15803d",
              }}
            >
              Conversions: {totalConversions}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(59,130,246,0.10)",
                color: "#1d4ed8",
              }}
            >
              Avg CPQL: {formatCurrency(avgCostPerQualifiedLead, currency)}
            </div>

            {bestCampaign ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(245,158,11,0.10)",
                  color: "#b45309",
                }}
              >
                Best CPQL: {bestCampaign.campaign}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div style={chartAreaStyle}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.22)"
              vertical={false}
            />

            <XAxis
              dataKey="campaign"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              yAxisId="count"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />

            <YAxis
              yAxisId="currency"
              orientation="right"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={64}
              tickFormatter={(value: number | string) =>
                typeof value === "number" ? formatCompactCurrency(value) : `${value}`
              }
            />

            <Tooltip content={<CustomTooltip currency={currency} />} />

            <Legend
              wrapperStyle={{
                fontSize: 12,
                color: "#334155",
                paddingTop: 8,
              }}
            />

            <ReferenceLine
              yAxisId="currency"
              y={avgCostPerQualifiedLead}
              stroke="rgba(59,130,246,0.75)"
              strokeDasharray="4 4"
            />

            <Bar
              yAxisId="count"
              dataKey="qualifiedLeads"
              name="Qualified Leads"
              radius={[8, 8, 0, 0]}
              maxBarSize={36}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`qualified-${entry.campaign}`}
                  fill={getQualifiedBarColor(entry.qualifiedLeads)}
                />
              ))}
            </Bar>

            <Bar
              yAxisId="count"
              dataKey="conversions"
              name="Conversions"
              radius={[8, 8, 0, 0]}
              maxBarSize={24}
              fill="#10b981"
            />

            <Line
              yAxisId="currency"
              type="monotone"
              dataKey="costPerQualifiedLead"
              name="Cost Per Qualified Lead"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              yAxisId="currency"
              type="monotone"
              dataKey="conversionRate"
              name="Qualified Conv Rate"
              stroke="#7c3aed"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
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
            key={item.campaign}
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
                {item.campaign}
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
                <span>Spend: {formatCurrency(item.spend, currency)}</span>
                <span>•</span>
                <span>Qualified: {item.qualifiedLeads}</span>
                <span>•</span>
                <span>Conversions: {item.conversions}</span>
                <span>•</span>
                <span>Revenue: {formatCurrency(item.revenue, currency)}</span>
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
                  color:
                    item.costPerQualifiedLead <= avgCostPerQualifiedLead
                      ? "#15803d"
                      : "#b91c1c",
                  background: "#ffffff",
                  border:
                    item.costPerQualifiedLead <= avgCostPerQualifiedLead
                      ? "1px solid rgba(34,197,94,0.18)"
                      : "1px solid rgba(239,68,68,0.18)",
                }}
              >
                CPQL {formatCurrency(item.costPerQualifiedLead, currency)}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color:
                    item.conversionRate >= avgQualifiedConversionRate
                      ? "#5b21b6"
                      : "#b45309",
                  background: "#ffffff",
                  border:
                    item.conversionRate >= avgQualifiedConversionRate
                      ? "1px solid rgba(124,58,237,0.18)"
                      : "1px solid rgba(245,158,11,0.18)",
                }}
              >
                QCR {formatPercent(item.conversionRate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}