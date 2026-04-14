// src/hooks/communications/useConversations.ts

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

type SafeParticipant = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
};

export type ConversationsSortKey =
  | "latest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "unread-first";

export interface ConversationParticipantSummary {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
}

export interface ConversationSummary {
  conversationId: string;
  threadId: string | null;
  title: string;
  subject?: string;
  previewText: string;
  channel: CommunicationChannel | "mixed" | null;
  latestMessage: MessageRecord | null;
  oldestMessage: MessageRecord | null;
  messages: MessageRecord[];
  participants: ConversationParticipantSummary[];
  unreadCount: number;
  totalMessages: number;
  attachmentCount: number;
  hasAttachments: boolean;
  hasInternalNotes: boolean;
  hasUnreadMessages: boolean;
  hasDrafts: boolean;
  hasScheduledMessages: boolean;
  hasStarredMessages: boolean;
  hasPinnedMessages: boolean;
  latestStatus: DeliveryStatus | "unknown";
  labels: string[];
  folder: string;
  startedAt: string | null;
  updatedAt: string | null;
}

export interface ConversationSection {
  key: string;
  title: string;
  items: ConversationSummary[];
}

export interface ConversationsFilterState {
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
  sortBy: ConversationsSortKey;
}

export interface UseConversationsOptions {
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
  initialSortBy?: ConversationsSortKey;
}

export interface UseConversationsResult {
  conversations: ConversationSummary[];
  filteredConversations: ConversationSummary[];
  sections: ConversationSection[];
  selectedConversation: ConversationSummary | null;
  selectedConversationId: string | null;

  filters: ConversationsFilterState;
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
  setSortBy: (value: ConversationsSortKey) => void;
  clearFilters: () => void;

  selectConversation: (conversationId: string | null) => void;
  selectFirstConversation: () => void;
  selectNextConversation: () => void;
  selectPreviousConversation: () => void;

  getConversationById: (conversationId: string) => ConversationSummary | undefined;

  totalCount: number;
  filteredCount: number;
  unreadConversationCount: number;
  starredConversationCount: number;
  pinnedConversationCount: number;
  draftConversationCount: number;
  scheduledConversationCount: number;
  attachmentConversationCount: number;

