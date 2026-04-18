import React from "react";
import {
  CheckCircle2,
  Clock3,
  Mail,
  MessageSquare,
  Phone,
  FileText,
  UserPlus,
  PencilLine,
  CalendarCheck2,
  AlertCircle,
  CircleDot,
  type LucideIcon,
} from "lucide-react";

type ActivityEventType =
  | "created"
  | "updated"
  | "note"
  | "call"
  | "email"
  | "message"
  | "meeting"
  | "task"
  | "status"
  | "warning"
  | "custom";

type ActivityEventTone =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

export interface ActivityEventRowProps {
  id: string | number;
  type?: ActivityEventType;
  title: string;
  description?: string;
  timestamp: string;
  actorName?: string;
  actorAvatarUrl?: string;
  tag?: string;
  isUnread?: boolean;
  isLast?: boolean;
  clickable?: boolean;
  onClick?: (id: string | number) => void;
  customIcon?: LucideIcon;
  tone?: ActivityEventTone;
  meta?: string;
  className?: string;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const typeIconMap: Record<ActivityEventType, LucideIcon> = {
  created: UserPlus,
  updated: PencilLine,
  note: FileText,
  call: Phone,
  email: Mail,
  message: MessageSquare,
  meeting: CalendarCheck2,
  task: CheckCircle2,
  status: CircleDot,
  warning: AlertCircle,
  custom: Clock3,
};

const toneStyles: Record<
  ActivityEventTone,
  {
    dot: string;
    iconWrap: string;
    icon: string;
    tag: string;
  }
> = {
  default: {
    dot: "bg-slate-400",
    iconWrap:
      "bg-slate-100 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700",
    icon: "text-slate-700 dark:text-slate-200",
    tag: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  },
  success: {
    dot: "bg-emerald-500",
    iconWrap:
      "bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900",
    icon: "text-emerald-600 dark:text-emerald-400",
    tag: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  },
  warning: {
    dot: "bg-amber-500",
    iconWrap:
      "bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900",
    icon: "text-amber-600 dark:text-amber-400",
    tag: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  },
  danger: {
    dot: "bg-rose-500",
    iconWrap:
      "bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900",
    icon: "text-rose-600 dark:text-rose-400",
    tag: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
  },
  info: {
    dot: "bg-sky-500",
    iconWrap:
      "bg-sky-50 border border-sky-200 dark:bg-sky-950/40 dark:border-sky-900",
    icon: "text-sky-600 dark:text-sky-400",
    tag: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
  },
  muted: {
    dot: "bg-zinc-400",
    iconWrap:
      "bg-zinc-100 border border-zinc-200 dark:bg-zinc-800/80 dark:border-zinc-700",
    icon: "text-zinc-600 dark:text-zinc-300",
    tag: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700",
  },
};

function getToneByType(type: ActivityEventType): ActivityEventTone {
  switch (type) {
    case "created":
    case "task":
      return "success";
    case "warning":
      return "warning";
    case "call":
    case "meeting":
    case "message":
    case "email":
      return "info";
    case "status":
      return "muted";
    default:
      return "default";
  }
}

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const ActivityEventRow: React.FC<ActivityEventRowProps> = ({
  id,
  type = "custom",
  title,
  description,
  timestamp,
  actorName,
  actorAvatarUrl,
  tag,
  isUnread = false,
  isLast = false,
  clickable = false,
  onClick,
  customIcon: CustomIcon,
  tone,
  meta,
  className,
}) => {
  const resolvedTone = tone ?? getToneByType(type);
  const styles = toneStyles[resolvedTone];
  const Icon = CustomIcon ?? typeIconMap[type];

  const handleClick = () => {
    if (clickable && onClick) {
      onClick(id);
    }
  };

  const Wrapper: React.ElementType = clickable ? "button" : "div";

  return (
    <Wrapper
      type={clickable ? "button" : undefined}
      onClick={handleClick}
      className={cn(
        "group relative flex w-full items-start gap-4 rounded-2xl px-3 py-3 text-left transition-all duration-200",
        clickable &&
          "cursor-pointer hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:hover:bg-slate-900/60 dark:focus:ring-slate-700",
        isUnread &&
          "bg-sky-50/60 dark:bg-sky-950/20",
        className
      )}
    >
      <div className="relative flex flex-col items-center self-stretch pt-1">
        <span
          className={cn(
            "z-10 flex h-3 w-3 rounded-full ring-4 ring-white dark:ring-slate-950",
            styles.dot
          )}
        />
        {!isLast && (
          <span className="mt-1 w-px flex-1 bg-slate-200 dark:bg-slate-800" />
        )}
      </div>

      <div
        className={cn(
          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          styles.iconWrap
        )}
      >
        <Icon className={cn("h-4.5 w-4.5", styles.icon)} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h4>

              {tag ? (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                    styles.tag
                  )}
                >
                  {tag}
                </span>
              ) : null}

              {isUnread ? (
                <span className="inline-flex h-2 w-2 rounded-full bg-sky-500" />
              ) : null}
            </div>

            {description ? (
              <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {description}
              </p>
            ) : null}

            {(actorName || meta) && (
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {actorName ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                    {actorAvatarUrl ? (
                      <img
                        src={actorAvatarUrl}
                        alt={actorName}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                        {getInitials(actorName)}
                      </div>
                    )}
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                      {actorName}
                    </span>
                  </div>
                ) : null}

                {meta ? (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {meta}
                  </span>
                ) : null}
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Clock3 className="h-3.5 w-3.5" />
              {timestamp}
            </span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ActivityEventRow;