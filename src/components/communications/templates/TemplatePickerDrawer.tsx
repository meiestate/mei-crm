import { memo, useEffect, useMemo, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import {
  ArrowLeft,
  PanelRightClose,
  Search,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import TemplateCategoryTabs, {
  type TemplateCategoryTabItem,
} from "./TemplateCategoryTabs";
import TemplateList, {
  type TemplateListItem,
  type TemplateListViewMode,
} from "./TemplateList";

export interface TemplatePickerDrawerProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  templates: TemplateListItem[];
  categories?: TemplateCategoryTabItem[];
  selectedTemplateId?: string | null;
  defaultCategoryId?: string;
  defaultViewMode?: TemplateListViewMode;
  showOverlay?: boolean;
  closeOnOverlayClick?: boolean;
  showHeaderCloseButton?: boolean;
  showBackButton?: boolean;
  width?: number | string;
  className?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateHint?: string;
  onClose: () => void;
  onBack?: () => void;
  onApplyTemplate?: (templateId: string) => void;
  onPreviewTemplate?: (templateId: string) => void;
  onEditTemplate?: (templateId: string) => void;
  onDuplicateTemplate?: (templateId: string) => void;
  onDeleteTemplate?: (templateId: string) => void;
  onFavoriteToggle?: (templateId: string) => void;
}

const styles: Record<string, CSSProperties> = {
  root: {
    position: "fixed",
    inset: 0,
    zIndex: 60,
    display: "flex",
    justifyContent: "flex-end",
    pointerEvents: "none",
  },
  rootOpen: {
    pointerEvents: "auto",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(15, 23, 42, 0.48)",
    backdropFilter: "blur(4px)",
    opacity: 0,
    transition: "opacity 220ms ease",
  },
  overlayOpen: {
    opacity: 1,
  },
  drawer: {
    position: "relative",
    width: 560,
    maxWidth: "100%",
    height: "100%",
    background:
      "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
    borderLeft: "1px solid #e2e8f0",
    boxShadow: "-20px 0 50px rgba(15, 23, 42, 0.16)",
    display: "flex",
    flexDirection: "column",
    transform: "translateX(100%)",
    transition: "transform 260ms ease",
    overflow: "hidden",
  },
  drawerOpen: {
    transform: "translateX(0)",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    padding: "18px 18px 16px 18px",
    borderBottom: "1px solid #e2e8f0",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)",
    backdropFilter: "blur(10px)",
  },
  headerTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headerLeft: {
    minWidth: 0,
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  titleIconShell: {
    width: 46,
    height: 46,
    minWidth: 46,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
  },
  titleWrap: {
    minWidth: 0,
    flex: 1,
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: 20,
    lineHeight: 1.2,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "#0f172a",
  },
  subtitle: {
    margin: "6px 0 0 0",
    fontSize: 13.5,
    lineHeight: 1.7,
    color: "#64748b",
    maxWidth: 420,
  },
  helperBadge: {
    minHeight: 26,
    padding: "4px 10px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11.5,
    fontWeight: 800,
    color: "#7c3aed",
    border: "1px solid #ddd6fe",
    background: "#f5f3ff",
  },
  iconButtonRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    minWidth: 40,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#475569",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    transition: "all 160ms ease",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 14px",
    height: 46,
    borderRadius: 14,
    border: "1px solid #dbe2ea",
    background: "#ffffff",
    boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.02)",
  },
  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 13.5,
    fontWeight: 500,
    color: "#0f172a",
  },
  utilityBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  utilityLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  utilityChip: {
    minHeight: 28,
    padding: "5px 10px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    color: "#334155",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  body: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  footer: {
    borderTop: "1px solid #e2e8f0",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  footerMeta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  footerHint: {
    fontSize: 12.5,
    color: "#64748b",
    lineHeight: 1.6,
  },
  footerActions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  secondaryButton: {
    height: 40,
    padding: "0 14px",
    borderRadius: 12,
    border: "1px solid #dbe2ea",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: 12.5,
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
  },
  primaryButton: {
    height: 40,
    padding: "0 16px",
    borderRadius: 12,
    border: "1px solid #2563eb",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: 12.5,
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(37, 99, 235, 0.18)",
  },
  disabledPrimaryButton: {
    opacity: 0.55,
    cursor: "not-allowed",
    boxShadow: "none",
  },
};

