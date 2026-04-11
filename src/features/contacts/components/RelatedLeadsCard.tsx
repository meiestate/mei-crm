type ThemeMode = "light" | "dark";

export type RelatedLeadItem = {
  id: string | number;
  name: string;
  phone?: string;
  email?: string;
  source?: string;
  stage?: string;
  budget?: string;
  propertyType?: string;
  location?: string;
  assignedTo?: string;
  updatedAt?: string;
};

type RelatedLeadsCardProps = {
  title?: string;
  mode?: ThemeMode;
  leads?: RelatedLeadItem[];
  loading?: boolean;
  onLeadClick?: (lead: RelatedLeadItem) => void;
  onViewAll?: () => void;
  onAddLead?: () => void;
};

function getStageColors(stage: string | undefined, mode: ThemeMode) {
  const value = (stage ?? "").toLowerCase();

  if (value.includes("new")) {
    return {
      bg: mode === "dark" ? "rgba(59,130,246,0.16)" : "rgba(59,130,246,0.10)",
      text: mode === "dark" ? "#93c5fd" : "#1d4ed8",
      border:
        mode === "dark" ? "rgba(59,130,246,0.28)" : "rgba(59,130,246,0.18)",
    };
  }

  if (value.includes("qualified")) {
    return {
      bg:
        mode === "dark" ? "rgba(16,185,129,0.16)" : "rgba(16,185,129,0.10)",
      text: mode === "dark" ? "#6ee7b7" : "#047857",
      border:
        mode === "dark" ? "rgba(16,185,129,0.28)" : "rgba(16,185,129,0.18)",
    };
  }

  if (value.includes("visit") || value.includes("site")) {
    return {
      bg:
        mode === "dark" ? "rgba(245,158,11,0.16)" : "rgba(245,158,11,0.10)",
      text: mode === "dark" ? "#fcd34d" : "#b45309",
      border:
        mode === "dark" ? "rgba(245,158,11,0.28)" : "rgba(245,158,11,0.18)",
    };
  }

  if (value.includes("negotiation")) {
    return {
      bg:
        mode === "dark" ? "rgba(168,85,247,0.16)" : "rgba(168,85,247,0.10)",
      text: mode === "dark" ? "#d8b4fe" : "#7e22ce",
      border:
        mode === "dark" ? "rgba(168,85,247,0.28)" : "rgba(168,85,247,0.18)",
    };
  }

  if (value.includes("won") || value.includes("closed")) {
    return {
      bg: mode === "dark" ? "rgba(34,197,94,0.16)" : "rgba(34,197,94,0.10)",
      text: mode === "dark" ? "#86efac" : "#15803d",
      border:
        mode === "dark" ? "rgba(34,197,94,0.28)" : "rgba(34,197,94,0.18)",
    };
  }

  return {
    bg: mode === "dark" ? "rgba(148,163,184,0.14)" : "rgba(148,163,184,0.10)",
    text: mode === "dark" ? "#cbd5e1" : "#475569",
    border:
      mode === "dark"
        ? "rgba(148,163,184,0.22)"
        : "rgba(148,163,184,0.18)",
  };
}

