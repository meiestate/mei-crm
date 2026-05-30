import React, { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// =====================================================
// MEI CRM - MarketingAnalyticsPage.tsx
// Professional standalone Marketing Analytics page
// Works in Vite + React + TypeScript projects
// Requires: recharts + tailwindcss
// =====================================================

type DateRange = "7d" | "30d" | "90d" | "12m";
type MarketingSegment = "all" | "paid" | "organic" | "referral" | "partner";
type TrendDirection = "up" | "down" | "neutral";

type KpiCard = {
  id: string;
  title: string;
  value: string;
  helper: string;
  trend: string;
  direction: TrendDirection;
};

type MarketingPoint = {
  name: string;
  spend: number;
  leads: number;
  qualified: number;
  conversions: number;
  cpl: number;
  roi: number;
};

type DistributionPoint = {
  name: string;
  value: number;
};

type CampaignRow = {
  campaign: string;
  channel: string;
  spend: number;
  leads: number;
  qualified: number;
  conversions: number;
  cpl: number;
  roi: string;
  status: "excellent" | "good" | "watch" | "poor";
};

type ChannelRow = {
  channel: string;
  spend: number;
  leads: number;
  qualified: number;
  conversionRate: string;
  cpl: number;
  revenue: number;
  roi: string;
};

type MarketingAlert = {
  id: string;
  title: string;
  message: string;
  impact: "high" | "medium" | "low";
};

const DATE_RANGE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last 12 Months", value: "12m" },
];

const MARKETING_SEGMENT_OPTIONS: { label: string; value: MarketingSegment }[] = [
  { label: "All Marketing", value: "all" },
  { label: "Paid Campaigns", value: "paid" },
  { label: "Organic", value: "organic" },
  { label: "Referral", value: "referral" },
  { label: "Partner", value: "partner" },
];

const kpiCards: KpiCard[] = [
  {
    id: "marketing-spend",
    title: "Marketing Spend",
    value: "₹18.4L",
    helper: "Total campaign investment",
    trend: "+12.6%",
    direction: "neutral",
  },
  {
    id: "leads-generated",
    title: "Leads Generated",
    value: "2,846",
    helper: "Leads from all channels",
    trend: "+18.4%",
    direction: "up",
  },
  {
    id: "cost-per-lead",
    title: "Cost Per Lead",
    value: "₹647",
    helper: "Average CPL across channels",
    trend: "-9.2%",
    direction: "up",
  },
  {
    id: "marketing-roi",
    title: "Marketing ROI",
    value: "4.8x",
    helper: "Revenue return on ad spend",
    trend: "+0.7x",
    direction: "up",
  },
];

const marketingTrendData: MarketingPoint[] = [
  { name: "Jan", spend: 220000, leads: 312, qualified: 118, conversions: 28, cpl: 705, roi: 3.4 },
  { name: "Feb", spend: 260000, leads: 386, qualified: 148, conversions: 34, cpl: 674, roi: 3.7 },
  { name: "Mar", spend: 290000, leads: 428, qualified: 172, conversions: 39, cpl: 678, roi: 3.9 },
  { name: "Apr", spend: 320000, leads: 516, qualified: 214, conversions: 46, cpl: 620, roi: 4.3 },
  { name: "May", spend: 360000, leads: 584, qualified: 236, conversions: 51, cpl: 616, roi: 4.5 },
  { name: "Jun", spend: 390000, leads: 620, qualified: 254, conversions: 63, cpl: 629, roi: 4.8 },
];

const channelSplitData: DistributionPoint[] = [
  { name: "Meta Ads", value: 38 },
  { name: "Google Ads", value: 24 },
  { name: "Referral", value: 18 },
  { name: "Organic", value: 11 },
  { name: "Partner", value: 9 },
];

const spendSplitData: DistributionPoint[] = [
  { name: "Meta Ads", value: 42 },
  { name: "Google Ads", value: 31 },
  { name: "YouTube", value: 12 },
  { name: "Local Events", value: 9 },
  { name: "Influencer", value: 6 },
];

const qualitySplitData: DistributionPoint[] = [
  { name: "High Intent", value: 29 },
  { name: "Medium Intent", value: 44 },
  { name: "Low Intent", value: 21 },
  { name: "Invalid", value: 6 },
];

