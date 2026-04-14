// src/types/communications.types.ts

export type CommunicationChannel =
  | "email"
  | "sms"
  | "whatsapp"
  | "call"
  | "note"
  | "internal_chat";

export type CommunicationDirection = "inbound" | "outbound";

export type CommunicationStatus =
  | "draft"
  | "queued"
  | "scheduled"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "opened"
  | "clicked"
  | "replied"
  | "failed"
  | "bounced"
  | "canceled"
  | "archived"
  | "deleted";

export type CommunicationFolder =
  | "all"
  | "inbox"
  | "sent"
  | "drafts"
  | "scheduled"
  | "archived"
  | "starred"
  | "failed"
  | "trash"
  | "spam";

export type ConversationPriority = "low" | "medium" | "high" | "urgent";

export type TemplateChannel = "email" | "sms" | "whatsapp";

export type TemplateCategory =
  | "welcome"
  | "follow_up"
  | "promotion"
  | "reminder"
  | "nurture"
  | "proposal"
  | "closing"
  | "support"
  | "custom";

export type TemplateStatus = "draft" | "active" | "archived";

export type FollowUpEntityType =
  | "lead"
  | "contact"
  | "deal"
  | "conversation"
  | "message"
  | "task";

export type FollowUpChannel =
  | "call"
  | "email"
  | "sms"
  | "whatsapp"
  | "meeting"
  | "note";

export type FollowUpPriority = "low" | "medium" | "high" | "urgent";

export type FollowUpStatus =
  | "pending"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "missed"
  | "canceled"
  | "overdue";

export type AttachmentEntityType =
  | "email"
  | "message"
  | "conversation"
  | "template"
  | "follow_up"
  | "note";

export type AttachmentKind =
  | "image"
  | "document"
  | "audio"
  | "video"
  | "archive"
  | "spreadsheet"
  | "other";

export type AttachmentUploadStatus =
  | "uploading"
  | "uploaded"
  | "failed"
  | "deleted";

export type DateRangePreset =
  | "today"
  | "yesterday"
  | "last7Days"
  | "last30Days"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "thisYear"
  | "custom";

export type AnalyticsScope = "all" | "team" | "user";

export type StatChangeDirection = "up" | "down" | "neutral";

export type SortOrder = "asc" | "desc";

export type ConversationParticipant = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
};

export type MessageRecipient = {
  id?: string;
  name?: string;
  phone?: string;
};

export type EmailRecipient = {
  name?: string;
  email: string;
};

export type TemplateVariable = {
  key: string;
  label: string;
  fallbackValue?: string;
  required?: boolean;
  example?: string;
};

export type CommunicationAttachment = {
  id: string;
  fileName: string;
  mimeType?: string;
  size?: number;
  downloadUrl?: string;
  previewUrl?: string;
};

export type AttachmentItem = {
  id: string;
  fileName: string;
  originalName?: string;
  mimeType: string;
  extension?: string;
  size: number;
  sizeLabel?: string;
  kind?: AttachmentKind;
  url?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  publicUrl?: string;
  storageKey?: string;
  entityId?: string;
  entityType?: AttachmentEntityType;
  uploadedBy?: string;
  uploadedByName?: string;
  uploadStatus?: AttachmentUploadStatus;
  createdAt: string;
  updatedAt?: string;
};

export type CommunicationMessage = {
  id: string;
  conversationId: string;
  channel: CommunicationChannel;
  direction: CommunicationDirection;
  subject?: string;
  body: string;
  plainTextBody?: string;
  htmlBody?: string;
  status: CommunicationStatus;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt?: string;
  from?: ConversationParticipant;
  to?: ConversationParticipant[];
  cc?: ConversationParticipant[];
  bcc?: ConversationParticipant[];
  attachments?: CommunicationAttachment[];
  templateId?: string;
  templateName?: string;
  errorMessage?: string;
  isStarred?: boolean;
  isInternal?: boolean;
};

export type ConversationItem = {
  id: string;
  channel: CommunicationChannel;
  subject?: string;
  snippet?: string;
  status?: CommunicationStatus;
  priority?: ConversationPriority;
  unreadCount: number;
  messageCount: number;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  ownerId?: string;
  ownerName?: string;
  participants: ConversationParticipant[];
  lastMessage?: CommunicationMessage;
  tags?: string[];
  isArchived?: boolean;
  isStarred?: boolean;
  isMuted?: boolean;
};

