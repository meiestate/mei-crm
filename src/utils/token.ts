// src/utils/auth/token.ts

export type TokenStorageType = "local" | "session";

export type AuthTokenBundle = {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresAt?: number | null;
};

export const ACCESS_TOKEN_STORAGE_KEY = "mei-crm-auth-token";
export const REFRESH_TOKEN_STORAGE_KEY = "mei-crm-refresh-token";
export const TOKEN_TYPE_STORAGE_KEY = "mei-crm-token-type";
export const TOKEN_EXPIRY_STORAGE_KEY = "mei-crm-token-expiry";

function getStorage(type: TokenStorageType): Storage | null {
  if (typeof window === "undefined") return null;
  return type === "session" ? window.sessionStorage : window.localStorage;
}

function getAllStorages(): Storage[] {
  if (typeof window === "undefined") return [];
  return [window.localStorage, window.sessionStorage];
}

export function stripBearerPrefix(token: string): string {
  return String(token ?? "").replace(/^Bearer\s+/i, "").trim();
}

export function withBearerPrefix(token: string): string {
  const normalized = stripBearerPrefix(token);
  return normalized ? `Bearer ${normalized}` : "";
}

export function isTokenPresent(token: string | null | undefined): boolean {
  return Boolean(stripBearerPrefix(token ?? ""));
}

export function isBearerToken(value: string | null | undefined): boolean {
  return /^Bearer\s+/i.test(String(value ?? "").trim());
}

export function getTokenLength(token: string | null | undefined): number {
  return stripBearerPrefix(token ?? "").length;
}

export function maskToken(token: string | null | undefined, visible = 6): string {
  const normalized = stripBearerPrefix(token ?? "");
  if (!normalized) return "";
  if (normalized.length <= visible * 2) return normalized;

  return `${normalized.slice(0, visible)}...${normalized.slice(-visible)}`;
}

export function setAccessToken(
  token: string,
  storageType: TokenStorageType = "local"
): void {
  const storage = getStorage(storageType);
  if (!storage) return;

  storage.setItem(ACCESS_TOKEN_STORAGE_KEY, stripBearerPrefix(token));
}

export function getAccessToken(): string | null {
  const storages = getAllStorages();

  for (const storage of storages) {
    const token = storage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (token) return token;
  }

  return null;
}

export function removeAccessToken(): void {
  getAllStorages().forEach((storage) =>
    storage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  );
}

export function setRefreshToken(
  token: string,
  storageType: TokenStorageType = "local"
): void {
  const storage = getStorage(storageType);
  if (!storage) return;

  storage.setItem(REFRESH_TOKEN_STORAGE_KEY, stripBearerPrefix(token));
}

export function getRefreshToken(): string | null {
  const storages = getAllStorages();

  for (const storage of storages) {
    const token = storage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    if (token) return token;
  }

  return null;
}

export function removeRefreshToken(): void {
  getAllStorages().forEach((storage) =>
    storage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
  );
}

export function setTokenType(
  tokenType: string,
  storageType: TokenStorageType = "local"
): void {
  const storage = getStorage(storageType);
  if (!storage) return;

  storage.setItem(TOKEN_TYPE_STORAGE_KEY, tokenType.trim());
}

export function getTokenType(): string | null {
  const storages = getAllStorages();

  for (const storage of storages) {
    const tokenType = storage.getItem(TOKEN_TYPE_STORAGE_KEY);
    if (tokenType) return tokenType;
  }

  return null;
}

export function removeTokenType(): void {
  getAllStorages().forEach((storage) =>
    storage.removeItem(TOKEN_TYPE_STORAGE_KEY)
  );
}

export function setTokenExpiry(
  expiresAt: number,
  storageType: TokenStorageType = "local"
): void {
  const storage = getStorage(storageType);
  if (!storage) return;

  storage.setItem(TOKEN_EXPIRY_STORAGE_KEY, String(expiresAt));
}

export function getTokenExpiry(): number | null {
  const storages = getAllStorages();

  for (const storage of storages) {
    const raw = storage.getItem(TOKEN_EXPIRY_STORAGE_KEY);
    if (!raw) continue;

    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) return parsed;
  }

  return null;
}

export function removeTokenExpiry(): void {
  getAllStorages().forEach((storage) =>
    storage.removeItem(TOKEN_EXPIRY_STORAGE_KEY)
  );
}

