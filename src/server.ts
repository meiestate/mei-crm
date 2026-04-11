// src/server.ts

import { getAuthorizationHeader } from "./utils/token";
import {
  createErrorResponse,
  createSuccessResponse,
  type ApiResponse,
} from "./utils/response";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;

export type RequestQueryParams = Record<string, RequestQueryValue>;

export type ServerRequestOptions = {
  method?: HttpMethod;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
  query?: RequestQueryParams;
  auth?: boolean;
  timeoutMs?: number;
  signal?: AbortSignal;
  baseUrl?: string;
};

export type ServerConfig = {
  baseUrl: string;
  defaultTimeoutMs: number;
  withCredentials: boolean;
};

const envBaseUrl =
  typeof import.meta !== "undefined" &&
  (import.meta as ImportMeta & { env?: Record<string, string> }).env
    ?.VITE_API_BASE_URL
    ? ((import.meta as ImportMeta & { env?: Record<string, string> }).env
        ?.VITE_API_BASE_URL as string)
    : "http://localhost:5000/api";

export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  baseUrl: envBaseUrl,
  defaultTimeoutMs: 15000,
  withCredentials: true,
};

let runtimeServerConfig: ServerConfig = { ...DEFAULT_SERVER_CONFIG };

export function setServerConfig(config: Partial<ServerConfig>): void {
  runtimeServerConfig = {
    ...runtimeServerConfig,
    ...config,
  };
}

export function getServerConfig(): ServerConfig {
  return { ...runtimeServerConfig };
}

export function getApiBaseUrl(): string {
  return runtimeServerConfig.baseUrl;
}

export function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function buildUrl(
  path: string,
  query?: RequestQueryParams,
  baseUrl?: string
): string {
  const resolvedBaseUrl = (baseUrl ?? getApiBaseUrl()).replace(/\/+$/, "");
  const resolvedPath = normalizePath(path);
  const url = new URL(`${resolvedBaseUrl}${resolvedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      if (Array.isArray(value)) {
        value.forEach((item) => {
          url.searchParams.append(key, String(item));
        });
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

export function createJsonHeaders(
  customHeaders: Record<string, string> = {},
  auth = false
): Record<string, string> {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(auth ? getAuthorizationHeader() : {}),
    ...customHeaders,
  };
}

export function createFormHeaders(
  customHeaders: Record<string, string> = {},
  auth = false
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(auth ? getAuthorizationHeader() : {}),
    ...customHeaders,
  };

  delete headers["Content-Type"];
  return headers;
}

export function isFormDataBody(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

export function isBlobBody(value: unknown): value is Blob {
  return typeof Blob !== "undefined" && value instanceof Blob;
}

export function isReadableBody(value: unknown): boolean {
  return isFormDataBody(value) || isBlobBody(value);
}

export function createAbortController(timeoutMs: number): {
  controller: AbortController;
  clear: () => void;
} {
  const controller = new AbortController();

  const timeoutId =
    typeof window !== "undefined"
      ? window.setTimeout(() => controller.abort(), timeoutMs)
      : setTimeout(() => controller.abort(), timeoutMs);

  return {
    controller,
    clear: () => clearTimeout(timeoutId),
  };
}

export async function safeParseJson<T = unknown>(
  response: Response
): Promise<T | null> {
  try {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function extractResponseMessage(
  data: unknown,
  fallback: string
): string {
  if (typeof data === "string" && data.trim()) return data;

  if (typeof data === "object" && data !== null) {
    const candidate = data as {
      message?: unknown;
      error?: unknown;
    };

    if (typeof candidate.message === "string" && candidate.message.trim()) {
      return candidate.message;
    }

    if (typeof candidate.error === "string" && candidate.error.trim()) {
      return candidate.error;
    }
  }

  return fallback;
}

export async function request<T = unknown>(
  options: ServerRequestOptions
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    path,
    body,
    headers = {},
    query,
    auth = false,
    timeoutMs = getServerConfig().defaultTimeoutMs,
    signal,
    baseUrl,
  } = options;

  const url = buildUrl(path, query, baseUrl);
  const timeoutController = createAbortController(timeoutMs);

  const linkedSignal = signal ?? timeoutController.controller.signal;

  try {
    const finalHeaders = isFormDataBody(body)
      ? createFormHeaders(headers, auth)
      : createJsonHeaders(headers, auth);

    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body:
        method === "GET" || method === "DELETE"
          ? undefined
          : isReadableBody(body)
            ? (body as BodyInit)
            : body !== undefined
              ? JSON.stringify(body)
              : undefined,
      credentials: getServerConfig().withCredentials ? "include" : "same-origin",
      signal: linkedSignal,
    });

    const parsed = await safeParseJson<T | Record<string, unknown>>(response);

    if (!response.ok) {
      return createErrorResponse(
        extractResponseMessage(
          parsed,
          `Request failed with status ${response.status}`
        ),
        {
          status: response.status,
          details: parsed ?? undefined,
          validationErrors:
            typeof parsed === "object" &&
            parsed !== null &&
            "validationErrors" in parsed
              ? (parsed.validationErrors as Record<string, string | string[]>)
              : undefined,
        }
      );
    }

    if (
      parsed &&
      typeof parsed === "object" &&
      "success" in parsed &&
      typeof (parsed as { success?: unknown }).success === "boolean"
    ) {
      return parsed as ApiResponse<T>;
    }

    return createSuccessResponse((parsed as T) ?? (null as T), "Success");
  } catch (error) {
    const isAbortError =
      error instanceof DOMException && error.name === "AbortError";

    return createErrorResponse(
      isAbortError
        ? "Request timed out or was cancelled"
        : "Network request failed",
      {
        code: isAbortError ? "REQUEST_ABORTED" : "NETWORK_ERROR",
        details: error,
      }
    );
  } finally {
    timeoutController.clear();
  }
}

export async function get<T = unknown>(
  path: string,
  options: Omit<ServerRequestOptions, "method" | "path"> = {}
): Promise<ApiResponse<T>> {
  return request<T>({
    ...options,
    method: "GET",
    path,
  });
}

export async function post<T = unknown>(
  path: string,
  body?: unknown,
  options: Omit<ServerRequestOptions, "method" | "path" | "body"> = {}
): Promise<ApiResponse<T>> {
  return request<T>({
    ...options,
    method: "POST",
    path,
    body,
  });
}

export async function put<T = unknown>(
  path: string,
  body?: unknown,
  options: Omit<ServerRequestOptions, "method" | "path" | "body"> = {}
): Promise<ApiResponse<T>> {
  return request<T>({
    ...options,
    method: "PUT",
    path,
    body,
  });
}

export async function patch<T = unknown>(
  path: string,
  body?: unknown,
  options: Omit<ServerRequestOptions, "method" | "path" | "body"> = {}
): Promise<ApiResponse<T>> {
  return request<T>({
    ...options,
    method: "PATCH",
    path,
    body,
  });
}

export async function del<T = unknown>(
  path: string,
  options: Omit<ServerRequestOptions, "method" | "path"> = {}
): Promise<ApiResponse<T>> {
  return request<T>({
    ...options,
    method: "DELETE",
    path,
  });
}

export const server = {
  request,
  get,
  post,
  put,
  patch,
  delete: del,
  buildUrl,
  getApiBaseUrl,
  setServerConfig,
  getServerConfig,
};