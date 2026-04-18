import React, { useMemo } from "react";

export type AlertSummaryTone =
  | "critical"
  | "warning"
  | "success"
  | "info"
  | "neutral";

export type AlertSummaryTrend = "up" | "down" | "flat";

export interface AlertSummaryCardProps {
  title?: string;
  value?: number | string;
  subtitle?: string;
  helperText?: string;
  delta?: number;
  deltaLabel?: string;
  trend?: AlertSummaryTrend;
  tone?: AlertSummaryTone;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  currency?: boolean;
  percentage?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

type ToneConfig = {
  text: string;
  softText: string;
  border: string;
  background: string;
  badgeBackground: string;
  badgeText: string;
  accent: string;
  shadow: string;
};

const toneMap: Record<AlertSummaryTone, ToneConfig> = {
  critical: {
    text: "#991B1B",
    softText: "#B91C1C",
    border: "#FECACA",
    background: "linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 100%)",
    badgeBackground: "#FEE2E2",
    badgeText: "#B91C1C",
    accent: "#EF4444",
    shadow: "0 10px 30px rgba(239, 68, 68, 0.12)",
  },
  warning: {
    text: "#92400E",
    softText: "#B45309",
    border: "#FDE68A",
    background: "linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%)",
    badgeBackground: "#FEF3C7",
    badgeText: "#B45309",
    accent: "#F59E0B",
    shadow: "0 10px 30px rgba(245, 158, 11, 0.12)",
  },
  success: {
    text: "#166534",
    softText: "#15803D",
    border: "#BBF7D0",
    background: "linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)",
    badgeBackground: "#DCFCE7",
    badgeText: "#15803D",
    accent: "#22C55E",
    shadow: "0 10px 30px rgba(34, 197, 94, 0.12)",
  },
  info: {
    text: "#1D4ED8",
    softText: "#2563EB",
    border: "#BFDBFE",
    background: "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)",
    badgeBackground: "#DBEAFE",
    badgeText: "#2563EB",
    accent: "#3B82F6",
    shadow: "0 10px 30px rgba(59, 130, 246, 0.12)",
  },
  neutral: {
    text: "#334155",
    softText: "#64748B",
    border: "#E2E8F0",
    background: "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)",
    badgeBackground: "#F1F5F9",
    badgeText: "#475569",
    accent: "#94A3B8",
    shadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
  },
};

function formatIndianCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: value >= 100000 ? 0 : 2,
  }).format(value);
}

function formatValue(
  value: number | string | undefined,
  currency?: boolean,
  percentage?: boolean
): string {
  if (value === undefined || value === null || value === "") {
    return "--";
  }

  if (typeof value === "string") {
    return value;
  }

  if (currency) {
    return formatIndianCurrency(value);
  }

  if (percentage) {
    return `${value}%`;
  }

  return new Intl.NumberFormat("en-IN").format(value);
}

function getDeltaMeta(delta?: number, trend?: AlertSummaryTrend) {
  if (typeof delta !== "number") {
    return {
      arrow: "•",
      label: "--",
      positive: false,
      negative: false,
    };
  }

  if (trend === "flat" || delta === 0) {
    return {
      arrow: "•",
      label: `${Math.abs(delta)}%`,
      positive: false,
      negative: false,
    };
  }

  if (trend === "down") {
    return {
      arrow: "↓",
      label: `${Math.abs(delta)}%`,
      positive: false,
      negative: true,
    };
  }

  return {
    arrow: "↑",
    label: `${Math.abs(delta)}%`,
    positive: true,
    negative: false,
  };
}

function SkeletonLine({
  width,
  height = 12,
  radius = 999,
}: {
  width: number | string;
  height?: number;
  radius?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, rgba(226,232,240,0.8) 0%, rgba(241,245,249,1) 50%, rgba(226,232,240,0.8) 100%)",
        backgroundSize: "200% 100%",
        animation: "alertSummaryPulse 1.2s ease-in-out infinite",
      }}
    />
  );
}

