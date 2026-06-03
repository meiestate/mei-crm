import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// =====================================================
// MEI CRM - DemandHotspotsChart.tsx
// Real-estate demand hotspot analytics component
// Vite + React + TypeScript + TailwindCSS + Recharts
// =====================================================

export type DemandMetric = "demandScore" | "enquiries" | "siteVisits" | "budgetFit" | "inventoryGap";
export type DemandPeriod = "7d" | "30d" | "90d" | "12m";
export type DemandSegment = "all" | "buyers" | "tenants" | "investors" | "nri";

export type DemandHotspotItem = {
  id: string;
  area: string;
  city: string;
  microMarket: string;
  demandScore: number;
  enquiries: number;
  qualifiedLeads: number;
  siteVisits: number;
  bookings: number;
  budgetFit: number;
  inventoryGap: number;
  avgBudget: number;
  avgPricePerSqft: number;
  trend: number;
  topRequirement: string;
  status: "hot" | "warm" | "watch" | "cold";
};

export type DemandTrendPoint = {
  name: string;
  demandScore: number;
  enquiries: number;
  siteVisits: number;
};

type MetricConfig = {
  label: string;
  helper: string;
  suffix?: string;
};

type DemandHotspotsChartProps = {
  title?: string;
  subtitle?: string;
  data?: DemandHotspotItem[];
  trendData?: DemandTrendPoint[];
  defaultMetric?: DemandMetric;
  defaultPeriod?: DemandPeriod;
  defaultSegment?: DemandSegment;
  showControls?: boolean;
  showSummary?: boolean;
  showTrend?: boolean;
  showTable?: boolean;
  onHotspotClick?: (item: DemandHotspotItem) => void;
};

const COLORS = ["#111827", "#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"];

const metricConfig: Record<DemandMetric, MetricConfig> = {
  demandScore: {
    label: "Demand Score",
    helper: "Composite score from enquiries, visits, budget fit and booking velocity",
    suffix: "/100",
  },
  enquiries: {
    label: "Enquiries",
    helper: "Total buyer or tenant enquiries from the area",
  },
  siteVisits: {
    label: "Site Visits",
    helper: "Completed site visits from the area",
  },
  budgetFit: {
    label: "Budget Fit",
    helper: "Percentage of leads matching available property budget range",
    suffix: "%",
  },
  inventoryGap: {
    label: "Inventory Gap",
    helper: "Demand minus matching inventory; higher means more supply opportunity",
    suffix: "%",
  },
};

const metricOptions: { label: string; value: DemandMetric }[] = [
  { label: "Demand Score", value: "demandScore" },
  { label: "Enquiries", value: "enquiries" },
  { label: "Site Visits", value: "siteVisits" },
  { label: "Budget Fit", value: "budgetFit" },
  { label: "Inventory Gap", value: "inventoryGap" },
];

const periodOptions: { label: string; value: DemandPeriod }[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last 12 Months", value: "12m" },
];

const segmentOptions: { label: string; value: DemandSegment }[] = [
  { label: "All Demand", value: "all" },
  { label: "Buyers", value: "buyers" },
  { label: "Tenants", value: "tenants" },
  { label: "Investors", value: "investors" },
  { label: "NRI Leads", value: "nri" },
];

const defaultHotspots: DemandHotspotItem[] = [
  {
    id: "hotspot-001",
    area: "Whitefield",
    city: "Bengaluru",
    microMarket: "East Bengaluru",
    demandScore: 94,
    enquiries: 842,
    qualifiedLeads: 386,
    siteVisits: 124,
    bookings: 38,
    budgetFit: 82,
    inventoryGap: 41,
    avgBudget: 9200000,
    avgPricePerSqft: 9600,
    trend: 14.8,
    topRequirement: "2 & 3 BHK apartments",
    status: "hot",
  },
  {
    id: "hotspot-002",
    area: "Sarjapur Road",
    city: "Bengaluru",
    microMarket: "South-East Bengaluru",
    demandScore: 91,
    enquiries: 786,
    qualifiedLeads: 344,
    siteVisits: 118,
    bookings: 32,
    budgetFit: 79,
    inventoryGap: 38,
    avgBudget: 8800000,
    avgPricePerSqft: 9200,
    trend: 12.6,
    topRequirement: "Gated community flats",
    status: "hot",
  },
  {
    id: "hotspot-003",
    area: "HSR Layout",
    city: "Bengaluru",
    microMarket: "South Bengaluru",
    demandScore: 88,
    enquiries: 654,
    qualifiedLeads: 312,
    siteVisits: 102,
    bookings: 29,
    budgetFit: 76,
    inventoryGap: 32,
    avgBudget: 11200000,
    avgPricePerSqft: 11800,
    trend: 9.4,
    topRequirement: "Ready-to-move homes",
    status: "hot",
  },
  {
    id: "hotspot-004",
    area: "Hebbal",
    city: "Bengaluru",
    microMarket: "North Bengaluru",
    demandScore: 83,
    enquiries: 596,
    qualifiedLeads: 268,
    siteVisits: 88,
    bookings: 21,
    budgetFit: 71,
    inventoryGap: 35,
    avgBudget: 10400000,
    avgPricePerSqft: 10500,
    trend: 11.1,
    topRequirement: "Premium apartments",
    status: "warm",
  },
  {
    id: "hotspot-005",
    area: "Electronic City",
    city: "Bengaluru",
    microMarket: "South Bengaluru",
    demandScore: 79,
    enquiries: 548,
    qualifiedLeads: 226,
    siteVisits: 72,
    bookings: 18,
    budgetFit: 84,
    inventoryGap: 22,
    avgBudget: 6200000,
    avgPricePerSqft: 6800,
    trend: 6.7,
    topRequirement: "Affordable 2 BHK",
    status: "warm",
  },
  {
    id: "hotspot-006",
    area: "Indiranagar",
    city: "Bengaluru",
    microMarket: "Central-East Bengaluru",
    demandScore: 74,
    enquiries: 422,
    qualifiedLeads: 184,
    siteVisits: 56,
    bookings: 13,
    budgetFit: 61,
    inventoryGap: 47,
    avgBudget: 16800000,
    avgPricePerSqft: 16200,
    trend: 2.8,
    topRequirement: "Luxury resale homes",
    status: "watch",
  },
  {
    id: "hotspot-007",
    area: "Yelahanka",
    city: "Bengaluru",
    microMarket: "North Bengaluru",
    demandScore: 69,
    enquiries: 386,
    qualifiedLeads: 152,
    siteVisits: 46,
    bookings: 10,
    budgetFit: 73,
    inventoryGap: 18,
    avgBudget: 7600000,
    avgPricePerSqft: 7400,
    trend: 5.2,
    topRequirement: "Villa plots and apartments",
    status: "watch",
  },
  {
    id: "hotspot-008",
    area: "Marathahalli",
    city: "Bengaluru",
    microMarket: "East Bengaluru",
    demandScore: 65,
    enquiries: 348,
    qualifiedLeads: 132,
    siteVisits: 42,
    bookings: 8,
    budgetFit: 68,
    inventoryGap: 16,
    avgBudget: 7200000,
    avgPricePerSqft: 7900,
    trend: -2.4,
    topRequirement: "Rental homes",
    status: "watch",
  },
  {
    id: "hotspot-009",
    area: "JP Nagar",
    city: "Bengaluru",
    microMarket: "South Bengaluru",
    demandScore: 58,
    enquiries: 284,
    qualifiedLeads: 98,
    siteVisits: 28,
    bookings: 5,
    budgetFit: 54,
    inventoryGap: 12,
    avgBudget: 9800000,
    avgPricePerSqft: 9800,
    trend: -4.1,
    topRequirement: "Family apartments",
    status: "cold",
  },
  {
    id: "hotspot-010",
    area: "Banashankari",
    city: "Bengaluru",
    microMarket: "South Bengaluru",
    demandScore: 52,
    enquiries: 246,
    qualifiedLeads: 82,
    siteVisits: 22,
    bookings: 4,
    budgetFit: 49,
    inventoryGap: 9,
    avgBudget: 8400000,
    avgPricePerSqft: 8600,
    trend: -5.8,
    topRequirement: "Budget homes",
    status: "cold",
  },
];

const defaultTrendData: DemandTrendPoint[] = [
  { name: "Jan", demandScore: 68, enquiries: 1420, siteVisits: 214 },
  { name: "Feb", demandScore: 71, enquiries: 1584, siteVisits: 246 },
  { name: "Mar", demandScore: 74, enquiries: 1736, siteVisits: 278 },
  { name: "Apr", demandScore: 79, enquiries: 1962, siteVisits: 324 },
  { name: "May", demandScore: 82, enquiries: 2188, siteVisits: 362 },
  { name: "Jun", demandScore: 86, enquiries: 2414, siteVisits: 412 },
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

function getMetricValue(item: DemandHotspotItem, metric: DemandMetric): number {
  return item[metric];
}

function formatMetricValue(value: number, metric: DemandMetric): string {
  if (metric === "demandScore") return `${value}/100`;
  if (metric === "budgetFit" || metric === "inventoryGap") return `${value}%`;
  return formatNumber(value);
}

function getDemandIntensity(value: number, min: number, max: number): string {
  if (max === min) return "bg-slate-100 text-slate-800 border-slate-200";

  const ratio = (value - min) / (max - min);

  if (ratio >= 0.85) return "bg-rose-600 text-white border-rose-700";
  if (ratio >= 0.68) return "bg-orange-500 text-white border-orange-600";
  if (ratio >= 0.5) return "bg-amber-300 text-amber-950 border-amber-400";
  if (ratio >= 0.32) return "bg-blue-200 text-blue-950 border-blue-300";
  if (ratio >= 0.15) return "bg-slate-200 text-slate-900 border-slate-300";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

const statusStyles: Record<DemandHotspotItem["status"], string> = {
  hot: "bg-rose-50 text-rose-700 border-rose-200",
  warm: "bg-amber-50 text-amber-700 border-amber-200",
  watch: "bg-blue-50 text-blue-700 border-blue-200",
  cold: "bg-slate-50 text-slate-600 border-slate-200",
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
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl">🔥</div>
      <h3 className="text-lg font-black text-slate-950">No demand hotspot data found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Add enquiry area, budget, visit and booking data to unlock demand hotspot intelligence.
      </p>
    </div>
  );
};

const DemandHotspotsChart: React.FC<DemandHotspotsChartProps> = ({
  title = "Demand Hotspots",
  subtitle = "Identify high-demand micro-markets using enquiries, site visits, booking velocity, budget fit and inventory gap.",
  data = defaultHotspots,
  trendData = defaultTrendData,
  defaultMetric = "demandScore",
  defaultPeriod = "30d",
  defaultSegment = "all",
  showControls = true,
  showSummary = true,
  showTrend = true,
  showTable = true,
  onHotspotClick,
}) => {
  const [metric, setMetric] = useState<DemandMetric>(defaultMetric);
  const [period, setPeriod] = useState<DemandPeriod>(defaultPeriod);
  const [segment, setSegment] = useState<DemandSegment>(defaultSegment);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    const cleanSearch = searchTerm.trim().toLowerCase();

    return data
      .filter((item) => {
        if (!cleanSearch) return true;

        return (
          item.area.toLowerCase().includes(cleanSearch) ||
          item.city.toLowerCase().includes(cleanSearch) ||
          item.microMarket.toLowerCase().includes(cleanSearch) ||
          item.topRequirement.toLowerCase().includes(cleanSearch)
        );
      })
      .sort((a, b) => getMetricValue(b, metric) - getMetricValue(a, metric));
  }, [data, metric, searchTerm]);

  const metricValues = useMemo(() => filteredData.map((item) => getMetricValue(item, metric)), [filteredData, metric]);
  const minValue = metricValues.length ? Math.min(...metricValues) : 0;
  const maxValue = metricValues.length ? Math.max(...metricValues) : 0;

  const summary = useMemo(() => {
    const totalEnquiries = filteredData.reduce((sum, item) => sum + item.enquiries, 0);
    const totalSiteVisits = filteredData.reduce((sum, item) => sum + item.siteVisits, 0);
    const totalBookings = filteredData.reduce((sum, item) => sum + item.bookings, 0);
    const avgDemandScore = filteredData.length
      ? filteredData.reduce((sum, item) => sum + item.demandScore, 0) / filteredData.length
      : 0;
    const avgBudget = filteredData.length ? filteredData.reduce((sum, item) => sum + item.avgBudget, 0) / filteredData.length : 0;
    const hotAreas = filteredData.filter((item) => item.status === "hot").length;

    return {
      totalEnquiries,
      totalSiteVisits,
      totalBookings,
      avgDemandScore,
      avgBudget,
      hotAreas,
    };
  }, [filteredData]);

  const selectedHotspot = useMemo(() => {
    return filteredData.find((item) => item.id === selectedId) ?? filteredData[0] ?? null;
  }, [filteredData, selectedId]);

  const topBarData = useMemo(() => {
    return filteredData.slice(0, 8).map((item) => ({
      area: item.area,
      value: getMetricValue(item, metric),
      status: item.status,
    }));
  }, [filteredData, metric]);

  const handleHotspotClick = (item: DemandHotspotItem) => {
    setSelectedId(item.id);
    onHotspotClick?.(item);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm md:p-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-black text-rose-700">
              Market Demand Intelligence
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-950 md:text-2xl">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>

          {showControls && (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap 2xl:justify-end">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search area, market, requirement..."
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />

              <select
                value={segment}
                onChange={(event) => setSegment(event.target.value as DemandSegment)}
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
                onChange={(event) => setMetric(event.target.value as DemandMetric)}
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
                onChange={(event) => setPeriod(event.target.value as DemandPeriod)}
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
              <SummaryCard label="Demand Score" value={`${summary.avgDemandScore.toFixed(1)}/100`} helper="Average score" />
              <SummaryCard label="Enquiries" value={formatNumber(summary.totalEnquiries)} helper="Total demand volume" />
              <SummaryCard label="Site Visits" value={formatNumber(summary.totalSiteVisits)} helper="Completed visits" />
              <SummaryCard label="Bookings" value={formatNumber(summary.totalBookings)} helper="Hotspot bookings" />
              <SummaryCard label="Avg Budget" value={formatCurrency(summary.avgBudget)} helper="Lead budget average" />
              <SummaryCard label="Hot Areas" value={formatNumber(summary.hotAreas)} helper="High demand zones" />
            </div>
          )}

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-950">Hotspot Map by {metricConfig[metric].label}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {metricConfig[metric].helper} · {periodOptions.find((item) => item.value === period)?.label} · {segmentOptions.find((item) => item.value === segment)?.label}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                  <span>Low</span>
                  <div className="h-3 w-10 rounded-full bg-slate-100" />
                  <div className="h-3 w-10 rounded-full bg-blue-200" />
                  <div className="h-3 w-10 rounded-full bg-amber-300" />
                  <div className="h-3 w-10 rounded-full bg-rose-600" />
                  <span>Hot</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredData.map((item) => {
                  const value = getMetricValue(item, metric);
                  const isSelected = selectedHotspot?.id === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleHotspotClick(item)}
                      className={classNames(
                        "rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-100",
                        getDemandIntensity(value, minValue, maxValue),
                        isSelected && "ring-4 ring-slate-200",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black">{item.area}</p>
                          <p className="mt-1 text-xs font-bold opacity-80">{item.microMarket}</p>
                        </div>
                        <span className="rounded-full bg-white/25 px-2 py-1 text-xs font-black capitalize">{item.status}</span>
                      </div>

                      <div className="mt-5">
                        <p className="text-2xl font-black tracking-tight">{formatMetricValue(value, metric)}</p>
                        <p className="mt-1 text-xs font-bold opacity-80">
                          {formatNumber(item.enquiries)} enquiries · {formatNumber(item.siteVisits)} visits
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-base font-black text-slate-950">Selected Hotspot</h3>
                <p className="mt-1 text-sm text-slate-500">Demand, budget and inventory opportunity.</p>
              </div>

              {selectedHotspot && (
                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-950 p-5 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xl font-black">{selectedHotspot.area}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-300">{selectedHotspot.microMarket}</p>
                      </div>
                      <span className={classNames("rounded-full px-3 py-1 text-xs font-black", selectedHotspot.trend >= 0 ? "bg-emerald-400 text-emerald-950" : "bg-rose-300 text-rose-950")}>
                        {selectedHotspot.trend >= 0 ? "↗" : "↘"} {selectedHotspot.trend.toFixed(1)}%
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/10 p-3">
                        <p className="text-xs font-bold text-slate-300">Demand Score</p>
                        <p className="mt-1 text-lg font-black">{selectedHotspot.demandScore}/100</p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-3">
                        <p className="text-xs font-bold text-slate-300">Avg Budget</p>
                        <p className="mt-1 text-lg font-black">{formatCurrency(selectedHotspot.avgBudget)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <SummaryCard label="Enquiries" value={formatNumber(selectedHotspot.enquiries)} helper="Demand volume" />
                    <SummaryCard label="Qualified" value={formatNumber(selectedHotspot.qualifiedLeads)} helper="Sales-ready" />
                    <SummaryCard label="Visits" value={formatNumber(selectedHotspot.siteVisits)} helper="Site visits" />
                    <SummaryCard label="Bookings" value={formatNumber(selectedHotspot.bookings)} helper="Closed bookings" />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-black text-slate-950">Top Requirement</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{selectedHotspot.topRequirement}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-black text-slate-950">Action Insight</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {selectedHotspot.status === "hot"
                        ? `${selectedHotspot.area} is a high-demand zone. Increase inventory sourcing, builder tie-ups and retargeting budget here.`
                        : selectedHotspot.inventoryGap >= 30
                          ? `${selectedHotspot.area} has a supply gap. Source matching properties before competitors capture the demand.`
                          : `${selectedHotspot.area} needs better qualification and stronger offer positioning before increasing ad spend.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-base font-black text-slate-950">Top Hotspots Ranking</h3>
                <p className="mt-1 text-sm text-slate-500">Top 8 areas by selected demand metric.</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topBarData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="area" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <Tooltip formatter={(value) => [formatMetricValue(Number(value), metric), metricConfig[metric].label]} />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                      {topBarData.map((entry, index) => (
                        <Cell key={`${entry.area}-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {showTrend && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <h3 className="text-base font-black text-slate-950">Demand Trend</h3>
                  <p className="mt-1 text-sm text-slate-500">Demand score, enquiry and site visit movement.</p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="demandScore" name="Demand Score" stroke="#111827" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="siteVisits" name="Site Visits" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {showTable && (
            <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <h3 className="text-base font-black text-slate-950">Demand Hotspots Table</h3>
                <p className="mt-1 text-sm text-slate-500">Area-wise demand score, enquiry, visit, booking and inventory opportunity.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-black">Area</th>
                      <th className="px-5 py-4 font-black">Demand</th>
                      <th className="px-5 py-4 font-black">Enquiries</th>
                      <th className="px-5 py-4 font-black">Qualified</th>
                      <th className="px-5 py-4 font-black">Visits</th>
                      <th className="px-5 py-4 font-black">Bookings</th>
                      <th className="px-5 py-4 font-black">Budget Fit</th>
                      <th className="px-5 py-4 font-black">Inventory Gap</th>
                      <th className="px-5 py-4 font-black">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredData.map((item) => (
                      <tr key={item.id} onClick={() => handleHotspotClick(item)} className="cursor-pointer transition hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <div className="font-black text-slate-950">{item.area}</div>
                          <div className="mt-1 text-xs font-semibold text-slate-500">{item.microMarket}</div>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-700">{item.demandScore}/100</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{formatNumber(item.enquiries)}</td>
                        <td className="px-5 py-4 font-bold text-blue-700">{formatNumber(item.qualifiedLeads)}</td>
                        <td className="px-5 py-4 font-bold text-emerald-700">{formatNumber(item.siteVisits)}</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{formatNumber(item.bookings)}</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{item.budgetFit}%</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{item.inventoryGap}%</td>
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

export default DemandHotspotsChart;
