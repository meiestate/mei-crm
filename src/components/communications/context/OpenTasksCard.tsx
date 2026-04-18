import React, { memo, useMemo } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Flag,
  FolderKanban,
  ListTodo,
  Sparkles,
  User2,
} from "lucide-react";

type TaskPriority = "low" | "medium" | "high" | "urgent";
type TaskStatus = "open" | "in-progress" | "blocked" | "completed";
type TaskType = "call" | "follow-up" | "meeting" | "site-visit" | "documentation" | "general";

export type OpenTaskItem = {
  id: string;
  title: string;
  description?: string;
  dueAt?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  taskType?: TaskType;
  ownerName?: string;
  leadName?: string;
  dealName?: string;
};

type Props = {
  tasks?: OpenTaskItem[];
  loading?: boolean;
  empty?: boolean;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  actionLabel?: string;
  maxVisible?: number;
  className?: string;
  onTaskClick?: (task: OpenTaskItem) => void;
  onViewAllClick?: () => void;
  onCompleteTask?: (task: OpenTaskItem) => void;
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  borderRadius: 24,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  position: "relative",
  padding: 20,
  borderBottom: "1px solid #e2e8f0",
  background:
    "linear-gradient(135deg, rgba(239,246,255,1) 0%, rgba(248,250,252,1) 54%, rgba(255,255,255,1) 100%)",
};

const glowStyle: React.CSSProperties = {
  position: "absolute",
  right: -30,
  top: -42,
  width: 170,
  height: 170,
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(37,99,235,0.14) 0%, rgba(37,99,235,0) 72%)",
  pointerEvents: "none",
};

const headerRowStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 14,
  flexWrap: "wrap",
};

const titleWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
  flex: 1,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.03em",
  lineHeight: 1.2,
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1.6,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 800,
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  color: "#1d4ed8",
};

const bodyStyle: React.CSSProperties = {
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 12,
};

const summaryItemStyle: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  padding: "14px 15px",
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
};

const summaryLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const summaryValueStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1,
  letterSpacing: "-0.03em",
};

const summaryHelperStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.6,
};

const listWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const taskItemStyle: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const taskTopRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const taskTitleWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
  flex: 1,
};

const taskTitleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: "#0f172a",
  lineHeight: 1.5,
  letterSpacing: "-0.02em",
};

const taskDescriptionStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.7,
};

const chipsWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const metaGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 10,
};

const metaItemStyle: React.CSSProperties = {
  borderRadius: 14,
  background: "#f8fafc",
  border: "1px solid #edf2f7",
  padding: "10px 12px",
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  minWidth: 0,
};

const metaTextWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  minWidth: 0,
};

const metaLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const metaValueStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#0f172a",
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const taskActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const helperTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.7,
};

const actionGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const secondaryButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #dbe3ef",
  background: "#ffffff",
  color: "#334155",
  borderRadius: 12,
  padding: "10px 14px",
  fontSize: 12,
  fontWeight: 800,
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  cursor: "pointer",
};

const primaryButtonStyle: React.CSSProperties = {
  ...secondaryButtonStyle,
  background: "#2563eb",
  color: "#ffffff",
  border: "1px solid #2563eb",
  boxShadow: "0 12px 24px rgba(37, 99, 235, 0.16)",
};

const footerStyle: React.CSSProperties = {
  padding: "0 20px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const emptyStateStyle: React.CSSProperties = {
  padding: 28,
  margin: 20,
  borderRadius: 18,
  border: "1px dashed #cbd5e1",
  background: "#f8fafc",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  textAlign: "center",
};

const skeletonStyle: React.CSSProperties = {
  borderRadius: 12,
  background:
    "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)",
  backgroundSize: "200% 100%",
  animation: "openTasksCardPulse 1.4s ease-in-out infinite",
};

