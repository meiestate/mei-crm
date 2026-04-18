import React from "react";
import { Loader2, Sparkles } from "lucide-react";

export interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
  fullHeight?: boolean;
  compact?: boolean;
  showIcon?: boolean;
  showProgressBars?: boolean;
  count?: number;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const SkeletonLine: React.FC<{
  widthClass?: string;
  heightClass?: string;
}> = ({ widthClass = "w-full", heightClass = "h-3.5" }) => (
  <div
    className={cn(
      "animate-pulse rounded-full bg-slate-200 dark:bg-slate-800",
      widthClass,
      heightClass
    )}
  />
);

const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="animate-pulse">
        <div className="mb-4 flex items-start gap-3">
          <div className="h-11 w-11 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonLine widthClass="w-36" heightClass="h-4" />
            <SkeletonLine widthClass="w-24" heightClass="h-3" />
          </div>
        </div>

        <div className="space-y-3">
          <SkeletonLine widthClass="w-full" />
          <SkeletonLine widthClass="w-11/12" />
          <SkeletonLine widthClass="w-9/12" />
        </div>

        <div className="mt-4 flex gap-2">
          <div className="h-7 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-7 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-7 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

const LoadingState: React.FC<LoadingStateProps> = ({
  title = "Loading content",
  description = "We’re pulling everything together. This will be ready in a moment.",
  className,
  fullHeight = false,
  compact = false,
  showIcon = true,
  showProgressBars = true,
  count = 3,
}) => {
  const safeCount = Math.max(1, Math.min(count, 6));

  return (
    <section
      className={cn(
        "w-full",
        fullHeight && "flex min-h-[360px] items-center justify-center",
        className
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div
            className={cn(
              "flex flex-col gap-5",
              compact ? "sm:flex-row sm:items-center" : "sm:flex-row sm:items-start sm:justify-between"
            )}
          >
            <div className="flex min-w-0 items-start gap-4">
              {showIcon ? (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : null}

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    In Progress
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
                    "mt-2 max-w-2xl text-slate-600 dark:text-slate-300",
                    compact ? "text-sm leading-6" : "text-sm leading-7 sm:text-base"
                  )}
                >
                  {description}
                </p>
              </div>
            </div>

            {showProgressBars ? (
              <div className="w-full max-w-xs space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      Syncing
                    </span>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      ...
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-slate-900 dark:bg-slate-100" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      Rendering
                    </span>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      ...
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-slate-700 dark:bg-slate-300" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div
            className={cn(
              "mt-6 grid gap-4",
              safeCount === 1
                ? "grid-cols-1"
                : safeCount === 2
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-1 xl:grid-cols-2"
            )}
          >
            {Array.from({ length: safeCount }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoadingState;