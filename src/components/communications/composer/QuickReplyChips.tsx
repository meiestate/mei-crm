import React, { memo, useMemo, useState } from "react";
import {
  MessageSquareQuote,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock3,
  Star,
  CheckCircle2,
} from "lucide-react";

export type QuickReplyChipItem = {
  id: string;
  label: string;
  value: string;
  category?: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  isPopular?: boolean;
  isRecent?: boolean;
};

type Props = {
  items: QuickReplyChipItem[];
  selectedId?: string | null;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  maxVisible?: number;
  showCategories?: boolean;
  compact?: boolean;
  wrap?: boolean;
  disabled?: boolean;
  className?: string;
  onSelect?: (item: QuickReplyChipItem) => void;
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
  width: "100%",
  minWidth: 0,
};

const headerWrapStyle: React.CSSProperties = {
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
  fontSize: 16,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.02em",
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.6,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#334155",
  fontSize: 12,
  fontWeight: 700,
};

const sectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  minWidth: 0,
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  fontWeight: 800,
  color: "#334155",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const sectionMetaStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  fontWeight: 700,
};

const chipsWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  flexWrap: "wrap",
};

const chipsColumnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const chipStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#0f172a",
  borderRadius: 16,
  padding: "12px 14px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "flex-start",
  gap: 10,
  minHeight: 48,
  minWidth: 0,
  maxWidth: "100%",
  textAlign: "left",
  transition: "all 0.2s ease",
  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
};

const chipCompactStyle: React.CSSProperties = {
  padding: "9px 12px",
  minHeight: 40,
  borderRadius: 999,
  alignItems: "center",
};

const chipActiveStyle: React.CSSProperties = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  color: "#1d4ed8",
  boxShadow: "0 10px 24px rgba(37, 99, 235, 0.1)",
};

const chipDisabledStyle: React.CSSProperties = {
  opacity: 0.55,
  cursor: "not-allowed",
  background: "#f8fafc",
  boxShadow: "none",
};

const iconWrapStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 1,
  flexShrink: 0,
};

const chipContentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
  minWidth: 0,
};

const chipTitleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const chipLabelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: "inherit",
  lineHeight: 1.35,
  wordBreak: "break-word",
};

const chipDescriptionStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const miniBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  borderRadius: 999,
  padding: "4px 8px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#475569",
  fontSize: 10,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const popularBadgeStyle: React.CSSProperties = {
  ...miniBadgeStyle,
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  color: "#c2410c",
};

const recentBadgeStyle: React.CSSProperties = {
  ...miniBadgeStyle,
  background: "#ecfeff",
  border: "1px solid #a5f3fc",
  color: "#0f766e",
};

const footerRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const footerTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.6,
};

const toggleButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #dbe3ef",
  background: "#ffffff",
  color: "#334155",
  borderRadius: 12,
  padding: "9px 12px",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const emptyStateStyle: React.CSSProperties = {
  border: "1px dashed #cbd5e1",
  background: "#f8fafc",
  borderRadius: 18,
  padding: 22,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

function QuickReplyChips({
  items,
  selectedId = null,
  title = "Quick Replies",
  subtitle = "Use ready-made replies to respond faster and keep messaging consistent across the team.",
  emptyTitle = "No quick replies available",
  emptyDescription = "Add quick reply templates to improve response speed and consistency.",
  maxVisible = 8,
  showCategories = true,
  compact = false,
  wrap = true,
  disabled = false,
  className,
  onSelect,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const groupedItems = useMemo(() => {
    if (!showCategories) {
      return [["Quick Replies", items]] as Array<[string, QuickReplyChipItem[]]>;
    }

    const map = new Map<string, QuickReplyChipItem[]>();

    items.forEach((item) => {
      const category = item.category?.trim() || "General";
      const list = map.get(category) ?? [];
      list.push(item);
      map.set(category, list);
    });

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [items, showCategories]);

  const totalItems = items.length;
  const visibleItemsCount = expanded ? totalItems : Math.min(maxVisible, totalItems);

  const visibleGroupedItems = useMemo(() => {
    let remaining = visibleItemsCount;

    return groupedItems
      .map(([category, categoryItems]) => {
        if (remaining <= 0) return [category, []] as [string, QuickReplyChipItem[]];

        const slice = categoryItems.slice(0, remaining);
        remaining -= slice.length;
        return [category, slice] as [string, QuickReplyChipItem[]];
      })
      .filter(([, list]) => list.length > 0);
  }, [groupedItems, visibleItemsCount]);

  const hasMore = totalItems > maxVisible;

  function handleSelect(item: QuickReplyChipItem) {
    if (disabled || item.disabled) return;
    onSelect?.(item);
  }

  if (items.length === 0) {
    return (
      <div className={className} style={containerStyle}>
        <div style={headerWrapStyle}>
          <div style={titleWrapStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>
        </div>

        <div style={emptyStateStyle}>
          <MessageSquareQuote size={22} color="#64748b" />
          <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
            {emptyTitle}
          </div>
          <div style={footerTextStyle}>{emptyDescription}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      <style>
        {`
          @media (max-width: 768px) {
            .quick-reply-header-row {
              flex-direction: column;
              align-items: stretch !important;
            }
          }
        `}
      </style>

      <div className="quick-reply-header-row" style={headerWrapStyle}>
        <div style={titleWrapStyle}>
          <h3 style={titleStyle}>{title}</h3>
          <p style={subtitleStyle}>{subtitle}</p>
        </div>

        <div style={badgeStyle}>
          <Sparkles size={14} />
          {totalItems} Saved Replies
        </div>
      </div>

      {visibleGroupedItems.map(([category, categoryItems]) => (
        <div key={category} style={sectionStyle}>
          {showCategories ? (
            <div style={sectionHeaderStyle}>
              <h4 style={sectionTitleStyle}>{category}</h4>
              <span style={sectionMetaStyle}>{categoryItems.length} visible</span>
            </div>
          ) : null}

          <div style={wrap ? chipsWrapStyle : chipsColumnStyle}>
            {categoryItems.map((item) => {
              const isActive = selectedId === item.id;
              const isDisabled = disabled || item.disabled;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  disabled={isDisabled}
                  style={{
                    ...chipStyle,
                    ...(compact ? chipCompactStyle : {}),
                    ...(isActive ? chipActiveStyle : {}),
                    ...(isDisabled ? chipDisabledStyle : {}),
                    ...(wrap
                      ? { flex: compact ? "0 0 auto" : "0 1 auto" }
                      : { width: "100%" }),
                  }}
                  title={item.description || item.label}
                >
                  <span style={iconWrapStyle}>
                    {item.icon ?? (
                      <MessageSquareQuote
                        size={compact ? 15 : 16}
                        color={isActive ? "#1d4ed8" : "#64748b"}
                      />
                    )}
                  </span>

                  <span style={chipContentStyle}>
                    <span style={chipTitleRowStyle}>
                      <span style={chipLabelStyle}>{item.label}</span>

                      {item.isPopular ? (
                        <span style={popularBadgeStyle}>
                          <Star size={10} />
                          Popular
                        </span>
                      ) : null}

                      {item.isRecent ? (
                        <span style={recentBadgeStyle}>
                          <Clock3 size={10} />
                          Recent
                        </span>
                      ) : null}

                      {isActive ? (
                        <span style={miniBadgeStyle}>
                          <CheckCircle2 size={10} />
                          Selected
                        </span>
                      ) : null}
                    </span>

                    {!compact && item.description ? (
                      <span style={chipDescriptionStyle}>{item.description}</span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div style={footerRowStyle}>
        <div style={footerTextStyle}>
          Tap a reply chip to instantly insert a polished response into the composer.
        </div>

        {hasMore ? (
          <button
            type="button"
            style={toggleButtonStyle}
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? (
              <>
                <ChevronUp size={14} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                Show More
              </>
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default memo(QuickReplyChips);