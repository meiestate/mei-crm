import React, { useEffect, useMemo, useRef, useState } from "react";

export type ComparePeriodValue =
  | "none"
  | "previous_period"
  | "previous_week"
  | "previous_month"
  | "previous_quarter"
  | "previous_year"
  | "custom";

export interface ComparePeriodOption {
  label: string;
  value: ComparePeriodValue;
  description?: string;
  disabled?: boolean;
}

export interface ComparePeriodToggleProps {
  value?: ComparePeriodValue;
  onChange?: (value: ComparePeriodValue) => void;
  options?: ComparePeriodOption[];
  label?: string;
  helperText?: string;
  disabled?: boolean;
  loading?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  showDescriptions?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const defaultOptions: ComparePeriodOption[] = [
  {
    label: "No Compare",
    value: "none",
    description: "Show only the current selected period.",
  },
  {
    label: "Previous Period",
    value: "previous_period",
    description: "Compare against the immediately preceding range.",
  },
  {
    label: "Previous Week",
    value: "previous_week",
    description: "Useful for short-term weekly trend reading.",
  },
  {
    label: "Previous Month",
    value: "previous_month",
    description: "Best for month-on-month movement tracking.",
  },
  {
    label: "Previous Quarter",
    value: "previous_quarter",
    description: "Ideal for broader sales and pipeline comparisons.",
  },
  {
    label: "Previous Year",
    value: "previous_year",
    description: "Helpful for seasonal and annual benchmark analysis.",
  },
  {
    label: "Custom Period",
    value: "custom",
    description: "Use a custom comparison range from your filter flow.",
  },
];

function SkeletonLine({
  width,
  height = 12,
  radius = 999,
}: {
  width: number | string;
  height?: number;
  radius?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, rgba(226,232,240,0.8) 0%, rgba(241,245,249,1) 50%, rgba(226,232,240,0.8) 100%)",
        backgroundSize: "200% 100%",
        animation: "comparePeriodPulse 1.2s ease-in-out infinite",
      }}
    />
  );
}

