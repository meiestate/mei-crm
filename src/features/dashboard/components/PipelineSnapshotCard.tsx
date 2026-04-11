// src/features/dashboard/components/PipelineSnapshotCard.tsx

import { getTheme, type ThemeMode } from "../../../theme";
import type { DashboardPipelineStage } from "../api/dashboardApi";

type PipelineSnapshotCardProps = {
  items?: DashboardPipelineStage[];
  mode?: ThemeMode;
  loading?: boolean;
  title?: string;
  onViewAll?: () => void;
  onStageClick?: (stage: DashboardPipelineStage) => void;
};

function formatCurrency(value?: number): string {
  const amount = typeof value === "number" && Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStageTone(index: number) {
  const tones = [
    {
      bg: "rgba(59, 130, 246, 0.12)",
      color: "#2563eb",
      border: "rgba(59, 130, 246, 0.22)",
      bar: "#3b82f6",
    },
    {
      bg: "rgba(168, 85, 247, 0.12)",
      color: "#7c3aed",
      border: "rgba(168, 85, 247, 0.22)",
      bar: "#8b5cf6",
    },
    {
      bg: "rgba(16, 185, 129, 0.12)",
      color: "#059669",
      border: "rgba(16, 185, 129, 0.22)",
      bar: "#10b981",
    },
    {
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#d97706",
      border: "rgba(245, 158, 11, 0.22)",
      bar: "#f59e0b",
    },
    {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#dc2626",
      border: "rgba(239, 68, 68, 0.22)",
      bar: "#ef4444",
    },
    {
      bg: "rgba(99, 102, 241, 0.12)",
      color: "#4f46e5",
      border: "rgba(99, 102, 241, 0.22)",
      bar: "#6366f1",
    },
  ];

  return tones[index % tones.length];
}

export default function PipelineSnapshotCard({
  items = [],
  mode = "light",
  loading = false,
  title = "Pipeline Snapshot",
  onViewAll,
  onStageClick,
}: PipelineSnapshotCardProps) {
  const theme = getTheme(mode);

  const totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);
  const totalCount = items.reduce((sum, item) => sum + (item.count || 0), 0);
  const maxValue = Math.max(...items.map((item) => item.value || 0), 0);

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
        minHeight: 380,
        display: "flex",
        flexDirection: "column",
        gap: 16,
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
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h3>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: theme.subText,
            }}
          >
            Live view of deal movement across your pipeline stages.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          style={{
            border: `1px solid ${theme.border}`,
            background: theme.cardBgSoft,
            color: theme.text,
            borderRadius: 10,
            padding: "8px 12px",
            fontSize: 13,
            fontWeight: 600,
            cursor: onViewAll ? "pointer" : "default",
            opacity: onViewAll ? 1 : 0.72,
          }}
        >
          View All
        </button>
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
            background: theme.cardBgSoft,
            borderRadius: 16,
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: theme.mutedText,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Total Pipeline Value
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            ₹{formatCurrency(totalValue)}
          </div>
        </div>

        <div
          style={{
            border: `1px solid ${theme.border}`,
            background: theme.cardBgSoft,
            borderRadius: 16,
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: theme.mutedText,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Total Deals
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            {totalCount}
          </div>
        </div>
      </div>

      {loading ? (
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              style={{
                border: `1px solid ${theme.borderSoft}`,
                background: theme.cardBgSoft,
                borderRadius: 16,
                padding: 14,
                display: "grid",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 12,
                  width: "40%",
                  background: theme.border,
                  borderRadius: 999,
                }}
              />
              <div
                style={{
                  height: 10,
                  width: "70%",
                  background: theme.borderSoft,
                  borderRadius: 999,
                }}
              />
              <div
                style={{
                  height: 8,
                  width: "100%",
                  background: theme.borderSoft,
                  borderRadius: 999,
                }}
              />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          style={{
            flex: 1,
            border: `1px dashed ${theme.border}`,
            borderRadius: 18,
            background: theme.cardBgSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 34,
                lineHeight: 1,
                marginBottom: 10,
              }}
            >
              📊
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: theme.text,
                marginBottom: 6,
              }}
            >
              No pipeline data
            </div>
            <div
              style={{
                fontSize: 13,
                color: theme.subText,
              }}
            >
              Deals will start painting the pipeline once records are added.
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {items.map((item, index) => {
            const tone = getStageTone(index);
            const widthPercent =
              maxValue > 0 ? Math.max(8, Math.round((item.value / maxValue) * 100)) : 8;

            return (
              <button
                key={`${item.stage}-${index}`}
                type="button"
                onClick={() => onStageClick?.(item)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: `1px solid ${theme.borderSoft}`,
                  background: theme.cardBgSoft,
                  borderRadius: 16,
                  padding: 14,
                  cursor: onStageClick ? "pointer" : "default",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: 999,
                        padding: "4px 10px",
                        background: tone.bg,
                        color: tone.color,
                        border: `1px solid ${tone.border}`,
                        fontSize: 12,
                        fontWeight: 700,
                        marginBottom: 8,
                      }}
                    >
                      {item.stage}
                    </div>

                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: theme.text,
                        lineHeight: 1.2,
                      }}
                    >
                      ₹{formatCurrency(item.value)}
                    </div>
                  </div>

                  <div
                    style={{
                      minWidth: 72,
                      textAlign: "right",
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
                      Deals
                    </div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: theme.text,
                      }}
                    >
                      {item.count}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: theme.border,
                    overflow: "hidden",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: `${widthPercent}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: tone.bar,
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    fontSize: 12,
                    color: theme.subText,
                  }}
                >
                  <span>
                    Share of pipeline:{" "}
                    <strong style={{ color: theme.text }}>
                      {totalValue > 0
                        ? `${Math.round((item.value / totalValue) * 100)}%`
                        : "0%"}
                    </strong>
                  </span>

                  <span>
                    Avg per deal:{" "}
                    <strong style={{ color: theme.text }}>
                      ₹
                      {formatCurrency(
                        item.count > 0 ? Math.round(item.value / item.count) : 0
                      )}
                    </strong>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}