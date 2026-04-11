// src/features/deals/components/DealCard.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { Deal } from "../api/dealsApi";

type DealCardProps = {
  deal: Deal;
  mode?: ThemeMode;
  compact?: boolean;
  selected?: boolean;
  loading?: boolean;
  onClick?: (deal: Deal) => void;
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
};

function formatCurrency(value?: number, currency?: string): string {
  const amount = typeof value === "number" && Number.isFinite(value) ? value : 0;

  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);

  if ((currency ?? "INR").toUpperCase() === "INR") {
    return `₹${formatted}`;
  }

  return `${currency ?? ""} ${formatted}`.trim();
}

function formatDate(value?: string): string {
  if (!value) return "No date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStageTone(stage?: string) {
  const value = (stage ?? "").toLowerCase();

  if (value.includes("new")) {
    return {
      bg: "rgba(59, 130, 246, 0.12)",
      color: "#2563eb",
      border: "rgba(59, 130, 246, 0.24)",
    };
  }

  if (value.includes("qualif")) {
    return {
      bg: "rgba(99, 102, 241, 0.12)",
      color: "#4f46e5",
      border: "rgba(99, 102, 241, 0.24)",
    };
  }

  if (value.includes("proposal")) {
    return {
      bg: "rgba(168, 85, 247, 0.12)",
      color: "#7c3aed",
      border: "rgba(168, 85, 247, 0.24)",
    };
  }

  if (value.includes("negoti")) {
    return {
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#d97706",
      border: "rgba(245, 158, 11, 0.24)",
    };
  }

  if (value.includes("won")) {
    return {
      bg: "rgba(34, 197, 94, 0.12)",
      color: "#16a34a",
      border: "rgba(34, 197, 94, 0.24)",
    };
  }

  if (value.includes("lost")) {
    return {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#dc2626",
      border: "rgba(239, 68, 68, 0.24)",
    };
  }

  return {
    bg: "rgba(100, 116, 139, 0.12)",
    color: "#475569",
    border: "rgba(100, 116, 139, 0.24)",
  };
}

function getPriorityTone(priority?: string) {
  const value = (priority ?? "").toLowerCase();

  if (value === "urgent") {
    return {
      bg: "rgba(127, 29, 29, 0.12)",
      color: "#b91c1c",
      border: "rgba(185, 28, 28, 0.24)",
      label: "Urgent",
    };
  }

  if (value === "high") {
    return {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#dc2626",
      border: "rgba(239, 68, 68, 0.24)",
      label: "High",
    };
  }

  if (value === "medium") {
    return {
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#d97706",
      border: "rgba(245, 158, 11, 0.24)",
      label: "Medium",
    };
  }

  return {
    bg: "rgba(34, 197, 94, 0.12)",
    color: "#16a34a",
    border: "rgba(34, 197, 94, 0.24)",
    label: priority || "Low",
  };
}

function getStatusTone(status?: string) {
  const value = (status ?? "").toLowerCase();

  if (value === "won") {
    return {
      bg: "rgba(34, 197, 94, 0.12)",
      color: "#16a34a",
      dot: "#16a34a",
      label: "Won",
    };
  }

  if (value === "lost") {
    return {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#dc2626",
      dot: "#dc2626",
      label: "Lost",
    };
  }

  if (value === "open" || value === "qualified") {
    return {
      bg: "rgba(59, 130, 246, 0.12)",
      color: "#2563eb",
      dot: "#2563eb",
      label: status || "Open",
    };
  }

  if (value === "proposal" || value === "negotiation") {
    return {
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#d97706",
      dot: "#d97706",
      label: status || "In Progress",
    };
  }

  return {
    bg: "rgba(100, 116, 139, 0.12)",
    color: "#475569",
    dot: "#475569",
    label: status || "Unknown",
  };
}

