import type { CSSProperties, ReactNode } from "react";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

export type SecurityInfoItem = {
  key: string;
  label: string;
  value: ReactNode;
};

type SecuritySettingsCardProps = {
  mode?: ThemeMode;
  title?: string;
  subtitle?: string;
  items: SecurityInfoItem[];
  emailVerified?: boolean;
  mobileVerified?: boolean;
  twoFactorEnabled?: boolean;
  actionLabelPrimary?: string;
  actionLabelSecondary?: string;
  actionLabelTertiary?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onTertiaryAction?: () => void;
  footer?: ReactNode;
};

export default function SecuritySettingsCard({
  mode = "light",
  title = "Security & Access",
  subtitle = "Verification status, password hygiene, login visibility, and account protection settings.",
  items,
  emailVerified,
  mobileVerified,
  twoFactorEnabled,
  actionLabelPrimary = "Enable 2FA",
  actionLabelSecondary = "View Login History",
  actionLabelTertiary = "Log Out All Devices",
  onPrimaryAction,
  onSecondaryAction,
  onTertiaryAction,
  footer,
}: SecuritySettingsCardProps) {
  const theme = getTheme(mode);

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

  const statusRowStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  };

  const itemWrapStyle: CSSProperties = {
    minWidth: 0,
  };

  const labelStyle: CSSProperties = {
    fontSize: 12,
    color: theme.mutedText,
    fontWeight: 700,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    lineHeight: 1.5,
  };

  const valueStyle: CSSProperties = {
    marginTop: 6,
    color: theme.text,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.6,
    wordBreak: "break-word",
  };

  const actionsWrapStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  };

  const buttonStyle: CSSProperties = {
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
      </div>

      <div style={statusRowStyle}>
        {typeof emailVerified === "boolean" ? (
          <StatusBadge
            label="Email Verified"
            value={emailVerified ? "Verified" : "Not Verified"}
            tone={emailVerified ? "success" : "neutral"}
            theme={theme}
            mode={mode}
          />
        ) : null}

        {typeof mobileVerified === "boolean" ? (
          <StatusBadge
            label="Mobile Verified"
            value={mobileVerified ? "Verified" : "Not Verified"}
            tone={mobileVerified ? "success" : "neutral"}
            theme={theme}
            mode={mode}
          />
        ) : null}

        {typeof twoFactorEnabled === "boolean" ? (
          <StatusBadge
            label="Two-Factor Authentication"
            value={twoFactorEnabled ? "Enabled" : "Disabled"}
            tone={twoFactorEnabled ? "success" : "warning"}
            theme={theme}
            mode={mode}
          />
        ) : null}
      </div>

      <div style={gridStyle}>
        {items.map((item) => (
          <div key={item.key} style={itemWrapStyle}>
            <div style={labelStyle}>{item.label}</div>
            <div style={valueStyle}>{item.value || "—"}</div>
          </div>
        ))}
      </div>

      {(onPrimaryAction || onSecondaryAction || onTertiaryAction) && (
        <div style={actionsWrapStyle}>
          {onPrimaryAction ? (
            <button type="button" style={buttonStyle} onClick={onPrimaryAction}>
              {actionLabelPrimary}
            </button>
          ) : null}

          {onSecondaryAction ? (
            <button type="button" style={buttonStyle} onClick={onSecondaryAction}>
              {actionLabelSecondary}
            </button>
          ) : null}

          {onTertiaryAction ? (
            <button type="button" style={buttonStyle} onClick={onTertiaryAction}>
              {actionLabelTertiary}
            </button>
          ) : null}
        </div>
      )}

      {footer ? <div style={footerStyle}>{footer}</div> : null}
    </section>
  );
}

function StatusBadge({
  label,
  value,
  tone,
  theme,
  mode,
}: {
  label: string;
  value: string;
  tone: "success" | "warning" | "neutral";
  theme: ReturnType<typeof getTheme>;
  mode: ThemeMode;
}) {
  const toneStyles = getToneStyles(tone, mode, theme);

  const wrapStyle: CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
    padding: "10px 12px",
    borderRadius: 14,
    border: `1px solid ${toneStyles.border}`,
    background: toneStyles.background,
  };

  const labelStyle: CSSProperties = {
    fontSize: 11,
    color: theme.mutedText,
    fontWeight: 800,
    letterSpacing: 0.35,
    textTransform: "uppercase",
    lineHeight: 1.4,
  };

  const valueStyle: CSSProperties = {
    fontSize: 13,
    color: toneStyles.color,
    fontWeight: 800,
    lineHeight: 1.5,
  };

  return (
    <div style={wrapStyle}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}

function getToneStyles(
  tone: "success" | "warning" | "neutral",
  mode: ThemeMode,
  theme: ReturnType<typeof getTheme>
) {
  if (tone === "success") {
    return {
      background: mode === "dark" ? "rgba(34,197,94,0.16)" : "#DCFCE7",
      border: mode === "dark" ? "rgba(34,197,94,0.3)" : "#BBF7D0",
      color: mode === "dark" ? "#86EFAC" : "#166534",
    };
  }

  if (tone === "warning") {
    return {
      background: mode === "dark" ? "rgba(245,158,11,0.16)" : "#FEF3C7",
      border: mode === "dark" ? "rgba(245,158,11,0.3)" : "#FDE68A",
      color: mode === "dark" ? "#FCD34D" : "#92400E",
    };
  }

  return {
    background: theme.cardBgSoft,
    border: theme.border,
    color: theme.text,
  };
}