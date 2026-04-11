// src/utils/team-users/userHelpers.ts

import type {
  TeamUserRecord,
  UserRole,
  UserStatus,
  TeamDepartment,
} from "../../constants/teamUsersConstants";

export type UserBadgeTone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export type TeamUsersSummaryStats = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  invitedUsers: number;
  suspendedUsers: number;
  pendingUsers: number;
  totalAssignedLeads: number;
  totalActiveDeals: number;
  totalTasksDueToday: number;
  totalMonthlyRevenue: number;
  averageConversionRate: number;
};

export function formatUserCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatUserDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatUserDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getUserInitials(fullName: string): string {
  const words = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "NA";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

export function getUserDisplayName(user: Pick<TeamUserRecord, "fullName">): string {
  return user.fullName?.trim() || "Unnamed User";
}

export function getUserDisplayLabel(
  user: Pick<TeamUserRecord, "fullName" | "employeeCode">
): string {
  const name = getUserDisplayName(user);
  return user.employeeCode ? `${name} (${user.employeeCode})` : name;
}

export function getUserContactLabel(
  user: Pick<TeamUserRecord, "email" | "phone">
): string {
  if (user.email && user.phone) return `${user.email} · ${user.phone}`;
  return user.email || user.phone || "No contact info";
}

export function getUserRoleTone(role: UserRole): UserBadgeTone {
  switch (role) {
    case "Super Admin":
      return "danger";
    case "Admin":
      return "primary";
    case "Manager":
    case "Sales Lead":
      return "success";
    case "Telecaller":
      return "warning";
    case "Agent":
      return "primary";
    case "Support":
    case "Viewer":
      return "neutral";
    default:
      return "neutral";
  }
}

export function getUserStatusTone(status: UserStatus): UserBadgeTone {
  switch (status) {
    case "active":
      return "success";
    case "invited":
      return "primary";
    case "pending":
      return "warning";
    case "suspended":
      return "danger";
    case "inactive":
    default:
      return "neutral";
  }
}

export function getDepartmentTone(department: TeamDepartment): UserBadgeTone {
  switch (department) {
    case "Management":
      return "danger";
    case "Sales":
      return "success";
    case "Support":
      return "warning";
    case "IT":
    case "Operations":
      return "primary";
    default:
      return "neutral";
  }
}

export function getLastActiveRelativeText(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const now = Date.now();
  const diffMs = now - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "Just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} min ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} hr ago`;
  if (diffMs < day * 7) return `${Math.floor(diffMs / day)} day ago`;
  return formatUserDate(value);
}

export function isUserActive(status: UserStatus): boolean {
  return status === "active";
}

export function isUserSelectable(user: TeamUserRecord): boolean {
  return user.status !== "suspended";
}

export function isUserPendingLike(status: UserStatus): boolean {
  return status === "pending" || status === "invited";
}

export function getExtraSeatsCount(
  usedSeats: number,
  baseIncludedSeats: number
): number {
  return Math.max(usedSeats - baseIncludedSeats, 0);
}

export function calculateUserConversionLabel(rate: number): string {
  return `${Number(rate || 0).toFixed(0)}%`;
}

export function calculateUserPerformanceScore(user: TeamUserRecord): number {
  const leadsWeight = user.assignedLeads * 0.2;
  const dealsWeight = user.activeDeals * 8;
  const tasksWeight = Math.max(10 - user.tasksDueToday, 0) * 1.5;
  const revenueWeight = user.monthlyRevenue / 10000;
  const conversionWeight = user.conversionRate * 1.2;

  return Number(
    (leadsWeight + dealsWeight + tasksWeight + revenueWeight + conversionWeight).toFixed(2)
  );
}

export function getTopPerformingUsers(
  users: TeamUserRecord[],
  limit = 5
): TeamUserRecord[] {
  return [...users]
    .sort(
      (a, b) => calculateUserPerformanceScore(b) - calculateUserPerformanceScore(a)
    )
    .slice(0, limit);
}

export function getUsersByStatus(
  users: TeamUserRecord[],
  status: UserStatus
): TeamUserRecord[] {
  return users.filter((user) => user.status === status);
}

export function getUsersByDepartment(
  users: TeamUserRecord[],
  department: TeamDepartment
): TeamUserRecord[] {
  return users.filter((user) => user.department === department);
}

export function getUsersByRole(
  users: TeamUserRecord[],
  role: UserRole
): TeamUserRecord[] {
  return users.filter((user) => user.role === role);
}

export function getUserById(
  users: TeamUserRecord[],
  userId: string
): TeamUserRecord | undefined {
  return users.find((user) => user.id === userId);
}

export function getSelectedUsers(
  users: TeamUserRecord[],
  selectedIds: string[]
): TeamUserRecord[] {
  const selectedIdSet = new Set(selectedIds);
  return users.filter((user) => selectedIdSet.has(user.id));
}

export function getUserIds(users: TeamUserRecord[]): string[] {
  return users.map((user) => user.id);
}

export function areAllUsersSelected(
  users: TeamUserRecord[],
  selectedIds: string[]
): boolean {
  if (users.length === 0) return false;
  const selectedIdSet = new Set(selectedIds);
  return users.every((user) => selectedIdSet.has(user.id));
}

export function areSomeUsersSelected(selectedIds: string[]): boolean {
  return selectedIds.length > 0;
}

export function toggleUserId(selectedIds: string[], userId: string): string[] {
  return selectedIds.includes(userId)
    ? selectedIds.filter((id) => id !== userId)
    : [...selectedIds, userId];
}

export function toggleAllUserIds(
  currentSelectedIds: string[],
  visibleUsers: TeamUserRecord[]
): string[] {
  const visibleIds = visibleUsers.map((user) => user.id);
  const allSelected = visibleIds.every((id) => currentSelectedIds.includes(id));

  if (allSelected) {
    return currentSelectedIds.filter((id) => !visibleIds.includes(id));
  }

  return Array.from(new Set([...currentSelectedIds, ...visibleIds]));
}

export function paginateUsers(
  users: TeamUserRecord[],
  currentPage: number,
  pageSize: number
): TeamUserRecord[] {
  const safePage = Math.max(currentPage, 1);
  const safePageSize = Math.max(pageSize, 1);
  const start = (safePage - 1) * safePageSize;
  return users.slice(start, start + safePageSize);
}

export function getTotalPages(totalItems: number, pageSize: number): number {
  const safePageSize = Math.max(pageSize, 1);
  return Math.max(1, Math.ceil(totalItems / safePageSize));
}

export function clampPage(
  requestedPage: number,
  totalItems: number,
  pageSize: number
): number {
  const totalPages = getTotalPages(totalItems, pageSize);
  return Math.min(Math.max(requestedPage, 1), totalPages);
}

export function buildTeamUsersSummaryStats(
  users: TeamUserRecord[]
): TeamUsersSummaryStats {
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "active").length;
  const inactiveUsers = users.filter((user) => user.status === "inactive").length;
  const invitedUsers = users.filter((user) => user.status === "invited").length;
  const suspendedUsers = users.filter((user) => user.status === "suspended").length;
  const pendingUsers = users.filter((user) => user.status === "pending").length;

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
    suspendedUsers,
    pendingUsers,
    totalAssignedLeads,
    totalActiveDeals,
    totalTasksDueToday,
    totalMonthlyRevenue,
    averageConversionRate,
  };
}

