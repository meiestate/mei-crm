import React, { useMemo, type ReactNode } from "react";
import { getTheme } from "../../theme";

type ThemeMode = "light" | "dark";

export type StatCardItem = {
  key: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon?: ReactNode;
  accentColor?: string;
  onClick?: () => void;
};

export interface StatCardGridProps {
  items: StatCardItem[];
  mode?: ThemeMode;
  columns?: 2 | 3 | 4;
  className?: string;
  emptyMessage?: string;
}

const getTrendColor = (
  direction: "up" | "down" | "neutral" | undefined,
  mode: ThemeMode
) => {
  if (direction === "up") {
    return mode === "dark" ? "#4ade80" : "#16a34a";
  }

  if (direction === "down") {
    return mode === "dark" ? "#f87171" : "#dc2626";
  }

  return mode === "dark" ? "#cbd5e1" : "#64748b";
};

const getTrendIcon = (
  direction: "up" | "down" | "neutral" | undefined
) => {
  if (direction === "up") return "↗";
  if (direction === "down") return "↘";
  return "•";
};

const StatCardGrid: React.FC<StatCardGridProps> = ({
  items,
  mode = "light",
  columns = 4,
  className,
  emptyMessage = "No stats available",
}) => {
  const theme = useMemo(() => getTheme(mode), [mode]);

  const gridTemplateColumns = useMemo(() => {
    if (columns === 2) return "repeat(2, minmax(0, 1fr))";
    if (columns === 3) return "repeat(3, minmax(0, 1fr))";
    return "repeat(4, minmax(0, 1fr))";
  }, [columns]);

  if (!items.length) {
    return (
      <div
        className={className}
        style={{
          border: `1px dashed ${theme.border}`,
          borderRadius: 18,
          padding: 24,
          textAlign: "center",
          background: theme.cardBg,
          color: theme.subText,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns,
        gap: 16,
      }}
    >
      {items.map((item) => {
        const accent = item.accentColor ?? theme.primary;
        const trendColor = getTrendColor(item.trendDirection, mode);

        return (
          <button
            key={item.key}
            type="button"
            onClick={item.onClick}
            disabled={!item.onClick}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 12,
              padding: 18,
              borderRadius: 18,
              border: `1px solid ${theme.border}`,
              background: theme.cardBg,
              boxShadow:
                mode === "dark"
                  ? "0 10px 24px rgba(0,0,0,0.22)"
                  : "0 10px 28px rgba(15,23,42,0.08)",
              cursor: item.onClick ? "pointer" : "default",
              transition: "all 0.2s ease",
              textAlign: "left",
              width: "100%",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform = "translateY(-2px)";
              event.currentTarget.style.borderColor = `${accent}55`;
              event.currentTarget.style.boxShadow =
                mode === "dark"
                  ? "0 16px 30px rgba(0,0,0,0.28)"
                  : "0 16px 32px rgba(15,23,42,0.12)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = "translateY(0)";
              event.currentTarget.style.borderColor = theme.border;
              event.currentTarget.style.boxShadow =
                mode === "dark"
                  ? "0 10px 24px rgba(0,0,0,0.22)"
                  : "0 10px 28px rgba(15,23,42,0.08)";
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 4,
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                background: accent,
              }}
            />

            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.subText,
                    marginBottom: 6,
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    fontSize: 28,
                    lineHeight: 1.1,
                    fontWeight: 800,
                    color: theme.text,
                    letterSpacing: -0.4,
                  }}
                >
                  {item.value}
                </div>
              </div>

              {item.icon ? (
                <div
                  style={{
                    width: 44,
                    height: 44,
                    minWidth: 44,
                    borderRadius: 14,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      mode === "dark"
                        ? `${accent}22`
                        : `${accent}14`,
                    color: accent,
                    fontSize: 20,
                  }}
                >
                  {item.icon}
                </div>
              ) : null}
            </div>

            {(item.subtitle || item.trend) ? (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: theme.subText,
                  }}
                >
                  {item.subtitle ?? ""}
                </div>

                {item.trend ? (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      color: trendColor,
                      background:
                        mode === "dark"
                          ? "rgba(255,255,255,0.04)"
                          : theme.cardBgSoft ?? "#f8fafc",
                      border: `1px solid ${theme.border}`,
                      borderRadius: 999,
                      padding: "4px 8px",
                    }}
                  >
                    <span>{getTrendIcon(item.trendDirection)}</span>
                    <span>{item.trend}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export default StatCardGrid;