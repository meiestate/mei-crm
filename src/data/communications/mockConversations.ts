// src/data/communications/mockConversations.ts

import type { CommunicationChannel } from "../../constants/communications/communicationChannels";
import type { ConversationFolder } from "../../constants/communications/communicationFolders";
import type { DeliveryStatus } from "../../constants/communications/deliveryStatuses";

export type ConversationPriority = "low" | "medium" | "high" | "urgent";

export interface ConversationParticipant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: "lead" | "contact" | "customer" | "agent" | "manager" | "system";
}

export interface ConversationAssignee {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface ConversationRecord {
  id: string;
  threadId: string;
  subject: string;
  previewText: string;
  channel: CommunicationChannel;
  folder: ConversationFolder;
  status: DeliveryStatus;
  priority: ConversationPriority;
  participants: ConversationParticipant[];
  primaryParticipant: ConversationParticipant;
  assignedTo?: ConversationAssignee;
  relatedLeadId?: string;
  relatedContactId?: string;
  relatedDealId?: string;
  projectName?: string;
  location?: string;
  tags: string[];
  unreadCount: number;
  messageCount: number;
  hasAttachments: boolean;
  hasInternalNotes: boolean;
  isPinned: boolean;
  isStarred: boolean;
  isMuted: boolean;
  isArchived: boolean;
  isSpam: boolean;
  lastMessageAt: string;
  lastIncomingAt?: string;
  lastOutgoingAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockConversations: ConversationRecord[] = [
  {
    id: "conv-001",
    threadId: "thread-001",
    subject: "Request for 2BHK options in Whitefield",
    previewText:
      "Hi, I’m looking for a 2BHK apartment in Whitefield within 90L budget. Please share available options.",
    channel: "email",
    folder: "inbox",
    status: "read",
    priority: "high",
    participants: [
      {
        id: "lead-001",
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        phone: "+919876543210",
        role: "lead",
      },
      {
        id: "agent-001",
        name: "Arun Kumar",
        email: "arun@mei.crm",
        role: "agent",
      },
    ],
    primaryParticipant: {
      id: "lead-001",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+919876543210",
      role: "lead",
    },
    assignedTo: {
      id: "agent-001",
      name: "Arun Kumar",
      email: "arun@mei.crm",
    },
    relatedLeadId: "lead-001",
    relatedDealId: "deal-014",
    projectName: "MEI Urban Habitat",
    location: "Whitefield, Bangalore",
    tags: ["buyer", "whitefield", "2bhk", "budget-90l"],
    unreadCount: 2,
    messageCount: 6,
    hasAttachments: true,
    hasInternalNotes: true,
    isPinned: true,
    isStarred: true,
    isMuted: false,
    isArchived: false,
    isSpam: false,
    lastMessageAt: "2026-04-13T09:10:00+05:30",
    lastIncomingAt: "2026-04-13T09:10:00+05:30",
    lastOutgoingAt: "2026-04-13T08:32:00+05:30",
    createdAt: "2026-04-11T11:20:00+05:30",
    updatedAt: "2026-04-13T09:10:00+05:30",
  },
  {
    id: "conv-002",
    threadId: "thread-002",
    subject: "Site visit confirmation for Sarjapur villa",
    previewText:
      "Your site visit is confirmed for tomorrow at 11:30 AM. Please find the location pin attached.",
    channel: "whatsapp",
    folder: "sent",
    status: "delivered",
    priority: "medium",
    participants: [
      {
        id: "lead-002",
        name: "Priyanka Reddy",
        phone: "+919812345678",
        role: "lead",
      },
      {
        id: "agent-002",
        name: "Priya Raman",
        email: "priya@mei.crm",
        role: "agent",
      },
    ],
    primaryParticipant: {
      id: "lead-002",
      name: "Priyanka Reddy",
      phone: "+919812345678",
      role: "lead",
    },
    assignedTo: {
      id: "agent-002",
      name: "Priya Raman",
      email: "priya@mei.crm",
    },
    relatedLeadId: "lead-002",
    relatedDealId: "deal-015",
    projectName: "Golden Grove Villas",
    location: "Sarjapur Road, Bangalore",
    tags: ["site-visit", "villa", "sarjapur"],
    unreadCount: 0,
    messageCount: 4,
    hasAttachments: true,
    hasInternalNotes: false,
    isPinned: false,
    isStarred: true,
    isMuted: false,
    isArchived: false,
    isSpam: false,
    lastMessageAt: "2026-04-13T08:40:00+05:30",
    lastIncomingAt: "2026-04-12T18:25:00+05:30",
    lastOutgoingAt: "2026-04-13T08:40:00+05:30",
    createdAt: "2026-04-12T15:00:00+05:30",
    updatedAt: "2026-04-13T08:40:00+05:30",
  },
  {
    id: "conv-003",
    threadId: "thread-003",
    subject: "Brochure request for plotted development",
    previewText:
      "Please share the brochure, price list, and payment schedule for the plotted community project.",
    channel: "email",
    folder: "inbox",
    status: "replied",
    priority: "medium",
    participants: [
      {
        id: "lead-003",
        name: "Nithin Raj",
        email: "nithin.raj@example.com",
        phone: "+919700011122",
        role: "lead",
      },
      {
        id: "agent-003",
        name: "Sathish Raj",
        email: "sathish@mei.crm",
        role: "agent",
      },
    ],
    primaryParticipant: {
      id: "lead-003",
      name: "Nithin Raj",
      email: "nithin.raj@example.com",
      phone: "+919700011122",
      role: "lead",
    },
    assignedTo: {
      id: "agent-003",
      name: "Sathish Raj",
      email: "sathish@mei.crm",
    },
    relatedLeadId: "lead-003",
    projectName: "North Enclave Plots",
    location: "Devanahalli, Bangalore",
    tags: ["plots", "brochure", "price-list"],
    unreadCount: 0,
    messageCount: 8,
    hasAttachments: true,
    hasInternalNotes: true,
    isPinned: false,
    isStarred: false,
    isMuted: false,
    isArchived: false,
    isSpam: false,
    lastMessageAt: "2026-04-12T17:12:00+05:30",
    lastIncomingAt: "2026-04-12T16:48:00+05:30",
    lastOutgoingAt: "2026-04-12T17:12:00+05:30",
    createdAt: "2026-04-10T10:00:00+05:30",
    updatedAt: "2026-04-12T17:12:00+05:30",
  },
  {
    id: "conv-004",
    threadId: "thread-004",
    subject: "Callback request after missed call",
    previewText:
      "Hi, I missed your call. Please call me back in the evening after 6 PM.",
    channel: "sms",
    folder: "inbox",
    status: "delivered",
    priority: "high",
    participants: [
      {
        id: "lead-004",
        name: "Karthik S",
        phone: "+919845612345",
        role: "lead",
      },
      {
        id: "agent-004",
        name: "Divya Shree",
        email: "divya@mei.crm",
        role: "agent",
      },
    ],
    primaryParticipant: {
      id: "lead-004",
      name: "Karthik S",
      phone: "+919845612345",
      role: "lead",
    },
    assignedTo: {
      id: "agent-004",
      name: "Divya Shree",
      email: "divya@mei.crm",
    },
    relatedLeadId: "lead-004",
    tags: ["callback", "missed-call", "evening"],
    unreadCount: 1,
    messageCount: 3,
    hasAttachments: false,
    hasInternalNotes: false,
    isPinned: true,
    isStarred: false,
    isMuted: false,
    isArchived: false,
    isSpam: false,
    lastMessageAt: "2026-04-13T07:55:00+05:30",
    lastIncomingAt: "2026-04-13T07:55:00+05:30",
    lastOutgoingAt: "2026-04-12T19:20:00+05:30",
    createdAt: "2026-04-12T19:18:00+05:30",
    updatedAt: "2026-04-13T07:55:00+05:30",
  },
  {
    id: "conv-005",
    threadId: "thread-005",
    subject: "Draft: payment reminder for token advance",
    previewText:
      "Hi, this is a gentle reminder regarding the pending token advance for your selected unit...",
    channel: "email",
    folder: "drafts",
    status: "draft",
    priority: "medium",
    participants: [
      {
        id: "lead-005",
        name: "Meghana Iyer",
        email: "meghana.iyer@example.com",
        phone: "+919880001234",
        role: "lead",
      },
      {
        id: "agent-001",
        name: "Arun Kumar",
        email: "arun@mei.crm",
        role: "agent",
      },
    ],
    primaryParticipant: {
      id: "lead-005",
      name: "Meghana Iyer",
      email: "meghana.iyer@example.com",
      phone: "+919880001234",
      role: "lead",
    },
    assignedTo: {
      id: "agent-001",
      name: "Arun Kumar",
      email: "arun@mei.crm",
    },
    relatedLeadId: "lead-005",
    relatedDealId: "deal-019",
    projectName: "Skyline Towers",
    location: "HSR Layout, Bangalore",
    tags: ["payment", "draft", "token-advance"],
    unreadCount: 0,
    messageCount: 1,
    hasAttachments: false,
    hasInternalNotes: true,
    isPinned: false,
    isStarred: false,
    isMuted: false,
    isArchived: false,
    isSpam: false,
    lastMessageAt: "2026-04-13T06:45:00+05:30",
    lastIncomingAt: undefined,
    lastOutgoingAt: undefined,
    createdAt: "2026-04-13T06:45:00+05:30",
    updatedAt: "2026-04-13T06:45:00+05:30",
  },
  {
    id: "conv-006",
    threadId: "thread-006",
    subject: "Scheduled follow-up for premium apartment inquiry",
    previewText:
      "Following up regarding the premium 3BHK options you asked for in Hebbal. Let me know a good time to connect.",
    channel: "whatsapp",
    folder: "scheduled",
    status: "scheduled",
    priority: "medium",
    participants: [
      {
        id: "lead-006",
        name: "Aditya Menon",
        phone: "+919677700001",
        role: "lead",
      },
    ],
    primaryParticipant: {
      id: "lead-006",
      name: "Aditya Menon",
      phone: "+919677700001",
      role: "lead",
    },
    assignedTo: {
      id: "agent-005",
      name: "Naveen Kumar",
      email: "naveen@mei.crm",
    },
    relatedLeadId: "lead-006",
    projectName: "Crown Residences",
    location: "Hebbal, Bangalore",
    tags: ["scheduled", "follow-up", "3bhk", "premium"],
    unreadCount: 0,
    messageCount: 1,
    hasAttachments: false,
    hasInternalNotes: false,
    isPinned: false,
    isStarred: false,
    isMuted: false,
    isArchived: false,
    isSpam: false,
    lastMessageAt: "2026-04-13T14:00:00+05:30",
    lastIncomingAt: undefined,
    lastOutgoingAt: undefined,
    createdAt: "2026-04-13T09:00:00+05:30",
    updatedAt: "2026-04-13T09:00:00+05:30",
  },
  {
    id: "conv-007",
    threadId: "thread-007",
    subject: "Internal discussion: lead prefers corner unit",
    previewText:
      "Customer wants only corner-facing unit with open view. Check block B inventory before next follow-up.",
    channel: "internal",
    folder: "inbox",
    status: "sent",
    priority: "high",
    participants: [
      {
        id: "manager-001",
        name: "Raghav Menon",
        email: "raghav@mei.crm",
        role: "manager",
      },
      {
        id: "agent-002",
        name: "Priya Raman",
        email: "priya@mei.crm",
        role: "agent",
      },
    ],
    primaryParticipant: {
      id: "manager-001",
      name: "Raghav Menon",
      email: "raghav@mei.crm",
      role: "manager",
    },
    assignedTo: {
      id: "agent-002",
      name: "Priya Raman",
      email: "priya@mei.crm",
    },
    relatedLeadId: "lead-002",
    relatedDealId: "deal-015",
    projectName: "Golden Grove Villas",
    location: "Sarjapur Road, Bangalore",
    tags: ["internal", "corner-unit", "inventory-check"],
    unreadCount: 1,
    messageCount: 2,
    hasAttachments: false,
    hasInternalNotes: true,
    isPinned: true,
    isStarred: false,
    isMuted: false,
    isArchived: false,
    isSpam: false,
    lastMessageAt: "2026-04-13T08:05:00+05:30",
    lastIncomingAt: "2026-04-13T08:05:00+05:30",
    lastOutgoingAt: "2026-04-13T07:58:00+05:30",
    createdAt: "2026-04-13T07:58:00+05:30",
    updatedAt: "2026-04-13T08:05:00+05:30",
  },
  {
    id: "conv-008",
    threadId: "thread-008",
    subject: "Archived: legal document clarification",
    previewText:
      "Thank you for the clarification. I have reviewed the legal approval details and everything looks good.",
    channel: "email",
    folder: "archived",
    status: "replied",
    priority: "low",
    participants: [
      {
        id: "lead-007",
        name: "Suresh Babu",
        email: "suresh.babu@example.com",
        role: "lead",
      },
    ],
    primaryParticipant: {
      id: "lead-007",
      name: "Suresh Babu",
      email: "suresh.babu@example.com",
      role: "lead",
    },
    assignedTo: {
      id: "agent-003",
      name: "Sathish Raj",
      email: "sathish@mei.crm",
    },
    relatedLeadId: "lead-007",
    projectName: "Lakeview Heights",
    location: "Varthur, Bangalore",
    tags: ["archived", "legal", "documents"],
    unreadCount: 0,
    messageCount: 9,
    hasAttachments: true,
    hasInternalNotes: true,
    isPinned: false,
    isStarred: false,
    isMuted: true,
    isArchived: true,
    isSpam: false,
    lastMessageAt: "2026-04-10T16:35:00+05:30",
    lastIncomingAt: "2026-04-10T16:35:00+05:30",
    lastOutgoingAt: "2026-04-10T14:10:00+05:30",
    createdAt: "2026-04-08T10:12:00+05:30",
    updatedAt: "2026-04-10T16:35:00+05:30",
  },
  {
    id: "conv-009",
    threadId: "thread-009",
    subject: "Spam: bulk property ad inquiry",
    previewText:
      "Promote your listings to 10,000 investors instantly. Click here for premium promotion plans.",
    channel: "email",
    folder: "spam",
    status: "failed",
    priority: "low",
    participants: [
      {
        id: "system-001",
        name: "Unknown Sender",
        email: "promo@randomgrowthmail.com",
        role: "system",
      },
    ],
    primaryParticipant: {
      id: "system-001",
      name: "Unknown Sender",
      email: "promo@randomgrowthmail.com",
      role: "system",
    },
    tags: ["spam", "promotion", "bulk-mail"],
    unreadCount: 0,
    messageCount: 1,
    hasAttachments: false,
    hasInternalNotes: false,
    isPinned: false,
    isStarred: false,
    isMuted: true,
    isArchived: false,
    isSpam: true,
    lastMessageAt: "2026-04-12T05:40:00+05:30",
    lastIncomingAt: "2026-04-12T05:40:00+05:30",
    lastOutgoingAt: undefined,
    createdAt: "2026-04-12T05:40:00+05:30",
    updatedAt: "2026-04-12T05:40:00+05:30",
  },
  {
    id: "conv-010",
    threadId: "thread-010",
    subject: "Deleted thread: duplicate lead response",
    previewText:
      "This conversation was moved to trash after duplicate mapping with the original inquiry thread.",
    channel: "internal",
    folder: "trash",
    status: "cancelled",
    priority: "low",
    participants: [
      {
        id: "agent-005",
        name: "Naveen Kumar",
        email: "naveen@mei.crm",
        role: "agent",
      },
      {
        id: "system-002",
        name: "CRM Automation",
        email: "automation@mei.crm",
        role: "system",
      },
    ],
    primaryParticipant: {
      id: "system-002",
      name: "CRM Automation",
      email: "automation@mei.crm",
      role: "system",
    },
    assignedTo: {
      id: "agent-005",
      name: "Naveen Kumar",
      email: "naveen@mei.crm",
    },
    relatedLeadId: "lead-008",
    tags: ["trash", "duplicate", "automation"],
    unreadCount: 0,
    messageCount: 2,
    hasAttachments: false,
    hasInternalNotes: true,
    isPinned: false,
    isStarred: false,
    isMuted: true,
    isArchived: false,
    isSpam: false,
    lastMessageAt: "2026-04-11T12:10:00+05:30",
    lastIncomingAt: undefined,
    lastOutgoingAt: "2026-04-11T12:10:00+05:30",
    createdAt: "2026-04-11T12:02:00+05:30",
    updatedAt: "2026-04-11T12:10:00+05:30",
  },
  {
    id: "conv-011",
    threadId: "thread-011",
    subject: "Price negotiation for resale flat",
    previewText:
      "Owner is open to a small price revision. Share your final expectation and I’ll discuss further.",
    channel: "whatsapp",
    folder: "inbox",
    status: "read",
    priority: "urgent",
    participants: [
      {
        id: "lead-009",
        name: "Akhil Jain",
        phone: "+919900001111",
        role: "lead",
      },
      {
        id: "agent-004",
        name: "Divya Shree",
        email: "divya@mei.crm",
        role: "agent",
      },
    ],
    primaryParticipant: {
      id: "lead-009",
      name: "Akhil Jain",
      phone: "+919900001111",
      role: "lead",
    },
    assignedTo: {
      id: "agent-004",
      name: "Divya Shree",
      email: "divya@mei.crm",
    },
    relatedLeadId: "lead-009",
    relatedDealId: "deal-023",
    projectName: "Resale Residency",
    location: "Indiranagar, Bangalore",
    tags: ["negotiation", "resale", "urgent"],
    unreadCount: 3,
    messageCount: 11,
    hasAttachments: false,
    hasInternalNotes: true,
    isPinned: true,
    isStarred: true,
    isMuted: false,
    isArchived: false,
    isSpam: false,
    lastMessageAt: "2026-04-13T09:22:00+05:30",
    lastIncomingAt: "2026-04-13T09:22:00+05:30",
    lastOutgoingAt: "2026-04-13T08:48:00+05:30",
    createdAt: "2026-04-09T14:00:00+05:30",
    updatedAt: "2026-04-13T09:22:00+05:30",
  },
  {
    id: "conv-012",
    threadId: "thread-012",
    subject: "Support request: brochure PDF not opening",
    previewText:
      "The brochure file is not opening on my phone. Can you resend it in WhatsApp format?",
    channel: "email",
    folder: "inbox",
    status: "delivered",
    priority: "medium",
    participants: [
      {
        id: "lead-010",
        name: "Shalini Rao",
        email: "shalini.rao@example.com",
        phone: "+919944556677",
        role: "lead",
      },
    ],
    primaryParticipant: {
      id: "lead-010",
      name: "Shalini Rao",
      email: "shalini.rao@example.com",
      phone: "+919944556677",
      role: "lead",
    },
    assignedTo: {
      id: "agent-002",
      name: "Priya Raman",
      email: "priya@mei.crm",
    },
    relatedLeadId: "lead-010",
    projectName: "Skyline Towers",
    location: "HSR Layout, Bangalore",
    tags: ["support", "brochure", "resend"],
    unreadCount: 1,
    messageCount: 5,
    hasAttachments: true,
    hasInternalNotes: false,
    isPinned: false,
    isStarred: false,
    isMuted: false,
    isArchived: false,
    isSpam: false,
    lastMessageAt: "2026-04-13T08:12:00+05:30",
    lastIncomingAt: "2026-04-13T08:12:00+05:30",
    lastOutgoingAt: "2026-04-12T17:40:00+05:30",
    createdAt: "2026-04-12T17:32:00+05:30",
    updatedAt: "2026-04-13T08:12:00+05:30",
  },
];

export function getMockConversations(): ConversationRecord[] {
  return mockConversations;
}

export function getConversationById(
  conversationId: string
): ConversationRecord | undefined {
  return mockConversations.find((item) => item.id === conversationId);
}

export function getConversationByThreadId(
  threadId: string
): ConversationRecord | undefined {
  return mockConversations.find((item) => item.threadId === threadId);
}

export function getConversationsByChannel(
  channel: CommunicationChannel
): ConversationRecord[] {
  return mockConversations.filter((item) => item.channel === channel);
}

export function getConversationsByFolder(
  folder: ConversationFolder
): ConversationRecord[] {
  return mockConversations.filter((item) => item.folder === folder);
}

export function getConversationsByStatus(
  status: DeliveryStatus
): ConversationRecord[] {
  return mockConversations.filter((item) => item.status === status);
}

export function getUnreadConversations(): ConversationRecord[] {
  return mockConversations.filter((item) => item.unreadCount > 0);
}

export function getPinnedConversations(): ConversationRecord[] {
  return mockConversations.filter((item) => item.isPinned);
}

export function getStarredConversations(): ConversationRecord[] {
  return mockConversations.filter((item) => item.isStarred);
}

export function getArchivedConversations(): ConversationRecord[] {
  return mockConversations.filter((item) => item.isArchived || item.folder === "archived");
}

export function getSpamConversations(): ConversationRecord[] {
  return mockConversations.filter((item) => item.isSpam || item.folder === "spam");
}

export function getConversationsWithAttachments(): ConversationRecord[] {
  return mockConversations.filter((item) => item.hasAttachments);
}

export function getConversationsWithInternalNotes(): ConversationRecord[] {
  return mockConversations.filter((item) => item.hasInternalNotes);
}

export function getHighPriorityConversations(): ConversationRecord[] {
  return mockConversations.filter(
    (item) => item.priority === "high" || item.priority === "urgent"
  );
}

export function searchMockConversations(query: string): ConversationRecord[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return mockConversations;
  }

