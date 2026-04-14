// src/hooks/communications/useAttachments.ts

import { useMemo, useState } from "react";
import type { CommunicationChannel } from "../../constants/communications/communicationChannels";
import {
  getMockMessages,
  type MessageAttachment,
  type MessageRecord,
} from "../../data/communications/mockMessages";

export type AttachmentSortKey =
  | "newest"
  | "oldest"
  | "name"
  | "type"
  | "sender";

export type AttachmentViewMode = "grid" | "list";

export interface AttachmentItem extends MessageAttachment {
  messageId: string;
  threadId: string;
  conversationId: string;
  channel: CommunicationChannel;
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  subject?: string;
  messagePreviewText: string;
  messageCreatedAt: string;
  messageUpdatedAt: string;
  isInternalNote: boolean;
  labels: string[];
}

export interface UseAttachmentsOptions {
  initialSearch?: string;
  initialChannel?: CommunicationChannel | "all";
  initialFileType?: string | "all";
  initialSort?: AttachmentSortKey;
  initialViewMode?: AttachmentViewMode;
  includeInternalNotes?: boolean;
}

export interface UseAttachmentsResult {
  attachments: AttachmentItem[];
  filteredAttachments: AttachmentItem[];
  selectedAttachment: AttachmentItem | null;
  searchQuery: string;
  selectedChannel: CommunicationChannel | "all";
  selectedFileType: string | "all";
  sortBy: AttachmentSortKey;
  viewMode: AttachmentViewMode;
  includeInternalNotes: boolean;
  fileTypes: string[];
  channels: Array<CommunicationChannel | "all">;
  totalCount: number;
  filteredCount: number;
  imageCount: number;
  documentCount: number;
  pdfCount: number;
  spreadsheetCount: number;
  latestAttachment: AttachmentItem | null;
  groupedByDate: Record<string, AttachmentItem[]>;
  groupedByType: Record<string, AttachmentItem[]>;
  setSearchQuery: (value: string) => void;
  setSelectedChannel: (value: CommunicationChannel | "all") => void;
  setSelectedFileType: (value: string | "all") => void;
  setSortBy: (value: AttachmentSortKey) => void;
  setViewMode: (value: AttachmentViewMode) => void;
  setIncludeInternalNotes: (value: boolean) => void;
  setSelectedAttachment: (value: AttachmentItem | null) => void;
  clearFilters: () => void;
  getAttachmentById: (attachmentId: string) => AttachmentItem | undefined;
  getAttachmentsByThreadId: (threadId: string) => AttachmentItem[];
  getAttachmentsByConversationId: (conversationId: string) => AttachmentItem[];
  getAttachmentsByMessageId: (messageId: string) => AttachmentItem[];
}

type SafeMessageRecord = MessageRecord & {
  labels?: string[];
  isInternalNote?: boolean;
  previewText?: string;
  updatedAt?: string;
};

function normalizeText(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function getSafeLabels(message: MessageRecord): string[] {
  const safeMessage = message as SafeMessageRecord;

  if (Array.isArray(safeMessage.labels)) {
    return safeMessage.labels;
  }

  return [];
}

function getSafeInternalNoteValue(message: MessageRecord): boolean {
  const safeMessage = message as SafeMessageRecord;
  return Boolean(safeMessage.isInternalNote);
}

function getSafePreviewText(message: MessageRecord): string {
  const safeMessage = message as SafeMessageRecord;

  if (typeof safeMessage.previewText === "string" && safeMessage.previewText.trim()) {
    return safeMessage.previewText;
  }

  if ("body" in message && typeof message.body === "string") {
    return message.body.slice(0, 120);
  }

  return "";
}

function getSafeUpdatedAt(message: MessageRecord): string {
  const safeMessage = message as SafeMessageRecord;

  if (typeof safeMessage.updatedAt === "string" && safeMessage.updatedAt.trim()) {
    return safeMessage.updatedAt;
  }

  return message.createdAt;
}

function getAttachmentCategory(
  fileType: string
): "image" | "document" | "spreadsheet" | "other" {
  const normalized = normalizeText(fileType);

  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(normalized)) {
    return "image";
  }

  if (["xls", "xlsx", "csv"].includes(normalized)) {
    return "spreadsheet";
  }

  if (["pdf", "doc", "docx", "ppt", "pptx", "txt", "rtf"].includes(normalized)) {
    return "document";
  }

  return "other";
}

function groupAttachmentsByDate(
  items: AttachmentItem[]
): Record<string, AttachmentItem[]> {
  return items.reduce<Record<string, AttachmentItem[]>>((acc, item) => {
    const dateKey = new Date(item.messageCreatedAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(item);
    return acc;
  }, {});
}

function groupAttachmentsByType(
  items: AttachmentItem[]
): Record<string, AttachmentItem[]> {
  return items.reduce<Record<string, AttachmentItem[]>>((acc, item) => {
    const typeKey = item.fileType.toLowerCase() || "unknown";

    if (!acc[typeKey]) {
      acc[typeKey] = [];
    }

    acc[typeKey].push(item);
    return acc;
  }, {});
}

function mapMessageAttachments(messages: MessageRecord[]): AttachmentItem[] {
  return messages.flatMap((message) => {
    const safeLabels = getSafeLabels(message);
    const safeIsInternalNote = getSafeInternalNoteValue(message);
    const safePreviewText = getSafePreviewText(message);
    const safeUpdatedAt = getSafeUpdatedAt(message);

    return message.attachments.map<AttachmentItem>((attachment) => ({
      ...attachment,
      messageId: message.id,
      threadId: message.threadId,
      conversationId: message.conversationId,
      channel: message.channel,
      senderName: message.sender.name,
      senderEmail: message.sender.email,
      senderPhone: message.sender.phone,
      subject: message.subject,
      messagePreviewText: safePreviewText,
      messageCreatedAt: message.createdAt,
      messageUpdatedAt: safeUpdatedAt,
      isInternalNote: safeIsInternalNote,
      labels: safeLabels,
    }));
  });
}

export default function useAttachments(
  options: UseAttachmentsOptions = {}
): UseAttachmentsResult {
  const {
    initialSearch = "",
    initialChannel = "all",
    initialFileType = "all",
    initialSort = "newest",
    initialViewMode = "grid",
    includeInternalNotes = true,
  } = options;

  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedChannel, setSelectedChannel] = useState<
    CommunicationChannel | "all"
  >(initialChannel);
  const [selectedFileType, setSelectedFileType] = useState<string | "all">(
    initialFileType
  );
  const [sortBy, setSortBy] = useState<AttachmentSortKey>(initialSort);
  const [viewMode, setViewMode] = useState<AttachmentViewMode>(initialViewMode);
  const [showInternalNotes, setIncludeInternalNotes] =
    useState<boolean>(includeInternalNotes);
  const [selectedAttachment, setSelectedAttachment] =
    useState<AttachmentItem | null>(null);

  const attachments = useMemo<AttachmentItem[]>(() => {
    const messages = getMockMessages();
    return mapMessageAttachments(messages);
  }, []);

  const fileTypes = useMemo<string[]>(() => {
    return Array.from(
      new Set(attachments.map((item) => item.fileType.toLowerCase()))
    ).sort((a, b) => a.localeCompare(b));
  }, [attachments]);

  const channels = useMemo<Array<CommunicationChannel | "all">>(
    () => ["all", "email", "sms", "whatsapp", "internal"],
    []
  );

  const filteredAttachments = useMemo<AttachmentItem[]>(() => {
    let result = [...attachments];
    const normalizedQuery = normalizeText(searchQuery);

    if (!showInternalNotes) {
      result = result.filter((item) => !item.isInternalNote);
    }

    if (selectedChannel !== "all") {
      result = result.filter((item) => item.channel === selectedChannel);
    }

    if (selectedFileType !== "all") {
      result = result.filter(
        (item) => item.fileType.toLowerCase() === selectedFileType.toLowerCase()
      );
    }

    if (normalizedQuery) {
      result = result.filter((item) => {
        return (
          normalizeText(item.fileName).includes(normalizedQuery) ||
          normalizeText(item.fileType).includes(normalizedQuery) ||
          normalizeText(item.senderName).includes(normalizedQuery) ||
          normalizeText(item.senderEmail).includes(normalizedQuery) ||
          normalizeText(item.senderPhone).includes(normalizedQuery) ||
          normalizeText(item.subject).includes(normalizedQuery) ||
          normalizeText(item.messagePreviewText).includes(normalizedQuery) ||
          normalizeText(item.channel).includes(normalizedQuery) ||
          item.labels.some((label) =>
            normalizeText(label).includes(normalizedQuery)
          )
        );
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.messageCreatedAt).getTime() -
            new Date(b.messageCreatedAt).getTime()
          );

        case "name":
          return a.fileName.localeCompare(b.fileName);

        case "type":
          return a.fileType.localeCompare(b.fileType);

        case "sender":
          return a.senderName.localeCompare(b.senderName);

        case "newest":
        default:
          return (
            new Date(b.messageCreatedAt).getTime() -
            new Date(a.messageCreatedAt).getTime()
          );
      }
    });

    return result;
  }, [
    attachments,
    searchQuery,
    selectedChannel,
    selectedFileType,
    sortBy,
    showInternalNotes,
  ]);

  const latestAttachment = useMemo<AttachmentItem | null>(() => {
    if (!filteredAttachments.length) {
      return null;
    }

    return [...filteredAttachments].sort(
      (a, b) =>
        new Date(b.messageCreatedAt).getTime() -
        new Date(a.messageCreatedAt).getTime()
    )[0];
  }, [filteredAttachments]);

  const imageCount = useMemo<number>(() => {
    return attachments.filter(
      (item) => getAttachmentCategory(item.fileType) === "image"
    ).length;
  }, [attachments]);

  const documentCount = useMemo<number>(() => {
    return attachments.filter(
      (item) => getAttachmentCategory(item.fileType) === "document"
    ).length;
  }, [attachments]);

  const spreadsheetCount = useMemo<number>(() => {
    return attachments.filter(
      (item) => getAttachmentCategory(item.fileType) === "spreadsheet"
    ).length;
  }, [attachments]);

  const pdfCount = useMemo<number>(() => {
    return attachments.filter(
      (item) => item.fileType.toLowerCase() === "pdf"
    ).length;
  }, [attachments]);

  const groupedByDate = useMemo<Record<string, AttachmentItem[]>>(() => {
    return groupAttachmentsByDate(filteredAttachments);
  }, [filteredAttachments]);

  const groupedByType = useMemo<Record<string, AttachmentItem[]>>(() => {
    return groupAttachmentsByType(filteredAttachments);
  }, [filteredAttachments]);

  const getAttachmentById = (attachmentId: string): AttachmentItem | undefined => {
    return attachments.find((item) => item.id === attachmentId);
  };

  const getAttachmentsByThreadId = (threadId: string): AttachmentItem[] => {
    return attachments.filter((item) => item.threadId === threadId);
  };

  const getAttachmentsByConversationId = (
    conversationId: string
  ): AttachmentItem[] => {
    return attachments.filter((item) => item.conversationId === conversationId);
  };

  const getAttachmentsByMessageId = (messageId: string): AttachmentItem[] => {
    return attachments.filter((item) => item.messageId === messageId);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedChannel("all");
    setSelectedFileType("all");
    setSortBy("newest");
    setViewMode(initialViewMode);
    setIncludeInternalNotes(includeInternalNotes);
    setSelectedAttachment(null);
  };

  return {
    attachments,
    filteredAttachments,
    selectedAttachment,
    searchQuery,
    selectedChannel,
    selectedFileType,
    sortBy,
    viewMode,
    includeInternalNotes: showInternalNotes,
    fileTypes,
    channels,
    totalCount: attachments.length,
    filteredCount: filteredAttachments.length,
    imageCount,
    documentCount,
    pdfCount,
    spreadsheetCount,
    latestAttachment,
    groupedByDate,
    groupedByType,
    setSearchQuery,
    setSelectedChannel,
    setSelectedFileType,
    setSortBy,
    setViewMode,
    setIncludeInternalNotes,
    setSelectedAttachment,
    clearFilters,
    getAttachmentById,
    getAttachmentsByThreadId,
    getAttachmentsByConversationId,
    getAttachmentsByMessageId,
  };
}