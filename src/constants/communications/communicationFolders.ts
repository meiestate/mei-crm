// src/constants/communications/communicationFolders.ts

import type { CommunicationChannel } from "./communicationChannels";

export type ConversationFolder =
  | "inbox"
  | "sent"
  | "drafts"
  | "scheduled"
  | "archived"
  | "spam"
  | "trash";

export interface CommunicationFolderOption {
  key: ConversationFolder;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  enabled: boolean;
  sortOrder: number;
  supportsUnread: boolean;
  supportsBulkActions: boolean;
  allowedChannels: Array<CommunicationChannel | "all">;
}

export const COMMUNICATION_FOLDER_KEYS = {
  INBOX: "inbox",
  SENT: "sent",
  DRAFTS: "drafts",
  SCHEDULED: "scheduled",
  ARCHIVED: "archived",
  SPAM: "spam",
  TRASH: "trash",
} as const;

export const COMMUNICATION_FOLDER_LABELS: Record<ConversationFolder, string> = {
  inbox: "Inbox",
  sent: "Sent",
  drafts: "Drafts",
  scheduled: "Scheduled",
  archived: "Archived",
  spam: "Spam",
  trash: "Trash",
};

export const COMMUNICATION_FOLDER_SHORT_LABELS: Record<
  ConversationFolder,
  string
> = {
  inbox: "Inbox",
  sent: "Sent",
  drafts: "Drafts",
  scheduled: "Later",
  archived: "Archive",
  spam: "Spam",
  trash: "Trash",
};

export const COMMUNICATION_FOLDER_ICONS: Record<ConversationFolder, string> = {
  inbox: "📥",
  sent: "📤",
  drafts: "📝",
  scheduled: "⏰",
  archived: "🗂️",
  spam: "⚠️",
  trash: "🗑️",
};

export const COMMUNICATION_FOLDER_DESCRIPTIONS: Record<
  ConversationFolder,
  string
> = {
  inbox: "Incoming customer conversations waiting for action or review.",
  sent: "Messages and emails already sent to leads, contacts, and customers.",
  drafts: "Saved drafts that are not sent yet.",
  scheduled: "Messages planned to be sent later at a selected time.",
  archived: "Closed or low-priority conversations moved out of the inbox.",
  spam: "Suspicious, unwanted, or irrelevant communication threads.",
  trash: "Deleted conversations that may be restored later.",
};

export const COMMUNICATION_FOLDER_COLORS: Record<
  ConversationFolder,
  {
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  }
> = {
  inbox: {
    color: "#2563eb",
    bgColor: "rgba(37,99,235,0.10)",
    borderColor: "rgba(37,99,235,0.24)",
    textColor: "#1d4ed8",
  },
  sent: {
    color: "#16a34a",
    bgColor: "rgba(22,163,74,0.10)",
    borderColor: "rgba(22,163,74,0.24)",
    textColor: "#15803d",
  },
  drafts: {
    color: "#d97706",
    bgColor: "rgba(217,119,6,0.10)",
    borderColor: "rgba(217,119,6,0.24)",
    textColor: "#b45309",
  },
  scheduled: {
    color: "#7c3aed",
    bgColor: "rgba(124,58,237,0.10)",
    borderColor: "rgba(124,58,237,0.24)",
    textColor: "#6d28d9",
  },
  archived: {
    color: "#475569",
    bgColor: "rgba(71,85,105,0.10)",
    borderColor: "rgba(71,85,105,0.24)",
    textColor: "#334155",
  },
  spam: {
    color: "#dc2626",
    bgColor: "rgba(220,38,38,0.10)",
    borderColor: "rgba(220,38,38,0.24)",
    textColor: "#b91c1c",
  },
  trash: {
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.10)",
    borderColor: "rgba(100,116,139,0.24)",
    textColor: "#475569",
  },
};

