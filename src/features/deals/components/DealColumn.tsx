// src/features/deals/components/DealColumn.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { Deal } from "../api/dealsApi";
import DealCard from "./DealCard";

type DealColumnProps = {
  title: string;
  deals?: Deal[];
  mode?: ThemeMode;
  loading?: boolean;
  stageKey?: string;
  emptyMessage?: string;
  totalValue?: number;
  onAddDeal?: (stageKey?: string) => void;
  onDealClick?: (deal: Deal) => void;
  onEditDeal?: (deal: Deal) => void;
  onDeleteDeal?: (deal: Deal) => void;
};

function formatCurrency(value?: number): string {
  const amount = typeof value === "number" && Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStageTone(title: string) {
  const value = title.toLowerCase();

  if (value.includes("new")) {
    return {
      bg: "rgba(59, 130, 246, 0.12)",
      color: "#2563eb",
      border: "rgba(59, 130, 246, 0.24)",
      dot: "#3b82f6",
    };
  }

  if (value.includes("qualif")) {
    return {
      bg: "rgba(99, 102, 241, 0.12)",
      color: "#4f46e5",
      border: "rgba(99, 102, 241, 0.24)",
      dot: "#6366f1",
    };
  }

  if (value.includes("proposal")) {
    return {
      bg: "rgba(168, 85, 247, 0.12)",
      color: "#7c3aed",
      border: "rgba(168, 85, 247, 0.24)",
      dot: "#8b5cf6",
    };
  }

  if (value.includes("negoti")) {
    return {
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#d97706",
      border: "rgba(245, 158, 11, 0.24)",
      dot: "#f59e0b",
    };
  }

  if (value.includes("won")) {
    return {
      bg: "rgba(34, 197, 94, 0.12)",
      color: "#16a34a",
      border: "rgba(34, 197, 94, 0.24)",
      dot: "#22c55e",
    };
  }

  if (value.includes("lost")) {
    return {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#dc2626",
      border: "rgba(239, 68, 68, 0.24)",
      dot: "#ef4444",
    };
  }

  return {
    bg: "rgba(100, 116, 139, 0.12)",
    color: "#475569",
    border: "rgba(100, 116, 139, 0.24)",
    dot: "#64748b",
  };
}

export default function DealColumn({
  title,
  deals = [],
  mode = "light",
  loading = false,
  stageKey,
  emptyMessage = "No deals in this stage yet.",
  totalValue,
  onAddDeal,
  onDealClick,
  onEditDeal,
  onDeleteDeal,
}: DealColumnProps) {
  const theme = getTheme(mode);
  const tone = getStageTone(title);

  const calculatedValue = deals.reduce((sum, deal) => {
    const value =
      typeof deal.value === "number"
        ? deal.value
        : typeof deal.expectedValue === "number"
        ? deal.expectedValue
        : 0;

    return sum + value;
  }, 0);

  const displayValue =
    typeof totalValue === "number" && Number.isFinite(totalValue)
      ? totalValue
      : calculatedValue;

  return (
    <section
      style={{
        minWidth: 340,
        width: 340,
        maxWidth: 340,
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 22,
        boxShadow:
          mode === "dark"
            ? "0 12px 32px rgba(0,0,0,0.24)"
            : "0 12px 32px rgba(15, 23, 42, 0.07)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: `1px solid ${theme.border}`,
          background:
            mode === "dark"
              ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))"
              : "linear-gradient(180deg, rgba(248,250,252,0.85), rgba(248,250,252,0.35))",
          display: "grid",
          gap: 12,
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
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                padding: "6px 12px",
                background: tone.bg,
                border: `1px solid ${tone.border}`,
                color: tone.color,
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 10,
                maxWidth: "100%",
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: tone.dot,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {title}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "end",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  lineHeight: 1,
                  fontWeight: 800,
                  color: theme.text,
                }}
              >
                {deals.length}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: theme.subText,
                  fontWeight: 600,
                }}
              >
                deals
              </div>
            </div>
          </div>

          {onAddDeal ? (
            <button
              type="button"
              onClick={() => onAddDeal(stageKey)}
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.cardBgSoft,
                color: theme.text,
                borderRadius: 12,
                padding: "10px 12px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              + Add
            </button>
          ) : null}
        </div>

        <div
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            padding: "12px 14px",
            background: theme.cardBgSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: theme.mutedText,
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: 0.6,
              }}
            >
              Stage Value
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: theme.text,
                lineHeight: 1.2,
              }}
            >
              ₹{formatCurrency(displayValue)}
            </div>
          </div>

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: tone.bg,
              border: `1px solid ${tone.border}`,
              color: tone.color,
              fontSize: 18,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {deals.length}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: 16,
          overflowY: "auto",
          display: "grid",
          gap: 14,
          minHeight: 220,
          maxHeight: "calc(100vh - 280px)",
        }}
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <DealCard
              key={`deal-skeleton-${index}`}
              deal={{
                id: `loading-${index}`,
                title: "",
              }}
              mode={mode}
              compact
              loading
            />
          ))
        ) : deals.length === 0 ? (
          <div
            style={{
              border: `1px dashed ${theme.border}`,
              borderRadius: 18,
              background: theme.cardBgSoft,
              padding: 24,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                margin: "0 auto 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: tone.bg,
                border: `1px solid ${tone.border}`,
                color: tone.color,
                fontSize: 22,
              }}
            >
              📂
            </div>

            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: theme.text,
                marginBottom: 6,
              }}
            >
              Empty stage
            </div>

            <div
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: theme.subText,
                marginBottom: onAddDeal ? 14 : 0,
              }}
            >
              {emptyMessage}
            </div>

            {onAddDeal ? (
              <button
                type="button"
                onClick={() => onAddDeal(stageKey)}
                style={{
                  border: "none",
                  background: theme.primary,
                  color: theme.inverseText ?? "#ffffff",
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Create deal
              </button>
            ) : null}
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              mode={mode}
              compact
              onClick={onDealClick}
              onEdit={onEditDeal}
              onDelete={onDeleteDeal}
            />
          ))
        )}
      </div>
    </section>
  );
}