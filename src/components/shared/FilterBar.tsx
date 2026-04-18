import React from "react";
import {
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

export interface FilterBarOption {
  label: string;
  value: string;
}

export interface FilterBarSelectConfig {
  key: string;
  label?: string;
  value: string;
  placeholder?: string;
  options: FilterBarOption[];
  onChange?: (value: string) => void;
}

export interface FilterBarProps {
  className?: string;
  title?: string;
  subtitle?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  selects?: FilterBarSelectConfig[];
  activeFilterCount?: number;
  resultCount?: number;
  onReset?: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  compact?: boolean;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const defaultSelects: FilterBarSelectConfig[] = [
  {
    key: "status",
    label: "Status",
    value: "",
    placeholder: "All statuses",
    options: [
      { label: "All statuses", value: "" },
      { label: "New", value: "new" },
      { label: "Qualified", value: "qualified" },
      { label: "Follow-up", value: "follow-up" },
      { label: "Closed", value: "closed" },
    ],
  },
  {
    key: "channel",
    label: "Channel",
    value: "",
    placeholder: "All channels",
    options: [
      { label: "All channels", value: "" },
      { label: "WhatsApp", value: "whatsapp" },
      { label: "Email", value: "email" },
      { label: "Phone", value: "phone" },
    ],
  },
  {
    key: "priority",
    label: "Priority",
    value: "",
    placeholder: "Any priority",
    options: [
      { label: "Any priority", value: "" },
      { label: "High", value: "high" },
      { label: "Medium", value: "medium" },
      { label: "Low", value: "low" },
    ],
  },
];

const FilterBar: React.FC<FilterBarProps> = ({
  className,
  title = "Smart Filters",
  subtitle = "Tighten the view, cut the noise, and surface what actually needs attention.",
  searchValue = "",
  searchPlaceholder = "Search by name, message, tag, or keyword...",
  onSearchChange,
  selects = defaultSelects,
  activeFilterCount = 0,
  resultCount,
  onReset,
  primaryActionLabel = "Advanced Filters",
  onPrimaryAction,
  compact = false,
}) => {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div
        className={cn(
          "border-b border-slate-200 dark:border-slate-800",
          compact ? "p-4" : "p-5 sm:p-6"
        )}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <Filter className="h-3.5 w-3.5" />
                Filter Panel
              </span>

              {activeFilterCount > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  {activeFilterCount} active
                </span>
              ) : null}
            </div>

            <h2 className="mt-3 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {typeof resultCount === "number" ? (
              <span className="inline-flex h-10 items-center rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {resultCount} results
              </span>
            ) : null}

            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
            >
              <RotateCcw className="h-4.5 w-4.5" />
              Reset
            </button>

            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <SlidersHorizontal className="h-4.5 w-4.5" />
              {primaryActionLabel}
            </button>
          </div>
        </div>
      </div>

      <div className={cn(compact ? "p-4" : "p-5 sm:p-6")}>
        <div className="grid gap-4 xl:grid-cols-[minmax(260px,1.35fr)_minmax(0,1fr)]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-950"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {selects.map((select) => (
              <label key={select.key} className="block">
                {select.label ? (
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    {select.label}
                  </span>
                ) : null}

                <select
                  value={select.value}
                  onChange={(e) => select.onChange?.(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-600"
                >
                  {select.placeholder && !select.options.some((option) => option.value === "") ? (
                    <option value="">{select.placeholder}</option>
                  ) : null}

                  {select.options.map((option) => (
                    <option key={`${select.key}-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterBar;