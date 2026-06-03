// =====================================================
// MEI CRM - jwt.config.ts
// Frontend-safe JWT/Auth token configuration
// Vite + React + TypeScript
// -----------------------------------------------------
// IMPORTANT:
// JWT_SECRET / private signing keys frontend-ல் வைக்கக்கூடாது.
// Token create/verify backend-ல் மட்டும் நடக்க வேண்டும்.
// Frontend-ல் token storage, auth header, expiry helper மட்டும்.
// =====================================================

export type TokenStorageType = "localStorage" | "sessionStorage" | "memory";

export type AuthTokenType = "Bearer";

export type JwtEnvironment = "development" | "staging" | "production";

export type JwtConfig = {
  environment: JwtEnvironment;
  tokenType: AuthTokenType;
  storageType: TokenStorageType;
  accessTokenKey: string;
  refreshTokenKey: string;
  userKey: string;
  workspaceKey: string;
  authHeaderName: string;
  refreshBeforeExpiryMs: number;
  enableAutoRefresh: boolean;
  enableTokenExpiryCheck: boolean;
  loginRoute: string;
  logoutRedirectRoute: string;
  tokenExpiredEventName: string;
  unauthorizedEventName: string;
};

type JwtPayload = {
  sub?: string;
  userId?: string;
  email?: string;
  role?: string;
  workspaceId?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};

let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

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

const resolveEnvironment = (): JwtEnvironment => {
  const env = getEnvValue("VITE_APP_ENV", import.meta.env.MODE || "development");

  if (env === "development" || env === "staging" || env === "production") {
    return env;
  }

  return "development";
};

const resolveStorageType = (): TokenStorageType => {
  const storageType = getEnvValue("VITE_AUTH_STORAGE_TYPE", "localStorage");

  if (storageType === "localStorage" || storageType === "sessionStorage" || storageType === "memory") {
    return storageType;
  }

  return "localStorage";
};

export const JWT_CONFIG: JwtConfig = {
  environment: resolveEnvironment(),
  tokenType: "Bearer",
  storageType: resolveStorageType(),

  accessTokenKey: getEnvValue("VITE_ACCESS_TOKEN_KEY", "mei-crm-access-token"),
  refreshTokenKey: getEnvValue("VITE_REFRESH_TOKEN_KEY", "mei-crm-refresh-token"),
  userKey: getEnvValue("VITE_AUTH_USER_KEY", "mei-crm-user"),
  workspaceKey: getEnvValue("VITE_AUTH_WORKSPACE_KEY", "mei-crm-workspace"),

  authHeaderName: getEnvValue("VITE_AUTH_HEADER_NAME", "Authorization"),

  refreshBeforeExpiryMs: getNumberEnvValue("VITE_TOKEN_REFRESH_BEFORE_EXPIRY_MS", 2 * 60 * 1000),
  enableAutoRefresh: getBooleanEnvValue("VITE_ENABLE_TOKEN_AUTO_REFRESH", true),
  enableTokenExpiryCheck: getBooleanEnvValue("VITE_ENABLE_TOKEN_EXPIRY_CHECK", true),

  loginRoute: getEnvValue("VITE_LOGIN_ROUTE", "/login"),
  logoutRedirectRoute: getEnvValue("VITE_LOGOUT_REDIRECT_ROUTE", "/login"),

  tokenExpiredEventName: getEnvValue("VITE_TOKEN_EXPIRED_EVENT", "mei-crm-token-expired"),
  unauthorizedEventName: getEnvValue("VITE_UNAUTHORIZED_EVENT", "mei-crm-unauthorized"),
};

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (JWT_CONFIG.storageType === "localStorage") {
    return window.localStorage;
  }

  if (JWT_CONFIG.storageType === "sessionStorage") {
    return window.sessionStorage;
  }

  return null;
};

