import React from "react";
import {
  AlertTriangle,
  Bug,
  Info,
  RefreshCw,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  className?: string;
  fullHeight?: boolean;
  compact?: boolean;
  severity?: "error" | "warning" | "info";
  showIcon?: boolean;
  bordered?: boolean;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  details?: string;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getSeverityMeta = (severity: ErrorStateProps["severity"] = "error") => {
  switch (severity) {
    case "warning":
      return {
        icon: TriangleAlert,
        container:
          "border-amber-200 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/20",
        iconWrap:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
        badge:
          "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/30 dark:text-amber-200",
        label: "Warning",
      };

    case "info":
      return {
        icon: Info,
        container:
          "border-sky-200 bg-sky-50/80 dark:border-sky-900/60 dark:bg-sky-950/20",
        iconWrap:
          "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
        badge:
          "border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-900/60 dark:bg-sky-900/30 dark:text-sky-200",
        label: "Info",
      };

    case "error":
    default:
      return {
        icon: AlertTriangle,
        container:
          "border-rose-200 bg-rose-50/80 dark:border-rose-900/60 dark:bg-rose-950/20",
        iconWrap:
          "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
        badge:
          "border-rose-200 bg-rose-100 text-rose-800 dark:border-rose-900/60 dark:bg-rose-900/30 dark:text-rose-200",
        label: "Error",
      };
  }
};

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "We couldn’t load this section right now. Please try again in a moment.",
  className,
  fullHeight = false,
  compact = false,
  severity = "error",
  showIcon = true,
  bordered = true,
  primaryActionLabel = "Try Again",
  secondaryActionLabel = "Report Issue",
  onPrimaryAction,
  onSecondaryAction,
  details,
}) => {
  const meta = getSeverityMeta(severity);
  const SeverityIcon = meta.icon;

  return (
    <section
      className={cn(
        "w-full",
        fullHeight && "flex min-h-[320px] items-center justify-center",
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
              <SeverityIcon
                className={cn(compact ? "h-7 w-7" : "h-8 w-8")}
                aria-hidden="true"
              />
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
                  meta.badge
                )}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                {meta.label}
              </span>

              {details ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
                  <Bug className="h-3.5 w-3.5" />
                  Technical details available
                </span>
              ) : null}
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

            {details ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Details
                </p>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-slate-700 dark:text-slate-300">
                  {details}
                </pre>
              </div>
            ) : null}

            {(onPrimaryAction || onSecondaryAction) && (
              <div className="mt-5 flex flex-wrap gap-3">
                {onPrimaryAction ? (
                  <button
                    type="button"
                    onClick={onPrimaryAction}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  >
                    <RefreshCw className="h-4.5 w-4.5" />
                    {primaryActionLabel}
                  </button>
                ) : null}

                {onSecondaryAction ? (
                  <button
                    type="button"
                    onClick={onSecondaryAction}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                  >
                    <Bug className="h-4.5 w-4.5" />
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

export default ErrorState;