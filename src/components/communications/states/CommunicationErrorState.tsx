import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bug,
  Lock,
  RefreshCw,
  ShieldAlert,
  Unplug,
  WifiOff,
} from "lucide-react";

export type CommunicationErrorTone =
  | "default"
  | "danger"
  | "warning"
  | "muted";

export type CommunicationErrorVariant =
  | "general"
  | "network"
  | "permission"
  | "sync"
  | "server"
  | "empty-retry";

export interface CommunicationErrorStateProps {
  title?: string;
  description?: string;
  details?: string;
  variant?: CommunicationErrorVariant;
  tone?: CommunicationErrorTone;
  compact?: boolean;
  loading?: boolean;
  className?: string;
  icon?: ReactNode;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  showSecondaryAction?: boolean;
  fullHeight?: boolean;
  onRetry?: () => void;
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

const fullHeightStyle: CSSProperties = {
  minHeight: 320,
};

const compactWrapperStyle: CSSProperties = {
  borderRadius: 18,
};

const innerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: 16,
  padding: "36px 24px",
};

const compactInnerStyle: CSSProperties = {
  gap: 14,
  padding: "28px 18px",
};

const iconShellStyle: CSSProperties = {
  width: 72,
  height: 72,
  minWidth: 72,
  borderRadius: 22,
  display: "grid",
  placeItems: "center",
  border: "1px solid #fecaca",
  background: "linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)",
  color: "#dc2626",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
};

const compactIconShellStyle: CSSProperties = {
  ...iconShellStyle,
  width: 60,
  height: 60,
  minWidth: 60,
  borderRadius: 18,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 20,
  lineHeight: 1.2,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  color: "#0f172a",
};

const compactTitleStyle: CSSProperties = {
  fontSize: 17,
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  maxWidth: 560,
  fontSize: 14,
  lineHeight: 1.7,
  color: "#475569",
};

const compactDescriptionStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.6,
};

const detailsBoxStyle: CSSProperties = {
  width: "100%",
  maxWidth: 640,
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px dashed #cbd5e1",
  background: "#f8fafc",
  color: "#64748b",
  fontSize: 12.5,
  lineHeight: 1.65,
  textAlign: "left",
  whiteSpace: "pre-wrap",
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 4,
};

const primaryButtonStyle: CSSProperties = {
  height: 42,
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
  height: 42,
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

const helperTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 12.5,
  lineHeight: 1.6,
  color: "#64748b",
};

const skeletonBlockStyle: CSSProperties = {
  borderRadius: 14,
  background:
    "linear-gradient(90deg, rgba(241,245,249,1) 25%, rgba(226,232,240,0.85) 37%, rgba(241,245,249,1) 63%)",
  backgroundSize: "400% 100%",
  animation: "communicationErrorStateShimmer 1.4s ease infinite",
};

function getVariantConfig(
  variant: CommunicationErrorVariant,
  tone: CommunicationErrorTone,
) {
  const toneMap: Record<
    CommunicationErrorTone,
    { border: string; background: string; color: string }
  > = {
    default: {
      border: "#fecaca",
      background: "linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)",
      color: "#dc2626",
    },
    danger: {
      border: "#fecaca",
      background: "linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)",
      color: "#dc2626",
    },
    warning: {
      border: "#fde68a",
      background: "linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)",
      color: "#d97706",
    },
    muted: {
      border: "#cbd5e1",
      background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
      color: "#475569",
    },
  };

  const defaultTone = toneMap[tone];

  switch (variant) {
    case "network":
      return {
        icon: <WifiOff size={28} />,
        title: "Connection lost while loading communication data",
        description:
          "We couldn’t reach the server right now. Please check your network connection and try refreshing the inbox again.",
        shell: {
          border: "1px solid #bfdbfe",
          background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
          color: "#2563eb",
        },
      };

    case "permission":
      return {
        icon: <Lock size={28} />,
        title: "You don’t have access to this communication area",
        description:
          "This section is currently restricted based on your role or workspace permissions. Contact an admin if you believe this is unexpected.",
        shell: {
          border: "1px solid #ddd6fe",
          background: "linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)",
          color: "#7c3aed",
        },
      };

    case "sync":
      return {
        icon: <Unplug size={28} />,
        title: "Communication sync failed",
        description:
          "The latest conversations, templates, or activity logs couldn’t be synchronized. Retry now to re-establish the data flow.",
        shell: {
          border: "1px solid #99f6e4",
          background: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)",
          color: "#0f766e",
        },
      };

    case "server":
      return {
        icon: <ShieldAlert size={28} />,
        title: "The server hit a problem while processing this request",
        description:
          "Something broke on the service side while fetching or updating communication records. A retry usually fixes temporary issues.",
        shell: {
          border: "1px solid #fecaca",
          background: "linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)",
          color: "#dc2626",
        },
      };

    case "empty-retry":
      return {
        icon: <Bug size={28} />,
        title: "This section didn’t load properly",
        description:
          "We expected communication content here, but the state came back incomplete. Try reloading this panel to recover the missing data.",
        shell: {
          border: "1px solid #fde68a",
          background: "linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)",
          color: "#d97706",
        },
      };

    case "general":
    default:
      return {
        icon: <AlertTriangle size={28} />,
        title: "Something went wrong in the communication workspace",
        description:
          "An unexpected issue interrupted this screen. Retry the action or return to the previous panel and try again.",
        shell: defaultTone,
      };
  }
}

