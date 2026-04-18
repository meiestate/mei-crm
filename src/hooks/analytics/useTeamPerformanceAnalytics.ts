import { useCallback, useEffect, useMemo, useState } from 'react';

export interface TeamPerformanceAnalyticsFilters {
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  teamIds?: string[];
  ownerIds?: string[];
  projectIds?: string[];
  sourceIds?: string[];
  locationIds?: string[];
  statuses?: string[];
  roles?: string[];
  tags?: string[];
  search?: string;
  [key: string]: unknown;
}

export interface TeamPerformanceComparePeriod {
  enabled: boolean;
  type?: 'previous_period' | 'previous_month' | 'previous_quarter' | 'previous_year' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface TeamPerformanceAnalyticsSummary {
  totalMembers: number;
  activeMembers: number;
  totalLeadsHandled: number;
  totalDealsWon: number;
  totalRevenue: number;
  averageWinRate: number;
  averageResponseTimeHours: number;
  averageProductivityScore: number;
  targetAchievementRate: number;
  followUpsCompleted: number;
}

export interface TeamPerformanceTrendPoint {
  period: string;
  revenue: number;
  dealsWon: number;
  leadsHandled: number;
  followUpsCompleted: number;
  averageWinRate: number;
  productivityScore: number;
}

export interface TeamMemberPerformanceItem {
  memberId: string;
  memberName: string;
  teamId: string;
  teamName: string;
  roleName: string;
  leadsHandled: number;
  qualifiedLeads: number;
  dealsWon: number;
  dealsLost: number;
  revenue: number;
  winRate: number;
  averageDealValue: number;
  responseTimeHours: number;
  followUpsCompleted: number;
  targetAchievementRate: number;
  productivityScore: number;
}

export interface TeamPerformanceBreakdownItem {
  teamId: string;
  teamName: string;
  totalMembers: number;
  activeMembers: number;
  leadsHandled: number;
  dealsWon: number;
  revenue: number;
  averageWinRate: number;
  targetAchievementRate: number;
  productivityScore: number;
}

export interface TeamTargetAchievementItem {
  label: string;
  targetValue: number;
  achievedValue: number;
  achievementRate: number;
  gap: number;
}

export interface TeamActivityDistributionItem {
  activityType: string;
  count: number;
  percentage: number;
}

export interface TeamLeaderboardItem {
  rank: number;
  memberId: string;
  memberName: string;
  teamName: string;
  revenue: number;
  dealsWon: number;
  winRate: number;
  productivityScore: number;
}

export interface TeamPerformanceAnalyticsData {
  summary: TeamPerformanceAnalyticsSummary;
  trend: TeamPerformanceTrendPoint[];
  teamBreakdown: TeamPerformanceBreakdownItem[];
  memberPerformance: TeamMemberPerformanceItem[];
  targetAchievement: TeamTargetAchievementItem[];
  activityDistribution: TeamActivityDistributionItem[];
  leaderboard: TeamLeaderboardItem[];
  generatedAt: string;
}

export interface UseTeamPerformanceAnalyticsOptions {
  endpoint?: string;
  initialFilters?: TeamPerformanceAnalyticsFilters;
  initialComparePeriod?: TeamPerformanceComparePeriod | null;
  enabled?: boolean;
  useMockOnError?: boolean;
  onSuccess?: (data: TeamPerformanceAnalyticsData) => void;
  onError?: (error: Error) => void;
}

export interface UseTeamPerformanceAnalyticsReturn {
  data: TeamPerformanceAnalyticsData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  filters: TeamPerformanceAnalyticsFilters;
  comparePeriod: TeamPerformanceComparePeriod | null;
  setFilters: (
    updater:
      | TeamPerformanceAnalyticsFilters
      | ((prev: TeamPerformanceAnalyticsFilters) => TeamPerformanceAnalyticsFilters)
  ) => void;
  setComparePeriod: (
    updater:
      | TeamPerformanceComparePeriod
      | null
      | ((prev: TeamPerformanceComparePeriod | null) => TeamPerformanceComparePeriod | null)
  ) => void;
  refetch: () => Promise<void>;
  reset: () => void;
}

interface TeamPerformanceAnalyticsApiResponse {
  data?: Partial<TeamPerformanceAnalyticsData>;
  summary?: Partial<TeamPerformanceAnalyticsSummary>;
  trend?: Partial<TeamPerformanceTrendPoint>[];
  teamBreakdown?: Partial<TeamPerformanceBreakdownItem>[];
  memberPerformance?: Partial<TeamMemberPerformanceItem>[];
  targetAchievement?: Partial<TeamTargetAchievementItem>[];
  activityDistribution?: Partial<TeamActivityDistributionItem>[];
  leaderboard?: Partial<TeamLeaderboardItem>[];
  generatedAt?: string;
}

const DEFAULT_TEAM_PERFORMANCE_SUMMARY: TeamPerformanceAnalyticsSummary = {
  totalMembers: 0,
  activeMembers: 0,
  totalLeadsHandled: 0,
  totalDealsWon: 0,
  totalRevenue: 0,
  averageWinRate: 0,
  averageResponseTimeHours: 0,
  averageProductivityScore: 0,
  targetAchievementRate: 0,
  followUpsCompleted: 0,
};

const createMockTeamPerformanceAnalytics = (): TeamPerformanceAnalyticsData => {
  return {
    summary: {
      totalMembers: 28,
      activeMembers: 24,
      totalLeadsHandled: 3240,
      totalDealsWon: 186,
      totalRevenue: 84200000,
      averageWinRate: 31.8,
      averageResponseTimeHours: 2.6,
      averageProductivityScore: 81.4,
      targetAchievementRate: 87.2,
      followUpsCompleted: 4120,
    },
    trend: [
      {
        period: 'Jan',
        revenue: 11800000,
        dealsWon: 24,
        leadsHandled: 462,
        followUpsCompleted: 612,
        averageWinRate: 29.2,
        productivityScore: 76,
      },
      {
        period: 'Feb',
        revenue: 12600000,
        dealsWon: 28,
        leadsHandled: 488,
        followUpsCompleted: 648,
        averageWinRate: 30.4,
        productivityScore: 78,
      },
      {
        period: 'Mar',
        revenue: 13100000,
        dealsWon: 29,
        leadsHandled: 516,
        followUpsCompleted: 674,
        averageWinRate: 31.1,
        productivityScore: 80,
      },
      {
        period: 'Apr',
        revenue: 13800000,
        dealsWon: 31,
        leadsHandled: 544,
        followUpsCompleted: 706,
        averageWinRate: 32.3,
        productivityScore: 82,
      },
      {
        period: 'May',
        revenue: 15400000,
        dealsWon: 35,
        leadsHandled: 586,
        followUpsCompleted: 730,
        averageWinRate: 33.8,
        productivityScore: 85,
      },
      {
        period: 'Jun',
        revenue: 17500000,
        dealsWon: 39,
        leadsHandled: 644,
        followUpsCompleted: 750,
        averageWinRate: 34.1,
        productivityScore: 87,
      },
    ],
    teamBreakdown: [
      {
        teamId: 'team-sales-east',
        teamName: 'Sales East',
        totalMembers: 8,
        activeMembers: 7,
        leadsHandled: 924,
        dealsWon: 56,
        revenue: 25400000,
        averageWinRate: 34.8,
        targetAchievementRate: 91.4,
        productivityScore: 86,
      },
      {
        teamId: 'team-sales-south',
        teamName: 'Sales South',
        totalMembers: 7,
        activeMembers: 6,
        leadsHandled: 802,
        dealsWon: 42,
        revenue: 17600000,
        averageWinRate: 28.9,
        targetAchievementRate: 82.1,
        productivityScore: 78,
      },
      {
        teamId: 'team-sales-north',
        teamName: 'Sales North',
        totalMembers: 6,
        activeMembers: 5,
        leadsHandled: 694,
        dealsWon: 38,
        revenue: 16100000,
        averageWinRate: 30.6,
        targetAchievementRate: 84.7,
        productivityScore: 79,
      },
      {
        teamId: 'team-sales-west',
        teamName: 'Sales West',
        totalMembers: 7,
        activeMembers: 6,
        leadsHandled: 820,
        dealsWon: 50,
        revenue: 25100000,
        averageWinRate: 33.1,
        targetAchievementRate: 89.3,
        productivityScore: 83,
      },
    ],
    memberPerformance: [
      {
        memberId: 'm1',
        memberName: 'Arun Kumar',
        teamId: 'team-sales-east',
        teamName: 'Sales East',
        roleName: 'Senior Sales Manager',
        leadsHandled: 184,
        qualifiedLeads: 88,
        dealsWon: 18,
        dealsLost: 10,
        revenue: 9200000,
        winRate: 36,
        averageDealValue: 511111.11,
        responseTimeHours: 1.9,
        followUpsCompleted: 284,
        targetAchievementRate: 94,
        productivityScore: 91,
      },
      {
        memberId: 'm2',
        memberName: 'Priya S',
        teamId: 'team-sales-west',
        teamName: 'Sales West',
        roleName: 'Sales Manager',
        leadsHandled: 172,
        qualifiedLeads: 76,
        dealsWon: 16,
        dealsLost: 9,
        revenue: 8100000,
        winRate: 34.04,
        averageDealValue: 506250,
        responseTimeHours: 2.2,
        followUpsCompleted: 266,
        targetAchievementRate: 88,
        productivityScore: 87,
      },
      {
        memberId: 'm3',
        memberName: 'Rohit Raj',
        teamId: 'team-sales-east',
        teamName: 'Sales East',
        roleName: 'Relationship Executive',
        leadsHandled: 168,
        qualifiedLeads: 72,
        dealsWon: 14,
        dealsLost: 11,
        revenue: 6200000,
        winRate: 29.79,
        averageDealValue: 442857.14,
        responseTimeHours: 2.8,
        followUpsCompleted: 238,
        targetAchievementRate: 83,
        productivityScore: 79,
      },
      {
        memberId: 'm4',
        memberName: 'Meena V',
        teamId: 'team-sales-south',
        teamName: 'Sales South',
        roleName: 'Sales Executive',
        leadsHandled: 156,
        qualifiedLeads: 68,
        dealsWon: 13,
        dealsLost: 8,
        revenue: 5900000,
        winRate: 31.71,
        averageDealValue: 453846.15,
        responseTimeHours: 2.5,
        followUpsCompleted: 244,
        targetAchievementRate: 86,
        productivityScore: 82,
      },
    ],
    targetAchievement: [
      {
        label: 'Jan',
        targetValue: 14000000,
        achievedValue: 11800000,
        achievementRate: 84.29,
        gap: 2200000,
      },
      {
        label: 'Feb',
        targetValue: 14500000,
        achievedValue: 12600000,
        achievementRate: 86.9,
        gap: 1900000,
      },
      {
        label: 'Mar',
        targetValue: 15000000,
        achievedValue: 13100000,
        achievementRate: 87.33,
        gap: 1900000,
      },
      {
        label: 'Apr',
        targetValue: 15500000,
        achievedValue: 13800000,
        achievementRate: 89.03,
        gap: 1700000,
      },
      {
        label: 'May',
        targetValue: 17000000,
        achievedValue: 15400000,
        achievementRate: 90.59,
        gap: 1600000,
      },
      {
        label: 'Jun',
        targetValue: 18500000,
        achievedValue: 17500000,
        achievementRate: 94.59,
        gap: 1000000,
      },
    ],
    activityDistribution: [
      {
        activityType: 'Calls',
        count: 1680,
        percentage: 40.78,
      },
      {
        activityType: 'Follow-ups',
        count: 1240,
        percentage: 30.1,
      },
      {
        activityType: 'Site Visits',
        count: 520,
        percentage: 12.62,
      },
      {
        activityType: 'Meetings',
        count: 368,
        percentage: 8.93,
      },
      {
        activityType: 'Closures',
        count: 312,
        percentage: 7.57,
      },
    ],
    leaderboard: [
      {
        rank: 1,
        memberId: 'm1',
        memberName: 'Arun Kumar',
        teamName: 'Sales East',
        revenue: 9200000,
        dealsWon: 18,
        winRate: 36,
        productivityScore: 91,
      },
      {
        rank: 2,
        memberId: 'm2',
        memberName: 'Priya S',
        teamName: 'Sales West',
        revenue: 8100000,
        dealsWon: 16,
        winRate: 34.04,
        productivityScore: 87,
      },
      {
        rank: 3,
        memberId: 'm3',
        memberName: 'Rohit Raj',
        teamName: 'Sales East',
        revenue: 6200000,
        dealsWon: 14,
        winRate: 29.79,
        productivityScore: 79,
      },
      {
        rank: 4,
        memberId: 'm4',
        memberName: 'Meena V',
        teamName: 'Sales South',
        revenue: 5900000,
        dealsWon: 13,
        winRate: 31.71,
        productivityScore: 82,
      },
    ],
    generatedAt: new Date().toISOString(),
  };
};

const normalizeSummary = (
  summary?: Partial<TeamPerformanceAnalyticsSummary>,
): TeamPerformanceAnalyticsSummary => {
  return {
    totalMembers: summary?.totalMembers ?? 0,
    activeMembers: summary?.activeMembers ?? 0,
    totalLeadsHandled: summary?.totalLeadsHandled ?? 0,
    totalDealsWon: summary?.totalDealsWon ?? 0,
    totalRevenue: summary?.totalRevenue ?? 0,
    averageWinRate: summary?.averageWinRate ?? 0,
    averageResponseTimeHours: summary?.averageResponseTimeHours ?? 0,
    averageProductivityScore: summary?.averageProductivityScore ?? 0,
    targetAchievementRate: summary?.targetAchievementRate ?? 0,
    followUpsCompleted: summary?.followUpsCompleted ?? 0,
  };
};

const normalizeTrend = (
  trend?: Partial<TeamPerformanceTrendPoint>[],
): TeamPerformanceTrendPoint[] => {
  if (!Array.isArray(trend)) {
    return [];
  }

  return trend.map((item, index) => ({
    period: item.period ?? `P${index + 1}`,
    revenue: item.revenue ?? 0,
    dealsWon: item.dealsWon ?? 0,
    leadsHandled: item.leadsHandled ?? 0,
    followUpsCompleted: item.followUpsCompleted ?? 0,
    averageWinRate: item.averageWinRate ?? 0,
    productivityScore: item.productivityScore ?? 0,
  }));
};

const normalizeTeamBreakdown = (
  teamBreakdown?: Partial<TeamPerformanceBreakdownItem>[],
): TeamPerformanceBreakdownItem[] => {
  if (!Array.isArray(teamBreakdown)) {
    return [];
  }

  return teamBreakdown.map((item, index) => ({
    teamId: item.teamId ?? `team-${index + 1}`,
    teamName: item.teamName ?? `Team ${index + 1}`,
    totalMembers: item.totalMembers ?? 0,
    activeMembers: item.activeMembers ?? 0,
    leadsHandled: item.leadsHandled ?? 0,
    dealsWon: item.dealsWon ?? 0,
    revenue: item.revenue ?? 0,
    averageWinRate: item.averageWinRate ?? 0,
    targetAchievementRate: item.targetAchievementRate ?? 0,
    productivityScore: item.productivityScore ?? 0,
  }));
};

const normalizeMemberPerformance = (
  memberPerformance?: Partial<TeamMemberPerformanceItem>[],
): TeamMemberPerformanceItem[] => {
  if (!Array.isArray(memberPerformance)) {
    return [];
  }

  return memberPerformance.map((item, index) => ({
    memberId: item.memberId ?? `member-${index + 1}`,
    memberName: item.memberName ?? `Member ${index + 1}`,
    teamId: item.teamId ?? `team-${index + 1}`,
    teamName: item.teamName ?? `Team ${index + 1}`,
    roleName: item.roleName ?? 'Team Member',
    leadsHandled: item.leadsHandled ?? 0,
    qualifiedLeads: item.qualifiedLeads ?? 0,
    dealsWon: item.dealsWon ?? 0,
    dealsLost: item.dealsLost ?? 0,
    revenue: item.revenue ?? 0,
    winRate: item.winRate ?? 0,
    averageDealValue: item.averageDealValue ?? 0,
    responseTimeHours: item.responseTimeHours ?? 0,
    followUpsCompleted: item.followUpsCompleted ?? 0,
    targetAchievementRate: item.targetAchievementRate ?? 0,
    productivityScore: item.productivityScore ?? 0,
  }));
};

const normalizeTargetAchievement = (
  targetAchievement?: Partial<TeamTargetAchievementItem>[],
): TeamTargetAchievementItem[] => {
  if (!Array.isArray(targetAchievement)) {
    return [];
  }

  return targetAchievement.map((item, index) => ({
    label: item.label ?? `Item ${index + 1}`,
    targetValue: item.targetValue ?? 0,
    achievedValue: item.achievedValue ?? 0,
    achievementRate: item.achievementRate ?? 0,
    gap: item.gap ?? 0,
  }));
};

const normalizeActivityDistribution = (
  activityDistribution?: Partial<TeamActivityDistributionItem>[],
): TeamActivityDistributionItem[] => {
  if (!Array.isArray(activityDistribution)) {
    return [];
  }

  return activityDistribution.map((item, index) => ({
    activityType: item.activityType ?? `Activity ${index + 1}`,
    count: item.count ?? 0,
    percentage: item.percentage ?? 0,
  }));
};

const normalizeLeaderboard = (
  leaderboard?: Partial<TeamLeaderboardItem>[],
): TeamLeaderboardItem[] => {
  if (!Array.isArray(leaderboard)) {
    return [];
  }

  return leaderboard.map((item, index) => ({
    rank: item.rank ?? index + 1,
    memberId: item.memberId ?? `member-${index + 1}`,
    memberName: item.memberName ?? `Member ${index + 1}`,
    teamName: item.teamName ?? `Team ${index + 1}`,
    revenue: item.revenue ?? 0,
    dealsWon: item.dealsWon ?? 0,
    winRate: item.winRate ?? 0,
    productivityScore: item.productivityScore ?? 0,
  }));
};

const normalizeTeamPerformanceAnalyticsResponse = (
  response: TeamPerformanceAnalyticsApiResponse | Partial<TeamPerformanceAnalyticsData>,
): TeamPerformanceAnalyticsData => {
  const nestedData =
    'data' in response && response.data ? response.data : response;

  return {
    summary: normalizeSummary(
      nestedData.summary ?? response.summary ?? DEFAULT_TEAM_PERFORMANCE_SUMMARY,
    ),
    trend: normalizeTrend(nestedData.trend ?? response.trend),
    teamBreakdown: normalizeTeamBreakdown(
      nestedData.teamBreakdown ?? response.teamBreakdown,
    ),
    memberPerformance: normalizeMemberPerformance(
      nestedData.memberPerformance ?? response.memberPerformance,
    ),
    targetAchievement: normalizeTargetAchievement(
      nestedData.targetAchievement ?? response.targetAchievement,
    ),
    activityDistribution: normalizeActivityDistribution(
      nestedData.activityDistribution ?? response.activityDistribution,
    ),
    leaderboard: normalizeLeaderboard(
      nestedData.leaderboard ?? response.leaderboard,
    ),
    generatedAt: nestedData.generatedAt ?? response.generatedAt ?? new Date().toISOString(),
  };
};

export const useTeamPerformanceAnalytics = (
  options: UseTeamPerformanceAnalyticsOptions = {},
): UseTeamPerformanceAnalyticsReturn => {
  const {
    endpoint = '/api/analytics/team-performance',
    initialFilters = {},
    initialComparePeriod = null,
    enabled = true,
    useMockOnError = false,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<TeamPerformanceAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] =
    useState<TeamPerformanceAnalyticsFilters>(initialFilters);
  const [comparePeriod, setComparePeriodState] =
    useState<TeamPerformanceComparePeriod | null>(initialComparePeriod);

  const setFilters = useCallback(
    (
      updater:
        | TeamPerformanceAnalyticsFilters
        | ((
            prev: TeamPerformanceAnalyticsFilters,
          ) => TeamPerformanceAnalyticsFilters),
    ) => {
      setFiltersState((prev) =>
        typeof updater === 'function' ? updater(prev) : updater,
      );
    },
    [],
  );

  const setComparePeriod = useCallback(
    (
      updater:
        | TeamPerformanceComparePeriod
        | null
        | ((
            prev: TeamPerformanceComparePeriod | null,
          ) => TeamPerformanceComparePeriod | null),
    ) => {
      setComparePeriodState((prev) =>
        typeof updater === 'function' ? updater(prev) : updater,
      );
    },
    [],
  );

  const fetchTeamPerformanceAnalytics = useCallback(
    async (refresh = false): Promise<void> => {
      if (!enabled) {
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            filters,
            comparePeriod,
          }),
        });

