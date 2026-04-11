import type { CSSProperties } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Invited" | "Inactive";
  lastActive: string;
};

type TeamRolesCardProps = {
  mode?: ThemeMode;
  members: TeamMember[];
  onInviteUser?: () => void;
  onOpenRolesPermissions?: () => void;
  onEditMember?: (member: TeamMember) => void;
  onDeactivateMember?: (member: TeamMember) => void;
  onResendInvite?: (member: TeamMember) => void;
};

export default function TeamRolesCard({
  mode = "light",
  members,
  onInviteUser,
  onOpenRolesPermissions,
  onEditMember,
  onDeactivateMember,
  onResendInvite,
}: TeamRolesCardProps) {
  const theme = getTheme(mode);

  const activeCount = members.filter((member) => member.status === "Active").length;
  const invitedCount = members.filter((member) => member.status === "Invited").length;
  const inactiveCount = members.filter((member) => member.status === "Inactive").length;

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 20,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          Team & Roles
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.6,
            color: theme.subText,
          }}
        >
          Manage workspace members, invitations, roles, departments, and access visibility.
        </div>
      </div>

      <div style={statsGridStyle}>
        <InfoCard title="Total Members" value={String(members.length)} theme={theme} />
        <InfoCard title="Active Users" value={String(activeCount)} theme={theme} />
        <InfoCard title="Pending Invites" value={String(invitedCount)} theme={theme} />
        <InfoCard title="Inactive Users" value={String(inactiveCount)} theme={theme} />
      </div>

      <div style={toolbarStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: theme.text,
            }}
          >
            Team Directory
          </div>
          <div
            style={{
              fontSize: 12,
              color: theme.subText,
            }}
          >
            View and manage all users in your workspace.
          </div>
        </div>

        <div style={actionsRowStyle}>
          <button
            type="button"
            onClick={onInviteUser}
            style={primaryButtonStyle(theme)}
          >
            Invite New User
          </button>

          <button
            type="button"
            onClick={onOpenRolesPermissions}
            style={secondaryButtonStyle(theme)}
          >
            Roles & Permissions
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          overflowX: "auto",
          border: `1px solid ${theme.border}`,
          borderRadius: 16,
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: 980,
            borderCollapse: "collapse",
          }}
        >
          <thead
            style={{
              background: theme.tableHeadBg,
            }}
          >
            <tr>
              {[
                "Name",
                "Email",
                "Role",
                "Department",
                "Status",
                "Last Active",
                "Actions",
              ].map((column) => (
                <th
                  key={column}
                  style={{
                    textAlign: "left",
                    padding: "14px 16px",
                    fontSize: 12,
                    fontWeight: 800,
                    color: theme.subText,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    borderBottom: `1px solid ${theme.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {members.length > 0 ? (
              members.map((member) => (
                <tr
                  key={member.id}
                  style={{
                    background: theme.rowBg,
                  }}
                >
                  <td style={cellStyle(theme)}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: theme.cardBgSoft,
                          border: `1px solid ${theme.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 800,
                          color: theme.text,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(member.name)}
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: theme.text,
                          }}
                        >
                          {member.name}
                        </div>
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: theme.subText,
                          }}
                        >
                          ID: {member.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={cellStyle(theme)}>
                    <span style={{ color: theme.text }}>{member.email}</span>
                  </td>

                  <td style={cellStyle(theme)}>
                    <RoleBadge role={member.role} theme={theme} />
                  </td>

                  <td style={cellStyle(theme)}>{member.department}</td>

                  <td style={cellStyle(theme)}>
                    <StatusBadge
                      label={member.status}
                      tone={
                        member.status === "Active"
                          ? "success"
                          : member.status === "Invited"
                          ? "warning"
                          : "danger"
                      }
                      theme={theme}
                    />
                  </td>

                  <td style={cellStyle(theme)}>{member.lastActive}</td>

                  <td style={cellStyle(theme)}>
                    <div style={rowActionsStyle}>
                      <button
                        type="button"
                        onClick={() => onEditMember?.(member)}
                        style={miniButtonStyle(theme)}
                      >
                        Edit
                      </button>

                      {member.status === "Invited" ? (
                        <button
                          type="button"
                          onClick={() => onResendInvite?.(member)}
                          style={miniButtonStyle(theme)}
                        >
                          Resend Invite
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onDeactivateMember?.(member)}
                          style={miniDangerButtonStyle()}
                        >
                          {member.status === "Inactive" ? "Disabled" : "Deactivate"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "32px 16px",
                    textAlign: "center",
                    fontSize: 14,
                    color: theme.subText,
                    background: theme.rowBg,
                  }}
                >
                  No team members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {members.length === 0 && (
        <div
          style={{
            marginTop: 16,
            padding: 18,
            borderRadius: 16,
            border: `1px dashed ${theme.border}`,
            background: theme.cardBgSoft,
            color: theme.subText,
            fontSize: 13,
            textAlign: "center",
          }}
        >
          Start by inviting your first team member to collaborate inside the workspace.
        </div>
      )}
    </div>
  );
}

function InfoCard({
  title,
  value,
  theme,
}: {
  title: string;
  value: string;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        padding: 16,
        background: theme.cardBgSoft,
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: theme.subText,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 20,
          fontWeight: 800,
          color: theme.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({
  label,
  tone,
  theme,
}: {
  label: string;
  tone: "success" | "warning" | "danger";
  theme: ReturnType<typeof getTheme>;
}) {
  const toneMap = {
    success: {
      bg: "rgba(34, 197, 94, 0.14)",
      color: theme.success,
      border: "rgba(34, 197, 94, 0.30)",
    },
    warning: {
      bg: "rgba(245, 158, 11, 0.14)",
      color: theme.warning,
      border: "rgba(245, 158, 11, 0.30)",
    },
    danger: {
      bg: "rgba(239, 68, 68, 0.14)",
      color: "#EF4444",
      border: "rgba(239, 68, 68, 0.30)",
    },
  } as const;

  const selected = toneMap[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        background: selected.bg,
        color: selected.color,
        border: `1px solid ${selected.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function RoleBadge({
  role,
  theme,
}: {
  role: string;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: theme.cardBgSoft,
        color: theme.text,
        border: `1px solid ${theme.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {role}
    </span>
  );
}

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
};

const toolbarStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  flexWrap: "wrap",
  marginTop: 18,
  marginBottom: 18,
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const rowActionsStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

function cellStyle(theme: ReturnType<typeof getTheme>): CSSProperties {
  return {
    padding: "14px 16px",
    fontSize: 14,
    color: theme.text,
    borderBottom: `1px solid ${theme.borderSoft}`,
    verticalAlign: "middle",
  };
}

function primaryButtonStyle(
  theme: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: "none",
    borderRadius: 12,
    padding: "11px 16px",
    background: theme.primary,
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function secondaryButtonStyle(
  theme: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: "11px 16px",
    background: theme.cardBgSoft,
    color: theme.text,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function miniButtonStyle(
  theme: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    padding: "8px 10px",
    background: theme.cardBgSoft,
    color: theme.text,
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function miniDangerButtonStyle(): CSSProperties {
  return {
    border: "none",
    borderRadius: 10,
    padding: "8px 10px",
    background: "rgba(239, 68, 68, 0.12)",
    color: "#DC2626",
    fontWeight: 800,
    fontSize: 12,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}