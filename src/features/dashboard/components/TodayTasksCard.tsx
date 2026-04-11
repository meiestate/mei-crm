// src/features/dashboard/components/TodayTasksCard.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { DashboardTaskItem } from "../api/dashboardApi";

type TodayTasksCardProps = {
  tasks?: DashboardTaskItem[];
  mode?: ThemeMode;
  loading?: boolean;
  title?: string;
  onViewAll?: () => void;
  onTaskClick?: (task: DashboardTaskItem) => void;
};

function formatDate(value?: string): string {
  if (!value) return "No due date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No due date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getPriorityTone(priority?: string) {
  const value = (priority ?? "").toLowerCase();

  if (value === "high" || value === "urgent") {
    return {
      label: priority ?? "High",
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#dc2626",
      border: "rgba(239, 68, 68, 0.28)",
    };
  }

  if (value === "medium") {
    return {
      label: priority ?? "Medium",
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#d97706",
      border: "rgba(245, 158, 11, 0.28)",
    };
  }

  return {
    label: priority ?? "Low",
    bg: "rgba(34, 197, 94, 0.12)",
    color: "#16a34a",
    border: "rgba(34, 197, 94, 0.28)",
  };
}

function getStatusTone(status?: string) {
  const value = (status ?? "").toLowerCase();

  if (value === "completed" || value === "done" || value === "closed") {
    return {
      label: status ?? "Completed",
      bg: "rgba(34, 197, 94, 0.12)",
      color: "#16a34a",
      dot: "#16a34a",
    };
  }

  if (value === "in progress" || value === "progress") {
    return {
      label: status ?? "In Progress",
      bg: "rgba(59, 130, 246, 0.12)",
      color: "#2563eb",
      dot: "#2563eb",
    };
  }

  return {
    label: status ?? "Pending",
    bg: "rgba(245, 158, 11, 0.12)",
    color: "#d97706",
    dot: "#d97706",
  };
}

export default function TodayTasksCard({
  tasks = [],
  mode = "light",
  loading = false,
  title = "Today Tasks",
  onViewAll,
  onTaskClick,
}: TodayTasksCardProps) {
  const theme = getTheme(mode);

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 20,
        boxShadow:
          mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.28)"
            : "0 10px 30px rgba(15, 23, 42, 0.06)",
        minHeight: 360,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h3>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: theme.subText,
            }}
          >
            Track the next important actions for your team.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          style={{
            border: `1px solid ${theme.border}`,
            background: theme.cardBgSoft,
            color: theme.text,
            borderRadius: 10,
            padding: "8px 12px",
            fontSize: 13,
            fontWeight: 600,
            cursor: onViewAll ? "pointer" : "default",
            opacity: onViewAll ? 1 : 0.7,
          }}
        >
          View All
        </button>
      </div>

      {loading ? (
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              style={{
                border: `1px solid ${theme.borderSoft}`,
                background: theme.cardBgSoft,
                borderRadius: 16,
                padding: 14,
                display: "grid",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 12,
                  width: "58%",
                  background: theme.border,
                  borderRadius: 999,
                }}
              />
              <div
                style={{
                  height: 10,
                  width: "32%",
                  background: theme.borderSoft,
                  borderRadius: 999,
                }}
              />
              <div
                style={{
                  height: 10,
                  width: "46%",
                  background: theme.borderSoft,
                  borderRadius: 999,
                }}
              />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div
          style={{
            flex: 1,
            border: `1px dashed ${theme.border}`,
            borderRadius: 18,
            background: theme.cardBgSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 34,
                lineHeight: 1,
                marginBottom: 10,
              }}
            >
              📋
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: theme.text,
                marginBottom: 6,
              }}
            >
              No tasks for today
            </div>
            <div
              style={{
                fontSize: 13,
                color: theme.subText,
              }}
            >
              Your dashboard is calm right now. New tasks will show up here.
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {tasks.map((task) => {
            const priorityTone = getPriorityTone(task.priority);
            const statusTone = getStatusTone(task.status);

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => onTaskClick?.(task)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: `1px solid ${theme.borderSoft}`,
                  background: theme.cardBgSoft,
                  borderRadius: 16,
                  padding: 14,
                  cursor: onTaskClick ? "pointer" : "default",
                  transition: "all 0.18s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: theme.text,
                        lineHeight: 1.35,
                        marginBottom: 6,
                        wordBreak: "break-word",
                      }}
                    >
                      {task.title}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          borderRadius: 999,
                          padding: "4px 10px",
                          background: statusTone.bg,
                          color: statusTone.color,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: statusTone.dot,
                            display: "inline-block",
                          }}
                        />
                        {statusTone.label}
                      </span>

                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: 999,
                          padding: "4px 10px",
                          background: priorityTone.bg,
                          color: priorityTone.color,
                          border: `1px solid ${priorityTone.border}`,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {priorityTone.label}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: theme.subText,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(task.dueDate)}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      border: `1px solid ${theme.border}`,
                      borderRadius: 12,
                      padding: "10px 12px",
                      background: theme.cardBg,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: theme.mutedText,
                        marginBottom: 4,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Owner
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: theme.text,
                      }}
                    >
                      {task.owner || "Unassigned"}
                    </div>
                  </div>

                  <div
                    style={{
                      border: `1px solid ${theme.border}`,
                      borderRadius: 12,
                      padding: "10px 12px",
                      background: theme.cardBg,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: theme.mutedText,
                        marginBottom: 4,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Related To
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: theme.text,
                        wordBreak: "break-word",
                      }}
                    >
                      {task.relatedTo || "General task"}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}