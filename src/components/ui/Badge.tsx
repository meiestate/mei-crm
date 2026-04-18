import React, { useMemo, type ReactNode } from "react";
import { getTheme } from "../../theme";

type ThemeMode = "light" | "dark";
type BadgeVariant = "soft" | "solid" | "outline";
type BadgeTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface BadgeProps {
  children: ReactNode;
  mode?: ThemeMode;
  variant?: BadgeVariant;
  tone?: BadgeTone;
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  icon?: ReactNode;
  className?: string;
}

const getTonePalette = (tone: BadgeTone, mode: ThemeMode) => {
  switch (tone) {
    case "primary":
      return {
        base: "#2563eb",
        softBg: mode === "dark" ? "rgba(37,99,235,0.20)" : "rgba(37,99,235,0.10)",
        softText: "#2563eb",
      };

    case "success":
      return {
        base: "#16a34a",
        softBg: mode === "dark" ? "rgba(22,163,74,0.20)" : "rgba(22,163,74,0.10)",
        softText: "#16a34a",
      };

    case "warning":
      return {
        base: "#d97706",
        softBg: mode === "dark" ? "rgba(217,119,6,0.20)" : "rgba(217,119,6,0.10)",
        softText: "#d97706",
      };

    case "danger":
      return {
        base: "#dc2626",
        softBg: mode === "dark" ? "rgba(220,38,38,0.20)" : "rgba(220,38,38,0.10)",
        softText: "#dc2626",
      };

    case "info":
      return {
        base: "#0891b2",
        softBg: mode === "dark" ? "rgba(8,145,178,0.20)" : "rgba(8,145,178,0.10)",
        softText: "#0891b2",
      };

    case "default":
    default:
      return {
        base: mode === "dark" ? "#cbd5e1" : "#475569",
        softBg:
          mode === "dark"
            ? "rgba(148,163,184,0.18)"
            : "rgba(148,163,184,0.10)",
        softText: mode === "dark" ? "#e2e8f0" : "#475569",
      };
  }
};

const Badge: React.FC<BadgeProps> = ({
  children,
  mode = "light",
  variant = "soft",
  tone = "default",
  size = "md",
  rounded = true,
  icon,
  className,
}) => {
  useMemo(() => getTheme(mode), [mode]);

  const palette = useMemo(() => getTonePalette(tone, mode), [tone, mode]);

  const sizeStyle = useMemo(() => {
    switch (size) {
      case "sm":
        return {
          fontSize: 11,
          padding: "4px 8px",
          gap: 5,
        };
      case "lg":
        return {
          fontSize: 13,
          padding: "7px 12px",
          gap: 7,
        };
      case "md":
      default:
        return {
          fontSize: 12,
          padding: "5px 10px",
          gap: 6,
        };
    }
  }, [size]);

  const colors = useMemo(() => {
    if (variant === "solid") {
      return {
        background: palette.base,
        color: "#ffffff",
        border: palette.base,
      };
    }

    if (variant === "outline") {
      return {
        background: "transparent",
        color: palette.base,
        border: palette.base,
      };
    }

    return {
      background: palette.softBg,
      color: palette.softText,
      border: "transparent",
    };
  }, [palette, variant]);

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sizeStyle.gap,
        padding: sizeStyle.padding,
        borderRadius: rounded ? 999 : 10,
        background: colors.background,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        fontSize: sizeStyle.fontSize,
        fontWeight: 700,
        lineHeight: 1,
        whiteSpace: "nowrap",
        boxShadow:
          variant === "solid"
            ? mode === "dark"
              ? "0 8px 18px rgba(0,0,0,0.24)"
              : "0 8px 18px rgba(15,23,42,0.10)"
            : "none",
      }}
      title={typeof children === "string" ? children : undefined}
    >
      {icon ? (
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size === "lg" ? 13 : 12,
            lineHeight: 1,
          }}
        >
          {icon}
        </span>
      ) : null}

      <span>{children}</span>
    </span>
  );
};

export default Badge;