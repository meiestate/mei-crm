// src/prisma/client.ts

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiErrorPayload = {
  message?: string;
  error?: string;
  statusCode?: number;
  code?: string;
  errors?: Record<string, string[] | string>;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type RequestConfig = {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  body?: unknown;
  timeout?: number;
  responseType?: "json" | "text" | "blob";
};

export type ApiResponse<T = unknown> = {
  data: T;
  status: number;
  ok: boolean;
  headers: Headers;
};

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload | unknown;

  constructor(message: string, status: number, payload?: ApiErrorPayload | unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const ACCESS_TOKEN_KEY = "mei_access_token";
const REFRESH_TOKEN_KEY = "mei_refresh_token";
const WORKSPACE_KEY = "mei_workspace_id";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  "http://localhost:5000/api";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

function getWorkspaceId(): string | null {
  try {
    return localStorage.getItem(WORKSPACE_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export function setRefreshToken(token: string): void {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export function setWorkspaceId(workspaceId: string): void {
  try {
    localStorage.setItem(WORKSPACE_KEY, workspaceId);
  } catch {
    // ignore
  }
}

export function setAuthTokens(tokens: AuthTokens): void {
  setAccessToken(tokens.accessToken);

  if (tokens.refreshToken) {
    setRefreshToken(tokens.refreshToken);
  }
}

export function clearAuthStorage(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(WORKSPACE_KEY);
  } catch {
    // ignore
  }
}

function cleanParams(params?: Record<string, unknown>): Record<string, string> {
  if (!params) return {};

  const cleaned: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return;
    }

    cleaned[key] = String(value);
  });

  return cleaned;
}

function buildUrl(url: string, params?: Record<string, unknown>): string {
  const isAbsolute = /^https?:\/\//i.test(url);
  const base = isAbsolute ? url : `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;

  const query = new URLSearchParams(cleanParams(params)).toString();

  return query ? `${base}?${query}` : base;
}

function mergeHeaders(customHeaders?: Record<string, string>): Headers {
  const headers = new Headers();

  headers.set("Accept", "application/json");

  const accessToken = getAccessToken();
  const workspaceId = getWorkspaceId();

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (workspaceId) {
    headers.set("x-workspace-id", workspaceId);
  }

  if (customHeaders) {
    Object.entries(customHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }

  return headers;
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

function createAbortSignal(timeout = 30000): AbortSignal | undefined {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(timeout);
  }

  return undefined;
}

async function parseErrorPayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  } catch {
    return undefined;
  }
}

async function parseSuccessResponse<T>(
  response: Response,
  responseType: "json" | "text" | "blob" = "json",
): Promise<T> {
  if (responseType === "blob") {
    return (await response.blob()) as T;
  }

  if (responseType === "text") {
    return (await response.text()) as T;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearAuthStorage();
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearAuthStorage();
      return null;
    }

    const data = (await response.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };

    if (!data.accessToken) {
      clearAuthStorage();
      return null;
    }

    setAccessToken(data.accessToken);

    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }

    return data.accessToken;
  } catch {
    clearAuthStorage();
    return null;
  }
}

async function request<T>(
  method: HttpMethod,
  url: string,
  config: RequestConfig = {},
  retry = true,
): Promise<ApiResponse<T>> {
  const { headers: customHeaders, params, body, timeout = 30000, responseType = "json" } = config;

  const headers = mergeHeaders(customHeaders);
  const init: RequestInit = {
    method,
    headers,
    signal: createAbortSignal(timeout),
  };

  if (body !== undefined && method !== "GET") {
    if (isFormData(body)) {
      init.body = body;
    } else {
      headers.set("Content-Type", "application/json");
      init.body = JSON.stringify(body);
    }
  }

  const response = await fetch(buildUrl(url, params), init);

  if (response.ok) {
    const data = await parseSuccessResponse<T>(response, responseType);
    return {
      data,
      status: response.status,
      ok: true,
      headers: response.headers,
    };
  }

  if (response.status === 401 && retry && !url.includes("/auth/refresh")) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
      });
    }

    const newToken = await refreshPromise;

    if (newToken) {
      return request<T>(method, url, config, false);
    }
  }

  const payload = await parseErrorPayload(response);
  const message =
    typeof payload === "object" && payload !== null
      ? ((payload as ApiErrorPayload).message ||
          (payload as ApiErrorPayload).error ||
          `Request failed with status ${response.status}`)
      : `Request failed with status ${response.status}`;

  throw new ApiError(message, response.status, payload);
}

const client = {
  async get<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return request<T>("GET", url, config);
  },

  async post<T = unknown, B = unknown>(
    url: string,
    body?: B,
    config?: Omit<RequestConfig, "body">,
  ): Promise<ApiResponse<T>> {
    return request<T>("POST", url, { ...config, body });
  },

  async put<T = unknown, B = unknown>(
    url: string,
    body?: B,
    config?: Omit<RequestConfig, "body">,
  ): Promise<ApiResponse<T>> {
    return request<T>("PUT", url, { ...config, body });
  },

  async patch<T = unknown, B = unknown>(
    url: string,
    body?: B,
    config?: Omit<RequestConfig, "body">,
  ): Promise<ApiResponse<T>> {
    return request<T>("PATCH", url, { ...config, body });
  },

  async delete<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return request<T>("DELETE", url, config);
  },
};

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export async function apiGet<T = unknown>(
  url: string,
  config?: RequestConfig,
): Promise<T> {
  const response = await client.get<T>(url, config);
  return response.data;
}

export async function apiPost<T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: Omit<RequestConfig, "body">,
): Promise<T> {
  const response = await client.post<T, B>(url, body, config);
  return response.data;
}

export async function apiPut<T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: Omit<RequestConfig, "body">,
): Promise<T> {
  const response = await client.put<T, B>(url, body, config);
  return response.data;
}

export async function apiPatch<T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: Omit<RequestConfig, "body">,
): Promise<T> {
  const response = await client.patch<T, B>(url, body, config);
  return response.data;
}

export async function apiDelete<T = unknown>(
  url: string,
  config?: RequestConfig,
): Promise<T> {
  const response = await client.delete<T>(url, config);
  return response.data;
}

export default client;