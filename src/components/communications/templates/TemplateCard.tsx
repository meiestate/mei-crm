import { memo } from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from "react";
import {
  CheckCircle2,
  Clock3,
  Copy,
  Eye,
  FileText,
  MessageSquareQuote,
  PenSquare,
  Sparkles,
  Star,
  Tag,
  Trash2,
} from "lucide-react";

export type TemplateCardTone = "default" | "primary" | "success" | "warning";

export interface TemplateCardStat {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

export interface TemplateCardProps {
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
  compact?: boolean;
  usageCount?: number;
  lastUsedLabel?: string;
  approvalLabel?: string;
  stats?: TemplateCardStat[];
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  tertiaryActionLabel?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: (id: string) => void;
  onPreview?: (id: string) => void;
  onUse?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onFavoriteToggle?: (id: string) => void;
}

const toneStyles: Record<
  TemplateCardTone,
  {
    accent: string;
    softBg: string;
    softBorder: string;
    softText: string;
    primaryBg: string;
    primaryBorder: string;
    primaryText: string;
  }
> = {
  default: {
    accent: "#2563eb",
    softBg: "#eff6ff",
    softBorder: "#bfdbfe",
    softText: "#1d4ed8",
    primaryBg: "#2563eb",
    primaryBorder: "#2563eb",
    primaryText: "#ffffff",
  },
  primary: {
    accent: "#4f46e5",
    softBg: "#eef2ff",
    softBorder: "#c7d2fe",
    softText: "#4338ca",
    primaryBg: "#4f46e5",
    primaryBorder: "#4f46e5",
    primaryText: "#ffffff",
  },
  success: {
    accent: "#059669",
    softBg: "#ecfdf5",
    softBorder: "#a7f3d0",
    softText: "#047857",
    primaryBg: "#059669",
    primaryBorder: "#059669",
    primaryText: "#ffffff",
  },
  warning: {
    accent: "#d97706",
    softBg: "#fffbeb",
    softBorder: "#fde68a",
    softText: "#b45309",
    primaryBg: "#d97706",
    primaryBorder: "#d97706",
    primaryText: "#ffffff",
  },
};

const styles: Record<string, CSSProperties> = {
  card: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 18,
    borderRadius: 22,
    border: "1px solid #e2e8f0",
    background:
      "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
    boxShadow: "0 14px 32px rgba(15, 23, 42, 0.06)",
    transition:
      "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease",
    cursor: "pointer",
    overflow: "hidden",
    minHeight: 288,
    outline: "none",
  },
  compactCard: {
    minHeight: 244,
    padding: 16,
    gap: 14,
    borderRadius: 18,
  },
  selectedCard: {
    borderColor: "rgba(37, 99, 235, 0.32)",
    boxShadow: "0 16px 36px rgba(37, 99, 235, 0.14)",
    background:
      "linear-gradient(180deg, rgba(239,246,255,1) 0%, rgba(255,255,255,1) 100%)",
  },
  disabledCard: {
    opacity: 0.58,
    cursor: "not-allowed",
    filter: "grayscale(0.08)",
  },
  topAccent: {
    position: "absolute",
    inset: "0 auto auto 0",
    width: "100%",
    height: 6,
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headerLeft: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    minWidth: 0,
    flex: 1,
  },
  iconShell: {
    width: 48,
    height: 48,
    minWidth: 48,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    border: "1px solid #bfdbfe",
    background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
  },
  compactIconShell: {
    width: 42,
    height: 42,
    minWidth: 42,
    borderRadius: 14,
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
    fontSize: 16,
    lineHeight: 1.25,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "#0f172a",
  },
  compactTitle: {
    fontSize: 15,
  },
  description: {
    margin: "6px 0 0 0",
    fontSize: 13,
    lineHeight: 1.65,
    color: "#475569",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  compactDescription: {
    fontSize: 12.5,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    minHeight: 26,
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 11.5,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  actionIconButton: {
    width: 38,
    height: 38,
    minWidth: 38,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    display: "grid",
    placeItems: "center",
    color: "#64748b",
    cursor: "pointer",
    transition: "all 160ms ease",
  },
  favoriteActive: {
    background: "#fffbeb",
    border: "1px solid #fde68a",
    color: "#ca8a04",
  },
  previewBox: {
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    background:
      "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 100%)",
    padding: "14px 14px 12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  previewLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11.5,
    fontWeight: 800,
    letterSpacing: "0.02em",
    color: "#64748b",
    textTransform: "uppercase",
  },
  previewText: {
    margin: 0,
    fontSize: 12.5,
    lineHeight: 1.7,
    color: "#334155",
    whiteSpace: "pre-wrap",
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  statGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  statChip: {
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
  tagsWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  tag: {
    minHeight: 24,
    padding: "3px 9px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11.5,
    fontWeight: 700,
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
  },
  footer: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  footerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  footerRight: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  secondaryButton: {
    height: 38,
    padding: "0 12px",
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
    height: 38,
    padding: "0 14px",
    borderRadius: 12,
    fontSize: 12.5,
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(15, 23, 42, 0.10)",
  },
};

function stopEvent(event: MouseEvent<HTMLElement>) {
  event.stopPropagation();
}

function TemplateCardComponent({
  id,
  title,
  description,
  preview,
  category,
  tags = [],
  tone = "default",
  isFavorite = false,
  isFeatured = false,
  isSelected = false,
  isDisabled = false,
  compact = false,
  usageCount,
  lastUsedLabel,
  approvalLabel,
  stats = [],
  primaryActionLabel = "Use Template",
  secondaryActionLabel = "Preview",
  tertiaryActionLabel = "Edit",
  icon,
  className,
  onClick,
  onPreview,
  onUse,
  onEdit,
  onDuplicate,
  onDelete,
  onFavoriteToggle,
}: TemplateCardProps) {
  const palette = toneStyles[tone];

  const handleCardClick = () => {
    if (isDisabled) return;
    onClick?.(id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (isDisabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(id);
    }
  };

  const handleUse = (event: MouseEvent<HTMLButtonElement>) => {
    stopEvent(event);
    if (isDisabled) return;
    onUse?.(id);
  };

  const handlePreview = (event: MouseEvent<HTMLButtonElement>) => {
    stopEvent(event);
    if (isDisabled) return;
    onPreview?.(id);
  };

  const handleEdit = (event: MouseEvent<HTMLButtonElement>) => {
    stopEvent(event);
    if (isDisabled) return;
    onEdit?.(id);
  };

  const handleDuplicate = (event: MouseEvent<HTMLButtonElement>) => {
    stopEvent(event);
    if (isDisabled) return;
    onDuplicate?.(id);
  };

  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    stopEvent(event);
    if (isDisabled) return;
    onDelete?.(id);
  };

  const handleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    stopEvent(event);
    if (isDisabled) return;
    onFavoriteToggle?.(id);
  };

  return (
    <article
      className={className}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
      aria-pressed={isSelected}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      style={{
        ...styles.card,
        ...(compact ? styles.compactCard : null),
        ...(isSelected ? styles.selectedCard : null),
        ...(isDisabled ? styles.disabledCard : null),
      }}
    >
      <div
        style={{
          ...styles.topAccent,
          background: `linear-gradient(90deg, ${palette.accent}, rgba(6,182,212,0.95), rgba(139,92,246,0.95))`,
        }}
      />

      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div
            style={{
              ...styles.iconShell,
              ...(compact ? styles.compactIconShell : null),
              color: palette.accent,
              borderColor: palette.softBorder,
              background: `linear-gradient(135deg, ${palette.softBg} 0%, #ffffff 100%)`,
            }}
          >
            {icon ?? <MessageSquareQuote size={compact ? 18 : 20} />}
          </div>

          <div style={styles.titleWrap}>
            <div style={styles.titleRow}>
              <h3
                style={{
                  ...styles.title,
                  ...(compact ? styles.compactTitle : null),
                }}
              >
                {title}
              </h3>

              {category ? (
                <span
                  style={{
                    ...styles.badge,
                    color: palette.softText,
                    background: palette.softBg,
                    border: `1px solid ${palette.softBorder}`,
                  }}
                >
                  <FileText size={12} />
                  {category}
                </span>
              ) : null}

              {isFeatured ? (
                <span
                  style={{
                    ...styles.badge,
                    color: "#7c3aed",
                    background: "#f5f3ff",
                    border: "1px solid #ddd6fe",
                  }}
                >
                  <Sparkles size={12} />
                  Featured
                </span>
              ) : null}

              {approvalLabel ? (
                <span
                  style={{
                    ...styles.badge,
                    color: "#047857",
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                  }}
                >
                  <CheckCircle2 size={12} />
                  {approvalLabel}
                </span>
              ) : null}
            </div>

            <p
              style={{
                ...styles.description,
                ...(compact ? styles.compactDescription : null),
              }}
            >
              {description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          style={{
            ...styles.actionIconButton,
            ...(isFavorite ? styles.favoriteActive : null),
          }}
          disabled={isDisabled}
        >
          <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div style={styles.previewBox}>
        <div style={styles.previewLabel}>
          <Eye size={12} />
          Template Preview
        </div>
        <p style={styles.previewText}>
          {preview?.trim()
            ? preview
            : "A polished communication template preview will appear here, giving the user a fast look at message tone, structure, and content flow before use."}
        </p>
      </div>

      <div style={styles.metaRow}>
        <div style={styles.statGroup}>
          {typeof usageCount === "number" ? (
            <span style={styles.statChip}>
              <Sparkles size={13} />
              {usageCount} uses
            </span>
          ) : null}

          {lastUsedLabel ? (
            <span style={styles.statChip}>
              <Clock3 size={13} />
              {lastUsedLabel}
            </span>
          ) : null}

          {stats.map((stat, index) => (
            <span key={`${stat.label}-${index}`} style={styles.statChip}>
              {stat.icon ?? <FileText size={13} />}
              {stat.value} {stat.label}
            </span>
          ))}
        </div>

        {tags.length > 0 ? (
          <div style={styles.tagsWrap}>
            {tags.slice(0, compact ? 2 : 3).map((tag) => (
              <span key={tag} style={styles.tag}>
                <Tag size={11} />
                {tag}
              </span>
            ))}
            {tags.length > (compact ? 2 : 3) ? (
              <span style={styles.statChip}>
                +{tags.length - (compact ? 2 : 3)} more
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <button
            type="button"
            onClick={handlePreview}
            style={styles.secondaryButton}
            disabled={isDisabled}
          >
            <Eye size={14} />
            {secondaryActionLabel}
          </button>

          <button
            type="button"
            onClick={handleEdit}
            style={styles.secondaryButton}
            disabled={isDisabled}
          >
            <PenSquare size={14} />
            {tertiaryActionLabel}
          </button>
        </div>

        <div style={styles.footerRight}>
          <button
            type="button"
            onClick={handleDuplicate}
            style={styles.secondaryButton}
            disabled={isDisabled}
          >
            <Copy size={14} />
            Duplicate
          </button>

          <button
            type="button"
            onClick={handleDelete}
            style={styles.secondaryButton}
            disabled={isDisabled}
          >
            <Trash2 size={14} />
            Delete
          </button>

          <button
            type="button"
            onClick={handleUse}
            style={{
              ...styles.primaryButton,
              background: palette.primaryBg,
              border: `1px solid ${palette.primaryBorder}`,
              color: palette.primaryText,
            }}
            disabled={isDisabled}
          >
            <Sparkles size={14} />
            {primaryActionLabel}
          </button>
        </div>
      </div>
    </article>
  );
}

const TemplateCard = memo(TemplateCardComponent);

export default TemplateCard;