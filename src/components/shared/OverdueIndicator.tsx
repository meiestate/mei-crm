import React, { useMemo } from "react";
import { getTheme } from "../../theme";

type ThemeMode = "light" | "dark";
type IndicatorSize = "sm" | "md" | "lg";

export interface OverdueIndicatorProps {
  dueDate?: string | Date | null;
  overdueDays?: number | null;
  mode?: ThemeMode;
  size?: IndicatorSize;
  className?: string;
  showIcon?: boolean;
  showDot?: boolean;
  compact?: boolean;
  label?: string;
}

const DAY_MS = 1000 * 60 * 60 * 24;

const parseDate = (value?: string | Date | null): Date | null => {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getCalendarDayDiff = (date: Date): number => {
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  return Math.floor((today.getTime() - target.getTime()) / DAY_MS);
};

const OverdueIndicator: React.FC<OverdueIndicatorProps> = ({
  dueDate,
  overdueDays,
  mode = "light",
  size = "md",
  className,
  showIcon = true,
  showDot = true,
  compact = false,
  label,
}) => {
  const theme = useMemo(() => getTheme(mode), [mode]);

  const resolvedDate = useMemo(() => parseDate(dueDate), [dueDate]);

  const diffDays = useMemo(() => {
    if (typeof overdueDays === "number") return overdueDays;
    if (!resolvedDate) return null;
    return getCalendarDayDiff(resolvedDate);
  }, [overdueDays, resolvedDate]);

  const state = useMemo(() => {
    if (label) {
      return {
        text: label,
        kind: "custom" as const,
      };
    }

    if (diffDays === null) {
      return {
        text: "No due date",
        kind: "neutral" as const,
      };
    }

    if (diffDays < 0) {
      const daysLeft = Math.abs(diffDays);

      if (daysLeft === 1) {
        return {
          text: "Due tomorrow",
          kind: "upcoming" as const,
        };
      }

      return {
        text: `Due in ${daysLeft} days`,
        kind: "upcoming" as const,
      };
    }

    if (diffDays === 0) {
      return {
        text: "Due today",
        kind: "today" as const,
      };
    }

    if (diffDays === 1) {
      return {
        text: "1 day overdue",
        kind: "overdue" as const,
      };
    }

    return {
      text: `${diffDays} days overdue`,
      kind: "overdue" as const,
    };
  }, [diffDays, label]);

  const palette = useMemo(() => {
    switch (state.kind) {
      case "overdue":
        return {
          text: "#dc2626",
          bg: mode === "dark" ? "rgba(220,38,38,0.18)" : "rgba(220,38,38,0.10)",
          border:
            mode === "dark" ? "rgba(248,113,113,0.32)" : "rgba(220,38,38,0.18)",
          dot: "#dc2626",
          icon: "⚠",
        };

      case "today":
        return {
          text: "#d97706",
          bg: mode === "dark" ? "rgba(217,119,6,0.18)" : "rgba(217,119,6,0.10)",
          border:
            mode === "dark" ? "rgba(251,191,36,0.30)" : "rgba(217,119,6,0.18)",
          dot: "#d97706",
          icon: "⏰",
        };

      case "upcoming":
        return {
          text: "#2563eb",
          bg: mode === "dark" ? "rgba(37,99,235,0.18)" : "rgba(37,99,235,0.10)",
          border:
            mode === "dark" ? "rgba(96,165,250,0.30)" : "rgba(37,99,235,0.18)",
          dot: "#2563eb",
          icon: "📅",
        };

      case "custom":
        return {
          text: theme.text,
          bg:
            mode === "dark"
              ? "rgba(148,163,184,0.14)"
              : "rgba(148,163,184,0.10)",
          border:
            mode === "dark"
              ? "rgba(148,163,184,0.28)"
              : "rgba(148,163,184,0.18)",
          dot: theme.primary,
          icon: "•",
        };

      case "neutral":
      default:
        return {
          text: theme.subText,
          bg:
            mode === "dark"
              ? "rgba(148,163,184,0.14)"
              : "rgba(148,163,184,0.10)",
          border:
            mode === "dark"
              ? "rgba(148,163,184,0.28)"
              : "rgba(148,163,184,0.18)",
          dot: theme.subText,
          icon: "•",
        };
    }
  }, [mode, state.kind, theme]);

  const sizing = useMemo(() => {
    switch (size) {
      case "sm":
        return {
          fontSize: 11,
          padding: compact ? "4px 8px" : "5px 9px",
          gap: 6,
          dot: 7,
        };
      case "lg":
        return {
          fontSize: 13,
          padding: compact ? "7px 11px" : "8px 12px",
          gap: 8,
          dot: 9,
        };
      case "md":
      default:
        return {
          fontSize: 12,
          padding: compact ? "6px 10px" : "7px 11px",
          gap: 7,
          dot: 8,
        };
    }
  }, [compact, size]);

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: sizing.gap,
        padding: sizing.padding,
        borderRadius: 999,
        border: `1px solid ${palette.border}`,
        background: palette.bg,
        color: palette.text,
        fontSize: sizing.fontSize,
        fontWeight: 700,
        lineHeight: 1,
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
      title={state.text}
    >
      {showDot ? (
        <span
          aria-hidden="true"
          style={{
            width: sizing.dot,
            height: sizing.dot,
            minWidth: sizing.dot,
            borderRadius: "50%",
            background: palette.dot,
            boxShadow: `0 0 0 3px ${palette.dot}18`,
          }}
        />
      ) : null}

      {showIcon ? (
        <span
          aria-hidden="true"
          style={{
            fontSize: size === "lg" ? 14 : 12,
            lineHeight: 1,
            transform: "translateY(-0.5px)",
          }}
        >
          {palette.icon}
        </span>
      ) : null}

      <span>{state.text}</span>
    </span>
  );
};

export default OverdueIndicator;