// src/services/apiClient.ts

import type {
  ApiError,
  ApiResult,
  HttpMethod,
  QueryParams,
} from "../types/api";

type Primitive = string | number | boolean | null | undefined;
type QueryValue = Primitive | Primitive[];

export type ApiClientConfig = {
  baseUrl?: string;
  getAccessToken?: () => string | null;
  getWorkspaceId?: () => string | null;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
};

export type RequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  query?: QueryParams;
  signal?: AbortSignal;
  timeoutMs?: number;
  skipAuth?: boolean;
  skipWorkspace?: boolean;
};

export type UploadFileOptions = {
  fieldName?: string;
  fileName?: string;
  extraFields?: Record<string, string | Blob>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
  skipAuth?: boolean;
  skipWorkspace?: boolean;
};

const DEFAULT_TIMEOUT_MS = 20000;

function getEnvBaseUrl(): string {
  const envValue =
    typeof import.meta !== "undefined" &&
    (import.meta as ImportMeta & {
      env?: Record<string, string | undefined>;
    }).env
      ? (import.meta as ImportMeta & {
          env: Record<string, string | undefined>;
        }).env.VITE_API_BASE_URL
      : "";

  return typeof envValue === "string" ? envValue.trim() : "";
}

function normalizeBaseUrl(baseUrl?: string): string {
  const value = (baseUrl ?? getEnvBaseUrl()).trim();
  return value.replace(/\/+$/, "");
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

function isBlob(value: unknown): value is Blob {
  return typeof Blob !== "undefined" && value instanceof Blob;
}

function isApiErrorLike(value: unknown): value is ApiError {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;

  return (
    record.success === false &&
    typeof record.message === "string"
  );
}

function buildQueryString(query?: QueryParams): string {
  if (!query) return "";

  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, rawValue]) => {
    const value = rawValue as QueryValue;

    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          searchParams.append(key, String(item));
        }
      });
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

function joinUrl(baseUrl: string, path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (!baseUrl) {
    return cleanPath;
  }

  return `${baseUrl}${cleanPath}`;
}

function createTimeoutSignal(
  timeoutMs: number,
  externalSignal?: AbortSignal
): {
  signal: AbortSignal;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort(
      new DOMException("Request timed out", "TimeoutError")
    );
  }, timeoutMs);

  const abortFromExternalSignal = () => {
    controller.abort(
      externalSignal?.reason instanceof Error
        ? externalSignal.reason
        : new DOMException("Request aborted", "AbortError")
    );
  };

  if (externalSignal) {
    if (externalSignal.aborted) {
      abortFromExternalSignal();
    } else {
      externalSignal.addEventListener("abort", abortFromExternalSignal, {
        once: true,
      });
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      window.clearTimeout(timeoutId);

      if (externalSignal) {
        externalSignal.removeEventListener("abort", abortFromExternalSignal);
      }
    },
  };
}

async function tryParseJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function tryParseText(response: Response): Promise<string | null> {
  try {
    return await response.text();
  } catch {
    return null;
  }
}

function createApiError(
  message: string,
  statusCode?: number,
  errorCode?: string,
  details?: ApiError["details"]
): ApiError {
  return {
    success: false,
    message,
    statusCode,
    errorCode,
    details,
  };
}

