import type { CSSProperties } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type ProfileData = {
  fullName: string;
  email: string;
  mobile: string;
  jobTitle: string;
  language: string;
  timezone: string;
};

type ProfileSettingsCardProps = {
  mode?: ThemeMode;
  profile: ProfileData;
  twoFactorEnabled?: boolean;
  onChange: (field: keyof ProfileData, value: string) => void;
  onUpdateProfile?: () => void;
  onChangePassword?: () => void;
  onLogout?: () => void;
};

export default function ProfileSettingsCard({
  mode = "light",
  profile,
  twoFactorEnabled = false,
  onChange,
  onUpdateProfile,
  onChangePassword,
  onLogout,
}: ProfileSettingsCardProps) {
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
          Profile Settings
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.5,
            color: theme.subText,
          }}
        >
          Update your personal account details and account identity.
        </div>
      </div>

      <div style={grid2Style}>
        <Field
          label="Full Name"
          value={profile.fullName}
          onChange={(value) => onChange("fullName", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Email Address"
          value={profile.email}
          onChange={(value) => onChange("email", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Mobile Number"
          value={profile.mobile}
          onChange={(value) => onChange("mobile", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Job Title"
          value={profile.jobTitle}
          onChange={(value) => onChange("jobTitle", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Preferred Language"
          value={profile.language}
          onChange={(value) => onChange("language", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Time Zone"
          value={profile.timezone}
          onChange={(value) => onChange("timezone", value)}
          theme={theme}
          mode={mode}
        />
      </div>

      <div style={statGridStyle}>
        <MiniStatCard title="Last Login" value="Today, 08:55 AM" theme={theme} />
        <MiniStatCard title="Account Status" value="Active" theme={theme} />
        <MiniStatCard
          title="Two-Factor Auth"
          value={twoFactorEnabled ? "Enabled" : "Disabled"}
          theme={theme}
        />
      </div>

      <div style={actionsRowStyle}>
        <button
          type="button"
          onClick={onUpdateProfile}
          style={primaryButtonStyle(theme)}
        >
          Update Profile
        </button>

        <button
          type="button"
          onClick={onChangePassword}
          style={secondaryButtonStyle(theme)}
        >
          Change Password
        </button>

        <button
          type="button"
          onClick={onLogout}
          style={dangerButtonStyle()}
        >
          Logout
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

function MiniStatCard({
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

const grid2Style: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
};

const statGridStyle: CSSProperties = {
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