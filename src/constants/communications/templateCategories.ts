// src/constants/communications/templateCategories.ts

import type { CommunicationChannel } from "./communicationChannels";

export type TemplateCategory =
  | "general"
  | "welcome"
  | "introduction"
  | "follow_up"
  | "site_visit"
  | "brochure"
  | "pricing"
  | "offers"
  | "payment"
  | "reminder"
  | "support"
  | "re_engagement"
  | "internal";

export interface TemplateCategoryOption {
  key: TemplateCategory;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  enabled: boolean;
  sortOrder: number;
  channels: Array<CommunicationChannel | "all">;
  isPopular: boolean;
}

export const TEMPLATE_CATEGORY_KEYS = {
  GENERAL: "general",
  WELCOME: "welcome",
  INTRODUCTION: "introduction",
  FOLLOW_UP: "follow_up",
  SITE_VISIT: "site_visit",
  BROCHURE: "brochure",
  PRICING: "pricing",
  OFFERS: "offers",
  PAYMENT: "payment",
  REMINDER: "reminder",
  SUPPORT: "support",
  RE_ENGAGEMENT: "re_engagement",
  INTERNAL: "internal",
} as const;

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  general: "General",
  welcome: "Welcome",
  introduction: "Introduction",
  follow_up: "Follow Up",
  site_visit: "Site Visit",
  brochure: "Brochure",
  pricing: "Pricing",
  offers: "Offers",
  payment: "Payment",
  reminder: "Reminder",
  support: "Support",
  re_engagement: "Re-Engagement",
  internal: "Internal",
};

export const TEMPLATE_CATEGORY_SHORT_LABELS: Record<
  TemplateCategory,
  string
> = {
  general: "General",
  welcome: "Welcome",
  introduction: "Intro",
  follow_up: "Follow Up",
  site_visit: "Visit",
  brochure: "Brochure",
  pricing: "Pricing",
  offers: "Offers",
  payment: "Payment",
  reminder: "Reminder",
  support: "Support",
  re_engagement: "Re-Engage",
  internal: "Internal",
};

export const TEMPLATE_CATEGORY_ICONS: Record<TemplateCategory, string> = {
  general: "📄",
  welcome: "🎉",
  introduction: "👋",
  follow_up: "📞",
  site_visit: "🏢",
  brochure: "📘",
  pricing: "💰",
  offers: "🏷️",
  payment: "💳",
  reminder: "⏰",
  support: "🛠️",
  re_engagement: "🔄",
  internal: "📝",
};

export const TEMPLATE_CATEGORY_DESCRIPTIONS: Record<
  TemplateCategory,
  string
> = {
  general: "Common reusable templates for everyday communication.",
  welcome: "Welcome templates for onboarding new leads or customers.",
  introduction: "Introductory templates for first-time outreach and response.",
  follow_up: "Templates for checking interest and moving the conversation forward.",
  site_visit: "Templates for scheduling, confirming, and following up on site visits.",
  brochure: "Templates used to share brochures, project highlights, and documents.",
  pricing: "Templates for cost sheet, pricing details, and budget discussions.",
  offers: "Templates related to discounts, deals, and promotional offers.",
  payment: "Templates for booking amount, token advance, and payment guidance.",
  reminder: "Reminder templates for callback, meeting, payment, or follow-up.",
  support: "Templates for issue handling, resolution, and customer care.",
  re_engagement: "Templates to reconnect inactive or cold leads.",
  internal: "Internal communication templates for team coordination and notes.",
};

export const TEMPLATE_CATEGORY_COLORS: Record<
  TemplateCategory,
  {
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  }
> = {
  general: {
    color: "#475569",
    bgColor: "rgba(71,85,105,0.10)",
    borderColor: "rgba(71,85,105,0.24)",
    textColor: "#334155",
  },
  welcome: {
    color: "#16a34a",
    bgColor: "rgba(22,163,74,0.10)",
    borderColor: "rgba(22,163,74,0.24)",
    textColor: "#15803d",
  },
  introduction: {
    color: "#2563eb",
    bgColor: "rgba(37,99,235,0.10)",
    borderColor: "rgba(37,99,235,0.24)",
    textColor: "#1d4ed8",
  },
  follow_up: {
    color: "#7c3aed",
    bgColor: "rgba(124,58,237,0.10)",
    borderColor: "rgba(124,58,237,0.24)",
    textColor: "#6d28d9",
  },
  site_visit: {
    color: "#0f766e",
    bgColor: "rgba(15,118,110,0.10)",
    borderColor: "rgba(15,118,110,0.24)",
    textColor: "#0f766e",
  },
  brochure: {
    color: "#0891b2",
    bgColor: "rgba(8,145,178,0.10)",
    borderColor: "rgba(8,145,178,0.24)",
    textColor: "#0e7490",
  },
  pricing: {
    color: "#d97706",
    bgColor: "rgba(217,119,6,0.10)",
    borderColor: "rgba(217,119,6,0.24)",
    textColor: "#b45309",
  },
  offers: {
    color: "#dc2626",
    bgColor: "rgba(220,38,38,0.10)",
    borderColor: "rgba(220,38,38,0.24)",
    textColor: "#b91c1c",
  },
  payment: {
    color: "#ea580c",
    bgColor: "rgba(234,88,12,0.10)",
    borderColor: "rgba(234,88,12,0.24)",
    textColor: "#c2410c",
  },
  reminder: {
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.10)",
    borderColor: "rgba(139,92,246,0.24)",
    textColor: "#7c3aed",
  },
  support: {
    color: "#0284c7",
    bgColor: "rgba(2,132,199,0.10)",
    borderColor: "rgba(2,132,199,0.24)",
    textColor: "#0369a1",
  },
  re_engagement: {
    color: "#14b8a6",
    bgColor: "rgba(20,184,166,0.10)",
    borderColor: "rgba(20,184,166,0.24)",
    textColor: "#0f766e",
  },
  internal: {
    color: "#78716c",
    bgColor: "rgba(120,113,108,0.10)",
    borderColor: "rgba(120,113,108,0.24)",
    textColor: "#57534e",
  },
};

