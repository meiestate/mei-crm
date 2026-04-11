// src/types/permissions.ts

import type {
  TeamUser,
  TeamUserPermission,
  TeamUserRole,
} from "./team-users";
import { ROLE_PERMISSION_MAP } from "./team-users";

export const ALL_TEAM_USER_PERMISSIONS: TeamUserPermission[] = [
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
];

export type PermissionGroup = {
  key: string;
  label: string;
  permissions: TeamUserPermission[];
};

export type PermissionOption = {
  value: TeamUserPermission;
  label: string;
  description: string;
  groupKey: string;
  groupLabel: string;
};

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    permissions: ["dashboard.view"],
  },
  {
    key: "leads",
    label: "Leads",
    permissions: [
      "leads.view",
      "leads.create",
      "leads.edit",
      "leads.delete",
    ],
  },
  {
    key: "contacts",
    label: "Contacts",
    permissions: [
      "contacts.view",
      "contacts.create",
      "contacts.edit",
      "contacts.delete",
    ],
  },
  {
    key: "deals",
    label: "Deals",
    permissions: [
      "deals.view",
      "deals.create",
      "deals.edit",
      "deals.delete",
    ],
  },
  {
    key: "tasks",
    label: "Tasks",
    permissions: [
      "tasks.view",
      "tasks.create",
      "tasks.edit",
      "tasks.delete",
    ],
  },
  {
    key: "calls",
    label: "Call Logs",
    permissions: ["calls.view", "calls.create"],
  },
  {
    key: "users",
    label: "Team Users",
    permissions: [
      "users.view",
      "users.invite",
      "users.edit",
      "users.delete",
    ],
  },
  {
    key: "settings",
    label: "Settings",
    permissions: ["settings.view", "settings.edit"],
  },
  {
    key: "reports",
    label: "Reports",
    permissions: ["reports.view"],
  },
  {
    key: "billing",
    label: "Billing",
    permissions: ["billing.view", "billing.edit"],
  },
  {
    key: "audit",
    label: "Audit Logs",
    permissions: ["audit.view"],
  },
];

export function getPermissionLabel(
  permission: TeamUserPermission
): string {
  switch (permission) {
    case "dashboard.view":
      return "View Dashboard";

    case "leads.view":
      return "View Leads";
    case "leads.create":
      return "Create Leads";
    case "leads.edit":
      return "Edit Leads";
    case "leads.delete":
      return "Delete Leads";

    case "contacts.view":
      return "View Contacts";
    case "contacts.create":
      return "Create Contacts";
    case "contacts.edit":
      return "Edit Contacts";
    case "contacts.delete":
      return "Delete Contacts";

    case "deals.view":
      return "View Deals";
    case "deals.create":
      return "Create Deals";
    case "deals.edit":
      return "Edit Deals";
    case "deals.delete":
      return "Delete Deals";

    case "tasks.view":
      return "View Tasks";
    case "tasks.create":
      return "Create Tasks";
    case "tasks.edit":
      return "Edit Tasks";
    case "tasks.delete":
      return "Delete Tasks";

    case "calls.view":
      return "View Call Logs";
    case "calls.create":
      return "Create Call Logs";

    case "users.view":
      return "View Team Users";
    case "users.invite":
      return "Invite Team Users";
    case "users.edit":
      return "Edit Team Users";
    case "users.delete":
      return "Delete Team Users";

    case "settings.view":
      return "View Settings";
    case "settings.edit":
      return "Edit Settings";

    case "reports.view":
      return "View Reports";

    case "billing.view":
      return "View Billing";
    case "billing.edit":
      return "Edit Billing";

    case "audit.view":
      return "View Audit Logs";

    default:
      return permission;
  }
}

export function getPermissionDescription(
  permission: TeamUserPermission
): string {
  switch (permission) {
    case "dashboard.view":
      return "Allows access to dashboard overview and KPI widgets.";

    case "leads.view":
      return "Allows viewing leads list and lead details.";
    case "leads.create":
      return "Allows creating new leads.";
    case "leads.edit":
      return "Allows editing existing leads.";
    case "leads.delete":
      return "Allows deleting leads.";

    case "contacts.view":
      return "Allows viewing contacts and contact details.";
    case "contacts.create":
      return "Allows creating new contacts.";
    case "contacts.edit":
      return "Allows editing existing contacts.";
    case "contacts.delete":
      return "Allows deleting contacts.";

    case "deals.view":
      return "Allows viewing deals and deal pipeline.";
    case "deals.create":
      return "Allows creating new deals.";
    case "deals.edit":
      return "Allows editing existing deals.";
    case "deals.delete":
      return "Allows deleting deals.";

    case "tasks.view":
      return "Allows viewing tasks and schedules.";
    case "tasks.create":
      return "Allows creating tasks.";
    case "tasks.edit":
      return "Allows editing tasks.";
    case "tasks.delete":
      return "Allows deleting tasks.";

    case "calls.view":
      return "Allows viewing call logs.";
    case "calls.create":
      return "Allows adding call logs.";

    case "users.view":
      return "Allows viewing team users and access details.";
    case "users.invite":
      return "Allows inviting new team users.";
    case "users.edit":
      return "Allows editing team users.";
    case "users.delete":
      return "Allows removing team users.";

    case "settings.view":
      return "Allows viewing workspace settings.";
    case "settings.edit":
      return "Allows editing workspace settings.";

    case "reports.view":
      return "Allows viewing reports and analytics.";

    case "billing.view":
      return "Allows viewing billing and subscription details.";
    case "billing.edit":
      return "Allows editing billing and subscription settings.";

    case "audit.view":
      return "Allows viewing audit logs.";

    default:
      return "Permission access control.";
  }
}

export const PERMISSION_OPTIONS: PermissionOption[] = PERMISSION_GROUPS.flatMap(
  (group) =>
    group.permissions.map((permission) => ({
      value: permission,
      label: getPermissionLabel(permission),
      description: getPermissionDescription(permission),
      groupKey: group.key,
      groupLabel: group.label,
    }))
);

export function getAllPermissions(): TeamUserPermission[] {
  return [...ALL_TEAM_USER_PERMISSIONS];
}

export function getPermissionGroups(): PermissionGroup[] {
  return PERMISSION_GROUPS.map((group) => ({
    key: group.key,
    label: group.label,
    permissions: [...group.permissions],
  }));
}

export function getPermissionGroupByKey(
  key: string
): PermissionGroup | null {
  return PERMISSION_GROUPS.find((group) => group.key === key) ?? null;
}

export function getPermissionGroupLabel(
  permission: TeamUserPermission
): string {
  const group = PERMISSION_GROUPS.find((item) =>
    item.permissions.includes(permission)
  );

  return group?.label ?? "Other";
}

export function getPermissionsForRole(
  role: TeamUserRole
): TeamUserPermission[] {
  return [...(ROLE_PERMISSION_MAP[role] ?? [])];
}

export function isValidPermission(
  value: string
): value is TeamUserPermission {
  return ALL_TEAM_USER_PERMISSIONS.includes(value as TeamUserPermission);
}

export function normalizePermissions(
  permissions: Array<TeamUserPermission | string> | null | undefined
): TeamUserPermission[] {
  if (!Array.isArray(permissions)) {
    return [];
  }

  const validPermissions = permissions.filter((permission) =>
    isValidPermission(permission)
  ) as TeamUserPermission[];

  return Array.from(new Set(validPermissions));
}

export function sortPermissions(
  permissions: TeamUserPermission[]
): TeamUserPermission[] {
  const orderMap = new Map<TeamUserPermission, number>(
    ALL_TEAM_USER_PERMISSIONS.map((permission, index) => [permission, index])
  );

  return [...permissions].sort((a, b) => {
    const aIndex = orderMap.get(a) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = orderMap.get(b) ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });
}

export function uniquePermissions(
  permissions: TeamUserPermission[]
): TeamUserPermission[] {
  return Array.from(new Set(permissions));
}

export function hasPermission(
  userOrPermissions:
    | Pick<TeamUser, "permissions">
    | TeamUserPermission[]
    | null
    | undefined,
  permission: TeamUserPermission
): boolean {
  if (!userOrPermissions) {
    return false;
  }

  const permissions = Array.isArray(userOrPermissions)
    ? userOrPermissions
    : userOrPermissions.permissions;

  return permissions.includes(permission);
}

