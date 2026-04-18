import React from "react";
import {
  AlertCircle,
  Check,
  CheckCheck,
  Clock3,
  Loader2,
  MailWarning,
  Minus,
  PauseCircle,
  Send,
} from "lucide-react";

export type DeliveryStatus =
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

export interface DeliveryStatusBadgeProps {
  status: DeliveryStatus;
  className?: string;
  compact?: boolean;
  showIcon?: boolean;
  showLabel?: boolean;
  title?: string;
  variant?: "subtle" | "solid";
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const statusConfig: Record<
  DeliveryStatus,
  {
    label: string;
    icon: React.ReactNode;
    subtle: string;
    solid: string;
  }
> = {
  draft: {
    label: "Draft",
    icon: <Minus className="h-3.5 w-3.5" />,
    subtle:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
    solid:
      "border-slate-700 bg-slate-700 text-white dark:border-slate-600 dark:bg-slate-600 dark:text-white",
  },
  queued: {
    label: "Queued",
    icon: <Clock3 className="h-3.5 w-3.5" />,
    subtle:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-300",
    solid:
      "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500 dark:text-white",
  },
  sending: {
    label: "Sending",
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    subtle:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300",
    solid:
      "border-sky-600 bg-sky-600 text-white dark:border-sky-500 dark:bg-sky-500 dark:text-white",
  },
  sent: {
    label: "Sent",
    icon: <Send className="h-3.5 w-3.5" />,
    subtle:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300",
    solid:
      "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500 dark:text-white",
  },
  delivered: {
    label: "Delivered",
    icon: <Check className="h-3.5 w-3.5" />,
    subtle:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
    solid:
      "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-white",
  },
  read: {
    label: "Read",
    icon: <CheckCheck className="h-3.5 w-3.5" />,
    subtle:
      "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-300",
    solid:
      "border-teal-600 bg-teal-600 text-white dark:border-teal-500 dark:bg-teal-500 dark:text-white",
  },
  failed: {
    label: "Failed",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    subtle:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300",
    solid:
      "border-rose-600 bg-rose-600 text-white dark:border-rose-500 dark:bg-rose-500 dark:text-white",
  },
  bounced: {
    label: "Bounced",
    icon: <MailWarning className="h-3.5 w-3.5" />,
    subtle:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-300",
    solid:
      "border-orange-600 bg-orange-600 text-white dark:border-orange-500 dark:bg-orange-500 dark:text-white",
  },
  scheduled: {
    label: "Scheduled",
    icon: <Clock3 className="h-3.5 w-3.5" />,
    subtle:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300",
    solid:
      "border-violet-600 bg-violet-600 text-white dark:border-violet-500 dark:bg-violet-500 dark:text-white",
  },
  paused: {
    label: "Paused",
    icon: <PauseCircle className="h-3.5 w-3.5" />,
    subtle:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
    solid:
      "border-amber-600 bg-amber-600 text-white dark:border-amber-500 dark:bg-amber-500 dark:text-white",
  },
  cancelled: {
    label: "Cancelled",
    icon: <Minus className="h-3.5 w-3.5" />,
    subtle:
      "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
    solid:
      "border-zinc-700 bg-zinc-700 text-white dark:border-zinc-600 dark:bg-zinc-600 dark:text-white",
  },
};

const DeliveryStatusBadge: React.FC<DeliveryStatusBadgeProps> = ({
  status,
  className,
  compact = false,
  showIcon = true,
  showLabel = true,
  title,
  variant = "subtle",
}) => {
  const config = statusConfig[status];
  const toneClass = variant === "solid" ? config.solid : config.subtle;

  return (
    <span
      title={title ?? config.label}
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-colors",
        compact ? "gap-1 px-2 py-0.5 text-[11px]" : "gap-1.5 px-2.5 py-1 text-xs",
        toneClass,
        className
      )}
    >
      {showIcon ? <span className="shrink-0">{config.icon}</span> : null}
      {showLabel ? <span>{config.label}</span> : null}
    </span>
  );
};

export default DeliveryStatusBadge;