// src/components/analytics/charts/shared/ChartLegend.tsx

import type { CSSProperties, ReactNode } from "react";

export interface ChartLegendItem {
  key: string;
  label: string;
  color?: string;
  value?: string | number;
  icon?: ReactNode;
  hidden?: boolean;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
  align?: "left" | "center" | "right";
  direction?: "row" | "column";
  size?: "sm" | "md";
  gap?: number;
  wrap?: boolean;
  muted?: boolean;
  className?: string;
  style?: CSSProperties;
  onItemClick?: (item: ChartLegendItem) => void;
}

function getJustifyContent(align: "left" | "center" | "right"): CSSProperties["justifyContent"] {
  if (align === "center") {
    return "center";
  }

  if (align === "right") {
    return "flex-end";
  }

  return "flex-start";
}

function getDotSize(size: "sm" | "md"): number {
  return size === "sm" ? 10 : 12;
}

function getFontSize(size: "sm" | "md"): number {
  return size === "sm" ? 12 : 13;
}

export default function ChartLegend({
  items,
  align = "left",
  direction = "row",
  size = "md",
  gap = 12,
  wrap = true,
  muted = false,
  className,
  style,
  onItemClick,
}: ChartLegendProps) {
  const visibleItems = items.filter((item) => !item.hidden);

  if (!visibleItems.length) {
    return null;
  }

  const dotSize = getDotSize(size);
  const fontSize = getFontSize(size);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: direction,
        alignItems: direction === "column" ? "stretch" : "center",
        justifyContent: getJustifyContent(align),
        gap,
        flexWrap: direction === "row" && wrap ? "wrap" : "nowrap",
        ...style,
      }}
    >
      {visibleItems.map((item) => {
        const clickable = typeof onItemClick === "function";
        const textColor = muted ? "#64748B" : "#334155";

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onItemClick?.(item)}
            disabled={!clickable}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              margin: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 8,
              cursor: clickable ? "pointer" : "default",
              opacity: item.hidden ? 0.5 : 1,
            }}
          >
            {item.icon ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: dotSize,
                  height: dotSize,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
            ) : (
              <span
                aria-hidden="true"
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: 999,
                  background: item.color ?? "#94A3B8",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            )}

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
                fontSize,
                lineHeight: 1.4,
                color: textColor,
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              <span>{item.label}</span>

              {item.value !== undefined && item.value !== null ? (
                <span
                  style={{
                    color: muted ? "#94A3B8" : "#64748B",
                    fontWeight: 700,
                  }}
                >
                  {item.value}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}