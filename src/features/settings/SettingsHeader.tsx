import type { CSSProperties } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type SettingsHeaderProps = {
  mode?: ThemeMode;
  title?: string;
  subtitle?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onReset?: () => void;
  onSave?: () => void;
  saveLabel?: string;
  resetLabel?: string;
  searchPlaceholder?: string;
};

export default function SettingsHeader({
  mode = "light",
  title = "Settings",
  subtitle = "Manage your workspace, preferences, access control, system behavior, and business configuration.",
  searchValue,
  onSearchChange,
  onReset,
  onSave,
  saveLabel = "Save Changes",
  resetLabel = "Reset",
  searchPlaceholder = "Search settings...",
}: SettingsHeaderProps) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 20,
        boxShadow:
          mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.25)"
            : "0 10px 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: -0.4,
              color: theme.text,
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 14,
              lineHeight: 1.6,
              color: theme.subText,
              maxWidth: 720,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            style={inputStyle(theme, mode, 260)}
          />

          <button
            type="button"
            onClick={onReset}
            style={secondaryButtonStyle(theme)}
          >
            {resetLabel}
          </button>

          <button
            type="button"
            onClick={onSave}
            style={primaryButtonStyle(theme)}
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function inputStyle(
  theme: ReturnType<typeof getTheme>,
  mode: ThemeMode,
  width?: number
): CSSProperties {
  return {
    width: width ? `${width}px` : "100%",
    maxWidth: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid ${theme.border}`,
    outline: "none",
    background: theme.inputBg,
    color: theme.text,
    fontSize: 14,
    boxSizing: "border-box",
    boxShadow:
      mode === "dark"
        ? "inset 0 1px 0 rgba(255,255,255,0.02)"
        : "inset 0 1px 0 rgba(255,255,255,0.6)",
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