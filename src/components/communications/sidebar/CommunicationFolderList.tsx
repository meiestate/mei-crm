import type { CSSProperties, ReactNode } from "react";
import {
  Archive,
  ChevronRight,
  Clock3,
  FileText,
  Inbox,
  Send,
  Star,
  Trash2,
  UserCheck,
  BellDot,
  MailOpen,
  StickyNote,
} from "lucide-react";

export type CommunicationFolderType =
  | "all"
  | "assigned"
  | "unread"
  | "starred"
  | "scheduled"
  | "drafts"
  | "sent"
  | "archived"
  | "trash"
  | "internal";

export interface CommunicationFolderItem {
  id: string;
  label: string;
  type: CommunicationFolderType;
  count?: number;
  unreadCount?: number;
  description?: string;
  group?: string;
  isDisabled?: boolean;
  icon?: ReactNode;
  color?: string;
}

export interface CommunicationFolderListProps {
  folders: CommunicationFolderItem[];
  activeFolderId?: string;
  className?: string;
  compact?: boolean;
  loading?: boolean;

  title?: string;
  subtitle?: string;
  emptyText?: string;

  showHeader?: boolean;
  showFooterSummary?: boolean;
  showGroups?: boolean;

  onFolderSelect?: (folder: CommunicationFolderItem) => void;
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
  gap: 12,
  padding: 12,
};

const compactBodyStyle: CSSProperties = {
  ...bodyStyle,
  gap: 10,
  padding: 10,
};

const groupStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const groupTitleStyle: CSSProperties = {
  margin: "0 0 2px 0",
  padding: "0 6px",
  fontSize: 11.5,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--color-text-muted, #64748b)",
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

const folderIconShellStyle: CSSProperties = {
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

const compactFolderIconShellStyle: CSSProperties = {
  ...folderIconShellStyle,
  width: 36,
  height: 36,
  minWidth: 36,
  borderRadius: 12,
};

const contentWrapStyle: CSSProperties = {
  minWidth: 0,
};

const folderLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: 13.5,
  fontWeight: 800,
  color: "var(--color-text, #0f172a)",
  letterSpacing: "-0.01em",
  lineHeight: 1.25,
};

const folderDescriptionStyle: CSSProperties = {
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
  animation: "communicationFolderListShimmer 1.4s ease infinite",
};

function getFolderIcon(type: CommunicationFolderType) {
  switch (type) {
    case "all":
      return <Inbox size={17} />;
    case "assigned":
      return <UserCheck size={17} />;
    case "unread":
      return <MailOpen size={17} />;
    case "starred":
      return <Star size={17} />;
    case "scheduled":
      return <Clock3 size={17} />;
    case "drafts":
      return <FileText size={17} />;
    case "sent":
      return <Send size={17} />;
    case "archived":
      return <Archive size={17} />;
    case "trash":
      return <Trash2 size={17} />;
    case "internal":
      return <StickyNote size={17} />;
    default:
      return <BellDot size={17} />;
  }
}

function getFolderTone(type: CommunicationFolderType): CSSProperties {
  switch (type) {
    case "assigned":
      return { color: "#0284c7", background: "#e0f2fe", border: "1px solid #bae6fd" };
    case "unread":
      return { color: "#2563eb", background: "#dbeafe", border: "1px solid #bfdbfe" };
    case "starred":
      return { color: "#ca8a04", background: "#fef9c3", border: "1px solid #fde68a" };
    case "scheduled":
      return { color: "#7c3aed", background: "#ede9fe", border: "1px solid #ddd6fe" };
    case "drafts":
      return { color: "#475569", background: "#f8fafc", border: "1px solid #e2e8f0" };
    case "sent":
      return { color: "#15803d", background: "#dcfce7", border: "1px solid #bbf7d0" };
    case "archived":
      return { color: "#0f766e", background: "#ccfbf1", border: "1px solid #99f6e4" };
    case "trash":
      return { color: "#b91c1c", background: "#fee2e2", border: "1px solid #fecaca" };
    case "internal":
      return { color: "#9333ea", background: "#f3e8ff", border: "1px solid #e9d5ff" };
    case "all":
    default:
      return { color: "#334155", background: "#f8fafc", border: "1px solid #e2e8f0" };
  }
}

function groupFolders(
  folders: CommunicationFolderItem[],
  showGroups: boolean,
): Array<{ title: string; items: CommunicationFolderItem[] }> {
  if (!showGroups) {
    return [{ title: "", items: folders }];
  }

  const grouped = new Map<string, CommunicationFolderItem[]>();

  folders.forEach((folder) => {
    const key = folder.group?.trim() || "General";
    const current = grouped.get(key) ?? [];
    current.push(folder);
    grouped.set(key, current);
  });

  return Array.from(grouped.entries()).map(([title, items]) => ({
    title,
    items,
  }));
}

function LoadingFolders({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <style>
        {`
          @keyframes communicationFolderListShimmer {
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

export default function CommunicationFolderList({
  folders,
  activeFolderId,
  className,
  compact = false,
  loading = false,
  title = "Inbox Folders",
  subtitle = "Move across focused communication buckets and monitor important conversation queues faster.",
  emptyText = "No communication folders available right now.",
  showHeader = true,
  showFooterSummary = true,
  showGroups = true,
  onFolderSelect,
}: CommunicationFolderListProps) {
  const groupedFolders = groupFolders(folders, showGroups);
  const totalFolders = folders.length;
  const totalUnread = folders.reduce(
    (sum, folder) => sum + (folder.unreadCount ?? 0),
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
          <LoadingFolders compact={compact} />
        ) : folders.length === 0 ? (
          <div style={emptyStateStyle}>{emptyText}</div>
        ) : (
          groupedFolders.map((group) => (
            <div key={group.title || "default"} style={groupStyle}>
              {showGroups && group.title ? (
                <p style={groupTitleStyle}>{group.title}</p>
              ) : null}

              {group.items.map((folder) => {
                const isActive = activeFolderId === folder.id;
                const tone = getFolderTone(folder.type);

                return (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => onFolderSelect?.(folder)}
                    style={{
                      ...(compact ? compactItemButtonStyle : itemButtonStyle),
                      ...(isActive ? activeItemStyle : null),
                      ...(folder.isDisabled ? disabledItemStyle : null),
                    }}
                    aria-pressed={isActive}
                    title={folder.label}
                  >
                    <div style={leftItemStyle}>
                      <div
                        style={{
                          ...(compact
                            ? compactFolderIconShellStyle
                            : folderIconShellStyle),
                          ...(folder.color ? { color: folder.color } : tone),
                        }}
                      >
                        {folder.icon ?? getFolderIcon(folder.type)}
                      </div>

                      <div style={contentWrapStyle}>
                        <p style={folderLabelStyle}>{folder.label}</p>
                        {folder.description ? (
                          <p style={folderDescriptionStyle}>
                            {folder.description}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div style={rightItemStyle}>
                      {typeof folder.count === "number" ? (
                        <span style={countBadgeStyle}>{folder.count}</span>
                      ) : null}

                      {(folder.unreadCount ?? 0) > 0 ? (
                        <span style={unreadBadgeStyle}>
                          {folder.unreadCount! > 99 ? "99+" : folder.unreadCount}
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
              })}
            </div>
          ))
        )}
      </div>

      {showFooterSummary && !loading && folders.length > 0 ? (
        <div style={footerStyle}>
          <p style={footerTextStyle}>
            {totalFolders} folder{totalFolders === 1 ? "" : "s"} available for
            structured conversation management.
          </p>

          <div style={summaryChipStyle}>
            <BellDot size={13} />
            {totalUnread} unread
          </div>
        </div>
      ) : null}
    </section>
  );
}