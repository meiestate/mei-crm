// src/utils/communications/formatDeliveryStatus.ts

import type { CommunicationStatus } from "../../types/communications/communication.types";

export type DeliveryStatusTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type DeliveryStatusMeta = {
  label: string;
  tone: DeliveryStatusTone;
  bgColor: string;
  textColor: string;
  borderColor: string;
};

const DELIVERY_STATUS_META: Record<CommunicationStatus, DeliveryStatusMeta> = {
  draft: {
    label: "Draft",
    tone: "neutral",
    bgColor: "var(--badge-neutral-bg)",
    textColor: "var(--badge-neutral-text)",
    borderColor: "var(--border-color)",
  },
  queued: {
    label: "Queued",
    tone: "info",
    bgColor: "var(--badge-info-bg)",
    textColor: "var(--badge-info-text)",
    borderColor: "var(--info-soft)",
  },
  scheduled: {
    label: "Scheduled",
    tone: "info",
    bgColor: "var(--badge-info-bg)",
    textColor: "var(--badge-info-text)",
    borderColor: "var(--info-soft)",
  },
  sending: {
    label: "Sending",
    tone: "info",
    bgColor: "var(--badge-info-bg)",
    textColor: "var(--badge-info-text)",
    borderColor: "var(--info-soft)",
  },
  sent: {
    label: "Sent",
    tone: "success",
    bgColor: "var(--badge-success-bg)",
    textColor: "var(--badge-success-text)",
    borderColor: "var(--success-soft)",
  },
  delivered: {
    label: "Delivered",
    tone: "success",
    bgColor: "var(--badge-success-bg)",
    textColor: "var(--badge-success-text)",
    borderColor: "var(--success-soft)",
  },
  read: {
    label: "Read",
    tone: "success",
    bgColor: "var(--badge-success-bg)",
    textColor: "var(--badge-success-text)",
    borderColor: "var(--success-soft)",
  },
  opened: {
    label: "Opened",
    tone: "success",
    bgColor: "var(--badge-success-bg)",
    textColor: "var(--badge-success-text)",
    borderColor: "var(--success-soft)",
  },
  clicked: {
    label: "Clicked",
    tone: "success",
    bgColor: "var(--badge-success-bg)",
    textColor: "var(--badge-success-text)",
    borderColor: "var(--success-soft)",
  },
  replied: {
    label: "Replied",
    tone: "success",
    bgColor: "var(--badge-success-bg)",
    textColor: "var(--badge-success-text)",
    borderColor: "var(--success-soft)",
  },
  failed: {
    label: "Failed",
    tone: "danger",
    bgColor: "var(--badge-danger-bg)",
    textColor: "var(--badge-danger-text)",
    borderColor: "var(--danger-soft)",
  },
  bounced: {
    label: "Bounced",
    tone: "warning",
    bgColor: "var(--badge-warning-bg)",
    textColor: "var(--badge-warning-text)",
    borderColor: "var(--warning-soft)",
  },
  canceled: {
    label: "Canceled",
    tone: "warning",
    bgColor: "var(--badge-warning-bg)",
    textColor: "var(--badge-warning-text)",
    borderColor: "var(--warning-soft)",
  },
  archived: {
    label: "Archived",
    tone: "neutral",
    bgColor: "var(--badge-neutral-bg)",
    textColor: "var(--badge-neutral-text)",
    borderColor: "var(--border-color)",
  },
  deleted: {
    label: "Deleted",
    tone: "neutral",
    bgColor: "var(--badge-neutral-bg)",
    textColor: "var(--badge-neutral-text)",
    borderColor: "var(--border-color)",
  },
};

const FALLBACK_META: DeliveryStatusMeta = {
  label: "Unknown",
  tone: "neutral",
  bgColor: "var(--badge-neutral-bg)",
  textColor: "var(--badge-neutral-text)",
  borderColor: "var(--border-color)",
};

export function getDeliveryStatusMeta(
  status?: CommunicationStatus | null,
): DeliveryStatusMeta {
  if (!status) return FALLBACK_META;
  return DELIVERY_STATUS_META[status] ?? FALLBACK_META;
}

export function formatDeliveryStatus(
  status?: CommunicationStatus | null,
): string {
  return getDeliveryStatusMeta(status).label;
}

export function getDeliveryStatusTone(
  status?: CommunicationStatus | null,
): DeliveryStatusTone {
  return getDeliveryStatusMeta(status).tone;
}

export function getDeliveryStatusColors(
  status?: CommunicationStatus | null,
): Pick<DeliveryStatusMeta, "bgColor" | "textColor" | "borderColor"> {
  const { bgColor, textColor, borderColor } = getDeliveryStatusMeta(status);
  return { bgColor, textColor, borderColor };
}

export function isDeliveredStatus(
  status?: CommunicationStatus | null,
): boolean {
  return (
    status === "sent" ||
    status === "delivered" ||
    status === "read" ||
    status === "opened" ||
    status === "clicked" ||
    status === "replied"
  );
}

export function isPendingStatus(
  status?: CommunicationStatus | null,
): boolean {
  return (
    status === "draft" ||
    status === "queued" ||
    status === "scheduled" ||
    status === "sending"
  );
}

export function isFailedStatus(
  status?: CommunicationStatus | null,
): boolean {
  return (
    status === "failed" ||
    status === "bounced" ||
    status === "canceled"
  );
}