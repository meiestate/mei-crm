// src/features/tasks/hooks/useTasks.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import tasksApi, {
  type CreateTaskInput,
  type Task,
  type TaskFilters,
  type TaskPrioritySummary,
  type TaskStatusSummary,
  type TasksApiMode,
  type UpdateTaskInput,
} from "../api/tasksApi";

export type TaskSortKey =
  | "title"
  | "status"
  | "priority"
  | "assignedTo"
  | "relatedToType"
  | "dueDate"
  | "completedAt"
  | "updatedAt"
  | "createdAt";

export type TaskSortDirection = "asc" | "desc";

export type UseTasksFilters = TaskFilters & {
  sortBy: TaskSortKey;
  sortDirection: TaskSortDirection;
};

export type UseTasksOptions = {
  mode?: TasksApiMode;
  autoLoad?: boolean;
  defaultPageSize?: number;
};

export type UseTasksResult = {
  tasks: Task[];
  filteredTasks: Task[];
  paginatedTasks: Task[];
  statusSummary: TaskStatusSummary[];
  prioritySummary: TaskPrioritySummary[];
  loading: boolean;
  summaryLoading: boolean;
  error: string | null;
  mode: TasksApiMode;
  filters: UseTasksFilters;
  selectedIds: string[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasSelection: boolean;
  allVisibleSelected: boolean;
  assignedToOptions: string[];
  statusOptions: string[];
  priorityOptions: string[];
  relatedTypeOptions: string[];
  overdueCount: number;
  dueTodayCount: number;
  completedCount: number;
  setFilters: (updates: Partial<UseTasksFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  refresh: () => Promise<void>;
  refreshSummaries: () => Promise<void>;
  createTask: (
    input: CreateTaskInput,
    options?: { createdBy?: string }
  ) => Promise<Task | null>;
  updateTask: (
    taskId: string,
    updates: UpdateTaskInput,
    options?: { updatedBy?: string }
  ) => Promise<Task | null>;
  deleteTask: (taskId: string) => Promise<boolean>;
  deleteSelectedTasks: () => Promise<boolean>;
  completeTask: (
    taskId: string,
    options?: { completedBy?: string }
  ) => Promise<Task | null>;
  toggleSelect: (taskId: string) => void;
  toggleSelectAllVisible: () => void;
  clearSelection: () => void;
};

const DEFAULT_PAGE_SIZE = 10;

const DEFAULT_FILTERS: UseTasksFilters = {
  search: "",
  status: "",
  priority: "",
  assignedTo: "",
  relatedToType: "",
  overdueOnly: false,
  dueTodayOnly: false,
  sortBy: "updatedAt",
  sortDirection: "desc",
};

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b)
  );
}