const campaignRows: CampaignRow[] = [
  {
    campaign: "Bangalore Premium Homes - Meta",
    channel: "Meta Ads",
    spend: 420000,
    leads: 682,
    qualified: 286,
    conversions: 34,
    cpl: 616,
    roi: "5.2x",
    status: "excellent",
  },
  {
    campaign: "Luxury Apartment Search - Google",
    channel: "Google Ads",
    spend: 360000,
    leads: 428,
    qualified: 224,
    conversions: 29,
    cpl: 841,
    roi: "4.7x",
    status: "good",
  },
  {
    campaign: "NRI Owner Referral Drive",
    channel: "Referral",
    spend: 98000,
    leads: 184,
    qualified: 112,
    conversions: 18,
    cpl: 533,
    roi: "7.8x",
    status: "excellent",
  },
  {
    campaign: "YouTube Property Explainer",
    channel: "YouTube",
    spend: 160000,
    leads: 146,
    qualified: 54,
    conversions: 7,
    cpl: 1096,
    roi: "2.1x",
    status: "watch",
  },
  {
    campaign: "Local Event Booth Campaign",
    channel: "Offline Event",
    spend: 125000,
    leads: 88,
    qualified: 26,
    conversions: 3,
    cpl: 1420,
    roi: "1.4x",
    status: "poor",
  },
];

const channelRows: ChannelRow[] = [
  {
    channel: "Meta Ads",
    spend: 720000,
    leads: 1080,
    qualified: 426,
    conversionRate: "5.4%",
    cpl: 667,
    revenue: 3860000,
    roi: "5.4x",
  },
  {
    channel: "Google Ads",
    spend: 560000,
    leads: 684,
    qualified: 356,
    conversionRate: "6.1%",
    cpl: 819,
    revenue: 2960000,
    roi: "5.3x",
  },
  {
    channel: "Referral",
    spend: 160000,
    leads: 382,
    qualified: 224,
    conversionRate: "8.2%",
    cpl: 419,
    revenue: 1840000,
    roi: "11.5x",
  },
  {
    channel: "Organic",
    spend: 78000,
    leads: 312,
    qualified: 126,
    conversionRate: "4.8%",
    cpl: 250,
    revenue: 960000,
    roi: "12.3x",
  },
];

const marketingAlerts: MarketingAlert[] = [
  {
    id: "marketing-alert-1",
    title: "Referral has the strongest ROI",
    message: "Referral campaigns are producing 11.5x ROI with lower CPL. Increase referral budget and launch broker/customer rewards.",
    impact: "high",
  },
  {
    id: "marketing-alert-2",
    title: "Offline event campaign is underperforming",
    message: "Local event campaign CPL is ₹1,420 with only 1.4x ROI. Pause or redesign the offer before spending more.",
    impact: "high",
  },
  {
    id: "marketing-alert-3",
    title: "Meta volume is strong but quality needs tightening",
    message: "Meta produces 38% of leads, but intent quality is mixed. Add budget filters, location exclusions and stronger qualification forms.",
    impact: "medium",
  },
];

const COLORS = ["#111827", "#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"];

function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

const TrendBadge: React.FC<{ direction: TrendDirection; value: string }> = ({ direction, value }) => {
  const styles: Record<TrendDirection, string> = {
    up: "border-emerald-200 bg-emerald-50 text-emerald-700",
    down: "border-rose-200 bg-rose-50 text-rose-700",
    neutral: "border-slate-200 bg-slate-50 text-slate-600",
  };

  const icon: Record<TrendDirection, string> = {
    up: "↗",
    down: "↘",
    neutral: "→",
  };

  return (
    <span className={classNames("inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-black", styles[direction])}>
      <span>{icon[direction]}</span>
      {value}
    </span>
  );
};

const PageHeader: React.FC<{
  dateRange: DateRange;
  segment: MarketingSegment;
  onDateRangeChange: (value: DateRange) => void;
  onSegmentChange: (value: MarketingSegment) => void;
}> = ({ dateRange, segment, onDateRangeChange, onSegmentChange }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-xs font-black text-pink-700">
            Marketing Intelligence Center
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Marketing Analytics</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Track campaign spend, leads, CPL, conversion, ROI, channel quality and growth opportunities.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={segment}
            onChange={(event) => onSegmentChange(event.target.value as MarketingSegment)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            {MARKETING_SEGMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(event) => onDateRangeChange(event.target.value as DateRange)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            {DATE_RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800">
            Export Marketing Report
          </button>
        </div>
      </div>
    </div>
  );
};

const KpiGrid: React.FC = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiCards.map((card) => (
        <div key={card.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-500">{card.title}</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{card.value}</h2>
            </div>
            <TrendBadge direction={card.direction} value={card.trend} />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500">{card.helper}</p>
        </div>
      ))}
    </div>
  );
};

