import type { CSSProperties } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type SecurityData = {
  twoFactorEnabled: boolean;
  suspiciousLoginAlerts: boolean;
  sessionTimeout: string;
};

type SecurityCardProps = {
  mode?: ThemeMode;
  security: SecurityData;
  onFieldChange: (field: keyof SecurityData, value: string | boolean) => void;
  onChangePassword?: () => void;
  onViewSessions?: () => void;
  onLogoutAllDevices?: () => void;
  onSave?: () => void;
};

export default function SecurityCard({
  mode = "light",
  security,
  onFieldChange,
  onChangePassword,
  onViewSessions,
  onLogoutAllDevices,
  onSave,
}: SecurityCardProps) {
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
          Security Settings
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.5,
            color: theme.subText,
          }}
        >
          Protect your workspace with stronger access control, session rules, and
          login safety settings.
        </div>
      </div>

      <div style={statsGridStyle}>
        <InfoCard
          title="Two-Factor Auth"
          value={security.twoFactorEnabled ? "Enabled" : "Disabled"}
          theme={theme}
        />
        <InfoCard
          title="Login Alerts"
          value={security.suspiciousLoginAlerts ? "On" : "Off"}
          theme={theme}
        />
        <InfoCard
          title="Session Timeout"
          value={security.sessionTimeout}
          theme={theme}
        />
      </div>

      <div style={grid2Style}>
        <Field
          label="Session Timeout"
          value={security.sessionTimeout}
          onChange={(value) => onFieldChange("sessionTimeout", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Password Policy"
          value="Strong password required"
          onChange={() => undefined}
          theme={theme}
          mode={mode}
          readOnly
        />
      </div>

      <div style={toggleListStyle}>
        <ToggleRow
          label="Two-Factor Authentication"
          description="Require an additional verification step during login."
          checked={security.twoFactorEnabled}
          onChange={(checked) => onFieldChange("twoFactorEnabled", checked)}
          theme={theme}
        />

        <ToggleRow
          label="Suspicious Login Alerts"
          description="Receive alerts when unusual or unknown login attempts are detected."
          checked={security.suspiciousLoginAlerts}
          onChange={(checked) =>
            onFieldChange("suspiciousLoginAlerts", checked)
          }
          theme={theme}
        />
      </div>

      <div style={actionsRowStyle}>
        <button
          type="button"
          onClick={onChangePassword}
          style={primaryButtonStyle(theme)}
        >
          Change Password
        </button>

        <button
          type="button"
          onClick={onViewSessions}
          style={secondaryButtonStyle(theme)}
        >
          View Active Sessions
        </button>

        <button
          type="button"
          onClick={onLogoutAllDevices}
          style={dangerButtonStyle()}
        >
          Logout All Devices
        </button>

        <button
          type="button"
          onClick={onSave}
          style={secondaryButtonStyle(theme)}
        >
          Save Security Settings
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
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  theme: ReturnType<typeof getTheme>;
  mode: ThemeMode;
  readOnly?: boolean;
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
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle(theme, mode, readOnly)}
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

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
};

const grid2Style: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
  marginTop: 20,
};

const toggleListStyle: CSSProperties = {
  display: "grid",
  gap: 14,
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
  mode: ThemeMode,
  readOnly?: boolean
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
    opacity: readOnly ? 0.8 : 1,
    cursor: readOnly ? "not-allowed" : "text",
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

function dangerButtonStyle(): CSSProperties {
  return {
    border: "none",
    borderRadius: 12,
    padding: "11px 16px",
    background: "#DC2626",
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}