// src/components/analytics/charts/shared/ChartLoadingSkeleton.tsx

import type { CSSProperties } from "react";

export interface ChartLoadingSkeletonProps {
  height?: number | string;
  barCount?: number;
  title?: boolean;
  subtitle?: boolean;
  footer?: boolean;
  rounded?: number;
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

function randomHeights(count: number): string[] {
  const presets = ["42%", "58%", "72%", "48%", "80%", "66%", "54%", "76%"];
  return Array.from({ length: count }, (_, index) => presets[index % presets.length]);
}

function shimmerStyle(radius: number): CSSProperties {
  return {
    borderRadius: radius,
    background:
      "linear-gradient(90deg, #F1F5F9 0%, #E2E8F0 25%, #F8FAFC 50%, #E2E8F0 75%, #F1F5F9 100%)",
    backgroundSize: "200% 100%",
    animation: "chart-skeleton-shimmer 1.4s ease-in-out infinite",
  };
}

export default function ChartLoadingSkeleton({
  height = 320,
  barCount = 7,
  title = true,
  subtitle = true,
  footer = false,
  rounded = 14,
  className,
  style,
}: ChartLoadingSkeletonProps) {
  const resolvedHeight = resolveSize(height, "320px");
  const bars = randomHeights(Math.max(3, barCount));

  return (
    <div
      className={className}
      aria-busy="true"
      aria-live="polite"
      style={{
        width: "100%",
        ...style,
      }}
    >
      <style>
        {`
          @keyframes chart-skeleton-shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}
      </style>

      {(title || subtitle) ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 18,
          }}
        >
          {title ? (
            <div
              style={{
                width: "180px",
                height: 18,
                ...shimmerStyle(10),
              }}
            />
          ) : null}

          {subtitle ? (
            <div
              style={{
                width: "320px",
                maxWidth: "100%",
                height: 12,
                ...shimmerStyle(10),
              }}
            />
          ) : null}
        </div>
      ) : null}

      <div
        style={{
          width: "100%",
          height: resolvedHeight,
          minHeight: 220,
          borderRadius: rounded,
          border: "1px solid #E2E8F0",
          background: "#FFFFFF",
          padding: 18,
          display: "grid",
          gridTemplateColumns: "44px 1fr",
          gap: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "stretch",
            paddingTop: 8,
            paddingBottom: 18,
          }}
        >
          {[0, 1, 2, 3, 4].map((tick) => (
            <div
              key={tick}
              style={{
                width: "28px",
                height: 10,
                ...shimmerStyle(8),
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr 22px",
            gap: 12,
            minWidth: 0,
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: rounded - 4,
              background: "#FCFDFE",
              border: "1px solid #F1F5F9",
              padding: "14px 12px 8px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "14px 12px 8px 12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                pointerEvents: "none",
              }}
            >
              {[0, 1, 2, 3].map((line) => (
                <div
                  key={line}
                  style={{
                    width: "100%",
                    height: 1,
                    background: "#EEF2F7",
                  }}
                />
              ))}
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 1,
                height: "100%",
                display: "flex",
                alignItems: "end",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              {bars.map((barHeight, index) => (
                <div
                  key={`${barHeight}-${index}`}
                  style={{
                    flex: 1,
                    minWidth: 12,
                    height: barHeight,
                    ...shimmerStyle(10),
                  }}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              padding: "0 2px",
            }}
          >
            {bars.map((_, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: 10,
                  maxWidth: 38,
                  ...shimmerStyle(8),
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {footer ? (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 90,
              height: 12,
              ...shimmerStyle(10),
            }}
          />
          <div
            style={{
              width: 120,
              height: 12,
              ...shimmerStyle(10),
            }}
          />
          <div
            style={{
              width: 72,
              height: 12,
              ...shimmerStyle(10),
            }}
          />
        </div>
      ) : null}
    </div>
  );
}