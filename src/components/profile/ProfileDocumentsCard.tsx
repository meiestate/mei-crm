import type { CSSProperties, ReactNode } from "react";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

export type ProfileDocumentItem = {
  id: string;
  name: string;
  category?: ReactNode;
  uploadedAt?: ReactNode;
  size?: ReactNode;
  meta?: ReactNode;
  onPreview?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
};

type ProfileDocumentsCardProps = {
  mode?: ThemeMode;
  title?: string;
  subtitle?: string;
  items: ProfileDocumentItem[];
  actionLabel?: string;
  onUpload?: () => void;
  footer?: ReactNode;
  emptyMessage?: string;
  previewLabel?: string;
  downloadLabel?: string;
  deleteLabel?: string;
};

export default function ProfileDocumentsCard({
  mode = "light",
  title = "Documents",
  subtitle = "Important profile-related files, records, and uploaded attachments.",
  items,
  actionLabel = "Upload Document",
  onUpload,
  footer,
  emptyMessage = "No profile documents available.",
  previewLabel = "Preview",
  downloadLabel = "Download",
  deleteLabel = "Delete",
}: ProfileDocumentsCardProps) {
  const theme = getTheme(mode);
  const showUploadAction = typeof onUpload === "function";
  const hasItems = items.length > 0;

  const cardStyle: CSSProperties = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: 20,
    padding: 20,
    boxShadow:
      mode === "dark"
        ? "0 10px 30px rgba(0,0,0,0.28)"
        : "0 10px 30px rgba(15, 23, 42, 0.08)",
  };

  const headerWrapStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 16,
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: theme.text,
    letterSpacing: 0.2,
    lineHeight: 1.3,
  };

  const subtitleStyle: CSSProperties = {
    margin: "6px 0 0",
    color: theme.subText,
    fontSize: 13,
    lineHeight: 1.6,
    maxWidth: 760,
  };

  const actionButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.text,
    minHeight: 40,
    padding: "0 14px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  };

  const listWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  const rowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    flexWrap: "wrap",
  };

  const docLeftStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "44px minmax(0, 1fr)",
    gap: 12,
    alignItems: "start",
    flex: "1 1 280px",
    minWidth: 0,
  };

  const iconWrapStyle: CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: 14,
    border: `1px solid ${theme.border}`,
    background: mode === "dark" ? theme.cardBg : "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.primary,
    fontSize: 16,
    fontWeight: 900,
    flexShrink: 0,
  };

  const fileNameStyle: CSSProperties = {
    color: theme.text,
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.5,
    wordBreak: "break-word",
  };

  const metaStyle: CSSProperties = {
    marginTop: 4,
    color: theme.subText,
    fontSize: 12,
    lineHeight: 1.65,
    wordBreak: "break-word",
  };

  const actionsWrapStyle: CSSProperties = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    flex: "0 1 auto",
  };

  const smallButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: mode === "dark" ? theme.cardBg : "#FFFFFF",
    color: theme.text,
    minHeight: 36,
    padding: "0 12px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  };

  const deleteButtonStyle: CSSProperties = {
    ...smallButtonStyle,
    color: "#DC2626",
    border: "1px solid #FCA5A5",
    background: mode === "dark" ? "rgba(127,29,29,0.16)" : "#FFF1F2",
  };

  const emptyStateStyle: CSSProperties = {
    padding: "16px 14px",
    borderRadius: 14,
    border: `1px dashed ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.subText,
    fontSize: 14,
    lineHeight: 1.7,
  };

  const footerStyle: CSSProperties = {
    marginTop: 18,
    paddingTop: 18,
    borderTop: `1px solid ${theme.borderSoft}`,
  };

  return (
    <section style={cardStyle}>
      <div style={headerWrapStyle}>
        <div style={{ minWidth: 0, flex: "1 1 420px" }}>
          <h3 style={titleStyle}>{title}</h3>
          <p style={subtitleStyle}>{subtitle}</p>
        </div>

        {showUploadAction ? (
          <button type="button" style={actionButtonStyle} onClick={onUpload}>
            {actionLabel}
          </button>
        ) : null}
      </div>

      {hasItems ? (
        <div style={listWrapStyle}>
          {items.map((item) => {
            const metaText =
              item.meta ||
              [item.category, item.uploadedAt, item.size]
                .filter(Boolean)
                .map((value) => String(value))
                .join(" • ");

            return (
              <div key={item.id} style={rowStyle}>
                <div style={docLeftStyle}>
                  <div style={iconWrapStyle}>{getDocumentIcon(item.name)}</div>

                  <div style={{ minWidth: 0 }}>
                    <div style={fileNameStyle}>{item.name}</div>
                    {metaText ? <div style={metaStyle}>{metaText}</div> : null}
                  </div>
                </div>

                <div style={actionsWrapStyle}>
                  {item.onPreview ? (
                    <button
                      type="button"
                      style={smallButtonStyle}
                      onClick={item.onPreview}
                    >
                      {previewLabel}
                    </button>
                  ) : null}

                  {item.onDownload ? (
                    <button
                      type="button"
                      style={smallButtonStyle}
                      onClick={item.onDownload}
                    >
                      {downloadLabel}
                    </button>
                  ) : null}

                  {item.onDelete ? (
                    <button
                      type="button"
                      style={deleteButtonStyle}
                      onClick={item.onDelete}
                    >
                      {deleteLabel}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={emptyStateStyle}>{emptyMessage}</div>
      )}

      {footer ? <div style={footerStyle}>{footer}</div> : null}
    </section>
  );
}

function getDocumentIcon(fileName: string) {
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith(".pdf")) return "PDF";
  if (
    lowerName.endsWith(".png") ||
    lowerName.endsWith(".jpg") ||
    lowerName.endsWith(".jpeg") ||
    lowerName.endsWith(".webp") ||
    lowerName.endsWith(".svg")
  ) {
    return "IMG";
  }
  if (
    lowerName.endsWith(".doc") ||
    lowerName.endsWith(".docx") ||
    lowerName.endsWith(".txt")
  ) {
    return "DOC";
  }
  if (
    lowerName.endsWith(".xls") ||
    lowerName.endsWith(".xlsx") ||
    lowerName.endsWith(".csv")
  ) {
    return "XLS";
  }

  return "FILE";
}