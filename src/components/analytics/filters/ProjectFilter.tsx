import { useEffect, useMemo, useState } from "react";

export type ProjectFilterOption = {
  label: string;
  value: string;
};

export type ProjectFilterValue = {
  search: string;
  status: string;
  category: string;
  builder: string;
  selectedProjects: string[];
};

type ProjectFilterProps = {
  value?: ProjectFilterValue;
  onChange?: (value: ProjectFilterValue) => void;
  onApply?: (value: ProjectFilterValue) => void;
  onReset?: () => void;
  title?: string;
  subtitle?: string;
  statusOptions?: ProjectFilterOption[];
  categoryOptions?: ProjectFilterOption[];
  builderOptions?: ProjectFilterOption[];
  projectOptions?: ProjectFilterOption[];
  featuredProjects?: ProjectFilterOption[];
  disabled?: boolean;
};

const DEFAULT_VALUE: ProjectFilterValue = {
  search: "",
  status: "all",
  category: "all",
  builder: "all",
  selectedProjects: [],
};

const DEFAULT_STATUS_OPTIONS: ProjectFilterOption[] = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Sold Out", value: "sold_out" },
];

const DEFAULT_CATEGORY_OPTIONS: ProjectFilterOption[] = [
  { label: "All Categories", value: "all" },
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Plot", value: "plot" },
  { label: "Commercial", value: "commercial" },
  { label: "Mixed Use", value: "mixed_use" },
];

const DEFAULT_BUILDER_OPTIONS: ProjectFilterOption[] = [
  { label: "All Builders", value: "all" },
  { label: "Prestige", value: "prestige" },
  { label: "Brigade", value: "brigade" },
  { label: "Sobha", value: "sobha" },
  { label: "Puravankara", value: "puravankara" },
  { label: "MEI Developers", value: "mei_developers" },
];

const DEFAULT_PROJECT_OPTIONS: ProjectFilterOption[] = [
  { label: "MEI Platinum", value: "mei_platinum" },
  { label: "Green Valley", value: "green_valley" },
  { label: "Sky Residency", value: "sky_residency" },
  { label: "Golden Enclave", value: "golden_enclave" },
  { label: "Prestige Lakeside", value: "prestige_lakeside" },
  { label: "Sobha Dream Acres", value: "sobha_dream_acres" },
  { label: "Brigade Cornerstone", value: "brigade_cornerstone" },
  { label: "Purva Westend", value: "purva_westend" },
];

