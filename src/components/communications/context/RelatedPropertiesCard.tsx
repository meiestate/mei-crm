import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  Building2,
  ChevronRight,
  ExternalLink,
  Filter,
  Home,
  IndianRupee,
  Landmark,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type PropertyStatus =
  | "Available"
  | "Reserved"
  | "Sold"
  | "Rented"
  | "Blocked"
  | "Inactive";

type PropertyType =
  | "Apartment"
  | "Villa"
  | "Plot"
  | "Office"
  | "Retail"
  | "Warehouse";

export interface RelatedPropertyRecord {
  id: string;
  title: string;
  code?: string;
  type: PropertyType;
  status: PropertyStatus;
  projectName?: string;
  location: string;
  city?: string;
  price?: number;
  rentAmount?: number;
  areaSqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: "Unfurnished" | "Semi Furnished" | "Fully Furnished";
  listingSource?: string;
  ownerName?: string;
  lastActivityAt?: string;
  matchScore?: number;
  tags?: string[];
  thumbnailUrl?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  route?: string;
}

export interface RelatedPropertiesCardProps {
  properties?: RelatedPropertyRecord[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  className?: string;
  maxVisibleItems?: number;
  onViewAll?: () => void;
  onPropertyClick?: (property: RelatedPropertyRecord) => void;
  onOpenProperty?: (property: RelatedPropertyRecord) => void;
  onShortlistProperty?: (property: RelatedPropertyRecord) => void;
  onShareProperty?: (property: RelatedPropertyRecord) => void;
  showHeaderActions?: boolean;
  compact?: boolean;
}

const cardStyle: CSSProperties = {
  background: "var(--color-surface, #ffffff)",
  border: "1px solid var(--color-border, #e5e7eb)",
  borderRadius: 20,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

const headerStyle: CSSProperties = {
  padding: "18px 18px 14px 18px",
  borderBottom: "1px solid var(--color-border-soft, #eef2f7)",
  background:
    "linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,1) 100%)",
};

const titleRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 14,
};

const titleWrapStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
  minWidth: 0,
};

const iconWrapStyle: CSSProperties = {
  width: 42,
  height: 42,
  minWidth: 42,
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  background:
    "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(14,165,233,0.12))",
  color: "var(--color-primary, #2563eb)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 700,
  color: "var(--color-text, #0f172a)",
  letterSpacing: "-0.02em",
};

const subtitleStyle: CSSProperties = {
  margin: "4px 0 0 0",
  fontSize: 12.5,
  lineHeight: 1.5,
  color: "var(--color-text-muted, #64748b)",
};

const controlsRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.4fr 0.8fr 0.8fr",
  gap: 10,
};

const inputWrapStyle: CSSProperties = {
  position: "relative",
};

const inputBaseStyle: CSSProperties = {
  width: "100%",
  height: 40,
  borderRadius: 12,
  border: "1px solid var(--color-border, #e2e8f0)",
  background: "var(--color-input-bg, #ffffff)",
  color: "var(--color-text, #0f172a)",
  outline: "none",
  fontSize: 13,
  padding: "0 12px 0 38px",
  boxSizing: "border-box",
};

const selectBaseStyle: CSSProperties = {
  width: "100%",
  height: 40,
  borderRadius: 12,
  border: "1px solid var(--color-border, #e2e8f0)",
  background: "var(--color-input-bg, #ffffff)",
  color: "var(--color-text, #0f172a)",
  outline: "none",
  fontSize: 13,
  padding: "0 12px",
  boxSizing: "border-box",
};

const contentStyle: CSSProperties = {
  padding: 18,
};

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 10,
  marginBottom: 16,
};

const statCardStyle: CSSProperties = {
  border: "1px solid var(--color-border-soft, #eef2f7)",
  borderRadius: 14,
  background: "var(--color-surface-soft, #f8fafc)",
  padding: "12px 12px 10px",
};

const listStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const propertyCardStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "116px minmax(0, 1fr)",
  gap: 14,
  padding: 14,
  borderRadius: 16,
  border: "1px solid var(--color-border-soft, #eef2f7)",
  background: "var(--color-surface, #ffffff)",
  transition: "all 0.2s ease",
};

