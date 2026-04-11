// src/features/deals/components/DealRiskFlagsCard.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { Deal } from "../api/dealsApi";

type DealRiskFlagsCardProps = {
  deal: Deal | null;
  mode?: ThemeMode;
  loading?: boolean;
  onResolveRisk?: (riskId: string, deal: Deal) => void;
};

type RiskFlag = {
  id: string;
  level: "high" | "medium" | "low";
  title: string;
  description: string;
  recommendation: string;
};

function isValidDate(value?: string): boolean {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function daysBetweenToday(value?: string): number | null {
  if (!isValidDate(value)) return null;

  const target = new Date(value as string);
  const now = new Date();

  const targetStart = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = targetStart.getTime() - nowStart.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

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

function getProbability(deal: Deal | null): number {
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

function getRiskTone(level: RiskFlag["level"]) {
  if (level === "high") {
    return {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#dc2626",
      border: "rgba(239, 68, 68, 0.24)",
      icon: "🚨",
      label: "High Risk",
    };
  }

  if (level === "medium") {
    return {
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#d97706",
      border: "rgba(245, 158, 11, 0.24)",
      icon: "⚠️",
      label: "Medium Risk",
    };
  }

  return {
    bg: "rgba(59, 130, 246, 0.12)",
    color: "#2563eb",
    border: "rgba(59, 130, 246, 0.24)",
    icon: "🔎",
    label: "Low Risk",
  };
}

function buildRiskFlags(deal: Deal | null): RiskFlag[] {
  if (!deal) return [];

  const risks: RiskFlag[] = [];
  const probability = getProbability(deal);
  const expectedCloseDays = daysBetweenToday(deal.expectedCloseDate);
  const value = deal.value ?? deal.expectedValue ?? 0;
  const status = (deal.status ?? "").toLowerCase();
  const stage = (deal.stage ?? "").toLowerCase();
  const priority = (deal.priority ?? "").toLowerCase();

  if (!deal.owner) {
    risks.push({
      id: "missing-owner",
      level: "high",
      title: "No owner assigned",
      description:
        "This deal currently has no clear owner, which can cause follow-up gaps and accountability issues.",
      recommendation:
        "Assign a deal owner immediately so next actions have a clear driver.",
    });
  }

  if (!deal.expectedCloseDate) {
    risks.push({
      id: "missing-close-date",
      level: "medium",
      title: "Missing expected close date",
      description:
        "Without a target close date, the team may struggle to pace negotiations and forecast revenue accurately.",
      recommendation:
        "Set an expected close date and align follow-up tasks around that timeline.",
    });
  }

  if (expectedCloseDays !== null && expectedCloseDays < 0 && status !== "won" && status !== "lost") {
    risks.push({
      id: "overdue-close-date",
      level: "high",
      title: "Expected close date is overdue",
      description:
        "The planned close date has already passed, but the deal is still active in the pipeline.",
      recommendation:
        "Review the current blocker, update the timeline, and re-qualify the opportunity.",
    });
  }

  if (probability < 30 && (stage.includes("proposal") || stage.includes("negoti"))) {
    risks.push({
      id: "late-stage-low-probability",
      level: "high",
      title: "Low probability for late-stage deal",
      description:
        "The deal is sitting in a deeper stage, but conversion confidence is still weak.",
      recommendation:
        "Reassess objections, decision-maker access, and pricing fit before investing more time.",
    });
  }

  if (probability >= 70 && stage.includes("new")) {
    risks.push({
      id: "high-probability-early-stage",
      level: "medium",
      title: "High probability but still in early stage",
      description:
        "Confidence looks strong, yet the deal has not been advanced through the pipeline.",
      recommendation:
        "Move the deal to the right stage and schedule the next concrete step.",
    });
  }

  if (!deal.contactName && !deal.leadName) {
    risks.push({
      id: "missing-person-link",
      level: "medium",
      title: "No linked contact or lead",
      description:
        "This record is not tied to a person, which can make outreach and context tracking messy.",
      recommendation:
        "Link the deal to the right contact or lead to centralize communication.",
    });
  }

  if (!deal.source) {
    risks.push({
      id: "missing-source",
      level: "low",
      title: "Lead source not captured",
      description:
        "The deal source is missing, reducing clarity on channel performance and attribution.",
      recommendation:
        "Add the acquisition source for better reporting and campaign insights.",
    });
  }

  if (value <= 0) {
    risks.push({
      id: "missing-value",
      level: "medium",
      title: "Deal value not set",
      description:
        "Revenue impact cannot be measured properly because the deal value is empty or zero.",
      recommendation:
        "Enter the current value or expected value to improve forecasting quality.",
    });
  }

  if (value > 0 && probability < 20 && priority === "urgent") {
    risks.push({
      id: "urgent-low-confidence",
      level: "high",
      title: "Urgent deal with weak confidence",
      description:
        "The deal is marked urgent, but the conversion probability is very low.",
      recommendation:
        "Validate urgency, confirm buying intent, and avoid overcommitting resources too early.",
    });
  }

  if (status === "won" && stage !== "won") {
    risks.push({
      id: "status-stage-mismatch-won",
      level: "medium",
      title: "Won status and stage do not match",
      description:
        "The deal is marked as won, but the pipeline stage suggests otherwise.",
      recommendation:
        "Align stage and status so reporting and dashboards stay trustworthy.",
    });
  }

  if (status === "lost" && stage !== "lost") {
    risks.push({
      id: "status-stage-mismatch-lost",
      level: "medium",
      title: "Lost status and stage do not match",
      description:
        "The deal is marked as lost, but the current stage still shows it active elsewhere.",
      recommendation:
        "Update the stage to reflect the real outcome and keep the board clean.",
    });
  }

  return risks;
}

export default function DealRiskFlagsCard({
  deal,
  mode = "light",
  loading = false,
  onResolveRisk,
}: DealRiskFlagsCardProps) {
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
              width: "72%",
              height: 10,
              borderRadius: 999,
              background: theme.borderSoft,
            }}
          />
        </div>

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
                width: "28%",
                height: 10,
                borderRadius: 999,
                background: theme.border,
              }}
            />
            <div
              style={{
                width: "56%",
                height: 14,
                borderRadius: 999,
                background: theme.borderSoft,
              }}
            />
            <div
              style={{
                width: "92%",
                height: 10,
                borderRadius: 999,
                background: theme.borderSoft,
              }}
            />
            <div
              style={{
                width: "74%",
                height: 10,
                borderRadius: 999,
                background: theme.borderSoft,
              }}
            />
          </div>
        ))}
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
            🛡️
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: theme.text,
              marginBottom: 6,
            }}
          >
            No risk data available
          </div>
          <div
            style={{
              fontSize: 13,
              color: theme.subText,
            }}
          >
            Load a deal to inspect possible pipeline risks.
          </div>
        </div>
      </section>
    );
  }

  const risks = buildRiskFlags(deal);
  const probability = getProbability(deal);
  const dealValue = deal.value ?? deal.expectedValue ?? 0;
  const highRiskCount = risks.filter((risk) => risk.level === "high").length;
  const mediumRiskCount = risks.filter((risk) => risk.level === "medium").length;

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
            Deal Risk Flags
          </h3>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: 13,
              color: theme.subText,
            }}
          >
            Early warning signals that can quietly damage conversion, forecasting, or ownership clarity.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: 999,
              padding: "6px 12px",
              background: "rgba(239, 68, 68, 0.12)",
              color: "#dc2626",
              border: "1px solid rgba(239, 68, 68, 0.24)",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            High: {highRiskCount}
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: 999,
              padding: "6px 12px",
              background: "rgba(245, 158, 11, 0.12)",
              color: "#d97706",
              border: "1px solid rgba(245, 158, 11, 0.24)",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            Medium: {mediumRiskCount}
          </span>
        </div>
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
            background: theme.cardBgSoft,
            padding: 14,
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
              fontSize: 18,
              fontWeight: 900,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            {formatCurrency(dealValue, deal.currency)}
          </div>
        </div>

        <div
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            background: theme.cardBgSoft,
            padding: 14,
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
            Conversion Confidence
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            {probability}%
          </div>
        </div>

        <div
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            background: theme.cardBgSoft,
            padding: 14,
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
            Total Flags
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            {risks.length}
          </div>
        </div>
      </div>

      {risks.length === 0 ? (
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
            ✅
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: theme.text,
              marginBottom: 6,
            }}
          >
            No obvious risks detected
          </div>
          <div
            style={{
              fontSize: 13,
              color: theme.subText,
            }}
          >
            This deal looks structurally healthy based on current data.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {risks.map((risk) => {
            const tone = getRiskTone(risk.level);

            return (
              <div
                key={risk.id}
                style={{
                  border: `1px solid ${tone.border}`,
                  borderRadius: 18,
                  background: tone.bg,
                  padding: 16,
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
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "44px 1fr",
                      gap: 12,
                      alignItems: "start",
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: mode === "dark" ? "rgba(255,255,255,0.06)" : "#ffffff",
                        border: `1px solid ${tone.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    >
                      {tone.icon}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: 999,
                          padding: "4px 10px",
                          background: mode === "dark" ? "rgba(255,255,255,0.06)" : "#ffffff",
                          border: `1px solid ${tone.border}`,
                          color: tone.color,
                          fontSize: 12,
                          fontWeight: 800,
                          marginBottom: 8,
                        }}
                      >
                        {tone.label}
                      </div>

                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 900,
                          color: theme.text,
                          lineHeight: 1.35,
                          marginBottom: 6,
                          wordBreak: "break-word",
                        }}
                      >
                        {risk.title}
                      </div>

                      <div
                        style={{
                          fontSize: 13,
                          lineHeight: 1.65,
                          color: theme.subText,
                          wordBreak: "break-word",
                        }}
                      >
                        {risk.description}
                      </div>
                    </div>
                  </div>

                  {onResolveRisk ? (
                    <button
                      type="button"
                      onClick={() => onResolveRisk(risk.id, deal)}
                      style={{
                        border: "none",
                        background: theme.primary,
                        color: theme.inverseText ?? "#ffffff",
                        borderRadius: 12,
                        padding: "10px 14px",
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      Resolve
                    </button>
                  ) : null}
                </div>

                <div
                  style={{
                    border: `1px solid ${theme.border}`,
                    borderRadius: 14,
                    background: mode === "dark" ? "rgba(255,255,255,0.03)" : "#ffffff",
                    padding: 12,
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
                    Recommendation
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: theme.text,
                      lineHeight: 1.6,
                      wordBreak: "break-word",
                    }}
                  >
                    {risk.recommendation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}