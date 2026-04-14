// src/hooks/communications/useSendMessage.ts

import { useEffect, useMemo, useState } from "react";

export type MessageChannel = "sms" | "whatsapp" | "internal";
export type MessageSendStatus =
  | "idle"
  | "saving-draft"
  | "draft-saved"
  | "sending"
  | "sent"
  | "scheduled"
  | "error";

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type?: string;
  url?: string;
}

export interface MessageComposerState {
  conversationId?: string;
  leadId?: string;
  contactId?: string;
  channel: MessageChannel;
  recipients: string[];
  message: string;
  attachments: MessageAttachment[];
  scheduledAt?: string | null;
}

export interface MessageRecord {
  id: string;
  conversationId?: string;
  leadId?: string;
  contactId?: string;
  channel: MessageChannel;
  recipients: string[];
  message: string;
  attachments: MessageAttachment[];
  createdAt: string;
  sentAt?: string | null;
  scheduledAt?: string | null;
  status: "draft" | "sent" | "scheduled";
}

export interface MessageValidationResult {
  isValid: boolean;
  errors: {
    channel?: string;
    recipients?: string;
    message?: string;
    scheduledAt?: string;
  };
}

export interface UseSendMessageOptions {
  draftStorageKey?: string;
  sentStorageKey?: string;
  autoLoadDraft?: boolean;
  initialState?: Partial<MessageComposerState>;
}

export interface UseSendMessageResult {
  composer: MessageComposerState;
  drafts: MessageRecord[];
  sentMessages: MessageRecord[];
  status: MessageSendStatus;
  errorMessage: string | null;
  isDirty: boolean;
  isSending: boolean;
  isSavingDraft: boolean;

  setConversationId: (value?: string) => void;
  setLeadId: (value?: string) => void;
  setContactId: (value?: string) => void;
  setChannel: (value: MessageChannel) => void;
  setRecipients: (value: string[]) => void;
  setMessage: (value: string) => void;
  setScheduledAt: (value?: string | null) => void;

  addRecipient: (recipient: string) => void;
  removeRecipient: (recipient: string) => void;
  clearRecipients: () => void;

  addAttachment: (attachment: MessageAttachment) => void;
  removeAttachment: (attachmentId: string) => void;
  clearAttachments: () => void;

  applyTemplateMessage: (message: string) => void;
  appendMessage: (message: string) => void;

  resetComposer: () => void;
  loadComposer: (value: Partial<MessageComposerState>) => void;
  validateMessage: () => MessageValidationResult;

  saveDraft: () => MessageRecord | null;
  loadDraftById: (draftId: string) => MessageRecord | null;
  deleteDraft: (draftId: string) => void;

  sendMessage: () => Promise<MessageRecord | null>;
  scheduleMessage: (scheduledAt: string) => Promise<MessageRecord | null>;

  getDraftById: (draftId: string) => MessageRecord | undefined;
  getSentMessageById: (messageId: string) => MessageRecord | undefined;
  getMessagesByConversationId: (conversationId: string) => MessageRecord[];
}

const DEFAULT_DRAFT_STORAGE_KEY = "mei-crm-message-drafts";
const DEFAULT_SENT_STORAGE_KEY = "mei-crm-message-history";

function getNowIso(): string {
  return new Date().toISOString();
}

