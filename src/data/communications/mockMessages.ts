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
  | "system_note";

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSizeLabel: string;
  url?: string;
  previewUrl?: string;
}

export interface MessageParticipant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: "lead" | "contact" | "customer" | "agent" | "manager" | "system";
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
  sender: MessageParticipant;
  recipients: MessageParticipant[];
  attachments: MessageAttachment[];
  isRead: boolean;
  isStarred: boolean;
  isPinned: boolean;
  isInternalNote: boolean;
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
    attachments: [],
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    createdAt: "2026-04-11T11:20:00+05:30",
    updatedAt: "2026-04-11T11:20:00+05:30",
  },
  {
    id: "msg-002",
    threadId: "thread-001",
    conversationId: "conv-001",
    subject: "Re: Request for 2BHK options in Whitefield",
    body:
      "Hi Rahul,\n\nThanks for reaching out. I’ve shortlisted a few strong 2BHK options in Whitefield that match your budget and gated community preference. Sharing the brochure and initial price sheet for review.\n\nRegards,\nArun Kumar\nMEI CRM",
    previewText:
      "I’ve shortlisted a few strong 2BHK options in Whitefield that match your budget...",
    channel: "email",
    direction: "outgoing",
    type: "email",
    status: "delivered",
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
    attachments: [
      {
        id: "att-001",
        fileName: "Whitefield_2BHK_Brochure.pdf",
        fileType: "pdf",
        fileSizeLabel: "2.4 MB",
        url: "/mock/attachments/Whitefield_2BHK_Brochure.pdf",
      },
      {
        id: "att-002",
        fileName: "Price_Sheet.xlsx",
        fileType: "xlsx",
        fileSizeLabel: "248 KB",
        url: "/mock/attachments/Price_Sheet.xlsx",
      },
    ],
    isRead: true,
    isStarred: true,
    isPinned: false,
    isInternalNote: false,
    createdAt: "2026-04-11T11:42:00+05:30",
    updatedAt: "2026-04-11T11:42:00+05:30",
  },
  {
    id: "msg-003",
    threadId: "thread-001",
    conversationId: "conv-001",
    body:
      "Customer is highly interested. Prioritize Whitefield gated communities with strong clubhouse and covered parking.",
    previewText: "Customer is highly interested. Prioritize Whitefield gated communities...",
    channel: "internal",
    direction: "internal",
    type: "system_note",
    status: "sent",
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
    isRead: true,
    isStarred: false,
    isPinned: true,
    isInternalNote: true,
    createdAt: "2026-04-11T11:50:00+05:30",
    updatedAt: "2026-04-11T11:50:00+05:30",
  },
  {
    id: "msg-004",
    threadId: "thread-001",
    conversationId: "conv-001",
    subject: "Re: Request for 2BHK options in Whitefield",
    body:
      "Hi Arun,\n\nThanks. I liked the first two projects. Can you also share if there are any offers and when we can schedule a site visit?\n\nRegards,\nRahul",
    previewText:
      "I liked the first two projects. Can you also share if there are any offers...",
    channel: "email",
    direction: "incoming",
    type: "email",
    status: "read",
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
    isRead: true,
    isStarred: true,
    isPinned: false,
    isInternalNote: false,
    createdAt: "2026-04-13T09:10:00+05:30",
    updatedAt: "2026-04-13T09:10:00+05:30",
  },

  {
    id: "msg-005",
    threadId: "thread-002",
    conversationId: "conv-002",
    body:
      "Hi Priyanka, your site visit for Golden Grove Villas is confirmed for tomorrow at 11:30 AM. I’m also sharing the location pin and entry details here.",
    previewText: "Your site visit for Golden Grove Villas is confirmed for tomorrow...",
    channel: "whatsapp",
    direction: "outgoing",
    type: "text",
    status: "delivered",
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
        previewUrl: "/mock/attachments/Golden_Grove_Location_Pin.jpg",
      },
    ],
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    createdAt: "2026-04-13T08:40:00+05:30",
    updatedAt: "2026-04-13T08:40:00+05:30",
  },
  {
    id: "msg-006",
    threadId: "thread-002",
    conversationId: "conv-002",
    body: "Got it. I’ll reach by 11:15 AM. Please share the contact person name too.",
    previewText: "I’ll reach by 11:15 AM. Please share the contact person name too.",
    channel: "whatsapp",
    direction: "incoming",
    type: "text",
    status: "replied",
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
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
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
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    createdAt: "2026-04-10T10:00:00+05:30",
    updatedAt: "2026-04-10T10:00:00+05:30",
  },
  {
    id: "msg-008",
    threadId: "thread-003",
    conversationId: "conv-003",
    subject: "Re: Brochure request for plotted development",
    body:
      "Hi Nithin,\n\nPlease find the brochure, price list, and payment schedule attached. Let me know if you want me to also share available plot sizes and launch offers.\n\nRegards,\nSathish",
    previewText: "Please find the brochure, price list, and payment schedule attached...",
    channel: "email",
    direction: "outgoing",
    type: "document",
    status: "replied",
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
        url: "/mock/attachments/North_Enclave_Brochure.pdf",
      },
      {
        id: "att-005",
        fileName: "North_Enclave_Price_List.pdf",
        fileType: "pdf",
        fileSizeLabel: "1.2 MB",
        url: "/mock/attachments/North_Enclave_Price_List.pdf",
      },
    ],
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
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
    isRead: false,
    isStarred: false,
    isPinned: true,
    isInternalNote: false,
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
    previewText: "This is a gentle reminder regarding the pending token advance...",
    channel: "email",
    direction: "outgoing",
    type: "email",
    status: "draft",
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
    isRead: false,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    createdAt: "2026-04-13T06:45:00+05:30",
    updatedAt: "2026-04-13T06:45:00+05:30",
  },

  {
    id: "msg-011",
    threadId: "thread-006",
    conversationId: "conv-006",
    body:
      "Hi Aditya, following up regarding the premium 3BHK options you asked for in Hebbal. Let me know a good time to connect and I’ll share the latest shortlist.",
    previewText: "Following up regarding the premium 3BHK options you asked for in Hebbal...",
    channel: "whatsapp",
    direction: "outgoing",
    type: "text",
    status: "scheduled",
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
    isRead: false,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
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
    isRead: false,
    isStarred: false,
    isPinned: true,
    isInternalNote: true,
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
    previewText: "I have reviewed the legal approval details and everything looks good...",
    channel: "email",
    direction: "incoming",
    type: "email",
    status: "replied",
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
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
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
    isRead: false,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
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
    isRead: true,
    isStarred: false,
    isPinned: false,
    isInternalNote: true,
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
    isRead: true,
    isStarred: true,
    isPinned: false,
    isInternalNote: false,
    createdAt: "2026-04-13T08:48:00+05:30",
    updatedAt: "2026-04-13T08:48:00+05:30",
  },
  {
    id: "msg-017",
    threadId: "thread-011",
    conversationId: "conv-011",
    body:
      "Can you try for 5 lakhs lower? If possible, I’m ready to move fast this week.",
    previewText: "Can you try for 5 lakhs lower? If possible, I’m ready to move fast...",
    channel: "whatsapp",
    direction: "incoming",
    type: "text",
    status: "read",
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
    isRead: false,
    isStarred: true,
    isPinned: true,
    isInternalNote: false,
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
    isRead: false,
    isStarred: false,
    isPinned: false,
    isInternalNote: false,
    createdAt: "2026-04-13T08:12:00+05:30",
    updatedAt: "2026-04-13T08:12:00+05:30",
  },
];

