// src/utils/auth/jwt.ts

export type JwtHeader = {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
};

export type JwtPayload = {
  sub?: string;
  name?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  exp?: number;
  iat?: number;
  nbf?: number;
  iss?: string;
  aud?: string | string[];
  jti?: string;
  [key: string]: unknown;
};

export type JwtDecodeResult = {
  raw: string;
  header: JwtHeader | null;
  payload: JwtPayload | null;
  signature: string | null;
  isValidStructure: boolean;
};

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    permissions?: string[];
    [key: string]: unknown;
  };
};

export const AUTH_TOKEN_STORAGE_KEY = "mei-crm-auth-token";
export const AUTH_REFRESH_TOKEN_STORAGE_KEY = "mei-crm-refresh-token";
export const AUTH_SESSION_STORAGE_KEY = "mei-crm-auth";
export const CURRENT_USER_STORAGE_KEY = "mei_crm_current_user";

function normalizeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64.length % 4;
  if (padding === 0) return base64;
  return base64 + "=".repeat(4 - padding);
}

function decodeBase64Url(input: string): string | null {
  try {
    const normalized = normalizeBase64Url(input);

    if (typeof window !== "undefined" && typeof window.atob === "function") {
      const binary = window.atob(normalized);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    }

    return null;
  } catch {
    return null;
  }
}

function safeJsonParse<T>(value: string | null): T | null {
  try {
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function stripBearerPrefix(token: string): string {
  return token.replace(/^Bearer\s+/i, "").trim();
}

export function isJwtToken(token: string | null | undefined): boolean {
  if (!token?.trim()) return false;
  const raw = stripBearerPrefix(token);
  const parts = raw.split(".");
  return parts.length === 3 && parts.every(Boolean);
}

export function decodeJwt(token: string): JwtDecodeResult {
  const raw = stripBearerPrefix(token);

  if (!isJwtToken(raw)) {
    return {
      raw,
      header: null,
      payload: null,
      signature: null,
      isValidStructure: false,
    };
  }

  const [headerPart, payloadPart, signaturePart] = raw.split(".");
  const decodedHeader = decodeBase64Url(headerPart);
  const decodedPayload = decodeBase64Url(payloadPart);

  const header = safeJsonParse<JwtHeader>(decodedHeader);
  const payload = safeJsonParse<JwtPayload>(decodedPayload);

  return {
    raw,
    header,
    payload,
    signature: signaturePart ?? null,
    isValidStructure: Boolean(header && payload),
  };
}

export function getJwtPayload(token: string | null | undefined): JwtPayload | null {
  if (!token) return null;
  return decodeJwt(token).payload;
}

export function getJwtHeader(token: string | null | undefined): JwtHeader | null {
  if (!token) return null;
  return decodeJwt(token).header;
}

export function getJwtExpiration(token: string | null | undefined): number | null {
  const payload = getJwtPayload(token);
  return typeof payload?.exp === "number" ? payload.exp : null;
}

export function getJwtIssuedAt(token: string | null | undefined): number | null {
  const payload = getJwtPayload(token);
  return typeof payload?.iat === "number" ? payload.iat : null;
}

export function getJwtNotBefore(token: string | null | undefined): number | null {
  const payload = getJwtPayload(token);
  return typeof payload?.nbf === "number" ? payload.nbf : null;
}

export function getJwtExpirationDate(token: string | null | undefined): Date | null {
  const exp = getJwtExpiration(token);
  return typeof exp === "number" ? new Date(exp * 1000) : null;
}

export function getJwtIssuedAtDate(token: string | null | undefined): Date | null {
  const iat = getJwtIssuedAt(token);
  return typeof iat === "number" ? new Date(iat * 1000) : null;
}

export function isJwtExpired(
  token: string | null | undefined,
  clockSkewSeconds = 0
): boolean {
  const exp = getJwtExpiration(token);
  if (typeof exp !== "number") return true;

  const now = Math.floor(Date.now() / 1000);
  return now >= exp - clockSkewSeconds;
}

export function isJwtActive(
  token: string | null | undefined,
  clockSkewSeconds = 0
): boolean {
  const payload = getJwtPayload(token);
  if (!payload) return false;

  const now = Math.floor(Date.now() / 1000);

  if (typeof payload.nbf === "number" && now + clockSkewSeconds < payload.nbf) {
    return false;
  }

  if (typeof payload.exp === "number" && now >= payload.exp - clockSkewSeconds) {
    return false;
  }

  return true;
}

export function willJwtExpireSoon(
  token: string | null | undefined,
  withinSeconds = 300
): boolean {
  const exp = getJwtExpiration(token);
  if (typeof exp !== "number") return true;

  const now = Math.floor(Date.now() / 1000);
  return exp - now <= withinSeconds;
}

export function getSecondsUntilExpiry(token: string | null | undefined): number {
  const exp = getJwtExpiration(token);
  if (typeof exp !== "number") return 0;

  const now = Math.floor(Date.now() / 1000);
  return Math.max(exp - now, 0);
}

export function getMinutesUntilExpiry(token: string | null | undefined): number {
  return Math.ceil(getSecondsUntilExpiry(token) / 60);
}

export function getUserFromJwt(token: string | null | undefined) {
  const payload = getJwtPayload(token);

  if (!payload) return null;

  return {
    id:
      typeof payload.sub === "string"
        ? payload.sub
        : typeof payload.id === "string"
          ? payload.id
          : undefined,
    name:
      typeof payload.name === "string"
        ? payload.name
        : typeof payload.fullName === "string"
          ? payload.fullName
          : undefined,
    email: typeof payload.email === "string" ? payload.email : undefined,
    role: typeof payload.role === "string" ? payload.role : undefined,
    permissions: Array.isArray(payload.permissions)
      ? payload.permissions.filter((item): item is string => typeof item === "string")
      : [],
    payload,
  };
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, stripBearerPrefix(token));
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function removeAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_REFRESH_TOKEN_STORAGE_KEY, stripBearerPrefix(token));
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);
}

