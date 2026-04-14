// src/utils/communications/formatMessageDate.ts

export type MessageDateFormatMode =
  | "time"
  | "short"
  | "full"
  | "relative"
  | "smart";

function toValidDate(value?: string | number | Date | null): Date | null {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(date: Date, now: Date): boolean {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return isSameDay(date, yesterday);
}

function isSameYear(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear();
}

export function formatMessageTime(
  value?: string | number | Date | null,
  locale = "en-IN",
): string {
  const date = toValidDate(value);
  if (!date) return "-";

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatMessageShortDate(
  value?: string | number | Date | null,
  locale = "en-IN",
): string {
  const date = toValidDate(value);
  if (!date) return "-";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function formatMessageFullDate(
  value?: string | number | Date | null,
  locale = "en-IN",
): string {
  const date = toValidDate(value);
  if (!date) return "-";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatMessageRelativeDate(
  value?: string | number | Date | null,
): string {
  const date = toValidDate(value);
  if (!date) return "-";

  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const absMinutes = Math.abs(diffMinutes);

  if (absMinutes < 1) return "just now";

  if (absMinutes < 60) {
    return diffMinutes > 0 ? `in ${absMinutes} min` : `${absMinutes} min ago`;
  }

  const diffHours = Math.round(absMinutes / 60);
  if (diffHours < 24) {
    return diffMinutes > 0 ? `in ${diffHours} hr` : `${diffHours} hr ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) {
    return diffMinutes > 0
      ? `in ${diffDays} day${diffDays > 1 ? "s" : ""}`
      : `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  const diffWeeks = Math.round(diffDays / 7);
  if (diffWeeks < 5) {
    return diffMinutes > 0
      ? `in ${diffWeeks} wk`
      : `${diffWeeks} wk ago`;
  }

  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 12) {
    return diffMinutes > 0
      ? `in ${diffMonths} mo`
      : `${diffMonths} mo ago`;
  }

  const diffYears = Math.round(diffDays / 365);
  return diffMinutes > 0
    ? `in ${diffYears} yr`
    : `${diffYears} yr ago`;
}

export function formatMessageSmartDate(
  value?: string | number | Date | null,
  locale = "en-IN",
): string {
  const date = toValidDate(value);
  if (!date) return "-";

  const now = new Date();

  if (isSameDay(date, now)) {
    return formatMessageTime(date, locale);
  }

  if (isYesterday(date, now)) {
    return "Yesterday";
  }

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
    }).format(date);
  }

  if (isSameYear(date, now)) {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
    }).format(date);
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatMessageDate(
  value?: string | number | Date | null,
  mode: MessageDateFormatMode = "smart",
  locale = "en-IN",
): string {
  switch (mode) {
    case "time":
      return formatMessageTime(value, locale);
    case "short":
      return formatMessageShortDate(value, locale);
    case "full":
      return formatMessageFullDate(value, locale);
    case "relative":
      return formatMessageRelativeDate(value);
    case "smart":
    default:
      return formatMessageSmartDate(value, locale);
  }
}