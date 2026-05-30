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
// MEI CRM - DealAnalyticsPage.tsx
// Professional standalone Deal Analytics page
// Works in Vite + React + TypeScript projects
// Requires: recharts + tailwindcss
// =====================================================

type DateRange = "7d" | "30d" | "90d" | "12m";
type DealSegment = "all" | "open" | "won" | "lost" | "high-risk";
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
  pipeline?: number;
  won?: number;
  lost?: number;
  forecast?: number;
  velocity?: number;
};

type DistributionPoint = {
  name: string;
  value: number;
};

type DealOwnerRow = {
  name: string;
  role: string;
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  pipelineValue: number;
  avgDealSize: number;
  winRate: string;
};

type DealAlert = {
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

const DEAL_SEGMENT_OPTIONS: { label: string; value: DealSegment }[] = [
  { label: "All Deals", value: "all" },
  { label: "Open Deals", value: "open" },
  { label: "Won Deals", value: "won" },
  { label: "Lost Deals", value: "lost" },
  { label: "High Risk", value: "high-risk" },
];

const kpiCards: KpiCard[] = [
  {
    id: "pipeline-value",
    title: "Pipeline Value",
    value: "₹8.74 Cr",
    helper: "Total active opportunity value",
    trend: "+24.7%",
    direction: "up",
  },
  {
    id: "won-revenue",
    title: "Won Revenue",
    value: "₹2.18 Cr",
    helper: "Closed-won deal value",
    trend: "+16.2%",
    direction: "up",
  },
  {
    id: "win-rate",
    title: "Win Rate",
    value: "31.4%",
    helper: "Won deals against closed deals",
    trend: "+3.8%",
    direction: "up",
  },
  {
    id: "deal-velocity",
    title: "Deal Velocity",
    value: "27 days",
    helper: "Average time to close",
    trend: "-4 days",
    direction: "up",
  },
];

const dealTrendData: ChartPoint[] = [
  { name: "Jan", pipeline: 118, won: 32, lost: 14, forecast: 46, velocity: 34 },
  { name: "Feb", pipeline: 136, won: 38, lost: 16, forecast: 52, velocity: 32 },
  { name: "Mar", pipeline: 154, won: 42, lost: 18, forecast: 58, velocity: 31 },
  { name: "Apr", pipeline: 178, won: 56, lost: 21, forecast: 69, velocity: 29 },
  { name: "May", pipeline: 204, won: 63, lost: 19, forecast: 76, velocity: 28 },
  { name: "Jun", pipeline: 238, won: 74, lost: 23, forecast: 91, velocity: 27 },
];

const stageData: DistributionPoint[] = [
  { name: "New", value: 186 },
  { name: "Qualified", value: 142 },
  { name: "Proposal", value: 96 },
  { name: "Negotiation", value: 58 },
  { name: "Booking", value: 32 },
  { name: "Closed Won", value: 24 },
];

const riskData: DistributionPoint[] = [
  { name: "Low Risk", value: 46 },
  { name: "Medium Risk", value: 34 },
  { name: "High Risk", value: 15 },
  { name: "Critical", value: 5 },
];

const dealSourceData: DistributionPoint[] = [
  { name: "Direct Lead", value: 32 },
  { name: "Broker", value: 24 },
  { name: "Referral", value: 19 },
  { name: "Developer", value: 14 },
  { name: "Digital Ads", value: 11 },
];

const ownerRows: DealOwnerRow[] = [
  {
    name: "Arun Kumar",
    role: "Senior Sales Executive",
    openDeals: 48,
    wonDeals: 18,
    lostDeals: 7,
    pipelineValue: 21400000,
    avgDealSize: 1180000,
    winRate: "72.0%",
  },
  {
    name: "Priya S",
    role: "Relationship Manager",
    openDeals: 43,
    wonDeals: 16,
    lostDeals: 6,
    pipelineValue: 19600000,
    avgDealSize: 1225000,
    winRate: "72.7%",
  },
  {
    name: "Rahul M",
    role: "Field Sales Executive",
    openDeals: 38,
    wonDeals: 13,
    lostDeals: 8,
    pipelineValue: 15400000,
    avgDealSize: 1184000,
    winRate: "61.9%",
  },
  {
    name: "Naveen R",
    role: "Channel Partner",
    openDeals: 31,
    wonDeals: 10,
    lostDeals: 5,
    pipelineValue: 12800000,
    avgDealSize: 1280000,
    winRate: "66.7%",
  },
];

const dealAlerts: DealAlert[] = [
  {
    id: "alert-1",
    title: "Negotiation stage is slowing revenue",
    message: "58 deals are stuck in negotiation. Add urgency scripts, limited-period offers and builder approval reminders.",
    impact: "high",
  },
  {
    id: "alert-2",
    title: "High-value deals need leadership follow-up",
    message: "₹1.42 Cr worth of high-value deals have no senior touchpoint in the last 5 days.",
    impact: "high",
  },
  {
    id: "alert-3",
    title: "Deal velocity improved this month",
    message: "Average closing time reduced from 31 days to 27 days. Repeat the same follow-up cadence across teams.",
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
  segment: DealSegment;
  onDateRangeChange: (value: DateRange) => void;
  onSegmentChange: (value: DealSegment) => void;
}> = ({ dateRange, segment, onDateRangeChange, onSegmentChange }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            Deal Intelligence Center
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Deal Analytics</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Track pipeline value, stage movement, deal velocity, win rate and risk signals from one command view.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={segment}
            onChange={(event) => onSegmentChange(event.target.value as DealSegment)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            {DEAL_SEGMENT_OPTIONS.map((option) => (
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
            Export Deal Report
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

const PipelineTrendChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={dealTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip formatter={(value) => [`₹${value}L`, "Value"]} />
        <Area type="monotone" dataKey="pipeline" name="Pipeline" stroke="#2563eb" fill="#dbeafe" strokeWidth={3} />
        <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#111827" fill="#e5e7eb" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const WonLostChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={dealTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="won" name="Won Deals" radius={[12, 12, 0, 0]} fill="#16a34a" />
        <Bar dataKey="lost" name="Lost Deals" radius={[12, 12, 0, 0]} fill="#dc2626" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const DealVelocityChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={dealTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip formatter={(value) => [`${value} days`, "Velocity"]} />
        <Line type="monotone" dataKey="velocity" name="Avg Closing Time" stroke="#111827" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const DealRiskChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={riskData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
          {riskData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const DealSourceChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={dealSourceData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
        <Bar dataKey="value" radius={[12, 12, 0, 0]}>
          {dealSourceData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const DealStageFunnel: React.FC = () => {
  const maxValue = Math.max(...stageData.map((item) => item.value));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black text-slate-950">Deal Stage Funnel</h3>
        <p className="mt-1 text-sm text-slate-500">Pipeline movement from new deal to closed won.</p>
      </div>

      <div className="space-y-4">
        {stageData.map((item) => {
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

const DealOwnerTable: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-base font-black text-slate-950">Deal Owner Performance</h3>
        <p className="mt-1 text-sm text-slate-500">Owner-wise pipeline, win rate and deal value tracking.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4 font-black">Owner</th>
              <th className="px-5 py-4 font-black">Open</th>
              <th className="px-5 py-4 font-black">Won</th>
              <th className="px-5 py-4 font-black">Lost</th>
              <th className="px-5 py-4 font-black">Pipeline</th>
              <th className="px-5 py-4 font-black">Avg Size</th>
              <th className="px-5 py-4 font-black">Win Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {ownerRows.map((row) => (
              <tr key={row.name} className="transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="font-black text-slate-950">{row.name}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">{row.role}</div>
                </td>
                <td className="px-5 py-4 font-bold text-slate-700">{row.openDeals}</td>
                <td className="px-5 py-4 font-bold text-emerald-700">{row.wonDeals}</td>
                <td className="px-5 py-4 font-bold text-rose-700">{row.lostDeals}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(row.pipelineValue)}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{formatCurrency(row.avgDealSize)}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{row.winRate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DealInsightsPanel: React.FC = () => {
  const impactStyles: Record<DealAlert["impact"], string> = {
    high: "border-rose-200 bg-rose-50 text-rose-700",
    medium: "border-amber-200 bg-amber-50 text-amber-700",
    low: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black text-slate-950">Deal AI Insights</h3>
        <p className="mt-1 text-sm text-slate-500">Practical actions to protect pipeline and increase closure.</p>
      </div>

      <div className="space-y-4">
        {dealAlerts.map((alert) => (
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
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl">🤝</div>
      <h3 className="text-lg font-black text-slate-950">No deal analytics found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Add deal records, pipeline stages, owners and deal values to unlock full deal analytics.
      </p>
    </div>
  );
};

const DealAnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [segment, setSegment] = useState<DealSegment>("all");
  const [isLoading] = useState(false);
  const [hasError] = useState(false);

  const selectedSummary = useMemo(() => {
    const rangeLabel = DATE_RANGE_OPTIONS.find((item) => item.value === dateRange)?.label ?? "Selected Period";
    const segmentLabel = DEAL_SEGMENT_OPTIONS.find((item) => item.value === segment)?.label ?? "All Deals";
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
            <h2 className="text-xl font-black text-rose-900">Unable to load deal analytics</h2>
            <p className="mt-2 text-sm text-rose-700">Please check deal API, analytics transformer, or CRM data connection.</p>
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
            <p className="mt-1 text-xs font-semibold text-slate-500">Pipeline, stage, risk, owner, velocity and forecast intelligence.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-700">₹1.42 Cr High Risk</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Velocity Improving</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">Live Deal Data</span>
          </div>
        </div>

        <KpiGrid />

        {dealTrendData.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid gap-5 xl:grid-cols-2">
              <ChartCard title="Pipeline & Forecast Trend" subtitle="Pipeline value against expected forecast.">
                <PipelineTrendChart />
              </ChartCard>

              <ChartCard title="Won vs Lost Deals" subtitle="Monthly closure performance comparison.">
                <WonLostChart />
              </ChartCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              <ChartCard title="Deal Velocity" subtitle="Average days required to close deals.">
                <DealVelocityChart />
              </ChartCard>

              <ChartCard title="Deal Risk Split" subtitle="Risk distribution across active pipeline.">
                <DealRiskChart />
              </ChartCard>

              <ChartCard title="Deal Source Split" subtitle="Which channels generate deal value.">
                <DealSourceChart />
              </ChartCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <DealStageFunnel />
              <DealInsightsPanel />
            </div>

            <DealOwnerTable />
          </>
        )}
      </div>
    </div>
  );
};

export default DealAnalyticsPage;
