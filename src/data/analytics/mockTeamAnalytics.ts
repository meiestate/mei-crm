// src/features/analytics/data/mockTeamAnalytics.ts

export type TeamTrendDirection = 'up' | 'down' | 'neutral';
export type TeamPerformanceLevel = 'excellent' | 'good' | 'average' | 'needs_attention';
export type TeamAttendanceStatus = 'present' | 'leave' | 'remote' | 'half_day';

export interface TeamTrend {
  value: string;
  direction: TeamTrendDirection;
  label: string;
}

export interface TeamAnalyticsSummary {
  totalMembers: number;
  activeMembers: number;
  totalLeadsHandled: number;
  totalDealsClosed: number;
  totalRevenueGenerated: number;
  avgResponseTimeMinutes: number;
  avgFollowUpCompletionRate: number;
  avgProductivityScore: number;
}

export interface TeamMetricCard {
  id: string;
  key: string;
  title: string;
  value: string;
  rawValue: number;
  description: string;
  icon: string;
  colorScheme:
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral';
  trend: TeamTrend;
  updatedAt: string;
  target?: number;
  progress?: number;
  isHighlighted?: boolean;
}

export interface TeamPerformanceItem {
  id: string;
  memberName: string;
  role: string;
  region: string;
  leadsHandled: number;
  qualifiedLeads: number;
  siteVisits: number;
  dealsClosed: number;
  revenueGenerated: number;
  followUpCompletionRate: number;
  avgResponseTimeMinutes: number;
  productivityScore: number;
  performanceLevel: TeamPerformanceLevel;
}

export interface TeamTrendPoint {
  id: string;
  label: string;
  date: string;
  activeMembers: number;
  leadsHandled: number;
  dealsClosed: number;
  revenueGenerated: number;
  avgProductivityScore: number;
}

export interface TeamRegionPerformance {
  id: string;
  region: string;
  memberCount: number;
  leadsHandled: number;
  dealsClosed: number;
  revenueGenerated: number;
  avgProductivityScore: number;
  avgResponseTimeMinutes: number;
}

export interface TeamRoleDistribution {
  id: string;
  role: string;
  count: number;
  percentage: number;
  colorToken: string;
}

export interface TeamAttendanceItem {
  id: string;
  memberName: string;
  role: string;
  region: string;
  status: TeamAttendanceStatus;
  todayTasks: number;
  completedTasks: number;
  pendingTasks: number;
  checkInTime?: string;
}

export interface TeamLeaderboardItem {
  id: string;
  memberName: string;
  role: string;
  revenueGenerated: number;
  dealsClosed: number;
  productivityScore: number;
  rank: number;
}

export interface TeamInsight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'warning' | 'critical' | 'neutral';
  recommendation: string;
}

export interface TeamAnalyticsDataset {
  summary: TeamAnalyticsSummary;
  metricCards: TeamMetricCard[];
  performance: TeamPerformanceItem[];
  trend: TeamTrendPoint[];
  regionPerformance: TeamRegionPerformance[];
  roleDistribution: TeamRoleDistribution[];
  attendance: TeamAttendanceItem[];
  leaderboard: TeamLeaderboardItem[];
  insights: TeamInsight[];
}

export const teamAnalyticsSummary: TeamAnalyticsSummary = {
  totalMembers: 28,
  activeMembers: 24,
  totalLeadsHandled: 2684,
  totalDealsClosed: 178,
  totalRevenueGenerated: 70200000,
  avgResponseTimeMinutes: 26,
  avgFollowUpCompletionRate: 84.6,
  avgProductivityScore: 78.9,
};

