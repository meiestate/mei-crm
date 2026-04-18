import { memo, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  CalendarClock,
  Copy,
  Eye,
  FileText,
  MessageSquareQuote,
  PencilLine,
  Send,
  Sparkles,
  Star,
  Tag,
  Trash2,
} from "lucide-react";

export type TemplatePreviewTone =
  | "professional"
  | "friendly"
  | "formal"
  | "warm"
  | "sales"
  | "support"
  | "neutral";

export interface TemplatePreviewStat {
  id: string;
  label: string;
  value: string;
  icon?: ReactNode;
}

export interface TemplatePreviewPanelProps {
  id: string;
  title: string;
  description: string;
  subject?: string;
  preview?: string;
  body?: string;
  category?: string;
  tags?: string[];
  tone?: TemplatePreviewTone;
  isFavorite?: boolean;
  isFeatured?: boolean;
  isApproved?: boolean;
  isDisabled?: boolean;
  usageCount?: number;
  lastUsedLabel?: string;
  createdByLabel?: string;
  approvalLabel?: string;
  stats?: TemplatePreviewStat[];
  icon?: ReactNode;
  className?: string;
  compact?: boolean;
  showHeaderActions?: boolean;
  showFooterActions?: boolean;
  showMetadata?: boolean;
  showStats?: boolean;
  showBodyCard?: boolean;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  tertiaryActionLabel?: string;
  emptyBodyLabel?: string;
  onUse?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onFavoriteToggle?: (id: string) => void;
}

const toneConfig: Record<
  TemplatePreviewTone,
  {
    label: string;
    color: string;
    background: string;
    border: string;
  }
> = {
  professional: {
    label: "Professional",
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#bfdbfe",
  },
  friendly: {
    label: "Friendly",
    color: "#0f766e",
    background: "#ecfeff",
    border: "#99f6e4",
  },
  formal: {
    label: "Formal",
    color: "#4338ca",
    background: "#eef2ff",
    border: "#c7d2fe",
  },
  warm: {
    label: "Warm",
    color: "#c2410c",
    background: "#fff7ed",
    border: "#fdba74",
  },
  sales: {
    label: "Sales",
    color: "#9a3412",
    background: "#fff7ed",
    border: "#fdba74",
  },
  support: {
    label: "Support",
    color: "#166534",
    background: "#f0fdf4",
    border: "#86efac",
  },
  neutral: {
    label: "Neutral",
    color: "#334155",
    background: "#f8fafc",
    border: "#cbd5e1",
  },
};

const styles: Record<string, CSSProperties> = {
  root: {
    width: "100%",
    borderRadius: "24px",
    border: "1px solid #e2e8f0",
    background:
      "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
    boxShadow: "0 18px 44px rgba(15, 23, 42, 0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  compactRoot: {
    borderRadius: "20px",
  },
  topStrip: {
    height: "4px",
    background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #14b8a6 100%)",
  },
  header: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    borderBottom: "1px solid #e2e8f0",
  },
  compactHeader: {
    padding: "16px",
    gap: "14px",
  },
  headerTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "14px",
    flexWrap: "wrap",
  },
  identityWrap: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    minWidth: 0,
    flex: 1,
  },
  iconShell: {
    width: "54px",
    height: "54px",
    minWidth: "54px",
    borderRadius: "18px",
    display: "grid",
    placeItems: "center",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
  },
  compactIconShell: {
    width: "46px",
    height: "46px",
    minWidth: "46px",
    borderRadius: "15px",
  },
  identityContent: {
    minWidth: 0,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  chipRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "22px",
    lineHeight: 1.2,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "#0f172a",
    wordBreak: "break-word",
  },
  compactTitle: {
    fontSize: "18px",
  },
  description: {
    margin: 0,
    fontSize: "13.5px",
    lineHeight: 1.8,
    color: "#64748b",
    maxWidth: "840px",
  },
  compactDescription: {
    fontSize: "12.75px",
    lineHeight: 1.7,
  },
  chip: {
    minHeight: "28px",
    padding: "5px 10px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11.5px",
    fontWeight: 800,
    border: "1px solid #e2e8f0",
    color: "#334155",
    background: "#f8fafc",
  },
  actionGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  ghostButton: {
    height: "38px",
    padding: "0 13px",
    borderRadius: "12px",
    border: "1px solid #dbe2ea",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "12.5px",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
  },
  favoriteButtonActive: {
    color: "#b45309",
    background: "#fffbeb",
    border: "1px solid #fcd34d",
  },
  content: {
    padding: "20px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
    gap: "18px",
  },
  compactContent: {
    padding: "16px",
    gridTemplateColumns: "1fr",
    gap: "14px",
  },
  leftColumn: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  rightColumn: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    padding: "16px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
  },
  compactCard: {
    borderRadius: "16px",
    padding: "14px",
  },
  cardTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  cardTitle: {
    margin: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 800,
    letterSpacing: "-0.01em",
    color: "#0f172a",
  },
  previewBox: {
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    overflow: "hidden",
  },
  subjectRow: {
    padding: "12px 14px",
    borderBottom: "1px solid #e2e8f0",
    display: "grid",
    gap: "4px",
  },
  subjectLabel: {
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#64748b",
  },
  subjectValue: {
    fontSize: "13px",
    lineHeight: 1.65,
    color: "#0f172a",
    fontWeight: 700,
    wordBreak: "break-word",
  },
  bodyWrap: {
    padding: "14px",
  },
  bodyText: {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: "13px",
    lineHeight: 1.9,
    color: "#334155",
  },
  previewHint: {
    fontSize: "12.5px",
    lineHeight: 1.7,
    color: "#64748b",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
  },
  statCard: {
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    padding: "12px",
    display: "grid",
    gap: "6px",
  },
  statLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11.5px",
    fontWeight: 700,
    color: "#64748b",
  },
  statValue: {
    fontSize: "16px",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.02em",
  },
  metaList: {
    display: "grid",
    gap: "10px",
  },
  metaRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "10px",
    paddingBottom: "10px",
    borderBottom: "1px dashed #e2e8f0",
  },
  metaKey: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#64748b",
  },
  metaValue: {
    fontSize: "12.5px",
    fontWeight: 700,
    color: "#0f172a",
    textAlign: "right",
  },
  tagsWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  tagChip: {
    minHeight: "28px",
    padding: "5px 10px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11.5px",
    fontWeight: 700,
    color: "#475569",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  footer: {
    borderTop: "1px solid #e2e8f0",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  footerMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  footerHint: {
    fontSize: "12.5px",
    color: "#64748b",
    lineHeight: 1.6,
  },
  footerActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    height: "40px",
    padding: "0 14px",
    borderRadius: "12px",
    border: "1px solid #dbe2ea",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "12.5px",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
  },
  tertiaryButton: {
    height: "40px",
    padding: "0 14px",
    borderRadius: "12px",
    border: "1px solid #fee2e2",
    background: "#fff1f2",
    color: "#b91c1c",
    fontSize: "12.5px",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
  },
  primaryButton: {
    height: "40px",
    padding: "0 16px",
    borderRadius: "12px",
    border: "1px solid #2563eb",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "12.5px",
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(37, 99, 235, 0.18)",
  },
  disabledState: {
    opacity: 0.58,
    filter: "grayscale(0.08)",
  },
};

