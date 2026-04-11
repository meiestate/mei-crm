type ThemeMode = "light" | "dark";

export type ContactActivityItem = {
  id: string | number;
  type:
    | "call"
    | "email"
    | "whatsapp"
    | "meeting"
    | "note"
    | "task"
    | "status_change"
    | "tag_update"
    | string;
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
  important?: boolean;
};

type ContactActivityTimelineProps = {
  mode?: ThemeMode;
  title?: string;
  activities?: ContactActivityItem[];
  loading?: boolean;
  onAddNote?: () => void;
  onActivityClick?: (activity: ContactActivityItem) => void;
};

function getActivityTheme(type: string, mode: ThemeMode) {
  const value = type.toLowerCase();

  if (value === "call") {
    return {
      icon: "📞",
      bg: mode === "dark" ? "rgba(59,130,246,0.16)" : "rgba(59,130,246,0.10)",
      text: mode === "dark" ? "#93c5fd" : "#1d4ed8",
      border:
        mode === "dark" ? "rgba(59,130,246,0.28)" : "rgba(59,130,246,0.18)",
    };
  }

  if (value === "email") {
    return {
      icon: "✉️",
      bg:
        mode === "dark" ? "rgba(168,85,247,0.16)" : "rgba(168,85,247,0.10)",
      text: mode === "dark" ? "#d8b4fe" : "#7e22ce",
      border:
        mode === "dark" ? "rgba(168,85,247,0.28)" : "rgba(168,85,247,0.18)",
    };
  }

  if (value === "whatsapp") {
    return {
      icon: "💬",
      bg:
        mode === "dark" ? "rgba(34,197,94,0.16)" : "rgba(34,197,94,0.10)",
      text: mode === "dark" ? "#86efac" : "#15803d",
      border:
        mode === "dark" ? "rgba(34,197,94,0.28)" : "rgba(34,197,94,0.18)",
    };
  }

  if (value === "meeting") {
    return {
      icon: "📅",
      bg:
        mode === "dark" ? "rgba(245,158,11,0.16)" : "rgba(245,158,11,0.10)",
      text: mode === "dark" ? "#fcd34d" : "#b45309",
      border:
        mode === "dark" ? "rgba(245,158,11,0.28)" : "rgba(245,158,11,0.18)",
    };
  }

  if (value === "note") {
    return {
      icon: "📝",
      bg:
        mode === "dark" ? "rgba(148,163,184,0.16)" : "rgba(148,163,184,0.10)",
      text: mode === "dark" ? "#cbd5e1" : "#475569",
      border:
        mode === "dark"
          ? "rgba(148,163,184,0.28)"
          : "rgba(148,163,184,0.18)",
    };
  }

  if (value === "task") {
    return {
      icon: "✅",
      bg:
        mode === "dark" ? "rgba(14,165,233,0.16)" : "rgba(14,165,233,0.10)",
      text: mode === "dark" ? "#7dd3fc" : "#0369a1",
      border:
        mode === "dark" ? "rgba(14,165,233,0.28)" : "rgba(14,165,233,0.18)",
    };
  }

  if (value === "status_change") {
    return {
      icon: "🔁",
      bg:
        mode === "dark" ? "rgba(244,114,182,0.16)" : "rgba(244,114,182,0.10)",
      text: mode === "dark" ? "#f9a8d4" : "#be185d",
      border:
        mode === "dark" ? "rgba(244,114,182,0.28)" : "rgba(244,114,182,0.18)",
    };
  }

  return {
    icon: "•",
    bg: mode === "dark" ? "rgba(148,163,184,0.16)" : "rgba(148,163,184,0.10)",
    text: mode === "dark" ? "#cbd5e1" : "#475569",
    border:
      mode === "dark"
        ? "rgba(148,163,184,0.28)"
        : "rgba(148,163,184,0.18)",
  };
}

