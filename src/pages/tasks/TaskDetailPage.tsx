import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type TaskDetailPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type TaskStatus = "Pending" | "In Progress" | "Completed";
type TaskPriority = "High" | "Medium" | "Low";
type TimelineTone = "info" | "success" | "warning" | "danger" | "primary";

type TaskTimelineItem = {
  title: string;
  description: string;
  time: string;
  tone?: TimelineTone;
};

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
  updatedAt?: string;
  timeline?: TaskTimelineItem[];
};

const TASK_STORAGE_KEYS = [
  "mei-crm-tasks",
  "mei_crm_tasks",
  "tasks",
  "crm_tasks",
];

const OWNER_OPTIONS = [
  "Balraj",
  "Madhan",
  "Arun",
  "Priya",
  "John Paul",
  "Sales Desk",
  "Unassigned",
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

  const timeline = Array.isArray(item.timeline)
    ? item.timeline.map((entry: any) => ({
        title: String(entry?.title || "Activity"),
        description: String(entry?.description || "Task activity recorded."),
        time: String(entry?.time || "Recent"),
        tone: entry?.tone as TimelineTone | undefined,
      }))
    : [];

  return {
    id: Number(item.id ?? Date.now() + index),
    title: String(item.title || item.name || `Task ${index + 1}`),
    priority: normalizePriority(item.priority),
    dueDate: String(item.dueDate || item.followUpDate || item.date || "-"),
    status: normalizeStatus(item.status),
    relatedTo: item.relatedTo ? String(item.relatedTo) : item.leadName ? String(item.leadName) : undefined,
    owner: item.owner ? String(item.owner) : undefined,
    notes: item.notes ? String(item.notes) : "No task notes added yet.",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    timeline,
  };
}

