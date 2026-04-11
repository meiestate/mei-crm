// src/features/deals/components/DealHeaderCard.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { Deal } from "../api/dealsApi";

type DealHeaderCardProps = {
  deal: Deal | null;
  mode?: ThemeMode;
  loading?: boolean;
  onBack?: () => void;
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
  onChangeStage?: (deal: Deal) => void;
  onAddActivity?: (deal: Deal) => void;
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
  if (!value) return "Not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

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

  if (value === "new") {
    return {
      bg: "rgba(99, 102, 241, 0.12)",
      color: "#4f46e5",
      dot: "#4f46e5",
      label: "New",
    };
  }

  return {
    bg: "rgba(100, 116, 139, 0.12)",
    color: "#475569",
    dot: "#475569",
    label: status || "Unknown",
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

function getInitials(title?: string): string {
  if (!title) return "DL";

  const parts = title.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "DL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function buildProgress(deal: Deal | null): number {
  if (!deal) return 0;

  if (typeof deal.probability === "number" && Number.isFinite(deal.probability)) {
    return Math.max(0, Math.min(100, deal.probability));
  }

  const stage = (deal.stage ?? "").toLowerCase();

  if (stage.includes("new")) return 15;
  if (stage.includes("qualif")) return 35;
  if (stage.includes("proposal")) return 55;
  if (stage.includes("negoti")) return 75;
  if (stage.includes("won")) return 100;
  if (stage.includes("lost")) return 0;

  return 20;
}

export default function DealHeaderCard({
  deal,
  mode = "light",
  loading = false,
  onBack,
  onEdit,
  onDelete,
  onChangeStage,
  onAddActivity,
}: DealHeaderCardProps) {
  const theme = getTheme(mode);

  if (loading) {
    return (
      <section
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 24,
          padding: 20,
          boxShadow:
            mode === "dark"
              ? "0 16px 40px rgba(0,0,0,0.28)"
              : "0 16px 40px rgba(15, 23, 42, 0.07)",
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "64px 1fr",
            gap: 16,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: theme.border,
            }}
          />
          <div style={{ display: "grid", gap: 8 }}>
            <div
              style={{
                width: "36%",
                height: 12,
                borderRadius: 999,
                background: theme.border,
              }}
            />
            <div
              style={{
                width: "62%",
                height: 22,
                borderRadius: 999,
                background: theme.borderSoft,
              }}
            />
            <div
              style={{
                width: "44%",
                height: 10,
                borderRadius: 999,
                background: theme.borderSoft,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: 16,
                padding: 14,
                background: theme.cardBgSoft,
                display: "grid",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: "48%",
                  height: 10,
                  borderRadius: 999,
                  background: theme.border,
                }}
              />
              <div
                style={{
                  width: "72%",
                  height: 16,
                  borderRadius: 999,
                  background: theme.borderSoft,
                }}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!deal) {
    return (
      <section
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 24,
          padding: 24,
          boxShadow:
            mode === "dark"
              ? "0 16px 40px rgba(0,0,0,0.28)"
              : "0 16px 40px rgba(15, 23, 42, 0.07)",
        }}
      >
        <div
          style={{
            border: `1px dashed ${theme.border}`,
            borderRadius: 18,
            background: theme.cardBgSoft,
            padding: 28,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 34,
              lineHeight: 1,
              marginBottom: 10,
            }}
          >
            📂
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: theme.text,
              marginBottom: 6,
            }}
          >
            Deal not found
          </div>
          <div
            style={{
              fontSize: 13,
              color: theme.subText,
            }}
          >
            The requested deal could not be loaded.
          </div>
        </div>
      </section>
    );
  }

  const stageTone = getStageTone(deal.stage);
  const statusTone = getStatusTone(deal.status);
  const priorityTone = getPriorityTone(deal.priority);
  const progress = buildProgress(deal);

  const mainValue = deal.value ?? deal.expectedValue ?? 0;

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        padding: 20,
        boxShadow:
          mode === "dark"
            ? "0 16px 40px rgba(0,0,0,0.28)"
            : "0 16px 40px rgba(15, 23, 42, 0.07)",
        display: "grid",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "64px 1fr",
            gap: 16,
            alignItems: "start",
            minWidth: 0,
            flex: 1,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background:
                mode === "dark"
                  ? "linear-gradient(135deg, rgba(99, 102, 241, 0.24), rgba(245, 158, 11, 0.16))"
                  : "linear-gradient(135deg, rgba(99, 102, 241, 0.16), rgba(245, 158, 11, 0.12))",
              border: `1px solid ${theme.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
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
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 999,
                  padding: "6px 12px",
                  background: statusTone.bg,
                  color: statusTone.color,
                  fontSize: 12,
                  fontWeight: 800,
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
                    padding: "6px 12px",
                    background: stageTone.bg,
                    color: stageTone.color,
                    border: `1px solid ${stageTone.border}`,
                    fontSize: 12,
                    fontWeight: 800,
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
                    padding: "6px 12px",
                    background: priorityTone.bg,
                    color: priorityTone.color,
                    border: `1px solid ${priorityTone.border}`,
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {priorityTone.label}
                </span>
              ) : null}
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 900,
                color: theme.text,
                lineHeight: 1.15,
                wordBreak: "break-word",
              }}
            >
              {deal.title}
            </h1>

            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
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
                  Contact:{" "}
                  <strong style={{ color: theme.text }}>{deal.contactName}</strong>
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
                  Lead:{" "}
                  <strong style={{ color: theme.text }}>{deal.leadName}</strong>
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
                  Company:{" "}
                  <strong style={{ color: theme.text }}>{deal.company}</strong>
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.cardBg,
                color: theme.text,
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              ← Back
            </button>
          ) : null}

          {onAddActivity ? (
            <button
              type="button"
              onClick={() => onAddActivity(deal)}
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.cardBgSoft,
                color: theme.text,
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              + Activity
            </button>
          ) : null}

          {onChangeStage ? (
            <button
              type="button"
              onClick={() => onChangeStage(deal)}
              style={{
                border: "none",
                background: theme.primary,
                color: theme.inverseText ?? "#ffffff",
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Change Stage
            </button>
          ) : null}

          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(deal)}
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.cardBgSoft,
                color: theme.text,
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Edit
            </button>
          ) : null}

          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(deal)}
              style={{
                border: "none",
                background: theme.danger ?? "#dc2626",
                color: "#ffffff",
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>

      <div
        style={{
          border: `1px solid ${theme.border}`,
          borderRadius: 18,
          background: theme.cardBgSoft,
          padding: 16,
          display: "grid",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                color: theme.mutedText,
                marginBottom: 4,
              }}
            >
              Deal Progress
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              {progress}%
            </div>
          </div>

          <div
            style={{
              fontSize: 13,
              color: theme.subText,
              fontWeight: 600,
            }}
          >
            Probability or stage-based estimate
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: 10,
            borderRadius: 999,
            background: theme.border,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: 999,
              background: theme.primary,
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 12,
        }}
      >
        <div
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            padding: 16,
            background: theme.cardBgSoft,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: theme.mutedText,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            Deal Value
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            {formatCurrency(mainValue, deal.currency)}
          </div>
        </div>

        <div
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            padding: 16,
            background: theme.cardBgSoft,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: theme.mutedText,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            Expected Close
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: theme.text,
              lineHeight: 1.3,
            }}
          >
            {formatDate(deal.expectedCloseDate)}
          </div>
        </div>

        <div
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            padding: 16,
            background: theme.cardBgSoft,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: theme.mutedText,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            Owner
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: theme.text,
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {deal.owner || "Unassigned"}
          </div>
        </div>

        <div
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            padding: 16,
            background: theme.cardBgSoft,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: theme.mutedText,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            Source
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: theme.text,
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {deal.source || "Unknown"}
          </div>
        </div>
      </div>

      {deal.notes ? (
        <div
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            padding: 16,
            background: theme.cardBgSoft,
          }}
        >
          <div
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              color: theme.mutedText,
              marginBottom: 8,
            }}
          >
            Notes
          </div>
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: theme.text,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {deal.notes}
          </div>
        </div>
      ) : null}
    </section>
  );
}