import { useMemo } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import {
  MessageSquarePlus,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

export interface ConversationSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  onClear?: () => void;
  onOpenFilters?: () => void;
  onRefresh?: () => void;
  onCreateConversation?: () => void;

  placeholder?: string;
  resultCount?: number;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
  autoFocus?: boolean;
  showResultBadge?: boolean;
  showShortcutHint?: boolean;
  showFilterButton?: boolean;
  showRefreshButton?: boolean;
  showCreateButton?: boolean;
}

const wrapperStyle: CSSProperties = {
  width: "100%",
};

const containerStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const searchShellStyle: CSSProperties = {
  flex: "1 1 420px",
  minWidth: 280,
  borderRadius: 18,
  border: "1px solid var(--color-border, #dbe2ea)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.96) 100%)",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
};

const compactSearchShellStyle: CSSProperties = {
  ...searchShellStyle,
  borderRadius: 14,
  padding: "8px 10px",
};

const iconWrapStyle: CSSProperties = {
  width: 34,
  height: 34,
  minWidth: 34,
  borderRadius: 10,
  display: "grid",
  placeItems: "center",
  color: "var(--color-primary, #2563eb)",
  background: "rgba(37,99,235,0.08)",
};

const inputWrapStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

const inputStyle: CSSProperties = {
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "var(--color-text, #0f172a)",
  fontSize: 14,
  fontWeight: 600,
  padding: 0,
};

const helperRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const helperTextStyle: CSSProperties = {
  fontSize: 12,
  color: "var(--color-text-muted, #64748b)",
  lineHeight: 1.4,
};

const shortcutStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 11.5,
  color: "var(--color-text-muted, #64748b)",
};

const keycapStyle: CSSProperties = {
  minWidth: 24,
  height: 22,
  padding: "0 8px",
  borderRadius: 8,
  border: "1px solid var(--color-border, #dbe2ea)",
  background: "var(--color-surface, #ffffff)",
  color: "var(--color-text-soft, #334155)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  fontWeight: 800,
  boxShadow: "inset 0 -1px 0 rgba(15,23,42,0.03)",
};

const rightActionsStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const iconButtonStyle: CSSProperties = {
  height: 42,
  minWidth: 42,
  padding: "0 12px",
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
};

const primaryButtonStyle: CSSProperties = {
  ...iconButtonStyle,
  background: "var(--color-primary, #2563eb)",
  border: "1px solid var(--color-primary, #2563eb)",
  color: "#ffffff",
  boxShadow: "0 10px 24px rgba(37,99,235,0.22)",
};

const subtleButtonStyle: CSSProperties = {
  ...iconButtonStyle,
  background: "rgba(37,99,235,0.06)",
  border: "1px solid rgba(37,99,235,0.12)",
  color: "var(--color-primary, #2563eb)",
};

const badgeStyle: CSSProperties = {
  height: 30,
  padding: "0 10px",
  borderRadius: 999,
  border: "1px solid rgba(37,99,235,0.12)",
  background: "rgba(37,99,235,0.08)",
  color: "var(--color-primary, #2563eb)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const clearButtonStyle: CSSProperties = {
  width: 32,
  height: 32,
  minWidth: 32,
  borderRadius: 10,
  border: "1px solid var(--color-border, #e2e8f0)",
  background: "var(--color-surface, #ffffff)",
  color: "var(--color-text-muted, #64748b)",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
};

const disabledStyle: CSSProperties = {
  opacity: 0.55,
  pointerEvents: "none",
};

function LoadingDot() {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "currentColor",
        display: "inline-block",
      }}
    />
  );
}

export default function ConversationSearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  onOpenFilters,
  onRefresh,
  onCreateConversation,
  placeholder = "Search by name, phone, email, subject, message snippet...",
  resultCount = 0,
  loading = false,
  disabled = false,
  className,
  compact = false,
  autoFocus = false,
  showResultBadge = true,
  showShortcutHint = true,
  showFilterButton = true,
  showRefreshButton = true,
  showCreateButton = true,
}: ConversationSearchBarProps) {
  const hasValue = value.trim().length > 0;

  const helperText = useMemo(() => {
    if (loading) return "Searching conversations...";
    if (!hasValue) return "Search across messages, contacts, channels, and thread subjects.";
    return `${resultCount} result${resultCount === 1 ? "" : "s"} found for “${value.trim()}”.`;
  }, [hasValue, loading, resultCount, value]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit?.(value);
    }

    if (event.key === "Escape" && hasValue) {
      onChange("");
      onClear?.();
    }
  };

  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <div style={wrapperStyle} className={className}>
      <div style={containerStyle}>
        <div
          style={{
            ...(compact ? compactSearchShellStyle : searchShellStyle),
            ...(disabled ? disabledStyle : null),
          }}
        >
          <div style={iconWrapStyle}>
            <Search size={16} />
          </div>

          <div style={inputWrapStyle}>
            <input
              type="text"
              value={value}
              autoFocus={autoFocus}
              disabled={disabled}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
              aria-label="Search conversations"
            />

            <div style={helperRowStyle}>
              <span style={helperTextStyle}>{helperText}</span>

              {showShortcutHint && !compact ? (
                <span style={shortcutStyle}>
                  <span style={keycapStyle}>Enter</span>
                  <span>to search</span>
                  <span style={keycapStyle}>Esc</span>
                  <span>to clear</span>
                </span>
              ) : null}
            </div>
          </div>

          {hasValue ? (
            <button
              type="button"
              onClick={handleClear}
              style={clearButtonStyle}
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>

        <div style={rightActionsStyle}>
          {showResultBadge ? (
            <div style={badgeStyle}>
              {loading ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <LoadingDot />
                  <LoadingDot />
                  <LoadingDot />
                </span>
              ) : (
                <>
                  {resultCount} result{resultCount === 1 ? "" : "s"}
                </>
              )}
            </div>
          ) : null}

          {showFilterButton && onOpenFilters ? (
            <button
              type="button"
              onClick={onOpenFilters}
              disabled={disabled}
              style={{
                ...subtleButtonStyle,
                ...(disabled ? disabledStyle : null),
              }}
            >
              <SlidersHorizontal size={15} />
              {!compact ? "Filters" : null}
            </button>
          ) : null}

          {showRefreshButton && onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              disabled={disabled || loading}
              style={{
                ...iconButtonStyle,
                ...(disabled || loading ? disabledStyle : null),
              }}
            >
              <RefreshCcw size={15} />
              {!compact ? "Refresh" : null}
            </button>
          ) : null}

          {showCreateButton && onCreateConversation ? (
            <button
              type="button"
              onClick={onCreateConversation}
              disabled={disabled}
              style={{
                ...primaryButtonStyle,
                ...(disabled ? disabledStyle : null),
              }}
            >
              <MessageSquarePlus size={15} />
              {!compact ? "New Conversation" : null}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}