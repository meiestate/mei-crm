import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";

type ThemeMode = "light" | "dark";

type ConversationDeletePreview = {
  id: string;
  subject: string;
  customerName?: string;
  channel?: "Email" | "SMS" | "WhatsApp" | "Call" | "Internal";
  messageCount?: number;
  lastMessageAt?: string;
};

type Props = {
  open: boolean;
  mode?: ThemeMode;
  loading?: boolean;
  conversation?: ConversationDeletePreview | null;
  requireTypingConfirmation?: boolean;
  confirmationText?: string;
  onClose: () => void;
  onConfirm: (conversationId: string) => void | Promise<void>;
};

type ThemePalette = {
  mode: ThemeMode;
  overlay: string;
  modalBg: string;
  cardBg: string;
  inputBg: string;
  border: string;
  borderSoft: string;
  text: string;
  subText: string;
  mutedText: string;
  primary: string;
  danger: string;
  dangerHover: string;
  warning: string;
  shadow: string;
};

const getTheme = (mode: ThemeMode = "light"): ThemePalette => {
  if (mode === "dark") {
    return {
      mode: "dark",
      overlay: "rgba(2, 6, 23, 0.78)",
      modalBg: "#0f172a",
      cardBg: "#111827",
      inputBg: "#0b1220",
      border: "#334155",
      borderSoft: "#1e293b",
      text: "#f8fafc",
      subText: "#cbd5e1",
      mutedText: "#94a3b8",
      primary: "#22c55e",
      danger: "#ef4444",
      dangerHover: "#dc2626",
      warning: "#f59e0b",
      shadow: "0 24px 64px rgba(0,0,0,0.48)",
    };
  }

  return {
    mode: "light",
    overlay: "rgba(15, 23, 42, 0.45)",
    modalBg: "#ffffff",
    cardBg: "#f8fafc",
    inputBg: "#ffffff",
    border: "#cbd5e1",
    borderSoft: "#e2e8f0",
    text: "#0f172a",
    subText: "#334155",
    mutedText: "#64748b",
    primary: "#16a34a",
    danger: "#dc2626",
    dangerHover: "#b91c1c",
    warning: "#d97706",
    shadow: "0 24px 64px rgba(15, 23, 42, 0.18)",
  };
};

const safeText = (value?: string | null, fallback = "—") => {
  return value && value.trim() ? value : fallback;
};

