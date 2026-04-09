import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

export type DropdownOption = {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
};

type DropdownProps = {
  value?: string;
  options: DropdownOption[];
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  maxMenuHeight?: number;
  onChange: (value: string | undefined, option?: DropdownOption) => void;
};

export default function Dropdown({
  value,
  options,
  placeholder = "Select an option",
  label,
  hint,
  error,
  disabled = false,
  searchable = false,
  clearable = false,
  fullWidth = true,
  maxMenuHeight = 280,
  onChange,
}: DropdownProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return options;

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(keyword) ||
        option.description?.toLowerCase().includes(keyword)
    );
  }, [options, search]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [open, searchable]);

  useEffect(() => {
    const firstEnabledIndex = filteredOptions.findIndex((option) => !option.disabled);
    setHighlightedIndex(firstEnabledIndex >= 0 ? firstEnabledIndex : 0);
  }, [search, filteredOptions]);

  const handleToggle = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
    if (open) setSearch("");
  };

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    onChange(option.value, option);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onChange(undefined);
    setOpen(false);
    setSearch("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (!open && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault();
      setOpen(true);
      return;
    }

    if (!open) return;

    if (event.key === "Escape") {
      setOpen(false);
      setSearch("");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      let next = highlightedIndex;

      do {
        next = (next + 1) % filteredOptions.length;
      } while (filteredOptions[next]?.disabled && next !== highlightedIndex);

      setHighlightedIndex(next);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      let next = highlightedIndex;

      do {
        next = (next - 1 + filteredOptions.length) % filteredOptions.length;
      } while (filteredOptions[next]?.disabled && next !== highlightedIndex);

      setHighlightedIndex(next);
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const option = filteredOptions[highlightedIndex];
      if (option && !option.disabled) {
        handleSelect(option);
      }
    }
  };

  return (
    <div
      style={{
        width: fullWidth ? "100%" : 280,
      }}
    >
      {label && (
        <div
          style={{
            marginBottom: 8,
            fontSize: 14,
            fontWeight: 600,
            color: "#0f172a",
          }}
        >
          {label}
        </div>
      )}

      <div
        ref={wrapperRef}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        style={{
          position: "relative",
          outline: "none",
        }}
      >
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          style={{
            width: "100%",
            minHeight: 46,
            padding: "0 14px",
            borderRadius: 14,
            border: error ? "1.5px solid #ef4444" : "1px solid #cbd5e1",
            background: disabled ? "#f8fafc" : "#ffffff",
            color: selectedOption ? "#0f172a" : "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            cursor: disabled ? "not-allowed" : "pointer",
            boxShadow: open
              ? "0 0 0 4px rgba(37, 99, 235, 0.12)"
              : "0 1px 2px rgba(15, 23, 42, 0.04)",
            transition: "all 0.2s ease",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
              flex: 1,
              textAlign: "left",
            }}
          >
            {selectedOption?.icon && (
              <span style={{ display: "inline-flex", flexShrink: 0 }}>
                {selectedOption.icon}
              </span>
            )}

            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 14,
                fontWeight: selectedOption ? 600 : 500,
              }}
            >
              {selectedOption?.label || placeholder}
            </span>
          </span>

          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {clearable && selectedOption && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear selection"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: 16,
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            )}

            <span
              style={{
                fontSize: 12,
                color: "#64748b",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              ▼
            </span>
          </span>
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              width: "100%",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              boxShadow: "0 18px 48px rgba(15, 23, 42, 0.14)",
              overflow: "hidden",
              zIndex: 1000,
            }}
          >
            {searchable && (
              <div
                style={{
                  padding: 12,
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <input
                  ref={searchInputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  style={{
                    width: "100%",
                    height: 40,
                    borderRadius: 12,
                    border: "1px solid #cbd5e1",
                    padding: "0 12px",
                    fontSize: 14,
                    outline: "none",
                    background: "#ffffff",
                    color: "#0f172a",
                  }}
                />
              </div>
            )}

            <div
              style={{
                maxHeight: maxMenuHeight,
                overflowY: "auto",
                padding: 8,
              }}
            >
              {filteredOptions.length === 0 ? (
                <div
                  style={{
                    padding: "14px 12px",
                    fontSize: 14,
                    color: "#64748b",
                    textAlign: "center",
                  }}
                >
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const selected = option.value === value;
                  const highlighted = index === highlightedIndex;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      disabled={option.disabled}
                      style={{
                        width: "100%",
                        border: "none",
                        background: selected
                          ? "rgba(37, 99, 235, 0.10)"
                          : highlighted
                          ? "#f8fafc"
                          : "#ffffff",
                        borderRadius: 12,
                        padding: "12px 12px",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        cursor: option.disabled ? "not-allowed" : "pointer",
                        opacity: option.disabled ? 0.5 : 1,
                        textAlign: "left",
                        transition: "all 0.18s ease",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        {option.icon && (
                          <span
                            style={{
                              display: "inline-flex",
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            {option.icon}
                          </span>
                        )}

                        <span style={{ minWidth: 0 }}>
                          <span
                            style={{
                              display: "block",
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#0f172a",
                              lineHeight: 1.4,
                            }}
                          >
                            {option.label}
                          </span>

                          {option.description && (
                            <span
                              style={{
                                display: "block",
                                marginTop: 2,
                                fontSize: 12,
                                color: "#64748b",
                                lineHeight: 1.5,
                              }}
                            >
                              {option.description}
                            </span>
                          )}
                        </span>
                      </span>

                      {selected && (
                        <span
                          style={{
                            flexShrink: 0,
                            fontSize: 13,
                            color: "#2563eb",
                            fontWeight: 700,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {(hint || error) && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            lineHeight: 1.5,
            color: error ? "#dc2626" : "#64748b",
          }}
        >
          {error || hint}
        </div>
      )}
    </div>
  );
}