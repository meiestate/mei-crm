import { useEffect, useMemo, useState } from "react";
import TaskPriorityBadge from "./TaskPriorityBadge";

export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";
export type TaskType =
  | "Call"
  | "Meeting"
  | "Follow-up"
  | "Site Visit"
  | "Documentation"
  | "Reminder"
  | "Personal"
  | "Other";

export type TaskRecord = {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  dueTime?: string;
  assignedTo: string;
  relatedTo?: string;
  relatedType?: "Lead" | "Contact" | "Deal" | "General";
  reminderEnabled?: boolean;
  reminderMinutes?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

type SortKey =
  | "title"
  | "type"
  | "priority"
  | "status"
  | "assignedTo"
  | "dueDate"
  | "createdAt";

type TasksTableProps = {
  tasks?: TaskRecord[];
  loading?: boolean;
  selectedTaskIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onRowClick?: (task: TaskRecord) => void;
  onAddTask?: () => void;
  onEditTask?: (task: TaskRecord) => void;
  onMarkComplete?: (task: TaskRecord) => void;
  onMarkInProgress?: (task: TaskRecord) => void;
  onDeleteTask?: (task: TaskRecord) => void;
};

const STORAGE_KEY = "mei-crm-tasks";

const DEFAULT_TASKS: TaskRecord[] = [
  {
    id: "task-1001",
    title: "Follow up with premium lead",
    description: "Call the lead, confirm budget, and schedule site visit.",
    type: "Follow-up",
    priority: "High",
    status: "Pending",
    dueDate: "2026-04-09",
    dueTime: "16:30",
    assignedTo: "Arjun Mehta",
    relatedTo: "Lead #1042",
    relatedType: "Lead",
    reminderEnabled: true,
    reminderMinutes: 30,
    notes: "Interested in 3BHK near Whitefield.",
    createdAt: "2026-04-08T09:10:00.000Z",
    updatedAt: "2026-04-08T09:10:00.000Z",
  },
  {
    id: "task-1002",
    title: "Coordinate site visit",
    description: "Align customer timing, broker, and project manager.",
    type: "Site Visit",
    priority: "Urgent",
    status: "In Progress",
    dueDate: "2026-04-09",
    dueTime: "18:00",
    assignedTo: "Priya Nair",
    relatedTo: "Deal Alpha",
    relatedType: "Deal",
    reminderEnabled: true,
    reminderMinutes: 60,
    createdAt: "2026-04-08T11:15:00.000Z",
    updatedAt: "2026-04-09T08:20:00.000Z",
  },
  {
    id: "task-1003",
    title: "Collect KYC documents",
    description: "Request PAN, Aadhaar, and address proof from buyer.",
    type: "Documentation",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-04-10",
    dueTime: "12:00",
    assignedTo: "Rahul Verma",
    relatedTo: "Contact Priya Sharma",
    relatedType: "Contact",
    reminderEnabled: true,
    reminderMinutes: 120,
    createdAt: "2026-04-07T15:45:00.000Z",
    updatedAt: "2026-04-08T10:00:00.000Z",
  },
  {
    id: "task-1004",
    title: "Sales review meeting",
    description: "Weekly performance review with the sales team.",
    type: "Meeting",
    priority: "Low",
    status: "Completed",
    dueDate: "2026-04-08",
    dueTime: "10:00",
    assignedTo: "Nisha Kapoor",
    relatedTo: "Weekly Ops",
    relatedType: "General",
    reminderEnabled: false,
    createdAt: "2026-04-06T08:00:00.000Z",
    updatedAt: "2026-04-08T10:30:00.000Z",
    completedAt: "2026-04-08T10:25:00.000Z",
  },
  {
    id: "task-1005",
    title: "Call inactive customer",
    description: "Reconnect and understand current interest level.",
    type: "Call",
    priority: "High",
    status: "Overdue",
    dueDate: "2026-04-07",
    dueTime: "17:00",
    assignedTo: "Karan Malhotra",
    relatedTo: "Lead #998",
    relatedType: "Lead",
    reminderEnabled: true,
    reminderMinutes: 15,
    createdAt: "2026-04-05T14:00:00.000Z",
    updatedAt: "2026-04-07T17:05:00.000Z",
  },
  {
    id: "task-1006",
    title: "Personal planning block",
    description: "Prepare next week action priorities and pipeline focus.",
    type: "Personal",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-04-11",
    dueTime: "09:00",
    assignedTo: "Arjun Mehta",
    relatedTo: "",
    relatedType: "General",
    reminderEnabled: false,
    createdAt: "2026-04-08T18:00:00.000Z",
    updatedAt: "2026-04-08T18:00:00.000Z",
  },
];

export default function TasksTable({
  tasks,
  loading = false,
  selectedTaskIds,
  onSelectionChange,
  onRowClick,
  onAddTask,
  onEditTask,
  onMarkComplete,
  onMarkInProgress,
  onDeleteTask,
}: TasksTableProps) {
  const [internalTasks, setInternalTasks] = useState<TaskRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      setInternalTasks(tasks);
      return;
    }

    const stored = readTasksFromStorage();
    if (stored.length > 0) {
      setInternalTasks(stored);
    } else {
      setInternalTasks(DEFAULT_TASKS);
      writeTasksToStorage(DEFAULT_TASKS);
    }
  }, [tasks]);

  useEffect(() => {
    if (selectedTaskIds) {
      setSelectedIds(selectedTaskIds);
    }
  }, [selectedTaskIds]);

  const sortedTasks = useMemo(() => {
    const next = [...internalTasks];

    next.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortKey === "title") {
        return a.title.localeCompare(b.title) * direction;
      }

      if (sortKey === "type") {
        return a.type.localeCompare(b.type) * direction;
      }

      if (sortKey === "status") {
        return a.status.localeCompare(b.status) * direction;
      }

      if (sortKey === "assignedTo") {
        return a.assignedTo.localeCompare(b.assignedTo) * direction;
      }

      if (sortKey === "priority") {
        return (
          (getPriorityWeight(a.priority) - getPriorityWeight(b.priority)) *
          direction
        );
      }

      const aValue = new Date(
        sortKey === "dueDate"
          ? `${a.dueDate}T${a.dueTime || "23:59"}`
          : a.createdAt
      ).getTime();

      const bValue = new Date(
        sortKey === "dueDate"
          ? `${b.dueDate}T${b.dueTime || "23:59"}`
          : b.createdAt
      ).getTime();

      return (aValue - bValue) * direction;
    });

    return next;
  }, [internalTasks, sortDirection, sortKey]);

  const stats = useMemo(() => {
    return {
      total: internalTasks.length,
      pending: internalTasks.filter((t) => t.status === "Pending").length,
      progress: internalTasks.filter((t) => t.status === "In Progress").length,
      completed: internalTasks.filter((t) => t.status === "Completed").length,
      overdue: internalTasks.filter((t) => t.status === "Overdue").length,
    };
  }, [internalTasks]);

  const allSelected =
    sortedTasks.length > 0 && selectedIds.length === sortedTasks.length;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection(
      key === "title" || key === "type" || key === "assignedTo" ? "asc" : "desc"
    );

    if (key === "dueDate") {
      setSortDirection("asc");
    }
  };

  const updateSelection = (ids: string[]) => {
    setSelectedIds(ids);
    onSelectionChange?.(ids);
  };

  const toggleSelectOne = (taskId: string) => {
    const exists = selectedIds.includes(taskId);
    const next = exists
      ? selectedIds.filter((id) => id !== taskId)
      : [...selectedIds, taskId];

    updateSelection(next);
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      updateSelection([]);
      return;
    }

    updateSelection(sortedTasks.map((task) => task.id));
  };

  const handleMarkCompleteFallback = (task: TaskRecord) => {
    const next = internalTasks.map((item) =>
      item.id === task.id
        ? {
            ...item,
            status: "Completed" as const,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : item
    );
    setInternalTasks(next);
    writeTasksToStorage(next);
  };

  const handleMarkInProgressFallback = (task: TaskRecord) => {
    const next = internalTasks.map((item) =>
      item.id === task.id
        ? {
            ...item,
            status: "In Progress" as const,
            updatedAt: new Date().toISOString(),
          }
        : item
    );
    setInternalTasks(next);
    writeTasksToStorage(next);
  };

  const handleDeleteFallback = (task: TaskRecord) => {
    const next = internalTasks.filter((item) => item.id !== task.id);
    setInternalTasks(next);
    writeTasksToStorage(next);
    updateSelection(selectedIds.filter((id) => id !== task.id));
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerCard}>
        <div style={styles.headerTop}>
          <div>
            <div style={styles.eyebrow}>Execution Control</div>
            <h2 style={styles.title}>Tasks Table</h2>
            <p style={styles.subtitle}>
              Track every follow-up, meeting, site visit, and documentation task
              with clarity, ownership, and time discipline.
            </p>
          </div>

          <button type="button" style={styles.primaryButton} onClick={onAddTask}>
            + Add Task
          </button>
        </div>

        <div style={styles.statsGrid}>
          <StatCard label="Total Tasks" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="In Progress" value={stats.progress} />
          <StatCard label="Completed" value={stats.completed} />
          <StatCard label="Overdue" value={stats.overdue} />
        </div>

        {selectedIds.length > 0 ? (
          <div style={styles.selectionBar}>
            <span style={styles.selectionText}>
              {selectedIds.length} task{selectedIds.length === 1 ? "" : "s"} selected
            </span>
            <button
              type="button"
              style={styles.clearSelectionButton}
              onClick={() => updateSelection([])}
            >
              Clear Selection
            </button>
          </div>
        ) : null}
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableScroll}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.checkboxTh}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    style={styles.checkbox}
                  />
                </th>

                <SortableTh
                  label="Task"
                  active={sortKey === "title"}
                  direction={sortDirection}
                  onClick={() => toggleSort("title")}
                  align="left"
                />

                <SortableTh
                  label="Type"
                  active={sortKey === "type"}
                  direction={sortDirection}
                  onClick={() => toggleSort("type")}
                  align="left"
                />

                <SortableTh
                  label="Priority"
                  active={sortKey === "priority"}
                  direction={sortDirection}
                  onClick={() => toggleSort("priority")}
                  align="left"
                />

                <SortableTh
                  label="Status"
                  active={sortKey === "status"}
                  direction={sortDirection}
                  onClick={() => toggleSort("status")}
                  align="left"
                />

                <SortableTh
                  label="Assigned To"
                  active={sortKey === "assignedTo"}
                  direction={sortDirection}
                  onClick={() => toggleSort("assignedTo")}
                  align="left"
                />

                <SortableTh
                  label="Due"
                  active={sortKey === "dueDate"}
                  direction={sortDirection}
                  onClick={() => toggleSort("dueDate")}
                  align="left"
                />

                <SortableTh
                  label="Created"
                  active={sortKey === "createdAt"}
                  direction={sortDirection}
                  onClick={() => toggleSort("createdAt")}
                  align="left"
                />

                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td style={styles.checkboxTd}>
                      <div style={styles.skeletonCheckbox} />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.skeletonBlockLarge} />
                      <div style={styles.skeletonBlockSmall} />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.skeletonPill} />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.skeletonPill} />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.skeletonPill} />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.skeletonBlockSmall} />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.skeletonBlockSmall} />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.skeletonBlockSmall} />
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={styles.skeletonNumber} />
                    </td>
                  </tr>
                ))
              ) : sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan={9} style={styles.emptyCell}>
                    No tasks found.
                  </td>
                </tr>
              ) : (
                sortedTasks.map((task) => {
                  const isSelected = selectedIds.includes(task.id);

                  return (
                    <tr
                      key={task.id}
                      style={{
                        ...styles.row,
                        ...(isSelected ? styles.rowSelected : {}),
                      }}
                    >
                      <td style={styles.checkboxTd}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(task.id)}
                          style={styles.checkbox}
                        />
                      </td>

                      <td style={styles.td} onClick={() => onRowClick?.(task)}>
                        <div style={styles.taskTitle}>{task.title}</div>
                        <div style={styles.taskDescription}>{task.description}</div>

                        {task.relatedTo ? (
                          <div style={styles.taskMeta}>
                            {task.relatedType || "General"} • {task.relatedTo}
                          </div>
                        ) : null}
                      </td>

                      <td style={styles.td} onClick={() => onRowClick?.(task)}>
                        <span style={styles.typeBadge}>{task.type}</span>
                      </td>

                      <td style={styles.td} onClick={() => onRowClick?.(task)}>
                        <TaskPriorityBadge priority={task.priority} size="md" />
                      </td>

                      <td style={styles.td} onClick={() => onRowClick?.(task)}>
                        <TaskStatusBadge status={task.status} />
                      </td>

                      <td style={styles.td} onClick={() => onRowClick?.(task)}>
                        <div style={styles.assigneeText}>{task.assignedTo}</div>
                        <div style={styles.subMeta}>
                          {task.reminderEnabled
                            ? `Reminder ${task.reminderMinutes || 0} min before`
                            : "No reminder"}
                        </div>
                      </td>

                      <td style={styles.td} onClick={() => onRowClick?.(task)}>
                        <div
                          style={{
                            ...styles.dateText,
                            ...(task.status === "Overdue" ? styles.overdueText : {}),
                          }}
                        >
                          {formatDueDate(task.dueDate, task.dueTime)}
                        </div>
                        <div style={styles.subMeta}>
                          {getDueState(task.dueDate, task.dueTime, task.status)}
                        </div>
                      </td>

                      <td style={styles.td} onClick={() => onRowClick?.(task)}>
                        <div style={styles.dateText}>{formatDate(task.createdAt)}</div>
                        <div style={styles.subMeta}>
                          Updated {formatDate(task.updatedAt)}
                        </div>
                      </td>

                      <td style={styles.tdCenter}>
                        <div style={styles.actionWrap}>
                          <button
                            type="button"
                            style={styles.iconButton}
                            onClick={() =>
                              setMenuOpenId((prev) =>
                                prev === task.id ? null : task.id
                              )
                            }
                          >
                            ⋯
                          </button>

                          {menuOpenId === task.id ? (
                            <div style={styles.menu}>
                              <button
                                type="button"
                                style={styles.menuItem}
                                onClick={() => {
                                  setMenuOpenId(null);
                                  onEditTask?.(task);
                                }}
                              >
                                Edit Task
                              </button>

                              {task.status !== "Completed" ? (
                                <button
                                  type="button"
                                  style={styles.menuItem}
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    if (onMarkComplete) {
                                      onMarkComplete(task);
                                    } else {
                                      handleMarkCompleteFallback(task);
                                    }
                                  }}
                                >
                                  Mark Complete
                                </button>
                              ) : null}

                              {task.status !== "In Progress" &&
                              task.status !== "Completed" ? (
                                <button
                                  type="button"
                                  style={styles.menuItem}
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    if (onMarkInProgress) {
                                      onMarkInProgress(task);
                                    } else {
                                      handleMarkInProgressFallback(task);
                                    }
                                  }}
                                >
                                  Mark In Progress
                                </button>
                              ) : null}

                              <button
                                type="button"
                                style={{ ...styles.menuItem, ...styles.menuItemDanger }}
                                onClick={() => {
                                  setMenuOpenId(null);
                                  if (onDeleteTask) {
                                    onDeleteTask(task);
                                  } else {
                                    handleDeleteFallback(task);
                                  }
                                }}
                              >
                                Delete Task
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

function SortableTh({
  label,
  active,
  direction,
  onClick,
  align = "center",
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
  align?: "left" | "center" | "right";
}) {
  return (
    <th
      style={{
        ...styles.th,
        textAlign: align,
      }}
    >
      <button type="button" onClick={onClick} style={styles.sortButton}>
        <span>{label}</span>
        <span style={styles.sortArrow}>
          {active ? (direction === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </button>
    </th>
  );
}

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const styleMap: Record<TaskStatus, React.CSSProperties> = {
    Pending: {
      background: "#FFFBEB",
      color: "#B45309",
      border: "1px solid #FDE68A",
    },
    "In Progress": {
      background: "#EFF6FF",
      color: "#1D4ED8",
      border: "1px solid #BFDBFE",
    },
    Completed: {
      background: "#ECFDF5",
      color: "#047857",
      border: "1px solid #A7F3D0",
    },
    Overdue: {
      background: "#FFF1F2",
      color: "#BE123C",
      border: "1px solid #FECDD3",
    },
  };

  return (
    <span style={{ ...styles.statusBadge, ...styleMap[status] }}>{status}</span>
  );
}

function getPriorityWeight(priority: TaskPriority) {
  const map: Record<TaskPriority, number> = {
    Low: 1,
    Medium: 2,
    High: 3,
    Urgent: 4,
  };

  return map[priority];
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatDueDate(dueDate: string, dueTime?: string) {
  try {
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dueDate));

    return dueTime ? `${formattedDate} • ${dueTime}` : formattedDate;
  } catch {
    return dueTime ? `${dueDate} ${dueTime}` : dueDate;
  }
}

function getDueState(dueDate: string, dueTime: string | undefined, status: TaskStatus) {
  if (status === "Completed") return "Completed";
  if (status === "Overdue") return "Needs immediate action";

  const due = new Date(`${dueDate}T${dueTime || "23:59"}`).getTime();
  const now = Date.now();
  const diff = due - now;

  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (diff < 0) return "Past due";
  if (mins < 60) return `Due in ${mins} min`;
  if (hours < 24) return `Due in ${hours} hr`;
  if (days <= 7) return `Due in ${days} day${days === 1 ? "" : "s"}`;
  return "Upcoming";
}

function readTasksFromStorage(): TaskRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeTasksToStorage(tasks: TaskRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // ignore
  }
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  headerCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#64748B",
    marginBottom: 8,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#0F172A",
  },
  subtitle: {
    margin: "8px 0 0",
    maxWidth: 760,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#475569",
  },
  primaryButton: {
    height: 46,
    borderRadius: 12,
    border: "none",
    padding: "0 18px",
    background: "#0F172A",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    borderRadius: 18,
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    padding: "14px 16px",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#64748B",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 800,
    color: "#0F172A",
  },
  selectionBar: {
    marginTop: 8,
    padding: "12px 14px",
    borderRadius: 14,
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  selectionText: {
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
  },
  clearSelectionButton: {
    border: "none",
    background: "transparent",
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  tableCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
  },
  tableScroll: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: 1250,
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  th: {
    background: "#F8FAFC",
    color: "#334155",
    fontSize: 13,
    fontWeight: 800,
    padding: "16px 14px",
    borderBottom: "1px solid #E2E8F0",
    whiteSpace: "nowrap",
  },
  checkboxTh: {
    background: "#F8FAFC",
    padding: "16px 14px",
    borderBottom: "1px solid #E2E8F0",
    width: 54,
    textAlign: "center",
  },
  sortButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    fontWeight: 800,
    color: "#334155",
    cursor: "pointer",
  },
  sortArrow: {
    fontSize: 12,
    color: "#64748B",
  },
  row: {
    background: "#FFFFFF",
  },
  rowSelected: {
    background: "#F8FAFC",
  },
  td: {
    padding: "16px 14px",
    borderBottom: "1px solid #EEF2F7",
    verticalAlign: "middle",
    cursor: "pointer",
  },
  tdCenter: {
    padding: "16px 14px",
    borderBottom: "1px solid #EEF2F7",
    verticalAlign: "middle",
    textAlign: "center",
    position: "relative",
  },
  checkboxTd: {
    padding: "16px 14px",
    borderBottom: "1px solid #EEF2F7",
    verticalAlign: "middle",
    textAlign: "center",
  },
  checkbox: {
    width: 16,
    height: 16,
    cursor: "pointer",
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: 6,
  },
  taskDescription: {
    fontSize: 13,
    lineHeight: 1.55,
    color: "#475569",
    maxWidth: 360,
  },
  taskMeta: {
    marginTop: 8,
    fontSize: 12,
    color: "#64748B",
    fontWeight: 700,
  },
  typeBadge: {
    display: "inline-flex",
    alignItems: "center",
    height: 30,
    padding: "0 12px",
    borderRadius: 999,
    background: "#F8FAFC",
    color: "#0F172A",
    border: "1px solid #CBD5E1",
    fontSize: 12,
    fontWeight: 800,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 96,
    height: 30,
    padding: "0 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  assigneeText: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0F172A",
  },
  dateText: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0F172A",
  },
  overdueText: {
    color: "#BE123C",
  },
  subMeta: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },
  actionWrap: {
    position: "relative",
    display: "inline-flex",
    justifyContent: "center",
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    color: "#334155",
    fontSize: 18,
    cursor: "pointer",
  },
  menu: {
    position: "absolute",
    top: 44,
    right: 0,
    minWidth: 180,
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 16,
    boxShadow: "0 18px 34px rgba(15, 23, 42, 0.12)",
    overflow: "hidden",
    zIndex: 10,
  },
  menuItem: {
    width: "100%",
    border: "none",
    background: "#FFFFFF",
    padding: "12px 14px",
    textAlign: "left",
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
    cursor: "pointer",
  },
  menuItemDanger: {
    color: "#DC2626",
  },
  emptyCell: {
    padding: 28,
    textAlign: "center",
    fontSize: 14,
    fontWeight: 700,
    color: "#64748B",
  },
  skeletonCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    background: "#E2E8F0",
    margin: "0 auto",
  },
  skeletonBlockLarge: {
    width: 220,
    maxWidth: "100%",
    height: 16,
    borderRadius: 8,
    background: "#E2E8F0",
    marginBottom: 10,
  },
  skeletonBlockSmall: {
    width: 120,
    maxWidth: "100%",
    height: 12,
    borderRadius: 8,
    background: "#E2E8F0",
  },
  skeletonPill: {
    width: 84,
    height: 28,
    borderRadius: 999,
    background: "#E2E8F0",
  },
  skeletonNumber: {
    width: 38,
    height: 14,
    borderRadius: 8,
    background: "#E2E8F0",
    margin: "0 auto",
  },
};