import type { CSSProperties, ReactNode } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type SidebarItemProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  badge?: string | number;
  mode: ThemeMode;
  collapsed?: boolean;
  danger?: boolean;
};

export default function SidebarItem({
  label,
  active = false,
  onClick,
  icon,
  badge,
  mode,
  collapsed = false,
  danger = false,
}: SidebarItemProps) {
  const theme = getTheme(mode);

  const buttonStyle: CSSProperties = {
    width: "100%",
    border: "none",
    outline: "none",
    background: active
      ? theme.navActiveBg ?? theme.primary
      : "transparent",
    color: active
      ? theme.navActiveText ?? "#ffffff"
      : danger
      ? theme.warning ?? "#ef4444"
      : theme.navText ?? theme.text,
    display: "flex",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "space-between",
    gap: 12,
    padding: collapsed ? "12px 10px" : "12px 14px",
    borderRadius: 14,
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.2s ease",
    fontSize: 14,
    fontWeight: active ? 700 : 600,
    minHeight: 46,
  };

  const leftWrapStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
    overflow: "hidden",
  };

  const iconWrapStyle: CSSProperties = {
    width: 18,
    height: 18,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const labelStyle: CSSProperties = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.2,
  };

  const badgeStyle: CSSProperties = {
    minWidth: 22,
    height: 22,
    padding: "0 7px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
    background: active
      ? "rgba(255,255,255,0.18)"
      : mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(15,23,42,0.08)",
    color: active
      ? theme.navActiveText ?? "#ffffff"
      : danger
      ? theme.warning ?? "#ef4444"
      : theme.subText,
  };

  return (
    <button type="button" onClick={onClick} style={buttonStyle} title={label}>
      <div style={leftWrapStyle}>
        {icon && <span style={iconWrapStyle}>{icon}</span>}
        {!collapsed && <span style={labelStyle}>{label}</span>}
      </div>

      {!collapsed && badge !== undefined && badge !== null && (
        <span style={badgeStyle}>{badge}</span>
      )}
    </button>
  );
}