export type EmailMessage = {
  id: string;
  conversationId?: string;
  threadId?: string;
  subject: string;
  snippet?: string;
  body?: string;
  htmlBody?: string;
  textBody?: string;
  from: EmailRecipient;
  to: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  replyTo?: EmailRecipient[];
  status: CommunicationStatus;
  folder?: CommunicationFolder;
  isRead?: boolean;
  isStarred?: boolean;
  isArchived?: boolean;
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  scheduledAt?: string;
  failedAt?: string;
  errorMessage?: string;
  templateId?: string;
  templateName?: string;
  attachments?: CommunicationAttachment[];
  createdAt: string;
  updatedAt?: string;
};

export type EmailThread = {
  id: string;
  subject: string;
  participants: EmailRecipient[];
  lastMessageAt?: string;
  unreadCount: number;
  messageCount: number;
  lastMessage?: EmailMessage;
  isStarred?: boolean;
  isArchived?: boolean;
  folder?: CommunicationFolder;
  createdAt: string;
  updatedAt?: string;
};

export type MessageItem = {
  id: string;
  conversationId?: string;
  channel: Extract<CommunicationChannel, "sms" | "whatsapp" | "internal_chat">;
  direction: CommunicationDirection;
  body: string;
  templateId?: string;
  templateName?: string;
  status: CommunicationStatus;
  from?: MessageRecipient;
  to?: MessageRecipient[];
  attachments?: CommunicationAttachment[];
  isRead?: boolean;
  isStarred?: boolean;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  scheduledAt?: string;
  failedAt?: string;
  errorMessage?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt?: string;
};

export type MessageThread = {
  id: string;
  channel: Extract<CommunicationChannel, "sms" | "whatsapp" | "internal_chat">;
  participants: MessageRecipient[];
  lastMessage?: MessageItem;
  unreadCount: number;
  messageCount: number;
  isStarred?: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type TemplateItem = {
  id: string;
  name: string;
  description?: string;
  subject?: string;
  body: string;
  htmlBody?: string;
  plainTextBody?: string;
  channel: TemplateChannel;
  category: TemplateCategory;
  status: TemplateStatus;
  variables?: TemplateVariable[];
  attachments?: CommunicationAttachment[];
  tags?: string[];
  isFavorite?: boolean;
  isDefault?: boolean;
  usageCount?: number;
  lastUsedAt?: string;
  createdBy?: string;
  createdByName?: string;
  createdAt: string;
  updatedAt?: string;
};

export type FollowUpReminderUnit = "minutes" | "hours" | "days";

export type FollowUpReminder = {
  value: number;
  unit: FollowUpReminderUnit;
};

export type FollowUpAssignee = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export type FollowUpItem = {
  id: string;
  title: string;
  description?: string;
  entityId?: string;
  entityType?: FollowUpEntityType;
  relatedConversationId?: string;
  relatedMessageId?: string;
  channel: FollowUpChannel;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  dueAt: string;
  completedAt?: string;
  canceledAt?: string;
  reminder?: FollowUpReminder;
  assignee?: FollowUpAssignee;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  ownerId?: string;
  ownerName?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
};

export type KPIStat = {
  key: string;
  label: string;
  value: number;
  formattedValue?: string;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  changeDirection?: StatChangeDirection;
  color?: string;
  icon?: string;
};

export type DashboardSummary = {
  totalLeads: number;
  qualifiedLeads: number;
  totalContacts: number;
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  totalRevenue: number;
  expectedRevenue: number;
  tasksDueToday: number;
  overdueTasks: number;
  emailsSent: number;
  messagesSent: number;
  callsLogged: number;
  conversionRate: number;
};

export type TrendPoint = {
  date: string;
  value: number;
  label?: string;
};

export type MultiSeriesTrendPoint = {
  date: string;
  [seriesKey: string]: string | number | undefined;
};

export type SourcePerformanceItem = {
  sourceId: string;
  sourceName: string;
  leads: number;
  qualified: number;
  deals: number;
  revenue: number;
  conversionRate: number;
};

export type PipelineStageAnalytics = {
  stageId: string;
  stageName: string;
  count: number;
  value: number;
  color?: string;
  order?: number;
};

export type DealAnalyticsItem = {
  dealId: string;
  title: string;
  contactName?: string;
  ownerName?: string;
  stageName: string;
  amount: number;
  probability?: number;
  expectedCloseDate?: string;
  status?: string;
};

export type UserPerformanceItem = {
  userId: string;
  userName: string;
  leads: number;
  qualifiedLeads: number;
  dealsWon: number;
  dealsLost: number;
  revenue: number;
  calls: number;
  emails: number;
  messages: number;
  tasksCompleted: number;
  conversionRate: number;
};

export type TaskAnalyticsSummary = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueToday: number;
  completionRate: number;
};

