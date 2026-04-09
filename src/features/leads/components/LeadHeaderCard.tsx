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

export type LeadHeaderLead = {
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
  notes?: string;
};

type LeadHeaderCardProps = {
  lead: LeadHeaderLead;
  onBack?: () => void;
  onEdit?: () => void;
  onCall?: () => void;
  onEmail?: () => void;
  onWhatsApp?: () => void;
};

export default function LeadHeaderCard({
  lead,
  onBack,
  onEdit,
  onCall,
  onEmail,
  onWhatsApp,
}: LeadHeaderCardProps) {
  const statusStyle = getStatusStyle(lead.status);
  const priorityStyle = getPriorityStyle(lead.priority);
  const sourceStyle = getSourceStyle(lead.source);

  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, #ffffff 0%, #f8fafc 55%, #eef2ff 100%)",
        border: "1px solid #e2e8f0",
        borderRadius: 24,
        padding: 24,
        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 22,
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
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flex: 1 }}>
          <div
            style={{
              width: 64,
              height: 64,
              minWidth: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 800,
              boxShadow: "0 10px 24px rgba(15, 23, 42, 0.22)",
            }}
          >
            {getInitials(lead.name)}
          </div>

          <div style={{ minWidth: 240, flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 28,
                  lineHeight: 1.15,
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.03em",
                }}
              >
                {lead.name || "Untitled Lead"}
              </h1>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#475569",
                  background: "#e2e8f0",
                  padding: "6px 10px",
                  borderRadius: 999,
                }}
              >
                {lead.id}
              </span>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              {lead.project || "No project specified"} • {lead.location || "No location specified"}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 14,
              }}
            >
              <Badge label={lead.status} style={statusStyle} />
              <Badge label={`${lead.priority} Priority`} style={priorityStyle} />
              <Badge label={lead.source} style={sourceStyle} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {onBack ? (
            <button type="button" onClick={onBack} style={secondaryButtonStyle}>
              ← Back
            </button>
          ) : null}

          {onEdit ? (
            <button type="button" onClick={onEdit} style={primaryButtonStyle}>
              Edit Lead
            </button>
          ) : null}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
        }}
      >
        <InfoCard
          label="Phone"
          value={lead.phone || "Not available"}
          accent="linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
        />
        <InfoCard
          label="Email"
          value={lead.email || "Not available"}
          accent="linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)"
        />
        <InfoCard
          label="Budget"
          value={lead.budget || "Not specified"}
          accent="linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
        />
        <InfoCard
          label="Assigned To"
          value={lead.assignedTo || "Unassigned"}
          accent="linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
        }}
      >
        <MetaItem label="Follow Up Date" value={formatDate(lead.followUpDate)} />
        <MetaItem label="Created At" value={formatDateTime(lead.createdAt)} />
        <MetaItem label="Last Updated" value={formatDateTime(lead.updatedAt)} />
      </div>

      <div
        style={{
          borderTop: "1px solid #e2e8f0",
          paddingTop: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              color: "#64748b",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Quick Actions
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#334155",
            }}
          >
            Reach the lead fast and keep momentum alive.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onCall}
            style={quickActionButtonStyle}
          >
            📞 Call
          </button>

          <button
            type="button"
            onClick={onEmail}
            style={quickActionButtonStyle}
          >
            ✉️ Email
          </button>

          <button
            type="button"
            onClick={onWhatsApp}
            style={quickActionButtonStyle}
          >
            💬 WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        padding: 16,
        background: accent,
        minHeight: 88,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#475569",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 8,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#0f172a",
          lineHeight: 1.4,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MetaItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#0f172a",
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
        padding: "7px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: "0.02em",
        ...style,
      }}
    >
      {label}
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

function getStatusStyle(status: LeadStatus): React.CSSProperties {
  switch (status) {
    case "New":
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    case "Contacted":
      return {
        background: "#ede9fe",
        color: "#6d28d9",
      };
    case "Qualified":
      return {
        background: "#dcfce7",
        color: "#15803d",
      };
    case "Site Visit":
      return {
        background: "#fef3c7",
        color: "#b45309",
      };
    case "Negotiation":
      return {
        background: "#fde68a",
        color: "#92400e",
      };
    case "Won":
      return {
        background: "#bbf7d0",
        color: "#166534",
      };
    case "Lost":
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };
    default:
      return {
        background: "#e2e8f0",
        color: "#334155",
      };
  }
}

function getPriorityStyle(priority: LeadPriority): React.CSSProperties {
  switch (priority) {
    case "High":
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };
    case "Medium":
      return {
        background: "#fef3c7",
        color: "#b45309",
      };
    case "Low":
      return {
        background: "#dcfce7",
        color: "#15803d",
      };
    default:
      return {
        background: "#e2e8f0",
        color: "#334155",
      };
  }
}

function getSourceStyle(source: LeadSource): React.CSSProperties {
  switch (source) {
    case "Website":
      return {
        background: "#e0f2fe",
        color: "#0369a1",
      };
    case "Facebook":
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    case "Instagram":
      return {
        background: "#fce7f3",
        color: "#be185d",
      };
    case "WhatsApp":
      return {
        background: "#dcfce7",
        color: "#15803d",
      };
    case "Referral":
      return {
        background: "#ede9fe",
        color: "#6d28d9",
      };
    case "Walk-in":
      return {
        background: "#fff7ed",
        color: "#c2410c",
      };
    case "Call":
      return {
        background: "#ecfeff",
        color: "#0f766e",
      };
    case "Broker":
      return {
        background: "#f3e8ff",
        color: "#7e22ce",
      };
    default:
      return {
        background: "#e2e8f0",
        color: "#475569",
      };
  }
}

const primaryButtonStyle: React.CSSProperties = {
  height: 42,
  padding: "0 16px",
  borderRadius: 12,
  border: "none",
  background: "#0f172a",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(15, 23, 42, 0.18)",
};

const secondaryButtonStyle: React.CSSProperties = {
  height: 42,
  padding: "0 16px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

const quickActionButtonStyle: React.CSSProperties = {
  height: 42,
  padding: "0 16px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};