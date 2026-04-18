import type { CSSProperties, MouseEvent, ReactNode } from "react";
import {
  Archive,
  CheckCheck,
  Circle,
  Clock3,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Pin,
  Star,
  UserCircle2,
} from "lucide-react";

export type ConversationThreadChannel =
  | "email"
  | "whatsapp"
  | "sms"
  | "call"
  | "internal";

export type ConversationThreadStatus =
  | "open"
  | "pending"
  | "resolved"
  | "closed"
  | "archived";

export type ConversationThreadPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export interface ConversationThreadCardData {
  id: string;
  title: string;
  contactName?: string;
  contactSubtitle?: string;
  avatarUrl?: string;
  channel: ConversationThreadChannel;
  status: ConversationThreadStatus;
  priority?: ConversationThreadPriority;
  preview: string;
  timestamp: string;
  unreadCount?: number;
  assignedTo?: string;
  lastMessageAuthor?: string;
  messageCount?: number;
  isPinned?: boolean;
  isStarred?: boolean;
  isSelected?: boolean;
  isActive?: boolean;
  isMuted?: boolean;
}

export interface ConversationThreadCardProps {
  conversation: ConversationThreadCardData;
  className?: string;
  compact?: boolean;
  disabled?: boolean;
  showCheckbox?: boolean;
  showQuickActions?: boolean;
  trailingContent?: ReactNode;

  onClick?: (conversation: ConversationThreadCardData) => void;
  onSelect?: (conversation: ConversationThreadCardData) => void;
  onToggleStar?: (conversation: ConversationThreadCardData) => void;
  onArchive?: (conversation: ConversationThreadCardData) => void;
  onMarkRead?: (conversation: ConversationThreadCardData) => void;
  onOpenMenu?: (conversation: ConversationThreadCardData) => void;
}

const cardStyle: CSSProperties = {
  width: "100%",
  borderRadius: 18,
  border: "1px solid var(--color-border, #e2e8f0)",
  background: "var(--color-surface, #ffffff)",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
  transition: "all 0.18s ease",
  cursor: "pointer",
  overflow: "hidden",
};

const selectedCardStyle: CSSProperties = {
  border: "1px solid rgba(37,99,235,0.28)",
  boxShadow: "0 14px 32px rgba(37, 99, 235, 0.12)",
  background:
    "linear-gradient(180deg, rgba(239,246,255,0.88) 0%, rgba(255,255,255,1) 100%)",
};

const activeCardStyle: CSSProperties = {
  border: "1px solid rgba(14,165,233,0.28)",
  boxShadow: "0 14px 32px rgba(14, 165, 233, 0.12)",
};

const innerStyle: CSSProperties = {
  padding: "14px 16px",
  display: "grid",
  gridTemplateColumns: "auto auto minmax(0, 1fr) auto",
  gap: 12,
  alignItems: "flex-start",
};

const compactInnerStyle: CSSProperties = {
  ...innerStyle,
  padding: "12px 14px",
  gap: 10,
};

const leadingStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const checkboxWrapStyle: CSSProperties = {
  width: 18,
  height: 18,
  minWidth: 18,
  marginTop: 8,
  display: "grid",
  placeItems: "center",
};

const checkboxStyle: CSSProperties = {
  width: 16,
  height: 16,
  accentColor: "var(--color-primary, #2563eb)",
  cursor: "pointer",
};

const avatarShellStyle: CSSProperties = {
  width: 52,
  height: 52,
  minWidth: 52,
  borderRadius: 16,
  display: "grid",
  placeItems: "center",
  overflow: "hidden",
  background:
    "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(14,165,233,0.10))",
  color: "var(--color-primary, #2563eb)",
  border: "1px solid rgba(37,99,235,0.10)",
};

const compactAvatarShellStyle: CSSProperties = {
  ...avatarShellStyle,
  width: 46,
  height: 46,
  minWidth: 46,
  borderRadius: 14,
};

const mainStyle: CSSProperties = {
  minWidth: 0,
  display: "grid",
  gap: 8,
};

const topRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
};

const titleWrapStyle: CSSProperties = {
  minWidth: 0,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 14.5,
  fontWeight: 800,
  color: "var(--color-text, #0f172a)",
  letterSpacing: "-0.02em",
  lineHeight: 1.25,
};

const subTextStyle: CSSProperties = {
  margin: "4px 0 0 0",
  fontSize: 12.5,
  color: "var(--color-text-muted, #64748b)",
  lineHeight: 1.5,
};

const metaRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const chipStyle: CSSProperties = {
  minHeight: 26,
  padding: "5px 10px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 11.5,
  fontWeight: 700,
  border: "1px solid var(--color-border-soft, #e2e8f0)",
  background: "var(--color-surface-soft, #f8fafc)",
  color: "var(--color-text-soft, #334155)",
  whiteSpace: "nowrap",
};

const previewStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.6,
  color: "var(--color-text-soft, #334155)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rightColumnStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  justifyItems: "end",
  minWidth: 104,
};

const timestampStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "var(--color-text-muted, #64748b)",
  whiteSpace: "nowrap",
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const iconButtonStyle: CSSProperties = {
  width: 32,
  height: 32,
  minWidth: 32,
  borderRadius: 10,
  border: "1px solid var(--color-border, #e2e8f0)",
  background: "var(--color-surface, #ffffff)",
  color: "var(--color-text-soft, #334155)",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
};

const unreadBadgeStyle: CSSProperties = {
  minWidth: 24,
  height: 24,
  padding: "0 8px",
  borderRadius: 999,
  background: "var(--color-primary, #2563eb)",
  color: "#ffffff",
  fontSize: 11.5,
  fontWeight: 800,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const mutedDotStyle: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#94a3b8",
};

const dividerStyle: CSSProperties = {
  height: 1,
  background: "var(--color-border-soft, #eef2f7)",
};

function getChannelIcon(channel: ConversationThreadChannel) {
  switch (channel) {
    case "email":
      return <Mail size={15} />;
    case "whatsapp":
    case "sms":
      return <MessageCircle size={15} />;
    case "call":
      return <Phone size={15} />;
    case "internal":
    default:
      return <UserCircle2 size={15} />;
  }
}

function getChannelLabel(channel: ConversationThreadChannel) {
  switch (channel) {
    case "email":
      return "Email";
    case "whatsapp":
      return "WhatsApp";
    case "sms":
      return "SMS";
    case "call":
      return "Call";
    case "internal":
      return "Internal";
    default:
      return channel;
  }
}

function getStatusTone(status: ConversationThreadStatus): CSSProperties {
  switch (status) {
    case "open":
      return {
        color: "#166534",
        background: "#dcfce7",
        border: "1px solid #bbf7d0",
      };
    case "pending":
      return {
        color: "#92400e",
        background: "#fef3c7",
        border: "1px solid #fde68a",
      };
    case "resolved":
      return {
        color: "#1d4ed8",
        background: "#dbeafe",
        border: "1px solid #bfdbfe",
      };
    case "closed":
      return {
        color: "#475569",
        background: "#f1f5f9",
        border: "1px solid #e2e8f0",
      };
    case "archived":
    default:
      return {
        color: "#7c3aed",
        background: "#ede9fe",
        border: "1px solid #ddd6fe",
      };
  }
}

