import { type CSSProperties, type ReactNode } from "react";

export type AnalyticsGridColumns =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | "auto"
  | "fit";

export type AnalyticsGridGap = "sm" | "md" | "lg" | number;

export type AnalyticsGridProps = {
  children?: ReactNode;
  columns?: AnalyticsGridColumns;
  gap?: AnalyticsGridGap;
  minChildWidth?: number;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyItems"];
  dense?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
  className?: string;
};

function getGapValue(gap: AnalyticsGridGap): number {
  if (typeof gap === "number") return gap;

  switch (gap) {
    case "sm":
      return 12;
    case "lg":
      return 24;
    default:
      return 16;
  }
}

function getTemplateColumns(
  columns: AnalyticsGridColumns,
  minChildWidth: number
): string {
  if (columns === "auto") {
    return `repeat(auto-fill, minmax(${minChildWidth}px, 1fr))`;
  }

  if (columns === "fit") {
    return `repeat(auto-fit, minmax(${minChildWidth}px, 1fr))`;
  }

  return `repeat(${columns}, minmax(0, 1fr))`;
}

export default function AnalyticsGrid({
  children,
  columns = "fit",
  gap = "md",
  minChildWidth = 280,
  align = "stretch",
  justify = "stretch",
  dense = false,
  fullWidth = true,
  style,
}: AnalyticsGridProps) {
  const resolvedGap = getGapValue(gap);
  const gridTemplateColumns = getTemplateColumns(columns, minChildWidth);

  return (
    <section
      style={{
        width: fullWidth ? "100%" : undefined,
        display: "grid",
        gridTemplateColumns,
        gap: resolvedGap,
        alignItems: align,
        justifyItems: justify,
        gridAutoFlow: dense ? "row dense" : "row",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </section>
  );
}