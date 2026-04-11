// src/features/dashboard/types/dashboard.types.ts

export type DashboardMode = "auto" | "local" | "remote";

export type DashboardKpiId =
  | "totalLeads"
  | "hotLeads"
  | "totalContacts"
  | "openDeals"
  | "wonDeals"
  | "pipelineValue"
  | "pendingTasks"
  | "todayFollowUps"
  | "overdueFollowUps";

export type DashboardTrend = "up" | "down" | "neutral";

export type DashboardKpi = {
  id: DashboardKpiId;
  label: string;
  value: number;
  change?: number;
  trend?: DashboardTrend;
  prefix?: string;
  suffix?: string;
};

export type DashboardPipelineStage = {
  stage: string;
  count: number;
  value: number;
};

export type DashboardLeadSourceItem = {
  source: string;
  count: number;
};

export type DashboardTaskItem = {
  id: string;
  title: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  owner?: string;
  relatedTo?: string;
};

export type DashboardActivityItem = {
  id: string;
  type: string;
  title: string;
  description?: string;
  createdAt: string;
  actor?: string;
  entityType?: string;
  entityId?: string;
};

export type DashboardRecentLeadItem = {
  id: string;
  name: string;
  phone?: string;
  status?: string;
  source?: string;
  budget?: number;
  followUpDate?: string;
  updatedAt?: string;
  owner?: string;
};

export type DashboardData = {
  kpis: DashboardKpi[];
  pipeline: DashboardPipelineStage[];
  leadSources: DashboardLeadSourceItem[];
  todayTasks: DashboardTaskItem[];
  recentActivities: DashboardActivityItem[];
  recentLeads: DashboardRecentLeadItem[];
  lastUpdatedAt: string;
};

export type UseDashboardDataOptions = {
  mode?: DashboardMode;
  autoLoad?: boolean;
};

export type UseDashboardDataResult = {
  data: DashboardData | null;
  kpis: DashboardKpi[];
  pipeline: DashboardPipelineStage[];
  leadSources: DashboardLeadSourceItem[];
  todayTasks: DashboardTaskItem[];
  recentActivities: DashboardActivityItem[];
  recentLeads: DashboardRecentLeadItem[];
  loading: boolean;
  error: string | null;
  mode: DashboardMode;
  lastUpdatedAt: string | null;
  refresh: () => Promise<void>;
  getKpiById: (id: DashboardKpi["id"]) => DashboardKpi | undefined;
  pipelineValue: number;
  openDealsCount: number;
  wonDealsCount: number;
  hotLeadsCount: number;
  pendingTasksCount: number;
  todayFollowUpsCount: number;
  overdueFollowUpsCount: number;
};

export type KPIStatCardProps = {
  item: DashboardKpi;
  mode?: "light" | "dark";
  loading?: boolean;
  onClick?: (item: DashboardKpi) => void;
};

export type PipelineSnapshotCardProps = {
  items?: DashboardPipelineStage[];
  mode?: "light" | "dark";
  loading?: boolean;
  title?: string;
  onViewAll?: () => void;
  onStageClick?: (stage: DashboardPipelineStage) => void;
};

export type LeadSourceCardProps = {
  items?: DashboardLeadSourceItem[];
  mode?: "light" | "dark";
  loading?: boolean;
  title?: string;
  onViewAll?: () => void;
  onSourceClick?: (item: DashboardLeadSourceItem) => void;
};

export type TodayTasksCardProps = {
  tasks?: DashboardTaskItem[];
  mode?: "light" | "dark";
  loading?: boolean;
  title?: string;
  onViewAll?: () => void;
  onTaskClick?: (task: DashboardTaskItem) => void;
};

export type RecentActivityFeedProps = {
  activities?: DashboardActivityItem[];
  mode?: "light" | "dark";
  loading?: boolean;
  title?: string;
  onViewAll?: () => void;
  onActivityClick?: (activity: DashboardActivityItem) => void;
};

export type HotLeadsCardProps = {
  leads?: DashboardRecentLeadItem[];
  mode?: "light" | "dark";
  loading?: boolean;
  title?: string;
  onViewAll?: () => void;
  onLeadClick?: (lead: DashboardRecentLeadItem) => void;
};