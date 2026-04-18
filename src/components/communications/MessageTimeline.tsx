import React from "react";
import {
  CalendarDays,
  CheckCheck,
  Check,
  Clock3,
  FileText,
  Lock,
  Mail,
  MessageCircleMore,
  Paperclip,
  Phone,
  Pin,
  Shield,
  Sparkles,
  Star,
  User,
} from "lucide-react";

export type MessageTimelineChannel =
  | "chat"
  | "email"
  | "sms"
  | "whatsapp"
  | "call"
  | "internal"
  | "system";

export type MessageTimelineDirection = "inbound" | "outbound" | "internal";

export type MessageTimelineDeliveryStatus =
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "draft"
  | "scheduled"
  | "pending";

export interface MessageTimelineAttachment {
  id: string | number;
  name: string;
  sizeLabel?: string;
  typeLabel?: string;
  url?: string;
}

export interface MessageTimelineItem {
  id: string | number;
  senderName: string;
  senderRole?: string;
  senderAvatarUrl?: string;
  senderInitials?: string;
  subject?: string;
  message: string;
  timestamp: string;
  dateLabel?: string;
  channel?: MessageTimelineChannel;
  direction?: MessageTimelineDirection;
  deliveryStatus?: MessageTimelineDeliveryStatus;
  isPinned?: boolean;
  isStarred?: boolean;
  isPrivate?: boolean;
  showConnector?: boolean;
  attachments?: MessageTimelineAttachment[];
  metaLabel?: string;
}

