import { memo } from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from "react";
import {
  ArrowUpRight,
  Clock3,
  Copy,
  FileText,
  MessageSquareQuote,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";

export interface TemplateShortcutCardStats {
  uses?: number;
  lastUsedLabel?: string;
  categoryLabel?: string;
}

export interface TemplateShortcutCardProps {
  id: string;
  title: string;
  description: string;
  preview?: string;
  category?: string;
  tags?: string[];
  stats?: TemplateShortcutCardStats;
  isFeatured?: boolean;
  isFavorite?: boolean;
  isSelected?: boolean;
  disabled?: boolean;
  compact?: boolean;
  accentColor?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  leadingIcon?: ReactNode;
  className?: string;
  onClick?: (id: string) => void;
  onUse?: (id: string) => void;
  onPreview?: (id: string) => void;
  onFavoriteToggle?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

const styles: Record<string, CSSProperties> = {
  card: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    padding: 18,
    borderRadius: 20,
    border: "1px solid #e2e8f0",
    background:
      "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    transition:
      "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease",
    cursor: "pointer",
    minHeight: 240,
    overflow: "hidden",
    outline: "none",
  },
  compactCard: {
    minHeight: 204,
    padding: 16,
    gap: 12,
    borderRadius: 18,
  },
  selectedCard: {
    borderColor: "rgba(37, 99, 235, 0.32)",
    boxShadow: "0 14px 36px rgba(37, 99, 235, 0.14)",
    background:
      "linear-gradient(180deg, rgba(239,246,255,1) 0%, rgba(255,255,255,1) 100%)",
  },
  disabledCard: {
    opacity: 0.58,
    cursor: "not-allowed",
    filter: "grayscale(0.08)",
  },
  topGlow: {
    position: "absolute",
    inset: "0 auto auto 0",
    width: "100%",
    height: 6,
    background: "linear-gradient(90deg, #2563eb, #06b6d4, #8b5cf6)",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  leftHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    minWidth: 0,
    flex: 1,
  },
  iconWrap: {
    width: 46,
    height: 46,
    minWidth: 46,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.14), rgba(99,102,241,0.12))",
    color: "#2563eb",
    border: "1px solid rgba(37,99,235,0.14)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
  },
  compactIconWrap: {
    width: 42,
    height: 42,
    minWidth: 42,
    borderRadius: 13,
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
    lineHeight: 1.55,
    color: "#475569",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  compactDescription: {
    fontSize: 12.5,
    WebkitLineClamp: 2,
  },
  badgeRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 8,
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
    color: "#334155",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  featuredBadge: {
    color: "#7c3aed",
    background: "#f5f3ff",
    border: "1px solid #ddd6fe",
  },
  categoryBadge: {
    color: "#0f766e",
    background: "#f0fdfa",
    border: "1px solid #99f6e4",
  },
  favoriteButton: {
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
    color: "#ca8a04",
    background: "#fffbeb",
    border: "1px solid #fde68a",
  },
  previewBox: {
    position: "relative",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    background:
      "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 100%)",
    padding: "14px 14px 12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minHeight: 86,
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
    lineHeight: 1.65,
    color: "#334155",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    whiteSpace: "pre-wrap",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  statsRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  statItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#64748b",
    fontWeight: 600,
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    minHeight: 24,
    padding: "3px 9px",
    borderRadius: 999,
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: 11.5,
    fontWeight: 700,
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
  actionsWrap: {
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
    boxShadow: "0 10px 20px rgba(37, 99, 235, 0.18)",
  },
  subtleInfo: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 600,
  },
};

function stopPropagation(event: MouseEvent<HTMLElement>) {
  event.stopPropagation();
}

