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
// MEI CRM - RevenueByZoneChart.tsx
// Zone-wise revenue analytics component
// Vite + React + TypeScript + TailwindCSS + Recharts
// =====================================================

export type RevenueZoneMetric =
  | "totalRevenue"
  | "collectedRevenue"
  | "pendingRevenue"
  | "avgDealValue"
  | "commissionEarned"
  | "targetAchievement";

export type RevenueZonePeriod = "7d" | "30d" | "90d" | "12m";
export type RevenueZoneSegment = "all" | "residential" | "commercial" | "rental" | "resale";
export type RevenueZoneStatus = "excellent" | "good" | "watch" | "weak";

export type RevenueByZoneItem = {
  id: string;
  zone: string;
  city: string;
  topAreas: string[];
  totalRevenue: number;
  collectedRevenue: number;
  pendingRevenue: number;
  forecastRevenue: number;
  targetRevenue: number;
  targetAchievement: number;
  dealsClosed: number;
  activeDeals: number;
  avgDealValue: number;
  commissionEarned: number;
  commissionPending: number;
  collectionRate: number;
  growthRate: number;
  topProjectType: string;
  topRevenueSource: string;
  status: RevenueZoneStatus;
};

export type RevenueZoneTrendPoint = {
  name: string;
  north: number;
  south: number;
  east: number;
  west: number;
  central: number;
};

export type RevenueSourcePoint = {
  name: string;
  value: number;
};

type MetricConfig = {
  label: string;
  helper: string;
};

type RevenueByZoneChartProps = {
  title?: string;
  subtitle?: string;
  data?: RevenueByZoneItem[];
  trendData?: RevenueZoneTrendPoint[];
  sourceData?: RevenueSourcePoint[];
  defaultMetric?: RevenueZoneMetric;
  defaultPeriod?: RevenueZonePeriod;
  defaultSegment?: RevenueZoneSegment;
  showControls?: boolean;
  showSummary?: boolean;
  showTrend?: boolean;
  showSourceSplit?: boolean;
  showTable?: boolean;
  onZoneClick?: (item: RevenueByZoneItem) => void;
};

const COLORS = ["#111827", "#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"];

const metricConfig: Record<RevenueZoneMetric, MetricConfig> = {
  totalRevenue: {
    label: "Total Revenue",
    helper: "Total booked revenue generated from each zone",
  },
  collectedRevenue: {
    label: "Collected Revenue",
    helper: "Amount collected and realized from closed deals",
  },
  pendingRevenue: {
    label: "Pending Revenue",
    helper: "Outstanding receivables from closed or booked deals",
  },
  avgDealValue: {
    label: "Average Deal Value",
    helper: "Average revenue value per closed deal",
  },
  commissionEarned: {
    label: "Commission Earned",
    helper: "Commission earned from zone-wise deal closures",
  },
  targetAchievement: {
    label: "Target Achievement",
    helper: "Revenue achieved against assigned zone target",
  },
};

const metricOptions: { label: string; value: RevenueZoneMetric }[] = [
  { label: "Total Revenue", value: "totalRevenue" },
  { label: "Collected", value: "collectedRevenue" },
  { label: "Pending", value: "pendingRevenue" },
  { label: "Avg Deal", value: "avgDealValue" },
  { label: "Commission", value: "commissionEarned" },
  { label: "Target %", value: "targetAchievement" },
];

const periodOptions: { label: string; value: RevenueZonePeriod }[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last 12 Months", value: "12m" },
];

const segmentOptions: { label: string; value: RevenueZoneSegment }[] = [
  { label: "All Revenue", value: "all" },
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Rental", value: "rental" },
  { label: "Resale", value: "resale" },
];

const defaultRevenueData: RevenueByZoneItem[] = [
  {
    id: "revenue-east",
    zone: "East Zone",
    city: "Bengaluru",
    topAreas: ["Whitefield", "Marathahalli", "KR Puram"],
    totalRevenue: 86400000,
    collectedRevenue: 68200000,
    pendingRevenue: 18200000,
    forecastRevenue: 112000000,
    targetRevenue: 80000000,
    targetAchievement: 108,
    dealsClosed: 52,
    activeDeals: 86,
    avgDealValue: 1661538,
    commissionEarned: 2592000,
    commissionPending: 546000,
    collectionRate: 78.94,
    growthRate: 18.6,
    topProjectType: "Premium Apartments",
    topRevenueSource: "Builder Channel",
    status: "excellent",
  },
  {
    id: "revenue-south-east",
    zone: "South-East Zone",
    city: "Bengaluru",
    topAreas: ["Sarjapur Road", "Bellandur", "Haralur"],
    totalRevenue: 72400000,
    collectedRevenue: 54800000,
    pendingRevenue: 17600000,
    forecastRevenue: 94800000,
    targetRevenue: 70000000,
    targetAchievement: 103.43,
    dealsClosed: 43,
    activeDeals: 74,
    avgDealValue: 1683721,
    commissionEarned: 2172000,
    commissionPending: 528000,
    collectionRate: 75.69,
    growthRate: 15.4,
    topProjectType: "Gated Community",
    topRevenueSource: "Direct Sales",
    status: "excellent",
  },
  {
    id: "revenue-south",
    zone: "South Zone",
    city: "Bengaluru",
    topAreas: ["HSR Layout", "JP Nagar", "Banashankari"],
    totalRevenue: 59800000,
    collectedRevenue: 47200000,
    pendingRevenue: 12600000,
    forecastRevenue: 76200000,
    targetRevenue: 62000000,
    targetAchievement: 96.45,
    dealsClosed: 34,
    activeDeals: 58,
    avgDealValue: 1758824,
    commissionEarned: 1794000,
    commissionPending: 378000,
    collectionRate: 78.93,
    growthRate: 9.8,
    topProjectType: "Ready-to-move Homes",
    topRevenueSource: "Referral",
    status: "good",
  },
  {
    id: "revenue-north",
    zone: "North Zone",
    city: "Bengaluru",
    topAreas: ["Hebbal", "Yelahanka", "Thanisandra"],
    totalRevenue: 53600000,
    collectedRevenue: 38600000,
    pendingRevenue: 15000000,
    forecastRevenue: 81800000,
    targetRevenue: 60000000,
    targetAchievement: 89.33,
    dealsClosed: 27,
    activeDeals: 63,
    avgDealValue: 1985185,
    commissionEarned: 1608000,
    commissionPending: 450000,
    collectionRate: 72.01,
    growthRate: 12.2,
    topProjectType: "Luxury Apartments",
    topRevenueSource: "NRI Leads",
    status: "good",
  },
  {
    id: "revenue-central",
    zone: "Central Zone",
    city: "Bengaluru",
    topAreas: ["Indiranagar", "MG Road", "Richmond Town"],
    totalRevenue: 41200000,
    collectedRevenue: 28400000,
    pendingRevenue: 12800000,
    forecastRevenue: 57400000,
    targetRevenue: 52000000,
    targetAchievement: 79.23,
    dealsClosed: 16,
    activeDeals: 35,
    avgDealValue: 2575000,
    commissionEarned: 1236000,
    commissionPending: 384000,
    collectionRate: 68.93,
    growthRate: -2.8,
    topProjectType: "Luxury Resale",
    topRevenueSource: "Direct Walk-in",
    status: "watch",
  },
  {
    id: "revenue-west",
    zone: "West Zone",
    city: "Bengaluru",
    topAreas: ["Rajajinagar", "Vijayanagar", "Nagarbhavi"],
    totalRevenue: 18800000,
    collectedRevenue: 12600000,
    pendingRevenue: 6200000,
    forecastRevenue: 24600000,
    targetRevenue: 42000000,
    targetAchievement: 44.76,
    dealsClosed: 8,
    activeDeals: 22,
    avgDealValue: 2350000,
    commissionEarned: 564000,
    commissionPending: 186000,
    collectionRate: 67.02,
    growthRate: -8.4,
    topProjectType: "Budget Homes",
    topRevenueSource: "Local Campaign",
    status: "weak",
  },
];

const defaultTrendData: RevenueZoneTrendPoint[] = [
  { name: "Jan", north: 62, south: 74, east: 96, west: 28, central: 48 },
  { name: "Feb", north: 68, south: 82, east: 108, west: 31, central: 52 },
  { name: "Mar", north: 76, south: 88, east: 124, west: 34, central: 56 },
  { name: "Apr", north: 84, south: 96, east: 142, west: 32, central: 54 },
  { name: "May", north: 91, south: 104, east: 158, west: 29, central: 50 },
  { name: "Jun", north: 104, south: 118, east: 176, west: 26, central: 46 },
];

const defaultSourceData: RevenueSourcePoint[] = [
  { name: "Builder Channel", value: 38 },
  { name: "Direct Sales", value: 24 },
  { name: "Referral", value: 16 },
  { name: "NRI Leads", value: 10 },
  { name: "Resale", value: 8 },
  { name: "Rental", value: 4 },
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

function getMetricValue(item: RevenueByZoneItem, metric: RevenueZoneMetric): number {
  return item[metric];
}

function formatMetricValue(value: number, metric: RevenueZoneMetric): string {
  if (metric === "targetAchievement") {
    return `${value.toFixed(2)}%`;
  }

  return formatCurrency(value);
}

function getRevenueIntensity(value: number, min: number, max: number): string {
  if (max === min) return "bg-slate-100 text-slate-800 border-slate-200";

  const ratio = (value - min) / (max - min);

  if (ratio >= 0.85) return "bg-emerald-700 text-white border-emerald-800";
  if (ratio >= 0.68) return "bg-emerald-500 text-white border-emerald-600";
  if (ratio >= 0.5) return "bg-blue-200 text-blue-950 border-blue-300";
  if (ratio >= 0.32) return "bg-amber-200 text-amber-950 border-amber-300";
  if (ratio >= 0.15) return "bg-orange-100 text-orange-900 border-orange-200";
  return "bg-rose-100 text-rose-900 border-rose-200";
}

const statusStyles: Record<RevenueZoneStatus, string> = {
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
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl">💰</div>
      <h3 className="text-lg font-black text-slate-950">No zone revenue data found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Add closed deals, collections, pending payments and commission data to unlock revenue-by-zone analytics.
      </p>
    </div>
  );
};

