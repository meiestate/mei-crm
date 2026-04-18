// src/types/settings.types.ts

export type ThemeMode = "light" | "dark";

export type WorkspaceSize = "solo" | "small" | "medium" | "large" | "enterprise";

export type CurrencyCode =
  | "INR"
  | "USD"
  | "AED"
  | "EUR"
  | "GBP"
  | "SGD";

export type TimeFormat = "12h" | "24h";

export type DateFormat =
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "YYYY-MM-DD"
  | "DD-MM-YYYY";

export type UserStatus = "active" | "inactive" | "invited" | "suspended";

export type RoleType =
  | "super_admin"
  | "admin"
  | "manager"
  | "sales"
  | "marketing"
  | "support"
  | "operations"
  | "viewer";

export type PipelineProbabilityMode = "manual" | "stage_based";

export type LeadAssignmentMode = "manual" | "round_robin" | "load_balanced";

export type NotificationChannel = "email" | "sms" | "push" | "whatsapp" | "in_app";

export type BackupFrequency = "daily" | "weekly" | "monthly";

export type IntegrationStatus = "connected" | "disconnected" | "error" | "pending";

export type BillingPlanType =
  | "free"
  | "starter"
  | "growth"
  | "professional"
  | "enterprise";

export type BillingCycle = "monthly" | "quarterly" | "yearly";

export type AuditActionSeverity = "low" | "medium" | "high" | "critical";

export type PermissionScope = "workspace" | "crm" | "analytics" | "settings" | "billing";

export interface SelectOption<T = string> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
}

