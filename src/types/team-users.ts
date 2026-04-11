// src/types/team-users.ts

export type TeamUserRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "sales_lead"
  | "telecaller"
  | "agent"
  | "support"
  | "viewer";

export type TeamUserStatus =
  | "active"
  | "inactive"
  | "invited"
  | "pending"
  | "suspended";

export type TeamUserDepartment =
  | "Management"
  | "Sales"
  | "Operations"
  | "Support"
  | "Marketing"
  | "Finance"
  | "HR"
  | "Legal"
  | "IT";

export type TeamUserPermission =
  | "dashboard.view"
  | "leads.view"
  | "leads.create"
  | "leads.edit"
  | "leads.delete"
  | "contacts.view"
  | "contacts.create"
  | "contacts.edit"
  | "contacts.delete"
  | "deals.view"
  | "deals.create"
  | "deals.edit"
  | "deals.delete"
  | "tasks.view"
  | "tasks.create"
  | "tasks.edit"
  | "tasks.delete"
  | "calls.view"
  | "calls.create"
  | "users.view"
  | "users.invite"
  | "users.edit"
  | "users.delete"
  | "settings.view"
  | "settings.edit"
  | "reports.view"
  | "billing.view"
  | "billing.edit"
  | "audit.view";

export type TeamUser = {
  id: string;
  employeeCode: string;
  workspaceId: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: TeamUserRole;
  department: TeamUserDepartment;
  status: TeamUserStatus;
  location?: string;
  reportingTo?: string;
  joinedOn: string;
  lastActive: string;
  timezone: string;
  assignedLeads: number;
  activeDeals: number;
  tasksDueToday: number;
  monthlyRevenue: number;
  conversionRate: number;
  permissions: TeamUserPermission[];
  emailVerified?: boolean;
  phoneVerified?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type TeamUsersState = {
  workspaceId: string;
  users: TeamUser[];
};

export type TeamUsersSummary = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  invitedUsers: number;
  pendingUsers: number;
  suspendedUsers: number;
  totalAssignedLeads: number;
  totalActiveDeals: number;
  totalTasksDueToday: number;
  totalMonthlyRevenue: number;
  averageConversionRate: number;
};

export const TEAM_USERS_STORAGE_KEY = "mei-crm-team-users";
export const TEAM_USERS_SELECTED_IDS_STORAGE_KEY =
  "mei-crm-team-users-selected";

