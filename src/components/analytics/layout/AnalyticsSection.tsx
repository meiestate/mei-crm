import { type CSSProperties, type ReactNode } from "react";

export type AnalyticsSectionTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type AnalyticsSectionProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  tone?: AnalyticsSectionTone;
  compact?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  stickyHeader?: boolean;
  noBodyPadding?: boolean;
  minHeight?: number | string;
  background?: string;
  style?: CSSProperties;
  headerStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
  footerStyle?: CSSProperties;
  className?: string;
};

type ToneStyles = {
  accent: string;
  title: string;
  subtitle: string;
  border: string;
  softBg: string;
  iconBg: string;
};

function getToneStyles(tone: AnalyticsSectionTone): ToneStyles {
  switch (tone) {
    case "primary":
      return {
        accent: "#111827",
        title: "#111827",
        subtitle: "#6b7280",
        border: "#e5e7eb",
        softBg: "#f3f4f6",
        iconBg: "#f3f4f6",
      };
    case "success":
      return {
        accent: "#047857",
        title: "#064e3b",
        subtitle: "#047857",
        border: "#a7f3d0",
        softBg: "#ecfdf3",
        iconBg: "#ecfdf3",
      };
    case "warning":
      return {
        accent: "#c2410c",
        title: "#7c2d12",
        subtitle: "#c2410c",
        border: "#fdba74",
        softBg: "#fff7ed",
        iconBg: "#fff7ed",
      };
    case "danger":
      return {
        accent: "#b91c1c",
        title: "#7f1d1d",
        subtitle: "#b91c1c",
        border: "#fecaca",
        softBg: "#fef2f2",
        iconBg: "#fef2f2",
      };
    case "info":
      return {
        accent: "#1d4ed8",
        title: "#1e3a8a",
        subtitle: "#1d4ed8",
        border: "#bfdbfe",
        softBg: "#eff6ff",
        iconBg: "#eff6ff",
      };
    default:
      return {
        accent: "#374151",
        title: "#111827",
        subtitle: "#6b7280",
        border: "#e5e7eb",
        softBg: "#f9fafb",
        iconBg: "#f9fafb",
      };
  }
}

export default function AnalyticsSection({
  title,
  subtitle,
  badge,
  icon,
  actions,
  children,
  footer,
  tone = "default",
  compact = false,
  bordered = false,
  elevated = false,
  fullWidth = true,
  fullHeight = false,
  stickyHeader = false,
  noBodyPadding = false,
  minHeight,
  background = "transparent",
  style,
  headerStyle,
  bodyStyle,
  footerStyle,
}: AnalyticsSectionProps) {
  const toneStyles = getToneStyles(tone);
  const padding = compact ? 14 : 18;

  const hasHeader = Boolean(title || subtitle || badge || icon || actions);
  const hasFooter = Boolean(footer);

  return (
    <section
      style={{
        width: fullWidth ? "100%" : undefined,
        minHeight,
        height: fullHeight ? "100%" : undefined,
        borderRadius: bordered || elevated ? (compact ? 18 : 22) : undefined,
        border: bordered ? `1px solid ${toneStyles.border}` : "none",
        background,
        boxShadow: elevated
          ? "0 10px 28px rgba(15, 23, 42, 0.06)"
          : "none",
        boxSizing: "border-box",
        overflow: "hidden",
        ...style,
      }}
    >
      {hasHeader ? (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 14,
            flexWrap: "wrap",
            padding: noBodyPadding || bordered || elevated ? padding : 0,
            paddingBottom:
              title || subtitle || children || footer
                ? compact
                  ? 12
                  : 14
                : undefined,
            position: stickyHeader ? "sticky" : "relative",
            top: stickyHeader ? 0 : undefined,
            zIndex: stickyHeader ? 5 : undefined,
            background:
              stickyHeader && (bordered || elevated) ? background : undefined,
            ...headerStyle,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              flex: 1,
              minWidth: 0,
            }}
          >
            {icon ? (
              <div
                aria-hidden="true"
                style={{
                  width: compact ? 44 : 48,
                  height: compact ? 44 : 48,
                  minWidth: compact ? 44 : 48,
                  borderRadius: 14,
                  background: toneStyles.iconBg,
                  border: `1px solid ${toneStyles.border}`,
                  color: toneStyles.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: compact ? 18 : 20,
                  fontWeight: 800,
                }}
              >
                {icon}
              </div>
            ) : null}

            <div style={{ minWidth: 0, flex: 1 }}>
              {badge ? (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: title || subtitle ? 8 : 0,
                  }}
                >
                  {badge}
                </div>
              ) : null}

              {title ? (
                <div
                  style={{
                    fontSize: compact ? 16 : 18,
                    fontWeight: 800,
                    lineHeight: 1.3,
                    color: toneStyles.title,
                    marginBottom: subtitle ? 6 : 0,
                    wordBreak: "break-word",
                  }}
                >
                  {title}
                </div>
              ) : null}

              {subtitle ? (
                <div
                  style={{
                    fontSize: compact ? 12 : 13,
                    lineHeight: 1.6,
                    color: toneStyles.subtitle,
                    wordBreak: "break-word",
                  }}
                >
                  {subtitle}
                </div>
              ) : null}
            </div>
          </div>

          {actions ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        style={{
          padding:
            noBodyPadding || !(bordered || elevated)
              ? 0
              : hasHeader
              ? `0 ${padding} ${padding}`
              : padding,
          boxSizing: "border-box",
          ...bodyStyle,
        }}
      >
        {children}
      </div>

      {hasFooter ? (
        <div
          style={{
            padding:
              noBodyPadding || !(bordered || elevated)
                ? 0
                : `0 ${padding} ${padding}`,
            boxSizing: "border-box",
            marginTop: children ? (compact ? 12 : 14) : 0,
            ...footerStyle,
          }}
        >
          {footer}
        </div>
      ) : null}
    </section>
  );
}