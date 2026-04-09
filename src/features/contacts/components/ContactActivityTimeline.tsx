import React from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type ContactActivityItem = {
  id: string;
  type:
    | "call"
    | "note"
    | "email"
    | "meeting"
    | "task"
    | "whatsapp"
    | "status"
    | "contact_created"
    | "contact_updated";
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
  status?: string;
  meta?: string;
};

type ContactActivityTimelineProps = {
  mode: ThemeMode;
  activities: ContactActivityItem[];
  title?: string;
  maxHeight?: number | string;
  onActivityClick?: (activity: ContactActivityItem) => void;
};

export default function ContactActivityTimeline({
  mode,
  activities,
  title = "Activity Timeline",
  maxHeight = 560,
  onActivityClick,
}: ContactActivityTimelineProps) {
  const theme = getTheme(mode);

  const sortedActivities = [...activities].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px 20px",
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
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
              color: theme.subText,
            }}
          >
            Contact interactions, updates, and follow-up history.
          </p>
        </div>

        <div
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            background: theme.cardBgSoft,
            border: `1px solid ${theme.border}`,
            fontSize: 12,
            fontWeight: 700,
            color: theme.text,
            whiteSpace: "nowrap",
          }}
        >
          {sortedActivities.length} Activities
        </div>
      </div>

      <div
        style={{
          padding: 20,
          maxHeight,
          overflowY: "auto",
        }}
      >
        {sortedActivities.length === 0 ? (
          <EmptyState mode={mode} />
        ) : (
          <div style={{ display: "grid", gap: 18 }}>
            {sortedActivities.map((activity, index) => {
              const icon = getActivityIcon(activity.type);
              const color = getActivityAccent(activity.type);

              return (
                <div
                  key={activity.id}
                  onClick={() => onActivityClick?.(activity)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 1fr",
                    gap: 14,
                    cursor: onActivityClick ? "pointer" : "default",
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
                        width: 40,
                        height: 40,
                        borderRadius: 999,
                        background: color.bg,
                        border: `1px solid ${color.border}`,
                        color: color.text,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {icon}
                    </div>

                    {index !== sortedActivities.length - 1 ? (
                      <div
                        style={{
                          width: 2,
                          flex: 1,
                          minHeight: 36,
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
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 15,
                              fontWeight: 800,
                              color: theme.text,
                            }}
                          >
                            {activity.title}
                          </span>

                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: 999,
                              background: color.bg,
                              border: `1px solid ${color.border}`,
                              color: color.text,
                              fontSize: 11,
                              fontWeight: 800,
                              textTransform: "capitalize",
                              letterSpacing: 0.3,
                            }}
                          >
                            {formatTypeLabel(activity.type)}
                          </span>

                          {activity.status ? (
                            <span
                              style={{
                                padding: "4px 8px",
                                borderRadius: 999,
                                background: theme.sectionBg,
                                border: `1px solid ${theme.border}`,
                                color: theme.subText,
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              {activity.status}
                            </span>
                          ) : null}
                        </div>

                        {activity.description ? (
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
                            {activity.description}
                          </p>
                        ) : null}
                      </div>

                      <div
                        style={{
                          textAlign: "right",
                          minWidth: 140,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: theme.text,
                          }}
                        >
                          {formatDateTime(activity.createdAt)}
                        </div>
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: theme.subText,
                          }}
                        >
                          {getRelativeTime(activity.createdAt)}
                        </div>
                      </div>
                    </div>

                    {(activity.createdBy || activity.meta) && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          flexWrap: "wrap",
                          paddingTop: 12,
                          marginTop: 12,
                          borderTop: `1px dashed ${theme.border}`,
                        }}
                      >
                        {activity.createdBy ? (
                          <MetaChip
                            label={`By ${activity.createdBy}`}
                            mode={mode}
                          />
                        ) : null}

                        {activity.meta ? (
                          <MetaChip label={activity.meta} mode={mode} />
                        ) : null}
                      </div>
                    )}
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
        minHeight: 260,
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
            borderRadius: 999,
            background: theme.cardBgSoft,
            border: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          🕘
        </div>

        <h4
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          No activity yet
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
          Once calls, notes, meetings, emails, or status updates are added,
          they will appear here in a clean chronological timeline.
        </p>
      </div>
    </div>
  );
}

function MetaChip({
  label,
  mode,
}: {
  label: string;
  mode: ThemeMode;
}) {
  const theme = getTheme(mode);

  return (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        background: theme.sectionBg,
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

function formatTypeLabel(type: ContactActivityItem["type"]) {
  switch (type) {
    case "call":
      return "Call";
    case "note":
      return "Note";
    case "email":
      return "Email";
    case "meeting":
      return "Meeting";
    case "task":
      return "Task";
    case "whatsapp":
      return "WhatsApp";
    case "status":
      return "Status";
    case "contact_created":
      return "Created";
    case "contact_updated":
      return "Updated";
    default:
      return "Activity";
  }
}

function getActivityIcon(type: ContactActivityItem["type"]) {
  switch (type) {
    case "call":
      return "📞";
    case "note":
      return "📝";
    case "email":
      return "✉️";
    case "meeting":
      return "📅";
    case "task":
      return "✅";
    case "whatsapp":
      return "💬";
    case "status":
      return "🔄";
    case "contact_created":
      return "✨";
    case "contact_updated":
      return "🛠️";
    default:
      return "•";
  }
}

function getActivityAccent(type: ContactActivityItem["type"]) {
  switch (type) {
    case "call":
      return {
        bg: "rgba(59,130,246,0.12)",
        border: "rgba(59,130,246,0.28)",
        text: "#2563eb",
      };
    case "note":
      return {
        bg: "rgba(168,85,247,0.12)",
        border: "rgba(168,85,247,0.28)",
        text: "#9333ea",
      };
    case "email":
      return {
        bg: "rgba(14,165,233,0.12)",
        border: "rgba(14,165,233,0.28)",
        text: "#0284c7",
      };
    case "meeting":
      return {
        bg: "rgba(245,158,11,0.12)",
        border: "rgba(245,158,11,0.28)",
        text: "#d97706",
      };
    case "task":
      return {
        bg: "rgba(34,197,94,0.12)",
        border: "rgba(34,197,94,0.28)",
        text: "#16a34a",
      };
    case "whatsapp":
      return {
        bg: "rgba(16,185,129,0.12)",
        border: "rgba(16,185,129,0.28)",
        text: "#059669",
      };
    case "status":
      return {
        bg: "rgba(244,114,182,0.12)",
        border: "rgba(244,114,182,0.28)",
        text: "#db2777",
      };
    case "contact_created":
      return {
        bg: "rgba(99,102,241,0.12)",
        border: "rgba(99,102,241,0.28)",
        text: "#4f46e5",
      };
    case "contact_updated":
      return {
        bg: "rgba(148,163,184,0.14)",
        border: "rgba(148,163,184,0.28)",
        text: "#475569",
      };
    default:
      return {
        bg: "rgba(148,163,184,0.14)",
        border: "rgba(148,163,184,0.28)",
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

  const now = new Date().getTime();
  const diffMs = now - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "Just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} min ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} hr ago`;
  if (diffMs < day * 7) return `${Math.floor(diffMs / day)} day ago`;
  return `${Math.floor(diffMs / (day * 7))} week ago`;
}