import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ComposerChannel =
  | "email"
  | "sms"
  | "whatsapp"
  | "internal-note"
  | "chat";

export type ComposerMode = "create" | "reply" | "forward" | "edit-draft";

export interface ComposerAttachment {
  id: string;
  name: string;
  size?: number;
  mimeType?: string;
  url?: string;
  file?: File | null;
  uploadStatus?: "idle" | "uploading" | "uploaded" | "failed";
}

export interface ComposerSchedule {
  enabled: boolean;
  scheduledAt?: string;
  timezone?: string;
}

export interface ComposerTemplateMeta {
  id?: string;
  name?: string;
  category?: string;
}

export interface ComposerStateShape {
  conversationId: string | null;
  leadId: string | null;
  contactId: string | null;
  channel: ComposerChannel;
  mode: ComposerMode;

  to: string[];
  cc: string[];
  bcc: string[];
  phoneNumbers: string[];

  subject: string;
  body: string;

  attachments: ComposerAttachment[];

  schedule: ComposerSchedule;
  template: ComposerTemplateMeta | null;

  replyToMessageId: string | null;
  forwardMessageId: string | null;

  isOpen: boolean;
  isMinimized: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  error: string | null;
  lastSavedAt: string | null;
}

export interface ComposerStoreState extends ComposerStateShape {
  openComposer: (payload?: Partial<ComposerStateShape>) => void;
  closeComposer: () => void;
  minimizeComposer: () => void;
  expandComposer: () => void;

  setChannel: (channel: ComposerChannel) => void;
  setMode: (mode: ComposerMode) => void;

  setConversationContext: (payload: {
    conversationId?: string | null;
    leadId?: string | null;
    contactId?: string | null;
    replyToMessageId?: string | null;
    forwardMessageId?: string | null;
  }) => void;

  setRecipients: (payload: {
    to?: string[];
    cc?: string[];
    bcc?: string[];
    phoneNumbers?: string[];
  }) => void;

  addRecipient: (
    field: "to" | "cc" | "bcc" | "phoneNumbers",
    value: string
  ) => void;

  removeRecipient: (
    field: "to" | "cc" | "bcc" | "phoneNumbers",
    value: string
  ) => void;

  setSubject: (subject: string) => void;
  setBody: (body: string) => void;
  appendBody: (content: string) => void;

  setAttachments: (attachments: ComposerAttachment[]) => void;
  addAttachment: (attachment: ComposerAttachment) => void;
  removeAttachment: (attachmentId: string) => void;
  updateAttachment: (
    attachmentId: string,
    updates: Partial<ComposerAttachment>
  ) => void;

  setSchedule: (schedule: Partial<ComposerSchedule>) => void;
  clearSchedule: () => void;

  applyTemplate: (payload: {
    template: ComposerTemplateMeta;
    subject?: string;
    body?: string;
  }) => void;
  clearTemplate: () => void;

  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  markSaved: () => void;

  patchComposer: (payload: Partial<ComposerStateShape>) => void;
  resetComposer: () => void;
  hydrateComposer: (payload: Partial<ComposerStateShape>) => void;
}

const STORAGE_KEY = "mei-composer-store";

export const getDefaultComposerState = (): ComposerStateShape => ({
  conversationId: null,
  leadId: null,
  contactId: null,
  channel: "email",
  mode: "create",

  to: [],
  cc: [],
  bcc: [],
  phoneNumbers: [],

  subject: "",
  body: "",

  attachments: [],

  schedule: {
    enabled: false,
    scheduledAt: undefined,
    timezone: undefined,
  },
  template: null,

  replyToMessageId: null,
  forwardMessageId: null,

  isOpen: false,
  isMinimized: false,
  isDirty: false,
  isSubmitting: false,
  error: null,
  lastSavedAt: null,
});

const uniqueValues = (values: string[]): string[] => {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
    )
  );
};

const markDirty = (
  state: Partial<ComposerStateShape>
): Partial<ComposerStateShape> => ({
  ...state,
  isDirty: true,
});