export default function ComparePeriodToggle({
  value = "none",
  onChange,
  options = defaultOptions,
  label = "Compare Period",
  helperText = "Layer one more time lens on top of your current analytics window.",
  disabled = false,
  loading = false,
  compact = false,
  fullWidth = true,
  showDescriptions = true,
  className,
  style,
}: ComparePeriodToggleProps) {
  const [internalValue, setInternalValue] = useState<ComparePeriodValue>(value);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const selectedOption = useMemo(() => {
    return (
      options.find((option) => option.value === internalValue) ?? options[0] ?? null
    );
  }, [internalValue, options]);

  const handleSelect = (nextValue: ComparePeriodValue) => {
    if (disabled || loading) return;
    setInternalValue(nextValue);
    onChange?.(nextValue);
    setOpen(false);
  };

  const controlMinHeight = compact ? 44 : 50;
  const labelFontSize = compact ? 13 : 14;
  const helperFontSize = compact ? 11 : 12;

  return (
    <>
      <style>
        {`
          @keyframes comparePeriodPulse {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>

      <div
        ref={wrapperRef}
        className={className}
        style={{
          width: fullWidth ? "100%" : 340,
          minWidth: 0,
          position: "relative",
          ...style,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            {loading ? (
              <>
                <SkeletonLine width="34%" height={14} />
                <div style={{ height: 8 }} />
                <SkeletonLine width="76%" height={11} />
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: labelFontSize,
                    fontWeight: 800,
                    color: "#0F172A",
                    lineHeight: 1.2,
                    letterSpacing: -0.2,
                  }}
                >
                  {label}
                </div>
                {helperText ? (
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: helperFontSize,
                      fontWeight: 500,
                      color: "#64748B",
                      lineHeight: 1.5,
                    }}
                  >
                    {helperText}
                  </div>
                ) : null}
              </>
            )}
          </div>

          {!loading && selectedOption ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 10px",
                borderRadius: 999,
                background: "#EFF6FF",
                color: "#1D4ED8",
                border: "1px solid #BFDBFE",
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                whiteSpace: "nowrap",
              }}
            >
              {selectedOption.label}
            </span>
          ) : null}
        </div>

        {loading ? (
          <div
            style={{
              borderRadius: 16,
              border: "1px solid #E2E8F0",
              background: "#FFFFFF",
              minHeight: controlMinHeight,
              padding: compact ? "10px 12px" : "12px 14px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SkeletonLine width="58%" height={14} />
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                if (disabled) return;
                setOpen((prev) => !prev);
              }}
              disabled={disabled}
              aria-haspopup="listbox"
              aria-expanded={open}
              style={{
                width: "100%",
                minHeight: controlMinHeight,
                borderRadius: 16,
                border: open ? "1px solid #3B82F6" : "1px solid #CBD5E1",
                background: disabled
                  ? "#F8FAFC"
                  : "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
                boxShadow: open
                  ? "0 0 0 4px rgba(59,130,246,0.12)"
                  : "0 6px 18px rgba(15, 23, 42, 0.05)",
                padding: compact ? "10px 12px" : "12px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                cursor: disabled ? "not-allowed" : "pointer",
                transition:
                  "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
              }}
            >
              <div
                style={{
                  minWidth: 0,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: compact ? 13 : 14,
                    fontWeight: 800,
                    color: disabled ? "#94A3B8" : "#0F172A",
                    lineHeight: 1.2,
                    textAlign: "left",
                  }}
                >
                  {selectedOption?.label ?? "Select compare period"}
                </span>

                {showDescriptions && selectedOption?.description ? (
                  <span
                    style={{
                      fontSize: compact ? 11 : 12,
                      fontWeight: 500,
                      color: "#64748B",
                      lineHeight: 1.4,
                      textAlign: "left",
                    }}
                  >
                    {selectedOption.description}
                  </span>
                ) : null}
              </div>

              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: compact ? 28 : 32,
                  height: compact ? 28 : 32,
                  borderRadius: 10,
                  border: "1px solid #E2E8F0",
                  background: "#FFFFFF",
                  display: "grid",
                  placeItems: "center",
                  color: "#475569",
                  fontSize: 14,
                  fontWeight: 900,
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 160ms ease",
                }}
              >
                ▾
              </span>
            </button>

            {open ? (
              <div
                role="listbox"
                aria-label={label}
                style={{
                  position: "absolute",
                  zIndex: 20,
                  top: "calc(100% + 10px)",
                  left: 0,
                  right: 0,
                  borderRadius: 18,
                  border: "1px solid #E2E8F0",
                  background: "#FFFFFF",
                  boxShadow: "0 24px 48px rgba(15, 23, 42, 0.14)",
                  padding: 8,
                  maxHeight: 360,
                  overflowY: "auto",
                }}
              >
                {options.map((option) => {
                  const isSelected = option.value === internalValue;
                  const isDisabled = disabled || option.disabled;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        if (isDisabled) return;
                        handleSelect(option.value);
                      }}
                      disabled={isDisabled}
                      role="option"
                      aria-selected={isSelected}
                      style={{
                        width: "100%",
                        border: "none",
                        background: isSelected
                          ? "linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 100%)"
                          : "transparent",
                        borderRadius: 14,
                        padding: compact ? "10px 12px" : "12px 14px",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        textAlign: "left",
                        opacity: isDisabled ? 0.55 : 1,
                        transition: "background 160ms ease, transform 160ms ease",
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: compact ? 13 : 14,
                            fontWeight: 800,
                            color: isSelected ? "#1D4ED8" : "#0F172A",
                            lineHeight: 1.25,
                          }}
                        >
                          {option.label}
                        </div>

                        {showDescriptions && option.description ? (
                          <div
                            style={{
                              marginTop: 5,
                              fontSize: compact ? 11 : 12,
                              fontWeight: 500,
                              color: isSelected ? "#2563EB" : "#64748B",
                              lineHeight: 1.45,
                            }}
                          >
                            {option.description}
                          </div>
                        ) : null}
                      </div>

                      <div
                        style={{
                          flexShrink: 0,
                          width: 20,
                          height: 20,
                          marginTop: 1,
                          borderRadius: "50%",
                          border: `2px solid ${
                            isSelected ? "#3B82F6" : "#CBD5E1"
                          }`,
                          background: isSelected ? "#3B82F6" : "#FFFFFF",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        {isSelected ? (
                          <span
                            style={{
                              color: "#FFFFFF",
                              fontSize: 11,
                              fontWeight: 900,
                              lineHeight: 1,
                            }}
                          >
                            ✓
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}