// src/features/deals/components/DealsKanbanBoard.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { Deal } from "../api/dealsApi";
import DealColumn from "./DealColumn";

export type DealsKanbanStage = {
  key: string;
  title: string;
};

type DealsKanbanBoardProps = {
  deals?: Deal[];
  mode?: ThemeMode;
  loading?: boolean;
  stages?: DealsKanbanStage[];
  minHeight?: number | string;
  onAddDeal?: (stageKey?: string) => void;
  onDealClick?: (deal: Deal) => void;
  onEditDeal?: (deal: Deal) => void;
  onDeleteDeal?: (deal: Deal) => void;
};

const DEFAULT_STAGES: DealsKanbanStage[] = [
  { key: "new", title: "New" },
  { key: "qualified", title: "Qualified" },
  { key: "proposal", title: "Proposal" },
  { key: "negotiation", title: "Negotiation" },
  { key: "won", title: "Won" },
  { key: "lost", title: "Lost" },
];

function normalizeStage(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function getDealStageKey(deal: Deal): string {
  const stage = normalizeStage(deal.stage);
  const status = normalizeStage(deal.status);

  if (stage.includes("new")) return "new";
  if (stage.includes("qualif")) return "qualified";
  if (stage.includes("proposal")) return "proposal";
  if (stage.includes("negoti")) return "negotiation";
  if (stage.includes("won")) return "won";
  if (stage.includes("lost")) return "lost";

  if (status === "new") return "new";
  if (status === "qualified") return "qualified";
  if (status === "proposal") return "proposal";
  if (status === "negotiation") return "negotiation";
  if (status === "won") return "won";
  if (status === "lost") return "lost";

  return "new";
}

function getStageColor(title: string) {
  const value = title.toLowerCase();

  if (value.includes("new")) {
    return {
      bg: "rgba(59, 130, 246, 0.10)",
      border: "rgba(59, 130, 246, 0.20)",
      text: "#2563eb",
    };
  }

  if (value.includes("qualif")) {
    return {
      bg: "rgba(99, 102, 241, 0.10)",
      border: "rgba(99, 102, 241, 0.20)",
      text: "#4f46e5",
    };
  }

  if (value.includes("proposal")) {
    return {
      bg: "rgba(168, 85, 247, 0.10)",
      border: "rgba(168, 85, 247, 0.20)",
      text: "#7c3aed",
    };
  }

  if (value.includes("negoti")) {
    return {
      bg: "rgba(245, 158, 11, 0.10)",
      border: "rgba(245, 158, 11, 0.20)",
      text: "#d97706",
    };
  }

  if (value.includes("won")) {
    return {
      bg: "rgba(34, 197, 94, 0.10)",
      border: "rgba(34, 197, 94, 0.20)",
      text: "#16a34a",
    };
  }

  if (value.includes("lost")) {
    return {
      bg: "rgba(239, 68, 68, 0.10)",
      border: "rgba(239, 68, 68, 0.20)",
      text: "#dc2626",
    };
  }

  return {
    bg: "rgba(100, 116, 139, 0.10)",
    border: "rgba(100, 116, 139, 0.20)",
    text: "#475569",
  };
}

export default function DealsKanbanBoard({
  deals = [],
  mode = "light",
  loading = false,
  stages = DEFAULT_STAGES,
  minHeight = 560,
  onAddDeal,
  onDealClick,
  onEditDeal,
  onDeleteDeal,
}: DealsKanbanBoardProps) {
  const theme = getTheme(mode);

  const dealsByStage = stages.map((stage) => {
    const stageDeals = deals.filter((deal) => getDealStageKey(deal) === stage.key);

    const totalValue = stageDeals.reduce((sum, deal) => {
      const value =
        typeof deal.value === "number"
          ? deal.value
          : typeof deal.expectedValue === "number"
          ? deal.expectedValue
          : 0;

      return sum + value;
    }, 0);

    return {
      ...stage,
      deals: stageDeals,
      totalValue,
    };
  });

  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, deal) => {
    const value =
      typeof deal.value === "number"
        ? deal.value
        : typeof deal.expectedValue === "number"
        ? deal.expectedValue
        : 0;

    return sum + value;
  }, 0);

  const openDealsCount = deals.filter((deal) => {
    const stageKey = getDealStageKey(deal);
    return stageKey !== "won" && stageKey !== "lost";
  }).length;

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        boxShadow:
          mode === "dark"
            ? "0 16px 40px rgba(0,0,0,0.28)"
            : "0 16px 40px rgba(15, 23, 42, 0.07)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 20,
          borderBottom: `1px solid ${theme.border}`,
          background:
            mode === "dark"
              ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))"
              : "linear-gradient(180deg, rgba(248,250,252,0.85), rgba(248,250,252,0.45))",
          display: "grid",
          gap: 16,
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
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 900,
                color: theme.text,
                lineHeight: 1.2,
              }}
            >
              Deals Kanban Board
            </h2>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: 14,
                color: theme.subText,
              }}
            >
              Track movement across stages, spot bottlenecks, and push deals forward.
            </p>
          </div>

          {onAddDeal ? (
            <button
              type="button"
              onClick={() => onAddDeal()}
              style={{
                border: "none",
                background: theme.primary,
                color: theme.inverseText ?? "#ffffff",
                borderRadius: 12,
                padding: "12px 16px",
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              + Add Deal
            </button>
          ) : null}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
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
              Total Deals
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: theme.text,
                lineHeight: 1.2,
              }}
            >
              {totalDeals}
            </div>
          </div>

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
              Open Deals
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: theme.text,
                lineHeight: 1.2,
              }}
            >
              {openDealsCount}
            </div>
          </div>

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
              Pipeline Value
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: theme.text,
                lineHeight: 1.2,
              }}
            >
              ₹{new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(totalValue)}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {stages.map((stage) => {
            const color = getStageColor(stage.title);
            const stageCount = dealsByStage.find((item) => item.key === stage.key)?.deals.length ?? 0;

            return (
              <span
                key={stage.key}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 999,
                  padding: "6px 12px",
                  background: color.bg,
                  border: `1px solid ${color.border}`,
                  color: color.text,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                <span>{stage.title}</span>
                <span
                  style={{
                    background: mode === "dark" ? "rgba(255,255,255,0.08)" : "#ffffff",
                    borderRadius: 999,
                    padding: "2px 8px",
                    minWidth: 22,
                    textAlign: "center",
                  }}
                >
                  {stageCount}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <div
        style={{
          padding: 16,
          background: theme.pageBg,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            alignItems: "flex-start",
            minHeight,
            paddingBottom: 6,
          }}
        >
          {dealsByStage.map((stage) => (
            <DealColumn
              key={stage.key}
              title={stage.title}
              stageKey={stage.key}
              deals={stage.deals}
              totalValue={stage.totalValue}
              loading={loading}
              mode={mode}
              emptyMessage={`No deals in ${stage.title.toLowerCase()} stage yet.`}
              onAddDeal={onAddDeal}
              onDealClick={onDealClick}
              onEditDeal={onEditDeal}
              onDeleteDeal={onDeleteDeal}
            />
          ))}
        </div>
      </div>
    </section>
  );
}