export const TEMPLATE_CATEGORY_OPTIONS: TemplateCategoryOption[] = [
  {
    key: "general",
    label: "General",
    shortLabel: "General",
    icon: TEMPLATE_CATEGORY_ICONS.general,
    description: TEMPLATE_CATEGORY_DESCRIPTIONS.general,
    color: TEMPLATE_CATEGORY_COLORS.general.color,
    bgColor: TEMPLATE_CATEGORY_COLORS.general.bgColor,
    borderColor: TEMPLATE_CATEGORY_COLORS.general.borderColor,
    textColor: TEMPLATE_CATEGORY_COLORS.general.textColor,
    enabled: true,
    sortOrder: 1,
    channels: ["all", "email", "sms", "whatsapp", "internal"],
    isPopular: true,
  },
  {
    key: "welcome",
    label: "Welcome",
    shortLabel: "Welcome",
    icon: TEMPLATE_CATEGORY_ICONS.welcome,
    description: TEMPLATE_CATEGORY_DESCRIPTIONS.welcome,
    color: TEMPLATE_CATEGORY_COLORS.welcome.color,
    bgColor: TEMPLATE_CATEGORY_COLORS.welcome.bgColor,
    borderColor: TEMPLATE_CATEGORY_COLORS.welcome.borderColor,
    textColor: TEMPLATE_CATEGORY_COLORS.welcome.textColor,
    enabled: true,
    sortOrder: 2,
    channels: ["all", "email", "sms", "whatsapp"],
    isPopular: true,
  },
  {
    key: "introduction",
    label: "Introduction",
    shortLabel: "Intro",
    icon: TEMPLATE_CATEGORY_ICONS.introduction,
    description: TEMPLATE_CATEGORY_DESCRIPTIONS.introduction,
    color: TEMPLATE_CATEGORY_COLORS.introduction.color,
    bgColor: TEMPLATE_CATEGORY_COLORS.introduction.bgColor,
    borderColor: TEMPLATE_CATEGORY_COLORS.introduction.borderColor,
    textColor: TEMPLATE_CATEGORY_COLORS.introduction.textColor,
    enabled: true,
    sortOrder: 3,
    channels: ["all", "email", "sms", "whatsapp"],
    isPopular: true,
  },
  {
    key: "follow_up",
    label: "Follow Up",
    shortLabel: "Follow Up",
    icon: TEMPLATE_CATEGORY_ICONS.follow_up,
    description: TEMPLATE_CATEGORY_DESCRIPTIONS.follow_up,
    color: TEMPLATE_CATEGORY_COLORS.follow_up.color,
    bgColor: TEMPLATE_CATEGORY_COLORS.follow_up.bgColor,
    borderColor: TEMPLATE_CATEGORY_COLORS.follow_up.borderColor,
    textColor: TEMPLATE_CATEGORY_COLORS.follow_up.textColor,
    enabled: true,
    sortOrder: 4,
    channels: ["all", "email", "sms", "whatsapp"],
    isPopular: true,
  },
  {
    key: "site_visit",
    label: "Site Visit",
    shortLabel: "Visit",
    icon: TEMPLATE_CATEGORY_ICONS.site_visit,
    description: TEMPLATE_CATEGORY_DESCRIPTIONS.site_visit,
    color: TEMPLATE_CATEGORY_COLORS.site_visit.color,
    bgColor: TEMPLATE_CATEGORY_COLORS.site_visit.bgColor,
    borderColor: TEMPLATE_CATEGORY_COLORS.site_visit.borderColor,
    textColor: TEMPLATE_CATEGORY_COLORS.site_visit.textColor,
    enabled: true,
    sortOrder: 5,
    channels: ["all", "email", "sms", "whatsapp"],
    isPopular: true,
  },
  {
    key: "brochure",
    label: "Brochure",
    shortLabel: "Brochure",
    icon: TEMPLATE_CATEGORY_ICONS.brochure,
    description: TEMPLATE_CATEGORY_DESCRIPTIONS.brochure,
    color: TEMPLATE_CATEGORY_COLORS.brochure.color,
    bgColor: TEMPLATE_CATEGORY_COLORS.brochure.bgColor,
    borderColor: TEMPLATE_CATEGORY_COLORS.brochure.borderColor,
    textColor: TEMPLATE_CATEGORY_COLORS.brochure.textColor,
    enabled: true,
    sortOrder: 6,
    channels: ["all", "email", "whatsapp"],
    isPopular: true,
  },
  {
    key: "pricing",
    label: "Pricing",
    shortLabel: "Pricing",
    icon: TEMPLATE_CATEGORY_ICONS.pricing,
    description: TEMPLATE_CATEGORY_DESCRIPTIONS.pricing,
    color: TEMPLATE_CATEGORY_COLORS.pricing.color,
    bgColor: TEMPLATE_CATEGORY_COLORS.pricing.bgColor,
    borderColor: TEMPLATE_CATEGORY_COLORS.pricing.borderColor,
    textColor: TEMPLATE_CATEGORY_COLORS.pricing.textColor,
    enabled: true,
    sortOrder: 7,
    channels: ["all", "email", "sms", "whatsapp"],
    isPopular: true,
  },
  {
    key: "offers",
    label: "Offers",
    shortLabel: "Offers",
    icon: TEMPLATE_CATEGORY_ICONS.offers,
    description: TEMPLATE_CATEGORY_DESCRIPTIONS.offers,
    color: TEMPLATE_CATEGORY_COLORS.offers.color,
    bgColor: TEMPLATE_CATEGORY_COLORS.offers.bgColor,
    borderColor: TEMPLATE_CATEGORY_COLORS.offers.borderColor,
    textColor: TEMPLATE_CATEGORY_COLORS.offers.textColor,
    enabled: true,
    sortOrder: 8,
    channels: ["all", "email", "sms", "whatsapp"],
    isPopular: true,
  },
  {
    key: "payment",
    label: "Payment",
    shortLabel: "Payment",
    icon: TEMPLATE_CATEGORY_ICONS.payment,
    description: TEMPLATE_CATEGORY_DESCRIPTIONS.payment,
    color: TEMPLATE_CATEGORY_COLORS.payment.color,
    bgColor: TEMPLATE_CATEGORY_COLORS.payment.bgColor,
    borderColor: TEMPLATE_CATEGORY_COLORS.payment.borderColor,
    textColor: TEMPLATE_CATEGORY_COLORS.payment.textColor,
    enabled: true,
    sortOrder: 9,
    channels: ["all", "email", "sms", "whatsapp"],
    isPopular: true,
  },
  {
    key: "reminder",
    label: "Reminder",
    shortLabel: "Reminder",
    icon: TEMPLATE_CATEGORY_ICONS.reminder,
    description: TEMPLATE_CATEGORY_DESCRIPTIONS.reminder,
    color: TEMPLATE_CATEGORY_COLORS.reminder.color,
    bgColor: TEMPLATE_CATEGORY_COLORS.reminder.bgColor,
    borderColor: TEMPLATE_CATEGORY_COLORS.reminder.borderColor,
    textColor: TEMPLATE_CATEGORY_COLORS.reminder.textColor,
    enabled: true,
    sortOrder: 10,
    channels: ["all", "email", "sms", "whatsapp"],
    isPopular: true,
  },
  {
    key: "support",
    label: "Support",
    shortLabel: "Support",
    icon: TEMPLATE_CATEGORY_ICONS.support,
    description: TEMPLATE_CATEGORY_DESCRIPTIONS.support,
    color: TEMPLATE_CATEGORY_COLORS.support.color,
    bgColor: TEMPLATE_CATEGORY_COLORS.support.bgColor,
    borderColor: TEMPLATE_CATEGORY_COLORS.support.borderColor,
    textColor: TEMPLATE_CATEGORY_COLORS.support.textColor,
    enabled: true,
    sortOrder: 11,
    channels: ["all", "email", "sms", "whatsapp"],
    isPopular: false,
  },
  {
    key: "re_engagement",
    label: "Re-Engagement",
    shortLabel: "Re-Engage",
    icon: TEMPLATE_CATEGORY_ICONS.re_engagement,
    description: TEMPLATE_CATEGORY_DESCRIPTIONS.re_engagement,
    color: TEMPLATE_CATEGORY_COLORS.re_engagement.color,
    bgColor: TEMPLATE_CATEGORY_COLORS.re_engagement.bgColor,
    borderColor: TEMPLATE_CATEGORY_COLORS.re_engagement.borderColor,
    textColor: TEMPLATE_CATEGORY_COLORS.re_engagement.textColor,
    enabled: true,
    sortOrder: 12,
    channels: ["all", "email", "sms", "whatsapp"],
    isPopular: true,
  },
  {
    key: "internal",
    label: "Internal",
    shortLabel: "Internal",
    icon: TEMPLATE_CATEGORY_ICONS.internal,
    description: TEMPLATE_CATEGORY_DESCRIPTIONS.internal,
    color: TEMPLATE_CATEGORY_COLORS.internal.color,
    bgColor: TEMPLATE_CATEGORY_COLORS.internal.bgColor,
    borderColor: TEMPLATE_CATEGORY_COLORS.internal.borderColor,
    textColor: TEMPLATE_CATEGORY_COLORS.internal.textColor,
    enabled: true,
    sortOrder: 13,
    channels: ["all", "internal"],
    isPopular: false,
  },
];

