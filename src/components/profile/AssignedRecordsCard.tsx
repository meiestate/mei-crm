import type { CSSProperties, ReactNode } from "react";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

export type AssignedRecordItem = {
  key: string;
  label: string;
  value: number | string;
  helperText?: ReactNode;
  accent?: string;
};

type AssignedRecordsCardProps = {
  mode?: ThemeMode;
  title?: string;
  subtitle?: string;
  items: AssignedRecordItem[];
  actionLabel?: string;
  onViewAll?: () => void;
  footer?: ReactNode;
  emptyMessage?: string;
  columnsMinWidth?: number;
};

export default function AssignedRecordsCard({
  mode = "light",
  title = "Assigned Records",
  subtitle = "A quick operational snapshot of workload, ownership, and current responsibilities.",
  items,
  actionLabel = "View All",
  onViewAll,
  footer,
  emptyMessage = "No assigned records available.",
  columnsMinWidth = 180,
}: AssignedRecordsCardProps) {
  const theme = getTheme(mode);
  const showAction = typeof onViewAll === "function";
  const hasItems = items.length > 0;

  const cardStyle: CSSProperties = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: 20,
    padding: 20,
    boxShadow:
      mode === "dark"
        ? "0 10px 30px rgba(0,0,0,0.28)"
        : "0 10px 30px rgba(15, 23, 42, 0.08)",
  };

  const headerWrapStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 16,
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: theme.text,
    letterSpacing: 0.2,
    lineHeight: 1.3,
  };

  const subtitleStyle: CSSProperties = {
    margin: "6px 0 0",
    color: theme.subText,
    fontSize: 13,
    lineHeight: 1.6,
    maxWidth: 760,
  };

  const actionButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.text,
    minHeight: 40,
    padding: "0 14px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${columnsMinWidth}px, 1fr))`,
    gap: 14,
  };

  const itemCardStyleBase: CSSProperties = {
    borderRadius: 16,
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    padding: 16,
    minWidth: 0,
  };

  const labelStyle: CSSProperties = {
    margin: 0,
    color: theme.mutedText,
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.35,
    lineHeight: 1.5,
  };

  const valueStyle: CSSProperties = {
    margin: "10px 0 0",
    color: theme.text,
    fontSize: 28,
    fontWeight: 900,
    lineHeight: 1.1,
    wordBreak: "break-word",
  };

  const helperTextStyle: CSSProperties = {
    margin: "10px 0 0",
    color: theme.subText,
    fontSize: 13,
    lineHeight: 1.65,
    wordBreak: "break-word",
    minHeight: 20,
  };

  const emptyStateStyle: CSSProperties = {
    padding: "16px 14px",
    borderRadius: 14,
    border: `1px dashed ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.subText,
    fontSize: 14,
    lineHeight: 1.7,
  };

  const footerStyle: CSSProperties = {
    marginTop: 18,
    paddingTop: 18,
    borderTop: `1px solid ${theme.borderSoft}`,
  };

  return (
    <section style={cardStyle}>
      <div style={headerWrapStyle}>
        <div style={{ minWidth: 0, flex: "1 1 420px" }}>
          <h3 style={titleStyle}>{title}</h3>
          <p style={subtitleStyle}>{subtitle}</p>
        </div>

        {showAction ? (
          <button type="button" style={actionButtonStyle} onClick={onViewAll}>
            {actionLabel}
          </button>
        ) : null}
      </div>

      {hasItems ? (
        <div style={gridStyle}>
          {items.map((item, index) => {
            const accent =
              item.accent ||
              getDefaultAccent(index, {
                primary: theme.primary,
                success: theme.success,
                warning: theme.warning,
                primaryHover: theme.primaryHover,
              });

            return (
              <div
                key={item.key}
                style={{
                  ...itemCardStyleBase,
                  borderTop: `4px solid ${accent}`,
                }}
              >
                <p style={labelStyle}>{item.label}</p>
                <h4 style={valueStyle}>{item.value}</h4>
                <div style={helperTextStyle}>{item.helperText || "\u00A0"}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={emptyStateStyle}>{emptyMessage}</div>
      )}

      {footer ? <div style={footerStyle}>{footer}</div> : null}
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