const thumbnailStyle: CSSProperties = {
  width: "100%",
  height: 108,
  borderRadius: 14,
  overflow: "hidden",
  border: "1px solid var(--color-border-soft, #eef2f7)",
  background:
    "linear-gradient(135deg, rgba(226,232,240,0.75), rgba(241,245,249,1))",
  display: "grid",
  placeItems: "center",
};

const propertyTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 10,
};

const propertyTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 14.5,
  fontWeight: 700,
  color: "var(--color-text, #0f172a)",
  lineHeight: 1.35,
};

const propertyMetaStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 6,
};

const chipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: 28,
  padding: "0 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  border: "1px solid var(--color-border-soft, #e2e8f0)",
  color: "var(--color-text-soft, #334155)",
  background: "var(--color-surface-soft, #f8fafc)",
};

const dimTextStyle: CSSProperties = {
  fontSize: 12.5,
  color: "var(--color-text-muted, #64748b)",
  lineHeight: 1.5,
};

const valueTextStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "var(--color-text, #0f172a)",
};

const dividerStyle: CSSProperties = {
  height: 1,
  background: "var(--color-border-soft, #eef2f7)",
  margin: "12px 0",
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 12,
};

const buttonBaseStyle: CSSProperties = {
  height: 34,
  padding: "0 12px",
  borderRadius: 10,
  border: "1px solid var(--color-border, #dbe2ea)",
  background: "var(--color-surface, #ffffff)",
  color: "var(--color-text, #0f172a)",
  fontSize: 12.5,
  fontWeight: 600,
  cursor: "pointer",
};

const primaryButtonStyle: CSSProperties = {
  ...buttonBaseStyle,
  background: "var(--color-primary, #2563eb)",
  border: "1px solid var(--color-primary, #2563eb)",
  color: "#ffffff",
};

const footerStyle: CSSProperties = {
  padding: "0 18px 18px 18px",
};

const footerButtonStyle: CSSProperties = {
  width: "100%",
  height: 42,
  borderRadius: 12,
  border: "1px solid var(--color-border, #e2e8f0)",
  background: "var(--color-surface-soft, #f8fafc)",
  color: "var(--color-text, #0f172a)",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const skeletonStyle: CSSProperties = {
  height: 112,
  borderRadius: 16,
  background:
    "linear-gradient(90deg, rgba(241,245,249,1) 25%, rgba(226,232,240,0.8) 37%, rgba(241,245,249,1) 63%)",
  backgroundSize: "400% 100%",
  animation: "relatedPropertiesPulse 1.4s ease infinite",
};

function formatCurrency(value?: number) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value?: number) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusColors(status: PropertyStatus): CSSProperties {
  switch (status) {
    case "Available":
      return {
        color: "#166534",
        background: "#dcfce7",
        border: "1px solid #bbf7d0",
      };
    case "Reserved":
      return {
        color: "#92400e",
        background: "#fef3c7",
        border: "1px solid #fde68a",
      };
    case "Sold":
      return {
        color: "#1d4ed8",
        background: "#dbeafe",
        border: "1px solid #bfdbfe",
      };
    case "Rented":
      return {
        color: "#7c3aed",
        background: "#ede9fe",
        border: "1px solid #ddd6fe",
      };
    case "Blocked":
      return {
        color: "#b45309",
        background: "#ffedd5",
        border: "1px solid #fed7aa",
      };
    case "Inactive":
    default:
      return {
        color: "#475569",
        background: "#f1f5f9",
        border: "1px solid #e2e8f0",
      };
  }
}

function getMatchTone(score?: number): CSSProperties {
  if ((score ?? 0) >= 85) {
    return {
      color: "#166534",
      background: "#dcfce7",
      border: "1px solid #bbf7d0",
    };
  }
  if ((score ?? 0) >= 70) {
    return {
      color: "#1d4ed8",
      background: "#dbeafe",
      border: "1px solid #bfdbfe",
    };
  }
  if ((score ?? 0) >= 50) {
    return {
      color: "#92400e",
      background: "#fef3c7",
      border: "1px solid #fde68a",
    };
  }
  return {
    color: "#64748b",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  };
}

