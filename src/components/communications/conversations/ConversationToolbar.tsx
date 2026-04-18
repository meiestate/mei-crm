import type { CSSProperties, ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  MessageSquarePlus,
  RefreshCcw,
  Rows3,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

export interface ConversationToolbarProps {
  title?: string;
  subtitle?: string;
  className?: string;

  totalCount?: number;
  unreadCount?: number;
  activeFilterCount?: number;

  loading?: boolean;
  compact?: boolean;
  sticky?: boolean;

  filtersExpanded?: boolean;
  showFiltersToggle?: boolean;
  showRefreshButton?: boolean;
  showComposeButton?: boolean;
  showMetrics?: boolean;

  onToggleFilters?: () => void;
  onRefresh?: () => void;
  onCompose?: () => void;

  searchSlot?: ReactNode;
  filtersSlot?: ReactNode;
  actionsSlot?: ReactNode;
}

const wrapperStyle: CSSProperties = {
  width: "100%",
  display: "grid",
  gap: 12,
};

const stickyStyle: CSSProperties = {
  position: "sticky",
  top: 12,
  zIndex: 24,
};

const headerCardStyle: CSSProperties = {
  borderRadius: 22,
  border: "1px solid var(--color-border, #e2e8f0)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.98) 100%)",
  boxShadow: "0 14px 32px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

const compactHeaderCardStyle: CSSProperties = {
  ...headerCardStyle,
  borderRadius: 18,
};

const topSectionStyle: CSSProperties = {
  padding: "18px 18px 14px 18px",
  borderBottom: "1px solid var(--color-border-soft, #eef2f7)",
};

const compactTopSectionStyle: CSSProperties = {
  ...topSectionStyle,
  padding: "14px 14px 12px 14px",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 14,
  flexWrap: "wrap",
};

const titleWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  minWidth: 0,
  flex: "1 1 360px",
};

const iconWrapStyle: CSSProperties = {
  width: 46,
  height: 46,
  minWidth: 46,
  borderRadius: 16,
  display: "grid",
  placeItems: "center",
  color: "var(--color-primary, #2563eb)",
  background:
    "linear-gradient(135deg, rgba(37,99,235,0.14), rgba(14,165,233,0.10))",
  border: "1px solid rgba(37,99,235,0.12)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
};

const compactIconWrapStyle: CSSProperties = {
  ...iconWrapStyle,
  width: 40,
  height: 40,
  minWidth: 40,
  borderRadius: 14,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  lineHeight: 1.2,
  color: "var(--color-text, #0f172a)",
};

const compactTitleStyle: CSSProperties = {
  ...titleStyle,
  fontSize: 16,
};

const subtitleStyle: CSSProperties = {
  margin: "6px 0 0 0",
  maxWidth: 700,
  fontSize: 13.5,
  lineHeight: 1.6,
  color: "var(--color-text-muted, #64748b)",
};

const compactSubtitleStyle: CSSProperties = {
  ...subtitleStyle,
  fontSize: 12.5,
};

const metricsWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const metricChipStyle: CSSProperties = {
  minHeight: 34,
  padding: "7px 12px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: "rgba(37,99,235,0.08)",
  color: "var(--color-primary, #2563eb)",
  border: "1px solid rgba(37,99,235,0.12)",
  fontSize: 12.5,
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const unreadChipStyle: CSSProperties = {
  ...metricChipStyle,
  background: "rgba(14,165,233,0.08)",
  color: "#0284c7",
  border: "1px solid rgba(14,165,233,0.14)",
};

const filterChipStyle: CSSProperties = {
  ...metricChipStyle,
  background: "rgba(168,85,247,0.08)",
  color: "#7c3aed",
  border: "1px solid rgba(168,85,247,0.14)",
};

const toolbarBodyStyle: CSSProperties = {
  padding: 18,
  display: "grid",
  gap: 14,
};

const compactToolbarBodyStyle: CSSProperties = {
  ...toolbarBodyStyle,
  padding: 14,
  gap: 12,
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const leftActionsStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const rightActionsStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const buttonStyle: CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid var(--color-border, #dbe2ea)",
  background: "var(--color-surface, #ffffff)",
  color: "var(--color-text, #0f172a)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 12.5,
  fontWeight: 700,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const subtleButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "rgba(37,99,235,0.08)",
  color: "var(--color-primary, #2563eb)",
  border: "1px solid rgba(37,99,235,0.14)",
};

const primaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "var(--color-primary, #2563eb)",
  color: "#ffffff",
  border: "1px solid var(--color-primary, #2563eb)",
  boxShadow: "0 10px 24px rgba(37,99,235,0.20)",
};

const stateBadgeStyle: CSSProperties = {
  minHeight: 32,
  padding: "6px 10px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: "var(--color-surface-soft, #f8fafc)",
  border: "1px solid var(--color-border-soft, #e2e8f0)",
  color: "var(--color-text-soft, #334155)",
  fontSize: 12,
  fontWeight: 700,
};

const filtersPanelStyle: CSSProperties = {
  padding: "0 18px 18px 18px",
};

const compactFiltersPanelStyle: CSSProperties = {
  padding: "0 14px 14px 14px",
};

const disabledStyle: CSSProperties = {
  opacity: 0.6,
  pointerEvents: "none",
};

function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "currentColor",
            opacity: 0.35 + dot * 0.2,
          }}
        />
      ))}
    </span>
  );
}

