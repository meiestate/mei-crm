import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  Clock3,
  Filter,
  Flame,
  Sparkles,
  Undo2,
  UserCheck,
  Zap,
} from "lucide-react";

export type CommunicationSmartFilterTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "purple";

export interface CommunicationSmartFilterItem {
  id: string;
  label: string;
  description?: string;
  count?: number;
  active?: boolean;
  disabled?: boolean;
  group?: string;
  icon?: ReactNode;
  tone?: CommunicationSmartFilterTone;
}

export interface CommunicationSmartFiltersProps {
  filters: CommunicationSmartFilterItem[];
  className?: string;
  compact?: boolean;
  loading?: boolean;

  title?: string;
  subtitle?: string;
  emptyText?: string;

  showHeader?: boolean;
  showFooter?: boolean;
  showGroups?: boolean;
  multiSelect?: boolean;

  onChange?: (nextFilters: CommunicationSmartFilterItem[]) => void;
  onFilterClick?: (filter: CommunicationSmartFilterItem) => void;
  onApply?: (activeFilters: CommunicationSmartFilterItem[]) => void;
  onClearAll?: () => void;
}

const wrapperStyle: CSSProperties = {
  width: "100%",
  borderRadius: 22,
  border: "1px solid var(--color-border, #e2e8f0)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.96) 100%)",
  boxShadow: "0 14px 32px rgba(15, 23, 42, 0.05)",
  overflow: "hidden",
};

const compactWrapperStyle: CSSProperties = {
  ...wrapperStyle,
  borderRadius: 18,
};

const headerStyle: CSSProperties = {
  padding: "16px 16px 14px 16px",
  borderBottom: "1px solid var(--color-border-soft, #eef2f7)",
};

const compactHeaderStyle: CSSProperties = {
  ...headerStyle,
  padding: "14px 14px 12px 14px",
};

const headerRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const headerLeftStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  minWidth: 0,
  flex: "1 1 280px",
};

const iconWrapStyle: CSSProperties = {
  width: 42,
  height: 42,
  minWidth: 42,
  borderRadius: 14,
  display: "grid",
  placeItems: "center",
  background:
    "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(14,165,233,0.10))",
  border: "1px solid rgba(37,99,235,0.10)",
  color: "var(--color-primary, #2563eb)",
};

const compactIconWrapStyle: CSSProperties = {
  ...iconWrapStyle,
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: 12,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 800,
  letterSpacing: "-0.02em",
  color: "var(--color-text, #0f172a)",
};

const subtitleStyle: CSSProperties = {
  margin: "4px 0 0 0",
  fontSize: 12.5,
  lineHeight: 1.55,
  color: "var(--color-text-muted, #64748b)",
};

const activeSummaryStyle: CSSProperties = {
  minHeight: 34,
  padding: "7px 12px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: "rgba(37,99,235,0.08)",
  color: "var(--color-primary, #2563eb)",
  border: "1px solid rgba(37,99,235,0.12)",
  fontSize: 12,
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const bodyStyle: CSSProperties = {
  display: "grid",
  gap: 14,
  padding: 14,
};

const compactBodyStyle: CSSProperties = {
  ...bodyStyle,
  gap: 12,
  padding: 12,
};

const groupStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const groupTitleStyle: CSSProperties = {
  margin: "0 0 2px 0",
  padding: "0 4px",
  fontSize: 11.5,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--color-text-muted, #64748b)",
};

const chipGridStyle: CSSProperties = {
  display: "flex",
  alignItems: "stretch",
  gap: 8,
  flexWrap: "wrap",
};

const chipStyle: CSSProperties = {
  minHeight: 44,
  padding: "10px 12px",
  borderRadius: 16,
  border: "1px solid var(--color-border-soft, #e2e8f0)",
  background: "var(--color-surface, #ffffff)",
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  cursor: "pointer",
  transition: "all 0.18s ease",
  maxWidth: "100%",
};

const compactChipStyle: CSSProperties = {
  ...chipStyle,
  minHeight: 40,
  padding: "8px 10px",
  borderRadius: 14,
};

const disabledChipStyle: CSSProperties = {
  opacity: 0.5,
  cursor: "not-allowed",
  pointerEvents: "none",
};

const chipIconStyle: CSSProperties = {
  width: 30,
  height: 30,
  minWidth: 30,
  borderRadius: 10,
  display: "grid",
  placeItems: "center",
  background: "var(--color-surface-soft, #f8fafc)",
  border: "1px solid var(--color-border-soft, #e2e8f0)",
};

const compactChipIconStyle: CSSProperties = {
  ...chipIconStyle,
  width: 28,
  height: 28,
  minWidth: 28,
  borderRadius: 9,
};

const chipContentStyle: CSSProperties = {
  minWidth: 0,
  display: "grid",
  gap: 2,
};

const chipLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: 12.5,
  fontWeight: 800,
  lineHeight: 1.2,
  color: "var(--color-text, #0f172a)",
};

const chipDescriptionStyle: CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  lineHeight: 1.35,
  color: "var(--color-text-muted, #64748b)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 210,
};

const chipCountStyle: CSSProperties = {
  minWidth: 24,
  height: 24,
  padding: "0 8px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(15,23,42,0.06)",
  color: "var(--color-text-soft, #334155)",
  fontSize: 11,
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const footerStyle: CSSProperties = {
  padding: "12px 16px",
  borderTop: "1px solid var(--color-border-soft, #eef2f7)",
  background: "var(--color-surface-soft, #f8fafc)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const footerLeftStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const footerTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 12.5,
  color: "var(--color-text-muted, #64748b)",
  lineHeight: 1.5,
};

const buttonStyle: CSSProperties = {
  height: 36,
  padding: "0 12px",
  borderRadius: 12,
  border: "1px solid var(--color-border, #dbe2ea)",
  background: "var(--color-surface, #ffffff)",
  color: "var(--color-text, #0f172a)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const primaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "var(--color-primary, #2563eb)",
  color: "#ffffff",
  border: "1px solid var(--color-primary, #2563eb)",
  boxShadow: "0 10px 22px rgba(37,99,235,0.16)",
};

const emptyStateStyle: CSSProperties = {
  padding: "22px 16px",
  textAlign: "center",
  fontSize: 13,
  color: "var(--color-text-muted, #64748b)",
};

const skeletonStyle: CSSProperties = {
  height: 40,
  borderRadius: 14,
  background:
    "linear-gradient(90deg, rgba(241,245,249,1) 25%, rgba(226,232,240,0.85) 37%, rgba(241,245,249,1) 63%)",
  backgroundSize: "400% 100%",
  animation: "communicationSmartFiltersShimmer 1.4s ease infinite",
};

function getDefaultIcon(id: string) {
  const normalized = id.toLowerCase();

  if (
    normalized.includes("hot") ||
    normalized.includes("priority") ||
    normalized.includes("urgent")
  ) {
    return <Flame size={15} />;
  }

  if (
    normalized.includes("follow") ||
    normalized.includes("pending") ||
    normalized.includes("late")
  ) {
    return <Clock3 size={15} />;
  }

  if (
    normalized.includes("assigned") ||
    normalized.includes("owner") ||
    normalized.includes("agent")
  ) {
    return <UserCheck size={15} />;
  }

  if (
    normalized.includes("verified") ||
    normalized.includes("qualified") ||
    normalized.includes("approved")
  ) {
    return <BadgeCheck size={15} />;
  }

  if (
    normalized.includes("instant") ||
    normalized.includes("fast") ||
    normalized.includes("quick")
  ) {
    return <Zap size={15} />;
  }

  return <Sparkles size={15} />;
}

function getToneStyles(tone: CommunicationSmartFilterTone, active?: boolean) {
  const tones: Record<CommunicationSmartFilterTone, CSSProperties> = {
    default: {
      color: "#334155",
      background: active ? "#f8fafc" : "#ffffff",
      border: "1px solid #e2e8f0",
    },
    primary: {
      color: "#2563eb",
      background: active ? "#dbeafe" : "#eff6ff",
      border: "1px solid #bfdbfe",
    },
    success: {
      color: "#15803d",
      background: active ? "#dcfce7" : "#f0fdf4",
      border: "1px solid #bbf7d0",
    },
    warning: {
      color: "#b45309",
      background: active ? "#ffedd5" : "#fff7ed",
      border: "1px solid #fed7aa",
    },
    danger: {
      color: "#b91c1c",
      background: active ? "#fee2e2" : "#fff1f2",
      border: "1px solid #fecaca",
    },
    purple: {
      color: "#7c3aed",
      background: active ? "#ede9fe" : "#f5f3ff",
      border: "1px solid #ddd6fe",
    },
  };

  return tones[tone];
}

function groupFilters(
  filters: CommunicationSmartFilterItem[],
  showGroups: boolean,
): Array<{ title: string; items: CommunicationSmartFilterItem[] }> {
  if (!showGroups) {
    return [{ title: "", items: filters }];
  }

  const grouped = new Map<string, CommunicationSmartFilterItem[]>();

  filters.forEach((filter) => {
    const key = filter.group?.trim() || "Smart Picks";
    const current = grouped.get(key) ?? [];
    current.push(filter);
    grouped.set(key, current);
  });

  return Array.from(grouped.entries()).map(([title, items]) => ({
    title,
    items,
  }));
}

function LoadingState({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <style>
        {`
          @keyframes communicationSmartFiltersShimmer {
            0% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
          }
        `}
      </style>
      <div style={chipGridStyle}>
        <div style={{ ...skeletonStyle, width: compact ? 120 : 140 }} />
        <div style={{ ...skeletonStyle, width: compact ? 150 : 180 }} />
        <div style={{ ...skeletonStyle, width: compact ? 110 : 130 }} />
        <div style={{ ...skeletonStyle, width: compact ? 160 : 190 }} />
      </div>
    </>
  );
}

export default function CommunicationSmartFilters({
  filters,
  className,
  compact = false,
  loading = false,
  title = "Smart Filters",
  subtitle = "Apply quick communication views to surface hot leads, pending follow-ups, and high-signal conversations faster.",
  emptyText = "No smart filters available right now.",
  showHeader = true,
  showFooter = true,
  showGroups = true,
  multiSelect = true,
  onChange,
  onFilterClick,
  onApply,
  onClearAll,
}: CommunicationSmartFiltersProps) {
  const groupedFilters = groupFilters(filters, showGroups);
  const activeFilters = filters.filter((filter) => filter.active);
  const activeCount = activeFilters.length;

  const handleToggle = (target: CommunicationSmartFilterItem) => {
    if (target.disabled) return;

    const nextFilters = filters.map((filter) => {
      if (filter.id !== target.id) {
        return multiSelect ? filter : { ...filter, active: false };
      }

      return {
        ...filter,
        active: multiSelect ? !filter.active : true,
      };
    });

    onChange?.(nextFilters);
    onFilterClick?.(target);
  };

  const handleClearAll = () => {
    onClearAll?.();

    if (onChange) {
      onChange(filters.map((filter) => ({ ...filter, active: false })));
    }
  };

  return (
    <section
      className={className}
      style={compact ? compactWrapperStyle : wrapperStyle}
    >
      {showHeader ? (
        <div style={compact ? compactHeaderStyle : headerStyle}>
          <div style={headerRowStyle}>
            <div style={headerLeftStyle}>
              <div style={compact ? compactIconWrapStyle : iconWrapStyle}>
                <Filter size={compact ? 17 : 18} />
              </div>

              <div style={{ minWidth: 0 }}>
                <h3 style={titleStyle}>{title}</h3>
                <p style={subtitleStyle}>{subtitle}</p>
              </div>
            </div>

            <div style={activeSummaryStyle}>
              <Sparkles size={14} />
              {activeCount} active
            </div>
          </div>
        </div>
      ) : null}

      <div style={compact ? compactBodyStyle : bodyStyle}>
        {loading ? (
          <LoadingState compact={compact} />
        ) : filters.length === 0 ? (
          <div style={emptyStateStyle}>{emptyText}</div>
        ) : (
          groupedFilters.map((group) => (
            <div key={group.title || "default"} style={groupStyle}>
              {showGroups && group.title ? (
                <p style={groupTitleStyle}>{group.title}</p>
              ) : null}

              <div style={chipGridStyle}>
                {group.items.map((filter) => {
                  const tone = getToneStyles(
                    filter.tone ?? "default",
                    filter.active,
                  );

                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => handleToggle(filter)}
                      aria-pressed={Boolean(filter.active)}
                      title={filter.label}
                      style={{
                        ...(compact ? compactChipStyle : chipStyle),
                        ...tone,
                        ...(filter.active
                          ? {
                              boxShadow: "0 10px 22px rgba(15,23,42,0.08)",
                              transform: "translateY(-1px)",
                            }
                          : null),
                        ...(filter.disabled ? disabledChipStyle : null),
                      }}
                    >
                      <div
                        style={{
                          ...(compact ? compactChipIconStyle : chipIconStyle),
                          color: tone.color,
                          background: "rgba(255,255,255,0.58)",
                          border: "1px solid rgba(255,255,255,0.45)",
                        }}
                      >
                        {filter.icon ?? getDefaultIcon(filter.id)}
                      </div>

                      <div style={chipContentStyle}>
                        <p style={chipLabelStyle}>{filter.label}</p>
                        {filter.description ? (
                          <p style={chipDescriptionStyle}>{filter.description}</p>
                        ) : null}
                      </div>

                      {typeof filter.count === "number" ? (
                        <span style={chipCountStyle}>{filter.count}</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {showFooter && !loading && filters.length > 0 ? (
        <div style={footerStyle}>
          <div style={footerLeftStyle}>
            <p style={footerTextStyle}>
              {activeCount > 0
                ? `${activeCount} smart filter${activeCount === 1 ? "" : "s"} currently active.`
                : "No smart filters are active right now."}
            </p>

            {activeCount > 0 ? (
              <button type="button" onClick={handleClearAll} style={buttonStyle}>
                <Undo2 size={14} />
                Clear All
              </button>
            ) : null}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              onClick={() => onApply?.(activeFilters)}
              style={primaryButtonStyle}
            >
              <Zap size={14} />
              Apply Filters
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}