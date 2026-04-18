import { type CSSProperties, type ReactNode } from "react";

export type AnalyticsPageHeaderTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type AnalyticsPageHeaderStat = {
  label: string;
  value: string | number;
  helperText?: string;
};

export type AnalyticsPageHeaderProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  icon?: ReactNode;
  stats?: AnalyticsPageHeaderStat[];
  actions?: ReactNode;
  tone?: AnalyticsPageHeaderTone;
  loading?: boolean;
  compact?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  sticky?: boolean;
  fullWidth?: boolean;
  background?: string;
  minHeight?: number | string;
  style?: CSSProperties;
  className?: string;
};

type ToneStyles = {
  accent: string;
  title: string;
  subtitle: string;
  border: string;
  softBg: string;
  statBg: string;
  statBorder: string;
};

function getToneStyles(tone: AnalyticsPageHeaderTone): ToneStyles {
  switch (tone) {
    case "primary":
      return {
        accent: "#111827",
        title: "#111827",
        subtitle: "#6b7280",
        border: "#e5e7eb",
        softBg: "#f3f4f6",
        statBg: "#f9fafb",
        statBorder: "#e5e7eb",
      };
    case "success":
      return {
        accent: "#047857",
        title: "#064e3b",
        subtitle: "#047857",
        border: "#a7f3d0",
        softBg: "#ecfdf3",
        statBg: "#f0fdf4",
        statBorder: "#a7f3d0",
      };
    case "warning":
      return {
        accent: "#c2410c",
        title: "#7c2d12",
        subtitle: "#c2410c",
        border: "#fdba74",
        softBg: "#fff7ed",
        statBg: "#fffbeb",
        statBorder: "#fdba74",
      };
    case "danger":
      return {
        accent: "#b91c1c",
        title: "#7f1d1d",
        subtitle: "#b91c1c",
        border: "#fecaca",
        softBg: "#fef2f2",
        statBg: "#fff1f2",
        statBorder: "#fecaca",
      };
    case "info":
      return {
        accent: "#1d4ed8",
        title: "#1e3a8a",
        subtitle: "#1d4ed8",
        border: "#bfdbfe",
        softBg: "#eff6ff",
        statBg: "#f8fbff",
        statBorder: "#bfdbfe",
      };
    default:
      return {
        accent: "#374151",
        title: "#111827",
        subtitle: "#6b7280",
        border: "#e5e7eb",
        softBg: "#f9fafb",
        statBg: "#ffffff",
        statBorder: "#e5e7eb",
      };
  }
}

function formatValue(value: string | number): string {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);
  }

  return value;
}

function AnalyticsPageHeaderSkeleton({
  compact,
  minHeight,
}: {
  compact: boolean;
  minHeight?: number | string;
}) {
  return (
    <section
      aria-busy="true"
      style={{
        width: "100%",
        minHeight,
        borderRadius: compact ? 18 : 24,
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
        padding: compact ? 16 : 20,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div style={{ flex: 1, minWidth: 240 }}>
          <div
            style={{
              width: 180,
              height: 14,
              borderRadius: 8,
              background: "#e5e7eb",
              marginBottom: 10,
            }}
          />
          <div
            style={{
              width: "48%",
              height: 28,
              borderRadius: 10,
              background: "#f3f4f6",
              marginBottom: 10,
            }}
          />
          <div
            style={{
              width: "78%",
              height: 12,
              borderRadius: 8,
              background: "#f3f4f6",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              style={{
                width: 118,
                height: 40,
                borderRadius: 12,
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            style={{
              minHeight: 76,
              borderRadius: 16,
              background: "#f9fafb",
              border: "1px solid #f3f4f6",
              padding: 14,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: "58%",
                height: 10,
                borderRadius: 8,
                background: "#e5e7eb",
                marginBottom: 10,
              }}
            />
            <div
              style={{
                width: "72%",
                height: 20,
                borderRadius: 10,
                background: "#f3f4f6",
                marginBottom: 8,
              }}
            />
            <div
              style={{
                width: "46%",
                height: 10,
                borderRadius: 8,
                background: "#f3f4f6",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AnalyticsPageHeader({
  title = "Analytics Dashboard",
  subtitle = "Track performance, compare trends, monitor team output, and spot revenue opportunities in one place.",
  badge,
  icon = "📈",
  stats = [],
  actions,
  tone = "default",
  loading = false,
  compact = false,
  bordered = true,
  elevated = true,
  sticky = false,
  fullWidth = true,
  background = "#ffffff",
  minHeight,
  style,
}: AnalyticsPageHeaderProps) {
  const toneStyles = getToneStyles(tone);

  if (loading) {
    return (
      <AnalyticsPageHeaderSkeleton compact={compact} minHeight={minHeight} />
    );
  }

  const padding = compact ? 16 : 20;
  const iconSize = compact ? 52 : 60;
  const iconRadius = compact ? 16 : 18;

  return (
    <section
      style={{
        width: fullWidth ? "100%" : undefined,
        minHeight,
        borderRadius: compact ? 18 : 24,
        border: bordered ? `1px solid ${toneStyles.border}` : "none",
        background,
        boxShadow: elevated
          ? "0 10px 28px rgba(15, 23, 42, 0.06)"
          : "none",
        padding,
        boxSizing: "border-box",
        position: sticky ? "sticky" : "relative",
        top: sticky ? 0 : undefined,
        zIndex: sticky ? 20 : undefined,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: stats.length > 0 ? 18 : 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            minWidth: 0,
            flex: 1,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: iconSize,
              height: iconSize,
              minWidth: iconSize,
              borderRadius: iconRadius,
              background: toneStyles.softBg,
              border: `1px solid ${toneStyles.border}`,
              color: toneStyles.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: compact ? 24 : 28,
              fontWeight: 800,
            }}
          >
            {icon}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            {badge ? (
              <div
                style={{
                  marginBottom: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {badge}
              </div>
            ) : null}

            <div
              style={{
                fontSize: compact ? 24 : 30,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: toneStyles.title,
                marginBottom: subtitle ? 8 : 0,
                wordBreak: "break-word",
              }}
            >
              {title}
            </div>

            {subtitle ? (
              <div
                style={{
                  fontSize: compact ? 13 : 14,
                  lineHeight: 1.65,
                  color: toneStyles.subtitle,
                  maxWidth: 820,
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

      {stats.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(
              Math.max(stats.length, 1),
              4
            )}, minmax(0, 1fr))`,
            gap: 12,
          }}
        >
          {stats.map((stat) => (
            <div
              key={`${stat.label}-${stat.value}`}
              style={{
                minHeight: compact ? 74 : 84,
                borderRadius: 16,
                background: toneStyles.statBg,
                border: `1px solid ${toneStyles.statBorder}`,
                padding: compact ? 12 : 14,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#6b7280",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                {stat.label}
              </div>

              <div
                style={{
                  fontSize: compact ? 20 : 24,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: toneStyles.title,
                  marginBottom: stat.helperText ? 6 : 0,
                  wordBreak: "break-word",
                }}
              >
                {formatValue(stat.value)}
              </div>

              {stat.helperText ? (
                <div
                  style={{
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: toneStyles.subtitle,
                  }}
                >
                  {stat.helperText}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}