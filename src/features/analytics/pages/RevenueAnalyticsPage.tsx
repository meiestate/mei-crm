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
// MEI CRM - RevenueAnalyticsPage.tsx
// Professional standalone Revenue Analytics page
// Works in Vite + React + TypeScript projects
// Requires: recharts + tailwindcss
// =====================================================

type DateRange = "7d" | "30d" | "90d" | "12m";
type RevenueSegment = "all" | "booked" | "collected" | "pending" | "forecast";
type TrendDirection = "up" | "down" | "neutral";

type KpiCard = {
  id: string;
  title: string;
  value: string;
  helper: string;
  trend: string;
  direction: TrendDirection;
};

type RevenuePoint = {
  name: string;
  booked: number;
  collected: number;
  pending: number;
  target: number;
  forecast: number;
};

type DistributionPoint = {
  name: string;
  value: number;
};

type RevenueRow = {
  month: string;
  booked: number;
  collected: number;
  pending: number;
  target: number;
  achievement: string;
  status: "excellent" | "good" | "warning";
};

type RevenueOwnerRow = {
  name: string;
  role: string;
  bookedRevenue: number;
  collectedRevenue: number;
  pendingRevenue: number;
  dealsWon: number;
  avgDealValue: number;
  achievement: string;
};

type RevenueAlert = {
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

const REVENUE_SEGMENT_OPTIONS: { label: string; value: RevenueSegment }[] = [
  { label: "All Revenue", value: "all" },
  { label: "Booked Revenue", value: "booked" },
  { label: "Collected Revenue", value: "collected" },
  { label: "Pending Collection", value: "pending" },
  { label: "Forecast", value: "forecast" },
];

const kpiCards: KpiCard[] = [
  {
    id: "booked-revenue",
    title: "Booked Revenue",
    value: "₹4.86 Cr",
    helper: "Total confirmed business value",
    trend: "+21.8%",
    direction: "up",
  },
  {
    id: "collected-revenue",
    title: "Collected Revenue",
    value: "₹3.42 Cr",
    helper: "Amount received successfully",
    trend: "+17.4%",
    direction: "up",
  },
  {
    id: "pending-collection",
    title: "Pending Collection",
    value: "₹1.44 Cr",
    helper: "Receivables still pending",
    trend: "+8.6%",
    direction: "down",
  },
  {
    id: "target-achievement",
    title: "Target Achievement",
    value: "112%",
    helper: "Revenue target completion",
    trend: "+12%",
    direction: "up",
  },
];

const revenueTrendData: RevenuePoint[] = [
  { name: "Jan", booked: 58, collected: 42, pending: 16, target: 50, forecast: 54 },
  { name: "Feb", booked: 64, collected: 48, pending: 16, target: 55, forecast: 60 },
  { name: "Mar", booked: 72, collected: 54, pending: 18, target: 62, forecast: 68 },
  { name: "Apr", booked: 86, collected: 63, pending: 23, target: 70, forecast: 82 },
  { name: "May", booked: 94, collected: 71, pending: 23, target: 78, forecast: 90 },
  { name: "Jun", booked: 112, collected: 86, pending: 26, target: 92, forecast: 106 },
];

const revenueSourceData: DistributionPoint[] = [
  { name: "Direct Sales", value: 34 },
  { name: "Broker Network", value: 27 },
  { name: "Referral", value: 18 },
  { name: "Digital Campaign", value: 13 },
  { name: "Developer Partner", value: 8 },
];

const collectionStatusData: DistributionPoint[] = [
  { name: "Collected", value: 70 },
  { name: "Due This Month", value: 16 },
  { name: "Overdue", value: 9 },
  { name: "Disputed", value: 5 },
];

const monthlyRows: RevenueRow[] = [
  { month: "January", booked: 5800000, collected: 4200000, pending: 1600000, target: 5000000, achievement: "116%", status: "excellent" },
  { month: "February", booked: 6400000, collected: 4800000, pending: 1600000, target: 5500000, achievement: "116%", status: "excellent" },
  { month: "March", booked: 7200000, collected: 5400000, pending: 1800000, target: 6200000, achievement: "116%", status: "excellent" },
  { month: "April", booked: 8600000, collected: 6300000, pending: 2300000, target: 7000000, achievement: "123%", status: "excellent" },
  { month: "May", booked: 9400000, collected: 7100000, pending: 2300000, target: 7800000, achievement: "121%", status: "excellent" },
  { month: "June", booked: 11200000, collected: 8600000, pending: 2600000, target: 9200000, achievement: "122%", status: "excellent" },
];

const ownerRows: RevenueOwnerRow[] = [
  {
    name: "Arun Kumar",
    role: "Senior Sales Executive",
    bookedRevenue: 13800000,
    collectedRevenue: 10400000,
    pendingRevenue: 3400000,
    dealsWon: 18,
    avgDealValue: 766000,
    achievement: "128%",
  },
  {
    name: "Priya S",
    role: "Relationship Manager",
    bookedRevenue: 12100000,
    collectedRevenue: 9200000,
    pendingRevenue: 2900000,
    dealsWon: 16,
    avgDealValue: 756000,
    achievement: "119%",
  },
  {
    name: "Rahul M",
    role: "Field Sales Executive",
    bookedRevenue: 9400000,
    collectedRevenue: 6800000,
    pendingRevenue: 2600000,
    dealsWon: 13,
    avgDealValue: 723000,
    achievement: "104%",
  },
  {
    name: "Naveen R",
    role: "Channel Partner",
    bookedRevenue: 7600000,
    collectedRevenue: 5400000,
    pendingRevenue: 2200000,
    dealsWon: 10,
    avgDealValue: 760000,
    achievement: "96%",
  },
];

const revenueAlerts: RevenueAlert[] = [
  {
    id: "revenue-alert-1",
    title: "Overdue collection needs immediate action",
    message: "₹42L is overdue across 18 accounts. Assign collection follow-ups and add escalation reminders this week.",
    impact: "high",
  },
  {
    id: "revenue-alert-2",
    title: "Revenue target is ahead of plan",
    message: "Current achievement is 112%. Push high-intent negotiation deals to lock an additional ₹70L before month-end.",
    impact: "high",
  },
  {
    id: "revenue-alert-3",
    title: "Broker network is producing strong revenue",
    message: "Broker channel contributes 27% of booked revenue. Create a focused partner incentive plan for top 10 brokers.",
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
  segment: RevenueSegment;
  onDateRangeChange: (value: DateRange) => void;
  onSegmentChange: (value: RevenueSegment) => void;
}> = ({ dateRange, segment, onDateRangeChange, onSegmentChange }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
            Revenue Intelligence Center
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Revenue Analytics</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Track booked revenue, collections, pending receivables, targets, forecasts and revenue source performance.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={segment}
            onChange={(event) => onSegmentChange(event.target.value as RevenueSegment)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            {REVENUE_SEGMENT_OPTIONS.map((option) => (
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
            Export Revenue Report
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

const RevenueTrendChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={revenueTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip formatter={(value) => [`₹${value}L`, "Value"]} />
        <Area type="monotone" dataKey="booked" name="Booked" stroke="#111827" fill="#e5e7eb" strokeWidth={3} />
        <Area type="monotone" dataKey="collected" name="Collected" stroke="#16a34a" fill="#dcfce7" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const TargetVsActualChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={revenueTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip formatter={(value) => [`₹${value}L`, "Value"]} />
        <Bar dataKey="collected" name="Collected" radius={[12, 12, 0, 0]} fill="#2563eb" />
        <Line type="monotone" dataKey="target" name="Target" stroke="#111827" strokeWidth={3} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const PendingCollectionChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={revenueTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip formatter={(value) => [`₹${value}L`, "Pending"]} />
        <Bar dataKey="pending" name="Pending Collection" radius={[12, 12, 0, 0]} fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ForecastChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={revenueTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip formatter={(value) => [`₹${value}L`, "Value"]} />
        <Bar dataKey="booked" name="Booked" radius={[12, 12, 0, 0]} fill="#111827" />
        <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const RevenueSourceChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={revenueSourceData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
          {revenueSourceData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const CollectionStatusPanel: React.FC = () => {
  const maxValue = Math.max(...collectionStatusData.map((item) => item.value));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black text-slate-950">Collection Status</h3>
        <p className="mt-1 text-sm text-slate-500">Collected, due, overdue and disputed revenue share.</p>
      </div>

      <div className="space-y-4">
        {collectionStatusData.map((item, index) => {
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

const MonthlyRevenueTable: React.FC = () => {
  const statusStyles: Record<RevenueRow["status"], string> = {
    excellent: "bg-emerald-50 text-emerald-700",
    good: "bg-blue-50 text-blue-700",
    warning: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-base font-black text-slate-950">Monthly Revenue Scorecard</h3>
        <p className="mt-1 text-sm text-slate-500">Booked, collected, pending and target achievement by month.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4 font-black">Month</th>
              <th className="px-5 py-4 font-black">Booked</th>
              <th className="px-5 py-4 font-black">Collected</th>
              <th className="px-5 py-4 font-black">Pending</th>
              <th className="px-5 py-4 font-black">Target</th>
              <th className="px-5 py-4 font-black">Achievement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {monthlyRows.map((row) => (
              <tr key={row.month} className="transition hover:bg-slate-50">
                <td className="px-5 py-4 font-black text-slate-950">{row.month}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(row.booked)}</td>
                <td className="px-5 py-4 font-bold text-emerald-700">{formatCurrency(row.collected)}</td>
                <td className="px-5 py-4 font-bold text-amber-700">{formatCurrency(row.pending)}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(row.target)}</td>
                <td className="px-5 py-4">
                  <span className={classNames("rounded-full px-3 py-1 text-xs font-black", statusStyles[row.status])}>{row.achievement}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RevenueOwnerTable: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-base font-black text-slate-950">Owner Revenue Performance</h3>
        <p className="mt-1 text-sm text-slate-500">Team-wise booked, collected and pending revenue tracking.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4 font-black">Owner</th>
              <th className="px-5 py-4 font-black">Booked</th>
              <th className="px-5 py-4 font-black">Collected</th>
              <th className="px-5 py-4 font-black">Pending</th>
              <th className="px-5 py-4 font-black">Deals</th>
              <th className="px-5 py-4 font-black">Avg Value</th>
              <th className="px-5 py-4 font-black">Ach.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {ownerRows.map((row) => (
              <tr key={row.name} className="transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="font-black text-slate-950">{row.name}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">{row.role}</div>
                </td>
                <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(row.bookedRevenue)}</td>
                <td className="px-5 py-4 font-bold text-emerald-700">{formatCurrency(row.collectedRevenue)}</td>
                <td className="px-5 py-4 font-bold text-amber-700">{formatCurrency(row.pendingRevenue)}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{row.dealsWon}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(row.avgDealValue)}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{row.achievement}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RevenueInsightsPanel: React.FC = () => {
  const impactStyles: Record<RevenueAlert["impact"], string> = {
    high: "border-rose-200 bg-rose-50 text-rose-700",
    medium: "border-amber-200 bg-amber-50 text-amber-700",
    low: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black text-slate-950">Revenue AI Insights</h3>
        <p className="mt-1 text-sm text-slate-500">Action points to protect cashflow and grow revenue.</p>
      </div>

      <div className="space-y-4">
        {revenueAlerts.map((alert) => (
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
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl">💰</div>
      <h3 className="text-lg font-black text-slate-950">No revenue analytics found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Add deals, invoices, collections, payment status and revenue targets to unlock full revenue analytics.
      </p>
    </div>
  );
};

const RevenueAnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [segment, setSegment] = useState<RevenueSegment>("all");
  const [isLoading] = useState(false);
  const [hasError] = useState(false);

  const selectedSummary = useMemo(() => {
    const rangeLabel = DATE_RANGE_OPTIONS.find((item) => item.value === dateRange)?.label ?? "Selected Period";
    const segmentLabel = REVENUE_SEGMENT_OPTIONS.find((item) => item.value === segment)?.label ?? "All Revenue";
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
            <h2 className="text-xl font-black text-rose-900">Unable to load revenue analytics</h2>
            <p className="mt-2 text-sm text-rose-700">Please check revenue API, analytics transformer, or CRM payment data connection.</p>
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
            <p className="mt-1 text-xs font-semibold text-slate-500">Booked, collected, pending, target, forecast and revenue source intelligence.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-700">₹42L Overdue</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">112% Target</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">Live Revenue Data</span>
          </div>
        </div>

        <KpiGrid />

        {revenueTrendData.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid gap-5 xl:grid-cols-2">
              <ChartCard title="Booked vs Collected Revenue" subtitle="Revenue booked and cash collected over time.">
                <RevenueTrendChart />
              </ChartCard>

              <ChartCard title="Target vs Actual Collection" subtitle="Collected revenue against monthly target.">
                <TargetVsActualChart />
              </ChartCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              <ChartCard title="Pending Collection Trend" subtitle="Receivables pending across months.">
                <PendingCollectionChart />
              </ChartCard>

              <ChartCard title="Revenue Forecast" subtitle="Booked revenue against forecast movement.">
                <ForecastChart />
              </ChartCard>

              <ChartCard title="Revenue Source Split" subtitle="Channel-wise revenue contribution.">
                <RevenueSourceChart />
              </ChartCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
              <CollectionStatusPanel />
              <RevenueInsightsPanel />
            </div>

            <MonthlyRevenueTable />

            <RevenueOwnerTable />
          </>
        )}
      </div>
    </div>
  );
};

export default RevenueAnalyticsPage;
