// src/features/settings/settings/team-users/UserPermissionsCard.tsx

import { getTheme, type ThemeMode } from "../../../../theme";

export type UserPermissionGroup = {
  id: string;
  title: string;
  description?: string;
  permissions: Array<{
    key: string;
    label: string;
    enabled: boolean;
  }>;
};

export type UserPermissionsCardUser = {
  id: string;
  name: string;
  role?: string;
  isOwner?: boolean;
};

type UserPermissionsCardProps = {
  user: UserPermissionsCardUser | null;
  mode?: ThemeMode;
  loading?: boolean;
  title?: string;
  permissionGroups?: UserPermissionGroup[];
  readOnly?: boolean;
  onTogglePermission?: (
    groupId: string,
    permissionKey: string,
    nextValue: boolean
  ) => void;
  onSave?: () => void;
};

function getRoleMeta(role?: string) {
  const value = (role ?? "").trim().toLowerCase();

  if (value === "admin") {
    return {
      label: "Admin",
      bg: "rgba(239, 68, 68, 0.12)",
      border: "rgba(239, 68, 68, 0.24)",
      color: "#dc2626",
    };
  }

  if (value === "manager") {
    return {
      label: "Manager",
      bg: "rgba(59, 130, 246, 0.12)",
      border: "rgba(59, 130, 246, 0.24)",
      color: "#2563eb",
    };
  }

  if (value === "agent") {
    return {
      label: "Agent",
      bg: "rgba(34, 197, 94, 0.12)",
      border: "rgba(34, 197, 94, 0.24)",
      color: "#16a34a",
    };
  }

  return {
    label: role?.trim() || "Unknown",
    bg: "rgba(100, 116, 139, 0.12)",
    border: "rgba(100, 116, 139, 0.24)",
    color: "#475569",
  };
}

function getDefaultPermissionGroups(
  role?: string,
  isOwner?: boolean
): UserPermissionGroup[] {
  const normalizedRole = (role ?? "").trim().toLowerCase();
  const ownerOverride = Boolean(isOwner) || normalizedRole === "admin";

  return [
    {
      id: "leads",
      title: "Leads",
      description: "Access to lead records, updates, and movement.",
      permissions: [
        { key: "leads.read", label: "View leads", enabled: true },
        {
          key: "leads.create",
          label: "Create leads",
          enabled: ownerOverride || normalizedRole !== "agent" ? true : true,
        },
        {
          key: "leads.update",
          label: "Edit leads",
          enabled: ownerOverride || normalizedRole !== "agent" ? true : true,
        },
        {
          key: "leads.delete",
          label: "Delete leads",
          enabled: ownerOverride,
        },
      ],
    },
    {
      id: "deals",
      title: "Deals",
      description: "Pipeline visibility, deal updates, and stage control.",
      permissions: [
        { key: "deals.read", label: "View deals", enabled: true },
        { key: "deals.create", label: "Create deals", enabled: true },
        { key: "deals.update", label: "Edit deals", enabled: true },
        {
          key: "deals.delete",
          label: "Delete deals",
          enabled: ownerOverride || normalizedRole === "manager",
        },
      ],
    },
    {
      id: "tasks",
      title: "Tasks",
      description: "Daily work management, follow-ups, and completion access.",
      permissions: [
        { key: "tasks.read", label: "View tasks", enabled: true },
        { key: "tasks.create", label: "Create tasks", enabled: true },
        { key: "tasks.update", label: "Edit tasks", enabled: true },
        {
          key: "tasks.delete",
          label: "Delete tasks",
          enabled: ownerOverride || normalizedRole === "manager",
        },
      ],
    },
    {
      id: "team",
      title: "Team & Settings",
      description: "Role management, user controls, and workspace settings.",
      permissions: [
        {
          key: "team.read",
          label: "View team users",
          enabled: ownerOverride || normalizedRole === "manager",
        },
        {
          key: "team.invite",
          label: "Invite users",
          enabled: ownerOverride || normalizedRole === "manager",
        },
        {
          key: "settings.manage",
          label: "Manage settings",
          enabled: ownerOverride,
        },
        {
          key: "roles.manage",
          label: "Manage roles",
          enabled: ownerOverride,
        },
      ],
    },
  ];
}

