import React, { useEffect, useMemo, useState } from "react";

export type LeadTaskPriority = "Low" | "Medium" | "High";
export type LeadTaskStatus = "Pending" | "Completed";

export type LeadTaskItem = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: LeadTaskPriority;
  status: LeadTaskStatus;
  createdAt: string;
  updatedAt: string;
};

type LeadTasksCardProps = {
  leadId: string;
  title?: string;
  initialTasks?: LeadTaskItem[];
  storageKey?: string;
  onTasksChange?: (tasks: LeadTaskItem[]) => void;
};

const DEFAULT_STORAGE_KEY = "mei-crm-lead-tasks";

export default function LeadTasksCard({
  leadId,
  title = "Lead Tasks",
  initialTasks = [],
  storageKey = DEFAULT_STORAGE_KEY,
  onTasksChange,
}: LeadTasksCardProps) {
  const [tasks, setTasks] = useState<LeadTaskItem[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState<LeadTaskPriority>("Medium");

  const storageId = useMemo(
    () => `${storageKey}-${leadId}`,
    [storageKey, leadId]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageId);
      if (raw) {
        const parsed = JSON.parse(raw) as LeadTaskItem[];
        setTasks(sortTasks(parsed));
        return;
      }
    } catch (error) {
      console.error("Failed to read lead tasks:", error);
    }

    setTasks(sortTasks(initialTasks));
  }, [storageId, initialTasks]);

  useEffect(() => {
    try {
      localStorage.setItem(storageId, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save lead tasks:", error);
    }

    onTasksChange?.(tasks);
  }, [tasks, storageId, onTasksChange]);

  const pendingCount = tasks.filter((task) => task.status === "Pending").length;
  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const overdueCount = tasks.filter(
    (task) => task.status === "Pending" && isOverdue(task.dueDate)
  ).length;

  const addTask = () => {
    const trimmedTitle = taskTitle.trim();
    const trimmedDescription = taskDescription.trim();

    if (!trimmedTitle) return;

    const now = new Date().toISOString();

    const newTask: LeadTaskItem = {
      id: `task-${Date.now()}`,
      title: trimmedTitle,
      description: trimmedDescription,
      dueDate: taskDueDate || "",
      priority: taskPriority,
      status: "Pending",
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => sortTasks([newTask, ...prev]));
    setTaskTitle("");
    setTaskDescription("");
    setTaskDueDate("");
    setTaskPriority("Medium");
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      sortTasks(
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: task.status === "Completed" ? "Pending" : "Completed",
                updatedAt: new Date().toISOString(),
              }
            : task
        )
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 22,
        padding: 20,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            Keep the next move crystal clear for this lead and never let follow-up energy fade.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <StatBadge label="Pending" value={String(pendingCount)} />
          <StatBadge label="Done" value={String(completedCount)} />
          <StatBadge label="Overdue" value={String(overdueCount)} tone="danger" />
        </div>
      </div>

      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          background: "#f8fafc",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Add New Task
        </div>

        <div style={gridStyle}>
          <FieldBlock label="Task Title *">
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Call lead, schedule site visit, send brochure..."
              style={inputStyle}
            />
          </FieldBlock>

          <FieldBlock label="Due Date">
            <input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              style={inputStyle}
            />
          </FieldBlock>

          <FieldBlock label="Priority">
            <select
              value={taskPriority}
              onChange={(e) =>
                setTaskPriority(e.target.value as LeadTaskPriority)
              }
              style={inputStyle}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </FieldBlock>
        </div>

        <FieldBlock label="Description">
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Add context, notes, objection, or what exactly needs to be done..."
            rows={4}
            style={textareaStyle}
          />
        </FieldBlock>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={addTask}
            disabled={!taskTitle.trim()}
            style={{
              ...primaryButtonStyle,
              opacity: taskTitle.trim() ? 1 : 0.55,
              cursor: taskTitle.trim() ? "pointer" : "not-allowed",
            }}
          >
            Add Task
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {tasks.length === 0 ? (
          <div
            style={{
              border: "1px dashed #cbd5e1",
              borderRadius: 18,
              background: "#f8fafc",
              padding: "28px 18px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              No tasks yet
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              Add the next action for this lead so the pipeline keeps moving.
            </div>
          </div>
        ) : (
          tasks.map((task) => {
            const overdue = task.status === "Pending" && isOverdue(task.dueDate);

            return (
              <article
                key={task.id}
                style={{
                  border: overdue
                    ? "1px solid #fecaca"
                    : "1px solid #e2e8f0",
                  borderRadius: 18,
                  background: task.status === "Completed" ? "#f8fafc" : "#ffffff",
                  padding: 16,
                  boxShadow: overdue
                    ? "0 10px 20px rgba(239, 68, 68, 0.08)"
                    : "0 6px 16px rgba(15, 23, 42, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        flexWrap: "wrap",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: "#0f172a",
                          textDecoration:
                            task.status === "Completed" ? "line-through" : "none",
                          lineHeight: 1.5,
                        }}
                      >
                        {task.title}
                      </span>

                      <Badge
                        label={task.status}
                        style={getStatusBadgeStyle(task.status)}
                      />

                      <Badge
                        label={task.priority}
                        style={getPriorityBadgeStyle(task.priority)}
                      />

                      {overdue ? (
                        <Badge
                          label="Overdue"
                          style={{
                            background: "#fef2f2",
                            color: "#b91c1c",
                            border: "1px solid #fecaca",
                          }}
                        />
                      ) : null}
                    </div>

                    {task.description?.trim() ? (
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          color: "#475569",
                          lineHeight: 1.7,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {task.description}
                      </p>
                    ) : null}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleTaskStatus(task.id)}
                      style={secondaryButtonStyle}
                    >
                      {task.status === "Completed"
                        ? "Mark Pending"
                        : "Mark Done"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      style={{
                        ...secondaryButtonStyle,
                        color: "#b91c1c",
                        border: "1px solid #fecaca",
                        background: "#fff1f2",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <MetaBadge label={`Due: ${formatDate(task.dueDate)}`} />
                  <MetaBadge label={`Created: ${formatDateTime(task.createdAt)}`} />
                  <MetaBadge label={`Updated: ${formatDateTime(task.updatedAt)}`} />
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <label
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#334155",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function StatBadge({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "danger";
}) {
  return (
    <div
      style={{
        minWidth: 76,
        borderRadius: 14,
        border: tone === "danger" ? "1px solid #fecaca" : "1px solid #e2e8f0",
        background: tone === "danger" ? "#fff1f2" : "#f8fafc",
        padding: "10px 12px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: tone === "danger" ? "#b91c1c" : "#64748b",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          color: tone === "danger" ? "#b91c1c" : "#0f172a",
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Badge({
  label,
  style,
}: {
  label: string;
  style: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        ...style,
      }}
    >
      {label}
    </span>
  );
}

function MetaBadge({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 10px",
        borderRadius: 999,
        background: "#f1f5f9",
        color: "#475569",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

function getStatusBadgeStyle(status: LeadTaskStatus): React.CSSProperties {
  switch (status) {
    case "Completed":
      return {
        background: "#ecfdf5",
        color: "#15803d",
        border: "1px solid #bbf7d0",
      };
    case "Pending":
    default:
      return {
        background: "#eff6ff",
        color: "#1d4ed8",
        border: "1px solid #bfdbfe",
      };
  }
}

function getPriorityBadgeStyle(
  priority: LeadTaskPriority
): React.CSSProperties {
  switch (priority) {
    case "High":
      return {
        background: "#fef2f2",
        color: "#b91c1c",
        border: "1px solid #fecaca",
      };
    case "Medium":
      return {
        background: "#fffbeb",
        color: "#a16207",
        border: "1px solid #fde68a",
      };
    case "Low":
    default:
      return {
        background: "#ecfdf5",
        color: "#15803d",
        border: "1px solid #bbf7d0",
      };
  }
}

function sortTasks(tasks: LeadTaskItem[]) {
  return [...tasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "Pending" ? -1 : 1;
    }

    const aOverdue = isOverdue(a.dueDate);
    const bOverdue = isOverdue(b.dueDate);

    if (aOverdue !== bOverdue) {
      return aOverdue ? -1 : 1;
    }

    const priorityOrder: Record<LeadTaskPriority, number> = {
      High: 0,
      Medium: 1,
      Low: 2,
    };

    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
    const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;

    if (aDue !== bDue) {
      return aDue - bDue;
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

function isOverdue(value?: string) {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();

  return target < today;
}

function formatDate(value?: string) {
  if (!value) return "No due date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 14,
  padding: "0 14px",
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  resize: "vertical",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  padding: "12px 14px",
  fontSize: 14,
  lineHeight: 1.6,
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
};

const primaryButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 16px",
  borderRadius: 12,
  border: "none",
  background: "#0f172a",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 700,
};

const secondaryButtonStyle: React.CSSProperties = {
  height: 36,
  padding: "0 14px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};