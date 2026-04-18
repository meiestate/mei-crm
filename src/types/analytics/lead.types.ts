export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal-sent"
  | "site-visit-scheduled"
  | "negotiation"
  | "converted"
  | "lost"
  | "junk";

export type LeadPriority = "low" | "medium" | "high" | "urgent";

export type LeadSource =
  | "website"
  | "facebook"
  | "instagram"
  | "google-ads"
  | "whatsapp"
  | "sms"
  | "call"
  | "walk-in"
  | "referral"
  | "broker"
  | "campaign"
  | "manual"
  | "other";

export type LeadTemperature = "cold" | "warm" | "hot";
export type LeadQualificationStatus = "unqualified" | "qualified" | "disqualified";
export type LeadActivityType =
  | "call"
  | "email"
  | "sms"
  | "whatsapp"
  | "meeting"
  | "note"
  | "task"
  | "status-change"
  | "assignment"
  | "site-visit";
export type LeadOwnershipType = "self" | "team" | "unassigned";

export interface LeadAddress {
  line1?: string;
  line2?: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface LeadBudgetRange {
  min?: number;
  max?: number;
  currency?: string;
}

export interface LeadRequirement {
  propertyType?: string;
  purpose?: "buy" | "rent" | "lease" | "sell" | "invest";
  locationPreferences?: string[];
  budget?: LeadBudgetRange;
  bedrooms?: number;
  bathrooms?: number;
  minAreaSqft?: number;
  maxAreaSqft?: number;
  facing?: string;
  possessionTimeline?: string;
  furnishing?: string;
  notes?: string;
}

export interface LeadScoreBreakdown {
  profileFit?: number;
  engagement?: number;
  budgetFit?: number;
  urgency?: number;
  intent?: number;
  sourceQuality?: number;
}

export interface LeadContact {
  id?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  alternateEmail?: string;
  phone?: string;
  alternatePhone?: string;
  whatsappNumber?: string;
  companyName?: string;
  designation?: string;
  city?: string;
  language?: string;
  avatarUrl?: string;
}

export interface LeadAssignment {
  ownerId?: string;
  ownerName?: string;
  teamId?: string;
  teamName?: string;
  assignedAt?: string;
  assignedBy?: string;
}

export interface LeadTag {
  id?: string;
  label: string;
  color?: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
  isPinned?: boolean;
}

export interface LeadFollowUp {
  id: string;
  leadId: string;
  title: string;
  description?: string;
  dueAt: string;
  type?: LeadActivityType;
  status: "pending" | "completed" | "cancelled" | "overdue";
  assignedTo?: string;
  completedAt?: string;
  createdAt: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: LeadActivityType;
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
  metadata?: Record<string, unknown>;
}

export interface LeadCommunicationStats {
  totalCalls?: number;
  totalEmails?: number;
  totalMessages?: number;
  lastContactedAt?: string;
  averageResponseTimeHours?: number;
}

export interface LeadMetrics {
  score?: number;
  scoreBreakdown?: LeadScoreBreakdown;
  temperature?: LeadTemperature;
  qualificationStatus?: LeadQualificationStatus;
  engagementScore?: number;
  conversionProbability?: number;
  daysInPipeline?: number;
  expectedDealValue?: number;
}

export interface LeadSummary {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  companyName?: string;
  source: LeadSource | string;
  sourceLabel?: string;
  status: LeadStatus;
  priority: LeadPriority;
  city?: string;
  budget?: LeadBudgetRange;
  assignment?: LeadAssignment;
  metrics?: LeadMetrics;
  tags?: LeadTag[];
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadDetail extends LeadSummary {
  contact: LeadContact;
  alternateContacts?: LeadContact[];
  address?: LeadAddress;
  requirements?: LeadRequirement;
  notes?: LeadNote[];
  followUps?: LeadFollowUp[];
  activities?: LeadActivity[];
  communicationStats?: LeadCommunicationStats;
  preferredProjects?: Array<{
    id: string;
    name: string;
    location?: string;
  }>;
  customFields?: Record<string, unknown>;
}

export interface LeadFormValues {
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  alternateEmail?: string;
  phone?: string;
  alternatePhone?: string;
  whatsappNumber?: string;
  companyName?: string;
  designation?: string;
  city?: string;
  language?: string;
  source: LeadSource | string;
  status?: LeadStatus;
  priority?: LeadPriority;
  propertyType?: string;
  purpose?: "buy" | "rent" | "lease" | "sell" | "invest";
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  locationPreferences?: string[];
  minAreaSqft?: number;
  maxAreaSqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  facing?: string;
  possessionTimeline?: string;
  furnishing?: string;
  notes?: string;
  ownerId?: string;
  teamId?: string;
  tagLabels?: string[];
}

export interface LeadFilters {
  search?: string;
  statuses?: LeadStatus[];
  priorities?: LeadPriority[];
  sources?: Array<LeadSource | string>;
  ownerIds?: string[];
  teamIds?: string[];
  cities?: string[];
  tags?: string[];
  temperatures?: LeadTemperature[];
  qualificationStatuses?: LeadQualificationStatus[];
  createdStartDate?: string;
  createdEndDate?: string;
  updatedStartDate?: string;
  updatedEndDate?: string;
  minScore?: number;
  maxScore?: number;
  ownershipType?: LeadOwnershipType;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface LeadTableColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  width?: number | string;
  align?: "left" | "center" | "right";
}

export interface LeadListResponse {
  items: LeadSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface LeadDetailResponse {
  data: LeadDetail;
}

export interface LeadStatusOption {
  label: string;
  value: LeadStatus;
  color?: string;
}

export interface LeadSourceOption {
  label: string;
  value: LeadSource | string;
}

export interface LeadPriorityOption {
  label: string;
  value: LeadPriority;
  color?: string;
}

export interface LeadConversionSummary {
  totalLeads: number;
  qualifiedLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRate: number;
  qualificationRate?: number;
  averageTimeToConvertDays?: number;
}

export interface LeadSourcePerformance {
  source: LeadSource | string;
  label: string;
  leadCount: number;
  qualifiedCount: number;
  convertedCount: number;
  conversionRate: number;
  costPerLead?: number;
  costPerQualifiedLead?: number;
}

export interface LeadPipelineStageSummary {
  status: LeadStatus;
  label: string;
  count: number;
  value?: number;
}

export interface LeadOwnerPerformance {
  ownerId: string;
  ownerName: string;
  leadCount: number;
  qualifiedCount: number;
  convertedCount: number;
  conversionRate: number;
  averageResponseTimeHours?: number;
}

export interface LeadAnalyticsSnapshot {
  summary: LeadConversionSummary;
  sourcePerformance: LeadSourcePerformance[];
  pipelineSummary: LeadPipelineStageSummary[];
  ownerPerformance: LeadOwnerPerformance[];
}

export interface LeadBulkActionPayload {
  leadIds: string[];
  status?: LeadStatus;
  priority?: LeadPriority;
  ownerId?: string;
  teamId?: string;
  tagLabels?: string[];
}

export interface LeadApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    generatedAt?: string;
  };
}

export interface LeadSelectionState {
  selectedLeadIds: string[];
  lastSelectedLeadId?: string | null;
}

export interface LeadPageState {
  isLoading: boolean;
  isRefreshing?: boolean;
  isError: boolean;
  errorMessage?: string | null;
  lastUpdatedAt?: string | null;
}