export const useComposerStore = create<ComposerStoreState>()(
  persist(
    (set) => ({
      ...getDefaultComposerState(),

      openComposer: (payload) => {
        set((state) => ({
          ...state,
          ...payload,
          isOpen: true,
          isMinimized: false,
          error: null,
        }));
      },

      closeComposer: () => {
        set({
          ...getDefaultComposerState(),
        });
      },

      minimizeComposer: () => {
        set({
          isMinimized: true,
        });
      },

      expandComposer: () => {
        set({
          isMinimized: false,
        });
      },

      setChannel: (channel) => {
        set((state) =>
          markDirty({
            channel,
            error: null,
            phoneNumbers:
              channel === "sms" || channel === "whatsapp"
                ? state.phoneNumbers
                : state.phoneNumbers,
          })
        );
      },

      setMode: (mode) => {
        set(() =>
          markDirty({
            mode,
          })
        );
      },

      setConversationContext: (payload) => {
        set(() =>
          markDirty({
            conversationId: payload.conversationId ?? null,
            leadId: payload.leadId ?? null,
            contactId: payload.contactId ?? null,
            replyToMessageId: payload.replyToMessageId ?? null,
            forwardMessageId: payload.forwardMessageId ?? null,
          })
        );
      },

      setRecipients: (payload) => {
        set(() =>
          markDirty({
            to: payload.to ? uniqueValues(payload.to) : undefined,
            cc: payload.cc ? uniqueValues(payload.cc) : undefined,
            bcc: payload.bcc ? uniqueValues(payload.bcc) : undefined,
            phoneNumbers: payload.phoneNumbers
              ? uniqueValues(payload.phoneNumbers)
              : undefined,
          })
        );
      },

      addRecipient: (field, value) => {
        set((state) => {
          const currentValues = state[field] as string[];

          return markDirty({
            [field]: uniqueValues([...currentValues, value]),
          } as Partial<ComposerStateShape>);
        });
      },

      removeRecipient: (field, value) => {
        set((state) => {
          const currentValues = state[field] as string[];

          return markDirty({
            [field]: currentValues.filter((item) => item !== value),
          } as Partial<ComposerStateShape>);
        });
      },

      setSubject: (subject) => {
        set(() =>
          markDirty({
            subject,
          })
        );
      },

      setBody: (body) => {
        set(() =>
          markDirty({
            body,
          })
        );
      },

      appendBody: (content) => {
        set((state) =>
          markDirty({
            body: `${state.body}${content}`,
          })
        );
      },

      setAttachments: (attachments) => {
        set(() =>
          markDirty({
            attachments,
          })
        );
      },

      addAttachment: (attachment) => {
        set((state) =>
          markDirty({
            attachments: [...state.attachments, attachment],
          })
        );
      },

      removeAttachment: (attachmentId) => {
        set((state) =>
          markDirty({
            attachments: state.attachments.filter(
              (attachment) => attachment.id !== attachmentId
            ),
          })
        );
      },

      updateAttachment: (attachmentId, updates) => {
        set((state) =>
          markDirty({
            attachments: state.attachments.map((attachment) =>
              attachment.id === attachmentId
                ? { ...attachment, ...updates }
                : attachment
            ),
          })
        );
      },

      setSchedule: (schedule) => {
        set((state) =>
          markDirty({
            schedule: {
              ...state.schedule,
              ...schedule,
            },
          })
        );
      },

      clearSchedule: () => {
        set(() =>
          markDirty({
            schedule: {
              enabled: false,
              scheduledAt: undefined,
              timezone: undefined,
            },
          })
        );
      },

      applyTemplate: ({ template, subject, body }) => {
        set((state) =>
          markDirty({
            template,
            subject: subject ?? state.subject,
            body: body ?? state.body,
          })
        );
      },

      clearTemplate: () => {
        set(() =>
          markDirty({
            template: null,
          })
        );
      },

      setSubmitting: (submitting) => {
        set({
          isSubmitting: submitting,
        });
      },

      setError: (error) => {
        set({
          error,
        });
      },

      markSaved: () => {
        set({
          isDirty: false,
          isSubmitting: false,
          error: null,
          lastSavedAt: new Date().toISOString(),
        });
      },

      patchComposer: (payload) => {
        set((state) =>
          markDirty({
            ...state,
            ...payload,
          })
        );
      },

      resetComposer: () => {
        set({
          ...getDefaultComposerState(),
        });
      },

      hydrateComposer: (payload) => {
        set((state) => ({
          ...state,
          ...payload,
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversationId: state.conversationId,
        leadId: state.leadId,
        contactId: state.contactId,
        channel: state.channel,
        mode: state.mode,
        to: state.to,
        cc: state.cc,
        bcc: state.bcc,
        phoneNumbers: state.phoneNumbers,
        subject: state.subject,
        body: state.body,
        schedule: state.schedule,
        template: state.template,
        replyToMessageId: state.replyToMessageId,
        forwardMessageId: state.forwardMessageId,
        isOpen: state.isOpen,
        isMinimized: state.isMinimized,
        isDirty: state.isDirty,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);

export const selectComposerState = (
  state: ComposerStoreState
): ComposerStateShape => ({
  conversationId: state.conversationId,
  leadId: state.leadId,
  contactId: state.contactId,
  channel: state.channel,
  mode: state.mode,
  to: state.to,
  cc: state.cc,
  bcc: state.bcc,
  phoneNumbers: state.phoneNumbers,
  subject: state.subject,
  body: state.body,
  attachments: state.attachments,
  schedule: state.schedule,
  template: state.template,
  replyToMessageId: state.replyToMessageId,
  forwardMessageId: state.forwardMessageId,
  isOpen: state.isOpen,
  isMinimized: state.isMinimized,
  isDirty: state.isDirty,
  isSubmitting: state.isSubmitting,
  error: state.error,
  lastSavedAt: state.lastSavedAt,
});

export const selectComposerRecipients = (state: ComposerStoreState) => ({
  to: state.to,
  cc: state.cc,
  bcc: state.bcc,
  phoneNumbers: state.phoneNumbers,
});

export const selectComposerAttachments = (
  state: ComposerStoreState
): ComposerAttachment[] => state.attachments;

export default useComposerStore;