// src/utils/auth/user.ts

export type AuthUserRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "sales_lead"
  | "telecaller"
  | "agent"
  | "support"
  | "viewer"
  | "owner"
  | "member";

export type AuthUserStatus =
  | "active"
  | "inactive"
  | "invited"
  | "pending"
  | "suspended";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: AuthUserRole;
  status?: AuthUserStatus;
  permissions?: string[];
  workspaceId?: string;
  timezone?: string;
  locale?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
};

export type UserDisplayInfo = {
  id: string;
  fullName: string;
  shortName: string;
  initials: string;
  email: string;
  phone: string;
  avatar: string;
  role: AuthUserRole;
  status: AuthUserStatus;
};

export const CURRENT_USER_STORAGE_KEY = "mei_crm_current_user";

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

export function createUserId(prefix = "usr"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

export function createEmptyUser(overrides: Partial<AuthUser> = {}): AuthUser {
  const now = new Date().toISOString();

  return {
    id: overrides.id ?? createUserId(),
    fullName: overrides.fullName ?? "",
    email: overrides.email ?? "",
    phone: overrides.phone ?? "",
    avatar: overrides.avatar ?? "",
    role: overrides.role ?? "member",
    status: overrides.status ?? "pending",
    permissions: overrides.permissions ?? [],
    workspaceId: overrides.workspaceId ?? "",
    timezone: overrides.timezone ?? "Asia/Kolkata",
    locale: overrides.locale ?? "en-IN",
    emailVerified: overrides.emailVerified ?? false,
    phoneVerified: overrides.phoneVerified ?? false,
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    lastLoginAt: overrides.lastLoginAt ?? "",
  };
}

export function normalizeUser(user: Partial<AuthUser>): AuthUser {
  const now = new Date().toISOString();

  return {
    id: user.id?.trim() || createUserId(),
    fullName: user.fullName?.trim() || "",
    email: user.email?.trim() || "",
    phone: user.phone?.trim() || "",
    avatar: user.avatar?.trim() || "",
    role: user.role ?? "member",
    status: user.status ?? "pending",
    permissions: Array.isArray(user.permissions) ? user.permissions : [],
    workspaceId: user.workspaceId?.trim() || "",
    timezone: user.timezone?.trim() || "Asia/Kolkata",
    locale: user.locale?.trim() || "en-IN",
    emailVerified: user.emailVerified ?? false,
    phoneVerified: user.phoneVerified ?? false,
    createdAt: user.createdAt ?? now,
    updatedAt: user.updatedAt ?? now,
    lastLoginAt: user.lastLoginAt ?? "",
  };
}

export function setCurrentUser(user: AuthUser): void {
  const storage = getStorage();
  if (!storage) return;

  const normalized = normalizeUser({
    ...user,
    updatedAt: new Date().toISOString(),
  });

  storage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(normalized));
}

export function getCurrentUser(): AuthUser | null {
  const storage = getStorage();
  if (!storage) return null;

  const parsed = safeJsonParse<AuthUser>(
    storage.getItem(CURRENT_USER_STORAGE_KEY)
  );

  return parsed ? normalizeUser(parsed) : null;
}

export function clearCurrentUser(): void {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(CURRENT_USER_STORAGE_KEY);
}

export function hasCurrentUser(): boolean {
  return Boolean(getCurrentUser());
}

export function updateCurrentUser(updates: Partial<AuthUser>): AuthUser | null {
  const existing = getCurrentUser();
  if (!existing) return null;

  const updated = normalizeUser({
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
    permissions: updates.permissions ?? existing.permissions,
  });

  setCurrentUser(updated);
  return updated;
}

export function mergeUser(
  baseUser: AuthUser,
  updates: Partial<AuthUser>
): AuthUser {
  return normalizeUser({
    ...baseUser,
    ...updates,
    id: baseUser.id,
    createdAt: baseUser.createdAt,
    updatedAt: new Date().toISOString(),
    permissions: updates.permissions ?? baseUser.permissions,
  });
}

export function getUserById(
  users: AuthUser[],
  userId: string
): AuthUser | null {
  return users.find((user) => user.id === userId) ?? null;
}

export function getUserDisplayName(user: Pick<AuthUser, "fullName" | "email">): string {
  return user.fullName?.trim() || user.email?.trim() || "Unknown User";
}

export function getUserShortName(
  user: Pick<AuthUser, "fullName" | "email">
): string {
  const displayName = getUserDisplayName(user).trim();
  const parts = displayName.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "User";
  if (parts.length === 1) return parts[0];

  return `${parts[0]} ${parts[1]}`;
}

export function getUserInitials(
  user: Pick<AuthUser, "fullName" | "email">
): string {
  const name = getUserDisplayName(user).trim();
  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function getUserAvatarUrl(user: Pick<AuthUser, "avatar">): string {
  return user.avatar?.trim() || "";
}

export function getUserPhone(user: Pick<AuthUser, "phone">): string {
  return user.phone?.trim() || "";
}

export function getUserRoleLabel(role: AuthUserRole): string {
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
    case "owner":
      return "Owner";
    case "member":
      return "Member";
    default:
      return "Member";
  }
}