export const COMMUNICATION_FOLDER_OPTIONS: CommunicationFolderOption[] = [
  {
    key: "inbox",
    label: "Inbox",
    shortLabel: "Inbox",
    icon: COMMUNICATION_FOLDER_ICONS.inbox,
    description: COMMUNICATION_FOLDER_DESCRIPTIONS.inbox,
    color: COMMUNICATION_FOLDER_COLORS.inbox.color,
    bgColor: COMMUNICATION_FOLDER_COLORS.inbox.bgColor,
    borderColor: COMMUNICATION_FOLDER_COLORS.inbox.borderColor,
    textColor: COMMUNICATION_FOLDER_COLORS.inbox.textColor,
    enabled: true,
    sortOrder: 1,
    supportsUnread: true,
    supportsBulkActions: true,
    allowedChannels: ["all", "email", "sms", "whatsapp", "internal"],
  },
  {
    key: "sent",
    label: "Sent",
    shortLabel: "Sent",
    icon: COMMUNICATION_FOLDER_ICONS.sent,
    description: COMMUNICATION_FOLDER_DESCRIPTIONS.sent,
    color: COMMUNICATION_FOLDER_COLORS.sent.color,
    bgColor: COMMUNICATION_FOLDER_COLORS.sent.bgColor,
    borderColor: COMMUNICATION_FOLDER_COLORS.sent.borderColor,
    textColor: COMMUNICATION_FOLDER_COLORS.sent.textColor,
    enabled: true,
    sortOrder: 2,
    supportsUnread: false,
    supportsBulkActions: true,
    allowedChannels: ["all", "email", "sms", "whatsapp", "internal"],
  },
  {
    key: "drafts",
    label: "Drafts",
    shortLabel: "Drafts",
    icon: COMMUNICATION_FOLDER_ICONS.drafts,
    description: COMMUNICATION_FOLDER_DESCRIPTIONS.drafts,
    color: COMMUNICATION_FOLDER_COLORS.drafts.color,
    bgColor: COMMUNICATION_FOLDER_COLORS.drafts.bgColor,
    borderColor: COMMUNICATION_FOLDER_COLORS.drafts.borderColor,
    textColor: COMMUNICATION_FOLDER_COLORS.drafts.textColor,
    enabled: true,
    sortOrder: 3,
    supportsUnread: false,
    supportsBulkActions: true,
    allowedChannels: ["all", "email", "sms", "whatsapp", "internal"],
  },
  {
    key: "scheduled",
    label: "Scheduled",
    shortLabel: "Later",
    icon: COMMUNICATION_FOLDER_ICONS.scheduled,
    description: COMMUNICATION_FOLDER_DESCRIPTIONS.scheduled,
    color: COMMUNICATION_FOLDER_COLORS.scheduled.color,
    bgColor: COMMUNICATION_FOLDER_COLORS.scheduled.bgColor,
    borderColor: COMMUNICATION_FOLDER_COLORS.scheduled.borderColor,
    textColor: COMMUNICATION_FOLDER_COLORS.scheduled.textColor,
    enabled: true,
    sortOrder: 4,
    supportsUnread: false,
    supportsBulkActions: true,
    allowedChannels: ["all", "email", "sms", "whatsapp"],
  },
  {
    key: "archived",
    label: "Archived",
    shortLabel: "Archive",
    icon: COMMUNICATION_FOLDER_ICONS.archived,
    description: COMMUNICATION_FOLDER_DESCRIPTIONS.archived,
    color: COMMUNICATION_FOLDER_COLORS.archived.color,
    bgColor: COMMUNICATION_FOLDER_COLORS.archived.bgColor,
    borderColor: COMMUNICATION_FOLDER_COLORS.archived.borderColor,
    textColor: COMMUNICATION_FOLDER_COLORS.archived.textColor,
    enabled: true,
    sortOrder: 5,
    supportsUnread: false,
    supportsBulkActions: true,
    allowedChannels: ["all", "email", "sms", "whatsapp", "internal"],
  },
  {
    key: "spam",
    label: "Spam",
    shortLabel: "Spam",
    icon: COMMUNICATION_FOLDER_ICONS.spam,
    description: COMMUNICATION_FOLDER_DESCRIPTIONS.spam,
    color: COMMUNICATION_FOLDER_COLORS.spam.color,
    bgColor: COMMUNICATION_FOLDER_COLORS.spam.bgColor,
    borderColor: COMMUNICATION_FOLDER_COLORS.spam.borderColor,
    textColor: COMMUNICATION_FOLDER_COLORS.spam.textColor,
    enabled: true,
    sortOrder: 6,
    supportsUnread: false,
    supportsBulkActions: true,
    allowedChannels: ["all", "email", "sms", "whatsapp"],
  },
  {
    key: "trash",
    label: "Trash",
    shortLabel: "Trash",
    icon: COMMUNICATION_FOLDER_ICONS.trash,
    description: COMMUNICATION_FOLDER_DESCRIPTIONS.trash,
    color: COMMUNICATION_FOLDER_COLORS.trash.color,
    bgColor: COMMUNICATION_FOLDER_COLORS.trash.bgColor,
    borderColor: COMMUNICATION_FOLDER_COLORS.trash.borderColor,
    textColor: COMMUNICATION_FOLDER_COLORS.trash.textColor,
    enabled: true,
    sortOrder: 7,
    supportsUnread: false,
    supportsBulkActions: true,
    allowedChannels: ["all", "email", "sms", "whatsapp", "internal"],
  },
];

