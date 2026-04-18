import React, { memo, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  Mail,
  PhoneCall,
  AlertTriangle,
  CircleCheckBig,
  Sparkles,
  Info,
  ArrowRight,
  BarChart3,
  Target,
  Activity,
} from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";
type InsightTone = "positive" | "warning" | "critical" | "info";

export type CommunicationInsightMetric = {
  id: string;
  label: string;
  value: string;
  change?: string;
  trend?: TrendDirection;
  description?: string;
};

export type CommunicationInsightItem = {
  id: string;
  title: string;
  description: string;
  tone?: InsightTone;
};

export type CommunicationChannelMixItem = {
  id: string;
  label: string;
  value: string;
  percentage?: number;
  icon?: React.ReactNode;
};

type Props = {
  title?: string;
  subtitle?: string;
  metrics?: CommunicationInsightMetric[];
  highlights?: CommunicationInsightItem[];
  risks?: CommunicationInsightItem[];
  recommendations?: CommunicationInsightItem[];
  channelMix?: CommunicationChannelMixItem[];
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  footerLabel?: string;
  onViewDetails?: () => void;
  className?: string;
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 24,
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.07)",
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 18,
  minWidth: 0,
  width: "100%",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const titleWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.03em",
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
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid #dbeafe",
  background: "#eff6ff",
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 800,
};

const metricsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 12,
};

const metricCardStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  borderRadius: 18,
  padding: 14,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  minWidth: 0,
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const metricValueRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const metricValueStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.03em",
};

const metricChangeWrapStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  borderRadius: 999,
  padding: "6px 10px",
  fontSize: 11,
  fontWeight: 800,
};

const helperTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.6,
};

const bodyGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.3fr) minmax(300px, 0.9fr)",
  gap: 16,
  minWidth: 0,
};

const leftColumnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
};

const rightColumnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
};

const sectionStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  borderRadius: 18,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  minWidth: 0,
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const sectionTitleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  minWidth: 0,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.02em",
};

const sectionMetaStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  fontWeight: 700,
};

const insightListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  minWidth: 0,
};

const insightItemStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: "12px 14px",
  background: "#ffffff",
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
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

const channelListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const channelRowStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: "12px 14px",
  borderRadius: 14,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const channelTopRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const channelLeftStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  minWidth: 0,
};

const channelNameStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: "#0f172a",
};

const channelValueStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: "#334155",
};

const progressTrackStyle: React.CSSProperties = {
  width: "100%",
  height: 8,
  borderRadius: 999,
  background: "#e2e8f0",
  overflow: "hidden",
};

const footerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  paddingTop: 2,
};

const footerTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.6,
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
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
};

const emptyStateStyle: React.CSSProperties = {
  border: "1px dashed #cbd5e1",
  background: "#f8fafc",
  borderRadius: 18,
  padding: 26,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const skeletonStyle: React.CSSProperties = {
  borderRadius: 12,
  background:
    "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)",
  backgroundSize: "200% 100%",
  animation: "communicationInsightsPulse 1.3s ease-in-out infinite",
};

function CommunicationInsightsCard({
  title = "Communication Insights",
  subtitle = "Track messaging quality, response patterns, engagement shifts, and channel-level performance in one place.",
  metrics = [],
  highlights = [],
  risks = [],
  recommendations = [],
  channelMix = [],
  loading = false,
  empty = false,
  emptyTitle = "No communication insights available",
  emptyDescription = "Once campaigns, messages, or replies start flowing, insights will appear here automatically.",
  footerLabel = "View detailed communication analytics",
  onViewDetails,
  className,
}: Props) {
  const safeMetrics = useMemo(
    () =>
      metrics.length
        ? metrics
        : [
            {
              id: "open-rate",
              label: "Open Rate",
              value: "48.2%",
              change: "+4.1%",
              trend: "up" as TrendDirection,
              description: "Compared with previous period",
            },
            {
              id: "reply-rate",
              label: "Reply Rate",
              value: "16.7%",
              change: "+1.8%",
              trend: "up" as TrendDirection,
              description: "Engagement from outbound communication",
            },
            {
              id: "delivery-rate",
              label: "Delivery",
              value: "97.9%",
              change: "-0.3%",
              trend: "down" as TrendDirection,
              description: "Successful message delivery percentage",
            },
            {
              id: "avg-response",
              label: "Avg Response",
              value: "2.4h",
              change: "Stable",
              trend: "neutral" as TrendDirection,
              description: "Average time to first reply",
            },
          ],
    [metrics]
  );

  const safeHighlights = useMemo(
    () =>
      highlights.length
        ? highlights
        : [
            {
              id: "highlight-1",
              title: "WhatsApp follow-ups are outperforming email",
              description:
                "Lead engagement is currently stronger on short-format conversational channels.",
              tone: "positive" as InsightTone,
            },
            {
              id: "highlight-2",
              title: "Morning campaigns are producing stronger reply rates",
              description:
                "Messages sent earlier in the day are getting more attention and faster first responses.",
              tone: "info" as InsightTone,
            },
          ],
    [highlights]
  );

  const safeRisks = useMemo(
    () =>
      risks.length
        ? risks
        : [
            {
              id: "risk-1",
              title: "Open-to-reply conversion is softer than expected",
              description:
                "People are seeing the communication, but the final CTA may need better clarity or urgency.",
              tone: "warning" as InsightTone,
            },
          ],
    [risks]
  );

  const safeRecommendations = useMemo(
    () =>
      recommendations.length
        ? recommendations
        : [
            {
              id: "recommendation-1",
              title: "Increase personalized merge-tag usage",
              description:
                "Use contact name, project name, or follow-up context to reduce generic message fatigue.",
              tone: "info" as InsightTone,
            },
            {
              id: "recommendation-2",
              title: "A/B test CTA phrasing on dormant audiences",
              description:
                "Sharper value framing can improve response recovery from warm but inactive leads.",
              tone: "positive" as InsightTone,
            },
          ],
    [recommendations]
  );

  const safeChannelMix = useMemo(
    () =>
      channelMix.length
        ? channelMix
        : [
            {
              id: "whatsapp",
              label: "WhatsApp",
              value: "1,284 messages",
              percentage: 56,
              icon: <MessageSquare size={15} />,
            },
            {
              id: "email",
              label: "Email",
              value: "732 sends",
              percentage: 32,
              icon: <Mail size={15} />,
            },
            {
              id: "calls",
              label: "Call Follow-ups",
              value: "276 touchpoints",
              percentage: 12,
              icon: <PhoneCall size={15} />,
            },
          ],
    [channelMix]
  );

  if (loading) {
    return (
      <div className={className} style={cardStyle}>
        <style>
          {`
            @keyframes communicationInsightsPulse {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }

            @media (max-width: 1180px) {
              .communication-insights-body {
                grid-template-columns: 1fr !important;
              }

              .communication-insights-metrics {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              }
            }

            @media (max-width: 768px) {
              .communication-insights-metrics {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>

        <div style={headerStyle}>
          <div style={{ ...titleWrapStyle, width: "100%" }}>
            <div style={{ ...skeletonStyle, height: 22, width: 220 }} />
            <div style={{ ...skeletonStyle, height: 14, width: "70%" }} />
          </div>
        </div>

        <div className="communication-insights-metrics" style={metricsGridStyle}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} style={metricCardStyle}>
              <div style={{ ...skeletonStyle, height: 12, width: 90 }} />
              <div style={{ ...skeletonStyle, height: 26, width: 80 }} />
              <div style={{ ...skeletonStyle, height: 12, width: "60%" }} />
            </div>
          ))}
        </div>

        <div className="communication-insights-body" style={bodyGridStyle}>
          <div style={leftColumnStyle}>
            <div style={sectionStyle}>
              <div style={{ ...skeletonStyle, height: 16, width: 160 }} />
              <div style={{ ...skeletonStyle, height: 74, width: "100%" }} />
              <div style={{ ...skeletonStyle, height: 74, width: "100%" }} />
            </div>
          </div>

          <div style={rightColumnStyle}>
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

  if (empty) {
    return (
      <div className={className} style={cardStyle}>
        <div style={headerStyle}>
          <div style={titleWrapStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>
        </div>

        <div style={emptyStateStyle}>
          <BarChart3 size={24} color="#64748b" />
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
            {emptyTitle}
          </div>
          <div style={helperTextStyle}>{emptyDescription}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={cardStyle}>
      <style>
        {`
          @media (max-width: 1180px) {
            .communication-insights-body {
              grid-template-columns: 1fr !important;
            }

            .communication-insights-metrics {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 768px) {
            .communication-insights-metrics {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div style={headerStyle}>
        <div style={titleWrapStyle}>
          <h3 style={titleStyle}>{title}</h3>
          <p style={subtitleStyle}>{subtitle}</p>
        </div>

        <div style={badgeStyle}>
          <Sparkles size={14} />
          AI-Aided Insight Summary
        </div>
      </div>

      <div className="communication-insights-metrics" style={metricsGridStyle}>
        {safeMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="communication-insights-body" style={bodyGridStyle}>
        <div style={leftColumnStyle}>
          <InsightSection
            title="Top Highlights"
            meta={`${safeHighlights.length} observations`}
            icon={<CircleCheckBig size={16} color="#059669" />}
            items={safeHighlights}
          />

          <InsightSection
            title="Key Risks"
            meta={`${safeRisks.length} watch areas`}
            icon={<AlertTriangle size={16} color="#d97706" />}
            items={safeRisks}
          />

          <InsightSection
            title="Recommended Actions"
            meta={`${safeRecommendations.length} next steps`}
            icon={<Target size={16} color="#2563eb" />}
            items={safeRecommendations}
          />
        </div>

        <div style={rightColumnStyle}>
          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <div style={sectionTitleRowStyle}>
                <Activity size={16} color="#2563eb" />
                <h4 style={sectionTitleStyle}>Channel Mix</h4>
              </div>

              <span style={sectionMetaStyle}>
                {safeChannelMix.length} active channels
              </span>
            </div>

            <div style={channelListStyle}>
              {safeChannelMix.map((channel) => (
                <ChannelMixRow key={channel.id} item={channel} />
              ))}
            </div>
          </div>

          <div
            style={{
              ...sectionStyle,
              background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
              border: "1px solid #dbeafe",
            }}
          >
            <div style={sectionHeaderStyle}>
              <div style={sectionTitleRowStyle}>
                <Info size={16} color="#2563eb" />
                <h4 style={sectionTitleStyle}>Strategic Read</h4>
              </div>
            </div>

            <div style={helperTextStyle}>
              Your communication engine looks healthiest when channel choice,
              timing, and message clarity move together. Strong delivery with
              weak replies usually means the content is being seen, but not felt.
            </div>

            <div style={helperTextStyle}>
              Improve performance by tightening CTA language, personalizing more
              aggressively, and shifting follow-ups toward the best-performing
              response windows.
            </div>
          </div>
        </div>
      </div>

      <div style={footerStyle}>
        <div style={footerTextStyle}>
          These insights help your team spot engagement momentum, reply friction,
          and next-best communication opportunities faster.
        </div>

        <button type="button" style={footerButtonStyle} onClick={onViewDetails}>
          {footerLabel}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function MetricCard({
  metric,
}: {
  metric: CommunicationInsightMetric;
}) {
  const trendMeta = getTrendMeta(metric.trend);

  return (
    <div style={metricCardStyle}>
      <div style={metricLabelStyle}>{metric.label}</div>

      <div style={metricValueRowStyle}>
        <span style={metricValueStyle}>{metric.value}</span>

        {metric.change ? (
          <span
            style={{
              ...metricChangeWrapStyle,
              background: trendMeta.bg,
              border: `1px solid ${trendMeta.border}`,
              color: trendMeta.color,
            }}
          >
            {trendMeta.icon}
            {metric.change}
          </span>
        ) : null}
      </div>

      {metric.description ? (
        <div style={helperTextStyle}>{metric.description}</div>
      ) : null}
    </div>
  );
}

function InsightSection({
  title,
  meta,
  icon,
  items,
}: {
  title: string;
  meta?: string;
  icon: React.ReactNode;
  items: CommunicationInsightItem[];
}) {
  return (
    <div style={sectionStyle}>
      <div style={sectionHeaderStyle}>
        <div style={sectionTitleRowStyle}>
          {icon}
          <h4 style={sectionTitleStyle}>{title}</h4>
        </div>

        {meta ? <span style={sectionMetaStyle}>{meta}</span> : null}
      </div>

      <div style={insightListStyle}>
        {items.map((item) => {
          const tone = getInsightToneMeta(item.tone);

          return (
            <div key={item.id} style={insightItemStyle}>
              <div
                style={{
                  ...insightIconWrapStyle,
                  background: tone.bg,
                  border: `1px solid ${tone.border}`,
                  color: tone.color,
                }}
              >
                {tone.icon}
              </div>

              <div style={insightTextWrapStyle}>
                <div style={insightTitleStyle}>{item.title}</div>
                <div style={insightDescriptionStyle}>{item.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChannelMixRow({
  item,
}: {
  item: CommunicationChannelMixItem;
}) {
  const safePercentage = Math.max(0, Math.min(100, item.percentage ?? 0));

  return (
    <div style={channelRowStyle}>
      <div style={channelTopRowStyle}>
        <div style={channelLeftStyle}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              background: "#ffffff",
              border: "1px solid #dbe3ef",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563eb",
              flexShrink: 0,
            }}
          >
            {item.icon ?? <MessageSquare size={15} />}
          </span>

          <span style={channelNameStyle}>{item.label}</span>
        </div>

        <span style={channelValueStyle}>{item.value}</span>
      </div>

      {item.percentage !== undefined ? (
        <div style={progressTrackStyle}>
          <div
            style={{
              width: `${safePercentage}%`,
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
            }}
          />
        </div>
      ) : null}
    </div>
  );
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
      bg: "#fff7ed",
      border: "#fed7aa",
      color: "#c2410c",
    };
  }

  return {
    icon: <Minus size={12} />,
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
        icon: <CircleCheckBig size={16} />,
      };
    case "warning":
      return {
        bg: "#fff7ed",
        border: "#fed7aa",
        color: "#c2410c",
        icon: <AlertTriangle size={16} />,
      };
    case "critical":
      return {
        bg: "#fef2f2",
        border: "#fecaca",
        color: "#b91c1c",
        icon: <AlertTriangle size={16} />,
      };
    case "info":
    default:
      return {
        bg: "#eff6ff",
        border: "#bfdbfe",
        color: "#1d4ed8",
        icon: <Info size={16} />,
      };
  }
}

export default memo(CommunicationInsightsCard);