const safeBase64UrlDecode = (value: string): string => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  try {
    return decodeURIComponent(
      atob(paddedBase64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
  } catch {
    return atob(paddedBase64);
  }
};

export const getAccessToken = (): string | null => {
  if (JWT_CONFIG.storageType === "memory") {
    return memoryAccessToken;
  }

  const storage = getStorage();
  return storage?.getItem(JWT_CONFIG.accessTokenKey) ?? null;
};

export const getRefreshToken = (): string | null => {
  if (JWT_CONFIG.storageType === "memory") {
    return memoryRefreshToken;
  }

  const storage = getStorage();
  return storage?.getItem(JWT_CONFIG.refreshTokenKey) ?? null;
};

export const setAccessToken = (token: string): void => {
  if (JWT_CONFIG.storageType === "memory") {
    memoryAccessToken = token;
    return;
  }

  const storage = getStorage();
  storage?.setItem(JWT_CONFIG.accessTokenKey, token);
};

export const setRefreshToken = (token: string): void => {
  if (JWT_CONFIG.storageType === "memory") {
    memoryRefreshToken = token;
    return;
  }

  const storage = getStorage();
  storage?.setItem(JWT_CONFIG.refreshTokenKey, token);
};

export const setAuthTokens = (accessToken: string, refreshToken?: string): void => {
  setAccessToken(accessToken);

  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
};

export const clearAuthTokens = (): void => {
  if (JWT_CONFIG.storageType === "memory") {
    memoryAccessToken = null;
    memoryRefreshToken = null;
    return;
  }

  const storage = getStorage();
  storage?.removeItem(JWT_CONFIG.accessTokenKey);
  storage?.removeItem(JWT_CONFIG.refreshTokenKey);
};

export const getAuthHeader = (): Record<string, string> => {
  const token = getAccessToken();

  if (!token) {
    return {};
  }

  return {
    [JWT_CONFIG.authHeaderName]: `${JWT_CONFIG.tokenType} ${token}`,
  };
};

export const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const parts = token.split(".");

    if (parts.length !== 3 || !parts[1]) {
      return null;
    }

    const decodedPayload = safeBase64UrlDecode(parts[1]);
    return JSON.parse(decodedPayload) as JwtPayload;
  } catch {
    return null;
  }
};

export const getAccessTokenPayload = (): JwtPayload | null => {
  const token = getAccessToken();
  return token ? decodeJwtPayload(token) : null;
};

export const getTokenExpiryTime = (token: string): number | null => {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp || typeof payload.exp !== "number") {
    return null;
  }

  return payload.exp * 1000;
};

export const isTokenExpired = (token: string): boolean => {
  const expiryTime = getTokenExpiryTime(token);

  if (!expiryTime) {
    return false;
  }

  return Date.now() >= expiryTime;
};

export const willTokenExpireSoon = (token: string): boolean => {
  const expiryTime = getTokenExpiryTime(token);

  if (!expiryTime) {
    return false;
  }

  return Date.now() >= expiryTime - JWT_CONFIG.refreshBeforeExpiryMs;
};

export const isAuthenticated = (): boolean => {
  const token = getAccessToken();

  if (!token) {
    return false;
  }

  if (!JWT_CONFIG.enableTokenExpiryCheck) {
    return true;
  }

  return !isTokenExpired(token);
};

export const dispatchTokenExpiredEvent = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(JWT_CONFIG.tokenExpiredEventName));
};

export const dispatchUnauthorizedEvent = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(JWT_CONFIG.unauthorizedEventName));
};

export const assertJwtConfig = (): void => {
  const errors: string[] = [];

  if (!JWT_CONFIG.accessTokenKey) {
    errors.push("VITE_ACCESS_TOKEN_KEY is required.");
  }

  if (!JWT_CONFIG.refreshTokenKey) {
    errors.push("VITE_REFRESH_TOKEN_KEY is required.");
  }

  if (!JWT_CONFIG.authHeaderName) {
    errors.push("VITE_AUTH_HEADER_NAME is required.");
  }

  if (JWT_CONFIG.refreshBeforeExpiryMs < 0) {
    errors.push("VITE_TOKEN_REFRESH_BEFORE_EXPIRY_MS cannot be negative.");
  }

  if (errors.length > 0) {
    throw new Error(`Invalid JWT configuration:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  }
};

export const isJwtProduction = JWT_CONFIG.environment === "production";
export const isJwtDevelopment = JWT_CONFIG.environment === "development";
export const isJwtStaging = JWT_CONFIG.environment === "staging";

export default JWT_CONFIG;
