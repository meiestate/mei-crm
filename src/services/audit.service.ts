// src/services/audit.service.ts

import { apiClient } from "./apiClient";
import type {
  ApiError,
  ApiListResult,
  ApiMutationResult,
  ApiResult,
} from "../types/api";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "view"
  | "login"
  | "logout"
  | "invite"
  | "export"
  | "assign"
  | "unassign"
  | "status_change"
  | "permission_change"
  | "other";

export type AuditEntityType =
  | "lead"
  | "contact"
  | "deal"
  | "task"
  | "call"
  | "user"
  | "settings"
  | "billing"
  | "report"
  | "workspace"
  | "auth"
  | "other";

export type AuditSeverity = "info" | "warning" | "critical";

export type AuditLog = {
  id: string;
  workspaceId: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string;
  entityLabel?: string;
  module?: string;
  message: string;
  description?: string;
  performedById?: string;
  performedByName?: string;
  performedByEmail?: string;
  severity: AuditSeverity;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type CreateAuditLogPayload = {
  workspaceId: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string;
  entityLabel?: string;
  module?: string;
  message: string;
  description?: string;
  performedById?: string;
  performedByName?: string;
  performedByEmail?: string;
  severity?: AuditSeverity;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
};

export type UpdateAuditLogPayload = Partial<
  Omit<AuditLog, "id" | "workspaceId" | "createdAt">
>;

export type AuditLogListParams = {
  workspaceId?: string;
  search?: string;
  action?: AuditAction | "";
  entityType?: AuditEntityType | "";
  severity?: AuditSeverity | "";
  performedById?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "action" | "entityType" | "severity";
  sortDirection?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
};

export type AuditLogsListData = {
  items: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const AUDIT_STORAGE_KEY = "mei-crm-audit-logs";

function nowIso(): string {
  return new Date().toISOString();
}

function createId(prefix = "audit"): string {
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

function normalizeAuditLog(log: Partial<AuditLog>): AuditLog {
  const timestamp = nowIso();

  return {
    id: normalizeText(log.id) || createId(),
    workspaceId: normalizeText(log.workspaceId),
    action: log.action ?? "other",
    entityType: log.entityType ?? "other",
    entityId: normalizeText(log.entityId),
    entityLabel: normalizeText(log.entityLabel),
    module: normalizeText(log.module),
    message: normalizeText(log.message),
    description: normalizeText(log.description),
    performedById: normalizeText(log.performedById),
    performedByName: normalizeText(log.performedByName),
    performedByEmail: normalizeText(log.performedByEmail),
    severity: log.severity ?? "info",
    ipAddress: normalizeText(log.ipAddress),
    userAgent: normalizeText(log.userAgent),
    metadata:
      log.metadata && typeof log.metadata === "object" ? log.metadata : {},
    createdAt: normalizeText(log.createdAt) || timestamp,
    updatedAt: normalizeText(log.updatedAt) || timestamp,
  };
}

function getStoredLogs(): AuditLog[] {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  const parsed = safeParse<AuditLog[]>(storage.getItem(AUDIT_STORAGE_KEY), []);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.map((item) => normalizeAuditLog(item));
}

function setStoredLogs(logs: AuditLog[]): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(
    AUDIT_STORAGE_KEY,
    JSON.stringify(logs.map((item) => normalizeAuditLog(item)))
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

function sortLogs(
  logs: AuditLog[],
  sortBy: NonNullable<AuditLogListParams["sortBy"]> = "createdAt",
  sortDirection: NonNullable<AuditLogListParams["sortDirection"]> = "desc"
): AuditLog[] {
  const multiplier = sortDirection === "asc" ? 1 : -1;

  return [...logs].sort((a, b) => {
    switch (sortBy) {
      case "action":
        return compareText(a.action, b.action) * multiplier;

      case "entityType":
        return compareText(a.entityType, b.entityType) * multiplier;

      case "severity":
        return compareText(a.severity, b.severity) * multiplier;

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

function filterLogs(logs: AuditLog[], params: AuditLogListParams): AuditLog[] {
  const search = normalizeText(params.search).toLowerCase();

  return logs.filter((log) => {
    if (params.workspaceId && log.workspaceId !== params.workspaceId) {
      return false;
    }

    if (params.action && log.action !== params.action) {
      return false;
    }

    if (params.entityType && log.entityType !== params.entityType) {
      return false;
    }

    if (params.severity && log.severity !== params.severity) {
      return false;
    }

    if (params.performedById && log.performedById !== params.performedById) {
      return false;
    }

    if (params.startDate) {
      const start = new Date(params.startDate).getTime();
      const created = new Date(log.createdAt).getTime();

      if (!Number.isNaN(start) && created < start) {
        return false;
      }
    }

    if (params.endDate) {
      const end = new Date(params.endDate).getTime();
      const created = new Date(log.createdAt).getTime();

      if (!Number.isNaN(end) && created > end) {
        return false;
      }
    }

    if (!search) {
      return true;
    }

    const haystack = [
      log.message,
      log.description,
      log.entityLabel,
      log.entityId,
      log.entityType,
      log.action,
      log.module,
      log.performedByName,
      log.performedByEmail,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search);
  });
}

function paginateLogs(
  logs: AuditLog[],
  page?: number,
  pageSize?: number
): AuditLogsListData {
  const safePage = normalizePage(page);
  const safePageSize = normalizePageSize(pageSize);
  const total = logs.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const startIndex = (safePage - 1) * safePageSize;
  const items = logs.slice(startIndex, startIndex + safePageSize);

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

function createListSuccess(data: AuditLogsListData, message?: string): ApiListResult<AuditLog> {
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

export class AuditService {
  private readonly basePath = "/audit-logs";

  async list(params: AuditLogListParams = {}): Promise<ApiListResult<AuditLog>> {
    if (shouldUseApi()) {
      return apiClient.get<ApiListResult<AuditLog>>(this.basePath, {
        query: params,
      });
    }

    const storedLogs = getStoredLogs();
    const filtered = filterLogs(storedLogs, params);
    const sorted = sortLogs(
      filtered,
      params.sortBy ?? "createdAt",
      params.sortDirection ?? "desc"
    );
    const paginated = paginateLogs(sorted, params.page, params.pageSize);

    return createListSuccess(paginated);
  }

  async getById(id: string): Promise<ApiResult<AuditLog | null>> {
    if (!id.trim()) {
      return createError("Audit log ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.get<ApiResult<AuditLog | null>>(
        `${this.basePath}/${id}`
      );
    }

    const log = getStoredLogs().find((item) => item.id === id) ?? null;
    return createSuccess(log);
  }

  async create(
    payload: CreateAuditLogPayload
  ): Promise<ApiMutationResult<AuditLog>> {
    if (!payload.workspaceId?.trim()) {
      return createError("workspaceId is required.", 400);
    }

    if (!payload.message?.trim()) {
      return createError("message is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<AuditLog>, CreateAuditLogPayload>(
        this.basePath,
        payload
      );
    }

    const now = nowIso();

    const nextLog = normalizeAuditLog({
      ...payload,
      id: createId(),
      severity: payload.severity ?? "info",
      createdAt: now,
      updatedAt: now,
    });

    const logs = getStoredLogs();
    const nextLogs = [nextLog, ...logs];
    setStoredLogs(nextLogs);

    return createMutationSuccess(nextLog, "Audit log created successfully.");
  }

  async update(
    id: string,
    payload: UpdateAuditLogPayload
  ): Promise<ApiMutationResult<AuditLog>> {
    if (!id.trim()) {
      return createError("Audit log ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.patch<ApiMutationResult<AuditLog>, UpdateAuditLogPayload>(
        `${this.basePath}/${id}`,
        payload
      );
    }

    const logs = getStoredLogs();
    const existing = logs.find((item) => item.id === id);

    if (!existing) {
      return createError("Audit log not found.", 404);
    }

    const updated = normalizeAuditLog({
      ...existing,
      ...payload,
      id: existing.id,
      workspaceId: existing.workspaceId,
      createdAt: existing.createdAt,
      updatedAt: nowIso(),
    });

    const nextLogs = logs.map((item) => (item.id === id ? updated : item));
    setStoredLogs(nextLogs);

    return createMutationSuccess(updated, "Audit log updated successfully.");
  }

  async remove(id: string): Promise<ApiMutationResult<{ id: string }>> {
    if (!id.trim()) {
      return createError("Audit log ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.delete<ApiMutationResult<{ id: string }>>(
        `${this.basePath}/${id}`
      );
    }

    const logs = getStoredLogs();
    const exists = logs.some((item) => item.id === id);

    if (!exists) {
      return createError("Audit log not found.", 404);
    }

    const nextLogs = logs.filter((item) => item.id !== id);
    setStoredLogs(nextLogs);

    return createMutationSuccess({ id }, "Audit log deleted successfully.");
  }

  async clearWorkspaceLogs(
    workspaceId: string
  ): Promise<ApiMutationResult<{ workspaceId: string; deletedCount: number }>> {
    if (!workspaceId.trim()) {
      return createError("workspaceId is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.post<
        ApiMutationResult<{ workspaceId: string; deletedCount: number }>,
        { workspaceId: string }
      >(`${this.basePath}/clear`, { workspaceId });
    }

    const logs = getStoredLogs();
    const deletedCount = logs.filter(
      (item) => item.workspaceId === workspaceId
    ).length;
    const nextLogs = logs.filter((item) => item.workspaceId !== workspaceId);

    setStoredLogs(nextLogs);

    return createMutationSuccess(
      { workspaceId, deletedCount },
      "Workspace audit logs cleared successfully."
    );
  }

  async exportWorkspaceLogs(
    workspaceId: string
  ): Promise<ApiResult<AuditLog[]>> {
    if (!workspaceId.trim()) {
      return createError("workspaceId is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.get<ApiResult<AuditLog[]>>(`${this.basePath}/export`, {
        query: { workspaceId },
      });
    }

    const logs = getStoredLogs()
      .filter((item) => item.workspaceId === workspaceId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return createSuccess(logs);
  }

  async log(
    payload: CreateAuditLogPayload
  ): Promise<ApiMutationResult<AuditLog>> {
    return this.create(payload);
  }

  async logUserAction(input: {
    workspaceId: string;
    action: AuditAction;
    message: string;
    entityType?: AuditEntityType;
    entityId?: string;
    entityLabel?: string;
    performedById?: string;
    performedByName?: string;
    performedByEmail?: string;
    severity?: AuditSeverity;
    metadata?: Record<string, unknown>;
    module?: string;
    description?: string;
  }): Promise<ApiMutationResult<AuditLog>> {
    return this.create({
      workspaceId: input.workspaceId,
      action: input.action,
      entityType: input.entityType ?? "user",
      entityId: input.entityId,
      entityLabel: input.entityLabel,
      performedById: input.performedById,
      performedByName: input.performedByName,
      performedByEmail: input.performedByEmail,
      severity: input.severity ?? "info",
      metadata: input.metadata,
      module: input.module ?? "team-users",
      description: input.description,
      message: input.message,
    });
  }
}

export const auditService = new AuditService();

export async function listAuditLogs(
  params?: AuditLogListParams
): Promise<ApiListResult<AuditLog>> {
  return auditService.list(params);
}

export async function getAuditLogById(
  id: string
): Promise<ApiResult<AuditLog | null>> {
  return auditService.getById(id);
}

export async function createAuditLog(
  payload: CreateAuditLogPayload
): Promise<ApiMutationResult<AuditLog>> {
  return auditService.create(payload);
}

export async function updateAuditLog(
  id: string,
  payload: UpdateAuditLogPayload
): Promise<ApiMutationResult<AuditLog>> {
  return auditService.update(id, payload);
}

export async function deleteAuditLog(
  id: string
): Promise<ApiMutationResult<{ id: string }>> {
  return auditService.remove(id);
}

export async function clearWorkspaceAuditLogs(
  workspaceId: string
): Promise<ApiMutationResult<{ workspaceId: string; deletedCount: number }>> {
  return auditService.clearWorkspaceLogs(workspaceId);
}

export async function exportWorkspaceAuditLogs(
  workspaceId: string
): Promise<ApiResult<AuditLog[]>> {
  return auditService.exportWorkspaceLogs(workspaceId);
}