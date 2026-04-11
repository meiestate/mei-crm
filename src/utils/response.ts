// src/utils/auth/response.ts

export type ApiSuccessResponse<T = unknown> = {
  success: true;
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  error?: string;
  code?: string | number;
  status?: number;
  details?: unknown;
  validationErrors?: Record<string, string | string[]>;
};

export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

export type PaginatedMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedResponse<T = unknown> = ApiSuccessResponse<T[]> & {
  meta: PaginatedMeta & Record<string, unknown>;
};

export type NormalizedApiError = {
  message: string;
  code?: string | number;
  status?: number;
  details?: unknown;
  validationErrors?: Record<string, string | string[]>;
};

export function isSuccessResponse<T = unknown>(
  response: ApiResponse<T> | null | undefined
): response is ApiSuccessResponse<T> {
  return Boolean(response && response.success === true);
}

export function isErrorResponse<T = unknown>(
  response: ApiResponse<T> | null | undefined
): response is ApiErrorResponse {
  return Boolean(response && response.success === false);
}

export function createSuccessResponse<T>(
  data: T,
  message = "Success",
  meta?: Record<string, unknown>
): ApiSuccessResponse<T> {
  return {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
}

export function createErrorResponse(
  message = "Something went wrong",
  options: Omit<ApiErrorResponse, "success" | "message"> = {}
): ApiErrorResponse {
  return {
    success: false,
    message,
    ...options,
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
  },
  message = "Success"
): PaginatedResponse<T> {
  const totalPages = Math.max(1, Math.ceil(meta.totalItems / meta.pageSize));

  return {
    success: true,
    message,
    data,
    meta: {
      page: meta.page,
      pageSize: meta.pageSize,
      totalItems: meta.totalItems,
      totalPages,
      hasNextPage: meta.page < totalPages,
      hasPreviousPage: meta.page > 1,
    },
  };
}

export function getResponseMessage<T = unknown>(
  response: ApiResponse<T> | null | undefined,
  fallback = "No message available"
): string {
  return response?.message?.trim() || fallback;
}

export function getResponseData<T = unknown>(
  response: ApiResponse<T> | null | undefined,
  fallback: T
): T {
  if (isSuccessResponse(response)) {
    return response.data;
  }

  return fallback;
}

export function getOptionalResponseData<T = unknown>(
  response: ApiResponse<T> | null | undefined
): T | null {
  if (isSuccessResponse(response)) {
    return response.data;
  }

  return null;
}

export function getValidationErrors<T = unknown>(
  response: ApiResponse<T> | null | undefined
): Record<string, string | string[]> {
  if (isErrorResponse(response) && response.validationErrors) {
    return response.validationErrors;
  }

  return {};
}

export function getFieldError(
  validationErrors: Record<string, string | string[]>,
  fieldName: string
): string {
  const value = validationErrors[fieldName];

  if (!value) return "";
  if (Array.isArray(value)) return value[0] ?? "";
  return value;
}

export function hasValidationError(
  validationErrors: Record<string, string | string[]>,
  fieldName: string
): boolean {
  return Boolean(validationErrors[fieldName]);
}

export function flattenValidationErrors(
  validationErrors: Record<string, string | string[]>
): string[] {
  return Object.values(validationErrors).flatMap((value) =>
    Array.isArray(value) ? value : [value]
  );
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (typeof error === "string") {
    return { message: error };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  if (typeof error === "object" && error !== null) {
    const candidate = error as Partial<ApiErrorResponse> & {
      response?: {
        data?: Partial<ApiErrorResponse>;
        status?: number;
      };
      message?: string;
      status?: number;
    };

    if (candidate.response?.data) {
      return {
        message:
          candidate.response.data.message ||
          candidate.message ||
          "Something went wrong",
        code: candidate.response.data.code,
        status: candidate.response.data.status ?? candidate.response.status,
        details: candidate.response.data.details,
        validationErrors: candidate.response.data.validationErrors,
      };
    }

    return {
      message: candidate.message || "Something went wrong",
      code: candidate.code,
      status: candidate.status,
      details: candidate.details,
      validationErrors: candidate.validationErrors,
    };
  }

  return {
    message: "Unknown error occurred",
  };
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong"
): string {
  return normalizeApiError(error).message || fallback;
}

export function isPaginatedResponse<T = unknown>(
  response: ApiResponse<T[]> | null | undefined
): response is PaginatedResponse<T> {
  if (!isSuccessResponse(response)) return false;
  if (!Array.isArray(response.data)) return false;

  const meta = response.meta as Partial<PaginatedMeta> | undefined;

  return Boolean(
    meta &&
      typeof meta.page === "number" &&
      typeof meta.pageSize === "number" &&
      typeof meta.totalItems === "number" &&
      typeof meta.totalPages === "number"
  );
}

export function getPaginationMeta<T = unknown>(
  response: ApiResponse<T[]> | null | undefined
): PaginatedMeta | null {
  if (!isPaginatedResponse(response)) return null;
  return response.meta;
}

export function isHttpSuccessStatus(status?: number): boolean {
  return typeof status === "number" && status >= 200 && status < 300;
}

export function isHttpClientErrorStatus(status?: number): boolean {
  return typeof status === "number" && status >= 400 && status < 500;
}

export function isHttpServerErrorStatus(status?: number): boolean {
  return typeof status === "number" && status >= 500 && status < 600;
}

export function shouldRetryRequest(status?: number): boolean {
  return Boolean(
    status === 408 ||
      status === 425 ||
      status === 429 ||
      status === 500 ||
      status === 502 ||
      status === 503 ||
      status === 504
  );
}

export function unwrapResponse<T>(
  response: ApiResponse<T> | null | undefined
): T {
  if (isSuccessResponse(response)) {
    return response.data;
  }

  throw new Error(getResponseMessage(response, "Failed to unwrap response"));
}

export function safeUnwrapResponse<T>(
  response: ApiResponse<T> | null | undefined,
  fallback: T
): T {
  if (isSuccessResponse(response)) {
    return response.data;
  }

  return fallback;
}

export function mapResponseData<T, R>(
  response: ApiResponse<T>,
  mapper: (data: T) => R
): ApiResponse<R> {
  if (isSuccessResponse(response)) {
    return {
      ...response,
      data: mapper(response.data),
    };
  }

  return response;
}

export function ensureArrayResponse<T>(
  response: ApiResponse<T[] | null | undefined>
): ApiResponse<T[]> {
  if (isSuccessResponse(response)) {
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data : [],
    };
  }

  return response;
}

export function appendMeta<T>(
  response: ApiSuccessResponse<T>,
  meta: Record<string, unknown>
): ApiSuccessResponse<T> {
  return {
    ...response,
    meta: {
      ...(response.meta ?? {}),
      ...meta,
    },
  };
}