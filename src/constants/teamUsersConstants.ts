export type UserStatus =
  | "active"
  | "inactive"
  | "invited"
  | "suspended"
  | "pending";

export type UserRole =
  | "Super Admin"
  | "Admin"
  | "Manager"
  | "Sales Lead"
  | "Telecaller"
  | "Agent"
  | "Support"
  | "Viewer";

export type TeamDepartment =
  | "Management"
  | "Sales"
  | "Operations"
  | "Support"
  | "Marketing"
  | "Finance"
  | "HR"
  | "Legal"
  | "IT";

export type PermissionKey =
  | "dashboard.view"
  | "leads.view"
  | "leads.create"
  | "leads.edit"
  | "leads.delete"
  | "contacts.view"
  | "contacts.create"
  | "contacts.edit"
  | "contacts.delete"
  | "deals.view"
  | "deals.create"
  | "deals.edit"
  | "deals.delete"
  | "tasks.view"
  | "tasks.create"
  | "tasks.edit"
  | "tasks.delete"
  | "calls.view"
  | "calls.create"
  | "users.view"
  | "users.invite"
  | "users.edit"
  | "users.delete"
  | "settings.view"
  | "settings.edit"
  | "reports.view"
  | "billing.view"
  | "billing.edit"
  | "audit.view";

export type PermissionGroup = {
  id: string;
  title: string;
  permissions: {
    key: PermissionKey;
    label: string;
    description: string;
  }[];
};

export type RoleOption = {
  value: UserRole;
  label: string;
  description: string;
  badgeTone: "primary" | "success" | "warning" | "danger" | "neutral";
};

export type DepartmentOption = {
  value: TeamDepartment;
  label: string;
};

export type StatusOption = {
  value: UserStatus;
  label: string;
  tone: "success" | "warning" | "danger" | "neutral" | "primary";
};

export type TeamUserRecord = {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  department: TeamDepartment;
  status: UserStatus;
  location: string;
  reportingTo?: string;
  joinedOn: string;
  lastActive: string;
  timezone: string;
  assignedLeads: number;
  activeDeals: number;
  tasksDueToday: number;
  monthlyRevenue: number;
  conversionRate: number;
  permissions: PermissionKey[];
  notes?: string;
};

export type TeamUsersFilterKey =
  | "all"
  | "active"
  | "inactive"
  | "invited"
  | "suspended"
  | "management"
  | "sales"
  | "support";

export const TEAM_USERS_STORAGE_KEY = "mei-crm-team-users";
export const TEAM_USERS_VIEW_MODE_KEY = "mei-crm-team-users-view-mode";
export const TEAM_USERS_FILTERS_KEY = "mei-crm-team-users-filters";
export const TEAM_USERS_SELECTED_IDS_KEY = "mei-crm-team-users-selected-ids";
export const TEAM_USERS_ACTIVITY_STORAGE_KEY = "mei-crm-team-users-activity";

export const TEAM_USERS_PAGE_TITLE = "Team & Users";
export const TEAM_USERS_PAGE_SUBTITLE =
  "Manage staff access, roles, departments, permissions, and team performance from one place.";

export const TEAM_USERS_EMPTY_STATE_TITLE = "No team members found";
export const TEAM_USERS_EMPTY_STATE_DESCRIPTION =
  "Try changing your search or filters, or invite a new member to your workspace.";

export const TEAM_USERS_TABLE_COLUMNS = [
  { key: "fullName", label: "User" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
  { key: "status", label: "Status" },
  { key: "assignedLeads", label: "Leads" },
  { key: "activeDeals", label: "Deals" },
  { key: "tasksDueToday", label: "Tasks Today" },
  { key: "monthlyRevenue", label: "Revenue" },
  { key: "lastActive", label: "Last Active" },
] as const;

export const TEAM_USERS_SORT_OPTIONS = [
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "joined-newest", label: "Joined: Newest first" },
  { value: "joined-oldest", label: "Joined: Oldest first" },
  { value: "last-active", label: "Last active" },
  { value: "revenue-high", label: "Revenue: High to low" },
  { value: "leads-high", label: "Assigned leads: High to low" },
  { value: "conversion-high", label: "Conversion: High to low" },
] as const;

export const TEAM_USERS_BULK_ACTIONS = [
  { value: "activate", label: "Mark as Active" },
  { value: "deactivate", label: "Mark as Inactive" },
  { value: "suspend", label: "Suspend Users" },
  { value: "change-role", label: "Change Role" },
  { value: "change-department", label: "Change Department" },
  { value: "export", label: "Export Selected" },
  { value: "delete", label: "Delete Selected" },
] as const;

