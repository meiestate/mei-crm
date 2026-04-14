// src/types/attachment.types.ts

export type AttachmentEntityType =
  | "email"
  | "message"
  | "conversation"
  | "template"
  | "follow_up"
  | "note"
  | "contact"
  | "lead"
  | "deal";

export type AttachmentKind =
  | "image"
  | "document"
  | "audio"
  | "video"
  | "archive"
  | "spreadsheet"
  | "pdf"
  | "other";

export type AttachmentUploadStatus =
  | "idle"
  | "uploading"
  | "uploaded"
  | "processing"
  | "failed"
  | "deleted";

export type AttachmentSortBy =
  | "createdAt"
  | "updatedAt"
  | "fileName"
  | "size";

export type AttachmentSortOrder = "asc" | "desc";

export type AttachmentPreviewType =
  | "image"
  | "pdf"
  | "audio"
  | "video"
  | "text"
  | "download";

export type AttachmentOwner = {
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
};

export type AttachmentItem = {
  id: string;
  fileName: string;
  originalName?: string;
  extension?: string;
  mimeType: string;
  size: number;
  sizeLabel?: string;
  kind: AttachmentKind;
  previewType?: AttachmentPreviewType;
  entityId?: string;
  entityType?: AttachmentEntityType;
  url?: string;
  publicUrl?: string;
  downloadUrl?: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  storageKey?: string;
  uploadedBy?: string;
  uploadedByName?: string;
  owner?: AttachmentOwner;
  uploadStatus: AttachmentUploadStatus;
  checksum?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
};

export type AttachmentFilters = {
  search?: string;
  entityId?: string;
  entityType?: AttachmentEntityType;
  mimeType?: string;
  kind?: AttachmentKind | "all";
  uploadedBy?: string;
  uploadStatus?: AttachmentUploadStatus | "all";
  page?: number;
  limit?: number;
  sortBy?: AttachmentSortBy;
  sortOrder?: AttachmentSortOrder;
};

export type PaginatedAttachmentsResponse = {
  data: AttachmentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UploadAttachmentPayload = {
  file: File | Blob;
  fileName?: string;
  entityId?: string;
  entityType?: AttachmentEntityType;
  tags?: string[];
};

export type CreateAttachmentFromUrlPayload = {
  fileName: string;
  sourceUrl: string;
  mimeType?: string;
  entityId?: string;
  entityType?: AttachmentEntityType;
  tags?: string[];
};

export type UpdateAttachmentPayload = {
  fileName?: string;
  entityId?: string;
  entityType?: AttachmentEntityType;
  tags?: string[];
};

export type BulkAttachmentActionPayload = {
  attachmentIds: string[];
};

export type AttachmentUploadResponse = {
  success: boolean;
  attachment: AttachmentItem;
  message?: string;
};

export type AttachmentDownloadResponse = {
  success: boolean;
  downloadUrl: string;
  fileName?: string;
};

export type AttachmentCountsResponse = {
  all: number;
  images: number;
  documents: number;
  audio: number;
  video: number;
  archives: number;
  spreadsheets: number;
  pdfs: number;
  failed: number;
};

export type AttachmentSearchResponse = AttachmentItem[];