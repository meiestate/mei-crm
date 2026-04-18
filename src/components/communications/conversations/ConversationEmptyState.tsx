import type { CSSProperties, ReactNode } from "react";
import {
  Inbox,
  MessageCircleMore,
  Plus,
  RefreshCcw,
  SearchX,
  Sparkles,
} from "lucide-react";

export interface ConversationEmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
  loading?: boolean;

  icon?: ReactNode;
  tips?: string[];

  primaryActionLabel?: string;
  secondaryActionLabel?: string;

  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const wrapperStyle: CSSProperties = {
  width: "100%",
  borderRadius: 24,
  border: "1px solid var(--color-border, #e2e8f0)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.95) 100%)",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

const innerStyle: CSSProperties = {
  padding: "38px 28px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const iconWrapStyle: CSSProperties = {
  width: 82,
  height: 82,
  borderRadius: 24,
  display: "grid",
  placeItems: "center",
  marginBottom: 18,
  color: "var(--color-primary, #2563eb)",
  background:
    "radial-gradient(circle at top, rgba(59,130,246,0.18), rgba(14,165,233,0.08) 58%, rgba(255,255,255,0.9) 100%)",
  border: "1px solid rgba(37,99,235,0.12)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(37,99,235,0.08)",
  color: "var(--color-primary, #2563eb)",
  border: "1px solid rgba(37,99,235,0.12)",
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 12,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.2,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  color: "var(--color-text, #0f172a)",
};

const descriptionStyle: CSSProperties = {
  margin: "10px 0 0 0",
  maxWidth: 560,
  fontSize: 14,
  lineHeight: 1.7,
  color: "var(--color-text-muted, #64748b)",
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 22,
};

const primaryButtonStyle: CSSProperties = {
  height: 42,
  padding: "0 16px",
  borderRadius: 12,
  border: "1px solid var(--color-primary, #2563eb)",
  background: "var(--color-primary, #2563eb)",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  boxShadow: "0 10px 24px rgba(37,99,235,0.22)",
};

const secondaryButtonStyle: CSSProperties = {
  height: 42,
  padding: "0 16px",
  borderRadius: 12,
  border: "1px solid var(--color-border, #dbe2ea)",
  background: "var(--color-surface, #ffffff)",
  color: "var(--color-text, #0f172a)",
  fontSize: 13,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
};

const tipsWrapStyle: CSSProperties = {
  marginTop: 24,
  width: "100%",
  maxWidth: 760,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: 10,
};

const tipChipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  minHeight: 34,
  padding: "8px 12px",
  borderRadius: 999,
  background: "var(--color-surface-soft, #f8fafc)",
  border: "1px solid var(--color-border-soft, #e2e8f0)",
  color: "var(--color-text-soft, #334155)",
  fontSize: 12.5,
  fontWeight: 600,
  lineHeight: 1.35,
};

const compactWrapperStyle: CSSProperties = {
  ...wrapperStyle,
  borderRadius: 20,
};

const compactInnerStyle: CSSProperties = {
  ...innerStyle,
  padding: "26px 20px",
};

const compactIconWrapStyle: CSSProperties = {
  ...iconWrapStyle,
  width: 64,
  height: 64,
  borderRadius: 20,
  marginBottom: 14,
};

const compactTitleStyle: CSSProperties = {
  ...titleStyle,
  fontSize: 18,
};

const compactDescriptionStyle: CSSProperties = {
  ...descriptionStyle,
  fontSize: 13,
  maxWidth: 460,
};

const compactTipsWrapStyle: CSSProperties = {
  ...tipsWrapStyle,
  marginTop: 18,
  gap: 8,
};

function LoadingDots() {
  return (
    <span
      style={{
        display: "inline-flex",
        gap: 4,
        alignItems: "center",
      }}
    >
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

export default function ConversationEmptyState({
  title = "No conversations found",
  description = "There are no conversations to show right now. Start a new conversation, refresh the list, or adjust your current filters to bring the inbox back to life.",
  className,
  compact = false,
  loading = false,
  icon,
  tips = [
    "Try clearing active filters",
    "Start a new message thread",
    "Refresh synced conversations",
  ],
  primaryActionLabel = "Start Conversation",
  secondaryActionLabel = "Refresh",
  onPrimaryAction,
  onSecondaryAction,
}: ConversationEmptyStateProps) {
  const resolvedWrapperStyle = compact ? compactWrapperStyle : wrapperStyle;
  const resolvedInnerStyle = compact ? compactInnerStyle : innerStyle;
  const resolvedIconWrapStyle = compact ? compactIconWrapStyle : iconWrapStyle;
  const resolvedTitleStyle = compact ? compactTitleStyle : titleStyle;
  const resolvedDescriptionStyle = compact
    ? compactDescriptionStyle
    : descriptionStyle;
  const resolvedTipsWrapStyle = compact ? compactTipsWrapStyle : tipsWrapStyle;

  const renderedIcon = icon ?? (loading ? <Inbox size={compact ? 26 : 34} /> : <SearchX size={compact ? 26 : 34} />);

  return (
    <section style={resolvedWrapperStyle} className={className}>
      <div style={resolvedInnerStyle}>
        <div style={eyebrowStyle}>
          <Sparkles size={13} />
          Conversation Center
        </div>

        <div style={resolvedIconWrapStyle}>{renderedIcon}</div>

        <h3 style={resolvedTitleStyle}>{title}</h3>

        <p style={resolvedDescriptionStyle}>
          {loading
            ? "We’re checking your inbox and syncing conversation records now."
            : description}
        </p>

        <div style={actionsRowStyle}>
          {onPrimaryAction ? (
            <button
              type="button"
              onClick={onPrimaryAction}
              style={primaryButtonStyle}
            >
              <Plus size={15} />
              {primaryActionLabel}
            </button>
          ) : null}

          {onSecondaryAction ? (
            <button
              type="button"
              onClick={onSecondaryAction}
              style={secondaryButtonStyle}
            >
              {loading ? (
                <>
                  <LoadingDots />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <RefreshCcw size={15} />
                  {secondaryActionLabel}
                </>
              )}
            </button>
          ) : null}
        </div>

        {!loading && tips.length > 0 ? (
          <div style={resolvedTipsWrapStyle}>
            {tips.map((tip) => (
              <div key={tip} style={tipChipStyle}>
                <MessageCircleMore size={14} />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}