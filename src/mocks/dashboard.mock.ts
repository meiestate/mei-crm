// src/mocks/dashboard.mock.ts

export type DashboardTrendDirection = "up" | "down" | "neutral";

export interface DashboardKpiCard {
  id: string;
  key:
    | "total_leads"
    | "active_contacts"
    | "open_deals"
    | "closed_revenue"
    | "pending_followups"
    | "site_visits";
  title: string;
  value: string;
  rawValue: number;
  change: string;
  changeValue: number;
  trend: DashboardTrendDirection;
  description: string;
  accent: "primary" | "success" | "warning" | "danger" | "info";
}

export interface DashboardPipelineStage {
  id: string;
  name: string;
  count: number;
  value: number;
  colorKey:
    | "new"
    | "contacted"
    | "qualified"
    | "site_visit"
    | "negotiation"
    | "won"
    | "lost";
}

export interface DashboardRevenuePoint {
  month: string;
  revenue: number;
  target: number;
  deals: number;
}

export interface DashboardLeadSourcePoint {
  source: string;
  count: number;
  percentage: number;
}

export interface DashboardTaskSummary {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

export interface DashboardRecentLead {
  id: string;
  name: string;
  phone: string;
  city: string;
  source: string;
  status: string;
  budget: string;
  assignedTo: string;
  createdAt: string;
}

export interface DashboardFollowUpItem {
  id: string;
  name: string;
  type: "call" | "meeting" | "site_visit" | "whatsapp" | "email";
  dueAt: string;
  assignedTo: string;
  priority: "low" | "medium" | "high" | "urgent";
  note: string;
}

export interface DashboardActivityItem {
  id: string;
  type:
    | "lead_created"
    | "deal_updated"
    | "task_completed"
    | "contact_added"
    | "note_added"
    | "site_visit";
  title: string;
  description: string;
  user: string;
  time: string;
}

export interface DashboardPerformer {
  id: string;
  name: string;
  role: string;
  dealsClosed: number;
  revenue: number;
  followUpsClosed: number;
  rating: number;
}

export interface DashboardFunnelStep {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

export interface DashboardReminder {
  id: string;
  title: string;
  datetime: string;
  category: "meeting" | "task" | "site_visit" | "call" | "payment";
  assignedTo: string;
}

export interface DashboardCityPerformance {
  city: string;
  leads: number;
  deals: number;
  revenue: number;
}

export interface DashboardMockData {
  generatedAt: string;
  kpis: DashboardKpiCard[];
  pipeline: DashboardPipelineStage[];
  revenueTrend: DashboardRevenuePoint[];
  leadSources: DashboardLeadSourcePoint[];
  taskSummary: DashboardTaskSummary;
  recentLeads: DashboardRecentLead[];
  followUpsToday: DashboardFollowUpItem[];
  recentActivities: DashboardActivityItem[];
  topPerformers: DashboardPerformer[];
  funnel: DashboardFunnelStep[];
  reminders: DashboardReminder[];
  cityPerformance: DashboardCityPerformance[];
}

const formatCurrencyShort = (value: number): string => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
};

export const dashboardKpisMock: DashboardKpiCard[] = [
  {
    id: "kpi_01",
    key: "total_leads",
    title: "Total Leads",
    value: "1,286",
    rawValue: 1286,
    change: "+12.4%",
    changeValue: 12.4,
    trend: "up",
    description: "Compared to last month",
    accent: "primary",
  },
  {
    id: "kpi_02",
    key: "active_contacts",
    title: "Active Contacts",
    value: "842",
    rawValue: 842,
    change: "+8.1%",
    changeValue: 8.1,
    trend: "up",
    description: "Engaged in the last 30 days",
    accent: "info",
  },
  {
    id: "kpi_03",
    key: "open_deals",
    title: "Open Deals",
    value: "74",
    rawValue: 74,
    change: "+6.5%",
    changeValue: 6.5,
    trend: "up",
    description: "Deals currently in pipeline",
    accent: "warning",
  },
  {
    id: "kpi_04",
    key: "closed_revenue",
    title: "Closed Revenue",
    value: formatCurrencyShort(48600000),
    rawValue: 48600000,
    change: "+18.7%",
    changeValue: 18.7,
    trend: "up",
    description: "Won deals this month",
    accent: "success",
  },
  {
    id: "kpi_05",
    key: "pending_followups",
    title: "Pending Follow-ups",
    value: "39",
    rawValue: 39,
    change: "-4.2%",
    changeValue: -4.2,
    trend: "down",
    description: "Needs attention today",
    accent: "danger",
  },
  {
    id: "kpi_06",
    key: "site_visits",
    title: "Site Visits",
    value: "27",
    rawValue: 27,
    change: "+9.8%",
    changeValue: 9.8,
    trend: "up",
    description: "Scheduled this week",
    accent: "primary",
  },
];

export const dashboardPipelineMock: DashboardPipelineStage[] = [
  {
    id: "pipe_01",
    name: "New",
    count: 214,
    value: 0,
    colorKey: "new",
  },
  {
    id: "pipe_02",
    name: "Contacted",
    count: 176,
    value: 0,
    colorKey: "contacted",
  },
  {
    id: "pipe_03",
    name: "Qualified",
    count: 124,
    value: 18200000,
    colorKey: "qualified",
  },
  {
    id: "pipe_04",
    name: "Site Visit",
    count: 63,
    value: 26700000,
    colorKey: "site_visit",
  },
  {
    id: "pipe_05",
    name: "Negotiation",
    count: 31,
    value: 38800000,
    colorKey: "negotiation",
  },
  {
    id: "pipe_06",
    name: "Won",
    count: 18,
    value: 48600000,
    colorKey: "won",
  },
  {
    id: "pipe_07",
    name: "Lost",
    count: 11,
    value: 9600000,
    colorKey: "lost",
  },
];

export const dashboardRevenueTrendMock: DashboardRevenuePoint[] = [
  { month: "Nov", revenue: 18200000, target: 20000000, deals: 9 },
  { month: "Dec", revenue: 22400000, target: 22000000, deals: 11 },
  { month: "Jan", revenue: 19600000, target: 25000000, deals: 10 },
  { month: "Feb", revenue: 27800000, target: 26000000, deals: 13 },
  { month: "Mar", revenue: 33200000, target: 30000000, deals: 15 },
  { month: "Apr", revenue: 48600000, target: 40000000, deals: 18 },
];

export const dashboardLeadSourcesMock: DashboardLeadSourcePoint[] = [
  { source: "Website", count: 312, percentage: 24.3 },
  { source: "WhatsApp", count: 256, percentage: 19.9 },
  { source: "Referral", count: 198, percentage: 15.4 },
  { source: "Instagram", count: 147, percentage: 11.4 },
  { source: "Facebook", count: 132, percentage: 10.3 },
  { source: "Broker Network", count: 121, percentage: 9.4 },
  { source: "Google Ads", count: 78, percentage: 6.1 },
  { source: "Walk In", count: 42, percentage: 3.2 },
];

export const dashboardTaskSummaryMock: DashboardTaskSummary = {
  total: 96,
  completed: 58,
  pending: 26,
  overdue: 12,
  completionRate: 60.4,
};

export const dashboardRecentLeadsMock: DashboardRecentLead[] = [
  {
    id: "lead_001",
    name: "Vignesh R",
    phone: "+91 9876500011",
    city: "Chennai",
    source: "Website",
    status: "New",
    budget: "₹65L - ₹80L",
    assignedTo: "Ravi Kumar",
    createdAt: "2026-04-15T05:45:00.000Z",
  },
  {
    id: "lead_002",
    name: "Ananya Shekar",
    phone: "+91 9876500012",
    city: "Bengaluru",
    source: "WhatsApp",
    status: "Qualified",
    budget: "₹1.1Cr - ₹1.4Cr",
    assignedTo: "Aravind P",
    createdAt: "2026-04-15T04:10:00.000Z",
  },
  {
    id: "lead_003",
    name: "Kishore Babu",
    phone: "+91 9876500013",
    city: "Coimbatore",
    source: "Referral",
    status: "Contacted",
    budget: "₹45L - ₹60L",
    assignedTo: "Meena S",
    createdAt: "2026-04-14T16:15:00.000Z",
  },
  {
    id: "lead_004",
    name: "Harini M",
    phone: "+91 9876500014",
    city: "Bengaluru",
    source: "Instagram",
    status: "Site Visit",
    budget: "₹90L - ₹1.2Cr",
    assignedTo: "Balaji K",
    createdAt: "2026-04-14T13:05:00.000Z",
  },
  {
    id: "lead_005",
    name: "Sathish Kumar",
    phone: "+91 9876500015",
    city: "Chennai",
    source: "Broker Network",
    status: "Negotiation",
    budget: "₹1.8Cr - ₹2.3Cr",
    assignedTo: "Ravi Kumar",
    createdAt: "2026-04-14T11:45:00.000Z",
  },
];

export const dashboardFollowUpsTodayMock: DashboardFollowUpItem[] = [
  {
    id: "follow_001",
    name: "Arjun Menon",
    type: "call",
    dueAt: "2026-04-15T07:30:00.000Z",
    assignedTo: "Ravi Kumar",
    priority: "high",
    note: "Confirm Whitefield site visit timing.",
  },
  {
    id: "follow_002",
    name: "Priya Natarajan",
    type: "meeting",
    dueAt: "2026-04-15T09:00:00.000Z",
    assignedTo: "Meena S",
    priority: "medium",
    note: "Seller pricing discussion for Anna Nagar flat.",
  },
  {
    id: "follow_003",
    name: "Rahul Shetty",
    type: "call",
    dueAt: "2026-04-15T10:00:00.000Z",
    assignedTo: "Aravind P",
    priority: "urgent",
    note: "Investor wants land appreciation numbers.",
  },
  {
    id: "follow_004",
    name: "Sneha Reddy",
    type: "whatsapp",
    dueAt: "2026-04-15T12:30:00.000Z",
    assignedTo: "Ravi Kumar",
    priority: "medium",
    note: "Send updated rental shortlist.",
  },
  {
    id: "follow_005",
    name: "Lakshmi Prasad",
    type: "meeting",
    dueAt: "2026-04-15T14:00:00.000Z",
    assignedTo: "Balaji K",
    priority: "high",
    note: "Campaign launch review with builder team.",
  },
];

export const dashboardActivitiesMock: DashboardActivityItem[] = [
  {
    id: "act_001",
    type: "lead_created",
    title: "New lead added",
    description: "Ananya Shekar was added from WhatsApp inquiry.",
    user: "Ravi Kumar",
    time: "10 mins ago",
  },
  {
    id: "act_002",
    type: "deal_updated",
    title: "Deal moved to negotiation",
    description: "Sathish Kumar luxury villa deal entered negotiation stage.",
    user: "Balaji K",
    time: "28 mins ago",
  },
  {
    id: "act_003",
    type: "task_completed",
    title: "Follow-up task completed",
    description: "Loan eligibility follow-up completed for Arjun Menon.",
    user: "Meena S",
    time: "46 mins ago",
  },
  {
    id: "act_004",
    type: "site_visit",
    title: "Site visit scheduled",
    description: "Whitefield apartment site visit scheduled for tomorrow.",
    user: "Aravind P",
    time: "1 hr ago",
  },
  {
    id: "act_005",
    type: "contact_added",
    title: "New contact created",
    description: "Builder contact added for OMR partnership inventory.",
    user: "Balaji K",
    time: "2 hrs ago",
  },
  {
    id: "act_006",
    type: "note_added",
    title: "Internal note added",
    description: "Added market comparison note for investor pitch deck.",
    user: "Ravi Kumar",
    time: "3 hrs ago",
  },
];

export const dashboardTopPerformersMock: DashboardPerformer[] = [
  {
    id: "perf_001",
    name: "Ravi Kumar",
    role: "Sales Manager",
    dealsClosed: 8,
    revenue: 18600000,
    followUpsClosed: 34,
    rating: 4.8,
  },
  {
    id: "perf_002",
    name: "Aravind P",
    role: "Senior Consultant",
    dealsClosed: 6,
    revenue: 14200000,
    followUpsClosed: 28,
    rating: 4.7,
  },
  {
    id: "perf_003",
    name: "Meena S",
    role: "Relationship Manager",
    dealsClosed: 5,
    revenue: 9800000,
    followUpsClosed: 25,
    rating: 4.6,
  },
  {
    id: "perf_004",
    name: "Balaji K",
    role: "Channel Partner Lead",
    dealsClosed: 4,
    revenue: 6000000,
    followUpsClosed: 19,
    rating: 4.5,
  },
];

export const dashboardFunnelMock: DashboardFunnelStep[] = [
  { id: "fun_01", name: "Leads", count: 1286, percentage: 100 },
  { id: "fun_02", name: "Contacted", count: 892, percentage: 69.4 },
  { id: "fun_03", name: "Qualified", count: 514, percentage: 40.0 },
  { id: "fun_04", name: "Site Visits", count: 198, percentage: 15.4 },
  { id: "fun_05", name: "Negotiation", count: 74, percentage: 5.8 },
  { id: "fun_06", name: "Won", count: 18, percentage: 1.4 },
];

export const dashboardRemindersMock: DashboardReminder[] = [
  {
    id: "rem_001",
    title: "Builder partnership review call",
    datetime: "2026-04-15T13:00:00.000Z",
    category: "meeting",
    assignedTo: "Balaji K",
  },
  {
    id: "rem_002",
    title: "Whitefield site visit",
    datetime: "2026-04-15T15:30:00.000Z",
    category: "site_visit",
    assignedTo: "Ravi Kumar",
  },
  {
    id: "rem_003",
    title: "Pending commission payout check",
    datetime: "2026-04-15T16:00:00.000Z",
    category: "payment",
    assignedTo: "Meena S",
  },
  {
    id: "rem_004",
    title: "Investor follow-up call",
    datetime: "2026-04-15T17:15:00.000Z",
    category: "call",
    assignedTo: "Aravind P",
  },
];

export const dashboardCityPerformanceMock: DashboardCityPerformance[] = [
  {
    city: "Bengaluru",
    leads: 486,
    deals: 28,
    revenue: 24800000,
  },
  {
    city: "Chennai",
    leads: 392,
    deals: 21,
    revenue: 16400000,
  },
  {
    city: "Coimbatore",
    leads: 184,
    deals: 9,
    revenue: 5200000,
  },
  {
    city: "Hyderabad",
    leads: 143,
    deals: 6,
    revenue: 3100000,
  },
  {
    city: "Madurai",
    leads: 81,
    deals: 3,
    revenue: 1100000,
  },
];

export const dashboardMock: DashboardMockData = {
  generatedAt: "2026-04-15T06:40:00.000Z",
  kpis: dashboardKpisMock,
  pipeline: dashboardPipelineMock,
  revenueTrend: dashboardRevenueTrendMock,
  leadSources: dashboardLeadSourcesMock,
  taskSummary: dashboardTaskSummaryMock,
  recentLeads: dashboardRecentLeadsMock,
  followUpsToday: dashboardFollowUpsTodayMock,
  recentActivities: dashboardActivitiesMock,
  topPerformers: dashboardTopPerformersMock,
  funnel: dashboardFunnelMock,
  reminders: dashboardRemindersMock,
  cityPerformance: dashboardCityPerformanceMock,
};

export const dashboardSummaryMock = {
  totalRevenue: dashboardRevenueTrendMock.reduce(
    (sum, item) => sum + item.revenue,
    0,
  ),
  totalDeals: dashboardRevenueTrendMock.reduce(
    (sum, item) => sum + item.deals,
    0,
  ),
  topSource:
    [...dashboardLeadSourcesMock].sort((a, b) => b.count - a.count)[0]?.source ??
    "Website",
  topCity:
    [...dashboardCityPerformanceMock].sort((a, b) => b.revenue - a.revenue)[0]
      ?.city ?? "Bengaluru",
};

export default dashboardMock;