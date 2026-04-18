// src/features/dashboard/data/mockDashboardStats.ts

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface DashboardStatTrend {
  value: string;
  direction: TrendDirection;
  label: string;
}

export interface DashboardStatAction {
  label: string;
  href?: string;
  onClickKey?: string;
}

export interface DashboardStatItem {
  id: string;
  key: string;
  title: string;
  value: string;
  rawValue: number;
  prefix?: string;
  suffix?: string;
  description: string;
  icon: string;
  colorScheme:
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral';
  trend: DashboardStatTrend;
  action?: DashboardStatAction;
  progress?: number;
  target?: number;
  updatedAt: string;
  isHighlighted?: boolean;
}

export interface DashboardStatsSummary {
  totalLeads: number;
  activeDeals: number;
  totalRevenue: number;
  pendingFollowUps: number;
  overdueTasks: number;
  conversionRate: number;
}

export const dashboardStatsSummary: DashboardStatsSummary = {
  totalLeads: 1248,
  activeDeals: 86,
  totalRevenue: 28450000,
  pendingFollowUps: 42,
  overdueTasks: 11,
  conversionRate: 18.4,
};

export const mockDashboardStats: DashboardStatItem[] = [
  {
    id: 'stat-total-leads',
    key: 'totalLeads',
    title: 'Total Leads',
    value: '1,248',
    rawValue: 1248,
    description: 'All leads captured across website, campaigns, brokers, and referrals.',
    icon: 'users',
    colorScheme: 'primary',
    trend: {
      value: '+12.8%',
      direction: 'up',
      label: 'vs last month',
    },
    action: {
      label: 'View Leads',
      href: '/leads',
    },
    progress: 78,
    target: 1600,
    updatedAt: '2026-04-17T09:00:00.000Z',
    isHighlighted: true,
  },
  {
    id: 'stat-active-deals',
    key: 'activeDeals',
    title: 'Active Deals',
    value: '86',
    rawValue: 86,
    description: 'Deals currently moving through negotiation, documentation, or closing stages.',
    icon: 'briefcase',
    colorScheme: 'info',
    trend: {
      value: '+6.1%',
      direction: 'up',
      label: 'vs last week',
    },
    action: {
      label: 'Open Deals',
      href: '/deals',
    },
    progress: 64,
    target: 135,
    updatedAt: '2026-04-17T09:00:00.000Z',
  },
  {
    id: 'stat-revenue',
    key: 'totalRevenue',
    title: 'Revenue Closed',
    value: '₹2.85Cr',
    rawValue: 28450000,
    prefix: '₹',
    description: 'Closed revenue from completed property transactions and service fees.',
    icon: 'indian-rupee',
    colorScheme: 'success',
    trend: {
      value: '+18.3%',
      direction: 'up',
      label: 'vs previous quarter',
    },
    action: {
      label: 'Revenue Report',
      href: '/analytics',
    },
    progress: 71,
    target: 40000000,
    updatedAt: '2026-04-17T09:00:00.000Z',
    isHighlighted: true,
  },
  {
    id: 'stat-conversion-rate',
    key: 'conversionRate',
    title: 'Lead Conversion',
    value: '18.4%',
    rawValue: 18.4,
    suffix: '%',
    description: 'Percentage of leads successfully converted into deals.',
    icon: 'target',
    colorScheme: 'warning',
    trend: {
      value: '+2.4%',
      direction: 'up',
      label: 'improvement this month',
    },
    action: {
      label: 'View Funnel',
      href: '/analytics',
    },
    progress: 61,
    target: 30,
    updatedAt: '2026-04-17T09:00:00.000Z',
  },
  {
    id: 'stat-pending-followups',
    key: 'pendingFollowUps',
    title: 'Pending Follow-Ups',
    value: '42',
    rawValue: 42,
    description: 'Scheduled calls, site visit confirmations, and client callbacks awaiting action.',
    icon: 'phone-call',
    colorScheme: 'neutral',
    trend: {
      value: '-4.7%',
      direction: 'down',
      label: 'better than yesterday',
    },
    action: {
      label: 'View Tasks',
      href: '/tasks',
    },
    progress: 42,
    target: 100,
    updatedAt: '2026-04-17T09:00:00.000Z',
  },
  {
    id: 'stat-overdue-tasks',
    key: 'overdueTasks',
    title: 'Overdue Tasks',
    value: '11',
    rawValue: 11,
    description: 'Tasks not completed on time, including callbacks, follow-ups, and internal actions.',
    icon: 'alert-triangle',
    colorScheme: 'danger',
    trend: {
      value: '+3',
      direction: 'up',
      label: 'needs attention today',
    },
    action: {
      label: 'Resolve Now',
      href: '/tasks?filter=overdue',
    },
    progress: 22,
    target: 0,
    updatedAt: '2026-04-17T09:00:00.000Z',
    isHighlighted: true,
  },
];

export const dashboardStatMap = mockDashboardStats.reduce<
  Record<string, DashboardStatItem>
>((acc, stat) => {
  acc[stat.key] = stat;
  return acc;
}, {});

export const getDashboardStatByKey = (
  key: DashboardStatItem['key'],
): DashboardStatItem | undefined => {
  return dashboardStatMap[key];
};

export const highlightedDashboardStats = mockDashboardStats.filter(
  (stat) => stat.isHighlighted,
);

export const dashboardKpiOrder: string[] = [
  'totalLeads',
  'activeDeals',
  'totalRevenue',
  'conversionRate',
  'pendingFollowUps',
  'overdueTasks',
];

export default mockDashboardStats;