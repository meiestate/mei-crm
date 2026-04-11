import { useMemo, useState, type CSSProperties } from "react";
import AppLayout from "../../layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

import SettingsHeader from "./SettingsHeader";
import SettingsSidebarNav, {
  type SettingsSectionItem,
  type SettingsSectionKey,
} from "./SettingsSidebarNav";
import ProfileSettingsCard from "./ProfileSettingsCard";
import CompanySettingsCard from "./CompanySettingsCard";
import WorkspacePreferencesCard from "./WorkspacePreferencesCard";
import TeamRolesCard from "./TeamRolesCard";
import PipelinesCard from "./PipelinesCard";
import LeadSourcesCard from "./LeadSourcesCard";
import NotificationsCard from "./NotificationsCard";
import SecurityCard from "./SecurityCard";
import BillingCard from "./BillingCard";
import IntegrationsCard from "./IntegrationsCard";
import DataBackupCard from "./DataBackupCard";
import AuditLogsCard from "./AuditLogsCard";

type SettingsPageProps = {
  mode?: ThemeMode;
  onToggleTheme?: () => void;
};

const settingsSections: SettingsSectionItem[] = [
  { key: "profile", label: "Profile", description: "Personal account settings" },
  { key: "company", label: "Company", description: "Business identity and details" },
  {
    key: "preferences",
    label: "Workspace Preferences",
    description: "Theme and app behavior",
  },
  { key: "team", label: "Team & Roles", description: "Users, invites, permissions" },
  { key: "pipelines", label: "Pipelines", description: "Lead and deal stages" },
  { key: "sources", label: "Lead Sources", description: "Acquisition channels" },
  {
    key: "notifications",
    label: "Notifications",
    description: "Reminder and alert preferences",
  },
  { key: "security", label: "Security", description: "Passwords, sessions, access" },
  { key: "billing", label: "Billing", description: "Plan, invoices, seat usage" },
  {
    key: "integrations",
    label: "Integrations",
    description: "External tools and services",
  },
  { key: "data", label: "Data & Backup", description: "Export, import, restore" },
  { key: "audit", label: "Audit Logs", description: "Workspace activity history" },
];

export default function SettingsPage({
  mode = "light",
  onToggleTheme,
}: SettingsPageProps) {
  const theme = getTheme(mode);

  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] =
    useState<SettingsSectionKey>("profile");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Balraj",
    email: "balraj@meicrm.com",
    mobile: "+91 98765 43210",
    jobTitle: "Founder",
    language: "English",
    timezone: "Asia/Kolkata",
  });

  const [company, setCompany] = useState({
    companyName: "MEI CRM",
    brandName: "MEI",
    businessType: "Real Estate CRM",
    gstNumber: "33ABCDE1234F1Z5",
    reraNumber: "TN/REA/2026/001",
    email: "support@meicrm.com",
    phone: "+91 90000 11111",
    website: "www.meicrm.com",
    address: "Anna Salai",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600002",
    currency: "INR",
  });

  const [preferences, setPreferences] = useState({
    themeMode: mode,
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12-hour",
    defaultLandingPage: "Dashboard",
    compactTableMode: false,
    sidebarCollapsed: false,
    autoSaveForms: true,
  });

  const [teamMembers] = useState([
    {
      id: "tm1",
      name: "Arun Kumar",
      email: "arun@meicrm.com",
      role: "Admin",
      department: "Operations",
      status: "Active" as const,
      lastActive: "Today, 10:45 AM",
    },
    {
      id: "tm2",
      name: "Divya S",
      email: "divya@meicrm.com",
      role: "Sales Manager",
      department: "Sales",
      status: "Active" as const,
      lastActive: "Today, 09:12 AM",
    },
    {
      id: "tm3",
      name: "Rahul R",
      email: "rahul@meicrm.com",
      role: "Telecaller",
      department: "Lead Qualification",
      status: "Invited" as const,
      lastActive: "Invitation pending",
    },
    {
      id: "tm4",
      name: "Naveen P",
      email: "naveen@meicrm.com",
      role: "Sales Executive",
      department: "Field Sales",
      status: "Inactive" as const,
      lastActive: "2 days ago",
    },
  ]);

  const [leadStages] = useState([
    { id: "ls1", name: "New", color: "#3B82F6", order: 1 },
    { id: "ls2", name: "Contacted", color: "#8B5CF6", order: 2 },
    { id: "ls3", name: "Follow-up", color: "#F59E0B", order: 3 },
    { id: "ls4", name: "Qualified", color: "#06B6D4", order: 4 },
    { id: "ls5", name: "Site Visit", color: "#10B981", order: 5 },
    { id: "ls6", name: "Negotiation", color: "#F97316", order: 6 },
    { id: "ls7", name: "Converted", color: "#22C55E", order: 7 },
    { id: "ls8", name: "Dropped", color: "#EF4444", order: 8 },
  ]);

  const [dealStages] = useState([
    { id: "ds1", name: "Open", color: "#3B82F6", order: 1 },
    { id: "ds2", name: "Proposal", color: "#8B5CF6", order: 2 },
    { id: "ds3", name: "Negotiation", color: "#F59E0B", order: 3 },
    { id: "ds4", name: "Won", color: "#22C55E", order: 4 },
    { id: "ds5", name: "Lost", color: "#EF4444", order: 5 },
  ]);

  const [leadSources] = useState([
    { id: "src1", name: "Website", type: "Inbound", active: true },
    { id: "src2", name: "Facebook Ads", type: "Paid", active: true },
    { id: "src3", name: "Instagram", type: "Social", active: true },
    { id: "src4", name: "WhatsApp", type: "Direct", active: true },
    { id: "src5", name: "Referral", type: "Organic", active: true },
    { id: "src6", name: "Broker", type: "Partner", active: false },
  ]);

  const [notifications, setNotifications] = useState({
    leadAssignedInApp: true,
    leadAssignedEmail: true,
    taskDueToday: true,
    overdueTask: true,
    followUpReminder: true,
    dealWonLost: true,
    dailyDigest: false,
    whatsappAlerts: false,
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    suspiciousLoginAlerts: true,
    sessionTimeout: "30 minutes",
  });

  const [billing] = useState({
    currentPlan: "Professional",
    renewalDate: "30 Apr 2026",
    seatUsage: "8 / 12 Users",
    monthlyBill: "₹9,999",
    paymentMethod: "Visa ending in 4242",
    billingEmail: "accounts@meicrm.com",
  });

  const [integrations] = useState([
    {
      id: "int1",
      name: "WhatsApp",
      description: "Send lead messages and follow-up alerts",
      status: "Connected" as const,
    },
    {
      id: "int2",
      name: "Google Calendar",
      description: "Sync meetings and reminders",
      status: "Connected" as const,
    },
    {
      id: "int3",
      name: "Gmail",
      description: "Track conversations and templates",
      status: "Not Connected" as const,
    },
    {
      id: "int4",
      name: "Razorpay",
      description: "Billing and subscription collection",
      status: "Not Connected" as const,
    },
    {
      id: "int5",
      name: "Meta Ads",
      description: "Lead capture from Facebook and Instagram",
      status: "Connected" as const,
    },
  ]);

  const [backupSummary] = useState({
    lastBackupAt: "11 Apr 2026, 03:10 AM",
    totalBackups: "24",
    storageUsed: "1.8 GB",
  });

  const [auditLogs] = useState([
    {
      id: "a1",
      timestamp: "11 Apr 2026, 09:10 AM",
      user: "Balraj",
      module: "Settings",
      action: "Updated company profile",
      record: "Company Details",
      status: "Success" as const,
    },
    {
      id: "a2",
      timestamp: "11 Apr 2026, 08:42 AM",
      user: "Arun Kumar",
      module: "Team",
      action: "Invited new user",
      record: "rahul@meicrm.com",
      status: "Success" as const,
    },
    {
      id: "a3",
      timestamp: "10 Apr 2026, 07:30 PM",
      user: "Divya S",
      module: "Pipelines",
      action: "Edited lead stage order",
      record: "Lead Pipeline",
      status: "Warning" as const,
    },
    {
      id: "a4",
      timestamp: "10 Apr 2026, 04:15 PM",
      user: "System",
      module: "Security",
      action: "Suspicious login attempt blocked",
      record: "Unknown device",
      status: "Failed" as const,
    },
  ]);

  const filteredSections = useMemo(() => {
    if (!search.trim()) return settingsSections;
    const query = search.toLowerCase();
    return settingsSections.filter(
      (section) =>
        section.label.toLowerCase().includes(query) ||
        section.description.toLowerCase().includes(query)
    );
  }, [search]);

  const currentSectionMeta =
    settingsSections.find((section) => section.key === activeSection) ??
    settingsSections[0];

  const markDirty = () => setHasUnsavedChanges(true);

  const handleSaveAll = () => {
    setHasUnsavedChanges(false);
    alert("Settings saved successfully.");
  };

  const handleReset = () => {
    setSearch("");
    setHasUnsavedChanges(false);
    alert("Changes reset.");
  };

  return (
    <AppLayout title="Settings" mode={mode} onToggleTheme={onToggleTheme}>
      <div
        style={{
          padding: 20,
          background: theme.pageBg,
          color: theme.text,
          minHeight: "100%",
        }}
      >
        <div style={{ display: "grid", gap: 20 }}>
          <SettingsHeader
            mode={mode}
            searchValue={search}
            onSearchChange={setSearch}
            onReset={handleReset}
            onSave={handleSaveAll}
          />

          <div style={layoutGridStyle}>
            <SettingsSidebarNav
              mode={mode}
              sections={filteredSections}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />

            <section style={{ display: "grid", gap: 20 }}>
              <div
                style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: theme.text,
                      }}
                    >
                      {currentSectionMeta.label}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: theme.subText,
                        marginTop: 6,
                      }}
                    >
                      {currentSectionMeta.description}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      background: theme.cardBgSoft,
                      border: `1px solid ${theme.borderSoft}`,
                      borderRadius: 999,
                      padding: "8px 12px",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: hasUnsavedChanges
                          ? theme.warning
                          : theme.success,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: theme.text,
                      }}
                    >
                      {hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
                    </span>
                  </div>
                </div>
              </div>

              {activeSection === "profile" && (
                <ProfileSettingsCard
                  mode={mode}
                  profile={profile}
                  twoFactorEnabled={security.twoFactorEnabled}
                  onChange={(field, value) => {
                    setProfile((prev) => ({ ...prev, [field]: value }));
                    markDirty();
                  }}
                  onUpdateProfile={() => alert("Profile updated")}
                  onChangePassword={() => alert("Open change password modal")}
                  onLogout={() => alert("Logout action")}
                />
              )}

              {activeSection === "company" && (
                <CompanySettingsCard
                  mode={mode}
                  company={company}
                  onChange={(field, value) => {
                    setCompany((prev) => ({ ...prev, [field]: value }));
                    markDirty();
                  }}
                  onSave={() => alert("Company details saved")}
                  onUploadLogo={() => alert("Open logo upload modal")}
                />
              )}

              {activeSection === "preferences" && (
                <WorkspacePreferencesCard
                  mode={mode}
                  preferences={preferences}
                  onFieldChange={(field, value) => {
                    setPreferences((prev) => ({
                      ...prev,
                      [field]: value,
                    }));
                    markDirty();
                  }}
                  onSave={() => alert("Preferences saved")}
                  onReset={() => alert("Preferences reset")}
                />
              )}

              {activeSection === "team" && (
                <TeamRolesCard
                  mode={mode}
                  members={teamMembers}
                  onInviteUser={() => alert("Open invite user modal")}
                  onOpenRolesPermissions={() =>
                    alert("Open roles & permissions panel")
                  }
                />
              )}

              {activeSection === "pipelines" && (
                <PipelinesCard
                  mode={mode}
                  leadStages={leadStages}
                  dealStages={dealStages}
                  onAddLeadStage={() => alert("Open add lead stage modal")}
                  onReorderLeadStages={() => alert("Open reorder lead stages")}
                  onAddDealStage={() => alert("Open add deal stage modal")}
                  onEditDealMapping={() => alert("Open deal mapping editor")}
                />
              )}

              {activeSection === "sources" && (
                <LeadSourcesCard
                  mode={mode}
                  sources={leadSources}
                  onAddSource={() => alert("Open add source modal")}
                  onImportSources={() => alert("Open import sources flow")}
                />
              )}

              {activeSection === "notifications" && (
                <NotificationsCard
                  mode={mode}
                  notifications={notifications}
                  onFieldChange={(field, value) => {
                    setNotifications((prev) => ({
                      ...prev,
                      [field]: value,
                    }));
                    markDirty();
                  }}
                  onSave={() => alert("Notifications saved")}
                  onReset={() => alert("Notifications reset")}
                />
              )}

              {activeSection === "security" && (
                <SecurityCard
                  mode={mode}
                  security={security}
                  onFieldChange={(field, value) => {
                    setSecurity((prev) => ({
                      ...prev,
                      [field]: value,
                    }));
                    markDirty();
                  }}
                  onChangePassword={() => alert("Open change password modal")}
                  onViewSessions={() => alert("Open active sessions panel")}
                  onLogoutAllDevices={() => alert("Logout from all devices")}
                  onSave={() => alert("Security settings saved")}
                />
              )}

              {activeSection === "billing" && (
                <BillingCard
                  mode={mode}
                  billing={billing}
                  onUpgradePlan={() => alert("Open upgrade plan modal")}
                  onDownloadInvoice={() => alert("Download latest invoice")}
                  onManagePaymentMethod={() =>
                    alert("Open payment method settings")
                  }
                  onViewBillingHistory={() => alert("Open billing history")}
                />
              )}

              {activeSection === "integrations" && (
                <IntegrationsCard
                  mode={mode}
                  integrations={integrations}
                  onConnect={(integration) =>
                    alert(`Connect ${integration.name}`)
                  }
                  onConfigure={(integration) =>
                    alert(`Configure ${integration.name}`)
                  }
                  onViewDetails={(integration) =>
                    alert(`View details for ${integration.name}`)
                  }
                />
              )}

              {activeSection === "data" && (
                <DataBackupCard
                  mode={mode}
                  backupSummary={backupSummary}
                  onExportLeads={() => alert("Export leads CSV")}
                  onExportContacts={() => alert("Export contacts CSV")}
                  onExportDeals={() => alert("Export deals CSV")}
                  onImportData={() => alert("Open import data flow")}
                  onCreateBackup={() => alert("Create new backup")}
                  onRestoreBackup={() => alert("Open restore backup panel")}
                  onDeleteDemoData={() => alert("Delete demo data action")}
                />
              )}

              {activeSection === "audit" && (
                <AuditLogsCard
                  mode={mode}
                  logs={auditLogs}
                  onRefreshLogs={() => alert("Refresh audit logs")}
                  onExportLogs={() => alert("Export audit logs CSV")}
                />
              )}
            </section>
          </div>

          {hasUnsavedChanges && (
            <div style={stickyBarWrapStyle}>
              <div
                style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 18,
                  padding: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                  boxShadow:
                    mode === "dark"
                      ? "0 14px 40px rgba(0,0,0,0.34)"
                      : "0 14px 40px rgba(15, 23, 42, 0.12)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: theme.text,
                    }}
                  >
                    You have unsaved changes
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 13,
                      color: theme.subText,
                    }}
                  >
                    Save now to keep your configuration updated across the workspace.
                  </div>
                </div>

                <div style={stickyBarActionsStyle}>
                  <button
                    style={secondaryButtonStyle(theme)}
                    onClick={handleReset}
                  >
                    Discard
                  </button>
                  <button
                    style={primaryButtonStyle(theme)}
                    onClick={handleSaveAll}
                  >
                    Save All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

const layoutGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "300px minmax(0, 1fr)",
  gap: 20,
  alignItems: "start",
};

const stickyBarWrapStyle: CSSProperties = {
  position: "sticky",
  bottom: 18,
  zIndex: 20,
};

const stickyBarActionsStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
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
  };
}