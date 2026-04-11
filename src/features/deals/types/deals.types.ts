// src/features/deals/types/deals.types.ts

export type DealsApiMode = "auto" | "local" | "remote";

export type DealStatus =
  | "new"
  | "open"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost"
  | string;

export type DealPriority = "low" | "medium" | "high" | "urgent" | string;

export type Deal = {
  id: string;
  title: string;
  contactId?: string;
  contactName?: string;
  leadId?: string;
  leadName?: string;
  company?: string;
  value?: number;
  expectedValue?: number;
  currency?: string;
  status?: DealStatus;
  stage?: string;
  priority?: DealPriority;
  source?: string;
  owner?: string;
  probability?: number;
  expectedCloseDate?: string;
  tags?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DealActivityType =
  | "note"
  | "call"
  | "email"
  | "meeting"
  | "task"
  | "status_change"
  | "stage_change"
  | "system"
  | string;

export type DealActivity = {
  id: string;
  dealId: string;
  type: DealActivityType;
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
  entityType?: string;
  entityId?: string;
};

export type DealFilters = {
  search?: string;
  status?: string;
  stage?: string;
  owner?: string;
  source?: string;
  priority?: string;
};

export type CreateDealInput = {
  title: string;
  contactId?: string;
  contactName?: string;
  leadId?: string;
  leadName?: string;
  company?: string;
  value?: number;
  expectedValue?: number;
  currency?: string;
  status?: DealStatus;
  stage?: string;
  priority?: DealPriority;
  source?: string;
  owner?: string;
  probability?: number;
  expectedCloseDate?: string;
  tags?: string[];
  notes?: string;
};

export type UpdateDealInput = Partial<CreateDealInput>;

export type DealPipelineStageSummary = {
  stage: string;
  count: number;
  value: number;
};

export type DealListResponse = {
  items: Deal[];
  total: number;
};

export type DealSortKey =
  | "title"
  | "value"
  | "expectedValue"
  | "status"
  | "stage"
  | "owner"
  | "source"
  | "priority"
  | "expectedCloseDate"
  | "updatedAt"
  | "createdAt";

export type DealSortDirection = "asc" | "desc";

export type UseDealsFilters = DealFilters & {
  sortBy: DealSortKey;
  sortDirection: DealSortDirection;
};

export type UseDealsOptions = {
  mode?: DealsApiMode;
  autoLoad?: boolean;
  defaultPageSize?: number;
};

export type UseDealsResult = {
  deals: Deal[];
  filteredDeals: Deal[];
  paginatedDeals: Deal[];
  pipelineSummary: DealPipelineStageSummary[];
  loading: boolean;
  pipelineLoading: boolean;
  error: string | null;
  mode: DealsApiMode;
  filters: UseDealsFilters;
  selectedIds: string[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasSelection: boolean;
  allVisibleSelected: boolean;
  ownerOptions: string[];
  sourceOptions: string[];
  stageOptions: string[];
  statusOptions: string[];
  priorityOptions: string[];
  totalPipelineValue: number;
  setFilters: (updates: Partial<UseDealsFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  refresh: () => Promise<void>;
  refreshPipelineSummary: () => Promise<void>;
  createDeal: (
    input: CreateDealInput,
    options?: { createdBy?: string }
  ) => Promise<Deal | null>;
  updateDeal: (
    dealId: string,
    updates: UpdateDealInput,
    options?: { updatedBy?: string }
  ) => Promise<Deal | null>;
  deleteDeal: (dealId: string) => Promise<boolean>;
  deleteSelectedDeals: () => Promise<boolean>;
  toggleSelect: (dealId: string) => void;
  toggleSelectAllVisible: () => void;
  clearSelection: () => void;
  openDealDetail: (dealId: string) => void;
};

export type UseDealDetailOptions = {
  mode?: DealsApiMode;
  autoLoad?: boolean;
};

export type UseDealDetailResult = {
  dealId: string;
  deal: Deal | null;
  activities: DealActivity[];
  loading: boolean;
  activityLoading: boolean;
  error: string | null;
  notFound: boolean;
  mode: DealsApiMode;
  refresh: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  goBack: () => void;
  updateDeal: (
    updates: UpdateDealInput,
    options?: { updatedBy?: string }
  ) => Promise<Deal | null>;
  deleteDeal: () => Promise<boolean>;
  addActivity: (
    input: Omit<DealActivity, "id" | "dealId" | "createdAt"> & {
      createdAt?: string;
    }
  ) => Promise<DealActivity | null>;
};

export type MoveDealStageInput = {
  dealId: string;
  stage: string;
  status?: string;
  probability?: number;
  note?: string;
  updatedBy?: string;
};

export type UseMoveDealStageOptions = {
  mode?: DealsApiMode;
  onSuccess?: (deal: Deal) => void;
  onActivityCreated?: (activity: DealActivity) => void;
};

export type UseMoveDealStageResult = {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  clearState: () => void;
  getSuggestedStatus: (stage: string) => string;
  getSuggestedProbability: (stage: string) => number;
  moveDealStage: (input: MoveDealStageInput) => Promise<Deal | null>;
};

export type DealsKanbanStage = {
  key: string;
  title: string;
};

export type DealStageTrackerStage = {
  key: string;
  label: string;
  description?: string;
};

export type AddDealModalProps = {
  open: boolean;
  mode?: "light" | "dark";
  loading?: boolean;
  title?: string;
  ownerOptions?: string[];
  sourceOptions?: string[];
  contactOptions?: Array<{
    id: string;
    name: string;
  }>;
  leadOptions?: Array<{
    id: string;
    name: string;
  }>;
  defaultValues?: Partial<CreateDealInput>;
  onClose: () => void;
  onSubmit: (values: CreateDealInput) => void | Promise<void>;
};

export type DealCardProps = {
  deal: Deal;
  mode?: "light" | "dark";
  compact?: boolean;
  selected?: boolean;
  loading?: boolean;
  onClick?: (deal: Deal) => void;
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
};

export type DealColumnProps = {
  title: string;
  deals?: Deal[];
  mode?: "light" | "dark";
  loading?: boolean;
  stageKey?: string;
  emptyMessage?: string;
  totalValue?: number;
  onAddDeal?: (stageKey?: string) => void;
  onDealClick?: (deal: Deal) => void;
  onEditDeal?: (deal: Deal) => void;
  onDeleteDeal?: (deal: Deal) => void;
};

export type DealFiltersDrawerProps = {
  open: boolean;
  mode?: "light" | "dark";
  loading?: boolean;
  filters?: DealFilters;
  ownerOptions?: string[];
  sourceOptions?: string[];
  stageOptions?: string[];
  statusOptions?: string[];
  priorityOptions?: string[];
  onClose: () => void;
  onApply: (filters: DealFilters) => void;
  onReset?: () => void;
};

export type DealHeaderCardProps = {
  deal: Deal | null;
  mode?: "light" | "dark";
  loading?: boolean;
  onBack?: () => void;
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
  onChangeStage?: (deal: Deal) => void;
  onAddActivity?: (deal: Deal) => void;
};

export type DealOverviewCardProps = {
  deal: Deal | null;
  mode?: "light" | "dark";
  loading?: boolean;
  onEdit?: (deal: Deal) => void;
};

export type DealQuickActionsCardProps = {
  deal: Deal | null;
  mode?: "light" | "dark";
  loading?: boolean;
  onCallContact?: (deal: Deal) => void;
  onEmailContact?: (deal: Deal) => void;
  onScheduleMeeting?: (deal: Deal) => void;
  onAddTask?: (deal: Deal) => void;
  onAddNote?: (deal: Deal) => void;
  onChangeStage?: (deal: Deal) => void;
  onMarkWon?: (deal: Deal) => void;
  onMarkLost?: (deal: Deal) => void;
  onEditDeal?: (deal: Deal) => void;
  onDeleteDeal?: (deal: Deal) => void;
};

export type DealRiskFlagsCardProps = {
  deal: Deal | null;
  mode?: "light" | "dark";
  loading?: boolean;
  onResolveRisk?: (riskId: string, deal: Deal) => void;
};

export type DealActivityTimelineProps = {
  activities?: DealActivity[];
  mode?: "light" | "dark";
  loading?: boolean;
  title?: string;
  maxItems?: number;
  onAddNote?: () => void;
  onActivityClick?: (activity: DealActivity) => void;
};

export type DealsKanbanBoardProps = {
  deals?: Deal[];
  mode?: "light" | "dark";
  loading?: boolean;
  stages?: DealsKanbanStage[];
  minHeight?: number | string;
  onAddDeal?: (stageKey?: string) => void;
  onDealClick?: (deal: Deal) => void;
  onEditDeal?: (deal: Deal) => void;
  onDeleteDeal?: (deal: Deal) => void;
};

export type DealStageTrackerProps = {
  deal: Deal | null;
  mode?: "light" | "dark";
  loading?: boolean;
  stages?: DealStageTrackerStage[];
  onStageClick?: (stage: DealStageTrackerStage, deal: Deal) => void;
};