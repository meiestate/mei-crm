// src/config/env.ts

type AppEnv = {
  MODE: string;
  DEV: boolean;
  PROD: boolean;

  VITE_APP_NAME: string;
  VITE_APP_URL: string;
  VITE_API_BASE_URL: string;

  VITE_DEFAULT_THEME: "light" | "dark";
  VITE_ENABLE_MOCK_API: boolean;
  VITE_ENABLE_ANALYTICS: boolean;

  VITE_AUTH_TOKEN_KEY: string;
  VITE_REFRESH_TOKEN_KEY: string;
  VITE_WORKSPACE_STORAGE_KEY: string;
};

const getString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") {
    return value.trim();
  }

  return fallback;
};

const getBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "on"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "off"].includes(normalized)) {
      return false;
    }
  }

  return fallback;
};

const getTheme = (value: unknown, fallback: "light" | "dark" = "light"): "light" | "dark" => {
  const normalized = getString(value, fallback).toLowerCase();

  return normalized === "dark" ? "dark" : "light";
};

const rawEnv = import.meta.env;

const env: AppEnv = {
  MODE: getString(rawEnv.MODE, "development"),
  DEV: Boolean(rawEnv.DEV),
  PROD: Boolean(rawEnv.PROD),

  VITE_APP_NAME: getString(rawEnv.VITE_APP_NAME, "MEI CRM"),
  VITE_APP_URL: getString(rawEnv.VITE_APP_URL, window.location.origin),
  VITE_API_BASE_URL: getString(rawEnv.VITE_API_BASE_URL, "http://localhost:5000/api"),

  VITE_DEFAULT_THEME: getTheme(rawEnv.VITE_DEFAULT_THEME, "light"),
  VITE_ENABLE_MOCK_API: getBoolean(rawEnv.VITE_ENABLE_MOCK_API, true),
  VITE_ENABLE_ANALYTICS: getBoolean(rawEnv.VITE_ENABLE_ANALYTICS, true),

  VITE_AUTH_TOKEN_KEY: getString(rawEnv.VITE_AUTH_TOKEN_KEY, "mei-auth-token"),
  VITE_REFRESH_TOKEN_KEY: getString(rawEnv.VITE_REFRESH_TOKEN_KEY, "mei-refresh-token"),
  VITE_WORKSPACE_STORAGE_KEY: getString(rawEnv.VITE_WORKSPACE_STORAGE_KEY, "mei-workspace"),
};

export const ENV = {
  mode: env.MODE,
  isDev: env.DEV,
  isProd: env.PROD,

  app: {
    name: env.VITE_APP_NAME,
    url: env.VITE_APP_URL,
  },

  api: {
    baseUrl: env.VITE_API_BASE_URL,
  },

  theme: {
    defaultMode: env.VITE_DEFAULT_THEME,
  },

  features: {
    mockApi: env.VITE_ENABLE_MOCK_API,
    analytics: env.VITE_ENABLE_ANALYTICS,
  },

  storage: {
    authTokenKey: env.VITE_AUTH_TOKEN_KEY,
    refreshTokenKey: env.VITE_REFRESH_TOKEN_KEY,
    workspaceKey: env.VITE_WORKSPACE_STORAGE_KEY,
  },
} as const;

export default ENV;