import { useMemo } from "react";

type CurrencyFormat = "INR" | "USD" | "EUR" | "GBP";

export type ActivePipelineValueCardMetric = {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
};

export type ActivePipelineValueCardProps = {
  title?: string;
  subtitle?: string;
  totalValue?: number;
  currency?: CurrencyFormat;
  targetValue?: number;
  previousValue?: number;
  qualifiedValue?: number;
  proposalValue?: number;
  negotiationValue?: number;
  closingValue?: number;
  dealsCount?: number;
  lastUpdated?: string;
  onViewDetails?: () => void;
  metrics?: ActivePipelineValueCardMetric[];
  loading?: boolean;
};

const DEFAULT_PROPS = {
  title: "Active Pipeline Value",
  subtitle: "Live value of all open deals currently moving through the pipeline",
  totalValue: 125000000,
  currency: "INR" as CurrencyFormat,
  targetValue: 150000000,
  previousValue: 112000000,
  qualifiedValue: 32000000,
  proposalValue: 28000000,
  negotiationValue: 41000000,
  closingValue: 24000000,
  dealsCount: 46,
  lastUpdated: "Updated 12 mins ago",
  loading: false,
};

function formatCurrency(value: number, currency: CurrencyFormat): string {
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

function formatCompactCurrency(value: number, currency: CurrencyFormat): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString("en-IN")}`;
  }
}

function formatPercentage(value: number): string {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(1)}%`;
}

function getGrowthTone(
  growth: number
): {
  bg: string;
  text: string;
  border: string;
  prefix: string;
} {
  if (growth > 0) {
    return {
      bg: "#ecfdf3",
      text: "#047857",
      border: "#a7f3d0",
      prefix: "+",
    };
  }

  if (growth < 0) {
    return {
      bg: "#fef2f2",
      text: "#b91c1c",
      border: "#fecaca",
      prefix: "",
    };
  }

  return {
    bg: "#f3f4f6",
    text: "#4b5563",
    border: "#d1d5db",
    prefix: "",
  };
}

function getMetricToneStyles(
  tone: ActivePipelineValueCardMetric["tone"] = "default"
) {
  switch (tone) {
    case "success":
      return {
        background: "#ecfdf3",
        border: "#a7f3d0",
        text: "#047857",
      };
    case "warning":
      return {
        background: "#fff7ed",
        border: "#fdba74",
        text: "#c2410c",
      };
    case "danger":
      return {
        background: "#fef2f2",
        border: "#fecaca",
        text: "#b91c1c",
      };
    case "info":
      return {
        background: "#eff6ff",
        border: "#bfdbfe",
        text: "#1d4ed8",
      };
    default:
      return {
        background: "#f9fafb",
        border: "#e5e7eb",
        text: "#111827",
      };
  }
}

