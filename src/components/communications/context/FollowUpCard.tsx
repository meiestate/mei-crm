import React, { memo, useMemo } from "react";
import {
  AlarmClock,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  CircleDashed,
  Clock3,
  MessageSquare,
  Mail,
  PhoneCall,
  User2,
  BriefcaseBusiness,
  FileText,
  BellRing,
  Sparkles,
  Pencil,
  CheckCheck,
} from "lucide-react";

type FollowUpPriority = "low" | "medium" | "high" | "urgent";
type FollowUpStatus = "pending" | "scheduled" | "completed" | "overdue" | "cancelled";
type FollowUpChannel = "call" | "whatsapp" | "email" | "meeting" | "sms" | "other";

export type FollowUpCardData = {
  id: string;
  title: string;
  description?: string;
  dueAt: string;
  priority?: FollowUpPriority;
  status?: FollowUpStatus;
  channel?: FollowUpChannel;
  contactName?: string;
  dealName?: string;
  ownerName?: string;
  reminderAt?: string;
  notes?: string;
  completedAt?: string;
};

type Props = {
  followUp?: FollowUpCardData | null;
  loading?: boolean;
  empty?: boolean;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  onMarkComplete?: (followUp: FollowUpCardData) => void;
  onEdit?: (followUp: FollowUpCardData) => void;
  onOpen?: (followUp: FollowUpCardData) => void;
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
    "linear-gradient(135deg, rgba(255,247,237,1) 0%, rgba(248,250,252,1) 54%, rgba(255,255,255,1) 100%)",
};

const glowStyle: React.CSSProperties = {
  position: "absolute",
  right: -30,
  top: -40,
  width: 170,
  height: 170,
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0) 72%)",
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
  border: "1px solid #fdba74",
  background: "#fff7ed",
  color: "#c2410c",
};

const contentStyle: React.CSSProperties = {
  padding: 20,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.05fr) minmax(300px, 0.95fr)",
  gap: 16,
  minWidth: 0,
};

const columnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
};

const sectionStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  background: "#ffffff",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  minWidth: 0,
};

const sectionTitleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.02em",
};

const topBlockStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const followUpTitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "#0f172a",
  lineHeight: 1.35,
  letterSpacing: "-0.02em",
};

const descriptionStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#475569",
  lineHeight: 1.75,
};

const tagWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const infoGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const infoItemStyle: React.CSSProperties = {
  border: "1px solid #edf2f7",
  borderRadius: 16,
  background: "#f8fafc",
  padding: "13px 14px",
  display: "flex",
  flexDirection: "column",
  gap: 7,
  minWidth: 0,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const valueStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "#0f172a",
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const helperTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.7,
};

const noteBoxStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  background: "#f8fafc",
  padding: 14,
  fontSize: 13,
  color: "#334155",
  lineHeight: 1.8,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const footerStyle: React.CSSProperties = {
  padding: "0 20px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const actionsWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const actionButtonStyle: React.CSSProperties = {
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

const primaryActionButtonStyle: React.CSSProperties = {
  ...actionButtonStyle,
  background: "#ea580c",
  color: "#ffffff",
  border: "1px solid #ea580c",
  boxShadow: "0 12px 24px rgba(234, 88, 12, 0.16)",
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
  animation: "followUpCardPulse 1.4s ease-in-out infinite",
};

function FollowUpCard({
  followUp,
  loading = false,
  empty = false,
  title = "Follow-Up Insight",
  subtitle = "Stay on top of next actions, deadlines, reminders, and execution priority with one clear operational card.",
  emptyTitle = "No follow-up selected",
  emptyDescription = "Choose a follow-up to view due timing, ownership, reminder status, and recommended action flow.",
  className,
  onMarkComplete,
  onEdit,
  onOpen,
}: Props) {
  const safeFollowUp = useMemo<FollowUpCardData | null>(() => {
    if (followUp) return followUp;

    return {
      id: "fu-001",
      title: "Call buyer and confirm legal document review",
      description:
        "Follow up with the prospect after sharing the latest project documents and address any legal clarity concerns before price negotiation.",
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
      priority: "high",
      status: "pending",
      channel: "call",
      contactName: "Ramesh Kumar",
      dealName: "North Bengaluru Villa Deal",
      ownerName: "Arjun Raj",
      reminderAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      notes:
        "Prospect asked for faster clarity on approvals and wants one final call before booking decision.",
    };
  }, [followUp]);

  if (loading) {
    return (
      <div className={className} style={cardStyle}>
        <style>
          {`
            @keyframes followUpCardPulse {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }

            @media (max-width: 1100px) {
              .followup-card-content {
                grid-template-columns: 1fr !important;
              }
            }

            @media (max-width: 768px) {
              .followup-card-grid {
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

        <div className="followup-card-content" style={contentStyle}>
          <div style={columnStyle}>
            <div style={sectionStyle}>
              <div style={{ ...skeletonStyle, height: 20, width: 240 }} />
              <div style={{ ...skeletonStyle, height: 14, width: "100%" }} />
              <div style={{ ...skeletonStyle, height: 14, width: "76%" }} />
              <div style={{ ...skeletonStyle, height: 32, width: "68%" }} />
            </div>

            <div className="followup-card-grid" style={infoGridStyle}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} style={infoItemStyle}>
                  <div style={{ ...skeletonStyle, height: 10, width: 70 }} />
                  <div style={{ ...skeletonStyle, height: 16, width: "82%" }} />
                </div>
              ))}
            </div>
          </div>

          <div style={columnStyle}>
            <div style={sectionStyle}>
              <div style={{ ...skeletonStyle, height: 18, width: 120 }} />
              <div style={{ ...skeletonStyle, height: 78, width: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (empty || !safeFollowUp) {
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
          <CircleDashed size={24} color="#64748b" />
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
            {emptyTitle}
          </div>
          <div style={helperTextStyle}>{emptyDescription}</div>
        </div>
      </div>
    );
  }

  const dueState = getDueState(safeFollowUp.dueAt, safeFollowUp.status);
  const priorityMeta = getPriorityMeta(safeFollowUp.priority);
  const statusMeta = getStatusMeta(safeFollowUp.status, dueState.isOverdue);
  const channelMeta = getChannelMeta(safeFollowUp.channel);

  return (
    <div className={className} style={cardStyle}>
      <style>
        {`
          @media (max-width: 1100px) {
            .followup-card-content {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            .followup-card-grid {
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
            Execution Focus
          </div>
        </div>
      </div>

      <div className="followup-card-content" style={contentStyle}>
        <div style={columnStyle}>
          <div style={sectionStyle}>
            <div style={topBlockStyle}>
              <div style={followUpTitleStyle}>{safeFollowUp.title}</div>

              {safeFollowUp.description ? (
                <div style={descriptionStyle}>{safeFollowUp.description}</div>
              ) : null}

              <div style={tagWrapStyle}>
                <span style={priorityMeta.style}>
                  {priorityMeta.icon}
                  {priorityMeta.label}
                </span>

                <span style={statusMeta.style}>
                  {statusMeta.icon}
                  {statusMeta.label}
                </span>

                <span style={channelMeta.style}>
                  {channelMeta.icon}
                  {channelMeta.label}
                </span>
              </div>
            </div>
          </div>

          <div className="followup-card-grid" style={infoGridStyle}>
            <InfoItem
              label="Due Date"
              value={formatDateTime(safeFollowUp.dueAt)}
              icon={<CalendarClock size={14} color="#2563eb" />}
              helper={dueState.label}
            />
            <InfoItem
              label="Reminder"
              value={safeFollowUp.reminderAt ? formatDateTime(safeFollowUp.reminderAt) : "Not set"}
              icon={<BellRing size={14} color="#2563eb" />}
              helper={
                safeFollowUp.reminderAt
                  ? getReminderLabel(safeFollowUp.reminderAt)
                  : "No reminder configured"
              }
            />
            <InfoItem
              label="Contact"
              value={safeFollowUp.contactName || "Not linked"}
              icon={<User2 size={14} color="#2563eb" />}
            />
            <InfoItem
              label="Deal / Context"
              value={safeFollowUp.dealName || "No deal attached"}
              icon={<BriefcaseBusiness size={14} color="#2563eb" />}
            />
            <InfoItem
              label="Owner"
              value={safeFollowUp.ownerName || "Unassigned"}
              icon={<User2 size={14} color="#2563eb" />}
            />
            <InfoItem
              label="Completed At"
              value={
                safeFollowUp.completedAt
                  ? formatDateTime(safeFollowUp.completedAt)
                  : "Not completed"
              }
              icon={<CheckCheck size={14} color="#2563eb" />}
            />
          </div>
        </div>

        <div style={columnStyle}>
          <div style={sectionStyle}>
            <div style={sectionTitleRowStyle}>
              <FileText size={16} color="#2563eb" />
              <h4 style={sectionTitleStyle}>Notes & Context</h4>
            </div>

            <div style={noteBoxStyle}>
              {safeFollowUp.notes?.trim()
                ? safeFollowUp.notes
                : "No notes added for this follow-up yet."}
            </div>
          </div>

          <div
            style={{
              ...sectionStyle,
              background: "linear-gradient(135deg, #fff7ed 0%, #f8fafc 100%)",
              border: "1px solid #fed7aa",
            }}
          >
            <div style={sectionTitleRowStyle}>
              <AlarmClock size={16} color="#ea580c" />
              <h4 style={sectionTitleStyle}>Operational Read</h4>
            </div>

            <div style={helperTextStyle}>
              This follow-up is currently{" "}
              <span style={{ fontWeight: 800, color: "#0f172a" }}>
                {statusMeta.label.toLowerCase()}
              </span>
              {dueState.isOverdue ? " and needs immediate attention" : " and should be handled with disciplined timing"}.
            </div>

            <div style={helperTextStyle}>
              Best execution usually means closing the loop fast, capturing notes,
              and pushing the next milestone before deal momentum cools down.
            </div>
          </div>
        </div>
      </div>

      <div style={footerStyle}>
        <div style={helperTextStyle}>
          Follow-ups work best when timing, ownership, and next action are crystal clear.
        </div>

        <div style={actionsWrapStyle}>
          <button
            type="button"
            style={actionButtonStyle}
            onClick={() => onEdit?.(safeFollowUp)}
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            type="button"
            style={actionButtonStyle}
            onClick={() => onOpen?.(safeFollowUp)}
          >
            Open
            <ArrowRight size={14} />
          </button>

          {safeFollowUp.status !== "completed" ? (
            <button
              type="button"
              style={primaryActionButtonStyle}
              onClick={() => onMarkComplete?.(safeFollowUp)}
            >
              <CheckCircle2 size={14} />
              Mark Complete
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
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
    <div style={infoItemStyle}>
      <div style={labelStyle}>{label}</div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, minWidth: 0 }}>
        {icon ? <span style={{ marginTop: 2, flexShrink: 0 }}>{icon}</span> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
          <span style={valueStyle}>{value}</span>
          {helper ? <span style={helperTextStyle}>{helper}</span> : null}
        </div>
      </div>
    </div>
  );
}

function getPriorityMeta(priority: FollowUpPriority = "medium") {
  switch (priority) {
    case "urgent":
      return {
        label: "Urgent",
        icon: <FlameIcon />,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          borderRadius: 999,
          padding: "7px 11px",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#b91c1c",
          fontSize: 12,
          fontWeight: 800,
        } as React.CSSProperties,
      };
    case "high":
      return {
        label: "High Priority",
        icon: <CircleAlert size={12} />,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          borderRadius: 999,
          padding: "7px 11px",
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          color: "#c2410c",
          fontSize: 12,
          fontWeight: 800,
        } as React.CSSProperties,
      };
    case "medium":
      return {
        label: "Medium Priority",
        icon: <Clock3 size={12} />,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          borderRadius: 999,
          padding: "7px 11px",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          color: "#1d4ed8",
          fontSize: 12,
          fontWeight: 800,
        } as React.CSSProperties,
      };
    default:
      return {
        label: "Low Priority",
        icon: <CircleDashed size={12} />,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          borderRadius: 999,
          padding: "7px 11px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          color: "#475569",
          fontSize: 12,
          fontWeight: 800,
        } as React.CSSProperties,
      };
  }
}

function getStatusMeta(status: FollowUpStatus = "pending", isOverdue = false) {
  if (isOverdue || status === "overdue") {
    return {
      label: "Overdue",
      icon: <CircleAlert size={12} />,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        borderRadius: 999,
        padding: "7px 11px",
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#b91c1c",
        fontSize: 12,
        fontWeight: 800,
      } as React.CSSProperties,
    };
  }

  switch (status) {
    case "completed":
      return {
        label: "Completed",
        icon: <CheckCircle2 size={12} />,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          borderRadius: 999,
          padding: "7px 11px",
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          color: "#047857",
          fontSize: 12,
          fontWeight: 800,
        } as React.CSSProperties,
      };
    case "scheduled":
      return {
        label: "Scheduled",
        icon: <CalendarClock size={12} />,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          borderRadius: 999,
          padding: "7px 11px",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          color: "#1d4ed8",
          fontSize: 12,
          fontWeight: 800,
        } as React.CSSProperties,
      };
    case "cancelled":
      return {
        label: "Cancelled",
        icon: <CircleDashed size={12} />,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          borderRadius: 999,
          padding: "7px 11px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          color: "#475569",
          fontSize: 12,
          fontWeight: 800,
        } as React.CSSProperties,
      };
    default:
      return {
        label: "Pending",
        icon: <Clock3 size={12} />,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          borderRadius: 999,
          padding: "7px 11px",
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          color: "#c2410c",
          fontSize: 12,
          fontWeight: 800,
        } as React.CSSProperties,
      };
  }
}

