// src/utils/team-users/userPermissions.ts

import type {
  PermissionGroup,
  PermissionKey,
  TeamUserRecord,
  UserRole,
} from "../../constants/teamUsersConstants";
import {
  ROLE_PERMISSION_MAP,
  TEAM_PERMISSION_GROUPS,
} from "../../constants/teamUsersConstants";

export type PermissionAccessSummary = {
  totalPermissions: number;
  grantedPermissions: number;
  missingPermissions: number;
  grantedPercentage: number;
};

export type PermissionModuleKey =
  | "dashboard"
  | "leads"
  | "contacts"
  | "deals"
  | "tasks"
  | "calls"
  | "users"
  | "settings"
  | "reports"
  | "billing"
  | "audit";

export const ALL_PERMISSION_KEYS: PermissionKey[] = Array.from(
  new Set(
    TEAM_PERMISSION_GROUPS.flatMap((group) =>
      group.permissions.map((permission) => permission.key)
    )
  )
);

export function getDefaultPermissionsByRole(role: UserRole): PermissionKey[] {
  return [...(ROLE_PERMISSION_MAP[role] ?? [])];
}

export function getPermissionGroups(): PermissionGroup[] {
  return TEAM_PERMISSION_GROUPS.map((group) => ({
    ...group,
    permissions: [...group.permissions],
  }));
}

export function hasPermission(
  permissions: PermissionKey[] | undefined,
  permission: PermissionKey
): boolean {
  return Boolean(permissions?.includes(permission));
}

export function hasAnyPermission(
  permissions: PermissionKey[] | undefined,
  requiredPermissions: PermissionKey[]
): boolean {
  if (!permissions?.length || requiredPermissions.length === 0) return false;

  return requiredPermissions.some((permission) => permissions.includes(permission));
}

export function hasAllPermissions(
  permissions: PermissionKey[] | undefined,
  requiredPermissions: PermissionKey[]
): boolean {
  if (requiredPermissions.length === 0) return true;
  if (!permissions?.length) return false;

  return requiredPermissions.every((permission) => permissions.includes(permission));
}

export function getUserPermissions(user?: Pick<TeamUserRecord, "permissions"> | null) {
  return [...(user?.permissions ?? [])];
}

export function getUserPermissionsByRole(role: UserRole): PermissionKey[] {
  return getDefaultPermissionsByRole(role);
}

export function isPermissionGranted(
  user: Pick<TeamUserRecord, "permissions"> | null | undefined,
  permission: PermissionKey
): boolean {
  return hasPermission(user?.permissions, permission);
}

export function addPermission(
  permissions: PermissionKey[],
  permission: PermissionKey
): PermissionKey[] {
  if (permissions.includes(permission)) return [...permissions];
  return [...permissions, permission];
}

export function removePermission(
  permissions: PermissionKey[],
  permission: PermissionKey
): PermissionKey[] {
  return permissions.filter((item) => item !== permission);
}

export function togglePermission(
  permissions: PermissionKey[],
  permission: PermissionKey
): PermissionKey[] {
  return permissions.includes(permission)
    ? removePermission(permissions, permission)
    : addPermission(permissions, permission);
}

export function addManyPermissions(
  permissions: PermissionKey[],
  newPermissions: PermissionKey[]
): PermissionKey[] {
  return Array.from(new Set([...permissions, ...newPermissions]));
}

export function removeManyPermissions(
  permissions: PermissionKey[],
  permissionsToRemove: PermissionKey[]
): PermissionKey[] {
  const removeSet = new Set(permissionsToRemove);
  return permissions.filter((permission) => !removeSet.has(permission));
}

export function togglePermissionGroup(
  permissions: PermissionKey[],
  groupId: string
): PermissionKey[] {
  const group = TEAM_PERMISSION_GROUPS.find((item) => item.id === groupId);
  if (!group) return [...permissions];

  const groupKeys = group.permissions.map((permission) => permission.key);
  const allGroupPermissionsGranted = groupKeys.every((key) =>
    permissions.includes(key)
  );

  if (allGroupPermissionsGranted) {
    return removeManyPermissions(permissions, groupKeys);
  }

  return addManyPermissions(permissions, groupKeys);
}

export function getPermissionsForGroup(groupId: string): PermissionKey[] {
  const group = TEAM_PERMISSION_GROUPS.find((item) => item.id === groupId);
  return group ? group.permissions.map((permission) => permission.key) : [];
}

export function isPermissionGroupFullyGranted(
  permissions: PermissionKey[],
  groupId: string
): boolean {
  const groupPermissions = getPermissionsForGroup(groupId);
  if (groupPermissions.length === 0) return false;

  return groupPermissions.every((permission) => permissions.includes(permission));
}

export function isPermissionGroupPartiallyGranted(
  permissions: PermissionKey[],
  groupId: string
): boolean {
  const groupPermissions = getPermissionsForGroup(groupId);
  if (groupPermissions.length === 0) return false;

  const grantedCount = groupPermissions.filter((permission) =>
    permissions.includes(permission)
  ).length;

  return grantedCount > 0 && grantedCount < groupPermissions.length;
}

export function getGrantedPermissionsCount(
  permissions: PermissionKey[] | undefined
): number {
  return permissions?.length ?? 0;
}

export function getPermissionAccessSummary(
  permissions: PermissionKey[] | undefined
): PermissionAccessSummary {
  const totalPermissions = ALL_PERMISSION_KEYS.length;
  const grantedPermissions = permissions?.length ?? 0;
  const missingPermissions = Math.max(totalPermissions - grantedPermissions, 0);
  const grantedPercentage =
    totalPermissions > 0
      ? Number(((grantedPermissions / totalPermissions) * 100).toFixed(2))
      : 0;

  return {
    totalPermissions,
    grantedPermissions,
    missingPermissions,
    grantedPercentage,
  };
}

export function getMissingPermissions(
  permissions: PermissionKey[] | undefined,
  requiredPermissions: PermissionKey[]
): PermissionKey[] {
  const granted = new Set(permissions ?? []);
  return requiredPermissions.filter((permission) => !granted.has(permission));
}

export function getExtraPermissionsComparedToRole(
  role: UserRole,
  permissions: PermissionKey[]
): PermissionKey[] {
  const defaultPermissions = new Set(getDefaultPermissionsByRole(role));
  return permissions.filter((permission) => !defaultPermissions.has(permission));
}

export function getMissingPermissionsComparedToRole(
  role: UserRole,
  permissions: PermissionKey[]
): PermissionKey[] {
  const granted = new Set(permissions);
  return getDefaultPermissionsByRole(role).filter(
    (permission) => !granted.has(permission)
  );
}

export function normalizePermissions(
  permissions: PermissionKey[] | undefined
): PermissionKey[] {
  if (!permissions?.length) return [];

  return Array.from(
    new Set(permissions.filter((permission) => ALL_PERMISSION_KEYS.includes(permission)))
  );
}

export function buildPermissionsFromRoleWithOverrides(
  role: UserRole,
  options?: {
    add?: PermissionKey[];
    remove?: PermissionKey[];
  }
): PermissionKey[] {
  const base = getDefaultPermissionsByRole(role);
  const withAdded = addManyPermissions(base, options?.add ?? []);
  const cleaned = removeManyPermissions(withAdded, options?.remove ?? []);
  return normalizePermissions(cleaned);
}

export function canAccessDashboard(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "dashboard.view");
}

export function canViewLeads(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "leads.view");
}

export function canCreateLeads(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "leads.create");
}

export function canEditLeads(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "leads.edit");
}

export function canDeleteLeads(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "leads.delete");
}

export function canViewContacts(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "contacts.view");
}

export function canCreateContacts(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "contacts.create");
}

export function canEditContacts(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "contacts.edit");
}

export function canDeleteContacts(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "contacts.delete");
}

export function canViewDeals(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "deals.view");
}

export function canCreateDeals(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "deals.create");
}

export function canEditDeals(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "deals.edit");
}

export function canDeleteDeals(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "deals.delete");
}

export function canViewTasks(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "tasks.view");
}

export function canCreateTasks(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "tasks.create");
}

export function canEditTasks(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "tasks.edit");
}

export function canDeleteTasks(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "tasks.delete");
}

export function canViewCalls(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "calls.view");
}

export function canCreateCalls(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "calls.create");
}

export function canViewUsers(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "users.view");
}

export function canInviteUsers(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "users.invite");
}

export function canEditUsers(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "users.edit");
}

export function canDeleteUsers(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "users.delete");
}

export function canViewSettings(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "settings.view");
}

export function canEditSettings(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "settings.edit");
}

export function canViewReports(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "reports.view");
}

export function canViewBilling(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "billing.view");
}

export function canEditBilling(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "billing.edit");
}

export function canViewAuditLogs(
  permissions: PermissionKey[] | undefined
): boolean {
  return hasPermission(permissions, "audit.view");
}

export function canAccessModule(
  permissions: PermissionKey[] | undefined,
  moduleKey: PermissionModuleKey
): boolean {
  switch (moduleKey) {
    case "dashboard":
      return canAccessDashboard(permissions);
    case "leads":
      return canViewLeads(permissions);
    case "contacts":
      return canViewContacts(permissions);
    case "deals":
      return canViewDeals(permissions);
    case "tasks":
      return canViewTasks(permissions);
    case "calls":
      return canViewCalls(permissions);
    case "users":
      return canViewUsers(permissions);
    case "settings":
      return canViewSettings(permissions);
    case "reports":
      return canViewReports(permissions);
    case "billing":
      return canViewBilling(permissions);
    case "audit":
      return canViewAuditLogs(permissions);
    default:
      return false;
  }
}

export function getAllowedModules(
  permissions: PermissionKey[] | undefined
): PermissionModuleKey[] {
  const modules: PermissionModuleKey[] = [
    "dashboard",
    "leads",
    "contacts",
    "deals",
    "tasks",
    "calls",
    "users",
    "settings",
    "reports",
    "billing",
    "audit",
  ];

  return modules.filter((moduleKey) => canAccessModule(permissions, moduleKey));
}

export function getDeniedModules(
  permissions: PermissionKey[] | undefined
): PermissionModuleKey[] {
  const modules: PermissionModuleKey[] = [
    "dashboard",
    "leads",
    "contacts",
    "deals",
    "tasks",
    "calls",
    "users",
    "settings",
    "reports",
    "billing",
    "audit",
  ];

  return modules.filter((moduleKey) => !canAccessModule(permissions, moduleKey));
}

export function comparePermissionSets(
  currentPermissions: PermissionKey[],
  targetPermissions: PermissionKey[]
) {
  const currentSet = new Set(currentPermissions);
  const targetSet = new Set(targetPermissions);

  const added = targetPermissions.filter((permission) => !currentSet.has(permission));
  const removed = currentPermissions.filter(
    (permission) => !targetSet.has(permission)
  );
  const unchanged = currentPermissions.filter((permission) =>
    targetSet.has(permission)
  );

  return {
    added,
    removed,
    unchanged,
  };
}

export function userHasRoleDefaultPermissions(
  role: UserRole,
  permissions: PermissionKey[]
): boolean {
  const defaultPermissions = getDefaultPermissionsByRole(role);
  return hasAllPermissions(permissions, defaultPermissions);
}

export function mapPermissionsToLabels(permissions: PermissionKey[]) {
  const labelMap = new Map<PermissionKey, string>();

  TEAM_PERMISSION_GROUPS.forEach((group) => {
    group.permissions.forEach((permission) => {
      labelMap.set(permission.key, permission.label);
    });
  });

  return permissions.map((permission) => ({
    key: permission,
    label: labelMap.get(permission) ?? permission,
  }));
}

export function getPermissionLabel(permissionKey: PermissionKey): string {
  for (const group of TEAM_PERMISSION_GROUPS) {
    const found = group.permissions.find((permission) => permission.key === permissionKey);
    if (found) return found.label;
  }

  return permissionKey;
}

export function getPermissionDescription(permissionKey: PermissionKey): string {
  for (const group of TEAM_PERMISSION_GROUPS) {
    const found = group.permissions.find((permission) => permission.key === permissionKey);
    if (found) return found.description;
  }

  return permissionKey;
}

export function getPermissionGroupByKey(
  permissionKey: PermissionKey
): PermissionGroup | undefined {
  return TEAM_PERMISSION_GROUPS.find((group) =>
    group.permissions.some((permission) => permission.key === permissionKey)
  );
}

export function getGroupedGrantedPermissions(permissions: PermissionKey[]) {
  return TEAM_PERMISSION_GROUPS.map((group) => ({
    ...group,
    permissions: group.permissions.filter((permission) =>
      permissions.includes(permission.key)
    ),
  })).filter((group) => group.permissions.length > 0);
}