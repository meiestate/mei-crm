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
// MEI CRM - AnalyticsDashboardPage.tsx
// Professional standalone dashboard page
// Works in Vite + React + TypeScript projects
// =====================================================

type DateRange = "7d" | "30d" | "90d" | "12m";
type AnalyticsSection = "overview" | "leads" | "pipeline" | "revenue" | "team" | "marketing";
type TrendDirection = "up" | "down" | "neutral";

type KpiCard = {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend: string;
  direction: TrendDirection;
};

type ChartPoint = {
  name: string;
  leads?: number;
  deals?: number;
  revenue?: number;
  target?: number;
  conversion?: number;
};

type FunnelStage = {
  name: string;
  value: number;
};

type TeamRow = {
  name: string;
  role: string;
  leads: number;
  deals: number;
  revenue: number;
  conversion: string;
};

type ActivityRow = {
  id: string;
  title: string;
  description: string;
  time: string;
  status: "success" | "warning" | "info";
};

const DATE_RANGE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last 12 Months", value: "12m" },
];

const SECTION_OPTIONS: { label: string; value: AnalyticsSection }[] = [
  { label: "Overview", value: "overview" },
  { label: "Leads", value: "leads" },
  { label: "Pipeline", value: "pipeline" },
  { label: "Revenue", value: "revenue" },
  { label: "Team", value: "team" },
  { label: "Marketing", value: "marketing" },
];

const kpiCards: KpiCard[] = [
  {
    id: "total-leads",
    label: "Total Leads",
    value: "2,846",
    helper: "New enquiries captured",
    trend: "+18.4%",
    direction: "up",
  },
  {
    id: "qualified-leads",
    label: "Qualified Leads",
    value: "1,142",
    helper: "Ready for sales follow-up",
    trend: "+11.2%",
    direction: "up",
  },
  {
    id: "pipeline-value",
    label: "Pipeline Value",
    value: "₹8.74 Cr",
    helper: "Active deal opportunity",
    trend: "+24.7%",
    direction: "up",
  },
  {
    id: "conversion-rate",
    label: "Conversion Rate",
    value: "14.8%",
    helper: "Lead to closed deal",
    trend: "-2.1%",
    direction: "down",
  },
];

const monthlyPerformance: ChartPoint[] = [
  { name: "Jan", leads: 220, deals: 28, revenue: 48, target: 42 },
  { name: "Feb", leads: 280, deals: 34, revenue: 56, target: 48 },
  { name: "Mar", leads: 310, deals: 39, revenue: 64, target: 55 },
  { name: "Apr", leads: 370, deals: 46, revenue: 78, target: 63 },
  { name: "May", leads: 430, deals: 51, revenue: 86, target: 72 },
  { name: "Jun", leads: 510, deals: 63, revenue: 112, target: 88 },
];

const funnelData: FunnelStage[] = [
  { name: "New", value: 2846 },
  { name: "Contacted", value: 1960 },
  { name: "Qualified", value: 1142 },
  { name: "Site Visit", value: 486 },
  { name: "Negotiation", value: 236 },
  { name: "Closed", value: 122 },
];

const leadSourceData: FunnelStage[] = [
  { name: "Meta Ads", value: 38 },
  { name: "Google", value: 26 },
  { name: "Referral", value: 18 },
  { name: "Walk-in", value: 10 },
  { name: "Partner", value: 8 },
];

const teamRows: TeamRow[] = [
  { name: "Arun Kumar", role: "Senior Sales", leads: 428, deals: 42, revenue: 13800000, conversion: "9.8%" },
  { name: "Priya S", role: "Relationship Manager", leads: 386, deals: 39, revenue: 12100000, conversion: "10.1%" },
  { name: "Rahul M", role: "Field Executive", leads: 342, deals: 31, revenue: 9400000, conversion: "9.1%" },
  { name: "Naveen R", role: "Channel Partner", leads: 296, deals: 24, revenue: 7600000, conversion: "8.1%" },
];

