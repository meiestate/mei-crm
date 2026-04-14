// src/hooks/communications/useSendEmail.ts

import { useEffect, useMemo, useState } from "react";

export type EmailSendStatus =
  | "idle"
  | "saving-draft"
  | "draft-saved"
  | "sending"
  | "sent"
  | "scheduled"
  | "error";

export interface EmailAttachment {
  id: string;
  name: string;
  size: number;
  type?: string;
  url?: string;
}

export interface SentEmailRecord {
  id: string;
  conversationId?: string;
  leadId?: string;
  contactId?: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  attachments: EmailAttachment[];
  createdAt: string;
  sentAt?: string | null;
  scheduledAt?: string | null;
  status: "draft" | "sent" | "scheduled";
}

export interface EmailComposerState {
  conversationId?: string;
  leadId?: string;
  contactId?: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  attachments: EmailAttachment[];
  scheduledAt?: string | null;
}

export interface EmailDraftInput {
  conversationId?: string;
  leadId?: string;
  contactId?: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  body?: string;
  attachments?: EmailAttachment[];
  scheduledAt?: string | null;
}

export interface EmailValidationResult {
  isValid: boolean;
  errors: {
    to?: string;
    cc?: string;
    bcc?: string;
    subject?: string;
    body?: string;
    scheduledAt?: string;
  };
}

export interface UseSendEmailOptions {
  draftStorageKey?: string;
  sentStorageKey?: string;
  autoLoadDraft?: boolean;
  initialState?: Partial<EmailComposerState>;
}

export interface UseSendEmailResult {
  composer: EmailComposerState;
  drafts: SentEmailRecord[];
  sentEmails: SentEmailRecord[];
  status: EmailSendStatus;
  errorMessage: string | null;
  isDirty: boolean;
  isSending: boolean;
  isSavingDraft: boolean;

  setConversationId: (value?: string) => void;
  setLeadId: (value?: string) => void;
  setContactId: (value?: string) => void;
  setTo: (value: string[]) => void;
  setCc: (value: string[]) => void;
  setBcc: (value: string[]) => void;
  setSubject: (value: string) => void;
  setBody: (value: string) => void;
  setScheduledAt: (value?: string | null) => void;

  addRecipient: (type: "to" | "cc" | "bcc", email: string) => void;
  removeRecipient: (type: "to" | "cc" | "bcc", email: string) => void;
  clearRecipients: (type?: "to" | "cc" | "bcc") => void;

  addAttachment: (attachment: EmailAttachment) => void;
  removeAttachment: (attachmentId: string) => void;
  clearAttachments: () => void;

  resetComposer: () => void;
  loadComposer: (value: Partial<EmailComposerState>) => void;
  validateEmail: () => EmailValidationResult;

  saveDraft: () => SentEmailRecord | null;
  loadDraftById: (draftId: string) => SentEmailRecord | null;
  deleteDraft: (draftId: string) => void;

  sendEmail: () => Promise<SentEmailRecord | null>;
  scheduleEmail: (scheduledAt: string) => Promise<SentEmailRecord | null>;

  getDraftById: (draftId: string) => SentEmailRecord | undefined;
  getSentEmailById: (emailId: string) => SentEmailRecord | undefined;
  getEmailsByConversationId: (conversationId: string) => SentEmailRecord[];
}

const DEFAULT_DRAFT_STORAGE_KEY = "mei-crm-email-drafts";
const DEFAULT_SENT_STORAGE_KEY = "mei-crm-email-history";

function getNowIso(): string {
  return new Date().toISOString();
}

