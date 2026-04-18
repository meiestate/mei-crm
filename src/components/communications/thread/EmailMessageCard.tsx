import React from "react";
import {
  Archive,
  ArrowUpRight,
  BadgeAlert,
  CheckCheck,
  Paperclip,
  Reply,
  Star,
  StarOff,
  Tag,
  Trash2,
  User2,
  CornerUpLeft,
  Forward,
} from "lucide-react";

export type EmailDeliveryStatus =
  | "draft"
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "bounced"
  | "scheduled"
  | "paused"
  | "cancelled";

export interface EmailMessageAttachment {
  id: string | number;
  name: string;
  size?: number;
}

export interface EmailMessageTag {
  id: string | number;
  label: string;
}

export interface EmailMessageCardProps {
  id: string | number;
  fromName: string;
  fromEmail?: string;
  to?: string[];
  cc?: string[];
  subject: string;
  snippet: string;
  timestamp: string;
  status?: EmailDeliveryStatus;
  isUnread?: boolean;
  isStarred?: boolean;
  isSelected?: boolean;
  isFlagged?: boolean;
  hasAttachments?: boolean;
  attachments?: EmailMessageAttachment[];
  tags?: EmailMessageTag[];
  className?: string;
  compact?: boolean;
  showActions?: boolean;
  onClick?: (id: string | number) => void;
  onReply?: (id: string | number) => void;
  onReplyAll?: (id: string | number) => void;
  onForward?: (id: string | number) => void;
  onArchive?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onToggleStar?: (id: string | number) => void;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const formatAttachmentMeta = (attachments?: EmailMessageAttachment[]) => {
  if (!attachments || attachments.length === 0) return "";
  if (attachments.length === 1) return attachments[0].name;
  return `${attachments.length} attachments`;
};

const getInitials = (value?: string) => {
  if (!value) return "E";
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
};

const statusStyles: Record<
  EmailDeliveryStatus,
  {
    label: string;
    className: string;
  }
> = {
  draft: {
    label: "Draft",
    className:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  },
  queued: {
    label: "Queued",
    className:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-300",
  },
  sending: {
    label: "Sending",
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300",
  },
  sent: {
    label: "Sent",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300",
  },
  delivered: {
    label: "Delivered",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  read: {
    label: "Read",
    className:
      "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-300",
  },
  failed: {
    label: "Failed",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300",
  },
  bounced: {
    label: "Bounced",
    className:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-300",
  },
  scheduled: {
    label: "Scheduled",
    className:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300",
  },
  paused: {
    label: "Paused",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
  },
};

interface ActionButtonProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  icon,
  onClick,
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
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-white"
      )}
    >
      {icon}
    </button>
  );
};

const EmailMessageCard: React.FC<EmailMessageCardProps> = ({
  id,
  fromName,
  fromEmail,
  to = [],
  cc = [],
  subject,
  snippet,
  timestamp,
  status,
  isUnread = false,
  isStarred = false,
  isSelected = false,
  isFlagged = false,
  hasAttachments = false,
  attachments = [],
  tags = [],
  className,
  compact = false,
  showActions = true,
  onClick,
  onReply,
  onReplyAll,
  onForward,
  onArchive,
  onDelete,
  onToggleStar,
}) => {
  const showAttachmentBlock = hasAttachments || attachments.length > 0;
  const attachmentMeta = formatAttachmentMeta(attachments);

  return (
    <article
      onClick={() => onClick?.(id)}
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-white p-4 shadow-sm transition-all duration-200",
        "hover:border-slate-300 hover:shadow-md dark:bg-slate-950",
        isUnread
          ? "border-sky-200 dark:border-sky-900"
          : "border-slate-200 dark:border-slate-800",
        isSelected &&
          "ring-2 ring-sky-500 ring-offset-2 dark:ring-sky-500 dark:ring-offset-slate-950",
        className
      )}
    >
      {isUnread ? (
        <span className="absolute left-0 top-0 h-full w-1.5 bg-sky-500" />
      ) : null}

      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            {getInitials(fromName)}
          </div>

          {isFlagged ? (
            <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow">
              <BadgeAlert className="h-3 w-3" />
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={cn(
                    "truncate text-sm",
                    isUnread
                      ? "font-semibold text-slate-900 dark:text-slate-100"
                      : "font-medium text-slate-800 dark:text-slate-200"
                  )}
                >
                  {fromName}
                </h3>

                {fromEmail ? (
                  <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                    &lt;{fromEmail}&gt;
                  </span>
                ) : null}

                {status ? (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                      statusStyles[status].className
                    )}
                  >
                    {statusStyles[status].label}
                  </span>
                ) : null}

                {isUnread ? (
                  <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300">
                    New
                  </span>
                ) : null}
              </div>

              {(to.length > 0 || cc.length > 0) && (
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  {to.length > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <User2 className="h-3.5 w-3.5" />
                      To: {to.join(", ")}
                    </span>
                  ) : null}

                  {cc.length > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Cc: {cc.join(", ")}
                    </span>
                  ) : null}
                </div>
              )}

              <div className="mt-3">
                <h4
                  className={cn(
                    "truncate text-sm",
                    isUnread
                      ? "font-semibold text-slate-900 dark:text-slate-100"
                      : "font-medium text-slate-800 dark:text-slate-200"
                  )}
                >
                  {subject}
                </h4>

                <p
                  className={cn(
                    "mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300",
                    compact ? "line-clamp-1" : "line-clamp-2"
                  )}
                >
                  {snippet}
                </p>
              </div>

              {(tags.length > 0 || showAttachmentBlock) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {showAttachmentBlock ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      <Paperclip className="h-3.5 w-3.5" />
                      {attachmentMeta || "Attachment"}
                    </span>
                  ) : null}

                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <Tag className="h-3.5 w-3.5" />
                      {tag.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 lg:flex-col lg:items-end">
              <button
                type="button"
                title={isStarred ? "Remove star" : "Add star"}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleStar?.(id);
                }}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200",
                  isStarred
                    ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
                    : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-300"
                )}
              >
                {isStarred ? (
                  <Star className="h-4.5 w-4.5 fill-current" />
                ) : (
                  <StarOff className="h-4.5 w-4.5" />
                )}
              </button>

              <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                {timestamp}
              </div>
            </div>
          </div>

          {showActions ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
              <ActionButton
                title="Reply"
                icon={<Reply className="h-4.5 w-4.5" />}
                onClick={() => onReply?.(id)}
              />

              <ActionButton
                title="Reply All"
                icon={<CornerUpLeft className="h-4.5 w-4.5" />}
                onClick={() => onReplyAll?.(id)}
              />

              <ActionButton
                title="Forward"
                icon={<Forward className="h-4.5 w-4.5" />}
                onClick={() => onForward?.(id)}
              />

              <ActionButton
                title="Archive"
                icon={<Archive className="h-4.5 w-4.5" />}
                onClick={() => onArchive?.(id)}
              />

              <ActionButton
                title="Delete"
                icon={<Trash2 className="h-4.5 w-4.5" />}
                onClick={() => onDelete?.(id)}
                danger
              />

              <div className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                <CheckCheck className="h-3.5 w-3.5" />
                Email
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export default EmailMessageCard;