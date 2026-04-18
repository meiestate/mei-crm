import { useMemo } from "react";
import type { CSSProperties } from "react";
import { CheckSquare2, Square, Rows3 } from "lucide-react";

import ConversationBulkActionBar from "./ConversationBulkActionBar";
import ConversationEmptyState from "./ConversationEmptyState";
import ConversationThreadCard, {
  type ConversationThreadCardData,
} from "./ConversationThreadCard";

export interface ConversationThreadListProps {
  conversations: ConversationThreadCardData[];
  loading?: boolean;
  className?: string;
  compact?: boolean;

  selectedIds?: string[];
  activeConversationId?: string;

  showSelectionToolbar?: boolean;
  showBulkActions?: boolean;
  showCheckbox?: boolean;
  showQuickActions?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;

  onConversationClick?: (conversation: ConversationThreadCardData) => void;
  onSelectionChange?: (selectedIds: string[]) => void;

  onToggleStar?: (conversation: ConversationThreadCardData) => void;
  onArchive?: (conversation: ConversationThreadCardData) => void;
  onMarkRead?: (conversation: ConversationThreadCardData) => void;
  onOpenMenu?: (conversation: ConversationThreadCardData) => void;

  onBulkArchive?: (selectedIds: string[]) => void;
  onBulkDelete?: (selectedIds: string[]) => void;
  onBulkMarkRead?: (selectedIds: string[]) => void;
  onBulkMarkUnread?: (selectedIds: string[]) => void;
  onBulkAssign?: (selectedIds: string[]) => void;
  onBulkTag?: (selectedIds: string[]) => void;
  onBulkExport?: (selectedIds: string[]) => void;

  onRefresh?: () => void;
  onCreateConversation?: () => void;
}

const wrapperStyle: CSSProperties = {
  width: "100%",
  display: "grid",
  gap: 14,
};

const toolbarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  padding: "14px 16px",
  borderRadius: 18,
  border: "1px solid var(--color-border, #e2e8f0)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.96) 100%)",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
};

const toolbarLeftStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const toolbarTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 14.5,
  fontWeight: 800,
  letterSpacing: "-0.02em",
  color: "var(--color-text, #0f172a)",
};

const toolbarSubTextStyle: CSSProperties = {
  margin: "4px 0 0 0",
  fontSize: 12.5,
  color: "var(--color-text-muted, #64748b)",
};

const metricBadgeStyle: CSSProperties = {
  minHeight: 34,
  padding: "6px 12px",
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

const toolbarActionsStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const buttonStyle: CSSProperties = {
  height: 38,
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

const listShellStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const loadingShellStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const skeletonCardStyle: CSSProperties = {
  height: 108,
  borderRadius: 18,
  border: "1px solid var(--color-border-soft, #eef2f7)",
  background:
    "linear-gradient(90deg, rgba(241,245,249,1) 25%, rgba(226,232,240,0.85) 37%, rgba(241,245,249,1) 63%)",
  backgroundSize: "400% 100%",
  animation: "conversationThreadListShimmer 1.4s ease infinite",
};

function LoadingState({ compact = false }: { compact?: boolean }) {
  return (
    <div style={loadingShellStyle}>
      <style>
        {`
          @keyframes conversationThreadListShimmer {
            0% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
          }
        `}
      </style>
      <div style={{ ...skeletonCardStyle, height: compact ? 92 : 108 }} />
      <div style={{ ...skeletonCardStyle, height: compact ? 92 : 108 }} />
      <div style={{ ...skeletonCardStyle, height: compact ? 92 : 108 }} />
      <div style={{ ...skeletonCardStyle, height: compact ? 92 : 108 }} />
    </div>
  );
}

export default function ConversationThreadList({
  conversations,
  loading = false,
  className,
  compact = false,
  selectedIds = [],
  activeConversationId,
  showSelectionToolbar = true,
  showBulkActions = true,
  showCheckbox = true,
  showQuickActions = true,
  emptyTitle = "No conversations found",
  emptyDescription = "There are no conversations matching the current view. Try refreshing the inbox, clearing filters, or starting a new conversation.",
  onConversationClick,
  onSelectionChange,
  onToggleStar,
  onArchive,
  onMarkRead,
  onOpenMenu,
  onBulkArchive,
  onBulkDelete,
  onBulkMarkRead,
  onBulkMarkUnread,
  onBulkAssign,
  onBulkTag,
  onBulkExport,
  onRefresh,
  onCreateConversation,
}: ConversationThreadListProps) {
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const allSelected =
    conversations.length > 0 &&
    conversations.every((conversation) => selectedIdSet.has(conversation.id));

  const someSelected = selectedIds.length > 0;

  const enrichedConversations = useMemo(
    () =>
      conversations.map((conversation) => ({
        ...conversation,
        isSelected: selectedIdSet.has(conversation.id),
        isActive: activeConversationId === conversation.id,
      })),
    [conversations, selectedIdSet, activeConversationId],
  );

  const handleToggleSelect = (conversationId: string) => {
    if (!onSelectionChange) return;

    const nextSelected = selectedIdSet.has(conversationId)
      ? selectedIds.filter((id) => id !== conversationId)
      : [...selectedIds, conversationId];

    onSelectionChange(nextSelected);
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    if (allSelected) {
      onSelectionChange([]);
      return;
    }

    onSelectionChange(conversations.map((conversation) => conversation.id));
  };

  const handleClearSelection = () => {
    onSelectionChange?.([]);
  };

  return (
    <section style={wrapperStyle} className={className}>
      {showSelectionToolbar ? (
        <div style={toolbarStyle}>
          <div style={toolbarLeftStyle}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(14,165,233,0.10))",
                color: "var(--color-primary, #2563eb)",
                border: "1px solid rgba(37,99,235,0.10)",
              }}
            >
              <Rows3 size={18} />
            </div>

            <div>
              <h3 style={toolbarTitleStyle}>Conversation Threads</h3>
              <p style={toolbarSubTextStyle}>
                Browse active inbox threads, review recent activity, and take action
                on selected conversations in one place.
              </p>
            </div>

            <div style={metricBadgeStyle}>{conversations.length} threads</div>

            {someSelected ? (
              <div
                style={{
                  ...metricBadgeStyle,
                  background: "rgba(14,165,233,0.08)",
                  color: "#0284c7",
                  border: "1px solid rgba(14,165,233,0.14)",
                }}
              >
                {selectedIds.length} selected
              </div>
            ) : null}
          </div>

          {showCheckbox && onSelectionChange ? (
            <div style={toolbarActionsStyle}>
              <button type="button" style={buttonStyle} onClick={handleSelectAll}>
                {allSelected ? <CheckSquare2 size={15} /> : <Square size={15} />}
                {allSelected ? "Clear All" : "Select All"}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <LoadingState compact={compact} />
      ) : conversations.length === 0 ? (
        <ConversationEmptyState
          compact={compact}
          title={emptyTitle}
          description={emptyDescription}
          onSecondaryAction={onRefresh}
          onPrimaryAction={onCreateConversation}
        />
      ) : (
        <div style={listShellStyle}>
          {enrichedConversations.map((conversation) => (
            <ConversationThreadCard
              key={conversation.id}
              conversation={conversation}
              compact={compact}
              showCheckbox={showCheckbox}
              showQuickActions={showQuickActions}
              onClick={(item) => onConversationClick?.(item)}
              onSelect={(item) => handleToggleSelect(item.id)}
              onToggleStar={onToggleStar}
              onArchive={onArchive}
              onMarkRead={onMarkRead}
              onOpenMenu={onOpenMenu}
            />
          ))}
        </div>
      )}

      {showBulkActions && selectedIds.length > 0 ? (
        <ConversationBulkActionBar
          selectedCount={selectedIds.length}
          onMarkRead={
            onBulkMarkRead ? () => onBulkMarkRead(selectedIds) : undefined
          }
          onMarkUnread={
            onBulkMarkUnread ? () => onBulkMarkUnread(selectedIds) : undefined
          }
          onArchive={
            onBulkArchive ? () => onBulkArchive(selectedIds) : undefined
          }
          onAssign={onBulkAssign ? () => onBulkAssign(selectedIds) : undefined}
          onTag={onBulkTag ? () => onBulkTag(selectedIds) : undefined}
          onExport={onBulkExport ? () => onBulkExport(selectedIds) : undefined}
          onDelete={onBulkDelete ? () => onBulkDelete(selectedIds) : undefined}
          onClearSelection={handleClearSelection}
          compact={compact}
        />
      ) : null}
    </section>
  );
}