import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type TasksPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type TaskStatus = "Pending" | "In Progress" | "Completed";
type TaskPriority = "High" | "Medium" | "Low";
type TaskFilter =
  | "All"
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Overdue"
  | "Today";

type Task = {
  id: number;
  title: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  relatedTo?: string;
  owner?: string;
  notes?: string;
  createdAt?: string;
};

const TASK_STORAGE_KEYS = [
  "mei-crm-tasks",
  "mei_crm_tasks",
  "tasks",
  "crm_tasks",
];

const fallbackTasks: Task[] = [
  {
    id: 1,
    title: "Call Arun Kumar",
    priority: "High",
    dueDate: "2026-04-03",
    status: "Pending",
    relatedTo: "Arun Kumar",
    owner: "Balraj",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Send project brochure",
    priority: "Medium",
    dueDate: "2026-04-04",
    status: "In Progress",
    relatedTo: "Priya Ventures",
    owner: "Balraj",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Follow up with Priya",
    priority: "High",
    dueDate: "2026-04-05",
    status: "Pending",
    relatedTo: "Priya",
    owner: "Arun",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Close deal documentation",
    priority: "Low",
    dueDate: "2026-04-06",
    status: "Completed",
    relatedTo: "Meena Corp",
    owner: "Priya",
    createdAt: new Date().toISOString(),
  },
];

function normalizeStatus(value: string | undefined): TaskStatus {
  const normalized = String(value || "Pending").toLowerCase();

  if (normalized.includes("progress")) return "In Progress";
  if (normalized.includes("complete") || normalized.includes("done")) {
    return "Completed";
  }
  return "Pending";
}

function normalizePriority(value: string | undefined): TaskPriority {
  const normalized = String(value || "Medium").toLowerCase();

  if (normalized === "high") return "High";
  if (normalized === "low") return "Low";
  return "Medium";
}

function normalizeFilter(value: string | null): TaskFilter {
  if (!value) return "All";

  const normalized = value.trim().toLowerCase();

  if (normalized === "pending") return "Pending";
  if (normalized === "in-progress" || normalized === "in progress") {
    return "In Progress";
  }
  if (normalized === "completed") return "Completed";
  if (normalized === "overdue") return "Overdue";
  if (normalized === "today") return "Today";

  return "All";
}

function readStoredTasks(): Task[] {
  for (const key of TASK_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) continue;

      const mapped = parsed
        .map((item: any, index: number) => mapUnknownTask(item, index))
        .filter(Boolean) as Task[];

      if (mapped.length > 0) {
        return mapped;
      }
    } catch (error) {
      console.error(`Failed to parse task localStorage key: ${key}`, error);
    }
  }

  return [];
}

function saveStoredTasks(tasks: Task[]) {
  try {
    localStorage.setItem("mei-crm-tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to localStorage:", error);
  }
}

function mapUnknownTask(item: any, index: number): Task | null {
  if (!item || typeof item !== "object") return null;

  return {
    id: Number(item.id ?? Date.now() + index),
    title: String(item.title || item.name || `Task ${index + 1}`),
    priority: normalizePriority(item.priority),
    dueDate: String(item.dueDate || item.followUpDate || item.date || "-"),
    status: normalizeStatus(item.status),
    relatedTo: item.relatedTo
      ? String(item.relatedTo)
      : item.leadName
      ? String(item.leadName)
      : undefined,
    owner: item.owner ? String(item.owner) : undefined,
    notes: item.notes ? String(item.notes) : undefined,
    createdAt: item.createdAt,
  };
}

function getPriorityColor(priority: TaskPriority, mode: ThemeMode) {
  const colors = getTheme(mode);

  switch (priority) {
    case "High":
      return colors.danger;
    case "Medium":
      return colors.warning;
    case "Low":
      return colors.success;
    default:
      return colors.subText;
  }
}

function getStatusColor(status: TaskStatus, mode: ThemeMode) {
  const colors = getTheme(mode);

  switch (status) {
    case "Pending":
      return colors.info;
    case "In Progress":
      return colors.premium;
    case "Completed":
      return colors.success;
    default:
      return colors.subText;
  }
}

