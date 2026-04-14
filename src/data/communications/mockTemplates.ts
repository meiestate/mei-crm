// src/data/communications/mockTemplates.ts

import type { CommunicationChannel } from "../../constants/communications/communicationChannels";
import type { TemplateCategory } from "../../constants/communications/templateCategories";

export type TemplateTone =
  | "professional"
  | "friendly"
  | "formal"
  | "warm"
  | "persuasive"
  | "supportive";

export interface TemplateVariable {
  key: string;
  label: string;
  placeholder: string;
  exampleValue?: string;
  required: boolean;
}

export interface CommunicationTemplateRecord {
  id: string;
  name: string;
  subject?: string;
  category: TemplateCategory;
  channel: CommunicationChannel;
  tone: TemplateTone;
  body: string;
  previewText: string;
  variables: TemplateVariable[];
  tags: string[];
  usageCount: number;
  replyRatePercent: number;
  isFavorite: boolean;
  isPopular: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const mockTemplates: CommunicationTemplateRecord[] = [
  {
    id: "tpl-001",
    name: "First Response Introduction",
    subject: "Thank you for your property inquiry",
    category: "introduction",
    channel: "email",
    tone: "professional",
    body:
      "Hi {{customerName}},\n\nThank you for reaching out regarding {{projectName}}. I’m {{agentName}} from MEI CRM, and I’ll assist you with the best available options based on your requirement.\n\nPlease let me know your preferred configuration, budget, and location priority so I can share the most relevant details.\n\nRegards,\n{{agentName}}\n{{companyName}}",
    previewText:
      "Thank you for reaching out regarding {{projectName}}. I’ll assist you with the best available options...",
    variables: [
      {
        key: "customerName",
        label: "Customer Name",
        placeholder: "{{customerName}}",
        exampleValue: "Rahul",
        required: true,
      },
      {
        key: "projectName",
        label: "Project Name",
        placeholder: "{{projectName}}",
        exampleValue: "Skyline Towers",
        required: true,
      },
      {
        key: "agentName",
        label: "Agent Name",
        placeholder: "{{agentName}}",
        exampleValue: "Arun Kumar",
        required: true,
      },
      {
        key: "companyName",
        label: "Company Name",
        placeholder: "{{companyName}}",
        exampleValue: "MEI CRM",
        required: true,
      },
    ],
    tags: ["first-response", "introduction", "email"],
    usageCount: 294,
    replyRatePercent: 36.4,
    isFavorite: true,
    isPopular: true,
    isActive: true,
    createdBy: "Arun Kumar",
    createdAt: "2026-03-12T09:30:00+05:30",
    updatedAt: "2026-04-10T11:20:00+05:30",
  },
  {
    id: "tpl-002",
    name: "Quick WhatsApp Intro",
    category: "introduction",
    channel: "whatsapp",
    tone: "friendly",
    body:
      "Hi {{customerName}}, this is {{agentName}} from {{companyName}}. Thanks for your interest in {{projectName}}. Share your budget and preferred location, and I’ll send the best options right away.",
    previewText:
      "Thanks for your interest in {{projectName}}. Share your budget and preferred location...",
    variables: [
      {
        key: "customerName",
        label: "Customer Name",
        placeholder: "{{customerName}}",
        required: true,
      },
      {
        key: "agentName",
        label: "Agent Name",
        placeholder: "{{agentName}}",
        required: true,
      },
      {
        key: "companyName",
        label: "Company Name",
        placeholder: "{{companyName}}",
        required: true,
      },
      {
        key: "projectName",
        label: "Project Name",
        placeholder: "{{projectName}}",
        required: true,
      },
    ],
    tags: ["whatsapp", "intro", "quick-response"],
    usageCount: 241,
    replyRatePercent: 43.2,
    isFavorite: true,
    isPopular: true,
    isActive: true,
    createdBy: "Priya Raman",
    createdAt: "2026-03-14T10:00:00+05:30",
    updatedAt: "2026-04-09T17:10:00+05:30",
  },
  {
    id: "tpl-003",
    name: "Site Visit Confirmation",
    subject: "Your site visit is confirmed",
    category: "site_visit",
    channel: "email",
    tone: "professional",
    body:
      "Hi {{customerName}},\n\nYour site visit for {{projectName}} is confirmed on {{visitDate}} at {{visitTime}}.\n\nMeeting Point: {{meetingPoint}}\nContact Person: {{contactPerson}}\n\nPlease let me know if you need the location pin or any support before arrival.\n\nRegards,\n{{agentName}}",
    previewText:
      "Your site visit for {{projectName}} is confirmed on {{visitDate}} at {{visitTime}}...",
    variables: [
      { key: "customerName", label: "Customer Name", placeholder: "{{customerName}}", required: true },
      { key: "projectName", label: "Project Name", placeholder: "{{projectName}}", required: true },
      { key: "visitDate", label: "Visit Date", placeholder: "{{visitDate}}", required: true },
      { key: "visitTime", label: "Visit Time", placeholder: "{{visitTime}}", required: true },
      { key: "meetingPoint", label: "Meeting Point", placeholder: "{{meetingPoint}}", required: true },
      { key: "contactPerson", label: "Contact Person", placeholder: "{{contactPerson}}", required: true },
      { key: "agentName", label: "Agent Name", placeholder: "{{agentName}}", required: true },
    ],
    tags: ["site-visit", "confirmation", "visit-email"],
    usageCount: 196,
    replyRatePercent: 42.3,
    isFavorite: false,
    isPopular: true,
    isActive: true,
    createdBy: "Divya Shree",
    createdAt: "2026-03-16T12:00:00+05:30",
    updatedAt: "2026-04-08T15:00:00+05:30",
  },
  {
    id: "tpl-004",
    name: "Site Visit WhatsApp Reminder",
    category: "reminder",
    channel: "whatsapp",
    tone: "warm",
    body:
      "Hi {{customerName}}, gentle reminder for your site visit at {{projectName}} tomorrow at {{visitTime}}. Please reply here if you need the location pin or want to reschedule.",
    previewText:
      "Gentle reminder for your site visit at {{projectName}} tomorrow at {{visitTime}}...",
    variables: [
      { key: "customerName", label: "Customer Name", placeholder: "{{customerName}}", required: true },
      { key: "projectName", label: "Project Name", placeholder: "{{projectName}}", required: true },
      { key: "visitTime", label: "Visit Time", placeholder: "{{visitTime}}", required: true },
    ],
    tags: ["reminder", "site-visit", "whatsapp"],
    usageCount: 171,
    replyRatePercent: 39.6,
    isFavorite: false,
    isPopular: true,
    isActive: true,
    createdBy: "Priya Raman",
    createdAt: "2026-03-18T09:20:00+05:30",
    updatedAt: "2026-04-11T09:40:00+05:30",
  },
  {
    id: "tpl-005",
    name: "Share Brochure",
    subject: "Brochure and project highlights",
    category: "brochure",
    channel: "email",
    tone: "professional",
    body:
      "Hi {{customerName}},\n\nPlease find the brochure attached for {{projectName}}. I’ve also included key highlights and available configurations for your quick review.\n\nLet me know if you’d like the latest price sheet as well.\n\nRegards,\n{{agentName}}",
    previewText:
      "Please find the brochure attached for {{projectName}}. Let me know if you’d like the latest price sheet...",
    variables: [
      { key: "customerName", label: "Customer Name", placeholder: "{{customerName}}", required: true },
      { key: "projectName", label: "Project Name", placeholder: "{{projectName}}", required: true },
      { key: "agentName", label: "Agent Name", placeholder: "{{agentName}}", required: true },
    ],
    tags: ["brochure", "attachment", "project-details"],
    usageCount: 182,
    replyRatePercent: 27.6,
    isFavorite: true,
    isPopular: true,
    isActive: true,
    createdBy: "Sathish Raj",
    createdAt: "2026-03-20T14:10:00+05:30",
    updatedAt: "2026-04-07T10:30:00+05:30",
  },
  {
    id: "tpl-006",
    name: "Share Price Sheet",
    subject: "Latest pricing details",
    category: "pricing",
    channel: "email",
    tone: "formal",
    body:
      "Hi {{customerName}},\n\nAs requested, please find the latest pricing details for {{projectName}}. The current offer is valid until {{offerEndDate}}.\n\nPlease review and let me know if you want me to explain the payment plan in detail.\n\nRegards,\n{{agentName}}",
    previewText:
      "Please find the latest pricing details for {{projectName}}. The current offer is valid until...",
    variables: [
      { key: "customerName", label: "Customer Name", placeholder: "{{customerName}}", required: true },
      { key: "projectName", label: "Project Name", placeholder: "{{projectName}}", required: true },
      { key: "offerEndDate", label: "Offer End Date", placeholder: "{{offerEndDate}}", required: true },
      { key: "agentName", label: "Agent Name", placeholder: "{{agentName}}", required: true },
    ],
    tags: ["pricing", "cost-sheet", "formal"],
    usageCount: 173,
    replyRatePercent: 33.8,
    isFavorite: false,
    isPopular: true,
    isActive: true,
    createdBy: "Arun Kumar",
    createdAt: "2026-03-21T16:00:00+05:30",
    updatedAt: "2026-04-10T13:30:00+05:30",
  },
  {
    id: "tpl-007",
    name: "Token Advance Reminder",
    subject: "Friendly reminder for token advance",
    category: "payment",
    channel: "email",
    tone: "supportive",
    body:
      "Hi {{customerName}},\n\nThis is a gentle reminder regarding the token advance for {{projectName}}. Please let me know if you need the payment link, bank details, or any clarification before proceeding.\n\nRegards,\n{{agentName}}",
    previewText:
      "This is a gentle reminder regarding the token advance for {{projectName}}...",
    variables: [
      { key: "customerName", label: "Customer Name", placeholder: "{{customerName}}", required: true },
      { key: "projectName", label: "Project Name", placeholder: "{{projectName}}", required: true },
      { key: "agentName", label: "Agent Name", placeholder: "{{agentName}}", required: true },
    ],
    tags: ["payment", "reminder", "token-advance"],
    usageCount: 149,
    replyRatePercent: 30.4,
    isFavorite: false,
    isPopular: true,
    isActive: true,
    createdBy: "Arun Kumar",
    createdAt: "2026-03-22T11:25:00+05:30",
    updatedAt: "2026-04-13T06:30:00+05:30",
  },
  {
    id: "tpl-008",
    name: "Cold Lead Re-Engagement",
    category: "re_engagement",
    channel: "whatsapp",
    tone: "persuasive",
    body:
      "Hi {{customerName}}, checking in once again regarding your interest in {{projectName}}. We currently have updated offers and a few good units available. Reply here if you’d like the latest shortlist.",
    previewText:
      "We currently have updated offers and a few good units available...",
    variables: [
      { key: "customerName", label: "Customer Name", placeholder: "{{customerName}}", required: true },
      { key: "projectName", label: "Project Name", placeholder: "{{projectName}}", required: true },
    ],
    tags: ["re-engagement", "cold-lead", "whatsapp"],
    usageCount: 121,
    replyRatePercent: 19.4,
    isFavorite: false,
    isPopular: true,
    isActive: true,
    createdBy: "Naveen Kumar",
    createdAt: "2026-03-23T18:00:00+05:30",
    updatedAt: "2026-04-12T17:30:00+05:30",
  },
  {
    id: "tpl-009",
    name: "Support Response for File Issue",
    subject: "Resending the requested file",
    category: "support",
    channel: "email",
    tone: "supportive",
    body:
      "Hi {{customerName}},\n\nThanks for letting us know. I’m resending the requested file for {{projectName}} in a compatible format. Please check and let me know if you still face any issue.\n\nRegards,\n{{agentName}}",
    previewText:
      "I’m resending the requested file for {{projectName}} in a compatible format...",
    variables: [
      { key: "customerName", label: "Customer Name", placeholder: "{{customerName}}", required: true },
      { key: "projectName", label: "Project Name", placeholder: "{{projectName}}", required: true },
      { key: "agentName", label: "Agent Name", placeholder: "{{agentName}}", required: true },
    ],
    tags: ["support", "resend", "file-issue"],
    usageCount: 74,
    replyRatePercent: 34.8,
    isFavorite: false,
    isPopular: false,
    isActive: true,
    createdBy: "Priya Raman",
    createdAt: "2026-03-24T10:40:00+05:30",
    updatedAt: "2026-04-12T18:10:00+05:30",
  },
  {
    id: "tpl-010",
    name: "Internal Follow-up Note",
    category: "internal",
    channel: "internal",
    tone: "professional",
    body:
      "Lead {{customerName}} prefers {{preferenceDetail}}. Before next follow-up, check {{actionItem}} and update the CRM timeline.",
    previewText:
      "Lead {{customerName}} prefers {{preferenceDetail}}. Before next follow-up...",
    variables: [
      { key: "customerName", label: "Customer Name", placeholder: "{{customerName}}", required: true },
      { key: "preferenceDetail", label: "Preference Detail", placeholder: "{{preferenceDetail}}", required: true },
      { key: "actionItem", label: "Action Item", placeholder: "{{actionItem}}", required: true },
    ],
    tags: ["internal", "note", "team-coordination"],
    usageCount: 93,
    replyRatePercent: 0,
    isFavorite: true,
    isPopular: false,
    isActive: true,
    createdBy: "Raghav Menon",
    createdAt: "2026-03-25T12:15:00+05:30",
    updatedAt: "2026-04-11T08:20:00+05:30",
  },
  {
    id: "tpl-011",
    name: "Welcome New Inquiry",
    category: "welcome",
    channel: "sms",
    tone: "warm",
    body:
      "Hi {{customerName}}, welcome to {{companyName}}. We received your inquiry for {{projectName}}. Our team will contact you shortly with the best options.",
    previewText:
      "Welcome to {{companyName}}. We received your inquiry for {{projectName}}...",
    variables: [
      { key: "customerName", label: "Customer Name", placeholder: "{{customerName}}", required: true },
      { key: "companyName", label: "Company Name", placeholder: "{{companyName}}", required: true },
      { key: "projectName", label: "Project Name", placeholder: "{{projectName}}", required: true },
    ],
    tags: ["welcome", "sms", "new-inquiry"],
    usageCount: 138,
    replyRatePercent: 18.6,
    isFavorite: false,
    isPopular: true,
    isActive: true,
    createdBy: "Divya Shree",
    createdAt: "2026-03-26T09:00:00+05:30",
    updatedAt: "2026-04-10T09:00:00+05:30",
  },
  {
    id: "tpl-012",
    name: "Follow-up Interest Check",
    category: "follow_up",
    channel: "whatsapp",
    tone: "friendly",
    body:
      "Hi {{customerName}}, just checking in regarding your interest in {{projectName}}. Are you still looking for {{configurationType}} options? I can share a fresh shortlist if needed.",
    previewText:
      "Just checking in regarding your interest in {{projectName}}...",
    variables: [
      { key: "customerName", label: "Customer Name", placeholder: "{{customerName}}", required: true },
      { key: "projectName", label: "Project Name", placeholder: "{{projectName}}", required: true },
      { key: "configurationType", label: "Configuration Type", placeholder: "{{configurationType}}", required: true },
    ],
    tags: ["follow-up", "interest-check", "whatsapp"],
    usageCount: 268,
    replyRatePercent: 29.7,
    isFavorite: true,
    isPopular: true,
    isActive: true,
    createdBy: "Naveen Kumar",
    createdAt: "2026-03-28T16:50:00+05:30",
    updatedAt: "2026-04-13T08:55:00+05:30",
  },
];

export function getMockTemplates(): CommunicationTemplateRecord[] {
  return mockTemplates;
}

export function getTemplateById(
  templateId: string
): CommunicationTemplateRecord | undefined {
  return mockTemplates.find((template) => template.id === templateId);
}

export function getTemplatesByCategory(
  category: TemplateCategory
): CommunicationTemplateRecord[] {
  return mockTemplates.filter((template) => template.category === category);
}

export function getTemplatesByChannel(
  channel: CommunicationChannel
): CommunicationTemplateRecord[] {
  return mockTemplates.filter((template) => template.channel === channel);
}

export function getFavoriteTemplates(): CommunicationTemplateRecord[] {
  return mockTemplates.filter((template) => template.isFavorite);
}

export function getPopularTemplates(): CommunicationTemplateRecord[] {
  return mockTemplates.filter((template) => template.isPopular);
}

export function getActiveTemplates(): CommunicationTemplateRecord[] {
  return mockTemplates.filter((template) => template.isActive);
}

export function searchMockTemplates(
  query: string
): CommunicationTemplateRecord[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return mockTemplates;
  }

  return mockTemplates.filter((template) => {
    return (
      template.name.toLowerCase().includes(normalizedQuery) ||
      (template.subject ?? "").toLowerCase().includes(normalizedQuery) ||
      template.body.toLowerCase().includes(normalizedQuery) ||
      template.previewText.toLowerCase().includes(normalizedQuery) ||
      template.category.toLowerCase().includes(normalizedQuery) ||
      template.channel.toLowerCase().includes(normalizedQuery) ||
      template.tone.toLowerCase().includes(normalizedQuery) ||
      template.createdBy.toLowerCase().includes(normalizedQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
      template.variables.some(
        (variable) =>
          variable.key.toLowerCase().includes(normalizedQuery) ||
          variable.label.toLowerCase().includes(normalizedQuery)
      )
    );
  });
}

export function getTopTemplatesByUsage(
  limit = 5
): CommunicationTemplateRecord[] {
  return [...mockTemplates]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
}

export function getTopTemplatesByReplyRate(
  limit = 5
): CommunicationTemplateRecord[] {
  return [...mockTemplates]
    .sort((a, b) => b.replyRatePercent - a.replyRatePercent)
    .slice(0, limit);
}

export function getTemplateCounts() {
  return {
    total: mockTemplates.length,
    active: mockTemplates.filter((template) => template.isActive).length,
    favorite: mockTemplates.filter((template) => template.isFavorite).length,
    popular: mockTemplates.filter((template) => template.isPopular).length,
    email: mockTemplates.filter((template) => template.channel === "email").length,
    sms: mockTemplates.filter((template) => template.channel === "sms").length,
    whatsapp: mockTemplates.filter((template) => template.channel === "whatsapp").length,
    internal: mockTemplates.filter((template) => template.channel === "internal").length,
  };
}