  availableChannels: Array<CommunicationChannel | "all">;
  availableFolders: Array<string | "all">;
  availableStatuses: Array<DeliveryStatus | "all" | "unknown">;
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

function getSafeIsDraft(message: MessageRecord): boolean {
  const safeMessage = message as SafeMessageRecord;
  return Boolean(safeMessage.isDraft) || safeMessage.status === "draft";
}

function getSafeIsScheduled(message: MessageRecord): boolean {
  const safeMessage = message as SafeMessageRecord;
  return Boolean(safeMessage.isScheduled) || safeMessage.status === "scheduled";
}

function getSafePreviewText(message: MessageRecord): string {
  const safeMessage = message as SafeMessageRecord;

  if (typeof safeMessage.previewText === "string" && safeMessage.previewText.trim()) {
    return safeMessage.previewText;
  }

  if (typeof message.body === "string" && message.body.trim()) {
    return message.body.slice(0, 140);
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

function getSafeParticipantAvatar(participant: unknown): string | undefined {
  const safeParticipant = participant as SafeParticipant;
  return typeof safeParticipant?.avatar === "string" ? safeParticipant.avatar : undefined;
}

function getSafeParticipantRole(participant: unknown): string | undefined {
  const safeParticipant = participant as SafeParticipant;
  return typeof safeParticipant?.role === "string" ? safeParticipant.role : undefined;
}

function getSafeParticipantId(participant: unknown, fallbackKey: string): string {
  const safeParticipant = participant as SafeParticipant;

  if (typeof safeParticipant?.id === "string" && safeParticipant.id.trim()) {
    return safeParticipant.id;
  }

  return fallbackKey;
}

function getSafeParticipantName(participant: unknown): string {
  const safeParticipant = participant as SafeParticipant;

  if (typeof safeParticipant?.name === "string" && safeParticipant.name.trim()) {
    return safeParticipant.name;
  }

  return "Unknown Participant";
}

function getSafeParticipantEmail(participant: unknown): string | undefined {
  const safeParticipant = participant as SafeParticipant;
  return typeof safeParticipant?.email === "string" ? safeParticipant.email : undefined;
}

function getSafeParticipantPhone(participant: unknown): string | undefined {
  const safeParticipant = participant as SafeParticipant;
  return typeof safeParticipant?.phone === "string" ? safeParticipant.phone : undefined;
}

function detectConversationChannel(
  messages: MessageRecord[]
): CommunicationChannel | "mixed" | null {
  if (!messages.length) {
    return null;
  }

  const uniqueChannels = Array.from(new Set(messages.map((message) => message.channel)));

  if (uniqueChannels.length === 1) {
    return uniqueChannels[0];
  }

  return "mixed";
}

function buildConversationParticipants(
  messages: MessageRecord[]
): ConversationParticipantSummary[] {
  const participantMap = new Map<string, ConversationParticipantSummary>();

  messages.forEach((message) => {
    const sender = message.sender;
    const senderKey =
      normalizeText(getSafeParticipantEmail(sender)) ||
      normalizeText(getSafeParticipantPhone(sender)) ||
      normalizeText((sender as SafeParticipant)?.id) ||
      normalizeText(getSafeParticipantName(sender));

    if (senderKey && !participantMap.has(senderKey)) {
      participantMap.set(senderKey, {
        id: getSafeParticipantId(sender, senderKey),
        name: getSafeParticipantName(sender),
        email: getSafeParticipantEmail(sender),
        phone: getSafeParticipantPhone(sender),
        avatar: getSafeParticipantAvatar(sender),
        role: getSafeParticipantRole(sender),
      });
    }

    message.recipients.forEach((recipient) => {
      const recipientKey =
        normalizeText(getSafeParticipantEmail(recipient)) ||
        normalizeText(getSafeParticipantPhone(recipient)) ||
        normalizeText((recipient as SafeParticipant)?.id) ||
        normalizeText(getSafeParticipantName(recipient));

      if (recipientKey && !participantMap.has(recipientKey)) {
        participantMap.set(recipientKey, {
          id: getSafeParticipantId(recipient, recipientKey),
          name: getSafeParticipantName(recipient),
          email: getSafeParticipantEmail(recipient),
          phone: getSafeParticipantPhone(recipient),
          avatar: getSafeParticipantAvatar(recipient),
          role: getSafeParticipantRole(recipient),
        });
      }
    });
  });

  return Array.from(participantMap.values());
}

function buildConversationTitle(messages: MessageRecord[]): { title: string; subject?: string } {
  const subjectMessage = [...messages]
    .reverse()
    .find((message) => typeof message.subject === "string" && message.subject.trim());

  if (subjectMessage?.subject) {
    return {
      title: subjectMessage.subject,
      subject: subjectMessage.subject,
    };
  }

  const latestMessage = messages[messages.length - 1];
  const previewText = latestMessage ? getSafePreviewText(latestMessage) : "";

  if (previewText) {
    return {
      title: previewText.slice(0, 60),
      subject: undefined,
    };
  }

  return {
    title: "Untitled Conversation",
    subject: undefined,
  };
}

function sortMessagesAscending(messages: MessageRecord[]): MessageRecord[] {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

function isWithinDateRange(
  targetDateString: string,
  startDate: string | null,
  endDate: string | null
): boolean {
  const target = new Date(targetDateString);

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

function getConversationSortableTitle(conversation: ConversationSummary): string {
  return normalizeText(conversation.title || conversation.subject || conversation.previewText);
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function startOfYesterday(): Date {
  const today = startOfToday();
  return new Date(today.getTime() - 24 * 60 * 60 * 1000);
}

function buildSections(conversations: ConversationSummary[]): ConversationSection[] {
  const todayStart = startOfToday();
  const yesterdayStart = startOfYesterday();

  const todayItems: ConversationSummary[] = [];
  const yesterdayItems: ConversationSummary[] = [];
  const earlierItems: ConversationSummary[] = [];

  conversations.forEach((conversation) => {
    const timestamp = conversation.updatedAt
      ? new Date(conversation.updatedAt).getTime()
      : 0;

    if (!timestamp) {
      earlierItems.push(conversation);
      return;
    }

    const date = new Date(timestamp);

    if (date >= todayStart) {
      todayItems.push(conversation);
      return;
    }

    if (date >= yesterdayStart && date < todayStart) {
      yesterdayItems.push(conversation);
      return;
    }

    earlierItems.push(conversation);
  });

  return [
    { key: "today", title: "Today", items: todayItems },
    { key: "yesterday", title: "Yesterday", items: yesterdayItems },
    { key: "earlier", title: "Earlier", items: earlierItems },
  ].filter((section) => section.items.length > 0);
}

export default function useConversations(
  options: UseConversationsOptions = {}
): UseConversationsResult {
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

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

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
  const [sortBy, setSortBy] = useState<ConversationsSortKey>(initialSortBy);

  const allMessages = useMemo(() => getMockMessages(), []);

  const conversations = useMemo<ConversationSummary[]>(() => {
    const map = new Map<string, MessageRecord[]>();

    allMessages.forEach((message) => {
      const key = message.conversationId || message.threadId || message.id;

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key)!.push(message);
    });

    const result = Array.from(map.entries()).map(([conversationId, messages]) => {
      const sortedMessages = sortMessagesAscending(messages);
      const latestMessage = sortedMessages[sortedMessages.length - 1] ?? null;
      const oldestMessage = sortedMessages[0] ?? null;
      const participants = buildConversationParticipants(sortedMessages);
      const labels = Array.from(
        new Set(sortedMessages.flatMap((message) => getSafeLabels(message)))
      ).sort((a, b) => a.localeCompare(b));
      const { title, subject } = buildConversationTitle(sortedMessages);

      const attachmentCount = sortedMessages.reduce((sum, message) => {
        return sum + message.attachments.length;
      }, 0);

      return {
        conversationId,
        threadId: latestMessage?.threadId ?? null,
        title,
        subject,
        previewText: latestMessage ? getSafePreviewText(latestMessage) : "",
        channel: detectConversationChannel(sortedMessages),
        latestMessage,
        oldestMessage,
        messages: sortedMessages,
        participants,
        unreadCount: sortedMessages.filter((message) => !getSafeIsRead(message)).length,
        totalMessages: sortedMessages.length,
        attachmentCount,
        hasAttachments: attachmentCount > 0,
        hasInternalNotes: sortedMessages.some((message) => getSafeIsInternalNote(message)),
        hasUnreadMessages: sortedMessages.some((message) => !getSafeIsRead(message)),
        hasDrafts: sortedMessages.some((message) => getSafeIsDraft(message)),
        hasScheduledMessages: sortedMessages.some((message) => getSafeIsScheduled(message)),
        hasStarredMessages: sortedMessages.some((message) => getSafeIsStarred(message)),
        hasPinnedMessages: sortedMessages.some((message) => getSafeIsPinned(message)),
        latestStatus: latestMessage ? getSafeStatus(latestMessage) : "unknown",
        labels,
        folder: latestMessage ? getSafeFolder(latestMessage) : "inbox",
        startedAt: oldestMessage?.createdAt ?? null,
        updatedAt: latestMessage ? getSafeUpdatedAt(latestMessage) : null,
      } satisfies ConversationSummary;
    });

    return result.sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [allMessages]);

  const availableChannels = useMemo<Array<CommunicationChannel | "all">>(() => {
    const uniqueChannels = Array.from(
      new Set(
        conversations
          .map((conversation) => conversation.channel)
          .filter(
            (value): value is CommunicationChannel =>
              value !== null && value !== "mixed"
          )
      )
    ).sort();

    return ["all", ...uniqueChannels];
  }, [conversations]);

  const availableFolders = useMemo<Array<string | "all">>(() => {
    const uniqueFolders = Array.from(
      new Set(conversations.map((conversation) => conversation.folder))
    ).sort((a, b) => a.localeCompare(b));

    return ["all", ...uniqueFolders];
  }, [conversations]);

  const availableStatuses = useMemo<Array<DeliveryStatus | "all" | "unknown">>(() => {
    const uniqueStatuses = Array.from(
      new Set(conversations.map((conversation) => conversation.latestStatus))
    ).sort();

    return ["all", ...uniqueStatuses] as Array<DeliveryStatus | "all" | "unknown">;
  }, [conversations]);

  const filteredConversations = useMemo<ConversationSummary[]>(() => {
    const normalizedQuery = normalizeText(searchQuery);

    const filtered = conversations.filter((conversation) => {
      if (channel !== "all") {
        if (conversation.channel === null || conversation.channel === "mixed") {
          return false;
        }

        if (conversation.channel !== channel) {
          return false;
        }
      }

      if (folder !== "all" && conversation.folder !== folder) {
        return false;
      }

      if (status !== "all" && conversation.latestStatus !== status) {
        return false;
      }

      if (unreadOnly && !conversation.hasUnreadMessages) {
        return false;
      }

      if (starredOnly && !conversation.hasStarredMessages) {
        return false;
      }

      if (pinnedOnly && !conversation.hasPinnedMessages) {
        return false;
      }

      if (attachmentsOnly && !conversation.hasAttachments) {
        return false;
      }

      if (!includeInternalNotes && conversation.messages.every((message) => getSafeIsInternalNote(message))) {
        return false;
      }

      if (conversation.updatedAt && !isWithinDateRange(conversation.updatedAt, startDate, endDate)) {
        return false;
      }

      if (normalizedQuery) {
        const matches =
          normalizeText(conversation.title).includes(normalizedQuery) ||
          normalizeText(conversation.subject).includes(normalizedQuery) ||
          normalizeText(conversation.previewText).includes(normalizedQuery) ||
          normalizeText(conversation.channel ?? "").includes(normalizedQuery) ||
          normalizeText(conversation.folder).includes(normalizedQuery) ||
          conversation.labels.some((label) =>
            normalizeText(label).includes(normalizedQuery)
          ) ||
          conversation.participants.some((participant) => {
            return (
              normalizeText(participant.name).includes(normalizedQuery) ||
              normalizeText(participant.email).includes(normalizedQuery) ||
              normalizeText(participant.phone).includes(normalizedQuery)
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
        case "oldest": {
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return aTime - bTime;
        }

        case "title-asc":
          return getConversationSortableTitle(a).localeCompare(
            getConversationSortableTitle(b)
          );

        case "title-desc":
          return getConversationSortableTitle(b).localeCompare(
            getConversationSortableTitle(a)
          );

        case "unread-first": {
          const aUnreadScore = a.hasUnreadMessages ? 0 : 1;
          const bUnreadScore = b.hasUnreadMessages ? 0 : 1;

          if (aUnreadScore !== bUnreadScore) {
            return aUnreadScore - bUnreadScore;
          }

          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bTime - aTime;
        }

        case "latest":
        default: {
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bTime - aTime;
        }
      }
    });

    return filtered;
  }, [
    conversations,
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

  const selectedConversation = useMemo<ConversationSummary | null>(() => {
    if (!filteredConversations.length) {
      return null;
    }

    if (!selectedConversationId) {
      return filteredConversations[0] ?? null;
    }

    return (
      filteredConversations.find(
        (conversation) => conversation.conversationId === selectedConversationId
      ) ?? filteredConversations[0] ?? null
    );
  }, [filteredConversations, selectedConversationId]);

  const selectedConversationIndex = useMemo<number>(() => {
    if (!selectedConversation) {
      return -1;
    }

    return filteredConversations.findIndex(
      (conversation) => conversation.conversationId === selectedConversation.conversationId
    );
  }, [filteredConversations, selectedConversation]);

  const sections = useMemo<ConversationSection[]>(() => {
    return buildSections(filteredConversations);
  }, [filteredConversations]);

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

  const selectConversation = (conversationId: string | null) => {
    setSelectedConversationId(conversationId);
  };

  const selectFirstConversation = () => {
    if (!filteredConversations.length) {
      setSelectedConversationId(null);
      return;
    }

    setSelectedConversationId(filteredConversations[0].conversationId);
  };

  const selectNextConversation = () => {
    if (!filteredConversations.length) {
      return;
    }

    if (selectedConversationIndex < 0) {
      setSelectedConversationId(filteredConversations[0].conversationId);
      return;
    }

    const nextConversation =
      filteredConversations[selectedConversationIndex + 1] ?? null;

    if (nextConversation) {
      setSelectedConversationId(nextConversation.conversationId);
    }
  };

  const selectPreviousConversation = () => {
    if (!filteredConversations.length) {
      return;
    }

    if (selectedConversationIndex < 0) {
      setSelectedConversationId(filteredConversations[0].conversationId);
      return;
    }

    const previousConversation =
      filteredConversations[selectedConversationIndex - 1] ?? null;

    if (previousConversation) {
      setSelectedConversationId(previousConversation.conversationId);
    }
  };

  const getConversationById = (
    conversationId: string
  ): ConversationSummary | undefined => {
    return conversations.find(
      (conversation) => conversation.conversationId === conversationId
    );
  };

  return {
    conversations,
    filteredConversations,
    sections,
    selectedConversation,
    selectedConversationId: selectedConversation?.conversationId ?? null,

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

    selectConversation,
    selectFirstConversation,
    selectNextConversation,
    selectPreviousConversation,

    getConversationById,

    totalCount: conversations.length,
    filteredCount: filteredConversations.length,
    unreadConversationCount: conversations.filter((item) => item.hasUnreadMessages).length,
    starredConversationCount: conversations.filter((item) => item.hasStarredMessages).length,
    pinnedConversationCount: conversations.filter((item) => item.hasPinnedMessages).length,
    draftConversationCount: conversations.filter((item) => item.hasDrafts).length,
    scheduledConversationCount: conversations.filter((item) => item.hasScheduledMessages).length,
    attachmentConversationCount: conversations.filter((item) => item.hasAttachments).length,

    availableChannels,
    availableFolders,
    availableStatuses,
  };
}