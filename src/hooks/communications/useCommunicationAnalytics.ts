// src/hooks/communications/useCommunicationAnalytics.ts

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
  status?: DeliveryStatus;
  direction?: "incoming" | "outgoing" | "internal";
  previewText?: string;
};

export interface CommunicationAnalyticsFilters {
  channel: CommunicationChannel | "all";
  startDate: string | null;
  endDate: string | null;
}

export interface AnalyticsCountItem {
  key: string;
  label: string;
  count: number;
  percentage: number;
}

export interface AnalyticsTrendPoint {
  date: string;
  totalMessages: number;
  incomingMessages: number;
  outgoingMessages: number;
  internalMessages: number;
  unreadMessages: number;
  deliveredMessages: number;
  failedMessages: number;
}

export interface AnalyticsSenderItem {
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  count: number;
}

export interface AnalyticsLabelItem {
  label: string;
  count: number;
}

export interface CommunicationAnalyticsSummary {
  totalMessages: number;
  totalUnread: number;
  totalRead: number;
  totalStarred: number;
  totalPinned: number;
  totalDrafts: number;
  totalScheduled: number;
  totalAttachments: number;
  totalMessagesWithAttachments: number;
  totalInternalNotes: number;
  incomingCount: number;
  outgoingCount: number;
  internalCount: number;
  replyEligibleCount: number;
  repliedCount: number;
  failedCount: number;
  deliveredCount: number;
  readStatusCount: number;
  attachmentRatePercent: number;
  replyRatePercent: number;
  readRatePercent: number;
}

export interface UseCommunicationAnalyticsResult {
  filters: CommunicationAnalyticsFilters;
  setChannel: (value: CommunicationChannel | "all") => void;
  setStartDate: (value: string | null) => void;
  setEndDate: (value: string | null) => void;
  clearFilters: () => void;

  filteredMessages: MessageRecord[];
  summary: CommunicationAnalyticsSummary;

  channelBreakdown: AnalyticsCountItem[];
  statusBreakdown: AnalyticsCountItem[];
  directionBreakdown: AnalyticsCountItem[];

  trendData: AnalyticsTrendPoint[];
  topSenders: AnalyticsSenderItem[];
  topLabels: AnalyticsLabelItem[];

