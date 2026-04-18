import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  CalendarDays,
  CheckCheck,
  CircleSlash,
  Filter,
  Funnel,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

export type ConversationChannel =
  | "all"
  | "email"
  | "whatsapp"
  | "sms"
  | "call"
  | "internal";

export type ConversationStatus =
  | "all"
  | "open"
  | "pending"
  | "resolved"
  | "closed"
  | "archived";

export type ConversationPriority =
  | "all"
  | "low"
  | "medium"
  | "high"
  | "urgent";

export type ConversationDateFilter =
  | "all"
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "custom";

export interface ConversationFiltersValue {
  query: string;
  channel: ConversationChannel;
  status: ConversationStatus;
  assigneeId: string;
  priority: ConversationPriority;
  dateRange: ConversationDateFilter;
  unreadOnly: boolean;
}

export interface ConversationFiltersBarAssignee {
  id: string;
  label: string;
}

export interface ConversationFiltersBarProps {
  value: ConversationFiltersValue;
  onChange: (next: ConversationFiltersValue) => void;

  assignees?: ConversationFiltersBarAssignee[];
  totalCount?: number;
  filteredCount?: number;
  loading?: boolean;
  compact?: boolean;
  className?: string;
  showSummary?: boolean;
  sticky?: boolean;

  onRefresh?: () => void;
}

const wrapperStyle: CSSProperties = {
  width: "100%",
};

const stickyStyle: CSSProperties = {
  position: "sticky",
  top: 12,
  zIndex: 20,
};

const containerStyle: CSSProperties = {
  border: "1px solid var(--color-border, #e2e8f0)",
  borderRadius: 22,
  background:
    "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.96) 100%)",
  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

const topStyle: CSSProperties = {
  padding: "16px 16px 12px 16px",
  borderBottom: "1px solid var(--color-border-soft, #eef2f7)",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const headingWrapStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
  minWidth: 0,
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
  color: "var(--color-primary, #2563eb)",
  border: "1px solid rgba(37,99,235,0.10)",
};

const headingStyle: CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 800,
  letterSpacing: "-0.02em",
  color: "var(--color-text, #0f172a)",
};

const subheadingStyle: CSSProperties = {
  margin: "4px 0 0 0",
  fontSize: 12.5,
  color: "var(--color-text-muted, #64748b)",
  lineHeight: 1.5,
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  minHeight: 36,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(37,99,235,0.08)",
  color: "var(--color-primary, #2563eb)",
  border: "1px solid rgba(37,99,235,0.12)",
  fontSize: 12.5,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const filtersWrapStyle: CSSProperties = {
  padding: 16,
  display: "grid",
  gap: 12,
};

const searchWrapStyle: CSSProperties = {
  position: "relative",
};

const searchInputStyle: CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: 14,
  border: "1px solid var(--color-border, #dbe2ea)",
  background: "var(--color-input-bg, #ffffff)",
  color: "var(--color-text, #0f172a)",
  outline: "none",
  padding: "0 14px 0 42px",
  fontSize: 13.5,
  boxSizing: "border-box",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  gap: 12,
};

const compactGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 10,
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: 6,
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "var(--color-text-soft, #334155)",
};

const selectStyle: CSSProperties = {
  width: "100%",
  height: 40,
  borderRadius: 12,
  border: "1px solid var(--color-border, #dbe2ea)",
  background: "var(--color-input-bg, #ffffff)",
  color: "var(--color-text, #0f172a)",
  outline: "none",
  padding: "0 12px",
  fontSize: 13,
  boxSizing: "border-box",
};

const bottomRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const toggleWrapStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  minHeight: 40,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid var(--color-border, #dbe2ea)",
  background: "var(--color-surface, #ffffff)",
  color: "var(--color-text, #0f172a)",
};

const checkboxStyle: CSSProperties = {
  width: 16,
  height: 16,
  accentColor: "var(--color-primary, #2563eb)",
  cursor: "pointer",
};

const actionsStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const buttonStyle: CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid var(--color-border, #dbe2ea)",
  background: "var(--color-surface, #ffffff)",
  color: "var(--color-text, #0f172a)",
  fontSize: 12.5,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
};

const primaryGhostButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "rgba(37,99,235,0.08)",
  border: "1px solid rgba(37,99,235,0.14)",
  color: "var(--color-primary, #2563eb)",
};

const summaryBarStyle: CSSProperties = {
  padding: "12px 16px",
  borderTop: "1px solid var(--color-border-soft, #eef2f7)",
  background: "var(--color-surface-soft, #f8fafc)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const summaryTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 12.5,
  color: "var(--color-text-muted, #64748b)",
  lineHeight: 1.5,
};

function hasActiveFilters(value: ConversationFiltersValue) {
  return (
    value.query.trim().length > 0 ||
    value.channel !== "all" ||
    value.status !== "all" ||
    value.assigneeId !== "all" ||
    value.priority !== "all" ||
    value.dateRange !== "all" ||
    value.unreadOnly
  );
}

