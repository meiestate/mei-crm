import type { CSSProperties, ReactNode } from "react";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

export type PersonalInfoItem = {
  key: string;
  label: string;
  value: ReactNode;
};

type PersonalInfoCardProps = {
  mode?: ThemeMode;
  title?: string;
  subtitle?: string;
  items: PersonalInfoItem[];
  bio?: ReactNode;
  bioLabel?: string;
  actionLabel?: string;
  onEdit?: () => void;
};

export default function PersonalInfoCard({
  mode = "light",
  title = "Personal Information",
  subtitle = "Basic identity and contact details for this user profile.",
  items,
  bio,
  bioLabel = "Bio / About",
  actionLabel = "Edit Info",
  onEdit,
}: PersonalInfoCardProps) {
  const theme = getTheme(mode);
  const showAction = typeof onEdit === "function";

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

  const bioWrapStyle: CSSProperties = {
    marginTop: 18,
    paddingTop: 18,
    borderTop: `1px solid ${theme.borderSoft}`,
  };

  const bioTextStyle: CSSProperties = {
    marginTop: 6,
    color: theme.text,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.8,
    wordBreak: "break-word",
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

      <div style={gridStyle}>
        {items.map((item) => (
          <div key={item.key} style={itemWrapStyle}>
            <div style={labelStyle}>{item.label}</div>
            <div style={valueStyle}>{item.value || "—"}</div>
          </div>
        ))}
      </div>

      {bio ? (
        <div style={bioWrapStyle}>
          <div style={labelStyle}>{bioLabel}</div>
          <div style={bioTextStyle}>{bio}</div>
        </div>
      ) : null}
    </section>
  );
}