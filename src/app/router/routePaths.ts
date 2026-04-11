export const ROUTE_PATHS = {
  root: "/",
  dashboard: "/",

  auth: {
    login: "/login",
    signup: "/signup",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
    verifyMobile: "/verify-mobile",
    onboarding: "/onboarding",
  },

  leads: {
    root: "/leads",
    detail: (id: string | number) => `/leads/${id}`,
    calendar: "/leads/calendar",
  },

  contacts: {
    root: "/contacts",
    detail: (id: string | number) => `/contacts/${id}`,
  },

  deals: {
    root: "/deals",
    detail: (id: string | number) => `/deals/${id}`,
  },

  tasks: {
    root: "/tasks",
    detail: (id: string | number) => `/tasks/${id}`,
  },

  calls: {
    root: "/calls",
    detail: (id: string | number) => `/calls/${id}`,
  },

  settings: {
    root: "/settings",
    company: "/settings/company",
    workspace: "/settings/workspace",
    teamRoles: "/settings/team-roles",
    pipelines: "/settings/pipelines",
    leadSources: "/settings/lead-sources",
    notifications: "/settings/notifications",
    security: "/settings/security",
    billing: "/settings/billing",
    integrations: "/settings/integrations",
    dataBackup: "/settings/data-backup",
    auditLogs: "/settings/audit-logs",
    users: "/settings/users",
  },

  helpSupport: "/help-support",
  notFound: "*",
} as const;

export type AppRoutePath =
  | typeof ROUTE_PATHS.root
  | typeof ROUTE_PATHS.dashboard
  | typeof ROUTE_PATHS.auth.login
  | typeof ROUTE_PATHS.auth.signup
  | typeof ROUTE_PATHS.auth.forgotPassword
  | typeof ROUTE_PATHS.auth.resetPassword
  | typeof ROUTE_PATHS.auth.verifyEmail
  | typeof ROUTE_PATHS.auth.verifyMobile
  | typeof ROUTE_PATHS.auth.onboarding
  | typeof ROUTE_PATHS.leads.root
  | typeof ROUTE_PATHS.leads.calendar
  | typeof ROUTE_PATHS.contacts.root
  | typeof ROUTE_PATHS.deals.root
  | typeof ROUTE_PATHS.tasks.root
  | typeof ROUTE_PATHS.calls.root
  | typeof ROUTE_PATHS.settings.root
  | typeof ROUTE_PATHS.settings.company
  | typeof ROUTE_PATHS.settings.workspace
  | typeof ROUTE_PATHS.settings.teamRoles
  | typeof ROUTE_PATHS.settings.pipelines
  | typeof ROUTE_PATHS.settings.leadSources
  | typeof ROUTE_PATHS.settings.notifications
  | typeof ROUTE_PATHS.settings.security
  | typeof ROUTE_PATHS.settings.billing
  | typeof ROUTE_PATHS.settings.integrations
  | typeof ROUTE_PATHS.settings.dataBackup
  | typeof ROUTE_PATHS.settings.auditLogs
  | typeof ROUTE_PATHS.settings.users
  | typeof ROUTE_PATHS.helpSupport
  | typeof ROUTE_PATHS.notFound;

export default ROUTE_PATHS;