export const TEAM_USERS_QUICK_FILTERS: {
  key: TeamUsersFilterKey;
  label: string;
}[] = [
  { key: "all", label: "All Users" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "invited", label: "Invited" },
  { key: "suspended", label: "Suspended" },
  { key: "management", label: "Management" },
  { key: "sales", label: "Sales" },
  { key: "support", label: "Support" },
];

export const TEAM_ROLE_OPTIONS: RoleOption[] = [
  {
    value: "Super Admin",
    label: "Super Admin",
    description: "Full control across workspace, billing, team, and settings.",
    badgeTone: "danger",
  },
  {
    value: "Admin",
    label: "Admin",
    description: "Manages users, settings, reports, and operational workflows.",
    badgeTone: "primary",
  },
  {
    value: "Manager",
    label: "Manager",
    description: "Handles team performance, lead allocation, and reviews.",
    badgeTone: "success",
  },
  {
    value: "Sales Lead",
    label: "Sales Lead",
    description: "Owns team pipeline, follow-ups, and conversion monitoring.",
    badgeTone: "success",
  },
  {
    value: "Telecaller",
    label: "Telecaller",
    description: "Focuses on calls, lead qualification, and appointment booking.",
    badgeTone: "warning",
  },
  {
    value: "Agent",
    label: "Agent",
    description: "Handles property pitching, visits, closures, and client support.",
    badgeTone: "primary",
  },
  {
    value: "Support",
    label: "Support",
    description: "Assists users, resolves issues, and tracks service requests.",
    badgeTone: "neutral",
  },
  {
    value: "Viewer",
    label: "Viewer",
    description: "Read-only access for reports and limited CRM visibility.",
    badgeTone: "neutral",
  },
];

export const TEAM_DEPARTMENT_OPTIONS: DepartmentOption[] = [
  { value: "Management", label: "Management" },
  { value: "Sales", label: "Sales" },
  { value: "Operations", label: "Operations" },
  { value: "Support", label: "Support" },
  { value: "Marketing", label: "Marketing" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "HR" },
  { value: "Legal", label: "Legal" },
  { value: "IT", label: "IT" },
];

export const TEAM_STATUS_OPTIONS: StatusOption[] = [
  { value: "active", label: "Active", tone: "success" },
  { value: "inactive", label: "Inactive", tone: "neutral" },
  { value: "invited", label: "Invited", tone: "primary" },
  { value: "suspended", label: "Suspended", tone: "danger" },
  { value: "pending", label: "Pending", tone: "warning" },
];

