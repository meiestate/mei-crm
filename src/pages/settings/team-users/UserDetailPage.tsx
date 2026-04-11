import { useMemo, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";

type UserRole =
  | "Super Admin"
  | "Admin"
  | "Manager"
  | "Sales Executive"
  | "Telecaller"
  | "Support"
  | "Viewer";

type UserStatus = "Active" | "Inactive" | "Pending" | "Suspended";

type TeamUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  joinedAt: string;
  lastActive: string;
};

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "login" | "update" | "permission" | "invite" | "status";
};

const STORAGE_KEY = "mei-crm-team-users";

const fallbackUsers: TeamUser[] = [
  {
    id: "USR-1001",
    name: "Arun Kumar",
    email: "arun@mei.com",
    phone: "+91 9876543210",
    role: "Super Admin",
    department: "Management",
    status: "Active",
    joinedAt: "2026-01-05",
    lastActive: "2026-04-11 09:40",
  },
  {
    id: "USR-1002",
    name: "Priya Sharma",
    email: "priya@mei.com",
    phone: "+91 9876501234",
    role: "Manager",
    department: "Sales",
    status: "Active",
    joinedAt: "2026-01-14",
    lastActive: "2026-04-11 08:10",
  },
  {
    id: "USR-1003",
    name: "Rahul Verma",
    email: "rahul@mei.com",
    phone: "+91 9988776655",
    role: "Sales Executive",
    department: "Field Sales",
    status: "Pending",
    joinedAt: "2026-02-01",
    lastActive: "2026-04-10 18:45",
  },
  {
    id: "USR-1004",
    name: "Divya Nair",
    email: "divya@mei.com",
    phone: "+91 9345678912",
    role: "Telecaller",
    department: "Inside Sales",
    status: "Active",
    joinedAt: "2026-02-11",
    lastActive: "2026-04-11 11:20",
  },
  {
    id: "USR-1005",
    name: "Karthik Raj",
    email: "karthik@mei.com",
    phone: "+91 9000012345",
    role: "Support",
    department: "Operations",
    status: "Inactive",
    joinedAt: "2026-01-20",
    lastActive: "2026-04-08 16:00",
  },
  {
    id: "USR-1006",
    name: "Meena S",
    email: "meena@mei.com",
    phone: "+91 9555511110",
    role: "Viewer",
    department: "Accounts",
    status: "Suspended",
    joinedAt: "2026-03-02",
    lastActive: "2026-04-04 10:10",
  },
];

const rolePermissionMap: Record<
  UserRole,
  {
    leads: string;
    deals: string;
    tasks: string;
    contacts: string;
    settings: string;
    reports: string;
  }
> = {
  "Super Admin": {
    leads: "Full Access",
    deals: "Full Access",
    tasks: "Full Access",
    contacts: "Full Access",
    settings: "Full Access",
    reports: "Full Access",
  },
  Admin: {
    leads: "Full Access",
    deals: "Full Access",
    tasks: "Full Access",
    contacts: "Full Access",
    settings: "Limited Admin",
    reports: "Full Access",
  },
  Manager: {
    leads: "Create / Edit / View",
    deals: "Create / Edit / View",
    tasks: "Assign / Track / View",
    contacts: "Create / Edit / View",
    settings: "No Access",
    reports: "Team Reports",
  },
  "Sales Executive": {
    leads: "Own + Assigned",
    deals: "Own + Assigned",
    tasks: "Own Tasks",
    contacts: "Create / View",
    settings: "No Access",
    reports: "Basic View",
  },
  Telecaller: {
    leads: "View / Update Calls",
    deals: "No Access",
    tasks: "Own Tasks",
    contacts: "View / Update",
    settings: "No Access",
    reports: "Call Summary",
  },
  Support: {
    leads: "View Only",
    deals: "View Only",
    tasks: "Assigned Tasks",
    contacts: "View Only",
    settings: "No Access",
    reports: "Limited View",
  },
  Viewer: {
    leads: "View Only",
    deals: "View Only",
    tasks: "View Only",
    contacts: "View Only",
    settings: "No Access",
    reports: "View Only",
  },
};

function getStoredUsers(): TeamUser[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return fallbackUsers;

    const parsed = JSON.parse(saved) as TeamUser[];
    if (!Array.isArray(parsed)) return fallbackUsers;

    return parsed;
  } catch {
    return fallbackUsers;
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateText: string) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return dateText;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateText: string) {
  const date = new Date(dateText.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return dateText;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function daysSince(dateText: string) {
  const date = new Date(dateText.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "--";

  const diff = Date.now() - date.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  return `${days} day${days === 1 ? "" : "s"}`;
}

function getRoleBadgeStyle(role: UserRole): CSSProperties {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    border: "1px solid transparent",
    whiteSpace: "nowrap",
  };

  switch (role) {
    case "Super Admin":
      return {
        ...base,
        background: "#ede9fe",
        color: "#6d28d9",
        borderColor: "#ddd6fe",
      };
    case "Admin":
      return {
        ...base,
        background: "#e0f2fe",
        color: "#0369a1",
        borderColor: "#bae6fd",
      };
    case "Manager":
      return {
        ...base,
        background: "#ecfccb",
        color: "#4d7c0f",
        borderColor: "#d9f99d",
      };
    case "Sales Executive":
      return {
        ...base,
        background: "#fef3c7",
        color: "#b45309",
        borderColor: "#fde68a",
      };
    case "Telecaller":
      return {
        ...base,
        background: "#fce7f3",
        color: "#be185d",
        borderColor: "#fbcfe8",
      };
    case "Support":
      return {
        ...base,
        background: "#e0e7ff",
        color: "#4338ca",
        borderColor: "#c7d2fe",
      };
    default:
      return {
        ...base,
        background: "#f1f5f9",
        color: "#334155",
        borderColor: "#e2e8f0",
      };
  }
}

function getStatusBadgeStyle(status: UserStatus): CSSProperties {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    border: "1px solid transparent",
    whiteSpace: "nowrap",
  };

  switch (status) {
    case "Active":
      return {
        ...base,
        background: "#ecfdf3",
        color: "#15803d",
        borderColor: "#bbf7d0",
      };
    case "Inactive":
      return {
        ...base,
        background: "#f1f5f9",
        color: "#64748b",
        borderColor: "#e2e8f0",
      };
    case "Pending":
      return {
        ...base,
        background: "#fff7ed",
        color: "#c2410c",
        borderColor: "#fed7aa",
      };
    case "Suspended":
      return {
        ...base,
        background: "#fef2f2",
        color: "#b91c1c",
        borderColor: "#fecaca",
      };
    default:
      return base;
  }
}

function getStatusDotColor(status: UserStatus) {
  switch (status) {
    case "Active":
      return "#22c55e";
    case "Pending":
      return "#f97316";
    case "Suspended":
      return "#ef4444";
    default:
      return "#94a3b8";
  }
}

function getActivityColor(type: ActivityItem["type"]) {
  switch (type) {
    case "login":
      return "#2563eb";
    case "update":
      return "#7c3aed";
    case "permission":
      return "#0891b2";
    case "invite":
      return "#d97706";
    case "status":
      return "#16a34a";
    default:
      return "#64748b";
  }
}

function buildUserActivities(user: TeamUser): ActivityItem[] {
  return [
    {
      id: `${user.id}-a1`,
      title: "Latest login detected",
      description: `${user.name} last accessed the workspace.`,
      time: user.lastActive,
      type: "login",
    },
    {
      id: `${user.id}-a2`,
      title: "Role mapped to permissions",
      description: `${user.role} permissions are currently applied to this account.`,
      time: user.joinedAt,
      type: "permission",
    },
    {
      id: `${user.id}-a3`,
      title: "Account profile reviewed",
      description: `Contact details and department assignment are available for admin review.`,
      time: user.joinedAt,
      type: "update",
    },
    {
      id: `${user.id}-a4`,
      title: user.status === "Pending" ? "Invite awaiting acceptance" : "Account status verified",
      description:
        user.status === "Pending"
          ? "User invite is still pending acceptance."
          : `Current account status is marked as ${user.status}.`,
      time: user.lastActive,
      type: user.status === "Pending" ? "invite" : "status",
    },
  ];
}

function updateUserStatus(userId: string, status: UserStatus) {
  const users = getStoredUsers();
  const next = users.map((user) =>
    user.id === userId ? { ...user, status } : user
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function deleteUser(userId: string) {
  const users = getStoredUsers();
  const next = users.filter((user) => user.id !== userId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export default function UserDetailPage() {
  const navigate = useNavigate();
  const params = useParams<{ userId: string }>();

  const users = useMemo(() => getStoredUsers(), []);
  const user = useMemo(
    () =>
      users.find(
        (item) =>
          item.id === params.userId ||
          String(item.id) === String(params.userId)
      ) ?? null,
    [users, params.userId]
  );

  const activities = useMemo(
    () => (user ? buildUserActivities(user) : []),
    [user]
  );

  const permissions = user ? rolePermissionMap[user.role] : null;

  const summaryCards = user
    ? [
        {
          label: "Joined On",
          value: formatDate(user.joinedAt),
          subtext: "Account created date",
        },
        {
          label: "Last Active",
          value: formatDateTime(user.lastActive),
          subtext: `${daysSince(user.lastActive)} since last active`,
        },
        {
          label: "Department",
          value: user.department,
          subtext: "Current team mapping",
        },
        {
          label: "Access Level",
          value:
            user.role === "Super Admin" || user.role === "Admin"
              ? "High"
              : user.role === "Manager"
              ? "Medium"
              : "Standard",
          subtext: "Based on assigned role",
        },
      ]
    : [];

  if (!user) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={notFoundWrapStyle}>
            <div style={notFoundIconStyle}>?</div>
            <h1 style={notFoundTitleStyle}>User not found</h1>
            <p style={notFoundTextStyle}>
              This user record is not available in your current workspace data.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() => navigate(-1)}
              >
                Go Back
              </button>
              <button
                type="button"
                style={primaryButtonStyle}
                onClick={() => navigate("/settings/team-users")}
              >
                Back to Team / Users
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={topBarStyle}>
          <div>
            <div style={breadcrumbStyle}>
              Dashboard / Settings / Team & Users / {user.name}
            </div>
            <h1 style={pageTitleStyle}>User Details</h1>
            <p style={pageSubtitleStyle}>
              Profile, permissions, workspace access, and recent activity in one
              place.
            </p>
          </div>

          <div style={topActionsStyle}>
            <button
              type="button"
              style={secondaryButtonStyle}
              onClick={() => navigate("/settings/team-users")}
            >
              Back to Team / Users
            </button>

            <button
              type="button"
              style={primaryButtonStyle}
              onClick={() =>
                navigate("/settings/team-users", {
                  state: { editUserId: user.id },
                })
              }
            >
              Edit User
            </button>
          </div>
        </div>

        <div style={profileHeroStyle}>
          <div style={profileHeroLeftStyle}>
            <div style={avatarStyle}>{getInitials(user.name)}</div>

            <div>
              <div style={heroNameStyle}>{user.name}</div>
              <div style={heroMetaRowStyle}>
                <span style={mutedInlineTextStyle}>{user.id}</span>
                <span style={dotDividerStyle}>•</span>
                <span style={mutedInlineTextStyle}>{user.department}</span>
              </div>

              <div style={heroBadgeRowStyle}>
                <span style={getRoleBadgeStyle(user.role)}>{user.role}</span>
                <span style={getStatusBadgeStyle(user.status)}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: getStatusDotColor(user.status),
                    }}
                  />
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          <div style={quickActionWrapStyle}>
            {user.status !== "Active" && (
              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() => {
                  updateUserStatus(user.id, "Active");
                  window.location.reload();
                }}
              >
                Activate
              </button>
            )}

            {user.status !== "Inactive" && (
              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() => {
                  updateUserStatus(user.id, "Inactive");
                  window.location.reload();
                }}
              >
                Deactivate
              </button>
            )}

            {user.status !== "Suspended" && (
              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() => {
                  updateUserStatus(user.id, "Suspended");
                  window.location.reload();
                }}
              >
                Suspend
              </button>
            )}

            <button
              type="button"
              style={dangerButtonStyle}
              onClick={() => {
                const confirmed = window.confirm(
                  `Delete ${user.name} from Team / Users?`
                );
                if (!confirmed) return;

                deleteUser(user.id);
                navigate("/settings/team-users");
              }}
            >
              Delete User
            </button>
          </div>
        </div>

        <div style={summaryGridStyle}>
          {summaryCards.map((card) => (
            <div key={card.label} style={summaryCardStyle}>
              <div style={summaryLabelStyle}>{card.label}</div>
              <div style={summaryValueStyle}>{card.value}</div>
              <div style={summarySubtextStyle}>{card.subtext}</div>
            </div>
          ))}
        </div>

        <div style={mainGridStyle}>
          <div style={leftColumnStyle}>
            <section style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>Basic Information</h2>
                  <p style={sectionSubtitleStyle}>
                    Core profile details and communication info.
                  </p>
                </div>
              </div>

              <div style={detailsGridStyle}>
                <DetailItem label="Full Name" value={user.name} />
                <DetailItem label="Email Address" value={user.email} />
                <DetailItem label="Phone Number" value={user.phone || "--"} />
                <DetailItem label="Department" value={user.department} />
                <DetailItem label="Role" value={user.role} />
                <DetailItem label="Status" value={user.status} />
                <DetailItem label="Joined Date" value={formatDate(user.joinedAt)} />
                <DetailItem
                  label="Last Active"
                  value={formatDateTime(user.lastActive)}
                />
              </div>
            </section>

            <section style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>Recent Activity Timeline</h2>
                  <p style={sectionSubtitleStyle}>
                    Quick audit-style view of recent account activity.
                  </p>
                </div>
              </div>

              <div style={timelineWrapStyle}>
                {activities.map((activity, index) => (
                  <div key={activity.id} style={timelineRowStyle}>
                    <div style={timelineLineWrapStyle}>
                      <div
                        style={{
                          ...timelineDotStyle,
                          background: getActivityColor(activity.type),
                        }}
                      />
                      {index !== activities.length - 1 && (
                        <div style={timelineLineStyle} />
                      )}
                    </div>

                    <div style={timelineContentStyle}>
                      <div style={timelineTitleRowStyle}>
                        <div style={timelineTitleStyle}>{activity.title}</div>
                        <div style={timelineTimeStyle}>
                          {formatDateTime(activity.time)}
                        </div>
                      </div>
                      <div style={timelineDescStyle}>{activity.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div style={rightColumnStyle}>
            <section style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>Role Permissions</h2>
                  <p style={sectionSubtitleStyle}>
                    Effective access based on current role assignment.
                  </p>
                </div>
              </div>

              {permissions && (
                <div style={permissionListStyle}>
                  <PermissionRow label="Leads" value={permissions.leads} />
                  <PermissionRow label="Deals" value={permissions.deals} />
                  <PermissionRow label="Tasks" value={permissions.tasks} />
                  <PermissionRow label="Contacts" value={permissions.contacts} />
                  <PermissionRow label="Settings" value={permissions.settings} />
                  <PermissionRow label="Reports" value={permissions.reports} />
                </div>
              )}
            </section>

            <section style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>Account Snapshot</h2>
                  <p style={sectionSubtitleStyle}>
                    Fast admin reference for this user account.
                  </p>
                </div>
              </div>

              <div style={miniStatsWrapStyle}>
                <MiniStatCard
                  label="Profile Completion"
                  value={user.phone ? "100%" : "85%"}
                />
                <MiniStatCard
                  label="Security Level"
                  value={
                    user.role === "Super Admin" || user.role === "Admin"
                      ? "Priority"
                      : "Standard"
                  }
                />
                <MiniStatCard
                  label="Invite State"
                  value={user.status === "Pending" ? "Pending" : "Accepted"}
                />
                <MiniStatCard
                  label="Last Seen"
                  value={daysSince(user.lastActive)}
                />
              </div>
            </section>

            <section style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>Admin Notes</h2>
                  <p style={sectionSubtitleStyle}>
                    Optional operational summary for managers and admins.
                  </p>
                </div>
              </div>

              <div style={notesBoxStyle}>
                {user.role} account mapped to <strong>{user.department}</strong>.
                Current status is <strong>{user.status}</strong>. Last workspace
                activity recorded on{" "}
                <strong>{formatDateTime(user.lastActive)}</strong>.
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={detailItemStyle}>
      <div style={detailLabelStyle}>{label}</div>
      <div style={detailValueStyle}>{value}</div>
    </div>
  );
}

function PermissionRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={permissionRowStyle}>
      <div style={permissionLabelStyle}>{label}</div>
      <div style={permissionValueStyle}>{value}</div>
    </div>
  );
}

function MiniStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={miniStatCardStyle}>
      <div style={miniStatLabelStyle}>{label}</div>
      <div style={miniStatValueStyle}>{value}</div>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: 24,
};

const containerStyle: CSSProperties = {
  maxWidth: 1440,
  margin: "0 auto",
};

const cardStyle: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 22,
  padding: 20,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
};

const topBarStyle: CSSProperties = {
  ...cardStyle,
  marginBottom: 20,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  flexWrap: "wrap",
};

const breadcrumbStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#64748b",
  marginBottom: 6,
};

const pageTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 30,
  fontWeight: 800,
  color: "#0f172a",
};

const pageSubtitleStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "#64748b",
  fontSize: 14,
  lineHeight: 1.6,
};

const topActionsStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const profileHeroStyle: CSSProperties = {
  ...cardStyle,
  marginBottom: 20,
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  flexWrap: "wrap",
  alignItems: "center",
};

const profileHeroLeftStyle: CSSProperties = {
  display: "flex",
  gap: 16,
  alignItems: "center",
  flexWrap: "wrap",
};

const avatarStyle: CSSProperties = {
  width: 84,
  height: 84,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 28,
  fontWeight: 900,
  flexShrink: 0,
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.15)",
};

const heroNameStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1.1,
};

const heroMetaRowStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  flexWrap: "wrap",
  marginTop: 6,
};

const mutedInlineTextStyle: CSSProperties = {
  fontSize: 13,
  color: "#64748b",
  fontWeight: 700,
};

const dotDividerStyle: CSSProperties = {
  fontSize: 14,
  color: "#94a3b8",
};

const heroBadgeRowStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 14,
};

const quickActionWrapStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
  marginBottom: 20,
};

const summaryCardStyle: CSSProperties = {
  ...cardStyle,
  padding: 18,
};

const summaryLabelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#64748b",
};

const summaryValueStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: "#0f172a",
  marginTop: 8,
};

const summarySubtextStyle: CSSProperties = {
  fontSize: 12,
  color: "#94a3b8",
  marginTop: 6,
};

const mainGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 0.95fr)",
  gap: 20,
  alignItems: "start",
};

const leftColumnStyle: CSSProperties = {
  display: "grid",
  gap: 20,
};

const rightColumnStyle: CSSProperties = {
  display: "grid",
  gap: 20,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 14,
  marginBottom: 18,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 800,
  color: "#0f172a",
};

const sectionSubtitleStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: 13,
  lineHeight: 1.6,
};

const detailsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const detailItemStyle: CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 14,
  background: "#f8fafc",
};

const detailLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: "#64748b",
  marginBottom: 8,
  textTransform: "uppercase",
  letterSpacing: 0.4,
};

const detailValueStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0f172a",
  lineHeight: 1.5,
};

const timelineWrapStyle: CSSProperties = {
  display: "grid",
  gap: 0,
};

const timelineRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "26px minmax(0, 1fr)",
  gap: 12,
};

const timelineLineWrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const timelineDotStyle: CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: "50%",
  marginTop: 5,
};

const timelineLineStyle: CSSProperties = {
  width: 2,
  flex: 1,
  minHeight: 34,
  background: "#e2e8f0",
  marginTop: 6,
};

const timelineContentStyle: CSSProperties = {
  borderBottom: "1px solid #eef2f7",
  paddingBottom: 18,
  marginBottom: 18,
};

const timelineTitleRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  flexWrap: "wrap",
};

const timelineTitleStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: "#0f172a",
};

const timelineTimeStyle: CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  fontWeight: 700,
};

const timelineDescStyle: CSSProperties = {
  fontSize: 13,
  color: "#475569",
  lineHeight: 1.7,
  marginTop: 6,
};

const permissionListStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const permissionRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: "12px 14px",
  borderRadius: 14,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const permissionLabelStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#0f172a",
};

const permissionValueStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#475569",
  textAlign: "right",
};

const miniStatsWrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const miniStatCardStyle: CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 14,
  background: "#f8fafc",
};

const miniStatLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: "#64748b",
};

const miniStatValueStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "#0f172a",
  marginTop: 8,
};

const notesBoxStyle: CSSProperties = {
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  padding: 16,
  fontSize: 14,
  color: "#334155",
  lineHeight: 1.8,
};

const secondaryButtonStyle: CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  borderRadius: 12,
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer",
};

const primaryButtonStyle: CSSProperties = {
  border: "none",
  background: "#0f172a",
  color: "#ffffff",
  borderRadius: 12,
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer",
};

const dangerButtonStyle: CSSProperties = {
  border: "1px solid #fecaca",
  background: "#fff1f2",
  color: "#b91c1c",
  borderRadius: 12,
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer",
};

const notFoundWrapStyle: CSSProperties = {
  ...cardStyle,
  maxWidth: 640,
  margin: "80px auto",
  textAlign: "center",
  padding: 36,
};

const notFoundIconStyle: CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: "50%",
  margin: "0 auto 16px",
  background: "#e2e8f0",
  color: "#0f172a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 28,
  fontWeight: 900,
};

const notFoundTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 28,
  fontWeight: 900,
  color: "#0f172a",
};

const notFoundTextStyle: CSSProperties = {
  margin: "10px 0 22px",
  color: "#64748b",
  fontSize: 14,
  lineHeight: 1.7,
};