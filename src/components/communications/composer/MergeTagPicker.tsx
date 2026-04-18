import React, { memo, useMemo, useState } from "react";
import {
  Search,
  Tags,
  Copy,
  Plus,
  Clock3,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export type MergeTagItem = {
  key: string;
  label: string;
  value: string;
  category: string;
  description?: string;
  example?: string;
  required?: boolean;
};

type Props = {
  tags: MergeTagItem[];
  selectedValue?: string | null;
  recentValues?: string[];
  className?: string;
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  onInsert?: (tag: MergeTagItem) => void;
  onCopy?: (tag: MergeTagItem) => void;
};

const pageStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.3fr) minmax(280px, 0.8fr)",
  gap: 16,
  width: "100%",
  minWidth: 0,
};

const mainPanelStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 22,
  boxShadow: "0 16px 45px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
};

const sidebarStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
  minWidth: 0,
};

const topStyle: React.CSSProperties = {
  padding: 20,
  borderBottom: "1px solid #eef2f7",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const titleRowStyle: React.CSSProperties = {
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
  fontSize: 22,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.03em",
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
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

const searchWrapStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
};

const searchInputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #dbe3ef",
  borderRadius: 14,
  padding: "12px 14px 12px 42px",
  fontSize: 14,
  color: "#0f172a",
  background: "#ffffff",
  outline: "none",
};

const searchIconStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: 14,
  transform: "translateY(-50%)",
  color: "#94a3b8",
  pointerEvents: "none",
};

const contentStyle: React.CSSProperties = {
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 18,
  minWidth: 0,
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
  gap: 12,
  flexWrap: "wrap",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.02em",
};

const sectionSubtleStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  fontWeight: 600,
};

const recentWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const recentChipStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #dbeafe",
  background: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const tagCardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  padding: 14,
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  transition: "all 0.2s ease",
  minWidth: 0,
};

const activeTagCardStyle: React.CSSProperties = {
  border: "1px solid #bfdbfe",
  background: "#f8fbff",
  boxShadow: "0 10px 24px rgba(37, 99, 235, 0.1)",
};

const topMetaStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
};

const labelWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "#0f172a",
  wordBreak: "break-word",
};

const valueStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#2563eb",
  background: "#eff6ff",
  border: "1px solid #dbeafe",
  borderRadius: 10,
  padding: "6px 8px",
  display: "inline-flex",
  width: "fit-content",
  maxWidth: "100%",
  wordBreak: "break-all",
};

const descriptionStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.6,
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const metaBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  borderRadius: 999,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#475569",
  fontSize: 11,
  fontWeight: 700,
  padding: "6px 9px",
};

const requiredBadgeStyle: React.CSSProperties = {
  ...metaBadgeStyle,
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  color: "#c2410c",
};

const actionRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const primaryButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#ffffff",
  borderRadius: 12,
  padding: "9px 12px",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const secondaryButtonStyle: React.CSSProperties = {
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
  padding: 24,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  textAlign: "center",
};

const sidebarCardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const summaryRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const summaryLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const summaryValueStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "#0f172a",
};

const helperTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.6,
};

