// src/features/tasks/api/tasksApi.ts

export type TasksApiMode = "auto" | "local" | "remote";

export type TaskStatus =
  | "todo"
  | "in_progress"
  | "completed"
  | "overdue"
  | "cancelled"
  | string;

export type TaskPriority = "low" | "medium" | "high" | "urgent" | string;

export type Task = {
  id: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  assignedToId?: string;
  relatedToType?: "lead" | "deal" | "contact" | "general" | string;
  relatedToId?: string;
  relatedToName?: string;
  dueDate?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  tags?: string[];
  reminderAt?: string;
};

export type TaskActivityType =
  | "note"
  | "created"
  | "updated"
  | "status_change"
  | "completed"
  | "deleted"
  | "reminder"
  | string;

export type TaskActivity = {
  id: string;
  taskId: string;
  type: TaskActivityType;
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
  entityType?: string;
  entityId?: string;
};

export type TaskFilters = {
  search?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  relatedToType?: string;
  overdueOnly?: boolean;
  dueTodayOnly?: boolean;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  assignedToId?: string;
  relatedToType?: "lead" | "deal" | "contact" | "general" | string;
  relatedToId?: string;
  relatedToName?: string;
  dueDate?: string;
  createdBy?: string;
  tags?: string[];
  reminderAt?: string;
};

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  completedAt?: string;
};

export type TaskListResponse = {
  items: Task[];
  total: number;
};

export type TaskStatusSummary = {
  status: string;
  count: number;
};

export type TaskPrioritySummary = {
  priority: string;
  count: number;
};

type UnknownRecord = Record<string, unknown>;

const STORAGE_KEYS = {
  tasks: "mei-crm-tasks",
  taskActivities: "mei-crm-task-activities",
} as const;

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

function readStorageArray<T = UnknownRecord>(key: string): T[] {
  if (!isBrowser()) return [];
  return safeJsonParse<T[]>(window.localStorage.getItem(key), []);
}

function writeStorageArray<T>(key: string, value: T[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toTimestamp(value: unknown): number {
  const text = normalizeString(value);
  if (!text) return 0;

  const time = new Date(text).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function pickFirstString(item: UnknownRecord, keys: string[]): string {
  for (const key of keys) {
    const value = normalizeString(item[key]);
    if (value) return value;
  }

  return "";
}

function nowIso(): string {
  return new Date().toISOString();
}

function isOverdue(task: Task): boolean {
  if (!task.dueDate) return false;

  const dueTime = new Date(task.dueDate).getTime();
  if (Number.isNaN(dueTime)) return false;

  const status = normalizeString(task.status).toLowerCase();
  if (status === "completed" || status === "cancelled") return false;

  return dueTime < Date.now();
}

function isDueToday(task: Task): boolean {
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

function mapTask(raw: unknown): Task | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);

  if (!id) return null;

  const task: Task = {
    id,
    title: pickFirstString(item, ["title", "name"]) || "Untitled Task",
    description: pickFirstString(item, ["description", "notes"]) || undefined,
    status: pickFirstString(item, ["status"]) || "todo",
    priority: pickFirstString(item, ["priority"]) || "medium",
    assignedTo: pickFirstString(item, ["assignedTo", "owner"]) || undefined,
    assignedToId: pickFirstString(item, ["assignedToId"]) || undefined,
    relatedToType:
      pickFirstString(item, ["relatedToType", "entityType"]) || undefined,
    relatedToId: pickFirstString(item, ["relatedToId", "entityId"]) || undefined,
    relatedToName: pickFirstString(item, ["relatedToName"]) || undefined,
    dueDate: pickFirstString(item, ["dueDate"]) || undefined,
    completedAt: pickFirstString(item, ["completedAt"]) || undefined,
    createdAt: pickFirstString(item, ["createdAt"]) || undefined,
    updatedAt: pickFirstString(item, ["updatedAt"]) || undefined,
    createdBy: pickFirstString(item, ["createdBy"]) || undefined,
    tags: Array.isArray(item.tags)
      ? item.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    reminderAt: pickFirstString(item, ["reminderAt"]) || undefined,
  };

  if (normalizeString(task.status).toLowerCase() !== "completed" && isOverdue(task)) {
    task.status = "overdue";
  }

  return task;
}

function mapTaskActivity(raw: unknown): TaskActivity | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);
  const taskId = pickFirstString(item, ["taskId"]);

  if (!id || !taskId) return null;

  return {
    id,
    taskId,
    type: pickFirstString(item, ["type"]) || "note",
    title: pickFirstString(item, ["title", "name"]) || "Task Activity",
    description:
      pickFirstString(item, ["description", "note", "content"]) || undefined,
    createdAt:
      pickFirstString(item, ["createdAt", "updatedAt"]) || new Date().toISOString(),
    createdBy: pickFirstString(item, ["createdBy", "actor"]) || undefined,
    entityType: pickFirstString(item, ["entityType"]) || undefined,
    entityId: pickFirstString(item, ["entityId"]) || undefined,
  };
}

