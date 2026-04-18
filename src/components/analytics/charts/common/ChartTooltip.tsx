// src/components/analytics/charts/shared/ChartTooltip.tsx

import type { CSSProperties, ReactNode } from "react";

export interface ChartTooltipItem {
  key: string;
  label: string;
  value: string | number;
  color?: string;
  prefix?: string;
  suffix?: string;
  hidden?: boolean;
}

export interface ChartTooltipProps {
  title?: string;
  items?: ChartTooltipItem[];
  footer?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function formatValue(
  value: string | number,
  prefix?: string,
  suffix?: string
): string {
  if (typeof value === "number") {
    return `${prefix ?? ""}${new Intl.NumberFormat("en-IN").format(value)}${suffix ?? ""}`;
  }

  return `${prefix ?? ""}${value}${suffix ?? ""}`;
}

export default function ChartTooltip({
  title,
  items = [],
  footer,
  className,
  style,
}: ChartTooltipProps) {
  const visibleItems = items.filter((item) => !item.hidden);

  if (!title && visibleItems.length === 0 && !footer) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        background: "#0F172A",
        color: "#FFFFFF",
        border: "1px solid #1E293B",
        borderRadius: 12,
        padding: "12px 14px",
        boxShadow: "0 12px 24px rgba(15, 23, 42, 0.18)",
        minWidth: 180,
        maxWidth: 280,
        ...style,
      }}
    >
      {title ? (
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            marginBottom: visibleItems.length > 0 || footer ? 8 : 0,
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
      ) : null}

      {visibleItems.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: 6,
          }}
        >
          {visibleItems.map((item) => (
            <div
              key={item.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                fontSize: 12,
                lineHeight: 1.4,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  minWidth: 0,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: item.color ?? "#94A3B8",
                    flexShrink: 0,
                  }}
                />

                <span
                  style={{
                    color: "#E2E8F0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.label}
                </span>
              </div>

              <span
                style={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                  textAlign: "right",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {formatValue(item.value, item.prefix, item.suffix)}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {footer ? (
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid #1E293B",
            fontSize: 12,
            lineHeight: 1.5,
            color: "#CBD5E1",
          }}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}