  availableChannels: Array<CommunicationChannel | "all">;
  dateRange: {
    min: string | null;
    max: string | null;
  };
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

function getSafeDirection(
  message: MessageRecord
): "incoming" | "outgoing" | "internal" {
  const safeMessage = message as SafeMessageRecord;
  return safeMessage.direction ?? "incoming";
}

function getSafeStatus(message: MessageRecord): DeliveryStatus | "unknown" {
  const safeMessage = message as SafeMessageRecord;
  return safeMessage.status ?? "unknown";
}

function isMessageWithinDateRange(
  message: MessageRecord,
  startDate: string | null,
  endDate: string | null
): boolean {
  const messageDate = new Date(message.createdAt);

  if (Number.isNaN(messageDate.getTime())) {
    return false;
  }

  if (startDate) {
    const start = new Date(`${startDate}T00:00:00`);
    if (messageDate < start) {
      return false;
    }
  }

  if (endDate) {
    const end = new Date(`${endDate}T23:59:59.999`);
    if (messageDate > end) {
      return false;
    }
  }

  return true;
}

function formatDateKey(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toPercentage(count: number, total: number): number {
  if (!total) {
    return 0;
  }

  return Number(((count / total) * 100).toFixed(1));
}

export default function useCommunicationAnalytics(): UseCommunicationAnalyticsResult {
  const [channel, setChannel] = useState<CommunicationChannel | "all">("all");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const messages = useMemo(() => getMockMessages(), []);

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      if (channel !== "all" && message.channel !== channel) {
        return false;
      }

      if (!isMessageWithinDateRange(message, startDate, endDate)) {
        return false;
      }

      return true;
    });
  }, [messages, channel, startDate, endDate]);

  const summary = useMemo<CommunicationAnalyticsSummary>(() => {
    const totalMessages = filteredMessages.length;
    const totalUnread = filteredMessages.filter((message) => !getSafeIsRead(message)).length;
    const totalRead = filteredMessages.filter((message) => getSafeIsRead(message)).length;
    const totalStarred = filteredMessages.filter((message) => getSafeIsStarred(message)).length;
    const totalPinned = filteredMessages.filter((message) => getSafeIsPinned(message)).length;
    const totalDrafts = filteredMessages.filter((message) => getSafeIsDraft(message)).length;
    const totalScheduled = filteredMessages.filter((message) => getSafeIsScheduled(message)).length;
    const totalInternalNotes = filteredMessages.filter((message) =>
      getSafeIsInternalNote(message)
    ).length;

    const totalAttachments = filteredMessages.reduce((sum, message) => {
      return sum + message.attachments.length;
    }, 0);

    const totalMessagesWithAttachments = filteredMessages.filter(
      (message) => message.attachments.length > 0
    ).length;

    const incomingCount = filteredMessages.filter(
      (message) => getSafeDirection(message) === "incoming"
    ).length;

    const outgoingCount = filteredMessages.filter(
      (message) => getSafeDirection(message) === "outgoing"
    ).length;

    const internalCount = filteredMessages.filter(
      (message) => getSafeDirection(message) === "internal"
    ).length;

    const replyEligibleCount = filteredMessages.filter((message) => {
      const direction = getSafeDirection(message);
      return direction === "incoming";
    }).length;

    const repliedCount = filteredMessages.filter((message) => {
      const status = getSafeStatus(message);
      return status === "replied";
    }).length;

    const failedCount = filteredMessages.filter(
      (message) => getSafeStatus(message) === "failed"
    ).length;

    const deliveredCount = filteredMessages.filter((message) => {
      const status = getSafeStatus(message);
      return status === "delivered" || status === "read" || status === "replied";
    }).length;

    const readStatusCount = filteredMessages.filter(
      (message) => getSafeStatus(message) === "read"
    ).length;

    return {
      totalMessages,
      totalUnread,
      totalRead,
      totalStarred,
      totalPinned,
      totalDrafts,
      totalScheduled,
      totalAttachments,
      totalMessagesWithAttachments,
      totalInternalNotes,
      incomingCount,
      outgoingCount,
      internalCount,
      replyEligibleCount,
      repliedCount,
      failedCount,
      deliveredCount,
      readStatusCount,
      attachmentRatePercent: toPercentage(totalMessagesWithAttachments, totalMessages),
      replyRatePercent: toPercentage(repliedCount, replyEligibleCount),
      readRatePercent: toPercentage(totalRead, totalMessages),
    };
  }, [filteredMessages]);

  const channelBreakdown = useMemo<AnalyticsCountItem[]>(() => {
    const total = filteredMessages.length;

    const channelMap = new Map<string, number>();

    filteredMessages.forEach((message) => {
      const key = message.channel;
      channelMap.set(key, (channelMap.get(key) ?? 0) + 1);
    });

    return Array.from(channelMap.entries())
      .map(([key, count]) => ({
        key,
        label: key.toUpperCase(),
        count,
        percentage: toPercentage(count, total),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredMessages]);

  const statusBreakdown = useMemo<AnalyticsCountItem[]>(() => {
    const total = filteredMessages.length;

    const statusMap = new Map<string, number>();

    filteredMessages.forEach((message) => {
      const status = getSafeStatus(message);
      statusMap.set(status, (statusMap.get(status) ?? 0) + 1);
    });

    return Array.from(statusMap.entries())
      .map(([key, count]) => ({
        key,
        label: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
        count,
        percentage: toPercentage(count, total),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredMessages]);

  const directionBreakdown = useMemo<AnalyticsCountItem[]>(() => {
    const total = filteredMessages.length;

    const directionMap = new Map<string, number>();

    filteredMessages.forEach((message) => {
      const direction = getSafeDirection(message);
      directionMap.set(direction, (directionMap.get(direction) ?? 0) + 1);
    });

    return Array.from(directionMap.entries())
      .map(([key, count]) => ({
        key,
        label: key.replace(/\b\w/g, (char) => char.toUpperCase()),
        count,
        percentage: toPercentage(count, total),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredMessages]);

  const trendData = useMemo<AnalyticsTrendPoint[]>(() => {
    const grouped = new Map<string, AnalyticsTrendPoint>();

    filteredMessages.forEach((message) => {
      const dateKey = formatDateKey(message.createdAt);

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, {
          date: dateKey,
          totalMessages: 0,
          incomingMessages: 0,
          outgoingMessages: 0,
          internalMessages: 0,
          unreadMessages: 0,
          deliveredMessages: 0,
          failedMessages: 0,
        });
      }

      const entry = grouped.get(dateKey)!;
      const direction = getSafeDirection(message);
      const status = getSafeStatus(message);

      entry.totalMessages += 1;

      if (direction === "incoming") {
        entry.incomingMessages += 1;
      }

      if (direction === "outgoing") {
        entry.outgoingMessages += 1;
      }

      if (direction === "internal") {
        entry.internalMessages += 1;
      }

      if (!getSafeIsRead(message)) {
        entry.unreadMessages += 1;
      }

      if (status === "delivered" || status === "read" || status === "replied") {
        entry.deliveredMessages += 1;
      }

      if (status === "failed") {
        entry.failedMessages += 1;
      }
    });

    return Array.from(grouped.values()).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [filteredMessages]);

  const topSenders = useMemo<AnalyticsSenderItem[]>(() => {
    const senderMap = new Map<string, AnalyticsSenderItem>();

    filteredMessages.forEach((message) => {
      const key =
        normalizeText(message.sender.email) ||
        normalizeText(message.sender.phone) ||
        normalizeText(message.sender.name);

      if (!key) {
        return;
      }

      const existing = senderMap.get(key);

      if (existing) {
        existing.count += 1;
      } else {
        senderMap.set(key, {
          senderName: message.sender.name,
          senderEmail: message.sender.email,
          senderPhone: message.sender.phone,
          count: 1,
        });
      }
    });

    return Array.from(senderMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [filteredMessages]);

  const topLabels = useMemo<AnalyticsLabelItem[]>(() => {
    const labelMap = new Map<string, number>();

    filteredMessages.forEach((message) => {
      const labels = getSafeLabels(message);

      labels.forEach((label) => {
        const key = normalizeText(label);
        if (!key) {
          return;
        }

        labelMap.set(label, (labelMap.get(label) ?? 0) + 1);
      });
    });

    return Array.from(labelMap.entries())
      .map(([label, count]) => ({
        label,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredMessages]);

  const availableChannels = useMemo<Array<CommunicationChannel | "all">>(() => {
    const uniqueChannels = Array.from(
      new Set(messages.map((message) => message.channel))
    ).sort();

    return ["all", ...uniqueChannels] as Array<CommunicationChannel | "all">;
  }, [messages]);

  const dateRange = useMemo(() => {
    if (!messages.length) {
      return {
        min: null,
        max: null,
      };
    }

    const timestamps = messages
      .map((message) => new Date(message.createdAt).getTime())
      .filter((value) => !Number.isNaN(value))
      .sort((a, b) => a - b);

    if (!timestamps.length) {
      return {
        min: null,
        max: null,
      };
    }

    const min = new Date(timestamps[0]).toISOString().slice(0, 10);
    const max = new Date(timestamps[timestamps.length - 1]).toISOString().slice(0, 10);

    return { min, max };
  }, [messages]);

  const clearFilters = () => {
    setChannel("all");
    setStartDate(null);
    setEndDate(null);
  };

  return {
    filters: {
      channel,
      startDate,
      endDate,
    },
    setChannel,
    setStartDate,
    setEndDate,
    clearFilters,
    filteredMessages,
    summary,
    channelBreakdown,
    statusBreakdown,
    directionBreakdown,
    trendData,
    topSenders,
    topLabels,
    availableChannels,
    dateRange,
  };
}