  return mockConversations.filter((item) => {
    return (
      item.subject.toLowerCase().includes(normalizedQuery) ||
      item.previewText.toLowerCase().includes(normalizedQuery) ||
      item.primaryParticipant.name.toLowerCase().includes(normalizedQuery) ||
      (item.primaryParticipant.email ?? "").toLowerCase().includes(normalizedQuery) ||
      (item.primaryParticipant.phone ?? "").toLowerCase().includes(normalizedQuery) ||
      (item.projectName ?? "").toLowerCase().includes(normalizedQuery) ||
      (item.location ?? "").toLowerCase().includes(normalizedQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  });
}

export function getSortedConversationsByLatest(): ConversationRecord[] {
  return [...mockConversations].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
}

export function getSortedConversationsByUnread(): ConversationRecord[] {
  return [...mockConversations].sort((a, b) => b.unreadCount - a.unreadCount);
}

export function getSortedConversationsByPriority(): ConversationRecord[] {
  const priorityRank: Record<ConversationPriority, number> = {
    low: 1,
    medium: 2,
    high: 3,
    urgent: 4,
  };

  return [...mockConversations].sort(
    (a, b) => priorityRank[b.priority] - priorityRank[a.priority]
  );
}

export function getConversationCounts() {
  return {
    total: mockConversations.length,
    unread: mockConversations.filter((item) => item.unreadCount > 0).length,
    pinned: mockConversations.filter((item) => item.isPinned).length,
    starred: mockConversations.filter((item) => item.isStarred).length,
    drafts: mockConversations.filter((item) => item.folder === "drafts").length,
    scheduled: mockConversations.filter((item) => item.folder === "scheduled").length,
    archived: mockConversations.filter((item) => item.folder === "archived").length,
    spam: mockConversations.filter((item) => item.folder === "spam").length,
    trash: mockConversations.filter((item) => item.folder === "trash").length,
  };
}