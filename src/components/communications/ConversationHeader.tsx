import React from "react";
import {
  Archive,
  ArrowLeft,
  Bell,
  CheckCheck,
  Clock3,
  Mail,
  MessageCircleMore,
  MoreHorizontal,
  Phone,
  Pin,
  Search,
  Shield,
  Star,
  User2,
  Video,
} from "lucide-react";

export type ConversationChannel =
  | "email"
  | "sms"
  | "whatsapp"
  | "call"
  | "internal"
  | "chat";

export interface ConversationHeaderParticipant {
  id?: string | number;
  name: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  verified?: boolean;
  isOnline?: boolean;
}

export interface ConversationHeaderStat {
  id: string | number;
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface ConversationHeaderAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface ConversationHeaderProps {
  title?: string;
  participant: ConversationHeaderParticipant;
  channel?: ConversationChannel;
  statusLabel?: string;
  priorityLabel?: string;
  lastSeenLabel?: string;
  unreadCount?: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isStarred?: boolean;
  isInternal?: boolean;
  stats?: ConversationHeaderStat[];
  className?: string;
  showBackButton?: boolean;
  showSearchButton?: boolean;
  showCallButtons?: boolean;
  onBack?: () => void;
  onTogglePin?: () => void;
  onToggleMute?: () => void;
  onToggleStar?: () => void;
  onSearch?: () => void;
  onAudioCall?: () => void;
  onVideoCall?: () => void;
  onArchive?: () => void;
  actions?: ConversationHeaderAction[];
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

const getChannelMeta = (channel: ConversationChannel = "chat") => {
  switch (channel) {
    case "email":
      return {
        label: "Email",
        icon: <Mail className="h-4 w-4" />,
      };
    case "sms":
      return {
        label: "SMS",
        icon: <MessageCircleMore className="h-4 w-4" />,
      };
    case "whatsapp":
      return {
        label: "WhatsApp",
        icon: <MessageCircleMore className="h-4 w-4" />,
      };
    case "call":
      return {
        label: "Call",
        icon: <Phone className="h-4 w-4" />,
      };
    case "internal":
      return {
        label: "Internal",
        icon: <Shield className="h-4 w-4" />,
      };
    case "chat":
    default:
      return {
        label: "Chat",
        icon: <MessageCircleMore className="h-4 w-4" />,
      };
  }
};

const HeaderActionButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
}> = ({ label, icon, onClick, active = false, danger = false, disabled = false }) => {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-200",
        disabled && "cursor-not-allowed opacity-50",
        !disabled &&
          (danger
            ? "border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900 dark:bg-slate-950 dark:text-rose-400 dark:hover:bg-rose-950/30"
            : active
            ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-white")
      )}
    >
      {icon}
    </button>
  );
};

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  title,
  participant,
  channel = "chat",
  statusLabel = "Active",
  priorityLabel,
  lastSeenLabel,
  unreadCount = 0,
  isPinned = false,
  isMuted = false,
  isStarred = false,
  isInternal = false,
  stats = [],
  className,
  showBackButton = false,
  showSearchButton = true,
  showCallButtons = true,
  onBack,
  onTogglePin,
  onToggleMute,
  onToggleStar,
  onSearch,
  onAudioCall,
  onVideoCall,
  onArchive,
  actions = [],
}) => {
  const channelMeta = getChannelMeta(channel);

  return (
    <header
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {showBackButton ? (
              <HeaderActionButton
                label="Back"
                icon={<ArrowLeft className="h-4.5 w-4.5" />}
                onClick={onBack}
              />
            ) : null}

            <div className="relative shrink-0">
              {participant.avatarUrl ? (
                <img
                  src={participant.avatarUrl}
                  alt={participant.name}
                  className="h-14 w-14 rounded-3xl border border-slate-200 object-cover dark:border-slate-800"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  {getInitials(participant.name)}
                </div>
              )}

              {participant.isOnline ? (
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {title || participant.name}
                </h1>

                {participant.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300">
                    <CheckCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                ) : null}

                {isInternal ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                    <Shield className="h-3.5 w-3.5" />
                    Internal
                  </span>
                ) : null}

                {unreadCount > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                    {unreadCount} new
                  </span>
                ) : null}
              </div>

              {participant.subtitle ? (
                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                  {participant.subtitle}
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {channelMeta.icon}
                  {channelMeta.label}
                </span>

                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                  {statusLabel}
                </span>

                {priorityLabel ? (
                  <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                    {priorityLabel}
                  </span>
                ) : null}

                {lastSeenLabel ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    <Clock3 className="h-3.5 w-3.5" />
                    {lastSeenLabel}
                  </span>
                ) : null}
              </div>

              {(participant.email || participant.phone) && (
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                  {participant.email ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {participant.email}
                    </span>
                  ) : null}

                  {participant.phone ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {participant.phone}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {showSearchButton ? (
              <HeaderActionButton
                label="Search"
                icon={<Search className="h-4.5 w-4.5" />}
                onClick={onSearch}
              />
            ) : null}

            {showCallButtons && channel !== "internal" ? (
              <>
                <HeaderActionButton
                  label="Audio Call"
                  icon={<Phone className="h-4.5 w-4.5" />}
                  onClick={onAudioCall}
                />
                <HeaderActionButton
                  label="Video Call"
                  icon={<Video className="h-4.5 w-4.5" />}
                  onClick={onVideoCall}
                />
              </>
            ) : null}

            <HeaderActionButton
              label={isPinned ? "Unpin" : "Pin"}
              icon={<Pin className="h-4.5 w-4.5" />}
              onClick={onTogglePin}
              active={isPinned}
            />

            <HeaderActionButton
              label={isMuted ? "Unmute" : "Mute"}
              icon={<Bell className="h-4.5 w-4.5" />}
              onClick={onToggleMute}
              active={isMuted}
            />

            <HeaderActionButton
              label={isStarred ? "Unstar" : "Star"}
              icon={<Star className="h-4.5 w-4.5" />}
              onClick={onToggleStar}
              active={isStarred}
            />

            <HeaderActionButton
              label="Archive"
              icon={<Archive className="h-4.5 w-4.5" />}
              onClick={onArchive}
            />

            {actions.length > 0 ? (
              <div className="relative">
                <HeaderActionButton
                  label="More"
                  icon={<MoreHorizontal className="h-4.5 w-4.5" />}
                />
              </div>
            ) : null}
          </div>
        </div>

        {stats.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  {stat.icon ? (
                    <div className="text-slate-500 dark:text-slate-400">
                      {stat.icon}
                    </div>
                  ) : (
                    <User2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  )}
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>

                <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default ConversationHeader;