function buildCategoryTabs(
  categories: TemplateCategoryTabItem[] | undefined,
  templates: TemplateListItem[],
): TemplateCategoryTabItem[] {
  if (categories && categories.length > 0) {
    return categories;
  }

  const categoryMap = new Map<string, number>();

  templates.forEach((template) => {
    const key = template.category?.trim() || "Uncategorized";
    categoryMap.set(key, (categoryMap.get(key) ?? 0) + 1);
  });

  const derivedCategories = Array.from(categoryMap.entries()).map(([label, count]) => ({
    id: label.toLowerCase().replace(/\s+/g, "-"),
    label,
    count,
    icon: <Tag size={16} />,
  }));

  return [
    {
      id: "all",
      label: "All",
      count: templates.length,
      icon: <Sparkles size={16} />,
    },
    ...derivedCategories,
  ];
}

function matchesCategory(
  template: TemplateListItem,
  activeCategoryId: string,
  categories: TemplateCategoryTabItem[],
) {
  if (activeCategoryId === "all") return true;

  const activeCategory = categories.find((item) => item.id === activeCategoryId);
  if (!activeCategory) return true;

  const normalizedLabel = activeCategory.label.trim().toLowerCase();

  if (normalizedLabel === "favorites" || normalizedLabel === "favourites") {
    return Boolean(template.isFavorite);
  }

  if (normalizedLabel === "featured") {
    return Boolean(template.isFeatured);
  }

  const templateCategory = template.category?.trim().toLowerCase() || "uncategorized";
  return templateCategory === normalizedLabel;
}

