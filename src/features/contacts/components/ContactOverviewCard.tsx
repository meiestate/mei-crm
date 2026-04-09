import React from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type ContactOverviewData = {
  id: string;
  firstName: string;
  lastName?: string;
  company?: string;
  designation?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  status?: string;
  leadSource?: string;
  owner?: string;
  createdAt?: string;
  updatedAt?: string;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  tags?: string[];
  notes?: string;
};

type ContactOverviewCardProps = {
  mode: ThemeMode;
  contact: ContactOverviewData;
  stats?: {
    totalActivities?: number;
    totalCalls?: number;
    totalEmails?: number;
    totalMeetings?: number;
    totalTasks?: number;
  };
  onEdit?: () => void;
  onAddTask?: () => void;
  onScheduleFollowUp?: () => void;
};

export default function ContactOverviewCard({
  mode,
  contact,
  stats,
  onEdit,
  onAddTask,
  onScheduleFollowUp,
}: ContactOverviewCardProps) {
  const theme = getTheme(mode);

  const fullName =
    [contact.firstName, contact.lastName].filter(Boolean).join(" ").trim() ||
    "Unnamed Contact";

  const location = [contact.city, contact.state, contact.country]
    .filter(Boolean)
    .join(", ");

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
          gap: 12,
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
            Overview
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: theme.subText,
              lineHeight: 1.6,
            }}
          >
            Quick summary of this contact profile, engagement, and follow-up
            snapshot.
          </p>
        </div>

        {onEdit ? (
          <button
            onClick={onEdit}
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.cardBgSoft,
              color: theme.text,
              borderRadius: 12,
              padding: "10px 14px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            Edit
          </button>
        ) : null}
      </div>

      <div
        style={{
          padding: 20,
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            background: theme.cardBgSoft,
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: theme.primary,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {getInitials(contact.firstName, contact.lastName)}
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: theme.text,
                  lineHeight: 1.2,
                }}
              >
                {fullName}
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  color: theme.subText,
                  lineHeight: 1.5,
                }}
              >
                {[contact.designation, contact.company]
                  .filter(Boolean)
                  .join(" at ") || "Contact profile"}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                {contact.status ? (
                  <Badge
                    label={contact.status}
                    mode={mode}
                    tone={getStatusTone(contact.status)}
                  />
                ) : null}

                {contact.leadSource ? (
                  <Badge label={contact.leadSource} mode={mode} tone="neutral" />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <InfoSection mode={mode} title="Profile Details">
          <InfoRow label="Company" value={contact.company} mode={mode} />
          <InfoRow label="Designation" value={contact.designation} mode={mode} />
          <InfoRow label="Owner" value={contact.owner} mode={mode} />
          <InfoRow label="Source" value={contact.leadSource} mode={mode} />
          <InfoRow label="Status" value={contact.status} mode={mode} />
        </InfoSection>

        <InfoSection mode={mode} title="Contact Info">
          <InfoRow label="Phone" value={contact.phone} mode={mode} />
          <InfoRow label="WhatsApp" value={contact.whatsapp} mode={mode} />
          <InfoRow label="Email" value={contact.email} mode={mode} />
          <InfoRow label="Location" value={location} mode={mode} />
          <InfoRow label="Address" value={contact.address} mode={mode} />
        </InfoSection>

        <InfoSection mode={mode} title="Timeline Snapshot">
          <InfoRow
            label="Created"
            value={contact.createdAt ? formatDateTime(contact.createdAt) : "-"}
            mode={mode}
          />
          <InfoRow
            label="Updated"
            value={contact.updatedAt ? formatDateTime(contact.updatedAt) : "-"}
            mode={mode}
          />
          <InfoRow
            label="Last Contact"
            value={
              contact.lastContactedAt
                ? formatDateTime(contact.lastContactedAt)
                : "-"
            }
            mode={mode}
          />
          <InfoRow
            label="Next Follow-up"
            value={
              contact.nextFollowUpAt
                ? formatDateTime(contact.nextFollowUpAt)
                : "-"
            }
            mode={mode}
          />
        </InfoSection>

        <div
          style={{
            background: theme.cardBgSoft,
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            padding: 16,
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
            <StatCard
              mode={mode}
              label="Activities"
              value={stats?.totalActivities ?? 0}
            />
            <StatCard mode={mode} label="Calls" value={stats?.totalCalls ?? 0} />
            <StatCard
              mode={mode}
              label="Emails"
              value={stats?.totalEmails ?? 0}
            />
            <StatCard
              mode={mode}
              label="Meetings"
              value={stats?.totalMeetings ?? 0}
            />
            <StatCard mode={mode} label="Tasks" value={stats?.totalTasks ?? 0} />
          </div>
        </div>

        {contact.tags && contact.tags.length > 0 ? (
          <div
            style={{
              background: theme.cardBgSoft,
              border: `1px solid ${theme.border}`,
              borderRadius: 18,
              padding: 16,
            }}
          >
            <SectionTitle mode={mode} title="Tags" />
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "7px 10px",
                    borderRadius: 999,
                    background: theme.cardBg,
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {contact.notes ? (
          <div
            style={{
              background: theme.cardBgSoft,
              border: `1px solid ${theme.border}`,
              borderRadius: 18,
              padding: 16,
            }}
          >
            <SectionTitle mode={mode} title="Notes Preview" />
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
              {contact.notes}
            </p>
          </div>
        ) : null}

        {(onAddTask || onScheduleFollowUp) && (
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {onAddTask ? (
              <ActionButton
                mode={mode}
                label="Add Task"
                icon="✅"
                variant="secondary"
                onClick={onAddTask}
              />
            ) : null}

            {onScheduleFollowUp ? (
              <ActionButton
                mode={mode}
                label="Schedule Follow-up"
                icon="📅"
                variant="primary"
                onClick={onScheduleFollowUp}
              />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

function InfoSection({
  mode,
  title,
  children,
}: {
  mode: ThemeMode;
  title: string;
  children: React.ReactNode;
}) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        background: theme.cardBgSoft,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: 16,
      }}
    >
      <SectionTitle mode={mode} title={title} />
      <div style={{ display: "grid", gap: 12 }}>{children}</div>
    </div>
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
    <h4
      style={{
        margin: "0 0 14px",
        fontSize: 15,
        fontWeight: 800,
        color: theme.text,
      }}
    >
      {title}
    </h4>
  );
}

function InfoRow({
  label,
  value,
  mode,
}: {
  label: string;
  value?: string;
  mode: ThemeMode;
}) {
  const theme = getTheme(mode);

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
          color: theme.subText,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: theme.text,
          lineHeight: 1.6,
          wordBreak: "break-word",
        }}
      >
        {value?.trim() ? value : "-"}
      </span>
    </div>
  );
}

function StatCard({
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
        borderRadius: 14,
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
          fontSize: 22,
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

function ActionButton({
  mode,
  label,
  icon,
  onClick,
  variant,
}: {
  mode: ThemeMode;
  label: string;
  icon: string;
  onClick: () => void;
  variant: "primary" | "secondary";
}) {
  const theme = getTheme(mode);

  return (
    <button
      onClick={onClick}
      style={{
        height: 42,
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

function Badge({
  label,
  mode,
  tone,
}: {
  label: string;
  mode: ThemeMode;
  tone: "success" | "warning" | "danger" | "neutral";
}) {
  const palette = getBadgePalette(mode, tone);

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

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.trim()?.charAt(0) || "";
  const last = lastName?.trim()?.charAt(0) || "";
  return `${first}${last}`.toUpperCase() || "C";
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

function getStatusTone(
  status: string
): "success" | "warning" | "danger" | "neutral" {
  const normalized = status.toLowerCase();

  if (["active", "customer", "converted"].includes(normalized)) return "success";
  if (["new", "prospect", "follow-up"].includes(normalized)) return "warning";
  if (["inactive", "lost", "closed"].includes(normalized)) return "danger";
  return "neutral";
}

function getBadgePalette(
  mode: ThemeMode,
  tone: "success" | "warning" | "danger" | "neutral"
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