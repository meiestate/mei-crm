import React from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type PipelineStageItem = {
  stage:
    | "new"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "won"
    | "lost"
    | "on_hold";
  count: number;
  value?: number;
  currency?: string;
};

type PipelineSnapshotCardProps = {
  mode: ThemeMode;
  items: PipelineStageItem[];
  title?: string;
  onStageClick?: (item: PipelineStageItem) => void;
  onViewPipeline?: () => void;
};

export default function PipelineSnapshotCard({
  mode,
  items,
  title = "Pipeline Snapshot",
  onStageClick,
  onViewPipeline,
}: PipelineSnapshotCardProps) {
  const theme = getTheme(mode);

  const sortedItems = [...items].sort(
    (a, b) => getStageOrder(a.stage) - getStageOrder(b.stage)
  );

  const totalCount = sortedItems.reduce((sum, item) => sum + item.count, 0);
  const totalValue = sortedItems.reduce((sum, item) => sum + (item.value ?? 0), 0);
  const openItems = sortedItems.filter(
    (item) => !["won", "lost"].includes(item.stage)
  );
  const openCount = openItems.reduce((sum, item) => sum + item.count, 0);
  const openValue = openItems.reduce((sum, item) => sum + (item.value ?? 0), 0);
  const wonCount = sortedItems.find((item) => item.stage === "won")?.count ?? 0;
  const lostCount = sortedItems.find((item) => item.stage === "lost")?.count ?? 0;

  const weightedValue = sortedItems.reduce((sum, item) => {
    return sum + (item.value ?? 0) * getStageWeight(item.stage);
  }, 0);

  const topStage =
    [...openItems].sort((a, b) => (b.value ?? 0) - (a.value ?? 0))[0] ||
    [...sortedItems].sort((a, b) => (b.value ?? 0) - (a.value ?? 0))[0];

  const currency = sortedItems[0]?.currency || "INR";
  const winRate =
    wonCount + lostCount > 0 ? Math.round((wonCount / (wonCount + lostCount)) * 100) : 0;

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
            A clear stage-by-stage view of active opportunities, value, and momentum.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <MiniStat mode={mode} label="Open Deals" value={String(openCount)} />
          <MiniStat mode={mode} label="Win Rate" value={`${winRate}%`} />
          <MiniStat
            mode={mode}
            label="Weighted"
            value={formatCurrency(weightedValue, currency)}
          />
          {onViewPipeline ? (
            <button
              onClick={onViewPipeline}
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
              View Pipeline
            </button>
          ) : null}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {sortedItems.length === 0 ? (
          <EmptyState mode={mode} />
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              <SummaryTile
                mode={mode}
                label="Total Pipeline"
                value={formatCurrency(totalValue, currency)}
                subValue={`${totalCount} deals`}
              />
              <SummaryTile
                mode={mode}
                label="Open Value"
                value={formatCurrency(openValue, currency)}
                subValue={`${openCount} open`}
              />
              <SummaryTile
                mode={mode}
                label="Weighted Forecast"
                value={formatCurrency(weightedValue, currency)}
                subValue="Probability adjusted"
              />
            </div>

            {topStage ? (
              <div
                style={{
                  background:
                    mode === "dark"
                      ? "linear-gradient(135deg, rgba(99,102,241,0.14), rgba(59,130,246,0.10))"
                      : "linear-gradient(135deg, rgba(99,102,241,0.10), rgba(59,130,246,0.06))",
                  border: `1px solid ${theme.border}`,
                  borderRadius: 18,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: theme.subText,
                    marginBottom: 8,
                    letterSpacing: 0.3,
                  }}
                >
                  STRONGEST PIPELINE STAGE
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: theme.text,
                        lineHeight: 1.2,
                      }}
                    >
                      {formatStageLabel(topStage.stage)}
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 13,
                        color: theme.subText,
                        lineHeight: 1.6,
                      }}
                    >
                      {topStage.count} deals • {formatCurrency(topStage.value ?? 0, currency)}
                    </div>
                  </div>

                  <Badge
                    mode={mode}
                    label={`${Math.round(getStageWeight(topStage.stage) * 100)}% weight`}
                    tone={getStageTone(topStage.stage)}
                  />
                </div>
              </div>
            ) : null}

            <div style={{ display: "grid", gap: 12 }}>
              {sortedItems.map((item) => {
                const countShare = totalCount ? (item.count / totalCount) * 100 : 0;
                const valueShare = totalValue ? ((item.value ?? 0) / totalValue) * 100 : 0;
                const clickable = Boolean(onStageClick);

                return (
                  <div
                    key={item.stage}
                    onClick={() => onStageClick?.(item)}
                    style={{
                      background: theme.cardBgSoft,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 16,
                      padding: 14,
                      cursor: clickable ? "pointer" : "default",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: 12,
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 800,
                              color: theme.text,
                              lineHeight: 1.3,
                            }}
                          >
                            {formatStageLabel(item.stage)}
                          </div>

                          <Badge
                            mode={mode}
                            label={`${Math.round(getStageWeight(item.stage) * 100)}%`}
                            tone={getStageTone(item.stage)}
                          />
                        </div>

                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: theme.subText,
                            lineHeight: 1.5,
                          }}
                        >
                          {item.count} deals • {countShare.toFixed(1)}% of pipeline
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: theme.text,
                            lineHeight: 1,
                          }}
                        >
                          {formatCurrency(item.value ?? 0, item.currency || currency)}
                        </div>
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 12,
                            color: theme.subText,
                            lineHeight: 1.4,
                          }}
                        >
                          {valueShare.toFixed(1)}% value share
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 8 }}>
                      <ProgressRow
                        mode={mode}
                        label="Deal Share"
                        value={countShare}
                        accent={getProgressAccent(item.stage, "count")}
                      />
                      <ProgressRow
                        mode={mode}
                        label="Value Share"
                        value={valueShare}
                        accent={getProgressAccent(item.stage, "value")}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 16,
                background: theme.cardBgSoft,
                border: `1px solid ${theme.border}`,
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
                    fontWeight: 800,
                    color: theme.subText,
                    marginBottom: 6,
                  }}
                >
                  PIPELINE HEALTH NOTE
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: theme.text,
                    lineHeight: 1.3,
                  }}
                >
                  {getPipelineHealthText(openCount, winRate, weightedValue, openValue)}
                </div>
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: theme.subText,
                  lineHeight: 1.6,
                  maxWidth: 280,
                  textAlign: "right",
                }}
              >
                Weighted forecast helps you see likely revenue, not just optimistic volume.
              </div>
            </div>
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
          📈
        </div>

        <h4
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          No pipeline data available
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
          Once deals move through stages, the pipeline snapshot will appear here with value and forecast clarity.
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
        minWidth: 72,
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