export default function RelatedLeadsCard({
  title = "Related Leads",
  mode = "light",
  leads = [],
  loading = false,
  onLeadClick,
  onViewAll,
  onAddLead,
}: RelatedLeadsCardProps) {
  const isDark = mode === "dark";

  const theme = {
    cardBg: isDark ? "#0f172a" : "#ffffff",
    cardSoft: isDark ? "#111827" : "#f8fafc",
    pageBg: isDark ? "#020617" : "#f8fafc",
    text: isDark ? "#e5e7eb" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    mutedText: isDark ? "#64748b" : "#94a3b8",
    border: isDark ? "rgba(148,163,184,0.16)" : "rgba(15,23,42,0.10)",
    borderStrong: isDark ? "rgba(148,163,184,0.22)" : "rgba(15,23,42,0.14)",
    primary: "#2563eb",
    shadow: isDark
      ? "0 20px 40px rgba(0,0,0,0.28)"
      : "0 16px 32px rgba(15,23,42,0.08)",
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
          padding: "20px 20px 16px",
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
            {title}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: theme.subText,
              lineHeight: 1.6,
            }}
          >
            Lead connections, pipeline visibility, and quick follow-up access.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {onViewAll ? (
            <button
              type="button"
              onClick={onViewAll}
              style={{
                height: 38,
                padding: "0 14px",
                borderRadius: 12,
                border: `1px solid ${theme.borderStrong}`,
                background: theme.cardSoft,
                color: theme.text,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View All
            </button>
          ) : null}

          {onAddLead ? (
            <button
              type="button"
              onClick={onAddLead}
              style={{
                height: 38,
                padding: "0 14px",
                borderRadius: 12,
                border: "none",
                background: theme.primary,
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Add Lead
            </button>
          ) : null}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {loading ? (
          <div style={{ display: "grid", gap: 12 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                style={{
                  borderRadius: 18,
                  border: `1px solid ${theme.border}`,
                  background: theme.cardSoft,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    width: "42%",
                    height: 14,
                    borderRadius: 999,
                    background: theme.borderStrong,
                    marginBottom: 12,
                  }}
                />
                <div
                  style={{
                    width: "68%",
                    height: 12,
                    borderRadius: 999,
                    background: theme.border,
                    marginBottom: 10,
                  }}
                />
                <div
                  style={{
                    width: "58%",
                    height: 12,
                    borderRadius: 999,
                    background: theme.border,
                  }}
                />
              </div>
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div
            style={{
              border: `1px dashed ${theme.borderStrong}`,
              background: theme.cardSoft,
              borderRadius: 20,
              padding: 28,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: theme.text,
                marginBottom: 8,
              }}
            >
              No related leads found
            </div>
            <div
              style={{
                fontSize: 13,
                lineHeight: 1.7,
                color: theme.subText,
                maxWidth: 420,
                margin: "0 auto",
              }}
            >
              Once leads are linked, they will appear here for quick tracking
              and action.
            </div>

            {onAddLead ? (
              <button
                type="button"
                onClick={onAddLead}
                style={{
                  marginTop: 16,
                  height: 40,
                  padding: "0 16px",
                  borderRadius: 12,
                  border: "none",
                  background: theme.primary,
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Create First Lead
              </button>
            ) : null}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {leads.map((lead) => {
              const stageTheme = getStageColors(lead.stage, mode);

              return (
                <button
                  key={String(lead.id)}
                  type="button"
                  onClick={() => onLeadClick?.(lead)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    borderRadius: 18,
                    border: `1px solid ${theme.border}`,
                    background: theme.cardSoft,
                    padding: 16,
                    cursor: onLeadClick ? "pointer" : "default",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: theme.text,
                          lineHeight: 1.4,
                          marginBottom: 4,
                        }}
                      >
                        {lead.name}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 10,
                          fontSize: 13,
                          color: theme.subText,
                          lineHeight: 1.6,
                        }}
                      >
                        {lead.phone ? <span>{lead.phone}</span> : null}
                        {lead.email ? <span>{lead.email}</span> : null}
                        {lead.source ? <span>Source: {lead.source}</span> : null}
                      </div>
                    </div>

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 30,
                        padding: "0 10px",
                        borderRadius: 999,
                        border: `1px solid ${stageTheme.border}`,
                        background: stageTheme.bg,
                        color: stageTheme.text,
                        fontSize: 12,
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lead.stage ?? "Unknown"}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: 12,
                      marginTop: 14,
                    }}
                  >
                    <InfoTile
                      label="Budget"
                      value={lead.budget || "—"}
                      theme={theme}
                    />
                    <InfoTile
                      label="Property Type"
                      value={lead.propertyType || "—"}
                      theme={theme}
                    />
                    <InfoTile
                      label="Location"
                      value={lead.location || "—"}
                      theme={theme}
                    />
                    <InfoTile
                      label="Assigned To"
                      value={lead.assignedTo || "—"}
                      theme={theme}
                    />
                  </div>

                  {lead.updatedAt ? (
                    <div
                      style={{
                        marginTop: 14,
                        paddingTop: 12,
                        borderTop: `1px dashed ${theme.border}`,
                        fontSize: 12,
                        color: theme.mutedText,
                      }}
                    >
                      Last updated: {lead.updatedAt}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

type InfoTileProps = {
  label: string;
  value: string;
  theme: {
    text: string;
    subText: string;
    pageBg: string;
    border: string;
  };
};

function InfoTile({ label, value, theme }: InfoTileProps) {
  return (
    <div
      style={{
        borderRadius: 14,
        border: `1px solid ${theme.border}`,
        background: theme.pageBg,
        padding: 12,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: theme.subText,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: theme.text,
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}