function SkeletonCard({ mode }: { mode: ThemeMode }) {
  const theme = getTheme(mode);

  return (
    <section
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        background: theme.cardBg,
        boxShadow:
          mode === "dark"
            ? "0 14px 34px rgba(0,0,0,0.26)"
            : "0 14px 34px rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 20,
          borderBottom: `1px solid ${theme.border}`,
          display: "grid",
          gap: 10,
        }}
      >
        <div
          style={{
            width: "36%",
            height: 16,
            borderRadius: 999,
            background: theme.border,
          }}
        />
        <div
          style={{
            width: "58%",
            height: 12,
            borderRadius: 999,
            background: theme.borderSoft,
          }}
        />
      </div>

      <div
        style={{
          padding: 20,
          display: "grid",
          gap: 14,
        }}
      >
        {Array.from({ length: 4 }).map((_, groupIndex) => (
          <div
            key={groupIndex}
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: 18,
              background: theme.cardBgSoft,
              padding: 16,
              display: "grid",
              gap: 12,
            }}
          >
            <div
              style={{
                width: "30%",
                height: 14,
                borderRadius: 999,
                background: theme.border,
              }}
            />
            <div
              style={{
                width: "64%",
                height: 10,
                borderRadius: 999,
                background: theme.borderSoft,
              }}
            />
            {Array.from({ length: 3 }).map((__, permissionIndex) => (
              <div
                key={permissionIndex}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: "42%",
                    height: 12,
                    borderRadius: 999,
                    background: theme.borderSoft,
                  }}
                />
                <div
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 999,
                    background: theme.border,
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function UserPermissionsCard({
  user,
  mode = "light",
  loading = false,
  title = "User Permissions",
  permissionGroups,
  readOnly = false,
  onTogglePermission,
  onSave,
}: UserPermissionsCardProps) {
  const theme = getTheme(mode);

  if (loading) {
    return <SkeletonCard mode={mode} />;
  }

  if (!user) {
    return (
      <section
        style={{
          border: `1px solid ${theme.border}`,
          borderRadius: 24,
          background: theme.cardBg,
          boxShadow:
            mode === "dark"
              ? "0 14px 34px rgba(0,0,0,0.26)"
              : "0 14px 34px rgba(15, 23, 42, 0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 28,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              margin: "0 auto 16px",
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                mode === "dark"
                  ? "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.18))"
                  : "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
              border: `1px solid ${theme.border}`,
              fontSize: 30,
            }}
          >
            🛡️
          </div>

          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: theme.text,
              marginBottom: 8,
            }}
          >
            No permission profile loaded
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: theme.subText,
              maxWidth: 460,
              margin: "0 auto",
            }}
          >
            Select a user to review what they can access across leads, deals,
            tasks, and workspace controls.
          </div>
        </div>
      </section>
    );
  }

  const groups =
    permissionGroups && permissionGroups.length > 0
      ? permissionGroups
      : getDefaultPermissionGroups(user.role, user.isOwner);

  const roleMeta = getRoleMeta(user.role);
  const totalPermissions = groups.reduce(
    (sum, group) => sum + group.permissions.length,
    0
  );
  const enabledPermissions = groups.reduce(
    (sum, group) =>
      sum + group.permissions.filter((permission) => permission.enabled).length,
    0
  );

  return (
    <section
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        background: theme.cardBg,
        boxShadow:
          mode === "dark"
            ? "0 14px 34px rgba(0,0,0,0.26)"
            : "0 14px 34px rgba(15, 23, 42, 0.06)",
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
          gap: 14,
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
              fontSize: 20,
              fontWeight: 900,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: theme.subText,
              marginTop: 6,
              lineHeight: 1.5,
              maxWidth: 720,
            }}
          >
            Review access rights for <strong>{user.name}</strong> across modules,
            roles, and workspace operations.
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
              background: roleMeta.bg,
              border: `1px solid ${roleMeta.border}`,
              color: roleMeta.color,
              fontSize: 12,
              fontWeight: 900,
            }}
          >
            {roleMeta.label}
          </span>

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
              fontWeight: 900,
            }}
          >
            {enabledPermissions}/{totalPermissions} enabled
          </span>
        </div>
      </div>

      <div
        style={{
          padding: 20,
          display: "grid",
          gap: 14,
        }}
      >
        {groups.map((group) => (
          <div
            key={group.id}
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: 18,
              background: theme.cardBgSoft,
              padding: 16,
              display: "grid",
              gap: 14,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: theme.text,
                  lineHeight: 1.2,
                }}
              >
                {group.title}
              </div>

              {group.description ? (
                <div
                  style={{
                    fontSize: 13,
                    color: theme.subText,
                    marginTop: 6,
                    lineHeight: 1.6,
                  }}
                >
                  {group.description}
                </div>
              ) : null}
            </div>

            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              {group.permissions.map((permission) => {
                const checked = permission.enabled;

                return (
                  <label
                    key={permission.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 14,
                      padding: "12px 14px",
                      borderRadius: 14,
                      border: `1px solid ${
                        checked
                          ? "rgba(34, 197, 94, 0.22)"
                          : theme.border
                      }`,
                      background: checked
                        ? mode === "dark"
                          ? "rgba(34, 197, 94, 0.08)"
                          : "rgba(34, 197, 94, 0.05)"
                        : theme.cardBg,
                      cursor:
                        readOnly || !onTogglePermission ? "default" : "pointer",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: theme.text,
                          lineHeight: 1.4,
                          wordBreak: "break-word",
                        }}
                      >
                        {permission.label}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: theme.mutedText,
                          marginTop: 4,
                          lineHeight: 1.5,
                          wordBreak: "break-word",
                        }}
                      >
                        {permission.key}
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={readOnly || !onTogglePermission}
                      onChange={(event) =>
                        onTogglePermission?.(
                          group.id,
                          permission.key,
                          event.target.checked
                        )
                      }
                      style={{
                        width: 18,
                        height: 18,
                        cursor:
                          readOnly || !onTogglePermission
                            ? "not-allowed"
                            : "pointer",
                        flexShrink: 0,
                      }}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!readOnly && onSave ? (
        <div
          style={{
            borderTop: `1px solid ${theme.border}`,
            padding: "16px 20px",
            display: "flex",
            justifyContent: "flex-end",
            background: theme.cardBg,
          }}
        >
          <button
            type="button"
            onClick={onSave}
            style={{
              border: "none",
              background: theme.primary,
              color: theme.inverseText ?? "#ffffff",
              borderRadius: 12,
              padding: "12px 18px",
              fontSize: 14,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Save Permissions
          </button>
        </div>
      ) : null}
    </section>
  );
}