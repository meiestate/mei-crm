// src/features/settings/settings/team-users/TeamUsersTable.tsx

import { getTheme, type ThemeMode } from "../../../../theme";
import BulkActionsBar from "./BulkActionsBar";
import EmptyUsersState from "./EmptyUsersState";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";

export type TeamUserRow = {
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

type TeamUsersTableProps = {
  users: TeamUserRow[];
  mode?: ThemeMode;
  loading?: boolean;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
  selectedIds?: string[];
  allVisibleSelected?: boolean;
  stickyHeader?: boolean;
  onRowClick?: (user: TeamUserRow) => void;
  onEdit?: (user: TeamUserRow) => void;
  onDelete?: (user: TeamUserRow) => void;
  onToggleSelect?: (userId: string) => void;
  onToggleSelectAllVisible?: () => void;
  onClearSelection?: () => void;
  onPageChange?: (page: number) => void;
  onInviteUser?: () => void;
  onResetFilters?: () => void;
  onExportSelected?: () => void;
  onUpdateSelected?: () => void;
  onDeleteSelected?: () => void;
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

function SkeletonRow({ mode }: { mode: ThemeMode }) {
  const theme = getTheme(mode);

  return (
    <tr>
      {Array.from({ length: 7 }).map((_, index) => (
        <td
          key={index}
          style={{
            padding: "14px 12px",
            borderBottom: `1px solid ${theme.borderSoft}`,
          }}
        >
          <div
            style={{
              height: 14,
              width: index === 1 ? "78%" : "56%",
              borderRadius: 999,
              background: theme.border,
            }}
          />
        </td>
      ))}
    </tr>
  );
}

function PaginationButton({
  label,
  disabled,
  onClick,
  mode,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  mode: ThemeMode;
}) {
  const theme = getTheme(mode);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        border: `1px solid ${theme.border}`,
        background: theme.cardBg,
        color: theme.text,
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 13,
        fontWeight: 800,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {label}
    </button>
  );
}

export default function TeamUsersTable({
  users,
  mode = "light",
  loading = false,
  page = 1,
  pageSize = 10,
  totalCount = 0,
  totalPages = 1,
  selectedIds = [],
  allVisibleSelected = false,
  stickyHeader = true,
  onRowClick,
  onEdit,
  onDelete,
  onToggleSelect,
  onToggleSelectAllVisible,
  onClearSelection,
  onPageChange,
  onInviteUser,
  onResetFilters,
  onExportSelected,
  onUpdateSelected,
  onDeleteSelected,
}: TeamUsersTableProps) {
  const theme = getTheme(mode);

  const headerCellStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "14px 12px",
    fontSize: 12,
    fontWeight: 900,
    color: theme.mutedText,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    borderBottom: `1px solid ${theme.border}`,
    background: theme.tableHeadBg ?? theme.cardBgSoft,
    position: stickyHeader ? "sticky" : "static",
    top: stickyHeader ? 0 : undefined,
    zIndex: stickyHeader ? 1 : undefined,
    whiteSpace: "nowrap",
  };

  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <section
      style={{
        display: "grid",
        gap: 14,
      }}
    >
      <BulkActionsBar
        selectedCount={selectedIds.length}
        mode={mode}
        itemLabel="users"
        primaryActionLabel="Export Selected"
        secondaryActionLabel="Update Selected"
        dangerActionLabel="Delete Selected"
        onPrimaryAction={onExportSelected}
        onSecondaryAction={onUpdateSelected}
        onDangerAction={onDeleteSelected}
        onClearSelection={onClearSelection}
      />

      <div
        style={{
          border: `1px solid ${theme.border}`,
          borderRadius: 22,
          overflow: "hidden",
          background: theme.cardBg,
          boxShadow:
            mode === "dark"
              ? "0 14px 34px rgba(0,0,0,0.26)"
              : "0 14px 34px rgba(15, 23, 42, 0.06)",
        }}
      >
        <div
          style={{
            padding: "16px 18px",
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            background:
              mode === "dark"
                ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))"
                : "linear-gradient(180deg, rgba(248,250,252,0.85), rgba(248,250,252,0.35))",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                color: theme.text,
                lineHeight: 1.2,
              }}
            >
              Team Members
            </div>
            <div
              style={{
                fontSize: 13,
                color: theme.subText,
                marginTop: 6,
              }}
            >
              {loading
                ? "Loading users..."
                : `Showing ${startItem}-${endItem} of ${totalCount} users`}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
                padding: "6px 12px",
                background: theme.cardBgSoft,
                border: `1px solid ${theme.border}`,
                color: theme.text,
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Page {page} / {Math.max(1, totalPages)}
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 1080,
                borderCollapse: "separate",
                borderSpacing: 0,
              }}
            >
              <thead>
                <tr>
                  <th style={headerCellStyle}>Select</th>
                  <th style={headerCellStyle}>User</th>
                  <th style={headerCellStyle}>Role</th>
                  <th style={headerCellStyle}>Department</th>
                  <th style={headerCellStyle}>Status</th>
                  <th style={headerCellStyle}>Last Active</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonRow key={index} mode={mode} />
                ))}
              </tbody>
            </table>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: 18 }}>
            <EmptyUsersState
              mode={mode}
              onAction={onInviteUser}
              onSecondaryAction={onResetFilters}
            />
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: 1080,
                  borderCollapse: "separate",
                  borderSpacing: 0,
                }}
              >
                <thead>
                  <tr>
                    <th style={{ ...headerCellStyle, width: 60 }}>
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={onToggleSelectAllVisible}
                        style={{ cursor: "pointer" }}
                      />
                    </th>
                    <th style={headerCellStyle}>User</th>
                    <th style={headerCellStyle}>Role</th>
                    <th style={headerCellStyle}>Department</th>
                    <th style={headerCellStyle}>Status</th>
                    <th style={headerCellStyle}>Last Active</th>
                    <th style={{ ...headerCellStyle, textAlign: "right" }}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const isSelected = selectedIds.includes(user.id);

                    return (
                      <tr
                        key={user.id}
                        onClick={() => onRowClick?.(user)}
                        style={{
                          background: isSelected
                            ? mode === "dark"
                              ? "rgba(59,130,246,0.10)"
                              : "rgba(59,130,246,0.06)"
                            : theme.rowBg ?? theme.cardBg,
                          cursor: onRowClick ? "pointer" : "default",
                        }}
                      >
                        <td
                          style={{
                            padding: "14px 12px",
                            borderBottom: `1px solid ${theme.borderSoft}`,
                            verticalAlign: "top",
                          }}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggleSelect?.(user.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>

                        <td
                          style={{
                            padding: "14px 12px",
                            borderBottom: `1px solid ${theme.borderSoft}`,
                            verticalAlign: "top",
                          }}
                        >
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

                        <td
                          style={{
                            padding: "14px 12px",
                            borderBottom: `1px solid ${theme.borderSoft}`,
                            verticalAlign: "top",
                          }}
                        >
                          <RoleBadge role={user.role} mode={mode} />
                        </td>

                        <td
                          style={{
                            padding: "14px 12px",
                            borderBottom: `1px solid ${theme.borderSoft}`,
                            verticalAlign: "top",
                          }}
                        >
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

                        <td
                          style={{
                            padding: "14px 12px",
                            borderBottom: `1px solid ${theme.borderSoft}`,
                            verticalAlign: "top",
                          }}
                        >
                          <StatusBadge status={user.status} mode={mode} />
                        </td>

                        <td
                          style={{
                            padding: "14px 12px",
                            borderBottom: `1px solid ${theme.borderSoft}`,
                            verticalAlign: "top",
                          }}
                        >
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
                            padding: "14px 12px",
                            borderBottom: `1px solid ${theme.borderSoft}`,
                            verticalAlign: "top",
                            textAlign: "right",
                          }}
                          onClick={(event) => event.stopPropagation()}
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
                  })}
                </tbody>
              </table>
            </div>

            <div
              style={{
                borderTop: `1px solid ${theme.border}`,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                background: theme.cardBg,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: theme.subText,
                }}
              >
                Showing {startItem}-{endItem} of {totalCount} users
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <PaginationButton
                  label="Prev"
                  mode={mode}
                  disabled={page <= 1}
                  onClick={() => onPageChange?.(page - 1)}
                />

                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: theme.text,
                    minWidth: 76,
                    textAlign: "center",
                  }}
                >
                  {page} / {Math.max(1, totalPages)}
                </span>

                <PaginationButton
                  label="Next"
                  mode={mode}
                  disabled={page >= totalPages}
                  onClick={() => onPageChange?.(page + 1)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}