// src/utils/communications/communicationHelpers.ts

import type {
  CommunicationAttachment,
  CommunicationChannel,
  CommunicationDirection,
  CommunicationFolder,
  CommunicationMessage,
  CommunicationPriority,
  CommunicationStatus,
  ConversationItem,
  ConversationParticipant,
} from "../../types/communications/communication.types";
import type { MessageRecipient } from "../../types/communications/message.types";

type EmailRecipient = {
  name?: string;
  email: string;
};

type GenericParticipant =
  | ConversationParticipant
  | MessageRecipient
  | EmailRecipient
  | null
  | undefined;

export const COMMUNICATION_CHANNEL_LABELS: Record<CommunicationChannel, string> = {
  email: "Email",
  sms: "SMS",
  whatsapp: "WhatsApp",
  call: "Call",
  note: "Note",
  internal_chat: "Internal Chat",
};

export const COMMUNICATION_STATUS_LABELS: Record<CommunicationStatus, string> = {
  draft: "Draft",
  queued: "Queued",
  scheduled: "Scheduled",
  sending: "Sending",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  opened: "Opened",
  clicked: "Clicked",
  replied: "Replied",
  failed: "Failed",
  bounced: "Bounced",
  canceled: "Canceled",
  archived: "Archived",
  deleted: "Deleted",
};

export const COMMUNICATION_PRIORITY_LABELS: Record<CommunicationPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const COMMUNICATION_FOLDER_LABELS: Record<CommunicationFolder, string> = {
  all: "All",
  inbox: "Inbox",
  sent: "Sent",
  drafts: "Drafts",
  scheduled: "Scheduled",
  archived: "Archived",
  starred: "Starred",
  failed: "Failed",
  trash: "Trash",
  spam: "Spam",
};

export function getCommunicationChannelLabel(channel?: CommunicationChannel): string {
  if (!channel) return "Unknown";
  return COMMUNICATION_CHANNEL_LABELS[channel] ?? channel;
}

export function getCommunicationStatusLabel(status?: CommunicationStatus): string {
  if (!status) return "Unknown";
  return COMMUNICATION_STATUS_LABELS[status] ?? status;
}

export function getCommunicationPriorityLabel(
  priority?: CommunicationPriority,
): string {
  if (!priority) return "Medium";
  return COMMUNICATION_PRIORITY_LABELS[priority] ?? priority;
}

export function getCommunicationFolderLabel(folder?: CommunicationFolder): string {
  if (!folder) return "All";
  return COMMUNICATION_FOLDER_LABELS[folder] ?? folder;
}

export function isInboundCommunication(
  direction?: CommunicationDirection,
): boolean {
  return direction === "inbound";
}

export function isOutboundCommunication(
  direction?: CommunicationDirection,
): boolean {
  return direction === "outbound";
}

export function isCommunicationFailed(status?: CommunicationStatus): boolean {
  return status === "failed" || status === "bounced" || status === "canceled";
}

export function isCommunicationPending(status?: CommunicationStatus): boolean {
  return (
    status === "draft" ||
    status === "queued" ||
    status === "scheduled" ||
    status === "sending"
  );
}

export function isCommunicationDelivered(status?: CommunicationStatus): boolean {
  return (
    status === "sent" ||
    status === "delivered" ||
    status === "opened" ||
    status === "clicked" ||
    status === "read" ||
    status === "replied"
  );
}

export function normalizeSearchTerm(value?: string | null): string {
  return (value ?? "").trim().toLowerCase();
}

export function matchesCommunicationSearch(
  conversation: ConversationItem,
  search?: string,
): boolean {
  const term = normalizeSearchTerm(search);
  if (!term) return true;

  const haystack = [
    conversation.subject,
    conversation.snippet,
    conversation.ownerName,
    ...(conversation.tags ?? []),
    ...conversation.participants.flatMap((participant: ConversationParticipant) => [
      participant.name,
      participant.email,
      participant.phone,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(term);
}

export function sortConversationsByLastMessage(
  conversations: ConversationItem[],
  order: "asc" | "desc" = "desc",
): ConversationItem[] {
  return [...conversations].sort((a, b) => {
    const aValue = new Date(
      a.lastMessageAt ?? a.updatedAt ?? a.createdAt,
    ).getTime();
    const bValue = new Date(
      b.lastMessageAt ?? b.updatedAt ?? b.createdAt,
    ).getTime();

    return order === "asc" ? aValue - bValue : bValue - aValue;
  });
}

export function sortMessagesByCreatedAt(
  messages: CommunicationMessage[],
  order: "asc" | "desc" = "asc",
): CommunicationMessage[] {
  return [...messages].sort((a, b) => {
    const aValue = new Date(a.createdAt).getTime();
    const bValue = new Date(b.createdAt).getTime();

    return order === "asc" ? aValue - bValue : bValue - aValue;
  });
}

export function getConversationDisplayTitle(conversation: ConversationItem): string {
  if (conversation.subject?.trim()) return conversation.subject.trim();

  const participantNames = conversation.participants
    .map((participant: ConversationParticipant) => {
      return participant.name || participant.email || participant.phone;
    })
    .filter(Boolean);

  if (participantNames.length > 0) {
    return participantNames.slice(0, 3).join(", ");
  }

  return `${getCommunicationChannelLabel(conversation.channel)} Conversation`;
}

export function getConversationSnippet(conversation: ConversationItem): string {
  return (
    conversation.snippet?.trim() ||
    conversation.lastMessage?.body?.trim() ||
    "No recent message"
  );
}

export function getInitials(name?: string | null): string {
  const value = (name ?? "").trim();
  if (!value) return "?";

  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function getParticipantDisplayName(participant?: GenericParticipant): string {
  if (!participant) return "Unknown";

  if ("name" in participant && participant.name) {
    return participant.name;
  }

  if ("email" in participant && participant.email) {
    return participant.email;
  }

  if ("phone" in participant && participant.phone) {
    return participant.phone;
  }

  return "Unknown";
}

export function getParticipantPrimaryValue(participant?: GenericParticipant): string {
  if (!participant) return "";

  if ("email" in participant && participant.email) {
    return participant.email;
  }

  if ("phone" in participant && participant.phone) {
    return participant.phone;
  }

  return "";
}

export function formatParticipantsList(
  participants: GenericParticipant[],
  limit = 3,
): string {
  if (!participants.length) return "No participants";

  const labels = participants
    .map((participant: GenericParticipant) => getParticipantDisplayName(participant))
    .filter(Boolean);

  if (labels.length <= limit) return labels.join(", ");

  return `${labels.slice(0, limit).join(", ")} +${labels.length - limit}`;
}

export function getUnreadConversationCount(conversations: ConversationItem[]): number {
  return conversations.reduce((total, item) => total + (item.unreadCount || 0), 0);
}

export function getStarredConversationCount(conversations: ConversationItem[]): number {
  return conversations.filter((item) => item.isStarred).length;
}

export function getArchivedConversationCount(conversations: ConversationItem[]): number {
  return conversations.filter((item) => item.isArchived).length;
}

export function groupMessagesByDate(
  messages: CommunicationMessage[],
): Record<string, CommunicationMessage[]> {
  return messages.reduce<Record<string, CommunicationMessage[]>>((acc, message) => {
    const key = toDateKey(message.sentAt ?? message.createdAt);
    if (!acc[key]) acc[key] = [];
    acc[key].push(message);
    return acc;
  }, {});
}

export function toDateKey(value?: string | null): string {
  if (!value) return "Unknown Date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown Date";

  return date.toISOString().slice(0, 10);
}

export function formatCommunicationDate(
  value?: string | null,
  locale = "en-IN",
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatCommunicationDateTime(
  value?: string | null,
  locale = "en-IN",
): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getRelativeTimeFromNow(value?: string | null): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const absMinutes = Math.abs(diffMinutes);

  if (absMinutes < 1) return "just now";

  if (absMinutes < 60) {
    return diffMinutes > 0 ? `in ${absMinutes} min` : `${absMinutes} min ago`;
  }

  const diffHours = Math.round(absMinutes / 60);
  if (diffHours < 24) {
    return diffMinutes > 0 ? `in ${diffHours} hr` : `${diffHours} hr ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  return diffMinutes > 0
    ? `in ${diffDays} day${diffDays > 1 ? "s" : ""}`
    : `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export function truncateText(value?: string | null, maxLength = 120): string {
  const text = (value ?? "").trim();
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function stripHtml(html?: string | null): string {
  if (!html) return "";

  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getMessagePreview(
  message: CommunicationMessage,
  maxLength = 140,
): string {
  const raw =
    message.plainTextBody ||
    stripHtml(message.htmlBody) ||
    message.body ||
    "";

  return truncateText(raw, maxLength) || "No content";
}

export function getAttachmentCount(
  attachments?: CommunicationAttachment[] | null,
): number {
  return attachments?.length ?? 0;
}

export function formatFileSize(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

export function getAttachmentAcceptLabel(
  channel?: CommunicationChannel,
): string {
  switch (channel) {
    case "email":
      return "Documents, images, PDFs and files";
    case "sms":
      return "Images and supported media files";
    case "whatsapp":
      return "Images, videos, documents and audio";
    case "internal_chat":
      return "Files and internal documents";
    default:
      return "Supported attachments";
  }
}

export function buildConversationParticipantMap(
  participants: ConversationParticipant[],
): Record<string, ConversationParticipant> {
  return participants.reduce<Record<string, ConversationParticipant>>(
    (acc, participant: ConversationParticipant) => {
      const key =
        participant.id ||
        participant.email ||
        participant.phone ||
        participant.name;

      if (key) {
        acc[key] = participant;
      }

      return acc;
    },
    {},
  );
}

export function uniqueParticipants(
  participants: ConversationParticipant[],
): ConversationParticipant[] {
  const map = buildConversationParticipantMap(participants);
  return Object.values(map);
}

export function filterConversationsByChannel(
  conversations: ConversationItem[],
  channel?: CommunicationChannel | "all",
): ConversationItem[] {
  if (!channel || channel === "all") return conversations;
  return conversations.filter((item) => item.channel === channel);
}

export function filterConversationsByStatus(
  conversations: ConversationItem[],
  status?: CommunicationStatus | "all",
): ConversationItem[] {
  if (!status || status === "all") return conversations;

  return conversations.filter(
    (item) => item.status === status || item.lastMessage?.status === status,
  );
}

export function filterConversationsByPriority(
  conversations: ConversationItem[],
  priority?: CommunicationPriority | "all",
): ConversationItem[] {
  if (!priority || priority === "all") return conversations;
  return conversations.filter((item) => item.priority === priority);
}

export function filterUnreadConversations(
  conversations: ConversationItem[],
): ConversationItem[] {
  return conversations.filter((item) => item.unreadCount > 0);
}

export function filterStarredConversations(
  conversations: ConversationItem[],
): ConversationItem[] {
  return conversations.filter((item) => item.isStarred);
}

export function filterArchivedConversations(
  conversations: ConversationItem[],
): ConversationItem[] {
  return conversations.filter((item) => item.isArchived);
}