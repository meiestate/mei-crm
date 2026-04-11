// src/app/config/constants.ts

import type {
  TeamUserDepartment,
  TeamUserRole,
  TeamUserStatus,
} from "../../types/team-users";

export const APP_NAME = "MEI Business OS";
export const APP_SHORT_NAME = "MEI";
export const APP_DESCRIPTION =
  "Modern CRM, workflow, and business operating system for MEI.";
export const APP_TIMEZONE = "Asia/Kolkata";
export const APP_CURRENCY = "INR";
export const APP_LOCALE = "en-IN";

export const DEFAULT_DATE_FORMAT = "dd MMM yyyy";
export const DEFAULT_DATE_TIME_FORMAT = "dd MMM yyyy, hh:mm a";
export const DEFAULT_TIME_FORMAT = "hh:mm a";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const MAX_PAGE_SIZE = 200;

export const DEFAULT_SEARCH_DEBOUNCE_MS = 300;
export const DEFAULT_API_TIMEOUT_MS = 20000;
export const DEFAULT_MOCK_API_DELAY_MS = 250;
export const DEFAULT_TOAST_DURATION_MS = 3000;

export const THEME_STORAGE_KEY = "mei-crm-theme";
export const AUTH_TOKEN_STORAGE_KEY = "mei_access_token";
export const REFRESH_TOKEN_STORAGE_KEY = "mei_refresh_token";
export const WORKSPACE_ID_STORAGE_KEY = "mei_workspace_id";
export const USER_STORAGE_KEY = "mei_user";
export const MOCK_SERVER_ENABLED_STORAGE_KEY = "mei-crm-mock-server-enabled";

export const STORAGE_KEYS = {
  theme: THEME_STORAGE_KEY,
  authToken: AUTH_TOKEN_STORAGE_KEY,
  refreshToken: REFRESH_TOKEN_STORAGE_KEY,
  workspaceId: WORKSPACE_ID_STORAGE_KEY,
  user: USER_STORAGE_KEY,
  mockServerEnabled: MOCK_SERVER_ENABLED_STORAGE_KEY,
  teamUsers: "mei-crm-team-users",
  teamUsersSelected: "mei-crm-team-users-selected",
  auditLogs: "mei-crm-audit-logs",
  emails: "mei-crm-emails",
  sms: "mei-crm-sms",
  leads: "mei-crm-leads",
  contacts: "mei-crm-contacts",
  deals: "mei-crm-deals",
  tasks: "mei-crm-tasks",
  callLogs: "mei-crm-call-logs",
  settings: "mei-crm-settings",
  billing: "mei-crm-billing",
  notifications: "mei-crm-notifications",
  dashboard: "mei-crm-dashboard",
  mockDb: "mei-crm-mock-db",
} as const;

export const APP_ROUTES = {
  root: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  leads: "/leads",
  leadsCalendar: "/leads/calendar",
  contacts: "/contacts",
  deals: "/deals",
  tasks: "/tasks",
  calls: "/calls",
  teamUsers: "/settings/team-users",
  roles: "/settings/roles",
  billing: "/settings/billing",
  settings: "/settings",
  helpSupport: "/help-support",
  notFound: "/404",
} as const;

export const QUERY_KEY_ROOTS = {
  auth: "auth",
  dashboard: "dashboard",
  users: "users",
  teamUsers: "team-users",
  leads: "leads",
  contacts: "contacts",
  deals: "deals",
  tasks: "tasks",
  calls: "calls",
  emails: "emails",
  sms: "sms",
  auditLogs: "audit-logs",
  settings: "settings",
  workspace: "workspace",
} as const;

export const TEAM_USER_ROLE_OPTIONS: Array<{
  value: TeamUserRole;
  label: string;
}> = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "sales_lead", label: "Sales Lead" },
  { value: "telecaller", label: "Telecaller" },
  { value: "agent", label: "Agent" },
  { value: "support", label: "Support" },
  { value: "viewer", label: "Viewer" },
];