export default function ContactActivityTimeline({
  mode = "light",
  title = "Activity Timeline",
  activities = [],
  loading = false,
  onAddNote,
  onActivityClick,
}: ContactActivityTimelineProps) {
  const isDark = mode === "dark";

  const theme = {
    cardBg: isDark ? "#0f172a" : "#ffffff",
    cardSoft: isDark ? "#111827" : "#f8fafc",
    pageBg: isDark ? "#020617" : "#f8fafc",
    text: isDark ? "#e5e7eb" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    mutedText: isDark ? "#64748b" : "#94a3b8",
    border: isDark ? "rgba(148,163,184,0.16)" : "rgba(15,23,42,0.10)",
    borderStrong: isDark ? "rgba(148,163,184,0.22)" : "rgba(15,23,42,0.14)",
    primary: "#2563eb",
    primarySoft: isDark ? "rgba(37,99,235,0.16)" : "rgba(37,99,235,0.10)",
    shadow: isDark
      ? "0 20px 40px rgba(0,0,0,0.28)"
      : "0 16px 32px rgba(15,23,42,0.08)",
  };

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        boxShadow: theme.shadow,
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
              fontSize: 20,
              fontWeight: 800,
              color: theme.text,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: theme.subText,
              lineHeight: 1.6,
            }}
          >
            Every interaction, update, and note in one chronological view.
          </p>
        </div>

        {onAddNote ? (
          <button
            type="button"
            onClick={onAddNote}
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: 12,
              border: "none",
              background: theme.primary,
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            + Add Note
          </button>
        ) : null}
      </div>

      <div
        style={{
          padding: 20,
        }}
      >
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
                  gridTemplateColumns: "52px 1fr",
                  gap: 14,
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: theme.borderStrong,
                  }}
                />
                <div
                  style={{
                    borderRadius: 18,
                    border: `1px solid ${theme.border}`,
                    background: theme.cardSoft,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      width: "38%",
                      height: 14,
                      borderRadius: 999,
                      background: theme.borderStrong,
                      marginBottom: 12,
                    }}
                  />
                  <div
                    style={{
                      width: "72%",
                      height: 12,
                      borderRadius: 999,
                      background: theme.border,
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      width: "54%",
                      height: 12,
                      borderRadius: 999,
                      background: theme.border,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div
            style={{
              border: `1px dashed ${theme.borderStrong}`,
              background: theme.cardSoft,
              borderRadius: 20,
              padding: 28,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: theme.text,
                marginBottom: 8,
              }}
            >
              No activity yet
            </div>
            <div
              style={{
                fontSize: 13,
                lineHeight: 1.7,
                color: theme.subText,
                maxWidth: 420,
                margin: "0 auto",
              }}
            >
              Calls, notes, messages, and status updates will appear here as the
              contact journey grows.
            </div>
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              display: "grid",
              gap: 14,
            }}
          >
            {activities.map((activity, index) => {
              const activityTheme = getActivityTheme(activity.type, mode);

              return (
                <div
                  key={String(activity.id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "52px 1fr",
                    gap: 14,
                    alignItems: "start",
                    position: "relative",
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
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        border: `1px solid ${activityTheme.border}`,
                        background: activityTheme.bg,
                        color: activityTheme.text,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        fontWeight: 800,
                        zIndex: 1,
                      }}
                    >
                      {activityTheme.icon}
                    </div>

                    {index < activities.length - 1 ? (
                      <div
                        style={{
                          position: "absolute",
                          top: 42,
                          bottom: -14,
                          width: 2,
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
                      borderRadius: 18,
                      border: `1px solid ${theme.border}`,
                      background: theme.cardSoft,
                      padding: 16,
                      cursor: onActivityClick ? "pointer" : "default",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        marginBottom: 8,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 800,
                              color: theme.text,
                              lineHeight: 1.4,
                            }}
                          >
                            {activity.title}
                          </div>

                          {activity.important ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                height: 24,
                                padding: "0 8px",
                                borderRadius: 999,
                                background: theme.primarySoft,
                                color: theme.primary,
                                fontSize: 11,
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                              }}
                            >
                              Important
                            </span>
                          ) : null}
                        </div>

                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 12,
                            color: theme.subText,
                            lineHeight: 1.6,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 10,
                          }}
                        >
                          <span>{activity.createdAt}</span>
                          {activity.createdBy ? (
                            <span>• By {activity.createdBy}</span>
                          ) : null}
                          <span>• {formatActivityType(activity.type)}</span>
                        </div>
                      </div>
                    </div>

                    {activity.description ? (
                      <div
                        style={{
                          fontSize: 14,
                          color: theme.text,
                          lineHeight: 1.8,
                          whiteSpace: "pre-wrap",
                          marginBottom: activity.metadata &&
                            Object.keys(activity.metadata).length > 0
                            ? 12
                            : 0,
                        }}
                      >
                        {activity.description}
                      </div>
                    ) : null}

                    {activity.metadata &&
                    Object.keys(activity.metadata).filter(
                      (key) => activity.metadata?.[key] !== undefined &&
                        activity.metadata?.[key] !== null &&
                        String(activity.metadata?.[key]).trim() !== "",
                    ).length > 0 ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(160px, 1fr))",
                          gap: 10,
                          marginTop: 10,
                        }}
                      >
                        {Object.entries(activity.metadata).map(([key, value]) => {
                          if (
                            value === undefined ||
                            value === null ||
                            String(value).trim() === ""
                          ) {
                            return null;
                          }

                          return (
                            <MetadataTile
                              key={key}
                              label={formatMetadataKey(key)}
                              value={String(value)}
                              theme={theme}
                            />
                          );
                        })}
                      </div>
                    ) : null}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function MetadataTile({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: {
    pageBg: string;
    text: string;
    subText: string;
    border: string;
  };
}) {
  return (
    <div
      style={{
        borderRadius: 14,
        border: `1px solid ${theme.border}`,
        background: theme.pageBg,
        padding: 12,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: theme.subText,
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: theme.text,
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function formatActivityType(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMetadataKey(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}