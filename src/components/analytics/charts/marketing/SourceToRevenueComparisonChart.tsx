// src/components/analytics/charts/source/SourceToRevenueComparisonChart.tsx

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

type SourceToRevenueDatum = {
  source: string;
  leads: number;
  deals: number;
  revenue: number;
  spend?: number;
  avgDealValue?: number;
  conversionRate?: number;
  roi?: number;
};

type SourceToRevenueComparisonChartProps = {
  title?: string;
  subtitle?: string;
  data?: SourceToRevenueDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = SourceToRevenueDatum & {
  spend: number;
  avgDealValue: number;
  conversionRate: number;
  roi: number;
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

const DEFAULT_HEIGHT = 480;
const DEFAULT_CURRENCY = "INR";

const defaultData: SourceToRevenueDatum[] = [
  {
    source: "Meta Ads",
    leads: 128,
    deals: 24,
    revenue: 2860000,
    spend: 420000,
    avgDealValue: 119166.7,
    conversionRate: 18.8,
    roi: 581.0,
  },
  {
    source: "Google Search",
    leads: 116,
    deals: 27,
    revenue: 3720000,
    spend: 510000,
    avgDealValue: 137777.8,
    conversionRate: 23.3,
    roi: 629.4,
  },
  {
    source: "WhatsApp",
    leads: 94,
    deals: 22,
    revenue: 1820000,
    spend: 160000,
    avgDealValue: 82727.3,
    conversionRate: 23.4,
    roi: 1037.5,
  },
  {
    source: "Referral",
    leads: 61,
    deals: 19,
    revenue: 1440000,
    spend: 80000,
    avgDealValue: 75789.5,
    conversionRate: 31.1,
    roi: 1700.0,
  },
  {
    source: "Organic SEO",
    leads: 72,
    deals: 14,
    revenue: 1520000,
    spend: 140000,
    avgDealValue: 108571.4,
    conversionRate: 19.4,
    roi: 985.7,
  },
  {
    source: "Broker Network",
    leads: 49,
    deals: 15,
    revenue: 1320000,
    spend: 110000,
    avgDealValue: 88000,
    conversionRate: 30.6,
    roi: 1100.0,
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
  background: "rgba(37,99,235,0.10)",
  color: "#1d4ed8",
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

function getRevenueColor(revenue: number): string {
  if (revenue >= 3000000) return "#16a34a";
  if (revenue >= 2000000) return "#22c55e";
  if (revenue >= 1400000) return "#4ade80";
  return "#86efac";
}

function buildChartData(data: SourceToRevenueDatum[]): ChartRow[] {
  return data.map((item) => {
    const spend = item.spend ?? Math.round(item.revenue * 0.14);

    const avgDealValue =
      item.avgDealValue ??
      (item.deals > 0 ? Number((item.revenue / item.deals).toFixed(1)) : 0);

    const conversionRate =
      item.conversionRate ??
      (item.leads > 0 ? Number(((item.deals / item.leads) * 100).toFixed(1)) : 0);

    const roi =
      item.roi ??
      (spend > 0
        ? Number((((item.revenue - spend) / spend) * 100).toFixed(1))
        : 0);

    return {
      ...item,
      spend,
      avgDealValue,
      conversionRate,
      roi,
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
        minWidth: 270,
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
        <span style={{ color: "#64748b" }}>Leads</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>{row.leads}</span>

        <span style={{ color: "#64748b" }}>Deals</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>{row.deals}</span>

        <span style={{ color: "#64748b" }}>Revenue</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {formatCurrency(row.revenue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Spend</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {formatCurrency(row.spend, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Avg Deal Value</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatCurrency(row.avgDealValue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Conversion Rate</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.conversionRate)}
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
      </div>
    </div>
  );
}

export default function SourceToRevenueComparisonChart({
  title = "Source to Revenue Comparison",
  subtitle = "Compare lead sources by lead volume, closed deals, revenue contribution, and ROI",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No source-to-revenue comparison data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: SourceToRevenueComparisonChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.revenue, 0);
  }, [chartData]);

  const totalDeals = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.deals, 0);
  }, [chartData]);

  const totalLeads = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.leads, 0);
  }, [chartData]);

  const avgRevenuePerSource = useMemo(() => {
    if (!chartData.length) return 0;
    return Number((totalRevenue / chartData.length).toFixed(1));
  }, [chartData, totalRevenue]);

  const topRevenueSource = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.revenue - a.revenue)[0] ?? null;
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
          <p style={emptyTitleStyle}>No source revenue data</p>
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
              Leads: {totalLeads}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(34,197,94,0.10)",
                color: "#15803d",
              }}
            >
              Deals: {totalDeals}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(16,185,129,0.10)",
                color: "#047857",
              }}
            >
              Revenue: {formatCompactCurrency(totalRevenue)}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(59,130,246,0.10)",
                color: "#1d4ed8",
              }}
            >
              Avg / Source: {formatCompactCurrency(avgRevenuePerSource)}
            </div>

            {topRevenueSource ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(245,158,11,0.10)",
                  color: "#b45309",
                }}
              >
                Top Source: {topRevenueSource.source}
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
              dataKey="source"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              yAxisId="count"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={42}
            />

            <YAxis
              yAxisId="amount"
              orientation="right"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={60}
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
              yAxisId="amount"
              y={avgRevenuePerSource}
              stroke="rgba(59,130,246,0.75)"
              strokeDasharray="4 4"
            />

            <Bar
              yAxisId="count"
              dataKey="deals"
              name="Deals"
              radius={[8, 8, 0, 0]}
              maxBarSize={34}
              fill="#2563eb"
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
                  key={`revenue-${entry.source}`}
                  fill={getRevenueColor(entry.revenue)}
                />
              ))}
            </Bar>

            <Line
              yAxisId="amount"
              type="monotone"
              dataKey="avgDealValue"
              name="Avg Deal Value"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              yAxisId="amount"
              type="monotone"
              dataKey="roi"
              name="ROI"
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
                <span>Deals: {item.deals}</span>
                <span>•</span>
                <span>Revenue: {formatCurrency(item.revenue, currency)}</span>
                <span>•</span>
                <span>Spend: {formatCurrency(item.spend, currency)}</span>
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
                ADV {formatCurrency(item.avgDealValue, currency)}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: item.roi >= 700 ? "#15803d" : "#5b21b6",
                  background: "#ffffff",
                  border:
                    item.roi >= 700
                      ? "1px solid rgba(34,197,94,0.18)"
                      : "1px solid rgba(124,58,237,0.18)",
                }}
              >
                ROI {formatPercent(item.roi)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}