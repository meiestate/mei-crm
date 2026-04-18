import React from "react";
import {
  BellRing,
  Clock3,
  Filter,
  Inbox,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";

export interface ConversationListItem {
  id: string | number;
  name: string;
  preview: string;
  time: string;
  unreadCount?: number;
  avatarUrl?: string;
  initials?: string;
  status?: string;
  channel?: string;
  active?: boolean;
  pinned?: boolean;
  priority?: "low" | "medium" | "high";
  onClick?: () => void;
}

export interface ConversationListPanelProps {
  className?: string;
  title?: string;
  subtitle?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  onSortClick?: () => void;
  conversations?: ConversationListItem[];
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getInitials = (name?: string, fallback = "C") => {
  if (!name) return fallback;

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.length
    ? parts.map((part) => part[0]?.toUpperCase() ?? "").join("")
    : fallback;
};

const getPriorityClasses = (
  priority: ConversationListItem["priority"] = "medium"
) => {
  switch (priority) {
    case "high":
      return "bg-rose-500";
    case "low":
      return "bg-slate-400";
    case "medium":
    default:
      return "bg-amber-500";
  }
};

const defaultConversations: ConversationListItem[] = [
  {
    id: 1,
    name: "Arjun Prakash",
    preview: "Can you share the latest brochure and pricing sheet today?",
    time: "10:32 AM",
    unreadCount: 2,
    status: "Awaiting reply",
    channel: "WhatsApp",
    active: true,
    pinned: true,
    priority: "high",
  },
  {
    id: 2,
    name: "Keerthana S",
    preview: "Thanks, I’ll confirm the site visit timing by evening.",
    time: "09:18 AM",
    unreadCount: 0,
    status: "Warm lead",
    channel: "Email",
    priority: "medium",
  },
  {
    id: 3,
    name: "Rohit Builders",
    preview: "Need updated inventory sheet for the weekend campaign.",
    time: "Yesterday",
    unreadCount: 5,
    status: "Team follow-up",
    channel: "Internal",
    priority: "high",
  },
  {
    id: 4,
    name: "Meena Raj",
    preview: "Please send location details and payment plan summary.",
    time: "Yesterday",
    unreadCount: 1,
    status: "Qualified",
    channel: "SMS",
    priority: "medium",
  },
];

const ConversationRow: React.FC<{
  item: ConversationListItem;
}> = ({ item }) => {
  return (
    <button
      type="button"
      onClick={item.onClick}
      className={cn(
        "w-full rounded-3xl border p-4 text-left transition",
        item.active
          ? "border-slate-300 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          : "border-transparent bg-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-900/70"
      )}
    >
      <div className="flex items-start gap-3">
        {item.avatarUrl ? (
          <img
            src={item.avatarUrl}
            alt={item.name}
            className="h-12 w-12 rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
            {item.initials || getInitials(item.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.name}
                </p>

                {item.pinned ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                    <Sparkles className="h-3 w-3" />
                    Pinned
                  </span>
                ) : null}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                {item.channel ? (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {item.channel}
                  </span>
                ) : null}

                {item.status ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <span
                      className={cn(
                        "inline-flex h-2 w-2 rounded-full",
                        getPriorityClasses(item.priority)
                      )}
                    />
                    {item.status}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {item.time}
              </span>

              {item.unreadCount ? (
                <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                  {item.unreadCount}
                </span>
              ) : null}
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {item.preview}
          </p>
        </div>
      </div>
    </button>
  );
};

const ConversationListPanel: React.FC<ConversationListPanelProps> = ({
  className,
  title = "Conversations",
  subtitle = "Browse active threads, spot urgency fast, and jump into the right discussion without friction.",
  searchValue = "",
  searchPlaceholder = "Search conversations, contacts, or messages...",
  onSearchChange,
  onFilterClick,
  onSortClick,
  conversations = defaultConversations,
}) => {
  return (
    <section
      className={cn(
        "flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="border-b border-slate-200 p-5 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Inbox className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Inbox View
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-950"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onFilterClick}
              className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
            >
              <Filter className="h-4.5 w-4.5" />
              Filters
            </button>

            <button
              type="button"
              onClick={onSortClick}
              className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
            >
              <SlidersHorizontal className="h-4.5 w-4.5" />
              Sort
            </button>

            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
              <BellRing className="h-3.5 w-3.5" />
              {conversations.filter((item) => (item.unreadCount || 0) > 0).length} active alerts
            </span>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 px-5 py-3 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Users className="h-3.5 w-3.5" />
            {conversations.length} conversations
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Clock3 className="h-3.5 w-3.5" />
            Sorted by recent activity
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <ConversationRow key={conversation.id} item={conversation} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConversationListPanel;