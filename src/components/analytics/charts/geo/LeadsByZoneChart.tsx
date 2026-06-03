import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// =====================================================
// MEI CRM - LeadsByZoneChart.tsx
// Zone-wise lead analytics component
// Vite + React + TypeScript + TailwindCSS + Recharts
// =====================================================

export type ZoneMetric = "totalLeads" | "qualifiedLeads" | "hotLeads" | "conversionRate" | "avgBudget";
export type ZonePeriod = "7d" | "30d" | "90d" | "12m";
export type ZoneSegment = "all" | "buying" | "rental" | "investment" | "nri";
export type ZoneStatus = "excellent" | "good" | "watch" | "weak";

export type LeadsByZoneItem = {
  id: string;
  zone: string;
  city: string;
  topAreas: string[];
  totalLeads: number;
  qualifiedLeads: number;
  hotLeads: number;
  siteVisits: number;
  deals: number;
  conversionRate: number;
  avgBudget: number;
  budgetFit: number;
  responseTimeMins: number;
  trend: number;
  topSource: string;
  status: ZoneStatus;
};

export type ZoneTrendPoint = {
  name: string;
  north: number;
  south: number;
  east: number;
  west: number;
  central: number;
};

export type ZoneSourcePoint = {
  name: string;
  value: number;
};

type MetricConfig = {
  label: string;
  helper: string;
};

type LeadsByZoneChartProps = {
  title?: string;
  subtitle?: string;
  data?: LeadsByZoneItem[];
  trendData?: ZoneTrendPoint[];
  sourceData?: ZoneSourcePoint[];
  defaultMetric?: ZoneMetric;
  defaultPeriod?: ZonePeriod;
  defaultSegment?: ZoneSegment;
  showControls?: boolean;
  showSummary?: boolean;
  showTrend?: boolean;
  showSourceSplit?: boolean;
  showTable?: boolean;
  onZoneClick?: (item: LeadsByZoneItem) => void;
};

const COLORS = ["#111827", "#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"];

const metricConfig: Record<ZoneMetric, MetricConfig> = {
  totalLeads: {
    label: "Total Leads",
    helper: "Overall lead volume received from each zone",
  },
  qualifiedLeads: {
    label: "Qualified Leads",
    helper: "Sales-ready leads after qualification",
  },
  hotLeads: {
    label: "Hot Leads",
    helper: "High-intent leads requiring immediate follow-up",
  },
  conversionRate: {
    label: "Conversion Rate",
    helper: "Lead to deal conversion percentage",
  },
  avgBudget: {
    label: "Average Budget",
    helper: "Average customer budget by zone",
  },
};

const metricOptions: { label: string; value: ZoneMetric }[] = [
  { label: "Total Leads", value: "totalLeads" },
  { label: "Qualified Leads", value: "qualifiedLeads" },
  { label: "Hot Leads", value: "hotLeads" },
  { label: "Conversion Rate", value: "conversionRate" },
  { label: "Avg Budget", value: "avgBudget" },
];

const periodOptions: { label: string; value: ZonePeriod }[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last 12 Months", value: "12m" },
];

const segmentOptions: { label: string; value: ZoneSegment }[] = [
  { label: "All Leads", value: "all" },
  { label: "Buying", value: "buying" },
  { label: "Rental", value: "rental" },
  { label: "Investment", value: "investment" },
  { label: "NRI", value: "nri" },
];

const defaultZoneData: LeadsByZoneItem[] = [
  {
    id: "zone-east",
    zone: "East Zone",
    city: "Bengaluru",
    topAreas: ["Whitefield", "Marathahalli", "KR Puram"],
    totalLeads: 1486,
    qualifiedLeads: 642,
    hotLeads: 218,
    siteVisits: 186,
    deals: 52,
    conversionRate: 3.5,
    avgBudget: 8600000,
    budgetFit: 78,
    responseTimeMins: 18,
    trend: 14.2,
    topSource: "Meta Ads",
    status: "excellent",
  },
  {
    id: "zone-south-east",
    zone: "South-East Zone",
    city: "Bengaluru",
    topAreas: ["Sarjapur Road", "Bellandur", "Haralur"],
    totalLeads: 1268,
    qualifiedLeads: 548,
    hotLeads: 184,
    siteVisits: 156,
    deals: 43,
    conversionRate: 3.39,
    avgBudget: 8200000,
    budgetFit: 76,
    responseTimeMins: 22,
    trend: 11.6,
    topSource: "Google Ads",
    status: "excellent",
  },
  {
    id: "zone-south",
    zone: "South Zone",
    city: "Bengaluru",
    topAreas: ["HSR Layout", "JP Nagar", "Banashankari"],
    totalLeads: 1084,
    qualifiedLeads: 462,
    hotLeads: 156,
    siteVisits: 128,
    deals: 34,
    conversionRate: 3.14,
    avgBudget: 9400000,
    budgetFit: 69,
    responseTimeMins: 26,
    trend: 7.8,
    topSource: "Referral",
    status: "good",
  },
  {
    id: "zone-north",
    zone: "North Zone",
    city: "Bengaluru",
    topAreas: ["Hebbal", "Yelahanka", "Thanisandra"],
    totalLeads: 936,
    qualifiedLeads: 386,
    hotLeads: 132,
    siteVisits: 104,
    deals: 27,
    conversionRate: 2.88,
    avgBudget: 9800000,
    budgetFit: 72,
    responseTimeMins: 28,
    trend: 9.1,
    topSource: "Organic",
    status: "good",
  },
  {
    id: "zone-central",
    zone: "Central Zone",
    city: "Bengaluru",
    topAreas: ["Indiranagar", "MG Road", "Richmond Town"],
    totalLeads: 692,
    qualifiedLeads: 284,
    hotLeads: 88,
    siteVisits: 72,
    deals: 16,
    conversionRate: 2.31,
    avgBudget: 15600000,
    budgetFit: 58,
    responseTimeMins: 34,
    trend: -2.6,
    topSource: "Direct",
    status: "watch",
  },
  {
    id: "zone-west",
    zone: "West Zone",
    city: "Bengaluru",
    topAreas: ["Rajajinagar", "Vijayanagar", "Nagarbhavi"],
    totalLeads: 486,
    qualifiedLeads: 168,
    hotLeads: 42,
    siteVisits: 38,
    deals: 8,
    conversionRate: 1.65,
    avgBudget: 7600000,
    budgetFit: 52,
    responseTimeMins: 42,
    trend: -4.8,
    topSource: "Local Campaign",
    status: "weak",
  },
];

const defaultTrendData: ZoneTrendPoint[] = [
  { name: "Jan", north: 118, south: 152, east: 196, west: 74, central: 92 },
  { name: "Feb", north: 132, south: 166, east: 218, west: 82, central: 98 },
  { name: "Mar", north: 146, south: 184, east: 246, west: 88, central: 104 },
  { name: "Apr", north: 158, south: 206, east: 282, west: 86, central: 112 },
  { name: "May", north: 176, south: 224, east: 318, west: 78, central: 108 },
  { name: "Jun", north: 196, south: 252, east: 354, west: 72, central: 102 },
];

const defaultSourceData: ZoneSourcePoint[] = [
  { name: "Meta Ads", value: 34 },
  { name: "Google Ads", value: 26 },
  { name: "Referral", value: 18 },
  { name: "Organic", value: 12 },
  { name: "Direct", value: 6 },
  { name: "Offline", value: 4 },
];

