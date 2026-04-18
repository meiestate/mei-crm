import React, { memo, useMemo } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Eye,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType2,
  Files,
  FileVideo,
  FolderOpen,
  Link2,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  User2,
} from "lucide-react";

type RelatedFileType =
  | "pdf"
  | "doc"
  | "docx"
  | "xls"
  | "xlsx"
  | "csv"
  | "ppt"
  | "pptx"
  | "jpg"
  | "jpeg"
  | "png"
  | "zip"
  | "mp4"
  | "txt"
  | "other";

type RelatedFileStatus = "active" | "processing" | "archived" | "restricted";

export type RelatedFileItem = {
  id: string;
  name: string;
  type?: RelatedFileType;
  size?: string;
  status?: RelatedFileStatus;
  uploadedBy?: string;
  uploadedAt?: string;
  linkedTo?: string;
  description?: string;
  version?: string;
  secure?: boolean;
  downloadUrl?: string;
  previewUrl?: string;
};

type Props = {
  files?: RelatedFileItem[];
  loading?: boolean;
  empty?: boolean;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  actionLabel?: string;
  maxVisible?: number;
  className?: string;
  onOpenFile?: (file: RelatedFileItem) => void;
  onPreviewFile?: (file: RelatedFileItem) => void;
  onDownloadFile?: (file: RelatedFileItem) => void;
  onDeleteFile?: (file: RelatedFileItem) => void;
  onViewAll?: () => void;
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  borderRadius: 24,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  position: "relative",
  padding: 20,
  borderBottom: "1px solid #e2e8f0",
  background:
    "linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(239,246,255,1) 55%, rgba(255,255,255,1) 100%)",
};

const glowStyle: React.CSSProperties = {
  position: "absolute",
  right: -34,
  top: -40,
  width: 180,
  height: 180,
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0) 72%)",
  pointerEvents: "none",
};

const headerRowStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 14,
  flexWrap: "wrap",
};

const titleWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
  flex: 1,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.03em",
  lineHeight: 1.2,
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1.6,
};

const topBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 800,
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  color: "#1d4ed8",
};

const bodyStyle: React.CSSProperties = {
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 12,
};

const summaryItemStyle: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  padding: "14px 15px",
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
};

const summaryLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const summaryValueStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1,
  letterSpacing: "-0.03em",
};

const summaryHelperStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.6,
};

const listWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const fileItemStyle: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const fileTopRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const fileMainInfoStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  minWidth: 0,
  flex: 1,
};

const fileIconWrapStyle: React.CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 14,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  flexShrink: 0,
};

const fileTextWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
  minWidth: 0,
  flex: 1,
};

const fileNameStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: "#0f172a",
  lineHeight: 1.5,
  letterSpacing: "-0.02em",
  wordBreak: "break-word",
};

const fileDescStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.7,
  wordBreak: "break-word",
};

const chipsWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const metaGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 10,
};

const metaItemStyle: React.CSSProperties = {
  borderRadius: 14,
  background: "#f8fafc",
  border: "1px solid #edf2f7",
  padding: "10px 12px",
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  minWidth: 0,
};

const metaTextWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  minWidth: 0,
};

const metaLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const metaValueStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#0f172a",
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const fileActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const helperTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.7,
};

const actionGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const secondaryButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #dbe3ef",
  background: "#ffffff",
  color: "#334155",
  borderRadius: 12,
  padding: "10px 14px",
  fontSize: 12,
  fontWeight: 800,
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  cursor: "pointer",
};

const primaryButtonStyle: React.CSSProperties = {
  ...secondaryButtonStyle,
  background: "#2563eb",
  color: "#ffffff",
  border: "1px solid #2563eb",
  boxShadow: "0 12px 24px rgba(37, 99, 235, 0.16)",
};

const dangerButtonStyle: React.CSSProperties = {
  ...secondaryButtonStyle,
  color: "#b91c1c",
  border: "1px solid #fecaca",
  background: "#fffafa",
};

const footerStyle: React.CSSProperties = {
  padding: "0 20px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const emptyStateStyle: React.CSSProperties = {
  padding: 28,
  margin: 20,
  borderRadius: 18,
  border: "1px dashed #cbd5e1",
  background: "#f8fafc",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  textAlign: "center",
};

const skeletonStyle: React.CSSProperties = {
  borderRadius: 12,
  background:
    "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)",
  backgroundSize: "200% 100%",
  animation: "relatedFilesCardPulse 1.4s ease-in-out infinite",
};

