import React, { useMemo, useState } from "react";

// =====================================================
// MEI CRM - AreaPerformanceTable.tsx
// Area-wise performance analytics table
// Vite + React + TypeScript + TailwindCSS
// -----------------------------------------------------
// Suggested path:
// src/components/analytics/charts/geo/AreaPerformanceTable.tsx
// =====================================================

export type AreaPerformanceStatus = "excellent" | "good" | "watch" | "weak";
export type AreaPerformancePeriod = "7d" | "30d" | "90d" | "12m";
export type AreaPerformanceSegment = "all" | "buyer" | "tenant" | "investor" | "nri";

export type AreaPerformanceSortKey =
  | "area"
  | "city"
  | "leads"
  | "qualifiedLeads"
  | "siteVisits"
  | "deals"
  | "conversionRate"
  | "revenue"
  | "avgDealValue"
  | "demandScore"
  | "targetAchievement"
  | "growthRate";

export type SortDirection = "asc" | "desc";

export type AreaPerformanceItem = {
  id: string;
  area: string;
  city: string;
  zone: string;
  leads: number;
  qualifiedLeads: number;
  hotLeads: number;
  siteVisits: number;
  deals: number;
  conversionRate: number;
  revenue: number;
  collectedRevenue: number;
  pendingRevenue: number;
  avgDealValue: number;
  demandScore: number;
  targetRevenue: number;
  targetAchievement: number;
  avgBudget: number;
  responseTimeMins: number;
  growthRate: number;
  topSource: string;
  topRequirement: string;
  status: AreaPerformanceStatus;
};

type AreaPerformanceTableProps = {
  title?: string;
  subtitle?: string;
  data?: AreaPerformanceItem[];
  defaultPeriod?: AreaPerformancePeriod;
  defaultSegment?: AreaPerformanceSegment;
  defaultSortKey?: AreaPerformanceSortKey;
  defaultSortDirection?: SortDirection;
  pageSize?: number;
  showControls?: boolean;
  showSummary?: boolean;
  showPagination?: boolean;
  onAreaClick?: (item: AreaPerformanceItem) => void;
  onExport?: (items: AreaPerformanceItem[]) => void;
};

const periodOptions: { label: string; value: AreaPerformancePeriod }[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last 12 Months", value: "12m" },
];

const segmentOptions: { label: string; value: AreaPerformanceSegment }[] = [
  { label: "All Segments", value: "all" },
  { label: "Buyer", value: "buyer" },
  { label: "Tenant", value: "tenant" },
  { label: "Investor", value: "investor" },
  { label: "NRI", value: "nri" },
];

const statusOptions: { label: string; value: AreaPerformanceStatus | "all" }[] = [
  { label: "All Status", value: "all" },
  { label: "Excellent", value: "excellent" },
  { label: "Good", value: "good" },
  { label: "Watch", value: "watch" },
  { label: "Weak", value: "weak" },
];

