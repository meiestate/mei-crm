import { type CSSProperties, type ReactNode } from "react";

export type AnalyticsFilterChipTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type AnalyticsFilterOption = {
  label: string;
  value: string;
};

export type AnalyticsFilterItem = {
  key: string;
  label: string;
  value?: string | string[];
  placeholder?: string;
  options?: AnalyticsFilterOption[];
  type?: "select" | "multiselect" | "search" | "date" | "custom";
  customNode?: ReactNode;
  disabled?: boolean;
  minWidth?: number | string;
  onChange?: (value: string | string[]) => void;
};

export type AnalyticsFilterBarProps = {
  filters?: AnalyticsFilterItem[];
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onApply?: () => void;
  onReset?: () => void;
  onOpenMoreFilters?: () => void;
  applyLabel?: string;
  resetLabel?: string;
  moreFiltersLabel?: string;
  title?: string;
  subtitle?: string;
  tone?: AnalyticsFilterChipTone;
  sticky?: boolean;
  loading?: boolean;
  showSummary?: boolean;
  activeFilterCount?: number;
  bordered?: boolean;
  elevated?: boolean;
  wrapActions?: boolean;
  style?: CSSProperties;
  className?: string;
};

type ToneStyles = {
  accent: string;
  softBg: string;
  border: string;
  text: string;
  subText: string;
  chipBg: string;
  chipText: string;
  buttonBg: string;
  buttonText: string;
};

function getToneStyles(tone: AnalyticsFilterChipTone): ToneStyles {
  switch (tone) {
    case "primary":
      return {
        accent: "#111827",
        softBg: "#f3f4f6",
        border: "#e5e7eb",
        text: "#111827",
        subText: "#6b7280",
        chipBg: "#111827",
        chipText: "#ffffff",
        buttonBg: "#111827",
        buttonText: "#ffffff",
      };
    case "success":
      return {
        accent: "#047857",
        softBg: "#ecfdf3",
        border: "#a7f3d0",
        text: "#064e3b",
        subText: "#047857",
        chipBg: "#047857",
        chipText: "#ffffff",
        buttonBg: "#047857",
        buttonText: "#ffffff",
      };
    case "warning":
      return {
        accent: "#c2410c",
        softBg: "#fff7ed",
        border: "#fdba74",
        text: "#7c2d12",
        subText: "#c2410c",
        chipBg: "#c2410c",
        chipText: "#ffffff",
        buttonBg: "#c2410c",
        buttonText: "#ffffff",
      };
    case "danger":
      return {
        accent: "#b91c1c",
        softBg: "#fef2f2",
        border: "#fecaca",
        text: "#7f1d1d",
        subText: "#b91c1c",
        chipBg: "#b91c1c",
        chipText: "#ffffff",
        buttonBg: "#b91c1c",
        buttonText: "#ffffff",
      };
    case "info":
      return {
        accent: "#1d4ed8",
        softBg: "#eff6ff",
        border: "#bfdbfe",
        text: "#1e3a8a",
        subText: "#1d4ed8",
        chipBg: "#1d4ed8",
        chipText: "#ffffff",
        buttonBg: "#1d4ed8",
        buttonText: "#ffffff",
      };
    default:
      return {
        accent: "#374151",
        softBg: "#f9fafb",
        border: "#e5e7eb",
        text: "#111827",
        subText: "#6b7280",
        chipBg: "#6b7280",
        chipText: "#ffffff",
        buttonBg: "#111827",
        buttonText: "#ffffff",
      };
  }
}

function normalizeValue(value?: string | string[]): string {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value ?? "";
}

