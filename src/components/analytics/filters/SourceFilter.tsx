import { useEffect, useMemo, useState } from "react";

export type SourceFilterOption = {
  label: string;
  value: string;
};

export type SourceFilterValue = {
  search: string;
  channel: string;
  campaignType: string;
  leadQuality: string;
  selectedSources: string[];
};

type SourceFilterProps = {
  value?: SourceFilterValue;
  onChange?: (value: SourceFilterValue) => void;
  onApply?: (value: SourceFilterValue) => void;
  onReset?: () => void;
  title?: string;
  subtitle?: string;
  channelOptions?: SourceFilterOption[];
  campaignTypeOptions?: SourceFilterOption[];
  leadQualityOptions?: SourceFilterOption[];
  sourceOptions?: SourceFilterOption[];
  featuredSources?: SourceFilterOption[];
  disabled?: boolean;
};

const DEFAULT_VALUE: SourceFilterValue = {
  search: "",
  channel: "all",
  campaignType: "all",
  leadQuality: "all",
  selectedSources: [],
};

const DEFAULT_CHANNEL_OPTIONS: SourceFilterOption[] = [
  { label: "All Channels", value: "all" },
  { label: "Organic", value: "organic" },
  { label: "Paid", value: "paid" },
  { label: "Referral", value: "referral" },
  { label: "Offline", value: "offline" },
  { label: "Partner", value: "partner" },
];

const DEFAULT_CAMPAIGN_TYPE_OPTIONS: SourceFilterOption[] = [
  { label: "All Campaign Types", value: "all" },
  { label: "Meta Ads", value: "meta_ads" },
  { label: "Google Ads", value: "google_ads" },
  { label: "WhatsApp Campaign", value: "whatsapp_campaign" },
  { label: "Email Campaign", value: "email_campaign" },
  { label: "Walk-in", value: "walk_in" },
  { label: "Broker Referral", value: "broker_referral" },
];

const DEFAULT_LEAD_QUALITY_OPTIONS: SourceFilterOption[] = [
  { label: "All Lead Quality", value: "all" },
  { label: "Hot", value: "hot" },
  { label: "Warm", value: "warm" },
  { label: "Cold", value: "cold" },
  { label: "Qualified", value: "qualified" },
  { label: "Unqualified", value: "unqualified" },
];