function TemplatePreviewPanelComponent({
  id,
  title,
  description,
  subject,
  preview,
  body,
  category,
  tags = [],
  tone = "professional",
  isFavorite = false,
  isFeatured = false,
  isApproved = false,
  isDisabled = false,
  usageCount,
  lastUsedLabel,
  createdByLabel,
  approvalLabel,
  stats = [],
  icon,
  className,
  compact = false,
  showHeaderActions = true,
  showFooterActions = true,
  showMetadata = true,
  showStats = true,
  showBodyCard = true,
  primaryActionLabel = "Use Template",
  secondaryActionLabel = "Duplicate",
  tertiaryActionLabel = "Delete",
  emptyBodyLabel = "No preview body is available for this template yet.",
  onUse,
  onEdit,
  onDuplicate,
  onDelete,
  onFavoriteToggle,
}: TemplatePreviewPanelProps) {
  const resolvedTone = toneConfig[tone] ?? toneConfig.professional;

  const computedStats = useMemo<TemplatePreviewStat[]>(() => {
    if (stats.length > 0) {
      return stats;
    }

    const builtStats: TemplatePreviewStat[] = [];

    if (typeof usageCount === "number") {
      builtStats.push({
        id: "usage",
        label: "Usage",
        value: `${usageCount}`,
        icon: <Sparkles size={13} />,
      });
    }

    if (lastUsedLabel) {
      builtStats.push({
        id: "last-used",
        label: "Last Used",
        value: lastUsedLabel,
        icon: <CalendarClock size={13} />,
      });
    }

    if (approvalLabel) {
      builtStats.push({
        id: "approval",
        label: "Approval",
        value: approvalLabel,
        icon: <BadgeCheck size={13} />,
      });
    }

    if (category) {
      builtStats.push({
        id: "category",
        label: "Category",
        value: category,
        icon: <Tag size={13} />,
      });
    }

    return builtStats.slice(0, 4);
  }, [stats, usageCount, lastUsedLabel, approvalLabel, category]);

  const resolvedBody = body || preview || emptyBodyLabel;

  return (
    <section
      className={className}
      style={{
        ...styles.root,
        ...(compact ? styles.compactRoot : null),
        ...(isDisabled ? styles.disabledState : null),
      }}
    >
      <div style={styles.topStrip} />

      <header
        style={{
          ...styles.header,
          ...(compact ? styles.compactHeader : null),
        }}
      >
        <div style={styles.headerTop}>
          <div style={styles.identityWrap}>
            <div
              style={{
                ...styles.iconShell,
                ...(compact ? styles.compactIconShell : null),
              }}
            >
              {icon ?? <MessageSquareQuote size={compact ? 18 : 22} />}
            </div>

            <div style={styles.identityContent}>
              <div style={styles.chipRow}>
                <span
                  style={{
                    ...styles.chip,
                    color: resolvedTone.color,
                    background: resolvedTone.background,
                    border: `1px solid ${resolvedTone.border}`,
                  }}
                >
                  <Sparkles size={12} />
                  {resolvedTone.label}
                </span>

                {category ? (
                  <span style={styles.chip}>
                    <Tag size={12} />
                    {category}
                  </span>
                ) : null}

                {isFeatured ? (
                  <span style={styles.chip}>
                    <Star size={12} />
                    Featured
                  </span>
                ) : null}

                {isApproved ? (
                  <span style={styles.chip}>
                    <BadgeCheck size={12} />
                    Approved
                  </span>
                ) : null}
              </div>

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
                  ...styles.description,
                  ...(compact ? styles.compactDescription : null),
                }}
              >
                {description}
              </p>
            </div>
          </div>

          {showHeaderActions ? (
            <div style={styles.actionGroup}>
              <button
                type="button"
                onClick={() => onFavoriteToggle?.(id)}
                style={{
                  ...styles.ghostButton,
                  ...(isFavorite ? styles.favoriteButtonActive : null),
                }}
                disabled={isDisabled}
              >
                <Star size={14} />
                {isFavorite ? "Saved" : "Save"}
              </button>

              <button
                type="button"
                onClick={() => onEdit?.(id)}
                style={styles.ghostButton}
                disabled={isDisabled}
              >
                <PencilLine size={14} />
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDuplicate?.(id)}
                style={styles.ghostButton}
                disabled={isDisabled}
              >
                <Copy size={14} />
                Duplicate
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <div
        style={{
          ...styles.content,
          ...(compact ? styles.compactContent : null),
        }}
      >
        <div style={styles.leftColumn}>
          {showBodyCard ? (
            <div
              style={{
                ...styles.card,
                ...(compact ? styles.compactCard : null),
              }}
            >
              <div style={styles.cardTitleRow}>
                <h3 style={styles.cardTitle}>
                  <Eye size={15} />
                  Preview
                </h3>
                <span style={styles.previewHint}>Live content snapshot</span>
              </div>

              <div style={styles.previewBox}>
                {subject ? (
                  <div style={styles.subjectRow}>
                    <span style={styles.subjectLabel}>Subject</span>
                    <span style={styles.subjectValue}>{subject}</span>
                  </div>
                ) : null}

                <div style={styles.bodyWrap}>
                  <p style={styles.bodyText}>{resolvedBody}</p>
                </div>
              </div>
            </div>
          ) : null}

          {tags.length > 0 ? (
            <div
              style={{
                ...styles.card,
                ...(compact ? styles.compactCard : null),
              }}
            >
              <div style={styles.cardTitleRow}>
                <h3 style={styles.cardTitle}>
                  <Tag size={15} />
                  Tags
                </h3>
              </div>

              <div style={styles.tagsWrap}>
                {tags.map((tag) => (
                  <span key={tag} style={styles.tagChip}>
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div style={styles.rightColumn}>
          {showStats && computedStats.length > 0 ? (
            <div
              style={{
                ...styles.card,
                ...(compact ? styles.compactCard : null),
              }}
            >
              <div style={styles.cardTitleRow}>
                <h3 style={styles.cardTitle}>
                  <Sparkles size={15} />
                  Performance Snapshot
                </h3>
              </div>

              <div style={styles.statsGrid}>
                {computedStats.map((stat) => (
                  <div key={stat.id} style={styles.statCard}>
                    <span style={styles.statLabel}>
                      {stat.icon ?? <FileText size={13} />}
                      {stat.label}
                    </span>
                    <span style={styles.statValue}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {showMetadata ? (
            <div
              style={{
                ...styles.card,
                ...(compact ? styles.compactCard : null),
              }}
            >
              <div style={styles.cardTitleRow}>
                <h3 style={styles.cardTitle}>
                  <FileText size={15} />
                  Template Details
                </h3>
              </div>

              <div style={styles.metaList}>
                {createdByLabel ? (
                  <div style={styles.metaRow}>
                    <span style={styles.metaKey}>Created By</span>
                    <span style={styles.metaValue}>{createdByLabel}</span>
                  </div>
                ) : null}

                {approvalLabel ? (
                  <div style={styles.metaRow}>
                    <span style={styles.metaKey}>Approval</span>
                    <span style={styles.metaValue}>{approvalLabel}</span>
                  </div>
                ) : null}

                {lastUsedLabel ? (
                  <div style={styles.metaRow}>
                    <span style={styles.metaKey}>Last Used</span>
                    <span style={styles.metaValue}>{lastUsedLabel}</span>
                  </div>
                ) : null}

                {typeof usageCount === "number" ? (
                  <div style={styles.metaRow}>
                    <span style={styles.metaKey}>Usage Count</span>
                    <span style={styles.metaValue}>{usageCount}</span>
                  </div>
                ) : null}

                {category ? (
                  <div style={styles.metaRow}>
                    <span style={styles.metaKey}>Category</span>
                    <span style={styles.metaValue}>{category}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {showFooterActions ? (
        <footer style={styles.footer}>
          <div style={styles.footerMeta}>
            <span style={styles.footerHint}>
              Review the message tone, subject line, and preview body before using it in a live conversation.
            </span>
          </div>

          <div style={styles.footerActions}>
            <button
              type="button"
              onClick={() => onDuplicate?.(id)}
              style={styles.secondaryButton}
              disabled={isDisabled}
            >
              <Copy size={14} />
              {secondaryActionLabel}
            </button>

            <button
              type="button"
              onClick={() => onDelete?.(id)}
              style={styles.tertiaryButton}
              disabled={isDisabled}
            >
              <Trash2 size={14} />
              {tertiaryActionLabel}
            </button>

            <button
              type="button"
              onClick={() => onUse?.(id)}
              style={styles.primaryButton}
              disabled={isDisabled}
            >
              <Send size={14} />
              {primaryActionLabel}
            </button>
          </div>
        </footer>
      ) : null}
    </section>
  );
}

const TemplatePreviewPanel = memo(TemplatePreviewPanelComponent);

export default TemplatePreviewPanel;