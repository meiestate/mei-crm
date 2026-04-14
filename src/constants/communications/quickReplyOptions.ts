// src/constants/communications/quickReplyOptions.ts

import type { CommunicationChannel } from "./communicationChannels";

export type QuickReplyCategory =
  | "general"
  | "introduction"
  | "follow_up"
  | "site_visit"
  | "pricing"
  | "brochure"
  | "payment"
  | "negotiation"
  | "reminder"
  | "re_engagement"
  | "support"
  | "internal";

export interface QuickReplyOption {
  id: string;
  key: string;
  label: string;
  shortLabel: string;
  category: QuickReplyCategory;
  icon: string;
  description: string;
  channels: Array<CommunicationChannel | "all">;
  message: string;
  subject?: string;
  tags: string[];
  isPopular: boolean;
  isPinned: boolean;
  enabled: boolean;
  sortOrder: number;
}

export const QUICK_REPLY_CATEGORY_LABELS: Record<QuickReplyCategory, string> = {
  general: "General",
  introduction: "Introduction",
  follow_up: "Follow Up",
  site_visit: "Site Visit",
  pricing: "Pricing",
  brochure: "Brochure",
  payment: "Payment",
  negotiation: "Negotiation",
  reminder: "Reminder",
  re_engagement: "Re-Engagement",
  support: "Support",
  internal: "Internal",
};

export const QUICK_REPLY_CATEGORY_ICONS: Record<QuickReplyCategory, string> = {
  general: "💬",
  introduction: "👋",
  follow_up: "📞",
  site_visit: "🏢",
  pricing: "💰",
  brochure: "📘",
  payment: "💳",
  negotiation: "🤝",
  reminder: "⏰",
  re_engagement: "🔄",
  support: "🛠️",
  internal: "📝",
};

export const QUICK_REPLY_OPTIONS: QuickReplyOption[] = [
  {
    id: "qr-001",
    key: "intro-first-response",
    label: "First Response Introduction",
    shortLabel: "Intro",
    category: "introduction",
    icon: "👋",
    description: "Initial response to a new lead or inquiry.",
    channels: ["all", "email", "sms", "whatsapp"],
    subject: "Thanks for your inquiry",
    message:
      "Hi {leadName},\n\nThank you for reaching out to MEI. I’m happy to help you with the property details. Please share your preferred location, budget, and property type so I can guide you better.\n\nRegards,\n{agentName}",
    tags: ["new lead", "intro", "first response"],
    isPopular: true,
    isPinned: true,
    enabled: true,
    sortOrder: 1,
  },
  {
    id: "qr-002",
    key: "follow-up-checking-interest",
    label: "Follow-up Interest Check",
    shortLabel: "Interest Check",
    category: "follow_up",
    icon: "📞",
    description: "Simple follow-up to check if the customer is still interested.",
    channels: ["all", "email", "sms", "whatsapp"],
    message:
      "Hi {leadName}, just checking in regarding your property requirement. Are you still looking for options in {location}? I can shortlist the best ones for you.",
    tags: ["follow up", "interest", "check-in"],
    isPopular: true,
    isPinned: true,
    enabled: true,
    sortOrder: 2,
  },
  {
    id: "qr-003",
    key: "site-visit-confirmation",
    label: "Site Visit Confirmation",
    shortLabel: "Visit Confirm",
    category: "site_visit",
    icon: "🏢",
    description: "Confirm customer site visit date and time.",
    channels: ["all", "email", "sms", "whatsapp"],
    subject: "Site visit confirmation",
    message:
      "Hi {leadName}, your site visit for {projectName} is confirmed on {siteVisitDate} at {siteVisitTime}. I will share the location and meeting point before your visit.",
    tags: ["site visit", "confirmation", "visit"],
    isPopular: true,
    isPinned: false,
    enabled: true,
    sortOrder: 3,
  },
  {
    id: "qr-004",
    key: "share-brochure",
    label: "Share Brochure",
    shortLabel: "Brochure",
    category: "brochure",
    icon: "📘",
    description: "Send brochure and project info to customer.",
    channels: ["all", "email", "whatsapp"],
    subject: "Project brochure and details",
    message:
      "Hi {leadName},\n\nPlease find the brochure for {projectName}. It includes project highlights, amenities, floor plans, and pricing overview. Let me know which unit type you would like to explore further.\n\nRegards,\n{agentName}",
    tags: ["brochure", "project details", "share"],
    isPopular: true,
    isPinned: true,
    enabled: true,
    sortOrder: 4,
  },
  {
    id: "qr-005",
    key: "share-pricing-details",
    label: "Share Pricing Details",
    shortLabel: "Pricing",
    category: "pricing",
    icon: "💰",
    description: "Send pricing and cost sheet summary.",
    channels: ["all", "email", "sms", "whatsapp"],
    subject: "Pricing details for your requested property",
    message:
      "Hi {leadName}, the latest pricing for {projectName} starts from {price}. I can also share the detailed cost sheet, payment schedule, and available offers if you want.",
    tags: ["price", "cost sheet", "pricing"],
    isPopular: true,
    isPinned: false,
    enabled: true,
    sortOrder: 5,
  },
  {
    id: "qr-006",
    key: "payment-reminder",
    label: "Payment Reminder",
    shortLabel: "Payment",
    category: "payment",
    icon: "💳",
    description: "Gentle reminder for token or booking payment.",
    channels: ["all", "email", "sms", "whatsapp"],
    subject: "Friendly payment reminder",
    message:
      "Hi {leadName}, this is a gentle reminder regarding the pending payment for {projectName}. Please let me know if you need the payment link, bank details, or any clarification before proceeding.",
    tags: ["payment", "reminder", "booking"],
    isPopular: true,
    isPinned: false,
    enabled: true,
    sortOrder: 6,
  },
  {
    id: "qr-007",
    key: "negotiation-update",
    label: "Negotiation Update",
    shortLabel: "Negotiation",
    category: "negotiation",
    icon: "🤝",
    description: "Update customer on revised offer or negotiation progress.",
    channels: ["all", "email", "whatsapp"],
    subject: "Updated offer discussion",
    message:
      "Hi {leadName}, I spoke with the sales team regarding your offer for {projectName}. There is some room for discussion, and I’d like to walk you through the latest update. Please let me know a convenient time to call.",
    tags: ["offer", "negotiation", "discount"],
    isPopular: false,
    isPinned: false,
    enabled: true,
    sortOrder: 7,
  },
  {
    id: "qr-008",
    key: "callback-reminder",
    label: "Callback Reminder",
    shortLabel: "Callback",
    category: "reminder",
    icon: "⏰",
    description: "Remind customer about scheduled callback.",
    channels: ["all", "sms", "whatsapp"],
    message:
      "Hi {leadName}, this is a reminder for our callback today at {callbackTime}. I’ll connect with you to discuss {projectName} and the available options.",
    tags: ["callback", "reminder", "call"],
    isPopular: false,
    isPinned: false,
    enabled: true,
    sortOrder: 8,
  },
  {
    id: "qr-009",
    key: "re-engage-cold-lead",
    label: "Re-engage Cold Lead",
    shortLabel: "Re-Engage",
    category: "re_engagement",
    icon: "🔄",
    description: "Reconnect with an inactive lead.",
    channels: ["all", "email", "sms", "whatsapp"],
    subject: "Still looking for the right property?",
    message:
      "Hi {leadName}, it has been a while since we last connected. If you are still exploring properties in {location}, I can send you a fresh shortlist based on your current budget and preferences.",
    tags: ["inactive", "re-engagement", "cold lead"],
    isPopular: true,
    isPinned: false,
    enabled: true,
    sortOrder: 9,
  },
  {
    id: "qr-010",
    key: "customer-support-response",
    label: "Support Response",
    shortLabel: "Support",
    category: "support",
    icon: "🛠️",
    description: "Reply to a support or issue-based customer message.",
    channels: ["all", "email", "sms", "whatsapp"],
    subject: "We are checking this for you",
    message:
      "Hi {leadName}, thank you for bringing this to our notice. We are checking the issue and will update you shortly. Please share any additional details if needed.",
    tags: ["support", "issue", "help"],
    isPopular: false,
    isPinned: false,
    enabled: true,
    sortOrder: 10,
  },
  {
    id: "qr-011",
    key: "internal-manager-note",
    label: "Internal Manager Note",
    shortLabel: "Manager Note",
    category: "internal",
    icon: "📝",
    description: "Internal note for team coordination.",
    channels: ["all", "internal"],
    message:
      "Lead prefers {propertyType} in {location}. Budget discussed around {budget}. Follow up again on {followUpDate}. Priority: {priority}.",
    tags: ["internal", "note", "manager"],
    isPopular: false,
    isPinned: true,
    enabled: true,
    sortOrder: 11,
  },
  {
    id: "qr-012",
    key: "general-thank-you",
    label: "General Thank You",
    shortLabel: "Thank You",
    category: "general",
    icon: "🙏",
    description: "Thank the customer after a discussion or visit.",
    channels: ["all", "email", "sms", "whatsapp"],
    subject: "Thank you for your time",
    message:
      "Hi {leadName}, thank you for your time today. It was great speaking with you. I’ll share the next steps and relevant property options shortly.",
    tags: ["thanks", "visit", "discussion"],
    isPopular: true,
    isPinned: false,
    enabled: true,
    sortOrder: 12,
  },
];

