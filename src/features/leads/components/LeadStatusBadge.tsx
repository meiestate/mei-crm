// src/features/leads/components/LeadStatusBadge.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { LeadStatus } from "../api/leadsApi";

type LeadStatusBadgeProps = {
  status?: LeadStatus | string;
  mode?: ThemeMode;
  compact?: boolean;
};

function normalizeStatus(status?: string): string {
  return (status ?? "").trim().toLowerCase();
}

function getStatusMeta(status?: string) {
  const value = normalizeStatus(status);

  if (value === "new") {
    return {
      label: "New",
      bg: "rgba(99, 102, 241, 0.12)",
      color: "#4f46e5",
      border: "rgba(99, 102, 241, 0.24)",
      dot: "#6366f1",
    };
  }

  if (value === "open") {
    return {
      label: "Open",
      bg: "rgba(59, 130, 246, 0.12)",
      color: "#2563eb",
      border: "rgba(59, 130, 246, 0.24)",
      dot: "#3b82f6",
    };
  }

  if (value === "contacted") {
    return {
      label: "Contacted",
      bg: "rgba(14, 165, 233, 0.12)",
      color: "#0284c7",
      border: "rgba(14, 165, 233, 0.24)",
      dot: "#0ea5e9",
    };
  }

  if (value === "qualified") {
    return {
      label: "Qualified",
      bg: "rgba(168, 85, 247, 0.12)",
      color: "#7c3aed",
      border: "rgba(168, 85, 247, 0.24)",
      dot: "#8b5cf6",
    };
  }

  if (value === "proposal") {
    return {
      label: "Proposal",
      bg: "rgba(217, 70, 239, 0.12)",
      color: "#c026d3",
      border: "rgba(217, 70, 239, 0.24)",
      dot: "#d946ef",
    };
  }

  if (value === "negotiation") {
    return {
      label: "Negotiation",
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#d97706",
      border: "rgba(245, 158, 11, 0.24)",
      dot: "#f59e0b",
    };
  }

  if (value === "hot") {
    return {
      label: "Hot",
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#dc2626",
      border: "rgba(239, 68, 68, 0.24)",
      dot: "#ef4444",
    };
  }

  if (value === "warm") {
    return {
      label: "Warm",
      bg: "rgba(251, 146, 60, 0.12)",
      color: "#ea580c",
      border: "rgba(251, 146, 60, 0.24)",
      dot: "#fb923c",
    };
  }

  if (value === "cold") {
    return {
      label: "Cold",
      bg: "rgba(56, 189, 248, 0.12)",
      color: "#0284c7",
      border: "rgba(56, 189, 248, 0.24)",
      dot: "#38bdf8",
    };
  }

  if (value === "won") {
    return {
      label: "Won",
      bg: "rgba(34, 197, 94, 0.12)",
      color: "#16a34a",
      border: "rgba(34, 197, 94, 0.24)",
      dot: "#22c55e",
    };
  }

  if (value === "lost") {
    return {
      label: "Lost",
      bg: "rgba(127, 29, 29, 0.12)",
      color: "#b91c1c",
      border: "rgba(185, 28, 28, 0.24)",
      dot: "#dc2626",
    };
  }

  return {
    label: status?.trim() || "Unknown",
    bg: "rgba(100, 116, 139, 0.12)",
    color: "#475569",
    border: "rgba(100, 116, 139, 0.24)",
    dot: "#64748b",
  };
}

export default function LeadStatusBadge({
  status,
  mode = "light",
  compact = false,
}: LeadStatusBadgeProps) {
  const theme = getTheme(mode);
  const meta = getStatusMeta(status);

  return (
    <span
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
      title={meta.label}
    >
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
      <span>{meta.label}</span>
    </span>
  );
}