import React from "react";
import {
  Download,
  File,
  FileArchive,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Trash2,
  Eye,
  Paperclip,
  Loader2,
} from "lucide-react";

type AttachmentKind =
  | "image"
  | "pdf"
  | "doc"
  | "sheet"
  | "video"
  | "audio"
  | "archive"
  | "file";

export interface AttachmentItem {
  id: string | number;
  name: string;
  size?: number;
  mimeType?: string;
  url?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  uploading?: boolean;
  kind?: AttachmentKind;
}

export interface AttachmentStripProps {
  attachments: AttachmentItem[];
  className?: string;
  removable?: boolean;
  downloadable?: boolean;
  previewable?: boolean;
  compact?: boolean;
  emptyText?: string;
  onRemove?: (attachmentId: string | number) => void;
  onDownload?: (attachment: AttachmentItem) => void;
  onPreview?: (attachment: AttachmentItem) => void;
  onOpen?: (attachment: AttachmentItem) => void;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const formatBytes = (bytes?: number): string => {
  if (!bytes || Number.isNaN(bytes)) return "—";
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
};

const getExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toUpperCase() : "FILE";
};

const inferAttachmentKind = (attachment: AttachmentItem): AttachmentKind => {
  if (attachment.kind) return attachment.kind;

  const mime = attachment.mimeType?.toLowerCase() ?? "";
  const name = attachment.name.toLowerCase();

  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.includes("pdf") || name.endsWith(".pdf")) return "pdf";
  if (
    mime.includes("sheet") ||
    mime.includes("excel") ||
    name.endsWith(".xlsx") ||
    name.endsWith(".xls") ||
    name.endsWith(".csv")
  ) {
    return "sheet";
  }
  if (
    mime.includes("word") ||
    mime.includes("document") ||
    name.endsWith(".docx") ||
    name.endsWith(".doc") ||
    name.endsWith(".txt")
  ) {
    return "doc";
  }
  if (
    mime.includes("zip") ||
    mime.includes("rar") ||
    mime.includes("7z") ||
    name.endsWith(".zip") ||
    name.endsWith(".rar") ||
    name.endsWith(".7z")
  ) {
    return "archive";
  }

  return "file";
};

const getKindIcon = (kind: AttachmentKind) => {
  switch (kind) {
    case "image":
      return FileImage;
    case "pdf":
      return FileText;
    case "doc":
      return FileText;
    case "sheet":
      return FileSpreadsheet;
    case "video":
      return FileVideo;
    case "audio":
      return FileAudio;
    case "archive":
      return FileArchive;
    default:
      return File;
  }
};

const getKindStyles = (kind: AttachmentKind) => {
  switch (kind) {
    case "image":
      return {
        iconWrap:
          "bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
        badge:
          "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
      };
    case "pdf":
      return {
        iconWrap:
          "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
        badge:
          "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
      };
    case "doc":
      return {
        iconWrap:
          "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900",
        badge:
          "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900",
      };
    case "sheet":
      return {
        iconWrap:
          "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
        badge:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
      };
    case "video":
      return {
        iconWrap:
          "bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900",
        badge:
          "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900",
      };
    case "audio":
      return {
        iconWrap:
          "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
        badge:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
      };
    case "archive":
      return {
        iconWrap:
          "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700",
        badge:
          "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700",
      };
    default:
      return {
        iconWrap:
          "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
        badge:
          "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
      };
  }
};

const AttachmentCard: React.FC<{
  attachment: AttachmentItem;
  removable: boolean;
  downloadable: boolean;
  previewable: boolean;
  compact: boolean;
  onRemove?: (attachmentId: string | number) => void;
  onDownload?: (attachment: AttachmentItem) => void;
  onPreview?: (attachment: AttachmentItem) => void;
  onOpen?: (attachment: AttachmentItem) => void;
}> = ({
  attachment,
  removable,
  downloadable,
  previewable,
  compact,
  onRemove,
  onDownload,
  onPreview,
  onOpen,
}) => {
  const kind = inferAttachmentKind(attachment);
  const styles = getKindStyles(kind);
  const Icon = getKindIcon(kind);
  const hasImagePreview =
    kind === "image" && (attachment.thumbnailUrl || attachment.previewUrl || attachment.url);

  const handleOpen = () => {
    if (onOpen) {
      onOpen(attachment);
      return;
    }

    if (attachment.url) {
      window.open(attachment.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={cn(
        "group relative flex shrink-0 items-stretch gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700",
        compact ? "min-w-[240px] max-w-[260px]" : "min-w-[280px] max-w-[320px]"
      )}
    >
      <button
        type="button"
        onClick={handleOpen}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        {hasImagePreview ? (
          <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
            <img
              src={attachment.thumbnailUrl || attachment.previewUrl || attachment.url}
              alt={attachment.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border",
              styles.iconWrap
            )}
          >
            {attachment.uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Icon className="h-5 w-5" />
            )}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {attachment.name}
            </p>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                styles.badge
              )}
            >
              {getExtension(attachment.name)}
            </span>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatBytes(attachment.size)}
            </span>

            {attachment.uploading ? (
              <span className="text-xs font-medium text-sky-600 dark:text-sky-400">
                Uploading...
              </span>
            ) : null}
          </div>
        </div>
      </button>

      <div className="flex flex-col items-center justify-start gap-2">
        {previewable && (attachment.previewUrl || attachment.url) ? (
          <button
            type="button"
            onClick={() => onPreview?.(attachment)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label={`Preview ${attachment.name}`}
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </button>
        ) : null}

        {downloadable && attachment.url ? (
          <button
            type="button"
            onClick={() => onDownload?.(attachment)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label={`Download ${attachment.name}`}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
        ) : null}

        {removable ? (
          <button
            type="button"
            onClick={() => onRemove?.(attachment.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
            aria-label={`Remove ${attachment.name}`}
            title="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

const AttachmentStrip: React.FC<AttachmentStripProps> = ({
  attachments,
  className,
  removable = false,
  downloadable = true,
  previewable = true,
  compact = false,
  emptyText = "No attachments available.",
  onRemove,
  onDownload,
  onPreview,
  onOpen,
}) => {
  if (!attachments || attachments.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400",
          className
        )}
      >
        <Paperclip className="h-4 w-4" />
        <span>{emptyText}</span>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="mb-2 flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Attachments
          </h4>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {attachments.length}
          </span>
        </div>
      </div>

      <div className="scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent -mx-1 overflow-x-auto px-1">
        <div className="flex min-w-max gap-3 pb-1">
          {attachments.map((attachment) => (
            <AttachmentCard
              key={attachment.id}
              attachment={attachment}
              removable={removable}
              downloadable={downloadable}
              previewable={previewable}
              compact={compact}
              onRemove={onRemove}
              onDownload={onDownload}
              onPreview={onPreview}
              onOpen={onOpen}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttachmentStrip;