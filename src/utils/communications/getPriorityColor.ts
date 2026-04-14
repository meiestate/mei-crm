// src/utils/communications/getPriorityColor.ts

import type { CommunicationPriority } from "../../types/communications/communication.types";

export type PriorityTone = "neutral" | "low" | "medium" | "high" | "urgent";

export type PriorityColorMeta = {
  label: string;
  tone: PriorityTone;
  textColor: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
};

const PRIORITY_META: Record<CommunicationPriority, PriorityColorMeta> = {
  low: {
    label: "Low",
    tone: "low",
    textColor: "var(--color-neutral-700)",
    bgColor: "var(--color-neutral-100)",
    borderColor: "var(--color-neutral-200)",
    dotColor: "var(--color-neutral-500)",
  },
  medium: {
    label: "Medium",
    tone: "medium",
    textColor: "var(--color-info-700)",
    bgColor: "var(--color-info-50)",
    borderColor: "var(--color-info-200)",
    dotColor: "var(--color-info-500)",
  },
  high: {
    label: "High",
    tone: "high",
    textColor: "var(--color-warning-700)",
    bgColor: "var(--color-warning-50)",
    borderColor: "var(--color-warning-200)",
    dotColor: "var(--color-warning-500)",
  },
  urgent: {
    label: "Urgent",
    tone: "urgent",
    textColor: "var(--color-danger-700)",
    bgColor: "var(--color-danger-50)",
    borderColor: "var(--color-danger-200)",
    dotColor: "var(--color-danger-500)",
  },
};

const FALLBACK_META: PriorityColorMeta = {
  label: "Normal",
  tone: "neutral",
  textColor: "var(--color-neutral-700)",
  bgColor: "var(--color-neutral-100)",
  borderColor: "var(--color-neutral-200)",
  dotColor: "var(--color-neutral-500)",
};

export function getPriorityMeta(
  priority?: CommunicationPriority | null,
): PriorityColorMeta {
  if (!priority) return FALLBACK_META;
  return PRIORITY_META[priority] ?? FALLBACK_META;
}

export function getPriorityColor(
  priority?: CommunicationPriority | null,
): string {
  return getPriorityMeta(priority).textColor;
}

export function getPriorityBgColor(
  priority?: CommunicationPriority | null,
): string {
  return getPriorityMeta(priority).bgColor;
}

export function getPriorityBorderColor(
  priority?: CommunicationPriority | null,
): string {
  return getPriorityMeta(priority).borderColor;
}

export function getPriorityDotColor(
  priority?: CommunicationPriority | null,
): string {
  return getPriorityMeta(priority).dotColor;
}

export function getPriorityLabel(
  priority?: CommunicationPriority | null,
): string {
  return getPriorityMeta(priority).label;
}

export function getPriorityTone(
  priority?: CommunicationPriority | null,
): PriorityTone {
  return getPriorityMeta(priority).tone;
}