// src/hooks/communications/useConversationFilters.ts

import { useMemo, useState } from "react";
import type { CommunicationChannel } from "../../constants/communications/communicationChannels";
import type { DeliveryStatus } from "../../constants/communications/deliveryStatuses";
import {
  getMockMessages,
  type MessageRecord,
} from "../../data/communications/mockMessages";

type SafeMessageRecord = MessageRecord & {
  labels?: string[];
  isInternalNote?: boolean;
  isStarred?: boolean;
  isPinned?: boolean;
  isRead?: boolean;
  isDraft?: boolean;
  isScheduled?: boolean;
  previewText?: string;
  updatedAt?: string;
  folder?: string;
  direction?: "incoming" | "outgoing" | "internal";
};

export type ConversationSortKey =
  | "latest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "unread-first";

export interface ConversationFilterState {
  searchQuery: string;
  channel: CommunicationChannel | "all";
  folder: string | "all";
  status: DeliveryStatus | "all" | "unknown";
  unreadOnly: boolean;
  starredOnly: boolean;
  pinnedOnly: boolean;
  attachmentsOnly: boolean;
  includeInternalNotes: boolean;
  startDate: string | null;
  endDate: string | null;
  sortBy: ConversationSortKey;
}

export interface FilterChipItem {
  key: string;
  label: string;
  value: string;
}

export interface UseConversationFiltersOptions {
  initialSearchQuery?: string;
  initialChannel?: CommunicationChannel | "all";
  initialFolder?: string | "all";
  initialStatus?: DeliveryStatus | "all" | "unknown";
  initialUnreadOnly?: boolean;
  initialStarredOnly?: boolean;
  initialPinnedOnly?: boolean;
  initialAttachmentsOnly?: boolean;
  initialIncludeInternalNotes?: boolean;
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  initialSortBy?: ConversationSortKey;
}

export interface UseConversationFiltersResult {
  filters: ConversationFilterState;
  setSearchQuery: (value: string) => void;
  setChannel: (value: CommunicationChannel | "all") => void;
  setFolder: (value: string | "all") => void;
  setStatus: (value: DeliveryStatus | "all" | "unknown") => void;
  setUnreadOnly: (value: boolean) => void;
  setStarredOnly: (value: boolean) => void;
  setPinnedOnly: (value: boolean) => void;
  setAttachmentsOnly: (value: boolean) => void;
  setIncludeInternalNotes: (value: boolean) => void;
  setStartDate: (value: string | null) => void;
  setEndDate: (value: string | null) => void;
  setSortBy: (value: ConversationSortKey) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  activeFilterChips: FilterChipItem[];
  availableChannels: Array<CommunicationChannel | "all">;
  availableFolders: Array<string | "all">;
  availableStatuses: Array<DeliveryStatus | "all" | "unknown">;
  applyMessageFilters: (messages: MessageRecord[]) => MessageRecord[];
}

function normalizeText(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function getSafeLabels(message: MessageRecord): string[] {
  const safeMessage = message as SafeMessageRecord;
  return Array.isArray(safeMessage.labels) ? safeMessage.labels : [];
}

function getSafeIsInternalNote(message: MessageRecord): boolean {
  const safeMessage = message as SafeMessageRecord;
  return Boolean(safeMessage.isInternalNote);
}

function getSafeIsStarred(message: MessageRecord): boolean {
  const safeMessage = message as SafeMessageRecord;
  return Boolean(safeMessage.isStarred);
}

function getSafeIsPinned(message: MessageRecord): boolean {
  const safeMessage = message as SafeMessageRecord;
  return Boolean(safeMessage.isPinned);
}

function getSafeIsRead(message: MessageRecord): boolean {
  const safeMessage = message as SafeMessageRecord;
  return Boolean(safeMessage.isRead);
}

function getSafeStatus(message: MessageRecord): DeliveryStatus | "unknown" {
  const safeMessage = message as SafeMessageRecord;
  return safeMessage.status ?? "unknown";
}

function getSafeFolder(message: MessageRecord): string {
  const safeMessage = message as SafeMessageRecord;

  if (typeof safeMessage.folder === "string" && safeMessage.folder.trim()) {
    return safeMessage.folder;
  }

  if (safeMessage.status === "draft") {
    return "drafts";
  }

  if (safeMessage.status === "scheduled") {
    return "scheduled";
  }

  if (getSafeIsInternalNote(message)) {
    return "internal";
  }

  return "inbox";
}

function getSafePreviewText(message: MessageRecord): string {
  const safeMessage = message as SafeMessageRecord;

  if (typeof safeMessage.previewText === "string" && safeMessage.previewText.trim()) {
    return safeMessage.previewText;
  }

  if (typeof message.body === "string" && message.body.trim()) {
    return message.body.slice(0, 120);
  }

  return "";
}

function isWithinDateRange(
  createdAt: string,
  startDate: string | null,
  endDate: string | null
): boolean {
  const target = new Date(createdAt);

  if (Number.isNaN(target.getTime())) {
    return false;
  }

  if (startDate) {
    const start = new Date(`${startDate}T00:00:00`);
    if (target < start) {
      return false;
    }
  }

  if (endDate) {
    const end = new Date(`${endDate}T23:59:59.999`);
    if (target > end) {
      return false;
    }
  }

  return true;
}

function getSortableTitle(message: MessageRecord): string {
  return normalizeText(message.subject || getSafePreviewText(message) || "untitled");
}

export default function useConversationFilters(
  options: UseConversationFiltersOptions = {}
): UseConversationFiltersResult {
  const {
    initialSearchQuery = "",
    initialChannel = "all",
    initialFolder = "all",
    initialStatus = "all",
    initialUnreadOnly = false,
    initialStarredOnly = false,
    initialPinnedOnly = false,
    initialAttachmentsOnly = false,
    initialIncludeInternalNotes = true,
    initialStartDate = null,
    initialEndDate = null,
    initialSortBy = "latest",
  } = options;

  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [channel, setChannel] = useState<CommunicationChannel | "all">(initialChannel);
  const [folder, setFolder] = useState<string | "all">(initialFolder);
  const [status, setStatus] = useState<DeliveryStatus | "all" | "unknown">(initialStatus);
  const [unreadOnly, setUnreadOnly] = useState<boolean>(initialUnreadOnly);
  const [starredOnly, setStarredOnly] = useState<boolean>(initialStarredOnly);
  const [pinnedOnly, setPinnedOnly] = useState<boolean>(initialPinnedOnly);
  const [attachmentsOnly, setAttachmentsOnly] = useState<boolean>(initialAttachmentsOnly);
  const [includeInternalNotes, setIncludeInternalNotes] = useState<boolean>(
    initialIncludeInternalNotes
  );
  const [startDate, setStartDate] = useState<string | null>(initialStartDate);
  const [endDate, setEndDate] = useState<string | null>(initialEndDate);
  const [sortBy, setSortBy] = useState<ConversationSortKey>(initialSortBy);

  const allMessages = useMemo(() => getMockMessages(), []);

  const availableChannels = useMemo<Array<CommunicationChannel | "all">>(() => {
    const uniqueChannels = Array.from(
      new Set(allMessages.map((message) => message.channel))
    ).sort();

    return ["all", ...uniqueChannels] as Array<CommunicationChannel | "all">;
  }, [allMessages]);

  const availableFolders = useMemo<Array<string | "all">>(() => {
    const uniqueFolders = Array.from(
      new Set(allMessages.map((message) => getSafeFolder(message)))
    ).sort((a, b) => a.localeCompare(b));

    return ["all", ...uniqueFolders];
  }, [allMessages]);

  const availableStatuses = useMemo<Array<DeliveryStatus | "all" | "unknown">>(() => {
    const uniqueStatuses = Array.from(
      new Set(allMessages.map((message) => getSafeStatus(message)))
    ).sort();

    return ["all", ...uniqueStatuses] as Array<DeliveryStatus | "all" | "unknown">;
  }, [allMessages]);

  const applyMessageFilters = (messages: MessageRecord[]): MessageRecord[] => {
    const normalizedQuery = normalizeText(searchQuery);

    const filtered = messages.filter((message) => {
      if (channel !== "all" && message.channel !== channel) {
        return false;
      }

      if (folder !== "all" && getSafeFolder(message) !== folder) {
        return false;
      }

      if (status !== "all" && getSafeStatus(message) !== status) {
        return false;
      }

      if (unreadOnly && getSafeIsRead(message)) {
        return false;
      }

      if (starredOnly && !getSafeIsStarred(message)) {
        return false;
      }

      if (pinnedOnly && !getSafeIsPinned(message)) {
        return false;
      }

      if (attachmentsOnly && message.attachments.length === 0) {
        return false;
      }

      if (!includeInternalNotes && getSafeIsInternalNote(message)) {
        return false;
      }

      if (!isWithinDateRange(message.createdAt, startDate, endDate)) {
        return false;
      }

      if (normalizedQuery) {
        const matches =
          normalizeText(message.subject).includes(normalizedQuery) ||
          normalizeText(getSafePreviewText(message)).includes(normalizedQuery) ||
          normalizeText(message.sender.name).includes(normalizedQuery) ||
          normalizeText(message.sender.email).includes(normalizedQuery) ||
          normalizeText(message.sender.phone).includes(normalizedQuery) ||
          normalizeText(message.channel).includes(normalizedQuery) ||
          normalizeText(getSafeFolder(message)).includes(normalizedQuery) ||
          getSafeLabels(message).some((label) =>
            normalizeText(label).includes(normalizedQuery)
          ) ||
          message.recipients.some((recipient) => {
            return (
              normalizeText(recipient.name).includes(normalizedQuery) ||
              normalizeText(recipient.email).includes(normalizedQuery) ||
              normalizeText(recipient.phone).includes(normalizedQuery)
            );
          });

        if (!matches) {
          return false;
        }
      }

      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

        case "title-asc":
          return getSortableTitle(a).localeCompare(getSortableTitle(b));

        case "title-desc":
          return getSortableTitle(b).localeCompare(getSortableTitle(a));

        case "unread-first": {
          const aUnreadScore = getSafeIsRead(a) ? 1 : 0;
          const bUnreadScore = getSafeIsRead(b) ? 1 : 0;

          if (aUnreadScore !== bUnreadScore) {
            return aUnreadScore - bUnreadScore;
          }

          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        case "latest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  };

  const activeFilterChips = useMemo<FilterChipItem[]>(() => {
    const chips: FilterChipItem[] = [];

    if (searchQuery.trim()) {
      chips.push({
        key: "search",
        label: "Search",
        value: searchQuery.trim(),
      });
    }

    if (channel !== "all") {
      chips.push({
        key: "channel",
        label: "Channel",
        value: channel,
      });
    }

    if (folder !== "all") {
      chips.push({
        key: "folder",
        label: "Folder",
        value: folder,
      });
    }

    if (status !== "all") {
      chips.push({
        key: "status",
        label: "Status",
        value: status,
      });
    }

    if (unreadOnly) {
      chips.push({
        key: "unread",
        label: "Unread",
        value: "Only unread",
      });
    }

    if (starredOnly) {
      chips.push({
        key: "starred",
        label: "Starred",
        value: "Only starred",
      });
    }

    if (pinnedOnly) {
      chips.push({
        key: "pinned",
        label: "Pinned",
        value: "Only pinned",
      });
    }

    if (attachmentsOnly) {
      chips.push({
        key: "attachments",
        label: "Attachments",
        value: "Has attachments",
      });
    }

    if (!includeInternalNotes) {
      chips.push({
        key: "internal-notes",
        label: "Internal Notes",
        value: "Excluded",
      });
    }

    if (startDate) {
      chips.push({
        key: "startDate",
        label: "From",
        value: startDate,
      });
    }

    if (endDate) {
      chips.push({
        key: "endDate",
        label: "To",
        value: endDate,
      });
    }

    if (sortBy !== "latest") {
      chips.push({
        key: "sortBy",
        label: "Sort",
        value: sortBy,
      });
    }

    return chips;
  }, [
    searchQuery,
    channel,
    folder,
    status,
    unreadOnly,
    starredOnly,
    pinnedOnly,
    attachmentsOnly,
    includeInternalNotes,
    startDate,
    endDate,
    sortBy,
  ]);

  const activeFilterCount = activeFilterChips.length;
  const hasActiveFilters = activeFilterCount > 0;

  const clearFilters = () => {
    setSearchQuery("");
    setChannel("all");
    setFolder("all");
    setStatus("all");
    setUnreadOnly(false);
    setStarredOnly(false);
    setPinnedOnly(false);
    setAttachmentsOnly(false);
    setIncludeInternalNotes(true);
    setStartDate(null);
    setEndDate(null);
    setSortBy("latest");
  };

  return {
    filters: {
      searchQuery,
      channel,
      folder,
      status,
      unreadOnly,
      starredOnly,
      pinnedOnly,
      attachmentsOnly,
      includeInternalNotes,
      startDate,
      endDate,
      sortBy,
    },
    setSearchQuery,
    setChannel,
    setFolder,
    setStatus,
    setUnreadOnly,
    setStarredOnly,
    setPinnedOnly,
    setAttachmentsOnly,
    setIncludeInternalNotes,
    setStartDate,
    setEndDate,
    setSortBy,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
    activeFilterChips,
    availableChannels,
    availableFolders,
    availableStatuses,
    applyMessageFilters,
  };
}