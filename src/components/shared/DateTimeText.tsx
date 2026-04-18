import React from "react";
import { CalendarDays, Clock3 } from "lucide-react";

export interface DateTimeTextProps {
  value: string | number | Date | null | undefined;
  locale?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
  showDate?: boolean;
  showTime?: boolean;
  relative?: boolean;
  muted?: boolean;
  className?: string;
  fallback?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  withIcon?: boolean;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const toDate = (value: DateTimeTextProps["value"]) => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

const formatRelativeTime = (date: Date, locale: string) => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const absMs = Math.abs(diffMs);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (absMs < minute) return "just now";
  if (absMs < hour) return rtf.format(Math.round(diffMs / minute), "minute");
  if (absMs < day) return rtf.format(Math.round(diffMs / hour), "hour");
  if (absMs < week) return rtf.format(Math.round(diffMs / day), "day");
  if (absMs < month) return rtf.format(Math.round(diffMs / week), "week");
  if (absMs < year) return rtf.format(Math.round(diffMs / month), "month");
  return rtf.format(Math.round(diffMs / year), "year");
};

const formatAbsoluteDateTime = ({
  date,
  locale,
  dateStyle,
  timeStyle,
  showDate,
  showTime,
}: {
  date: Date;
  locale: string;
  dateStyle: NonNullable<DateTimeTextProps["dateStyle"]>;
  timeStyle: NonNullable<DateTimeTextProps["timeStyle"]>;
  showDate: boolean;
  showTime: boolean;
}) => {
  try {
    if (showDate && showTime) {
      return new Intl.DateTimeFormat(locale, {
        dateStyle,
        timeStyle,
      }).format(date);
    }

    if (showDate) {
      return new Intl.DateTimeFormat(locale, {
        dateStyle,
      }).format(date);
    }

    if (showTime) {
      return new Intl.DateTimeFormat(locale, {
        timeStyle,
      }).format(date);
    }

    return "";
  } catch {
    return date.toLocaleString();
  }
};

const DateTimeText: React.FC<DateTimeTextProps> = ({
  value,
  locale = "en-IN",
  dateStyle = "medium",
  timeStyle = "short",
  showDate = true,
  showTime = true,
  relative = false,
  muted = false,
  className,
  fallback = "—",
  prefix,
  suffix,
  withIcon = false,
}) => {
  const date = toDate(value);

  if (!date) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500",
          className
        )}
      >
        {prefix}
        {fallback}
        {suffix}
      </span>
    );
  }

  const formatted = relative
    ? formatRelativeTime(date, locale)
    : formatAbsoluteDateTime({
        date,
        locale,
        dateStyle,
        timeStyle,
        showDate,
        showTime,
      });

  const Icon = showDate && !showTime ? CalendarDays : Clock3;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium",
        muted
          ? "text-slate-600 dark:text-slate-300"
          : "text-slate-900 dark:text-slate-100",
        className
      )}
    >
      {prefix}
      {withIcon ? <Icon className="h-4 w-4 shrink-0" /> : null}
      {formatted}
      {suffix}
    </span>
  );
};

export default DateTimeText;