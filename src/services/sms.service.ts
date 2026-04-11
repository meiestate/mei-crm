// src/services/sms.service.ts

import { apiClient } from "./apiClient";
import type {
  ApiError,
  ApiListResult,
  ApiMutationResult,
  ApiResult,
} from "../types/api";

export type SmsStatus =
  | "draft"
  | "queued"
  | "sent"
  | "failed"
  | "cancelled";

export type SmsPriority = "low" | "normal" | "high";

export type SmsDirection = "outbound" | "inbound";

export type SmsEntityType =
  | "lead"
  | "contact"
  | "deal"
  | "task"
  | "user"
  | "workspace"
  | "other";

export type SmsMessage = {
  id: string;
  workspaceId: string;
  message: string;
  phoneNumber: string;
  senderId?: string;
  senderName?: string;
  status: SmsStatus;
  priority: SmsPriority;
  direction: SmsDirection;
  entityType?: SmsEntityType;
  entityId?: string;
  entityLabel?: string;
  scheduledAt?: string;
  sentAt?: string;
  failedAt?: string;
  failureReason?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type CreateSmsPayload = {
  workspaceId: string;
  message: string;
  phoneNumber: string;
  senderId?: string;
  senderName?: string;
  priority?: SmsPriority;
  direction?: SmsDirection;
  entityType?: SmsEntityType;
  entityId?: string;
  entityLabel?: string;
  scheduledAt?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
};

export type UpdateSmsPayload = Partial<
  Omit<SmsMessage, "id" | "workspaceId" | "createdAt">
>;

export type SmsListParams = {
  workspaceId?: string;
  search?: string;
  status?: SmsStatus | "";
  priority?: SmsPriority | "";
  direction?: SmsDirection | "";
  entityType?: SmsEntityType | "";
  entityId?: string;
  phoneNumber?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
  sortBy?:
    | "createdAt"
    | "updatedAt"
    | "scheduledAt"
    | "sentAt"
    | "status"
    | "priority";
  sortDirection?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
};

export type SmsListData = {
  items: SmsMessage[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const SMS_STORAGE_KEY = "mei-crm-sms";

function nowIso(): string {
  return new Date().toISOString();
}

function createId(prefix = "sms"): string {
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

function normalizeSmsMessage(message: Partial<SmsMessage>): SmsMessage {
  const timestamp = nowIso();

  return {
    id: normalizeText(message.id) || createId(),
    workspaceId: normalizeText(message.workspaceId),
    message: normalizeText(message.message),
    phoneNumber: normalizeText(message.phoneNumber),
    senderId: normalizeText(message.senderId),
    senderName: normalizeText(message.senderName),
    status: message.status ?? "draft",
    priority: message.priority ?? "normal",
    direction: message.direction ?? "outbound",
    entityType: message.entityType ?? "other",
    entityId: normalizeText(message.entityId),
    entityLabel: normalizeText(message.entityLabel),
    scheduledAt: normalizeText(message.scheduledAt),
    sentAt: normalizeText(message.sentAt),
    failedAt: normalizeText(message.failedAt),
    failureReason: normalizeText(message.failureReason),
    tags: normalizeStringArray(message.tags),
    metadata:
      message.metadata && typeof message.metadata === "object"
        ? message.metadata
        : {},
    createdAt: normalizeText(message.createdAt) || timestamp,
    updatedAt: normalizeText(message.updatedAt) || timestamp,
  };
}

function getStoredSms(): SmsMessage[] {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  const parsed = safeParse<SmsMessage[]>(
    storage.getItem(SMS_STORAGE_KEY),
    []
  );

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.map((item) => normalizeSmsMessage(item));
}

function setStoredSms(messages: SmsMessage[]): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(
    SMS_STORAGE_KEY,
    JSON.stringify(messages.map((item) => normalizeSmsMessage(item)))
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

function sortSms(
  messages: SmsMessage[],
  sortBy: NonNullable<SmsListParams["sortBy"]> = "createdAt",
  sortDirection: NonNullable<SmsListParams["sortDirection"]> = "desc"
): SmsMessage[] {
  const multiplier = sortDirection === "asc" ? 1 : -1;

  return [...messages].sort((a, b) => {
    switch (sortBy) {
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

function filterSms(
  messages: SmsMessage[],
  params: SmsListParams
): SmsMessage[] {
  const search = normalizeText(params.search).toLowerCase();
  const phoneNumber = normalizeText(params.phoneNumber).toLowerCase();
  const tag = normalizeText(params.tag);

  return messages.filter((sms) => {
    if (params.workspaceId && sms.workspaceId !== params.workspaceId) {
      return false;
    }

    if (params.status && sms.status !== params.status) {
      return false;
    }

    if (params.priority && sms.priority !== params.priority) {
      return false;
    }

    if (params.direction && sms.direction !== params.direction) {
      return false;
    }

    if (params.entityType && sms.entityType !== params.entityType) {
      return false;
    }

    if (params.entityId && sms.entityId !== params.entityId) {
      return false;
    }

    if (phoneNumber && sms.phoneNumber.toLowerCase() !== phoneNumber) {
      return false;
    }

    if (tag && !(sms.tags ?? []).includes(tag)) {
      return false;
    }

    if (params.startDate) {
      const start = new Date(params.startDate).getTime();
      const created = new Date(sms.createdAt).getTime();

      if (!Number.isNaN(start) && created < start) {
        return false;
      }
    }

    if (params.endDate) {
      const end = new Date(params.endDate).getTime();
      const created = new Date(sms.createdAt).getTime();

      if (!Number.isNaN(end) && created > end) {
        return false;
      }
    }

    if (!search) {
      return true;
    }

    const haystack = [
      sms.message,
      sms.phoneNumber,
      sms.senderId,
      sms.senderName,
      sms.entityId,
      sms.entityLabel,
      sms.entityType,
      ...(sms.tags ?? []),
      sms.failureReason,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search);
  });
}

function paginateSms(
  messages: SmsMessage[],
  page?: number,
  pageSize?: number
): SmsListData {
  const safePage = normalizePage(page);
  const safePageSize = normalizePageSize(pageSize);
  const total = messages.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const startIndex = (safePage - 1) * safePageSize;
  const items = messages.slice(startIndex, startIndex + safePageSize);

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
  data: SmsListData,
  message?: string
): ApiListResult<SmsMessage> {
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

export class SmsService {
  private readonly basePath = "/sms";

  async list(params: SmsListParams = {}): Promise<ApiListResult<SmsMessage>> {
    if (shouldUseApi()) {
      return apiClient.get<ApiListResult<SmsMessage>>(this.basePath, {
        query: params,
      });
    }

    const storedMessages = getStoredSms();
    const filtered = filterSms(storedMessages, params);
    const sorted = sortSms(
      filtered,
      params.sortBy ?? "createdAt",
      params.sortDirection ?? "desc"
    );
    const paginated = paginateSms(sorted, params.page, params.pageSize);

    return createListSuccess(paginated);
  }

  async getById(id: string): Promise<ApiResult<SmsMessage | null>> {
    if (!id.trim()) {
      return createError("SMS ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.get<ApiResult<SmsMessage | null>>(
        `${this.basePath}/${id}`
      );
    }

    const sms = getStoredSms().find((item) => item.id === id) ?? null;
    return createSuccess(sms);
  }

  async createDraft(
    payload: CreateSmsPayload
  ): Promise<ApiMutationResult<SmsMessage>> {
    if (!payload.workspaceId?.trim()) {
      return createError("workspaceId is required.", 400);
    }

    if (!payload.message?.trim()) {
      return createError("message is required.", 400);
    }

    if (!payload.phoneNumber?.trim()) {
      return createError("phoneNumber is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<SmsMessage>, CreateSmsPayload>(
        `${this.basePath}/drafts`,
        payload
      );
    }

    const now = nowIso();

    const nextSms = normalizeSmsMessage({
      ...payload,
      id: createId(),
      status: "draft",
      priority: payload.priority ?? "normal",
      direction: payload.direction ?? "outbound",
      createdAt: now,
      updatedAt: now,
    });

    const messages = getStoredSms();
    const nextMessages = [nextSms, ...messages];
    setStoredSms(nextMessages);

    return createMutationSuccess(nextSms, "SMS draft created successfully.");
  }

  async send(
    payload: CreateSmsPayload
  ): Promise<ApiMutationResult<SmsMessage>> {
    if (!payload.workspaceId?.trim()) {
      return createError("workspaceId is required.", 400);
    }

    if (!payload.message?.trim()) {
      return createError("message is required.", 400);
    }

    if (!payload.phoneNumber?.trim()) {
      return createError("phoneNumber is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<SmsMessage>, CreateSmsPayload>(
        `${this.basePath}/send`,
        payload
      );
    }

    const now = nowIso();

    const nextSms = normalizeSmsMessage({
      ...payload,
      id: createId(),
      status: payload.scheduledAt ? "queued" : "sent",
      priority: payload.priority ?? "normal",
      direction: payload.direction ?? "outbound",
      sentAt: payload.scheduledAt ? "" : now,
      createdAt: now,
      updatedAt: now,
    });

    const messages = getStoredSms();
    const nextMessages = [nextSms, ...messages];
    setStoredSms(nextMessages);

    return createMutationSuccess(nextSms, "SMS processed successfully.");
  }

  async update(
    id: string,
    payload: UpdateSmsPayload
  ): Promise<ApiMutationResult<SmsMessage>> {
    if (!id.trim()) {
      return createError("SMS ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.patch<ApiMutationResult<SmsMessage>, UpdateSmsPayload>(
        `${this.basePath}/${id}`,
        payload
      );
    }

    const messages = getStoredSms();
    const existing = messages.find((item) => item.id === id);

    if (!existing) {
      return createError("SMS not found.", 404);
    }

    const updated = normalizeSmsMessage({
      ...existing,
      ...payload,
      id: existing.id,
      workspaceId: existing.workspaceId,
      createdAt: existing.createdAt,
      updatedAt: nowIso(),
    });

    const nextMessages = messages.map((item) =>
      item.id === id ? updated : item
    );
    setStoredSms(nextMessages);

    return createMutationSuccess(updated, "SMS updated successfully.");
  }

  async remove(id: string): Promise<ApiMutationResult<{ id: string }>> {
    if (!id.trim()) {
      return createError("SMS ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.delete<ApiMutationResult<{ id: string }>>(
        `${this.basePath}/${id}`
      );
    }

    const messages = getStoredSms();
    const exists = messages.some((item) => item.id === id);

    if (!exists) {
      return createError("SMS not found.", 404);
    }

    const nextMessages = messages.filter((item) => item.id !== id);
    setStoredSms(nextMessages);

    return createMutationSuccess({ id }, "SMS deleted successfully.");
  }

  async markAsSent(id: string): Promise<ApiMutationResult<SmsMessage>> {
    if (!id.trim()) {
      return createError("SMS ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<SmsMessage>, { id: string }>(
        `${this.basePath}/${id}/mark-sent`,
        { id }
      );
    }

    const messages = getStoredSms();
    const existing = messages.find((item) => item.id === id);

    if (!existing) {
      return createError("SMS not found.", 404);
    }

    const now = nowIso();

    const updated = normalizeSmsMessage({
      ...existing,
      status: "sent",
      sentAt: now,
      failedAt: "",
      failureReason: "",
      updatedAt: now,
    });

    const nextMessages = messages.map((item) =>
      item.id === id ? updated : item
    );
    setStoredSms(nextMessages);

    return createMutationSuccess(updated, "SMS marked as sent.");
  }

  async markAsFailed(
    id: string,
    reason: string
  ): Promise<ApiMutationResult<SmsMessage>> {
    if (!id.trim()) {
      return createError("SMS ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.post<
        ApiMutationResult<SmsMessage>,
        { id: string; reason: string }
      >(`${this.basePath}/${id}/mark-failed`, { id, reason });
    }

    const messages = getStoredSms();
    const existing = messages.find((item) => item.id === id);

    if (!existing) {
      return createError("SMS not found.", 404);
    }

    const now = nowIso();

    const updated = normalizeSmsMessage({
      ...existing,
      status: "failed",
      failedAt: now,
      failureReason: reason.trim(),
      updatedAt: now,
    });

    const nextMessages = messages.map((item) =>
      item.id === id ? updated : item
    );
    setStoredSms(nextMessages);

    return createMutationSuccess(updated, "SMS marked as failed.");
  }

  async cancel(id: string): Promise<ApiMutationResult<SmsMessage>> {
    if (!id.trim()) {
      return createError("SMS ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<SmsMessage>, { id: string }>(
        `${this.basePath}/${id}/cancel`,
        { id }
      );
    }

    const messages = getStoredSms();
    const existing = messages.find((item) => item.id === id);

    if (!existing) {
      return createError("SMS not found.", 404);
    }

    const updated = normalizeSmsMessage({
      ...existing,
      status: "cancelled",
      updatedAt: nowIso(),
    });

    const nextMessages = messages.map((item) =>
      item.id === id ? updated : item
    );
    setStoredSms(nextMessages);

    return createMutationSuccess(updated, "SMS cancelled successfully.");
  }
}

export const smsService = new SmsService();

export async function listSms(
  params?: SmsListParams
): Promise<ApiListResult<SmsMessage>> {
  return smsService.list(params);
}

export async function getSmsById(
  id: string
): Promise<ApiResult<SmsMessage | null>> {
  return smsService.getById(id);
}

export async function createSmsDraft(
  payload: CreateSmsPayload
): Promise<ApiMutationResult<SmsMessage>> {
  return smsService.createDraft(payload);
}

export async function sendSmsMessage(
  payload: CreateSmsPayload
): Promise<ApiMutationResult<SmsMessage>> {
  return smsService.send(payload);
}

export async function updateSmsMessage(
  id: string,
  payload: UpdateSmsPayload
): Promise<ApiMutationResult<SmsMessage>> {
  return smsService.update(id, payload);
}

export async function deleteSmsMessage(
  id: string
): Promise<ApiMutationResult<{ id: string }>> {
  return smsService.remove(id);
}

export async function markSmsAsSent(
  id: string
): Promise<ApiMutationResult<SmsMessage>> {
  return smsService.markAsSent(id);
}

export async function markSmsAsFailed(
  id: string,
  reason: string
): Promise<ApiMutationResult<SmsMessage>> {
  return smsService.markAsFailed(id, reason);
}

export async function cancelSmsMessage(
  id: string
): Promise<ApiMutationResult<SmsMessage>> {
  return smsService.cancel(id);
}