function FilterBarSkeleton() {
  return (
    <section
      aria-busy="true"
      style={{
        width: "100%",
        borderRadius: 20,
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 160,
          height: 16,
          borderRadius: 8,
          background: "#e5e7eb",
          marginBottom: 10,
        }}
      />
      <div
        style={{
          width: "58%",
          height: 12,
          borderRadius: 8,
          background: "#f3f4f6",
          marginBottom: 14,
        }}
      />
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            style={{
              width: index === 0 ? 220 : 150,
              height: 42,
              borderRadius: 12,
              background: "#f9fafb",
              border: "1px solid #f3f4f6",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            style={{
              width: 118,
              height: 40,
              borderRadius: 12,
              background: index === 0 ? "#e5e7eb" : "#f3f4f6",
              border: index === 0 ? "none" : "1px solid #e5e7eb",
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default function AnalyticsFilterBar({
  filters = [],
  searchValue = "",
  searchPlaceholder = "Search analytics...",
  onSearchChange,
  onApply,
  onReset,
  onOpenMoreFilters,
  applyLabel = "Apply Filters",
  resetLabel = "Reset",
  moreFiltersLabel = "More Filters",
  title = "Filters",
  subtitle = "Refine analytics data using date range, team, source, project, and pipeline conditions",
  tone = "default",
  sticky = false,
  loading = false,
  showSummary = true,
  activeFilterCount,
  bordered = true,
  elevated = true,
  wrapActions = true,
  style,
}: AnalyticsFilterBarProps) {
  const toneStyles = getToneStyles(tone);

  if (loading) {
    return <FilterBarSkeleton />;
  }

  const resolvedActiveCount =
    typeof activeFilterCount === "number"
      ? activeFilterCount
      : filters.reduce((count, item) => {
          const rawValue = normalizeValue(item.value).trim();
          return rawValue ? count + 1 : count;
        }, 0) + (searchValue.trim() ? 1 : 0);

  return (
    <section
      style={{
        width: "100%",
        borderRadius: 20,
        border: bordered ? `1px solid ${toneStyles.border}` : "none",
        background: "#ffffff",
        boxShadow: elevated
          ? "0 10px 28px rgba(15, 23, 42, 0.06)"
          : "none",
        padding: 16,
        boxSizing: "border-box",
        position: sticky ? "sticky" : "relative",
        top: sticky ? 0 : undefined,
        zIndex: sticky ? 10 : undefined,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 14,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: subtitle ? 6 : 0,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: toneStyles.text,
                lineHeight: 1.3,
              }}
            >
              {title}
            </div>

            {showSummary ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 26,
                  padding: "0 10px",
                  borderRadius: 999,
                  background: toneStyles.chipBg,
                  color: toneStyles.chipText,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                {resolvedActiveCount} active
              </span>
            ) : null}
          </div>

          {subtitle ? (
            <div
              style={{
                fontSize: 13,
                lineHeight: 1.55,
                color: toneStyles.subText,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "stretch",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            minWidth: 220,
            flex: "1 1 240px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 42,
            borderRadius: 12,
            border: `1px solid ${toneStyles.border}`,
            background: "#ffffff",
            padding: "0 12px",
            boxSizing: "border-box",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              fontSize: 14,
              color: "#6b7280",
            }}
          >
            🔎
          </span>

          <input
            type="text"
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={(event) => onSearchChange?.(event.target.value)}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 13,
              fontWeight: 600,
              color: "#111827",
            }}
          />
        </div>

        {filters.map((filter) => {
          if (filter.type === "custom" && filter.customNode) {
            return (
              <div
                key={filter.key}
                style={{
                  minWidth: filter.minWidth ?? 160,
                  flex: "0 1 auto",
                }}
              >
                {filter.customNode}
              </div>
            );
          }

          const isMulti = filter.type === "multiselect";
          const currentValue = normalizeValue(filter.value);

          return (
            <div
              key={filter.key}
              style={{
                minWidth: filter.minWidth ?? 160,
                flex: "0 1 auto",
              }}
            >
              <label
                style={{
                  display: "grid",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6b7280",
                  }}
                >
                  {filter.label}
                </span>

                {filter.type === "search" ? (
                  <input
                    type="text"
                    disabled={filter.disabled}
                    value={currentValue}
                    placeholder={filter.placeholder ?? `Search ${filter.label}`}
                    onChange={(event) => filter.onChange?.(event.target.value)}
                    style={getInputStyle(filter.disabled, toneStyles)}
                  />
                ) : filter.type === "date" ? (
                  <input
                    type="date"
                    disabled={filter.disabled}
                    value={currentValue}
                    onChange={(event) => filter.onChange?.(event.target.value)}
                    style={getInputStyle(filter.disabled, toneStyles)}
                  />
                ) : (
                  <select
                    multiple={isMulti}
                    disabled={filter.disabled}
                    value={
                      isMulti
                        ? Array.isArray(filter.value)
                          ? filter.value
                          : currentValue
                          ? [currentValue]
                          : []
                        : currentValue
                    }
                    onChange={(event) => {
                      if (isMulti) {
                        const selectedValues = Array.from(
                          event.currentTarget.selectedOptions
                        ).map((option) => option.value);
                        filter.onChange?.(selectedValues);
                        return;
                      }

                      filter.onChange?.(event.target.value);
                    }}
                    style={{
                      ...getInputStyle(filter.disabled, toneStyles),
                      height: isMulti ? 90 : 42,
                    }}
                  >
                    {!isMulti ? (
                      <option value="">{filter.placeholder ?? `All ${filter.label}`}</option>
                    ) : null}

                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </label>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: wrapActions ? "wrap" : "nowrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            minWidth: 0,
            flex: 1,
          }}
        >
          {showSummary && resolvedActiveCount > 0 ? (
            <>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#6b7280",
                }}
              >
                Active filters:
              </span>

              {searchValue.trim() ? (
                <ActiveChip
                  label={`Search: ${searchValue}`}
                  toneStyles={toneStyles}
                />
              ) : null}

              {filters
                .filter((item) => normalizeValue(item.value).trim())
                .map((item) => (
                  <ActiveChip
                    key={item.key}
                    label={`${item.label}: ${normalizeValue(item.value)}`}
                    toneStyles={toneStyles}
                  />
                ))}
            </>
          ) : (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#9ca3af",
              }}
            >
              No filters applied
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {onOpenMoreFilters ? (
            <button
              type="button"
              onClick={onOpenMoreFilters}
              style={{
                minHeight: 40,
                padding: "0 14px",
                borderRadius: 12,
                border: `1px solid ${toneStyles.border}`,
                background: "#ffffff",
                color: toneStyles.accent,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {moreFiltersLabel}
            </button>
          ) : null}

          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              style={{
                minHeight: 40,
                padding: "0 14px",
                borderRadius: 12,
                border: `1px solid ${toneStyles.border}`,
                background: toneStyles.softBg,
                color: toneStyles.accent,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {resetLabel}
            </button>
          ) : null}

          {onApply ? (
            <button
              type="button"
              onClick={onApply}
              style={{
                minHeight: 40,
                padding: "0 16px",
                borderRadius: 12,
                border: `1px solid ${toneStyles.buttonBg}`,
                background: toneStyles.buttonBg,
                color: toneStyles.buttonText,
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {applyLabel}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function getInputStyle(
  disabled: boolean | undefined,
  toneStyles: ToneStyles
): CSSProperties {
  return {
    width: "100%",
    height: 42,
    borderRadius: 12,
    border: `1px solid ${toneStyles.border}`,
    background: disabled ? "#f9fafb" : "#ffffff",
    padding: "0 12px",
    boxSizing: "border-box",
    outline: "none",
    fontSize: 13,
    fontWeight: 600,
    color: disabled ? "#9ca3af" : "#111827",
  };
}

function ActiveChip({
  label,
  toneStyles,
}: {
  label: string;
  toneStyles: ToneStyles;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 28,
        padding: "0 10px",
        borderRadius: 999,
        background: toneStyles.softBg,
        border: `1px solid ${toneStyles.border}`,
        color: toneStyles.accent,
        fontSize: 12,
        fontWeight: 700,
        maxWidth: "100%",
        wordBreak: "break-word",
      }}
    >
      {label}
    </span>
  );
}