export function removeRefreshToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);
}

export function setAuthSession(session: AuthSession): void {
  if (typeof window === "undefined") return;

  const normalizedAccessToken = stripBearerPrefix(session.accessToken);

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, normalizedAccessToken);

  if (session.refreshToken) {
    localStorage.setItem(
      AUTH_REFRESH_TOKEN_STORAGE_KEY,
      stripBearerPrefix(session.refreshToken)
    );
  }

  localStorage.setItem(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify({
      ...session,
      accessToken: normalizedAccessToken,
      refreshToken: session.refreshToken
        ? stripBearerPrefix(session.refreshToken)
        : undefined,
    })
  );

  if (session.user) {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(session.user));
  } else {
    const derivedUser = getUserFromJwt(normalizedAccessToken);
    if (derivedUser) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(derivedUser));
    }
  }
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<AuthSession>(localStorage.getItem(AUTH_SESSION_STORAGE_KEY));
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);

  sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  sessionStorage.removeItem(CURRENT_USER_STORAGE_KEY);

  localStorage.removeItem("mei-crm-auth");
  sessionStorage.removeItem("mei-crm-auth");
}

export function isAuthenticated(): boolean {
  const token = getAccessToken();
  return Boolean(token && isJwtToken(token) && !isJwtExpired(token, 5));
}

export function getAuthHeader(
  token: string | null | undefined = getAccessToken()
): Record<string, string> {
  if (!token) return {};
  return {
    Authorization: `Bearer ${stripBearerPrefix(token)}`,
  };
}

export function parseAuthorizationHeader(
  authHeader: string | null | undefined
): string | null {
  if (!authHeader?.trim()) return null;
  return stripBearerPrefix(authHeader);
}

export function getCurrentUserFromStorage<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<T>(localStorage.getItem(CURRENT_USER_STORAGE_KEY));
}

export function getCurrentUserFromToken() {
  return getUserFromJwt(getAccessToken());
}

export function syncUserFromTokenToStorage(): void {
  if (typeof window === "undefined") return;

  const token = getAccessToken();
  const user = getUserFromJwt(token);

  if (user) {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export function isTokenRefreshRequired(
  token: string | null | undefined = getAccessToken(),
  thresholdSeconds = 300
): boolean {
  return willJwtExpireSoon(token, thresholdSeconds);
}

export function assertValidToken(token: string | null | undefined): {
  ok: boolean;
  reason?: "missing" | "invalid" | "expired" | "inactive";
  payload?: JwtPayload | null;
} {
  if (!token) {
    return { ok: false, reason: "missing" };
  }

  if (!isJwtToken(token)) {
    return { ok: false, reason: "invalid" };
  }

  const payload = getJwtPayload(token);

  if (!payload) {
    return { ok: false, reason: "invalid" };
  }

  if (!isJwtActive(token, 0)) {
    if (isJwtExpired(token, 0)) {
      return { ok: false, reason: "expired", payload };
    }

    return { ok: false, reason: "inactive", payload };
  }

  return { ok: true, payload };
}