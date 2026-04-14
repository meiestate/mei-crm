import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type DragEvent,
  type FormEvent,
} from "react";

type ThemeMode = "light" | "dark";

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
  primaryHover: string;
  danger: string;
  success: string;
  warning: string;
  shadow: string;
};

export type AttachmentUploadPayload = {
  files: File[];
  note: string;
};

type Props = {
  open: boolean;
  mode?: ThemeMode;
  title?: string;
  maxFiles?: number;
  maxFileSizeMB?: number;
  acceptedFileTypes?: string[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: AttachmentUploadPayload) => void | Promise<void>;
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
      primaryHover: "#16a34a",
      danger: "#ef4444",
      success: "#10b981",
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
    primaryHover: "#15803d",
    danger: "#dc2626",
    success: "#059669",
    warning: "#d97706",
    shadow: "0 24px 64px rgba(15, 23, 42, 0.18)",
  };
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const getFileExtension = (fileName: string): string => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
};

const fileMatchesAcceptedTypes = (file: File, acceptedFileTypes: string[]): boolean => {
  if (!acceptedFileTypes.length) return true;

  return acceptedFileTypes.some((type) => {
    const normalized = type.trim().toLowerCase();

    if (normalized.startsWith(".")) {
      return file.name.toLowerCase().endsWith(normalized);
    }

    if (normalized.endsWith("/*")) {
      const category = normalized.replace("/*", "");
      return file.type.toLowerCase().startsWith(`${category}/`);
    }

    return file.type.toLowerCase() === normalized;
  });
};

