// src/components/analytics/charts/shared/ChartEmptyState.tsx

import type { CSSProperties, ReactNode } from "react";

export interface ChartEmptyStateProps {
  title?: string;
  message?: string;
  description?: string;
  height?: number | string;
  minHeight?: number | string;
  icon?: ReactNode;
  action?: ReactNode;
  borderStyle?: "dashed" | "solid";
  backgroundColor?: string;
  borderColor?: string;
  titleColor?: string;
  messageColor?: string;
  className?: string;
  style?: CSSProperties;
}

function resolveSize(value: number | string | undefined, fallback: string): string {
  if (typeof value === "number") {
    return `${value}px`;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return fallback;
}

function DefaultIcon() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 56,
        height: 56,
        borderRadius: 999,
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 14px",
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 19H20"
          stroke="#94A3B8"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M7 15L10 12L13 14L17 9"
          stroke="#94A3B8"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="15" r="1.2" fill="#94A3B8" />
        <circle cx="10" cy="12" r="1.2" fill="#94A3B8" />
        <circle cx="13" cy="14" r="1.2" fill="#94A3B8" />
        <circle cx="17" cy="9" r="1.2" fill="#94A3B8" />
      </svg>
    </div>
  );
}

export default function ChartEmptyState({
  title = "No data found",
  message = "No chart data available for the selected filters.",
  description,
  height = 320,
  minHeight,
  icon,
  action,
  borderStyle = "dashed",
  backgroundColor = "#FFFFFF",
  borderColor = "#CBD5E1",
  titleColor = "#0F172A",
  messageColor = "#64748B",
  className,
  style,
}: ChartEmptyStateProps) {
  const resolvedHeight = resolveSize(height, "320px");
  const resolvedMinHeight =
    minHeight !== undefined ? resolveSize(minHeight, "220px") : "220px";

  return (
    <div
      className={className}
      style={{
        height: resolvedHeight,
        minHeight: resolvedMinHeight,
        borderRadius: 16,
        border: `1px ${borderStyle} ${borderColor}`,
        background: backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 24,
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: "100%",
        }}
      >
        <div style={{ marginBottom: 4 }}>
          {icon ?? <DefaultIcon />}
        </div>

        <h4
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 700,
            color: titleColor,
            lineHeight: 1.3,
          }}
        >
          {title}
        </h4>

        <p
          style={{
            margin: "8px 0 0",
            fontSize: 14,
            lineHeight: 1.6,
            color: messageColor,
          }}
        >
          {message}
        </p>

        {description ? (
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 13,
              lineHeight: 1.55,
              color: "#94A3B8",
            }}
          >
            {description}
          </p>
        ) : null}

        {action ? (
          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {action}
          </div>
        ) : null}
      </div>
    </div>
  );
}