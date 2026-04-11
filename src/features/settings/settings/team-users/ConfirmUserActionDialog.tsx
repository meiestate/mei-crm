// src/features/settings/settings/team-users/ConfirmUserActionDialog.tsx

import { getTheme, type ThemeMode } from "../../../../theme";

type ConfirmUserActionDialogProps = {
  open: boolean;
  mode?: ThemeMode;
  loading?: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary" | "neutral";
  onConfirm: () => void;
  onClose: () => void;
};

function getToneStyles(
  tone: "danger" | "primary" | "neutral"
): {
  iconBg: string;
  iconBorder: string;
  iconText: string;
  buttonBg: string;
  buttonText: string;
  icon: string;
} {
  if (tone === "danger") {
    return {
      iconBg: "rgba(239, 68, 68, 0.12)",
      iconBorder: "rgba(239, 68, 68, 0.24)",
      iconText: "#dc2626",
      buttonBg: "#dc2626",
      buttonText: "#ffffff",
      icon: "⚠️",
    };
  }

  if (tone === "primary") {
    return {
      iconBg: "rgba(59, 130, 246, 0.12)",
      iconBorder: "rgba(59, 130, 246, 0.24)",
      iconText: "#2563eb",
      buttonBg: "#2563eb",
      buttonText: "#ffffff",
      icon: "ℹ️",
    };
  }

  return {
    iconBg: "rgba(100, 116, 139, 0.12)",
    iconBorder: "rgba(100, 116, 139, 0.24)",
    iconText: "#475569",
    buttonBg: "#334155",
    buttonText: "#ffffff",
    icon: "❔",
  };
}

export default function ConfirmUserActionDialog({
  open,
  mode = "light",
  loading = false,
  title = "Are you sure?",
  message = "Please confirm this action.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onClose,
}: ConfirmUserActionDialogProps) {
  const theme = getTheme(mode);
  const toneStyles = getToneStyles(tone);

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={loading ? undefined : onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        background:
          mode === "dark" ? "rgba(2, 6, 23, 0.72)" : "rgba(15, 23, 42, 0.42)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 460,
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 24,
          boxShadow:
            mode === "dark"
              ? "0 24px 60px rgba(0,0,0,0.45)"
              : "0 24px 60px rgba(15, 23, 42, 0.16)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 22,
            display: "grid",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "56px 1fr",
              gap: 14,
              alignItems: "start",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                background: toneStyles.iconBg,
                border: `1px solid ${toneStyles.iconBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                color: toneStyles.iconText,
                flexShrink: 0,
              }}
            >
              {toneStyles.icon}
            </div>

            <div style={{ minWidth: 0 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 900,
                  color: theme.text,
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h3>

              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: theme.subText,
                  wordBreak: "break-word",
                }}
              >
                {message}
              </p>
            </div>
          </div>

          <div
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.cardBgSoft,
              borderRadius: 16,
              padding: "12px 14px",
              fontSize: 12,
              color: theme.mutedText,
              lineHeight: 1.6,
            }}
          >
            This action may update user records immediately.
          </div>
        </div>

        <div
          style={{
            borderTop: `1px solid ${theme.border}`,
            padding: 18,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            flexWrap: "wrap",
            background: theme.cardBg,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.cardBgSoft,
              color: theme.text,
              borderRadius: 12,
              padding: "11px 16px",
              fontSize: 14,
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              border: "none",
              background: toneStyles.buttonBg,
              color: toneStyles.buttonText,
              borderRadius: 12,
              padding: "11px 16px",
              fontSize: 14,
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1,
              minWidth: 120,
            }}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}