export default function ActivePipelineValueCard({
  title = DEFAULT_PROPS.title,
  subtitle = DEFAULT_PROPS.subtitle,
  totalValue = DEFAULT_PROPS.totalValue,
  currency = DEFAULT_PROPS.currency,
  targetValue = DEFAULT_PROPS.targetValue,
  previousValue = DEFAULT_PROPS.previousValue,
  qualifiedValue = DEFAULT_PROPS.qualifiedValue,
  proposalValue = DEFAULT_PROPS.proposalValue,
  negotiationValue = DEFAULT_PROPS.negotiationValue,
  closingValue = DEFAULT_PROPS.closingValue,
  dealsCount = DEFAULT_PROPS.dealsCount,
  lastUpdated = DEFAULT_PROPS.lastUpdated,
  onViewDetails,
  metrics,
  loading = DEFAULT_PROPS.loading,
}: ActivePipelineValueCardProps) {
  const progress = useMemo(() => {
    if (!targetValue || targetValue <= 0) return 0;
    return Math.min((totalValue / targetValue) * 100, 100);
  }, [targetValue, totalValue]);

  const growth = useMemo(() => {
    if (!previousValue || previousValue <= 0) return 0;
    return ((totalValue - previousValue) / previousValue) * 100;
  }, [previousValue, totalValue]);

  const stageBreakdown = useMemo(() => {
    const totalStageValue =
      qualifiedValue + proposalValue + negotiationValue + closingValue;

    const safePercent = (value: number) =>
      totalStageValue > 0 ? (value / totalStageValue) * 100 : 0;

    return [
      {
        key: "qualified",
        label: "Qualified",
        value: qualifiedValue,
        percent: safePercent(qualifiedValue),
      },
      {
        key: "proposal",
        label: "Proposal",
        value: proposalValue,
        percent: safePercent(proposalValue),
      },
      {
        key: "negotiation",
        label: "Negotiation",
        value: negotiationValue,
        percent: safePercent(negotiationValue),
      },
      {
        key: "closing",
        label: "Closing",
        value: closingValue,
        percent: safePercent(closingValue),
      },
    ];
  }, [closingValue, negotiationValue, proposalValue, qualifiedValue]);

  const growthTone = getGrowthTone(growth);

  const resolvedMetrics: ActivePipelineValueCardMetric[] = useMemo(() => {
    if (metrics && metrics.length > 0) {
      return metrics;
    }

    return [
      {
        label: "Open Deals",
        value: `${dealsCount}`,
        tone: "info",
      },
      {
        label: "Target Coverage",
        value: formatPercentage(progress),
        tone: progress >= 75 ? "success" : progress >= 45 ? "warning" : "danger",
      },
      {
        label: "MoM Growth",
        value: `${growth > 0 ? "+" : ""}${formatPercentage(growth)}`,
        tone: growth > 0 ? "success" : growth < 0 ? "danger" : "default",
      },
    ];
  }, [dealsCount, growth, metrics, progress]);

  if (loading) {
    return (
      <section
        style={{
          width: "100%",
          borderRadius: 24,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          padding: 20,
          boxSizing: "border-box",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        }}
      >
        <div
          style={{
            height: 20,
            width: 180,
            borderRadius: 8,
            background: "#e5e7eb",
            marginBottom: 10,
          }}
        />
        <div
          style={{
            height: 14,
            width: "70%",
            borderRadius: 8,
            background: "#f3f4f6",
            marginBottom: 18,
          }}
        />
        <div
          style={{
            height: 42,
            width: 220,
            borderRadius: 10,
            background: "#e5e7eb",
            marginBottom: 18,
          }}
        />
        <div
          style={{
            height: 10,
            width: "100%",
            borderRadius: 999,
            background: "#f3f4f6",
            marginBottom: 18,
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              style={{
                height: 76,
                borderRadius: 16,
                background: "#f9fafb",
                border: "1px solid #f3f4f6",
              }}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        width: "100%",
        borderRadius: 24,
        border: "1px solid #e5e7eb",
        background:
          "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(249,250,251,1) 100%)",
        padding: 20,
        boxSizing: "border-box",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.07)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div style={{ minWidth: 0, flex: "1 1 320px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 8,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h3>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 30,
                padding: "0 10px",
                borderRadius: 999,
                background: growthTone.bg,
                color: growthTone.text,
                border: `1px solid ${growthTone.border}`,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {growthTone.prefix}
              {formatPercentage(growth)}
            </span>
          </div>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: 14,
              lineHeight: 1.6,
              maxWidth: 680,
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 34,
              padding: "0 12px",
              borderRadius: 999,
              background: "#111827",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {dealsCount} live deals
          </span>

          {onViewDetails ? (
            <button
              type="button"
              onClick={onViewDetails}
              style={{
                height: 40,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#111827",
                fontSize: 14,
                fontWeight: 700,
                padding: "0 14px",
                cursor: "pointer",
              }}
            >
              View details
            </button>
          ) : null}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 1.4fr) minmax(260px, 1fr)",
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            borderRadius: 20,
            background: "#111827",
            color: "#ffffff",
            padding: 18,
            boxSizing: "border-box",
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "rgba(255,255,255,0.72)",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Total pipeline value
          </div>

          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              marginBottom: 10,
              wordBreak: "break-word",
            }}
          >
            {formatCurrency(totalValue, currency)}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Previous: {formatCompactCurrency(previousValue, currency)}
            </span>

            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.4)",
              }}
            />

            <span
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Target: {formatCompactCurrency(targetValue, currency)}
            </span>
          </div>
        </div>

        <div
          style={{
            borderRadius: 20,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            padding: 18,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#374151",
              }}
            >
              Target progress
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#111827",
              }}
            >
              {formatPercentage(progress)}
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: 12,
              borderRadius: 999,
              background: "#e5e7eb",
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: `${Math.max(0, Math.min(progress, 100))}%`,
                height: "100%",
                borderRadius: 999,
                background:
                  progress >= 75
                    ? "linear-gradient(90deg, #16a34a 0%, #22c55e 100%)"
                    : progress >= 45
                    ? "linear-gradient(90deg, #d97706 0%, #f59e0b 100%)"
                    : "linear-gradient(90deg, #dc2626 0%, #ef4444 100%)",
                transition: "width 240ms ease",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              color: "#6b7280",
              fontSize: 13,
            }}
          >
            <span>Achieved: {formatCompactCurrency(totalValue, currency)}</span>
            <span>
              Gap:{" "}
              {formatCompactCurrency(Math.max(targetValue - totalValue, 0), currency)}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {resolvedMetrics.map((metric) => {
          const tone = getMetricToneStyles(metric.tone);

          return (
            <div
              key={`${metric.label}-${metric.value}`}
              style={{
                borderRadius: 18,
                background: tone.background,
                border: `1px solid ${tone.border}`,
                padding: 14,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#6b7280",
                  marginBottom: 8,
                }}
              >
                {metric.label}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: tone.text,
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                }}
              >
                {metric.value}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          borderRadius: 20,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          padding: 18,
          boxSizing: "border-box",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Pipeline stage split
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#6b7280",
            }}
          >
            Open value distribution
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {stageBreakdown.map((stage, index) => (
            <StageValueCard
              key={stage.key}
              label={stage.label}
              value={formatCompactCurrency(stage.value, currency)}
              percent={stage.percent}
              index={index}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "#6b7280",
            fontWeight: 600,
          }}
        >
          {lastUpdated}
        </span>

        <span
          style={{
            fontSize: 12,
            color: "#374151",
            fontWeight: 700,
          }}
        >
          Pipeline health:{" "}
          {progress >= 75 ? "Strong" : progress >= 45 ? "Moderate" : "Needs attention"}
        </span>
      </div>
    </section>
  );
}

type StageValueCardProps = {
  label: string;
  value: string;
  percent: number;
  index: number;
};

function StageValueCard({
  label,
  value,
  percent,
  index,
}: StageValueCardProps) {
  const accents = [
    { bg: "#eff6ff", bar: "#2563eb", text: "#1d4ed8" },
    { bg: "#f0fdf4", bar: "#16a34a", text: "#15803d" },
    { bg: "#faf5ff", bar: "#9333ea", text: "#7e22ce" },
    { bg: "#fff7ed", bar: "#ea580c", text: "#c2410c" },
  ];

  const tone = accents[index % accents.length];

  return (
    <div
      style={{
        borderRadius: 16,
        background: tone.bg,
        padding: 14,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#6b7280",
          marginBottom: 8,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: tone.text,
          marginBottom: 10,
          lineHeight: 1.2,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>

      <div
        style={{
          width: "100%",
          height: 8,
          borderRadius: 999,
          background: "rgba(255,255,255,0.72)",
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: `${Math.max(0, Math.min(percent, 100))}%`,
            height: "100%",
            background: tone.bar,
            borderRadius: 999,
          }}
        />
      </div>

      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#4b5563",
        }}
      >
        {formatPercentage(percent)} of open value
      </div>
    </div>
  );
}