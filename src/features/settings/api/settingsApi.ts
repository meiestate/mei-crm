// src/features/settings/api/settingsApi.ts

export type SettingsApiMode = "auto" | "local" | "remote";

export type ThemeMode = "light" | "dark";

export type CompanySettings = {
  companyName: string;
  legalName?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
  timezone?: string;
  currency?: string;
  logoUrl?: string;
};

export type WorkspacePreferences = {
  themeMode: ThemeMode;
  dateFormat?: string;
  timeFormat?: "12h" | "24h" | string;
  defaultLanguage?: string;
  defaultLeadView?: "table" | "kanban" | "calendar" | string;
  defaultDealView?: "table" | "kanban" | string;
  compactMode?: boolean;
  enableSoundEffects?: boolean;
};

export type TeamRole = {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  userCount?: number;
  isSystemRole?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PipelineStage = {
  id: string;
  name: string;
  color?: string;
  order: number;
  category?: "lead" | "deal" | string;
  isDefault?: boolean;
};

export type LeadSource = {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type NotificationSettings = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  dailySummary: boolean;
  leadAssigned: boolean;
  taskReminder: boolean;
  overdueFollowUp: boolean;
  dealStageChanged: boolean;
};

export type SecuritySettings = {
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes?: number;
  passwordMinLength?: number;
  requireSpecialCharacter?: boolean;
  requireNumber?: boolean;
  requireUppercase?: boolean;
  allowRememberMe?: boolean;
};

export type BillingSettings = {
  currentPlan?: string;
  billingCycle?: "monthly" | "yearly" | string;
  currency?: string;
  seats?: number;
  amount?: number;
  nextBillingDate?: string;
  status?: string;
};

export type IntegrationItem = {
  id: string;
  name: string;
  provider?: string;
  connected: boolean;
  category?: string;
  lastSyncedAt?: string;
};

export type BackupSettings = {
  autoBackupEnabled: boolean;
  backupFrequency?: "daily" | "weekly" | "monthly" | string;
  lastBackupAt?: string;
  retentionDays?: number;
};

export type AuditLogItem = {
  id: string;
  action: string;
  actor?: string;
  entityType?: string;
  entityId?: string;
  details?: string;
  createdAt: string;
};

export type SettingsBundle = {
  company: CompanySettings;
  workspace: WorkspacePreferences;
  teamRoles: TeamRole[];
  pipelines: PipelineStage[];
  leadSources: LeadSource[];
  notifications: NotificationSettings;
  security: SecuritySettings;
  billing: BillingSettings;
  integrations: IntegrationItem[];
  backup: BackupSettings;
  auditLogs: AuditLogItem[];
};

export type UpdateCompanySettingsInput = Partial<CompanySettings>;
export type UpdateWorkspacePreferencesInput = Partial<WorkspacePreferences>;
export type UpdateNotificationSettingsInput = Partial<NotificationSettings>;
export type UpdateSecuritySettingsInput = Partial<SecuritySettings>;
export type UpdateBillingSettingsInput = Partial<BillingSettings>;
export type UpdateBackupSettingsInput = Partial<BackupSettings>;

type UnknownRecord = Record<string, unknown>;

const STORAGE_KEYS = {
  company: "mei-crm-settings-company",
  workspace: "mei-crm-settings-workspace",
  teamRoles: "mei-crm-settings-team-roles",
  pipelines: "mei-crm-settings-pipelines",
  leadSources: "mei-crm-settings-lead-sources",
  notifications: "mei-crm-settings-notifications",
  security: "mei-crm-settings-security",
  billing: "mei-crm-settings-billing",
  integrations: "mei-crm-settings-integrations",
  backup: "mei-crm-settings-backup",
  auditLogs: "mei-crm-settings-audit-logs",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function readStorageValue<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  return safeJsonParse<T>(window.localStorage.getItem(key), fallback);
}

function writeStorageValue<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return fallback;
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function getRemoteBaseUrl(): string {
  if (
    typeof import.meta !== "undefined" &&
    (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env
      ?.VITE_API_BASE_URL
  ) {
    return (
      (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env
        ?.VITE_API_BASE_URL ?? ""
    );
  }

  return "";
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getRemoteBaseUrl();

  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

function mapCompanySettings(raw: unknown): CompanySettings {
  const item = (raw && typeof raw === "object" ? raw : {}) as UnknownRecord;

  return {
    companyName: normalizeString(item.companyName) || "MEI CRM",
    legalName: normalizeString(item.legalName) || undefined,
    email: normalizeString(item.email) || undefined,
    phone: normalizeString(item.phone) || undefined,
    website: normalizeString(item.website) || undefined,
    industry: normalizeString(item.industry) || undefined,
    addressLine1: normalizeString(item.addressLine1) || undefined,
    addressLine2: normalizeString(item.addressLine2) || undefined,
    city: normalizeString(item.city) || undefined,
    state: normalizeString(item.state) || undefined,
    country: normalizeString(item.country) || undefined,
    postalCode: normalizeString(item.postalCode) || undefined,
    taxId: normalizeString(item.taxId) || undefined,
    timezone: normalizeString(item.timezone) || "Asia/Kolkata",
    currency: normalizeString(item.currency) || "INR",
    logoUrl: normalizeString(item.logoUrl) || undefined,
  };
}

function mapWorkspacePreferences(raw: unknown): WorkspacePreferences {
  const item = (raw && typeof raw === "object" ? raw : {}) as UnknownRecord;

  return {
    themeMode: normalizeString(item.themeMode) === "dark" ? "dark" : "light",
    dateFormat: normalizeString(item.dateFormat) || "DD/MM/YYYY",
    timeFormat: normalizeString(item.timeFormat) || "12h",
    defaultLanguage: normalizeString(item.defaultLanguage) || "en",
    defaultLeadView: normalizeString(item.defaultLeadView) || "table",
    defaultDealView: normalizeString(item.defaultDealView) || "kanban",
    compactMode: toBoolean(item.compactMode, false),
    enableSoundEffects: toBoolean(item.enableSoundEffects, false),
  };
}

function mapTeamRole(raw: unknown): TeamRole | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);
  const name = normalizeString(item.name);

  if (!id || !name) return null;

  return {
    id,
    name,
    description: normalizeString(item.description) || undefined,
    permissions: Array.isArray(item.permissions)
      ? item.permissions.filter((permission): permission is string => typeof permission === "string")
      : [],
    userCount:
      typeof item.userCount === "number"
        ? item.userCount
        : toNumber(item.userCount),
    isSystemRole: toBoolean(item.isSystemRole, false),
    createdAt: normalizeString(item.createdAt) || undefined,
    updatedAt: normalizeString(item.updatedAt) || undefined,
  };
}

function mapPipelineStage(raw: unknown): PipelineStage | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);
  const name = normalizeString(item.name);

  if (!id || !name) return null;

  return {
    id,
    name,
    color: normalizeString(item.color) || undefined,
    order: toNumber(item.order),
    category: normalizeString(item.category) || "deal",
    isDefault: toBoolean(item.isDefault, false),
  };
}