export function getUserStatusLabel(status: UserStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "invited":
      return "Invited";
    case "suspended":
      return "Suspended";
    case "pending":
      return "Pending";
    default:
      return "Unknown";
  }
}

export function getUserPlainObject(user: TeamUserRecord) {
  return {
    id: user.id,
    employeeCode: user.employeeCode,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    department: user.department,
    status: user.status,
    statusLabel: getUserStatusLabel(user.status),
    location: user.location,
    reportingTo: user.reportingTo ?? "",
    joinedOn: formatUserDate(user.joinedOn),
    lastActive: formatUserDateTime(user.lastActive),
    lastActiveRelative: getLastActiveRelativeText(user.lastActive),
    timezone: user.timezone,
    assignedLeads: user.assignedLeads,
    activeDeals: user.activeDeals,
    tasksDueToday: user.tasksDueToday,
    monthlyRevenue: user.monthlyRevenue,
    monthlyRevenueLabel: formatUserCurrency(user.monthlyRevenue),
    conversionRate: user.conversionRate,
    conversionRateLabel: calculateUserConversionLabel(user.conversionRate),
    notes: user.notes ?? "",
  };
}

export function getUniqueUserLocations(users: TeamUserRecord[]): string[] {
  return Array.from(
    new Set(
      users
        .map((user) => user.location?.trim())
        .filter((location): location is string => Boolean(location))
    )
  ).sort((a, b) => a.localeCompare(b));
}

export function getUniqueReportingManagers(users: TeamUserRecord[]): string[] {
  return Array.from(
    new Set(
      users
        .map((user) => user.reportingTo?.trim())
        .filter((manager): manager is string => Boolean(manager))
    )
  ).sort((a, b) => a.localeCompare(b));
}

export function createEmptyTeamUser(): TeamUserRecord {
  const now = new Date().toISOString();

  return {
    id: "",
    employeeCode: "",
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
    role: "Agent",
    department: "Sales",
    status: "pending",
    location: "",
    reportingTo: "",
    joinedOn: now,
    lastActive: now,
    timezone: "Asia/Kolkata",
    assignedLeads: 0,
    activeDeals: 0,
    tasksDueToday: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    permissions: [],
    notes: "",
  };
}

export function mergeTeamUser(
  baseUser: TeamUserRecord,
  updates: Partial<TeamUserRecord>
): TeamUserRecord {
  return {
    ...baseUser,
    ...updates,
    reportingTo: updates.reportingTo ?? baseUser.reportingTo,
    notes: updates.notes ?? baseUser.notes,
    permissions: updates.permissions ?? baseUser.permissions,
  };
}

export function isValidUserEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidUserPhone(phone: string): boolean {
  return /^[0-9+\-\s()]{7,20}$/.test(phone.trim());
}

export function canInviteUser(user: Pick<TeamUserRecord, "email" | "status">): boolean {
  return Boolean(user.email?.trim()) && user.status !== "active";
}