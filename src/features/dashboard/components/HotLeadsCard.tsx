// src/features/dashboard/components/HotLeadsCard.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { DashboardRecentLeadItem } from "../api/dashboardApi";

type HotLeadsCardProps = {
  leads?: DashboardRecentLeadItem[];
  mode?: ThemeMode;
  loading?: boolean;
  title?: string;
  onViewAll?: () => void;
  onLeadClick?: (lead: DashboardRecentLeadItem) => void;
};

function formatCurrency(value?: number): string {
  const amount = typeof value === "number" && Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value?: string): string {
  if (!value) return "No follow-up date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No follow-up date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getLeadStatusTone(status?: string) {
  const value = (status ?? "").toLowerCase();

  if (value === "hot") {
    return {
      label: "Hot",
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#dc2626",
      border: "rgba(239, 68, 68, 0.22)",
    };
  }

  if (value === "warm") {
    return {
      label: "Warm",
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#d97706",
      border: "rgba(245, 158, 11, 0.22)",
    };
  }

  if (value === "cold") {
    return {
      label: "Cold",
      bg: "rgba(59, 130, 246, 0.12)",
      color: "#2563eb",
      border: "rgba(59, 130, 246, 0.22)",
    };
  }

  if (value === "new") {
    return {
      label: "New",
      bg: "rgba(139, 92, 246, 0.12)",
      color: "#7c3aed",
      border: "rgba(139, 92, 246, 0.22)",
    };
  }

  return {
    label: status || "Lead",
    bg: "rgba(100, 116, 139, 0.12)",
    color: "#475569",
    border: "rgba(100, 116, 139, 0.22)",
  };
}

function getInitials(name?: string): string {
  if (!name) return "L";

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "L";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export default function HotLeadsCard({
  leads = [],
  mode = "light",
  loading = false,
  title = "Hot Leads",
  onViewAll,
  onLeadClick,
}: HotLeadsCardProps) {
  const theme = getTheme(mode);

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 20,
        boxShadow:
          mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.28)"
            : "0 10px 30px rgba(15, 23, 42, 0.06)",
        minHeight: 380,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h3>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: theme.subText,
            }}
          >
            Priority leads that need sharp follow-up and quick conversion.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          style={{
            border: `1px solid ${theme.border}`,
            background: theme.cardBgSoft,
            color: theme.text,
            borderRadius: 10,
            padding: "8px 12px",
            fontSize: 13,
            fontWeight: 600,
            cursor: onViewAll ? "pointer" : "default",
            opacity: onViewAll ? 1 : 0.72,
          }}
        >
          View All
        </button>
      </div>

      {loading ? (
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                gap: 12,
                alignItems: "start",
                border: `1px solid ${theme.borderSoft}`,
                background: theme.cardBgSoft,
                borderRadius: 16,
                padding: 14,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: theme.border,
                }}
              />
              <div style={{ display: "grid", gap: 8 }}>
                <div
                  style={{
                    height: 12,
                    width: "46%",
                    borderRadius: 999,
                    background: theme.border,
                  }}
                />
                <div
                  style={{
                    height: 10,
                    width: "68%",
                    borderRadius: 999,
                    background: theme.borderSoft,
                  }}
                />
                <div
                  style={{
                    height: 10,
                    width: "32%",
                    borderRadius: 999,
                    background: theme.borderSoft,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div
          style={{
            flex: 1,
            border: `1px dashed ${theme.border}`,
            borderRadius: 18,
            background: theme.cardBgSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 34,
                lineHeight: 1,
                marginBottom: 10,
              }}
            >
              🔥
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: theme.text,
                marginBottom: 6,
              }}
            >
              No hot leads right now
            </div>
            <div
              style={{
                fontSize: 13,
                color: theme.subText,
              }}
            >
              Once promising leads arrive, they will appear here first.
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {leads.map((lead) => {
            const tone = getLeadStatusTone(lead.status);

            return (
              <button
                key={lead.id}
                type="button"
                onClick={() => onLeadClick?.(lead)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: `1px solid ${theme.borderSoft}`,
                  background: theme.cardBgSoft,
                  borderRadius: 16,
                  padding: 14,
                  cursor: onLeadClick ? "pointer" : "default",
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  gap: 12,
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background:
                      mode === "dark"
                        ? "linear-gradient(135deg, rgba(239, 68, 68, 0.24), rgba(245, 158, 11, 0.18))"
                        : "linear-gradient(135deg, rgba(239, 68, 68, 0.16), rgba(245, 158, 11, 0.14))",
                    border: `1px solid ${theme.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 800,
                    color: theme.text,
                    flexShrink: 0,
                  }}
                >
                  {getInitials(lead.name)}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: theme.text,
                          lineHeight: 1.35,
                          marginBottom: 6,
                          wordBreak: "break-word",
                        }}
                      >
                        {lead.name}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: 999,
                            padding: "4px 10px",
                            background: tone.bg,
                            color: tone.color,
                            border: `1px solid ${tone.border}`,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {tone.label}
                        </span>

                        {lead.source ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              borderRadius: 999,
                              padding: "4px 10px",
                              background: theme.cardBg,
                              color: theme.subText,
                              border: `1px solid ${theme.border}`,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {lead.source}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {typeof lead.budget === "number" ? (
                      <div
                        style={{
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            color: theme.mutedText,
                            marginBottom: 4,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          Budget
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: theme.text,
                          }}
                        >
                          ₹{formatCurrency(lead.budget)}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        border: `1px solid ${theme.border}`,
                        borderRadius: 12,
                        padding: "10px 12px",
                        background: theme.cardBg,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: theme.mutedText,
                          marginBottom: 4,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        Phone
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: theme.text,
                          wordBreak: "break-word",
                        }}
                      >
                        {lead.phone || "Not available"}
                      </div>
                    </div>

                    <div
                      style={{
                        border: `1px solid ${theme.border}`,
                        borderRadius: 12,
                        padding: "10px 12px",
                        background: theme.cardBg,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: theme.mutedText,
                          marginBottom: 4,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        Follow-up
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: theme.text,
                          wordBreak: "break-word",
                        }}
                      >
                        {formatDate(lead.followUpDate)}
                      </div>
                    </div>

                    <div
                      style={{
                        border: `1px solid ${theme.border}`,
                        borderRadius: 12,
                        padding: "10px 12px",
                        background: theme.cardBg,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: theme.mutedText,
                          marginBottom: 4,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        Owner
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: theme.text,
                          wordBreak: "break-word",
                        }}
                      >
                        {lead.owner || "Unassigned"}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}