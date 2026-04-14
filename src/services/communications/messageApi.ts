// src/services/communications/messageApi.ts

import api from "../../prisma/client";

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
  | "canceled";

export type MessageRecipient = {
  id?: string;
  name?: string;
  phone?: string;
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
  sortOrder?: "asc" | "desc";
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

export type SendMessagePayload = {
  channel: MessageChannel;
  body: string;
  to: Array<{
    name?: string;
    phone: string;
  }>;
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
  to?: Array<{
    name?: string;
    phone: string;
  }>;
  templateId?: string;
  attachmentIds?: string[];
  contactId?: string;
  leadId?: string;
  dealId?: string;
  ownerId?: string;
};

export type ScheduleMessagePayload = SendMessagePayload & {
  scheduledAt: string;
};

export type UpdateDraftMessagePayload = Partial<DraftMessagePayload>;

export type BulkMessageActionPayload = {
  messageIds: string[];
};

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return {};

  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0),
    ),
  );
}

const messageApi = {
  async getMessages(
    filters?: MessageFilters,
  ): Promise<PaginatedMessagesResponse> {
    const response = await api.get<PaginatedMessagesResponse>("/messages", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async getMessageById(id: string): Promise<MessageItem> {
    const response = await api.get<MessageItem>(`/messages/${id}`);
    return response.data;
  },

  async getThreads(
    filters?: MessageFilters,
  ): Promise<PaginatedMessageThreadsResponse> {
    const response = await api.get<PaginatedMessageThreadsResponse>(
      "/messages/threads",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getThreadById(id: string): Promise<MessageThreadDetailResponse> {
    const response = await api.get<MessageThreadDetailResponse>(
      `/messages/threads/${id}`,
    );

    return response.data;
  },

  async sendMessage(payload: SendMessagePayload): Promise<MessageItem> {
    const response = await api.post<MessageItem, SendMessagePayload>(
      "/messages/send",
      payload,
    );

    return response.data;
  },

  async createDraft(payload: DraftMessagePayload): Promise<MessageItem> {
    const response = await api.post<MessageItem, DraftMessagePayload>(
      "/messages/drafts",
      payload,
    );

    return response.data;
  },

  async updateDraft(
    draftId: string,
    payload: UpdateDraftMessagePayload,
  ): Promise<MessageItem> {
    const response = await api.patch<MessageItem, UpdateDraftMessagePayload>(
      `/messages/drafts/${draftId}`,
      payload,
    );

    return response.data;
  },

  async deleteDraft(
    draftId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.delete<{ success: boolean; message?: string }>(
      `/messages/drafts/${draftId}`,
    );

    return response.data;
  },

  async sendDraft(draftId: string): Promise<MessageItem> {
    const response = await api.post<MessageItem, Record<string, never>>(
      `/messages/drafts/${draftId}/send`,
      {},
    );

    return response.data;
  },

  async scheduleMessage(
    payload: ScheduleMessagePayload,
  ): Promise<MessageItem> {
    const response = await api.post<MessageItem, ScheduleMessagePayload>(
      "/messages/schedule",
      payload,
    );

    return response.data;
  },

  async cancelScheduledMessage(
    messageId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/messages/${messageId}/cancel-schedule`, {});

    return response.data;
  },

  async markAsRead(
    messageId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/messages/${messageId}/read`, {});

    return response.data;
  },

  async markAsUnread(
    messageId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/messages/${messageId}/unread`, {});

    return response.data;
  },

  async starMessage(
    messageId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/messages/${messageId}/star`, {});

    return response.data;
  },

  async unstarMessage(
    messageId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/messages/${messageId}/unstar`, {});

    return response.data;
  },

  async archiveMessage(
    messageId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/messages/${messageId}/archive`, {});

    return response.data;
  },

  async unarchiveMessage(
    messageId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/messages/${messageId}/unarchive`, {});

    return response.data;
  },

  async deleteMessage(
    messageId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.delete<{ success: boolean; message?: string }>(
      `/messages/${messageId}`,
    );

    return response.data;
  },

  async bulkArchive(
    payload: BulkMessageActionPayload,
  ): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
    const response = await api.patch<
      { success: boolean; message?: string; updatedCount?: number },
      BulkMessageActionPayload
    >("/messages/bulk-archive", payload);

    return response.data;
  },

  async bulkDelete(
    payload: BulkMessageActionPayload,
  ): Promise<{ success: boolean; message?: string; deletedCount?: number }> {
    const response = await api.post<
      { success: boolean; message?: string; deletedCount?: number },
      BulkMessageActionPayload
    >("/messages/bulk-delete", payload);

    return response.data;
  },

  async bulkMarkRead(
    payload: BulkMessageActionPayload,
  ): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
    const response = await api.patch<
      { success: boolean; message?: string; updatedCount?: number },
      BulkMessageActionPayload
    >("/messages/bulk-read", payload);

    return response.data;
  },

  async bulkMarkUnread(
    payload: BulkMessageActionPayload,
  ): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
    const response = await api.patch<
      { success: boolean; message?: string; updatedCount?: number },
      BulkMessageActionPayload
    >("/messages/bulk-unread", payload);

    return response.data;
  },

  async getMessageCounts(filters?: {
    ownerId?: string;
    contactId?: string;
    leadId?: string;
    dealId?: string;
  }): Promise<{
    all: number;
    unread: number;
    sent: number;
    drafts: number;
    scheduled: number;
    failed: number;
    archived: number;
  }> {
    const response = await api.get<{
      all: number;
      unread: number;
      sent: number;
      drafts: number;
      scheduled: number;
      failed: number;
      archived: number;
    }>("/messages/counts", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async searchMessages(
    query: string,
    extraFilters?: Omit<MessageFilters, "search">,
  ): Promise<MessageItem[]> {
    const response = await api.get<MessageItem[]>("/messages/search", {
      params: cleanParams({
        query,
        ...extraFilters,
      }),
    });

    return response.data;
  },
};

export default messageApi;
export { cleanParams };