import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CommunicationChannel =
  | "email"
  | "sms"
  | "whatsapp"
  | "call"
  | "internal-note"
  | "chat"
  | "all";

export type CommunicationFolder =
  | "inbox"
  | "assigned"
  | "unread"
  | "scheduled"
  | "archived"
  | "sent"
  | "drafts"
  | "trash"
  | "all";

export type ConversationStatus =
  | "open"
  | "pending"
  | "resolved"
  | "closed"
  | "spam";

export type MessageDirection = "inbound" | "outbound" | "internal";

export interface ConversationParticipant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  channel: Exclude<CommunicationChannel, "all">;
  direction: MessageDirection;
  subject?: string;
  body: string;
  preview?: string;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  createdBy?: string;
  attachmentsCount?: number;
  status?: "queued" | "sent" | "delivered" | "read" | "failed";
  metadata?: Record<string, unknown>;
}

export interface ConversationSummary {
  id: string;
  leadId?: string;
  contactId?: string;
  title: string;
  subtitle?: string;
  participants: ConversationParticipant[];
  channel: Exclude<CommunicationChannel, "all">;
  folder: Exclude<CommunicationFolder, "all">;
  status: ConversationStatus;
  unreadCount: number;
  lastMessagePreview: string;
  lastMessageAt: string;
  lastMessageDirection?: MessageDirection;
  assignedTo?: string;
  isPinned?: boolean;
  isStarred?: boolean;
  hasAttachments?: boolean;
  tags?: string[];
  priority?: "low" | "medium" | "high";
}

export interface CommunicationDraft {
  id: string;
  conversationId?: string;
  channel: Exclude<CommunicationChannel, "all">;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  body: string;
  updatedAt: string;
}

export interface CommunicationFilters {
  folder: CommunicationFolder;
  channel: CommunicationChannel;
  search: string;
  showUnreadOnly: boolean;
  showAssignedOnly: boolean;
  status?: ConversationStatus | "all";
  tag?: string;
}

export interface CommunicationStoreState {
  conversations: ConversationSummary[];
  selectedConversationId: string | null;
  selectedMessageId: string | null;
  selectedConversationIds: string[];
  messagesByConversationId: Record<string, ConversationMessage[]>;
  draftsByConversationId: Record<string, CommunicationDraft>;
  filters: CommunicationFilters;
  isSidebarCollapsed: boolean;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  error: string | null;

  setConversations: (conversations: ConversationSummary[]) => void;
  upsertConversation: (conversation: ConversationSummary) => void;
  removeConversation: (conversationId: string) => void;

  setSelectedConversationId: (conversationId: string | null) => void;
  setSelectedMessageId: (messageId: string | null) => void;

  setMessages: (
    conversationId: string,
    messages: ConversationMessage[]
  ) => void;
  appendMessage: (
    conversationId: string,
    message: ConversationMessage
  ) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    updates: Partial<ConversationMessage>
  ) => void;
  removeMessage: (conversationId: string, messageId: string) => void;

  setDraft: (draft: CommunicationDraft) => void;
  clearDraft: (conversationId: string) => void;

  setFilters: (filters: Partial<CommunicationFilters>) => void;
  resetFilters: () => void;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  setLoadingConversations: (loading: boolean) => void;
  setLoadingMessages: (loading: boolean) => void;
  setError: (error: string | null) => void;

  toggleConversationSelection: (conversationId: string) => void;
  selectAllVisibleConversations: () => void;
  clearConversationSelection: () => void;

  markConversationAsRead: (conversationId: string) => void;
  markConversationAsUnread: (conversationId: string) => void;
  pinConversation: (conversationId: string, pinned?: boolean) => void;
  starConversation: (conversationId: string, starred?: boolean) => void;
  archiveConversation: (conversationId: string) => void;

  getSelectedConversation: () => ConversationSummary | null;
  getMessagesForSelectedConversation: () => ConversationMessage[];
  getFilteredConversations: () => ConversationSummary[];
}

export const COMMUNICATION_STORE_STORAGE_KEY = "mei-communication-store";

export const getDefaultCommunicationFilters = (): CommunicationFilters => ({
  folder: "inbox",
  channel: "all",
  search: "",
  showUnreadOnly: false,
  showAssignedOnly: false,
  status: "all",
  tag: undefined,
});

