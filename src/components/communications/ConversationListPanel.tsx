import React from "react";
import {
  ChevronRight,
  Filter,
  Inbox,
  Mail,
  MessageCircleMore,
  Phone,
  Pin,
  Search,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";

export type ConversationListChannel =
  | "chat"
  | "email"
  | "sms"
  | "whatsapp"
  | "call"
  | "internal";

export interface ConversationListPanelItem {
  id: string | number;
  name: string;
  preview: string;
  timestamp: string;
  subject?: string;
  subtitle?: string;
  avatarUrl?: string;
  unreadCount?: number;
  statusLabel?: string;
  priorityLabel?: string;
  metaLabel?: string;
  channel?: ConversationListChannel;
  isOnline?: boolean;
  isPinned?: boolean;
  isStarred?: boolean;
  isSelected?: boolean;
  onClick?: (id: string | number) => void;
}

export interface ConversationListPanelProps {
  items: ConversationListPanelItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  loading?: boolean;
  stickyHeader?: boolean;
  showSearch?: boolean;
  showFilterButtons?: boolean;
  selectedConversationId?: string | number;
  emptyTitle?: string;
  emptyDescription?: string;
  toolbarActions?: React.ReactNode;
  footer?: React.ReactNode;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  onAdvancedFilterClick?: () => void;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getInitials = (value?: string) => {
  if (!value) return "C";

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
};

const getChannelMeta = (channel: ConversationListChannel = "chat") => {
  switch (channel) {
    case "email":
      return {
        label: "Email",
        icon: <Mail className="h-3.5 w-3.5" />,
        dotClass: "bg-sky-500",
      };
    case "sms":
      return {
        label: "SMS",
        icon: <MessageCircleMore className="h-3.5 w-3.5" />,
        dotClass: "bg-violet-500",
      };
    case "whatsapp":
      return {
        label: "WhatsApp",
        icon: <MessageCircleMore className="h-3.5 w-3.5" />,
        dotClass: "bg-emerald-500",
      };
    case "call":
      return {
        label: "Call",
        icon: <Phone className="h-3.5 w-3.5" />,
        dotClass: "bg-amber-500",
      };
    case "internal":
      return {
        label: "Internal",
        icon: <Shield className="h-3.5 w-3.5" />,
        dotClass: "bg-rose-500",
      };
    case "chat":
    default:
      return {
        label: "Chat",
        icon: <MessageCircleMore className="h-3.5 w-3.5" />,
        dotClass: "bg-slate-500",
      };
  }
};

const IconButton: React.FC<{
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
}> = ({ title, icon, onClick }) => {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-white"
    >
      {icon}
    </button>
  );
};

const LoadingState = () => {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="animate-pulse">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-full max-w-[70%] space-y-2">
                    <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3.5 w-44 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="h-3.5 w-14 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="mt-3 h-3.5 w-full rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-2 h-3.5 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-3 flex gap-2">
                  <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
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
          <Inbox className="h-7 w-7" />
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

const ConversationCard: React.FC<{
  item: ConversationListPanelItem;
  isSelected: boolean;
}> = ({ item, isSelected }) => {
  const channelMeta = getChannelMeta(item.channel);

  return (
    <button
      type="button"
      onClick={() => item.onClick?.(item.id)}
      className={cn(
        "group relative w-full overflow-hidden rounded-3xl border p-4 text-left transition-all duration-200",
        isSelected
          ? "border-sky-200 bg-sky-50 shadow-sm dark:border-sky-900 dark:bg-sky-950/20"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:hover:bg-slate-900"
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-0 h-full w-1.5 transition-opacity",
          isSelected ? "bg-sky-500 opacity-100" : "bg-transparent opacity-0"
        )}
      />

      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          {item.avatarUrl ? (
            <img
              src={item.avatarUrl}
              alt={item.name}
              className="h-12 w-12 rounded-2xl border border-slate-200 object-cover dark:border-slate-800"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              {getInitials(item.name)}
            </div>
          )}

          {item.isOnline ? (
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.name}
                </h3>

                {item.isStarred ? (
                  <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
                ) : null}

                {item.isPinned ? (
                  <Pin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                ) : null}
              </div>

              {item.subject ? (
                <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                  {item.subject}
                </p>
              ) : item.subtitle ? (
                <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                  {item.subtitle}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {item.timestamp}
              </span>

              {item.unreadCount && item.unreadCount > 0 ? (
                <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {item.unreadCount}
                </span>
              ) : null}
            </div>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {item.preview}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <span className={cn("h-2 w-2 rounded-full", channelMeta.dotClass)} />
              {channelMeta.icon}
              {channelMeta.label}
            </span>

            {item.statusLabel ? (
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                {item.statusLabel}
              </span>
            ) : null}

            {item.priorityLabel ? (
              <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                {item.priorityLabel}
              </span>
            ) : null}

            {item.metaLabel ? (
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {item.metaLabel}
              </span>
            ) : null}
          </div>
        </div>

        <div className="ml-1 hidden shrink-0 items-center text-slate-400 transition group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-300 md:flex">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </button>
  );
};

const ConversationListPanel: React.FC<ConversationListPanelProps> = ({
  items,
  title = "Conversations",
  subtitle = "Every thread, every reply, every signal — all flowing through one sharp command center.",
  className,
  searchValue = "",
  searchPlaceholder = "Search conversations...",
  loading = false,
  stickyHeader = true,
  showSearch = true,
  showFilterButtons = true,
  selectedConversationId,
  emptyTitle = "No conversations found",
  emptyDescription = "Once conversations start moving, they’ll appear here for quick review, response, and follow-up.",
  toolbarActions,
  footer,
  onSearchChange,
  onFilterClick,
  onAdvancedFilterClick,
}) => {
  return (
    <aside
      className={cn(
        "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div
        className={cn(
          "z-10 border-b border-slate-200 bg-white/95 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95",
          stickyHeader && "sticky top-0"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </h2>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          {toolbarActions ? (
            <div className="flex shrink-0 items-center gap-2">{toolbarActions}</div>
          ) : null}
        </div>

        {showSearch || showFilterButtons ? (
          <div className="mt-4 flex items-center gap-2">
            {showSearch ? (
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchValue}
                  placeholder={searchPlaceholder}
                  onChange={(event) => onSearchChange?.(event.target.value)}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-700 dark:focus:bg-slate-950"
                />
              </div>
            ) : null}

            {showFilterButtons ? (
              <>
                <IconButton
                  title="Quick Filters"
                  icon={<Filter className="h-4.5 w-4.5" />}
                  onClick={onFilterClick}
                />
                <IconButton
                  title="Advanced Filters"
                  icon={<SlidersHorizontal className="h-4.5 w-4.5" />}
                  onClick={onAdvancedFilterClick}
                />
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          <div className="space-y-3 p-4">
            {items.map((item) => (
              <ConversationCard
                key={item.id}
                item={item}
                isSelected={
                  typeof selectedConversationId !== "undefined"
                    ? selectedConversationId === item.id
                    : !!item.isSelected
                }
              />
            ))}
          </div>
        )}
      </div>

      {footer ? (
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          {footer}
        </div>
      ) : null}
    </aside>
  );
};

export default ConversationListPanel;