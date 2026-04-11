import type { CSSProperties } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type NotificationsData = {
  leadAssignedInApp: boolean;
  leadAssignedEmail: boolean;
  taskDueToday: boolean;
  overdueTask: boolean;
  followUpReminder: boolean;
  dealWonLost: boolean;
  dailyDigest: boolean;
  whatsappAlerts: boolean;
};

type NotificationsCardProps = {
  mode?: ThemeMode;
  notifications: NotificationsData;
  onFieldChange: (field: keyof NotificationsData, value: boolean) => void;
  onSave?: () => void;
  onReset?: () => void;
};

export default function NotificationsCard({
  mode = "light",
  notifications,
  onFieldChange,
  onSave,
  onReset,
}: NotificationsCardProps) {
  const theme = getTheme(mode);

  const enabledCount = Object.values(notifications).filter(Boolean).length;
  const totalCount = Object.keys(notifications).length;

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
          Notification Settings
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.5,
            color: theme.subText,
          }}
        >
          Choose which alerts you receive and how they are delivered across your
          workspace.
        </div>
      </div>

      <div style={statsGridStyle}>
        <InfoCard
          title="Enabled Alerts"
          value={`${enabledCount}`}
          theme={theme}
        />
        <InfoCard
          title="Disabled Alerts"
          value={`${totalCount - enabledCount}`}
          theme={theme}
        />
        <InfoCard
          title="Coverage"
          value={`${enabledCount}/${totalCount}`}
          theme={theme}
        />
      </div>

      <div style={toggleListStyle}>
        <ToggleRow
          label="Lead Assigned — In-App"
          description="Get notified inside the workspace when a lead is assigned."
          checked={notifications.leadAssignedInApp}
          onChange={(checked) => onFieldChange("leadAssignedInApp", checked)}
          theme={theme}
        />

        <ToggleRow
          label="Lead Assigned — Email"
          description="Receive lead assignment alerts by email."
          checked={notifications.leadAssignedEmail}
          onChange={(checked) => onFieldChange("leadAssignedEmail", checked)}
          theme={theme}
        />

        <ToggleRow
          label="Task Due Today"
          description="Get reminded about tasks that are scheduled for today."
          checked={notifications.taskDueToday}
          onChange={(checked) => onFieldChange("taskDueToday", checked)}
          theme={theme}
        />

        <ToggleRow
          label="Overdue Task Alerts"
          description="Receive alerts when tasks or follow-ups become overdue."
          checked={notifications.overdueTask}
          onChange={(checked) => onFieldChange("overdueTask", checked)}
          theme={theme}
        />

        <ToggleRow
          label="Follow-up Reminders"
          description="Get reminders before pending lead follow-ups."
          checked={notifications.followUpReminder}
          onChange={(checked) => onFieldChange("followUpReminder", checked)}
          theme={theme}
        />

        <ToggleRow
          label="Deal Won/Lost Updates"
          description="Track important pipeline outcome changes in real time."
          checked={notifications.dealWonLost}
          onChange={(checked) => onFieldChange("dealWonLost", checked)}
          theme={theme}
        />

        <ToggleRow
          label="Daily Digest"
          description="Receive one consolidated summary of daily activity."
          checked={notifications.dailyDigest}
          onChange={(checked) => onFieldChange("dailyDigest", checked)}
          theme={theme}
        />

        <ToggleRow
          label="WhatsApp Alerts"
          description="Send selected alerts to WhatsApp for faster visibility."
          checked={notifications.whatsappAlerts}
          onChange={(checked) => onFieldChange("whatsappAlerts", checked)}
          theme={theme}
        />
      </div>

      <div style={actionsRowStyle}>
        <button type="button" onClick={onSave} style={primaryButtonStyle(theme)}>
          Save Notifications
        </button>

        <button
          type="button"
          onClick={onReset}
          style={secondaryButtonStyle(theme)}
        >
          Reset Notifications
        </button>
      </div>
    </div>
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