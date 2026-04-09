import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type CurrencyTextProps = {
  value: number | string | null | undefined;
  mode: ThemeMode;
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
  showSign?: boolean;
  colorize?: boolean;
  prefix?: string;
  suffix?: string;
  fallback?: string;
  fontSize?: number | string;
  fontWeight?: number;
};

function parseAmount(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const normalized = value.replace(/,/g, "").trim();
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function formatCurrencyValue({
  amount,
  currency,
  locale,
  minimumFractionDigits,
  maximumFractionDigits,
  compact,
}: {
  amount: number;
  currency: string;
  locale: string;
  minimumFractionDigits: number;
  maximumFractionDigits: number;
  compact: boolean;
}) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

export default function CurrencyText({
  value,
  mode,
  currency = "INR",
  locale = "en-IN",
  minimumFractionDigits = 0,
  maximumFractionDigits = 0,
  compact = false,
  showSign = false,
  colorize = false,
  prefix = "",
  suffix = "",
  fallback = "—",
  fontSize = 14,
  fontWeight = 700,
}: CurrencyTextProps) {
  const theme = getTheme(mode);
  const amount = parseAmount(value);

  if (amount === null) {
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

  const signedAmount =
    showSign && amount > 0 ? `+${amount}` : String(amount);

  const formatted = formatCurrencyValue({
    amount: Number(signedAmount),
    currency,
    locale,
    minimumFractionDigits,
    maximumFractionDigits,
    compact,
  });

  const resolvedColor = colorize
    ? amount > 0
      ? theme.success ?? "#16a34a"
      : amount < 0
      ? theme.warning ?? "#dc2626"
      : theme.text
    : theme.text;

  return (
    <span
      style={{
        fontSize,
        fontWeight,
        color: resolvedColor,
        whiteSpace: "nowrap",
      }}
      title={`${prefix}${formatted}${suffix}`}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}