export default function DeleteConversationConfirmModal({
  open,
  mode = "light",
  loading = false,
  conversation,
  requireTypingConfirmation = true,
  confirmationText = "DELETE",
  onClose,
  onConfirm,
}: Props) {
  const theme = useMemo(() => getTheme(mode), [mode]);
  const [typedValue, setTypedValue] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const busy = loading || submitting;
  const canConfirm =
    !!conversation &&
    (!requireTypingConfirmation || typedValue.trim() === confirmationText);

  useEffect(() => {
    if (open) {
      setTypedValue("");
      setError("");
      setSubmitting(false);
    }
  }, [open, conversation]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, busy, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!conversation?.id) {
      setError("No conversation selected.");
      return;
    }

    if (requireTypingConfirmation && typedValue.trim() !== confirmationText) {
      setError(`Please type "${confirmationText}" correctly to continue.`);
      return;
    }

    try {
      setError("");
      setSubmitting(true);
      await onConfirm(conversation.id);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: theme.overlay,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 1600,
  };

  const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: 620,
    background: theme.modalBg,
    color: theme.text,
    borderRadius: 22,
    border: `1px solid ${theme.borderSoft}`,
    boxShadow: theme.shadow,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle: CSSProperties = {
    padding: "22px 24px 16px",
    borderBottom: `1px solid ${theme.borderSoft}`,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  };

  const titleWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minWidth: 0,
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: -0.3,
    color: theme.text,
  };

  const subtitleStyle: CSSProperties = {
    margin: 0,
    fontSize: 13,
    color: theme.mutedText,
    lineHeight: 1.6,
  };

  const closeButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    color: theme.text,
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.7 : 1,
  };

  const bodyStyle: CSSProperties = {
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  };

  const warningBoxStyle: CSSProperties = {
    border: `1px solid ${theme.mode === "dark" ? "rgba(239,68,68,0.28)" : "#fecaca"}`,
    background: theme.mode === "dark" ? "rgba(127,29,29,0.22)" : "#fef2f2",
    color: theme.danger,
    borderRadius: 18,
    padding: "14px 16px",
    fontSize: 13,
    lineHeight: 1.7,
  };

  const previewCardStyle: CSSProperties = {
    border: `1px solid ${theme.borderSoft}`,
    background: theme.cardBg,
    borderRadius: 18,
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

  const previewTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: 15,
    fontWeight: 900,
    color: theme.text,
  };

  const infoGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
  };

  const infoItemStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
  };

  const infoLabelStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 800,
    color: theme.mutedText,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  };

  const infoValueStyle: CSSProperties = {
    fontSize: 14,
    color: theme.text,
    fontWeight: 700,
    lineHeight: 1.5,
    wordBreak: "break-word",
  };

  const inputWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };

  const labelStyle: CSSProperties = {
    fontSize: 13,
    fontWeight: 800,
    color: theme.subText,
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    borderRadius: 14,
    border: `1px solid ${error ? theme.danger : theme.border}`,
    background: theme.inputBg,
    color: theme.text,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontWeight: 700,
  };

  const helperTextStyle: CSSProperties = {
    fontSize: 12,
    color: theme.mutedText,
    lineHeight: 1.6,
  };

  const errorTextStyle: CSSProperties = {
    fontSize: 12,
    color: theme.danger,
    fontWeight: 700,
  };

  const footerStyle: CSSProperties = {
    padding: "16px 24px 22px",
    borderTop: `1px solid ${theme.borderSoft}`,
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    flexWrap: "wrap",
  };

  const cancelButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    color: theme.text,
    borderRadius: 14,
    padding: "12px 18px",
    fontSize: 14,
    fontWeight: 800,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.7 : 1,
  };

  const deleteButtonStyle: CSSProperties = {
    border: "none",
    background: theme.danger,
    color: "#ffffff",
    borderRadius: 14,
    padding: "12px 18px",
    fontSize: 14,
    fontWeight: 900,
    cursor: !canConfirm || busy ? "not-allowed" : "pointer",
    opacity: !canConfirm || busy ? 0.65 : 1,
  };

  return (
    <div
      style={overlayStyle}
      onClick={() => {
        if (!busy) onClose();
      }}
    >
      <div
        style={modalStyle}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-conversation-title"
      >
        <div style={headerStyle}>
          <div style={titleWrapStyle}>
            <h2 id="delete-conversation-title" style={titleStyle}>
              Delete Conversation
            </h2>
            <p style={subtitleStyle}>
              This action is permanent and removes the selected conversation from your communication records.
            </p>
          </div>

          <button
            type="button"
            style={closeButtonStyle}
            onClick={onClose}
            disabled={busy}
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={bodyStyle}>
            <div style={warningBoxStyle}>
              <strong>Warning:</strong> Deleting this conversation may remove message history,
              follow-up context, and linked internal tracking visibility from your workspace.
            </div>

            <div style={previewCardStyle}>
              <h3 style={previewTitleStyle}>Conversation Preview</h3>

              <div style={infoGridStyle}>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>Subject</span>
                  <span style={infoValueStyle}>
                    {safeText(conversation?.subject)}
                  </span>
                </div>

                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>Customer</span>
                  <span style={infoValueStyle}>
                    {safeText(conversation?.customerName)}
                  </span>
                </div>

                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>Channel</span>
                  <span style={infoValueStyle}>
                    {safeText(conversation?.channel)}
                  </span>
                </div>

                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>Messages</span>
                  <span style={infoValueStyle}>
                    {conversation?.messageCount ?? 0}
                  </span>
                </div>

                <div style={{ ...infoItemStyle, gridColumn: "1 / -1" }}>
                  <span style={infoLabelStyle}>Last Message</span>
                  <span style={infoValueStyle}>
                    {safeText(conversation?.lastMessageAt)}
                  </span>
                </div>
              </div>
            </div>

            {requireTypingConfirmation ? (
              <div style={inputWrapStyle}>
                <label htmlFor="delete-conversation-confirmation" style={labelStyle}>
                  Type <strong>{confirmationText}</strong> to confirm deletion
                </label>
                <input
                  id="delete-conversation-confirmation"
                  type="text"
                  value={typedValue}
                  onChange={(event) => {
                    setTypedValue(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder={`Type ${confirmationText}`}
                  style={inputStyle}
                  disabled={busy}
                />
                <span style={helperTextStyle}>
                  This extra step helps prevent accidental deletion of active conversations.
                </span>
                {error ? <span style={errorTextStyle}>{error}</span> : null}
              </div>
            ) : error ? (
              <span style={errorTextStyle}>{error}</span>
            ) : null}
          </div>

          <div style={footerStyle}>
            <button
              type="button"
              style={cancelButtonStyle}
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={deleteButtonStyle}
              disabled={!canConfirm || busy}
            >
              {busy ? "Deleting..." : "Delete Conversation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}