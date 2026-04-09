import type { ReactNode } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";
import NoDataState from "./NoDataState";

export type ActivityTimelineItem = {
  id: string | number;
  type:
    | "created"
    | "updated"
    | "note"
    | "call"
    | "email"
    | "meeting"
    | "task"
    | "status"
    | "payment"
    | "document"
    | "custom";
  title: string;
  description?: string;
  timestamp: string;
  actor?: string;
  metadata?: string[];
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

type ActivityTimelineProps = {
  mode: ThemeMode;
  items: ActivityTimelineItem[];
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  compact?: boolean;
};

function formatTimelineDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      dateLabel: value,
      timeLabel: "",
    };
  }

  return {
    dateLabel: date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    timeLabel: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function getTypeConfig(
  type: ActivityTimelineItem["type"],
  mode: ThemeMode,
  theme: ReturnType<typeof getTheme>
) {
  switch (type) {
    case "created":
      return {
        label: "Created",
        icon: "+",
        color: theme.success ?? "#22c55e",
        bg:
          mode === "dark"
            ? "rgba(34,197,94,0.14)"
            : "rgba(34,197,94,0.10)",
      };

    case "updated":
      return {
        label: "Updated",
        icon: "↻",
        color: theme.primary,
        bg:
          mode === "dark"
            ? "rgba(59,130,246,0.14)"
            : "rgba(37,99,235,0.10)",
      };

    case "note":
      return {
        label: "Note",
        icon: "✎",
        color: "#a855f7",
        bg:
          mode === "dark"
            ? "rgba(168,85,247,0.14)"
            : "rgba(168,85,247,0.10)",
      };

    case "call":
      return {
        label: "Call",
        icon: "☎",
        color: "#06b6d4",
        bg:
          mode === "dark"
            ? "rgba(6,182,212,0.14)"
            : "rgba(6,182,212,0.10)",
      };

    case "email":
      return {
        label: "Email",
        icon: "✉",
        color: "#f59e0b",
        bg:
          mode === "dark"
            ? "rgba(245,158,11,0.14)"
            : "rgba(245,158,11,0.10)",
      };

    case "meeting":
      return {
        label: "Meeting",
        icon: "◫",
        color: "#14b8a6",
        bg:
          mode === "dark"
            ? "rgba(20,184,166,0.14)"
            : "rgba(20,184,166,0.10)",
      };

    case "task":
      return {
        label: "Task",
        icon: "✓",
        color: "#6366f1",
        bg:
          mode === "dark"
            ? "rgba(99,102,241,0.14)"
            : "rgba(99,102,241,0.10)",
      };

    case "status":
      return {
        label: "Status",
        icon: "●",
        color: "#ec4899",
        bg:
          mode === "dark"
            ? "rgba(236,72,153,0.14)"
            : "rgba(236,72,153,0.10)",
      };

    case "payment":
      return {
        label: "Payment",
        icon: "₹",
        color: "#22c55e",
        bg:
          mode === "dark"
            ? "rgba(34,197,94,0.14)"
            : "rgba(34,197,94,0.10)",
      };

    case "document":
      return {
        label: "Document",
        icon: "▣",
        color: "#f97316",
        bg:
          mode === "dark"
            ? "rgba(249,115,22,0.14)"
            : "rgba(249,115,22,0.10)",
      };

    default:
      return {
        label: "Activity",
        icon: "•",
        color: theme.text,
        bg:
          mode === "dark"
            ? "rgba(255,255,255,0.08)"
            : "rgba(15,23,42,0.06)",
      };
  }
}

export default function ActivityTimeline({
  mode,
  items,
  title = "Activity Timeline",
  subtitle = "Track every important update, communication, and movement in one place.",
  emptyTitle = "No activities yet",
  emptyMessage = "There are no activity records available right now.",
  compact = false,
}: ActivityTimelineProps) {
  const theme = getTheme(mode);

  if (!items.length) {
    return (
      <div
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 24,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "22px 24px 18px",
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              lineHeight: 1.2,
              color: theme.text,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 14,
              lineHeight: 1.6,
              color: theme.subText,
            }}
          >
            {subtitle}
          </div>
        </div>

        <NoDataState
          mode={mode}
          compact
          title={emptyTitle}
          message={emptyMessage}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow:
          mode === "dark"
            ? "0 14px 40px rgba(0,0,0,0.24)"
            : "0 14px 40px rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          padding: "22px 24px 18px",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            lineHeight: 1.2,
            color: theme.text,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            lineHeight: 1.6,
            color: theme.subText,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          padding: compact ? 18 : 24,
          display: "flex",
          flexDirection: "column",
          gap: compact ? 18 : 22,
        }}
      >
        {items.map((item, index) => {
          const { dateLabel, timeLabel } = formatTimelineDate(item.timestamp);
          const typeConfig = getTypeConfig(item.type, mode, theme);
          const isLast = index === items.length - 1;

          return (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: compact ? "56px 1fr" : "72px 1fr",
                gap: compact ? 12 : 16,
                alignItems: "start",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: 100,
                }}
              >
                <div
                  style={{
                    width: compact ? 42 : 48,
                    height: compact ? 42 : 48,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: typeConfig.bg,
                    color: typeConfig.color,
                    border: `1px solid ${
                      mode === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(15,23,42,0.06)"
                    }`,
                    fontSize: compact ? 16 : 18,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {item.icon ?? typeConfig.icon}
                </div>

                {!isLast && (
                  <div
                    style={{
                      position: "absolute",
                      top: compact ? 46 : 52,
                      width: 2,
                      bottom: -22,
                      background:
                        mode === "dark"
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(15,23,42,0.08)",
                      borderRadius: 999,
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  background: theme.cardBgSoft ?? theme.cardBg,
                  border: `1px solid ${theme.borderSoft ?? theme.border}`,
                  borderRadius: 20,
                  padding: compact ? "16px 16px" : "18px 18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "6px 10px",
                          borderRadius: 999,
                          background: typeConfig.bg,
                          color: typeConfig.color,
                          fontSize: 12,
                          fontWeight: 700,
                          border: `1px solid ${
                            mode === "dark"
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(15,23,42,0.05)"
                          }`,
                        }}
                      >
                        {typeConfig.label}
                      </span>

                      <span
                        style={{
                          fontSize: 12.5,
                          color: theme.mutedText,
                        }}
                      >
                        {dateLabel}
                        {timeLabel ? ` • ${timeLabel}` : ""}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: compact ? 15 : 16,
                        fontWeight: 800,
                        lineHeight: 1.35,
                        color: theme.text,
                      }}
                    >
                      {item.title}
                    </div>

                    {item.description && (
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 14,
                          lineHeight: 1.7,
                          color: theme.subText,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {item.description}
                      </div>
                    )}

                    {(item.actor || (item.metadata && item.metadata.length > 0)) && (
                      <div
                        style={{
                          marginTop: 14,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        {item.actor && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "7px 10px",
                              borderRadius: 999,
                              background:
                                mode === "dark"
                                  ? "rgba(255,255,255,0.05)"
                                  : "rgba(15,23,42,0.05)",
                              color: theme.text,
                              fontSize: 12.5,
                              fontWeight: 600,
                            }}
                          >
                            By {item.actor}
                          </span>
                        )}

                        {item.metadata?.map((meta, metaIndex) => (
                          <span
                            key={`${item.id}-meta-${metaIndex}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "7px 10px",
                              borderRadius: 999,
                              background:
                                mode === "dark"
                                  ? "rgba(255,255,255,0.04)"
                                  : "rgba(15,23,42,0.04)",
                              color: theme.subText,
                              fontSize: 12.5,
                              fontWeight: 600,
                            }}
                          >
                            {meta}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {item.onAction && item.actionLabel && (
                    <button
                      type="button"
                      onClick={item.onAction}
                      style={{
                        border: `1px solid ${theme.border}`,
                        background: theme.cardBg,
                        color: theme.text,
                        borderRadius: 12,
                        padding: "10px 14px",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}