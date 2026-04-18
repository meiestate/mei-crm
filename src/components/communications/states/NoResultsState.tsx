import type { CSSProperties, ReactNode } from "react";
import {
  Filter,
  Inbox,
  RefreshCw,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";

export type NoResultsStateVariant =
  | "search"
  | "filter"
  | "empty-folder"
  | "archive"
  | "starred"
  | "generic";

export interface NoResultsQuickAction {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface NoResultsStateProps {
  title?: string;
  description?: string;
  hint?: string;
  variant?: NoResultsStateVariant;
  compact?: boolean;
  fullHeight?: boolean;
  className?: string;
  searchQuery?: string;
  selectedFilterLabel?: string;
  selectedFolderLabel?: string;
  showMeta?: boolean;
  showQuickActions?: boolean;
  showPrimaryAction?: boolean;
  showSecondaryAction?: boolean;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  quickActions?: NoResultsQuickAction[];
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const wrapperStyle: CSSProperties = {
  width: "100%",
  borderRadius: 24,
  border: "1px solid #e2e8f0",
  background:
    "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.98) 100%)",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

const compactWrapperStyle: CSSProperties = {
  borderRadius: 18,
};

const fullHeightStyle: CSSProperties = {
  minHeight: 360,
};

const innerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: 18,
  padding: "42px 24px",
};

const compactInnerStyle: CSSProperties = {
  gap: 14,
  padding: "28px 18px",
};

const heroShellStyle: CSSProperties = {
  position: "relative",
  width: 88,
  height: 88,
  minWidth: 88,
  borderRadius: 26,
  display: "grid",
  placeItems: "center",
  color: "#475569",
  border: "1px solid #cbd5e1",
  background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
  boxShadow:
    "0 18px 40px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.72)",
};

const compactHeroShellStyle: CSSProperties = {
  ...heroShellStyle,
  width: 72,
  height: 72,
  minWidth: 72,
  borderRadius: 22,
};

const glowDotStyle: CSSProperties = {
  position: "absolute",
  width: 10,
  height: 10,
  borderRadius: 999,
  background: "#94a3b8",
  boxShadow: "0 0 0 6px rgba(148,163,184,0.12)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.2,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  color: "#0f172a",
};

const compactTitleStyle: CSSProperties = {
  fontSize: 18,
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  maxWidth: 620,
  fontSize: 14,
  lineHeight: 1.75,
  color: "#475569",
};

const compactDescriptionStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.65,
};

const metaRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 8,
};

const chipStyle: CSSProperties = {
  minHeight: 30,
  padding: "6px 12px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  fontSize: 12,
  fontWeight: 700,
  color: "#334155",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: 12.5,
  lineHeight: 1.65,
  color: "#64748b",
  maxWidth: 580,
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 10,
};

const primaryButtonStyle: CSSProperties = {
  height: 44,
  padding: "0 16px",
  borderRadius: 12,
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#ffffff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(37, 99, 235, 0.18)",
};

const secondaryButtonStyle: CSSProperties = {
  height: 44,
  padding: "0 16px",
  borderRadius: 12,
  border: "1px solid #dbe2ea",
  background: "#ffffff",
  color: "#0f172a",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const quickActionsWrapStyle: CSSProperties = {
  width: "100%",
  maxWidth: 760,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 10,
};

const quickActionStyle: CSSProperties = {
  minHeight: 38,
  padding: "8px 12px",
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#334155",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 12.5,
  fontWeight: 700,
  cursor: "pointer",
};

function getVariantMeta(variant: NoResultsStateVariant) {
  switch (variant) {
    case "search":
      return {
        icon: <Search size={36} />,
        title: "No conversations matched your search",
        description:
          "We couldn’t find any conversations, messages, or records matching the current keyword or phrase.",
        hint:
          "Try a shorter keyword, remove extra filters, or search by name, email, phone, subject, or tag.",
      };

    case "filter":
      return {
        icon: <Filter size={36} />,
        title: "No results under the current filters",
        description:
          "The selected combination of communication filters returned an empty result set.",
        hint:
          "Reset one or two filters first, especially channel, unread, owner, or date range, then try again.",
      };

    case "empty-folder":
      return {
        icon: <Inbox size={36} />,
        title: "This folder is currently empty",
        description:
          "There are no visible communication records inside this folder right now.",
        hint:
          "Fresh data may arrive after sync, or this folder may simply not have matching conversations yet.",
      };

    case "archive":
      return {
        icon: <Inbox size={36} />,
        title: "No archived conversations found",
        description:
          "Your archive view does not currently contain any communication threads that match this state.",
        hint:
          "Archived items will appear here after messages are moved out of the active inbox.",
      };

    case "starred":
      return {
        icon: <Sparkles size={36} />,
        title: "No starred conversations found",
        description:
          "There are no favorited or marked-priority conversations available in this view right now.",
        hint:
          "Star important conversations from the thread list to create a faster priority workflow.",
      };

    case "generic":
    default:
      return {
        icon: <XCircle size={36} />,
        title: "No communication results available",
        description:
          "There is nothing to display in this section based on the current state.",
        hint:
          "Try refreshing the data, changing the view, or clearing the current restrictions.",
      };
  }
}

const defaultQuickActions: NoResultsQuickAction[] = [
  {
    id: "clear-search",
    label: "Clear search",
    icon: <Search size={14} />,
  },
  {
    id: "reset-filters",
    label: "Reset filters",
    icon: <Filter size={14} />,
  },
  {
    id: "refresh",
    label: "Refresh results",
    icon: <RefreshCw size={14} />,
  },
];

export default function NoResultsState({
  title,
  description,
  hint,
  variant = "generic",
  compact = false,
  fullHeight = false,
  className,
  searchQuery,
  selectedFilterLabel,
  selectedFolderLabel,
  showMeta = true,
  showQuickActions = true,
  showPrimaryAction = true,
  showSecondaryAction = true,
  primaryActionLabel = "Refresh",
  secondaryActionLabel = "Clear Filters",
  quickActions = defaultQuickActions,
  onPrimaryAction,
  onSecondaryAction,
}: NoResultsStateProps) {
  const meta = getVariantMeta(variant);

  return (
    <section
      className={className}
      style={{
        ...wrapperStyle,
        ...(compact ? compactWrapperStyle : null),
        ...(fullHeight ? fullHeightStyle : null),
      }}
    >
      <div style={compact ? compactInnerStyle : innerStyle}>
        <div style={compact ? compactHeroShellStyle : heroShellStyle}>
          {meta.icon}
          <span style={{ ...glowDotStyle, top: 10, right: 10 }} />
          <span
            style={{
              ...glowDotStyle,
              bottom: 12,
              left: 10,
              width: 8,
              height: 8,
              background: "#cbd5e1",
            }}
          />
        </div>

        <div>
          <h3
            style={{
              ...titleStyle,
              ...(compact ? compactTitleStyle : null),
            }}
          >
            {title ?? meta.title}
          </h3>

          <p
            style={{
              ...descriptionStyle,
              ...(compact ? compactDescriptionStyle : null),
            }}
          >
            {description ?? meta.description}
          </p>
        </div>

        {showMeta && (searchQuery || selectedFilterLabel || selectedFolderLabel) ? (
          <div style={metaRowStyle}>
            {searchQuery ? (
              <span style={chipStyle}>
                <Search size={13} />
                Query: {searchQuery}
              </span>
            ) : null}

            {selectedFilterLabel ? (
              <span style={chipStyle}>
                <Filter size={13} />
                Filter: {selectedFilterLabel}
              </span>
            ) : null}

            {selectedFolderLabel ? (
              <span style={chipStyle}>
                <Inbox size={13} />
                Folder: {selectedFolderLabel}
              </span>
            ) : null}
          </div>
        ) : null}

        <div style={actionRowStyle}>
          {showPrimaryAction ? (
            <button type="button" onClick={onPrimaryAction} style={primaryButtonStyle}>
              <RefreshCw size={15} />
              {primaryActionLabel}
            </button>
          ) : null}

          {showSecondaryAction ? (
            <button
              type="button"
              onClick={onSecondaryAction}
              style={secondaryButtonStyle}
            >
              <Filter size={15} />
              {secondaryActionLabel}
            </button>
          ) : null}
        </div>

        <p style={hintStyle}>{hint ?? meta.hint}</p>

        {showQuickActions && quickActions.length > 0 ? (
          <div style={quickActionsWrapStyle}>
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={action.onClick}
                style={quickActionStyle}
              >
                {action.icon ?? <Sparkles size={14} />}
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}