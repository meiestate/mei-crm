import React, { memo, useMemo } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CircleAlert,
  CircleDashed,
  CircleDollarSign,
  CircleGauge,
  CircleUserRound,
  Flame,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Clock3,
  BriefcaseBusiness,
} from "lucide-react";

type DealHealth = "excellent" | "good" | "average" | "at-risk" | "critical";
type TrendDirection = "up" | "down" | "neutral";
type InsightTone = "positive" | "warning" | "critical" | "info";

export type DealInsightItem = {
  id: string;
  title: string;
  description?: string;
  tone?: InsightTone;
};

export type DealInsightData = {
  dealName: string;
  stage: string;
  owner: string;
  accountName?: string;
  value: string;
  winProbability: number;
  expectedCloseDate?: string;
  progressPercentage?: number;
  health?: DealHealth;
  trend?: TrendDirection;
  trendLabel?: string;
  summary?: string;
  strengths?: DealInsightItem[];
  risks?: DealInsightItem[];
  nextActions?: DealInsightItem[];
};

type Props = {
  data?: DealInsightData | null;
  loading?: boolean;
  empty?: boolean;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  actionLabel?: string;
  className?: string;
  onActionClick?: () => void;
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  borderRadius: 24,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  position: "relative",
  padding: 20,
  borderBottom: "1px solid #e2e8f0",
  background:
    "linear-gradient(135deg, rgba(239,246,255,1) 0%, rgba(248,250,252,1) 58%, rgba(255,255,255,1) 100%)",
};

const glowStyle: React.CSSProperties = {
  position: "absolute",
  right: -30,
  top: -50,
  width: 180,
  height: 180,
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(37,99,235,0.14) 0%, rgba(37,99,235,0) 72%)",
  pointerEvents: "none",
};

const headerRowStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 14,
  flexWrap: "wrap",
};

const titleWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
  flex: 1,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.03em",
  lineHeight: 1.2,
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1.6,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 800,
  border: "1px solid #dbeafe",
  background: "#eff6ff",
  color: "#1d4ed8",
};

const contentStyle: React.CSSProperties = {
  padding: 20,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.05fr) minmax(320px, 0.95fr)",
  gap: 16,
  minWidth: 0,
};

const columnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
};

const sectionStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  background: "#ffffff",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  minWidth: 0,
};

const sectionTitleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.02em",
};

const topStatGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const statItemStyle: React.CSSProperties = {
  border: "1px solid #edf2f7",
  borderRadius: 16,
  background: "#f8fafc",
  padding: "13px 14px",
  display: "flex",
  flexDirection: "column",
  gap: 7,
  minWidth: 0,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const valueStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: "#0f172a",
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const helperTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.7,
};

const heroMetricWrapStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 160px",
  gap: 14,
  alignItems: "stretch",
};

const probabilityCardStyle: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid #dbeafe",
  background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 10,
};

const probabilityValueStyle: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 900,
  color: "#1d4ed8",
  letterSpacing: "-0.04em",
  lineHeight: 1,
};

const progressWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const progressTrackStyle: React.CSSProperties = {
  width: "100%",
  height: 10,
  borderRadius: 999,
  background: "#e2e8f0",
  overflow: "hidden",
};

const insightListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const insightItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
};

const insightIconWrapStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 10,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const insightTextWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  minWidth: 0,
};

const insightTitleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: "#0f172a",
  lineHeight: 1.45,
};

const insightDescriptionStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.65,
};

const footerStyle: React.CSSProperties = {
  padding: "0 20px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const footerButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #dbe3ef",
  background: "#ffffff",
  color: "#334155",
  borderRadius: 12,
  padding: "10px 14px",
  fontSize: 12,
  fontWeight: 800,
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  cursor: "pointer",
};

const emptyStateStyle: React.CSSProperties = {
  padding: 28,
  margin: 20,
  borderRadius: 18,
  border: "1px dashed #cbd5e1",
  background: "#f8fafc",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  textAlign: "center",
};

const skeletonStyle: React.CSSProperties = {
  borderRadius: 12,
  background:
    "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)",
  backgroundSize: "200% 100%",
  animation: "dealInsightCardPulse 1.4s ease-in-out infinite",
};

