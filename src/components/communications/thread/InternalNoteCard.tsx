import React from "react";
import {
  BadgeAlert,
  Paperclip,
  PencilLine,
  Pin,
  Shield,
  Tag,
  Trash2,
  User2,
  EyeOff,
} from "lucide-react";

type NotePriority = "low" | "medium" | "high" | "urgent";

export interface InternalNoteAttachment {
  id: string | number;
  name: string;
  size?: number;
}

export interface InternalNoteTag {
  id: string | number;
  label: string;
}

export interface InternalNoteCardProps {
  id: string | number;
  authorName: string;
  authorAvatarUrl?: string;
  note: string;
  timestamp: string;
  priority?: NotePriority;
  isPinned?: boolean;
  isEdited?: boolean;
  isPrivate?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  compact?: boolean;
  tags?: InternalNoteTag[];
  attachments?: InternalNoteAttachment[];
  className?: string;
  onClick?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onPinToggle?: (id: string | number) => void;
  onAttachmentClick?: (attachment: InternalNoteAttachment, id: string | number) => void;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getInitials = (value?: string) => {
  if (!value) return "N";
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
};

const formatBytes = (bytes?: number) => {
  if (!bytes || Number.isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
};

const priorityStyles: Record<
  NotePriority,
  {
    label: string;
    className: string;
  }
> = {
  low: {
    label: "Low",
    className:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  },
  medium: {
    label: "Medium",
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300",
  },
  high: {
    label: "High",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
  },
  urgent: {
    label: "Urgent",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300",
  },
};

interface ActionButtonProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  danger?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  icon,
  onClick,
  active = false,
  danger = false,
}) => {
  return (
    <button
      type="button"
      title={title}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200",
        danger
          ? "border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900 dark:bg-slate-950 dark:text-rose-400 dark:hover:bg-rose-950/30"
          : active
          ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-white"
      )}
    >
      {icon}
    </button>
  );
};

const InternalNoteCard: React.FC<InternalNoteCardProps> = ({
  id,
  authorName,
  authorAvatarUrl,
  note,
  timestamp,
  priority,
  isPinned = false,
  isEdited = false,
  isPrivate = true,
  isSelected = false,
  isHighlighted = false,
  compact = false,
  tags = [],
  attachments = [],
  className,
  onClick,
  onEdit,
  onDelete,
  onPinToggle,
  onAttachmentClick,
}) => {
  return (
    <article
      onClick={() => onClick?.(id)}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm transition-all duration-200",
        "hover:border-amber-300 hover:shadow-md dark:border-amber-900 dark:bg-amber-950/20 dark:hover:border-amber-800",
        isSelected &&
          "ring-2 ring-amber-500 ring-offset-2 dark:ring-amber-500 dark:ring-offset-slate-950",
        isHighlighted && "shadow-lg",
        className
      )}
    >
      <span className="absolute left-0 top-0 h-full w-1.5 bg-amber-500" />

      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          {authorAvatarUrl ? (
            <img
              src={authorAvatarUrl}
              alt={authorName}
              className="h-11 w-11 rounded-2xl border border-amber-200 object-cover dark:border-amber-900"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-white text-sm font-semibold text-amber-800 dark:border-amber-900 dark:bg-slate-950 dark:text-amber-300">
              {getInitials(authorName)}
            </div>
          )}

          {priority === "urgent" ? (
            <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow">
              <BadgeAlert className="h-3 w-3" />
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {authorName}
                </h3>

                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                  <Shield className="h-3.5 w-3.5" />
                  Internal Note
                </span>

                {isPrivate ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    <EyeOff className="h-3.5 w-3.5" />
                    Private
                  </span>
                ) : null}

                {priority ? (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                      priorityStyles[priority].className
                    )}
                  >
                    {priorityStyles[priority].label}
                  </span>
                ) : null}

                {isPinned ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                    <Pin className="h-3.5 w-3.5" />
                    Pinned
                  </span>
                ) : null}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <User2 className="h-3.5 w-3.5" />
                  {authorName}
                </span>
                <span>{timestamp}</span>
                {isEdited ? <span>• Edited</span> : null}
              </div>

              <div className="mt-3">
                <p
                  className={cn(
                    "whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-200",
                    compact ? "line-clamp-3" : ""
                  )}
                >
                  {note}
                </p>
              </div>

              {(tags.length > 0 || attachments.length > 0) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white px-2.5 py-1 text-[11px] font-medium text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
                    >
                      <Tag className="h-3.5 w-3.5" />
                      {tag.label}
                    </span>
                  ))}

                  {attachments.map((attachment) => (
                    <button
                      key={attachment.id}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onAttachmentClick?.(attachment, id);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      <span className="max-w-[160px] truncate">{attachment.name}</span>
                      {attachment.size ? (
                        <span className="text-slate-400 dark:text-slate-500">
                          • {formatBytes(attachment.size)}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 lg:flex-col lg:items-end">
              <ActionButton
                title={isPinned ? "Unpin note" : "Pin note"}
                icon={<Pin className="h-4.5 w-4.5" />}
                onClick={() => onPinToggle?.(id)}
                active={isPinned}
              />

              <div className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                {timestamp}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-amber-200 pt-4 dark:border-amber-900">
            <ActionButton
              title="Edit note"
              icon={<PencilLine className="h-4.5 w-4.5" />}
              onClick={() => onEdit?.(id)}
            />

            <ActionButton
              title={isPinned ? "Unpin note" : "Pin note"}
              icon={<Pin className="h-4.5 w-4.5" />}
              onClick={() => onPinToggle?.(id)}
              active={isPinned}
            />

            <ActionButton
              title="Delete note"
              icon={<Trash2 className="h-4.5 w-4.5" />}
              onClick={() => onDelete?.(id)}
              danger
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default InternalNoteCard;