export type CommunicationAnalyticsSummary = {
  totalEmails: number;
  totalMessages: number;
  totalCalls: number;
  deliveredEmails: number;
  bouncedEmails: number;
  failedMessages: number;
  repliedEmails: number;
  inboundMessages: number;
  outboundMessages: number;
  averageResponseTimeMinutes: number;
};

export type ActivityAnalyticsSummary = {
  totalActivities: number;
  notes: number;
  calls: number;
  emails: number;
  messages: number;
  meetings: number;
  tasks: number;
};

export type RevenueTrendSummary = {
  totalRevenue: number;
  wonRevenue: number;
  expectedRevenue: number;
  averageDealSize: number;
};

export type ConversionFunnelItem = {
  step: string;
  count: number;
  conversionRateFromPrevious?: number;
  conversionRateFromStart?: number;
};

export type AnalyticsFilters = {
  startDate?: string;
  endDate?: string;
  preset?: DateRangePreset;
  ownerId?: string;
  teamId?: string;
  pipelineId?: string;
  sourceId?: string;
  status?: string;
  channel?: string;
  scope?: AnalyticsScope;
  search?: string;
};

export type ConversationFilters = {
  search?: string;
  channel?: CommunicationChannel | "all";
  status?: CommunicationStatus | "all";
  folder?: CommunicationFolder;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  ownerId?: string;
  assignedTo?: string;
  unreadOnly?: boolean;
  starredOnly?: boolean;
  archived?: boolean;
  priority?: ConversationPriority | "all";
  page?: number;
  limit?: number;
  sortBy?: "lastMessageAt" | "createdAt" | "updatedAt";
  sortOrder?: SortOrder;
};

export type EmailFilters = {
  search?: string;
  folder?: CommunicationFolder;
  status?: CommunicationStatus | "all";
  isRead?: boolean;
  isStarred?: boolean;
  isArchived?: boolean;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  ownerId?: string;
  threadId?: string;
  page?: number;
  limit?: number;
  sortBy?: "sentAt" | "createdAt" | "updatedAt";
  sortOrder?: SortOrder;
};

export type MessageFilters = {
  search?: string;
  channel?: Extract<CommunicationChannel, "sms" | "whatsapp" | "internal_chat"> | "all";
  status?: CommunicationStatus | "all";
  contactId?: string;
  leadId?: string;
  dealId?: string;
  ownerId?: string;
  threadId?: string;
  isRead?: boolean;
  isStarred?: boolean;
  isArchived?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "sentAt" | "createdAt" | "updatedAt";
  sortOrder?: SortOrder;
};

export type TemplateFilters = {
  search?: string;
  channel?: TemplateChannel | "all";
  category?: TemplateCategory | "all";
  status?: TemplateStatus | "all";
  isFavorite?: boolean;
  createdBy?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt" | "updatedAt" | "usageCount" | "lastUsedAt";
  sortOrder?: SortOrder;
};

export type FollowUpFilters = {
  search?: string;
  entityId?: string;
  entityType?: FollowUpEntityType;
  channel?: FollowUpChannel | "all";
  priority?: FollowUpPriority | "all";
  status?: FollowUpStatus | "all";
  assigneeId?: string;
  ownerId?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  dueFrom?: string;
  dueTo?: string;
  overdueOnly?: boolean;
  todayOnly?: boolean;
  upcomingOnly?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "dueAt" | "createdAt" | "updatedAt" | "priority";
  sortOrder?: SortOrder;
};

export type AttachmentFilters = {
  entityId?: string;
  entityType?: AttachmentEntityType;
  search?: string;
  mimeType?: string;
  kind?: AttachmentKind;
  uploadedBy?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "fileName" | "size";
  sortOrder?: SortOrder;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ConversationDetailResponse = {
  conversation: ConversationItem;
  messages: CommunicationMessage[];
};

export type EmailThreadDetailResponse = {
  thread: EmailThread;
  messages: EmailMessage[];
};

export type MessageThreadDetailResponse = {
  thread: MessageThread;
  messages: MessageItem[];
};

export type AnalyticsOverviewResponse = {
  summary: DashboardSummary;
  kpis: KPIStat[];
  leadTrend: TrendPoint[];
  revenueTrend: TrendPoint[];
  pipeline: PipelineStageAnalytics[];
  topSources: SourcePerformanceItem[];
  topPerformers: UserPerformanceItem[];
};