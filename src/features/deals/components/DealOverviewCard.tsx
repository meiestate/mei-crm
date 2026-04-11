// src/features/deals/components/DealOverviewCard.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { Deal } from "../api/dealsApi";

type DealOverviewCardProps = {
  deal: Deal | null;
  mode?: ThemeMode;
  loading?: boolean;
  onEdit?: (deal: Deal) => void;
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

function getProbabilityValue(deal: Deal | null): number {
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

function StatTile({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        padding: 14,
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
        {label}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: theme.text,
          lineHeight: 1.35,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function DealOverviewCard({
  deal,
  mode = "light",
  loading = false,
  onEdit,
}: DealOverviewCardProps) {
  const theme = getTheme(mode);

  if (loading) {
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
          display: "grid",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ display: "grid", gap: 8, flex: 1 }}>
            <div
              style={{
                width: "38%",
                height: 12,
                borderRadius: 999,
                background: theme.border,
              }}
            />
            <div
              style={{
                width: "62%",
                height: 10,
                borderRadius: 999,
                background: theme.borderSoft,
              }}
            />
          </div>

          <div
            style={{
              width: 84,
              height: 38,
              borderRadius: 12,
              background: theme.border,
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
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
          borderRadius: 20,
          padding: 20,
          boxShadow:
            mode === "dark"
              ? "0 10px 30px rgba(0,0,0,0.28)"
              : "0 10px 30px rgba(15, 23, 42, 0.06)",
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
            📄
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: theme.text,
              marginBottom: 6,
            }}
          >
            No overview data
          </div>
          <div
            style={{
              fontSize: 13,
              color: theme.subText,
            }}
          >
            Deal information is not available right now.
          </div>
        </div>
      </section>
    );
  }

  const statusTone = getStatusTone(deal.status);
  const stageTone = getStageTone(deal.stage);
  const priorityTone = getPriorityTone(deal.priority);
  const probability = getProbabilityValue(deal);
  const mainValue = deal.value ?? deal.expectedValue ?? 0;
  const expectedValue = deal.expectedValue ?? deal.value ?? 0;

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
        display: "grid",
        gap: 18,
      }}
    >
      <div
        style={{
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
              fontSize: 20,
              fontWeight: 800,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            Deal Overview
          </h3>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: 13,
              color: theme.subText,
            }}
          >
            Clean snapshot of commercial value, people, ownership, and momentum.
          </p>
        </div>

        {onEdit ? (
          <button
            type="button"
            onClick={() => onEdit(deal)}
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.cardBgSoft,
              color: theme.text,
              borderRadius: 12,
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Edit Overview
          </button>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        <StatTile
          label="Deal Value"
          value={formatCurrency(mainValue, deal.currency)}
          theme={theme}
        />
        <StatTile
          label="Expected Value"
          value={formatCurrency(expectedValue, deal.currency)}
          theme={theme}
        />
        <StatTile
          label="Expected Close Date"
          value={formatDate(deal.expectedCloseDate)}
          theme={theme}
        />
        <StatTile
          label="Owner"
          value={deal.owner || "Unassigned"}
          theme={theme}
        />
        <StatTile
          label="Source"
          value={deal.source || "Unknown"}
          theme={theme}
        />
        <StatTile
          label="Currency"
          value={deal.currency || "INR"}
          theme={theme}
        />
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
                color: theme.mutedText,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 4,
              }}
            >
              Conversion Confidence
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                color: theme.text,
              }}
            >
              {probability}%
            </div>
          </div>

          <div
            style={{
              fontSize: 13,
              color: theme.subText,
              fontWeight: 600,
            }}
          >
            Based on probability or stage maturity
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
              width: `${probability}%`,
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
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        <StatTile
          label="Contact Name"
          value={deal.contactName || "Not linked"}
          theme={theme}
        />
        <StatTile
          label="Lead Name"
          value={deal.leadName || "Not linked"}
          theme={theme}
        />
        <StatTile
          label="Company"
          value={deal.company || "Not linked"}
          theme={theme}
        />
        <StatTile
          label="Created"
          value={formatDate(deal.createdAt)}
          theme={theme}
        />
        <StatTile
          label="Last Updated"
          value={formatDate(deal.updatedAt)}
          theme={theme}
        />
      </div>

      {deal.tags && deal.tags.length > 0 ? (
        <div
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            background: theme.cardBgSoft,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: theme.mutedText,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              marginBottom: 10,
            }}
          >
            Tags
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {deal.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "6px 12px",
                  background: theme.cardBg,
                  border: `1px solid ${theme.border}`,
                  color: theme.text,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {deal.notes ? (
        <div
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            background: theme.cardBgSoft,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: theme.mutedText,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              marginBottom: 8,
            }}
          >
            Internal Notes
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