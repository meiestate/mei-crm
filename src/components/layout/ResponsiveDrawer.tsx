import React, { useEffect } from "react";

type ResponsiveDrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  side?: "left" | "right" | "bottom";
  width?: number | string;
  mobileHeight?: string;
  isMobile?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  zIndex?: number;
};

export default function ResponsiveDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  side = "right",
  width = 420,
  mobileHeight = "85vh",
  isMobile = false,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  zIndex = 1000,
}: ResponsiveDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  const isBottomSheet = isMobile || side === "bottom";

  const panelStyle: React.CSSProperties = isBottomSheet
    ? {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        maxHeight: mobileHeight,
        background: "#ffffff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: "0 -10px 30px rgba(15,23,42,0.18)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transform: "translateY(0)",
      }
    : {
        position: "fixed",
        top: 0,
        bottom: 0,
        [side]: 0,
        width,
        maxWidth: "100vw",
        background: "#ffffff",
        boxShadow:
          side === "left"
            ? "10px 0 30px rgba(15,23,42,0.12)"
            : "-10px 0 30px rgba(15,23,42,0.12)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={closeOnOverlayClick ? onClose : undefined}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15,23,42,0.5)",
          backdropFilter: "blur(2px)",
        }}
      />

      <div style={panelStyle}>
        {isBottomSheet && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 10,
              paddingBottom: 4,
            }}
          >
            <div
              style={{
                width: 44,
                height: 5,
                borderRadius: 999,
                background: "#cbd5e1",
              }}
            />
          </div>
        )}

        {(title || subtitle || showCloseButton) && (
          <div
            style={{
              padding: isMobile ? "14px 14px 12px" : "18px 18px 14px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              {title && (
                <div
                  style={{
                    fontSize: isMobile ? 17 : 18,
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1.35,
                    marginBottom: subtitle ? 4 : 0,
                    wordBreak: "break-word",
                  }}
                >
                  {title}
                </div>
              )}

              {subtitle && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    lineHeight: 1.55,
                    wordBreak: "break-word",
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                style={{
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#0f172a",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  fontSize: 18,
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            )}
          </div>
        )}

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: isMobile ? 14 : 18,
          }}
        >
          {children}
        </div>

        {footer && (
          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              padding: isMobile ? 14 : 16,
              background: "#ffffff",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}