function LoadingErrorState({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <style>
        {`
          @keyframes communicationErrorStateShimmer {
            0% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
          }
        `}
      </style>

      <div style={compact ? compactInnerStyle : innerStyle}>
        <div
          style={{
            ...skeletonBlockStyle,
            width: compact ? 56 : 72,
            height: compact ? 56 : 72,
            borderRadius: compact ? 18 : 22,
          }}
        />
        <div
          style={{
            ...skeletonBlockStyle,
            width: compact ? 220 : 320,
            height: 22,
          }}
        />
        <div
          style={{
            ...skeletonBlockStyle,
            width: compact ? 260 : 520,
            height: 58,
          }}
        />
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              ...skeletonBlockStyle,
              width: 132,
              height: 42,
              borderRadius: 12,
            }}
          />
          <div
            style={{
              ...skeletonBlockStyle,
              width: 132,
              height: 42,
              borderRadius: 12,
            }}
          />
        </div>
      </div>
    </>
  );
}

export default function CommunicationErrorState({
  title,
  description,
  details,
  variant = "general",
  tone = "default",
  compact = false,
  loading = false,
  className,
  icon,
  primaryActionLabel = "Try Again",
  secondaryActionLabel = "Go Back",
  showSecondaryAction = true,
  fullHeight = false,
  onRetry,
  onSecondaryAction,
}: CommunicationErrorStateProps) {
  const config = getVariantConfig(variant, tone);

  return (
    <section
      className={className}
      style={{
        ...wrapperStyle,
        ...(compact ? compactWrapperStyle : null),
        ...(fullHeight ? fullHeightStyle : null),
      }}
    >
      {loading ? (
        <LoadingErrorState compact={compact} />
      ) : (
        <div style={compact ? compactInnerStyle : innerStyle}>
          <div
            style={{
              ...(compact ? compactIconShellStyle : iconShellStyle),
              ...config.shell,
            }}
          >
            {icon ?? config.icon}
          </div>

          <div>
            <h3
              style={{
                ...titleStyle,
                ...(compact ? compactTitleStyle : null),
              }}
            >
              {title ?? config.title}
            </h3>

            <p
              style={{
                ...descriptionStyle,
                ...(compact ? compactDescriptionStyle : null),
              }}
            >
              {description ?? config.description}
            </p>
          </div>

          {details ? <div style={detailsBoxStyle}>{details}</div> : null}

          <div style={actionRowStyle}>
            <button type="button" onClick={onRetry} style={primaryButtonStyle}>
              <RefreshCw size={15} />
              {primaryActionLabel}
            </button>

            {showSecondaryAction ? (
              <button
                type="button"
                onClick={onSecondaryAction}
                style={secondaryButtonStyle}
              >
                <ArrowRight size={15} />
                {secondaryActionLabel}
              </button>
            ) : null}
          </div>

          <p style={helperTextStyle}>
            If this keeps happening, check the API response, workspace access, or
            message sync status before retrying again.
          </p>
        </div>
      )}
    </section>
  );
}