export interface WorkspaceBranding {
  companyName: string;
  legalName?: string;
  website?: string;
  email?: string;
  phone?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface WorkspaceAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface WorkspaceSettings {
  id: string;
  workspaceName: string;
  slug: string;
  industry?: string;
  size?: WorkspaceSize;
  timezone: string;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  currency: CurrencyCode;
  locale: string;
  themeMode: ThemeMode;
  branding: WorkspaceBranding;
  address?: WorkspaceAddress;
  createdAt: string;
  updatedAt: string;
}

export interface UserPermission {
  key: string;
  label: string;
  description?: string;
  scope: PermissionScope;
  enabled: boolean;
}

export interface TeamRole {
  id: string;
  name: string;
  type: RoleType;
  description?: string;
  userCount: number;
  permissions: UserPermission[];
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberSummary {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  roleId: string;
  roleName: string;
  status: UserStatus;
  lastActiveAt?: string;
  joinedAt?: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
  probability: number;
  isClosedStage?: boolean;
  isWonStage?: boolean;
  isLostStage?: boolean;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  probabilityMode: PipelineProbabilityMode;
  stages: PipelineStage[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadSource {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferenceItem {
  enabled: boolean;
  channels: NotificationChannel[];
}

export interface NotificationPreferences {
  newLeadAssigned: NotificationPreferenceItem;
  leadStatusChanged: NotificationPreferenceItem;
  taskReminder: NotificationPreferenceItem;
  overdueTask: NotificationPreferenceItem;
  dealStageChanged: NotificationPreferenceItem;
  paymentReceived: NotificationPreferenceItem;
  lowInventoryAlert: NotificationPreferenceItem;
  securityAlert: NotificationPreferenceItem;
  marketingAnnouncements: NotificationPreferenceItem;
  weeklyDigest: NotificationPreferenceItem;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumber: boolean;
  passwordRequireSpecialChar: boolean;
  sessionTimeoutMinutes: number;
  allowMultipleSessions: boolean;
  loginOtpEnabled: boolean;
  trustedDeviceDays: number;
  ipRestrictionEnabled: boolean;
  allowedIpRanges: string[];
}

export interface BillingUsage {
  usersUsed: number;
  usersLimit: number | null;
  contactsUsed: number;
  contactsLimit: number | null;
  leadsUsed: number;
  leadsLimit: number | null;
  storageUsedGb: number;
  storageLimitGb: number | null;
}

export interface BillingSubscription {
  plan: BillingPlanType;
  cycle: BillingCycle;
  amount: number;
  currency: CurrencyCode;
  seats: number;
  renewalDate?: string;
  trialEndsAt?: string;
  isActive: boolean;
  usage: BillingUsage;
}

export interface IntegrationConfigItem {
  id: string;
  name: string;
  key: string;
  description?: string;
  status: IntegrationStatus;
  connectedAt?: string;
  lastSyncedAt?: string;
  icon?: string;
  category?: string;
}

export interface BackupSettings {
  enabled: boolean;
  frequency: BackupFrequency;
  lastBackupAt?: string;
  nextBackupAt?: string;
  retentionDays: number;
  cloudProvider?: string;
  includeAttachments: boolean;
}

export interface AuditLogItem {
  id: string;
  actorName: string;
  actorEmail?: string;
  action: string;
  module: string;
  targetType?: string;
  targetName?: string;
  severity: AuditActionSeverity;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  meta?: Record<string, unknown>;
}

export interface SettingsOverviewStats {
  totalUsers: number;
  activeUsers: number;
  invitedUsers: number;
  totalRoles: number;
  totalPipelines: number;
  totalSources: number;
  activeIntegrations: number;
  storageUsedGb: number;
}

export interface SettingsState {
  workspace: WorkspaceSettings | null;
  roles: TeamRole[];
  teamMembers: TeamMemberSummary[];
  pipelines: Pipeline[];
  leadSources: LeadSource[];
  notifications: NotificationPreferences | null;
  security: SecuritySettings | null;
  billing: BillingSubscription | null;
  integrations: IntegrationConfigItem[];
  backup: BackupSettings | null;
  auditLogs: AuditLogItem[];
  overviewStats: SettingsOverviewStats | null;
  isLoading: boolean;
  error: string | null;
}

export interface UpdateWorkspacePayload {
  workspaceName?: string;
  slug?: string;
  industry?: string;
  size?: WorkspaceSize;
  timezone?: string;
  dateFormat?: DateFormat;
  timeFormat?: TimeFormat;
  currency?: CurrencyCode;
  locale?: string;
  themeMode?: ThemeMode;
  branding?: Partial<WorkspaceBranding>;
  address?: Partial<WorkspaceAddress>;
}

export interface CreateRolePayload {
  name: string;
  type: RoleType;
  description?: string;
  permissions: Array<{
    key: string;
    enabled: boolean;
  }>;
}

export interface UpdateRolePayload {
  name?: string;
  type?: RoleType;
  description?: string;
  permissions?: Array<{
    key: string;
    enabled: boolean;
  }>;
}

export interface CreatePipelinePayload {
  name: string;
  description?: string;
  isDefault?: boolean;
  probabilityMode?: PipelineProbabilityMode;
  stages: Array<{
    name: string;
    color: string;
    order: number;
    probability: number;
    isClosedStage?: boolean;
    isWonStage?: boolean;
    isLostStage?: boolean;
  }>;
}

export interface UpdatePipelinePayload {
  name?: string;
  description?: string;
  isDefault?: boolean;
  probabilityMode?: PipelineProbabilityMode;
  stages?: Array<{
    id?: string;
    name: string;
    color: string;
    order: number;
    probability: number;
    isClosedStage?: boolean;
    isWonStage?: boolean;
    isLostStage?: boolean;
  }>;
}

export interface CreateLeadSourcePayload {
  name: string;
  description?: string;
  isActive?: boolean;
  color?: string;
}

export interface UpdateLeadSourcePayload {
  name?: string;
  description?: string;
  isActive?: boolean;
  color?: string;
}

export interface UpdateNotificationPreferencesPayload {
  newLeadAssigned?: Partial<NotificationPreferenceItem>;
  leadStatusChanged?: Partial<NotificationPreferenceItem>;
  taskReminder?: Partial<NotificationPreferenceItem>;
  overdueTask?: Partial<NotificationPreferenceItem>;
  dealStageChanged?: Partial<NotificationPreferenceItem>;
  paymentReceived?: Partial<NotificationPreferenceItem>;
  lowInventoryAlert?: Partial<NotificationPreferenceItem>;
  securityAlert?: Partial<NotificationPreferenceItem>;
  marketingAnnouncements?: Partial<NotificationPreferenceItem>;
  weeklyDigest?: Partial<NotificationPreferenceItem>;
}

export interface UpdateSecuritySettingsPayload {
  twoFactorEnabled?: boolean;
  passwordMinLength?: number;
  passwordRequireUppercase?: boolean;
  passwordRequireLowercase?: boolean;
  passwordRequireNumber?: boolean;
  passwordRequireSpecialChar?: boolean;
  sessionTimeoutMinutes?: number;
  allowMultipleSessions?: boolean;
  loginOtpEnabled?: boolean;
  trustedDeviceDays?: number;
  ipRestrictionEnabled?: boolean;
  allowedIpRanges?: string[];
}

export interface UpdateBackupSettingsPayload {
  enabled?: boolean;
  frequency?: BackupFrequency;
  retentionDays?: number;
  cloudProvider?: string;
  includeAttachments?: boolean;
}

export interface SettingsApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedSettingsResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SettingsSectionItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  route: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface SettingsSidebarGroup {
  id: string;
  title: string;
  items: SettingsSectionItem[];
}

export interface SettingsSearchResult {
  id: string;
  title: string;
  section: string;
  description?: string;
  route: string;
  keywords?: string[];
}

export interface SettingsFormError {
  field: string;
  message: string;
}

export interface SettingsTableFilter {
  query?: string;
  status?: string;
  roleId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}