import React from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type RecentActivityItem = {
  id: string;
  type:
    | "lead_created"
    | "lead_updated"
    | "contact_created"
    | "contact_updated"
    | "deal_created"
    | "deal_updated"
    | "task_created"
    | "task_completed"
    | "call_logged"
    | "meeting_scheduled"
    | "note_added"
    | "email_sent"
    | "whatsapp_sent"
    | "status_changed";
  title: string;
  description?: string;
  actor?: string;
  entityName?: string;
  entityType?: "lead" | "contact" | "deal" | "task" | "general";
  createdAt: string;
  status?: string;
  meta?: string;
};

type RecentActivityFeedProps = {
  mode: ThemeMode;
  items: RecentActivityItem[];
  title?: string;
  maxItems?: number;
  onActivityClick?: (item: RecentActivityItem) => void;
  onViewAll?: () => void;
};

export default function RecentActivityFeed({
  mode,
  items,
  title = "Recent Activity",
  maxItems = 8,
  onActivityClick,
  onViewAll,
}: RecentActivityFeedProps) {
  const theme = getTheme(mode);

  const visibleItems = [...items]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, maxItems);

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 22,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px 20px",
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: theme.text,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              lineHeight: 1.6,
              color: theme.subText,
            }}
          >
            A live pulse of what’s moving inside your CRM right now.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              background: theme.cardBgSoft,
              border: `1px solid ${theme.border}`,
              color: theme.text,
              fontSize: 12,
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            {items.length} Activities
          </span>

          {onViewAll ? (
            <button
              onClick={onViewAll}
              style={{
                height: 40,
                padding: "0 14px",
                borderRadius: 12,
                border: `1px solid ${theme.border}`,
                background: theme.cardBgSoft,
                color: theme.text,
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              View All
            </button>
          ) : null}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {visibleItems.length === 0 ? (
          <EmptyState mode={mode} />
        ) : (
          <div
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {visibleItems.map((item, index) => {
              const palette = getActivityPalette(mode, item.type);
              const clickable = Boolean(onActivityClick);

              return (
                <div
                  key={item.id}
                  onClick={() => onActivityClick?.(item)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr",
                    gap: 14,
                    cursor: clickable ? "pointer" : "default",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: palette.bg,
                        border: `1px solid ${palette.border}`,
                        color: palette.text,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {getActivityIcon(item.type)}
                    </div>

                    {index !== visibleItems.length - 1 ? (
                      <div
                        style={{
                          width: 2,
                          flex: 1,
                          minHeight: 34,
                          marginTop: 8,
                          borderRadius: 999,
                          background: theme.border,
                        }}
                      />
                    ) : null}
                  </div>

                  <div
                    style={{
                      background: theme.cardBgSoft,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 18,
                      padding: 16,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: 14,
                        alignItems: "start",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                            marginBottom: 8,
                          }}
                        >
                          <h4
                            style={{
                              margin: 0,
                              fontSize: 15,
                              fontWeight: 800,
                              color: theme.text,
                              lineHeight: 1.3,
                            }}
                          >
                            {item.title}
                          </h4>

                          <Badge
                            mode={mode}
                            label={formatTypeLabel(item.type)}
                            tone={getActivityTone(item.type)}
                          />

                          {item.status ? (
                            <Badge
                              mode={mode}
                              label={item.status}
                              tone="neutral"
                            />
                          ) : null}
                        </div>

                        {item.description ? (
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              lineHeight: 1.7,
                              color: theme.subText,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {item.description}
                          </p>
                        ) : null}

                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                            marginTop: 12,
                          }}
                        >
                          {item.actor ? (
                            <MetaPill mode={mode} label={`By ${item.actor}`} />
                          ) : null}

                          {item.entityName ? (
                            <MetaPill
                              mode={mode}
                              label={`${formatEntityLabel(item.entityType)}: ${item.entityName}`}
                            />
                          ) : null}

                          {item.meta ? (
                            <MetaPill mode={mode} label={item.meta} />
                          ) : null}
                        </div>
                      </div>

                      <div
                        style={{
                          textAlign: "right",
                          minWidth: 130,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: theme.text,
                          }}
                        >
                          {formatDateTime(item.createdAt)}
                        </div>
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: theme.subText,
                          }}
                        >
                          {getRelativeTime(item.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyState({ mode }: { mode: ThemeMode }) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        minHeight: 240,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div>
        <div
          style={{
            width: 68,
            height: 68,
            margin: "0 auto 14px",
            borderRadius: "50%",
            background: theme.cardBgSoft,
            border: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          🕒
        </div>

        <h4
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          No recent activity
        </h4>

        <p
          style={{
            margin: "8px auto 0",
            maxWidth: 420,
            fontSize: 13,
            lineHeight: 1.7,
            color: theme.subText,
          }}
        >
          Once activity starts flowing across leads, contacts, deals, and tasks, it will appear here in a clean timeline.
        </p>
      </div>
    </div>
  );
}

function MetaPill({
  mode,
  label,
}: {
  mode: ThemeMode;
  label: string;
}) {
  const theme = getTheme(mode);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 10px",
        borderRadius: 999,
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        color: theme.subText,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

function Badge({
  mode,
  label,
  tone,
}: {
  mode: ThemeMode;
  label: string;
  tone: "success" | "warning" | "danger" | "neutral" | "info";
}) {
  const palette = getBadgePalette(mode, tone);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 9px",
        borderRadius: 999,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        color: palette.text,
        fontSize: 11,
        fontWeight: 800,
        textTransform: "capitalize",
      }}
    >
      {label}
    </span>
  );
}

function getActivityIcon(type: RecentActivityItem["type"]) {
  switch (type) {
    case "lead_created":
      return "🎯";
    case "lead_updated":
      return "🛠️";
    case "contact_created":
      return "👤";
    case "contact_updated":
      return "🪄";
    case "deal_created":
      return "💼";
    case "deal_updated":
      return "📈";
    case "task_created":
      return "✅";
    case "task_completed":
      return "✔️";
    case "call_logged":
      return "📞";
    case "meeting_scheduled":
      return "📅";
    case "note_added":
      return "📝";
    case "email_sent":
      return "✉️";
    case "whatsapp_sent":
      return "💬";
    case "status_changed":
      return "🔄";
    default:
      return "•";
  }
}

function formatTypeLabel(type: RecentActivityItem["type"]) {
  switch (type) {
    case "lead_created":
      return "Lead Created";
    case "lead_updated":
      return "Lead Updated";
    case "contact_created":
      return "Contact Created";
    case "contact_updated":
      return "Contact Updated";
    case "deal_created":
      return "Deal Created";
    case "deal_updated":
      return "Deal Updated";
    case "task_created":
      return "Task Created";
    case "task_completed":
      return "Task Completed";
    case "call_logged":
      return "Call Logged";
    case "meeting_scheduled":
      return "Meeting Scheduled";
    case "note_added":
      return "Note Added";
    case "email_sent":
      return "Email Sent";
    case "whatsapp_sent":
      return "WhatsApp Sent";
    case "status_changed":
      return "Status Changed";
    default:
      return "Activity";
  }
}

function formatEntityLabel(entityType?: RecentActivityItem["entityType"]) {
  switch (entityType) {
    case "lead":
      return "Lead";
    case "contact":
      return "Contact";
    case "deal":
      return "Deal";
    case "task":
      return "Task";
    case "general":
    default:
      return "Entity";
  }
}

function getActivityTone(
  type: RecentActivityItem["type"]
): "success" | "warning" | "danger" | "neutral" | "info" {
  switch (type) {
    case "deal_created":
    case "deal_updated":
    case "contact_created":
    case "lead_created":
      return "info";
    case "task_completed":
      return "success";
    case "meeting_scheduled":
    case "call_logged":
    case "note_added":
      return "warning";
    case "status_changed":
      return "neutral";
    case "email_sent":
    case "whatsapp_sent":
    case "lead_updated":
    case "contact_updated":
    case "task_created":
    default:
      return "neutral";
  }
}

function getActivityPalette(mode: ThemeMode, type: RecentActivityItem["type"]) {
  const tone = getActivityTone(type);
  return getBadgePalette(mode, tone);
}

function getBadgePalette(
  mode: ThemeMode,
  tone: "success" | "warning" | "danger" | "neutral" | "info"
) {
  const isDark = mode === "dark";

  switch (tone) {
    case "success":
      return {
        bg: isDark ? "rgba(34,197,94,0.14)" : "rgba(34,197,94,0.10)",
        border: isDark ? "rgba(34,197,94,0.28)" : "rgba(34,197,94,0.22)",
        text: "#16a34a",
      };
    case "warning":
      return {
        bg: isDark ? "rgba(245,158,11,0.14)" : "rgba(245,158,11,0.10)",
        border: isDark ? "rgba(245,158,11,0.28)" : "rgba(245,158,11,0.22)",
        text: "#d97706",
      };
    case "danger":
      return {
        bg: isDark ? "rgba(239,68,68,0.14)" : "rgba(239,68,68,0.10)",
        border: isDark ? "rgba(239,68,68,0.28)" : "rgba(239,68,68,0.22)",
        text: "#dc2626",
      };
    case "info":
      return {
        bg: isDark ? "rgba(59,130,246,0.14)" : "rgba(59,130,246,0.10)",
        border: isDark ? "rgba(59,130,246,0.28)" : "rgba(59,130,246,0.22)",
        text: "#2563eb",
      };
    case "neutral":
    default:
      return {
        bg: isDark ? "rgba(148,163,184,0.14)" : "rgba(148,163,184,0.10)",
        border: isDark ? "rgba(148,163,184,0.28)" : "rgba(148,163,184,0.22)",
        text: "#475569",
      };
  }
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getRelativeTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const now = Date.now();
  const diff = now - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.floor(diff / minute)} min ago`;
  if (diff < day) return `${Math.floor(diff / hour)} hr ago`;
  if (diff < week) return `${Math.floor(diff / day)} day ago`;
  return `${Math.floor(diff / week)} week ago`;
}