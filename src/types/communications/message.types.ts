// src/types/message.types.ts

export type MessageChannel = "sms" | "whatsapp" | "internal_chat";

export type MessageDirection = "inbound" | "outbound";

export type MessageStatus =
  | "draft"
  | "queued"
  | "scheduled"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "canceled"
  | "archived"
  | "deleted";

export type MessageSortOrder = "asc" | "desc";

export type MessageRecipient = {
  id?: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
};

export type MessageAttachment = {
  id: string;
  fileName: string;
  mimeType?: string;
  size?: number;
  downloadUrl?: string;
  previewUrl?: string;
};

export type MessageItem = {
  id: string;
  conversationId?: string;
  threadId?: string;
  channel: MessageChannel;
  direction: MessageDirection;
  body: string;
  templateId?: string;
  templateName?: string;
  status: MessageStatus;
  from?: MessageRecipient;
  to?: MessageRecipient[];
  attachments?: MessageAttachment[];
  isRead?: boolean;
  isStarred?: boolean;
  isArchived?: boolean;
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
  channel: MessageChannel;
  participants: MessageRecipient[];
  lastMessage?: MessageItem;
  unreadCount: number;
  messageCount: number;
  isStarred?: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type MessageFilters = {
  search?: string;
  channel?: MessageChannel | "all";
  status?: MessageStatus | "all";
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
  sortOrder?: MessageSortOrder;
};

export type PaginatedMessagesResponse = {
  data: MessageItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedMessageThreadsResponse = {
  data: MessageThread[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type MessageThreadDetailResponse = {
  thread: MessageThread;
  messages: MessageItem[];
};

export type SendMessageRecipient = {
  name?: string;
  phone: string;
};

export type SendMessagePayload = {
  channel: MessageChannel;
  body: string;
  to: SendMessageRecipient[];
  templateId?: string;
  attachmentIds?: string[];
  contactId?: string;
  leadId?: string;
  dealId?: string;
  ownerId?: string;
};

export type DraftMessagePayload = {
  channel: MessageChannel;
  body: string;
  to?: SendMessageRecipient[];
  templateId?: string;
  attachmentIds?: string[];
  contactId?: string;
  leadId?: string;
  dealId?: string;
  ownerId?: string;
};

export type UpdateDraftMessagePayload = Partial<DraftMessagePayload>;

export type ScheduleMessagePayload = SendMessagePayload & {
  scheduledAt: string;
};

export type BulkMessageActionPayload = {
  messageIds: string[];
};

export type MessageCountsResponse = {
  all: number;
  unread: number;
  sent: number;
  drafts: number;
  scheduled: number;
  failed: number;
  archived: number;
};

export type MessageSearchResponse = MessageItem[];