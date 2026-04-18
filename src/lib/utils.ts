// src/lib/utils.ts

export type Nullable<T> = T | null | undefined;

export interface Option<T = string> {
  label: string;
  value: T;
}

export const noop = (): void => {
  // intentionally empty
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const randomInt = (min: number, max: number): number => {
  const safeMin = Math.ceil(min);
  const safeMax = Math.floor(max);

  return Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin;
};

export const unique = <T>(items: T[]): T[] => {
  return Array.from(new Set(items));
};

export const uniqueBy = <T, K>(items: T[], getKey: (item: T) => K): T[] => {
  const seen = new Set<K>();

  return items.filter((item) => {
    const key = getKey(item);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export const groupBy = <T, K extends string | number>(
  items: T[],
  getKey: (item: T) => K,
): Record<K, T[]> => {
  return items.reduce((acc, item) => {
    const key = getKey(item);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
};

export const chunk = <T>(items: T[], size: number): T[][] => {
  if (size <= 0) {
    return [items];
  }

  const result: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }

  return result;
};

export const range = (start: number, end: number, step = 1): number[] => {
  if (step === 0) {
    return [];
  }

  const result: number[] = [];
  const safeStep = Math.abs(step);

  if (start <= end) {
    for (let value = start; value <= end; value += safeStep) {
      result.push(value);
    }
  } else {
    for (let value = start; value >= end; value -= safeStep) {
      result.push(value);
    }
  }

  return result;
};

export const sum = (values: Array<number | null | undefined>): number => {
  return values.reduce<number>((total, value) => {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return total;
    }

    return total + value;
  }, 0);
};

export const average = (values: Array<number | null | undefined>): number => {
  const validValues: number[] = values.filter(
    (value): value is number => typeof value === "number" && Number.isFinite(value),
  );

  if (validValues.length === 0) {
    return 0;
  }

  const total = validValues.reduce<number>((acc, value) => acc + value, 0);
  return total / validValues.length;
};

export const sortBy = <T>(
  items: T[],
  getValue: (item: T) => string | number,
  direction: "asc" | "desc" = "asc",
): T[] => {
  return [...items].sort((a, b) => {
    const first = getValue(a);
    const second = getValue(b);

    if (first < second) {
      return direction === "asc" ? -1 : 1;
    }

    if (first > second) {
      return direction === "asc" ? 1 : -1;
    }

    return 0;
  });
};

export const hasValue = <T>(value: Nullable<T>): value is T => {
  return value !== null && value !== undefined;
};

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

export const isNonEmptyArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value) && value.length > 0;
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  const result = {} as Pick<T, K>;

  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });

  return result;
};

export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const result = { ...obj };

  keys.forEach((key) => {
    delete result[key];
  });

  return result;
};

export const deepClone = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T;
};

export const mergeClassNames = (
  ...classes: Array<string | false | null | undefined>
): string => {
  return classes.filter(Boolean).join(" ");
};

export const capitalize = (value: string): string => {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const titleCase = (value: string): string => {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .split(/\s+/)
    .map((word) => capitalize(word))
    .join(" ");
};

export const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const truncate = (
  value: string,
  maxLength = 50,
  suffix = "…",
): string => {
  if (!value || value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}${suffix}`;
};

export const initials = (value: string, limit = 2): string => {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .split(/\s+/)
    .slice(0, limit)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const safeJsonParse = <T>(
  value: string,
  fallback: T,
): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const safeJsonStringify = (
  value: unknown,
  fallback = "",
): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (
    isObject(error) &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
};

export const createOptions = <T extends string | number>(
  values: T[],
): Option<T>[] => {
  return values.map((value) => ({
    label:
      typeof value === "string"
        ? titleCase(value.replace(/[_-]/g, " "))
        : String(value),
    value,
  }));
};

export const toQueryString = (
  params: Record<string, string | number | boolean | null | undefined>,
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const fromQueryString = (
  search: string,
): Record<string, string> => {
  const query = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(query);

  return Array.from(params.entries()).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {},
  );
};

export const copyToClipboard = async (value: string): Promise<boolean> => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }

    const textArea = document.createElement("textarea");
    textArea.value = value;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    textArea.style.pointerEvents = "none";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textArea);

    return success;
  } catch {
    return false;
  }
};

export const downloadTextFile = (
  filename: string,
  content: string,
  contentType = "text/plain;charset=utf-8",
): void => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
};

export const waitFor = async <T>(
  factory: () => Promise<T>,
  delayMs = 300,
): Promise<T> => {
  await sleep(delayMs);
  return factory();
};

const utils = {
  noop,
  sleep,
  clamp,
  randomInt,
  unique,
  uniqueBy,
  groupBy,
  chunk,
  range,
  sum,
  average,
  sortBy,
  hasValue,
  isNonEmptyString,
  isNonEmptyArray,
  isObject,
  pick,
  omit,
  deepClone,
  mergeClassNames,
  capitalize,
  titleCase,
  slugify,
  truncate,
  initials,
  safeJsonParse,
  safeJsonStringify,
  getErrorMessage,
  createOptions,
  toQueryString,
  fromQueryString,
  copyToClipboard,
  downloadTextFile,
  waitFor,
};

export default utils;