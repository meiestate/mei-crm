import React from "react";

export interface ComposerTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  disabled?: boolean;
}

export interface ComposerTabsProps {
  tabs: ComposerTabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  fullWidth?: boolean;
  compact?: boolean;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const ComposerTabs: React.FC<ComposerTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  fullWidth = false,
  compact = false,
}) => {
  return (
    <div
      className={cn(
        "inline-flex w-full rounded-2xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900",
        className
      )}
      role="tablist"
      aria-label="Composer tabs"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`composer-tab-panel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => {
              if (!tab.disabled) {
                onChange(tab.id);
              }
            }}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
              compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm",
              fullWidth ? "flex-1" : "shrink-0",
              isActive
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
              tab.disabled &&
                "cursor-not-allowed opacity-50 hover:text-inherit dark:hover:text-inherit"
            )}
          >
            {tab.icon ? <span className="shrink-0">{tab.icon}</span> : null}

            <span className="truncate">{tab.label}</span>

            {typeof tab.count === "number" ? (
              <span
                className={cn(
                  "inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  isActive
                    ? "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    : "bg-white/70 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export default ComposerTabs;