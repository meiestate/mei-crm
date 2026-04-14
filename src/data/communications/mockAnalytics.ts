// src/data/communications/mockAnalytics.ts

import type { CommunicationChannel } from "../../constants/communications/communicationChannels";
import type { ConversationFolder } from "../../constants/communications/communicationFolders";
import type { DeliveryStatus } from "../../constants/communications/deliveryStatuses";
import type { TemplateCategory } from "../../constants/communications/templateCategories";

export interface CommunicationAnalyticsSummary {
  totalConversations: number;
  totalMessages: number;
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalReplied: number;
  totalDrafts: number;
  totalScheduled: number;
  totalFailed: number;
  averageResponseTimeMinutes: number;
  replyRatePercent: number;
  deliveryRatePercent: number;
  readRatePercent: number;
  customerEngagementScore: number;
}

export interface CommunicationAnalyticsChannelMetric {
  channel: CommunicationChannel;
  totalConversations: number;
  totalMessages: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  repliedCount: number;
  failedCount: number;
  avgResponseTimeMinutes: number;
  replyRatePercent: number;
  deliveryRatePercent: number;
  readRatePercent: number;
}

export interface CommunicationAnalyticsFolderMetric {
  folder: ConversationFolder;
  totalConversations: number;
  unreadCount: number;
  pendingCount: number;
  flaggedCount: number;
}

export interface CommunicationAnalyticsDeliveryMetric {
  status: DeliveryStatus;
  count: number;
  percent: number;
}

export interface CommunicationAnalyticsTrendPoint {
  date: string;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  failed: number;
}

export interface CommunicationAnalyticsResponseTimePoint {
  date: string;
  avgResponseTimeMinutes: number;
}

export interface CommunicationAnalyticsAgentPerformance {
  id: string;
  agentName: string;
  sentCount: number;
  repliedCount: number;
  readCount: number;
  avgResponseTimeMinutes: number;
  conversionTouches: number;
  replyRatePercent: number;
}

export interface CommunicationAnalyticsTemplatePerformance {
  id: string;
  templateName: string;
  category: TemplateCategory;
  usageCount: number;
  replyRatePercent: number;
  readRatePercent: number;
}

export interface CommunicationAnalyticsHourlyEngagement {
  hour: string;
  sent: number;
  replies: number;
  reads: number;
}

export interface CommunicationAnalyticsRecentActivityMetric {
  id: string;
  title: string;
  channel: CommunicationChannel;
  value: string;
  changeText: string;
  trend: "up" | "down" | "neutral";
}

export interface CommunicationAnalyticsDataset {
  summary: CommunicationAnalyticsSummary;
  channelMetrics: CommunicationAnalyticsChannelMetric[];
  folderMetrics: CommunicationAnalyticsFolderMetric[];
  deliveryMetrics: CommunicationAnalyticsDeliveryMetric[];
  messageTrends: CommunicationAnalyticsTrendPoint[];
  responseTimeTrends: CommunicationAnalyticsResponseTimePoint[];
  agentPerformance: CommunicationAnalyticsAgentPerformance[];
  templatePerformance: CommunicationAnalyticsTemplatePerformance[];
  hourlyEngagement: CommunicationAnalyticsHourlyEngagement[];
  recentActivityMetrics: CommunicationAnalyticsRecentActivityMetric[];
}

export const mockCommunicationAnalyticsSummary: CommunicationAnalyticsSummary = {
  totalConversations: 1248,
  totalMessages: 6894,
  totalSent: 4380,
  totalDelivered: 4126,
  totalRead: 2978,
  totalReplied: 1436,
  totalDrafts: 184,
  totalScheduled: 126,
  totalFailed: 92,
  averageResponseTimeMinutes: 38,
  replyRatePercent: 32.8,
  deliveryRatePercent: 94.2,
  readRatePercent: 72.2,
  customerEngagementScore: 81,
};

export const mockCommunicationChannelMetrics: CommunicationAnalyticsChannelMetric[] =
  [
    {
      channel: "email",
      totalConversations: 462,
      totalMessages: 2578,
      sentCount: 1680,
      deliveredCount: 1602,
      readCount: 1184,
      repliedCount: 524,
      failedCount: 31,
      avgResponseTimeMinutes: 54,
      replyRatePercent: 31.2,
      deliveryRatePercent: 95.4,
      readRatePercent: 73.9,
    },
    {
      channel: "sms",
      totalConversations: 283,
      totalMessages: 1268,
      sentCount: 910,
      deliveredCount: 862,
      readCount: 574,
      repliedCount: 191,
      failedCount: 28,
      avgResponseTimeMinutes: 29,
      replyRatePercent: 21.0,
      deliveryRatePercent: 94.7,
      readRatePercent: 66.6,
    },
    {
      channel: "whatsapp",
      totalConversations: 391,
      totalMessages: 2246,
      sentCount: 1554,
      deliveredCount: 1456,
      readCount: 1156,
      repliedCount: 692,
      failedCount: 33,
      avgResponseTimeMinutes: 18,
      replyRatePercent: 44.5,
      deliveryRatePercent: 93.7,
      readRatePercent: 79.4,
    },
    {
      channel: "internal",
      totalConversations: 112,
      totalMessages: 802,
      sentCount: 236,
      deliveredCount: 206,
      readCount: 64,
      repliedCount: 29,
      failedCount: 0,
      avgResponseTimeMinutes: 12,
      replyRatePercent: 12.3,
      deliveryRatePercent: 87.3,
      readRatePercent: 31.1,
    },
  ];

export const mockCommunicationFolderMetrics: CommunicationAnalyticsFolderMetric[] =
  [
    {
      folder: "inbox",
      totalConversations: 328,
      unreadCount: 94,
      pendingCount: 61,
      flaggedCount: 18,
    },
    {
      folder: "sent",
      totalConversations: 412,
      unreadCount: 0,
      pendingCount: 17,
      flaggedCount: 6,
    },
    {
      folder: "drafts",
      totalConversations: 84,
      unreadCount: 0,
      pendingCount: 84,
      flaggedCount: 9,
    },
    {
      folder: "scheduled",
      totalConversations: 57,
      unreadCount: 0,
      pendingCount: 57,
      flaggedCount: 5,
    },
    {
      folder: "archived",
      totalConversations: 278,
      unreadCount: 0,
      pendingCount: 0,
      flaggedCount: 4,
    },
    {
      folder: "spam",
      totalConversations: 52,
      unreadCount: 11,
      pendingCount: 7,
      flaggedCount: 21,
    },
    {
      folder: "trash",
      totalConversations: 37,
      unreadCount: 0,
      pendingCount: 0,
      flaggedCount: 0,
    },
  ];

export const mockCommunicationDeliveryMetrics: CommunicationAnalyticsDeliveryMetric[] =
  [
    { status: "draft", count: 184, percent: 4.0 },
    { status: "queued", count: 44, percent: 1.0 },
    { status: "scheduled", count: 126, percent: 2.9 },
    { status: "sending", count: 21, percent: 0.5 },
    { status: "sent", count: 4380, percent: 63.5 },
    { status: "delivered", count: 4126, percent: 59.8 },
    { status: "read", count: 2978, percent: 43.2 },
    { status: "replied", count: 1436, percent: 20.8 },
    { status: "failed", count: 92, percent: 1.3 },
    { status: "bounced", count: 41, percent: 0.6 },
    { status: "cancelled", count: 38, percent: 0.6 },
  ];

export const mockCommunicationMessageTrends: CommunicationAnalyticsTrendPoint[] =
  [
    { date: "2026-04-01", sent: 132, delivered: 126, read: 89, replied: 41, failed: 3 },
    { date: "2026-04-02", sent: 148, delivered: 141, read: 96, replied: 44, failed: 4 },
    { date: "2026-04-03", sent: 156, delivered: 149, read: 108, replied: 51, failed: 2 },
    { date: "2026-04-04", sent: 120, delivered: 112, read: 82, replied: 37, failed: 5 },
    { date: "2026-04-05", sent: 116, delivered: 109, read: 77, replied: 33, failed: 3 },
    { date: "2026-04-06", sent: 164, delivered: 156, read: 116, replied: 58, failed: 4 },
    { date: "2026-04-07", sent: 172, delivered: 163, read: 124, replied: 63, failed: 5 },
    { date: "2026-04-08", sent: 168, delivered: 159, read: 121, replied: 60, failed: 4 },
    { date: "2026-04-09", sent: 176, delivered: 167, read: 126, replied: 67, failed: 3 },
    { date: "2026-04-10", sent: 182, delivered: 173, read: 132, replied: 70, failed: 4 },
    { date: "2026-04-11", sent: 144, delivered: 135, read: 101, replied: 48, failed: 6 },
    { date: "2026-04-12", sent: 158, delivered: 149, read: 114, replied: 54, failed: 5 },
  ];

