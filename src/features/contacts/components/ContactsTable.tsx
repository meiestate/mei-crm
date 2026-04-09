import React from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";
import type { ContactHeaderCardData } from "./ContactHeaderCard";

export type ContactTableItem = ContactHeaderCardData & {
  createdAt?: string;
};

type ContactsTableProps = {
  mode: ThemeMode;
  contacts: ContactTableItem[];
  onRowClick?: (contact: ContactTableItem) => void;
  onEdit?: (contact: ContactTableItem) => void;
  onDelete?: (contact: ContactTableItem) => void;
  onCall?: (contact: ContactTableItem) => void;
  onWhatsapp?: (contact: ContactTableItem) => void;
};

export default function ContactsTable({
  mode,
  contacts,
  onRowClick,
  onEdit,
  onDelete,
  onCall,
  onWhatsapp,
}: ContactsTableProps) {
  const theme = getTheme(mode);

  if (!contacts.length) {
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
            minHeight: 320,
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
                width: 72,
                height: 72,
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
              👥
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              No contacts found
            </h3>

            <p
              style={{
                margin: "8px auto 0",
                maxWidth: 420,
                fontSize: 13,
                lineHeight: 1.7,
                color: theme.subText,
              }}
            >
              Once you add contacts, they will appear here in a clean searchable
              CRM table.
            </p>
          </div>
        </div>
      </section>
    );
  }

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
          overflowX: "auto",
          width: "100%",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            minWidth: 1180,
          }}
        >
          <thead>
            <tr
              style={{
                background: theme.tableHeadBg,
              }}
            >
              {[
                "Contact",
                "Company",
                "Phone",
                "Email",
                "Location",
                "Source",
                "Status",
                "Created",
                "Actions",
              ].map((label) => (
                <th
                  key={label}
                  style={{
                    textAlign: "left",
                    padding: "14px 16px",
                    fontSize: 12,
                    fontWeight: 800,
                    color: theme.subText,
                    letterSpacing: 0.4,
                    borderBottom: `1px solid ${theme.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {contacts.map((contact, index) => {
              const fullName =
                [contact.firstName, contact.lastName]
                  .filter(Boolean)
                  .join(" ")
                  .trim() || "Unnamed Contact";

              const companyText =
                [contact.designation, contact.company]
                  .filter(Boolean)
                  .join(" • ") || "-";

              const location =
                [contact.city, contact.state, contact.country]
                  .filter(Boolean)
                  .join(", ") || "-";

              return (
                <tr
                  key={contact.id}
                  onClick={() => onRowClick?.(contact)}
                  style={{
                    cursor: onRowClick ? "pointer" : "default",
                    background: index % 2 === 0 ? theme.rowBg : theme.cardBg,
                  }}
                >
                  <td
                    style={{
                      padding: "16px",
                      borderBottom: `1px solid ${theme.borderSoft ?? theme.border}`,
                      verticalAlign: "middle",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        minWidth: 240,
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          background: theme.primary,
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(contact.firstName, contact.lastName)}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: theme.text,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {fullName}
                        </div>

                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: theme.subText,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {contact.owner ? `Owner: ${contact.owner}` : "No owner assigned"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td
                    style={cellStyle(theme)}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: theme.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 180,
                      }}
                    >
                      {contact.company || "-"}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 12,
                        color: theme.subText,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 180,
                      }}
                    >
                      {contact.designation || companyText}
                    </div>
                  </td>

                  <td style={cellStyle(theme)}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: theme.text,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {contact.phone || "-"}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 12,
                        color: theme.subText,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {contact.whatsapp ? `WA: ${contact.whatsapp}` : "No WhatsApp"}
                    </div>
                  </td>

                  <td style={cellStyle(theme)}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: theme.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 220,
                      }}
                      title={contact.email || "-"}
                    >
                      {contact.email || "-"}
                    </div>
                  </td>

                  <td style={cellStyle(theme)}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: theme.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 160,
                      }}
                      title={location}
                    >
                      {location}
                    </div>
                  </td>

                  <td style={cellStyle(theme)}>
                    {contact.leadSource ? (
                      <Badge label={contact.leadSource} mode={mode} tone="neutral" />
                    ) : (
                      <span
                        style={{
                          fontSize: 13,
                          color: theme.subText,
                        }}
                      >
                        -
                      </span>
                    )}
                  </td>

                  <td style={cellStyle(theme)}>
                    {contact.status ? (
                      <Badge
                        label={contact.status}
                        mode={mode}
                        tone={getStatusTone(contact.status)}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: 13,
                          color: theme.subText,
                        }}
                      >
                        -
                      </span>
                    )}
                  </td>

                  <td style={cellStyle(theme)}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: theme.text,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {contact.createdAt ? formatDate(contact.createdAt) : "-"}
                    </div>
                  </td>

                  <td
                    style={{
                      ...cellStyle(theme),
                      width: 1,
                      whiteSpace: "nowrap",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {onCall ? (
                        <IconButton
                          label="Call"
                          icon="📞"
                          mode={mode}
                          onClick={() => onCall(contact)}
                        />
                      ) : null}

                      {onWhatsapp ? (
                        <IconButton
                          label="WhatsApp"
                          icon="💬"
                          mode={mode}
                          onClick={() => onWhatsapp(contact)}
                        />
                      ) : null}

                      {onEdit ? (
                        <IconButton
                          label="Edit"
                          icon="✏️"
                          mode={mode}
                          onClick={() => onEdit(contact)}
                        />
                      ) : null}

                      {onDelete ? (
                        <IconButton
                          label="Delete"
                          icon="🗑️"
                          mode={mode}
                          onClick={() => onDelete(contact)}
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function cellStyle(theme: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    padding: "16px",
    borderBottom: `1px solid ${theme.borderSoft ?? theme.border}`,
    verticalAlign: "middle",
  };
}

function IconButton({
  label,
  icon,
  mode,
  onClick,
}: {
  label: string;
  icon: string;
  mode: ThemeMode;
  onClick: () => void;
}) {
  const theme = getTheme(mode);

  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      style={{
        height: 34,
        minWidth: 34,
        padding: "0 10px",
        borderRadius: 10,
        border: `1px solid ${theme.border}`,
        background: theme.cardBgSoft,
        color: theme.text,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      <span>{icon}</span>
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
        whiteSpace: "nowrap",
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

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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