function TemplatePickerDrawerComponent({
  isOpen,
  title = "Pick a Template",
  subtitle = "Choose a ready-made communication flow, preview the copy, and drop it straight into your composer without extra friction.",
  templates,
  categories,
  selectedTemplateId = null,
  defaultCategoryId = "all",
  defaultViewMode = "grid",
  showOverlay = true,
  closeOnOverlayClick = true,
  showHeaderCloseButton = true,
  showBackButton = false,
  width = 560,
  className,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateHint,
  onClose,
  onBack,
  onApplyTemplate,
  onPreviewTemplate,
  onEditTemplate,
  onDuplicateTemplate,
  onDeleteTemplate,
  onFavoriteToggle,
}: TemplatePickerDrawerProps) {
  const [searchValue, setSearchValue] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(defaultCategoryId);
  const [viewMode, setViewMode] = useState<TemplateListViewMode>(defaultViewMode);
  const [pendingSelectedTemplateId, setPendingSelectedTemplateId] = useState<string | null>(
    selectedTemplateId,
  );

  useEffect(() => {
    if (isOpen) {
      setPendingSelectedTemplateId(selectedTemplateId);
    }
  }, [isOpen, selectedTemplateId]);

  useEffect(() => {
    setActiveCategoryId(defaultCategoryId);
  }, [defaultCategoryId]);

  useEffect(() => {
    setViewMode(defaultViewMode);
  }, [defaultViewMode]);

  const resolvedCategories = useMemo(
    () => buildCategoryTabs(categories, templates),
    [categories, templates],
  );

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    return templates.filter((template) => {
      const categoryMatch = matchesCategory(template, activeCategoryId, resolvedCategories);
      if (!categoryMatch) return false;

      if (!normalizedQuery) return true;

      const haystack = [
        template.title,
        template.description,
        template.preview,
        template.category,
        ...(template.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [templates, searchValue, activeCategoryId, resolvedCategories]);

  const selectedTemplate = useMemo(
    () =>
      templates.find(
        (template) =>
          template.id === (pendingSelectedTemplateId ?? selectedTemplateId ?? ""),
      ) ?? null,
    [templates, pendingSelectedTemplateId, selectedTemplateId],
  );

  const selectedCategory = resolvedCategories.find(
    (item) => item.id === activeCategoryId,
  );

  const handleDrawerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className={className}
      style={{
        ...styles.root,
        ...(isOpen ? styles.rootOpen : null),
      }}
      aria-hidden={!isOpen}
    >
      {showOverlay ? (
        <button
          type="button"
          aria-label="Close template picker overlay"
          onClick={() => {
            if (closeOnOverlayClick) onClose();
          }}
          style={{
            ...styles.overlay,
            ...(isOpen ? styles.overlayOpen : null),
            border: "none",
            cursor: closeOnOverlayClick ? "pointer" : "default",
          }}
        />
      ) : null}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onKeyDown={handleDrawerKeyDown}
        style={{
          ...styles.drawer,
          ...(isOpen ? styles.drawerOpen : null),
          width,
        }}
      >
        <header style={styles.header}>
          <div style={styles.headerTop}>
            <div style={styles.headerLeft}>
              <div style={styles.titleIconShell}>
                <Sparkles size={20} />
              </div>

              <div style={styles.titleWrap}>
                <div style={styles.titleRow}>
                  <h2 style={styles.title}>{title}</h2>
                  <span style={styles.helperBadge}>
                    <Sparkles size={12} />
                    Ready-to-use
                  </span>
                </div>
                <p style={styles.subtitle}>{subtitle}</p>
              </div>
            </div>

            <div style={styles.iconButtonRow}>
              {showBackButton ? (
                <button
                  type="button"
                  onClick={onBack}
                  style={styles.iconButton}
                  aria-label="Go back"
                >
                  <ArrowLeft size={18} />
                </button>
              ) : null}

              {showHeaderCloseButton ? (
                <button
                  type="button"
                  onClick={onClose}
                  style={styles.iconButton}
                  aria-label="Close template picker"
                >
                  <PanelRightClose size={18} />
                </button>
              ) : null}
            </div>
          </div>

          <div style={styles.searchWrap}>
            <Search size={16} color="#64748b" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search templates by title, category, keyword, or tag..."
              style={styles.searchInput}
            />
            {searchValue ? (
              <button
                type="button"
                onClick={() => setSearchValue("")}
                aria-label="Clear template search"
                style={{
                  ...styles.iconButton,
                  width: 30,
                  height: 30,
                  minWidth: 30,
                  borderRadius: 10,
                }}
              >
                <X size={14} />
              </button>
            ) : null}
          </div>

          <div style={styles.utilityBar}>
            <div style={styles.utilityLeft}>
              <span style={styles.utilityChip}>
                <Sparkles size={13} />
                {filteredTemplates.length} shown
              </span>

              {selectedCategory ? (
                <span style={styles.utilityChip}>
                  <Tag size={13} />
                  {selectedCategory.label}
                </span>
              ) : null}
            </div>
          </div>
        </header>

        <div style={styles.body}>
          <TemplateCategoryTabs
            items={resolvedCategories}
            activeTabId={activeCategoryId}
            onChange={setActiveCategoryId}
            compact
            fullWidth={false}
            showLeadingSummary={false}
            showCounts
          />

          <TemplateList
            templates={filteredTemplates.map((template) => ({
              ...template,
              isSelected:
                template.id === (pendingSelectedTemplateId ?? selectedTemplateId),
            }))}
            viewMode={viewMode}
            compact
            showHeader
            showViewToggle
            title="Available Templates"
            subtitle="Scan categories, preview the message shape, and pick the strongest template for the current conversation."
            emptyTitle={emptyStateTitle ?? "No templates match this view"}
            emptyDescription={
              emptyStateDescription ??
              "Nothing lines up with the current search or category selection in the template drawer."
            }
            emptyHint={
              emptyStateHint ??
              "Try another keyword, switch tabs, or clear the search to reveal more templates."
            }
            emptyVariant={searchValue ? "search" : "filter"}
            searchQuery={searchValue}
            selectedCategoryLabel={selectedCategory?.label}
            selectedFilterLabel={searchValue ? "Keyword search" : undefined}
            onViewModeChange={setViewMode}
            onTemplateClick={(templateId) => {
              setPendingSelectedTemplateId(templateId);
            }}
            onTemplatePreview={onPreviewTemplate}
            onTemplateUse={(templateId) => {
              setPendingSelectedTemplateId(templateId);
              onApplyTemplate?.(templateId);
            }}
            onTemplateEdit={onEditTemplate}
            onTemplateDuplicate={onDuplicateTemplate}
            onTemplateDelete={onDeleteTemplate}
            onTemplateFavoriteToggle={onFavoriteToggle}
            onEmptyPrimaryAction={() => setSearchValue("")}
            onEmptySecondaryAction={() => setActiveCategoryId("all")}
          />
        </div>

        <footer style={styles.footer}>
          <div style={styles.footerMeta}>
            <span style={styles.footerHint}>
              {selectedTemplate
                ? `Selected: ${selectedTemplate.title}`
                : "Select a template to continue."}
            </span>
          </div>

          <div style={styles.footerActions}>
            <button type="button" onClick={onClose} style={styles.secondaryButton}>
              <X size={14} />
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                if (selectedTemplate) {
                  onApplyTemplate?.(selectedTemplate.id);
                }
              }}
              style={{
                ...styles.primaryButton,
                ...(selectedTemplate ? null : styles.disabledPrimaryButton),
              }}
              disabled={!selectedTemplate}
            >
              <Sparkles size={14} />
              Use Template
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}

const TemplatePickerDrawer = memo(TemplatePickerDrawerComponent);

export default TemplatePickerDrawer;