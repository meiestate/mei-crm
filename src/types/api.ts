// src/types/api.ts

import type {
  ApiMeta,
  DateRange,
  ID,
  ISODateString,
  Nullable,
  PaginatedResult,
  SortDirection,
} from "./common";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

export type ApiErrorDetail = {
  field?: string;
  message: string;
  code?: string;
};

export type ApiError = {
  success: false;
  message: string;
  errorCode?: string;
  statusCode?: number;
  details?: ApiErrorDetail[];
  meta?: ApiMeta;
};

export type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
  meta?: ApiMeta;
};

export type ApiResult<T> = ApiSuccess<T> | ApiError;

export type ApiListSuccess<T> = {
  success: true;
  message?: string;
  data: PaginatedResult<T>;
  meta?: ApiMeta;
};

export type ApiListResult<T> = ApiListSuccess<T> | ApiError;

export type ApiMutationSuccess<T = null> = {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type ApiMutationResult<T = null> =
  | ApiMutationSuccess<T>
  | ApiError;

export type ApiDeleteSuccess = {
  success: true;
  message: string;
  deletedId: ID;
  meta?: ApiMeta;
};

export type ApiDeleteResult = ApiDeleteSuccess | ApiError;

export type RequestStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

export type ApiRequestState<T> = {
  status: RequestStatus;
  data: T | null;
  error: ApiError | null;
};

export type PaginationQuery = {
  page?: number;
  pageSize?: number;
};

export type SortQuery<TField extends string = string> = {
  sortBy?: TField;
  sortDirection?: SortDirection;
};

export type SearchQuery = {
  search?: string;
};

export type StatusFilter<TStatus extends string = string> = {
  statuses?: TStatus[];
};

export type IdFilter = {
  ids?: ID[];
};

export type WorkspaceFilter = {
  workspaceId?: string;
};

export type DateRangeFilter = {
  dateRange?: DateRange;
};

export type BaseListQuery<TSortField extends string = string> =
  PaginationQuery &
    SortQuery<TSortField> &
    SearchQuery &
    WorkspaceFilter;

export type TimestampRangeQuery = {
  createdFrom?: ISODateString;
  createdTo?: ISODateString;
  updatedFrom?: ISODateString;
  updatedTo?: ISODateString;
};

export type ApiListQuery<TSortField extends string = string> =
  BaseListQuery<TSortField> &
    TimestampRangeQuery;

export type BulkActionPayload<TValue = ID> = {
  ids: TValue[];
};

export type BulkDeletePayload = BulkActionPayload<ID>;

export type BulkUpdatePayload<TFields extends object> = {
  ids: ID[];
  updates: Partial<TFields>;
};

export type BulkActionResponse = {
  success: true;
  message: string;
  affectedCount: number;
  affectedIds: ID[];
  meta?: ApiMeta;
};

export type BulkActionResult = BulkActionResponse | ApiError;

export type ApiCursorPagination = {
  nextCursor?: string | null;
  previousCursor?: string | null;
  limit: number;
};

export type CursorPaginatedResult<T> = {
  items: T[];
  pagination: ApiCursorPagination;
  total?: number;
};

export type CursorApiSuccess<T> = {
  success: true;
  message?: string;
  data: CursorPaginatedResult<T>;
  meta?: ApiMeta;
};

export type CursorApiResult<T> = CursorApiSuccess<T> | ApiError;

export type FileUploadMeta = {
  fileName: string;
  fileSize: number;
  fileType: string;
  url?: string;
};

export type FileUploadSuccess = {
  success: true;
  message: string;
  data: FileUploadMeta;
  meta?: ApiMeta;
};

export type FileUploadResult = FileUploadSuccess | ApiError;

export type AuthTokenPair = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: ISODateString;
};

export type SessionUser = {
  id: ID;
  email: string;
  fullName?: string;
  role?: string;
  workspaceId?: string;
};

export type AuthSession = {
  user: SessionUser;
  tokens: AuthTokenPair;
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type OtpLoginPayload = {
  phone: string;
  otp: string;
};

export type EmailOtpPayload = {
  email: string;
  otp: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
  confirmPassword?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
};

export type AuthSuccess = {
  success: true;
  message: string;
  data: AuthSession;
  meta?: ApiMeta;
};

export type AuthResult = AuthSuccess | ApiError;

export type LogoutSuccess = {
  success: true;
  message: string;
  meta?: ApiMeta;
};

export type LogoutResult = LogoutSuccess | ApiError;

export type HealthCheckResponse = {
  success: true;
  message: string;
  data: {
    service: string;
    version?: string;
    uptime?: number;
    timestamp: ISODateString;
    environment?: string;
  };
};

export type HealthCheckResult = HealthCheckResponse | ApiError;

export type EndpointDefinition<
  TRequest = unknown,
  TResponse = unknown
> = {
  path: string;
  method: HttpMethod;
  requiresAuth?: boolean;
  request?: TRequest;
  response?: TResponse;
};

export type QueryParamPrimitive =
  | string
  | number
  | boolean
  | null
  | undefined;

export type QueryParamValue =
  | QueryParamPrimitive
  | QueryParamPrimitive[];

export type QueryParams = Record<string, QueryParamValue>;

export function createApiMeta(
  overrides: Partial<ApiMeta> = {}
): ApiMeta {
  return {
    requestId: overrides.requestId,
    timestamp: overrides.timestamp ?? new Date().toISOString(),
    version: overrides.version,
  };
}

export function createApiSuccess<T>(
  data: T,
  message?: string,
  meta?: ApiMeta
): ApiSuccess<T> {
  return {
    success: true,
    data,
    message,
    meta,
  };
}

export function createApiListSuccess<T>(
  data: PaginatedResult<T>,
  message?: string,
  meta?: ApiMeta
): ApiListSuccess<T> {
  return {
    success: true,
    data,
    message,
    meta,
  };
}

export function createApiMutationSuccess<T = null>(
  message: string,
  data: T,
  meta?: ApiMeta
): ApiMutationSuccess<T> {
  return {
    success: true,
    message,
    data,
    meta,
  };
}

export function createApiDeleteSuccess(
  deletedId: ID,
  message = "Deleted successfully.",
  meta?: ApiMeta
): ApiDeleteSuccess {
  return {
    success: true,
    message,
    deletedId,
    meta,
  };
}

export function createApiError(
  message: string,
  options: {
    errorCode?: string;
    statusCode?: number;
    details?: ApiErrorDetail[];
    meta?: ApiMeta;
  } = {}
): ApiError {
  return {
    success: false,
    message,
    errorCode: options.errorCode,
    statusCode: options.statusCode,
    details: options.details,
    meta: options.meta,
  };
}

export function isApiSuccess<T>(
  result: ApiResult<T>
): result is ApiSuccess<T> {
  return result.success === true;
}

export function isApiError<T>(
  result: ApiResult<T> | ApiListResult<T> | ApiMutationResult<T>
): result is ApiError {
  return result.success === false;
}

export function createInitialApiRequestState<T>(): ApiRequestState<T> {
  return {
    status: "idle",
    data: null,
    error: null,
  };
}

export function createLoadingApiRequestState<T>(
  previousData: Nullable<T> = null
): ApiRequestState<T> {
  return {
    status: "loading",
    data: previousData,
    error: null,
  };
}

export function createSuccessApiRequestState<T>(
  data: T
): ApiRequestState<T> {
  return {
    status: "success",
    data,
    error: null,
  };
}

export function createErrorApiRequestState<T>(
  error: ApiError,
  previousData: Nullable<T> = null
): ApiRequestState<T> {
  return {
    status: "error",
    data: previousData,
    error,
  };
}

export function isRequestIdle<T>(state: ApiRequestState<T>): boolean {
  return state.status === "idle";
}

export function isRequestLoading<T>(state: ApiRequestState<T>): boolean {
  return state.status === "loading";
}

export function isRequestSuccess<T>(state: ApiRequestState<T>): boolean {
  return state.status === "success";
}

export function isRequestError<T>(state: ApiRequestState<T>): boolean {
  return state.status === "error";
}

export function normalizePaginationQuery(
  query?: PaginationQuery
): Required<PaginationQuery> {
  const page =
    typeof query?.page === "number" && query.page > 0
      ? Math.floor(query.page)
      : 1;

  const pageSize =
    typeof query?.pageSize === "number" && query.pageSize > 0
      ? Math.floor(query.pageSize)
      : 10;

  return {
    page,
    pageSize,
  };
}

export function normalizeSortDirection(
  value?: string | null
): SortDirection {
  return value === "desc" ? "desc" : "asc";
}

export function normalizeSearchQuery(
  value?: string | null
): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeIds(
  ids?: Array<string | null | undefined>
): ID[] {
  if (!Array.isArray(ids)) {
    return [];
  }

  return Array.from(
    new Set(
      ids
        .filter((id): id is string => typeof id === "string")
        .map((id) => id.trim())
        .filter(Boolean)
    )
  );
}

export function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
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

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function withQueryParams(
  path: string,
  params?: QueryParams
): string {
  if (!params) {
    return path;
  }

  return `${path}${buildQueryString(params)}`;
}

export function createBulkActionResponse(
  affectedIds: ID[],
  message = "Bulk action completed successfully.",
  meta?: ApiMeta
): BulkActionResponse {
  return {
    success: true,
    message,
    affectedCount: affectedIds.length,
    affectedIds,
    meta,
  };
}

export function createCursorPagination(
  limit: number,
  nextCursor?: string | null,
  previousCursor?: string | null
): ApiCursorPagination {
  return {
    limit,
    nextCursor: nextCursor ?? null,
    previousCursor: previousCursor ?? null,
  };
}

export function createCursorApiSuccess<T>(
  items: T[],
  pagination: ApiCursorPagination,
  message?: string,
  total?: number,
  meta?: ApiMeta
): CursorApiSuccess<T> {
  return {
    success: true,
    message,
    data: {
      items,
      pagination,
      total,
    },
    meta,
  };
}

export function createHealthCheckResponse(
  service: string,
  options: {
    version?: string;
    uptime?: number;
    environment?: string;
    timestamp?: ISODateString;
  } = {}
): HealthCheckResponse {
  return {
    success: true,
    message: "Service is healthy.",
    data: {
      service,
      version: options.version,
      uptime: options.uptime,
      environment: options.environment,
      timestamp: options.timestamp ?? new Date().toISOString(),
    },
  };
}