function OpenTasksCard({
  tasks,
  loading = false,
  empty = false,
  title = "Open Tasks",
  subtitle = "Track pending execution items, deadlines, ownership, and urgency in one focused operations card.",
  emptyTitle = "No open tasks available",
  emptyDescription = "You're clear for now. New tasks, follow-ups, and execution items will appear here.",
  actionLabel = "View All Tasks",
  maxVisible = 4,
  className,
  onTaskClick,
  onViewAllClick,
  onCompleteTask,
}: Props) {
  const safeTasks = useMemo<OpenTaskItem[]>(() => {
    if (tasks?.length) {
      return tasks.filter((task) => task.status !== "completed");
    }

    return [
      {
        id: "task-001",
        title: "Call lead and confirm site visit schedule",
        description:
          "Prospect is warm and waiting for final time confirmation before weekend visit.",
        dueAt: new Date(Date.now() + 1000 * 60 * 45).toISOString(),
        status: "open",
        priority: "urgent",
        taskType: "call",
        ownerName: "Arjun Raj",
        leadName: "Karthik S",
        dealName: "Whitefield Premium Plot",
      },
      {
        id: "task-002",
        title: "Send updated pricing and brochure",
        description:
          "Buyer requested a refreshed cost sheet with bank loan eligibility note.",
        dueAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
        status: "in-progress",
        priority: "high",
        taskType: "documentation",
        ownerName: "Vikram",
        leadName: "Ramesh Kumar",
        dealName: "North Bengaluru Villa Deal",
      },
      {
        id: "task-003",
        title: "Prepare follow-up message after missed call",
        description:
          "Lead did not answer. Re-engage with concise WhatsApp message and urgency angle.",
        dueAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: "blocked",
        priority: "medium",
        taskType: "follow-up",
        ownerName: "Kavin Raj",
        leadName: "Deepak M",
      },
      {
        id: "task-004",
        title: "Collect legal clarification from project team",
        description:
          "Need final approval note before proposal discussion continues.",
        dueAt: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
        status: "open",
        priority: "high",
        taskType: "documentation",
        ownerName: "Priya",
        dealName: "Sarjapur Layout Opportunity",
      },
    ];
  }, [tasks]);

  const visibleTasks = safeTasks.slice(0, Math.max(1, maxVisible));
  const overdueCount = safeTasks.filter((task) => isTaskOverdue(task)).length;
  const urgentCount = safeTasks.filter((task) => task.priority === "urgent" || task.priority === "high").length;
  const inProgressCount = safeTasks.filter((task) => task.status === "in-progress").length;

  if (loading) {
    return (
      <div className={className} style={cardStyle}>
        <style>
          {`
            @keyframes openTasksCardPulse {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }

            @media (max-width: 900px) {
              .open-tasks-summary-grid {
                grid-template-columns: 1fr !important;
              }

              .open-tasks-meta-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>

        <div style={headerStyle}>
          <div style={glowStyle} />
          <div style={headerRowStyle}>
            <div style={titleWrapStyle}>
              <div style={{ ...skeletonStyle, height: 22, width: 180 }} />
              <div style={{ ...skeletonStyle, height: 14, width: 280 }} />
            </div>
          </div>
        </div>

        <div style={bodyStyle}>
          <div className="open-tasks-summary-grid" style={summaryGridStyle}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} style={summaryItemStyle}>
                <div style={{ ...skeletonStyle, height: 10, width: 70 }} />
                <div style={{ ...skeletonStyle, height: 24, width: 56 }} />
                <div style={{ ...skeletonStyle, height: 12, width: "80%" }} />
              </div>
            ))}
          </div>

          <div style={listWrapStyle}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} style={taskItemStyle}>
                <div style={{ ...skeletonStyle, height: 18, width: "56%" }} />
                <div style={{ ...skeletonStyle, height: 12, width: "100%" }} />
                <div className="open-tasks-meta-grid" style={metaGridStyle}>
                  <div style={{ ...skeletonStyle, height: 48, width: "100%" }} />
                  <div style={{ ...skeletonStyle, height: 48, width: "100%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (empty || safeTasks.length === 0) {
    return (
      <div className={className} style={cardStyle}>
        <div style={headerStyle}>
          <div style={glowStyle} />
          <div style={headerRowStyle}>
            <div style={titleWrapStyle}>
              <h3 style={titleStyle}>{title}</h3>
              <p style={subtitleStyle}>{subtitle}</p>
            </div>
          </div>
        </div>

        <div style={emptyStateStyle}>
          <CheckCircle2 size={24} color="#047857" />
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
            {emptyTitle}
          </div>
          <div style={helperTextStyle}>{emptyDescription}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={cardStyle}>
      <style>
        {`
          @media (max-width: 900px) {
            .open-tasks-summary-grid {
              grid-template-columns: 1fr !important;
            }

            .open-tasks-meta-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div style={headerStyle}>
        <div style={glowStyle} />
        <div style={headerRowStyle}>
          <div style={titleWrapStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>

          <div style={badgeStyle}>
            <Sparkles size={14} />
            Execution Radar
          </div>
        </div>
      </div>

      <div style={bodyStyle}>
        <div className="open-tasks-summary-grid" style={summaryGridStyle}>
          <SummaryItem
            label="Open"
            value={String(safeTasks.length)}
            helper="Pending execution items"
          />
          <SummaryItem
            label="Urgent"
            value={String(urgentCount)}
            helper="High-pressure priorities"
          />
          <SummaryItem
            label="Overdue"
            value={String(overdueCount)}
            helper={overdueCount > 0 ? "Needs immediate action" : "No delays right now"}
          />
        </div>

        <div style={listWrapStyle}>
          {visibleTasks.map((task) => {
            const priorityMeta = getPriorityMeta(task.priority);
            const statusMeta = getStatusMeta(task.status, isTaskOverdue(task));
            const typeMeta = getTaskTypeMeta(task.taskType);
            const dueLabel = getDueLabel(task.dueAt);

            return (
              <div key={task.id} style={taskItemStyle}>
                <div style={taskTopRowStyle}>
                  <div style={taskTitleWrapStyle}>
                    <div style={taskTitleStyle}>{task.title}</div>
                    {task.description ? (
                      <div style={taskDescriptionStyle}>{task.description}</div>
                    ) : null}
                  </div>

                  <div style={chipsWrapStyle}>
                    <span style={priorityMeta.style}>
                      {priorityMeta.icon}
                      {priorityMeta.label}
                    </span>
                    <span style={statusMeta.style}>
                      {statusMeta.icon}
                      {statusMeta.label}
                    </span>
                    <span style={typeMeta.style}>
                      {typeMeta.icon}
                      {typeMeta.label}
                    </span>
                  </div>
                </div>

                <div className="open-tasks-meta-grid" style={metaGridStyle}>
                  <MetaItem
                    label="Due"
                    value={formatDateTime(task.dueAt)}
                    helper={dueLabel}
                    icon={<CalendarClock size={14} color="#2563eb" />}
                  />
                  <MetaItem
                    label="Owner"
                    value={task.ownerName || "Unassigned"}
                    icon={<User2 size={14} color="#2563eb" />}
                  />
                  <MetaItem
                    label="Lead"
                    value={task.leadName || "Not linked"}
                    icon={<ListTodo size={14} color="#2563eb" />}
                  />
                  <MetaItem
                    label="Deal / Context"
                    value={task.dealName || "General task"}
                    icon={<FolderKanban size={14} color="#2563eb" />}
                  />
                </div>

                <div style={taskActionsStyle}>
                  <div style={helperTextStyle}>
                    {task.status === "blocked"
                      ? "This task has friction and may need escalation."
                      : task.status === "in-progress"
                      ? "Work is already moving. Keep momentum alive."
                      : isTaskOverdue(task)
                      ? "This task is slipping and should be handled first."
                      : "Clear the next step before this task loses momentum."}
                  </div>

                  <div style={actionGroupStyle}>
                    <button
                      type="button"
                      style={secondaryButtonStyle}
                      onClick={() => onTaskClick?.(task)}
                    >
                      Open
                      <ArrowRight size={14} />
                    </button>

                    {task.status !== "completed" ? (
                      <button
                        type="button"
                        style={primaryButtonStyle}
                        onClick={() => onCompleteTask?.(task)}
                      >
                        <CheckCircle2 size={14} />
                        Complete
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={footerStyle}>
        <div style={helperTextStyle}>
          {inProgressCount > 0
            ? `${inProgressCount} task${inProgressCount > 1 ? "s are" : " is"} already moving. Focus on overdue and urgent items first.`
            : "Best rhythm: finish urgent work first, then clear near-term tasks before they turn into delays."}
        </div>

        <button type="button" style={secondaryButtonStyle} onClick={onViewAllClick}>
          {actionLabel}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div style={summaryItemStyle}>
      <div style={summaryLabelStyle}>{label}</div>
      <div style={summaryValueStyle}>{value}</div>
      {helper ? <div style={summaryHelperStyle}>{helper}</div> : null}
    </div>
  );
}

function MetaItem({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div style={metaItemStyle}>
      {icon ? <span style={{ marginTop: 2, flexShrink: 0 }}>{icon}</span> : null}
      <div style={metaTextWrapStyle}>
        <div style={metaLabelStyle}>{label}</div>
        <div style={metaValueStyle}>{value}</div>
        {helper ? <div style={helperTextStyle}>{helper}</div> : null}
      </div>
    </div>
  );
}

function getPriorityMeta(priority: TaskPriority = "medium") {
  switch (priority) {
    case "urgent":
      return {
        label: "Urgent",
        icon: <AlertTriangle size={12} />,
        style: chip("#fef2f2", "#fecaca", "#b91c1c"),
      };
    case "high":
      return {
        label: "High",
        icon: <Flag size={12} />,
        style: chip("#fff7ed", "#fed7aa", "#c2410c"),
      };
    case "low":
      return {
        label: "Low",
        icon: <CircleDashed size={12} />,
        style: chip("#f8fafc", "#e2e8f0", "#475569"),
      };
    default:
      return {
        label: "Medium",
        icon: <Clock3 size={12} />,
        style: chip("#eff6ff", "#bfdbfe", "#1d4ed8"),
      };
  }
}

function getStatusMeta(status: TaskStatus = "open", overdue = false) {
  if (overdue && status !== "completed") {
    return {
      label: "Overdue",
      icon: <AlertTriangle size={12} />,
      style: chip("#fef2f2", "#fecaca", "#b91c1c"),
    };
  }

  switch (status) {
    case "in-progress":
      return {
        label: "In Progress",
        icon: <Clock3 size={12} />,
        style: chip("#eff6ff", "#bfdbfe", "#1d4ed8"),
      };
    case "blocked":
      return {
        label: "Blocked",
        icon: <AlertTriangle size={12} />,
        style: chip("#fff7ed", "#fed7aa", "#c2410c"),
      };
    case "completed":
      return {
        label: "Completed",
        icon: <CheckCircle2 size={12} />,
        style: chip("#ecfdf5", "#a7f3d0", "#047857"),
      };
    default:
      return {
        label: "Open",
        icon: <ListTodo size={12} />,
        style: chip("#f8fafc", "#e2e8f0", "#475569"),
      };
  }
}

function getTaskTypeMeta(taskType: TaskType = "general") {
  switch (taskType) {
    case "call":
      return {
        label: "Call",
        icon: <Clock3 size={12} />,
        style: chip("#eff6ff", "#bfdbfe", "#1d4ed8"),
      };
    case "follow-up":
      return {
        label: "Follow-Up",
        icon: <ArrowRight size={12} />,
        style: chip("#f5f3ff", "#ddd6fe", "#6d28d9"),
      };
    case "meeting":
      return {
        label: "Meeting",
        icon: <CalendarClock size={12} />,
        style: chip("#ecfeff", "#a5f3fc", "#0f766e"),
      };
    case "site-visit":
      return {
        label: "Site Visit",
        icon: <FolderKanban size={12} />,
        style: chip("#fff7ed", "#fed7aa", "#c2410c"),
      };
    case "documentation":
      return {
        label: "Documentation",
        icon: <FolderKanban size={12} />,
        style: chip("#eef2ff", "#c7d2fe", "#4338ca"),
      };
    default:
      return {
        label: "General",
        icon: <ListTodo size={12} />,
        style: chip("#f8fafc", "#e2e8f0", "#475569"),
      };
  }
}

function chip(
  background: string,
  border: string,
  color: string
): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    padding: "7px 11px",
    background,
    border: `1px solid ${border}`,
    color,
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: "nowrap",
  };
}

function isTaskOverdue(task: OpenTaskItem) {
  if (!task.dueAt || task.status === "completed") return false;
  const dueDate = new Date(task.dueAt);
  if (Number.isNaN(dueDate.getTime())) return false;
  return dueDate.getTime() < Date.now();
}

function getDueLabel(value?: string) {
  if (!value) return "No deadline set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid due date";

  const diff = date.getTime() - Date.now();
  const absMinutes = Math.floor(Math.abs(diff) / (1000 * 60));
  const absHours = Math.floor(absMinutes / 60);
  const absDays = Math.floor(absHours / 24);

  if (diff < 0) {
    if (absDays >= 1) return `${absDays} day${absDays > 1 ? "s" : ""} overdue`;
    if (absHours >= 1) return `${absHours} hour${absHours > 1 ? "s" : ""} overdue`;
    return `${Math.max(absMinutes, 1)} minute${absMinutes > 1 ? "s" : ""} overdue`;
  }

  if (absDays >= 1) return `Due in ${absDays} day${absDays > 1 ? "s" : ""}`;
  if (absHours >= 1) return `Due in ${absHours} hour${absHours > 1 ? "s" : ""}`;
  return `Due in ${Math.max(absMinutes, 1)} minute${absMinutes > 1 ? "s" : ""}`;
}

function formatDateTime(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default memo(OpenTasksCard);