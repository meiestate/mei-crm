// src/services/communications/emailApi.ts

import api from "../../prisma/client";

export type EmailFolder =
  | "inbox"
  | "sent"
  | "drafts"
  | "scheduled"
  | "trash"
  | "archived"
  | "starred"
  | "spam"
  | "all";

export type EmailStatus =
  | "draft"
  | "queued"
  | "scheduled"
  | "sending"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "replied"
  | "bounced"
  | "failed"
  | "archived"
  | "deleted";

export type EmailRecipient = {
  name?: string;
  email: string;
};

export type EmailAttachment = {
  id: string;
  fileName: string;
  mimeType?: string;
  size?: number;
  downloadUrl?: string;
  previewUrl?: string;
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
  status: EmailStatus;
  folder?: EmailFolder;
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
  attachments?: EmailAttachment[];
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
  folder?: EmailFolder;
  createdAt: string;
  updatedAt?: string;
};

export type EmailFilters = {
  search?: string;
  folder?: EmailFolder;
  status?: EmailStatus | "all";
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
  sortOrder?: "asc" | "desc";
};

export type PaginatedEmailsResponse = {
  data: EmailMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedThreadsResponse = {
  data: EmailThread[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type EmailThreadDetailResponse = {
  thread: EmailThread;
  messages: EmailMessage[];
};

export type SendEmailPayload = {
  subject: string;
  body?: string;
  htmlBody?: string;
  textBody?: string;
  from?: EmailRecipient;
  to: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  replyTo?: EmailRecipient[];
  templateId?: string;
  attachmentIds?: string[];
  contactId?: string;
  leadId?: string;
  dealId?: string;
  ownerId?: string;
};

export type DraftEmailPayload = {
  subject: string;
  body?: string;
  htmlBody?: string;
  textBody?: string;
  from?: EmailRecipient;
  to?: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  replyTo?: EmailRecipient[];
  templateId?: string;
  attachmentIds?: string[];
  contactId?: string;
  leadId?: string;
  dealId?: string;
  ownerId?: string;
};

export type ReplyEmailPayload = {
  body?: string;
  htmlBody?: string;
  textBody?: string;
  to?: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  attachmentIds?: string[];
};

export type ScheduleEmailPayload = SendEmailPayload & {
  scheduledAt: string;
};

export type UpdateDraftPayload = Partial<DraftEmailPayload> & {
  subject?: string;
};

export type BulkEmailActionPayload = {
  emailIds: string[];
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

const emailApi = {
  async getEmails(filters?: EmailFilters): Promise<PaginatedEmailsResponse> {
    const response = await api.get<PaginatedEmailsResponse>("/emails", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async getEmailById(id: string): Promise<EmailMessage> {
    const response = await api.get<EmailMessage>(`/emails/${id}`);
    return response.data;
  },

  async getThreads(filters?: EmailFilters): Promise<PaginatedThreadsResponse> {
    const response = await api.get<PaginatedThreadsResponse>("/emails/threads", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async getThreadById(id: string): Promise<EmailThreadDetailResponse> {
    const response = await api.get<EmailThreadDetailResponse>(
      `/emails/threads/${id}`,
    );

    return response.data;
  },

  async sendEmail(payload: SendEmailPayload): Promise<EmailMessage> {
    const response = await api.post<EmailMessage, SendEmailPayload>(
      "/emails/send",
      payload,
    );

    return response.data;
  },

  async createDraft(payload: DraftEmailPayload): Promise<EmailMessage> {
    const response = await api.post<EmailMessage, DraftEmailPayload>(
      "/emails/drafts",
      payload,
    );

    return response.data;
  },

  async updateDraft(
    draftId: string,
    payload: UpdateDraftPayload,
  ): Promise<EmailMessage> {
    const response = await api.patch<EmailMessage, UpdateDraftPayload>(
      `/emails/drafts/${draftId}`,
      payload,
    );

    return response.data;
  },

  async deleteDraft(
    draftId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.delete<{ success: boolean; message?: string }>(
      `/emails/drafts/${draftId}`,
    );

    return response.data;
  },

  async sendDraft(draftId: string): Promise<EmailMessage> {
    const response = await api.post<EmailMessage, Record<string, never>>(
      `/emails/drafts/${draftId}/send`,
      {},
    );

    return response.data;
  },

  async replyToEmail(
    emailId: string,
    payload: ReplyEmailPayload,
  ): Promise<EmailMessage> {
    const response = await api.post<EmailMessage, ReplyEmailPayload>(
      `/emails/${emailId}/reply`,
      payload,
    );

    return response.data;
  },

  async forwardEmail(
    emailId: string,
    payload: {
      to: EmailRecipient[];
      cc?: EmailRecipient[];
      bcc?: EmailRecipient[];
      body?: string;
      attachmentIds?: string[];
    },
  ): Promise<EmailMessage> {
    const response = await api.post<
      EmailMessage,
      {
        to: EmailRecipient[];
        cc?: EmailRecipient[];
        bcc?: EmailRecipient[];
        body?: string;
        attachmentIds?: string[];
      }
    >(`/emails/${emailId}/forward`, payload);

    return response.data;
  },

  async scheduleEmail(payload: ScheduleEmailPayload): Promise<EmailMessage> {
    const response = await api.post<EmailMessage, ScheduleEmailPayload>(
      "/emails/schedule",
      payload,
    );

    return response.data;
  },

  async cancelScheduledEmail(
    emailId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/emails/${emailId}/cancel-schedule`, {});

    return response.data;
  },

  async markAsRead(
    emailId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/emails/${emailId}/read`, {});

    return response.data;
  },

  async markAsUnread(
    emailId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/emails/${emailId}/unread`, {});

    return response.data;
  },

  async starEmail(
    emailId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/emails/${emailId}/star`, {});

    return response.data;
  },

  async unstarEmail(
    emailId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/emails/${emailId}/unstar`, {});

    return response.data;
  },

  async archiveEmail(
    emailId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/emails/${emailId}/archive`, {});

    return response.data;
  },

  async unarchiveEmail(
    emailId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/emails/${emailId}/unarchive`, {});

    return response.data;
  },

  async moveToTrash(
    emailId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/emails/${emailId}/trash`, {});

    return response.data;
  },

  async restoreFromTrash(
    emailId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/emails/${emailId}/restore`, {});

    return response.data;
  },

  async deleteEmail(
    emailId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.delete<{ success: boolean; message?: string }>(
      `/emails/${emailId}`,
    );

    return response.data;
  },

  async bulkArchive(
    payload: BulkEmailActionPayload,
  ): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
    const response = await api.patch<
      { success: boolean; message?: string; updatedCount?: number },
      BulkEmailActionPayload
    >("/emails/bulk-archive", payload);

    return response.data;
  },

  async bulkDelete(
    payload: BulkEmailActionPayload,
  ): Promise<{ success: boolean; message?: string; deletedCount?: number }> {
    const response = await api.post<
      { success: boolean; message?: string; deletedCount?: number },
      BulkEmailActionPayload
    >("/emails/bulk-delete", payload);

    return response.data;
  },

  async bulkMarkRead(
    payload: BulkEmailActionPayload,
  ): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
    const response = await api.patch<
      { success: boolean; message?: string; updatedCount?: number },
      BulkEmailActionPayload
    >("/emails/bulk-read", payload);

    return response.data;
  },

  async bulkMarkUnread(
    payload: BulkEmailActionPayload,
  ): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
    const response = await api.patch<
      { success: boolean; message?: string; updatedCount?: number },
      BulkEmailActionPayload
    >("/emails/bulk-unread", payload);

    return response.data;
  },

  async getEmailCounts(filters?: {
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
    trash: number;
    archived: number;
    starred: number;
    unread: number;
  }> {
    const response = await api.get<{
      all: number;
      inbox: number;
      sent: number;
      drafts: number;
      scheduled: number;
      trash: number;
      archived: number;
      starred: number;
      unread: number;
    }>("/emails/counts", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async getRawEmailBlob(emailId: string): Promise<Blob> {
    const response = await api.get<Blob>(`/emails/${emailId}/raw`, {
      responseType: "blob",
    });

    return response.data;
  },

  async searchEmails(
    query: string,
    extraFilters?: Omit<EmailFilters, "search">,
  ): Promise<EmailMessage[]> {
    const response = await api.get<EmailMessage[]>("/emails/search", {
      params: cleanParams({
        query,
        ...extraFilters,
      }),
    });

    return response.data;
  },
};

export default emailApi;
export { cleanParams };