const defaultAreaPerformanceData: AreaPerformanceItem[] = [
  {
    id: "area-whitefield",
    area: "Whitefield",
    city: "Bengaluru",
    zone: "East Zone",
    leads: 842,
    qualifiedLeads: 386,
    hotLeads: 142,
    siteVisits: 124,
    deals: 38,
    conversionRate: 4.51,
    revenue: 68400000,
    collectedRevenue: 52600000,
    pendingRevenue: 15800000,
    avgDealValue: 1800000,
    demandScore: 94,
    targetRevenue: 62000000,
    targetAchievement: 110.32,
    avgBudget: 9200000,
    responseTimeMins: 16,
    growthRate: 18.4,
    topSource: "Meta Ads",
    topRequirement: "2 & 3 BHK Apartments",
    status: "excellent",
  },
  {
    id: "area-sarjapur",
    area: "Sarjapur Road",
    city: "Bengaluru",
    zone: "South-East Zone",
    leads: 786,
    qualifiedLeads: 344,
    hotLeads: 126,
    siteVisits: 118,
    deals: 32,
    conversionRate: 4.07,
    revenue: 57600000,
    collectedRevenue: 42800000,
    pendingRevenue: 14800000,
    avgDealValue: 1800000,
    demandScore: 91,
    targetRevenue: 54000000,
    targetAchievement: 106.67,
    avgBudget: 8800000,
    responseTimeMins: 19,
    growthRate: 15.2,
    topSource: "Google Ads",
    topRequirement: "Gated Community Flats",
    status: "excellent",
  },
  {
    id: "area-hsr",
    area: "HSR Layout",
    city: "Bengaluru",
    zone: "South Zone",
    leads: 654,
    qualifiedLeads: 312,
    hotLeads: 108,
    siteVisits: 102,
    deals: 29,
    conversionRate: 4.43,
    revenue: 52200000,
    collectedRevenue: 40200000,
    pendingRevenue: 12000000,
    avgDealValue: 1800000,
    demandScore: 88,
    targetRevenue: 50000000,
    targetAchievement: 104.4,
    avgBudget: 11200000,
    responseTimeMins: 21,
    growthRate: 10.6,
    topSource: "Referral",
    topRequirement: "Ready-to-move Homes",
    status: "excellent",
  },
  {
    id: "area-hebbal",
    area: "Hebbal",
    city: "Bengaluru",
    zone: "North Zone",
    leads: 596,
    qualifiedLeads: 268,
    hotLeads: 92,
    siteVisits: 88,
    deals: 21,
    conversionRate: 3.52,
    revenue: 44100000,
    collectedRevenue: 31800000,
    pendingRevenue: 12300000,
    avgDealValue: 2100000,
    demandScore: 83,
    targetRevenue: 48000000,
    targetAchievement: 91.88,
    avgBudget: 10400000,
    responseTimeMins: 24,
    growthRate: 12.1,
    topSource: "Organic",
    topRequirement: "Premium Apartments",
    status: "good",
  },
  {
    id: "area-electronic-city",
    area: "Electronic City",
    city: "Bengaluru",
    zone: "South Zone",
    leads: 548,
    qualifiedLeads: 226,
    hotLeads: 78,
    siteVisits: 72,
    deals: 18,
    conversionRate: 3.28,
    revenue: 27000000,
    collectedRevenue: 20400000,
    pendingRevenue: 6600000,
    avgDealValue: 1500000,
    demandScore: 79,
    targetRevenue: 30000000,
    targetAchievement: 90,
    avgBudget: 6200000,
    responseTimeMins: 27,
    growthRate: 8.7,
    topSource: "Meta Ads",
    topRequirement: "Affordable 2 BHK",
    status: "good",
  },
  {
    id: "area-indiranagar",
    area: "Indiranagar",
    city: "Bengaluru",
    zone: "Central Zone",
    leads: 422,
    qualifiedLeads: 184,
    hotLeads: 58,
    siteVisits: 56,
    deals: 13,
    conversionRate: 3.08,
    revenue: 39000000,
    collectedRevenue: 27200000,
    pendingRevenue: 11800000,
    avgDealValue: 3000000,
    demandScore: 74,
    targetRevenue: 46000000,
    targetAchievement: 84.78,
    avgBudget: 16800000,
    responseTimeMins: 31,
    growthRate: 2.8,
    topSource: "Direct",
    topRequirement: "Luxury Resale Homes",
    status: "watch",
  },
  {
    id: "area-yelahanka",
    area: "Yelahanka",
    city: "Bengaluru",
    zone: "North Zone",
    leads: 386,
    qualifiedLeads: 152,
    hotLeads: 46,
    siteVisits: 46,
    deals: 10,
    conversionRate: 2.59,
    revenue: 18000000,
    collectedRevenue: 12600000,
    pendingRevenue: 5400000,
    avgDealValue: 1800000,
    demandScore: 69,
    targetRevenue: 25000000,
    targetAchievement: 72,
    avgBudget: 7600000,
    responseTimeMins: 34,
    growthRate: 4.6,
    topSource: "Google Ads",
    topRequirement: "Villa Plots",
    status: "watch",
  },
  {
    id: "area-marathahalli",
    area: "Marathahalli",
    city: "Bengaluru",
    zone: "East Zone",
    leads: 348,
    qualifiedLeads: 132,
    hotLeads: 38,
    siteVisits: 42,
    deals: 8,
    conversionRate: 2.3,
    revenue: 12800000,
    collectedRevenue: 9400000,
    pendingRevenue: 3400000,
    avgDealValue: 1600000,
    demandScore: 65,
    targetRevenue: 22000000,
    targetAchievement: 58.18,
    avgBudget: 7200000,
    responseTimeMins: 39,
    growthRate: -2.9,
    topSource: "Rental Campaign",
    topRequirement: "Rental Homes",
    status: "watch",
  },
  {
    id: "area-jp-nagar",
    area: "JP Nagar",
    city: "Bengaluru",
    zone: "South Zone",
    leads: 284,
    qualifiedLeads: 98,
    hotLeads: 28,
    siteVisits: 28,
    deals: 5,
    conversionRate: 1.76,
    revenue: 10500000,
    collectedRevenue: 7200000,
    pendingRevenue: 3300000,
    avgDealValue: 2100000,
    demandScore: 58,
    targetRevenue: 24000000,
    targetAchievement: 43.75,
    avgBudget: 9800000,
    responseTimeMins: 46,
    growthRate: -5.4,
    topSource: "Local Campaign",
    topRequirement: "Family Apartments",
    status: "weak",
  },
  {
    id: "area-banashankari",
    area: "Banashankari",
    city: "Bengaluru",
    zone: "South Zone",
    leads: 246,
    qualifiedLeads: 82,
    hotLeads: 22,
    siteVisits: 22,
    deals: 4,
    conversionRate: 1.63,
    revenue: 7200000,
    collectedRevenue: 4800000,
    pendingRevenue: 2400000,
    avgDealValue: 1800000,
    demandScore: 52,
    targetRevenue: 20000000,
    targetAchievement: 36,
    avgBudget: 8400000,
    responseTimeMins: 52,
    growthRate: -7.8,
    topSource: "Offline",
    topRequirement: "Budget Homes",
    status: "weak",
  },
];

const statusStyles: Record<AreaPerformanceStatus, string> = {
  excellent: "bg-emerald-50 text-emerald-700 border-emerald-200",
  good: "bg-blue-50 text-blue-700 border-blue-200",
  watch: "bg-amber-50 text-amber-700 border-amber-200",
  weak: "bg-rose-50 text-rose-700 border-rose-200",
};

const sortLabels: Record<AreaPerformanceSortKey, string> = {
  area: "Area",
  city: "City",
  leads: "Leads",
  qualifiedLeads: "Qualified",
  siteVisits: "Visits",
  deals: "Deals",
  conversionRate: "Conversion",
  revenue: "Revenue",
  avgDealValue: "Avg Deal",
  demandScore: "Demand",
  targetAchievement: "Target",
  growthRate: "Growth",
};

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

function getSortValue(item: AreaPerformanceItem, key: AreaPerformanceSortKey): string | number {
  return item[key];
}

function compareValues(a: string | number, b: string | number, direction: SortDirection): number {
  if (typeof a === "string" && typeof b === "string") {
    return direction === "asc" ? a.localeCompare(b) : b.localeCompare(a);
  }

  const numA = Number(a);
  const numB = Number(b);

  return direction === "asc" ? numA - numB : numB - numA;
}

function downloadCsv(filename: string, rows: AreaPerformanceItem[]): void {
  const headers = [
    "Area",
    "City",
    "Zone",
    "Leads",
    "Qualified Leads",
    "Hot Leads",
    "Site Visits",
    "Deals",
    "Conversion Rate",
    "Revenue",
    "Collected Revenue",
    "Pending Revenue",
    "Avg Deal Value",
    "Demand Score",
    "Target Achievement",
    "Avg Budget",
    "Response Time Mins",
    "Growth Rate",
    "Top Source",
    "Top Requirement",
    "Status",
  ];

  const csvRows = rows.map((item) => [
    item.area,
    item.city,
    item.zone,
    item.leads,
    item.qualifiedLeads,
    item.hotLeads,
    item.siteVisits,
    item.deals,
    item.conversionRate,
    item.revenue,
    item.collectedRevenue,
    item.pendingRevenue,
    item.avgDealValue,
    item.demandScore,
    item.targetAchievement,
    item.avgBudget,
    item.responseTimeMins,
    item.growthRate,
    item.topSource,
    item.topRequirement,
    item.status,
  ]);

  const escapeCell = (cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`;
  const csvContent = [headers, ...csvRows].map((row) => row.map(escapeCell).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

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
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl">📍</div>
      <h3 className="text-lg font-black text-slate-950">No area performance data found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Try changing filters or add lead, deal, revenue and area attribution data.
      </p>
    </div>
  );
};

const AreaPerformanceTable: React.FC<AreaPerformanceTableProps> = ({
  title = "Area Performance Table",
  subtitle = "Compare area-wise leads, conversion, revenue, demand, target achievement and response speed.",
  data = defaultAreaPerformanceData,
  defaultPeriod = "30d",
  defaultSegment = "all",
  defaultSortKey = "revenue",
  defaultSortDirection = "desc",
  pageSize = 8,
  showControls = true,
  showSummary = true,
  showPagination = true,
  onAreaClick,
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState<AreaPerformancePeriod>(defaultPeriod);
  const [segment, setSegment] = useState<AreaPerformanceSegment>(defaultSegment);
  const [status, setStatus] = useState<AreaPerformanceStatus | "all">("all");
  const [sortKey, setSortKey] = useState<AreaPerformanceSortKey>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    const cleanSearch = searchTerm.trim().toLowerCase();

    return data
      .filter((item) => {
        const matchesSearch =
          !cleanSearch ||
          item.area.toLowerCase().includes(cleanSearch) ||
          item.city.toLowerCase().includes(cleanSearch) ||
          item.zone.toLowerCase().includes(cleanSearch) ||
          item.topSource.toLowerCase().includes(cleanSearch) ||
          item.topRequirement.toLowerCase().includes(cleanSearch);

        const matchesStatus = status === "all" || item.status === status;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => compareValues(getSortValue(a, sortKey), getSortValue(b, sortKey), sortDirection));
  }, [data, searchTerm, status, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    if (!showPagination) return filteredData;

    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, pageSize, safeCurrentPage, showPagination]);

  const summary = useMemo(() => {
    const leads = filteredData.reduce((sum, item) => sum + item.leads, 0);
    const qualifiedLeads = filteredData.reduce((sum, item) => sum + item.qualifiedLeads, 0);
    const deals = filteredData.reduce((sum, item) => sum + item.deals, 0);
    const revenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
    const collectedRevenue = filteredData.reduce((sum, item) => sum + item.collectedRevenue, 0);
    const avgDemandScore = filteredData.length ? filteredData.reduce((sum, item) => sum + item.demandScore, 0) / filteredData.length : 0;
    const avgConversionRate = leads > 0 ? (deals / leads) * 100 : 0;
    const collectionRate = revenue > 0 ? (collectedRevenue / revenue) * 100 : 0;

    return {
      leads,
      qualifiedLeads,
      deals,
      revenue,
      collectedRevenue,
      avgDemandScore,
      avgConversionRate,
      collectionRate,
    };
  }, [filteredData]);

  const handleSort = (key: AreaPerformanceSortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("desc");
  };

  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (onExport) {
      onExport(filteredData);
      return;
    }

    downloadCsv("area-performance-table.csv", filteredData);
  };

  const SortButton: React.FC<{ columnKey: AreaPerformanceSortKey; children: React.ReactNode }> = ({ columnKey, children }) => {
    const isActive = sortKey === columnKey;

    return (
      <button
        type="button"
        onClick={() => handleSort(columnKey)}
        className={classNames(
          "inline-flex items-center gap-1 font-black transition hover:text-slate-950",
          isActive ? "text-slate-950" : "text-slate-500",
        )}
      >
        {children}
        <span className="text-[10px]">{isActive ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}</span>
      </button>
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm md:p-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
              Geo Performance Intelligence
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-950 md:text-2xl">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>

          {showControls && (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap 2xl:justify-end">
              <input
                value={searchTerm}
                onChange={(event) => handleFilterChange(() => setSearchTerm(event.target.value))}
                placeholder="Search area, zone, source..."
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />

              <select
                value={segment}
                onChange={(event) => handleFilterChange(() => setSegment(event.target.value as AreaPerformanceSegment))}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                {segmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={period}
                onChange={(event) => handleFilterChange(() => setPeriod(event.target.value as AreaPerformancePeriod))}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={status}
                onChange={(event) => handleFilterChange(() => setStatus(event.target.value as AreaPerformanceStatus | "all"))}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleExport}
                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
              >
                Export CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {showSummary && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <SummaryCard label="Areas" value={formatNumber(filteredData.length)} helper="Filtered locations" />
          <SummaryCard label="Leads" value={formatNumber(summary.leads)} helper={`${formatNumber(summary.qualifiedLeads)} qualified`} />
          <SummaryCard label="Deals" value={formatNumber(summary.deals)} helper={`${summary.avgConversionRate.toFixed(2)}% conversion`} />
          <SummaryCard label="Revenue" value={formatCurrency(summary.revenue)} helper="Total booked" />
          <SummaryCard label="Collected" value={formatCurrency(summary.collectedRevenue)} helper={`${summary.collectionRate.toFixed(1)}% collected`} />
          <SummaryCard label="Demand" value={`${summary.avgDemandScore.toFixed(1)}/100`} helper="Average score" />
        </div>
      )}

      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-black text-slate-950">Area Performance Records</h3>
            <p className="mt-1 text-sm text-slate-500">
              Showing {formatNumber(paginatedData.length)} of {formatNumber(filteredData.length)} records · {periodOptions.find((item) => item.value === period)?.label} · {segmentOptions.find((item) => item.value === segment)?.label}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black text-slate-600">
            Sorted by {sortLabels[sortKey]} {sortDirection === "asc" ? "ascending" : "descending"}
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="p-5">
            <EmptyState />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1400px] divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4"><SortButton columnKey="area">Area</SortButton></th>
                  <th className="px-5 py-4"><SortButton columnKey="city">City</SortButton></th>
                  <th className="px-5 py-4"><SortButton columnKey="leads">Leads</SortButton></th>
                  <th className="px-5 py-4"><SortButton columnKey="qualifiedLeads">Qualified</SortButton></th>
                  <th className="px-5 py-4">Hot</th>
                  <th className="px-5 py-4"><SortButton columnKey="siteVisits">Visits</SortButton></th>
                  <th className="px-5 py-4"><SortButton columnKey="deals">Deals</SortButton></th>
                  <th className="px-5 py-4"><SortButton columnKey="conversionRate">Conv.</SortButton></th>
                  <th className="px-5 py-4"><SortButton columnKey="revenue">Revenue</SortButton></th>
                  <th className="px-5 py-4">Collected</th>
                  <th className="px-5 py-4">Pending</th>
                  <th className="px-5 py-4"><SortButton columnKey="avgDealValue">Avg Deal</SortButton></th>
                  <th className="px-5 py-4"><SortButton columnKey="demandScore">Demand</SortButton></th>
                  <th className="px-5 py-4"><SortButton columnKey="targetAchievement">Target</SortButton></th>
                  <th className="px-5 py-4"><SortButton columnKey="growthRate">Growth</SortButton></th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedData.map((item) => (
                  <tr key={item.id} onClick={() => onAreaClick?.(item)} className="cursor-pointer transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-black text-slate-950">{item.area}</div>
                      <div className="mt-1 text-xs font-semibold text-slate-500">{item.zone}</div>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-700">{item.city}</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{formatNumber(item.leads)}</td>
                    <td className="px-5 py-4 font-bold text-blue-700">{formatNumber(item.qualifiedLeads)}</td>
                    <td className="px-5 py-4 font-bold text-rose-700">{formatNumber(item.hotLeads)}</td>
                    <td className="px-5 py-4 font-bold text-emerald-700">{formatNumber(item.siteVisits)}</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{formatNumber(item.deals)}</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{item.conversionRate.toFixed(2)}%</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(item.revenue)}</td>
                    <td className="px-5 py-4 font-bold text-emerald-700">{formatCurrency(item.collectedRevenue)}</td>
                    <td className="px-5 py-4 font-bold text-amber-700">{formatCurrency(item.pendingRevenue)}</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(item.avgDealValue)}</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{item.demandScore}/100</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{item.targetAchievement.toFixed(1)}%</td>
                    <td className="px-5 py-4">
                      <span className={classNames("rounded-full px-3 py-1 text-xs font-black", item.growthRate >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
                        {item.growthRate >= 0 ? "+" : ""}{item.growthRate.toFixed(1)}%
                      </span>
                    </td>
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
        )}

        {showPagination && filteredData.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-slate-500">
              Page {safeCurrentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaPerformanceTable;
