import type { CSSProperties } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type WorkspacePreferencesData = {
  themeMode: string;
  dateFormat: string;
  timeFormat: string;
  defaultLandingPage: string;
  compactTableMode: boolean;
  sidebarCollapsed: boolean;
  autoSaveForms: boolean;
};

type WorkspacePreferencesCardProps = {
  mode?: ThemeMode;
  preferences: WorkspacePreferencesData;
  onFieldChange: (
    field: keyof WorkspacePreferencesData,
    value: string | boolean
  ) => void;
  onSave?: () => void;
  onReset?: () => void;
};

export default function WorkspacePreferencesCard({
  mode = "light",
  preferences,
  onFieldChange,
  onSave,
  onReset,
}: WorkspacePreferencesCardProps) {
  const theme = getTheme(mode);

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
          Workspace Preferences
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.5,
            color: theme.subText,
          }}
        >
          Control how the app looks, feels, and behaves across your workspace.
        </div>
      </div>

      <div style={grid2Style}>
        <Field
          label="Theme Mode"
          value={preferences.themeMode}
          onChange={(value) => onFieldChange("themeMode", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Date Format"
          value={preferences.dateFormat}
          onChange={(value) => onFieldChange("dateFormat", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Time Format"
          value={preferences.timeFormat}
          onChange={(value) => onFieldChange("timeFormat", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Default Landing Page"
          value={preferences.defaultLandingPage}
          onChange={(value) => onFieldChange("defaultLandingPage", value)}
          theme={theme}
          mode={mode}
        />
      </div>

      <div style={toggleListStyle}>
        <ToggleRow
          label="Compact Table Mode"
          description="Show more rows in tables with reduced spacing."
          checked={preferences.compactTableMode}
          onChange={(checked) => onFieldChange("compactTableMode", checked)}
          theme={theme}
        />

        <ToggleRow
          label="Sidebar Collapsed by Default"
          description="Open the workspace with a compact sidebar."
          checked={preferences.sidebarCollapsed}
          onChange={(checked) => onFieldChange("sidebarCollapsed", checked)}
          theme={theme}
        />

        <ToggleRow
          label="Auto-Save Forms"
          description="Automatically preserve unsaved form data while editing."
          checked={preferences.autoSaveForms}
          onChange={(checked) => onFieldChange("autoSaveForms", checked)}
          theme={theme}
        />
      </div>

      <div style={infoGridStyle}>
        <InfoCard
          title="Theme Preview"
          value={preferences.themeMode}
          theme={theme}
        />
        <InfoCard
          title="Default Page"
          value={preferences.defaultLandingPage}
          theme={theme}
        />
        <InfoCard
          title="Form Save Mode"
          value={preferences.autoSaveForms ? "Auto Save On" : "Manual Save"}
          theme={theme}
        />
      </div>

      <div style={actionsRowStyle}>
        <button type="button" onClick={onSave} style={primaryButtonStyle(theme)}>
          Save Preferences
        </button>

        <button
          type="button"
          onClick={onReset}
          style={secondaryButtonStyle(theme)}
        >
          Reset Preferences
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  theme,
  mode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  theme: ReturnType<typeof getTheme>;
  mode: ThemeMode;
}) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: theme.subText,
        }}
      >
        {label}
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle(theme, mode)}
      />
    </label>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  theme,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        alignItems: "center",
        padding: "14px 16px",
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        background: theme.cardBgSoft,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: theme.text,
          }}
        >
          {label}
        </div>

        <div
          style={{
            marginTop: 4,
            fontSize: 12,
            color: theme.subText,
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>

      <label
        style={{
          position: "relative",
          width: 52,
          height: 30,
          display: "inline-block",
          flexShrink: 0,
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ display: "none" }}
        />

        <span
          style={{
            position: "absolute",
            inset: 0,
            background: checked ? theme.primary : theme.borderStrong,
            borderRadius: 999,
            transition: "0.2s ease",
            cursor: "pointer",
          }}
        />

        <span
          style={{
            position: "absolute",
            top: 4,
            left: checked ? 26 : 4,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#fff",
            transition: "0.2s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}
        />
      </label>
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
          fontSize: 18,
          fontWeight: 800,
          color: theme.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const grid2Style: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
};

const toggleListStyle: CSSProperties = {
  display: "grid",
  gap: 14,
  marginTop: 20,
};

const infoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
  marginTop: 20,
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 18,
};

function inputStyle(
  theme: ReturnType<typeof getTheme>,
  mode: ThemeMode
): CSSProperties {
  return {
    width: "100%",
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