export const TEAM_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    permissions: [
      {
        key: "dashboard.view",
        label: "View Dashboard",
        description: "Can access dashboard overview and KPIs.",
      },
    ],
  },
  {
    id: "leads",
    title: "Leads",
    permissions: [
      {
        key: "leads.view",
        label: "View Leads",
        description: "Can access and view lead records.",
      },
      {
        key: "leads.create",
        label: "Create Leads",
        description: "Can create new leads.",
      },
      {
        key: "leads.edit",
        label: "Edit Leads",
        description: "Can update lead information.",
      },
      {
        key: "leads.delete",
        label: "Delete Leads",
        description: "Can remove lead records.",
      },
    ],
  },
  {
    id: "contacts",
    title: "Contacts",
    permissions: [
      {
        key: "contacts.view",
        label: "View Contacts",
        description: "Can access and view contact records.",
      },
      {
        key: "contacts.create",
        label: "Create Contacts",
        description: "Can create new contacts.",
      },
      {
        key: "contacts.edit",
        label: "Edit Contacts",
        description: "Can update contact information.",
      },
      {
        key: "contacts.delete",
        label: "Delete Contacts",
        description: "Can remove contact records.",
      },
    ],
  },
  {
    id: "deals",
    title: "Deals",
    permissions: [
      {
        key: "deals.view",
        label: "View Deals",
        description: "Can access and view deal records.",
      },
      {
        key: "deals.create",
        label: "Create Deals",
        description: "Can create new deals.",
      },
      {
        key: "deals.edit",
        label: "Edit Deals",
        description: "Can update deal details.",
      },
      {
        key: "deals.delete",
        label: "Delete Deals",
        description: "Can remove deal records.",
      },
    ],
  },
  {
    id: "tasks",
    title: "Tasks",
    permissions: [
      {
        key: "tasks.view",
        label: "View Tasks",
        description: "Can access tasks and reminders.",
      },
      {
        key: "tasks.create",
        label: "Create Tasks",
        description: "Can create tasks.",
      },
      {
        key: "tasks.edit",
        label: "Edit Tasks",
        description: "Can update tasks.",
      },
      {
        key: "tasks.delete",
        label: "Delete Tasks",
        description: "Can remove tasks.",
      },
    ],
  },
  {
    id: "calls",
    title: "Calls",
    permissions: [
      {
        key: "calls.view",
        label: "View Calls",
        description: "Can access call logs.",
      },
      {
        key: "calls.create",
        label: "Create Calls",
        description: "Can add manual call log entries.",
      },
    ],
  },
  {
    id: "users",
    title: "Users & Team",
    permissions: [
      {
        key: "users.view",
        label: "View Team",
        description: "Can view workspace users.",
      },
      {
        key: "users.invite",
        label: "Invite Users",
        description: "Can invite new members.",
      },
      {
        key: "users.edit",
        label: "Edit Users",
        description: "Can update user roles and profile details.",
      },
      {
        key: "users.delete",
        label: "Delete Users",
        description: "Can remove users from workspace.",
      },
    ],
  },
  {
    id: "settings",
    title: "Settings & Reports",
    permissions: [
      {
        key: "settings.view",
        label: "View Settings",
        description: "Can access settings pages.",
      },
      {
        key: "settings.edit",
        label: "Edit Settings",
        description: "Can modify workspace settings.",
      },
      {
        key: "reports.view",
        label: "View Reports",
        description: "Can access reports and analytics.",
      },
      {
        key: "billing.view",
        label: "View Billing",
        description: "Can access subscription and invoice pages.",
      },
      {
        key: "billing.edit",
        label: "Edit Billing",
        description: "Can upgrade plans and change billing details.",
      },
      {
        key: "audit.view",
        label: "View Audit Logs",
        description: "Can review activity and compliance logs.",
      },
    ],
  },
];

export const ROLE_PERMISSION_MAP: Record<UserRole, PermissionKey[]> = {
  "Super Admin": [
    "dashboard.view",
    "leads.view",
    "leads.create",
    "leads.edit",
    "leads.delete",
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "contacts.delete",
    "deals.view",
    "deals.create",
    "deals.edit",
    "deals.delete",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "tasks.delete",
    "calls.view",
    "calls.create",
    "users.view",
    "users.invite",
    "users.edit",
    "users.delete",
    "settings.view",
    "settings.edit",
    "reports.view",
    "billing.view",
    "billing.edit",
    "audit.view",
  ],
  Admin: [
    "dashboard.view",
    "leads.view",
    "leads.create",
    "leads.edit",
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "deals.view",
    "deals.create",
    "deals.edit",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "calls.view",
    "calls.create",
    "users.view",
    "users.invite",
    "users.edit",
    "settings.view",
    "settings.edit",
    "reports.view",
    "billing.view",
    "audit.view",
  ],
  Manager: [
    "dashboard.view",
    "leads.view",
    "leads.create",
    "leads.edit",
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "deals.view",
    "deals.create",
    "deals.edit",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "calls.view",
    "calls.create",
    "users.view",
    "reports.view",
  ],
  "Sales Lead": [
    "dashboard.view",
    "leads.view",
    "leads.create",
    "leads.edit",
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "deals.view",
    "deals.create",
    "deals.edit",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "calls.view",
    "calls.create",
    "reports.view",
  ],
  Telecaller: [
    "dashboard.view",
    "leads.view",
    "leads.create",
    "leads.edit",
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "calls.view",
    "calls.create",
  ],
  Agent: [
    "dashboard.view",
    "leads.view",
    "leads.edit",
    "contacts.view",
    "contacts.edit",
    "deals.view",
    "deals.create",
    "deals.edit",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "calls.view",
    "calls.create",
  ],
  Support: [
    "dashboard.view",
    "contacts.view",
    "contacts.edit",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "calls.view",
  ],
  Viewer: [
    "dashboard.view",
    "leads.view",
    "contacts.view",
    "deals.view",
    "tasks.view",
    "reports.view",
  ],
};

export const DEFAULT_INVITE_USER_FORM = {
  fullName: "",
  email: "",
  phone: "",
  role: "Agent" as UserRole,
  department: "Sales" as TeamDepartment,
  location: "Chennai",
  timezone: "Asia/Kolkata",
  sendWelcomeEmail: true,
  sendWhatsAppInvite: false,
};

