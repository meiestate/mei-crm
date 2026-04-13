import type { CSSProperties, ReactNode } from "react";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

export type DangerZoneActionItem = {
  key: string;
  label: string;
  description?: ReactNode;
  variant?: "soft" | "outline" | "solid";
  onClick?: () => void;
  disabled?: boolean;
};

type DangerZoneCardProps = {
  mode?: ThemeMode;
  title?: string;
  subtitle?: string;
  actions: DangerZoneActionItem[];
  footer?: ReactNode;
  emptyMessage?: string;
};

export default function DangerZoneCard({
  mode = "light",
  title = "Danger Zone",
  subtitle = "Sensitive account actions. Use these controls only when absolutely necessary.",
  actions,
  footer,
  emptyMessage = "No destructive actions available.",
}: DangerZoneCardProps) {
  const theme = getTheme(mode);
  const hasActions = actions.length > 0;

  const cardStyle: CSSProperties = {
    background:
      mode === "dark"
        ? "linear-gradient(180deg, rgba(127,29,29,0.22), rgba(15,23,42,1))"
        : "linear-gradient(180deg, #FFF1F2, #FFFFFF)",
    border: `1px solid ${
      mode === "dark" ? "rgba(239,68,68,0.32)" : "#FECACA"
    }`,
    borderRadius: 20,
    padding: 20,
    boxShadow:
      mode === "dark"
        ? "0 10px 30px rgba(0,0,0,0.28)"
        : "0 10px 30px rgba(15, 23, 42, 0.08)",
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

  const listWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  };

  const rowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    border: `1px solid ${
      mode === "dark" ? "rgba(248,113,113,0.18)" : "#FECACA"
    }`,
    background: mode === "dark" ? "rgba(15,23,42,0.38)" : "#FFFFFF",
    flexWrap: "wrap",
  };

  const labelStyle: CSSProperties = {
    color: theme.text,
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.5,
    wordBreak: "break-word",
  };

  const descriptionStyle: CSSProperties = {
    marginTop: 4,
    color: theme.subText,
    fontSize: 13,
    lineHeight: 1.7,
    wordBreak: "break-word",
  };

  const emptyStateStyle: CSSProperties = {
    marginTop: 16,
    padding: "16px 14px",
    borderRadius: 14,
    border: `1px dashed ${
      mode === "dark" ? "rgba(248,113,113,0.22)" : "#FCA5A5"
    }`,
    background: mode === "dark" ? "rgba(15,23,42,0.34)" : "#FFF1F2",
    color: theme.subText,
    fontSize: 14,
    lineHeight: 1.7,
  };

  const footerStyle: CSSProperties = {
    marginTop: 18,
    paddingTop: 18,
    borderTop: `1px solid ${
      mode === "dark" ? "rgba(248,113,113,0.18)" : "#FEE2E2"
    }`,
  };

  return (
    <section style={cardStyle}>
      <div>
        <h3 style={titleStyle}>{title}</h3>
        <p style={subtitleStyle}>{subtitle}</p>
      </div>

      {hasActions ? (
        <div style={listWrapStyle}>
          {actions.map((action) => (
            <div key={action.key} style={rowStyle}>
              <div style={{ minWidth: 0, flex: "1 1 280px" }}>
                <div style={labelStyle}>{action.label}</div>
                {action.description ? (
                  <div style={descriptionStyle}>{action.description}</div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
                style={getDangerButtonStyle(mode, action.variant || "outline", !!action.disabled)}
              >
                {action.label}
              </button>
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

function getDangerButtonStyle(
  mode: ThemeMode,
  variant: "soft" | "outline" | "solid",
  disabled: boolean
): CSSProperties {
  const baseStyle: CSSProperties = {
    minHeight: 40,
    padding: "0 14px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    opacity: disabled ? 0.55 : 1,
  };

  if (variant === "solid") {
    return {
      ...baseStyle,
      border: "1px solid #DC2626",
      background: "#DC2626",
      color: "#FFFFFF",
    };
  }

  if (variant === "soft") {
    return {
      ...baseStyle,
      border: "1px solid #FCA5A5",
      background: mode === "dark" ? "rgba(127,29,29,0.18)" : "#FFF1F2",
      color: "#DC2626",
    };
  }

  return {
    ...baseStyle,
    border: "1px solid #EF4444",
    background: "transparent",
    color: "#DC2626",
  };
}