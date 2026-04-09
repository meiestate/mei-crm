import React from "react";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Site Visit"
  | "Negotiation"
  | "Won"
  | "Lost";

type LeadStatusBadgeProps = {
  status: LeadStatus | string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

export default function LeadStatusBadge({
  status,
  size = "md",
  fullWidth = false,
}: LeadStatusBadgeProps) {
  const styles = getStatusStyles(status);
  const sizeStyles = getSizeStyles(size);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: fullWidth ? "100%" : "fit-content",
        minWidth: fullWidth ? undefined : 96,
        padding: sizeStyles.padding,
        borderRadius: 999,
        border: `1px solid ${styles.border}`,
        background: styles.background,
        color: styles.color,
        fontSize: sizeStyles.fontSize,
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
        boxSizing: "border-box",
      }}
      title={`Lead Status: ${status}`}
    >
      <span
        style={{
          width: sizeStyles.dotSize,
          height: sizeStyles.dotSize,
          borderRadius: "50%",
          background: styles.dot,
          flexShrink: 0,
          boxShadow: `0 0 0 2px ${styles.dotRing}`,
        }}
      />
      <span>{status}</span>
    </span>
  );
}

function getStatusStyles(status: string): {
  background: string;
  color: string;
  border: string;
  dot: string;
  dotRing: string;
} {
  switch (status) {
    case "New":
      return {
        background: "#eff6ff",
        color: "#1d4ed8",
        border: "#bfdbfe",
        dot: "#2563eb",
        dotRing: "rgba(37, 99, 235, 0.16)",
      };

    case "Contacted":
      return {
        background: "#f5f3ff",
        color: "#7c3aed",
        border: "#ddd6fe",
        dot: "#8b5cf6",
        dotRing: "rgba(139, 92, 246, 0.16)",
      };

    case "Qualified":
      return {
        background: "#ecfdf5",
        color: "#15803d",
        border: "#bbf7d0",
        dot: "#16a34a",
        dotRing: "rgba(22, 163, 74, 0.16)",
      };

    case "Site Visit":
      return {
        background: "#fff7ed",
        color: "#c2410c",
        border: "#fdba74",
        dot: "#ea580c",
        dotRing: "rgba(234, 88, 12, 0.16)",
      };

    case "Negotiation":
      return {
        background: "#fffbeb",
        color: "#a16207",
        border: "#fde68a",
        dot: "#ca8a04",
        dotRing: "rgba(202, 138, 4, 0.16)",
      };

    case "Won":
      return {
        background: "#dcfce7",
        color: "#166534",
        border: "#86efac",
        dot: "#16a34a",
        dotRing: "rgba(22, 163, 74, 0.18)",
      };

    case "Lost":
      return {
        background: "#fef2f2",
        color: "#b91c1c",
        border: "#fecaca",
        dot: "#dc2626",
        dotRing: "rgba(220, 38, 38, 0.16)",
      };

    default:
      return {
        background: "#f8fafc",
        color: "#475569",
        border: "#cbd5e1",
        dot: "#64748b",
        dotRing: "rgba(100, 116, 139, 0.14)",
      };
  }
}

function getSizeStyles(size: "sm" | "md" | "lg") {
  switch (size) {
    case "sm":
      return {
        padding: "6px 10px",
        fontSize: 12,
        dotSize: 7,
      };

    case "lg":
      return {
        padding: "10px 16px",
        fontSize: 14,
        dotSize: 10,
      };

    case "md":
    default:
      return {
        padding: "8px 12px",
        fontSize: 13,
        dotSize: 8,
      };
  }
}