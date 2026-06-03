import React, { useMemo, useState } from "react";

// =====================================================
// MEI CRM - AreaConversionHeatmap.tsx
// Area-wise Lead → Deal conversion heatmap component
// Vite + React + TypeScript + TailwindCSS
// No external chart library required
// =====================================================

export type HeatmapMetric = "conversionRate" | "leads" | "deals" | "revenue";
export type HeatmapPeriod = "7d" | "30d" | "90d" | "12m";

export type AreaConversionItem = {
  id: string;
  area: string;
  city: string;
  leads: number;
  qualifiedLeads: number;
  deals: number;
  revenue: number;
  conversionRate: number;
  avgDealValue: number;
  trend: number;
};

type MetricConfig = {
  label: string;
  helper: string;
  suffix?: string;
  prefix?: string;
};

type AreaConversionHeatmapProps = {
  title?: string;
  subtitle?: string;
  data?: AreaConversionItem[];
  defaultMetric?: HeatmapMetric;
  defaultPeriod?: HeatmapPeriod;
  showControls?: boolean;
  showSummary?: boolean;
  showTable?: boolean;
  onAreaClick?: (item: AreaConversionItem) => void;
};

const metricConfig: Record<HeatmapMetric, MetricConfig> = {
  conversionRate: {
    label: "Conversion Rate",
    helper: "Lead to deal conversion percentage",
    suffix: "%",
  },
  leads: {
    label: "Leads",
    helper: "Total leads generated from area",
  },
  deals: {
    label: "Deals",
    helper: "Closed deals from area",
  },
  revenue: {
    label: "Revenue",
    helper: "Revenue generated from area",
    prefix: "₹",
  },
};

const periodOptions: { label: string; value: HeatmapPeriod }[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last 12 Months", value: "12m" },
];

const metricOptions: { label: string; value: HeatmapMetric }[] = [
  { label: "Conversion", value: "conversionRate" },
  { label: "Leads", value: "leads" },
  { label: "Deals", value: "deals" },
  { label: "Revenue", value: "revenue" },
];

const defaultAreaData: AreaConversionItem[] = [
  {
    id: "area-001",
    area: "Whitefield",
    city: "Bengaluru",
    leads: 426,
    qualifiedLeads: 186,
    deals: 42,
    revenue: 33600000,
    conversionRate: 9.86,
    avgDealValue: 800000,
    trend: 12.4,
  },
  {
    id: "area-002",
    area: "Sarjapur Road",
    city: "Bengaluru",
    leads: 388,
    qualifiedLeads: 164,
    deals: 34,
    revenue: 27200000,
    conversionRate: 8.76,
    avgDealValue: 800000,
    trend: 9.8,
  },
  {
    id: "area-003",
    area: "HSR Layout",
    city: "Bengaluru",
    leads: 312,
    qualifiedLeads: 142,
    deals: 31,
    revenue: 24800000,
    conversionRate: 9.94,
    avgDealValue: 800000,
    trend: 7.2,
  },
  {
    id: "area-004",
    area: "Electronic City",
    city: "Bengaluru",
    leads: 294,
    qualifiedLeads: 118,
    deals: 23,
    revenue: 16100000,
    conversionRate: 7.82,
    avgDealValue: 700000,
    trend: 3.9,
  },
  {
    id: "area-005",
    area: "Indiranagar",
    city: "Bengaluru",
    leads: 248,
    qualifiedLeads: 106,
    deals: 19,
    revenue: 17100000,
    conversionRate: 7.66,
    avgDealValue: 900000,
    trend: -1.8,
  },
  {
    id: "area-006",
    area: "Koramangala",
    city: "Bengaluru",
    leads: 226,
    qualifiedLeads: 94,
    deals: 16,
    revenue: 12800000,
    conversionRate: 7.08,
    avgDealValue: 800000,
    trend: 2.4,
  },
  {
    id: "area-007",
    area: "Hebbal",
    city: "Bengaluru",
    leads: 218,
    qualifiedLeads: 88,
    deals: 15,
    revenue: 13500000,
    conversionRate: 6.88,
    avgDealValue: 900000,
    trend: 5.6,
  },
  {
    id: "area-008",
    area: "Yelahanka",
    city: "Bengaluru",
    leads: 194,
    qualifiedLeads: 74,
    deals: 12,
    revenue: 8400000,
    conversionRate: 6.19,
    avgDealValue: 700000,
    trend: -3.1,
  },
  {
    id: "area-009",
    area: "Marathahalli",
    city: "Bengaluru",
    leads: 184,
    qualifiedLeads: 68,
    deals: 10,
    revenue: 7000000,
    conversionRate: 5.43,
    avgDealValue: 700000,
    trend: -4.5,
  },
  {
    id: "area-010",
    area: "Banashankari",
    city: "Bengaluru",
    leads: 162,
    qualifiedLeads: 56,
    deals: 8,
    revenue: 5600000,
    conversionRate: 4.94,
    avgDealValue: 700000,
    trend: 1.2,
  },
  {
    id: "area-011",
    area: "Jayanagar",
    city: "Bengaluru",
    leads: 148,
    qualifiedLeads: 52,
    deals: 7,
    revenue: 6300000,
    conversionRate: 4.73,
    avgDealValue: 900000,
    trend: -2.2,
  },
  {
    id: "area-012",
    area: "JP Nagar",
    city: "Bengaluru",
    leads: 136,
    qualifiedLeads: 48,
    deals: 6,
    revenue: 4200000,
    conversionRate: 4.41,
    avgDealValue: 700000,
    trend: 0.8,
  },
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

function getMetricValue(item: AreaConversionItem, metric: HeatmapMetric): number {
  return item[metric];
}

function formatMetricValue(value: number, metric: HeatmapMetric): string {
  if (metric === "revenue") return formatCurrency(value);
  if (metric === "conversionRate") return `${value.toFixed(2)}%`;
  return formatNumber(value);
}

function getIntensityClass(value: number, min: number, max: number): string {
  if (max === min) return "bg-slate-100 text-slate-800 border-slate-200";

  const ratio = (value - min) / (max - min);

  if (ratio >= 0.85) return "bg-emerald-700 text-white border-emerald-800";
  if (ratio >= 0.68) return "bg-emerald-500 text-white border-emerald-600";
  if (ratio >= 0.5) return "bg-emerald-200 text-emerald-950 border-emerald-300";
  if (ratio >= 0.32) return "bg-amber-200 text-amber-950 border-amber-300";
  if (ratio >= 0.15) return "bg-orange-200 text-orange-950 border-orange-300";
  return "bg-rose-100 text-rose-900 border-rose-200";
}

const SummaryCard: React.FC<{
  label: string;
  value: string;
  helper: string;
}> = ({ label, value, helper }) => {
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
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl">🗺️</div>
      <h3 className="text-lg font-black text-slate-950">No area conversion data found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Add lead area, deal area and revenue attribution data to generate the conversion heatmap.
      </p>
    </div>
  );
};

