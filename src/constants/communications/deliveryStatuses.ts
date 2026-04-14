// src/constants/communications/deliveryStatuses.ts

import type { CommunicationChannel } from "./communicationChannels";

export type DeliveryStatus =
  | "draft"
  | "queued"
  | "scheduled"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "replied"
  | "failed"
  | "bounced"
  | "cancelled";

export interface DeliveryStatusOption {
  key: DeliveryStatus;
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
  category: "pending" | "success" | "engagement" | "error" | "cancelled";
  channels: Array<CommunicationChannel | "all">;
  isTerminal: boolean;
  isSuccessful: boolean;
  isFailure: boolean;
  showInTimeline: boolean;
}

export const DELIVERY_STATUS_KEYS = {
  DRAFT: "draft",
  QUEUED: "queued",
  SCHEDULED: "scheduled",
  SENDING: "sending",
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
  REPLIED: "replied",
  FAILED: "failed",
  BOUNCED: "bounced",
  CANCELLED: "cancelled",
} as const;

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  draft: "Draft",
  queued: "Queued",
  scheduled: "Scheduled",
  sending: "Sending",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  replied: "Replied",
  failed: "Failed",
  bounced: "Bounced",
  cancelled: "Cancelled",
};

export const DELIVERY_STATUS_SHORT_LABELS: Record<DeliveryStatus, string> = {
  draft: "Draft",
  queued: "Queue",
  scheduled: "Later",
  sending: "Sending",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  replied: "Replied",
  failed: "Failed",
  bounced: "Bounce",
  cancelled: "Cancelled",
};

export const DELIVERY_STATUS_ICONS: Record<DeliveryStatus, string> = {
  draft: "📝",
  queued: "⏳",
  scheduled: "⏰",
  sending: "📡",
  sent: "📤",
  delivered: "✅",
  read: "👁️",
  replied: "↩️",
  failed: "❌",
  bounced: "🚫",
  cancelled: "🛑",
};

export const DELIVERY_STATUS_DESCRIPTIONS: Record<DeliveryStatus, string> = {
  draft: "Message is saved as draft and not yet sent.",
  queued: "Message is waiting in the sending queue.",
  scheduled: "Message is planned to be sent at a future time.",
  sending: "Message is currently being processed and sent.",
  sent: "Message was sent from the system successfully.",
  delivered: "Message was delivered to the recipient device or inbox.",
  read: "Recipient opened or viewed the message.",
  replied: "Recipient responded to the message.",
  failed: "Message sending failed due to a technical or validation issue.",
  bounced: "Email bounced back and was not accepted by recipient server.",
  cancelled: "Scheduled or queued message was cancelled before sending.",
};

export const DELIVERY_STATUS_COLORS: Record<
  DeliveryStatus,
  {
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  }
> = {
  draft: {
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.10)",
    borderColor: "rgba(100,116,139,0.24)",
    textColor: "#475569",
  },
  queued: {
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.10)",
    borderColor: "rgba(139,92,246,0.24)",
    textColor: "#7c3aed",
  },
  scheduled: {
    color: "#7c3aed",
    bgColor: "rgba(124,58,237,0.10)",
    borderColor: "rgba(124,58,237,0.24)",
    textColor: "#6d28d9",
  },
  sending: {
    color: "#2563eb",
    bgColor: "rgba(37,99,235,0.10)",
    borderColor: "rgba(37,99,235,0.24)",
    textColor: "#1d4ed8",
  },
  sent: {
    color: "#0f766e",
    bgColor: "rgba(15,118,110,0.10)",
    borderColor: "rgba(15,118,110,0.24)",
    textColor: "#0f766e",
  },
  delivered: {
    color: "#16a34a",
    bgColor: "rgba(22,163,74,0.10)",
    borderColor: "rgba(22,163,74,0.24)",
    textColor: "#15803d",
  },
  read: {
    color: "#0891b2",
    bgColor: "rgba(8,145,178,0.10)",
    borderColor: "rgba(8,145,178,0.24)",
    textColor: "#0e7490",
  },
  replied: {
    color: "#2563eb",
    bgColor: "rgba(37,99,235,0.10)",
    borderColor: "rgba(37,99,235,0.24)",
    textColor: "#1d4ed8",
  },
  failed: {
    color: "#dc2626",
    bgColor: "rgba(220,38,38,0.10)",
    borderColor: "rgba(220,38,38,0.24)",
    textColor: "#b91c1c",
  },
  bounced: {
    color: "#ea580c",
    bgColor: "rgba(234,88,12,0.10)",
    borderColor: "rgba(234,88,12,0.24)",
    textColor: "#c2410c",
  },
  cancelled: {
    color: "#78716c",
    bgColor: "rgba(120,113,108,0.10)",
    borderColor: "rgba(120,113,108,0.24)",
    textColor: "#57534e",
  },
};

export const DELIVERY_STATUS_OPTIONS: DeliveryStatusOption[] = [
  {
    key: "draft",
    label: "Draft",
    shortLabel: "Draft",
    icon: DELIVERY_STATUS_ICONS.draft,
    description: DELIVERY_STATUS_DESCRIPTIONS.draft,
    color: DELIVERY_STATUS_COLORS.draft.color,
    bgColor: DELIVERY_STATUS_COLORS.draft.bgColor,
    borderColor: DELIVERY_STATUS_COLORS.draft.borderColor,
    textColor: DELIVERY_STATUS_COLORS.draft.textColor,
    enabled: true,
    sortOrder: 1,
    category: "pending",
    channels: ["all", "email", "sms", "whatsapp", "internal"],
    isTerminal: false,
    isSuccessful: false,
    isFailure: false,
    showInTimeline: true,
  },
  {
    key: "queued",
    label: "Queued",
    shortLabel: "Queue",
    icon: DELIVERY_STATUS_ICONS.queued,
    description: DELIVERY_STATUS_DESCRIPTIONS.queued,
    color: DELIVERY_STATUS_COLORS.queued.color,
    bgColor: DELIVERY_STATUS_COLORS.queued.bgColor,
    borderColor: DELIVERY_STATUS_COLORS.queued.borderColor,
    textColor: DELIVERY_STATUS_COLORS.queued.textColor,
    enabled: true,
    sortOrder: 2,
    category: "pending",
    channels: ["all", "email", "sms", "whatsapp"],
    isTerminal: false,
    isSuccessful: false,
    isFailure: false,
    showInTimeline: true,
  },
  {
    key: "scheduled",
    label: "Scheduled",
    shortLabel: "Later",
    icon: DELIVERY_STATUS_ICONS.scheduled,
    description: DELIVERY_STATUS_DESCRIPTIONS.scheduled,
    color: DELIVERY_STATUS_COLORS.scheduled.color,
    bgColor: DELIVERY_STATUS_COLORS.scheduled.bgColor,
    borderColor: DELIVERY_STATUS_COLORS.scheduled.borderColor,
    textColor: DELIVERY_STATUS_COLORS.scheduled.textColor,
    enabled: true,
    sortOrder: 3,
    category: "pending",
    channels: ["all", "email", "sms", "whatsapp"],
    isTerminal: false,
    isSuccessful: false,
    isFailure: false,
    showInTimeline: true,
  },
  {
    key: "sending",
    label: "Sending",
    shortLabel: "Sending",
    icon: DELIVERY_STATUS_ICONS.sending,
    description: DELIVERY_STATUS_DESCRIPTIONS.sending,
    color: DELIVERY_STATUS_COLORS.sending.color,
    bgColor: DELIVERY_STATUS_COLORS.sending.bgColor,
    borderColor: DELIVERY_STATUS_COLORS.sending.borderColor,
    textColor: DELIVERY_STATUS_COLORS.sending.textColor,
    enabled: true,
    sortOrder: 4,
    category: "pending",
    channels: ["all", "email", "sms", "whatsapp"],
    isTerminal: false,
    isSuccessful: false,
    isFailure: false,
    showInTimeline: true,
  },
  {
    key: "sent",
    label: "Sent",
    shortLabel: "Sent",
    icon: DELIVERY_STATUS_ICONS.sent,
    description: DELIVERY_STATUS_DESCRIPTIONS.sent,
    color: DELIVERY_STATUS_COLORS.sent.color,
    bgColor: DELIVERY_STATUS_COLORS.sent.bgColor,
    borderColor: DELIVERY_STATUS_COLORS.sent.borderColor,
    textColor: DELIVERY_STATUS_COLORS.sent.textColor,
    enabled: true,
    sortOrder: 5,
    category: "success",
    channels: ["all", "email", "sms", "whatsapp", "internal"],
    isTerminal: false,
    isSuccessful: true,
    isFailure: false,
    showInTimeline: true,
  },
  {
    key: "delivered",
    label: "Delivered",
    shortLabel: "Delivered",
    icon: DELIVERY_STATUS_ICONS.delivered,
    description: DELIVERY_STATUS_DESCRIPTIONS.delivered,
    color: DELIVERY_STATUS_COLORS.delivered.color,
    bgColor: DELIVERY_STATUS_COLORS.delivered.bgColor,
    borderColor: DELIVERY_STATUS_COLORS.delivered.borderColor,
    textColor: DELIVERY_STATUS_COLORS.delivered.textColor,
    enabled: true,
    sortOrder: 6,
    category: "success",
    channels: ["all", "email", "sms", "whatsapp"],
    isTerminal: false,
    isSuccessful: true,
    isFailure: false,
    showInTimeline: true,
  },
  {
    key: "read",
    label: "Read",
    shortLabel: "Read",
    icon: DELIVERY_STATUS_ICONS.read,
    description: DELIVERY_STATUS_DESCRIPTIONS.read,
    color: DELIVERY_STATUS_COLORS.read.color,
    bgColor: DELIVERY_STATUS_COLORS.read.bgColor,
    borderColor: DELIVERY_STATUS_COLORS.read.borderColor,
    textColor: DELIVERY_STATUS_COLORS.read.textColor,
    enabled: true,
    sortOrder: 7,
    category: "engagement",
    channels: ["all", "email", "sms", "whatsapp"],
    isTerminal: false,
    isSuccessful: true,
    isFailure: false,
    showInTimeline: true,
  },
  {
    key: "replied",
    label: "Replied",
    shortLabel: "Replied",
    icon: DELIVERY_STATUS_ICONS.replied,
    description: DELIVERY_STATUS_DESCRIPTIONS.replied,
    color: DELIVERY_STATUS_COLORS.replied.color,
    bgColor: DELIVERY_STATUS_COLORS.replied.bgColor,
    borderColor: DELIVERY_STATUS_COLORS.replied.borderColor,
    textColor: DELIVERY_STATUS_COLORS.replied.textColor,
    enabled: true,
    sortOrder: 8,
    category: "engagement",
    channels: ["all", "email", "sms", "whatsapp", "internal"],
    isTerminal: true,
    isSuccessful: true,
    isFailure: false,
    showInTimeline: true,
  },
  {
    key: "failed",
    label: "Failed",
    shortLabel: "Failed",
    icon: DELIVERY_STATUS_ICONS.failed,
    description: DELIVERY_STATUS_DESCRIPTIONS.failed,
    color: DELIVERY_STATUS_COLORS.failed.color,
    bgColor: DELIVERY_STATUS_COLORS.failed.bgColor,
    borderColor: DELIVERY_STATUS_COLORS.failed.borderColor,
    textColor: DELIVERY_STATUS_COLORS.failed.textColor,
    enabled: true,
    sortOrder: 9,
    category: "error",
    channels: ["all", "email", "sms", "whatsapp"],
    isTerminal: true,
    isSuccessful: false,
    isFailure: true,
    showInTimeline: true,
  },
  {
    key: "bounced",
    label: "Bounced",
    shortLabel: "Bounce",
    icon: DELIVERY_STATUS_ICONS.bounced,
    description: DELIVERY_STATUS_DESCRIPTIONS.bounced,
    color: DELIVERY_STATUS_COLORS.bounced.color,
    bgColor: DELIVERY_STATUS_COLORS.bounced.bgColor,
    borderColor: DELIVERY_STATUS_COLORS.bounced.borderColor,
    textColor: DELIVERY_STATUS_COLORS.bounced.textColor,
    enabled: true,
    sortOrder: 10,
    category: "error",
    channels: ["all", "email"],
    isTerminal: true,
    isSuccessful: false,
    isFailure: true,
    showInTimeline: true,
  },
  {
    key: "cancelled",
    label: "Cancelled",
    shortLabel: "Cancelled",
    icon: DELIVERY_STATUS_ICONS.cancelled,
    description: DELIVERY_STATUS_DESCRIPTIONS.cancelled,
    color: DELIVERY_STATUS_COLORS.cancelled.color,
    bgColor: DELIVERY_STATUS_COLORS.cancelled.bgColor,
    borderColor: DELIVERY_STATUS_COLORS.cancelled.borderColor,
    textColor: DELIVERY_STATUS_COLORS.cancelled.textColor,
    enabled: true,
    sortOrder: 11,
    category: "cancelled",
    channels: ["all", "email", "sms", "whatsapp"],
    isTerminal: true,
    isSuccessful: false,
    isFailure: false,
    showInTimeline: true,
  },
];

export const ACTIVE_DELIVERY_STATUS_OPTIONS = DELIVERY_STATUS_OPTIONS.filter(
  (status) => status.enabled
).sort((a, b) => a.sortOrder - b.sortOrder);

export function isDeliveryStatus(value: unknown): value is DeliveryStatus {
  return (
    value === "draft" ||
    value === "queued" ||
    value === "scheduled" ||
    value === "sending" ||
    value === "sent" ||
    value === "delivered" ||
    value === "read" ||
    value === "replied" ||
    value === "failed" ||
    value === "bounced" ||
    value === "cancelled"
  );
}

export function getDeliveryStatusLabel(status: DeliveryStatus): string {
  return DELIVERY_STATUS_LABELS[status];
}

export function getDeliveryStatusShortLabel(status: DeliveryStatus): string {
  return DELIVERY_STATUS_SHORT_LABELS[status];
}

export function getDeliveryStatusIcon(status: DeliveryStatus): string {
  return DELIVERY_STATUS_ICONS[status];
}

export function getDeliveryStatusDescription(status: DeliveryStatus): string {
  return DELIVERY_STATUS_DESCRIPTIONS[status];
}

export function getDeliveryStatusColors(status: DeliveryStatus): {
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
} {
  return DELIVERY_STATUS_COLORS[status];
}

