// src/components/analytics/charts/campaign/CampaignPerformanceChart.tsx

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

type CampaignPerformanceDatum = {
  campaign: string;
  impressions: number;
  clicks: number;
  leads: number;
  conversions?: number;
  ctr?: number;
  conversionRate?: number;
};

type CampaignPerformanceChartProps = {
  title?: string;
  subtitle?: string;
  data?: CampaignPerformanceDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  showSummary?: boolean;
};

type ChartRow = CampaignPerformanceDatum & {
  conversions: number;
  ctr: number;
  conversionRate: number;
};

type TooltipPayloadItem = {
  payload?: ChartRow;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
};

const DEFAULT_HEIGHT = 460;

const defaultData: CampaignPerformanceDatum[] = [
  {
    campaign: "Meta Lead Ads",
    impressions: 84200,
    clicks: 3210,
    leads: 128,
    conversions: 24,
    ctr: 3.8,
    conversionRate: 18.8,
  },
  {
    campaign: "Google Search",
    impressions: 61800,
    clicks: 2940,
    leads: 116,
    conversions: 27,
    ctr: 4.8,
    conversionRate: 23.3,
  },
  {
    campaign: "WhatsApp Retargeting",
    impressions: 18400,
    clicks: 1640,
    leads: 94,
    conversions: 22,
    ctr: 8.9,
    conversionRate: 23.4,
  },
  {
    campaign: "Referral Push",
    impressions: 12600,
    clicks: 840,
    leads: 61,
    conversions: 19,
    ctr: 6.7,
    conversionRate: 31.1,
  },
  {
    campaign: "Landing Page SEO",
    impressions: 43800,
    clicks: 1580,
    leads: 72,
    conversions: 14,
    ctr: 3.6,
    conversionRate: 19.4,
  },
  {
    campaign: "Broker Partner Drive",
    impressions: 9800,
    clicks: 620,
    leads: 49,
    conversions: 15,
    ctr: 6.3,
    conversionRate: 30.6,
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

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function getLeadBarColor(leads: number): string {
  if (leads >= 120) return "#4338ca";
  if (leads >= 90) return "#6366f1";
  if (leads >= 60) return "#818cf8";
  return "#c7d2fe";
}

function buildChartData(data: CampaignPerformanceDatum[]): ChartRow[] {
  return data.map((item) => {
    const conversions =
      item.conversions ?? Math.round(item.leads * 0.2);

    const ctr =
      item.ctr ??
      (item.impressions > 0
        ? Number(((item.clicks / item.impressions) * 100).toFixed(1))
        : 0);

    const conversionRate =
      item.conversionRate ??
      (item.leads > 0
        ? Number(((conversions / item.leads) * 100).toFixed(1))
        : 0);

    return {
      ...item,
      conversions,
      ctr,
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

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
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
        minWidth: 260,
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
        <span style={{ color: "#64748b" }}>Impressions</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {formatNumber(row.impressions)}
        </span>

        <span style={{ color: "#64748b" }}>Clicks</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {formatNumber(row.clicks)}
        </span>

        <span style={{ color: "#64748b" }}>Leads</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.leads}
        </span>

        <span style={{ color: "#64748b" }}>Conversions</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.conversions}
        </span>

        <span style={{ color: "#64748b" }}>CTR</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.ctr)}
        </span>

        <span style={{ color: "#64748b" }}>Lead Conv Rate</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.conversionRate)}
        </span>
      </div>
    </div>
  );
}

export default function CampaignPerformanceChart({
  title = "Campaign Performance",
  subtitle = "Compare campaign reach, lead generation, and conversion efficiency",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No campaign performance data available right now.",
  showSummary = true,
}: CampaignPerformanceChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalLeads = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.leads, 0);
  }, [chartData]);

  const totalConversions = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.conversions, 0);
  }, [chartData]);

  const bestCampaign = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.conversions - a.conversions)[0] ?? null;
  }, [chartData]);

  const avgCtr = useMemo(() => {
    if (!chartData.length) return 0;
    return Number(
      (
        chartData.reduce((sum, item) => sum + item.ctr, 0) / chartData.length
      ).toFixed(1)
    );
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
          <p style={emptyTitleStyle}>No campaign data</p>
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
            <div style={badgeStyle}>Leads: {totalLeads}</div>
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
                background: "rgba(245,158,11,0.10)",
                color: "#b45309",
              }}
            >
              Avg CTR: {formatPercent(avgCtr)}
            </div>
            {bestCampaign ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(14,165,233,0.10)",
                  color: "#0369a1",
                }}
              >
                Top Campaign: {bestCampaign.campaign}
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
              width={42}
            />

            <YAxis
              yAxisId="rate"
              orientation="right"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={52}
              domain={[0, 100]}
              tickFormatter={(value: number | string) => `${value}%`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{
                fontSize: 12,
                color: "#334155",
                paddingTop: 8,
              }}
            />

            <Bar
              yAxisId="count"
              dataKey="leads"
              name="Leads"
              radius={[8, 8, 0, 0]}
              maxBarSize={42}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`leads-${entry.campaign}`}
                  fill={getLeadBarColor(entry.leads)}
                />
              ))}
            </Bar>

            <Bar
              yAxisId="count"
              dataKey="conversions"
              name="Conversions"
              radius={[8, 8, 0, 0]}
              maxBarSize={26}
              fill="#10b981"
            />

            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="ctr"
              name="CTR"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="conversionRate"
              name="Lead Conv Rate"
              stroke="#ef4444"
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
                <span>Impr: {formatNumber(item.impressions)}</span>
                <span>•</span>
                <span>Clicks: {formatNumber(item.clicks)}</span>
                <span>•</span>
                <span>Leads: {item.leads}</span>
                <span>•</span>
                <span>Conv: {item.conversions}</span>
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
                CTR {formatPercent(item.ctr)}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color:
                    item.conversionRate >= 25 ? "#15803d" : "#b91c1c",
                  background: "#ffffff",
                  border:
                    item.conversionRate >= 25
                      ? "1px solid rgba(34,197,94,0.18)"
                      : "1px solid rgba(239,68,68,0.18)",
                }}
              >
                Conv {formatPercent(item.conversionRate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}