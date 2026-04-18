import { type CSSProperties } from "react";

export type AnalyticsLoadingStateVariant =
  | "card"
  | "panel"
  | "chart"
  | "kpi"
  | "table"
  | "grid";

export type AnalyticsLoadingStateTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type AnalyticsLoadingStateProps = {
  title?: string;
  subtitle?: string;
  variant?: AnalyticsLoadingStateVariant;
  tone?: AnalyticsLoadingStateTone;
  rows?: number;
  columns?: number;
  minHeight?: number | string;
  compact?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  animate?: boolean;
  style?: CSSProperties;
  className?: string;
};

type ToneStyles = {
  border: string;
  surface: string;
  soft: string;
  softAlt: string;
};

function getToneStyles(tone: AnalyticsLoadingStateTone): ToneStyles {
  switch (tone) {
    case "primary":
      return {
        border: "#e5e7eb",
        surface: "#ffffff",
        soft: "#f3f4f6",
        softAlt: "#e5e7eb",
      };
    case "success":
      return {
        border: "#a7f3d0",
        surface: "#ffffff",
        soft: "#ecfdf3",
        softAlt: "#d1fae5",
      };
    case "warning":
      return {
        border: "#fdba74",
        surface: "#ffffff",
        soft: "#fff7ed",
        softAlt: "#ffedd5",
      };
    case "danger":
      return {
        border: "#fecaca",
        surface: "#ffffff",
        soft: "#fef2f2",
        softAlt: "#fee2e2",
      };
    case "info":
      return {
        border: "#bfdbfe",
        surface: "#ffffff",
        soft: "#eff6ff",
        softAlt: "#dbeafe",
      };
    default:
      return {
        border: "#e5e7eb",
        surface: "#ffffff",
        soft: "#f9fafb",
        softAlt: "#f3f4f6",
      };
  }
}

function shimmerStyle(animate: boolean): CSSProperties {
  if (!animate) return {};

  return {
    backgroundImage:
      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)",
    backgroundSize: "220px 100%",
    animation: "analytics-loading-shimmer 1.4s linear infinite",
  };
}

function SkeletonBlock({
  width = "100%",
  height,
  radius = 12,
  background,
  animate,
}: {
  width?: number | string;
  height: number | string;
  radius?: number;
  background: string;
  animate: boolean;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background,
        ...shimmerStyle(animate),
      }}
    />
  );
}