function getChannelMeta(channel: FollowUpChannel = "other") {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    padding: "7px 11px",
    fontSize: 12,
    fontWeight: 800,
  };

  switch (channel) {
    case "call":
      return {
        label: "Call",
        icon: <PhoneCall size={12} />,
        style: {
          ...base,
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          color: "#1d4ed8",
        } as React.CSSProperties,
      };
    case "whatsapp":
      return {
        label: "WhatsApp",
        icon: <MessageSquare size={12} />,
        style: {
          ...base,
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          color: "#047857",
        } as React.CSSProperties,
      };
    case "email":
      return {
        label: "Email",
        icon: <Mail size={12} />,
        style: {
          ...base,
          background: "#f5f3ff",
          border: "1px solid #ddd6fe",
          color: "#6d28d9",
        } as React.CSSProperties,
      };
    case "meeting":
      return {
        label: "Meeting",
        icon: <CalendarClock size={12} />,
        style: {
          ...base,
          background: "#ecfeff",
          border: "1px solid #a5f3fc",
          color: "#0f766e",
        } as React.CSSProperties,
      };
    case "sms":
      return {
        label: "SMS",
        icon: <MessageSquare size={12} />,
        style: {
          ...base,
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          color: "#c2410c",
        } as React.CSSProperties,
      };
    default:
      return {
        label: "Other",
        icon: <CircleDashed size={12} />,
        style: {
          ...base,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          color: "#475569",
        } as React.CSSProperties,
      };
  }
}

