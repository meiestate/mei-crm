// src/features/tasks/types/tasks.types.ts

export type TasksApiMode = "auto" | "local" | "remote";

export type TaskStatus =
  | "todo"
  | "in_progress"
  | "completed"
  | "overdue"
  | "cancelled"
  | string;

export type TaskPriority = "low" | "medium" | "high" | "urgent" | string;

export type TaskRelatedToType =
  | "lead"
  | "deal"
  | "contact"
  | "general"
  | string;

export type Task = {
  id: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  assignedToId?: string;
  relatedToType?: TaskRelatedToType;
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
  relatedToType?: TaskRelatedToType;
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

export type CompleteTaskInput = {
  taskId: string;
  completedBy?: string;
};

export type UseCompleteTaskOptions = {
  mode?: TasksApiMode;
  onSuccess?: (task: Task) => void;
};

export type UseCompleteTaskResult = {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  clearState: () => void;
  completeTask: (input: CompleteTaskInput) => Promise<Task | null>;
};

export type UseCreateTaskOptions = {
  mode?: TasksApiMode;
  onSuccess?: (task: Task) => void;
};

export type UseCreateTaskResult = {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  clearState: () => void;
  createTask: (
    input: CreateTaskInput,
    options?: { createdBy?: string }
  ) => Promise<Task | null>;
};

export type UseTaskDetailOptions = {
  mode?: TasksApiMode;
  autoLoad?: boolean;
};

export type UseTaskDetailResult = {
  taskId: string;
  task: Task | null;
  activities: TaskActivity[];
  loading: boolean;
  activityLoading: boolean;
  error: string | null;
  notFound: boolean;
  mode: TasksApiMode;
  refresh: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  updateTask: (
    updates: UpdateTaskInput,
    options?: { updatedBy?: string }
  ) => Promise<Task | null>;
  deleteTask: () => Promise<boolean>;
  completeTask: (options?: { completedBy?: string }) => Promise<Task | null>;
  addActivity: (
    input: Omit<TaskActivity, "id" | "taskId" | "createdAt"> & {
      createdAt?: string;
    }
  ) => Promise<TaskActivity | null>;
};

export type TaskStatusBadgeProps = {
  status?: TaskStatus | string;
  mode?: "light" | "dark";
  compact?: boolean;
};

export type TaskPriorityBadgeProps = {
  priority?: TaskPriority | string;
  mode?: "light" | "dark";
  compact?: boolean;
};

export type AddTaskInput = CreateTaskInput;

export type EditTaskInput = UpdateTaskInput;