const ChartCard: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="h-80">{children}</div>
    </div>
  );
};

const SpendLeadTrendChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={marketingTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip formatter={(value, name) => (name === "Spend" ? [formatCurrency(Number(value)), name] : [value, name])} />
        <Bar yAxisId="left" dataKey="spend" name="Spend" radius={[12, 12, 0, 0]} fill="#111827" />
        <Line yAxisId="right" type="monotone" dataKey="leads" name="Leads" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const LeadQualityTrendChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={marketingTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip />
        <Area type="monotone" dataKey="leads" name="Total Leads" stroke="#2563eb" fill="#dbeafe" strokeWidth={3} />
        <Area type="monotone" dataKey="qualified" name="Qualified Leads" stroke="#16a34a" fill="#dcfce7" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const CplRoiChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={marketingTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip formatter={(value, name) => (name === "CPL" ? [`₹${value}`, name] : [`${value}x`, name])} />
        <Bar yAxisId="left" dataKey="cpl" name="CPL" radius={[12, 12, 0, 0]} fill="#f59e0b" />
        <Line yAxisId="right" type="monotone" dataKey="roi" name="ROI" stroke="#111827" strokeWidth={3} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const ConversionTrendChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={marketingTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="qualified" name="Qualified" radius={[12, 12, 0, 0]} fill="#2563eb" />
        <Bar dataKey="conversions" name="Conversions" radius={[12, 12, 0, 0]} fill="#16a34a" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ChannelSplitChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={channelSplitData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
          {channelSplitData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Lead Share"]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const SpendSplitChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={spendSplitData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
          {spendSplitData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Spend Share"]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const QualitySplitPanel: React.FC = () => {
  const maxValue = Math.max(...qualitySplitData.map((item) => item.value));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black text-slate-950">Lead Intent Quality</h3>
        <p className="mt-1 text-sm text-slate-500">High, medium, low and invalid marketing lead split.</p>
      </div>

      <div className="space-y-4">
        {qualitySplitData.map((item, index) => {
          const width = Math.max((item.value / maxValue) * 100, 8);
          return (
            <div key={item.name}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-black text-slate-700">{item.name}</span>
                <span className="font-bold text-slate-500">{item.value}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 rounded-full" style={{ width: `${width}%`, backgroundColor: COLORS[index % COLORS.length] }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CampaignPerformanceTable: React.FC = () => {
  const statusStyles: Record<CampaignRow["status"], string> = {
    excellent: "bg-emerald-50 text-emerald-700",
    good: "bg-blue-50 text-blue-700",
    watch: "bg-amber-50 text-amber-700",
    poor: "bg-rose-50 text-rose-700",
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-base font-black text-slate-950">Campaign Performance</h3>
        <p className="mt-1 text-sm text-slate-500">Campaign-wise spend, leads, conversion, CPL and ROI.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4 font-black">Campaign</th>
              <th className="px-5 py-4 font-black">Spend</th>
              <th className="px-5 py-4 font-black">Leads</th>
              <th className="px-5 py-4 font-black">Qualified</th>
              <th className="px-5 py-4 font-black">Conv.</th>
              <th className="px-5 py-4 font-black">CPL</th>
              <th className="px-5 py-4 font-black">ROI</th>
              <th className="px-5 py-4 font-black">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {campaignRows.map((row) => (
              <tr key={row.campaign} className="transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="font-black text-slate-950">{row.campaign}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">{row.channel}</div>
                </td>
                <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(row.spend)}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{row.leads}</td>
                <td className="px-5 py-4 font-bold text-blue-700">{row.qualified}</td>
                <td className="px-5 py-4 font-bold text-emerald-700">{row.conversions}</td>
                <td className="px-5 py-4 font-bold text-slate-700">₹{row.cpl}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{row.roi}</td>
                <td className="px-5 py-4">
                  <span className={classNames("rounded-full px-3 py-1 text-xs font-black capitalize", statusStyles[row.status])}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ChannelPerformanceTable: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-base font-black text-slate-950">Channel Performance</h3>
        <p className="mt-1 text-sm text-slate-500">Channel-wise cost, lead quality, revenue and ROI tracking.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4 font-black">Channel</th>
              <th className="px-5 py-4 font-black">Spend</th>
              <th className="px-5 py-4 font-black">Leads</th>
              <th className="px-5 py-4 font-black">Qualified</th>
              <th className="px-5 py-4 font-black">Conv. Rate</th>
              <th className="px-5 py-4 font-black">CPL</th>
              <th className="px-5 py-4 font-black">Revenue</th>
              <th className="px-5 py-4 font-black">ROI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {channelRows.map((row) => (
              <tr key={row.channel} className="transition hover:bg-slate-50">
                <td className="px-5 py-4 font-black text-slate-950">{row.channel}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(row.spend)}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{row.leads}</td>
                <td className="px-5 py-4 font-bold text-blue-700">{row.qualified}</td>
                <td className="px-5 py-4 font-bold text-emerald-700">{row.conversionRate}</td>
                <td className="px-5 py-4 font-bold text-slate-700">₹{row.cpl}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(row.revenue)}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{row.roi}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MarketingInsightsPanel: React.FC = () => {
  const impactStyles: Record<MarketingAlert["impact"], string> = {
    high: "border-rose-200 bg-rose-50 text-rose-700",
    medium: "border-amber-200 bg-amber-50 text-amber-700",
    low: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black text-slate-950">Marketing AI Insights</h3>
        <p className="mt-1 text-sm text-slate-500">Action points to reduce CPL and improve campaign ROI.</p>
      </div>

      <div className="space-y-4">
        {marketingAlerts.map((alert) => (
          <div key={alert.id} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-black text-slate-950">{alert.title}</p>
              <span className={classNames("rounded-full border px-2 py-1 text-xs font-black capitalize", impactStyles[alert.impact])}>
                {alert.impact}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl">📣</div>
      <h3 className="text-lg font-black text-slate-950">No marketing analytics found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Add campaigns, spend, source, leads, conversions and revenue attribution to unlock marketing analytics.
      </p>
    </div>
  );
};

const MarketingAnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [segment, setSegment] = useState<MarketingSegment>("all");
  const [isLoading] = useState(false);
  const [hasError] = useState(false);

  const selectedSummary = useMemo(() => {
    const rangeLabel = DATE_RANGE_OPTIONS.find((item) => item.value === dateRange)?.label ?? "Selected Period";
    const segmentLabel = MARKETING_SEGMENT_OPTIONS.find((item) => item.value === segment)?.label ?? "All Marketing";
    return `${segmentLabel} performance for ${rangeLabel}`;
  }, [dateRange, segment]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="h-36 animate-pulse rounded-3xl bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-40 animate-pulse rounded-3xl bg-slate-200" />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />
            <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
            <h2 className="text-xl font-black text-rose-900">Unable to load marketing analytics</h2>
            <p className="mt-2 text-sm text-rose-700">Please check marketing API, campaign attribution, or CRM source data connection.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <PageHeader
          dateRange={dateRange}
          segment={segment}
          onDateRangeChange={setDateRange}
          onSegmentChange={setSegment}
        />

        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-slate-950">{selectedSummary}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Spend, leads, qualified leads, conversions, CPL, ROI and channel attribution intelligence.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Referral ROI 11.5x</span>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-700">1 Poor Campaign</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">Live Campaign Data</span>
          </div>
        </div>

        <KpiGrid />

        {marketingTrendData.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid gap-5 xl:grid-cols-2">
              <ChartCard title="Spend vs Leads" subtitle="Marketing spend and lead volume movement.">
                <SpendLeadTrendChart />
              </ChartCard>

              <ChartCard title="Lead Quality Trend" subtitle="Total leads against qualified leads.">
                <LeadQualityTrendChart />
              </ChartCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <ChartCard title="CPL vs ROI" subtitle="Cost per lead compared with return on investment.">
                <CplRoiChart />
              </ChartCard>

              <ChartCard title="Qualified vs Conversions" subtitle="Qualified lead to conversion movement.">
                <ConversionTrendChart />
              </ChartCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              <ChartCard title="Lead Channel Split" subtitle="Channel-wise lead contribution.">
                <ChannelSplitChart />
              </ChartCard>

              <ChartCard title="Spend Split" subtitle="Marketing budget allocation by channel.">
                <SpendSplitChart />
              </ChartCard>

              <QualitySplitPanel />
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <CampaignPerformanceTable />
              <MarketingInsightsPanel />
            </div>

            <ChannelPerformanceTable />
          </>
        )}
      </div>
    </div>
  );
};

export default MarketingAnalyticsPage;