function getDueState(dueAt: string, status?: FollowUpStatus) {
  const dueDate = new Date(dueAt);
  const now = new Date();

  if (status === "completed") {
    return {
      isOverdue: false,
      label: "Already completed",
    };
  }

  if (Number.isNaN(dueDate.getTime())) {
    return {
      isOverdue: false,
      label: "Invalid due date",
    };
  }

  const diff = dueDate.getTime() - now.getTime();
  const absMinutes = Math.floor(Math.abs(diff) / (1000 * 60));
  const absHours = Math.floor(absMinutes / 60);
  const absDays = Math.floor(absHours / 24);

  if (diff < 0) {
    if (absDays >= 1) {
      return {
        isOverdue: true,
        label: `${absDays} day${absDays > 1 ? "s" : ""} overdue`,
      };
    }

    if (absHours >= 1) {
      return {
        isOverdue: true,
        label: `${absHours} hour${absHours > 1 ? "s" : ""} overdue`,
      };
    }

    return {
      isOverdue: true,
      label: `${absMinutes} minute${absMinutes > 1 ? "s" : ""} overdue`,
    };
  }

  if (absDays >= 1) {
    return {
      isOverdue: false,
      label: `Due in ${absDays} day${absDays > 1 ? "s" : ""}`,
    };
  }

  if (absHours >= 1) {
    return {
      isOverdue: false,
      label: `Due in ${absHours} hour${absHours > 1 ? "s" : ""}`,
    };
  }

  return {
    isOverdue: false,
    label: `Due in ${Math.max(absMinutes, 1)} minute${absMinutes > 1 ? "s" : ""}`,
  };
}

function getReminderLabel(reminderAt: string) {
  const reminderDate = new Date(reminderAt);
  if (Number.isNaN(reminderDate.getTime())) return "Invalid reminder time";

  const now = new Date();
  const diff = reminderDate.getTime() - now.getTime();

  if (diff < 0) return "Reminder time passed";

  const mins = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) return `Reminder in ${days} day${days > 1 ? "s" : ""}`;
  if (hours >= 1) return `Reminder in ${hours} hour${hours > 1 ? "s" : ""}`;
  return `Reminder in ${Math.max(mins, 1)} minute${mins > 1 ? "s" : ""}`;
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

function FlameIcon() {
  return <span style={{ fontSize: 12, lineHeight: 1 }}>🔥</span>;
}

export default memo(FollowUpCard);