import React from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type RelatedLeadItem = {
  id: string;
  name: string;
  company?: string;
  source?: string;
  owner?: string;
  status?:
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "converted"
    | "lost"
    | "follow_up";
  priority?: "low" | "medium" | "high" | "urgent";
  budget?: number;
  currency?: string;
  phone?: string;
  email?: string;
  nextFollowUpAt?: string;
  createdAt?: string;
};

type RelatedLeadsCardProps = {
  mode: ThemeMode;
  leads: RelatedLeadItem[];
  title?: string;
  onLeadClick?: (lead: RelatedLeadItem) => void;
  onViewAll?: () => void;
  onAddLead?: () => void;
};

export default function RelatedLeadsCard({
  mode,
  leads,
  title = "Related Leads",
  onLeadClick,
  onViewAll,
  onAddLead,
}: RelatedLeadsCardProps) {
  const theme = getTheme(mode);

  const totalBudget = leads.reduce((sum, lead) => sum + (lead.budget ?? 0), 0);
  const activeLeads = leads.filter(
    (lead) => lead.status && !["converted", "lost"].includes(lead.status)
  ).length;

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 22,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px 20px",
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
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
            {title}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              lineHeight: 1.6,
              color: theme.subText,
            }}
          >
            Pipeline leads linked to this profile, with status, priority, and
            next follow-up visibility.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <MiniStat mode={mode} label="Leads" value={String(leads.length)} />
          <MiniStat mode={mode} label="Active" value={String(activeLeads)} />
          <MiniStat
            mode={mode}
            label="Budget"
            value={formatCurrency(totalBudget, leads[0]?.currency || "INR")}
          />

          {onAddLead ? (
            <button onClick={onAddLead} style={primaryButtonStyle(theme)}>
              + Add Lead
            </button>
          ) : null}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {leads.length === 0 ? (
          <EmptyState mode={mode} onAddLead={onAddLead} />
        ) : (
          <div
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {leads.map((lead) => {
              const clickable = Boolean(onLeadClick);

              return (
                <div
                  key={lead.id}
                  onClick={() => onLeadClick?.(lead)}
                  style={{
                    background: theme.cardBgSoft,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 18,
                    padding: 16,
                    cursor: clickable ? "pointer" : "default",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 14,
                      alignItems: "start",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                          marginBottom: 8,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 15,
                            fontWeight: 800,
                            color: theme.text,
                            lineHeight: 1.3,
                          }}
                        >
                          {lead.name}
                        </h4>

                        {lead.status ? (
                          <Badge
                            mode={mode}
                            label={formatStatusLabel(lead.status)}
                            tone={getStatusTone(lead.status)}
                          />
                        ) : null}

                        {lead.priority ? (
                          <Badge
                            mode={mode}
                            label={lead.priority}
                            tone={getPriorityTone(lead.priority)}
                          />
                        ) : null}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: 6,
                        }}
                      >
                        <MetaLine
                          label="Company"
                          value={lead.company || "-"}
                          mode={mode}
                        />
                        <MetaLine
                          label="Source"
                          value={lead.source || "-"}
                          mode={mode}
                        />
                        <MetaLine
                          label="Owner"
                          value={lead.owner || "-"}
                          mode={mode}
                        />
                        <MetaLine
                          label="Phone"
                          value={lead.phone || "-"}
                          mode={mode}
                        />
                        <MetaLine
                          label="Next Follow-up"
                          value={
                            lead.nextFollowUpAt
                              ? formatDate(lead.nextFollowUpAt)
                              : "-"
                          }
                          mode={mode}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: "right",
                        minWidth: 140,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: theme.subText,
                          marginBottom: 6,
                        }}
                      >
                        Budget
                      </div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: theme.text,
                          lineHeight: 1.1,
                        }}
                      >
                        {formatCurrency(lead.budget ?? 0, lead.currency || "INR")}
                      </div>

                      {lead.createdAt ? (
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 12,
                            color: theme.subText,
                          }}
                        >
                          Created {formatDate(lead.createdAt)}
                        </div>
                      ) : null}

                      {lead.email ? (
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 12,
                            color: theme.subText,
                            wordBreak: "break-word",
                            maxWidth: 180,
                            marginLeft: "auto",
                          }}
                          title={lead.email}
                        >
                          {lead.email}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {(onViewAll || onAddLead) && leads.length > 0 ? (
        <div
          style={{
            padding: "16px 20px",
            borderTop: `1px solid ${theme.border}`,
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: theme.subText,
              fontWeight: 700,
            }}
          >
            Keep every lead visible, nurtured, and moving through the funnel.
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {onViewAll ? (
              <button onClick={onViewAll} style={secondaryButtonStyle(theme)}>
                View All Leads
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function EmptyState({
  mode,
  onAddLead,
}: {
  mode: ThemeMode;
  onAddLead?: () => void;
}) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        minHeight: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div>
        <div
          style={{
            width: 68,
            height: 68,
            margin: "0 auto 14px",
            borderRadius: "50%",
            background: theme.cardBgSoft,
            border: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          🎯
        </div>

        <h4
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          No related leads yet
        </h4>

        <p
          style={{
            margin: "8px auto 0",
            maxWidth: 420,
            fontSize: 13,
            lineHeight: 1.7,
            color: theme.subText,
          }}
        >
          Once leads are linked to this profile, they will appear here with
          budget, priority, and next follow-up clarity.
        </p>

        {onAddLead ? (
          <button
            onClick={onAddLead}
            style={{
              ...primaryButtonStyle(theme),
              marginTop: 16,
            }}
          >
            + Add First Lead
          </button>
        ) : null}
      </div>
    </div>
  );
}

function MiniStat({
  mode,
  label,
  value,
}: {
  mode: ThemeMode;
  label: string;
  value: string;
}) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        padding: "9px 12px",
        borderRadius: 14,
        background: theme.cardBgSoft,
        border: `1px solid ${theme.border}`,
        minWidth: 74,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: theme.subText,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: theme.text,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MetaLine({
  label,
  value,
  mode,
}: {
  label: string;
  value: string;
  mode: ThemeMode;
}) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "110px 1fr",
        gap: 10,
        alignItems: "start",
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: theme.subText,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: theme.text,
          lineHeight: 1.6,
          wordBreak: "break-word",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Badge({
  mode,
  label,
  tone,
}: {
  mode: ThemeMode;
  label: string;
  tone: "success" | "warning" | "danger" | "neutral" | "info";
}) {
  const palette = getBadgePalette(mode, tone);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 9px",
        borderRadius: 999,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        color: palette.text,
        fontSize: 11,
        fontWeight: 800,
        textTransform: "capitalize",
      }}
    >
      {label}
    </span>
  );
}

function primaryButtonStyle(
  theme: ReturnType<typeof getTheme>
): React.CSSProperties {
  return {
    height: 40,
    padding: "0 14px",
    borderRadius: 12,
    border: "none",
    background: theme.primary,
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function secondaryButtonStyle(
  theme: ReturnType<typeof getTheme>
): React.CSSProperties {
  return {
    height: 40,
    padding: "0 14px",
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.text,
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function formatStatusLabel(status: RelatedLeadItem["status"]) {
  switch (status) {
    case "new":
      return "New";
    case "contacted":
      return "Contacted";
    case "qualified":
      return "Qualified";
    case "proposal":
      return "Proposal";
    case "negotiation":
      return "Negotiation";
    case "converted":
      return "Converted";
    case "lost":
      return "Lost";
    case "follow_up":
      return "Follow Up";
    default:
      return "Lead";
  }
}

function getStatusTone(
  status: RelatedLeadItem["status"]
): "success" | "warning" | "danger" | "neutral" | "info" {
  switch (status) {
    case "converted":
      return "success";
    case "lost":
      return "danger";
    case "proposal":
    case "negotiation":
    case "follow_up":
      return "warning";
    case "qualified":
    case "contacted":
      return "info";
    case "new":
    default:
      return "neutral";
  }
}

function getPriorityTone(
  priority: RelatedLeadItem["priority"]
): "success" | "warning" | "danger" | "neutral" | "info" {
  switch (priority) {
    case "urgent":
      return "danger";
    case "high":
      return "warning";
    case "medium":
      return "info";
    case "low":
    default:
      return "neutral";
  }
}

function getBadgePalette(
  mode: ThemeMode,
  tone: "success" | "warning" | "danger" | "neutral" | "info"
) {
  const isDark = mode === "dark";

  switch (tone) {
    case "success":
      return {
        bg: isDark ? "rgba(34,197,94,0.14)" : "rgba(34,197,94,0.10)",
        border: isDark ? "rgba(34,197,94,0.28)" : "rgba(34,197,94,0.22)",
        text: "#16a34a",
      };
    case "warning":
      return {
        bg: isDark ? "rgba(245,158,11,0.14)" : "rgba(245,158,11,0.10)",
        border: isDark ? "rgba(245,158,11,0.28)" : "rgba(245,158,11,0.22)",
        text: "#d97706",
      };
    case "danger":
      return {
        bg: isDark ? "rgba(239,68,68,0.14)" : "rgba(239,68,68,0.10)",
        border: isDark ? "rgba(239,68,68,0.28)" : "rgba(239,68,68,0.22)",
        text: "#dc2626",
      };
    case "info":
      return {
        bg: isDark ? "rgba(59,130,246,0.14)" : "rgba(59,130,246,0.10)",
        border: isDark ? "rgba(59,130,246,0.28)" : "rgba(59,130,246,0.22)",
        text: "#2563eb",
      };
    case "neutral":
    default:
      return {
        bg: isDark ? "rgba(148,163,184,0.14)" : "rgba(148,163,184,0.10)",
        border: isDark ? "rgba(148,163,184,0.28)" : "rgba(148,163,184,0.22)",
        text: "#475569",
      };
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatCurrency(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString("en-IN")}`;
  }
}