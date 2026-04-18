// src/components/analytics/charts/campaign/CostPerBookingChart.tsx

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

type CostPerBookingDatum = {
  campaign: string;
  spend: number;
  bookings: number;
  revenue?: number;
  costPerBooking?: number;
  bookingRate?: number;
};

type CostPerBookingChartProps = {
  title?: string;
  subtitle?: string;
  data?: CostPerBookingDatum[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  currency?: string;
  showSummary?: boolean;
};

type ChartRow = CostPerBookingDatum & {
  revenue: number;
  costPerBooking: number;
  bookingRate: number;
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

const defaultData: CostPerBookingDatum[] = [
  {
    campaign: "Meta Lead Ads",
    spend: 120000,
    bookings: 24,
    revenue: 286000,
    costPerBooking: 5000,
    bookingRate: 20.0,
  },
  {
    campaign: "Google Search",
    spend: 148000,
    bookings: 27,
    revenue: 372000,
    costPerBooking: 5481.5,
    bookingRate: 23.3,
  },
  {
    campaign: "WhatsApp Retargeting",
    spend: 54000,
    bookings: 22,
    revenue: 182000,
    costPerBooking: 2454.5,
    bookingRate: 31.4,
  },
  {
    campaign: "Referral Push",
    spend: 26000,
    bookings: 19,
    revenue: 144000,
    costPerBooking: 1368.4,
    bookingRate: 38.0,
  },
  {
    campaign: "Landing Page SEO",
    spend: 68000,
    bookings: 14,
    revenue: 152000,
    costPerBooking: 4857.1,
    bookingRate: 21.9,
  },
  {
    campaign: "Broker Partner Drive",
    spend: 34000,
    bookings: 15,
    revenue: 132000,
    costPerBooking: 2266.7,
    bookingRate: 34.1,
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
  background: "rgba(14,165,233,0.10)",
  color: "#0369a1",
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

function getBookingBarColor(bookings: number): string {
  if (bookings >= 24) return "#0284c7";
  if (bookings >= 20) return "#0ea5e9";
  if (bookings >= 15) return "#38bdf8";
  return "#7dd3fc";
}

function buildChartData(data: CostPerBookingDatum[]): ChartRow[] {
  return data.map((item) => {
    const revenue = item.revenue ?? item.bookings * 11000;

    const costPerBooking =
      item.costPerBooking ??
      (item.bookings > 0
        ? Number((item.spend / item.bookings).toFixed(1))
        : 0);

    const bookingRate =
      item.bookingRate ??
      (item.spend > 0
        ? Number(((item.bookings / Math.max(item.spend / 10000, 1)) * 10).toFixed(1))
        : 0);

    return {
      ...item,
      revenue,
      costPerBooking,
      bookingRate,
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
        <span style={{ color: "#64748b" }}>Spend</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {formatCurrency(row.spend, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Bookings</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {row.bookings}
        </span>

        <span style={{ color: "#64748b" }}>Revenue</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>
          {formatCurrency(row.revenue, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Cost / Booking</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatCurrency(row.costPerBooking, currency)}
        </span>

        <span style={{ color: "#64748b" }}>Booking Efficiency</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {formatPercent(row.bookingRate)}
        </span>
      </div>
    </div>
  );
}

export default function CostPerBookingChart({
  title = "Cost Per Booking",
  subtitle = "Compare campaign spend efficiency against booking output and booking rate",
  data = defaultData,
  height = DEFAULT_HEIGHT,
  loading = false,
  emptyMessage = "No booking cost data available right now.",
  currency = DEFAULT_CURRENCY,
  showSummary = true,
}: CostPerBookingChartProps) {
  const chartData = useMemo(() => buildChartData(data), [data]);

  const totalSpend = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.spend, 0);
  }, [chartData]);

  const totalBookings = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.bookings, 0);
  }, [chartData]);

  const avgCostPerBooking = useMemo(() => {
    if (totalBookings <= 0) return 0;
    return Number((totalSpend / totalBookings).toFixed(1));
  }, [totalSpend, totalBookings]);

  const bestCampaign = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => a.costPerBooking - b.costPerBooking)[0] ?? null;
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
          <p style={emptyTitleStyle}>No booking cost data</p>
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
              Bookings: {totalBookings}
            </div>

            <div
              style={{
                ...badgeStyle,
                background: "rgba(59,130,246,0.10)",
                color: "#1d4ed8",
              }}
            >
              Avg CPB: {formatCurrency(avgCostPerBooking, currency)}
            </div>

            {bestCampaign ? (
              <div
                style={{
                  ...badgeStyle,
                  background: "rgba(99,102,241,0.10)",
                  color: "#4338ca",
                }}
              >
                Best CPB: {bestCampaign.campaign}
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
              yAxisId="currency"
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
              yAxisId="currency"
              y={avgCostPerBooking}
              stroke="rgba(59,130,246,0.75)"
              strokeDasharray="4 4"
            />

            <Bar
              yAxisId="count"
              dataKey="bookings"
              name="Bookings"
              radius={[8, 8, 0, 0]}
              maxBarSize={36}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`bookings-${entry.campaign}`}
                  fill={getBookingBarColor(entry.bookings)}
                />
              ))}
            </Bar>

            <Line
              yAxisId="currency"
              type="monotone"
              dataKey="costPerBooking"
              name="Cost Per Booking"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              yAxisId="currency"
              type="monotone"
              dataKey="bookingRate"
              name="Booking Efficiency"
              stroke="#10b981"
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
                <span>Bookings: {item.bookings}</span>
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
                    item.costPerBooking <= avgCostPerBooking ? "#15803d" : "#b91c1c",
                  background: "#ffffff",
                  border:
                    item.costPerBooking <= avgCostPerBooking
                      ? "1px solid rgba(34,197,94,0.18)"
                      : "1px solid rgba(239,68,68,0.18)",
                }}
              >
                CPB {formatCurrency(item.costPerBooking, currency)}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#047857",
                  background: "#ffffff",
                  border: "1px solid rgba(16,185,129,0.18)",
                }}
              >
                Eff {formatPercent(item.bookingRate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}