export default function AlertSummaryCard({
  title = "Alert Summary",
  value = 0,
  subtitle = "Overall system alert snapshot",
  helperText = "Monitor important business risks and action triggers in one place.",
  delta,
  deltaLabel = "vs previous period",
  trend = "flat",
  tone = "neutral",
  loading = false,
  icon,
  onClick,
  currency = false,
  percentage = false,
  compact = false,
  className,
  style,
}: AlertSummaryCardProps) {
  const colors = toneMap[tone];

  const formattedValue = useMemo(
    () => formatValue(value, currency, percentage),
    [value, currency, percentage]
  );

  const deltaMeta = useMemo(() => getDeltaMeta(delta, trend), [delta, trend]);

  const isInteractive = typeof onClick === "function";

  const cardPadding = compact ? "14px" : "18px";
  const valueFontSize = compact ? 28 : 34;
  const titleFontSize = compact ? 13 : 14;
  const subtitleFontSize = compact ? 11 : 12;

  return (
    <>
      <style>
        {`
          @keyframes alertSummaryPulse {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>

      <div
        className={className}
        onClick={onClick}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onKeyDown={(event) => {
          if (!isInteractive) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick?.();
          }
        }}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          border: `1px solid ${colors.border}`,
          background: colors.background,
          boxShadow: colors.shadow,
          padding: cardPadding,
          minHeight: compact ? 156 : 182,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          cursor: isInteractive ? "pointer" : "default",
          transition:
            "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
          ...style,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: `${colors.accent}14`,
            filter: "blur(4px)",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 5,
            background: colors.accent,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <SkeletonLine width="48%" height={14} />
            ) : (
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
                    fontSize: titleFontSize,
                    fontWeight: 700,
                    color: colors.text,
                    letterSpacing: 0.2,
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </div>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    color: colors.badgeText,
                    background: colors.badgeBackground,
                    border: `1px solid ${colors.border}`,
                    textTransform: "capitalize",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tone.replace("-", " ")}
                </span>
              </div>
            )}

            <div style={{ marginTop: 10 }}>
              {loading ? (
                <SkeletonLine width="72%" height={compact ? 28 : 34} radius={12} />
              ) : (
                <div
                  style={{
                    fontSize: valueFontSize,
                    fontWeight: 800,
                    color: "#0F172A",
                    lineHeight: 1,
                    letterSpacing: -0.6,
                    wordBreak: "break-word",
                  }}
                >
                  {formattedValue}
                </div>
              )}
            </div>

            <div style={{ marginTop: 10 }}>
              {loading ? (
                <SkeletonLine width="64%" height={12} />
              ) : (
                <div
                  style={{
                    fontSize: subtitleFontSize,
                    color: colors.softText,
                    fontWeight: 600,
                    lineHeight: 1.45,
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              flexShrink: 0,
              width: compact ? 42 : 48,
              height: compact ? 42 : 48,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: colors.badgeBackground,
              color: colors.badgeText,
              border: `1px solid ${colors.border}`,
            }}
          >
            {loading ? (
              <SkeletonLine width={20} height={20} radius={8} />
            ) : (
              icon ?? (
                <span
                  style={{
                    fontSize: compact ? 18 : 20,
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  !
                </span>
              )
            )}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: compact ? 14 : 18,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <>
                <SkeletonLine width="90%" height={11} />
                <div style={{ height: 8 }} />
                <SkeletonLine width="58%" height={11} />
              </>
            ) : (
              <div
                style={{
                  fontSize: 12,
                  color: "#64748B",
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                {helperText}
              </div>
            )}
          </div>

          <div
            style={{
              minWidth: compact ? 110 : 128,
              alignSelf: "stretch",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {loading ? (
              <SkeletonLine width="100%" height={34} radius={12} />
            ) : (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: compact ? "8px 10px" : "9px 12px",
                  borderRadius: 12,
                  background:
                    deltaMeta.negative
                      ? "#FEF2F2"
                      : deltaMeta.positive
                      ? "#F0FDF4"
                      : "#F8FAFC",
                  border: `1px solid ${
                    deltaMeta.negative
                      ? "#FECACA"
                      : deltaMeta.positive
                      ? "#BBF7D0"
                      : "#E2E8F0"
                  }`,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: deltaMeta.negative
                      ? "#B91C1C"
                      : deltaMeta.positive
                      ? "#15803D"
                      : "#475569",
                    lineHeight: 1,
                  }}
                >
                  {deltaMeta.arrow}
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: deltaMeta.negative
                        ? "#B91C1C"
                        : deltaMeta.positive
                        ? "#15803D"
                        : "#475569",
                      lineHeight: 1.1,
                    }}
                  >
                    {deltaMeta.label}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#64748B",
                      lineHeight: 1.1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {deltaLabel}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}