function getNowLabel() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function formatDateShort(value?: string) {
  if (!value || value === "-") return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function isOverdueDate(value?: string, status?: TaskStatus) {
  if (!value || value === "-") return false;
  if (status === "Completed") return false;

  const today = new Date().toISOString().slice(0, 10);
  return value.slice(0, 10) < today;
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

function getToneColor(
  tone: TimelineTone | undefined,
  colors: ReturnType<typeof getTheme>
) {
  switch (tone) {
    case "success":
      return colors.success;
    case "warning":
      return colors.warning;
    case "danger":
      return colors.danger;
    case "primary":
      return colors.primary;
    default:
      return colors.info;
  }
}

export default function TaskDetailPage({
  mode,
  onToggleTheme,
}: TaskDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const colors = getTheme(mode);

  const taskId = Number(id);

  const [allTasks, setAllTasks] = useState<Task[]>(() => readStoredTasks());
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [ownerInput, setOwnerInput] = useState("");
  const [dueDateInput, setDueDateInput] = useState("");

  useEffect(() => {
    const syncTasks = () => {
      setAllTasks(readStoredTasks());
    };

    window.addEventListener("storage", syncTasks);
    return () => window.removeEventListener("storage", syncTasks);
  }, []);

  const initialTask = useMemo(
    () => allTasks.find((item) => item.id === taskId) ?? null,
    [allTasks, taskId]
  );

  const [taskState, setTaskState] = useState<Task | null>(initialTask);
  const [formData, setFormData] = useState<Task | null>(initialTask);

  useEffect(() => {
    setTaskState(initialTask);
    setFormData(initialTask);
    setOwnerInput(initialTask?.owner || "");
    setDueDateInput(initialTask?.dueDate && initialTask.dueDate !== "-" ? initialTask.dueDate : "");
  }, [initialTask]);

  const currentIndex = useMemo(
    () => allTasks.findIndex((item) => item.id === taskId),
    [allTasks, taskId]
  );

  const previousTask = currentIndex > 0 ? allTasks[currentIndex - 1] : null;
  const nextTask =
    currentIndex >= 0 && currentIndex < allTasks.length - 1
      ? allTasks[currentIndex + 1]
      : null;

  const persistTaskUpdate = (updater: (task: Task) => Task) => {
    const latestTasks = readStoredTasks();
    const updatedTasks = latestTasks.map((task) =>
      task.id === taskId ? updater(task) : task
    );

    saveStoredTasks(updatedTasks);
    setAllTasks(updatedTasks);

    const updatedTask = updatedTasks.find((task) => task.id === taskId) ?? null;
    setTaskState(updatedTask);
    setFormData(updatedTask);
  };

  if (!taskState || !formData) {
    return (
      <AppLayout title="Task Detail" mode={mode} onToggleTheme={onToggleTheme}>
        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: colors.shadowSoft,
          }}
        >
          <h2 style={{ margin: 0, color: colors.text, fontSize: 28 }}>
            Task not found
          </h2>

          <p style={{ margin: "10px 0 0", color: colors.subText }}>
            The requested task does not exist or may have been removed.
          </p>

          <div style={{ marginTop: 20 }}>
            <Link
              to="/tasks"
              style={{
                display: "inline-block",
                textDecoration: "none",
                background: colors.primary,
                color: "#ffffff",
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 700,
              }}
            >
              Back to Tasks
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const task = taskState;
  const isOverdue = isOverdueDate(task.dueDate, task.status);

  const updateStatus = (nextStatus: TaskStatus) => {
    persistTaskUpdate((prev) => {
      const timelineItem: TaskTimelineItem = {
        title: "Status Updated",
        description: `Task status changed to ${nextStatus}.`,
        time: getNowLabel(),
        tone:
          nextStatus === "Completed"
            ? "success"
            : nextStatus === "In Progress"
            ? "primary"
            : "info",
      };

      return {
        ...prev,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });
  };

  const updatePriority = (nextPriority: TaskPriority) => {
    persistTaskUpdate((prev) => {
      const timelineItem: TaskTimelineItem = {
        title: "Priority Updated",
        description: `Task priority changed to ${nextPriority}.`,
        time: getNowLabel(),
        tone:
          nextPriority === "High"
            ? "danger"
            : nextPriority === "Medium"
            ? "warning"
            : "success",
      };

      return {
        ...prev,
        priority: nextPriority,
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });
  };

  const handleSaveOwner = () => {
    if (!ownerInput.trim()) return;

    persistTaskUpdate((prev) => {
      const timelineItem: TaskTimelineItem = {
        title: "Owner Reassigned",
        description: `Task owner changed to ${ownerInput.trim()}.`,
        time: getNowLabel(),
        tone: "primary",
      };

      return {
        ...prev,
        owner: ownerInput.trim(),
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });
  };

  const handleSaveDueDate = () => {
    if (!dueDateInput.trim()) return;

    persistTaskUpdate((prev) => {
      const timelineItem: TaskTimelineItem = {
        title: "Due Date Updated",
        description: `Task due date moved to ${dueDateInput}.`,
        time: getNowLabel(),
        tone: "warning",
      };

      return {
        ...prev,
        dueDate: dueDateInput,
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;

    persistTaskUpdate((prev) => {
      const existingNotes =
        prev.notes && prev.notes !== "No task notes added yet." ? prev.notes : "";

      const nextNotes = existingNotes
        ? `${noteInput.trim()}\n\n${existingNotes}`
        : noteInput.trim();

      const timelineItem: TaskTimelineItem = {
        title: "Note Added",
        description: noteInput.trim(),
        time: getNowLabel(),
        tone: "info",
      };

      return {
        ...prev,
        notes: nextNotes,
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });

    setNoteInput("");
  };

  const handleDeleteTask = () => {
    const confirmed = window.confirm(`Delete "${task.title}"?`);
    if (!confirmed) return;

    const latestTasks = readStoredTasks();
    const updatedTasks = latestTasks.filter((item) => item.id !== task.id);

    saveStoredTasks(updatedTasks);
    setAllTasks(updatedTasks);
    navigate("/tasks");
  };

  const saveTaskChanges = () => {
    if (!formData.title.trim() || !formData.dueDate.trim()) {
      alert("Title and due date fill பண்ணணும்.");
      return;
    }

    persistTaskUpdate((prev) => {
      const timelineItem: TaskTimelineItem = {
        title: "Task Updated",
        description: "Task information was edited from the detail page.",
        time: getNowLabel(),
        tone: "primary",
      };

      return {
        ...prev,
        ...formData,
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });

    setIsEditOpen(false);
  };

  return (
    <AppLayout title="Task Detail" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: colors.shadowSoft,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
              flexWrap: "wrap",
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
                Task Profile
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: 32,
                  color: colors.text,
                  fontWeight: 800,
                }}
              >
                {task.title}
              </h2>

              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.subText,
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                Track owner, deadline, work status, and follow-through notes.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {isOverdue && (
                <span
                  style={{
                    display: "inline-block",
                    background: colors.danger,
                    color: "#ffffff",
                    padding: "8px 14px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Overdue
                </span>
              )}

              <span
                style={{
                  display: "inline-block",
                  background: getPriorityColor(task.priority, mode),
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {task.priority} Priority
              </span>

              <span
                style={{
                  display: "inline-block",
                  background: getStatusColor(task.status, mode),
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {task.status}
              </span>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <MiniStatCard label="Status" value={task.status} colors={colors} />
          <MiniStatCard label="Priority" value={task.priority} colors={colors} />
          <MiniStatCard label="Due Date" value={formatDateShort(task.dueDate)} colors={colors} />
          <MiniStatCard
            label="Timeline Events"
            value={String((task.timeline || []).length)}
            colors={colors}
          />
        </section>

        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 20,
            boxShadow: colors.shadowSoft,
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: colors.text,
            }}
          >
            Quick Actions
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select
              value={task.status}
              onChange={(e) => updateStatus(e.target.value as TaskStatus)}
              style={inputStyle(colors)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={task.priority}
              onChange={(e) => updatePriority(e.target.value as TaskPriority)}
              style={inputStyle(colors)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <button
              onClick={() => {
                setFormData(task);
                setIsEditOpen(true);
              }}
              style={secondaryButton(colors)}
            >
              Edit Task
            </button>

            <button onClick={handleDeleteTask} style={dangerButton(colors)}>
              Delete
            </button>

            <Link to="/tasks" style={primaryLinkButton(colors)}>
              Back to Tasks
            </Link>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <DetailCard label="Task ID" value={String(task.id)} colors={colors} />
          <DetailCard label="Related To" value={task.relatedTo || "—"} colors={colors} />
          <DetailCard label="Owner" value={task.owner || "—"} colors={colors} />
          <DetailCard label="Due Date" value={formatDateShort(task.dueDate)} colors={colors} />
          <DetailCard label="Created" value={formatDateShort(task.createdAt)} colors={colors} />
          <DetailCard label="Updated" value={formatDateShort(task.updatedAt)} colors={colors} />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 1.1fr) minmax(320px, 0.9fr)",
            gap: 20,
          }}
        >
          <div style={{ display: "grid", gap: 20 }}>
            <InfoPanel title="Task Notes" colors={colors}>
              {task.notes || "No task notes added yet."}
            </InfoPanel>

            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: colors.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 14,
                }}
              >
                Add Quick Note
              </div>

              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                rows={4}
                placeholder="Add new task update or reminder..."
                style={{
                  ...inputStyle(colors),
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />

              <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handleAddNote} style={primaryButton(colors)}>
                  Add Note
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: colors.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 14,
                }}
              >
                Reassign Owner
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <select
                  value={ownerInput}
                  onChange={(e) => setOwnerInput(e.target.value)}
                  style={inputStyle(colors)}
                >
                  {OWNER_OPTIONS.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>

                <button onClick={handleSaveOwner} style={primaryButton(colors)}>
                  Save Owner
                </button>
              </div>
            </div>

            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: colors.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 14,
                }}
              >
                Reschedule Due Date
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <input
                  type="date"
                  value={dueDateInput}
                  onChange={(e) => setDueDateInput(e.target.value)}
                  style={inputStyle(colors)}
                />

                <button onClick={handleSaveDueDate} style={primaryButton(colors)}>
                  Save Due Date
                </button>
              </div>
            </div>

            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: colors.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 14,
                }}
              >
                Task Navigation
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <button
                  onClick={() => previousTask && navigate(`/tasks/${previousTask.id}`)}
                  disabled={!previousTask}
                  style={{
                    ...secondaryButton(colors),
                    opacity: previousTask ? 1 : 0.5,
                    cursor: previousTask ? "pointer" : "not-allowed",
                  }}
                >
                  ← Previous Task
                </button>

                <button
                  onClick={() => nextTask && navigate(`/tasks/${nextTask.id}`)}
                  disabled={!nextTask}
                  style={{
                    ...secondaryButton(colors),
                    opacity: nextTask ? 1 : 0.5,
                    cursor: nextTask ? "pointer" : "not-allowed",
                  }}
                >
                  Next Task →
                </button>
              </div>
            </div>

            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: colors.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 14,
                }}
              >
                Task Timeline
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {(task.timeline || []).length > 0 ? (
                  (task.timeline || []).map((item, index) => {
                    const dotColor = getToneColor(item.tone, colors);

                    return (
                      <div
                        key={index}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "14px 1fr",
                          gap: 12,
                          alignItems: "start",
                        }}
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            background: dotColor,
                            marginTop: 6,
                          }}
                        />

                        <div
                          style={{
                            background: colors.cardBgSoft,
                            border: `1px solid ${colors.border}`,
                            borderRadius: 14,
                            padding: 14,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            <div
                              style={{
                                color: colors.text,
                                fontSize: 15,
                                fontWeight: 700,
                              }}
                            >
                              {item.title}
                            </div>

                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 800,
                                background: dotColor,
                                color: "#ffffff",
                              }}
                            >
                              {(item.tone || "info").toUpperCase()}
                            </span>
                          </div>

                          <div
                            style={{
                              marginTop: 6,
                              color: colors.subText,
                              lineHeight: 1.6,
                              fontSize: 14,
                            }}
                          >
                            {item.description}
                          </div>

                          <div
                            style={{
                              marginTop: 8,
                              color: colors.mutedText,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {item.time}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      background: colors.cardBgSoft,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 14,
                      padding: 16,
                      color: colors.subText,
                      fontSize: 14,
                    }}
                  >
                    No timeline activity yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {isEditOpen && (
        <div
          onClick={() => setIsEditOpen(false)}
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
              maxWidth: 860,
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 24,
              boxSizing: "border-box",
              boxShadow: colors.shadowCard,
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <h3
                style={{
                  margin: 0,
                  color: colors.text,
                  fontSize: 26,
                }}
              >
                Edit Task
              </h3>
              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.subText,
                }}
              >
                Update task title, owner, due date, and notes.
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
                  setFormData((prev) => (prev ? { ...prev, title: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Related To"
                value={formData.relatedTo || ""}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, relatedTo: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Owner"
                value={formData.owner || ""}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, owner: value } : prev))
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
                  value={formData.dueDate === "-" ? "" : formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev ? { ...prev, dueDate: e.target.value || "-" } : prev
                    )
                  }
                  style={inputStyle(colors)}
                />
              </div>

              <SelectField
                label="Priority"
                value={formData.priority}
                onChange={(value) =>
                  setFormData((prev) =>
                    prev ? { ...prev, priority: value as TaskPriority } : prev
                  )
                }
                options={["High", "Medium", "Low"]}
                colors={colors}
              />

              <SelectField
                label="Status"
                value={formData.status}
                onChange={(value) =>
                  setFormData((prev) =>
                    prev ? { ...prev, status: value as TaskStatus } : prev
                  )
                }
                options={["Pending", "In Progress", "Completed"]}
                colors={colors}
              />
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 14 }}>
              <TextAreaField
                label="Notes"
                value={formData.notes || ""}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, notes: value } : prev))
                }
                colors={colors}
              />
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
                onClick={() => setIsEditOpen(false)}
                style={secondaryButton(colors)}
              >
                Cancel
              </button>

              <button onClick={saveTaskChanges} style={primaryButton(colors)}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function MiniStatCard({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        padding: 18,
        boxShadow: colors.shadowSoft,
      }}
    >
      <div
        style={{
          color: colors.subText,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 8,
          color: colors.text,
          fontSize: 24,
          fontWeight: 800,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function DetailCard({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        padding: 18,
        boxShadow: colors.shadowSoft,
      }}
    >
      <div
        style={{
          color: colors.subText,
          fontSize: 14,
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: 700,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoPanel({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 20,
        padding: 24,
        boxShadow: colors.shadowSoft,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: colors.text,
          marginBottom: 12,
        }}
      >
        {title}
      </div>

      <div
        style={{
          background: colors.cardBgSoft,
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          padding: 16,
          color: colors.text,
          lineHeight: 1.7,
          fontSize: 14,
          whiteSpace: "pre-wrap",
        }}
      >
        {children}
      </div>
    </div>
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
        style={inputStyle(colors)}
      />
    </div>
  );
}

function TextAreaField({
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

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        style={{
          ...inputStyle(colors),
          resize: "vertical",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  colors,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
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

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle(colors)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function inputStyle(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    background: colors.inputBg,
    color: colors.text,
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  };
}

function primaryButton(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    border: "none",
    background: colors.primary,
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}

function secondaryButton(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    border: `1px solid ${colors.border}`,
    background: colors.cardBg,
    color: colors.text,
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}

function dangerButton(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    border: "none",
    background: colors.danger,
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}

function primaryLinkButton(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    display: "inline-block",
    textDecoration: "none",
    background: colors.primary,
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
  };
}