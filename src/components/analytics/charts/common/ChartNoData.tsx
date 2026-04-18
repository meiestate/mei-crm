// src/components/analytics/charts/shared/ChartNoData.tsx

import type { CSSProperties, ReactNode } from "react";

export interface ChartNoDataProps {
  title?: string;
  message?: string;
  description?: string;
  height?: number | string;
  minHeight?: number | string;
  action?: ReactNode;
  icon?: ReactNode;
  compact?: boolean;
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

function NoDataIcon() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 58,
        height: 58,
        borderRadius: 999,
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 19H19"
          stroke="#94A3B8"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M8 16V12"
          stroke="#94A3B8"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M12 16V9"
          stroke="#94A3B8"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M16 16V6"
          stroke="#94A3B8"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function ChartNoData({
  title = "No chart data",
  message = "There is nothing to display for the selected time range or filters.",
  description,
  height = 320,
  minHeight = 220,
  action,
  icon,
  compact = false,
  className,
  style,
}: ChartNoDataProps) {
  const resolvedHeight = resolveSize(height, "320px");
  const resolvedMinHeight = resolveSize(minHeight, "220px");

  if (compact) {
    return (
      <div
        className={className}
        style={{
          minHeight: resolvedMinHeight,
          borderRadius: 14,
          border: "1px dashed #CBD5E1",
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: 18,
          ...style,
        }}
      >
        {icon ?? <NoDataIcon />}

        <div style={{ minWidth: 0 }}>
          <h4
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#0F172A",
              lineHeight: 1.3,
            }}
          >
            {title}
          </h4>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              lineHeight: 1.55,
              color: "#64748B",
            }}
          >
            {message}
          </p>

          {description ? (
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 12,
                lineHeight: 1.5,
                color: "#94A3B8",
              }}
            >
              {description}
            </p>
          ) : null}

          {action ? <div style={{ marginTop: 12 }}>{action}</div> : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        height: resolvedHeight,
        minHeight: resolvedMinHeight,
        borderRadius: 16,
        border: "1px dashed #CBD5E1",
        background: "#FFFFFF",
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
          maxWidth: 440,
          width: "100%",
        }}
      >
        <div
          style={{
            marginBottom: 14,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {icon ?? <NoDataIcon />}
        </div>

        <h4
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#0F172A",
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
            color: "#64748B",
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