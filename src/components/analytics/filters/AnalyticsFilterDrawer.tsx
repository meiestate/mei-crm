import { useEffect, useMemo, useState } from "react";

export type AnalyticsFilterOption = {
  label: string;
  value: string;
};

export type AnalyticsKpiOption = {
  label: string;
  value: string;
};

export type AnalyticsFilterValues = {
  datePreset: string;
  startDate: string;
  endDate: string;
  selectedAgents: string[];
  selectedTeams: string[];
  selectedSources: string[];
  selectedProjects: string[];
  selectedStatuses: string[];
  selectedKpis: string[];
};

type AnalyticsFilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: AnalyticsFilterValues) => void;
  onReset?: () => void;
  initialValues?: AnalyticsFilterValues;
  title?: string;
  subtitle?: string;
  agentOptions?: AnalyticsFilterOption[];
  teamOptions?: AnalyticsFilterOption[];
  sourceOptions?: AnalyticsFilterOption[];
  projectOptions?: AnalyticsFilterOption[];
  statusOptions?: AnalyticsFilterOption[];
  kpiOptions?: AnalyticsKpiOption[];
};

const DEFAULT_AGENT_OPTIONS: AnalyticsFilterOption[] = [
  { label: "Arun", value: "arun" },
  { label: "Priya", value: "priya" },
  { label: "Karthik", value: "karthik" },
  { label: "Divya", value: "divya" },
  { label: "Sanjay", value: "sanjay" },
  { label: "Meena", value: "meena" },
];

const DEFAULT_TEAM_OPTIONS: AnalyticsFilterOption[] = [
  { label: "Sales Team A", value: "sales_team_a" },
  { label: "Sales Team B", value: "sales_team_b" },
  { label: "Inside Sales", value: "inside_sales" },
  { label: "Field Team", value: "field_team" },
];

const DEFAULT_SOURCE_OPTIONS: AnalyticsFilterOption[] = [
  { label: "Website", value: "website" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Facebook Ads", value: "facebook_ads" },
  { label: "Google Ads", value: "google_ads" },
  { label: "Referral", value: "referral" },
  { label: "Walk-in", value: "walk_in" },
];

const DEFAULT_PROJECT_OPTIONS: AnalyticsFilterOption[] = [
  { label: "Green Valley", value: "green_valley" },
  { label: "Sky Residency", value: "sky_residency" },
  { label: "MEI Platinum", value: "mei_platinum" },
  { label: "Golden Enclave", value: "golden_enclave" },
];

const DEFAULT_STATUS_OPTIONS: AnalyticsFilterOption[] = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Site Visit", value: "site_visit" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
];

const DEFAULT_KPI_OPTIONS: AnalyticsKpiOption[] = [
  { label: "Revenue", value: "revenue" },
  { label: "Closures", value: "closures" },
  { label: "Conversion Rate", value: "conversion_rate" },
  { label: "Lead Volume", value: "lead_volume" },
  { label: "Follow-Up Compliance", value: "follow_up_compliance" },
  { label: "SLA Breach", value: "sla_breach" },
];

const DEFAULT_VALUES: AnalyticsFilterValues = {
  datePreset: "last_30_days",
  startDate: "",
  endDate: "",
  selectedAgents: [],
  selectedTeams: [],
  selectedSources: [],
  selectedProjects: [],
  selectedStatuses: [],
  selectedKpis: ["revenue", "closures", "conversion_rate"],
};

function getDefaultValues(
  initialValues?: AnalyticsFilterValues
): AnalyticsFilterValues {
  return {
    datePreset: initialValues?.datePreset ?? DEFAULT_VALUES.datePreset,
    startDate: initialValues?.startDate ?? DEFAULT_VALUES.startDate,
    endDate: initialValues?.endDate ?? DEFAULT_VALUES.endDate,
    selectedAgents: initialValues?.selectedAgents ?? DEFAULT_VALUES.selectedAgents,
    selectedTeams: initialValues?.selectedTeams ?? DEFAULT_VALUES.selectedTeams,
    selectedSources: initialValues?.selectedSources ?? DEFAULT_VALUES.selectedSources,
    selectedProjects: initialValues?.selectedProjects ?? DEFAULT_VALUES.selectedProjects,
    selectedStatuses: initialValues?.selectedStatuses ?? DEFAULT_VALUES.selectedStatuses,
    selectedKpis: initialValues?.selectedKpis ?? DEFAULT_VALUES.selectedKpis,
  };
}

function toggleArrayValue(values: string[], value: string): string[] {
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }
  return [...values, value];
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#111827",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
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

type ChipMultiSelectProps = {
  options: AnalyticsFilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
};

