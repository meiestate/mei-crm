import React from "react";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Site Visit"
  | "Negotiation"
  | "Won"
  | "Lost";

export type LeadPriority = "Low" | "Medium" | "High";

export type LeadSource =
  | "Website"
  | "Facebook"
  | "Instagram"
  | "WhatsApp"
  | "Referral"
  | "Walk-in"
  | "Call"
  | "Broker"
  | "Other";

export type LeadTableItem = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  project?: string;
  location?: string;
  budget?: string;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  assignedTo?: string;
  followUpDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

type LeadTableProps = {
  leads: LeadTableItem[];
  loading?: boolean;
  onRowClick?: (lead: LeadTableItem) => void;
  onEdit?: (lead: LeadTableItem) => void;
  onDelete?: (lead: LeadTableItem) => void;
  onCall?: (lead: LeadTableItem) => void;
  onEmail?: (lead: LeadTableItem) => void;
  onWhatsApp?: (lead: LeadTableItem) => void;
};

export default function LeadTable({
  leads,
  loading = false,
  onRowClick,
  onEdit,
  onDelete,
  onCall,
  onEmail,
  onWhatsApp,
}: LeadTableProps) {
  if (loading) {
    return (
      <div style={wrapperStyle}>
        <div style={loadingStateStyle}>Loading leads...</div>
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div style={wrapperStyle}>
        <div style={emptyStateStyle}>
          <div style={emptyTitleStyle}>No leads found</div>
          <div style={emptyTextStyle}>
            There are no leads to display right now. Add a new lead or adjust
            your filters.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <div style={tableScrollStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Lead</th>
              <th style={thStyle}>Project</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Budget</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Priority</th>
              <th style={thStyle}>Source</th>
              <th style={thStyle}>Assigned To</th>
              <th style={thStyle}>Follow Up</th>
              <th style={thStyle}>Created</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onRowClick?.(lead)}
                style={{
                  ...trStyle,
                  cursor: onRowClick ? "pointer" : "default",
                }}
              >
                <td style={tdStyle}>
                  <div style={leadCellStyle}>
                    <div style={avatarStyle}>{getInitials(lead.name)}</div>

                    <div style={{ minWidth: 0 }}>
                      <div style={leadNameStyle}>{lead.name || "Untitled Lead"}</div>
                      <div style={leadSubTextStyle}>{lead.id}</div>
                      {lead.phone ? (
                        <div style={leadMetaTextStyle}>{lead.phone}</div>
                      ) : null}
                      {lead.email ? (
                        <div style={leadMetaTextStyle}>{lead.email}</div>
                      ) : null}
                    </div>
                  </div>
                </td>

                <td style={tdStyle}>
                  <div style={primaryTextStyle}>
                    {lead.project || "Not specified"}
                  </div>
                </td>

                <td style={tdStyle}>
                  <div style={primaryTextStyle}>
                    {lead.location || "Not specified"}
                  </div>
                </td>

                <td style={tdStyle}>
                  <div style={primaryTextStyle}>
                    {lead.budget || "Not specified"}
                  </div>
                </td>

                <td style={tdStyle}>
                  <LeadStatusBadge status={lead.status} />
                </td>

                <td style={tdStyle}>
                  <LeadPriorityBadge priority={lead.priority} />
                </td>

                <td style={tdStyle}>
                  <LeadSourceBadge source={lead.source} />
                </td>

                <td style={tdStyle}>
                  <div style={primaryTextStyle}>
                    {lead.assignedTo || "Unassigned"}
                  </div>
                </td>

                <td style={tdStyle}>
                  <div style={primaryTextStyle}>
                    {formatDate(lead.followUpDate)}
                  </div>
                  {lead.followUpDate ? (
                    <div style={secondaryTextStyle}>
                      {getFollowUpHint(lead.followUpDate)}
                    </div>
                  ) : null}
                </td>

                <td style={tdStyle}>
                  <div style={primaryTextStyle}>{formatDate(lead.createdAt)}</div>
                </td>

                <td
                  style={{ ...tdStyle, textAlign: "right" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={actionsWrapStyle}>
                    <ActionButton
                      label="Call"
                      onClick={() => onCall?.(lead)}
                      disabled={!lead.phone}
                    />
                    <ActionButton
                      label="Email"
                      onClick={() => onEmail?.(lead)}
                      disabled={!lead.email}
                    />
                    <ActionButton
                      label="WA"
                      onClick={() => onWhatsApp?.(lead)}
                      disabled={!lead.phone}
                    />
                    <ActionButton
                      label="Edit"
                      onClick={() => onEdit?.(lead)}
                    />
                    <ActionButton
                      label="Delete"
                      onClick={() => onDelete?.(lead)}
                      tone="danger"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled = false,
  tone = "default",
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...actionButtonStyle,
        ...(tone === "danger" ? dangerActionButtonStyle : {}),
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}

function LeadStatusBadge({ status }: { status: LeadStatus | string }) {
  const styles = getStatusStyles(status);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        minWidth: 96,
        padding: "8px 12px",
        borderRadius: 999,
        border: `1px solid ${styles.border}`,
        background: styles.background,
        color: styles.color,
        fontSize: 12,
        fontWeight: 800,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: styles.dot,
          flexShrink: 0,
        }}
      />
      <span>{status}</span>
    </span>
  );
}

function LeadPriorityBadge({ priority }: { priority: LeadPriority | string }) {
  const styles = getPriorityStyles(priority);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 84,
        padding: "8px 12px",
        borderRadius: 999,
        border: `1px solid ${styles.border}`,
        background: styles.background,
        color: styles.color,
        fontSize: 12,
        fontWeight: 800,
        whiteSpace: "nowrap",
      }}
    >
      {priority}
    </span>
  );
}

function LeadSourceBadge({ source }: { source: LeadSource | string }) {
  const styles = getSourceStyles(source);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 90,
        padding: "8px 12px",
        borderRadius: 999,
        border: `1px solid ${styles.border}`,
        background: styles.background,
        color: styles.color,
        fontSize: 12,
        fontWeight: 800,
        whiteSpace: "nowrap",
      }}
    >
      {source}
    </span>
  );
}

function getInitials(name: string) {
  if (!name?.trim()) return "L";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
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

function getFollowUpHint(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();

  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} day(s) overdue`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `In ${diffDays} days`;
}

function getStatusStyles(status: string) {
  switch (status) {
    case "New":
      return {
        background: "#eff6ff",
        color: "#1d4ed8",
        border: "#bfdbfe",
        dot: "#2563eb",
      };
    case "Contacted":
      return {
        background: "#f5f3ff",
        color: "#7c3aed",
        border: "#ddd6fe",
        dot: "#8b5cf6",
      };
    case "Qualified":
      return {
        background: "#ecfdf5",
        color: "#15803d",
        border: "#bbf7d0",
        dot: "#16a34a",
      };
    case "Site Visit":
      return {
        background: "#fff7ed",
        color: "#c2410c",
        border: "#fdba74",
        dot: "#ea580c",
      };
    case "Negotiation":
      return {
        background: "#fffbeb",
        color: "#a16207",
        border: "#fde68a",
        dot: "#ca8a04",
      };
    case "Won":
      return {
        background: "#dcfce7",
        color: "#166534",
        border: "#86efac",
        dot: "#16a34a",
      };
    case "Lost":
      return {
        background: "#fef2f2",
        color: "#b91c1c",
        border: "#fecaca",
        dot: "#dc2626",
      };
    default:
      return {
        background: "#f8fafc",
        color: "#475569",
        border: "#cbd5e1",
        dot: "#64748b",
      };
  }
}

function getPriorityStyles(priority: string) {
  switch (priority) {
    case "High":
      return {
        background: "#fef2f2",
        color: "#b91c1c",
        border: "#fecaca",
      };
    case "Medium":
      return {
        background: "#fffbeb",
        color: "#a16207",
        border: "#fde68a",
      };
    case "Low":
      return {
        background: "#ecfdf5",
        color: "#15803d",
        border: "#bbf7d0",
      };
    default:
      return {
        background: "#f8fafc",
        color: "#475569",
        border: "#cbd5e1",
      };
  }
}

function getSourceStyles(source: string) {
  switch (source) {
    case "Website":
      return {
        background: "#eff6ff",
        color: "#1d4ed8",
        border: "#bfdbfe",
      };
    case "Facebook":
      return {
        background: "#eef2ff",
        color: "#4338ca",
        border: "#c7d2fe",
      };
    case "Instagram":
      return {
        background: "#fdf2f8",
        color: "#be185d",
        border: "#fbcfe8",
      };
    case "WhatsApp":
      return {
        background: "#ecfdf5",
        color: "#15803d",
        border: "#bbf7d0",
      };
    case "Referral":
      return {
        background: "#f5f3ff",
        color: "#7c3aed",
        border: "#ddd6fe",
      };
    case "Walk-in":
      return {
        background: "#fff7ed",
        color: "#c2410c",
        border: "#fdba74",
      };
    case "Call":
      return {
        background: "#ecfeff",
        color: "#0f766e",
        border: "#a5f3fc",
      };
    case "Broker":
      return {
        background: "#faf5ff",
        color: "#7e22ce",
        border: "#e9d5ff",
      };
    default:
      return {
        background: "#f8fafc",
        color: "#475569",
        border: "#cbd5e1",
      };
  }
}

const wrapperStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 22,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

const tableScrollStyle: React.CSSProperties = {
  width: "100%",
  overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 1380,
  borderCollapse: "separate",
  borderSpacing: 0,
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "16px 18px",
  fontSize: 12,
  fontWeight: 800,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  background: "#f8fafc",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
  position: "sticky",
  top: 0,
  zIndex: 1,
};

const trStyle: React.CSSProperties = {
  transition: "background 0.2s ease",
};

const tdStyle: React.CSSProperties = {
  padding: "16px 18px",
  borderBottom: "1px solid #f1f5f9",
  verticalAlign: "top",
  background: "#ffffff",
};

const leadCellStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  minWidth: 220,
};

const avatarStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  minWidth: 42,
  borderRadius: 14,
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  fontWeight: 800,
};

const leadNameStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: "#0f172a",
  lineHeight: 1.4,
  marginBottom: 4,
};

const leadSubTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  marginBottom: 4,
};

const leadMetaTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#475569",
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const primaryTextStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#0f172a",
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const secondaryTextStyle: React.CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.4,
};

const actionsWrapStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  flexWrap: "wrap",
  gap: 8,
  minWidth: 250,
};

const actionButtonStyle: React.CSSProperties = {
  height: 32,
  padding: "0 12px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 12,
  fontWeight: 700,
};

const dangerActionButtonStyle: React.CSSProperties = {
  background: "#fff1f2",
  border: "1px solid #fecdd3",
  color: "#b91c1c",
};

const loadingStateStyle: React.CSSProperties = {
  padding: "36px 20px",
  textAlign: "center",
  fontSize: 14,
  fontWeight: 700,
  color: "#64748b",
};

const emptyStateStyle: React.CSSProperties = {
  padding: "48px 24px",
  textAlign: "center",
};

const emptyTitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "#0f172a",
  marginBottom: 8,
};

const emptyTextStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: "#64748b",
  maxWidth: 440,
  margin: "0 auto",
};