// src/features/leads/types/leads.types.ts

export type LeadsApiMode = "auto" | "local" | "remote";

export type LeadStatus =
  | "new"
  | "open"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost"
  | "hot"
  | "warm"
  | "cold"
  | string;

export type LeadPriority = "low" | "medium" | "high" | "urgent" | string;

export type Lead = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  whatsapp?: string;
  company?: string;
  source?: string;
  owner?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  budget?: number;
  expectedValue?: number;
  interestType?: string;
  propertyType?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  followUpDate?: string;
  nextFollowUpDate?: string;
  tags?: string[];
  notes?: string;
  score?: number;
  temperature?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LeadActivityType =
  | "note"
  | "call"
  | "email"
  | "meeting"
  | "task"
  | "whatsapp"
  | "status_change"
  | "system"
  | string;

export type LeadActivity = {
  id: string;
  leadId: string;
  type: LeadActivityType;
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
  entityType?: string;
  entityId?: string;
};

export type LeadFilters = {
  search?: string;
  status?: string;
  owner?: string;
  source?: string;
  priority?: string;
  propertyType?: string;
  city?: string;
};

export type CreateLeadInput = {
  name: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  whatsapp?: string;
  company?: string;
  source?: string;
  owner?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  budget?: number;
  expectedValue?: number;
  interestType?: string;
  propertyType?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  followUpDate?: string;
  nextFollowUpDate?: string;
  tags?: string[];
  notes?: string;
  score?: number;
  temperature?: string;
};

export type UpdateLeadInput = Partial<CreateLeadInput>;

export type LeadListResponse = {
  items: Lead[];
  total: number;
};

export type LeadSourceSummary = {
  source: string;
  count: number;
};

export type LeadStatusSummary = {
  status: string;
  count: number;
};

export type LeadSortKey =
  | "name"
  | "status"
  | "priority"
  | "source"
  | "owner"
  | "budget"
  | "expectedValue"
  | "city"
  | "propertyType"
  | "followUpDate"
  | "updatedAt"
  | "createdAt";

export type LeadSortDirection = "asc" | "desc";

export type UseLeadsFilters = LeadFilters & {
  sortBy: LeadSortKey;
  sortDirection: LeadSortDirection;
};

export type UseLeadsOptions = {
  mode?: LeadsApiMode;
  autoLoad?: boolean;
  defaultPageSize?: number;
};

export type UseLeadsResult = {
  leads: Lead[];
  filteredLeads: Lead[];
  paginatedLeads: Lead[];
  sourceSummary: LeadSourceSummary[];
  statusSummary: LeadStatusSummary[];
  loading: boolean;
  summaryLoading: boolean;
  error: string | null;
  mode: LeadsApiMode;
  filters: UseLeadsFilters;
  selectedIds: string[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasSelection: boolean;
  allVisibleSelected: boolean;
  ownerOptions: string[];
  sourceOptions: string[];
  statusOptions: string[];
  priorityOptions: string[];
  propertyTypeOptions: string[];
  cityOptions: string[];
  totalBudget: number;
  totalExpectedValue: number;
  setFilters: (updates: Partial<UseLeadsFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  refresh: () => Promise<void>;
  refreshSummaries: () => Promise<void>;
  createLead: (
    input: CreateLeadInput,
    options?: { createdBy?: string }
  ) => Promise<Lead | null>;
  updateLead: (
    leadId: string,
    updates: UpdateLeadInput,
    options?: { updatedBy?: string }
  ) => Promise<Lead | null>;
  deleteLead: (leadId: string) => Promise<boolean>;
  deleteSelectedLeads: () => Promise<boolean>;
  toggleSelect: (leadId: string) => void;
  toggleSelectAllVisible: () => void;
  clearSelection: () => void;
  openLeadDetail: (leadId: string) => void;
};

export type UseLeadDetailOptions = {
  mode?: LeadsApiMode;
  autoLoad?: boolean;
};

export type UseLeadDetailResult = {
  leadId: string;
  lead: Lead | null;
  activities: LeadActivity[];
  loading: boolean;
  activityLoading: boolean;
  error: string | null;
  notFound: boolean;
  mode: LeadsApiMode;
  refresh: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  goBack: () => void;
  updateLead: (
    updates: UpdateLeadInput,
    options?: { updatedBy?: string }
  ) => Promise<Lead | null>;
  deleteLead: () => Promise<boolean>;
  addActivity: (
    input: Omit<LeadActivity, "id" | "leadId" | "createdAt"> & {
      createdAt?: string;
    }
  ) => Promise<LeadActivity | null>;
};

export type UseCreateLeadOptions = {
  mode?: LeadsApiMode;
  onSuccess?: (lead: Lead) => void;
};

export type UseCreateLeadResult = {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  clearState: () => void;
  createLead: (
    input: CreateLeadInput,
    options?: { createdBy?: string }
  ) => Promise<Lead | null>;
};

export type UpdateLeadStatusInput = {
  leadId: string;
  status: LeadStatus | string;
  note?: string;
  updatedBy?: string;
};

export type UseUpdateLeadStatusOptions = {
  mode?: LeadsApiMode;
  onSuccess?: (lead: Lead) => void;
  onActivityCreated?: (activity: LeadActivity) => void;
};

export type UseUpdateLeadStatusResult = {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  clearState: () => void;
  getSuggestedTemperature: (status: string) => string | undefined;
  getSuggestedScore: (status: string) => number | undefined;
  updateLeadStatus: (input: UpdateLeadStatusInput) => Promise<Lead | null>;
};

export type LeadStatusBadgeProps = {
  status?: LeadStatus | string;
  mode?: "light" | "dark";
  compact?: boolean;
};