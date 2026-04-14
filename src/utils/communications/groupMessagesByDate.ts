// src/utils/communications/groupMessagesByDate.ts

import type { CommunicationMessage } from "../../types/communications/communication.types";

export type GroupedMessagesByDate = Record<string, CommunicationMessage[]>;

function toValidDate(value?: string | number | Date | null): Date | null {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(date: Date, now: Date): boolean {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return isSameDay(date, yesterday);
}

export function getMessageDateKey(
  value?: string | number | Date | null,
  locale = "en-IN",
): string {
  const date = toValidDate(value);
  if (!date) return "Unknown Date";

  const now = new Date();

  if (isSameDay(date, now)) {
    return "Today";
  }

  if (isYesterday(date, now)) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function sortMessagesChronologically(
  messages: CommunicationMessage[],
  order: "asc" | "desc" = "asc",
): CommunicationMessage[] {
  return [...messages].sort((a, b) => {
    const aTime = toValidDate(a.sentAt ?? a.createdAt)?.getTime() ?? 0;
    const bTime = toValidDate(b.sentAt ?? b.createdAt)?.getTime() ?? 0;

    return order === "asc" ? aTime - bTime : bTime - aTime;
  });
}

export function groupMessagesByDate(
  messages: CommunicationMessage[],
  locale = "en-IN",
): GroupedMessagesByDate {
  const sortedMessages = sortMessagesChronologically(messages, "asc");

  return sortedMessages.reduce<GroupedMessagesByDate>((groups, message) => {
    const key = getMessageDateKey(
      message.sentAt ?? message.createdAt,
      locale,
    );

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(message);
    return groups;
  }, {});
}

export function getGroupedMessagesEntries(
  messages: CommunicationMessage[],
  locale = "en-IN",
): Array<[string, CommunicationMessage[]]> {
  return Object.entries(groupMessagesByDate(messages, locale));
}