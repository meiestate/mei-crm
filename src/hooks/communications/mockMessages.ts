// src/data/communications/mockMessages.ts

import type { CommunicationChannel } from "../../constants/communications/communicationChannels";
import type { DeliveryStatus } from "../../constants/communications/deliveryStatuses";

export type MessageDirection = "incoming" | "outgoing" | "internal";

export type MessageType =
  | "text"
  | "email"
  | "attachment"
  | "image"
  | "document"
  | "audio"
  | "video"
  | "system_note"
  | "call_summary";

export type MessagePriority = "low" | "normal" | "high" | "urgent";

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSizeLabel: string;
  url?: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  mimeType?: string;
}

export interface MessageParticipant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: "lead" | "contact" | "customer" | "agent" | "manager" | "system";
}

export interface MessageReaction {
  emoji: string;
  count: number;
  reactedByMe?: boolean;
}

export interface MessageDeliveryEvent {
  id: string;
  status: DeliveryStatus;
  timestamp: string;
  note?: string;
}

export interface MessageRecord {
  id: string;
  threadId: string;
  conversationId: string;
  subject?: string;
  body: string;
  previewText: string;
  channel: CommunicationChannel;
  direction: MessageDirection;
  type: MessageType;
  status: DeliveryStatus;
  priority: MessagePriority;

  sender: MessageParticipant;
  recipients: MessageParticipant[];
  cc?: MessageParticipant[];
  bcc?: MessageParticipant[];

  attachments: MessageAttachment[];
  labels: string[];
  reactions: MessageReaction[];
  deliveryTimeline: MessageDeliveryEvent[];

  isRead: boolean;
  isStarred: boolean;
  isPinned: boolean;
  isInternalNote: boolean;
  isDraft: boolean;
  isScheduled: boolean;
  isEdited: boolean;

  parentMessageId?: string;
  replyCount?: number;

  scheduledFor?: string;
  readAt?: string;
  deliveredAt?: string;
  failedReason?: string;

  createdAt: string;
  updatedAt: string;
}

