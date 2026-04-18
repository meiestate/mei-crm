import { useEffect, useMemo, useState } from "react";

export type PropertyTypeFilterOption = {
  label: string;
  value: string;
};

export type PropertyTypeFilterValue = {
  search: string;
  category: string;
  availability: string;
  furnishing: string;
  selectedTypes: string[];
};

type PropertyTypeFilterProps = {
  value?: PropertyTypeFilterValue;
  onChange?: (value: PropertyTypeFilterValue) => void;
  onApply?: (value: PropertyTypeFilterValue) => void;
  onReset?: () => void;
  title?: string;
  subtitle?: string;
  categoryOptions?: PropertyTypeFilterOption[];
  availabilityOptions?: PropertyTypeFilterOption[];
  furnishingOptions?: PropertyTypeFilterOption[];
  propertyTypeOptions?: PropertyTypeFilterOption[];
  featuredTypes?: PropertyTypeFilterOption[];
  disabled?: boolean;
};

const DEFAULT_VALUE: PropertyTypeFilterValue = {
  search: "",
  category: "all",
  availability: "all",
  furnishing: "all",
  selectedTypes: [],
};

const DEFAULT_CATEGORY_OPTIONS: PropertyTypeFilterOption[] = [
  { label: "All Categories", value: "all" },
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Land / Plot", value: "land_plot" },
  { label: "Industrial", value: "industrial" },
];

const DEFAULT_AVAILABILITY_OPTIONS: PropertyTypeFilterOption[] = [
  { label: "All Availability", value: "all" },
  { label: "Ready to Move", value: "ready_to_move" },
  { label: "Under Construction", value: "under_construction" },
  { label: "New Launch", value: "new_launch" },
  { label: "Resale", value: "resale" },
];

const DEFAULT_FURNISHING_OPTIONS: PropertyTypeFilterOption[] = [
  { label: "All Furnishing", value: "all" },
  { label: "Fully Furnished", value: "fully_furnished" },
  { label: "Semi Furnished", value: "semi_furnished" },
  { label: "Unfurnished", value: "unfurnished" },
];

const DEFAULT_PROPERTY_TYPE_OPTIONS: PropertyTypeFilterOption[] = [
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Independent House", value: "independent_house" },
  { label: "Plot", value: "plot" },
  { label: "Studio", value: "studio" },
  { label: "Penthouse", value: "penthouse" },
  { label: "Office Space", value: "office_space" },
  { label: "Shop", value: "shop" },
  { label: "Warehouse", value: "warehouse" },
  { label: "Showroom", value: "showroom" },
];

const DEFAULT_FEATURED_TYPES: PropertyTypeFilterOption[] = [
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Plot", value: "plot" },
  { label: "Office Space", value: "office_space" },
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
  options: PropertyTypeFilterOption[];
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

export default function PropertyTypeFilter({
  value = DEFAULT_VALUE,
  onChange,
  onApply,
  onReset,
  title = "Property Type Filter",
  subtitle = "Refine listings using type, category, availability and furnishing",
  categoryOptions = DEFAULT_CATEGORY_OPTIONS,
  availabilityOptions = DEFAULT_AVAILABILITY_OPTIONS,
  furnishingOptions = DEFAULT_FURNISHING_OPTIONS,
  propertyTypeOptions = DEFAULT_PROPERTY_TYPE_OPTIONS,
  featuredTypes = DEFAULT_FEATURED_TYPES,
  disabled = false,
}: PropertyTypeFilterProps) {
  const [localValue, setLocalValue] = useState<PropertyTypeFilterValue>({
    search: value.search ?? "",
    category: value.category ?? "all",
    availability: value.availability ?? "all",
    furnishing: value.furnishing ?? "all",
    selectedTypes: value.selectedTypes ?? [],
  });

  useEffect(() => {
    setLocalValue({
      search: value.search ?? "",
      category: value.category ?? "all",
      availability: value.availability ?? "all",
      furnishing: value.furnishing ?? "all",
      selectedTypes: value.selectedTypes ?? [],
    });
  }, [
    value.availability,
    value.category,
    value.furnishing,
    value.search,
    value.selectedTypes,
  ]);

  const filteredTypeOptions = useMemo(() => {
    const keyword = localValue.search.trim().toLowerCase();

    if (!keyword) return propertyTypeOptions;

    return propertyTypeOptions.filter((type) =>
      type.label.toLowerCase().includes(keyword) ||
      type.value.toLowerCase().includes(keyword.replace(/\s+/g, "_"))
    );
  }, [localValue.search, propertyTypeOptions]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (localValue.search.trim()) count += 1;
    if (localValue.category !== "all") count += 1;
    if (localValue.availability !== "all") count += 1;
    if (localValue.furnishing !== "all") count += 1;
    if (localValue.selectedTypes.length > 0) count += 1;

    return count;
  }, [localValue]);

  const updateValue = (next: PropertyTypeFilterValue) => {
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
          <FilterLabel>Search Type</FilterLabel>
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
              placeholder="Search by property type"
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
          <FilterLabel>Availability</FilterLabel>
          <SelectField
            value={localValue.availability}
            options={availabilityOptions}
            onChange={(nextAvailability) =>
              updateValue({
                ...localValue,
                availability: nextAvailability,
              })
            }
            disabled={disabled}
          />
        </div>

        <div>
          <FilterLabel>Furnishing</FilterLabel>
          <SelectField
            value={localValue.furnishing}
            options={furnishingOptions}
            onChange={(nextFurnishing) =>
              updateValue({
                ...localValue,
                furnishing: nextFurnishing,
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
          Featured Types
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {featuredTypes.map((type) => {
            const active = localValue.selectedTypes.includes(type.value);

            return (
              <button
                key={type.value}
                type="button"
                onClick={() =>
                  updateValue({
                    ...localValue,
                    selectedTypes: toggleArrayValue(
                      localValue.selectedTypes,
                      type.value
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
                {type.label}
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
          Select Property Types
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            minHeight: 44,
          }}
        >
          {filteredTypeOptions.length > 0 ? (
            filteredTypeOptions.map((type) => {
              const active = localValue.selectedTypes.includes(type.value);

              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    updateValue({
                      ...localValue,
                      selectedTypes: toggleArrayValue(
                        localValue.selectedTypes,
                        type.value
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
                  {type.label}
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
              No matching property types found.
            </div>
          )}
        </div>
      </div>

      {localValue.selectedTypes.length > 0 ? (
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#6b7280",
              marginBottom: 8,
            }}
          >
            Selected Types
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {localValue.selectedTypes.map((typeValue) => {
              const type = propertyTypeOptions.find((item) => item.value === typeValue);

              return (
                <div
                  key={typeValue}
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
                  <span>{type?.label ?? typeValue}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateValue({
                        ...localValue,
                        selectedTypes: localValue.selectedTypes.filter(
                          (item) => item !== typeValue
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
                    aria-label={`Remove ${type?.label ?? typeValue}`}
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
          label="Selected Category"
          value={
            categoryOptions.find((item) => item.value === localValue.category)?.label ??
            "All Categories"
          }
          accent="#2563eb"
          background="#eff6ff"
          border="#dbeafe"
        />

        <MetricCard
          label="Selected Availability"
          value={
            availabilityOptions.find(
              (item) => item.value === localValue.availability
            )?.label ?? "All Availability"
          }
          accent="#16a34a"
          background="#f0fdf4"
          border="#dcfce7"
        />

        <MetricCard
          label="Type Count"
          value={`${localValue.selectedTypes.length}`}
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
          Apply Property Type Filter
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