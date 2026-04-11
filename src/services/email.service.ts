// src/services/email.service.ts

import { apiClient } from "./apiClient";
import type {
  ApiError,
  ApiListResult,
  ApiMutationResult,
  ApiResult,
} from "../types/api";

export type EmailStatus =
  | "draft"
  | "queued"
  | "sent"
  | "failed"
  | "cancelled";

export type EmailPriority = "low" | "normal" | "high";

export type EmailDirection = "outbound" | "inbound";

export type EmailEntityType =
  | "lead"
  | "contact"
  | "deal"
  | "task"
  | "user"
  | "workspace"
  | "other";

export type EmailAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
};

export type EmailMessage = {
  id: string;
  workspaceId: string;
  subject: string;
  body: string;
  fromEmail: string;
  fromName?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  status: EmailStatus;
  priority: EmailPriority;
  direction: EmailDirection;
  entityType?: EmailEntityType;
  entityId?: string;
  entityLabel?: string;
  scheduledAt?: string;
  sentAt?: string;
  failedAt?: string;
  failureReason?: string;
  attachments?: EmailAttachment[];
  tags?: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type CreateEmailPayload = {
  workspaceId: string;
  subject: string;
  body: string;
  fromEmail: string;
  fromName?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  priority?: EmailPriority;
  direction?: EmailDirection;
  entityType?: EmailEntityType;
  entityId?: string;
  entityLabel?: string;
  scheduledAt?: string;
  attachments?: EmailAttachment[];
  tags?: string[];
  metadata?: Record<string, unknown>;
};

export type UpdateEmailPayload = Partial<
  Omit<EmailMessage, "id" | "workspaceId" | "createdAt">
>;

export type EmailListParams = {
  workspaceId?: string;
  search?: string;
  status?: EmailStatus | "";
  priority?: EmailPriority | "";
  direction?: EmailDirection | "";
  entityType?: EmailEntityType | "";
  entityId?: string;
  fromEmail?: string;
  toEmail?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
  sortBy?:
    | "createdAt"
    | "updatedAt"
    | "scheduledAt"
    | "sentAt"
    | "subject"
    | "status"
    | "priority";
  sortDirection?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
};

export type EmailListData = {
  items: EmailMessage[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const EMAIL_STORAGE_KEY = "mei-crm-emails";

function nowIso(): string {
  return new Date().toISOString();
}

function createId(prefix = "email"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    if (!value) {
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function normalizeAttachments(value: unknown): EmailAttachment[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Partial<EmailAttachment> => Boolean(item))
    .map((item) => ({
      id: normalizeText(item.id) || createId("attachment"),
      name: normalizeText(item.name),
      size:
        typeof item.size === "number" && Number.isFinite(item.size)
          ? item.size
          : 0,
      type: normalizeText(item.type),
      url: normalizeText(item.url),
    }));
}

function normalizeEmailMessage(email: Partial<EmailMessage>): EmailMessage {
  const timestamp = nowIso();

  return {
    id: normalizeText(email.id) || createId(),
    workspaceId: normalizeText(email.workspaceId),
    subject: normalizeText(email.subject),
    body: normalizeText(email.body),
    fromEmail: normalizeText(email.fromEmail),
    fromName: normalizeText(email.fromName),
    to: normalizeStringArray(email.to),
    cc: normalizeStringArray(email.cc),
    bcc: normalizeStringArray(email.bcc),
    replyTo: normalizeText(email.replyTo),
    status: email.status ?? "draft",
    priority: email.priority ?? "normal",
    direction: email.direction ?? "outbound",
    entityType: email.entityType ?? "other",
    entityId: normalizeText(email.entityId),
    entityLabel: normalizeText(email.entityLabel),
    scheduledAt: normalizeText(email.scheduledAt),
    sentAt: normalizeText(email.sentAt),
    failedAt: normalizeText(email.failedAt),
    failureReason: normalizeText(email.failureReason),
    attachments: normalizeAttachments(email.attachments),
    tags: normalizeStringArray(email.tags),
    metadata:
      email.metadata && typeof email.metadata === "object" ? email.metadata : {},
    createdAt: normalizeText(email.createdAt) || timestamp,
    updatedAt: normalizeText(email.updatedAt) || timestamp,
  };
}

function getStoredEmails(): EmailMessage[] {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  const parsed = safeParse<EmailMessage[]>(
    storage.getItem(EMAIL_STORAGE_KEY),
    []
  );

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.map((item) => normalizeEmailMessage(item));
}

function setStoredEmails(emails: EmailMessage[]): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(
    EMAIL_STORAGE_KEY,
    JSON.stringify(emails.map((item) => normalizeEmailMessage(item)))
  );
}

function normalizePage(value?: number): number {
  if (typeof value !== "number" || Number.isNaN(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

function normalizePageSize(value?: number): number {
  if (typeof value !== "number" || Number.isNaN(value) || value < 1) {
    return 10;
  }

  return Math.min(200, Math.floor(value));
}

function compareText(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function sortEmails(
  emails: EmailMessage[],
  sortBy: NonNullable<EmailListParams["sortBy"]> = "createdAt",
  sortDirection: NonNullable<EmailListParams["sortDirection"]> = "desc"
): EmailMessage[] {
  const multiplier = sortDirection === "asc" ? 1 : -1;

  return [...emails].sort((a, b) => {
    switch (sortBy) {
      case "subject":
        return compareText(a.subject, b.subject) * multiplier;

      case "status":
        return compareText(a.status, b.status) * multiplier;

      case "priority":
        return compareText(a.priority, b.priority) * multiplier;

      case "scheduledAt":
        return (
          (new Date(a.scheduledAt || 0).getTime() -
            new Date(b.scheduledAt || 0).getTime()) *
          multiplier
        );

      case "sentAt":
        return (
          (new Date(a.sentAt || 0).getTime() -
            new Date(b.sentAt || 0).getTime()) *
          multiplier
        );

      case "updatedAt":
        return (
          (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) *
          multiplier
        );

      case "createdAt":
      default:
        return (
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
          multiplier
        );
    }
  });
}

function filterEmails(
  emails: EmailMessage[],
  params: EmailListParams
): EmailMessage[] {
  const search = normalizeText(params.search).toLowerCase();
  const fromEmail = normalizeText(params.fromEmail).toLowerCase();
  const toEmail = normalizeText(params.toEmail).toLowerCase();
  const tag = normalizeText(params.tag);

  return emails.filter((email) => {
    if (params.workspaceId && email.workspaceId !== params.workspaceId) {
      return false;
    }

    if (params.status && email.status !== params.status) {
      return false;
    }

    if (params.priority && email.priority !== params.priority) {
      return false;
    }

    if (params.direction && email.direction !== params.direction) {
      return false;
    }

    if (params.entityType && email.entityType !== params.entityType) {
      return false;
    }

    if (params.entityId && email.entityId !== params.entityId) {
      return false;
    }

    if (fromEmail && email.fromEmail.toLowerCase() !== fromEmail) {
      return false;
    }

    if (
      toEmail &&
      !email.to.some((item) => item.toLowerCase() === toEmail)
    ) {
      return false;
    }

    if (tag && !(email.tags ?? []).includes(tag)) {
      return false;
    }

    if (params.startDate) {
      const start = new Date(params.startDate).getTime();
      const created = new Date(email.createdAt).getTime();

      if (!Number.isNaN(start) && created < start) {
        return false;
      }
    }

    if (params.endDate) {
      const end = new Date(params.endDate).getTime();
      const created = new Date(email.createdAt).getTime();

      if (!Number.isNaN(end) && created > end) {
        return false;
      }
    }

    if (!search) {
      return true;
    }

    const haystack = [
      email.subject,
      email.body,
      email.fromEmail,
      email.fromName,
      ...(email.to ?? []),
      ...(email.cc ?? []),
      ...(email.bcc ?? []),
      email.entityId,
      email.entityLabel,
      email.entityType,
      ...(email.tags ?? []),
      email.failureReason,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search);
  });
}

function paginateEmails(
  emails: EmailMessage[],
  page?: number,
  pageSize?: number
): EmailListData {
  const safePage = normalizePage(page);
  const safePageSize = normalizePageSize(pageSize);
  const total = emails.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const startIndex = (safePage - 1) * safePageSize;
  const items = emails.slice(startIndex, startIndex + safePageSize);

  return {
    items,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
}

function createSuccess<T>(data: T, message?: string): ApiResult<T> {
  return {
    success: true,
    data,
    message,
  };
}

function createListSuccess(
  data: EmailListData,
  message?: string
): ApiListResult<EmailMessage> {
  return {
    success: true,
    data,
    message,
  };
}

function createMutationSuccess<T>(
  data: T,
  message: string
): ApiMutationResult<T> {
  return {
    success: true,
    data,
    message,
  };
}

function createError(message: string, statusCode = 500): ApiError {
  return {
    success: false,
    message,
    statusCode,
  };
}

function shouldUseApi(): boolean {
  try {
    const baseUrl =
      typeof import.meta !== "undefined" &&
      (import.meta as ImportMeta & {
        env?: Record<string, string | undefined>;
      }).env?.VITE_API_BASE_URL;

    return Boolean(baseUrl && String(baseUrl).trim());
  } catch {
    return false;
  }
}

export class EmailService {
  private readonly basePath = "/emails";

  async list(params: EmailListParams = {}): Promise<ApiListResult<EmailMessage>> {
    if (shouldUseApi()) {
      return apiClient.get<ApiListResult<EmailMessage>>(this.basePath, {
        query: params,
      });
    }

    const storedEmails = getStoredEmails();
    const filtered = filterEmails(storedEmails, params);
    const sorted = sortEmails(
      filtered,
      params.sortBy ?? "createdAt",
      params.sortDirection ?? "desc"
    );
    const paginated = paginateEmails(sorted, params.page, params.pageSize);

    return createListSuccess(paginated);
  }

  async getById(id: string): Promise<ApiResult<EmailMessage | null>> {
    if (!id.trim()) {
      return createError("Email ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.get<ApiResult<EmailMessage | null>>(
        `${this.basePath}/${id}`
      );
    }

    const email = getStoredEmails().find((item) => item.id === id) ?? null;
    return createSuccess(email);
  }

  async createDraft(
    payload: CreateEmailPayload
  ): Promise<ApiMutationResult<EmailMessage>> {
    if (!payload.workspaceId?.trim()) {
      return createError("workspaceId is required.", 400);
    }

    if (!payload.subject?.trim()) {
      return createError("subject is required.", 400);
    }

    if (!payload.fromEmail?.trim()) {
      return createError("fromEmail is required.", 400);
    }

    if (!Array.isArray(payload.to) || payload.to.length === 0) {
      return createError("At least one recipient is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<EmailMessage>, CreateEmailPayload>(
        `${this.basePath}/drafts`,
        payload
      );
    }

    const now = nowIso();

    const nextEmail = normalizeEmailMessage({
      ...payload,
      id: createId(),
      status: "draft",
      priority: payload.priority ?? "normal",
      direction: payload.direction ?? "outbound",
      createdAt: now,
      updatedAt: now,
    });

    const emails = getStoredEmails();
    const nextEmails = [nextEmail, ...emails];
    setStoredEmails(nextEmails);

    return createMutationSuccess(nextEmail, "Email draft created successfully.");
  }

  async send(
    payload: CreateEmailPayload
  ): Promise<ApiMutationResult<EmailMessage>> {
    if (!payload.workspaceId?.trim()) {
      return createError("workspaceId is required.", 400);
    }

    if (!payload.subject?.trim()) {
      return createError("subject is required.", 400);
    }

    if (!payload.fromEmail?.trim()) {
      return createError("fromEmail is required.", 400);
    }

    if (!Array.isArray(payload.to) || payload.to.length === 0) {
      return createError("At least one recipient is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<EmailMessage>, CreateEmailPayload>(
        `${this.basePath}/send`,
        payload
      );
    }

    const now = nowIso();

    const nextEmail = normalizeEmailMessage({
      ...payload,
      id: createId(),
      status: payload.scheduledAt ? "queued" : "sent",
      priority: payload.priority ?? "normal",
      direction: payload.direction ?? "outbound",
      sentAt: payload.scheduledAt ? "" : now,
      createdAt: now,
      updatedAt: now,
    });

    const emails = getStoredEmails();
    const nextEmails = [nextEmail, ...emails];
    setStoredEmails(nextEmails);

    return createMutationSuccess(nextEmail, "Email processed successfully.");
  }

  async update(
    id: string,
    payload: UpdateEmailPayload
  ): Promise<ApiMutationResult<EmailMessage>> {
    if (!id.trim()) {
      return createError("Email ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.patch<ApiMutationResult<EmailMessage>, UpdateEmailPayload>(
        `${this.basePath}/${id}`,
        payload
      );
    }

    const emails = getStoredEmails();
    const existing = emails.find((item) => item.id === id);

    if (!existing) {
      return createError("Email not found.", 404);
    }

    const updated = normalizeEmailMessage({
      ...existing,
      ...payload,
      id: existing.id,
      workspaceId: existing.workspaceId,
      createdAt: existing.createdAt,
      updatedAt: nowIso(),
    });

    const nextEmails = emails.map((item) => (item.id === id ? updated : item));
    setStoredEmails(nextEmails);

    return createMutationSuccess(updated, "Email updated successfully.");
  }

  async remove(id: string): Promise<ApiMutationResult<{ id: string }>> {
    if (!id.trim()) {
      return createError("Email ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.delete<ApiMutationResult<{ id: string }>>(
        `${this.basePath}/${id}`
      );
    }

    const emails = getStoredEmails();
    const exists = emails.some((item) => item.id === id);

    if (!exists) {
      return createError("Email not found.", 404);
    }

    const nextEmails = emails.filter((item) => item.id !== id);
    setStoredEmails(nextEmails);

    return createMutationSuccess({ id }, "Email deleted successfully.");
  }

  async markAsSent(id: string): Promise<ApiMutationResult<EmailMessage>> {
    if (!id.trim()) {
      return createError("Email ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<EmailMessage>, { id: string }>(
        `${this.basePath}/${id}/mark-sent`,
        { id }
      );
    }

    const emails = getStoredEmails();
    const existing = emails.find((item) => item.id === id);

    if (!existing) {
      return createError("Email not found.", 404);
    }

    const now = nowIso();

    const updated = normalizeEmailMessage({
      ...existing,
      status: "sent",
      sentAt: now,
      failedAt: "",
      failureReason: "",
      updatedAt: now,
    });

    const nextEmails = emails.map((item) => (item.id === id ? updated : item));
    setStoredEmails(nextEmails);

    return createMutationSuccess(updated, "Email marked as sent.");
  }

  async markAsFailed(
    id: string,
    reason: string
  ): Promise<ApiMutationResult<EmailMessage>> {
    if (!id.trim()) {
      return createError("Email ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.post<
        ApiMutationResult<EmailMessage>,
        { id: string; reason: string }
      >(`${this.basePath}/${id}/mark-failed`, { id, reason });
    }

    const emails = getStoredEmails();
    const existing = emails.find((item) => item.id === id);

    if (!existing) {
      return createError("Email not found.", 404);
    }

    const now = nowIso();

    const updated = normalizeEmailMessage({
      ...existing,
      status: "failed",
      failedAt: now,
      failureReason: reason.trim(),
      updatedAt: now,
    });

    const nextEmails = emails.map((item) => (item.id === id ? updated : item));
    setStoredEmails(nextEmails);

    return createMutationSuccess(updated, "Email marked as failed.");
  }

  async cancel(id: string): Promise<ApiMutationResult<EmailMessage>> {
    if (!id.trim()) {
      return createError("Email ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<EmailMessage>, { id: string }>(
        `${this.basePath}/${id}/cancel`,
        { id }
      );
    }

    const emails = getStoredEmails();
    const existing = emails.find((item) => item.id === id);

    if (!existing) {
      return createError("Email not found.", 404);
    }

    const updated = normalizeEmailMessage({
      ...existing,
      status: "cancelled",
      updatedAt: nowIso(),
    });

    const nextEmails = emails.map((item) => (item.id === id ? updated : item));
    setStoredEmails(nextEmails);

    return createMutationSuccess(updated, "Email cancelled successfully.");
  }
}

export const emailService = new EmailService();

export async function listEmails(
  params?: EmailListParams
): Promise<ApiListResult<EmailMessage>> {
  return emailService.list(params);
}

export async function getEmailById(
  id: string
): Promise<ApiResult<EmailMessage | null>> {
  return emailService.getById(id);
}

export async function createEmailDraft(
  payload: CreateEmailPayload
): Promise<ApiMutationResult<EmailMessage>> {
  return emailService.createDraft(payload);
}

export async function sendEmailMessage(
  payload: CreateEmailPayload
): Promise<ApiMutationResult<EmailMessage>> {
  return emailService.send(payload);
}

export async function updateEmailMessage(
  id: string,
  payload: UpdateEmailPayload
): Promise<ApiMutationResult<EmailMessage>> {
  return emailService.update(id, payload);
}

export async function deleteEmailMessage(
  id: string
): Promise<ApiMutationResult<{ id: string }>> {
  return emailService.remove(id);
}

export async function markEmailAsSent(
  id: string
): Promise<ApiMutationResult<EmailMessage>> {
  return emailService.markAsSent(id);
}

export async function markEmailAsFailed(
  id: string,
  reason: string
): Promise<ApiMutationResult<EmailMessage>> {
  return emailService.markAsFailed(id, reason);
}

export async function cancelEmailMessage(
  id: string
): Promise<ApiMutationResult<EmailMessage>> {
  return emailService.cancel(id);
}