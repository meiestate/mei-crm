// src/components/analytics/charts/shared/BaseChartContainer.tsx

import type { CSSProperties, ReactNode } from "react";

export interface BaseChartContainerProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  height?: number | string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  action?: ReactNode;
  footer?: ReactNode;
  badge?: ReactNode;
  padding?: number | string;
  minHeight?: number | string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  shadow?: string;
  className?: string;
  contentStyle?: CSSProperties;
}

const DEFAULT_CARD_BACKGROUND = "#FFFFFF";
const DEFAULT_BORDER_COLOR = "#E2E8F0";
const DEFAULT_TEXT_COLOR = "#0F172A";
const DEFAULT_SUBTEXT_COLOR = "#64748B";

function resolveSize(value: number | string | undefined, fallback: string): string {
  if (typeof value === "number") {
    return `${value}px`;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return fallback;
}

function HeaderSection({
  title,
  subtitle,
  badge,
  action,
}: {
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  action?: ReactNode;
}) {
  if (!title && !subtitle && !badge && !action) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 18,
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 320px" }}>
        {title ? (
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: DEFAULT_TEXT_COLOR,
              lineHeight: 1.25,
            }}
          >
            {title}
          </h3>
        ) : null}

        {subtitle ? (
          <p
            style={{
              margin: title ? "6px 0 0" : 0,
              fontSize: 13,
              lineHeight: 1.55,
              color: DEFAULT_SUBTEXT_COLOR,
              maxWidth: 680,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {(badge || action) ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
            flexWrap: "wrap",
            flex: "0 0 auto",
          }}
        >
          {badge ? (
            <div
              style={{
                border: `1px solid ${DEFAULT_BORDER_COLOR}`,
                background: "#F8FAFC",
                borderRadius: 999,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 700,
                color: "#334155",
                whiteSpace: "nowrap",
              }}
            >
              {badge}
            </div>
          ) : null}

          {action}
        </div>
      ) : null}
    </div>
  );
}

function LoadingState({ height }: { height: string }) {
  return (
    <div
      style={{
        height,
        minHeight: 220,
        borderRadius: 16,
        border: `1px solid ${DEFAULT_BORDER_COLOR}`,
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: DEFAULT_SUBTEXT_COLOR,
        fontSize: 14,
        fontWeight: 600,
        textAlign: "center",
        padding: 20,
      }}
    >
      Loading chart data...
    </div>
  );
}

function EmptyState({
  height,
  message,
}: {
  height: string;
  message: string;
}) {
  return (
    <div
      style={{
        height,
        minHeight: 220,
        borderRadius: 16,
        border: "1px dashed #CBD5E1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 20,
        color: DEFAULT_SUBTEXT_COLOR,
        fontSize: 14,
        fontWeight: 600,
        background: "#FFFFFF",
      }}
    >
      {message}
    </div>
  );
}

export default function BaseChartContainer({
  title,
  subtitle,
  children,
  height = 360,
  loading = false,
  empty = false,
  emptyMessage = "No chart data available.",
  action,
  footer,
  badge,
  padding = 20,
  minHeight = 0,
  backgroundColor = DEFAULT_CARD_BACKGROUND,
  borderColor = DEFAULT_BORDER_COLOR,
  borderRadius = 20,
  shadow = "0 10px 30px rgba(15, 23, 42, 0.04)",
  className,
  contentStyle,
}: BaseChartContainerProps) {
  const resolvedPadding = resolveSize(padding, "20px");
  const resolvedHeight = resolveSize(height, "360px");
  const resolvedMinHeight =
    typeof minHeight === "number"
      ? `${minHeight}px`
      : typeof minHeight === "string" && minHeight.trim().length > 0
      ? minHeight
      : undefined;

  const cardStyle: CSSProperties = {
    background: backgroundColor,
    border: `1px solid ${borderColor}`,
    borderRadius,
    padding: resolvedPadding,
    boxShadow: shadow,
    minHeight: resolvedMinHeight,
  };

  const chartBodyStyle: CSSProperties = {
    width: "100%",
    height: resolvedHeight,
    ...contentStyle,
  };

  return (
    <section className={className} style={cardStyle}>
      <HeaderSection
        title={title}
        subtitle={subtitle}
        badge={badge}
        action={action}
      />

      {loading ? (
        <LoadingState height={resolvedHeight} />
      ) : empty ? (
        <EmptyState height={resolvedHeight} message={emptyMessage} />
      ) : (
        <div style={chartBodyStyle}>{children}</div>
      )}

      {footer ? (
        <div
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: `1px solid ${DEFAULT_BORDER_COLOR}`,
          }}
        >
          {footer}
        </div>
      ) : null}
    </section>
  );
}