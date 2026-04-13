import { useMemo, useState, type CSSProperties } from "react";
import AppLayout from "../../layout/AppLayout";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

type ProfilePageProps = {
  mode?: ThemeMode;
  onToggleTheme?: () => void;
};

type UserProfile = {
  id: string;
  employeeId: string;
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  role: string;
  department: string;
  designation: string;
  team: string;
  manager: string;
  location: string;
  bio: string;
  joinedAt: string;
  status: "active" | "inactive" | "pending";
  timezone: string;
  language: string;
  avatarUrl?: string;
  permissions: string[];
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    desktop: boolean;
    leadAlerts: boolean;
    taskReminders: boolean;
    dealUpdates: boolean;
    weeklySummary: boolean;
  };
  security: {
    emailVerified: boolean;
    mobileVerified: boolean;
    twoFactorEnabled: boolean;
    passwordLastChanged: string;
    lastLoginAt: string;
    lastLoginDevice: string;
    activeSessions: number;
  };
  stats: {
    leadsAssigned: number;
    dealsClosed: number;
    tasksCompleted: number;
    callsMade: number;
    meetingsAttended: number;
    conversionRate: number;
  };
  assignedRecords: {
    leads: number;
    contacts: number;
    deals: number;
    pendingTasks: number;
    overdueTasks: number;
    followUpsToday: number;
  };
  recentActivities: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: "lead" | "deal" | "task" | "call" | "profile" | "security";
  }>;
  documents: Array<{
    id: string;
    name: string;
    category: string;
    uploadedAt: string;
    size: string;
  }>;
};

const mockProfile: UserProfile = {
  id: "USR-1001",
  employeeId: "MEI-EMP-009",
  fullName: "Balraj",
  displayName: "Balraj M",
  email: "balraj@meicrm.com",
  phone: "+91 98765 43210",
  alternatePhone: "+91 91234 56789",
  role: "Super Admin",
  department: "Sales Operations",
  designation: "Founder & Business Head",
  team: "Core Leadership",
  manager: "Self Managed",
  location: "Chennai, Tamil Nadu",
  bio: "Driving MEI CRM with a strong focus on sales excellence, team productivity, and scalable real-estate workflows.",
  joinedAt: "05 Jan 2026",
  status: "active",
  timezone: "Asia/Kolkata",
  language: "English / Tamil",
  permissions: [
    "View Leads",
    "Edit Leads",
    "Delete Leads",
    "Manage Deals",
    "Export Data",
    "Manage Users",
    "Manage Settings",
    "Access Reports",
    "Billing Access",
  ],
  notificationPreferences: {
    email: true,
    sms: false,
    whatsapp: true,
    desktop: true,
    leadAlerts: true,
    taskReminders: true,
    dealUpdates: true,
    weeklySummary: true,
  },
  security: {
    emailVerified: true,
    mobileVerified: true,
    twoFactorEnabled: false,
    passwordLastChanged: "02 Apr 2026",
    lastLoginAt: "12 Apr 2026, 10:15 AM",
    lastLoginDevice: "Chrome on Windows",
    activeSessions: 3,
  },
  stats: {
    leadsAssigned: 148,
    dealsClosed: 32,
    tasksCompleted: 214,
    callsMade: 486,
    meetingsAttended: 64,
    conversionRate: 21.6,
  },
  assignedRecords: {
    leads: 148,
    contacts: 84,
    deals: 19,
    pendingTasks: 11,
    overdueTasks: 3,
    followUpsToday: 7,
  },
  recentActivities: [
    {
      id: "ACT-1",
      title: "Updated profile information",
      description: "Changed display name and business bio.",
      timestamp: "Today, 09:45 AM",
      type: "profile",
    },
    {
      id: "ACT-2",
      title: "Completed task",
      description: "Closed pending follow-up task for Saravanan lead.",
      timestamp: "Today, 08:20 AM",
      type: "task",
    },
    {
      id: "ACT-3",
      title: "Closed deal",
      description: "Marked deal #DL-2201 as Won.",
      timestamp: "Yesterday, 06:10 PM",
      type: "deal",
    },
    {
      id: "ACT-4",
      title: "Added call note",
      description: "Logged discussion summary for inbound investor inquiry.",
      timestamp: "Yesterday, 03:50 PM",
      type: "call",
    },
    {
      id: "ACT-5",
      title: "Security login detected",
      description: "Signed in from Chrome on Windows.",
      timestamp: "12 Apr 2026, 10:15 AM",
      type: "security",
    },
  ],
  documents: [
    {
      id: "DOC-1",
      name: "ID Proof.pdf",
      category: "Identity",
      uploadedAt: "10 Apr 2026",
      size: "1.2 MB",
    },
    {
      id: "DOC-2",
      name: "Employment Agreement.pdf",
      category: "HR",
      uploadedAt: "09 Apr 2026",
      size: "2.8 MB",
    },
    {
      id: "DOC-3",
      name: "Profile Photo.png",
      category: "Media",
      uploadedAt: "08 Apr 2026",
      size: "640 KB",
    },
  ],
};

