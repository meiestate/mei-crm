import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";

type ToastVariant = "success" | "error" | "warning" | "info";

type ToastProps = {
  open: boolean;
  title?: ReactNode;
  message?: ReactNode;
  variant?: ToastVariant;
  duration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  closable?: boolean;
  icon?: ReactNode;
  action?: ReactNode;
  onClose: () => void;
  style?: CSSProperties;
};

const variantMap: Record<
  ToastVariant,
  {
    bg: string;
    border: string;
    title: string;
    text: string;
    iconBg: string;
    iconColor: string;
    defaultIcon: ReactNode;
  }
> = {
  success: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    title: "#166534",
    text: "#15803d",
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
    defaultIcon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M5 10.5L8.5 14L15 7.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  error: {
    bg: "#fef2f2",
    border: "#fecaca",
    title: "#991b1b",
    text: "#b91c1c",
    iconBg: "#fee2e2",
    iconColor: "#dc2626",
    defaultIcon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M10 6V10"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="10" cy="14" r="1.1" fill="currentColor" />
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  warning: {
    bg: "#fffbeb",
    border: "#fde68a",
    title: "#92400e",
    text: "#b45309",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
    defaultIcon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M10 6V10"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="10" cy="14" r="1.1" fill="currentColor" />
        <path
          d="M9.1 3.6L2.3 15.2C1.9 15.9 2.4 16.8 3.2 16.8H16.8C17.6 16.8 18.1 15.9 17.7 15.2L10.9 3.6C10.5 2.9 9.5 2.9 9.1 3.6Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  info: {
    bg: "#eff6ff",
    border: "#bfdbfe",
    title: "#1d4ed8",
    text: "#2563eb",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
    defaultIcon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M10 9V13"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="10" cy="6.2" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
};

function getPositionStyles(
  position: NonNullable<ToastProps["position"]>
): CSSProperties {
  switch (position) {
    case "top-left":
      return { top: 20, left: 20 };
    case "top-center":
      return { top: 20, left: "50%", transform: "translateX(-50%)" };
    case "top-right":
      return { top: 20, right: 20 };
    case "bottom-left":
      return { bottom: 20, left: 20 };
    case "bottom-center":
      return { bottom: 20, left: "50%", transform: "translateX(-50%)" };
    case "bottom-right":
    default:
      return { bottom: 20, right: 20 };
  }
}

export default function Toast({
  open,
  title,
  message,
  variant = "info",
  duration = 3000,
  position = "top-right",
  closable = true,
  icon,
  action,
  onClose,
  style,
}: ToastProps) {
  const colors = variantMap[variant];

  useEffect(() => {
    if (!open || duration <= 0) return;

    const timer = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        zIndex: 1600,
        width: "calc(100vw - 32px)",
        maxWidth: 420,
        ...getPositionStyles(position),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          padding: "14px 16px",
          borderRadius: 18,
          border: `1px solid ${colors.border}`,
          background: colors.bg,
          boxShadow: "0 18px 48px rgba(15, 23, 42, 0.14)",
          animation: "meiToastSlideIn 0.22s ease",
          ...style,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            minWidth: 36,
            borderRadius: 12,
            background: colors.iconBg,
            color: colors.iconColor,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon || colors.defaultIcon}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          {title && (
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 1.4,
                color: colors.title,
                wordBreak: "break-word",
              }}
            >
              {title}
            </div>
          )}

          {message && (
            <div
              style={{
                marginTop: title ? 4 : 0,
                fontSize: 13,
                lineHeight: 1.6,
                color: colors.text,
                wordBreak: "break-word",
              }}
            >
              {message}
            </div>
          )}

          {action && (
            <div
              style={{
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {action}
            </div>
          )}
        </div>

        {closable && (
          <button
            type="button"
            aria-label="Close toast"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              color: colors.text,
              fontSize: 18,
              lineHeight: 1,
              cursor: "pointer",
              padding: 0,
              minWidth: 20,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        )}
      </div>

      <style>
        {`
          @keyframes meiToastSlideIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}