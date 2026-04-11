// src/features/deals/components/DealQuickActionsCard.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { Deal } from "../api/dealsApi";

type DealQuickActionsCardProps = {
  deal: Deal | null;
  mode?: ThemeMode;
  loading?: boolean;
  onCallContact?: (deal: Deal) => void;
  onEmailContact?: (deal: Deal) => void;
  onScheduleMeeting?: (deal: Deal) => void;
  onAddTask?: (deal: Deal) => void;
  onAddNote?: (deal: Deal) => void;
  onChangeStage?: (deal: Deal) => void;
  onMarkWon?: (deal: Deal) => void;
  onMarkLost?: (deal: Deal) => void;
  onEditDeal?: (deal: Deal) => void;
  onDeleteDeal?: (deal: Deal) => void;
};

type QuickAction = {
  id: string;
  label: string;
  description: string;
  icon: string;
  tone: {
    bg: string;
    color: string;
    border: string;
  };
  onClick?: () => void;
};

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

  if (value === "proposal" || value === "negotiation") {
    return {
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#d97706",
      dot: "#d97706",
      label: status || "In Progress",
    };
  }

  if (value === "qualified" || value === "open" || value === "new") {
    return {
      bg: "rgba(59, 130, 246, 0.12)",
      color: "#2563eb",
      dot: "#2563eb",
      label: status || "Open",
    };
  }

  return {
    bg: "rgba(100, 116, 139, 0.12)",
    color: "#475569",
    dot: "#475569",
    label: status || "Unknown",
  };
}

function getStageProgress(stage?: string, probability?: number): number {
  if (typeof probability === "number" && Number.isFinite(probability)) {
    return Math.max(0, Math.min(100, probability));
  }

  const value = (stage ?? "").toLowerCase();

  if (value.includes("new")) return 15;
  if (value.includes("qualif")) return 35;
  if (value.includes("proposal")) return 55;
  if (value.includes("negoti")) return 75;
  if (value.includes("won")) return 100;
  if (value.includes("lost")) return 0;

  return 20;
}

export default function DealQuickActionsCard({
  deal,
  mode = "light",
  loading = false,
  onCallContact,
  onEmailContact,
  onScheduleMeeting,
  onAddTask,
  onAddNote,
  onChangeStage,
  onMarkWon,
  onMarkLost,
  onEditDeal,
  onDeleteDeal,
}: DealQuickActionsCardProps) {
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
              width: "42%",
              height: 12,
              borderRadius: 999,
              background: theme.border,
            }}
          />
          <div
            style={{
              width: "68%",
              height: 10,
              borderRadius: 999,
              background: theme.borderSoft,
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: theme.border,
                }}
              />
              <div
                style={{
                  width: "54%",
                  height: 10,
                  borderRadius: 999,
                  background: theme.border,
                }}
              />
              <div
                style={{
                  width: "82%",
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
            ⚡
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: theme.text,
              marginBottom: 6,
            }}
          >
            No deal actions available
          </div>
          <div
            style={{
              fontSize: 13,
              color: theme.subText,
            }}
          >
            Load a deal to unlock quick actions.
          </div>
        </div>
      </section>
    );
  }

  const statusTone = getStatusTone(deal.status);
  const progress = getStageProgress(deal.stage, deal.probability);

  const primaryActions: QuickAction[] = [
    {
      id: "call",
      label: "Call Contact",
      description: "Start a direct conversation and move the deal faster.",
      icon: "📞",
      tone: {
        bg: "rgba(59, 130, 246, 0.12)",
        color: "#2563eb",
        border: "rgba(59, 130, 246, 0.24)",
      },
      onClick: onCallContact ? () => onCallContact(deal) : undefined,
    },
    {
      id: "email",
      label: "Send Email",
      description: "Share documents, proposals, or next-step updates.",
      icon: "✉️",
      tone: {
        bg: "rgba(168, 85, 247, 0.12)",
        color: "#7c3aed",
        border: "rgba(168, 85, 247, 0.24)",
      },
      onClick: onEmailContact ? () => onEmailContact(deal) : undefined,
    },
    {
      id: "meeting",
      label: "Schedule Meeting",
      description: "Lock in a meeting and keep the momentum alive.",
      icon: "📅",
      tone: {
        bg: "rgba(14, 165, 233, 0.12)",
        color: "#0284c7",
        border: "rgba(14, 165, 233, 0.24)",
      },
      onClick: onScheduleMeeting ? () => onScheduleMeeting(deal) : undefined,
    },
    {
      id: "task",
      label: "Add Task",
      description: "Create a follow-up task tied to this deal.",
      icon: "✅",
      tone: {
        bg: "rgba(34, 197, 94, 0.12)",
        color: "#16a34a",
        border: "rgba(34, 197, 94, 0.24)",
      },
      onClick: onAddTask ? () => onAddTask(deal) : undefined,
    },
    {
      id: "note",
      label: "Add Note",
      description: "Capture objections, insights, and key context.",
      icon: "📝",
      tone: {
        bg: "rgba(245, 158, 11, 0.12)",
        color: "#d97706",
        border: "rgba(245, 158, 11, 0.24)",
      },
      onClick: onAddNote ? () => onAddNote(deal) : undefined,
    },
    {
      id: "stage",
      label: "Change Stage",
      description: "Move the deal forward in your pipeline.",
      icon: "🧭",
      tone: {
        bg: "rgba(99, 102, 241, 0.12)",
        color: "#4f46e5",
        border: "rgba(99, 102, 241, 0.24)",
      },
      onClick: onChangeStage ? () => onChangeStage(deal) : undefined,
    },
  ];

  const outcomeActions: QuickAction[] = [
    {
      id: "won",
      label: "Mark as Won",
      description: "Close the deal positively and record the success.",
      icon: "🏆",
      tone: {
        bg: "rgba(34, 197, 94, 0.12)",
        color: "#16a34a",
        border: "rgba(34, 197, 94, 0.24)",
      },
      onClick: onMarkWon ? () => onMarkWon(deal) : undefined,
    },
    {
      id: "lost",
      label: "Mark as Lost",
      description: "Close the loop and keep your pipeline clean.",
      icon: "📉",
      tone: {
        bg: "rgba(239, 68, 68, 0.12)",
        color: "#dc2626",
        border: "rgba(239, 68, 68, 0.24)",
      },
      onClick: onMarkLost ? () => onMarkLost(deal) : undefined,
    },
    {
      id: "edit",
      label: "Edit Deal",
      description: "Update values, owner, source, and core details.",
      icon: "✏️",
      tone: {
        bg: "rgba(100, 116, 139, 0.12)",
        color: "#475569",
        border: "rgba(100, 116, 139, 0.24)",
      },
      onClick: onEditDeal ? () => onEditDeal(deal) : undefined,
    },
    {
      id: "delete",
      label: "Delete Deal",
      description: "Remove this record from the active pipeline.",
      icon: "🗑️",
      tone: {
        bg: "rgba(127, 29, 29, 0.12)",
        color: "#b91c1c",
        border: "rgba(185, 28, 28, 0.24)",
      },
      onClick: onDeleteDeal ? () => onDeleteDeal(deal) : undefined,
    },
  ];

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
              Quick Actions
            </h3>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: 13,
                color: theme.subText,
              }}
            >
              Sharp moves for follow-up, conversion, and deal control.
            </p>
          </div>

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
        </div>

        <div
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            background: theme.cardBgSoft,
            padding: 14,
            display: "grid",
            gap: 8,
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
            <div
              style={{
                fontSize: 12,
                color: theme.mutedText,
                textTransform: "uppercase",
                letterSpacing: 0.6,
              }}
            >
              Deal Momentum
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              {progress}%
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
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          Primary Actions
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {primaryActions.map((action) => {
            const disabled = !action.onClick;

            return (
              <button
                key={action.id}
                type="button"
                onClick={action.onClick}
                disabled={disabled}
                style={{
                  border: `1px solid ${action.tone.border}`,
                  background: action.tone.bg,
                  color: action.tone.color,
                  borderRadius: 16,
                  padding: 14,
                  textAlign: "left",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.55 : 1,
                  display: "grid",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: mode === "dark" ? "rgba(255,255,255,0.06)" : "#ffffff",
                    border: `1px solid ${action.tone.border}`,
                    fontSize: 20,
                  }}
                >
                  {action.icon}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      lineHeight: 1.3,
                      marginBottom: 6,
                    }}
                  >
                    {action.label}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      lineHeight: 1.55,
                      color: action.tone.color,
                    }}
                  >
                    {action.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          Outcome & Record Control
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {outcomeActions.map((action) => {
            const disabled = !action.onClick;

            return (
              <button
                key={action.id}
                type="button"
                onClick={action.onClick}
                disabled={disabled}
                style={{
                  border: `1px solid ${action.tone.border}`,
                  background: action.tone.bg,
                  color: action.tone.color,
                  borderRadius: 16,
                  padding: 14,
                  textAlign: "left",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.55 : 1,
                  display: "grid",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: mode === "dark" ? "rgba(255,255,255,0.06)" : "#ffffff",
                    border: `1px solid ${action.tone.border}`,
                    fontSize: 20,
                  }}
                >
                  {action.icon}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      lineHeight: 1.3,
                      marginBottom: 6,
                    }}
                  >
                    {action.label}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      lineHeight: 1.55,
                      color: action.tone.color,
                    }}
                  >
                    {action.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}