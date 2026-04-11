type ThemeMode = "light" | "dark";

export type ContactFilterValues = {
  search: string;
  status: string;
  source: string;
  owner: string;
};

type ContactFiltersProps = {
  mode?: ThemeMode;
  values: ContactFilterValues;
  statusOptions?: string[];
  sourceOptions?: string[];
  ownerOptions?: string[];
  onChange: (next: ContactFilterValues) => void;
  onClear?: () => void;
  resultCount?: number;
};

export default function ContactFilters({
  mode = "light",
  values,
  statusOptions = ["all", "active", "inactive", "blocked", "archived"],
  sourceOptions = [
    "all",
    "website",
    "referral",
    "facebook",
    "instagram",
    "whatsapp",
    "call",
    "manual",
    "other",
  ],
  ownerOptions = ["all"],
  onChange,
  onClear,
  resultCount,
}: ContactFiltersProps) {
  const isDark = mode === "dark";

  const theme = {
    cardBg: isDark ? "#0f172a" : "#ffffff",
    cardSoft: isDark ? "#111827" : "#f8fafc",
    text: isDark ? "#e5e7eb" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "rgba(148,163,184,0.16)" : "rgba(15,23,42,0.10)",
    borderStrong: isDark ? "rgba(148,163,184,0.22)" : "rgba(15,23,42,0.14)",
    inputBg: isDark ? "#111827" : "#ffffff",
    inputBorder: isDark ? "rgba(148,163,184,0.20)" : "rgba(15,23,42,0.12)",
    primary: "#2563eb",
    primarySoft: isDark ? "rgba(37,99,235,0.16)" : "rgba(37,99,235,0.10)",
    shadow: isDark
      ? "0 20px 40px rgba(0,0,0,0.28)"
      : "0 16px 32px rgba(15,23,42,0.08)",
  };

  const hasActiveFilters =
    values.search.trim() !== "" ||
    values.status !== "all" ||
    values.source !== "all" ||
    values.owner !== "all";

  const update = <K extends keyof ContactFilterValues>(
    key: K,
    value: ContactFilterValues[K],
  ) => {
    onChange({
      ...values,
      [key]: value,
    });
  };

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        boxShadow: theme.shadow,
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
              fontSize: 20,
              fontWeight: 800,
              color: theme.text,
              letterSpacing: "-0.02em",
            }}
          >
            Contact Filters
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: theme.subText,
              lineHeight: 1.6,
            }}
          >
            Search and narrow contacts by status, source, and ownership.
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
          {typeof resultCount === "number" ? (
            <div
              style={{
                height: 36,
                display: "inline-flex",
                alignItems: "center",
                padding: "0 12px",
                borderRadius: 999,
                background: theme.primarySoft,
                color: theme.primary,
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {resultCount} result{resultCount === 1 ? "" : "s"}
            </div>
          ) : null}

          {onClear ? (
            <button
              type="button"
              onClick={onClear}
              disabled={!hasActiveFilters}
              style={{
                height: 38,
                padding: "0 14px",
                borderRadius: 12,
                border: `1px solid ${theme.borderStrong}`,
                background: theme.cardSoft,
                color: hasActiveFilters ? theme.text : theme.subText,
                fontSize: 13,
                fontWeight: 700,
                cursor: hasActiveFilters ? "pointer" : "not-allowed",
                opacity: hasActiveFilters ? 1 : 0.7,
              }}
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      </div>

      <div
        style={{
          padding: 20,
          display: "grid",
          gridTemplateColumns: "minmax(240px, 2fr) repeat(3, minmax(160px, 1fr))",
          gap: 14,
        }}
      >
        <FilterField label="Search" theme={theme}>
          <input
            type="text"
            value={values.search}
            onChange={(event) => update("search", event.target.value)}
            placeholder="Search name, email, phone, company..."
            style={getInputStyle(theme)}
          />
        </FilterField>

        <FilterField label="Status" theme={theme}>
          <select
            value={values.status}
            onChange={(event) => update("status", event.target.value)}
            style={getInputStyle(theme)}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {formatOption(option)}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Source" theme={theme}>
          <select
            value={values.source}
            onChange={(event) => update("source", event.target.value)}
            style={getInputStyle(theme)}
          >
            {sourceOptions.map((option) => (
              <option key={option} value={option}>
                {formatOption(option)}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Owner" theme={theme}>
          <select
            value={values.owner}
            onChange={(event) => update("owner", event.target.value)}
            style={getInputStyle(theme)}
          >
            {ownerOptions.map((option) => (
              <option key={option} value={option}>
                {formatOption(option)}
              </option>
            ))}
          </select>
        </FilterField>
      </div>

      {hasActiveFilters ? (
        <div
          style={{
            padding: "0 20px 20px",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {values.search.trim() ? (
            <FilterChip
              label={`Search: ${values.search}`}
              onRemove={() => update("search", "")}
              theme={theme}
            />
          ) : null}

          {values.status !== "all" ? (
            <FilterChip
              label={`Status: ${formatOption(values.status)}`}
              onRemove={() => update("status", "all")}
              theme={theme}
            />
          ) : null}

          {values.source !== "all" ? (
            <FilterChip
              label={`Source: ${formatOption(values.source)}`}
              onRemove={() => update("source", "all")}
              theme={theme}
            />
          ) : null}

          {values.owner !== "all" ? (
            <FilterChip
              label={`Owner: ${formatOption(values.owner)}`}
              onRemove={() => update("owner", "all")}
              theme={theme}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function FilterField({
  label,
  children,
  theme,
}: {
  label: string;
  children: React.ReactNode;
  theme: {
    text: string;
    subText: string;
  };
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontSize: 12,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: theme.subText,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
  theme,
}: {
  label: string;
  onRemove: () => void;
  theme: {
    primary: string;
    primarySoft: string;
  };
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      style={{
        height: 32,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "0 12px",
        borderRadius: 999,
        border: "none",
        background: theme.primarySoft,
        color: theme.primary,
        fontSize: 12,
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      <span>{label}</span>
      <span>×</span>
    </button>
  );
}

function formatOption(value: string) {
  if (!value) {
    return "—";
  }

  if (value.toLowerCase() === "all") {
    return "All";
  }

  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInputStyle(theme: {
  inputBg: string;
  inputBorder: string;
  text: string;
}): React.CSSProperties {
  return {
    width: "100%",
    height: 44,
    borderRadius: 14,
    border: `1px solid ${theme.inputBorder}`,
    background: theme.inputBg,
    color: theme.text,
    padding: "0 14px",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  };
}