export default function ConversationToolbar({
  title = "Conversations",
  subtitle = "Manage inbound communication, monitor unread activity, and move faster across every sales and support thread.",
  className,
  totalCount = 0,
  unreadCount = 0,
  activeFilterCount = 0,
  loading = false,
  compact = false,
  sticky = false,
  filtersExpanded = false,
  showFiltersToggle = true,
  showRefreshButton = true,
  showComposeButton = true,
  showMetrics = true,
  onToggleFilters,
  onRefresh,
  onCompose,
  searchSlot,
  filtersSlot,
  actionsSlot,
}: ConversationToolbarProps) {
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <section
      className={className}
      style={{
        ...wrapperStyle,
        ...(sticky ? stickyStyle : null),
      }}
    >
      <div style={compact ? compactHeaderCardStyle : headerCardStyle}>
        <div style={compact ? compactTopSectionStyle : topSectionStyle}>
          <div style={topRowStyle}>
            <div style={titleWrapStyle}>
              <div style={compact ? compactIconWrapStyle : iconWrapStyle}>
                <Rows3 size={compact ? 17 : 19} />
              </div>

              <div style={{ minWidth: 0 }}>
                <h2 style={compact ? compactTitleStyle : titleStyle}>{title}</h2>
                <p style={compact ? compactSubtitleStyle : subtitleStyle}>
                  {subtitle}
                </p>
              </div>
            </div>

            {showMetrics ? (
              <div style={metricsWrapStyle}>
                <div style={metricChipStyle}>
                  <Sparkles size={14} />
                  {totalCount} total
                </div>

                <div style={unreadChipStyle}>
                  <Filter size={14} />
                  {unreadCount} unread
                </div>

                {hasActiveFilters ? (
                  <div style={filterChipStyle}>
                    <SlidersHorizontal size={14} />
                    {activeFilterCount} active filter
                    {activeFilterCount === 1 ? "" : "s"}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div style={compact ? compactToolbarBodyStyle : toolbarBodyStyle}>
          {searchSlot}

          <div style={actionsRowStyle}>
            <div style={leftActionsStyle}>
              {showFiltersToggle && onToggleFilters ? (
                <button
                  type="button"
                  onClick={onToggleFilters}
                  disabled={loading}
                  style={{
                    ...subtleButtonStyle,
                    ...(loading ? disabledStyle : null),
                  }}
                >
                  <SlidersHorizontal size={15} />
                  {filtersExpanded ? "Hide Filters" : "Show Filters"}
                  {filtersExpanded ? (
                    <ChevronUp size={15} />
                  ) : (
                    <ChevronDown size={15} />
                  )}
                </button>
              ) : null}

              <div style={stateBadgeStyle}>
                {loading ? (
                  <>
                    <LoadingDots />
                    <span>Updating inbox...</span>
                  </>
                ) : hasActiveFilters ? (
                  <>
                    <Filter size={14} />
                    <span>Filtered view active</span>
                  </>
                ) : (
                  <>
                    <Rows3 size={14} />
                    <span>All conversations view</span>
                  </>
                )}
              </div>
            </div>

            <div style={rightActionsStyle}>
              {actionsSlot}

              {showRefreshButton && onRefresh ? (
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={loading}
                  style={{
                    ...buttonStyle,
                    ...(loading ? disabledStyle : null),
                  }}
                >
                  <RefreshCcw size={15} />
                  Refresh
                </button>
              ) : null}

              {showComposeButton && onCompose ? (
                <button
                  type="button"
                  onClick={onCompose}
                  disabled={loading}
                  style={{
                    ...primaryButtonStyle,
                    ...(loading ? disabledStyle : null),
                  }}
                >
                  <MessageSquarePlus size={15} />
                  New Conversation
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {filtersExpanded && filtersSlot ? (
          <div style={compact ? compactFiltersPanelStyle : filtersPanelStyle}>
            {filtersSlot}
          </div>
        ) : null}
      </div>
    </section>
  );
}