function renderVariant(
  variant: AnalyticsLoadingStateVariant,
  toneStyles: ToneStyles,
  rows: number,
  columns: number,
  compact: boolean,
  animate: boolean
) {
  switch (variant) {
    case "kpi":
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: compact ? 10 : 12,
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              style={{
                borderRadius: 16,
                background: toneStyles.soft,
                border: `1px solid ${toneStyles.border}`,
                padding: compact ? 12 : 14,
                boxSizing: "border-box",
              }}
            >
              <SkeletonBlock
                width="48%"
                height={10}
                radius={8}
                background={toneStyles.softAlt}
                animate={animate}
              />
              <div style={{ height: 8 }} />
              <SkeletonBlock
                width="72%"
                height={22}
                radius={10}
                background={toneStyles.softAlt}
                animate={animate}
              />
            </div>
          ))}
        </div>
      );

    case "chart":
      return (
        <div style={{ display: "grid", gap: compact ? 10 : 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: compact ? 180 : 240,
              padding: compact ? "10px 4px 0" : "14px 8px 0",
              boxSizing: "border-box",
              borderRadius: 18,
              background: toneStyles.soft,
              border: `1px solid ${toneStyles.border}`,
            }}
          >
            {[42, 68, 54, 88, 62, 76, 94, 58].map((height, index) => (
              <SkeletonBlock
                key={index}
                width="100%"
                height={`${height}%`}
                radius={10}
                background={toneStyles.softAlt}
                animate={animate}
              />
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock
                key={index}
                width="100%"
                height={14}
                radius={8}
                background={toneStyles.softAlt}
                animate={animate}
              />
            ))}
          </div>
        </div>
      );

    case "table":
      return (
        <div
          style={{
            borderRadius: 18,
            overflow: "hidden",
            border: `1px solid ${toneStyles.border}`,
            background: toneStyles.soft,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: 10,
              padding: compact ? 12 : 14,
              borderBottom: `1px solid ${toneStyles.border}`,
              background: toneStyles.softAlt,
            }}
          >
            {Array.from({ length: columns }).map((_, index) => (
              <SkeletonBlock
                key={index}
                width="70%"
                height={12}
                radius={8}
                background="#ffffff"
                animate={animate}
              />
            ))}
          </div>

          <div style={{ display: "grid", gap: 0 }}>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  gap: 10,
                  padding: compact ? 12 : 14,
                  borderBottom:
                    rowIndex === rows - 1
                      ? "none"
                      : `1px solid ${toneStyles.border}`,
                  background: "#ffffff",
                }}
              >
                {Array.from({ length: columns }).map((__, columnIndex) => (
                  <SkeletonBlock
                    key={columnIndex}
                    width={columnIndex === 0 ? "82%" : "64%"}
                    height={12}
                    radius={8}
                    background={toneStyles.softAlt}
                    animate={animate}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      );

    case "grid":
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: compact ? 10 : 14,
          }}
        >
          {Array.from({ length: rows * columns }).map((_, index) => (
            <div
              key={index}
              style={{
                borderRadius: 18,
                border: `1px solid ${toneStyles.border}`,
                background: "#ffffff",
                padding: compact ? 12 : 14,
                boxSizing: "border-box",
                minHeight: compact ? 100 : 128,
              }}
            >
              <SkeletonBlock
                width="42%"
                height={10}
                radius={8}
                background={toneStyles.softAlt}
                animate={animate}
              />
              <div style={{ height: 10 }} />
              <SkeletonBlock
                width="78%"
                height={16}
                radius={10}
                background={toneStyles.softAlt}
                animate={animate}
              />
              <div style={{ height: 12 }} />
              <SkeletonBlock
                width="100%"
                height={52}
                radius={14}
                background={toneStyles.soft}
                animate={animate}
              />
            </div>
          ))}
        </div>
      );

    case "panel":
      return (
        <div style={{ display: "grid", gap: compact ? 10 : 14 }}>
          <SkeletonBlock
            width="100%"
            height={compact ? 68 : 88}
            radius={18}
            background={toneStyles.soft}
            animate={animate}
          />
          <SkeletonBlock
            width="100%"
            height={compact ? 140 : 180}
            radius={18}
            background={toneStyles.soft}
            animate={animate}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: compact ? 10 : 12,
            }}
          >
            <SkeletonBlock
              width="100%"
              height={compact ? 56 : 68}
              radius={16}
              background={toneStyles.soft}
              animate={animate}
            />
            <SkeletonBlock
              width="100%"
              height={compact ? 56 : 68}
              radius={16}
              background={toneStyles.soft}
              animate={animate}
            />
          </div>
        </div>
      );

    case "card":
    default:
      return (
        <div style={{ display: "grid", gap: compact ? 10 : 12 }}>
          <SkeletonBlock
            width="38%"
            height={12}
            radius={8}
            background={toneStyles.softAlt}
            animate={animate}
          />
          <SkeletonBlock
            width="66%"
            height={26}
            radius={10}
            background={toneStyles.softAlt}
            animate={animate}
          />
          <SkeletonBlock
            width="100%"
            height={10}
            radius={8}
            background={toneStyles.soft}
            animate={animate}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: compact ? 10 : 12,
            }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonBlock
                key={index}
                width="100%"
                height={compact ? 58 : 68}
                radius={16}
                background={toneStyles.soft}
                animate={animate}
              />
            ))}
          </div>
          <SkeletonBlock
            width="100%"
            height={compact ? 120 : 150}
            radius={18}
            background={toneStyles.soft}
            animate={animate}
          />
        </div>
      );
  }
}

export default function AnalyticsLoadingState({
  title = "Loading analytics",
  subtitle = "Please wait while data is being prepared and visualized.",
  variant = "card",
  tone = "default",
  rows = 4,
  columns = 3,
  minHeight,
  compact = false,
  bordered = true,
  elevated = true,
  animate = true,
  style,
}: AnalyticsLoadingStateProps) {
  const toneStyles = getToneStyles(tone);

  return (
    <>
      <style>
        {`
          @keyframes analytics-loading-shimmer {
            0% {
              background-position: -220px 0;
            }
            100% {
              background-position: calc(220px + 100%) 0;
            }
          }
        `}
      </style>

      <section
        aria-busy="true"
        aria-live="polite"
        style={{
          width: "100%",
          minHeight,
          borderRadius: compact ? 18 : 22,
          border: bordered ? `1px solid ${toneStyles.border}` : "none",
          background: toneStyles.surface,
          boxSizing: "border-box",
          boxShadow: elevated
            ? "0 10px 28px rgba(15, 23, 42, 0.06)"
            : "none",
          padding: compact ? 14 : 18,
          ...style,
        }}
      >
        {(title || subtitle) && (
          <div style={{ marginBottom: compact ? 12 : 16 }}>
            {title ? (
              <div
                style={{
                  fontSize: compact ? 14 : 15,
                  fontWeight: 800,
                  color: "#111827",
                  lineHeight: 1.3,
                  marginBottom: subtitle ? 6 : 0,
                }}
              >
                {title}
              </div>
            ) : null}

            {subtitle ? (
              <div
                style={{
                  fontSize: compact ? 12 : 13,
                  lineHeight: 1.55,
                  color: "#6b7280",
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>
        )}

        {renderVariant(
          variant,
          toneStyles,
          rows,
          columns,
          compact,
          animate
        )}
      </section>
    </>
  );
}