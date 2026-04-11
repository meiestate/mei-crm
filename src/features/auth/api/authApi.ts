import type { AuthTokens, AuthUser } from "../../../app/store/authStore";

export type ThemeMode = "light" | "dark";

export type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type VerifyMobileOtpPayload = {
  phone: string;
  otp: string;
};

export type ResendOtpPayload = {
  email?: string;
  phone?: string;
  channel: "email" | "sms";
};

export type RefreshTokenPayload = {
  refreshToken: string;
};

export type AuthSession = {
  user: AuthUser;
  tokens: AuthTokens | null;
};

export type AuthMeResponse = {
  user: AuthUser;
};

export type LogoutResponse = {
  loggedOut: boolean;
};

const AUTH_API_BASE_URL =
  (import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  }).env?.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

const AUTH_API_PREFIX = "/auth";

class AuthApiError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      errors?: Record<string, string[]>;
    },
  ) {
    super(message);
    this.name = "AuthApiError";
    this.statusCode = options?.statusCode;
    this.errors = options?.errors;
  }
}

function buildAuthUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${AUTH_API_BASE_URL}${AUTH_API_PREFIX}${normalizedPath}`;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeAuthUser(input: unknown): AuthUser {
  if (!isObject(input)) {
    throw new AuthApiError("Invalid user data received from server.");
  }

  return {
    id: String(input.id ?? ""),
    name: String(input.name ?? input.fullName ?? "User"),
    email: String(input.email ?? ""),
    phone:
      typeof input.phone === "string" && input.phone.trim().length > 0
        ? input.phone
        : undefined,
    avatar:
      typeof input.avatar === "string" && input.avatar.trim().length > 0
        ? input.avatar
        : undefined,
    role:
      typeof input.role === "string" && input.role.trim().length > 0
        ? input.role
        : undefined,
  };
}

function normalizeTokens(input: unknown): AuthTokens | null {
  if (!isObject(input)) {
    return null;
  }

  const accessToken =
    typeof input.accessToken === "string"
      ? input.accessToken
      : typeof input.access_token === "string"
        ? input.access_token
        : undefined;

  const refreshToken =
    typeof input.refreshToken === "string"
      ? input.refreshToken
      : typeof input.refresh_token === "string"
        ? input.refresh_token
        : undefined;

  if (!accessToken && !refreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
  };
}

async function parseApiResponse<T>(
  response: Response,
): Promise<ApiResponse<T>> {
  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      isObject(body) && typeof body.message === "string"
        ? body.message
        : "Request failed. Please try again.";

    const errors =
      isObject(body) && isObject(body.errors)
        ? (body.errors as Record<string, string[]>)
        : undefined;

    return {
      success: false,
      message,
      errors,
      statusCode: response.status,
    };
  }

  if (isObject(body) && "success" in body) {
    return body as ApiResponse<T>;
  }

  return {
    success: true,
    data: body as T,
  };
}

async function request<T>(
  path: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    accessToken?: string;
    signal?: AbortSignal;
  },
): Promise<T> {
  const response = await fetch(buildAuthUrl(path), {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options?.accessToken
        ? { Authorization: `Bearer ${options.accessToken}` }
        : {}),
    },
    body:
      options?.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options?.signal,
  });

  const parsed = await parseApiResponse<T>(response);

  if (!parsed.success) {
    throw new AuthApiError(parsed.message, {
      statusCode: parsed.statusCode,
      errors: parsed.errors,
    });
  }

  return parsed.data;
}

function normalizeSessionPayload(input: unknown): AuthSession {
  if (!isObject(input)) {
    throw new AuthApiError("Invalid authentication response.");
  }

  const user = normalizeAuthUser(input.user);
  const tokens = normalizeTokens(input.tokens ?? input);

  return {
    user,
    tokens,
  };
}

export async function loginApi(
  payload: LoginPayload,
  signal?: AbortSignal,
): Promise<AuthSession> {
  const data = await request<unknown>("/login", {
    method: "POST",
    body: payload,
    signal,
  });

  return normalizeSessionPayload(data);
}

export async function signupApi(
  payload: SignupPayload,
  signal?: AbortSignal,
): Promise<AuthSession> {
  const data = await request<unknown>("/signup", {
    method: "POST",
    body: payload,
    signal,
  });

  return normalizeSessionPayload(data);
}

export async function forgotPasswordApi(
  payload: ForgotPasswordPayload,
  signal?: AbortSignal,
): Promise<{ sent: boolean; message?: string }> {
  return request<{ sent: boolean; message?: string }>("/forgot-password", {
    method: "POST",
    body: payload,
    signal,
  });
}

export async function resetPasswordApi(
  payload: ResetPasswordPayload,
  signal?: AbortSignal,
): Promise<{ reset: boolean; message?: string }> {
  return request<{ reset: boolean; message?: string }>("/reset-password", {
    method: "POST",
    body: payload,
    signal,
  });
}

export async function verifyEmailApi(
  payload: VerifyEmailPayload,
  signal?: AbortSignal,
): Promise<{ verified: boolean; message?: string }> {
  return request<{ verified: boolean; message?: string }>("/verify-email", {
    method: "POST",
    body: payload,
    signal,
  });
}

export async function verifyMobileOtpApi(
  payload: VerifyMobileOtpPayload,
  signal?: AbortSignal,
): Promise<{ verified: boolean; message?: string }> {
  return request<{ verified: boolean; message?: string }>("/verify-mobile", {
    method: "POST",
    body: payload,
    signal,
  });
}

export async function resendOtpApi(
  payload: ResendOtpPayload,
  signal?: AbortSignal,
): Promise<{ sent: boolean; message?: string }> {
  return request<{ sent: boolean; message?: string }>("/resend-otp", {
    method: "POST",
    body: payload,
    signal,
  });
}

export async function refreshTokenApi(
  payload: RefreshTokenPayload,
  signal?: AbortSignal,
): Promise<AuthTokens | null> {
  const data = await request<unknown>("/refresh-token", {
    method: "POST",
    body: payload,
    signal,
  });

  return normalizeTokens(data);
}

export async function getMeApi(
  accessToken: string,
  signal?: AbortSignal,
): Promise<AuthMeResponse> {
  const data = await request<unknown>("/me", {
    method: "GET",
    accessToken,
    signal,
  });

  if (!isObject(data)) {
    throw new AuthApiError("Invalid profile response.");
  }

  return {
    user: normalizeAuthUser(data.user ?? data),
  };
}

export async function logoutApi(
  accessToken?: string,
  signal?: AbortSignal,
): Promise<LogoutResponse> {
  try {
    return await request<LogoutResponse>("/logout", {
      method: "POST",
      accessToken,
      signal,
    });
  } catch (error) {
    if (error instanceof AuthApiError && error.statusCode === 401) {
      return { loggedOut: true };
    }

    throw error;
  }
}

export { AuthApiError };