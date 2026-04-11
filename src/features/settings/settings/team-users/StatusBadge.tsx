// src/features/settings/settings/team-users/StatusBadge.tsx

import { getTheme, type ThemeMode } from "../../../../theme";

type StatusBadgeProps = {
  status?: string;
  mode?: ThemeMode;
  compact?: boolean;
  showIcon?: boolean;
};

function normalizeStatus(status?: string): string {
  return (status ?? "").trim().toLowerCase();
}

function toLabel(status?: string): string {
  const value = (status ?? "").trim();
  if (!value) return "Unknown";

  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getStatusMeta(status?: string) {
  const value = normalizeStatus(status);

  if (value === "active") {
    return {
      label: "Active",
      icon: "✅",
      bg: "rgba(34, 197, 94, 0.12)",
      color: "#16a34a",
      border: "rgba(34, 197, 94, 0.24)",
      dot: "#22c55e",
    };
  }

  if (value === "invited") {
    return {
      label: "Invited",
      icon: "✉️",
      bg: "rgba(59, 130, 246, 0.12)",
      color: "#2563eb",
      border: "rgba(59, 130, 246, 0.24)",
      dot: "#3b82f6",
    };
  }

  if (value === "inactive") {
    return {
      label: "Inactive",
      icon: "⏸️",
      bg: "rgba(100, 116, 139, 0.12)",
      color: "#475569",
      border: "rgba(100, 116, 139, 0.24)",
      dot: "#64748b",
    };
  }

  if (value === "suspended") {
    return {
      label: "Suspended",
      icon: "🚫",
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#dc2626",
      border: "rgba(239, 68, 68, 0.24)",
      dot: "#ef4444",
    };
  }

  if (value === "pending") {
    return {
      label: "Pending",
      icon: "⏳",
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#d97706",
      border: "rgba(245, 158, 11, 0.24)",
      dot: "#f59e0b",
    };
  }

  return {
    label: toLabel(status),
    icon: "🏷️",
    bg: "rgba(100, 116, 139, 0.12)",
    color: "#475569",
    border: "rgba(100, 116, 139, 0.24)",
    dot: "#64748b",
  };
}

export default function StatusBadge({
  status,
  mode = "light",
  compact = false,
  showIcon = false,
}: StatusBadgeProps) {
  const theme = getTheme(mode);
  const meta = getStatusMeta(status);

  return (
    <span
      title={meta.label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? 6 : 8,
        borderRadius: 999,
        padding: compact ? "4px 8px" : "6px 12px",
        background: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.border}`,
        fontSize: compact ? 11 : 12,
        fontWeight: 800,
        lineHeight: 1,
        whiteSpace: "nowrap",
        boxShadow:
          mode === "dark"
            ? "inset 0 0 0 1px rgba(255,255,255,0.02)"
            : "none",
      }}
    >
      {showIcon ? (
        <span
          style={{
            fontSize: compact ? 12 : 13,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {meta.icon}
        </span>
      ) : (
        <span
          style={{
            width: compact ? 7 : 8,
            height: compact ? 7 : 8,
            borderRadius: "50%",
            background: meta.dot,
            display: "inline-block",
            flexShrink: 0,
            boxShadow:
              mode === "dark"
                ? `0 0 0 2px ${theme.cardBg}`
                : "none",
          }}
        />
      )}

      <span>{meta.label}</span>
    </span>
  );
}