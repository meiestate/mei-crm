// src/constants/communications/communicationChannels.ts

export type CommunicationChannel = "email" | "sms" | "whatsapp" | "internal";

export interface CommunicationChannelOption {
  key: CommunicationChannel | "all";
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
}

export const COMMUNICATION_CHANNEL_KEYS = {
  ALL: "all",
  EMAIL: "email",
  SMS: "sms",
  WHATSAPP: "whatsapp",
  INTERNAL: "internal",
} as const;

export const COMMUNICATION_CHANNEL_LABELS: Record<CommunicationChannel, string> = {
  email: "Email",
  sms: "SMS",
  whatsapp: "WhatsApp",
  internal: "Internal Note",
};

export const COMMUNICATION_CHANNEL_SHORT_LABELS: Record<
  CommunicationChannel,
  string
> = {
  email: "Email",
  sms: "SMS",
  whatsapp: "WA",
  internal: "Note",
};

export const COMMUNICATION_CHANNEL_ICONS: Record<CommunicationChannel, string> = {
  email: "✉️",
  sms: "💬",
  whatsapp: "🟢",
  internal: "📝",
};

export const COMMUNICATION_CHANNEL_DESCRIPTIONS: Record<
  CommunicationChannel,
  string
> = {
  email: "Professional email conversations with leads, contacts, and customers.",
  sms: "Quick SMS-based communication for reminders and follow-ups.",
  whatsapp: "Instant WhatsApp communication for customer engagement.",
  internal: "Private internal notes for team collaboration and deal context.",
};

export const COMMUNICATION_CHANNEL_COLORS: Record<
  CommunicationChannel,
  {
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  }
> = {
  email: {
    color: "#2563eb",
    bgColor: "rgba(37,99,235,0.10)",
    borderColor: "rgba(37,99,235,0.24)",
    textColor: "#1d4ed8",
  },
  sms: {
    color: "#7c3aed",
    bgColor: "rgba(124,58,237,0.10)",
    borderColor: "rgba(124,58,237,0.24)",
    textColor: "#6d28d9",
  },
  whatsapp: {
    color: "#16a34a",
    bgColor: "rgba(22,163,74,0.10)",
    borderColor: "rgba(22,163,74,0.24)",
    textColor: "#15803d",
  },
  internal: {
    color: "#d97706",
    bgColor: "rgba(217,119,6,0.10)",
    borderColor: "rgba(217,119,6,0.24)",
    textColor: "#b45309",
  },
};

export const COMMUNICATION_CHANNEL_OPTIONS: CommunicationChannelOption[] = [
  {
    key: "all",
    label: "All Channels",
    shortLabel: "All",
    icon: "📨",
    description: "View conversations across all channels in one place.",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.10)",
    borderColor: "rgba(100,116,139,0.24)",
    textColor: "#475569",
    enabled: true,
    sortOrder: 0,
  },
  {
    key: "email",
    label: "Email",
    shortLabel: "Email",
    icon: COMMUNICATION_CHANNEL_ICONS.email,
    description: COMMUNICATION_CHANNEL_DESCRIPTIONS.email,
    color: COMMUNICATION_CHANNEL_COLORS.email.color,
    bgColor: COMMUNICATION_CHANNEL_COLORS.email.bgColor,
    borderColor: COMMUNICATION_CHANNEL_COLORS.email.borderColor,
    textColor: COMMUNICATION_CHANNEL_COLORS.email.textColor,
    enabled: true,
    sortOrder: 1,
  },
  {
    key: "sms",
    label: "SMS",
    shortLabel: "SMS",
    icon: COMMUNICATION_CHANNEL_ICONS.sms,
    description: COMMUNICATION_CHANNEL_DESCRIPTIONS.sms,
    color: COMMUNICATION_CHANNEL_COLORS.sms.color,
    bgColor: COMMUNICATION_CHANNEL_COLORS.sms.bgColor,
    borderColor: COMMUNICATION_CHANNEL_COLORS.sms.borderColor,
    textColor: COMMUNICATION_CHANNEL_COLORS.sms.textColor,
    enabled: true,
    sortOrder: 2,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    shortLabel: "WA",
    icon: COMMUNICATION_CHANNEL_ICONS.whatsapp,
    description: COMMUNICATION_CHANNEL_DESCRIPTIONS.whatsapp,
    color: COMMUNICATION_CHANNEL_COLORS.whatsapp.color,
    bgColor: COMMUNICATION_CHANNEL_COLORS.whatsapp.bgColor,
    borderColor: COMMUNICATION_CHANNEL_COLORS.whatsapp.borderColor,
    textColor: COMMUNICATION_CHANNEL_COLORS.whatsapp.textColor,
    enabled: true,
    sortOrder: 3,
  },
  {
    key: "internal",
    label: "Internal Note",
    shortLabel: "Note",
    icon: COMMUNICATION_CHANNEL_ICONS.internal,
    description: COMMUNICATION_CHANNEL_DESCRIPTIONS.internal,
    color: COMMUNICATION_CHANNEL_COLORS.internal.color,
    bgColor: COMMUNICATION_CHANNEL_COLORS.internal.bgColor,
    borderColor: COMMUNICATION_CHANNEL_COLORS.internal.borderColor,
    textColor: COMMUNICATION_CHANNEL_COLORS.internal.textColor,
    enabled: true,
    sortOrder: 4,
  },
];

