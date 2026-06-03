// =====================================================
// MEI CRM - mail.config.ts
// Frontend-safe mail configuration
// Vite + React + TypeScript
// -----------------------------------------------------
// IMPORTANT:
// SMTP_HOST / SMTP_PASSWORD / API_SECRET frontend-ல்
// வைக்கக்கூடாது. Email send backend API வழியாக மட்டும்.
// Frontend-ல் mail endpoints, template keys, support email,
// sender display metadata மட்டும் maintain செய்யவும்.
// =====================================================

export type MailEnvironment = "development" | "staging" | "production";

export type MailProvider =
  | "backend_api"
  | "sendgrid"
  | "mailgun"
  | "ses"
  | "smtp"
  | "mock";

export type MailTemplateKey =
  | "welcome"
  | "email_verification"
  | "password_reset"
  | "otp_login"
  | "lead_assigned"
  | "lead_follow_up"
  | "deal_created"
  | "deal_won"
  | "task_assigned"
  | "task_due_reminder"
  | "invoice_generated"
  | "payment_received"
  | "support_ticket_created"
  | "support_ticket_replied";

export type MailConfig = {
  environment: MailEnvironment;
  provider: MailProvider;
  enabled: boolean;
  api: {
    baseUrl: string;
    sendEndpoint: string;
    templateEndpoint: string;
    statusEndpoint: string;
    timeoutMs: number;
    retryCount: number;
  };
  sender: {
    appName: string;
    defaultFromName: string;
    defaultReplyTo: string;
    supportEmail: string;
    salesEmail: string;
    billingEmail: string;
    noReplyEmail: string;
  };
  templates: Record<MailTemplateKey, string>;
  features: {
    enableTransactionalEmails: boolean;
    enableMarketingEmails: boolean;
    enableOtpEmail: boolean;
    enableLeadEmails: boolean;
    enableDealEmails: boolean;
    enableTaskEmails: boolean;
    enableBillingEmails: boolean;
    enableSupportEmails: boolean;
    enableMockEmails: boolean;
  };
  validation: {
    maxRecipients: number;
    maxSubjectLength: number;
    maxBodyLength: number;
    allowedAttachmentTypes: string[];
    maxAttachmentSizeMb: number;
  };
  localPreview: {
    enabled: boolean;
    storageKey: string;
    keepLastCount: number;
  };
};

export type MailPayload = {
  to: string | string[];
  subject: string;
  body?: string;
  html?: string;
  templateKey?: MailTemplateKey;
  templateData?: Record<string, unknown>;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
};

const getEnvValue = (key: string, fallback: string): string => {
  const value = import.meta.env[key] as string | undefined;
  return value && value.trim().length > 0 ? value : fallback;
};

const getBooleanEnvValue = (key: string, fallback: boolean): boolean => {
  const value = import.meta.env[key] as string | undefined;

  if (!value || value.trim().length === 0) {
    return fallback;
  }

  return ["true", "1", "yes", "on"].includes(value.toLowerCase());
};

const getNumberEnvValue = (key: string, fallback: number): number => {
  const value = import.meta.env[key] as string | undefined;
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const resolveEnvironment = (): MailEnvironment => {
  const env = getEnvValue("VITE_APP_ENV", import.meta.env.MODE || "development");

  if (env === "development" || env === "staging" || env === "production") {
    return env;
  }

  return "development";
};

const resolveMailProvider = (): MailProvider => {
  const provider = getEnvValue("VITE_MAIL_PROVIDER", "backend_api");

  if (
    provider === "backend_api" ||
    provider === "sendgrid" ||
    provider === "mailgun" ||
    provider === "ses" ||
    provider === "smtp" ||
    provider === "mock"
  ) {
    return provider;
  }

  return "backend_api";
};

export const MAIL_CONFIG: MailConfig = {
  environment: resolveEnvironment(),
  provider: resolveMailProvider(),
  enabled: getBooleanEnvValue("VITE_MAIL_ENABLED", true),

  api: {
    baseUrl: getEnvValue("VITE_API_BASE_URL", "http://localhost:4000/api/v1"),
    sendEndpoint: getEnvValue("VITE_MAIL_SEND_ENDPOINT", "/mail/send"),
    templateEndpoint: getEnvValue("VITE_MAIL_TEMPLATE_ENDPOINT", "/mail/templates"),
    statusEndpoint: getEnvValue("VITE_MAIL_STATUS_ENDPOINT", "/mail/status"),
    timeoutMs: getNumberEnvValue("VITE_MAIL_TIMEOUT_MS", 30000),
    retryCount: getNumberEnvValue("VITE_MAIL_RETRY_COUNT", 2),
  },

  sender: {
    appName: getEnvValue("VITE_APP_NAME", "MEI CRM"),
    defaultFromName: getEnvValue("VITE_MAIL_FROM_NAME", "MEI CRM"),
    defaultReplyTo: getEnvValue("VITE_MAIL_REPLY_TO", "support@mei-crm.com"),
    supportEmail: getEnvValue("VITE_SUPPORT_EMAIL", "support@mei-crm.com"),
    salesEmail: getEnvValue("VITE_SALES_EMAIL", "sales@mei-crm.com"),
    billingEmail: getEnvValue("VITE_BILLING_EMAIL", "billing@mei-crm.com"),
    noReplyEmail: getEnvValue("VITE_NO_REPLY_EMAIL", "noreply@mei-crm.com"),
  },

  templates: {
    welcome: "welcome",
    email_verification: "email_verification",
    password_reset: "password_reset",
    otp_login: "otp_login",
    lead_assigned: "lead_assigned",
    lead_follow_up: "lead_follow_up",
    deal_created: "deal_created",
    deal_won: "deal_won",
    task_assigned: "task_assigned",
    task_due_reminder: "task_due_reminder",
    invoice_generated: "invoice_generated",
    payment_received: "payment_received",
    support_ticket_created: "support_ticket_created",
    support_ticket_replied: "support_ticket_replied",
  },

  features: {
    enableTransactionalEmails: getBooleanEnvValue("VITE_ENABLE_TRANSACTIONAL_EMAILS", true),
    enableMarketingEmails: getBooleanEnvValue("VITE_ENABLE_MARKETING_EMAILS", false),
    enableOtpEmail: getBooleanEnvValue("VITE_ENABLE_OTP_EMAIL", true),
    enableLeadEmails: getBooleanEnvValue("VITE_ENABLE_LEAD_EMAILS", true),
    enableDealEmails: getBooleanEnvValue("VITE_ENABLE_DEAL_EMAILS", true),
    enableTaskEmails: getBooleanEnvValue("VITE_ENABLE_TASK_EMAILS", true),
    enableBillingEmails: getBooleanEnvValue("VITE_ENABLE_BILLING_EMAILS", true),
    enableSupportEmails: getBooleanEnvValue("VITE_ENABLE_SUPPORT_EMAILS", true),
    enableMockEmails: getBooleanEnvValue("VITE_ENABLE_MOCK_EMAILS", resolveEnvironment() === "development"),
  },

  validation: {
    maxRecipients: getNumberEnvValue("VITE_MAIL_MAX_RECIPIENTS", 10),
    maxSubjectLength: getNumberEnvValue("VITE_MAIL_MAX_SUBJECT_LENGTH", 160),
    maxBodyLength: getNumberEnvValue("VITE_MAIL_MAX_BODY_LENGTH", 50000),
    allowedAttachmentTypes: [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxAttachmentSizeMb: getNumberEnvValue("VITE_MAIL_MAX_ATTACHMENT_SIZE_MB", 10),
  },

  localPreview: {
    enabled: getBooleanEnvValue("VITE_MAIL_LOCAL_PREVIEW_ENABLED", resolveEnvironment() === "development"),
    storageKey: getEnvValue("VITE_MAIL_LOCAL_PREVIEW_STORAGE_KEY", "mei-crm-mail-preview"),
    keepLastCount: getNumberEnvValue("VITE_MAIL_LOCAL_PREVIEW_KEEP_LAST", 25),
  },
};

export const isMailProduction = MAIL_CONFIG.environment === "production";
export const isMailDevelopment = MAIL_CONFIG.environment === "development";
export const isMailStaging = MAIL_CONFIG.environment === "staging";

export const isMailEnabled = (): boolean => {
  return MAIL_CONFIG.enabled;
};

export const isMockMailEnabled = (): boolean => {
  return MAIL_CONFIG.provider === "mock" || MAIL_CONFIG.features.enableMockEmails;
};

export const getMailApiBaseUrl = (): string => {
  return MAIL_CONFIG.api.baseUrl.replace(/\/$/, "");
};

export const getMailApiUrl = (endpoint: string): string => {
  const baseUrl = getMailApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return `${baseUrl}${cleanEndpoint}`;
};

export const getMailSendUrl = (): string => {
  return getMailApiUrl(MAIL_CONFIG.api.sendEndpoint);
};

export const getMailTemplateUrl = (): string => {
  return getMailApiUrl(MAIL_CONFIG.api.templateEndpoint);
};

export const getMailStatusUrl = (): string => {
  return getMailApiUrl(MAIL_CONFIG.api.statusEndpoint);
};

export const normalizeRecipients = (recipients: string | string[] | undefined): string[] => {
  if (!recipients) {
    return [];
  }

  if (Array.isArray(recipients)) {
    return recipients.map((email) => email.trim()).filter(Boolean);
  }

  return recipients
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateMailPayload = (payload: MailPayload): string[] => {
  const errors: string[] = [];
  const toRecipients = normalizeRecipients(payload.to);
  const ccRecipients = normalizeRecipients(payload.cc);
  const bccRecipients = normalizeRecipients(payload.bcc);
  const allRecipients = [...toRecipients, ...ccRecipients, ...bccRecipients];

  if (toRecipients.length === 0) {
    errors.push("At least one recipient is required.");
  }

  if (allRecipients.length > MAIL_CONFIG.validation.maxRecipients) {
    errors.push(`Maximum ${MAIL_CONFIG.validation.maxRecipients} recipients are allowed.`);
  }

  const invalidEmails = allRecipients.filter((email) => !isValidEmail(email));

  if (invalidEmails.length > 0) {
    errors.push(`Invalid email address: ${invalidEmails.join(", ")}`);
  }

  if (!payload.subject || payload.subject.trim().length === 0) {
    errors.push("Email subject is required.");
  }

  if (payload.subject && payload.subject.length > MAIL_CONFIG.validation.maxSubjectLength) {
    errors.push(`Subject cannot exceed ${MAIL_CONFIG.validation.maxSubjectLength} characters.`);
  }

  const bodyLength = (payload.body?.length ?? 0) + (payload.html?.length ?? 0);

  if (!payload.body && !payload.html && !payload.templateKey) {
    errors.push("Email body, html, or templateKey is required.");
  }

  if (bodyLength > MAIL_CONFIG.validation.maxBodyLength) {
    errors.push(`Email body cannot exceed ${MAIL_CONFIG.validation.maxBodyLength} characters.`);
  }

  if (payload.replyTo && !isValidEmail(payload.replyTo)) {
    errors.push("Reply-to email address is invalid.");
  }

  return errors;
};

export const saveMailPreview = (payload: MailPayload): void => {
  if (!MAIL_CONFIG.localPreview.enabled || typeof window === "undefined") {
    return;
  }

  const storageKey = MAIL_CONFIG.localPreview.storageKey;
  const existingRaw = window.localStorage.getItem(storageKey);
  const existing = existingRaw ? (JSON.parse(existingRaw) as Array<MailPayload & { id: string; createdAt: string }>) : [];

  const nextItem = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const nextItems = [nextItem, ...existing].slice(0, MAIL_CONFIG.localPreview.keepLastCount);
  window.localStorage.setItem(storageKey, JSON.stringify(nextItems));
};

export const getMailPreviews = (): Array<MailPayload & { id: string; createdAt: string }> => {
  if (typeof window === "undefined") {
    return [];
  }

  const existingRaw = window.localStorage.getItem(MAIL_CONFIG.localPreview.storageKey);
  return existingRaw ? (JSON.parse(existingRaw) as Array<MailPayload & { id: string; createdAt: string }>) : [];
};

export const clearMailPreviews = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(MAIL_CONFIG.localPreview.storageKey);
};

export const assertMailConfig = (): void => {
  const errors: string[] = [];

  if (!MAIL_CONFIG.api.baseUrl) {
    errors.push("VITE_API_BASE_URL is required.");
  }

  if (!MAIL_CONFIG.api.sendEndpoint) {
    errors.push("VITE_MAIL_SEND_ENDPOINT is required.");
  }

  if (MAIL_CONFIG.api.timeoutMs <= 0) {
    errors.push("VITE_MAIL_TIMEOUT_MS must be greater than 0.");
  }

  if (MAIL_CONFIG.api.retryCount < 0) {
    errors.push("VITE_MAIL_RETRY_COUNT cannot be negative.");
  }

  if (!isValidEmail(MAIL_CONFIG.sender.supportEmail)) {
    errors.push("VITE_SUPPORT_EMAIL is invalid.");
  }

  if (!isValidEmail(MAIL_CONFIG.sender.defaultReplyTo)) {
    errors.push("VITE_MAIL_REPLY_TO is invalid.");
  }

  if (MAIL_CONFIG.validation.maxRecipients <= 0) {
    errors.push("VITE_MAIL_MAX_RECIPIENTS must be greater than 0.");
  }

  if (errors.length > 0) {
    throw new Error(`Invalid mail configuration:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  }
};

export default MAIL_CONFIG;