export const DEFAULT_TEAM_USER_FILTERS = {
  search: "",
  roles: [] as UserRole[],
  departments: [] as TeamDepartment[],
  statuses: [] as UserStatus[],
  location: "all",
  sortBy: "name-asc",
};

export const TEAM_USERS_STATS = [
  {
    id: "total-users",
    label: "Total Users",
    value: 42,
    helperText: "All workspace members",
    trend: "+6 this month",
  },
  {
    id: "active-users",
    label: "Active Users",
    value: 31,
    helperText: "Logged in within 7 days",
    trend: "+9.2%",
  },
  {
    id: "invited-users",
    label: "Invited",
    value: 5,
    helperText: "Pending acceptance",
    trend: "2 expiring soon",
  },
  {
    id: "sales-team",
    label: "Sales Team",
    value: 18,
    helperText: "Field + calling staff",
    trend: "Top performing unit",
  },
];

export const TEAM_USERS_MOCK_DATA: TeamUserRecord[] = [
  {
    id: "USR-1001",
    employeeCode: "MEI-EMP-001",
    fullName: "Balraj Kumar",
    email: "balraj@meiestate.com",
    phone: "+91 98765 10001",
    role: "Super Admin",
    department: "Management",
    status: "active",
    location: "Chennai",
    reportingTo: "Board",
    joinedOn: "2025-01-10T09:00:00.000Z",
    lastActive: "2026-04-11T08:10:00.000Z",
    timezone: "Asia/Kolkata",
    assignedLeads: 12,
    activeDeals: 6,
    tasksDueToday: 3,
    monthlyRevenue: 650000,
    conversionRate: 41,
    permissions: ROLE_PERMISSION_MAP["Super Admin"],
    notes: "Founder access. Full workspace visibility.",
  },
  {
    id: "USR-1002",
    employeeCode: "MEI-EMP-002",
    fullName: "Arun Prakash",
    email: "arun@meiestate.com",
    phone: "+91 98765 10002",
    role: "Admin",
    department: "Operations",
    status: "active",
    location: "Bangalore",
    reportingTo: "Balraj Kumar",
    joinedOn: "2025-03-18T09:00:00.000Z",
    lastActive: "2026-04-11T07:45:00.000Z",
    timezone: "Asia/Kolkata",
    assignedLeads: 28,
    activeDeals: 9,
    tasksDueToday: 5,
    monthlyRevenue: 420000,
    conversionRate: 34,
    permissions: ROLE_PERMISSION_MAP["Admin"],
    notes: "Handles operations and user approvals.",
  },
  {
    id: "USR-1003",
    employeeCode: "MEI-EMP-003",
    fullName: "Priya Shankar",
    email: "priya@meiestate.com",
    phone: "+91 98765 10003",
    role: "Manager",
    department: "Sales",
    status: "active",
    location: "Chennai",
    reportingTo: "Arun Prakash",
    joinedOn: "2025-05-02T09:00:00.000Z",
    lastActive: "2026-04-10T18:35:00.000Z",
    timezone: "Asia/Kolkata",
    assignedLeads: 46,
    activeDeals: 11,
    tasksDueToday: 7,
    monthlyRevenue: 510000,
    conversionRate: 37,
    permissions: ROLE_PERMISSION_MAP["Manager"],
    notes: "Sales review lead for central zone.",
  },
  {
    id: "USR-1004",
    employeeCode: "MEI-EMP-004",
    fullName: "Kavin Raj",
    email: "kavin@meiestate.com",
    phone: "+91 98765 10004",
    role: "Sales Lead",
    department: "Sales",
    status: "active",
    location: "Bangalore",
    reportingTo: "Priya Shankar",
    joinedOn: "2025-07-12T09:00:00.000Z",
    lastActive: "2026-04-11T06:50:00.000Z",
    timezone: "Asia/Kolkata",
    assignedLeads: 58,
    activeDeals: 14,
    tasksDueToday: 8,
    monthlyRevenue: 580000,
    conversionRate: 39,
    permissions: ROLE_PERMISSION_MAP["Sales Lead"],
    notes: "Strong site visit to closure ratio.",
  },
  {
    id: "USR-1005",
    employeeCode: "MEI-EMP-005",
    fullName: "Meena Devi",
    email: "meena@meiestate.com",
    phone: "+91 98765 10005",
    role: "Telecaller",
    department: "Sales",
    status: "active",
    location: "Chennai",
    reportingTo: "Priya Shankar",
    joinedOn: "2025-08-20T09:00:00.000Z",
    lastActive: "2026-04-10T16:05:00.000Z",
    timezone: "Asia/Kolkata",
    assignedLeads: 74,
    activeDeals: 3,
    tasksDueToday: 12,
    monthlyRevenue: 180000,
    conversionRate: 21,
    permissions: ROLE_PERMISSION_MAP["Telecaller"],
    notes: "Handles first-response qualification calls.",
  },
  {
    id: "USR-1006",
    employeeCode: "MEI-EMP-006",
    fullName: "Rahul Nair",
    email: "rahul@meiestate.com",
    phone: "+91 98765 10006",
    role: "Agent",
    department: "Sales",
    status: "inactive",
    location: "Bangalore",
    reportingTo: "Kavin Raj",
    joinedOn: "2025-09-11T09:00:00.000Z",
    lastActive: "2026-04-02T11:00:00.000Z",
    timezone: "Asia/Kolkata",
    assignedLeads: 19,
    activeDeals: 4,
    tasksDueToday: 0,
    monthlyRevenue: 120000,
    conversionRate: 19,
    permissions: ROLE_PERMISSION_MAP["Agent"],
    notes: "Temporarily inactive due to leave.",
  },
  {
    id: "USR-1007",
    employeeCode: "MEI-EMP-007",
    fullName: "Sneha Varma",
    email: "sneha@meiestate.com",
    phone: "+91 98765 10007",
    role: "Support",
    department: "Support",
    status: "active",
    location: "Chennai",
    reportingTo: "Arun Prakash",
    joinedOn: "2025-10-04T09:00:00.000Z",
    lastActive: "2026-04-11T08:00:00.000Z",
    timezone: "Asia/Kolkata",
    assignedLeads: 0,
    activeDeals: 0,
    tasksDueToday: 6,
    monthlyRevenue: 0,
    conversionRate: 0,
    permissions: ROLE_PERMISSION_MAP["Support"],
    notes: "Handles ticketing and internal support follow-ups.",
  },
  {
    id: "USR-1008",
    employeeCode: "MEI-EMP-008",
    fullName: "Vishal Menon",
    email: "vishal@meiestate.com",
    phone: "+91 98765 10008",
    role: "Viewer",
    department: "Finance",
    status: "invited",
    location: "Remote",
    reportingTo: "Arun Prakash",
    joinedOn: "2026-04-08T09:00:00.000Z",
    lastActive: "2026-04-08T09:00:00.000Z",
    timezone: "Asia/Kolkata",
    assignedLeads: 0,
    activeDeals: 0,
    tasksDueToday: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    permissions: ROLE_PERMISSION_MAP["Viewer"],
    notes: "Invite sent. Awaiting acceptance.",
  },
];