function getInitials(title?: string): string {
  if (!title) return "DL";

  const parts = title.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "DL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export default function DealCard({
  deal,
  mode = "light",
  compact = false,
  selected = false,
  loading = false,
  onClick,
  onEdit,
  onDelete,
}: DealCardProps) {
  const theme = getTheme(mode);

  if (loading) {
    return (
      <div
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 20,
          padding: compact ? 14 : 18,
          boxShadow:
            mode === "dark"
              ? "0 10px 30px rgba(0,0,0,0.24)"
              : "0 10px 30px rgba(15, 23, 42, 0.06)",
          display: "grid",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "48px 1fr",
            gap: 12,
            alignItems: "center",
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
                width: "44%",
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
          </div>
        </div>

        <div
          style={{
            height: 10,
            width: "100%",
            borderRadius: 999,
            background: theme.borderSoft,
          }}
        />
        <div
          style={{
            height: 10,
            width: "76%",
            borderRadius: 999,
            background: theme.borderSoft,
          }}
        />
      </div>
    );
  }

  const stageTone = getStageTone(deal.stage);
  const priorityTone = getPriorityTone(deal.priority);
  const statusTone = getStatusTone(deal.status);

  const mainValue = deal.value ?? deal.expectedValue ?? 0;
  const probability =
    typeof deal.probability === "number" && Number.isFinite(deal.probability)
      ? Math.max(0, Math.min(100, deal.probability))
      : undefined;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(deal)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.(deal);
        }
      }}
      style={{
        background: theme.cardBg,
        border: `1px solid ${
          selected ? theme.primary : theme.border
        }`,
        borderRadius: 20,
        padding: compact ? 14 : 18,
        boxShadow:
          mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.24)"
            : "0 10px 30px rgba(15, 23, 42, 0.06)",
        display: "grid",
        gap: compact ? 12 : 16,
        cursor: onClick ? "pointer" : "default",
        outline: "none",
        position: "relative",
      }}
    >
      {selected ? (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: theme.primary,
          }}
        />
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: compact ? "44px 1fr" : "52px 1fr",
          gap: 12,
          alignItems: "start",
        }}
      >
        <div
          style={{
            width: compact ? 44 : 52,
            height: compact ? 44 : 52,
            borderRadius: 16,
            background:
              mode === "dark"
                ? "linear-gradient(135deg, rgba(99, 102, 241, 0.24), rgba(245, 158, 11, 0.14))"
                : "linear-gradient(135deg, rgba(99, 102, 241, 0.16), rgba(245, 158, 11, 0.12))",
            border: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: compact ? 13 : 14,
            fontWeight: 800,
            color: theme.text,
            flexShrink: 0,
          }}
        >
          {getInitials(deal.title)}
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
                  fontSize: compact ? 15 : 16,
                  fontWeight: 800,
                  color: theme.text,
                  lineHeight: 1.35,
                  wordBreak: "break-word",
                  marginBottom: 6,
                }}
              >
                {deal.title}
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
                    gap: 6,
                    borderRadius: 999,
                    padding: "4px 10px",
                    background: statusTone.bg,
                    color: statusTone.color,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: statusTone.dot,
                      display: "inline-block",
                    }}
                  />
                  {statusTone.label}
                </span>

                {deal.stage ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: 999,
                      padding: "4px 10px",
                      background: stageTone.bg,
                      color: stageTone.color,
                      border: `1px solid ${stageTone.border}`,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {deal.stage}
                  </span>
                ) : null}

                {deal.priority ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: 999,
                      padding: "4px 10px",
                      background: priorityTone.bg,
                      color: priorityTone.color,
                      border: `1px solid ${priorityTone.border}`,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {priorityTone.label}
                  </span>
                ) : null}
              </div>
            </div>

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
                Deal Value
              </div>
              <div
                style={{
                  fontSize: compact ? 18 : 20,
                  fontWeight: 800,
                  color: theme.text,
                  lineHeight: 1.2,
                }}
              >
                {formatCurrency(mainValue, deal.currency)}
              </div>
            </div>
          </div>

          {(deal.contactName || deal.leadName || deal.company) ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 10,
              }}
            >
              {deal.contactName ? (
                <span
                  style={{
                    fontSize: 13,
                    color: theme.subText,
                    background: theme.cardBgSoft,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 999,
                    padding: "6px 10px",
                  }}
                >
                  Contact: <strong style={{ color: theme.text }}>{deal.contactName}</strong>
                </span>
              ) : null}

              {deal.leadName ? (
                <span
                  style={{
                    fontSize: 13,
                    color: theme.subText,
                    background: theme.cardBgSoft,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 999,
                    padding: "6px 10px",
                  }}
                >
                  Lead: <strong style={{ color: theme.text }}>{deal.leadName}</strong>
                </span>
              ) : null}

              {deal.company ? (
                <span
                  style={{
                    fontSize: 13,
                    color: theme.subText,
                    background: theme.cardBgSoft,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 999,
                    padding: "6px 10px",
                  }}
                >
                  Company: <strong style={{ color: theme.text }}>{deal.company}</strong>
                </span>
              ) : null}
            </div>
          ) : null}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: compact
                ? "repeat(auto-fit, minmax(120px, 1fr))"
                : "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 10,
            }}
          >
            <div
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: 14,
                padding: "10px 12px",
                background: theme.cardBgSoft,
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
                  fontWeight: 700,
                  color: theme.text,
                  wordBreak: "break-word",
                }}
              >
                {deal.owner || "Unassigned"}
              </div>
            </div>

            <div
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: 14,
                padding: "10px 12px",
                background: theme.cardBgSoft,
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
                Source
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.text,
                  wordBreak: "break-word",
                }}
              >
                {deal.source || "Unknown"}
              </div>
            </div>

            <div
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: 14,
                padding: "10px 12px",
                background: theme.cardBgSoft,
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
                Close Date
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.text,
                  wordBreak: "break-word",
                }}
              >
                {formatDate(deal.expectedCloseDate)}
              </div>
            </div>

            <div
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: 14,
                padding: "10px 12px",
                background: theme.cardBgSoft,
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
                Probability
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.text,
                  marginBottom: 8,
                }}
              >
                {probability !== undefined ? `${probability}%` : "—"}
              </div>

              <div
                style={{
                  width: "100%",
                  height: 8,
                  borderRadius: 999,
                  background: theme.border,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${probability ?? 0}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: theme.primary,
                  }}
                />
              </div>
            </div>
          </div>

          {deal.tags && deal.tags.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 12,
              }}
            >
              {deal.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: 999,
                    padding: "5px 10px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: theme.subText,
                    background: theme.cardBgSoft,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          {(onEdit || onDelete) ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 14,
              }}
            >
              {onEdit ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(deal);
                  }}
                  style={{
                    border: `1px solid ${theme.border}`,
                    background: theme.cardBg,
                    color: theme.text,
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              ) : null}

              {onDelete ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(deal);
                  }}
                  style={{
                    border: "none",
                    background: theme.danger ?? "#dc2626",
                    color: "#ffffff",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}