export function hasAnyPermission(
  userOrPermissions:
    | Pick<TeamUser, "permissions">
    | TeamUserPermission[]
    | null
    | undefined,
  requiredPermissions: TeamUserPermission[]
): boolean {
  if (!userOrPermissions || requiredPermissions.length === 0) {
    return false;
  }

  const permissions = Array.isArray(userOrPermissions)
    ? userOrPermissions
    : userOrPermissions.permissions;

  return requiredPermissions.some((permission) =>
    permissions.includes(permission)
  );
}

export function hasAllPermissions(
  userOrPermissions:
    | Pick<TeamUser, "permissions">
    | TeamUserPermission[]
    | null
    | undefined,
  requiredPermissions: TeamUserPermission[]
): boolean {
  if (requiredPermissions.length === 0) {
    return true;
  }

  if (!userOrPermissions) {
    return false;
  }

  const permissions = Array.isArray(userOrPermissions)
    ? userOrPermissions
    : userOrPermissions.permissions;

  return requiredPermissions.every((permission) =>
    permissions.includes(permission)
  );
}

export function getMissingPermissions(
  userOrPermissions:
    | Pick<TeamUser, "permissions">
    | TeamUserPermission[]
    | null
    | undefined,
  requiredPermissions: TeamUserPermission[]
): TeamUserPermission[] {
  if (requiredPermissions.length === 0) {
    return [];
  }

  const permissions = Array.isArray(userOrPermissions)
    ? userOrPermissions
    : userOrPermissions?.permissions ?? [];

  return requiredPermissions.filter(
    (permission) => !permissions.includes(permission)
  );
}

export function addPermission(
  permissions: TeamUserPermission[],
  permission: TeamUserPermission
): TeamUserPermission[] {
  return sortPermissions(Array.from(new Set([...permissions, permission])));
}

export function removePermission(
  permissions: TeamUserPermission[],
  permission: TeamUserPermission
): TeamUserPermission[] {
  return permissions.filter((item) => item !== permission);
}

export function togglePermission(
  permissions: TeamUserPermission[],
  permission: TeamUserPermission
): TeamUserPermission[] {
  if (permissions.includes(permission)) {
    return removePermission(permissions, permission);
  }

  return addPermission(permissions, permission);
}

export function expandPermissionsFromGroups(
  groupKeys: string[]
): TeamUserPermission[] {
  const permissions = PERMISSION_GROUPS.filter((group) =>
    groupKeys.includes(group.key)
  ).flatMap((group) => group.permissions);

  return sortPermissions(uniquePermissions(permissions));
}

export function isRoleAllowedPermission(
  role: TeamUserRole,
  permission: TeamUserPermission
): boolean {
  return getPermissionsForRole(role).includes(permission);
}

export function getAssignablePermissionsByRole(
  role: TeamUserRole
): TeamUserPermission[] {
  return getPermissionsForRole(role);
}

export function getRoleAccessMatrix(): Record<
  TeamUserRole,
  TeamUserPermission[]
> {
  return {
    super_admin: getPermissionsForRole("super_admin"),
    admin: getPermissionsForRole("admin"),
    manager: getPermissionsForRole("manager"),
    sales_lead: getPermissionsForRole("sales_lead"),
    telecaller: getPermissionsForRole("telecaller"),
    agent: getPermissionsForRole("agent"),
    support: getPermissionsForRole("support"),
    viewer: getPermissionsForRole("viewer"),
  };
}

export function getPermissionSummary(
  permissions: TeamUserPermission[]
): {
  total: number;
  grouped: Array<{
    key: string;
    label: string;
    count: number;
    permissions: TeamUserPermission[];
  }>;
} {
  const normalized = sortPermissions(normalizePermissions(permissions));

  const grouped = PERMISSION_GROUPS.map((group) => {
    const matched = group.permissions.filter((permission) =>
      normalized.includes(permission)
    );

    return {
      key: group.key,
      label: group.label,
      count: matched.length,
      permissions: matched,
    };
  }).filter((group) => group.count > 0);

  return {
    total: normalized.length,
    grouped,
  };
}