function DealInsightCard({
  data,
  loading = false,
  empty = false,
  title = "Deal Insight",
  subtitle = "Track deal health, pipeline momentum, risks, and next-best actions in one premium snapshot.",
  emptyTitle = "No deal insight available",
  emptyDescription = "Select a deal or connect analytics data to view probability, stage momentum, and action recommendations.",
  actionLabel = "View Deal Details",
  className,
  onActionClick,
}: Props) {
  const safeData = useMemo<DealInsightData | null>(() => {
    if (data) return data;

    return {
      dealName: "Prestige North Plot Opportunity",
      stage: "Negotiation",
      owner: "Arun Prakash",
      accountName: "Rajesh Kumar",
      value: "₹48,00,000",
      winProbability: 72,
      expectedCloseDate: "2026-04-28",
      progressPercentage: 68,
      health: "good",
      trend: "up",
      trendLabel: "+8.4% vs last review",
      summary:
        "This deal is moving with healthy intent signals, but it still depends on fast legal clarity and structured follow-up cadence to close on time.",
      strengths: [
        {
          id: "s1",
          title: "Buyer intent is strong",
          description: "Recent interactions show active interest and quicker response turnaround.",
          tone: "positive",
        },
        {
          id: "s2",
          title: "Commercial alignment is improving",
          description: "Value perception is strengthening after the latest project discussion.",
          tone: "info",
        },
      ],
      risks: [
        {
          id: "r1",
          title: "Delay risk around documentation",
          description: "Any slowdown in legal or approval paperwork could push the close date.",
          tone: "warning",
        },
      ],
      nextActions: [
        {
          id: "a1",
          title: "Schedule decision-focused follow-up",
          description: "Use urgency and clarity around next milestone to maintain deal energy.",
          tone: "info",
        },
        {
          id: "a2",
          title: "Prepare objection-handling pack",
          description: "Address pricing, legal comfort, and timeline confidence before final round.",
          tone: "positive",
        },
      ],
    };
  }, [data]);

  if (loading) {
    return (
      <div className={className} style={cardStyle}>
        <style>
          {`
            @keyframes dealInsightCardPulse {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }

            @media (max-width: 1100px) {
              .deal-insight-card-content {
                grid-template-columns: 1fr !important;
              }
            }

            @media (max-width: 768px) {
              .deal-insight-top-grid {
                grid-template-columns: 1fr !important;
              }

              .deal-insight-hero-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>

        <div style={headerStyle}>
          <div style={glowStyle} />
          <div style={headerRowStyle}>
            <div style={titleWrapStyle}>
              <div style={{ ...skeletonStyle, height: 22, width: 180 }} />
              <div style={{ ...skeletonStyle, height: 14, width: 280 }} />
            </div>
          </div>
        </div>

        <div className="deal-insight-card-content" style={contentStyle}>
          <div style={columnStyle}>
            <div className="deal-insight-hero-grid" style={heroMetricWrapStyle}>
              <div style={sectionStyle}>
                <div style={{ ...skeletonStyle, height: 18, width: 160 }} />
                <div style={{ ...skeletonStyle, height: 14, width: "100%" }} />
                <div style={{ ...skeletonStyle, height: 14, width: "72%" }} />
              </div>
              <div style={probabilityCardStyle}>
                <div style={{ ...skeletonStyle, height: 12, width: 80 }} />
                <div style={{ ...skeletonStyle, height: 34, width: 90 }} />
                <div style={{ ...skeletonStyle, height: 12, width: "100%" }} />
              </div>
            </div>

            <div className="deal-insight-top-grid" style={topStatGridStyle}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} style={statItemStyle}>
                  <div style={{ ...skeletonStyle, height: 10, width: 70 }} />
                  <div style={{ ...skeletonStyle, height: 16, width: "80%" }} />
                </div>
              ))}
            </div>
          </div>

          <div style={columnStyle}>
            <div style={sectionStyle}>
              <div style={{ ...skeletonStyle, height: 16, width: 120 }} />
              <div style={{ ...skeletonStyle, height: 58, width: "100%" }} />
              <div style={{ ...skeletonStyle, height: 58, width: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (empty || !safeData) {
    return (
      <div className={className} style={cardStyle}>
        <div style={headerStyle}>
          <div style={glowStyle} />
          <div style={headerRowStyle}>
            <div style={titleWrapStyle}>
              <h3 style={titleStyle}>{title}</h3>
              <p style={subtitleStyle}>{subtitle}</p>
            </div>
          </div>
        </div>

        <div style={emptyStateStyle}>
          <CircleDashed size={24} color="#64748b" />
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
            {emptyTitle}
          </div>
          <div style={helperTextStyle}>{emptyDescription}</div>
        </div>
      </div>
    );
  }

  const progress = clamp(safeData.progressPercentage ?? safeData.winProbability, 0, 100);
  const probability = clamp(safeData.winProbability, 0, 100);
  const healthMeta = getHealthMeta(safeData.health);
  const trendMeta = getTrendMeta(safeData.trend);

  return (
    <div className={className} style={cardStyle}>
      <style>
        {`
          @media (max-width: 1100px) {
            .deal-insight-card-content {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            .deal-insight-top-grid {
              grid-template-columns: 1fr !important;
            }

            .deal-insight-hero-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div style={headerStyle}>
        <div style={glowStyle} />

        <div style={headerRowStyle}>
          <div style={titleWrapStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>

          <div style={badgeStyle}>
            <Sparkles size={14} />
            Revenue Intelligence
          </div>
        </div>
      </div>

      <div className="deal-insight-card-content" style={contentStyle}>
        <div style={columnStyle}>
          <div className="deal-insight-hero-grid" style={heroMetricWrapStyle}>
            <div style={sectionStyle}>
              <div style={sectionTitleRowStyle}>
                <BriefcaseBusiness size={16} color="#2563eb" />
                <h4 style={sectionTitleStyle}>{safeData.dealName}</h4>
              </div>

              <div style={helperTextStyle}>
                {safeData.summary ||
                  "This deal snapshot combines stage, value, ownership, momentum, and next-action intelligence."}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={healthMeta.badgeStyle}>
                  {healthMeta.icon}
                  {healthMeta.label}
                </span>

                {safeData.trendLabel ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      borderRadius: 999,
                      padding: "6px 10px",
                      fontSize: 11,
                      fontWeight: 800,
                      background: trendMeta.bg,
                      border: `1px solid ${trendMeta.border}`,
                      color: trendMeta.color,
                    }}
                  >
                    {trendMeta.icon}
                    {safeData.trendLabel}
                  </span>
                ) : null}
              </div>

              <div style={progressWrapStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <span style={labelStyle}>Pipeline Progress</span>
                  <span style={{ ...labelStyle, color: "#334155" }}>{progress}%</span>
                </div>

                <div style={progressTrackStyle}>
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={probabilityCardStyle}>
              <div style={labelStyle}>Win Probability</div>
              <div style={probabilityValueStyle}>{probability}%</div>
              <div style={helperTextStyle}>
                Estimated likelihood of closing based on current stage signals.
              </div>
            </div>
          </div>

          <div className="deal-insight-top-grid" style={topStatGridStyle}>
            <StatItem
              label="Stage"
              value={safeData.stage}
              icon={<Target size={14} color="#2563eb" />}
            />
            <StatItem
              label="Deal Value"
              value={safeData.value}
              icon={<CircleDollarSign size={14} color="#2563eb" />}
            />
            <StatItem
              label="Owner"
              value={safeData.owner}
              icon={<CircleUserRound size={14} color="#2563eb" />}
            />
            <StatItem
              label="Expected Close"
              value={formatDate(safeData.expectedCloseDate)}
              icon={<CalendarDays size={14} color="#2563eb" />}
            />
            {safeData.accountName ? (
              <StatItem
                label="Account / Contact"
                value={safeData.accountName}
                icon={<BadgeCheck size={14} color="#2563eb" />}
              />
            ) : null}
            <StatItem
              label="Deal Health"
              value={healthMeta.label}
              icon={<CircleGauge size={14} color="#2563eb" />}
            />
          </div>
        </div>

        <div style={columnStyle}>
          <InsightSection
            title="Strengths"
            icon={<Flame size={16} color="#059669" />}
            items={safeData.strengths ?? []}
            emptyMessage="No major strengths highlighted yet."
          />

          <InsightSection
            title="Risks"
            icon={<ShieldAlert size={16} color="#d97706" />}
            items={safeData.risks ?? []}
            emptyMessage="No major risks flagged right now."
          />

          <InsightSection
            title="Next Actions"
            icon={<Clock3 size={16} color="#2563eb" />}
            items={safeData.nextActions ?? []}
            emptyMessage="No next actions suggested yet."
          />
        </div>
      </div>

      <div style={footerStyle}>
        <div style={helperTextStyle}>
          Use this insight card to quickly judge deal momentum, spot friction, and decide the next move without opening the full record.
        </div>

        <button type="button" style={footerButtonStyle} onClick={onActionClick}>
          {actionLabel}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div style={statItemStyle}>
      <div style={labelStyle}>{label}</div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, minWidth: 0 }}>
        {icon ? <span style={{ marginTop: 2, flexShrink: 0 }}>{icon}</span> : null}
        <span style={valueStyle}>{value}</span>
      </div>
    </div>
  );
}

function InsightSection({
  title,
  icon,
  items,
  emptyMessage,
}: {
  title: string;
  icon: React.ReactNode;
  items: DealInsightItem[];
  emptyMessage: string;
}) {
  return (
    <div style={sectionStyle}>
      <div style={sectionTitleRowStyle}>
        {icon}
        <h4 style={sectionTitleStyle}>{title}</h4>
      </div>

      {items.length > 0 ? (
        <div style={insightListStyle}>
          {items.map((item) => {
            const toneMeta = getInsightToneMeta(item.tone);

            return (
              <div key={item.id} style={insightItemStyle}>
                <div
                  style={{
                    ...insightIconWrapStyle,
                    background: toneMeta.bg,
                    border: `1px solid ${toneMeta.border}`,
                    color: toneMeta.color,
                  }}
                >
                  {toneMeta.icon}
                </div>

                <div style={insightTextWrapStyle}>
                  <div style={insightTitleStyle}>{item.title}</div>
                  {item.description ? (
                    <div style={insightDescriptionStyle}>{item.description}</div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={helperTextStyle}>{emptyMessage}</div>
      )}
    </div>
  );
}

function getHealthMeta(health: DealHealth | undefined) {
  switch (health) {
    case "excellent":
      return {
        label: "Excellent",
        icon: <BadgeCheck size={12} />,
        badgeStyle: {
          ...badgeStyle,
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          color: "#047857",
        } as React.CSSProperties,
      };
    case "good":
      return {
        label: "Good",
        icon: <Flame size={12} />,
        badgeStyle: {
          ...badgeStyle,
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          color: "#1d4ed8",
        } as React.CSSProperties,
      };
    case "average":
      return {
        label: "Average",
        icon: <CircleGauge size={12} />,
        badgeStyle: {
          ...badgeStyle,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          color: "#475569",
        } as React.CSSProperties,
      };
    case "at-risk":
      return {
        label: "At Risk",
        icon: <CircleAlert size={12} />,
        badgeStyle: {
          ...badgeStyle,
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          color: "#c2410c",
        } as React.CSSProperties,
      };
    case "critical":
      return {
        label: "Critical",
        icon: <ShieldAlert size={12} />,
        badgeStyle: {
          ...badgeStyle,
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#b91c1c",
        } as React.CSSProperties,
      };
    default:
      return {
        label: "Unknown",
        icon: <CircleDashed size={12} />,
        badgeStyle: badgeStyle,
      };
  }
}

function getTrendMeta(trend?: TrendDirection) {
  if (trend === "up") {
    return {
      icon: <TrendingUp size={12} />,
      bg: "#ecfdf5",
      border: "#a7f3d0",
      color: "#047857",
    };
  }

  if (trend === "down") {
    return {
      icon: <TrendingDown size={12} />,
      bg: "#fef2f2",
      border: "#fecaca",
      color: "#b91c1c",
    };
  }

  return {
    icon: <CircleGauge size={12} />,
    bg: "#f8fafc",
    border: "#e2e8f0",
    color: "#475569",
  };
}

function getInsightToneMeta(tone: InsightTone = "info") {
  switch (tone) {
    case "positive":
      return {
        bg: "#ecfdf5",
        border: "#a7f3d0",
        color: "#047857",
        icon: <BadgeCheck size={16} />,
      };
    case "warning":
      return {
        bg: "#fff7ed",
        border: "#fed7aa",
        color: "#c2410c",
        icon: <CircleAlert size={16} />,
      };
    case "critical":
      return {
        bg: "#fef2f2",
        border: "#fecaca",
        color: "#b91c1c",
        icon: <ShieldAlert size={16} />,
      };
    case "info":
    default:
      return {
        bg: "#eff6ff",
        border: "#bfdbfe",
        color: "#1d4ed8",
        icon: <Sparkles size={16} />,
      };
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatDate(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

export default memo(DealInsightCard);