export interface MessageTimelineProps {
  items: MessageTimelineItem[];
  className?: string;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  loading?: boolean;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getInitials = (value?: string, fallback = "M") => {
  if (value && value.trim()) {
    return value
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }

  return fallback;
};

const getChannelMeta = (channel: MessageTimelineChannel = "chat") => {
  switch (channel) {
    case "email":
      return {
        label: "Email",
        icon: <Mail className="h-3.5 w-3.5" />,
        dotClass: "bg-sky-500",
        badgeClass:
          "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/20 dark:text-sky-300",
      };
    case "sms":
      return {
        label: "SMS",
        icon: <MessageCircleMore className="h-3.5 w-3.5" />,
        dotClass: "bg-violet-500",
        badgeClass:
          "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/20 dark:text-violet-300",
      };
    case "whatsapp":
      return {
        label: "WhatsApp",
        icon: <MessageCircleMore className="h-3.5 w-3.5" />,
        dotClass: "bg-emerald-500",
        badgeClass:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300",
      };
    case "call":
      return {
        label: "Call",
        icon: <Phone className="h-3.5 w-3.5" />,
        dotClass: "bg-amber-500",
        badgeClass:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300",
      };
    case "internal":
      return {
        label: "Internal",
        icon: <Shield className="h-3.5 w-3.5" />,
        dotClass: "bg-rose-500",
        badgeClass:
          "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300",
      };
    case "system":
      return {
        label: "System",
        icon: <Sparkles className="h-3.5 w-3.5" />,
        dotClass: "bg-slate-500",
        badgeClass:
          "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
      };
    case "chat":
    default:
      return {
        label: "Chat",
        icon: <MessageCircleMore className="h-3.5 w-3.5" />,
        dotClass: "bg-slate-500",
        badgeClass:
          "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
      };
  }
};

const getStatusMeta = (status?: MessageTimelineDeliveryStatus) => {
  switch (status) {
    case "read":
      return {
        label: "Read",
        icon: <CheckCheck className="h-3.5 w-3.5" />,
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300",
      };
    case "delivered":
      return {
        label: "Delivered",
        icon: <CheckCheck className="h-3.5 w-3.5" />,
        className:
          "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/20 dark:text-sky-300",
      };
    case "sent":
      return {
        label: "Sent",
        icon: <Check className="h-3.5 w-3.5" />,
        className:
          "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
      };
    case "failed":
      return {
        label: "Failed",
        icon: <Clock3 className="h-3.5 w-3.5" />,
        className:
          "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300",
      };
    case "draft":
      return {
        label: "Draft",
        icon: <FileText className="h-3.5 w-3.5" />,
        className:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300",
      };
    case "scheduled":
      return {
        label: "Scheduled",
        icon: <Clock3 className="h-3.5 w-3.5" />,
        className:
          "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/20 dark:text-violet-300",
      };
    case "pending":
      return {
        label: "Pending",
        icon: <Clock3 className="h-3.5 w-3.5" />,
        className:
          "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
      };
    default:
      return null;
  }
};

const LoadingState = () => {
  return (
    <div className="space-y-6 p-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="relative pl-16">
          <div className="absolute left-[22px] top-0 h-full w-px bg-slate-200 dark:bg-slate-800" />
          <div className="absolute left-0 top-1 h-11 w-11 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="animate-pulse space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => {
  return (
    <div className="flex min-h-[360px] items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <CalendarDays className="h-7 w-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
};

const MessageTimeline: React.FC<MessageTimelineProps> = ({
  items,
  className,
  title = "Message Timeline",
  subtitle = "Every touchpoint stitched into one clear story — replies, notes, sends, and signals in order.",
  emptyTitle = "No timeline activity yet",
  emptyDescription = "Once communication starts flowing, messages, notes, and delivery events will appear here.",
  loading = false,
}) => {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          <div className="space-y-6 p-5">
            {items.map((item, index) => {
              const channelMeta = getChannelMeta(item.channel);
              const statusMeta = getStatusMeta(item.deliveryStatus);
              const initials = item.senderInitials || getInitials(item.senderName, "U");
              const isLast = index === items.length - 1;

              return (
                <div key={item.id}>
                  {item.dateLabel ? (
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {item.dateLabel}
                      </span>
                      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>
                  ) : null}

                  <div className="relative pl-16">
                    {!isLast && item.showConnector !== false ? (
                      <div className="absolute left-[22px] top-12 h-[calc(100%+20px)] w-px bg-slate-200 dark:bg-slate-800" />
                    ) : null}

                    <div className="absolute left-0 top-1">
                      {item.senderAvatarUrl ? (
                        <img
                          src={item.senderAvatarUrl}
                          alt={item.senderName}
                          className="h-11 w-11 rounded-2xl border border-slate-200 object-cover dark:border-slate-800"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                          {initials}
                        </div>
                      )}
                    </div>

                    <article
                      className={cn(
                        "overflow-hidden rounded-3xl border p-4 transition",
                        item.direction === "outbound"
                          ? "border-sky-200 bg-sky-50/60 dark:border-sky-900 dark:bg-sky-950/10"
                          : item.direction === "internal"
                            ? "border-violet-200 bg-violet-50/50 dark:border-violet-900 dark:bg-violet-950/10"
                            : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                      )}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {item.senderName}
                            </h3>

                            {item.senderRole ? (
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {item.senderRole}
                              </span>
                            ) : null}

                            {item.isPinned ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                                <Pin className="h-3.5 w-3.5" />
                                Pinned
                              </span>
                            ) : null}

                            {item.isStarred ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-[11px] font-medium text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/20 dark:text-yellow-300">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                Starred
                              </span>
                            ) : null}

                            {item.isPrivate ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
                                <Lock className="h-3.5 w-3.5" />
                                Private
                              </span>
                            ) : null}
                          </div>

                          {item.subject ? (
                            <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                              {item.subject}
                            </p>
                          ) : null}
                        </div>

                        <div className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
                          {item.timestamp}
                        </div>
                      </div>

                      <div className="mt-3">
                        {item.message.split("\n").map((line, lineIndex) => (
                          <p
                            key={`${item.id}-${lineIndex}`}
                            className="text-sm leading-7 text-slate-700 dark:text-slate-200"
                          >
                            {line || "\u00A0"}
                          </p>
                        ))}
                      </div>

                      {item.attachments && item.attachments.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.attachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.url || "#"}
                              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-950"
                            >
                              <Paperclip className="h-3.5 w-3.5" />
                              <span className="max-w-[180px] truncate">{attachment.name}</span>
                              {(attachment.typeLabel || attachment.sizeLabel) && (
                                <span className="text-slate-400 dark:text-slate-500">
                                  {[attachment.typeLabel, attachment.sizeLabel]
                                    .filter(Boolean)
                                    .join(" • ")}
                                </span>
                              )}
                            </a>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                            channelMeta.badgeClass
                          )}
                        >
                          <span className={cn("h-2 w-2 rounded-full", channelMeta.dotClass)} />
                          {channelMeta.icon}
                          {channelMeta.label}
                        </span>

                        {statusMeta ? (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                              statusMeta.className
                            )}
                          >
                            {statusMeta.icon}
                            {statusMeta.label}
                          </span>
                        ) : null}

                        {item.direction ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium capitalize text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            <User className="h-3.5 w-3.5" />
                            {item.direction}
                          </span>
                        ) : null}

                        {item.metaLabel ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            {item.metaLabel}
                          </span>
                        ) : null}
                      </div>
                    </article>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MessageTimeline;