import React from "react";
import {
  Database,
  FileSearch,
  Filter,
  Inbox,
  Plus,
  SearchX,
  Sparkles,
} from "lucide-react";

export interface NoDataStateProps {
  title?: string;
  description?: string;
  className?: string;
  fullHeight?: boolean;
  compact?: boolean;
  variant?: "default" | "search" | "filter" | "empty";
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  showIcon?: boolean;
  bordered?: boolean;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getVariantMeta = (variant: NoDataStateProps["variant"] = "default") => {
  switch (variant) {
    case "search":
      return {
        icon: SearchX,
        badgeLabel: "No Search Results",
        iconWrap:
          "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
        container:
          "border-sky-200 bg-sky-50/70 dark:border-sky-900/60 dark:bg-sky-950/20",
      };

    case "filter":
      return {
        icon: Filter,
        badgeLabel: "Filtered Empty State",
        iconWrap:
          "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
        container:
          "border-violet-200 bg-violet-50/70 dark:border-violet-900/60 dark:bg-violet-950/20",
      };

    case "empty":
      return {
        icon: Inbox,
        badgeLabel: "Nothing Here Yet",
        iconWrap:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
        container:
          "border-amber-200 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/20",
      };

    case "default":
    default:
      return {
        icon: Database,
        badgeLabel: "No Data Available",
        iconWrap:
          "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
        container:
          "border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950",
      };
  }
};

const NoDataState: React.FC<NoDataStateProps> = ({
  title = "No data to show right now",
  description = "There’s nothing available in this section yet. Once data starts flowing in, it’ll appear here.",
  className,
  fullHeight = false,
  compact = false,
  variant = "default",
  primaryActionLabel = "Create New",
  secondaryActionLabel = "Refresh",
  onPrimaryAction,
  onSecondaryAction,
  showIcon = true,
  bordered = true,
}) => {
  const meta = getVariantMeta(variant);
  const Icon = meta.icon;

  return (
    <section
      className={cn(
        "w-full",
        fullHeight && "flex min-h-[360px] items-center justify-center",
        className
      )}
      aria-live="polite"
    >
      <div
        className={cn(
          "mx-auto w-full max-w-2xl overflow-hidden rounded-3xl",
          bordered ? cn("border shadow-sm", meta.container) : "bg-transparent",
          compact ? "p-5" : "p-6 sm:p-8"
        )}
      >
        <div
          className={cn(
            "flex flex-col items-start gap-5",
            compact ? "sm:flex-row sm:items-start" : "sm:flex-row sm:items-center"
          )}
        >
          {showIcon ? (
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-2xl",
                compact ? "h-14 w-14" : "h-16 w-16",
                meta.iconWrap
              )}
            >
              <Icon
                className={cn(compact ? "h-7 w-7" : "h-8 w-8")}
                aria-hidden="true"
              />
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
                <Sparkles className="h-3.5 w-3.5" />
                {meta.badgeLabel}
              </span>
            </div>

            <h3
              className={cn(
                "font-semibold tracking-tight text-slate-900 dark:text-slate-100",
                compact ? "text-lg" : "text-xl sm:text-2xl"
              )}
            >
              {title}
            </h3>

            <p
              className={cn(
                "mt-2 max-w-xl text-slate-600 dark:text-slate-300",
                compact ? "text-sm leading-6" : "text-sm leading-7 sm:text-base"
              )}
            >
              {description}
            </p>

            {(onPrimaryAction || onSecondaryAction) && (
              <div className="mt-5 flex flex-wrap gap-3">
                {onPrimaryAction ? (
                  <button
                    type="button"
                    onClick={onPrimaryAction}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    {primaryActionLabel}
                  </button>
                ) : null}

                {onSecondaryAction ? (
                  <button
                    type="button"
                    onClick={onSecondaryAction}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                  >
                    <FileSearch className="h-4.5 w-4.5" />
                    {secondaryActionLabel}
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoDataState;