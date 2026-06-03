// =====================================================
// MEI CRM - database.config.ts
// Frontend-safe database configuration
// Vite + React + TypeScript
// -----------------------------------------------------
// IMPORTANT:
// Frontend app-ல் direct database username/password/host
// expose பண்ணக்கூடாது. Database connection backend-ல் மட்டும்.
// Frontend-ல் API base URL / mock mode / provider metadata மட்டும்.
// =====================================================

export type DatabaseProvider = "postgresql" | "mysql" | "mongodb" | "supabase" | "firebase";

export type DatabaseEnvironment = "development" | "staging" | "production";

export type DatabaseConnectionMode = "api" | "mock" | "offline";

export type DatabaseConfig = {
  provider: DatabaseProvider;
  environment: DatabaseEnvironment;
  connectionMode: DatabaseConnectionMode;
  api: {
    baseUrl: string;
    timeoutMs: number;
    retryCount: number;
  };
  mock: {
    enabled: boolean;
    delayMs: number;
  };
  cache: {
    enabled: boolean;
    keyPrefix: string;
    ttlMs: number;
  };
  offline: {
    enabled: boolean;
    storageKey: string;
  };
  healthCheck: {
    enabled: boolean;
    endpoint: string;
    intervalMs: number;
  };
};

const getEnvValue = (key: string, fallback: string): string => {
  const value = import.meta.env[key] as string | undefined;
  return value && value.trim().length > 0 ? value : fallback;
};

const getBooleanEnvValue = (key: string, fallback: boolean): boolean => {
  const value = import.meta.env[key] as string | undefined;

  if (!value || value.trim().length === 0) {
    return fallback;
  }

  return ["true", "1", "yes", "on"].includes(value.toLowerCase());
};

const getNumberEnvValue = (key: string, fallback: number): number => {
  const value = import.meta.env[key] as string | undefined;
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const resolveEnvironment = (): DatabaseEnvironment => {
  const env = getEnvValue("VITE_APP_ENV", import.meta.env.MODE || "development");

  if (env === "development" || env === "staging" || env === "production") {
    return env;
  }

  return "development";
};

const resolveProvider = (): DatabaseProvider => {
  const provider = getEnvValue("VITE_DATABASE_PROVIDER", "postgresql");

  if (
    provider === "postgresql" ||
    provider === "mysql" ||
    provider === "mongodb" ||
    provider === "supabase" ||
    provider === "firebase"
  ) {
    return provider;
  }

  return "postgresql";
};

const resolveConnectionMode = (): DatabaseConnectionMode => {
  const mode = getEnvValue("VITE_DATABASE_CONNECTION_MODE", "api");

  if (mode === "api" || mode === "mock" || mode === "offline") {
    return mode;
  }

  return "api";
};

export const DATABASE_CONFIG: DatabaseConfig = {
  provider: resolveProvider(),
  environment: resolveEnvironment(),
  connectionMode: resolveConnectionMode(),

  api: {
    baseUrl: getEnvValue("VITE_API_BASE_URL", "http://localhost:4000/api/v1"),
    timeoutMs: getNumberEnvValue("VITE_API_TIMEOUT_MS", 30000),
    retryCount: getNumberEnvValue("VITE_API_RETRY_COUNT", 2),
  },

  mock: {
    enabled: getBooleanEnvValue("VITE_ENABLE_MOCK_DATA", true),
    delayMs: getNumberEnvValue("VITE_MOCK_DELAY_MS", 500),
  },

  cache: {
    enabled: getBooleanEnvValue("VITE_ENABLE_API_CACHE", true),
    keyPrefix: getEnvValue("VITE_CACHE_KEY_PREFIX", "mei-crm"),
    ttlMs: getNumberEnvValue("VITE_CACHE_TTL_MS", 5 * 60 * 1000),
  },

  offline: {
    enabled: getBooleanEnvValue("VITE_ENABLE_OFFLINE_MODE", false),
    storageKey: getEnvValue("VITE_OFFLINE_STORAGE_KEY", "mei-crm-offline-db"),
  },

  healthCheck: {
    enabled: getBooleanEnvValue("VITE_ENABLE_API_HEALTH_CHECK", true),
    endpoint: getEnvValue("VITE_API_HEALTH_ENDPOINT", "/health"),
    intervalMs: getNumberEnvValue("VITE_API_HEALTH_INTERVAL_MS", 30000),
  },
};

export const isDatabaseProduction = DATABASE_CONFIG.environment === "production";
export const isDatabaseDevelopment = DATABASE_CONFIG.environment === "development";
export const isDatabaseStaging = DATABASE_CONFIG.environment === "staging";

export const isApiMode = DATABASE_CONFIG.connectionMode === "api";
export const isMockMode = DATABASE_CONFIG.connectionMode === "mock";
export const isOfflineMode = DATABASE_CONFIG.connectionMode === "offline";

export const getApiBaseUrl = (): string => {
  return DATABASE_CONFIG.api.baseUrl.replace(/\/$/, "");
};

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return `${baseUrl}${cleanEndpoint}`;
};

export const getHealthCheckUrl = (): string => {
  return getApiUrl(DATABASE_CONFIG.healthCheck.endpoint);
};

export const getCacheKey = (key: string): string => {
  return `${DATABASE_CONFIG.cache.keyPrefix}:${key}`;
};

export const shouldUseMockData = (): boolean => {
  return DATABASE_CONFIG.connectionMode === "mock" || DATABASE_CONFIG.mock.enabled;
};

export const shouldUseOfflineMode = (): boolean => {
  return DATABASE_CONFIG.connectionMode === "offline" || DATABASE_CONFIG.offline.enabled;
};

export const assertDatabaseConfig = (): void => {
  const errors: string[] = [];

  if (!DATABASE_CONFIG.api.baseUrl) {
    errors.push("VITE_API_BASE_URL is required.");
  }

  if (DATABASE_CONFIG.api.timeoutMs <= 0) {
    errors.push("VITE_API_TIMEOUT_MS must be greater than 0.");
  }

  if (DATABASE_CONFIG.api.retryCount < 0) {
    errors.push("VITE_API_RETRY_COUNT cannot be negative.");
  }

  if (DATABASE_CONFIG.cache.ttlMs < 0) {
    errors.push("VITE_CACHE_TTL_MS cannot be negative.");
  }

  if (errors.length > 0) {
    throw new Error(`Invalid frontend database configuration:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  }
};

export default DATABASE_CONFIG;