function TemplateShortcutCardComponent({
  id,
  title,
  description,
  preview,
  category,
  tags = [],
  stats,
  isFeatured = false,
  isFavorite = false,
  isSelected = false,
  disabled = false,
  compact = false,
  accentColor = "#2563eb",
  primaryActionLabel = "Use Template",
  secondaryActionLabel = "Preview",
  leadingIcon,
  className,
  onClick,
  onUse,
  onPreview,
  onFavoriteToggle,
  onDuplicate,
}: TemplateShortcutCardProps) {
  const handleCardClick = () => {
    if (disabled) return;
    onClick?.(id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(id);
    }
  };

  const handleUse = (event: MouseEvent<HTMLButtonElement>) => {
    stopPropagation(event);
    if (disabled) return;
    onUse?.(id);
  };

  const handlePreview = (event: MouseEvent<HTMLButtonElement>) => {
    stopPropagation(event);
    if (disabled) return;
    onPreview?.(id);
  };

  const handleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    stopPropagation(event);
    if (disabled) return;
    onFavoriteToggle?.(id);
  };

  const handleDuplicate = (event: MouseEvent<HTMLButtonElement>) => {
    stopPropagation(event);
    if (disabled) return;
    onDuplicate?.(id);
  };

  return (
    <article
      className={className}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      aria-disabled={disabled}
      aria-pressed={isSelected}
      tabIndex={disabled ? -1 : 0}
      style={{
        ...styles.card,
        ...(compact ? styles.compactCard : null),
        ...(isSelected ? styles.selectedCard : null),
        ...(disabled ? styles.disabledCard : null),
      }}
    >
      <div
        style={{
          ...styles.topGlow,
          background: `linear-gradient(90deg, ${accentColor}, rgba(6,182,212,0.95), rgba(139,92,246,0.95))`,
        }}
      />

      <div style={styles.header}>
        <div style={styles.leftHeader}>
          <div
            style={{
              ...styles.iconWrap,
              ...(compact ? styles.compactIconWrap : null),
              color: accentColor,
              borderColor: `${accentColor}22`,
              background: `linear-gradient(135deg, ${accentColor}20, rgba(99,102,241,0.10))`,
            }}
          >
            {leadingIcon ?? <MessageSquareQuote size={compact ? 18 : 20} />}
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

              {isFeatured ? (
                <span style={{ ...styles.badge, ...styles.featuredBadge }}>
                  <Sparkles size={12} />
                  Featured
                </span>
              ) : null}

              {category ? (
                <span style={{ ...styles.badge, ...styles.categoryBadge }}>
                  <FileText size={12} />
                  {category}
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

            {tags.length > 0 ? (
              <div style={styles.badgeRow}>
                {tags.slice(0, compact ? 2 : 3).map((tag) => (
                  <span key={tag} style={styles.tag}>
                    <Tag size={11} />
                    {tag}
                  </span>
                ))}
                {tags.length > (compact ? 2 : 3) ? (
                  <span style={styles.badge}>
                    +{tags.length - (compact ? 2 : 3)} more
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={handleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          style={{
            ...styles.favoriteButton,
            ...(isFavorite ? styles.favoriteActive : null),
          }}
          disabled={disabled}
        >
          <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div style={styles.previewBox}>
        <div style={styles.previewLabel}>
          <FileText size={12} />
          Template Preview
        </div>
        <p style={styles.previewText}>
          {preview?.trim()
            ? preview
            : "This shortcut opens a ready-to-send template flow with reusable communication blocks, polished structure, and faster response handling."}
        </p>
      </div>

      <div style={styles.metaRow}>
        <div style={styles.statsRow}>
          {typeof stats?.uses === "number" ? (
            <span style={styles.statItem}>
              <ArrowUpRight size={13} />
              {stats.uses} uses
            </span>
          ) : null}

          {stats?.lastUsedLabel ? (
            <span style={styles.statItem}>
              <Clock3 size={13} />
              {stats.lastUsedLabel}
            </span>
          ) : null}

          {stats?.categoryLabel ? (
            <span style={styles.statItem}>
              <FileText size={13} />
              {stats.categoryLabel}
            </span>
          ) : null}
        </div>

        <span style={styles.subtleInfo}>Shortcut ID: {id}</span>
      </div>

      <div style={styles.footer}>
        <div style={styles.actionsWrap}>
          <button
            type="button"
            onClick={handlePreview}
            style={styles.secondaryButton}
            disabled={disabled}
          >
            <FileText size={14} />
            {secondaryActionLabel}
          </button>

          <button
            type="button"
            onClick={handleDuplicate}
            style={styles.secondaryButton}
            disabled={disabled}
          >
            <Copy size={14} />
            Duplicate
          </button>
        </div>

        <button
          type="button"
          onClick={handleUse}
          style={styles.primaryButton}
          disabled={disabled}
        >
          <Sparkles size={14} />
          {primaryActionLabel}
        </button>
      </div>
    </article>
  );
}

const TemplateShortcutCard = memo(TemplateShortcutCardComponent);

export default TemplateShortcutCard;