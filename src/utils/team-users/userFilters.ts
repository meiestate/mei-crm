// src/utils/team-users/userFilters.ts

import type {
  TeamDepartment,
  TeamUserRecord,
  TeamUsersFilterKey,
  UserRole,
  UserStatus,
} from "../../constants/teamUsersConstants";

export type TeamUsersSortValue =
  | "name-asc"
  | "name-desc"
  | "joined-newest"
  | "joined-oldest"
  | "last-active"
  | "revenue-high"
  | "leads-high"
  | "conversion-high";

export type TeamUsersFilters = {
  search: string;
  roles: UserRole[];
  departments: TeamDepartment[];
  statuses: UserStatus[];
  location: string;
  sortBy: TeamUsersSortValue;
};

export type TeamUsersFilterStats = {
  total: number;
  active: number;
  inactive: number;
  invited: number;
  suspended: number;
  pending: number;
  management: number;
  sales: number;
  support: number;
};

export const DEFAULT_USER_FILTERS: TeamUsersFilters = {
  search: "",
  roles: [],
  departments: [],
  statuses: [],
  location: "all",
  sortBy: "name-asc",
};

function normalizeText(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function safeDateValue(value: string) {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function getActiveUserFilterCount(filters: TeamUsersFilters) {
  let count = 0;

  if (filters.search.trim()) count += 1;
  if (filters.roles.length > 0) count += filters.roles.length;
  if (filters.departments.length > 0) count += filters.departments.length;
  if (filters.statuses.length > 0) count += filters.statuses.length;
  if (normalizeText(filters.location) !== "all") count += 1;
  if (filters.sortBy !== DEFAULT_USER_FILTERS.sortBy) count += 1;

  return count;
}

export function sortUsers(
  users: TeamUserRecord[],
  sortBy: TeamUsersSortValue = "name-asc"
) {
  const sorted = [...users];

  sorted.sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.fullName.localeCompare(b.fullName);

      case "name-desc":
        return b.fullName.localeCompare(a.fullName);

      case "joined-newest":
        return safeDateValue(b.joinedOn) - safeDateValue(a.joinedOn);

      case "joined-oldest":
        return safeDateValue(a.joinedOn) - safeDateValue(b.joinedOn);

      case "last-active":
        return safeDateValue(b.lastActive) - safeDateValue(a.lastActive);

      case "revenue-high":
        return b.monthlyRevenue - a.monthlyRevenue;

      case "leads-high":
        return b.assignedLeads - a.assignedLeads;

      case "conversion-high":
        return b.conversionRate - a.conversionRate;

      default:
        return a.fullName.localeCompare(b.fullName);
    }
  });

  return sorted;
}

export function applyUserQuickFilter(
  filters: TeamUsersFilters,
  quickFilter: TeamUsersFilterKey
): TeamUsersFilters {
  switch (quickFilter) {
    case "all":
      return {
        ...DEFAULT_USER_FILTERS,
        search: filters.search,
        sortBy: filters.sortBy,
      };

    case "active":
    case "inactive":
    case "invited":
    case "suspended":
      return {
        ...filters,
        roles: [],
        departments: [],
        statuses: [quickFilter],
        location: "all",
      };

    case "management":
      return {
        ...filters,
        roles: [],
        departments: ["Management"],
        statuses: [],
        location: "all",
      };

    case "sales":
      return {
        ...filters,
        roles: [],
        departments: ["Sales"],
        statuses: [],
        location: "all",
      };

    case "support":
      return {
        ...filters,
        roles: [],
        departments: ["Support"],
        statuses: [],
        location: "all",
      };

    default:
      return filters;
  }
}

export function filterUsers(
  users: TeamUserRecord[],
  filters: TeamUsersFilters
): TeamUserRecord[] {
  const keyword = normalizeText(filters.search);

  const filtered = users.filter((user) => {
    const matchesSearch =
      !keyword ||
      [
        user.id,
        user.employeeCode,
        user.fullName,
        user.email,
        user.phone,
        user.role,
        user.department,
        user.status,
        user.location,
        user.reportingTo,
        user.notes,
      ]
        .map(normalizeText)
        .some((value) => value.includes(keyword));

    const matchesRole =
      filters.roles.length === 0 || filters.roles.includes(user.role);

    const matchesDepartment =
      filters.departments.length === 0 ||
      filters.departments.includes(user.department);

    const matchesStatus =
      filters.statuses.length === 0 ||
      filters.statuses.includes(user.status);

    const matchesLocation =
      normalizeText(filters.location) === "all" ||
      normalizeText(user.location) === normalizeText(filters.location);

    return (
      matchesSearch &&
      matchesRole &&
      matchesDepartment &&
      matchesStatus &&
      matchesLocation
    );
  });

  return sortUsers(filtered, filters.sortBy);
}

export function filterSelectedUsers(
  users: TeamUserRecord[],
  selectedIds: string[]
): TeamUserRecord[] {
  const selectedSet = new Set(selectedIds);
  return users.filter((user) => selectedSet.has(user.id));
}

export function getUserFilterStats(users: TeamUserRecord[]): TeamUsersFilterStats {
  return {
    total: users.length,
    active: users.filter((user) => user.status === "active").length,
    inactive: users.filter((user) => user.status === "inactive").length,
    invited: users.filter((user) => user.status === "invited").length,
    suspended: users.filter((user) => user.status === "suspended").length,
    pending: users.filter((user) => user.status === "pending").length,
    management: users.filter((user) => user.department === "Management").length,
    sales: users.filter((user) => user.department === "Sales").length,
    support: users.filter((user) => user.department === "Support").length,
  };
}

export function resetUserFilters(): TeamUsersFilters {
  return { ...DEFAULT_USER_FILTERS };
}

export function setUserSearch(
  filters: TeamUsersFilters,
  search: string
): TeamUsersFilters {
  return {
    ...filters,
    search,
  };
}

export function setUserSort(
  filters: TeamUsersFilters,
  sortBy: TeamUsersSortValue
): TeamUsersFilters {
  return {
    ...filters,
    sortBy,
  };
}

export function setUserLocation(
  filters: TeamUsersFilters,
  location: string
): TeamUsersFilters {
  return {
    ...filters,
    location: normalizeText(location) === "all locations" ? "all" : location,
  };
}

export function toggleRoleFilter(
  filters: TeamUsersFilters,
  role: UserRole
): TeamUsersFilters {
  const exists = filters.roles.includes(role);

  return {
    ...filters,
    roles: exists
      ? filters.roles.filter((item) => item !== role)
      : [...filters.roles, role],
  };
}

export function toggleDepartmentFilter(
  filters: TeamUsersFilters,
  department: TeamDepartment
): TeamUsersFilters {
  const exists = filters.departments.includes(department);

  return {
    ...filters,
    departments: exists
      ? filters.departments.filter((item) => item !== department)
      : [...filters.departments, department],
  };
}

export function toggleStatusFilter(
  filters: TeamUsersFilters,
  status: UserStatus
): TeamUsersFilters {
  const exists = filters.statuses.includes(status);

  return {
    ...filters,
    statuses: exists
      ? filters.statuses.filter((item) => item !== status)
      : [...filters.statuses, status],
  };
}

export function hasUserFiltersApplied(filters: TeamUsersFilters) {
  return getActiveUserFilterCount(filters) > 0;
}