function matchesTaskFilters(task: Task, filters?: TaskFilters): boolean {
  if (!filters) return true;

  const search = normalizeString(filters.search).toLowerCase();

  if (search) {
    const haystack = [
      task.title,
      task.description,
      task.status,
      task.priority,
      task.assignedTo,
      task.relatedToType,
      task.relatedToName,
      ...(task.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(search)) {
      return false;
    }
  }

  if (filters.status && (task.status ?? "") !== filters.status) return false;
  if (filters.priority && (task.priority ?? "") !== filters.priority) return false;
  if (filters.assignedTo && (task.assignedTo ?? "") !== filters.assignedTo) {
    return false;
  }
  if (
    filters.relatedToType &&
    (task.relatedToType ?? "") !== filters.relatedToType
  ) {
    return false;
  }
  if (filters.overdueOnly && !isOverdue(task)) return false;
  if (filters.dueTodayOnly && !isDueToday(task)) return false;

  return true;
}

function createTaskActivityEntry(params: {
  taskId: string;
  type: TaskActivityType;
  title: string;
  description?: string;
  createdBy?: string;
  entityType?: string;
  entityId?: string;
  createdAt?: string;
}): TaskActivity {
  return {
    id: createId("task-activity"),
    taskId: params.taskId,
    type: params.type,
    title: params.title,
    description: params.description,
    createdAt: params.createdAt ?? nowIso(),
    createdBy: params.createdBy,
    entityType: params.entityType ?? "task",
    entityId: params.entityId ?? params.taskId,
  };
}

function getTasksFromLocal(filters?: TaskFilters): Task[] {
  return readStorageArray(STORAGE_KEYS.tasks)
    .map(mapTask)
    .filter((item): item is Task => Boolean(item))
    .filter((task) => matchesTaskFilters(task, filters))
    .sort(
      (a, b) =>
        toTimestamp(b.updatedAt ?? b.createdAt) -
        toTimestamp(a.updatedAt ?? a.createdAt)
    );
}

function getTaskActivitiesFromLocal(taskId: string): TaskActivity[] {
  return readStorageArray(STORAGE_KEYS.taskActivities)
    .map(mapTaskActivity)
    .filter((item): item is TaskActivity => Boolean(item))
    .filter((activity) => activity.taskId === taskId)
    .sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt));
}

