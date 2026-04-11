// src/services/teamUsersService.ts

import { apiClient } from "./apiClient";
import type {
  ApiError,
  ApiListResult,
  ApiMutationResult,
  ApiResult,
} from "../types/api";
import type {
  TeamUser,
  TeamUserDepartment,
  TeamUserPermission,
  TeamUserRole,
  TeamUserStatus,
  TeamUsersSummary,
} from "../types/team-users";
import {
  TEAM_USERS_STORAGE_KEY,
  createEmployeeCode,
  createTeamUserId,
  getDefaultPermissionsByRole,
} from "../types/team-users";

export type TeamUsersListParams = {
  workspaceId?: string;
  search?: string;
  role?: TeamUserRole | "";
  status?: TeamUserStatus | "";
  department?: TeamUserDepartment | "";
  reportingTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?:
    | "fullName"
    | "email"
    | "role"
    | "status"
    | "department"
    | "joinedOn"
    | "lastActive"
    | "monthlyRevenue"
    | "conversionRate";
  sortDirection?: "asc" | "desc";
};

export type TeamUsersListData = {
  items: TeamUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type CreateTeamUserPayload = {
  workspaceId: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: TeamUserRole;
  department?: TeamUserDepartment;
  status?: TeamUserStatus;
  location?: string;
  reportingTo?: string;
  joinedOn?: string;
  lastActive?: string;
  timezone?: string;
  assignedLeads?: number;
  activeDeals?: number;
  tasksDueToday?: number;
  monthlyRevenue?: number;
  conversionRate?: number;
  permissions?: TeamUserPermission[];
  emailVerified?: boolean;
  phoneVerified?: boolean;
  notes?: string;
};

export type UpdateTeamUserPayload = Partial<
  Omit<TeamUser, "id" | "workspaceId" | "employeeCode" | "createdAt">
>;

const DEFAULT_PAGE_SIZE = 10;

function nowIso(): string {
  return new Date().toISOString();
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

function normalizeNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function normalizeBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function normalizePermissions(
  value: unknown,
  role: TeamUserRole
): TeamUserPermission[] {
  if (!Array.isArray(value)) {
    return getDefaultPermissionsByRole(role);
  }

  return Array.from(
    new Set(
      value.filter(
        (item): item is TeamUserPermission => typeof item === "string"
      )
    )
  );
}

function normalizeTeamUser(user: Partial<TeamUser>): TeamUser {
  const timestamp = nowIso();
  const role = (user.role ?? "agent") as TeamUserRole;

  return {
    id: normalizeText(user.id) || createTeamUserId(),
    employeeCode: normalizeText(user.employeeCode) || createEmployeeCode(),
    workspaceId: normalizeText(user.workspaceId),
    fullName: normalizeText(user.fullName),
    email: normalizeText(user.email),
    phone: normalizeText(user.phone),
    avatar: normalizeText(user.avatar),
    role,
    department: (user.department ?? "Sales") as TeamUserDepartment,
    status: (user.status ?? "pending") as TeamUserStatus,
    location: normalizeText(user.location),
    reportingTo: normalizeText(user.reportingTo),
    joinedOn: normalizeText(user.joinedOn) || timestamp,
    lastActive: normalizeText(user.lastActive) || timestamp,
    timezone: normalizeText(user.timezone) || "Asia/Kolkata",
    assignedLeads: normalizeNumber(user.assignedLeads, 0),
    activeDeals: normalizeNumber(user.activeDeals, 0),
    tasksDueToday: normalizeNumber(user.tasksDueToday, 0),
    monthlyRevenue: normalizeNumber(user.monthlyRevenue, 0),
    conversionRate: normalizeNumber(user.conversionRate, 0),
    permissions: normalizePermissions(user.permissions, role),
    emailVerified: normalizeBoolean(user.emailVerified, false),
    phoneVerified: normalizeBoolean(user.phoneVerified, false),
    notes: normalizeText(user.notes),
    createdAt: normalizeText(user.createdAt) || timestamp,
    updatedAt: normalizeText(user.updatedAt) || timestamp,
  };
}

function getStoredTeamUsers(): TeamUser[] {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  const parsed = safeParse<{
    workspaceId?: string;
    users?: TeamUser[];
  }>(storage.getItem(TEAM_USERS_STORAGE_KEY), { users: [] });

  if (!Array.isArray(parsed.users)) {
    return [];
  }

  return parsed.users.map((item) => normalizeTeamUser(item));
}

function setStoredTeamUsers(users: TeamUser[]): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const normalizedUsers = users.map((item) => normalizeTeamUser(item));
  const workspaceId = normalizedUsers[0]?.workspaceId ?? "";

  storage.setItem(
    TEAM_USERS_STORAGE_KEY,
    JSON.stringify({
      workspaceId,
      users: normalizedUsers,
    })
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
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(200, Math.floor(value));
}

function compareText(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function sortTeamUsers(
  users: TeamUser[],
  sortBy: NonNullable<TeamUsersListParams["sortBy"]> = "fullName",
  sortDirection: NonNullable<TeamUsersListParams["sortDirection"]> = "asc"
): TeamUser[] {
  const multiplier = sortDirection === "asc" ? 1 : -1;

  return [...users].sort((a, b) => {
    switch (sortBy) {
      case "email":
        return compareText(a.email, b.email) * multiplier;

      case "role":
        return compareText(a.role, b.role) * multiplier;

      case "status":
        return compareText(a.status, b.status) * multiplier;

      case "department":
        return compareText(a.department, b.department) * multiplier;

      case "joinedOn":
        return (
          (new Date(a.joinedOn).getTime() - new Date(b.joinedOn).getTime()) *
          multiplier
        );

      case "lastActive":
        return (
          (new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()) *
          multiplier
        );

      case "monthlyRevenue":
        return (a.monthlyRevenue - b.monthlyRevenue) * multiplier;

      case "conversionRate":
        return (a.conversionRate - b.conversionRate) * multiplier;

      case "fullName":
      default:
        return compareText(a.fullName, b.fullName) * multiplier;
    }
  });
}

function filterTeamUsers(
  users: TeamUser[],
  params: TeamUsersListParams
): TeamUser[] {
  const search = normalizeText(params.search).toLowerCase();
  const reportingTo = normalizeText(params.reportingTo).toLowerCase();

  return users.filter((user) => {
    if (params.workspaceId && user.workspaceId !== params.workspaceId) {
      return false;
    }

    if (params.role && user.role !== params.role) {
      return false;
    }

    if (params.status && user.status !== params.status) {
      return false;
    }

    if (params.department && user.department !== params.department) {
      return false;
    }

    if (
      reportingTo &&
      normalizeText(user.reportingTo).toLowerCase() !== reportingTo
    ) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystack = [
      user.fullName,
      user.email,
      user.phone,
      user.employeeCode,
      user.role,
      user.status,
      user.department,
      user.location,
      user.reportingTo,
      user.notes,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search);
  });
}

function paginateTeamUsers(
  users: TeamUser[],
  page?: number,
  pageSize?: number
): TeamUsersListData {
  const safePage = normalizePage(page);
  const safePageSize = normalizePageSize(pageSize);
  const total = users.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const startIndex = (safePage - 1) * safePageSize;
  const items = users.slice(startIndex, startIndex + safePageSize);

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

function buildSummary(users: TeamUser[]): TeamUsersSummary {
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "active").length;
  const inactiveUsers = users.filter((user) => user.status === "inactive").length;
  const invitedUsers = users.filter((user) => user.status === "invited").length;
  const pendingUsers = users.filter((user) => user.status === "pending").length;
  const suspendedUsers = users.filter((user) => user.status === "suspended").length;

  const totalAssignedLeads = users.reduce(
    (sum, user) => sum + user.assignedLeads,
    0
  );
  const totalActiveDeals = users.reduce(
    (sum, user) => sum + user.activeDeals,
    0
  );
  const totalTasksDueToday = users.reduce(
    (sum, user) => sum + user.tasksDueToday,
    0
  );
  const totalMonthlyRevenue = users.reduce(
    (sum, user) => sum + user.monthlyRevenue,
    0
  );

  const averageConversionRate =
    totalUsers > 0
      ? Number(
          (
            users.reduce((sum, user) => sum + user.conversionRate, 0) /
            totalUsers
          ).toFixed(2)
        )
      : 0;

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    invitedUsers,
    pendingUsers,
    suspendedUsers,
    totalAssignedLeads,
    totalActiveDeals,
    totalTasksDueToday,
    totalMonthlyRevenue,
    averageConversionRate,
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
  data: TeamUsersListData,
  message?: string
): ApiListResult<TeamUser> {
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

export class TeamUsersService {
  private readonly basePath = "/team-users";

  async list(params: TeamUsersListParams = {}): Promise<ApiListResult<TeamUser>> {
    if (shouldUseApi()) {
      return apiClient.get<ApiListResult<TeamUser>>(this.basePath, {
        query: params,
      });
    }

    const storedUsers = getStoredTeamUsers();
    const filtered = filterTeamUsers(storedUsers, params);
    const sorted = sortTeamUsers(
      filtered,
      params.sortBy ?? "fullName",
      params.sortDirection ?? "asc"
    );
    const paginated = paginateTeamUsers(sorted, params.page, params.pageSize);

    return createListSuccess(paginated);
  }

  async getById(id: string): Promise<ApiResult<TeamUser | null>> {
    if (!id.trim()) {
      return createError("Team user ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.get<ApiResult<TeamUser | null>>(
        `${this.basePath}/${id}`
      );
    }

    const user = getStoredTeamUsers().find((item) => item.id === id) ?? null;
    return createSuccess(user);
  }

  async create(
    payload: CreateTeamUserPayload
  ): Promise<ApiMutationResult<TeamUser>> {
    if (!payload.workspaceId?.trim()) {
      return createError("workspaceId is required.", 400);
    }

    if (!payload.fullName?.trim()) {
      return createError("fullName is required.", 400);
    }

    if (!payload.email?.trim()) {
      return createError("email is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<TeamUser>, CreateTeamUserPayload>(
        this.basePath,
        payload
      );
    }

    const users = getStoredTeamUsers();

    const existingEmail = users.find(
      (item) =>
        item.workspaceId === payload.workspaceId &&
        item.email.toLowerCase() === payload.email.trim().toLowerCase()
    );

    if (existingEmail) {
      return createError("A team user with this email already exists.", 409);
    }

    const now = nowIso();
    const role = payload.role ?? "agent";

    const nextUser = normalizeTeamUser({
      ...payload,
      id: createTeamUserId(),
      employeeCode: createEmployeeCode(),
      role,
      department: payload.department ?? "Sales",
      status: payload.status ?? "pending",
      permissions: payload.permissions ?? getDefaultPermissionsByRole(role),
      joinedOn: payload.joinedOn ?? now,
      lastActive: payload.lastActive ?? now,
      timezone: payload.timezone ?? "Asia/Kolkata",
      assignedLeads: payload.assignedLeads ?? 0,
      activeDeals: payload.activeDeals ?? 0,
      tasksDueToday: payload.tasksDueToday ?? 0,
      monthlyRevenue: payload.monthlyRevenue ?? 0,
      conversionRate: payload.conversionRate ?? 0,
      emailVerified: payload.emailVerified ?? false,
      phoneVerified: payload.phoneVerified ?? false,
      createdAt: now,
      updatedAt: now,
    });

    const nextUsers = [nextUser, ...users];
    setStoredTeamUsers(nextUsers);

    return createMutationSuccess(nextUser, "Team user created successfully.");
  }

  async update(
    id: string,
    payload: UpdateTeamUserPayload
  ): Promise<ApiMutationResult<TeamUser>> {
    if (!id.trim()) {
      return createError("Team user ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.patch<ApiMutationResult<TeamUser>, UpdateTeamUserPayload>(
        `${this.basePath}/${id}`,
        payload
      );
    }

    const users = getStoredTeamUsers();
    const existing = users.find((item) => item.id === id);

    if (!existing) {
      return createError("Team user not found.", 404);
    }

    const nextRole = payload.role ?? existing.role;

    const updated = normalizeTeamUser({
      ...existing,
      ...payload,
      id: existing.id,
      workspaceId: existing.workspaceId,
      employeeCode: existing.employeeCode,
      permissions:
        payload.permissions ??
        (payload.role
          ? getDefaultPermissionsByRole(nextRole)
          : existing.permissions),
      createdAt: existing.createdAt,
      updatedAt: nowIso(),
    });

    const nextUsers = users.map((item) => (item.id === id ? updated : item));
    setStoredTeamUsers(nextUsers);

    return createMutationSuccess(updated, "Team user updated successfully.");
  }

  async remove(id: string): Promise<ApiMutationResult<{ id: string }>> {
    if (!id.trim()) {
      return createError("Team user ID is required.", 400);
    }

    if (shouldUseApi()) {
      return apiClient.delete<ApiMutationResult<{ id: string }>>(
        `${this.basePath}/${id}`
      );
    }

    const users = getStoredTeamUsers();
    const exists = users.some((item) => item.id === id);

    if (!exists) {
      return createError("Team user not found.", 404);
    }

    const nextUsers = users.filter((item) => item.id !== id);
    setStoredTeamUsers(nextUsers);

    return createMutationSuccess({ id }, "Team user deleted successfully.");
  }

  async invite(id: string): Promise<ApiMutationResult<TeamUser>> {
    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<TeamUser>, { id: string }>(
        `${this.basePath}/${id}/invite`,
        { id }
      );
    }

    return this.update(id, {
      status: "invited",
      lastActive: nowIso(),
    });
  }

  async activate(id: string): Promise<ApiMutationResult<TeamUser>> {
    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<TeamUser>, { id: string }>(
        `${this.basePath}/${id}/activate`,
        { id }
      );
    }

    return this.update(id, {
      status: "active",
      lastActive: nowIso(),
    });
  }

  async deactivate(id: string): Promise<ApiMutationResult<TeamUser>> {
    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<TeamUser>, { id: string }>(
        `${this.basePath}/${id}/deactivate`,
        { id }
      );
    }

    return this.update(id, {
      status: "inactive",
    });
  }

  async suspend(id: string): Promise<ApiMutationResult<TeamUser>> {
    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<TeamUser>, { id: string }>(
        `${this.basePath}/${id}/suspend`,
        { id }
      );
    }

    return this.update(id, {
      status: "suspended",
    });
  }

  async verifyEmail(id: string): Promise<ApiMutationResult<TeamUser>> {
    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<TeamUser>, { id: string }>(
        `${this.basePath}/${id}/verify-email`,
        { id }
      );
    }

    return this.update(id, {
      emailVerified: true,
    });
  }

  async verifyPhone(id: string): Promise<ApiMutationResult<TeamUser>> {
    if (shouldUseApi()) {
      return apiClient.post<ApiMutationResult<TeamUser>, { id: string }>(
        `${this.basePath}/${id}/verify-phone`,
        { id }
      );
    }

    return this.update(id, {
      phoneVerified: true,
    });
  }

  async getSummary(
    workspaceId?: string
  ): Promise<ApiResult<TeamUsersSummary>> {
    if (shouldUseApi()) {
      return apiClient.get<ApiResult<TeamUsersSummary>>(
        `${this.basePath}/summary`,
        {
          query: { workspaceId },
        }
      );
    }

    const users = getStoredTeamUsers().filter((item) =>
      workspaceId ? item.workspaceId === workspaceId : true
    );

    return createSuccess(buildSummary(users));
  }
}

