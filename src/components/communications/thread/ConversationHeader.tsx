import React from "react";
import {
  ArrowLeft,
  Archive,
  BellOff,
  Building2,
  ChevronRight,
  Circle,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Search,
  Star,
  Tag,
  User2,
  Users,
  MessageCircle,
  CheckCheck,
} from "lucide-react";

type ConversationChannel = "whatsapp" | "sms" | "email" | "call" | "chat" | "internal";
type PresenceStatus = "online" | "offline" | "away" | "busy";
type PriorityLevel = "low" | "medium" | "high" | "urgent";

export interface ConversationHeaderTag {
  id: string | number;
  label: string;
}

export interface ConversationHeaderAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  hidden?: boolean;
}

export interface ConversationHeaderProps {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  contactName?: string;
  companyName?: string;
  location?: string;
  phone?: string;
  email?: string;
  participantCount?: number;
  channel?: ConversationChannel;
  presence?: PresenceStatus;
  lastSeenText?: string;
  isVerified?: boolean;
  isUnread?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  priority?: PriorityLevel;
  tags?: ConversationHeaderTag[];
  className?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  onMute?: () => void;
  onArchive?: () => void;
  onAssign?: () => void;
  onMore?: () => void;
  quickActions?: React.ReactNode;
  extraActions?: ConversationHeaderAction[];
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getInitials = (value?: string) => {
  if (!value) return "C";
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
};

const channelConfig: Record<
  ConversationChannel,
  {
    label: string;
    icon: React.ReactNode;
    badgeClass: string;
  }
> = {
  whatsapp: {
    label: "WhatsApp",
    icon: <MessageCircle className="h-3.5 w-3.5" />,
    badgeClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900",
  },
  sms: {
    label: "SMS",
    icon: <MessageCircle className="h-3.5 w-3.5" />,
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900",
  },
  email: {
    label: "Email",
    icon: <Mail className="h-3.5 w-3.5" />,
    badgeClass:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900",
  },
  call: {
    label: "Call",
    icon: <Phone className="h-3.5 w-3.5" />,
    badgeClass:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-900",
  },
  chat: {
    label: "Chat",
    icon: <MessageCircle className="h-3.5 w-3.5" />,
    badgeClass:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  },
  internal: {
    label: "Internal",
    icon: <Users className="h-3.5 w-3.5" />,
    badgeClass:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900",
  },
};

const presenceConfig: Record<
  PresenceStatus,
  {
    label: string;
    dotClass: string;
    textClass: string;
  }
> = {
  online: {
    label: "Online",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
  },
  offline: {
    label: "Offline",
    dotClass: "bg-slate-400",
    textClass: "text-slate-500 dark:text-slate-400",
  },
  away: {
    label: "Away",
    dotClass: "bg-amber-500",
    textClass: "text-amber-600 dark:text-amber-400",
  },
  busy: {
    label: "Busy",
    dotClass: "bg-rose-500",
    textClass: "text-rose-600 dark:text-rose-400",
  },
};

const priorityConfig: Record<
  PriorityLevel,
  {
    label: string;
    className: string;
  }
> = {
  low: {
    label: "Low",
    className:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  },
  medium: {
    label: "Medium",
    className:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900",
  },
  high: {
    label: "High",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900",
  },
  urgent: {
    label: "Urgent",
    className:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900",
  },
};

interface HeaderActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const HeaderActionButton: React.FC<HeaderActionButtonProps> = ({
  label,
  icon,
  onClick,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-white",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {icon}
    </button>
  );
};

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  title,
  subtitle,
  avatarUrl,
  contactName,
  companyName,
  location,
  phone,
  email,
  participantCount,
  channel = "chat",
  presence = "offline",
  lastSeenText,
  isVerified = false,
  isUnread = false,
  isMuted = false,
  isArchived = false,
  priority,
  tags = [],
  className,
  showBackButton = false,
  onBack,
  onSearch,
  onMute,
  onArchive,
  onAssign,
  onMore,
  quickActions,
  extraActions = [],
}) => {
  const channelMeta = channelConfig[channel];
  const presenceMeta = presenceConfig[presence];
  const visibleExtraActions = extraActions.filter((action) => !action.hidden);

  return (
    <header
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {showBackButton ? (
            <button
              type="button"
              onClick={onBack}
              className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-white"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
          ) : null}

          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={contactName || title}
                className="h-14 w-14 rounded-2xl border border-slate-200 object-cover dark:border-slate-800"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {getInitials(contactName || title)}
              </div>
            )}

            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white dark:border-slate-950",
                presenceMeta.dotClass
              )}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h1>

              {isVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <CheckCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              ) : null}

              {isUnread ? (
                <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300">
                  Unread
                </span>
              ) : null}

              {priority ? (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                    priorityConfig[priority].className
                  )}
                >
                  {priorityConfig[priority].label}
                </span>
              ) : null}

              {isMuted ? (
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Muted
                </span>
              ) : null}

              {isArchived ? (
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Archived
                </span>
              ) : null}
            </div>

            {(subtitle || contactName || companyName || location || phone || email) && (
              <div className="mt-1 space-y-1">
                {subtitle ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {subtitle}
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  {contactName ? (
                    <span className="inline-flex items-center gap-1.5">
                      <User2 className="h-3.5 w-3.5" />
                      {contactName}
                    </span>
                  ) : null}

                  {companyName ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      {companyName}
                    </span>
                  ) : null}

                  {location ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {location}
                    </span>
                  ) : null}

                  {phone ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {phone}
                    </span>
                  ) : null}

                  {email ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {email}
                    </span>
                  ) : null}

                  {participantCount ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {participantCount} participants
                    </span>
                  ) : null}
                </div>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                  channelMeta.badgeClass
                )}
              >
                {channelMeta.icon}
                {channelMeta.label}
              </span>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-medium",
                  presenceMeta.textClass
                )}
              >
                <Circle className="h-2.5 w-2.5 fill-current stroke-current" />
                {presenceMeta.label}
              </span>

              {lastSeenText ? (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {lastSeenText}
                  </span>
                </>
              ) : null}
            </div>

            {tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
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
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:min-w-[320px] xl:max-w-[420px] xl:items-end">
          {quickActions ? (
            <div className="w-full xl:flex xl:justify-end">{quickActions}</div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <HeaderActionButton
              label="Search"
              icon={<Search className="h-4.5 w-4.5" />}
              onClick={onSearch}
            />
            <HeaderActionButton
              label="Mute"
              icon={<BellOff className="h-4.5 w-4.5" />}
              onClick={onMute}
            />
            <HeaderActionButton
              label="Archive"
              icon={<Archive className="h-4.5 w-4.5" />}
              onClick={onArchive}
            />
            <HeaderActionButton
              label="Assign"
              icon={<Star className="h-4.5 w-4.5" />}
              onClick={onAssign}
            />

            {visibleExtraActions.map((action) => (
              <HeaderActionButton
                key={action.id}
                label={action.label}
                icon={action.icon}
                onClick={action.onClick}
                disabled={action.disabled}
              />
            ))}

            <HeaderActionButton
              label="More"
              icon={<MoreHorizontal className="h-4.5 w-4.5" />}
              onClick={onMore}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ConversationHeader;