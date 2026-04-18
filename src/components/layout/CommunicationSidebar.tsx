import React from "react";
import {
  Archive,
  BellRing,
  ChevronRight,
  Clock3,
  Filter,
  FolderKanban,
  Inbox,
  Mail,
  MessageCircleMore,
  MessageSquareDot,
  Pin,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Star,
  Tag,
  Users,
} from "lucide-react";

type FolderTone = "default" | "primary" | "danger" | "warning";

export interface CommunicationSidebarFolder {
  id: string | number;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  active?: boolean;
  tone?: FolderTone;
  onClick?: () => void;
}

export interface CommunicationSidebarChannel {
  id: string | number;
  label: string;
  description?: string;
  active?: boolean;
  colorClassName?: string;
  onClick?: () => void;
}

export interface CommunicationSidebarSmartFilter {
  id: string | number;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export interface CommunicationSidebarProps {
  className?: string;
  title?: string;
  subtitle?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  folders?: CommunicationSidebarFolder[];
  channels?: CommunicationSidebarChannel[];
  smartFilters?: CommunicationSidebarSmartFilter[];
  onManagePreferences?: () => void;
  preferencesLabel?: string;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const defaultFolders: CommunicationSidebarFolder[] = [
  {
    id: "inbox",
    label: "Inbox",
    count: 248,
    icon: <Inbox className="h-4.5 w-4.5" />,
    active: true,
    tone: "primary",
  },
  {
    id: "unread",
    label: "Unread",
    count: 36,
    icon: <MessageSquareDot className="h-4.5 w-4.5" />,
    tone: "warning",
  },
  {
    id: "starred",
    label: "Starred",
    count: 14,
    icon: <Star className="h-4.5 w-4.5" />,
  },
  {
    id: "sent",
    label: "Sent",
    count: 182,
    icon: <Send className="h-4.5 w-4.5" />,
  },
  {
    id: "archived",
    label: "Archived",
    count: 94,
    icon: <Archive className="h-4.5 w-4.5" />,
  },
];

const defaultChannels: CommunicationSidebarChannel[] = [
  {
    id: "email",
    label: "Email",
    description: "Replies, campaigns, and sequences",
    active: true,
    colorClassName: "bg-sky-500",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Fast customer follow-ups",
    colorClassName: "bg-emerald-500",
  },
  {
    id: "sms",
    label: "SMS",
    description: "Reminders and alerts",
    colorClassName: "bg-violet-500",
  },
  {
    id: "internal",
    label: "Internal Notes",
    description: "Private team collaboration",
    colorClassName: "bg-amber-500",
  },
];

const defaultSmartFilters: CommunicationSidebarSmartFilter[] = [
  { id: "awaiting", label: "Awaiting Reply", active: true },
  { id: "vip", label: "VIP Contacts" },
  { id: "followup", label: "Follow-up Today" },
  { id: "high-intent", label: "High Intent Leads" },
  { id: "escalations", label: "Escalations" },
];

const getFolderToneClasses = (
  active?: boolean,
  tone: FolderTone = "default"
) => {
  if (!active) {
    return "border-transparent text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900";
  }

  switch (tone) {
    case "primary":
      return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/20 dark:text-sky-300";
    case "danger":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300";
    case "default":
    default:
      return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";
  }
};

const FolderItem: React.FC<{
  item: CommunicationSidebarFolder;
}> = ({ item }) => {
  return (
    <button
      type="button"
      onClick={item.onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 text-left transition",
        getFolderToneClasses(item.active, item.tone)
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="shrink-0">{item.icon}</span>
        <span className="truncate text-sm font-medium">{item.label}</span>
      </div>

      {typeof item.count !== "undefined" ? (
        <span
          className={cn(
            "inline-flex min-w-[28px] items-center justify-center rounded-full px-2 py-1 text-xs font-semibold",
            item.active
              ? "bg-white/80 text-current dark:bg-slate-950/70"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          )}
        >
          {item.count}
        </span>
      ) : null}
    </button>
  );
};

const ChannelItem: React.FC<{
  item: CommunicationSidebarChannel;
}> = ({ item }) => {
  return (
    <button
      type="button"
      onClick={item.onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition",
        item.active
          ? "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
          : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-900"
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={cn(
            "mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full",
            item.colorClassName || "bg-slate-400"
          )}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {item.label}
          </p>
          {item.description ? (
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              {item.description}
            </p>
          ) : null}
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
    </button>
  );
};

const SmartFilterChip: React.FC<{
  item: CommunicationSidebarSmartFilter;
}> = ({ item }) => {
  return (
    <button
      type="button"
      onClick={item.onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition",
        item.active
          ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
      )}
    >
      <Tag className="h-3.5 w-3.5" />
      {item.label}
    </button>
  );
};

const CommunicationSidebar: React.FC<CommunicationSidebarProps> = ({
  className,
  title = "Communication Workspace",
  subtitle = "Every inbox, channel, and priority thread — organized with clarity.",
  searchValue = "",
  searchPlaceholder = "Search folders, channels, or contacts...",
  onSearchChange,
  folders = defaultFolders,
  channels = defaultChannels,
  smartFilters = defaultSmartFilters,
  onManagePreferences,
  preferencesLabel = "Manage Preferences",
}) => {
  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="border-b border-slate-200 p-5 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <FolderKanban className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Sidebar
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-950"
          />
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Folders
            </h3>
            <Mail className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
          </div>

          <div className="space-y-1.5">
            {folders.map((folder) => (
              <FolderItem key={folder.id} item={folder} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Channels
            </h3>
            <Users className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
          </div>

          <div className="space-y-2">
            {channels.map((channel) => (
              <ChannelItem key={channel.id} item={channel} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Smart Filters
            </h3>
            <Filter className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
          </div>

          <div className="flex flex-wrap gap-2">
            {smartFilters.map((filter) => (
              <SmartFilterChip key={filter.id} item={filter} />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Priority watch
              </h4>
              <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">
                Urgent threads, pinned conversations, and internal escalations stay
                visible so the team never misses a crucial moment.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  <Pin className="h-3.5 w-3.5" />
                  Pinned
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  <BellRing className="h-3.5 w-3.5" />
                  Urgent
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  <Clock3 className="h-3.5 w-3.5" />
                  Due Today
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  <MessageCircleMore className="h-3.5 w-3.5" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <button
          type="button"
          onClick={onManagePreferences}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
        >
          <Settings2 className="h-4.5 w-4.5" />
          {preferencesLabel}
        </button>
      </div>
    </aside>
  );
};

export default CommunicationSidebar;