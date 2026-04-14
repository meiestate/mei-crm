// src/hooks/communications/useConversationDetail.ts

import { useMemo, useState } from "react";
import type { CommunicationChannel } from "../../constants/communications/communicationChannels";
import {
  getMockMessages,
  type MessageAttachment,
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
  parentMessageId?: string;
  replyCount?: number;
};

type SafeParticipant = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
};

export interface ConversationParticipant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
}

export interface ConversationAttachment extends MessageAttachment {
  messageId: string;
  messageCreatedAt: string;
  senderName: string;
  channel: CommunicationChannel;
}

export interface ConversationDetail {
  conversationId: string;
  threadId: string | null;
  title: string;
  subject?: string;
  channel: CommunicationChannel | "mixed" | null;
  messages: MessageRecord[];
  latestMessage: MessageRecord | null;
  oldestMessage: MessageRecord | null;
  participants: ConversationParticipant[];
  attachments: ConversationAttachment[];
  internalNotes: MessageRecord[];
  externalMessages: MessageRecord[];
  unreadCount: number;
  totalMessages: number;
  totalAttachments: number;
  hasAttachments: boolean;
  hasInternalNotes: boolean;
  hasUnreadMessages: boolean;
  hasDrafts: boolean;
  hasScheduledMessages: boolean;
  hasStarredMessages: boolean;
  hasPinnedMessages: boolean;
  labels: string[];
  startedAt: string | null;
  updatedAt: string | null;
}

export interface UseConversationDetailOptions {
  conversationId?: string | null;
  autoSelectLatestMessage?: boolean;
}

export interface UseConversationDetailResult {
  conversation: ConversationDetail | null;
  isFound: boolean;
  selectedMessage: MessageRecord | null;
  selectedMessageIndex: number;
  selectedMessageAttachments: ConversationAttachment[];
  replyTarget: MessageRecord | null;
  previousMessage: MessageRecord | null;
  nextMessage: MessageRecord | null;
  selectMessageById: (messageId: string) => void;
  selectLatestMessage: () => void;
  selectOldestMessage: () => void;
  selectPreviousMessage: () => void;
  selectNextMessage: () => void;
  getMessageById: (messageId: string) => MessageRecord | undefined;
  getMessageAttachments: (messageId: string) => ConversationAttachment[];
  getRepliesToMessage: (messageId: string) => MessageRecord[];
  refreshKey: number;
  refreshConversation: () => void;
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

function getSafeParentMessageId(message: MessageRecord): string | undefined {
  const safeMessage = message as SafeMessageRecord;
  return safeMessage.parentMessageId;
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

function sortMessagesAscending(messages: MessageRecord[]): MessageRecord[] {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

function buildConversationParticipants(messages: MessageRecord[]): ConversationParticipant[] {
  const participantMap = new Map<string, ConversationParticipant>();

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

function buildConversationAttachments(
  messages: MessageRecord[]
): ConversationAttachment[] {
  return messages.flatMap((message) =>
    message.attachments.map((attachment) => ({
      ...attachment,
      messageId: message.id,
      messageCreatedAt: message.createdAt,
      senderName: message.sender.name,
      channel: message.channel,
    }))
  );
}

function buildConversationLabels(messages: MessageRecord[]): string[] {
  return Array.from(
    new Set(messages.flatMap((message) => getSafeLabels(message)))
  ).sort((a, b) => a.localeCompare(b));
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

function buildConversationTitle(messages: MessageRecord[]): { title: string; subject?: string } {
  const subjectMessage = messages.find(
    (message) => typeof message.subject === "string" && message.subject.trim()
  );

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

export default function useConversationDetail(
  options: UseConversationDetailOptions = {}
): UseConversationDetailResult {
  const {
    conversationId = null,
    autoSelectLatestMessage = true,
  } = options;

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const allMessages = useMemo(() => getMockMessages(), [refreshKey]);

  const conversation = useMemo<ConversationDetail | null>(() => {
    if (!conversationId) {
      return null;
    }

    const matchedMessages = sortMessagesAscending(
      allMessages.filter((message) => message.conversationId === conversationId)
    );

    if (!matchedMessages.length) {
      return null;
    }

    const latestMessage = matchedMessages[matchedMessages.length - 1] ?? null;
    const oldestMessage = matchedMessages[0] ?? null;
    const participants = buildConversationParticipants(matchedMessages);
    const attachments = buildConversationAttachments(matchedMessages);
    const internalNotes = matchedMessages.filter((message) =>
      getSafeIsInternalNote(message)
    );
    const externalMessages = matchedMessages.filter(
      (message) => !getSafeIsInternalNote(message)
    );
    const labels = buildConversationLabels(matchedMessages);
    const { title, subject } = buildConversationTitle(matchedMessages);

    const hasDrafts = matchedMessages.some((message) => getSafeIsDraft(message));
    const hasScheduledMessages = matchedMessages.some((message) =>
      getSafeIsScheduled(message)
    );
    const hasStarredMessages = matchedMessages.some((message) =>
      getSafeIsStarred(message)
    );
    const hasPinnedMessages = matchedMessages.some((message) =>
      getSafeIsPinned(message)
    );

    return {
      conversationId,
      threadId: latestMessage?.threadId ?? null,
      title,
      subject,
      channel: detectConversationChannel(matchedMessages),
      messages: matchedMessages,
      latestMessage,
      oldestMessage,
      participants,
      attachments,
      internalNotes,
      externalMessages,
      unreadCount: matchedMessages.filter((message) => !getSafeIsRead(message)).length,
      totalMessages: matchedMessages.length,
      totalAttachments: attachments.length,
      hasAttachments: attachments.length > 0,
      hasInternalNotes: internalNotes.length > 0,
      hasUnreadMessages: matchedMessages.some((message) => !getSafeIsRead(message)),
      hasDrafts,
      hasScheduledMessages,
      hasStarredMessages,
      hasPinnedMessages,
      labels,
      startedAt: oldestMessage?.createdAt ?? null,
      updatedAt: latestMessage ? getSafeUpdatedAt(latestMessage) : null,
    };
  }, [allMessages, conversationId]);

  const selectedMessage = useMemo<MessageRecord | null>(() => {
    if (!conversation) {
      return null;
    }

    if (selectedMessageId) {
      const explicitSelection =
        conversation.messages.find((message) => message.id === selectedMessageId) ?? null;

      if (explicitSelection) {
        return explicitSelection;
      }
    }

    if (autoSelectLatestMessage) {
      return conversation.latestMessage;
    }

    return conversation.oldestMessage;
  }, [conversation, selectedMessageId, autoSelectLatestMessage]);

  const selectedMessageIndex = useMemo<number>(() => {
    if (!conversation || !selectedMessage) {
      return -1;
    }

    return conversation.messages.findIndex((message) => message.id === selectedMessage.id);
  }, [conversation, selectedMessage]);

  const selectedMessageAttachments = useMemo<ConversationAttachment[]>(() => {
    if (!conversation || !selectedMessage) {
      return [];
    }

    return conversation.attachments.filter(
      (attachment) => attachment.messageId === selectedMessage.id
    );
  }, [conversation, selectedMessage]);

  const replyTarget = useMemo<MessageRecord | null>(() => {
    if (!conversation || !selectedMessage) {
      return null;
    }

    const parentMessageId = getSafeParentMessageId(selectedMessage);

    if (parentMessageId) {
      return (
        conversation.messages.find((message) => message.id === parentMessageId) ?? null
      );
    }

    if (selectedMessageIndex > 0) {
      return conversation.messages[selectedMessageIndex - 1] ?? null;
    }

    return null;
  }, [conversation, selectedMessage, selectedMessageIndex]);

  const previousMessage = useMemo<MessageRecord | null>(() => {
    if (!conversation || selectedMessageIndex <= 0) {
      return null;
    }

    return conversation.messages[selectedMessageIndex - 1] ?? null;
  }, [conversation, selectedMessageIndex]);

  const nextMessage = useMemo<MessageRecord | null>(() => {
    if (!conversation || selectedMessageIndex < 0) {
      return null;
    }

    return conversation.messages[selectedMessageIndex + 1] ?? null;
  }, [conversation, selectedMessageIndex]);

  const selectMessageById = (messageId: string) => {
    setSelectedMessageId(messageId);
  };

  const selectLatestMessage = () => {
    if (!conversation?.latestMessage) {
      return;
    }

    setSelectedMessageId(conversation.latestMessage.id);
  };

  const selectOldestMessage = () => {
    if (!conversation?.oldestMessage) {
      return;
    }

    setSelectedMessageId(conversation.oldestMessage.id);
  };

  const selectPreviousMessage = () => {
    if (!previousMessage) {
      return;
    }

    setSelectedMessageId(previousMessage.id);
  };

  const selectNextMessage = () => {
    if (!nextMessage) {
      return;
    }

    setSelectedMessageId(nextMessage.id);
  };

  const getMessageById = (messageId: string): MessageRecord | undefined => {
    return conversation?.messages.find((message) => message.id === messageId);
  };

  const getMessageAttachments = (messageId: string): ConversationAttachment[] => {
    if (!conversation) {
      return [];
    }

    return conversation.attachments.filter(
      (attachment) => attachment.messageId === messageId
    );
  };

  const getRepliesToMessage = (messageId: string): MessageRecord[] => {
    if (!conversation) {
      return [];
    }

    return conversation.messages.filter(
      (message) => getSafeParentMessageId(message) === messageId
    );
  };

  const refreshConversation = () => {
    setRefreshKey((current) => current + 1);
  };

  return {
    conversation,
    isFound: Boolean(conversation),
    selectedMessage,
    selectedMessageIndex,
    selectedMessageAttachments,
    replyTarget,
    previousMessage,
    nextMessage,
    selectMessageById,
    selectLatestMessage,
    selectOldestMessage,
    selectPreviousMessage,
    selectNextMessage,
    getMessageById,
    getMessageAttachments,
    getRepliesToMessage,
    refreshKey,
    refreshConversation,
  };
}