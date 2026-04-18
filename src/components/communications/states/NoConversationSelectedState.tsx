import type { CSSProperties, ReactNode } from "react";
import {
  Archive,
  ArrowRight,
  Clock3,
  MailOpen,
  MessageSquareText,
  Search,
  Sparkles,
  Star,
} from "lucide-react";

export interface NoConversationSelectedQuickAction {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface NoConversationSelectedStateProps {
  title?: string;
  description?: string;
  hint?: string;
  className?: string;
  compact?: boolean;
  fullHeight?: boolean;
  selectedFolderLabel?: string;
  selectedChannelLabel?: string;
  showTips?: boolean;
  showQuickActions?: boolean;
  quickActions?: NoConversationSelectedQuickAction[];
  onOpenInbox?: () => void;
  onStartNewConversation?: () => void;
}

const wrapperStyle: CSSProperties = {
  width: "100%",
  borderRadius: 24,
  border: "1px solid #e2e8f0",
  background:
    "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.98) 100%)",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

const compactWrapperStyle: CSSProperties = {
  borderRadius: 18,
};

const fullHeightStyle: CSSProperties = {
  minHeight: 420,
};

const innerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: 18,
  padding: "42px 24px",
};

const compactInnerStyle: CSSProperties = {
  gap: 14,
  padding: "28px 18px",
};

const heroShellStyle: CSSProperties = {
  position: "relative",
  width: 88,
  height: 88,
  minWidth: 88,
  borderRadius: 26,
  display: "grid",
  placeItems: "center",
  color: "#2563eb",
  border: "1px solid #bfdbfe",
  background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
  boxShadow:
    "0 18px 40px rgba(37,99,235,0.12), inset 0 1px 0 rgba(255,255,255,0.72)",
};

const compactHeroShellStyle: CSSProperties = {
  ...heroShellStyle,
  width: 72,
  height: 72,
  minWidth: 72,
  borderRadius: 22,
};

const orbitDotStyle: CSSProperties = {
  position: "absolute",
  width: 10,
  height: 10,
  borderRadius: 999,
  background: "#60a5fa",
  boxShadow: "0 0 0 6px rgba(96,165,250,0.12)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.2,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  color: "#0f172a",
};

const compactTitleStyle: CSSProperties = {
  fontSize: 18,
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  maxWidth: 620,
  fontSize: 14,
  lineHeight: 1.75,
  color: "#475569",
};

const compactDescriptionStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.65,
};

const metaRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 8,
};

const chipStyle: CSSProperties = {
  minHeight: 30,
  padding: "6px 12px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  fontSize: 12,
  fontWeight: 700,
  color: "#334155",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: 12.5,
  lineHeight: 1.65,
  color: "#64748b",
  maxWidth: 560,
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 10,
};

const primaryButtonStyle: CSSProperties = {
  height: 44,
  padding: "0 16px",
  borderRadius: 12,
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#ffffff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(37, 99, 235, 0.18)",
};

const secondaryButtonStyle: CSSProperties = {
  height: 44,
  padding: "0 16px",
  borderRadius: 12,
  border: "1px solid #dbe2ea",
  background: "#ffffff",
  color: "#0f172a",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const quickActionsWrapStyle: CSSProperties = {
  width: "100%",
  maxWidth: 760,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 10,
};

const quickActionStyle: CSSProperties = {
  minHeight: 38,
  padding: "8px 12px",
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#334155",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 12.5,
  fontWeight: 700,
  cursor: "pointer",
};

const tipsGridStyle: CSSProperties = {
  width: "100%",
  maxWidth: 860,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: 14,
};

const tipCardStyle: CSSProperties = {
  borderRadius: 18,
  border: "1px solid #e2e8f0",
  background:
    "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
  padding: 16,
  textAlign: "left",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
};

const tipHeaderStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  fontWeight: 800,
  color: "#0f172a",
};

const tipTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 12.5,
  lineHeight: 1.65,
  color: "#64748b",
};