const activityRows: ActivityRow[] = [
  {
    id: "a1",
    title: "Revenue crossed monthly target",
    description: "Pipeline revenue reached 127% of the expected target.",
    time: "Today, 10:45 AM",
    status: "success",
  },
  {
    id: "a2",
    title: "Follow-up delay detected",
    description: "42 hot leads are waiting for response beyond 24 hours.",
    time: "Today, 09:15 AM",
    status: "warning",
  },
  {
    id: "a3",
    title: "Meta campaign improved",
    description: "Cost per lead reduced by 14% compared with previous period.",
    time: "Yesterday, 06:20 PM",
    status: "info",
  },
];

const COLORS = ["#111827", "#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"];

function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const TrendBadge: React.FC<{ direction: TrendDirection; value: string }> = ({ direction, value }) => {
  const styles: Record<TrendDirection, string> = {
    up: "bg-emerald-50 text-emerald-700 border-emerald-200",
    down: "bg-rose-50 text-rose-700 border-rose-200",
    neutral: "bg-slate-50 text-slate-600 border-slate-200",
  };

  const icon: Record<TrendDirection, string> = {
    up: "↗",
    down: "↘",
    neutral: "→",
  };

  return (
    <span className={classNames("inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold", styles[direction])}>
      <span>{icon[direction]}</span>
      {value}
    </span>
  );
};

const PageHeader: React.FC<{
  dateRange: DateRange;
  section: AnalyticsSection;
  onDateRangeChange: (value: DateRange) => void;
  onSectionChange: (value: AnalyticsSection) => void;
}> = ({ dateRange, section, onDateRangeChange, onSectionChange }) => {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="mb-2 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
          MEI CRM Analytics Command Center
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Analytics Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Leads, deals, revenue, marketing and team performance — one clean view for faster decisions.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={section}
          onChange={(event) => onSectionChange(event.target.value as AnalyticsSection)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        >
          {SECTION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={dateRange}
          onChange={(event) => onDateRangeChange(event.target.value as DateRange)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        >
          {DATE_RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">
          Export Report
        </button>
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
              <p className="text-sm font-semibold text-slate-500">{card.label}</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{card.value}</h2>
            </div>
            <TrendBadge direction={card.direction} value={card.trend} />
          </div>
          <p className="mt-4 text-sm text-slate-500">{card.helper}</p>
        </div>
      ))}
    </div>
  );
};

const ChartCard: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, subtitle, children, action }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        {action}
      </div>
      <div className="h-80">{children}</div>
    </div>
  );
};

const RevenueTrendChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={monthlyPerformance} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip formatter={(value) => [`₹${value}L`, "Value"]} />
        <Line type="monotone" dataKey="revenue" stroke="#111827" strokeWidth={3} dot={{ r: 4 }} name="Revenue" />
        <Line type="monotone" dataKey="target" stroke="#2563eb" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const LeadsDealsChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={monthlyPerformance} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="leads" name="Leads" radius={[10, 10, 0, 0]} fill="#2563eb" />
        <Bar dataKey="deals" name="Deals" radius={[10, 10, 0, 0]} fill="#111827" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const LeadSourceChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={leadSourceData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
          {leadSourceData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const FunnelPanel: React.FC = () => {
  const maxValue = Math.max(...funnelData.map((item) => item.value));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black text-slate-950">Sales Funnel</h3>
        <p className="mt-1 text-sm text-slate-500">Stage-wise movement from new lead to closed deal.</p>
      </div>

      <div className="space-y-4">
        {funnelData.map((stage) => {
          const width = Math.max((stage.value / maxValue) * 100, 8);
          return (
            <div key={stage.name}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-700">{stage.name}</span>
                <span className="font-semibold text-slate-500">{stage.value.toLocaleString("en-IN")}</span>
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

const TeamPerformanceTable: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-base font-black text-slate-950">Team Performance</h3>
        <p className="mt-1 text-sm text-slate-500">Sales output, deal closure and revenue contribution.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4 font-black">Team Member</th>
              <th className="px-5 py-4 font-black">Leads</th>
              <th className="px-5 py-4 font-black">Deals</th>
              <th className="px-5 py-4 font-black">Revenue</th>
              <th className="px-5 py-4 font-black">Conversion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {teamRows.map((row) => (
              <tr key={row.name} className="transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="font-black text-slate-950">{row.name}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">{row.role}</div>
                </td>
                <td className="px-5 py-4 font-semibold text-slate-700">{row.leads}</td>
                <td className="px-5 py-4 font-semibold text-slate-700">{row.deals}</td>
                <td className="px-5 py-4 font-semibold text-slate-700">{formatCurrency(row.revenue)}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{row.conversion}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InsightsPanel: React.FC = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black">AI Business Insights</h3>
        <p className="mt-1 text-sm text-slate-300">High-impact actions for the next 7 days.</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-bold">🔥 Hot lead response speed is the biggest leak.</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            42 hot leads crossed 24 hours without action. Assign them to top performers before running new ads.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-bold">📈 Referral leads convert better than paid leads.</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Referral conversion is 2.3x stronger. Build broker and customer referral campaigns this week.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-bold">🏗 Pipeline is strong, but negotiation stage is slow.</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Add urgency scripts, builder offer reminders and scheduled negotiation calls for stuck deals.
          </p>
        </div>
      </div>
    </div>
  );
};

const ActivityFeed: React.FC = () => {
  const statusStyle: Record<ActivityRow["status"], string> = {
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black text-slate-950">Recent Analytics Alerts</h3>
        <p className="mt-1 text-sm text-slate-500">Important movement across CRM performance.</p>
      </div>

      <div className="space-y-4">
        {activityRows.map((item) => (
          <div key={item.id} className="flex gap-3 rounded-2xl border border-slate-100 p-4">
            <div className={classNames("mt-1 h-9 w-9 shrink-0 rounded-2xl text-center text-sm font-black leading-9", statusStyle[item.status])}>
              {item.status === "success" ? "✓" : item.status === "warning" ? "!" : "i"}
            </div>
            <div>
              <p className="font-black text-slate-950">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
              <p className="mt-2 text-xs font-semibold text-slate-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl">📊</div>
      <h3 className="text-lg font-black text-slate-950">No analytics data found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Connect leads, deals, tasks, marketing campaigns and revenue modules to unlock live analytics.
      </p>
    </div>
  );
};

const AnalyticsDashboardPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [section, setSection] = useState<AnalyticsSection>("overview");
  const [isLoading] = useState(false);
  const [hasError] = useState(false);

  const summaryText = useMemo(() => {
    const rangeLabel = DATE_RANGE_OPTIONS.find((item) => item.value === dateRange)?.label ?? "Selected Period";
    const sectionLabel = SECTION_OPTIONS.find((item) => item.value === section)?.label ?? "Overview";
    return `${sectionLabel} analytics for ${rangeLabel}`;
  }, [dateRange, section]);

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
            <h2 className="text-xl font-black text-rose-900">Unable to load analytics</h2>
            <p className="mt-2 text-sm text-rose-700">Please check API connection or analytics service status.</p>
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
          section={section}
          onDateRangeChange={setDateRange}
          onSectionChange={setSection}
        />

        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-slate-950">{summaryText}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Auto-refreshed dashboard view for decision making.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Live CRM Data</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">AI Insights Ready</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">Export Enabled</span>
          </div>
        </div>

        <KpiGrid />

        {monthlyPerformance.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid gap-5 xl:grid-cols-2">
              <ChartCard title="Revenue Trend" subtitle="Monthly revenue performance against target.">
                <RevenueTrendChart />
              </ChartCard>

              <ChartCard title="Lead vs Deal Movement" subtitle="Lead volume and deal closure comparison.">
                <LeadsDealsChart />
              </ChartCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <FunnelPanel />

              <ChartCard title="Lead Source Split" subtitle="Marketing channel contribution.">
                <LeadSourceChart />
              </ChartCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
              <TeamPerformanceTable />
              <InsightsPanel />
            </div>

            <ActivityFeed />
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
