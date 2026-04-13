import type { CSSProperties, ReactNode } from "react";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

export type NotificationPreferenceItem = {
  key: string;
  label: string;
  enabled: boolean;
  description?: ReactNode;
};

type NotificationPreferencesCardProps = {
  mode?: ThemeMode;
  title?: string;
  subtitle?: string;
  items: NotificationPreferenceItem[];
  actionLabel?: string;
  onManage?: () => void;
  footer?: ReactNode;
  emptyMessage?: string;
};

export default function NotificationPreferencesCard({
  mode = "light",
  title = "Notification Preferences",
  subtitle = "Control how this user receives platform alerts, reminders, and operational updates.",
  items,
  actionLabel = "Manage Preferences",
  onManage,
  footer,
  emptyMessage = "No notification preferences available.",
}: NotificationPreferencesCardProps) {
  const theme = getTheme(mode);
  const showAction = typeof onManage === "function";
  const hasItems = items.length > 0;

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
    minHeight: 40,
    padding: "0 14px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  };

  const listWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  const rowStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 16,
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
  };

  const labelStyle: CSSProperties = {
    color: theme.text,
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.5,
    wordBreak: "break-word",
  };

  const descriptionStyle: CSSProperties = {
    marginTop: 4,
    color: theme.subText,
    fontSize: 13,
    lineHeight: 1.65,
    wordBreak: "break-word",
  };

  const emptyStateStyle: CSSProperties = {
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
          <button type="button" style={actionButtonStyle} onClick={onManage}>
            {actionLabel}
          </button>
        ) : null}
      </div>

      {hasItems ? (
        <div style={listWrapStyle}>
          {items.map((item) => (
            <div key={item.key} style={rowStyle}>
              <div style={{ minWidth: 0, flex: "1 1 auto" }}>
                <div style={labelStyle}>{item.label}</div>
                {item.description ? (
                  <div style={descriptionStyle}>{item.description}</div>
                ) : null}
              </div>

              <StatusPill
                enabled={item.enabled}
                mode={mode}
                theme={theme}
              />
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyStateStyle}>{emptyMessage}</div>
      )}

      {footer ? <div style={footerStyle}>{footer}</div> : null}
    </section>
  );
}

function StatusPill({
  enabled,
  mode,
  theme,
}: {
  enabled: boolean;
  mode: ThemeMode;
  theme: ReturnType<typeof getTheme>;
}) {
  const style = getStatusStyles(enabled, mode, theme);

  const pillStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 86,
    minHeight: 34,
    padding: "6px 12px",
    borderRadius: 999,
    border: `1px solid ${style.border}`,
    background: style.background,
    color: style.color,
    fontSize: 12,
    fontWeight: 800,
    lineHeight: 1.4,
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  return <span style={pillStyle}>{enabled ? "Enabled" : "Disabled"}</span>;
}

function getStatusStyles(
  enabled: boolean,
  mode: ThemeMode,
  theme: ReturnType<typeof getTheme>
) {
  if (enabled) {
    return {
      background: mode === "dark" ? "rgba(34,197,94,0.16)" : "#DCFCE7",
      border: mode === "dark" ? "rgba(34,197,94,0.3)" : "#BBF7D0",
      color: mode === "dark" ? "#86EFAC" : "#166534",
    };
  }

  return {
    background: theme.cardBg,
    border: theme.border,
    color: theme.subText,
  };
}