        if (!response.ok) {
          let message = `Failed to load team performance analytics. Status: ${response.status}`;

          try {
            const errorPayload = (await response.json()) as { message?: string };
            if (errorPayload?.message) {
              message = errorPayload.message;
            }
          } catch {
            // ignore parse error
          }

          throw new Error(message);
        }

        const json =
          (await response.json()) as
            | TeamPerformanceAnalyticsApiResponse
            | Partial<TeamPerformanceAnalyticsData>;

        const normalized = normalizeTeamPerformanceAnalyticsResponse(json);

        setData(normalized);
        onSuccess?.(normalized);
      } catch (err) {
        const resolvedError =
          err instanceof Error
            ? err
            : new Error('Failed to load team performance analytics.');

        if (useMockOnError) {
          const mockData = createMockTeamPerformanceAnalytics();
          setData(mockData);
          setError(null);
          onSuccess?.(mockData);
        } else {
          setError(resolvedError.message);
          onError?.(resolvedError);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [enabled, endpoint, filters, comparePeriod, onError, onSuccess, useMockOnError],
  );

  const refetch = useCallback(async () => {
    await fetchTeamPerformanceAnalytics(true);
  }, [fetchTeamPerformanceAnalytics]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsRefreshing(false);
    setFiltersState(initialFilters);
    setComparePeriodState(initialComparePeriod);
  }, [initialComparePeriod, initialFilters]);

  useEffect(() => {
    void fetchTeamPerformanceAnalytics(false);
  }, [fetchTeamPerformanceAnalytics]);

  return useMemo(
    () => ({
      data,
      isLoading,
      isRefreshing,
      error,
      filters,
      comparePeriod,
      setFilters,
      setComparePeriod,
      refetch,
      reset,
    }),
    [
      data,
      isLoading,
      isRefreshing,
      error,
      filters,
      comparePeriod,
      setFilters,
      setComparePeriod,
      refetch,
      reset,
    ],
  );
};

export default useTeamPerformanceAnalytics;