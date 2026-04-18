import { useEffect, useMemo, useState } from "react";

export type DateRangeValue = {
  preset: string;
  startDate: string;
  endDate: string;
};

export type DatePresetOption = {
  label: string;
  value: string;
};

type DateRangeFilterProps = {
  value?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  onApply?: (value: DateRangeValue) => void;
  onReset?: () => void;
  title?: string;
  subtitle?: string;
  presetOptions?: DatePresetOption[];
  disabled?: boolean;
};

const DEFAULT_VALUE: DateRangeValue = {
  preset: "last_30_days",
  startDate: "",
  endDate: "",
};

const DEFAULT_PRESETS: DatePresetOption[] = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "This Quarter", value: "this_quarter" },
  { label: "Custom", value: "custom" },
];

function formatDisplayDate(value: string): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getTodayLocalDate(): string {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function getPresetRange(preset: string): Pick<DateRangeValue, "startDate" | "endDate"> {
  const today = new Date();
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const format = (date: Date) => {
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
  };

  const end = new Date(localToday);
  const start = new Date(localToday);

  switch (preset) {
    case "today":
      return {
        startDate: format(localToday),
        endDate: format(localToday),
      };

    case "yesterday": {
      start.setDate(start.getDate() - 1);
      return {
        startDate: format(start),
        endDate: format(start),
      };
    }

    case "last_7_days":
      start.setDate(start.getDate() - 6);
      return {
        startDate: format(start),
        endDate: format(end),
      };

    case "last_30_days":
      start.setDate(start.getDate() - 29);
      return {
        startDate: format(start),
        endDate: format(end),
      };

    case "this_month": {
      const monthStart = new Date(localToday.getFullYear(), localToday.getMonth(), 1);
      return {
        startDate: format(monthStart),
        endDate: format(end),
      };
    }

    case "last_month": {
      const lastMonthStart = new Date(localToday.getFullYear(), localToday.getMonth() - 1, 1);
      const lastMonthEnd = new Date(localToday.getFullYear(), localToday.getMonth(), 0);

      return {
        startDate: format(lastMonthStart),
        endDate: format(lastMonthEnd),
      };
    }

    case "this_quarter": {
      const quarterStartMonth = Math.floor(localToday.getMonth() / 3) * 3;
      const quarterStart = new Date(localToday.getFullYear(), quarterStartMonth, 1);

      return {
        startDate: format(quarterStart),
        endDate: format(end),
      };
    }

    default:
      return {
        startDate: "",
        endDate: "",
      };
  }
}

export default function DateRangeFilter({
  value = DEFAULT_VALUE,
  onChange,
  onApply,
  onReset,
  title = "Date Range",
  subtitle = "Filter records using quick date presets or custom start and end dates",
  presetOptions = DEFAULT_PRESETS,
  disabled = false,
}: DateRangeFilterProps) {
  const [localValue, setLocalValue] = useState<DateRangeValue>({
    preset: value.preset ?? DEFAULT_VALUE.preset,
    startDate: value.startDate ?? DEFAULT_VALUE.startDate,
    endDate: value.endDate ?? DEFAULT_VALUE.endDate,
  });

  useEffect(() => {
    setLocalValue({
      preset: value.preset ?? DEFAULT_VALUE.preset,
      startDate: value.startDate ?? DEFAULT_VALUE.startDate,
      endDate: value.endDate ?? DEFAULT_VALUE.endDate,
    });
  }, [value.endDate, value.preset, value.startDate]);

  const hasError = useMemo(() => {
    if (!localValue.startDate || !localValue.endDate) return false;
    return localValue.startDate > localValue.endDate;
  }, [localValue.endDate, localValue.startDate]);

  const activePresetLabel = useMemo(() => {
    return (
      presetOptions.find((preset) => preset.value === localValue.preset)?.label ?? null
    );
  }, [localValue.preset, presetOptions]);

  const rangeDays = useMemo(() => {
    if (!localValue.startDate || !localValue.endDate || hasError) return 0;

    const start = new Date(localValue.startDate);
    const end = new Date(localValue.endDate);
    const diff = end.getTime() - start.getTime();

    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }, [hasError, localValue.endDate, localValue.startDate]);

  const updateValue = (next: DateRangeValue) => {
    setLocalValue(next);
    onChange?.(next);
  };

  const handlePresetChange = (preset: string) => {
    const presetRange = getPresetRange(preset);

    updateValue({
      preset,
      startDate: preset === "custom" ? localValue.startDate : presetRange.startDate,
      endDate: preset === "custom" ? localValue.endDate : presetRange.endDate,
    });
  };

  const handleDateChange = (key: "startDate" | "endDate", nextValue: string) => {
    updateValue({
      ...localValue,
      preset: "custom",
      [key]: nextValue,
    });
  };

  const handleReset = () => {
    const resetRange = getPresetRange(DEFAULT_VALUE.preset);

    const next = {
      preset: DEFAULT_VALUE.preset,
      startDate: resetRange.startDate,
      endDate: resetRange.endDate,
    };

    updateValue(next);
    onReset?.();
  };

  const handleApply = () => {
    if (hasError || disabled) return;
    onApply?.(localValue);
  };

  const maxDate = getTodayLocalDate();

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
            const active = localValue.preset === preset.value;

            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => handlePresetChange(preset.value)}
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
            Start Date
          </label>

          <input
            type="date"
            value={localValue.startDate}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
            max={maxDate}
            disabled={disabled}
            style={{
              width: "100%",
              height: 44,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#111827",
              padding: "0 12px",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: "#6b7280",
              minHeight: 18,
            }}
          >
            {localValue.startDate
              ? formatDisplayDate(localValue.startDate)
              : "Start date not selected"}
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
            End Date
          </label>

          <input
            type="date"
            value={localValue.endDate}
            onChange={(e) => handleDateChange("endDate", e.target.value)}
            max={maxDate}
            disabled={disabled}
            style={{
              width: "100%",
              height: 44,
              borderRadius: 12,
              border: hasError ? "1px solid #ef4444" : "1px solid #d1d5db",
              background: "#ffffff",
              color: "#111827",
              padding: "0 12px",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: hasError ? "#dc2626" : "#6b7280",
              minHeight: 18,
            }}
          >
            {hasError
              ? "End date must be the same as or later than start date"
              : localValue.endDate
              ? formatDisplayDate(localValue.endDate)
              : "End date not selected"}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <MetricCard
          label="Selected Preset"
          value={activePresetLabel ?? "Custom"}
          accent="#2563eb"
          background="#eff6ff"
          border="#dbeafe"
        />

        <MetricCard
          label="Range Duration"
          value={rangeDays > 0 ? `${rangeDays} day${rangeDays > 1 ? "s" : ""}` : "-"}
          accent="#16a34a"
          background="#f0fdf4"
          border="#dcfce7"
        />

        <MetricCard
          label="Date Summary"
          value={
            localValue.startDate && localValue.endDate
              ? `${formatDisplayDate(localValue.startDate)} → ${formatDisplayDate(
                  localValue.endDate
                )}`
              : "Incomplete"
          }
          accent="#9333ea"
          background="#faf5ff"
          border="#e9d5ff"
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
          Apply Date Filter
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
          fontSize: 18,
          fontWeight: 700,
          color: accent,
          lineHeight: 1.25,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}