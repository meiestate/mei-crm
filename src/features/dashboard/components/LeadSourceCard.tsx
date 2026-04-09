import React from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type LeadSourceItem = {
  source: string;
  count: number;
  convertedCount?: number;
  revenue?: number;
  currency?: string;
};

type LeadSourceCardProps = {
  mode: ThemeMode;
  items: LeadSourceItem[];
  title?: string;
  onSourceClick?: (item: LeadSourceItem) => void;
  onViewAll?: () => void;
};

export default function LeadSourceCard({
  mode,
  items,
  title = "Lead Sources",
  onSourceClick,
  onViewAll,
}: LeadSourceCardProps) {
  const theme = getTheme(mode);

  const sortedItems = [...items].sort((a, b) => b.count - a.count);
  const totalLeads = sortedItems.reduce((sum, item) => sum + item.count, 0);
  const totalConverted = sortedItems.reduce(
    (sum, item) => sum + (item.convertedCount ?? 0),
    0
  );
  const totalRevenue = sortedItems.reduce(
    (sum, item) => sum + (item.revenue ?? 0),
    0
  );
  const topSource = sortedItems[0];

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
            Track where leads are coming from and which channels are converting
            best.
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
          <MiniStat mode={mode} label="Sources" value={String(sortedItems.length)} />
          <MiniStat mode={mode} label="Leads" value={String(totalLeads)} />
          <MiniStat mode={mode} label="Converted" value={String(totalConverted)} />
          {onViewAll ? (
            <button
              onClick={onViewAll}
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
              View All
            </button>
          ) : null}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {sortedItems.length === 0 ? (
          <EmptyState mode={mode} />
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {topSource ? (
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
                  TOP SOURCE
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
                      {topSource.source}
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 13,
                        color: theme.subText,
                        lineHeight: 1.6,
                      }}
                    >
                      {topSource.count} leads •{" "}
                      {getPercentage(topSource.count, totalLeads)} of total
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: theme.text,
                        lineHeight: 1,
                      }}
                    >
                      {topSource.convertedCount ?? 0}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 12,
                        fontWeight: 700,
                        color: theme.subText,
                      }}
                    >
                      Converted
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div style={{ display: "grid", gap: 12 }}>
              {sortedItems.map((item) => {
                const percentage = getPercentageNumber(item.count, totalLeads);
                const clickable = Boolean(onSourceClick);
                const conversionRate =
                  item.convertedCount && item.count > 0
                    ? Math.round((item.convertedCount / item.count) * 100)
                    : 0;

                return (
                  <div
                    key={item.source}
                    onClick={() => onSourceClick?.(item)}
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
                            fontSize: 14,
                            fontWeight: 800,
                            color: theme.text,
                            lineHeight: 1.3,
                          }}
                        >
                          {item.source}
                        </div>

                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: theme.subText,
                            lineHeight: 1.5,
                          }}
                        >
                          {item.count} leads • {percentage.toFixed(1)}% share
                          {item.convertedCount !== undefined
                            ? ` • ${conversionRate}% conversion`
                            : ""}
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
                          {item.count}
                        </div>
                        {item.revenue !== undefined ? (
                          <div
                            style={{
                              marginTop: 6,
                              fontSize: 12,
                              color: theme.subText,
                              lineHeight: 1.4,
                            }}
                          >
                            {formatCurrency(item.revenue, item.currency || "INR")}
                          </div>
                        ) : null}
                      </div>
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
                          width: `${percentage}%`,
                          height: "100%",
                          borderRadius: 999,
                          background:
                            item.source === topSource?.source
                              ? "linear-gradient(90deg, #4f46e5, #2563eb)"
                              : mode === "dark"
                              ? "rgba(148,163,184,0.5)"
                              : "rgba(148,163,184,0.65)",
                        }}
                      />
                    </div>

                    {(item.convertedCount !== undefined || item.revenue !== undefined) && (
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          flexWrap: "wrap",
                          marginTop: 12,
                        }}
                      >
                        {item.convertedCount !== undefined ? (
                          <MetricPill
                            mode={mode}
                            label={`Converted: ${item.convertedCount}`}
                          />
                        ) : null}

                        {item.revenue !== undefined ? (
                          <MetricPill
                            mode={mode}
                            label={`Revenue: ${formatCurrency(
                              item.revenue,
                              item.currency || "INR"
                            )}`}
                          />
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {totalRevenue > 0 ? (
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
                    TOTAL SOURCE-ATTRIBUTED REVENUE
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: theme.text,
                      lineHeight: 1,
                    }}
                  >
                    {formatCurrency(totalRevenue, sortedItems[0]?.currency || "INR")}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: theme.subText,
                    lineHeight: 1.6,
                    maxWidth: 260,
                    textAlign: "right",
                  }}
                >
                  Measure which acquisition channels actually move the revenue
                  needle, not just lead volume.
                </div>
              </div>
            ) : null}
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
          📡
        </div>

        <h4
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          No source data available
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
          Once leads start flowing in, source-wise performance will appear here
          with volume and conversion visibility.
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

function MetricPill({
  mode,
  label,
}: {
  mode: ThemeMode;
  label: string;
}) {
  const theme = getTheme(mode);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 10px",
        borderRadius: 999,
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        color: theme.subText,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

function getPercentage(value: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

function getPercentageNumber(value: number, total: number) {
  if (!total) return 0;
  return (value / total) * 100;
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