export const ACTIVE_COMMUNICATION_CHANNEL_OPTIONS =
  COMMUNICATION_CHANNEL_OPTIONS.filter((channel) => channel.enabled).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

export function isCommunicationChannel(
  value: unknown
): value is CommunicationChannel {
  return (
    value === "email" ||
    value === "sms" ||
    value === "whatsapp" ||
    value === "internal"
  );
}

export function isCommunicationChannelOrAll(
  value: unknown
): value is CommunicationChannel | "all" {
  return value === "all" || isCommunicationChannel(value);
}

export function getCommunicationChannelLabel(
  channel: CommunicationChannel | "all"
): string {
  if (channel === "all") {
    return "All Channels";
  }

  return COMMUNICATION_CHANNEL_LABELS[channel];
}

export function getCommunicationChannelShortLabel(
  channel: CommunicationChannel | "all"
): string {
  if (channel === "all") {
    return "All";
  }

  return COMMUNICATION_CHANNEL_SHORT_LABELS[channel];
}

export function getCommunicationChannelIcon(
  channel: CommunicationChannel | "all"
): string {
  if (channel === "all") {
    return "📨";
  }

  return COMMUNICATION_CHANNEL_ICONS[channel];
}

export function getCommunicationChannelDescription(
  channel: CommunicationChannel | "all"
): string {
  if (channel === "all") {
    return "View conversations across all channels in one place.";
  }

  return COMMUNICATION_CHANNEL_DESCRIPTIONS[channel];
}

export function getCommunicationChannelColors(
  channel: CommunicationChannel | "all"
): {
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
} {
  if (channel === "all") {
    return {
      color: "#64748b",
      bgColor: "rgba(100,116,139,0.10)",
      borderColor: "rgba(100,116,139,0.24)",
      textColor: "#475569",
    };
  }

  return COMMUNICATION_CHANNEL_COLORS[channel];
}

export function getCommunicationChannelOption(
  channel: CommunicationChannel | "all"
): CommunicationChannelOption | undefined {
  return COMMUNICATION_CHANNEL_OPTIONS.find((item) => item.key === channel);
}

export function getEnabledCommunicationChannels(): CommunicationChannelOption[] {
  return ACTIVE_COMMUNICATION_CHANNEL_OPTIONS;
}

export function getCommunicationChannelFilterOptions(): Array<{
  label: string;
  value: CommunicationChannel | "all";
}> {
  return ACTIVE_COMMUNICATION_CHANNEL_OPTIONS.map((channel) => ({
    label: channel.label,
    value: channel.key,
  }));
}