function toTimestamp(value?: string): number {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function isCompletedStatus(status?: string): boolean {
  return normalizeString(status).toLowerCase() === "completed";
}

function isCancelledStatus(status?: string): boolean {
  return normalizeString(status).toLowerCase() === "cancelled";
}

function isOverdueTask(task: Task): boolean {
  if (!task.dueDate) return false;
  if (isCompletedStatus(task.status) || isCancelledStatus(task.status)) return false;

  const dueTime = toTimestamp(task.dueDate);
  if (!dueTime) return false;

  return dueTime < Date.now();
}

function isDueTodayTask(task: Task): boolean {
  if (!task.dueDate) return false;

  const due = new Date(task.dueDate);
  if (Number.isNaN(due.getTime())) return false;

  const now = new Date();

  return (
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate()
  );
}

function compareTasks(
  a: Task,
  b: Task,
  sortBy: TaskSortKey,
  sortDirection: TaskSortDirection
): number {
  let result = 0;

  switch (sortBy) {
    case "title":
      result = (a.title ?? "").localeCompare(b.title ?? "");
      break;
    case "status":
      result = (a.status ?? "").localeCompare(b.status ?? "");
      break;
    case "priority":
      result = (a.priority ?? "").localeCompare(b.priority ?? "");
      break;
    case "assignedTo":
      result = (a.assignedTo ?? "").localeCompare(b.assignedTo ?? "");
      break;
    case "relatedToType":
      result = (a.relatedToType ?? "").localeCompare(b.relatedToType ?? "");
      break;
    case "dueDate":
      result = toTimestamp(a.dueDate) - toTimestamp(b.dueDate);
      break;
    case "completedAt":
      result = toTimestamp(a.completedAt) - toTimestamp(b.completedAt);
      break;
    case "createdAt":
      result = toTimestamp(a.createdAt) - toTimestamp(b.createdAt);
      break;
    case "updatedAt":
    default:
      result = toTimestamp(a.updatedAt) - toTimestamp(b.updatedAt);
      break;
  }

  return sortDirection === "asc" ? result : -result;
}

export default function useTasks(
  options: UseTasksOptions = {}
): UseTasksResult {
  const { mode = "auto", autoLoad = true, defaultPageSize = DEFAULT_PAGE_SIZE } =
    options;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusSummary, setStatusSummary] = useState<TaskStatusSummary[]>([]);
  const [prioritySummary, setPrioritySummary] = useState<TaskPrioritySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(autoLoad);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFiltersState] = useState<UseTasksFilters>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_FILTERS;
    }

    const saved = safeJsonParse<Partial<UseTasksFilters>>(
      window.localStorage.getItem("mei-crm-task-filters"),
      {}
    );

    return {
      ...DEFAULT_FILTERS,
      ...saved,
    };
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPageState] = useState<number>(1);
  const [pageSize, setPageSizeState] = useState<number>(
    Math.max(1, defaultPageSize)
  );

  const apiFilters = useMemo<TaskFilters>(
    () => ({
      search: filters.search || undefined,
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      assignedTo: filters.assignedTo || undefined,
      relatedToType: filters.relatedToType || undefined,
      overdueOnly: filters.overdueOnly || undefined,
      dueTodayOnly: filters.dueTodayOnly || undefined,
    }),
    [
      filters.search,
      filters.status,
      filters.priority,
      filters.assignedTo,
      filters.relatedToType,
      filters.overdueOnly,
      filters.dueTodayOnly,
    ]
  );

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await tasksApi.getTasks({
        mode,
        filters: apiFilters,
      });

      setTasks(response.items);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load tasks.";
      setError(message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [mode, apiFilters]);

  const loadSummaries = useCallback(async () => {
    setSummaryLoading(true);

    try {
      const [statuses, priorities] = await Promise.all([
        tasksApi.getTaskStatusSummary({
          mode,
          filters: apiFilters,
        }),
        tasksApi.getTaskPrioritySummary({
          mode,
          filters: apiFilters,
        }),
      ]);

      setStatusSummary(statuses);
      setPrioritySummary(priorities);
    } catch {
      setStatusSummary([]);
      setPrioritySummary([]);
    } finally {
      setSummaryLoading(false);
    }
  }, [mode, apiFilters]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadTasks();
  }, [autoLoad, loadTasks]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadSummaries();
  }, [autoLoad, loadSummaries]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      "mei-crm-task-filters",
      JSON.stringify(filters)
    );
  }, [filters]);

  const filteredTasks = useMemo(() => {
    return [...tasks].sort((a, b) =>
      compareTasks(a, b, filters.sortBy, filters.sortDirection)
    );
  }, [tasks, filters.sortBy, filters.sortDirection]);

  const totalCount = filteredTasks.length;
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
    filters.status,
    filters.priority,
    filters.assignedTo,
    filters.relatedToType,
    filters.overdueOnly,
    filters.dueTodayOnly,
    filters.sortBy,
    filters.sortDirection,
    pageSize,
  ]);

  const paginatedTasks = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredTasks.slice(startIndex, startIndex + pageSize);
  }, [filteredTasks, page, pageSize]);

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => tasks.some((task) => task.id === id))
    );
  }, [tasks]);

  const assignedToOptions = useMemo(
    () => uniqueSorted(tasks.map((task) => normalizeString(task.assignedTo))),
    [tasks]
  );

  const statusOptions = useMemo(
    () => uniqueSorted(tasks.map((task) => normalizeString(task.status))),
    [tasks]
  );

  const priorityOptions = useMemo(
    () => uniqueSorted(tasks.map((task) => normalizeString(task.priority))),
    [tasks]
  );

  const relatedTypeOptions = useMemo(
    () => uniqueSorted(tasks.map((task) => normalizeString(task.relatedToType))),
    [tasks]
  );

  const overdueCount = useMemo(
    () => filteredTasks.filter((task) => isOverdueTask(task)).length,
    [filteredTasks]
  );

  const dueTodayCount = useMemo(
    () => filteredTasks.filter((task) => isDueTodayTask(task)).length,
    [filteredTasks]
  );

  const completedCount = useMemo(
    () => filteredTasks.filter((task) => isCompletedStatus(task.status)).length,
    [filteredTasks]
  );

  const setFilters = useCallback((updates: Partial<UseTasksFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([loadTasks(), loadSummaries()]);
  }, [loadTasks, loadSummaries]);

  const refreshSummaries = useCallback(async () => {
    await loadSummaries();
  }, [loadSummaries]);

  const createTask = useCallback(
    async (
      input: CreateTaskInput,
      options?: { createdBy?: string }
    ): Promise<Task | null> => {
      try {
        const created = await tasksApi.createTask(input, {
          mode,
          createdBy: options?.createdBy,
        });

        await refresh();
        return created;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create task.";
        setError(message);
        return null;
      }
    },
    [mode, refresh]
  );

  const updateTask = useCallback(
    async (
      taskId: string,
      updates: UpdateTaskInput,
      options?: { updatedBy?: string }
    ): Promise<Task | null> => {
      try {
        const updated = await tasksApi.updateTask(taskId, updates, {
          mode,
          updatedBy: options?.updatedBy,
        });

        await refresh();
        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update task.";
        setError(message);
        return null;
      }
    },
    [mode, refresh]
  );

  const deleteTask = useCallback(
    async (taskId: string): Promise<boolean> => {
      try {
        const success = await tasksApi.deleteTask(taskId, { mode });

        if (success) {
          setSelectedIds((prev) => prev.filter((id) => id !== taskId));
          await refresh();
        }

        return success;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete task.";
        setError(message);
        return false;
      }
    },
    [mode, refresh]
  );

  const deleteSelectedTasks = useCallback(async (): Promise<boolean> => {
    if (selectedIds.length === 0) return true;

    try {
      const results = await Promise.all(
        selectedIds.map((taskId) => tasksApi.deleteTask(taskId, { mode }))
      );

      const success = results.every(Boolean);

      if (success) {
        setSelectedIds([]);
        await refresh();
      }

      return success;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete selected tasks.";
      setError(message);
      return false;
    }
  }, [mode, refresh, selectedIds]);

  const completeTask = useCallback(
    async (
      taskId: string,
      options?: { completedBy?: string }
    ): Promise<Task | null> => {
      try {
        const completed = await tasksApi.completeTask(taskId, {
          mode,
          completedBy: options?.completedBy,
        });

        await refresh();
        return completed;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to complete task.";
        setError(message);
        return null;
      }
    },
    [mode, refresh]
  );

  const toggleSelect = useCallback((taskId: string) => {
    setSelectedIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  }, []);

  const allVisibleSelected = useMemo(() => {
    if (paginatedTasks.length === 0) return false;
    return paginatedTasks.every((task) => selectedIds.includes(task.id));
  }, [paginatedTasks, selectedIds]);

  const toggleSelectAllVisible = useCallback(() => {
    const visibleIds = paginatedTasks.map((task) => task.id);

    if (visibleIds.length === 0) return;

    setSelectedIds((prev) => {
      const prevSet = new Set(prev);
      const everySelected = visibleIds.every((id) => prevSet.has(id));

      if (everySelected) {
        return prev.filter((id) => !visibleIds.includes(id));
      }

      return Array.from(new Set([...prev, ...visibleIds]));
    });
  }, [paginatedTasks]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(1, nextPage));
  }, []);

  const setPageSize = useCallback((nextPageSize: number) => {
    setPageSizeState(Math.max(1, nextPageSize));
  }, []);

  return {
    tasks,
    filteredTasks,
    paginatedTasks,
    statusSummary,
    prioritySummary,
    loading,
    summaryLoading,
    error,
    mode,
    filters,
    selectedIds,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasSelection: selectedIds.length > 0,
    allVisibleSelected,
    assignedToOptions,
    statusOptions,
    priorityOptions,
    relatedTypeOptions,
    overdueCount,
    dueTodayCount,
    completedCount,
    setFilters,
    resetFilters,
    setPage,
    setPageSize,
    refresh,
    refreshSummaries,
    createTask,
    updateTask,
    deleteTask,
    deleteSelectedTasks,
    completeTask,
    toggleSelect,
    toggleSelectAllVisible,
    clearSelection,
  };
}