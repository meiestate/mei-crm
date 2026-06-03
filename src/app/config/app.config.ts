export type AppEnvironment = "development" | "staging" | "production";

export type ThemeMode = "light" | "dark" | "system";

export type UserRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "sales_executive"
  | "marketing_executive"
  | "support_executive"
  | "viewer";

export type AnalyticsModuleKey =
  | "overview"
  | "leads"
  | "deals"
  | "revenue"
  | "tasks"
  | "marketing"
  | "team";

export type AppConfig = {
  app: {
    name: string;
    shortName: string;
    legalName: string;
    description: string;
    version: string;
    environment: AppEnvironment;
    defaultLocale: string;
    defaultCurrency: string;
    timezone: string;
    supportEmail: string;
  };
  api: {
    baseUrl: string;
    timeoutMs: number;
    retryCount: number;
    endpoints: {
      auth: string;
      users: string;
      workspaces: string;
      leads: string;
      contacts: string;
      deals: string;
      tasks: string;
      calls: string;
      analytics: string;
      marketing: string;
      revenue: string;
      billing: string;
      settings: string;
      support: string;
      notifications: string;
      files: string;
      auditLogs: string;
    };
  };
  routes: {
    public: {
      login: string;
      register: string;
      forgotPassword: string;
      resetPassword: string;
      otpVerification: string;
    };
    private: {
      dashboard: string;
      leads: string;
      leadDetails: string;
      contacts: string;
      contactDetails: string;
      deals: string;
      dealDetails: string;
      tasks: string;
      taskDetails: string;
      calls: string;
      analytics: string;
      analyticsLeads: string;
      analyticsDeals: string;
      analyticsRevenue: string;
      analyticsTasks: string;
      analyticsMarketing: string;
      analyticsTeam: string;
      helpSupport: string;
      settings: string;
      companySettings: string;
      workspaceSettings: string;
      roleSettings: string;
      pipelineSettings: string;
      leadSourceSettings: string;
      notificationSettings: string;
      securitySettings: string;
      billingSettings: string;
      integrationSettings: string;
      backupSettings: string;
      auditLogSettings: string;
    };
  };
  storage: {
    accessTokenKey: string;
    refreshTokenKey: string;
    userKey: string;
    workspaceKey: string;
    themeKey: string;
    sidebarKey: string;
    lastVisitedRouteKey: string;
    leadFiltersKey: string;
    dealFiltersKey: string;
    taskFiltersKey: string;
    analyticsFiltersKey: string;
  };
  ui: {
    defaultTheme: ThemeMode;
    sidebarWidth: number;
    collapsedSidebarWidth: number;
    topbarHeight: number;
    pageMaxWidth: string;
    tablePageSize: number;
    tablePageSizeOptions: number[];
    toastDurationMs: number;
    debounceMs: number;
  };
  validation: {
    passwordMinLength: number;
    otpLength: number;
    phoneMinLength: number;
    phoneMaxLength: number;
    maxUploadSizeMb: number;
    allowedImageTypes: string[];
    allowedDocumentTypes: string[];
  };
  features: {
    enableDarkMode: boolean;
    enableAuditLogs: boolean;
    enableBilling: boolean;
    enableNotifications: boolean;
    enableFileUpload: boolean;
    enableExportCsv: boolean;
    enableExportPdf: boolean;
    enableLeadCalendar: boolean;
    enableDealKanban: boolean;
    enableCallLogs: boolean;
    enableMarketingAnalytics: boolean;
    enableRevenueAnalytics: boolean;
    enableTeamAnalytics: boolean;
    enableAiInsights: boolean;
    enableWhatsappIntegration: boolean;
    enableEmailIntegration: boolean;
    enableRazorpayIntegration: boolean;
    enableStripeIntegration: boolean;
  };
  analytics: {
    defaultDateRange: "7d" | "30d" | "90d" | "12m";
    refreshIntervalMs: number;
    modules: Array<{
      key: AnalyticsModuleKey;
      label: string;
      route: string;
      enabled: boolean;
    }>;
  };
  permissions: Record<UserRole, string[]>;
  lead: {
    statuses: string[];
    priorities: string[];
    temperature: string[];
    defaultStatus: string;
    defaultPriority: string;
  };
  deal: {
    stages: string[];
    defaultStage: string;
    probabilityByStage: Record<string, number>;
  };
  task: {
    statuses: string[];
    priorities: string[];
    defaultStatus: string;
    defaultPriority: string;
  };
};

const getEnvValue = (key: string, fallback: string): string => {
  const value = import.meta.env[key] as string | undefined;
  return value && value.trim().length > 0 ? value : fallback;
};

const getBooleanEnvValue = (key: string, fallback: boolean): boolean => {
  const value = import.meta.env[key] as string | undefined;

  if (value === undefined || value === null || value.trim().length === 0) {
    return fallback;
  }

  return value === "true" || value === "1" || value === "yes";
};

const getNumberEnvValue = (key: string, fallback: number): number => {
  const value = import.meta.env[key] as string | undefined;
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const resolveEnvironment = (): AppEnvironment => {
  const env = getEnvValue("VITE_APP_ENV", import.meta.env.MODE || "development");

  if (env === "production" || env === "staging" || env === "development") {
    return env;
  }

  return "development";
};

export const APP_CONFIG: AppConfig = {
  app: {
    name: "MEI CRM",
    shortName: "MEI",
    legalName: "MEI Business OS",
    description: "Modern CRM and business operating system for leads, deals, revenue, tasks, marketing and team performance.",
    version: getEnvValue("VITE_APP_VERSION", "1.0.0"),
    environment: resolveEnvironment(),
    defaultLocale: "en-IN",
    defaultCurrency: "INR",
    timezone: "Asia/Kolkata",
    supportEmail: getEnvValue("VITE_SUPPORT_EMAIL", "support@mei-crm.com"),
  },

  api: {
    baseUrl: getEnvValue("VITE_API_BASE_URL", "http://localhost:4000/api/v1"),
    timeoutMs: getNumberEnvValue("VITE_API_TIMEOUT_MS", 30000),
    retryCount: getNumberEnvValue("VITE_API_RETRY_COUNT", 2),
    endpoints: {
      auth: "/auth",
      users: "/users",
      workspaces: "/workspaces",
      leads: "/leads",
      contacts: "/contacts",
      deals: "/deals",
      tasks: "/tasks",
      calls: "/calls",
      analytics: "/analytics",
      marketing: "/marketing",
      revenue: "/revenue",
      billing: "/billing",
      settings: "/settings",
      support: "/support",
      notifications: "/notifications",
      files: "/files",
      auditLogs: "/audit-logs",
    },
  },

  routes: {
    public: {
      login: "/login",
      register: "/register",
      forgotPassword: "/forgot-password",
      resetPassword: "/reset-password",
      otpVerification: "/otp-verification",
    },
    private: {
      dashboard: "/dashboard",
      leads: "/leads",
      leadDetails: "/leads/:leadId",
      contacts: "/contacts",
      contactDetails: "/contacts/:contactId",
      deals: "/deals",
      dealDetails: "/deals/:dealId",
      tasks: "/tasks",
      taskDetails: "/tasks/:taskId",
      calls: "/calls",
      analytics: "/analytics",
      analyticsLeads: "/analytics/leads",
      analyticsDeals: "/analytics/deals",
      analyticsRevenue: "/analytics/revenue",
      analyticsTasks: "/analytics/tasks",
      analyticsMarketing: "/analytics/marketing",
      analyticsTeam: "/analytics/team",
      helpSupport: "/help-support",
      settings: "/settings",
      companySettings: "/settings/company",
      workspaceSettings: "/settings/workspace",
      roleSettings: "/settings/roles",
      pipelineSettings: "/settings/pipelines",
      leadSourceSettings: "/settings/lead-sources",
      notificationSettings: "/settings/notifications",
      securitySettings: "/settings/security",
      billingSettings: "/settings/billing",
      integrationSettings: "/settings/integrations",
      backupSettings: "/settings/data-backup",
      auditLogSettings: "/settings/audit-logs",
    },
  },

  storage: {
    accessTokenKey: "mei-crm-access-token",
    refreshTokenKey: "mei-crm-refresh-token",
    userKey: "mei-crm-user",
    workspaceKey: "mei-crm-workspace",
    themeKey: "mei-crm-theme",
    sidebarKey: "mei-crm-sidebar-state",
    lastVisitedRouteKey: "mei-crm-last-visited-route",
    leadFiltersKey: "mei-crm-lead-filters",
    dealFiltersKey: "mei-crm-deal-filters",
    taskFiltersKey: "mei-crm-task-filters",
    analyticsFiltersKey: "mei-crm-analytics-filters",
  },

  ui: {
    defaultTheme: "light",
    sidebarWidth: 280,
    collapsedSidebarWidth: 76,
    topbarHeight: 72,
    pageMaxWidth: "1440px",
    tablePageSize: 10,
    tablePageSizeOptions: [10, 25, 50, 100],
    toastDurationMs: 3500,
    debounceMs: 350,
  },

  validation: {
    passwordMinLength: 8,
    otpLength: 6,
    phoneMinLength: 10,
    phoneMaxLength: 15,
    maxUploadSizeMb: 10,
    allowedImageTypes: ["image/png", "image/jpeg", "image/webp"],
    allowedDocumentTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ],
  },

  features: {
    enableDarkMode: true,
    enableAuditLogs: true,
    enableBilling: true,
    enableNotifications: true,
    enableFileUpload: true,
    enableExportCsv: true,
    enableExportPdf: true,
    enableLeadCalendar: true,
    enableDealKanban: true,
    enableCallLogs: true,
    enableMarketingAnalytics: true,
    enableRevenueAnalytics: true,
    enableTeamAnalytics: true,
    enableAiInsights: getBooleanEnvValue("VITE_ENABLE_AI_INSIGHTS", true),
    enableWhatsappIntegration: getBooleanEnvValue("VITE_ENABLE_WHATSAPP", false),
    enableEmailIntegration: getBooleanEnvValue("VITE_ENABLE_EMAIL", false),
    enableRazorpayIntegration: getBooleanEnvValue("VITE_ENABLE_RAZORPAY", false),
    enableStripeIntegration: getBooleanEnvValue("VITE_ENABLE_STRIPE", false),
  },

  analytics: {
    defaultDateRange: "30d",
    refreshIntervalMs: 60000,
    modules: [
      {
        key: "overview",
        label: "Overview",
        route: "/analytics",
        enabled: true,
      },
      {
        key: "leads",
        label: "Lead Analytics",
        route: "/analytics/leads",
        enabled: true,
      },
      {
        key: "deals",
        label: "Deal Analytics",
        route: "/analytics/deals",
        enabled: true,
      },
      {
        key: "revenue",
        label: "Revenue Analytics",
        route: "/analytics/revenue",
        enabled: true,
      },
      {
        key: "tasks",
        label: "Task Analytics",
        route: "/analytics/tasks",
        enabled: true,
      },
      {
        key: "marketing",
        label: "Marketing Analytics",
        route: "/analytics/marketing",
        enabled: true,
      },
      {
        key: "team",
        label: "Team Analytics",
        route: "/analytics/team",
        enabled: true,
      },
    ],
  },

  permissions: {
    super_admin: ["*"],
    admin: [
      "dashboard:view",
      "leads:*",
      "contacts:*",
      "deals:*",
      "tasks:*",
      "calls:*",
      "analytics:*",
      "settings:*",
      "billing:*",
      "support:*",
      "audit_logs:view",
    ],
    manager: [
      "dashboard:view",
      "leads:*",
      "contacts:*",
      "deals:*",
      "tasks:*",
      "calls:view",
      "analytics:view",
      "support:*",
    ],
    sales_executive: [
      "dashboard:view",
      "leads:view",
      "leads:create",
      "leads:update",
      "contacts:view",
      "contacts:create",
      "contacts:update",
      "deals:view",
      "deals:create",
      "deals:update",
      "tasks:view",
      "tasks:create",
      "tasks:update",
      "calls:view",
      "calls:create",
    ],
    marketing_executive: [
      "dashboard:view",
      "leads:view",
      "leads:create",
      "leads:update",
      "marketing:view",
      "marketing:create",
      "marketing:update",
      "analytics:view",
    ],
    support_executive: [
      "dashboard:view",
      "contacts:view",
      "tasks:view",
      "tasks:create",
      "tasks:update",
      "support:view",
      "support:create",
      "support:update",
    ],
    viewer: [
      "dashboard:view",
      "leads:view",
      "contacts:view",
      "deals:view",
      "tasks:view",
      "analytics:view",
    ],
  },

  lead: {
    statuses: ["New", "Contacted", "Qualified", "Site Visit", "Negotiation", "Converted", "Lost"],
    priorities: ["Low", "Medium", "High", "Urgent"],
    temperature: ["Cold", "Warm", "Hot"],
    defaultStatus: "New",
    defaultPriority: "Medium",
  },

  deal: {
    stages: ["New", "Qualified", "Proposal", "Negotiation", "Booking", "Closed Won", "Closed Lost"],
    defaultStage: "New",
    probabilityByStage: {
      New: 10,
      Qualified: 25,
      Proposal: 45,
      Negotiation: 65,
      Booking: 85,
      "Closed Won": 100,
      "Closed Lost": 0,
    },
  },

  task: {
    statuses: ["Pending", "In Progress", "Completed", "Overdue", "Cancelled"],
    priorities: ["Low", "Medium", "High", "Urgent"],
    defaultStatus: "Pending",
    defaultPriority: "Medium",
  },
};

export const isProduction = APP_CONFIG.app.environment === "production";
export const isDevelopment = APP_CONFIG.app.environment === "development";
export const isStaging = APP_CONFIG.app.environment === "staging";

export const getApiUrl = (endpoint: keyof AppConfig["api"]["endpoints"]): string => {
  return `${APP_CONFIG.api.baseUrl}${APP_CONFIG.api.endpoints[endpoint]}`;
};

export const getRoute = <T extends keyof AppConfig["routes"]["private"]>(routeKey: T): AppConfig["routes"]["private"][T] => {
  return APP_CONFIG.routes.private[routeKey];
};

export const getPublicRoute = <T extends keyof AppConfig["routes"]["public"]>(routeKey: T): AppConfig["routes"]["public"][T] => {
  return APP_CONFIG.routes.public[routeKey];
};

export const hasPermission = (role: UserRole, permission: string): boolean => {
  const rolePermissions = APP_CONFIG.permissions[role] || [];

  if (rolePermissions.includes("*")) {
    return true;
  }

  if (rolePermissions.includes(permission)) {
    return true;
  }

  const [moduleName] = permission.split(":");
  return rolePermissions.includes(`${moduleName}:*`);
};

export default APP_CONFIG;