function sortProperties(
  properties: RelatedPropertyRecord[],
  sortBy: string,
): RelatedPropertyRecord[] {
  const cloned = [...properties];

  switch (sortBy) {
    case "price-desc":
      return cloned.sort(
        (a, b) =>
          (b.price ?? b.rentAmount ?? 0) - (a.price ?? a.rentAmount ?? 0),
      );
    case "price-asc":
      return cloned.sort(
        (a, b) =>
          (a.price ?? a.rentAmount ?? 0) - (b.price ?? b.rentAmount ?? 0),
      );
    case "match-desc":
      return cloned.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    case "recent":
      return cloned.sort(
        (a, b) =>
          new Date(b.lastActivityAt ?? 0).getTime() -
          new Date(a.lastActivityAt ?? 0).getTime(),
      );
    case "area-desc":
      return cloned.sort((a, b) => (b.areaSqft ?? 0) - (a.areaSqft ?? 0));
    case "name":
    default:
      return cloned.sort((a, b) => a.title.localeCompare(b.title));
  }
}

function PropertyImagePlaceholder() {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        width: "100%",
        height: "100%",
        color: "#64748b",
      }}
    >
      <Building2 size={24} />
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div style={statCardStyle}>
      <div
        style={{
          fontSize: 12,
          color: "var(--color-text-muted, #64748b)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "var(--color-text, #0f172a)",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      {hint ? (
        <div
          style={{
            marginTop: 4,
            fontSize: 11.5,
            color: "var(--color-text-muted, #64748b)",
          }}
        >
          {hint}
        </div>
      ) : null}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        border: "1px dashed var(--color-border, #dbe2ea)",
        borderRadius: 18,
        padding: "28px 18px",
        textAlign: "center",
        background: "var(--color-surface-soft, #f8fafc)",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          margin: "0 auto 12px",
          borderRadius: 16,
          display: "grid",
          placeItems: "center",
          background: "rgba(37,99,235,0.08)",
          color: "var(--color-primary, #2563eb)",
        }}
      >
        <Home size={24} />
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "var(--color-text, #0f172a)",
          marginBottom: 6,
        }}
      >
        No related properties found
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--color-text-muted, #64748b)",
          maxWidth: 420,
          margin: "0 auto",
          lineHeight: 1.6,
        }}
      >
        Try changing the search keyword or filter. Once linked properties are
        available, they will appear here with pricing, status, and quick actions.
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <style>
        {`
          @keyframes relatedPropertiesPulse {
            0% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
          }
        `}
      </style>
      <div style={skeletonStyle} />
      <div style={skeletonStyle} />
      <div style={skeletonStyle} />
    </div>
  );
}

