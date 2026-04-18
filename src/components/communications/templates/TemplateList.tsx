import { memo } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Grid3X3,
  List,
  MessageSquareQuote,
  Sparkles,
} from "lucide-react";
import TemplateCard, {
  type TemplateCardStat,
  type TemplateCardTone,
} from "./TemplateCard";
import NoResultsState from "../states/NoResultsState";

export type TemplateListViewMode = "grid" | "list";

export interface TemplateListItem {
  id: string;
  title: string;
  description: string;
  preview?: string;
  category?: string;
  tags?: string[];
  tone?: TemplateCardTone;
  isFavorite?: boolean;
  isFeatured?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  usageCount?: number;
  lastUsedLabel?: string;
  approvalLabel?: string;
  stats?: TemplateCardStat[];
  icon?: ReactNode;
}

export interface TemplateListProps {
  templates: TemplateListItem[];
  className?: string;
  compact?: boolean;
  loading?: boolean;
  viewMode?: TemplateListViewMode;
  showHeader?: boolean;
  showViewToggle?: boolean;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyHint?: string;
  emptyVariant?: "search" | "filter" | "empty-folder" | "archive" | "starred" | "generic";
  searchQuery?: string;
  selectedCategoryLabel?: string;
  selectedFilterLabel?: string;
  onTemplateClick?: (id: string) => void;
  onTemplatePreview?: (id: string) => void;
  onTemplateUse?: (id: string) => void;
  onTemplateEdit?: (id: string) => void;
  onTemplateDuplicate?: (id: string) => void;
  onTemplateDelete?: (id: string) => void;
  onTemplateFavoriteToggle?: (id: string) => void;
  onViewModeChange?: (mode: TemplateListViewMode) => void;
  onEmptyPrimaryAction?: () => void;
  onEmptySecondaryAction?: () => void;
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  compactWrapper: {
    gap: 12,
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  },
  headerLeft: {
    minWidth: 0,
    flex: 1,
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  titleIconShell: {
    width: 40,
    height: 40,
    minWidth: 40,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
  },
  compactTitleIconShell: {
    width: 36,
    height: 36,
    minWidth: 36,
    borderRadius: 12,
  },
  title: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.2,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "#0f172a",
  },
  compactTitle: {
    fontSize: 16,
  },
  subtitle: {
    margin: "6px 0 0 0",
    fontSize: 13.5,
    lineHeight: 1.7,
    color: "#64748b",
    maxWidth: 740,
  },
  compactSubtitle: {
    fontSize: 12.5,
    lineHeight: 1.6,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  summaryBadge: {
    minHeight: 34,
    padding: "7px 12px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    fontWeight: 800,
    color: "#7c3aed",
    border: "1px solid #ddd6fe",
    background: "#f5f3ff",
    whiteSpace: "nowrap",
  },
  viewToggleWrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: 4,
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.05)",
  },
  viewToggleButton: {
    minWidth: 40,
    height: 36,
    padding: "0 10px",
    borderRadius: 10,
    border: "1px solid transparent",
    background: "transparent",
    color: "#64748b",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
  },
  activeViewToggleButton: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 16,
  },
  compactGrid: {
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 12,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  compactList: {
    gap: 10,
  },
  listItemWrap: {
    width: "100%",
  },
  skeletonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 16,
  },
  compactSkeletonGrid: {
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 12,
  },
  skeletonCard: {
    minHeight: 268,
    borderRadius: 22,
    border: "1px solid #e2e8f0",
    background:
      "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    boxShadow: "0 14px 32px rgba(15, 23, 42, 0.05)",
  },
  compactSkeletonCard: {
    minHeight: 230,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  skeletonRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
};

function SkeletonLine({
  width,
  height = 12,
  radius = 999,
}: {
  width: number | string;
  height?: number;
  radius?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, rgba(241,245,249,1) 25%, rgba(226,232,240,0.85) 37%, rgba(241,245,249,1) 63%)",
        backgroundSize: "400% 100%",
        animation: "templateListShimmer 1.4s ease infinite",
      }}
    />
  );
}

