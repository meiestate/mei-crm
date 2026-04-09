import { useEffect } from "react";
import type { ReactNode, CSSProperties } from "react";

type ModalProps = {
  open: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number | string;
  maxWidth?: number | string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  centered?: boolean;
  bodyPadding?: number | string;
  zIndex?: number;
  onClose: () => void;
};

export default function Modal({
  open,
  title,
  subtitle,
  children,
  footer,
  width = 640,
  maxWidth = "calc(100vw - 32px)",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  centered = true,
  bodyPadding = 22,
  zIndex = 1300,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  const contentStyle: CSSProperties = {
    position: "fixed",
    left: "50%",
    top: centered ? "50%" : 40,
    transform: centered ? "translate(-50%, -50%)" : "translateX(-50%)",
    width,
    maxWidth,
    maxHeight: centered ? "calc(100vh - 32px)" : "calc(100vh - 80px)",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 22,
    boxShadow: "0 30px 80px rgba(15, 23, 42, 0.22)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: zIndex + 1,
  };

  return (
    <>
      <div
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(2, 6, 23, 0.52)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex,
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={subtitle ? "modal-subtitle" : undefined}
        style={contentStyle}
      >
        {(title || subtitle || showCloseButton) && (
          <div
            style={{
              padding: "22px 22px 16px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              background: "#ffffff",
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              {title && (
                <div
                  id="modal-title"
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: "#0f172a",
                    wordBreak: "break-word",
                  }}
                >
                  {title}
                </div>
              )}

              {subtitle && (
                <div
                  id="modal-subtitle"
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "#64748b",
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
                aria-label="Close modal"
                style={{
                  width: 38,
                  height: 38,
                  minWidth: 38,
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#334155",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  transition: "all 0.2s ease",
                }}
              >
                ×
              </button>
            )}
          </div>
        )}

        <div
          style={{
            padding: bodyPadding,
            overflowY: "auto",
            background: "#ffffff",
            flex: 1,
          }}
        >
          {children}
        </div>

        {footer && (
          <div
            style={{
              padding: 20,
              borderTop: "1px solid #f1f5f9",
              background: "#f8fafc",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </>
  );
}