function getPriorityTone(priority?: ConversationThreadPriority): CSSProperties {
  switch (priority) {
    case "urgent":
      return {
        color: "#991b1b",
        background: "#fee2e2",
        border: "1px solid #fecaca",
      };
    case "high":
      return {
        color: "#b45309",
        background: "#ffedd5",
        border: "1px solid #fed7aa",
      };
    case "medium":
      return {
        color: "#1d4ed8",
        background: "#dbeafe",
        border: "1px solid #bfdbfe",
      };
    case "low":
    default:
      return {
        color: "#475569",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
      };
  }
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const now = new Date();
  const isSameDay = date.toDateString() === now.toDateString();

  if (isSameDay) {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function Avatar({
  title,
  avatarUrl,
  compact,
}: {
  title: string;
  avatarUrl?: string;
  compact?: boolean;
}) {
  if (avatarUrl) {
    return (
      <div style={compact ? compactAvatarShellStyle : avatarShellStyle}>
        <img
          src={avatarUrl}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  }

  const initials = title
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <div style={compact ? compactAvatarShellStyle : avatarShellStyle}>
      <span style={{ fontSize: compact ? 14 : 15, fontWeight: 800 }}>
        {initials || "C"}
      </span>
    </div>
  );
}

export default function ConversationThreadCard({
  conversation,
  className,
  compact = false,
  disabled = false,
  showCheckbox = true,
  showQuickActions = true,
  trailingContent,
  onClick,
  onSelect,
  onToggleStar,
  onArchive,
  onMarkRead,
  onOpenMenu,
}: ConversationThreadCardProps) {
  const {
    title,
    contactName,
    contactSubtitle,
    avatarUrl,
    channel,
    status,
    priority,
    preview,
    timestamp,
    unreadCount = 0,
    assignedTo,
    lastMessageAuthor,
    messageCount,
    isPinned,
    isStarred,
    isSelected,
    isActive,
    isMuted,
  } = conversation;

  const handleRootClick = () => {
    if (disabled) return;
    onClick?.(conversation);
  };

  const stop = (event: MouseEvent<HTMLButtonElement | HTMLInputElement>) => {
    event.stopPropagation();
  };

  return (
    <article
      className={className}
      onClick={handleRootClick}
      style={{
        ...cardStyle,
        ...(compact ? { borderRadius: 16 } : null),
        ...(isSelected ? selectedCardStyle : null),
        ...(isActive ? activeCardStyle : null),
        ...(disabled ? { opacity: 0.6, pointerEvents: "none" } : null),
      }}
    >
      <div style={compact ? compactInnerStyle : innerStyle}>
        {showCheckbox ? (
          <div style={checkboxWrapStyle}>
            <input
              type="checkbox"
              checked={Boolean(isSelected)}
              onClick={stop}
              onChange={() => onSelect?.(conversation)}
              style={checkboxStyle}
              aria-label={`Select ${title}`}
            />
          </div>
        ) : null}

        <div style={leadingStyle}>
          <Avatar title={contactName || title} avatarUrl={avatarUrl} compact={compact} />
        </div>

        <div style={mainStyle}>
          <div style={topRowStyle}>
            <div style={titleWrapStyle}>
              <h3 style={titleStyle}>{title}</h3>
              {(contactName || contactSubtitle) && (
                <p style={subTextStyle}>
                  {contactName ? contactName : ""}
                  {contactName && contactSubtitle ? " • " : ""}
                  {contactSubtitle ? contactSubtitle : ""}
                </p>
              )}
            </div>
          </div>

          <div style={metaRowStyle}>
            <span style={chipStyle}>
              {getChannelIcon(channel)}
              {getChannelLabel(channel)}
            </span>

            <span style={{ ...chipStyle, ...getStatusTone(status) }}>
              <Circle size={8} fill="currentColor" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>

            {priority ? (
              <span style={{ ...chipStyle, ...getPriorityTone(priority) }}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </span>
            ) : null}

            {assignedTo ? (
              <span style={chipStyle}>
                <UserCircle2 size={14} />
                {assignedTo}
              </span>
            ) : null}

            {isPinned ? (
              <span style={chipStyle}>
                <Pin size={13} />
                Pinned
              </span>
            ) : null}

            {messageCount != null ? (
              <span style={chipStyle}>
                <MessageCircle size={13} />
                {messageCount} msg
              </span>
            ) : null}
          </div>

          <div style={previewStyle}>
            {lastMessageAuthor ? `${lastMessageAuthor}: ` : ""}
            {preview}
          </div>

          {!compact ? (
            <>
              <div style={dividerStyle} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={subTextStyle}>
                    <Clock3
                      size={13}
                      style={{ verticalAlign: "text-bottom", marginRight: 6 }}
                    />
                    Last activity: {formatTimestamp(timestamp)}
                  </span>

                  {isMuted ? (
                    <span
                      style={{
                        ...chipStyle,
                        minHeight: 24,
                        padding: "4px 8px",
                      }}
                    >
                      <span style={mutedDotStyle} />
                      Muted
                    </span>
                  ) : null}
                </div>

                {trailingContent}
              </div>
            </>
          ) : null}
        </div>

        <div style={rightColumnStyle}>
          <span style={timestampStyle}>{formatTimestamp(timestamp)}</span>

          {unreadCount > 0 ? (
            <div style={unreadBadgeStyle}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          ) : (
            <div style={{ height: 24 }} />
          )}

          {showQuickActions ? (
            <div style={actionsRowStyle}>
              <button
                type="button"
                onClick={(event) => {
                  stop(event);
                  onToggleStar?.(conversation);
                }}
                style={{
                  ...iconButtonStyle,
                  color: isStarred ? "#eab308" : "var(--color-text-soft, #334155)",
                  background: isStarred ? "rgba(250,204,21,0.10)" : "#ffffff",
                  border: isStarred
                    ? "1px solid rgba(250,204,21,0.26)"
                    : "1px solid var(--color-border, #e2e8f0)",
                }}
                aria-label="Toggle star"
                title="Toggle star"
              >
                <Star
                  size={15}
                  fill={isStarred ? "currentColor" : "none"}
                />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  stop(event);
                  onMarkRead?.(conversation);
                }}
                style={iconButtonStyle}
                aria-label="Mark as read"
                title="Mark as read"
              >
                <CheckCheck size={15} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  stop(event);
                  onArchive?.(conversation);
                }}
                style={iconButtonStyle}
                aria-label="Archive conversation"
                title="Archive conversation"
              >
                <Archive size={15} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  stop(event);
                  onOpenMenu?.(conversation);
                }}
                style={iconButtonStyle}
                aria-label="Open menu"
                title="Open menu"
              >
                <MoreHorizontal size={15} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}