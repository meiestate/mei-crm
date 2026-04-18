import React, { useMemo, useState, type CSSProperties } from "react";
import { getTheme } from "../../theme";

type ThemeMode = "light" | "dark";

export interface PhoneLinkProps {
  value?: string | number | null;
  mode?: ThemeMode;
  fallback?: string;
  className?: string;
  style?: CSSProperties;
  showIcon?: boolean;
  copyable?: boolean;
  displayValue?: string;
  countryCode?: string;
  onClick?: (phone: string) => void;
}

const sanitizePhoneNumber = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[^\d+]/g, "");
};

const formatPhoneForDisplay = (phone: string): string => {
  const cleaned = phone.replace(/[^\d]/g, "");

  if (!cleaned) return "";

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }

  if (phone.startsWith("+")) {
    return phone;
  }

  return cleaned;
};

const buildDialValue = (phone: string, countryCode?: string): string => {
  if (!phone) return "";

  if (phone.startsWith("+")) return phone;

  const digitsOnly = phone.replace(/[^\d]/g, "");

  if (!digitsOnly) return "";

  if (countryCode && !digitsOnly.startsWith(countryCode.replace("+", ""))) {
    return `${countryCode}${digitsOnly}`;
  }

  return digitsOnly;
};

const PhoneLink: React.FC<PhoneLinkProps> = ({
  value,
  mode = "light",
  fallback = "No phone number",
  className,
  style,
  showIcon = true,
  copyable = true,
  displayValue,
  countryCode = "+91",
  onClick,
}) => {
  const theme = useMemo(() => getTheme(mode), [mode]);
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const rawPhone = useMemo(() => sanitizePhoneNumber(value), [value]);
  const dialValue = useMemo(() => buildDialValue(rawPhone, countryCode), [rawPhone, countryCode]);
  const prettyValue = useMemo(() => {
    if (displayValue) return displayValue;
    return formatPhoneForDisplay(rawPhone);
  }, [displayValue, rawPhone]);

  const hasPhone = Boolean(dialValue);

  const handleCopy = async () => {
    if (!copyable || !hasPhone) return;

    try {
      await navigator.clipboard.writeText(dialValue);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const linkStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: hovered ? theme.primaryHover ?? theme.primary : theme.primary,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.4,
    transition: "all 0.2s ease",
    cursor: "pointer",
  };

  const wrapperStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    ...style,
  };

  const copyButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: mode === "dark" ? "rgba(255,255,255,0.04)" : theme.cardBgSoft ?? "#f8fafc",
    color: copied ? (theme.success ?? "#16a34a") : theme.subText,
    borderRadius: 10,
    padding: "4px 8px",
    fontSize: 12,
    fontWeight: 700,
    cursor: hasPhone ? "pointer" : "not-allowed",
    transition: "all 0.2s ease",
  };

  const fallbackStyle: CSSProperties = {
    color: theme.subText,
    fontSize: 14,
    fontWeight: 500,
  };

  if (!hasPhone) {
    return (
      <span className={className} style={{ ...fallbackStyle, ...style }}>
        {fallback}
      </span>
    );
  }

  return (
    <span className={className} style={wrapperStyle}>
      <a
        href={`tel:${dialValue}`}
        style={linkStyle}
        onClick={() => onClick?.(dialValue)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={`Call ${prettyValue || dialValue}`}
      >
        {showIcon ? (
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              borderRadius: "50%",
              background:
                mode === "dark"
                  ? "rgba(37,99,235,0.18)"
                  : "rgba(37,99,235,0.10)",
              fontSize: 12,
            }}
          >
            📞
          </span>
        ) : null}

        <span>{prettyValue || dialValue}</span>
      </a>

      {copyable ? (
        <button type="button" onClick={handleCopy} style={copyButtonStyle}>
          {copied ? "Copied" : "Copy"}
        </button>
      ) : null}
    </span>
  );
};

export default PhoneLink;