// src/lib/formatters.ts

import {
  formatCurrency,
  formatCompactCurrency,
  type SupportedCurrency,
} from "./currency";
import {
  formatDate,
  formatDateTime,
  formatTime,
  getRelativeTime,
  type DateInput,
} from "./date";

export interface NameFormatOptions {
  fallback?: string;
  maxLength?: number;
}

export interface NumberFormatOptions {
  locale?: string;
  fallback?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface PercentageFormatOptions extends NumberFormatOptions {
  multiplyBy100?: boolean;
}

const DEFAULT_FALLBACK = "-";
const DEFAULT_LOCALE = "en-IN";

const toSafeString = (value: unknown, fallback = DEFAULT_FALLBACK): string => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
};

export const formatText = (
  value: unknown,
  fallback = DEFAULT_FALLBACK,
): string => {
  return toSafeString(value, fallback);
};

export const formatTitleCase = (
  value: unknown,
  fallback = DEFAULT_FALLBACK,
): string => {
  const text = toSafeString(value, fallback);

  if (text === fallback) {
    return fallback;
  }

  return text
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatUpperCase = (
  value: unknown,
  fallback = DEFAULT_FALLBACK,
): string => {
  const text = toSafeString(value, fallback);
  return text === fallback ? fallback : text.toUpperCase();
};

export const formatLowerCase = (
  value: unknown,
  fallback = DEFAULT_FALLBACK,
): string => {
  const text = toSafeString(value, fallback);
  return text === fallback ? fallback : text.toLowerCase();
};

export const formatCapitalize = (
  value: unknown,
  fallback = DEFAULT_FALLBACK,
): string => {
  const text = toSafeString(value, fallback);

  if (text === fallback) {
    return fallback;
  }

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatName = (
  value: unknown,
  options: NameFormatOptions = {},
): string => {
  const { fallback = DEFAULT_FALLBACK, maxLength } = options;
  const text = formatTitleCase(value, fallback);

  if (text === fallback) {
    return fallback;
  }

  if (maxLength && text.length > maxLength) {
    return `${text.slice(0, maxLength).trim()}…`;
  }

  return text;
};

export const formatInitials = (
  value: unknown,
  fallback = "?",
): string => {
  const text = toSafeString(value, "");

  if (!text) {
    return fallback;
  }

  const parts = text.split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase() || fallback;
};

export const formatEmail = (
  value: unknown,
  fallback = DEFAULT_FALLBACK,
): string => {
  const email = toSafeString(value, fallback);

  if (email === fallback) {
    return fallback;
  }

  return email.toLowerCase();
};

export const formatPhone = (
  value: unknown,
  fallback = DEFAULT_FALLBACK,
): string => {
  const phone = toSafeString(value, "");

  if (!phone) {
    return fallback;
  }

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }

  if (digits.length > 0) {
    return phone;
  }

  return fallback;
};

export const formatAddress = (
  parts: Array<unknown>,
  fallback = DEFAULT_FALLBACK,
): string => {
  const filtered = parts
    .map((part) => toSafeString(part, ""))
    .filter(Boolean);

  return filtered.length > 0 ? filtered.join(", ") : fallback;
};

export const formatNumber = (
  value: unknown,
  options: NumberFormatOptions = {},
): string => {
  const {
    locale = DEFAULT_LOCALE,
    fallback = "0",
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options;

  const numericValue =
    typeof value === "string" ? Number(value.replace(/,/g, "").trim()) : value;

  if (typeof numericValue !== "number" || !Number.isFinite(numericValue)) {
    return fallback;
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numericValue);
};

export const formatInteger = (
  value: unknown,
  fallback = "0",
): string => {
  return formatNumber(value, {
    fallback,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const formatDecimal = (
  value: unknown,
  fractionDigits = 2,
  fallback = "0.00",
): string => {
  return formatNumber(value, {
    fallback,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

export const formatPercentage = (
  value: unknown,
  options: PercentageFormatOptions = {},
): string => {
  const {
    locale = DEFAULT_LOCALE,
    fallback = "0%",
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    multiplyBy100 = false,
  } = options;

  const numericValue =
    typeof value === "string" ? Number(value.replace(/,/g, "").trim()) : value;

  if (typeof numericValue !== "number" || !Number.isFinite(numericValue)) {
    return fallback;
  }

  const finalValue = multiplyBy100 ? numericValue * 100 : numericValue;

  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(finalValue)}%`;
};

export const formatCurrencyValue = (
  value: unknown,
  currency: SupportedCurrency = "INR",
  fallback = "₹0",
): string => {
  return formatCurrency(
    typeof value === "string" || typeof value === "number" ? value : null,
    { currency, fallback },
  );
};

export const formatCompactMoney = (
  value: unknown,
  currency: SupportedCurrency = "INR",
  fallback = "₹0",
): string => {
  return formatCompactCurrency(
    typeof value === "string" || typeof value === "number" ? value : null,
    { currency, fallback },
  );
};

export const formatFileSize = (
  bytes: unknown,
  fallback = DEFAULT_FALLBACK,
): string => {
  const numericValue =
    typeof bytes === "string" ? Number(bytes.replace(/,/g, "").trim()) : bytes;

  if (
    typeof numericValue !== "number" ||
    !Number.isFinite(numericValue) ||
    numericValue < 0
  ) {
    return fallback;
  }

  if (numericValue === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(numericValue) / Math.log(1024)),
    units.length - 1,
  );

  const size = numericValue / 1024 ** index;
  const decimals = index === 0 ? 0 : 2;

  return `${size.toFixed(decimals)} ${units[index]}`;
};

export const formatDurationMinutes = (
  minutes: unknown,
  fallback = DEFAULT_FALLBACK,
): string => {
  const numericValue =
    typeof minutes === "string" ? Number(minutes.replace(/,/g, "").trim()) : minutes;

  if (
    typeof numericValue !== "number" ||
    !Number.isFinite(numericValue) ||
    numericValue < 0
  ) {
    return fallback;
  }

  if (numericValue < 60) {
    return `${Math.round(numericValue)} min`;
  }

  const hours = Math.floor(numericValue / 60);
  const remainingMinutes = Math.round(numericValue % 60);

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};

export const formatCountLabel = (
  count: unknown,
  singular: string,
  plural?: string,
  fallback = `0 ${plural ?? `${singular}s`}`,
): string => {
  const numericValue =
    typeof count === "string" ? Number(count.replace(/,/g, "").trim()) : count;

  if (typeof numericValue !== "number" || !Number.isFinite(numericValue)) {
    return fallback;
  }

  const safePlural = plural ?? `${singular}s`;
  return `${formatInteger(numericValue)} ${numericValue === 1 ? singular : safePlural}`;
};

export const formatBooleanLabel = (
  value: unknown,
  trueLabel = "Yes",
  falseLabel = "No",
): string => {
  return Boolean(value) ? trueLabel : falseLabel;
};

export const formatStatusLabel = (
  value: unknown,
  fallback = DEFAULT_FALLBACK,
): string => {
  const text = toSafeString(value, fallback);

  if (text === fallback) {
    return fallback;
  }

  return text
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatSlugLabel = (
  value: unknown,
  fallback = DEFAULT_FALLBACK,
): string => {
  const text = toSafeString(value, fallback);

  if (text === fallback) {
    return fallback;
  }

  return text.replace(/[-_]+/g, " ").trim();
};

export const truncateText = (
  value: unknown,
  maxLength = 50,
  fallback = DEFAULT_FALLBACK,
): string => {
  const text = toSafeString(value, fallback);

  if (text === fallback) {
    return fallback;
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}…`;
};

export const formatDateLabel = (
  value: DateInput,
  fallback = DEFAULT_FALLBACK,
): string => {
  return formatDate(value, { fallback });
};

export const formatTimeLabel = (
  value: DateInput,
  fallback = "--:--",
): string => {
  return formatTime(value, { fallback });
};

export const formatDateTimeLabel = (
  value: DateInput,
  fallback = DEFAULT_FALLBACK,
): string => {
  return formatDateTime(value, { fallback });
};

export const formatRelativeDate = (
  value: DateInput,
  fallback = DEFAULT_FALLBACK,
): string => {
  return getRelativeTime(value, { fallback });
};

export const formatDateWithRelative = (
  value: DateInput,
  fallback = DEFAULT_FALLBACK,
): string => {
  const absolute = formatDate(value, { fallback });
  const relative = getRelativeTime(value, { fallback });

  if (absolute === fallback || relative === fallback) {
    return fallback;
  }

  return `${absolute} • ${relative}`;
};

export const formatList = (
  values: Array<unknown>,
  fallback = DEFAULT_FALLBACK,
): string => {
  const filtered = values
    .map((item) => toSafeString(item, ""))
    .filter(Boolean);

  return filtered.length > 0 ? filtered.join(", ") : fallback;
};

export const formatJoinedNames = (
  values: Array<unknown>,
  fallback = DEFAULT_FALLBACK,
): string => {
  const filtered = values
    .map((item) => formatName(item, { fallback: "" }))
    .filter(Boolean);

  return filtered.length > 0 ? filtered.join(", ") : fallback;
};

const formatters = {
  formatText,
  formatTitleCase,
  formatUpperCase,
  formatLowerCase,
  formatCapitalize,
  formatName,
  formatInitials,
  formatEmail,
  formatPhone,
  formatAddress,
  formatNumber,
  formatInteger,
  formatDecimal,
  formatPercentage,
  formatCurrencyValue,
  formatCompactMoney,
  formatFileSize,
  formatDurationMinutes,
  formatCountLabel,
  formatBooleanLabel,
  formatStatusLabel,
  formatSlugLabel,
  truncateText,
  formatDateLabel,
  formatTimeLabel,
  formatDateTimeLabel,
  formatRelativeDate,
  formatDateWithRelative,
  formatList,
  formatJoinedNames,
};

export default formatters;