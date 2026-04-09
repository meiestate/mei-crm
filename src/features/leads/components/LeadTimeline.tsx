import React, { useEffect, useMemo, useState } from "react";

export type LeadTimelineActivityType =
  | "Note"
  | "Call"
  | "Email"
  | "WhatsApp"
  | "Follow-Up"
  | "Site Visit"
  | "Status Change"
  | "Task"
  | "Deal";

export type LeadTimelineItem = {
  id: string;
  type: LeadTimelineActivityType;
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
  isPinned?: boolean;
};

type LeadTimelineProps = {
  leadId: string;
  title?: string;
  initialItems?: LeadTimelineItem[];
  storageKey?: string;
  onTimelineChange?: (items: LeadTimelineItem[]) => void;
};

const DEFAULT_STORAGE_KEY = "mei-crm-lead-timeline";

export default function LeadTimeline({
  leadId,
  title = "Lead Timeline",
  initialItems = [],
  storageKey = DEFAULT_STORAGE_KEY,
  onTimelineChange,
}: LeadTimelineProps) {
  const [items, setItems] = useState<LeadTimelineItem[]>([]);
  const [activityType, setActivityType] =
    useState<LeadTimelineActivityType>("Note");
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const scopedStorageKey = useMemo(
    () => `${storageKey}-${leadId}`,
    [storageKey, leadId]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(scopedStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as LeadTimelineItem[];
        setItems(sortTimelineItems(parsed));
        return;
      }
    } catch (error) {
      console.error("Failed to read lead timeline:", error);
    }

    setItems(sortTimelineItems(initialItems));
  }, [scopedStorageKey, initialItems]);

  useEffect(() => {
    try {
      localStorage.setItem(scopedStorageKey, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save lead timeline:", error);
    }

    onTimelineChange?.(items);
  }, [items, scopedStorageKey, onTimelineChange]);

  const pinnedCount = items.filter((item) => item.isPinned).length;
  const totalCount = items.length;

  const handleAddActivity = () => {
    const trimmedTitle = activityTitle.trim();
    const trimmedDescription = activityDescription.trim();
    const trimmedCreatedBy = createdBy.trim();

    if (!trimmedTitle) return;

    const newItem: LeadTimelineItem = {
      id: `timeline-${Date.now()}`,
      type: activityType,
      title: trimmedTitle,
      description: trimmedDescription,
      createdAt: new Date().toISOString(),
      createdBy: trimmedCreatedBy || undefined,
      isPinned: false,
    };

    setItems((prev) => sortTimelineItems([newItem, ...prev]));
    setActivityType("Note");
    setActivityTitle("");
    setActivityDescription("");
    setCreatedBy("");
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setItems((prev) =>
      sortTimelineItems(
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                isPinned: !item.isPinned,
              }
            : item
        )
      )
    );
  };

  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 22,
        padding: 20,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
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
              color: "#0f172a",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            Every touchpoint matters. Track the rhythm of calls, notes, visits,
            and deal movement in one place.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <StatBadge label="Total" value={String(totalCount)} />
          <StatBadge label="Pinned" value={String(pinnedCount)} />
        </div>
      </div>

      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          background: "#f8fafc",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Add Activity
        </div>

        <div style={gridStyle}>
          <FieldBlock label="Activity Type">
            <select
              value={activityType}
              onChange={(e) =>
                setActivityType(e.target.value as LeadTimelineActivityType)
              }
              style={inputStyle}
            >
              <option value="Note">Note</option>
              <option value="Call">Call</option>
              <option value="Email">Email</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Follow-Up">Follow-Up</option>
              <option value="Site Visit">Site Visit</option>
              <option value="Status Change">Status Change</option>
              <option value="Task">Task</option>
              <option value="Deal">Deal</option>
            </select>
          </FieldBlock>

          <FieldBlock label="Title *">
            <input
              type="text"
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
              placeholder="Called lead and discussed budget..."
              style={inputStyle}
            />
          </FieldBlock>

          <FieldBlock label="Created By">
            <input
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              placeholder="Sales rep / admin / owner"
              style={inputStyle}
            />
          </FieldBlock>
        </div>

        <FieldBlock label="Description">
          <textarea
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
            placeholder="Write what exactly happened, what the lead said, what the next action is..."
            rows={4}
            style={textareaStyle}
          />
        </FieldBlock>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={handleAddActivity}
            disabled={!activityTitle.trim()}
            style={{
              ...primaryButtonStyle,
              opacity: activityTitle.trim() ? 1 : 0.55,
              cursor: activityTitle.trim() ? "pointer" : "not-allowed",
            }}
          >
            Add Activity
          </button>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {items.length === 0 ? (
          <div
            style={{
              border: "1px dashed #cbd5e1",
              borderRadius: 18,
              background: "#f8fafc",
              padding: "28px 18px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              No timeline activity yet
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              Start logging interactions so this lead’s story becomes visible
              from first touch to final outcome.
            </div>
          </div>
        ) : (
          items.map((item, index) => {
            const typeStyle = getTypeBadgeStyle(item.type);

            return (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr",
                  gap: 14,
                  alignItems: "stretch",
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
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: typeStyle.dot,
                      border: "3px solid #ffffff",
                      boxShadow: `0 0 0 1px ${typeStyle.border}`,
                      marginTop: 18,
                      zIndex: 2,
                    }}
                  />
                  {index !== items.length - 1 ? (
                    <div
                      style={{
                        position: "absolute",
                        top: 32,
                        bottom: -16,
                        width: 2,
                        background: "#e2e8f0",
                      }}
                    />
                  ) : null}
                </div>

                <article
                  style={{
                    border: item.isPinned
                      ? "1px solid #fde68a"
                      : "1px solid #e2e8f0",
                    borderRadius: 18,
                    background: item.isPinned ? "#fffbeb" : "#ffffff",
                    padding: 16,
                    boxShadow: item.isPinned
                      ? "0 10px 20px rgba(245, 158, 11, 0.10)"
                      : "0 6px 16px rgba(15, 23, 42, 0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                          marginBottom: 8,
                        }}
                      >
                        {item.isPinned ? (
                          <span style={pinnedBadgeStyle}>📌 Pinned</span>
                        ) : null}

                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "6px 10px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 800,
                            border: `1px solid ${typeStyle.border}`,
                            background: typeStyle.background,
                            color: typeStyle.color,
                          }}
                        >
                          {getTypeIcon(item.type)} {item.type}
                        </span>

                        <span style={metaBadgeStyle}>
                          {formatDateTime(item.createdAt)}
                        </span>

                        {item.createdBy ? (
                          <span style={metaBadgeStyle}>
                            By: {item.createdBy}
                          </span>
                        ) : null}
                      </div>

                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: "#0f172a",
                          lineHeight: 1.5,
                          marginBottom: 6,
                        }}
                      >
                        {item.title}
                      </div>

                      {item.description?.trim() ? (
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            color: "#475569",
                            lineHeight: 1.7,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.description}
                        </p>
                      ) : null}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleTogglePin(item.id)}
                        style={secondaryButtonStyle}
                      >
                        {item.isPinned ? "Unpin" : "Pin"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        style={{
                          ...secondaryButtonStyle,
                          color: "#b91c1c",
                          border: "1px solid #fecaca",
                          background: "#fff1f2",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <label
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#334155",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        minWidth: 76,
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        background: "#f8fafc",
        padding: "10px 12px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          color: "#0f172a",
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function sortTimelineItems(items: LeadTimelineItem[]) {
  return [...items].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function getTypeIcon(type: LeadTimelineActivityType) {
  switch (type) {
    case "Call":
      return "📞";
    case "Email":
      return "✉️";
    case "WhatsApp":
      return "💬";
    case "Follow-Up":
      return "🗓️";
    case "Site Visit":
      return "📍";
    case "Status Change":
      return "🔄";
    case "Task":
      return "✅";
    case "Deal":
      return "💼";
    case "Note":
    default:
      return "📝";
  }
}

function getTypeBadgeStyle(type: LeadTimelineActivityType) {
  switch (type) {
    case "Call":
      return {
        background: "#eff6ff",
        color: "#1d4ed8",
        border: "#bfdbfe",
        dot: "#2563eb",
      };
    case "Email":
      return {
        background: "#f5f3ff",
        color: "#7c3aed",
        border: "#ddd6fe",
        dot: "#8b5cf6",
      };
    case "WhatsApp":
      return {
        background: "#ecfdf5",
        color: "#15803d",
        border: "#bbf7d0",
        dot: "#16a34a",
      };
    case "Follow-Up":
      return {
        background: "#fffbeb",
        color: "#a16207",
        border: "#fde68a",
        dot: "#ca8a04",
      };
    case "Site Visit":
      return {
        background: "#fff7ed",
        color: "#c2410c",
        border: "#fdba74",
        dot: "#ea580c",
      };
    case "Status Change":
      return {
        background: "#eef2ff",
        color: "#4338ca",
        border: "#c7d2fe",
        dot: "#4f46e5",
      };
    case "Task":
      return {
        background: "#ecfeff",
        color: "#0f766e",
        border: "#a5f3fc",
        dot: "#0891b2",
      };
    case "Deal":
      return {
        background: "#fdf2f8",
        color: "#be185d",
        border: "#fbcfe8",
        dot: "#db2777",
      };
    case "Note":
    default:
      return {
        background: "#f8fafc",
        color: "#475569",
        border: "#cbd5e1",
        dot: "#64748b",
      };
  }
}

function formatDateTime(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 14,
  padding: "0 14px",
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  resize: "vertical",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  padding: "12px 14px",
  fontSize: 14,
  lineHeight: 1.6,
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
};

const primaryButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 16px",
  borderRadius: 12,
  border: "none",
  background: "#0f172a",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 700,
};

const secondaryButtonStyle: React.CSSProperties = {
  height: 36,
  padding: "0 14px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const metaBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: 999,
  background: "#f1f5f9",
  color: "#475569",
  fontSize: 12,
  fontWeight: 700,
};

const pinnedBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: 999,
  background: "#fef3c7",
  color: "#b45309",
  fontSize: 12,
  fontWeight: 800,
};