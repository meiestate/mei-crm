import { useEffect, useMemo, useState } from "react";

export type LocationFilterOption = {
  label: string;
  value: string;
};

export type LocationFilterValue = {
  search: string;
  city: string;
  zone: string;
  selectedAreas: string[];
};

type LocationFilterProps = {
  value?: LocationFilterValue;
  onChange?: (value: LocationFilterValue) => void;
  onApply?: (value: LocationFilterValue) => void;
  onReset?: () => void;
  title?: string;
  subtitle?: string;
  cityOptions?: LocationFilterOption[];
  zoneOptions?: LocationFilterOption[];
  areaOptions?: LocationFilterOption[];
  popularAreas?: LocationFilterOption[];
  disabled?: boolean;
};

const DEFAULT_VALUE: LocationFilterValue = {
  search: "",
  city: "all",
  zone: "all",
  selectedAreas: [],
};

const DEFAULT_CITY_OPTIONS: LocationFilterOption[] = [
  { label: "All Cities", value: "all" },
  { label: "Bengaluru", value: "bengaluru" },
  { label: "Chennai", value: "chennai" },
  { label: "Hyderabad", value: "hyderabad" },
  { label: "Coimbatore", value: "coimbatore" },
];

const DEFAULT_ZONE_OPTIONS: LocationFilterOption[] = [
  { label: "All Zones", value: "all" },
  { label: "North", value: "north" },
  { label: "South", value: "south" },
  { label: "East", value: "east" },
  { label: "West", value: "west" },
  { label: "Central", value: "central" },
];

const DEFAULT_AREA_OPTIONS: LocationFilterOption[] = [
  { label: "Whitefield", value: "whitefield" },
  { label: "Sarjapur Road", value: "sarjapur_road" },
  { label: "HSR Layout", value: "hsr_layout" },
  { label: "Electronic City", value: "electronic_city" },
  { label: "Hebbal", value: "hebbal" },
  { label: "Indiranagar", value: "indiranagar" },
  { label: "OMR", value: "omr" },
  { label: "Anna Nagar", value: "anna_nagar" },
  { label: "Velachery", value: "velachery" },
  { label: "Madhapur", value: "madhapur" },
];

const DEFAULT_POPULAR_AREAS: LocationFilterOption[] = [
  { label: "Whitefield", value: "whitefield" },
  { label: "Sarjapur Road", value: "sarjapur_road" },
  { label: "HSR Layout", value: "hsr_layout" },
  { label: "Electronic City", value: "electronic_city" },
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
  options: LocationFilterOption[];
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

export default function LocationFilter({
  value = DEFAULT_VALUE,
  onChange,
  onApply,
  onReset,
  title = "Location Filter",
  subtitle = "Refine records using city, zone, area and location search",
  cityOptions = DEFAULT_CITY_OPTIONS,
  zoneOptions = DEFAULT_ZONE_OPTIONS,
  areaOptions = DEFAULT_AREA_OPTIONS,
  popularAreas = DEFAULT_POPULAR_AREAS,
  disabled = false,
}: LocationFilterProps) {
  const [localValue, setLocalValue] = useState<LocationFilterValue>({
    search: value.search ?? "",
    city: value.city ?? "all",
    zone: value.zone ?? "all",
    selectedAreas: value.selectedAreas ?? [],
  });

  useEffect(() => {
    setLocalValue({
      search: value.search ?? "",
      city: value.city ?? "all",
      zone: value.zone ?? "all",
      selectedAreas: value.selectedAreas ?? [],
    });
  }, [value.city, value.search, value.selectedAreas, value.zone]);

  const filteredAreaOptions = useMemo(() => {
    const keyword = localValue.search.trim().toLowerCase();

    if (!keyword) return areaOptions;

    return areaOptions.filter((area) =>
      area.label.toLowerCase().includes(keyword)
    );
  }, [areaOptions, localValue.search]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (localValue.search.trim()) count += 1;
    if (localValue.city !== "all") count += 1;
    if (localValue.zone !== "all") count += 1;
    if (localValue.selectedAreas.length > 0) count += 1;

    return count;
  }, [localValue]);

  const updateValue = (next: LocationFilterValue) => {
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
          gridTemplateColumns: "minmax(220px, 1.5fr) repeat(2, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div>
          <FilterLabel>Search Location</FilterLabel>
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
              placeholder="Search by area, layout, locality or city"
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
          <FilterLabel>City</FilterLabel>
          <SelectField
            value={localValue.city}
            options={cityOptions}
            onChange={(nextCity) =>
              updateValue({
                ...localValue,
                city: nextCity,
              })
            }
            disabled={disabled}
          />
        </div>

        <div>
          <FilterLabel>Zone</FilterLabel>
          <SelectField
            value={localValue.zone}
            options={zoneOptions}
            onChange={(nextZone) =>
              updateValue({
                ...localValue,
                zone: nextZone,
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
          Popular Areas
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {popularAreas.map((area) => {
            const active = localValue.selectedAreas.includes(area.value);

            return (
              <button
                key={area.value}
                type="button"
                onClick={() =>
                  updateValue({
                    ...localValue,
                    selectedAreas: toggleArrayValue(
                      localValue.selectedAreas,
                      area.value
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
                {area.label}
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
          Select Areas
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            minHeight: 44,
          }}
        >
          {filteredAreaOptions.length > 0 ? (
            filteredAreaOptions.map((area) => {
              const active = localValue.selectedAreas.includes(area.value);

              return (
                <button
                  key={area.value}
                  type="button"
                  onClick={() =>
                    updateValue({
                      ...localValue,
                      selectedAreas: toggleArrayValue(
                        localValue.selectedAreas,
                        area.value
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
                  {area.label}
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
              No matching locations found.
            </div>
          )}
        </div>
      </div>

      {localValue.selectedAreas.length > 0 ? (
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#6b7280",
              marginBottom: 8,
            }}
          >
            Selected Areas
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {localValue.selectedAreas.map((areaValue) => {
              const area = areaOptions.find((item) => item.value === areaValue);

              return (
                <div
                  key={areaValue}
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
                  <span>{area?.label ?? areaValue}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateValue({
                        ...localValue,
                        selectedAreas: localValue.selectedAreas.filter(
                          (item) => item !== areaValue
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
                    aria-label={`Remove ${area?.label ?? areaValue}`}
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
          label="Selected City"
          value={
            cityOptions.find((item) => item.value === localValue.city)?.label ??
            "All Cities"
          }
          accent="#2563eb"
          background="#eff6ff"
          border="#dbeafe"
        />

        <MetricCard
          label="Selected Zone"
          value={
            zoneOptions.find((item) => item.value === localValue.zone)?.label ??
            "All Zones"
          }
          accent="#16a34a"
          background="#f0fdf4"
          border="#dcfce7"
        />

        <MetricCard
          label="Area Count"
          value={`${localValue.selectedAreas.length}`}
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
          Apply Location Filter
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