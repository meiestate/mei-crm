import React, { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type SettingsPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

export default function SettingsPage({
  mode,
  onToggleTheme,
}: SettingsPageProps) {
  const colors = getTheme(mode);

  const [profile, setProfile] = useState({
    fullName: "Balraj",
    email: "balraj@mei-crm.com",
    phone: "9876543210",
    role: "Admin",
  });

  const [business, setBusiness] = useState({
    companyName: "MEI CRM",
    website: "www.meicrm.com",
    city: "Chennai",
    timezone: "Asia/Kolkata",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    taskReminders: true,
    leadNotifications: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30 Minutes",
    loginAlerts: true,
  });

  const handleSave = (sectionName: string) => {
    alert(`${sectionName} settings saved successfully.`);
  };

  return (
    <AppLayout title="Settings" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 30, color: colors.text }}>
            Settings
          </h2>
          <p style={{ margin: "8px 0 0", color: colors.subText }}>
            Manage profile, business, notifications, security, and appearance.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          <SectionCard title="Profile Settings" colors={colors}>
            <InputField
              label="Full Name"
              value={profile.fullName}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, fullName: value }))
              }
              colors={colors}
            />
            <InputField
              label="Email"
              value={profile.email}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, email: value }))
              }
              colors={colors}
            />
            <InputField
              label="Phone"
              value={profile.phone}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, phone: value }))
              }
              colors={colors}
            />
            <InputField
              label="Role"
              value={profile.role}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, role: value }))
              }
              colors={colors}
            />

            <ActionButton
              label="Save Profile"
              onClick={() => handleSave("Profile")}
              colors={colors}
            />
          </SectionCard>

          <SectionCard title="Business Settings" colors={colors}>
            <InputField
              label="Company Name"
              value={business.companyName}
              onChange={(value) =>
                setBusiness((prev) => ({ ...prev, companyName: value }))
              }
              colors={colors}
            />
            <InputField
              label="Website"
              value={business.website}
              onChange={(value) =>
                setBusiness((prev) => ({ ...prev, website: value }))
              }
              colors={colors}
            />
            <InputField
              label="City"
              value={business.city}
              onChange={(value) =>
                setBusiness((prev) => ({ ...prev, city: value }))
              }
              colors={colors}
            />
            <InputField
              label="Timezone"
              value={business.timezone}
              onChange={(value) =>
                setBusiness((prev) => ({ ...prev, timezone: value }))
              }
              colors={colors}
            />

            <ActionButton
              label="Save Business"
              onClick={() => handleSave("Business")}
              colors={colors}
            />
          </SectionCard>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          <SectionCard title="Notification Settings" colors={colors}>
            <ToggleRow
              label="Email Alerts"
              checked={notifications.emailAlerts}
              onChange={() =>
                setNotifications((prev) => ({
                  ...prev,
                  emailAlerts: !prev.emailAlerts,
                }))
              }
              colors={colors}
            />
            <ToggleRow
              label="SMS Alerts"
              checked={notifications.smsAlerts}
              onChange={() =>
                setNotifications((prev) => ({
                  ...prev,
                  smsAlerts: !prev.smsAlerts,
                }))
              }
              colors={colors}
            />
            <ToggleRow
              label="Task Reminders"
              checked={notifications.taskReminders}
              onChange={() =>
                setNotifications((prev) => ({
                  ...prev,
                  taskReminders: !prev.taskReminders,
                }))
              }
              colors={colors}
            />
            <ToggleRow
              label="Lead Notifications"
              checked={notifications.leadNotifications}
              onChange={() =>
                setNotifications((prev) => ({
                  ...prev,
                  leadNotifications: !prev.leadNotifications,
                }))
              }
              colors={colors}
            />

            <ActionButton
              label="Save Notifications"
              onClick={() => handleSave("Notification")}
              colors={colors}
            />
          </SectionCard>

          <SectionCard title="Security Settings" colors={colors}>
            <ToggleRow
              label="Two-Factor Authentication"
              checked={security.twoFactorAuth}
              onChange={() =>
                setSecurity((prev) => ({
                  ...prev,
                  twoFactorAuth: !prev.twoFactorAuth,
                }))
              }
              colors={colors}
            />

            <ToggleRow
              label="Login Alerts"
              checked={security.loginAlerts}
              onChange={() =>
                setSecurity((prev) => ({
                  ...prev,
                  loginAlerts: !prev.loginAlerts,
                }))
              }
              colors={colors}
            />

            <div style={{ display: "grid", gap: 8 }}>
              <label
                style={{
                  color: colors.subText,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Session Timeout
              </label>

              <select
                value={security.sessionTimeout}
                onChange={(e) =>
                  setSecurity((prev) => ({
                    ...prev,
                    sessionTimeout: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: `1px solid ${colors.border}`,
                  background: colors.inputBg,
                  color: colors.text,
                  outline: "none",
                  fontSize: 14,
                }}
              >
                <option>15 Minutes</option>
                <option>30 Minutes</option>
                <option>1 Hour</option>
                <option>2 Hours</option>
              </select>
            </div>

            <ActionButton
              label="Save Security"
              onClick={() => handleSave("Security")}
              colors={colors}
            />
          </SectionCard>
        </div>

        <SectionCard title="Appearance Settings" colors={colors}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <AppearanceCard
              title="Light Mode"
              description="Bright white, clean, modern interface."
              active={mode === "light"}
              colors={colors}
            />
            <AppearanceCard
              title="Dark Navy Mode"
              description="Premium dark navy business interface."
              active={mode === "dark"}
              colors={colors}
            />
          </div>

          <div style={{ marginTop: 18 }}>
            <button
              onClick={onToggleTheme}
              style={{
                border: "none",
                background: colors.primary,
                color: "#ffffff",
                padding: "12px 18px",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Toggle Theme
            </button>
          </div>
        </SectionCard>
      </div>
    </AppLayout>
  );
}

function SectionCard({
  title,
  colors,
  children,
}: {
  title: string;
  colors: ReturnType<typeof getTheme>;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 20,
        padding: 24,
        boxShadow: colors.shadowSoft,
        display: "grid",
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: colors.text,
        }}
      >
        {title}
      </div>

      {children}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label
        style={{
          color: colors.subText,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          background: colors.inputBg,
          color: colors.text,
          outline: "none",
          fontSize: 14,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
  colors,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        alignItems: "center",
        padding: "14px 16px",
        borderRadius: 14,
        border: `1px solid ${colors.border}`,
        background: colors.cardBgSoft,
      }}
    >
      <span
        style={{
          color: colors.text,
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {label}
      </span>

      <button
        onClick={onChange}
        style={{
          border: "none",
          background: checked ? colors.success : colors.borderStrong,
          color: "#ffffff",
          padding: "8px 14px",
          borderRadius: 999,
          fontWeight: 700,
          cursor: "pointer",
          minWidth: 72,
        }}
      >
        {checked ? "ON" : "OFF"}
      </button>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  colors,
}: {
  label: string;
  onClick: () => void;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        background: colors.primary,
        color: "#ffffff",
        padding: "12px 16px",
        borderRadius: 12,
        fontWeight: 700,
        cursor: "pointer",
        justifySelf: "start",
      }}
    >
      {label}
    </button>
  );
}

function AppearanceCard({
  title,
  description,
  active,
  colors,
}: {
  title: string;
  description: string;
  active: boolean;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        border: `1px solid ${active ? colors.primary : colors.border}`,
        background: active ? colors.cardBgSoft : colors.cardBg,
        borderRadius: 18,
        padding: 18,
      }}
    >
      <div
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: 800,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 8,
          color: colors.subText,
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>

      <div style={{ marginTop: 12 }}>
        <span
          style={{
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            color: "#ffffff",
            background: active ? colors.primary : colors.subText,
          }}
        >
          {active ? "Active" : "Available"}
        </span>
      </div>
    </div>
  );
}