export const ACTIVE_QUICK_REPLY_OPTIONS = QUICK_REPLY_OPTIONS.filter(
  (option) => option.enabled
).sort((a, b) => a.sortOrder - b.sortOrder);

export const QUICK_REPLY_CATEGORY_OPTIONS = Object.entries(
  QUICK_REPLY_CATEGORY_LABELS
).map(([key, label]) => ({
  key: key as QuickReplyCategory,
  label,
  icon: QUICK_REPLY_CATEGORY_ICONS[key as QuickReplyCategory],
}));

export function isQuickReplyCategory(value: unknown): value is QuickReplyCategory {
  return (
    value === "general" ||
    value === "introduction" ||
    value === "follow_up" ||
    value === "site_visit" ||
    value === "pricing" ||
    value === "brochure" ||
    value === "payment" ||
    value === "negotiation" ||
    value === "reminder" ||
    value === "re_engagement" ||
    value === "support" ||
    value === "internal"
  );
}

export function getQuickReplyCategoryLabel(
  category: QuickReplyCategory
): string {
  return QUICK_REPLY_CATEGORY_LABELS[category];
}

export function getQuickReplyCategoryIcon(
  category: QuickReplyCategory
): string {
  return QUICK_REPLY_CATEGORY_ICONS[category];
}

export function getAllQuickReplyOptions(): QuickReplyOption[] {
  return ACTIVE_QUICK_REPLY_OPTIONS;
}

export function getQuickReplyById(id: string): QuickReplyOption | undefined {
  return ACTIVE_QUICK_REPLY_OPTIONS.find((option) => option.id === id);
}

export function getQuickReplyByKey(key: string): QuickReplyOption | undefined {
  return ACTIVE_QUICK_REPLY_OPTIONS.find((option) => option.key === key);
}

export function getQuickRepliesByCategory(
  category: QuickReplyCategory
): QuickReplyOption[] {
  return ACTIVE_QUICK_REPLY_OPTIONS.filter(
    (option) => option.category === category
  );
}

export function getQuickRepliesByChannel(
  channel: CommunicationChannel | "all"
): QuickReplyOption[] {
  return ACTIVE_QUICK_REPLY_OPTIONS.filter((option) =>
    option.channels.includes(channel)
  );
}

export function getPopularQuickReplies(): QuickReplyOption[] {
  return ACTIVE_QUICK_REPLY_OPTIONS.filter((option) => option.isPopular);
}

export function getPinnedQuickReplies(): QuickReplyOption[] {
  return ACTIVE_QUICK_REPLY_OPTIONS.filter((option) => option.isPinned);
}

export function searchQuickReplies(query: string): QuickReplyOption[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return ACTIVE_QUICK_REPLY_OPTIONS;
  }

  return ACTIVE_QUICK_REPLY_OPTIONS.filter((option) => {
    return (
      option.label.toLowerCase().includes(normalizedQuery) ||
      option.shortLabel.toLowerCase().includes(normalizedQuery) ||
      option.description.toLowerCase().includes(normalizedQuery) ||
      option.message.toLowerCase().includes(normalizedQuery) ||
      (option.subject ?? "").toLowerCase().includes(normalizedQuery) ||
      option.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  });
}

export function getQuickReplyFilterOptions(): Array<{
  label: string;
  value: string;
}> {
  return ACTIVE_QUICK_REPLY_OPTIONS.map((option) => ({
    label: option.label,
    value: option.id,
  }));
}

export function getQuickReplyCategoryFilterOptions(): Array<{
  label: string;
  value: QuickReplyCategory;
}> {
  return QUICK_REPLY_CATEGORY_OPTIONS.map((option) => ({
    label: option.label,
    value: option.key,
  }));
}

export function isQuickReplyAllowedForChannel(
  option: QuickReplyOption,
  channel: CommunicationChannel | "all"
): boolean {
  return option.channels.includes(channel);
}

export function getDefaultQuickReplyForChannel(
  channel: CommunicationChannel
): QuickReplyOption | undefined {
  switch (channel) {
    case "email":
      return getQuickReplyByKey("intro-first-response");
    case "sms":
      return getQuickReplyByKey("follow-up-checking-interest");
    case "whatsapp":
      return getQuickReplyByKey("site-visit-confirmation");
    case "internal":
      return getQuickReplyByKey("internal-manager-note");
    default:
      return undefined;
  }
}

export function getQuickRepliesGroupedByCategory(): Record<
  QuickReplyCategory,
  QuickReplyOption[]
> {
  return ACTIVE_QUICK_REPLY_OPTIONS.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }

    acc[option.category].push(option);
    return acc;
  }, {} as Record<QuickReplyCategory, QuickReplyOption[]>);
}