function isTodayDate(value?: string) {
  if (!value || value === "-") return false;
  const today = new Date().toISOString().slice(0, 10);
  return value.slice(0, 10) === today;
}

function isOverdueDate(value?: string, status?: TaskStatus) {
  if (!value || value === "-") return false;
  if (status === "Completed") return false;
  const today = new Date().toISOString().slice(0, 10);
  return value.slice(0, 10) < today;
}

export default function TasksPage({ mode, onToggleTheme }: TasksPageProps) {
  const colors = getTheme(mode);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = readStoredTasks();
    return stored.length > 0 ? stored : fallbackTasks;
  });

  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || ""
  );
  const [activeFilter, setActiveFilter] = useState<TaskFilter>(() =>
    normalizeFilter(searchParams.get("filter"))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    priority: "Medium" as TaskPriority,
    dueDate: "",
    status: "Pending" as TaskStatus,
    relatedTo: "",
    owner: "",
  });

  useEffect(() => {
    const syncTasks = () => {
      const stored = readStoredTasks();
      if (stored.length > 0) {
        setTasks(stored);
      }
    };

    window.addEventListener("storage", syncTasks);
    return () => window.removeEventListener("storage", syncTasks);
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      saveStoredTasks(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    const queryFilter = normalizeFilter(searchParams.get("filter"));
    const querySearch = searchParams.get("search") || "";

    setActiveFilter(queryFilter);
    setSearchTerm(querySearch);
  }, [searchParams]);

  useEffect(() => {
    const nextParams = new URLSearchParams();

    if (activeFilter !== "All") {
      const filterValue =
        activeFilter === "In Progress"
          ? "in-progress"
          : activeFilter.toLowerCase();
      nextParams.set("filter", filterValue);
    }

    if (searchTerm.trim()) {
      nextParams.set("search", searchTerm.trim());
    }

    setSearchParams(nextParams, { replace: true });
  }, [activeFilter, searchTerm, setSearchParams]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      let matchesFilter = true;

      if (activeFilter === "Pending") matchesFilter = task.status === "Pending";
      if (activeFilter === "In Progress") {
        matchesFilter = task.status === "In Progress";
      }
      if (activeFilter === "Completed") {
        matchesFilter = task.status === "Completed";
      }
      if (activeFilter === "Overdue") {
        matchesFilter = isOverdueDate(task.dueDate, task.status);
      }
      if (activeFilter === "Today") {
        matchesFilter = isTodayDate(task.dueDate);
      }

      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        task.title.toLowerCase().includes(q) ||
        task.priority.toLowerCase().includes(q) ||
        task.status.toLowerCase().includes(q) ||
        String(task.relatedTo || "").toLowerCase().includes(q) ||
        String(task.owner || "").toLowerCase().includes(q) ||
        String(task.id).toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [tasks, activeFilter, searchTerm]);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const overdueTasks = tasks.filter((t) =>
    isOverdueDate(t.dueDate, t.status)
  ).length;
  const todayTasks = tasks.filter((t) => isTodayDate(t.dueDate)).length;

  const handleAddTask = () => {
    if (!formData.title.trim() || !formData.dueDate.trim()) {
      alert("Title and due date fill பண்ணணும்.");
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: formData.title.trim(),
      priority: formData.priority,
      dueDate: formData.dueDate,
      status: formData.status,
      relatedTo: formData.relatedTo.trim() || undefined,
      owner: formData.owner.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setFormData({
      title: "",
      priority: "Medium",
      dueDate: "",
      status: "Pending",
      relatedTo: "",
      owner: "",
    });
    setIsModalOpen(false);
    setActiveFilter("All");
    setSearchTerm("");
  };

  return (
    <AppLayout title="Tasks" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: colors.shadowSoft,
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                background: colors.cardBgSoft,
                color: colors.subText,
                border: `1px solid ${colors.border}`,
                marginBottom: 14,
              }}
            >
              MEI CRM Tasks
            </div>

            <h2 style={{ margin: 0, fontSize: 30, color: colors.text }}>
              Task Management
            </h2>
            <p style={{ margin: "8px 0 0", color: colors.subText }}>
              Track pending, in-progress, completed, today, and overdue work items.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              border: "none",
              background: colors.primary,
              color: "#ffffff",
              padding: "12px 18px",
              borderRadius: 12,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: colors.shadowSoft,
            }}
          >
            + Add Task
          </button>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {[
            { label: "Total Tasks", value: totalTasks, filter: "All" as TaskFilter },
            { label: "Pending", value: pendingTasks, filter: "Pending" as TaskFilter },
            { label: "In Progress", value: inProgressTasks, filter: "In Progress" as TaskFilter },
            { label: "Completed", value: completedTasks, filter: "Completed" as TaskFilter },
            { label: "Today", value: todayTasks, filter: "Today" as TaskFilter },
            { label: "Overdue", value: overdueTasks, filter: "Overdue" as TaskFilter },
          ].map((item) => {
            const active = activeFilter === item.filter;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveFilter(item.filter)}
                style={{
                  background: active ? colors.primary : colors.cardBg,
                  border: `1px solid ${active ? colors.primary : colors.border}`,
                  borderRadius: 18,
                  padding: 20,
                  boxShadow: colors.shadowSoft,
                  cursor: "pointer",
                  textAlign: "left",
                  color: active ? "#ffffff" : colors.text,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: active ? "rgba(255,255,255,0.82)" : colors.subText,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 32,
                    fontWeight: 800,
                    color: active ? "#ffffff" : colors.text,
                  }}
                >
                  {item.value}
                </div>
              </button>
            );
          })}
        </section>

        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 18,
            padding: 20,
            boxShadow: colors.shadowSoft,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 1fr) auto",
              gap: 12,
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search task, owner, related lead, status..."
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                background: colors.inputBg,
                color: colors.text,
                outline: "none",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={() => {
                setActiveFilter("All");
                setSearchTerm("");
              }}
              style={{
                border: `1px solid ${colors.border}`,
                background: "transparent",
                color: colors.subText,
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {(
              ["All", "Pending", "In Progress", "Completed", "Today", "Overdue"] as TaskFilter[]
            ).map((item) => {
              const active = activeFilter === item;

              return (
                <button
                  key={item}
                  onClick={() => setActiveFilter(item)}
                  style={{
                    border: `1px solid ${active ? colors.primary : colors.border}`,
                    background: active ? colors.primary : colors.cardBgSoft,
                    color: active ? "#ffffff" : colors.text,
                    padding: "10px 14px",
                    borderRadius: 999,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: colors.shadowSoft,
          }}
        >
          <div style={{ padding: 20, borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.text }}>
              Tasks Table
            </div>
            <div style={{ fontSize: 14, color: colors.subText, marginTop: 4 }}>
              Showing {filteredTasks.length} task record(s).
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 960 }}>
              <thead>
                <tr style={{ background: colors.tableHeadBg, textAlign: "left" }}>
                  <th style={thStyle(colors.subText)}>ID</th>
                  <th style={thStyle(colors.subText)}>Task</th>
                  <th style={thStyle(colors.subText)}>Related To</th>
                  <th style={thStyle(colors.subText)}>Owner</th>
                  <th style={thStyle(colors.subText)}>Priority</th>
                  <th style={thStyle(colors.subText)}>Due Date</th>
                  <th style={thStyle(colors.subText)}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => {
                    const overdue = isOverdueDate(task.dueDate, task.status);
                    const isHovered = hoveredRowId === task.id;

                    return (
                      <tr
                        key={task.id}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        onMouseEnter={() => setHoveredRowId(task.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        style={{
                          borderTop: `1px solid ${colors.border}`,
                          background: overdue
                            ? mode === "dark"
                              ? "rgba(239,68,68,0.08)"
                              : "rgba(239,68,68,0.05)"
                            : isHovered
                            ? colors.rowHover
                            : colors.rowBg,
                          cursor: "pointer",
                          transition: "background 0.2s ease",
                        }}
                        title={`Open ${task.title} details`}
                      >
                        <td style={tdStyle(colors.text)}>{task.id}</td>

                        <td style={tdStyle(colors.text)}>
                          <div style={{ fontWeight: 700 }}>{task.title}</div>
                          <div
                            style={{
                              marginTop: 4,
                              fontSize: 12,
                              color: isHovered ? colors.primary : colors.subText,
                              fontWeight: 700,
                            }}
                          >
                            View Task →
                          </div>
                          {task.notes ? (
                            <div
                              style={{
                                marginTop: 4,
                                fontSize: 12,
                                color: colors.subText,
                              }}
                            >
                              {task.notes}
                            </div>
                          ) : null}
                        </td>

                        <td style={tdStyle(colors.text)}>{task.relatedTo || "—"}</td>
                        <td style={tdStyle(colors.text)}>{task.owner || "—"}</td>

                        <td style={tdStyle(colors.text)}>
                          <span
                            style={{
                              display: "inline-block",
                              background: getPriorityColor(task.priority, mode),
                              color: "#ffffff",
                              padding: "6px 12px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {task.priority}
                          </span>
                        </td>

                        <td style={tdStyle(colors.text)}>
                          <div>{task.dueDate}</div>
                          {overdue ? (
                            <div
                              style={{
                                marginTop: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                color: colors.danger,
                              }}
                            >
                              Overdue
                            </div>
                          ) : null}
                        </td>

                        <td style={tdStyle(colors.text)}>
                          <span
                            style={{
                              display: "inline-block",
                              background: getStatusColor(task.status, mode),
                              color: "#ffffff",
                              padding: "6px 12px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: 24,
                        color: colors.subText,
                        textAlign: "center",
                        background: colors.rowBg,
                      }}
                    >
                      No tasks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "grid",
            placeItems: "center",
            padding: 16,
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 700,
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 24,
              boxSizing: "border-box",
              boxShadow: colors.shadowCard,
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ margin: 0, color: colors.text, fontSize: 26 }}>
                Add New Task
              </h3>
              <p style={{ margin: "8px 0 0", color: colors.subText }}>
                Fill the details and create a new task.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              <InputField
                label="Task Title"
                value={formData.title}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, title: value }))
                }
                colors={colors}
              />

              <InputField
                label="Related To"
                value={formData.relatedTo}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, relatedTo: value }))
                }
                colors={colors}
              />

              <InputField
                label="Owner"
                value={formData.owner}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, owner: value }))
                }
                colors={colors}
              />

              <div style={{ display: "grid", gap: 8 }}>
                <label
                  style={{
                    color: colors.subText,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Due Date
                </label>

                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg,
                    color: colors.text,
                    outline: "none",
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <label
                  style={{
                    color: colors.subText,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Priority
                </label>

                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: e.target.value as TaskPriority,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg,
                    color: colors.text,
                    outline: "none",
                    fontSize: 14,
                  }}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <label
                  style={{
                    color: colors.subText,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Status
                </label>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as TaskStatus,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg,
                    color: colors.text,
                    outline: "none",
                    fontSize: 14,
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div
              style={{
                marginTop: 22,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  border: `1px solid ${colors.border}`,
                  background: "transparent",
                  color: colors.text,
                  padding: "12px 16px",
                  borderRadius: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleAddTask}
                style={{
                  border: "none",
                  background: colors.primary,
                  color: "#ffffff",
                  padding: "12px 16px",
                  borderRadius: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function InputField({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label
        style={{
          color: colors.subText,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          background: colors.inputBg,
          color: colors.text,
          outline: "none",
          fontSize: 14,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function thStyle(color: string): React.CSSProperties {
  return {
    padding: 14,
    fontSize: 13,
    color,
    fontWeight: 700,
  };
}

function tdStyle(color: string): React.CSSProperties {
  return {
    padding: 14,
    fontSize: 15,
    color,
  };
}