export const ROLE_PERMISSION_MAP: Record<TeamUserRole, TeamUserPermission[]> = {
  super_admin: [
    "dashboard.view",
    "leads.view",
    "leads.create",
    "leads.edit",
    "leads.delete",
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "contacts.delete",
    "deals.view",
    "deals.create",
    "deals.edit",
    "deals.delete",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "tasks.delete",
    "calls.view",
    "calls.create",
    "users.view",
    "users.invite",
    "users.edit",
    "users.delete",
    "settings.view",
    "settings.edit",
    "reports.view",
    "billing.view",
    "billing.edit",
    "audit.view",
  ],
  admin: [
    "dashboard.view",
    "leads.view",
    "leads.create",
    "leads.edit",
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "deals.view",
    "deals.create",
    "deals.edit",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "calls.view",
    "calls.create",
    "users.view",
    "users.invite",
    "users.edit",
    "settings.view",
    "settings.edit",
    "reports.view",
    "billing.view",
    "audit.view",
  ],
  manager: [
    "dashboard.view",
    "leads.view",
    "leads.create",
    "leads.edit",
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "deals.view",
    "deals.create",
    "deals.edit",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "calls.view",
    "calls.create",
    "users.view",
    "reports.view",
  ],
  sales_lead: [
    "dashboard.view",
    "leads.view",
    "leads.create",
    "leads.edit",
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "deals.view",
    "deals.create",
    "deals.edit",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "calls.view",
    "calls.create",
    "reports.view",
  ],
  telecaller: [
    "dashboard.view",
    "leads.view",
    "leads.create",
    "leads.edit",
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "calls.view",
    "calls.create",
  ],
  agent: [
    "dashboard.view",
    "leads.view",
    "leads.edit",
    "contacts.view",
    "contacts.edit",
    "deals.view",
    "deals.create",
    "deals.edit",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "calls.view",
    "calls.create",
  ],
  support: [
    "dashboard.view",
    "contacts.view",
    "contacts.edit",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "calls.view",
  ],
  viewer: [
    "dashboard.view",
    "leads.view",
    "contacts.view",
    "deals.view",
    "tasks.view",
    "reports.view",
  ],
};

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function safeJsonParse<T>(value: string | null): T | null {
  try {
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function createTeamUserId(prefix = "tu"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

export function createEmployeeCode(index = Date.now()): string {
  return `MEI-EMP-${String(index).slice(-4).padStart(4, "0")}`;
}

export function getDefaultPermissionsByRole(
  role: TeamUserRole
): TeamUserPermission[] {
  return [...(ROLE_PERMISSION_MAP[role] ?? [])];
}

export function createEmptyTeamUser(
  overrides: Partial<TeamUser> = {}
): TeamUser {
  const now = new Date().toISOString();
  const role = overrides.role ?? "agent";

  return {
    id: overrides.id ?? createTeamUserId(),
    employeeCode: overrides.employeeCode ?? createEmployeeCode(),
    workspaceId: overrides.workspaceId ?? "",
    fullName: overrides.fullName ?? "",
    email: overrides.email ?? "",
    phone: overrides.phone ?? "",
    avatar: overrides.avatar ?? "",
    role,
    department: overrides.department ?? "Sales",
    status: overrides.status ?? "pending",
    location: overrides.location ?? "",
    reportingTo: overrides.reportingTo ?? "",
    joinedOn: overrides.joinedOn ?? now,
    lastActive: overrides.lastActive ?? now,
    timezone: overrides.timezone ?? "Asia/Kolkata",
    assignedLeads: overrides.assignedLeads ?? 0,
    activeDeals: overrides.activeDeals ?? 0,
    tasksDueToday: overrides.tasksDueToday ?? 0,
    monthlyRevenue: overrides.monthlyRevenue ?? 0,
    conversionRate: overrides.conversionRate ?? 0,
    permissions: overrides.permissions ?? getDefaultPermissionsByRole(role),
    emailVerified: overrides.emailVerified ?? false,
    phoneVerified: overrides.phoneVerified ?? false,
    notes: overrides.notes ?? "",
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
  };
}

export function normalizeTeamUser(user: Partial<TeamUser>): TeamUser {
  const now = new Date().toISOString();
  const role = user.role ?? "agent";

  return {
    id: user.id?.trim() || createTeamUserId(),
    employeeCode: user.employeeCode?.trim() || createEmployeeCode(),
    workspaceId: user.workspaceId?.trim() || "",
    fullName: user.fullName?.trim() || "",
    email: user.email?.trim() || "",
    phone: user.phone?.trim() || "",
    avatar: user.avatar?.trim() || "",
    role,
    department: user.department ?? "Sales",
    status: user.status ?? "pending",
    location: user.location?.trim() || "",
    reportingTo: user.reportingTo?.trim() || "",
    joinedOn: user.joinedOn ?? now,
    lastActive: user.lastActive ?? now,
    timezone: user.timezone?.trim() || "Asia/Kolkata",
    assignedLeads: user.assignedLeads ?? 0,
    activeDeals: user.activeDeals ?? 0,
    tasksDueToday: user.tasksDueToday ?? 0,
    monthlyRevenue: user.monthlyRevenue ?? 0,
    conversionRate: user.conversionRate ?? 0,
    permissions: Array.isArray(user.permissions)
      ? [...new Set(user.permissions)]
      : getDefaultPermissionsByRole(role),
    emailVerified: user.emailVerified ?? false,
    phoneVerified: user.phoneVerified ?? false,
    notes: user.notes?.trim() || "",
    createdAt: user.createdAt ?? now,
    updatedAt: user.updatedAt ?? now,
  };
}

export function getTeamUsersState(): TeamUsersState | null {
  const storage = getStorage();
  if (!storage) return null;

  const parsed = safeJsonParse<TeamUsersState>(
    storage.getItem(TEAM_USERS_STORAGE_KEY)
  );

  if (!parsed) return null;

  return {
    workspaceId: parsed.workspaceId ?? "",
    users: Array.isArray(parsed.users)
      ? parsed.users.map(normalizeTeamUser)
      : [],
  };
}

export function setTeamUsersState(state: TeamUsersState): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(
    TEAM_USERS_STORAGE_KEY,
    JSON.stringify({
      workspaceId: state.workspaceId,
      users: state.users.map(normalizeTeamUser),
    })
  );
}

export function clearTeamUsersState(): void {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(TEAM_USERS_STORAGE_KEY);
  storage.removeItem(TEAM_USERS_SELECTED_IDS_STORAGE_KEY);
}

export function getTeamUsers(workspaceId?: string): TeamUser[] {
  const state = getTeamUsersState();
  if (!state) return [];
  if (!workspaceId) return state.users;

  return state.users.filter((user) => user.workspaceId === workspaceId);
}

export function setTeamUsers(
  workspaceId: string,
  users: TeamUser[]
): TeamUsersState {
  const normalizedUsers = users.map((user) =>
    normalizeTeamUser({ ...user, workspaceId })
  );

  const nextState: TeamUsersState = {
    workspaceId,
    users: normalizedUsers,
  };

  setTeamUsersState(nextState);
  return nextState;
}

export function saveTeamUser(user: TeamUser): TeamUser {
  const state = getTeamUsersState();
  const normalized = normalizeTeamUser(user);

  if (!state) {
    setTeamUsersState({
      workspaceId: normalized.workspaceId,
      users: [normalized],
    });
    return normalized;
  }

  const exists = state.users.some((item) => item.id === normalized.id);

  const nextUsers = exists
    ? state.users.map((item) => (item.id === normalized.id ? normalized : item))
    : [...state.users, normalized];

  setTeamUsersState({
    workspaceId: normalized.workspaceId || state.workspaceId,
    users: nextUsers,
  });

  return normalized;
}

export function createTeamUser(user: Partial<TeamUser>): TeamUser {
  const normalized = normalizeTeamUser(user);
  saveTeamUser(normalized);
  return normalized;
}

export function updateTeamUser(
  userId: string,
  updates: Partial<TeamUser>
): TeamUser | null {
  const state = getTeamUsersState();
  if (!state) return null;

  const existing = state.users.find((user) => user.id === userId);
  if (!existing) return null;

  const nextRole = updates.role ?? existing.role;

  const updated = normalizeTeamUser({
    ...existing,
    ...updates,
    id: existing.id,
    workspaceId: existing.workspaceId,
    employeeCode: updates.employeeCode ?? existing.employeeCode,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
    permissions:
      updates.permissions ??
      (updates.role
        ? getDefaultPermissionsByRole(nextRole)
        : existing.permissions),
  });

  saveTeamUser(updated);
  return updated;
}

export function removeTeamUser(userId: string): TeamUser[] {
  const state = getTeamUsersState();
  if (!state) return [];

  const nextUsers = state.users.filter((user) => user.id !== userId);

  setTeamUsersState({
    workspaceId: state.workspaceId,
    users: nextUsers,
  });

  return nextUsers;
}

export function getTeamUserById(userId: string): TeamUser | null {
  return getTeamUsers().find((user) => user.id === userId) ?? null;
}

export function getTeamUserByEmail(email: string): TeamUser | null {
  const normalizedEmail = email.trim().toLowerCase();

  return (
    getTeamUsers().find(
      (user) => user.email.trim().toLowerCase() === normalizedEmail
    ) ?? null
  );
}

export function getWorkspaceTeamUserByEmail(
  workspaceId: string,
  email: string
): TeamUser | null {
  const normalizedEmail = email.trim().toLowerCase();

  return (
    getTeamUsers(workspaceId).find(
      (user) => user.email.trim().toLowerCase() === normalizedEmail
    ) ?? null
  );
}

export function inviteTeamUser(userId: string): TeamUser | null {
  return updateTeamUser(userId, {
    status: "invited",
    lastActive: new Date().toISOString(),
  });
}

export function activateTeamUser(userId: string): TeamUser | null {
  return updateTeamUser(userId, {
    status: "active",
    lastActive: new Date().toISOString(),
  });
}

export function deactivateTeamUser(userId: string): TeamUser | null {
  return updateTeamUser(userId, {
    status: "inactive",
    updatedAt: new Date().toISOString(),
  });
}

export function suspendTeamUser(userId: string): TeamUser | null {
  return updateTeamUser(userId, {
    status: "suspended",
    updatedAt: new Date().toISOString(),
  });
}

export function verifyTeamUserEmail(userId: string): TeamUser | null {
  return updateTeamUser(userId, {
    emailVerified: true,
    updatedAt: new Date().toISOString(),
  });
}

export function verifyTeamUserPhone(userId: string): TeamUser | null {
  return updateTeamUser(userId, {
    phoneVerified: true,
    updatedAt: new Date().toISOString(),
  });
}

export function setTeamUserLastActive(
  userId: string,
  lastActive?: string
): TeamUser | null {
  return updateTeamUser(userId, {
    lastActive: lastActive ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export function addTeamUserPermission(
  userId: string,
  permission: TeamUserPermission
): TeamUser | null {
  const user = getTeamUserById(userId);
  if (!user) return null;

  return updateTeamUser(userId, {
    permissions: Array.from(new Set([...(user.permissions ?? []), permission])),
  });
}

export function removeTeamUserPermission(
  userId: string,
  permission: TeamUserPermission
): TeamUser | null {
  const user = getTeamUserById(userId);
  if (!user) return null;

  return updateTeamUser(userId, {
    permissions: (user.permissions ?? []).filter((item) => item !== permission),
  });
}

export function hasTeamUserPermission(
  user: Pick<TeamUser, "permissions"> | null | undefined,
  permission: TeamUserPermission
): boolean {
  return Boolean(user?.permissions?.includes(permission));
}

export function hasAnyTeamUserPermission(
  user: Pick<TeamUser, "permissions"> | null | undefined,
  permissions: TeamUserPermission[]
): boolean {
  if (!user?.permissions?.length || permissions.length === 0) return false;
  return permissions.some((permission) => user.permissions.includes(permission));
}

export function hasAllTeamUserPermissions(
  user: Pick<TeamUser, "permissions"> | null | undefined,
  permissions: TeamUserPermission[]
): boolean {
  if (permissions.length === 0) return true;
  if (!user?.permissions?.length) return false;

  return permissions.every((permission) =>
    user.permissions.includes(permission)
  );
}

export function getTeamUserDisplayName(
  user: Pick<TeamUser, "fullName" | "email">
): string {
  return user.fullName?.trim() || user.email?.trim() || "Unknown User";
}

export function getTeamUserInitials(
  user: Pick<TeamUser, "fullName" | "email">
): string {
  const name = getTeamUserDisplayName(user);
  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "TU";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function getTeamUserRoleLabel(role: TeamUserRole): string {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "sales_lead":
      return "Sales Lead";
    case "telecaller":
      return "Telecaller";
    case "agent":
      return "Agent";
    case "support":
      return "Support";
    case "viewer":
      return "Viewer";
    default:
      return "Agent";
  }
}

export function getTeamUserStatusLabel(status: TeamUserStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "invited":
      return "Invited";
    case "pending":
      return "Pending";
    case "suspended":
      return "Suspended";
    default:
      return "Pending";
  }
}

export function isActiveTeamUser(
  user: Pick<TeamUser, "status"> | null | undefined
): boolean {
  return (user?.status ?? "pending") === "active";
}

export function isInvitedTeamUser(
  user: Pick<TeamUser, "status"> | null | undefined
): boolean {
  return (user?.status ?? "pending") === "invited";
}

export function isPendingTeamUser(
  user: Pick<TeamUser, "status"> | null | undefined
): boolean {
  return (user?.status ?? "pending") === "pending";
}

export function isSuspendedTeamUser(
  user: Pick<TeamUser, "status"> | null | undefined
): boolean {
  return (user?.status ?? "pending") === "suspended";
}

export function getSelectedTeamUserIds(): string[] {
  const storage = getStorage();
  if (!storage) return [];

  const parsed = safeJsonParse<string[]>(
    storage.getItem(TEAM_USERS_SELECTED_IDS_STORAGE_KEY)
  );

  return Array.isArray(parsed) ? parsed : [];
}

export function setSelectedTeamUserIds(ids: string[]): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(
    TEAM_USERS_SELECTED_IDS_STORAGE_KEY,
    JSON.stringify(Array.from(new Set(ids)))
  );
}

export function clearSelectedTeamUserIds(): void {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(TEAM_USERS_SELECTED_IDS_STORAGE_KEY);
}

export function getSelectedTeamUsers(): TeamUser[] {
  const selectedIds = new Set(getSelectedTeamUserIds());
  return getTeamUsers().filter((user) => selectedIds.has(user.id));
}

export function buildTeamUsersSummary(users: TeamUser[]): TeamUsersSummary {
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
            users.reduce((sum, user) => sum + user.conversionRate, 0) / totalUsers
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

export function getWorkspaceTeamUsersSummary(
  workspaceId: string
): TeamUsersSummary {
  return buildTeamUsersSummary(getTeamUsers(workspaceId));
}

export function getTeamUsersByRole(
  workspaceId: string,
  role: TeamUserRole
): TeamUser[] {
  return getTeamUsers(workspaceId).filter((user) => user.role === role);
}

export function getTeamUsersByDepartment(
  workspaceId: string,
  department: TeamUserDepartment
): TeamUser[] {
  return getTeamUsers(workspaceId).filter(
    (user) => user.department === department
  );
}

export function getTeamUsersByStatus(
  workspaceId: string,
  status: TeamUserStatus
): TeamUser[] {
  return getTeamUsers(workspaceId).filter((user) => user.status === status);
}