import { useMemo } from "react";

export type AgentFilterOption = {
  label: string;
  value: string;
};

export type AgentFilterValue = {
  search: string;
  status: string;
  team: string;
  role: string;
  sortBy: string;
};

type AgentFilterProps = {
  value: AgentFilterValue;
  onChange: (next: AgentFilterValue) => void;
  onReset?: () => void;
  searchPlaceholder?: string;
  statusOptions?: AgentFilterOption[];
  teamOptions?: AgentFilterOption[];
  roleOptions?: AgentFilterOption[];
  sortOptions?: AgentFilterOption[];
  title?: string;
  subtitle?: string;
};

const DEFAULT_STATUS_OPTIONS: AgentFilterOption[] = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "On Leave", value: "on_leave" },
];

const DEFAULT_TEAM_OPTIONS: AgentFilterOption[] = [
  { label: "All Teams", value: "all" },
  { label: "Sales Team A", value: "sales_a" },
  { label: "Sales Team B", value: "sales_b" },
  { label: "Inside Sales", value: "inside_sales" },
  { label: "Field Team", value: "field_team" },
];

const DEFAULT_ROLE_OPTIONS: AgentFilterOption[] = [
  { label: "All Roles", value: "all" },
  { label: "Sales Agent", value: "sales_agent" },
  { label: "Senior Agent", value: "senior_agent" },
  { label: "Team Leader", value: "team_lead" },
  { label: "Manager", value: "manager" },
];

const DEFAULT_SORT_OPTIONS: AgentFilterOption[] = [
  { label: "Sort by Name", value: "name" },
  { label: "Sort by Revenue", value: "revenue" },
  { label: "Sort by Closures", value: "closures" },
  { label: "Sort by Conversion Rate", value: "conversion_rate" },
  { label: "Sort by Last Active", value: "last_active" },
];

const DEFAULT_VALUE: AgentFilterValue = {
  search: "",
  status: "all",
  team: "all",
  role: "all",
  sortBy: "name",
};

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 700,
        color: "#6b7280",
        marginBottom: 6,
        letterSpacing: 0.2,
      }}
    >
      {children}
    </label>
  );
}

type SelectFieldProps = {
  value: string;
  options: AgentFilterOption[];
  onChange: (value: string) => void;
};

function SelectField({ value, options, onChange }: SelectFieldProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={{
        width: "100%",
        height: 42,
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

export default function AgentFilter({
  value,
  onChange,
  onReset,
  searchPlaceholder = "Search agents by name, email, phone or ID",
  statusOptions = DEFAULT_STATUS_OPTIONS,
  teamOptions = DEFAULT_TEAM_OPTIONS,
  roleOptions = DEFAULT_ROLE_OPTIONS,
  sortOptions = DEFAULT_SORT_OPTIONS,
  title = "Agent Filters",
  subtitle = "Refine agent list using quick filters and sorting controls",
}: AgentFilterProps) {
  const safeValue = useMemo<AgentFilterValue>(() => {
    return {
      search: value?.search ?? DEFAULT_VALUE.search,
      status: value?.status ?? DEFAULT_VALUE.status,
      team: value?.team ?? DEFAULT_VALUE.team,
      role: value?.role ?? DEFAULT_VALUE.role,
      sortBy: value?.sortBy ?? DEFAULT_VALUE.sortBy,
    };
  }, [value]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (safeValue.search.trim()) count += 1;
    if (safeValue.status !== "all") count += 1;
    if (safeValue.team !== "all") count += 1;
    if (safeValue.role !== "all") count += 1;
    if (safeValue.sortBy !== "name") count += 1;

    return count;
  }, [safeValue]);

  const updateField = <K extends keyof AgentFilterValue>(
    key: K,
    nextValue: AgentFilterValue[K]
  ) => {
    onChange({
      ...safeValue,
      [key]: nextValue,
    });
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
      return;
    }

    onChange(DEFAULT_VALUE);
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 34,
              height: 34,
              padding: "0 12px",
              borderRadius: 999,
              background: activeFilterCount > 0 ? "#111827" : "#f3f4f6",
              color: activeFilterCount > 0 ? "#ffffff" : "#6b7280",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {activeFilterCount} active
          </span>

          <button
            type="button"
            onClick={handleReset}
            style={{
              height: 38,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              padding: "0 14px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(240px, 2fr) repeat(4, minmax(160px, 1fr))",
          gap: 14,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <FilterLabel>Search</FilterLabel>
          <div
            style={{
              position: "relative",
            }}
          >
            <input
              type="text"
              value={safeValue.search}
              onChange={(event) => updateField("search", event.target.value)}
              placeholder={searchPlaceholder}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#111827",
                padding: "0 14px 0 42px",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 15,
                color: "#9ca3af",
                pointerEvents: "none",
              }}
            >
              🔍
            </span>
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          <FilterLabel>Status</FilterLabel>
          <SelectField
            value={safeValue.status}
            options={statusOptions}
            onChange={(next) => updateField("status", next)}
          />
        </div>

        <div style={{ minWidth: 0 }}>
          <FilterLabel>Team</FilterLabel>
          <SelectField
            value={safeValue.team}
            options={teamOptions}
            onChange={(next) => updateField("team", next)}
          />
        </div>

        <div style={{ minWidth: 0 }}>
          <FilterLabel>Role</FilterLabel>
          <SelectField
            value={safeValue.role}
            options={roleOptions}
            onChange={(next) => updateField("role", next)}
          />
        </div>

        <div style={{ minWidth: 0 }}>
          <FilterLabel>Sort By</FilterLabel>
          <SelectField
            value={safeValue.sortBy}
            options={sortOptions}
            onChange={(next) => updateField("sortBy", next)}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {safeValue.search.trim() ? (
          <TagChip
            label={`Search: ${safeValue.search}`}
            onRemove={() => updateField("search", "")}
          />
        ) : null}

        {safeValue.status !== "all" ? (
          <TagChip
            label={`Status: ${
              statusOptions.find((item) => item.value === safeValue.status)?.label ??
              safeValue.status
            }`}
            onRemove={() => updateField("status", "all")}
          />
        ) : null}

        {safeValue.team !== "all" ? (
          <TagChip
            label={`Team: ${
              teamOptions.find((item) => item.value === safeValue.team)?.label ??
              safeValue.team
            }`}
            onRemove={() => updateField("team", "all")}
          />
        ) : null}

        {safeValue.role !== "all" ? (
          <TagChip
            label={`Role: ${
              roleOptions.find((item) => item.value === safeValue.role)?.label ??
              safeValue.role
            }`}
            onRemove={() => updateField("role", "all")}
          />
        ) : null}

        {safeValue.sortBy !== "name" ? (
          <TagChip
            label={`Sort: ${
              sortOptions.find((item) => item.value === safeValue.sortBy)?.label ??
              safeValue.sortBy
            }`}
            onRemove={() => updateField("sortBy", "name")}
          />
        ) : null}
      </div>
    </section>
  );
}

type TagChipProps = {
  label: string;
  onRemove: () => void;
};

function TagChip({ label, onRemove }: TagChipProps) {
  return (
    <div
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
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        style={{
          border: "none",
          background: "transparent",
          color: "#6b7280",
          cursor: "pointer",
          fontSize: 14,
          lineHeight: 1,
          padding: 0,
        }}
        aria-label={`Remove ${label}`}
      >
        ✕
      </button>
    </div>
  );
}