export const ACTIVE_COMMUNICATION_FOLDER_OPTIONS =
  COMMUNICATION_FOLDER_OPTIONS.filter((folder) => folder.enabled).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

export function isConversationFolder(value: unknown): value is ConversationFolder {
  return (
    value === "inbox" ||
    value === "sent" ||
    value === "drafts" ||
    value === "scheduled" ||
    value === "archived" ||
    value === "spam" ||
    value === "trash"
  );
}

export function getCommunicationFolderLabel(folder: ConversationFolder): string {
  return COMMUNICATION_FOLDER_LABELS[folder];
}

export function getCommunicationFolderShortLabel(
  folder: ConversationFolder
): string {
  return COMMUNICATION_FOLDER_SHORT_LABELS[folder];
}

export function getCommunicationFolderIcon(folder: ConversationFolder): string {
  return COMMUNICATION_FOLDER_ICONS[folder];
}

export function getCommunicationFolderDescription(
  folder: ConversationFolder
): string {
  return COMMUNICATION_FOLDER_DESCRIPTIONS[folder];
}

export function getCommunicationFolderColors(folder: ConversationFolder): {
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
} {
  return COMMUNICATION_FOLDER_COLORS[folder];
}

export function getCommunicationFolderOption(
  folder: ConversationFolder
): CommunicationFolderOption | undefined {
  return COMMUNICATION_FOLDER_OPTIONS.find((item) => item.key === folder);
}

export function getEnabledCommunicationFolders(): CommunicationFolderOption[] {
  return ACTIVE_COMMUNICATION_FOLDER_OPTIONS;
}

export function getCommunicationFolderFilterOptions(): Array<{
  label: string;
  value: ConversationFolder;
}> {
  return ACTIVE_COMMUNICATION_FOLDER_OPTIONS.map((folder) => ({
    label: folder.label,
    value: folder.key,
  }));
}

export function folderSupportsUnread(folder: ConversationFolder): boolean {
  return Boolean(getCommunicationFolderOption(folder)?.supportsUnread);
}

export function folderSupportsBulkActions(folder: ConversationFolder): boolean {
  return Boolean(getCommunicationFolderOption(folder)?.supportsBulkActions);
}

export function isChannelAllowedInFolder(
  folder: ConversationFolder,
  channel: CommunicationChannel | "all"
): boolean {
  const folderOption = getCommunicationFolderOption(folder);

  if (!folderOption) {
    return false;
  }

  return folderOption.allowedChannels.includes(channel);
}

export function getAllowedChannelsForFolder(
  folder: ConversationFolder
): Array<CommunicationChannel | "all"> {
  return getCommunicationFolderOption(folder)?.allowedChannels ?? ["all"];
}