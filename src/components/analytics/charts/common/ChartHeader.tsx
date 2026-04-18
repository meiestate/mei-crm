// src/components/analytics/charts/shared/ChartHeader.tsx

import type { CSSProperties, ReactNode } from "react";

export interface ChartHeaderProps {
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  action?: ReactNode;
  meta?: ReactNode;
  align?: "start" | "center";
  titleTag?: "h2" | "h3" | "h4";
  className?: string;
  style?: CSSProperties;
}

function renderHeading(
  tag: "h2" | "h3" | "h4",
  content: ReactNode,
  style: CSSProperties
) {
  if (tag === "h2") {
    return <h2 style={style}>{content}</h2>;
  }

  if (tag === "h4") {
    return <h4 style={style}>{content}</h4>;
  }

  return <h3 style={style}>{content}</h3>;
}

export default function ChartHeader({
  title,
  subtitle,
  badge,
  action,
  meta,
  align = "start",
  titleTag = "h3",
  className,
  style,
}: ChartHeaderProps) {
  if (!title && !subtitle && !badge && !action && !meta) {
    return null;
  }

  const isCenterAligned = align === "center";

  const headingStyle: CSSProperties = {
    margin: 0,
    fontSize: titleTag === "h2" ? 22 : titleTag === "h4" ? 16 : 18,
    fontWeight: 700,
    lineHeight: 1.25,
    color: "#0F172A",
    textAlign: isCenterAligned ? "center" : "left",
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: isCenterAligned ? "center" : "flex-start",
        gap: 12,
        flexWrap: "wrap",
        ...style,
      }}
    >
      <div
        style={{
          flex: "1 1 320px",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: isCenterAligned ? "center" : "flex-start",
          textAlign: isCenterAligned ? "center" : "left",
        }}
      >
        {badge ? (
          <div
            style={{
              marginBottom: title || subtitle ? 10 : 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #E2E8F0",
              background: "#F8FAFC",
              borderRadius: 999,
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: 700,
              color: "#334155",
              whiteSpace: "nowrap",
            }}
          >
            {badge}
          </div>
        ) : null}

        {title ? renderHeading(titleTag, title, headingStyle) : null}

        {subtitle ? (
          <p
            style={{
              margin: title ? "6px 0 0" : 0,
              fontSize: 13,
              lineHeight: 1.55,
              color: "#64748B",
              maxWidth: isCenterAligned ? 720 : 620,
            }}
          >
            {subtitle}
          </p>
        ) : null}

        {meta ? (
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: isCenterAligned ? "center" : "flex-start",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {meta}
          </div>
        ) : null}
      </div>

      {action ? (
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            marginLeft: isCenterAligned ? "auto" : 0,
          }}
        >
          {action}
        </div>
      ) : null}
    </div>
  );
}