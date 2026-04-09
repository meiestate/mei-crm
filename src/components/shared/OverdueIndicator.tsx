import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type OverdueIndicatorProps = {
  mode: ThemeMode;
  dueDate: string | number | Date | null | undefined;
  label?: string;
  showIcon?: boolean;
  compact?: boolean;
  fallback?: string;
  fontSize?: number | string;
  fontWeight?: number;
};

function parseDateValue(
  value: string | number | Date | null | undefined
): Date | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getDayDiff(targetDate: Date) {
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const target = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export default function OverdueIndicator({
  mode,
  dueDate,
  label,
  showIcon = true,
  compact = false,
  fallback = "—",
  fontSize = 12.5,
  fontWeight = 700,
}: OverdueIndicatorProps) {
  const theme = getTheme(mode);
  const parsedDate = parseDateValue(dueDate);

  if (!parsedDate) {
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

  const dayDiff = getDayDiff(parsedDate);

  let text = label ?? "";
  let color = theme.text;
  let bg =
    mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(15,23,42,0.06)";
  let border =
    mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(15,23,42,0.08)";
  let icon = "•";

  if (dayDiff < 0) {
    const overdueDays = Math.abs(dayDiff);
    text =
      label ??
      (overdueDays === 1 ? "1 day overdue" : `${overdueDays} days overdue`);
    color = theme.warning ?? "#ef4444";
    bg =
      mode === "dark"
        ? "rgba(239,68,68,0.14)"
        : "rgba(239,68,68,0.10)";
    border =
      mode === "dark"
        ? "rgba(239,68,68,0.20)"
        : "rgba(239,68,68,0.18)";
    icon = "⚠";
  } else if (dayDiff === 0) {
    text = label ?? "Due today";
    color = "#f59e0b";
    bg =
      mode === "dark"
        ? "rgba(245,158,11,0.14)"
        : "rgba(245,158,11,0.10)";
    border =
      mode === "dark"
        ? "rgba(245,158,11,0.20)"
        : "rgba(245,158,11,0.18)";
    icon = "●";
  } else if (dayDiff === 1) {
    text = label ?? "Due tomorrow";
    color = theme.primary;
    bg =
      mode === "dark"
        ? "rgba(59,130,246,0.14)"
        : "rgba(37,99,235,0.10)";
    border =
      mode === "dark"
        ? "rgba(59,130,246,0.20)"
        : "rgba(37,99,235,0.18)";
    icon = "→";
  } else {
    text = label ?? `Due in ${dayDiff} days`;
    color = theme.success ?? "#22c55e";
    bg =
      mode === "dark"
        ? "rgba(34,197,94,0.14)"
        : "rgba(34,197,94,0.10)";
    border =
      mode === "dark"
        ? "rgba(34,197,94,0.20)"
        : "rgba(34,197,94,0.18)";
    icon = "✓";
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? 6 : 8,
        padding: compact ? "5px 9px" : "7px 11px",
        borderRadius: 999,
        background: bg,
        color,
        border: `1px solid ${border}`,
        fontSize,
        fontWeight,
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
      title={parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}
    >
      {showIcon && (
        <span
          style={{
            fontSize: compact ? 11 : 12,
            lineHeight: 1,
          }}
        >
          {icon}
        </span>
      )}
      <span>{text}</span>
    </span>
  );
}