export default function RelatedPropertiesCard({
  properties = [],
  title = "Related Properties",
  subtitle = "Linked inventory, matched units, and recommended properties connected to this record.",
  loading = false,
  className,
  maxVisibleItems = 5,
  onViewAll,
  onPropertyClick,
  onOpenProperty,
  onShortlistProperty,
  onShareProperty,
  showHeaderActions = true,
  compact = false,
}: RelatedPropertiesCardProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | PropertyStatus>("All");
  const [sortBy, setSortBy] = useState("match-desc");

  const filteredProperties = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = properties.filter((property) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          property.title,
          property.code,
          property.projectName,
          property.location,
          property.city,
          property.ownerName,
          property.type,
          property.listingSource,
          ...(property.tags ?? []),
        ]
          .filter(Boolean)
          .some((item) =>
            String(item).toLowerCase().includes(normalizedQuery),
          );

      const matchesStatus =
        statusFilter === "All" ? true : property.status === statusFilter;

      return matchesQuery && matchesStatus;
    });

    return sortProperties(filtered, sortBy);
  }, [properties, query, statusFilter, sortBy]);

  const visibleProperties = filteredProperties.slice(
    0,
    compact ? Math.min(maxVisibleItems, 3) : maxVisibleItems,
  );

  const totalValue = useMemo(() => {
    return filteredProperties.reduce(
      (sum, item) => sum + (item.price ?? item.rentAmount ?? 0),
      0,
    );
  }, [filteredProperties]);

  const availableCount = useMemo(
    () => filteredProperties.filter((item) => item.status === "Available").length,
    [filteredProperties],
  );

  const verifiedCount = useMemo(
    () => filteredProperties.filter((item) => item.isVerified).length,
    [filteredProperties],
  );

  const avgMatchScore = useMemo(() => {
    const scored = filteredProperties.filter(
      (item) => typeof item.matchScore === "number",
    );
    if (!scored.length) return 0;

    return Math.round(
      scored.reduce((sum, item) => sum + (item.matchScore ?? 0), 0) /
        scored.length,
    );
  }, [filteredProperties]);

  return (
    <section style={cardStyle} className={className}>
      <div style={headerStyle}>
        <div style={titleRowStyle}>
          <div style={titleWrapStyle}>
            <div style={iconWrapStyle}>
              <Building2 size={20} />
            </div>

            <div style={{ minWidth: 0 }}>
              <h3 style={titleStyle}>{title}</h3>
              <p style={subtitleStyle}>{subtitle}</p>
            </div>
          </div>

          {showHeaderActions ? (
            <div
              style={{
                ...chipStyle,
                whiteSpace: "nowrap",
                background: "rgba(37,99,235,0.06)",
                border: "1px solid rgba(37,99,235,0.14)",
                color: "var(--color-primary, #2563eb)",
              }}
            >
              <Sparkles size={14} />
              {properties.length} linked
            </div>
          ) : null}
        </div>

        <div style={controlsRowStyle}>
          <div style={inputWrapStyle}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
                pointerEvents: "none",
              }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, project, code, city..."
              style={inputBaseStyle}
            />
          </div>

          <div style={inputWrapStyle}>
            <Filter
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
                pointerEvents: "none",
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "All" | PropertyStatus)
              }
              style={{ ...selectBaseStyle, paddingLeft: 38 }}
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
              <option value="Rented">Rented</option>
              <option value="Blocked">Blocked</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={selectBaseStyle}
          >
            <option value="match-desc">Best Match</option>
            <option value="recent">Recent Activity</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="area-desc">Area: Largest</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div style={contentStyle}>
        {!compact ? (
          <div style={statsGridStyle}>
            <StatCard label="Visible Properties" value={filteredProperties.length} />
            <StatCard label="Available Now" value={availableCount} />
            <StatCard label="Verified" value={verifiedCount} />
            <StatCard
              label="Portfolio Value"
              value={formatCompactCurrency(totalValue)}
              hint={avgMatchScore > 0 ? `Avg match ${avgMatchScore}%` : undefined}
            />
          </div>
        ) : null}

        {loading ? (
          <LoadingState />
        ) : visibleProperties.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={listStyle}>
            {visibleProperties.map((property) => {
              const amount = property.price ?? property.rentAmount;
              const amountLabel = property.price
                ? "Sale Price"
                : property.rentAmount
                ? "Rent"
                : "Value";

              return (
                <article
                  key={property.id}
                  style={propertyCardStyle}
                  onClick={() => onPropertyClick?.(property)}
                >
                  <div style={thumbnailStyle}>
                    {property.thumbnailUrl ? (
                      <img
                        src={property.thumbnailUrl}
                        alt={property.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <PropertyImagePlaceholder />
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={propertyTopRowStyle}>
                      <div style={{ minWidth: 0 }}>
                        <h4 style={propertyTitleStyle}>{property.title}</h4>

                        <div style={propertyMetaStyle}>
                          <span
                            style={{
                              ...chipStyle,
                              ...getStatusColors(property.status),
                            }}
                          >
                            {property.status}
                          </span>

                          <span style={chipStyle}>{property.type}</span>

                          {typeof property.matchScore === "number" ? (
                            <span
                              style={{
                                ...chipStyle,
                                ...getMatchTone(property.matchScore),
                              }}
                            >
                              Match {property.matchScore}%
                            </span>
                          ) : null}

                          {property.isVerified ? (
                            <span
                              style={{
                                ...chipStyle,
                                color: "#166534",
                                background: "#ecfdf5",
                                border: "1px solid #bbf7d0",
                              }}
                            >
                              <ShieldCheck size={13} />
                              Verified
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {(property.route || onOpenProperty) && (
                        <button
                          type="button"
                          style={buttonBaseStyle}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProperty?.(property);

                            if (!onOpenProperty && property.route) {
                              window.location.href = property.route;
                            }
                          }}
                        >
                          Open
                        </button>
                      )}
                    </div>

                    <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                      <div style={dimTextStyle}>
                        <MapPin
                          size={13}
                          style={{
                            verticalAlign: "text-bottom",
                            marginRight: 6,
                          }}
                        />
                        {property.location}
                        {property.city ? `, ${property.city}` : ""}
                      </div>

                      {property.projectName ? (
                        <div style={dimTextStyle}>
                          <Landmark
                            size={13}
                            style={{
                              verticalAlign: "text-bottom",
                              marginRight: 6,
                            }}
                          />
                          {property.projectName}
                          {property.code ? ` • ${property.code}` : ""}
                        </div>
                      ) : property.code ? (
                        <div style={dimTextStyle}>Code: {property.code}</div>
                      ) : null}

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                          gap: 10,
                          marginTop: 2,
                        }}
                      >
                        <div>
                          <div style={dimTextStyle}>{amountLabel}</div>
                          <div style={valueTextStyle}>
                            <IndianRupee
                              size={13}
                              style={{
                                verticalAlign: "text-bottom",
                                marginRight: 2,
                              }}
                            />
                            {formatCurrency(amount).replace("₹", "")}
                          </div>
                        </div>

                        <div>
                          <div style={dimTextStyle}>Area</div>
                          <div style={valueTextStyle}>
                            {property.areaSqft ? `${property.areaSqft} sqft` : "—"}
                          </div>
                        </div>

                        <div>
                          <div style={dimTextStyle}>Beds/Baths</div>
                          <div style={valueTextStyle}>
                            {property.bedrooms ?? "—"} / {property.bathrooms ?? "—"}
                          </div>
                        </div>

                        <div>
                          <div style={dimTextStyle}>Updated</div>
                          <div style={valueTextStyle}>
                            {formatDate(property.lastActivityAt)}
                          </div>
                        </div>
                      </div>

                      {(property.ownerName ||
                        property.listingSource ||
                        property.tags?.length) && (
                        <>
                          <div style={dividerStyle} />
                          <div style={{ display: "grid", gap: 8 }}>
                            {property.ownerName ? (
                              <div style={dimTextStyle}>
                                Owner: {property.ownerName}
                              </div>
                            ) : null}

                            {property.listingSource ? (
                              <div style={dimTextStyle}>
                                Source: {property.listingSource}
                              </div>
                            ) : null}

                            {property.tags?.length ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 8,
                                }}
                              >
                                {property.tags.slice(0, 4).map((tag) => (
                                  <span key={tag} style={chipStyle}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </>
                      )}
                    </div>

                    <div style={actionRowStyle}>
                      <button
                        type="button"
                        style={primaryButtonStyle}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPropertyClick?.(property);
                        }}
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        style={buttonBaseStyle}
                        onClick={(e) => {
                          e.stopPropagation();
                          onShortlistProperty?.(property);
                        }}
                      >
                        Shortlist
                      </button>

                      <button
                        type="button"
                        style={buttonBaseStyle}
                        onClick={(e) => {
                          e.stopPropagation();
                          onShareProperty?.(property);
                        }}
                      >
                        Share
                      </button>

                      {property.route ? (
                        <button
                          type="button"
                          style={buttonBaseStyle}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              property.route,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                        >
                          <ExternalLink
                            size={14}
                            style={{
                              marginRight: 6,
                              verticalAlign: "middle",
                            }}
                          />
                          New Tab
                        </button>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {filteredProperties.length > visibleProperties.length ? (
        <div style={footerStyle}>
          <button type="button" style={footerButtonStyle} onClick={onViewAll}>
            View All Properties ({filteredProperties.length})
            <ChevronRight
              size={16}
              style={{ marginLeft: 8, verticalAlign: "middle" }}
            />
          </button>
        </div>
      ) : null}
    </section>
  );
}