import React from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type ContactHeaderCardData = {
  id: string;
  firstName: string;
  lastName?: string;
  company?: string;
  designation?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  alternatePhone?: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  leadSource?: string;
  status?: string;
  owner?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
};

type ContactHeaderCardProps = {
  mode: ThemeMode;
  contact: ContactHeaderCardData;
  onEdit?: () => void;
  onCall?: () => void;
  onEmail?: () => void;
  onWhatsapp?: () => void;
  onAddNote?: () => void;
  stats?: {
    totalActivities?: number;
    totalCalls?: number;
    totalMeetings?: number;
    totalTasks?: number;
  };
};

export default function ContactHeaderCard({
  mode,
  contact,
  onEdit,
  onCall,
  onEmail,
  onWhatsapp,
  onAddNote,
  stats,
}: ContactHeaderCardProps) {
  const theme = getTheme(mode);

  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(" ").trim() || "Unnamed Contact";
  const initials = getInitials(contact.firstName, contact.lastName);
  const location = [contact.city, contact.state, contact.country].filter(Boolean).join(", ");
  const lastUpdated = contact.updatedAt || contact.createdAt;

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          padding: "22px 24px",
          borderBottom: `1px solid ${theme.border}`,
          background:
            mode === "dark"
              ? "linear-gradient(135deg, rgba(59,130,246,0.10), rgba(168,85,247,0.08))"
              : "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(168,85,247,0.05))",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "88px 1fr auto",
            gap: 18,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: theme.primary,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 0.4,
              border: `3px solid ${theme.cardBg}`,
              boxShadow: "0 8px 22px rgba(0,0,0,0.14)",
            }}
          >
            {initials}
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 26,
                  lineHeight: 1.15,
                  fontWeight: 800,
                  color: theme.text,
                }}
              >
                {fullName}
              </h2>

              {contact.status ? (
                <Badge
                  label={contact.status}
                  tone={getStatusTone(contact.status)}
                  mode={mode}
                />
              ) : null}

              {contact.leadSource ? (
                <Badge
                  label={contact.leadSource}
                  tone="neutral"
                  mode={mode}
                />
              ) : null}
            </div>

            <p
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.6,
                color: theme.subText,
              }}
            >
              {[contact.designation, contact.company].filter(Boolean).join(" at ") || "Contact profile"}
            </p>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {contact.owner ? (
                <MetaPill mode={mode} label={`Owner: ${contact.owner}`} />
              ) : null}

              {location ? (
                <MetaPill mode={mode} label={`Location: ${location}`} />
              ) : null}

              {lastUpdated ? (
                <MetaPill mode={mode} label={`Updated: ${formatDateTime(lastUpdated)}`} />
              ) : null}
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
            {onEdit ? (
              <ActionButton
                label="Edit"
                icon="✏️"
                onClick={onEdit}
                mode={mode}
                variant="secondary"
              />
            ) : null}

            {onAddNote ? (
              <ActionButton
                label="Add Note"
                icon="📝"
                onClick={onAddNote}
                mode={mode}
                variant="secondary"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: 24,
          display: "grid",
          gap: 22,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 20,
          }}
        >
          <div
            style={{
              background: theme.cardBgSoft,
              border: `1px solid ${theme.border}`,
              borderRadius: 18,
              padding: 18,
            }}
          >
            <SectionTitle mode={mode} title="Contact Information" />

            <div style={{ display: "grid", gap: 12 }}>
              <InfoRow label="Phone" value={contact.phone} />
              <InfoRow label="WhatsApp" value={contact.whatsapp} />
              <InfoRow label="Alternate" value={contact.alternatePhone} />
              <InfoRow label="Email" value={contact.email} />
              <InfoRow label="Address" value={contact.address} />
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 18,
              }}
            >
              {onCall ? (
                <ActionButton
                  label="Call"
                  icon="📞"
                  onClick={onCall}
                  mode={mode}
                  variant="primary"
                />
              ) : null}

              {onWhatsapp ? (
                <ActionButton
                  label="WhatsApp"
                  icon="💬"
                  onClick={onWhatsapp}
                  mode={mode}
                  variant="secondary"
                />
              ) : null}

              {onEmail ? (
                <ActionButton
                  label="Email"
                  icon="✉️"
                  onClick={onEmail}
                  mode={mode}
                  variant="secondary"
                />
              ) : null}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 20,
            }}
          >
            <div
              style={{
                background: theme.cardBgSoft,
                border: `1px solid ${theme.border}`,
                borderRadius: 18,
                padding: 18,
              }}
            >
              <SectionTitle mode={mode} title="Profile Details" />

              <div style={{ display: "grid", gap: 12 }}>
                <InfoRow label="Company" value={contact.company} />
                <InfoRow label="Designation" value={contact.designation} />
                <InfoRow label="Lead Source" value={contact.leadSource} />
                <InfoRow label="Status" value={contact.status} />
                <InfoRow label="Created" value={contact.createdAt ? formatDateTime(contact.createdAt) : "-"} />
              </div>
            </div>

            <div
              style={{
                background: theme.cardBgSoft,
                border: `1px solid ${theme.border}`,
                borderRadius: 18,
                padding: 18,
              }}
            >
              <SectionTitle mode={mode} title="Quick Stats" />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 12,
                }}
              >
                <StatTile mode={mode} label="Activities" value={stats?.totalActivities ?? 0} />
                <StatTile mode={mode} label="Calls" value={stats?.totalCalls ?? 0} />
                <StatTile mode={mode} label="Meetings" value={stats?.totalMeetings ?? 0} />
                <StatTile mode={mode} label="Tasks" value={stats?.totalTasks ?? 0} />
              </div>
            </div>
          </div>
        </div>

        {contact.tags && contact.tags.length > 0 ? (
          <div
            style={{
              background: theme.cardBgSoft,
              border: `1px solid ${theme.border}`,
              borderRadius: 18,
              padding: 18,
            }}
          >
            <SectionTitle mode={mode} title="Tags" />
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {contact.tags.map((tag) => (
                <MetaPill key={tag} mode={mode} label={tag} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SectionTitle({
  mode,
  title,
}: {
  mode: ThemeMode;
  title: string;
}) {
  const theme = getTheme(mode);

  return (
    <h3
      style={{
        margin: "0 0 14px",
        fontSize: 15,
        fontWeight: 800,
        color: theme.text,
      }}
    >
      {title}
    </h3>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "110px 1fr",
        gap: 12,
        alignItems: "start",
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#64748b",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "inherit",
          wordBreak: "break-word",
        }}
      >
        {value?.trim() ? value : "-"}
      </span>
    </div>
  );
}

function StatTile({
  mode,
  label,
  value,
}: {
  mode: ThemeMode;
  label: string;
  value: number;
}) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        padding: 14,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: theme.subText,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: theme.text,
          lineHeight: 1,
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
        padding: "7px 11px",
        borderRadius: 999,
        background: theme.cardBgSoft,
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
  label,
  tone,
  mode,
}: {
  label: string;
  tone: "success" | "warning" | "danger" | "neutral";
  mode: ThemeMode;
}) {
  const palette = getBadgePalette(tone, mode);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        color: palette.text,
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      {label}
    </span>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  mode,
  variant,
}: {
  label: string;
  icon: string;
  onClick: () => void;
  mode: ThemeMode;
  variant: "primary" | "secondary";
}) {
  const theme = getTheme(mode);

  return (
    <button
      onClick={onClick}
      style={{
        height: 40,
        padding: "0 14px",
        borderRadius: 12,
        border: variant === "primary" ? "none" : `1px solid ${theme.border}`,
        background: variant === "primary" ? theme.primary : theme.cardBgSoft,
        color: variant === "primary" ? "#ffffff" : theme.text,
        fontSize: 13,
        fontWeight: 800,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.trim()?.charAt(0) || "";
  const last = lastName?.trim()?.charAt(0) || "";

  const value = `${first}${last}`.toUpperCase();
  return value || "C";
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

function getStatusTone(status: string): "success" | "warning" | "danger" | "neutral" {
  const normalized = status.toLowerCase();

  if (["active", "customer", "converted"].includes(normalized)) return "success";
  if (["prospect", "new", "follow-up"].includes(normalized)) return "warning";
  if (["inactive", "lost", "closed"].includes(normalized)) return "danger";
  return "neutral";
}

function getBadgePalette(
  tone: "success" | "warning" | "danger" | "neutral",
  mode: ThemeMode
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
    case "neutral":
    default:
      return {
        bg: isDark ? "rgba(148,163,184,0.14)" : "rgba(148,163,184,0.10)",
        border: isDark ? "rgba(148,163,184,0.28)" : "rgba(148,163,184,0.22)",
        text: "#475569",
      };
  }
}