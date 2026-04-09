import type { ReactNode } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type BadgeVariant = "soft" | "solid" | "outline";
type BadgeTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

type BadgeProps = {
  mode: ThemeMode;
  children: ReactNode;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  icon?: ReactNode;
  showDot?: boolean;
  compact?: boolean;
  rounded?: boolean;
};

function getToneStyles(
  tone: BadgeTone,
  variant: BadgeVariant,
  mode: ThemeMode,
  theme: ReturnType<typeof getTheme>
) {
  const tones = {
    default: {
      color: theme.text,
      softBg:
        mode === "dark"
          ? "rgba(255,255,255,0.08)"
          : "rgba(15,23,42,0.06)",
      solidBg: theme.text,
      border:
        mode === "dark"
          ? "rgba(255,255,255,0.10)"
          : "rgba(15,23,42,0.10)",
    },
    primary: {
      color: theme.primary,
      softBg:
        mode === "dark"
          ? "rgba(59,130,246,0.14)"
          : "rgba(37,99,235,0.10)",
      solidBg: theme.primary,
      border:
        mode === "dark"
          ? "rgba(59,130,246,0.22)"
          : "rgba(37,99,235,0.18)",
    },
    success: {
      color: theme.success ?? "#22c55e",
      softBg:
        mode === "dark"
          ? "rgba(34,197,94,0.14)"
          : "rgba(34,197,94,0.10)",
      solidBg: theme.success ?? "#22c55e",
      border:
        mode === "dark"
          ? "rgba(34,197,94,0.22)"
          : "rgba(34,197,94,0.18)",
    },
    warning: {
      color: "#f59e0b",
      softBg:
        mode === "dark"
          ? "rgba(245,158,11,0.14)"
          : "rgba(245,158,11,0.10)",
      solidBg: "#f59e0b",
      border:
        mode === "dark"
          ? "rgba(245,158,11,0.22)"
          : "rgba(245,158,11,0.18)",
    },
    danger: {
      color: theme.warning ?? "#ef4444",
      softBg:
        mode === "dark"
          ? "rgba(239,68,68,0.14)"
          : "rgba(239,68,68,0.10)",
      solidBg: theme.warning ?? "#ef4444",
      border:
        mode === "dark"
          ? "rgba(239,68,68,0.22)"
          : "rgba(239,68,68,0.18)",
    },
    info: {
      color: "#06b6d4",
      softBg:
        mode === "dark"
          ? "rgba(6,182,212,0.14)"
          : "rgba(6,182,212,0.10)",
      solidBg: "#06b6d4",
      border:
        mode === "dark"
          ? "rgba(6,182,212,0.22)"
          : "rgba(6,182,212,0.18)",
    },
    neutral: {
      color: theme.subText,
      softBg:
        mode === "dark"
          ? "rgba(148,163,184,0.14)"
          : "rgba(148,163,184,0.12)",
      solidBg: "#64748b",
      border:
        mode === "dark"
          ? "rgba(148,163,184,0.22)"
          : "rgba(148,163,184,0.18)",
    },
  };

  const selected = tones[tone];

  if (variant === "solid") {
    return {
      background: selected.solidBg,
      color: "#ffffff",
      border: `1px solid ${selected.solidBg}`,
      dotColor: "#ffffff",
    };
  }

  if (variant === "outline") {
    return {
      background: "transparent",
      color: selected.color,
      border: `1px solid ${selected.border}`,
      dotColor: selected.color,
    };
  }

  return {
    background: selected.softBg,
    color: selected.color,
    border: `1px solid ${selected.border}`,
    dotColor: selected.color,
  };
}

export default function Badge({
  mode,
  children,
  tone = "default",
  variant = "soft",
  icon,
  showDot = false,
  compact = false,
  rounded = true,
}: BadgeProps) {
  const theme = getTheme(mode);
  const styles = getToneStyles(tone, variant, mode, theme);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: compact ? 6 : 8,
        padding: compact ? "5px 9px" : "7px 11px",
        borderRadius: rounded ? 999 : 10,
        background: styles.background,
        color: styles.color,
        border: styles.border,
        fontSize: compact ? 11.5 : 12.5,
        fontWeight: 700,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {showDot && (
        <span
          style={{
            width: compact ? 6 : 7,
            height: compact ? 6 : 7,
            borderRadius: "50%",
            background: styles.dotColor,
            flexShrink: 0,
          }}
        />
      )}

      {icon && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      )}

      <span>{children}</span>
    </span>
  );
}