import { useMemo, useState, type ChangeEvent } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type NotesEditorProps = {
  mode: ThemeMode;
  value?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  minRows?: number;
  maxLength?: number;
  saveLabel?: string;
  cancelLabel?: string;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
  loading?: boolean;
  showActions?: boolean;
  showCharCount?: boolean;
  autoSaveHint?: string;
  lastUpdatedText?: string;
};

export default function NotesEditor({
  mode,
  value = "",
  title = "Notes",
  subtitle = "Capture important details, observations, and follow-up context.",
  placeholder = "Write notes here...",
  minRows = 8,
  maxLength = 3000,
  saveLabel = "Save Notes",
  cancelLabel = "Cancel",
  onSave,
  onCancel,
  disabled = false,
  loading = false,
  showActions = true,
  showCharCount = true,
  autoSaveHint,
  lastUpdatedText,
}: NotesEditorProps) {
  const theme = getTheme(mode);
  const [draft, setDraft] = useState(value);

  const trimmedInitialValue = useMemo(() => value.trim(), [value]);
  const trimmedDraftValue = useMemo(() => draft.trim(), [draft]);

  const isChanged = trimmedDraftValue !== trimmedInitialValue;
  const isOverLimit = draft.length > maxLength;
  const isSaveDisabled =
    disabled || loading || !isChanged || !trimmedDraftValue || isOverLimit;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled || loading) return;
    setDraft(event.target.value);
  };

  const handleSave = () => {
    if (isSaveDisabled || !onSave) return;
    onSave(draft.trim());
  };

  const handleCancel = () => {
    setDraft(value);
    onCancel?.();
  };

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow:
          mode === "dark"
            ? "0 14px 40px rgba(0,0,0,0.24)"
            : "0 14px 40px rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          padding: "22px 24px 18px",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            lineHeight: 1.2,
            color: theme.text,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            lineHeight: 1.6,
            color: theme.subText,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            border: `1px solid ${
              isOverLimit ? (theme.warning ?? "#ef4444") : theme.border
            }`,
            borderRadius: 18,
            background: theme.inputBg ?? theme.cardBgSoft ?? theme.cardBg,
            overflow: "hidden",
          }}
        >
          <textarea
            value={draft}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled || loading}
            rows={minRows}
            style={{
              width: "100%",
              minHeight: minRows * 24,
              resize: "vertical",
              border: "none",
              outline: "none",
              background: "transparent",
              color: theme.text,
              padding: 16,
              fontSize: 14,
              lineHeight: 1.75,
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              padding: "12px 16px",
              borderTop: `1px solid ${theme.borderSoft ?? theme.border}`,
              background:
                mode === "dark"
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(15,23,42,0.02)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {autoSaveHint && (
                <span
                  style={{
                    fontSize: 12.5,
                    color: theme.subText,
                    fontWeight: 600,
                  }}
                >
                  {autoSaveHint}
                </span>
              )}

              {lastUpdatedText && (
                <span
                  style={{
                    fontSize: 12.5,
                    color: theme.mutedText,
                  }}
                >
                  {lastUpdatedText}
                </span>
              )}
            </div>

            {showCharCount && (
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: isOverLimit
                    ? theme.warning ?? "#ef4444"
                    : theme.subText,
                }}
              >
                {draft.length}/{maxLength}
              </span>
            )}
          </div>
        </div>

        {isOverLimit && (
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: theme.warning ?? "#ef4444",
            }}
          >
            Notes exceed the maximum allowed length. Please shorten the content.
          </div>
        )}

        {showActions && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: isChanged ? theme.primary : theme.mutedText,
                fontWeight: 600,
              }}
            >
              {isChanged ? "You have unsaved changes." : "All changes are in sync."}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={handleCancel}
                disabled={disabled || loading}
                style={{
                  height: 42,
                  padding: "0 16px",
                  borderRadius: 12,
                  border: `1px solid ${theme.border}`,
                  background: theme.cardBg,
                  color: disabled || loading ? theme.mutedText : theme.text,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: disabled || loading ? "not-allowed" : "pointer",
                }}
              >
                {cancelLabel}
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaveDisabled}
                style={{
                  height: 42,
                  padding: "0 16px",
                  borderRadius: 12,
                  border: "none",
                  background: theme.primary,
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isSaveDisabled ? "not-allowed" : "pointer",
                  opacity: isSaveDisabled ? 0.65 : 1,
                  boxShadow:
                    mode === "dark"
                      ? "0 10px 24px rgba(37,99,235,0.28)"
                      : "0 10px 24px rgba(37,99,235,0.18)",
                }}
              >
                {loading ? "Saving..." : saveLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}