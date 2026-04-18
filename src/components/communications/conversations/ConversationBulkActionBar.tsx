import type { CSSProperties, ReactNode } from "react";
import {
  Archive,
  CheckCheck,
  Download,
  Tag,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";

export interface ConversationBulkActionBarProps {
  selectedCount: number;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  selectionLabel?: string;
  compact?: boolean;

  onMarkRead?: () => void;
  onMarkUnread?: () => void;
  onArchive?: () => void;
  onAssign?: () => void;
  onTag?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
  onClearSelection?: () => void;

  extraActions?: ReactNode;
}

const wrapperStyle: CSSProperties = {
  position: "sticky",
  bottom: 16,
  zIndex: 30,
  width: "100%",
};

const containerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 14,
  flexWrap: "wrap",
  padding: "14px 16px",
  borderRadius: 18,
  border: "1px solid var(--color-border, #dbe2ea)",
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.96) 0%, rgba(30,41,59,0.96) 100%)",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.22)",
  backdropFilter: "blur(14px)",
};

const leftStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
  flex: "1 1 220px",
};

const badgeStyle: CSSProperties = {
  minWidth: 42,
  height: 42,
  padding: "0 12px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(59,130,246,0.18)",
  border: "1px solid rgba(96,165,250,0.34)",
  color: "#dbeafe",
  fontSize: 14,
  fontWeight: 800,
  letterSpacing: "-0.02em",
};

const titleWrapStyle: CSSProperties = {
  minWidth: 0,
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: "#f8fafc",
  fontSize: 14.5,
  fontWeight: 700,
  lineHeight: 1.25,
};

const subtitleStyle: CSSProperties = {
  margin: "3px 0 0 0",
  color: "rgba(226,232,240,0.78)",
  fontSize: 12.5,
  lineHeight: 1.45,
};

const rightStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 8,
  flexWrap: "wrap",
  flex: "1 1 480px",
};

const actionButtonStyle: CSSProperties = {
  height: 38,
  padding: "0 12px",
  borderRadius: 12,
  border: "1px solid rgba(226,232,240,0.16)",
  background: "rgba(255,255,255,0.06)",
  color: "#f8fafc",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 12.5,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.18s ease",
  whiteSpace: "nowrap",
};

const subtleButtonStyle: CSSProperties = {
  ...actionButtonStyle,
  background: "rgba(255,255,255,0.04)",
};

const dangerButtonStyle: CSSProperties = {
  ...actionButtonStyle,
  background: "rgba(239,68,68,0.12)",
  border: "1px solid rgba(248,113,113,0.28)",
  color: "#fee2e2",
};

const clearButtonStyle: CSSProperties = {
  ...actionButtonStyle,
  background: "rgba(148,163,184,0.12)",
  border: "1px solid rgba(148,163,184,0.24)",
  color: "#e2e8f0",
};

const disabledButtonStyle: CSSProperties = {
  opacity: 0.55,
  cursor: "not-allowed",
  pointerEvents: "none",
};

function ActionButton({
  label,
  icon,
  onClick,
  disabled,
  danger = false,
  subtle = false,
}: {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  subtle?: boolean;
}) {
  const resolvedStyle = danger
    ? dangerButtonStyle
    : subtle
    ? subtleButtonStyle
    : actionButtonStyle;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...resolvedStyle,
        ...(disabled ? disabledButtonStyle : null),
      }}
      aria-label={label}
      title={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function ConversationBulkActionBar({
  selectedCount,
  loading = false,
  disabled = false,
  className,
  selectionLabel = "conversations selected",
  compact = false,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onAssign,
  onTag,
  onExport,
  onDelete,
  onClearSelection,
  extraActions,
}: ConversationBulkActionBarProps) {
  if (selectedCount <= 0) return null;

  const actionDisabled = disabled || loading;

  return (
    <div style={wrapperStyle} className={className}>
      <div style={containerStyle}>
        <div style={leftStyle}>
          <div style={badgeStyle}>{selectedCount}</div>

          <div style={titleWrapStyle}>
            <p style={titleStyle}>
              {selectedCount} {selectionLabel}
            </p>
            <p style={subtitleStyle}>
              Apply bulk actions to the selected conversations without opening each
              thread one by one.
            </p>
          </div>
        </div>

        <div style={rightStyle}>
          <ActionButton
            label="Mark Read"
            icon={<CheckCheck size={15} />}
            onClick={onMarkRead}
            disabled={actionDisabled || !onMarkRead}
            subtle
          />

          {!compact ? (
            <ActionButton
              label="Mark Unread"
              icon={<CheckCheck size={15} />}
              onClick={onMarkUnread}
              disabled={actionDisabled || !onMarkUnread}
              subtle
            />
          ) : null}

          <ActionButton
            label="Archive"
            icon={<Archive size={15} />}
            onClick={onArchive}
            disabled={actionDisabled || !onArchive}
          />

          <ActionButton
            label="Assign"
            icon={<UserPlus size={15} />}
            onClick={onAssign}
            disabled={actionDisabled || !onAssign}
          />

          <ActionButton
            label="Tag"
            icon={<Tag size={15} />}
            onClick={onTag}
            disabled={actionDisabled || !onTag}
          />

          {!compact ? (
            <ActionButton
              label="Export"
              icon={<Download size={15} />}
              onClick={onExport}
              disabled={actionDisabled || !onExport}
            />
          ) : null}

          {extraActions}

          <ActionButton
            label="Delete"
            icon={<Trash2 size={15} />}
            onClick={onDelete}
            disabled={actionDisabled || !onDelete}
            danger
          />

          <button
            type="button"
            onClick={onClearSelection}
            disabled={actionDisabled || !onClearSelection}
            style={{
              ...clearButtonStyle,
              ...(actionDisabled || !onClearSelection ? disabledButtonStyle : null),
            }}
            aria-label="Clear selection"
            title="Clear selection"
          >
            <X size={15} />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}