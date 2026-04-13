import type { CSSProperties, ReactNode } from "react";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

export type RolePermissionItem = {
  key: string;
  label: string;
};

type RolePermissionsCardProps = {
  mode?: ThemeMode;
  title?: string;
  subtitle?: string;
  roleLabel?: string;
  roleValue: ReactNode;
  permissions: RolePermissionItem[];
  permissionSource?: ReactNode;
  lastUpdatedAt?: ReactNode;
  footer?: ReactNode;
  actionLabel?: string;
  onEdit?: () => void;
  emptyMessage?: string;
};

export default function RolePermissionsCard({
  mode = "light",
  title = "Role & Permissions",
  subtitle = "Access controls that define what this user can view and manage inside MEI CRM.",
  roleLabel = "Assigned Role",
  roleValue,
  permissions,
  permissionSource,
  lastUpdatedAt,
  footer,
  actionLabel = "Manage Permissions",
  onEdit,
  emptyMessage = "No permissions assigned.",
}: RolePermissionsCardProps) {
  const theme = getTheme(mode);
  const showAction = typeof onEdit === "function";
  const hasPermissions = permissions.length > 0;

  const cardStyle: CSSProperties = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: 20,
    padding: 20,
    boxShadow:
      mode === "dark"
        ? "0 10px 30px rgba(0,0,0,0.28)"
        : "0 10px 30px rgba(15, 23, 42, 0.08)",
  };

  const headerWrapStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 16,
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: theme.text,
    letterSpacing: 0.2,
    lineHeight: 1.3,
  };

  const subtitleStyle: CSSProperties = {
    margin: "6px 0 0",
    color: theme.subText,
    fontSize: 13,
    lineHeight: 1.6,
    maxWidth: 760,
  };

  const actionButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.text,
    height: 40,
    padding: "0 14px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  };

  const labelStyle: CSSProperties = {
    fontSize: 12,
    color: theme.mutedText,
    fontWeight: 700,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    lineHeight: 1.5,
  };

  const roleRowStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
  };

  const roleBadgeStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 38,
    padding: "8px 14px",
    borderRadius: 999,
    border: `1px solid ${theme.border}`,
    background: mode === "dark" ? theme.cardBg : "#FFFFFF",
    color: theme.text,
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.4,
    wordBreak: "break-word",
  };

  const metaGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    marginTop: 16,
  };

  const metaItemStyle: CSSProperties = {
    minWidth: 0,
  };

  const metaValueStyle: CSSProperties = {
    marginTop: 6,
    color: theme.text,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.6,
    wordBreak: "break-word",
  };

  const permissionsWrapStyle: CSSProperties = {
    marginTop: 18,
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  };

  const chipStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 38,
    padding: "8px 12px",
    borderRadius: 999,
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.text,
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.4,
  };

  const emptyStateStyle: CSSProperties = {
    marginTop: 18,
    padding: "16px 14px",
    borderRadius: 14,
    border: `1px dashed ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.subText,
    fontSize: 14,
    lineHeight: 1.7,
  };

  const footerStyle: CSSProperties = {
    marginTop: 18,
    paddingTop: 18,
    borderTop: `1px solid ${theme.borderSoft}`,
  };

  return (
    <section style={cardStyle}>
      <div style={headerWrapStyle}>
        <div style={{ minWidth: 0, flex: "1 1 420px" }}>
          <h3 style={titleStyle}>{title}</h3>
          <p style={subtitleStyle}>{subtitle}</p>
        </div>

        {showAction ? (
          <button type="button" style={actionButtonStyle} onClick={onEdit}>
            {actionLabel}
          </button>
        ) : null}
      </div>

      <div style={roleRowStyle}>
        <div style={{ minWidth: 0, flex: "1 1 220px" }}>
          <div style={labelStyle}>{roleLabel}</div>
          <div style={{ marginTop: 8 }}>
            <span style={roleBadgeStyle}>{roleValue || "—"}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <span
            style={{
              ...chipStyle,
              background: mode === "dark" ? theme.cardBg : "#FFFFFF",
            }}
          >
            {permissions.length} Permission{permissions.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {(permissionSource || lastUpdatedAt) && (
        <div style={metaGridStyle}>
          {permissionSource ? (
            <div style={metaItemStyle}>
              <div style={labelStyle}>Permission Source</div>
              <div style={metaValueStyle}>{permissionSource}</div>
            </div>
          ) : null}

          {lastUpdatedAt ? (
            <div style={metaItemStyle}>
              <div style={labelStyle}>Last Updated</div>
              <div style={metaValueStyle}>{lastUpdatedAt}</div>
            </div>
          ) : null}
        </div>
      )}

      {hasPermissions ? (
        <div style={permissionsWrapStyle}>
          {permissions.map((permission) => (
            <span key={permission.key} style={chipStyle}>
              {permission.label}
            </span>
          ))}
        </div>
      ) : (
        <div style={emptyStateStyle}>{emptyMessage}</div>
      )}

      {footer ? <div style={footerStyle}>{footer}</div> : null}
    </section>
  );
}