import React, { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
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
// MEI CRM - LeadAnalyticsPage.tsx
// Professional standalone Lead Analytics page
// Works in Vite + React + TypeScript projects
// Requires: recharts + tailwindcss
// =====================================================

type DateRange = "7d" | "30d" | "90d" | "12m";
type LeadSegment = "all" | "hot" | "warm" | "cold" | "lost";
type TrendDirection = "up" | "down" | "neutral";

type KpiCard = {
  id: string;
  title: string;
  value: string;
  helper: string;
  trend: string;
  direction: TrendDirection;
};

type ChartPoint = {
  name: string;
  leads?: number;
  qualified?: number;
  converted?: number;
  lost?: number;
  conversion?: number;
};

type DistributionPoint = {
  name: string;
  value: number;
};

type LeadOwnerRow = {
  name: string;
  role: string;
  totalLeads: number;
  hotLeads: number;
  qualified: number;
  converted: number;
  responseTime: string;
  conversionRate: string;
};

type LeadAlert = {
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

const LEAD_SEGMENT_OPTIONS: { label: string; value: LeadSegment }[] = [
  { label: "All Leads", value: "all" },
  { label: "Hot Leads", value: "hot" },
  { label: "Warm Leads", value: "warm" },
  { label: "Cold Leads", value: "cold" },
  { label: "Lost Leads", value: "lost" },
];

const kpiCards: KpiCard[] = [
  {
    id: "new-leads",
    title: "New Leads",
    value: "2,846",
    helper: "Fresh leads captured in CRM",
    trend: "+18.4%",
    direction: "up",
  },
  {
    id: "qualified-leads",
    title: "Qualified Leads",
    value: "1,142",
    helper: "Leads ready for sales action",
    trend: "+11.2%",
    direction: "up",
  },
  {
    id: "lead-conversion",
    title: "Lead Conversion",
    value: "14.8%",
    helper: "Lead to deal conversion ratio",
    trend: "-2.1%",
    direction: "down",
  },
  {
    id: "avg-response",
    title: "Avg Response Time",
    value: "38m",
    helper: "Average first response time",
    trend: "+9m",
    direction: "down",
  },
];

const leadTrendData: ChartPoint[] = [
  { name: "Jan", leads: 220, qualified: 92, converted: 28, lost: 34, conversion: 12.7 },
  { name: "Feb", leads: 280, qualified: 116, converted: 34, lost: 42, conversion: 12.1 },
  { name: "Mar", leads: 310, qualified: 132, converted: 39, lost: 38, conversion: 12.6 },
  { name: "Apr", leads: 370, qualified: 164, converted: 46, lost: 51, conversion: 12.4 },
  { name: "May", leads: 430, qualified: 186, converted: 51, lost: 58, conversion: 11.9 },
  { name: "Jun", leads: 510, qualified: 218, converted: 63, lost: 66, conversion: 12.4 },
];

const sourceData: DistributionPoint[] = [
  { name: "Meta Ads", value: 38 },
  { name: "Google Ads", value: 24 },
  { name: "Referral", value: 18 },
  { name: "Walk-in", value: 9 },
  { name: "Website", value: 7 },
  { name: "Partner", value: 4 },
];

const qualityData: DistributionPoint[] = [
  { name: "Hot", value: 28 },
  { name: "Warm", value: 42 },
  { name: "Cold", value: 21 },
  { name: "Lost", value: 9 },
];

const statusData: DistributionPoint[] = [
  { name: "New", value: 680 },
  { name: "Contacted", value: 524 },
  { name: "Qualified", value: 382 },
  { name: "Site Visit", value: 168 },
  { name: "Negotiation", value: 82 },
  { name: "Converted", value: 63 },
];

const ownerRows: LeadOwnerRow[] = [
  {
    name: "Arun Kumar",
    role: "Senior Sales Executive",
    totalLeads: 428,
    hotLeads: 84,
    qualified: 196,
    converted: 42,
    responseTime: "22m",
    conversionRate: "9.8%",
  },
  {
    name: "Priya S",
    role: "Relationship Manager",
    totalLeads: 386,
    hotLeads: 72,
    qualified: 178,
    converted: 39,
    responseTime: "28m",
    conversionRate: "10.1%",
  },
  {
    name: "Rahul M",
    role: "Field Sales Executive",
    totalLeads: 342,
    hotLeads: 61,
    qualified: 142,
    converted: 31,
    responseTime: "41m",
    conversionRate: "9.1%",
  },
  {
    name: "Naveen R",
    role: "Channel Partner",
    totalLeads: 296,
    hotLeads: 43,
    qualified: 116,
    converted: 24,
    responseTime: "53m",
    conversionRate: "8.1%",
  },
];

const leadAlerts: LeadAlert[] = [
  {
    id: "alert-1",
    title: "Hot leads are waiting too long",
    message: "42 hot leads crossed the 24-hour response window. Assign them to your fastest closers today.",
    impact: "high",
  },
  {
    id: "alert-2",
    title: "Referral channel has premium conversion",
    message: "Referral leads are converting 2.3x better than cold paid leads. Push customer referral campaigns.",
    impact: "high",
  },
  {
    id: "alert-3",
    title: "Meta Ads volume increased but quality dropped",
    message: "Meta lead volume grew by 18%, but qualified ratio dropped by 6%. Tighten campaign targeting.",
    impact: "medium",
  },
];

const COLORS = ["#111827", "#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"];

function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
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
  segment: LeadSegment;
  onDateRangeChange: (value: DateRange) => void;
  onSegmentChange: (value: LeadSegment) => void;
}> = ({ dateRange, segment, onDateRangeChange, onSegmentChange }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
            Lead Intelligence Center
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Lead Analytics</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Understand where leads come from, how fast your team responds, and which channels convert into real business.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={segment}
            onChange={(event) => onSegmentChange(event.target.value as LeadSegment)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            {LEAD_SEGMENT_OPTIONS.map((option) => (
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
            Export Leads Report
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

const LeadTrendChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={leadTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip />
        <Area type="monotone" dataKey="leads" name="New Leads" stroke="#2563eb" fill="#dbeafe" strokeWidth={3} />
        <Area type="monotone" dataKey="qualified" name="Qualified" stroke="#111827" fill="#e5e7eb" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const ConversionTrendChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={leadTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip formatter={(value) => [`${value}%`, "Conversion"]} />
        <Line type="monotone" dataKey="conversion" name="Conversion Rate" stroke="#111827" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const LeadSourceChart: React.FC = () => {
  return (
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
  );
};

const LeadQualityChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={qualityData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
        <Bar dataKey="value" radius={[12, 12, 0, 0]}>
          {qualityData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const LeadStatusFunnel: React.FC = () => {
  const maxValue = Math.max(...statusData.map((item) => item.value));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black text-slate-950">Lead Status Funnel</h3>
        <p className="mt-1 text-sm text-slate-500">Stage-wise lead progress from new enquiry to conversion.</p>
      </div>

      <div className="space-y-4">
        {statusData.map((item) => {
          const width = Math.max((item.value / maxValue) * 100, 8);
          return (
            <div key={item.name}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-black text-slate-700">{item.name}</span>
                <span className="font-bold text-slate-500">{item.value.toLocaleString("en-IN")}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 rounded-full bg-slate-950" style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LeadOwnerTable: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-base font-black text-slate-950">Lead Owner Performance</h3>
        <p className="mt-1 text-sm text-slate-500">Track speed, qualification and conversion by team member.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4 font-black">Owner</th>
              <th className="px-5 py-4 font-black">Total Leads</th>
              <th className="px-5 py-4 font-black">Hot</th>
              <th className="px-5 py-4 font-black">Qualified</th>
              <th className="px-5 py-4 font-black">Converted</th>
              <th className="px-5 py-4 font-black">Response</th>
              <th className="px-5 py-4 font-black">Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {ownerRows.map((row) => (
              <tr key={row.name} className="transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="font-black text-slate-950">{row.name}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">{row.role}</div>
                </td>
                <td className="px-5 py-4 font-bold text-slate-700">{row.totalLeads}</td>
                <td className="px-5 py-4 font-bold text-rose-700">{row.hotLeads}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{row.qualified}</td>
                <td className="px-5 py-4 font-bold text-emerald-700">{row.converted}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{row.responseTime}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{row.conversionRate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LeadInsightsPanel: React.FC = () => {
  const impactStyles: Record<LeadAlert["impact"], string> = {
    high: "border-rose-200 bg-rose-50 text-rose-700",
    medium: "border-amber-200 bg-amber-50 text-amber-700",
    low: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black text-slate-950">Lead AI Insights</h3>
        <p className="mt-1 text-sm text-slate-500">Practical actions to increase lead-to-deal conversion.</p>
      </div>

      <div className="space-y-4">
        {leadAlerts.map((alert) => (
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
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl">🎯</div>
      <h3 className="text-lg font-black text-slate-950">No lead analytics found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Add lead records, sources, statuses and owners to unlock full lead analytics.
      </p>
    </div>
  );
};

const LeadAnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [segment, setSegment] = useState<LeadSegment>("all");
  const [isLoading] = useState(false);
  const [hasError] = useState(false);

  const selectedSummary = useMemo(() => {
    const rangeLabel = DATE_RANGE_OPTIONS.find((item) => item.value === dateRange)?.label ?? "Selected Period";
    const segmentLabel = LEAD_SEGMENT_OPTIONS.find((item) => item.value === segment)?.label ?? "All Leads";
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
            <h2 className="text-xl font-black text-rose-900">Unable to load lead analytics</h2>
            <p className="mt-2 text-sm text-rose-700">Please check lead API, analytics transformer, or CRM data connection.</p>
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
            <p className="mt-1 text-xs font-semibold text-slate-500">Lead source, status, quality, owner and conversion intelligence.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-700">42 Hot Follow-ups</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Referral Leads Winning</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">Live Lead Data</span>
          </div>
        </div>

        <KpiGrid />

        {leadTrendData.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid gap-5 xl:grid-cols-2">
              <ChartCard title="Lead Growth Trend" subtitle="New and qualified leads over time.">
                <LeadTrendChart />
              </ChartCard>

              <ChartCard title="Conversion Rate Trend" subtitle="Lead-to-deal conversion movement.">
                <ConversionTrendChart />
              </ChartCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <ChartCard title="Lead Source Distribution" subtitle="Which channels are producing your leads.">
                <LeadSourceChart />
              </ChartCard>

              <ChartCard title="Lead Quality Split" subtitle="Hot, warm, cold and lost lead share.">
                <LeadQualityChart />
              </ChartCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <LeadStatusFunnel />
              <LeadInsightsPanel />
            </div>

            <LeadOwnerTable />
          </>
        )}
      </div>
    </div>
  );
};

export default LeadAnalyticsPage;
