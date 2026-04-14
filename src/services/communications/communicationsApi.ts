// src/services/communications/communicationsApi.ts

import api from "../../prisma/client";

export type CommunicationChannel =
  | "email"
  | "sms"
  | "whatsapp"
  | "call"
  | "note";

export type CommunicationDirection = "inbound" | "outbound";

export type CommunicationStatus =
  | "draft"
  | "queued"
  | "scheduled"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "replied"
  | "failed"
  | "bounced"
  | "canceled";

export type ConversationPriority = "low" | "medium" | "high" | "urgent";

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

export type CommunicationFolder =
  | "all"
  | "inbox"
  | "sent"
  | "drafts"
  | "scheduled"
  | "archived"
  | "starred"
  | "failed";

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
  sortOrder?: "asc" | "desc";
};

export type PaginatedConversationsResponse = {
  data: ConversationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ConversationDetailResponse = {
  conversation: ConversationItem;
  messages: CommunicationMessage[];
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
  priority?: ConversationPriority;
};

export type SendMessageRecipient = {
  name?: string;
  email?: string;
  phone?: string;
};

export type SendMessagePayload = {
  conversationId?: string;
  channel: CommunicationChannel;
  subject?: string;
  body: string;
  htmlBody?: string;
  plainTextBody?: string;
  to?: SendMessageRecipient[];
  cc?: SendMessageRecipient[];
  bcc?: SendMessageRecipient[];
  contactId?: string;
  leadId?: string;
  dealId?: string;
  templateId?: string;
  attachmentIds?: string[];
  scheduledAt?: string;
};

export type UpdateConversationPayload = {
  subject?: string;
  priority?: ConversationPriority;
  ownerId?: string;
  tags?: string[];
  isMuted?: boolean;
};

export type BulkConversationActionPayload = {
  conversationIds: string[];
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

const communicationsApi = {
  async getConversations(
    filters?: ConversationFilters,
  ): Promise<PaginatedConversationsResponse> {
    const response = await api.get<PaginatedConversationsResponse>(
      "/communications/conversations",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getConversationById(id: string): Promise<ConversationDetailResponse> {
    const response = await api.get<ConversationDetailResponse>(
      `/communications/conversations/${id}`,
    );

    return response.data;
  },

  async createConversation(
    payload: CreateConversationPayload,
  ): Promise<ConversationItem> {
    const response = await api.post<ConversationItem, CreateConversationPayload>(
      "/communications/conversations",
      payload,
    );

    return response.data;
  },

  async updateConversation(
    id: string,
    payload: UpdateConversationPayload,
  ): Promise<ConversationItem> {
    const response = await api.patch<ConversationItem, UpdateConversationPayload>(
      `/communications/conversations/${id}`,
      payload,
    );

    return response.data;
  },

  async deleteConversation(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.delete<{ success: boolean; message?: string }>(
      `/communications/conversations/${id}`,
    );

    return response.data;
  },

  async sendMessage(
    payload: SendMessagePayload,
  ): Promise<CommunicationMessage> {
    const response = await api.post<CommunicationMessage, SendMessagePayload>(
      "/communications/messages/send",
      payload,
    );

    return response.data;
  },

  async replyToConversation(
    conversationId: string,
    payload: Omit<SendMessagePayload, "conversationId">,
  ): Promise<CommunicationMessage> {
    const response = await api.post<
      CommunicationMessage,
      Omit<SendMessagePayload, "conversationId">
    >(`/communications/conversations/${conversationId}/reply`, payload);

    return response.data;
  },

  async getMessages(
    conversationId: string,
  ): Promise<CommunicationMessage[]> {
    const response = await api.get<CommunicationMessage[]>(
      `/communications/conversations/${conversationId}/messages`,
    );

    return response.data;
  },

  async getMessageById(messageId: string): Promise<CommunicationMessage> {
    const response = await api.get<CommunicationMessage>(
      `/communications/messages/${messageId}`,
    );

    return response.data;
  },

  async markConversationAsRead(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/communications/conversations/${id}/read`, {});

    return response.data;
  },

  async markConversationAsUnread(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/communications/conversations/${id}/unread`, {});

    return response.data;
  },

  async starConversation(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/communications/conversations/${id}/star`, {});

    return response.data;
  },

  async unstarConversation(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/communications/conversations/${id}/unstar`, {});

    return response.data;
  },

  async archiveConversation(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/communications/conversations/${id}/archive`, {});

    return response.data;
  },

  async unarchiveConversation(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/communications/conversations/${id}/unarchive`, {});

    return response.data;
  },

  async bulkArchive(
    payload: BulkConversationActionPayload,
  ): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
    const response = await api.patch<
      { success: boolean; message?: string; updatedCount?: number },
      BulkConversationActionPayload
    >("/communications/conversations/bulk-archive", payload);

    return response.data;
  },

  async bulkUnarchive(
    payload: BulkConversationActionPayload,
  ): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
    const response = await api.patch<
      { success: boolean; message?: string; updatedCount?: number },
      BulkConversationActionPayload
    >("/communications/conversations/bulk-unarchive", payload);

    return response.data;
  },

  async bulkMarkRead(
    payload: BulkConversationActionPayload,
  ): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
    const response = await api.patch<
      { success: boolean; message?: string; updatedCount?: number },
      BulkConversationActionPayload
    >("/communications/conversations/bulk-read", payload);

    return response.data;
  },

  async bulkMarkUnread(
    payload: BulkConversationActionPayload,
  ): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
    const response = await api.patch<
      { success: boolean; message?: string; updatedCount?: number },
      BulkConversationActionPayload
    >("/communications/conversations/bulk-unread", payload);

    return response.data;
  },

  async bulkDelete(
    payload: BulkConversationActionPayload,
  ): Promise<{ success: boolean; message?: string; deletedCount?: number }> {
    const response = await api.post<
      { success: boolean; message?: string; deletedCount?: number },
      BulkConversationActionPayload
    >("/communications/conversations/bulk-delete", payload);

    return response.data;
  },

  async getConversationCounts(filters?: {
    ownerId?: string;
    contactId?: string;
    leadId?: string;
    dealId?: string;
  }): Promise<{
    all: number;
    inbox: number;
    sent: number;
    drafts: number;
    scheduled: number;
    archived: number;
    starred: number;
    failed: number;
    unread: number;
  }> {
    const response = await api.get<{
      all: number;
      inbox: number;
      sent: number;
      drafts: number;
      scheduled: number;
      archived: number;
      starred: number;
      failed: number;
      unread: number;
    }>("/communications/conversations/counts", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async searchConversations(
    query: string,
    extraFilters?: Omit<ConversationFilters, "search">,
  ): Promise<ConversationItem[]> {
    const response = await api.get<ConversationItem[]>(
      "/communications/conversations/search",
      {
        params: cleanParams({
          query,
          ...extraFilters,
        }),
      },
    );

    return response.data;
  },
};

export default communicationsApi;
export { cleanParams };