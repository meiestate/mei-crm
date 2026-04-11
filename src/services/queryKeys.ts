// src/services/queryKeys.ts

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => ["auth", "session"] as const,
    profile: () => ["auth", "profile"] as const,
    permissions: () => ["auth", "permissions"] as const,
  },

  dashboard: {
    all: ["dashboard"] as const,
    summary: (workspaceId?: string) =>
      ["dashboard", "summary", workspaceId ?? "all"] as const,
    stats: (workspaceId?: string) =>
      ["dashboard", "stats", workspaceId ?? "all"] as const,
    revenue: (workspaceId?: string, range?: string) =>
      ["dashboard", "revenue", workspaceId ?? "all", range ?? "default"] as const,
    pipeline: (workspaceId?: string) =>
      ["dashboard", "pipeline", workspaceId ?? "all"] as const,
    recentActivity: (workspaceId?: string) =>
      ["dashboard", "recent-activity", workspaceId ?? "all"] as const,
    todayTasks: (workspaceId?: string) =>
      ["dashboard", "today-tasks", workspaceId ?? "all"] as const,
  },

  users: {
    all: ["users"] as const,
    lists: () => ["users", "list"] as const,
    list: (params?: Record<string, unknown>) =>
      ["users", "list", params ?? {}] as const,
    detail: (userId: string) => ["users", "detail", userId] as const,
    profile: (userId: string) => ["users", "profile", userId] as const,
  },

  teamUsers: {
    all: ["team-users"] as const,
    lists: () => ["team-users", "list"] as const,
    list: (params?: Record<string, unknown>) =>
      ["team-users", "list", params ?? {}] as const,
    detail: (userId: string) => ["team-users", "detail", userId] as const,
    summary: (workspaceId?: string) =>
      ["team-users", "summary", workspaceId ?? "all"] as const,
    permissions: (userId: string) =>
      ["team-users", "permissions", userId] as const,
    selected: () => ["team-users", "selected"] as const,
  },

  leads: {
    all: ["leads"] as const,
    lists: () => ["leads", "list"] as const,
    list: (params?: Record<string, unknown>) =>
      ["leads", "list", params ?? {}] as const,
    detail: (leadId: string) => ["leads", "detail", leadId] as const,
    activities: (leadId: string) =>
      ["leads", "activities", leadId] as const,
    notes: (leadId: string) => ["leads", "notes", leadId] as const,
    tasks: (leadId: string) => ["leads", "tasks", leadId] as const,
    matchingProperties: (leadId: string) =>
      ["leads", "matching-properties", leadId] as const,
    calendar: (params?: Record<string, unknown>) =>
      ["leads", "calendar", params ?? {}] as const,
  },

  contacts: {
    all: ["contacts"] as const,
    lists: () => ["contacts", "list"] as const,
    list: (params?: Record<string, unknown>) =>
      ["contacts", "list", params ?? {}] as const,
    detail: (contactId: string) =>
      ["contacts", "detail", contactId] as const,
    activities: (contactId: string) =>
      ["contacts", "activities", contactId] as const,
    deals: (contactId: string) =>
      ["contacts", "deals", contactId] as const,
    leads: (contactId: string) =>
      ["contacts", "leads", contactId] as const,
  },

  deals: {
    all: ["deals"] as const,
    lists: () => ["deals", "list"] as const,
    list: (params?: Record<string, unknown>) =>
      ["deals", "list", params ?? {}] as const,
    detail: (dealId: string) => ["deals", "detail", dealId] as const,
    activities: (dealId: string) =>
      ["deals", "activities", dealId] as const,
    kanban: (params?: Record<string, unknown>) =>
      ["deals", "kanban", params ?? {}] as const,
    pipeline: (workspaceId?: string) =>
      ["deals", "pipeline", workspaceId ?? "all"] as const,
  },

  tasks: {
    all: ["tasks"] as const,
    lists: () => ["tasks", "list"] as const,
    list: (params?: Record<string, unknown>) =>
      ["tasks", "list", params ?? {}] as const,
    detail: (taskId: string) => ["tasks", "detail", taskId] as const,
    today: (workspaceId?: string) =>
      ["tasks", "today", workspaceId ?? "all"] as const,
    overdue: (workspaceId?: string) =>
      ["tasks", "overdue", workspaceId ?? "all"] as const,
    calendar: (params?: Record<string, unknown>) =>
      ["tasks", "calendar", params ?? {}] as const,
  },

  calls: {
    all: ["calls"] as const,
    lists: () => ["calls", "list"] as const,
    list: (params?: Record<string, unknown>) =>
      ["calls", "list", params ?? {}] as const,
    detail: (callId: string) => ["calls", "detail", callId] as const,
  },

  emails: {
    all: ["emails"] as const,
    lists: () => ["emails", "list"] as const,
    list: (params?: Record<string, unknown>) =>
      ["emails", "list", params ?? {}] as const,
    detail: (emailId: string) => ["emails", "detail", emailId] as const,
    drafts: (workspaceId?: string) =>
      ["emails", "drafts", workspaceId ?? "all"] as const,
  },

  auditLogs: {
    all: ["audit-logs"] as const,
    lists: () => ["audit-logs", "list"] as const,
    list: (params?: Record<string, unknown>) =>
      ["audit-logs", "list", params ?? {}] as const,
    detail: (auditId: string) =>
      ["audit-logs", "detail", auditId] as const,
    export: (workspaceId?: string) =>
      ["audit-logs", "export", workspaceId ?? "all"] as const,
  },

  settings: {
    all: ["settings"] as const,
    company: (workspaceId?: string) =>
      ["settings", "company", workspaceId ?? "all"] as const,
    workspace: (workspaceId?: string) =>
      ["settings", "workspace", workspaceId ?? "all"] as const,
    billing: (workspaceId?: string) =>
      ["settings", "billing", workspaceId ?? "all"] as const,
    roles: (workspaceId?: string) =>
      ["settings", "roles", workspaceId ?? "all"] as const,
    leadSources: (workspaceId?: string) =>
      ["settings", "lead-sources", workspaceId ?? "all"] as const,
    notifications: (workspaceId?: string) =>
      ["settings", "notifications", workspaceId ?? "all"] as const,
    security: (workspaceId?: string) =>
      ["settings", "security", workspaceId ?? "all"] as const,
    integrations: (workspaceId?: string) =>
      ["settings", "integrations", workspaceId ?? "all"] as const,
    audit: (workspaceId?: string) =>
      ["settings", "audit", workspaceId ?? "all"] as const,
  },

  workspace: {
    all: ["workspace"] as const,
    current: (workspaceId?: string) =>
      ["workspace", "current", workspaceId ?? "all"] as const,
    members: (workspaceId?: string) =>
      ["workspace", "members", workspaceId ?? "all"] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;

export function createEntityListQueryKey(
  entity: string,
  params?: Record<string, unknown>
) {
  return [entity, "list", params ?? {}] as const;
}

export function createEntityDetailQueryKey(
  entity: string,
  id: string
) {
  return [entity, "detail", id] as const;
}

export function createWorkspaceScopedQueryKey(
  entity: string,
  scope: string,
  workspaceId?: string
) {
  return [entity, scope, workspaceId ?? "all"] as const;
}