export const teamMetricCards: TeamMetricCard[] = [
  {
    id: 'team-total-members',
    key: 'totalMembers',
    title: 'Total Members',
    value: '28',
    rawValue: 28,
    description: 'Total number of team members across sales, operations, and support roles.',
    icon: 'users',
    colorScheme: 'primary',
    trend: {
      value: '+3',
      direction: 'up',
      label: 'team expanded',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 30,
    progress: 93,
  },
  {
    id: 'team-active-members',
    key: 'activeMembers',
    title: 'Active Members',
    value: '24',
    rawValue: 24,
    description: 'Members actively contributing to leads, follow-ups, and closures this cycle.',
    icon: 'user-check',
    colorScheme: 'success',
    trend: {
      value: '+2',
      direction: 'up',
      label: 'better active participation',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 26,
    progress: 92,
    isHighlighted: true,
  },
  {
    id: 'team-leads-handled',
    key: 'totalLeadsHandled',
    title: 'Leads Handled',
    value: '2,684',
    rawValue: 2684,
    description: 'Total leads worked by the team across all channels and regions.',
    icon: 'contact-round',
    colorScheme: 'info',
    trend: {
      value: '+11.8%',
      direction: 'up',
      label: 'higher workload coverage',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 3000,
    progress: 89,
    isHighlighted: true,
  },
  {
    id: 'team-deals-closed',
    key: 'totalDealsClosed',
    title: 'Deals Closed',
    value: '178',
    rawValue: 178,
    description: 'Closed-won opportunities driven by the team this reporting period.',
    icon: 'badge-indian-rupee',
    colorScheme: 'warning',
    trend: {
      value: '+9.9%',
      direction: 'up',
      label: 'closing output improved',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 200,
    progress: 89,
    isHighlighted: true,
  },
  {
    id: 'team-response-time',
    key: 'avgResponseTimeMinutes',
    title: 'Avg Response Time',
    value: '26 Min',
    rawValue: 26,
    description: 'Average time taken by the team to respond to lead activity or task triggers.',
    icon: 'clock-3',
    colorScheme: 'danger',
    trend: {
      value: '-5 min',
      direction: 'down',
      label: 'faster first response',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 20,
    progress: 77,
  },
  {
    id: 'team-productivity',
    key: 'avgProductivityScore',
    title: 'Avg Productivity',
    value: '78.9',
    rawValue: 78.9,
    description: 'Composite productivity score based on activity quality, follow-up, and outcomes.',
    icon: 'gauge',
    colorScheme: 'neutral',
    trend: {
      value: '+4.1 pts',
      direction: 'up',
      label: 'stronger execution rhythm',
    },
    updatedAt: '2026-04-17T09:00:00.000Z',
    target: 85,
    progress: 93,
  },
];

export const mockTeamPerformance: TeamPerformanceItem[] = [
  {
    id: 'member-001',
    memberName: 'Ravi Shankar',
    role: 'Senior Sales Manager',
    region: 'Whitefield',
    leadsHandled: 226,
    qualifiedLeads: 118,
    siteVisits: 52,
    dealsClosed: 23,
    revenueGenerated: 15400000,
    followUpCompletionRate: 91.2,
    avgResponseTimeMinutes: 18,
    productivityScore: 92.4,
    performanceLevel: 'excellent',
  },
  {
    id: 'member-002',
    memberName: 'Divya Narayan',
    role: 'Sales Manager',
    region: 'Sarjapur',
    leadsHandled: 214,
    qualifiedLeads: 110,
    siteVisits: 47,
    dealsClosed: 21,
    revenueGenerated: 14100000,
    followUpCompletionRate: 89.6,
    avgResponseTimeMinutes: 21,
    productivityScore: 89.1,
    performanceLevel: 'excellent',
  },
  {
    id: 'member-003',
    memberName: 'Karthik R',
    role: 'Relationship Manager',
    region: 'Varthur',
    leadsHandled: 198,
    qualifiedLeads: 102,
    siteVisits: 43,
    dealsClosed: 18,
    revenueGenerated: 11800000,
    followUpCompletionRate: 86.4,
    avgResponseTimeMinutes: 24,
    productivityScore: 84.7,
    performanceLevel: 'good',
  },
  {
    id: 'member-004',
    memberName: 'Asha Menon',
    role: 'Closing Specialist',
    region: 'Hebbal',
    leadsHandled: 176,
    qualifiedLeads: 94,
    siteVisits: 38,
    dealsClosed: 16,
    revenueGenerated: 10200000,
    followUpCompletionRate: 84.2,
    avgResponseTimeMinutes: 27,
    productivityScore: 81.5,
    performanceLevel: 'good',
  },
  {
    id: 'member-005',
    memberName: 'Vignesh Kumar',
    role: 'Sales Executive',
    region: 'Electronic City',
    leadsHandled: 168,
    qualifiedLeads: 82,
    siteVisits: 31,
    dealsClosed: 12,
    revenueGenerated: 8700000,
    followUpCompletionRate: 78.1,
    avgResponseTimeMinutes: 31,
    productivityScore: 73.8,
    performanceLevel: 'average',
  },
  {
    id: 'member-006',
    memberName: 'Sanjana Iyer',
    role: 'Inside Sales Executive',
    region: 'Begur Road',
    leadsHandled: 154,
    qualifiedLeads: 76,
    siteVisits: 24,
    dealsClosed: 10,
    revenueGenerated: 6400000,
    followUpCompletionRate: 76.9,
    avgResponseTimeMinutes: 34,
    productivityScore: 70.6,
    performanceLevel: 'average',
  },
  {
    id: 'member-007',
    memberName: 'Pradeep N',
    role: 'Lead Coordinator',
    region: 'HSR Layout',
    leadsHandled: 182,
    qualifiedLeads: 88,
    siteVisits: 19,
    dealsClosed: 8,
    revenueGenerated: 4200000,
    followUpCompletionRate: 82.4,
    avgResponseTimeMinutes: 22,
    productivityScore: 76.3,
    performanceLevel: 'good',
  },
  {
    id: 'member-008',
    memberName: 'Meera Krishnan',
    role: 'Customer Success Executive',
    region: 'Koramangala',
    leadsHandled: 136,
    qualifiedLeads: 64,
    siteVisits: 17,
    dealsClosed: 7,
    revenueGenerated: 3600000,
    followUpCompletionRate: 88.7,
    avgResponseTimeMinutes: 20,
    productivityScore: 80.2,
    performanceLevel: 'good',
  },
];

export const mockTeamTrend: TeamTrendPoint[] = [
  {
    id: 'team-jan-2026',
    label: 'Jan',
    date: '2026-01',
    activeMembers: 21,
    leadsHandled: 2140,
    dealsClosed: 148,
    revenueGenerated: 58400000,
    avgProductivityScore: 72.1,
  },
  {
    id: 'team-feb-2026',
    label: 'Feb',
    date: '2026-02',
    activeMembers: 22,
    leadsHandled: 2290,
    dealsClosed: 156,
    revenueGenerated: 62100000,
    avgProductivityScore: 74.8,
  },
  {
    id: 'team-mar-2026',
    label: 'Mar',
    date: '2026-03',
    activeMembers: 23,
    leadsHandled: 2476,
    dealsClosed: 167,
    revenueGenerated: 66800000,
    avgProductivityScore: 77.2,
  },
  {
    id: 'team-apr-2026',
    label: 'Apr',
    date: '2026-04',
    activeMembers: 24,
    leadsHandled: 2684,
    dealsClosed: 178,
    revenueGenerated: 70200000,
    avgProductivityScore: 78.9,
  },
];

export const mockTeamRegionPerformance: TeamRegionPerformance[] = [
  {
    id: 'region-001',
    region: 'Whitefield',
    memberCount: 5,
    leadsHandled: 486,
    dealsClosed: 34,
    revenueGenerated: 18200000,
    avgProductivityScore: 86.4,
    avgResponseTimeMinutes: 19,
  },
  {
    id: 'region-002',
    region: 'Sarjapur',
    memberCount: 4,
    leadsHandled: 412,
    dealsClosed: 28,
    revenueGenerated: 14900000,
    avgProductivityScore: 83.8,
    avgResponseTimeMinutes: 21,
  },
  {
    id: 'region-003',
    region: 'Varthur',
    memberCount: 3,
    leadsHandled: 298,
    dealsClosed: 21,
    revenueGenerated: 9600000,
    avgProductivityScore: 79.4,
    avgResponseTimeMinutes: 24,
  },
  {
    id: 'region-004',
    region: 'Hebbal',
    memberCount: 3,
    leadsHandled: 264,
    dealsClosed: 18,
    revenueGenerated: 8100000,
    avgProductivityScore: 78.1,
    avgResponseTimeMinutes: 26,
  },
  {
    id: 'region-005',
    region: 'HSR Layout',
    memberCount: 3,
    leadsHandled: 276,
    dealsClosed: 17,
    revenueGenerated: 7200000,
    avgProductivityScore: 77.3,
    avgResponseTimeMinutes: 23,
  },
  {
    id: 'region-006',
    region: 'Electronic City',
    memberCount: 4,
    leadsHandled: 354,
    dealsClosed: 15,
    revenueGenerated: 6400000,
    avgProductivityScore: 71.6,
    avgResponseTimeMinutes: 32,
  },
  {
    id: 'region-007',
    region: 'Begur Road',
    memberCount: 3,
    leadsHandled: 282,
    dealsClosed: 13,
    revenueGenerated: 5100000,
    avgProductivityScore: 69.8,
    avgResponseTimeMinutes: 34,
  },
  {
    id: 'region-008',
    region: 'Koramangala',
    memberCount: 3,
    leadsHandled: 312,
    dealsClosed: 14,
    revenueGenerated: 6700000,
    avgProductivityScore: 75.2,
    avgResponseTimeMinutes: 25,
  },
];

export const mockTeamRoleDistribution: TeamRoleDistribution[] = [
  {
    id: 'role-001',
    role: 'Sales Manager',
    count: 4,
    percentage: 14.3,
    colorToken: 'chart-blue',
  },
  {
    id: 'role-002',
    role: 'Sales Executive',
    count: 8,
    percentage: 28.6,
    colorToken: 'chart-cyan',
  },
  {
    id: 'role-003',
    role: 'Relationship Manager',
    count: 5,
    percentage: 17.9,
    colorToken: 'chart-green',
  },
  {
    id: 'role-004',
    role: 'Inside Sales Executive',
    count: 4,
    percentage: 14.3,
    colorToken: 'chart-amber',
  },
  {
    id: 'role-005',
    role: 'Closing Specialist',
    count: 3,
    percentage: 10.7,
    colorToken: 'chart-purple',
  },
  {
    id: 'role-006',
    role: 'Lead Coordinator',
    count: 2,
    percentage: 7.1,
    colorToken: 'chart-orange',
  },
  {
    id: 'role-007',
    role: 'Customer Success Executive',
    count: 2,
    percentage: 7.1,
    colorToken: 'chart-pink',
  },
];

export const mockTeamAttendance: TeamAttendanceItem[] = [
  {
    id: 'att-001',
    memberName: 'Ravi Shankar',
    role: 'Senior Sales Manager',
    region: 'Whitefield',
    status: 'present',
    todayTasks: 12,
    completedTasks: 8,
    pendingTasks: 4,
    checkInTime: '2026-04-17T08:48:00.000Z',
  },
  {
    id: 'att-002',
    memberName: 'Divya Narayan',
    role: 'Sales Manager',
    region: 'Sarjapur',
    status: 'present',
    todayTasks: 11,
    completedTasks: 7,
    pendingTasks: 4,
    checkInTime: '2026-04-17T08:55:00.000Z',
  },
  {
    id: 'att-003',
    memberName: 'Karthik R',
    role: 'Relationship Manager',
    region: 'Varthur',
    status: 'remote',
    todayTasks: 10,
    completedTasks: 6,
    pendingTasks: 4,
    checkInTime: '2026-04-17T09:04:00.000Z',
  },
  {
    id: 'att-004',
    memberName: 'Asha Menon',
    role: 'Closing Specialist',
    region: 'Hebbal',
    status: 'present',
    todayTasks: 9,
    completedTasks: 5,
    pendingTasks: 4,
    checkInTime: '2026-04-17T08:51:00.000Z',
  },
  {
    id: 'att-005',
    memberName: 'Vignesh Kumar',
    role: 'Sales Executive',
    region: 'Electronic City',
    status: 'present',
    todayTasks: 13,
    completedTasks: 6,
    pendingTasks: 7,
    checkInTime: '2026-04-17T09:11:00.000Z',
  },
  {
    id: 'att-006',
    memberName: 'Sanjana Iyer',
    role: 'Inside Sales Executive',
    region: 'Begur Road',
    status: 'half_day',
    todayTasks: 8,
    completedTasks: 3,
    pendingTasks: 5,
    checkInTime: '2026-04-17T09:26:00.000Z',
  },
  {
    id: 'att-007',
    memberName: 'Pradeep N',
    role: 'Lead Coordinator',
    region: 'HSR Layout',
    status: 'leave',
    todayTasks: 6,
    completedTasks: 0,
    pendingTasks: 6,
  },
  {
    id: 'att-008',
    memberName: 'Meera Krishnan',
    role: 'Customer Success Executive',
    region: 'Koramangala',
    status: 'remote',
    todayTasks: 7,
    completedTasks: 4,
    pendingTasks: 3,
    checkInTime: '2026-04-17T08:59:00.000Z',
  },
];

export const mockTeamLeaderboard: TeamLeaderboardItem[] = [
  {
    id: 'leader-001',
    memberName: 'Ravi Shankar',
    role: 'Senior Sales Manager',
    revenueGenerated: 15400000,
    dealsClosed: 23,
    productivityScore: 92.4,
    rank: 1,
  },
  {
    id: 'leader-002',
    memberName: 'Divya Narayan',
    role: 'Sales Manager',
    revenueGenerated: 14100000,
    dealsClosed: 21,
    productivityScore: 89.1,
    rank: 2,
  },
  {
    id: 'leader-003',
    memberName: 'Karthik R',
    role: 'Relationship Manager',
    revenueGenerated: 11800000,
    dealsClosed: 18,
    productivityScore: 84.7,
    rank: 3,
  },
  {
    id: 'leader-004',
    memberName: 'Asha Menon',
    role: 'Closing Specialist',
    revenueGenerated: 10200000,
    dealsClosed: 16,
    productivityScore: 81.5,
    rank: 4,
  },
  {
    id: 'leader-005',
    memberName: 'Vignesh Kumar',
    role: 'Sales Executive',
    revenueGenerated: 8700000,
    dealsClosed: 12,
    productivityScore: 73.8,
    rank: 5,
  },
];

export const mockTeamInsights: TeamInsight[] = [
  {
    id: 'insight-001',
    title: 'Top-performing regions are being carried by a few strong operators',
    description:
      'Whitefield and Sarjapur continue to lead output, with a small number of high-performing members driving outsized revenue.',
    impact: 'positive',
    recommendation:
      'Capture winning workflows from top performers and standardize them into team playbooks.',
  },
  {
    id: 'insight-002',
    title: 'Response time is improving, but weaker zones still lag',
    description:
      'Electronic City and Begur Road show slower response speeds and lower productivity compared with the rest of the network.',
    impact: 'warning',
    recommendation:
      'Introduce stricter response SLAs, queue balancing, and coaching support in lower-performing zones.',
  },
  {
    id: 'insight-003',
    title: 'Follow-up discipline is the hidden multiplier',
    description:
      'Members with stronger follow-up completion rates consistently produce better closure and revenue outcomes.',
    impact: 'neutral',
    recommendation:
      'Track follow-up completion daily and reward consistency, not just final closures.',
  },
  {
    id: 'insight-004',
    title: 'Team structure is healthy enough to scale',
    description:
      'Role distribution is balanced and active-member participation is strong, giving the business a solid operating base.',
    impact: 'positive',
    recommendation:
      'Add mid-level support and leadership layers before the next major regional expansion.',
  },
];

export const mockTeamAnalytics: TeamAnalyticsDataset = {
  summary: teamAnalyticsSummary,
  metricCards: teamMetricCards,
  performance: mockTeamPerformance,
  trend: mockTeamTrend,
  regionPerformance: mockTeamRegionPerformance,
  roleDistribution: mockTeamRoleDistribution,
  attendance: mockTeamAttendance,
  leaderboard: mockTeamLeaderboard,
  insights: mockTeamInsights,
};

export const teamMetricMap = teamMetricCards.reduce<
  Record<string, TeamMetricCard>
>((acc, metric) => {
  acc[metric.key] = metric;
  return acc;
}, {});

export const getTeamMetricByKey = (
  key: TeamMetricCard['key'],
): TeamMetricCard | undefined => {
  return teamMetricMap[key];
};

export const highlightedTeamMetrics = teamMetricCards.filter(
  (metric) => metric.isHighlighted,
);

export const topTeamPerformers = [...mockTeamPerformance]
  .sort((a, b) => b.productivityScore - a.productivityScore)
  .slice(0, 5);

export const activeAttendanceMembers = mockTeamAttendance.filter(
  (member) => member.status === 'present' || member.status === 'remote',
);

export default mockTeamAnalytics;