const RevenueByZoneChart: React.FC<RevenueByZoneChartProps> = ({
  title = "Revenue by Zone",
  subtitle = "Track total revenue, collections, pending amount, commission, target achievement and forecast by city zone.",
  data = defaultRevenueData,
  trendData = defaultTrendData,
  sourceData = defaultSourceData,
  defaultMetric = "totalRevenue",
  defaultPeriod = "30d",
  defaultSegment = "all",
  showControls = true,
  showSummary = true,
  showTrend = true,
  showSourceSplit = true,
  showTable = true,
  onZoneClick,
}) => {
  const [metric, setMetric] = useState<RevenueZoneMetric>(defaultMetric);
  const [period, setPeriod] = useState<RevenueZonePeriod>(defaultPeriod);
  const [segment, setSegment] = useState<RevenueZoneSegment>(defaultSegment);
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
          item.topProjectType.toLowerCase().includes(cleanSearch) ||
          item.topRevenueSource.toLowerCase().includes(cleanSearch)
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
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.totalRevenue, 0);
    const collectedRevenue = filteredData.reduce((sum, item) => sum + item.collectedRevenue, 0);
    const pendingRevenue = filteredData.reduce((sum, item) => sum + item.pendingRevenue, 0);
    const forecastRevenue = filteredData.reduce((sum, item) => sum + item.forecastRevenue, 0);
    const commissionEarned = filteredData.reduce((sum, item) => sum + item.commissionEarned, 0);
    const dealsClosed = filteredData.reduce((sum, item) => sum + item.dealsClosed, 0);
    const avgCollectionRate = totalRevenue > 0 ? (collectedRevenue / totalRevenue) * 100 : 0;
    const avgDealValue = dealsClosed > 0 ? totalRevenue / dealsClosed : 0;

    return {
      totalRevenue,
      collectedRevenue,
      pendingRevenue,
      forecastRevenue,
      commissionEarned,
      dealsClosed,
      avgCollectionRate,
      avgDealValue,
    };
  }, [filteredData]);

  const barData = useMemo(() => {
    return filteredData.map((item) => ({
      zone: item.zone.replace(" Zone", ""),
      value: getMetricValue(item, metric),
      status: item.status,
    }));
  }, [filteredData, metric]);

  const handleZoneClick = (item: RevenueByZoneItem) => {
    setSelectedId(item.id);
    onZoneClick?.(item);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm md:p-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              Revenue Intelligence
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
                onChange={(event) => setSegment(event.target.value as RevenueZoneSegment)}
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
                onChange={(event) => setMetric(event.target.value as RevenueZoneMetric)}
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
                onChange={(event) => setPeriod(event.target.value as RevenueZonePeriod)}
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
              <SummaryCard label="Revenue" value={formatCurrency(summary.totalRevenue)} helper="Total booked" />
              <SummaryCard label="Collected" value={formatCurrency(summary.collectedRevenue)} helper={`${summary.avgCollectionRate.toFixed(1)}% collection`} />
              <SummaryCard label="Pending" value={formatCurrency(summary.pendingRevenue)} helper="Receivables" />
              <SummaryCard label="Forecast" value={formatCurrency(summary.forecastRevenue)} helper="Expected pipeline" />
              <SummaryCard label="Commission" value={formatCurrency(summary.commissionEarned)} helper="Earned commission" />
              <SummaryCard label="Avg Deal" value={formatCurrency(summary.avgDealValue)} helper={`${summary.dealsClosed} deals`} />
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
                        getRevenueIntensity(value, minValue, maxValue),
                        isSelected && "ring-4 ring-slate-200",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black">{item.zone}</p>
                          <p className="mt-1 text-xs font-bold opacity-80">{item.city}</p>
                        </div>
                        <span className="rounded-full bg-white/25 px-2 py-1 text-xs font-black">
                          {item.growthRate >= 0 ? "+" : ""}{item.growthRate.toFixed(1)}%
                        </span>
                      </div>

                      <div className="mt-5">
                        <p className="text-2xl font-black tracking-tight">{formatMetricValue(value, metric)}</p>
                        <p className="mt-1 text-xs font-bold opacity-80">
                          {formatNumber(item.dealsClosed)} deals · {item.collectionRate.toFixed(1)}% collected
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
                <p className="mt-1 text-sm text-slate-500">Revenue, collections and commission breakdown.</p>
              </div>

              {selectedZone && (
                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-950 p-5 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xl font-black">{selectedZone.zone}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-300">{selectedZone.topAreas.join(" · ")}</p>
                      </div>
                      <span className={classNames("rounded-full border px-3 py-1 text-xs font-black capitalize", statusStyles[selectedZone.status])}>
                        {selectedZone.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/10 p-3">
                        <p className="text-xs font-bold text-slate-300">Revenue</p>
                        <p className="mt-1 text-lg font-black">{formatCurrency(selectedZone.totalRevenue)}</p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-3">
                        <p className="text-xs font-bold text-slate-300">Target</p>
                        <p className="mt-1 text-lg font-black">{selectedZone.targetAchievement.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <SummaryCard label="Collected" value={formatCurrency(selectedZone.collectedRevenue)} helper={`${selectedZone.collectionRate.toFixed(1)}% rate`} />
                    <SummaryCard label="Pending" value={formatCurrency(selectedZone.pendingRevenue)} helper="Receivable" />
                    <SummaryCard label="Commission" value={formatCurrency(selectedZone.commissionEarned)} helper="Earned" />
                    <SummaryCard label="Forecast" value={formatCurrency(selectedZone.forecastRevenue)} helper="Pipeline" />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-black text-slate-950">Revenue Signal</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Top source is <span className="font-black text-slate-900">{selectedZone.topRevenueSource}</span>. Main project type is{" "}
                      <span className="font-black text-slate-900">{selectedZone.topProjectType}</span>.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-black text-slate-950">Action Insight</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {selectedZone.status === "excellent"
                        ? `${selectedZone.zone} is beating revenue target. Protect this zone with faster collection follow-up and premium inventory.`
                        : selectedZone.status === "good"
                          ? `${selectedZone.zone} is healthy. Push active deals into closure and improve collection rate.`
                          : selectedZone.status === "watch"
                            ? `${selectedZone.zone} needs collection discipline and better high-value deal sourcing.`
                            : `${selectedZone.zone} is underperforming. Audit source quality, reduce weak campaigns and rebuild partner inventory.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-base font-black text-slate-950">Zone Revenue Ranking</h3>
                <p className="mt-1 text-sm text-slate-500">Ranking by selected revenue metric.</p>
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
                  <h3 className="text-base font-black text-slate-950">Revenue Trend by Zone</h3>
                  <p className="mt-1 text-sm text-slate-500">Monthly revenue movement across major zones. Values shown in lakhs.</p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                      <Tooltip formatter={(value) => [`₹${value}L`, "Revenue"]} />
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
                <h3 className="text-base font-black text-slate-950">Revenue Source Split</h3>
                <p className="mt-1 text-sm text-slate-500">Overall revenue contribution by channel/source.</p>
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
                <h3 className="text-base font-black text-slate-950">Revenue by Zone Table</h3>
                <p className="mt-1 text-sm text-slate-500">Zone-wise booked revenue, collections, pending, commission and target achievement.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-black">Zone</th>
                      <th className="px-5 py-4 font-black">Revenue</th>
                      <th className="px-5 py-4 font-black">Collected</th>
                      <th className="px-5 py-4 font-black">Pending</th>
                      <th className="px-5 py-4 font-black">Deals</th>
                      <th className="px-5 py-4 font-black">Avg Deal</th>
                      <th className="px-5 py-4 font-black">Commission</th>
                      <th className="px-5 py-4 font-black">Target</th>
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
                        <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(item.totalRevenue)}</td>
                        <td className="px-5 py-4 font-bold text-emerald-700">{formatCurrency(item.collectedRevenue)}</td>
                        <td className="px-5 py-4 font-bold text-amber-700">{formatCurrency(item.pendingRevenue)}</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{formatNumber(item.dealsClosed)}</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(item.avgDealValue)}</td>
                        <td className="px-5 py-4 font-bold text-blue-700">{formatCurrency(item.commissionEarned)}</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{item.targetAchievement.toFixed(1)}%</td>
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

export default RevenueByZoneChart;
