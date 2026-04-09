import React from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type ContactFilterValues = {
  search: string;
  status: string;
  source: string;
  city: string;
  sortBy: string;
};

type ContactFiltersProps = {
  mode: ThemeMode;
  values: ContactFilterValues;
  onChange: (next: ContactFilterValues) => void;
  onClear: () => void;
  totalCount?: number;
  filteredCount?: number;
  statusOptions?: string[];
  sourceOptions?: string[];
  cityOptions?: string[];
};

export default function ContactFilters({
  mode,
  values,
  onChange,
  onClear,
  totalCount = 0,
  filteredCount = 0,
  statusOptions = ["Active", "New", "Prospect", "Customer", "Inactive"],
  sourceOptions = [
    "Website",
    "Facebook",
    "Instagram",
    "WhatsApp",
    "Referral",
    "Cold Call",
    "Walk-In",
    "Campaign",
  ],
  cityOptions = [],
}: ContactFiltersProps) {
  const theme = getTheme(mode);

  const hasActiveFilters =
    values.search.trim() !== "" ||
    values.status !== "" ||
    values.source !== "" ||
    values.city !== "" ||
    values.sortBy !== "newest";

  const updateField = (field: keyof ContactFilterValues, value: string) => {
    onChange({
      ...values,
      [field]: value,
    });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 42,
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.inputBg,
    color: theme.text,
    padding: "0 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 8,
    fontSize: 12,
    fontWeight: 700,
    color: theme.subText,
    letterSpacing: 0.3,
  };

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px 20px",
          borderBottom: `1px solid ${theme.border}`,
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
              fontWeight: 800,
              color: theme.text,
            }}
          >
            Contact Filters
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: theme.subText,
            }}
          >
            Search, segment, and sort your contact database with precision.
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
              padding: "8px 12px",
              borderRadius: 999,
              background: theme.cardBgSoft,
              border: `1px solid ${theme.border}`,
              color: theme.text,
              fontSize: 12,
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            {filteredCount} / {totalCount} Results
          </span>

          <button
            onClick={onClear}
            disabled={!hasActiveFilters}
            style={{
              height: 40,
              padding: "0 14px",
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
              background: hasActiveFilters ? theme.cardBgSoft : theme.sectionBg,
              color: hasActiveFilters ? theme.text : theme.subText,
              fontSize: 13,
              fontWeight: 700,
              cursor: hasActiveFilters ? "pointer" : "not-allowed",
              opacity: hasActiveFilters ? 1 : 0.65,
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div
        style={{
          padding: 20,
          display: "grid",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 2fr) repeat(4, minmax(160px, 1fr))",
            gap: 16,
          }}
        >
          <div>
            <label style={labelStyle}>Search</label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 14,
                  color: theme.subText,
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
              <input
                value={values.search}
                onChange={(e) => updateField("search", e.target.value)}
                placeholder="Search name, email, phone, company..."
                style={{
                  ...inputStyle,
                  paddingLeft: 38,
                }}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={values.status}
              onChange={(e) => updateField("status", e.target.value)}
              style={inputStyle}
            >
              <option value="">All Statuses</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Source</label>
            <select
              value={values.source}
              onChange={(e) => updateField("source", e.target.value)}
              style={inputStyle}
            >
              <option value="">All Sources</option>
              {sourceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>City</label>
            <select
              value={values.city}
              onChange={(e) => updateField("city", e.target.value)}
              style={inputStyle}
            >
              <option value="">All Cities</option>
              {cityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Sort By</label>
            <select
              value={values.sortBy}
              onChange={(e) => updateField("sortBy", e.target.value)}
              style={inputStyle}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
              <option value="company_asc">Company A-Z</option>
              <option value="company_desc">Company Z-A</option>
            </select>
          </div>
        </div>

        {hasActiveFilters ? (
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
                fontSize: 12,
                fontWeight: 800,
                color: theme.subText,
                letterSpacing: 0.3,
              }}
            >
              ACTIVE FILTERS
            </span>

            {values.search.trim() ? (
              <FilterChip
                label={`Search: ${values.search}`}
                mode={mode}
                onRemove={() => updateField("search", "")}
              />
            ) : null}

            {values.status ? (
              <FilterChip
                label={`Status: ${values.status}`}
                mode={mode}
                onRemove={() => updateField("status", "")}
              />
            ) : null}

            {values.source ? (
              <FilterChip
                label={`Source: ${values.source}`}
                mode={mode}
                onRemove={() => updateField("source", "")}
              />
            ) : null}

            {values.city ? (
              <FilterChip
                label={`City: ${values.city}`}
                mode={mode}
                onRemove={() => updateField("city", "")}
              />
            ) : null}

            {values.sortBy !== "newest" ? (
              <FilterChip
                label={`Sort: ${getSortLabel(values.sortBy)}`}
                mode={mode}
                onRemove={() => updateField("sortBy", "newest")}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

type FilterChipProps = {
  label: string;
  mode: ThemeMode;
  onRemove: () => void;
};

function FilterChip({ label, mode, onRemove }: FilterChipProps) {
  const theme = getTheme(mode);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 999,
        background: theme.cardBgSoft,
        border: `1px solid ${theme.border}`,
        color: theme.text,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{
          border: "none",
          background: "transparent",
          color: theme.subText,
          cursor: "pointer",
          fontSize: 12,
          padding: 0,
          lineHeight: 1,
          fontWeight: 800,
        }}
        aria-label={`Remove ${label}`}
        title={`Remove ${label}`}
      >
        ✕
      </button>
    </span>
  );
}

function getSortLabel(sortBy: string) {
  switch (sortBy) {
    case "newest":
      return "Newest First";
    case "oldest":
      return "Oldest First";
    case "name_asc":
      return "Name A-Z";
    case "name_desc":
      return "Name Z-A";
    case "company_asc":
      return "Company A-Z";
    case "company_desc":
      return "Company Z-A";
    default:
      return sortBy;
  }
}