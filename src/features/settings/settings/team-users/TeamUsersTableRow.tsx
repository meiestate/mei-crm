// src/features/settings/settings/team-users/TeamUsersTableRow.tsx

import type { CSSProperties, MouseEvent } from "react";
import { getTheme, type ThemeMode } from "../../../../theme";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";

export type TeamUsersTableRowItem = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  department?: string;
  status?: string;
  avatarUrl?: string;
  lastActiveAt?: string;
  joinedAt?: string;
  invitedAt?: string;
  isOwner?: boolean;
};

type TeamUsersTableRowProps = {
  user: TeamUsersTableRowItem;
  mode?: ThemeMode;
  selected?: boolean;
  onRowClick?: (user: TeamUsersTableRowItem) => void;
  onToggleSelect?: (userId: string) => void;
  onEdit?: (user: TeamUsersTableRowItem) => void;
  onDelete?: (user: TeamUsersTableRowItem) => void;
};

function formatDateTime(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeLabel(lastActiveAt?: string, status?: string): string {
  if (!lastActiveAt) {
    const normalized = (status ?? "").trim().toLowerCase();

    if (normalized === "invited") return "Invite pending";
    if (normalized === "inactive") return "Inactive";
    if (normalized === "suspended") return "Suspended";

    return "No activity";
  }

  const date = new Date(lastActiveAt);
  if (Number.isNaN(date.getTime())) return "No activity";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays < 30) return `${diffDays} day ago`;

  return formatDateTime(lastActiveAt);
}

function getInitials(name?: string): string {
  const value = (name ?? "").trim();
  if (!value) return "U";

  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export default function TeamUsersTableRow({
  user,
  mode = "light",
  selected = false,
  onRowClick,
  onToggleSelect,
  onEdit,
  onDelete,
}: TeamUsersTableRowProps) {
  const theme = getTheme(mode);

  const cellStyle: CSSProperties = {
    padding: "14px 12px",
    borderBottom: `1px solid ${theme.borderSoft}`,
    verticalAlign: "top",
  };

  const rowStyle: CSSProperties = {
    background: selected
      ? mode === "dark"
        ? "rgba(59,130,246,0.10)"
        : "rgba(59,130,246,0.06)"
      : theme.rowBg ?? theme.cardBg,
    cursor: onRowClick ? "pointer" : "default",
    transition: "background 0.18s ease",
  };

  const stopRowClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <tr
      onClick={() => onRowClick?.(user)}
      style={rowStyle}
    >
      <td
        style={{ ...cellStyle, width: 60 }}
        onClick={stopRowClick}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect?.(user.id)}
          style={{ cursor: "pointer" }}
          aria-label={`Select ${user.name}`}
        />
      </td>

      <td style={cellStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "48px 1fr",
            gap: 12,
            alignItems: "start",
          }}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                objectFit: "cover",
                border: `1px solid ${theme.border}`,
              }}
            />
          ) : (
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background:
                  mode === "dark"
                    ? "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.18))"
                    : "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
                border: `1px solid ${theme.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.text,
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              {getInitials(user.name)}
            </div>
          )}

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: theme.text,
                  lineHeight: 1.3,
                }}
              >
                {user.name}
              </div>

              {user.isOwner ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: 999,
                    padding: "4px 10px",
                    background: "rgba(245, 158, 11, 0.12)",
                    color: "#d97706",
                    border: "1px solid rgba(245, 158, 11, 0.24)",
                    fontSize: 11,
                    fontWeight: 900,
                  }}
                >
                  Owner
                </span>
              ) : null}
            </div>

            <div
              style={{
                fontSize: 13,
                color: theme.subText,
                marginTop: 4,
                wordBreak: "break-word",
              }}
            >
              {user.email}
            </div>

            {user.phone ? (
              <div
                style={{
                  fontSize: 12,
                  color: theme.mutedText,
                  marginTop: 6,
                }}
              >
                {user.phone}
              </div>
            ) : null}
          </div>
        </div>
      </td>

      <td style={cellStyle}>
        <RoleBadge role={user.role} mode={mode} />
      </td>

      <td style={cellStyle}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: theme.text,
          }}
        >
          {user.department || "—"}
        </div>
      </td>

      <td style={cellStyle}>
        <StatusBadge status={user.status} mode={mode} />
      </td>

      <td style={cellStyle}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: theme.text,
            marginBottom: 6,
          }}
        >
          {formatRelativeLabel(user.lastActiveAt, user.status)}
        </div>

        <div
          style={{
            fontSize: 12,
            color: theme.mutedText,
            lineHeight: 1.5,
          }}
        >
          Joined: {formatDateTime(user.joinedAt)}
        </div>

        {user.invitedAt ? (
          <div
            style={{
              fontSize: 12,
              color: theme.mutedText,
              lineHeight: 1.5,
            }}
          >
            Invited: {formatDateTime(user.invitedAt)}
          </div>
        ) : null}
      </td>

      <td
        style={{
          ...cellStyle,
          textAlign: "right",
        }}
        onClick={stopRowClick}
      >
        <div
          style={{
            display: "inline-flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(user)}
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.cardBgSoft,
                color: theme.text,
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Edit
            </button>
          ) : null}

          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(user)}
              style={{
                border: "none",
                background: theme.danger ?? "#dc2626",
                color: "#ffffff",
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          ) : null}
        </div>
      </td>
    </tr>
  );
}