export const teamUsersService = new TeamUsersService();

export async function listTeamUsers(
  params?: TeamUsersListParams
): Promise<ApiListResult<TeamUser>> {
  return teamUsersService.list(params);
}

export async function getTeamUserById(
  id: string
): Promise<ApiResult<TeamUser | null>> {
  return teamUsersService.getById(id);
}

export async function createTeamUser(
  payload: CreateTeamUserPayload
): Promise<ApiMutationResult<TeamUser>> {
  return teamUsersService.create(payload);
}

export async function updateTeamUser(
  id: string,
  payload: UpdateTeamUserPayload
): Promise<ApiMutationResult<TeamUser>> {
  return teamUsersService.update(id, payload);
}

export async function deleteTeamUser(
  id: string
): Promise<ApiMutationResult<{ id: string }>> {
  return teamUsersService.remove(id);
}

export async function inviteTeamUser(
  id: string
): Promise<ApiMutationResult<TeamUser>> {
  return teamUsersService.invite(id);
}

export async function activateTeamUser(
  id: string
): Promise<ApiMutationResult<TeamUser>> {
  return teamUsersService.activate(id);
}

export async function deactivateTeamUser(
  id: string
): Promise<ApiMutationResult<TeamUser>> {
  return teamUsersService.deactivate(id);
}

export async function suspendTeamUser(
  id: string
): Promise<ApiMutationResult<TeamUser>> {
  return teamUsersService.suspend(id);
}

export async function verifyTeamUserEmail(
  id: string
): Promise<ApiMutationResult<TeamUser>> {
  return teamUsersService.verifyEmail(id);
}

export async function verifyTeamUserPhone(
  id: string
): Promise<ApiMutationResult<TeamUser>> {
  return teamUsersService.verifyPhone(id);
}

export async function getTeamUsersSummary(
  workspaceId?: string
): Promise<ApiResult<TeamUsersSummary>> {
  return teamUsersService.getSummary(workspaceId);
}