export function getMockMessages(): MessageRecord[] {
  return mockMessages;
}

export function getMessageById(messageId: string): MessageRecord | undefined {
  return mockMessages.find((message) => message.id === messageId);
}

export function getMessagesByThreadId(threadId: string): MessageRecord[] {
  return mockMessages
    .filter((message) => message.threadId === threadId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export function getMessagesByConversationId(
  conversationId: string
): MessageRecord[] {
  return mockMessages
    .filter((message) => message.conversationId === conversationId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export function getMessagesByChannel(
  channel: CommunicationChannel
): MessageRecord[] {
  return mockMessages.filter((message) => message.channel === channel);
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

export function getMessagesWithAttachments(): MessageRecord[] {
  return mockMessages.filter((message) => message.attachments.length > 0);
}

export function getMessagesByStatus(status: DeliveryStatus): MessageRecord[] {
  return mockMessages.filter((message) => message.status === status);
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
      message.attachments.some((attachment) =>
        attachment.fileName.toLowerCase().includes(normalizedQuery)
      )
    );
  });
}

export function getLatestMessages(limit = 10): MessageRecord[] {
  return [...mockMessages]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

export function getMessageCounts() {
  return {
    total: mockMessages.length,
    unread: mockMessages.filter((message) => !message.isRead).length,
    starred: mockMessages.filter((message) => message.isStarred).length,
    pinned: mockMessages.filter((message) => message.isPinned).length,
    internalNotes: mockMessages.filter((message) => message.isInternalNote)
      .length,
    withAttachments: mockMessages.filter(
      (message) => message.attachments.length > 0
    ).length,
    incoming: mockMessages.filter((message) => message.direction === "incoming")
      .length,
    outgoing: mockMessages.filter((message) => message.direction === "outgoing")
      .length,
    internal: mockMessages.filter((message) => message.direction === "internal")
      .length,
  };
}