export function getDeliveryStatusOption(
  status: DeliveryStatus
): DeliveryStatusOption | undefined {
  return DELIVERY_STATUS_OPTIONS.find((item) => item.key === status);
}

export function getEnabledDeliveryStatuses(): DeliveryStatusOption[] {
  return ACTIVE_DELIVERY_STATUS_OPTIONS;
}

export function getDeliveryStatusFilterOptions(): Array<{
  label: string;
  value: DeliveryStatus;
}> {
  return ACTIVE_DELIVERY_STATUS_OPTIONS.map((status) => ({
    label: status.label,
    value: status.key,
  }));
}

export function isSuccessfulDeliveryStatus(status: DeliveryStatus): boolean {
  return Boolean(getDeliveryStatusOption(status)?.isSuccessful);
}

export function isFailureDeliveryStatus(status: DeliveryStatus): boolean {
  return Boolean(getDeliveryStatusOption(status)?.isFailure);
}

export function isTerminalDeliveryStatus(status: DeliveryStatus): boolean {
  return Boolean(getDeliveryStatusOption(status)?.isTerminal);
}

export function shouldShowStatusInTimeline(status: DeliveryStatus): boolean {
  return Boolean(getDeliveryStatusOption(status)?.showInTimeline);
}

export function isStatusAllowedForChannel(
  status: DeliveryStatus,
  channel: CommunicationChannel | "all"
): boolean {
  const statusOption = getDeliveryStatusOption(status);

  if (!statusOption) {
    return false;
  }

  return statusOption.channels.includes(channel);
}

export function getAllowedChannelsForStatus(
  status: DeliveryStatus
): Array<CommunicationChannel | "all"> {
  return getDeliveryStatusOption(status)?.channels ?? ["all"];
}

export function getDeliveryStatusesByCategory(
  category: DeliveryStatusOption["category"]
): DeliveryStatusOption[] {
  return ACTIVE_DELIVERY_STATUS_OPTIONS.filter(
    (status) => status.category === category
  );
}

export function getDefaultDeliveryStatusForChannel(
  channel: CommunicationChannel
): DeliveryStatus {
  switch (channel) {
    case "internal":
      return "sent";
    case "email":
      return "draft";
    case "sms":
      return "draft";
    case "whatsapp":
      return "draft";
    default:
      return "draft";
  }
}