export default function AttachFileModal({
  open,
  mode = "light",
  title = "Attach Files",
  maxFiles = 10,
  maxFileSizeMB = 10,
  acceptedFileTypes = [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".txt",
    ".csv",
  ],
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const theme = useMemo(() => getTheme(mode), [mode]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [note, setNote] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const busy = loading || submitting;
  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

  useEffect(() => {
    if (open) {
      setFiles([]);
      setNote("");
      setErrors([]);
      setDragActive(false);
      setSubmitting(false);
    }
  }, [open]);

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

  const acceptedTypesLabel = acceptedFileTypes.join(", ");

  const addFiles = (incomingFiles: File[]) => {
    const nextErrors: string[] = [];
    const existingKeySet = new Set(
      files.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
    );

    const validNewFiles: File[] = [];

    for (const file of incomingFiles) {
      const key = `${file.name}-${file.size}-${file.lastModified}`;

      if (existingKeySet.has(key)) {
        nextErrors.push(`"${file.name}" is already selected.`);
        continue;
      }

      if (!fileMatchesAcceptedTypes(file, acceptedFileTypes)) {
        nextErrors.push(`"${file.name}" is not an allowed file type.`);
        continue;
      }

      if (file.size > maxFileSizeBytes) {
        nextErrors.push(`"${file.name}" exceeds ${maxFileSizeMB} MB.`);
        continue;
      }

      validNewFiles.push(file);
      existingKeySet.add(key);
    }

    const totalFiles = files.length + validNewFiles.length;
    if (totalFiles > maxFiles) {
      nextErrors.push(`You can attach up to ${maxFiles} files only.`);
      const allowedCount = Math.max(0, maxFiles - files.length);
      setFiles((prev) => [...prev, ...validNewFiles.slice(0, allowedCount)]);
    } else {
      setFiles((prev) => [...prev, ...validNewFiles]);
    }

    setErrors(nextErrors);
  };

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    addFiles(selectedFiles);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (busy) return;

    const droppedFiles = Array.from(event.dataTransfer.files ?? []);
    addFiles(droppedFiles);
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearAllFiles = () => {
    setFiles([]);
    setErrors([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: string[] = [];

    if (files.length === 0) {
      nextErrors.push("Please attach at least one file.");
    }

    if (files.length > maxFiles) {
      nextErrors.push(`Maximum ${maxFiles} files allowed.`);
    }

    setErrors(nextErrors);

    if (nextErrors.length > 0) return;

    try {
      setSubmitting(true);
      await onSubmit({
        files,
        note: note.trim(),
      });
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
    zIndex: 1300,
  };

  const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: 820,
    maxHeight: "92vh",
    overflow: "hidden",
    background: theme.modalBg,
    borderRadius: 22,
    border: `1px solid ${theme.borderSoft}`,
    boxShadow: theme.shadow,
    display: "flex",
    flexDirection: "column",
    color: theme.text,
  };

  const headerStyle: CSSProperties = {
    padding: "20px 24px 16px",
    borderBottom: `1px solid ${theme.borderSoft}`,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  };

  const titleWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
  };

  const modalTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: theme.text,
    letterSpacing: -0.3,
  };

  const subtitleStyle: CSSProperties = {
    margin: 0,
    fontSize: 13,
    color: theme.mutedText,
  };

  const closeButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    color: theme.text,
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.7 : 1,
  };

  const bodyStyle: CSSProperties = {
    padding: 24,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  };

  const dropZoneStyle: CSSProperties = {
    border: `2px dashed ${dragActive ? theme.primary : theme.border}`,
    background: dragActive ? theme.cardBg : theme.inputBg,
    borderRadius: 20,
    padding: "28px 20px",
    textAlign: "center",
    transition: "all 0.2s ease",
    cursor: busy ? "not-allowed" : "pointer",
  };

  const browseButtonStyle: CSSProperties = {
    marginTop: 14,
    border: "none",
    borderRadius: 12,
    background: theme.primary,
    color: "#ffffff",
    padding: "11px 16px",
    fontSize: 14,
    fontWeight: 800,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.7 : 1,
  };

  const hintStyle: CSSProperties = {
    marginTop: 10,
    fontSize: 12,
    color: theme.mutedText,
    lineHeight: 1.5,
  };

  const sectionTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: 15,
    fontWeight: 800,
    color: theme.text,
  };

  const fileListWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  const fileCardStyle: CSSProperties = {
    border: `1px solid ${theme.borderSoft}`,
    background: theme.cardBg,
    borderRadius: 16,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  };

  const fileMetaWrapStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    minWidth: 0,
    flex: 1,
  };

  const fileIconStyle: CSSProperties = {
    minWidth: 46,
    height: 46,
    borderRadius: 14,
    background: theme.inputBg,
    border: `1px solid ${theme.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 900,
    color: theme.primary,
    padding: 8,
    boxSizing: "border-box",
  };

  const fileNameStyle: CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 700,
    color: theme.text,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const fileSubTextStyle: CSSProperties = {
    margin: "4px 0 0",
    fontSize: 12,
    color: theme.mutedText,
  };

  const removeButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.modalBg,
    color: theme.danger,
    borderRadius: 12,
    padding: "9px 12px",
    fontSize: 13,
    fontWeight: 700,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.7 : 1,
  };

  const textAreaWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };

  const labelStyle: CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: theme.subText,
  };

  const textAreaStyle: CSSProperties = {
    width: "100%",
    minHeight: 110,
    resize: "vertical",
    borderRadius: 16,
    border: `1px solid ${theme.border}`,
    background: theme.inputBg,
    color: theme.text,
    padding: "14px 16px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const errorBoxStyle: CSSProperties = {
    border: `1px solid rgba(220, 38, 38, 0.2)`,
    background: theme.mode === "dark" ? "rgba(127, 29, 29, 0.18)" : "#fef2f2",
    color: theme.danger,
    borderRadius: 16,
    padding: "12px 14px",
    fontSize: 13,
    lineHeight: 1.6,
  };

  const footerStyle: CSSProperties = {
    padding: "16px 24px 22px",
    borderTop: `1px solid ${theme.borderSoft}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  };

  const footerMetaStyle: CSSProperties = {
    fontSize: 13,
    color: theme.mutedText,
    fontWeight: 600,
  };

  const footerButtonWrapStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  };

  const secondaryButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    color: theme.text,
    borderRadius: 14,
    padding: "12px 18px",
    fontSize: 14,
    fontWeight: 700,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.7 : 1,
  };

  const dangerGhostButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.modalBg,
    color: theme.danger,
    borderRadius: 14,
    padding: "12px 18px",
    fontSize: 14,
    fontWeight: 700,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.7 : 1,
  };

  const primaryButtonStyle: CSSProperties = {
    border: "none",
    background: theme.primary,
    color: "#ffffff",
    borderRadius: 14,
    padding: "12px 18px",
    fontSize: 14,
    fontWeight: 800,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.8 : 1,
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
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div style={headerStyle}>
          <div style={titleWrapStyle}>
            <h2 style={modalTitleStyle}>{title}</h2>
            <p style={subtitleStyle}>
              Upload documents, images, contracts, invoices, or other supporting files.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            style={closeButtonStyle}
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div style={bodyStyle}>
            <div
              style={dropZoneStyle}
              onDragOver={(event) => {
                event.preventDefault();
                if (!busy) setDragActive(true);
              }}
              onDragEnter={(event) => {
                event.preventDefault();
                if (!busy) setDragActive(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setDragActive(false);
              }}
              onDrop={handleDrop}
              onClick={() => {
                if (!busy) {
                  inputRef.current?.click();
                }
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: theme.text,
                  marginBottom: 8,
                }}
              >
                Drag & drop files here
              </div>

              <div
                style={{
                  fontSize: 14,
                  color: theme.subText,
                }}
              >
                or click below to browse from your device
              </div>

              <button
                type="button"
                style={browseButtonStyle}
                onClick={(event) => {
                  event.stopPropagation();
                  inputRef.current?.click();
                }}
                disabled={busy}
              >
                Browse Files
              </button>

              <div style={hintStyle}>
                Max {maxFiles} files • Up to {maxFileSizeMB} MB each
                <br />
                Allowed: {acceptedTypesLabel}
              </div>

              <input
                ref={inputRef}
                type="file"
                multiple
                onChange={handleFileInput}
                style={{ display: "none" }}
                accept={acceptedFileTypes.join(",")}
                disabled={busy}
              />
            </div>

            {errors.length > 0 ? (
              <div style={errorBoxStyle}>
                {errors.map((error, index) => (
                  <div key={`${error}-${index}`}>• {error}</div>
                ))}
              </div>
            ) : null}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <h3 style={sectionTitleStyle}>Selected Files</h3>
              {files.length > 0 ? (
                <button
                  type="button"
                  onClick={clearAllFiles}
                  disabled={busy}
                  style={dangerGhostButtonStyle}
                >
                  Clear All
                </button>
              ) : null}
            </div>

            {files.length === 0 ? (
              <div
                style={{
                  border: `1px solid ${theme.borderSoft}`,
                  background: theme.cardBg,
                  borderRadius: 16,
                  padding: "20px 16px",
                  color: theme.mutedText,
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                No files selected yet.
              </div>
            ) : (
              <div style={fileListWrapStyle}>
                {files.map((file, index) => (
                  <div key={`${file.name}-${file.size}-${file.lastModified}`} style={fileCardStyle}>
                    <div style={fileMetaWrapStyle}>
                      <div style={fileIconStyle}>{getFileExtension(file.name)}</div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={fileNameStyle} title={file.name}>
                          {file.name}
                        </p>
                        <p style={fileSubTextStyle}>
                          {formatFileSize(file.size)} • {file.type || "Unknown type"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={busy}
                      style={removeButtonStyle}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={textAreaWrapStyle}>
              <label htmlFor="attachment-note" style={labelStyle}>
                Attachment Note
              </label>
              <textarea
                id="attachment-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Add a short note about these attachments..."
                style={textAreaStyle}
                disabled={busy}
              />
            </div>
          </div>

          <div style={footerStyle}>
            <div style={footerMetaStyle}>
              {files.length} / {maxFiles} file{maxFiles === 1 ? "" : "s"} selected
            </div>

            <div style={footerButtonWrapStyle}>
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>

              <button type="submit" disabled={busy} style={primaryButtonStyle}>
                {busy ? "Uploading..." : "Attach Files"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}