function mapLeadSource(raw: unknown): LeadSource | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);
  const name = normalizeString(item.name);

  if (!id || !name) return null;

  return {
    id,
    name,
    description: normalizeString(item.description) || undefined,
    isActive: toBoolean(item.isActive, true),
    createdAt: normalizeString(item.createdAt) || undefined,
    updatedAt: normalizeString(item.updatedAt) || undefined,
  };
}

function mapNotificationSettings(raw: unknown): NotificationSettings {
  const item = (raw && typeof raw === "object" ? raw : {}) as UnknownRecord;

  return {
    emailNotifications: toBoolean(item.emailNotifications, true),
    smsNotifications: toBoolean(item.smsNotifications, false),
    pushNotifications: toBoolean(item.pushNotifications, true),
    dailySummary: toBoolean(item.dailySummary, true),
    leadAssigned: toBoolean(item.leadAssigned, true),
    taskReminder: toBoolean(item.taskReminder, true),
    overdueFollowUp: toBoolean(item.overdueFollowUp, true),
    dealStageChanged: toBoolean(item.dealStageChanged, true),
  };
}

function mapSecuritySettings(raw: unknown): SecuritySettings {
  const item = (raw && typeof raw === "object" ? raw : {}) as UnknownRecord;

  return {
    twoFactorEnabled: toBoolean(item.twoFactorEnabled, false),
    sessionTimeoutMinutes: toNumber(item.sessionTimeoutMinutes, 30),
    passwordMinLength: toNumber(item.passwordMinLength, 8),
    requireSpecialCharacter: toBoolean(item.requireSpecialCharacter, true),
    requireNumber: toBoolean(item.requireNumber, true),
    requireUppercase: toBoolean(item.requireUppercase, true),
    allowRememberMe: toBoolean(item.allowRememberMe, true),
  };
}

function mapBillingSettings(raw: unknown): BillingSettings {
  const item = (raw && typeof raw === "object" ? raw : {}) as UnknownRecord;

  return {
    currentPlan: normalizeString(item.currentPlan) || "Starter",
    billingCycle: normalizeString(item.billingCycle) || "monthly",
    currency: normalizeString(item.currency) || "INR",
    seats: toNumber(item.seats, 1),
    amount: toNumber(item.amount, 0),
    nextBillingDate: normalizeString(item.nextBillingDate) || undefined,
    status: normalizeString(item.status) || "active",
  };
}

function mapIntegrationItem(raw: unknown): IntegrationItem | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);
  const name = normalizeString(item.name);

  if (!id || !name) return null;

  return {
    id,
    name,
    provider: normalizeString(item.provider) || undefined,
    connected: toBoolean(item.connected, false),
    category: normalizeString(item.category) || undefined,
    lastSyncedAt: normalizeString(item.lastSyncedAt) || undefined,
  };
}

function mapBackupSettings(raw: unknown): BackupSettings {
  const item = (raw && typeof raw === "object" ? raw : {}) as UnknownRecord;

  return {
    autoBackupEnabled: toBoolean(item.autoBackupEnabled, false),
    backupFrequency: normalizeString(item.backupFrequency) || "weekly",
    lastBackupAt: normalizeString(item.lastBackupAt) || undefined,
    retentionDays: toNumber(item.retentionDays, 30),
  };
}

function mapAuditLogItem(raw: unknown): AuditLogItem | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);
  const action = normalizeString(item.action);

  if (!id || !action) return null;

  return {
    id,
    action,
    actor: normalizeString(item.actor) || undefined,
    entityType: normalizeString(item.entityType) || undefined,
    entityId: normalizeString(item.entityId) || undefined,
    details: normalizeString(item.details) || undefined,
    createdAt: normalizeString(item.createdAt) || nowIso(),
  };
}

