import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  icon?: ReactNode;
};

type SelectSize = "sm" | "md" | "lg";

type SelectProps = {
  id?: string;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string, option: SelectOption) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  size?: SelectSize;
  maxMenuHeight?: number;
  containerStyle?: CSSProperties;
  triggerStyle?: CSSProperties;
  menuStyle?: CSSProperties;
};

const sizeMap: Record<
  SelectSize,
  {
    minHeight: number;
    fontSize: number;
    radius: number;
    paddingX: number;
    iconSize: number;
  }
> = {
  sm: {
    minHeight: 38,
    fontSize: 13,
    radius: 12,
    paddingX: 12,
    iconSize: 14,
  },
  md: {
    minHeight: 44,
    fontSize: 14,
    radius: 14,
    paddingX: 14,
    iconSize: 16,
  },
  lg: {
    minHeight: 50,
    fontSize: 15,
    radius: 16,
    paddingX: 16,
    iconSize: 18,
  },
};

export default function Select({
  id,
  label,
  hint,
  error,
  placeholder = "Select an option",
  value,
  options,
  onChange,
  disabled = false,
  fullWidth = true,
  searchable = false,
  clearable = false,
  size = "md",
  maxMenuHeight = 280,
  containerStyle,
  triggerStyle,
  menuStyle,
}: SelectProps) {
  const autoId = useId();
  const inputId = id || autoId;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const sizes = sizeMap[size];
  const hasError = Boolean(error);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return options;

    return options.filter((option) => {
      const text = `${option.label} ${option.description || ""}`.toLowerCase();
      return text.includes(keyword);
    });
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 0);
    }
  }, [open, searchable]);

  useEffect(() => {
    if (!open) return;

    const firstEnabledIndex = filteredOptions.findIndex((item) => !item.disabled);
    setHighlightedIndex(firstEnabledIndex);
  }, [open, filteredOptions]);

  const selectOption = (option: SelectOption) => {
    if (option.disabled) return;
    onChange(option.value, option);
    setOpen(false);
    setSearch("");
    setHighlightedIndex(-1);
  };

  const moveHighlight = (direction: "next" | "prev") => {
    if (!filteredOptions.length) return;

    let nextIndex = highlightedIndex;

    for (let i = 0; i < filteredOptions.length; i += 1) {
      nextIndex =
        direction === "next"
          ? (nextIndex + 1) % filteredOptions.length
          : (nextIndex - 1 + filteredOptions.length) % filteredOptions.length;

      if (!filteredOptions[nextIndex]?.disabled) {
        setHighlightedIndex(nextIndex);
        break;
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (!open) {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setSearch("");
      setHighlightedIndex(-1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveHighlight("next");
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveHighlight("prev");
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const option = filteredOptions[highlightedIndex];
      if (option && !option.disabled) {
        selectOption(option);
      }
    }
  };

  return (
    <div
      style={{
        width: fullWidth ? "100%" : undefined,
        ...containerStyle,
      }}
    >
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: "inline-block",
            marginBottom: 8,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.4,
            color: "#0f172a",
          }}
        >
          {label}
        </label>
      )}

      <div
        ref={wrapperRef}
        onKeyDown={handleKeyDown}
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        <button
          id={inputId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => {
            if (disabled) return;
            setOpen((prev) => !prev);
            if (open) {
              setSearch("");
              setHighlightedIndex(-1);
            }
          }}
          style={{
            width: "100%",
            minHeight: sizes.minHeight,
            borderRadius: sizes.radius,
            border: hasError ? "1.5px solid #ef4444" : "1px solid #cbd5e1",
            background: disabled ? "#f8fafc" : "#ffffff",
            color: selectedOption ? "#0f172a" : "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: `0 ${sizes.paddingX}px`,
            fontSize: sizes.fontSize,
            fontWeight: selectedOption ? 600 : 500,
            cursor: disabled ? "not-allowed" : "pointer",
            boxShadow: open
              ? "0 0 0 4px rgba(37, 99, 235, 0.12)"
              : "0 1px 2px rgba(15, 23, 42, 0.04)",
            transition: "all 0.2s ease",
            ...triggerStyle,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
              flex: 1,
              overflow: "hidden",
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
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("", { label: "", value: "" });
                }}
                style={{
                  fontSize: 16,
                  color: "#94a3b8",
                  lineHeight: 1,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                ×
              </span>
            )}

            <span
              style={{
                fontSize: sizes.iconSize,
                color: "#64748b",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                lineHeight: 1,
              }}
            >
              ▾
            </span>
          </span>
        </button>

        {open && (
          <div
            role="listbox"
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              boxShadow: "0 18px 48px rgba(15, 23, 42, 0.14)",
              overflow: "hidden",
              zIndex: 1000,
              ...menuStyle,
            }}
          >
            {searchable && (
              <div
                style={{
                  padding: 10,
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <input
                  ref={searchRef}
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
                    textAlign: "center",
                    fontSize: 14,
                    color: "#64748b",
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
                      role="option"
                      aria-selected={selected}
                      disabled={option.disabled}
                      onClick={() => selectOption(option)}
                      style={{
                        width: "100%",
                        border: "none",
                        borderRadius: 12,
                        background: selected
                          ? "rgba(37, 99, 235, 0.10)"
                          : highlighted
                          ? "#f8fafc"
                          : "#ffffff",
                        padding: "12px 12px",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        textAlign: "left",
                        cursor: option.disabled ? "not-allowed" : "pointer",
                        opacity: option.disabled ? 0.5 : 1,
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
                            fontWeight: 700,
                            color: "#2563eb",
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
            color: hasError ? "#dc2626" : "#64748b",
          }}
        >
          {error || hint}
        </div>
      )}
    </div>
  );
}