export const TEAM_USER_STATUS_OPTIONS: Array<{
  value: TeamUserStatus;
  label: string;
}> = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "invited", label: "Invited" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
];

export const TEAM_USER_DEPARTMENT_OPTIONS: Array<{
  value: TeamUserDepartment;
  label: string;
}> = [
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

export const EMAIL_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "queued", label: "Queued" },
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const EMAIL_PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
] as const;

export const EMAIL_DIRECTION_OPTIONS = [
  { value: "outbound", label: "Outbound" },
  { value: "inbound", label: "Inbound" },
] as const;

export const SMS_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "queued", label: "Queued" },
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const SMS_PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
] as const;

export const SMS_DIRECTION_OPTIONS = [
  { value: "outbound", label: "Outbound" },
  { value: "inbound", label: "Inbound" },
] as const;

export const AUDIT_SEVERITY_OPTIONS = [
  { value: "info", label: "Info" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
] as const;

export const AUDIT_ACTION_OPTIONS = [
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "view", label: "View" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
  { value: "invite", label: "Invite" },
  { value: "export", label: "Export" },
  { value: "assign", label: "Assign" },
  { value: "unassign", label: "Unassign" },
  { value: "status_change", label: "Status Change" },
  { value: "permission_change", label: "Permission Change" },
  { value: "other", label: "Other" },
] as const;

export const AUDIT_ENTITY_TYPE_OPTIONS = [
  { value: "lead", label: "Lead" },
  { value: "contact", label: "Contact" },
  { value: "deal", label: "Deal" },
  { value: "task", label: "Task" },
  { value: "call", label: "Call" },
  { value: "user", label: "User" },
  { value: "settings", label: "Settings" },
  { value: "billing", label: "Billing" },
  { value: "report", label: "Report" },
  { value: "workspace", label: "Workspace" },
  { value: "auth", label: "Auth" },
  { value: "other", label: "Other" },
] as const;

export const LEAD_STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "site_visit", label: "Site Visit" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
] as const;

export const DEAL_STAGE_OPTIONS = [
  { value: "new", label: "New" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
] as const;

export const TASK_STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const TASK_PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
] as const;

export const CALL_STATUS_OPTIONS = [
  { value: "completed", label: "Completed" },
  { value: "missed", label: "Missed" },
  { value: "busy", label: "Busy" },
  { value: "no_answer", label: "No Answer" },
] as const;

export const CALL_TYPE_OPTIONS = [
  { value: "inbound", label: "Inbound" },
  { value: "outbound", label: "Outbound" },
] as const;

export const BILLING_PLAN_OPTIONS = [
  { value: "starter", label: "Starter" },
  { value: "growth", label: "Growth" },
  { value: "professional", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
] as const;

export const APP_THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const MONTHS_OF_YEAR = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const EMPTY_STATE_MESSAGES = {
  noData: "No data available.",
  noResults: "No matching results found.",
  noTeamUsers: "No team users found.",
  noLeads: "No leads found.",
  noContacts: "No contacts found.",
  noDeals: "No deals found.",
  noTasks: "No tasks found.",
  noCalls: "No call logs found.",
  noEmails: "No emails found.",
  noSms: "No SMS records found.",
  noAuditLogs: "No audit logs found.",
} as const;

export const SUCCESS_MESSAGES = {
  created: "Created successfully.",
  updated: "Updated successfully.",
  deleted: "Deleted successfully.",
  saved: "Saved successfully.",
  invited: "Invitation sent successfully.",
  activated: "Activated successfully.",
  deactivated: "Deactivated successfully.",
  suspended: "Suspended successfully.",
} as const;

export const ERROR_MESSAGES = {
  unknown: "Something went wrong.",
  unauthorized: "You are not authorized to perform this action.",
  forbidden: "Access denied.",
  notFound: "Requested record not found.",
  validation: "Please check the entered values.",
  network: "Network error. Please try again.",
  timeout: "Request timed out. Please try again.",
} as const;