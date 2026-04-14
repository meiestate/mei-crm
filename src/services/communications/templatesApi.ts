// src/services/communications/templatesApi.ts

import api from "../../prisma/client";

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

export type TemplateVariable = {
  key: string;
  label: string;
  fallbackValue?: string;
  required?: boolean;
  example?: string;
};

export type TemplateAttachment = {
  id: string;
  fileName: string;
  mimeType?: string;
  size?: number;
  downloadUrl?: string;
  previewUrl?: string;
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
  attachments?: TemplateAttachment[];
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
  sortOrder?: "asc" | "desc";
};

export type PaginatedTemplatesResponse = {
  data: TemplateItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateTemplatePayload = {
  name: string;
  description?: string;
  subject?: string;
  body: string;
  htmlBody?: string;
  plainTextBody?: string;
  channel: TemplateChannel;
  category?: TemplateCategory;
  status?: TemplateStatus;
  variables?: TemplateVariable[];
  attachmentIds?: string[];
  tags?: string[];
  isDefault?: boolean;
};

export type UpdateTemplatePayload = Partial<CreateTemplatePayload>;

export type RenderTemplatePayload = {
  variables?: Record<string, string | number | boolean | null | undefined>;
};

export type RenderedTemplateResponse = {
  id: string;
  subject?: string;
  body: string;
  htmlBody?: string;
  plainTextBody?: string;
};

export type BulkTemplateActionPayload = {
  templateIds: string[];
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

const templatesApi = {
  async getTemplates(
    filters?: TemplateFilters,
  ): Promise<PaginatedTemplatesResponse> {
    const response = await api.get<PaginatedTemplatesResponse>(
      "/communication-templates",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getTemplateById(id: string): Promise<TemplateItem> {
    const response = await api.get<TemplateItem>(
      `/communication-templates/${id}`,
    );

    return response.data;
  },

  async createTemplate(
    payload: CreateTemplatePayload,
  ): Promise<TemplateItem> {
    const response = await api.post<TemplateItem, CreateTemplatePayload>(
      "/communication-templates",
      payload,
    );

    return response.data;
  },

  async updateTemplate(
    id: string,
    payload: UpdateTemplatePayload,
  ): Promise<TemplateItem> {
    const response = await api.patch<TemplateItem, UpdateTemplatePayload>(
      `/communication-templates/${id}`,
      payload,
    );

    return response.data;
  },

  async duplicateTemplate(id: string): Promise<TemplateItem> {
    const response = await api.post<TemplateItem, Record<string, never>>(
      `/communication-templates/${id}/duplicate`,
      {},
    );

    return response.data;
  },

  async archiveTemplate(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/communication-templates/${id}/archive`, {});

    return response.data;
  },

  async unarchiveTemplate(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/communication-templates/${id}/unarchive`, {});

    return response.data;
  },

  async favoriteTemplate(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/communication-templates/${id}/favorite`, {});

    return response.data;
  },

  async unfavoriteTemplate(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/communication-templates/${id}/unfavorite`, {});

    return response.data;
  },

  async deleteTemplate(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.delete<{ success: boolean; message?: string }>(
      `/communication-templates/${id}`,
    );

    return response.data;
  },

  async renderTemplate(
    id: string,
    payload?: RenderTemplatePayload,
  ): Promise<RenderedTemplateResponse> {
    const response = await api.post<
      RenderedTemplateResponse,
      RenderTemplatePayload
    >(`/communication-templates/${id}/render`, payload ?? {});

    return response.data;
  },

  async markTemplateUsed(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch<
      { success: boolean; message?: string },
      Record<string, never>
    >(`/communication-templates/${id}/used`, {});

    return response.data;
  },

  async bulkArchive(
    payload: BulkTemplateActionPayload,
  ): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
    const response = await api.patch<
      { success: boolean; message?: string; updatedCount?: number },
      BulkTemplateActionPayload
    >("/communication-templates/bulk-archive", payload);

    return response.data;
  },

  async bulkDelete(
    payload: BulkTemplateActionPayload,
  ): Promise<{ success: boolean; message?: string; deletedCount?: number }> {
    const response = await api.post<
      { success: boolean; message?: string; deletedCount?: number },
      BulkTemplateActionPayload
    >("/communication-templates/bulk-delete", payload);

    return response.data;
  },

  async getTemplateCounts(filters?: {
    createdBy?: string;
  }): Promise<{
    all: number;
    active: number;
    draft: number;
    archived: number;
    favorites: number;
  }> {
    const response = await api.get<{
      all: number;
      active: number;
      draft: number;
      archived: number;
      favorites: number;
    }>("/communication-templates/counts", {
      params: cleanParams(filters),
    });

    return response.data;
  },

  async searchTemplates(
    query: string,
    extraFilters?: Omit<TemplateFilters, "search">,
  ): Promise<TemplateItem[]> {
    const response = await api.get<TemplateItem[]>(
      "/communication-templates/search",
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

export default templatesApi;
export { cleanParams };