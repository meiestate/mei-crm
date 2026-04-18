import React from "react";
import {
  Check,
  CheckCheck,
  Clock3,
  AlertCircle,
  Reply,
  Paperclip,
  Lock,
  User,
} from "lucide-react";

type MessageDirection = "incoming" | "outgoing" | "internal";
type DeliveryStatus = "sending" | "sent" | "delivered" | "read" | "failed";
type MessageChannel = "whatsapp" | "sms" | "email" | "chat" | "internal";

export interface ChatMessageAttachment {
  id: string | number;
  name: string;
  size?: number;
  url?: string;
  mimeType?: string;
}

export interface ChatMessageReplyPreview {
  senderName?: string;
  text: string;
}

export interface ChatMessageBubbleProps {
  id: string | number;
  message: string;
  direction?: MessageDirection;
  channel?: MessageChannel;
  senderName?: string;
  senderAvatarUrl?: string;
  timestamp: string;
  status?: DeliveryStatus;
  isEdited?: boolean;
  isPinned?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  showAvatar?: boolean;
  showSenderName?: boolean;
  attachments?: ChatMessageAttachment[];
  replyPreview?: ChatMessageReplyPreview;
  metaText?: string;
  className?: string;
  actions?: React.ReactNode;
  onAttachmentClick?: (attachment: ChatMessageAttachment) => void;
  onClick?: (id: string | number) => void;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const formatBytes = (bytes?: number): string => {
  if (!bytes || Number.isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
};

const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const getStatusIcon = (status?: DeliveryStatus) => {
  switch (status) {
    case "sending":
      return <Clock3 className="h-3.5 w-3.5" />;
    case "sent":
      return <Check className="h-3.5 w-3.5" />;
    case "delivered":
      return <CheckCheck className="h-3.5 w-3.5" />;
    case "read":
      return <CheckCheck className="h-3.5 w-3.5 text-sky-500" />;
    case "failed":
      return <AlertCircle className="h-3.5 w-3.5 text-rose-500" />;
    default:
      return null;
  }
};

const bubbleTheme = {
  incoming: {
    wrapper: "justify-start",
    bubble:
      "bg-white text-slate-900 border border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800",
    sender: "text-slate-700 dark:text-slate-300",
    meta: "text-slate-500 dark:text-slate-400",
    reply:
      "border-l-slate-300 bg-slate-50 dark:border-l-slate-700 dark:bg-slate-800/80",
  },
  outgoing: {
    wrapper: "justify-end",
    bubble:
      "bg-sky-600 text-white border border-sky-600 dark:bg-sky-600 dark:text-white dark:border-sky-500",
    sender: "text-sky-100",
    meta: "text-sky-100/80",
    reply: "border-l-white/40 bg-white/10",
  },
  internal: {
    wrapper: "justify-center",
    bubble:
      "bg-amber-50 text-amber-950 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-100 dark:border-amber-900",
    sender: "text-amber-800 dark:text-amber-300",
    meta: "text-amber-700/80 dark:text-amber-300/80",
    reply:
      "border-l-amber-300 bg-amber-100/60 dark:border-l-amber-700 dark:bg-amber-900/30",
  },
};

const attachmentCardTheme = {
  incoming:
    "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80",
  outgoing:
    "border-white/15 bg-white/10 hover:bg-white/15 text-white",
  internal:
    "border-amber-200 bg-amber-100/60 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/30 dark:hover:bg-amber-900/40",
};

function renderMessageWithLinks(
  text: string,
  direction: MessageDirection
): React.ReactNode {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "break-all underline underline-offset-2",
            direction === "outgoing"
              ? "text-white hover:text-white/90"
              : direction === "internal"
              ? "text-amber-800 hover:text-amber-950 dark:text-amber-300 dark:hover:text-amber-100"
              : "text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
          )}
          onClick={(event) => event.stopPropagation()}
        >
          {part}
        </a>
      );
    }

    return (
      <React.Fragment key={`${part}-${index}`}>
        {part.split("\n").map((line, lineIndex, arr) => (
          <React.Fragment key={`${index}-${lineIndex}`}>
            {line}
            {lineIndex < arr.length - 1 ? <br /> : null}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  });
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  id,
  message,
  direction = "incoming",
  channel = "chat",
  senderName,
  senderAvatarUrl,
  timestamp,
  status,
  isEdited = false,
  isPinned = false,
  isSelected = false,
  isHighlighted = false,
  showAvatar = true,
  showSenderName = true,
  attachments = [],
  replyPreview,
  metaText,
  className,
  actions,
  onAttachmentClick,
  onClick,
}) => {
  const theme = bubbleTheme[direction];
  const isOutgoing = direction === "outgoing";
  const isInternal = direction === "internal";

  return (
    <div
      className={cn(
        "group flex w-full gap-3",
        theme.wrapper,
        className
      )}
      onClick={() => onClick?.(id)}
    >
      {!isOutgoing && showAvatar ? (
        <div className="mt-1 shrink-0">
          {senderAvatarUrl ? (
            <img
              src={senderAvatarUrl}
              alt={senderName ?? "User"}
              className="h-9 w-9 rounded-full border border-slate-200 object-cover dark:border-slate-700"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {isInternal ? <Lock className="h-4 w-4" /> : getInitials(senderName)}
            </div>
          )}
        </div>
      ) : !isOutgoing ? (
        <div className="w-9 shrink-0" />
      ) : null}

      <div
        className={cn(
          "max-w-[88%] md:max-w-[75%]",
          isOutgoing && "order-1"
        )}
      >
        {showSenderName && (senderName || isInternal) ? (
          <div
            className={cn(
              "mb-1 flex items-center gap-2 px-1 text-xs font-medium",
              theme.sender,
              isOutgoing ? "justify-end" : "justify-start"
            )}
          >
            {isInternal ? (
              <>
                <Lock className="h-3.5 w-3.5" />
                <span>{senderName || "Internal Note"}</span>
              </>
            ) : (
              <>
                <User className="h-3.5 w-3.5" />
                <span>{senderName || "Unknown Sender"}</span>
              </>
            )}
          </div>
        ) : null}

        <div
          className={cn(
            "relative overflow-hidden rounded-2xl px-4 py-3 shadow-sm transition-all duration-200",
            theme.bubble,
            isOutgoing ? "rounded-br-md" : "rounded-bl-md",
            isSelected &&
              "ring-2 ring-sky-400 ring-offset-2 dark:ring-sky-500 dark:ring-offset-slate-950",
            isHighlighted &&
              "shadow-lg shadow-sky-100 dark:shadow-sky-950/20"
          )}
        >
          {isPinned ? (
            <div className="mb-2 inline-flex items-center rounded-full border border-current/15 bg-current/10 px-2 py-0.5 text-[11px] font-medium">
              Pinned
            </div>
          ) : null}

          {replyPreview ? (
            <div
              className={cn(
                "mb-3 rounded-xl border-l-4 px-3 py-2 text-xs",
                theme.reply
              )}
            >
              <div className="mb-1 flex items-center gap-1.5 font-semibold">
                <Reply className="h-3.5 w-3.5" />
                <span>{replyPreview.senderName || "Reply"}</span>
              </div>
              <p className="line-clamp-2 opacity-90">{replyPreview.text}</p>
            </div>
          ) : null}

          <div className="text-sm leading-6 break-words whitespace-pre-wrap">
            {renderMessageWithLinks(message, direction)}
          </div>

          {attachments.length > 0 ? (
            <div className="mt-3 space-y-2">
              {attachments.map((attachment) => (
                <button
                  key={attachment.id}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onAttachmentClick?.(attachment);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
                    attachmentCardTheme[direction]
                  )}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5">
                    <Paperclip className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {attachment.name}
                    </p>
                    {(attachment.size || attachment.mimeType) && (
                      <p className="truncate text-xs opacity-75">
                        {attachment.mimeType
                          ? attachment.mimeType
                          : "Attachment"}
                        {attachment.size ? ` • ${formatBytes(attachment.size)}` : ""}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          <div
            className={cn(
              "mt-3 flex items-center gap-2 text-[11px]",
              isOutgoing ? "justify-end" : "justify-between",
              theme.meta
            )}
          >
            <div className="flex items-center gap-2">
              <span>{timestamp}</span>
              {metaText ? <span>• {metaText}</span> : null}
              {isEdited ? <span>• edited</span> : null}
              {channel ? (
                <span className="rounded-full bg-black/5 px-2 py-0.5 capitalize dark:bg-white/10">
                  {channel}
                </span>
              ) : null}
            </div>

            {isOutgoing && status ? (
              <div className="flex items-center gap-1">{getStatusIcon(status)}</div>
            ) : null}
          </div>
        </div>

        {actions ? (
          <div
            className={cn(
              "mt-2 flex opacity-0 transition-opacity duration-200 group-hover:opacity-100",
              isOutgoing ? "justify-end" : "justify-start"
            )}
          >
            {actions}
          </div>
        ) : null}
      </div>

      {isOutgoing && showAvatar ? (
        <div className="mt-1 shrink-0">
          {senderAvatarUrl ? (
            <img
              src={senderAvatarUrl}
              alt={senderName ?? "You"}
              className="h-9 w-9 rounded-full border border-slate-200 object-cover dark:border-slate-700"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-sky-100 text-xs font-semibold text-sky-700 dark:border-slate-700 dark:bg-sky-950/40 dark:text-sky-300">
              {getInitials(senderName || "You")}
            </div>
          )}
        </div>
      ) : isOutgoing ? (
        <div className="w-9 shrink-0" />
      ) : null}
    </div>
  );
};

export default ChatMessageBubble;