// src/types/template.types.ts

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

export type TemplateSortOrder = "asc" | "desc";

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
  sortOrder?: TemplateSortOrder;
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

export type TemplateCountsResponse = {
  all: number;
  active: number;
  draft: number;
  archived: number;
  favorites: number;
};

export type TemplateSearchResponse = TemplateItem[];