function TemplateListSkeleton({
  compact = false,
  count = 6,
}: {
  compact?: boolean;
  count?: number;
}) {
  return (
    <>
      <style>
        {`
          @keyframes templateListShimmer {
            0% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
          }
        `}
      </style>

      <div
        style={{
          ...styles.skeletonGrid,
          ...(compact ? styles.compactSkeletonGrid : null),
        }}
      >
        {Array.from({ length: Math.max(1, count) }).map((_, index) => (
          <div
            key={`template-skeleton-${index}`}
            style={{
              ...styles.skeletonCard,
              ...(compact ? styles.compactSkeletonCard : null),
            }}
          >
            <div style={styles.skeletonRow}>
              <SkeletonLine width={compact ? 42 : 48} height={compact ? 42 : 48} radius={16} />
              <div style={{ flex: 1, display: "grid", gap: 8 }}>
                <SkeletonLine width="54%" height={14} />
                <SkeletonLine width="34%" height={11} />
              </div>
              <SkeletonLine width={36} height={36} radius={12} />
            </div>

            <SkeletonLine width="100%" height={10} />
            <SkeletonLine width="82%" height={10} />

            <div
              style={{
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                padding: 14,
                display: "grid",
                gap: 8,
              }}
            >
              <SkeletonLine width="28%" height={10} />
              <SkeletonLine width="100%" height={10} />
              <SkeletonLine width="92%" height={10} />
              <SkeletonLine width="68%" height={10} />
            </div>

            <div style={styles.skeletonRow}>
              <SkeletonLine width={80} height={26} />
              <SkeletonLine width={92} height={26} />
              <SkeletonLine width={70} height={26} />
            </div>

            <div style={{ marginTop: "auto", ...styles.skeletonRow }}>
              <SkeletonLine width={92} height={36} radius={12} />
              <SkeletonLine width={86} height={36} radius={12} />
              <SkeletonLine width={104} height={36} radius={12} />
              <div style={{ flex: 1 }} />
              <SkeletonLine width={118} height={36} radius={12} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function TemplateListComponent({
  templates,
  className,
  compact = false,
  loading = false,
  viewMode = "grid",
  showHeader = true,
  showViewToggle = true,
  title = "Template Library",
  subtitle = "Browse reusable communication templates, pick a winning format fast, and launch polished replies with less manual work.",
  emptyTitle,
  emptyDescription,
  emptyHint,
  emptyVariant = "generic",
  searchQuery,
  selectedCategoryLabel,
  selectedFilterLabel,
  onTemplateClick,
  onTemplatePreview,
  onTemplateUse,
  onTemplateEdit,
  onTemplateDuplicate,
  onTemplateDelete,
  onTemplateFavoriteToggle,
  onViewModeChange,
  onEmptyPrimaryAction,
  onEmptySecondaryAction,
}: TemplateListProps) {
  const templateCountLabel = `${templates.length} template${templates.length === 1 ? "" : "s"}`;

  return (
    <section
      className={className}
      style={{
        ...styles.wrapper,
        ...(compact ? styles.compactWrapper : null),
      }}
    >
      {showHeader ? (
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.titleRow}>
              <div
                style={{
                  ...styles.titleIconShell,
                  ...(compact ? styles.compactTitleIconShell : null),
                }}
              >
                <MessageSquareQuote size={compact ? 18 : 20} />
              </div>

              <div>
                <h2
                  style={{
                    ...styles.title,
                    ...(compact ? styles.compactTitle : null),
                  }}
                >
                  {title}
                </h2>
                <p
                  style={{
                    ...styles.subtitle,
                    ...(compact ? styles.compactSubtitle : null),
                  }}
                >
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          <div style={styles.headerRight}>
            <span style={styles.summaryBadge}>
              <Sparkles size={14} />
              {templateCountLabel}
            </span>

            {showViewToggle ? (
              <div style={styles.viewToggleWrap} aria-label="Template view mode">
                <button
                  type="button"
                  onClick={() => onViewModeChange?.("grid")}
                  style={{
                    ...styles.viewToggleButton,
                    ...(viewMode === "grid" ? styles.activeViewToggleButton : null),
                  }}
                  aria-pressed={viewMode === "grid"}
                >
                  <Grid3X3 size={15} />
                  {!compact ? "Grid" : null}
                </button>

                <button
                  type="button"
                  onClick={() => onViewModeChange?.("list")}
                  style={{
                    ...styles.viewToggleButton,
                    ...(viewMode === "list" ? styles.activeViewToggleButton : null),
                  }}
                  aria-pressed={viewMode === "list"}
                >
                  <List size={15} />
                  {!compact ? "List" : null}
                </button>
              </div>
            ) : null}
          </div>
        </header>
      ) : null}

      {loading ? (
        <TemplateListSkeleton compact={compact} count={viewMode === "grid" ? 6 : 5} />
      ) : templates.length === 0 ? (
        <NoResultsState
          title={emptyTitle ?? "No templates found"}
          description={
            emptyDescription ??
            "There are no communication templates available for the current search, category, or filter state."
          }
          hint={
            emptyHint ??
            "Try switching category tabs, clearing search terms, or refreshing the template library to pull new results."
          }
          variant={emptyVariant}
          searchQuery={searchQuery}
          selectedFolderLabel={selectedCategoryLabel}
          selectedFilterLabel={selectedFilterLabel}
          onPrimaryAction={onEmptyPrimaryAction}
          onSecondaryAction={onEmptySecondaryAction}
          primaryActionLabel="Refresh Templates"
          secondaryActionLabel="Clear Filters"
        />
      ) : viewMode === "list" ? (
        <div
          style={{
            ...styles.list,
            ...(compact ? styles.compactList : null),
          }}
        >
          {templates.map((template) => (
            <div key={template.id} style={styles.listItemWrap}>
              <TemplateCard
                id={template.id}
                title={template.title}
                description={template.description}
                preview={template.preview}
                category={template.category}
                tags={template.tags}
                tone={template.tone}
                isFavorite={template.isFavorite}
                isFeatured={template.isFeatured}
                isSelected={template.isSelected}
                isDisabled={template.isDisabled}
                compact={compact}
                usageCount={template.usageCount}
                lastUsedLabel={template.lastUsedLabel}
                approvalLabel={template.approvalLabel}
                stats={template.stats}
                icon={template.icon}
                onClick={onTemplateClick}
                onPreview={onTemplatePreview}
                onUse={onTemplateUse}
                onEdit={onTemplateEdit}
                onDuplicate={onTemplateDuplicate}
                onDelete={onTemplateDelete}
                onFavoriteToggle={onTemplateFavoriteToggle}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            ...styles.grid,
            ...(compact ? styles.compactGrid : null),
          }}
        >
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              id={template.id}
              title={template.title}
              description={template.description}
              preview={template.preview}
              category={template.category}
              tags={template.tags}
              tone={template.tone}
              isFavorite={template.isFavorite}
              isFeatured={template.isFeatured}
              isSelected={template.isSelected}
              isDisabled={template.isDisabled}
              compact={compact}
              usageCount={template.usageCount}
              lastUsedLabel={template.lastUsedLabel}
              approvalLabel={template.approvalLabel}
              stats={template.stats}
              icon={template.icon}
              onClick={onTemplateClick}
              onPreview={onTemplatePreview}
              onUse={onTemplateUse}
              onEdit={onTemplateEdit}
              onDuplicate={onTemplateDuplicate}
              onDelete={onTemplateDelete}
              onFavoriteToggle={onTemplateFavoriteToggle}
            />
          ))}
        </div>
      )}
    </section>
  );
}

const TemplateList = memo(TemplateListComponent);

export default TemplateList;