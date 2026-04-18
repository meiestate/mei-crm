import { type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

export type AnalyticsCardTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type AnalyticsCardPadding = "sm" | "md" | "lg";

export type AnalyticsCardProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
  badge?: ReactNode;
  tone?: AnalyticsCardTone;
  padding?: AnalyticsCardPadding;
  loading?: boolean;
  clickable?: boolean;
  disabled?: boolean;
  minHeight?: number | string;
  fullHeight?: boolean;
  noBodyPadding?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  background?: string;
  onClick?: () => void;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
  headerStyle?: CSSProperties;
  footerStyle?: CSSProperties;
  className?: string;
};

type ToneStyles = {
  accent: string;
  softBg: string;
  border: string;
  text: string;
  subText: string;
  iconBg: string;
};

function getToneStyles(tone: AnalyticsCardTone): ToneStyles {
  switch (tone) {
    case "primary":
      return {
        accent: "#111827",
        softBg: "#f3f4f6",
        border: "#e5e7eb",
        text: "#111827",
        subText: "#6b7280",
        iconBg: "#f3f4f6",
      };
    case "success":
      return {
        accent: "#047857",
        softBg: "#ecfdf3",
        border: "#a7f3d0",
        text: "#064e3b",
        subText: "#047857",
        iconBg: "#ecfdf3",
      };
    case "warning":
      return {
        accent: "#c2410c",
        softBg: "#fff7ed",
        border: "#fdba74",
        text: "#7c2d12",
        subText: "#c2410c",
        iconBg: "#fff7ed",
      };
    case "danger":
      return {
        accent: "#b91c1c",
        softBg: "#fef2f2",
        border: "#fecaca",
        text: "#7f1d1d",
        subText: "#b91c1c",
        iconBg: "#fef2f2",
      };
    case "info":
      return {
        accent: "#1d4ed8",
        softBg: "#eff6ff",
        border: "#bfdbfe",
        text: "#1e3a8a",
        subText: "#1d4ed8",
        iconBg: "#eff6ff",
      };
    default:
      return {
        accent: "#374151",
        softBg: "#f9fafb",
        border: "#e5e7eb",
        text: "#111827",
        subText: "#6b7280",
        iconBg: "#f9fafb",
      };
  }
}

function getPaddingValue(padding: AnalyticsCardPadding): string {
  switch (padding) {
    case "sm":
      return "14px";
    case "lg":
      return "22px";
    default:
      return "18px";
  }
}

function handleCardKeyDown(
  event: KeyboardEvent<HTMLElement>,
  clickable?: boolean,
  disabled?: boolean,
  onClick?: () => void
) {
  if (!clickable || disabled || !onClick) return;

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onClick();
  }
}

function LoadingSkeleton({
  padding,
  tone,
  minHeight,
}: {
  padding: string;
  tone: ToneStyles;
  minHeight?: number | string;
}) {
  return (
    <section
      aria-busy="true"
      style={{
        width: "100%",
        minHeight,
        borderRadius: 22,
        border: `1px solid ${tone.border}`,
        background: "#ffffff",
        padding,
        boxSizing: "border-box",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 160,
              height: 16,
              borderRadius: 8,
              background: "#e5e7eb",
              marginBottom: 10,
            }}
          />
          <div
            style={{
              width: "72%",
              height: 12,
              borderRadius: 8,
              background: "#f3f4f6",
            }}
          />
        </div>

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: tone.softBg,
            border: `1px solid ${tone.border}`,
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gap: 10,
        }}
      >
        <div
          style={{
            height: 66,
            borderRadius: 16,
            background: "#f9fafb",
            border: "1px solid #f3f4f6",
          }}
        />
        <div
          style={{
            height: 66,
            borderRadius: 16,
            background: "#f9fafb",
            border: "1px solid #f3f4f6",
          }}
        />
        <div
          style={{
            height: 120,
            borderRadius: 18,
            background: "#f9fafb",
            border: "1px solid #f3f4f6",
          }}
        />
      </div>
    </section>
  );
}

export default function AnalyticsCard({
  title,
  subtitle,
  icon,
  children,
  footer,
  actions,
  badge,
  tone = "default",
  padding = "md",
  loading = false,
  clickable,
  disabled = false,
  minHeight,
  fullHeight = false,
  noBodyPadding = false,
  bordered = true,
  elevated = true,
  background = "#ffffff",
  onClick,
  style,
  bodyStyle,
  headerStyle,
  footerStyle,
}: AnalyticsCardProps) {
  const toneStyles = getToneStyles(tone);
  const paddingValue = getPaddingValue(padding);
  const isInteractive = Boolean(clickable || onClick);

  if (loading) {
    return (
      <LoadingSkeleton
        padding={paddingValue}
        tone={toneStyles}
        minHeight={minHeight}
      />
    );
  }

  return (
    <section
      role={isInteractive && !disabled ? "button" : undefined}
      tabIndex={isInteractive && !disabled ? 0 : undefined}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(event) =>
        handleCardKeyDown(event, isInteractive, disabled, onClick)
      }
      style={{
        width: "100%",
        minHeight,
        height: fullHeight ? "100%" : undefined,
        borderRadius: 22,
        border: bordered ? `1px solid ${toneStyles.border}` : "none",
        background,
        boxSizing: "border-box",
        boxShadow: elevated
          ? "0 10px 28px rgba(15, 23, 42, 0.06)"
          : "none",
        cursor: isInteractive && !disabled ? "pointer" : "default",
        opacity: disabled ? 0.65 : 1,
        transition:
          "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
        overflow: "hidden",
        ...style,
      }}
    >
      {(title || subtitle || icon || actions || badge) && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 14,
            padding: paddingValue,
            paddingBottom: children || footer ? 14 : paddingValue,
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
                  width: 48,
                  height: 48,
                  minWidth: 48,
                  borderRadius: 14,
                  background: toneStyles.iconBg,
                  border: `1px solid ${toneStyles.border}`,
                  color: toneStyles.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
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
                    marginBottom: title || subtitle ? 8 : 0,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {badge}
                </div>
              ) : null}

              {title ? (
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: toneStyles.text,
                    lineHeight: 1.3,
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
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: "#6b7280",
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
                flexShrink: 0,
              }}
            >
              {actions}
            </div>
          ) : null}
        </div>
      )}

      <div
        style={{
          padding: noBodyPadding ? 0 : `0 ${paddingValue} ${paddingValue}`,
          boxSizing: "border-box",
          ...bodyStyle,
        }}
      >
        {children}
      </div>

      {footer ? (
        <div
          style={{
            padding: `0 ${paddingValue} ${paddingValue}`,
            boxSizing: "border-box",
            ...footerStyle,
          }}
        >
          {footer}
        </div>
      ) : null}
    </section>
  );
}