export default function ConversationFiltersBar({
  value,
  onChange,
  assignees = [],
  totalCount = 0,
  filteredCount = 0,
  loading = false,
  compact = false,
  className,
  showSummary = true,
  sticky = false,
  onRefresh,
}: ConversationFiltersBarProps) {
  const active = useMemo(() => hasActiveFilters(value), [value]);

  const setField = <K extends keyof ConversationFiltersValue>(
    key: K,
    nextValue: ConversationFiltersValue[K],
  ) => {
    onChange({
      ...value,
      [key]: nextValue,
    });
  };

  const handleClearFilters = () => {
    onChange({
      query: "",
      channel: "all",
      status: "all",
      assigneeId: "all",
      priority: "all",
      dateRange: "all",
      unreadOnly: false,
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (value.query.trim()) count += 1;
    if (value.channel !== "all") count += 1;
    if (value.status !== "all") count += 1;
    if (value.assigneeId !== "all") count += 1;
    if (value.priority !== "all") count += 1;
    if (value.dateRange !== "all") count += 1;
    if (value.unreadOnly) count += 1;
    return count;
  }, [value]);

  return (
    <section
      className={className}
      style={{
        ...wrapperStyle,
        ...(sticky ? stickyStyle : null),
      }}
    >
      <div style={containerStyle}>
        <div style={topStyle}>
          <div style={topRowStyle}>
            <div style={headingWrapStyle}>
              <div style={iconWrapStyle}>
                <SlidersHorizontal size={18} />
              </div>

              <div>
                <h3 style={headingStyle}>Conversation Filters</h3>
                <p style={subheadingStyle}>
                  Narrow the inbox by channel, status, owner, priority, and activity
                  window to find the right conversations faster.
                </p>
              </div>
            </div>

            <div style={badgeStyle}>
              <Funnel size={14} />
              {activeFilterCount} active filter{activeFilterCount === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <div style={filtersWrapStyle}>
          <div style={searchWrapStyle}>
            <Search
              size={16}
              style={{
                position: "absolute",
                top: "50%",
                left: 14,
                transform: "translateY(-50%)",
                color: "#64748b",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              value={value.query}
              onChange={(e) => setField("query", e.target.value)}
              placeholder="Search by contact, subject, phone, email, message snippet..."
              style={searchInputStyle}
            />
          </div>

          <div style={compact ? compactGridStyle : gridStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Channel</label>
              <select
                value={value.channel}
                onChange={(e) =>
                  setField("channel", e.target.value as ConversationChannel)
                }
                style={selectStyle}
              >
                <option value="all">All Channels</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
                <option value="call">Call</option>
                <option value="internal">Internal Note</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Status</label>
              <select
                value={value.status}
                onChange={(e) =>
                  setField("status", e.target.value as ConversationStatus)
                }
                style={selectStyle}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Assignee</label>
              <select
                value={value.assigneeId}
                onChange={(e) => setField("assigneeId", e.target.value)}
                style={selectStyle}
              >
                <option value="all">All Assignees</option>
                {assignees.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Priority</label>
              <select
                value={value.priority}
                onChange={(e) =>
                  setField("priority", e.target.value as ConversationPriority)
                }
                style={selectStyle}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Date Range</label>
              <select
                value={value.dateRange}
                onChange={(e) =>
                  setField("dateRange", e.target.value as ConversationDateFilter)
                }
                style={selectStyle}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div style={bottomRowStyle}>
            <label style={toggleWrapStyle}>
              <input
                type="checkbox"
                checked={value.unreadOnly}
                onChange={(e) => setField("unreadOnly", e.target.checked)}
                style={checkboxStyle}
              />
              <CheckCheck size={15} />
              <span style={{ fontSize: 12.5, fontWeight: 700 }}>
                Show unread only
              </span>
            </label>

            <div style={actionsStyle}>
              {onRefresh ? (
                <button
                  type="button"
                  onClick={onRefresh}
                  style={buttonStyle}
                  disabled={loading}
                >
                  <CalendarDays size={15} />
                  Refresh
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleClearFilters}
                style={primaryGhostButtonStyle}
                disabled={!active || loading}
              >
                <RotateCcw size={15} />
                Clear Filters
              </button>

              <div style={buttonStyle}>
                <Filter size={15} />
                {filteredCount} result{filteredCount === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        </div>

        {showSummary ? (
          <div style={summaryBarStyle}>
            <p style={summaryTextStyle}>
              {active ? (
                <>
                  Showing <strong>{filteredCount}</strong> filtered conversations out of{" "}
                  <strong>{totalCount}</strong> total records.
                </>
              ) : (
                <>
                  Showing all <strong>{totalCount}</strong> conversations with no
                  active filters.
                </>
              )}
            </p>

            <div
              style={{
                ...badgeStyle,
                minHeight: 32,
                padding: "6px 10px",
                fontSize: 12,
                background: "rgba(15,23,42,0.04)",
                color: "var(--color-text-soft, #334155)",
                border: "1px solid var(--color-border-soft, #e2e8f0)",
              }}
            >
              <CircleSlash size={13} />
              {loading ? "Updating..." : active ? "Filtered View" : "Default View"}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}