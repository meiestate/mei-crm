// src/utils/analytics/normalizeAnalyticsFilters.ts

export type AnalyticsDatePreset =
  | "today"
  | "yesterday"
  | "last7Days"
  | "last30Days"
  | "last90Days"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "thisYear"
  | "custom";

export type AnalyticsSortOrder = "asc" | "desc";

export interface AnalyticsFilters {
  search?: string;
  datePreset?: AnalyticsDatePreset;
  startDate?: string | null;
  endDate?: string | null;
  sources?: string[];
  channels?: string[];
  statuses?: string[];
  owners?: string[];
  teams?: string[];
  projects?: string[];
  regions?: string[];
  priorities?: string[];
  tags?: string[];
  campaignIds?: string[];
  leadTypes?: string[];
  propertyTypes?: string[];
  segments?: string[];
  includeArchived?: boolean;
  includeDeleted?: boolean;
  groupBy?: string;
  sortBy?: string;
  sortOrder?: AnalyticsSortOrder;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface NormalizeAnalyticsFiltersOptions {
  defaults?: Partial<AnalyticsFilters>;
  trimSearch?: boolean;
  dedupeArrays?: boolean;
  removeEmptyArrays?: boolean;
  removeEmptyStrings?: boolean;
  clampPagination?: boolean;
  minPage?: number;
  minLimit?: number;
  maxLimit?: number;
  today?: Date;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 25;
const DEFAULT_MIN_PAGE = 1;
const DEFAULT_MIN_LIMIT = 1;
const DEFAULT_MAX_LIMIT = 500;

function sanitizeString(value: unknown, trim = true): string | undefined {
  if (typeof value !== "string") return undefined;

  const result = trim ? value.trim() : value;
  return result.length > 0 ? result : undefined;
}

function sanitizeBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return undefined;
}

function sanitizeNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function sanitizeStringArray(
  value: unknown,
  options: {
    dedupe?: boolean;
    removeEmpty?: boolean;
  } = {},
): string[] | undefined {
  const { dedupe = true, removeEmpty = true } = options;

  let rawItems: unknown[] = [];

  if (Array.isArray(value)) {
    rawItems = value;
  } else if (typeof value === "string") {
    rawItems = value.split(",");
  } else {
    return undefined;
  }

  const normalized = rawItems
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item === null || item === undefined) {
        return "";
      }

      return String(item).trim();
    })
    .filter((item) => (removeEmpty ? item.length > 0 : true));

  if (normalized.length === 0) {
    return undefined;
  }

  return dedupe ? Array.from(new Set(normalized)) : normalized;
}

function isValidDateInput(value: unknown): boolean {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

function endOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
}

function startOfQuarter(date: Date): Date {
  const quarterStartMonth = Math.floor(date.getMonth() / 3) * 3;
  return new Date(date.getFullYear(), quarterStartMonth, 1);
}

function endOfQuarter(date: Date): Date {
  const quarterStartMonth = Math.floor(date.getMonth() / 3) * 3;
  return new Date(date.getFullYear(), quarterStartMonth + 3, 0, 23, 59, 59, 999);
}

function resolveDatePreset(
  preset: AnalyticsDatePreset,
  today: Date,
): { startDate?: string; endDate?: string } {
  const now = new Date(today);

  switch (preset) {
    case "today":
      return {
        startDate: formatDate(startOfDay(now)),
        endDate: formatDate(endOfDay(now)),
      };

    case "yesterday": {
      const yesterday = addDays(now, -1);
      return {
        startDate: formatDate(startOfDay(yesterday)),
        endDate: formatDate(endOfDay(yesterday)),
      };
    }

    case "last7Days":
      return {
        startDate: formatDate(startOfDay(addDays(now, -6))),
        endDate: formatDate(endOfDay(now)),
      };

    case "last30Days":
      return {
        startDate: formatDate(startOfDay(addDays(now, -29))),
        endDate: formatDate(endOfDay(now)),
      };

    case "last90Days":
      return {
        startDate: formatDate(startOfDay(addDays(now, -89))),
        endDate: formatDate(endOfDay(now)),
      };

    case "thisMonth":
      return {
        startDate: formatDate(startOfMonth(now)),
        endDate: formatDate(endOfMonth(now)),
      };

    case "lastMonth": {
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return {
        startDate: formatDate(startOfMonth(previousMonth)),
        endDate: formatDate(endOfMonth(previousMonth)),
      };
    }

    case "thisQuarter":
      return {
        startDate: formatDate(startOfQuarter(now)),
        endDate: formatDate(endOfQuarter(now)),
      };

    case "lastQuarter": {
      const previousQuarterDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      return {
        startDate: formatDate(startOfQuarter(previousQuarterDate)),
        endDate: formatDate(endOfQuarter(previousQuarterDate)),
      };
    }

    case "thisYear":
      return {
        startDate: formatDate(startOfYear(now)),
        endDate: formatDate(endOfYear(now)),
      };

    case "custom":
    default:
      return {};
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const ARRAY_FILTER_KEYS: (keyof AnalyticsFilters)[] = [
  "sources",
  "channels",
  "statuses",
  "owners",
  "teams",
  "projects",
  "regions",
  "priorities",
  "tags",
  "campaignIds",
  "leadTypes",
  "propertyTypes",
  "segments",
];

export function normalizeAnalyticsFilters(
  input: Partial<AnalyticsFilters> = {},
  options: NormalizeAnalyticsFiltersOptions = {},
): AnalyticsFilters {
  const {
    defaults = {},
    trimSearch = true,
    dedupeArrays = true,
    removeEmptyArrays = true,
    removeEmptyStrings = true,
    clampPagination = true,
    minPage = DEFAULT_MIN_PAGE,
    minLimit = DEFAULT_MIN_LIMIT,
    maxLimit = DEFAULT_MAX_LIMIT,
    today = new Date(),
  } = options;

  const merged: Partial<AnalyticsFilters> = {
    ...defaults,
    ...input,
  };

  const normalized: AnalyticsFilters = {};

  const search = sanitizeString(merged.search, trimSearch);
  if (search !== undefined) {
    normalized.search = search;
  } else if (!removeEmptyStrings && typeof merged.search === "string") {
    normalized.search = merged.search;
  }

  const datePreset = sanitizeString(merged.datePreset) as AnalyticsDatePreset | undefined;
  if (datePreset) {
    normalized.datePreset = datePreset;
  }

  let startDate = isValidDateInput(merged.startDate)
    ? formatDate(new Date(merged.startDate as string))
    : undefined;

  let endDate = isValidDateInput(merged.endDate)
    ? formatDate(new Date(merged.endDate as string))
    : undefined;

  if (datePreset && datePreset !== "custom") {
    const presetRange = resolveDatePreset(datePreset, today);
    startDate = presetRange.startDate ?? startDate;
    endDate = presetRange.endDate ?? endDate;
  }

  if (startDate && endDate && new Date(startDate).getTime() > new Date(endDate).getTime()) {
    const temp = startDate;
    startDate = endDate;
    endDate = temp;
  }

  if (startDate) {
    normalized.startDate = startDate;
  }

  if (endDate) {
    normalized.endDate = endDate;
  }

  for (const key of ARRAY_FILTER_KEYS) {
    const sanitized = sanitizeStringArray(merged[key], {
      dedupe: dedupeArrays,
      removeEmpty: removeEmptyArrays,
    });

    if (sanitized && sanitized.length > 0) {
      normalized[key] = sanitized;
    }
  }

  const includeArchived = sanitizeBoolean(merged.includeArchived);
  if (includeArchived !== undefined) {
    normalized.includeArchived = includeArchived;
  }

  const includeDeleted = sanitizeBoolean(merged.includeDeleted);
  if (includeDeleted !== undefined) {
    normalized.includeDeleted = includeDeleted;
  }

  const groupBy = sanitizeString(merged.groupBy);
  if (groupBy) {
    normalized.groupBy = groupBy;
  }

  const sortBy = sanitizeString(merged.sortBy);
  if (sortBy) {
    normalized.sortBy = sortBy;
  }

  const sortOrder = sanitizeString(merged.sortOrder);
  if (sortOrder === "asc" || sortOrder === "desc") {
    normalized.sortOrder = sortOrder;
  }

  const pageValue = sanitizeNumber(merged.page) ?? defaults.page ?? DEFAULT_PAGE;
  const limitValue = sanitizeNumber(merged.limit) ?? defaults.limit ?? DEFAULT_LIMIT;

  normalized.page = clampPagination
    ? clamp(Math.floor(pageValue), minPage, Number.MAX_SAFE_INTEGER)
    : Math.max(Math.floor(pageValue), minPage);

  normalized.limit = clampPagination
    ? clamp(Math.floor(limitValue), minLimit, maxLimit)
    : Math.max(Math.floor(limitValue), minLimit);

  for (const [key, value] of Object.entries(merged)) {
    if (key in normalized || value === undefined) {
      continue;
    }

    if (typeof value === "string") {
      const sanitized = sanitizeString(value, true);

      if (sanitized !== undefined) {
        normalized[key] = sanitized;
      } else if (!removeEmptyStrings) {
        normalized[key] = value;
      }

      continue;
    }

    if (Array.isArray(value)) {
      const sanitized = sanitizeStringArray(value, {
        dedupe: dedupeArrays,
        removeEmpty: removeEmptyArrays,
      });

      if (sanitized && sanitized.length > 0) {
        normalized[key] = sanitized;
      }

      continue;
    }

    normalized[key] = value;
  }

  return normalized;
}

export default normalizeAnalyticsFilters;