export const mockCommunicationResponseTimeTrends: CommunicationAnalyticsResponseTimePoint[] =
  [
    { date: "2026-04-01", avgResponseTimeMinutes: 46 },
    { date: "2026-04-02", avgResponseTimeMinutes: 43 },
    { date: "2026-04-03", avgResponseTimeMinutes: 39 },
    { date: "2026-04-04", avgResponseTimeMinutes: 41 },
    { date: "2026-04-05", avgResponseTimeMinutes: 44 },
    { date: "2026-04-06", avgResponseTimeMinutes: 36 },
    { date: "2026-04-07", avgResponseTimeMinutes: 34 },
    { date: "2026-04-08", avgResponseTimeMinutes: 33 },
    { date: "2026-04-09", avgResponseTimeMinutes: 31 },
    { date: "2026-04-10", avgResponseTimeMinutes: 29 },
    { date: "2026-04-11", avgResponseTimeMinutes: 37 },
    { date: "2026-04-12", avgResponseTimeMinutes: 38 },
  ];

export const mockCommunicationAgentPerformance: CommunicationAnalyticsAgentPerformance[] =
  [
    {
      id: "agent-001",
      agentName: "Arun Kumar",
      sentCount: 482,
      repliedCount: 188,
      readCount: 346,
      avgResponseTimeMinutes: 28,
      conversionTouches: 74,
      replyRatePercent: 39.0,
    },
    {
      id: "agent-002",
      agentName: "Priya Raman",
      sentCount: 436,
      repliedCount: 172,
      readCount: 318,
      avgResponseTimeMinutes: 32,
      conversionTouches: 61,
      replyRatePercent: 39.4,
    },
    {
      id: "agent-003",
      agentName: "Sathish Raj",
      sentCount: 391,
      repliedCount: 121,
      readCount: 264,
      avgResponseTimeMinutes: 47,
      conversionTouches: 48,
      replyRatePercent: 30.9,
    },
    {
      id: "agent-004",
      agentName: "Divya Shree",
      sentCount: 356,
      repliedCount: 149,
      readCount: 281,
      avgResponseTimeMinutes: 26,
      conversionTouches: 57,
      replyRatePercent: 41.9,
    },
    {
      id: "agent-005",
      agentName: "Naveen Kumar",
      sentCount: 302,
      repliedCount: 98,
      readCount: 211,
      avgResponseTimeMinutes: 44,
      conversionTouches: 36,
      replyRatePercent: 32.5,
    },
  ];

export const mockCommunicationTemplatePerformance: CommunicationAnalyticsTemplatePerformance[] =
  [
    {
      id: "tpl-001",
      templateName: "First Response Introduction",
      category: "introduction",
      usageCount: 294,
      replyRatePercent: 36.4,
      readRatePercent: 79.1,
    },
    {
      id: "tpl-002",
      templateName: "Follow-up Interest Check",
      category: "follow_up",
      usageCount: 268,
      replyRatePercent: 29.7,
      readRatePercent: 74.2,
    },
    {
      id: "tpl-003",
      templateName: "Site Visit Confirmation",
      category: "site_visit",
      usageCount: 196,
      replyRatePercent: 42.3,
      readRatePercent: 88.5,
    },
    {
      id: "tpl-004",
      templateName: "Share Brochure",
      category: "brochure",
      usageCount: 182,
      replyRatePercent: 27.6,
      readRatePercent: 81.3,
    },
    {
      id: "tpl-005",
      templateName: "Share Pricing Details",
      category: "pricing",
      usageCount: 173,
      replyRatePercent: 33.8,
      readRatePercent: 77.4,
    },
    {
      id: "tpl-006",
      templateName: "Re-engage Cold Lead",
      category: "re_engagement",
      usageCount: 121,
      replyRatePercent: 19.4,
      readRatePercent: 63.2,
    },
  ];

export const mockCommunicationHourlyEngagement: CommunicationAnalyticsHourlyEngagement[] =
  [
    { hour: "08:00", sent: 24, replies: 6, reads: 12 },
    { hour: "09:00", sent: 48, replies: 13, reads: 22 },
    { hour: "10:00", sent: 72, replies: 19, reads: 35 },
    { hour: "11:00", sent: 84, replies: 24, reads: 43 },
    { hour: "12:00", sent: 76, replies: 18, reads: 39 },
    { hour: "13:00", sent: 52, replies: 11, reads: 27 },
    { hour: "14:00", sent: 69, replies: 16, reads: 33 },
    { hour: "15:00", sent: 82, replies: 21, reads: 46 },
    { hour: "16:00", sent: 91, replies: 28, reads: 55 },
    { hour: "17:00", sent: 96, replies: 31, reads: 61 },
    { hour: "18:00", sent: 62, replies: 19, reads: 38 },
    { hour: "19:00", sent: 38, replies: 12, reads: 20 },
  ];

