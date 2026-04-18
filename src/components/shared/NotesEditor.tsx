import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { getTheme } from "../../theme";

type ThemeMode = "light" | "dark";

export interface NotesEditorProps {
  value?: string;
  initialValue?: string;
  mode?: ThemeMode;
  placeholder?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  minRows?: number;
  maxLength?: number;
  showToolbar?: boolean;
  showCharacterCount?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void | Promise<void>;
  onCancel?: () => void;
  className?: string;
}

const NotesEditor: React.FC<NotesEditorProps> = ({
  value,
  initialValue = "",
  mode = "light",
  placeholder = "Write an internal note, customer context, follow-up summary, or key discussion points...",
  label = "Notes",
  helperText,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  minRows = 8,
  maxLength = 5000,
  showToolbar = true,
  showCharacterCount = true,
  saveLabel = "Save Note",
  cancelLabel = "Cancel",
  onChange,
  onSave,
  onCancel,
  className,
}) => {
  const theme = useMemo(() => getTheme(mode), [mode]);
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<string>(
    isControlled ? value ?? "" : initialValue
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const currentValue = isControlled ? value ?? "" : internalValue;
  const trimmedValue = currentValue.trim();
  const hasContent = trimmedValue.length > 0;
  const isDirty = (isControlled ? value ?? "" : internalValue) !== initialValue;

  useEffect(() => {
    if (isControlled) return;
    setInternalValue(initialValue);
  }, [initialValue, isControlled]);

  useEffect(() => {
    if (autoFocus && textareaRef.current && !disabled && !readOnly) {
      textareaRef.current.focus();
    }
  }, [autoFocus, disabled, readOnly]);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    resizeTextarea();
  }, [currentValue]);

  const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue =
      maxLength > 0
        ? event.target.value.slice(0, maxLength)
        : event.target.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleInsertAtCursor = (before: string, after = "") => {
    if (disabled || readOnly) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? currentValue.length;
    const end = textarea.selectionEnd ?? currentValue.length;

    const nextValue =
      currentValue.slice(0, start) +
      before +
      currentValue.slice(start, end) +
      after +
      currentValue.slice(end);

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPosition = start + before.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
      resizeTextarea();
    });
  };

  const handleSave = async () => {
    if (disabled || readOnly || !hasContent || isSaving) return;

    try {
      setIsSaving(true);
      await onSave?.(trimmedValue);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!isControlled) {
      setInternalValue(initialValue);
    }
    onCancel?.();
  };

  const cardStyle: React.CSSProperties = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: 16,
    boxShadow:
      mode === "dark"
        ? "0 10px 24px rgba(0,0,0,0.28)"
        : "0 10px 30px rgba(15, 23, 42, 0.08)",
    overflow: "hidden",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "14px 16px",
    borderBottom: `1px solid ${theme.borderSoft ?? theme.border}`,
    background: theme.cardBgSoft ?? theme.sectionBg ?? theme.cardBg,
  };

  const labelStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    color: theme.text,
    letterSpacing: 0.2,
  };

  const helperTextStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 12,
    color: theme.subText,
  };

  const toolbarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    padding: "12px 16px 0 16px",
  };

  const editorWrapStyle: React.CSSProperties = {
    padding: 16,
  };

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    minHeight: `${minRows * 24}px`,
    resize: "none",
    borderRadius: 14,
    border: `1px solid ${
      isFocused ? theme.primary : theme.borderStrong ?? theme.border
    }`,
    outline: "none",
    padding: "14px 15px",
    fontSize: 14,
    lineHeight: 1.7,
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: theme.text,
    background: disabled
      ? theme.sectionBg ?? theme.cardBgSoft ?? theme.cardBg
      : theme.inputBg ?? theme.cardBg,
    transition: "all 0.2s ease",
    boxShadow: isFocused
      ? `0 0 0 3px ${theme.primary}22`
      : "0 0 0 0 rgba(0,0,0,0)",
  };

  const footerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 16px 16px 16px",
  };

  const secondaryTextStyle: React.CSSProperties = {
    fontSize: 12,
    color: theme.mutedText ?? theme.subText,
  };

  const baseButtonStyle: React.CSSProperties = {
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    outline: "none",
  };

  const ghostButtonStyle: React.CSSProperties = {
    ...baseButtonStyle,
    background: "transparent",
    color: theme.text,
    border: `1px solid ${theme.border}`,
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...baseButtonStyle,
    background: disabled || !hasContent ? `${theme.primary}88` : theme.primary,
    color: theme.inverseText ?? "#ffffff",
    border: `1px solid ${theme.primary}`,
    boxShadow:
      disabled || !hasContent
        ? "none"
        : mode === "dark"
        ? "0 8px 20px rgba(0,0,0,0.28)"
        : "0 10px 24px rgba(37, 99, 235, 0.22)",
  };

  const toolbarButtonStyle: React.CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft ?? theme.sectionBg ?? theme.cardBg,
    color: theme.text,
    borderRadius: 10,
    padding: "8px 10px",
    fontSize: 12,
    fontWeight: 600,
    cursor: disabled || readOnly ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <div className={className} style={cardStyle}>
      <div style={headerStyle}>
        <div style={{ display: "grid", gap: 4 }}>
          <h3 style={labelStyle}>{label}</h3>
          {helperText ? <p style={helperTextStyle}>{helperText}</p> : null}
        </div>

        {showCharacterCount ? (
          <span style={secondaryTextStyle}>
            {currentValue.length}
            {maxLength > 0 ? ` / ${maxLength}` : ""}
          </span>
        ) : null}
      </div>

      {showToolbar ? (
        <div style={toolbarStyle}>
          <button
            type="button"
            style={toolbarButtonStyle}
            onClick={() => handleInsertAtCursor("• ")}
            disabled={disabled || readOnly}
            aria-label="Insert bullet"
            title="Insert bullet"
          >
            • Bullet
          </button>

          <button
            type="button"
            style={toolbarButtonStyle}
            onClick={() => handleInsertAtCursor("✅ ")}
            disabled={disabled || readOnly}
            aria-label="Insert checklist"
            title="Insert checklist"
          >
            ✅ Checklist
          </button>

          <button
            type="button"
            style={toolbarButtonStyle}
            onClick={() => handleInsertAtCursor("📌 ")}
            disabled={disabled || readOnly}
            aria-label="Insert highlight"
            title="Insert highlight"
          >
            📌 Highlight
          </button>

          <button
            type="button"
            style={toolbarButtonStyle}
            onClick={() =>
              handleInsertAtCursor(
                `\nFollow-up:\n- Owner:\n- Due date:\n- Status:\n`
              )
            }
            disabled={disabled || readOnly}
            aria-label="Insert follow-up template"
            title="Insert follow-up template"
          >
            Follow-up Template
          </button>
        </div>
      ) : null}

      <div style={editorWrapStyle}>
        <textarea
          ref={textareaRef}
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength > 0 ? maxLength : undefined}
          onChange={handleValueChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={textareaStyle}
          rows={minRows}
        />
      </div>

      <div style={footerStyle}>
        <div style={secondaryTextStyle}>
          {hasContent
            ? isDirty
              ? "Unsaved changes"
              : "Ready"
            : "Add a note to keep context clear for the team"}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onCancel ? (
            <button
              type="button"
              style={ghostButtonStyle}
              onClick={handleCancel}
              disabled={disabled || isSaving}
            >
              {cancelLabel}
            </button>
          ) : null}

          <button
            type="button"
            style={primaryButtonStyle}
            onClick={handleSave}
            disabled={disabled || readOnly || !hasContent || isSaving}
          >
            {isSaving ? "Saving..." : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesEditor;