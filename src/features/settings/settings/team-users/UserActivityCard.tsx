// src/features/settings/settings/team-users/UserActivityCard.tsx

import { getTheme, type ThemeMode } from "../../../../theme";

export type UserActivityItem = {
  id: string;
  type?: string;
  title: string;
  description?: string;
  createdAt?: string;
  actor?: string;
  metadata?: string;
};

type UserActivityCardProps = {
  activities?: UserActivityItem[];
  mode?: ThemeMode;
  loading?: boolean;
  title?: string;
  maxItems?: number;
  onViewAll?: () => void;
  onActivityClick?: (activity: UserActivityItem) => void;
};

function formatDateTime(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeTime(value?: string): string {
  if (!value) return "No time";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No time";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 30) return `${days} day ago`;

  return formatDateTime(value);
}

function normalizeType(type?: string): string {
  return (type ?? "").trim().toLowerCase();
}

function getActivityMeta(type?: string) {
  const value = normalizeType(type);

  if (value === "login" || value === "sign_in") {
    return {
      icon: "🔐",
      bg: "rgba(59, 130, 246, 0.12)",
      border: "rgba(59, 130, 246, 0.24)",
      color: "#2563eb",
      label: "Login",
    };
  }

  if (value === "invite" || value === "invited") {
    return {
      icon: "✉️",
      bg: "rgba(245, 158, 11, 0.12)",
      border: "rgba(245, 158, 11, 0.24)",
      color: "#d97706",
      label: "Invite",
    };
  }

  if (value === "update" || value === "profile_update") {
    return {
      icon: "✏️",
      bg: "rgba(168, 85, 247, 0.12)",
      border: "rgba(168, 85, 247, 0.24)",
      color: "#7c3aed",
      label: "Updated",
    };
  }

  if (value === "status_change" || value === "status") {
    return {
      icon: "🔁",
      bg: "rgba(14, 165, 233, 0.12)",
      border: "rgba(14, 165, 233, 0.24)",
      color: "#0284c7",
      label: "Status",
    };
  }

  if (value === "suspend" || value === "security") {
    return {
      icon: "🚫",
      bg: "rgba(239, 68, 68, 0.12)",
      border: "rgba(239, 68, 68, 0.24)",
      color: "#dc2626",
      label: "Security",
    };
  }

  if (value === "role_change" || value === "permission") {
    return {
      icon: "🛡️",
      bg: "rgba(34, 197, 94, 0.12)",
      border: "rgba(34, 197, 94, 0.24)",
      color: "#16a34a",
      label: "Access",
    };
  }

  return {
    icon: "📝",
    bg: "rgba(100, 116, 139, 0.12)",
    border: "rgba(100, 116, 139, 0.24)",
    color: "#475569",
    label: "Activity",
  };
}

function SkeletonItem({ mode }: { mode: ThemeMode }) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        background: theme.cardBgSoft,
        padding: 14,
        display: "grid",
        gridTemplateColumns: "44px 1fr",
        gap: 12,
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
            width: "40%",
            height: 10,
            borderRadius: 999,
            background: theme.border,
          }}
        />
        <div
          style={{
            width: "68%",
            height: 12,
            borderRadius: 999,
            background: theme.borderSoft,
          }}
        />
        <div
          style={{
            width: "88%",
            height: 10,
            borderRadius: 999,
            background: theme.borderSoft,
          }}
        />
      </div>
    </div>
  );
}

export default function UserActivityCard({
  activities = [],
  mode = "light",
  loading = false,
  title = "User Activity",
  maxItems = 6,
  onViewAll,
  onActivityClick,
}: UserActivityCardProps) {
  const theme = getTheme(mode);
  const visibleActivities = activities.slice(0, Math.max(1, maxItems));

  return (
    <section
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        background: theme.cardBg,
        boxShadow:
          mode === "dark"
            ? "0 14px 34px rgba(0,0,0,0.26)"
            : "0 14px 34px rgba(15, 23, 42, 0.06)",
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
          background:
            mode === "dark"
              ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))"
              : "linear-gradient(180deg, rgba(248,250,252,0.85), rgba(248,250,252,0.35))",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: theme.subText,
              marginTop: 6,
              lineHeight: 1.5,
            }}
          >
            Track recent actions, access events, and profile changes.
          </div>
        </div>

        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.cardBgSoft,
              color: theme.text,
              borderRadius: 12,
              padding: "10px 14px",
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

      <div
        style={{
          padding: 18,
          display: "grid",
          gap: 12,
        }}
      >
        {loading ? (
          Array.from({ length: Math.min(maxItems, 5) }).map((_, index) => (
            <SkeletonItem key={index} mode={mode} />
          ))
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
              📭
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: theme.text,
                marginBottom: 6,
              }}
            >
              No activity yet
            </div>
            <div
              style={{
                fontSize: 13,
                color: theme.subText,
                lineHeight: 1.6,
              }}
            >
              User actions will appear here once access, profile, or workflow events start happening.
            </div>
          </div>
        ) : (
          visibleActivities.map((activity) => {
            const meta = getActivityMeta(activity.type);

            return (
              <button
                key={activity.id}
                type="button"
                onClick={() => onActivityClick?.(activity)}
                style={{
                  width: "100%",
                  border: `1px solid ${theme.border}`,
                  background: theme.cardBgSoft,
                  borderRadius: 18,
                  padding: 14,
                  display: "grid",
                  gridTemplateColumns: "44px 1fr",
                  gap: 12,
                  textAlign: "left",
                  cursor: onActivityClick ? "pointer" : "default",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: meta.bg,
                    border: `1px solid ${meta.border}`,
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {meta.icon}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      flexWrap: "wrap",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: 999,
                        padding: "5px 10px",
                        background: meta.bg,
                        border: `1px solid ${meta.border}`,
                        color: meta.color,
                        fontSize: 11,
                        fontWeight: 900,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {meta.label}
                    </span>

                    <span
                      style={{
                        fontSize: 12,
                        color: theme.mutedText,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatRelativeTime(activity.createdAt)}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 900,
                      color: theme.text,
                      lineHeight: 1.4,
                      marginBottom: 6,
                      wordBreak: "break-word",
                    }}
                  >
                    {activity.title}
                  </div>

                  {activity.description ? (
                    <div
                      style={{
                        fontSize: 13,
                        color: theme.subText,
                        lineHeight: 1.7,
                        wordBreak: "break-word",
                        marginBottom: 8,
                      }}
                    >
                      {activity.description}
                    </div>
                  ) : null}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                      fontSize: 12,
                      color: theme.mutedText,
                    }}
                  >
                    {activity.actor ? <span>By: {activity.actor}</span> : null}
                    {activity.metadata ? <span>{activity.metadata}</span> : null}
                    {activity.createdAt ? (
                      <span>{formatDateTime(activity.createdAt)}</span>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}