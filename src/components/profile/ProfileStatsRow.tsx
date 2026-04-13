import type { CSSProperties } from "react";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

export type ProfileStatItem = {
  key: string;
  label: string;
  value: number | string;
  accent?: string;
  helperText?: string;
  onClick?: () => void;
};

type ProfileStatsRowProps = {
  mode?: ThemeMode;
  stats: ProfileStatItem[];
  columnsMinWidth?: number;
};

export default function ProfileStatsRow({
  mode = "light",
  stats,
  columnsMinWidth = 180,
}: ProfileStatsRowProps) {
  const theme = getTheme(mode);

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${columnsMinWidth}px, 1fr))`,
    gap: 16,
  };

  return (
    <section style={gridStyle}>
      {stats.map((stat, index) => {
        const accent =
          stat.accent ||
          getDefaultAccent(index, {
            primary: theme.primary,
            success: theme.success,
            warning: theme.warning,
            primaryHover: theme.primaryHover,
          });

        const isClickable = typeof stat.onClick === "function";

        const cardStyle: CSSProperties = {
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderTop: `4px solid ${accent}`,
          borderRadius: 20,
          boxShadow:
            mode === "dark"
              ? "0 10px 30px rgba(0,0,0,0.28)"
              : "0 10px 30px rgba(15, 23, 42, 0.08)",
          padding: 18,
          minWidth: 0,
          cursor: isClickable ? "pointer" : "default",
          transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        };

        const labelStyle: CSSProperties = {
          margin: 0,
          color: theme.mutedText,
          fontSize: 12,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          lineHeight: 1.5,
        };

        const valueStyle: CSSProperties = {
          margin: "12px 0 0",
          color: theme.text,
          fontSize: 28,
          fontWeight: 900,
          lineHeight: 1.1,
          wordBreak: "break-word",
        };

        const helperStyle: CSSProperties = {
          margin: "10px 0 0",
          color: theme.subText,
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.6,
          minHeight: 20,
        };

        const content = (
          <>
            <p style={labelStyle}>{stat.label}</p>
            <h3 style={valueStyle}>{stat.value}</h3>
            <p style={helperStyle}>{stat.helperText || "\u00A0"}</p>
          </>
        );

        if (isClickable) {
          return (
            <button
              key={stat.key}
              type="button"
              onClick={stat.onClick}
              style={{
                ...cardStyle,
                textAlign: "left",
                width: "100%",
              }}
            >
              {content}
            </button>
          );
        }

        return (
          <div key={stat.key} style={cardStyle}>
            {content}
          </div>
        );
      })}
    </section>
  );
}

function getDefaultAccent(
  index: number,
  palette: {
    primary: string;
    success: string;
    warning: string;
    primaryHover: string;
  }
) {
  const colors = [
    palette.primary,
    palette.success,
    palette.warning,
    palette.primaryHover,
    palette.success,
    palette.warning,
  ];

  return colors[index % colors.length];
}