export const mockCommunicationRecentActivityMetrics: CommunicationAnalyticsRecentActivityMetric[] =
  [
    {
      id: "metric-001",
      title: "WhatsApp reply spike",
      channel: "whatsapp",
      value: "+18%",
      changeText: "Compared to last 7 days",
      trend: "up",
    },
    {
      id: "metric-002",
      title: "Email open rate",
      channel: "email",
      value: "73.9%",
      changeText: "+4.2% this week",
      trend: "up",
    },
    {
      id: "metric-003",
      title: "SMS delivery dip",
      channel: "sms",
      value: "-1.8%",
      changeText: "Carrier issue detected",
      trend: "down",
    },
    {
      id: "metric-004",
      title: "Internal note usage",
      channel: "internal",
      value: "112 threads",
      changeText: "Stable coordination flow",
      trend: "neutral",
    },
  ];

export const mockCommunicationAnalytics: CommunicationAnalyticsDataset = {
  summary: mockCommunicationAnalyticsSummary,
  channelMetrics: mockCommunicationChannelMetrics,
  folderMetrics: mockCommunicationFolderMetrics,
  deliveryMetrics: mockCommunicationDeliveryMetrics,
  messageTrends: mockCommunicationMessageTrends,
  responseTimeTrends: mockCommunicationResponseTimeTrends,
  agentPerformance: mockCommunicationAgentPerformance,
  templatePerformance: mockCommunicationTemplatePerformance,
  hourlyEngagement: mockCommunicationHourlyEngagement,
  recentActivityMetrics: mockCommunicationRecentActivityMetrics,
};

export function getMockCommunicationAnalytics(): CommunicationAnalyticsDataset {
  return mockCommunicationAnalytics;
}

export function getMockAnalyticsSummary(): CommunicationAnalyticsSummary {
  return mockCommunicationAnalyticsSummary;
}

export function getMockAnalyticsChannelMetrics(): CommunicationAnalyticsChannelMetric[] {
  return mockCommunicationChannelMetrics;
}

export function getMockAnalyticsFolderMetrics(): CommunicationAnalyticsFolderMetric[] {
  return mockCommunicationFolderMetrics;
}

export function getMockAnalyticsDeliveryMetrics(): CommunicationAnalyticsDeliveryMetric[] {
  return mockCommunicationDeliveryMetrics;
}

export function getMockAnalyticsMessageTrends(): CommunicationAnalyticsTrendPoint[] {
  return mockCommunicationMessageTrends;
}

export function getMockAnalyticsResponseTimeTrends(): CommunicationAnalyticsResponseTimePoint[] {
  return mockCommunicationResponseTimeTrends;
}

export function getMockAnalyticsAgentPerformance(): CommunicationAnalyticsAgentPerformance[] {
  return mockCommunicationAgentPerformance;
}

export function getMockAnalyticsTemplatePerformance(): CommunicationAnalyticsTemplatePerformance[] {
  return mockCommunicationTemplatePerformance;
}

export function getMockAnalyticsHourlyEngagement(): CommunicationAnalyticsHourlyEngagement[] {
  return mockCommunicationHourlyEngagement;
}

export function getMockAnalyticsRecentActivityMetrics(): CommunicationAnalyticsRecentActivityMetric[] {
  return mockCommunicationRecentActivityMetrics;
}

export function getChannelMetric(
  channel: CommunicationChannel
): CommunicationAnalyticsChannelMetric | undefined {
  return mockCommunicationChannelMetrics.find((item) => item.channel === channel);
}

export function getFolderMetric(
  folder: ConversationFolder
): CommunicationAnalyticsFolderMetric | undefined {
  return mockCommunicationFolderMetrics.find((item) => item.folder === folder);
}

export function getDeliveryMetric(
  status: DeliveryStatus
): CommunicationAnalyticsDeliveryMetric | undefined {
  return mockCommunicationDeliveryMetrics.find((item) => item.status === status);
}

export function getTemplatePerformanceByCategory(
  category: TemplateCategory
): CommunicationAnalyticsTemplatePerformance[] {
  return mockCommunicationTemplatePerformance.filter(
    (item) => item.category === category
  );
}

export function getTopPerformingTemplates(
  limit = 5
): CommunicationAnalyticsTemplatePerformance[] {
  return [...mockCommunicationTemplatePerformance]
    .sort((a, b) => b.replyRatePercent - a.replyRatePercent)
    .slice(0, limit);
}

export function getTopAgentsByReplyRate(
  limit = 5
): CommunicationAnalyticsAgentPerformance[] {
  return [...mockCommunicationAgentPerformance]
    .sort((a, b) => b.replyRatePercent - a.replyRatePercent)
    .slice(0, limit);
}