export const ACTIVE_TEMPLATE_CATEGORY_OPTIONS = TEMPLATE_CATEGORY_OPTIONS.filter(
  (category) => category.enabled
).sort((a, b) => a.sortOrder - b.sortOrder);

export function isTemplateCategory(value: unknown): value is TemplateCategory {
  return (
    value === "general" ||
    value === "welcome" ||
    value === "introduction" ||
    value === "follow_up" ||
    value === "site_visit" ||
    value === "brochure" ||
    value === "pricing" ||
    value === "offers" ||
    value === "payment" ||
    value === "reminder" ||
    value === "support" ||
    value === "re_engagement" ||
    value === "internal"
  );
}

export function getTemplateCategoryLabel(category: TemplateCategory): string {
  return TEMPLATE_CATEGORY_LABELS[category];
}

export function getTemplateCategoryShortLabel(
  category: TemplateCategory
): string {
  return TEMPLATE_CATEGORY_SHORT_LABELS[category];
}

export function getTemplateCategoryIcon(category: TemplateCategory): string {
  return TEMPLATE_CATEGORY_ICONS[category];
}

export function getTemplateCategoryDescription(
  category: TemplateCategory
): string {
  return TEMPLATE_CATEGORY_DESCRIPTIONS[category];
}

export function getTemplateCategoryColors(category: TemplateCategory): {
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
} {
  return TEMPLATE_CATEGORY_COLORS[category];
}

export function getTemplateCategoryOption(
  category: TemplateCategory
): TemplateCategoryOption | undefined {
  return TEMPLATE_CATEGORY_OPTIONS.find((item) => item.key === category);
}

export function getEnabledTemplateCategories(): TemplateCategoryOption[] {
  return ACTIVE_TEMPLATE_CATEGORY_OPTIONS;
}

export function getPopularTemplateCategories(): TemplateCategoryOption[] {
  return ACTIVE_TEMPLATE_CATEGORY_OPTIONS.filter(
    (category) => category.isPopular
  );
}

export function getTemplateCategoryFilterOptions(): Array<{
  label: string;
  value: TemplateCategory;
}> {
  return ACTIVE_TEMPLATE_CATEGORY_OPTIONS.map((category) => ({
    label: category.label,
    value: category.key,
  }));
}

export function isTemplateCategoryAllowedForChannel(
  category: TemplateCategory,
  channel: CommunicationChannel | "all"
): boolean {
  const categoryOption = getTemplateCategoryOption(category);

  if (!categoryOption) {
    return false;
  }

  return categoryOption.channels.includes(channel);
}

export function getAllowedChannelsForTemplateCategory(
  category: TemplateCategory
): Array<CommunicationChannel | "all"> {
  return getTemplateCategoryOption(category)?.channels ?? ["all"];
}