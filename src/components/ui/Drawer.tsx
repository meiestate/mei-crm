import { useEffect, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";

type DrawerPlacement = "left" | "right" | "top" | "bottom";

type DrawerProps = {
  open: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  placement?: DrawerPlacement;
  width?: number | string;
  height?: number | string;
  closable?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  destroyOnClose?: boolean;
  zIndex?: number;
  onClose: () => void;
};

export default function Drawer({
  open,
  title,
  subtitle,
  children,
  footer,
  placement = "right",
  width = 420,
  height = 360,
  closable = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  destroyOnClose = false,
  zIndex = 1200,
  onClose,
}: DrawerProps) {
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

  const panelStyle = useMemo<CSSProperties>(() => {
    const base: CSSProperties = {
      position: "fixed",
      background: "#ffffff",
      boxShadow: "0 24px 64px rgba(15, 23, 42, 0.22)",
      border: "1px solid #e2e8f0",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      transition: "transform 0.28s ease, opacity 0.28s ease",
      opacity: open ? 1 : 0,
      zIndex: zIndex + 1,
    };

    if (placement === "right") {
      return {
        ...base,
        top: 0,
        right: 0,
        height: "100vh",
        width,
        maxWidth: "100vw",
        borderRadius: "20px 0 0 20px",
        transform: open ? "translateX(0)" : "translateX(100%)",
      };
    }

    if (placement === "left") {
      return {
        ...base,
        top: 0,
        left: 0,
        height: "100vh",
        width,
        maxWidth: "100vw",
        borderRadius: "0 20px 20px 0",
        transform: open ? "translateX(0)" : "translateX(-100%)",
      };
    }

    if (placement === "top") {
      return {
        ...base,
        top: 0,
        left: 0,
        width: "100vw",
        height,
        maxHeight: "100vh",
        borderRadius: "0 0 20px 20px",
        transform: open ? "translateY(0)" : "translateY(-100%)",
      };
    }

    return {
      ...base,
      left: 0,
      bottom: 0,
      width: "100vw",
      height,
      maxHeight: "100vh",
      borderRadius: "20px 20px 0 0",
      transform: open ? "translateY(0)" : "translateY(100%)",
    };
  }, [placement, width, height, open, zIndex]);

  if (!open && destroyOnClose) return null;

  return (
    <>
      <div
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden={!open}
        style={{
          position: "fixed",
          inset: 0,
          background: open ? "rgba(2, 6, 23, 0.48)" : "rgba(2, 6, 23, 0)",
          backdropFilter: open ? "blur(4px)" : "blur(0px)",
          WebkitBackdropFilter: open ? "blur(4px)" : "blur(0px)",
          transition: "all 0.28s ease",
          pointerEvents: open ? "auto" : "none",
          zIndex,
        }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        style={panelStyle}
      >
        {(title || subtitle || closable) && (
          <div
            style={{
              padding: "22px 22px 16px",
              borderBottom: "1px solid #f1f5f9",
              background: "#ffffff",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              {title && (
                <div
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

            {closable && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
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
            flex: 1,
            overflowY: "auto",
            padding: 22,
            background: "#ffffff",
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
      </aside>
    </>
  );
}