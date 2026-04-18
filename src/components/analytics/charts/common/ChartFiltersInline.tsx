// src/components/analytics/charts/shared/ChartFiltersInline.tsx

import type { CSSProperties, ReactNode } from "react";

export interface ChartFilterOption {
  label: string;
  value: string;
}

export interface ChartFilterConfig {
  key: string;
  label?: string;
  value: string;
  options: ChartFilterOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  width?: number | string;
}

export interface ChartFiltersInlineProps {
  filters: ChartFilterConfig[];
  title?: string;
  action?: ReactNode;
  className?: string;
  style?: CSSProperties;
  compact?: boolean;
}

function resolveWidth(value?: number | string): string | undefined {
  if (typeof value === "number") {
    return `${value}px`;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return undefined;
}

function FilterSelect({
  filter,
  compact,
}: {
  filter: ChartFilterConfig;
  compact: boolean;
}) {
  const selectId = `chart-filter-${filter.key}`;
  const width = resolveWidth(filter.width);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: compact ? "row" : "column",
        alignItems: compact ? "center" : "stretch",
        gap: compact ? 8 : 6,
        minWidth: width ?? (compact ? "auto" : "160px"),
      }}
    >
      {filter.label ? (
        <label
          htmlFor={selectId}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#475569",
            whiteSpace: "nowrap",
          }}
        >
          {filter.label}
        </label>
      ) : null}

      <div style={{ position: "relative", width: width ?? "100%" }}>
        <select
          id={selectId}
          value={filter.value}
          disabled={filter.disabled}
          onChange={(event) => filter.onChange(event.target.value)}
          style={{
            appearance: "none",
            width: "100%",
            minWidth: compact ? 120 : 160,
            border: "1px solid #E2E8F0",
            background: filter.disabled ? "#F8FAFC" : "#FFFFFF",
            color: filter.disabled ? "#94A3B8" : "#0F172A",
            borderRadius: 12,
            padding: compact ? "9px 36px 9px 12px" : "10px 38px 10px 12px",
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.2,
            outline: "none",
            cursor: filter.disabled ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
          }}
        >
          {filter.options.map((option) => (
            <option key={`${filter.key}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 10,
            color: "#64748B",
            pointerEvents: "none",
          }}
        >
          ▼
        </span>
      </div>
    </div>
  );
}

export default function ChartFiltersInline({
  filters,
  title,
  action,
  className,
  style,
  compact = false,
}: ChartFiltersInlineProps) {
  if (!filters.length && !title && !action) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: compact ? "center" : "flex-end",
        gap: 12,
        flexWrap: "wrap",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: "1 1 420px",
          minWidth: 0,
        }}
      >
        {title ? (
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#334155",
            }}
          >
            {title}
          </div>
        ) : null}

        {filters.length ? (
          <div
            style={{
              display: "flex",
              alignItems: compact ? "center" : "flex-end",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {filters.map((filter) => (
              <FilterSelect
                key={filter.key}
                filter={filter}
                compact={compact}
              />
            ))}
          </div>
        ) : null}
      </div>

      {action ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            flex: "0 0 auto",
          }}
        >
          {action}
        </div>
      ) : null}
    </div>
  );
}