// src/features/settings/hooks/useUsers.ts

import { useCallback, useEffect, useMemo, useState } from "react";

export type UserStatus = "active" | "invited" | "inactive" | "suspended" | string;
export type UserRole = "Admin" | "Manager" | "Agent" | string;

export type UserItem = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: string;
  status: UserStatus;
  avatarUrl?: string;
  lastActiveAt?: string;
  joinedAt?: string;
  invitedAt?: string;
  isOwner?: boolean;
};

export type UserSortKey =
  | "name"
  | "email"
  | "role"
  | "status"
  | "department"
  | "lastActiveAt"
  | "joinedAt";

export type UserSortDirection = "asc" | "desc";

export type UsersFilters = {
  search: string;
  role: string;
  status: string;
  department: string;
  sortBy: UserSortKey;
  sortDirection: UserSortDirection;
};

export type CreateUserInput = {
  name: string;
  email: string;
  phone?: string;
  role?: UserRole;
  department?: string;
  status?: UserStatus;
  avatarUrl?: string;
  isOwner?: boolean;
};

export type UpdateUserInput = Partial<CreateUserInput> & {
  lastActiveAt?: string;
  joinedAt?: string;
  invitedAt?: string;
};

export type UseUsersOptions = {
  autoLoad?: boolean;
  defaultPageSize?: number;
};

export type UseUsersResult = {
  users: UserItem[];
  filteredUsers: UserItem[];
  paginatedUsers: UserItem[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  filters: UsersFilters;
  selectedIds: string[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasSelection: boolean;
  allVisibleSelected: boolean;
  roleOptions: string[];
  statusOptions: string[];
  departmentOptions: string[];
  setFilters: (updates: Partial<UsersFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  refresh: () => Promise<void>;
  clearState: () => void;
  createUser: (input: CreateUserInput) => Promise<UserItem | null>;
  updateUser: (userId: string, updates: UpdateUserInput) => Promise<UserItem | null>;
  deleteUser: (userId: string) => Promise<boolean>;
  deleteSelectedUsers: () => Promise<boolean>;
  toggleSelect: (userId: string) => void;
  toggleSelectAllVisible: () => void;
  clearSelection: () => void;
  getUserById: (userId: string) => UserItem | undefined;
};

const USERS_STORAGE_KEY = "mei-crm-users";
const DEFAULT_PAGE_SIZE = 10;

const DEFAULT_FILTERS: UsersFilters = {
  search: "",
  role: "",
  status: "",
  department: "",
  sortBy: "lastActiveAt",
  sortDirection: "desc",
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function readUsersFromStorage(): UserItem[] {
  if (!isBrowser()) return getDefaultUsers();

  const stored = safeJsonParse<unknown[]>(window.localStorage.getItem(USERS_STORAGE_KEY), []);
  const mapped = stored
    .map(mapUser)
    .filter((item): item is UserItem => Boolean(item));

  if (mapped.length > 0) return mapped;

  const defaults = getDefaultUsers();
  writeUsersToStorage(defaults);
  return defaults;
}

function writeUsersToStorage(users: UserItem[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toTimestamp(value?: string): number {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}

function createUserId(prefix = "user"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function mapUser(raw: unknown): UserItem | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
  const id = normalizeString(item.id);
  const name = normalizeString(item.name);
  const email = normalizeString(item.email);

  if (!id || !name || !email) return null;

  return {
    id,
    name,
    email,
    phone: normalizeString(item.phone) || undefined,
    role: normalizeString(item.role) || "Agent",
    department: normalizeString(item.department) || undefined,
    status: normalizeString(item.status) || "active",
    avatarUrl: normalizeString(item.avatarUrl) || undefined,
    lastActiveAt: normalizeString(item.lastActiveAt) || undefined,
    joinedAt: normalizeString(item.joinedAt) || undefined,
    invitedAt: normalizeString(item.invitedAt) || undefined,
    isOwner: Boolean(item.isOwner),
  };
}

function getDefaultUsers(): UserItem[] {
  const now = nowIso();

  return [
    {
      id: "user-owner",
      name: "Workspace Owner",
      email: "owner@mei.local",
      role: "Admin",
      department: "Management",
      status: "active",
      joinedAt: now,
      lastActiveAt: now,
      isOwner: true,
    },
    {
      id: "user-manager",
      name: "Sales Manager",
      email: "manager@mei.local",
      role: "Manager",
      department: "Sales",
      status: "active",
      joinedAt: now,
      lastActiveAt: now,
    },
    {
      id: "user-agent",
      name: "Field Agent",
      email: "agent@mei.local",
      role: "Agent",
      department: "Sales",
      status: "invited",
      invitedAt: now,
    },
  ];
}

function matchesFilters(user: UserItem, filters: UsersFilters): boolean {
  const search = filters.search.trim().toLowerCase();

  if (search) {
    const haystack = [
      user.name,
      user.email,
      user.phone,
      user.role,
      user.status,
      user.department,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(search)) {
      return false;
    }
  }

  if (filters.role && user.role !== filters.role) return false;
  if (filters.status && user.status !== filters.status) return false;
  if (filters.department && (user.department ?? "") !== filters.department) return false;

  return true;
}

function compareUsers(
  a: UserItem,
  b: UserItem,
  sortBy: UserSortKey,
  sortDirection: UserSortDirection
): number {
  let result = 0;

  switch (sortBy) {
    case "name":
      result = a.name.localeCompare(b.name);
      break;
    case "email":
      result = a.email.localeCompare(b.email);
      break;
    case "role":
      result = (a.role ?? "").localeCompare(b.role ?? "");
      break;
    case "status":
      result = (a.status ?? "").localeCompare(b.status ?? "");
      break;
    case "department":
      result = (a.department ?? "").localeCompare(b.department ?? "");
      break;
    case "joinedAt":
      result = toTimestamp(a.joinedAt) - toTimestamp(b.joinedAt);
      break;
    case "lastActiveAt":
    default:
      result = toTimestamp(a.lastActiveAt) - toTimestamp(b.lastActiveAt);
      break;
  }

  return sortDirection === "asc" ? result : -result;
}

export default function useUsers(
  options: UseUsersOptions = {}
): UseUsersResult {
  const { autoLoad = true, defaultPageSize = DEFAULT_PAGE_SIZE } = options;

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(autoLoad);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [filters, setFiltersState] = useState<UsersFilters>(DEFAULT_FILTERS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPageState] = useState<number>(1);
  const [pageSize, setPageSizeState] = useState<number>(Math.max(1, defaultPageSize));

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextUsers = readUsersFromStorage();
      setUsers(nextUsers);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load users.";
      setError(message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoLoad) return;
    void loadUsers();
  }, [autoLoad, loadUsers]);

  const refresh = useCallback(async () => {
    await loadUsers();
  }, [loadUsers]);

  const clearState = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const filteredUsers = useMemo(() => {
    return [...users]
      .filter((user) => matchesFilters(user, filters))
      .sort((a, b) => compareUsers(a, b, filters.sortBy, filters.sortDirection));
  }, [users, filters]);

  const totalCount = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPageState(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    setPageState(1);
  }, [
    filters.search,
    filters.role,
    filters.status,
    filters.department,
    filters.sortBy,
    filters.sortDirection,
    pageSize,
  ]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, page, pageSize]);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => users.some((user) => user.id === id)));
  }, [users]);

  const roleOptions = useMemo(
    () => uniqueSorted(users.map((user) => normalizeString(user.role))),
    [users]
  );

  const statusOptions = useMemo(
    () => uniqueSorted(users.map((user) => normalizeString(user.status))),
    [users]
  );

  const departmentOptions = useMemo(
    () => uniqueSorted(users.map((user) => normalizeString(user.department))),
    [users]
  );

  const setFilters = useCallback((updates: Partial<UsersFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const createUser = useCallback(async (input: CreateUserInput): Promise<UserItem | null> => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const name = normalizeString(input.name);
      const email = normalizeString(input.email);

      if (!name) {
        throw new Error("User name is required.");
      }

      if (!email) {
        throw new Error("User email is required.");
      }

      if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("A user with this email already exists.");
      }

      const now = nowIso();

      const nextUser: UserItem = {
        id: createUserId(),
        name,
        email,
        phone: normalizeString(input.phone) || undefined,
        role: normalizeString(input.role) || "Agent",
        department: normalizeString(input.department) || undefined,
        status: normalizeString(input.status) || "invited",
        avatarUrl: normalizeString(input.avatarUrl) || undefined,
        invitedAt: now,
        joinedAt: normalizeString(input.status) === "active" ? now : undefined,
        lastActiveAt: normalizeString(input.status) === "active" ? now : undefined,
        isOwner: Boolean(input.isOwner),
      };

      const nextUsers = [nextUser, ...users];
      writeUsersToStorage(nextUsers);
      setUsers(nextUsers);
      setSuccessMessage(`User "${nextUser.name}" created successfully.`);

      return nextUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create user.";
      setError(message);
      return null;
    } finally {
      setSaving(false);
    }
  }, [users]);

  const updateUser = useCallback(
    async (userId: string, updates: UpdateUserInput): Promise<UserItem | null> => {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const cleanUserId = normalizeString(userId);

        if (!cleanUserId) {
          throw new Error("User ID is required.");
        }

        const userIndex = users.findIndex((user) => user.id === cleanUserId);

        if (userIndex === -1) {
          throw new Error("User not found.");
        }

        const currentUser = users[userIndex];
        const nextEmail =
          updates.email !== undefined
            ? normalizeString(updates.email) || currentUser.email
            : currentUser.email;

        const duplicateEmail = users.some(
          (user) =>
            user.id !== cleanUserId &&
            user.email.toLowerCase() === nextEmail.toLowerCase()
        );

        if (duplicateEmail) {
          throw new Error("Another user already uses this email.");
        }

        const updatedUser: UserItem = {
          ...currentUser,
          ...updates,
          name:
            updates.name !== undefined
              ? normalizeString(updates.name) || currentUser.name
              : currentUser.name,
          email: nextEmail,
          phone:
            updates.phone !== undefined
              ? normalizeString(updates.phone) || undefined
              : currentUser.phone,
          role:
            updates.role !== undefined
              ? normalizeString(updates.role) || currentUser.role
              : currentUser.role,
          department:
            updates.department !== undefined
              ? normalizeString(updates.department) || undefined
              : currentUser.department,
          status:
            updates.status !== undefined
              ? normalizeString(updates.status) || currentUser.status
              : currentUser.status,
          avatarUrl:
            updates.avatarUrl !== undefined
              ? normalizeString(updates.avatarUrl) || undefined
              : currentUser.avatarUrl,
          lastActiveAt:
            updates.lastActiveAt !== undefined
              ? normalizeString(updates.lastActiveAt) || undefined
              : currentUser.lastActiveAt,
          joinedAt:
            updates.joinedAt !== undefined
              ? normalizeString(updates.joinedAt) || undefined
              : currentUser.joinedAt,
          invitedAt:
            updates.invitedAt !== undefined
              ? normalizeString(updates.invitedAt) || undefined
              : currentUser.invitedAt,
          isOwner:
            updates.isOwner !== undefined ? Boolean(updates.isOwner) : currentUser.isOwner,
        };

        const nextUsers = [...users];
        nextUsers[userIndex] = updatedUser;

        writeUsersToStorage(nextUsers);
        setUsers(nextUsers);
        setSuccessMessage(`User "${updatedUser.name}" updated successfully.`);

        return updatedUser;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update user.";
        setError(message);
        return null;
      } finally {
        setSaving(false);
      }
    },
    [users]
  );

  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const cleanUserId = normalizeString(userId);

      if (!cleanUserId) {
        throw new Error("User ID is required.");
      }

      const target = users.find((user) => user.id === cleanUserId);

      if (!target) {
        throw new Error("User not found.");
      }

      if (target.isOwner) {
        throw new Error("Owner user cannot be deleted.");
      }

      const nextUsers = users.filter((user) => user.id !== cleanUserId);

      writeUsersToStorage(nextUsers);
      setUsers(nextUsers);
      setSelectedIds((prev) => prev.filter((id) => id !== cleanUserId));
      setSuccessMessage(`User "${target.name}" deleted successfully.`);

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete user.";
      setError(message);
      return false;
    } finally {
      setSaving(false);
    }
  }, [users]);

  const deleteSelectedUsers = useCallback(async (): Promise<boolean> => {
    if (selectedIds.length === 0) return true;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const protectedUser = users.find(
        (user) => selectedIds.includes(user.id) && user.isOwner
      );

      if (protectedUser) {
        throw new Error("Owner user cannot be deleted.");
      }

      const nextUsers = users.filter((user) => !selectedIds.includes(user.id));

      writeUsersToStorage(nextUsers);
      setUsers(nextUsers);
      setSelectedIds([]);
      setSuccessMessage("Selected users deleted successfully.");

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete selected users.";
      setError(message);
      return false;
    } finally {
      setSaving(false);
    }
  }, [selectedIds, users]);

  const toggleSelect = useCallback((userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }, []);

  const allVisibleSelected = useMemo(() => {
    if (paginatedUsers.length === 0) return false;
    return paginatedUsers.every((user) => selectedIds.includes(user.id));
  }, [paginatedUsers, selectedIds]);

  const toggleSelectAllVisible = useCallback(() => {
    const visibleIds = paginatedUsers.map((user) => user.id);

    if (visibleIds.length === 0) return;

    setSelectedIds((prev) => {
      const prevSet = new Set(prev);
      const everySelected = visibleIds.every((id) => prevSet.has(id));

      if (everySelected) {
        return prev.filter((id) => !visibleIds.includes(id));
      }

      return Array.from(new Set([...prev, ...visibleIds]));
    });
  }, [paginatedUsers]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const getUserById = useCallback(
    (userId: string) => users.find((user) => user.id === userId),
    [users]
  );

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(1, nextPage));
  }, []);

  const setPageSize = useCallback((nextPageSize: number) => {
    setPageSizeState(Math.max(1, nextPageSize));
  }, []);

  return {
    users,
    filteredUsers,
    paginatedUsers,
    loading,
    saving,
    error,
    successMessage,
    filters,
    selectedIds,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasSelection: selectedIds.length > 0,
    allVisibleSelected,
    roleOptions,
    statusOptions,
    departmentOptions,
    setFilters,
    resetFilters,
    setPage,
    setPageSize,
    refresh,
    clearState,
    createUser,
    updateUser,
    deleteUser,
    deleteSelectedUsers,
    toggleSelect,
    toggleSelectAllVisible,
    clearSelection,
    getUserById,
  };
}