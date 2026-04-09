import React from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type RelatedDealItem = {
  id: string;
  title: string;
  company?: string;
  contactName?: string;
  owner?: string;
  value?: number;
  currency?: string;
  stage?:
    | "new"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "won"
    | "lost"
    | "on_hold";
  priority?: "low" | "medium" | "high" | "urgent";
  expectedCloseDate?: string;
  createdAt?: string;
};

type RelatedDealsCardProps = {
  mode: ThemeMode;
  deals: RelatedDealItem[];
  title?: string;
  onDealClick?: (deal: RelatedDealItem) => void;
  onViewAll?: () => void;
  onAddDeal?: () => void;
};

export default function RelatedDealsCard({
  mode,
  deals,
  title = "Related Deals",
  onDealClick,
  onViewAll,
  onAddDeal,
}: RelatedDealsCardProps) {
  const theme = getTheme(mode);

  const totalValue = deals.reduce((sum, deal) => sum + (deal.value ?? 0), 0);
  const openDeals = deals.filter(
    (deal) => deal.stage && !["won", "lost"].includes(deal.stage)
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
            Active and historical deal opportunities linked to this profile.
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
          <MiniStat
            mode={mode}
            label="Deals"
            value={String(deals.length)}
          />
          <MiniStat
            mode={mode}
            label="Open"
            value={String(openDeals)}
          />
          <MiniStat
            mode={mode}
            label="Value"
            value={formatCurrency(totalValue, deals[0]?.currency || "INR")}
          />

          {onAddDeal ? (
            <button
              onClick={onAddDeal}
              style={primaryButtonStyle(theme)}
            >
              + Add Deal
            </button>
          ) : null}
        </div>
      </div>

      <div
        style={{
          padding: 20,
        }}
      >
        {deals.length === 0 ? (
          <EmptyState mode={mode} onAddDeal={onAddDeal} />
        ) : (
          <div
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {deals.map((deal) => {
              const clickable = Boolean(onDealClick);

              return (
                <div
                  key={deal.id}
                  onClick={() => onDealClick?.(deal)}
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
                          {deal.title}
                        </h4>

                        {deal.stage ? (
                          <Badge
                            mode={mode}
                            label={formatStageLabel(deal.stage)}
                            tone={getStageTone(deal.stage)}
                          />
                        ) : null}

                        {deal.priority ? (
                          <Badge
                            mode={mode}
                            label={deal.priority}
                            tone={getPriorityTone(deal.priority)}
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
                          value={deal.company || "-"}
                          mode={mode}
                        />
                        <MetaLine
                          label="Contact"
                          value={deal.contactName || "-"}
                          mode={mode}
                        />
                        <MetaLine
                          label="Owner"
                          value={deal.owner || "-"}
                          mode={mode}
                        />
                        <MetaLine
                          label="Expected Close"
                          value={
                            deal.expectedCloseDate
                              ? formatDate(deal.expectedCloseDate)
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
                        Deal Value
                      </div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: theme.text,
                          lineHeight: 1.1,
                        }}
                      >
                        {formatCurrency(deal.value ?? 0, deal.currency || "INR")}
                      </div>

                      {deal.createdAt ? (
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 12,
                            color: theme.subText,
                          }}
                        >
                          Created {formatDate(deal.createdAt)}
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

      {(onViewAll || onAddDeal) && deals.length > 0 ? (
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
            Track pipeline movement and keep every opportunity visible.
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {onViewAll ? (
              <button
                onClick={onViewAll}
                style={secondaryButtonStyle(theme)}
              >
                View All Deals
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
  onAddDeal,
}: {
  mode: ThemeMode;
  onAddDeal?: () => void;
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
          💼
        </div>

        <h4
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          No related deals yet
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
          Once opportunities are linked to this contact, they will show up here
          with stage, value, and expected close snapshot.
        </p>

        {onAddDeal ? (
          <button
            onClick={onAddDeal}
            style={{
              ...primaryButtonStyle(theme),
              marginTop: 16,
            }}
          >
            + Add First Deal
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

function primaryButtonStyle(theme: ReturnType<typeof getTheme>): React.CSSProperties {
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

function secondaryButtonStyle(theme: ReturnType<typeof getTheme>): React.CSSProperties {
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

function formatStageLabel(stage: RelatedDealItem["stage"]) {
  switch (stage) {
    case "new":
      return "New";
    case "qualified":
      return "Qualified";
    case "proposal":
      return "Proposal";
    case "negotiation":
      return "Negotiation";
    case "won":
      return "Won";
    case "lost":
      return "Lost";
    case "on_hold":
      return "On Hold";
    default:
      return "Deal";
  }
}

function getStageTone(
  stage: RelatedDealItem["stage"]
): "success" | "warning" | "danger" | "neutral" | "info" {
  switch (stage) {
    case "won":
      return "success";
    case "lost":
      return "danger";
    case "negotiation":
    case "proposal":
      return "warning";
    case "qualified":
      return "info";
    case "new":
    case "on_hold":
    default:
      return "neutral";
  }
}

function getPriorityTone(
  priority: RelatedDealItem["priority"]
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