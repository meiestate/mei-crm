import type { ChangeEvent, ReactNode } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterField = {
  key: string;
  label: string;
  value: string;
  options: FilterOption[];
  placeholder?: string;
  onChange: (value: string) => void;
};

type FilterBarProps = {
  mode: ThemeMode;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  filters?: FilterField[];
  fromDate?: string;
  toDate?: string;
  onFromDateChange?: (value: string) => void;
  onToDateChange?: (value: string) => void;
  onClearFilters?: () => void;
  resultCount?: number;
  resultLabel?: string;
  actions?: ReactNode;
  compact?: boolean;
};

function FieldLabel({
  text,
  color,
}: {
  text: string;
  color: string;
}) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        color,
        marginBottom: 6,
        lineHeight: 1.2,
      }}
    >
      {text}
    </div>
  );
}

export default function FilterBar({
  mode,
  searchValue = "",
  searchPlaceholder = "Search...",
  onSearchChange,
  filters = [],
  fromDate = "",
  toDate = "",
  onFromDateChange,
  onToDateChange,
  onClearFilters,
  resultCount,
  resultLabel = "results",
  actions,
  compact = false,
}: FilterBarProps) {
  const theme = getTheme(mode);

  const inputBaseStyle = {
    width: "100%",
    height: compact ? 40 : 44,
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    outline: "none",
    background: theme.inputBg ?? theme.cardBg,
    color: theme.text,
    padding: compact ? "0 12px" : "0 14px",
    fontSize: 14,
    fontWeight: 500,
    boxSizing: "border-box" as const,
  };

  const selectBaseStyle = {
    ...inputBaseStyle,
    cursor: "pointer",
  };

  const hasAnyFilter =
    !!searchValue ||
    filters.some((item) => item.value) ||
    !!fromDate ||
    !!toDate;

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: compact ? 16 : 20,
        display: "flex",
        flexDirection: "column",
        gap: compact ? 14 : 18,
        boxShadow:
          mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.22)"
            : "0 10px 30px rgba(15,23,42,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: 14,
        }}
      >
        {onSearchChange && (
          <div
            style={{
              flex: "1 1 260px",
              minWidth: 220,
            }}
          >
            <FieldLabel text="Search" color={theme.subText} />

            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.mutedText,
                  fontSize: 14,
                  pointerEvents: "none",
                }}
              >
                ⌕
              </span>

              <input
                type="text"
                value={searchValue}
                placeholder={searchPlaceholder}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onSearchChange(event.target.value)
                }
                style={{
                  ...inputBaseStyle,
                  paddingLeft: 38,
                }}
              />
            </div>
          </div>
        )}

        {filters.map((filter) => (
          <div
            key={filter.key}
            style={{
              flex: "1 1 180px",
              minWidth: 160,
            }}
          >
            <FieldLabel text={filter.label} color={theme.subText} />

            <select
              value={filter.value}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                filter.onChange(event.target.value)
              }
              style={selectBaseStyle}
            >
              <option value="">
                {filter.placeholder ?? `All ${filter.label}`}
              </option>

              {filter.options.map((option) => (
                <option key={`${filter.key}-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {onFromDateChange && (
          <div
            style={{
              flex: "1 1 160px",
              minWidth: 150,
            }}
          >
            <FieldLabel text="From Date" color={theme.subText} />

            <input
              type="date"
              value={fromDate}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onFromDateChange(event.target.value)
              }
              style={inputBaseStyle}
            />
          </div>
        )}

        {onToDateChange && (
          <div
            style={{
              flex: "1 1 160px",
              minWidth: 150,
            }}
          >
            <FieldLabel text="To Date" color={theme.subText} />

            <input
              type="date"
              value={toDate}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onToDateChange(event.target.value)
              }
              style={inputBaseStyle}
            />
          </div>
        )}

        {(onClearFilters || actions) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              marginLeft: "auto",
            }}
          >
            {onClearFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                disabled={!hasAnyFilter}
                style={{
                  height: compact ? 40 : 44,
                  padding: "0 16px",
                  borderRadius: 12,
                  border: `1px solid ${theme.border}`,
                  background: theme.cardBgSoft ?? theme.cardBg,
                  color: hasAnyFilter ? theme.text : theme.mutedText,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: hasAnyFilter ? "pointer" : "not-allowed",
                  opacity: hasAnyFilter ? 1 : 0.7,
                }}
              >
                Clear Filters
              </button>
            )}

            {actions}
          </div>
        )}
      </div>

      {(typeof resultCount === "number" || hasAnyFilter) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            paddingTop: 2,
            borderTop: `1px solid ${theme.borderSoft ?? theme.border}`,
          }}
        >
          <div
            style={{
              paddingTop: 12,
              fontSize: 13,
              color: theme.subText,
              fontWeight: 600,
            }}
          >
            {typeof resultCount === "number"
              ? `${resultCount} ${resultLabel}`
              : hasAnyFilter
              ? "Filters applied"
              : ""}
          </div>

          {hasAnyFilter && (
            <div
              style={{
                paddingTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {!!searchValue && (
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    background:
                      mode === "dark"
                        ? "rgba(59,130,246,0.14)"
                        : "rgba(37,99,235,0.10)",
                    color: theme.primary,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Search: {searchValue}
                </span>
              )}

              {filters
                .filter((item) => item.value)
                .map((item) => {
                  const activeOption = item.options.find(
                    (option) => option.value === item.value
                  );

                  return (
                    <span
                      key={`active-${item.key}`}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        background:
                          mode === "dark"
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(15,23,42,0.06)",
                        color: theme.text,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {item.label}: {activeOption?.label ?? item.value}
                    </span>
                  );
                })}

              {!!fromDate && (
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    background:
                      mode === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(15,23,42,0.06)",
                    color: theme.text,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  From: {fromDate}
                </span>
              )}

              {!!toDate && (
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    background:
                      mode === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(15,23,42,0.06)",
                    color: theme.text,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  To: {toDate}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}