function SummaryTile({
  mode,
  label,
  value,
  subValue,
}: {
  mode: ThemeMode;
  label: string;
  value: string;
  subValue: string;
}) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        background: theme.cardBgSoft,
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        padding: 14,
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
        {label}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: theme.text,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 12,
          color: theme.subText,
          lineHeight: 1.5,
        }}
      >
        {subValue}
      </div>
    </div>
  );
}

function ProgressRow({
  mode,
  label,
  value,
  accent,
}: {
  mode: ThemeMode;
  label: string;
  value: number;
  accent: string;
}) {
  const theme = getTheme(mode);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 6,
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
            fontSize: 12,
            fontWeight: 700,
            color: theme.text,
          }}
        >
          {value.toFixed(1)}%
        </span>
      </div>

      <div
        style={{
          height: 10,
          borderRadius: 999,
          background: theme.sectionBg,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
            height: "100%",
            borderRadius: 999,
            background: accent,
          }}
        />
      </div>
    </div>
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

function getStageOrder(stage: PipelineStageItem["stage"]) {
  switch (stage) {
    case "new":
      return 1;
    case "qualified":
      return 2;
    case "proposal":
      return 3;
    case "negotiation":
      return 4;
    case "won":
      return 5;
    case "lost":
      return 6;
    case "on_hold":
      return 7;
    default:
      return 99;
  }
}

function getStageWeight(stage: PipelineStageItem["stage"]) {
  switch (stage) {
    case "new":
      return 0.1;
    case "qualified":
      return 0.3;
    case "proposal":
      return 0.55;
    case "negotiation":
      return 0.75;
    case "won":
      return 1;
    case "lost":
      return 0;
    case "on_hold":
      return 0.2;
    default:
      return 0;
  }
}

function formatStageLabel(stage: PipelineStageItem["stage"]) {
  switch (stage) {
    case "new":
      return "New";
    case "qualified":
      return "Qualified";
    case "proposal":
      return "Proposal";
    case "negotiation":
      return "Negotiation";
    case "won":
      return "Won";
    case "lost":
      return "Lost";
    case "on_hold":
      return "On Hold";
    default:
      return "Stage";
  }
}

function getStageTone(
  stage: PipelineStageItem["stage"]
): "success" | "warning" | "danger" | "neutral" | "info" {
  switch (stage) {
    case "won":
      return "success";
    case "lost":
      return "danger";
    case "proposal":
    case "negotiation":
      return "warning";
    case "qualified":
      return "info";
    case "new":
    case "on_hold":
    default:
      return "neutral";
  }
}

function getProgressAccent(
  stage: PipelineStageItem["stage"],
  type: "count" | "value"
) {
  if (stage === "won") return "linear-gradient(90deg, #16a34a, #22c55e)";
  if (stage === "lost") return "linear-gradient(90deg, #dc2626, #ef4444)";
  if (stage === "negotiation") return "linear-gradient(90deg, #d97706, #f59e0b)";
  if (stage === "proposal") return "linear-gradient(90deg, #ca8a04, #facc15)";
  if (stage === "qualified") return "linear-gradient(90deg, #2563eb, #60a5fa)";
  if (stage === "new") return type === "count"
    ? "linear-gradient(90deg, #64748b, #94a3b8)"
    : "linear-gradient(90deg, #475569, #94a3b8)";
  return "linear-gradient(90deg, #6b7280, #9ca3af)";
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

function getPipelineHealthText(
  openCount: number,
  winRate: number,
  weightedValue: number,
  openValue: number
) {
  if (openCount === 0) return "Pipeline is empty — fresh opportunities need to be added.";
  if (winRate >= 40 && weightedValue > openValue * 0.45) {
    return "Healthy pipeline with strong close potential.";
  }
  if (winRate >= 25) {
    return "Pipeline is moving, but stage progression can be sharpened.";
  }
  return "Pipeline needs tighter qualification and stronger conversion discipline.";
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