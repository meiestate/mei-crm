// src/types/communication.types.ts

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

export type CommunicationPriority = "low" | "medium" | "high" | "urgent";

export type CommunicationSortOrder = "asc" | "desc";

export type ConversationParticipant = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
};

export type CommunicationAttachment = {
  id: string;
  fileName: string;
  mimeType?: string;
  size?: number;
  downloadUrl?: string;
  previewUrl?: string;
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
  priority?: CommunicationPriority;
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
  priority?: CommunicationPriority | "all";
  page?: number;
  limit?: number;
  sortBy?: "lastMessageAt" | "createdAt" | "updatedAt";
  sortOrder?: CommunicationSortOrder;
};

export type ConversationDetailResponse = {
  conversation: ConversationItem;
  messages: CommunicationMessage[];
};

export type PaginatedConversationsResponse = {
  data: ConversationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateConversationPayload = {
  channel: CommunicationChannel;
  subject?: string;
  body?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  ownerId?: string;
  participants?: ConversationParticipant[];
  tags?: string[];
  priority?: CommunicationPriority;
};

export type UpdateConversationPayload = {
  subject?: string;
  priority?: CommunicationPriority;
  ownerId?: string;
  tags?: string[];
  isMuted?: boolean;
};

export type SendCommunicationRecipient = {
  name?: string;
  email?: string;
  phone?: string;
};

export type SendCommunicationPayload = {
  conversationId?: string;
  channel: CommunicationChannel;
  subject?: string;
  body: string;
  htmlBody?: string;
  plainTextBody?: string;
  to?: SendCommunicationRecipient[];
  cc?: SendCommunicationRecipient[];
  bcc?: SendCommunicationRecipient[];
  contactId?: string;
  leadId?: string;
  dealId?: string;
  templateId?: string;
  attachmentIds?: string[];
  scheduledAt?: string;
};

export type BulkCommunicationActionPayload = {
  conversationIds: string[];
};

export type CommunicationCountsResponse = {
  all: number;
  inbox: number;
  sent: number;
  drafts: number;
  scheduled: number;
  archived: number;
  starred: number;
  failed: number;
  unread: number;
};

export type CommunicationSearchResponse = ConversationItem[];