async function normalizeErrorResponse(response: Response): Promise<ApiError> {
  const json = await tryParseJson(response);

  if (isApiErrorLike(json)) {
    return {
      ...json,
      statusCode: json.statusCode ?? response.status,
    };
  }

  const text = json ? null : await tryParseText(response);

  return createApiError(
    text?.trim() || response.statusText || "Request failed",
    response.status
  );
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.toLowerCase().includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

export class ApiClient {
  private baseUrl: string;
  private getAccessToken?: () => string | null;
  private getWorkspaceId?: () => string | null;
  private defaultHeaders: Record<string, string>;
  private timeoutMs: number;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = normalizeBaseUrl(config.baseUrl);
    this.getAccessToken = config.getAccessToken;
    this.getWorkspaceId = config.getWorkspaceId;
    this.defaultHeaders = config.defaultHeaders ?? {};
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = normalizeBaseUrl(baseUrl);
  }

  setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeDefaultHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  private buildHeaders(
    options: Pick<RequestOptions, "headers" | "skipAuth" | "skipWorkspace">,
    body?: unknown
  ): Record<string, string> {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    if (!options.skipAuth) {
      const token = this.getAccessToken?.();

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    if (!options.skipWorkspace) {
      const workspaceId = this.getWorkspaceId?.();

      if (workspaceId) {
        headers["x-workspace-id"] = workspaceId;
      }
    }

    if (!isFormData(body) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  }

  private async request<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const method = options.method ?? "GET";
    const url = `${joinUrl(this.baseUrl, path)}${buildQueryString(options.query)}`;
    const timeoutMs = options.timeoutMs ?? this.timeoutMs;

    const { signal, cleanup } = createTimeoutSignal(timeoutMs, options.signal);

    try {
      const headers = this.buildHeaders(options, options.body);

      const response = await fetch(url, {
        method,
        headers,
        body:
          options.body === undefined
            ? undefined
            : isFormData(options.body)
            ? options.body
            : JSON.stringify(options.body),
        signal,
      });

      if (!response.ok) {
        throw await normalizeErrorResponse(response);
      }

      return await parseResponse<T>(response);
    } catch (error) {
      if (isApiErrorLike(error)) {
        throw error;
      }

      if (error instanceof DOMException) {
        if (error.name === "AbortError") {
          throw createApiError("Request was aborted");
        }

        if (error.name === "TimeoutError") {
          throw createApiError("Request timed out");
        }
      }

      if (error instanceof Error) {
        throw createApiError(error.message || "Unexpected request error");
      }

      throw createApiError("Unexpected request error");
    } finally {
      cleanup();
    }
  }

  get<T>(path: string, options: Omit<RequestOptions, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "GET",
    });
  }

  post<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options: Omit<RequestOptions, "method" | "body"> = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(path, {
      ...options,
      method: "POST",
      body,
    });
  }

  put<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options: Omit<RequestOptions, "method" | "body"> = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(path, {
      ...options,
      method: "PUT",
      body,
    });
  }

  patch<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options: Omit<RequestOptions, "method" | "body"> = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(path, {
      ...options,
      method: "PATCH",
      body,
    });
  }

  delete<T>(path: string, options: Omit<RequestOptions, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "DELETE",
    });
  }

  async uploadFile<TResponse>(
    path: string,
    file: File | Blob,
    options: UploadFileOptions = {}
  ): Promise<TResponse> {
    const formData = new FormData();
    const fieldName = options.fieldName ?? "file";

    if (file instanceof File) {
      formData.append(fieldName, file);
    } else if (isBlob(file)) {
      formData.append(fieldName, file, options.fileName ?? "upload.bin");
    }

    Object.entries(options.extraFields ?? {}).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return this.request<TResponse>(path, {
      method: "POST",
      body: formData,
      headers: options.headers,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
      skipAuth: options.skipAuth,
      skipWorkspace: options.skipWorkspace,
    });
  }
}

function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    window.localStorage.getItem("mei_access_token") ||
    window.localStorage.getItem("accessToken") ||
    null
  );
}

function getStoredWorkspaceId(): string | null {
  if (typeof window === "undefined") return null;

  return (
    window.localStorage.getItem("mei_workspace_id") ||
    window.localStorage.getItem("workspaceId") ||
    null
  );
}

export const apiClient = new ApiClient({
  baseUrl: getEnvBaseUrl(),
  getAccessToken: getStoredAccessToken,
  getWorkspaceId: getStoredWorkspaceId,
  defaultHeaders: {
    Accept: "application/json",
  },
  timeoutMs: DEFAULT_TIMEOUT_MS,
});

export async function apiGet<T>(
  path: string,
  query?: QueryParams,
  options?: Omit<RequestOptions, "method" | "body" | "query">
): Promise<T> {
  return apiClient.get<T>(path, {
    ...options,
    query,
  });
}

export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<TResponse> {
  return apiClient.post<TResponse, TBody>(path, body, options);
}

export async function apiPut<TResponse, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<TResponse> {
  return apiClient.put<TResponse, TBody>(path, body, options);
}

export async function apiPatch<TResponse, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<TResponse> {
  return apiClient.patch<TResponse, TBody>(path, body, options);
}

export async function apiDelete<T>(
  path: string,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  return apiClient.delete<T>(path, options);
}

export async function apiUploadFile<TResponse>(
  path: string,
  file: File | Blob,
  options?: UploadFileOptions
): Promise<TResponse> {
  return apiClient.uploadFile<TResponse>(path, file, options);
}

export async function safeApiCall<T>(
  request: () => Promise<ApiResult<T>>
): Promise<ApiResult<T>> {
  try {
    return await request();
  } catch (error) {
    if (isApiErrorLike(error)) {
      return error;
    }

    if (error instanceof Error) {
      return createApiError(error.message || "Unexpected API error");
    }

    return createApiError("Unexpected API error");
  }
}