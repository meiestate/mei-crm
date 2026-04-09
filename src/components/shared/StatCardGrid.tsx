import type { ReactNode } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

export type StatCardItem = {
  key: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
};

type StatCardGridProps = {
  mode: ThemeMode;
  items: StatCardItem[];
  columns?: number;
  gap?: number;
  compact?: boolean;
};

function getTrendColor(
  direction: StatCardItem["trendDirection"],
  mode: ThemeMode,
  theme: ReturnType<typeof getTheme>
) {
  if (direction === "up") {
    return {
      color: theme.success ?? "#22c55e",
      bg:
        mode === "dark"
          ? "rgba(34,197,94,0.14)"
          : "rgba(34,197,94,0.10)",
    };
  }

  if (direction === "down") {
    return {
      color: theme.warning ?? "#ef4444",
      bg:
        mode === "dark"
          ? "rgba(239,68,68,0.14)"
          : "rgba(239,68,68,0.10)",
    };
  }

  return {
    color: theme.primary,
    bg:
      mode === "dark"
        ? "rgba(59,130,246,0.14)"
        : "rgba(37,99,235,0.10)",
  };
}

export default function StatCardGrid({
  mode,
  items,
  columns = 4,
  gap = 18,
  compact = false,
}: StatCardGridProps) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap,
        width: "100%",
      }}
    >
      {items.map((item) => {
        const trendTone = getTrendColor(item.trendDirection, mode, theme);
        const clickable = !!item.onClick;

        return (
          <button
            key={item.key}
            type="button"
            onClick={item.onClick}
            style={{
              width: "100%",
              border: `1px solid ${theme.border}`,
              outline: "none",
              background: theme.cardBg,
              borderRadius: compact ? 18 : 22,
              padding: compact ? 18 : 22,
              textAlign: "left",
              cursor: clickable ? "pointer" : "default",
              boxShadow:
                mode === "dark"
                  ? "0 12px 34px rgba(0,0,0,0.24)"
                  : "0 12px 30px rgba(15,23,42,0.06)",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              gap: compact ? 12 : 14,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 14,
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.subText,
                    lineHeight: 1.4,
                    marginBottom: 8,
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    fontSize: compact ? 26 : 30,
                    fontWeight: 800,
                    color: theme.text,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                    wordBreak: "break-word",
                  }}
                >
                  {item.value}
                </div>
              </div>

              {item.icon && (
                <div
                  style={{
                    width: compact ? 42 : 48,
                    height: compact ? 42 : 48,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background:
                      mode === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(15,23,42,0.05)",
                    color: theme.primary,
                    fontSize: compact ? 18 : 20,
                    fontWeight: 800,
                  }}
                >
                  {item.icon}
                </div>
              )}
            </div>

            {(item.subtitle || item.trend) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {item.subtitle ? (
                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: theme.subText,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {item.subtitle}
                  </div>
                ) : (
                  <div />
                )}

                {item.trend && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: trendTone.bg,
                      color: trendTone.color,
                      fontSize: 12,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>
                      {item.trendDirection === "up"
                        ? "↗"
                        : item.trendDirection === "down"
                        ? "↘"
                        : "→"}
                    </span>
                    <span>{item.trend}</span>
                  </div>
                )}
              </div>
            )}

            {item.footer && (
              <div
                style={{
                  marginTop: 2,
                  paddingTop: 12,
                  borderTop: `1px solid ${theme.borderSoft ?? theme.border}`,
                }}
              >
                {item.footer}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}