function getRemoteBaseUrl(): string {
  if (
    typeof import.meta !== "undefined" &&
    (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env
      ?.VITE_API_BASE_URL
  ) {
    return (
      (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env
        ?.VITE_API_BASE_URL ?? ""
    );
  }

  return "";
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getRemoteBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

const tasksApi = {
  async getTasks(options?: {
    mode?: TasksApiMode;
    filters?: TaskFilters;
  }): Promise<TaskListResponse> {
    const mode = options?.mode ?? "auto";
    const filters = options?.filters;

    if (mode === "local") {
      const items = getTasksFromLocal(filters);
      return { items, total: items.length };
    }

    if (mode === "remote") {
      const params = new URLSearchParams();

      if (filters?.search) params.set("search", filters.search);
      if (filters?.status) params.set("status", filters.status);
      if (filters?.priority) params.set("priority", filters.priority);
      if (filters?.assignedTo) params.set("assignedTo", filters.assignedTo);
      if (filters?.relatedToType) {
        params.set("relatedToType", filters.relatedToType);
      }
      if (typeof filters?.overdueOnly === "boolean") {
        params.set("overdueOnly", String(filters.overdueOnly));
      }
      if (typeof filters?.dueTodayOnly === "boolean") {
        params.set("dueTodayOnly", String(filters.dueTodayOnly));
      }

      const query = params.toString();
      return fetchJson<TaskListResponse>(`/tasks${query ? `?${query}` : ""}`);
    }

    try {
      return await this.getTasks({ mode: "remote", filters });
    } catch {
      return this.getTasks({ mode: "local", filters });
    }
  },

  async getTaskById(
    taskId: string,
    options?: { mode?: TasksApiMode }
  ): Promise<Task | null> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      return getTasksFromLocal().find((task) => task.id === taskId) ?? null;
    }

    if (mode === "remote") {
      return fetchJson<Task>(`/tasks/${taskId}`);
    }

    try {
      return await this.getTaskById(taskId, { mode: "remote" });
    } catch {
      return this.getTaskById(taskId, { mode: "local" });
    }
  },

  async createTask(
    input: CreateTaskInput,
    options?: { mode?: TasksApiMode; createdBy?: string }
  ): Promise<Task> {
    const mode = options?.mode ?? "auto";
    const createdBy = options?.createdBy ?? input.createdBy;

    if (mode === "local") {
      const now = nowIso();

      const task: Task = {
        id: createId("task"),
        title: normalizeString(input.title) || "Untitled Task",
        description: normalizeString(input.description) || undefined,
        status: normalizeString(input.status) || "todo",
        priority: normalizeString(input.priority) || "medium",
        assignedTo: normalizeString(input.assignedTo) || undefined,
        assignedToId: normalizeString(input.assignedToId) || undefined,
        relatedToType: normalizeString(input.relatedToType) || undefined,
        relatedToId: normalizeString(input.relatedToId) || undefined,
        relatedToName: normalizeString(input.relatedToName) || undefined,
        dueDate: normalizeString(input.dueDate) || undefined,
        createdAt: now,
        updatedAt: now,
        createdBy: normalizeString(createdBy) || undefined,
        tags: input.tags?.filter(Boolean) ?? [],
        reminderAt: normalizeString(input.reminderAt) || undefined,
      };

      if (normalizeString(task.status).toLowerCase() !== "completed" && isOverdue(task)) {
        task.status = "overdue";
      }

      const tasks = getTasksFromLocal();
      writeStorageArray(STORAGE_KEYS.tasks, [task, ...tasks]);

      const activities = readStorageArray<TaskActivity>(STORAGE_KEYS.taskActivities);
      const createActivity = createTaskActivityEntry({
        taskId: task.id,
        type: "created",
        title: "Task created",
        description: `${task.title} was created.`,
        createdAt: now,
        createdBy,
      });

      writeStorageArray(STORAGE_KEYS.taskActivities, [createActivity, ...activities]);

      return task;
    }

    if (mode === "remote") {
      return fetchJson<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify(input),
      });
    }

    try {
      return await this.createTask(input, { mode: "remote", createdBy });
    } catch {
      return this.createTask(input, { mode: "local", createdBy });
    }
  },

  async updateTask(
    taskId: string,
    updates: UpdateTaskInput,
    options?: { mode?: TasksApiMode; updatedBy?: string }
  ): Promise<Task | null> {
    const mode = options?.mode ?? "auto";
    const updatedBy = options?.updatedBy;

    if (mode === "local") {
      const existingTasks = getTasksFromLocal();
      const taskIndex = existingTasks.findIndex((task) => task.id === taskId);

      if (taskIndex === -1) {
        return null;
      }

      const currentTask = existingTasks[taskIndex];
      const previousStatus = currentTask.status ?? "";

      const nextStatus =
        updates.status !== undefined
          ? normalizeString(updates.status) || undefined
          : currentTask.status;

      const updatedTask: Task = {
        ...currentTask,
        ...updates,
        title:
          updates.title !== undefined
            ? normalizeString(updates.title) || currentTask.title
            : currentTask.title,
        description:
          updates.description !== undefined
            ? normalizeString(updates.description) || undefined
            : currentTask.description,
        status: nextStatus,
        priority:
          updates.priority !== undefined
            ? normalizeString(updates.priority) || undefined
            : currentTask.priority,
        assignedTo:
          updates.assignedTo !== undefined
            ? normalizeString(updates.assignedTo) || undefined
            : currentTask.assignedTo,
        assignedToId:
          updates.assignedToId !== undefined
            ? normalizeString(updates.assignedToId) || undefined
            : currentTask.assignedToId,
        relatedToType:
          updates.relatedToType !== undefined
            ? normalizeString(updates.relatedToType) || undefined
            : currentTask.relatedToType,
        relatedToId:
          updates.relatedToId !== undefined
            ? normalizeString(updates.relatedToId) || undefined
            : currentTask.relatedToId,
        relatedToName:
          updates.relatedToName !== undefined
            ? normalizeString(updates.relatedToName) || undefined
            : currentTask.relatedToName,
        dueDate:
          updates.dueDate !== undefined
            ? normalizeString(updates.dueDate) || undefined
            : currentTask.dueDate,
        completedAt:
          updates.completedAt !== undefined
            ? normalizeString(updates.completedAt) || undefined
            : currentTask.completedAt,
        updatedAt: nowIso(),
        tags:
          updates.tags !== undefined ? updates.tags.filter(Boolean) : currentTask.tags,
        reminderAt:
          updates.reminderAt !== undefined
            ? normalizeString(updates.reminderAt) || undefined
            : currentTask.reminderAt,
      };

      if (
        normalizeString(updatedTask.status).toLowerCase() === "completed" &&
        !updatedTask.completedAt
      ) {
        updatedTask.completedAt = nowIso();
      }

      if (
        normalizeString(updatedTask.status).toLowerCase() !== "completed" &&
        isOverdue(updatedTask)
      ) {
        updatedTask.status = "overdue";
      }

      const nextTasks = [...existingTasks];
      nextTasks[taskIndex] = updatedTask;
      writeStorageArray(STORAGE_KEYS.tasks, nextTasks);

      const activityList = readStorageArray(STORAGE_KEYS.taskActivities)
        .map(mapTaskActivity)
        .filter((item): item is TaskActivity => Boolean(item));

      const nextActivities: TaskActivity[] = [
        createTaskActivityEntry({
          taskId,
          type: "updated",
          title: "Task updated",
          description: `${updatedTask.title} was updated.`,
          createdBy: updatedBy,
        }),
        ...activityList,
      ];

      const normalizedPrevious = normalizeString(previousStatus).toLowerCase();
      const normalizedNext = normalizeString(updatedTask.status).toLowerCase();

      if (
        previousStatus &&
        updatedTask.status &&
        normalizedPrevious !== normalizedNext
      ) {
        nextActivities.unshift(
          createTaskActivityEntry({
            taskId,
            type:
              normalizedNext === "completed" ? "completed" : "status_change",
            title:
              normalizedNext === "completed"
                ? "Task completed"
                : "Task status changed",
            description: `${previousStatus} → ${updatedTask.status}`,
            createdBy: updatedBy,
          })
        );
      }

      writeStorageArray(STORAGE_KEYS.taskActivities, nextActivities);

      return updatedTask;
    }

    if (mode === "remote") {
      return fetchJson<Task>(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    }

    try {
      return await this.updateTask(taskId, updates, {
        mode: "remote",
        updatedBy,
      });
    } catch {
      return this.updateTask(taskId, updates, {
        mode: "local",
        updatedBy,
      });
    }
  },

  async deleteTask(
    taskId: string,
    options?: { mode?: TasksApiMode }
  ): Promise<boolean> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const tasks = getTasksFromLocal();
      const nextTasks = tasks.filter((task) => task.id !== taskId);
      writeStorageArray(STORAGE_KEYS.tasks, nextTasks);

      const activities = readStorageArray(STORAGE_KEYS.taskActivities)
        .map(mapTaskActivity)
        .filter((item): item is TaskActivity => Boolean(item))
        .filter((activity) => activity.taskId !== taskId);

      writeStorageArray(STORAGE_KEYS.taskActivities, activities);
      return true;
    }

    if (mode === "remote") {
      await fetchJson<{ success?: boolean }>(`/tasks/${taskId}`, {
        method: "DELETE",
      });
      return true;
    }

    try {
      return await this.deleteTask(taskId, { mode: "remote" });
    } catch {
      return this.deleteTask(taskId, { mode: "local" });
    }
  },

  async completeTask(
    taskId: string,
    options?: { mode?: TasksApiMode; completedBy?: string }
  ): Promise<Task | null> {
    return this.updateTask(
      taskId,
      {
        status: "completed",
        completedAt: nowIso(),
      },
      {
        mode: options?.mode,
        updatedBy: options?.completedBy,
      }
    );
  },

  async getTaskActivities(
    taskId: string,
    options?: { mode?: TasksApiMode }
  ): Promise<TaskActivity[]> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      return getTaskActivitiesFromLocal(taskId);
    }

    if (mode === "remote") {
      return fetchJson<TaskActivity[]>(`/tasks/${taskId}/activities`);
    }

    try {
      return await this.getTaskActivities(taskId, { mode: "remote" });
    } catch {
      return this.getTaskActivities(taskId, { mode: "local" });
    }
  },

  async addTaskActivity(
    taskId: string,
    input: Omit<TaskActivity, "id" | "taskId" | "createdAt"> & {
      createdAt?: string;
    },
    options?: { mode?: TasksApiMode }
  ): Promise<TaskActivity> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const activity = createTaskActivityEntry({
        taskId,
        type: input.type,
        title: normalizeString(input.title) || "Task Activity",
        description: normalizeString(input.description) || undefined,
        createdAt: input.createdAt,
        createdBy: normalizeString(input.createdBy) || undefined,
        entityType: normalizeString(input.entityType) || "task",
        entityId: normalizeString(input.entityId) || taskId,
      });

      const activities = readStorageArray<TaskActivity>(STORAGE_KEYS.taskActivities);
      writeStorageArray(STORAGE_KEYS.taskActivities, [activity, ...activities]);

      return activity;
    }

    if (mode === "remote") {
      return fetchJson<TaskActivity>(`/tasks/${taskId}/activities`, {
        method: "POST",
        body: JSON.stringify(input),
      });
    }

    try {
      return await this.addTaskActivity(taskId, input, { mode: "remote" });
    } catch {
      return this.addTaskActivity(taskId, input, { mode: "local" });
    }
  },

  async getTaskStatusSummary(options?: {
    mode?: TasksApiMode;
    filters?: TaskFilters;
  }): Promise<TaskStatusSummary[]> {
    const mode = options?.mode ?? "auto";
    const filters = options?.filters;

    if (mode === "local") {
      const tasks = getTasksFromLocal(filters);
      const statusMap = new Map<string, number>();

      tasks.forEach((task) => {
        const status = task.status || "Unknown";
        statusMap.set(status, (statusMap.get(status) ?? 0) + 1);
      });

      return Array.from(statusMap.entries())
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count);
    }

    if (mode === "remote") {
      const params = new URLSearchParams();

      if (filters?.search) params.set("search", filters.search);
      if (filters?.status) params.set("status", filters.status);
      if (filters?.priority) params.set("priority", filters.priority);
      if (filters?.assignedTo) params.set("assignedTo", filters.assignedTo);
      if (filters?.relatedToType) {
        params.set("relatedToType", filters.relatedToType);
      }
      if (typeof filters?.overdueOnly === "boolean") {
        params.set("overdueOnly", String(filters.overdueOnly));
      }
      if (typeof filters?.dueTodayOnly === "boolean") {
        params.set("dueTodayOnly", String(filters.dueTodayOnly));
      }

      const query = params.toString();
      return fetchJson<TaskStatusSummary[]>(
        `/tasks/status-summary${query ? `?${query}` : ""}`
      );
    }

    try {
      return await this.getTaskStatusSummary({ mode: "remote", filters });
    } catch {
      return this.getTaskStatusSummary({ mode: "local", filters });
    }
  },

  async getTaskPrioritySummary(options?: {
    mode?: TasksApiMode;
    filters?: TaskFilters;
  }): Promise<TaskPrioritySummary[]> {
    const mode = options?.mode ?? "auto";
    const filters = options?.filters;

    if (mode === "local") {
      const tasks = getTasksFromLocal(filters);
      const priorityMap = new Map<string, number>();

      tasks.forEach((task) => {
        const priority = task.priority || "Unknown";
        priorityMap.set(priority, (priorityMap.get(priority) ?? 0) + 1);
      });

      return Array.from(priorityMap.entries())
        .map(([priority, count]) => ({ priority, count }))
        .sort((a, b) => b.count - a.count);
    }

    if (mode === "remote") {
      const params = new URLSearchParams();

      if (filters?.search) params.set("search", filters.search);
      if (filters?.status) params.set("status", filters.status);
      if (filters?.priority) params.set("priority", filters.priority);
      if (filters?.assignedTo) params.set("assignedTo", filters.assignedTo);
      if (filters?.relatedToType) {
        params.set("relatedToType", filters.relatedToType);
      }
      if (typeof filters?.overdueOnly === "boolean") {
        params.set("overdueOnly", String(filters.overdueOnly));
      }
      if (typeof filters?.dueTodayOnly === "boolean") {
        params.set("dueTodayOnly", String(filters.dueTodayOnly));
      }

      const query = params.toString();
      return fetchJson<TaskPrioritySummary[]>(
        `/tasks/priority-summary${query ? `?${query}` : ""}`
      );
    }

    try {
      return await this.getTaskPrioritySummary({ mode: "remote", filters });
    } catch {
      return this.getTaskPrioritySummary({ mode: "local", filters });
    }
  },

  async getDueTodayTasks(options?: {
    mode?: TasksApiMode;
    assignedTo?: string;
  }): Promise<Task[]> {
    const response = await this.getTasks({
      mode: options?.mode,
      filters: {
        assignedTo: options?.assignedTo,
        dueTodayOnly: true,
      },
    });

    return response.items;
  },

  async getOverdueTasks(options?: {
    mode?: TasksApiMode;
    assignedTo?: string;
  }): Promise<Task[]> {
    const response = await this.getTasks({
      mode: options?.mode,
      filters: {
        assignedTo: options?.assignedTo,
        overdueOnly: true,
      },
    });

    return response.items;
  },
};

export default tasksApi;