export default function ProfilePage({
  mode = "light",
  onToggleTheme,
}: ProfilePageProps) {
  const theme = getTheme(mode);
  const [profile] = useState<UserProfile>(mockProfile);

  const statusConfig = useMemo(() => {
    switch (profile.status) {
      case "active":
        return {
          label: "Active",
          bg: mode === "dark" ? "rgba(34,197,94,0.18)" : "#DCFCE7",
          color: mode === "dark" ? "#86EFAC" : "#166534",
          border: mode === "dark" ? "rgba(34,197,94,0.3)" : "#BBF7D0",
        };
      case "inactive":
        return {
          label: "Inactive",
          bg: mode === "dark" ? "rgba(239,68,68,0.18)" : "#FEE2E2",
          color: mode === "dark" ? "#FCA5A5" : "#991B1B",
          border: mode === "dark" ? "rgba(239,68,68,0.3)" : "#FECACA",
        };
      default:
        return {
          label: "Pending",
          bg: mode === "dark" ? "rgba(245,158,11,0.18)" : "#FEF3C7",
          color: mode === "dark" ? "#FCD34D" : "#92400E",
          border: mode === "dark" ? "rgba(245,158,11,0.3)" : "#FDE68A",
        };
    }
  }, [mode, profile.status]);

  const pageWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    padding: 24,
    background: theme.pageBg,
    minHeight: "100%",
  };

  const cardStyle: CSSProperties = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: 20,
    boxShadow:
      mode === "dark"
        ? "0 10px 30px rgba(0,0,0,0.28)"
        : "0 10px 30px rgba(15, 23, 42, 0.08)",
  };

  const sectionTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: theme.text,
    letterSpacing: 0.2,
  };

  const sectionSubTextStyle: CSSProperties = {
    margin: "6px 0 0",
    color: theme.subText,
    fontSize: 13,
    lineHeight: 1.6,
  };

  const labelStyle: CSSProperties = {
    fontSize: 12,
    color: theme.mutedText,
    fontWeight: 700,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  };

  const valueStyle: CSSProperties = {
    marginTop: 6,
    color: theme.text,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.6,
    wordBreak: "break-word",
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
  };

  const primaryButtonStyle: CSSProperties = {
    ...actionButtonStyle,
    background: theme.primary,
    border: `1px solid ${theme.primary}`,
    color: theme.inverseText,
  };

  const statCards = [
    {
      label: "Leads Assigned",
      value: profile.stats.leadsAssigned,
      accent: theme.primary,
    },
    {
      label: "Deals Closed",
      value: profile.stats.dealsClosed,
      accent: theme.success,
    },
    {
      label: "Tasks Completed",
      value: profile.stats.tasksCompleted,
      accent: theme.warning,
    },
    {
      label: "Calls Made",
      value: profile.stats.callsMade,
      accent: theme.primaryHover,
    },
    {
      label: "Meetings",
      value: profile.stats.meetingsAttended,
      accent: theme.success,
    },
    {
      label: "Conversion Rate",
      value: `${profile.stats.conversionRate}%`,
      accent: theme.warning,
    },
  ];

  return (
    <AppLayout title="My Profile" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={pageWrapStyle}>
        <section
          style={{
            ...cardStyle,
            padding: 24,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: theme.primary,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Settings / Profile
            </p>
            <h1
              style={{
                margin: "8px 0 0",
                color: theme.text,
                fontSize: 30,
                fontWeight: 900,
                lineHeight: 1.2,
              }}
            >
              My Profile
            </h1>
            <p style={{ margin: "10px 0 0", color: theme.subText, fontSize: 15 }}>
              Manage your identity, work details, permissions, security, and
              preferences from one place.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <button type="button" style={actionButtonStyle}>
              Upload Photo
            </button>
            <button type="button" style={actionButtonStyle}>
              Change Password
            </button>
            <button type="button" style={primaryButtonStyle}>
              Edit Profile
            </button>
          </div>
        </section>

        <section
          style={{
            ...cardStyle,
            padding: 24,
            display: "grid",
            gridTemplateColumns: "120px minmax(0, 1fr)",
            gap: 22,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 28,
              background:
                mode === "dark"
                  ? "linear-gradient(135deg, #1e293b, #334155)"
                  : "linear-gradient(135deg, #dbeafe, #e0f2fe)",
              border: `1px solid ${theme.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.text,
              fontSize: 36,
              fontWeight: 900,
              letterSpacing: 1,
            }}
          >
            {profile.fullName
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("")}
          </div>

          <div
            style={{
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 10,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: theme.text,
                  fontSize: 28,
                  fontWeight: 900,
                  lineHeight: 1.2,
                }}
              >
                {profile.fullName}
              </h2>

              <span
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                  background: theme.cardBgSoft,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                }}
              >
                {profile.role}
              </span>

              <span
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                  background: statusConfig.bg,
                  color: statusConfig.color,
                  border: `1px solid ${statusConfig.border}`,
                }}
              >
                {statusConfig.label}
              </span>
            </div>

            <p
              style={{
                margin: 0,
                color: theme.subText,
                fontSize: 15,
                lineHeight: 1.7,
                maxWidth: 860,
              }}
            >
              {profile.designation} • {profile.department} • {profile.team}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
              }}
            >
              <InfoMini label="Email" value={profile.email} theme={theme} />
              <InfoMini label="Phone" value={profile.phone} theme={theme} />
              <InfoMini label="Location" value={profile.location} theme={theme} />
              <InfoMini label="Joined" value={profile.joinedAt} theme={theme} />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <button type="button" style={actionButtonStyle}>
                Send Email
              </button>
              <button type="button" style={actionButtonStyle}>
                Call User
              </button>
              <button type="button" style={actionButtonStyle}>
                WhatsApp
              </button>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {statCards.map((stat) => (
            <div
              key={stat.label}
              style={{
                ...cardStyle,
                padding: 18,
                borderTop: `4px solid ${stat.accent}`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: theme.mutedText,
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {stat.label}
              </p>
              <h3
                style={{
                  margin: "12px 0 0",
                  color: theme.text,
                  fontSize: 28,
                  fontWeight: 900,
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </h3>
            </div>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.95fr)",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <CardShell
              title="Personal Information"
              subtitle="Basic identity and contact details for this user profile."
              theme={theme}
              mode={mode}
            >
              <InfoGrid
                theme={theme}
                items={[
                  { label: "Full Name", value: profile.fullName },
                  { label: "Display Name", value: profile.displayName },
                  { label: "Email Address", value: profile.email },
                  { label: "Phone Number", value: profile.phone },
                  {
                    label: "Alternate Phone",
                    value: profile.alternatePhone || "—",
                  },
                  { label: "Location", value: profile.location },
                  { label: "Timezone", value: profile.timezone },
                  { label: "Language", value: profile.language },
                ]}
              />
              <div style={{ marginTop: 18 }}>
                <div style={labelStyle}>Bio / About</div>
                <div style={valueStyle}>{profile.bio}</div>
              </div>
            </CardShell>

            <CardShell
              title="Work Information"
              subtitle="Internal work identity, reporting structure, and business context."
              theme={theme}
              mode={mode}
            >
              <InfoGrid
                theme={theme}
                items={[
                  { label: "Employee ID", value: profile.employeeId },
                  { label: "Role", value: profile.role },
                  { label: "Department", value: profile.department },
                  { label: "Designation", value: profile.designation },
                  { label: "Team", value: profile.team },
                  { label: "Manager", value: profile.manager },
                  { label: "Status", value: statusConfig.label },
                  { label: "Date Joined", value: profile.joinedAt },
                ]}
              />
            </CardShell>

            <CardShell
              title="Role & Permissions"
              subtitle="Access controls that define what this user can view and manage inside MEI CRM."
              theme={theme}
              mode={mode}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {profile.permissions.map((permission) => (
                  <span
                    key={permission}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 999,
                      border: `1px solid ${theme.border}`,
                      background: theme.cardBgSoft,
                      color: theme.text,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </CardShell>

            <CardShell
              title="Security & Access"
              subtitle="Verification status, last login details, and account protection settings."
              theme={theme}
              mode={mode}
            >
              <InfoGrid
                theme={theme}
                items={[
                  {
                    label: "Email Verified",
                    value: profile.security.emailVerified ? "Yes" : "No",
                  },
                  {
                    label: "Mobile Verified",
                    value: profile.security.mobileVerified ? "Yes" : "No",
                  },
                  {
                    label: "Two-Factor Authentication",
                    value: profile.security.twoFactorEnabled ? "Enabled" : "Disabled",
                  },
                  {
                    label: "Password Last Changed",
                    value: profile.security.passwordLastChanged,
                  },
                  {
                    label: "Last Login",
                    value: profile.security.lastLoginAt,
                  },
                  {
                    label: "Login Device",
                    value: profile.security.lastLoginDevice,
                  },
                  {
                    label: "Active Sessions",
                    value: String(profile.security.activeSessions),
                  },
                ]}
              />

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 18,
                }}
              >
                <button type="button" style={actionButtonStyle}>
                  Enable 2FA
                </button>
                <button type="button" style={actionButtonStyle}>
                  View Login History
                </button>
                <button type="button" style={actionButtonStyle}>
                  Log Out All Devices
                </button>
              </div>
            </CardShell>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <CardShell
              title="Notification Preferences"
              subtitle="Control how this user receives updates from the platform."
              theme={theme}
              mode={mode}
            >
              <PreferenceList
                theme={theme}
                items={[
                  ["Email Notifications", profile.notificationPreferences.email],
                  ["SMS Notifications", profile.notificationPreferences.sms],
                  ["WhatsApp Notifications", profile.notificationPreferences.whatsapp],
                  ["Desktop Alerts", profile.notificationPreferences.desktop],
                  ["Lead Assignment Alerts", profile.notificationPreferences.leadAlerts],
                  ["Task Due Reminders", profile.notificationPreferences.taskReminders],
                  ["Deal Update Alerts", profile.notificationPreferences.dealUpdates],
                  ["Weekly Performance Summary", profile.notificationPreferences.weeklySummary],
                ]}
              />
            </CardShell>

            <CardShell
              title="Assigned Records"
              subtitle="A quick operational snapshot of workload and accountability."
              theme={theme}
              mode={mode}
            >
              <InfoGrid
                theme={theme}
                items={[
                  {
                    label: "Assigned Leads",
                    value: String(profile.assignedRecords.leads),
                  },
                  {
                    label: "Managed Contacts",
                    value: String(profile.assignedRecords.contacts),
                  },
                  {
                    label: "Open Deals",
                    value: String(profile.assignedRecords.deals),
                  },
                  {
                    label: "Pending Tasks",
                    value: String(profile.assignedRecords.pendingTasks),
                  },
                  {
                    label: "Overdue Tasks",
                    value: String(profile.assignedRecords.overdueTasks),
                  },
                  {
                    label: "Follow-Ups Today",
                    value: String(profile.assignedRecords.followUpsToday),
                  },
                ]}
              />
            </CardShell>

            <CardShell
              title="Recent Activity"
              subtitle="Latest actions performed by this user across profile, tasks, deals, and security."
              theme={theme}
              mode={mode}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {profile.recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "36px minmax(0, 1fr)",
                      gap: 12,
                      alignItems: "start",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: theme.cardBgSoft,
                        border: `1px solid ${theme.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: theme.primary,
                        fontSize: 16,
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </div>

                    <div
                      style={{
                        paddingBottom:
                          index !== profile.recentActivities.length - 1 ? 14 : 0,
                        borderBottom:
                          index !== profile.recentActivities.length - 1
                            ? `1px solid ${theme.borderSoft}`
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          color: theme.text,
                          fontSize: 14,
                          fontWeight: 800,
                          lineHeight: 1.5,
                        }}
                      >
                        {activity.title}
                      </div>
                      <div
                        style={{
                          color: theme.subText,
                          fontSize: 13,
                          lineHeight: 1.7,
                          marginTop: 4,
                        }}
                      >
                        {activity.description}
                      </div>
                      <div
                        style={{
                          color: theme.mutedText,
                          fontSize: 12,
                          fontWeight: 700,
                          marginTop: 6,
                        }}
                      >
                        {activity.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardShell>

            <CardShell
              title="Documents"
              subtitle="Important profile-related files and uploaded records."
              theme={theme}
              mode={mode}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {profile.documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: 14,
                      borderRadius: 14,
                      border: `1px solid ${theme.border}`,
                      background: theme.cardBgSoft,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          color: theme.text,
                          fontSize: 14,
                          fontWeight: 800,
                          lineHeight: 1.5,
                          wordBreak: "break-word",
                        }}
                      >
                        {doc.name}
                      </div>
                      <div
                        style={{
                          color: theme.subText,
                          fontSize: 12,
                          marginTop: 4,
                          lineHeight: 1.6,
                        }}
                      >
                        {doc.category} • {doc.uploadedAt} • {doc.size}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button type="button" style={actionButtonStyle}>
                        Preview
                      </button>
                      <button type="button" style={actionButtonStyle}>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardShell>

            <section
              style={{
                ...cardStyle,
                padding: 20,
                border: `1px solid ${
                  mode === "dark" ? "rgba(239,68,68,0.32)" : "#FECACA"
                }`,
                background:
                  mode === "dark"
                    ? "linear-gradient(180deg, rgba(127,29,29,0.22), rgba(15,23,42,1))"
                    : "linear-gradient(180deg, #FFF1F2, #FFFFFF)",
              }}
            >
              <h3 style={sectionTitleStyle}>Danger Zone</h3>
              <p style={sectionSubTextStyle}>
                Sensitive account actions. Use only when absolutely necessary.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 16,
                }}
              >
                <button
                  type="button"
                  style={{
                    ...actionButtonStyle,
                    border: "1px solid #EF4444",
                    color: "#EF4444",
                    background: "transparent",
                  }}
                >
                  Deactivate Account
                </button>
                <button
                  type="button"
                  style={{
                    ...actionButtonStyle,
                    border: "1px solid #EF4444",
                    color: "#EF4444",
                    background: "transparent",
                  }}
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  style={{
                    ...actionButtonStyle,
                    border: "1px solid #DC2626",
                    color: "#FFFFFF",
                    background: "#DC2626",
                  }}
                >
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function CardShell({
  title,
  subtitle,
  children,
  theme,
  mode,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  theme: ReturnType<typeof getTheme>;
  mode: ThemeMode;
}) {
  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 20,
        boxShadow:
          mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.28)"
            : "0 10px 30px rgba(15, 23, 42, 0.08)",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
            letterSpacing: 0.2,
          }}
        >
          {title}
        </h3>
        {subtitle ? (
          <p
            style={{
              margin: "6px 0 0",
              color: theme.subText,
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function InfoMini({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 14,
        border: `1px solid ${theme.border}`,
        background: theme.cardBgSoft,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: theme.mutedText,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 0.35,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 6,
          color: theme.text,
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoGrid({
  items,
  theme,
}: {
  items: Array<{ label: string; value: string }>;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16,
      }}
    >
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`}>
          <div
            style={{
              fontSize: 12,
              color: theme.mutedText,
              fontWeight: 700,
              letterSpacing: 0.3,
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </div>
          <div
            style={{
              marginTop: 6,
              color: theme.text,
              fontSize: 14,
              fontWeight: 600,
              lineHeight: 1.6,
              wordBreak: "break-word",
            }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function PreferenceList({
  items,
  theme,
}: {
  items: Array<[string, boolean]>;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map(([label, enabled]) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 14,
            border: `1px solid ${theme.border}`,
            background: theme.cardBgSoft,
          }}
        >
          <span
            style={{
              color: theme.text,
              fontSize: 14,
              fontWeight: 700,
              lineHeight: 1.5,
            }}
          >
            {label}
          </span>

          <span
            style={{
              minWidth: 78,
              textAlign: "center",
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              border: `1px solid ${
                enabled ? "rgba(34,197,94,0.25)" : theme.border
              }`,
              background: enabled ? "#DCFCE7" : theme.cardBg,
              color: enabled ? "#166534" : theme.subText,
            }}
          >
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      ))}
    </div>
  );
}

function getActivityIcon(type: UserProfile["recentActivities"][number]["type"]) {
  switch (type) {
    case "lead":
      return "L";
    case "deal":
      return "D";
    case "task":
      return "T";
    case "call":
      return "C";
    case "profile":
      return "P";
    case "security":
      return "S";
    default:
      return "•";
  }
}