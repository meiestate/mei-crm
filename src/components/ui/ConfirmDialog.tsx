import { useEffect } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "Please confirm this action.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
      if (event.key === "Enter") {
        onConfirm();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  const confirmButtonStyles =
    confirmVariant === "danger"
      ? {
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          border: "1px solid #dc2626",
          color: "#ffffff",
          boxShadow: "0 10px 24px rgba(239, 68, 68, 0.22)",
        }
      : {
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          border: "1px solid #1d4ed8",
          color: "#ffffff",
          boxShadow: "0 10px 24px rgba(37, 99, 235, 0.22)",
        };

  return (
    <>
      <div
        onClick={loading ? undefined : onCancel}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(2, 6, 23, 0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: 999,
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "calc(100% - 32px)",
          maxWidth: 440,
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 22,
          boxShadow: "0 30px 80px rgba(15, 23, 42, 0.28)",
          zIndex: 1000,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "22px 22px 14px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div
            id="confirm-dialog-title"
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>

          <div
            id="confirm-dialog-message"
            style={{
              marginTop: 8,
              fontSize: 14,
              color: "#64748b",
              lineHeight: 1.65,
            }}
          >
            {message}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            padding: "18px 22px 22px",
            background: "#f8fafc",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              height: 42,
              padding: "0 16px",
              borderRadius: 12,
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s ease",
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              height: 42,
              padding: "0 16px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              ...confirmButtonStyles,
            }}
          >
            {loading && (
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.35)",
                  borderTopColor: "#ffffff",
                  display: "inline-block",
                  animation: "confirmDialogSpin 0.8s linear infinite",
                }}
              />
            )}
            <span>{loading ? "Processing..." : confirmText}</span>
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes confirmDialogSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}