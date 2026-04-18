import { memo } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import {
  LayoutGrid,
  MessageSquareQuote,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";

export interface TemplateCategoryTabItem {
  id: string;
  label: string;
  count?: number;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string;
}

export interface TemplateCategoryTabsProps {
  items: TemplateCategoryTabItem[];
  activeTabId: string;
  onChange: (tabId: string) => void;
  className?: string;
  compact?: boolean;
  fullWidth?: boolean;
  showCounts?: boolean;
  showLeadingSummary?: boolean;
  summaryTitle?: string;
  summaryValue?: string;
  summaryIcon?: ReactNode;
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  compactWrapper: {
    gap: 10,
  },
  summaryCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    padding: "14px 16px",
    borderRadius: 18,
    border: "1px solid #e2e8f0",
    background:
      "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
  },
  compactSummaryCard: {
    padding: "12px 14px",
    borderRadius: 16,
  },
  summaryLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  },
  summaryIconShell: {
    width: 44,
    height: 44,
    minWidth: 44,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
  },
  compactSummaryIconShell: {
    width: 40,
    height: 40,
    minWidth: 40,
    borderRadius: 13,
  },
  summaryTextWrap: {
    minWidth: 0,
  },
  summaryTitle: {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "#64748b",
  },
  summaryValue: {
    margin: "4px 0 0 0",
    fontSize: 18,
    lineHeight: 1.2,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "#0f172a",
  },
  summaryHint: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    minHeight: 34,
    padding: "7px 12px",
    borderRadius: 999,
    border: "1px solid #ddd6fe",
    background: "#f5f3ff",
    color: "#7c3aed",
    fontSize: 12,
    fontWeight: 700,
  },
  tabScroller: {
    width: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    paddingBottom: 2,
  },
  tabRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: "max-content",
  },
  fullWidthRow: {
    minWidth: "100%",
  },
  tabButton: {
    position: "relative",
    minHeight: 48,
    padding: "0 14px",
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#334155",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition:
      "background 180ms ease, border-color 180ms ease, color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
    outline: "none",
  },
  compactTabButton: {
    minHeight: 42,
    padding: "0 12px",
    borderRadius: 12,
    fontSize: 12.5,
  },
  activeTabButton: {
    background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)",
    borderColor: "#93c5fd",
    color: "#1d4ed8",
    boxShadow: "0 10px 22px rgba(37, 99, 235, 0.10)",
  },
  disabledTabButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  activeGlow: {
    position: "absolute",
    inset: "auto 10px 6px 10px",
    height: 3,
    borderRadius: 999,
    background: "linear-gradient(90deg, #2563eb, #06b6d4)",
  },
  label: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },
  countBadge: {
    minWidth: 22,
    height: 22,
    padding: "0 7px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11.5,
    fontWeight: 800,
    color: "#1d4ed8",
    background: "#dbeafe",
    border: "1px solid #bfdbfe",
  },
  passiveCountBadge: {
    color: "#475569",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  textBadge: {
    minHeight: 22,
    padding: "0 8px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 800,
    color: "#7c3aed",
    background: "#f5f3ff",
    border: "1px solid #ddd6fe",
  },
};

function getDefaultSummaryValue(items: TemplateCategoryTabItem[]) {
  const total = items.reduce((sum, item) => sum + (item.count ?? 0), 0);
  return `${total} templates`;
}

function getFallbackIcon(id: string) {
  switch (id.toLowerCase()) {
    case "all":
      return <LayoutGrid size={16} />;
    case "favorites":
    case "favourites":
      return <Star size={16} />;
    case "featured":
      return <Sparkles size={16} />;
    default:
      return <Tag size={16} />;
  }
}

function TemplateCategoryTabsComponent({
  items,
  activeTabId,
  onChange,
  className,
  compact = false,
  fullWidth = false,
  showCounts = true,
  showLeadingSummary = false,
  summaryTitle = "Template Library",
  summaryValue,
  summaryIcon,
}: TemplateCategoryTabsProps) {
  const resolvedSummaryValue = summaryValue ?? getDefaultSummaryValue(items);

  const handleKeyDown =
    (tabId: string, disabled?: boolean) => (event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onChange(tabId);
      }
    };

  return (
    <section
      className={className}
      style={{
        ...styles.wrapper,
        ...(compact ? styles.compactWrapper : null),
      }}
    >
      {showLeadingSummary ? (
        <div
          style={{
            ...styles.summaryCard,
            ...(compact ? styles.compactSummaryCard : null),
          }}
        >
          <div style={styles.summaryLeft}>
            <div
              style={{
                ...styles.summaryIconShell,
                ...(compact ? styles.compactSummaryIconShell : null),
              }}
            >
              {summaryIcon ?? <MessageSquareQuote size={compact ? 18 : 20} />}
            </div>

            <div style={styles.summaryTextWrap}>
              <p style={styles.summaryTitle}>{summaryTitle}</p>
              <p style={styles.summaryValue}>{resolvedSummaryValue}</p>
            </div>
          </div>

          <div style={styles.summaryHint}>
            <Sparkles size={14} />
            Organized by category
          </div>
        </div>
      ) : null}

      <div style={styles.tabScroller}>
        <div
          style={{
            ...styles.tabRow,
            ...(fullWidth ? styles.fullWidthRow : null),
          }}
          role="tablist"
          aria-label="Template categories"
        >
          {items.map((item) => {
            const isActive = item.id === activeTabId;

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-disabled={item.disabled}
                tabIndex={item.disabled ? -1 : isActive ? 0 : -1}
                onClick={() => {
                  if (item.disabled) return;
                  onChange(item.id);
                }}
                onKeyDown={handleKeyDown(item.id, item.disabled)}
                style={{
                  ...styles.tabButton,
                  ...(compact ? styles.compactTabButton : null),
                  ...(isActive ? styles.activeTabButton : null),
                  ...(item.disabled ? styles.disabledTabButton : null),
                  ...(fullWidth
                    ? {
                        flex: 1,
                      }
                    : null),
                }}
              >
                <span style={styles.label}>
                  {item.icon ?? getFallbackIcon(item.id)}
                  {item.label}
                </span>

                {showCounts && typeof item.count === "number" ? (
                  <span
                    style={{
                      ...styles.countBadge,
                      ...(isActive ? null : styles.passiveCountBadge),
                    }}
                  >
                    {item.count}
                  </span>
                ) : null}

                {item.badge ? (
                  <span style={styles.textBadge}>{item.badge}</span>
                ) : null}

                {isActive ? <span style={styles.activeGlow} /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const TemplateCategoryTabs = memo(TemplateCategoryTabsComponent);

export default TemplateCategoryTabs;