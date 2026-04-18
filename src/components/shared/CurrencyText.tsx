import React from "react";

export interface CurrencyTextProps {
  value: number | string | null | undefined;
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
  showPlusForPositive?: boolean;
  muted?: boolean;
  className?: string;
  fallback?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const toSafeNumber = (value: CurrencyTextProps["value"]) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const numeric = Number(value.replace(/,/g, ""));
    return Number.isFinite(numeric) ? numeric : null;
  }

  return null;
};

const formatCurrencyValue = ({
  value,
  currency,
  locale,
  minimumFractionDigits,
  maximumFractionDigits,
  compact,
}: {
  value: number;
  currency: string;
  locale: string;
  minimumFractionDigits: number;
  maximumFractionDigits: number;
  compact: boolean;
}) => {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: compact ? "compact" : "standard",
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  } catch {
    const abs = Math.abs(value);

    if (compact) {
      if (abs >= 1_000_000_000) {
        return `${currency} ${(value / 1_000_000_000).toFixed(1)}B`;
      }
      if (abs >= 1_000_000) {
        return `${currency} ${(value / 1_000_000).toFixed(1)}M`;
      }
      if (abs >= 1_000) {
        return `${currency} ${(value / 1_000).toFixed(1)}K`;
      }
    }

    return `${currency} ${value.toFixed(maximumFractionDigits)}`;
  }
};

const CurrencyText: React.FC<CurrencyTextProps> = ({
  value,
  currency = "INR",
  locale = "en-IN",
  minimumFractionDigits = 0,
  maximumFractionDigits = 0,
  compact = false,
  showPlusForPositive = false,
  muted = false,
  className,
  fallback = "—",
  prefix,
  suffix,
}) => {
  const numericValue = toSafeNumber(value);

  if (numericValue === null) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-sm text-slate-400 dark:text-slate-500",
          className
        )}
      >
        {prefix}
        {fallback}
        {suffix}
      </span>
    );
  }

  const formatted = formatCurrencyValue({
    value: numericValue,
    currency,
    locale,
    minimumFractionDigits,
    maximumFractionDigits,
    compact,
  });

  const shouldShowPlus = showPlusForPositive && numericValue > 0;
  const isNegative = numericValue < 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        muted
          ? "text-slate-600 dark:text-slate-300"
          : isNegative
            ? "text-rose-600 dark:text-rose-400"
            : "text-slate-900 dark:text-slate-100",
        className
      )}
    >
      {prefix}
      {shouldShowPlus ? "+" : ""}
      {formatted}
      {suffix}
    </span>
  );
};

export default CurrencyText;