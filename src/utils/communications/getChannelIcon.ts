// src/utils/communications/getChannelIcon.ts

import type { CommunicationChannel } from "../../types/communications/communication.types";

export type ChannelIconName =
  | "mail"
  | "message-square"
  | "message-circle"
  | "phone"
  | "file-text"
  | "users"
  | "inbox";

export type ChannelIconMeta = {
  icon: ChannelIconName;
  label: string;
  color: string;
  bgColor: string;
};

const CHANNEL_ICON_META: Record<CommunicationChannel, ChannelIconMeta> = {
  email: {
    icon: "mail",
    label: "Email",
    color: "var(--color-info-600)",
    bgColor: "var(--color-info-50)",
  },
  sms: {
    icon: "message-square",
    label: "SMS",
    color: "var(--color-success-600)",
    bgColor: "var(--color-success-50)",
  },
  whatsapp: {
    icon: "message-circle",
    label: "WhatsApp",
    color: "var(--color-success-700)",
    bgColor: "var(--color-success-50)",
  },
  call: {
    icon: "phone",
    label: "Call",
    color: "var(--color-warning-600)",
    bgColor: "var(--color-warning-50)",
  },
  note: {
    icon: "file-text",
    label: "Note",
    color: "var(--color-neutral-600)",
    bgColor: "var(--color-neutral-100)",
  },
  internal_chat: {
    icon: "users",
    label: "Internal Chat",
    color: "var(--color-primary-600)",
    bgColor: "var(--color-primary-50)",
  },
};

const FALLBACK_ICON_META: ChannelIconMeta = {
  icon: "inbox",
  label: "Communication",
  color: "var(--color-neutral-600)",
  bgColor: "var(--color-neutral-100)",
};

export function getChannelIconMeta(
  channel?: CommunicationChannel | null,
): ChannelIconMeta {
  if (!channel) return FALLBACK_ICON_META;
  return CHANNEL_ICON_META[channel] ?? FALLBACK_ICON_META;
}

export function getChannelIcon(
  channel?: CommunicationChannel | null,
): ChannelIconName {
  return getChannelIconMeta(channel).icon;
}

export function getChannelLabel(
  channel?: CommunicationChannel | null,
): string {
  return getChannelIconMeta(channel).label;
}

export function getChannelIconColor(
  channel?: CommunicationChannel | null,
): string {
  return getChannelIconMeta(channel).color;
}

export function getChannelIconBgColor(
  channel?: CommunicationChannel | null,
): string {
  return getChannelIconMeta(channel).bgColor;
}