export function getUserStatusLabel(status: AuthUserStatus): string {
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

export function isActiveUser(user: Pick<AuthUser, "status"> | null | undefined): boolean {
  return (user?.status ?? "pending") === "active";
}

export function isSuspendedUser(
  user: Pick<AuthUser, "status"> | null | undefined
): boolean {
  return (user?.status ?? "pending") === "suspended";
}

export function isPendingUser(
  user: Pick<AuthUser, "status"> | null | undefined
): boolean {
  const status = user?.status ?? "pending";
  return status === "pending" || status === "invited";
}

export function isEmailVerified(
  user: Pick<AuthUser, "emailVerified"> | null | undefined
): boolean {
  return Boolean(user?.emailVerified);
}

export function isPhoneVerified(
  user: Pick<AuthUser, "phoneVerified"> | null | undefined
): boolean {
  return Boolean(user?.phoneVerified);
}

export function isFullyVerified(
  user: Pick<AuthUser, "emailVerified" | "phoneVerified"> | null | undefined
): boolean {
  return Boolean(user?.emailVerified && user?.phoneVerified);
}

export function hasPermission(
  user: Pick<AuthUser, "permissions"> | null | undefined,
  permission: string
): boolean {
  return Boolean(user?.permissions?.includes(permission));
}

export function hasAnyPermission(
  user: Pick<AuthUser, "permissions"> | null | undefined,
  permissions: string[]
): boolean {
  if (!user?.permissions?.length || permissions.length === 0) return false;
  return permissions.some((permission) => user.permissions?.includes(permission));
}

export function hasAllPermissions(
  user: Pick<AuthUser, "permissions"> | null | undefined,
  permissions: string[]
): boolean {
  if (permissions.length === 0) return true;
  if (!user?.permissions?.length) return false;
  return permissions.every((permission) => user.permissions?.includes(permission));
}

export function getUserPermissions(
  user: Pick<AuthUser, "permissions"> | null | undefined
): string[] {
  return Array.isArray(user?.permissions) ? [...user.permissions] : [];
}

export function addUserPermission(user: AuthUser, permission: string): AuthUser {
  const permissions = new Set(user.permissions ?? []);
  permissions.add(permission);

  return mergeUser(user, {
    permissions: Array.from(permissions),
  });
}

export function removeUserPermission(user: AuthUser, permission: string): AuthUser {
  const permissions = (user.permissions ?? []).filter((item) => item !== permission);

  return mergeUser(user, {
    permissions,
  });
}

export function isAdminLikeRole(role: AuthUserRole): boolean {
  return role === "super_admin" || role === "admin" || role === "owner";
}

export function canManageUsers(role: AuthUserRole): boolean {
  return (
    role === "super_admin" ||
    role === "admin" ||
    role === "owner" ||
    role === "manager"
  );
}

export function canManageWorkspace(role: AuthUserRole): boolean {
  return role === "super_admin" || role === "admin" || role === "owner";
}

export function canViewReports(role: AuthUserRole): boolean {
  return (
    role === "super_admin" ||
    role === "admin" ||
    role === "owner" ||
    role === "manager" ||
    role === "viewer"
  );
}

export function canEditProfile(
  currentUser: Pick<AuthUser, "id" | "role"> | null | undefined,
  targetUserId: string
): boolean {
  if (!currentUser) return false;
  if (currentUser.id === targetUserId) return true;
  return canManageUsers(currentUser.role);
}

export function getUserDisplayInfo(
  user: AuthUser | null | undefined
): UserDisplayInfo | null {
  if (!user) return null;

  return {
    id: user.id,
    fullName: getUserDisplayName(user),
    shortName: getUserShortName(user),
    initials: getUserInitials(user),
    email: user.email?.trim() || "",
    phone: user.phone?.trim() || "",
    avatar: user.avatar?.trim() || "",
    role: user.role,
    status: user.status ?? "pending",
  };
}

export function getUserLastLoginLabel(
  user: Pick<AuthUser, "lastLoginAt">
): string {
  if (!user.lastLoginAt?.trim()) return "Never logged in";

  const date = new Date(user.lastLoginAt);
  if (Number.isNaN(date.getTime())) return user.lastLoginAt;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isProfileComplete(
  user: Pick<AuthUser, "fullName" | "email" | "role">
): boolean {
  return Boolean(
    user.fullName?.trim() &&
      user.email?.trim() &&
      user.role?.trim()
  );
}

export function getProfileCompletionPercentage(
  user: Partial<AuthUser> | null | undefined
): number {
  if (!user) return 0;

  const checks = [
    Boolean(user.fullName?.trim()),
    Boolean(user.email?.trim()),
    Boolean(user.phone?.trim()),
    Boolean(user.role?.trim()),
    Boolean(user.workspaceId?.trim()),
    Boolean(user.timezone?.trim()),
    Boolean(user.locale?.trim()),
    Boolean(user.emailVerified),
    Boolean(user.phoneVerified),
    Boolean(user.avatar?.trim()),
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

export function formatUserForStorage(user: AuthUser): string {
  return JSON.stringify(normalizeUser(user));
}

export function parseUserFromStorage(value: string | null): AuthUser | null {
  const parsed = safeJsonParse<AuthUser>(value);
  return parsed ? normalizeUser(parsed) : null;
}

export function getCurrentUserRole(): AuthUserRole | null {
  return getCurrentUser()?.role ?? null;
}

export function getCurrentUserId(): string | null {
  return getCurrentUser()?.id ?? null;
}

export function getCurrentWorkspaceIdFromUser(): string | null {
  return getCurrentUser()?.workspaceId ?? null;
}

export function isLoggedInUser(userId: string): boolean {
  return getCurrentUserId() === userId;
}