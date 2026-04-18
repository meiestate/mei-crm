import React from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Mail,
  MessageSquareText,
  Phone,
  Sparkles,
  UserPlus,
} from "lucide-react";

export interface ActivityTimelineItem {
  id: string | number;
  title: string;
  description?: string;
  timestamp: string;
  category?: "message" | "call" | "meeting" | "note" | "system" | "task";
  status?: "completed" | "pending" | "scheduled" | "info";
  actor?: string;
  highlighted?: boolean;
  onClick?: () => void;
}

export interface ActivityTimelineProps {
  className?: string;
  title?: string;
  subtitle?: string;
  items?: ActivityTimelineItem[];
  compact?: boolean;
  showHeader?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getCategoryIcon = (category: ActivityTimelineItem["category"]) => {
  switch (category) {
    case "message":
      return MessageSquareText;
    case "call":
      return Phone;
    case "meeting":
      return CalendarDays;
    case "note":
      return FileText;
    case "task":
      return CheckCircle2;
    case "system":
    default:
      return Sparkles;
  }
};

const getStatusStyles = (status: ActivityTimelineItem["status"]) => {
  switch (status) {
    case "completed":
      return {
        dot: "bg-emerald-500",
        badge:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300",
        label: "Completed",
      };
    case "pending":
      return {
        dot: "bg-amber-500",
        badge:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300",
        label: "Pending",
      };
    case "scheduled":
      return {
        dot: "bg-sky-500",
        badge:
          "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/20 dark:text-sky-300",
        label: "Scheduled",
      };
    case "info":
    default:
      return {
        dot: "bg-slate-400",
        badge:
          "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
        label: "Update",
      };
  }
};

const defaultItems: ActivityTimelineItem[] = [
  {
    id: 1,
    title: "Brochure shared on WhatsApp",
    description: "Sent project brochure, payment plan summary, and 2BHK pricing details.",
    timestamp: "Today • 10:32 AM",
    category: "message",
    status: "completed",
    actor: "You",
    highlighted: true,
  },
  {
    id: 2,
    title: "Follow-up call scheduled",
    description: "Customer asked for a short call after discussing with family.",
    timestamp: "Today • 4:00 PM",
    category: "call",
    status: "scheduled",
    actor: "Sales Team",
  },
  {
    id: 3,
    title: "Internal note added",
    description: "Lead is interested in east-facing units and prefers a faster possession timeline.",
    timestamp: "Yesterday • 6:45 PM",
    category: "note",
    status: "info",
    actor: "Meena",
  },
  {
    id: 4,
    title: "Site visit reminder pending",
    description: "Need confirmation before blocking the sales manager slot.",
    timestamp: "Tomorrow • 11:00 AM",
    category: "task",
    status: "pending",
    actor: "System",
  },
];

const TimelineItemCard: React.FC<{
  item: ActivityTimelineItem;
  compact?: boolean;
  isLast?: boolean;
}> = ({ item, compact, isLast }) => {
  const Icon = getCategoryIcon(item.category);
  const status = getStatusStyles(item.status);

  return (
    <div className="relative flex gap-4">
      <div className="relative flex w-10 shrink-0 flex-col items-center">
        <div
          className={cn(
            "z-10 flex h-10 w-10 items-center justify-center rounded-2xl border",
            item.highlighted
              ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
              : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        {!isLast ? (
          <div className="absolute top-10 h-[calc(100%+0.5rem)] w-px bg-slate-200 dark:bg-slate-800" />
        ) : null}
      </div>

      <button
        type="button"
        onClick={item.onClick}
        className={cn(
          "group mb-4 flex-1 rounded-3xl border text-left transition",
          compact ? "p-4" : "p-5",
          item.highlighted
            ? "border-slate-300 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:hover:bg-slate-900/70"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </h3>

              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                  status.badge
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", status.dot)} />
                {status.label}
              </span>
            </div>

            {item.description ? (
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            ) : null}
          </div>

          <ChevronRight className="h-4.5 w-4.5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 dark:text-slate-500" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            {item.timestamp}
          </span>

          {item.actor ? (
            <span className="inline-flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5" />
              {item.actor}
            </span>
          ) : null}
        </div>
      </button>
    </div>
  );
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  className,
  title = "Activity Timeline",
  subtitle = "A clean view of conversation history, follow-ups, and every meaningful action in motion.",
  items = defaultItems,
  compact = false,
  showHeader = true,
  emptyTitle = "No activity yet",
  emptyDescription = "Once messages, calls, notes, and follow-ups start happening, they’ll appear here in a clean chronological flow.",
}) => {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      {showHeader ? (
        <div className="border-b border-slate-200 p-5 sm:p-6 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <Mail className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Timeline
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                {title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className={cn("p-5 sm:p-6", compact && "p-4")}>
        {items.length ? (
          <div>
            {items.map((item, index) => (
              <TimelineItemCard
                key={item.id}
                item={item}
                compact={compact}
                isLast={index === items.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[260px] items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center dark:border-slate-700 dark:bg-slate-900/30">
            <div className="max-w-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <Clock3 className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {emptyTitle}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {emptyDescription}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivityTimeline;