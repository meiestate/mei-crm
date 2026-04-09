import type { CSSProperties, ReactNode } from "react";

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  compact?: boolean;
  bordered?: boolean;
  fullHeight?: boolean;
  minHeight?: number | string;
  align?: "left" | "center";
  background?: string;
  style?: CSSProperties;
};

function DefaultEmptyIcon() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="12"
        y="14"
        width="48"
        height="44"
        rx="14"
        fill="#F8FAFC"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
      <path
        d="M24 30H48"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 38H42"
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="10" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" />
      <path
        d="M50 46V54"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M46 50H54"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function EmptyState({
  title = "No data found",
  description = "There is nothing to show here right now. Try adjusting filters or adding a new record.",
  icon,
  action,
  secondaryAction,
  compact = false,
  bordered = true,
  fullHeight = false,
  minHeight = 260,
  align = "center",
  background = "#ffffff",
  style,
}: EmptyStateProps) {
  const isCenter = align === "center";

  return (
    <div
      style={{
        width: "100%",
        minHeight: fullHeight ? "100%" : minHeight,
        background,
        border: bordered ? "1px solid #E2E8F0" : "none",
        borderRadius: 20,
        boxShadow: bordered ? "0 10px 30px rgba(15, 23, 42, 0.06)" : "none",
        padding: compact ? 24 : 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: compact ? 420 : 560,
          display: "flex",
          flexDirection: "column",
          alignItems: isCenter ? "center" : "flex-start",
          textAlign: isCenter ? "center" : "left",
        }}
      >
        <div
          style={{
            width: compact ? 72 : 88,
            height: compact ? 72 : 88,
            borderRadius: 24,
            background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
            marginBottom: 18,
            flexShrink: 0,
          }}
        >
          {icon || <DefaultEmptyIcon />}
        </div>

        <div
          style={{
            fontSize: compact ? 20 : 24,
            lineHeight: 1.25,
            fontWeight: 700,
            color: "#0F172A",
            letterSpacing: -0.2,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 10,
            maxWidth: 480,
            fontSize: compact ? 14 : 15,
            lineHeight: 1.7,
            color: "#64748B",
          }}
        >
          {description}
        </div>

        {(action || secondaryAction) && (
          <div
            style={{
              marginTop: 22,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: isCenter ? "center" : "flex-start",
            }}
          >
            {action}
            {secondaryAction}
          </div>
        )}
      </div>
    </div>
  );
}