function generateId(prefix = "message"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function isValidDate(value?: string | null): boolean {
  if (!value) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}

function normalizeText(value?: string): string {
  return (value ?? "").trim();
}

function normalizeRecipient(value: string): string {
  return value.trim();
}

function uniqueRecipients(values: string[]): string[] {
  return Array.from(
    new Set(values.map(normalizeRecipient).filter(Boolean))
  );
}

function normalizeAttachments(value: unknown): MessageAttachment[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Partial<MessageAttachment> => typeof item === "object" && item !== null)
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

function normalizeChannel(value: unknown): MessageChannel {
  if (value === "sms" || value === "whatsapp" || value === "internal") {
    return value;
  }

  return "whatsapp";
}

function getDefaultComposerState(
  initialState?: Partial<MessageComposerState>
): MessageComposerState {
  return {
    conversationId: initialState?.conversationId,
    leadId: initialState?.leadId,
    contactId: initialState?.contactId,
    channel: normalizeChannel(initialState?.channel),
    recipients: uniqueRecipients(initialState?.recipients ?? []),
    message: initialState?.message ?? "",
    attachments: normalizeAttachments(initialState?.attachments ?? []),
    scheduledAt: isValidDate(initialState?.scheduledAt) ? initialState?.scheduledAt : null,
  };
}

function normalizeMessageRecord(input: Partial<MessageRecord>): MessageRecord {
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
    channel: normalizeChannel(input.channel),
    recipients: uniqueRecipients(Array.isArray(input.recipients) ? input.recipients : []),
    message: typeof input.message === "string" ? input.message : "",
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

function areComposerStatesEqual(a: MessageComposerState, b: MessageComposerState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function useSendMessage(
  options: UseSendMessageOptions = {}
): UseSendMessageResult {
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

  const [composer, setComposer] = useState<MessageComposerState>(defaultComposer);
  const [drafts, setDrafts] = useState<MessageRecord[]>([]);
  const [sentMessages, setSentMessages] = useState<MessageRecord[]>([]);
  const [status, setStatus] = useState<MessageSendStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawDrafts = window.localStorage.getItem(draftStorageKey);
      const rawSent = window.localStorage.getItem(sentStorageKey);

      const parsedDrafts = rawDrafts
        ? (JSON.parse(rawDrafts) as Partial<MessageRecord>[])
        : [];

      const parsedSent = rawSent
        ? (JSON.parse(rawSent) as Partial<MessageRecord>[])
        : [];

      const normalizedDrafts = parsedDrafts.map(normalizeMessageRecord);
      const normalizedSent = parsedSent.map(normalizeMessageRecord);

      setDrafts(normalizedDrafts);
      setSentMessages(normalizedSent);

      if (autoLoadDraft && normalizedDrafts.length > 0) {
        const latestDraft = [...normalizedDrafts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        setComposer({
          conversationId: latestDraft.conversationId,
          leadId: latestDraft.leadId,
          contactId: latestDraft.contactId,
          channel: latestDraft.channel,
          recipients: latestDraft.recipients,
          message: latestDraft.message,
          attachments: latestDraft.attachments,
          scheduledAt: latestDraft.scheduledAt ?? null,
        });
      }
    } catch {
      setDrafts([]);
      setSentMessages([]);
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
      window.localStorage.setItem(sentStorageKey, JSON.stringify(sentMessages));
    } catch {
      // ignore storage issues
    }
  }, [sentStorageKey, sentMessages]);

  const isDirty = useMemo(() => {
    return !areComposerStatesEqual(composer, defaultComposer);
  }, [composer, defaultComposer]);

  const validateMessage = (): MessageValidationResult => {
    const errors: MessageValidationResult["errors"] = {};

    if (!composer.channel) {
      errors.channel = "Message channel is required.";
    }

    if (!composer.recipients.length) {
      errors.recipients = "At least one recipient is required.";
    }

    if (!normalizeText(composer.message)) {
      errors.message = "Message content is required.";
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

  const loadComposer = (value: Partial<MessageComposerState>) => {
    setComposer((current) => ({
      ...current,
      conversationId: value.conversationId ?? current.conversationId,
      leadId: value.leadId ?? current.leadId,
      contactId: value.contactId ?? current.contactId,
      channel: value.channel ? normalizeChannel(value.channel) : current.channel,
      recipients: value.recipients ? uniqueRecipients(value.recipients) : current.recipients,
      message: typeof value.message === "string" ? value.message : current.message,
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

  const upsertDraft = (record: MessageRecord): MessageRecord => {
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

  const saveDraft = (): MessageRecord | null => {
    setStatus("saving-draft");
    setErrorMessage(null);

    try {
      const draft = normalizeMessageRecord({
        id: generateId("draft-message"),
        conversationId: composer.conversationId,
        leadId: composer.leadId,
        contactId: composer.contactId,
        channel: composer.channel,
        recipients: composer.recipients,
        message: composer.message,
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
      setErrorMessage("Failed to save message draft.");
      return null;
    }
  };

  const getDraftById = (draftId: string): MessageRecord | undefined => {
    return drafts.find((draft) => draft.id === draftId);
  };

  const getSentMessageById = (messageId: string): MessageRecord | undefined => {
    return sentMessages.find((message) => message.id === messageId);
  };

  const loadDraftById = (draftId: string): MessageRecord | null => {
    const draft = drafts.find((item) => item.id === draftId);

    if (!draft) {
      return null;
    }

    setComposer({
      conversationId: draft.conversationId,
      leadId: draft.leadId,
      contactId: draft.contactId,
      channel: draft.channel,
      recipients: draft.recipients,
      message: draft.message,
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

  const sendMessage = async (): Promise<MessageRecord | null> => {
    const validation = validateMessage();

    if (!validation.isValid) {
      setStatus("error");
      setErrorMessage(
        validation.errors.channel ||
          validation.errors.recipients ||
          validation.errors.message ||
          validation.errors.scheduledAt ||
          "Message validation failed."
      );
      return null;
    }

    setStatus("sending");
    setErrorMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 450));

      const sentRecord = normalizeMessageRecord({
        id: generateId("sent-message"),
        conversationId: composer.conversationId,
        leadId: composer.leadId,
        contactId: composer.contactId,
        channel: composer.channel,
        recipients: composer.recipients,
        message: composer.message,
        attachments: composer.attachments,
        createdAt: getNowIso(),
        sentAt: getNowIso(),
        scheduledAt: null,
        status: "sent",
      });

      setSentMessages((current) => [sentRecord, ...current]);
      setStatus("sent");
      resetComposer();

      return sentRecord;
    } catch {
      setStatus("error");
      setErrorMessage("Failed to send message.");
      return null;
    }
  };

  const scheduleMessage = async (scheduledAt: string): Promise<MessageRecord | null> => {
    const errors: MessageValidationResult["errors"] = {};

    if (!composer.recipients.length) {
      errors.recipients = "At least one recipient is required.";
    }

    if (!normalizeText(composer.message)) {
      errors.message = "Message content is required.";
    }

    if (!isValidDate(scheduledAt) || new Date(scheduledAt).getTime() <= Date.now()) {
      errors.scheduledAt = "Scheduled time must be a valid future date.";
    }

    if (Object.keys(errors).length > 0) {
      setStatus("error");
      setErrorMessage(
        errors.recipients ||
          errors.message ||
          errors.scheduledAt ||
          "Message schedule validation failed."
      );
      return null;
    }

    setStatus("sending");
    setErrorMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 350));

      const scheduledRecord = normalizeMessageRecord({
        id: generateId("scheduled-message"),
        conversationId: composer.conversationId,
        leadId: composer.leadId,
        contactId: composer.contactId,
        channel: composer.channel,
        recipients: composer.recipients,
        message: composer.message,
        attachments: composer.attachments,
        createdAt: getNowIso(),
        sentAt: null,
        scheduledAt,
        status: "scheduled",
      });

      setSentMessages((current) => [scheduledRecord, ...current]);
      setStatus("scheduled");
      resetComposer();

      return scheduledRecord;
    } catch {
      setStatus("error");
      setErrorMessage("Failed to schedule message.");
      return null;
    }
  };

  const getMessagesByConversationId = (conversationId: string): MessageRecord[] => {
    return [...drafts, ...sentMessages]
      .filter((item) => item.conversationId === conversationId)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  };

  return {
    composer,
    drafts,
    sentMessages,
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
    setChannel: (value) =>
      setComposer((current) => ({ ...current, channel: normalizeChannel(value) })),
    setRecipients: (value) =>
      setComposer((current) => ({ ...current, recipients: uniqueRecipients(value) })),
    setMessage: (value) =>
      setComposer((current) => ({ ...current, message: value })),
    setScheduledAt: (value) =>
      setComposer((current) => ({
        ...current,
        scheduledAt: isValidDate(value) ? value : null,
      })),

    addRecipient: (recipient) => {
      if (!recipient.trim()) {
        return;
      }

      setComposer((current) => ({
        ...current,
        recipients: uniqueRecipients([...current.recipients, recipient]),
      }));
    },

    removeRecipient: (recipient) => {
      const normalized = normalizeRecipient(recipient);

      setComposer((current) => ({
        ...current,
        recipients: current.recipients.filter(
          (item) => normalizeRecipient(item) !== normalized
        ),
      }));
    },

    clearRecipients: () => {
      setComposer((current) => ({
        ...current,
        recipients: [],
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

    applyTemplateMessage: (message) => {
      setComposer((current) => ({
        ...current,
        message,
      }));
    },

    appendMessage: (message) => {
      setComposer((current) => ({
        ...current,
        message: current.message
          ? `${current.message}\n${message}`
          : message,
      }));
    },

    resetComposer,
    loadComposer,
    validateMessage,

    saveDraft,
    loadDraftById,
    deleteDraft,

    sendMessage,
    scheduleMessage,

    getDraftById,
    getSentMessageById,
    getMessagesByConversationId,
  };
}