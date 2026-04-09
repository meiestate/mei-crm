import React, { useMemo, useState } from "react";

export type MatchingPropertyStatus =
  | "Available"
  | "Hot"
  | "Sold"
  | "Rented"
  | "Reserved";

export type MatchingPropertyType =
  | "Apartment"
  | "Villa"
  | "Plot"
  | "Independent House"
  | "Commercial"
  | "Office"
  | "Shop"
  | "Warehouse"
  | "Other";

export type MatchingPropertyItem = {
  id: string;
  title: string;
  project?: string;
  location: string;
  price: string;
  propertyType: MatchingPropertyType | string;
  status: MatchingPropertyStatus | string;
  bedrooms?: string;
  bathrooms?: string;
  area?: string;
  facing?: string;
  furnishing?: string;
  imageUrl?: string;
  matchScore?: number;
  description?: string;
  ownerName?: string;
  ownerPhone?: string;
  isShortlisted?: boolean;
};

type MatchingPropertiesCardProps = {
  properties: MatchingPropertyItem[];
  title?: string;
  subtitle?: string;
  maxItems?: number;
  onViewDetails?: (property: MatchingPropertyItem) => void;
  onCall?: (property: MatchingPropertyItem) => void;
  onWhatsApp?: (property: MatchingPropertyItem) => void;
  onShare?: (property: MatchingPropertyItem) => void;
  onShortlistChange?: (
    property: MatchingPropertyItem,
    shortlisted: boolean
  ) => void;
};

export default function MatchingPropertiesCard({
  properties,
  title = "Matching Properties",
  subtitle = "Curated properties that align with this lead’s interest, budget, and location pulse.",
  maxItems,
  onViewDetails,
  onCall,
  onWhatsApp,
  onShare,
  onShortlistChange,
}: MatchingPropertiesCardProps) {
  const visibleProperties = useMemo(() => {
    const list = [...properties].sort((a, b) => {
      const aScore = a.matchScore ?? 0;
      const bScore = b.matchScore ?? 0;
      return bScore - aScore;
    });

    return typeof maxItems === "number" ? list.slice(0, maxItems) : list;
  }, [properties, maxItems]);

  const [shortlistedMap, setShortlistedMap] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        properties.map((property) => [property.id, Boolean(property.isShortlisted)])
      )
  );

  const shortlistedCount = useMemo(
    () => Object.values(shortlistedMap).filter(Boolean).length,
    [shortlistedMap]
  );

  const avgMatchScore = useMemo(() => {
    if (!visibleProperties.length) return 0;
    const total = visibleProperties.reduce(
      (sum, property) => sum + clampNumber(property.matchScore ?? 0, 0, 100),
      0
    );
    return Math.round(total / visibleProperties.length);
  }, [visibleProperties]);

  const handleShortlistToggle = (property: MatchingPropertyItem) => {
    const nextValue = !shortlistedMap[property.id];

    setShortlistedMap((prev) => ({
      ...prev,
      [property.id]: nextValue,
    }));

    onShortlistChange?.(property, nextValue);
  };

  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 22,
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
          justifyContent: "space-between",
          alignItems: "flex-start",
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
              color: "#0f172a",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.6,
              maxWidth: 760,
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <StatPill label="Matches" value={String(visibleProperties.length)} />
          <StatPill label="Shortlisted" value={String(shortlistedCount)} />
          <StatPill label="Avg Match" value={`${avgMatchScore}%`} />
        </div>
      </div>

      {visibleProperties.length === 0 ? (
        <div
          style={{
            border: "1px dashed #cbd5e1",
            borderRadius: 18,
            background: "#f8fafc",
            padding: "30px 18px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 8,
            }}
          >
            No matching properties yet
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.6,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            Add more inventory, widen location criteria, or refine the lead’s budget
            and requirement details to surface better matches.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {visibleProperties.map((property) => {
            const shortlisted = shortlistedMap[property.id];
            const matchScore = clampNumber(property.matchScore ?? 0, 0, 100);
            const statusStyle = getStatusStyle(property.status);
            const scoreStyle = getMatchScoreStyle(matchScore);

            return (
              <article
                key={property.id}
                style={{
                  border: shortlisted
                    ? "1px solid #fde68a"
                    : "1px solid #e2e8f0",
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "#ffffff",
                  boxShadow: shortlisted
                    ? "0 12px 24px rgba(245, 158, 11, 0.10)"
                    : "0 8px 20px rgba(15, 23, 42, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: 180,
                    background:
                      property.imageUrl?.trim()
                        ? `url(${property.imageUrl}) center / cover no-repeat`
                        : "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
                    display: "flex",
                    alignItems: "stretch",
                    justifyContent: "space-between",
                    padding: 14,
                  }}
                >
                  {!property.imageUrl?.trim() ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#475569",
                        fontSize: 15,
                        fontWeight: 800,
                        letterSpacing: "0.02em",
                      }}
                    >
                      Property Preview
                    </div>
                  ) : null}

                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 800,
                        backdropFilter: "blur(8px)",
                        background: "rgba(255,255,255,0.92)",
                        color: "#0f172a",
                      }}
                    >
                      {property.propertyType}
                    </span>

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 800,
                        border: `1px solid ${statusStyle.border}`,
                        background: statusStyle.background,
                        color: statusStyle.color,
                      }}
                    >
                      {property.status}
                    </span>
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                    }}
                  >
                    <div
                      style={{
                        minWidth: 74,
                        borderRadius: 14,
                        padding: "10px 12px",
                        background: scoreStyle.background,
                        border: `1px solid ${scoreStyle.border}`,
                        color: scoreStyle.color,
                        textAlign: "center",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          opacity: 0.9,
                          marginBottom: 4,
                        }}
                      >
                        Match
                      </div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 900,
                          lineHeight: 1,
                        }}
                      >
                        {matchScore}%
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        color: "#0f172a",
                        lineHeight: 1.4,
                        marginBottom: 4,
                      }}
                    >
                      {property.title}
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        lineHeight: 1.6,
                      }}
                    >
                      {property.project?.trim()
                        ? `${property.project} • ${property.location}`
                        : property.location}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 10,
                    }}
                  >
                    <InfoBox label="Price" value={property.price} />
                    <InfoBox label="Area" value={property.area || "Not specified"} />
                    <InfoBox
                      label="Beds / Bath"
                      value={getBedsBathText(
                        property.bedrooms,
                        property.bathrooms
                      )}
                    />
                    <InfoBox
                      label="Facing"
                      value={property.facing || "Not specified"}
                    />
                  </div>

                  {property.description?.trim() ? (
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: "#475569",
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {truncateText(property.description.trim(), 160)}
                    </p>
                  ) : null}

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {property.furnishing ? (
                      <MetaPill label={property.furnishing} />
                    ) : null}
                    {property.ownerName ? (
                      <MetaPill label={`Owner: ${property.ownerName}`} />
                    ) : null}
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: 14,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => onViewDetails?.(property)}
                        style={primaryButtonStyle}
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShortlistToggle(property)}
                        style={{
                          ...secondaryButtonStyle,
                          border: shortlisted
                            ? "1px solid #fde68a"
                            : "1px solid #cbd5e1",
                          background: shortlisted ? "#fffbeb" : "#ffffff",
                          color: shortlisted ? "#a16207" : "#0f172a",
                        }}
                      >
                        {shortlisted ? "★ Shortlisted" : "☆ Shortlist"}
                      </button>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <MiniActionButton
                        label="Call"
                        onClick={() => onCall?.(property)}
                        disabled={!property.ownerPhone}
                      />
                      <MiniActionButton
                        label="WhatsApp"
                        onClick={() => onWhatsApp?.(property)}
                        disabled={!property.ownerPhone}
                      />
                      <MiniActionButton
                        label="Share"
                        onClick={() => onShare?.(property)}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function StatPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        minWidth: 82,
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        background: "#f8fafc",
        padding: "10px 12px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          color: "#0f172a",
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        background: "#f8fafc",
        borderRadius: 14,
        padding: "12px 12px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 14,
          color: "#0f172a",
          fontWeight: 800,
          lineHeight: 1.45,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MetaPill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 10px",
        borderRadius: 999,
        background: "#f1f5f9",
        color: "#475569",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