export const mockMessages: MessageRecord[] = [
  {
    id: "msg-001",
    threadId: "thread-001",
    conversationId: "conv-001",
    subject: "Request for 2BHK options in Whitefield",
    body:
      "Hi Team,\n\nI’m looking for a 2BHK apartment in Whitefield within a budget of 90 lakhs. Preferably in a gated community with good amenities. Please share available options and brochure details.\n\nThanks,\nRahul",
    previewText:
      "I’m looking for a 2BHK apartment in Whitefield within a budget of 90 lakhs...",
    channel: "email",
    direction: "incoming",
    type: "email",
    status: "read",
    priority: "high",
    sender: {
      id: "lead-001",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+919876543210",
      role: "lead",
    },
    recipients: [
      {
        id: "agent-001",
        name: "Arun Kumar",
        email: "arun@mei.crm",
        role: "agent",
      },
    ],
    cc: [],
    bcc: [],
    attachments: [],
    labels: ["buyer", "whitefield", "2bhk"],
    reactions: [],
    deliveryTimeline: [
      {
        id: "evt-001",
        status: "delivered",
        timestamp: "2026-04-11T11:20:00+05:30",
      },
      {
        id: "evt-002",
        status: "read",
        timestamp: "2026-04-11T11:21:00+05:30",
      },
    ],
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    replyCount: 2,
    readAt: "2026-04-11T11:21:00+05:30",
    deliveredAt: "2026-04-11T11:20:00+05:30",
    createdAt: "2026-04-11T11:20:00+05:30",
    updatedAt: "2026-04-11T11:20:00+05:30",
  },
  {
    id: "msg-002",
    threadId: "thread-001",
    conversationId: "conv-001",
    parentMessageId: "msg-001",
    subject: "Re: Request for 2BHK options in Whitefield",
    body:
      "Hi Rahul,\n\nThanks for reaching out. I’ve shortlisted a few strong 2BHK options in Whitefield that match your budget and gated community preference. Sharing the brochure and initial price sheet for review.\n\nRegards,\nArun Kumar\nMEI CRM",
    previewText:
      "I’ve shortlisted a few strong 2BHK options in Whitefield that match your budget...",
    channel: "email",
    direction: "outgoing",
    type: "document",
    status: "delivered",
    priority: "high",
    sender: {
      id: "agent-001",
      name: "Arun Kumar",
      email: "arun@mei.crm",
      role: "agent",
    },
    recipients: [
      {
        id: "lead-001",
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        role: "lead",
      },
    ],
    cc: [],
    bcc: [],
    attachments: [
      {
        id: "att-001",
        fileName: "Whitefield_2BHK_Brochure.pdf",
        fileType: "pdf",
        fileSizeLabel: "2.4 MB",
        mimeType: "application/pdf",
        url: "/mock/attachments/Whitefield_2BHK_Brochure.pdf",
      },
      {
        id: "att-002",
        fileName: "Whitefield_Price_Sheet.xlsx",
        fileType: "xlsx",
        fileSizeLabel: "248 KB",
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        url: "/mock/attachments/Whitefield_Price_Sheet.xlsx",
      },
    ],
    labels: ["brochure", "price-sheet", "sent"],
    reactions: [],
    deliveryTimeline: [
      {
        id: "evt-003",
        status: "sending",
        timestamp: "2026-04-11T11:42:00+05:30",
      },
      {
        id: "evt-004",
        status: "sent",
        timestamp: "2026-04-11T11:42:05+05:30",
      },
      {
        id: "evt-005",
        status: "delivered",
        timestamp: "2026-04-11T11:42:20+05:30",
      },
    ],
    isRead: true,
    isStarred: true,
    isPinned: false,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    replyCount: 1,
    deliveredAt: "2026-04-11T11:42:20+05:30",
    createdAt: "2026-04-11T11:42:00+05:30",
    updatedAt: "2026-04-11T11:42:00+05:30",
  },
  {
    id: "msg-003",
    threadId: "thread-001",
    conversationId: "conv-001",
    body:
      "Customer is highly interested. Prioritize Whitefield gated communities with strong clubhouse and covered parking.",
    previewText:
      "Customer is highly interested. Prioritize Whitefield gated communities...",
    channel: "internal",
    direction: "internal",
    type: "system_note",
    status: "sent",
    priority: "high",
    sender: {
      id: "agent-001",
      name: "Arun Kumar",
      email: "arun@mei.crm",
      role: "agent",
    },
    recipients: [
      {
        id: "manager-001",
        name: "Raghav Menon",
        email: "raghav@mei.crm",
        role: "manager",
      },
    ],
    attachments: [],
    labels: ["internal-note", "priority"],
    reactions: [{ emoji: "📌", count: 1, reactedByMe: true }],
    deliveryTimeline: [
      {
        id: "evt-006",
        status: "sent",
        timestamp: "2026-04-11T11:50:00+05:30",
      },
    ],
    isRead: true,
    isStarred: false,
    isPinned: true,
    isInternalNote: true,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    createdAt: "2026-04-11T11:50:00+05:30",
    updatedAt: "2026-04-11T11:50:00+05:30",
  },
  {
    id: "msg-004",
    threadId: "thread-001",
    conversationId: "conv-001",
    parentMessageId: "msg-002",
    subject: "Re: Request for 2BHK options in Whitefield",
    body:
      "Hi Arun,\n\nThanks. I liked the first two projects. Can you also share if there are any offers and when we can schedule a site visit?\n\nRegards,\nRahul",
    previewText:
      "I liked the first two projects. Can you also share if there are any offers...",
    channel: "email",
    direction: "incoming",
    type: "email",
    status: "read",
    priority: "high",
    sender: {
      id: "lead-001",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      role: "lead",
    },
    recipients: [
      {
        id: "agent-001",
        name: "Arun Kumar",
        email: "arun@mei.crm",
        role: "agent",
      },
    ],
    attachments: [],
    labels: ["site-visit-interest", "offers-request"],
    reactions: [],
    deliveryTimeline: [
      {
        id: "evt-007",
        status: "delivered",
        timestamp: "2026-04-13T09:10:00+05:30",
      },
      {
        id: "evt-008",
        status: "read",
        timestamp: "2026-04-13T09:11:00+05:30",
      },
    ],
    isRead: true,
    isStarred: true,
    isPinned: false,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    readAt: "2026-04-13T09:11:00+05:30",
    deliveredAt: "2026-04-13T09:10:00+05:30",
    createdAt: "2026-04-13T09:10:00+05:30",
    updatedAt: "2026-04-13T09:10:00+05:30",
  },

  {
    id: "msg-005",
    threadId: "thread-002",
    conversationId: "conv-002",
    body:
      "Hi Priyanka, your site visit for Golden Grove Villas is confirmed for tomorrow at 11:30 AM. I’m also sharing the location pin and entry details here.",
    previewText:
      "Your site visit for Golden Grove Villas is confirmed for tomorrow...",
    channel: "whatsapp",
    direction: "outgoing",
    type: "image",
    status: "delivered",
    priority: "normal",
    sender: {
      id: "agent-002",
      name: "Priya Raman",
      phone: "+919800001111",
      role: "agent",
    },
    recipients: [
      {
        id: "lead-002",
        name: "Priyanka Reddy",
        phone: "+919812345678",
        role: "lead",
      },
    ],
    attachments: [
      {
        id: "att-003",
        fileName: "Golden_Grove_Location_Pin.jpg",
        fileType: "jpg",
        fileSizeLabel: "520 KB",
        mimeType: "image/jpeg",
        previewUrl: "/mock/attachments/Golden_Grove_Location_Pin.jpg",
        thumbnailUrl: "/mock/attachments/Golden_Grove_Location_Pin_thumb.jpg",
      },
    ],
    labels: ["site-visit", "location-pin"],
    reactions: [{ emoji: "✅", count: 1 }],
    deliveryTimeline: [
      {
        id: "evt-009",
        status: "sent",
        timestamp: "2026-04-13T08:40:00+05:30",
      },
      {
        id: "evt-010",
        status: "delivered",
        timestamp: "2026-04-13T08:40:10+05:30",
      },
    ],
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    deliveredAt: "2026-04-13T08:40:10+05:30",
    createdAt: "2026-04-13T08:40:00+05:30",
    updatedAt: "2026-04-13T08:40:00+05:30",
  },
  {
    id: "msg-006",
    threadId: "thread-002",
    conversationId: "conv-002",
    parentMessageId: "msg-005",
    body:
      "Got it. I’ll reach by 11:15 AM. Please share the contact person name too.",
    previewText:
      "I’ll reach by 11:15 AM. Please share the contact person name too.",
    channel: "whatsapp",
    direction: "incoming",
    type: "text",
    status: "replied",
    priority: "normal",
    sender: {
      id: "lead-002",
      name: "Priyanka Reddy",
      phone: "+919812345678",
      role: "lead",
    },
    recipients: [
      {
        id: "agent-002",
        name: "Priya Raman",
        phone: "+919800001111",
        role: "agent",
      },
    ],
    attachments: [],
    labels: ["confirmation", "contact-person-request"],
    reactions: [{ emoji: "👍", count: 1 }],
    deliveryTimeline: [
      {
        id: "evt-011",
        status: "delivered",
        timestamp: "2026-04-13T08:47:00+05:30",
      },
      {
        id: "evt-012",
        status: "replied",
        timestamp: "2026-04-13T08:47:00+05:30",
      },
    ],
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    readAt: "2026-04-13T08:48:00+05:30",
    deliveredAt: "2026-04-13T08:47:00+05:30",
    createdAt: "2026-04-13T08:47:00+05:30",
    updatedAt: "2026-04-13T08:47:00+05:30",
  },

  {
    id: "msg-007",
    threadId: "thread-003",
    conversationId: "conv-003",
    subject: "Brochure request for plotted development",
    body:
      "Hello,\n\nPlease share the brochure, price list, and payment schedule for the plotted development in Devanahalli.\n\nThanks,\nNithin",
    previewText: "Please share the brochure, price list, and payment schedule...",
    channel: "email",
    direction: "incoming",
    type: "email",
    status: "read",
    priority: "normal",
    sender: {
      id: "lead-003",
      name: "Nithin Raj",
      email: "nithin.raj@example.com",
      role: "lead",
    },
    recipients: [
      {
        id: "agent-003",
        name: "Sathish Raj",
        email: "sathish@mei.crm",
        role: "agent",
      },
    ],
    attachments: [],
    labels: ["brochure-request", "plots"],
    reactions: [],
    deliveryTimeline: [
      {
        id: "evt-013",
        status: "delivered",
        timestamp: "2026-04-10T10:00:00+05:30",
      },
      {
        id: "evt-014",
        status: "read",
        timestamp: "2026-04-10T10:02:00+05:30",
      },
    ],
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    readAt: "2026-04-10T10:02:00+05:30",
    deliveredAt: "2026-04-10T10:00:00+05:30",
    createdAt: "2026-04-10T10:00:00+05:30",
    updatedAt: "2026-04-10T10:00:00+05:30",
  },
  {
    id: "msg-008",
    threadId: "thread-003",
    conversationId: "conv-003",
    parentMessageId: "msg-007",
    subject: "Re: Brochure request for plotted development",
    body:
      "Hi Nithin,\n\nPlease find the brochure, price list, and payment schedule attached. Let me know if you want me to also share available plot sizes and launch offers.\n\nRegards,\nSathish",
    previewText:
      "Please find the brochure, price list, and payment schedule attached...",
    channel: "email",
    direction: "outgoing",
    type: "document",
    status: "replied",
    priority: "normal",
    sender: {
      id: "agent-003",
      name: "Sathish Raj",
      email: "sathish@mei.crm",
      role: "agent",
    },
    recipients: [
      {
        id: "lead-003",
        name: "Nithin Raj",
        email: "nithin.raj@example.com",
        role: "lead",
      },
    ],
    attachments: [
      {
        id: "att-004",
        fileName: "North_Enclave_Brochure.pdf",
        fileType: "pdf",
        fileSizeLabel: "3.1 MB",
        mimeType: "application/pdf",
        url: "/mock/attachments/North_Enclave_Brochure.pdf",
      },
      {
        id: "att-005",
        fileName: "North_Enclave_Price_List.pdf",
        fileType: "pdf",
        fileSizeLabel: "1.2 MB",
        mimeType: "application/pdf",
        url: "/mock/attachments/North_Enclave_Price_List.pdf",
      },
    ],
    labels: ["brochure-sent", "price-list"],
    reactions: [],
    deliveryTimeline: [
      {
        id: "evt-015",
        status: "sent",
        timestamp: "2026-04-10T10:28:00+05:30",
      },
      {
        id: "evt-016",
        status: "delivered",
        timestamp: "2026-04-10T10:28:15+05:30",
      },
      {
        id: "evt-017",
        status: "replied",
        timestamp: "2026-04-10T10:28:15+05:30",
      },
    ],
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    deliveredAt: "2026-04-10T10:28:15+05:30",
    createdAt: "2026-04-10T10:28:00+05:30",
    updatedAt: "2026-04-10T10:28:00+05:30",
  },

  {
    id: "msg-009",
    threadId: "thread-004",
    conversationId: "conv-004",
    body: "Hi, I missed your call. Please call me back in the evening after 6 PM.",
    previewText: "Please call me back in the evening after 6 PM.",
    channel: "sms",
    direction: "incoming",
    type: "text",
    status: "delivered",
    priority: "high",
    sender: {
      id: "lead-004",
      name: "Karthik S",
      phone: "+919845612345",
      role: "lead",
    },
    recipients: [
      {
        id: "agent-004",
        name: "Divya Shree",
        phone: "+919877776666",
        role: "agent",
      },
    ],
    attachments: [],
    labels: ["callback", "missed-call"],
    reactions: [],
    deliveryTimeline: [
      {
        id: "evt-018",
        status: "delivered",
        timestamp: "2026-04-13T07:55:00+05:30",
      },
    ],
    isRead: false,
    isStarred: false,
    isPinned: true,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    deliveredAt: "2026-04-13T07:55:00+05:30",
    createdAt: "2026-04-13T07:55:00+05:30",
    updatedAt: "2026-04-13T07:55:00+05:30",
  },

  {
    id: "msg-010",
    threadId: "thread-005",
    conversationId: "conv-005",
    subject: "Draft: payment reminder for token advance",
    body:
      "Hi Meghana,\n\nThis is a gentle reminder regarding the pending token advance for your selected unit in Skyline Towers. Please let me know if you need the payment link, bank details, or any clarification.\n\nRegards,\nArun",
    previewText:
      "This is a gentle reminder regarding the pending token advance...",
    channel: "email",
    direction: "outgoing",
    type: "email",
    status: "draft",
    priority: "normal",
    sender: {
      id: "agent-001",
      name: "Arun Kumar",
      email: "arun@mei.crm",
      role: "agent",
    },
    recipients: [
      {
        id: "lead-005",
        name: "Meghana Iyer",
        email: "meghana.iyer@example.com",
        role: "lead",
      },
    ],
    attachments: [],
    labels: ["draft", "payment-reminder"],
    reactions: [],
    deliveryTimeline: [
      {
        id: "evt-019",
        status: "draft",
        timestamp: "2026-04-13T06:45:00+05:30",
      },
    ],
    isRead: false,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    isDraft: true,
    isScheduled: false,
    isEdited: true,
    createdAt: "2026-04-13T06:45:00+05:30",
    updatedAt: "2026-04-13T06:52:00+05:30",
  },

  {
    id: "msg-011",
    threadId: "thread-006",
    conversationId: "conv-006",
    body:
      "Hi Aditya, following up regarding the premium 3BHK options you asked for in Hebbal. Let me know a good time to connect and I’ll share the latest shortlist.",
    previewText:
      "Following up regarding the premium 3BHK options you asked for in Hebbal...",
    channel: "whatsapp",
    direction: "outgoing",
    type: "text",
    status: "scheduled",
    priority: "normal",
    sender: {
      id: "agent-005",
      name: "Naveen Kumar",
      phone: "+919811112222",
      role: "agent",
    },
    recipients: [
      {
        id: "lead-006",
        name: "Aditya Menon",
        phone: "+919677700001",
        role: "lead",
      },
    ],
    attachments: [],
    labels: ["scheduled", "follow-up"],
    reactions: [],
    deliveryTimeline: [
      {
        id: "evt-020",
        status: "scheduled",
        timestamp: "2026-04-13T09:00:00+05:30",
        note: "Scheduled for afternoon outreach",
      },
    ],
    isRead: false,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    isDraft: false,
    isScheduled: true,
    isEdited: false,
    scheduledFor: "2026-04-13T14:00:00+05:30",
    createdAt: "2026-04-13T09:00:00+05:30",
    updatedAt: "2026-04-13T09:00:00+05:30",
  },

  {
    id: "msg-012",
    threadId: "thread-007",
    conversationId: "conv-007",
    body:
      "Customer wants only corner-facing unit with open view. Check block B inventory before next follow-up.",
    previewText: "Customer wants only corner-facing unit with open view...",
    channel: "internal",
    direction: "internal",
    type: "system_note",
    status: "sent",
    priority: "high",
    sender: {
      id: "manager-001",
      name: "Raghav Menon",
      email: "raghav@mei.crm",
      role: "manager",
    },
    recipients: [
      {
        id: "agent-002",
        name: "Priya Raman",
        email: "priya@mei.crm",
        role: "agent",
      },
    ],
    attachments: [],
    labels: ["internal", "inventory-check"],
    reactions: [{ emoji: "👀", count: 1 }],
    deliveryTimeline: [
      {
        id: "evt-021",
        status: "sent",
        timestamp: "2026-04-13T08:05:00+05:30",
      },
    ],
    isRead: false,
    isStarred: false,
    isPinned: true,
    isInternalNote: true,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    createdAt: "2026-04-13T08:05:00+05:30",
    updatedAt: "2026-04-13T08:05:00+05:30",
  },

  {
    id: "msg-013",
    threadId: "thread-008",
    conversationId: "conv-008",
    subject: "Re: Legal document clarification",
    body:
      "Thank you for the clarification. I have reviewed the legal approval details and everything looks good from my side. We can move to the next discussion.",
    previewText:
      "I have reviewed the legal approval details and everything looks good...",
    channel: "email",
    direction: "incoming",
    type: "email",
    status: "replied",
    priority: "low",
    sender: {
      id: "lead-007",
      name: "Suresh Babu",
      email: "suresh.babu@example.com",
      role: "lead",
    },
    recipients: [
      {
        id: "agent-003",
        name: "Sathish Raj",
        email: "sathish@mei.crm",
        role: "agent",
      },
    ],
    attachments: [],
    labels: ["legal", "approved"],
    reactions: [],
    deliveryTimeline: [
      {
        id: "evt-022",
        status: "delivered",
        timestamp: "2026-04-10T16:35:00+05:30",
      },
      {
        id: "evt-023",
        status: "replied",
        timestamp: "2026-04-10T16:35:00+05:30",
      },
    ],
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    deliveredAt: "2026-04-10T16:35:00+05:30",
    createdAt: "2026-04-10T16:35:00+05:30",
    updatedAt: "2026-04-10T16:35:00+05:30",
  },

  {
    id: "msg-014",
    threadId: "thread-009",
    conversationId: "conv-009",
    subject: "Promote your listings to 10,000 investors instantly",
    body:
      "Promote your listings to 10,000 investors instantly. Click here for premium promotion plans and paid marketing campaigns.",
    previewText: "Promote your listings to 10,000 investors instantly...",
    channel: "email",
    direction: "incoming",
    type: "email",
    status: "failed",
    priority: "low",
    sender: {
      id: "system-001",
      name: "Unknown Sender",
      email: "promo@randomgrowthmail.com",
      role: "system",
    },
    recipients: [
      {
        id: "inbox-001",
        name: "MEI Inbox",
        email: "sales@mei.crm",
        role: "system",
      },
    ],
    attachments: [],
    labels: ["spam", "blocked"],
    reactions: [],
    deliveryTimeline: [
      {
        id: "evt-024",
        status: "failed",
        timestamp: "2026-04-12T05:40:00+05:30",
        note: "Marked suspicious by spam filter",
      },
    ],
    isRead: false,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    failedReason: "Spam filter blocked sender reputation",
    createdAt: "2026-04-12T05:40:00+05:30",
    updatedAt: "2026-04-12T05:40:00+05:30",
  },

  {
    id: "msg-015",
    threadId: "thread-010",
    conversationId: "conv-010",
    body:
      "Duplicate lead response thread detected. This conversation has been moved to trash after merge mapping.",
    previewText: "Duplicate lead response thread detected...",
    channel: "internal",
    direction: "internal",
    type: "system_note",
    status: "cancelled",
    priority: "low",
    sender: {
      id: "system-002",
      name: "CRM Automation",
      email: "automation@mei.crm",
      role: "system",
    },
    recipients: [
      {
        id: "agent-005",
        name: "Naveen Kumar",
        email: "naveen@mei.crm",
        role: "agent",
      },
    ],
    attachments: [],
    labels: ["automation", "duplicate", "trash"],
    reactions: [],
    deliveryTimeline: [
      {
        id: "evt-025",
        status: "cancelled",
        timestamp: "2026-04-11T12:10:00+05:30",
        note: "Duplicate mapped to original thread",
      },
    ],
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: true,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    createdAt: "2026-04-11T12:10:00+05:30",
    updatedAt: "2026-04-11T12:10:00+05:30",
  },

  {
    id: "msg-016",
    threadId: "thread-011",
    conversationId: "conv-011",
    body:
      "Owner is open to a small price revision. Share your final expectation and I’ll discuss further.",
    previewText: "Owner is open to a small price revision...",
    channel: "whatsapp",
    direction: "outgoing",
    type: "text",
    status: "read",
    priority: "urgent",
    sender: {
      id: "agent-004",
      name: "Divya Shree",
      phone: "+919877776666",
      role: "agent",
    },
    recipients: [
      {
        id: "lead-009",
        name: "Akhil Jain",
        phone: "+919900001111",
        role: "lead",
      },
    ],
    attachments: [],
    labels: ["negotiation", "resale"],
    reactions: [{ emoji: "💬", count: 1 }],
    deliveryTimeline: [
      {
        id: "evt-026",
        status: "sent",
        timestamp: "2026-04-13T08:48:00+05:30",
      },
      {
        id: "evt-027",
        status: "delivered",
        timestamp: "2026-04-13T08:48:08+05:30",
      },
      {
        id: "evt-028",
        status: "read",
        timestamp: "2026-04-13T08:49:00+05:30",
      },
    ],
    isRead: true,
    isStarred: true,
    isPinned: false,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    readAt: "2026-04-13T08:49:00+05:30",
    deliveredAt: "2026-04-13T08:48:08+05:30",
    createdAt: "2026-04-13T08:48:00+05:30",
    updatedAt: "2026-04-13T08:48:00+05:30",
  },
  {
    id: "msg-017",
    threadId: "thread-011",
    conversationId: "conv-011",
    parentMessageId: "msg-016",
    body:
      "Can you try for 5 lakhs lower? If possible, I’m ready to move fast this week.",
    previewText:
      "Can you try for 5 lakhs lower? If possible, I’m ready to move fast...",
    channel: "whatsapp",
    direction: "incoming",
    type: "text",
    status: "read",
    priority: "urgent",
    sender: {
      id: "lead-009",
      name: "Akhil Jain",
      phone: "+919900001111",
      role: "lead",
    },
    recipients: [
      {
        id: "agent-004",
        name: "Divya Shree",
        phone: "+919877776666",
        role: "agent",
      },
    ],
    attachments: [],
    labels: ["counter-offer", "urgent"],
    reactions: [{ emoji: "🔥", count: 1, reactedByMe: true }],
    deliveryTimeline: [
      {
        id: "evt-029",
        status: "delivered",
        timestamp: "2026-04-13T09:22:00+05:30",
      },
      {
        id: "evt-030",
        status: "read",
        timestamp: "2026-04-13T09:22:30+05:30",
      },
    ],
    isRead: false,
    isStarred: true,
    isPinned: true,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    deliveredAt: "2026-04-13T09:22:00+05:30",
    createdAt: "2026-04-13T09:22:00+05:30",
    updatedAt: "2026-04-13T09:22:00+05:30",
  },

  {
    id: "msg-018",
    threadId: "thread-012",
    conversationId: "conv-012",
    subject: "Support request: brochure PDF not opening",
    body:
      "Hi,\n\nThe brochure file is not opening on my phone. Can you resend it in WhatsApp format or image format?\n\nThanks,\nShalini",
    previewText: "The brochure file is not opening on my phone...",
    channel: "email",
    direction: "incoming",
    type: "email",
    status: "delivered",
    priority: "normal",
    sender: {
      id: "lead-010",
      name: "Shalini Rao",
      email: "shalini.rao@example.com",
      phone: "+919944556677",
      role: "lead",
    },
    recipients: [
      {
        id: "agent-002",
        name: "Priya Raman",
        email: "priya@mei.crm",
        role: "agent",
      },
    ],
    attachments: [],
    labels: ["support", "resend-request"],
    reactions: [],
    deliveryTimeline: [
      {
        id: "evt-031",
        status: "delivered",
        timestamp: "2026-04-13T08:12:00+05:30",
      },
    ],
    isRead: false,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    deliveredAt: "2026-04-13T08:12:00+05:30",
    createdAt: "2026-04-13T08:12:00+05:30",
    updatedAt: "2026-04-13T08:12:00+05:30",
  },

  {
    id: "msg-019",
    threadId: "thread-012",
    conversationId: "conv-012",
    parentMessageId: "msg-018",
    body:
      "Hi Shalini, thanks for the update. I’ll resend the brochure in WhatsApp-friendly format and also share image previews for quick access.",
    previewText:
      "I’ll resend the brochure in WhatsApp-friendly format and also share image previews...",
    channel: "email",
    direction: "outgoing",
    type: "email",
    status: "sent",
    priority: "normal",
    sender: {
      id: "agent-002",
      name: "Priya Raman",
      email: "priya@mei.crm",
      role: "agent",
    },
    recipients: [
      {
        id: "lead-010",
        name: "Shalini Rao",
        email: "shalini.rao@example.com",
        role: "lead",
      },
    ],
    attachments: [],
    labels: ["support-reply"],
    reactions: [],
    deliveryTimeline: [
      {
        id: "evt-032",
        status: "sent",
        timestamp: "2026-04-13T09:02:00+05:30",
      },
    ],
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    isDraft: false,
    isScheduled: false,
    isEdited: false,
    createdAt: "2026-04-13T09:02:00+05:30",
    updatedAt: "2026-04-13T09:02:00+05:30",
  },
];

export function getMockMessages(): MessageRecord[] {
  return mockMessages;
}

export function getMessageById(messageId: string): MessageRecord | undefined {
  return mockMessages.find((message) => message.id === messageId);
}

export function getMessagesByThreadId(threadId: string): MessageRecord[] {
  return [...mockMessages]
    .filter((message) => message.threadId === threadId)
    .sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export function getMessagesByConversationId(
  conversationId: string
): MessageRecord[] {
  return [...mockMessages]
    .filter((message) => message.conversationId === conversationId)
    .sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export function getMessagesByChannel(
  channel: CommunicationChannel
): MessageRecord[] {
  return mockMessages.filter((message) => message.channel === channel);
}

export function getMessagesByStatus(status: DeliveryStatus): MessageRecord[] {
  return mockMessages.filter((message) => message.status === status);
}

export function getUnreadMessages(): MessageRecord[] {
  return mockMessages.filter((message) => !message.isRead);
}

export function getStarredMessages(): MessageRecord[] {
  return mockMessages.filter((message) => message.isStarred);
}

export function getPinnedMessages(): MessageRecord[] {
  return mockMessages.filter((message) => message.isPinned);
}

export function getInternalNotes(): MessageRecord[] {
  return mockMessages.filter((message) => message.isInternalNote);
}

export function getDraftMessages(): MessageRecord[] {
  return mockMessages.filter((message) => message.isDraft || message.status === "draft");
}

export function getScheduledMessages(): MessageRecord[] {
  return mockMessages.filter(
    (message) => message.isScheduled || message.status === "scheduled"
  );
}

export function getMessagesWithAttachments(): MessageRecord[] {
  return mockMessages.filter((message) => message.attachments.length > 0);
}

export function getMessagesByDirection(
  direction: MessageDirection
): MessageRecord[] {
  return mockMessages.filter((message) => message.direction === direction);
}

export function getMessagesByLabel(label: string): MessageRecord[] {
  const normalizedLabel = label.trim().toLowerCase();

  return mockMessages.filter((message) =>
    message.labels.some((item) => item.toLowerCase() === normalizedLabel)
  );
}

export function searchMockMessages(query: string): MessageRecord[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return mockMessages;
  }

  return mockMessages.filter((message) => {
    return (
      (message.subject ?? "").toLowerCase().includes(normalizedQuery) ||
      message.body.toLowerCase().includes(normalizedQuery) ||
      message.previewText.toLowerCase().includes(normalizedQuery) ||
      message.sender.name.toLowerCase().includes(normalizedQuery) ||
      (message.sender.email ?? "").toLowerCase().includes(normalizedQuery) ||
      (message.sender.phone ?? "").toLowerCase().includes(normalizedQuery) ||
      message.recipients.some(
        (recipient) =>
          recipient.name.toLowerCase().includes(normalizedQuery) ||
          (recipient.email ?? "").toLowerCase().includes(normalizedQuery) ||
          (recipient.phone ?? "").toLowerCase().includes(normalizedQuery)
      ) ||
      message.labels.some((label) =>
        label.toLowerCase().includes(normalizedQuery)
      ) ||
      message.attachments.some((attachment) =>
        attachment.fileName.toLowerCase().includes(normalizedQuery)
      )
    );
  });
}

export function getLatestMessages(limit = 10): MessageRecord[] {
  return [...mockMessages]
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

export function getThreadLatestMessage(
  threadId: string
): MessageRecord | undefined {
  const threadMessages = getMessagesByThreadId(threadId);

  if (!threadMessages.length) {
    return undefined;
  }

  return threadMessages[threadMessages.length - 1];
}

export function getThreadUnreadCount(threadId: string): number {
  return getMessagesByThreadId(threadId).filter((message) => !message.isRead).length;
}

export function getThreadHasInternalNotes(threadId: string): boolean {
  return getMessagesByThreadId(threadId).some((message) => message.isInternalNote);
}

export function getThreadAttachments(threadId: string): MessageAttachment[] {
  return getMessagesByThreadId(threadId).flatMap((message) => message.attachments);
}

export function getMessageCounts() {
  return {
    total: mockMessages.length,
    unread: mockMessages.filter((message) => !message.isRead).length,
    starred: mockMessages.filter((message) => message.isStarred).length,
    pinned: mockMessages.filter((message) => message.isPinned).length,
    internalNotes: mockMessages.filter((message) => message.isInternalNote).length,
    drafts: mockMessages.filter((message) => message.isDraft).length,
    scheduled: mockMessages.filter((message) => message.isScheduled).length,
    withAttachments: mockMessages.filter((message) => message.attachments.length > 0)
      .length,
    incoming: mockMessages.filter((message) => message.direction === "incoming")
      .length,
    outgoing: mockMessages.filter((message) => message.direction === "outgoing")
      .length,
    internal: mockMessages.filter((message) => message.direction === "internal")
      .length,
    failed: mockMessages.filter((message) => message.status === "failed").length,
  };
}