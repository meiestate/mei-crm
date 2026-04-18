import { type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

export type AnalyticsEmptyStateTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type AnalyticsEmptyStateProps = {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  tone?: AnalyticsEmptyStateTone;
  compact?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  fullHeight?: boolean;
  minHeight?: number | string;
  loading?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
};

type ToneStyles = {
  accent: string;
  iconBg: string;
  border: string;
  title: string;
  description: string;
  surface: string;
  primaryButtonBg: string;
  primaryButtonText: string;
  secondaryButtonBg: string;
  secondaryButtonText: string;
};

function getToneStyles(tone: AnalyticsEmptyStateTone): ToneStyles {
  switch (tone) {
    case "primary":
      return {
        accent: "#111827",
        iconBg: "#f3f4f6",
        border: "#e5e7eb",
        title: "#111827",
        description: "#6b7280",
        surface: "#ffffff",
        primaryButtonBg: "#111827",
        primaryButtonText: "#ffffff",
        secondaryButtonBg: "#ffffff",
        secondaryButtonText: "#111827",
      };
    case "success":
      return {
        accent: "#047857",
        iconBg: "#ecfdf3",
        border: "#a7f3d0",
        title: "#064e3b",
        description: "#047857",
        surface: "#ffffff",
        primaryButtonBg: "#047857",
        primaryButtonText: "#ffffff",
        secondaryButtonBg: "#ffffff",
        secondaryButtonText: "#047857",
      };
    case "warning":
      return {
        accent: "#c2410c",
        iconBg: "#fff7ed",
        border: "#fdba74",
        title: "#7c2d12",
        description: "#c2410c",
        surface: "#ffffff",
        primaryButtonBg: "#c2410c",
        primaryButtonText: "#ffffff",
        secondaryButtonBg: "#ffffff",
        secondaryButtonText: "#c2410c",
      };
    case "danger":
      return {
        accent: "#b91c1c",
        iconBg: "#fef2f2",
        border: "#fecaca",
        title: "#7f1d1d",
        description: "#b91c1c",
        surface: "#ffffff",
        primaryButtonBg: "#b91c1c",
        primaryButtonText: "#ffffff",
        secondaryButtonBg: "#ffffff",
        secondaryButtonText: "#b91c1c",
      };
    case "info":
      return {
        accent: "#1d4ed8",
        iconBg: "#eff6ff",
        border: "#bfdbfe",
        title: "#1e3a8a",
        description: "#1d4ed8",
        surface: "#ffffff",
        primaryButtonBg: "#1d4ed8",
        primaryButtonText: "#ffffff",
        secondaryButtonBg: "#ffffff",
        secondaryButtonText: "#1d4ed8",
      };
    default:
      return {
        accent: "#6b7280",
        iconBg: "#f9fafb",
        border: "#e5e7eb",
        title: "#111827",
        description: "#6b7280",
        surface: "#ffffff",
        primaryButtonBg: "#111827",
        primaryButtonText: "#ffffff",
        secondaryButtonBg: "#ffffff",
        secondaryButtonText: "#374151",
      };
  }
}

function handleButtonKeyDown(
  event: KeyboardEvent<HTMLButtonElement>,
  callback?: () => void
) {
  if (!callback) return;

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
}

function AnalyticsEmptyStateSkeleton({
  compact = false,
  minHeight,
}: {
  compact?: boolean;
  minHeight?: number | string;
}) {
  return (
    <section
      aria-busy="true"
      style={{
        width: "100%",
        minHeight,
        borderRadius: compact ? 18 : 22,
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        boxSizing: "border-box",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
        padding: compact ? 20 : 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "grid",
          justifyItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: compact ? 56 : 72,
            height: compact ? 56 : 72,
            borderRadius: compact ? 18 : 22,
            background: "#f3f4f6",
          }}
        />
        <div
          style={{
            width: 180,
            height: 16,
            borderRadius: 8,
            background: "#e5e7eb",
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
        <div
          style={{
            width: "58%",
            height: 12,
            borderRadius: 8,
            background: "#f3f4f6",
          }}
        />
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: 128,
              height: 40,
              borderRadius: 12,
              background: "#e5e7eb",
            }}
          />
          <div
            style={{
              width: 128,
              height: 40,
              borderRadius: 12,
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default function AnalyticsEmptyState({
  title = "No analytics data available",
  description = "There’s nothing to show here yet. Adjust filters, expand the date range, or start collecting activity to unlock insights.",
  icon = "📊",
  primaryActionLabel = "Refresh data",
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  tone = "default",
  compact = false,
  bordered = true,
  elevated = true,
  fullHeight = false,
  minHeight = 280,
  loading = false,
  children,
  style,
}: AnalyticsEmptyStateProps) {
  const toneStyles = getToneStyles(tone);

  if (loading) {
    return (
      <AnalyticsEmptyStateSkeleton compact={compact} minHeight={minHeight} />
    );
  }

  const containerPadding = compact ? 20 : 28;
  const iconSize = compact ? 56 : 72;
  const iconRadius = compact ? 18 : 22;

  return (
    <section
      style={{
        width: "100%",
        minHeight,
        height: fullHeight ? "100%" : undefined,
        borderRadius: compact ? 18 : 22,
        border: bordered ? `1px solid ${toneStyles.border}` : "none",
        background: toneStyles.surface,
        boxSizing: "border-box",
        boxShadow: elevated
          ? "0 10px 28px rgba(15, 23, 42, 0.06)"
          : "none",
        padding: containerPadding,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: compact ? 460 : 560,
          display: "grid",
          justifyItems: "center",
          gap: compact ? 10 : 14,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: iconSize,
            height: iconSize,
            borderRadius: iconRadius,
            background: toneStyles.iconBg,
            border: `1px solid ${toneStyles.border}`,
            color: toneStyles.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: compact ? 24 : 30,
            fontWeight: 800,
            boxSizing: "border-box",
          }}
        >
          {icon}
        </div>

        <div
          style={{
            fontSize: compact ? 18 : 22,
            fontWeight: 800,
            lineHeight: 1.25,
            color: toneStyles.title,
            maxWidth: 480,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: compact ? 13 : 14,
            lineHeight: 1.65,
            color: toneStyles.description,
            maxWidth: 520,
          }}
        >
          {description}
        </div>

        {children ? (
          <div
            style={{
              width: "100%",
              marginTop: 4,
            }}
          >
            {children}
          </div>
        ) : null}

        {(primaryActionLabel || secondaryActionLabel) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 6,
            }}
          >
            {primaryActionLabel ? (
              <button
                type="button"
                onClick={onPrimaryAction}
                onKeyDown={(event) =>
                  handleButtonKeyDown(event, onPrimaryAction)
                }
                style={{
                  minHeight: 40,
                  padding: "0 16px",
                  borderRadius: 12,
                  border: `1px solid ${toneStyles.primaryButtonBg}`,
                  background: toneStyles.primaryButtonBg,
                  color: toneStyles.primaryButtonText,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: onPrimaryAction ? "pointer" : "default",
                  boxSizing: "border-box",
                }}
              >
                {primaryActionLabel}
              </button>
            ) : null}

            {secondaryActionLabel ? (
              <button
                type="button"
                onClick={onSecondaryAction}
                onKeyDown={(event) =>
                  handleButtonKeyDown(event, onSecondaryAction)
                }
                style={{
                  minHeight: 40,
                  padding: "0 16px",
                  borderRadius: 12,
                  border: `1px solid ${toneStyles.border}`,
                  background: toneStyles.secondaryButtonBg,
                  color: toneStyles.secondaryButtonText,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: onSecondaryAction ? "pointer" : "default",
                  boxSizing: "border-box",
                }}
              >
                {secondaryActionLabel}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}