export const TEAM_USER_ACTIVITY_TYPES = [
  "user_created",
  "invite_sent",
  "invite_resent",
  "role_changed",
  "department_changed",
  "status_changed",
  "permissions_updated",
  "password_reset",
  "profile_updated",
  "user_deleted",
] as const;

export const TEAM_USER_ACTIVITY_LABELS: Record<
  (typeof TEAM_USER_ACTIVITY_TYPES)[number],
  string
> = {
  user_created: "User Created",
  invite_sent: "Invite Sent",
  invite_resent: "Invite Resent",
  role_changed: "Role Changed",
  department_changed: "Department Changed",
  status_changed: "Status Changed",
  permissions_updated: "Permissions Updated",
  password_reset: "Password Reset",
  profile_updated: "Profile Updated",
  user_deleted: "User Deleted",
};

export const TEAM_USERS_EXPORT_FILE_NAME = "mei-team-users.csv";

export const TEAM_USERS_PAGINATION = {
  defaultPage: 1,
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
};

export const TEAM_USERS_LOCATION_OPTIONS = [
  "All Locations",
  "Chennai",
  "Bangalore",
  "Coimbatore",
  "Hyderabad",
  "Remote",
];

export const getDefaultPermissionsByRole = (role: UserRole): PermissionKey[] =>
  ROLE_PERMISSION_MAP[role] ?? [];

export const getStatusMeta = (status: UserStatus) =>
  TEAM_STATUS_OPTIONS.find((item) => item.value === status) ?? TEAM_STATUS_OPTIONS[0];

export const getRoleMeta = (role: UserRole) =>
  TEAM_ROLE_OPTIONS.find((item) => item.value === role) ?? TEAM_ROLE_OPTIONS[0];

export const formatUserDisplayName = (user: Pick<TeamUserRecord, "fullName" | "employeeCode">) =>
  `${user.fullName} (${user.employeeCode})`;