// src/services/communications/followUpsApi.ts

import api from "../../prisma/client";

export type FollowUpEntityType =
  | "lead"
  | "contact"
  | "deal"
  | "conversation"
  | "message"
  | "task";

export type FollowUpChannel = "call" | "email" | "sms" | "whatsapp" | "meeting" | "note";

export type FollowUpPriority = "low" | "medium" | "high" | "urgent";

export type FollowUpStatus =
  | "pending"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "missed"
  | "canceled"
  | "overdue";

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
  sortOrder?: "asc" | "desc";
};

export type PaginatedFollowUpsResponse = {
  data: FollowUpItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateFollowUpPayload = {
  title: string;
  description?: string;
  entityId?: string;
  entityType?: FollowUpEntityType;
  relatedConversationId?: string;
  relatedMessageId?: string;
  channel: FollowUpChannel;
  priority?: FollowUpPriority;
  status?: FollowUpStatus;
  dueAt: string;
  reminder?: FollowUpReminder;
  assigneeId?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  ownerId?: string;
  notes?: string;
  tags?: string[];
};

export type UpdateFollowUpPayload = Partial<CreateFollowUpPayload> & {
  completedAt?: string;
  canceledAt?: string;
};

export type CompleteFollowUpPayload = {
  notes?: string;
  completedAt?: string;
};

export type BulkFollowUpActionPayload = {
  followUpIds: string[];
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

const followUpsApi = {
  async getFollowUps(
    filters?: FollowUpFilters,
  ): Promise<PaginatedFollowUpsResponse> {
    const response = await api.get<PaginatedFollowUpsResponse>("/follow-ups", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async getFollowUpById(id: string): Promise<FollowUpItem> {
    const response = await api.get<FollowUpItem>(`/follow-ups/${id}`);
    return response.data;
  },

  async createFollowUp(
    payload: CreateFollowUpPayload,
  ): Promise<FollowUpItem> {
    const response = await api.post<FollowUpItem, CreateFollowUpPayload>(
      "/follow-ups",
      payload,
    );

    return response.data;
  },

  async updateFollowUp(
    id: string,
    payload: UpdateFollowUpPayload,
  ): Promise<FollowUpItem> {
    const response = await api.patch<FollowUpItem, UpdateFollowUpPayload>(
      `/follow-ups/${id}`,
      payload,
    );

    return response.data;
  },

  async completeFollowUp(
    id: string,
    payload: CompleteFollowUpPayload = {},
  ): Promise<FollowUpItem> {
    const response = await api.patch<FollowUpItem, CompleteFollowUpPayload>(
      `/follow-ups/${id}/complete`,
      payload,
    );

    return response.data;
  },

  async reopenFollowUp(id: string): Promise<FollowUpItem> {
    const response = await api.patch<FollowUpItem, Record<string, never>>(
      `/follow-ups/${id}/reopen`,
      {},
    );

    return response.data;
  },

  async cancelFollowUp(
    id: string,
    payload?: { notes?: string; canceledAt?: string },
  ): Promise<FollowUpItem> {
    const response = await api.patch<
      FollowUpItem,
      { notes?: string; canceledAt?: string }
    >(`/follow-ups/${id}/cancel`, payload ?? {});

    return response.data;
  },

  async deleteFollowUp(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.delete<{ success: boolean; message?: string }>(
      `/follow-ups/${id}`,
    );

    return response.data;
  },

  async bulkComplete(
    payload: BulkFollowUpActionPayload,
  ): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
    const response = await api.patch<
      { success: boolean; message?: string; updatedCount?: number },
      BulkFollowUpActionPayload
    >("/follow-ups/bulk-complete", payload);

    return response.data;
  },

  async bulkCancel(
    payload: BulkFollowUpActionPayload,
  ): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
    const response = await api.patch<
      { success: boolean; message?: string; updatedCount?: number },
      BulkFollowUpActionPayload
    >("/follow-ups/bulk-cancel", payload);

    return response.data;
  },

  async bulkDelete(
    payload: BulkFollowUpActionPayload,
  ): Promise<{ success: boolean; message?: string; deletedCount?: number }> {
    const response = await api.post<
      { success: boolean; message?: string; deletedCount?: number },
      BulkFollowUpActionPayload
    >("/follow-ups/bulk-delete", payload);

    return response.data;
  },

  async getFollowUpCounts(filters?: {
    ownerId?: string;
    assigneeId?: string;
    contactId?: string;
    leadId?: string;
    dealId?: string;
  }): Promise<{
    all: number;
    pending: number;
    scheduled: number;
    completed: number;
    missed: number;
    canceled: number;
    overdue: number;
    dueToday: number;
    upcoming: number;
  }> {
    const response = await api.get<{
      all: number;
      pending: number;
      scheduled: number;
      completed: number;
      missed: number;
      canceled: number;
      overdue: number;
      dueToday: number;
      upcoming: number;
    }>("/follow-ups/counts", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async getUpcomingFollowUps(
    filters?: Omit<FollowUpFilters, "upcomingOnly">,
  ): Promise<FollowUpItem[]> {
    const response = await api.get<FollowUpItem[]>("/follow-ups/upcoming", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async getTodayFollowUps(
    filters?: Omit<FollowUpFilters, "todayOnly">,
  ): Promise<FollowUpItem[]> {
    const response = await api.get<FollowUpItem[]>("/follow-ups/today", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async getOverdueFollowUps(
    filters?: Omit<FollowUpFilters, "overdueOnly">,
  ): Promise<FollowUpItem[]> {
    const response = await api.get<FollowUpItem[]>("/follow-ups/overdue", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async searchFollowUps(
    query: string,
    extraFilters?: Omit<FollowUpFilters, "search">,
  ): Promise<FollowUpItem[]> {
    const response = await api.get<FollowUpItem[]>("/follow-ups/search", {
      params: cleanParams({
        query,
        ...extraFilters,
      }),
    });

    return response.data;
  },
};

export default followUpsApi;
export { cleanParams };