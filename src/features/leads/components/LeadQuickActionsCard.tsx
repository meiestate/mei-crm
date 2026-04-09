import React from "react";

export type LeadQuickActionStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Site Visit"
  | "Negotiation"
  | "Won"
  | "Lost";

export type LeadQuickActionLead = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  status: LeadQuickActionStatus;
  followUpDate?: string;
};

type LeadQuickActionsCardProps = {
  lead: LeadQuickActionLead;
  onCall?: () => void;
  onEmail?: () => void;
  onWhatsApp?: () => void;
  onScheduleFollowUp?: () => void;
  onAddNote?: () => void;
  onCreateTask?: () => void;
  onConvertToDeal?: () => void;
  onMarkWon?: () => void;
  onMarkLost?: () => void;
  onEditLead?: () => void;
  onDeleteLead?: () => void;
};

export default function LeadQuickActionsCard({
  lead,
  onCall,
  onEmail,
  onWhatsApp,
  onScheduleFollowUp,
  onAddNote,
  onCreateTask,
  onConvertToDeal,
  onMarkWon,
  onMarkLost,
  onEditLead,
  onDeleteLead,
}: LeadQuickActionsCardProps) {
  const phoneAvailable = Boolean(lead.phone?.trim());
  const emailAvailable = Boolean(lead.email?.trim());
  const canConvert = !["Won", "Lost"].includes(lead.status);
  const canMarkWon = lead.status !== "Won";
  const canMarkLost = lead.status !== "Lost";

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
      <div>
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Quick Actions
        </h3>

        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            color: "#64748b",
            lineHeight: 1.6,
          }}
        >
          Move fast. Reach the lead, update the journey, and keep the pipeline alive.
        </p>
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
          Contact Actions
        </div>

        <div style={gridStyle}>
          <ActionButton
            label="Call Lead"
            subtext={phoneAvailable ? lead.phone || "" : "Phone not available"}
            icon="📞"
            onClick={onCall}
            disabled={!phoneAvailable}
          />
          <ActionButton
            label="Send Email"
            subtext={emailAvailable ? lead.email || "" : "Email not available"}
            icon="✉️"
            onClick={onEmail}
            disabled={!emailAvailable}
          />
          <ActionButton
            label="WhatsApp"
            subtext={phoneAvailable ? "Start instant chat" : "Phone not available"}
            icon="💬"
            onClick={onWhatsApp}
            disabled={!phoneAvailable}
          />
        </div>
      </div>

      <div
        style={{
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
          Workflow Actions
        </div>

        <div style={gridStyle}>
          <ActionButton
            label="Schedule Follow-Up"
            subtext={
              lead.followUpDate
                ? `Current: ${formatDate(lead.followUpDate)}`
                : "No follow-up scheduled"
            }
            icon="🗓️"
            onClick={onScheduleFollowUp}
          />

          <ActionButton
            label="Add Note"
            subtext="Capture key insight or objection"
            icon="📝"
            onClick={onAddNote}
          />

          <ActionButton
            label="Create Task"
            subtext="Assign action item for this lead"
            icon="✅"
            onClick={onCreateTask}
          />

          <ActionButton
            label="Convert to Deal"
            subtext={canConvert ? "Push into deal pipeline" : "Already closed"}
            icon="💼"
            onClick={onConvertToDeal}
            disabled={!canConvert}
          />
        </div>
      </div>

      <div
        style={{
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
          Outcome Actions
        </div>

        <div style={gridStyle}>
          <ActionButton
            label="Mark as Won"
            subtext={canMarkWon ? "Close this lead positively" : "Already won"}
            icon="🏆"
            onClick={onMarkWon}
            disabled={!canMarkWon}
            tone="success"
          />

          <ActionButton
            label="Mark as Lost"
            subtext={canMarkLost ? "Close this lead as lost" : "Already lost"}
            icon="📉"
            onClick={onMarkLost}
            disabled={!canMarkLost}
            tone="danger"
          />
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #e2e8f0",
          paddingTop: 16,
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
          Manage Lead
        </div>

        <div style={gridStyle}>
          <ActionButton
            label="Edit Lead"
            subtext="Update lead details"
            icon="✏️"
            onClick={onEditLead}
          />

          <ActionButton
            label="Delete Lead"
            subtext="Remove this lead carefully"
            icon="🗑️"
            onClick={onDeleteLead}
            tone="danger"
          />
        </div>
      </div>
    </section>
  );
}

type ActionButtonProps = {
  label: string;
  subtext: string;
  icon: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "default" | "success" | "danger";
};

function ActionButton({
  label,
  subtext,
  icon,
  onClick,
  disabled = false,
  tone = "default",
}: ActionButtonProps) {
  const toneStyles = getToneStyles(tone, disabled);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        textAlign: "left",
        borderRadius: 18,
        border: `1px solid ${toneStyles.border}`,
        background: toneStyles.background,
        padding: 16,
        minHeight: 96,
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          minWidth: 42,
          borderRadius: 14,
          background: toneStyles.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
        }}
      >
        {icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: toneStyles.title,
            marginBottom: 6,
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: toneStyles.subtext,
            wordBreak: "break-word",
          }}
        >
          {subtext}
        </div>
      </div>
    </button>
  );
}

function getToneStyles(
  tone: "default" | "success" | "danger",
  disabled: boolean
) {
  if (disabled) {
    return {
      background: "#f8fafc",
      border: "#e2e8f0",
      iconBg: "#e2e8f0",
      title: "#94a3b8",
      subtext: "#94a3b8",
    };
  }

  switch (tone) {
    case "success":
      return {
        background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
        border: "#86efac",
        iconBg: "#bbf7d0",
        title: "#166534",
        subtext: "#15803d",
      };

    case "danger":
      return {
        background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
        border: "#fecdd3",
        iconBg: "#fecdd3",
        title: "#b91c1c",
        subtext: "#be123c",
      };

    default:
      return {
        background: "#ffffff",
        border: "#e2e8f0",
        iconBg: "#f1f5f9",
        title: "#0f172a",
        subtext: "#64748b",
      };
  }
}

function formatDate(value?: string) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};