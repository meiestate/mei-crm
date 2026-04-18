// src/utils/date.ts

export type DateInput = string | number | Date | null | undefined;

export interface FormatDateOptions {
  locale?: string;
  fallback?: string;
}

export interface RelativeTimeOptions {
  locale?: string;
  fallback?: string;
  numeric?: "always" | "auto";
}

export interface DateTimeFormatOptions extends FormatDateOptions {
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
}

const DEFAULT_LOCALE = "en-IN";
const DEFAULT_DATE_FALLBACK = "-";
const DEFAULT_TIME_FALLBACK = "--:--";

export const isValidDate = (value: DateInput): value is string | number | Date => {
  if (value === null || value === undefined || value === "") {
    return false;
  }

  const date = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(date.getTime());
};

export const toDate = (value: DateInput): Date | null => {
  if (!isValidDate(value)) {
    return null;
  }

  return value instanceof Date ? value : new Date(value);
};

export const formatDate = (
  value: DateInput,
  options: FormatDateOptions = {},
): string => {
  const { locale = DEFAULT_LOCALE, fallback = DEFAULT_DATE_FALLBACK } = options;

  const date = toDate(value);
  if (!date) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const formatShortDate = (
  value: DateInput,
  options: FormatDateOptions = {},
): string => {
  const { locale = DEFAULT_LOCALE, fallback = DEFAULT_DATE_FALLBACK } = options;

  const date = toDate(value);
  if (!date) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatLongDate = (
  value: DateInput,
  options: FormatDateOptions = {},
): string => {
  const { locale = DEFAULT_LOCALE, fallback = DEFAULT_DATE_FALLBACK } = options;

  const date = toDate(value);
  if (!date) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(date);
};

export const formatTime = (
  value: DateInput,
  options: FormatDateOptions = {},
): string => {
  const { locale = DEFAULT_LOCALE, fallback = DEFAULT_TIME_FALLBACK } = options;

  const date = toDate(value);
  if (!date) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export const format24HourTime = (
  value: DateInput,
  options: FormatDateOptions = {},
): string => {
  const { locale = DEFAULT_LOCALE, fallback = DEFAULT_TIME_FALLBACK } = options;

  const date = toDate(value);
  if (!date) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export const formatDateTime = (
  value: DateInput,
  options: DateTimeFormatOptions = {},
): string => {
  const {
    locale = DEFAULT_LOCALE,
    fallback = DEFAULT_DATE_FALLBACK,
    dateStyle = "medium",
    timeStyle = "short",
  } = options;

  const date = toDate(value);
  if (!date) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle,
  }).format(date);
};

export const formatIsoDate = (value: DateInput, fallback = ""): string => {
  const date = toDate(value);
  if (!date) {
    return fallback;
  }

  return date.toISOString();
};

export const formatInputDate = (value: DateInput, fallback = ""): string => {
  const date = toDate(value);
  if (!date) {
    return fallback;
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatInputDateTime = (value: DateInput, fallback = ""): string => {
  const date = toDate(value);
  if (!date) {
    return fallback;
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const getRelativeTime = (
  value: DateInput,
  options: RelativeTimeOptions = {},
): string => {
  const {
    locale = DEFAULT_LOCALE,
    fallback = DEFAULT_DATE_FALLBACK,
    numeric = "auto",
  } = options;

  const date = toDate(value);
  if (!date) {
    return fallback;
  }

  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric });

  if (Math.abs(diffInMs) < minute) {
    return rtf.format(Math.round(diffInMs / 1000), "second");
  }

  if (Math.abs(diffInMs) < hour) {
    return rtf.format(Math.round(diffInMs / minute), "minute");
  }

  if (Math.abs(diffInMs) < day) {
    return rtf.format(Math.round(diffInMs / hour), "hour");
  }

  if (Math.abs(diffInMs) < week) {
    return rtf.format(Math.round(diffInMs / day), "day");
  }

  if (Math.abs(diffInMs) < month) {
    return rtf.format(Math.round(diffInMs / week), "week");
  }

  if (Math.abs(diffInMs) < year) {
    return rtf.format(Math.round(diffInMs / month), "month");
  }

  return rtf.format(Math.round(diffInMs / year), "year");
};

export const getDaysDifference = (
  from: DateInput,
  to: DateInput = new Date(),
): number => {
  const fromDate = toDate(from);
  const toDateValue = toDate(to);

  if (!fromDate || !toDateValue) {
    return 0;
  }

  const diff = toDateValue.getTime() - fromDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const getHoursDifference = (
  from: DateInput,
  to: DateInput = new Date(),
): number => {
  const fromDate = toDate(from);
  const toDateValue = toDate(to);

  if (!fromDate || !toDateValue) {
    return 0;
  }

  const diff = toDateValue.getTime() - fromDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60));
};

export const isToday = (value: DateInput): boolean => {
  const date = toDate(value);
  if (!date) {
    return false;
  }

  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isTomorrow = (value: DateInput): boolean => {
  const date = toDate(value);
  if (!date) {
    return false;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

export const isYesterday = (value: DateInput): boolean => {
  const date = toDate(value);
  if (!date) {
    return false;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

export const isPastDate = (value: DateInput): boolean => {
  const date = toDate(value);
  if (!date) {
    return false;
  }

  return date.getTime() < Date.now();
};

export const isFutureDate = (value: DateInput): boolean => {
  const date = toDate(value);
  if (!date) {
    return false;
  }

  return date.getTime() > Date.now();
};

export const isOverdue = (value: DateInput): boolean => {
  const date = toDate(value);
  if (!date) {
    return false;
  }

  return date.getTime() < Date.now() && !isToday(date);
};

export const startOfDay = (value: DateInput = new Date()): Date | null => {
  const date = toDate(value);
  if (!date) {
    return null;
  }

  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

export const endOfDay = (value: DateInput = new Date()): Date | null => {
  const date = toDate(value);
  if (!date) {
    return null;
  }

  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

export const addDays = (value: DateInput, days: number): Date | null => {
  const date = toDate(value);
  if (!date || !Number.isFinite(days)) {
    return null;
  }

  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const addHours = (value: DateInput, hours: number): Date | null => {
  const date = toDate(value);
  if (!date || !Number.isFinite(hours)) {
    return null;
  }

  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next;
};

export const addMinutes = (value: DateInput, minutes: number): Date | null => {
  const date = toDate(value);
  if (!date || !Number.isFinite(minutes)) {
    return null;
  }

  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);
  return next;
};

export const sortByDateAsc = <T>(
  items: T[],
  getValue: (item: T) => DateInput,
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = toDate(getValue(a))?.getTime() ?? 0;
    const dateB = toDate(getValue(b))?.getTime() ?? 0;
    return dateA - dateB;
  });
};

export const sortByDateDesc = <T>(
  items: T[],
  getValue: (item: T) => DateInput,
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = toDate(getValue(a))?.getTime() ?? 0;
    const dateB = toDate(getValue(b))?.getTime() ?? 0;
    return dateB - dateA;
  });
};

export const getGreetingByTime = (value: DateInput = new Date()): string => {
  const date = toDate(value);
  if (!date) {
    return "Hello";
  }

  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  if (hour < 21) {
    return "Good evening";
  }

  return "Good night";
};

export default formatDate;