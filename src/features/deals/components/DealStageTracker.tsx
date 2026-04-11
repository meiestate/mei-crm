// src/features/deals/components/DealStageTracker.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { Deal } from "../api/dealsApi";

export type DealStageTrackerStage = {
  key: string;
  label: string;
  description?: string;
};

type DealStageTrackerProps = {
  deal: Deal | null;
  mode?: ThemeMode;
  loading?: boolean;
  stages?: DealStageTrackerStage[];
  onStageClick?: (stage: DealStageTrackerStage, deal: Deal) => void;
};

const DEFAULT_STAGES: DealStageTrackerStage[] = [
  {
    key: "new",
    label: "New",
    description: "Fresh opportunity entered into pipeline",
  },
  {
    key: "qualified",
    label: "Qualified",
    description: "Need, fit, and buyer intent validated",
  },
  {
    key: "proposal",
    label: "Proposal",
    description: "Commercials or offer shared",
  },
  {
    key: "negotiation",
    label: "Negotiation",
    description: "Active objections and pricing discussion",
  },
  {
    key: "won",
    label: "Won",
    description: "Deal successfully closed",
  },
];

function normalizeValue(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function getCurrentStageKey(deal: Deal | null): string {
  if (!deal) return "new";

  const stage = normalizeValue(deal.stage);
  const status = normalizeValue(deal.status);

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

function getProbability(deal: Deal | null): number {
  if (!deal) return 0;

  if (typeof deal.probability === "number" && Number.isFinite(deal.probability)) {
    return Math.max(0, Math.min(100, deal.probability));
  }

  const stageKey = getCurrentStageKey(deal);

  if (stageKey === "new") return 15;
  if (stageKey === "qualified") return 35;
  if (stageKey === "proposal") return 55;
  if (stageKey === "negotiation") return 75;
  if (stageKey === "won") return 100;
  if (stageKey === "lost") return 0;

  return 20;
}

function getStageMeta(
  state: "completed" | "current" | "upcoming" | "lost"
): {
  dotBg: string;
  dotColor: string;
  dotBorder: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  subTextColor: string;
} {
  if (state === "completed") {
    return {
      dotBg: "rgba(34, 197, 94, 0.14)",
      dotColor: "#16a34a",
      dotBorder: "rgba(34, 197, 94, 0.26)",
      cardBg: "rgba(34, 197, 94, 0.06)",
      cardBorder: "rgba(34, 197, 94, 0.16)",
      textColor: "#166534",
      subTextColor: "#15803d",
    };
  }

  if (state === "current") {
    return {
      dotBg: "rgba(59, 130, 246, 0.14)",
      dotColor: "#2563eb",
      dotBorder: "rgba(59, 130, 246, 0.26)",
      cardBg: "rgba(59, 130, 246, 0.06)",
      cardBorder: "rgba(59, 130, 246, 0.18)",
      textColor: "#1d4ed8",
      subTextColor: "#2563eb",
    };
  }

  if (state === "lost") {
    return {
      dotBg: "rgba(239, 68, 68, 0.14)",
      dotColor: "#dc2626",
      dotBorder: "rgba(239, 68, 68, 0.26)",
      cardBg: "rgba(239, 68, 68, 0.06)",
      cardBorder: "rgba(239, 68, 68, 0.18)",
      textColor: "#b91c1c",
      subTextColor: "#dc2626",
    };
  }

  return {
    dotBg: "rgba(100, 116, 139, 0.12)",
    dotColor: "#64748b",
    dotBorder: "rgba(100, 116, 139, 0.22)",
    cardBg: "transparent",
    cardBorder: "rgba(100, 116, 139, 0.14)",
    textColor: "#475569",
    subTextColor: "#64748b",
  };
}

export default function DealStageTracker({
  deal,
  mode = "light",
  loading = false,
  stages = DEFAULT_STAGES,
  onStageClick,
}: DealStageTrackerProps) {
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
        <div style={{ display: "grid", gap: 8 }}>
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
              width: "64%",
              height: 10,
              borderRadius: 999,
              background: theme.borderSoft,
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: 18,
                padding: 14,
                background: theme.cardBgSoft,
                display: "grid",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: theme.border,
                }}
              />
              <div
                style={{
                  width: "52%",
                  height: 12,
                  borderRadius: 999,
                  background: theme.border,
                }}
              />
              <div
                style={{
                  width: "86%",
                  height: 10,
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
            🧭
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: theme.text,
              marginBottom: 6,
            }}
          >
            No stage data available
          </div>
          <div
            style={{
              fontSize: 13,
              color: theme.subText,
            }}
          >
            Load a deal to view its current pipeline journey.
          </div>
        </div>
      </section>
    );
  }

  const currentStageKey = getCurrentStageKey(deal);
  const isLost = currentStageKey === "lost";
  const probability = getProbability(deal);

  const effectiveStages = isLost
    ? [
        ...stages.filter((stage) => stage.key !== "won"),
        {
          key: "lost",
          label: "Lost",
          description: "Deal closed without conversion",
        },
      ]
    : stages;

  const currentIndex = effectiveStages.findIndex(
    (stage) => stage.key === currentStageKey
  );

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
          display: "grid",
          gap: 10,
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
              Deal Stage Tracker
            </h3>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: 13,
                color: theme.subText,
              }}
            >
              A clean visual path from first touch to final outcome.
            </p>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              padding: "6px 12px",
              background: theme.cardBgSoft,
              border: `1px solid ${theme.border}`,
              color: theme.text,
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            Confidence: {probability}%
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
        {effectiveStages.map((stage, index) => {
          const state: "completed" | "current" | "upcoming" | "lost" =
            isLost && stage.key === "lost"
              ? "lost"
              : index < currentIndex
              ? "completed"
              : index === currentIndex
              ? "current"
              : "upcoming";

          const meta = getStageMeta(state);
          const clickable = Boolean(onStageClick);

          return (
            <button
              key={stage.key}
              type="button"
              onClick={() => onStageClick?.(stage, deal)}
              disabled={!clickable}
              style={{
                border: `1px solid ${
                  state === "current" || state === "lost"
                    ? meta.cardBorder
                    : theme.border
                }`,
                background:
                  state === "upcoming"
                    ? theme.cardBgSoft
                    : mode === "dark"
                    ? meta.cardBg
                    : meta.cardBg,
                borderRadius: 18,
                padding: 16,
                textAlign: "left",
                cursor: clickable ? "pointer" : "default",
                opacity: clickable ? 1 : 0.98,
                display: "grid",
                gap: 12,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {index < effectiveStages.length - 1 ? (
                <div
                  style={{
                    position: "absolute",
                    top: 32,
                    right: -24,
                    width: 48,
                    height: 2,
                    background:
                      index < currentIndex
                        ? "#16a34a"
                        : index === currentIndex && !isLost
                        ? theme.primary
                        : theme.border,
                    opacity: 0.75,
                  }}
                />
              ) : null}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: meta.dotBg,
                    color: meta.dotColor,
                    border: `1px solid ${meta.dotBorder}`,
                    fontSize: 14,
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  {state === "completed"
                    ? "✓"
                    : state === "current"
                    ? "•"
                    : state === "lost"
                    ? "×"
                    : index + 1}
                </div>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: 999,
                    padding: "4px 10px",
                    background:
                      state === "upcoming"
                        ? theme.cardBg
                        : mode === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "#ffffff",
                    border: `1px solid ${
                      state === "upcoming" ? theme.border : meta.cardBorder
                    }`,
                    color:
                      state === "upcoming" ? theme.subText : meta.subTextColor,
                    fontSize: 11,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {state === "completed"
                    ? "Completed"
                    : state === "current"
                    ? "Current"
                    : state === "lost"
                    ? "Closed Lost"
                    : "Upcoming"}
                </span>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 900,
                    color:
                      state === "upcoming" ? theme.text : meta.textColor,
                    lineHeight: 1.3,
                    marginBottom: 6,
                  }}
                >
                  {stage.label}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color:
                      state === "upcoming" ? theme.subText : meta.subTextColor,
                    wordBreak: "break-word",
                  }}
                >
                  {stage.description || "Pipeline stage"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}