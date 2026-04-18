import React, { useMemo, useState } from "react";

export type RecommendationPriority = "high" | "medium" | "low";
export type RecommendationStatus = "new" | "in_progress" | "planned" | "done";

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  impact?: string;
  owner?: string;
  dueDate?: string;
  priority?: RecommendationPriority;
  status?: RecommendationStatus;
  tags?: string[];
  actionLabel?: string;
  onActionClick?: (item: RecommendationItem) => void;
}

export interface RecommendationsPanelProps {
  title?: string;
  subtitle?: string;
  items?: RecommendationItem[];
  loading?: boolean;
  compact?: boolean;
  maxVisible?: number;
  showFilters?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onItemClick?: (item: RecommendationItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

const defaultItems: RecommendationItem[] = [
  {
    id: "rec-1",
    title: "Clear overdue follow-ups from high-intent leads",
    description:
      "Focus first on overdue prospects that already crossed qualification and site-visit stages. This is the fastest place to recover leaking conversion.",
    category: "Execution",
    impact: "High pipeline recovery potential",
    owner: "Sales Team",
    dueDate: "Today",
    priority: "high",
    status: "new",
    tags: ["Follow-up", "High Intent", "Recovery"],
    actionLabel: "Take Action",
  },
  {
    id: "rec-2",
    title: "Reallocate spend toward top-performing lead sources",
    description:
      "Paid budget and team attention should lean toward channels with better qualification-to-closure efficiency instead of vanity volume.",
    category: "Marketing",
    impact: "Better CAC efficiency",
    owner: "Growth Lead",
    dueDate: "This Week",
    priority: "high",
    status: "planned",
    tags: ["Source Mix", "CAC", "Optimization"],
    actionLabel: "Review Sources",
  },
  {
    id: "rec-3",
    title: "Escalate aging negotiation-stage deals",
    description:
      "Deals that stay too long in negotiation quietly damage forecast quality. Escalate blockers and tighten next-step discipline.",
    category: "Pipeline",
    impact: "Improves forecast confidence",
    owner: "Closers",
    dueDate: "Tomorrow",
    priority: "medium",
    status: "in_progress",
    tags: ["Negotiation", "Forecast", "Deal Aging"],
    actionLabel: "Escalate",
  },
];

const priorityConfig: Record<
  RecommendationPriority,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    dot: string;
  }
> = {
  high: {
    label: "High",
    bg: "#FEF2F2",
    text: "#B91C1C",
    border: "#FECACA",
    dot: "#EF4444",
  },
  medium: {
    label: "Medium",
    bg: "#FFFBEB",
    text: "#B45309",
    border: "#FDE68A",
    dot: "#F59E0B",
  },
  low: {
    label: "Low",
    bg: "#F0FDF4",
    text: "#15803D",
    border: "#BBF7D0",
    dot: "#22C55E",
  },
};

const statusConfig: Record<
  RecommendationStatus,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
  }
> = {
  new: {
    label: "New",
    bg: "#EFF6FF",
    text: "#1D4ED8",
    border: "#BFDBFE",
  },
  in_progress: {
    label: "In Progress",
    bg: "#F5F3FF",
    text: "#6D28D9",
    border: "#DDD6FE",
  },
  planned: {
    label: "Planned",
    bg: "#F8FAFC",
    text: "#475569",
    border: "#CBD5E1",
  },
  done: {
    label: "Done",
    bg: "#F0FDF4",
    text: "#15803D",
    border: "#BBF7D0",
  },
};

function SkeletonLine({
  width,
  height = 12,
  radius = 999,
}: {
  width: number | string;
  height?: number;
  radius?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, rgba(226,232,240,0.8) 0%, rgba(241,245,249,1) 50%, rgba(226,232,240,0.8) 100%)",
        backgroundSize: "200% 100%",
        animation: "recommendationsPulse 1.2s ease-in-out infinite",
      }}
    />
  );
}

export default function RecommendationsPanel({
  title = "Recommendations",
  subtitle = "Smart next moves pulled from the numbers, so the team knows where to push first.",
  items = defaultItems,
  loading = false,
  compact = false,
  maxVisible = 6,
  showFilters = true,
  emptyTitle = "No recommendations right now",
  emptyDescription = "Everything looks steady for the moment. When the system spots friction, the next best moves will appear here.",
  onItemClick,
  className,
  style,
}: RecommendationsPanelProps) {
  const [activeFilter, setActiveFilter] = useState<
    "all" | RecommendationPriority
  >("all");

  const filteredItems = useMemo(() => {
    const baseItems =
      activeFilter === "all"
        ? items
        : items.filter((item) => (item.priority ?? "medium") === activeFilter);

    return baseItems.slice(0, maxVisible);
  }, [activeFilter, items, maxVisible]);

  const counts = useMemo(() => {
    return {
      all: items.length,
      high: items.filter((item) => (item.priority ?? "medium") === "high").length,
      medium: items.filter((item) => (item.priority ?? "medium") === "medium")
        .length,
      low: items.filter((item) => (item.priority ?? "medium") === "low").length,
    };
  }, [items]);

  return (
    <>
      <style>
        {`
          @keyframes recommendationsPulse {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>

      <section
        className={className}
        style={{
          borderRadius: 24,
          border: "1px solid #E2E8F0",
          background:
            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.98) 100%)",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
          overflow: "hidden",
          ...style,
        }}
      >
        <div
          style={{
            padding: compact ? 18 : 22,
            borderBottom: "1px solid #E2E8F0",
            background:
              "linear-gradient(180deg, rgba(248,250,252,0.9) 0%, rgba(255,255,255,0.96) 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 240, flex: 1 }}>
              {loading ? (
                <>
                  <SkeletonLine width="30%" height={16} />
                  <div style={{ height: 10 }} />
                  <SkeletonLine width="82%" height={12} />
                  <div style={{ height: 8 }} />
                  <SkeletonLine width="70%" height={12} />
                </>
              ) : (
                <>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: compact ? 18 : 20,
                      fontWeight: 800,
                      color: "#0F172A",
                      lineHeight: 1.2,
                      letterSpacing: -0.3,
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      marginTop: 10,
                      marginBottom: 0,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#64748B",
                      lineHeight: 1.65,
                      maxWidth: 760,
                    }}
                  >
                    {subtitle}
                  </p>
                </>
              )}
            </div>

            {!loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <SummaryBadge label="Total" value={counts.all} tone="neutral" />
                <SummaryBadge label="High" value={counts.high} tone="high" />
                <SummaryBadge label="Medium" value={counts.medium} tone="medium" />
              </div>
            ) : null}
          </div>

          {!loading && showFilters ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
              <FilterChip
                label={`All (${counts.all})`}
                active={activeFilter === "all"}
                onClick={() => setActiveFilter("all")}
              />
              <FilterChip
                label={`High (${counts.high})`}
                active={activeFilter === "high"}
                onClick={() => setActiveFilter("high")}
              />
              <FilterChip
                label={`Medium (${counts.medium})`}
                active={activeFilter === "medium"}
                onClick={() => setActiveFilter("medium")}
              />
              <FilterChip
                label={`Low (${counts.low})`}
                active={activeFilter === "low"}
                onClick={() => setActiveFilter("low")}
              />
            </div>
          ) : null}
        </div>

        <div
          style={{
            padding: compact ? 18 : 22,
          }}
        >
          {loading ? (
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`rec-skeleton-${index + 1}`}
                  style={{
                    borderRadius: 18,
                    border: "1px solid #E2E8F0",
                    background: "#FFFFFF",
                    padding: 16,
                  }}
                >
                  <SkeletonLine width="34%" height={12} />
                  <div style={{ height: 10 }} />
                  <SkeletonLine width="68%" height={18} radius={8} />
                  <div style={{ height: 10 }} />
                  <SkeletonLine width="96%" height={11} />
                  <div style={{ height: 8 }} />
                  <SkeletonLine width="88%" height={11} />
                  <div style={{ height: 12 }} />
                  <SkeletonLine width="40%" height={30} radius={999} />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div
              style={{
                borderRadius: 20,
                border: "1px dashed #CBD5E1",
                background: "#F8FAFC",
                padding: compact ? 20 : 28,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  lineHeight: 1,
                }}
              >
                ✨
              </div>
              <h4
                style={{
                  marginTop: 14,
                  marginBottom: 0,
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0F172A",
                }}
              >
                {emptyTitle}
              </h4>
              <p
                style={{
                  marginTop: 10,
                  marginBottom: 0,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#64748B",
                  lineHeight: 1.65,
                  maxWidth: 620,
                  marginInline: "auto",
                }}
              >
                {emptyDescription}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              {filteredItems.map((item, index) => {
                const priority = priorityConfig[item.priority ?? "medium"];
                const status = statusConfig[item.status ?? "new"];

                return (
                  <article
                    key={item.id}
                    onClick={() => onItemClick?.(item)}
                    style={{
                      position: "relative",
                      borderRadius: 20,
                      border: "1px solid #E2E8F0",
                      background: "#FFFFFF",
                      boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
                      padding: compact ? 16 : 18,
                      cursor: onItemClick ? "pointer" : "default",
                      transition:
                        "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: 4,
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        background: priority.dot,
                      }}
                    />

                    <div
                      style={{
                        paddingLeft: 6,
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
                        <div style={{ minWidth: 220, flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                              marginBottom: 10,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 7,
                                padding: "5px 10px",
                                borderRadius: 999,
                                background: priority.bg,
                                color: priority.text,
                                border: `1px solid ${priority.border}`,
                                fontSize: 11,
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: 0.4,
                              }}
                            >
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: priority.dot,
                                }}
                              />
                              {priority.label}
                            </span>

                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "5px 10px",
                                borderRadius: 999,
                                background: status.bg,
                                color: status.text,
                                border: `1px solid ${status.border}`,
                                fontSize: 11,
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: 0.35,
                              }}
                            >
                              {status.label}
                            </span>

                            {item.category ? (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "#64748B",
                                  padding: "5px 9px",
                                  borderRadius: 999,
                                  background: "#F8FAFC",
                                  border: "1px solid #E2E8F0",
                                }}
                              >
                                {item.category}
                              </span>
                            ) : null}
                          </div>

                          <h4
                            style={{
                              margin: 0,
                              fontSize: compact ? 16 : 17,
                              fontWeight: 800,
                              color: "#0F172A",
                              lineHeight: 1.35,
                              letterSpacing: -0.2,
                            }}
                          >
                            {index + 1}. {item.title}
                          </h4>

                          <p
                            style={{
                              marginTop: 10,
                              marginBottom: 0,
                              fontSize: 13,
                              fontWeight: 500,
                              color: "#475569",
                              lineHeight: 1.7,
                              maxWidth: 860,
                            }}
                          >
                            {item.description}
                          </p>
                        </div>

                        <div
                          style={{
                            minWidth: compact ? 180 : 220,
                            display: "grid",
                            gap: 10,
                          }}
                        >
                          {item.impact ? (
                            <InfoPill label="Impact" value={item.impact} />
                          ) : null}
                          {item.owner ? (
                            <InfoPill label="Owner" value={item.owner} />
                          ) : null}
                          {item.dueDate ? (
                            <InfoPill label="Due" value={item.dueDate} />
                          ) : null}
                        </div>
                      </div>

                      {item.tags?.length ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                            marginTop: 14,
                          }}
                        >
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: "#F8FAFC",
                                border: "1px solid #E2E8F0",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#475569",
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {item.actionLabel ? (
                        <div style={{ marginTop: 16 }}>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              item.onActionClick?.(item);
                            }}
                            style={{
                              border: "none",
                              borderRadius: 12,
                              background: "#0F172A",
                              color: "#FFFFFF",
                              padding: compact ? "10px 14px" : "11px 16px",
                              fontSize: 12,
                              fontWeight: 800,
                              cursor: "pointer",
                              boxShadow: "0 8px 18px rgba(15, 23, 42, 0.16)",
                            }}
                          >
                            {item.actionLabel}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: active ? "1px solid #3B82F6" : "1px solid #CBD5E1",
        background: active
          ? "linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 100%)"
          : "#FFFFFF",
        color: active ? "#1D4ED8" : "#475569",
        borderRadius: 999,
        padding: "8px 12px",
        fontSize: 12,
        fontWeight: 800,
        cursor: "pointer",
        transition: "all 160ms ease",
      }}
    >
      {label}
    </button>
  );
}

function SummaryBadge({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "high" | "medium" | "neutral";
}) {
  const config =
    tone === "high"
      ? {
          bg: "#FEF2F2",
          text: "#B91C1C",
          border: "#FECACA",
        }
      : tone === "medium"
      ? {
          bg: "#FFFBEB",
          text: "#B45309",
          border: "#FDE68A",
        }
      : {
          bg: "#F8FAFC",
          text: "#475569",
          border: "#CBD5E1",
        };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        background: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.35,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function InfoPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid #E2E8F0",
        background: "#F8FAFC",
        padding: "10px 12px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#64748B",
          textTransform: "uppercase",
          letterSpacing: 0.45,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 12,
          fontWeight: 700,
          color: "#0F172A",
          lineHeight: 1.45,
        }}
      >
        {value}
      </div>
    </div>
  );
}