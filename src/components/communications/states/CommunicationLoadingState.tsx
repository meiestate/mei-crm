import type { CSSProperties } from "react";
import {
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

export type CommunicationLoadingVariant =
  | "inbox"
  | "thread"
  | "composer"
  | "sidebar"
  | "search"
  | "sync"
  | "generic";

export interface CommunicationLoadingStateProps {
  title?: string;
  description?: string;
  variant?: CommunicationLoadingVariant;
  compact?: boolean;
  fullHeight?: boolean;
  className?: string;
  showHeader?: boolean;
  showCards?: boolean;
  showPulseRows?: boolean;
  cardCount?: number;
  rowCount?: number;
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
  minHeight: 320,
};

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 18,
  padding: 22,
};

const compactContainerStyle: CSSProperties = {
  gap: 14,
  padding: 16,
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
};

const headerLeftStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 14,
  minWidth: 0,
  flex: 1,
};

const iconShellStyle: CSSProperties = {
  width: 56,
  height: 56,
  minWidth: 56,
  borderRadius: 18,
  display: "grid",
  placeItems: "center",
  border: "1px solid #dbeafe",
  background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
  color: "#2563eb",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
};

const compactIconShellStyle: CSSProperties = {
  ...iconShellStyle,
  width: 48,
  height: 48,
  minWidth: 48,
  borderRadius: 15,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  lineHeight: 1.2,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  color: "#0f172a",
};

const compactTitleStyle: CSSProperties = {
  fontSize: 16,
};

const descriptionStyle: CSSProperties = {
  margin: "6px 0 0 0",
  maxWidth: 620,
  fontSize: 13.5,
  lineHeight: 1.7,
  color: "#64748b",
};

const compactDescriptionStyle: CSSProperties = {
  fontSize: 12.5,
  lineHeight: 1.6,
};

const statusPillStyle: CSSProperties = {
  minHeight: 34,
  padding: "7px 12px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 12,
  fontWeight: 800,
  color: "#1d4ed8",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  whiteSpace: "nowrap",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const compactGridStyle: CSSProperties = {
  ...gridStyle,
  gap: 12,
};

const skeletonCardStyle: CSSProperties = {
  borderRadius: 18,
  border: "1px solid #e2e8f0",
  background:
    "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const compactSkeletonCardStyle: CSSProperties = {
  ...skeletonCardStyle,
  borderRadius: 16,
  padding: 14,
  gap: 10,
};

const rowListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const pulseRowStyle: CSSProperties = {
  borderRadius: 18,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  padding: 14,
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const compactPulseRowStyle: CSSProperties = {
  ...pulseRowStyle,
  borderRadius: 16,
  padding: 12,
  gap: 10,
};

const shimmerStyle: CSSProperties = {
  background:
    "linear-gradient(90deg, rgba(241,245,249,1) 25%, rgba(226,232,240,0.85) 37%, rgba(241,245,249,1) 63%)",
  backgroundSize: "400% 100%",
  animation: "communicationLoadingShimmer 1.4s ease infinite",
};

const helperTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 12.5,
  lineHeight: 1.6,
  color: "#64748b",
};

function getVariantMeta(variant: CommunicationLoadingVariant) {
  switch (variant) {
    case "inbox":
      return {
        icon: <Mail size={24} />,
        title: "Loading communication inbox",
        description:
          "Pulling latest conversations, unread counters, and communication activity into this workspace.",
      };

    case "thread":
      return {
        icon: <MessageSquare size={24} />,
        title: "Opening conversation thread",
        description:
          "Fetching messages, replies, attachments, and timeline context for the selected conversation.",
      };

    case "composer":
      return {
        icon: <Sparkles size={24} />,
        title: "Preparing composer tools",
        description:
          "Loading templates, quick actions, merge fields, and recent communication suggestions.",
      };

    case "sidebar":
      return {
        icon: <Mail size={24} />,
        title: "Loading communication sidebar",
        description:
          "Bringing folders, channels, smart filters, and template shortcuts into view.",
      };

    case "search":
      return {
        icon: <Search size={24} />,
        title: "Searching communication records",
        description:
          "Scanning message history, templates, and conversation metadata for the best results.",
      };

    case "sync":
      return {
        icon: <RefreshCw size={24} />,
        title: "Syncing latest communication data",
        description:
          "Refreshing channels, replies, delivery states, and recent activity from the server.",
      };

    case "generic":
    default:
      return {
        icon: <Loader2 size={24} />,
        title: "Loading communication workspace",
        description:
          "Please wait while we prepare the latest messaging data and communication tools.",
      };
  }
}

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
        ...shimmerStyle,
        width,
        height,
        borderRadius: radius,
      }}
    />
  );
}

function SkeletonCard({ compact = false }: { compact?: boolean }) {
  return (
    <div style={compact ? compactSkeletonCardStyle : skeletonCardStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            ...shimmerStyle,
            width: compact ? 34 : 40,
            height: compact ? 34 : 40,
            borderRadius: 12,
          }}
        />
        <div style={{ display: "grid", gap: 8, flex: 1 }}>
          <SkeletonLine width="58%" height={12} />
          <SkeletonLine width="38%" height={10} />
        </div>
      </div>

      <SkeletonLine width="100%" height={11} />
      <SkeletonLine width="85%" height={11} />
      <SkeletonLine width="62%" height={11} />
    </div>
  );
}

function PulseRow({ compact = false }: { compact?: boolean }) {
  return (
    <div style={compact ? compactPulseRowStyle : pulseRowStyle}>
      <div
        style={{
          ...shimmerStyle,
          width: compact ? 38 : 44,
          height: compact ? 38 : 44,
          borderRadius: 14,
          minWidth: compact ? 38 : 44,
        }}
      />
      <div style={{ flex: 1, display: "grid", gap: 8 }}>
        <SkeletonLine width="48%" height={12} />
        <SkeletonLine width="72%" height={10} />
      </div>
      <SkeletonLine width={compact ? 52 : 64} height={24} radius={999} />
    </div>
  );
}

export default function CommunicationLoadingState({
  title,
  description,
  variant = "generic",
  compact = false,
  fullHeight = false,
  className,
  showHeader = true,
  showCards = true,
  showPulseRows = true,
  cardCount = 3,
  rowCount = 4,
}: CommunicationLoadingStateProps) {
  const meta = getVariantMeta(variant);

  return (
    <section
      className={className}
      style={{
        ...wrapperStyle,
        ...(compact ? compactWrapperStyle : null),
        ...(fullHeight ? fullHeightStyle : null),
      }}
      aria-busy="true"
      aria-live="polite"
    >
      <style>
        {`
          @keyframes communicationLoadingShimmer {
            0% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
          }

          @keyframes communicationLoadingSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={compact ? compactContainerStyle : containerStyle}>
        {showHeader ? (
          <div style={headerStyle}>
            <div style={headerLeftStyle}>
              <div style={compact ? compactIconShellStyle : iconShellStyle}>
                <div
                  style={{
                    display: "inline-flex",
                    animation: "communicationLoadingSpin 1.4s linear infinite",
                  }}
                >
                  {meta.icon}
                </div>
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
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
            </div>

            <div style={statusPillStyle}>
              <Loader2 size={14} style={{ animation: "communicationLoadingSpin 1s linear infinite" }} />
              Loading
            </div>
          </div>
        ) : null}

        {showCards ? (
          <div style={compact ? compactGridStyle : gridStyle}>
            {Array.from({ length: Math.max(1, cardCount) }).map((_, index) => (
              <SkeletonCard key={`card-${index}`} compact={compact} />
            ))}
          </div>
        ) : null}

        {showPulseRows ? (
          <div style={rowListStyle}>
            {Array.from({ length: Math.max(1, rowCount) }).map((_, index) => (
              <PulseRow key={`row-${index}`} compact={compact} />
            ))}
          </div>
        ) : null}

        <p style={helperTextStyle}>
          This usually takes a moment while the communication module pulls fresh data,
          rebuilds the visible state, and prepares actions.
        </p>
      </div>
    </section>
  );
}