import type { CSSProperties } from "react";

export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";

type TaskStatusBadgeProps = {
  status: TaskStatus;
  size?: "sm" | "md" | "lg";
  variant?: "soft" | "solid" | "outline";
  showDot?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
};

const STATUS_THEME: Record<
  TaskStatus,
  {
    label: string;
    dot: string;
    soft: CSSProperties;
    solid: CSSProperties;
    outline: CSSProperties;
  }
> = {
  Pending: {
    label: "Pending",
    dot: "#D97706",
    soft: {
      background: "#FFFBEB",
      color: "#B45309",
      border: "1px solid #FDE68A",
    },
    solid: {
      background: "#D97706",
      color: "#FFFFFF",
      border: "1px solid #D97706",
    },
    outline: {
      background: "#FFFFFF",
      color: "#B45309",
      border: "1px solid #F59E0B",
    },
  },
  "In Progress": {
    label: "In Progress",
    dot: "#2563EB",
    soft: {
      background: "#EFF6FF",
      color: "#1D4ED8",
      border: "1px solid #BFDBFE",
    },
    solid: {
      background: "#2563EB",
      color: "#FFFFFF",
      border: "1px solid #2563EB",
    },
    outline: {
      background: "#FFFFFF",
      color: "#1D4ED8",
      border: "1px solid #93C5FD",
    },
  },
  Completed: {
    label: "Completed",
    dot: "#059669",
    soft: {
      background: "#ECFDF5",
      color: "#047857",
      border: "1px solid #A7F3D0",
    },
    solid: {
      background: "#059669",
      color: "#FFFFFF",
      border: "1px solid #059669",
    },
    outline: {
      background: "#FFFFFF",
      color: "#047857",
      border: "1px solid #6EE7B7",
    },
  },
  Overdue: {
    label: "Overdue",
    dot: "#E11D48",
    soft: {
      background: "#FFF1F2",
      color: "#BE123C",
      border: "1px solid #FECDD3",
    },
    solid: {
      background: "#E11D48",
      color: "#FFFFFF",
      border: "1px solid #E11D48",
    },
    outline: {
      background: "#FFFFFF",
      color: "#BE123C",
      border: "1px solid #FDA4AF",
    },
  },
};

const SIZE_STYLES: Record<
  NonNullable<TaskStatusBadgeProps["size"]>,
  CSSProperties
> = {
  sm: {
    minHeight: 24,
    padding: "0 8px",
    fontSize: 11,
    borderRadius: 999,
    gap: 6,
  },
  md: {
    minHeight: 30,
    padding: "0 12px",
    fontSize: 12,
    borderRadius: 999,
    gap: 8,
  },
  lg: {
    minHeight: 36,
    padding: "0 14px",
    fontSize: 13,
    borderRadius: 999,
    gap: 8,
  },
};

export default function TaskStatusBadge({
  status,
  size = "md",
  variant = "soft",
  showDot = true,
  fullWidth = false,
  style,
}: TaskStatusBadgeProps) {
  const theme = STATUS_THEME[status];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <span
      style={{
        ...styles.base,
        ...sizeStyle,
        ...theme[variant],
        ...(fullWidth ? styles.fullWidth : {}),
        ...style,
      }}
      aria-label={`Task status ${theme.label}`}
      title={`Task Status: ${theme.label}`}
    >
      {showDot ? (
        <span
          style={{
            ...styles.dot,
            background: variant === "solid" ? "#FFFFFF" : theme.dot,
            ...(size === "sm"
              ? styles.dotSm
              : size === "lg"
              ? styles.dotLg
              : styles.dotMd),
          }}
        />
      ) : null}

      <span>{theme.label}</span>
    </span>
  );
}

const styles: Record<string, CSSProperties> = {
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    lineHeight: 1,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  },
  fullWidth: {
    width: "100%",
  },
  dot: {
    borderRadius: "50%",
    flexShrink: 0,
  },
  dotSm: {
    width: 6,
    height: 6,
  },
  dotMd: {
    width: 8,
    height: 8,
  },
  dotLg: {
    width: 9,
    height: 9,
  },
};