export function setTokenBundle(
  bundle: AuthTokenBundle,
  storageType: TokenStorageType = "local"
): void {
  setAccessToken(bundle.accessToken, storageType);

  if (bundle.refreshToken) {
    setRefreshToken(bundle.refreshToken, storageType);
  }

  if (bundle.tokenType) {
    setTokenType(bundle.tokenType, storageType);
  }

  if (typeof bundle.expiresAt === "number") {
    setTokenExpiry(bundle.expiresAt, storageType);
  }
}

export function getTokenBundle(): AuthTokenBundle | null {
  const accessToken = getAccessToken();
  if (!accessToken) return null;

  return {
    accessToken,
    refreshToken: getRefreshToken() ?? undefined,
    tokenType: getTokenType() ?? undefined,
    expiresAt: getTokenExpiry(),
  };
}

export function clearTokenBundle(): void {
  removeAccessToken();
  removeRefreshToken();
  removeTokenType();
  removeTokenExpiry();
}

export function hasAccessToken(): boolean {
  return isTokenPresent(getAccessToken());
}

export function hasRefreshToken(): boolean {
  return isTokenPresent(getRefreshToken());
}

export function hasTokenBundle(): boolean {
  return hasAccessToken();
}

export function getAuthorizationHeader(
  token: string | null | undefined = getAccessToken(),
  tokenType?: string | null
): Record<string, string> {
  const normalized = stripBearerPrefix(token ?? "");
  if (!normalized) return {};

  const resolvedType = (tokenType ?? getTokenType() ?? "Bearer").trim();

  return {
    Authorization: `${resolvedType} ${normalized}`,
  };
}

export function parseAuthorizationHeader(
  authorizationHeader: string | null | undefined
): {
  tokenType: string | null;
  token: string | null;
} {
  const raw = String(authorizationHeader ?? "").trim();
  if (!raw) {
    return { tokenType: null, token: null };
  }

  const parts = raw.split(/\s+/);
  if (parts.length < 2) {
    return {
      tokenType: null,
      token: stripBearerPrefix(raw) || null,
    };
  }

  return {
    tokenType: parts[0] || null,
    token: stripBearerPrefix(parts.slice(1).join(" ")) || null,
  };
}

export function getTokenRemainingMs(expiresAt?: number | null): number {
  if (typeof expiresAt !== "number") return 0;
  return Math.max(expiresAt - Date.now(), 0);
}

export function getTokenRemainingSeconds(expiresAt?: number | null): number {
  return Math.ceil(getTokenRemainingMs(expiresAt) / 1000);
}

export function isTokenExpired(expiresAt?: number | null): boolean {
  if (typeof expiresAt !== "number") return true;
  return Date.now() >= expiresAt;
}

export function willTokenExpireSoon(
  expiresAt?: number | null,
  withinSeconds = 300
): boolean {
  if (typeof expiresAt !== "number") return true;
  return getTokenRemainingSeconds(expiresAt) <= withinSeconds;
}

export function moveTokenBundleToStorage(
  targetStorageType: TokenStorageType
): void {
  const bundle = getTokenBundle();
  if (!bundle) return;

  clearTokenBundle();
  setTokenBundle(bundle, targetStorageType);
}

export function persistTokenBundle(bundle: AuthTokenBundle, rememberMe = true): void {
  setTokenBundle(bundle, rememberMe ? "local" : "session");
}

export function getTokenStorageType(): TokenStorageType | null {
  if (typeof window === "undefined") return null;

  if (window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)) return "local";
  if (window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)) return "session";

  return null;
}

export function syncAccessTokenBetweenStorages(): void {
  if (typeof window === "undefined") return;

  const localToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const sessionToken = window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  if (localToken && !sessionToken) {
    window.sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, localToken);
    return;
  }

  if (!localToken && sessionToken) {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, sessionToken);
  }
}

export function clearSessionOnlyTokens(): void {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  window.sessionStorage.removeItem(TOKEN_TYPE_STORAGE_KEY);
  window.sessionStorage.removeItem(TOKEN_EXPIRY_STORAGE_KEY);
}

export function clearLocalOnlyTokens(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(TOKEN_TYPE_STORAGE_KEY);
  window.localStorage.removeItem(TOKEN_EXPIRY_STORAGE_KEY);
}