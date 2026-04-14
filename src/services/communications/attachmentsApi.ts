// src/services/communications/attachmentsApi.ts

import api from "../../prisma/client";

export type AttachmentEntityType =
  | "email"
  | "message"
  | "conversation"
  | "template"
  | "follow_up"
  | "note";

export type AttachmentKind =
  | "image"
  | "document"
  | "audio"
  | "video"
  | "archive"
  | "spreadsheet"
  | "other";

export type AttachmentUploadStatus =
  | "uploading"
  | "uploaded"
  | "failed"
  | "deleted";

export type AttachmentItem = {
  id: string;
  fileName: string;
  originalName?: string;
  mimeType: string;
  extension?: string;
  size: number;
  sizeLabel?: string;
  kind?: AttachmentKind;
  url?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  publicUrl?: string;
  storageKey?: string;
  entityId?: string;
  entityType?: AttachmentEntityType;
  uploadedBy?: string;
  uploadedByName?: string;
  uploadStatus?: AttachmentUploadStatus;
  createdAt: string;
  updatedAt?: string;
};

export type AttachmentFilters = {
  entityId?: string;
  entityType?: AttachmentEntityType;
  search?: string;
  mimeType?: string;
  kind?: AttachmentKind;
  uploadedBy?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "fileName" | "size";
  sortOrder?: "asc" | "desc";
};

export type PaginatedAttachmentsResponse = {
  data: AttachmentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UploadAttachmentPayload = {
  file: File;
  entityId?: string;
  entityType?: AttachmentEntityType;
};

export type UploadManyAttachmentsPayload = {
  files: File[];
  entityId?: string;
  entityType?: AttachmentEntityType;
};

export type RenameAttachmentPayload = {
  fileName: string;
};

export type LinkAttachmentsPayload = {
  attachmentIds: string[];
  entityId: string;
  entityType: AttachmentEntityType;
};

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return {};

  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0),
    ),
  );
}

function createAttachmentFormData(payload: UploadAttachmentPayload): FormData {
  const formData = new FormData();
  formData.append("file", payload.file);

  if (payload.entityId) {
    formData.append("entityId", payload.entityId);
  }

  if (payload.entityType) {
    formData.append("entityType", payload.entityType);
  }

  return formData;
}

function createManyAttachmentsFormData(
  payload: UploadManyAttachmentsPayload,
): FormData {
  const formData = new FormData();

  payload.files.forEach((file) => {
    formData.append("files", file);
  });

  if (payload.entityId) {
    formData.append("entityId", payload.entityId);
  }

  if (payload.entityType) {
    formData.append("entityType", payload.entityType);
  }

  return formData;
}

const attachmentsApi = {
  async getAll(
    filters?: AttachmentFilters,
  ): Promise<PaginatedAttachmentsResponse> {
    const response = await api.get<PaginatedAttachmentsResponse>(
      "/attachments",
      {
        params: cleanParams(filters),
      },
    );

    return response.data;
  },

  async getById(id: string): Promise<AttachmentItem> {
    const response = await api.get<AttachmentItem>(`/attachments/${id}`);
    return response.data;
  },

  async getByEntity(
    entityId: string,
    entityType: AttachmentEntityType,
    filters?: Omit<AttachmentFilters, "entityId" | "entityType">,
  ): Promise<AttachmentItem[]> {
    const response = await api.get<AttachmentItem[]>("/attachments/by-entity", {
      params: cleanParams({
        entityId,
        entityType,
        ...filters,
      }),
    });

    return response.data;
  },

  async upload(payload: UploadAttachmentPayload): Promise<AttachmentItem> {
    const formData = createAttachmentFormData(payload);

    const response = await api.post<AttachmentItem, FormData>(
      "/attachments/upload",
      formData,
    );

    return response.data;
  },

  async uploadMany(
    payload: UploadManyAttachmentsPayload,
  ): Promise<AttachmentItem[]> {
    const formData = createManyAttachmentsFormData(payload);

    const response = await api.post<AttachmentItem[], FormData>(
      "/attachments/upload-many",
      formData,
    );

    return response.data;
  },

  async rename(
    id: string,
    payload: RenameAttachmentPayload,
  ): Promise<AttachmentItem> {
    const response = await api.patch<AttachmentItem, RenameAttachmentPayload>(
      `/attachments/${id}/rename`,
      payload,
    );

    return response.data;
  },

  async linkToEntity(
    payload: LinkAttachmentsPayload,
  ): Promise<AttachmentItem[]> {
    const response = await api.patch<AttachmentItem[], LinkAttachmentsPayload>(
      "/attachments/link",
      payload,
    );

    return response.data;
  },

  async unlinkFromEntity(
    attachmentId: string,
    entityId: string,
    entityType: AttachmentEntityType,
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.patch<
      { success: boolean; message: string },
      { entityId: string; entityType: AttachmentEntityType }
    >(`/attachments/${attachmentId}/unlink`, {
      entityId,
      entityType,
    });

    return response.data;
  },

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/attachments/${id}`,
    );

    return response.data;
  },

  async deleteMany(
    attachmentIds: string[],
  ): Promise<{ success: boolean; message: string; deletedCount: number }> {
    const response = await api.post<
      { success: boolean; message: string; deletedCount: number },
      { attachmentIds: string[] }
    >("/attachments/delete-many", {
      attachmentIds,
    });

    return response.data;
  },

  async getDownloadBlob(id: string): Promise<Blob> {
    const response = await api.get<Blob>(`/attachments/${id}/download`, {
      responseType: "blob",
    });

    return response.data;
  },

  async getPreviewBlob(id: string): Promise<Blob> {
    const response = await api.get<Blob>(`/attachments/${id}/preview`, {
      responseType: "blob",
    });

    return response.data;
  },

  async markAsPublic(
    id: string,
  ): Promise<{ success: boolean; publicUrl?: string; message?: string }> {
    const response = await api.patch<
      { success: boolean; publicUrl?: string; message?: string },
      Record<string, never>
    >(`/attachments/${id}/public`, {});

    return response.data;
  },

  async revokePublicAccess(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.delete<{ success: boolean; message?: string }>(
      `/attachments/${id}/public`,
    );

    return response.data;
  },
};

export default attachmentsApi;
export { cleanParams };