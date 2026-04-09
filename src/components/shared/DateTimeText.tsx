import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type DateTimeTextProps = {
  value: string | number | Date | null | undefined;
  mode: ThemeMode;
  type?: "date" | "time" | "datetime";
  locale?: string;
  fallback?: string;
  muted?: boolean;
  fontSize?: number | string;
  fontWeight?: number;
  showRelative?: boolean;
  titlePrefix?: string;
};

function parseDateValue(
  value: string | number | Date | null | undefined
): Date | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed =
    value instanceof Date ? value : new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatAbsoluteDate(
  date: Date,
  type: "date" | "time" | "datetime",
  locale: string
) {
  if (type === "date") {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  if (type === "time") {
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();

  const absMs = Math.abs(diffMs);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (absMs < minute) {
    return diffMs >= 0 ? "In a few seconds" : "Just now";
  }

  if (absMs < hour) {
    const minutes = Math.round(absMs / minute);
    return diffMs >= 0
      ? `In ${minutes} min`
      : `${minutes} min ago`;
  }

  if (absMs < day) {
    const hours = Math.round(absMs / hour);
    return diffMs >= 0
      ? `In ${hours} hr`
      : `${hours} hr ago`;
  }

  const days = Math.round(absMs / day);

  if (days === 1) {
    return diffMs >= 0 ? "Tomorrow" : "Yesterday";
  }

  if (days < 7) {
    return diffMs >= 0
      ? `In ${days} days`
      : `${days} days ago`;
  }

  return formatAbsoluteDate(date, "date", "en-IN");
}

export default function DateTimeText({
  value,
  mode,
  type = "datetime",
  locale = "en-IN",
  fallback = "—",
  muted = false,
  fontSize = 14,
  fontWeight = 600,
  showRelative = false,
  titlePrefix = "",
}: DateTimeTextProps) {
  const theme = getTheme(mode);
  const date = parseDateValue(value);

  if (!date) {
    return (
      <span
        style={{
          fontSize,
          fontWeight,
          color: theme.mutedText,
        }}
      >
        {fallback}
      </span>
    );
  }

  const absoluteText = formatAbsoluteDate(date, type, locale);
  const displayText = showRelative
    ? formatRelativeDate(date)
    : absoluteText;

  return (
    <span
      style={{
        fontSize,
        fontWeight,
        color: muted ? theme.subText : theme.text,
        whiteSpace: "nowrap",
      }}
      title={`${titlePrefix}${absoluteText}`}
    >
      {displayText}
    </span>
  );
}