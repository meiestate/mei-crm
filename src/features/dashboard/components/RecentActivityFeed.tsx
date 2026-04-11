// src/features/dashboard/components/RecentActivityFeed.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { DashboardActivityItem } from "../api/dashboardApi";

type RecentActivityFeedProps = {
  activities?: DashboardActivityItem[];
  mode?: ThemeMode;
  loading?: boolean;
  title?: string;
  onViewAll?: () => void;
  onActivityClick?: (activity: DashboardActivityItem) => void;
};

function formatDateTime(value?: string): string {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getActivityMeta(type?: string) {
  const value = (type ?? "").toLowerCase();

  if (value.includes("call")) {
    return {
      icon: "📞",
      label: "Call",
      bg: "rgba(59, 130, 246, 0.12)",
      color: "#2563eb",
      border: "rgba(59, 130, 246, 0.22)",
    };
  }

  if (value.includes("email")) {
    return {
      icon: "✉️",
      label: "Email",
      bg: "rgba(168, 85, 247, 0.12)",
      color: "#7c3aed",
      border: "rgba(168, 85, 247, 0.22)",
    };
  }

  if (value.includes("meeting")) {
    return {
      icon: "📅",
      label: "Meeting",
      bg: "rgba(14, 165, 233, 0.12)",
      color: "#0284c7",
      border: "rgba(14, 165, 233, 0.22)",
    };
  }

  if (value.includes("task")) {
    return {
      icon: "✅",
      label: "Task",
      bg: "rgba(34, 197, 94, 0.12)",
      color: "#16a34a",
      border: "rgba(34, 197, 94, 0.22)",
    };
  }

  if (value.includes("whatsapp")) {
    return {
      icon: "💬",
      label: "WhatsApp",
      bg: "rgba(16, 185, 129, 0.12)",
      color: "#059669",
      border: "rgba(16, 185, 129, 0.22)",
    };
  }

  if (value.includes("note")) {
    return {
      icon: "📝",
      label: "Note",
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#d97706",
      border: "rgba(245, 158, 11, 0.22)",
    };
  }

  return {
    icon: "⚡",
    label: "Activity",
    bg: "rgba(100, 116, 139, 0.12)",
    color: "#475569",
    border: "rgba(100, 116, 139, 0.22)",
  };
}

function getEntityLabel(entityType?: string) {
  const value = (entityType ?? "").toLowerCase();

  if (value.includes("lead")) return "Lead";
  if (value.includes("contact")) return "Contact";
  if (value.includes("deal")) return "Deal";
  if (value.includes("task")) return "Task";

  return "Record";
}

export default function RecentActivityFeed({
  activities = [],
  mode = "light",
  loading = false,
  title = "Recent Activity",
  onViewAll,
  onActivityClick,
}: RecentActivityFeedProps) {
  const theme = getTheme(mode);

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 20,
        boxShadow:
          mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.28)"
            : "0 10px 30px rgba(15, 23, 42, 0.06)",
        minHeight: 400,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: theme.text,
              lineHeight: 1.2,
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
            Live movement across leads, contacts, deals, and tasks.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          style={{
            border: `1px solid ${theme.border}`,
            background: theme.cardBgSoft,
            color: theme.text,
            borderRadius: 10,
            padding: "8px 12px",
            fontSize: 13,
            fontWeight: 600,
            cursor: onViewAll ? "pointer" : "default",
            opacity: onViewAll ? 1 : 0.72,
          }}
        >
          View All
        </button>
      </div>

      {loading ? (
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "44px 1fr",
                gap: 12,
                alignItems: "start",
                border: `1px solid ${theme.borderSoft}`,
                background: theme.cardBgSoft,
                borderRadius: 16,
                padding: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: theme.border,
                }}
              />
              <div style={{ display: "grid", gap: 8 }}>
                <div
                  style={{
                    height: 12,
                    width: "52%",
                    background: theme.border,
                    borderRadius: 999,
                  }}
                />
                <div
                  style={{
                    height: 10,
                    width: "78%",
                    background: theme.borderSoft,
                    borderRadius: 999,
                  }}
                />
                <div
                  style={{
                    height: 10,
                    width: "34%",
                    background: theme.borderSoft,
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div
          style={{
            flex: 1,
            border: `1px dashed ${theme.border}`,
            borderRadius: 18,
            background: theme.cardBgSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 34,
                lineHeight: 1,
                marginBottom: 10,
              }}
            >
              🕘
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: theme.text,
                marginBottom: 6,
              }}
            >
              No recent activity
            </div>
            <div
              style={{
                fontSize: 13,
                color: theme.subText,
              }}
            >
              Fresh updates from your CRM will appear here.
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {activities.map((activity) => {
            const meta = getActivityMeta(activity.type);
            const entityLabel = getEntityLabel(activity.entityType);

            return (
              <button
                key={activity.id}
                type="button"
                onClick={() => onActivityClick?.(activity)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: `1px solid ${theme.borderSoft}`,
                  background: theme.cardBgSoft,
                  borderRadius: 16,
                  padding: 14,
                  cursor: onActivityClick ? "pointer" : "default",
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: meta.bg,
                    border: `1px solid ${meta.border}`,
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {meta.icon}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "start",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: theme.text,
                          lineHeight: 1.35,
                          marginBottom: 6,
                          wordBreak: "break-word",
                        }}
                      >
                        {activity.title}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: 999,
                            padding: "4px 10px",
                            background: meta.bg,
                            color: meta.color,
                            border: `1px solid ${meta.border}`,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {meta.label}
                        </span>

                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: 999,
                            padding: "4px 10px",
                            background: theme.cardBg,
                            color: theme.subText,
                            border: `1px solid ${theme.border}`,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {entityLabel}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: theme.subText,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {formatDateTime(activity.createdAt)}
                    </div>
                  </div>

                  {activity.description ? (
                    <div
                      style={{
                        fontSize: 13,
                        lineHeight: 1.55,
                        color: theme.subText,
                        marginBottom: 10,
                        wordBreak: "break-word",
                      }}
                    >
                      {activity.description}
                    </div>
                  ) : null}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        border: `1px solid ${theme.border}`,
                        borderRadius: 12,
                        padding: "10px 12px",
                        background: theme.cardBg,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: theme.mutedText,
                          marginBottom: 4,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        Actor
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: theme.text,
                          wordBreak: "break-word",
                        }}
                      >
                        {activity.actor || "System"}
                      </div>
                    </div>

                    <div
                      style={{
                        border: `1px solid ${theme.border}`,
                        borderRadius: 12,
                        padding: "10px 12px",
                        background: theme.cardBg,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: theme.mutedText,
                          marginBottom: 4,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        Record ID
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: theme.text,
                          wordBreak: "break-word",
                        }}
                      >
                        {activity.entityId || "Not linked"}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}