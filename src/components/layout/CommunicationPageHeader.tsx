import React from "react";
import {
  Bell,
  ChevronRight,
  Download,
  Filter,
  MessageSquareText,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Sparkles,
  Zap,
} from "lucide-react";

type HeaderActionVariant = "primary" | "secondary" | "ghost";

export interface CommunicationPageHeaderAction {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: HeaderActionVariant;
  disabled?: boolean;
}

export interface CommunicationPageHeaderMetric {
  id: string | number;
  label: string;
  value: string | number;
  change?: string;
  tone?: "neutral" | "positive" | "warning";
}

export interface CommunicationPageHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
  breadcrumbs?: string[];
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  primaryAction?: CommunicationPageHeaderAction | null;
  actions?: CommunicationPageHeaderAction[];
  metrics?: CommunicationPageHeaderMetric[];
  showSearch?: boolean;
  showMetrics?: boolean;
  liveLabel?: string;
  rightMetaLabel?: string;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getActionClasses = (variant: HeaderActionVariant = "secondary") => {
  switch (variant) {
    case "primary":
      return "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white";
    case "ghost":
      return "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900";
    case "secondary":
    default:
      return "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900";
  }
};

const getMetricToneClasses = (
  tone: CommunicationPageHeaderMetric["tone"] = "neutral"
) => {
  switch (tone) {
    case "positive":
      return "text-emerald-600 dark:text-emerald-400";
    case "warning":
      return "text-amber-600 dark:text-amber-400";
    case "neutral":
    default:
      return "text-slate-500 dark:text-slate-400";
  }
};

const HeaderActionButton: React.FC<{
  action: CommunicationPageHeaderAction;
}> = ({ action }) => {
  return (
    <button
      type="button"
      onClick={action.onClick}
      disabled={action.disabled}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        getActionClasses(action.variant)
      )}
    >
      {action.icon ? <span className="shrink-0">{action.icon}</span> : null}
      <span>{action.label}</span>
    </button>
  );
};

const CommunicationPageHeader: React.FC<CommunicationPageHeaderProps> = ({
  title = "Communications",
  subtitle = "Keep every conversation, follow-up, and campaign signal aligned in one calm, high-clarity workspace.",
  className,
  breadcrumbs = ["Dashboard", "Communications"],
  searchValue = "",
  searchPlaceholder = "Search by contact, subject, message, channel, or template...",
  onSearchChange,
  primaryAction = {
    id: "compose",
    label: "Compose",
    icon: <Plus className="h-4.5 w-4.5" />,
    variant: "primary",
  },
  actions = [
    {
      id: "refresh",
      label: "Refresh",
      icon: <RefreshCw className="h-4.5 w-4.5" />,
      variant: "secondary",
    },
    {
      id: "filters",
      label: "Filters",
      icon: <Filter className="h-4.5 w-4.5" />,
      variant: "secondary",
    },
    {
      id: "export",
      label: "Export",
      icon: <Download className="h-4.5 w-4.5" />,
      variant: "secondary",
    },
  ],
  metrics = [
    { id: 1, label: "Open Threads", value: "248", change: "+12 today", tone: "positive" },
    { id: 2, label: "Awaiting Reply", value: "36", change: "Needs review", tone: "warning" },
    { id: 3, label: "Messages Sent", value: "1,284", change: "Last 7 days", tone: "neutral" },
    { id: 4, label: "Reply Rate", value: "82%", change: "+4.3%", tone: "positive" },
  ],
  showSearch = true,
  showMetrics = true,
  liveLabel = "Live sync active",
  rightMetaLabel = "Customer conversations",
}) => {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_24%),radial-gradient(circle_at_left,rgba(148,163,184,0.10),transparent_20%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_24%),radial-gradient(circle_at_left,rgba(148,163,184,0.08),transparent_20%)]" />

        <div className="relative p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                {breadcrumbs.length > 0 ? (
                  <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {breadcrumbs.map((item, index) => (
                      <React.Fragment key={`${item}-${index}`}>
                        <span
                          className={cn(
                            "truncate",
                            index === breadcrumbs.length - 1 &&
                              "text-slate-700 dark:text-slate-200"
                          )}
                        >
                          {item}
                        </span>
                        {index < breadcrumbs.length - 1 ? (
                          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                        ) : null}
                      </React.Fragment>
                    ))}
                  </div>
                ) : null}

                <div className="flex items-start gap-4">
                  <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 sm:flex dark:bg-slate-900 dark:text-slate-200">
                    <MessageSquareText className="h-7 w-7" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                        {title}
                      </h1>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        {liveLabel}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        <Zap className="h-3.5 w-3.5" />
                        {rightMetaLabel}
                      </span>
                    </div>

                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
                      {subtitle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                {actions.map((action) => (
                  <HeaderActionButton key={action.id} action={action} />
                ))}
                {primaryAction ? <HeaderActionButton action={primaryAction} /> : null}
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {showSearch ? (
                <div className="relative w-full max-w-2xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-950"
                  />
                </div>
              ) : (
                <div />
              )}

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                >
                  <Bell className="h-4.5 w-4.5" />
                  Alerts
                </button>

                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                >
                  <Settings2 className="h-4.5 w-4.5" />
                  Preferences
                </button>
              </div>
            </div>

            {showMetrics && metrics.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4 transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-900"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {metric.label}
                    </p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                        {metric.value}
                      </p>
                    </div>
                    {metric.change ? (
                      <p
                        className={cn(
                          "mt-1 text-xs font-medium",
                          getMetricToneClasses(metric.tone)
                        )}
                      >
                        {metric.change}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunicationPageHeader;