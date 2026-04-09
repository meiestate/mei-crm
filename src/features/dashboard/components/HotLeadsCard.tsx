import React from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type HotLeadItem = {
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
    | "follow_up"
    | "converted"
    | "lost";
  priority?: "low" | "medium" | "high" | "urgent";
  budget?: number;
  currency?: string;
  phone?: string;
  email?: string;
  city?: string;
  nextFollowUpAt?: string;
  lastActivityAt?: string;
};

type HotLeadsCardProps = {
  mode: ThemeMode;
  leads: HotLeadItem[];
  title?: string;
  maxItems?: number;
  onLeadClick?: (lead: HotLeadItem) => void;
  onViewAll?: () => void;
  onCall?: (lead: HotLeadItem) => void;
  onWhatsapp?: (lead: HotLeadItem) => void;
};

export default function HotLeadsCard({
  mode,
  leads,
  title = "Hot Leads",
  maxItems = 5,
  onLeadClick,
  onViewAll,
  onCall,
  onWhatsapp,
}: HotLeadsCardProps) {
  const theme = getTheme(mode);

  const visibleLeads = [...leads]
    .sort((a, b) => {
      const priorityScore = getPriorityScore(b.priority) - getPriorityScore(a.priority);
      if (priorityScore !== 0) return priorityScore;

      const aDate = a.nextFollowUpAt ? new Date(a.nextFollowUpAt).getTime() : 0;
      const bDate = b.nextFollowUpAt ? new Date(b.nextFollowUpAt).getTime() : 0;
      return aDate - bDate;
    })
    .slice(0, maxItems);

  const hotCount = leads.filter((lead) =>
    ["high", "urgent"].includes((lead.priority || "").toLowerCase())
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
            High-intent leads that need quick attention before the window closes.
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
          <MiniStat mode={mode} label="Total" value={String(leads.length)} />
          <MiniStat mode={mode} label="Hot" value={String(hotCount)} />
          {onViewAll ? (
            <button
              onClick={onViewAll}
              style={{
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
              }}
            >
              View All
            </button>
          ) : null}
        </div>
      </div>

      <div
        style={{
          padding: 20,
        }}
      >
        {visibleLeads.length === 0 ? (
          <EmptyState mode={mode} />
        ) : (
          <div
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {visibleLeads.map((lead) => {
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
                          gap: 10,
                          flexWrap: "wrap",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: "50%",
                            background: theme.primary,
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {getInitials(lead.name)}
                        </div>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
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

                            {lead.priority ? (
                              <Badge
                                mode={mode}
                                label={lead.priority}
                                tone={getPriorityTone(lead.priority)}
                              />
                            ) : null}

                            {lead.status ? (
                              <Badge
                                mode={mode}
                                label={formatStatusLabel(lead.status)}
                                tone={getStatusTone(lead.status)}
                              />
                            ) : null}
                          </div>

                          <div
                            style={{
                              marginTop: 4,
                              fontSize: 13,
                              color: theme.subText,
                              lineHeight: 1.5,
                            }}
                          >
                            {[lead.company, lead.city].filter(Boolean).join(" • ") || "Lead profile"}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: 6,
                        }}
                      >
                        <MetaLine label="Source" value={lead.source || "-"} mode={mode} />
                        <MetaLine label="Owner" value={lead.owner || "-"} mode={mode} />
                        <MetaLine
                          label="Next Follow-up"
                          value={lead.nextFollowUpAt ? formatDateTime(lead.nextFollowUpAt) : "-"}
                          mode={mode}
                        />
                        <MetaLine
                          label="Last Activity"
                          value={lead.lastActivityAt ? formatDateTime(lead.lastActivityAt) : "-"}
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

                      {(onCall || onWhatsapp) && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 8,
                            marginTop: 12,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {onCall ? (
                            <IconButton
                              label="Call"
                              icon="📞"
                              mode={mode}
                              onClick={() => onCall(lead)}
                            />
                          ) : null}

                          {onWhatsapp ? (
                            <IconButton
                              label="WhatsApp"
                              icon="💬"
                              mode={mode}
                              onClick={() => onWhatsapp(lead)}
                            />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyState({ mode }: { mode: ThemeMode }) {
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
          🔥
        </div>

        <h4
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          No hot leads right now
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
          Once high-priority or urgent leads appear, they will show up here for rapid follow-up.
        </p>
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
        minWidth: 70,
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

function IconButton({
  label,
  icon,
  mode,
  onClick,
}: {
  label: string;
  icon: string;
  mode: ThemeMode;
  onClick: () => void;
}) {
  const theme = getTheme(mode);

  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      style={{
        height: 34,
        minWidth: 34,
        padding: "0 10px",
        borderRadius: 10,
        border: `1px solid ${theme.border}`,
        background: theme.cardBg,
        color: theme.text,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      <span>{icon}</span>
    </button>
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

function getInitials(name?: string) {
  if (!name?.trim()) return "L";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) || "";
  const second = parts[1]?.charAt(0) || "";
  return `${first}${second}`.toUpperCase() || "L";
}

function formatStatusLabel(status: HotLeadItem["status"]) {
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
    case "follow_up":
      return "Follow Up";
    case "converted":
      return "Converted";
    case "lost":
      return "Lost";
    default:
      return "Lead";
  }
}

function getStatusTone(
  status: HotLeadItem["status"]
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
  priority: HotLeadItem["priority"]
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

function getPriorityScore(priority?: HotLeadItem["priority"]) {
  switch (priority) {
    case "urgent":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
    default:
      return 1;
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

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
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