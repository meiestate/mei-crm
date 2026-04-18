// src/components/analytics/charts/campaign/CampaignRoiChart.tsx

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

type CampaignRoiDatum = {
  campaign: string;
  spend: number;
  revenue: number;
  leads?: number;
  conversions?: number;
  roi?: number;
  roas?: number;
};

type CampaignRoiChartProps = {
  title?: string;
  subtitle?: string;
  data?: CampaignRoiDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = CampaignRoiDatum & {
  leads: number;
  conversions: number;
  roi: number;
  roas: number;
  profit: number;
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

const defaultData: CampaignRoiDatum[] = [
  {
    campaign: "Meta Lead Ads",
    spend: 120000,
    revenue: 286000,
    leads: 128,
    conversions: 24,
    roi: 138.3,
    roas: 2.38,
  },
  {
    campaign: "Google Search",
    spend: 148000,
    revenue: 372000,
    leads: 116,
    conversions: 27,
    roi: 151.4,
    roas: 2.51,
  },
  {
    campaign: "WhatsApp Retargeting",
    spend: 54000,
    revenue: 182000,
    leads: 94,
    conversions: 22,
    roi: 237.0,
    roas: 3.37,
  },
  {
    campaign: "Referral Push",
    spend: 26000,
    revenue: 144000,
    leads: 61,
    conversions: 19,
    roi: 453.8,
    roas: 5.54,
  },
  {
    campaign: "Landing Page SEO",
    spend: 68000,
    revenue: 152000,
    leads: 72,
    conversions: 14,
    roi: 123.5,
    roas: 2.24,
  },
  {
    campaign: "Broker Partner Drive",
    spend: 34000,
    revenue: 132000,
    leads: 49,
    conversions: 15,
    roi: 288.2,
    roas: 3.88,
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
  background: "rgba(16,185,129,0.10)",
  color: "#047857",
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

function formatRatio(value: number): string {
  return `${value.toFixed(2)}x`;
}

function getRevenueBarColor(revenue: number, spend: number): string {
  if (revenue >= spend * 4) return "#15803d";
  if (revenue >= spend * 2.5) return "#16a34a";
  if (revenue >= spend * 1.5) return "#22c55e";
  return "#86efac";
}

function buildChartData(data: CampaignRoiDatum[]): ChartRow[] {
  return data.map((item) => {
    const leads = item.leads ?? Math.max(0, Math.round(item.spend / 1200));
    const conversions = item.conversions ?? Math.max(0, Math.round(leads * 0.2));
    const profit = item.revenue - item.spend;

    const roi =
      item.roi ??
      (item.spend > 0
        ? Number(((profit / item.spend) * 100).toFixed(1))
        : 0);

    const roas =
      item.roas ??
      (item.spend > 0
        ? Number((item.revenue / item.spend).toFixed(2))
        : 0);

    return {
      ...item,
      leads,
      conversions,
      roi,
      roas,
      profit,
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
        minWidth: 265,
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

        <span style={{ color: "#64748b" }}>Revenue</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {formatCurrency(row.revenue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Profit</span>
        <span
          style={{
            color: row.profit >= 0 ? "#15803d" : "#b91c1c",
            fontWeight: 700,
          }}
        >
          {formatCurrency(row.profit, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Leads</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.leads}
        </span>

        <span style={{ color: "#64748b" }}>Conversions</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.conversions}
        </span>

        <span style={{ color: "#64748b" }}>ROI</span>
        <span
          style={{
            color: row.roi >= 0 ? "#15803d" : "#b91c1c",
            fontWeight: 700,
          }}
        >
          {formatPercent(row.roi)}
        </span>

        <span style={{ color: "#64748b" }}>ROAS</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatRatio(row.roas)}
        </span>
      </div>
    </div>
  );
}

export default function CampaignRoiChart({
  title = "Campaign ROI",
  subtitle = "Compare campaign spend against revenue, ROI, and ROAS performance",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No ROI data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: CampaignRoiChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalSpend = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.spend, 0);
  }, [chartData]);

  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.revenue, 0);
  }, [chartData]);

  const totalProfit = useMemo(() => {
    return totalRevenue - totalSpend;
  }, [totalRevenue, totalSpend]);

  const bestCampaign = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.roi - a.roi)[0] ?? null;
  }, [chartData]);

  const overallRoas = useMemo(() => {
    if (totalSpend <= 0) return 0;
    return Number((totalRevenue / totalSpend).toFixed(2));
  }, [totalRevenue, totalSpend]);

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
          <p style={emptyTitleStyle}>No ROI data</p>
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
                background: "rgba(34,197,94,0.10)",
                color: "#15803d",
              }}
            >
              Revenue: {formatCompactCurrency(totalRevenue)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background:
                  totalProfit >= 0
                    ? "rgba(16,185,129,0.10)"
                    : "rgba(239,68,68,0.10)",
                color: totalProfit >= 0 ? "#047857" : "#b91c1c",
              }}
            >
              Profit: {formatCompactCurrency(totalProfit)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(59,130,246,0.10)",
                color: "#1d4ed8",
              }}
            >
              ROAS: {formatRatio(overallRoas)}
            </div>

            {bestCampaign ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(99,102,241,0.10)",
                  color: "#4338ca",
                }}
              >
                Best ROI: {bestCampaign.campaign}
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
              yAxisId="amount"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={(value: number | string) =>
                typeof value === "number" ? formatCompactCurrency(value) : `${value}`
              }
            />

            <YAxis
              yAxisId="ratio"
              orientation="right"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={(value: number | string) => `${value}%`}
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
              yAxisId="ratio"
              y={0}
              stroke="rgba(148,163,184,0.5)"
              strokeDasharray="4 4"
            />

            <Bar
              yAxisId="amount"
              dataKey="spend"
              name="Spend"
              radius={[8, 8, 0, 0]}
              maxBarSize={34}
              fill="#ef4444"
            />

            <Bar
              yAxisId="amount"
              dataKey="revenue"
              name="Revenue"
              radius={[8, 8, 0, 0]}
              maxBarSize={34}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`revenue-${entry.campaign}`}
                  fill={getRevenueBarColor(entry.revenue, entry.spend)}
                />
              ))}
            </Bar>

            <Line
              yAxisId="ratio"
              type="monotone"
              dataKey="roi"
              name="ROI"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              yAxisId="ratio"
              type="monotone"
              dataKey="roas"
              name="ROAS"
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
                <span>Revenue: {formatCurrency(item.revenue, currency)}</span>
                <span>•</span>
                <span>Profit: {formatCurrency(item.profit, currency)}</span>
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
                  color: item.roi >= 0 ? "#15803d" : "#b91c1c",
                  background: "#ffffff",
                  border:
                    item.roi >= 0
                      ? "1px solid rgba(34,197,94,0.18)"
                      : "1px solid rgba(239,68,68,0.18)",
                }}
              >
                ROI {formatPercent(item.roi)}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#5b21b6",
                  background: "#ffffff",
                  border: "1px solid rgba(124,58,237,0.18)",
                }}
              >
                ROAS {formatRatio(item.roas)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}