const defaultQuickActions: NoConversationSelectedQuickAction[] = [
  {
    id: "search",
    label: "Search conversations",
    icon: <Search size={14} />,
  },
  {
    id: "starred",
    label: "Open starred",
    icon: <Star size={14} />,
  },
  {
    id: "recent",
    label: "View recent activity",
    icon: <Clock3 size={14} />,
  },
];

const tips = [
  {
    id: "tip-1",
    icon: <MailOpen size={16} />,
    title: "Pick a conversation thread",
    text: "Choose any email, message, or activity thread from the list to open the full timeline and reply workspace.",
  },
  {
    id: "tip-2",
    icon: <Search size={16} />,
    title: "Use search and filters",
    text: "Narrow the inbox by status, owner, unread count, channel, or keyword to jump straight to the right conversation.",
  },
  {
    id: "tip-3",
    icon: <Sparkles size={16} />,
    title: "Start faster with shortcuts",
    text: "Open a template, trigger a quick reply, or launch a new message flow when you already know what you want to send.",
  },
];

export default function NoConversationSelectedState({
  title = "No conversation selected yet",
  description = "Pick a thread from the communication list to view messages, activity history, internal notes, and reply tools in one focused workspace.",
  hint = "Tip: start from unread, starred, or recently updated conversations to move faster through priority work.",
  className,
  compact = false,
  fullHeight = false,
  selectedFolderLabel,
  selectedChannelLabel,
  showTips = true,
  showQuickActions = true,
  quickActions = defaultQuickActions,
  onOpenInbox,
  onStartNewConversation,
}: NoConversationSelectedStateProps) {
  return (
    <section
      className={className}
      style={{
        ...wrapperStyle,
        ...(compact ? compactWrapperStyle : null),
        ...(fullHeight ? fullHeightStyle : null),
      }}
    >
      <div style={compact ? compactInnerStyle : innerStyle}>
        <div style={compact ? compactHeroShellStyle : heroShellStyle}>
          <MessageSquareText size={compact ? 30 : 36} />
          <span style={{ ...orbitDotStyle, top: 10, right: 10 }} />
          <span
            style={{
              ...orbitDotStyle,
              bottom: 12,
              left: 10,
              width: 8,
              height: 8,
              background: "#93c5fd",
            }}
          />
        </div>

        <div>
          <h3
            style={{
              ...titleStyle,
              ...(compact ? compactTitleStyle : null),
            }}
          >
            {title}
          </h3>

          <p
            style={{
              ...descriptionStyle,
              ...(compact ? compactDescriptionStyle : null),
            }}
          >
            {description}
          </p>
        </div>

        {(selectedFolderLabel || selectedChannelLabel) && (
          <div style={metaRowStyle}>
            {selectedFolderLabel ? (
              <span style={chipStyle}>
                <Archive size={13} />
                Folder: {selectedFolderLabel}
              </span>
            ) : null}

            {selectedChannelLabel ? (
              <span style={chipStyle}>
                <MailOpen size={13} />
                Channel: {selectedChannelLabel}
              </span>
            ) : null}
          </div>
        )}

        <div style={actionRowStyle}>
          <button type="button" onClick={onOpenInbox} style={primaryButtonStyle}>
            <MailOpen size={15} />
            Open Inbox
          </button>

          <button
            type="button"
            onClick={onStartNewConversation}
            style={secondaryButtonStyle}
          >
            <ArrowRight size={15} />
            Start New Conversation
          </button>
        </div>

        <p style={hintStyle}>{hint}</p>

        {showQuickActions && quickActions.length > 0 ? (
          <div style={quickActionsWrapStyle}>
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={action.onClick}
                style={quickActionStyle}
              >
                {action.icon ?? <Sparkles size={14} />}
                {action.label}
              </button>
            ))}
          </div>
        ) : null}

        {showTips ? (
          <div style={tipsGridStyle}>
            {tips.map((tip) => (
              <article key={tip.id} style={tipCardStyle}>
                <div style={tipHeaderStyle}>
                  {tip.icon}
                  {tip.title}
                </div>
                <p style={tipTextStyle}>{tip.text}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}