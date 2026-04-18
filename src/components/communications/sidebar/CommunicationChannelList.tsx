import type { CSSProperties, ReactNode } from "react";
import {
  Bell,
  ChevronRight,
  Headphones,
  Inbox,
  Mail,
  MessageCircle,
  MessageSquareText,
  Phone,
  Radio,
} from "lucide-react";

export type CommunicationChannelType =
  | "all"
  | "email"
  | "whatsapp"
  | "sms"
  | "calls"
  | "internal"
  | "livechat"
  | "notifications";

export interface CommunicationChannelItem {
  id: CommunicationChannelType | string;
  label: string;
  type: CommunicationChannelType;
  count?: number;
  unreadCount?: number;
  description?: string;
  isDisabled?: boolean;
  icon?: ReactNode;
  color?: string;
}

export interface CommunicationChannelListProps {
  channels: CommunicationChannelItem[];
  activeChannelId?: string;
  className?: string;
  compact?: boolean;
  loading?: boolean;
  showHeader?: boolean;
  showFooterSummary?: boolean;
  title?: string;
  subtitle?: string;
  emptyText?: string;
  onChannelSelect?: (channel: CommunicationChannelItem) => void;
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
  gap: 12,
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

const bodyStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  padding: 12,
};

const compactBodyStyle: CSSProperties = {
  ...bodyStyle,
  gap: 6,
  padding: 10,
};

const itemButtonStyle: CSSProperties = {
  width: "100%",
  border: "1px solid transparent",
  background: "transparent",
  borderRadius: 16,
  padding: "12px 12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  cursor: "pointer",
  textAlign: "left",
  transition: "all 0.18s ease",
};

const compactItemButtonStyle: CSSProperties = {
  ...itemButtonStyle,
  borderRadius: 14,
  padding: "10px 10px",
};

const activeItemStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,1) 100%)",
  border: "1px solid rgba(37,99,235,0.18)",
  boxShadow: "0 10px 22px rgba(37,99,235,0.10)",
};

const disabledItemStyle: CSSProperties = {
  opacity: 0.5,
  cursor: "not-allowed",
  pointerEvents: "none",
};

const leftItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
  flex: 1,
};

const channelIconShellStyle: CSSProperties = {
  width: 40,
  height: 40,
  minWidth: 40,
  borderRadius: 14,
  display: "grid",
  placeItems: "center",
  background: "var(--color-surface-soft, #f8fafc)",
  border: "1px solid var(--color-border-soft, #e2e8f0)",
  color: "var(--color-primary, #2563eb)",
};

const compactChannelIconShellStyle: CSSProperties = {
  ...channelIconShellStyle,
  width: 36,
  height: 36,
  minWidth: 36,
  borderRadius: 12,
};

const contentWrapStyle: CSSProperties = {
  minWidth: 0,
};

const channelLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: 13.5,
  fontWeight: 800,
  color: "var(--color-text, #0f172a)",
  letterSpacing: "-0.01em",
  lineHeight: 1.25,
};

const channelDescriptionStyle: CSSProperties = {
  margin: "4px 0 0 0",
  fontSize: 12,
  color: "var(--color-text-muted, #64748b)",
  lineHeight: 1.45,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rightItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0,
};

