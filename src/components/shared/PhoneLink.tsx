import type { CSSProperties } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type PhoneLinkProps = {
  value: string | number | null | undefined;
  mode: ThemeMode;
  fallback?: string;
  showIcon?: boolean;
  icon?: string;
  muted?: boolean;
  fontSize?: number | string;
  fontWeight?: number;
  underline?: boolean;
};

function normalizePhoneValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

function formatPhoneDisplay(phone: string): string {
  const cleaned = phone.replace(/[^\d]/g, "");

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }

  if (phone.startsWith("+") && cleaned.length > 0) {
    return `+${cleaned}`;
  }

  return phone;
}

export default function PhoneLink({
  value,
  mode,
  fallback = "—",
  showIcon = false,
  icon = "☎",
  muted = false,
  fontSize = 14,
  fontWeight = 600,
  underline = false,
}: PhoneLinkProps) {
  const theme = getTheme(mode);
  const rawValue = normalizePhoneValue(value);

  if (!rawValue) {
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

  const sanitized = sanitizePhoneNumber(rawValue);

  if (!sanitized || sanitized === "+") {
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

  const displayText = formatPhoneDisplay(rawValue);

  const linkStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: muted ? theme.subText : theme.primary,
    fontSize,
    fontWeight,
    textDecoration: underline ? "underline" : "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
  };

  return (
    <a href={`tel:${sanitized}`} style={linkStyle} title={displayText}>
      {showIcon && (
        <span
          style={{
            fontSize: typeof fontSize === "number" ? fontSize - 1 : fontSize,
            lineHeight: 1,
          }}
        >
          {icon}
        </span>
      )}
      <span>{displayText}</span>
    </a>
  );
}