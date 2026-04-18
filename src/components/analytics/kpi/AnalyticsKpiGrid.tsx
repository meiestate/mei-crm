import AnalyticsKpiCard, {
  type AnalyticsKpiCardProps,
} from "./AnalyticsKpiCard";

export type AnalyticsKpiGridItem = AnalyticsKpiCardProps & {
  id: string;
};

export type AnalyticsKpiGridProps = {
  items?: AnalyticsKpiGridItem[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  gap?: number;
  loading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
  onCardClick?: (item: AnalyticsKpiGridItem) => void;
};

const DEFAULT_ITEMS: AnalyticsKpiGridItem[] = [
  {
    id: "qualified-leads",
    title: "Qualified Leads",
    subtitle: "Sales-ready opportunities matched for the active cycle",
    value: "248",
    delta: 18.6,
    deltaLabel: "vs previous month",
    trend: "up",
    tone: "success",
    icon: "📈",
    currentValue: 248,
    targetValue: 320,
    footerItems: [
      { label: "Target", value: "320" },
      { label: "Qualified", value: "248" },
      { label: "Gap", value: "72" },
    ],
    lastUpdated: "Updated just now",
  },
  {
    id: "pipeline-value",
    title: "Pipeline Value",
    subtitle: "Total active deal value currently under movement",
    value: "₹3.8Cr",
    delta: 12.1,
    deltaLabel: "vs last month",
    trend: "up",
    tone: "primary",
    icon: "💼",
    currentValue: 76,
    targetValue: 100,
    footerItems: [
      { label: "Target", value: "₹5Cr" },
      { label: "Current", value: "₹3.8Cr" },
      { label: "Coverage", value: "76%" },
    ],
    lastUpdated: "Updated 3 mins ago",
  },
  {
    id: "response-time",
    title: "Avg Response Time",
    subtitle: "Speed of first response across incoming lead channels",
    value: "12m",
    delta: -8.4,
    deltaLabel: "vs previous month",
    trend: "down",
    tone: "warning",
    icon: "⏱️",
    currentValue: 68,
    targetValue: 100,
    footerItems: [
      { label: "Best", value: "5m" },
      { label: "Current", value: "12m" },
      { label: "SLA", value: "<15m" },
    ],
    lastUpdated: "Updated 7 mins ago",
  },
  {
    id: "conversion-rate",
    title: "Conversion Rate",
    subtitle: "Lead-to-deal performance across the active funnel",
    value: "21.8%",
    delta: 4.2,
    deltaLabel: "vs previous period",
    trend: "up",
    tone: "info",
    icon: "🎯",
    currentValue: 22,
    targetValue: 30,
    footerItems: [
      { label: "Target", value: "30%" },
      { label: "Current", value: "21.8%" },
      { label: "Won", value: "42" },
    ],
    lastUpdated: "Updated 4 mins ago",
  },
];

function getGridTemplate(columns: 2 | 3 | 4): string {
  if (columns === 2) {
    return "repeat(2, minmax(0, 1fr))";
  }

  if (columns === 4) {
    return "repeat(4, minmax(0, 1fr))";
  }

  return "repeat(3, minmax(0, 1fr))";
}

function getLoadingPlaceholders(columns: 2 | 3 | 4): number[] {
  return Array.from({ length: columns * 2 }, (_, index) => index);
}

export default function AnalyticsKpiGrid({
  items = DEFAULT_ITEMS,
  title = "Analytics KPI Overview",
  subtitle = "Track your most important performance indicators in one live snapshot",
  columns = 4,
  gap = 16,
  loading = false,
  emptyTitle = "No KPI data found",
  emptySubtitle = "There are no KPI cards to display right now. Try changing filters or loading another dataset.",
  onCardClick,
}: AnalyticsKpiGridProps) {
  const loadingPlaceholders = getLoadingPlaceholders(columns);

  return (
    <section
      style={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: 14,
              lineHeight: 1.6,
              color: "#6b7280",
              maxWidth: 780,
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 36,
            padding: "0 12px",
            borderRadius: 999,
            background: "#111827",
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 800,
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Loading KPI cards..." : `${items.length} KPI cards`}
        </div>
      </div>

      {!loading && items.length === 0 ? (
        <div
          style={{
            borderRadius: 24,
            border: "1px dashed #d1d5db",
            background: "#ffffff",
            padding: 32,
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              margin: "0 auto 16px",
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            📊
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            {emptyTitle}
          </h3>

          <p
            style={{
              margin: "10px auto 0",
              maxWidth: 620,
              fontSize: 14,
              lineHeight: 1.7,
              color: "#6b7280",
            }}
          >
            {emptySubtitle}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: getGridTemplate(columns),
            gap,
          }}
        >
          {loading
            ? loadingPlaceholders.map((placeholderIndex) => (
                <AnalyticsKpiCard
                  key={`loading-kpi-${placeholderIndex}`}
                  loading={true}
                  title=""
                  subtitle=""
                  value=""
                />
              ))
            : items.map((item) => (
                <AnalyticsKpiCard
                  key={item.id}
                  {...item}
                  onClick={
                    onCardClick
                      ? () => {
                          onCardClick(item);
                        }
                      : item.onClick
                  }
                />
              ))}
        </div>
      )}
    </section>
  );
}