const countBadgeStyle: CSSProperties = {
  minWidth: 28,
  height: 28,
  padding: "0 9px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--color-surface-soft, #f8fafc)",
  color: "var(--color-text-soft, #334155)",
  border: "1px solid var(--color-border-soft, #e2e8f0)",
  fontSize: 11.5,
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const unreadBadgeStyle: CSSProperties = {
  minWidth: 24,
  height: 24,
  padding: "0 8px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--color-primary, #2563eb)",
  color: "#ffffff",
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

const footerTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 12.5,
  color: "var(--color-text-muted, #64748b)",
  lineHeight: 1.5,
};

const summaryChipStyle: CSSProperties = {
  minHeight: 30,
  padding: "6px 10px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: "rgba(37,99,235,0.08)",
  color: "var(--color-primary, #2563eb)",
  border: "1px solid rgba(37,99,235,0.12)",
  fontSize: 12,
  fontWeight: 800,
};

const emptyStateStyle: CSSProperties = {
  padding: "22px 16px",
  textAlign: "center",
  fontSize: 13,
  color: "var(--color-text-muted, #64748b)",
};

const skeletonStyle: CSSProperties = {
  height: 64,
  borderRadius: 16,
  background:
    "linear-gradient(90deg, rgba(241,245,249,1) 25%, rgba(226,232,240,0.85) 37%, rgba(241,245,249,1) 63%)",
  backgroundSize: "400% 100%",
  animation: "communicationChannelListShimmer 1.4s ease infinite",
};

function getChannelIcon(type: CommunicationChannelType) {
  switch (type) {
    case "all":
      return <Inbox size={17} />;
    case "email":
      return <Mail size={17} />;
    case "whatsapp":
    case "sms":
      return <MessageCircle size={17} />;
    case "calls":
      return <Phone size={17} />;
    case "internal":
      return <MessageSquareText size={17} />;
    case "livechat":
      return <Headphones size={17} />;
    case "notifications":
      return <Bell size={17} />;
    default:
      return <Radio size={17} />;
  }
}

function getChannelTone(type: CommunicationChannelType): CSSProperties {
  switch (type) {
    case "email":
      return { color: "#2563eb", background: "#dbeafe", border: "1px solid #bfdbfe" };
    case "whatsapp":
      return { color: "#15803d", background: "#dcfce7", border: "1px solid #bbf7d0" };
    case "sms":
      return { color: "#7c3aed", background: "#ede9fe", border: "1px solid #ddd6fe" };
    case "calls":
      return { color: "#ea580c", background: "#ffedd5", border: "1px solid #fed7aa" };
    case "internal":
      return { color: "#0f766e", background: "#ccfbf1", border: "1px solid #99f6e4" };
    case "livechat":
      return { color: "#0284c7", background: "#e0f2fe", border: "1px solid #bae6fd" };
    case "notifications":
      return { color: "#b45309", background: "#fef3c7", border: "1px solid #fde68a" };
    case "all":
    default:
      return { color: "#334155", background: "#f8fafc", border: "1px solid #e2e8f0" };
  }
}

function LoadingChannels({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <style>
        {`
          @keyframes communicationChannelListShimmer {
            0% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
          }
        `}
      </style>
      <div style={{ ...skeletonStyle, height: compact ? 56 : 64 }} />
      <div style={{ ...skeletonStyle, height: compact ? 56 : 64 }} />
      <div style={{ ...skeletonStyle, height: compact ? 56 : 64 }} />
      <div style={{ ...skeletonStyle, height: compact ? 56 : 64 }} />
    </>
  );
}

export default function CommunicationChannelList({
  channels,
  activeChannelId,
  className,
  compact = false,
  loading = false,
  showHeader = true,
  showFooterSummary = true,
  title = "Communication Channels",
  subtitle = "Switch between inbox sources and track unread activity across every communication stream.",
  emptyText = "No communication channels available right now.",
  onChannelSelect,
}: CommunicationChannelListProps) {
  const totalChannels = channels.length;
  const totalUnread = channels.reduce(
    (sum, channel) => sum + (channel.unreadCount ?? 0),
    0,
  );

  return (
    <section
      className={className}
      style={compact ? compactWrapperStyle : wrapperStyle}
    >
      {showHeader ? (
        <div style={compact ? compactHeaderStyle : headerStyle}>
          <div style={headerRowStyle}>
            <div style={compact ? compactIconWrapStyle : iconWrapStyle}>
              <Inbox size={compact ? 17 : 18} />
            </div>

            <div>
              <h3 style={titleStyle}>{title}</h3>
              <p style={subtitleStyle}>{subtitle}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div style={compact ? compactBodyStyle : bodyStyle}>
        {loading ? (
          <LoadingChannels compact={compact} />
        ) : channels.length === 0 ? (
          <div style={emptyStateStyle}>{emptyText}</div>
        ) : (
          channels.map((channel) => {
            const isActive = activeChannelId === channel.id;
            const tone = getChannelTone(channel.type);

            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => onChannelSelect?.(channel)}
                style={{
                  ...(compact ? compactItemButtonStyle : itemButtonStyle),
                  ...(isActive ? activeItemStyle : null),
                  ...(channel.isDisabled ? disabledItemStyle : null),
                }}
                aria-pressed={isActive}
                title={channel.label}
              >
                <div style={leftItemStyle}>
                  <div
                    style={{
                      ...(compact
                        ? compactChannelIconShellStyle
                        : channelIconShellStyle),
                      ...(channel.color ? { color: channel.color } : tone),
                    }}
                  >
                    {channel.icon ?? getChannelIcon(channel.type)}
                  </div>

                  <div style={contentWrapStyle}>
                    <p style={channelLabelStyle}>{channel.label}</p>
                    {channel.description ? (
                      <p style={channelDescriptionStyle}>{channel.description}</p>
                    ) : null}
                  </div>
                </div>

                <div style={rightItemStyle}>
                  {typeof channel.count === "number" ? (
                    <span style={countBadgeStyle}>{channel.count}</span>
                  ) : null}

                  {(channel.unreadCount ?? 0) > 0 ? (
                    <span style={unreadBadgeStyle}>
                      {channel.unreadCount! > 99 ? "99+" : channel.unreadCount}
                    </span>
                  ) : null}

                  <ChevronRight
                    size={16}
                    style={{
                      color: isActive ? "var(--color-primary, #2563eb)" : "#94a3b8",
                    }}
                  />
                </div>
              </button>
            );
          })
        )}
      </div>

      {showFooterSummary && !loading && channels.length > 0 ? (
        <div style={footerStyle}>
          <p style={footerTextStyle}>
            {totalChannels} channel{totalChannels === 1 ? "" : "s"} available for
            communication monitoring.
          </p>

          <div style={summaryChipStyle}>
            <Bell size={13} />
            {totalUnread} unread
          </div>
        </div>
      ) : null}
    </section>
  );
}