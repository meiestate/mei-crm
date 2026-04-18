// src/utils/currency.ts

export type SupportedCurrency =
  | "INR"
  | "USD"
  | "EUR"
  | "GBP"
  | "AED"
  | "SGD";

export interface FormatCurrencyOptions {
  currency?: SupportedCurrency;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
  fallback?: string;
}

export interface ParseCurrencyOptions {
  fallback?: number;
}

const DEFAULT_CURRENCY: SupportedCurrency = "INR";
const DEFAULT_LOCALE = "en-IN";
const DEFAULT_FALLBACK = "₹0";

const currencyLocaleMap: Record<SupportedCurrency, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "en-IE",
  GBP: "en-GB",
  AED: "en-AE",
  SGD: "en-SG",
};

const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === "number" && Number.isFinite(value);
};

export const getCurrencyLocale = (
  currency: SupportedCurrency = DEFAULT_CURRENCY,
): string => {
  return currencyLocaleMap[currency] ?? DEFAULT_LOCALE;
};

export const formatCurrency = (
  amount: number | string | null | undefined,
  options: FormatCurrencyOptions = {},
): string => {
  const {
    currency = DEFAULT_CURRENCY,
    locale = getCurrencyLocale(currency),
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    compact = false,
    fallback = DEFAULT_FALLBACK,
  } = options;

  const numericAmount =
    typeof amount === "string" ? Number(amount.replace(/,/g, "").trim()) : amount;

  if (!isFiniteNumber(numericAmount)) {
    return fallback;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: compact ? "compact" : "standard",
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(numericAmount);
  } catch {
    return fallback;
  }
};

export const formatAmount = (
  amount: number | string | null | undefined,
  options: Omit<FormatCurrencyOptions, "compact"> = {},
): string => {
  return formatCurrency(amount, {
    ...options,
    compact: false,
  });
};

export const formatCompactCurrency = (
  amount: number | string | null | undefined,
  options: Omit<FormatCurrencyOptions, "compact"> = {},
): string => {
  return formatCurrency(amount, {
    ...options,
    compact: true,
  });
};

export const formatNumber = (
  value: number | string | null | undefined,
  locale = DEFAULT_LOCALE,
  fallback = "0",
): string => {
  const numericValue =
    typeof value === "string" ? Number(value.replace(/,/g, "").trim()) : value;

  if (!isFiniteNumber(numericValue)) {
    return fallback;
  }

  return new Intl.NumberFormat(locale).format(numericValue);
};

export const formatDecimal = (
  value: number | string | null | undefined,
  fractionDigits = 2,
  locale = DEFAULT_LOCALE,
  fallback = "0.00",
): string => {
  const numericValue =
    typeof value === "string" ? Number(value.replace(/,/g, "").trim()) : value;

  if (!isFiniteNumber(numericValue)) {
    return fallback;
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numericValue);
};

export const parseCurrencyToNumber = (
  value: string | number | null | undefined,
  options: ParseCurrencyOptions = {},
): number => {
  const { fallback = 0 } = options;

  if (isFiniteNumber(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return fallback;
  }

  const cleaned = value.replace(/[^\d.-]/g, "");
  const parsed = Number(cleaned);

  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getCurrencySymbol = (
  currency: SupportedCurrency = DEFAULT_CURRENCY,
  locale?: string,
): string => {
  try {
    const parts = new Intl.NumberFormat(locale ?? getCurrencyLocale(currency), {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).formatToParts(1);

    return parts.find((part) => part.type === "currency")?.value ?? currency;
  } catch {
    return currency;
  }
};

export const formatIndianCurrencyWords = (
  amount: number | string | null | undefined,
): string => {
  const numericAmount =
    typeof amount === "string" ? Number(amount.replace(/,/g, "").trim()) : amount;

  if (!isFiniteNumber(numericAmount) || numericAmount < 0) {
    return "Zero Rupees";
  }

  if (numericAmount === 0) {
    return "Zero Rupees";
  }

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const toWordsUnderThousand = (num: number): string => {
    let result = "";

    if (num >= 100) {
      result += `${ones[Math.floor(num / 100)]} Hundred `;
      num %= 100;
    }

    if (num >= 20) {
      result += `${tens[Math.floor(num / 10)]} `;
      num %= 10;
    }

    if (num > 0) {
      result += `${ones[num]} `;
    }

    return result.trim();
  };

  const integerPart = Math.floor(numericAmount);
  const decimalPart = Math.round((numericAmount - integerPart) * 100);

  const crore = Math.floor(integerPart / 10000000);
  const lakh = Math.floor((integerPart % 10000000) / 100000);
  const thousand = Math.floor((integerPart % 100000) / 1000);
  const remainder = integerPart % 1000;

  const parts: string[] = [];

  if (crore > 0) {
    parts.push(`${toWordsUnderThousand(crore)} Crore`);
  }

  if (lakh > 0) {
    parts.push(`${toWordsUnderThousand(lakh)} Lakh`);
  }

  if (thousand > 0) {
    parts.push(`${toWordsUnderThousand(thousand)} Thousand`);
  }

  if (remainder > 0) {
    parts.push(toWordsUnderThousand(remainder));
  }

  let result = `${parts.join(" ").trim()} Rupees`;

  if (decimalPart > 0) {
    result += ` and ${toWordsUnderThousand(decimalPart)} Paise`;
  }

  return result.trim();
};

export const formatRevenue = (
  amount: number | string | null | undefined,
  currency: SupportedCurrency = "INR",
): string => {
  return formatCurrency(amount, {
    currency,
    compact: true,
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    fallback: currency === "INR" ? "₹0" : "0",
  });
};

export const formatDealValue = (
  amount: number | string | null | undefined,
  currency: SupportedCurrency = "INR",
): string => {
  return formatCurrency(amount, {
    currency,
    compact: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    fallback: currency === "INR" ? "₹0" : "0",
  });
};

export default formatCurrency;