function getDefaultTeamRoles(): TeamRole[] {
  return [
    {
      id: "role-admin",
      name: "Admin",
      description: "Full workspace access",
      permissions: ["*"],
      userCount: 1,
      isSystemRole: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: "role-manager",
      name: "Manager",
      description: "Team and pipeline control",
      permissions: [
        "leads.read",
        "leads.write",
        "deals.read",
        "deals.write",
        "tasks.read",
        "tasks.write",
        "reports.read",
      ],
      userCount: 0,
      isSystemRole: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: "role-agent",
      name: "Agent",
      description: "Daily sales execution role",
      permissions: [
        "leads.read",
        "leads.write",
        "deals.read",
        "deals.write",
        "tasks.read",
        "tasks.write",
      ],
      userCount: 0,
      isSystemRole: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];
}

function getDefaultPipelineStages(): PipelineStage[] {
  return [
    { id: "stage-new", name: "New", color: "#3b82f6", order: 1, category: "deal", isDefault: true },
    { id: "stage-qualified", name: "Qualified", color: "#6366f1", order: 2, category: "deal" },
    { id: "stage-proposal", name: "Proposal", color: "#a855f7", order: 3, category: "deal" },
    { id: "stage-negotiation", name: "Negotiation", color: "#f59e0b", order: 4, category: "deal" },
    { id: "stage-won", name: "Won", color: "#22c55e", order: 5, category: "deal" },
    { id: "stage-lost", name: "Lost", color: "#ef4444", order: 6, category: "deal" },
  ];
}

function getDefaultLeadSources(): LeadSource[] {
  return [
    {
      id: "source-website",
      name: "Website",
      isActive: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: "source-referral",
      name: "Referral",
      isActive: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: "source-whatsapp",
      name: "WhatsApp",
      isActive: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];
}

function getDefaultIntegrations(): IntegrationItem[] {
  return [
    {
      id: "int-whatsapp",
      name: "WhatsApp",
      provider: "Meta",
      connected: false,
      category: "communication",
    },
    {
      id: "int-email",
      name: "Email",
      provider: "SMTP",
      connected: false,
      category: "communication",
    },
  ];
}

function getDefaultAuditLogs(): AuditLogItem[] {
  return [
    {
      id: createId("audit"),
      action: "settings_initialized",
      actor: "system",
      entityType: "settings",
      entityId: "workspace",
      details: "Default settings were initialized.",
      createdAt: nowIso(),
    },
  ];
}

function getLocalSettingsBundle(): SettingsBundle {
  const company = mapCompanySettings(readStorageValue(STORAGE_KEYS.company, {}));
  const workspace = mapWorkspacePreferences(readStorageValue(STORAGE_KEYS.workspace, {}));

  const teamRoles = readStorageValue<unknown[]>(
    STORAGE_KEYS.teamRoles,
    getDefaultTeamRoles()
  )
    .map(mapTeamRole)
    .filter((item): item is TeamRole => Boolean(item));

  const pipelines = readStorageValue<unknown[]>(
    STORAGE_KEYS.pipelines,
    getDefaultPipelineStages()
  )
    .map(mapPipelineStage)
    .filter((item): item is PipelineStage => Boolean(item))
    .sort((a, b) => a.order - b.order);

  const leadSources = readStorageValue<unknown[]>(
    STORAGE_KEYS.leadSources,
    getDefaultLeadSources()
  )
    .map(mapLeadSource)
    .filter((item): item is LeadSource => Boolean(item));

  const notifications = mapNotificationSettings(
    readStorageValue(STORAGE_KEYS.notifications, {})
  );
  const security = mapSecuritySettings(readStorageValue(STORAGE_KEYS.security, {}));
  const billing = mapBillingSettings(readStorageValue(STORAGE_KEYS.billing, {}));

  const integrations = readStorageValue<unknown[]>(
    STORAGE_KEYS.integrations,
    getDefaultIntegrations()
  )
    .map(mapIntegrationItem)
    .filter((item): item is IntegrationItem => Boolean(item));

  const backup = mapBackupSettings(readStorageValue(STORAGE_KEYS.backup, {}));

  const auditLogs = readStorageValue<unknown[]>(
    STORAGE_KEYS.auditLogs,
    getDefaultAuditLogs()
  )
    .map(mapAuditLogItem)
    .filter((item): item is AuditLogItem => Boolean(item))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return {
    company,
    workspace,
    teamRoles,
    pipelines,
    leadSources,
    notifications,
    security,
    billing,
    integrations,
    backup,
    auditLogs,
  };
}

function appendAuditLog(
  action: string,
  details: string,
  entityType = "settings",
  entityId = "workspace"
): void {
  const currentLogs = readStorageValue<unknown[]>(
    STORAGE_KEYS.auditLogs,
    getDefaultAuditLogs()
  )
    .map(mapAuditLogItem)
    .filter((item): item is AuditLogItem => Boolean(item));

  const nextLog: AuditLogItem = {
    id: createId("audit"),
    action,
    actor: "system",
    entityType,
    entityId,
    details,
    createdAt: nowIso(),
  };

  writeStorageValue(STORAGE_KEYS.auditLogs, [nextLog, ...currentLogs]);
}

const settingsApi = {
  async getSettingsBundle(options?: {
    mode?: SettingsApiMode;
  }): Promise<SettingsBundle> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      return getLocalSettingsBundle();
    }

    if (mode === "remote") {
      return fetchJson<SettingsBundle>("/settings");
    }

    try {
      return await this.getSettingsBundle({ mode: "remote" });
    } catch {
      return this.getSettingsBundle({ mode: "local" });
    }
  },

  async getCompanySettings(options?: {
    mode?: SettingsApiMode;
  }): Promise<CompanySettings> {
    const bundle = await this.getSettingsBundle(options);
    return bundle.company;
  },

  async updateCompanySettings(
    updates: UpdateCompanySettingsInput,
    options?: { mode?: SettingsApiMode }
  ): Promise<CompanySettings> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const current = mapCompanySettings(readStorageValue(STORAGE_KEYS.company, {}));
      const next = mapCompanySettings({
        ...current,
        ...updates,
      });

      writeStorageValue(STORAGE_KEYS.company, next);
      appendAuditLog("company_settings_updated", "Company settings were updated.");
      return next;
    }

    if (mode === "remote") {
      return fetchJson<CompanySettings>("/settings/company", {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    }

    try {
      return await this.updateCompanySettings(updates, { mode: "remote" });
    } catch {
      return this.updateCompanySettings(updates, { mode: "local" });
    }
  },

  async getWorkspacePreferences(options?: {
    mode?: SettingsApiMode;
  }): Promise<WorkspacePreferences> {
    const bundle = await this.getSettingsBundle(options);
    return bundle.workspace;
  },

  async updateWorkspacePreferences(
    updates: UpdateWorkspacePreferencesInput,
    options?: { mode?: SettingsApiMode }
  ): Promise<WorkspacePreferences> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const current = mapWorkspacePreferences(
        readStorageValue(STORAGE_KEYS.workspace, {})
      );
      const next = mapWorkspacePreferences({
        ...current,
        ...updates,
      });

      writeStorageValue(STORAGE_KEYS.workspace, next);
      appendAuditLog(
        "workspace_preferences_updated",
        "Workspace preferences were updated."
      );
      return next;
    }

    if (mode === "remote") {
      return fetchJson<WorkspacePreferences>("/settings/workspace", {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    }

    try {
      return await this.updateWorkspacePreferences(updates, { mode: "remote" });
    } catch {
      return this.updateWorkspacePreferences(updates, { mode: "local" });
    }
  },

  async getTeamRoles(options?: {
    mode?: SettingsApiMode;
  }): Promise<TeamRole[]> {
    const bundle = await this.getSettingsBundle(options);
    return bundle.teamRoles;
  },

  async createTeamRole(
    input: Omit<TeamRole, "id" | "createdAt" | "updatedAt">,
    options?: { mode?: SettingsApiMode }
  ): Promise<TeamRole> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const current = (await this.getTeamRoles({ mode: "local" })).slice();

      const nextRole: TeamRole = {
        id: createId("role"),
        name: normalizeString(input.name) || "New Role",
        description: normalizeString(input.description) || undefined,
        permissions: Array.isArray(input.permissions) ? input.permissions : [],
        userCount: input.userCount ?? 0,
        isSystemRole: Boolean(input.isSystemRole),
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };

      writeStorageValue(STORAGE_KEYS.teamRoles, [nextRole, ...current]);
      appendAuditLog(
        "team_role_created",
        `Role "${nextRole.name}" was created.`,
        "role",
        nextRole.id
      );

      return nextRole;
    }

    if (mode === "remote") {
      return fetchJson<TeamRole>("/settings/team-roles", {
        method: "POST",
        body: JSON.stringify(input),
      });
    }

    try {
      return await this.createTeamRole(input, { mode: "remote" });
    } catch {
      return this.createTeamRole(input, { mode: "local" });
    }
  },

  async updateTeamRole(
    roleId: string,
    updates: Partial<Omit<TeamRole, "id" | "createdAt">>,
    options?: { mode?: SettingsApiMode }
  ): Promise<TeamRole | null> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const currentRoles = await this.getTeamRoles({ mode: "local" });
      const roleIndex = currentRoles.findIndex((role) => role.id === roleId);

      if (roleIndex === -1) {
        return null;
      }

      const currentRole = currentRoles[roleIndex];

      const updatedRole: TeamRole = {
        ...currentRole,
        ...updates,
        name:
          updates.name !== undefined
            ? normalizeString(updates.name) || currentRole.name
            : currentRole.name,
        description:
          updates.description !== undefined
            ? normalizeString(updates.description) || undefined
            : currentRole.description,
        permissions:
          updates.permissions !== undefined
            ? updates.permissions
            : currentRole.permissions,
        userCount:
          updates.userCount !== undefined
            ? updates.userCount
            : currentRole.userCount,
        isSystemRole:
          updates.isSystemRole !== undefined
            ? updates.isSystemRole
            : currentRole.isSystemRole,
        updatedAt: nowIso(),
      };

      const nextRoles = [...currentRoles];
      nextRoles[roleIndex] = updatedRole;

      writeStorageValue(STORAGE_KEYS.teamRoles, nextRoles);
      appendAuditLog(
        "team_role_updated",
        `Role "${updatedRole.name}" was updated.`,
        "role",
        updatedRole.id
      );

      return updatedRole;
    }

    if (mode === "remote") {
      return fetchJson<TeamRole>(`/settings/team-roles/${roleId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    }

    try {
      return await this.updateTeamRole(roleId, updates, { mode: "remote" });
    } catch {
      return this.updateTeamRole(roleId, updates, { mode: "local" });
    }
  },

  async deleteTeamRole(
    roleId: string,
    options?: { mode?: SettingsApiMode }
  ): Promise<boolean> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const current = await this.getTeamRoles({ mode: "local" });
      const role = current.find((item) => item.id === roleId) ?? null;
      const nextRoles = current.filter((item) => item.id !== roleId);

      writeStorageValue(STORAGE_KEYS.teamRoles, nextRoles);

      if (role) {
        appendAuditLog(
          "team_role_deleted",
          `Role "${role.name}" was deleted.`,
          "role",
          role.id
        );
      }

      return true;
    }

    if (mode === "remote") {
      await fetchJson<{ success?: boolean }>(`/settings/team-roles/${roleId}`, {
        method: "DELETE",
      });
      return true;
    }

    try {
      return await this.deleteTeamRole(roleId, { mode: "remote" });
    } catch {
      return this.deleteTeamRole(roleId, { mode: "local" });
    }
  },

  async getPipelines(options?: {
    mode?: SettingsApiMode;
  }): Promise<PipelineStage[]> {
    const bundle = await this.getSettingsBundle(options);
    return bundle.pipelines;
  },

  async savePipelines(
    stages: PipelineStage[],
    options?: { mode?: SettingsApiMode }
  ): Promise<PipelineStage[]> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const nextStages = stages
        .map((stage, index) => ({
          ...stage,
          id: normalizeString(stage.id) || createId("stage"),
          name: normalizeString(stage.name) || `Stage ${index + 1}`,
          order: typeof stage.order === "number" ? stage.order : index + 1,
        }))
        .sort((a, b) => a.order - b.order);

      writeStorageValue(STORAGE_KEYS.pipelines, nextStages);
      appendAuditLog(
        "pipelines_saved",
        "Pipeline stages were updated.",
        "pipeline",
        "all"
      );

      return nextStages;
    }

    if (mode === "remote") {
      return fetchJson<PipelineStage[]>("/settings/pipelines", {
        method: "PUT",
        body: JSON.stringify(stages),
      });
    }

    try {
      return await this.savePipelines(stages, { mode: "remote" });
    } catch {
      return this.savePipelines(stages, { mode: "local" });
    }
  },

  async getLeadSources(options?: {
    mode?: SettingsApiMode;
  }): Promise<LeadSource[]> {
    const bundle = await this.getSettingsBundle(options);
    return bundle.leadSources;
  },

  async saveLeadSources(
    sources: LeadSource[],
    options?: { mode?: SettingsApiMode }
  ): Promise<LeadSource[]> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const nextSources = sources.map((source) => ({
        ...source,
        id: normalizeString(source.id) || createId("lead-source"),
        name: normalizeString(source.name) || "New Source",
        updatedAt: nowIso(),
      }));

      writeStorageValue(STORAGE_KEYS.leadSources, nextSources);
      appendAuditLog(
        "lead_sources_saved",
        "Lead sources were updated.",
        "lead_source",
        "all"
      );

      return nextSources;
    }

    if (mode === "remote") {
      return fetchJson<LeadSource[]>("/settings/lead-sources", {
        method: "PUT",
        body: JSON.stringify(sources),
      });
    }

    try {
      return await this.saveLeadSources(sources, { mode: "remote" });
    } catch {
      return this.saveLeadSources(sources, { mode: "local" });
    }
  },

  async getNotificationSettings(options?: {
    mode?: SettingsApiMode;
  }): Promise<NotificationSettings> {
    const bundle = await this.getSettingsBundle(options);
    return bundle.notifications;
  },

  async updateNotificationSettings(
    updates: UpdateNotificationSettingsInput,
    options?: { mode?: SettingsApiMode }
  ): Promise<NotificationSettings> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const current = mapNotificationSettings(
        readStorageValue(STORAGE_KEYS.notifications, {})
      );
      const next = mapNotificationSettings({
        ...current,
        ...updates,
      });

      writeStorageValue(STORAGE_KEYS.notifications, next);
      appendAuditLog(
        "notification_settings_updated",
        "Notification settings were updated."
      );
      return next;
    }

    if (mode === "remote") {
      return fetchJson<NotificationSettings>("/settings/notifications", {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    }

    try {
      return await this.updateNotificationSettings(updates, { mode: "remote" });
    } catch {
      return this.updateNotificationSettings(updates, { mode: "local" });
    }
  },

  async getSecuritySettings(options?: {
    mode?: SettingsApiMode;
  }): Promise<SecuritySettings> {
    const bundle = await this.getSettingsBundle(options);
    return bundle.security;
  },

  async updateSecuritySettings(
    updates: UpdateSecuritySettingsInput,
    options?: { mode?: SettingsApiMode }
  ): Promise<SecuritySettings> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const current = mapSecuritySettings(
        readStorageValue(STORAGE_KEYS.security, {})
      );
      const next = mapSecuritySettings({
        ...current,
        ...updates,
      });

      writeStorageValue(STORAGE_KEYS.security, next);
      appendAuditLog(
        "security_settings_updated",
        "Security settings were updated."
      );
      return next;
    }

    if (mode === "remote") {
      return fetchJson<SecuritySettings>("/settings/security", {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    }

    try {
      return await this.updateSecuritySettings(updates, { mode: "remote" });
    } catch {
      return this.updateSecuritySettings(updates, { mode: "local" });
    }
  },

  async getBillingSettings(options?: {
    mode?: SettingsApiMode;
  }): Promise<BillingSettings> {
    const bundle = await this.getSettingsBundle(options);
    return bundle.billing;
  },

  async updateBillingSettings(
    updates: UpdateBillingSettingsInput,
    options?: { mode?: SettingsApiMode }
  ): Promise<BillingSettings> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const current = mapBillingSettings(
        readStorageValue(STORAGE_KEYS.billing, {})
      );
      const next = mapBillingSettings({
        ...current,
        ...updates,
      });

      writeStorageValue(STORAGE_KEYS.billing, next);
      appendAuditLog("billing_settings_updated", "Billing settings were updated.");
      return next;
    }

    if (mode === "remote") {
      return fetchJson<BillingSettings>("/settings/billing", {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    }

    try {
      return await this.updateBillingSettings(updates, { mode: "remote" });
    } catch {
      return this.updateBillingSettings(updates, { mode: "local" });
    }
  },

  async getIntegrations(options?: {
    mode?: SettingsApiMode;
  }): Promise<IntegrationItem[]> {
    const bundle = await this.getSettingsBundle(options);
    return bundle.integrations;
  },

  async saveIntegrations(
    integrations: IntegrationItem[],
    options?: { mode?: SettingsApiMode }
  ): Promise<IntegrationItem[]> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const nextIntegrations = integrations.map((integration) => ({
        ...integration,
        id: normalizeString(integration.id) || createId("integration"),
        name: normalizeString(integration.name) || "New Integration",
      }));

      writeStorageValue(STORAGE_KEYS.integrations, nextIntegrations);
      appendAuditLog(
        "integrations_saved",
        "Integrations were updated.",
        "integration",
        "all"
      );

      return nextIntegrations;
    }

    if (mode === "remote") {
      return fetchJson<IntegrationItem[]>("/settings/integrations", {
        method: "PUT",
        body: JSON.stringify(integrations),
      });
    }

    try {
      return await this.saveIntegrations(integrations, { mode: "remote" });
    } catch {
      return this.saveIntegrations(integrations, { mode: "local" });
    }
  },

  async getBackupSettings(options?: {
    mode?: SettingsApiMode;
  }): Promise<BackupSettings> {
    const bundle = await this.getSettingsBundle(options);
    return bundle.backup;
  },

  async updateBackupSettings(
    updates: UpdateBackupSettingsInput,
    options?: { mode?: SettingsApiMode }
  ): Promise<BackupSettings> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const current = mapBackupSettings(readStorageValue(STORAGE_KEYS.backup, {}));
      const next = mapBackupSettings({
        ...current,
        ...updates,
      });

      writeStorageValue(STORAGE_KEYS.backup, next);
      appendAuditLog("backup_settings_updated", "Backup settings were updated.");
      return next;
    }

    if (mode === "remote") {
      return fetchJson<BackupSettings>("/settings/backup", {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    }

    try {
      return await this.updateBackupSettings(updates, { mode: "remote" });
    } catch {
      return this.updateBackupSettings(updates, { mode: "local" });
    }
  },

  async getAuditLogs(options?: {
    mode?: SettingsApiMode;
  }): Promise<AuditLogItem[]> {
    const bundle = await this.getSettingsBundle(options);
    return bundle.auditLogs;
  },
};

export default settingsApi;