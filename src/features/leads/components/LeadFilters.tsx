import { useEffect, useMemo, useState } from "react";

export type LeadStatus =
  | "All"
  | "New"
  | "Contacted"
  | "Qualified"
  | "Site Visit"
  | "Negotiation"
  | "Won"
  | "Lost";

export type LeadSource =
  | "All"
  | "Website"
  | "Facebook"
  | "Instagram"
  | "WhatsApp"
  | "Referral"
  | "Walk-in"
  | "Call"
  | "Broker"
  | "Other";

export type LeadPriority = "All" | "Low" | "Medium" | "High";

export type LeadFilterValues = {
  search: string;
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  assignedTo: string;
  location: string;
  fromDate: string;
  toDate: string;
};

type LeadFiltersProps = {
  value?: LeadFilterValues;
  onChange?: (filters: LeadFilterValues) => void;
  onReset?: () => void;
};

const defaultFilters: LeadFilterValues = {
  search: "",
  status: "All",
  source: "All",
  priority: "All",
  assignedTo: "",
  location: "",
  fromDate: "",
  toDate: "",
};

const statusOptions: LeadStatus[] = [
  "All",
  "New",
  "Contacted",
  "Qualified",
  "Site Visit",
  "Negotiation",
  "Won",
  "Lost",
];

const sourceOptions: LeadSource[] = [
  "All",
  "Website",
  "Facebook",
  "Instagram",
  "WhatsApp",
  "Referral",
  "Walk-in",
  "Call",
  "Broker",
  "Other",
];

const priorityOptions: LeadPriority[] = ["All", "Low", "Medium", "High"];

export default function LeadFilters({
  value,
  onChange,
  onReset,
}: LeadFiltersProps) {
  const [filters, setFilters] = useState<LeadFilterValues>(
    value || defaultFilters
  );

  useEffect(() => {
    if (value) {
      setFilters(value);
    }
  }, [value]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.search.trim()) count++;
    if (filters.status !== "All") count++;
    if (filters.source !== "All") count++;
    if (filters.priority !== "All") count++;
    if (filters.assignedTo.trim()) count++;
    if (filters.location.trim()) count++;
    if (filters.fromDate) count++;
    if (filters.toDate) count++;

    return count;
  }, [filters]);

  const updateFilter = <K extends keyof LeadFilterValues>(
    key: K,
    value: LeadFilterValues[K]
  ) => {
    const updated = {
      ...filters,
      [key]: value,
    };

    setFilters(updated);
    onChange?.(updated);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onChange?.(defaultFilters);
    onReset?.();
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        padding: 20,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Lead Filters
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Narrow down your pipeline and find the right leads faster.
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
              minWidth: 30,
              height: 30,
              padding: "0 10px",
              borderRadius: 999,
              background: activeFilterCount > 0 ? "#0f172a" : "#e2e8f0",
              color: activeFilterCount > 0 ? "#ffffff" : "#475569",
              fontSize: 12,
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
              padding: "0 14px",
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#0f172a",
              fontSize: 13,
              fontWeight: 600,
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
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <InputField
          label="Search"
          placeholder="Name, phone, email, project..."
          value={filters.search}
          onChange={(value) => updateFilter("search", value)}
        />

        <SelectField
          label="Status"
          value={filters.status}
          options={statusOptions}
          onChange={(value) =>
            updateFilter("status", value as LeadFilterValues["status"])
          }
        />

        <SelectField
          label="Source"
          value={filters.source}
          options={sourceOptions}
          onChange={(value) =>
            updateFilter("source", value as LeadFilterValues["source"])
          }
        />

        <SelectField
          label="Priority"
          value={filters.priority}
          options={priorityOptions}
          onChange={(value) =>
            updateFilter("priority", value as LeadFilterValues["priority"])
          }
        />

        <InputField
          label="Assigned To"
          placeholder="Sales owner / team member"
          value={filters.assignedTo}
          onChange={(value) => updateFilter("assignedTo", value)}
        />

        <InputField
          label="Location"
          placeholder="Search by preferred location"
          value={filters.location}
          onChange={(value) => updateFilter("location", value)}
        />

        <InputField
          label="From Date"
          type="date"
          value={filters.fromDate}
          onChange={(value) => updateFilter("fromDate", value)}
        />

        <InputField
          label="To Date"
          type="date"
          value={filters.toDate}
          onChange={(value) => updateFilter("toDate", value)}
        />
      </div>
    </div>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
};

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: InputFieldProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <label
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#334155",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: 44,
          borderRadius: 12,
          border: "1px solid #cbd5e1",
          background: "#ffffff",
          color: "#0f172a",
          fontSize: 14,
          padding: "0 14px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function SelectField({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <label
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#334155",
        }}
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: 44,
          borderRadius: 12,
          border: "1px solid #cbd5e1",
          background: "#ffffff",
          color: "#0f172a",
          fontSize: 14,
          padding: "0 14px",
          outline: "none",
          boxSizing: "border-box",
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}