function ChipMultiSelect({
  options,
  selectedValues,
  onToggle,
}: ChipMultiSelectProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      {options.map((option) => {
        const active = selectedValues.includes(option.value);

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onToggle(option.value)}
            style={{
              border: active ? "1px solid #111827" : "1px solid #d1d5db",
              background: active ? "#111827" : "#ffffff",
              color: active ? "#ffffff" : "#374151",
              borderRadius: 999,
              padding: "8px 12px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

type CheckboxGridProps = {
  options: AnalyticsKpiOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
};

function CheckboxGrid({
  options,
  selectedValues,
  onToggle,
}: CheckboxGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 10,
      }}
    >
      {options.map((option) => {
        const checked = selectedValues.includes(option.value);

        return (
          <label
            key={option.value}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 12,
              border: checked ? "1px solid #111827" : "1px solid #e5e7eb",
              background: checked ? "#f9fafb" : "#ffffff",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(option.value)}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
              }}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export default function AnalyticsFilterDrawer({
  open,
  onClose,
  onApply,
  onReset,
  initialValues,
  title = "Analytics Filters",
  subtitle = "Refine dashboard metrics by timeframe, team, source, and KPI selection",
  agentOptions = DEFAULT_AGENT_OPTIONS,
  teamOptions = DEFAULT_TEAM_OPTIONS,
  sourceOptions = DEFAULT_SOURCE_OPTIONS,
  projectOptions = DEFAULT_PROJECT_OPTIONS,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  kpiOptions = DEFAULT_KPI_OPTIONS,
}: AnalyticsFilterDrawerProps) {
  const [filters, setFilters] = useState<AnalyticsFilterValues>(
    getDefaultValues(initialValues)
  );

  useEffect(() => {
    if (open) {
      setFilters(getDefaultValues(initialValues));
    }
  }, [initialValues, open]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.datePreset !== DEFAULT_VALUES.datePreset) count += 1;
    if (filters.startDate) count += 1;
    if (filters.endDate) count += 1;
    if (filters.selectedAgents.length > 0) count += 1;
    if (filters.selectedTeams.length > 0) count += 1;
    if (filters.selectedSources.length > 0) count += 1;
    if (filters.selectedProjects.length > 0) count += 1;
    if (filters.selectedStatuses.length > 0) count += 1;
    if (filters.selectedKpis.length !== DEFAULT_VALUES.selectedKpis.length) count += 1;

    return count;
  }, [filters]);

  const setField = <K extends keyof AnalyticsFilterValues>(
    key: K,
    value: AnalyticsFilterValues[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    const resetValues = getDefaultValues();

    setFilters(resetValues);

    if (onReset) {
      onReset();
    }
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.45)",
          zIndex: 1000,
        }}
      />

      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(520px, 100vw)",
          height: "100vh",
          background: "#ffffff",
          zIndex: 1001,
          boxShadow: "-12px 0 32px rgba(15, 23, 42, 0.14)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: 20,
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {title}
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 14,
                color: "#6b7280",
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              fontSize: 18,
              cursor: "pointer",
              flexShrink: 0,
            }}
            aria-label="Close analytics filter drawer"
          >
            ✕
          </button>
        </div>

        <div
          style={{
            padding: 20,
            overflowY: "auto",
            flex: 1,
            display: "grid",
            gap: 22,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 120,
              width: "fit-content",
              height: 34,
              padding: "0 12px",
              borderRadius: 999,
              background: activeFilterCount > 0 ? "#111827" : "#f3f4f6",
              color: activeFilterCount > 0 ? "#ffffff" : "#6b7280",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {activeFilterCount} active filters
          </div>

          <section>
            <SectionTitle>Date Range</SectionTitle>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <FieldLabel>Date Preset</FieldLabel>
                <select
                  value={filters.datePreset}
                  onChange={(e) => setField("datePreset", e.target.value)}
                  style={selectStyle}
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="this_quarter">This Quarter</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <FieldLabel>Start Date</FieldLabel>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setField("startDate", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <FieldLabel>End Date</FieldLabel>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setField("endDate", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          </section>

          <section>
            <SectionTitle>Agents</SectionTitle>
            <ChipMultiSelect
              options={agentOptions}
              selectedValues={filters.selectedAgents}
              onToggle={(value) =>
                setField("selectedAgents", toggleArrayValue(filters.selectedAgents, value))
              }
            />
          </section>

          <section>
            <SectionTitle>Teams</SectionTitle>
            <ChipMultiSelect
              options={teamOptions}
              selectedValues={filters.selectedTeams}
              onToggle={(value) =>
                setField("selectedTeams", toggleArrayValue(filters.selectedTeams, value))
              }
            />
          </section>

          <section>
            <SectionTitle>Lead Sources</SectionTitle>
            <ChipMultiSelect
              options={sourceOptions}
              selectedValues={filters.selectedSources}
              onToggle={(value) =>
                setField(
                  "selectedSources",
                  toggleArrayValue(filters.selectedSources, value)
                )
              }
            />
          </section>

          <section>
            <SectionTitle>Projects</SectionTitle>
            <ChipMultiSelect
              options={projectOptions}
              selectedValues={filters.selectedProjects}
              onToggle={(value) =>
                setField(
                  "selectedProjects",
                  toggleArrayValue(filters.selectedProjects, value)
                )
              }
            />
          </section>

          <section>
            <SectionTitle>Lead Status</SectionTitle>
            <ChipMultiSelect
              options={statusOptions}
              selectedValues={filters.selectedStatuses}
              onToggle={(value) =>
                setField(
                  "selectedStatuses",
                  toggleArrayValue(filters.selectedStatuses, value)
                )
              }
            />
          </section>

          <section>
            <SectionTitle>Visible KPIs</SectionTitle>
            <CheckboxGrid
              options={kpiOptions}
              selectedValues={filters.selectedKpis}
              onToggle={(value) =>
                setField("selectedKpis", toggleArrayValue(filters.selectedKpis, value))
              }
            />
          </section>
        </div>

        <div
          style={{
            padding: 20,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: 12,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            style={{
              height: 44,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              padding: "0 16px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reset All
          </button>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginLeft: "auto",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                height: 44,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#374151",
                padding: "0 16px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              style={{
                height: 44,
                borderRadius: 12,
                border: "1px solid #111827",
                background: "#111827",
                color: "#ffffff",
                padding: "0 18px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

const inputStyle: React.CSSProperties = {
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
};

const selectStyle: React.CSSProperties = {
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
};