const DEFAULT_FEATURED_PROJECTS: ProjectFilterOption[] = [
  { label: "MEI Platinum", value: "mei_platinum" },
  { label: "Green Valley", value: "green_valley" },
  { label: "Sky Residency", value: "sky_residency" },
  { label: "Golden Enclave", value: "golden_enclave" },
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
  options: ProjectFilterOption[];
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

export default function ProjectFilter({
  value = DEFAULT_VALUE,
  onChange,
  onApply,
  onReset,
  title = "Project Filter",
  subtitle = "Refine projects using name, status, category, builder and quick selection",
  statusOptions = DEFAULT_STATUS_OPTIONS,
  categoryOptions = DEFAULT_CATEGORY_OPTIONS,
  builderOptions = DEFAULT_BUILDER_OPTIONS,
  projectOptions = DEFAULT_PROJECT_OPTIONS,
  featuredProjects = DEFAULT_FEATURED_PROJECTS,
  disabled = false,
}: ProjectFilterProps) {
  const [localValue, setLocalValue] = useState<ProjectFilterValue>({
    search: value.search ?? "",
    status: value.status ?? "all",
    category: value.category ?? "all",
    builder: value.builder ?? "all",
    selectedProjects: value.selectedProjects ?? [],
  });

  useEffect(() => {
    setLocalValue({
      search: value.search ?? "",
      status: value.status ?? "all",
      category: value.category ?? "all",
      builder: value.builder ?? "all",
      selectedProjects: value.selectedProjects ?? [],
    });
  }, [
    value.builder,
    value.category,
    value.search,
    value.selectedProjects,
    value.status,
  ]);

  const filteredProjectOptions = useMemo(() => {
    const keyword = localValue.search.trim().toLowerCase();

    if (!keyword) return projectOptions;

    return projectOptions.filter((project) =>
      project.label.toLowerCase().includes(keyword) ||
      project.value.toLowerCase().includes(keyword.replace(/\s+/g, "_"))
    );
  }, [localValue.search, projectOptions]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (localValue.search.trim()) count += 1;
    if (localValue.status !== "all") count += 1;
    if (localValue.category !== "all") count += 1;
    if (localValue.builder !== "all") count += 1;
    if (localValue.selectedProjects.length > 0) count += 1;

    return count;
  }, [localValue]);

  const updateValue = (next: ProjectFilterValue) => {
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
          <FilterLabel>Search Project</FilterLabel>
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
              placeholder="Search by project name or code"
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
          <FilterLabel>Status</FilterLabel>
          <SelectField
            value={localValue.status}
            options={statusOptions}
            onChange={(nextStatus) =>
              updateValue({
                ...localValue,
                status: nextStatus,
              })
            }
            disabled={disabled}
          />
        </div>

        <div>
          <FilterLabel>Category</FilterLabel>
          <SelectField
            value={localValue.category}
            options={categoryOptions}
            onChange={(nextCategory) =>
              updateValue({
                ...localValue,
                category: nextCategory,
              })
            }
            disabled={disabled}
          />
        </div>

        <div>
          <FilterLabel>Builder</FilterLabel>
          <SelectField
            value={localValue.builder}
            options={builderOptions}
            onChange={(nextBuilder) =>
              updateValue({
                ...localValue,
                builder: nextBuilder,
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
          Featured Projects
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {featuredProjects.map((project) => {
            const active = localValue.selectedProjects.includes(project.value);

            return (
              <button
                key={project.value}
                type="button"
                onClick={() =>
                  updateValue({
                    ...localValue,
                    selectedProjects: toggleArrayValue(
                      localValue.selectedProjects,
                      project.value
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
                {project.label}
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
          Select Projects
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            minHeight: 44,
          }}
        >
          {filteredProjectOptions.length > 0 ? (
            filteredProjectOptions.map((project) => {
              const active = localValue.selectedProjects.includes(project.value);

              return (
                <button
                  key={project.value}
                  type="button"
                  onClick={() =>
                    updateValue({
                      ...localValue,
                      selectedProjects: toggleArrayValue(
                        localValue.selectedProjects,
                        project.value
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
                  {project.label}
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
              No matching projects found.
            </div>
          )}
        </div>
      </div>

      {localValue.selectedProjects.length > 0 ? (
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#6b7280",
              marginBottom: 8,
            }}
          >
            Selected Projects
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {localValue.selectedProjects.map((projectValue) => {
              const project = projectOptions.find((item) => item.value === projectValue);

              return (
                <div
                  key={projectValue}
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
                  <span>{project?.label ?? projectValue}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateValue({
                        ...localValue,
                        selectedProjects: localValue.selectedProjects.filter(
                          (item) => item !== projectValue
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
                    aria-label={`Remove ${project?.label ?? projectValue}`}
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
          label="Selected Status"
          value={
            statusOptions.find((item) => item.value === localValue.status)?.label ??
            "All Status"
          }
          accent="#2563eb"
          background="#eff6ff"
          border="#dbeafe"
        />

        <MetricCard
          label="Selected Builder"
          value={
            builderOptions.find((item) => item.value === localValue.builder)?.label ??
            "All Builders"
          }
          accent="#16a34a"
          background="#f0fdf4"
          border="#dcfce7"
        />

        <MetricCard
          label="Project Count"
          value={`${localValue.selectedProjects.length}`}
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
          Apply Project Filter
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