function generateId(prefix = "email"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function isValidDate(value?: string | null): boolean {
  if (!value) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string): boolean {
  const email = normalizeEmail(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function uniqueEmails(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((item) => normalizeEmail(item))
        .filter(Boolean)
    )
  );
}

function normalizeAttachments(value: unknown): EmailAttachment[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Partial<EmailAttachment> => typeof item === "object" && item !== null)
    .map((item) => ({
      id:
        typeof item.id === "string" && item.id.trim()
          ? item.id
          : generateId("attachment"),
      name:
        typeof item.name === "string" && item.name.trim()
          ? item.name.trim()
          : "Untitled Attachment",
      size: typeof item.size === "number" && Number.isFinite(item.size) ? item.size : 0,
      type: typeof item.type === "string" ? item.type : undefined,
      url: typeof item.url === "string" ? item.url : undefined,
    }));
}

function getDefaultComposerState(
  initialState?: Partial<EmailComposerState>
): EmailComposerState {
  return {
    conversationId: initialState?.conversationId,
    leadId: initialState?.leadId,
    contactId: initialState?.contactId,
    to: uniqueEmails(initialState?.to ?? []),
    cc: uniqueEmails(initialState?.cc ?? []),
    bcc: uniqueEmails(initialState?.bcc ?? []),
    subject: initialState?.subject?.trim() ?? "",
    body: initialState?.body ?? "",
    attachments: normalizeAttachments(initialState?.attachments ?? []),
    scheduledAt: isValidDate(initialState?.scheduledAt) ? initialState?.scheduledAt : null,
  };
}

function normalizeDraftRecord(input: Partial<SentEmailRecord>): SentEmailRecord {
  const now = getNowIso();

  return {
    id: typeof input.id === "string" && input.id.trim() ? input.id : generateId(),
    conversationId:
      typeof input.conversationId === "string" && input.conversationId.trim()
        ? input.conversationId
        : undefined,
    leadId:
      typeof input.leadId === "string" && input.leadId.trim()
        ? input.leadId
        : undefined,
    contactId:
      typeof input.contactId === "string" && input.contactId.trim()
        ? input.contactId
        : undefined,
    to: uniqueEmails(Array.isArray(input.to) ? input.to : []),
    cc: uniqueEmails(Array.isArray(input.cc) ? input.cc : []),
    bcc: uniqueEmails(Array.isArray(input.bcc) ? input.bcc : []),
    subject: typeof input.subject === "string" ? input.subject.trim() : "",
    body: typeof input.body === "string" ? input.body : "",
    attachments: normalizeAttachments(input.attachments ?? []),
    createdAt: isValidDate(input.createdAt) ? String(input.createdAt) : now,
    sentAt: isValidDate(input.sentAt) ? String(input.sentAt) : null,
    scheduledAt: isValidDate(input.scheduledAt) ? String(input.scheduledAt) : null,
    status:
      input.status === "draft" || input.status === "sent" || input.status === "scheduled"
        ? input.status
        : "draft",
  };
}

function areComposerStatesEqual(a: EmailComposerState, b: EmailComposerState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function useSendEmail(
  options: UseSendEmailOptions = {}
): UseSendEmailResult {
  const {
    draftStorageKey = DEFAULT_DRAFT_STORAGE_KEY,
    sentStorageKey = DEFAULT_SENT_STORAGE_KEY,
    autoLoadDraft = false,
    initialState,
  } = options;

  const defaultComposer = useMemo(
    () => getDefaultComposerState(initialState),
    [initialState]
  );

  const [composer, setComposer] = useState<EmailComposerState>(defaultComposer);
  const [drafts, setDrafts] = useState<SentEmailRecord[]>([]);
  const [sentEmails, setSentEmails] = useState<SentEmailRecord[]>([]);
  const [status, setStatus] = useState<EmailSendStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawDrafts = window.localStorage.getItem(draftStorageKey);
      const rawSent = window.localStorage.getItem(sentStorageKey);

      const parsedDrafts = rawDrafts
        ? (JSON.parse(rawDrafts) as Partial<SentEmailRecord>[])
        : [];

      const parsedSent = rawSent
        ? (JSON.parse(rawSent) as Partial<SentEmailRecord>[])
        : [];

      const normalizedDrafts = parsedDrafts.map(normalizeDraftRecord);
      const normalizedSent = parsedSent.map(normalizeDraftRecord);

      setDrafts(normalizedDrafts);
      setSentEmails(normalizedSent);

      if (autoLoadDraft && normalizedDrafts.length > 0) {
        const latestDraft = [...normalizedDrafts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        setComposer({
          conversationId: latestDraft.conversationId,
          leadId: latestDraft.leadId,
          contactId: latestDraft.contactId,
          to: latestDraft.to,
          cc: latestDraft.cc,
          bcc: latestDraft.bcc,
          subject: latestDraft.subject,
          body: latestDraft.body,
          attachments: latestDraft.attachments,
          scheduledAt: latestDraft.scheduledAt ?? null,
        });
      }
    } catch {
      setDrafts([]);
      setSentEmails([]);
    }
  }, [draftStorageKey, sentStorageKey, autoLoadDraft]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(draftStorageKey, JSON.stringify(drafts));
    } catch {
      // ignore storage issues
    }
  }, [draftStorageKey, drafts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(sentStorageKey, JSON.stringify(sentEmails));
    } catch {
      // ignore storage issues
    }
  }, [sentStorageKey, sentEmails]);

  const isDirty = useMemo(() => {
    return !areComposerStatesEqual(composer, defaultComposer);
  }, [composer, defaultComposer]);

  const validateEmail = (): EmailValidationResult => {
    const errors: EmailValidationResult["errors"] = {};

    if (!composer.to.length) {
      errors.to = "At least one recipient is required.";
    } else if (composer.to.some((email) => !isValidEmail(email))) {
      errors.to = "One or more To email addresses are invalid.";
    }

    if (composer.cc.some((email) => !isValidEmail(email))) {
      errors.cc = "One or more CC email addresses are invalid.";
    }

    if (composer.bcc.some((email) => !isValidEmail(email))) {
      errors.bcc = "One or more BCC email addresses are invalid.";
    }

    if (!composer.subject.trim()) {
      errors.subject = "Email subject is required.";
    }

    if (!composer.body.trim()) {
      errors.body = "Email body is required.";
    }

    if (
      composer.scheduledAt &&
      (!isValidDate(composer.scheduledAt) ||
        new Date(composer.scheduledAt).getTime() <= Date.now())
    ) {
      errors.scheduledAt = "Scheduled time must be a valid future date.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const resetComposer = () => {
    setComposer(getDefaultComposerState(initialState));
    setStatus("idle");
    setErrorMessage(null);
  };

  const loadComposer = (value: Partial<EmailComposerState>) => {
    setComposer((current) => ({
      ...current,
      conversationId: value.conversationId ?? current.conversationId,
      leadId: value.leadId ?? current.leadId,
      contactId: value.contactId ?? current.contactId,
      to: value.to ? uniqueEmails(value.to) : current.to,
      cc: value.cc ? uniqueEmails(value.cc) : current.cc,
      bcc: value.bcc ? uniqueEmails(value.bcc) : current.bcc,
      subject: typeof value.subject === "string" ? value.subject : current.subject,
      body: typeof value.body === "string" ? value.body : current.body,
      attachments: value.attachments
        ? normalizeAttachments(value.attachments)
        : current.attachments,
      scheduledAt:
        value.scheduledAt !== undefined
          ? isValidDate(value.scheduledAt)
            ? value.scheduledAt
            : null
          : current.scheduledAt,
    }));

    setStatus("idle");
    setErrorMessage(null);
  };

  const upsertDraft = (record: SentEmailRecord): SentEmailRecord => {
    setDrafts((current) => {
      const existingIndex = current.findIndex((item) => item.id === record.id);

      if (existingIndex === -1) {
        return [record, ...current];
      }

      const updated = [...current];
      updated[existingIndex] = record;
      return updated;
    });

    return record;
  };

  const saveDraft = (): SentEmailRecord | null => {
    setStatus("saving-draft");
    setErrorMessage(null);

    try {
      const draft: SentEmailRecord = normalizeDraftRecord({
        id: generateId("draft"),
        conversationId: composer.conversationId,
        leadId: composer.leadId,
        contactId: composer.contactId,
        to: composer.to,
        cc: composer.cc,
        bcc: composer.bcc,
        subject: composer.subject,
        body: composer.body,
        attachments: composer.attachments,
        createdAt: getNowIso(),
        sentAt: null,
        scheduledAt: composer.scheduledAt ?? null,
        status: "draft",
      });

      upsertDraft(draft);
      setStatus("draft-saved");
      return draft;
    } catch {
      setStatus("error");
      setErrorMessage("Failed to save draft.");
      return null;
    }
  };

  const getDraftById = (draftId: string): SentEmailRecord | undefined => {
    return drafts.find((draft) => draft.id === draftId);
  };

  const getSentEmailById = (emailId: string): SentEmailRecord | undefined => {
    return sentEmails.find((email) => email.id === emailId);
  };

  const loadDraftById = (draftId: string): SentEmailRecord | null => {
    const draft = drafts.find((item) => item.id === draftId);

    if (!draft) {
      return null;
    }

    setComposer({
      conversationId: draft.conversationId,
      leadId: draft.leadId,
      contactId: draft.contactId,
      to: draft.to,
      cc: draft.cc,
      bcc: draft.bcc,
      subject: draft.subject,
      body: draft.body,
      attachments: draft.attachments,
      scheduledAt: draft.scheduledAt ?? null,
    });

    setStatus("idle");
    setErrorMessage(null);

    return draft;
  };

  const deleteDraft = (draftId: string) => {
    setDrafts((current) => current.filter((draft) => draft.id !== draftId));
  };

  const sendEmail = async (): Promise<SentEmailRecord | null> => {
    const validation = validateEmail();

    if (!validation.isValid) {
      setStatus("error");
      setErrorMessage(
        validation.errors.to ||
          validation.errors.cc ||
          validation.errors.bcc ||
          validation.errors.subject ||
          validation.errors.body ||
          validation.errors.scheduledAt ||
          "Email validation failed."
      );
      return null;
    }

    setStatus("sending");
    setErrorMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const sentRecord: SentEmailRecord = normalizeDraftRecord({
        id: generateId("sent"),
        conversationId: composer.conversationId,
        leadId: composer.leadId,
        contactId: composer.contactId,
        to: composer.to,
        cc: composer.cc,
        bcc: composer.bcc,
        subject: composer.subject,
        body: composer.body,
        attachments: composer.attachments,
        createdAt: getNowIso(),
        sentAt: getNowIso(),
        scheduledAt: null,
        status: "sent",
      });

      setSentEmails((current) => [sentRecord, ...current]);
      setStatus("sent");
      resetComposer();

      return sentRecord;
    } catch {
      setStatus("error");
      setErrorMessage("Failed to send email.");
      return null;
    }
  };

  const scheduleEmail = async (scheduledAt: string): Promise<SentEmailRecord | null> => {
    const scheduledComposer: EmailComposerState = {
      ...composer,
      scheduledAt,
    };

    const validationErrors: EmailValidationResult["errors"] = {};
    if (!scheduledComposer.to.length) {
      validationErrors.to = "At least one recipient is required.";
    } else if (scheduledComposer.to.some((email) => !isValidEmail(email))) {
      validationErrors.to = "One or more To email addresses are invalid.";
    }

    if (!scheduledComposer.subject.trim()) {
      validationErrors.subject = "Email subject is required.";
    }

    if (!scheduledComposer.body.trim()) {
      validationErrors.body = "Email body is required.";
    }

    if (!isValidDate(scheduledAt) || new Date(scheduledAt).getTime() <= Date.now()) {
      validationErrors.scheduledAt = "Scheduled time must be a valid future date.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setStatus("error");
      setErrorMessage(
        validationErrors.to ||
          validationErrors.subject ||
          validationErrors.body ||
          validationErrors.scheduledAt ||
          "Email schedule validation failed."
      );
      return null;
    }

    setStatus("sending");
    setErrorMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const scheduledRecord: SentEmailRecord = normalizeDraftRecord({
        id: generateId("scheduled"),
        conversationId: composer.conversationId,
        leadId: composer.leadId,
        contactId: composer.contactId,
        to: composer.to,
        cc: composer.cc,
        bcc: composer.bcc,
        subject: composer.subject,
        body: composer.body,
        attachments: composer.attachments,
        createdAt: getNowIso(),
        sentAt: null,
        scheduledAt,
        status: "scheduled",
      });

      setSentEmails((current) => [scheduledRecord, ...current]);
      setStatus("scheduled");
      resetComposer();

      return scheduledRecord;
    } catch {
      setStatus("error");
      setErrorMessage("Failed to schedule email.");
      return null;
    }
  };

  const getEmailsByConversationId = (conversationId: string): SentEmailRecord[] => {
    return [...drafts, ...sentEmails]
      .filter((item) => item.conversationId === conversationId)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  };

  return {
    composer,
    drafts,
    sentEmails,
    status,
    errorMessage,
    isDirty,
    isSending: status === "sending",
    isSavingDraft: status === "saving-draft",

    setConversationId: (value) =>
      setComposer((current) => ({ ...current, conversationId: value })),
    setLeadId: (value) =>
      setComposer((current) => ({ ...current, leadId: value })),
    setContactId: (value) =>
      setComposer((current) => ({ ...current, contactId: value })),
    setTo: (value) =>
      setComposer((current) => ({ ...current, to: uniqueEmails(value) })),
    setCc: (value) =>
      setComposer((current) => ({ ...current, cc: uniqueEmails(value) })),
    setBcc: (value) =>
      setComposer((current) => ({ ...current, bcc: uniqueEmails(value) })),
    setSubject: (value) =>
      setComposer((current) => ({ ...current, subject: value })),
    setBody: (value) =>
      setComposer((current) => ({ ...current, body: value })),
    setScheduledAt: (value) =>
      setComposer((current) => ({
        ...current,
        scheduledAt: isValidDate(value) ? value : null,
      })),

    addRecipient: (type, email) => {
      if (!email.trim()) {
        return;
      }

      setComposer((current) => ({
        ...current,
        [type]: uniqueEmails([...current[type], email]),
      }));
    },

    removeRecipient: (type, email) => {
      const normalized = normalizeEmail(email);

      setComposer((current) => ({
        ...current,
        [type]: current[type].filter((item) => normalizeEmail(item) !== normalized),
      }));
    },

    clearRecipients: (type) => {
      if (!type) {
        setComposer((current) => ({
          ...current,
          to: [],
          cc: [],
          bcc: [],
        }));
        return;
      }

      setComposer((current) => ({
        ...current,
        [type]: [],
      }));
    },

    addAttachment: (attachment) => {
      setComposer((current) => ({
        ...current,
        attachments: [...current.attachments, attachment],
      }));
    },

    removeAttachment: (attachmentId) => {
      setComposer((current) => ({
        ...current,
        attachments: current.attachments.filter(
          (attachment) => attachment.id !== attachmentId
        ),
      }));
    },

    clearAttachments: () => {
      setComposer((current) => ({
        ...current,
        attachments: [],
      }));
    },

    resetComposer,
    loadComposer,
    validateEmail,

    saveDraft,
    loadDraftById,
    deleteDraft,

    sendEmail,
    scheduleEmail,

    getDraftById,
    getSentEmailById,
    getEmailsByConversationId,
  };
}