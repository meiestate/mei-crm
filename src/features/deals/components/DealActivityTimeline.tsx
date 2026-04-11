// src/features/deals/components/DealActivityTimeline.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { DealActivity } from "../api/dealsApi";

type DealActivityTimelineProps = {
  activities?: DealActivity[];
  mode?: ThemeMode;
  loading?: boolean;
  title?: string;
  maxItems?: number;
  onAddNote?: () => void;
  onActivityClick?: (activity: DealActivity) => void;
};

function formatDateTime(value?: string): string {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDateOnly(value?: string): string {
  if (!value) return "Unknown date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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

  if (value.includes("status_change")) {
    return {
      icon: "🔄",
      label: "Status Change",
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#d97706",
      border: "rgba(245, 158, 11, 0.22)",
    };
  }

  if (value.includes("stage_change")) {
    return {
      icon: "🧭",
      label: "Stage Change",
      bg: "rgba(99, 102, 241, 0.12)",
      color: "#4f46e5",
      border: "rgba(99, 102, 241, 0.22)",
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
    label: "System",
    bg: "rgba(100, 116, 139, 0.12)",
    color: "#475569",
    border: "rgba(100, 116, 139, 0.22)",
  };
}

function groupActivitiesByDate(activities: DealActivity[]) {
  const groups = new Map<string, DealActivity[]>();

  activities.forEach((activity) => {
    const key = formatDateOnly(activity.createdAt);
    const current = groups.get(key) ?? [];
    current.push(activity);
    groups.set(key, current);
  });

  return Array.from(groups.entries()).map(([date, items]) => ({
    date,
    items,
  }));
}

export default function DealActivityTimeline({
  activities = [],
  mode = "light",
  loading = false,
  title = "Deal Activity Timeline",
  maxItems,
  onAddNote,
  onActivityClick,
}: DealActivityTimelineProps) {
  const theme = getTheme(mode);

  const sortedActivities = [...activities].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const visibleActivities =
    typeof maxItems === "number" && maxItems > 0
      ? sortedActivities.slice(0, maxItems)
      : sortedActivities;

  const groupedActivities = groupActivitiesByDate(visibleActivities);

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
            Every move around this deal, all in one clean timeline.
          </p>
        </div>

        {onAddNote ? (
          <button
            type="button"
            onClick={onAddNote}
            style={{
              border: "none",
              background: theme.primary,
              color: theme.inverseText ?? "#ffffff",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            + Add Note
          </button>
        ) : null}
      </div>

      {loading ? (
        <div
          style={{
            display: "grid",
            gap: 14,
          }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr",
                gap: 14,
                alignItems: "start",
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
              <div
                style={{
                  border: `1px solid ${theme.borderSoft}`,
                  background: theme.cardBgSoft,
                  borderRadius: 16,
                  padding: 14,
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    height: 12,
                    width: "38%",
                    borderRadius: 999,
                    background: theme.border,
                  }}
                />
                <div
                  style={{
                    height: 10,
                    width: "72%",
                    borderRadius: 999,
                    background: theme.borderSoft,
                  }}
                />
                <div
                  style={{
                    height: 10,
                    width: "30%",
                    borderRadius: 999,
                    background: theme.borderSoft,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : visibleActivities.length === 0 ? (
        <div
          style={{
            border: `1px dashed ${theme.border}`,
            borderRadius: 18,
            background: theme.cardBgSoft,
            padding: 28,
            textAlign: "center",
          }}
        >
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
            No deal activity yet
          </div>
          <div
            style={{
              fontSize: 13,
              color: theme.subText,
            }}
          >
            Calls, meetings, notes, and stage updates will show here.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 18,
          }}
        >
          {groupedActivities.map((group) => (
            <div
              key={group.date}
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  alignSelf: "start",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: 999,
                    padding: "6px 12px",
                    background: theme.cardBgSoft,
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {group.date}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 14,
                }}
              >
                {group.items.map((activity, index) => {
                  const meta = getActivityMeta(activity.type);
                  const isLast = index === group.items.length - 1;

                  return (
                    <div
                      key={activity.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "56px 1fr",
                        gap: 14,
                        alignItems: "start",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            background: meta.bg,
                            border: `1px solid ${meta.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20,
                            zIndex: 1,
                          }}
                        >
                          {meta.icon}
                        </div>

                        {!isLast ? (
                          <div
                            style={{
                              position: "absolute",
                              top: 44,
                              width: 2,
                              bottom: -18,
                              background: theme.border,
                            }}
                          />
                        ) : null}
                      </div>

                      <button
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
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 12,
                            marginBottom: 10,
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1 }}>
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

                              {activity.entityType ? (
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
                                  {activity.entityType}
                                </span>
                              ) : null}
                            </div>

                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: theme.text,
                                lineHeight: 1.35,
                                wordBreak: "break-word",
                              }}
                            >
                              {activity.title}
                            </div>
                          </div>

                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: theme.subText,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDateTime(activity.createdAt)}
                          </div>
                        </div>

                        {activity.description ? (
                          <div
                            style={{
                              fontSize: 13,
                              lineHeight: 1.6,
                              color: theme.subText,
                              marginBottom: 12,
                              wordBreak: "break-word",
                            }}
                          >
                            {activity.description}
                          </div>
                        ) : null}

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
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
                              Created By
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: theme.text,
                                wordBreak: "break-word",
                              }}
                            >
                              {activity.createdBy || "System"}
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
                              Entity ID
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: theme.text,
                                wordBreak: "break-word",
                              }}
                            >
                              {activity.entityId || activity.dealId}
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}