const AreaConversionHeatmap: React.FC<AreaConversionHeatmapProps> = ({
  title = "Area Conversion Heatmap",
  subtitle = "Find which locations are producing strong lead-to-deal conversion and revenue.",
  data = defaultAreaData,
  defaultMetric = "conversionRate",
  defaultPeriod = "30d",
  showControls = true,
  showSummary = true,
  showTable = true,
  onAreaClick,
}) => {
  const [metric, setMetric] = useState<HeatmapMetric>(defaultMetric);
  const [period, setPeriod] = useState<HeatmapPeriod>(defaultPeriod);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    const cleanSearch = searchTerm.trim().toLowerCase();

    return data
      .filter((item) => {
        if (!cleanSearch) return true;
        return item.area.toLowerCase().includes(cleanSearch) || item.city.toLowerCase().includes(cleanSearch);
      })
      .sort((a, b) => getMetricValue(b, metric) - getMetricValue(a, metric));
  }, [data, metric, searchTerm]);

  const metricValues = useMemo(() => filteredData.map((item) => getMetricValue(item, metric)), [filteredData, metric]);
  const minValue = metricValues.length ? Math.min(...metricValues) : 0;
  const maxValue = metricValues.length ? Math.max(...metricValues) : 0;

  const summary = useMemo(() => {
    const totalLeads = filteredData.reduce((sum, item) => sum + item.leads, 0);
    const totalDeals = filteredData.reduce((sum, item) => sum + item.deals, 0);
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
    const avgConversion = totalLeads > 0 ? (totalDeals / totalLeads) * 100 : 0;
    const bestArea = filteredData[0];

    return {
      totalLeads,
      totalDeals,
      totalRevenue,
      avgConversion,
      bestArea,
    };
  }, [filteredData]);

  const selectedArea = useMemo(() => {
    return filteredData.find((item) => item.id === selectedAreaId) ?? filteredData[0] ?? null;
  }, [filteredData, selectedAreaId]);

  const handleAreaClick = (item: AreaConversionItem) => {
    setSelectedAreaId(item.id);
    onAreaClick?.(item);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm md:p-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
              Location Intelligence
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-950 md:text-2xl">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>

          {showControls && (
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search area or city..."
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />

              <select
                value={metric}
                onChange={(event) => setMetric(event.target.value as HeatmapMetric)}
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
                onChange={(event) => setPeriod(event.target.value as HeatmapPeriod)}
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
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Total Leads" value={formatNumber(summary.totalLeads)} helper={`Across ${filteredData.length} areas`} />
              <SummaryCard label="Total Deals" value={formatNumber(summary.totalDeals)} helper="Closed deals from selected areas" />
              <SummaryCard label="Avg Conversion" value={`${summary.avgConversion.toFixed(2)}%`} helper="Overall lead-to-deal ratio" />
              <SummaryCard label="Total Revenue" value={formatCurrency(summary.totalRevenue)} helper="Revenue from selected areas" />
            </div>
          )}

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-950">Heatmap by {metricConfig[metric].label}</h3>
                  <p className="mt-1 text-sm text-slate-500">{metricConfig[metric].helper} · {periodOptions.find((item) => item.value === period)?.label}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                  <span>Low</span>
                  <div className="h-3 w-10 rounded-full bg-rose-100" />
                  <div className="h-3 w-10 rounded-full bg-amber-200" />
                  <div className="h-3 w-10 rounded-full bg-emerald-200" />
                  <div className="h-3 w-10 rounded-full bg-emerald-600" />
                  <span>High</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredData.map((item) => {
                  const value = getMetricValue(item, metric);
                  const isSelected = selectedArea?.id === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAreaClick(item)}
                      className={classNames(
                        "group rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-100",
                        getIntensityClass(value, minValue, maxValue),
                        isSelected && "ring-4 ring-slate-200",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black">{item.area}</p>
                          <p className="mt-1 text-xs font-bold opacity-80">{item.city}</p>
                        </div>
                        <span className="rounded-full bg-white/25 px-2 py-1 text-xs font-black">
                          {item.trend >= 0 ? "+" : ""}{item.trend.toFixed(1)}%
                        </span>
                      </div>

                      <div className="mt-5">
                        <p className="text-2xl font-black tracking-tight">{formatMetricValue(value, metric)}</p>
                        <p className="mt-1 text-xs font-bold opacity-80">
                          {item.leads} leads · {item.deals} deals
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-base font-black text-slate-950">Selected Area Details</h3>
                <p className="mt-1 text-sm text-slate-500">Detailed performance breakdown.</p>
              </div>

              {selectedArea && (
                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-950 p-5 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xl font-black">{selectedArea.area}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-300">{selectedArea.city}</p>
                      </div>
                      <span className={classNames("rounded-full px-3 py-1 text-xs font-black", selectedArea.trend >= 0 ? "bg-emerald-400 text-emerald-950" : "bg-rose-300 text-rose-950")}>
                        {selectedArea.trend >= 0 ? "↗" : "↘"} {selectedArea.trend.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/10 p-3">
                        <p className="text-xs font-bold text-slate-300">Conversion</p>
                        <p className="mt-1 text-lg font-black">{selectedArea.conversionRate.toFixed(2)}%</p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-3">
                        <p className="text-xs font-bold text-slate-300">Revenue</p>
                        <p className="mt-1 text-lg font-black">{formatCurrency(selectedArea.revenue)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <SummaryCard label="Leads" value={formatNumber(selectedArea.leads)} helper="Total enquiries" />
                    <SummaryCard label="Qualified" value={formatNumber(selectedArea.qualifiedLeads)} helper="Sales-ready leads" />
                    <SummaryCard label="Deals" value={formatNumber(selectedArea.deals)} helper="Closed deals" />
                    <SummaryCard label="Avg Deal" value={formatCurrency(selectedArea.avgDealValue)} helper="Average value" />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-black text-slate-950">Action Insight</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {selectedArea.conversionRate >= summary.avgConversion
                        ? `${selectedArea.area} is performing above average. Increase campaign budget and assign senior closers here.`
                        : `${selectedArea.area} is below average. Improve lead qualification, follow-up timing and local offer strategy.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {showTable && (
            <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <h3 className="text-base font-black text-slate-950">Area Performance Table</h3>
                <p className="mt-1 text-sm text-slate-500">Sortable source data view for area conversion performance.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-black">Area</th>
                      <th className="px-5 py-4 font-black">Leads</th>
                      <th className="px-5 py-4 font-black">Qualified</th>
                      <th className="px-5 py-4 font-black">Deals</th>
                      <th className="px-5 py-4 font-black">Conversion</th>
                      <th className="px-5 py-4 font-black">Revenue</th>
                      <th className="px-5 py-4 font-black">Avg Deal</th>
                      <th className="px-5 py-4 font-black">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredData.map((item) => (
                      <tr key={item.id} className="cursor-pointer transition hover:bg-slate-50" onClick={() => handleAreaClick(item)}>
                        <td className="px-5 py-4">
                          <div className="font-black text-slate-950">{item.area}</div>
                          <div className="mt-1 text-xs font-semibold text-slate-500">{item.city}</div>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-700">{formatNumber(item.leads)}</td>
                        <td className="px-5 py-4 font-bold text-blue-700">{formatNumber(item.qualifiedLeads)}</td>
                        <td className="px-5 py-4 font-bold text-emerald-700">{formatNumber(item.deals)}</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{item.conversionRate.toFixed(2)}%</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(item.revenue)}</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(item.avgDealValue)}</td>
                        <td className="px-5 py-4">
                          <span className={classNames("rounded-full px-3 py-1 text-xs font-black", item.trend >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
                            {item.trend >= 0 ? "+" : ""}{item.trend.toFixed(1)}%
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

export default AreaConversionHeatmap;
