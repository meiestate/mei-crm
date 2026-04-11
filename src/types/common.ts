// src/types/common.ts

export type ID = string;

export type ISODateString = string;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ValueOf<T> = T[keyof T];

export type MaybeArray<T> = T | T[];

export type KeyLabelPair = {
  key: string;
  label: string;
};

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type StatusOption<T extends string = string> = SelectOption<T>;

export type ApiMeta = {
  requestId?: string;
  timestamp?: ISODateString;
  version?: string;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
  meta?: ApiMeta;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errorCode?: string;
  errors?: Record<string, string[]>;
  meta?: ApiMeta;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type SortDirection = "asc" | "desc";

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type SortParams<TField extends string = string> = {
  sortBy?: TField;
  sortDirection?: SortDirection;
};

export type SearchParams = {
  search?: string;
};

export type DateRange = {
  startDate?: ISODateString;
  endDate?: ISODateString;
};

export type BaseEntity = {
  id: ID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type NamedEntity = BaseEntity & {
  name: string;
};

export type SoftDeleteEntity = {
  deletedAt?: ISODateString | null;
  isDeleted?: boolean;
};

export type AuditFields = {
  createdBy?: string;
  updatedBy?: string;
};

export type EntityWithAudit = BaseEntity & AuditFields;

export type TableColumnAlign = "left" | "center" | "right";

export type TableColumn<T> = {
  key: keyof T | string;
  label: string;
  width?: number | string;
  minWidth?: number | string;
  align?: TableColumnAlign;
  sortable?: boolean;
};

export type BulkAction<TValue extends string = string> = {
  value: TValue;
  label: string;
  danger?: boolean;
};

export type FilterChip = {
  key: string;
  label: string;
  value: string;
};

export type SummaryMetric = {
  key: string;
  label: string;
  value: number | string;
  helperText?: string;
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export function isDefined<T>(
  value: T | null | undefined
): value is T {
  return value !== null && value !== undefined;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function toTrimmedString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

export function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return fallback;
}

export function ensureArray<T>(value: MaybeArray<T> | null | undefined): T[] {
  if (value === null || value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export function uniqueBy<T, TKey>(
  items: T[],
  getKey: (item: T) => TKey
): T[] {
  const seen = new Set<TKey>();

  return items.filter((item) => {
    const key = getKey(item);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export function clampNumber(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(Math.max(value, min), max);
}

export function normalizePage(page?: number): number {
  return clampNumber(toNumber(page, DEFAULT_PAGE), 1, Number.MAX_SAFE_INTEGER);
}

export function normalizePageSize(pageSize?: number): number {
  return clampNumber(
    toNumber(pageSize, DEFAULT_PAGE_SIZE),
    1,
    500
  );
}

export function calculateTotalPages(
  total: number,
  pageSize: number
): number {
  const safePageSize = normalizePageSize(pageSize);
  return Math.max(1, Math.ceil(Math.max(0, total) / safePageSize));
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE
): PaginatedResult<T> {
  const safePage = normalizePage(page);
  const safePageSize = normalizePageSize(pageSize);
  const totalPages = calculateTotalPages(total, safePageSize);

  return {
    items,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
}

export function paginateItems<T>(
  items: T[],
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE
): PaginatedResult<T> {
  const safePage = normalizePage(page);
  const safePageSize = normalizePageSize(pageSize);
  const startIndex = (safePage - 1) * safePageSize;
  const paginatedItems = items.slice(startIndex, startIndex + safePageSize);

  return buildPaginatedResult(
    paginatedItems,
    items.length,
    safePage,
    safePageSize
  );
}

export function sortItems<T>(
  items: T[],
  getValue: (item: T) => string | number,
  direction: SortDirection = "asc"
): T[] {
  const multiplier = direction === "asc" ? 1 : -1;

  return [...items].sort((a, b) => {
    const aValue = getValue(a);
    const bValue = getValue(b);

    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * multiplier;
    }

    return String(aValue).localeCompare(String(bValue)) * multiplier;
  });
}

export function safeJsonParse<T>(
  value: string | null,
  fallback: T
): T {
  try {
    if (!value) {
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  meta?: ApiMeta
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    message,
    meta,
  };
}

export function createErrorResponse(
  message: string,
  errorCode?: string,
  errors?: Record<string, string[]>,
  meta?: ApiMeta
): ApiErrorResponse {
  return {
    success: false,
    message,
    errorCode,
    errors,
    meta,
  };
}

export function isApiSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

export function isApiErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiErrorResponse {
  return response.success === false;
}

export function formatCountLabel(
  count: number,
  singularLabel: string,
  pluralLabel?: string
): string {
  if (count === 1) {
    return `1 ${singularLabel}`;
  }

  return `${count} ${pluralLabel ?? `${singularLabel}s`}`;
}

export function createDateRange(
  startDate?: ISODateString,
  endDate?: ISODateString
): DateRange {
  return {
    startDate,
    endDate,
  };
}

export function hasDateRangeValue(range?: DateRange | null): boolean {
  return Boolean(range?.startDate || range?.endDate);
}

export function nowIso(): ISODateString {
  return new Date().toISOString();
}

export function createBaseEntity(id: ID): BaseEntity {
  const now = nowIso();

  return {
    id,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateEntityTimestamp<T extends { updatedAt: ISODateString }>(
  entity: T
): T {
  return {
    ...entity,
    updatedAt: nowIso(),
  };
}