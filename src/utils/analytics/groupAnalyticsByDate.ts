// src/utils/groupAnalyticsByDate.ts

export type AnalyticsGroupingGranularity = "day" | "week" | "month" | "year";

export interface GroupAnalyticsByDateOptions<T> {
  dateKey?: keyof T;
  valueKey?: keyof T;
  granularity?: AnalyticsGroupingGranularity;
  locale?: string;
  weekStartsOn?: 0 | 1;
  sortDirection?: "asc" | "desc";
  includeEmptyLabel?: boolean;
  emptyLabel?: string;
  formatLabel?: (date: Date, bucketKey: string) => string;
}

export interface AnalyticsDateGroup<T> {
  key: string;
  label: string;
  date: Date;
  items: T[];
  count: number;
  total: number;
  average: number;
  min: number | null;
  max: number | null;
}

const DEFAULT_EMPTY_LABEL = "Unknown";

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return isValidDate(value) ? value : null;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return isValidDate(parsed) ? parsed : null;
  }

  return null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

function startOfWeek(date: Date, weekStartsOn: 0 | 1 = 1): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = weekStartsOn === 1 ? (day === 0 ? -6 : 1 - day) : -day;

  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() + diff);

  return result;
}

function getBucketStartDate(
  date: Date,
  granularity: AnalyticsGroupingGranularity,
  weekStartsOn: 0 | 1,
): Date {
  switch (granularity) {
    case "week":
      return startOfWeek(date, weekStartsOn);
    case "month":
      return startOfMonth(date);
    case "year":
      return startOfYear(date);
    case "day":
    default:
      return startOfDay(date);
  }
}

function getBucketKey(
  date: Date,
  granularity: AnalyticsGroupingGranularity,
  weekStartsOn: 0 | 1,
): string {
  const bucketDate = getBucketStartDate(date, granularity, weekStartsOn);
  const year = bucketDate.getFullYear();
  const month = String(bucketDate.getMonth() + 1).padStart(2, "0");
  const day = String(bucketDate.getDate()).padStart(2, "0");

  switch (granularity) {
    case "year":
      return `${year}`;
    case "month":
      return `${year}-${month}`;
    case "week":
    case "day":
    default:
      return `${year}-${month}-${day}`;
  }
}

function defaultFormatLabel(
  date: Date,
  granularity: AnalyticsGroupingGranularity,
  locale: string,
): string {
  switch (granularity) {
    case "year":
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
      }).format(date);

    case "month":
      return new Intl.DateTimeFormat(locale, {
        month: "short",
        year: "numeric",
      }).format(date);

    case "week": {
      const end = new Date(date);
      end.setDate(end.getDate() + 6);

      const startText = new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
      }).format(date);

      const endText = new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
      }).format(end);

      return `${startText} - ${endText}`;
    }

    case "day":
    default:
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
  }
}

export function groupAnalyticsByDate<T extends Record<string, unknown>>(
  data: T[],
  options: GroupAnalyticsByDateOptions<T> = {},
): AnalyticsDateGroup<T>[] {
  const {
    dateKey = "date" as keyof T,
    valueKey = "value" as keyof T,
    granularity = "day",
    locale = "en-IN",
    weekStartsOn = 1,
    sortDirection = "asc",
    includeEmptyLabel = false,
    emptyLabel = DEFAULT_EMPTY_LABEL,
    formatLabel,
  } = options;

  const groups = new Map<
    string,
    {
      key: string;
      label: string;
      date: Date;
      items: T[];
      values: number[];
    }
  >();

  for (const item of data) {
    const rawDate = item[dateKey];
    const parsedDate = toDate(rawDate);

    if (!parsedDate) {
      if (!includeEmptyLabel) {
        continue;
      }

      const unknownKey = "__unknown__";
      const existingUnknown = groups.get(unknownKey);

      if (existingUnknown) {
        existingUnknown.items.push(item);
      } else {
        groups.set(unknownKey, {
          key: unknownKey,
          label: emptyLabel,
          date: new Date(0),
          items: [item],
          values: [],
        });
      }

      continue;
    }

    const bucketDate = getBucketStartDate(parsedDate, granularity, weekStartsOn);
    const bucketKey = getBucketKey(parsedDate, granularity, weekStartsOn);
    const label = formatLabel
      ? formatLabel(bucketDate, bucketKey)
      : defaultFormatLabel(bucketDate, granularity, locale);

    const numericValue = toNumber(item[valueKey]);

    const existing = groups.get(bucketKey);

    if (existing) {
      existing.items.push(item);
      if (numericValue !== null) {
        existing.values.push(numericValue);
      }
    } else {
      groups.set(bucketKey, {
        key: bucketKey,
        label,
        date: bucketDate,
        items: [item],
        values: numericValue !== null ? [numericValue] : [],
      });
    }
  }

  const result: AnalyticsDateGroup<T>[] = Array.from(groups.values()).map((group) => {
    const { values } = group;
    const total = values.reduce((sum, value) => sum + value, 0);
    const count = group.items.length;
    const average = values.length > 0 ? total / values.length : 0;
    const min = values.length > 0 ? Math.min(...values) : null;
    const max = values.length > 0 ? Math.max(...values) : null;

    return {
      key: group.key,
      label: group.label,
      date: group.date,
      items: group.items,
      count,
      total,
      average,
      min,
      max,
    };
  });

  result.sort((a, b) => {
    const diff = a.date.getTime() - b.date.getTime();
    return sortDirection === "asc" ? diff : -diff;
  });

  return result;
}

export default groupAnalyticsByDate;