const DEFAULT_SOURCE_OPTIONS: SourceFilterOption[] = [
  { label: "Facebook Ads", value: "facebook_ads" },
  { label: "Instagram Ads", value: "instagram_ads" },
  { label: "Google Search", value: "google_search" },
  { label: "Google Display", value: "google_display" },
  { label: "Website Organic", value: "website_organic" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Referral", value: "referral" },
  { label: "Broker Network", value: "broker_network" },
  { label: "Walk-in", value: "walk_in" },
  { label: "Magicbricks", value: "magicbricks" },
  { label: "99acres", value: "99acres" },
  { label: "Housing", value: "housing" },
];

const DEFAULT_FEATURED_SOURCES: SourceFilterOption[] = [
  { label: "Facebook Ads", value: "facebook_ads" },
  { label: "Google Search", value: "google_search" },
  { label: "Referral", value: "referral" },
  { label: "Broker Network", value: "broker_network" },
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
  options: SourceFilterOption[];
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

export default function SourceFilter({
  value = DEFAULT_VALUE,
  onChange,
  onApply,
  onReset,
  title = "Source Filter",
  subtitle = "Refine leads using source, channel, campaign type and lead quality",
  channelOptions = DEFAULT_CHANNEL_OPTIONS,
  campaignTypeOptions = DEFAULT_CAMPAIGN_TYPE_OPTIONS,
  leadQualityOptions = DEFAULT_LEAD_QUALITY_OPTIONS,
  sourceOptions = DEFAULT_SOURCE_OPTIONS,
  featuredSources = DEFAULT_FEATURED_SOURCES,
  disabled = false,
}: SourceFilterProps) {
  const [localValue, setLocalValue] = useState<SourceFilterValue>({
    search: value.search ?? "",
    channel: value.channel ?? "all",
    campaignType: value.campaignType ?? "all",
    leadQuality: value.leadQuality ?? "all",
    selectedSources: value.selectedSources ?? [],
  });

  useEffect(() => {
    setLocalValue({
      search: value.search ?? "",
      channel: value.channel ?? "all",
      campaignType: value.campaignType ?? "all",
      leadQuality: value.leadQuality ?? "all",
      selectedSources: value.selectedSources ?? [],
    });
  }, [
    value.campaignType,
    value.channel,
    value.leadQuality,
    value.search,
    value.selectedSources,
  ]);

  const filteredSourceOptions = useMemo(() => {
    const keyword = localValue.search.trim().toLowerCase();

    if (!keyword) return sourceOptions;

    return sourceOptions.filter((source) => {
      const normalizedKeyword = keyword.replace(/\s+/g, "_");
      return (
        source.label.toLowerCase().includes(keyword) ||
        source.value.toLowerCase().includes(normalizedKeyword)
      );
    });
  }, [localValue.search, sourceOptions]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (localValue.search.trim()) count += 1;
    if (localValue.channel !== "all") count += 1;
    if (localValue.campaignType !== "all") count += 1;
    if (localValue.leadQuality !== "all") count += 1;
    if (localValue.selectedSources.length > 0) count += 1;

    return count;
  }, [localValue]);

  const updateValue = (next: SourceFilterValue) => {
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
          <FilterLabel>Search Source</FilterLabel>
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
              placeholder="Search by source or platform"
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
          <FilterLabel>Channel</FilterLabel>
          <SelectField
            value={localValue.channel}
            options={channelOptions}
            onChange={(nextChannel) =>
              updateValue({
                ...localValue,
                channel: nextChannel,
              })
            }
            disabled={disabled}
          />
        </div>

        <div>
          <FilterLabel>Campaign Type</FilterLabel>
          <SelectField
            value={localValue.campaignType}
            options={campaignTypeOptions}
            onChange={(nextCampaignType) =>
              updateValue({
                ...localValue,
                campaignType: nextCampaignType,
              })
            }
            disabled={disabled}
          />
        </div>

        <div>
          <FilterLabel>Lead Quality</FilterLabel>
          <SelectField
            value={localValue.leadQuality}
            options={leadQualityOptions}
            onChange={(nextLeadQuality) =>
              updateValue({
                ...localValue,
                leadQuality: nextLeadQuality,
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
          Featured Sources
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {featuredSources.map((source) => {
            const active = localValue.selectedSources.includes(source.value);

            return (
              <button
                key={source.value}
                type="button"
                onClick={() =>
                  updateValue({
                    ...localValue,
                    selectedSources: toggleArrayValue(
                      localValue.selectedSources,
                      source.value
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
                {source.label}
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
          Select Sources
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            minHeight: 44,
          }}
        >
          {filteredSourceOptions.length > 0 ? (
            filteredSourceOptions.map((source) => {
              const active = localValue.selectedSources.includes(source.value);

              return (
                <button
                  key={source.value}
                  type="button"
                  onClick={() =>
                    updateValue({
                      ...localValue,
                      selectedSources: toggleArrayValue(
                        localValue.selectedSources,
                        source.value
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
                  {source.label}
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
              No matching sources found.
            </div>
          )}
        </div>
      </div>

      {localValue.selectedSources.length > 0 ? (
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#6b7280",
              marginBottom: 8,
            }}
          >
            Selected Sources
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {localValue.selectedSources.map((sourceValue) => {
              const source = sourceOptions.find((item) => item.value === sourceValue);

              return (
                <div
                  key={sourceValue}
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
                  <span>{source?.label ?? sourceValue}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateValue({
                        ...localValue,
                        selectedSources: localValue.selectedSources.filter(
                          (item) => item !== sourceValue
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
                    aria-label={`Remove ${source?.label ?? sourceValue}`}
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
          label="Selected Channel"
          value={
            channelOptions.find((item) => item.value === localValue.channel)?.label ??
            "All Channels"
          }
          accent="#2563eb"
          background="#eff6ff"
          border="#dbeafe"
        />

        <MetricCard
          label="Lead Quality"
          value={
            leadQualityOptions.find(
              (item) => item.value === localValue.leadQuality
            )?.label ?? "All Lead Quality"
          }
          accent="#16a34a"
          background="#f0fdf4"
          border="#dcfce7"
        />

        <MetricCard
          label="Source Count"
          value={`${localValue.selectedSources.length}`}
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
          Apply Source Filter
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