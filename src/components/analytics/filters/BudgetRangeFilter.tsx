import { useEffect, useMemo, useState } from "react";

export type BudgetRangeValue = {
  min: string;
  max: string;
};

export type BudgetPresetOption = {
  label: string;
  min: number;
  max: number;
};

type BudgetRangeFilterProps = {
  value?: BudgetRangeValue;
  onChange?: (value: BudgetRangeValue) => void;
  onApply?: (value: BudgetRangeValue) => void;
  onReset?: () => void;
  title?: string;
  subtitle?: string;
  currencySymbol?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  presetOptions?: BudgetPresetOption[];
  disabled?: boolean;
};

const DEFAULT_VALUE: BudgetRangeValue = {
  min: "",
  max: "",
};

const DEFAULT_PRESETS: BudgetPresetOption[] = [
  { label: "Under 25L", min: 0, max: 2500000 },
  { label: "25L - 50L", min: 2500000, max: 5000000 },
  { label: "50L - 1Cr", min: 5000000, max: 10000000 },
  { label: "1Cr - 2Cr", min: 10000000, max: 20000000 },
  { label: "2Cr+", min: 20000000, max: 999999999 },
];

function sanitizeNumericInput(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function formatCompactInr(value: number, currencySymbol: string): string {
  if (value >= 10000000) {
    return `${currencySymbol}${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 1)}Cr`;
  }

  if (value >= 100000) {
    return `${currencySymbol}${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`;
  }

  if (value >= 1000) {
    return `${currencySymbol}${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  }

  return `${currencySymbol}${value}`;
}

function formatFullCurrency(value: number, currencySymbol: string): string {
  return `${currencySymbol}${new Intl.NumberFormat("en-IN").format(value)}`;
}

export default function BudgetRangeFilter({
  value = DEFAULT_VALUE,
  onChange,
  onApply,
  onReset,
  title = "Budget Range",
  subtitle = "Filter records using minimum and maximum budget limits",
  currencySymbol = "₹",
  minPlaceholder = "Enter minimum budget",
  maxPlaceholder = "Enter maximum budget",
  presetOptions = DEFAULT_PRESETS,
  disabled = false,
}: BudgetRangeFilterProps) {
  const [localValue, setLocalValue] = useState<BudgetRangeValue>({
    min: value.min ?? "",
    max: value.max ?? "",
  });

  useEffect(() => {
    setLocalValue({
      min: value.min ?? "",
      max: value.max ?? "",
    });
  }, [value.max, value.min]);

  const minNumber = useMemo(() => {
    return localValue.min ? Number(localValue.min) : 0;
  }, [localValue.min]);

  const maxNumber = useMemo(() => {
    return localValue.max ? Number(localValue.max) : 0;
  }, [localValue.max]);

  const hasError = useMemo(() => {
    if (!localValue.min || !localValue.max) return false;
    return minNumber > maxNumber;
  }, [localValue.max, localValue.min, maxNumber, minNumber]);

  const activePresetLabel = useMemo(() => {
    return (
      presetOptions.find(
        (preset) =>
          String(preset.min) === localValue.min &&
          String(preset.max) === localValue.max
      )?.label ?? null
    );
  }, [localValue.max, localValue.min, presetOptions]);

  const updateValue = (next: BudgetRangeValue) => {
    setLocalValue(next);
    onChange?.(next);
  };

  const handleInputChange = (key: keyof BudgetRangeValue, raw: string) => {
    const cleaned = sanitizeNumericInput(raw);

    updateValue({
      ...localValue,
      [key]: cleaned,
    });
  };

  const handlePresetClick = (preset: BudgetPresetOption) => {
    const nextValue: BudgetRangeValue = {
      min: String(preset.min),
      max: String(preset.max),
    };

    updateValue(nextValue);
  };

  const handleReset = () => {
    updateValue(DEFAULT_VALUE);
    onReset?.();
  };

  const handleApply = () => {
    if (hasError || disabled) return;
    onApply?.(localValue);
  };

  return (
    <section
      style={{
        width: "100%",
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        padding: 20,
        boxSizing: "border-box",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 14,
              color: "#6b7280",
            }}
          >
            {subtitle}
          </p>
        </div>

        {activePresetLabel ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 34,
              padding: "0 12px",
              borderRadius: 999,
              background: "#111827",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {activePresetLabel}
          </span>
        ) : null}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "#6b7280",
              marginBottom: 6,
            }}
          >
            Minimum Budget
          </label>

          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b7280",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {currencySymbol}
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={localValue.min}
              onChange={(e) => handleInputChange("min", e.target.value)}
              placeholder={minPlaceholder}
              disabled={disabled}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#111827",
                padding: "0 12px 0 34px",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: "#6b7280",
              minHeight: 18,
            }}
          >
            {localValue.min
              ? formatFullCurrency(Number(localValue.min), currencySymbol)
              : "No minimum limit"}
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "#6b7280",
              marginBottom: 6,
            }}
          >
            Maximum Budget
          </label>

          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b7280",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {currencySymbol}
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={localValue.max}
              onChange={(e) => handleInputChange("max", e.target.value)}
              placeholder={maxPlaceholder}
              disabled={disabled}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: hasError ? "1px solid #ef4444" : "1px solid #d1d5db",
                background: "#ffffff",
                color: "#111827",
                padding: "0 12px 0 34px",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: hasError ? "#dc2626" : "#6b7280",
              minHeight: 18,
            }}
          >
            {hasError
              ? "Maximum budget must be greater than or equal to minimum budget"
              : localValue.max
              ? formatFullCurrency(Number(localValue.max), currencySymbol)
              : "No maximum limit"}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#6b7280",
            marginBottom: 8,
          }}
        >
          Quick Presets
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {presetOptions.map((preset) => {
            const active = activePresetLabel === preset.label;

            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset)}
                disabled={disabled}
                style={{
                  border: active ? "1px solid #111827" : "1px solid #d1d5db",
                  background: active ? "#111827" : "#ffffff",
                  color: active ? "#ffffff" : "#374151",
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <MetricCard
          label="Selected Minimum"
          value={
            localValue.min
              ? formatCompactInr(Number(localValue.min), currencySymbol)
              : "Not set"
          }
          accent="#2563eb"
          background="#eff6ff"
          border="#dbeafe"
        />

        <MetricCard
          label="Selected Maximum"
          value={
            localValue.max
              ? formatCompactInr(Number(localValue.max), currencySymbol)
              : "Not set"
          }
          accent="#16a34a"
          background="#f0fdf4"
          border="#dcfce7"
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={handleReset}
          disabled={disabled}
          style={{
            height: 44,
            borderRadius: 12,
            border: "1px solid #d1d5db",
            background: "#ffffff",
            color: "#374151",
            padding: "0 16px",
            fontSize: 14,
            fontWeight: 700,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleApply}
          disabled={disabled || hasError}
          style={{
            height: 44,
            borderRadius: 12,
            border: "1px solid #111827",
            background: disabled || hasError ? "#9ca3af" : "#111827",
            color: "#ffffff",
            padding: "0 18px",
            fontSize: 14,
            fontWeight: 700,
            cursor: disabled || hasError ? "not-allowed" : "pointer",
          }}
        >
          Apply Budget Filter
        </button>
      </div>
    </section>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  accent: string;
  background: string;
  border: string;
};

function MetricCard({
  label,
  value,
  accent,
  background,
  border,
}: MetricCardProps) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 14,
        background,
        border: `1px solid ${border}`,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: accent,
          marginBottom: 6,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: accent,
          lineHeight: 1.15,
        }}
      >
        {value}
      </div>
    </div>
  );
}