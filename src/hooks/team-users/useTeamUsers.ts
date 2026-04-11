// src/hooks/team-users/useTeamUsers.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import mockTeamUsers from "../../data/mockTeamUsers";
import {
  DEFAULT_TEAM_USER_FILTERS,
  ROLE_PERMISSION_MAP,
  TEAM_USERS_PAGINATION,
  TEAM_USERS_SELECTED_IDS_KEY,
  TEAM_USERS_SORT_OPTIONS,
  TEAM_USERS_STORAGE_KEY,
  type TeamDepartment,
  type TeamUserRecord,
  type TeamUsersFilterKey,
  type UserRole,
  type UserStatus,
} from "../../constants/teamUsersConstants";

type TeamUsersSortValue =
  (typeof TEAM_USERS_SORT_OPTIONS)[number]["value"];

type TeamUsersFilters = typeof DEFAULT_TEAM_USER_FILTERS;

type BulkActionType =
  | "activate"
  | "deactivate"
  | "suspend"
  | "change-role"
  | "change-department"
  | "export"
  | "delete";

type BulkActionPayload = {
  role?: UserRole;
  department?: TeamDepartment;
};

type TeamUsersStats = {
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

type CreateTeamUserInput = Omit<TeamUserRecord, "id" | "permissions"> & {
  id?: string;
  permissions?: TeamUserRecord["permissions"];
};

type UpdateTeamUserInput = Partial<Omit<TeamUserRecord, "id">>;

type UseTeamUsersReturn = {
  users: TeamUserRecord[];
  filteredUsers: TeamUserRecord[];
  paginatedUsers: TeamUserRecord[];
  selectedUsers: TeamUserRecord[];
  selectedIds: string[];
  filters: TeamUsersFilters;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  stats: TeamUsersStats;
  allSelectedOnPage: boolean;
  isAllSelected: boolean;

  setFilters: React.Dispatch<React.SetStateAction<TeamUsersFilters>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;

  setSearch: (value: string) => void;
  setQuickFilter: (key: TeamUsersFilterKey) => void;
  setSortBy: (value: TeamUsersSortValue) => void;
  toggleRoleFilter: (role: UserRole) => void;
  toggleDepartmentFilter: (department: TeamDepartment) => void;
  toggleStatusFilter: (status: UserStatus) => void;
  setLocationFilter: (location: string) => void;
  resetFilters: () => void;

  toggleSelect: (userId: string) => void;
  toggleSelectAllOnPage: () => void;
  clearSelection: () => void;

  createUser: (input: CreateTeamUserInput) => TeamUserRecord;
  updateUser: (userId: string, updates: UpdateTeamUserInput) => TeamUserRecord | null;
  deleteUser: (userId: string) => void;
  deleteSelectedUsers: () => void;

  applyBulkAction: (
    action: BulkActionType,
    payload?: BulkActionPayload
  ) => { exportedCsv?: string; updatedCount: number };

  getUserById: (userId: string) => TeamUserRecord | undefined;
};

const DEFAULT_PAGE = TEAM_USERS_PAGINATION.defaultPage;
const DEFAULT_PAGE_SIZE = TEAM_USERS_PAGINATION.defaultPageSize;

function safeJsonParse<T>(value: string | null, fallback: T): T {
  try {
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function generateUserId(existingUsers: TeamUserRecord[]) {
  const numericIds = existingUsers
    .map((user) => Number(user.id.replace(/[^\d]/g, "")))
    .filter((value) => !Number.isNaN(value));

  const nextId = numericIds.length ? Math.max(...numericIds) + 1 : 1001;
  return `USR-${String(nextId).padStart(4, "0")}`;
}

function normalizeText(value: string | number | undefined | null) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function sortUsers(users: TeamUserRecord[], sortBy: TeamUsersSortValue) {
  const sorted = [...users];

  sorted.sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.fullName.localeCompare(b.fullName);

      case "name-desc":
        return b.fullName.localeCompare(a.fullName);

      case "joined-newest":
        return new Date(b.joinedOn).getTime() - new Date(a.joinedOn).getTime();

      case "joined-oldest":
        return new Date(a.joinedOn).getTime() - new Date(b.joinedOn).getTime();

      case "last-active":
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();

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

function exportUsersToCsv(users: TeamUserRecord[]) {
  const headers = [
    "ID",
    "Employee Code",
    "Full Name",
    "Email",
    "Phone",
    "Role",
    "Department",
    "Status",
    "Location",
    "Reporting To",
    "Joined On",
    "Last Active",
    "Timezone",
    "Assigned Leads",
    "Active Deals",
    "Tasks Due Today",
    "Monthly Revenue",
    "Conversion Rate",
    "Notes",
  ];

  const escapeCsvValue = (value: string | number | undefined | null) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const rows = users.map((user) =>
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
      user.reportingTo ?? "",
      user.joinedOn,
      user.lastActive,
      user.timezone,
      user.assignedLeads,
      user.activeDeals,
      user.tasksDueToday,
      user.monthlyRevenue,
      user.conversionRate,
      user.notes ?? "",
    ]
      .map(escapeCsvValue)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

export default function useTeamUsers(): UseTeamUsersReturn {
  const [users, setUsers] = useState<TeamUserRecord[]>(() =>
    safeJsonParse<TeamUserRecord[]>(
      typeof window !== "undefined"
        ? localStorage.getItem(TEAM_USERS_STORAGE_KEY)
        : null,
      mockTeamUsers
    )
  );

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    safeJsonParse<string[]>(
      typeof window !== "undefined"
        ? localStorage.getItem(TEAM_USERS_SELECTED_IDS_KEY)
        : null,
      []
    )
  );

  const [filters, setFilters] = useState<TeamUsersFilters>(DEFAULT_TEAM_USER_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    localStorage.setItem(TEAM_USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(TEAM_USERS_SELECTED_IDS_KEY, JSON.stringify(selectedIds));
  }, [selectedIds]);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => users.some((user) => user.id === id)));
  }, [users]);

  const filteredUsers = useMemo(() => {
    const search = normalizeText(filters.search);

    const searched = users.filter((user) => {
      const matchesSearch =
        !search ||
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
          .map((item) => normalizeText(item))
          .some((item) => item.includes(search));

      const matchesRole =
        filters.roles.length === 0 || filters.roles.includes(user.role);

      const matchesDepartment =
        filters.departments.length === 0 ||
        filters.departments.includes(user.department);

      const matchesStatus =
        filters.statuses.length === 0 ||
        filters.statuses.includes(user.status);

      const matchesLocation =
        filters.location === "all" ||
        normalizeText(user.location) === normalizeText(filters.location);

      return (
        matchesSearch &&
        matchesRole &&
        matchesDepartment &&
        matchesStatus &&
        matchesLocation
      );
    });

    return sortUsers(searched, filters.sortBy as TeamUsersSortValue);
  }, [users, filters]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const selectedUsers = useMemo(
    () => users.filter((user) => selectedIds.includes(user.id)),
    [users, selectedIds]
  );

  const stats = useMemo<TeamUsersStats>(() => {
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
      suspendedUsers,
      pendingUsers,
      totalAssignedLeads,
      totalActiveDeals,
      totalTasksDueToday,
      totalMonthlyRevenue,
      averageConversionRate,
    };
  }, [users]);

  const allSelectedOnPage = useMemo(() => {
    if (paginatedUsers.length === 0) return false;
    return paginatedUsers.every((user) => selectedIds.includes(user.id));
  }, [paginatedUsers, selectedIds]);

  const isAllSelected = useMemo(() => {
    if (filteredUsers.length === 0) return false;
    return filteredUsers.every((user) => selectedIds.includes(user.id));
  }, [filteredUsers, selectedIds]);

  const setSearch = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  }, []);

  const setQuickFilter = useCallback((key: TeamUsersFilterKey) => {
    setCurrentPage(1);

    switch (key) {
      case "all":
        setFilters((prev) => ({
          ...DEFAULT_TEAM_USER_FILTERS,
          search: prev.search,
          sortBy: prev.sortBy,
        }));
        return;

      case "active":
      case "inactive":
      case "invited":
      case "suspended":
        setFilters((prev) => ({
          ...prev,
          statuses: [key],
          roles: [],
          departments: [],
        }));
        return;

      case "management":
        setFilters((prev) => ({
          ...prev,
          departments: ["Management"],
          roles: [],
          statuses: [],
        }));
        return;

      case "sales":
        setFilters((prev) => ({
          ...prev,
          departments: ["Sales"],
          roles: [],
          statuses: [],
        }));
        return;

      case "support":
        setFilters((prev) => ({
          ...prev,
          departments: ["Support"],
          roles: [],
          statuses: [],
        }));
        return;

      default:
        return;
    }
  }, []);

  const setSortBy = useCallback((value: TeamUsersSortValue) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
    setCurrentPage(1);
  }, []);

  const toggleRoleFilter = useCallback((role: UserRole) => {
    setFilters((prev) => {
      const exists = prev.roles.includes(role);
      return {
        ...prev,
        roles: exists
          ? prev.roles.filter((item) => item !== role)
          : [...prev.roles, role],
      };
    });
    setCurrentPage(1);
  }, []);

  const toggleDepartmentFilter = useCallback((department: TeamDepartment) => {
    setFilters((prev) => {
      const exists = prev.departments.includes(department);
      return {
        ...prev,
        departments: exists
          ? prev.departments.filter((item) => item !== department)
          : [...prev.departments, department],
      };
    });
    setCurrentPage(1);
  }, []);

  const toggleStatusFilter = useCallback((status: UserStatus) => {
    setFilters((prev) => {
      const exists = prev.statuses.includes(status);
      return {
        ...prev,
        statuses: exists
          ? prev.statuses.filter((item) => item !== status)
          : [...prev.statuses, status],
      };
    });
    setCurrentPage(1);
  }, []);

  const setLocationFilter = useCallback((location: string) => {
    setFilters((prev) => ({
      ...prev,
      location: location === "All Locations" ? "all" : location,
    }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_TEAM_USER_FILTERS);
    setCurrentPage(DEFAULT_PAGE);
  }, []);

  const toggleSelect = useCallback((userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const toggleSelectAllOnPage = useCallback(() => {
    setSelectedIds((prev) => {
      const pageIds = paginatedUsers.map((user) => user.id);
      const alreadyAllSelected = pageIds.every((id) => prev.includes(id));

      if (alreadyAllSelected) {
        return prev.filter((id) => !pageIds.includes(id));
      }

      return Array.from(new Set([...prev, ...pageIds]));
    });
  }, [paginatedUsers]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const createUser = useCallback((input: CreateTeamUserInput): TeamUserRecord => {
    const newUser: TeamUserRecord = {
      ...input,
      id: input.id ?? generateUserId(users),
      permissions:
        input.permissions ?? ROLE_PERMISSION_MAP[input.role] ?? [],
    };

    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  }, [users]);

  const updateUser = useCallback(
    (userId: string, updates: UpdateTeamUserInput): TeamUserRecord | null => {
      let updatedUser: TeamUserRecord | null = null;

      setUsers((prev) =>
        prev.map((user) => {
          if (user.id !== userId) return user;

          const nextRole = updates.role ?? user.role;

          updatedUser = {
            ...user,
            ...updates,
            permissions:
              updates.permissions ??
              (updates.role
                ? ROLE_PERMISSION_MAP[nextRole] ?? user.permissions
                : user.permissions),
          };

          return updatedUser!;
        })
      );

      return updatedUser;
    },
    []
  );

  const deleteUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    setSelectedIds((prev) => prev.filter((id) => id !== userId));
  }, []);

  const deleteSelectedUsers = useCallback(() => {
    if (selectedIds.length === 0) return;

    setUsers((prev) => prev.filter((user) => !selectedIds.includes(user.id)));
    setSelectedIds([]);
  }, [selectedIds]);

  const applyBulkAction = useCallback(
    (
      action: BulkActionType,
      payload?: BulkActionPayload
    ): { exportedCsv?: string; updatedCount: number } => {
      if (selectedIds.length === 0) {
        return { updatedCount: 0 };
      }

      const selectedSet = new Set(selectedIds);

      if (action === "export") {
        const csv = exportUsersToCsv(
          users.filter((user) => selectedSet.has(user.id))
        );
        return { exportedCsv: csv, updatedCount: selectedIds.length };
      }

      if (action === "delete") {
        const count = selectedIds.length;
        setUsers((prev) => prev.filter((user) => !selectedSet.has(user.id)));
        setSelectedIds([]);
        return { updatedCount: count };
      }

      setUsers((prev) =>
        prev.map((user) => {
          if (!selectedSet.has(user.id)) return user;

          switch (action) {
            case "activate":
              return { ...user, status: "active" };

            case "deactivate":
              return { ...user, status: "inactive" };

            case "suspend":
              return { ...user, status: "suspended" };

            case "change-role": {
              const nextRole = payload?.role ?? user.role;
              return {
                ...user,
                role: nextRole,
                permissions: ROLE_PERMISSION_MAP[nextRole] ?? user.permissions,
              };
            }

            case "change-department":
              return {
                ...user,
                department: payload?.department ?? user.department,
              };

            default:
              return user;
          }
        })
      );

      return { updatedCount: selectedIds.length };
    },
    [selectedIds, users]
  );

  const getUserById = useCallback(
    (userId: string) => users.find((user) => user.id === userId),
    [users]
  );

  return {
    users,
    filteredUsers,
    paginatedUsers,
    selectedUsers,
    selectedIds,
    filters,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    stats,
    allSelectedOnPage,
    isAllSelected,

    setFilters,
    setCurrentPage,
    setPageSize,

    setSearch,
    setQuickFilter,
    setSortBy,
    toggleRoleFilter,
    toggleDepartmentFilter,
    toggleStatusFilter,
    setLocationFilter,
    resetFilters,

    toggleSelect,
    toggleSelectAllOnPage,
    clearSelection,

    createUser,
    updateUser,
    deleteUser,
    deleteSelectedUsers,

    applyBulkAction,
    getUserById,
  };
}