const sortConversations = (
  conversations: ConversationSummary[]
): ConversationSummary[] => {
  return [...conversations].sort((a, b) => {
    if ((a.isPinned ?? false) !== (b.isPinned ?? false)) {
      return a.isPinned ? -1 : 1;
    }

    return (
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
  });
};

const sortMessages = (
  messages: ConversationMessage[]
): ConversationMessage[] => {
  return [...messages].sort(
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  );
};

export const useCommunicationStore = create<CommunicationStoreState>()(
  persist(
    (set, get) => ({
      conversations: [],
      selectedConversationId: null,
      selectedMessageId: null,
      selectedConversationIds: [],
      messagesByConversationId: {},
      draftsByConversationId: {},
      filters: getDefaultCommunicationFilters(),
      isSidebarCollapsed: false,
      isLoadingConversations: false,
      isLoadingMessages: false,
      error: null,

      setConversations: (conversations) => {
        set((state) => {
          const sorted = sortConversations(conversations);
          const selectedExists = sorted.some(
            (conversation) => conversation.id === state.selectedConversationId
          );

          return {
            conversations: sorted,
            selectedConversationId: selectedExists
              ? state.selectedConversationId
              : sorted[0]?.id ?? null,
          };
        });
      },

      upsertConversation: (conversation) => {
        set((state) => {
          const exists = state.conversations.some(
            (item) => item.id === conversation.id
          );

          const nextConversations = exists
            ? state.conversations.map((item) =>
                item.id === conversation.id ? conversation : item
              )
            : [conversation, ...state.conversations];

          return {
            conversations: sortConversations(nextConversations),
          };
        });
      },

      removeConversation: (conversationId) => {
        set((state) => {
          const nextConversations = state.conversations.filter(
            (conversation) => conversation.id !== conversationId
          );

          const nextMessages = { ...state.messagesByConversationId };
          delete nextMessages[conversationId];

          const nextDrafts = { ...state.draftsByConversationId };
          delete nextDrafts[conversationId];

          return {
            conversations: nextConversations,
            messagesByConversationId: nextMessages,
            draftsByConversationId: nextDrafts,
            selectedConversationId:
              state.selectedConversationId === conversationId
                ? nextConversations[0]?.id ?? null
                : state.selectedConversationId,
            selectedConversationIds: state.selectedConversationIds.filter(
              (id) => id !== conversationId
            ),
          };
        });
      },

      setSelectedConversationId: (conversationId) => {
        set({
          selectedConversationId: conversationId,
          selectedMessageId: null,
        });
      },

      setSelectedMessageId: (messageId) => {
        set({
          selectedMessageId: messageId,
        });
      },

      setMessages: (conversationId, messages) => {
        set((state) => ({
          messagesByConversationId: {
            ...state.messagesByConversationId,
            [conversationId]: sortMessages(messages),
          },
        }));
      },

      appendMessage: (conversationId, message) => {
        set((state) => {
          const existingMessages =
            state.messagesByConversationId[conversationId] ?? [];

          const nextMessages = sortMessages([...existingMessages, message]);

          const nextConversations = state.conversations.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  lastMessagePreview:
                    message.preview ?? message.body.slice(0, 120),
                  lastMessageAt: message.sentAt,
                  lastMessageDirection: message.direction,
                  unreadCount:
                    message.direction === "inbound"
                      ? conversation.unreadCount + 1
                      : conversation.unreadCount,
                }
              : conversation
          );

          return {
            messagesByConversationId: {
              ...state.messagesByConversationId,
              [conversationId]: nextMessages,
            },
            conversations: sortConversations(nextConversations),
          };
        });
      },

      updateMessage: (conversationId, messageId, updates) => {
        set((state) => ({
          messagesByConversationId: {
            ...state.messagesByConversationId,
            [conversationId]: (state.messagesByConversationId[conversationId] ?? [])
              .map((message) =>
                message.id === messageId
                  ? { ...message, ...updates }
                  : message
              ),
          },
        }));
      },

      removeMessage: (conversationId, messageId) => {
        set((state) => ({
          messagesByConversationId: {
            ...state.messagesByConversationId,
            [conversationId]: (state.messagesByConversationId[conversationId] ?? [])
              .filter((message) => message.id !== messageId),
          },
        }));
      },

      setDraft: (draft) => {
        set((state) => ({
          draftsByConversationId: {
            ...state.draftsByConversationId,
            [draft.conversationId ?? draft.id]: draft,
          },
        }));
      },

      clearDraft: (conversationId) => {
        set((state) => {
          const nextDrafts = { ...state.draftsByConversationId };
          delete nextDrafts[conversationId];

          return {
            draftsByConversationId: nextDrafts,
          };
        });
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...filters,
          },
          selectedConversationIds: [],
        }));
      },

      resetFilters: () => {
        set({
          filters: getDefaultCommunicationFilters(),
          selectedConversationIds: [],
        });
      },

      toggleSidebar: () => {
        set((state) => ({
          isSidebarCollapsed: !state.isSidebarCollapsed,
        }));
      },

      setSidebarCollapsed: (collapsed) => {
        set({
          isSidebarCollapsed: collapsed,
        });
      },

      setLoadingConversations: (loading) => {
        set({
          isLoadingConversations: loading,
        });
      },

      setLoadingMessages: (loading) => {
        set({
          isLoadingMessages: loading,
        });
      },

      setError: (error) => {
        set({
          error,
        });
      },

      toggleConversationSelection: (conversationId) => {
        set((state) => {
          const isSelected = state.selectedConversationIds.includes(
            conversationId
          );

          return {
            selectedConversationIds: isSelected
              ? state.selectedConversationIds.filter((id) => id !== conversationId)
              : [...state.selectedConversationIds, conversationId],
          };
        });
      },

      selectAllVisibleConversations: () => {
        const visibleIds = get()
          .getFilteredConversations()
          .map((conversation) => conversation.id);

        set({
          selectedConversationIds: visibleIds,
        });
      },

      clearConversationSelection: () => {
        set({
          selectedConversationIds: [],
        });
      },

      markConversationAsRead: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, unreadCount: 0 }
              : conversation
          ),
        }));
      },

      markConversationAsUnread: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  unreadCount: Math.max(1, conversation.unreadCount || 0),
                }
              : conversation
          ),
        }));
      },

      pinConversation: (conversationId, pinned = true) => {
        set((state) => ({
          conversations: sortConversations(
            state.conversations.map((conversation) =>
              conversation.id === conversationId
                ? { ...conversation, isPinned: pinned }
                : conversation
            )
          ),
        }));
      },

      starConversation: (conversationId, starred = true) => {
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, isStarred: starred }
              : conversation
          ),
        }));
      },

      archiveConversation: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, folder: "archived" }
              : conversation
          ),
        }));
      },

      getSelectedConversation: () => {
        const { conversations, selectedConversationId } = get();

        return (
          conversations.find(
            (conversation) => conversation.id === selectedConversationId
          ) ?? null
        );
      },

      getMessagesForSelectedConversation: () => {
        const { selectedConversationId, messagesByConversationId } = get();

        if (!selectedConversationId) return [];
        return messagesByConversationId[selectedConversationId] ?? [];
      },

      getFilteredConversations: () => {
        const { conversations, filters } = get();

        return conversations.filter((conversation) => {
          const matchesFolder =
            filters.folder === "all" || conversation.folder === filters.folder;

          const matchesChannel =
            filters.channel === "all" || conversation.channel === filters.channel;

          const matchesUnread =
            !filters.showUnreadOnly || conversation.unreadCount > 0;

          const matchesAssigned =
            !filters.showAssignedOnly || Boolean(conversation.assignedTo);

          const matchesStatus =
            !filters.status ||
            filters.status === "all" ||
            conversation.status === filters.status;

          const matchesTag =
            !filters.tag || (conversation.tags ?? []).includes(filters.tag);

          const searchText = filters.search.trim().toLowerCase();

          const matchesSearch =
            searchText.length === 0 ||
            conversation.title.toLowerCase().includes(searchText) ||
            (conversation.subtitle ?? "").toLowerCase().includes(searchText) ||
            conversation.lastMessagePreview.toLowerCase().includes(searchText) ||
            conversation.participants.some((participant) =>
              participant.name.toLowerCase().includes(searchText)
            );

          return (
            matchesFolder &&
            matchesChannel &&
            matchesUnread &&
            matchesAssigned &&
            matchesStatus &&
            matchesTag &&
            matchesSearch
          );
        });
      },
    }),
    {
      name: COMMUNICATION_STORE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedConversationId: state.selectedConversationId,
        filters: state.filters,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);

export const selectCommunicationFilters = (
  state: CommunicationStoreState
): CommunicationFilters => state.filters;

export const selectFilteredConversations = (
  state: CommunicationStoreState
): ConversationSummary[] => state.getFilteredConversations();

export const selectSelectedConversation = (
  state: CommunicationStoreState
): ConversationSummary | null => state.getSelectedConversation();

export const selectSelectedConversationMessages = (
  state: CommunicationStoreState
): ConversationMessage[] => state.getMessagesForSelectedConversation();

export const selectSelectedConversationIds = (
  state: CommunicationStoreState
): string[] => state.selectedConversationIds;

export default useCommunicationStore;