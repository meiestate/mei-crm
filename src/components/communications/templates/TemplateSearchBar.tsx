import { memo, useMemo } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

export interface TemplateSearchBarFilter {
  id: string;
  label: string;
  count?: number;
}

export interface TemplateSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  filters?: TemplateSearchBarFilter[];
  activeFilterId?: string | null;
  onFilterChange?: (filterId: string) => void;
  resultCount?: number;
  totalCount?: number;
  showFilterChips?: boolean;
  showResultMeta?: boolean;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
  searchLabel?: string;
  helperText?: string;
  onClear?: () => void;
}

const styles: Record<string, CSSProperties> = {
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  compactRoot: {
    gap: "10px",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  labelWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
    flex: 1,
  },
  label: {
    margin: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.01em",
  },
  helperText: {
    margin: 0,
    fontSize: "12.5px",
    lineHeight: 1.7,
    color: "#64748b",
  },
  resultMeta: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  searchShell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minHeight: "48px",
    padding: "0 14px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    background: "#ffffff",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
    transition: "all 180ms ease",
  },
  compactSearchShell: {
    minHeight: "44px",
    borderRadius: "14px",
  },
  disabledShell: {
    opacity: 0.6,
    cursor: "not-allowed",
    background: "#f8fafc",
  },
  inputWrap: {
    minWidth: 0,
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#0f172a",
    fontSize: "13.5px",
    fontWeight: 500,
  },
  iconButton: {
    width: "34px",
    height: "34px",
    minWidth: "34px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#475569",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  filterChip: {
    minHeight: "32px",
    padding: "6px 12px",
    borderRadius: "999px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#334155",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 160ms ease",
  },
  activeFilterChip: {
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
  },
  filterCount: {
    minWidth: "20px",
    height: "20px",
    padding: "0 6px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 800,
    background: "#f8fafc",
    color: "#475569",
    border: "1px solid #e2e8f0",
  },
  activeFilterCount: {
    background: "#dbeafe",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
  },
};

function TemplateSearchBarComponent({
  value,
  onChange,
  placeholder = "Search templates by title, keyword, tag, or category...",
  filters = [],
  activeFilterId = null,
  onFilterChange,
  resultCount,
  totalCount,
  showFilterChips = true,
  showResultMeta = true,
  disabled = false,
  compact = false,
  className,
  searchLabel = "Template Search",
  helperText = "Find the right message fast with keyword search and quick filters.",
  onClear,
}: TemplateSearchBarProps) {
  const hasValue = value.trim().length > 0;

  const resolvedResultLabel = useMemo(() => {
    if (typeof resultCount !== "number" && typeof totalCount !== "number") {
      return null;
    }

    if (typeof resultCount === "number" && typeof totalCount === "number") {
      return `${resultCount} of ${totalCount} templates`;
    }

    if (typeof resultCount === "number") {
      return `${resultCount} templates`;
    }

    return `${totalCount} templates`;
  }, [resultCount, totalCount]);

  const handleClear = () => {
    if (disabled) return;
    onChange("");
    onClear?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && hasValue) {
      handleClear();
    }
  };

  return (
    <div
      className={className}
      style={{
        ...styles.root,
        ...(compact ? styles.compactRoot : null),
      }}
    >
      <div style={styles.topRow}>
        <div style={styles.labelWrap}>
          <p style={styles.label}>
            <Sparkles size={14} />
            {searchLabel}
          </p>
          <p style={styles.helperText}>{helperText}</p>
        </div>

        {showResultMeta && resolvedResultLabel ? (
          <div style={styles.resultMeta}>
            <Tag size={13} />
            {resolvedResultLabel}
          </div>
        ) : null}
      </div>

      <div
        style={{
          ...styles.searchShell,
          ...(compact ? styles.compactSearchShell : null),
          ...(disabled ? styles.disabledShell : null),
        }}
      >
        <div style={styles.inputWrap}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            style={styles.input}
          />
        </div>

        {hasValue ? (
          <button
            type="button"
            onClick={handleClear}
            style={styles.iconButton}
            disabled={disabled}
            aria-label="Clear template search"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>

      {showFilterChips && filters.length > 0 ? (
        <div style={styles.filterRow}>
          {filters.map((filter) => {
            const isActive = filter.id === activeFilterId;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => {
                  if (!disabled) {
                    onFilterChange?.(filter.id);
                  }
                }}
                style={{
                  ...styles.filterChip,
                  ...(isActive ? styles.activeFilterChip : null),
                }}
                disabled={disabled}
              >
                <SlidersHorizontal size={13} />
                {filter.label}

                {typeof filter.count === "number" ? (
                  <span
                    style={{
                      ...styles.filterCount,
                      ...(isActive ? styles.activeFilterCount : null),
                    }}
                  >
                    {filter.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

const TemplateSearchBar = memo(TemplateSearchBarComponent);

export default TemplateSearchBar;