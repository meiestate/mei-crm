import React from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type TodayTaskItem = {
  id: string;
  title: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed" | "overdue";
  priority?: "low" | "medium" | "high" | "urgent";
  dueAt?: string;
  owner?: string;
  relatedTo?: string;
  relatedType?: "lead" | "contact" | "deal" | "general";
};

type TodayTasksCardProps = {
  mode: ThemeMode;
  tasks: TodayTaskItem[];
  title?: string;
  maxItems?: number;
  onTaskClick?: (task: TodayTaskItem) => void;
  onMarkComplete?: (task: TodayTaskItem) => void;
  onViewAll?: () => void;
};

export default function TodayTasksCard({
  mode,
  tasks,
  title = "Today’s Tasks",
  maxItems = 6,
  onTaskClick,
  onMarkComplete,
  onViewAll,
}: TodayTasksCardProps) {
  const theme = getTheme(mode);

  const visibleTasks = [...tasks]
    .sort((a, b) => {
      const statusDiff = getStatusSortOrder(a.status) - getStatusSortOrder(b.status);
      if (statusDiff !== 0) return statusDiff;

      const priorityDiff = getPriorityScore(b.priority) - getPriorityScore(a.priority);
      if (priorityDiff !== 0) return priorityDiff;

      const aTime = a.dueAt ? new Date(a.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.dueAt ? new Date(b.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    })
    .slice(0, maxItems);

  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const pendingCount = tasks.filter(
    (task) => task.status !== "completed"
  ).length;
  const overdueCount = tasks.filter((task) => task.status === "overdue").length;

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 22,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px 20px",
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: theme.text,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              lineHeight: 1.6,
              color: theme.subText,
            }}
          >
            Focus on what needs attention today and keep execution moving.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <MiniStat mode={mode} label="Pending" value={String(pendingCount)} />
          <MiniStat mode={mode} label="Done" value={String(completedCount)} />
          <MiniStat mode={mode} label="Overdue" value={String(overdueCount)} />

          {onViewAll ? (
            <button
              onClick={onViewAll}
              style={{
                height: 40,
                padding: "0 14px",
                borderRadius: 12,
                border: `1px solid ${theme.border}`,
                background: theme.cardBgSoft,
                color: theme.text,
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              View All
            </button>
          ) : null}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {visibleTasks.length === 0 ? (
          <EmptyState mode={mode} />
        ) : (
          <div
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {visibleTasks.map((task) => {
              const clickable = Boolean(onTaskClick);
              const statusTone = getStatusTone(task.status);
              const priorityTone = getPriorityTone(task.priority);
              const isCompleted = task.status === "completed";

              return (
                <div
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  style={{
                    background: theme.cardBgSoft,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 18,
                    padding: 16,
                    cursor: clickable ? "pointer" : "default",
                    opacity: isCompleted ? 0.78 : 1,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 14,
                      alignItems: "start",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 14,
                            background: getStatusPalette(mode, statusTone).bg,
                            border: `1px solid ${getStatusPalette(mode, statusTone).border}`,
                            color: getStatusPalette(mode, statusTone).text,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                            flexShrink: 0,
                          }}
                        >
                          {getTaskIcon(task.status)}
                        </div>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                              marginBottom: 8,
                            }}
                          >
                            <h4
                              style={{
                                margin: 0,
                                fontSize: 15,
                                fontWeight: 800,
                                color: theme.text,
                                lineHeight: 1.3,
                                textDecoration: isCompleted ? "line-through" : "none",
                              }}
                            >
                              {task.title}
                            </h4>

                            {task.priority ? (
                              <Badge
                                mode={mode}
                                label={task.priority}
                                tone={priorityTone}
                              />
                            ) : null}

                            {task.status ? (
                              <Badge
                                mode={mode}
                                label={formatStatusLabel(task.status)}
                                tone={statusTone}
                              />
                            ) : null}
                          </div>

                          {task.description ? (
                            <p
                              style={{
                                margin: 0,
                                fontSize: 13,
                                lineHeight: 1.7,
                                color: theme.subText,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                              }}
                            >
                              {task.description}
                            </p>
                          ) : null}

                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              flexWrap: "wrap",
                              marginTop: 12,
                            }}
                          >
                            {task.owner ? (
                              <MetaPill mode={mode} label={`Owner: ${task.owner}`} />
                            ) : null}

                            {task.relatedTo ? (
                              <MetaPill
                                mode={mode}
                                label={`${formatRelatedType(task.relatedType)}: ${task.relatedTo}`}
                              />
                            ) : null}

                            {task.dueAt ? (
                              <MetaPill
                                mode={mode}
                                label={`Due: ${formatDateTime(task.dueAt)}`}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: "right",
                        minWidth: 110,
                      }}
                    >
                      {task.dueAt ? (
                        <>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: theme.subText,
                              marginBottom: 6,
                            }}
                          >
                            Due Time
                          </div>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 800,
                              color: theme.text,
                              lineHeight: 1.1,
                            }}
                          >
                            {formatTime(task.dueAt)}
                          </div>
                          <div
                            style={{
                              marginTop: 6,
                              fontSize: 12,
                              color: theme.subText,
                            }}
                          >
                            {getRelativeDueLabel(task.dueAt, task.status)}
                          </div>
                        </>
                      ) : (
                        <div
                          style={{
                            fontSize: 12,
                            color: theme.subText,
                            fontWeight: 700,
                          }}
                        >
                          No due time
                        </div>
                      )}

                      {onMarkComplete && task.status !== "completed" ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{ marginTop: 12 }}
                        >
                          <button
                            onClick={() => onMarkComplete(task)}
                            style={{
                              height: 36,
                              padding: "0 12px",
                              borderRadius: 10,
                              border: "none",
                              background: theme.primary,
                              color: "#ffffff",
                              fontSize: 12,
                              fontWeight: 800,
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Mark Complete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyState({ mode }: { mode: ThemeMode }) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        minHeight: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div>
        <div
          style={{
            width: 68,
            height: 68,
            margin: "0 auto 14px",
            borderRadius: "50%",
            background: theme.cardBgSoft,
            border: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          ✅
        </div>

        <h4
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          No tasks for today
        </h4>

        <p
          style={{
            margin: "8px auto 0",
            maxWidth: 420,
            fontSize: 13,
            lineHeight: 1.7,
            color: theme.subText,
          }}
        >
          Today looks clear. Once tasks are assigned or scheduled, they will appear here.
        </p>
      </div>
    </div>
  );
}

function MiniStat({
  mode,
  label,
  value,
}: {
  mode: ThemeMode;
  label: string;
  value: string;
}) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        padding: "9px 12px",
        borderRadius: 14,
        background: theme.cardBgSoft,
        border: `1px solid ${theme.border}`,
        minWidth: 74,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: theme.subText,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: theme.text,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MetaPill({
  mode,
  label,
}: {
  mode: ThemeMode;
  label: string;
}) {
  const theme = getTheme(mode);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 10px",
        borderRadius: 999,
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        color: theme.subText,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

function Badge({
  mode,
  label,
  tone,
}: {
  mode: ThemeMode;
  label: string;
  tone: "success" | "warning" | "danger" | "neutral" | "info";
}) {
  const palette = getStatusPalette(mode, tone);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 9px",
        borderRadius: 999,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        color: palette.text,
        fontSize: 11,
        fontWeight: 800,
        textTransform: "capitalize",
      }}
    >
      {label}
    </span>
  );
}

function getTaskIcon(status?: TodayTaskItem["status"]) {
  switch (status) {
    case "completed":
      return "✔️";
    case "overdue":
      return "⚠️";
    case "in_progress":
      return "⏳";
    case "pending":
    default:
      return "📝";
  }
}

function formatStatusLabel(status: TodayTaskItem["status"]) {
  switch (status) {
    case "pending":
      return "Pending";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "overdue":
      return "Overdue";
    default:
      return "Task";
  }
}

function formatRelatedType(type?: TodayTaskItem["relatedType"]) {
  switch (type) {
    case "lead":
      return "Lead";
    case "contact":
      return "Contact";
    case "deal":
      return "Deal";
    case "general":
    default:
      return "Related";
  }
}

function getStatusSortOrder(status?: TodayTaskItem["status"]) {
  switch (status) {
    case "overdue":
      return 1;
    case "in_progress":
      return 2;
    case "pending":
      return 3;
    case "completed":
      return 4;
    default:
      return 5;
  }
}

function getPriorityScore(priority?: TodayTaskItem["priority"]) {
  switch (priority) {
    case "urgent":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
    default:
      return 1;
  }
}

function getStatusTone(
  status?: TodayTaskItem["status"]
): "success" | "warning" | "danger" | "neutral" | "info" {
  switch (status) {
    case "completed":
      return "success";
    case "overdue":
      return "danger";
    case "in_progress":
      return "info";
    case "pending":
      return "warning";
    default:
      return "neutral";
  }
}

function getPriorityTone(
  priority?: TodayTaskItem["priority"]
): "success" | "warning" | "danger" | "neutral" | "info" {
  switch (priority) {
    case "urgent":
      return "danger";
    case "high":
      return "warning";
    case "medium":
      return "info";
    case "low":
    default:
      return "neutral";
  }
}

function getStatusPalette(
  mode: ThemeMode,
  tone: "success" | "warning" | "danger" | "neutral" | "info"
) {
  const isDark = mode === "dark";

  switch (tone) {
    case "success":
      return {
        bg: isDark ? "rgba(34,197,94,0.14)" : "rgba(34,197,94,0.10)",
        border: isDark ? "rgba(34,197,94,0.28)" : "rgba(34,197,94,0.22)",
        text: "#16a34a",
      };
    case "warning":
      return {
        bg: isDark ? "rgba(245,158,11,0.14)" : "rgba(245,158,11,0.10)",
        border: isDark ? "rgba(245,158,11,0.28)" : "rgba(245,158,11,0.22)",
        text: "#d97706",
      };
    case "danger":
      return {
        bg: isDark ? "rgba(239,68,68,0.14)" : "rgba(239,68,68,0.10)",
        border: isDark ? "rgba(239,68,68,0.28)" : "rgba(239,68,68,0.22)",
        text: "#dc2626",
      };
    case "info":
      return {
        bg: isDark ? "rgba(59,130,246,0.14)" : "rgba(59,130,246,0.10)",
        border: isDark ? "rgba(59,130,246,0.28)" : "rgba(59,130,246,0.22)",
        text: "#2563eb",
      };
    case "neutral":
    default:
      return {
        bg: isDark ? "rgba(148,163,184,0.14)" : "rgba(148,163,184,0.10)",
        border: isDark ? "rgba(148,163,184,0.28)" : "rgba(148,163,184,0.22)",
        text: "#475569",
      };
  }
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getRelativeDueLabel(value: string, status?: TodayTaskItem["status"]) {
  if (status === "completed") return "Done";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = Date.now();
  const diff = date.getTime() - now;

  const minute = 60 * 1000;
  const hour = 60 * minute;

  if (diff < 0) {
    const overdueBy = Math.abs(diff);
    if (overdueBy < hour) return `${Math.floor(overdueBy / minute)} min overdue`;
    return `${Math.floor(overdueBy / hour)} hr overdue`;
  }

  if (diff < hour) return `In ${Math.floor(diff / minute)} min`;
  return `In ${Math.floor(diff / hour)} hr`;
}