function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${formatNumber(value)}`;
}

function getMetricValue(item: LeadsByZoneItem, metric: ZoneMetric): number {
  return item[metric];
}

function formatMetricValue(value: number, metric: ZoneMetric): string {
  if (metric === "avgBudget") return formatCurrency(value);
  if (metric === "conversionRate") return `${value.toFixed(2)}%`;
  return formatNumber(value);
}

function getZoneIntensity(value: number, min: number, max: number): string {
  if (max === min) return "bg-slate-100 text-slate-800 border-slate-200";

  const ratio = (value - min) / (max - min);

  if (ratio >= 0.85) return "bg-emerald-700 text-white border-emerald-800";
  if (ratio >= 0.68) return "bg-emerald-500 text-white border-emerald-600";
  if (ratio >= 0.5) return "bg-blue-200 text-blue-950 border-blue-300";
  if (ratio >= 0.32) return "bg-amber-200 text-amber-950 border-amber-300";
  if (ratio >= 0.15) return "bg-orange-100 text-orange-900 border-orange-200";
  return "bg-rose-100 text-rose-900 border-rose-200";
}

const statusStyles: Record<ZoneStatus, string> = {
  excellent: "bg-emerald-50 text-emerald-700 border-emerald-200",
  good: "bg-blue-50 text-blue-700 border-blue-200",
  watch: "bg-amber-50 text-amber-700 border-amber-200",
  weak: "bg-rose-50 text-rose-700 border-rose-200",
};

const SummaryCard: React.FC<{ label: string; value: string; helper: string }> = ({ label, value, helper }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</h3>
      <p className="mt-1 text-xs font-semibold text-slate-500">{helper}</p>
    </div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl">🧭</div>
      <h3 className="text-lg font-black text-slate-950">No zone lead data found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Add zone, lead source, qualification, site visit and deal data to unlock zone-wise analytics.
      </p>
    </div>
  );
};

const LeadsByZoneChart: React.FC<LeadsByZoneChartProps> = ({
  title = "Leads by Zone",
  subtitle = "Track lead volume, quality, hot leads, conversion and budget fit across city zones.",
  data = defaultZoneData,
  trendData = defaultTrendData,
  sourceData = defaultSourceData,
  defaultMetric = "totalLeads",
  defaultPeriod = "30d",
  defaultSegment = "all",
  showControls = true,
  showSummary = true,
  showTrend = true,
  showSourceSplit = true,
  showTable = true,
  onZoneClick,
}) => {
  const [metric, setMetric] = useState<ZoneMetric>(defaultMetric);
  const [period, setPeriod] = useState<ZonePeriod>(defaultPeriod);
  const [segment, setSegment] = useState<ZoneSegment>(defaultSegment);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    const cleanSearch = searchTerm.trim().toLowerCase();

    return data
      .filter((item) => {
        if (!cleanSearch) return true;

        return (
          item.zone.toLowerCase().includes(cleanSearch) ||
          item.city.toLowerCase().includes(cleanSearch) ||
          item.topAreas.some((area) => area.toLowerCase().includes(cleanSearch)) ||
          item.topSource.toLowerCase().includes(cleanSearch)
        );
      })
      .sort((a, b) => getMetricValue(b, metric) - getMetricValue(a, metric));
  }, [data, metric, searchTerm]);

  const metricValues = useMemo(() => filteredData.map((item) => getMetricValue(item, metric)), [filteredData, metric]);
  const minValue = metricValues.length ? Math.min(...metricValues) : 0;
  const maxValue = metricValues.length ? Math.max(...metricValues) : 0;

  const selectedZone = useMemo(() => {
    return filteredData.find((item) => item.id === selectedId) ?? filteredData[0] ?? null;
  }, [filteredData, selectedId]);

  const summary = useMemo(() => {
    const totalLeads = filteredData.reduce((sum, item) => sum + item.totalLeads, 0);
    const qualifiedLeads = filteredData.reduce((sum, item) => sum + item.qualifiedLeads, 0);
    const hotLeads = filteredData.reduce((sum, item) => sum + item.hotLeads, 0);
    const totalDeals = filteredData.reduce((sum, item) => sum + item.deals, 0);
    const avgBudget = filteredData.length ? filteredData.reduce((sum, item) => sum + item.avgBudget, 0) / filteredData.length : 0;
    const avgConversion = totalLeads > 0 ? (totalDeals / totalLeads) * 100 : 0;

    return {
      totalLeads,
      qualifiedLeads,
      hotLeads,
      totalDeals,
      avgBudget,
      avgConversion,
    };
  }, [filteredData]);

  const barData = useMemo(() => {
    return filteredData.map((item) => ({
      zone: item.zone.replace(" Zone", ""),
      value: getMetricValue(item, metric),
      status: item.status,
    }));
  }, [filteredData, metric]);

  const handleZoneClick = (item: LeadsByZoneItem) => {
    setSelectedId(item.id);
    onZoneClick?.(item);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm md:p-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
              Zone Intelligence
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-950 md:text-2xl">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>

          {showControls && (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap 2xl:justify-end">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search zone, area, source..."
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />

              <select
                value={segment}
                onChange={(event) => setSegment(event.target.value as ZoneSegment)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                {segmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={metric}
                onChange={(event) => setMetric(event.target.value as ZoneMetric)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                {metricOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value as ZonePeriod)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="mt-5">
          <EmptyState />
        </div>
      ) : (
        <>
          {showSummary && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              <SummaryCard label="Total Leads" value={formatNumber(summary.totalLeads)} helper="All selected zones" />
              <SummaryCard label="Qualified" value={formatNumber(summary.qualifiedLeads)} helper="Sales-ready leads" />
              <SummaryCard label="Hot Leads" value={formatNumber(summary.hotLeads)} helper="High intent leads" />
              <SummaryCard label="Deals" value={formatNumber(summary.totalDeals)} helper="Closed deals" />
              <SummaryCard label="Conversion" value={`${summary.avgConversion.toFixed(2)}%`} helper="Overall conversion" />
              <SummaryCard label="Avg Budget" value={formatCurrency(summary.avgBudget)} helper="Zone average" />
            </div>
          )}

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-950">Zone Map by {metricConfig[metric].label}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {metricConfig[metric].helper} · {periodOptions.find((item) => item.value === period)?.label} · {segmentOptions.find((item) => item.value === segment)?.label}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                  <span>Low</span>
                  <div className="h-3 w-10 rounded-full bg-rose-100" />
                  <div className="h-3 w-10 rounded-full bg-amber-200" />
                  <div className="h-3 w-10 rounded-full bg-blue-200" />
                  <div className="h-3 w-10 rounded-full bg-emerald-600" />
                  <span>High</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredData.map((item) => {
                  const value = getMetricValue(item, metric);
                  const isSelected = selectedZone?.id === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleZoneClick(item)}
                      className={classNames(
                        "rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-100",
                        getZoneIntensity(value, minValue, maxValue),
                        isSelected && "ring-4 ring-slate-200",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black">{item.zone}</p>
                          <p className="mt-1 text-xs font-bold opacity-80">{item.city}</p>
                        </div>
                        <span className="rounded-full bg-white/25 px-2 py-1 text-xs font-black">
                          {item.trend >= 0 ? "+" : ""}{item.trend.toFixed(1)}%
                        </span>
                      </div>

                      <div className="mt-5">
                        <p className="text-2xl font-black tracking-tight">{formatMetricValue(value, metric)}</p>
                        <p className="mt-1 text-xs font-bold opacity-80">
                          {formatNumber(item.qualifiedLeads)} qualified · {formatNumber(item.siteVisits)} visits
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-base font-black text-slate-950">Selected Zone</h3>
                <p className="mt-1 text-sm text-slate-500">Lead quality, speed and conversion breakdown.</p>
              </div>

              {selectedZone && (
                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-950 p-5 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xl font-black">{selectedZone.zone}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-300">{selectedZone.topAreas.join(" · ")}</p>
                      </div>
                      <span className={classNames("rounded-full px-3 py-1 text-xs font-black capitalize", statusStyles[selectedZone.status])}>
                        {selectedZone.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/10 p-3">
                        <p className="text-xs font-bold text-slate-300">Leads</p>
                        <p className="mt-1 text-lg font-black">{formatNumber(selectedZone.totalLeads)}</p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-3">
                        <p className="text-xs font-bold text-slate-300">Conversion</p>
                        <p className="mt-1 text-lg font-black">{selectedZone.conversionRate.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <SummaryCard label="Hot Leads" value={formatNumber(selectedZone.hotLeads)} helper="Immediate follow-up" />
                    <SummaryCard label="Site Visits" value={formatNumber(selectedZone.siteVisits)} helper="Completed visits" />
                    <SummaryCard label="Deals" value={formatNumber(selectedZone.deals)} helper="Closed deals" />
                    <SummaryCard label="Budget Fit" value={`${selectedZone.budgetFit}%`} helper="Matching stock" />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-black text-slate-950">Zone Signal</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Top source is <span className="font-black text-slate-900">{selectedZone.topSource}</span>. Average response time is{" "}
                      <span className="font-black text-slate-900">{selectedZone.responseTimeMins} mins</span>.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-black text-slate-950">Action Insight</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {selectedZone.status === "excellent"
                        ? `${selectedZone.zone} is performing strongly. Increase campaign budget and assign your fastest closers here.`
                        : selectedZone.status === "good"
                          ? `${selectedZone.zone} has healthy demand. Improve response time and push more site visits.`
                          : selectedZone.status === "watch"
                            ? `${selectedZone.zone} needs better budget matching and source optimization before scaling spend.`
                            : `${selectedZone.zone} is weak. Reduce spend, audit lead quality, and improve local property inventory.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-base font-black text-slate-950">Zone Ranking</h3>
                <p className="mt-1 text-sm text-slate-500">Ranking by selected metric.</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="zone" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <Tooltip formatter={(value) => [formatMetricValue(Number(value), metric), metricConfig[metric].label]} />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`${entry.zone}-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {showTrend && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <h3 className="text-base font-black text-slate-950">Lead Trend by Zone</h3>
                  <p className="mt-1 text-sm text-slate-500">Monthly lead movement across major zones.</p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="east" name="East" stroke="#111827" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="south" name="South" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="north" name="North" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="west" name="West" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {showSourceSplit && (
            <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-base font-black text-slate-950">Lead Source Split</h3>
                <p className="mt-1 text-sm text-slate-500">Overall source contribution for selected zone analytics.</p>
              </div>
              <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                        {sourceData.map((entry, index) => (
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid content-center gap-3 sm:grid-cols-2">
                  {sourceData.map((item, index) => (
                    <div key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <p className="text-sm font-black text-slate-950">{item.name}</p>
                      </div>
                      <p className="mt-2 text-2xl font-black text-slate-950">{item.value}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showTable && (
            <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <h3 className="text-base font-black text-slate-950">Leads by Zone Table</h3>
                <p className="mt-1 text-sm text-slate-500">Zone-wise lead quality, conversion, budget and response speed.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-black">Zone</th>
                      <th className="px-5 py-4 font-black">Leads</th>
                      <th className="px-5 py-4 font-black">Qualified</th>
                      <th className="px-5 py-4 font-black">Hot</th>
                      <th className="px-5 py-4 font-black">Visits</th>
                      <th className="px-5 py-4 font-black">Deals</th>
                      <th className="px-5 py-4 font-black">Conv.</th>
                      <th className="px-5 py-4 font-black">Avg Budget</th>
                      <th className="px-5 py-4 font-black">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredData.map((item) => (
                      <tr key={item.id} onClick={() => handleZoneClick(item)} className="cursor-pointer transition hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <div className="font-black text-slate-950">{item.zone}</div>
                          <div className="mt-1 text-xs font-semibold text-slate-500">{item.topAreas.join(", ")}</div>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-700">{formatNumber(item.totalLeads)}</td>
                        <td className="px-5 py-4 font-bold text-blue-700">{formatNumber(item.qualifiedLeads)}</td>
                        <td className="px-5 py-4 font-bold text-rose-700">{formatNumber(item.hotLeads)}</td>
                        <td className="px-5 py-4 font-bold text-emerald-700">{formatNumber(item.siteVisits)}</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{formatNumber(item.deals)}</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{item.conversionRate.toFixed(2)}%</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(item.avgBudget)}</td>
                        <td className="px-5 py-4">
                          <span className={classNames("rounded-full border px-3 py-1 text-xs font-black capitalize", statusStyles[item.status])}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeadsByZoneChart;