function RelatedFilesCard({
  files,
  loading = false,
  empty = false,
  title = "Related Files",
  subtitle = "Keep brochures, agreements, legal docs, price sheets, and media assets linked to the record in one clean place.",
  emptyTitle = "No files linked yet",
  emptyDescription = "Upload brochures, agreements, photos, legal documents, and supporting files to build context around this record.",
  actionLabel = "View All Files",
  maxVisible = 4,
  className,
  onOpenFile,
  onPreviewFile,
  onDownloadFile,
  onDeleteFile,
  onViewAll,
}: Props) {
  const safeFiles = useMemo<RelatedFileItem[]>(() => {
    if (files?.length) return files;

    return [
      {
        id: "file-001",
        name: "Whitefield Premium Plot - Brochure.pdf",
        type: "pdf",
        size: "4.8 MB",
        status: "active",
        uploadedBy: "Arjun Raj",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        linkedTo: "Whitefield Premium Plot",
        description: "Latest project brochure with amenities, pricing overview, and master plan.",
        version: "v3.2",
        secure: true,
      },
      {
        id: "file-002",
        name: "Client Cost Sheet April.xlsx",
        type: "xlsx",
        size: "780 KB",
        status: "active",
        uploadedBy: "Vikram",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
        linkedTo: "Ramesh Kumar Lead",
        description: "Updated cost sheet with registration, GST, and loan estimate.",
        version: "v1.4",
      },
      {
        id: "file-003",
        name: "Site Visit Photos.zip",
        type: "zip",
        size: "22.6 MB",
        status: "processing",
        uploadedBy: "Priya",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
        linkedTo: "Sarjapur Layout Opportunity",
        description: "Compressed bundle of site visuals and locality snapshots.",
      },
      {
        id: "file-004",
        name: "Draft Sale Agreement.docx",
        type: "docx",
        size: "1.2 MB",
        status: "restricted",
        uploadedBy: "Legal Desk",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 39).toISOString(),
        linkedTo: "North Bengaluru Villa Deal",
        description: "Internal legal draft. Restricted access for compliance review.",
        secure: true,
        version: "Draft 02",
      },
    ];
  }, [files]);

  const visibleFiles = safeFiles.slice(0, Math.max(1, maxVisible));
  const secureCount = safeFiles.filter((file) => file.secure).length;
  const restrictedCount = safeFiles.filter((file) => file.status === "restricted").length;
  const processingCount = safeFiles.filter((file) => file.status === "processing").length;

  if (loading) {
    return (
      <div className={className} style={cardStyle}>
        <style>
          {`
            @keyframes relatedFilesCardPulse {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }

            @media (max-width: 900px) {
              .related-files-summary-grid {
                grid-template-columns: 1fr !important;
              }

              .related-files-meta-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>

        <div style={headerStyle}>
          <div style={glowStyle} />
          <div style={headerRowStyle}>
            <div style={titleWrapStyle}>
              <div style={{ ...skeletonStyle, height: 22, width: 180 }} />
              <div style={{ ...skeletonStyle, height: 14, width: 280 }} />
            </div>
          </div>
        </div>

        <div style={bodyStyle}>
          <div className="related-files-summary-grid" style={summaryGridStyle}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} style={summaryItemStyle}>
                <div style={{ ...skeletonStyle, height: 10, width: 70 }} />
                <div style={{ ...skeletonStyle, height: 24, width: 56 }} />
                <div style={{ ...skeletonStyle, height: 12, width: "80%" }} />
              </div>
            ))}
          </div>

          <div style={listWrapStyle}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} style={fileItemStyle}>
                <div style={{ ...skeletonStyle, height: 18, width: "56%" }} />
                <div style={{ ...skeletonStyle, height: 12, width: "100%" }} />
                <div className="related-files-meta-grid" style={metaGridStyle}>
                  <div style={{ ...skeletonStyle, height: 48, width: "100%" }} />
                  <div style={{ ...skeletonStyle, height: 48, width: "100%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (empty || safeFiles.length === 0) {
    return (
      <div className={className} style={cardStyle}>
        <div style={headerStyle}>
          <div style={glowStyle} />
          <div style={headerRowStyle}>
            <div style={titleWrapStyle}>
              <h3 style={titleStyle}>{title}</h3>
              <p style={subtitleStyle}>{subtitle}</p>
            </div>
          </div>
        </div>

        <div style={emptyStateStyle}>
          <UploadCloud size={24} color="#2563eb" />
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
            {emptyTitle}
          </div>
          <div style={helperTextStyle}>{emptyDescription}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={cardStyle}>
      <style>
        {`
          @media (max-width: 900px) {
            .related-files-summary-grid {
              grid-template-columns: 1fr !important;
            }

            .related-files-meta-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div style={headerStyle}>
        <div style={glowStyle} />
        <div style={headerRowStyle}>
          <div style={titleWrapStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>

          <div style={topBadgeStyle}>
            <Sparkles size={14} />
            File Intelligence
          </div>
        </div>
      </div>

      <div style={bodyStyle}>
        <div className="related-files-summary-grid" style={summaryGridStyle}>
          <SummaryItem
            label="Files"
            value={String(safeFiles.length)}
            helper="Linked to this record"
          />
          <SummaryItem
            label="Secure"
            value={String(secureCount)}
            helper="Protected documents"
          />
          <SummaryItem
            label="Processing"
            value={String(processingCount)}
            helper={
              processingCount > 0 ? "Still being prepared" : "All files ready to use"
            }
          />
        </div>

        <div style={listWrapStyle}>
          {visibleFiles.map((file) => {
            const fileMeta = getFileTypeMeta(file.type);
            const statusMeta = getStatusMeta(file.status);

            return (
              <div key={file.id} style={fileItemStyle}>
                <div style={fileTopRowStyle}>
                  <div style={fileMainInfoStyle}>
                    <div style={fileIconWrapStyle}>{fileMeta.icon}</div>

                    <div style={fileTextWrapStyle}>
                      <div style={fileNameStyle}>{file.name}</div>
                      {file.description ? (
                        <div style={fileDescStyle}>{file.description}</div>
                      ) : null}
                    </div>
                  </div>

                  <div style={chipsWrapStyle}>
                    <span style={fileMeta.style}>{fileMeta.label}</span>
                    <span style={statusMeta.style}>
                      {statusMeta.icon}
                      {statusMeta.label}
                    </span>
                    {file.secure ? (
                      <span style={chip("#ecfdf5", "#a7f3d0", "#047857")}>
                        <ShieldCheck size={12} />
                        Secure
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="related-files-meta-grid" style={metaGridStyle}>
                  <MetaItem
                    label="Size"
                    value={file.size || "Not available"}
                    icon={<Files size={14} color="#2563eb" />}
                  />
                  <MetaItem
                    label="Uploaded By"
                    value={file.uploadedBy || "Unknown"}
                    icon={<User2 size={14} color="#2563eb" />}
                  />
                  <MetaItem
                    label="Uploaded At"
                    value={formatDateTime(file.uploadedAt)}
                    helper={getTimeAgo(file.uploadedAt)}
                    icon={<Clock3 size={14} color="#2563eb" />}
                  />
                  <MetaItem
                    label="Linked To"
                    value={file.linkedTo || "General record"}
                    icon={<Link2 size={14} color="#2563eb" />}
                  />
                  <MetaItem
                    label="Version"
                    value={file.version || "Base"}
                    icon={<FolderOpen size={14} color="#2563eb" />}
                  />
                  <MetaItem
                    label="Access"
                    value={file.status === "restricted" ? "Restricted" : "Available"}
                    helper={
                      file.status === "restricted"
                        ? "Permission-sensitive document"
                        : restrictedCount > 0
                        ? "Some files may have tighter access"
                        : "Normal team access"
                    }
                    icon={<ShieldCheck size={14} color="#2563eb" />}
                  />
                </div>

                <div style={fileActionsStyle}>
                  <div style={helperTextStyle}>
                    {file.status === "processing"
                      ? "This file is still being prepared. Preview or download may become available shortly."
                      : file.status === "restricted"
                      ? "This file is permission-sensitive and should be handled with controlled access."
                      : "Keep related files clean and current so sales, legal, and ops always move with context."}
                  </div>

                  <div style={actionGroupStyle}>
                    <button
                      type="button"
                      style={secondaryButtonStyle}
                      onClick={() => onPreviewFile?.(file)}
                    >
                      <Eye size={14} />
                      Preview
                    </button>

                    <button
                      type="button"
                      style={secondaryButtonStyle}
                      onClick={() => onDownloadFile?.(file)}
                    >
                      <ArrowDownToLine size={14} />
                      Download
                    </button>

                    <button
                      type="button"
                      style={primaryButtonStyle}
                      onClick={() => onOpenFile?.(file)}
                    >
                      Open
                      <ArrowUpRight size={14} />
                    </button>

                    <button
                      type="button"
                      style={dangerButtonStyle}
                      onClick={() => onDeleteFile?.(file)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={footerStyle}>
        <div style={helperTextStyle}>
          {restrictedCount > 0
            ? `${restrictedCount} restricted file${restrictedCount > 1 ? "s need" : " needs"} extra care. Keep your file stack current, searchable, and clean.`
            : "Best file systems are simple: latest version, clear ownership, fast access, zero confusion."}
        </div>

        <button type="button" style={secondaryButtonStyle} onClick={onViewAll}>
          {actionLabel}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div style={summaryItemStyle}>
      <div style={summaryLabelStyle}>{label}</div>
      <div style={summaryValueStyle}>{value}</div>
      {helper ? <div style={summaryHelperStyle}>{helper}</div> : null}
    </div>
  );
}

function MetaItem({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div style={metaItemStyle}>
      {icon ? <span style={{ marginTop: 2, flexShrink: 0 }}>{icon}</span> : null}
      <div style={metaTextWrapStyle}>
        <div style={metaLabelStyle}>{label}</div>
        <div style={metaValueStyle}>{value}</div>
        {helper ? <div style={helperTextStyle}>{helper}</div> : null}
      </div>
    </div>
  );
}

function getFileTypeMeta(type: RelatedFileType = "other") {
  switch (type) {
    case "pdf":
      return {
        label: "PDF",
        icon: <FileText size={20} color="#dc2626" />,
        style: chip("#fef2f2", "#fecaca", "#b91c1c"),
      };
    case "doc":
    case "docx":
      return {
        label: "DOC",
        icon: <FileType2 size={20} color="#2563eb" />,
        style: chip("#eff6ff", "#bfdbfe", "#1d4ed8"),
      };
    case "xls":
    case "xlsx":
    case "csv":
      return {
        label: "Sheet",
        icon: <FileSpreadsheet size={20} color="#047857" />,
        style: chip("#ecfdf5", "#a7f3d0", "#047857"),
      };
    case "ppt":
    case "pptx":
      return {
        label: "Slides",
        icon: <FileType2 size={20} color="#ea580c" />,
        style: chip("#fff7ed", "#fed7aa", "#c2410c"),
      };
    case "jpg":
    case "jpeg":
    case "png":
      return {
        label: "Image",
        icon: <FileImage size={20} color="#7c3aed" />,
        style: chip("#f5f3ff", "#ddd6fe", "#6d28d9"),
      };
    case "zip":
      return {
        label: "Archive",
        icon: <FileArchive size={20} color="#475569" />,
        style: chip("#f8fafc", "#e2e8f0", "#475569"),
      };
    case "mp4":
      return {
        label: "Video",
        icon: <FileVideo size={20} color="#0f766e" />,
        style: chip("#ecfeff", "#a5f3fc", "#0f766e"),
      };
    case "txt":
      return {
        label: "Text",
        icon: <FileText size={20} color="#334155" />,
        style: chip("#f8fafc", "#e2e8f0", "#334155"),
      };
    default:
      return {
        label: "File",
        icon: <FileText size={20} color="#334155" />,
        style: chip("#f8fafc", "#e2e8f0", "#475569"),
      };
  }
}

function getStatusMeta(status: RelatedFileStatus = "active") {
  switch (status) {
    case "processing":
      return {
        label: "Processing",
        icon: <Clock3 size={12} />,
        style: chip("#fff7ed", "#fed7aa", "#c2410c"),
      };
    case "archived":
      return {
        label: "Archived",
        icon: <FolderOpen size={12} />,
        style: chip("#f8fafc", "#e2e8f0", "#475569"),
      };
    case "restricted":
      return {
        label: "Restricted",
        icon: <ShieldCheck size={12} />,
        style: chip("#fef2f2", "#fecaca", "#b91c1c"),
      };
    default:
      return {
        label: "Active",
        icon: <Search size={12} />,
        style: chip("#eff6ff", "#bfdbfe", "#1d4ed8"),
      };
  }
}

function chip(
  background: string,
  border: string,
  color: string
): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    padding: "7px 11px",
    background,
    border: `1px solid ${border}`,
    color,
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: "nowrap",
  };
}

function formatDateTime(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getTimeAgo(value?: string) {
  if (!value) return "Time unknown";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid time";

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(Math.abs(diff) / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diff < 0) return "Just now";
  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${Math.max(minutes, 1)} minute${minutes > 1 ? "s" : ""} ago`;
}

export default memo(RelatedFilesCard);