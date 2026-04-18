import { useEffect, useMemo, useState } from "react";

export type StatusFilterOption = {
  label: string;
  value: string;
};

export type StatusFilterValue = {
  search: string;
  stage: string;
  priority: string;
  outcome: string;
  selectedStatuses: string[];
};

type StatusFilterProps = {
  value?: StatusFilterValue;
  onChange?: (value: StatusFilterValue) => void;
  onApply?: (value: StatusFilterValue) => void;
  onReset?: () => void;
  title?: string;
  subtitle?: string;
  stageOptions?: StatusFilterOption[];
  priorityOptions?: StatusFilterOption[];
  outcomeOptions?: StatusFilterOption[];
  statusOptions?: StatusFilterOption[];
  featuredStatuses?: StatusFilterOption[];
  disabled?: boolean;
};

const DEFAULT_VALUE: StatusFilterValue = {
  search: "",
  stage: "all",
  priority: "all",
  outcome: "all",
  selectedStatuses: [],
};

const DEFAULT_STAGE_OPTIONS: StatusFilterOption[] = [
  { label: "All Stages", value: "all" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Follow-up", value: "follow_up" },
  { label: "Site Visit", value: "site_visit" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
];

const DEFAULT_PRIORITY_OPTIONS: StatusFilterOption[] = [
  { label: "All Priorities", value: "all" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
  { label: "Critical", value: "critical" },
];

const DEFAULT_OUTCOME_OPTIONS: StatusFilterOption[] = [
  { label: "All Outcomes", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Closed Won", value: "closed_won" },
  { label: "Closed Lost", value: "closed_lost" },
  { label: "On Hold", value: "on_hold" },
];

const DEFAULT_STATUS_OPTIONS: StatusFilterOption[] = [
  { label: "New Lead", value: "new_lead" },
  { label: "Contacted", value: "contacted" },
  { label: "Interested", value: "interested" },
  { label: "Follow-up Pending", value: "follow_up_pending" },
  { label: "Site Visit Scheduled", value: "site_visit_scheduled" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Document Pending", value: "document_pending" },
  { label: "Booked", value: "booked" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
  { label: "On Hold", value: "on_hold" },
  { label: "Cold Lead", value: "cold_lead" },
];

const DEFAULT_FEATURED_STATUSES: StatusFilterOption[] = [
  { label: "New Lead", value: "new_lead" },
  { label: "Follow-up Pending", value: "follow_up_pending" },
  { label: "Site Visit Scheduled", value: "site_visit_scheduled" },
  { label: "Won", value: "won" },
];

function toggleArrayValue(values: string[], value: string): string[] {
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }

  return [...values, value];
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 700,
        color: "#6b7280",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

type SelectFieldProps = {
  value: string;
  options: StatusFilterOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

function SelectField({
  value,
  options,
  onChange,
  disabled = false,
}: SelectFieldProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
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
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default function StatusFilter({
  value = DEFAULT_VALUE,
  onChange,
  onApply,
  onReset,
  title = "Status Filter",
  subtitle = "Refine records using stage, priority, outcome and status selection",
  stageOptions = DEFAULT_STAGE_OPTIONS,
  priorityOptions = DEFAULT_PRIORITY_OPTIONS,
  outcomeOptions = DEFAULT_OUTCOME_OPTIONS,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  featuredStatuses = DEFAULT_FEATURED_STATUSES,
  disabled = false,
}: StatusFilterProps) {
  const [localValue, setLocalValue] = useState<StatusFilterValue>({
    search: value.search ?? "",
    stage: value.stage ?? "all",
    priority: value.priority ?? "all",
    outcome: value.outcome ?? "all",
    selectedStatuses: value.selectedStatuses ?? [],
  });

  useEffect(() => {
    setLocalValue({
      search: value.search ?? "",
      stage: value.stage ?? "all",
      priority: value.priority ?? "all",
      outcome: value.outcome ?? "all",
      selectedStatuses: value.selectedStatuses ?? [],
    });
  }, [
    value.outcome,
    value.priority,
    value.search,
    value.selectedStatuses,
    value.stage,
  ]);

  const filteredStatusOptions = useMemo(() => {
    const keyword = localValue.search.trim().toLowerCase();

    if (!keyword) return statusOptions;

    return statusOptions.filter((status) => {
      const normalizedKeyword = keyword.replace(/\s+/g, "_");
      return (
        status.label.toLowerCase().includes(keyword) ||
        status.value.toLowerCase().includes(normalizedKeyword)
      );
    });
  }, [localValue.search, statusOptions]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (localValue.search.trim()) count += 1;
    if (localValue.stage !== "all") count += 1;
    if (localValue.priority !== "all") count += 1;
    if (localValue.outcome !== "all") count += 1;
    if (localValue.selectedStatuses.length > 0) count += 1;

    return count;
  }, [localValue]);

  const updateValue = (next: StatusFilterValue) => {
    setLocalValue(next);
    onChange?.(next);
  };

  const handleReset = () => {
    updateValue(DEFAULT_VALUE);
    onReset?.();
  };

  const handleApply = () => {
    if (disabled) return;
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

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 34,
            padding: "0 12px",
            borderRadius: 999,
            background: activeFilterCount > 0 ? "#111827" : "#f3f4f6",
            color: activeFilterCount > 0 ? "#ffffff" : "#6b7280",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {activeFilterCount} active
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(220px, 1.4fr) repeat(3, minmax(170px, 1fr))",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div>
          <FilterLabel>Search Status</FilterLabel>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
                fontSize: 14,
              }}
            >
              🔍
            </span>

            <input
              type="text"
              value={localValue.search}
              onChange={(e) =>
                updateValue({
                  ...localValue,
                  search: e.target.value,
                })
              }
              placeholder="Search by status or stage"
              disabled={disabled}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#111827",
                padding: "0 12px 0 38px",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div>
          <FilterLabel>Stage</FilterLabel>
          <SelectField
            value={localValue.stage}
            options={stageOptions}
            onChange={(nextStage) =>
              updateValue({
                ...localValue,
                stage: nextStage,
              })
            }
            disabled={disabled}
          />
        </div>

        <div>
          <FilterLabel>Priority</FilterLabel>
          <SelectField
            value={localValue.priority}
            options={priorityOptions}
            onChange={(nextPriority) =>
              updateValue({
                ...localValue,
                priority: nextPriority,
              })
            }
            disabled={disabled}
          />
        </div>

        <div>
          <FilterLabel>Outcome</FilterLabel>
          <SelectField
            value={localValue.outcome}
            options={outcomeOptions}
            onChange={(nextOutcome) =>
              updateValue({
                ...localValue,
                outcome: nextOutcome,
              })
            }
            disabled={disabled}
          />
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
          Featured Statuses
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {featuredStatuses.map((status) => {
            const active = localValue.selectedStatuses.includes(status.value);

            return (
              <button
                key={status.value}
                type="button"
                onClick={() =>
                  updateValue({
                    ...localValue,
                    selectedStatuses: toggleArrayValue(
                      localValue.selectedStatuses,
                      status.value
                    ),
                  })
                }
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
                {status.label}
              </button>
            );
          })}
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
          Select Statuses
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            minHeight: 44,
          }}
        >
          {filteredStatusOptions.length > 0 ? (
            filteredStatusOptions.map((status) => {
              const active = localValue.selectedStatuses.includes(status.value);

              return (
                <button
                  key={status.value}
                  type="button"
                  onClick={() =>
                    updateValue({
                      ...localValue,
                      selectedStatuses: toggleArrayValue(
                        localValue.selectedStatuses,
                        status.value
                      ),
                    })
                  }
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
                  {status.label}
                </button>
              );
            })
          ) : (
            <div
              style={{
                fontSize: 13,
                color: "#6b7280",
                padding: "8px 0",
              }}
            >
              No matching statuses found.
            </div>
          )}
        </div>
      </div>

      {localValue.selectedStatuses.length > 0 ? (
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#6b7280",
              marginBottom: 8,
            }}
          >
            Selected Statuses
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {localValue.selectedStatuses.map((statusValue) => {
              const status = statusOptions.find((item) => item.value === statusValue);

              return (
                <div
                  key={statusValue}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    minHeight: 34,
                    borderRadius: 999,
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    padding: "0 12px",
                    color: "#374151",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <span>{status?.label ?? statusValue}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateValue({
                        ...localValue,
                        selectedStatuses: localValue.selectedStatuses.filter(
                          (item) => item !== statusValue
                        ),
                      })
                    }
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#6b7280",
                      cursor: "pointer",
                      fontSize: 14,
                      lineHeight: 1,
                      padding: 0,
                    }}
                    aria-label={`Remove ${status?.label ?? statusValue}`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <MetricCard
          label="Selected Stage"
          value={
            stageOptions.find((item) => item.value === localValue.stage)?.label ??
            "All Stages"
          }
          accent="#2563eb"
          background="#eff6ff"
          border="#dbeafe"
        />

        <MetricCard
          label="Selected Priority"
          value={
            priorityOptions.find((item) => item.value === localValue.priority)?.label ??
            "All Priorities"
          }
          accent="#16a34a"
          background="#f0fdf4"
          border="#dcfce7"
        />

        <MetricCard
          label="Status Count"
          value={`${localValue.selectedStatuses.length}`}
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
          disabled={disabled}
          style={{
            height: 44,
            borderRadius: 12,
            border: "1px solid #111827",
            background: "#111827",
            color: "#ffffff",
            padding: "0 18px",
            fontSize: 14,
            fontWeight: 700,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          Apply Status Filter
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