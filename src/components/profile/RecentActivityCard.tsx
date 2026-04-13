import type { CSSProperties, ReactNode } from "react";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

export type RecentActivityItem = {
  id: string;
  title: string;
  description?: ReactNode;
  timestamp: ReactNode;
  type?: "lead" | "deal" | "task" | "call" | "profile" | "security" | "note";
};

type RecentActivityCardProps = {
  mode?: ThemeMode;
  title?: string;
  subtitle?: string;
  items: RecentActivityItem[];
  actionLabel?: string;
  onViewAll?: () => void;
  footer?: ReactNode;
  emptyMessage?: string;
};

export default function RecentActivityCard({
  mode = "light",
  title = "Recent Activity",
  subtitle = "Latest actions performed by this user across profile, tasks, deals, calls, and security events.",
  items,
  actionLabel = "View Full Activity",
  onViewAll,
  footer,
  emptyMessage = "No recent activity available.",
}: RecentActivityCardProps) {
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

  const listWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 0,
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
        <div style={listWrapStyle}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            const rowStyle: CSSProperties = {
              display: "grid",
              gridTemplateColumns: "40px minmax(0, 1fr)",
              gap: 12,
              alignItems: "start",
              paddingBottom: isLast ? 0 : 14,
              marginBottom: isLast ? 0 : 14,
              borderBottom: isLast ? "none" : `1px solid ${theme.borderSoft}`,
            };

            return (
              <div key={item.id} style={rowStyle}>
                <ActivityIconBubble type={item.type || "note"} mode={mode} />

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      color: theme.text,
                      fontSize: 14,
                      fontWeight: 800,
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                    }}
                  >
                    {item.title}
                  </div>

                  {item.description ? (
                    <div
                      style={{
                        marginTop: 4,
                        color: theme.subText,
                        fontSize: 13,
                        lineHeight: 1.7,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.description}
                    </div>
                  ) : null}

                  <div
                    style={{
                      marginTop: 6,
                      color: theme.mutedText,
                      fontSize: 12,
                      fontWeight: 700,
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                    }}
                  >
                    {item.timestamp}
                  </div>
                </div>
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

function ActivityIconBubble({
  type,
  mode,
}: {
  type: NonNullable<RecentActivityItem["type"]>;
  mode: ThemeMode;
}) {
  const iconMap: Record<NonNullable<RecentActivityItem["type"]>, string> = {
    lead: "L",
    deal: "D",
    task: "T",
    call: "C",
    profile: "P",
    security: "S",
    note: "N",
  };

  const tone = getActivityTone(type, mode);

  const bubbleStyle: CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${tone.border}`,
    background: tone.background,
    color: tone.color,
    fontSize: 14,
    fontWeight: 900,
    lineHeight: 1,
    flexShrink: 0,
  };

  return <div style={bubbleStyle}>{iconMap[type]}</div>;
}

function getActivityTone(
  type: NonNullable<RecentActivityItem["type"]>,
  mode: ThemeMode
) {
  if (type === "deal") {
    return {
      background: mode === "dark" ? "rgba(34,197,94,0.16)" : "#DCFCE7",
      border: mode === "dark" ? "rgba(34,197,94,0.3)" : "#BBF7D0",
      color: mode === "dark" ? "#86EFAC" : "#166534",
    };
  }

  if (type === "task") {
    return {
      background: mode === "dark" ? "rgba(245,158,11,0.16)" : "#FEF3C7",
      border: mode === "dark" ? "rgba(245,158,11,0.3)" : "#FDE68A",
      color: mode === "dark" ? "#FCD34D" : "#92400E",
    };
  }

  if (type === "security") {
    return {
      background: mode === "dark" ? "rgba(239,68,68,0.16)" : "#FEE2E2",
      border: mode === "dark" ? "rgba(239,68,68,0.3)" : "#FECACA",
      color: mode === "dark" ? "#FCA5A5" : "#991B1B",
    };
  }

  if (type === "profile") {
    return {
      background: mode === "dark" ? "rgba(59,130,246,0.16)" : "#DBEAFE",
      border: mode === "dark" ? "rgba(59,130,246,0.3)" : "#BFDBFE",
      color: mode === "dark" ? "#93C5FD" : "#1D4ED8",
    };
  }

  if (type === "call") {
    return {
      background: mode === "dark" ? "rgba(168,85,247,0.16)" : "#F3E8FF",
      border: mode === "dark" ? "rgba(168,85,247,0.3)" : "#E9D5FF",
      color: mode === "dark" ? "#D8B4FE" : "#7E22CE",
    };
  }

  if (type === "lead") {
    return {
      background: mode === "dark" ? "rgba(6,182,212,0.16)" : "#CFFAFE",
      border: mode === "dark" ? "rgba(6,182,212,0.3)" : "#A5F3FC",
      color: mode === "dark" ? "#67E8F9" : "#155E75",
    };
  }

  return {
    background: mode === "dark" ? "rgba(148,163,184,0.16)" : "#F1F5F9",
    border: mode === "dark" ? "rgba(148,163,184,0.3)" : "#CBD5E1",
    color: mode === "dark" ? "#CBD5E1" : "#475569",
  };
}