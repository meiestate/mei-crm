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
// MEI CRM - TaskAnalyticsPage.tsx
// Professional standalone Task Analytics page
// Works in Vite + React + TypeScript projects
// Requires: recharts + tailwindcss
// =====================================================

type DateRange = "7d" | "30d" | "90d" | "12m";
type TaskSegment = "all" | "pending" | "completed" | "overdue" | "high-priority";
type TrendDirection = "up" | "down" | "neutral";

type KpiCard = {
  id: string;
  title: string;
  value: string;
  helper: string;
  trend: string;
  direction: TrendDirection;
};

type TaskPoint = {
  name: string;
  created: number;
  completed: number;
  overdue: number;
  pending: number;
  completionRate: number;
};

type DistributionPoint = {
  name: string;
  value: number;
};

type TaskOwnerRow = {
  name: string;
  role: string;
  assigned: number;
  completed: number;
  pending: number;
  overdue: number;
  avgCompletionTime: string;
  completionRate: string;
};

type TaskTypeRow = {
  type: string;
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  avgTime: string;
  status: "healthy" | "watch" | "critical";
};

type TaskAlert = {
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

const TASK_SEGMENT_OPTIONS: { label: string; value: TaskSegment }[] = [
  { label: "All Tasks", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Overdue", value: "overdue" },
  { label: "High Priority", value: "high-priority" },
];

const kpiCards: KpiCard[] = [
  {
    id: "total-tasks",
    title: "Total Tasks",
    value: "1,284",
    helper: "Tasks created in selected period",
    trend: "+14.6%",
    direction: "up",
  },
  {
    id: "completed-tasks",
    title: "Completed Tasks",
    value: "842",
    helper: "Successfully completed tasks",
    trend: "+18.9%",
    direction: "up",
  },
  {
    id: "overdue-tasks",
    title: "Overdue Tasks",
    value: "126",
    helper: "Tasks crossing due date",
    trend: "+7.4%",
    direction: "down",
  },
  {
    id: "completion-rate",
    title: "Completion Rate",
    value: "65.6%",
    helper: "Completed against total assigned",
    trend: "+4.2%",
    direction: "up",
  },
];

const taskTrendData: TaskPoint[] = [
  { name: "Jan", created: 168, completed: 104, overdue: 22, pending: 42, completionRate: 61.9 },
  { name: "Feb", created: 186, completed: 118, overdue: 19, pending: 49, completionRate: 63.4 },
  { name: "Mar", created: 202, completed: 132, overdue: 21, pending: 49, completionRate: 65.3 },
  { name: "Apr", created: 218, completed: 146, overdue: 24, pending: 48, completionRate: 67.0 },
  { name: "May", created: 236, completed: 158, overdue: 18, pending: 60, completionRate: 66.9 },
  { name: "Jun", created: 274, completed: 184, overdue: 22, pending: 68, completionRate: 67.2 },
];

const priorityData: DistributionPoint[] = [
  { name: "High", value: 24 },
  { name: "Medium", value: 46 },
  { name: "Low", value: 30 },
];

const statusData: DistributionPoint[] = [
  { name: "Completed", value: 66 },
  { name: "Pending", value: 24 },
  { name: "Overdue", value: 10 },
];

const taskCategoryData: DistributionPoint[] = [
  { name: "Lead Follow-up", value: 34 },
  { name: "Site Visit", value: 22 },
  { name: "Payment", value: 16 },
  { name: "Documentation", value: 15 },
  { name: "Internal", value: 13 },
];

const ownerRows: TaskOwnerRow[] = [
  {
    name: "Arun Kumar",
    role: "Senior Sales Executive",
    assigned: 286,
    completed: 204,
    pending: 58,
    overdue: 24,
    avgCompletionTime: "1.8d",
    completionRate: "71.3%",
  },
  {
    name: "Priya S",
    role: "Relationship Manager",
    assigned: 254,
    completed: 178,
    pending: 52,
    overdue: 24,
    avgCompletionTime: "2.1d",
    completionRate: "70.1%",
  },
  {
    name: "Rahul M",
    role: "Field Sales Executive",
    assigned: 238,
    completed: 148,
    pending: 66,
    overdue: 24,
    avgCompletionTime: "2.7d",
    completionRate: "62.2%",
  },
  {
    name: "Naveen R",
    role: "Channel Partner",
    assigned: 196,
    completed: 116,
    pending: 56,
    overdue: 24,
    avgCompletionTime: "3.2d",
    completionRate: "59.2%",
  },
];

const taskTypeRows: TaskTypeRow[] = [
  { type: "Lead Follow-up", total: 436, completed: 312, pending: 86, overdue: 38, avgTime: "1.4d", status: "watch" },
  { type: "Site Visit Scheduling", total: 284, completed: 198, pending: 64, overdue: 22, avgTime: "2.0d", status: "healthy" },
  { type: "Payment Collection", total: 206, completed: 126, pending: 48, overdue: 32, avgTime: "3.6d", status: "critical" },
  { type: "Document Verification", total: 192, completed: 128, pending: 42, overdue: 22, avgTime: "2.8d", status: "watch" },
  { type: "Internal Review", total: 166, completed: 78, pending: 58, overdue: 30, avgTime: "4.1d", status: "critical" },
];

const taskAlerts: TaskAlert[] = [
  {
    id: "task-alert-1",
    title: "Payment collection tasks are becoming risky",
    message: "32 payment-related tasks are overdue. Escalate them to senior owners and add daily reminders until closed.",
    impact: "high",
  },
  {
    id: "task-alert-2",
    title: "Follow-up task volume is high",
    message: "Lead follow-up contributes 34% of total tasks. Automate first reminder through WhatsApp or email templates.",
    impact: "high",
  },
  {
    id: "task-alert-3",
    title: "Completion rate is improving",
    message: "Task completion improved by 4.2%. Keep the same morning review and evening closure rhythm.",
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
  segment: TaskSegment;
  onDateRangeChange: (value: DateRange) => void;
  onSegmentChange: (value: TaskSegment) => void;
}> = ({ dateRange, segment, onDateRangeChange, onSegmentChange }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
            Productivity Intelligence Center
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Task Analytics</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Track pending tasks, overdue workload, completion rate, owner productivity and operational bottlenecks.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={segment}
            onChange={(event) => onSegmentChange(event.target.value as TaskSegment)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            {TASK_SEGMENT_OPTIONS.map((option) => (
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
            Export Task Report
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

const TaskTrendChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={taskTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip />
        <Area type="monotone" dataKey="created" name="Created" stroke="#2563eb" fill="#dbeafe" strokeWidth={3} />
        <Area type="monotone" dataKey="completed" name="Completed" stroke="#16a34a" fill="#dcfce7" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const CompletionRateChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={taskTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip formatter={(value) => [`${value}%`, "Completion"]} />
        <Line type="monotone" dataKey="completionRate" name="Completion Rate" stroke="#111827" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const OverduePendingChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={taskTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="pending" name="Pending" radius={[12, 12, 0, 0]} fill="#f59e0b" />
        <Bar dataKey="overdue" name="Overdue" radius={[12, 12, 0, 0]} fill="#dc2626" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const PrioritySplitChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={priorityData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
          {priorityData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const StatusSplitChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
          {statusData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const TaskCategoryPanel: React.FC = () => {
  const maxValue = Math.max(...taskCategoryData.map((item) => item.value));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black text-slate-950">Task Category Split</h3>
        <p className="mt-1 text-sm text-slate-500">Where your team's task energy is going.</p>
      </div>

      <div className="space-y-4">
        {taskCategoryData.map((item, index) => {
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

const TaskOwnerTable: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-base font-black text-slate-950">Task Owner Performance</h3>
        <p className="mt-1 text-sm text-slate-500">Owner-wise assigned, completed, pending and overdue tasks.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4 font-black">Owner</th>
              <th className="px-5 py-4 font-black">Assigned</th>
              <th className="px-5 py-4 font-black">Completed</th>
              <th className="px-5 py-4 font-black">Pending</th>
              <th className="px-5 py-4 font-black">Overdue</th>
              <th className="px-5 py-4 font-black">Avg Time</th>
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
                <td className="px-5 py-4 font-bold text-slate-700">{row.assigned}</td>
                <td className="px-5 py-4 font-bold text-emerald-700">{row.completed}</td>
                <td className="px-5 py-4 font-bold text-amber-700">{row.pending}</td>
                <td className="px-5 py-4 font-bold text-rose-700">{row.overdue}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{row.avgCompletionTime}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{row.completionRate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TaskTypeTable: React.FC = () => {
  const statusStyles: Record<TaskTypeRow["status"], string> = {
    healthy: "bg-emerald-50 text-emerald-700",
    watch: "bg-amber-50 text-amber-700",
    critical: "bg-rose-50 text-rose-700",
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-base font-black text-slate-950">Task Type Health</h3>
        <p className="mt-1 text-sm text-slate-500">Category-level completion risk and average closure time.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4 font-black">Task Type</th>
              <th className="px-5 py-4 font-black">Total</th>
              <th className="px-5 py-4 font-black">Completed</th>
              <th className="px-5 py-4 font-black">Pending</th>
              <th className="px-5 py-4 font-black">Overdue</th>
              <th className="px-5 py-4 font-black">Avg Time</th>
              <th className="px-5 py-4 font-black">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {taskTypeRows.map((row) => (
              <tr key={row.type} className="transition hover:bg-slate-50">
                <td className="px-5 py-4 font-black text-slate-950">{row.type}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{row.total}</td>
                <td className="px-5 py-4 font-bold text-emerald-700">{row.completed}</td>
                <td className="px-5 py-4 font-bold text-amber-700">{row.pending}</td>
                <td className="px-5 py-4 font-bold text-rose-700">{row.overdue}</td>
                <td className="px-5 py-4 font-bold text-slate-700">{row.avgTime}</td>
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

const TaskInsightsPanel: React.FC = () => {
  const impactStyles: Record<TaskAlert["impact"], string> = {
    high: "border-rose-200 bg-rose-50 text-rose-700",
    medium: "border-amber-200 bg-amber-50 text-amber-700",
    low: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-black text-slate-950">Task AI Insights</h3>
        <p className="mt-1 text-sm text-slate-500">Action points to improve follow-up discipline and task closure.</p>
      </div>

      <div className="space-y-4">
        {taskAlerts.map((alert) => (
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
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl">✅</div>
      <h3 className="text-lg font-black text-slate-950">No task analytics found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Add tasks with owners, due dates, priority and status to unlock full productivity analytics.
      </p>
    </div>
  );
};

const TaskAnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [segment, setSegment] = useState<TaskSegment>("all");
  const [isLoading] = useState(false);
  const [hasError] = useState(false);

  const selectedSummary = useMemo(() => {
    const rangeLabel = DATE_RANGE_OPTIONS.find((item) => item.value === dateRange)?.label ?? "Selected Period";
    const segmentLabel = TASK_SEGMENT_OPTIONS.find((item) => item.value === segment)?.label ?? "All Tasks";
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
            <h2 className="text-xl font-black text-rose-900">Unable to load task analytics</h2>
            <p className="mt-2 text-sm text-rose-700">Please check task API, analytics transformer, or CRM productivity data connection.</p>
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
            <p className="mt-1 text-xs font-semibold text-slate-500">Created, completed, pending, overdue, owner and category-level task intelligence.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-700">126 Overdue</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">Payment Tasks Risk</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">Live Task Data</span>
          </div>
        </div>

        <KpiGrid />

        {taskTrendData.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid gap-5 xl:grid-cols-2">
              <ChartCard title="Task Created vs Completed" subtitle="Task creation and completion movement over time.">
                <TaskTrendChart />
              </ChartCard>

              <ChartCard title="Completion Rate Trend" subtitle="Monthly task completion percentage movement.">
                <CompletionRateChart />
              </ChartCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              <ChartCard title="Pending vs Overdue" subtitle="Operational backlog and delay pressure.">
                <OverduePendingChart />
              </ChartCard>

              <ChartCard title="Priority Split" subtitle="High, medium and low priority workload.">
                <PrioritySplitChart />
              </ChartCard>

              <ChartCard title="Status Split" subtitle="Completed, pending and overdue share.">
                <StatusSplitChart />
              </ChartCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <TaskCategoryPanel />
              <TaskInsightsPanel />
            </div>

            <TaskOwnerTable />

            <TaskTypeTable />
          </>
        )}
      </div>
    </div>
  );
};

export default TaskAnalyticsPage;
