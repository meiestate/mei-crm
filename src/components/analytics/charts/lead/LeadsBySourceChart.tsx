// src/components/analytics/charts/lead/LeadsBySourceChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
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
} from "recharts";
import type { LabelProps } from "recharts";

type LeadsBySourceDatum = {
  source: string;
  leads: number;
  qualifiedLeads?: number;
  conversionRate?: number;
  costPerLead?: number;
};

type LeadsBySourceChartProps = {
  title?: string;
  subtitle?: string;
  data?: LeadsBySourceDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = LeadsBySourceDatum & {
  qualifiedLeads: number;
  conversionRate: number;
  costPerLead: number;
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

const DEFAULT_HEIGHT = 420;
const DEFAULT_CURRENCY = "INR";

const defaultData: LeadsBySourceDatum[] = [
  {
    source: "Website",
    leads: 68,
    qualifiedLeads: 31,
    conversionRate: 45.6,
    costPerLead: 780,
  },
  {
    source: "WhatsApp",
    leads: 52,
    qualifiedLeads: 24,
    conversionRate: 46.2,
    costPerLead: 420,
  },
  {
    source: "Facebook Ads",
    leads: 61,
    qualifiedLeads: 22,
    conversionRate: 36.1,
    costPerLead: 1250,
  },
  {
    source: "Google Ads",
    leads: 47,
    qualifiedLeads: 21,
    conversionRate: 44.7,
    costPerLead: 1480,
  },
  {
    source: "Referral",
    leads: 34,
    qualifiedLeads: 19,
    conversionRate: 55.9,
    costPerLead: 180,
  },
  {
    source: "Broker Network",
    leads: 29,
    qualifiedLeads: 16,
    conversionRate: 55.2,
    costPerLead: 250,
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
  background: "rgba(245,158,11,0.10)",
  color: "#b45309",
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const chartAreaStyle: CSSProperties = {
  flex: 1,
  minHeight: 280,
};

const loadingWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 280,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  fontSize: 14,
  fontWeight: 600,
};

const emptyWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 280,
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

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function getSourceColor(leads: number): string {
  if (leads >= 60) return "#d97706";
  if (leads >= 45) return "#f59e0b";
  if (leads >= 30) return "#fbbf24";
  return "#fde68a";
}

function buildChartData(data: LeadsBySourceDatum[]): ChartRow[] {
  return data.map((item) => {
    const qualifiedLeads =
      item.qualifiedLeads ?? Math.round(item.leads * 0.42);

    const conversionRate =
      item.conversionRate ??
      (item.leads > 0
        ? Number(((qualifiedLeads / item.leads) * 100).toFixed(1))
        : 0);

    const costPerLead = item.costPerLead ?? 0;

    return {
      ...item,
      qualifiedLeads,
      conversionRate,
      costPerLead,
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
        minWidth: 240,
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
        {String(label ?? row.source)}
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
        <span style={{ color: "#64748b" }}>Total Leads</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.leads}
        </span>

        <span style={{ color: "#64748b" }}>Qualified Leads</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.qualifiedLeads}
        </span>

        <span style={{ color: "#64748b" }}>Conversion Rate</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.conversionRate)}
        </span>

        <span style={{ color: "#64748b" }}>Cost / Lead</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {formatCurrency(row.costPerLead, currency)}
        </span>
      </div>
    </div>
  );
}

function LeadsValueLabel({ x, y, width, height, value }: LabelProps) {
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
      {value}
    </text>
  );
}

export default function LeadsBySourceChart({
  title = "Leads by Source",
  subtitle = "Compare lead generation channels by volume, quality, and acquisition efficiency",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No source-wise lead data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: LeadsBySourceChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalLeads = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.leads, 0);
  }, [chartData]);

  const topSource = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.leads - a.leads)[0] ?? null;
  }, [chartData]);

  const bestConversionSource = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.conversionRate - a.conversionRate)[0] ?? null;
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
          <p style={emptyTitleStyle}>No source data</p>
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
            <div style={badgeStyle}>Total Leads: {totalLeads}</div>

            {topSource ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(245,158,11,0.12)",
                  color: "#b45309",
                }}
              >
                Top Volume: {topSource.source}
              </div>
            ) : null}

            {bestConversionSource ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(34,197,94,0.10)",
                  color: "#15803d",
                }}
              >
                Best Conv: {bestConversionSource.source}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div style={chartAreaStyle}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 28, left: 12, bottom: 8 }}
            barCategoryGap={14}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.22)"
              vertical={false}
            />

            <XAxis
              type="number"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              type="category"
              dataKey="source"
              width={120}
              tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip currency={currency} />} />

            <Bar dataKey="leads" radius={[0, 10, 10, 0]} name="Leads">
              {chartData.map((entry) => (
                <Cell key={entry.source} fill={getSourceColor(entry.leads)} />
              ))}

              <LabelList
                dataKey="leads"
                position="right"
                content={(props: LabelProps) => <LeadsValueLabel {...props} />}
              />
            </Bar>
          </BarChart>
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
            key={item.source}
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
                {item.source}
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
                <span>Leads: {item.leads}</span>
                <span>•</span>
                <span>Qualified: {item.qualifiedLeads}</span>
                <span>•</span>
                <span>CPL: {formatCurrency(item.costPerLead, currency)}</span>
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
                  color: "#b45309",
                  background: "#ffffff",
                  border: "1px solid rgba(245,158,11,0.18)",
                }}
              >
                {item.leads} Leads
              </span>

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
                {formatPercent(item.conversionRate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}