function MergeTagPicker({
  tags,
  selectedValue = null,
  recentValues = [],
  className,
  title = "Merge Tag Picker",
  subtitle = "Insert dynamic placeholders into emails, messages, templates, and internal communication flows.",
  searchPlaceholder = "Search merge tags by label, value, or category",
  emptyStateTitle = "No merge tags found",
  emptyStateDescription = "Try a different keyword or clear your search to browse all available placeholders.",
  onInsert,
  onCopy,
}: Props) {
  const [query, setQuery] = useState("");

  const filteredTags = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return tags;

    return tags.filter((tag) => {
      const haystack = [
        tag.label,
        tag.value,
        tag.category,
        tag.description ?? "",
        tag.example ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [query, tags]);

  const recentTags = useMemo(() => {
    if (!recentValues.length) return [];
    const recentSet = new Set(recentValues);
    return tags.filter((tag) => recentSet.has(tag.value));
  }, [recentValues, tags]);

  const groupedTags = useMemo(() => {
    const map = new Map<string, MergeTagItem[]>();

    filteredTags.forEach((tag) => {
      const group = map.get(tag.category) ?? [];
      group.push(tag);
      map.set(tag.category, group);
    });

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredTags]);

  const totalCategories = useMemo(() => {
    return new Set(tags.map((tag) => tag.category)).size;
  }, [tags]);

  const selectedTag = useMemo(() => {
    return tags.find((tag) => tag.value === selectedValue) ?? null;
  }, [selectedValue, tags]);

  return (
    <div className={className} style={pageStyle}>
      <style>
        {`
          @media (max-width: 1100px) {
            .merge-tag-picker-root {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            .merge-tag-grid {
              grid-template-columns: 1fr !important;
            }

            .merge-tag-header-row {
              flex-direction: column;
              align-items: stretch !important;
            }
          }
        `}
      </style>

      <div className="merge-tag-picker-root" style={{ display: "contents" }}>
        <div style={mainPanelStyle}>
          <div style={topStyle}>
            <div className="merge-tag-header-row" style={titleRowStyle}>
              <div style={titleWrapStyle}>
                <h2 style={titleStyle}>{title}</h2>
                <p style={subtitleStyle}>{subtitle}</p>
              </div>

              <div style={badgeStyle}>
                <Sparkles size={14} />
                {tags.length} Merge Tags
              </div>
            </div>

            <div style={searchWrapStyle}>
              <Search size={16} style={searchIconStyle} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                style={searchInputStyle}
              />
            </div>
          </div>

          <div style={contentStyle}>
            {recentTags.length > 0 && !query.trim() ? (
              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <h3 style={sectionTitleStyle}>Recently Used</h3>
                  <span style={sectionSubtleStyle}>{recentTags.length} recent tags</span>
                </div>

                <div style={recentWrapStyle}>
                  {recentTags.map((tag) => (
                    <button
                      key={`recent-${tag.value}`}
                      type="button"
                      style={recentChipStyle}
                      onClick={() => onInsert?.(tag)}
                    >
                      <Clock3 size={12} />
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {groupedTags.length === 0 ? (
              <div style={emptyStateStyle}>
                <Search size={22} color="#64748b" />
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
                  {emptyStateTitle}
                </div>
                <div style={helperTextStyle}>{emptyStateDescription}</div>
              </div>
            ) : (
              groupedTags.map(([category, items]) => (
                <div key={category} style={sectionStyle}>
                  <div style={sectionHeaderStyle}>
                    <h3 style={sectionTitleStyle}>{category}</h3>
                    <span style={sectionSubtleStyle}>{items.length} available</span>
                  </div>

                  <div className="merge-tag-grid" style={gridStyle}>
                    {items.map((tag) => {
                      const isActive = selectedValue === tag.value;

                      return (
                        <div
                          key={tag.value}
                          style={{
                            ...tagCardStyle,
                            ...(isActive ? activeTagCardStyle : {}),
                          }}
                        >
                          <div style={topMetaStyle}>
                            <div style={labelWrapStyle}>
                              <div style={labelStyle}>{tag.label}</div>
                              <div style={valueStyle}>{tag.value}</div>
                            </div>

                            <ChevronRight size={16} color="#94a3b8" />
                          </div>

                          {tag.description ? (
                            <div style={descriptionStyle}>{tag.description}</div>
                          ) : null}

                          <div style={rowStyle}>
                            <span style={metaBadgeStyle}>
                              <Tags size={11} />
                              {tag.category}
                            </span>

                            {tag.required ? (
                              <span style={requiredBadgeStyle}>Required</span>
                            ) : null}
                          </div>

                          {tag.example ? (
                            <div style={helperTextStyle}>
                              Example: <strong>{tag.example}</strong>
                            </div>
                          ) : null}

                          <div style={actionRowStyle}>
                            <div style={buttonGroupStyle}>
                              <button
                                type="button"
                                style={primaryButtonStyle}
                                onClick={() => onInsert?.(tag)}
                              >
                                <Plus size={13} />
                                Insert
                              </button>

                              <button
                                type="button"
                                style={secondaryButtonStyle}
                                onClick={() => onCopy?.(tag)}
                              >
                                <Copy size={13} />
                                Copy
                              </button>
                            </div>

                            <span style={helperTextStyle}>
                              dynamic placeholder
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={sidebarStyle}>
          <div style={sidebarCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Info size={15} color="#2563eb" />
              <h3 style={{ ...sectionTitleStyle, margin: 0 }}>Selection Summary</h3>
            </div>

            <div style={summaryRowStyle}>
              <span style={summaryLabelStyle}>Total Tags</span>
              <span style={summaryValueStyle}>{tags.length}</span>
            </div>

            <div style={summaryRowStyle}>
              <span style={summaryLabelStyle}>Categories</span>
              <span style={summaryValueStyle}>{totalCategories}</span>
            </div>

            <div style={summaryRowStyle}>
              <span style={summaryLabelStyle}>Filtered</span>
              <span style={summaryValueStyle}>{filteredTags.length}</span>
            </div>

            <div style={helperTextStyle}>
              Use merge tags to personalize communication without manually editing each message.
            </div>
          </div>

          <div style={sidebarCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={15} color="#2563eb" />
              <h3 style={{ ...sectionTitleStyle, margin: 0 }}>Active Tag</h3>
            </div>

            {selectedTag ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
                    {selectedTag.label}
                  </div>
                  <div style={valueStyle}>{selectedTag.value}</div>
                </div>

                {selectedTag.description ? (
                  <div style={helperTextStyle}>{selectedTag.description}</div>
                ) : null}

                <div style={rowStyle}>
                  <span style={metaBadgeStyle}>{selectedTag.category}</span>
                  {selectedTag.required ? (
                    <span style={requiredBadgeStyle}>Required</span>
                  ) : null}
                </div>

                {selectedTag.example ? (
                  <div style={helperTextStyle}>
                    Example output: <strong>{selectedTag.example}</strong>
                  </div>
                ) : null}
              </>
            ) : (
              <div style={helperTextStyle}>
                No tag selected yet. Choose a merge tag to inspect its details here.
              </div>
            )}
          </div>

          <div
            style={{
              ...sidebarCardStyle,
              background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
              border: "1px solid #dbeafe",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Clock3 size={15} color="#2563eb" />
              <h3 style={{ ...sectionTitleStyle, margin: 0 }}>Best Practice</h3>
            </div>

            <div style={helperTextStyle}>
              Keep merge tags human-friendly. Personalization should feel natural, not robotic. Use defaults in your rendering layer for missing values.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(MergeTagPicker);