function MiniActionButton({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 34,
        padding: "0 12px",
        borderRadius: 10,
        border: "1px solid #cbd5e1",
        background: "#ffffff",
        color: "#0f172a",
        fontSize: 12,
        fontWeight: 700,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Available":
      return {
        background: "#ecfdf5",
        color: "#15803d",
        border: "#bbf7d0",
      };
    case "Hot":
      return {
        background: "#fff7ed",
        color: "#c2410c",
        border: "#fdba74",
      };
    case "Sold":
      return {
        background: "#fef2f2",
        color: "#b91c1c",
        border: "#fecaca",
      };
    case "Rented":
      return {
        background: "#eff6ff",
        color: "#1d4ed8",
        border: "#bfdbfe",
      };
    case "Reserved":
      return {
        background: "#fffbeb",
        color: "#a16207",
        border: "#fde68a",
      };
    default:
      return {
        background: "#f8fafc",
        color: "#475569",
        border: "#cbd5e1",
      };
  }
}

function getMatchScoreStyle(score: number) {
  if (score >= 85) {
    return {
      background: "rgba(236, 253, 245, 0.92)",
      color: "#166534",
      border: "#86efac",
    };
  }

  if (score >= 65) {
    return {
      background: "rgba(255, 251, 235, 0.94)",
      color: "#a16207",
      border: "#fde68a",
    };
  }

  return {
    background: "rgba(254, 242, 242, 0.94)",
    color: "#b91c1c",
    border: "#fecaca",
  };
}

function getBedsBathText(bedrooms?: string, bathrooms?: string) {
  if (bedrooms && bathrooms) return `${bedrooms} Bed • ${bathrooms} Bath`;
  if (bedrooms) return `${bedrooms} Bed`;
  if (bathrooms) return `${bathrooms} Bath`;
  return "Not specified";
}

function truncateText(text: string, limit: number) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}...`;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const primaryButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 12,
  border: "none",
  background: "#0f172a",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};