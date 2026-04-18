import React, { memo } from "react";

type Props = {
  onCancel?: () => void;
  onSaveDraft?: () => void;
  onScheduleSend?: () => void;
  onSendNow?: () => void;
  isSavingDraft?: boolean;
  isScheduling?: boolean;
  isSending?: boolean;
  disableSaveDraft?: boolean;
  disableScheduleSend?: boolean;
  disableSendNow?: boolean;
  hideCancel?: boolean;
  hideSaveDraft?: boolean;
  hideScheduleSend?: boolean;
  hideSendNow?: boolean;
  saveDraftLabel?: string;
  scheduleSendLabel?: string;
  sendNowLabel?: string;
  cancelLabel?: string;
  statusText?: string;
  errorText?: string;
  className?: string;
  sticky?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  paddingTop: 16,
  borderTop: "1px solid #e5e7eb",
  background: "#ffffff",
};

const stickyStyle: React.CSSProperties = {
  position: "sticky",
  bottom: 0,
  zIndex: 10,
  paddingBottom: 4,
};

const topRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const helperTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.5,
};

const errorTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#b91c1c",
  fontWeight: 600,
  lineHeight: 1.5,
};

const actionsRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const leftActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const rightActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 10,
  flexWrap: "wrap",
  marginLeft: "auto",
};

const baseButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid transparent",
  borderRadius: 12,
  padding: "10px 16px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s ease",
  whiteSpace: "nowrap",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minHeight: 42,
};

const ghostButtonStyle: React.CSSProperties = {
  ...baseButtonStyle,
  background: "#ffffff",
  color: "#334155",
  border: "1px solid #dbe3ef",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...baseButtonStyle,
  background: "#f8fafc",
  color: "#0f172a",
  border: "1px solid #dbe3ef",
};

const primaryButtonStyle: React.CSSProperties = {
  ...baseButtonStyle,
  background: "#2563eb",
  color: "#ffffff",
  border: "1px solid #2563eb",
  boxShadow: "0 8px 20px rgba(37, 99, 235, 0.22)",
};

const disabledButtonStyle: React.CSSProperties = {
  cursor: "not-allowed",
  opacity: 0.55,
  boxShadow: "none",
};

const spinnerStyle: React.CSSProperties = {
  width: 14,
  height: 14,
  borderRadius: "50%",
  border: "2px solid currentColor",
  borderRightColor: "transparent",
  animation: "composer-footer-spin 0.75s linear infinite",
};

function ComposerFooterActions({
  onCancel,
  onSaveDraft,
  onScheduleSend,
  onSendNow,
  isSavingDraft = false,
  isScheduling = false,
  isSending = false,
  disableSaveDraft = false,
  disableScheduleSend = false,
  disableSendNow = false,
  hideCancel = false,
  hideSaveDraft = false,
  hideScheduleSend = false,
  hideSendNow = false,
  saveDraftLabel = "Save Draft",
  scheduleSendLabel = "Schedule Send",
  sendNowLabel = "Send Now",
  cancelLabel = "Cancel",
  statusText,
  errorText,
  className,
  sticky = false,
  leftSlot,
  rightSlot,
}: Props) {
  const anyLoading = isSavingDraft || isScheduling || isSending;

  return (
    <div
      className={className}
      style={{
        ...wrapperStyle,
        ...(sticky ? stickyStyle : {}),
      }}
    >
      <style>
        {`
          @keyframes composer-footer-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            .composer-footer-actions-row {
              flex-direction: column;
              align-items: stretch !important;
            }

            .composer-footer-left,
            .composer-footer-right {
              width: 100%;
              justify-content: stretch !important;
              margin-left: 0 !important;
            }

            .composer-footer-left > button,
            .composer-footer-right > button {
              flex: 1 1 auto;
              width: 100%;
            }
          }
        `}
      </style>

      {(statusText || errorText) && (
        <div style={topRowStyle}>
          {errorText ? (
            <div style={errorTextStyle}>{errorText}</div>
          ) : (
            <div style={helperTextStyle}>{statusText}</div>
          )}
        </div>
      )}

      <div className="composer-footer-actions-row" style={actionsRowStyle}>
        <div className="composer-footer-left" style={leftActionsStyle}>
          {leftSlot}

          {!hideCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={anyLoading}
              style={{
                ...ghostButtonStyle,
                ...(anyLoading ? disabledButtonStyle : {}),
              }}
            >
              {cancelLabel}
            </button>
          )}

          {!hideSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={anyLoading || disableSaveDraft}
              style={{
                ...secondaryButtonStyle,
                ...(anyLoading || disableSaveDraft ? disabledButtonStyle : {}),
              }}
            >
              {isSavingDraft ? <span style={spinnerStyle} /> : null}
              {isSavingDraft ? "Saving..." : saveDraftLabel}
            </button>
          )}
        </div>

        <div className="composer-footer-right" style={rightActionsStyle}>
          {rightSlot}

          {!hideScheduleSend && (
            <button
              type="button"
              onClick={onScheduleSend}
              disabled={anyLoading || disableScheduleSend}
              style={{
                ...secondaryButtonStyle,
                ...(anyLoading || disableScheduleSend ? disabledButtonStyle : {}),
              }}
            >
              {isScheduling ? <span style={spinnerStyle} /> : null}
              {isScheduling ? "Scheduling..." : scheduleSendLabel}
            </button>
          )}

          {!hideSendNow && (
            <button
              type="button"
              onClick={onSendNow}
              disabled={anyLoading || disableSendNow}
              style={{
                ...primaryButtonStyle,
                ...(anyLoading || disableSendNow ? disabledButtonStyle : {}),
              }}
            >
              {isSending ? <span style={spinnerStyle} /> : null}
              {isSending ? "Sending..." : sendNowLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ComposerFooterActions);