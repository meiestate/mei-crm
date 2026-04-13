import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

export type UploadAvatarFormValues = {
  avatarUrl: string;
  file?: File | null;
};

type UploadAvatarModalProps = {
  mode?: ThemeMode;
  open: boolean;
  title?: string;
  subtitle?: string;
  initialAvatarUrl?: string;
  saveLabel?: string;
  cancelLabel?: string;
  removeLabel?: string;
  uploadLabel?: string;
  useUrlLabel?: string;
  onClose: () => void;
  onSave: (values: UploadAvatarFormValues) => void;
  onRemove?: () => void;
};

export default function UploadAvatarModal({
  mode = "light",
  open,
  title = "Upload Profile Photo",
  subtitle = "Refresh the profile image to keep identity clear, polished, and instantly recognizable across the workspace.",
  initialAvatarUrl = "",
  saveLabel = "Save Photo",
  cancelLabel = "Cancel",
  removeLabel = "Remove Photo",
  uploadLabel = "Choose Image",
  useUrlLabel = "Image URL",
  onClose,
  onSave,
  onRemove,
}: UploadAvatarModalProps) {
  const theme = getTheme(mode);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialAvatarUrl);

  useEffect(() => {
    if (open) {
      setAvatarUrl(initialAvatarUrl);
      setSelectedFile(null);
      setPreviewUrl(initialAvatarUrl);
    }
  }, [initialAvatarUrl, open]);

  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const isDirty = useMemo(() => {
    return avatarUrl !== initialAvatarUrl || !!selectedFile;
  }, [avatarUrl, initialAvatarUrl, selectedFile]);

  const hasPreview = !!previewUrl;
  const canSave = isDirty && (!!selectedFile || avatarUrl.trim().length > 0 || previewUrl === "");

  if (!open) {
    return null;
  }

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: mode === "dark" ? "rgba(2,6,23,0.72)" : "rgba(15,23,42,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 1000,
  };

  const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: 760,
    maxHeight: "90vh",
    overflow: "auto",
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: 24,
    boxShadow:
      mode === "dark"
        ? "0 24px 80px rgba(0,0,0,0.45)"
        : "0 24px 80px rgba(15,23,42,0.16)",
  };

  const headerStyle: CSSProperties = {
    padding: "22px 22px 18px",
    borderBottom: `1px solid ${theme.borderSoft}`,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    color: theme.text,
    fontSize: 22,
    fontWeight: 900,
    lineHeight: 1.25,
  };

  const subtitleStyle: CSSProperties = {
    margin: "8px 0 0",
    color: theme.subText,
    fontSize: 14,
    lineHeight: 1.7,
    maxWidth: 580,
  };

  const closeButtonStyle: CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.text,
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
    flexShrink: 0,
  };

  const bodyStyle: CSSProperties = {
    padding: 22,
    display: "grid",
    gridTemplateColumns: "minmax(260px, 320px) minmax(0, 1fr)",
    gap: 20,
  };

  const sectionCardStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    borderRadius: 18,
    padding: 18,
  };

  const sectionTitleStyle: CSSProperties = {
    margin: 0,
    color: theme.text,
    fontSize: 16,
    fontWeight: 800,
    lineHeight: 1.3,
  };

  const sectionTextStyle: CSSProperties = {
    margin: "6px 0 0",
    color: theme.subText,
    fontSize: 13,
    lineHeight: 1.65,
  };

  const previewWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    alignItems: "center",
  };

  const avatarFrameStyle: CSSProperties = {
    width: 180,
    height: 180,
    borderRadius: 28,
    border: `1px solid ${theme.border}`,
    background:
      mode === "dark"
        ? "linear-gradient(135deg, #1e293b, #334155)"
        : "linear-gradient(135deg, #dbeafe, #e0f2fe)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    boxShadow:
      mode === "dark"
        ? "inset 0 0 0 1px rgba(255,255,255,0.04)"
        : "inset 0 0 0 1px rgba(255,255,255,0.6)",
  };

  const previewImageStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const initialsStyle: CSSProperties = {
    color: theme.text,
    fontSize: 38,
    fontWeight: 900,
    letterSpacing: 1,
  };

  const previewMetaStyle: CSSProperties = {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: `1px solid ${theme.border}`,
    background: mode === "dark" ? theme.cardBg : "#FFFFFF",
  };

  const previewMetaLabelStyle: CSSProperties = {
    fontSize: 12,
    color: theme.mutedText,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.35,
    lineHeight: 1.5,
  };

  const previewMetaValueStyle: CSSProperties = {
    marginTop: 6,
    color: theme.text,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.6,
    wordBreak: "break-word",
  };

  const fieldWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 16,
  };

  const labelStyle: CSSProperties = {
    color: theme.mutedText,
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.35,
    lineHeight: 1.5,
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    minHeight: 46,
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: mode === "dark" ? theme.cardBg : "#FFFFFF",
    color: theme.text,
    padding: "0 14px",
    fontSize: 14,
    fontWeight: 500,
    outline: "none",
    boxSizing: "border-box",
  };

  const helperTextStyle: CSSProperties = {
    color: theme.subText,
    fontSize: 12,
    lineHeight: 1.6,
  };

  const actionRowStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  };

  const buttonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.text,
    minHeight: 40,
    padding: "0 14px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  };

  const removeButtonStyle: CSSProperties = {
    ...buttonStyle,
    color: "#DC2626",
    border: "1px solid #FCA5A5",
    background: mode === "dark" ? "rgba(127,29,29,0.18)" : "#FFF1F2",
  };

  const noteBoxStyle: CSSProperties = {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    border: `1px solid ${theme.border}`,
    background: mode === "dark" ? theme.cardBg : "#FFFFFF",
  };

  const noteTitleStyle: CSSProperties = {
    margin: 0,
    color: theme.text,
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.5,
  };

  const noteTextStyle: CSSProperties = {
    margin: "4px 0 0",
    color: theme.subText,
    fontSize: 12,
    lineHeight: 1.65,
  };

  const footerStyle: CSSProperties = {
    padding: "18px 22px 22px",
    borderTop: `1px solid ${theme.borderSoft}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  };

  const footerHelperTextStyle: CSSProperties = {
    color: theme.subText,
    fontSize: 13,
    lineHeight: 1.6,
  };

  const footerActionsStyle: CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  };

  const secondaryButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.text,
    minHeight: 42,
    padding: "0 16px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  };

  const primaryButtonStyle: CSSProperties = {
    ...secondaryButtonStyle,
    border: `1px solid ${theme.primary}`,
    background: theme.primary,
    color: theme.inverseText,
    opacity: canSave ? 1 : 0.65,
    cursor: canSave ? "pointer" : "not-allowed",
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      setAvatarUrl("");
    }
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAvatarUrl(value);
    setSelectedFile(null);
    setPreviewUrl(value.trim());
  };

  const handleRemovePhoto = () => {
    setAvatarUrl("");
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  };

  const handleSave = () => {
    if (!canSave) return;

    onSave({
      avatarUrl: avatarUrl.trim(),
      file: selectedFile,
    });
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={modalStyle} onClick={handleModalClick}>
        <div style={headerStyle}>
          <div style={{ minWidth: 0, flex: "1 1 auto" }}>
            <h2 style={titleStyle}>{title}</h2>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>

          <button type="button" style={closeButtonStyle} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={bodyStyle}>
          <section style={sectionCardStyle}>
            <h3 style={sectionTitleStyle}>Live Preview</h3>
            <p style={sectionTextStyle}>
              This is how the profile photo will feel inside the workspace.
            </p>

            <div style={{ marginTop: 18, ...previewWrapStyle }}>
              <div style={avatarFrameStyle}>
                {hasPreview ? (
                  <img src={previewUrl} alt="Avatar preview" style={previewImageStyle} />
                ) : (
                  <span style={initialsStyle}>MEI</span>
                )}
              </div>

              <div style={previewMetaStyle}>
                <div style={previewMetaLabelStyle}>Preview Source</div>
                <div style={previewMetaValueStyle}>
                  {selectedFile
                    ? `${selectedFile.name} • ${formatBytes(selectedFile.size)}`
                    : previewUrl
                    ? previewUrl
                    : "No image selected"}
                </div>
              </div>
            </div>
          </section>

          <section style={sectionCardStyle}>
            <h3 style={sectionTitleStyle}>Update Photo</h3>
            <p style={sectionTextStyle}>
              Upload a local image or paste a direct image URL. A crisp square image
              usually looks the cleanest.
            </p>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>{useUrlLabel}</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={handleUrlChange}
                style={inputStyle}
                placeholder="https://example.com/profile-photo.png"
              />
              <div style={helperTextStyle}>
                Pasting an image URL clears any locally selected file preview.
              </div>
            </div>

            <div style={actionRowStyle}>
              <button type="button" style={buttonStyle} onClick={triggerFileSelect}>
                {uploadLabel}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {(hasPreview || initialAvatarUrl) && (
                <button type="button" style={removeButtonStyle} onClick={handleRemovePhoto}>
                  {removeLabel}
                </button>
              )}
            </div>

            <div style={noteBoxStyle}>
              <p style={noteTitleStyle}>Recommended image style</p>
              <p style={noteTextStyle}>
                Use a clear front-facing image, strong lighting, and minimal background
                clutter for a more premium professional look.
              </p>
            </div>
          </section>
        </div>

        <div style={footerStyle}>
          <div style={footerHelperTextStyle}>
            {isDirty
              ? "You have unsaved photo changes."
              : "No changes yet. Choose an image or paste a URL to continue."}
          </div>

          <div style={footerActionsStyle}>
            <button type="button" style={secondaryButtonStyle} onClick={onClose}>
              {cancelLabel}
            </button>
            <button
              type="button"
              style={primaryButtonStyle}
              onClick={handleSave}
              disabled={!canSave}
            >
              {saveLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}